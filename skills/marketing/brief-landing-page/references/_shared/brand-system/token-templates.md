<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Token Templates — Primitive & Semantic Tokens

Reference for the brand-system skill. Contains full token scale templates for primitive and semantic layers.

## Primitive Tokens

### Neutral Base Selection

Select based on archetype fit:

| Base | Undertone | Feels Like | Archetype Fit |
|------|-----------|------------|---------------|
| Neutral | Pure gray | Clean, stark, digital-native | Creator, Sage |
| Stone | Warm gray | Grounded, earthy, natural | Explorer, Caregiver, Everyman |
| Zinc | Cool gray | Industrial, precise, technical | Ruler, Hero |
| Gray | internal | Corporate, reliable, familiar | Everyman, Sage |
| Slate | internal | Professional, established, calm | Ruler, Sage, Caregiver |

### Neutral Scale Template

```
NEUTRAL BASE: [selected base]

Light mode scale:
 50: [oklch] / [hex] -- Backgrounds, subtle fills
 100: [oklch] / [hex] -- Alternate backgrounds
 200: [oklch] / [hex] -- Borders, dividers
 300: [oklch] / [hex] -- Disabled text, placeholders
 400: [oklch] / [hex] -- Muted text
 500: [oklch] / [hex] -- Secondary text
 600: [oklch] / [hex] -- Body text (light bg)
 700: [oklch] / [hex] -- Headings
 800: [oklch] / [hex] -- High emphasis
 900: [oklch] / [hex] -- Maximum emphasis
 950: [oklch] / [hex] -- Near-black

Dark mode scale: [reversed with adjusted lightness/chroma]
```

### Brand Color Primitives

```
Primary scale (50-950): [oklch + hex, derived from brand color system]
Secondary scale (50-950): [if brand demands a second hue]
Accent scale (50-950): [for delight, celebration, highlights]
Destructive scale (50-950): [reds for error/danger states]
```

### Typography Primitives

```
FONT FAMILIES: Display: [Font] | Body: [Font] | Mono: [Font]

SIZE SCALE (base 16px):
 xs: 12px/0.75rem sm: 14px/0.875rem base: 16px/1rem lg: 18px/1.125rem
 xl: 20px/1.25rem 2xl: 24px/1.5rem 3xl: 30px/1.875rem 4xl: 36px/2.25rem 5xl: 48px/3rem

WEIGHT: regular(400) medium(500) semibold(600) bold(700)
LINE HEIGHT: tight(1.25) normal(1.5) relaxed(1.75)
LETTER SPACING: tight(-0.025em) normal(0) wide(0.025em)
```

### Spacing & Radius Primitives

```
SPACING (base 4px):
 0:0 1:4px 2:8px 3:12px 4:16px 5:20px 6:24px 8:32px 10:40px 12:48px 16:64px 20:80px 24:96px

RADIUS: none(0) sm(4px) md(6px) lg(8px) xl(12px) 2xl(16px) full(9999px)
```

## Semantic Tokens

Map primitives to UI roles. This is the design system's API — the contract between brand decisions and implementation.

### Complete Semantic Token Map

```
SEMANTIC TOKENS (light / dark)
==============================

--- Core Surfaces ---
--background: [page background]
--foreground: [default text on page background]

--card: [card/elevated surface]
--card-foreground: [text on card]

--popover: [dropdown/tooltip/overlay surface]
--popover-foreground: [text on popover]

--- Interactive ---
--primary: [main brand action — buttons, links]
--primary-foreground: [text/icon on primary]

--secondary: [secondary actions, subtle buttons]
--secondary-foreground: [text on secondary]

--accent: [hover highlights, subtle emphasis]
--accent-foreground: [text on accent]

--destructive: [danger/error actions]
--destructive-foreground:[text on destructive]

--muted: [disabled backgrounds, subtle fills]
--muted-foreground: [placeholder text, disabled text, captions]

--- Structural ---
--border: [default border color]
--input: [input field border color]
--ring: [focus ring color]

--- Global Shape ---
--radius: [global border radius — brand personality]

--- Data Visualization ---
--chart-1 through --chart-5

--- Sidebar (complex apps) ---
--sidebar / --sidebar-foreground
--sidebar-primary / --sidebar-primary-foreground
--sidebar-accent / --sidebar-accent-foreground
--sidebar-border / --sidebar-ring
```

### Radius as Brand Personality

| Radius | Personality | Archetype Fit |
|--------|------------|---------------|
| 0 | Sharp, serious, enterprise | Ruler, Outlaw |
| 0.25rem | Professional, restrained | Sage, Hero |
| 0.375rem | Balanced, modern default | Creator, Explorer |
| 0.5rem | Friendly, approachable | Everyman, Caregiver |
| 0.75rem | Soft, consumer-friendly | Innocent, Lover |
| 1rem+ | Playful, app-like | Jester, Magician |

### Mapping Example

Show how brand identity decisions become implementable tokens:

```
MAPPING: Brand Identity → Primitives → Semantic Tokens
========================================================
Given: Hero archetype, primary = blue, neutral base = slate

Light Mode:
 --background: slate.50 oklch(0.984 0.003 247) / #f8fafc
 --foreground: slate.950 oklch(0.129 0.042 264) / #020617
 --primary: blue.600 oklch(0.546 0.245 262) / #2563eb
 --primary-foreground: white oklch(1 0 0) / #ffffff
 --secondary: slate.100 oklch(0.968 0.007 247) / #f1f5f9
 --secondary-foreground: slate.900 oklch(0.208 0.042 265) / #0f172a
 --accent: slate.100 oklch(0.968 0.007 247) / #f1f5f9
 --accent-foreground: slate.900 oklch(0.208 0.042 265) / #0f172a
 --destructive: red.600 oklch(0.577 0.245 27) / #dc2626
 --destructive-foreground: white oklch(1 0 0) / #ffffff
 --muted: slate.100 oklch(0.968 0.007 247) / #f1f5f9
 --muted-foreground: slate.500 oklch(0.554 0.046 257) / #64748b
 --border: slate.200 oklch(0.929 0.013 255) / #e2e8f0
 --input: slate.200 oklch(0.929 0.013 255) / #e2e8f0
 --ring: blue.600 oklch(0.546 0.245 262) / #2563eb
 --radius: 0.25rem (sharp — Hero archetype)

Dark Mode:
 --background: slate.950 oklch(0.129 0.042 264) / #020617
 --foreground: slate.50 oklch(0.984 0.003 247) / #f8fafc
 --primary: blue.500 oklch(0.623 0.214 259) / #3b82f6
 --primary-foreground: slate.950 oklch(0.129 0.042 264) / #020617
 --muted: slate.800 oklch(0.279 0.041 260) / #1e293b
 --muted-foreground: slate.400 oklch(0.704 0.04 256) / #94a3b8
 --border: slate.800 oklch(0.279 0.041 260) / #1e293b
 --input: slate.800 oklch(0.279 0.041 260) / #1e293b
 --ring: blue.500 oklch(0.623 0.214 259) / #3b82f6
 --radius: 0.25rem
```
