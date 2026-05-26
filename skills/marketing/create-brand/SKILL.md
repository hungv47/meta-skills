---
name: create-brand
description: "Builds a brand identity system as up to three artifacts — BRAND.md (story, voice, positioning, archetype), DESIGN.md (AI-readable design tokens), ASSETS.md (per-platform inventory). Runs Quick Brand (Route A) or full brand-system (Route B). Use to define or rebrand a product's identity. Not for marketing copy (use write-copy), user flows (use map-user-flow), campaign planning (use plan-campaign), or audience research (use research-icp)."
argument-hint: "[product or brand to design]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "6.3.0"
  budget: deep
  estimated-cost: "$2-5"
---

# Brand Identity & Design System — Orchestrator

Coordinates 8 specialized agents to transform product context into a brand narrative + AI-readable design system. Capability metadata (routes, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + per-route dispatch graphs + pattern-catalog map: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology and history: [`references/playbook.md`](references/playbook.md).

**Core question:** Does every visual decision trace back to who we are?

## Critical Gates — load first

- **No colors/fonts before strategy.** Visual-agent runs parallel with strategy-agent; orchestrator verifies coherence at merge.
- **No Layer 2 before Layer 1 completes.** Token-architect needs visual-agent output; component-token needs token-architect output.
- **Critic's cross-element coherence is mandatory.** Radius↔archetype, type↔personality, color↔emotion — the matrix no individual agent can see.
- **Stale upstream (>30 days) → generic archetypes.** Recommend re-running `research-icp` if artifact dates are old.
- **BRAND.md is prose, DESIGN.md is specification.** Never mix registers.

## Output

| File | Audience | Register | Route |
|---|---|---|---|
| `brand/BRAND.md` | Founders, marketers, copywriters, designers | Prose — brand book | A + B |
| `brand/DESIGN.md` | AI coding agents, frontend engineers, design-system consumers | Specification — tables, formulas, exact values | B only |
| `brand/ASSETS.md` | Designers, art directors, asset producers, PMs | Checklist — GFM checkboxes with spec ref + target path | B only |

ASSETS.md is deterministically projected from BRAND.md + DESIGN.md + declared platforms (Step 8.5) — auto-scans `brand/` each run; human-owned `[~]` (in-progress) and `[!]` (blocked) markers preserved across runs. Per-section format + frontmatter schema: [`references/format-conventions.md`](references/format-conventions.md). Optional visual renderings via Paper MCP, Claude Design handoff, or a brand-kit board — see Step 9.

## Quality Gate — critic check-groups

Full canonical checklist (13 BRAND.md + 13 DESIGN.md + ASSETS.md + 4 cross-file) in [`agents/critic-agent.md`](agents/critic-agent.md). Four check-groups:

- **BRAND.md** — origin/naming depth, real-tradeoff values, voice Do/Don't examples, 3-context tone range, tagline V/F/U (min 6/9) + competitor swap, concrete Lexicon Rules block, no copywriting scope creep, touchpoint-level emotional journey, register separation, route-appropriate platform coverage, brand-book prose quality, narrative-tension gates NT-Q1-NT-Q4 (sustainable persona, lived-not-aspirational values, specific community resonance, no exploitative pain narrative).
- **DESIGN.md** — AI-readable header, font Loading & Licensing table, named iconography + fallback + Forbidden Icons YAML, complete per-theme palettes + semantic tokens, WCAG AA on every pair, bg/fg convention, archetype-justified `--radius`, surface/shadow systems, physics-valued animations, per-platform icon specs, concrete Do's/Don'ts.
- **ASSETS.md** (Route B) — one section per declared platform, every row spec-ref'd + fully-substituted path, no invented or duplicated rows, legend + summary + `## Orphaned` handled, prior `[~]`/`[!]` markers preserved.
- **Cross-file coherence** — radius↔archetype, type↔personality, color↔emotion, imagery↔archetype; voice tone ↔ visual atmosphere; ASSETS.md ≡ BRAND.md ≡ DESIGN.md platform sets; AI-slop check via `references/ai-slop-detection.md` (0-1 clean / 2-3 review / 4+ regenerate).

Reference quality bar: compare against `references/example-brand.md` + `references/example-design.md`; run their copy-paste / blind-build / competitor-swap / implementation-gap tests as final validation.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Recommended context:

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Strongly recommended — drives strategy + audience grounding |
| `research/icp-research.md` | research-icp | Strongly recommended — audience archetype + voice register |
| `brand/BRAND.md` (existing) | prior run | Optional — triggers versioning (`BRAND.v[N].md`) on re-run |
| `brand/ASSETS.md` (existing) | prior run | Optional — Step 8.5 preserves `[~]`/`[!]` markers across re-runs |
| `.forsvn/experience/{product,audience,brand,business,technical}.md` | any skill | Optional — persisted answers for the 7 Pre-Dispatch dimensions |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). Needed dimensions: product (1-line), audience, competitive landscape (3-5 names), voice intuition (3 adjectives or reference brand), aesthetic intuition (3 visual references), **target platforms** (mandatory enumeration — drives ASSETS.md), positioning intent. Warm/Cold Start prompts + 13-platform catalog: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): auto-downgrade for ≤3 sentences AND no prior artifacts → Route A. `--fast` forces Route A regardless. **`--fast` does NOT skip Cold Start (especially Q6 platform enumeration), Critical Gates 1-5, or hard-block conditions.**

