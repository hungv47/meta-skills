# forsvn-preview

Optional review-surface preview for FORSVN artifacts. **Skills emit plain Markdown** — install this plugin to render a themed HTML preview and capture an approve / deny / suggest decision back into the artifact's frontmatter.

This is the mechanism that used to live inside individual skills (the `renderReviewSurface` instruction + per-skill `forsvn-preview.ts` / `_html` copies). It now lives here, once, so the skill bundle stays lean.

## Usage

### `/forsvn-preview:review` (agent-drivable entry)

The fastest path. Once the plugin is installed, an agent or human invokes the
command — it lists what is awaiting a decision and serves a chosen artifact for
review:

```
/forsvn-preview:review                 # list pending, then serve the top item
/forsvn-preview:review pending         # just list pending/decided state
/forsvn-preview:review <artifact.md>   # serve a specific artifact
```

The command drives the bundled CLI (below) via `${CLAUDE_PLUGIN_ROOT}`, so it is
self-contained — no `forsvn-mcp` binary or `forsvn-skills` install required.
**Decisions stay human-owned:** the command renders, serves, and reports the
operator's choice; it never fabricates a decision.

### `/forsvn-preview:collab` (iterative Proof session)

The **turn-by-turn** surface, distinct from one-shot review: a long-form artifact
opens in the **Proof** editor and the agent and human iterate on it — the agent
suggests via the `forsvn-mcp` `collab_*` tools, the human accepts in the editor.
The operator owns the long-lived doc-server and runs `forsvn-collab open|export`
(on PATH when the plugin is enabled); the agent never runs the CLI and never
accepts. Needs `forsvn-mcp` + the Proof SDK — documented in the app repo's
`docs/runbooks/collaborative-docs.md` (`forsvn-com/forsvn`).

### `/forsvn-preview:doctor` (install health check)

Reports which of the three layers — **review surface** (Bun + git), **MCP
contract** (`forsvn-mcp`), **Proof collab** (forsvn-mcp + Node 18+ + a valid
`FORSVN_PROOF_DIR`) — are live, each failing check with a one-line fix. Read-only:
it diagnoses, never installs. Run it when `:review`/`:collab` misbehave or to
confirm a fresh install is usable, not just installed.

### CLI

```bash
# Serve one artifact for review (blocks until the operator decides):
bun forsvn-preview/bin/forsvn-preview.ts .forsvn/artifacts/<stack>/<skill>-<date>-<slug>.md

# Report review state (the PP-3 surface an agent reads first):
bun forsvn-preview/bin/forsvn-preview.ts list [--root <dir>] [--state pending|decided|all] [--json]
```

What the serve path does:

1. **Renders** the Markdown artifact → an HTML twin (`<same-name>.html`) via `assets/_html/base.html`, themed by the artifact's `stack` frontmatter (`meta`→air, `marketing`→water, `product`→fire, `research`→earth). See `lib/render.ts`.
2. **Serves** the preview on a CSRF-protected `127.0.0.1` Bun server and opens the browser.
3. On **Done**, writes `decision_state` (approved | denied | suggested) + comments back into the `.md` frontmatter and archives the HTML to `.forsvn/artifacts/.archive/`.

The artifact's `decision_state` must be `pending` to start. The MD is the source of truth; the HTML twin is regenerated each run.

`list` is read-only: it scans `.forsvn/artifacts/` (excluding `.archive/`), reports
every artifact carrying a `decision_state`, and buckets them into `pending` vs
`decided`. `--json` emits `{ ok, project_root, counts, pending[], decided[] }` for
an agent; the bare form prints a human table.

Roughdraft remains the escape-hatch for Markdown-first review (`review_tool: roughdraft`).

## Layout

| Path | What |
|---|---|
| `commands/review.md` | `/forsvn-preview:review` — the agent-drivable entry (list pending + serve one for a human decision) |
| `commands/collab.md` | `/forsvn-preview:collab` — set up an iterative Proof session (agent suggests, human accepts) |
| `commands/doctor.md` | `/forsvn-preview:doctor` — per-layer install health check |
| `bin/forsvn-preview.ts` | The render + serve + decision-capture CLI (plus the `list` state-report subcommand) |
| `bin/forsvn-collab` + `bin/forsvn-collab.ts` | Operator CLI for the Proof flow (`open`/`export`); the `forsvn-collab` shim puts it on the Bash PATH when the plugin is enabled |
| `bin/forsvn-doctor.ts` | Layered health check (`--json` for agents) backing `/forsvn-preview:doctor` |
| `bin/forsvn-mcp-launch.ts` | Resolves the `forsvn-mcp` binary (PATH → `$CLAUDE_PLUGIN_DATA` cache → checksum-verified release download) and execs it as the stdio MCP server, so an agent needs no Rust toolchain |
| `bin/proof-setup.ts` | One-time guided setup for the Proof collab tier (clone + install + `FORSVN_PROOF_DIR`) |
| `bin/lint-html-output.ts` | Lints rendered HTML against the review-surface output contract |
| `lib/render.ts` | `renderArtifactToHtml()` — Markdown → themed HTML (the real `renderReviewSurface`) |
| `assets/_html/` | `base.html`, `tokens.css`, `chrome.css`, `chrome.js`, per-stack `exemplars/` |
| `references/` | `review-surface-design.md` (visual tokens) + `review-surface-template.md` (structural HTML contract) |
| `test/test-forsvn-preview.ts` | End-to-end CLI test |

## Contract split

The **artifact contract** (what frontmatter + `## Review Gate` block to write) stays skill-side in `meta-skills/references/reviewable-artifact-contract.md`. Only **rendering + capture** live here. A skill is fully functional without this plugin; it just emits Markdown and the operator reviews it however they like (e.g. Roughdraft).

## Distribution

Source home is `skills/forsvn-preview/` in the `forsvn-com/forsvn` monorepo. It ships as the **second plugin** alongside `forsvn`, registered in two marketplaces with relative sources (no separate mirror repo):

- `skills/.claude-plugin/marketplace.json` (`./forsvn-preview`) — published one-way to the public mirror `github.com/hungv47/meta-skills`, the canonical install URL.
- the monorepo's root `.claude-plugin/marketplace.json` (`./skills/forsvn-preview`) — the direct `forsvn-com/forsvn` install door.

Install with `/plugin install forsvn-preview` after adding either marketplace.
