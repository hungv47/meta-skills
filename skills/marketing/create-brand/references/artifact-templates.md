# Artifact Templates

Complete output templates for the brand-system skill. The orchestrator references these when assembling final artifacts.

---

## BRAND.md Template

```markdown
# [Brand Name] Brand

---

## The Origin Story

[Narrative prose — not bullet points. What is this product? Why does it exist? What problem sparked it? What's the founding story or philosophy? This section should read like the opening of a brand book, not a PRD. 3-6 paragraphs.]

---

## The Name

**Primary reading:** "[Pronunciation guide]"

**The meaning:** [What the name means, etymology, linguistic roots]

**Why this name:** [Why this name was chosen over alternatives. What it signals about the product's identity.]

**What "[name]" means for [Brand]:**
- [Meaning 1 — tied to product function]
- [Meaning 2 — tied to brand promise]
- [Meaning 3 — tied to user experience]

---

## Purpose, Mission & Vision

**Purpose, why [Brand] exists:**
[One sentence — emotional, beyond revenue]

**Mission, what [Brand] does now:**
[1-2 sentences — present-tense, who/what/how]

**Vision, what success looks like:**
[One sentence — aspirational but achievable in 5-10 years]

**Brand promise:**
[One sentence — the single most important commitment to customers]

---

## Core Values

**1. [Value X] over [legitimate alternative Y].**
[What it means in practice — specific behavioral standard. When this value forces a hard decision, which way do we go? 2-3 sentences.]

**2. [Value X] over [legitimate alternative Y].**
[...]

**3. [Value X] over [legitimate alternative Y].**
[...]

[3-5 values total. Each opposite must be a legitimate alternative, not obviously stupid.]

---

## Brand Positioning

**Positioning statement:**
For [target audience] who [situation/need], [Brand] is the only [category] that [difference], because [proof].

**Value proposition:**
We help [who] [do what] by [how], so they can [outcome].

**What we are:**
- [Bullet list — concrete, specific]

**What we are not:**
- [Bullet list — explicit boundaries, name competitors we're NOT]

**Competitive distinction:**
- [Unique visual/technical/experiential elements that no competitor offers]

---

## Brand Archetype

**Primary (70%): [Archetype]** — [Why it fits: connect to audience's core desire and product positioning. 2-3 sentences.]

**Secondary (30%): [Archetype]** — [What nuance it adds without contradicting the primary. 2-3 sentences.]

| Archetype | [Parent brand] expression | [Brand] expression |
|-----------|--------------------------|-------------------|
| **[Primary] (70%)** | [If applicable] | [How this archetype manifests in the product, design, and experience] |
| **[Secondary] (30%)** | [If applicable] | [How the secondary adds dimensionality] |

**In action:**
- How we inspire: [specific behavior]
- How we communicate: [specific style]
- How we make people feel: [specific emotion]
- What we'd never do: [specific boundary]

---

## Personality Traits

| Trait | What it means | What it doesn't mean |
|-------|---------------|----------------------|
| **[Trait], but not [extreme]** | [Concrete description with product examples] | [Where the line is, with product examples] |
| **[Trait], but not [extreme]** | [...] | [...] |
| **[Trait], but not [extreme]** | [...] | [...] |

[3-5 traits. Each row should have enough specificity that a designer or copywriter can make decisions from it.]

---

## Emotional Journey Map

| Touchpoint | Emotion | What triggers it |
|------------|---------|------------------|
| **First encounter** | [emotion] | [what about the name/visual/positioning creates this] |
| **Landing page** | [emotion] | [what visual or copy element triggers this] |
| **First use** | [emotion] | [what interaction or feature triggers this] |
| **Daily use** | [emotion] | [what sustained experience triggers this] |
| **Collaboration** | [emotion] | [what social feature triggers this — if applicable] |
| **Hitting a limit** | [emotion] | [how the brand handles the constraint] |
| **Upgrade/purchase** | [emotion] | [how the transaction feels] |
| **Telling someone** | [emotion] | [what they say, how they describe it] |

**CORE TENSION:** [Problem/desire the brand resolves — one sentence]

**DESIGN PROMISE:** [What the entire brand experience communicates — one sentence]

---

## Brand Voice DNA

### Voice Attributes

| Attribute | Description | Do | Don't |
|-----------|-------------|-----|-------|
| **[Attr 1]** | [What it means for this brand] | "[Specific real example]" | "[Specific real anti-example]" |
| **[Attr 2]** | [...] | "[...]" | "[...]" |
| **[Attr 3]** | [...] | "[...]" | "[...]" |

[3-5 attributes. Do/Don't examples must be from real brand contexts (error messages, CTAs, onboarding), not hypothetical. These define the voice — they're what copywriting consumes downstream.]

### Tone Range

Default dimensional position:
- Formal <--[X]--------> Casual
- Serious <----[X]------> Playful
- Respectful <-[X]--------> Irreverent
- Enthusiastic <------[X]---> Matter-of-fact

| Context | Tone shift | Example |
|---------|-----------|---------|
| **Marketing / landing page** | [shift description] | "[example copy]" |
| **Product UI** | [shift description] | "[example copy]" |
| **Error / friction** | [shift description] | "[example copy]" |

[3 contexts define the range. Add 1-2 more only for unusual product surfaces.]

### Tagline

**Primary:** "[Tagline — 2-7 words]"

V:[1-3] F:[1-3] U:[1-3] = [total]/9. [Scoring rationale: Visual, Falsifiable, Unique/Ownable]

[One tagline. Platform-specific variants (App Store, social bio, etc.) are produced by copywriting, not brand-system.]

---

## The Brand Mark

### Concept

[Visual description of the logo — enough detail to commission or generate. Describe the symbol, the visual metaphor, the colors, the feel. 2-3 sentences.]

### Logo Versions

- **Mark:** [standalone symbol description]
- **Wordmark:** [font, weight, letter-spacing]
- **Combo:** [lockup description]
- SVG assets in `./logo/`

### Color Combinations by Context

| Background | Mark/Wordmark | Use Case |
|------------|---------------|----------|
| [bg 1] | [color] | [context] |
| [bg 2] | [color] | [context] |

### Logo Rules

**Always:** [use provided artwork, maintain clear space, keep proportions, use specified font]

**Never:** [add shadows, rotate, place on busy backgrounds, use font substitutes]

---

## [Product-Specific Brand Sections]

[Sections unique to this product that carry brand weight. Examples:]
[- A unique theme or visual mode as brand differentiator]
[- Pricing tiers as brand expression (what each tier signals)]
[- Parent brand relationship (what's inherited vs overridden)]
[- Platform-specific brand considerations]

[Each section should explain both the WHAT and the WHY — how this product-specific element reinforces brand positioning.]

---

## Digital Touchpoints

| Touchpoint | Visual brand expression |
|------------|------------------------|
| **Landing page** | [visual system, layout, typography, hero, material language] |
| **App (core experience)** | [design system in action — theme, components, chrome density] |
| **App Store listing** | [icon, screenshot composition, visual style] |
| **Social media** | [profile visual, post style, screenshot treatments] |
| **Email** | [typography with fallbacks, visual treatment] |
| **Documentation** | [theme, typography, visual hierarchy] |
```

