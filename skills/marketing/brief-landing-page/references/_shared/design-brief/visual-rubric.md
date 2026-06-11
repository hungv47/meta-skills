<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Visual Rubric

The 8-dimension scoring rubric used by critic-agent. Each dimension scores 0–4 with explicit criteria per level. Generic-AI-aesthetic detector layered on top scores 0–3 per pattern.

---

## Dimension 1 — Brand Fidelity

**What it measures:** Do the visual decisions trace to BRAND.md and DESIGN.md tokens **and anchor on a realized surface**? Tokens are the floor; the realized surface (live page / shipped HTML / approved exploration / `CREATIVE-DIRECTION.md` art direction) is the executed taste. Per `references/_shared/realized-surface-grounding.md`.

| Score | Criteria |
|-------|----------|
| 4 | Every palette hex and type token used matches DESIGN.md exactly. Sacred elements honored. Voice rules respected if copy is in asset. **Concept is anchored to a cited realized surface** (or the explicit token-only fallback is recorded), and to CREATIVE-DIRECTION.md art direction when present. |
| 3 | One minor deviation (e.g., body weight off by one step, 60px logo height rendered at 56px). Substantive direction matches. Realized surface cited or fallback recorded. |
| 2 | Multiple minor deviations OR one major (wrong primary color, font family substitution); OR designed from tokens only with **no realized-surface line at all** (silent token-only). |
| 1 | Output reads as a different brand entirely. Tokens unrecognizable. |
| 0 | No brand reference visible. Generic AI default aesthetic. |

**Auto-FAIL:** Score <3 on cycle 1 = FAIL re-dispatch. Silent token-only design (no realized-surface line, no fallback) caps this dimension at 2.

---

## Dimension 2 — Sacred Elements Respected

**What it measures:** Did the output preserve every item from BRAND.md's sacred element list?

| Score | Criteria |
|-------|----------|
| 4 | Every sacred element preserved exactly (logo geometry, primary palette anchor, tagline wording, signature treatments). |
| 3 | One non-load-bearing sacred element subtly off (placement 5px wrong, micro-deviation). |
| 2 | A sacred element materially changed (tagline reworded for "punch," primary color drifted, logo distorted). |
| 1 | Sacred element violated structurally (logo redrawn, tagline changed substantively). |
| 0 | Multiple sacred elements broken. |

**Auto-FAIL:** Score <4 on cycle 1 = FAIL re-dispatch. Sacred elements are non-negotiable.

---

## Dimension 3 — Hierarchy

**What it measures:** Does the eye land where the brief specified, in order?

| Score | Criteria |
|-------|----------|
| 4 | Focal point unmistakable in 1-second scan. Secondary supports without competing. Tertiary readable but recedes. |
| 3 | Focal point clear; secondary slightly competes for attention. |
| 2 | Two elements compete for primary attention. Eye flickers between them. |
| 1 | Eye doesn't know where to land. Multiple equal-weight elements. |
| 0 | No discernible hierarchy. |

---

## Dimension 4 — Composition

**What it measures:** Balance, rhythm, intentional negative space.

| Score | Criteria |
|-------|----------|
| 4 | Asymmetric balance via rule of thirds or golden ratio. Negative space used as a positive element. Visual rhythm guides the eye. |
| 3 | Solid composition; minor balance issue or one cramped/sparse zone. |
| 2 | Multiple compositional issues — symmetric-dead, crowded edges, weight imbalance reads as accidental not intentional. |
| 1 | Cramped, busy, or chaotically arranged. |
| 0 | No compositional discipline visible. |

---

## Dimension 5 — Typography

**What it measures:** Pairing, sizing, leading, kerning, letter case.

| Score | Criteria |
|-------|----------|
| 4 | All type follows DESIGN.md scale exactly. Pairing solid (display + body harmonize). Leading tuned to size. Kerning OK at preview size. |
| 3 | One type token off by one step OR leading slightly tight/loose. Substantively correct. |
| 2 | Multiple deviations from type scale OR pairing fights (display and body too similar / clashing weights). |
| 1 | Wrong family substituted somewhere visible. |
| 0 | Default system font where DESIGN.md specifies a brand font. |

