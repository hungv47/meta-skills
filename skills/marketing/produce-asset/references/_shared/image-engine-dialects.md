<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Image-Engine Dialects + Composition Craft — speak the engine, compose the frame

**The depth `produce-asset` narrates.** A render-ready prompt that only carries the
brief's spec (aspect, copy, tokens) is *faithful* but *generic* — it transcribes without
knowing how the bound engine actually behaves or how a frame is composed. This file is the
engine intelligence + composition craft the prompt-author injects; the skill cites it
instead of inlining (per-skill body budget). Pair with `references/render-engines.md` (what
turns a prompt into pixels + the headless floor) and `references/realized-surface-grounding.md`
(the surface the dialect references).

> **Snapshot, not scripture — engines drift fast.** Param spellings move every release
> (Midjourney v7 → v8.x, OpenAI `gpt-image-1`, Imagen 4). This teaches the *dialect concepts*
> + a current-syntax snapshot (verified 2026-06). **Verify the exact flag/param names against
> the engine's live docs before a run; never block a render on a flag that moved.** The
> concepts (literalness vs beautification, style-vs-subject reference, text-in-image
> reliability, prompt-rewrite behavior) are stable; the spellings are the snapshot.

---

## What a strong prompt carries beyond fidelity

1. **Engine dialect** — speak the engine's real controls *and* know its failure modes
   (above all: which engines can render legible in-image text and which cannot).
2. **Composition craft** — the brief's safe zones are *intentional negative space for copy*,
   not crop margins; a focal hierarchy ranks elements; the brand accent is reserved for the
   focal point / CTA, not sprayed.

