---
name: brief-shortform
description: "Production-ready brief for short-form video — hook, shot list, on-screen text, audio plan, caption, CTA, aspect, length. Covers live-action + motion-graphic. 1 hero + 2 variants per run. Reads the per-platform research-shortform catalog. Not for static visual assets (use brief-graphic), organic social copy (use write-social), paid ad creative (use write-ad), or rendering (use produce-video)."
argument-hint: "[angle or topic] [--platforms tiktok,reels,...] [--brand-mode founder|company]"
allowed-tools: Read Edit Write Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.1.0"
  budget: deep
  estimated-cost: "$2-4 (single platform) / $4-8 (1 hero + 2 variants)"
---

# Short-Form Brief — Orchestrator

Production-grade brief for one short-form asset. Reads the per-platform research catalog and turns an angle into a hero brief plus optional per-platform variants. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + dispatch graph + 4-sub-critic gate: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Could a producer walk on set or open After Effects and ship this brief verbatim, with the result being recognized as native to its platform?

## Critical Gates — load first

1. **Soft-required: `research-shortform` artifact.** Missing → warn but proceed (briefs lack current trend signals; flag in artifact frontmatter). Stale beyond 30d trends or 180d mechanics → recommend re-run; user can override.
2. **Variant cap (soft): 1 hero + 2 variant platforms default.** More platforms extend the recut set with a per-recut cost+craft warning (`deep` budget; critic attention per variant thins past 2); re-invoke instead for full per-platform craft verification. Mode + tier: [`references/_shared/options-selection.md`](references/_shared/options-selection.md) (DELIVERY, tier A).
3. **Hard cap: `brand_mode` is `founder` OR `company` — no `hybrid`.** User picks per-brief.
4. **No fabricated VoC.** Every quote in the brief traces to `research/icp-research.md`. Cold-start audience hint accepted but flagged in artifact.
5. **Generic content fails.** Critic gate enforces specificity at four axes (hook, production, algorithm-fit, brand-fit). Two cycles max, then ship `done_with_concerns`.
6. **Variants are TRUE RECUTS, not caption-resizes.** `platform-tailor-agent` rebuilds hook + audio + caption + CTA per platform.

## Quality Gate — 4 critics

All four PASS required, max 2 rewrite cycles. Full 4-sub-critic rubric + Rewrite Routing Table: [`references/agent-manifest.md`](references/agent-manifest.md) § 4-Sub-Critic Gate.

- [ ] Hook — clears platform's hook window from research; visual + verbal + text triad simultaneous; 3Q test passes; archetype tagged
- [ ] Production — every shot/scene has timing (seconds), framing, action, on-screen text, audio sync; audio names a track or VO direction; production notes filled
- [ ] Algorithm-fit — aligns with target platform's algorithmic preferences (completion thresholds, hold rates, audio rules, captions, watermarks)
- [ ] Brand-fit — caption + verbal lines use VoC phrases from ICP; voice matches `BRAND.md` archetype; visual/motion direction anchored to `CREATIVE-DIRECTION.md` + `FRAME.md` (when present — FRAME.md gives the frame-composition layer: safe areas, type-at-distance, on-screen pacing) and to a realized exemplar (a shipped on-brand video / live product capture) rather than tokens alone — or the explicit fallback is recorded (`frame_direction: absent` when FRAME.md missing; token-only per `references/_shared/realized-surface-grounding.md`); no generic founder/company tropes

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Recommended context:

| Artifact | Source | Required? |
|---|---|---|
| `docs/forsvn/artifacts/research/research-shortform/[slug].md` | research-shortform | Soft-required (Critical Gate 1) — proceeds without it but flags `trend_signals_stale` |
| `research/icp-research.md` | research-icp | Soft-required (Critical Gate 4) — proceeds with cold-start hint but flags `voc_source: cold-start-hint` |
| `brand/BRAND.md` | create-brand | Recommended — brand_mode inference + voice archetype |
| `brand/CREATIVE-DIRECTION.md` | create-brand | Recommended — house art direction (movement, light, pacing); anchor visuals to it + a realized exemplar, not tokens alone |
| `brand/FRAME.md` | create-brand | Soft-required — frame direction (safe areas, type-at-distance, on-screen pacing, bumper grammar); matched by canonical path + headings. Present → spec shots/text to its safe areas + type floors + hold times. Absent → flag `frame_direction: absent` and fall back to `CREATIVE-DIRECTION.md` + `DESIGN.md` tokens, never silently (`references/_shared/realized-surface-grounding.md`) |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Optional — inherits theme/dates/CTAs + `## Creative Direction` (per-campaign art direction) if `[slug]` matches |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). Needed dimensions: angle · platforms (1-3 typical; more extends recuts with a cost warning) · brand_mode (founder | company) · production_mode (auto | live-action | motion-graphic | mixed) · market · optional campaign tie-in. Warm/Cold Start (5-question bundled) + Write-back map + VN auto-routing for polish chain: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `--fast` skips Layer 2 (no critic, no platform-tailor) and runs Layer 1 + 1.5 single-pass via single-agent fallback. **`--fast` does NOT skip Cold Start or Critical Gates 1-6.**
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Routing

