---
title: Code-Cleanup Playbook
lifecycle: canonical
status: stable
produced_by: code-cleanup
load_class: PLAYBOOK
---

# Code-Cleanup Playbook

## Why this skill exists

Codebases rot in predictable ways: dead code accumulates, AI-generated boilerplate piles up, unused dependencies stay locked in `package.json`, assets ship to production no one reads. The cost isn't immediate — it's slowed onboarding, longer test runs, larger bundles, security exposure from outdated transitive deps. Every codebase reaches a point where someone has to clean up. The temptation is to do it as side-effect work during feature development; that's how cleanup becomes a behavior-change incident.

This skill exists to make cleanup safe: pure structural change, never behavioral change. Five hard golden rules act as guardrails. Multi-agent orchestration (4 scanners + safe-removal + refactoring + validation + critic) ensures every removal is verified, every change is testable, every step is reversible.

## Methodology

**Scan first, decide second, execute third — never invert.** Layer-1 scanners (structural, code, dependency, asset) run in parallel and produce findings. Only after all four report does Layer-2 begin removing or refactoring. Pre-removal decisions made on partial scans miss the cross-cutting dependencies.

**Behavior preservation is non-negotiable.** Every change must produce the same observable behavior. If the test suite can't verify that, flag DONE_WITH_CONCERNS and surface what wasn't checked — don't paper over the gap.

**Small batches always.** Target ~30 changes per session; interim summary at 15. If each fix spawns 2+ new issues, stop and reassess scope — that's a sign the codebase needs structural redesign (use `system-architecture`), not cleanup.

**Conventions over personal taste.** Read `.editorconfig`, lint config, existing patterns before flagging anything as a smell. Existing patterns are intentional unless evidence proves otherwise. The code-scanner reads surrounding code before flagging.

**Critic-agent fires on every run.** All 5 golden rules verified before delivery. FAIL means revert the specific change, not "the cleanup didn't work."

## Principles

- **The 5 golden rules are the contract.** Preserve behavior. Small incremental steps. Check conventions first. Test after each change. Rollback awareness. Documented as hard safety gates in the SKILL body; they fire under `--fast` and supersede mode-resolver downgrade.
- **Standalone — no upstream gate.** `code-cleanup` reads only source code; no spec, no architecture artifact required. This makes it composable with any project state.
- **Asset scanning is first-class.** Production-waste (unreferenced images, unoptimized media, test fixtures in `public/`) is real shipping cost. The asset-scanner agent surfaces these even when the operator didn't ask.
- **AI slop is a specific category.** Comments restating identifiers, defensive code around guaranteed inputs, type casts hiding real mismatches, premature abstractions — patterns the model produces by default. See `references/ai-slop-patterns.md` for the catalog the code-scanner uses.
- **No test suite → DONE_WITH_CONCERNS.** Skip auto-validation, surface what wasn't checked. Don't ship clean-looking output that hides risk.
- **Pre-existing test failures → BLOCKED.** Without a green baseline, rollback signal is unreliable. Pause until the baseline is fixed.

## When NOT to refactor

The refactoring-agent skips these situations:

- **No test coverage** — you can't verify behavior is preserved. Write tests first.
- **Tight deadline** — ship first, refactor later.
- **Code that won't change again** — if nobody will read or modify it, the investment doesn't pay off.
- **During a feature change** — separate commits. Always.

## History / origin

- **v3.0.0 baseline:** 8 agents, 4 parallel scanners, asset-scanner added for production-waste detection. 5 golden rules locked as the safety contract.
- **v6 Phase 2 Wave 1 refactor (May 17, 2026, still v3.0.0):** body trimmed 296 → target ≤200 lines per the v6 program; Warm/Cold Pre-Dispatch prompts, AI Slop Patterns body section (duplicate of `ai-slop-patterns.md`), When NOT to Refactor, Anti-Patterns table, Worked Example, Artifact Template all extracted to refs; Triage section deleted (was a triple-duplicate of Dispatch Protocol + Routing Rules); mode-resolver wired with safety-gates-supersede-`--fast` per the 5-golden-rules contract; Before-Starting check + Artifact Contract block added. The 5 Critical Gates + Multi-Agent Architecture (Roster + Execution Layers + Dispatch Protocol + Routing Rules) preserved verbatim in body — these ARE behavior, not docs. No version bump — refactor lands on product-skills 2.0 base as a commit, not a release.

## Further reading

- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes + "When NOT to refactor" exit conditions
- [`ai-slop-patterns.md`](ai-slop-patterns.md) — catalog the code-scanner-agent consumes (comments, defensive code, type issues, structural patterns, frontend AI slop)
- [`production-waste-patterns.md`](production-waste-patterns.md) — catalog the asset-scanner-agent consumes (broken assets, test fixtures in prod, unoptimized media, dead route-level code)
- [`pre-dispatch-prompts.md`](pre-dispatch-prompts.md) [PROCEDURE] — Warm Start + Cold Start prompts verbatim
- [`report-template.md`](report-template.md) [PROCEDURE] — artifact frontmatter + section template
- [`examples/cleanup-walkthrough.md`](examples/cleanup-walkthrough.md) [EXAMPLE] — full Express API cleanup, all 4 scanners + Layer 2
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (deep-tier skill; `--fast` runs Single-Agent Fallback but still enforces 5 golden rules per the safety-gates-supersede rule)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec
