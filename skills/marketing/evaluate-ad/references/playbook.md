---
last_verified: 2026-06-13
verifier: audit-wave2
churn: high
title: Ad-Eval Playbook
lifecycle: canonical
status: stable
load_class: PLAYBOOK
---

# Ad-Eval Playbook

> Why this skill exists, philosophy, methodology, when NOT to use, history. Cited from SKILL.md's introduction. Stable reference — update only when philosophy or methodology genuinely shifts.

## Why this skill exists

`write-ad` has been live in the marketing stack since the 2.0 rename, producing Meta ad copy with a 7-dim brief-time critic rubric. Until now, the loop had a hole: no canonical place to score launched ads against the original brief's hypothesis using real metrics (CTR, CPA, ROAS, frequency, fatigue, spend, conversions).

Brief 05 § Eval Skills explicitly lists `evaluate-ad` alongside `evaluate-content`, `evaluate-campaign`, and the already-shipped landing-page + short-form pair. The autoresearch loop (brief 05 § Core Loop) cannot close on paid-ads work without an eval surface that ingests metrics, scores against the source artifact's hypothesis, and routes the next cycle.

`evaluate-ad` exists to:

1. **Close the write-ad → ad-performance → next-creative loop.** Every cycle reads the source ad-copy artifact's hypothesis (hook, anchor, audience-temp framing, CTA) and scores against real metrics, not best-practice heuristics.
2. **Enforce audience-temp discipline.** write-ad already separates cold-traffic and retargeting artifacts. evaluate-ad mirrors that — one cycle per audience-temp, no mixed-audience contamination.
3. **Surface creative-fatigue with falsifiable signals.** Frequency + CTR slope + negative-feedback proxy, not vibes.
4. **Promote durable lessons to learnings.md.** Conservatively. Most cycles don't promote; the ones that do are audience-temp-scoped, high-confidence, and reusable beyond this specific creative.

## Philosophy

### Measurement over heuristics

A "best-practice audit" of a launched ad ("the hook could be sharper, the headline is generic") is fanfiction without metrics. evaluate-ad refuses to score a cycle when measurement evidence is missing — return BLOCKED, not a heuristic verdict.

### Causal humility

Diagnosis names plausible drivers tied to evidence. It does NOT claim certainty on why the metric moved. Confounders (iOS attribution, mid-flight changes, optimizer learning, seasonality, LP outage, concurrent campaign) are surfaced, not smoothed. A "high-confidence" verdict means the evidence supports the verdict despite known confounders, not that confounders were ignored.

### Audience-temp is the most important boundary

write-ad's first design decision was: cold-traffic and retargeting are different surfaces with different copy mechanics. Cold copy emphasizes problem-aware curiosity; retargeting emphasizes urgency + objection-handling. evaluate-ad inherits this — a cold cycle scored against a retargeting baseline isn't apples-to-apples; it's audience-temp contamination. Critic Hard Fail #5 enforces.

### Component granularity over campaign maximalism

When fatigue triggers a rotation, the recommendation names the specific component to refresh (hook / hero / offer / CTA) — not "rewrite the campaign." Maximalist recommendations are unfalsifiable: they always include the actual fix among 7 unrelated changes. Tight scoping makes the next cycle's verdict (did the change move the metric?) testable.

### The rubric is provisional

v0.1. Mandatory revision after cycles 2-3 per brief 05's revision trigger. The 7 dimensions (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Audience-Temp Fidelity / Creative-Fatigue Awareness / Ledger Correctness) are a starting calibration. Operator overrides on the same dim > 3 times triggers revision.

## Methodology

### 4-agent dispatch (mirrors evaluate-landing-page)

- **Layer 1 (parallel):** Metric Ingest + Diagnosis. Metric Ingest normalizes operator-supplied metrics into a packet; Diagnosis reads the source ad-copy artifact's hypothesis + Layer-1's packet and names likely drivers + fatigue signals + audience-match signals.
- **Layer 2 (sequential):** Recommendation consumes both Layer 1 outputs and proposes verdict (keep/discard/watch/blocked), next-cycle route, ledger row, learning promotion.
- **Layer 3 (sequential):** Critic enforces the 7-dim rubric. PASS → write artifact + append ledger row + run manifest sync. FAIL → revise once (max). After 2 failed revisions, return BLOCKED.

