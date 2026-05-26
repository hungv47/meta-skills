---
name: clean-machine
description: "Audit + clean a developer's machine — dotfolders, caches, language toolchains, package globals — with per-target classification, risk surfacing (auth, processes, side effects), and explicit confirmation. Produces `.forsvn/artifacts/meta/records/machine-cleanup-*.md`. Not for cleaning code (use clean-code) or for triaging user files (those need human review)."
argument-hint: "[target: home | caches | runtimes | packages | all]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "1.1.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Machine Cleanup — Orchestrator

Audits a developer's machine state and removes abandoned tools, orphaned caches, and unused toolchains — without breaking active workflows. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + execution layers + routing rules: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Is this folder still owned by an installed tool I actively use, or is it leftover state from something I no longer have?

## When To Use

- New laptop setup; need to start clean.
- After trying many AI tools you've now abandoned.
- Disk is full or near-full.
- Before passing the machine to someone else.
- Standalone — no upstream gate required.

## When NOT To Use

- Cleaning source code → `/clean-code`.
- Triaging files in `Desktop/`, `Documents/`, `Downloads/`, `Pictures/`, `Movies/`, `Music/`, `Public/`, or cloud-mount symlinks — those need human review.
- Tool ownership unclear AND you can't identify the owning tool — surface as `NEEDS_CONTEXT` first.

## Critical Gates (The 6 Golden Rules) — load first

All 6 fire under `--fast`, Single-Agent Fallback, and dry-run modes:

1. **Never delete user data without explicit confirmation.** Files in `Desktop/`, `Documents/`, `Downloads/`, `Pictures/`, `Movies/`, `Music/`, `Public/`, and any contents under cloud-mount symlinks (`Google Drive`, `OneDrive`, `iCloud`) are off-limits to bulk action. Surface findings; defer execution to the user.
2. **No auth surprise.** Any folder containing tokens, OAuth state, refresh tokens, JWTs, session cookies, or PKCE artifacts must be flagged BEFORE deletion with the exact re-auth command the user will need (`gh auth login`, `gcloud auth login`, `vercel login`). Filename patterns: [`references/auth-credential-patterns.md`](references/auth-credential-patterns.md).
3. **Process-check before nuking active state.** If a folder is being written to right now (mtime within 5 minutes, or a `.pid`/`.sock`/`-wal` file exists), check `pgrep` for the owning app. Quit cleanly via AppleScript or warn the user before deletion. Never delete files an open SQLite WAL points to.
4. **Side-effect awareness in shell startup.** Before deleting a directory referenced in `.zshenv`, `.zshrc`, `.bashrc`, `.profile`, `.tcshrc` (e.g., `. "$HOME/.cargo/env"`), comment out or update the offending line. Otherwise every new terminal throws errors.
5. **Distinguish regenerable cache from unique state.** Anything inside XDG-compliant `~/.cache/` is throwaway by definition — surface for fast nuke. Anything outside `~/.cache/` requires per-target classification: identify the owning tool, then decide.
6. **One target at a time with explicit confirmation.** No bulk multi-target deletion. The user must confirm each target by name (or pick from a coded list). Track cumulative reclaim across targets.

**Session limits:** target ~25 deletions per cleanup session. After 10, generate an interim summary. If the user has rejected 5+ recommendations in a row, stop and ask if the scope is wrong.

**Critic FAIL:** identifies the specific deletion that violated a rule; safe-nuke-agent restores from backup (or instructs reinstall steps); reports. Full critic-FAIL handling + bulk-action pause triggers: [`references/anti-patterns.md`](references/anti-patterns.md).

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)). `budget: deep`. Auto-downgrades to `fast` for single-folder targets → Single-Agent Fallback. `--fast` forces single-agent regardless of scope. **All 6 Critical Gates fire in every mode.**
- Read `.forsvn/index/manifest.json` for prior machine-cleanup runs; surface staleness if a recent run covered this scope.
- Read `.forsvn/experience/technical.md` for prior protected-paths list (machine-cleanup excluded paths).

## Pre-Dispatch

Run Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). Needed dimensions: scope (dotfolders / caches / packages / runtimes / all), aggressiveness (conservative / moderate / aggressive), excluded paths.

Read order:

1. Machine scan: `du -sh ~/.*`, `df -h`, package globals (npm/brew/bun/cargo/go/pipx) — see `scripts/inventory.sh`.
2. Experience: `.forsvn/experience/technical.md` for prior protected-paths list.

Warm Start + Cold Start prompts: [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md).

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta-clean-machine-<YYYY-MM-DD>-<slug>.md` (flat v2 grammar; stack is `meta` — machine-cleanup records are meta-stack snapshots).
- **Lifecycle:** `snapshot` — dated, immutable record of one cleanup run.
- **Frontmatter:** `skill`, `version`, `date`, `status` (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), `stack` (=meta), `review_surface` (=none — snapshot defaults to `decision_state: not_required`), `total_reclaimed`, `lifecycle`, `produced_by`, `provenance`. v2 schema in [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Required sections:** Scope, Summary. Targets Nuked + Targets Kept + Side Effects Fixed + Re-Auth Commands + Manual Follow-ups when applicable. Critic Verdict optional.
- **Consumed by:** `clean-artifacts` (staleness signal scanning), `forsvn` (state detection), operator (history audit).

Full template + filename conventions + version-increment rule: [`references/report-template.md`](references/report-template.md).

## Multi-Agent + Single-Agent

7 agents in 3 layers — full table + execution diagram + dispatch protocol + routing rules: [`references/agent-manifest.md`](references/agent-manifest.md).

**Single-Agent Fallback** (mode downgrades to `fast`):

1. Skip multi-agent dispatch.
2. Inspect the target — list contents, sizes, last-modified, identify owning tool per [`references/tool-ownership-heuristics.md`](references/tool-ownership-heuristics.md).
3. Classify per [`references/classification-vocabulary.md`](references/classification-vocabulary.md) (active / load-bearing / abandoned / orphan / cache / empty / user-data).
4. Surface auth/process/side-effect risks per the 6 Critical Gates.
5. Recommend nuke or keep with reasoning.
6. Wait for explicit user confirmation.
7. Execute with side-effect fixes.
8. Verify post-state.
9. Save artifact per [`references/report-template.md`](references/report-template.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before applying any deletion that smells off — bulk, auth-bearing, mid-process, shell-rc-referenced, package manager + data split. "When NOT to nuke" + bulk-action pause triggers also live there.

## Completion Status

- **DONE** — all approved removals executed, totals reported (`total_reclaimed`), no orphaned references in shell-rcs.
- **DONE_WITH_CONCERNS** — cleanup applied but some folders deferred to manual user triage (user-data dirs, ambiguous ownership); report enumerates what was deferred.
- **BLOCKED** — destructive removal would touch user data without confirmation; halted pending explicit decision.
- **NEEDS_CONTEXT** — tool ownership unclear for some folders (no entry in tool-ownership-map.md and user can't identify the owning tool); ask before removing.

## Chain Position

Previous: none | Next: none (standalone). **Re-run triggers:** new laptop setup, after abandoning many AI tools, disk-full, before passing the machine to someone else.

## Next Step

- User asks "what package managers should I prune next" → dispatch `package-inventory-agent` standalone.
- User wants to dotfile-track the resulting clean state → suggest `chezmoi` or `dotbot`.
