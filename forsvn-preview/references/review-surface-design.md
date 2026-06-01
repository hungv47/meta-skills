---
title: Review-Surface Design System — FORSVN-unified token spec for the HTML preview surface
lifecycle: canonical
status: stable
produced_by: meta-skills (v3 review-surface overhaul, 2026-05-26; v2 brand-unification 2026-05-26)
consumers: every reviewable skill that emits `review_surface: html`; the shared HTML template
load_class: PLAYBOOK
---

# Review-Surface Design System

**The visual contract for every `review_surface: html` artifact. Five-region
layout, one FORSVN brand chrome, one typography stack, one motion vocabulary
shared across all stacks. Per-stack variation lives in 5 stage color tokens
(`--stage-bg / -fg / -accent / -accent-2 / -border`). Skills emit HTML against
this spec — they never invent their own.**

The HTML preview surface captures the decision via an in-page form posting to
the `forsvn preview` localhost CLI (WS-V2/V3). Roughdraft remains as an
escape-hatch path for inline CriticMarkup commenting on the MD twin.
See [[reviewable-artifact-contract]] for the full review-surface contract.

---

## 1. Five-region layout (constant chrome + themed stage)

```
┌────────────────────────────────────────────────────────────────────┐
│ TOPBAR (chrome — constant across elements)                         │
│ • Stack chip (AIR / WATER / FIRE / EARTH)                          │
│ • Skill name · date · slug                                         │
│ • decision_state pill                                              │
├──────────────────────┬─────────────────────────────────────────────┤
│ LEFT CONTROLS        │ CENTER STAGE                                │
│ (chrome — constant)  │ (themed by stack — § 3)                     │
│ ~320px wide          │                                             │
│                      │ Per-skill content. The only region that     │
│ • Variant picker     │ varies by skill type:                       │
│ • Comparison toggle  │   create-brand → palette + font preview     │
│ • View mode toggles  │   map-user-flow → flow diagram + edges      │
│ • Export             │   architect-system → schema + topology      │
│                      │   debate-agents → perspective matrix        │
├──────────────────────┴─────────────────────────────────────────────┤
│ DECISION FOOTER (chrome — constant)                                │
│ • Open in Roughdraft (roughdraft://open?path=…)                    │
│ • Read-only decision summary (mirrors MD frontmatter)              │
│ • Copy frontmatter / Copy as JSON                                  │
└────────────────────────────────────────────────────────────────────┘
```

Skill HTML emitters fill **only the center stage**. The topbar / left controls
/ decision footer come from the shared chrome (`references/_html/chrome.css` +
`chrome.js`). This is what gives every artifact's HTML preview the same shape
regardless of skill.

---

## 2. Shared chrome tokens (constant — never override per stack)

```css
:root {
  /* Chrome surfaces — FORSVN-branded dark across all stacks */
  --chrome-bg:           #0a0a0a;
  --chrome-panel:        #111114;
  --chrome-border:       #1f1f24;
  --chrome-text:         #e4e4e7;
  --chrome-text-muted:   #71717a;
  --chrome-accent:       #B7FF6E;             /* signal-lime — FORSVN brand mark */
  /* Brand palette (Pure Void canonical) */
  --brand-lime:          #B7FF6E;
  --brand-forest:        #004700;
  --brand-void:          #000000;
  --brand-paper:         #F5F5F5;
  /* Decision-state pill colors */
  --pill-pending-bg:     #2a2a2e;
  --pill-pending-fg:     #fbbf24;
  --pill-approved-bg:    #004700;
  --pill-approved-fg:    #B7FF6E;
  --pill-denied-bg:      #7f1d1d;
  --pill-denied-fg:      #fecaca;
  --pill-suggested-bg:   #1e3a8a;
  --pill-suggested-fg:   #93c5fd;
  /* Unified typography (D14 — one stack everywhere) */
  --font-head:           'Bricolage Grotesque', 'Inter Tight', system-ui, sans-serif;
  --font-body:           'Be Vietnam Pro', 'Inter', system-ui, sans-serif;
  --font-mono:           'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  --chrome-sans:         var(--font-body);
  --chrome-mono:         var(--font-mono);
  --chrome-display:      var(--font-head);
  /* Unified motion (D14 — one vocabulary; ≤80ms per-stack drift) */
  --ease:                cubic-bezier(0.4, 0, 0.2, 1);
  --t-snap:              80ms;
  --t-hover:             200ms;
  --t-enter:             360ms;
  --t-ripple:            480ms;
  /* Layout */
  --chrome-topbar-h:     56px;
  --chrome-left-w:       320px;
  --chrome-footer-h:     72px;
  --stage-pad:           48px;
  --line-height:         1.55;
  --max-measure:         72ch;
}
```

