---
title: Review-Surface Design System — elemental token spec for the HTML preview surface
lifecycle: canonical
status: stable
produced_by: meta-skills (v3 review-surface overhaul, 2026-05-26)
consumers: every reviewable skill that emits `review_surface: html`; the shared HTML template
load_class: PLAYBOOK
---

# Review-Surface Design System

**The visual contract for every `review_surface: html` artifact. Five-region
layout shared across stacks; tokens and motion vary by element (AIR/WATER/FIRE/
EARTH). Skills emit HTML against this spec — they never invent their own.**

The HTML preview is **read-only rendering**. Decisions are captured in MD via
the `## Review Gate` block (see [[reviewable-artifact-contract]]). The HTML's
job is one thing only: let a human compare options at a glance, in a register
that matches the stack the artifact came from.

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
  /* Chrome surfaces — neutral surgical-dark across all stacks */
  --chrome-bg:           #0a0a0a;
  --chrome-panel:        #111114;
  --chrome-border:       #1f1f24;
  --chrome-text:         #e4e4e7;
  --chrome-text-muted:   #71717a;
  --chrome-accent:       #ffffff;
  /* Decision-state pill colors */
  --pill-pending-bg:     #2a2a2e;
  --pill-pending-fg:     #fbbf24;
  --pill-approved-bg:    #064e3b;
  --pill-approved-fg:    #6ee7b7;
  --pill-denied-bg:      #7f1d1d;
  --pill-denied-fg:      #fecaca;
  --pill-suggested-bg:   #1e3a8a;
  --pill-suggested-fg:   #93c5fd;
  /* Typography for chrome (never themed) */
  --chrome-mono:         'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
  --chrome-sans:         'Inter', -apple-system, system-ui, sans-serif;
  /* Layout */
  --chrome-topbar-h:     56px;
  --chrome-left-w:       320px;
  --chrome-footer-h:     72px;
  /* Stage */
  --stage-pad:           48px;
}
```

The chrome stays the same dark neutral across all four elements — like the left
panel in `brand-explore.html`. Only the **stage** is themed by stack. This is
deliberate: a user opening an AIR (meta) artifact next to a WATER (mkt)
artifact should feel they're the same UI program, with different content. Same
controls in the same places.

---

## 3. Element themes (stage only)

### 3.1 AIR — meta stack

Refined, transparent, almost invisible. For process-layer skills that
facilitate thinking (discover, debate-agents, prioritize, breakdown-tasks,
review-work, run-eval-loop, clean-artifacts, plan-funnel).

```css
:root[data-stack="air"] {
  --bg:            #f7f8fa;
  --bg-deep:       #e8ebf0;
  --bg-elevated:   #ffffff;
  --fg:            #18181b;
  --fg-muted:      #52525b;
  --accent:        #a7c7ff;
  --accent-fg:     #18181b;
  --border:        #d4d4d8;
  --border-strong: #a1a1aa;
  --shadow-sm:     0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:     0 8px 24px rgba(0,0,0,0.04);
  --font-head:     'Inter Tight', 'Inter', sans-serif;
  --font-body:     'Inter', sans-serif;
  --font-mono:     'JetBrains Mono', monospace;
  --line-height:   1.7;
  --max-measure:   65ch;
  /* Motion */
  --t-hover:       240ms;
  --t-enter:       480ms;
  --ease:          cubic-bezier(0.2, 0.6, 0.2, 1);
}
```

**Motifs**
- Hairlines at 0.5px on dividers and table cells; never heavier than 1px on stage borders
- Tracked-out monospace meta labels: `META · DISCOVER · 2026-05-26` at 0.78rem with +6% letter-spacing
- Whitespace > content density — 1.7 line-height, 65ch max measure
- No fills above 10% alpha — air is transparent

**Motion**
- 240ms opacity-led drift on hover
- 480ms fade-in on first render, no translate
- Easing `cubic-bezier(0.2, 0.6, 0.2, 1)` — gentle, no overshoot

**Typography hierarchy**

| Role | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| Display | Inter Tight | 48-72px | 600 | -2% |
| H1 | Inter Tight | 32px | 600 | -1% |
| H2 | Inter Tight | 24px | 500 | -0.5% |
| Body | Inter | 16px | 400 | 0 |
| Meta label | JetBrains Mono | 12.5px | 500 | +6% UPPERCASE |

**WCAG AA check (4.5:1 on body text)**
- `#18181b` on `#f7f8fa` → 14.2:1 ✅
- `#52525b` on `#f7f8fa` → 7.3:1 ✅
- `#a7c7ff` accent on `#18181b` panel → 7.1:1 ✅

### 3.2 WATER — marketing stack

Fluid, deep, reflective. For voice and emotion-carrying skills (create-brand,
write-copy, write-ad, write-outreach, write-social, brief-shortform,
brief-landing-page, brief-app-preview, brief-graphic, plan-campaign,
produce-asset, produce-video, publish-social, optimize-seo, monitor-aeo,
humanmaxxing, polish-vn).

