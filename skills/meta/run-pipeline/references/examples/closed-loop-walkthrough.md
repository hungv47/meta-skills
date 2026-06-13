---
title: Run Pipeline — Worked Example (full loop + eval-only entry)
lifecycle: canonical
status: stable
produced_by: run-pipeline
load_class: EXAMPLE
---

# Worked Example — "launch hero image"

A condensed but faithful end-to-end run. Operator ask: *"Thread the launch hero image through the whole loop — brief it, render it, and measure whether it lifts the landing-page conversion."*

## 1. Pre-Dispatch

Warm-ish start: `research/icp-research` resolves the audience; no prior loop folder matches. Cold-start remainder (bundled): initiative = "launch hero image", category = `image`, primary metric = LP conversion rate (GA4), surface = `/launch` hero section.

## 2. Scaffold

```bash
bun scripts/scaffold-pipeline.ts "launch hero image" --category image
```

Creates `.forsvn/loops/launch-hero-image/` with `pipeline.md` (6 stages, **Current stage: research**), `results.tsv` (8-col header), `learnings.md`, and the stage dirs.

## 3. Stage walk (each one a dispatch, never inlined)

| Stage | Dispatch | Gate outcome |
|---|---|---|
| research | (already satisfied by `id:icp-research`) — pointer advances with a transition-log line | — |
| brief | `brief-graphic` → `strategy/brief-graphic-…-launch-hero.md`, `decision_state: pending` | human **approves** → advance |
| FORK + execute | registry: 0 `verified` image engines → **Brief-only**; `produce-asset` emits prompts + manifest into `execution/`, `execution_mode: brief-only`, `decision_state: pending` | human renders externally, **approves** |
| ingest | `forsvn-preview attach` re-ingests the rendered PNG → `assets` + `asset_picked` on the execution artifact | — |
| evaluate | `evaluate-asset` scores the **re-ingested asset** vs the brief → `evals/2026-06-04-cycle-1.md` + one `results.tsv` row (`keep`, fidelity 9/10) | — |
| learn | the `keep` row's lesson ("concrete product UI in-frame beat abstract gradient") promotes to `learnings.md` | — |

`pipeline.md`'s transition log now reads one line per arrow; **Current stage: learn (cycle 1 closed)**. Next cycle's brief reads `learnings.md` first.

## 4. The same initiative, eval-only entry

If the operator had asked only *"set up an improvement loop for the launch page conversion"* (no execute/ingest stages wanted):

```bash
# dispatched as: /run-pipeline "launch page conversion" --eval-only
bun scripts/scaffold-eval-loop.ts "launch page conversion" --domain marketing --no-sync
```

Same tree, no `pipeline.md`. Loop Architect + Metric Designer draft `program.md` / `context.md`; Scope Guard + Eval Loop Critic gate them (all dims ≥ 8/10 → PASS). Per-cycle scoring then routes to `evaluate-landing-page`, which appends the `results.tsv` rows. Upgrading later to the full staged pipeline is one idempotent `scaffold-pipeline.ts` run on the same slug.

## What this example pins

- The orchestrator **dispatched** six leaf skills and wrote zero stage content itself.
- Both human gates (brief, execute) recorded a real decision before the pointer moved.
- The evaluator scored the re-ingested asset, not the brief (loop closure).
- Eval-only mode is the same tree and ledger, minus the stage program.