The chrome is **FORSVN-branded across all four stacks** — same Bricolage Grotesque
wordmark, same signal-lime brand mark, same Pure Void background, same JetBrains
Mono meta text. Only the **stage backdrop and accent** are themed by stack. This
is deliberate: a user opening a meta artifact next to an marketing artifact should feel
they're the same product, in different moods. Same brand, different rooms.

---

## 3. Unified brand + per-stack color register

v2 unifies the four stacks under one FORSVN brand. Typography, motion, layout
tokens are **identical across all stacks**. The only per-stack variation is the
5-token color register on the stage. The four element labels (AIR / WATER /
FIRE / EARTH) survive as **color register names**, not as separate type/motion
systems.

### 3.1 One typography stack (D14)

Bricolage Grotesque + Be Vietnam Pro + JetBrains Mono, everywhere. No per-stack
font drift.

| Role | Font | Where used | Size | Weight |
|---|---|---|---|---|
| Display | Bricolage Grotesque (opsz 96) | Stage h1, marketing/dossier headlines, FORSVN wordmark | 42-56px | 700 |
| H1 / H2 | Bricolage Grotesque | Stage h1/h2 | 24-42px | 600-700 |
| H3 | Bricolage Grotesque | Stage h3, card titles | 17-22px | 600-700 |
| Body | Be Vietnam Pro | Stage paragraphs, UI controls, demo content | 15-17px | 400 |
| UI label | Be Vietnam Pro | Buttons, picker items | 13-13.5px | 500-600 |
| Meta label | JetBrains Mono | Topbar meta, chrome chips, `META · SKILL` tags | 10.5-12.5px | 500 (UPPERCASE, +6-12% tracking) |
| Code | JetBrains Mono | Inline code, demo-code blocks | 12.5-14.5px | 400-500 |

**Why this combo:** Bricolage Grotesque collapses the four v1 display fonts
(Inter Tight, Fraunces, Sora, Newsreader) into one variable family with
opsz/weight ranges that cover every former role. Be Vietnam Pro is the brand
body — built for Vietnamese diacritics, neutral across the four moods.
JetBrains Mono is the canonical mono. Source of truth: [`_biz-ops/brand/forsvn/explorations/picked-combo.md`](../../_biz-ops/brand/forsvn/explorations/picked-combo.md).

### 3.2 One motion vocabulary (D14)

Pure-Void brand motion. Clean entrances, no bounce. One easing curve, four
timing tokens that map roughly to "snap / hover / enter / ripple". Per-stack
**timing differences** are kept ≤80ms variance so motion *feels* consistent
across stacks; per-stack **motion motifs** are gone.

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | All transitions, no exceptions |
| `--t-snap` | 80ms | Decision feedback (click, selection flicker) |
| `--t-hover` | 200ms | Standard hover transitions |
| `--t-enter` | 360ms | First-render stage fade + translateY |
| `--t-ripple` | 480ms | Click-origin radial expand (marketing emphasis only) |