```css
:root[data-stack="water"] {
  --bg:            #0a1a2a;
  --bg-deep:       #050d18;
  --bg-elevated:   rgba(255,255,255,0.04);
  --fg:            #f0f6ff;
  --fg-muted:      #7891a8;
  --accent:        #6ee7d4;
  --accent-fg:     #0a1a2a;
  --accent-gradient: linear-gradient(135deg, #6ee7d4 0%, #5d9eff 100%);
  --border:        #1a2e44;
  --border-strong: #2d4863;
  --glass-tint:    rgba(255,255,255,0.06);
  --backdrop-blur: blur(24px);
  --shadow-sm:     inset 0 1px 0 rgba(255,255,255,0.04);
  --shadow-md:     0 4px 32px rgba(110, 231, 212, 0.10);
  --shadow-glow:   0 0 24px rgba(110, 231, 212, 0.20);
  --font-head:     'Fraunces', 'Times New Roman', serif;
  --font-body:     'Plus Jakarta Sans', 'Inter', sans-serif;
  --font-mono:     'JetBrains Mono', monospace;
  --line-height:   1.6;
  --max-measure:   72ch;
  /* Motion */
  --t-hover:       360ms;
  --t-ripple:      600ms;
  --ease:          cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Motifs**
- Glassmorphism surfaces: 6% white tint + 24px backdrop-blur on stacked panels
- Inner glow on focused elements (`box-shadow: inset 0 0 0 1px var(--accent)`)
- Gradient accents only — never solid accents (Water owns gradient; Fire owns solid)
- Depth-of-field on layered panels — z=1 panels at 100% opacity, z=2 at 95%, z=3 at 90%
- Fraunces at display sizes uses optical-size variable (set to 144)

**Motion**
- 360ms undulation on hover (translateY 2px → 0 with opacity 0.85 → 1)
- 600ms ripple on click (radial expand from click origin, alpha 0.3 → 0)
- Gradient-shift on selection (background-position 0% → 100% in 800ms)

**Typography hierarchy**

| Role | Font | Size | Weight | Optical size |
|---|---|---|---|---|
| Display | Fraunces | 64-96px | 500 | 144 |
| H1 | Fraunces | 36px | 500 | 96 |
| H2 | Fraunces | 24px | 500 | 72 |
| Body | Plus Jakarta Sans | 16px | 400 | — |
| UI label | Plus Jakarta Sans | 13px | 500 | — |

**WCAG AA check**
- `#f0f6ff` on `#0a1a2a` → 13.4:1 ✅
- `#7891a8` on `#0a1a2a` → 5.1:1 ✅
- `#6ee7d4` on `#0a1a2a` → 8.9:1 ✅

### 3.3 FIRE — product stack

Bright, energetic, direct. For ship-it skills (map-user-flow, architect-system,
clean-code, extract-service, clean-machine, write-docs, build-ios-apps).

```css
:root[data-stack="fire"] {
  --bg:            #0f0a08;
  --bg-deep:       #050302;
  --bg-elevated:   #1a120e;
  --fg:            #fdf4ee;
  --fg-muted:      #a08470;
  --accent:        #ff7a45;
  --accent-fg:     #0f0a08;
  --accent-2:      #ffcc00;       /* spark yellow — secondary */
  --border:        #2d1a0f;
  --border-strong: #ff7a45;       /* glows on focus */
  --shadow-sm:     0 2px 8px rgba(0,0,0,0.4);
  --shadow-md:     0 0 32px rgba(255, 122, 69, 0.15);
  --shadow-glow:   0 0 16px rgba(255, 122, 69, 0.55);
  --font-head:     'Sora', 'Inter', sans-serif;
  --font-body:     'Manrope', 'Inter', sans-serif;
  --font-mono:     'JetBrains Mono', monospace;
  --line-height:   1.5;
  --max-measure:   80ch;
  /* Motion */
  --t-hover:       120ms;
  --t-snap:        80ms;
  --ease:          cubic-bezier(0.4, 0, 0.6, 1);
}
```

**Motifs**
- 2px sharp accent borders that **glow on focus** (`box-shadow: 0 0 16px var(--accent)`)
- Spark-yellow `--accent-2` for critical actions / key callouts
- No gradients — Fire is solid, decisive
- Monospace measurements visible in product flows (snap-to-grid at 8px)
- Inline code in JetBrains Mono with `--accent` underline

**Motion**
- 120ms snap on hover (translateY 1px ↑)
- 80ms flicker on selection (opacity 1 → 0.7 → 1 fast)
- Instant feedback on click — no easing tail
- Easing `cubic-bezier(0.4, 0, 0.6, 1)` — sharp, no spring

**Typography hierarchy**

| Role | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| Display | Sora | 56-80px | 700 | -1.5% |
| H1 | Sora | 32px | 700 | -1% |
| H2 | Sora | 22px | 600 | -0.5% |
| Body | Manrope | 16px | 400 | 0 |
| Code | JetBrains Mono | 14.5px | 400 | 0 |

