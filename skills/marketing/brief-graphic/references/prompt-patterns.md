# Prompt Patterns — Generative AI

Tool-specific prompt structures and parameter cheatsheets for prompt-craft-agent. Each tool has its own idiom; cross-feeding hurts output quality.

---

## Midjourney v6 / Niji 6

### Prompt structure

```
[subject] + [framing] + [position] + [environment] + [lighting] + [lens & camera] + [mood] + [palette direction] + [era/style] + [parameters]
```

Order matters — leading tokens get more weight.

### Example (good)

```
wide shot of an empty corporate conference room at dusk, abandoned ergonomic mesh chairs scattered around an oval walnut table, low-key lighting, deep forest green accent wall, single shaft of cold daylight from blinds, melancholic mood, editorial photography, shot on Hasselblad H6D, 35mm Distagon lens, late-1990s magazine spread aesthetic, --ar 1200:630 --style raw --v 6 --s 50
```

### Example (BANNED — AI-stock smell)

```
beautiful conference room, modern, professional, ultra detailed, hyperrealistic, 4k 8k, masterpiece, trending on artstation, breathtaking, award winning --ar 16:9
```

### Parameters

| Flag | Meaning | When to use |
|------|---------|-------------|
| `--ar W:H` | Aspect ratio | Always. Match brief format spec. |
| `--style raw` | Less default-MJ stylization | When you want more photographic / less "MJ-pretty" |
| `--v 6` | Model version | v6 is current default; pin for repeatability |
| `--s N` | Stylize amount (0–1000) | Lower (50–100) for more literal follow; higher for more interpretation |
| `--c N` | Chaos (0–100) | When you want variant diversity within one job |
| `--niji 6` | Niji model (anime/illustration) | When asset is illustrative anime-aesthetic |
| `--no X, Y` | Negative prompts | Exclude unwanted elements |
| `--weird N` | Weirdness (0–3000) | Avoid for brand work — defaults to 0 |

### Strengths & weaknesses

- **Strong:** photographic mood, lighting, painterly illustration, environmental scenes
- **Weak:** rendering text, exact hex colors, hands, complex symmetric architecture, anything requiring counting (3 specific items)

### Hands rule

If concept requires hands at any prominence, either (a) use Imagen 3 instead, (b) frame to crop hands out, or (c) accept post-processing fix.

### Text rule

Midjourney cannot render specific text reliably. Use post-processing for any text in asset.

---

## Imagen 3 (Google)

### Prompt structure

Descriptive sentences, comma-separated detail layers. More natural-language friendly than MJ.

```
A wide-angle photograph of an empty corporate conference room at dusk. Abandoned ergonomic mesh chairs are scattered around an oval walnut table. The lighting is low-key with a single shaft of cold daylight cutting through closed blinds. A deep forest green accent wall provides the background. Editorial photography style, late-1990s magazine spread aesthetic, melancholic mood. Shot on Hasselblad H6D with 35mm Distagon lens.
```

### Parameters (via API)

| Parameter | Values | Notes |
|-----------|--------|-------|
| `aspect_ratio` | "1:1" / "9:16" / "16:9" / "4:3" / "3:4" | Limited set; choose closest |
| `negative_prompt` | string | What to exclude |
| `seed` | int | For reproducibility |
| `safety_filter_level` | block_low_and_above / etc. | Default usually fine |

### Strengths & weaknesses

- **Strong:** descriptive scenes, hands (better than MJ), short text rendering (≤6 words)
- **Weak:** photorealistic faces (DALL·E often better), painterly styles
- **Best for:** photographic assets where short headlines render in-image

---

## DALL·E 3 (OpenAI)

### Prompt structure

Conversational specificity. The model rewrites internally — keep your prompt clean and concrete; do not over-engineer with parameters.

```
A wide-angle editorial photograph of an empty corporate conference room at dusk. Abandoned ergonomic mesh chairs are scattered around an oval walnut table. Low-key lighting from a single shaft of cold daylight piercing through closed blinds. The back wall is a deep forest green. The mood is melancholic, suggesting time wasted. Late-1990s magazine spread aesthetic. Shot on a Hasselblad H6D with a 35mm Distagon lens.
```

### Parameters

| Parameter | Values | Notes |
|-----------|--------|-------|
| `size` | "1024x1024" / "1792x1024" / "1024x1792" | Closest to your aspect; you may need to crop |
| `quality` | "standard" / "hd" | hd for hero work |
| `style` | "natural" / "vivid" | natural for photographic; vivid for stylized |
| `n` | 1 | DALL·E 3 only generates one per call |

