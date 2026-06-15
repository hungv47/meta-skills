# Performance Ledger — export-time write

`publish-social` anchors post↔artifact attribution by writing a ledger row at export, so `evaluate-content`'s metric-ingest can later join real measured metrics back to the producing artifact. Rules (do not re-implement): [`../_shared/performance-data.md`](../_shared/performance-data.md) § Ledger.

## When

At **export** (every mode — `export` / `draft` / `publish`), before the bundle ships. Append-only; never edit a prior row. Credential-safety (Critical Gate 3) is unaffected — the ledger holds no secrets.

## What — one row per target platform

Append to `.forsvn/performance/ledger.tsv` (create with `# schema_version: 1` + the column header if absent):

| Column | Value at export |
|---|---|
| `ledger_id` | `<platform>-<YYYY-MM-DD>-<slug>` (unique) |
| `artifact_id` | the source write-social artifact's frontmatter `id` |
| `platform` | the target channel |
| `status` | `exported` |
| `event_date` | export date `YYYY-MM-DD` |
| `post_url` | empty (filled by metric-ingest at first import) |
| `format` | as declared for the platform |
| `placement` | `organic` (publish-social is organic; paid surfaces are `write-ad`'s lane) |
| `notes` | free text; no tabs/newlines |

The lifecycle continues `exported → live → measured`, advanced by metric-ingest on import (see `performance-data.md` § Ledger Lifecycle and Join Rule).
