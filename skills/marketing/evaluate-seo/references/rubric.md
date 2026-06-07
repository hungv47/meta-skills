---
type: rubric
schema_version: 1
last_verified: 2026-06-01
verifier: hungv47
revision_status: provisional v0.1
---

# SEO/AEO-Eval Rubric (v0.1)

7-dimension rubric for post-change SEO / AEO evaluation. Used by `agents/critic-agent.md` to gate the cycle artifact before it writes a ledger row. **Provisional v0.1 — mandatory revision after cycles 2-3.**

**Pass gate, scoring scale, the < 6 asymmetry, PASS_WITH_CONCERNS, and the universal Hard Fails** are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) [PROCEDURE] § 1–§ 3. This file is the domain instrument — the 7 dimensions below (5 shared + 2 SEO-specific) with their domain-specialized band tables and the SEO-specific Hard Fails.

## Revision Triggers

The universal revision triggers and the mandatory-revision-after-cycles-2-3 rule are in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 5. Domain-specific triggers for the SEO-eval rubric:

- A Google core/algorithm-update cadence change alters what a "safe" lag floor is.
- AI-answer surfaces change which citation signals are measurable (a provider stops exposing citations).

---

## 1. Loop Fit (0-10)

Does the artifact write inside an existing loop AND evaluate the loop's surface AND the cycle's declared keyword cluster + surface?

| Band | Description |
|------|-------------|
| 9-10 | `.forsvn/loops/[slug]/program.md` + `context.md` present and read; cycle scoped to the loop's primary metric and the operator-declared keyword cluster + surface; cycle number resolves from `last results.tsv cycle + 1`; no scope drift |
| 7-8 | Loop present and scope clean; cycle number correct; minor read-order skip but no contamination |
| 5-6 | Loop present but read-order incomplete; cycle scoped correctly but cluster/surface validation implicit |
| 3-4 | Loop missing context.md OR scope drifted to an adjacent cluster; cluster+surface tag absent |
| 0-2 | No existing loop OR cycle writes to wrong loop directory OR the cluster/surface contradicts program.md scope |

**Auto-fail conditions:**

