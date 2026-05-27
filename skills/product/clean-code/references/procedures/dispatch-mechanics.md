# Dispatch Mechanics — clean-code

Multi-agent orchestration, single-agent fallback, and routing rules for the `clean-code` skill. Loaded by SKILL.md at Layer 1 dispatch entry.

## Agent Roster

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

## Execution Layers

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

## Dispatch Protocol

1. **Triage** — determine scope from user intent:
   - "Reorganize files" → structural-scanner only
   - "Remove AI slop" → code-scanner only
   - "Find unused assets" → asset-scanner only
   - "Clean up the codebase" → all four scanners
2. **Layer 1 dispatch** — send brief to relevant scanner agents in parallel. Scanners consume [`../ai-slop-patterns.md`](../ai-slop-patterns.md) and [`../production-waste-patterns.md`](../production-waste-patterns.md) as their pattern catalogs.
3. **Safe removal** — pass all scan results to `safe-removal-agent`. It creates a backup commit, then removes verified-safe targets.
4. **Refactoring** — pass code scanner results + removal results to `refactoring-agent`. It fixes code-level issues.
5. **Validation** — `validation-agent` runs all available checks (tests, types, lint, build).
6. **Critic review** — `critic-agent` checks golden rules compliance. If FAIL, identify the specific change to revert per [`../anti-patterns.md`](../anti-patterns.md) [ANTI-PATTERN] "When the critic FAILs."
7. **Assembly** — compile cleanup report per [`../report-template.md`](../report-template.md) [PROCEDURE]. Save to `.forsvn/artifacts/meta/records/[date]-cleanup-<slug>.md`.

## Routing Rules

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
