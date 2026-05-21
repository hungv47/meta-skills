---
type: rubric
schema_version: 1
last_verified: 2026-05-19
verifier: hungv47
revision_status: provisional v0.1
---

# Content-Eval Rubric (v0.1)

7-dimension rubric for post-publish organic-content evaluation. Used by `agents/critic-agent.md` to gate the cycle artifact before it writes a ledger row. **Provisional v0.1 — mandatory revision after cycles 2-3 per brief 05 § Rubrics.**

**Pass gate, scoring scale, the < 6 asymmetry, PASS_WITH_CONCERNS, and the universal Hard Fails** are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) [PROCEDURE] § 1–§ 3. This file is the domain instrument — the 7 dimensions below (5 shared + 2 content-specific) with their domain-specialized band tables and the content-specific Hard Fails.

## Revision Triggers (brief 05 § Rubric revision trigger)

The universal revision triggers and the mandatory-revision-after-cycles-2-3 rule are in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 5. Domain-specific triggers for the content-eval rubric:

- Platform behavior changes what is measurable (e.g., a platform deprecates save-count visibility, changes the engagement-rate denominator, removes reach)
- A new content surface appears (e.g., a platform adds a long-form text format with new native metrics)

---

## 1. Loop Fit (0-10)

Does the artifact write inside an existing loop AND evaluate the loop's surface AND the cycle's declared primary platform?

