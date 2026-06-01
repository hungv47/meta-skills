<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# DESIGN.md Quality Guide

> Annotated reference showing what separates a strong DESIGN.md from a generic one. The core principle: **an AI coding agent should be able to read DESIGN.md and produce on-brand UI without any other context.** Each section shows a good excerpt, a bad counter-example, and the quality differentiator.
>
> **IMPORTANT: Match the STRUCTURAL QUALITY, not the specific content.** The primary good excerpts below are from an existing product (glass surfaces, amethyst palette, spring-physics notes). Your output will almost certainly have completely different visual language, materials, and interactions. What should be identical is the PRECISION: complete per-theme token tables, CSS-level material formulas, named animations with exact physics values, testable do's/don'ts. The excerpts illustrate the depth bar, not the design direction.
>
> **Do NOT copy the visual language.** If your archetype is Caregiver, Sage, or Hero, glass surfaces are likely the *wrong* material. Glassmorphism is the **single most over-applied AI-design pattern**. The Surface & Material section below shows two equally-precise good excerpts — one glass, one solid/paper — to make this concrete. Pick the material that fits the archetype, not the one that matches the example.

---

## AI-Readable Header

**Quality differentiator:** 4-5 lines summarizing the key design decisions. An agent scanning this header in 3 seconds should know the archetype, visual metaphor, fonts, and primary color.

**Good:**
> **Archetype:** Creator (70%) + Magician (30%)
> **Visual metaphor:** Glass studio, translucency, layered depth
> **Typography:** Clash Display (display) + General Sans (body) + JetBrains Mono (code)
> **Primary color:** Deep Amethyst, hue 270

**Bad:**
> This is the design system for our app.

**Why the good version works:**
- Machine-parseable key-value pairs
- An AI agent immediately knows the "vibe" without reading 500 lines
- The visual metaphor ("glass studio") anchors every material/surface decision

---

## Visual Theme & Atmosphere

**Quality differentiator:** 2-3 paragraphs of PROSE describing what the product feels like. Not adjectives. Not tokens. A "vibe check" that orients every design decision.

**Good:**
> Conquistador feels like a premium glass design studio that happens to live on an infinite digital canvas. The atmosphere is refined, spatial, and luminous, anchored by a deep amethyst palette, geometric typography, and translucent glass surfaces.
>
> The canvas is the product. It should feel like working on a glass desk surface: notes look like frosted glass cards with depth, color-tinted shadows, and colored pushpins.
>
> Density is moderate-to-sparse. The canvas should breathe.
>
> The mood is: **refined, spatial, luminous, magical.**

**Bad:**
> The app should look modern and clean with a professional feel.

**Why the good version works:**
- Physical metaphor ("glass desk surface") — two designers reading this produce visually similar work
- Density guidance (moderate-to-sparse) — prevents over-stuffed layouts
- "The canvas should breathe" — a design principle disguised as atmosphere
- Final mood line gives 4 specific adjectives, not 1 generic one

---

## Theme Palettes — Complete Token Tables

**Quality differentiator:** Every theme is a SELF-CONTAINED token table. An AI agent picks one theme and generates a full UI. No "same as Light but darker."

**Good:**
> #### Dark Theme
>
> Not inverted Light. A parallel palette designed from the deep end of the violet spectrum.
>
> | Token | OKLCH | Hex | Role |
> |-------|-------|-----|------|
> | `--background` | `oklch(0.12 0.006 270)` | #14121F | Deep page background |
> | `--foreground` | `oklch(0.98 0.005 270)` | #F8F7FA | Light text |
> | `--primary` | `oklch(0.72 0.14 270)` | #A98BE8 | Lifted amethyst for dark |
> | `--primary-foreground` | `oklch(0.12 0.006 270)` | #14121F | Dark text on bright primary |
> [... all ~17 tokens with values...]

**Bad:**
> #### Dark Theme
> Invert the light theme colors. Use darker backgrounds and lighter text.

