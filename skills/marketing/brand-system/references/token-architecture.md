# Token Architecture

The three-layer token system that powers every design decision. Based on shadcn/ui conventions and the W3C Design Tokens Community Group specification.

## The Three Layers

### Layer 1: Primitive Tokens (What Exists)

Raw design values without usage context. The palette.

**Never apply primitives directly to UI elements.** They exist only as the source material for semantic tokens.

```
PRIMITIVE EXAMPLES
------------------
color.blue.50: oklch(0.970 0.014 254) / #eff6ff
color.blue.100: oklch(0.932 0.032 255) / #dbeafe
color.blue.200: oklch(0.882 0.059 254) / #bfdbfe
color.blue.300: oklch(0.809 0.105 251) / #93c5fd
color.blue.400: oklch(0.707 0.165 254) / #60a5fa
color.blue.500: oklch(0.623 0.214 259) / #3b82f6
color.blue.600: oklch(0.546 0.245 262) / #2563eb
color.blue.700: oklch(0.488 0.243 264) / #1d4ed8
color.blue.800: oklch(0.424 0.199 265) / #1e40af
color.blue.900: oklch(0.379 0.146 265) / #1e3a8a
color.blue.950: oklch(0.282 0.091 267) / #172554

spacing.1: 4px / 0.25rem
spacing.2: 8px / 0.5rem
font.size.base: 16px / 1rem
radius.md: 0.375rem / 6px
```

### Layer 2: Semantic Tokens (What It Means)

Map primitives to UI roles. This is the design system's API.

Every semantic token is a **background/foreground pair**:
- The base name (`--primary`) = background/fill color
- The `-foreground` suffix (`--primary-foreground`) = text/icon color on that surface

```
SEMANTIC TOKEN USAGE
--------------------
CORRECT: bg-primary text-primary-foreground
WRONG: bg-primary text-primary
WRONG: bg-primary text-white (hardcoded)
```

### Layer 3: Component Tokens (Where It Goes)

Map semantic tokens to specific components. Optional for simple systems, valuable for multi-brand or complex products.

```
COMPONENT TOKEN CHAIN
---------------------
button.primary.background → var(--primary) → blue.600 → oklch(0.546 0.245 262)
```

## Complete Semantic Token Map

These ~30 tokens cover an entire component library. Each must have light and dark values.

### Core Surface Tokens

| Token | Role | Light Source | Dark Source |
|-------|------|-------------|------------|
| `--background` | Page background | neutral.50 or white | neutral.950 |
| `--foreground` | Default body text | neutral.950 | neutral.50 |
| `--card` | Card/elevated surfaces | white | neutral.900 |
| `--card-foreground` | Text on cards | neutral.950 | neutral.50 |
| `--popover` | Dropdowns, tooltips, overlays | white | neutral.900 |
| `--popover-foreground` | Text on popovers | neutral.950 | neutral.50 |

### Interactive Tokens

| Token | Role | Light Source | Dark Source |
|-------|------|-------------|------------|
| `--primary` | Main brand action | brand.600 | brand.500 |
| `--primary-foreground` | Text on primary | white | neutral.950 |
| `--secondary` | Secondary/subtle actions | neutral.100 | neutral.800 |
| `--secondary-foreground` | Text on secondary | neutral.900 | neutral.50 |
| `--accent` | Hover highlights, subtle emphasis | neutral.100 | neutral.800 |
| `--accent-foreground` | Text on accent | neutral.900 | neutral.50 |
| `--destructive` | Danger/error actions | red.600 | red.500 |
| `--destructive-foreground` | Text on destructive | white | neutral.950 |
| `--muted` | Disabled/subdued backgrounds | neutral.100 | neutral.800 |
| `--muted-foreground` | Placeholder, disabled, caption text | neutral.500 | neutral.400 |

### Structural Tokens

| Token | Role | Light Source | Dark Source |
|-------|------|-------------|------------|
| `--border` | Default borders | neutral.200 | neutral.800 |
| `--input` | Input field borders | neutral.200 | neutral.800 |
| `--ring` | Focus ring color | brand.600 | brand.500 |

### Global Shape

| Token | Role | Value |
|-------|------|-------|
| `--radius` | Global border-radius | Single value (e.g., `0.625rem`) |

Components derive their radius from this:
- Full radius: `var(--radius)` — cards, dialogs, dropdowns
- Reduced: `calc(var(--radius) - 2px)` — buttons, inputs, badges inside cards
- Minimal: `calc(var(--radius) - 4px)` — small elements, checkboxes

### Data Visualization

| Token | Role | Guideline |
|-------|------|-----------|
| `--chart-1` | Primary data series | Brand-adjacent, distinct |
| `--chart-2` | Secondary data series | Complementary hue |
| `--chart-3` | Tertiary data series | Must differ from 1 and 2 |
| `--chart-4` | Quaternary data series | Adequate contrast with all above |
| `--chart-5` | Quinary data series | Still accessible at small sizes |

Chart colors must be distinguishable in grayscale and by people with color vision deficiency. Use varied lightness, not just varied hue.

### Sidebar Tokens (Complex Apps)

For applications with persistent side navigation:

