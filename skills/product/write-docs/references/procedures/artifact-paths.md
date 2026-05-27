# write-docs — Artifact paths by route

Full template + filename + version-increment rule: [`../report-template.md`](../report-template.md). v2 schema: [`../_shared/artifact-contract-template.md`](../_shared/artifact-contract-template.md).

## Paths by route

| Route | Path |
|---|---|
| Default | `README.md`, `docs/<topic>.md`, or specified location |
| Route C — Sync | in-place updates to existing docs with `<!-- synced: YYYY-MM-DD -->` markers |
| Route D — Ship Log | `research/product-context.md` (canonical cross-stack artifact; pre-write merge-mode check required) |
| Route E — Release Notes | `CHANGELOG.md` (prepend new entry); optionally GitHub Release body draft to stdout via `--gh-release` |
| Audit Mode | no writes — produces audit report inline |

## Lifecycle by doc-type

See [`../report-template.md`](../report-template.md) "Lifecycle by doc-type":

- **canonical:** README, User Guide, Config, Tutorial, Ship Log
- **pipeline:** API Reference
- **snapshot:** Release Notes

## Frontmatter (baseline)

`skill`, `version`, `date`, `status`, `stack` (=product), `review_surface` (=md by default; project-level canonical docs may opt into `html` for FIRE-themed preview), `decision_state`, `audience`, `doc-type`. Backfilled additions: `lifecycle`, `produced_by`, `provenance`.

## Consumed by

All 12+ downstream skills (Ship Log → `research/product-context.md` feeds create-brand, write-copy, optimize-seo, architect-system, etc.); users on `/plugin update` (Release Notes → CHANGELOG.md); `clean-code` + `review-work` + `architect-system` (read docs for drift detection).