**Why the good version works:**
- "Not inverted Light" — explicitly states the design principle
- Every token has OKLCH (perceptually uniform) + hex (human-readable) + role (what it's for)
- Primary shifts lightness for dark mode (`0.38 → 0.72`) — not the same value
- The table is complete — no token references another table

---

## Surface & Material Language

**Quality differentiator:** CSS-level formulas for the product's signature material treatment. Not "use glass effects" — exact backdrop-filter, opacity, border values PER THEME.

**Good:**
> | Theme | Background | Blur | Border |
> |-------|-----------|------|--------|
> | Light | `oklch(0.98 0.005 270 / 0.80)` | `backdrop-filter: blur(16px)` | `1px solid oklch(0.88 0.01 270 / 0.50)` |
> | Dark | `oklch(0.18 0.008 270 / 0.75)` | `backdrop-filter: blur(16px)` | `1px solid oklch(0.35 0.012 270 / 0.40)` |
>
> Add `saturate(1.2)` to prevent blur from washing out colors. Overlay fine noise grain at 3-5% opacity for tactile realism.

**Bad:**
> Use a frosted glass effect on cards and modals.

**Good — solid / paper variant (anti-glass, equal precision):**
> The product's signature surface is **warm pressed paper**, not glass. Cards are fully opaque with a subtle off-white tint and a soft inner shadow that hints at fiber.
>
> | Theme | Background | Tint | Border | Inner shadow |
> |-------|-----------|------|--------|--------------|
> | Light | `oklch(0.985 0.004 60)` (warm cream) | none | `1px solid oklch(0.92 0.005 60)` | `inset 0 0 0 1px oklch(1 0 0 / 0.6), inset 0 -1px 0 oklch(0.88 0.01 60 / 0.4)` |
> | Dark | `oklch(0.21 0.005 60)` (warm charcoal) | none | `1px solid oklch(0.28 0.006 60)` | `inset 0 1px 0 oklch(1 0 0 / 0.04)` |
>
> **No backdrop-filter. No translucency.** Depth comes from elevation shadows (see §6) and the paper border treatment, not from blur.

**Why both good versions work:**
- Per-theme CSS values — an engineer copies these directly
- Opacity / tint values differ by theme (deliberate, not arbitrary)
- Implementation notes spell out *what's intentionally absent* (the paper variant explicitly bans backdrop-filter — that's the brand decision)
- The material IS the brand — and there is no default material. Glass and paper are equally precise; the wrong one for the archetype is wrong however well it's specified.

---

## Product-Specific Core Components

**Quality differentiator:** The product's PRIMARY visual element gets a full spec with all states and interaction physics. NOT just standard buttons/cards.

**Good:**
> ### Sticky Notes (Core Element)
>
> The primary visual element. Notes are frosted glass cards.
>
> | Property | Value |
> |----------|-------|
> | Border radius | 20px (hardcoded, all sizes, all themes) |
> | Background | Glass formula: `bg-card` at 90% opacity |
> | Shadow (resting) | `shadow-sm` with color tint |
> | Shadow (hovered) | `shadow-md` |
> | Shadow (dragging) | `shadow-lg` |
> | Hover | `translateY(-2px), scale(1.01)` with spring easing |
> | Dragging state | `opacity: 0.35` (ghosted) |
> | Drop | Spring settle: stiffness 300, damping 20 |
>
> **Pin pull/drop animation:** Spring physics (stiffness 200, damping 15, mass 0.8). Rotate 0-15deg, translateY -8px on pull.

**Bad:**
> Cards should have rounded corners and shadows.

**Why the good version works:**
- This component IS the product — it deserves more spec than generic cards
- All states covered: resting, hovered, dragging, dropped
- Spring physics values (stiffness, damping, mass) — not "use a spring animation"
- The border radius is 20px, overriding the global radius — an intentional product decision, not a mistake

---

## Shadow & Elevation System

**Quality differentiator:** Multi-level shadow system (4-8 levels) with OKLCH alpha values. Shadow progression for key interactions described.

**Good:**
> | Level | Value | Use |
> |-------|-------|-----|
> | `sm` | `0 2px 6px -4px oklch(0 0 0 / 0.22), 0 8px 18px -14px oklch(0 0 0 / 0.35)` | Notes at rest |
> | `md` | `0 10px 28px -18px oklch(0 0 0 / 0.38), 0 2px 6px -2px oklch(0 0 0 / 0.22)` | Hovered notes |
> | `lg` | `0 18px 45px -24px oklch(0 0 0 / 0.45), 0 6px 16px -6px oklch(0 0 0 / 0.25)` | Dragged, modals |
>
> **Shadow progression on notes:** Resting sm → Hovered md + translateY(-2px) → Dragging lg + opacity 0.35 → Dropped spring back to sm.

