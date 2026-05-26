---
name: brief-graphic
description: "Produce a graphic-design brief for a single visual asset — social posts, thumbnails, banners, OOH, OG cards, hero illustrations. Pulls brand tokens, generates concepts, writes platform-aware specs + image-gen prompt or designer-handoff spec. Does NOT render — rendering is downstream. Not for brand identity (use create-brand), whole-page redesigns (use brief-landing-page), or the copy that goes IN the asset (use write-copy)."
argument-hint: "[asset description, e.g. 'instagram carousel about pricing tiers']"
allowed-tools: Read Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "2.1.0"
  budget: standard
  estimated-cost: "$1-2"
  status: done_with_concerns
  notes: "Re-scoped from design-create (brief-only, no rendering). Platform-aware module content for IG/LinkedIn/FB/YT/X/OOH/banner is skeleton-only — needs a follow-up build pass with practitioner-grade specs (aspect ratios, safe zones, mobile type scales, thumb-stop contrast, file conventions, anti-patterns) per platform."
---

# Design Brief — Orchestrator

Produces a graphic-design brief for a single visual asset. Rendering is downstream. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 4 downstream routes + dispatch graph + 8-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Could a designer or image-gen tool execute this asset on-brand and on-platform without follow-up questions?

## Critical Gates — load first

- **Do NOT render.** This skill produces the brief, not the asset. Brief carries spec + reference direction + image-gen prompt (where applicable). Rendering happens downstream — image-gen (Midjourney / Imagen / DALL·E / Claude Design), vector tooling (Pencil / Figma), or a human designer.
- **Do NOT proceed without brand anchors.** Missing `brand/BRAND.md` or `brand/DESIGN.md` → `NEEDS_CONTEXT`, recommend `create-brand` first.
- **Do NOT invent tokens, fonts, or motion specs.** Every visual decision traces to DESIGN.md. DESIGN.md doesn't cover what's needed (e.g., illustration style) → flag it in the brief, don't guess.
- **Do NOT use stock-AI defaults.** No default purple-blue gradients, centered-isolated-on-white, faux-3D bevels, or glassmorphism unless DESIGN.md specifies. Critic scores generic-AI smell explicitly.
- **Do NOT skip the brief approval gate.** Brief is a candidate, not a delivery — user reviews before downstream rendering.
- **Platform spec is mandatory.** Every brief includes aspect ratio, safe zones, mobile readability (type scale, thumb-stop contrast), file format, file-size limits.

## Quality Gate — 8 dimensions

Full rubric + 13-pattern Generic-AI-Aesthetic Detector + per-route scoring-mode shifts: [`references/agent-manifest.md`](references/agent-manifest.md) § 8-Dim Visual Rubric. Domain rubric: [`references/visual-rubric.md`](references/visual-rubric.md). Max 2 rewrite cycles per critic verdict.

- [ ] Brand fidelity — palette, typography, motion all trace to DESIGN.md
- [ ] Sacred elements respected (no proposed change to logo, primary palette anchor, tagline unless brief explicitly authorizes)
- [ ] Hierarchy — clear focal point, scannable in 1 second
- [ ] Composition — balance, intentional white space
- [ ] Typography — pairing/sizing/leading consistent with DESIGN.md
- [ ] Contrast — text passes WCAG AA (≥4.5:1 normal, ≥3:1 large) on its actual background
- [ ] **Platform fit** — dimensions, safe zones, platform crop behavior, mobile thumb-stop readability, file format, file-size cap verified against platform module
- [ ] CTA clarity (if applicable) — readable at preview size, action verb visible
- [ ] **Generic-AI-Aesthetic check — full 13-pattern detector. 0-7 clean / 8-15 DONE_WITH_CONCERNS / 16+ auto-FAIL.**
- [ ] Downstream-handoff completeness — image-gen prompt is specific (lens / lighting / mood / era / composition / color cast), or designer spec covers placement / typography / color tokens, or vector-tool spec specifies layout grid

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Required + recommended:

| Artifact | Source | Required? |
|---|---|---|
| `brand/BRAND.md` | create-brand | **REQUIRED** (hard gate) — voice, archetype, sacred elements |
| `brand/DESIGN.md` | create-brand | **REQUIRED** (hard gate) — palette, typography, surface language, motion |
| `brand/ASSETS.md` | create-brand Route B | Optional — auto-fill dimensions, tick checkbox on completion |
| `.forsvn/artifacts/mkt/brief-landing-page/[slug]/asset-slots/[slot-id].md` | brief-landing-page | Optional — slot spec when brief is for an LP asset |
| `.forsvn/artifacts/mkt/content/[slug].copy.md` | write-copy | Optional — copy to use in the asset |
| `.forsvn/artifacts/mkt/campaign-plan.md` | plan-campaign | Optional — campaign context, awareness stage |
| `research/icp-research.md` | research-icp | Optional — audience visual preferences |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). **Hard gate fires BEFORE Cold Start** — missing brand artifacts → `NEEDS_CONTEXT`, recommend `create-brand`.