Single route — always runs Layer 1 + Layer 1.5 + Layer 2. Multi-platform invocations add `platform-tailor-agent` in Layer 2. Full dispatch graph: [`references/agent-manifest.md`](references/agent-manifest.md).

## Artifact Contract

- **Hero path:** `docs/forsvn/artifacts/marketing/brief-shortform/[slug]/brief.md`.
- **Variant path:** `docs/forsvn/artifacts/marketing/brief-shortform/[slug]/variants/[platform].md`.
- **Lifecycle:** `pipeline` — one artifact per (angle, platform-set, market); re-run on angle/platform/market pivot.
- **Frontmatter:** `type`, `role`, `status`, `decision_state`, `review_tool`, `reviewed_at`, `reviewer`, `date`, `slug`, `angle`, `brand_mode`, `production_mode`, `market`, `hero_platform`, `variants[]`, `research_artifact`, `research_trend_signals_date`, `research_mechanics_date`, `campaign_tie_in`, `frame_direction`, `critic_passes[]`, `critic_loop_count`, `polish_chain_applied`.
- **Hero body sections (15, in order):** TL;DR for the Producer · What This Brief Bets On · Audience & Voice · Format Specification · Hook · Storyboard · On-Screen Text Choreography · Audio Plan · Caption · CTA · Production Notes · What NOT To Do · Success Criteria · Variant Roadmap · Review Gate.
- **Variant body sections:** What Changed From Hero · Hook · Storyboard delta · Audio Plan · Caption · CTA.
- **Consumed by:** human producers / video editors / motion designers; `produce-video` (consumes the brief to emit multi-runtime export bundles).
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)". Review fields are additive and orthogonal — consumers match sections by heading.


Full template + per-section format rules: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships. 5 sub-critic clusters (Hook / Production / Algorithm-fit / Brand-fit / Variant) + 5 soft anti-patterns + 6 cross-cutting marketing-stack (VN auto-routing, polish-chain on FAIL, variant-cap creep, cross-stack contract drift, mixed production-mode transition principle).

Most common in practice: AI-slop openers ("Hey guys"), vague action verbs ("show product"), caption-only variant resizing, missing VoC in caption first-line, generic founder/company tropes.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — all 4 critics PASS within ≤2 cycles. Hero + all requested variants produced.
- **DONE_WITH_CONCERNS** — loop cap reached; remaining FAILs surfaced as warnings. Concerns pinned at top of artifact.
- **BLOCKED** — research stale beyond windows AND user declined re-run; ICP read fails; WebSearch/WebFetch blocked when verifying audio.
- **NEEDS_CONTEXT** — required inputs missing (no research AND user declined to proceed; no BRAND.md AND brand_mode unresolvable). State which upstream skill provides what's missing.

## Execution

At brief-binding, bind the `video` target tool — inherit `tool_targets` or ask once per `references/_shared/tool-target.md`; production notes tune to it, tool-agnostic stays the default.
Offer the registry-gated fork (category `video`) — **Brief-only**: hand the brief to `produce-video` for the render-ready scaffold (→ `evaluate-shortform`); **Assisted/Direct**: a verified engine renders, you approve at the gate. See [execution-fork.md](references/_shared/execution-fork.md); record `execution_mode`. When picking Assisted/Direct, batch-check the render surface first (all blockers at once + named fallback) — see [capability-preflight.md](references/_shared/capability-preflight.md).

## Worked Example

End-to-end walkthrough (Pre-Dispatch warm-start → Layer 1 parallel → Layer 1.5 parallel → Layer 2 platform-tailor + critic PASS → polish chain → deliver; plus FAIL-handling cycle 2 + `--fast` variant): [`references/examples/brief-shortform-walkthrough.md`](references/examples/brief-shortform-walkthrough.md). Two condensed reference briefs: [`references/_examples/example-1-vn-founder-tiktok.md`](references/_examples/example-1-vn-founder-tiktok.md), [`references/_examples/example-2-us-company-reels-shorts.md`](references/_examples/example-2-us-company-reels-shorts.md).
