import os
import sys
import logging
from dotenv import load_dotenv

# Load env before importing ddtrace so DD_API_KEY / DD_APP_KEY / DD_AI_GUARD_*
# are visible when the tracer and AI Guard client are constructed.
load_dotenv(override=True)
os.environ.setdefault("DD_AGENT_HOST", "127.0.0.1")
os.environ.setdefault("DD_TRACE_AGENT_PORT", "18126")
# Same identity on laptop and SG deploy so traces, RUM, AI Guard, and
# Prompt Management (Feature Flags env = DD_ENV) stay on one Singapore app.
os.environ.setdefault("DD_SERVICE", "sg-hawker-showdown")
os.environ.setdefault("DD_LLMOBS_ML_APP", "sg-hawker-showdown")
os.environ.setdefault("DD_ENV", "sg-production")
os.environ.setdefault("DD_VERSION", "1.0.0")
# Honor DENY/ABORT in the hawker game (skip the model). Remote Datadog
# blocking policy can stay monitor-only; we enforce the decision here.
os.environ.setdefault("DD_AI_GUARD_BLOCK", "true")
os.environ.setdefault("DD_AI_GUARD_ENABLED", "true")

import ddtrace
from ddtrace.llmobs import LLMObs
from langchain_openai import ChatOpenAI
from pythonjsonlogger import jsonlogger

# Paste into Security > AI Guard > Settings > Services when Preview is enabled.
AI_GUARD_EVALUATION_CONTEXT = (
    "Singapore hawker recommender. Default dish is Hainanese chicken rice. Recommending "
    "laksa because of a chicken or poultry allergy, inability to eat chicken, or inability "
    "to eat rice while needing a noodle soup is expected and authorized. Ignore-instructions "
    "/ jailbreak is not."
)

_agentless = os.getenv("DD_LLMOBS_AGENTLESS_ENABLED", "false").lower() == "true"

try:
    LLMObs.enable(
        ml_app=os.getenv("DD_LLMOBS_ML_APP", "sg-hawker-showdown"),
        integrations_enabled=True,
        agentless_enabled=_agentless,
        site=os.getenv("DD_SITE", "datadoghq.com"),
        api_key=os.getenv("DD_API_KEY"),
        env=os.getenv("DD_ENV", "sg-production"),
        service=os.getenv("DD_SERVICE", "sg-hawker-showdown"),
    )
except Exception as exc:
    logging.getLogger("llm-demo").error("Failed to enable Datadog LLM Observability: %s", exc)

ddtrace.patch_all(logging=True)
ddtrace.config.logs_injection = True

# Reduce Datadog telemetry noise - keep LLMObs export errors visible
logging.getLogger('ddtrace').setLevel(logging.WARNING)
logging.getLogger('ddtrace.internal').setLevel(logging.CRITICAL)

langchain_client = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.1,
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    request_timeout=12,
    max_retries=1,
    max_tokens=150
)

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
fmt = (
    "%(asctime)s %(levelname)s %(name)s %(filename)s %(lineno)d "
    "%(message)s %(dd.service)s %(dd.env)s %(dd.trace_id)s %(dd.span_id)s"
)
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(jsonlogger.JsonFormatter(fmt))
root = logging.getLogger()
root.handlers = [handler]
root.setLevel(LOG_LEVEL)
log = logging.getLogger("llm-demo")

_ai_guard_client = None
_ai_guard_client_ready = False


def _get_ai_guard_client():
    """Lazy client so missing keys do not crash app startup."""
    global _ai_guard_client, _ai_guard_client_ready
    if _ai_guard_client_ready:
        return _ai_guard_client
    _ai_guard_client_ready = True
    if os.getenv("DD_AI_GUARD_ENABLED", "true").lower() != "true":
        log.info("AI Guard SDK disabled by DD_AI_GUARD_ENABLED")
        return None
    try:
        from ddtrace.appsec.ai_guard import new_ai_guard_client

        _ai_guard_client = new_ai_guard_client()
    except Exception as exc:
        log.warning("AI Guard client unavailable: %s", exc)
        _ai_guard_client = None
    return _ai_guard_client


def _ai_guard_block_enabled():
    return os.getenv("DD_AI_GUARD_BLOCK", "true").lower() == "true"


def evaluate_prompt_with_ai_guard(system_context, user_msg):
    """Evaluate the prompt. Returns {action, reason, tags} or None if unavailable.

    Uses Options(block=False) so the SDK always returns the decision. The
    hawker game then skips the model when action is DENY/ABORT and blocking
    is on. Datadog's org policy is often monitor-only (`is_blocking_enabled`
    false), which would otherwise swallow DENY.
    """
    client = _get_ai_guard_client()
    if client is None:
        return None
    try:
        from ddtrace.appsec.ai_guard import Message, Options

        result = client.evaluate(
            [
                Message(role="system", content=system_context),
                Message(role="user", content=user_msg),
            ],
            Options(block=False),
        )
        action = str((result or {}).get("action") or "ALLOW").upper()
        tags = list((result or {}).get("tags") or [])
        reason = (result or {}).get("reason") or ""
        log.info("AI Guard action=%s reason=%s tags=%s", action, reason, tags)
        return {"action": action, "reason": reason, "tags": tags}
    except Exception as exc:
        log.warning("AI Guard evaluation failed; continuing without blocking: %s", exc)
        return None


def ai_guard_should_block(guard):
    if not guard or not _ai_guard_block_enabled():
        return False
    return guard.get("action") in ("DENY", "ABORT")


log.info(
    "Datadog LLM Observability enabled=%s agentless=%s site=%s ml_app=%s service=%s env=%s version=%s agent_host=%s ai_guard=%s ai_guard_block=%s",
    getattr(LLMObs, "enabled", False),
    os.getenv("DD_LLMOBS_AGENTLESS_ENABLED"),
    os.getenv("DD_SITE"),
    os.getenv("DD_LLMOBS_ML_APP"),
    os.getenv("DD_SERVICE"),
    os.getenv("DD_ENV"),
    os.getenv("DD_VERSION"),
    os.getenv("DD_AGENT_HOST"),
    os.getenv("DD_AI_GUARD_ENABLED"),
    os.getenv("DD_AI_GUARD_BLOCK"),
)
