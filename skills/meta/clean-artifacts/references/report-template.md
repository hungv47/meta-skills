---
title: Cleanup Artifacts — Report Template
lifecycle: canonical
status: stable
produced_by: cleanup-artifacts
load_class: PROCEDURE
---

# Report Template

**Load when:** the runner reaches Step 6 (dry-run report) or Step 8 (final report). The orchestrator writes the rendered report to `docs/forsvn/artifacts/meta/records/[YYYY-MM-DD]-cleanup-artifacts-<slug>.md` — dated, slug-suffixed, immutable per-run (lifecycle: snapshot; see `agent-skills/CLAUDE.md` §"Artifact Placement"). Reports accumulate as audit trail; do NOT overwrite prior reports.

---

```markdown
---
skill: clean-artifacts
produced_by: cleanup-artifacts
version: {skill-version}   # matches the running skill's metadata.version
date: {YYYY-MM-DD}
status: done | done_with_concerns | blocked | needs_context
mode: dry-run | apply
scope: <path>
threshold_days: 90
total_candidates: N
total_archived: N (0 when mode == dry-run, critic != pass, or zero candidates)
critic_gate: pass | fail | skipped
provenance:
  skill: clean-artifacts
  run_date: {YYYY-MM-DD}
  input_artifacts:                              # upstream artifacts whose state shapes the output
    - .forsvn/index/manifest.json
  config_sources:                               # runtime configuration sources (not traceable inputs)
    - docs/forsvn/experience/technical.md   # if exists — supplies excluded_paths
  output_eval: null                              # cleanup-artifacts has no downstream eval skill
---

# Cleanup Artifacts Report

## Summary
- Mode: [dry-run | apply]
- Scope: [path]
- Threshold: [N] days
- Total artifacts surveyed: [N]
- KEEP: [N]   STALE: [N]   ORPHAN: [N]   LEGACY: [N]   EPHEMERAL: [N]
- HARD-NEVER overrides applied: [N]
- Total archived this run: [N] (0 if dry-run or critic-blocked)
- Total bytes archived: [X KB / MB]

## Critic Gate
- Verdict: [PASS | FAIL | SKIPPED-because-zero-candidates]
- Spot-check sample: [N candidates checked]
- Live references found: [N]
  - [path → referencing file:line] (if any)

## Per-Candidate Detail
| # | Path | Class | Bytes | Last-mod | Refs | Action | Confirmed? |
|---|------|-------|-------|----------|------|--------|------------|
| 1 | docs/forsvn/artifacts/meta/records/foo.md | STALE | 12KB | 2026-01-15 | 0 | archived | y |
| 2 | docs/forsvn/artifacts/meta/sketches/bar.md | ORPHAN | 4KB | 2025-11-30 | 0 | declined | n |
...

## HARD-NEVER Overrides Applied
- [path] — kept because [canonical / submodule / infrastructure]
...

## Manifest-Sync
- Re-run: [yes/no]
- Manifest delta: [N entries removed, N entries unchanged]

## Operator Decisions
- STALE: [confirmed / declined]
- ORPHAN: [confirmed / declined]
- LEGACY: [confirmed / declined]
- EPHEMERAL: [confirmed / declined]

## Notes
[Any escalations, surprising classifications, references the operator should know about]
```

## Slug convention

Use a kebab-case `<slug>` capturing scope + mode + any salient finding:

- `2026-05-08-cleanup-artifacts-dry-run-full.md`
- `2026-05-08-cleanup-artifacts-apply-research.md`
- `2026-05-08-cleanup-artifacts-apply-blocked.md` (BLOCKED status)
- `2026-05-08-cleanup-artifacts-dry-run-loops.md` (subpath scope)
