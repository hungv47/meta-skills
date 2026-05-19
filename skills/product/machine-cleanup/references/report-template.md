---
title: Machine-Cleanup — Report Template
lifecycle: canonical
status: stable
produced_by: machine-cleanup
load_class: PROCEDURE
---

# Report Template

**Load when:** Step 6 (Assembly). Save the cleanup report to `.agents/skill-artifacts/meta/records/machine-cleanup-[YYYY-MM-DD]-<slug>.md`. On re-run with the same slug on the same day: rename existing to `machine-cleanup-[date]-<slug>.v[N].md` and create new with incremented version. Different days produce new dated files automatically.

---

## Frontmatter

Baseline required fields: `skill`, `version`, `date`, `status`, `total_reclaimed`.
Step 7.5 additions (manifest-sync conformance; backfilled going forward): `lifecycle`, `produced_by`, `provenance`.

```yaml
---
skill: machine-cleanup
version: {N}
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
total_reclaimed: "X.X GB"
# Step 7.5 fields (artifact-graph hardening; backfilled going forward):
lifecycle: snapshot
produced_by: machine-cleanup
provenance:
  skill: machine-cleanup
  run_date: YYYY-MM-DD
  input_artifacts: []
---
```

## Body sections

```markdown
# Machine Cleanup Report

## Scope
[Home / Caches / Runtimes / Packages / All]

## Summary
- Targets surveyed: N
- Targets nuked: N
- Targets kept: N
- Total disk reclaimed: X.X GB
- Auth re-logins required: [list]
- Reinstall commands queued: [list]

## Targets Nuked
| # | Path | Class | Size | Owner | User loses |
|---|------|-------|------|-------|------------|
| 1 | ~/.foo | abandoned | 200M | foo-cli (uninstalled) | nothing |
...

## Targets Kept
| # | Path | Class | Reason |
|---|------|-------|--------|
| 1 | ~/.aws | load-bearing | AWS credentials |
...

## Side Effects Fixed
- ~/.zshenv: commented out `. "$HOME/.cargo/env"` (target nuked)
- ...

## Re-Auth Commands
After this cleanup, the following tools will need re-authentication:
- `gh auth login` (nuked ~/.config/gh)
- ...

## Critic Verdict
[PASS / FAIL — golden rules summary; specific violations + restorations if any]

## Manual Follow-ups
[Anything the user opted to defer — usually user-data dirs they want to triage themselves]
```

## Required vs. optional sections

- **Required (baseline):** Scope, Summary.
- **Required when applicable (baseline):** Targets Nuked (omit if dry-run or user rejected all recommendations), Targets Kept (omit only if Scope was "all" and no targets survived which is unrealistic), Side Effects Fixed (omit if no shell-rc lines touched), Re-Auth Commands (omit if no auth-bearing targets nuked), Manual Follow-ups (omit if no deferrals).
- **Optional (added in v6 refactor; backfilled going forward):** Critic Verdict — recommended for traceability of golden-rules compliance; safe to omit on legacy runs.

## Filename conventions

- **First run a given day:** `machine-cleanup-YYYY-MM-DD-<slug>.md` (e.g., `machine-cleanup-2026-05-17-aitool-purge.md`).
- **Second run same slug same day:** append `-v2`; subsequent `-v3`, etc.
- **Different day:** new file with the day's date; no `-v` suffix needed unless multi-run that day.
- **Slug picks a memorable identifier** from operator intent or scope (e.g., `caches-only`, `full-audit`, `aitool-purge`, `fresh-laptop`).

## Version increment rule

The active artifact is always the latest dated file. Previous versions stay as-is for audit trail; never overwrite. `cleanup-artifacts` (meta-skill) scans dated filenames for staleness signals.

## Cross-skill propagation

Downstream consumers:
- `cleanup-artifacts` (meta-skill) — scans recent machine-cleanup reports for the same dotfolder appearing repeatedly (signal: operator's tools-tried-and-abandoned rate is high).
- `orchestrate-product` state detection — reads cleanup mtime to flag stale records (>30 days suggests another run is due).
- Operator history audit — class distribution + reclaim trend over time.
