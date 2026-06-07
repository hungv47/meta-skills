# Brief-Graphic Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Brand-Anchor Agent | 1 (parallel) | `agents/brand-anchor-agent.md` | Pulls relevant tokens, sacred elements, lexicon, motion spec from BRAND.md + DESIGN.md. |
| Concept Agent | 1 (parallel) | `agents/concept-agent.md` | Generates 3 distinct concept directions (mood, composition, references). |
| Copy-Anchor Agent | 1 (parallel) | `agents/copy-anchor-agent.md` | Resolves copy that appears IN the asset (from write-copy artifact or interviews the user). |
| Brief Synthesizer | 1.5 (after L1) | `agents/brief-synth-agent.md` | Merges anchor + 3 concepts + copy into 3 candidate briefs with platform spec, hierarchy, asset slots. |
| Prompt-Craft Agent | 2 (downstream-route: `image-gen` / `template-pack`) | `agents/prompt-craft-agent.md` | Produces image-gen prompts (Claude Design / Midjourney / Imagen / DALL·E / Ideogram / Veo / Suno) for the chosen brief. |
| Figma-Spec Agent | 2 (downstream-route: `designer-handoff`) | `agents/figma-spec-agent.md` | Produces design spec markdown for human designer in Figma. |
| Critic Agent | 3 (final) | `agents/critic-agent.md` | Visual rubric scoring + generic-AI-aesthetic detection + platform-fit check. |

## Downstream routes

Every brief carries a `downstream_route` tag identifying its renderer. Tag drives which optional sub-agent runs after the brief is approved.

| Route | When | Optional Layer 2 agent | Output addition |
|---|---|---|---|
| `image-gen` | Photographic, illustrative, abstract, or compositionally complex. Hero/OG/blog illustrations, ad backgrounds, video thumbnails. | `prompt-craft-agent` | Image-gen prompt + 2 variants |
| `vector-tool` | Vector layouts, UI mockups, branded social templates, multi-format variants, infographics. Pencil/Figma execution. | (none — brief carries vector-tool spec block) | Layout grid spec + token references |
| `designer-handoff` | Executed by human designer in Figma or print shop. Print-grade, OOH, complex composition. | `figma-spec-agent` | Designer-file spec |
| `template-pack` | Multi-format social packs (IG + LinkedIn + X variants of one asset). | `prompt-craft-agent` per format | Per-format prompts in one brief |

Override auto-detection with `--route=image-gen|vector-tool|designer-handoff|template-pack`. Asset-type → default-route auto-detection table: [`asset-types.md`](asset-types.md) § "Auto-Detection".

## Dispatch Graph

```
Step 0.5 Route Detection (asset-type → downstream-route + target_tool + platform module pull)
  ↓
Layer 1 (parallel):
  brand-anchor + concept + copy-anchor
  ↓
Layer 1.5 (after L1):
  brief-synth → 3 candidate briefs
  ↓
Approval Gate 1 (user picks 1 of 3)
  ↓
Layer 2 (downstream-route-dependent):
  image-gen / template-pack → prompt-craft-agent
  designer-handoff → figma-spec-agent
  vector-tool → (none — brief carries vector-tool spec)
  ↓
Layer 3 critic:
  8-dim Visual Rubric + 13-pattern Generic-AI-Aesthetic Detector + platform-fit check
  FAIL → rewrite loop (max 2 cycles)
  ↓
Approval Gate 2 (user approves / requests revisions / rejects)
  ↓
Write artifact + ASSETS.md auto-tick (literal path match)
```

## 8-Dim Visual Rubric

Full rubric + 13-pattern AI-Aesthetic Detector + per-route scoring-mode shifts (designer-handoff route): [`visual-rubric.md`](visual-rubric.md). Max 2 rewrite cycles per critic verdict.

Dimensions:

1. Brand fidelity — palette, typography, motion all trace to DESIGN.md.
2. Sacred elements respected.
3. Hierarchy — clear focal point, scannable in 1 second.
4. Composition — balance, intentional white space.
5. Typography — pairing/sizing/leading consistent with DESIGN.md.
6. Contrast — WCAG AA (≥4.5:1 normal, ≥3:1 large) on its actual background.
7. Platform fit — dimensions, safe zones, platform crop behavior, mobile thumb-stop readability, file format, file-size cap verified against the platform module.
8. Generic-AI-Aesthetic check — full 13-pattern detector. Score 0-3 per pattern (max 39). 0-7 clean / 8-15 DONE_WITH_CONCERNS / 16+ auto-FAIL.

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/asset-types.md` | Step 0.5 Route Detection | Per-asset format specs + auto-detection table. |
| `references/platform-modules.md` | brand-anchor, concept, brief-synth, critic | Per-platform brief checklists. Fully populated — all 18 modules (tranche 1 core-digital + tranche 2 FB feed/story ads, LinkedIn event, YT banner, email-hero, OOH/transit/magazine) carry practitioner-grade specs; volatile ad-chrome / file caps + per-vendor physical specs carry `[verify]` / confirm-media-kit flags. |
| `references/prompt-patterns.md` | prompt-craft | Image-gen prompt structures + tool → asset-type table. |
| `references/visual-rubric.md` | critic | 8-dim scoring + 13-pattern Generic-AI-Aesthetic Detector. |
| `references/failure-modes.md` | critic | Generic-AI catalog + brand drift. |
| `references/examples.md` | concept, brief-synth, critic | End-to-end worked examples per asset type. |
| `references/anti-patterns.md` | critic | Process+gate / Brand+token / Cross-cutting marketing-stack. |

Full mechanics: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
