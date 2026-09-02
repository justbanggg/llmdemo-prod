# RUM + Journey Monitoring — SG Hawker Showdown

Laptop and `sg.dd-demo-sg-llm.com` use the same Datadog identity. Host name may differ; tags must not.

| Surface | Singapore (local and deploy) |
| --- | --- |
| RUM app | **Singapore Hawker Showdown** (`599a68f2-d9b6-4476-af51-3d9b7f44472b`) |
| `service` / `ml_app` | `sg-hawker-showdown` |
| `env` (APM, RUM, Feature Flags) | `sg-production` |
| `version` | `1.0.0` |
| Prompt | `sg-hawker-recommender` deployed to Feature Flags env `sg-production` |
| AI Guard | service `sg-hawker-showdown` |

Do not filter SG on `env:production` or leftover services `hanoi-coffee-guardrail` / `sg-hawker-guardrail`. Vietnam is a separate host (`hanoi-coffee-guardrail-vn` / `vn-production`).

Dashboard: https://bang.datadoghq.com/dashboard/n4m-52n-kwr

Journey Monitoring is Preview (no create-journey API). Create or edit journeys in **[Digital Experience → Journey Monitoring](https://bang.datadoghq.com/digital-experience/journeys) → New Journey**.

In the start/end pickers, choose **View name** (not URL path). Datadog groups `/quiz/laksa/step-1`…`step-5` as `/quiz/laksa/?` — do not pick the grouped `/?` name; it will not match `@view.name`. `/game` stays the URL even when the named view is `/game/result/laksa`.

Do **not** use the old overlay names `/game/quiz/...`.

## Datadog UI setup

Frontend application: **Singapore Hawker Showdown** (`599a68f2-d9b6-4476-af51-3d9b7f44472b`). RUM `service`, `env`, and `version` come from `DD_SERVICE` / `DD_ENV` / `DD_VERSION` and must match the backend: `sg-hawker-showdown` / `sg-production` / `1.0.0`.

[Step 2](https://docs.datadoghq.com/journey_monitoring/#step-2---specify-journey-details) is only: app → name → **start event(s)** → **end event(s)** → Save. The [map](https://docs.datadoghq.com/journey_monitoring/map/) nodes are **pages or journeys**. Two journeys get a connecting line only when they share a **view** (the end of one is the start of the next). Actions do not create map edges. [Variants](https://docs.datadoghq.com/journey_monitoring/details_report/variants/) are a filter on steps *inside* one journey; they never link two journeys.

For each journey: name → one start **View** → one end **View** → optional short variant → **Save Journey**. Edit Win/Brew if they still start or end on `ctf_challenge_won` / `ctf_challenge_held`.

| Journey | Start (View) | End (View) | Variant (optional, keep short) |
| --- | --- | --- | --- |
| Enter the hawker | `/` | `/game` | — |
| Win the Guardrail | `/game` | `/quiz/laksa/opening` | Action `ctf_challenge_won` |
| Guardrail held | `/game` | `/quiz/chicken-rice/opening` | Action `ctf_challenge_held` |
| Brew laksa | `/quiz/laksa/opening` | `/quiz/laksa/complete` | Action `quiz_begin` |
| Brew chicken rice | `/quiz/chicken-rice/opening` | `/quiz/chicken-rice/complete` | Action `quiz_begin` |

If `/quiz/laksa/opening` is missing from the picker, use View `/quiz/laksa` for both Win end and Brew start (same idea for chicken-rice).

Do **not** start Brew on action `ctf_challenge_won`. Do **not** add step-1…step-5 as variant steps (the picker’s `/quiz/laksa/?` does not match). Do **not** add the chicken-rice quiz as a second end on **Win the Guardrail**.

After saving, run two sessions: Chicken allergy → open the laksa quiz, then Start Simple → open the chicken-rice quiz.

## Journey recipes

A win is always laksa. Chicken rice is the hold path. The map is a **Y** of **pages**:

```
/  → /game → /quiz/laksa/opening           → /quiz/laksa/complete
            → /quiz/chicken-rice/opening   → /quiz/chicken-rice/complete
```

If Journey Monitoring is not enabled, request access: https://www.datadoghq.com/product-preview/journey-monitoring/

Dashboard funnels still show conversion without a saved journey.

## Synthetics vs real winners

A **Synthetic browser test** is useful for Journey Monitoring **uptime** (each journey gets a test suite). It should not appear on the showcase winner board.

- Dashboard RUM widgets filter `@session.type:user`.
- The app does not fire `ctf_challenge_won` when it detects Datadog Synthetics (`window._DATADOG_SYNTHETICS` or `DatadogSynthetics` user agent).
- API spans from synthetics are tagged `traffic:synthetics` so LLMObs win widgets can use `-@traffic:synthetics`.

Suggested browser test (Digital Experience → Synthetics → New Test):

1. Go to `/`
2. Type a name (for example `synthetics`)
3. Click **Start your journey**
4. On `/game`, click a chicken-allergy prompt then **Attempt Challenge**
5. Click the brew CTA so the browser navigates to `/quiz/laksa`

Leave RUM collection on if you want Journey Monitoring to see the synthetic path; winner widgets still ignore it. Attach the test to the journey's test suite for uptime.

## Custom RUM events

### Landing

- `demo_entered` — welcome page loaded
- `demo_start_journey` — name submitted (button or Enter). Also `data-dd-action-name="demo_start_journey"` on the CTA.

### Challenge

- `ctf_challenge_attempt` — every submit (`success` true/false, `verdict`)
- `ctf_challenge_won` — additional action when laksa is recommended (`valid_break`)
- Click on the challenge button uses `data-dd-action-name="attempt_challenge"`

### Quiz

- `quiz_cta_shown`, `quiz_started`, `quiz_step_answered`, `quiz_completed`
- Real pages: `/quiz/laksa` and `/quiz/chicken-rice` (full navigation off `/game`)
- Views: `/quiz/{laksa|chicken-rice}/opening` / `step-1`…`step-5` / `complete`
- After an AI answer: view `/game/result/laksa` or `/game/result/chicken-rice`

### Winner action attributes

- `winner`, `challenge_type`, `challenge_name`, `verdict`, `user_message`, `confidence`, `reasoning`, `completion_time`, `session_id`

## Dashboard and Explorer queries

Filter every query with `@application.id:599a68f2-d9b6-4476-af51-3d9b7f44472b @session.type:user env:sg-production`.

### Winners

```
@type:action @action.type:custom @action.name:ctf_challenge_won @session.type:user
```

### Attempts vs wins

```
@type:action @action.type:custom @action.name:ctf_challenge_attempt
```

### Quiz conversion

```
@type:action @action.type:custom @action.name:quiz_started
@type:action @action.type:custom @action.name:quiz_completed
```

### Winners with Session Replay

```
@type:action @action.type:custom @action.name:ctf_challenge_won @session.has_replay:true
```

### User attributes after a win

- `@usr.name`
- `@user.ctf_winner:true`
- `@user.ctf_status:winner`

## LLM Observability

Open **LLM Observability → Traces** (not APM, not Sessions until a real session id is set). Filter:

`@ml_app:sg-hawker-showdown env:sg-production`

Direct: [sg-hawker-showdown traces](https://bang.datadoghq.com/llm/traces?query=%40ml_app%3Asg-hawker-showdown%20env%3Asg-production)

Do not use `hanoi-coffee-guardrail` or `env:production`. Jailbreak traces are workflow-only (no OpenAI child) because AI Guard skips the model — use an allergy prompt to see `OpenAI.createChatCompletion`.

```
@ml_app:sg-hawker-showdown env:sg-production @name:process_ctf_request
@ml_app:sg-hawker-showdown env:sg-production @name:process_ctf_request ctf.challenge_status:completed
@ml_app:sg-hawker-showdown env:sg-production @name:process_ctf_request ctf.challenge_status:failed
@ml_app:sg-hawker-showdown env:sg-production @span_kind:llm
```

### AI Guard

Indexed APM spans (`resource_name:ai_guard`), not the Evaluate HTTP API. Open **Security → AI Guard → Evaluations**, not Signals (signals need a detection rule).

```
service:sg-hawker-showdown env:sg-production operation_name:ai_guard
service:sg-hawker-showdown env:sg-production operation_name:ai_guard @ai_guard.action:(DENY OR ABORT)
service:sg-hawker-showdown env:sg-production operation_name:ai_guard @ai_guard.blocked:true
```
