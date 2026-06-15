---
title: Cleanup Artifacts — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: cleanup-artifacts
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the critic fires or the orchestrator is about to choose a classification/action that smells off. These are the failure modes this skill was built to prevent — re-read at any moment of doubt.

---

## Classification anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Treating `docs/forsvn/artifacts/meta/records/` as ephemeral | These are dated, immutable snapshots (audit trail). Pruning by age alone destroys the trail. | Use the `EPHEMERAL pattern list` in [`cleanup-rules.md`](cleanup-rules.md). Records are STALE-only, never EPHEMERAL. |
| Pruning `docs/forsvn/experience/*.md` | Append-only Q&A substrate, read by every skill. | HARD-NEVER. |
| Pruning `tasks.md` or `roadmap.md` | Session anchors, always loaded. | HARD-NEVER. |
| Treating filename-match alone as EPHEMERAL | A dated record `2025-11-30-fresh-eyes-foo.md` matches no ephemeral pattern, but a careless regex could fire | Apply the "NOT under records/ or decisions/" carve-out from [`cleanup-rules.md`](cleanup-rules.md). |

## Execution anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Skipping the critic gate to save time | The whole point of the skill is the gate. Without it, this is `rm -rf` with extra ceremony. | The gate is mandatory; delete operations bypass it only when escalating to operator. |
| Deleting instead of moving | "Reversible" means the operator can recover from a mistake without git surgery. | MOVE to dated archive. Always. |
| Operating without `.forsvn/index/manifest.json` fresh | Stale manifest classifies wrong. | Run `bun scripts/manifest-sync.ts` first if manifest mtime > 1 day. |
| Recursing into submodule dirs | Each submodule is its own repo with its own cadence; this skill operates at one repo level only. | Read `.gitmodules`; skip those paths. |
| Reporting with no per-file rationale | Operator can't audit a "trust me, this is stale" list. | Every candidate gets class + last-mod + bytes + reference count. |
| Walking with `find -L` | Symlinks may point outside scope or into `.git/` | Plain `find` — never follow links. |
| Re-processing files inside `.archive/` | Already archived; re-archiving duplicates. | Skip `.archive/` in the walk filter. |
| Auto-archiving TIER-3 (tracked + dirty) files | Operator's uncommitted edits could be in-progress work. | Surface separately; never archive on `--apply`. |
| Sampling deterministically by file order without sort | Different filesystems return different order; reruns aren't auditable. | Sort by path before sampling. |
| Skipping manifest-sync after moves | Stale manifest re-classifies wrong on next run. | Always re-sync after any actual move. |
| Prompting per-file instead of per-category | UX collapse for any cleanup with >5 candidates. | v1 is per-category; per-file is `--paranoid` (out of scope). |
| Proceeding silently when scope is HARD-NEVER | Could touch canonical data. | Refuse at the orchestrator's Step 1 with BLOCKED. |
| Deleting the report you just wrote | Self-deletion; the report goes under `meta/records/` (HARD-NEVER for snapshot lineage in this run). | Don't classify the in-progress report. |
