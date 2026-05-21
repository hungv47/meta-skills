# Banner Brief — Agent Skills (single merged banner)

> **For:** PaperMCP / Paper Desktop. Workflow — generate the background landscape with an
> image-gen model, then compose the design layer in Paper.
> **Output:** `assets/banners/forsvn-skills.png` (overwrites the stale merged banner).
> **Status:** ready to execute.

---

## 1. Goal

The stack used to ship as four plugins, each with its own banner (`research` = earth/roots,
`marketing` = water, `product` = fire, `meta` = sky). v2.0 merged everything into **one**
`meta-skills` plugin — 39 skills, 4 domains. We need **one banner** to replace all of them.

This banner is the GitHub README header. It should read as the *canonical evolution* of the
old set, not a reset — so it stays in the FORSVN visual system: the keyboard-geometry mark,
a two-line Playfair headline, a JetBrains Mono subline, a bottom-right breadcrumb, over a
photographic Vietnamese highland-forest landscape. Forest is FORSVN's sacred landscape; using
it for the merged banner says "this is the whole system" without a word.

---

## 2. Canvas spec

| Property | Value |
|---|---|
| Dimensions | **2400 × 1350 px** (16:9) — current banners are 1456×816; size up for retina |
| Format | PNG, sRGB |
| File | `assets/banners/forsvn-skills.png` (overwrite) |
| Target weight | ≤ 2.5 MB |
| Display context | GitHub README header — renders at ~860 px wide; the headline must stay legible there |

---

## 3. Step 1 — Background landscape (image-gen model)

A photorealistic Vietnamese highland forest. The one hard compositional rule: **the left third
must be a calm, dark, low-detail zone** — that is where the headline sits. Light and detail
build toward the right.

**Primary prompt (paste-ready):**

