---
title: LP-Eval Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: lp-eval
load_class: PROCEDURE
---

# LP-Eval Pre-Dispatch Procedure

> Full Pre-Dispatch procedure for lp-eval. Cited from SKILL.md "Pre-Dispatch" section. Inherits canonical Pre-Dispatch protocol from [`_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md); lp-eval-specific hard-block conditions + read order + Warm/Cold Start are below.

This skill has **hard gates** that fire BEFORE any cold-start questioning — eval-loop existence + measurement evidence gate dispatch.

## Hard-block conditions (fire BEFORE Cold Start)

| Condition | Action |
|---|---|
| `.forsvn/loops/[slug]/program.md` AND/OR `context.md` absent | Return NEEDS_CONTEXT immediately; recommend `/run-pipeline` (do NOT proceed to Cold Start) |
| Loop exists but no measurement evidence supplied for the current cycle (no primary metric value-source-window) | Return BLOCKED with missing-evidence list — wait for operator to gather evidence and retry |
| Loop has custom 10+ column `results.tsv` schema | Warn + flag to eval-loop owner; do NOT auto-append via standard helper; require hand-edit per `format-conventions.md` § "Known limitation — custom schemas" |
| Claimed cycle number conflicts with existing eval artifact for that cycle | Warn + ask whether to overwrite, append as out-of-order cycle, or abort |

## Read Order

1. `.forsvn/loops/[slug]/program.md` — primary metric definition + guardrails + loop hypothesis
2. `.forsvn/loops/[slug]/context.md` — baseline assumptions + loop history + traffic-source notes
3. `.forsvn/loops/[slug]/results.tsv` — prior cycles' rows + resolve cycle number (`last cycle + 1`)
4. Latest files in `.forsvn/loops/[slug]/strategy/`, `execution/`, and `evals/` — what was changed this cycle + prior eval verdicts
5. Relevant canonical artifacts: `brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`, campaign plan if present

If `.forsvn/index/manifest.json` is stale or missing, run:

```bash
bun scripts/manifest-sync.ts
```

## Warm Start prompt

Triggered when the loop exists, metric evidence is present, and cycle context can be resolved automatically:

```
Found:
- loop: .forsvn/loops/[slug]/
- primary metric: [from program.md]
- baseline/prior result: [from context.md or results.tsv]
- latest strategy/execution artifact: [path]
- current evidence window: [window + source]

Proceeding to evaluate cycle [N].
```

## Cold Start prompt (5 bundled questions)

Triggered when loop exists but cycle context is missing. Ask one bundled question set, then stop until answered:

```
1. Which loop slug/path should this evaluation write into?
2. What page URL or route is being evaluated?
3. What measurement window and source should be used?
4. What is the primary metric value for this window, and what baseline should it compare against?
5. What changed this cycle? Link or summarize strategy/execution artifacts if they exist.
```

**If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-pipeline` instead of asking the rest.** Do NOT scaffold loops from inside lp-eval.

## Needed dimensions (5)

| Dimension | Source |
|---|---|
| Loop slug/path | Operator argument or `program.md` |
| Page URL/route | Operator argument |
| Measurement window | Operator (date range, traffic count, or sample N) |
| Primary metric value + baseline | Operator (sourced from named tool) |
| What changed this cycle | Strategy/execution artifacts OR operator notes (labeled as operator-supplied) |

## Write-back

**None.** lp-eval does NOT write to `docs/forsvn/experience/`. Persistent loop state lives in:

- `program.md` (loop definition — owned by eval-loop skill)
- `context.md` (loop history + baselines — owned by eval-loop skill)
- `results.tsv` (per-cycle ledger row — appended by lp-eval via helper)
- `learnings.md` (durable validated lessons — promoted by lp-eval only for high-confidence keep/discard reusable lessons)

The eval-loop boundary is intentional — keeping persistent state inside the loop directory (not the cross-skill `experience/` substrate) means loop state stays scoped to the measurable initiative.

## `--fast` behavior

This skill is `budget: standard`. `--fast` collapses Layer 1 parallel + Layer 2 sequential + Layer 3 critic to single-agent execution per layer (no parallelism, no critic revision cycle):

- Skip Layer 1 parallelism (metric-ingest + diagnosis run sequentially)
- Skip critic revision cycle — single critic pass; FAIL = BLOCKED (no auto-revise)
- Skip learning promotion to `learnings.md` (single-agent mode cannot reliably gate-keep promotion)
- Still write eval artifact + append ledger row IF critic PASS
- Still respect Critical Gates 1-6 (loop required / measurement evidence required / one primary metric decides / no fabricated analytics / explicit confidence / no redesign)
- Still respect Critic Hard Fails 1-7

End artifact must include: `Ran in --fast mode (single-agent per layer, critic no-revise, no learning promotion); rerun without the flag for full critic gate with revision + learning promotion.`

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter evaluate_landing_page
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
