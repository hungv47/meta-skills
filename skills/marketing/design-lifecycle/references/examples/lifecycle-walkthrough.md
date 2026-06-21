# Worked Example — Onboarding Lifecycle Flow (Route A)

> End-to-end design-lifecycle walkthrough — Pre-Dispatch → Layer 1 (flow-architect) → Layer 2 (copy + measurement) → critic gate (with a cycle-0 FAIL the critic caught) → artifact.

[EXAMPLE] — load on first-time skill-author orientation, or when a reviewer needs to ground-check a dispatch decision. This is the premium-bar artifact: it produces a multi-step trigger→message→timing→branch map with suppression + branch logic + an activation-lift measurement plan that a base model would not volunteer, and it survives the 6-dimension critic. It is not "write a welcome email."

---

## Setup

**Product:** A collaborative async standup tool for engineering teams. $8/user/mo, 14-day trial, self-serve.

**The activation insight (from product-context):** Teams that **share their first standup with at least one teammate within 14 days** retain at 4x the rate of solo trial users. Sharing is the value moment — the tool is worthless single-player.

**Available product events (the inventory the architect can trigger on):** `signup`, `standup_created`, `standup_shared`, `teammate_invited`, `teammate_joined`, `second_session`, `trial_converted`, `unsubscribed`.

**List:** owned, consented (trial signups). Channel: email + one in-app nudge. Voice: BRAND.md exists — anchors: "plain, fast, no fluff; talks like a senior engineer, not a marketer."

---

## Pre-Dispatch

| Dimension | Resolved |
|-----------|----------|
| flow-type | **onboarding** |
| activation-metric | **first standup shared with ≥1 teammate within 14 days of signup** (`standup_shared` where `shared_with_count ≥ 1`, ≤14d) |
| entry-trigger | `signup` |
| product events | the 8 above |
| list-channel | email + in-app |
| voice | BRAND.md |

All three hard blocks resolved. No Cold Start needed. Consent gate: owned trial list — PASS.

---

## Layer 1 — flow-architect

### Activation Anchor
- **Activation metric:** first standup shared with ≥1 teammate within 14 days of signup.
- **Baseline:** unknown — the measurement plan establishes it via holdout.
- **Why:** product-context shows shared-within-14d users retain 4x. The tool's value is multiplayer; a solo user never reaches the aha.

### Flow Map
| Step | Trigger | Delay | Branch | Step intent | Suppression (exit if) |
|------|---------|-------|--------|-------------|------------------------|
| 1 | `signup` | 0h | main | Welcome + the ONE next action: create your first standup | activated · unsubscribed |
| 2 | `signup` + 24h AND NOT `standup_created` | 24h | main | Friction-remove: the 30-second path to a first standup | `standup_created` · activated · unsubscribed |
| 3 | `standup_created` AND NOT `standup_shared` | +2h (in-app), +24h (email) | branch-A | The value is in sharing — invite/share in 10 seconds | activated (`standup_shared`≥1) · unsubscribed |
| 4 | `teammate_invited` AND NOT `teammate_joined` | +48h | branch-A | Nudge the invited teammate is the unlock; resend invite | `teammate_joined` · activated · unsubscribed |
| 5 | day 12, NOT activated, NOT unsubscribed | day 12 | main | Last-chance + human-touch: "want a 10-min setup call?" | activated · unsubscribed · trial_converted |

### Branch Logic
- **branch-A** splits at `standup_created`: a user who created a standup but hasn't shared is at the highest-leverage stall point — they're one action from activation. Steps 3–4 live on this arm and reference the specific behavior. The arm re-merges into the main exit at activation.
- A user who never creates a standup stays on main (steps 1, 2, 5).

