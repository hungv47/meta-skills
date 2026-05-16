---
title: Cleanup Artifacts Cold-Start
lifecycle: canonical
status: stable
produced_by: cleanup-artifacts
load_class: PROCEDURE
---

# Cold-Start Question Bundle

**Load when:** scope, mode, or excludes are missing from invocation AND not resolvable from `.agents/manifest.json` / `skills-resources/experience/technical.md`. The orchestrator emits this single bundled prompt and waits for one round-trip per [`../../_shared/pre-dispatch-protocol.md`](../../_shared/pre-dispatch-protocol.md).

---

## Prompt

```
cleanup-artifacts grooms the .agents/skill-artifacts/ tree — classifies every file
(KEEP/STALE/ORPHAN/LEGACY/EPHEMERAL), surfaces references and risk,
and (with --apply) MOVES candidates to .agents/skill-artifacts/.archive/.
Never deletes. Before I scan:

1. **Scope** — pick one:
   - full (.agents/skill-artifacts/ — most common)
   - subpath (e.g., skills-resources/loops/)
2. **Mode** — dry-run (default; preview only) or apply (executes after
   per-category confirmation, MOVES to archive, never deletes).
3. **Staleness threshold** — days since last update before an artifact
   is flagged STALE. Default 90.
4. **Excluded paths** — anything off-limits even if it looks stale?
   (Persisted to skills-resources/experience/technical.md for future runs.)

Answer 1-4 in one response. I'll inventory, classify, run the critic gate,
then surface candidates.
```

## Write-back

| Q | File | Key |
|---|---|---|
| 4. Excluded paths | `skills-resources/experience/technical.md` | `Technical — cleanup-artifacts excluded paths` (durable across runs) |

Scope, mode, threshold are run-specific — NOT persisted.

## Defaults if operator answers partially

- Scope omitted → `.agents/skill-artifacts/` (full)
- Mode omitted → `--dry-run`
- Threshold omitted → 90 days
- Excludes omitted → use whatever is already in `skills-resources/experience/technical.md` (empty list if none)
