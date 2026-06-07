# U1 spike findings — Proof round-trip GATE: **PASS** (2026-06-08)

Empirical results from running the harness against `proof-sdk@0.1.0` (shallow main),
doc-server on `127.0.0.1:4000`, SQLite local, `PROOF_SHARE_MARKDOWN_AUTH_MODE=none`
(the real env var; shortened to `AUTH_MODE` in prose below and in the ADR/runbook).
These are the real, observed contract shapes — they supersede the doc-derived guesses
in the plan's Sources section. Downstream units (U4–U7) build against these.

## Gate verdict

Fixture: `debate-agents-2026-05-27-business-model.md` (10393 bytes; 18 frontmatter
keys incl. quoted strings + inline `keywords` list; 2 code fences; 32 table rows).

| Export path | Frontmatter | Fences | Tables | Body | Verdict |
|---|---|---|---|---|---|
| `GET /d/:slug` + `Accept: text/markdown` | preserved (18/18) | 2/2 | 32/32 | **canonical re-serialization** | ✅ structure, ⚠ formatting |
| `GET /documents/:slug/snapshot` (block reassembly) | preserved | 2/2 | 32/32 | reflowed (+blank lines) | ✅ structure, ✗ byte |

**Decision: the export leg (U6) uses content-negotiation (`Accept: text/markdown`),
NOT snapshot-block reassembly.** It is structure-preserving but NOT byte-identical once a
projection is built — Milkdown canonicalization reformats tables and inserts a blank line
after the frontmatter close (see revised section below). The 10393-in/10393-out byte-perfect
result held only before first collaboration, straight from stored bytes.

## ⚠ Export is canonical re-serialization, NOT byte-identical (revised)

The U1 "byte-identical" result held **only because no projection was built** — the
export came straight from stored bytes. Once a doc is collaborated on (a suggestion
posted, or the editor opened → projection built/repaired), `GET /d/:slug` text/markdown
returns **Milkdown's canonical Markdown**, which normalizes formatting:

```
in:  | a | b |          out: | a  | b  |
     |---|---|               | :- | :- |
     | 1 | 2 |               | 1  | 2  |
```

Tables are column-padded + given `:-` alignment markers; a blank line is inserted after
the frontmatter close; other CommonMark/GFM canonicalization applies. **Cell/content is
preserved; only formatting changes.** Consequence: the FIRST `forsvn collab export` of an
artifact produces a cosmetic reformat diff in git. Acceptable (arguably an improvement —
consistent tables), but real. Document it in the runbook; surface as DONE_WITH_CONCERNS.

Two other table facts:
- **GFM tables block the agent `/ops` path** unless projection repair is enabled. Proof
  ships it OFF; the launcher (U4) now sets `COLLAB_PROJECTION_REPAIR_WORKER_ENABLED=true`
  (+ on-demand + startup reconcile + 500ms interval + min-chars 0). With it, table docs
  settle in ~tens of ms. Without it, they never settle.
- Token-less `GET /d/:slug` (Accept: text/markdown) works under `AUTH_MODE=none`; the
  `/snapshot` and `/state` endpoints require auth (401 without). Export uses the former,
  so a standalone `forsvn collab export` needs no persisted token (no link-token in git).

## Observed contract (for U4–U7)

### Create — `POST /documents`
Request: `{markdown, title, role:"commenter", ownerId:"agent:..."}`
Response: `{success, slug, docId, url:"/d/<slug>", ownerSecret, accessToken, accessRole, shareState:"ACTIVE", ...}`
- `ownerSecret` → operator-only (Bearer). `accessToken` → scoped link token.

### Export — `GET /d/:slug?token=<accessToken>` with `Accept: text/markdown`
Returns raw markdown, `content-type: text/markdown; charset=utf-8` — byte-faithful from
stored bytes, but canonical re-serialization once a projection exists (see §revised above).

### Agent ops — `POST /documents/:slug/ops` (Bearer ownerSecret or scoped token)
- `suggestion.add`: `{type, by:"ai:...", kind:"replace", quote, content}`
  → `{success, eventId, markId, marks:{<id>:{kind, by, quote, content, status:"pending", startRel:"char:N", endRel:"char:M", createdAt}}}`
  - **Anchoring is server-side**: send `quote` (the literal text) + `content`; server computes `startRel/endRel`. No offset math needed in our code.
- `comment.add`: `{type, by:"ai:...", quote, text}`
  → mark `{kind:"comment", quote, text, threadId, thread:[], resolved:false}`
- (not exposed to agents by us: `suggestion.accept` / `suggestion.reject` — human-only, §9.2=B)

### Events — `GET /documents/:slug/events/pending?after=<cursor>&limit=N`
Response: `{success, events:[{id, type, data, actor, createdAt, ackedAt, ackedBy}], cursor}`
- Types seen: `document.created`, `suggestion.replace.added`. Human accept/reject will
  surface here too (verify exact type strings when wiring U7).
- Ack: `POST /documents/:slug/events/ack` `{upToId, by}`.

### Readiness race (IMPORTANT for U7)
Immediately after `POST /documents`, `/ops` returns
`409 {success:false, code:"PROJECTION_STALE", error:"...retry after repair completes"}`.
A ~2–3s settle (or poll until ops succeeds) resolves it. **The MCP proxy (U7) must
retry on `PROJECTION_STALE` with backoff**, and `forsvn collab open` (U5) should not
report "ready" until the projection settles.

## Config confirmed local-only
Port 4000 (`PORT`); SQLite at `DATABASE_PATH`; snapshots at `SNAPSHOT_DIR`; no S3 unless
`SNAPSHOT_S3_*`/`AWS_*` set (they were not). Binds `127.0.0.1`. CORS allowlist defaults to
localhost:3000/4000. `PROOF_COLLAB_SIGNING_SECRET` unset → ephemeral in-memory key (fine
for local; set a stable secret in U4 if persistence across restarts is wanted).

## Server entry (for U4 launcher)
`npm run serve` = `tsx server/index.ts`. Node v22. ~397 npm packages. Express + `ws` +
embedded Hocuspocus/Yjs collab runtime (`ws://localhost:4000/ws`).