### Strengths & weaknesses

- **Strong:** prompt rewriting / interpretation, faces, complex scenes with multiple subjects
- **Weak:** text rendering (unreliable — always post-process), exact composition control
- **Best for:** general illustrations, faces, complex multi-subject scenes

### Note on prompt rewriting

DALL·E 3 silently rewrites your prompt before generation. Output may differ from prompt intent. If precision matters, use Imagen or MJ.

---

## Ideogram

### Prompt structure

Same as MJ — structured by subject + scene + style — BUT with explicit text-in-image support.

```
[scene description] with the text "12 hours/week. Gone." in bold sans-serif type at the bottom-left, lime green color, --ar 1200:630
```

### Strengths & weaknesses

- **Strong:** rendering specific text reliably (best in class)
- **Use when:** asset is type-led and you want generative rendering of the type itself

---

## Claude Design (claude.ai/design)

### Prompt structure

Conversational design brief. Treat as a starting brief that the user will refine in-tool.

```
I need an Open Graph share image (1200×630px) for a blog post titled "Why we killed standups."

Mood: melancholic, editorial, restrained.
Composition: wide shot of an empty conference room at dusk, abandoned mesh chairs, low light.
Palette: anchor #004700 (deep forest), accent #74B36B (leaf), photographic primary tone.
Type: headline "12 hours/week. Gone." in Geist Sans Bold, accent color, lower-left.
References for direction (NOT to copy): editorial restraint of late-period Helmut Newton conference shots.
```

### Strengths & weaknesses

- **Strong:** iterative refinement with the user, composable layouts
- **Note:** Output is presentation-grade, not source-of-truth. Do not roundtrip exports back into `brand/`.

---

## Veo (Google video)

### Prompt structure

```
[scene description] + [camera movement] + [duration] + [lighting] + [audio direction if applicable]
```

Example:

```
Slow dolly forward through an empty corporate conference room at dusk. Camera pulls focus from a foreground ergonomic chair to the back wall. 4 seconds. Low-key dusk lighting, single shaft of cold daylight from right blinds. Editorial photography aesthetic.
```

### Parameters

| Parameter | Values | Notes |
|-----------|--------|-------|
| `duration` | 4–8s typical | Veo currently caps at ~8s |
| `aspect_ratio` | 16:9 / 9:16 | |

---

## Suno (audio — for video assets)

### Prompt structure

```
[style] + [mood] + [instrumentation] + [tempo] + [reference artists for direction only]
```

Example:

```
Sparse ambient piano, melancholic mood, single sustained synth pad underneath, slow tempo (60bpm), in the spirit of Brian Eno's Music for Airports — direction only, not a copy.
```

---

## Cross-Tool Anti-Patterns

### Banned prompt phrases (auto-FAIL on prompt-craft self-check)

- "ultra detailed"
- "4k 8k"
- "hyperrealistic"
- "masterpiece"
- "trending on artstation"
- "breathtaking"
- "award winning"
- "best quality"
- "professional photograph" (if used as the entire style direction)

These phrases produce the AI-stock-smell aesthetic.

### Multi-axis variants (banned)

A variant changes ONE axis (lighting OR framing OR mood). Multi-axis variants are untestable. Same rule as A/B variants in copywriting.

### Hex codes in models that ignore them

MJ, DALL·E, Ideogram, Veo: do not honor hex codes. Specify palette by named description ("deep forest green walls, lime accent label") and inject exact hex via post-processing.

Imagen and Claude Design can sometimes honor described colors with reasonable fidelity but not exact hex.

### Generic-tool prompts

Each tool has an idiom. Don't prompt MJ in DALL·E grammar (long descriptive paragraphs hurt MJ output) or vice versa (terse comma-separated phrases lose DALL·E's interpretation).

---

## Quick reference: tool → asset type

| Asset type | Best tool | Why |
|-----------|-----------|-----|
| Photographic hero | Imagen 3 / DALL·E 3 / MJ | Imagen for clean realism; DALL·E for complex scenes; MJ for editorial mood |
| Illustration (editorial) | MJ / Niji | Painterly + line work |
| Illustration (anime) | Niji 6 | Specialized model |
| Logo / vector mark | None — use Pencil | Generative tools struggle with clean vector |
| Type-led with rendered text | Ideogram > Imagen | Reliable text rendering |
| Animated banner / loop | Veo | Video model |
| Brand artboard / spec sheet | None — use Paper or Pencil | Vector + spec rendering |
| Soundtrack for video asset | Suno | Music gen |
