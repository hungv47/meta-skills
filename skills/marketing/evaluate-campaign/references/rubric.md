---
type: rubric
schema_version: 1
last_verified: 2026-05-20
verifier: hungv47
revision_status: provisional v0.1
---

# Campaign-Eval Rubric (v0.1)

7-dimension rubric for post-launch multi-channel campaign evaluation. Used by `agents/critic-agent.md` to gate the cycle artifact before it writes a ledger row. **Provisional v0.1 — mandatory revision after cycles 2-3 per brief 05 § Rubrics.**

**Pass gate, scoring scale, the < 6 asymmetry, PASS_WITH_CONCERNS, and the universal Hard Fails** are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) [PROCEDURE] § 1–§ 3. This file is the domain instrument — the 7 dimensions below (5 shared + 2 campaign-specific) with their domain-specialized band tables and the campaign-specific Hard Fails.

## Revision Triggers (brief 05 § Rubric revision trigger)

The universal revision triggers and the mandatory-revision-after-cycles-2-3 rule are in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 5. Domain-specific triggers for the campaign-eval rubric:

- Platform behavior changes what is measurable (e.g., an ad platform deprecates a conversion signal, a privacy change breaks cross-channel attribution)
- A new channel type appears in the campaign mix with metrics the rubric does not anticipate

---

## 1. Loop Fit (0-10)

Does the artifact write inside an existing loop AND evaluate the loop's campaign surface AND cover the whole campaign across all channels?

