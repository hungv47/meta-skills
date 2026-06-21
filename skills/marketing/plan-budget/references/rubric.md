---
type: rubric
schema_version: 1
last_verified: 2026-06-21
verifier: hungv47
---

# Budget-Allocation Rubric (v0.1)

7-dimension rubric for a paid-budget allocation. Used by `agents/critic.md` to score one allocation across the selected channel set.

**Pass gate:** total ≥ 49/70 AND every per-dim score ≥ 6.

Any single per-dim score < 6 = FAIL even if total ≥ 49. Total 49-55 with all per-dim floors met = PASS as `DONE_WITH_CONCERNS`.

---

## 1. Input integrity (0-10)

Is every CAC and LTV in the math sourced, and is every unsourced channel correctly handled?

| Band | Description |
|------|-------------|
| 9-10 | Every allocation-lane channel's CAC + LTV traces to a named source (measure-results `.forsvn/performance/*.tsv` with row count, operator-supplied + labeled, or a cited external benchmark). Every unsourced channel is a capped hypothesis lane with a promotion trigger. Stale CACs (>90d) flagged. |
| 7-8 | All sourced, but one source label is thin (operator-supplied without the measurement basis) or one staleness flag is implicit. |
| 5-6 | One channel's CAC is a cited external benchmark used as if it were own-account data (no "benchmark, not yours" caveat); recoverable with a caveat. |
| 3-4 | One allocation-lane channel's CAC is unsourced (no source maps) but small in the split. |
| 0-2 | An allocation is backed by an invented CAC, or an unsourced channel got a number-backed allocation instead of a hypothesis lane. |

**Auto-fail conditions:**
- ANY allocation-lane channel backed by a CAC with no traceable source (fabrication — Gate 1).
- A stale CAC (>90 days) used in the math with no staleness flag.
- An external benchmark presented as the operator's own measured CAC.

---

## 2. Marginal-return soundness (0-10)

Is the split driven by each channel's *next-dollar* (marginal) CAC, with the equalize-marginal-return logic visible?

| Band | Description |
|------|-------------|
| 9-10 | Every dollar amount traces to a marginal-return reason. Marginal CAC (not average) is computed per channel at the proposed spend; the equalize-marginal-return target is visible; floors are documented where they break equalization. |
| 7-8 | Marginal-return reasoning present and correct, but one channel's amount reads as judgment rather than a derived next-dollar figure. |
| 5-6 | Marginal reasoning present for the top channels; the smaller channels are allocated by feel with a thin rationale. |
| 3-4 | The split is justified mostly by average CAC; marginal reasoning is named but not actually applied. |
| 0-2 | Even split with no reason, OR allocation driven entirely by average CAC. |

**Auto-fail conditions:**
- Even-split-without-reason (equal dollars across channels with no marginal-return justification).
- Allocation justified by average CAC alone with no marginal computation.

---

## 3. Diminishing-returns respect (0-10)

Do channels past their saturation knee receive less, with the knee identified?

| Band | Description |
|------|-------------|
| 9-10 | Each channel's curve position (below / at / past the knee) is stated with the saturation signal cited (rising CAC, falling delivery, or the model default). Past-knee channels are throttled; below-knee channels with cheap marginal CAC absorb more. |
| 7-8 | Curve positions identified; one channel's knee is asserted without a cited signal. |
| 5-6 | Saturation is acknowledged qualitatively but not tied to a specific knee or signal per channel. |
| 3-4 | One saturated channel is over-funded because its average CAC looked cheap. |
| 0-2 | No diminishing-returns reasoning; budget poured into the cheapest-average channel regardless of saturation. |

**Auto-fail conditions:**
- Over-funding a channel known to be past its saturation knee because its average CAC is low.

---

## 4. Floor + veto compliance (0-10)

Are min-viable floors honored and is no channel funded against a fired §0 veto?

