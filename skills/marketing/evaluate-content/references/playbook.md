---
title: Content-Eval Playbook
lifecycle: canonical
status: stable
load_class: PLAYBOOK
---

# Content-Eval Playbook

> Why this skill exists, philosophy, methodology, when NOT to use, history. Cited from SKILL.md's introduction. Stable reference — update only when philosophy or methodology genuinely shifts.

## Why this skill exists

Workstream C shipped the production trio — `produce-asset`, `produce-video`, `publish-social`. Organic content now goes live. But until now there was no canonical place to score launched organic content (text / image / carousel posts) against the original `write-social` brief's hypothesis using real metrics — engagement breakdown, scroll/dwell, click-through, conversion, qualitative feedback.

Brief 05 § Eval Skills explicitly lists `evaluate-content` alongside `evaluate-ad` (shipped D15), `evaluate-campaign`, and the already-shipped landing-page + short-form pair. The autoresearch loop (brief 05 § Core Loop) cannot close on organic-content work without an eval surface that ingests metrics, scores against the source artifact's hypothesis, and routes the next cycle.

`evaluate-content` exists to:

1. **Close the write-social → content-performance → next-content loop.** Every cycle reads the source write-social artifact's hypothesis (hook, format, CTA, platform framing) and scores against real metrics, not best-practice heuristics.
2. **Refuse vanity metrics as success.** Likes and impressions are easy to win and mean little. evaluate-content scores meaningful engagement (saves, shares, comments, click-through, conversion) and names a vanity spike for what it is.
3. **Enforce platform discipline.** One cycle = one primary platform. A LinkedIn post and a TikTok-adjacent cut perform under different algorithms; blending them invents a fictitious verdict.
4. **Promote durable lessons to learnings.md.** Conservatively. Most cycles don't promote; the ones that do are platform/format-scoped, high-confidence, and reusable beyond this specific content piece.

## Philosophy

### Measurement over heuristics

A "best-practice audit" of a launched post ("the hook could be sharper, the format is generic") is fanfiction without metrics. evaluate-content refuses to score a cycle when measurement evidence is missing — return BLOCKED, not a heuristic verdict.

### Vanity is the enemy

The single most common content-eval failure is letting a likes/impressions spike read as success. Likes are cheap; the algorithm hands them out for engagement-bait. Saves, shares, comments, and click-through cost the audience something — they are the signal. evaluate-content always splits engagement into meaningful vs vanity and rests the verdict on the meaningful half. A post with 5,000 likes and 3 saves did not work.

### Causal humility

Diagnosis names plausible drivers tied to evidence. It does NOT claim certainty on why the metric moved. Confounders (algorithm change, posting-time shift, follower-count change, cross-post cannibalization, a single viral comment) are surfaced, not smoothed.

### One primary platform per cycle

Each platform runs a different algorithm with a different engagement-rate denominator. A 2% engagement rate is strong on LinkedIn and weak on a small Instagram account. evaluate-content scopes each cycle to one primary platform and reads the metric against that platform's benchmark. Secondary platforms appear as Cross-Platform Context — they inform diagnosis, they never drive the verdict. A 9-platform campaign is evaluated as separate cycles.

### Lane discipline

Short-form video is `evaluate-shortform`'s lane — it scores against the short-form-research platform-intelligence catalog, a genuinely different lens. Paid-ad placements are `evaluate-ad`'s lane. evaluate-content owns organic text / image / carousel. When the content is video or paid, route — do not score it here.

### The rubric is provisional

v0.1. Mandatory revision after cycles 2-3 per brief 05's revision trigger. The 7 dimensions (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Engagement-Quality Discrimination / Platform-Fit / Ledger Correctness) are a starting calibration. Operator overrides on the same dim > 3 times triggers revision.

## Methodology

### 4-agent dispatch (mirrors evaluate-ad)