**N/A:** `image-gen` pre-overlay (when type is added in post-processing, score on the post-overlay version).

---

## Dimension 6 — Contrast

**What it measures:** WCAG AA compliance on actual text/bg pairs.

| Score | Criteria |
|-------|----------|
| 4 | All text passes WCAG AA — ≥4.5:1 normal text, ≥3:1 large text. Most pairs comfortably exceed. |
| 3 | All text passes AA. Some pairs at minimum (4.6:1) — usable but tight. |
| 2 | One text pair below AA but still readable (3.5–4.4:1 normal text). |
| 1 | One text pair fails AA on critical content (CTA, headline). |
| 0 | Multiple text pairs fail AA. |

**Always uses the contrast ratio measured** (e.g., "headline 7.2:1 — pass; body 3.8:1 — fail").

**N/A:** Output without text overlay yet (`image-gen` pre-post-processing).

---

## Dimension 7 — Format Fit

**What it measures:** Dimensions, safe zones, platform crop behavior, file format/size.

| Score | Criteria |
|-------|----------|
| 4 | Exact spec dimensions, safe zones honored, file format and size within platform caps, color profile correct. |
| 3 | One minor issue (e.g., 1180x1080 instead of 1080x1080) — easily fixed. |
| 2 | Safe zone violated on non-critical area, OR file size 10–20% over cap, OR aspect slightly wrong. |
| 1 | Critical content in unsafe zone (CTA gets cropped), OR wrong aspect for platform. |
| 0 | Wrong dimensions entirely. |

---

## Dimension 8 — CTA Clarity

**What it measures:** Is the call to action readable, action-led, and prominent?

| Score | Criteria |
|-------|----------|
| 4 | CTA readable at preview size. Action verb leads ("See", "Read", "Get"). Visual prominence matches its priority in hierarchy. |
| 3 | CTA readable; action verb present but slightly weak ("Learn more"). |
| 2 | CTA readable but vague ("Click here") OR positioned without prominence. |
| 1 | CTA hard to read at preview size OR no action verb. |
| 0 | No CTA where the brief specified one. |

**N/A:** Asset has no CTA (e.g., OG image, brand artboard).

---

## Dimension 9 — Motion Quality

**What it measures:** Easing, duration, camera moves for video (Veo) or animated assets. N/A for static.

| Score | Criteria |
|-------|----------|
| 4 | Easing curves named in DESIGN.md motion tokens. Duration ≤ brief spec. No uncanny smoothness, no jitter unless intentional. Camera moves have purpose. |
| 3 | Minor easing or duration drift. Substantively correct. |
| 2 | Generic-AI motion smell — impossibly smooth dolly, perfect motion blur (Sora-default), AI-clean parallax. |
| 1 | Motion fights the brand archetype (kinetic-bouncy springs in a restrained brand). |
| 0 | No motion discipline. |

**N/A:** Static assets (photos, vector layouts, type-only).

---

## Dimension 10 — Audio Quality

**What it measures:** Mood, instrumentation, tempo, freedom from AI-vocal artifacts. For Suno-generated soundtracks or audio assets only.

| Score | Criteria |
|-------|----------|
| 4 | Mood + instrumentation + tempo match brief. No vocal artifacts. Loop-safe if used as bed. |
| 3 | One mismatch, fixable in DAW. |
| 2 | AI-vocal smell or generic-Suno melody-default ("the Suno sound"). |
| 1 | Wrong genre / mood for brand archetype. |
| 0 | Unusable. |

**N/A:** Visual-only assets.

---

## "Applicable Dimensions" Rule

When computing the subtotal, **N/A dimensions are dropped from both numerator and denominator** before computing the percentage. Example: 7 applicable dimensions × 4 = 28 max; 27/28 = 96%. Do not apply 0/4 for N/A (would tank the score) or 4/4 for N/A (would inflate it).

---

## Generic-AI-Aesthetic Detector

For each pattern below, score 0–3 (0 = absent, 3 = dominant in the output). Sum is `AI-aesthetic total` out of 39 (13 patterns × 3 max).

