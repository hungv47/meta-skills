# Visual Identity System

Rules for logo systems, imagery direction, iconography, graphic elements, and brand applications across touchpoints.

## Logo System

A logo is one asset in a system. The system must work across every size, context, and medium.

### Logo Variations

Every brand needs multiple logo formats:

| Variation | Description | When to Use |
|-----------|-------------|-------------|
| **Primary lockup** | Full logo — wordmark + symbol together | Large formats, hero placement, primary identification |
| **Secondary lockup** | Alternate layout (stacked or horizontal) | When primary doesn't fit the space |
| **Logomark / Symbol** | Icon/symbol standalone | Small spaces, favicons, app icons, social avatars |
| **Wordmark** | Text-only version | When symbol is too small to read, co-branding, inline use |

### Clear Space

Clear space is the minimum empty area surrounding the logo. No text, imagery, or graphic elements may enter this zone.

**Define using a relative unit from the logo itself** (never fixed pixels):
- Common unit: height of a specific letter (e.g., "the height of the lowercase 'a' in the wordmark")
- Alternative: a fraction of total logo height (e.g., "0.5x the symbol height")

```
CLEAR SPACE RULE
----------------
Unit: [defined relative unit, e.g., "height of the 'h' in the wordmark"]
Minimum: [multiplier, e.g., "1.5x the unit on all four sides"]

 ┌──────────────────────────────────┐
 │ 1.5x clear │
 │ ┌──────────────────────┐ │
 │ │ │ │
 │ 1.5x LOGO HERE 1.5x │
 │ │ │ │
 │ └──────────────────────┘ │
 │ 1.5x clear │
 └──────────────────────────────────┘
```

### Minimum Size

Specify the smallest the logo can be displayed while remaining legible:

| Variation | Print (minimum width) | Digital (minimum height) |
|-----------|----------------------|-------------------------|
| Primary lockup | [e.g., 1.5 inches] | [e.g., 40px] |
| Secondary lockup | [e.g., 1 inch] | [e.g., 32px] |
| Logomark only | [e.g., 0.5 inches] | [e.g., 16px] |
| Wordmark only | [e.g., 1 inch] | [e.g., 24px] |

Below these sizes, switch to a simpler variation (e.g., from primary lockup to logomark only).

### Color Variations

| Variation | Use When |
|-----------|----------|
| Full color (on light bg) | Default — primary usage |
| Full color (on dark bg) | Dark backgrounds, reversed |
| Single color — black | Print limitations, faxing, embossing |
| Single color — white | Photo overlays, dark backgrounds |
| Monochrome | Single-color print, engraving |

### Logo Don'ts

Always include a "do not" gallery showing prohibited modifications:

- Do not stretch, skew, or distort proportions
- Do not change the logo colors to unapproved colors
- Do not add drop shadows, outlines, bevels, or effects
- Do not rotate the logo
- Do not crop any part of the logo
- Do not place on busy or low-contrast backgrounds
- Do not rearrange or separate logo elements
- Do not recreate the logo in a different font
- Do not put the logo in a container/shape it wasn't designed for
- Do not animate without approval (if motion guidelines exist)

### Co-Branding Rules

When the logo appears alongside partner logos:

- Equal or greater size relative to partner logos
- Maintain full clear space even in lockups
- Use a consistent divider (vertical line, "x", or spacing)
- Never merge or create hybrid logos
- Specify which variation to use in co-branding contexts

## Photography & Imagery Direction

Photography is brand expression. It must feel as intentional as the logo or color palette.

### Photography Style Guide

Define along these dimensions:

**Mood** (3-5 keywords):
Describe the overall feeling. Examples: authentic, warm, aspirational, candid, energetic, serene, gritty, minimal.

**Lighting**:
- Natural vs. studio
- Soft vs. hard shadows
- Warm vs. cool color temperature
- Time of day aesthetic (golden hour, bright midday, blue hour)

**Color Treatment**:
- Saturation level: vivid / natural / muted / desaturated
- Consistent filter or color grade: [describe or specify LUT reference]
- Brand color overlays or duotone treatments: [if applicable]
- Black & white policy: [when allowed, when prohibited]

**Subjects**:
- People: diversity requirements, expressions, context (working, relaxing, celebrating)
- Products: angles, styling, context (in-use vs. isolated)
- Environments: types (urban, nature, workspace, home), mood
- Prohibited subjects: [anything that contradicts brand values]

**Composition**:
- Framing: close-up, medium, wide — when to use each
- Space for text overlay: [where text can be placed on images]
- Depth of field: shallow bokeh vs. sharp throughout
- Point of view: eye-level, overhead, dramatic low angle
- Rule of thirds vs. centered vs. intentionally off-balance

### Image Categories

| Category | Direction | Examples |
|----------|-----------|---------|
| **People / Portraits** | [Specific direction — expressions, diversity, context] | Candid laughter, concentration, collaboration |
| **Product / In-Use** | [How products appear — staged, lifestyle, detail shots] | Hands using the product, screen captures, detail close-ups |
| **Lifestyle** | [Aspirational scenes related to brand] | Morning routines, workspace setups, outdoor moments |
| **Environment** | [Spaces and settings] | Clean workspaces, cityscapes, natural landscapes |
| **Abstract / Texture** | [If applicable — for backgrounds, patterns] | Gradients, materials, macro photography |

### Photography Do's and Don'ts

| Do | Don't |
|----|-------|
| Use natural, authentic moments | Use obviously staged stock photography |
| Maintain consistent color treatment | Mix drastically different color grades |
| Show diverse, real people | Use models that don't reflect the actual audience |
| Let the subject breathe in the frame | Clutter the composition with too many elements |
| Match the lighting to brand mood | Use harsh, unflattering, or clinical lighting |