| Band | Description |
|------|-------------|
| 9-10 | Every non-zero allocation is at or above its channel's min-viable floor (floor or zero, never a sliver). No selected channel's §0 veto fires unaddressed; any override carries an explicit reason. |
| 7-8 | Floors honored; one §0 veto override reason is thin. |
| 5-6 | Floors honored, but a §0 veto that should have been checked is unmentioned (no campaign-plan §0 data loaded — flag, don't silently pass). |
| 3-4 | One non-zero allocation sits below its channel's floor. |
| 0-2 | A sub-floor sliver AND a §0-vetoed channel funded with no override. |

**Auto-fail conditions:**
- A non-zero allocation below a channel's min-viable floor.
- A channel funded despite a fired §0 veto with no override + reason.

---

## 5. Concentration balance (0-10)

Is the top channel within the concentration cap, and is the program not an unhedged single-channel bet?

| Band | Description |
|------|-------------|
| 9-10 | Top channel within the cap (default 50%); concentration risk explicitly reasoned (why this weight is acceptable given the channel's stability + the operator's risk tolerance). |
| 7-8 | Top channel within the cap; the risk is noted but not reasoned. |
| 5-6 | Top channel at the cap edge; no concentration-risk note. |
| 3-4 | Top channel marginally over the cap with no operator-set higher cap. |
| 0-2 | One channel holds the overwhelming majority with no risk acknowledgment and no operator acceptance. |

**Auto-fail conditions:**
- Top channel over the concentration cap with no operator-set higher cap and no override reason.

---

## 6. Reallocation triggers (0-10)

Does every channel carry a falsifiable reallocation trigger, and is the budget-change trigger present?

| Band | Description |
|------|-------------|
| 9-10 | Every channel has a falsifiable trigger (a measured-CAC threshold + a window + the destination of freed/needed budget). Hypothesis lanes have promotion/kill triggers. The budget-event trigger (±20% → re-run) is present. |
| 7-8 | Triggers present and falsifiable, but one lacks the reallocation destination. |
| 5-6 | Triggers present for the major channels; the smaller ones or the budget-event trigger are missing. |
| 3-4 | Triggers are vague ("monitor and adjust") — not falsifiable. |
| 0-2 | No reallocation triggers — a static plan that cannot respond to measured CAC. |

**Auto-fail conditions:**
- No reallocation trigger anywhere (a static allocation with no response rule).

---

## 7. Objective fit (0-10)

Are channels weighted to the stated objective, with the mixed pool-split applied?

| Band | Description |
|------|-------------|
| 9-10 | Channels weighted to the objective: acquisition → LTV:CAC on new logos; retention → marginal return on retained-revenue lift; mixed → budget split into acquisition + retention pools first, equalized within each. The basis is explicit. |
| 7-8 | Objective honored; the return basis for one channel is implicit. |
| 5-6 | Objective named; the weighting roughly follows it but the basis (new-logo vs retained-revenue) is not stated. |
| 3-4 | One channel is weighted against the objective with no flag. |
| 0-2 | Acquisition channels funded against a retention objective (or vice versa) with no acknowledgment; for mixed, no pool split. |

**Auto-fail conditions:**
- An acquisition-only allocation under a retention objective with no flag.
- A `mixed` objective allocated across the merged channel set with no acquisition/retention pool split.

---

## Aggregate Calculation

```
total = sum(7 dim scores)
```

**Verdict:**
- total ≥ 49 AND every per-dim ≥ 6 → **PASS**
- total ≥ 49 AND any per-dim < 6 → **FAIL** (per-dim floor unmet)
- total < 49 → **FAIL** (aggregate threshold unmet)
- 49 ≤ total ≤ 55 AND every per-dim ≥ 6 → PASS as **DONE_WITH_CONCERNS**

**Cycle 3 auto-surface:** if cycle == 3 and the verdict would still be FAIL, return PASS_WITH_CONCERNS with the current scorecard and the auto-surface banner.

---

## Worked Score Example

See `references/examples/plan-budget-walkthrough.md` for a full worked scorecard (the $6,000/mo 4-channel allocation: the shipped allocation scored 60/70 — PASS — plus a cycle-2 FAIL on a fabricated CAC).

---

**Rubric version:** v0.1 (revise after the first 5 real-world allocation invocations).

**Mandatory revision triggers:**
1. Allocations pass the rubric while real measured CAC consistently breaches the planned marginal CAC → re-examine the diminishing-returns model's default knees.
2. Multiple cycle-3 auto-surfaces in succession → re-examine whether the per-dim floor at 6 is too aggressive for v0.1 bands.
3. A platform's economics shift materially (a CAC-floor change on a network) → update the marginal-return model defaults, not the rubric bands.
