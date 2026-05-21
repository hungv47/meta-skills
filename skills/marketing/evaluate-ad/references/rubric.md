---
type: rubric
schema_version: 1
last_verified: 2026-05-19
verifier: hungv47
revision_status: provisional v0.1
---

# Ad-Eval Rubric (v0.1)

7-dimension rubric for post-launch Meta paid-ad evaluation. Used by `agents/critic-agent.md` to gate the cycle artifact before it writes a ledger row. **Provisional v0.1 — mandatory revision after cycles 2-3 per brief 05 § Rubrics.**

**Pass gate, scoring scale, the < 6 asymmetry, PASS_WITH_CONCERNS, and the universal Hard Fails** are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) [PROCEDURE] § 1–§ 3. This file is the domain instrument — the 7 dimensions below (5 shared + 2 ad-specific) with their domain-specialized band tables and the ad-specific Hard Fails.

## Revision Triggers (brief 05 § Rubric revision trigger)

The universal revision triggers and the mandatory-revision-after-cycles-2-3 rule are in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 5. Domain-specific triggers for the ad-eval rubric:

- Platform behavior changes what is measurable (e.g., Meta deprecates frequency cap visibility, iOS attribution window changes, new ad-format requires new dim)
- A new audience-temp surface appears (e.g., engagement custom audiences become measurable distinct from retargeting + cold)

---

## 1. Loop Fit (0-10)

Does the artifact write inside an existing loop AND evaluate the loop's surface AND the cycle's declared audience-temp?