## Iconography

### Icon Style

| Property | Specification |
|----------|--------------|
| **Style** | [Line / Filled / Duotone / Custom hybrid] |
| **Stroke weight** | [Consistent value, e.g., 1.5px at 24px grid] |
| **Corner radius** | [Consistent value, e.g., 2px] |
| **End caps** | [Round / Square / Butt] |
| **Grid** | [Base grid, e.g., 24x24px with 2px padding] |
| **Color** | [Single color (foreground token) / brand primary / contextual] |

### Icon Construction Rules

```
ICON GRID
---------
┌────────────────────────┐
│ ┌──────────────────┐ │
│ │ │ │ ← 2px padding
│ │ LIVE AREA │ │
│ │ 20x20px │ │
│ │ │ │
│ └──────────────────┘ │
│ 2px →│
└────────────────────────┘
 24x24px total
```

- Consistent stroke weight across the entire icon set
- Optically centered, not mathematically centered (circles and triangles need optical adjustment)
- Simple enough to be legible at 16x16px
- Align to pixel grid to avoid blurriness at small sizes
- Filled variants available for active/selected states

### Icon Don'ts

- Don't mix line and filled styles in the same context
- Don't use icons at sizes below the minimum grid
- Don't add effects (shadows, gradients, 3D)
- Don't rotate icons to create "new" icons
- Don't use icons with inconsistent stroke weights

## Illustration Style (If Applicable)

Not every brand uses illustration. Only define if it's a genuine part of the identity.

| Property | Specification |
|----------|--------------|
| **Style** | [Flat / Dimensional / Hand-drawn / Geometric / Abstract] |
| **Line weight** | [Consistent or intentionally varied] |
| **Color palette** | [Full brand palette / Limited subset / Custom illustration palette] |
| **Proportions** | [Realistic / Exaggerated / Geometric] |
| **Level of detail** | [Minimal / Moderate / High] |
| **When to use** | [Onboarding, empty states, error pages, marketing, presentations] |
| **When NOT to use** | [Where photography is better — product shots, testimonials, etc.] |

## Graphic Elements & Brand Devices

### Patterns

```
BRAND PATTERNS
--------------
Pattern 1: [Description — geometric grid, organic shapes, brand icon repeat, etc.]
 Usage: [backgrounds, section dividers, packaging]
 Scale: [how the pattern scales across different formats]
 Opacity: [full, reduced, subtle]

Pattern 2: [Description]
 Usage: [contexts]
```

### Shapes & Devices

```
GRAPHIC DEVICES
---------------
[Description of any recurring brand shapes, graphic treatments, or visual motifs]

Usage rules:
- [When to use]
- [When not to use]
- [Color rules]
- [Sizing/proportion rules]
```

### Gradients (If Applicable)

```
GRADIENT SPECIFICATIONS
-----------------------
Gradient 1: [name]
 Colors: [start] → [end]
 Direction: [angle or radial]
 Usage: [where and when]

RULES:
- [When gradients are appropriate]
- [When to use flat color instead]
```

## Brand Applications

### Digital Applications

| Touchpoint | Specifications |
|------------|---------------|
| **Website** | Logo: [placement and size]. Colors: [primary/secondary usage]. Type: [heading/body hierarchy]. |
| **Mobile app** | App icon: [logomark on brand color]. Splash: [logo centered on background]. UI: [follow design tokens]. |
| **Social media profiles** | Avatar: [logomark on brand color, square crop]. Cover: [specify what goes here]. |
| **Social media posts** | Templates for: quotes, announcements, photos, carousels. Color treatment, type overlay rules. |
| **Email signatures** | Logo: [variation, size]. Font: [system font matching brand]. Layout: [left-aligned, minimal]. |
| **Email newsletters** | Header: [logo + navigation]. Body: [type hierarchy]. CTA: [button style]. Footer: [standard]. |
| **Presentations** | Cover: [layout]. Section dividers: [layout]. Content slides: [grid, type, color]. |

### Print Applications (If Applicable)

| Touchpoint | Specifications |
|------------|---------------|
| **Business cards** | Dimensions: [standard or custom]. Front: [logo, name, title]. Back: [brand pattern, logo, or blank]. Stock: [paper weight, finish]. |
| **Letterhead** | Logo: [position, size]. Margins: [specified]. Footer: [contact info]. |
| **Envelopes** | Logo: [position]. Return address: [type specs]. |
| **Marketing collateral** | Grid system for brochures, one-pagers, flyers. |

### Environmental Applications (If Applicable)

| Touchpoint | Specifications |
|------------|---------------|
| **Signage** | Exterior: [materials, lighting, size]. Interior: [wayfinding, room signs]. |
| **Packaging** | Primary: [layout, color, type]. Secondary: [boxes, bags, inserts]. |
| **Merchandise** | Logo placement rules for apparel, accessories, promotional items. |
| **Trade show** | Booth: [layout, materials]. Banners: [sizes, layouts]. |

## Accessibility Requirements

All visual identity applications must meet:

- **Color contrast**: WCAG AA minimum (4.5:1 for text, 3:1 for large text and UI)
- **Logo legibility**: Meet minimum size requirements across all contexts
- **Alt text**: All images must have descriptive alt text
- **Color independence**: Never convey meaning through color alone
- **Motion**: Respect `prefers-reduced-motion`; all animations must have reduced/stopped alternatives
- **Touch targets**: 44x44px minimum for interactive elements
