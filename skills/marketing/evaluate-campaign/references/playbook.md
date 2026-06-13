---
title: Campaign-Eval Playbook
lifecycle: canonical
status: stable
load_class: PLAYBOOK
---

# Campaign-Eval Playbook

> Why this skill exists, philosophy, methodology, when NOT to use, history. Cited from SKILL.md's introduction. Stable reference — update only when philosophy or methodology genuinely shifts.

## Why this skill exists

`plan-campaign` has been live since the 2.0 rename and produces multi-channel campaign plans — objective, channel mix, budget split, sequencing. Campaigns then launch and run. But until now there was no canonical place to score a launched campaign's outcomes (reach, leads, revenue, CAC, channel breakdown) against the original plan's hypothesis using real metrics.

Brief 05 § Eval Skills explicitly names four eval surfaces: `evaluate-ad` (shipped D15), `evaluate-content` (shipped D19), the already-shipped landing-page + short-form pair, and `evaluate-campaign`. The autoresearch loop (brief 05 § Core Loop) cannot close on campaign-level work without an eval surface that ingests channel-rollup metrics, scores against the plan's hypothesis, and routes the next cycle. evaluate-campaign is the last of the four; it closes Workstream D's eval-skill quartet.

`evaluate-campaign` exists to:

1. **Close the plan-campaign → campaign-performance → next-campaign loop.** Every cycle reads the source plan-campaign artifact's hypothesis (objective, channel mix, budget split, sequencing) and scores against real metrics, not best-practice heuristics.
2. **Separate drivers from riders.** A channel that converts demand the campaign did not create — a warm existing-list email send, retargeting of pre-campaign visitors, branded search — rode along. evaluate-campaign classifies every channel driver / rider / mixed and refuses to count borrowed credit as a campaign win.
3. **Keep unit economics honest.** A healthy blended CAC can hide an underwater paid channel. evaluate-campaign reports blended CAC and paid CAC as distinct numbers and names an underwater channel even when the blend looks green.
4. **Promote durable lessons to learnings.md.** Conservatively. Most cycles don't promote; the ones that do are campaign-type/channel-mix-scoped, high-confidence, and reusable beyond this specific campaign.

## Philosophy

### Aggregate, don't re-score

evaluate-campaign is aggregate-only. A campaign spans ads, organic posts, and landing pages — each already has its own eval skill (`evaluate-ad`, `evaluate-content`, `evaluate-landing-page`, `evaluate-shortform`). evaluate-campaign does not re-score those assets. It scores campaign-level outcomes from channel-rollup metrics. Per-asset eval artifacts, when they exist in the loop, are read as supporting context — never re-scored, never folded into the verdict. The lane split keeps each eval skill owning one thing and avoids a campaign cycle that bloats into five embedded asset evals with the wrong rubric.

### Measurement over heuristics

A "best-practice audit" of a launched campaign ("the channel mix could be sharper, the sequencing is generic") is fanfiction without metrics. evaluate-campaign refuses to score a cycle when measurement evidence is missing — return BLOCKED, not a heuristic verdict.

### Correlation is not causation — across the channel mix

The single most common campaign-eval failure is letting a rider channel's conversions read as campaign success. An email to the existing trial list converts in the campaign window — but those users were already in-funnel. evaluate-campaign classifies every channel driver / rider / mixed with a causation reason and excludes rider conversions from the campaign-driven net-new count. The blended number can never stand alone; the per-channel breakdown is mandatory.

### Unit economics are not the blended number

A blended CAC of $22 against a $19/mo price looks fine — until you see paid-social alone is $61. The blend was propped up by free organic and content conversions. evaluate-campaign always reports blended CAC and paid CAC as two distinct numbers, computes payback against the product's actual price/margin, and names an underwater paid channel even when the blend is green. A keep that launders an underwater channel through the blend is a Hard Fail.

### Causal humility

Diagnosis names plausible drivers tied to evidence. It does NOT claim certainty on why the metric moved. Confounders (seasonality, concurrent campaign, channel cannibalization, organic baseline drift, brand-search lift) are surfaced, not smoothed.

### One whole campaign per cycle

A campaign's whole point is the cross-channel mix. Evaluating one channel per cycle would destroy the mix analysis — you could never see that email rode along while content drove. evaluate-campaign scopes each cycle to the entire campaign across every channel, with a per-channel breakdown table inside Diagnosis. The verdict is campaign-level; the keep/discard granularity is per-channel and per-budget-lever.

### The rubric is provisional

v0.1. Mandatory revision after cycles 2-3 per brief 05's revision trigger. The 7 dimensions (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Channel-Mix Discrimination / Unit-Economics Discipline / Ledger Correctness) are a starting calibration. Operator overrides on the same dim > 3 times triggers revision.

