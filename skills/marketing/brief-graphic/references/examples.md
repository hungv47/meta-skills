# Worked Examples

End-to-end runs of design-brief across all four downstream routes. Used as anchors for orchestrator behavior and agent sanity checks.

> **Status note (2026-05-04):** This file pre-dates the design-create → design-brief re-scope and still depicts the legacy model where the skill *rendered* assets via Pencil / Paper MCP. In the new model, design-brief produces a brief and the rendering happens downstream — the user runs the image-gen tool, opens Pencil themselves, or hands the spec to a designer.
>
> Route name translation:
> - Old `Route P` → new `image-gen` downstream-route (the example still shows what the brief delivers; the user runs MJ themselves)
> - Old `Route PE` → new `vector-tool` downstream-route (brief delivers a Pencil-ready layout spec; user runs Pencil)
> - Old `Route PA` → deprecated (Paper-render path removed; if the asset is a brand-system artboard extension, treat it as `vector-tool` with Paper conventions noted in the brief, or invoke create-brand directly)
> - Old `Route F` → new `designer-handoff` downstream-route (unchanged in spirit)
>
> Rebuilding these examples to match the brief-only model is part of the design-brief follow-up build pass. Use them for orchestration intent, not as literal scripts.

---

## Example 1 — OG Image (Route P)

**User request:** "Create an OG image for the blog post 'Why we killed standups'"

### Step 0: Pre-Dispatch

- BRAND.md present: forsvn brand, archetype "restrained editorial."
- DESIGN.md present: Deep Forest #004700, Leaf #74B36B, Geist Sans display, no glass.
- ASSETS.md row matches: `brand/og/blog/standups-killed.png — 1200×630 — [ ]`
- Route auto-selected: **P** (photographic concept fits asset-type table).

### Layer 1 (parallel)

**Brand-anchor-agent output:**
- Palette: primary-anchor #004700, accent #74B36B, surface #FAFAFA, text-on-primary #FFFFFF
- Typography: display-l = Geist Sans Bold 96px (for overlay headline)
- Sacred respected: logo white at 60px height, bottom-right, 60px from edges
- Voice: forbidden — leverage / unlock / seamlessly / robust; preferred — concrete numbers
- Anchor score: 5/5

**Concept-agent output:**

| Axis | A. Empty meeting room | B. Time-loss receipt | C. Calendar diff |
|------|----------------------|---------------------|------------------|
| Mode | photographic | typographic | internal |
| Mood | melancholic | factual | clarifying |
| Lead element | environment (room) | type stack | calendar grid |

Each with falsifiable Why. Route feasibility: A=PASS, B=NUDGE (could go PE), C=NUDGE.

**Copy-anchor-agent output:** Headline "12 hours/week. Gone." (from blog title rephrase, voice-checked, 4 words).

### Layer 1.5: Brief Synth

3 candidate briefs presented. **User picks A.**

### Approval Gate 1 → Approved.

### Layer 2P: Prompt-Craft

**Primary prompt (Midjourney v6):**

```
wide shot of an empty corporate conference room at dusk, abandoned ergonomic mesh chairs scattered around an oval walnut table, low-key lighting, deep forest green accent wall, single shaft of cold daylight from blinds at right, melancholic mood, editorial photography, shot on Hasselblad H6D, 35mm Distagon lens, late-1990s magazine spread aesthetic, slight grain, --ar 1200:630 --style raw --v 6 --s 50
```

**Variants:** lighting (dusk → noon), framing (wide → tight).

**Post-processing:**
- Overlay "12 hours/week. Gone." Geist Sans Bold 96px #74B36B bottom-left, 60px from edges
- Overlay logo white 60px height bottom-right, 60px from edges
- Tool: Pencil (`mcp__pencil__batch_design`)

### Layer 3: Critic

| Dimension | Score |
|-----------|-------|
| 1. Brand fidelity | 4/4 |
| 2. Sacred respected | 4/4 |
| 3. Hierarchy | 3/4 |
| 4. Composition | 4/4 |
| 5. Typography | 4/4 |
| 6. Contrast | 4/4 |
| 7. Format fit | 4/4 |
| 8. CTA clarity | N/A |

**Subtotal: 27/28 = 96%** | **AI-aesthetic: 1/15 (clean)** | **Verdict: PASS**

### Approval Gate 2 → User approves.

### Output

`docs/forsvn/artifacts/marketing/design/standups-killed-og/`
- `brief.md` (concept A)
- `prompt.md` (MJ + 2 variants + post-processing)
- `critic.md`
- (After user runs MJ + Pencil overlay) `render.png` saved to `brand/og/blog/standups-killed.png`

Orchestrator detects render path matches ASSETS.md row `brand/og/blog/standups-killed.png` and uses Edit to flip `[ ]` → `[x]` with date stamp inline. Single source of truth for the auto-tick.

**Status: DONE.**

---

## Example 2 — Instagram Carousel (Route PE — Pencil)

**User request:** "8-slide Instagram carousel about our pricing tiers for engineering teams"

### Step 0: Pre-Dispatch

- BRAND.md + DESIGN.md present.
- No ASSETS.md row (campaign-specific).
- Route auto-selected: **PE** (typographic, multi-slide → Pencil).

### Layer 1

**Brand-anchor:** Geist Sans display + body, palette anchor + accent, sacred logo.

