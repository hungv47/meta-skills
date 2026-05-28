---
name: clean-code
description: "Audits and refactors existing code for readability, maintainability, and dead code removal without changing behavior. Produces `.forsvn/artifacts/meta/records/[date]-cleanup-<slug>.md` and applies fixes in-place. Not for diagnosing business problems (use diagnose) or writing documentation (use write-docs). For writing missing docs after cleanup, see write-docs."
argument-hint: "[file or directory to clean]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Code Cleanup — Orchestrator

*Productivity — Multi-agent orchestration. Audits and refactors existing code in-place for readability, maintainability, and dead-code removal — without changing behavior. Produces a dated cleanup record.*

**Core Question:** "Is this change purely structural with zero behavioral impact?"

> Why this skill exists, methodology, principles, when NOT to refactor, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

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
- Duplication is the same **operational mechanics** repeated across 2+ callers (identical SDK setup, retry loop, I/O plumbing) → use `/extract-service`. `clean-code` removes dead code and slop; it does not design service boundaries.

## Critical Gates (The 5 Golden Rules)

Before delivering, the critic-agent verifies ALL golden rules pass:

1. **Preserve behavior** — Every change must produce the same observable behavior. If you can't verify this, don't make the change.
2. **Small incremental steps** — One change at a time. Commit between steps. Never combine a refactor with a feature change.
3. **Check existing conventions first** — Read the codebase's existing coding guidelines, linting config, naming patterns, and file structure. Match them.
4. **Test after each change** — Run the test suite after every modification. If tests break, revert and try a smaller step.
5. **Rollback awareness** — Commit before starting. Note the hash. If a change chain gets too complex, revert and try a different approach.

**Additional gate:** Session limits — target ~30 changes per cleanup session. After 15 changes, generate an interim summary. If each fix spawns 2+ new issues, stop and reassess.

**If any golden rule fails:** the critic identifies the specific change that violated it and recommends reverting. Never silently bypass — the rules are the safety contract. Full failure-handling flow: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When the critic FAILs."

**Safety supersedes `--fast`:** all 5 rules fire under `--fast`, single-agent fallback, and dry-run modes (per mode-resolver safety-gates-supersede contract).

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

| Step | Action |
|---|---|
| 0 | **Mode resolution** — `budget: deep`. Mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) auto-downgrades to `fast` for ≤5-file scopes (→ Single-Agent Fallback in dispatch-mechanics); `--fast` flag forces single-agent. Safety gates supersede `--fast`. |
| 1 | Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory. |
| 2 | Read `.forsvn/index/manifest.json` for prior cleanup runs against the same scope; surface staleness if recent cleanup already covered this path. |
| 3 | Read `.forsvn/experience/technical.md` for prior conventions notes. |

## Pre-Dispatch

Run the Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md`).

**Needed dimensions:** codebase path, cleanup intent (dead code / unused deps / asset / refactor / mixed), test suite available, conventions to preserve.

**Read order:** (1) codebase scan — package manifest, test config, lint config, framework hints (CLAUDE.md, `.editorconfig`); (2) `.forsvn/experience/technical.md` for prior conventions notes.

Warm Start (obvious intent), Cold Start (vague invocation), and write-back rules: [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE].

## Routing + Dispatch

Multi-agent orchestration (8 agents across 2 layers: 4 parallel scanners → safe-removal → refactoring → validation → critic), triage rules, dispatch protocol, routing-rules table, and single-agent fallback: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

For an annotated full-codebase walkthrough (Express API, all 4 scanners + Layer 2 + critic decisions): [`references/examples/cleanup-walkthrough.md`](references/examples/cleanup-walkthrough.md) [EXAMPLE].

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta-clean-code-<YYYY-MM-DD>-cleanup-<slug>.md` (flat v2 grammar; re-run same slug same day → append `.v[N]`). Stack is `meta` (cleanup records are meta-stack snapshots, like diagnose); skill is in product/ because consumers are product-side.
- **Lifecycle:** `snapshot` (dated, immutable record of one cleanup run).
- **Frontmatter fields:** `skill`, `version`, `date`, `status` (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), `stack` (=meta), `review_surface` (=none — snapshot defaults to `decision_state: not_required`), `lifecycle`, `produced_by`, `provenance`. v2 schema: [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Required sections:** Scope, Changes Made (≥1 subsection populated), Validation, Critic Verdict. Manual Verification Needed + Rollback when applicable.
- **Consumed by:** `clean-artifacts` (scans filenames for staleness), `review-work` (when reviewing cleanup-touched code), operator (history audit).
- Full template: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Chain Position

Previous: none | Next: none (standalone).

**Re-run triggers:** after major feature additions, before release milestones, when test runtime grows significantly, when onboarding new team members.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before applying any change that smells off — large batch, behavioral side-effect, untested deletion, convention override, generated-code touch. "When NOT to refactor" exit conditions also live there.

## Next Step

Run `/review-work` for a fresh-eyes quality review on cleanup-touched code.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

Every run ends with explicit status:

- **DONE** — all approved removals applied, behavior preserved (tests + lint + build PASS), critic PASS.
- **DONE_WITH_CONCERNS** — cleanup applied but some validation skipped (no test suite, pre-existing build break, manual verification required); report flags what wasn't checked.
- **BLOCKED** — pre-existing test/build failures unrelated to cleanup; pause so the baseline can be fixed before proceeding (otherwise rollback signal is unreliable).
- **NEEDS_CONTEXT** — codebase conventions unclear (no framework detected, mixed language stack, ambiguous test runner); ask user before scanning.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why, methodology, principles, when NOT to refactor, history
- [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE] — agent roster, execution layers, dispatch protocol, routing rules, single-agent fallback
- [`references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, artifact-contract-template}.md`](references/_shared/) — canonical shared specs
- [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold prompts verbatim
- [`references/ai-slop-patterns.md`](references/ai-slop-patterns.md) — code-scanner pattern catalog
- [`references/production-waste-patterns.md`](references/production-waste-patterns.md) — asset-scanner pattern catalog
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes + When NOT to refactor + When the critic FAILs
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — artifact frontmatter + section template + filename conventions
- [`references/examples/cleanup-walkthrough.md`](references/examples/cleanup-walkthrough.md) [EXAMPLE] — Express API cleanup end-to-end
- `scripts/analyze_codebase.py` — static analysis tool used by structural-scanner, dependency-scanner, asset-scanner (junk files, empty dirs, large dirs, unused code, unused/broken/duplicate assets, unoptimized media)
