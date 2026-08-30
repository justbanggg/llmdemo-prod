# RUM + Journey Monitoring — SG Hawker Showdown

RUM app ID: `599a68f2-d9b6-4476-af51-3d9b7f44472b`  
Service: `sg-hawker-showdown`  
Dashboard: https://bang.datadoghq.com/dashboard/n4m-52n-kwr

Journey Monitoring is Preview (no create-journey API). Create or edit journeys in **[Digital Experience → Journey Monitoring](https://bang.datadoghq.com/digital-experience/journeys) → New Journey**.

In the start/end pickers, choose **View name** (not URL path). Datadog groups `/quiz/laksa/step-1`…`step-5` as `/quiz/laksa/?`. The browser URL is still `/quiz/laksa/step-N`; `@view.name` is the exact string below. `/game` stays the URL even when the named view is `/game/result/laksa`.

Do **not** use the old overlay names `/game/quiz/...`.

## Datadog UI setup

Frontend application: **SG Hawker Showdown** (`599a68f2-d9b6-4476-af51-3d9b7f44472b`). Frontend RUM `service` and `env` must match the backend: `sg-hawker-showdown` / `sg-production`.

For each journey: name → start event → end event → optional variant → **Save Journey**. Edit existing journeys if they still end on `/game/quiz/...`.

| Journey | Start (picker) | End (picker) | Variant steps (optional) |
| --- | --- | --- | --- |
| Enter the hawker | View `/` | View `/game` | — |
| Win the Guardrail | View `/game` | Action `ctf_challenge_won` | Action `ctf_challenge_attempt` → View `/game/result/laksa` |
| Guardrail held | View `/game` | Action `ctf_challenge_held` | Action `ctf_challenge_attempt` → View `/game/result/chicken-rice` |
| Brew laksa | Action `ctf_challenge_won` | View `/quiz/laksa/complete` | Action `quiz_started` → View `/quiz/laksa/opening` → `/quiz/laksa/step-1` … `step-5` |
| Brew chicken rice | Action `ctf_challenge_held` | View `/quiz/chicken-rice/complete` | Action `quiz_started` → View `/quiz/chicken-rice/opening` → `/quiz/chicken-rice/step-1` … `step-5` |

Brew journeys **chain** off the guardrail journeys: brew start = previous journey end. Do not start brew at `quiz_started` or those tiles float off the map.

Do **not** add the chicken-rice quiz as a second end on **Win the Guardrail**.

After saving, run two sessions: Chicken allergy → laksa quiz, then Start Simple → chicken-rice quiz.

## Journey recipes

A win is always laksa. Chicken rice is the hold path. The map is a **Y**:

```
/  → /game → Win the Guardrail → /quiz/laksa/complete
            → Guardrail held     → /quiz/chicken-rice/complete
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

Filter every query with `@application.id:599a68f2-d9b6-4476-af51-3d9b7f44472b @session.type:user`.

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

```
@ml_app:sg-hawker-showdown @name:process_ctf_request
@ml_app:sg-hawker-showdown @name:process_ctf_request ctf.challenge_status:completed
@ml_app:sg-hawker-showdown @name:process_ctf_request ctf.challenge_status:failed
```
