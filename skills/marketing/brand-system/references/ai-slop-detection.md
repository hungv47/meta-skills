# AI Slop Detection Checklist

Visual patterns that signal AI-generated design. Check all brand system outputs
against this list — especially artboard content and visual direction.

## Visual Anti-Patterns

- **Purple/violet gradient defaults** — AI gravitates to blue-to-purple gradients. If the brand archetype doesn't demand it, it's a tell.
- **The 3-column feature grid** — Icon in circle + title + paragraph, repeated 3x. The most common AI layout crutch.
- **Uniform bubbly border-radius** — Same large radius on every element (cards, buttons, inputs, images). Real design systems vary radius by component.
- **Decorative blobs and waves** — Floating circles, gradient blobs, wavy SVG section dividers with no design system justification.
- **Centered everything with emoji bullets** — Center-aligned body text with emoji replacing proper iconography.
- **Colored left-border cards** — Accent-colored left border on every card component.
- **Cookie-cutter section rhythm** — Hero → 3-col features → testimonials → pricing → CTA with identical spacing. Real pages vary density and rhythm.
- **Stock-photo aesthetic** — Generic "diverse team smiling at laptop" imagery direction.
- **Gradient text on everything** — Background-clip text gradients used as default heading style.
- **Shadow soup** — Multiple layered shadows on every card and button.

## Structural Anti-Patterns

These are harder to spot than visual surface patterns but more damaging — they break the design system's internal consistency.

- **Heading scale without a ratio** — AI generates h1-h6 with arbitrary sizes (36/24/18/16) instead of a consistent modular scale (e.g., 1.25 major second). A flat scale means nothing feels important.
- **Arbitrary spacing values** — Components using pixel values (13px, 22px, 37px) instead of drawing from the token scale. Real systems use a consistent base (4px or 8px grid).
- **Missing interaction states** — Buttons and inputs without hover, focus, active, and disabled states. If interactive elements only have a default state, the design system is incomplete.

## How to Use

After generating visual direction or artboards:
1. Count how many items from this list appear
2. 0-1: Clean — proceed
3. 2-3: Review — replace offending elements with archetype-driven alternatives
4. 4+: Regenerate — the output is leaning on AI defaults instead of brand strategy

Every visual choice must trace to the brand archetype and positioning.
Generic ≠ clean. If it could be any brand's design system, it's not yours.
