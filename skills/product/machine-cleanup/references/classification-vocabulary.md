---
title: Machine-Cleanup — Classification Vocabulary
lifecycle: canonical
status: stable
produced_by: machine-cleanup
load_class: PROCEDURE
---

# Classification Vocabulary

**Load when:** any scanner agent (Layer 1) or the orphan-detection-agent (Layer 2) classifies a target. Every target gets exactly one classification. The `safe-nuke-agent` uses these to phrase its per-target recommendation.

---

## The 7 classes

| Class | Meaning | Default recommendation |
|---|---|---|
| **active** | Tool is installed AND used recently (mtime <30d, or process running, or referenced from current session) | Keep |
| **load-bearing** | Active and contains unique state (auth, settings, history) — not regenerable | Keep with strong push-back |
| **abandoned** | Tool may be installed but folder hasn't been touched in 30+ days; no recent process activity | Recommend nuke; explain what user loses |
| **orphan** | Owning tool was already removed (CLI not on PATH, app not in `/Applications`, sibling folder gone) | Strong recommend nuke |
| **cache** | Pure regenerable cache (inside `~/.cache/`, or named `cache/`/`_cacache/`) | Recommend nuke without ceremony |
| **empty** | 0-byte directory or only contains `.DS_Store` | Auto-suggest nuke |
| **user-data** | Contains user-created content (recordings, documents, captures) | Never auto-recommend nuke; surface only |

## Classification decision tree

```
1. Is the folder under a user-data path (Desktop, Documents, Downloads,
   Pictures, Movies, Music, Public, cloud-mount symlinks)?
   YES → user-data. Surface only. STOP.

2. Is the folder 0 bytes (or only .DS_Store)?
   YES → empty. STOP.

3. Is the folder inside ~/.cache/, or is the folder named cache/ or _cacache/?
   YES → cache. STOP.

4. Identify the owning tool (use tool-ownership-map.md +
   tool-ownership-heuristics.md). Is the tool still installed?
   NO → orphan. STOP.

5. Has the folder mtime been touched in last 30 days, OR is the owning
   process currently running, OR is the tool referenced from the current
   shell session?
   YES → continue to step 6.
   NO → abandoned. STOP.

6. Does the folder contain auth state (per auth-credential-patterns.md),
   settings/history files, or unique user-generated data not in
   user-data dirs (e.g., editor state, browser profiles)?
   YES → load-bearing.
   NO → active.
```

## Edge cases

- **Tool installed via multiple channels** (e.g., `codex` via brew formula + brew cask + bun global): classify the folder as `active`; flag the redundancy in the package-inventory-agent output for separate operator decision.
- **Folder unique to a deleted sibling** (e.g., `.kimi-webbridge` while `.kimi` is gone): `orphan`, even if mtime is recent (sibling folder might have been deleted today).
- **Empty `.config/<tool>` folder** while owning tool is installed: still `empty` — auto-suggest nuke. Tool will recreate on next run.
- **`.config/<tool>` with only env-default values and no auth/customization**: still `load-bearing` until verified empty of unique state. Conservative bias.
- **macOS `~/Library/Application Support/<tool>`** (parallel to dotfolder): apply same classification logic. Cross-reference with the dotfolder.

## Cross-skill propagation

The classification is logged per target in the report's "Targets Nuked" + "Targets Kept" tables. Downstream consumers:

- `cleanup-artifacts` (meta-skill) reads recent machine-cleanup reports to surface staleness signals (if the same dotfolder reappears 3 times in 3 runs, the user's tools-tried-and-abandoned rate is high).
- Operator history audit — class distribution per run is a hygiene signal.

## Anti-pattern

**Don't invent new classes.** If a target doesn't fit one of the 7, the decision tree has a gap — flag it (NEEDS_CONTEXT in the report) and surface for operator. Don't paper over with a custom class.
