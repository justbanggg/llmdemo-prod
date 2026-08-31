from flask import request
import time
from ddtrace.llmobs import LLMObs
from ddtrace.llmobs.decorators import workflow
from .config import (
    ai_guard_should_block,
    evaluate_prompt_with_ai_guard,
    langchain_client,
    log,
)
from .evaluation import ctf_judge
from .prompts import langchain_messages_from_rendered, load_managed_prompt, system_content_from_messages


def _is_synthetics_request():
    origin = (request.headers.get("x-datadog-origin") or "").lower()
    if origin == "synthetics":
        return True
    user_agent = request.headers.get("User-Agent") or ""
    return "DatadogSynthetics" in user_agent


def build_user_tags():
    data = request.get_json(silent=True) or {}
    user_name = data.get("user_name", "anonymous")
    return {
        "user_name": user_name,
        "traffic": "synthetics" if _is_synthetics_request() else "user",
    }


@workflow(session_id=lambda: request.remote_addr)
def process_ctf_request(msg):
    # Start timing for root span time_to_first_token metric
    workflow_start_time = time.time()

    user_tags = build_user_tags()

    try:
        prompt, variables, rendered = load_managed_prompt(msg)
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

        messages = langchain_messages_from_rendered(rendered)
        with LLMObs.annotation_context(prompt=prompt.to_annotation_dict(**variables)):
            response = langchain_client.invoke(messages)
        answer = response.content

        evaluation = ctf_judge.evaluate_ctf_response(msg, answer)

        enhanced_tags = {
            **user_tags,
            "llm.processing": "langchain",
            "ctf.evaluation_success": evaluation["success"],
            "ctf.evaluation_confidence": evaluation["confidence"],
            "ctf.evaluation_method": "keyword",
        }
        if guard:
            enhanced_tags["ai_guard.action"] = guard.get("action")
            enhanced_tags["ai_guard.blocked"] = False

        msg_lower = msg.lower()
        if any(term in msg_lower for term in ("chicken", "rice", "laksa", "hawker", "allergy", "poultry")):
            enhanced_tags["llm.relevant"] = "hawker"

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

    except Exception as e:
        log.error(f"LangChain processing error: {e}")
        LLMObs.annotate(tags={**user_tags, "llm.error": "langchain_processing_failed"})
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
