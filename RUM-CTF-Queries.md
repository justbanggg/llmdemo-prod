# RUM + Journey Monitoring — Bangkok Soi Showdown

Laptop and the Thailand host use the same Datadog identity. Host name may differ; tags must not.

| Surface | Thailand (local and deploy) |
| --- | --- |
| RUM app | **Bangkok Soi Showdown** (`7636915f-0c98-4c3c-804a-cc5ef9caed8d`) |
| `service` / `ml_app` | `bkk-soi-showdown` |
| `env` (APM, RUM, Feature Flags) | `th-production` |
| `version` | `1.0.0` |
| Prompt | `bkk-soi-recommender` deployed to Feature Flags env `th-production` |
| AI Guard | service `bkk-soi-showdown` |

Do not filter TH on Vietnam `hanoi-coffee-guardrail-vn` / `production` or Singapore `sg-hawker-showdown` / `sg-production`. Prompt Management publishes the soi prompt to `th-production`.

Journey Monitoring is Preview (no create-journey API). Create or edit journeys in **[Digital Experience → Journey Monitoring](https://bang.datadoghq.com/digital-experience/journeys) → New Journey**.

In the start/end pickers, choose **View name** (not URL path). Datadog groups `/quiz/pad-thai/step-1`…`step-5` as `/quiz/pad-thai/?` — do not pick the grouped `/?` name; it will not match `@view.name`. `/game` stays the URL even when the named view is `/game/result/pad-thai`.

## Datadog UI setup

RUM `service`, `env`, and `version` come from `DD_SERVICE` / `DD_ENV` / `DD_VERSION` and must match the backend: `bkk-soi-showdown` / `th-production` / `1.0.0`.

For each journey: name → one start **View** → one end **View** → optional short variant → **Save Journey**.

| Journey | Start (View) | End (View) | Variant (optional, keep short) |
| --- | --- | --- | --- |
| Enter the soi | `/` | `/game` | — |
| Win the Guardrail | `/game` | `/quiz/pad-thai/opening` | Action `ctf_challenge_won` |
| Guardrail held | `/game` | `/quiz/tom-yum/opening` | Action `ctf_challenge_held` |
| Cook pad Thai | `/quiz/pad-thai/opening` | `/quiz/pad-thai/complete` | Action `quiz_begin` |
| Cook tom yum | `/quiz/tom-yum/opening` | `/quiz/tom-yum/complete` | Action `quiz_begin` |

If `/quiz/pad-thai/opening` is missing from the picker, use View `/quiz/pad-thai` for both Win end and Cook start (same idea for tom yum).

Do **not** start Cook on action `ctf_challenge_won`. Do **not** add step-1…step-5 as variant steps.

After saving, run two sessions: Shrimp Allergy → open the pad Thai quiz, then Start Simple → open the tom yum quiz.

## Journey recipes

A win is always pad Thai. Tom yum is the hold path. The map is a **Y** of **pages**:

```
/  → /game → /quiz/pad-thai/opening         → /quiz/pad-thai/complete
            → /quiz/tom-yum/opening         → /quiz/tom-yum/complete
```

## Synthetics vs real winners

The app does not fire `ctf_challenge_won` when it detects Datadog Synthetics. API spans from synthetics are tagged `traffic:synthetics`.

Suggested browser test:

1. Go to `/`
2. Type a name (for example `synthetics`)
3. Click **Start your journey** / **เริ่มต้นทริป**
4. On `/game`, click **Shrimp Allergy** then **Attempt Challenge**
5. Click the cook CTA so the browser navigates to `/quiz/pad-thai`

## Custom RUM events

### Landing

- `demo_entered` — welcome page loaded
- `demo_start_journey` — name submitted

### Challenge

- `ctf_challenge_attempt` — every submit
- `ctf_challenge_won` — pad Thai recommended (`valid_break`)
- `ctf_ai_guard_blocked` — jailbreak DENY; the model did not run
- Challenge button uses `data-dd-action-name="attempt_challenge"` (TH/EN-safe)

### Quiz

- `quiz_cta_shown`, `quiz_started`, `quiz_step_answered`, `quiz_completed`
- Real pages: `/quiz/pad-thai` and `/quiz/tom-yum`
- Views: `/quiz/{pad-thai|tom-yum}/opening` / `step-1`…`step-5` / `complete`
- After an AI answer: view `/game/result/pad-thai` or `/game/result/tom-yum`
- After an AI Guard DENY: view `/game/result/ai-guard`

## Dashboard and Explorer queries

Filter with `@session.type:user env:th-production`.

### Winners

```
@type:action @action.type:custom @action.name:ctf_challenge_won @session.type:user
```

### LLM Observability

`@ml_app:bkk-soi-showdown env:th-production`

Jailbreak traces are workflow-only (no OpenAI child) because AI Guard skips the model — use a shrimp-allergy prompt to see `OpenAI.createChatCompletion`.

```
@ml_app:bkk-soi-showdown env:th-production @name:process_ctf_request
@ml_app:bkk-soi-showdown env:th-production @name:process_ctf_request ctf.challenge_status:completed
@ml_app:bkk-soi-showdown env:th-production @span_kind:llm
```

### AI Guard

```
service:bkk-soi-showdown env:th-production operation_name:ai_guard
service:bkk-soi-showdown env:th-production operation_name:ai_guard @ai_guard.blocked:true
```
