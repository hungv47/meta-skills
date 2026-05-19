---
title: Fresh-Eyes — Report Template
lifecycle: canonical
status: stable
produced_by: fresh-eyes
load_class: PROCEDURE
---

# Report Template

**Load when:** Step 7 of Execution — writing the dated report to disk. Path: `.forsvn/artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md` (dated, slug-suffixed, immutable per-run; lifecycle: snapshot). Reports accumulate as audit trail — never overwrite a prior report. Operator prunes via `clean-artifacts` when needed.

---

## Frontmatter

```yaml
---
skill: review-work
produced_by: fresh-eyes
version: {skill-version}     # matches running skill's metadata.version (currently 1.0.0)
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
    - .forsvn/artifacts/meta/records/learned-rules.md  # if any rules applied
  output_eval: null            # fresh-eyes is the eval; no downstream eval skill
---
```

## Body template

```markdown
# Review Chain Report

**Artifact**: {what was reviewed — file paths, diff range, or named artifact}
**Date**: {YYYY-MM-DD}
**Mode**: {generalist | specialist (security/perf/correctness) | critic-consensus}
**Rounds**: {how many review cycles — 1 default, 2 if max-loops engaged}

## Verdict: {PASS | FIXED | CRITICAL}

## Issues Found
| # | Severity | Confidence | Location | Problem | Status |
|---|----------|------------|----------|---------|--------|
| 1 | major | 9/10 | file.ts:42 | Off-by-one in loop | Fixed |
| 2 | minor | 8/10 | file.ts:15 | Unused import | Fixed |
| 3 | nit | 6/10 | file.ts:8 | Naming convention | Declined (uncertain) |

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