### Exit & Suppression Summary
Four standing exits, enforced on every step: **activated** (`standup_shared`≥1 within window) · **converted** (`trial_converted`) · **unsubscribed** · **frequency cap** (≤1 email/24h; the in-app nudge in step 3 doesn't count against the email cap). The activation exit is the headline: no step reaches a user who already shared.

### Change Log
- Anchored every step to the share-within-14d metric (Activation-fit).
- branch-A added because `standup_created`-without-`standup_shared` is the highest-leverage stall — generic re-onboarding would waste it (flow-patterns § Onboarding).
- Flow ends day 12, inside the 14-day window (Timing discipline — no nag past the window).

---

## Layer 2 — copy (excerpt) + measurement

### Step Copy (steps 1 + 3 shown)

**Step 1 — Welcome + first action**
- Channel: email
- Subject / preview: "Your first standup takes 30 seconds" / "Skip the meeting, not the update."
- Body: "You're in. Standups here are async — write once, your team reads on their schedule. Start your first one; it takes about 30 seconds. (You'll want a teammate on it to make it useful — more on that once you've got one going.)"
- CTA: **Create your first standup** → app
- Why it earns the send: hands the user the exact first action + the time cost, in the senior-engineer voice. No fluff.

**Step 3 — Share the value (branch-A)**
- Channel: in-app (+2h) then email (+24h if still unshared)
- Subject / preview: "A standup nobody reads is just a diary" / "Share it in 10 seconds."
- Body: "You wrote a standup — nice. But it only does its job once a teammate sees it. Add one person; they don't even need an account to read it. That's the whole point of the tool."
- CTA: **Share with a teammate** → share modal
- Why it earns the send: references the specific behavior (`standup_created`), names the value gap honestly, one action. Voice = blunt, no exclamation spam.

### Voice Check
Both steps trace to the "plain, fast, no fluff; senior engineer not marketer" anchor — no exclamation pile-ups, no "We're thrilled!", concrete time costs.

### Measurement Plan
- **Primary metric:** activation lift = `share-within-14d rate(flow cohort) − share-within-14d rate(holdout)`.
- **Holdout:** randomized 15% of new signups receive no onboarding flow. Read at ≥400 users/arm (rough floor for a few-point lift; below that, downgrade to directional).
- **Per-step diagnostics:** step 2 completion (`standup_created` rate among non-creators who got it); step 3 share-conversion (`standup_shared` among created-not-shared); step 4 invite-accept (`teammate_joined`).
- **Decision rules:** *Iterate step 3* if share-conversion < 15%. *Kill the flow* if no activation lift over holdout after the window AND ≥400/arm. *Scale* if lift ≥ 5 points holding across 2 cohorts.

---

## Critic — Cycle 0 (FAIL)

The first assembled draft had step 5 fire on a **fixed day-12 timer with no `NOT activated` guard** and the measurement plan reported a **pre/post activation delta with no holdout**.

```
## Verdict: FAIL
### Failures
#### Failure 1
Dimension/Gate: Trigger/Suppression soundness (hard gate — suppression)
Issue: Step 5 fires on "day 12" with no NOT-activated condition — a user who shared on
  day 3 still gets the "want a setup call?" nag on day 12. Suppression missing.
Fix: Add `NOT activated AND NOT unsubscribed AND NOT trial_converted` to step 5's trigger.
Agent to re-dispatch: flow-architect
#### Failure 2
Dimension: Measurability
Issue: Primary metric is a pre/post activation delta presented as the flow's lift — no
  holdout. Confounded by the product's onboarding-UI change shipping the same week.
Fix: Define a randomized holdout; report lift over control, or label the result directional.
Agent to re-dispatch: measurement
### What Passed
Activation-fit (every step traces to the share metric), branch logic (branch-A is the
right stall point), copy voice (clean, on-brand, one CTA each).
```

## Critic — Cycle 1 (PASS)

flow-architect added the step-5 suppression guard; measurement added the 15% holdout and the directional-downgrade fallback. Re-scored:

| Dimension | Score (/7) | Note |
|-----------|-----------|------|
| Activation-fit | 7 | every step traces to share-within-14d |
| Trigger/Suppression soundness | 6 | all steps event/time-gated, four exits present, step-5 guard fixed |
| Timing discipline | 6 | flow ends day 12, inside the 14d window |
| Branch logic | 6 | branch-A is the correct high-leverage stall, re-merges at activation |
| Per-step copy quality | 6 | one CTA each, value-before-ask, on-voice, behavior-referenced |
| Measurability | 6 | activation lift over a 15% holdout + kill/iterate/scale rules + directional fallback |
| **Total** | **37/42** | ≥30 and every dim ≥4 |

Hard gates: suppression present ✓ · no post-activation send ✓ · consented owned list, unsubscribe honored ✓ · activation-lift metric ✓. **Verdict: PASS.**

---

## Why this beats "write a welcome email"

A base model asked for "an onboarding email sequence" produces 4–5 time-spaced emails with no suppression, no branch on the real stall point, a CTA that doesn't track the journey, and "track your open rates" as the measurement. This design instead: anchors every step to a 4x-retention activation event, branches on the highest-leverage observable stall (`standup_created`-not-shared), suppresses on the activation event so it never nags an activated user, and measures **activation lift over a holdout** with explicit kill/iterate/scale rules and an honest small-list fallback. The critic caught a missing suppression guard and a non-causal metric claim — exactly the two defects the discipline exists to prevent.
