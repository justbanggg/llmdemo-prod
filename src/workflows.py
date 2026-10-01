from flask import request
import time
from ddtrace.llmobs import LLMObs
from ddtrace.llmobs.decorators import workflow
from ddtrace.llmobs._constants import SESSION_ID
from ddtrace.trace import tracer
from .config import (
    OPENAI_CHAT_MODEL,
    ai_guard_should_block,
    evaluate_prompt_with_ai_guard,
    log,
    openai_client,
)
from .evaluation import ctf_judge
from .prompts import (
    load_managed_prompt,
    openai_messages_from_rendered,
    system_content_from_messages,
)

try:
    from ddtrace.aiguard import AIGuardAbortError
except Exception:  # pragma: no cover - SDK import path
    class AIGuardAbortError(Exception):
        action = "DENY"
        reason = "AI Guard abort"
        tags = []


def _is_synthetics_request():
    origin = (request.headers.get("x-datadog-origin") or "").lower()
    if origin == "synthetics":
        return True
    user_agent = request.headers.get("User-Agent") or ""
    return "DatadogSynthetics" in user_agent


def build_user_tags():
    data = request.get_json(silent=True) or {}
    user_name = data.get("user_name", "anonymous")
    tags = {
        "user_name": user_name,
        "traffic": "synthetics" if _is_synthetics_request() else "user",
    }
    rum_session = data.get("rum_session_id") or ""
    rum_view = data.get("rum_view_id") or ""
    if rum_session:
        tags["rum.session_id"] = rum_session
    if rum_view:
        tags["rum.view_id"] = rum_view
    return tags


def _tag_llmobs_session():
    """Join LLM Observability to the RUM session when the browser sends one."""
    data = request.get_json(silent=True) or {}
    rum_session = data.get("rum_session_id") or ""
    rum_view = data.get("rum_view_id") or ""
    sid = rum_session or request.remote_addr or "anonymous"
    for span in (tracer.current_span(), tracer.current_root_span()):
        if span is None:
            continue
        span.set_tag(SESSION_ID, sid)
        if rum_session:
            span.set_tag("rum.session_id", rum_session)
        if rum_view:
            span.set_tag("rum.view_id", rum_view)


def process_ctf_request(msg):
    """Finish the workflow span, then flush LLMObs so traces show up immediately."""
    try:
        return _process_ctf_request(msg)
    finally:
        try:
            LLMObs.flush()
        except Exception as exc:
            log.debug("LLMObs flush failed: %s", exc)