**Concept-agent:**
- A. Receipt — typographic, full-bleed receipt with hours/dollars stacked
- B. Calendar — calendar grid showing tier-as-time
- C. Scale — 6 objects representing tier values (key, vault, city), photo

User picks **A**. (B = also good; C = re-route to P.)

**Copy-anchor:** 8 slides of copy from `docs/forsvn/artifacts/marketing/content/pricing-tiers.md` (content-create produced earlier).

### Layer 1.5: Brief Synth

Brief A:
- 8 slides @ 1080×1350 px, PNG export
- Slide 1: title "How we price engineering time" (display-l)
- Slides 2–7: tier rows with hours/cost stacked
- Slide 8: CTA "See your tier →" with arrow

### Approval Gate 1 → Approved.

### Layer 2PE: Pencil-Render

```
mcp__pencil__get_editor_state
mcp__pencil__open_document("new")
mcp__pencil__set_variables({ "primary": "#004700", "accent": "#74B36B", "surface": "#FAFAFA" })
mcp__pencil__batch_design([8 frames, each 1080x1350, populated])
mcp__pencil__get_screenshot
```

### Layer 3: Critic

Subtotal 26/28 = 92%, AI-aesthetic 0/15. PASS.

### Approval Gate 2 → User approves with one revision request: "Tighten slide 5 CTA size."

Layer 2PE re-dispatched with feedback. Re-critic. PASS. Approved.

### Output

`docs/forsvn/artifacts/marketing/design/pricing-tiers-carousel-ig/`
- `brief.md`
- `render.pen`
- `critic.md`
- (User exports from Pencil) `slides-1-8.png`

**Status: DONE.**

---

## Example 3 — Brand-Guideline Artboard Extension (Route PA — Paper)

**User request:** "Add an artboard for our new icon style to the brand guideline doc"

### Step 0

- Existing brand-system Paper artboards live in `brand/`.
- ASSETS.md row exists: `brand/icons/icon-style-artboard.html — 1440×900 — [ ]`
- Route auto: **PA** (extends brand-system Paper pattern).

### Layer 1

**Brand-anchor:** stroke weight, fill rules, source library (Lucide), forbidden glyphs.

**Concept:** A. Grid of icon variants. B. Icon + spec annotations. C. Before/after showing icon evolution.

User picks **B**.

### Layer 1.5

Brief with sections: Header, 12-icon grid, per-icon spec annotations, anatomy callouts.

### Approval Gate 1 → Approved.

### Layer 2PA: Paper-Render

`get_font_family_info` confirms Geist Sans available. `write_html` calls per content group, each respecting Paper conventions:
- flex-only
- inline-only
- hex-only
- no margins (gap on parent, padding on children)

Saved to `docs/forsvn/artifacts/marketing/design/icon-style-artboard/render.html`. **NOT** roundtripped into `brand/`.

### Layer 3: Critic → PASS.

### Approval Gate 2 → Approved.

User reviews and manually copies the rendered artboard into `brand/icons/icon-style-artboard.html` (their decision, not the skill's).

**Status: DONE.**

---

## Example 4 — Print Billboard (Route F — Figma handoff)

**User request:** "Design a billboard for our hero campaign — 14×48 ft"

### Step 0

- Print spec: ≥300dpi CMYK, billboard dimensions.
- Route auto: **F** (print-grade requires designer; generative + Pencil insufficient).

### Layer 1

**Brand-anchor:** print color profile = CMYK swatches mapped from RGB DESIGN.md tokens.

**Concept-agent:**
- A. Single bold typographic statement, ≤7 words
- B. Photo + minimal text overlay
- C. Two-color illustration with iconic mark

User picks **A**.

**Copy:** "Waiting is a trap. Move forward." (sacred tagline — verbatim).

### Layer 1.5: Brief Synth

- Dimensions: 4032×1152 px @ 7dpi viewing distance (or as printer specifies)
- Bleed: per print spec
- CMYK: C100 M50 Y100 K50 for dark green; lime accent C20 Y100
- Type: Geist Sans Bold massive scale; readability at 100m driving distance

### Approval Gate 1 → Approved.

### Layer 2F: Figma-Spec

Produces `figma-spec.md` with:
- Frame setup, layer tree, per-layer specs
- CMYK swatches with token names
- Export settings: PDF, CMYK, 300dpi reference (low-DPI for billboard scale)
- Sacred elements verbatim
- Hand-off notes for production designer
- Validation checklist

### Layer 3: Critic → PASS on spec quality (designer will execute).

### Approval Gate 2 → Approved. Spec handed to designer.

### Output

`docs/forsvn/artifacts/marketing/design/hero-billboard/`
- `brief.md`
- `figma-spec.md`
- `critic.md`

**Status: DONE_WITH_CONCERNS** — concerns: "execution quality depends on designer; verify final proofs against spec before printing."

---

## Patterns across examples

1. **Approval gates always honored.** Three of four examples had user iteration at one gate or another. The skill is interactive by design.
2. **Brand digest is the constraint.** Every concept and brief is bounded by brand-anchor's pull.
3. **AI-aesthetic detector caught zero in these examples** — but the design discipline (specific lens/lighting/era language, not "4k 8k masterpiece") is what kept scores low.
4. **Hybrid Route P + PE is common.** OG images especially: generate photo, overlay type. The skill handles this as "Route P with post-processing notes" rather than spawning two separate routes.
5. **ASSETS.md auto-tick** when paths match — the skill enriches brand-system's production inventory automatically.
