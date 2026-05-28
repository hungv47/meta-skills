---
name: create-brand
description: "Builds a brand identity system as up to three artifacts — BRAND.md (story, voice, positioning, archetype), DESIGN.md (AI-readable design tokens), ASSETS.md (per-platform inventory). Runs Quick Brand (Route A) or full brand-system (Route B). Use to define or rebrand a product's identity. Not for marketing copy (use write-copy), user flows (use map-user-flow), campaign planning (use plan-campaign), or audience research (use research-icp)."
argument-hint: "[product or brand to design]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
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

ASSETS.md is deterministically projected from BRAND.md + DESIGN.md + declared platforms (Step 8.5) — auto-scans `brand/` each run; human-owned `[~]` (in-progress) and `[!]` (blocked) markers preserved across runs. Per-section format + frontmatter schema: [`references/format-conventions.md`](references/format-conventions.md). Optional visual renderings via Paper MCP, Claude Design handoff, or a brand-kit board (Step 9).

## Quality Gate — critic check-groups

Four check-groups; full canonical checklist (13 BRAND + 13 DESIGN + ASSETS + 4 cross-file + narrative-tension NT-Q1-Q4 + brand-kit BK-G1-G9) in [`agents/critic-agent.md`](agents/critic-agent.md):

- **BRAND.md** — origin/values/voice/tagline/lexicon depth, no copywriting scope creep, narrative-tension gates.
- **DESIGN.md** — AI-readable header, font/iconography tables, per-theme palettes + semantic tokens, WCAG AA, archetype-justified `--radius`, surface/shadow/motion systems.
- **ASSETS.md** (Route B) — one section per declared platform, spec-ref'd + substituted paths, no invented/duplicated rows, `[~]`/`[!]` preserved.
- **Cross-file coherence** — radius↔archetype, type↔personality, color↔emotion, imagery↔archetype, voice↔visual, ASSETS≡BRAND≡DESIGN platform sets; AI-slop check via [`references/ai-slop-detection.md`](references/ai-slop-detection.md) (0-1 clean / 2-3 review / 4+ regenerate).

Reference bar: [`references/example-brand.md`](references/example-brand.md) + [`references/example-design.md`](references/example-design.md) (copy-paste / blind-build / competitor-swap / implementation-gap tests).

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

- **Route A — Quick Brand (MVP):** Step 0 → Layer 1 parallel (strategy + visual color/typography-only, logo deferred) → critic (strategy↔visual coherence only) → re-dispatch on FAIL (max 2 cycles) → deliver + "Run full brand-system when ready to build the design system."
- **Route B — Full Brand System:** Step 0 → Layer 1 parallel (4 agents) → Merge → Layer 2 sequential (3 agents) → critic → Step 8.5 ASSETS projection → Step 9 (optional Visual Renderings) → Step 10 deliver. Max 2 rewrite cycles.

Full dispatch graphs, spawn mechanics, single-agent fallback, Layer 1→Merge→Layer 2 semantics (coherence check, palette ownership, accessibility hand-back), Step 8.5 7-step projection + invariants, Step 9 sub-paths (9a Paper MCP / 9b Claude Design / 9c None / 9d Brand-Kit Board): [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) + [`references/agent-manifest.md`](references/agent-manifest.md). Step 9a artboard rules: [`references/artboard-generation.md`](references/artboard-generation.md); Step 9d gated by [`references/brand-kit-rendering.md`](references/brand-kit-rendering.md) + critic BK-G1-G9.

Key invariants (always-on): every ASSETS row has spec ref + target path · ASSETS platform set ≡ declared platforms ≡ BRAND Digital Touchpoints ≡ DESIGN Platform Icon Specs · human `[~]`/`[!]` markers never overwritten · no invented rows · Step 8.5 reads [`references/assets-inventory.md`](references/assets-inventory.md).

## Artifact Contract

- **Paths (Route B):** `brand/BRAND.md`, `brand/DESIGN.md`, `brand/ASSETS.md` · **Route A:** `brand/BRAND.md` only.
- **Lifecycle:** `canonical` — brand-of-record artifacts consumed by 10+ downstream marketing + product skills.
- **Versioning:** BRAND.md + DESIGN.md rename existing to `*.v[N].md` on re-run. ASSETS.md is a **living file** — always updated in place, dropped-platform rows move to `## Orphaned` (preserved); only versioned on explicit fresh-inventory request.
- **Frontmatter + section schema:** [`references/format-conventions.md`](references/format-conventions.md).
- **Review-gated:** write plain Markdown per [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md) + [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md) — **no HTML**. BRAND.md + DESIGN.md default `decision_state: pending` + `review_surface: html` + `## Review Gate`; preview via the optional **forsvn-preview** plugin. ASSETS.md → `decision_state: not_required` + `review_surface: none`, no Gate. v2 enum: `pending | approved | denied | suggested | not_required`.
- **Cross-stack contract:** schema changes (frontmatter, section headings, table columns) require atomic update of `format-conventions.md` + every downstream caller (write-copy, write-ad, write-outreach, brief-landing-page, brief-graphic, plan-campaign, humanmaxxing, polish-vn, brief-shortform, map-user-flow). The four review fields are additive — downstream callers consume brand content by heading match.

Full templates: [`references/artifact-templates.md`](references/artifact-templates.md).

## Chain Position

Previous: `research-icp` (product context) | Next: `plan-campaign`, `write-copy`, `brief-landing-page`, `brief-graphic`.

**Re-run triggers:** major product pivots, new markets, audience shifts, annual brand refresh.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships — 21-pattern catalog (13 brand-system pipeline + 4 cross-cutting + 2 narrative-tension + 2 brand-kit board). Most common: aesthetics-without-strategy, generic values, inventing ASSETS rows, overwriting human markers.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — Route A: BRAND.md, critic PASS. Route B: BRAND.md + DESIGN.md + ASSETS.md, critic PASS, ASSETS.md auto-scan complete.
- **DONE_WITH_CONCERNS** — artifacts written but critic flagged secondary issues (token coverage thin, archetype blend ambiguous, ASSETS.md Orphaned rows surfaced).
- **BLOCKED** — product context contradictory across audience and positioning (enterprise positioning + consumer voice); needs user reconciliation.
- **NEEDS_CONTEXT** — no audience/product description AND `research/product-context.md` absent; recommend `research-icp` first.

## Worked Example

End-to-end Route B (FinLit personal finance app, 3 platforms, full 8-agent dispatch, 74-row ASSETS.md, critic PASS) + Route A (TaskFlow MVP, 2 platforms, reduced critic): [`references/examples/brand-system-walkthrough.md`](references/examples/brand-system-walkthrough.md).