@workflow(name="process_ctf_request")
def _process_ctf_request(msg):
    # Start timing for root span time_to_first_token metric
    workflow_start_time = time.time()
    _tag_llmobs_session()

    user_tags = build_user_tags()

    try:
        _, _, rendered = load_managed_prompt(msg)
        guard = evaluate_prompt_with_ai_guard(system_content_from_messages(rendered), msg)

        if ai_guard_should_block(guard):
            reason = guard.get("reason") or "Unsafe prompt"
            tags = guard.get("tags") or []
            categories = ", ".join(tags) if tags else "policy"
            answer = (
                "Datadog AI Guard blocked this prompt. "
                f"Decision: {guard.get('action')}. "
                f"Reason: {reason}."
            )
            evaluation = {
                "success": False,
                "confidence": 1.0,
                "reasoning": f"AI Guard {guard.get('action')}: {reason}",
                "key_phrases": tags,
                "method": "ai_guard",
            }
            time_to_first_token = time.time() - workflow_start_time
            LLMObs.annotate(
                tags={
                    **user_tags,
                    "llm.processing": "ai_guard",
                    "ai_guard.action": guard.get("action"),
                    "ai_guard.blocked": True,
                    "ai_guard.categories": categories,
                    "ctf.challenge_status": "blocked",
                    "ctf.evaluation_success": False,
                    "ctf.evaluation_method": "ai_guard",
                },
                metrics={"time_to_first_token": time_to_first_token},
            )
            log.info("AI Guard blocked prompt action=%s reason=%s", guard.get("action"), reason)
            return {
                "answer": answer,
                "evaluation": evaluation,
                "challenge_completed": False,
                "ai_guard": guard,
            }

        # Pass format() output directly so Prompt Tracking metadata stays on the LLM span.
        messages = (
            rendered
            if not isinstance(rendered, str)
            else openai_messages_from_rendered(rendered)
        )
        response = openai_client.chat.completions.create(
            model=OPENAI_CHAT_MODEL,
            temperature=0,
            max_tokens=200,
            messages=messages,
        )
        answer = response.choices[0].message.content

        evaluation = ctf_judge.evaluate_ctf_response(msg, answer)

        enhanced_tags = {
            **user_tags,
            "llm.processing": "openai",
            "ctf.evaluation_success": evaluation["success"],
            "ctf.evaluation_confidence": evaluation["confidence"],
            "ctf.evaluation_method": "keyword",
        }
        if guard:
            enhanced_tags["ai_guard.action"] = guard.get("action")
            enhanced_tags["ai_guard.blocked"] = False

        msg_lower = msg.lower()
        if any(
            term in msg_lower
            for term in ("tom yum", "tomyum", "ต้มยำ", "pad thai", "ผัดไทย", "shrimp", "กุ้ง", "spicy", "เผ็ด")
        ):
            enhanced_tags["llm.relevant"] = "soi-food"

        if evaluation["success"]:
            enhanced_tags["ctf.challenge_status"] = "completed"
            enhanced_tags["ctf.bypass_method"] = "safety_consideration"
            log.info(f"CTF challenge completed! Reasoning: {evaluation['reasoning']}")
        else:
            enhanced_tags["ctf.challenge_status"] = "failed"
            log.info(f"CTF challenge failed. Reasoning: {evaluation['reasoning']}")

        time_to_first_token = time.time() - workflow_start_time
        LLMObs.annotate(
            tags=enhanced_tags,
            metrics={"time_to_first_token": time_to_first_token}
        )

        return {
            "answer": answer,
            "evaluation": evaluation,
            "challenge_completed": evaluation["success"],
            "ai_guard": guard,
        }

    except AIGuardAbortError as abort:
        reason = getattr(abort, "reason", None) or "Unsafe prompt"
        tags = list(getattr(abort, "tags", None) or [])
        action = str(getattr(abort, "action", None) or "DENY").upper()
        answer = (
            "Datadog AI Guard blocked this prompt. "
            f"Decision: {action}. "
            f"Reason: {reason}."
        )
        evaluation = {
            "success": False,
            "confidence": 1.0,
            "reasoning": f"AI Guard {action}: {reason}",
            "key_phrases": tags,
            "method": "ai_guard",
        }
        LLMObs.annotate(
            tags={
                **user_tags,
                "llm.processing": "ai_guard",
                "ai_guard.action": action,
                "ai_guard.blocked": True,
                "ai_guard.categories": ", ".join(tags) if tags else "policy",
                "ctf.challenge_status": "blocked",
                "ctf.evaluation_success": False,
                "ctf.evaluation_method": "ai_guard",
            }
        )
        log.info("AI Guard abort escaped evaluate action=%s reason=%s", action, reason)
        return {
            "answer": answer,
            "evaluation": evaluation,
            "challenge_completed": False,
            "ai_guard": {"action": action, "reason": reason, "tags": tags},
        }

    except Exception as e:
        log.error(f"OpenAI processing error: {e}")
        LLMObs.annotate(tags={**user_tags, "llm.error": "openai_processing_failed"})
        return {
            "answer": "⚠️ Processing error occurred.",
            "evaluation": {
                "success": False,
                "confidence": 0.0,
                "reasoning": "System error during processing",
                "key_phrases": []
            },
            "challenge_completed": False
        }