---

## DESIGN.md Template

```markdown
# Design System: [Brand Name]

> AI-readable design system for the [Brand Name] [product type]. Describes every visual rule an AI agent needs to generate on-brand UI, pages, and marketing materials. [Tool names] should read this file alongside every prompt.
>
> **Archetype:** [Primary] ([%]) + [Secondary] ([%])
> **Visual metaphor:** [2-4 word description]
> **Typography:** [Display font] (display) + [Body font] (body) + [Mono font] (code)
> **Primary color:** [Color name], hue [N]

---

## 1. Visual Theme & Atmosphere

[2-3 paragraphs of prose describing the overall visual feel. What does the product look like? What physical space or material does it evoke? What's the density (sparse/moderate/dense)? What's the mood? This is the "vibe check" that orients every design decision.]

The mood is: **[3-4 adjectives].**

---

## 2. Color Palette & Roles

[Introductory note on color space and hue identity.]

### Primary Colors

| Role | Name | OKLCH | Hex | Context |
|------|------|-------|-----|---------|
| Primary | [Name] | `oklch(L C H)` | #hex | [purpose + archetype trace] |
| Primary (Dark) | [Name] | `oklch(L C H)` | #hex | [dark mode variant] |
| Accent | [Name] | `oklch(L C H)` | #hex | [purpose] |
| Surface Glow | [Name] | `oklch(L C H)` | #hex | [purpose] |
| Brand Deep | [Name] | `oklch(L C H)` | #hex | [purpose] |
[Add theme-specific primaries if applicable: Nature, etc.]

### Semantic Colors

| State | OKLCH | Hex |
|-------|-------|-----|
| Success | `oklch(L C H)` | #hex |
| Warning | `oklch(L C H)` | #hex |
| Error/Destructive | `oklch(L C H)` | #hex |
| Info | `oklch(L C H)` | #hex |

### Theme Palettes

[Complete token table for EVERY theme. Each theme gets its own subsection with a one-line description of the theme's character.]

#### [Theme Name] (Default)

[One-line description]

| Token | OKLCH | Hex | Role |
|-------|-------|-----|------|
| `--background` | `oklch(...)` | #... | Page background |
| `--foreground` | `oklch(...)` | #... | Primary text |
| `--card` | `oklch(...)` | #... | Card surfaces |
| `--card-foreground` | `oklch(...)` | #... | Card text |
| `--primary` | `oklch(...)` | #... | Primary actions |
| `--primary-foreground` | `oklch(...)` | #... | Text on primary |
| `--secondary` | `oklch(...)` | #... | Secondary surfaces |
| `--secondary-foreground` | `oklch(...)` | #... | Text on secondary |
| `--muted` | `oklch(...)` | #... | Disabled, subtle bg |
| `--muted-foreground` | `oklch(...)` | #... | Subdued text |
| `--accent` | `oklch(...)` | #... | Accent highlights |
| `--accent-foreground` | `oklch(...)` | #... | Text on accent |
| `--destructive` | `oklch(...)` | #... | Error, destructive |
| `--destructive-foreground` | `oklch(...)` | #... | Text on destructive |
| `--border` | `oklch(...)` | #... | Default borders |
| `--input` | `oklch(...)` | #... | Input borders |
| `--ring` | `oklch(...)` | #... | Focus ring |
| `--canvas-bg` | `oklch(...)` | #... | Canvas/workspace surface [optional — only for canvas-based products] |

[Repeat for Dark theme, and any product-specific themes]

### Neutral Scale

| Step | OKLCH | Hex | Usage |
|------|-------|-----|-------|
| 50-950 scale with all steps |

### [Product-Specific Color Elements]

[e.g., pushpin colors, tag colors, status colors specific to this product]

### Surface & Material Language

[The signature material treatment. CSS formulas for the product's visual language.]

| Theme | Background | Blur | Border |
|-------|-----------|------|--------|
[Per-theme material formulas]

[Additional material notes: noise grain, saturate filter, etc.]

### Color Distribution: 60 / 30 / 10

| Proportion | Role | [Theme 1] | [Theme 2] | [Theme N] |
|------------|------|-----------|-----------|-----------|
| **60%** | Background, canvas | [...] | [...] | [...] |
| **30%** | Cards, secondary | [...] | [...] | [...] |
| **10%** | Primary, accents | [...] | [...] | [...] |

### Color Rules

- [Rule 1 — with rationale]
- [Rule 2]
- [Convention: `bg-primary text-primary-foreground` (NOT `bg-primary text-primary`)]

---

## 3. Typography Rules

### Font Stack

| Role | Font | Weight | Character |
|------|------|--------|-----------|
| **Display** | [Font] | [weights] | [personality and use] |
| **Body** | [Font] | [weights] | [personality and use] |
| **Mono** | [Font] | [weights] | [use] |

**Fallback stacks:**
[CSS custom property declarations with fallbacks]

### Type Scale

| Level | Font | Size | Weight | LH | LS | Use |
|-------|------|------|--------|----|----|-----|
| H1-H4, Body, Body Small, Caption, Overline, Code |

### Typography Rules

- [Max families rule]
- [Headline personality rule]
- [Body line-height rule]
- [Loading/font-display rule]
- [Product-specific typography rules]

---

## 4. Component Stylings

### [Product-Specific Core Component] (e.g., Sticky Notes)

[Detailed spec for the product's PRIMARY visual element — the thing users interact with most.]

| Property | Value |
|----------|-------|
[Complete property table with all states: resting, hovered, active, dragging, etc.]

### Cards

| Property | Value |
|----------|-------|
[...]

### Buttons

[6 variants with visual description and use case per variant]
[Sizes table: sm, default, lg, icon with height, padding, font size]

### Inputs / Forms

| State | Treatment |
|-------|-----------|
[Default, Focus, Error, Disabled — with token references]

### [Other Product-Specific Components]

[e.g., Canvas Grid, Pin Picker, Theme Toggle — whatever is unique to this product]

---

## 5. Layout Principles

### Spacing Scale

| Token | Value |
|-------|-------|
[Full spacing scale from base unit]

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
[All radius tokens with archetype justification for the base value]

---

## 6. Shadows & Elevation

[Multi-level shadow system]

| Level | Value | Use |
|-------|-------|-----|
[4-8 shadow levels with OKLCH alpha values]

[Shadow progression notes for key interactions]

### Z-Index Scale

| Token | Value | Use |
|-------|-------|-----|
[Complete z-index scale for the product's layer hierarchy]

---

## 7. Iconography

### System

- Grid, stroke weight, corner radius, style, base set

### [Product-Specific Icon Behaviors]

[e.g., active state treatments, icon-specific color rules]

### [Product-Specific Icons]

| Icon | Context |
|------|---------|
[Icons unique to this product]

---

## 8. Imagery & Visual Direction

### Photography

- **Mood:** [tied to archetype]
- **Lighting:** [specific]
- **Color treatment:** [specific]
- **Subjects:** [who/what, tied to audience]
- **Composition:** [rules]
- **What to avoid:** [specific no-gos]

### Brand Devices

- [Patterns, shapes, textures, graphic elements unique to this brand]

---

## 9. Motion & Animation

### Principles

1. [Principle 1]
2. [Principle 2]
3. [Principle 3 — tied to archetype]

### Duration Scale

| Token | Duration | Use |
|-------|----------|-----|
[4-6 duration tokens]

### Easing

- Enter, Exit, Move conventions
- Spring physics values (stiffness, damping, mass) for key interactions

### Key Animations

| Animation | Duration | Easing | Description |
|-----------|----------|--------|-------------|
[Named animations with exact values — not generic "fade in"]

### Ambient (Marketing Only)

[If applicable — longer decorative animations for landing pages]

### Motion Safety

[`prefers-reduced-motion` CSS block and specific fallback behaviors]

---

## 10. Accessibility

### Contrast (WCAG AA)

[Per-theme contrast tables]

| Pairing | Ratio | Status |
|---------|-------|--------|
[Key pairings for each theme]

### Focus Indicators

| Theme | Focus ring | Offset |
|-------|-----------|--------|
[Per-theme focus ring specs]

### Touch & Click Targets

- Minimum sizes, spacing, expanded hit areas

### Color Independence

- [How meaning is conveyed without relying on color alone]

### [Product-Specific Accessibility]

[e.g., glass surface content readability, canvas zoom accessibility]

---

## 11. Do's and Don'ts

### Do

- [Concrete, actionable rules — 10-15 items]
- [Each rule should be specific enough to test: "did we do this?"]

### Don't

- [Concrete prohibitions — 10-15 items]
- [Each rule should name the specific anti-pattern and why it's wrong]
```
