# Hand-Off Formats — Per-Tool Prompt Patterns

> Catalog of hand-off prompt patterns for the 4 supported targets. Each pattern names: structure, length, what to lift verbatim, what to compress, common failure modes.
>
> **Use:** when handoff-agent runs, look up the target's pattern here. Compose the prompt block to match.

---

## Implementation Prompt (Coding Agents — generic)

**Tool:** Any frontier coding agent — Claude Code, Cursor, Codex, etc. Tool-agnostic.

**When to use:** **Always.** Every brief emits this block as `handoff-implementation.md`, regardless of whether other targets are also set. Coding agents are the default executor for modern code-first workflows; specialized targets (claude-design / figma / pencil / designer) are opt-in supplements.

**Format:** Single paste-ready prompt block, ~200–350 lines. Structured technical blueprint, zero ambiguity. Modeled on Awwwards-grade single-shot prompts (the kind that produce sites worth shipping in one pass).

**Stack detection (handoff-agent runs at write time):**
- Read `package.json`, `next.config.*`, `vite.config.*`, `astro.config.*`, `svelte.config.*`, `nuxt.config.*`, `tsconfig.json`
- If a framework is detected, prompt targets it (Next.js / Vite+React / Astro / SvelteKit / Nuxt / etc.)
- If no framework detected, default to **pure HTML/CSS/Vanilla JS, single `index.html`** — highest visual ceiling for one-shot generation, mirrors the proven sample format

**Motion-stack selection:**
- Read `brand/DESIGN.md` motion section
- If a motion library is declared (GSAP, Framer Motion, Anime.js, Lottie, Motion One), use it
- If `DESIGN.md` is silent, default to **GSAP Core + GSAP ScrollTrigger + Studio Freight Lenis** (Awwwards baseline). Sync Lenis RAF with GSAP ticker.

**Structure:**

```
[1. Role prime + production target — 3–5 lines]
 "Act as an elite Creative Front-End Developer. Build [page route] for
 [audience]. [Quality target — e.g., Awwwards-grade]. [Stack constraint —
 single HTML file OR Next.js app router OR detected framework]. Execute
 the technical blueprint below with zero omissions."

[2. Hypothesis — 1 line, falsifiable claim from approved hypothesis]

[3. CORE SETUP & GLOBALS]
 Libraries (CDN URLs): motion stack with version-pinned URLs
 - GSAP Core v3.12: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
 - GSAP ScrollTrigger v3.12: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
 - Studio Freight Lenis v1.1: https://unpkg.com/lenis@1.1.13/dist/lenis.min.js
 (sync Lenis RAF with GSAP ticker)
 Fonts: from DESIGN.md type tokens, with import method (Google Fonts <link>,
 @font-face, or next/font)
 Theme tokens (from DESIGN.md palette):
 - BG: [hex from primary background token]
 - Text: [hex from primary text token]
 - Accent: [hex from accent token]
 - Muted: [hex from muted/neutral token]
 - Dark/light pairs if DESIGN.md declares dual theme
 Global treatments (ONLY if brand_digest explicitly declares them):
 - Noise overlay (SVG feTurbulence) — opacity, blend-mode
 - Custom cursor — dimensions, hover behavior, "VIEW" text on interactive
 - Preloader — counter style (0–100), exit animation
 - Navigation — fixed top, mix-blend-mode, contents (left/right text)
 ⚠ Sacred-creep guard: do NOT add global treatments brand_digest doesn't
 require. "Polish" additions are sacred drift.

[4. ASSET PLACEHOLDER RULE — verbatim block, always present. See subsection
 "Asset Placeholder Rule" below.]

[5. SECTION BLUEPRINT — for each section in approved architecture:]
 Section N: [Name]
 Layout: [exact dims in vw/vh/px, positioning idiom — e.g., "Left-aligned
 massive text (clamp(8vw, 12rem, 240px)), right-aligned image (40vw ×
 75vh)"]
 Copy (verbatim — recommended candidates from section-spec):
 Headline: "[copy]"
 Subhead: "[copy]"
 CTA: "[copy]"
 Asset: slot id `[pattern-derived]` — file path `[from asset-slot inventory]`.
 If file missing, render placeholder per Section 4 rule. NEVER inline an
 external URL.
 Motion mechanic: [explicit GSAP/Lenis/CSS recipe — e.g., "Pin section.
 Scrub container width 25vw → 100vw, height 60vh → 100vh, border-radius
 300px → 0px tied to scroll progress. Fade in overlay text on
 completion."]
 (BUG FIX) [optional callout where naive implementations fail — e.g., "Use
 overflow:hidden parent + absolute child positioned at width:100vw
 height:100vh. Do NOT use clip-path — breaks Safari subpixel rendering
 and stutters on M1."]
 Conversion gates: [from section-spec conversion-checklist — e.g., "4-U ≥
 3/4, primary CTA visible at viewport entry, trust signal within scroll
 distance"]

[6. DO NOT — verbatim, hard rails]
 Sacred elements (pattern-derived):
 - [sacred 1]
 - [sacred 2]
 Forbidden vocabulary: [comma-separated from brand voice rules]
 Generic CTAs banned: "Submit", "Click Here", "Learn More" — use first-
 person action verbs from section-spec
 Asset URL invention: do NOT invent or substitute asset URLs from Unsplash,
 stock photo sites, or any external source. Use declared file paths only;
 render placeholders per Section 4 rule for missing files.
 Page-specific failures: [from brief's "What NOT to Do" section]

[7. OUTPUT]
 Deliverable: [single index.html OR Next.js page route at app/[slug]/page.tsx
 OR component tree per detected framework]
 Inline vs external: [framework-appropriate — vanilla: "All CSS in <style>,
 all JS in <script>"; React: "Components per section under
 components/[slug]/"]
 Responsive breakpoints: 390 / 768 / 1024 / 1440 (mobile-first)

[8. CLOSING — verbatim]
 "Write production-ready, flawless code. Do not truncate. Do not use
 placeholder copy or invented imagery (asset placeholders only follow the
 Section 4 rule)."
```

