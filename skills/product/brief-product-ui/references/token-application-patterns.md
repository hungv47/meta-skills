# Token Application Patterns

> Canonical mapping conventions for the **token-application-agent** (CP-03 — Token fidelity). Read this file before writing the first row of a Token Application Map. For anti-patterns, skill CPs, and section contracts see `agents/token-application-agent.md` and `references/anti-patterns.md`.

---

## 1. Token Categories and Naming Convention

All tokens are CSS custom properties. Use semantic names — never literals.

### Color
| Category | Pattern | Examples |
|----------|---------|---------|
| Background / page | `--color-bg` | `--color-bg` (default dark), `--color-bg-elevated` |
| Surface (layered panels) | `--color-surface-<N>` | `--color-surface-1`, `--color-surface-2` |
| Text | `--color-text[-<role>]` | `--color-text`, `--color-text-muted`, `--color-text-disabled` |
| Border | `--color-border[-<role>]` | `--color-border`, `--color-border-subtle` |
| Accent / brand cue | `--color-<name>` | `--color-signal-lime`, `--color-deep-forest` |
| Interactive states | `--color-interactive-<state>[-<dimension>]` | `--color-interactive-hover-bg`, `--color-interactive-active-bg` |
| Semantic / status | `--color-<semantic>` | `--color-success`, `--color-warning`, `--color-danger` |

### Space
Scale steps 1–12 (multiply a base unit, e.g. 4 px — non-linear at the top for section gaps):

`--space-1` (4 px) · `--space-2` · `--space-3` · `--space-4` (16 px) · `--space-5` · `--space-6` · `--space-7` · `--space-8` (32 px) · `--space-10` (40 px) · `--space-12` (48 px)

Use `--space-<N>` for padding, margin, gap, and inset. Never write a px value.

### Type
`--type-<style>-<size>` — style = `heading | label | body | code | caption`; size = `xs | sm | md | lg | xl`

| Purpose | Token |
|---------|-------|
| Screen / section headings | `--type-heading-lg`, `--type-heading-md` |
| UI labels, button text | `--type-label-sm`, `--type-label-md` |
| Body copy | `--type-body-md`, `--type-body-sm` |
| Paths, counts, timestamps, code | `--type-code-sm`, `--type-code-md` |

Companion family tokens (used in type-scale definitions, not in element mapping):
`--font-heading` / `--font-body` / `--font-mono`

### Radius
`--radius-<size>` — `sm` | `md` | `lg` | `full`

### Elevation / Shadow
Matte surfaces only — no blur or frosted glass. Use minimal shadow for z-layering:
`--shadow-none` · `--shadow-sm` · `--shadow-md`

### Motion / Duration
`--duration-fast` · `--duration-base` · `--duration-slow` — always paired with `--ease-standard` or `--ease-decelerate`

---

## 2. Per-State Token Deltas

Every interactive element must carry all reachable state deltas. List only the dimensions that change; leave unchanged dimensions implied.

| State | Token reference pattern |
|-------|------------------------|
| Default | base token (e.g. `--color-surface-1`) |
| Hover | `--color-interactive-hover-bg` (bg shifts); text stays unless noted |
| Active / pressed | `--color-interactive-active-bg`; accent cue may appear |
| Focus | focus ring = `--color-signal-lime` at width `--focus-ring-width`; never omit on keyboard-reachable elements |
| Disabled | `--color-text-disabled` for text; `--color-interactive-disabled-bg` for fill; `--color-border-subtle` for border; no state transitions |
| Selected | `--color-deep-forest` as fill anchor; `--color-signal-lime` as active indicator (state cue) |

---

## 3. FORSVN House Brand Rules (`brand_source: house`)

The literal hex values appear here **only** as the brand source being tokenized. Use the token name in all mapping work — never the hex.

| Brand value | Token | Allowed role | Constraint |
|-------------|-------|-------------|------------|
| Ink `#0C1211` | `--color-bg` | Default dark background | Never map any element to pure black; Ink is the floor |
| Signal Lime `#B7FF6E` | `--color-signal-lime` | State cue: active selection, focus ring, primary CTA, "ready" indicator | <10 % of pixels; never a large-surface fill, panel background, or header fill |
| Deep Forest `#004700` | `--color-deep-forest` | Selected / active fill anchor | Only in selected or active state roles |
| — | `--color-surface-1..N` | Panel / card fills | Matte only — no `backdrop-filter`, no frosted-glass token |
| Space Grotesk | `--font-heading` | Headings | All heading tokens must resolve to this family |
| Plus Jakarta Sans | `--font-body` | Body copy and UI labels | Default for `--type-body-*` and `--type-label-*` |
| JetBrains Mono | `--font-mono` | Paths, counts, timestamps, code | All `--type-code-*` tokens |

Prohibited in house brand: purple/blue AI gradients, frosted / blur panels, glass morphism tokens, pure-black backgrounds.

---

## 4. Cold-Start Protocol

When `brand_source: cold-start-hint` (no DESIGN token file available):

1. Set `brand_source: cold-start-hint` in the artifact frontmatter.
2. Proceed with **named placeholder tokens** derived from semantic role — `--color-surface-1`, `--color-text-muted`, `--space-4`, etc.
3. Never invent a literal palette (no hex values, no guessed px values).
4. List every introduced placeholder in the `## Cold-Start Flags` section with its semantic intent.
5. Mark the artifact `status: done_with_concerns` and flag: _"Token file absent — placeholders used; operator must supply DESIGN tokens before production."_

---

## 5. Mapping Table Shape

Use this column order in the Token Application Map:

| Element | Token — color | Token — space | Token — type | Token — radius | Surface / state notes |
|---------|--------------|--------------|-------------|----------------|----------------------|
| Panel background | `--color-surface-1` | `--space-4` (inset) | — | `--radius-md` | Matte; no shadow unless elevated layer |
| Body text | `--color-text` | — | `--type-body-md` | — | Disabled: `--color-text-disabled` |
| Primary CTA button | `--color-signal-lime` (bg) / `--color-bg` (label) | `--space-3` v · `--space-5` h | `--type-label-md` | `--radius-md` | Hover: `--color-interactive-hover-bg`; Focus: `--color-signal-lime` + `--focus-ring-width`; Disabled: `--color-interactive-disabled-bg` |
| Selected list item | `--color-deep-forest` | `--space-3` v · `--space-4` h | `--type-body-md` | `--radius-sm` | Active indicator: `--color-signal-lime` (left border or dot, <10 % of element pixels) |
| Path / timestamp | `--color-text-muted` | — | `--type-code-sm` | — | `--font-mono`; no state change |

Write `—` only when a dimension genuinely does not apply. Every row for an interactive element must carry state delta tokens in the last column.
