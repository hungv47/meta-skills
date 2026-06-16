# Layout Conventions — Grid, Density, State & Accessibility

> Domain reference for the **layout-state-agent** (CP-04 layout system, CP-05 state coverage,
> CP-06 accessibility floor). Spec only — no rendering. Every value here is a convention; actual
> token names come from the upstream token-application-agent output. Never hard-code raw px/hex.

## How to use this file

1. **At grid time:** Pick the surface class (desktop / web / tablet / mobile), then declare the
   column grid, gutter token, margin token, and spacing base per screen.
2. **At density time:** Pick a density tier per surface. State it explicitly in the Per-Screen
   Layout Spec block — never omit it.
3. **At state time:** Apply the five interaction states per interactive component and the three
   mandatory screen-level states per screen that holds data or async work.
4. **At accessibility time:** Emit a contrast table, enumerated focus order, named touch targets,
   and reduced-motion fallbacks. Ratios must be stated numerically; "logical order" is not a spec.

---

## 1 · Grid + Spacing

### Column grids by surface class

| Surface class | Columns | Gutter token | Margin token | Max-width cap |
|---------------|---------|--------------|--------------|---------------|
| Desktop (≥1280px) | 12 | `gap-4` | `mx-6` | `max-w-screen-xl` |
| Web / large tablet (≥768px) | 8 | `gap-4` | `mx-4` | `max-w-screen-lg` |
| Tablet portrait / small web (≥480px) | 4 | `gap-3` | `mx-4` | none |
| Mobile (< 480px) | 4 | `gap-3` | `mx-3` | none |
| Native macOS main window | 12 | `gap-4` | `mx-5` | fixed min-width per design token |
| Native mobile (iOS / Android) | 4 | `gap-3` | `mx-safe` | viewport |

Gutter and margin token names are resolved at token-application-agent time. If the upstream
merged spec declares different names, use those; flag a mismatch as `[BLOCKED: token name drift]`.

### Spacing rhythm

Base unit: **4px** (token `space-1`). Every margin, padding, and gap value must be a named
multiple. No ad-hoc spacing — a raw px value is an automatic CP-04 FAIL.

| Token | Value | Typical use |
|-------|-------|-------------|
| `space-1` | 4px | icon-label gaps, tight inline spacing |
| `space-2` | 8px | intra-component padding |
| `space-3` | 12px | compact-list row padding |
| `space-4` | 16px | standard card / form padding |
| `space-6` | 24px | section breathing room |
| `space-8` | 32px | major section separators |
| `space-12` | 48px | comfortable hero spacing |

Token names above are canonical defaults. Upstream may alias them (e.g., `padding-md` = `space-4`);
use the upstream names in the spec.

---

## 2 · Density Tiers

Pick one tier per surface — or declare your own named tier and define its row height + spacing multiplier. State it in the Per-Screen Layout Spec; never leave it implicit.

| Tier | Base row height | Spacing multiplier | When to use |
|------|-----------------|--------------------|-------------|
| **compact** | 32px | 0.75× | Data-dense tables, sidebar lists, admin/dashboard surfaces where users scan many rows fast |
| **default** | 44px | 1× | Standard app chrome, forms, cards, navigation, most product surfaces |
| **comfortable** | 56px | 1.25× | Onboarding flows, marketing-positioned product surfaces, modal dialogs, empty-state full-bleed areas |

Rule: if a screen contains both a dense table and a comfortable hero, split the spec —
declare `compact` for the table region and `comfortable` for the hero region, named per zone.

---

## 3 · Responsive / Adaptive Behavior

Four named patterns — declare exactly one per screen, or declare your own named pattern and define it explicitly:

| Pattern | Description | Typical trigger |
|---------|-------------|-----------------|
| **Fixed** | Single layout, no reflow. Breakpoints do not apply. | Native mobile screens, macOS windows at a declared min-width |
| **Fluid** | Columns + gutters scale with viewport width up to a max-width cap. | Web surfaces within a single breakpoint tier |
| **Adaptive** | Discrete layout variants at declared breakpoint tokens. Name which variant fires at which token. | Web surfaces that span multiple breakpoint tiers |
| **Platform-split** | Separate layout spec per declared surface (e.g., desktop vs. mobile vs. tablet). | Any feature shipping on 2+ surface classes |

### Standard collapse rules (Adaptive / Platform-split)

Defaults for conventional navigation — override per screen when the flow calls for different behavior; declare the override explicitly.

