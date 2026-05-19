---
title: Machine-Cleanup Playbook
lifecycle: canonical
status: stable
produced_by: machine-cleanup
load_class: PLAYBOOK
---

# Machine-Cleanup Playbook

## Why this skill exists

Developer machines accumulate state. Every CLI tool installed, every AI assistant tried-and-abandoned, every dependency manager invoked, every cloud SDK downloaded — leaves behind dotfolders, caches, runtimes, package globals, and shell-rc references. After a year of normal dev work, `$HOME` contains hundreds of GB of state, half of which is owned by tools the operator no longer uses. Disk fills, `du -sh ~/.*` returns terrifying numbers, fresh laptops would be cleaner.

The temptation is to bulk-delete `~/.*` or write an aggressive sweep script. Both lose data. Dotfolders contain auth tokens (`.aws`, `.config/gh`, `.ssh`), live SQLite (`.codex` while Claude Code runs), encrypted state (`.snaply` won't restore), and shell-rc dependencies (`.cargo/env` referenced by `.zshenv`).

This skill exists to make cleanup safe: per-target classification, auth-surprise detection, process-check before nuking active state, shell-rc side-effect fixes, explicit user confirmation per target. Multi-agent orchestration (4 scanners + orphan-detection + safe-nuke + critic) ensures every deletion is verified, every risk surfaced, every change reversible (or surfaced as irreversible).

## Methodology

**Survey first, classify second, execute third — never invert.** Layer-1 scanners (dotfolder, runtime, cache, package) run in parallel and produce inventories. Layer-2 (orphan-detection) cross-references. Layer-3 (safe-nuke) executes one target at a time with explicit confirmation. Pre-execution decisions on partial scans miss cross-cutting orphans.

**One target at a time.** No bulk multi-target deletion. User confirms each target by name (or picks from a coded list). Cumulative reclaim tracked across targets.

**Auth state is the highest-priority risk.** Any folder containing tokens, OAuth state, refresh tokens, JWTs, session cookies, or PKCE artifacts must be flagged BEFORE deletion with the exact re-auth command the user will need. `references/auth-credential-patterns.md` is the canonical filename-pattern catalog the safe-nuke-agent uses.

**Identify the owning tool, never trust the folder name.** `.amazon-q.dotfiles.bak` looks like trash; `.config/<tool>` looks like cache. The tool ownership map (`references/tool-ownership-map.md`) is the authority. Owning tool determines classification.

**Critic-agent fires on every run.** All 6 golden rules verified before delivery. FAIL means restore from backup, surface what was wrong, ask user how to proceed.

## Principles

- **The 6 golden rules are the contract.** Never delete user data without explicit confirmation. No auth surprise. Process-check before nuking active state. Side-effect awareness in shell startup. Distinguish regenerable cache from unique state. One target at a time with explicit confirmation. Documented as hard safety gates in SKILL body; they fire under `--fast` and supersede mode-resolver downgrade.
- **User-data dirs are off-limits to bulk action.** `Desktop/`, `Documents/`, `Downloads/`, `Pictures/`, `Movies/`, `Music/`, `Public/`, and any cloud-mount symlinks (`Google Drive`, `OneDrive`, `iCloud`) are surface-only. Triage of user content is the user's job, not this skill's.
- **Regenerable cache is fast nuke.** Anything inside an XDG-compliant `~/.cache/` is throwaway by definition. The cache-scanner-agent surfaces these for one-tap deletion.
- **Unique state outside `~/.cache/` requires per-target classification.** Use the Classification Vocabulary (`references/classification-vocabulary.md`) — active / load-bearing / abandoned / orphan / cache / empty / user-data — to phrase recommendations.
- **Standalone — no upstream gate.** `machine-cleanup` reads only machine state; no project context required. Composable with any project state.
- **Session limits prevent runaway destruction.** Target ~25 deletions per session; interim summary at 10. If user rejects 5+ recommendations in a row, stop and ask if scope is wrong.

## When NOT to nuke

The safe-nuke-agent skips or surface-only's these situations:

- **User-data dirs** (Desktop, Documents, Downloads, Pictures, Movies, Music, Public, cloud mounts) — surface only, never auto-recommend nuke.
- **Active state** (mtime <5 minutes, `.pid`/`.sock`/`-wal` files present) — process-check first; if owning app is running, quit cleanly via AppleScript or warn and skip.
- **Load-bearing config** (`.aws`, `.ssh`, `.config/gh`, `.config/gcloud`, `.config/<tool>` with auth state) — keep with strong push-back unless tool is verifiably gone AND user explicitly says "nuke auth, I'll re-login."
- **Tool unknown** (no entry in tool-ownership-map.md, user can't identify) — NEEDS_CONTEXT; ask before removing.
- **Backup not possible** (irreversible encrypted state) — surface that nuke is irreversible; require explicit confirmation that user accepts data loss.

## History / origin

- **v1.0.0 baseline:** 7 agents, 3-layer execution (Layer 1 parallel scanners, Layer 2 orphan-detection, Layer 3 interactive safe-nuke + critic), 6 golden rules locked, 7-class Classification Vocabulary, tool-ownership-map.md + auth-credential-patterns.md as canonical refs.
- **v6 Phase 2 Wave 1 refactor (May 17, 2026, still v1.0.0):**
  - Body trimmed 368 → 186 lines (-49.5%, under ≤200 structural target by 14).
  - Warm/Cold Pre-Dispatch prompts extracted to `pre-dispatch-prompts.md`.
  - Classification Vocabulary table extracted to `classification-vocabulary.md`.
  - Tool Ownership Heuristics extracted to `tool-ownership-heuristics.md` (companion to existing tool-ownership-map.md catalog).
  - Anti-Patterns table extracted to `anti-patterns.md` + revision-loop + when-not-to-nuke guidance added.
  - Worked Example extracted to `examples/full-machine-walkthrough.md`.
  - Artifact Template (frontmatter + 6 sections + filename conventions) extracted to `report-template.md`.
  - Triage body section deleted (was triple-duplicate of Routing Rules).
  - Mode-resolver wired with safety-gates-supersede-`--fast` per the 6 Critical Gates.
  - Before-Starting check + Artifact Contract block added per Step 7.5.
  - The 6 Critical Gates + Multi-Agent Architecture (Roster + Execution Layers + Dispatch Protocol + Routing Rules) preserved verbatim in body — these ARE behavior, not docs.
  - No version bump — refactor lands on product-skills 2.0 base as a commit, not a release.

## Further reading

- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes + when-not-to-nuke + critic-FAIL handling
- [`classification-vocabulary.md`](classification-vocabulary.md) [PROCEDURE] — 7-class taxonomy the safe-nuke-agent uses for recommendation phrasing
- [`tool-ownership-map.md`](tool-ownership-map.md) — canonical folder pattern → owning tool → install method → known data dirs (pre-existing, unchanged)
- [`tool-ownership-heuristics.md`](tool-ownership-heuristics.md) [PROCEDURE] — cross-reference signals + how to identify the owning tool when the map doesn't have an entry
- [`auth-credential-patterns.md`](auth-credential-patterns.md) — canonical filename patterns the critic-agent fails fast on (pre-existing, unchanged)
- [`pre-dispatch-prompts.md`](pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold prompts verbatim
- [`report-template.md`](report-template.md) [PROCEDURE] — artifact frontmatter + sections + filename conventions
- [`examples/full-machine-walkthrough.md`](examples/full-machine-walkthrough.md) [EXAMPLE] — "20 AI tools tried, clean my machine" end-to-end
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (deep-tier skill; `--fast` runs Single-Agent Fallback but still enforces 6 golden rules per the safety-gates-supersede rule)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec
