---
title: SEO/AEO-Eval Playbook
lifecycle: canonical
status: stable
load_class: PLAYBOOK
---

# SEO/AEO-Eval Playbook

> Why this skill exists, philosophy, methodology, when NOT to use, history. Cited from SKILL.md's introduction. Stable reference — update only when philosophy or methodology genuinely shifts.

## Why this skill exists

The SEO loop was one of the three partial loops named in CLOSED-LOOP.md §5: `optimize-seo` runs the audit and applies fixes, `monitor-aeo` tracks AI-answer citations — both **measure**, but neither **scores a cycle**. There was no surface that took a deployed change, read the ranking/visibility delta over a lag-respecting window, decided keep/discard/watch, and routed the next keyword target. `evaluate-seo` is that scorer.

`evaluate-seo` exists to:

1. **Close the optimize-seo → ranking-delta → next-target loop.** Every cycle reads the source change's hypothesis (on-page edit, internal links, schema, content refresh, technical fix, or AEO target) and scores against real ranking/click/citation data.
2. **Refuse vanity visibility as success.** Impressions, total indexed pages, and keyword-count are easy to grow and mean little. evaluate-seo scores meaningful visibility (target-keyword position, organic clicks, AI-citation inclusion, conversions) and names an impression spike for what it is.
3. **Respect the lag.** SEO and AEO signals lag and churn. A 5-day ranking jump after an edit is noise, not a validated win — and a move during a Google core update is confounded. The lag-and-volatility gate caps such cycles at `watch`. This is the discipline that makes SEO eval different from a fast-feedback channel like ads.
4. **Promote durable lessons to learnings.md.** Conservatively — keyword/surface-scoped, high-confidence, and explicitly expiring at the next core update.

## Philosophy

### Measurement over heuristics

A "best-practice SEO audit" of a page ("the title could target the keyword better") is `optimize-seo`'s job, and it is fiction as an *evaluation* without ranking data. evaluate-seo refuses to score a cycle when measurement evidence is missing — return BLOCKED, not a heuristic verdict.

### Vanity is the enemy

The most common SEO-eval failure is letting an impression rise read as success. Impressions grow when a page surfaces for more (often irrelevant) queries or catches a low-value SERP feature; they do not mean the target keyword moved or that anyone clicked. evaluate-seo always splits visibility into meaningful (position, clicks, citations, conversions) vs vanity (impressions, keyword-count, indexed pages) and rests the verdict on the meaningful half. A 10× impression rise with flat clicks did not work.

### The lag gate is non-negotiable

