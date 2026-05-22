# GitHub SVG render spike — TEMPORARY

**Purpose:** verify that GitHub renders animated SVG (CSS keyframes, SMIL, and the
`prefers-color-scheme` / `prefers-reduced-motion` media queries) inside a Markdown
file *before* the animated hero replaces the PNG banner in `README.md`.

**This file is temporary.** Once the spike passes, delete `RENDER-SPIKE.md` and
`assets/banners/render-spike.svg`, then swap the hero into `README.md`.

> View this on GitHub's **rendered Markdown** view (`github.com/hungv47/meta-skills/blob/main/RENDER-SPIKE.md`)
> — that is the same `<img>`-embed + camo-proxy path the production README uses.
> The blob view of a raw `.svg` is a *different* path and is not a valid spike.

---

## 1 · Technique fixture

![GitHub SVG render spike](./assets/banners/render-spike.svg)

Each cell self-reports. Check:

- [ ] **A · CSS @keyframes** — the lime square slides left↔right.
- [ ] **B · SMIL `<animate>`** — the lime dot pulses in size.
- [ ] **C · prefers-color-scheme** — the cell reads `detected: DARK` or
      `detected: LIGHT` and matches your OS appearance (the same signal GitHub's
      auto theme follows).
- [ ] **D · prefers-reduced-motion** — with OS "reduce motion" **off**, the square
      spins and the caption says `motion ON`. With it **on**, the square is still
      and the caption says `motion REDUCED`.
- [ ] Nothing is blank, clipped, or stripped; the SVG renders at all.

If **A** and **C** pass, the production hero is safe — it uses only CSS keyframes
plus those two media queries. **B** (SMIL) is informational: the brief named it,
but production deliberately uses CSS so `prefers-reduced-motion` can gate it.

---

## 2 · Production hero preview

![Agent Skills — system map hero](./assets/banners/forsvn-skills-hero.svg)

This is the exact file that will replace the PNG banner. Check:

- [ ] Renders full-width with no clipping; all three columns visible
      (domains → `.forsvn/` → manifest / loops / review).
- [ ] Lime pulses glide left→right along the connectors.
- [ ] The `.forsvn/` hub has a soft breathing glow.
- [ ] Colours match your GitHub theme (dark = forest + signal-lime; light = cream
      + deep green).
- [ ] With OS "reduce motion" on: motion stops, the static diagram stays legible.

---

## If the spike passes

1. Delete `RENDER-SPIKE.md` and `assets/banners/render-spike.svg`.
2. In `README.md`, replace the banner line with the hero:
   ```diff
   - ![Agent Skills](./assets/banners/forsvn-skills.png)
   + ![Agent Skills — 40 skills across Research, Marketing, Product, and Meta, flowing through .forsvn/ artifacts into manifest, loops, and review](./assets/banners/forsvn-skills-hero.svg)
   ```
3. The old `forsvn-skills.png` becomes unreferenced — keep or remove separately.

## If something fails

Note which cell failed and report back — each failure maps to a specific fix:

| Failure | Fix |
|---|---|
| A (CSS keyframes) stripped | GitHub stripped `<style>`; fall back to SMIL + drop the reduced-motion gate (accept the brief tradeoff). |
| C (color-scheme) wrong/ignored | Drop the light palette; ship a single dark SVG. |
| D (reduced-motion) ignored | Media query unsupported in this path; keep motion but make it slower / lower-amplitude. |
| Whole SVG blank | Path or sanitization issue — check the relative path and re-test with the SVG in `assets/`. |
