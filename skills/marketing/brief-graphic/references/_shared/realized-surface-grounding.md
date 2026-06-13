<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Realized-Surface Grounding — design against what shipped, not just the tokens

**The contract every visual brief follows before it specs an asset.** Brand tokens
(`DESIGN.md`) and art direction (`CREATIVE-DIRECTION.md`) describe the *rules*. A
**realized surface** is a place those rules were already executed well — the live site,
a shipped page, an approved exploration. Tokens are the floor; the realized surface shows
the actual taste. **Brief against the realized surface; let tokens be the floor, not the
ceiling.**

Skills cite this file instead of inlining the rule (same contract for all; inlining blows
the per-skill body budget).

---

## Why this exists

A brief built from token docs alone produces a technically-on-brand, generically-executed
asset — correct palette, wrong soul. The realized surface is where the brand's taste is
*proven*. When a hero or card is redone to match the live landing page (not just the
hexes), it stops looking like stock-AI output. This is the difference between "uses the
brand colors" and "looks like us."

## What counts as a realized surface

In rough order of authority (most authoritative first):

1. **The live/deployed product or marketing site** — the current homepage, the shipped
   landing page, the running app. Highest authority: it's what the world sees.
2. **Shipped, approved page source** — the deployed HTML/CSS for the surface being matched
   (e.g. a `sunset-landing.html`, the OG template that ships).
3. **Approved exploration frames** — design explorations the operator has blessed
   (`explorations/*.jpeg|png`, an approved Figma/Paper frame, a brand-kit board export).
4. **Live exemplars of the same asset type** — the brand's existing OG cards, the last
   on-brand thumbnail, the previous hero — the bar the new asset must at least meet.

A token file, a written mood description, or a not-yet-approved AI render is **not** a
realized surface. The point is to anchor on executed, blessed taste.

## How to pull it

Use whatever the operator already has connected — discover before assuming unavailable:

- **Live URL** → screenshot it (a connected browser/devtools tool, e.g. a
  `take_screenshot` over a navigated page) and read the rendered DOM/CSS for exact
  treatment. Capture at the asset's target aspect when possible.
- **Local HTML** → open/read the file; render it headless for a visual frame when a
  rasterizer or browser tool is available (see `references/render-engines.md`).
- **Exploration image** → read the image file directly.
- **Existing exemplar asset** → read the shipped file from the brand asset folder.

Pulling the surface is cheap and upstream — do it **before** writing the brief's reference
direction, not after the asset is rendered.

## The brief rule (hard step)

Every visual brief includes a **Reference realized surfaces** step that does one of:

- **Cites ≥1 realized surface** actually pulled (path or URL + what was taken from it:
  composition, light, type treatment, density, grading), and designs the concept against
  it; **or**
- **Records the explicit fallback** — `No realized surface available — designing from
  DESIGN.md + CREATIVE-DIRECTION.md tokens only` — naming what was missing. This is the
  honest fallback, recorded in the brief, **never silent.** A brief that quietly designs
  from tokens with no realized-surface line fails the visual-rubric realized-fidelity
  check.

## Where it feeds downstream

- The brief's **reference-direction** section is built from the realized surface, not
  generic adjectives.
- The closing **eval squint-test** (`execution-fork.md` (sibling reference) →
  `evaluate-asset`) scores the rendered asset **against the same realized surface**, not
  only the token list. Same anchor in, same anchor out — that's the closed loop.