### Inputs are explicit

- Loop slug or path (required)
- Audience-temp tag (required — gates Critical Gate 4)
- Source ad-copy artifact path (required)
- Measurement window (required)
- Primary metric value + source (required)
- Spend window (required for confidence floor enforcement)
- Frequency at window close (recommended for fatigue scoring)
- Conversions + CPA (recommended when defined in program.md)
- Audience size + reach (recommended for saturation diagnosis)

### Outputs land in three places

- `evals/YYYY-MM-DD-cycle-N.md` (primary artifact, 10-field frontmatter + provenance + 8-section body)
- `results.tsv` (one row, 8 columns, audience-temp in description) via `append-loop-result.ts`
- `learnings.md` (only when critic approves promotion — high-confidence, audience-temp-scoped, durable)

## When NOT to use

- **No existing eval loop.** Return NEEDS_CONTEXT, recommend `/run-pipeline`. evaluate-ad does not scaffold loops.
- **No measurement evidence.** Return BLOCKED, list missing evidence. evaluate-ad does not run as a heuristic audit.
- **Mixed-audience metric ingest with no clean split.** Return BLOCKED. Cold and retargeting are evaluated separately.
- **The next action is creative authorship, not scoring.** Route to `write-ad` with `--rev=N+1`.
- **The next action is channel-mix retrospective.** Route to `plan-campaign`.
- **The bottleneck is the LP, not the ad.** Route to `brief-landing-page` (and optionally `evaluate-landing-page` for the LP cycle).
- **Brand voice cleanup on the ad copy itself.** That's the `humanmaxxing` polish chain at write-ad time, not eval time.
- **Non-Meta platforms.** v1 is Meta-only — Google RSA, LinkedIn Ads, TikTok Ads are reserved for future expansion (same surface as write-ad).

## Sibling coordination

- **`write-ad`** owns construction-time creative authoring. evaluate-ad reads write-ad's artifacts as input; routes next cycle to write-ad with hypothesis seeding. evaluate-ad does NOT author copy.
- **`run-pipeline`** owns loop scaffolding (program.md, context.md, results.tsv schema, durable learnings ledger). evaluate-ad assumes a loop exists; if missing, defers to run-pipeline.
- **`evaluate-landing-page`** is the sister LP-eval skill. When ad-eval surfaces a high-CTR + low-conversion signal, route diagnosis to lp-eval — don't score LP signal inside an ad-eval artifact.
- **`plan-campaign`** owns multi-channel strategy retrospectives. When ad-eval surfaces a channel-mix or budget-allocation issue (not a creative issue), route to plan-campaign.

## History / origin

- **2026-05-19 — D15.B locked.** Workstream D slice 2 in `implementation-roadmap/execution-evaluation/decisions.md`. 7-dim rubric chosen over 6 (added Creative-Fatigue Awareness) and 5 (dropped Boundary Control as too LP-specific). 4-agent shape chosen byte-aligned with evaluate-landing-page for cross-eval consistency.
- **Provisional v0.1.** Rubric will be revised after cycles 2-3 per brief 05's revision trigger. A synthetic first cycle proved the infra end-to-end during development.

## Acceptance Reminders (cite SKILL.md, not duplicate)

- 7 Critical Gates (existing loop / measurement evidence / one primary metric / one audience-temp / no fabricated analytics / explicit attribution confidence / does-not-generate-creative)
- 4-agent dispatch (Metric Ingest + Diagnosis + Recommendation + Critic)
- 7-dim rubric pass gate: aggregate ≥ 49 AND every per-dim ≥ 6
- Critic-override protocol via `scripts/log-critic-override.ts` per D8 contract
- Generation provenance per D8 contract — `input_artifacts` lists source ad-copy + BRAND.md + icp-research.md
- Results Row schema byte-identical with evaluate-landing-page (8 cols)
- Learning promotion audience-temp-scoped
