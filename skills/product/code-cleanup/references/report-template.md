---
title: Code-Cleanup — Report Template
lifecycle: canonical
status: stable
produced_by: code-cleanup
load_class: PROCEDURE
---

# Report Template

**Load when:** Step 7 (Assembly). Save the cleanup report to `.agents/skill-artifacts/meta/records/[date]-cleanup-<slug>.md`. On re-run with the same slug on the same day, append `-v[N]` to the dated filename — e.g., `2026-05-17-cleanup-api-v2.md`. Different days produce new dated files automatically.

---

## Frontmatter

Baseline required fields: `skill`, `version`, `date`, `status`.
Step 7.5 additions (manifest-sync conformance; backfilled going forward): `lifecycle`, `produced_by`, `provenance`.

```yaml
---
skill: code-cleanup
version: {skill-version}
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
# Step 7.5 fields (artifact-graph hardening; backfilled going forward):
lifecycle: snapshot
produced_by: code-cleanup
provenance:
  skill: code-cleanup
  run_date: YYYY-MM-DD
  input_artifacts: []
  output_eval: []
---
```

## Body sections

```markdown
# Cleanup Report

## Scope
[Structural / Code-Level / Refactoring / All]

## Changes Made
### Structural
[Junk files removed, naming normalized, structure anomalies fixed]

### Code-Level
[AI slop removed, code smells fixed, dead code deleted, safety issues resolved]

### Dependencies
[Unused packages removed, duplicates consolidated, security upgrades]

### Assets
[Broken assets removed, test fixtures purged from prod, unoptimized media replaced]

### Refactoring
[Extractions, consolidations, naming changes — each with rationale]

## Validation
- Tests: [PASS/FAIL — count + framework]
- Type check: [PASS/FAIL/SKIPPED — tool]
- Lint: [PASS/FAIL/SKIPPED — tool]
- Build: [PASS/FAIL/SKIPPED — tool]

## Manual Verification Needed
[Features lacking test coverage; uncovered branches; deletions made with low confidence]

## Critic Verdict
[PASS / FAIL — golden rules summary]

## Rollback
- Backup commit: `<sha>`
- Reverted changes: [list, if any]
```

## Filename conventions

- **First run today:** `YYYY-MM-DD-cleanup-<slug>.md`
- **Second run same slug same day:** `YYYY-MM-DD-cleanup-<slug>-v2.md`
- **Subsequent same day:** `-v3`, `-v4`, etc.
- **Different day:** new file with the day's date (no `-v` suffix needed unless multi-run that day).

The dated filename is the artifact-graph hardening contract — readable filename, scannable date prefix, slug for at-a-glance scope identification. Don't deviate; downstream `cleanup-artifacts` audits scan filenames for these patterns.

## Required vs. optional sections

- **Required:** Scope, Changes Made (at least one subsection populated), Validation, Critic Verdict.
- **Required when applicable:** Manual Verification Needed (omit if all changes had test coverage); Rollback (omit if no backup commit was needed, e.g., dry-run mode).
- **Skip:** subsections under Changes Made that didn't apply (e.g., no asset changes → omit `### Assets`).
