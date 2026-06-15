---
title: Extract-Service — Report Template
lifecycle: canonical
status: stable
produced_by: extract-service
load_class: PROCEDURE
---

# Report Template

**Load when:** the planner-agent finishes (write the Migration Plan half — before the approval gate), and again at Step 7 Assembly (append the Applied Migration half). Save to `docs/forsvn/artifacts/product/extract-service/[date]-[slug].md`. On re-run with the same slug on the same day, append `-v[N]` — e.g., `2026-05-20-extract-service-sandbox-v2.md`.

The artifact is **one file with two halves**. The Migration Plan is written first and is the whole artifact for a plan-only outcome (operator declined the approval gate). The Applied Migration half is appended after the migration runs.

---

## Frontmatter

```yaml
---
skill: extract-service
version: {skill-version}
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
lifecycle: snapshot
produced_by: extract-service
provenance:
  skill: extract-service
  run_date: YYYY-MM-DD
  input_artifacts: []          # extract-service reads source code, not artifacts — usually empty
  output_eval: []
---
```

## Body sections

```markdown
# Extract-Service Report — <slug>

## Scope
- Target: [file/dir scanned]
- Repeated mechanics: [one line — what the duplicated block does]
- Callers: [N]
- Outcome: [Plan-only — operator declined / Migrated / Partially migrated]

---

# Migration Plan

## Layer Split
**Extracted (the `how`):** [the operational mechanics moved to the service]
**Kept in callers (the `why/when`):** [the orchestration/domain logic that stayed]

## Service Interface
- Location: [path of the new service module]
- Signature: [the exported function(s) — params + return shape]
- Why each param: [each caller-difference → param mapping]

## Drift Resolutions
| Drift found | Resolution | Behavior change? |
|-------------|------------|------------------|
| [caller divergence] | [how it was handled] | [No — preserved / Yes — flagged, operator-approved] |

## Caller Migration Order
| Step | Caller (file:symbol) | Verification command | Rollback point |
|------|----------------------|----------------------|----------------|
| 0 | — (extract module) | [build + typecheck] | backup commit |
| 1 | [path:fn] | [test+typecheck+build] | revert step 1 |

---

# Applied Migration
<!-- omitted entirely for a plan-only outcome -->

## Backup
- Backup commit: `<sha>`

## Per-Caller Results
| Step | Caller (file:symbol) | Status | Verification | Notes |
|------|----------------------|--------|--------------|-------|
| 0 | service module | CREATED | [PASS/FAIL] | [path] |
| 1 | [path:fn] | MIGRATED / REVERTED / PENDING | [PASS/FAIL] | [detail] |

## Validation
- Tests: [PASS/FAIL — count + framework]
- Type check: [PASS/FAIL/SKIPPED — tool]
- Build: [PASS/FAIL/SKIPPED — tool]

## Manual Verification Needed
[Callers with no test coverage; behavior preserved only by typecheck+build — operator should verify]

## Stop Point
[All callers migrated, OR: step K went red / session size — which callers are PENDING and how a follow-up run resumes]

## Critic Verdict
[PASS / FAIL — 8-gate summary + service-design quality]

## Rollback
- Backup commit: `<sha>`
- Reverted steps: [list, if any]
```

## Required vs. optional sections

- **Always required:** Scope, Migration Plan (Layer Split, Service Interface, Caller Migration Order).
- **Required when the migration ran:** the entire Applied Migration half — Backup, Per-Caller Results, Validation, Critic Verdict.
- **Omit entirely for a plan-only outcome** (operator answered `N` at the approval gate): the Applied Migration half. The artifact is the plan; status is `DONE`.
- **Required when applicable:** Drift Resolutions (omit if the scan found no drift); Manual Verification Needed (omit if every caller had coverage); Stop Point detail (omit if all callers migrated cleanly); Rollback reverted-steps list (omit if nothing was reverted).

## Filename conventions

- **First run today:** `YYYY-MM-DD-extract-service-<slug>.md`
- **Second run same slug same day:** `YYYY-MM-DD-extract-service-<slug>-v2.md`; then `-v3`, etc.
- **A resume run** (continuing a partial migration) is a new dated file that references the prior artifact in its Scope section.

The dated filename is the artifact-graph contract — scannable date prefix, slug for at-a-glance scope. Downstream `clean-artifacts` audits scan filenames for these patterns; don't deviate.