- No `.forsvn/loops/[slug]/program.md` (Critic Hard Fail #1)
- No keyword-cluster+surface tag (Critic Hard Fail #4)

---

## 2. Metric Integrity (0-10)

Is the primary metric, value, baseline, window (vs lag floor), source, visibility breakdown, and unit-comparability explicit and falsifiable?

| Band | Description |
|------|-------------|
| 9-10 | Primary metric named with units; current + baseline in same units; window has start + end + N days AND is checked against the lag floor; source named (GSC / Ahrefs / Semrush / AEO monitor); visibility reported as the meaningful-vs-vanity breakdown (position / clicks / citation vs impressions) |
| 7-8 | All primary fields present; one secondary field implicit |
| 5-6 | Primary metric + value + baseline present but window or source partial; lag-floor check implicit |
| 3-4 | Missing baseline OR window OR source — and the cycle still claimed `keep` |
| 0-2 | Fabricated values OR visibility reported as a single blended number with no breakdown OR no source |

**Auto-fail conditions:**

- No current primary metric value, source, or window (Critic Hard Fail #2)
- Any fabricated number (Critic Hard Fail #6)

---

## 3. Attribution Honesty (0-10)

Are comparability, guardrails, and confounders stated without overclaiming?

| Band | Description |
|------|-------------|
| 9-10 | Baseline comparability explicit (same cluster / same surface / comparable window); confounders enumerated (core/algorithm update with dates, seasonality, cannibalization, indexation change, SERP-feature volatility, AEO churn, GSC data lag); confidence matches evidence |
| 7-8 | Most caveats present; one material confounder missing; confidence well-calibrated |
| 5-6 | Caveats present but confidence inflated (claimed `high` on a core-update window) |
| 3-4 | Major gap unaddressed (core update not flagged AND improvement claimed) OR confidence drastically inflated |
| 0-2 | Improvement claimed without any baseline comparability OR confidence `high` on a core-update-confounded window |

**Auto-fail conditions:**

- Claimed improvement without baseline OR baseline from a different cluster / surface (Critic Hard Fail #10)

---

## 4. Decision Discipline (0-10)

Does the keep/discard/watch/blocked verdict follow Recommendation's Decision Rules — driven by the visibility read + lag/volatility gate, not the diagnosis story?

| Band | Description |
|------|-------------|
| 9-10 | Verdict matches the visibility read + lag/volatility gate; routing is to the smallest correct next skill (optimize-seo on-page target vs write-copy depth vs monitor-aeo) at the right granularity; decision sentence is one sentence with the cluster + surface + window |
| 7-8 | Verdict matches; routing correct but slightly over-broad |
| 5-6 | Verdict matches but decision sentence multi-sentence or omits cluster/surface; routing right domain, wrong specificity |
| 3-4 | Verdict drifts from the read (compelling ranking story → `keep` despite a sub-lag-floor window) OR routing to a non-existent / inappropriate skill |
| 0-2 | Verdict invents data OR routing to "redo the whole SEO strategy" |

**Auto-fail conditions:**

- Status outside `{keep, discard, watch, blocked}` (Critic Hard Fail #7)

---

## 5. Visibility-Signal Discrimination (0-10)

Was meaningful visibility (target-keyword position / organic clicks / AI-citation inclusion / conversions) distinguished from vanity (impressions / keyword-count / indexed pages)? Was a vanity spike refused as success?

| Band | Description |
|------|-------------|
| 9-10 | Visibility reported as the meaningful-vs-vanity breakdown; the verdict rests on position / clicks / citations; an impression spike with flat clicks was named as vanity and did not earn `keep`; click-through quality assessed |
| 7-8 | Breakdown present + read computed; verdict rests on meaningful visibility; minor slip |
| 5-6 | Breakdown present but the meaningful-vs-vanity read is implicit; verdict happens to be right |
| 3-4 | Visibility treated as one blended number; an impression spike read as partial success |
| 0-2 | A `keep` rests on an impression / keyword-count spike with flat clicks and no position/citation gain |

**Auto-fail conditions:**

- `keep` resting on a vanity headline (Critic Hard Fail #11)

---

## 6. Lag & Volatility Discipline (0-10)

Was the window checked against the lag floor? Did a sub-floor window or a core-update confounder cap the verdict? Was SEO/AEO volatility assessed?

| Band | Description |
|------|-------------|
| 9-10 | Window length stated and checked against the loop's lag floor; a sub-floor window or a dominating core-update overlap capped the verdict at watch/blocked; SERP/AEO volatility assessed; the read respects that SEO signals lag |
| 7-8 | Window + floor checked; verdict respects the gate; one minor slip — a borderline-floor window not explicitly flagged but verdict correct |
| 5-6 | Window stated but the lag-floor check or volatility read is implicit |
| 3-4 | Window not checked against a floor; a short-window move was treated as validated |
| 0-2 | A `keep` rests on a sub-lag-floor window OR a core-update-confounded move presented as proof the change worked |

**Auto-fail conditions:**

- `keep` on a sub-lag-floor window or an unaddressed core-update confounder (Critic Hard Fail #12)

---

## 7. Ledger Correctness (0-10)

Exactly one valid `results.tsv` row, schema-compliant, cluster+surface+window tagged?

| Band | Description |
|------|-------------|
| 9-10 | Exactly one row appended via `append-loop-result.ts`; 8 columns; status ∈ `{keep, discard, watch, blocked}`; description one sentence with no tabs; description includes the cluster + surface + window; artifact path relative to loop folder |
| 7-8 | One row appended; schema-compliant; description has the cluster+surface but is slightly verbose |
| 5-6 | One row appended but description missing the cluster+surface+window explicitly (implicit only) |
| 3-4 | Row schema drift (extra column, tab in description, status off-spec) |
| 0-2 | Multiple rows appended OR row appended despite critic FAIL OR row contains a fabricated value |

**Auto-fail conditions:**

- Ledger row status outside `keep | discard | watch | blocked` (Critic Hard Fail #7)
- Ledger description missing the cluster+surface+window tag (Critic Hard Fail #8)
- Multiple rows appended for one cycle

---

## Falsifiability summary

A dim score is only valid if the evaluator can name **what evidence would have moved the score one band** — the discipline is canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 6. Per-dimension examples:

- Loop Fit 8 → 9: surface latest learnings.md in the read-order log.
- Metric Integrity 7 → 9: add the meaningful-vs-vanity visibility breakdown + the lag-floor check.
- Attribution Honesty 6 → 8: flag the core-update overlap explicitly with dates.
- Decision Discipline 6 → 8: tighten routing from "redo the SEO" to "optimize-seo: add FAQ schema to the cluster page".
- Visibility-Signal 7 → 9: compute the position/click read and rest the verdict on it, not impressions.
- Lag & Volatility 6 → 8: state the window vs the 28-day floor and cap a sub-floor move at watch.
- Ledger Correctness 8 → 10: include the cluster + surface + window verbatim in the description.

If you can't name the next-band evidence, you're scoring vibes, not the rubric.

## Score justification format

For each per-dim score in the Critic Verdict, include 1 sentence of rationale tied to the artifact's actual content (the requirement + the "scoreless verdict = Hard Fail" rule are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 7). Example:

```
- loop_fit: 9 — program.md + context.md + results.tsv read; cycle scoped to "ai coding agent" cluster / organic-serp
- metric_integrity: 8 — avg position + baseline + 30-day window (≥28 floor); meaningful-vs-vanity breakdown present
- attribution_honesty: 8 — March core update flagged as overlapping; cannibalization checked; GSC lag noted
- decision_discipline: 9 — verdict matches visibility read + lag gate; routing to optimize-seo internal-links is narrow
- visibility_signal_discrimination: 9 — position +4 with clicks +22%; impression spike named as vanity, excluded
- lag_and_volatility_discipline: 8 — 30-day window meets floor; core-update overlap acknowledged, move predates it
- ledger_correctness: 10 — one row; description includes "ai-coding-agent / organic-serp / 30d"; 8 columns clean
```

Scoreless verdicts (PASS without per-dim breakdown) are themselves a Hard Fail signal — the rubric exists to make the verdict falsifiable.
