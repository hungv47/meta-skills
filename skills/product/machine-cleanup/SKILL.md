---
name: machine-cleanup
description: "Audits and cleans a developer's machine — dotfolders, caches, language toolchains, and package-manager globals — with per-target classification, risk surfacing (auth, running processes, side effects), and explicit user confirmation before each deletion. Produces `.agents/skill-artifacts/meta/records/machine-cleanup-*.md`. Not for cleaning code (use code-cleanup) or for triaging user files in Documents/Downloads (those need human review)."
argument-hint: "[target: home | caches | runtimes | packages | all]"
allowed-tools: Read Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-3"
  refactor_history:
    - refactored_at: 2026-05-17
      refactored_for: implementation-roadmap v6 Phase 2 Wave 1 (slot 4 — structural; 6 golden rules + multi-agent architecture preserved in body per safety contract)
      body_before: 368
      body_after: 186
      body_delta_pct: -49.5
      note: body-only line counts (frontmatter excluded). 7 new refs (playbook, pre-dispatch-prompts, classification-vocabulary, tool-ownership-heuristics, anti-patterns, report-template, examples/full-machine-walkthrough). Triage body deleted (duplicate of Routing Rules). Classification Vocabulary + Tool Ownership Heuristics tables extracted to refs.
promptSignals:
  phrases:
    - "clean up my machine"
    - "clean my home directory"
    - "free up disk space"
    - "fresh start dev machine"
    - "what's taking up space"
    - "review every folder"
    - "remove abandoned tools"
    - "audit my dotfolders"
    - "uninstall what i don't use"
  allOf:
    - [clean, home]
    - [free, disk]
    - [audit, machine]
  anyOf:
    - "home directory"
    - "dotfolder"
    - "dotfile"
    - "disk space"
    - "uninstall"
    - "abandoned tools"
    - "fresh start"
    - "machine cleanup"
  noneOf:
    - "code review"
    - "refactor"
    - "documentation"
  minScore: 6
routing:
  intent-tags:
    - machine-cleanup
    - dotfolder-audit
    - cache-purge
    - package-prune
    - toolchain-removal
    - disk-reclaim
    - dev-machine-hygiene
  position: horizontal
  lifecycle: snapshot
  produces:
    - .agents/skill-artifacts/meta/records/machine-cleanup-*.md
  consumes: []
  requires: []
  defers-to:
    - skill: code-cleanup
      when: "cleaning source code, not machine state"
  parallel-with: []
  interactive: true
  estimated-complexity: heavy
---

# Machine Cleanup — Orchestrator

*Productivity — Multi-agent orchestration. Audits a developer's machine state and removes abandoned tools, orphaned caches, and unused toolchains — without breaking active workflows.*

**Core Question:** "Is this folder still owned by an installed tool I actively use, or is it leftover state from something I no longer have?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill exists, methodology, principles, when NOT to nuke, history.]

## When To Use

- New laptop setup; need to start clean.
- After trying many AI tools you've now abandoned.
- Disk is full or near-full.
- Before passing the machine to someone else.
- Standalone — no upstream gate required.

## When NOT To Use

- Cleaning source code → `/code-cleanup`.
- Triaging files in `Desktop/`, `Documents/`, `Downloads/`, `Pictures/`, `Movies/`, `Music/`, `Public/`, or cloud-mount symlinks — those need human review, not automation.
- Tool ownership unclear AND you can't identify the owning tool — surface as NEEDS_CONTEXT first.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — this skill is `budget: deep`. Mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) auto-downgrades to `fast` for single-folder targets (operator points at one path) → Single-Agent Fallback path. `--fast` flag forces single-agent regardless of scope. **Safety gates supersede `--fast`:** the 6 Critical Gates fire on every run, regardless of mode. Pre-Dispatch fires under `--fast` if scope + aggressiveness + excluded paths aren't resolvable.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory.
2. Read `.agents/manifest.json` for prior machine-cleanup runs; surface staleness if a recent run already covered this scope.
3. Read `skills-resources/experience/technical.md` for prior protected-paths list (machine-cleanup excluded paths).

