---
name: brief-graphic
description: "Produce a graphic-design brief for a single visual asset — social posts, thumbnails, banners, OOH, OG cards, hero illustrations. Pulls brand tokens, generates concepts, writes platform-aware specs + image-gen prompt or designer-handoff spec. Does NOT render — rendering is downstream. Not for brand identity (use create-brand), whole-page redesigns (use brief-landing-page), or the copy that goes IN the asset (use write-copy)."
argument-hint: "[asset description, e.g. 'instagram carousel about pricing tiers']"
allowed-tools: Read Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$1-2"
  status: done
  notes: "Re-scoped from design-create (brief-only, no rendering). platform-modules.md is fully populated — all 18 modules (tranche 1 core-digital + tranche 2 paid-ad-chrome + physical: linkedin-event-banner, facebook-feed/story-ad, youtube-banner, email-hero, ooh-billboard, transit-poster, print-magazine-spread) carry practitioner-grade specs. Volatile platform fields (ad-chrome geometry, file caps) carry [verify YYYY-MM] flags and per-vendor physical specs instruct the operator to confirm the vendor/publication media kit — verified against current sources where confirmable, never fabricated. Re-verify [verify] fields on a cadence (Meta/LinkedIn ad-chrome drifts fastest)."
---

# Design Brief — Orchestrator

<!-- BUDGET_EXCEPTION: Brief carries artifact-schema-as-contract that is load-bearing and cannot move to references/. 4 downstream routes × distinct renderer consumers + 14-field frontmatter + 8-dim Quality Gate + 6 Critical Gates (one per render-failure mode) are the contract surface tools read by name. ~400 tokens over standard cap is legitimate cost, matching evaluate-landing-page sibling. -->

Produce a graphic-design brief for a single visual asset — social posts, thumbnails, banners, OG cards, hero illustrations, OOH, ad creative. Emits an image-gen prompt or designer-handoff spec; does NOT render (not for user flow / wireframe — use `map-user-flow`). Capability metadata: [`routing.yaml`](routing.yaml). Agents + 4 downstream routes + 8-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Could a designer or image-gen tool execute this asset on-brand and on-platform without follow-up questions?

## Critical Gates — load first

- **Do NOT render.** Brief only — spec + reference direction + image-gen prompt. Rendering happens downstream.
- **Do NOT proceed without brand anchors.** Missing `brand/BRAND.md` or `brand/DESIGN.md` → `NEEDS_CONTEXT`, recommend `create-brand`. Hard gate fires BEFORE Cold Start (survives `--fast`).
- **Do NOT invent tokens, fonts, or motion specs.** Every visual decision traces to DESIGN.md. Gap → flag, don't guess.
- **Reference realized surfaces, not just tokens.** Before writing reference direction, pull ≥1 realized surface (live page screenshot · shipped HTML · approved exploration · existing exemplar) and design the concept against it — tokens are the floor, the realized surface is the taste. No surface available → record the explicit token-only fallback line. Silent token-only design fails the rubric. Contract: [`references/_shared/realized-surface-grounding.md`](references/_shared/realized-surface-grounding.md).
- **Do NOT use stock-AI defaults.** No purple-blue gradients, centered-on-white, faux-3D bevels, glassmorphism — unless DESIGN.md specifies. 13-pattern detector scores explicitly.
- **Do NOT skip the brief approval gate.** Brief is a candidate, not a delivery — user reviews before rendering.
- **Platform spec mandatory.** Every brief includes aspect ratio, safe zones, mobile readability, file format, file-size cap.

## Quality Gate — 8 dimensions + AI-aesthetic check

Critic verifies. Full rubric + per-route scoring shifts + 13-pattern Generic-AI-Aesthetic Detector: [`references/visual-rubric.md`](references/visual-rubric.md) and [`references/agent-manifest.md`](references/agent-manifest.md) § 8-Dim Visual Rubric. Max 2 rewrite cycles per verdict.

- [ ] **Brand fidelity + sacred-element respect** — palette/type/motion trace to DESIGN.md; no proposed change to logo, anchor color, tagline unless brief authorizes
- [ ] **Hierarchy + composition + typography + contrast** — 1-sec focal point, intentional white space, pairing per DESIGN.md, WCAG AA (≥4.5:1 normal, ≥3:1 large)
- [ ] **Platform fit** — dimensions, safe zones, crop behavior, mobile thumb-stop readability, file format/size match the platform module
- [ ] **CTA clarity** (if applicable) + **Generic-AI-Aesthetic** (0-7 clean / 8-15 DONE_WITH_CONCERNS / 16+ auto-FAIL)
- [ ] **Downstream handoff complete** — image-gen prompt specific (lens/lighting/mood/era/composition/color cast), or designer spec covers placement + tokens, or vector spec specifies layout grid

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md).