## Routing

Ask: *"Full brand system or quick brand for MVP?"*

- **Route A — Quick Brand (MVP):** Step 0 → Layer 1 parallel (strategy + visual color/typography-only, logo deferred) → critic (strategy↔visual coherence only) → re-dispatch on FAIL (max 2 cycles) → deliver. Output includes: "Run full brand-system when ready to build the design system."
- **Route B — Full Brand System:** Step 0 → Layer 1 parallel (4 agents) → Merge → Layer 2 sequential (3 agents) → critic → Step 8.5 ASSETS projection → Step 9 (optional Visual Renderings) → Step 10 deliver. Max 2 rewrite cycles.

Full dispatch graphs: [`references/agent-manifest.md`](references/agent-manifest.md). Spawn mechanics + single-agent fallback: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Layer 1 → Merge → Layer 2 — load-bearing rules

Three semantics govern conflict resolution; the full per-layer dispatch tables are in `agent-manifest.md`:

- **Coherence check before Layer 2.** Archetype must align with visual choices. Caregiver + aggressive typography → resolve before Layer 2.
- **Palette ownership.** Visual-agent is authoritative for colors. Token-architect systematizes them; on conflict, visual-agent wins.
- **Accessibility hand-back.** Accessibility-agent owns the audit, not the fix. Failing pairs route to the critic, which re-dispatches the upstream owner.

## Step 8.5: ASSETS.md Projection (Route B only, always-on)

Deterministic orchestrator step, after critic PASS, before Step 9. **No sub-agent.** Read [`references/assets-inventory.md`](references/assets-inventory.md) for emission rules + per-platform templates. Full 7-step procedure + orchestrator self-check gate: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) § "Step 8.5".

Key invariants: every row has spec ref + target path · ASSETS.md platform set ≡ declared platforms ≡ BRAND.md Digital Touchpoints ≡ DESIGN.md Platform Icon Specifications · human `[~]`/`[!]` markers never overwritten · no invented rows.

## Step 9: Visual Renderings (optional)

Spec is canonical; renderings are derivative. Three paths — full procedure in `procedures/dispatch-mechanics.md § Step 9`:

- **9a Paper MCP** — 5 artboards (Color / Typography / Spacing / UI / Logo) to `brand/artboards/`. AI slop detection after generation. See [`references/artboard-generation.md`](references/artboard-generation.md).
- **9b Claude Design** — handoff to `claude.ai/design`. Pre-flight checks (DESIGN.md complete, Brand Mark commission-grade, `brand/logo/logo-full.svg`, `brand/font/` populated). Exports go OUTSIDE `brand/` (`presentations/`) — re-run brand-system to update source.
- **9c None** — spec stands alone. Downstream skills consume DESIGN.md directly.
- **9d Brand-Kit Board** — visual-agent emits a board *spec* + per-panel image-gen prompts to `brand/artboards/[board-name]/{spec.md,prompts.md}`. No new brand decisions in the board. Gated by [`references/brand-kit-rendering.md`](references/brand-kit-rendering.md) and critic BK-G1-G9.