A stage entry animation (`stage-enter`) fires once on first render: opacity 0→1,
translateY 8px → 0, duration `--t-enter`. Drift-fade on perspective cards
(AIR/meta exemplar) uses `--t-enter` + staggered delays. No JS motion libraries
(check #9 still enforced).

### 3.3 Stage tokens — 5 per stack (D17)

Per-stack variation is collapsed to **exactly 5 stage tokens**. Everything else
(typography, motion, layout, derived shadows/borders) is shared in `:root`.

| Stack | `--stage-bg` | `--stage-fg` | `--stage-accent` | `--stage-accent-2` | `--stage-border` |
|---|---|---|---|---|---|
| **meta** (`data-stack="air"`) — color register: AIR | `#000000` Pure Void | `#F5F5F5` paper | `#B7FF6E` signal-lime | `#004700` forest | `#1A1A1A` |
| **marketing** (`data-stack="water"`) — color register: WATER | `#050d18` midnight | `#f0f6ff` ice | `#B7FF6E` signal-lime | `#004700` forest | `#1a2e44` |
| **product** (`data-stack="fire"`) — color register: FIRE | `#1a1410` warm char. | `#fdf4ee` cream-fg | `#B7FF6E` signal-lime | `#004700` forest | `#2d2520` |
| **research** (`data-stack="earth"`) — color register: EARTH (only light-mode stack) | `#f4ede0` cream | `#1a1410` ink | `#004700` forest | `#B7FF6E` signal-lime | `#c4b594` |

**Why the swap on research:** signal-lime on cream is `~1.3:1` — fails WCAG AA
for any text role. Research is the only light-mode stack, so it pulls forest
into the primary stage-accent slot (forest on cream is `~8.5:1`, well above AA)
and keeps signal-lime as decorative `--stage-accent-2` (used for hover states,
borders, dot indicators — non-text usages where AA doesn't apply). All four
stacks still draw from the same FORSVN palette (`lime + forest`); only the
ordering swaps for light-mode legibility.

**Brand chrome is invariant.** The signal-lime FORSVN wordmark and topbar
brand-mark indicator are `var(--chrome-accent)` (always `#B7FF6E`) regardless
of stack — the chrome bg is always Pure Void near-black, so signal-lime always
holds AA in chrome.

### 3.4 Derived helpers (shared)

These come from the 5 stage tokens via `color-mix()`; no per-stack overrides.

```css
:root[data-stack] {
  /* Back-compat aliases (legacy --bg, --fg, --accent, --border still work) */
  --bg:            var(--stage-bg);
  --fg:            var(--stage-fg);
  --accent:        var(--stage-accent);
  --accent-2:      var(--stage-accent-2);
  --accent-fg:     var(--stage-bg);
  --border:        var(--stage-border);

  /* Derived neutrals */
  --fg-muted:      color-mix(in srgb, var(--stage-fg) 58%, var(--stage-bg));
  --border-strong: color-mix(in srgb, var(--stage-border) 50%, var(--stage-fg) 50%);
  --bg-elevated:   color-mix(in srgb, var(--stage-bg) 94%, var(--stage-fg) 6%);

  /* Derived effects */
  --shadow-sm:     0 1px 2px rgba(0,0,0,0.18);
  --shadow-md:     0 8px 24px rgba(0,0,0,0.20);
  --shadow-glow:   0 0 24px color-mix(in srgb, var(--stage-accent) 32%, transparent);
  --backdrop-blur: blur(24px);
  --glass-tint:    color-mix(in srgb, var(--stage-fg) 4%, transparent);
  --accent-gradient: linear-gradient(135deg, var(--stage-accent) 0%, var(--stage-accent-2) 100%);
}
```

### 3.5 WCAG AA contrast (against `--stage-bg`)

Verified per token pairing. Body / fg / accent / accent-2 must all clear 4.5:1
for any text role; decorative non-text usage is allowed below that bar.

| Stack | `fg` on `bg` | `fg-muted` on `bg` | `accent` on `bg` | `accent-2` on `bg` |
|---|---|---|---|---|
| **meta** (Pure Void) | `#F5F5F5/#000` → 19.3:1 ✅ | derived 7.2:1 ✅ | `#B7FF6E/#000` → 14.8:1 ✅ | `#004700/#000` → 1.4:1 (non-text only) |
| **marketing** (midnight) | `#f0f6ff/#050d18` → 16.7:1 ✅ | derived 6.4:1 ✅ | `#B7FF6E/#050d18` → 12.9:1 ✅ | `#004700/#050d18` → 1.3:1 (non-text only) |
| **product** (warm char.) | `#fdf4ee/#1a1410` → 14.3:1 ✅ | derived 5.6:1 ✅ | `#B7FF6E/#1a1410` → 12.1:1 ✅ | `#004700/#1a1410` → 1.4:1 (non-text only) |
| **research** (cream) | `#1a1410/#f4ede0` → 14.6:1 ✅ | derived 5.8:1 ✅ | `#004700/#f4ede0` → 8.5:1 ✅ | `#B7FF6E/#f4ede0` → 1.3:1 (non-text only) |

`--stage-accent-2` is always the *opposite* token in the lime/forest pair —
intentionally low-contrast on the same bg, used only for borders, hover tints,
or decorative dots/lines. Exemplars do not use it for text.

---

## 4. Font loading

One unified font block on every page — all four stacks load the same families
via a single `<link rel="stylesheet">` with `display=swap` to avoid FOIT.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Be+Vietnam+Pro:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

This is intentionally **identical across exemplars** — `grep "font-family"
references/_html/exemplars/*.html` should return only `var(--font-head)`,
`var(--font-body)`, or `var(--font-mono)` references. Any literal font name in
an inline `<style>` block is a sign the stack has drifted from the unified
brand. WS-V4 updates `scripts/lint-html-output.ts` check #8 to enforce this.

---

## 5. Decision-state pill visual spec

Each `decision_state` value renders a distinct pill in the topbar. The pill is
**read-only** — it reflects MD frontmatter, never captures input.

| State | Background | Foreground | Decoration |
|---|---|---|---|
| `pending` | `--pill-pending-bg` `#2a2a2e` | `--pill-pending-fg` `#fbbf24` | 1.5s opacity shimmer (0.6 → 1.0 → 0.6) |
| `approved` | `--pill-approved-bg` `#064e3b` | `--pill-approved-fg` `#6ee7b7` | Solid, no motion |
| `denied` | `--pill-denied-bg` `#7f1d1d` | `--pill-denied-fg` `#fecaca` | Strike-through on label text |
| `suggested` | `--pill-suggested-bg` `#1e3a8a` | `--pill-suggested-fg` `#93c5fd` | Wavy underline on label text |
| `not_required` | — | — | Pill not rendered |

Shared markup:

```html
<span class="decision-pill" data-state="pending">pending</span>
```

```css
.decision-pill {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 9999px;
  font: 500 12px/1 var(--chrome-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.decision-pill[data-state="pending"]   { background: var(--pill-pending-bg);   color: var(--pill-pending-fg);   animation: pill-shimmer 1.5s ease-in-out infinite; }
.decision-pill[data-state="approved"]  { background: var(--pill-approved-bg);  color: var(--pill-approved-fg); }
.decision-pill[data-state="denied"]    { background: var(--pill-denied-bg);    color: var(--pill-denied-fg);    text-decoration: line-through; }
.decision-pill[data-state="suggested"] { background: var(--pill-suggested-bg); color: var(--pill-suggested-fg); text-decoration: underline wavy; }
@keyframes pill-shimmer { 0%, 100% { opacity: 1 } 50% { opacity: 0.6 } }
```

---

## 6. Anti-patterns

1. **Mixing color registers within one HTML page.** A product artifact uses
   `data-stack="fire"` only. Never load tokens.css with multiple
   `data-stack` blocks active.
2. **Hardcoded font names in inline styles.** Stage CSS uses
   `font-family: var(--font-head)` / `var(--font-body)` / `var(--font-mono)`.
   Any literal `'Bricolage Grotesque'` / `'Inter Tight'` / `'Fraunces'` etc.
   in an exemplar's inline `<style>` is a drift signal.
3. **Per-stack motion easing.** All stacks share `--ease` and the four timing
   tokens. Per-stack ≤80ms drift is allowed via the tokens; defining a new
   easing curve per stack is not.
4. **Decision capture in HTML outside the documented contract.** The only
   form allowed is `<form id="decision-capture">` posting to `/done` on
   `127.0.0.1`/`localhost` per [[reviewable-artifact-contract]] § Review surface
   (WS-V3). Any other `<form>`, `onclick=`, `fetch()`, or `XMLHttpRequest` =
   hard fail. Lint check #6 enforces this (WS-V4).
5. **Server-side rendering at preview time.** HTML is a static file emitted
   once by the skill. The `forsvn preview` CLI serves it locally with a CSRF
   token; the page itself contains no server-rendered state.
6. **JS animation libraries** (GSAP, motion-one, animejs, lottie). CSS
   transitions only.
7. **Overriding chrome tokens per stack.** Chrome (topbar, left controls,
   footer, brand-mark, decision-pill) is invariant across stacks. Override
   the 5 stage tokens only.
8. **Extra per-stack tokens beyond the documented 5.** If a stack needs
   more than `--stage-bg / -fg / -accent / -accent-2 / -border`, derive in
   `:root` via `color-mix()` — do not add per-stack overrides.

---

## 7. 10-check HTML output critic rubric (used by WS-8 + WS-10)

Every emitted HTML must pass these checks. The `lint-html-output.ts` script
runs them automatically in the pre-merge gate.

| # | Check | Failure mode |
|---|---|---|
| 1 | Five-region layout present (topbar, left controls, stage, footer; left controls may be collapsed at <800px) | Missing region = anchor missing |
| 2 | `data-stack` attribute on `<html>` matches one of `air/water/fire/earth` | Wrong stack chip color, wrong theme loaded |
| 3 | Decision-state pill present in topbar, matches MD frontmatter | Stale state shown to operator |
| 4 | Roughdraft deeplink in footer (`href` starts with `roughdraft://open?path=`) | Operator can't get back to review |
| 5 | WCAG AA contrast (4.5:1) on every body text against its background | Unreadable on certain monitors |
| 6 | No `<form>`, no `<button onclick>` that mutates state, no postback handlers (only allowed action: external `roughdraft://` open) | Decision capture drift |
| 7 | Tokens.css imported; no inline `:root { --bg: ... }` overrides for chrome tokens | Element drift |
| 8 | Stage typography uses the element's `--font-head` / `--font-body` (no system-font fallback for stage content beyond the documented stack) | Visual incoherence between exemplars |
| 9 | Motion uses CSS transitions only (no `<script>` referencing GSAP/motion-one/animejs) | Bundle bloat / JS dep on a preview |
| 10 | `<title>` matches `<artifact-title> · <skill> · <date>` pattern | Hard to identify in tab list |

---

## 8. Related refs

- [[reviewable-artifact-contract]] — when to emit `review_surface: html`
- [[review-surface-template]] — the structural HTML template skill authors fill in
- [[roughdraft-review-protocol]] — how the HTML twin interacts with the Roughdraft flow
- [[manifest-spec]] — how `review_surface` is indexed
