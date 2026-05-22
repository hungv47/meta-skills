---
name: clean-code
description: "Audits and refactors existing code for readability, maintainability, and dead code removal without changing behavior. Produces `.forsvn/artifacts/meta/records/[date]-cleanup-<slug>.md` and applies fixes in-place. Not for diagnosing business problems (use diagnose) or writing documentation (use write-docs). For writing missing docs after cleanup, see write-docs."
argument-hint: "[file or directory to clean]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "3.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Code Cleanup — Orchestrator

*Productivity — Multi-agent orchestration. Structural cleanup, code-level cleanup, and refactoring — without breaking functionality.*

**Core Question:** "Is this change purely structural with zero behavioral impact?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill exists, methodology, principles, when NOT to refactor.]

## When To Use

- Codebase has accumulated dead code, AI slop, unused dependencies, or production-waste assets.
- After major feature additions, before release milestones, when test runtime grows.
- When onboarding new team members and structural cruft slows them down.
- Standalone — no upstream gate required.

## When NOT To Use

- Cleanup is mixed with a feature change (separate commits — always).
- No test coverage AND behavior-preservation matters (write tests first; see [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When NOT to refactor").
- Pre-existing test/build failures unrelated to cleanup (BLOCKED until baseline is green).
- Code that won't change again — if nobody will read or modify it, the investment doesn't pay off.
- The duplication is the same **operational mechanics** repeated across 2+ callers (identical SDK setup, retry loop, I/O plumbing) → use `/extract-service`. `clean-code` removes dead code and slop; it does not design service boundaries.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — this skill is `budget: deep`. Mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) auto-downgrades to `fast` for ≤5-file scopes (→ Single-Agent Fallback path below); `--fast` flag forces single-agent regardless of scope. **Safety gates supersede `--fast`:** the 5 golden rules (Critical Gates below) fire on every run, regardless of mode. Pre-Dispatch fires under `--fast` if test-suite presence + conventions aren't resolvable.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (`.forsvn/artifacts/meta/records/[date]-cleanup-<slug>.md`).
2. Read `.forsvn/index/manifest.json` for prior cleanup runs against the same scope; surface staleness if a recent cleanup already covered this path.
3. Read `.forsvn/experience/technical.md` for prior conventions notes.

## Pre-Dispatch

Run the Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md`).

**Needed dimensions:** codebase path, cleanup intent (dead code / unused deps / asset / refactor / mixed), test suite available, conventions to preserve.

**Read order:**
1. Codebase scan: package manifest, test config, lint config, framework hints (CLAUDE.md, `.editorconfig`, etc.).
2. Experience: `.forsvn/experience/technical.md` for prior conventions notes.

**Prompts:** see [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] for Warm Start (obvious intent), Cold Start (vague invocation), and write-back rules.

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta/records/[date]-cleanup-<slug>.md` (re-run same slug same day → append `-v[N]`)
- **Lifecycle:** `snapshot` (dated, immutable record of one cleanup run)
- **Frontmatter fields:** `skill`, `version`, `date`, `status` (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), `lifecycle`, `produced_by`, `provenance`
- **Required sections:** Scope, Changes Made (≥1 subsection populated), Validation, Critic Verdict. Manual Verification Needed + Rollback when applicable.
- **Consumed by:** `clean-artifacts` (skill, scans filenames for staleness), `review-work` (when reviewing cleanup-touched code), operator (history audit).
- Full template: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Chain Position

Previous: none | Next: none (standalone).

**Re-run triggers:** after major feature additions, before release milestones, when test runtime grows significantly, when onboarding new team members.

## Critical Gates (The 5 Golden Rules)

Before delivering, the critic-agent verifies ALL golden rules pass:

1. **Preserve behavior** — Every change must produce the same observable behavior. If you can't verify this, don't make the change.
2. **Small incremental steps** — One change at a time. Commit between steps. Never combine a refactor with a feature change.
3. **Check existing conventions first** — Before changing anything, read the codebase's existing coding guidelines, linting config, naming patterns, and file structure. Match them.
4. **Test after each change** — Run the test suite after every modification. If tests break, revert and try a smaller step.
5. **Rollback awareness** — Commit before starting. Note the hash. If a change chain gets too complex, revert and try a different approach.

**Additional gate:** Session limits — target ~30 changes per cleanup session. After 15 changes, generate an interim summary. If each fix spawns 2+ new issues, stop and reassess.

**If any golden rule fails:** the critic identifies the specific change that violated it and recommends reverting. Never silently bypass — the rules are the safety contract. Full failure-handling flow: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When the critic FAILs."

**Safety supersedes `--fast`:** all 5 rules fire under `--fast`, single-agent fallback, and dry-run modes. Mode-resolver's safety-gates-supersede contract applies.

## Multi-Agent Architecture

### Agent Roster

| Agent | File | Focus |
|-------|------|-------|
| structural-scanner-agent | `agents/structural-scanner-agent.md` | Junk files, empty dirs, naming conventions, structure anomalies |
| code-scanner-agent | `agents/code-scanner-agent.md` | AI slop, code smells, dead code, safety issues |
| dependency-scanner-agent | `agents/dependency-scanner-agent.md` | Unused packages, duplicates, security vulnerabilities |
| asset-scanner-agent | `agents/asset-scanner-agent.md` | Unused/broken/duplicate assets, test files in prod, unoptimized media, dead route-level code |
| safe-removal-agent | `agents/safe-removal-agent.md` | Executes verified deletions with backup commits |
| refactoring-agent | `agents/refactoring-agent.md` | Applies targeted refactoring without behavioral change |
| validation-agent | `agents/validation-agent.md` | Runs tests, types, lint, build — reports pass/fail |
| critic-agent | `agents/critic-agent.md` | Golden rules compliance, behavioral preservation review |

### Execution Layers

```
Layer 1 (parallel):
  structural-scanner-agent ───┐
  code-scanner-agent ─────────┤── scan simultaneously
  dependency-scanner-agent ───┤
  asset-scanner-agent ────────┘

Layer 2 (sequential):
  safe-removal-agent ──────────── removes verified targets from all 4 scans
    → refactoring-agent ───────── applies code-level fixes from code scanner
      → validation-agent ──────── runs all checks
        → critic-agent ─────────── final golden rules review
```

### Dispatch Protocol

1. **Triage** — determine scope from user intent:
   - "Reorganize files" → structural-scanner only
   - "Remove AI slop" → code-scanner only
   - "Find unused assets" → asset-scanner only
   - "Clean up the codebase" → all four scanners
2. **Layer 1 dispatch** — send brief to relevant scanner agents in parallel. Scanners consume [`references/ai-slop-patterns.md`](references/ai-slop-patterns.md) and [`references/production-waste-patterns.md`](references/production-waste-patterns.md) as their pattern catalogs.
3. **Safe removal** — pass all scan results to `safe-removal-agent`. It creates a backup commit, then removes verified-safe targets.
4. **Refactoring** — pass code scanner results + removal results to `refactoring-agent`. It fixes code-level issues.
5. **Validation** — `validation-agent` runs all available checks (tests, types, lint, build).
6. **Critic review** — `critic-agent` checks golden rules compliance. If FAIL, identify the specific change to revert per [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When the critic FAILs."
7. **Assembly** — compile cleanup report per [`references/report-template.md`](references/report-template.md) [PROCEDURE]. Save to `.forsvn/artifacts/meta/records/[date]-cleanup-<slug>.md`.

### Routing Rules

| Condition | Route |
|-----------|-------|
| User says "structural only" | Only dispatch structural-scanner → safe-removal → validation → critic |
| User says "code-level only" | Only dispatch code-scanner → refactoring → validation → critic |
| User says "refactor this" | Only dispatch code-scanner → refactoring → validation → critic |
| User says "unused assets", "production waste", "what's shipping that shouldn't be" | Only dispatch asset-scanner → safe-removal → validation → critic |
| User says "clean up everything" | All scanners → safe-removal → refactoring → validation → critic |
| Validation fails | Identify which change broke it; revert that specific change |
| Critic PASS | Assemble report and deliver |
| Critic FAIL | Revert specific change; re-run validation |
| Session >30 changes | Stop and reassess scope |

For an annotated full-codebase walkthrough (Express API, all 4 scanners + Layer 2 + critic decisions): [`references/examples/cleanup-walkthrough.md`](references/examples/cleanup-walkthrough.md) [EXAMPLE].

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast` (≤5-file scope, context-constrained, or `--fast` flag):

1. Skip multi-agent dispatch.
2. Create backup commit.
3. Scan the target files for structural issues, code smells, and dead code.
4. Apply fixes one at a time, testing after each.
5. Run all available checks.
6. Verify golden rules compliance as self-review.
7. Save to `.forsvn/artifacts/meta/records/[date]-cleanup-<slug>.md`.

The 5 golden rules + Pre-Dispatch test-suite gate fire in fallback mode regardless — safety contract is mode-independent.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before applying any change that smells off — large batch, behavioral side-effect, untested deletion, convention override, generated-code touch. The "When NOT to refactor" exit conditions also live there.

## Next Step

Run `/review-work` for a fresh-eyes quality review on cleanup-touched code.

## Completion Status

Every run ends with explicit status:

- **DONE** — all approved removals applied, behavior preserved (tests + lint + build PASS), critic PASS.
- **DONE_WITH_CONCERNS** — cleanup applied but some validation skipped (no test suite, pre-existing build break, manual verification required); report flags what wasn't checked.
- **BLOCKED** — pre-existing test/build failures unrelated to cleanup; pause so the baseline can be fixed before proceeding (otherwise rollback signal is unreliable).
- **NEEDS_CONTEXT** — codebase conventions unclear (no framework detected, mixed language stack, ambiguous test runner); ask user before scanning.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why, methodology, principles, when NOT to refactor, history
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (canonical at `references/`, synced)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior + safety-gates-supersede contract
- [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold prompts verbatim
- [`references/ai-slop-patterns.md`](references/ai-slop-patterns.md) — code-scanner-agent's pattern catalog (comments, defensive code, types, structural, frontend AI slop)
- [`references/production-waste-patterns.md`](references/production-waste-patterns.md) — asset-scanner-agent's pattern catalog
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes + When NOT to refactor + When the critic FAILs
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — artifact frontmatter + section template + filename conventions
- [`references/examples/cleanup-walkthrough.md`](references/examples/cleanup-walkthrough.md) [EXAMPLE] — Express API cleanup end-to-end
- `scripts/analyze_codebase.py` — Static analysis tool that generates dependency reports, identifies junk files, empty directories, large directories, potentially unused code files, unused/broken/duplicate assets, and unoptimized media. Used by structural-scanner-agent, dependency-scanner-agent, and asset-scanner-agent.
