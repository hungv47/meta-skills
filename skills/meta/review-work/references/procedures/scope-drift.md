---
title: Fresh-Eyes — Scope Drift Detection
lifecycle: canonical
status: stable
produced_by: fresh-eyes
load_class: PROCEDURE
---

# Scope Drift Detection

**Load when:** `docs/forsvn/artifacts/meta/tasks.md` OR `docs/forsvn/artifacts/meta/specs/*.md` exists in the project (orchestrator detects this in Step 1 of Execution). When present, the reviewer adds a scope check on top of the standard correctness/edge-cases/simplification/security/consistency review.

---

## Procedure

After reviewing code quality, compare the implementation against the stated requirements:

1. **Read `docs/forsvn/artifacts/meta/tasks.md`** if it exists.
   - Are all tasks addressed by the diff?
   - Are there changes in the diff that don't map to any task?
2. **Read `docs/forsvn/artifacts/meta/specs/*.md`** if any exist.
   - Does the implementation match the spec?
   - Are there requirements that were missed?
   - Are there scope additions in the diff that weren't planned?

## Report format

Report scope drift findings SEPARATELY from code-quality findings — they have different status semantics:

```
SCOPE DRIFT:
- MISSING: [requirement from spec/tasks not found in the code]
- UNPLANNED: [code change that doesn't map to any requirement — may be scope creep]
```

## Status semantics

Scope drift findings are **informational, not blocking** — the operator decides whether the drift is intentional. Fresh-eyes does not auto-fail on MISSING or UNPLANNED.

Reasons the operator might accept MISSING:
- The requirement was descoped mid-build by operator decision (verbal change, not yet in spec)
- The requirement is being delivered in a follow-up PR
- The spec.md is stale and the requirement is actually obsolete

Reasons the operator might accept UNPLANNED:
- Necessary refactor surfaced during build (e.g., the new feature exposed a pre-existing bug that had to be fixed first)
- Cross-cutting cleanup the operator authorized but didn't task-track
- Scope expansion the operator decided is worth it

Reasons drift is a problem:
- Implementation diverged silently from the spec — risk of mismatch with downstream consumers
- "While I was in here" creep — adds review surface, regression risk, future-maintainer confusion
- Missing requirement actually IS load-bearing but got dropped (this is the bug-shipped failure mode)

## Where it goes in the report

The fresh-eyes report has a dedicated section for scope drift (see [`../report-template.md`](../report-template.md)). The operator scans this section AFTER the code-quality findings — first they decide what to fix on quality grounds, then they decide whether the scope shape is acceptable.

## When NOT to run scope-drift detection

- Neither `tasks.md` nor `specs/*.md` exists → no baseline to compare against, skip.
- Operator is reviewing a third-party PR (the spec isn't theirs to validate).
- "Review this snippet" / "check my work" style invocations where there's no defined scope at all — just review code quality.

## Anti-pattern: forcing a tiebreaker on drift

The reviewer's job is to FLAG drift, not to judge whether the drift is OK. Don't escalate UNPLANNED findings to MAJOR severity unless the unplanned change is also a code-quality problem (e.g., the unplanned auth-bypass workaround is both UNPLANNED AND a security vulnerability — that gets MAJOR severity for the security finding, separately INFO for the scope drift).