Needed dimensions: asset type (OG / IG carousel / banner / hero / OOH / etc.) · downstream route (image-gen / vector-tool / designer-handoff / template-pack) · brand reference (auto-resolved by hard gate) · copy/headline if any (renders IN the asset) · constraints (dimensions, deadline, must-include elements).

Full hard-gate semantics + 4-question Cold Start template + 2-row Write-back map + Step 0.5 Route Detection: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `budget: standard`. `--fast` collapses Layer 1 parallel into single inline pass + Layer 1.5 to 1 brief instead of 3 + skips Approval Gate 1. **`--fast` does NOT skip** hard gate, Cold Start, Step 0.5, Approval Gate 2, critic-agent, or Generic-AI-Aesthetic Detector.

## Routes + Downstream Handoff

Every brief carries a **downstream-route** tag identifying its renderer. Tag drives which optional sub-agent runs after brief approval. Full route table + dispatch graph: [`references/agent-manifest.md`](references/agent-manifest.md).

- `image-gen` — Photographic, illustrative, abstract, compositionally complex.
- `vector-tool` — Vector layouts, UI mockups, branded social templates, multi-format variants.
- `designer-handoff` — Human designer in Figma / print shop.
- `template-pack` — Multi-format social packs (IG + LinkedIn + X variants of one asset).

Override auto-detection with `--route=image-gen|vector-tool|designer-handoff|template-pack`. Asset-type → default-route table: [`references/asset-types.md`](references/asset-types.md) § "Auto-Detection".

## Artifact Contract

- **Path:** `.forsvn/artifacts/mkt/design-briefs/[slug].md` (default overwrite on re-run; preserve-history renames to `[slug].v[N].md`). Rejected briefs → `[slug]-rejected.md` (Gate 2 reject); paused candidates → `[slug]-candidates.md` (Gate 1 stop).
- **Lifecycle:** `pipeline` — re-run on BRAND.md / DESIGN.md update, new ASSETS.md row, brief-landing-page slot request, campaign launch, render dissatisfaction.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `review_state`, `review_tool`, `reviewed_at`, `reviewer`, `downstream_route`, `target_tool` (when image-gen), `asset_type`, `platform`, `dimensions`, `brand_anchors` (primary_color + primary_type + motion), `sacred_respected` (list).
- **Consumed by:** image-gen tools (Claude Design / Midjourney / Imagen / DALL·E / Ideogram / Veo / Suno) · vector tools (Pencil / Figma) · human designers (Designer-Handoff Spec block) · `brief-landing-page` (when invoked from LP asset slot) · `brand/ASSETS.md` auto-tick (literal path match).
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter — required fields" + § "Body section order" + § "Downstream Handoff Block schemas" — never silently drift; downstream consumers jump to sections by heading match and route by `downstream_route` field. Review fields + `## Review Gate` heading are additive and orthogonal.
- **Review-gated:** `review_state` defaults to `not_required`. Operator or loop opts a run into review by setting `review_state: pending`. Field semantics: [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); procedure: [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md).

Full template + per-field format rules + per-route Downstream Handoff Block schemas + ASSETS.md auto-tick semantics: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before any brief ships. Section 1 (Process & Approval-Gate: skipping Gate 1, skipping Gate 2, treating brief as render) + Section 2 (Brand & Token: inventing tokens, stock-AI defaults, generic-photo prompts, ignoring safe zones) + Section 3 (Cross-Cutting: Claude-Design-as-brand-input, hard-gate-bypass-under-fast, frontmatter-schema-drift, wrong-skill-for-intent).

## Completion Status

- **DONE** — brief approved, critic PASS, artifact written.
- **DONE_WITH_CONCERNS** — approved but critic flagged issues; concerns in artifact frontmatter. **Currently the skill itself ships in this state until platform-modules.md is fully populated.**
- **BLOCKED** — user rejected at a gate, or external dependency missing.
- **NEEDS_CONTEXT** — `BRAND.md` or `DESIGN.md` missing.

## Worked Example

End-to-end OG image for async-first PM tool launch (image-gen route, midjourney-v6 target, brand artifacts loaded from BRAND.md + DESIGN.md, copy from write-copy artifact, ASSETS.md path match, Layer 1 parallel returns 3 distinct concepts, Approval Gate 1 user picks "Editorial calm", Layer 2 prompt-craft returns primary + 2 variants, Layer 3 critic PASS 27/28 + AI-aesthetic 0/27, Approval Gate 2 Approve, artifact written + ASSETS.md auto-tick) + cycle-2 FAIL + `--fast` variant + Route C snippet (called by lp-brief): [`references/examples/brief-graphic-walkthrough.md`](references/examples/brief-graphic-walkthrough.md). Additional asset-type examples: [`references/examples.md`](references/examples.md).