**Asset Placeholder Rule (paste verbatim into every implementation prompt):**

```
ASSET PLACEHOLDERS

Use the file paths declared in the section blueprint exactly as written. Do
NOT invent or substitute image URLs from Unsplash, stock photo sites, or any
external source.

Per-asset generation prompts live at `asset-slots/{slot-id}.prompt.md`,
written by `brief-graphic` today and other media-briefing agents as the stack
grows (motion-brief, 3d-brief, video-brief, etc.).

If the file at the declared path does not yet exist, render the slot as a
solid-color placeholder block:
- Background: brand primary color at 12% opacity
- Inside: monospace text overlay showing "{slot-id} — {WxH} — pending
 {generation-route}"
- Border: 1px dashed brand-accent
- Centered both axes; preserve the declared slot dimensions

Honor any slot-specific fallback declared in the brief (e.g., "delete cell if
not real" for logo grids — never use placeholders for proof assets).
```

**Lift verbatim into the prompt:**
- Sacred elements (from brand_digest)
- Voice forbidden vocabulary + preferred phrases (from brand_digest)
- All copy slots from section-spec recommended candidates
- Asset slot IDs + file paths from asset-slot inventory
- Color hex + type tokens from brand_digest / DESIGN.md
- Closing rule + "tested on" line
- The Asset Placeholder Rule block

