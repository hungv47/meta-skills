---
name: brief-graphic
description: "Produces graphic-design briefs for individual visual assets — social posts (IG carousel/post/story, LinkedIn doc/single, FB ad), thumbnails (YouTube, X card), banners/display ads, OOH/billboard, OG/share cards, hero illustrations. Pulls brand-system tokens, generates concept directions, and writes a per-asset brief with platform-aware specs (aspect ratio, safe zones, type scale, contrast, file format, anti-patterns) plus an image-gen prompt or designer-handoff spec. Produces `.forsvn/artifacts/mkt/design-briefs/[slug].md`. Does NOT render the asset — rendering happens downstream via image-gen tool, vector tool, or human designer. Not for brand identity definition (use create-brand) or whole-page redesigns (use brief-landing-page). Not for writing the copy that goes IN the asset (use write-copy)."
argument-hint: "[asset description, e.g. 'instagram carousel about pricing tiers']"
allowed-tools: Read Edit Grep Glob Bash WebSearch WebFetch
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
  budget: standard
  estimated-cost: "$1-2"
  status: done_with_concerns
  notes: "Re-scoped from design-create (brief-only, no rendering). Platform-aware module content for IG/LinkedIn/FB/YT/X/OOH/banner is skeleton-only — needs a follow-up build pass with practitioner-grade specs (aspect ratios, safe zones, mobile type scales, thumb-stop contrast, file conventions, anti-patterns) per platform."
  refactor_history:
    - version: "2.0.0 → 2.0.0"
      date: 2026-05-18
      slot: "v6 Phase 2 Wave 1 — marketing-stack slot 11/14"
      note: "Body 488→~225 (-54%) + 5 new refs (playbook + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics + examples/design-brief-walkthrough) + new anti-patterns.md (7 from body + 4 cross-cutting marketing-stack rows). Structural: `### Artifact Template` nested under new `## Artifact Contract` H2 wrapper per marketing-stack sibling-parity convention (matches campaign-plan slot 10 + ad-copy slot 9 + copywriting slot 8 + cold-outreach slot 7 + humanize slot 6 + vn-tone slot 5 + short-form-brief slot 4 + seo slot 3). `status: done_with_concerns` preserved verbatim (platform-modules.md skeleton-only flagged in metadata.notes — deferred to v6.3.0 follow-up build pass, NOT in scope for body-diet refactor). See references/playbook.md 'History / origin' for full detail."
promptSignals:
  phrases:
    - "design brief"
    - "graphic brief"
    - "asset brief"
    - "create graphic"
    - "design asset"
    - "social graphic"
    - "ad creative"
    - "og image"
    - "hero image"
    - "banner design"
    - "carousel design"
    - "thumbnail"
    - "illustration brief"
  allOf:
    - [design, brief]
    - [graphic, brief]
    - [asset, brief]
    - [create, graphic]
    - [generate, image]
  anyOf:
    - "graphic"
    - "illustration"
    - "carousel"
    - "banner"
    - "thumbnail"
    - "midjourney"
    - "imagen"
    - "dall-e"
    - "claude design"
    - "figma"
    - "ad creative"
  noneOf:
    - "brand identity"
    - "design system"
    - "design tokens"
    - "user flow"
    - "wireframe"
    - "landing page redesign"
  minScore: 6
