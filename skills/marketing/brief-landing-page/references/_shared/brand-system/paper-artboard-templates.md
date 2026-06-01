<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Paper MCP Artboard Templates for Visual Brand Guidelines

HTML/CSS snippet templates and conventions for rendering brand guideline artboards in Paper MCP.

---

## Paper CSS Rules

Paper uses a flex-only layout engine. Follow these constraints strictly:

- **Flex only** — use `display: flex` with `flexDirection`, `alignItems`, `justifyContent`. No `display: grid`.
- **Inline styles only** — all styles are passed as inline style objects. No external CSS, no class names.
- **No margins** — use `gap` on parent containers and `padding` on children for spacing.
- **No HTML tables** — use flex rows and columns to simulate tabular layouts.
- **Units** — use `px` for font sizes, `em` for letter spacing, `px` for line height. No `rem`, `em` for sizes, or `%` for widths (use fixed px or flex).
- **Colors** — use hex values. OKLCH is not supported in Paper inline styles.
- **Fonts** — always call `get_font_family_info` before using any font to confirm availability.

---

## Standard Page Layout Skeleton

Every artboard follows this structure:

```html
<!-- Artboard: 1440x900, vertical flex container -->
<div style="display: flex; flex-direction: column; padding: 60px; gap: 40px; width: 100%; height: 100%; background: #FAFAFA;">

 <!-- Page Header -->
 <!-- Content Groups (one write_html call each) -->

</div>
```

---

## Page Header Pattern

Used at the top of every artboard page. One `write_html` call.

```html
<div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
 <div style="display: flex; align-items: baseline; gap: 16px;">
 <span style="font-family: '[DisplayFont]'; font-size: 14px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: [accentColor];">[Brand Name]</span>
 <span style="font-size: 14px; color: [mutedColor];">Brand Guidelines</span>
 </div>
 <h1 style="font-family: '[DisplayFont]'; font-size: 36px; font-weight: 700; color: [foregroundColor]; letter-spacing: -0.02em;">[Page Title]</h1>
 <div style="width: 100%; height: 1px; background: [borderColor];"></div>
</div>
```

---

## Reusable Component Patterns

### Color Swatch

A square with a color label below. Use inside a flex row to create palette strips.

```html
<div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
 <div style="width: 80px; height: 80px; border-radius: 8px; background: [hexColor]; border: 1px solid rgba(0,0,0,0.08);"></div>
 <div style="display: flex; flex-direction: column; gap: 2px;">
 <span style="font-size: 13px; font-weight: 600; color: [foregroundColor];">[Color Name]</span>
 <span style="font-size: 12px; color: [mutedColor]; font-family: monospace;">[hexValue]</span>
 </div>
</div>
```

### Large Color Swatch (for primary/hero colors)

```html
<div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
 <div style="width: 140px; height: 100px; border-radius: 12px; background: [hexColor]; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: flex-end; padding: 12px;">
 <span style="font-size: 12px; font-weight: 500; color: [foregroundOnSwatch];">[hexValue]</span>
 </div>
 <div style="display: flex; flex-direction: column; gap: 2px;">
 <span style="font-size: 14px; font-weight: 600; color: [foregroundColor];">[Color Name]</span>
 <span style="font-size: 12px; color: [mutedColor];">[usage — e.g. "60% Primary"]</span>
 </div>
</div>
```

### Font Specimen Block

```html
<div style="display: flex; flex-direction: column; gap: 16px; flex: 1;">
 <div style="display: flex; flex-direction: column; gap: 4px;">
 <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: [mutedColor];">[Role — e.g. "Display Font"]</span>
 <span style="font-family: '[FontName]'; font-size: 42px; font-weight: 700; color: [foregroundColor]; letter-spacing: -0.02em;">[Font Name]</span>
 </div>
 <p style="font-family: '[FontName]'; font-size: 18px; font-weight: 400; line-height: 28px; color: [foregroundColor];">
 The quick brown fox jumps over the lazy dog. 0123456789
 </p>
 <!-- Weight strip -->
 <div style="display: flex; gap: 24px; align-items: baseline;">
 <span style="font-family: '[FontName]'; font-size: 16px; font-weight: 400; color: [foregroundColor];">Regular 400</span>
 <span style="font-family: '[FontName]'; font-size: 16px; font-weight: 500; color: [foregroundColor];">Medium 500</span>
 <span style="font-family: '[FontName]'; font-size: 16px; font-weight: 600; color: [foregroundColor];">Semibold 600</span>
 <span style="font-family: '[FontName]'; font-size: 16px; font-weight: 700; color: [foregroundColor];">Bold 700</span>
 </div>
</div>
```

### Spacing Bar Visualization

Shows spacing tokens as proportional bars.

```html
<div style="display: flex; flex-direction: column; gap: 12px;">
 <!-- Repeat for each spacing value -->
 <div style="display: flex; align-items: center; gap: 16px;">
 <span style="font-size: 12px; font-family: monospace; color: [mutedColor]; width: 60px; text-align: right; flex-shrink: 0;">[tokenName]</span>
 <div style="width: [pxValue]px; height: 20px; background: [accentColor]; border-radius: 4px; opacity: 0.7;"></div>
 <span style="font-size: 12px; font-family: monospace; color: [mutedColor]; flex-shrink: 0;">[pxValue]px</span>
 </div>
</div>
```

