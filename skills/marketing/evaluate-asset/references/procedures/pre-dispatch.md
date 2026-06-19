---
title: Asset-Eval Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: evaluate-asset
load_class: PROCEDURE
---

# Asset-Eval Pre-Dispatch Procedure

> Full Pre-Dispatch procedure for evaluate-asset. Cited from SKILL.md "Pre-Dispatch" section. Inherits the canonical Pre-Dispatch protocol from [`_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md); evaluate-asset-specific hard-block conditions + read order + Warm/Cold Start are below.

This skill has **hard gates** that fire BEFORE any cold-start questioning — eval-loop existence + return-leg (re-ingested asset) + lane check + source brief + asset id gate dispatch.

## Hard-block conditions (fire BEFORE Cold Start)

| Condition | Action |
|---|---|
| `.forsvn/loops/[slug]/program.md` AND/OR `context.md` absent | Return NEEDS_CONTEXT immediately; recommend `/run-pipeline` (do NOT proceed to Cold Start) |
| No re-ingested asset — only a prompt/brief exists | Return NEEDS_CONTEXT; route to `produce-asset` + re-ingest (`forsvn-preview attach`). evaluate-asset never scores a prompt (Critical Gate 2) |
| Asset under evaluation is a short-form video | Return NEEDS_CONTEXT; route to `evaluate-shortform` |
| Surface under evaluation is a landing page | Return NEEDS_CONTEXT; route to `evaluate-landing-page` |
| Question is the asset's live-post engagement | Return NEEDS_CONTEXT; route to `evaluate-content` / `evaluate-ad` |
| Source brief artifact path unreadable or missing | BLOCKED — Critic Hard Fail #5/#3. Ask operator to confirm the `design-briefs/[slug].md` path |
| Asset id missing from operator input | BLOCKED — ask operator to name the re-ingested asset/variant before proceeding |
| A variant set exists but no picked variant declared | BLOCKED — Critic Hard Fail #10. Ask which variant (`asset_picked`) to score |
| Loop has custom 10+ column `results.tsv` schema | Warn + flag to eval-loop owner; do NOT auto-append via standard helper; require hand-edit per `format-conventions.md` § "Known limitation — custom schemas" |
| Claimed cycle number conflicts with existing eval artifact for that cycle | Warn + ask whether to overwrite, append as out-of-order cycle, or abort |

## Read Order

1. `.forsvn/loops/[slug]/program.md` — primary metric definition + guardrails + asset scope
2. `.forsvn/loops/[slug]/context.md` — baseline render + acceptance assumptions + loop history
3. `.forsvn/loops/[slug]/results.tsv` — prior cycles' rows + resolve cycle number (`last cycle + 1`); read at least the last 2 rows for fidelity trend
4. Latest files in `.forsvn/loops/[slug]/strategy/`, `execution/`, and `evals/` — what changed this cycle + prior verdicts
5. **Source brief** at `docs/forsvn/artifacts/marketing/design-briefs/[slug].md` — the acceptance criteria are the benchmark for the Brief-Fidelity Check
6. **The re-ingested asset** at `docs/forsvn/artifacts/marketing/produced-assets/[slug]/manifest.md` — confirm `asset_picked` / `assets`; **open the image with Read** to confirm it is viewable
7. Brand tokens: `brand/BRAND.md`, `brand/DESIGN.md` — palette, type, logo safe-zone, Leaf <10%
8. Relevant canonical artifacts: `research/icp-research.md` if audience-fit matters

If `.forsvn/index/manifest.json` is stale or missing, run:

```bash
bun scripts/manifest-sync.ts
```

## Warm Start prompt

Triggered when the loop exists, the asset is re-ingested + viewable, the source brief is verified, and cycle context resolves automatically:

```
Found:
- loop: .forsvn/loops/[slug]/
- asset: [asset id / picked variant] (re-ingested, viewable)
- render engine: [engine] (execution_mode: [mode])
- source brief: [docs/forsvn/artifacts/marketing/design-briefs/[slug].md]
- primary metric: [from program.md]
- baseline/prior render: [from results.tsv last row]

Proceeding to evaluate cycle [N] (asset: [asset id]).
```

## Cold Start prompt (6 bundled questions)

Triggered when the loop exists but cycle context is missing. Ask one bundled question set, then stop until answered:

```
1. Which loop slug/path should this evaluation write into?
2. What is the re-ingested asset path/id? (the rendered file attached via the return-leg; if a variant set, which is the picked variant?)
3. What is the source brief path? (typically docs/forsvn/artifacts/marketing/design-briefs/[slug].md)
4. Which render engine produced it, and what execution_mode (brief-only / assisted / direct)?
5. What is the primary metric value for this cycle, and what baseline (prior render, or the loop's first-cycle bar)?
6. What are the brief's hard acceptance criteria (aspect ratio, required copy slots, dimensions, palette)? Are brand tokens available?
```

**If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-pipeline` instead of asking the rest.** Do NOT scaffold loops from inside evaluate-asset. **If nothing is re-ingested (only a prompt), route to `produce-asset` + re-ingest. If the asset is video / a landing page / a live post, route to the sibling eval instead of asking the rest.**

## Needed dimensions (6)

| Dimension | Source |
|---|---|
| Loop slug/path | Operator argument or `program.md` |
| Re-ingested asset id / picked variant | Operator argument — mandatory (the return-leg attachment) |
| Source brief path | Operator argument or read from loop's `execution/` dir |
| Render engine + execution_mode | Operator (or the produced-assets manifest provenance) |
| Primary metric value + baseline | Operator (baseline from prior render or first-cycle bar) |
| Brief acceptance criteria + brand tokens | Source brief + `brand/BRAND.md` / `brand/DESIGN.md` |

## Write-back

**None.** evaluate-asset does NOT write to `docs/forsvn/experience/`. Persistent loop state lives in:

- `program.md` (loop definition — owned by eval-loop skill)
- `context.md` (loop history + baselines — owned by eval-loop skill)
- `results.tsv` (per-cycle ledger row — appended by evaluate-asset via helper, asset id + engine in description)
- `learnings.md` (durable validated lessons — promoted by evaluate-asset only for high-confidence engine/brief-type/brand-scoped keep/discard reusable lessons)

The eval-loop boundary is intentional — keeping persistent state inside the loop directory means loop state stays scoped to the measurable initiative + asset.

## `--fast` behavior

This skill is `budget: standard`. `--fast` collapses Layer 1 parallel + Layer 2 sequential + Layer 3 critic to single-agent execution per layer (no parallelism, no critic revision cycle):

- Skip Layer 1 parallelism (metric-ingest + diagnosis run sequentially)
- Skip critic revision cycle — single critic pass; FAIL = BLOCKED (no auto-revise)
- Skip learning promotion to `learnings.md` (single-agent mode cannot reliably gate-keep promotion)
- Still write eval artifact + append ledger row IF critic PASS
- Still respect Critical Gates 1-8 (loop required / re-ingested asset / source brief / static-visual lane / one asset-variant / no fabricated quality / explicit confidence / no asset production)
- Still respect Critic Hard Fails 1-12

End artifact must include: `Ran in --fast mode (single-agent per layer, critic no-revise, no learning promotion); rerun without the flag for full critic gate with revision + learning promotion.`

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter evaluate_asset
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