| Pattern | 0 | 1 | 2 | 3 |
|---------|---|---|---|---|
| Default purple-blue gradient | Absent | Hint visible | Backgrounded | Dominant |
| Centered isolated subject on white | Absent | Off-center subject with high white | Centered with modest context | Centered, isolated, drop-shadowed |
| Stock 3D / faux-3D bevels | Absent | Subtle dimensional cues | Visible 3D treatment | Inflated-rubber dominant |
| Faux-glass / glassmorphism (uninvited) | Absent (or DESIGN.md-specified) | Light blur on one element | Multiple glass panels | Glass-dominant aesthetic |
| AI-uncanny photo (hands, text, faces) | Absent | One quirk at sub-preview size | Visible at preview | Uncanny detail dominant |
| Corporate Memphis / Alegria flat illustration | Absent | One trope figure | Multiple trope figures | Full Memphis aesthetic |
| Vaporwave default (purple/pink/cyan) | Absent | Hint | Backgrounded | Dominant |
| Generic isometric tech illustration (Storyset/Undraw default) | Absent | One iso element | Multiple iso elements | Full iso scene |
| Neon outlines on dark / "Linear-clone" (uninvited) | Absent | One element | Multiple | Full aesthetic (only applies if DESIGN.md doesn't specify it) |
| Abstract blob shapes (default-decorative) | Absent | One blob | Multiple blobs | internal |
| Sora-smooth motion (uncanny fluidity) — video only | Absent / N/A | Hint of unnatural smoothness | Multiple uncanny moves | Dominant Sora-default fluidity |
| AI-vocal artifacts — audio only | Absent / N/A | Slight artifacting on one phrase | Multiple artifacts | Pervasive artifacts |
| Generic-Suno melody-default — audio only | Absent / N/A | Hint of "the Suno sound" | Substantial | Dominant |

**Threshold (recalibrated for 13 patterns × 3 max = 39):**
- 0–7: Clean — does not block PASS
- 8–15: Concerns — caps verdict at DONE_WITH_CONCERNS
- 16+: Existential failure — auto-FAIL re-dispatch

For asset types where some patterns are N/A (e.g., motion + audio rows on a static image), N/A scores 0 — they contribute nothing to the sum but don't lower the threshold either.

---

## Verdict Logic (replicated from critic-agent)

| Condition | Verdict |
|-----------|---------|
| Subtotal ≥ 80% applicable dimensions × 4 AND AI-aesthetic ≤7 AND no dimension <3 | **PASS** |
| Subtotal 65–79% AND AI-aesthetic ≤15 | **DONE_WITH_CONCERNS** |
| Any dimension = 1 OR AI-aesthetic ≥16 OR Brand fidelity <3 OR Sacred <4 | **FAIL** |
| Cycle = 2 AND would-be-FAIL | **DONE_WITH_CONCERNS** (deliver with concerns; don't infinite-loop) |

---

## Worked Example

**Asset:** OG image, dusk conference room (Midjourney + Pencil overlay)

| Dimension | Score | Notes |
|-----------|-------|-------|
| 1. Brand fidelity | 4/4 | #004700 wall + #74B36B headline accent + Geist Sans Bold all match DESIGN.md tokens |
| 2. Sacred respected | 4/4 | Logo at 60px bottom-right per BRAND.md |
| 3. Hierarchy | 3/4 | Empty room reads first; headline second; logo tertiary. Right-side chair mildly competes. |
| 4. Composition | 4/4 | Subject left third, headline lower-left negative space, balanced |
| 5. Typography | 4/4 | Geist Sans Bold 96px overlaid in Pencil per brief |
| 6. Contrast | 4/4 | Lime on dark green = 7.2:1 (WCAG AAA) |
| 7. Format fit | 4/4 | 1200x630, sRGB, ≤500KB |
| 8. CTA clarity | N/A | No CTA on OG image |

**Subtotal: 27/28 = 96%**

| internal | Score | Evidence |
|--------------|-------|----------|
| Default gradient | 0 | Photo, no gradient |
| Centered isolated | 0 | Wide shot, environmental |
| Stock 3D | 0 | Photo |
| Glassmorphism | 0 | Absent |
| internal | 1 | Slight chair-leg rendering quirk, sub-preview |

**AI-aesthetic total: 1/39 — clean.**

**Verdict: PASS.**