### Radius Showcase

Rectangles demonstrating each radius value.

```html
<div style="display: flex; gap: 24px; align-items: flex-end;">
 <!-- Repeat for each radius -->
 <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
 <div style="width: 64px; height: 64px; background: [primaryColor]; border-radius: [radiusValue];"></div>
 <span style="font-size: 11px; font-family: monospace; color: [mutedColor];">[radiusLabel]</span>
 </div>
</div>
```

### Logo Placement Frame (Clear Space Diagram)

Dashed border rectangle showing logo clear space requirements.

```html
<div style="display: flex; align-items: center; justify-content: center; padding: 48px; border: 2px dashed [borderColor]; border-radius: 12px; position: relative;">
 <!-- Logo area -->
 <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
 <!-- Wordmark or SVG logo -->
 <span style="font-family: '[DisplayFont]'; font-size: 48px; font-weight: 700; color: [foregroundColor]; letter-spacing: -0.02em;">[Brand Name]</span>
 </div>
 <!-- Clear space labels at edges -->
 <span style="position: absolute; top: 16px; left: 50%; font-size: 10px; color: [mutedColor]; letter-spacing: 0.05em; text-transform: uppercase;">Clear Space: 1.5x</span>
</div>
```

### Mini UI Mockup Frame

Simplified frames for showing logo in context (nav bar, footer, loading).

```html
<!-- Nav Bar Mockup -->
<div style="display: flex; align-items: center; padding: 12px 24px; background: [backgroundColor]; border: 1px solid [borderColor]; border-radius: 8px; gap: 24px; width: 100%;">
 <span style="font-family: '[DisplayFont]'; font-size: 18px; font-weight: 700; color: [foregroundColor];">[Brand]</span>
 <div style="display: flex; gap: 20px; flex: 1;">
 <span style="font-size: 14px; color: [mutedColor];">Features</span>
 <span style="font-size: 14px; color: [mutedColor];">Pricing</span>
 <span style="font-size: 14px; color: [mutedColor];">About</span>
 </div>
 <div style="padding: 6px 16px; background: [primaryColor]; border-radius: [radiusValue]; font-size: 13px; font-weight: 500; color: [primaryForeground];">Get Started</div>
</div>
```

---

## Artboard-Specific Templates

### Artboard 1: Color Palette (1440x900)

Structure:
1. Page header — "Color Palette"
2. Primary colors row — large swatches with 60% usage label
3. Secondary colors row — medium swatches with 30% usage label
4. Accent colors row — medium swatches with 10% usage label
5. Semantic colors row — success, warning, error, info
6. Neutral scale strip — full 50-950 gradient or swatch row

### Artboard 2: Typography System (1440x900)

Structure:
1. Page header — "Typography System"
2. Display font specimen — large specimen with weight strip
3. Body font specimen — large specimen with weight strip
4. Type hierarchy — H1 through caption demonstrated at actual sizes
5. Pairing example — display heading + body paragraph together

### Artboard 3: Spacing & Tokens (1440x900)

Structure:
1. Page header — "Spacing & Design Tokens"
2. Spacing scale — horizontal bars showing 4px through 96px
3. Radius scale — rectangles demonstrating each radius value
4. Button variants row — primary, secondary, outline, ghost at actual styling
5. Input + card examples — form field and card component at actual styling

### Artboard 4: UI Style Principles (1440x900)

Structure:
1. Page header — "UI Style Principles"
2. 3-4 principle cards — each with:
 - Principle name (display font, large)
 - Description (body font, muted)
 - Visual example area (illustrating the principle)

### Artboard 5: Logo System (1440x1200)

Structure:
1. Page header — "Logo System"
2. Primary lockup — large wordmark + logomark together
3. Icon mark — standalone symbol/mark at large scale
4. Light/dark variant panels — side by side, light bg and dark bg versions
5. Clear space diagram — dashed border with measurement labels
6. Minimum size specs — logo at smallest acceptable sizes with labels
7. Usage mockups — nav bar, footer, loading screen with logo in context

---

## Logo Construction in Paper

Paper does not support image imports. Construct logos using:

- **Wordmark**: Brand's Display font at large size, with deliberate letter-spacing and weight
- **Logomark/Symbol**: Inline SVG using geometric primitives:
 - Circles: `<svg><circle cx="..." cy="..." r="..." fill="..."/></svg>`
 - Rectangles: `<svg><rect x="..." y="..." width="..." height="..." rx="..." fill="..."/></svg>`
 - Lines: `<svg><line x1="..." y1="..." x2="..." y2="..." stroke="..." stroke-width="..."/></svg>`
 - Paths: `<svg><path d="..." fill="..."/></svg>`
- Match geometric choices to archetype personality (e.g., sharp angles for Hero/Ruler, circles for Caregiver/Innocent)
- Keep symbols simple — 2-4 geometric elements maximum

---

## Workflow Reminders

- **One visual group per `write_html` call** — never batch an entire artboard
- **`get_screenshot` every 2-3 groups** — review against the checkpoint checklist
- **`get_font_family_info` before first use** — confirm font availability
- **`finish_working_on_nodes` when done** — always finalize
- **Use hex colors only** — OKLCH is not supported in Paper inline styles
- **Adapt templates to brand** — these are starting points, not rigid templates
