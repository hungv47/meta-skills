---
title: Run Eval Loop — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: run-eval-loop
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** orchestrator enters Layer 1 dispatch (after Pre-Dispatch, after Cold Start answers persisted to `context.md`).

---

## Layer sequence

1. If creating a new loop, infer/confirm the domain and run `scaffold-eval-loop.ts "<loop name>" --domain <domain> --no-sync`.
2. Read `program.md`, `context.md`, and any existing `results.tsv` row.
3. **Layer 1 parallel:** Loop Architect + Metric Designer.
4. **Layer 2 sequential:** Scope Guard → Critic.
5. If Critic FAIL, revise only the named failing sections once.
6. Write final `program.md` and `context.md` with required frontmatter.
7. Apply the Quality Feedback Protocol per `_shared/quality-feedback-protocol.md` (promote `keep` learnings, log critic overrides, update dashboard at threshold, flag research artifacts needing downstream eval).
8. Run `manifest-sync` once after the final files are written.
9. Return the loop path, the next recommended strategy/execution/eval skill, quality-feedback action, and status.

## `--fast` behavior

`budget: standard` — `--fast` collapses Layer 1 to single-agent execution and skips the Critic revision cycle on a clean PASS. There is no `deep` tier (loop scaffolding has no deeper mode). **`--fast` does NOT skip** the 5 Critical Gates or the Cold Start when the measurable surface or metric path is unresolved — safety gates supersede the mode downgrade (per stack-wide `mode-resolver.md`).

## Helpers — full flags

- `bun scripts/scaffold-eval-loop.ts "<loop name>" --domain <marketing|product|research> [--no-sync]` — first creation. `--no-sync` skips inline manifest-sync; run sync separately at end of dispatch.
- `bun scripts/append-loop-result.ts "<slug>" --artifact <path> --metric <k> --value <v> --baseline <v> --status <keep|discard|watch|blocked> --description <one-sentence>` — append a per-cycle result row (validated by schema; never hand-edit the TSV).
- `bun scripts/update-quality-dashboard.ts --loop <slug> --latest-cycle <N> ...` — invoke when Quality Feedback Protocol threshold is met.

Full validation rules + per-flag semantics in `_shared/eval-loop-spec.md`.
