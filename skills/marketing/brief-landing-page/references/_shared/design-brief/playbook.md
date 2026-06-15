<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Playbook — Design-Brief

> Why this skill exists, philosophy, methodology, principles, scope boundary, when NOT to use, what it pulls from elsewhere, history.

[PLAYBOOK] — read once at first invocation; re-read when scope feels off.

## Why this skill exists

Most visual assets fail at one of three places: **brand fidelity** (the asset doesn't read as the brand it's supposed to be), **platform fitness** (the asset breaks at the platform's crop / format / mobile readability), or **downstream ambiguity** (the brief was vague, the renderer guessed, the result drifted). Design-brief exists to close all three: every visual decision binds to a brand anchor in DESIGN.md AND to a platform constraint AND to a downstream-route-specific handoff spec (image-gen prompt / vector-tool grid / designer-handoff sheet).

The brief is the deliverable. Rendering happens downstream — Claude Design / Midjourney / Imagen / DALL·E / Pencil / Figma / a human designer. Quality of the rendered asset is bounded by quality of the brief.

## Core philosophy

**A great brief eliminates downstream ambiguity.** Render quality is bounded by brief quality — a vague brief produces drift no matter how good the renderer. The brief is the deliverable; every visual decision binds to a brand anchor and a platform constraint.

**Brand fidelity > aesthetic novelty.** A boring on-brand brief beats a striking off-brand one.

**Platform fitness > generic polish.** The asset has to survive the platform it ships on — IG's crop behavior, YouTube's thumbnail size at 100px, LinkedIn's document-post navigation. Platform-aware specs are non-optional, not nice-to-have.

**Stock-AI defaults are a tax.** Default purple-blue gradients, centered-isolated-on-white, glassmorphism, faux-3D bevels — these are signals the brief was lazy. Critic-agent runs a 13-pattern detector specifically because LLMs trained on AI-generated images regress toward these patterns silently.

## Methodology

Design-brief is a **multi-stage interactive orchestrator** with two human-approval gates. Each gate is load-bearing: shipping a render based on the wrong concept burns credits or designer time; shipping a render against an unapproved brief silently breaks brand trust.

```
Pre-Dispatch (hard gate on BRAND.md + DESIGN.md)
  ↓
Step 0.5: Route Detection (auto-detect downstream-route from asset type)
  ↓
LAYER 1 (parallel): brand-anchor + concept + copy-anchor
  ↓
LAYER 1.5: brief-synth → 3 candidate briefs
  ↓
APPROVAL GATE 1: user picks A / B / C / revise / switch route / stop
  ↓
LAYER 2 (route-dependent): prompt-craft OR figma-spec OR (none for vector-tool)
  ↓
LAYER 3: critic-agent (visual rubric + AI-aesthetic detector + platform-fit)
  ↓
APPROVAL GATE 2: user approves / revises / rejects
  ↓
Write artifact + ASSETS.md auto-tick (literal path match only)
```

Multi-agent value here: **brand specialist + concept variety (3 distinct options) + format-aware synth + route-specific handoff + critical evaluator** — five different lenses, each with a focused contract. Single-agent fallback collapses all five into one inline pass with the same critic rubric self-applied.

## Three guiding principles

1. **Hard-gate on brand artifacts BEFORE questioning.** No BRAND.md + DESIGN.md = NEEDS_CONTEXT, recommend `create-brand`. Cold-start questioning happens AFTER the gate clears — never before, even if the user is asking for "a quick IG post."
2. **Never invent tokens.** Every color, font, spacing token traces to DESIGN.md. If DESIGN.md doesn't cover what's needed (e.g., illustration style for an asset DESIGN.md never anticipated), flag it in the brief — don't guess. Expanding DESIGN.md is `create-brand`'s job.
3. **Two approval gates, no exceptions.** Going straight to image-gen (skipping Gate 1) burns credits on a misaligned concept. Going straight to artifact write (skipping Gate 2) ships briefs the user didn't validate. Both gates are STOP points; the orchestrator does NOT collapse them.

## Scope boundary

**In scope:** per-asset graphic-design briefs — social posts (IG carousel / post / story, LinkedIn doc / single, FB ad), thumbnails (YouTube, X card), banners / display ads, OOH / billboard, OG / share cards, hero illustrations. Platform-aware specs (aspect ratio, safe zones, type scale, contrast, file format, size cap, anti-patterns). Image-gen prompt OR vector-tool layout grid OR designer-handoff sheet OR per-format template pack.

**Out of scope:**
- **Rendering the asset** — design-brief produces the BRIEF; downstream tools render. (Claude Design / Midjourney / Imagen / DALL·E / Pencil / Figma / human designer.)
- **Brand identity definition** → use `create-brand`. Design-brief CONSUMES brand/BRAND.md + brand/DESIGN.md; it does not produce or modify them. Inventing palette / typography / motion tokens for an asset = anti-pattern.
- **Whole-page redesigns** → use `brief-landing-page`. Design-brief is per-asset; lp-brief is per-page (with per-asset slots it can route to brief-graphic).
- **Writing the copy that goes IN the asset** → use `write-copy`. Design-brief composes the asset around copy; copywriting writes the headline / body / CTA.

## When NOT to use

- BRAND.md or DESIGN.md is missing. Hard-gate returns NEEDS_CONTEXT; route to `create-brand` first.
- The request is to render an asset, not to brief one. design-brief is brief-only; rendering happens downstream.
- The user wants an entire page or interface. Use `brief-landing-page` (per-page) or coordinate with the design system rather than producing isolated per-asset briefs.
- The user wants brand identity work (logo, palette, voice). Use `create-brand`; design-brief produces no brand decisions, only applies them.
- The asset is a wireframe / interface mockup. design-brief targets graphic assets, not UI flows. Use `map-user-flow` for screen mapping; use `architect-system` for UI architecture.

## What it pulls from elsewhere

- `brand/BRAND.md` — voice, archetype, sacred elements (from `create-brand`)
- `brand/DESIGN.md` — palette, typography, surface language, motion (from `create-brand`)
- `brand/ASSETS.md` — per-platform production inventory; pre-fills format/dimensions if asset matches a row, auto-ticks checkbox on completion (from `create-brand`)
- `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/asset-slots/[slot-id].md` — slot spec when brief is for an LP asset (from `brief-landing-page`)
- `docs/forsvn/artifacts/marketing/content/[slug].copy.md` — copy used IN the asset (from `write-copy`)
- `docs/forsvn/artifacts/marketing/campaign-plan.md` — campaign context, channel placement, awareness stage (from `plan-campaign`)
- `research/icp-research.md` — audience visual preferences (from `research-icp` in research-skills)
- `references/asset-types.md` — per-asset format specs
- `references/platform-modules.md` — per-platform brief checklists. Fully populated — all 18 modules (tranche 1 core-digital + tranche 2 paid-ad-chrome + physical) carry practitioner-grade specs; volatile platform fields + per-vendor physical specs carry `[verify]` / confirm-media-kit flags. Skill is `status: done`
- `references/prompt-patterns.md` — image-gen prompt structures + tool → asset type table
- `references/visual-rubric.md` — critic scoring dimensions + 13-pattern generic-AI-aesthetic detector
- `references/failure-modes.md` — generic-AI catalog + brand drift patterns
- `references/examples.md` — end-to-end worked examples per asset type

## Downstream consumers

The brief at `docs/forsvn/artifacts/marketing/design-briefs/[slug].md` is consumed by:

- **Image-gen tools** (Claude Design / Midjourney / Imagen / DALL·E / Ideogram / Veo / Suno) — read the Image-Gen Prompt block when `downstream_route: image-gen`
- **Vector tools** (Pencil / Figma) — read the Layout Grid + Component References block when `downstream_route: vector-tool`
- **Human designers** — read the Designer-Handoff Spec block when `downstream_route: designer-handoff`
- **`brief-landing-page`** — when a landing-page asset slot needs a per-asset brief, lp-brief invokes design-brief on the slot
- **ASSETS.md auto-tick** — completion of a brief with a literal-path match in ASSETS.md flips `[ ]` → `[x]`

## History / origin

| Version | Date | Slot | Note |
|---|---|---|---|
| 2.0.0 → 2.0.0 | 2026-05-18 | v6 Phase 2 Wave 1 — marketing-stack slot 11/14 | Body 488 → ~225 (-54%) + 5 new refs (playbook + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics + examples/brief-graphic-walkthrough) + new anti-patterns.md (7 from body + 4 cross-cutting marketing-stack rows). Cross-stack contract preserved BYTE-IDENTICAL: 6 Critical Gates, 10-item Quality Gate, 7-agent Manifest, Downstream Routes table (4 rows), Asset-Type → Default Route auto-detection table (14 rows), Pre-Dispatch hard gate, 5 needed dimensions, Cold/Warm Start templates, 2-row Write-back map, Step 0.5 Route Detection (5 steps), Layer 1 + 1.5 + 2 + 3 dispatch tables, Approval Gates 1 + 2 (full user-response handling), Artifact Template (~100 lines with frontmatter + Concept + Brand Anchors + Platform Spec + Hierarchy + Asset Slots + Copy Placement + Failure Modes + What NOT to Do + Downstream Handoff Block per route + Critic Report), 4-tier Completion Status. Structural: `### Artifact Template` nested under new `## Artifact Contract` H2 wrapper per marketing-stack sibling-parity convention (matches campaign-plan slot 10 + ad-copy slot 9 + copywriting slot 8 + cold-outreach slot 7 + humanmaxxing slot 6 + vn-tone slot 5 + short-form-brief slot 4 + seo slot 3). `status: done_with_concerns` preserved verbatim (platform-modules.md skeleton-only flagged in `notes:` — deferred to v6.3.0 follow-up build pass, NOT in scope for this body-diet refactor). |
