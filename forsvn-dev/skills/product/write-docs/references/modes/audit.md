---
title: Docs-Writing — Audit Mode
lifecycle: canonical
status: stable
produced_by: docs-writing
load_class: PROCEDURE
---

# Audit Mode

**Load when:** triggered by "audit docs", "check documentation", or "are docs up to date." This is a staleness-only mode — the writer-agent is SKIPPED. The orchestrator runs scanner → staleness-checker → critic to report findings without making changes.

---

## Execution flow

```
scanner-agent ──────────────── inventory all documentation files
  → staleness-checker-agent ── compare each doc against current codebase
    → critic-agent ──────────── report findings with priority ranking
```

## Output

The orchestrator produces an audit report (not modified documentation). Report shape is at the orchestrator's discretion — there is no enforced template — but a useful default groups findings by priority (security-relevant → setup → architecture → cosmetic), summarizes counts, and links each finding to the doc + section that's stale. Use the priority ranking below to organize.

Suggested report shape (not enforced):

```markdown
# Documentation Audit — YYYY-MM-DD

## Summary
- Docs inventoried: N
- Stale docs found: N
- Security-relevant staleness: N

## Critical findings (security-relevant)
[Auth docs, env var docs, permission rules that are stale — these are security risks]

## High-priority findings (setup-relevant)
[Getting started / installation / configuration that's stale — blocks new users]

## Medium-priority findings (architecture)
[Architecture descriptions, design rationale that's stale — confuses contributors]

## Low-priority findings (cosmetic)
[Screenshots out of date, minor wording drift]
```

## Priority ranking rationale

- **Security-relevant > setup > architecture > everything else.**
- Stale auth docs (e.g., "users get admin role on signup" when the actual code now requires explicit grant) actively mislead users into security-relevant decisions.
- Stale env var docs cause silent misconfigurations in production.
- Stale architecture docs slow contributors but don't break anything.

## When NOT to use audit mode

- **You want updated docs, not a report** — use Route C (sync) instead. Audit only reports; sync writes.
- **You want a fresh doc from scratch** — use the default route. Audit assumes docs exist.

## Critic focus when reviewing audit output

The critic-agent's review heuristics (not new FAIL gates — audit is read-only by definition; "FAIL" here means re-dispatching the staleness-checker for better coverage):

- Every documentation file in the project should be inventoried.
- Every documented claim should be checked against the codebase (sampling allowed for very long docs, but every section ≥1 claim).
- Findings should be sorted by priority (security-relevant first).
- No "fix" should be applied (audit is read-only; if the operator wants fixes, route to sync mode).

## Pre-write step (orchestrator responsibility)

1. Inventory: scan project root + `docs/` + any subdirectory with `.md` files (skip `node_modules`, `dist`, `.git`).
2. Read each doc's frontmatter for `date`/`synced` fields to identify last-known-good timestamps.
3. Pass inventory to staleness-checker-agent with the full codebase as context.
