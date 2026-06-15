---
title: Cleanup Artifacts Cold-Start
lifecycle: canonical
status: stable
produced_by: cleanup-artifacts
load_class: PROCEDURE
---

# Cold-Start Question Bundle

**Load when:** scope, mode, or excludes are missing from invocation AND not resolvable from `.forsvn/index/manifest.json` / `docs/forsvn/experience/technical.md`. The orchestrator emits this single bundled prompt and waits for one round-trip per [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md).

---

## Prompt

```
cleanup-artifacts grooms the docs/forsvn/artifacts/ tree — classifies every file
(KEEP/STALE/ORPHAN/LEGACY/EPHEMERAL), surfaces references and risk,
and (with --apply) MOVES candidates to docs/forsvn/artifacts/.archive/.
Never deletes. Before I scan:

1. **Scope** — pick one:
   - full (docs/forsvn/artifacts/ — most common)
   - subpath (e.g., .forsvn/loops/)
2. **Mode** — dry-run (default; preview only) or apply (executes after
   per-category confirmation, MOVES to archive, never deletes).
3. **Staleness threshold** — days since last update before an artifact
   is flagged STALE. Default 90.
4. **Excluded paths** — anything off-limits even if it looks stale?
   (Persisted to docs/forsvn/experience/technical.md for future runs.)

Answer 1-4 in one response. I'll inventory, classify, run the critic gate,
then surface candidates.
```

## Write-back

| Q | File | Key |
|---|---|---|
| 4. Excluded paths | `docs/forsvn/experience/technical.md` | `Technical — cleanup-artifacts excluded paths` (durable across runs) |

Scope, mode, threshold are run-specific — NOT persisted.

## Defaults if operator answers partially

- Scope omitted → `docs/forsvn/artifacts/` (full)
- Mode omitted → `--dry-run`
- Threshold omitted → 90 days
- Excludes omitted → use whatever is already in `docs/forsvn/experience/technical.md` (empty list if none)