**Compress:**
- Hypothesis (1-line bet, full 3Q stays in brief.md)
- Architecture rationale (list sections, skip why-each)
- Audit findings (1–2 lines on what's being closed)
- 4-U / PAS scoring detail (uses as "per CP-XX in brief.md")

**Common failures:**
- **Inventing Unsplash URLs** because slot paths "look like placeholders" → explicit ban + Section 4 fallback recipe needed verbatim
- **Sacred-creep via global treatments** (adding noise/cursor/preloader for "polish" when brand_digest doesn't declare them) → guard line in CORE SETUP
- **Truncation mid-section** when prompt is long → closing rule MUST be present and explicit
- **Mixing motion libraries** (GSAP + Framer Motion in one file) → declare ONE stack upfront in CORE SETUP
- **Copy presented as suggestions** ("consider this headline...") → copy is rubric-scored upstream; coding agents must use verbatim
- **No (BUG FIX) callouts on tricky mechanics** (clip-path on Safari, mix-blend-mode + transform stacking, position:sticky inside overflow:hidden) → coding agents pick the wrong path silently
- **Stack mismatch** — emitting Vanilla JS prompt for a Next.js project, or vice versa → handoff-agent must run stack detection at write time

**Example skeleton (compressed — full prompt expands per brief):**

\`\`\`
Act as an elite Creative Front-End Developer. Build /pricing for engineering
managers at 10–50 person teams. Awwwards-grade. Single self-contained
index.html (no framework detected). Pure HTML/CSS/Vanilla JS. No React. No
Tailwind. Execute zero-omission on the blueprint below.

Hypothesis: Right-size proof leads — segmenting proof by team size lifts
small-team trial starts ≥15%.

1. CORE SETUP & GLOBALS

Libraries (CDN, version-pinned):
- GSAP Core v3.12.5 — https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
- GSAP ScrollTrigger v3.12.5 — https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
- Lenis v1.1.13 — https://unpkg.com/lenis@1.1.13/dist/lenis.min.js (sync RAF with GSAP ticker)

Fonts (Google Fonts <link>):
- Display: Geist Sans (weights 400, 600, 800)
- Body: Inter (weights 400, 500)

Theme tokens (from brand/DESIGN.md):
- BG: #F5F4EE (warm-neutral)
- Text: #1A1A1A
- Primary: #004700 (deep green)
- Accent: #74B36B (leaf)

Global treatments: NONE (brand_digest does not declare noise/cursor/preloader).

2. ASSET PLACEHOLDERS
[pattern-derived]

3. SECTION BLUEPRINT

Section 1: Hero
Layout: Centered headline (clamp(48px, 6vw, 96px)), subhead 20px Inter below,
 primary CTA button below subhead. 100vh, low scroll velocity.
Headline (verbatim): "See the price your team actually pays — in 8 seconds"
Subhead (verbatim): "Quotes by team size. No 'contact sales' detours."
Primary CTA (verbatim): "Get my team's price"
Asset: slot `hero-image` — `growth/pricing/hero.webp`. Calibrated still-life
 of pricing receipt, brand primary as subtle accent. If file missing,
 render placeholder per Section 2 rule.
Motion: Fade-up entrance (stagger 0.1s, ease-out, 240ms) for headline →
 subhead → CTA. Static after entrance.
Conversion gates: 4-U 4/4, primary CTA in viewport at load, 6-logo customer
 grid below CTA in scroll distance.

Section 2: Segmented Social Proof
[continues per architecture...]

[... all sections...]

DO NOT
- Use glass, frost, or transparent overlay surfaces (anti-glass sacred —
 brand/DESIGN.md)
- Modify or paraphrase the tagline
- Use these words anywhere: leverage, unlock, seamlessly, robust, cutting-edge
- Use generic CTAs: "Submit", "Click Here", "Learn More"
- Invent or substitute asset URLs (use declared paths; render placeholders
 per Section 2 rule for missing files)
- Add a 3rd primary CTA (one primary, one secondary, zero tertiary)

OUTPUT
- Single index.html, all CSS inline in <style>, all JS inline in <script>
- External: only the 3 CDN libraries above
- Responsive: 390 / 768 / 1024 / 1440 (mobile-first)

Write production-ready, flawless code. Do not truncate. Do not use
placeholder copy or invented imagery (asset placeholders only follow the
Section 2 rule).
\`\`\`

---

## Claude Design (`claude-design`)

**Tool:** Anthropic's design assistant at claude.ai/design (or Claude with computer-use for design tools)

**Format:** Natural-language prompt, ~120–180 lines

**Structure:**

```
[1. Page identity + hypothesis — 3–5 lines]

[2. Brand block — palette tokens, type tokens, surface, motion tokens. pattern-derived.]

[3. Architecture summary — section list with one-line purpose each. Reference brief.md for full ASCII.]

[4. Per-section blocks — for each section:
 - Section name + purpose
 - Recommended copy (headline / subhead / CTA) — verbatim
 - Asset reference with file path
 - Layout notes (column structure, type tokens used)
 - Trust signal positioning
]

[5. DO NOT block — sacred elements + voice forbidden vocabulary. Verbatim.]

[6. Output expectation — single layout, multiple variants, code, etc.]
```

**Lift verbatim:**
- Sacred elements
- Voice forbidden vocabulary + preferred phrases
- All recommended copy slots
- Asset file paths

**Compress:**
- Hypothesis (claim + 1-line bet, not full 3Q)
- Architecture (ref brief.md for full ASCII; summary list inline)
- Audit findings (1–2 lines on what's being closed)

**Common failures:**
- Prompt too long (>250 lines) → Claude Design loses focus
- Sacred elements paraphrased → drift in output
- Copy presented as "ideas" instead of "use this verbatim" → Claude Design rewrites

**Example skeleton:**

\`\`\`
Build a landing page for /pricing targeting engineering managers at 10–50 person teams.

Hypothesis: Right-size proof leads — segmenting proof by team size lifts conversion ≥15% on small-team traffic.

BRAND
- Palette: #004700 primary, #74B36B accent, #F5F4EE warm-neutral background
- Type: Geist Sans display (--font-geist-sans), Inter body (--font-inter)
- Surface: matte (no glass, no frost, no transparent overlays)
- Motion: ease-out, duration-md (240ms) for fade-up; static for decision moments

ARCHITECTURE (5 sections)
1. Hero — first-impression gate
2. Segmented social proof — three columns by team size
3. Features — 4 rows, benefit-led
4. Objection — "is this overkill for small teams?" addressed directly
5. CTA block — primary action moment

SECTION 1 — HERO
Headline (verbatim): "See the price your team actually pays — in 8 seconds"
Subhead (verbatim): "Quotes by team size. No 'contact sales' detours."
Primary CTA (verbatim): "Get my team's price"
Asset: growth/pricing/hero.webp — calibrated still-life of pricing receipt
Layout: Headline 64px Geist Sans, subhead 20px Inter, CTA primary button (#004700 bg)
Trust signal in viewport: 6-logo customer grid below CTA

[... per section...]

DO NOT
- Use glass, frost, or transparent overlay surfaces (anti-glass sacred)
- Modify or paraphrase the tagline
- Use these words anywhere: leverage, unlock, seamlessly, robust, cutting-edge
- Use "Submit" / "Click Here" / "Learn More" CTAs (use first-person action verbs)
- Include a 3rd primary CTA (one primary; one secondary; zero tertiary)

OUTPUT
Single desktop + mobile layout per section. Use the design system tokens above.
\`\`\`

---

## Pencil MCP (`pencil`)

**Tool:** Pencil MCP (`mcp__pencil__*` tools — works on.pen files, encrypted)

**Format:** High-level brief, ~60–100 lines. Pencil generates the `batch_design` operations itself.

**Structure:**

```
[1. Document goal — what kind of.pen file (LP / single section / asset)]

[2. Section list with layout intent per section]

[3. Tokens — palette + type, named or hex]

[4. Copy blocks — verbatim per slot]

[5. Asset references — file paths]

[6. Sacred / forbidden — compact bullet list]
```

**Lift verbatim:**
- Sacred elements (compact list)
- Copy per slot
- Asset paths

**Compress:**
- Architecture rationale (Pencil doesn't need the why)
- Per-CP reference rationale
- 4-U scoring detail

**Common failures:**
- Including operation syntax (`I("parent", {...})`) — let Pencil generate, not the brief
- Over-specifying layout — Pencil's strength is layout decisions
- Missing tokens — Pencil falls back to defaults

---

## Figma (`figma`)

**Tool:** Figma file build, often consumed by a designer post-spec

**Format:** Structured spec, ~200–400 lines (designer reads frame-by-frame)

**Structure:**

```
[1. Project — page slug, file naming convention]

[2. Page setup — frame sizes (desktop 1440, tablet 1024, mobile 390), grid system]

[3. Tokens — palette tokens with hex + variable name, type tokens with size/weight/line-height/letter-spacing]

[4. Component library references — button variants, card variants, input variants. Reference Auto Layout settings.]

[5. Per-frame blocks (one per section):
 - Frame name + purpose
 - Layout grid (cols, gutter, padding)
 - Typography tokens used
 - Color tokens used
 - Component instances + variants
 - Copy verbatim
 - Asset placement (file path or instance reference)
]

[6. Variants — desktop / tablet / mobile differences per frame]

[7. Sacred + voice — non-negotiable callout]
```

**Lift verbatim:**
- All copy slots
- Sacred elements
- Voice forbidden vocab
- Token names + values

**Compress:**
- Hypothesis (1-line in cover frame)
- Audit context (1 paragraph max)
- 4-U / PAS / CP rationales (designer doesn't need them; they're in brief.md if asked)

**Common failures:**
- Inventing token names not in DESIGN.md → designer creates ad-hoc tokens
- Skipping mobile variants → designer guesses
- Component variants not specified → designer picks defaults that may violate sacred

---

## Human Designer (`designer`)

**Tool:** A human designer working in their preferred tool (Figma, Sketch, Adobe XD, code-first)

**Format:** Narrative + structured spec, ~150–300 lines

**Structure:**

```
[1. The why — hypothesis, audience, what we're betting (~5 lines, narrative)]

[2. The audit context (Route B only) — what's broken, what we're fixing (~3 lines)]

[3. Brand non-negotiables — sacred elements, voice rules, surface language (verbatim)]

[4. Architecture — section list with purpose; ASCII diagram or link to brief.md]

[5. Per-section spec — copy verbatim, layout intent, asset references, type/color tokens]

[6. Reference inspiration (optional) — links to brand/inspiration/]

[7. Pre-flight checklist for the designer — sacred respected, voice clean, copy verbatim, asset paths used]
```

**Lift verbatim:**
- Sacred elements
- Voice rules
- Copy slots
- Asset paths

**Compress:**
- 3Q rubric detail (designer cares about the bet, not the framework)
- CP rationale (uses IDs only — they can read brief.md if curious)

**Common failures:**
- Burying sacred elements at end → designer misses them
- Hypothesis without why → designer optimizes wrong dimension
- No reference imagery → designer's taste fills the gap (may not match brand)

---

## Choosing the Format

The **Implementation Prompt** is always emitted — every brief writes `handoff-implementation.md` regardless of `target_handoff`. Coding agents are the universal default executor.

`target_handoff` selects **additional** specialty hand-offs alongside the implementation prompt. If single value, write one extra block. If list, write one per target.

**Specialty selection logic** (in addition to always-on implementation prompt):
- Project uses Claude Design (claude.ai/design) for visual comps → add `claude-design`
- Project uses Pencil MCP for `.pen` design files → add `pencil`
- Human designer working in Figma → add `figma` + `designer` (Figma for spec, designer for narrative)
- Solo founder, no designer, pure code-first → implementation prompt only (no extras)

**Companion files** at `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/`:
- `brief.md` — main artifact (always)
- `handoff-implementation.md` — coding-agent prompt block (always)
- `handoff-claude-design.md` — Claude Design block (if `claude-design` in target_handoff)
- `handoff-figma.md` — Figma spec (if `figma` in target_handoff)
- `handoff-designer.md` — narrative for designer (if `designer` in target_handoff)
- `asset-slots/*.md` — per-asset generative prompts (per slot, written by `brief-graphic` or future media-briefing agents)

## Cross-Format Rules

- **Sacred elements always verbatim, always near the end.** Reader should hit them last; they're the constraints they take into execution.
- **Voice forbidden vocab always verbatim.** No "avoid corporate-sounding language" — give the actual list.
- **Copy slots always presented as "use this verbatim" not "consider this".** The candidates were rubric-scored upstream; the recommended is the recommended.
- **Asset references always include file paths.** "Hero image" tells nothing; `growth/pricing/hero.webp` is actionable.
- **Quality gates always concrete.** "Looks good" is not a gate. "Headline matches brief verbatim" is.

## Anti-Patterns

- **One block for all targets** — fails all of them. Pick one per block.
- **Pasting brief.md verbatim** — defeats compression. Format-specific compression is the value-add.
- **Inventing format conventions** — if the target tool has docs, follow them. Reference: target's official docs > this catalog > intuition.
- **Skipping sacred / voice for brevity** — these are the most important parts. If you cut anything, cut the rationale, not the rules.
