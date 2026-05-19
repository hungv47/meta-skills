# Component Tokens & Motion

Reference for the brand-system skill. Contains component token mappings and motion/interaction specifications.

## Component Token Map

```
COMPONENT TOKENS
================
button.primary.background: var(--primary)
button.primary.foreground: var(--primary-foreground)
button.primary.hover: [primary with adjusted lightness]
button.secondary.background: var(--secondary)
button.secondary.foreground: var(--secondary-foreground)
button.destructive.background: var(--destructive)
button.destructive.foreground: var(--destructive-foreground)
button.ghost.background: transparent
button.ghost.foreground: var(--foreground)
button.ghost.hover: var(--accent)

input.background: var(--background)
input.border: var(--input)
input.border.focus: var(--ring)
input.placeholder: var(--muted-foreground)

card.background: var(--card)
card.foreground: var(--card-foreground)
card.border: var(--border)

badge.default.background: var(--primary)
badge.default.foreground: var(--primary-foreground)
badge.secondary.background: var(--secondary)
badge.secondary.foreground: var(--secondary-foreground)
badge.destructive.background: var(--destructive)
badge.destructive.foreground: var(--destructive-foreground)
badge.outline.background: transparent
badge.outline.border: var(--border)
```

## Button Hierarchy

```
BUTTON HIERARCHY
----------------
1. PRIMARY (one per view max)
 Tokens: bg-primary text-primary-foreground
 Hover: primary with +5% lightness
 Use: The ONE action you want users to take

2. SECONDARY
 Tokens: bg-secondary text-secondary-foreground
 Hover: secondary with +5% lightness
 Use: Alternative valid paths

3. DESTRUCTIVE
 Tokens: bg-destructive text-destructive-foreground
 Use: Delete, remove, cancel subscription

4. OUTLINE
 Tokens: border-input bg-background text-foreground
 Hover: bg-accent text-accent-foreground
 Use: Lower-priority actions

5. GHOST
 Tokens: bg-transparent text-foreground
 Hover: bg-accent text-accent-foreground
 Use: Toolbar actions, inline actions

6. LINK
 Tokens: text-primary underline
 Use: Inline text actions

BUTTON SIZES:
 sm: h-8 px-3 text-xs rounded-[calc(var(--radius)-2px)]
 md: h-9 px-4 text-sm rounded-[var(--radius)]
 lg: h-10 px-6 text-sm rounded-[var(--radius)]
 xl: h-11 px-8 text-base rounded-[var(--radius)]
 icon: h-9 w-9 rounded-[var(--radius)]
```

## Form Elements

```
INPUT FIELDS
------------
Height: h-9 (36px) to h-10 (40px)
Padding: px-3 py-1
Border: 1px solid var(--input)
Focus: ring-2 ring-[var(--ring)] ring-offset-2
Radius: rounded-[var(--radius)]
Background: var(--background)
Text: var(--foreground)
Placeholder: var(--muted-foreground)

Label: text-sm font-medium text-foreground
Helper: text-xs text-muted-foreground
Error: text-xs text-destructive

VALIDATION:
- Inline on blur, not keystroke
- Error: border-destructive + error message below
- Success: subtle checkmark (optional)
```

## Cards

```
CARD SPECIFICATION
------------------
Background: var(--card)
Border: 1px solid var(--border)
Radius: rounded-[var(--radius)]
Shadow: sm (light mode), none (dark mode)
Padding: p-6

Card Header: pb-2
Card Title: text-lg font-semibold text-card-foreground
Card Description: text-sm text-muted-foreground
Card Content: pt-0
Card Footer: pt-4 flex items-center
```

## Motion & Interaction

```
MOTION PRINCIPLES
-----------------
Purpose: Guide attention, provide feedback, create delight
Never: Delay users, distract from content, add without purpose

TIMING TOKENS:
 instant: 0ms -- State changes, toggles
 fast: 100-150ms -- Micro-interactions, hovers, focus rings
 normal: 200-300ms -- Transitions, reveals, collapses
 slow: 400-500ms -- Page transitions, celebrations

EASING:
 ease-out: entering elements (decelerate in)
 ease-in: exiting elements (accelerate out)
 ease-in-out: moving elements, layout shifts
 spring: playful interactions (if archetype supports it — Jester, Magician)

INTERACTION FEEDBACK:
 Button press: scale(0.98) + slight darken, fast timing
 Hover: background token shift (e.g., accent), fast timing
 Focus: ring-2 ring-[var(--ring)] ring-offset-2, instant
 Success: brief pulse or checkmark, normal timing
 Error: subtle shake (2px, 3 cycles), fast timing
 Loading: skeleton shimmer or spinner, never frozen UI
 Accordion: height transition, normal timing, ease-out
```
