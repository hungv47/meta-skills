# Implementation Rules — Accessibility, Dark Mode & Applications

Reference for the brand-system skill. Contains accessibility baseline, dark mode rules, and brand application guidelines.

## Accessibility Baseline

```
CONTRAST REQUIREMENTS (WCAG 2.1 AA):
 Normal text (<18px): 4.5:1 minimum
 Large text (18px+ bold): 3:1 minimum
 UI components: 3:1 minimum
 Focus indicators: 3:1 against adjacent colors

INTERACTIVE TARGETS:
 Minimum: 44x44px touch targets (WCAG 2.5.8)
 Spacing: 8px minimum between targets

FOCUS STATES:
 Visible focus ring on ALL interactive elements
 Style: ring-2 ring-[var(--ring)] ring-offset-2 ring-offset-[var(--background)]
 Never remove focus outline without replacement

COLOR INDEPENDENCE:
 Never use color alone to convey meaning
 Pair color with: icons, text labels, patterns, or position

MOTION SAFETY:
 Respect prefers-reduced-motion
 Provide reduced/no-animation fallbacks for all transitions
```

## Dark Mode Rules

Dark mode is a parallel track built into the token system from Step 1.

- Every semantic token has both light and dark values
- Dark mode reduces saturation and shifts lightness — avoid inverting
- Surface hierarchy uses multiple levels (background → card → popover), not just "black"
- Primary colors shift lighter in dark mode for visibility
- Foreground colors flip (dark text → light text) maintaining contrast ratios
- Semantic colors (success, error, warning) preserve hue but adjust lightness
- Borders become more subtle (lower contrast against dark surfaces)
- Shadows are usually removed or replaced with subtle border differentiation

## Brand Applications

Show the brand identity and design system applied across key touchpoints.

```
APPLICATIONS
============

DIGITAL:
- Website: [key pages — homepage, product, about. Which tokens, which type hierarchy.]
- App: [icon, splash, key screens. How tokens map to native UI.]
- Social media: [profile images, cover images, post templates. Brand color + type usage.]
- Email: [signatures, newsletter templates.]
- Presentations: [slide templates. Logo placement, color usage, type.]

PRINT (if applicable):
- Business cards, stationery, marketing materials

ENVIRONMENTAL (if applicable):
- Signage, packaging, merchandise
```