Fidelity (the critic's original 7 gates) keeps the prompt from lying. Dialect + composition
are what make the rendered asset *good*. Both are now required (critic gates 8–9).

---

## Per-engine dialect

### Midjourney (v7 current; v8.x emerging)

- **Model / aspect:** `--v 7` (verify current default); `niji` for anime. `--ar w:h`.
- **Literalness vs beautification (the brand knob):** `--style raw` strips MJ's automatic
  aestheticization → closer prompt + brand adherence; use it whenever brand discipline
  matters. `--stylize` / `--s` (0–1000, default 100) trades prompt-adherence for "prettier";
  keep it **low** for brand-literal production.
- **Exploration knobs (keep low for on-brand work):** `--chaos` / `--c` (0–100),
  `--weird` / `--w` (0–3000).
- **Style reference → realized surface:** `--sref <url|seed>` + `--sw` (style weight 0–1000,
  default 100) carries color / mood / lighting / rendering from a reference image **without
  copying its subject**. This is the direct hook for realized-surface grounding — pass the
  cited surface as `--sref`.
- **Subject / object lock:** `--oref <url>` + `--ow` (omni-weight 0–1000, default 100) — v7
  omni-reference (superseded v6 `--cref`); locks a specific product, logo-bearing object, or
  character across a series. Note `--stylize`/`--exp` *compete* with omni-weight: raise `--ow`
  when stylize is high or the reference won't hold.
- **Negative:** `--no <thing>`. **Cost / iteration:** `--q`; Draft Mode for fast cheap passes.
- **Text-in-image: weak — treat as a liability.** Improving but unreliable for precise copy.
  Convention: quote literal copy (`headline reading "Ship the loop"`) **and** prefer
  typesetting copy as a separate layer over the rendered base, **or** route copy-critical
  slots to `gpt-image-1` / Imagen / the headless floor. Flag in the prompt when copy
  legibility is load-bearing.

### OpenAI — `gpt-image-1` (current) · DALL·E 3 (legacy-but-common)

- **`gpt-image-1`:** the current OpenAI image model — natively multimodal, strong
  instruction-following, and **the best in-image text rendering of the three families**. API:
  `size` (`1024x1024` · `1536x1024` · `1024x1536` · `auto`), `quality` (`low|medium|high`),
  `background` (`transparent|opaque`), accepts input images for edit/compose. **Prefer for
  copy-heavy slots and transparent-background composited elements.**
- **DALL·E 3:** auto-rewrites/expands the prompt. To hold copy + composition, prefix
  `I NEED a prompt used verbatim: …`. Sizes `1024x1024` · `1792x1024` · `1024x1792`;
  `quality: hd|standard`; `style: vivid|natural` (**`natural` for brand-restrained**). Text
  rendering inconsistent — same typeset-separately caution as Midjourney.

### Google — Imagen 4 (Vertex AI / Gemini API) · Gemini 2.5 Flash Image ("Nano Banana")

- **Imagen 4:** natural-language prompt + an `aspectRatio` enum (`1:1` · `3:4` · `4:3` ·
  `9:16` · `16:9`) — **no flag dialect**. `generationConfig` carries `negativePrompt`,
  `sampleCount`, `aspectRatio`, output size (1K/2K), `addWatermark` (SynthID). Strong
  photorealism + improved text. **Craft note:** an LLM prompt-enhancement runs **on by
  default** — *disable it for exact prompt/brand control* (it can drift a disciplined brief;
  it mainly helps short prompts).
- **Gemini 2.5 Flash Image ("Nano Banana"):** conversational generate-and-edit with strong
  subject/scene consistency across edits + good text — the Google option for **iterating on a
  realized surface by reference**. (A connected `nano-banana-pro` engine is the same
  Gemini-family dialect.)

### The always-available floor — headless HTML + `@font-face`

- **Deterministic, not a model.** For typography-led / copy-exact / brand-locked slots, author
  the asset as self-contained HTML using `DESIGN.md` tokens + the brand `@font-face` block,
  then screenshot at target aspect → **pixel-exact copy + exact hex**. Full contract +
  font-on-disk prerequisite: `references/render-engines.md`. **Default for copy-critical OG /
  social cards**, where model-rendered text is a liability.

---

## Choosing the engine per slot (decision shortcuts)

| The slot needs… | Reach for | Why |
|---|---|---|
| Pixel-exact / legible copy | Headless HTML, or `gpt-image-1` / Imagen 4 | Never use Midjourney as a typesetter |
| To match a realized surface's look | MJ `--sref` the surface, or Gemini edit-by-reference | Style transfer without subject copy |
| A specific product/logo object held across a series | MJ `--oref` + high `--ow` | Subject lock, not style lock |
| A photoreal hero, no literal copy | MJ (`--style raw` for brand-literal) or Imagen 4 | Best photoreal + brand restraint |
| A transparent-bg or composited element | `gpt-image-1` (`background: transparent`) | Native alpha output |

When the session is **tool-agnostic** (no bound engine), the prompt-author writes a
renderer-agnostic body **plus** a per-engine hints table covering at least Midjourney /
OpenAI / Imagen — not a single stub line.

---

## Composition craft (engine-agnostic — every prompt names these)

1. **One focal subject.** Rank elements by size / contrast / placement (focal hierarchy);
   one thing wins the eye first.
2. **Place the focal point** on a rule-of-thirds intersection (or deliberate dead-center for
   an OG card's symmetry).
3. **Compose the safe-zone voids.** The brief's safe zones are *intentional negative space*
   that holds copy — design *around* them; never crop critical content into them.
4. **Leading lines / gaze** direct attention toward the CTA.
5. **Figure-ground contrast** carries the brief's contrast floor — it's compositional, not
   only a color value.
6. **Reserve the brand accent** for the focal point / CTA; brand discipline is *restraint*,
   not saturation.
7. **Depth + balance:** fore / mid / background separation; balance visual weight across the
   frame.

---

## How `produce-asset` consumes this

- The **prompt-author** writes (a) an **Engine Dialect** block tuned to the bound
  `tool_targets.image` — or, tool-agnostic, the per-engine hints table above — and (b) a
  **Composition** note naming the focal hierarchy + which safe-zone void holds which copy
  string.
- The **Realized-Surface Anchor** (now a required prompt section) feeds the dialect: the cited
  surface becomes the `--sref` / reference-image / Gemini edit base. No surface available →
  the explicit fallback line is recorded (never silent), per
  `references/realized-surface-grounding.md`.
- The **critic** checks **presence + specificity** (a named composition strategy + a
  non-stub dialect block for the bound engine), *not* taste — falsifiable, consistent with the
  critic's no-vibes stance.