| Band | Description |
|------|-------------|
| 9-10 | `.forsvn/loops/[slug]/program.md` + `context.md` present and read; cycle artifact correctly scoped to the loop's primary metric and the operator-declared primary platform; cycle number resolves from `last results.tsv cycle + 1`; no scope drift outside loop boundary |
| 7-8 | Loop present and scope clean; cycle number correctly resolved; minor read-order skip (e.g., didn't surface latest learnings.md) but no contamination |
| 5-6 | Loop present but read-order incomplete; cycle scoped correctly to loop but primary-platform validation skipped or implicit |
| 3-4 | Loop missing context.md OR cycle artifact scope drifted into an adjacent loop's surface; primary-platform tag absent from cycle |
| 0-2 | No existing loop OR cycle artifact writes to wrong loop directory OR cycle's primary platform contradicts program.md scope |

**Auto-fail conditions:**

- No `.forsvn/loops/[slug]/program.md` (Critic Hard Fail #1)
- No primary-platform tag on the cycle (Critic Hard Fail #3)

---

## 2. Metric Integrity (0-10)

Is the primary metric, value, baseline, window, source, reach, and unit-comparability explicit and falsifiable?

| Band | Description |
|------|-------------|
| 9-10 | Primary metric named with units; current value + baseline value in same units; measurement window has start + end dates + N days; source named (native platform analytics / third-party dashboard / operator-supplied); reach/impressions stated; engagement reported as the 4-way breakdown (likes / saves / shares / comments) |
| 7-8 | All primary fields present; one secondary field missing or implicit (e.g., reach present but click-through omitted when not relevant) |
| 5-6 | Primary metric + value + baseline present but window or source partially specified; unit comparability not explicit |
| 3-4 | Missing baseline OR missing window OR missing source — and the cycle still claimed `keep` |
| 0-2 | Fabricated values OR engagement reported as a single blended number with no breakdown OR no source at all |

**Auto-fail conditions:**

- No current primary metric value, source, or measurement window (Critic Hard Fail #2)
- Any fabricated number (Critic Hard Fail #6)

---

## 3. Attribution Honesty (0-10)

Are sample size, comparability, guardrails, and confounders stated without overclaiming?

| Band | Description |
|------|-------------|
| 9-10 | Reach/impressions stated; baseline comparability explicit (same platform / same content type / comparable window); confounders enumerated (algorithm change, posting-time shift, follower-count change, cross-post cannibalization, seasonality, external event, a single viral comment skewing the thread); confidence label matches evidence quality |
| 7-8 | Most attribution caveats present; one material confounder missing (e.g., didn't flag a follower-count jump); confidence well-calibrated |
| 5-6 | Attribution caveats present but confidence label inflated (claimed `high` on a tiny-reach window) |
| 3-4 | Major attribution gap unaddressed (algorithm change not flagged AND improvement claim made) OR confidence drastically inflated |
| 0-2 | Improvement claimed without any baseline comparability check OR confidence claimed `high` on an uncalibrated source (screenshot summary with no metadata) |

**Auto-fail conditions:**

- Claimed improvement without baseline OR baseline from a different platform / content type (Critic Hard Fail #5)
- Reach below the loop's confidence floor AND status = `keep` (Critic Hard Fail #12)

---

## 4. Decision Discipline (0-10)

Does the keep/discard/watch/blocked verdict follow Recommendation's Decision Rules — driven by the metric packet + engagement-quality read, not the diagnosis story?

| Band | Description |
|------|-------------|
| 9-10 | Verdict matches the metric packet + engagement-quality read; routing is to the smallest correct next skill at the right granularity (component, not "the content plan"); decision sentence is one sentence and includes the primary platform |
| 7-8 | Verdict matches packet; routing is correct but slightly over-broad (recommended a full write-social rewrite when only the hook needed a revision) |
| 5-6 | Verdict matches packet but decision sentence is multi-sentence or omits the primary platform; routing is correct domain but wrong specificity |
| 3-4 | Verdict drifts from packet (Diagnosis story compelling → claimed `keep` despite a `not_comparable` baseline) OR routing is to a non-existent / inappropriate skill |
| 0-2 | Verdict invents data (claimed `keep` with no improvement signal) OR routing is to "everything" (redo-the-whole-content-plan maximalism) |

**Auto-fail conditions:**

- Status outside `{keep, discard, watch, blocked}` (Critic Hard Fail #7)

---

## 5. Engagement-Quality Discrimination (0-10)

Was meaningful engagement (saves / shares / comments / click-through / conversion) distinguished from vanity (likes / impressions / views)? Was a vanity spike refused as a success signal?

| Band | Description |
|------|-------------|
| 9-10 | Engagement reported as the 4-way breakdown; meaningful-to-vanity ratio computed; the verdict explicitly rests on meaningful engagement; a vanity-heavy result was named as vanity-heavy and did not earn `keep`; qualitative sentiment, if cited, quotes actual comments |
| 7-8 | Breakdown present + ratio computed; verdict rests on meaningful engagement; minor slip — e.g., a borderline-vanity result not explicitly flagged but the verdict was still correct |
| 5-6 | Breakdown present but the meaningful-vs-vanity read is implicit; the verdict happens to be right but the reasoning leans on a blended number |
| 3-4 | Engagement treated as one blended number; a likes/impressions spike was allowed to read as partial success |
| 0-2 | A `keep` verdict rests on a vanity spike (high likes/impressions, collapsed saves/shares/comments) OR qualitative sentiment was fabricated / inferred from nothing |

**Auto-fail conditions:**

- `keep` verdict resting on a vanity-heavy headline metric (Critic Hard Fail #11)
- Fabricated qualitative-sentiment claim (Critic Hard Fail #6)

---

## 6. Platform-Fit (0-10)

Was the content judged against a platform-appropriate benchmark? Was format-native-to-platform assessed? Did secondary platforms stay as context, out of the verdict?

| Band | Description |
|------|-------------|
| 9-10 | The metric is read against a benchmark appropriate to the primary platform (a 2% engagement rate is strong on LinkedIn, weak on a small IG account — the diagnosis says which); format-native-to-platform assessed (was a carousel right here?); secondary-platform metrics stayed in Cross-Platform Context and never entered the verdict |
| 7-8 | Platform-appropriate benchmark used; format-fit assessed; one minor slip — a secondary-platform observation crept into the diagnosis narrative but not the verdict |
| 5-6 | Benchmark is generic (not platform-specific); format-fit assessed only implicitly |
| 3-4 | Metric read against a cross-platform-generic benchmark; OR a secondary-platform result partly informed the verdict |
| 0-2 | Secondary-platform metrics blended into `current_value` / the verdict (cross-platform contamination) |

**Auto-fail conditions:**

- Secondary-platform metrics blended into the verdict (Critic Hard Fail #4)

---

## 7. Ledger Correctness (0-10)

Exactly one valid `results.tsv` row, schema-compliant, primary-platform tagged?

| Band | Description |
|------|-------------|
| 9-10 | Exactly one row appended via `append-loop-result.ts`; 8 columns; status ∈ `{keep, discard, watch, blocked}`; description one sentence with no tabs; description includes the primary-platform tag; artifact path relative to loop folder |
| 7-8 | One row appended; schema-compliant; description has the primary platform but is slightly verbose |
| 5-6 | One row appended but description missing the primary platform explicitly (implicit only) |
| 3-4 | Row schema drift (extra column, tab in description, status off-spec) |
| 0-2 | Multiple rows appended OR row appended despite critic FAIL OR row contains a fabricated value |

**Auto-fail conditions:**

- Ledger row status outside `keep | discard | watch | blocked` (Critic Hard Fail #7)
- Ledger description missing the primary-platform tag (Critic Hard Fail #8)
- Multiple rows appended for one cycle

---

## Falsifiability summary

A dim score is only valid if the evaluator can name **what evidence would have moved the score one band** — the discipline is canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 6. Per-dimension examples for this rubric:

- Loop Fit 8 → 9: surface latest learnings.md in the read-order log.
- Metric Integrity 7 → 9: add the engagement 4-way breakdown.
- Attribution Honesty 6 → 8: flag the algorithm-change confounder explicitly.
- Decision Discipline 6 → 8: tighten routing from "write-social rewrite" to "write-social hook-only revision".
- Engagement-Quality 7 → 9: compute the meaningful-to-vanity ratio and rest the verdict on it explicitly.
- Platform-Fit 6 → 8: state the platform-specific benchmark the metric is read against.
- Ledger Correctness 8 → 10: include the primary-platform tag verbatim in the description.

If you can't name the next-band evidence, you're scoring vibes, not the rubric.

## Score justification format

For each per-dim score in the Critic Verdict, include 1 sentence of rationale tied to the artifact's actual content (the requirement + the "scoreless verdict = Hard Fail" rule are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 7). Example:

```
- loop_fit: 9 — program.md + context.md + results.tsv all read; cycle scoped to linkedin matching program.md
- metric_integrity: 8 — primary metric + baseline + window + reach present; engagement 4-way breakdown present
- attribution_honesty: 8 — algorithm-change confounder named; one minor confounder (follower jump) not surfaced
- decision_discipline: 9 — verdict matches packet; routing to write-social hook-only revision is correctly narrow
- engagement_quality_discrimination: 9 — meaningful-to-vanity ratio computed; keep rests on save+share rate, not likes
- platform_fit: 8 — engagement rate read against a LinkedIn-specific benchmark; carousel format assessed as native
- ledger_correctness: 10 — one row appended; description includes "linkedin"; 8 columns clean
```

Scoreless verdicts (PASS without per-dim breakdown) are themselves a Hard Fail signal — the rubric exists to make the verdict falsifiable.
