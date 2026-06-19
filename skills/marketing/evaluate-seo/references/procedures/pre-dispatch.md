---
title: SEO/AEO-Eval Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: evaluate-seo
load_class: PROCEDURE
---

# SEO/AEO-Eval Pre-Dispatch Procedure

> Full Pre-Dispatch procedure for evaluate-seo. Cited from SKILL.md "Pre-Dispatch" section. Inherits the canonical Pre-Dispatch protocol from [`_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md); evaluate-seo-specific hard-block conditions + read order + Warm/Cold Start are below.

This skill has **hard gates** that fire BEFORE any cold-start questioning — eval-loop existence + measurement evidence + cluster+surface tag + source artifact + the lag-floor check gate dispatch.

## Hard-block conditions (fire BEFORE Cold Start)

| Condition | Action |
|---|---|
| `.forsvn/loops/[slug]/program.md` AND/OR `context.md` absent | Return NEEDS_CONTEXT immediately; recommend `/run-pipeline` (do NOT proceed to Cold Start) |
| Loop exists but no measurement evidence for the cycle (no primary metric value-source-window) | Return BLOCKED with missing-evidence list; route the audit to `optimize-seo` if that's the real ask |
| Keyword-cluster+surface tag missing from operator input | BLOCKED — Critical Gate 4 + Critic Hard Fail #4. Ask operator to declare the cluster + surface |
| Source optimize-seo / monitor-aeo artifact path unreadable or missing | BLOCKED — Critic Hard Fail #3. Ask operator to confirm the source path |
| Request is an audit / fix (not a measured cycle) | Return NEEDS_CONTEXT; route to `optimize-seo` |
| Request is live AI-citation tracking | Return NEEDS_CONTEXT; route to `monitor-aeo` |
| Organic post / paid ad under evaluation | Return NEEDS_CONTEXT; route to `evaluate-content` / `evaluate-ad` |
| Window below the loop's lag floor AND operator pre-declared intent to claim `keep` | Warn before dispatch — Critic Hard Fail #12 will FAIL the cycle if the recommendation lands on `keep`; a sub-floor move ships as `watch` |
| Loop has custom 10+ column `results.tsv` schema | Warn + flag to eval-loop owner; do NOT auto-append via standard helper; require hand-edit per `format-conventions.md` § "Known limitation — custom schemas" |
| Claimed cycle number conflicts with existing eval artifact for that cycle | Warn + ask whether to overwrite, append as out-of-order cycle, or abort |

## Read Order

1. `.forsvn/loops/[slug]/program.md` — primary metric definition + guardrails + the lag floor + cluster/surface scope
2. `.forsvn/loops/[slug]/context.md` — baseline assumptions + loop history + prior-cycle clusters
3. `.forsvn/loops/[slug]/results.tsv` — prior cycles' rows + resolve cycle number (`last cycle + 1`); read at least the last 2 rows of the same cluster + surface for trend
4. Latest files in `.forsvn/loops/[slug]/strategy/`, `execution/`, and `evals/` — what changed this cycle + prior verdicts
5. **Source optimize-seo / monitor-aeo artifact** — the change's hypothesis is the benchmark for Diagnosis
6. Ranking / visibility evidence (GSC export, rank tracker, AEO monitor) + the confounder log (core-update dates)
7. Relevant canonical artifacts: `research/icp-research.md`, `research/product-context.md` (intent fit)

If `.forsvn/index/manifest.json` is stale or missing, run:

```bash
bun scripts/manifest-sync.ts
```

## Warm Start prompt

Triggered when the loop exists, measurement evidence is present, the cluster+surface is tagged, the source artifact is verified, the window-vs-lag-floor is known, and cycle context resolves automatically:

```
Found:
- loop: .forsvn/loops/[slug]/
- cluster / surface: [cluster] · [organic-serp | ai-answers]
- primary metric: [from program.md]
- baseline/prior result: [from results.tsv last row of same cluster + surface]
- source artifact: [optimize-seo/[date]-<slug>.md or monitor-aeo/[date]-[slug].md]
- current window: [N days] (lag floor: [floor]) — meets floor: [yes/no]
- known core updates in window: [dates or none]

Proceeding to evaluate cycle [N] (cluster: [cluster] · surface: [surface]).
```

## Cold Start prompt (6 bundled questions)

Triggered when the loop exists but cycle context is missing. Ask one bundled question set, then stop until answered:

```
1. Which loop slug/path should this evaluation write into?
2. What keyword cluster + surface is this cycle? (organic-serp or ai-answers; one cluster + surface per cycle)
3. What is the source optimize-seo / monitor-aeo artifact path? (the change being scored)
4. What measurement window (start → end, days), and does it meet the loop's lag floor (default ≥28 days)? What source (GSC / Ahrefs / Semrush / AEO monitor)?
5. What is the primary metric value for this window, and what baseline (same cluster + surface prior cycle)?
6. Visibility breakdown (target-keyword position / organic clicks / impressions / CTR / AI-citation inclusion)? Any Google core/algorithm updates in the window?
```

**If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-pipeline` instead of asking the rest.** Do NOT scaffold loops from inside evaluate-seo. **If the request is an audit, route to `optimize-seo`. If it is live AI-citation tracking, route to `monitor-aeo` instead of asking the rest.**

## Needed dimensions (6)

| Dimension | Source |
|---|---|
| Loop slug/path | Operator argument or `program.md` |
| Keyword cluster + surface tag | Operator argument — mandatory |
| Source optimize-seo / monitor-aeo artifact path | Operator argument or read from loop's `execution/` dir |
| Measurement window (vs lag floor) | Operator (date range + days + source-system; checked against the loop's floor) |
| Primary metric value + baseline | Operator (baseline from same cluster + surface prior cycle) |
| Visibility breakdown + core-update log | Operator (position/clicks/impressions/CTR/citation; known core-update dates in the window) |

## Write-back

**None.** evaluate-seo does NOT write to `docs/forsvn/experience/`. Persistent loop state lives in:

- `program.md` (loop definition — owned by eval-loop skill)
- `context.md` (loop history + baselines — owned by eval-loop skill)
- `results.tsv` (per-cycle ledger row — appended by evaluate-seo via helper, cluster + surface + window in description)
- `learnings.md` (durable validated lessons — promoted by evaluate-seo only for high-confidence keyword/surface-scoped keep/discard reusable lessons with a next-core-update expiry)

The eval-loop boundary is intentional — keeping persistent state inside the loop directory means loop state stays scoped to the measurable initiative + cluster.

## `--fast` behavior

This skill is `budget: standard`. `--fast` collapses Layer 1 parallel + Layer 2 sequential + Layer 3 critic to single-agent execution per layer (no parallelism, no critic revision cycle):

- Skip Layer 1 parallelism (metric-ingest + diagnosis run sequentially)
- Skip critic revision cycle — single critic pass; FAIL = BLOCKED (no auto-revise)
- Skip learning promotion to `learnings.md` (single-agent mode cannot reliably gate-keep promotion)
- Still write eval artifact + append ledger row IF critic PASS
- Still respect Critical Gates 1-8 (loop required / measurement evidence / source artifact / one cluster+surface / no fabricated ranking data / minimum lag window / explicit confidence / no optimization)
- Still respect Critic Hard Fails 1-12 — including the lag-and-volatility gate, which `--fast` never skips

End artifact must include: `Ran in --fast mode (single-agent per layer, critic no-revise, no learning promotion); rerun without the flag for full critic gate with revision + learning promotion.`

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter evaluate_seo
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
