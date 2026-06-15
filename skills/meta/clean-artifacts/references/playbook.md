---
title: Cleanup Artifacts Playbook
lifecycle: canonical
status: stable
produced_by: cleanup-artifacts
load_class: PLAYBOOK
---

# Cleanup Artifacts Playbook

## Why this skill exists

Every skill in the stack produces artifacts: briefs, audit reports, eval cycles, sketches, decisions. Over weeks, `docs/forsvn/artifacts/` accumulates files from skills the operator ran once and never touched again, eval loops that wound down, briefs that were superseded by later work. The pile grows past the point where the operator can tell, at a glance, what is still load-bearing and what is dead weight.

Without a disciplined sweep, three things go wrong: (a) future skills' Pre-Dispatch reads bloat as they Read more stale context; (b) the operator loses confidence that the tree reflects current work, which devalues every artifact in it; (c) the manifest drifts from disk reality, and orchestrators start routing on stale state.

This skill is the disciplined sweep. It walks the tree, classifies every file, surfaces references before suggesting removal, and — only with per-category operator confirmation — MOVES candidates to a dated archive. It never deletes. The archive is the safety net.

## Methodology

**Classify first, prompt second.** Every file gets exactly one classification (KEEP / STALE / ORPHAN / LEGACY / EPHEMERAL) using the rules in `cleanup-rules.md`. The classification carries the recommendation; the prompt is just confirmation.

**Critic gate before any operator prompt.** Spot-check 5 random non-KEEP candidates by grepping the tree for references. If anything is live-referenced, the run halts (BLOCKED status) and surfaces the references — the operator never sees a confirmation prompt for a candidate that might break something downstream. This is the single non-skippable safeguard.

**MOVE, never delete.** The destructive action is `mv` into `docs/forsvn/artifacts/.archive/[YYYY-MM-DD]/`. Recoverable. Auditable. The operator who realizes "wait, I needed that" two weeks later finds it in the archive. A separate `--purge-archive` flag (out of scope for v1) is the only path to actual deletion.

**Per-category confirmation, not per-file.** For any cleanup with >5 candidates, per-file prompts are UX collapse. Per-category (Archive STALE? Archive ORPHAN? Archive EPHEMERAL?) gives the operator meaningful granularity without exhausting their attention.

## Principles

- **HARD-NEVER is non-negotiable.** Canonical paths (`brand/`, `research/`, `architecture/`), submodules, session anchors (`tasks.md`, `roadmap.md`), the manifest, and `docs/forsvn/experience/` are never touched regardless of mtime or manifest state. Even on explicit operator request inside this skill. Operators can move them manually outside the skill if they really want to.
- **Recoverability over efficiency.** Moving to a dated archive costs disk; recovering from accidental deletion costs the operator's confidence in every future cleanup run. The archive wins.
- **Audit trail over silence.** Always write the report — even on `--dry-run`, even with zero candidates, even on critic FAIL. The report IS the audit trail.
- **Reference detection is the hard problem.** Filename matches are easy; intent-aware matches (a slug-only mention in a roadmap, a basename in a fresh-eyes record) are where the safety actually lives. The critic gate's grep patterns are spec'd in `cleanup-rules.md` § "Reference-Detection Grep Patterns" — they exist because we have been bitten by both false negatives (archived a file that was cited) and false positives (refused to archive over an irrelevant string match).
- **Stale manifest invalidates the run.** The classifier reads `.forsvn/index/manifest.json` to decide what's KEEP vs ORPHAN. A stale manifest means false ORPHANs everywhere. The runner re-checks manifest mtime and refuses to proceed if it's >1 day stale — operator runs `bun scripts/manifest-sync.ts` first.
- **The orchestrator IS the runner.** This is a single-agent skill — there is no separate "runner" sub-agent dispatched via the Agent tool. The orchestrator follows the procedure in [`procedures/runner.md`](procedures/runner.md) directly. The procedure file exists as a canonical spec, not as a dispatch target.

## History / origin

- **v0:** initial design (May 2026) proposed a separate runner sub-agent. Dropped before ship because file management is mechanical, not multi-perspective — a sub-agent would double dispatch cost without changing the failure mode the critic gate catches.
- **v1.0.0:** single-agent orchestration with built-in critic gate as a sub-routine. `allowed-tools` deliberately excludes `Agent` to enforce the single-agent constraint.
- **Phase 1E refactor (May 16, 2026, still v1.0.0):** body trimmed 441 → 224 lines per the v6 program. Procedure spec moved to `references/procedures/runner.md` (was `agents/cleanup-runner.md` <!-- lint:reference-ok historical path, retired in Phase 1E -->); the move clarifies that the runner is a spec the orchestrator follows, not a sub-agent it dispatches. Hardening from the prior runner file (path validation, symlink refusal, TIER-3 carve-out, deterministic sampling) preserved verbatim. Per-run report frontmatter gained additive fields (`produced_by`, `provenance`) per Step 7.5 chain hardening; existing fields preserved → backwards-compatible. No version bump — body-diet refactor lands on the meta-skills 2.0 base as a commit, not a release.

## When NOT to use this skill

- **Cleaning dotfolders, caches, package globals** → `clean-machine`. Different scope (developer machine state, not project artifacts) and different risk model (system-wide vs project-local).
- **Refactoring source code** → `clean-code`. Different domain (logic, dead code, readability) and different acceptance gate (tests pass + behavior preserved vs reference grep).
- **Freeing up disk space broadly** → operator uses OS-level tools. This skill optimizes for artifact-tree legibility, not bytes reclaimed.
- **Pruning canonical brand/research/architecture content** → HARD-NEVER. Operators who need to retire canonical content do it manually with git history as the safety net.

## Further reading

- [`cleanup-rules.md`](cleanup-rules.md) — full classification taxonomy, pattern lists, reference-detection grep patterns
- [`procedures/runner.md`](procedures/runner.md) [PROCEDURE] — execution spec the orchestrator follows
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — what the runner must avoid
- [`examples/escalation-walkthrough.md`](examples/escalation-walkthrough.md) [EXAMPLE] — worked example: critic FAIL → BLOCKED → operator fix → re-run → DONE
- [`agent-skills/CLAUDE.md` §"Artifact Placement"](../../../../CLAUDE.md) — the lifecycle taxonomy this skill enforces
- [`_shared/manifest-spec.md`](_shared/manifest-spec.md) — manifest contract the classifier reads
