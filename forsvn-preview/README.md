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
| `bin/forsvn-preview.ts` | The render + serve + decision-capture CLI (plus the `list` state-report subcommand) |
| `bin/lint-html-output.ts` | Lints rendered HTML against the review-surface output contract |
| `lib/render.ts` | `renderArtifactToHtml()` — Markdown → themed HTML (the real `renderReviewSurface`) |
| `assets/_html/` | `base.html`, `tokens.css`, `chrome.css`, `chrome.js`, per-stack `exemplars/` |
| `references/` | `review-surface-design.md` (visual tokens) + `review-surface-template.md` (structural HTML contract) |
| `test/test-forsvn-preview.ts` | End-to-end CLI test |

## Contract split

The **artifact contract** (what frontmatter + `## Review Gate` block to write) stays skill-side in `meta-skills/references/reviewable-artifact-contract.md`. Only **rendering + capture** live here. A skill is fully functional without this plugin; it just emits Markdown and the operator reviews it however they like (e.g. Roughdraft).

## Distribution (open)

Source home is this top-level `forsvn-preview/` dir in the `forsvn-com/forsvn` repo. How it reaches users via the marketplace is an open operator decision — either its own published mirror repo (referenced by a `github:` source) or bundled into the `meta-skills` publish. The `marketplace.json` entry currently uses a relative `./forsvn-preview` source as a placeholder.