| Band | Description |
|------|-------------|
| 9-10 | `.forsvn/loops/[slug]/program.md` + `context.md` present and read; cycle artifact correctly scoped to the loop's primary metric and the whole campaign across every channel it ran on; cycle number resolves from `last results.tsv cycle + 1`; no scope drift outside loop boundary |
| 7-8 | Loop present and scope clean; cycle number correctly resolved; minor read-order skip (e.g., didn't surface latest learnings.md) but no contamination |
| 5-6 | Loop present but read-order incomplete; cycle scoped to the campaign but one channel left out of the breakdown |
| 3-4 | Loop missing context.md OR cycle artifact scope drifted into an adjacent loop's surface OR the cycle scored a single asset instead of the campaign aggregate |
| 0-2 | No existing loop OR cycle artifact writes to wrong loop directory OR the cycle's campaign scope contradicts program.md |

**Auto-fail conditions:**

- No `.forsvn/loops/[slug]/program.md` (Critic Hard Fail #1)
- Cycle scoped to a single ad / post / page / video instead of the campaign aggregate (Critic Hard Fail #3)

---

## 2. Metric Integrity (0-10)

Is the primary metric, value, baseline, window, source, total spend, and the per-channel rollup explicit and falsifiable?

| Band | Description |
|------|-------------|
| 9-10 | Primary metric named with units; current value + baseline value in same units; measurement window has start + end dates + N days; source named (CRM / ad-platform dashboard / analytics / operator-supplied); total fully-loaded spend stated; the per-channel rollup table is complete (spend/effort + reach + leads + conversions + revenue per channel) |
| 7-8 | All primary fields present; one secondary field missing or implicit (e.g., revenue present but per-channel revenue split partially estimated and labeled as such) |
| 5-6 | Primary metric + value + baseline present but window, source, or total spend partially specified; per-channel rollup present but one channel's row is incomplete |
| 3-4 | Missing baseline OR missing window OR missing total spend OR the per-channel rollup omits a channel the campaign ran on — and the cycle still claimed `keep` |
| 0-2 | Fabricated values OR no per-channel breakdown at all (campaign reported as one blended number) OR no source |

**Auto-fail conditions:**

- No current primary metric value, source, or measurement window (Critic Hard Fail #2)
- Any fabricated number (Critic Hard Fail #6)

---

## 3. Attribution Honesty (0-10)

Are sample size, comparability, the attribution model, guardrails, and confounders stated without overclaiming?

| Band | Description |
|------|-------------|
| 9-10 | Spend + reach + window stated; baseline comparability explicit (comparable campaign type / comparable channel mix / comparable window); the attribution model in use is named (last-click / multi-touch / data-driven) and its bias acknowledged; confounders enumerated (seasonality, concurrent campaign, channel cannibalization, price/promo change, organic baseline drift, brand-search lift); confidence label matches evidence quality |
| 7-8 | Most attribution caveats present; one material confounder missing (e.g., didn't flag a concurrent promo); confidence well-calibrated |
| 5-6 | Attribution caveats present but the attribution model is not named, OR confidence label inflated (claimed `high` on a single-week window) |
| 3-4 | Major attribution gap unaddressed (last-click bias not flagged AND a channel's lift claimed) OR confidence drastically inflated |
| 0-2 | Improvement claimed without any baseline comparability check OR revenue attributed to the campaign that an organic baseline already explains |

**Auto-fail conditions:**

- Claimed improvement without baseline OR baseline from a non-comparable campaign type / channel mix (Critic Hard Fail #5)
- Spend/sample below the loop's confidence floor AND status = `keep` (Critic Hard Fail #12)

---

## 4. Decision Discipline (0-10)

Does the keep/discard/watch/blocked verdict follow Recommendation's Decision Rules — driven by the metric packet + channel-mix + unit-economics read, not the diagnosis story?

| Band | Description |
|------|-------------|
| 9-10 | Verdict matches the metric packet + channel-mix + unit-economics read; routing is to the smallest correct next skill at the right granularity (a budget reallocation, not "re-plan the whole campaign"); decision sentence is one sentence and names the campaign |
| 7-8 | Verdict matches packet; routing is correct but slightly over-broad (recommended a full plan-campaign rebuild when only one channel needed cutting) |
| 5-6 | Verdict matches packet but decision sentence is multi-sentence or omits the campaign tag; routing is correct domain but wrong specificity |
| 3-4 | Verdict drifts from packet (Diagnosis story compelling → claimed `keep` despite a `not_comparable` baseline) OR routing is to a non-existent / inappropriate skill |
| 0-2 | Verdict invents data (claimed `keep` with no improvement signal) OR routing is to "everything" (re-do-the-whole-campaign maximalism) |

**Auto-fail conditions:**

- Status outside `{keep, discard, watch, blocked}` (Critic Hard Fail #7)

---

## 5. Channel-Mix Discrimination (0-10)

Were channels that drove results separated from channels that rode along? Was every channel that received spend or effort in the breakdown? Was correlation refused as causation?

| Band | Description |
|------|-------------|
| 9-10 | Every channel that received spend/effort appears in the per-channel breakdown table; each channel is classified driver / rider / mixed with evidence; a rider channel (e.g., an existing-list email send to already-warm trial users) is named as a rider and its conversions are NOT counted as campaign-driven net-new; the channel-mix read explicitly informs the verdict |
| 7-8 | Breakdown complete + driver/rider classification present; verdict rests on the driver channels; minor slip — a borderline rider not explicitly flagged but the verdict was still correct |
| 5-6 | Breakdown present but the driver-vs-rider read is implicit; the verdict happens to be right but leans on a blended channel-total |
| 3-4 | A channel that received spend is missing from the breakdown OR a rider channel's conversions were counted toward the campaign verdict without a causation check |
| 0-2 | No per-channel breakdown — the campaign is scored on one blended number; OR a rider channel's borrowed credit produced a `keep` |

**Auto-fail conditions:**

- A rider channel's contribution counted as a campaign-driven result without a causation check (Critic Hard Fail #4)
- A channel that received spend/effort missing from the breakdown (drops to 3-4 or below)

---

## 6. Unit-Economics Discipline (0-10)

Is CAC computed honestly? Is blended CAC kept distinct from paid CAC? Are payback / LTV:CAC / revenue attribution sane and not laundered?

| Band | Description |
|------|-------------|
| 9-10 | CAC computed as fully-loaded cost ÷ net-new customers; blended CAC and paid-only CAC are reported as distinct numbers — never conflated; payback period or LTV:CAC stated against the product's price/margin; revenue attributed to the campaign is net of what an organic baseline already explains; an underwater paid channel is named even when blended CAC looks healthy |
| 7-8 | CAC honest + blended/paid kept distinct; one secondary field implicit (e.g., payback computed but LTV:CAC omitted when not yet measurable) |
| 5-6 | CAC present but blended and paid are reported as one number, OR fully-loaded cost is approximated without saying so |
| 3-4 | CAC computed on media spend only (production/tooling excluded) and presented as fully-loaded, OR blended CAC used to claim `keep` while paid CAC alone is underwater |
| 0-2 | Revenue or CAC fabricated OR an underwater paid channel laundered into a `keep` via the blended number with no paid-CAC line shown |

**Auto-fail conditions:**

- A `keep` verdict resting on blended CAC while paid CAC alone is underwater vs the product's price/payback target (Critic Hard Fail #11)
- Fabricated revenue or CAC (Critic Hard Fail #6)

---

## 7. Ledger Correctness (0-10)

Exactly one valid `results.tsv` row, schema-compliant, campaign-tagged?

| Band | Description |
|------|-------------|
| 9-10 | Exactly one row appended via `append-loop-result.ts`; 8 columns; status ∈ `{keep, discard, watch, blocked}`; description one sentence with no tabs; description includes the campaign tag; artifact path relative to loop folder |
| 7-8 | One row appended; schema-compliant; description has the campaign tag but is slightly verbose |
| 5-6 | One row appended but description missing the campaign tag explicitly (implicit only) |
| 3-4 | Row schema drift (extra column, tab in description, status off-spec) |
| 0-2 | Multiple rows appended OR row appended despite critic FAIL OR row contains a fabricated value |

**Auto-fail conditions:**

- Ledger row status outside `keep | discard | watch | blocked` (Critic Hard Fail #7)
- Ledger description missing the campaign tag (Critic Hard Fail #8)
- Multiple rows appended for one cycle

---

## Falsifiability summary

A dim score is only valid if the evaluator can name **what evidence would have moved the score one band** — the discipline is canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 6. Per-dimension examples for this rubric:

- Loop Fit 8 → 9: surface latest learnings.md in the read-order log.
- Metric Integrity 7 → 9: complete the missing channel's row in the rollup table.
- Attribution Honesty 6 → 8: name the attribution model and flag its last-click bias.
- Decision Discipline 6 → 8: tighten routing from "re-plan the campaign" to "plan-campaign budget-reallocation only".
- Channel-Mix Discrimination 7 → 9: classify the email channel as a rider and remove its conversions from the campaign-driven count.
- Unit-Economics Discipline 6 → 8: split the one blended CAC number into blended CAC and paid-only CAC.
- Ledger Correctness 8 → 10: include the campaign tag verbatim in the description.

If you can't name the next-band evidence, you're scoring vibes, not the rubric.

## Score justification format

For each per-dim score in the Critic Verdict, include 1 sentence of rationale tied to the artifact's actual content (the requirement + the "scoreless verdict = Hard Fail" rule are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 7). Example:

```
- loop_fit: 9 — program.md + context.md + results.tsv all read; cycle scoped to the whole campaign across 4 channels
- metric_integrity: 8 — primary metric + baseline + window + total spend present; per-channel rollup complete for all 4 channels
- attribution_honesty: 8 — last-click model named and its bias flagged; one minor confounder (concurrent brand campaign) noted
- decision_discipline: 9 — verdict matches the packet; routing to plan-campaign budget-reallocation is correctly narrow
- channel_mix_discrimination: 9 — all 4 channels in the breakdown; email classified as a rider and its conversions excluded from net-new
- unit_economics_discipline: 8 — blended CAC and paid CAC reported as distinct numbers; payback period stated against the $19/mo price
- ledger_correctness: 10 — one row appended; description includes the campaign tag; 8 columns clean
```

Scoreless verdicts (PASS without per-dim breakdown) are themselves a Hard Fail signal — the rubric exists to make the verdict falsifiable.
