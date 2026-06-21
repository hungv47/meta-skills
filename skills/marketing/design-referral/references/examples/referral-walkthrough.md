# Worked Example — Double-Sided Referral Loop (Route A)

> End-to-end design-referral walkthrough — Pre-Dispatch → Layer 1 (loop-architect, K math) → Layer 2 (incentive-economist CPAU + mechanic-copy) → critic gate (with a cycle-0 FAIL the critic caught) → artifact.

[EXAMPLE] — the premium-bar artifact: it produces real loop math (K = i × c from labeled inputs), CAC-bounded incentive economics with a payback horizon, a value-triggered ask, and a named fraud guard — work a base model's "add a $10 referral" answer would not produce — and it survives the 6-dimension critic.

---

## Setup

**Product:** A B2B analytics tool that turns a team's raw data into shareable reports. $12/user/mo, 14-day trial. **Retention evidence:** month-3 logo retention 82%, net revenue retention 110% — healthy, so a loop won't spread churn (precondition PASS).

**Unit economics:** paid CAC (measured, `.forsvn/performance/`) = **$60/activated user**. Gross margin ~85%; marginal cost of a seat ≈ $1.80/mo. Median retention 11 months → LTV ≈ $112 contribution.

**The share moment:** users who **publish their first report** routinely send the link to colleagues outside the workspace — a natural value-realized, externally-visible moment.

**Three loop variants the architect compared** (K × cycle × incentive-cost):

| Variant | i (est) | c (est) | K | cycle | incentive |
|---------|---------|---------|---|-------|-----------|
| A. Collaborative-native (report-share invites viewers in) | 0.9 | 0.10 | 0.090 | ~2 days | $0 |
| B. Double-sided credit (publish → "give a month, get a month") | 0.35 | 0.22 | 0.077 | ~9 days | credit |
| C. Double-sided cash ($20/$20) | 0.40 | 0.25 | 0.100 | ~9 days | cash |

---

## Pre-Dispatch

| Dimension | Resolved |
|-----------|----------|
| retention/PMF | PASS — 82% logo / 110% NRR |
| share moment | **first report published** (externally shared by default) |
| loop-type | **double-sided** chosen (the report-view is read-only — viewers rarely become paying users, so collaborative-native's c is low; the team buyer needs a nudge) |
| unit economics | CAC $60, LTV $112, seat marginal cost $1.80/mo |
| incentive idea | "give a month, get a month" credit |

Hard blocks clear. No-payout gate noted (design only).

---

## Layer 1 — loop-architect

### Loop Type & Trigger
- **Loop type:** double-sided credit.
- **Share trigger:** `report_published` (first report) — the user just produced something they want colleagues to see.
- **Why:** report-publishing is the aha; the user is mid-value and externally-facing. An ask on signup would convert near zero.

### K-Factor Math
- **i (invites per active user):** 0.35 — basis: *analog* (comparable B2B tools see 25–40% of activated users send ≥1 invite when prompted at a value moment; chose mid-band, conservative).
- **c (conversion per invite → activated paying seat):** 0.22 — basis: *analog + estimate* (warm B2B referral invites convert higher than cold; report-recipients are pre-qualified colleagues).
- **K = i × c = 0.35 × 0.22 = 0.077.**
- **Interpretation:** marginal-to-assist band (0.077). Not viral, but on an 85%-margin product with a credit incentive it's a cheap acquisition assist IF the economics clear — that's the economist's call. (Variant C's K=0.10 is barely higher but uses cash — the economist will price it.)

### Cycle Time
- **One cycle:** ~9 days (invite → colleague trials → publishes their own first report → gets prompted). Stated so the loop isn't oversold: K=0.077 at a 9-day cycle is a slow, modest assist — roughly a `1/(1−0.077) ≈ 1.08x` lift on a seeded cohort over many cycles, not a growth engine. Honest framing.

---

## Layer 2 — incentive-economist + mechanic-copy

### Incentive Economics (chose Variant B — credit — over C — cash)

- **Reward:** double-sided, **one month of credit each** (referrer + referee).
- **True cost of the reward:** one month's marginal cost ≈ **$1.80** per side, NOT the $12 face value (credit denominated in our own product).
- **CPAU** = (referrer_reward / c) + referee_reward = ($1.80 / 0.22) + $1.80 = $8.18 + $1.80 = **$9.98**.
- **Verdict:** CPAU $9.98 ≪ CAC-to-beat $60 → the loop is dramatically cheaper acquisition. PASS.
- **Margin check:** CPAU $9.98 vs. LTV contribution $112 → 8.9% of LTV. Comfortable.
- **Payback:** ~1.3 months of the referred seat's $7.50 monthly margin covers the $9.98 reward — well inside the 11-month median retention.
- **Why credit beat cash (Variant C):** Variant C's CPAU = ($20/0.25)+$20 = $100 — *above* the $60 CAC, a loss-making loop despite the marginally higher K. Credit's marginal-cost denomination is what makes the loop pay.

