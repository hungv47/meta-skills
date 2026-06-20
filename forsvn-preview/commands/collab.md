---
description: Start a Proof collaborative-doc session for a long-form FORSVN artifact — turn-by-turn human↔agent editing where you suggest via forsvn-mcp and the human accepts in the Proof editor. Use for iterative docs (specs, plans, decision records) that need back-and-forth, not one-shot approve/deny (use /forsvn:review for that). The doc-server is long-lived and acceptance is human-owned, so the operator runs forsvn-collab; you present the flow and collaborate via the suggest-only MCP tools.
argument-hint: [artifact-path]   (empty = list collab-eligible artifacts)
allowed-tools: Bash(bun:*), Read
---

# FORSVN — collaborative-doc session (Proof)

This is the **iterative** review surface — distinct from `/forsvn:review`
(one-shot approve/deny/suggest on a rendered page). Here a long-form Markdown
artifact opens in the **Proof** editor and you and the human iterate on it
turn-by-turn: **you suggest** through the `forsvn-mcp` `collab_*` tools, **the
human accepts** in the editor. You never accept, and you never run the
`forsvn-collab` CLI — the doc-server is long-lived and acceptance is
human-owned (ADR D2/D4). You set the session up and collaborate; the operator
owns the server and the decision.

## Prerequisites (tell the operator if missing)

- **`forsvn-mcp` registered** in this agent so the `collab_*` tools exist (see
  `.mcp.json.example`, or run `/forsvn:doctor`).
- **Proof installed** and `FORSVN_PROOF_DIR` set (one-time —
  `bun "${CLAUDE_PLUGIN_ROOT}/forsvn-preview/bin/proof-setup.ts"`, or the collaborative-docs
  runbook). Without it the doc-server can't start, and *this explicit* collab
  command has nothing to fall back to. (The auto-routed review surface, C5, is
  different: there a Proof-absent open degrades to the inline edit and kicks off
  first-use provisioning in the background — never a dead end. This command is the
  deliberate Proof path, so install Proof first.)
- **Bun** on PATH (the `forsvn-collab` CLI runs under it).

## Steps

1. **Find a doc.** If `$ARGUMENTS` is empty, list collab-eligible artifacts —
   long-form `docs/forsvn/artifacts/**/*.md` whose frontmatter is still `pending`
   (reuse the review queue):
   ```bash
   bun "${CLAUDE_PLUGIN_ROOT}/forsvn-preview/bin/forsvn-preview.ts" list --json
   ```
   Summarize them and pick (or confirm) one. If `$ARGUMENTS` is a path, use it.

2. **Hand the operator the open command.** Proof's server must stay up across the
   whole session, so the **operator runs this in their own terminal**, not you:
   ```bash
   forsvn-collab open <project_root>/<artifact.md>
   ```
   (`forsvn-collab` is on PATH when the plugin is enabled; otherwise
   `bun "${CLAUDE_PLUGIN_ROOT}/forsvn-preview/bin/forsvn-collab.ts" open …`.) It imports the doc,
   writes the `proof_slug` / `collab_state: in_review` binding to frontmatter, and
   opens the editor. Tell them to leave it running.

3. **Collaborate, suggest-only.** Once the binding exists, use the `forsvn-mcp`
   tools to read and propose — `collab_read`, `collab_suggest`, `collab_comment`,
   `collab_events`. Your edits land as **suggestions**; the human accepts/rejects
   them in Proof. There is no accept/approve tool, by design — do not look for one.

4. **Export when the human is done.** The operator exports the accepted Markdown
   back to the canonical `.md`:
   ```bash
   forsvn-collab export <project_root>/<artifact.md> --decision approved|denied|suggested
   ```
   (or they press Enter in the `open` terminal). Export is structure-preserving,
   not byte-identical once collaborated on (it reflows tables — expected); the
   open→export hash guard refuses if the on-disk file changed out of band. When the
   canonical body changed, export prints a `done_with_concerns` warning (review the
   git diff for any out-of-channel accept) — the operator passes `--unreviewed-ok`
   to silence it once they've reviewed in the editor.

## Invariants
- **Suggest-only.** You propose; the human accepts. The guard is the *absence* of
  an accept tool — never fabricate or simulate acceptance.
- **Human runs the server.** Don't run `forsvn-collab` yourself; it's a long-lived
  operator process. You drive the MCP suggest tools.
- **Canonical MD stays the source of truth.** Proof holds transient working
  state; only `forsvn-collab export` writes the `.md`.
- **Local-first.** Doc-server binds loopback + SQLite; no cloud.
