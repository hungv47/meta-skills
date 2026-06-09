---
description: Open the FORSVN artifact review surface — list what is awaiting a human decision and serve a chosen artifact on a local CSRF-protected page so the operator can approve, deny, or request changes. Use after producing/updating a `.forsvn/artifacts/` artifact to hand it to a human, or to check what is pending. Decisions stay human-owned; this only presents and reports.
argument-hint: [artifact-path | "pending"]   (empty = list pending, then serve the top item)
allowed-tools: Bash(bun:*), Read
---

# FORSVN — review an artifact

You are driving **forsvn-preview**, the local review surface. Artifacts are plain
Markdown under `.forsvn/artifacts/`; this command renders one into a themed HTML
twin and serves it on `127.0.0.1` so the operator can decide. **You present and
report — you never fabricate a decision.** The human clicks approve / deny /
suggest in the browser; the CLI writes that choice back into the artifact's
frontmatter and prints it.

The CLI is bundled with this plugin. Invoke it as
`bun "${CLAUDE_PLUGIN_ROOT}/forsvn-preview/bin/forsvn-preview.ts" …` so it resolves wherever the
plugin is installed. The CLI ships **inside** the `forsvn` plugin (installing
that plugin is how you get it), but once installed it is self-contained — it
does **not** require the `forsvn-mcp` binary or any separate install.

**Prerequisite — Bun.** The CLI runs under [Bun](https://bun.sh) (`curl -fsSL
https://bun.sh/install | bash`). If `bun` is not on PATH the Bash call fails
before the CLI can report anything — if you hit a "command not found", tell the
operator to install Bun, don't retry. (Errors *from* the CLI are already a single
actionable line; set `FORSVN_DEBUG=1` only when you need the full stack.)

**Cross-agent.** `${CLAUDE_PLUGIN_ROOT}` is injected by Claude Code. In Codex or
Cursor, which don't expand it, substitute the plugin's installed path explicitly:
`bun "<plugin-dir>/forsvn-preview/bin/forsvn-preview.ts" …` (the operator can find `<plugin-dir>`
from their agent's plugin/skill install location).

The CLI has exactly two forms — **never** invent others. `$ARGUMENTS` selects
between them but is **not** passed verbatim:
- `list …` — report state (always run first).
- `<artifact-path> …` — serve one artifact. The path MUST be a real `.md`/`.html`
  file; the words `pending`/`list` are report-only sentinels, not paths — never
  run `forsvn-preview.ts pending`.

**Path resolution.** `list` reports each entry's `path` **relative to the
`project_root`** it also returns (both in the JSON). Serve mode resolves its
argument against *your current directory*, so to be cwd-independent always serve
the **absolute** path — join `project_root` + the entry's `path` — not the bare
relative `path`. (A path the operator types in `$ARGUMENTS` is used as-is.)

## Steps

1. **Report state.** Always run, regardless of `$ARGUMENTS`:
   ```bash
   bun "${CLAUDE_PLUGIN_ROOT}/forsvn-preview/bin/forsvn-preview.ts" list --json
   ```
   Parse the JSON: `counts` (`pending`, `decided`, `other`, `total`), `pending[]`,
   `decided[]`. Each entry has
   `{ id, path, skill, stack, date, type, decision_state, review_surface, summary }`.
   Summarize the pending queue for the operator (id · stack/skill · date · one-line summary).
   If `$ARGUMENTS` is `pending` or `list` (or the operator only wants the queue),
   stop here — you have already reported it.

2. **Pick the artifact to serve.**
   - If `$ARGUMENTS` is a file path, use it as-is.
   - Else use the top `pending` entry. Form its **absolute** path by joining the
     `project_root` and the entry's `path` (per "Path resolution" above) so serve
     works from any cwd. If `pending` is empty, report "nothing awaiting review"
     and stop.
   - Confirm with the operator before serving if the choice is ambiguous.

3. **Pre-flight.** The CLI refuses to start unless the target's `decision_state`
   is `pending` and its working tree is clean (it rewrites the file). If `list`
   shows the artifact already decided, say so and stop — do not re-serve a
   decided artifact. If the tree is dirty, tell the operator to commit or stash
   the artifact first.

4. **Serve + capture.** Run (this blocks until the operator decides, up to 10 min)
   with the absolute path from step 2:
   ```bash
   bun "${CLAUDE_PLUGIN_ROOT}/forsvn-preview/bin/forsvn-preview.ts" <project_root>/<path> --json
   ```
   It opens the browser to the local page. The page is bound to `127.0.0.1` and
   CSRF-protected; tell the operator not to run it on a shared host. The final
   stdout line is JSON: `{ ok, decision_state, reviewed_at, md, archived, comments, variant }`,
   or `{ ok: false, reason: "timeout" }` if no decision was made in time.

5. **Report the outcome.** Relay the captured `decision_state` and any
   `comments` verbatim — that is the human's decision of record, now written into
   the artifact frontmatter. On `denied` / `suggested`, the operator's comments
   are your input for the next revision. On timeout, say no decision was
   captured and offer to re-serve.

## Invariants
- **Human-owned decisions.** You only render, serve, and report. Never POST a
  decision yourself or edit `decision_state` by hand.
- **One artifact per serve.** To review several, repeat step 4 per artifact.
- **Local-first.** No cloud, no telemetry; `127.0.0.1` + CSRF only.