> Photorealistic cinematic photograph of a misty Vietnamese Central Highlands forest at early
> morning. Tall slender tree trunks and a dense, layered canopy of deep green leaves recede
> into soft fog. Volumetric god-rays of warm sunlight stream diagonally through the canopy
> from the upper-right corner, catching drifting mist. The left third of the frame sits in
> deep, soft-focus shadow — dark, calm, low in detail — while light, depth and texture build
> toward the right. Rich, saturated deep-forest-green color grade (anchored around hex
> #004700) with cool shadows and a single warm light source. Shot on a full-frame cinema
> camera, 35mm lens, shallow depth of field, fine natural grain. Wide 16:9 cinematic framing,
> eye-level. Mood: precise, calm, atmospheric — engineered nature.

**Negative prompt:**

> text, watermark, signature, letters, people, person, animals, wildlife, birds, buildings,
> structures, roads, paths, neon colors, oversaturated HDR, glowing edges, lens-flare
> artifacts, dirt on lens, cartoon, illustration, painting, 3d render, tilt-shift, heavy
> vignette

**Settings & knobs**

- Generate at **16:9** natively if the model supports an aspect param; otherwise generate
  wide and crop — never warp.
- Make 3–4 variations. Pick the one where (a) the left third is genuinely dark and quiet and
  (b) the brightest area / light source does **not** land where the headline goes.
- Tunable: light = `early morning` ↔ `late golden hour` (warmth); rays = `soft diffused light`
  ↔ `strong dramatic light shafts`; fog = `light haze` ↔ `heavy fog`.

---

## 4. Step 2 — Composition in Paper

**Layer stack (bottom → top):**

1. Background landscape — full-bleed, cover-fit, centered. No distortion.
2. **Left scrim** — linear gradient rectangle, full height. Ink `#0C1211` at ~88% opacity at
   x=0, fading to 0% at x≈1250 (≈52% width). Guarantees headline contrast regardless of the
   generated image.
3. **Bottom scrim** — subtle. Ink `#0C1211`, 0% → ~40% over the bottom ~180 px. For breadcrumb
   legibility.
4. FORSVN logo mark — top-left.
5. Headline line 1 — "Agent".
6. Headline line 2 — "Skills".
7. Subline.
8. Breadcrumb — bottom-right.

**Layout (reference values on the 2400 × 1350 canvas — nudge to optical taste):**

| Element | Position | Spec |
|---|---|---|
| Logo mark | x=150, y=110 | 132 × 132 px, ~30 px corner radius |
| "Agent" | left edge x=150, baseline ≈ y=610 | Playfair Display **Italic**, cap-height ≈190 px, Mist `#F4F6F5` |
| "Skills" | left edge x=150, baseline ≈ y=815 | Playfair Display **Regular** (upright), cap-height ≈190 px, Signal Lime `#B7FF6E` |
| Subline | left edge x≈158, top ≈ y=905 | JetBrains Mono Medium, ~36 px, tracking +2%, Neutral-200 `#D0D6D2` |
| Breadcrumb | right-aligned to x=2250, baseline ≈ y=1258 | JetBrains Mono, ~24 px, UPPERCASE, tracking +8%, Neutral-400 `#8A9690` |

Headline left edge, subline, and logo mark all align to the **same left margin (x≈150)**.

---

## 5. Typography

| Role | Font | Source |
|---|---|---|
| Headline italic ("Agent") | Playfair Display Italic | `_biz-ops/brand/forsvn/font/PlayfairDisplay-Italic.ttf` |
| Headline upright ("Skills") | Playfair Display Regular | Google Fonts (free) |
| Subline + breadcrumb | JetBrains Mono | Google Fonts (free) |

Playfair Display is the only display face — do not substitute another serif. No drop shadows,
glows, or bevels on any text: type stays flat and the scrim does the contrast work.

---

## 6. Color

| Token | Hex | Used for |
|---|---|---|
| Deep Forest | `#004700` | Color-grade anchor of the landscape; logo mark tile |
| Signal Lime | `#B7FF6E` | "Skills" word + logo glyph **only** |
| Ink | `#0C1211` | Scrims |
| Mist | `#F4F6F5` | "Agent" word |
| Neutral-200 | `#D0D6D2` | Subline |
| Neutral-400 | `#8A9690` | Breadcrumb |

**Hard rule — Signal Lime ≤ 10% of surface area.** Only the word "Skills" and the mark's glyph
carry lime. Nothing else. The subline and breadcrumb are neutral, never lime.

---

## 7. Logo mark

The FORSVN keyboard-geometry mark: a rounded-square tile, Deep Forest `#004700` fill, with the
angular Signal Lime `#B7FF6E` glyph. Source: `_biz-ops/brand/forsvn/logo/logo.svg`
(or `logo.png`, 1080×1080). Place at top-left, crisp, not scaled past 1:1 of its source detail.

---

## 8. Exact text content

Copy verbatim.

```
Headline line 1:  Agent
Headline line 2:  Skills
Subline:          39 skills · 4 domains · one stack
Install command:  $ npx skills add hungv47/meta-skills
Breadcrumb:        — FORSVN / AGENT SKILLS
```

The install command sits in a subtle terminal chip below the subline — the `$` prompt is
Signal Lime, the rest Mist. The subline separator is a middle dot ` · ` (U+00B7).

---

## 9. Build sequence in Paper

1. New frame, 2400 × 1350 px.
2. Place the generated landscape, cover-fit, full-bleed.
3. Draw the left gradient scrim (§4, layer 2), then the bottom scrim (layer 3).
4. Place the FORSVN mark top-left.
5. Add "Agent" (Playfair Italic) and "Skills" (Playfair Regular, Signal Lime) as two text
   layers, left-aligned to x≈150.
6. Add the subline (JetBrains Mono) below the headline.
7. Add the breadcrumb (JetBrains Mono, uppercase) bottom-right.
8. Run the acceptance checklist, then export PNG to `assets/banners/forsvn-skills.png`.

---

## 10. Acceptance checklist

- [ ] Background is a photorealistic forest, 16:9, no text / people / animals / buildings.
- [ ] Left third reads as a calm dark zone; the brightest area does **not** overlap the headline.
- [ ] Headline contrast ≥ 4.5:1 against its local background; legible at ~860 px display width.
- [ ] "Agent" is Playfair **Italic**; "Skills" is Playfair **upright** in Signal Lime.
- [ ] Subline text is exactly `39 skills · 4 domains · one stack`, JetBrains Mono.
- [ ] Breadcrumb is exactly `— FORSVN / AGENT SKILLS`, bottom-right.
- [ ] FORSVN mark top-left, crisp, correct colors.
- [ ] Signal Lime total surface ≤ 10% (only "Skills" + the glyph).
- [ ] Background not stretched or warped to fill the frame.
- [ ] Exported PNG, 2400 × 1350, ≤ 2.5 MB, at `assets/banners/forsvn-skills.png`.

---

## 11. Anti-patterns — do not

- Place the headline over the bright / busy right side of the image.
- Recolor the forest to neon or push HDR — keep it natural, graded toward `#004700`.
- Use Signal Lime for the subline or breadcrumb (breaks the ≤10% rule and the hierarchy).
- Stretch or distort the background to reach 16:9 — crop instead.
- Add drop shadows, glows, or bevels to text — flat type only.
- Swap Playfair Display for another serif.
- Add a tagline or marketing copy — the only text is headline + subline + install command + breadcrumb.

---

## 12. After shipping

Once `forsvn-skills.png` is regenerated, the four domain banners are obsolete and removable:
`research-skills.png`, `marketing-skills.png`, `product-skills.png`, `meta-skills.png`
(plus the unused `assets/banner.png`). Their inline references in `README.md` have already
been removed in the same change set as this brief.
