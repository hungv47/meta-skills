---
title: Ad-Eval Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: evaluate-ad
load_class: PROCEDURE
---

# Ad-Eval Pre-Dispatch Procedure

> Full Pre-Dispatch procedure for evaluate-ad. Cited from SKILL.md "Pre-Dispatch" section. Inherits canonical Pre-Dispatch protocol from [`_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md); evaluate-ad-specific hard-block conditions + read order + Warm/Cold Start are below.

This skill has **hard gates** that fire BEFORE any cold-start questioning — eval-loop existence + measurement evidence + audience-temp tag + source ad-copy artifact gate dispatch.

## Hard-block conditions (fire BEFORE Cold Start)

| Condition | Action |
|---|---|
| `.forsvn/loops/[slug]/program.md` AND/OR `context.md` absent | Return NEEDS_CONTEXT immediately; recommend `/run-pipeline` (do NOT proceed to Cold Start) |
| Loop exists but no measurement evidence supplied for the current cycle (no primary metric value-source-window) | Return BLOCKED with missing-evidence list — wait for operator to gather evidence and retry |
| Audience-temp tag missing from operator input (cold-traffic OR retargeting) | BLOCKED — Critical Gate 4 + Critic Hard Fail #3. Ask operator to declare the audience-temp before proceeding |
| Source ad-copy artifact path unreadable or missing | BLOCKED — Critic Hard Fail #10. Ask operator to confirm the source artifact path |
| Mixed-audience metric ingest with no clean split (cold + retargeting blended in metric source) | BLOCKED — Critic Hard Fail #4. Operator must split metrics by audience before retry |
| Loop has custom 10+ column `results.tsv` schema | Warn + flag to eval-loop owner; do NOT auto-append via standard helper; require hand-edit per `format-conventions.md` § "Known limitation — custom schemas" |
| Claimed cycle number conflicts with existing eval artifact for that cycle | Warn + ask whether to overwrite, append as out-of-order cycle, or abort |
| Spend window below confidence floor (< $50 per ad-group OR impressions < ~10k) AND operator pre-declared intent to claim `keep` | Warn before dispatch — Critic Hard Fail #11 will FAIL the cycle if the recommendation lands on `keep` |

## Read Order

1. `.forsvn/loops/[slug]/program.md` — primary metric definition + guardrails + audience-temp scope + frequency threshold (default 3.0 cold, 4.5 retargeting if unspecified)
2. `.forsvn/loops/[slug]/context.md` — baseline assumptions + loop history + audience-temp prior cycles
3. `.forsvn/loops/[slug]/results.tsv` — prior cycles' rows + resolve cycle number (`last cycle + 1`); read at least last 2 rows for trend context (CTR slope, frequency trajectory)
4. Latest files in `.forsvn/loops/[slug]/strategy/`, `execution/`, and `evals/` — what was changed this cycle + prior eval verdicts
5. **Source ad-copy artifact** at `docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md` (and `.rationale.md` if present) — the brief's hypothesis is the benchmark for Diagnosis
6. Relevant canonical artifacts: `brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`, `docs/forsvn/artifacts/marketing/campaign-plan.md` if present

If `.forsvn/index/manifest.json` is stale or missing, run:

```bash
bun scripts/manifest-sync.ts
```

## Warm Start prompt

Triggered when the loop exists, metric evidence is present, audience-temp tagged, source ad-copy artifact verified, and cycle context can be resolved automatically:

```
Found:
- loop: .forsvn/loops/[slug]/
- audience-temp: [cold-traffic | retargeting]
- primary metric: [from program.md]
- baseline/prior result: [from results.tsv last row of same audience-temp]
- source ad-copy artifact: [docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md]
- current evidence window: [window + source]
- spend: [amount + breakdown if available]
- frequency_at_close: [N.N]

Proceeding to evaluate cycle [N] (cold-traffic | retargeting).
```

## Cold Start prompt (6 bundled questions)

Triggered when loop exists but cycle context is missing. Ask one bundled question set, then stop until answered:

```
1. Which loop slug/path should this evaluation write into?
2. What audience-temperature is this cycle scoped to — cold-traffic OR retargeting? (one cycle = one temp; mixed-audience is a hard block)
3. What is the source ad-copy artifact path? (typically docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md)
4. What measurement window (start date → end date, days) and source (Meta Ads Manager / Supermetrics / Triple Whale / Northbeam / operator-supplied)?
5. What is the primary metric value for this window, and what baseline (same audience-temp prior cycle, comparable spend window)?
6. Total spend during the measurement window? Frequency at window close? Conversion count (if defined in program.md)?
```

**If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-pipeline` instead of asking the rest.** Do NOT scaffold loops from inside evaluate-ad.

## Needed dimensions (6)

| Dimension | Source |
|---|---|
| Loop slug/path | Operator argument or `program.md` |
| Audience-temp tag | Operator argument (cold-traffic OR retargeting) — mandatory |
| Source ad-copy artifact path | Operator argument or read from loop's `execution/` dir |
| Measurement window | Operator (date range + days + source-system) |
| Primary metric value + baseline | Operator (sourced from named tool; baseline from same audience-temp prior cycle) |
| Spend window + frequency_at_close | Operator (spend for confidence floor; frequency for fatigue scoring) |

## Write-back

**None.** evaluate-ad does NOT write to `docs/forsvn/experience/`. Persistent loop state lives in:

- `program.md` (loop definition — owned by eval-loop skill)
- `context.md` (loop history + baselines — owned by eval-loop skill)
- `results.tsv` (per-cycle ledger row — appended by evaluate-ad via helper, audience-temp in description)
- `learnings.md` (durable validated lessons — promoted by evaluate-ad only for high-confidence audience-temp-scoped keep/discard reusable lessons)

The eval-loop boundary is intentional — keeping persistent state inside the loop directory (not the cross-skill `experience/` substrate) means loop state stays scoped to the measurable initiative + audience-temp.

## `--fast` behavior

This skill is `budget: standard`. `--fast` collapses Layer 1 parallel + Layer 2 sequential + Layer 3 critic to single-agent execution per layer (no parallelism, no critic revision cycle):

- Skip Layer 1 parallelism (metric-ingest + diagnosis run sequentially)
- Skip critic revision cycle — single critic pass; FAIL = BLOCKED (no auto-revise)
- Skip learning promotion to `learnings.md` (single-agent mode cannot reliably gate-keep promotion)
- Still write eval artifact + append ledger row IF critic PASS
- Still respect Critical Gates 1-7 (loop required / measurement evidence required / one primary metric decides / one audience-temp / no fabricated analytics / explicit confidence / no creative generation)
- Still respect Critic Hard Fails 1-12

End artifact must include: `Ran in --fast mode (single-agent per layer, critic no-revise, no learning promotion); rerun without the flag for full critic gate with revision + learning promotion.`

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter evaluate_ad
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
