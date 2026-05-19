---
title: Machine-Cleanup — Tool Ownership Heuristics
lifecycle: canonical
status: stable
produced_by: machine-cleanup
load_class: PROCEDURE
---

# Tool Ownership Heuristics

**Load when:** identifying the owning tool of a target folder. Companion to `tool-ownership-map.md` (the canonical folder pattern → tool catalog). Use these heuristics when the map doesn't have an entry, or to verify map entries against current state.

---

## Don't trust folder names alone

Folder names are hints, not authority. `.amazon-q.dotfiles.bak` looks like trash but might still be active; `.config/<tool>` looks like cache but is almost always load-bearing settings.

## Pattern → owner lookup

| Folder pattern | Likely owner | Verification |
|---|---|---|
| `.<toolname>/` | The tool literally named `toolname` | Check if `<toolname>` is on PATH (`which`), in `/Applications`, or in brew/npm/bun/cargo/go global lists |
| `.cache/<toolname>/` | XDG cache for `<toolname>` | If owning tool is gone → orphan |
| `.config/<toolname>/` | XDG config — usually load-bearing | Check for credentials/tokens; preserve unless tool is verifiably gone |
| `.<toolname>-<suffix>` (e.g., `.amazon-q.dotfiles.bak`) | Backup or auxiliary state | Almost always orphan/cruft |
| Folders named `bin`, `tmp`, `cache`, `logs`, `sessions` inside a tool dir | Tool's working dirs | Subordinate to parent's classification |
| `~/Library/Application Support/<tool>/` (macOS) | App-level state, often the REAL data dir | Cross-reference with dotfolder; the AppSupport copy may be load-bearing even if the dotfolder is auxiliary |

## Cross-reference signals

When the folder name alone doesn't resolve:

- **`*.pid` files** → check if PID is alive (`kill -0 $(cat *.pid) 2>/dev/null && echo running`). Alive → active.
- **`*.sock` files** → process is exposing an IPC endpoint right now. Active.
- **SQLite `-wal` / `-shm` files** → process is currently writing. Active. Never delete; data corruption risk.
- **Folder mtime within last hour** → process recently wrote. Likely active.
- **Folder mtime >30 days** → recency proxy for abandonment.
- **Top-level config files** (config.json, settings.yml, manifest.toml) → read to identify the tool by self-description, not just folder name.

## Tool verification cascade

For a folder `.<name>`:

1. `command -v <name>` — on PATH?
2. `ls /Applications | grep -i <name>` — macOS app?
3. `brew list --formula | grep -i <name>` — Homebrew formula?
4. `brew list --cask | grep -i <name>` — Homebrew cask?
5. `npm ls -g --depth=0 | grep -i <name>` — npm global?
6. `bun pm ls -g | grep -i <name>` — bun global?
7. `cargo install --list | grep -i <name>` — cargo global?
8. `pipx list | grep -i <name>` — pipx-installed Python tool?
9. `go install` paths — check `$GOPATH/bin/`?
10. None of the above → **owning tool is gone**; pass to Classification Vocabulary decision tree which will classify as `orphan` (Step 4 in `classification-vocabulary.md`).

If found in any check → tool is installed; classify per the Classification Vocabulary decision tree (`classification-vocabulary.md`).

## Common false-friends

- **`.config/`** itself is XDG's base — it's NOT a tool; its subdirectories are.
- **`.local/share/<tool>`** — XDG data; load-bearing for the tool.
- **`.local/state/<tool>`** — XDG state; usually regenerable but tool-specific.
- **`.gnupg`**, **`.ssh`**, **`.aws`** — universal load-bearing; never auto-nuke regardless of mtime.

## When to fall back to NEEDS_CONTEXT

If the cascade fails (folder is named like a tool but verification finds nothing) AND the user can't identify the owning tool when asked → mark as NEEDS_CONTEXT in the report. Don't guess.

## Cross-skill propagation

When this skill identifies a new owning-tool pattern that's not in `tool-ownership-map.md`, the safe-nuke-agent surfaces it for operator review. If the operator confirms the pattern, add it to the map (separate edit; not in the same cleanup run). The map is canonical — heuristics are the fallback when the map is incomplete.