## Pre-Dispatch

Run the Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md`).

**Needed dimensions:** scope (dotfolders / caches / packages / runtimes / all), aggressiveness (conservative / moderate / aggressive), excluded paths.

**Read order:**
1. Machine scan: `du -sh ~/.*`, `df -h`, package globals (npm/brew/bun/cargo/go/pipx) — see `scripts/inventory.sh`.
2. Experience: `skills-resources/experience/technical.md` for prior protected-paths list.

**Prompts:** see [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] for Warm Start (scope clear from invocation), Cold Start (general "clean my machine"), and write-back rules.

## Artifact Contract

- **Path:** `.agents/skill-artifacts/meta/records/machine-cleanup-*.md` (baseline glob; report-template formalizes the date+slug convention going forward without breaking the glob)
- **Lifecycle:** `snapshot` (dated, immutable record of one cleanup run)
- **Frontmatter fields (baseline):** `skill`, `version`, `date`, `status` (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), `total_reclaimed`. **Step 7.5 additions** (manifest-sync conformance; backfilled going forward): `lifecycle`, `produced_by`, `provenance`.
- **Required sections (baseline):** Scope, Summary. Targets Nuked + Targets Kept + Side Effects Fixed + Re-Auth Commands + Manual Follow-ups when applicable. Critic Verdict optional (added in v6 refactor).
- **Consumed by:** `cleanup-artifacts` (meta-skill — staleness signal scanning), `orchestrate-product` (state detection), operator (history audit).
- Full template + filename conventions + version-increment rule: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Chain Position

Previous: none | Next: none (standalone).

**Re-run triggers:** new laptop setup, after trying many AI tools you've now abandoned, when disk is full, before passing the machine to someone else.

## Critical Gates (The 6 Golden Rules)

Before delivering, the critic-agent verifies ALL golden rules pass:

1. **Never delete user data without explicit confirmation.** User files in `Desktop/`, `Documents/`, `Downloads/`, `Pictures/`, `Movies/`, `Music/`, `Public/` and any contents under cloud-mount symlinks (`Google Drive`, `OneDrive`, `iCloud`) are off-limits to bulk action. Surface findings; defer execution to the user.
2. **No auth surprise.** Any folder containing tokens, OAuth state, refresh tokens, JWTs, session cookies, or PKCE artifacts must be flagged BEFORE deletion with the exact re-auth command the user will need (`gh auth login`, `gcloud auth login`, `vercel login`, etc.). Filename patterns in [`references/auth-credential-patterns.md`](references/auth-credential-patterns.md).
3. **Process-check before nuking active state.** If a folder is being written to right now (mtime within 5 minutes, or a `.pid`/`.sock`/`-wal` file exists), check `pgrep` for the owning app. Quit cleanly via AppleScript or warn the user before deletion. Never delete files an open SQLite WAL points to.
4. **Side-effect awareness in shell startup.** Before deleting a directory referenced in `.zshenv`, `.zshrc`, `.bashrc`, `.profile`, `.tcshrc`, etc. (e.g., `. "$HOME/.cargo/env"`), comment out or update the offending line. Otherwise every new terminal will throw errors.
5. **Distinguish regenerable cache from unique state.** Anything inside an XDG-compliant `~/.cache/` is throwaway by definition — surface it for fast nuke. Anything outside `~/.cache/` requires per-target classification: identify the owning tool, then decide.
6. **One target at a time with explicit confirmation.** No bulk multi-target deletion. The user must confirm each target by name (or pick from a coded list). Track cumulative reclaim across targets.

**Additional gate:** Session limits — target ~25 deletions per cleanup session. After 10, generate an interim summary. If the user has rejected 5+ recommendations in a row, stop and ask if the scope is wrong.

**If any golden rule fails:** the critic identifies the specific deletion that violated it, the safe-nuke-agent restores from backup (or instructs reinstall steps if backup isn't possible), and reports. Full critic-FAIL handling + bulk-action pause triggers: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN].

**Safety supersedes `--fast`:** all 6 gates fire under `--fast`, Single-Agent Fallback, and dry-run modes. Mode-resolver's safety-gates-supersede contract applies.

## Multi-Agent Architecture

### Agent Roster

| Agent | File | Focus |
|---|---|---|
| dotfolder-scanner-agent | `agents/dotfolder-scanner-agent.md` | `$HOME/.*` survey — identify owning tool, classify (active/abandoned/orphan/empty), flag auth state |
| runtime-scanner-agent | `agents/runtime-scanner-agent.md` | Language toolchains — `.rustup`, `.cargo`, `go/`, `google-cloud-sdk/`, etc. — and whether the user actively writes that language |
| cache-scanner-agent | `agents/cache-scanner-agent.md` | XDG `.cache/`, `.npm/_cacache`, `.bun/install/cache`, `.cargo/registry` — pure regenerable reclaim |
| package-inventory-agent | `agents/package-inventory-agent.md` | Globals across npm/brew/bun/cargo/go/pipx — flag duplicates (e.g., `codex` installed via 3 channels) and unused |
| orphan-detection-agent | `agents/orphan-detection-agent.md` | Cross-references findings — sibling folders left behind when a tool is removed (`.cache/codex-runtimes` after `.codex` is gone), broken symlinks, dangling shell-rc references |
| safe-nuke-agent | `agents/safe-nuke-agent.md` | Executes deletions — process-check first, fixes shell-rc side effects, verifies post-state |
| critic-agent | `agents/critic-agent.md` | Golden rules compliance, no user-data deletion, no auth surprise |

### Execution Layers

```
Layer 1 (parallel — survey only, no changes):
  dotfolder-scanner-agent ────┐
  runtime-scanner-agent ──────┤── scan simultaneously
  cache-scanner-agent ────────┤
  package-inventory-agent ────┘