| Band | Description |
|------|-------------|
| 9-10 | `.forsvn/loops/[slug]/program.md` + `context.md` present and read; cycle artifact correctly scoped to the loop's primary metric and the operator-declared audience-temp; cycle number resolves from `last results.tsv cycle + 1`; no scope drift outside loop boundary |
| 7-8 | Loop present and scope clean; cycle number correctly resolved; minor read-order skip (e.g., didn't surface latest learnings.md) but no contamination |
| 5-6 | Loop present but read-order incomplete; cycle scoped correctly to loop but audience-temp validation skipped or implicit |
| 3-4 | Loop missing context.md OR cycle artifact scope drifted into adjacent loop's surface; audience-temp tag absent from cycle |
| 0-2 | No existing loop OR cycle artifact writes to wrong loop directory OR cycle audience-temp contradicts program.md scope |

**Auto-fail conditions:**

- No `.forsvn/loops/[slug]/program.md` (Critic Hard Fail #1)
- No audience-temp tag on the cycle (Critic Hard Fail #3)

---

## 2. Metric Integrity (0-10)

Is the primary metric, value, baseline, window, source, spend, and unit-comparability explicit and falsifiable?

| Band | Description |
|------|-------------|
| 9-10 | Primary metric named with units; current value + baseline value in same units; measurement window has start + end dates + N days; source named (Meta Ads Manager / Supermetrics / Triple Whale / Northbeam / operator-supplied); spend window stated; frequency_at_close stated; conversion count + CPA stated when defined in program.md |
| 7-8 | All primary fields present; one secondary field missing or implicit (e.g., spend window present but ad-group breakdown omitted) |
| 5-6 | Primary metric + value + baseline present but window or source partially specified; unit comparability not explicit |
| 3-4 | Missing baseline OR missing window OR missing source — and the cycle still claimed `keep` |
| 0-2 | Fabricated values OR units don't match (CTR as percent vs decimal mixed) OR no source at all |

**Auto-fail conditions:**

- No current primary metric value, source, or measurement window (Critic Hard Fail #2)
- Any fabricated number (Critic Hard Fail #6)

---

## 3. Attribution Honesty (0-10)

Are sample size, comparability, guardrails, confounders, iOS-ATT, and attribution-window caveats stated without overclaiming?

| Band | Description |
|------|-------------|
| 9-10 | Sample size or impressions stated; baseline comparability explicit (same audience-temp / same offer / comparable spend window); confounders enumerated (iOS attribution gap, mid-flight creative change, audience-size expansion, optimizer learning phase, seasonality, LP outage, pixel-event misfire, concurrent campaign cannibalization); attribution window (1d-click / 7d-click / view-through) named; confidence label matches evidence quality |
| 7-8 | Most attribution caveats present; one material confounder missing (e.g., didn't flag concurrent campaign launch); confidence well-calibrated |
| 5-6 | Attribution caveats present but confidence label inflated (claimed `high` on a ≤$50 spend window) |
| 3-4 | Major attribution gap unaddressed (iOS ATT not flagged AND ROAS claim made) OR confidence drastically inflated |
| 0-2 | Improvement claimed without any baseline comparability check OR confidence claimed `high` on uncalibrated source (operator-supplied screenshot summary with no source-system attribution) |

**Auto-fail conditions:**

- Claimed improvement without baseline OR baseline from a different audience-temp (Critic Hard Fail #5)
- Spend window below confidence floor (< $50 per ad-group or impressions < ~10k) AND status = `keep` (Critic Hard Fail #11)

---

## 4. Decision Discipline (0-10)

Does the keep/discard/watch/blocked verdict follow Recommendation's Decision Rules — driven by the metric packet, not the diagnosis story?

| Band | Description |
|------|-------------|
| 9-10 | Verdict matches Metric Ingest's packet (improved + comparable + guardrails passing + confidence ≥ medium → `keep`); routing is to the smallest correct next skill at the right granularity (component, not campaign); decision sentence is one sentence and includes the audience-temp |
| 7-8 | Verdict matches packet; routing is correct but slightly over-broad (recommended write-ad rewrite when only hook needed refresh) |
| 5-6 | Verdict matches packet but decision sentence is multi-sentence or omits audience-temp; routing is correct domain but wrong specificity |
| 3-4 | Verdict drifts from packet (Diagnosis story compelling → claimed `keep` despite Metric Ingest's `not_comparable` baseline); OR routing is to a non-existent / inappropriate skill |
| 0-2 | Verdict invents data (claimed `keep` with no improvement signal) OR routing is to "everything" (rewrite-the-campaign maximalism) |

**Auto-fail conditions:**

- Status outside `{keep, discard, watch, blocked}` (Critic Hard Fail #7)

---

## 5. Audience-Temp Fidelity (0-10)

Was the cycle's declared audience-temp validated against the source ad-copy artifact AND the metric source's actual audience? Was contamination caught rather than smoothed?

| Band | Description |
|------|-------------|
| 9-10 | Declared audience-temp matches source ad-copy artifact's audience-temp; metric source's actual audience (from Ads Manager source field) matches declared temp; framing in the creative aligns with the temp (cold = problem-aware curiosity; retargeting = urgency + objection-handling); one cycle = one temp; no mixed-audience signal present |
| 7-8 | Declared temp matches source; metrics' audience matches; minor framing mismatch noted as confounder (not smoothed) |
| 5-6 | Declared temp matches but metric ingest had borderline contamination (lookalike-1% slice borderline-cold) — surfaced and explained |
| 3-4 | Audience-temp framing mismatch (cold copy ran on retargeting audience) — flagged but cycle didn't BLOCK |
| 0-2 | Mixed-audience metrics blended into one cycle OR declared temp directly contradicts source ad-copy artifact OR temp absent from ledger description |

**Auto-fail conditions:**

- Missing audience-temp tag OR declared temp doesn't match source ad-copy artifact (Critic Hard Fail #3)
- Mixed-audience metric ingest with no clean split (Critic Hard Fail #4)
- Ledger description missing the audience-temp tag (Critic Hard Fail #8)

---

## 6. Creative-Fatigue Awareness (0-10)

Were fatigue signals checked against program.md guardrails with falsifiable inputs? Is the rotation decision named at component granularity?

| Band | Description |
|------|-------------|
| 9-10 | frequency_at_close vs guardrail threshold reported; CTR slope across window computed (or explicitly N/A with reason); negative-feedback rate noted when available; fatigue determination has ≥ 2 falsifiable inputs; rotation decision names the specific component to refresh (hook / hero / offer / none-stable) |
| 7-8 | Frequency + one other signal checked; rotation decision is component-level but slightly vague |
| 5-6 | Frequency checked but no slope analysis or negative-feedback proxy; rotation decision is campaign-level (rewrite everything) when component-level would suffice |
| 3-4 | Frequency reported but not compared to guardrail OR fatigue determination is theater (asserted without falsifiable evidence) |
| 0-2 | No fatigue signals surfaced at all OR fatigue claimed without frequency_at_close or CTR-slope evidence |

**Auto-fail conditions:**

- Fatigue determination made without surfacing frequency_at_close or CTR-slope evidence (Critic Hard Fail #12)

---

## 7. Ledger Correctness (0-10)

Exactly one valid `results.tsv` row, schema-compliant, audience-temp tagged?

| Band | Description |
|------|-------------|
| 9-10 | Exactly one row appended via `append-loop-result.ts`; 8 columns; status ∈ `{keep, discard, watch, blocked}`; description one sentence with no tabs; description includes audience-temp tag; artifact path relative to loop folder |
| 7-8 | One row appended; schema-compliant; description has audience-temp but slightly verbose |
| 5-6 | One row appended but description missing audience-temp explicitly (implicit only) |
| 3-4 | Row schema drift (extra column, tab in description, status off-spec) |
| 0-2 | Multiple rows appended OR row appended despite critic FAIL OR row contains fabricated value |

**Auto-fail conditions:**

- Ledger row status outside `keep | discard | watch | blocked` (Critic Hard Fail #7)
- Ledger description missing audience-temp tag (Critic Hard Fail #8)
- Multiple rows appended for one cycle

---

## Falsifiability summary

A dim score is only valid if the evaluator can name **what evidence would have moved the score one band** — the discipline is canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 6. Per-dimension examples for this rubric:

- Loop Fit 8 → 9: surface latest learnings.md in the read-order log.
- Metric Integrity 7 → 9: add spend-window breakdown + attribution window.
- Attribution Honesty 6 → 8: flag the iOS-ATT confounder explicitly.
- Decision Discipline 6 → 8: tighten routing from "write-ad rewrite" to "write-ad hook-only refresh".
- Audience-Temp Fidelity 7 → 9: confirm metric source's actual audience matches declared temp via Ads Manager source field.
- Creative-Fatigue Awareness 6 → 8: compute CTR slope across the window in addition to frequency.
- Ledger Correctness 8 → 10: include audience-temp tag verbatim in description.

If you can't name the next-band evidence, you're scoring vibes, not the rubric.

## Score justification format

For each per-dim score in the Critic Verdict, include 1 sentence of rationale tied to the artifact's actual content (the requirement + the "scoreless verdict = Hard Fail" rule are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 7). Example:

```
- loop_fit: 9 — program.md + context.md + results.tsv all read; cycle scoped to cold-traffic temp matching program.md
- metric_integrity: 7 — primary metric + baseline + window present; spend-window breakdown by ad-group omitted
- attribution_honesty: 8 — iOS-ATT confounder named, sample size flagged; one minor confounder (concurrent campaign launch) not surfaced
- decision_discipline: 9 — verdict matches packet; routing to write-ad with hook-only scope is correctly narrow
- audience_temp_fidelity: 10 — declared cold-traffic; source ad-copy artifact cold-traffic; metrics' lookalike-2% source confirmed cold scope
- creative_fatigue_awareness: 8 — frequency_at_close + CTR-slope both reported; negative-feedback proxy N/A (not available from Ads Manager export); rotation decision is hook-only
- ledger_correctness: 10 — one row appended; description "cold-traffic ROAS 2.4× over 14d — keep hook+offer, refresh hero per fatigue"; audience-temp in description; 8 columns clean
```

Scoreless verdicts (PASS without per-dim breakdown) are themselves a Hard Fail signal — the rubric exists to make the verdict falsifiable.