### Abuse-Resistance Note
- **Vector:** self-referral / fake workspaces farming free months.
- **Guard:** credit applies only after the referee's workspace **adds a paid seat** (a verified payment), one reward per distinct payment method, velocity cap of 10 rewarded referrals / referrer / month.

### Mechanic (mechanic-copy)
- **Share prompt (at `report_published`):** "Nice — your first report is live. Send it to a teammate; if their team starts using [tool], you both get a free month." CTA: **Share report + invite**.
- **Invite message:** "[Name] shared a report from [tool] and thinks your team should see it. Start a trial and you both get a free month." (pre-filled, editable).
- **Referee landing:** opens directly on the shared report (the value) with "Your free month is applied when your team adds a seat" — continuous with the invite.
- **Falsifiable mechanic:** "≥35% of users who publish a first report send ≥1 invite; ≥22% of invited workspaces add a paid seat within 30 days → K ≈ 0.077."

---

## Critic — Cycle 0 (FAIL)

The first draft priced the incentive on the **$12 face value** of the free month (CPAU = $12/0.22 + $12 = $66.55, *above* the $60 CAC — but the draft still concluded "the loop pays"), and the K math **asserted K=0.077 without showing i and c separately**.

```
## Verdict: FAIL
### Failures
#### Failure 1
Dimension/Gate: Incentive economics (hard gate — incentive pays)
Issue: CPAU computed on $12 face value = $66.55 > $60 CAC, yet the draft says "the loop
  pays". Either the reward is mispriced (credit's true cost is marginal cost ~$1.80, not
  $12 face) or the loop is loss-making. As written it's a loss claimed as a win.
Fix: Price credit at marginal cost; recompute CPAU; if still ≥ CAC, redesign or kill.
Agent to re-dispatch: incentive-economist
#### Failure 2
Dimension/Gate: Loop-math soundness (hard gate — K computed)
Issue: K=0.077 is stated without the i and c decomposition or their bases.
Fix: Show i, c, each with a labeled basis, then K = i × c.
Agent to re-dispatch: loop-architect
### What Passed
Trigger placement (report_published is a real value moment), fraud guard (paid-seat
gate + velocity cap), referee-landing continuity.
```

## Critic — Cycle 1 (PASS)

economist re-priced credit at marginal cost ($1.80/side → CPAU $9.98); architect decomposed K (i=0.35, c=0.22, each basis-labeled). Re-scored:

| Dimension | Score (/7) | Note |
|-----------|-----------|------|
| Loop-math soundness | 6 | K = 0.35 × 0.22 = 0.077, inputs basis-labeled (analog) |
| Cycle-time realism | 6 | 9-day cycle stated; honest 1.08x lift framing, not "viral" |
| Incentive economics | 7 | CPAU $9.98 ≪ $60 CAC; credit-vs-cash contrast; 1.3-mo payback |
| Trigger placement | 7 | fires at report_published (value-realized, external) |
| Mechanic falsifiability | 6 | one testable i/c claim; copy pulls i and c; landing continuous |
| Fraud/abuse guard | 6 | paid-seat gate + per-method + velocity cap |
| **Total** | **38/42** | ≥30 and every dim ≥4 |

Hard gates: retention evidence ✓ · K computed as i × c ✓ · CPAU < CAC ✓ · no autonomous payout ✓. **Verdict: PASS.**

---

## Why this beats "add a $10 referral program"

The base-model answer ("give $10 per friend") would here have produced a **loss-making** loop (cash CPAU ~$100 > $60 CAC), asserted virality with no K decomposition, likely fired the ask at signup, and ignored fraud entirely. This design instead: confirmed the retention precondition, computed K from labeled inputs (and honestly called it a *modest assist*, not viral), priced the incentive in product credit at marginal cost so CPAU lands at $9.98 vs. a $60 CAC with a 1.3-month payback, fired the ask at the externally-visible value moment, and gated the reward on a verified paid seat. The critic caught the two classic defects — face-value mispricing and an asserted K — which is exactly the discipline this skill exists to enforce.
