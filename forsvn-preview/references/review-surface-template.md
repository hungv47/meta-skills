---
title: Review-Surface Template — structural contract of the rendered twin
lifecycle: canonical
status: stable
produced_by: meta-skills (U9 review-webapp design pass rev 2, 2026-06-12; v3 overhaul 2026-05-26)
consumers: lib/render.ts (the only emitter); skills emit Markdown and never touch this
load_class: PLAYBOOK
---

# Review-Surface Template

**The structural contract of `assets/_html/base.html` — the single template
every HTML twin is rendered from. Skills emit plain Markdown; the plugin's
renderer (`lib/render.ts`) fills the placeholders. No skill ever authors HTML
against this template** (the v2-era "skill emitters fill the stage" model and
the never-implemented `renderReviewSurface(...)` are both retired — the
renderer in `lib/render.ts` is the real implementation).

The visual contract (tokens, themes, registers, motion) is
[[review-surface-design]]. This file is the *structural* spec.

---

## 1. Placeholders (filled by lib/render.ts)

| Placeholder | Filled with | Source |
|---|---|---|
| `{{stack}}` | `air \| water \| fire \| earth` (elemental register) | frontmatter `stack` (`meta`→air, `marketing`→water, `product`→fire, `research`→earth; legacy `mkt`→water) |
| `{{stack_name}}` | `meta \| marketing \| product \| research` | frontmatter `stack`, normalized |
| `{{title}}` | Masthead headline | frontmatter `title`, else the body's first H1, else the file slug |
| `{{skill}}` | Producing skill slug | frontmatter `skill` |
| `{{date}}` | `YYYY-MM-DD` | frontmatter `date` |
| `{{deck}}` | Masthead deck (one-line summary; may be empty) | frontmatter `summary` |
| `{{decision_state}}` | `pending \| approved \| denied \| suggested \| not_required` | frontmatter `decision_state` |
| `{{tokens_css_href}}` / `{{chrome_css_href}}` / `{{chrome_js_src}}` | `./tokens.css` etc. | resolved at view time by the CLI's bundled-asset fallback |
| `{{artifact_data_json}}` | JSON mirror of the frontmatter | `#artifact-data` block (chrome.js activation check + manifest consumers) |
| `{{preview_config_json}}` | `{"static":true}` at render time | the CLI overwrites it at serve time (§3) |
| `{{stage_html}}` | the typeset body: `<div class="prose">…</div>` | `markdownToHtml(body)` with the transforms below |

**Renderer transforms** (the typeset guarantee — markdown syntax and raw
frontmatter never reach the page):

1. Frontmatter is stripped and becomes the masthead (eyebrow `stack · skill ·
   date`, title, deck).
2. A leading `# H1` folds into the masthead (no duplicate headline).
3. The `## Review Gate` section renders as the sealed gate card
   (`<section class="gate" id="gate-echo">` with the read-only header/footer);
   its task list is marked `class="mirror-gate" aria-hidden="true"` so AT
   never announces a second decision control.
4. Everything else renders through the frozen markdown construct set
   (`lib/render.ts` — raw HTML stays escaped; external img srcs are neutered).

There is **no path placeholder**: the artifact's path appears only inside the
JSON config blocks, never in visible chrome.

## 2. Template-owned structure

`base.html` carries, in order:

- the **theme boot script** (inline, before the stylesheets — applies the
  stored `forsvn-theme` choice with no flash of the wrong theme),
- the CSP meta (`img-src 'self' data: file:` — local-only images),
- the self-hosted font block (`./fonts.css`; never a hosted font link),
- the **strip**: theme-swapped logo glyphs (`logo-glyph-cream.svg` dark /
  `logo-glyph-forest.svg` light) + mono wordmark, `review` crumb (pending
  count filled from config), register chip, theme segment, decision pill,
- the **stage** → `.sheet`: the workbench (hidden until a live serve), the
  artifact `<article>` (masthead + `{{stage_html}}`), the thread rail,
- the **ledger**: `<form id="decision-capture" action="javascript:void(0)">`
  with the radiogroup of keycap-labeled options (⌥A/⌥D/⌥S), the comment
  field, Done (⌘↵, `aria-disabled` until a pick), the `role="alert"` region,
  and the `role="status"` confirmation region,
- the two JSON blocks (`#preview-config`, `#artifact-data`) + `chrome.js`.

## 3. Serve-time activation

The CLI rewrites `#preview-config` with `{ token, port, endpoint, mdPath,
gate_warning, pending_count?, suggestions }` (all additions additive — see
[[review-surface-design]] §7). chrome.js activates the ledger + workbench only
when a token + localhost `/done` endpoint are present AND the artifact is
`pending`; otherwise the page stays read-only. The workbench's Edit mode saves
through `POST /edit` (same token, re-hash 409 guard, atomic write, frontmatter
preserved verbatim); annotations ride `POST /done` as the additive
`annotations` array and persist under `## Reviewer notes → ### Annotations`.

## 4. Anti-patterns

1. **A skill authoring HTML.** Skills emit Markdown per the artifact contract;
   the renderer owns the twin. Hand-built HTML drifts and fails the critic.
2. **New chrome regions.** The U9 bar: if it doesn't serve the read or the
   decision, it doesn't exist. Changes go in `base.html`, reviewed against the
   approved design.
3. **A second `<form>`, inline `onclick=`, or a non-localhost fetch target.**
   Hard lint fail ([[html-output-critic]] #6).
4. **Hosted fonts or any external request.** Self-hosted woff2 only.
5. **Showing a path.** Identity is title + skill + stack + date.
6. **Editing the placeholder doc-comment into live `{{…}}` syntax** — the
   global replacement would expand it (the comment uses `{ph: name}` form).

## 5. Related refs

- [[review-surface-design]] — the visual + interaction contract
- [[html-output-critic]] — the enforcement rubric
- [[reviewable-artifact-contract]] — when `review_surface: html` applies
