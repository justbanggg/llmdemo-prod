# RUM + Journey Monitoring — SG Hawker Guardrail

RUM app ID: `599a68f2-d9b6-4476-af51-3d9b7f44472b`  
Service: `sg-hawker-guardrail`  
Dashboard: https://bang.datadoghq.com/dashboard/n4m-52n-kwr

Journey Monitoring is Preview (no create-journey API). After demo traffic lands, create journeys in **Digital Experience → Journey Monitoring → New Journey**.

## Journey recipes

Journeys **chain** when the next journey’s start is the previous journey’s end. Brew the Drink floated because it started at `quiz_started`.

A win is always sữa đá. Trứng is the hold path. The map is a **Y**:

```
/game → Win the Guardrail → Brew sữa đá
     → Guardrail held     → Brew trứng
```

Frontend: **sg-hawker-guardrail**. Edit/replace the two existing journeys.

### 1. Win the Guardrail

- Start: view `/game`
- End: action `ctf_challenge_won`
- Variant: `/game` → `ctf_challenge_attempt` → `/game/result/sua-da` → `ctf_challenge_won`

Do **not** add the egg quiz as a second end here, or conversion stops meaning “broke the guardrail.”

### 2. Brew sữa đá (chains off a win)

- Start: action `ctf_challenge_won`
- End: view `/game/quiz/sua-da/complete`
- Variant: `ctf_challenge_won` → `quiz_started` → `/game/quiz/sua-da/opening` → `step-1` … `step-5` → `/game/quiz/sua-da/complete`

### 3. Guardrail held

- Start: view `/game`
- End: action `ctf_challenge_held`
- Variant: `/game` → `ctf_challenge_attempt` → `/game/result/trung` → `ctf_challenge_held`

### 4. Brew trứng (chains off a hold)

- Start: action `ctf_challenge_held`
- End: view `/game/quiz/trung/complete`
- Variant: `ctf_challenge_held` → `quiz_started` → `/game/quiz/trung/opening` → `step-1` … `step-5` → `/game/quiz/trung/complete`

After saving, run two human sessions: Egg Allergy → milk quiz, then Start Simple → egg quiz. On the MAP, **Brew sữa đá** should sit after **Win the Guardrail**, and **Brew trứng** after **Guardrail held**.

Optional: **Enter the cafe** — view `/` → view `/game` — so the Y hangs off session start.

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
3. Click **Start Your Journey**
4. On `/game`, click **Egg Allergy** then **Attempt Challenge**
5. Optionally open the quiz CTA so the journey stays green

Leave RUM collection on if you want Journey Monitoring to see the synthetic path; winner widgets still ignore it. Attach the test to the journey's test suite for uptime.

## Custom RUM events

### Landing

- `demo_entered` — welcome page loaded
- `demo_start_journey` — name submitted (button or Enter). Also `data-dd-action-name="demo_start_journey"` on the CTA.

### Challenge

- `ctf_challenge_attempt` — every submit (`success` true/false, `verdict`)
- `ctf_challenge_won` — additional action when iced milk coffee is recommended (`valid_break`)
- Click on the challenge button uses `data-dd-action-name="attempt_challenge"` (VI/EN-safe)

### Quiz

- `quiz_cta_shown`, `quiz_started`, `quiz_step_answered`, `quiz_completed`
- Views: `/game/quiz/{sua-da|trung}/opening` / `step-1`…`step-5` / `complete`
- After an AI answer: view `/game/result/sua-da` or `/game/result/trung`

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
@ml_app:sg-hawker-guardrail @name:process_ctf_request
@ml_app:sg-hawker-guardrail @name:process_ctf_request ctf.challenge_status:completed
@ml_app:sg-hawker-guardrail @name:process_ctf_request ctf.challenge_status:failed
```
