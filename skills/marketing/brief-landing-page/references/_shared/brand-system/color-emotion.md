<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Color Psychology & Usage Patterns

Color choices should trace directly to emotional outcomes, not aesthetic preference. Values provided in OKLCH (primary) and hex (fallback).

## Primary Color Selection

### Blue
**Psychological effect**: Trust, stability, calm, professionalism
**Best for**: Finance, healthcare, enterprise, productivity tools
**Variants**:
- Navy `oklch(0.289 0.085 265)` / #1a365d: Authority, seriousness
- Royal `oklch(0.623 0.214 259)` / #3b82f6: Confidence, action-oriented
- Sky `oklch(0.685 0.169 237)` / #0ea5e9: Friendly tech, approachable
- Teal `oklch(0.704 0.14 182)` / #14b8a6: Fresh, health-adjacent
**Caution**: Overused in tech. Can feel generic without differentiation.

### Green
**Psychological effect**: Growth, health, nature, prosperity, go/success
**Best for**: Finance (growth), health, sustainability, success states
**Variants**:
- Forest `oklch(0.392 0.125 152)` / #166534: Stability, nature, premium
- Emerald `oklch(0.696 0.17 162)` / #10b981: Fresh, balanced
- Lime `oklch(0.768 0.189 106)` / #84cc16: Energetic, youthful
- Mint `oklch(0.899 0.073 164)` / #a7f3d0: Soft, calming
**Caution**: Yellow-greens can feel sickly. Test carefully.

### Purple
**Psychological effect**: Creativity, luxury, mystery, spirituality
**Best for**: Creative tools, premium products, wellness/meditation
**Variants**:
- Deep `oklch(0.508 0.255 281)` / #7c3aed: Luxury, creativity
- Violet `oklch(0.585 0.213 277)` / #8b5cf6: Playful creativity
- Lavender `oklch(0.817 0.111 280)` / #c4b5fd: Soft, calming
**Caution**: Trendy in AI/tech. Can feel dated quickly. Purple gradients are AI cliche.

### Red
**Psychological effect**: Urgency, passion, energy, danger, appetite
**Best for**: Food, entertainment, CTAs requiring urgency, error states
**Variants**:
- Crimson `oklch(0.577 0.245 27)` / #dc2626: Urgency, importance
- Rose `oklch(0.609 0.225 17)` / #f43f5e: Softer energy, modern
- Coral `oklch(0.699 0.183 18)` / #fb7185: Warm, inviting
**Caution**: High arousal color. Use sparingly. Never for primary UI backgrounds.

### Orange
**Psychological effect**: Energy, enthusiasm, warmth, playfulness
**Best for**: Creative products, food, entertainment, youthful brands
**Variants**:
- Burnt `oklch(0.596 0.185 46)` / #ea580c: Warm, autumnal
- Tangerine `oklch(0.67 0.194 41)` / #f97316: Energetic, fun
- Peach `oklch(0.82 0.106 60)` / #fdba74: Soft, friendly
**Caution**: Can feel cheap if overused. Pair with sophisticated neutrals.

### Yellow
**Psychological effect**: Optimism, happiness, attention, caution
**Best for**: Warnings, highlights, optimistic brands, children's products
**Caution**: Hard to read. Never for text. Use for accent only. Can feel anxious.

### Pink
**Psychological effect**: Soft energy, playfulness, modern, youth
**Best for**: Gen Z products, lifestyle, beauty, non-traditional brands
**Variants**:
- Hot pink `oklch(0.627 0.222 350)` / #ec4899: Bold, modern
- Rose `oklch(0.699 0.174 349)` / #f472b6: Softer, balanced
- Blush `oklch(0.948 0.025 349)` / #fce7f3: Gentle, minimal
**Caution**: Gendered associations in some contexts.

### Black
**Psychological effect**: Sophistication, power, elegance, seriousness
**Best for**: Luxury, fashion, premium products, professional tools
**Caution**: Can feel heavy. Balance with generous white space.

## Semantic Color Standards

These semantic colors should remain consistent across most products. They map to the `--destructive` token for errors and custom semantic tokens for others.

| State | Color | OKLCH | Hex | Use |
|-------|-------|-------|-----|-----|
| Success | Green | `oklch(0.723 0.191 149)` | #22c55e | Completion, positive feedback |
| Error | Red | `oklch(0.637 0.237 25)` | #ef4444 | Problems, validation errors |
| Warning | Amber | `oklch(0.769 0.188 70)` | #f59e0b | Caution, attention needed |
| Info | Blue | `oklch(0.623 0.214 259)` | #3b82f6 | Neutral information |

**Dark mode semantic colors**: Increase lightness +0.05, reduce chroma slightly. Preserve the hue.

## Dark Mode Color Principles

Dark mode is a parallel token system, not a color inversion.

### Rules
1. **Reduce saturation**: Bright colors are harsh on dark backgrounds. In OKLCH: reduce chroma by 0.02-0.05
2. **Adjust lightness for text**: Dark mode text needs lightness 0.85-0.98
3. **Use surface hierarchy**: Multiple levels, not just black
4. **Preserve semantic meaning**: Success stays green, error stays red — hue unchanged
5. **Primary colors shift lighter**: Increase lightness +0.05-0.10 for visibility