| Token | Role |
|-------|------|
| `--sidebar` | Sidebar background (often slightly different from page) |
| `--sidebar-foreground` | Sidebar body text |
| `--sidebar-primary` | Active/selected sidebar item |
| `--sidebar-primary-foreground` | Text on active sidebar item |
| `--sidebar-accent` | Hovered sidebar item |
| `--sidebar-accent-foreground` | Text on hovered sidebar item |
| `--sidebar-border` | Sidebar border/divider |
| `--sidebar-ring` | Sidebar focus ring |

## Neutral Base Presets

Five neutral bases. Each creates a subtly different feel across the entire system.

### Neutral (Pure Gray)

No undertone. Clean, stark, digital-native.

```
LIGHT:
 50: oklch(0.985 0 0) / #fafafa
 100: oklch(0.970 0 0) / #f5f5f5
 200: oklch(0.922 0 0) / #e5e5e5
 300: oklch(0.870 0 0) / #d4d4d4
 400: oklch(0.708 0 0) / #a3a3a3
 500: oklch(0.556 0 0) / #737373
 600: oklch(0.439 0 0) / #525252
 700: oklch(0.371 0 0) / #404040
 800: oklch(0.269 0 0) / #262626
 900: oklch(0.205 0 0) / #171717
 950: oklch(0.145 0 0) / #0a0a0a
```

### Stone (Warm Gray)

Warm undertone. Grounded, earthy, natural, inviting.

```
LIGHT:
 50: oklch(0.985 0.002 75) / #fafaf9
 100: oklch(0.970 0.001 75) / #f5f5f4
 200: oklch(0.923 0.003 48) / #e7e5e4
 300: oklch(0.869 0.005 56) / #d6d3d1
 400: oklch(0.709 0.01 56) / #a8a29e
 500: oklch(0.553 0.013 58) / #78716c
 600: oklch(0.444 0.011 73) / #57534e
 700: oklch(0.374 0.01 67) / #44403c
 800: oklch(0.268 0.007 34) / #292524
 900: oklch(0.216 0.006 56) / #1c1917
 950: oklch(0.147 0.004 49) / #0c0a09
```

### Zinc (Cool Gray)

Cool undertone. Industrial, precise, technical.

```
LIGHT:
 50: oklch(0.985 0 0) / #fafafa
 100: oklch(0.967 0.001 286) / #f4f4f5
 200: oklch(0.920 0.004 286) / #e4e4e7
 300: oklch(0.871 0.006 286) / #d4d4d8
 400: oklch(0.705 0.015 286) / #a1a1aa
 500: oklch(0.552 0.016 286) / #71717a
 600: oklch(0.442 0.017 286) / #52525b
 700: oklch(0.374 0.014 286) / #3f3f46
 800: oklch(0.274 0.006 286) / #27272a
 900: oklch(0.210 0.006 286) / #18181b
 950: oklch(0.141 0.005 286) / #09090b
```

### Gray (Blue-Gray)

Subtle blue undertone. Corporate, reliable, familiar.

```
LIGHT:
 50: oklch(0.986 0.002 247) / #f9fafb
 100: oklch(0.968 0.003 264) / #f3f4f6
 200: oklch(0.928 0.006 264) / #e5e7eb
 300: oklch(0.872 0.01 258) / #d1d5db
 400: oklch(0.707 0.022 261) / #9ca3af
 500: oklch(0.551 0.027 264) / #6b7280
 600: oklch(0.446 0.03 256) / #4b5563
 700: oklch(0.373 0.034 259) / #374151
 800: oklch(0.278 0.033 256) / #1f2937
 900: oklch(0.21 0.034 264) / #111827
 950: oklch(0.13 0.028 261) / #030712
```

### Slate (Blue-Tinted)

Strongest blue undertone. Professional, established, calm.

```
LIGHT:
 50: oklch(0.984 0.003 247) / #f8fafc
 100: oklch(0.968 0.007 247) / #f1f5f9
 200: oklch(0.929 0.013 255) / #e2e8f0
 300: oklch(0.869 0.022 252) / #cbd5e1
 400: oklch(0.704 0.04 256) / #94a3b8
 500: oklch(0.554 0.046 257) / #64748b
 600: oklch(0.446 0.043 257) / #475569
 700: oklch(0.372 0.044 257) / #334155
 800: oklch(0.279 0.041 260) / #1e293b
 900: oklch(0.208 0.042 265) / #0f172a
 950: oklch(0.129 0.042 264) / #020617
```

## Choosing a Neutral Base

| If the brand feels... | Choose |
|----------------------|--------|
| Clean, digital-first, minimal | Neutral |
| Warm, organic, lifestyle | Stone |
| Technical, industrial, precise | Zinc |
| Corporate, business, reliable | Gray |
| Professional, established, trustworthy | Slate |

## OKLCH Quick Reference

Format: `oklch(Lightness Chroma Hue)`

- **Lightness** (0-1): 0 = black, 1 = white
- **Chroma** (0-0.4): 0 = gray, higher = more saturated
- **Hue** (0-360): Color wheel angle

**Why OKLCH over HSL/Hex:**
- Perceptually uniform — equal numeric steps = equal visual steps
- Better for generating accessible color scales
- Native CSS support (`oklch()` works in all modern browsers)
- Makes dark mode adjustments intuitive (reduce chroma, adjust lightness)

**Dark mode adjustments in OKLCH:**
- Text: increase lightness to 0.85-0.98
- Backgrounds: decrease lightness to 0.12-0.20
- Primary colors: increase lightness +0.05-0.10, reduce chroma slightly
- Borders: lightness 0.25-0.35 (subtle against dark backgrounds)
