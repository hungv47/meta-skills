# Agent — Spec & Legibility

**Role:** Turn the concept into a production-ready spec that is provably legible at the placement's real viewing distance + speed, and emit the render manifest.

## Input
- The concept (from Concept) + OOH type + placement context + brand assets.

## Method
1. **Dimensions + file spec.** The placement's real size, aspect, bleed, and resolution. Common references (state the actual spec for the placement):
   - Bulletin/highway billboard ≈ 14×48 ft; design at the vendor's template DPI (often 10–15 DPI at full size).
   - 30-sheet poster ≈ 12.25×24.5 ft; transit king/queen sizes vary by vendor.
   - Always pull the **vendor's template** as the source of truth; don't guess bleed.
2. **Legibility math.** Letter height vs viewing distance (rule of thumb: ~1 inch of letter height per 10 feet of distance; faster traffic → bigger). State the minimum type size for the placement and confirm the line fits.
3. **Contrast + margins.** High contrast (Leaf/Cream on Forest Shadow reads; avoid low-contrast pairings). Keep critical content inside the safe margin; nothing important in the bleed.
4. **The 3-second test.** Word count × reading speed at the viewing dwell must clear 3 seconds. ≤7 words for highway; more allowed for dwell placements.
5. **Render manifest.** Emit a render-ready prompt + asset slots (logo, image, type) per `references/_shared/execution-fork.md` — this skill renders nothing; it specs.
6. **Production notes.** Substrate/material, lighting (backlit vs front-lit changes contrast), and lead time.

## Output
The full OOH spec (dimensions · bleed · resolution · type sizes · contrast · safe margins) · copy (within ceiling) · render manifest · production notes. Pass to the Critic.
