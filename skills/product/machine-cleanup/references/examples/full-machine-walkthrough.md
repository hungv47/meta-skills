---
title: Machine-Cleanup — Worked Example
lifecycle: canonical
status: stable
produced_by: machine-cleanup
load_class: EXAMPLE
---

# Worked Example: "20 AI Tools Tried, Clean My Machine"

**Load when:** triangulating to a target — operator wants to know what a full machine cleanup looks like end-to-end with all 7 agents, or the orchestrator needs an anchor for output shape + safe-nuke confirmation flow.

---

## Invocation

```
/machine-cleanup
> I've tried 20 AI coding tools this year. Most of them I never use
> anymore. Clean up my machine.
```

## Triage

Broad cleanup ("clean up my machine") — dispatch all four scanners.

## Layer 1 (parallel)

**`dotfolder-scanner-agent`** reports:
- 28 dotfolders surveyed
- **Active (4):** `.claude` `.codex` `.cursor` `.warp`
- **Load-bearing (5):** `.aws` `.ssh` `.config` `.context7` `.mcp-auth`
- **Abandoned (12):** `.factory` `.t3` `.kimi` `.kiro` `.windsurf` `.trae` `.codeium` `.snaply` `.pencil` `.browser-use` `.amazon-q.dotfiles.bak` `.antigravity`
- **Orphan (3):** `.kimi-webbridge` (sibling `.kimi` already deleted), `.semantic_search` (Kiro's model cache), `.icube-remote-ssh` (empty)
- **Empty (2):** `.kilocode` (0B), `.icube-remote-ssh` (0B)

**`runtime-scanner-agent`** reports:
- Rust: installed but `cargo install --list` empty + 0 user crates → **toolchain unused**, ~1.5G across `.cargo` + `.rustup`
- Go: installed (Homebrew), `go/bin/` only contains `dlv` + `gopls` (IDE tooling) → **abandoned for personal use**
- Google Cloud SDK: 400M curl-pipe-installed, plus 84M auth in `.config/gcloud` → **decision: do you still ship to GCP?**

**`cache-scanner-agent`** reports:
- `.cache/huggingface` 5.5G — model files for tools that are now abandoned (Kiro, semantic_search) → **orphan cache**
- `.cache/codex-runtimes` 732M — paired with `.codex` (active) → **regenerable, lower priority**
- `.npm/_cacache` 604M + `.npm/_npx` 405M → **pure regenerable**

**`package-inventory-agent`** reports:
- `@openai/codex` installed via 3 channels: brew formula, brew cask (`codexbar`), bun global → **2 redundant copies**
- `agent-browser` npm-global → still installed even though `.agent-browser/` was nuked; will redownload 700M Chromium on next run

## Layer 2 (sequential)

**`orphan-detection-agent`** cross-correlates:
- `.cache/snaply` is orphaned by abandoned `.snaply`
- `.cache/opencode` is orphaned (no `.opencode/` exists)
- `.config/browseruse` is orphaned (`.browser-use/` already gone)
- `.zshenv` references `.cargo/env` — if user nukes `.cargo`, the source line breaks
- `~/Library/Application Support/snaply` is the *real* user data dir for Snaply (`.snaply/` is auxiliary) — surface separately as user-data (do NOT auto-recommend nuke)

## Layer 3 (interactive — `safe-nuke-agent`)

Walks the candidate list one at a time. For each target:
- Shows: what it is, owner tool, status, contents summary, recommendation
- Surfaces: auth files, running processes, dependent shell-rc lines
- Awaits explicit user confirmation
- Executes with side-effect fixes (e.g., comments out `.cargo/env` line in `.zshenv` before deleting `.cargo`)

**Per-target flow example (`.kimi`):**

```
Target: ~/.kimi
Class: abandoned
Size: 84M
Owner: kimi-cli (not on PATH, not in /Applications, not in any package manager)
Last touched: 47 days ago
Contents: cache/, config.json (contains API key for moonshot.ai)

User loses if nuked:
- Saved API key for moonshot.ai (you'll need to re-add if you use kimi again)
- Cached conversation history (~80M)

Recommendation: NUKE. Tool is verifiably gone (no install), folder is
load-bearing for kimi but tool is abandoned. API key is the only
unique state — confirm before delete.

Confirm? (y/n/skip)
```

User types `y` → safe-nuke removes the folder, logs the API-key loss in "Re-Auth Commands" (manual step: re-add at moonshot.ai if needed).

**Per-target flow example (`.cargo`):**

```
Target: ~/.cargo
Class: abandoned (runtime)
Size: 312M
Owner: rustup (installed but cargo install --list empty)

User loses if nuked:
- 0 installed crates
- Rust toolchain (also need to nuke ~/.rustup for full removal)

Shell-rc side effect detected:
  ~/.zshenv line 12: . "$HOME/.cargo/env"
  This line will throw "no such file" on every new terminal after nuke.

Recommendation: NUKE both .cargo and .rustup as a unit (1.5G reclaim).
Will comment out the .zshenv line in same operation.

Confirm? (y/n/skip)
```

User types `y` → safe-nuke removes both folders, comments out the `.zshenv` line, logs in "Side Effects Fixed."

## Critic review

PASS. All 6 golden rules satisfied:
1. No user data touched — `~/Library/Application Support/snaply` was surfaced as user-data, not nuked.
2. All auth surprises were surfaced — kimi API key, gcloud auth, redundant codex copies all flagged with reauth commands.
3. Process-check ran on every target — `.codex` was active (process running) so skipped; abandoned tools had no processes.
4. Shell-rc fixed inline — `.zshenv` line 12 commented out in same operation as `.cargo` nuke.
5. Cache nukes (huggingface, npm caches) handled separately from per-target classification — fast nuke path used.
6. One target at a time with explicit confirmation — operator confirmed each of 18 nukes individually.

## Artifact saved

`.agents/skill-artifacts/meta/records/machine-cleanup-2026-05-17-aitool-purge.md`. Total reclaim: 11.2 GB. 18 targets nuked, 9 kept, 1 deferred to manual follow-up (`~/Library/Application Support/snaply`).

`status: done`. Re-Auth Commands section lists 3 commands (`gh auth login`, `gcloud auth login`, kimi API-key re-add).

## Lessons embedded

- **Why `~/Library/Application Support/snaply` was surfaced separately:** it's user-data (the real Snaply database), not auxiliary state. The `.snaply/` dotfolder is the auxiliary one. Misclassifying the AppSupport copy as "more of the same" would be a Golden Rule #1 violation.
- **Why `.cargo` + `.rustup` were nuked as a unit:** treating the runtime as a single unit prevents the "dangling proxy" anti-pattern. Rustup installs cargo as a proxy in `~/.cargo/bin/cargo` that re-execs the active toolchain; nuking `.cargo` but keeping `.rustup` leaves cargo working but reporting "no toolchain installed."
- **Why the `.kimi` API key was surfaced even though kimi is gone:** Golden Rule #2 (no auth surprise). The operator might rejoin moonshot.ai later; better to log the loss than have them rediscover it 6 months from now.
- **Why redundant codex copies weren't auto-deduplicated:** package-inventory flagged it but didn't act. Choosing which channel to keep (brew formula? brew cask? bun global?) is operator preference, not safe-nuke's call. Logged for operator's manual decision in Manual Follow-ups.