routing:
  intent-tags:
    - graphic-design-brief
    - visual-asset-brief
    - ad-creative-brief
    - social-graphic-brief
    - og-image-brief
    - thumbnail-brief
    - generative-prompt
  position: pipeline
  lifecycle: pipeline
  produces:
    - .forsvn/artifacts/mkt/design-briefs/[slug].md
  consumes:
    - brand/BRAND.md
    - brand/DESIGN.md
    - brand/ASSETS.md
    - .forsvn/artifacts/mkt/lp-brief/[slug]/asset-slots/*.md
  requires:
    - brand/BRAND.md
    - brand/DESIGN.md
  defers-to:
    - skill: create-brand
      when: "need to define brand identity, logo, palette, or full design system"
    - skill: write-copy
      when: "need craft-quality headline / CTA copy that goes IN the asset"
    - skill: brief-landing-page
      when: "redesigning a whole page, not a single asset"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Design Brief — Orchestrator

*Communication — visual layer. Produces a graphic-design brief for a single visual asset; rendering is downstream.*

**Core Question:** "Could a designer or image-gen tool execute this asset on-brand and on-platform without follow-up questions?"

> Why this skill exists, philosophy, methodology, principles, scope boundary, when NOT to use, what it pulls from elsewhere, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

- **Do NOT render.** This skill produces the brief, not the asset. The brief carries spec + reference direction + image-gen prompt (where applicable). Rendering happens downstream — image-gen (Midjourney / Imagen / DALL·E / Claude Design), vector tooling (Pencil / Figma), or a human designer.
- **Do NOT proceed without brand anchors.** Missing `brand/BRAND.md` or `brand/DESIGN.md` → return `NEEDS_CONTEXT`, recommend running `create-brand` first.
- **Do NOT invent tokens, fonts, or motion specs.** Every visual decision traces to DESIGN.md. If DESIGN.md doesn't cover what's needed (e.g. illustration style), flag it in the brief — don't guess.
- **Do NOT use stock-AI defaults.** No default purple-blue gradients, centered-isolated-on-white, faux-3D bevels, or glassmorphism unless DESIGN.md specifies. Critic scores generic-AI smell explicitly.
- **Do NOT skip the brief approval gate.** The brief is a candidate, not a delivery — user reviews before downstream rendering.
- **Platform spec is mandatory.** Every brief includes aspect ratio, safe zones, mobile readability (type scale, thumb-stop contrast), file format, and file-size limits. See `references/platform-modules.md`.

## Quality Gate

Before delivering, the **critic agent** verifies:
- [ ] Brand fidelity — palette, typography, motion all trace to DESIGN.md
- [ ] Sacred elements respected (no proposed change to logo, primary palette anchor, tagline, etc. unless brief explicitly authorizes)
- [ ] Hierarchy — clear focal point, scannable in 1 second
- [ ] Composition — balance, intentional white space
- [ ] Typography — pairing/sizing/leading consistent with DESIGN.md
- [ ] Contrast — text passes WCAG AA (≥4.5:1 normal, ≥3:1 large) on its actual background
- [ ] **Platform fit** — dimensions, safe zones, platform crop behavior, mobile thumb-stop readability, file format, file-size cap all verified against the asset's platform module
- [ ] CTA clarity (if applicable) — readable at preview size, action verb visible
- [ ] **Generic-AI-aesthetic check — full 13-pattern detector from `references/visual-rubric.md` §"Generic-AI-Aesthetic Detector". Score 0-3 per pattern (max 39). Thresholds: 0-7 clean / 8-15 DONE_WITH_CONCERNS / 16+ auto-FAIL.**
- [ ] Downstream-handoff completeness — image-gen prompt is specific (lens / lighting / mood / era / composition / color cast), or designer spec covers placement/typography/color tokens, or vector-tool spec specifies layout grid

Full 8-dimension Rubric Scores + 13-pattern Generic-AI-Aesthetic Detector + per-route scoring-mode shifts (designer-handoff route): [`agents/critic-agent.md`](agents/critic-agent.md). Max 2 rewrite cycles per critic verdict.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load brand/BRAND.md + brand/DESIGN.md + optional ASSETS.md + check freshness (>60d → soft warning, user can override).

| Artifact | Source | Required? |
|---|---|---|
| `brand/BRAND.md` | brand-system | **REQUIRED** (hard gate) — voice, archetype, sacred elements |
| `brand/DESIGN.md` | brand-system | **REQUIRED** (hard gate) — palette, typography, surface language, motion |
| `brand/ASSETS.md` | brand-system Route B | Optional — auto-fill dimensions, tick checkbox on completion |
| `.forsvn/artifacts/mkt/lp-brief/[slug]/asset-slots/[slot-id].md` | lp-brief | Optional — slot spec when brief is for an LP asset |
| `.forsvn/artifacts/mkt/content/[slug].copy.md` | copywriting | Optional — copy to use in the asset |
| `.forsvn/artifacts/mkt/campaign-plan.md` | campaign-plan | Optional — campaign context, awareness stage |
| `research/icp-research.md` | icp-research | Optional — audience visual preferences |

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]). **Hard gate fires BEFORE cold-start questioning** — missing brand artifacts return NEEDS_CONTEXT, recommend `create-brand`.

**Needed dimensions:** asset type (OG / IG carousel / banner / hero / OOH / etc.), downstream route (image-gen / vector-tool / designer-handoff / template-pack — drives Layer 2), brand reference (auto-resolved by hard gate), copy/headline if any (renders IN the asset), constraints (dimensions, deadline, must-include elements).

Full hard-gate semantics + read order + Warm/Cold Start templates (4-question Cold Start) + 2-row Write-back map + Step 0.5 Route Detection (5 steps including target_tool pick + platform module pull) + `--fast` behavior (hard gate + Cold Start + Step 0.5 + Approval Gate 2 + critic all preserved; Layer 1 collapsed + Approval Gate 1 skipped + critic rewrite-loop disabled): [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — this skill is `budget: standard`; `--fast` flag collapses Layer 1 parallel into single inline pass + Layer 1.5 to 1 brief instead of 3 + skips Approval Gate 1 (no choice to present). **`--fast` does NOT skip** hard gate, Cold Start, Step 0.5, Approval Gate 2, critic-agent, or Generic-AI-Aesthetic Detector (per marketing-skills CLAUDE.md "Safety gates supersede `--fast`").

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Brand-Anchor Agent | 1 (parallel) | `agents/brand-anchor-agent.md` | Pulls relevant tokens, sacred elements, lexicon, motion spec from BRAND.md + DESIGN.md |
| Concept Agent | 1 (parallel) | `agents/concept-agent.md` | Generates 3 distinct concept directions (mood, composition, references) |
| Copy-Anchor Agent | 1 (parallel) | `agents/copy-anchor-agent.md` | Resolves copy that appears IN the asset (from write-copy artifact, or interview the user) |
| Brief Synthesizer | 1.5 (after L1) | `agents/brief-synth-agent.md` | Merges anchor + 3 concepts + copy into 3 candidate briefs with platform spec, hierarchy, asset slots |
| Prompt-Craft Agent | 2 (downstream-route: `image-gen` / `template-pack`) | `agents/prompt-craft-agent.md` | Produces image-gen prompts (Claude Design / Midjourney / Imagen / DALL·E / Veo / Suno) for the chosen brief |
| Figma-Spec Agent | 2 (downstream-route: `designer-handoff`) | `agents/figma-spec-agent.md` | Produces design spec markdown for human designer in Figma |
| Critic Agent | 3 (final) | `agents/critic-agent.md` | Visual rubric scoring + generic-AI-aesthetic detection + platform-fit check |

### Shared References

- **Domain catalogs** (loaded by agents at dispatch): `references/asset-types.md` (per-asset format specs), `references/platform-modules.md` (per-platform brief checklists — skeleton, needs follow-up build pass per metadata.notes), `references/prompt-patterns.md` (image-gen prompt structures + tool → asset-type table), `references/visual-rubric.md` (critic 8-dim scoring + 13-pattern Generic-AI-Aesthetic Detector), `references/failure-modes.md` (generic-AI catalog + brand drift), `references/examples.md` (end-to-end worked examples per asset type)
- **Shared:** `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, anti-sycophancy, shared-critic-rubrics, quality-feedback-protocol, quality-dashboard-spec}.md`

---

## Routing + Dispatch

Every brief carries a **downstream-route** tag identifying its renderer. The tag drives which optional sub-agent runs after the brief is approved.

### Downstream routes

| Route | When | Optional Layer 2 agent | Output addition |
|-------|------|------------------------|------------------|
| `image-gen` | Photographic, illustrative, abstract, or compositionally complex. Hero/OG/blog illustrations, ad backgrounds, video thumbnails. | `prompt-craft-agent` | Image-gen prompt + 2 variants |
| `vector-tool` | Vector layouts, UI mockups, branded social templates, multi-format variants, infographics. Pencil/Figma execution. | (none — brief carries vector-tool spec block) | Layout grid spec + token references |
| `designer-handoff` | Executed by human designer in Figma or print shop. Print-grade, OOH, complex composition. | `figma-spec-agent` | Designer-file spec |
| `template-pack` | Multi-format social packs (IG + LinkedIn + X variants of one asset). | `prompt-craft-agent` per format | Per-format prompts in one brief |

Override auto-detection with `--route=image-gen|vector-tool|designer-handoff|template-pack`.

### Auto-detection (asset type → default downstream route)

| Asset Type | Default Route | Why |
|-----------|--------------|-----|
| OG image / blog hero / ad photo | image-gen | Generative gives photo/illustration diversity |
| Instagram carousel (typographic) | vector-tool | Vector + multi-slide layout |
| Instagram carousel (image-led) | image-gen (per slide) | Generate slides, assemble |
| Instagram post / story | image-gen or vector-tool | Depends on photo vs typographic |
| LinkedIn document post | vector-tool | Multi-slide typographic |
| LinkedIn single-image | image-gen or vector-tool | Depends on photo vs typographic |
| FB / display banner (text-heavy) | vector-tool | Vector text + crop variants |
| FB / display banner (visual-led) | image-gen | Generate visual, overlay text |
| YouTube thumbnail | image-gen | Photo-based + bold text overlay |
| X/Twitter card | image-gen or vector-tool | Depends on photo vs typographic |
| OOH / billboard / print | designer-handoff | Print-grade, needs human designer |
| Email hero | image-gen or vector-tool | Depends on photo vs typographic |
| Hero illustration (custom) | image-gen or designer-handoff | Generative or human-designer |
| Spot icon / decoration | vector-tool | Vector |

Mechanics (how to spawn agents, single-agent fallback, Step 0.5 Route Detection details, Layer 1 parallel + Layer 1.5 brief-synth + Approval Gate 1 with full user-response handling + Layer 2 route-dependent dispatch + Layer 3 critic gate + rewrite loop + Approval Gate 2 with full user-response handling + ASSETS.md auto-tick semantics + chain position + re-run triggers + skill deference): [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Artifact Contract

- **Path:** `.forsvn/artifacts/mkt/design-briefs/[slug].md` (default overwrite on re-run; preserve-history mode renames to `[slug].v[N].md`). Rejected briefs save as `[slug]-rejected.md` (Gate 2 reject); paused-candidate exits save as `[slug]-candidates.md` (Gate 1 stop).
- **Lifecycle:** `pipeline` — re-run on BRAND.md/DESIGN.md update / new ASSETS.md row / lp-brief slot request / campaign launch / render dissatisfaction
- **Frontmatter fields:** `skill`, `version`, `date`, `status`, `downstream_route`, `target_tool` (when image-gen), `asset_type`, `platform`, `dimensions`, `brand_anchors` (primary_color + primary_type + motion), `sacred_respected` (list)
- **Consumed by:** image-gen tools (Claude Design / Midjourney / Imagen / DALL·E / Ideogram / Veo / Suno); vector tools (Pencil / Figma); human designers (Designer-Handoff Spec block); `brief-landing-page` (when invoked from LP asset slot); `brand/ASSETS.md` auto-tick (literal path match)
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter — required fields" + § "Body section order" + § "Downstream Handoff Block schemas" — never silently drift; downstream consumers jump to sections by heading match and route by `downstream_route` field

Full template + per-field format rules (frontmatter rules, body section order, Platform Spec 8-row schema, per-route Downstream Handoff Block schemas, re-run convention, ASSETS.md auto-tick semantics, anti-drift checks): [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Artifact Template

```markdown
---
skill: brief-graphic
version: 1
date: [today]
status: [done | done_with_concerns | blocked | needs_context]
downstream_route: [image-gen | vector-tool | designer-handoff | template-pack]
target_tool: [claude-design | midjourney-v6 | imagen-3 | dall-e-3 | ideogram | pencil | figma | print | ...]
asset_type: [og-image | ig-carousel | ig-post | ig-story | li-doc | li-single | fb-ad | yt-thumbnail | x-card | ooh | banner | ...]
platform: [instagram | linkedin | facebook | youtube | x | print | web | email | ...]
dimensions: [WxH or per-format list]
brand_anchors:
  primary_color: [hex]
  primary_type: [font, weight]
  motion: [duration token if applicable]
sacred_respected: [list of sacred elements honored]
---

# Design Brief: [Asset Name]

**Asset:** [type + platform]
**Purpose:** [announce | educate | convert | recruit | brand-build]
**Source copy:** [path or "none"]
**Downstream route:** [image-gen / vector-tool / designer-handoff / template-pack]

## Concept (Approved)

**Name:** [concept name]
**Visual direction:** [3-5 lines — mood, composition, palette emphasis, type role, motion if applicable]
**References:** [3 reference URLs or named brands/artworks IF applicable — never copy, only direction]

## Brand Anchors

- **Palette pull:** [3-5 hex values from DESIGN.md, with token name]
- **Typography:** [primary + secondary from DESIGN.md, sizes for this asset]
- **Sacred elements respected:** [list — what was preserved]
- **Lexicon:** [forbidden phrases avoided, preferred phrases used if copy is in asset]

## Platform Spec

| Field | Value | Source (platform module) |
|-------|-------|--------------------------|
| Aspect ratio | [X:Y] | [platform module name] |
| Dimensions | [WxH px] | [platform module] |
| Safe zone | [px from edges, platform-specific] | [platform module] |
| Type scale (mobile readability floor) | [min px at 1x] | [platform module] |
| Contrast (thumb-stop) | [WCAG ratio min for the asset's smallest text on its actual background] | platform module |
| File format | [PNG / SVG / WebP / MP4 / ...] | [platform module] |
| File-size cap | [KB/MB] | [platform module] |
| Color mode | [sRGB / DCI-P3 / CMYK] | [platform module] |
| Anti-patterns flagged | [list specific to this platform] | [platform module] |

## Hierarchy

1. **Focal point:** [what the eye lands on first]
2. **Supporting:** [secondary element]
3. **Tertiary:** [text body, fine detail]

## Asset Slots (compound assets only — e.g., carousel)

| Slot | Dimensions | Format | Fallback |
|------|-----------|--------|----------|
| [Slide 1] | [WxH] | [PNG] | [...] |
| [Slide 2] | [WxH] | [PNG] | [...] |

## Copy Placement (if any)

- **Headline:** "[exact copy]" — [position, type token]
- **Body:** "[exact copy]" — [position, type token]
- **CTA:** "[exact copy]" — [position, type token, contrast pair]

## Failure Modes to Avoid

- [Platform-specific traps — from platform module]
- [Generic-AI smell — from failure-modes.md]
- [Brand drift — from brand_anchors]

## What NOT to Do

- [Sacred elements: do not propose changing X, Y, Z]
- [Off-brand defaults to reject]

## Downstream Handoff Block

### When `downstream_route: image-gen`
- **Primary prompt** ([target_tool]): [full prompt with lens / lighting / mood / era / composition / color cast / aspect-ratio flag]
- **Variant 1:** [specific deviation]
- **Variant 2:** [specific deviation]
- **Post-processing note:** [overlay copy, logo placement, export profile]

### When `downstream_route: vector-tool`
- **Layout grid:** [columns × rows, gutters, baseline]
- **Component references:** [DESIGN.md tokens used]
- **Multi-format crops** (if applicable): [per-format dimensions and reflow rules]

### When `downstream_route: designer-handoff`
- **Spec sheet** for the designer (Figma file or print shop): [section list, type scale, palette, asset bundle paths]
- **Open questions for designer:** [decisions deferred to designer judgment]

### When `downstream_route: template-pack`
- **Per-format prompt blocks:** [one per platform variant]

## Critic Report

[rubric scores, PASS / FAIL, concerns to monitor]
```

> On re-run with same slug: rename existing artifact to `[slug].v[N].md` and create new with incremented version. Preserves history for A/B comparison.

---

## Anti-Patterns

Section 1 (Process & Approval-Gate: skipping Gate 1, skipping Gate 2, treating brief as render) + Section 2 (Brand & Token: inventing tokens, stock-AI defaults, generic-photo prompts, ignoring safe zones) + Section 3 (Cross-Cutting marketing-stack: Claude-Design-as-brand-input, hard-gate-bypass-under-fast, frontmatter-schema-drift, wrong-skill-for-intent): [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any brief ships.

---

## Completion Status Protocol

Per project standard, every run ends with explicit status:

- **DONE** — brief approved, critic PASS, artifact written
- **DONE_WITH_CONCERNS** — approved but critic flagged issues; concerns documented in artifact frontmatter. **Currently the skill itself ships in this state until platform-modules.md is fully populated.**
- **BLOCKED** — user rejected at a gate, or external dependency missing
- **NEEDS_CONTEXT** — BRAND.md or DESIGN.md missing; cannot proceed without brand-system

---

## Worked Example

End-to-end walkthrough (OG image for async-first PM tool launch — image-gen route, midjourney-v6 target, brand artifacts loaded from BRAND.md + DESIGN.md, copy from write-copy artifact, ASSETS.md path match, Layer 1 parallel returns 3 distinct concepts, Approval Gate 1 user picks "Editorial calm", Layer 2 prompt-craft returns primary + 2 variants, Layer 3 critic PASS 27/28 + AI-aesthetic 0/27, Approval Gate 2 Approve, artifact written + ASSETS.md auto-tick) + cycle-2 FAIL hypothetical + `--fast` variant snippet + Route C snippet (called by lp-brief): [`references/examples/design-brief-walkthrough.md`](references/examples/design-brief-walkthrough.md) [EXAMPLE]. Additional asset-type examples (IG carousel, YouTube thumbnail, OOH billboard, template-pack): [`references/examples.md`](references/examples.md).

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/design-brief-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch): `references/{asset-types, platform-modules, prompt-patterns, visual-rubric, failure-modes, examples}.md`
- **Shared:** `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, anti-sycophancy, shared-critic-rubrics, quality-feedback-protocol, quality-dashboard-spec}.md`
- **Agents:** 7 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 8-dimension Visual Rubric + 13-pattern Generic-AI-Aesthetic Detector + per-route scoring-mode shifts.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