| Artifact | Source | Required? |
|---|---|---|
| `brand/BRAND.md` | create-brand | **REQUIRED** (hard gate) — voice, archetype, sacred elements |
| `brand/DESIGN.md` | create-brand | **REQUIRED** (hard gate) — palette, type, surface, motion |
| `brand/CREATIVE-DIRECTION.md` | create-brand | Recommended — house art direction (mood, light, framing, motion); design against it, not just tokens |
| `brand/ASSETS.md` | create-brand B | Optional — auto-fill dimensions + checkbox tick |
| realized surface (live URL · shipped HTML · `explorations/*` · exemplar asset) | the live brand | Recommended — the executed taste to design against; see realized-surface-grounding |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/asset-slots/[slot-id].md` | brief-landing-page | Optional — LP slot spec |
| `docs/forsvn/artifacts/marketing/content/[slug].copy.md` | write-copy | Optional — copy that renders IN the asset |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Optional — campaign context + `## Creative Direction` (per-campaign art direction) |
| `research/icp-research.md` | research-icp | Optional — audience visual preferences |

## Pre-Dispatch + Mode

Canonical Pre-Dispatch: [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md). **Dimensions:** asset type · downstream route · brand ref (hard-gate auto) · copy/headline · constraints. Hard-gate semantics + Cold Start + Write-back + Step 0.5 Route Detection: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `budget: standard`. `--fast` collapses Layer 1 → single pass, Layer 1.5 → 1 brief, skips Approval Gate 1 (the SELECTION pick — 3 concepts → 1; [`options-selection.md`](references/_shared/options-selection.md), tier B). **Does NOT skip** hard gate, Cold Start, Step 0.5, Approval Gate 2, critic, or AI-Aesthetic Detector.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Routes + Downstream Handoff

Every brief carries a `downstream_route` tag — `image-gen` / `vector-tool` / `designer-handoff` / `template-pack`. Auto-detection by asset type: [`references/asset-types.md`](references/asset-types.md). Override with `--route=...`. Per-route renderers + dispatch graph: [`references/agent-manifest.md`](references/agent-manifest.md).

## Artifact Contract

- **Paths:** `docs/forsvn/artifacts/marketing/design-briefs/[slug].md` (default; preserve-history → `[slug].v[N].md`; Gate-2 reject → `[slug]-rejected.md`; Gate-1 stop → `[slug]-candidates.md`).
- **Lifecycle:** `pipeline` — re-run on BRAND.md / DESIGN.md update, new ASSETS.md row, brief-landing-page slot request, campaign launch, render dissatisfaction.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `decision_state`, `review_tool`, `reviewed_at`, `reviewer`, `downstream_route`, `target_tool` (when image-gen), `asset_type`, `platform`, `dimensions`, `brand_anchors`, `sacred_respected`.
- **Consumed by:** image-gen tools (Claude Design / Midjourney / Imagen / DALL·E / Ideogram / Veo / Suno) · vector tools (Pencil / Figma) · human designers · `brief-landing-page` (LP slot) · `brand/ASSETS.md` auto-tick (literal path match).
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § Frontmatter + § Body section order + § Downstream Handoff Block schemas.


Full template + per-route Downstream Handoff Block schemas + ASSETS.md auto-tick: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — Process & Approval-Gate + Brand & Token + Cross-Cutting (Claude-Design-as-brand-input, hard-gate-bypass, frontmatter-drift, wrong-skill-for-intent). Re-read before any brief ships.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — brief approved, critic PASS, artifact written.
- **DONE_WITH_CONCERNS** — approved with flagged issues in frontmatter (e.g. a brief drew a `[verify]`-flagged platform field that wasn't confirmed against a current source, or a per-vendor physical spec the operator hasn't confirmed).
- **BLOCKED** — user rejected at a gate, or external dependency missing.
- **NEEDS_CONTEXT** — `BRAND.md` or `DESIGN.md` missing.

## Execution

At brief-binding, bind the `image` target tool (recorded as `target_tool` frontmatter on image-gen routes) — inherit `tool_targets` or ask once per `references/_shared/tool-target.md`; the image-gen prompt tunes to it, tool-agnostic stays the default.
Offer the registry-gated fork (category `image`) — **Brief-only**: hand the approved brief to the renderer named by `downstream_route` (→ `produce-asset` → `evaluate-asset`); **Assisted/Direct**: render via a verified engine, you approve at the gate. See [execution-fork.md](references/_shared/execution-fork.md); record `execution_mode`. On render dissatisfaction, re-invoke — `pipeline` lifecycle overwrites. When picking Assisted/Direct, batch-check the render surface first (all blockers at once + named fallback) — see [capability-preflight.md](references/_shared/capability-preflight.md).

## Worked Example

End-to-end OG-image walkthrough (image-gen route, Layer 1 → 3 concepts, Gate 1 pick, Layer 2 prompt-craft, critic PASS, Gate 2, ASSETS.md auto-tick) + cycle-2 FAIL + `--fast` variant + Route C snippet: [`references/examples/brief-graphic-walkthrough.md`](references/examples/brief-graphic-walkthrough.md). Additional asset-type examples: [`references/examples.md`](references/examples.md).
