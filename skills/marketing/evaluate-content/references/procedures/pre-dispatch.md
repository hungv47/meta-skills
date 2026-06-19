---
title: Content-Eval Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: evaluate-content
load_class: PROCEDURE
---

# Content-Eval Pre-Dispatch Procedure

> Full Pre-Dispatch procedure for evaluate-content. Cited from SKILL.md "Pre-Dispatch" section. Inherits canonical Pre-Dispatch protocol from [`_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md); evaluate-content-specific hard-block conditions + read order + Warm/Cold Start are below.

This skill has **hard gates** that fire BEFORE any cold-start questioning — eval-loop existence + content-lane check + measurement evidence + primary-platform tag + source write-social artifact gate dispatch.

## Hard-block conditions (fire BEFORE Cold Start)

| Condition | Action |
|---|---|
| `.forsvn/loops/[slug]/program.md` AND/OR `context.md` absent | Return NEEDS_CONTEXT immediately; recommend `/run-pipeline` (do NOT proceed to Cold Start) |
| Content under evaluation is short-form video | Return NEEDS_CONTEXT; route to `evaluate-shortform` — that skill owns the video lane |
| Content under evaluation is a paid-ad placement | Return NEEDS_CONTEXT; route to `evaluate-ad` |
| Loop exists but no measurement evidence supplied for the current cycle (no primary metric value-source-window) | Return BLOCKED with missing-evidence list — wait for operator to gather evidence and retry |
| Primary-platform tag missing from operator input | BLOCKED — Critical Gate 5 + Critic Hard Fail #3. Ask operator to declare the primary platform before proceeding |
| Source write-social artifact path unreadable or missing | BLOCKED — Critic Hard Fail #10. Ask operator to confirm the source artifact path |
| Loop has custom 10+ column `results.tsv` schema | Warn + flag to eval-loop owner; do NOT auto-append via standard helper; require hand-edit per `format-conventions.md` § "Known limitation — custom schemas" |
| Claimed cycle number conflicts with existing eval artifact for that cycle | Warn + ask whether to overwrite, append as out-of-order cycle, or abort |
| Reach/impressions below the loop's confidence floor AND operator pre-declared intent to claim `keep` | Warn before dispatch — Critic Hard Fail #12 will FAIL the cycle if the recommendation lands on `keep` |

## Read Order

1. `.forsvn/loops/[slug]/program.md` — primary metric definition + guardrails + primary-platform scope
2. `.forsvn/loops/[slug]/context.md` — baseline assumptions + loop history + prior-cycle platforms
3. `.forsvn/loops/[slug]/results.tsv` — prior cycles' rows + resolve cycle number (`last cycle + 1`); read at least the last 2 rows of the same platform for trend context
4. Latest files in `.forsvn/loops/[slug]/strategy/`, `execution/`, and `evals/` — what was changed this cycle + prior eval verdicts
5. **Source write-social artifact** at `docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md` — the brief's hypothesis is the benchmark for Diagnosis
6. `docs/forsvn/artifacts/marketing/published-social/[slug]/manifest.md` if present — post URLs + distribution provenance
7. Relevant canonical artifacts: `brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`

If `.forsvn/index/manifest.json` is stale or missing, run:

```bash
bun scripts/manifest-sync.ts
```

## Warm Start prompt

Triggered when the loop exists, metric evidence is present, the primary platform is tagged, the source write-social artifact is verified, and cycle context can be resolved automatically:

```
Found:
- loop: .forsvn/loops/[slug]/
- primary platform: [platform]
- primary metric: [from program.md]
- baseline/prior result: [from results.tsv last row of same platform + content type]
- source write-social artifact: [docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md]
- current evidence window: [window + source]
- reach: [amount]

Proceeding to evaluate cycle [N] (primary platform: [platform]).
```

## Cold Start prompt (6 bundled questions)

Triggered when the loop exists but cycle context is missing. Ask one bundled question set, then stop until answered:

```
1. Which loop slug/path should this evaluation write into?
2. What is the primary platform for this cycle? (one cycle = one primary platform; secondary platforms are context only)
3. What is the source write-social artifact path? (typically docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md)
4. What measurement window (start date → end date, days) and source (native platform analytics / third-party dashboard / operator-supplied)?
5. What is the primary metric value for this window, and what baseline (same platform + same content type prior cycle)?
6. Reach/impressions for the window? Engagement breakdown (likes / saves / shares / comments)? Click-through if available?
```

**If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-pipeline` instead of asking the rest.** Do NOT scaffold loops from inside evaluate-content. **If the content is short-form video or a paid ad, route to `evaluate-shortform` / `evaluate-ad` instead of asking the rest.**

## Needed dimensions (6)

| Dimension | Source |
|---|---|
| Loop slug/path | Operator argument or `program.md` |
| Primary-platform tag | Operator argument — mandatory |
| Source write-social artifact path | Operator argument or read from loop's `execution/` dir |
| Measurement window | Operator (date range + days + source-system) |
| Primary metric value + baseline | Operator (sourced from named tool; baseline from same platform + content type prior cycle) |
| Reach + engagement breakdown | Operator (reach for the confidence floor; 4-way engagement split for quality scoring) |

## Write-back

**None.** evaluate-content does NOT write to `docs/forsvn/experience/`. Persistent loop state lives in:

- `program.md` (loop definition — owned by eval-loop skill)
- `context.md` (loop history + baselines — owned by eval-loop skill)
- `results.tsv` (per-cycle ledger row — appended by evaluate-content via helper, primary platform in description)
- `learnings.md` (durable validated lessons — promoted by evaluate-content only for high-confidence platform/format-scoped keep/discard reusable lessons)

The eval-loop boundary is intentional — keeping persistent state inside the loop directory (not the cross-skill `experience/` substrate) means loop state stays scoped to the measurable initiative + platform.

## `--fast` behavior

This skill is `budget: standard`. `--fast` collapses Layer 1 parallel + Layer 2 sequential + Layer 3 critic to single-agent execution per layer (no parallelism, no critic revision cycle):

- Skip Layer 1 parallelism (metric-ingest + diagnosis run sequentially)
- Skip critic revision cycle — single critic pass; FAIL = BLOCKED (no auto-revise)
- Skip learning promotion to `learnings.md` (single-agent mode cannot reliably gate-keep promotion)
- Still write eval artifact + append ledger row IF critic PASS
- Still respect Critical Gates 1-8 (loop required / organic-non-video-only / measurement evidence / one primary metric / one primary platform / no fabricated analytics / explicit confidence / no content generation)
- Still respect Critic Hard Fails 1-12

End artifact must include: `Ran in --fast mode (single-agent per layer, critic no-revise, no learning promotion); rerun without the flag for full critic gate with revision + learning promotion.`

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter evaluate_content
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
