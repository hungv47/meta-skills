---
title: Review-Surface Design System — the FORSVN review instrument (U9 spec)
lifecycle: canonical
status: stable
produced_by: meta-skills (U9 review-webapp design pass rev 2, 2026-06-12; v3 overhaul 2026-05-26)
consumers: the plugin renderer (lib/render.ts + assets/_html/*); every reviewable skill that emits `review_surface: html`
load_class: PLAYBOOK
---

# Review-Surface Design System

> [!NOTE]
> **U9 (2026-06-12, operator-approved revision 2)** replaced the v2/v3
> five-region chrome (topbar / left-controls / stage / footer) with the
> **reading-and-deciding instrument**: one centered 72ch reading column under
> a quiet chrome strip, the collaboration workbench, and the pinned decision
> ledger. Forest-only since the "sunset" rebrand (2026-06-07): Signal Lime
> `#B7FF6E` is **retired** — zero occurrences anywhere. **Source of truth for
> live values stays** `forsvn-preview/assets/_html/tokens.css` and
> `_biz-ops/forsvn-ops/brand/DESIGN.md`; on any disagreement, tokens.css wins.

**The visual contract for every `review_surface: html` artifact. Skills emit
plain Markdown; the plugin renderer (`lib/render.ts` + `assets/_html/base.html`)
produces the twin. Nothing per-skill touches the chrome.**

Each artifact is a manuscript on a desk: an editorial sheet to read, a ledger
line to sign. Everything that isn't the read or the decision is gone — no
marginalia gutter, no metadata rows, no redundant keyboard legends, **no
artifact paths anywhere in the UI** (identity is title + skill + stack + date).

---

## 1. Layout — strip / stage / ledger

```
┌────────────────────────────────────────────────────────────────────┐
│ STRIP (chrome) — logo glyph + FORSVN · review · N pending ·        │
│   stack·register chip · auto/dark/light segment · decision pill    │
├────────────────────────────────────────────────────────────────────┤
│ STAGE (themed by the elemental register)                           │
│   one centered 72ch reading column (.sheet):                       │
│   · WORKBENCH (sticky) — Read · Marker M · Comment C · Edit E ·    │
│     "read as ▾"   (live serves only; never captures a verdict)     │
│   · gate-warning notice (amber, G1 — only when gate_warning set)   │
│   · MASTHEAD — eyebrow (stack · skill · date) + title + deck       │
│   · agent suggestion cards (from preview-config.suggestions)       │
│   · PROSE — the typeset artifact body, never markdown syntax       │
│   · GATE ECHO — the sealed `## Review Gate` checklist, read-only   │
│   · THREAD RAIL (right, ≥1100px) — comment threads on highlights   │
├────────────────────────────────────────────────────────────────────┤
│ LEDGER (pinned, the ONE decision place)                            │
│   Approve ⌥A · Deny ⌥D · Suggest ⌥S · comment · Done ⌘↵            │
│   → confirmation: verdict hairline + note echo + next pending      │
└────────────────────────────────────────────────────────────────────┘
```

- The **pill is the only state location**; the ledger is the only interactive
  capture place; the in-body gate echo is a sealed, read-only mirror.
- The masthead is rendered **from frontmatter** — raw YAML never reaches the
  page. The body's leading H1 folds into the masthead (no duplicate headline).
- Keycaps live **on the controls** — the keyboard model is rendered, not
  listed.

## 2. Adaptive theme — two themes, one signal

Default follows `prefers-color-scheme` (no attribute on `<html>`); the strip's
quiet **auto / dark / light** segment makes the choice explicit, persisted in
`localStorage` (`forsvn-theme`). An inline boot script in `<head>` applies the
stored choice **before** the stylesheets — no flash of the wrong theme.

| | Dark (brand default) | Light |
|---|---|---|
| Canvas | Forest Shadow `#0A120D` | Sunset Cream `#F7F0D4` |
| Text | Warm Cream `#EFE9D1` | Warm Ink `#15190F` |
| The signal | **Leaf `#74B36B`** — selection, focus, Done fill; <10%, never a surface | **Deep Forest `#004700`** — Leaf never carries text on cream (fails AA) |
| Logo | cream glyph (`logo-glyph-cream.svg`) | forest glyph (`logo-glyph-forest.svg`) |

Honey `#F2CE6B` stays decorative: the logo field and the **marker wash** only.
Verdicts carry hue + glyph + word in both themes — color never alone. Matte
only: flat fills, 1px borders, no blur, no gradients.

The logo treatment follows BRAND.md § Logo Color Combinations: the chrome
pairs the glyph with the mono wordmark and **swaps the glyph with the active
theme** (both `<img>`s ship; CSS shows one).

## 3. Elemental registers — the reading field only

The chrome stays constant within a theme; only the stage shifts per stack.
EARTH is the one light room in the dark theme — its light tokens ARE the
light-theme system (one light system, two doors).

**Dark theme** (`--stage-bg/-fg/-accent/-accent-2/-border`):

| Stack | register | bg | fg | accent | accent-2 | border |
|---|---|---|---|---|---|---|
| meta | AIR | `#0A120D` | `#EFE9D1` | `#74B36B` | `#004700` | `#1E2A22` |
| marketing | WATER | `#0C1A13` | `#EFE9D1` | `#74B36B` | `#004700` | `#1E2E22` |
| product | FIRE | `#1A1410` | `#FDF4EE` | `#74B36B` | `#004700` | `#2D2520` |
| research | EARTH | `#F7F0D4` | `#15190F` | `#004700` | `#74B36B` | `#E3D7A8` |

**Light theme**: all four registers move to cream-family tints of the same hue
logic (AIR `#F6F0DA`, WATER `#EFF2DE`, FIRE `#FAEFDE`, EARTH `#F7F0D4`), ink
text, Deep Forest accent everywhere. EARTH-in-dark amber remediation: notice
text drops to ink, amber glyph only.

`--stage-accent-2` is always the opposite token in the leaf/forest pair —
non-text usage only (borders, hover tints, dots). Light-stage muted text uses
the deeper 68% ink mix to hold AA on cream.

## 4. Typography & motion

Editorial three-voice system, identical across stacks (self-hosted woff2 via
`fonts.css` — **zero external requests**; the Google Fonts CDN is forbidden):

| Voice | Family | Where |
|---|---|---|
| Masthead | Bricolage Grotesque 700/-0.03em (Light 300 for decks) | h1 + deck |
| Body | Be Vietnam Pro 16/1.7 in a 72ch measure | prose, controls |
| Ledger-like | JetBrains Mono, +0.06–0.22em tracking | dates, counts, keycaps, eyebrows |

Sanctioned motion only: hover elevate (200ms), selection snap (80ms),
confirmation cross-fade — all collapse under `prefers-reduced-motion`. No JS
animation libraries, ever.

## 5. The workbench — the collaboration bar

Sticky under the chrome, scoped to the reading column — far from the ledger so
deciding stays the terminal act. **The bar never captures a verdict.** Hidden
on static/archived pages; chrome.js activates it on a live pending serve.

- **Marker (M)** — lays the honey wash (`mark.hl`) on a selection. Recorded as
  `{ kind: "marker", quote }`.
- **Comment (C)** — highlight + notechip + a thread card in the rail; the
  queued comment is `{ kind: "comment", quote, body }`.
- **Annotations persistence**: they ride the decision POST additively
  (`annotations: [...]` on `/done`) and the CLI persists them under the same
  `## Reviewer notes` block as the comment — a `### Annotations` list — so
  agents read them back from the artifact record. They also surface in the
  CLI's `--json` decision object (additive `annotations` field).
- **Edit (E)** — the reading column becomes the editor (dashed frame), editing
  the **Markdown source body** (never an HTML round-trip). Save (⌘S) POSTs
  `{ token, body_md }` to the CSRF-protected **`POST /edit`**: same
  constant-time token check, on-disk re-hash **409** conflict guard (nothing
  written), atomic byte-fidelity write (frontmatter preserved verbatim), twin
  re-rendered, conflict basis advanced so the subsequent decision applies to
  the saved bytes. Discard (esc) restores. Human-only by construction —
  localhost + token, exactly like decisions.
- **Agent suggestion cards** — rendered old → new text (`del`/`ins`), header
  `agent suggestion · <author> · <when>`, footer Accept / Dismiss + the
  ownership line *"no agent can apply this — only you."* Data seam:
  **`preview-config.suggestions`** (additive, `[]` today) — the Proof-collab
  bridge is the intended populator; accepting applies the replacement through
  the same `/edit` write path. No accept/approve tool exists on any agent
  channel.
- **read as ▾** — the folded preview-mode chooser (informational): designed
  html (this page) / terminal `--md` / Proof collab (`forsvn-collab open`).

## 6. The ledger — decision capture

POST `/done` records exactly `approved | denied | suggested` (`not_required`
and `pending` are schema states — 400). Constant-time token; one-shot slot
(duplicate POST → 409); re-hash conflict guard (409, nothing written, copy
names the cause and the recovery). The `/done` 200 body additively carries
`next_pending` (`{title, skill, stack, date}` — **never a path** — or `null`
for queue-clear) so the confirmation names what's next without auto-opening it.

The confirmation colors the close-out hairline with the verdict, echoes the
reviewer note as prose, and states "server exiting · nothing more will change
on disk". Alerts (409/stale) render in-ledger, `role="alert"`, never
auto-dismissed, never write.

Accessibility floor: ≥44px hit areas, 2px focus ring offset 2px (never
removed), one tab stop into the radio group (native radios, visually hidden),
`aria-disabled` Done with the "pick a decision first" describedby, AA contrast
in **both** themes.

## 7. Preview-config — the data seams

The CLI injects `<script type="application/json" id="preview-config">`:

| Field | Type | Seam |
|---|---|---|
| `token`, `endpoint`, `mdPath` | string | decision capture (v2, unchanged) |
| `gate_warning` | string \| null | G1 amber notice strip |
| `pending_count` | number (absent when no queue) | strip crumb "review · N pending" |
| `suggestions` | array (`[]` today) | agent suggestion cards — Proof-collab integration point |

All additions are additive; `{"static":true}` keeps everything inert.

## 8. Terminal surfaces (U10 — reference sync)

The terminal twin of this spec lives in `lib/mono.ts` + `lib/md-term.ts`
(tier-gated ANSI, zero escapes when piped):

- **`notify`** (G4) — the agent's post-push signal: one inbox journal line
  (`.forsvn/inbox`, tier-3 ASCII grammar) + a stdout ResultLine; idempotent on
  same-state re-push.
- **`--md`** — read-only terminal render of the artifact (no decision capture,
  no git gate); the chooser's "terminal" surface.
- **`next_pending`** (G5) — rides the `--json` decision object additively and
  prints as the named, read-only hint in human mode; the webapp consumes the
  same fact from the `/done` 200 body.
- **doctor** — six checks, fixes beneath failures, tiers as capabilities
  (shipped pre-U9; the doctor.html mock is terminal-surface reference only).

## 9. Anti-patterns

1. **Re-introducing chrome regions** (left controls, footers, marginalia) —
   if removing it doesn't hurt the read or the decision, it stays gone.
2. **Any artifact path in the visible UI.** Paths live only inside the JSON
   config blocks.
3. **Raw markdown or frontmatter YAML reaching the page.** Headings are
   headings; the gate is a designed checklist; frontmatter is the masthead.
4. **A second interactive decision place.** The gate echo is sealed; the
   workbench never captures a verdict.
5. **Google Fonts / any external request.** Self-hosted woff2 only.
6. **Leaf text on cream**, lime anywhere, glass/blur, gradients, new hues.
7. **Decision capture outside the documented contract** — one
   `<form id="decision-capture">`; fetch targets only `/done`, `/edit`, or the
   artifact's own source path on localhost.
8. **Giving any agent channel an accept/approve tool.** Suggestions render;
   only the human accepts (the guard is the absence).

## 10. Related refs

- [[review-surface-template]] — the structural contract base.html implements
- [[html-output-critic]] — the 10-check rubric (`bin/lint-html-output.ts`)
- [[reviewable-artifact-contract]] — when to emit `review_surface: html`
- `commands/review.md` — how `/forsvn:review` drives the CLI
