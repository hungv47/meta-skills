<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Visual Artboard Generation — Paper MCP

Reference for the brand-system skill. Contains artboard specifications and workflow for rendering brand guidelines in Paper MCP.

## Prerequisites

Before starting artboard generation:

1. **Parts I-III complete** — the markdown documentation is the source of truth. Artboards visualize it, not replace it.
2. **Check Paper MCP availability** — verify that Paper MCP tools (`create_artboard`, `write_html`, `get_screenshot`, etc.) are available. If not, skip artboard generation and inform the user.
3. **Call `get_basic_info`** — understand the canvas context, existing artboards, and loaded fonts.
4. **Call `get_font_family_info`** — check availability of the brand's Display and Body fonts. If unavailable, find the closest available Google Font alternative. Document any font substitutions.

## Design Brief Template

```
ARTBOARD DESIGN BRIEF
=====================
Background: [artboard background — typically near-white from neutral scale]
Foreground: [primary text color — from semantic --foreground]
Accent: [header accent color — from brand primary or accent]
Muted: [secondary text — from semantic --muted-foreground]
Border: [divider color — from semantic --border]
Display Font: [confirmed available font] at [weights]
Body Font: [confirmed available font] at [weights]
Page Title: 36px display font, -0.02em tracking
Section Label: 12px uppercase, 0.08em tracking
```

## Artboard Specifications

Generate 5 artboards in sequence:

### Artboard 1: Color Palette (1440x900)

| Group | Content |
|-------|---------|
| Header | Brand name + "Color Palette" + divider |
| Primary Colors | Large swatches (140x100px) with name, hex, usage label "60%" |
| Secondary Colors | Medium swatches (80x80px) with name, hex, usage label "30%" |
| Accent Colors | Medium swatches with name, hex, usage label "10%" |
| Semantic Colors | Success, warning, error, info swatches in a row |
| Neutral Scale | Full 50-950 scale as a strip of small swatches |

### Artboard 2: Typography System (1440x900)

| Group | Content |
|-------|---------|
| Header | Brand name + "Typography System" + divider |
| Display Specimen | Font name at 42px, pangram sample, weight strip (Regular to Bold) |
| Body Specimen | Font name at 42px, pangram sample, weight strip |
| Type Hierarchy | H1 through caption at actual specified sizes, stacked |
| Pairing Example | Display heading + body paragraph demonstrating the combination |

### Artboard 3: Spacing & Design Tokens (1440x900)

| Group | Content |
|-------|---------|
| Header | Brand name + "Spacing & Design Tokens" + divider |
| Spacing Scale | Horizontal bars showing 4px through 96px with labels |
| Radius Scale | Rectangles demonstrating each radius value (none through full) |
| Button Variants | Primary, secondary, outline, ghost buttons at actual styling |
| Input & Card | Form input field and card component rendered with brand tokens |

### Artboard 4: UI Style Principles (1440x900)

| Group | Content |
|-------|---------|
| Header | Brand name + "UI Style Principles" + divider |
| Principle Cards | 3-4 cards, each with: principle name (display font), description (body font, muted), visual example illustrating the principle |

Derive principles from the brand's archetype, personality traits, and design system decisions. Examples: "Deliberate Restraint," "Warm Precision," "Bold Simplicity."

### Artboard 5: Logo System (1440x1200)

| Group | Content |
|-------|---------|
| Header | Brand name + "Logo System" + divider |
| Primary Lockup | Wordmark + logomark together at large scale |
| Icon Mark | Standalone symbol/mark at large scale |
| Light/Dark Variants | Side-by-side panels — logo on light bg and logo on dark bg |
| Clear Space Diagram | Dashed-border rectangle with measurement labels showing minimum clearance |
| Minimum Size | Logo at smallest acceptable sizes with dimension labels |
| Usage Mockups | Nav bar, footer, and loading screen with logo in context |

**Logo construction approach:**
- **Wordmark**: Brand's Display font at large size with deliberate letter-spacing
- **Logomark/symbol**: Inline SVG using geometric primitives (circles, rectangles, triangles, lines) matched to archetype personality — sharp angles for Hero/Ruler, circles for Caregiver/Innocent, dynamic shapes for Explorer/Magician
- **Clear space diagram**: Dashed-border rectangle with measurement labels
- **Usage examples**: Simplified UI mockup frames (nav bar, centered footer, loading screen)

## Per-Artboard Workflow

Follow this sequence for each artboard:

1. **`create_artboard`** — set name (e.g., "Color Palette") and dimensions
2. **`write_html`** — page header (brand name, page title, divider) — one call
3. **`write_html`** — each content group — one call per group (avoid batching)
4. **`get_screenshot`** — every 2-3 groups, review against checkpoint checklist:
 - Spacing: even gaps, clear visual rhythm
 - Typography: readable sizes, strong hierarchy
 - Contrast: text legible against backgrounds
 - Alignment: elements in consistent vertical/horizontal lanes
 - Clipping: no content cut off at edges
5. **`update_styles`** — targeted fixes for any issues found in review
6. Repeat steps 3-5 until the artboard is complete

## Finalization

After all 5 artboards are built:

1. **Screenshot each completed artboard** — final review pass
2. **Call `finish_working_on_nodes`** — finalize all artboards
3. **Report to user** — list the created artboards with their contents

Also reference `references/paper-artboard-templates.md` for HTML/CSS snippet templates and Paper MCP conventions.
