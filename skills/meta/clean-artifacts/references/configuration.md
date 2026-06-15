# Configuration — clean-artifacts

| Parameter | Default | Description |
|---|---|---|
| scope | `docs/forsvn/artifacts/` | Path to audit. Subpaths allowed; HARD-NEVER paths refused. |
| mode | `--dry-run` | `--dry-run` (preview only) or `--apply` (move with confirmation) |
| threshold-days | 90 | Days since last update before STALE classification kicks in |
| critic-spot-check-N | 5 | Number of random STALE/ORPHAN candidates the critic greps |
| excluded-paths | (from `docs/forsvn/experience/technical.md`) | Operator-declared off-limits even if they look stale |

## Future Work (out of scope for v1)

- `--purge-archive` flag — actually delete files from `.archive/[date]/` older than N days. v1 only moves; never deletes.
- `--paranoid` mode — per-file confirmation instead of per-category.
- `--exclude <pattern>` CLI flag — run-scoped exclusion without persisting to `experience/technical.md`.
- Experience write-back DRY-RUN gate — write-back currently fires on every invocation (including `--dry-run`). Gate it so write-back fires only when `--apply` confirms.
- ORPHAN-on-JSON carve-out + slug-entropy axis.
- Hook integration — pre-commit or pre-PR cadence.