Layer 2 (sequential — analysis):
  orphan-detection-agent ─────── correlates Layer 1 outputs

Layer 3 (interactive — execution):
  safe-nuke-agent ──────────── per-target: surface findings → confirm with user → execute
    → critic-agent ───────────── final golden rules review
```

### Dispatch Protocol

1. **Triage** — determine scope from user intent (see Routing Rules below).
2. **Layer 1 dispatch** — send brief to relevant scanner agents in parallel. Each returns a markdown report with classified targets per [`references/classification-vocabulary.md`](references/classification-vocabulary.md) [PROCEDURE]. Tool ownership identification uses [`references/tool-ownership-map.md`](references/tool-ownership-map.md) (canonical catalog) + [`references/tool-ownership-heuristics.md`](references/tool-ownership-heuristics.md) [PROCEDURE] (cascade for unknown tools).
3. **Layer 2 orphan correlation** — `orphan-detection-agent` cross-references Layer 1 outputs. Emits a unified "candidates for removal" list with confidence levels.
4. **Layer 3 interactive execution** — `safe-nuke-agent` walks the candidate list **one target at a time**:
   - Surface what it is, why it's a candidate, what user loses if removed (auth re-login, settings, data)
   - Surface risks (running processes, shell-rc references, irreversible data) per the 6 Critical Gates
   - Recommend with reasoning
   - **Wait for explicit user confirmation** for that target
   - Execute with side-effect fixes
   - Track reclaim
5. **Critic review** — `critic-agent` checks golden rules. If FAIL, restore from backup and report per [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When the critic FAILs."
6. **Assembly** — compile report per [`references/report-template.md`](references/report-template.md) [PROCEDURE]. Save to `.agents/skill-artifacts/meta/records/machine-cleanup-[date]-<slug>.md`.

### Routing Rules

| Condition | Route |
|-----------|-------|
| User says "clean my home dir" | dotfolder-scanner → orphan-detection → safe-nuke → critic |
| User says "free up disk space" | cache-scanner + dotfolder-scanner → orphan-detection → safe-nuke → critic |
| User says "audit my globals" / "package cleanup" | package-inventory only → safe-nuke → critic |
| User says "remove unused languages" | runtime-scanner → safe-nuke → critic |
| User says "fresh start" / "clean everything" | All four scanners → orphan-detection → safe-nuke → critic |
| User points at a specific folder | Skip Layer 1 broad scan; safe-nuke runs against that folder's classification |
| Critic FAIL | Restore last backup, surface what was wrong, ask user how to proceed |
| Session reclaim >10GB | Generate interim summary, ask if user wants to continue |

For an annotated full-machine walkthrough ("20 AI tools tried, clean my machine" — all 4 scanners + Layer 2 + critic decisions): [`references/examples/full-machine-walkthrough.md`](references/examples/full-machine-walkthrough.md) [EXAMPLE].

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast` (operator points at one specific folder, context-constrained, or `--fast` flag):

