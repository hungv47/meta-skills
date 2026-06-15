---
title: Run Pipeline — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: run-pipeline
load_class: ANTI-PATTERN
---

# Anti-Patterns

Load at critique time (Layer 2) and before any stage transition.

## 1. Fusing a stage into the orchestrator

**Pattern:** the orchestrator "saves a dispatch" by writing the brief / running the audit / scoring the cycle itself instead of dispatching the stage's leaf skill.

**Why it fails:** single-responsibility skills are what keep each stage independently testable and critic-gated; inlined work bypasses the leaf's own gates (CLOSED-LOOP §2.1, "orchestrate, don't fuse").

**Instead:** every stage dispatches its leaf (`research-*`, `brief-*`/`write-*`, the fork, `evaluate-*`); this skill owns only sequencing + the loop tree.

## 2. Auto-approving a gate

**Pattern:** advancing out of `brief` or `execute` because the output "looks done", or treating Direct-mode rendering as implicit approval.

**Why it fails:** humans own approval (architecture §9.2); an auto-approved pipeline is a broken loop that ships unreviewed assets.

**Instead:** brief/execute outputs land `decision_state: pending`; the pointer advances only on the human's recorded decision.

## 3. Declaring a loop closed without ingest

**Pattern:** running `evaluate` against the brief (or the prompt) because the rendered asset was never re-ingested.

**Why it fails:** the evaluator must score what shipped, not what was asked for — skipping the return-leg makes every learning unfalsifiable.

**Instead:** no ingest → the loop is open; flag `DONE_WITH_CONCERNS` and name the missing return-leg.

## 4. Scaffolding a loop with no metric path

**Pattern:** creating `.forsvn/loops/<slug>/` for a vague initiative ("improve our marketing") with no primary metric + source.

**Why it fails:** a loop without a decision metric can never produce a keep/discard verdict — it accumulates artifacts, not learnings.

**Instead:** eval-only gate 2 — no metric path, no loop; route to `discover` (scope) or `diagnose` (metric decline).

## 5. Skill-centered loop folders

**Pattern:** organizing loop state by producing skill (`docs/forsvn/artifacts/<skill>/…`) instead of by measurable initiative.

**Why it fails:** the next cycle's agent has to reconstruct the initiative from scattered skill outputs — the exact failure the loop tree exists to prevent.

**Instead:** one initiative = one `.forsvn/loops/<slug>/` tree; strategy, execution, evals, ledger, learnings live together.

## 6. Hand-editing the ledger

**Pattern:** fixing or appending `results.tsv` rows by hand instead of `scripts/append-loop-result.ts`.

**Why it fails:** the 8-column schema is the cross-stack contract every `evaluate-*` sibling writes; a hand-edited row silently breaks ingestion and the dashboard.

**Instead:** append via the script (validated); overturn a decision with a follow-up `status: discard` row, never a deletion.