SEO and AEO are slow, noisy channels. Rankings fluctuate day to day; a content change takes weeks to settle; Google core updates reshuffle the SERP independent of anything you did. A verdict on a 3-to-7-day window is reading noise. evaluate-seo enforces a minimum measurement window (the loop's lag floor, default ≥28 days for a ranking trend) and refuses `keep` below it — a sub-floor or core-update-confounded move ships as `watch`, to be re-measured after it settles.

### Causal humility

Diagnosis names plausible drivers tied to evidence. Confounders (core/algorithm update, seasonality, keyword cannibalization, indexation change, SERP-feature volatility, AEO answer churn) are surfaced, not smoothed. A ranking move during a core update is confounded, full stop.

### One keyword cluster + surface per cycle

Organic SERP and AI answers are different surfaces with different signals; different keyword clusters compete under different intent. evaluate-seo scopes each cycle to one cluster + surface and reads the metric against that. Secondary clusters/surfaces appear as Cross-Surface Context — context only, never the verdict.

### Lane discipline

Running the audit + applying fixes is `optimize-seo`'s lane. Tracking AI-answer citations live is `monitor-aeo`'s. Organic-post engagement is `evaluate-content`'s. evaluate-seo owns scoring the visibility delta of a deployed change. When the work is an audit, citation tracking, or a different surface, route — do not score it here.

### The rubric is provisional

v0.1. Mandatory revision after cycles 2-3. The 7 dimensions (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Visibility-Signal Discrimination / Lag & Volatility Discipline / Ledger Correctness) are a starting calibration. Operator overrides on the same dim > 3 times triggers revision.

## Methodology

### 4-agent dispatch (mirrors evaluate-content / evaluate-ad)

- **Layer 1 (parallel):** Metric Ingest + Diagnosis. Metric Ingest normalizes ranking/visibility data into a packet (meaningful-vs-vanity breakdown + lag-floor check mandatory); Diagnosis reads the source change's hypothesis + Layer-1's packet and names likely drivers + visibility-signal read + lag & volatility check.
- **Layer 2 (sequential):** Recommendation consumes both Layer 1 outputs and proposes verdict (keep/discard/watch/blocked) with the lag/volatility gate applied, next-cycle target, ledger row, learning promotion.
- **Layer 3 (sequential):** Critic enforces the 7-dim rubric. PASS → write artifact + append ledger row + manifest sync. FAIL → revise once (max). After 2 failed revisions, return BLOCKED.

### Outputs land in three places

- `evals/YYYY-MM-DD-cycle-N.md` (primary artifact, 10-field frontmatter + provenance + 8-section body)
- `results.tsv` (one row, 8 columns, cluster + surface + window in description) via `append-loop-result.ts`
- `learnings.md` (only when critic approves promotion — high-confidence, keyword/surface-scoped, durable, with an explicit next-core-update expiry)

## When NOT to use

- **No existing eval loop.** Return NEEDS_CONTEXT, recommend `/run-pipeline`. evaluate-seo does not scaffold loops.
- **No measurement evidence.** Return BLOCKED, list missing evidence. evaluate-seo does not run as a heuristic audit.
- **The request is the audit or the fix.** Route to `optimize-seo`.
- **The request is live AI-citation tracking.** Route to `monitor-aeo`.
- **Organic-post engagement / paid-ad performance.** Route to `evaluate-content` / `evaluate-ad`.
- **The next action is content authorship.** Route to `write-copy`.

## Sibling coordination

- **`optimize-seo`** owns the audit + on-page/technical fixes. evaluate-seo reads its change as the source hypothesis; routes the next target back to optimize-seo.
- **`monitor-aeo`** owns AI-answer citation tracking. evaluate-seo reads its data for the `ai-answers` surface; routes continued tracking to monitor-aeo.
- **`write-copy`** owns content authorship. When the diagnosis points at thin content, route to write-copy.
- **`run-pipeline`** owns loop scaffolding. evaluate-seo assumes a loop exists.
- **`evaluate-content` / `evaluate-ad` / `evaluate-asset` / `evaluate-outreach`** are sibling eval lanes — same 4-agent / 7-dim / 8-col structure; evaluate-seo mirrors them for cross-eval consistency.

## History / origin

- **2026-06-01 — shipped as one of the three missing evals** named in CLOSED-LOOP.md §5 (`evaluate-asset`, `evaluate-outreach`, `evaluate-seo`). The SEO loop's gap was "optimize-seo + monitor-aeo measure but no cycle scorer" — this closes it (ranking/visibility delta → next-keyword rec). 7-dim rubric chosen mirroring evaluate-content's 5 generic dims + 2 SEO-specific (Visibility-Signal Discrimination + Lag & Volatility Discipline, replacing content's Engagement-Quality Discrimination + Platform-Fit). 4-agent shape byte-aligned with the eval siblings for cross-eval consistency.
- **Provisional v0.1.** Rubric will be revised after cycles 2-3.

## Acceptance Reminders (cite SKILL.md, not duplicate)

- 8 Critical Gates (existing loop / measurement evidence / source SEO-AEO artifact / one cluster+surface / no fabricated ranking data / minimum lag window / explicit confidence / does-not-optimize)
- 4-agent dispatch (Metric Ingest + Diagnosis + Recommendation + Critic)
- 7-dim rubric pass gate: aggregate ≥ 49 AND every per-dim ≥ 6
- Critic-override protocol via `scripts/log-critic-override.ts` — never relaxes the lag gate
- Generation provenance — `input_artifacts` lists the source optimize-seo/monitor-aeo artifact + icp-research.md
- Results Row schema byte-identical with the eval siblings (8 cols)
- Learning promotion keyword/surface-scoped with a next-core-update expiry