| Element | Collapses to | Breakpoint |
|---------|--------------|------------|
| Side navigation / rail | Drawer (hamburger or slide-over) | `bp-sm` (< 768px) |
| Multi-column data table | Stacked cards or single-column list | `bp-sm` |
| Top navigation bar | Bottom nav bar (native mobile) | `bp-xs` (< 480px) |
| Horizontal tab row | Scrollable pill strip | `bp-sm` |
| Two-column form layout | Single column | `bp-sm` |

Name the breakpoint tokens from the upstream token set; never hard-code px widths.

---

## 4 · State Visual Treatments

### Interaction states — five per interactive component

Spec every component with all five. Omit none; if a state is structurally impossible on a
surface (e.g., `hover` on a touch-only native screen), note that explicitly.

| State | Convention |
|-------|-----------|
| **default** | Resting; most visually neutral. Declare the surface token + foreground token. |
| **hover** | Cursor-driven platforms only. Typically a lightened/darkened fill via the `hover` token variant. |
| **active** | All platforms. Pressed-down token shift — darker fill or scale transform token. |
| **focus** | Keyboard / switch access. Must include the focus-ring token (`focus-ring` or equivalent). Never remove outline. |
| **disabled** | Reduced opacity via a named opacity token OR `surface-disabled` token. Must not rely on color alone. |

### Screen-level states — three mandatories

Every screen that holds data, performs async work, or is recoverable from an error must have all
three. Static screens (e.g., a confirmation splash with no async load) need only what is
structurally possible — state `none` only where the condition is impossible and say why.

| State | Convention |
|-------|-----------|
| **empty** | Name the component filling the void (e.g., `EmptyState`), placeholder copy slot, and recovery CTA if one exists. Never just "show empty." |
| **loading** | Prefer **skeleton** over spinner when the layout is stable — it prevents cumulative layout shift and communicates structure. Use spinner only for indeterminate-duration, layout-unstable operations. Name the skeleton component and the shimmer token. |
| **error** | Name the error component (`ErrorBanner`, `InlineError`, etc.), its `surface-error` token, body copy slot, and any recovery CTA label. "Show an error" fails CP-05. |

---

## 5 · Accessibility Floor (CP-06)

### Contrast minimums (WCAG 2.1 AA)

| Text / element type | Minimum contrast ratio |
|--------------------|----------------------|
| Body text (< 18pt / < 14pt bold) | 4.5 : 1 |
| Large text (≥ 18pt / ≥ 14pt bold) | 3 : 1 |
| UI components and graphical objects | 3 : 1 |

State the ratio numerically in the contrast table — do not write "passes" without the number.
Compute against the token-application-agent token pairs; flag any pair below minimum as FAIL.

### Focus order

Enumerate tab stops per screen as a numbered list. Arrow-key clusters (e.g., a radio group,
toolbar) are noted as a single group with one tab stop, arrow-navigable internally.
"Follows DOM order" or "logical order" is not an acceptable spec — enumerate the stops.

### Touch targets

| Platform | Minimum target size |
|----------|-------------------|
| iOS (HIG) | 44 × 44 pt |
| Android (Material) | 48 × 48 dp |
| Web (WCAG 2.5.5 AAA) | 44 × 44 px (AA: 24 × 24 px minimum) |
| macOS / desktop | No hard minimum; 24 × 24 px is the practical floor |

Name the element and its token-derived or declared size. Flag any element below the platform
minimum.

### Reduced-motion fallback

Every motion spec must declare what it degrades to when `prefers-reduced-motion: reduce` is
active. Default fallback: `transition: none` (instant state change). Alternative: fade-only
(opacity transition ≤ 150 ms, no translate/scale). Never omit — omission fails CP-06.

---

## 6 · Motion

Motion is restrained (matte aesthetic — no glass, no flashy spring physics).

### Duration + easing tokens

| Use case | Duration token | Easing token |
|----------|---------------|--------------|
| Micro (icon swap, color shift) | `duration-75` (75 ms) | `ease-out` |
| Standard UI (hover fill, focus ring) | `duration-150` (150 ms) | `ease-out` |
| Enter / exit overlay (modal, drawer) | `duration-200` (200 ms) | `ease-in-out` |
| Page / route transition | `duration-300` (300 ms) | `ease-in-out` |

### What animates vs. what does not

| Animate | Do not animate |
|---------|---------------|
| State transitions (focus ring, hover fill, active press) | Layout reflows or content shifts |
| Enter/exit of overlays and drawers | Loading skeletons (shimmer is CSS, not JS motion) |
| Micro-interactions (checkboxes, toggles) | Data refreshes or background sync |

Declare motion per component in the Interaction & State Spec using the tokens above. Fallback
every transition with a `prefers-reduced-motion` note — no exception.