- **Layer 1 (parallel):** Metric Ingest + Diagnosis. Metric Ingest normalizes operator-supplied metrics into a packet (engagement 4-way breakdown mandatory); Diagnosis reads the source write-social artifact's hypothesis + Layer-1's packet and names likely drivers + engagement-quality signals + cross-platform context.
- **Layer 2 (sequential):** Recommendation consumes both Layer 1 outputs and proposes verdict (keep/discard/watch/blocked), next-cycle route, ledger row, learning promotion.
- **Layer 3 (sequential):** Critic enforces the 7-dim rubric. PASS → write artifact + append ledger row + run manifest sync. FAIL → revise once (max). After 2 failed revisions, return BLOCKED.

### Outputs land in three places

- `evals/YYYY-MM-DD-cycle-N.md` (primary artifact, 10-field frontmatter + provenance + 8-section body)
- `results.tsv` (one row, 8 columns, primary platform in description) via `append-loop-result.ts`
- `learnings.md` (only when critic approves promotion — high-confidence, platform/format-scoped, durable)

## When NOT to use

- **No existing eval loop.** Return NEEDS_CONTEXT, recommend `/run-pipeline`. evaluate-content does not scaffold loops.
- **The content is short-form video.** Route to `evaluate-shortform` — that skill owns the video lane.
- **The content is a paid-ad placement.** Route to `evaluate-ad`.
- **No measurement evidence.** Return BLOCKED, list missing evidence. evaluate-content does not run as a heuristic audit.
- **The next action is copy authorship, not scoring.** Route to `write-social` with `--rev=N+1`.
- **The next action is a distribution / scheduling change.** Route to `publish-social`.
- **Brand voice cleanup on the copy itself.** That's the `humanmaxxing` polish chain at write-social time, not eval time.

## Sibling coordination

- **`write-social`** owns construction-time copy authoring. evaluate-content reads write-social's artifacts as input; routes the next cycle to write-social with hypothesis seeding. evaluate-content does NOT author copy.
- **`run-pipeline`** owns loop scaffolding (program.md, context.md, results.tsv schema, durable learnings ledger). evaluate-content assumes a loop exists; if missing, defers to run-pipeline.
- **`evaluate-shortform`** is the sister video-eval skill. Short-form video defers to it.
- **`evaluate-ad`** is the sister paid-ad-eval skill — same 4-agent / 7-dim / 8-col structure; evaluate-content mirrors it for cross-eval consistency.
- **`publish-social`** owns distribution. When evaluate-content surfaces a posting-time or platform-mix issue (not a content issue), route to publish-social.

## History / origin

- **2026-05-19 — D19 locked.** Workstream D slice 3 in `implementation-roadmap/execution-evaluation/decisions.md`. 7-dim rubric chosen mirroring evaluate-ad's 5 generic dims + 2 content-specific (Engagement-Quality Discrimination + Platform-Fit, replacing evaluate-ad's Audience-Temp Fidelity + Creative-Fatigue Awareness). 4-agent shape chosen byte-aligned with evaluate-ad for cross-eval consistency. Lane split from evaluate-shortform locked: organic text/image/carousel here, short-form video there. Cycle granularity locked: one primary platform per cycle, secondary platforms as context.
- **Provisional v0.1.** Rubric will be revised after cycles 2-3 per brief 05's revision trigger. A synthetic first cycle proved the infra end-to-end during development.

## Acceptance Reminders (cite SKILL.md, not duplicate)

- 8 Critical Gates (existing loop / organic-non-video-only / measurement evidence / one primary metric / one primary platform / no fabricated analytics / explicit attribution confidence / does-not-generate-content)
- 4-agent dispatch (Metric Ingest + Diagnosis + Recommendation + Critic)
- 7-dim rubric pass gate: aggregate ≥ 49 AND every per-dim ≥ 6
- Critic-override protocol via `scripts/log-critic-override.ts` per D8 contract
- Generation provenance per D8 contract — `input_artifacts` lists source write-social + BRAND.md + icp-research.md
- Results Row schema byte-identical with evaluate-ad (8 cols)
- Learning promotion platform/format-scoped
