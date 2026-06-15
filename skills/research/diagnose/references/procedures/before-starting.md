# Before-Starting Procedure — diagnose

Canonical pre-dispatch read pattern extracted from SKILL.md (Phase 1.6 compaction). Load at orchestrator entry, before Pre-Dispatch.

## Apply order

Apply the [before-starting-check](../_shared/before-starting-check.md) [PLAYBOOK], then:

### 0. Mode resolution

Per [`../_shared/mode-resolver.md`](../_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: deep`.

- `--fast` collapses the critic gate to a single pass within the chosen route — it does NOT auto-trigger Route A.
- Route A is a **user-confirmation gate** (operator must explicitly confirm skipping the external-factor scan per original semantics, preserving Critical Gate 2).
- **Cold Start STILL fires under `--fast`** — diagnose ALWAYS cold-starts. The 4 questions ARE the work; safety gates supersede mode-resolver downgrade.

### 1. Canonical path check

Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (`docs/forsvn/canonical/research/DIAGNOSE.md`).

### 2. Prior-run staleness check

Resolve `id:diagnose` via `find-artifacts --resolve diagnose` — if `DIAGNOSE.md` already exists, this run is a re-run (overwrite-in-place signal); read it for context.

Original SKILL.md "Re-run triggers" (metric shifts significantly, new data surfaces, prioritize initiative killed) are **operator-judgment** — do not auto-emit staleness warnings.

### 3. Pre-Dispatch

Run Pre-Dispatch per [`./pre-dispatch.md`](./pre-dispatch.md) [PROCEDURE] — always-cold-start contract, 4-question Cold Start prompt, read order, staleness check, Write-back map (Q1-Q4 → goals.md, verbatim from original — Q1-Q3 persist, Q4 does NOT) all there.