## Artifact Contract

- **Paths (Route B):** `brand/BRAND.md`, `brand/DESIGN.md`, `brand/ASSETS.md` · **Route A:** `brand/BRAND.md` only.
- **Lifecycle:** `canonical` — brand-of-record artifacts consumed by 10+ downstream marketing + product skills.
- **Versioning:** BRAND.md + DESIGN.md rename existing to `*.v[N].md` on re-run. ASSETS.md is a **living file** — always updated in place, dropped-platform rows move to `## Orphaned` (preserved); only versioned on explicit fresh-inventory request.
- **Frontmatter + section schema:** [`references/format-conventions.md`](references/format-conventions.md).
- **Review-gated:** write the review frontmatter (`decision_state` / `review_surface` / `review_tool` / `reviewed_at` / `reviewer`) per [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); when `review_surface: html`, emit the co-located WATER-themed HTML preview via `renderReviewSurface(...)` per [`references/_shared/review-surface-template.md`](references/_shared/review-surface-template.md) (the WATER exemplar at `references/_html/exemplars/water-create-brand.html` is the canonical pattern for this skill); run review per [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md). BRAND.md + DESIGN.md default `decision_state: pending` + `review_surface: html` and carry `## Review Gate` block. ASSETS.md is a deterministic projection → `decision_state: not_required` + `review_surface: none` + `review_tool: none`, no `## Review Gate`. `status` (skill quality) and `decision_state` (human acceptance) are independent. v2 enum: `pending | approved | denied | suggested | not_required`.
- **Cross-stack contract:** schema changes (frontmatter, section headings, table columns) require atomic update of `format-conventions.md` + every downstream caller (write-copy, write-ad, write-outreach, brief-landing-page, brief-graphic, plan-campaign, humanmaxxing, polish-vn, brief-shortform, map-user-flow). Exception: the four review fields are additive — downstream callers consume brand content by heading match and do not parse review fields.

Full templates: [`references/artifact-templates.md`](references/artifact-templates.md). Quality-bar examples: [`references/example-brand.md`](references/example-brand.md), [`references/example-design.md`](references/example-design.md).

## Chain Position

Previous: `research-icp` (product context) | Next: `plan-campaign`, `write-copy`, `brief-landing-page`, `brief-graphic`.

**Re-run triggers:** major product pivots, new markets, audience shifts, annual brand refresh.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships — 21-pattern catalog (13 brand-system pipeline + 4 cross-cutting + 2 narrative-tension + 2 brand-kit board). Most common in practice: aesthetics-without-strategy, generic values, inventing ASSETS.md rows, overwriting human markers.

## Completion Status

- **DONE** — Route A: BRAND.md, critic PASS. Route B: BRAND.md + DESIGN.md + ASSETS.md, critic PASS, ASSETS.md auto-scan complete.
- **DONE_WITH_CONCERNS** — artifacts written but critic flagged secondary issues (token coverage thin, archetype blend ambiguous, ASSETS.md Orphaned rows surfaced).
- **BLOCKED** — product context contradictory across audience and positioning (enterprise positioning + consumer voice); needs user reconciliation.
- **NEEDS_CONTEXT** — no audience/product description AND `research/product-context.md` absent; recommend `research-icp` first.

## Worked Example

End-to-end Route B (FinLit personal finance app, 3 platforms, full 8-agent dispatch, 74-row ASSETS.md, critic PASS) + Route A (TaskFlow MVP, 2 platforms, reduced critic): [`references/examples/brand-system-walkthrough.md`](references/examples/brand-system-walkthrough.md).