**Bad:**
> Use subtle shadows on elevated elements.

**Why the good version works:**
- Multiple shadow layers per level (ambient + directional) — creates realistic depth
- OKLCH alpha values, not rgba — consistent with the color system
- Negative spread values create tight, natural-looking shadows
- Shadow progression describes the full interaction arc, not just static states

---

## Named Animations

**Quality differentiator:** 5-10 named animations with exact values (duration, easing, transform properties). NOT "fade in" or "slide up."

**Good:**
> | Animation | Duration | Easing | Description |
> |-----------|----------|--------|-------------|
> | `note-pop-in` | 150ms | internal | Scale 0.9→1, opacity 0→1 |
> | `pushpin-pull` | spring | stiffness 200, damping 15 | Rotate 0→15deg, translateY -8px |
> | `pushpin-drop` | spring | stiffness 200, damping 15 | Spring return to 0deg, 0px |
> | `note-hover` | 150ms | internal | translateY(-2px), scale(1.01) |
> | `theme-crossfade` | 250ms | internal | CSS custom property swap |

**Bad:**
> Use smooth transitions for interactive elements. Duration: 200-300ms.

**Why the good version works:**
- Names are product-specific ("pushpin-pull," not "element-enter")
- Spring animations have stiffness/damping values — not "use spring easing"
- Exact transform values (scale 0.9→1, rotate 0→15deg, translateY -8px)
- An engineer can implement each animation from this table alone

---

## Z-Index Scale

**Quality differentiator:** Complete depth stack for the product, not generic z-index advice.

**Good:**
> | Token | Value | Use |
> |-------|-------|-----|
> | `z-behind` | -1 | Canvas grid |
> | `z-base` | 0 | Canvas surface |
> | `z-raised` | 10 | Sticky notes |
> | `z-dropdown` | 100 | Pin picker, menus |
> | `z-sticky` | 200 | Toolbar, controls |
> | `z-overlay` | 300 | Board overlay |
> | `z-modal` | 400 | Modals |
> | `z-toast` | 500 | Toasts |
> | `z-tooltip` | 600 | Tooltips |

**Why this works:**
- Named tokens, not magic numbers
- Covers the product's actual layer hierarchy (canvas grid → notes → toolbar → modals)
- Gaps between values (10, 100, 200...) leave room for future layers
- Product-specific layers (canvas grid, pin picker) alongside standard ones

---

## Do's and Don'ts

**Quality differentiator:** 10-15 items each. Concrete, testable, product-specific. NOT "be creative" / "don't be boring."

**Good Do:**
> - Use the glass surface formula for all elevated surfaces (notes, cards, modals, nav)
> - Use spring physics for note interactions (Magician archetype)
> - Add noise grain (3-5%) to glass surfaces for realism
> - Test every color pairing against WCAG AA in all three themes

**Good Don't:**
> - Use purple gradients as accent (AI cliche). Always use cyan accent.
> - Use Inter, system-ui, or any generic sans-serif for headlines
> - Make the canvas feel like a dashboard or spreadsheet
> - Use uniform bubbly border-radius on everything (vary by component)

**Bad:**
> Do: Make it look good. Use consistent styles.
> Don't: Make it ugly. Be inconsistent.

**Why the good versions work:**
- Each rule names a SPECIFIC element (glass formula, spring physics, noise grain)
- Don'ts name specific anti-patterns and competitors' visual language to avoid
- "AI cliche" callout — awareness of common AI-generated design failures
- Rules are testable: "did we add noise grain at 3-5%?" is yes/no

---

## Overall Quality Test

Run these checks against the completed DESIGN.md:

1. **Copy-paste test:** Can an engineer copy a theme palette table into CSS variables and have a working theme? If not, the tables are incomplete.
2. **Blind build test:** Could an AI agent that has NEVER seen the product build on-brand UI from DESIGN.md alone? If not, the atmosphere or material specs are too vague.
3. **Competitor swap test:** Could this DESIGN.md describe a competitor's product? If yes, the product-specific components and do's/don'ts are too generic.
4. **Implementation gap test:** Are there any visual properties an engineer would need to guess? If yes, add the missing spec.