**WCAG AA check**
- `#fdf4ee` on `#0f0a08` → 17.1:1 ✅
- `#a08470` on `#0f0a08` → 5.2:1 ✅
- `#ff7a45` on `#0f0a08` → 6.7:1 ✅
- `#ffcc00` on `#0f0a08` → 11.8:1 ✅

### 3.4 EARTH — research stack

Grounded, organic, dense. For knowing-skills (research-icp, research-market,
research-shortform, research-platform, diagnose, evaluate-content,
evaluate-campaign, evaluate-shortform, evaluate-ad, evaluate-landing-page).

```css
:root[data-stack="earth"] {
  --bg:            #f4ede0;
  --bg-deep:       #e8ddc7;
  --bg-elevated:   #ffffff;
  --fg:            #1a1410;
  --fg-muted:      #6b5d4f;
  --accent:        #2d5016;
  --accent-fg:     #f4ede0;
  --accent-2:      #b87333;       /* clay — for pull-quotes / secondary */
  --border:        #c4b594;
  --border-strong: #9c8a6c;
  --shadow-sm:     0 1px 0 rgba(0,0,0,0.06);
  --shadow-md:     0 12px 32px rgba(120, 90, 50, 0.08);
  --font-head:     'Newsreader', 'EB Garamond', 'Times New Roman', serif;
  --font-body:     'Newsreader', 'Times New Roman', serif;
  --font-mono:     'JetBrains Mono', monospace;
  --line-height:   1.55;
  --max-measure:   68ch;
  /* Motion */
  --t-enter:       800ms;
  --t-hover:       0ms;            /* no twitch */
  --ease:          cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Motifs**
- Book-page columns — two-column body when content density warrants
- Deckle-edge dividers (`border-image` with paper texture or subtle SVG)
- Footnote-style citations with superscript numerals
- Bordered data tables with subtle grain (`background-image: linear-gradient(...)` at 3%)
- Clay-accent pull-quotes — `--accent-2` left border, italic
- Paper-grain background texture at ~3% opacity

**Motion**
- 800ms settle on first render (translateY 8px → 0 with fade)
- 0ms on hover — earth doesn't twitch; user can focus while reading
- Easing `cubic-bezier(0.16, 1, 0.3, 1)` — mass-aware, settling

**Typography hierarchy**

| Role | Font | Size | Weight | Optical size |
|---|---|---|---|---|
| Display | Newsreader | 56-80px | 500 | 144 |
| H1 | Newsreader | 32px | 600 | 96 |
| H2 | Newsreader | 22px | 600 | 72 |
| Body | Newsreader | 17px | 400 | 16 |
| Citation | Newsreader Italic | 13px | 400 | 14 |

**WCAG AA check**
- `#1a1410` on `#f4ede0` → 14.6:1 ✅
- `#6b5d4f` on `#f4ede0` → 5.5:1 ✅
- `#2d5016` on `#f4ede0` → 8.4:1 ✅
- `#b87333` on `#f4ede0` → 4.6:1 ✅

---

## 4. Font loading

All four elements load fonts via `<link rel="preconnect">` to Google Fonts and a
single `<link rel="stylesheet">` with `display=swap` to avoid FOIT. The shared
chrome (`chrome.css`) ships its own font (Inter + JetBrains Mono); each stage
theme adds its own.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- chrome (always loaded) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<!-- per-stack stage fonts (one of the four blocks below) -->
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&display=swap" rel="stylesheet">                                   <!-- AIR -->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Plus+Jakarta+Sans:wght@400;500&display=swap" rel="stylesheet">     <!-- WATER -->
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Manrope:wght@400;500&display=swap" rel="stylesheet">             <!-- FIRE -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,ital,wght@6..72,0,400..600;6..72,1,400&display=swap" rel="stylesheet">    <!-- EARTH -->
```

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

1. **Mixing element themes within one HTML page.** A product artifact uses
   FIRE only. Never load tokens.css with multiple `data-stack` blocks active.
2. **Gradients in FIRE.** Fire is solid borders + glows. Gradients are WATER's
   register.
3. **Shadow-less surfaces in EARTH.** Earth has paper-weight; surfaces need at
   least `--shadow-sm`. Floating-in-void is AIR.
4. **Decision capture inside the HTML.** No `<form>`, no `<button onClick>`
   that mutates state, no fetch/postback. The only mutating action is the
   Roughdraft deeplink (`roughdraft://open?path=…`) which opens an external
   app.
5. **Server-side rendering / handlers.** HTML is a static file. Skill emitters
   produce it once; opening it in a browser is the entire runtime.
6. **JS animation libraries** (GSAP, motion-one, animejs, lottie). v1 uses CSS
   transitions only. Keep payload light.
7. **Loading > 2 stage fonts per page.** Each element ships its own font pair;
   loading multiple fonts is a sign the page is mixing themes.
8. **Overriding chrome tokens per stack.** Chrome is constant. Override stage
   tokens only.

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
