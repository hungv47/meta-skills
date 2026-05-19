---
title: Machine-Cleanup — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: machine-cleanup
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** critic-agent fires (Step 5 in Dispatch Protocol), or any moment safe-nuke-agent is about to execute a deletion that smells off — bulk, auth-bearing, mid-process, shell-rc-referenced. Re-read at every doubt.

---

## Failure mode catalog

| Anti-Pattern | Problem | INSTEAD |
|--------------|---------|---------|
| "It's a dotfolder, must be safe to nuke" | Some dotfolders contain auth tokens, session DBs, or active SQLite | Inspect contents and mtime before classifying |
| Bulk-deleting all of `~/.*` | Loses SSH keys, AWS creds, gcloud auth, MCP server auth | Per-target review only |
| Treating `~/.config/<tool>/` like cache | XDG config = load-bearing settings, not throwaway | Classify as `load-bearing` by default; require justification to nuke |
| Nuking while the app is running | Corrupts SQLite, crashes the app, may lose unsaved data | `pgrep` check + clean quit via AppleScript first |
| "I'll just `rm -rf` and tools will recreate it" | Some tools (Codex, Snaply) write encrypted state that doesn't restore on relaunch | Surface what re-login/re-config will be needed |
| Forgetting shell rc side effects | Nuking `.cargo/env` leaves `.zshenv` throwing on every new shell | Update shell rc files in same operation |
| Conflating "old" with "abandoned" | Some load-bearing files (auth tokens, gitconfig) are old by design | Age is one signal, not a verdict |
| Nuking the package manager but keeping its data | Nuking `.cargo` while keeping `~/.rustup` leaves dangling rustup proxies | Treat the runtime as a unit |

## When NOT to nuke (exit conditions)

The safe-nuke-agent skips or surface-only's these situations entirely:

- **User-data dirs** (Desktop, Documents, Downloads, Pictures, Movies, Music, Public, cloud-mount symlinks) — surface only, never auto-recommend nuke.
- **Active state** (mtime <5 minutes, `.pid`/`.sock`/`-wal` files present) — process-check first; if owning app is running, quit cleanly via AppleScript or warn and skip.
- **Load-bearing config** with auth state (`.aws`, `.ssh`, `.config/gh`, `.config/gcloud`, `.config/<tool>` containing credentials per auth-credential-patterns.md) — keep with strong push-back unless tool is verifiably gone AND user explicitly says "nuke auth, I'll re-login."
- **Tool ownership unclear** (no entry in tool-ownership-map.md, cascade in tool-ownership-heuristics.md fails, user can't identify) — NEEDS_CONTEXT; ask before removing.
- **Backup not possible** (irreversible encrypted state like `.snaply`) — surface that nuke is irreversible; require explicit confirmation that user accepts data loss.

## When the critic FAILs

The critic-agent identifies the specific deletion that violated a golden rule. Action:

1. Restore from backup (the safe-nuke-agent creates one before each deletion when possible).
2. If backup isn't possible (irreversible encrypted state) → report the violation + instruct reinstall steps if reinstall is possible.
3. Log the failed deletion in the report's "Critic Verdict" + "Manual Follow-ups" sections.
4. Pause the session; ask operator how to proceed.
5. If operator confirms the deletion was actually intentional → log as DONE_WITH_CONCERNS and resume.
6. If operator did NOT intend the deletion → halt + flag for human review.

Never silently bypass a critic FAIL — the 6 golden rules are the safety contract.
