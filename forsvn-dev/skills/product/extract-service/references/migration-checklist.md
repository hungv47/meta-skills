---
title: Extract-Service — Migration Checklist
lifecycle: canonical
status: stable
produced_by: extract-service
load_class: PROCEDURE
---

# Migration Checklist

**Load when:** planner-agent sequences the steps; migration-agent applies them.

The caller-by-caller recipe. Brief 06's pattern: *find repeated operational mechanics → separate orchestration/domain rules from shared mechanics → extract one block → replace one caller → verify → migrate remaining callers one by one.* This file is that pattern as a runnable checklist.

---

## Pre-flight (before any code changes)

- [ ] **Caller count ≥ 2** (G6). One caller → `NEEDS_CONTEXT`, stop.
- [ ] **Layer line drawn** — the *how* to extract and the *why/when* to keep are explicit (see [`service-layer-pattern.md`](service-layer-pattern.md)).
- [ ] **Baseline green** (G8) — run the full test suite + build once. Red → `BLOCKED`, stop.
- [ ] **Conventions read** (G3) — module layout, naming, error style, return-shape patterns noted.
- [ ] **Plan approved** — the operator answered `y` at the approval gate. No edits before this.

## Step 0 — Extract the service module

- [ ] Create the service file at the planned path (matches the codebase's module layout).
- [ ] Paste the mechanics block; parameterize per the planned interface — explicit data params, structured return, no caller-branching flags.
- [ ] **No caller is touched yet.**
- [ ] Verify: build + typecheck. Green → continue. Red → revert, stop (the interface itself does not compile).

## Per-caller loop — repeat for each caller, one at a time

For caller K (migrate in the planned order — lowest-risk first):

- [ ] **Replace** the inline mechanics block in caller K with a call to the service.
- [ ] **Leave the *why/when* untouched** — every line of caller K's decision/orchestration code stays byte-for-byte (G7).
- [ ] **No scope creep** — no renaming, reformatting, or unrelated fixes in caller K (G2).
- [ ] **Verify** — run the step's verification command: test scoped to caller K (if the suite allows) + typecheck + build.
  - [ ] **Green** → commit this step ("extract-service: migrate caller K"). Record MIGRATED. Go to the next caller.
  - [ ] **Red** → revert caller K only (`git checkout` that file, or revert the step commit). Record REVERTED. **Stop the loop.** Remaining callers stay PENDING.
- [ ] **No coverage for caller K?** → migrate it, run typecheck + build, record verification as partial, add caller K to "manual verification needed."

## After the loop

- [ ] **All callers MIGRATED** → critic review → assemble report → `DONE`.
- [ ] **Stopped early** (a step went red) → critic review of what landed → report lists migrated vs PENDING callers → `DONE_WITH_CONCERNS` or `BLOCKED`.
- [ ] **Callers PENDING by session size** (not by failure) → report records the stop point → `DONE_WITH_CONCERNS`; a follow-up run resumes at the first PENDING caller (the service module already exists — do not recreate it).

## The rules this checklist enforces

| Rule | Where it bites |
|------|----------------|
| One caller per step (G2) | The per-caller loop never touches two callers before verifying |
| Verify after each change (G4) | Every loop iteration ends with a verification command |
| Preserve behavior (G1) | "Leave the *why/when* untouched" + per-caller verification |
| Rollback awareness (G5) | Backup commit before Step 0; each step is its own commit |
| Two-layer purity (G7) | "Leave the *why/when* untouched" + no caller-branching flags in Step 0 |
| Stop on red | The per-caller loop's Red branch reverts and halts — never push forward |

## Resuming a partial migration

If a prior run left callers PENDING:

1. Confirm the service module from Step 0 still exists and still builds.
2. Re-run the baseline check (G8) — the codebase may have moved.
3. Start the per-caller loop at the first PENDING caller.
4. The new run's artifact references the prior artifact and continues the per-caller table.