## Methodology

### 4-agent dispatch (mirrors evaluate-content / evaluate-ad)

- **Layer 1 (parallel):** Metric Ingest + Diagnosis. Metric Ingest normalizes operator-supplied metrics into a packet (blended CAC + paid CAC distinct; the per-channel rollup mandatory); Diagnosis reads the source plan-campaign artifact's hypothesis + Layer-1's packet and names likely drivers + channel-mix signals (driver/rider classification) + unit-economics signals.
- **Layer 2 (sequential):** Recommendation consumes both Layer 1 outputs and proposes verdict (keep/discard/watch/blocked), next-cycle route, ledger row, learning promotion.
- **Layer 3 (sequential):** Critic enforces the 7-dim rubric. PASS → write artifact + append ledger row + run manifest sync. FAIL → revise once (max). After 2 failed revisions, return BLOCKED.

### Outputs land in three places

- `evals/YYYY-MM-DD-cycle-N.md` (primary artifact, 10-field frontmatter + provenance + 8-section body)
- `results.tsv` (one row, 8 columns, campaign tag in description) via `append-loop-result.ts`
- `learnings.md` (only when critic approves promotion — high-confidence, campaign-type/channel-mix-scoped, durable)

## When NOT to use

- **No existing eval loop.** Return NEEDS_CONTEXT, recommend `/run-pipeline`. evaluate-campaign does not scaffold loops.
- **A single ad / post / page / video.** Route to `evaluate-ad` / `evaluate-content` / `evaluate-landing-page` / `evaluate-shortform` — those own the asset-level lanes.
- **No measurement evidence.** Return BLOCKED, list missing evidence. evaluate-campaign does not run as a heuristic audit.
- **The next action is campaign planning, not scoring.** Route to `plan-campaign` with `--rev=N+1`.
- **The next action is ad-creative or organic-copy authoring.** Route to `write-ad` / `write-social`.
- **Brand voice cleanup on the campaign copy itself.** That's the `humanmaxxing` polish chain at construction time, not eval time.

## Sibling coordination

- **`plan-campaign`** owns construction-time campaign planning. evaluate-campaign reads plan-campaign's artifact as input; routes the next cycle to plan-campaign with hypothesis seeding. evaluate-campaign does NOT author campaign plans.
- **`run-pipeline`** owns loop scaffolding (program.md, context.md, results.tsv schema, durable learnings ledger). evaluate-campaign assumes a loop exists; if missing, defers to run-pipeline.
- **`evaluate-ad` / `evaluate-content` / `evaluate-landing-page` / `evaluate-shortform`** are the asset-level eval skills — same 4-agent / 8-section / 8-col structure; evaluate-campaign mirrors them for cross-eval consistency and aggregates above them, never re-scoring their assets.

## History / origin

- **2026-05-20 — D20 locked.** Workstream D slice 4 in `implementation-roadmap/execution-evaluation/decisions.md`. The fourth and final brief-05 eval skill — closes Workstream D's eval quartet. 7-dim rubric chosen mirroring evaluate-ad / evaluate-content's 5 generic dims + 2 campaign-specific (Channel-Mix Discrimination + Unit-Economics Discipline, replacing evaluate-content's Engagement-Quality Discrimination + Platform-Fit). 4-agent shape byte-aligned with evaluate-content for cross-eval consistency. Scope locked aggregate-only (interview Q1): campaign-level outcomes from channel rollups, no re-scoring of individual assets. Cycle granularity locked whole-campaign-all-channels (interview Q2): one cycle = the entire campaign with a per-channel breakdown table, never one cycle per channel.
- **Provisional v0.1.** Rubric will be revised after cycles 2-3 per brief 05's revision trigger. A synthetic first cycle proved the infra end-to-end during development.

## Acceptance Reminders (cite SKILL.md, not duplicate)

- 8 Critical Gates (existing loop / aggregate-only campaign scope / measurement evidence / one primary metric / whole-campaign all-channels scope / no fabricated analytics / explicit attribution confidence / does-not-generate-strategy)
- 4-agent dispatch (Metric Ingest + Diagnosis + Recommendation + Critic)
- 7-dim rubric pass gate: aggregate ≥ 49 AND every per-dim ≥ 6
- Critic-override protocol via `scripts/log-critic-override.ts` per D8 contract
- Generation provenance per D8 contract — `input_artifacts` lists source plan-campaign + BRAND.md + icp-research.md
- Results Row schema byte-identical with evaluate-ad / evaluate-content (8 cols)
- Learning promotion campaign-type/channel-mix-scoped