### Dark Mode Surface Hierarchy

Use layered surfaces to create depth without relying on shadows:

```
SURFACE HIERARCHY (using Zinc base as example)
----------------------------------------------
Layer 0 — Page background:
 oklch(0.141 0.005 286) / #09090b

Layer 1 — Card / primary surface:
 oklch(0.210 0.006 286) / #18181b

Layer 2 — Raised / nested surface:
 oklch(0.274 0.006 286) / #27272a

Layer 3 — Popover / overlay:
 oklch(0.274 0.006 286) / #27272a (with shadow or border differentiation)

Border:
 oklch(0.374 0.014 286) / #3f3f46

Text primary:
 oklch(0.985 0 0) / #fafafa

Text secondary:
 oklch(0.705 0.015 286) / #a1a1aa

Text muted:
 oklch(0.552 0.016 286) / #71717a
```

### Dark Mode Mapping Pattern

```
LIGHT → DARK TRANSFORMATION
----------------------------
background: neutral.50 → neutral.950
foreground: neutral.950 → neutral.50
card: white → neutral.900
primary: brand.600 → brand.500 (lighter for visibility)
muted: neutral.100 → neutral.800
muted-fg: neutral.500 → neutral.400
border: neutral.200 → neutral.800
```

## Chart / Data Visualization Colors

Five colors that must work together, remain distinguishable in grayscale, and be accessible for color vision deficiency.

### Default Chart Palette

| Token | Light Mode | Dark Mode | Role |
|-------|-----------|-----------|------|
| `--chart-1` | `oklch(0.646 0.222 41)` / #f97316 | `oklch(0.696 0.194 41)` | Primary series |
| `--chart-2` | `oklch(0.623 0.214 259)` / #3b82f6 | `oklch(0.673 0.182 259)` | Secondary series |
| `--chart-3` | `oklch(0.696 0.17 162)` / #10b981 | `oklch(0.746 0.144 162)` | Tertiary series |
| `--chart-4` | `oklch(0.508 0.255 281)` / #7c3aed | `oklch(0.585 0.213 277)` | Quaternary series |
| `--chart-5` | `oklch(0.609 0.225 17)` / #f43f5e | `oklch(0.659 0.193 17)` | Quinary series |

**Chart color rules:**
- Vary lightness, not just hue — this ensures grayscale distinguishability
- Test with protanopia, deuteranopia, and tritanopia simulators
- Minimum 3:1 contrast against chart background
- In dark mode, increase lightness +0.05 and reduce chroma slightly

## Color Accessibility

**Contrast ratios (WCAG 2.1 AA)**:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components and graphical objects: 3:1 minimum
- Focus indicators: 3:1 against adjacent colors

**Don't rely on color alone**: Always pair with icons, text labels, or patterns.

**OKLCH advantage for accessibility**: Because lightness is perceptually uniform, you can verify contrast by comparing lightness values directly. Two colors with lightness difference > 0.4 generally meet AA for large text.

## Color Temperature & Density

**Warm palettes** (reds, oranges, yellows):
- Feel energetic, urgent, stimulating
- Best for action-oriented products
- Use cooler neutrals to balance

**Cool palettes** (blues, greens, purples):
- Feel calm, trustworthy, stable
- Best for productivity, finance, health
- Can feel distant; add warm accents for humanity

**Neutral-dominant** (grays, blacks, whites):
- Feel sophisticated, content-focused
- Best for tools where content is the hero
- Needs strategic color pops to avoid flatness

## Audience-Specific Palettes

| Audience | Primary | Accent | Neutral Base | Avoid |
|----------|---------|--------|-------------|-------|
| Enterprise | Deep blue, dark gray | Teal, orange | Slate or Gray | Bright colors, pink |
| Gen Z | Bold any color | Neon accents | Neutral or Zinc | Muted, corporate |
| Health | Blue, green, teal | Warm accent | Stone | Red (negative association) |
| Finance | Navy, green | Gold accent | Slate | Orange, pink |
| Creative | Purple, magenta | Yellow accent | Stone | Safe corporate blue |
| Luxury | Black, gold, deep colors | Minimal | Neutral | Bright, cheap colors |
| Developer | Any bold primary | Complementary | Zinc | Rounded, soft pastels |

## Common Mistakes

1. **Too many colors**: 1 primary + 1 accent + semantics + neutrals is enough
2. **Equal distribution**: Primary should dominate 60%, secondary 30%, accent 10%
3. **Purple gradients**: AI cliche. Avoid unless intentionally referencing
4. **Ignoring context**: Red means different things in China vs. US
5. **Dark mode as afterthought**: Design both modes simultaneously from the start
6. **Hex-only workflows**: Use OKLCH for manipulation, hex for documentation readability
7. **Mismatched pairs**: Always check that foreground tokens are readable on their paired background
