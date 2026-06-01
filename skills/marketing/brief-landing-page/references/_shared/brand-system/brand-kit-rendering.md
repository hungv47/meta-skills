<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Brand-Kit Rendering — Derivative Board Spec
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: REFERENCE
---

# Brand-Kit Rendering — Derivative Board Spec

> Visual-agent emits a brand-kit board *spec* (panel composition, visual mode, logo concept, mockup discipline) AND ready-to-paste image-generation prompts. The board is **derivative** of `brand/BRAND.md` + `brand/DESIGN.md` + `brand/ASSETS.md` — never a source of truth, never a place to introduce new brand decisions.
>
> Output path: `brand/artboards/[board-name]/spec.md` + `prompts.md`. The rendered images (if produced) live alongside; they are not canonical and do not get versioned with BRAND/DESIGN.

A brand kit is not decoration. It is a **visual argument** for why the brand exists, expressed as a curated sequence of panels. A weak board is loud everywhere. A strong board has rhythm — quiet panels, functional panels, atmospheric panels, technical panels.

This file defines the rules for producing that argument *derivatively* from a brand spec that already exists.

---

## Hard Gates — Read First

1. **Brand spec must exist.** `brand/BRAND.md` + `brand/DESIGN.md` must be present and critic-PASS before any board is spec'd. If either is missing, return `NEEDS_CONTEXT` — do not infer brand decisions from the board prompt.
2. **No new brand decisions in the board.** Color, type, logo concept, voice modes must all trace to the existing spec. If a panel would introduce a new color, new font, or a new logo variant, **stop** and route the decision back to visual-agent's primary output (which updates DESIGN.md), not the board.
3. **Existing logo assets are reused.** If `brand/logo/logo-full.svg` exists, the board references it. If it doesn't, the board uses a placeholder rectangle labeled "logo: [concept name]" — never a hallucinated final mark.
4. **Boards live under `brand/artboards/`.** Never inside `brand/BRAND.md` or `brand/DESIGN.md`. Never as exported asset masters in `brand/logo/` or `brand/imagery/`. Round-tripping board renders into the spec corrupts the source (anti-patterns.md #13).
5. **One strong idea per board.** If the operator wants 3 ideas, that's 3 boards, not 1 board with 3 directions stapled together.

---

## The One-Board Visual Argument

Every board, regardless of layout, must answer five questions in its composition:

1. **What does this brand represent?** — covered by the cover panel + tagline panel
2. **What is the core metaphor?** — covered by the construction / system panel
3. **How does the logo express that?** — covered by the cover + construction panels
4. **How does the system scale across UI, print, image, and detail?** — covered by digital + physical + image panels
5. **Why does the whole thing feel ownable?** — covered by the cumulative rhythm + restraint

If a panel cannot be defended against one of those five questions, the panel is decoration. Cut it or replace it.

---

## Logo Concept Methods (5)

Pick **one** primary method per board. Combining two is allowed but rare — most strong marks use one cleanly. Source the method choice from `brand/BRAND.md` → Brand Mark + Archetype + Product-Specific Brand Sections.

### M1. Monogram + meaning

Combine the brand initial(s) with a metaphor that maps to the product's core action or character. Strong monograms use negative space, geometric cuts, folds, or stroke modulation — not just a letter in a circle.

- **When to use:** Brand has a short, distinctive name (1-2 syllables, distinctive initial). Product category is broad enough that a literal symbol would feel reductive.
- **Construction panel shows:** Underlying grid, the cut/fold logic, and the meaning the geometry carries.
- **Risk:** Boring letter-in-shape. Mitigation: the geometry has to carry meaning — not just hold the letter.

### M2. Product action

Turn the product's primary user action into a symbol. *Build* becomes scaffold/frame/cursor; *protect* becomes shield/boundary/watch; *convert* becomes switch/transformation; *speak* becomes wave/pulse; *automate* becomes loop/handoff.

- **When to use:** Product action is singular and clear. Audience already names the action consistently.
- **Construction panel shows:** The literal action → reduced symbol path (action → metaphor → mark).
- **Risk:** Literal-mindedness — a wrench for a tool, a brain for AI. Mitigation: reduce until the symbol is abstract enough to feel like a mark, not an icon.

### M3. Metaphor fusion

Combine two meaningful ideas into one reduced mark. The fusion must be subtle enough to read as a single shape on first glance, with the second meaning revealed on closer look.

- **When to use:** Brand sits at an intersection — security + speed, automation + craft, voice + intelligence, compliance + warmth.
- **Construction panel shows:** The two source ideas → fusion process → final mark.
- **Risk:** Stacking metaphors until the mark reads as neither. Mitigation: cap at two; the fusion must be readable in 1 second.

### M4. Negative space

Use empty space to carry the meaning — a hidden arrow, a protected center, a cutout initial, an eye formed by overlapping shapes, a path implied by absence.

- **When to use:** Brand promise rewards close attention (security, productivity, craft tools). The reveal-on-second-look is a brand experience.
- **Construction panel shows:** The shape, the cut, and the revealed meaning. Often a 3-step diagram.
- **Risk:** Negative space that's just decoration with no hidden meaning. Mitigation: if removing the cut doesn't damage the meaning, the cut isn't doing work.

### M5. Construction geometry

The mark itself is a system: a clear set of primitives (circles, diagonals, modular blocks, measured strokes) that compose into a logo *and* into the visual system around it (icon grid, layout rhythm, illustration system).

- **When to use:** Brand is technical, modular, or system-native (developer tools, design systems, infrastructure). The construction *is* the differentiator.
- **Construction panel shows:** The primitives, the rules, the resulting mark, and ideally one variant produced by the same rules.
- **Risk:** A mark that's all system, no soul. Mitigation: the construction must produce a mark with a center of gravity — not just a logical output.

---

## Board Structures (2 defaults)

### 3×3 — Full identity system (default)

Nine panels, evenly weighted in grid but unevenly weighted in *loudness* and *function*. Aim for the rhythm described under §"Panel Rhythm."

| # | Panel | Job |
|---|---|---|
| 1 | Logo cover | Large mark + wordmark, strong negative space, almost no text. Sets the temperature. |
| 2 | Logo construction | Grid / geometry / negative-space logic / before-after. Shows the *why*. |
| 3 | Digital application | Browser chrome, app header, terminal frame, dashboard fragment, or app icon — one surface, well-cropped. |
| 4 | Brand essence (tagline) | One short tagline at large size, quiet background. Maximum 7 words. |
| 5 | Color system | Swatches, gradient strip, palette cards, or material chips. Repeats the brand's accent logic. |
| 6 | Typography | Type specimen, alphabet row, or display + body pairing. One word at size, not a paragraph. |
| 7 | Physical application | Card, folder, badge, poster, label, packaging, or branded object — one piece, well-shot. |
| 8 | Image direction | Cinematic landscape, product crop, halftone treatment, editorial scene, or texture closeup. |
| 9 | System detail | UI chips, input bar, command line, icon row, badge system, component strip, or pattern detail. |

### 2×3 — Cinematic mini-deck

Six panels, fewer constraints, better for boards meant to be shared as a preview rather than a full system.

| # | Panel | Job |
|---|---|---|
| 1 | Logo / wordmark | Centered or offset, extremely minimal. |
| 2 | Browser / product surface | Browser bar, app frame, prompt input, or URL field. |
| 3 | Command / functional | Terminal, prompt bar, install command, dashboard fragment. |
| 4 | Atmosphere / image | Halftone landscape, cinematic image, product-world visual, or art-directed photo. |
| 5 | Symbol / construction | Mark in target, seal, geometric frame, or icon construction. |
| 6 | Tagline / promise | One short line, large type, quiet background. |

### When to deviate

Allowed deviations: `2×2` compact concept board, `1×3` horizontal strip, `4×2` contact-sheet, custom on operator request. **Never deviate without naming the job each panel does** — the matrix above is the lens, not the limit.

---

## Panel Rhythm

A board with nine panels at the same volume reads as flat. Strong boards alternate registers:

- **Quiet** (cover, tagline, large type) — empty-space dominant, almost no detail
- **Functional** (digital application, system detail) — UI fragments, controlled density
- **Emotional** (image direction) — atmosphere, mood, brand world
- **Technical** (construction, system) — diagrams, geometry, measured detail
- **Atmospheric** (image, physical) — texture, material, light
- **Detail** (chips, badges, micro-elements) — small precise objects

Visual-agent's board spec assigns one of these registers to each panel and verifies no two adjacent panels carry the same register.

---

## Visual Mode Menu (8)

A visual mode is a **menu choice based on the brand's strategy** — not a house style. Visual-agent picks one (rarely two adjacent) based on the archetype + product category in BRAND.md. The mode shapes palette discipline, mockup type, image direction, and texture choices for the entire board.

| Mode | When to use (category + archetype) | Palette posture | Anti-pattern |
|---|---|---|---|
| **Dark Developer / Builder** | Dev tools, infra, AI builders, coding agents. Archetypes: Creator, Magician, Sage. | Near-black + 1 cool accent (cyan/lime) | Generic terminal aesthetic without product-specific UI |
| **Dark Product / Operator** | Sales tools, growth tools, automation, productivity. Archetypes: Hero, Ruler, Magician. | Black + amber/red + 1 muted accent | Loud "ops dashboard" with fake data overload |
| **Dark Nature / Calm System** | Strategy, wellness, climate, quiet premium SaaS. Archetypes: Sage, Caregiver, Explorer. | Deep green + lime accent + fog gray | Stock-photo nature imagery; calm = beige |
| **Dark Security / Threat** | Security, compliance, monitoring, network. Archetypes: Ruler, Caregiver, Sage. | Black/navy + red OR blue alert + muted | Crosshairs + shield clipart; threat-theater |
| **Light Editorial / Compliance** | Legal, privacy, compliance, trust, documents. Archetypes: Sage, Ruler, Innocent. | Warm ivory + deep blue/red/gold accent | Stock paper textures; "official" without restraint |
| **Luxury** | Beauty, fashion, hospitality, premium services. Archetypes: Lover, Ruler, Innocent. | Ivory / stone / espresso + 1 metallic | Forced "elegance"; serif-on-cream without substance |
| **Voice / Communication** | Voice AI, chat, assistants, speech, audio. Archetypes: Caregiver, Sage, Lover. | Dark indigo + lilac glow + warm white | Generic mic icon; purple-blue AI glow default |
| **Cultural / Experimental** | Music, creative tools, events, cultural products, gaming-adjacent. Archetypes: Jester, Outlaw, Creator. | Bold accent + halftone + analog texture | Loud-for-its-own-sake; chaos as a strategy |

**Rule:** Mode is selected once per board and held. Mixing modes ("luxury developer tool") requires explicit justification in the board spec and a Cold Start confirmation — most "mixed" boards are actually one mode poorly executed.

---

## Text Discipline

Boards fail on too much text more often than on too little. The text budget per board is **small** and **deliberate**.

**Allowed text:**
- Brand name (1×, on cover)
- One tagline (1×, max 7 words)
- One URL or command (optional, 1×)
- 2-5 section labels (small, gray, peripheral)
- Short UI chips (3-5 words each, max 6 per panel)

**Forbidden text:**
- Body paragraphs
- Tiny fake body copy (lorem ipsum, scrambled text)
- Long menu lists
- Dense feature explanations
- Unreadable labels under 6px equivalent

Text should be **either** large enough to read at thumbnail size, **or** small enough that nobody tries to read it (label-level, peripheral). Nothing in between.

---

## Color Discipline

The board palette is the BRAND.md palette. **No new accent colors at the board level.** The discipline is in proportion and repetition.

**Rules:**
- One dominant color (background / primary surface) — used in 5+ panels
- One primary accent — used in 3-5 panels at specific moments (logo color, CTA, chip)
- One secondary accent (optional) — used in 1-2 panels for contrast
- Neutrals everywhere
- **No random rainbow.** If the brand palette has 5 colors, the board uses 5 colors, in their declared proportions.
- **No generic purple-blue AI glow** unless the strategy demands it (Voice mode, Creator-led AI assistant). It is a tell.

**Verification:** Pull the palette from `brand/DESIGN.md` Color System. Every color used on the board must appear there. If a board needs a color that's not in DESIGN.md, route the gap back to visual-agent (which updates DESIGN.md) — do not introduce the color in the board.

---

## Mockup Discipline

Mockups on a brand-kit board are **identity applications**, not feature demos.

**Allowed mockups:**
- Browser chrome with URL bar (one tab, one URL, one heading)
- Terminal window with one command + one line of output
- App icon (clean, no extra UI around it)
- Phone corner crop showing one screen, not the whole device
- Card stack, badge, seal, folder, label, packaging
- UI chips, input bar, dashboard fragment (small slice, not full screen)
- Product label or branded physical object

**Forbidden mockups:**
- Full fake dashboards with rows and rows of fabricated data
- Glossy 3D device renders with reflections and shadows from stock libraries
- Multi-device stacks (phone + tablet + laptop + watch in one panel)
- Busy app screens with 20+ UI elements
- Excessive icon rows that read as decoration

**Test:** If the mockup looks like a product screenshot more than a brand artifact, it's the wrong choice. Mockups should feel curated — closer to a magazine ad's product crop than to a marketing site's hero shot.

---

## Image Direction

Images on the board come from the BRAND.md / DESIGN.md image direction. The board spec **selects** from that direction; it does not invent a new one.

**Use:**
- Cinematic landscape with brand overlay
- Halftone or grain treatment on photography
- Material closeup (paper, glass, metal, fabric)
- Architectural or atmospheric scene
- Dark product closeup with directional light
- Texture / abstract pattern controlled by the brand system

**Avoid:**
- Generic stock people in offices
- Cliché robot / AI imagery
- Random "diverse team" stock
- Overbusy collage scenes
- Imagery unrelated to the brand metaphor

**Verification:** Every image panel cross-references `brand/DESIGN.md` § Imagery & Iconography. If the direction isn't established there, route the gap back to visual-agent.

---

## Premium Detail Vocabulary

Strong boards reward close looking with small precise details. **Use sparingly** — 2-4 of these on a full 3×3 board, not all of them.

- Page numbers (`01 / 09`)
- Footer labels (`identity system · v1`)
- Alignment marks / crosshairs (corner registration)
- Construction lines on the logo panel
- Thin rules separating sections
- Browser bar with a believable URL
- Image masks with rounded corners
- Soft shadow under one card
- Low-opacity texture overlay
- Halftone treatment on one image
- One highlighted word or accent chip
- One strong icon state (selected, active)

**Rule:** Detail rewards looking closer. If a viewer counts more than 6 small "premium details" on a 3×3 board, the board is over-designed.

---

## Reference Usage

When the operator provides reference boards or moodboards to inform the visual:

**Extract (allowed):**
- Layout rhythm
- Grid density
- Typography scale
- Negative-space proportion
- Logo placement
- Text/image ratio
- Accent-color logic
- Detail vocabulary

**Do not copy (forbidden):**
- Exact logo marks
- Exact compositions
- Exact taglines
- Unique brand-identifying assets
- Brand names

References teach the **quality bar** — restraint, rhythm, presentation logic. They are not templates. Boards that copy reference compositions verbatim fail the critic and route back to visual-agent.

---

## Output Contract

Visual-agent emits, per board:

### File 1: `brand/artboards/[board-name]/spec.md`

```markdown
---
board: [board-name]
layout: [3x3 | 2x3 | other]
visual-mode: [from the 8-mode menu]
logo-method: [M1 | M2 | M3 | M4 | M5]
status: spec
canonical: false
---

# [Board name] — Brand-Kit Spec

## Source spec
- BRAND.md: [version pin]
- DESIGN.md: [version pin]
- ASSETS.md: [version pin if Route B]

## Visual mode
[Selected mode + 1-line rationale tied to archetype]

## Logo concept
- **Method:** [M1-M5]
- **Reduced idea:** [1-2 sentences]
- **Construction notes:** [grid / cut / fusion / negative-space / system logic]

## Panel composition
| # | Panel | Register | Content | Source spec ref |
|---|---|---|---|---|
| 1 | [name] | quiet/functional/emotional/technical/atmospheric/detail | [what's in it] | BRAND.md §X / DESIGN.md §Y |
| ... |

## Palette
[Verbatim from DESIGN.md, with proportional notes]

## Text plan
[Brand name placement, tagline (verbatim from BRAND.md), labels, chips]

## Detail vocabulary used
[2-4 items from the Premium Detail Vocabulary list]
```

### File 2: `brand/artboards/[board-name]/prompts.md`

One image-generation prompt per panel (9 for 3×3, 6 for 2×3). Each prompt:

- Names the visual mode
- Pins the palette (verbatim values from DESIGN.md, OKLCH + hex)
- Specifies the panel's job and register
- References the logo method (so all panels' logo treatments stay consistent)
- Names mockup/image discipline rules from this file
- Explicitly forbids generic AI-glow / stock people / lightning bolts unless the strategy calls for them

```markdown
## Panel 1 — Logo cover

**Mode:** [mode]
**Background:** [exact color from DESIGN.md]
**Composition:** Large [logo concept] centered, generous negative space, no text other than wordmark.
**Logo treatment:** [from logo-method + DESIGN.md logo rules]
**Forbidden:** [3-5 specific anti-patterns relevant to this mode]

[Final prompt as ready-to-paste text — about 3-5 sentences, includes palette values + composition + mode + forbiddens.]
```

---

## Anti-Patterns

1. **Brand decisions invented at the board layer.** New color, new font, new logo variant introduced because "it looks good on the board." Boards are derivative. Route the decision to visual-agent → DESIGN.md instead.
2. **Generic AI-glow palette.** Purple-blue gradient applied to every panel because "it looks tech." Tell. Use only when Voice mode + relevant archetype.
3. **Dense fake UI mockups.** Full dashboard panels with fabricated rows and fake data. The board reads as a feature demo, not a brand artifact.
4. **Copied reference compositions.** Reference moodboard panel arrangement reused verbatim. Quality is the lesson; composition is not.
5. **Stock-template board.** Looks like a downloaded slide template — equal panel weights, no rhythm, generic detail vocabulary, no logo concept rationale.
6. **Random rainbow palette.** Board uses colors not in DESIGN.md because the panels needed "variety." Variety comes from rhythm, not from palette inflation.
7. **Too many premium details.** Page numbers + alignment marks + construction lines + halftone + browser bars + chips on every panel. Detail stops being detail when it's everywhere.
8. **Logo without concept panel.** Cover panel shows the logo, no construction panel justifies it. The board is decoration with a logo on it.
9. **Mockup overload.** Every panel is a mockup. No quiet panels, no construction panel, no atmosphere. Reads as a portfolio shot, not an identity system.
10. **Boards saved into `brand/BRAND.md` or `brand/DESIGN.md`.** Round-tripping renders into the spec. Always under `brand/artboards/`.

---

## Cross-references

- `references/visual-identity.md` — logo system rules (variations, clear space, minimum sizes) that the board must honor.
- `references/artboard-generation.md` — Paper MCP artboard production (the *rendering* path; this file is the *spec* path).
- `references/ai-slop-detection.md` — slop checklist runs on board output the same way it runs on visual-agent output.
- `references/anti-patterns.md` — pattern #13 (round-tripping renders into spec) is the canonical version of anti-pattern #10 above.
- `agents/visual-agent.md` — Domain Instructions § Brand-Kit Board Output names this file as the contract for board specs + prompts.
- `agents/critic-agent.md` — Quality Gate Checklist (Brand-Kit Board subsection) wires the FAIL gates that consume this file's hard gates and anti-patterns.