1. Skip multi-agent dispatch.
2. Inspect the target — list contents, sizes, last-modified, identify owning tool per [`references/tool-ownership-heuristics.md`](references/tool-ownership-heuristics.md) [PROCEDURE].
3. Classify per [`references/classification-vocabulary.md`](references/classification-vocabulary.md) [PROCEDURE] (active / load-bearing / abandoned / orphan / cache / empty / user-data).
4. Surface auth/process/side-effect risks per the 6 Critical Gates.
5. Recommend nuke or keep, with reasoning.
6. Wait for explicit user confirmation.
7. Execute with side-effect fixes.
8. Verify post-state.
9. Save to `.agents/skill-artifacts/meta/records/machine-cleanup-[date]-<slug>.md` per [`references/report-template.md`](references/report-template.md) [PROCEDURE].

The 6 Critical Gates + Pre-Dispatch context gate fire in fallback mode regardless — safety contract is mode-independent.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before applying any deletion that smells off — bulk, auth-bearing, mid-process, shell-rc-referenced, package manager + data split. The "When NOT to nuke" exit conditions + bulk-action pause triggers also live there.

## Completion Status

Every run ends with explicit status:

- **DONE** — all approved removals executed, totals reported (`total_reclaimed`), no orphaned references in shell-rcs.
- **DONE_WITH_CONCERNS** — cleanup applied but some folders deferred to manual user triage (user-data dirs, ambiguous ownership); report enumerates what was deferred.
- **BLOCKED** — destructive removal would touch user data without confirmation; halted pending explicit user decision.
- **NEEDS_CONTEXT** — tool ownership unclear for some folders (no entry in tool-ownership-map.md and the user can't identify the owning tool); ask before removing.

## Next Step

If the user asks "what package managers should I prune next," dispatch `package-inventory-agent` standalone.
If the user wants to dotfile-track the resulting clean state, suggest `chezmoi` or `dotbot`.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why, methodology, principles, when NOT to nuke, history
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior + safety-gates-supersede contract
- [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold prompts verbatim
- [`references/classification-vocabulary.md`](references/classification-vocabulary.md) [PROCEDURE] — 7-class taxonomy + classification decision tree
- [`references/tool-ownership-map.md`](references/tool-ownership-map.md) — canonical folder pattern → owning tool → install method → known data dirs
- [`references/tool-ownership-heuristics.md`](references/tool-ownership-heuristics.md) [PROCEDURE] — cross-reference signals + tool-verification cascade
- [`references/auth-credential-patterns.md`](references/auth-credential-patterns.md) — filename patterns the critic-agent fails fast on
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes + when NOT to nuke + critic-FAIL handling + bulk-action triggers
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — artifact frontmatter + sections + filename conventions
- [`references/examples/full-machine-walkthrough.md`](references/examples/full-machine-walkthrough.md) [EXAMPLE] — "20 AI tools tried" end-to-end
- `scripts/inventory.sh` — One-shot inventory script. Outputs sizes + mtimes for every `~/.*` dotfolder, package globals across npm/brew/bun/cargo/go/pipx, running AI/dev processes, broken symlinks under `$HOME`, shell-rc files that source non-existent paths. All four Layer 1 scanners share its output to avoid redundant `du`/`ls` runs.
