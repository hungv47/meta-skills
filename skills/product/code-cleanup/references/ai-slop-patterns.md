# AI Slop Patterns

Reference catalog for the code-scanner-agent. These are common AI-generated code patterns that degrade codebase quality.

## Comments to Remove

- Obvious/redundant comments explaining what code clearly does
- Comments that don't match the commenting style elsewhere in the file
- Section divider comments when not used elsewhere
- `// TODO` or `// FIXME` comments added by the AI with no actionable context
- Comments restating the function signature or variable name

## Defensive Code to Remove

- Try/catch blocks around code that doesn't throw
- Null/undefined checks when callers guarantee valid input
- Type guards that duplicate earlier validation
- Fallback values for parameters that are always provided
- Redundant `if (!x) return` guards when `x` is guaranteed by the caller
- Empty catch blocks that silently swallow errors

## Type Issues to Fix

- Casts to `any` that bypass TypeScript's type system
- Type assertions (`as Type`) that hide real type mismatches
- Overly broad generic types when specific types exist
- `unknown` used as a lazy escape hatch instead of proper typing
- Redundant type annotations on variables where inference is sufficient

## Structural Patterns to Flag

- Unnecessary abstraction layers (wrapper functions that just call another function)
- Single-use utility functions that obscure inline logic
- Over-engineered error handling for internal code paths
- Feature flags or backwards-compatibility shims for code that was just written
- Premature abstractions (interfaces/classes for one implementation)
- Re-exported types or renamed `_unused` variables instead of deletion

## Frontend / Visual AI Slop

AI-generated frontend code has recognizable visual patterns that make apps look generic. Scan `.tsx`, `.jsx`, `.html`, `.css`, `.scss` files for these:

**Layout patterns to flag:**
- 3-column grid with icon-circle + title + description (the #1 most recognizable AI layout — cards with centered icons in colored circles, a bold title, and 1-2 lines of description)
- `text-align: center` applied to everything — real designs mix alignments
- Cookie-cutter page structure: hero → 3 features → testimonials → pricing → CTA (every section looks like a template)
- Uniform large `border-radius` on all cards/containers (same roundness everywhere)

**Color & decoration patterns to flag:**
- Purple/violet/indigo gradients (`background: linear-gradient` with purple hues) — the signature AI color
- Icons wrapped in colored circles (`border-radius: 50%` + background color + centered icon)
- Decorative SVG blobs or wavy section dividers with no design-system justification
- Colored left-border on cards (`border-left: 4px solid`) as the only visual variation
- Emoji used as visual design elements (not content) — e.g., emoji as feature icons

**Copy patterns to flag:**
- Generic hero copy: "Welcome to [X]", "Unlock the power of", "Revolutionize your", "Your all-in-one solution"
- Feature descriptions that could describe any product — delete the product name and if the copy still makes sense, it's generic
- CTAs that say "Get Started" or "Learn More" without specificity
