---
title: Review-Surface Template — structural HTML contract for skill emitters
lifecycle: canonical
status: stable
produced_by: meta-skills (v3 review-surface overhaul, 2026-05-26)
consumers: every reviewable skill that emits `review_surface: html`
load_class: PLAYBOOK
---

# Review-Surface Template

**The structural HTML template skill authors fill in when emitting a
`review_surface: html` preview. Layout, font loading, and chrome behaviors are
shared; per-skill code only fills the center stage and the left-controls.**

The visual contract (tokens, motifs, motion) is [[review-surface-design]].
This file is the *structural* spec — what HTML must be emitted, what placeholders
must be filled, what's allowed/forbidden in the per-skill regions.

---

## 1. The shared template

The canonical template ships at `references/_html/base.html`. It uses
double-brace placeholders that emitters substitute. Required placeholders:

| Placeholder | Filled with | Source |
|---|---|---|
| `{{stack}}` | `air \| water \| fire \| earth` | Artifact frontmatter `stack` |
| `{{title}}` | Display title | First H1 or `title:` frontmatter |
| `{{skill}}` | Producing skill slug | Frontmatter `skill` |
| `{{date}}` | `YYYY-MM-DD` | Frontmatter `date` |
| `{{slug}}` | Artifact slug | Filename slug component |
| `{{decision_state}}` | `pending \| approved \| denied \| suggested \| not_required` | Frontmatter `decision_state` |
| `{{tokens_css_href}}` | Relative path to `tokens.css` | Usually `./tokens.css` (copied alongside) |
| `{{chrome_css_href}}` | Relative path to `chrome.css` | Usually `./chrome.css` |
| `{{chrome_js_src}}` | Relative path to `chrome.js` | Usually `./chrome.js` |
| `{{stage_fonts_link}}` | Per-stack `<link>` for the stage's font pair | See § 2 |
| `{{md_path}}` | Repo-relative path to the `.md` twin | URL-encoded, for `roughdraft://open?path=…` |
| `{{artifact_data_json}}` | JSON mirror of MD frontmatter | Used by Copy-as-JSON action |
| `{{left_controls_html}}` | Per-skill controls block | See § 3 |
| `{{stage_html}}` | Per-skill center stage content | See § 4 |

---

## 2. Per-stack font link blocks

Substitute exactly one of these for `{{stage_fonts_link}}`:

```html
<!-- AIR -->
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&display=swap" rel="stylesheet">
<!-- WATER -->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Plus+Jakarta+Sans:wght@400;500&display=swap" rel="stylesheet">
<!-- FIRE -->
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Manrope:wght@400;500&display=swap" rel="stylesheet">
<!-- EARTH -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,ital,wght@6..72,0,400..600;6..72,1,400&display=swap" rel="stylesheet">
```

Chrome fonts (Inter + JetBrains Mono) are loaded unconditionally — never strip
that link.

---

## 3. Left-controls contract

The left panel always carries 4 control groups in this order:

```html
<div class="control-group" data-picker-group>
  <h2>Variants</h2>
  <button class="picker-item" data-picker-value="v1" aria-selected="true">Option 1</button>
  <button class="picker-item" data-picker-value="v2" aria-selected="false">Option 2</button>
</div>

<div class="control-group">
  <h2>Compare</h2>
  <button type="button" data-toggle="comparison">Side by side</button>
</div>

<div class="control-group">
  <h2>View</h2>
  <button type="button" data-toggle="density">Density · loose</button>
  <button type="button" data-toggle="grid">Grid overlay</button>
</div>

<div class="control-group">
  <h2>Export</h2>
  <button type="button" data-copy-source="artifact-data">Copy as JSON</button>
  <button type="button" data-copy-source="tokens-css">Copy tokens.css</button>
</div>
```

A skill may omit a group when it doesn't apply (e.g. a single-option
`debate-agents` artifact has no variant picker). It may **not** add control
groups beyond the four — that's how operators learn the surface once.

`data-picker-group` and `data-copy-source` are wired up by `chrome.js`. No
per-skill JS needed for the standard interactions.

---

## 4. Stage contract — what skills may put inside

The stage is the only region whose content varies per skill. Skills may use any
HTML/CSS the design spec permits, with these constraints:

**Allowed:**
- Semantic HTML for the artifact's content (sections, articles, figures, tables)
- Inline `<style>` for per-artifact-instance tweaks that can't be tokens
  (rare — prefer extending tokens.css)
- Static data tables, diagrams (SVG), images (data URIs preferred)
- One inline `<script>` block max, for **read-only** view-mode toggles wired
  to `data-toggle` attributes

**Forbidden:**
- `<form>` elements
- `<button>` with `onclick` that mutates persistent state
- Any `fetch()` / `XMLHttpRequest` / WebSocket
- External script imports beyond the chrome fonts + the three local CSS/JS
  files
- Mixing element themes within one page (no swapping `data-stack` at runtime)

These forbiddens are enforced by `scripts/lint-html-output.ts` (added in WS-10).

---

## 5. The `renderReviewSurface(stack, stagePartial, data)` shape

A skill emits HTML by calling a single function. The function is **not yet
implemented** as a shared library in this repo — each skill that needs it
should follow the contract below.

```typescript
type RenderArgs = {
  stack: "air" | "water" | "fire" | "earth";
  title: string;
  skill: string;
  date: string;            // YYYY-MM-DD
  slug: string;
  decisionState: "pending" | "approved" | "denied" | "suggested" | "not_required";
  mdPath: string;          // repo-relative; URL-encoded inside the template
  artifactData: Record<string, unknown>; // MD frontmatter mirror
  leftControlsHtml: string;
  stageHtml: string;
};

function renderReviewSurface(args: RenderArgs): string;
```

The function:
1. Reads `references/_html/base.html`.
2. String-substitutes the placeholders.
3. Selects the correct `{{stage_fonts_link}}` block from § 2.
4. Returns the assembled HTML string.

Output path follows the flat-artifact grammar — the HTML twin sits beside the
MD: `.forsvn/artifacts/<stack>-<skill>-<date>-<slug>.html`.

---

## 6. Anti-patterns

1. **Hand-rolling the HTML scaffolding per skill.** Every skill uses the shared
   `base.html` template. New chrome regions go in the template, not per-skill.
2. **Importing tokens via inline `<style>`.** Always `<link rel="stylesheet"
   href="./tokens.css">`. Inline imports defeat caching and break the linter.
3. **Adding control groups beyond the four.** Operators learn the surface once.
4. **Per-skill JS for standard interactions.** Picker selection, copy-to-clipboard,
   and Roughdraft link flash are in chrome.js. Don't duplicate.
5. **Per-skill animation libraries.** v1 motion is CSS transitions only.
6. **Forgetting the `<script type="application/json" id="artifact-data">`
   block.** Copy-as-JSON needs it; manifest consumers can also read it.

---

## 7. Related refs

- [[review-surface-design]] — visual tokens, motifs, motion (per-stack)
- [[reviewable-artifact-contract]] — when to set `review_surface: html`
- [[roughdraft-review-protocol]] — how the HTML preview interacts with Roughdraft
- [[manifest-spec]] — how `review_surface` is indexed
