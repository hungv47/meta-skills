---
title: Fresh-Eyes — Report Template
lifecycle: canonical
status: stable
produced_by: fresh-eyes
load_class: PROCEDURE
---

# Report Template

**Load when:** Step 7 of Execution — writing the dated report to disk. Path: `docs/forsvn/artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md` (dated, slug-suffixed, immutable per-run; lifecycle: snapshot). Reports accumulate as audit trail — never overwrite a prior report. Operator prunes via `clean-artifacts` when needed.

---

## Frontmatter

```yaml
---
skill: review-work
produced_by: fresh-eyes
version: {skill-version}     # matches the running skill's metadata.version
date: {YYYY-MM-DD}
status: done | done_with_concerns | blocked | needs_context
mode: generalist | specialist | critic-consensus
rounds: N                     # how many reviewer-resolver cycles ran
verdict: PASS | FIXED | CRITICAL
provenance:
  skill: review-work
  run_date: {YYYY-MM-DD}
  input_artifacts:            # what the reviewer read
    - {path to the diff / code / artifact}
    - {path to spec.md if scope-drift ran}
    - {path to tasks.md if scope-drift ran}
  config_sources:
    - docs/forsvn/artifacts/meta/records/learned-rules.md  # if any rules applied
  output_eval: null            # fresh-eyes is the eval; no downstream eval skill
---
```

## Body template

```markdown
# Review Chain Report

**Artifact**: {what was reviewed — file paths, diff range, or named artifact}
**Review target**: {detected target class — working-tree changes / branch vs base / last commit / operator-specified — and the diff command used, e.g. `git diff HEAD`}
**Date**: {YYYY-MM-DD}
**Mode**: {generalist | specialist (security/perf/correctness) | critic-consensus}
**Rounds**: {N — 1 default; a 2nd round runs only when an accepted fix changed code, per review-setup.md § Closeout discipline}

## Verdict: {PASS | FIXED | CRITICAL}

## Commands Run & Proof

| Phase | Command(s) | Result |
|-------|-----------|--------|
| Format (pre-review) | `{formatter command, or "not run — <reason>"}` | {clean / N files reformatted} |
| Test suite (concurrent) | `{test command, or "not auto-detected"}` | {PASS / FAIL (n) / inconclusive — still running} |
| Fix-then-rerun (Accepted findings) | `{rerun commands per noise-filter § Fix-then-rerun, or "n/a — no Accepted findings"}` | {PASS} |

**Final state**: {review clean + tests green | FIXED — N accepted findings, all rerun-verified | CRITICAL — surfaced to operator, not applied}

## Issues Found

Per the 3-category noise-filter (`references/noise-filter.md`): Accepted = real + actionable + fixed; Rejected = filtered as noise (low-confidence / preference / equivalent); Deferred = real but out-of-scope for this pass (follow-up logged).

### Accepted (fixed)
| # | Severity | Confidence | Location | Problem | Fix | Verified |
|---|----------|------------|----------|---------|-----|----------|
| 1 | major | 9/10 | file.ts:42 | Off-by-one in loop | Boundary corrected; loop now `< n` instead of `<= n` | tests pass + type-check ✓ |
| 2 | minor | 8/10 | file.ts:15 | Unused import | Removed | type-check ✓ |

### Rejected (filtered as noise)
One-line each with suppression reason. Empty section reads "_None._"
- **Naming convention on `parseRequest()`** — _suppressed: 6/10 confidence on preference; existing code follows project convention._
- **Comment density on utility module** — _suppressed: pure preference, no falsifiable cost._

### Deferred (real but out-of-scope for this pass)
One-line each with rationale + follow-up pointer. Empty section reads "_None._"
- [major] **Stale ARCHITECTURE.md in unrelated `payments/` module** — **Defer rationale:** unrelated to this auth-handler review; would expand scope. **Follow-up:** `clean-artifacts` pass or a separate doc-review cycle.

## Input Quality Assessment
| Input | Rating | Evidence |
|-------|--------|----------|
| Product/domain context | {Rich/Thin/Missing} | {what was available} |
| Requirements clarity | {Precise/Vague/Absent} | {source} |
| Upstream artifacts | {Fresh/Stale/None} | {what existed} |

## Scope Drift (if applicable — see scope-drift.md)
- MISSING: {requirements not implemented}
- UNPLANNED: {code changes with no matching requirement}

## Simplifications Applied
{What was simplified and why}

## Changes Made
{Summary of what changed between original and final version}

## Self-Regulation Gate
{If triggered: which gate (>30% modified / >10 findings / regression) + what was halted}
{If not triggered: "Passed — resolver output applied."}

## Reviewer's Summary
{The reviewer's overall assessment}

## Resolver's Notes
{Any "DECLINED" decisions and reasoning}

## Specialist Verdicts (if mode == specialist)
- Security: {PASS | ISSUES_FOUND | CRITICAL} — {N findings}
- Performance: {PASS | ISSUES_FOUND | CRITICAL} — {N findings}
- Correctness: {PASS | ISSUES_FOUND | CRITICAL} — {N findings}

## Critic Disagreements (if mode == critic-consensus)
- AGREED: {N findings}
- CRITIC A ONLY: {N findings}
- CRITIC B ONLY: {N findings}
- DISAGREEMENTS: {N — list each + how resolved}
```

## Slug convention

Kebab-case `<slug>` capturing what was reviewed:

- `2026-05-08-fresh-eyes-claude-md-migration.md`
- `2026-05-16-fresh-eyes-jwt-auth-migration.md`
- `2026-05-16-fresh-eyes-csv-export-feature.md`
- `2026-05-16-fresh-eyes-eval-loop-refactor.md`

## Status semantics

- **DONE** — all reviewer findings resolved by resolver, or explicitly marked acceptable; PASS gate met.
- **DONE_WITH_CONCERNS** — non-blocking issues flagged for follow-up (scope drift the operator should review, declined findings worth a second look, critic disagreements that weren't fully resolved). Report names what was deferred and why.
- **BLOCKED** — critical issue surfaced (security, data-loss, broken contract) requiring user judgment before proceeding. Resolver did NOT apply; surfaced to operator. Includes self-regulation-gate-triggered halts.
- **NEEDS_CONTEXT** — review requirements unclear; missing the spec, intent, or acceptance criteria the implementation should be checked against.
