---
title: Outreach-Eval Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: evaluate-outreach
load_class: PROCEDURE
---

# Outreach-Eval Pre-Dispatch Procedure

> Full Pre-Dispatch procedure for evaluate-outreach. Cited from SKILL.md "Pre-Dispatch" section. Inherits the canonical Pre-Dispatch protocol from [`_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md); evaluate-outreach-specific hard-block conditions + read order + Warm/Cold Start are below.

This skill has **hard gates** that fire BEFORE any cold-start questioning — eval-loop existence + sent-and-measured check + channel+segment tag + source write-outreach artifact + deliverability/compliance evidence gate dispatch.

## Hard-block conditions (fire BEFORE Cold Start)

| Condition | Action |
|---|---|
| `.forsvn/loops/[slug]/program.md` AND/OR `context.md` absent | Return NEEDS_CONTEXT immediately; recommend `/run-pipeline` (do NOT proceed to Cold Start) |
| Outreach is a draft — not sent, no reply/bounce data | Return NEEDS_CONTEXT; route to `write-outreach`. This skill scores what shipped (Critical Gate 2) |
| Loop exists but no reply evidence for the cycle (no primary metric value-source-window) | Return BLOCKED with missing-evidence list |
| No deliverability/compliance evidence (bounce, spam complaints, opt-out status) | Return BLOCKED — Critical Gate 6. A cycle that ignores deliverability can be burning the domain |
| Channel+segment tag missing from operator input | BLOCKED — Critical Gate 4 + Critic Hard Fail #4. Ask operator to declare the channel + segment |
| Source write-outreach artifact path unreadable or missing | BLOCKED — Critic Hard Fail #3. Ask operator to confirm the source path |
| Organic post / paid ad under evaluation | Return NEEDS_CONTEXT; route to `evaluate-content` / `evaluate-ad` |
| Loop has custom 10+ column `results.tsv` schema | Warn + flag to eval-loop owner; do NOT auto-append via standard helper; require hand-edit per `format-conventions.md` § "Known limitation — custom schemas" |
| Claimed cycle number conflicts with existing eval artifact for that cycle | Warn + ask whether to overwrite, append as out-of-order cycle, or abort |

## Read Order

1. `.forsvn/loops/[slug]/program.md` — primary metric definition + guardrails + channel/segment scope
2. `.forsvn/loops/[slug]/context.md` — baseline assumptions + list history + prior-cycle channels
3. `.forsvn/loops/[slug]/results.tsv` — prior cycles' rows + resolve cycle number (`last cycle + 1`); read at least the last 2 rows of the same channel + segment for trend
4. Latest files in `.forsvn/loops/[slug]/strategy/`, `execution/`, and `evals/` — what changed this cycle + prior verdicts
5. **Source write-outreach artifact** at `docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md` — the sequence's hypothesis is the benchmark for Diagnosis
6. Reply + deliverability + compliance evidence (outreach tool export, CRM, opt-out log)
7. Relevant canonical artifacts: `research/icp-research.md` (segment fit), `brand/BRAND.md` (voice)

If `.forsvn/index/manifest.json` is stale or missing, run:

```bash
bun scripts/manifest-sync.ts
```

## Warm Start prompt

Triggered when the loop exists, reply + deliverability evidence is present, the channel+segment is tagged, the source sequence is verified, and cycle context resolves automatically:

```
Found:
- loop: .forsvn/loops/[slug]/
- channel / segment: [channel] · [segment]
- primary metric: [from program.md]
- baseline/prior result: [from results.tsv last row of same channel + segment]
- source write-outreach artifact: [docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md]
- current evidence window: [window + source]
- sends: [N] · deliverability: [bounce / spam supplied]

Proceeding to evaluate cycle [N] (channel: [channel] · segment: [segment]).
```

## Cold Start prompt (6 bundled questions)

Triggered when the loop exists but cycle context is missing. Ask one bundled question set, then stop until answered:

```
1. Which loop slug/path should this evaluation write into?
2. What channel + segment is this cycle? (one cycle = one channel + segment; secondary channels are context only)
3. What is the source write-outreach artifact path? (typically docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md)
4. What measurement window (start → end, days) and source (outreach tool / CRM / operator-supplied)?
5. What is the primary metric value for this window, and what baseline (same channel + segment prior cycle)?
6. Sends? Reply breakdown (positive / meeting / qualified / neutral / negative / auto / opt-out)? Deliverability (bounce rate, spam-complaint rate) + compliance (opt-out honored, regime)?
```

**If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-pipeline` instead of asking the rest.** Do NOT scaffold loops from inside evaluate-outreach. **If the outreach is a draft, route to `write-outreach`. If it is an organic post or paid ad, route to `evaluate-content` / `evaluate-ad` instead of asking the rest.**

## Needed dimensions (6)

| Dimension | Source |
|---|---|
| Loop slug/path | Operator argument or `program.md` |
| Channel + segment tag | Operator argument — mandatory |
| Source write-outreach artifact path | Operator argument or read from loop's `execution/` dir |
| Measurement window | Operator (date range + days + source-system) |
| Primary metric value + baseline | Operator (baseline from same channel + segment prior cycle) |
| Sends + reply breakdown + deliverability/compliance | Operator (sends for the confidence floor; categorized replies; bounce/spam/opt-out) |

## Write-back

**None.** evaluate-outreach does NOT write to `docs/forsvn/experience/`. Persistent loop state lives in:

- `program.md` (loop definition — owned by eval-loop skill)
- `context.md` (loop history + baselines — owned by eval-loop skill)
- `results.tsv` (per-cycle ledger row — appended by evaluate-outreach via helper, channel + segment in description)
- `learnings.md` (durable validated lessons — promoted by evaluate-outreach only for high-confidence channel/segment/offer-scoped keep/discard reusable lessons)

The eval-loop boundary is intentional — keeping persistent state inside the loop directory means loop state stays scoped to the measurable initiative + channel.

## `--fast` behavior

This skill is `budget: standard`. `--fast` collapses Layer 1 parallel + Layer 2 sequential + Layer 3 critic to single-agent execution per layer (no parallelism, no critic revision cycle):

- Skip Layer 1 parallelism (metric-ingest + diagnosis run sequentially)
- Skip critic revision cycle — single critic pass; FAIL = BLOCKED (no auto-revise)
- Skip learning promotion to `learnings.md` (single-agent mode cannot reliably gate-keep promotion)
- Still write eval artifact + append ledger row IF critic PASS
- Still respect Critical Gates 1-8 (loop required / sent-and-measured / source sequence / one channel+segment / no fabricated replies / deliverability+compliance evidence / explicit confidence / no outreach authorship)
- Still respect Critic Hard Fails 1-12 — including the deliverability/compliance gate, which `--fast` never skips

End artifact must include: `Ran in --fast mode (single-agent per layer, critic no-revise, no learning promotion); rerun without the flag for full critic gate with revision + learning promotion.`

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter evaluate_outreach
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
