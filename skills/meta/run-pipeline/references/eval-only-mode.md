---
title: Run Pipeline — Eval-Only Mode (loop-workspace scaffold)
lifecycle: canonical
status: stable
produced_by: run-pipeline
load_class: PROCEDURE
---

# Eval-Only Mode

**Load when:** the invocation is `--eval-only` or an eval-scaffold ask (improvement loop, experiment ledger, eval loop, loop workspace, "where should evals live"). This mode scaffolds and maintains the loop workspace — `program.md`, `context.md`, the `results.tsv` ledger, `learnings.md` — **without** `pipeline.md` or the execute/ingest stages. It preserves the pre-merge eval-loop orchestrator behavior verbatim.

**Core question:** "Can future agents improve this measurable surface by reading one loop folder instead of reconstructing history from scattered skill outputs?"

---

## Mode-specific gates

1. **Measurable surface required.** No nameable page / campaign / post series / ad set / email sequence / outreach motion → `NEEDS_CONTEXT`, recommend `discover` (or `diagnose` if the ask is about an existing metric decline).
2. **Metric path required.** ≥1 primary metric + source (baseline may be unknown). No metric path → no loop.
3. **No skill-centered folders.** Never create `docs/forsvn/artifacts/{skill-name}/...`. Loops are organized by measurable initiative.
4. **Execution boundary.** May execute marketing/content assets. Does NOT deploy code, publish to platforms, build app UI, or mutate external systems.
5. **Human approval gates** publishing and live-surface changes — keep/discard discipline, never a "run forever" posture.

## Pre-Dispatch entry

1. Read `.forsvn/index/manifest.json`. If missing/stale: `bun scripts/manifest-sync.ts`.
2. Inspect existing loops: `find .forsvn/loops -maxdepth 2 -type f 2>/dev/null | sort`.

**Warm Start (matching loop found):** reflect loop path, program status, latest strategy/execution/eval, latest result row; offer override; then resume.

**Cold Start (no loop / missing dimensions)** — one bundled set (do NOT skip under `--fast`; safety gates supersede mode downgrade):

1. **Measurable surface?** page / campaign / ad set / email sequence / social series / other
2. **Primary metric and source?** e.g. conversion rate from GA, CTR from Meta, replies from CRM
3. **Domain?** default-infer from the surface — ask only if ambiguous (`marketing` / `product` / `research`)
4. **Mutable surface?** what can change between cycles — copy / offer / CTA / targeting / creative angle / sequence / format / UX surface
5. **Frozen surface?** what must stay fixed — brand, audience, budget, channel, product facts, compliance
6. **Baseline or first measurement window?** "unknown yet" allowed if source is known

Write answers to `context.md`, update `program.md`, then dispatch.

## Dispatch sequence

1. New loop: confirm the domain, run `bun scripts/scaffold-eval-loop.ts "<loop name>" --domain <domain> --no-sync`.
2. Read `program.md`, `context.md`, any existing `results.tsv` rows.
3. **Layer 1 parallel:** Loop Architect (`agents/loop-architect-agent.md`) + Metric Designer (`agents/metric-designer-agent.md`).
4. **Layer 2 sequential:** Scope Guard (`agents/scope-guard-agent.md`) → Eval Loop Critic (`agents/eval-loop-critic-agent.md`).
5. Critic FAIL → revise only the named failing sections once.
6. Write final `program.md` and `context.md` with required frontmatter (below).
7. Apply the Quality Feedback Protocol per `_shared/quality-feedback-protocol.md`.
8. Run `manifest-sync` once after the final files are written.
9. Return the loop path, the next recommended strategy/execution/eval skill, quality-feedback action, and status.

`--fast` collapses Layer 1 to single-agent and skips the Critic revision cycle on a clean PASS. **`--fast` does NOT skip** the mode-specific gates or the Cold Start when the measurable surface or metric path is unresolved.

## Helpers

- `bun scripts/scaffold-eval-loop.ts "<loop name>" --domain <marketing|product|research> [--no-sync]` — first creation; idempotent.
- `bun scripts/append-loop-result.ts "<slug>" --artifact <path> --metric <k> --value <v> --baseline <v> --status <keep|discard|watch|blocked> --description <one-sentence>` — append a per-cycle result row (validated; never hand-edit the TSV).
- `bun scripts/update-quality-dashboard.ts --loop <slug> --latest-cycle <N> ...` — at the Quality Feedback Protocol threshold.

## Loop-file conventions

**`program.md` frontmatter (required):** `skill: run-pipeline` · `version: 1` · `date` · `status` · `summary` · `purpose` · `lifecycle: loop` · `use_when` / `do_not_use_when` · `upstream` / `downstream`.

**`context.md`:** same shape, `lifecycle: loop-context` — surface + ICP + product + competitor context the loop operates against.

**`learnings.md`:** `lifecycle: learning`; append-only; each promoted entry cites the `results.tsv` row that earned it.

**`results.tsv`:** 8-column header written by `scaffold-eval-loop.ts`; rows appended by `append-loop-result.ts`. Per-cycle scoring rows are written by `evaluate-*` siblings, not by this orchestrator. Full column spec + validation: `_shared/eval-loop-spec.md` § "results.tsv schema".

**Re-run / resume:** loop folder is keyed by slug — same slug resumes, new initiative = new slug. `program.md` is amended in place; `results.tsv` is append-only (overturn a decision with a follow-up `status: discard` row, never delete).

## Upgrading a loop to a full pipeline

An eval-only loop upgrades in place: `bun scripts/scaffold-pipeline.ts "<same name>"` adds `pipeline.md` to the existing tree (idempotent — it never clobbers). Nothing else moves.
