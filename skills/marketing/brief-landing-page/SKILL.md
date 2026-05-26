---
name: brief-landing-page
description: "Generates a campaign-grade brief for a conversion landing page or redesign — hypothesis, surface rhythm, section-by-section spec, asset slots, copy candidates, hand-off prompts, conversion + brand-voice critics. Output ready for Claude Design, Figma, a human designer, or a coding agent. Not for post-launch CRO from analytics (use evaluate-landing-page inside an eval-loop), non-conversion pages (blogs, docs), or a single visual asset (use brief-graphic)."
argument-hint: "[page route or campaign name, e.g. '/pricing' or 'q3-launch-lp']"
allowed-tools: Read Edit Write Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.1.0"
  budget: deep
  estimated-cost: "$2-4"
---

# Landing Page Brief — Orchestrator

Coordinates evidence anchoring, hypothesis generation, architecture, per-section spec, asset slotting, conversion gating, and hand-off prompt composition into a single approved brief. Capability metadata (routes, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 3 routes + 3 Approval Gates + critic verdict logic: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Could a designer (or Claude Design) build the right page from this brief without a single follow-up question?

## Critical Gates — load first

- **No brief without brand artifacts.** Missing `brand/BRAND.md` or `brand/DESIGN.md` → return `NEEDS_CONTEXT`. Brief depends on tokens, voice rules, sacred elements.
- **Conversion rubric is mandatory.** Every section spec is gated by `references/conversion-principles.md` CP-01 → CP-13. Brand-good but conversion-bad = failure.
- **Sacred elements are rails, not options.** Logo geometry, primary palette anchor, tagline wording, signature treatments are "do not touch."
- **Envelope: 250-500 lines.** <250 = insufficient depth (designer asks follow-ups). >500 = bloat (designer skims). Brand-voice critic G6 FAILs both directions.
- **Don't inline the shared skill chain.** Reference by section header; add page-specific overrides only.
- **No placeholder testimonials, fake logos, or pretend numbers.** Spec the slot ("Customer logo grid, 6 cells × 60px") and note "delete cell if not real" — never fabricate.

## Inputs

| Artifact | Required? | What it provides |
|---|---|---|
| Page route or campaign name (`/pricing`, `q3-launch-lp`) — current state if exists (URL/screenshot/code) | **required** | Subject of the brief |
| `brand/BRAND.md` | **required** (NEEDS_CONTEXT if absent) | Voice, archetype, sacred elements, lexicon rules |
| `brand/DESIGN.md` | **required** (NEEDS_CONTEXT if absent) | Palette, typography, surface language, motion tokens |
| Existing page state (URL/screenshot/code) | optional but recommended | Inform redesign without blocking the brief |
| Post-launch evidence (analytics, heatmaps, experiment notes) | optional | Stronger evidence for redesign hypotheses; absent → labeled assumption |
| `research/icp-research.md` | optional | Objections + VoC for copy candidates |
| `research/product-context.md` | optional | Product accuracy in features/proof |
| `.forsvn/artifacts/mkt/campaign-plan.md` | optional | Traffic source, awareness stage, funnel role |
| `.forsvn/artifacts/meta/records/targets-*.md` | optional | Conversion target informs CTA aggressiveness |

## Output

`.forsvn/artifacts/mkt/brief-landing-page/[slug]/brief.md` — single main artifact.

Always-emitted companion:

- `handoff-implementation.md` — paste-ready prompt for any coding agent (Claude Code / Cursor / Codex / Opus / Gemini / GPT). Stack auto-detected from repo (frameworks → that stack; no framework → pure HTML/CSS/Vanilla JS, single index.html). Motion stack from `brand/DESIGN.md` (silent → GSAP+ScrollTrigger+Lenis). Carries verbatim Asset Placeholder Rule so coding agents never invent stock-photo URLs.

Optional companions per `target_handoff`:

- `handoff-claude-design.md` — verbatim prompt block for claude.ai/design
- `handoff-figma.md` — design spec for Figma designer
- `handoff-designer.md` — narrative brief for human designer

Per-slot artifacts (written by downstream `brief-graphic`, not by brief-landing-page itself):

- `asset-slots/{slot-id}.prompt.md`. Slots with `route: pending-media-skill` have no prompt yet — implementation prompt renders them as solid-color placeholders until a future media-briefing skill catches up.

## Quality Gate

Two critics run in parallel before delivery, both binary PASS/FAIL:

- **Conversion critic** scores against `references/conversion-principles.md` (CP-01 → CP-13). Full rubric in `agents/conversion-critic-agent.md`.
- **Brand-voice critic** scores sacred-element compliance, voice rules, surface language, token discipline, brief envelope (250-500 lines). Full rubric in `agents/brand-voice-critic-agent.md`.

Cycle 1/2 verdict matrix + per-FAIL routing rule (from critics' `fix direction` field, not hardcoded): [`references/agent-manifest.md`](references/agent-manifest.md) § "Layer 5 critic verdict logic". DONE_WITH_CONCERNS is the floor — every concern visible.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md).

### Hard gates (before any questioning)

1. **Brand artifacts.** `brand/BRAND.md` AND `brand/DESIGN.md` present. Missing → **NEEDS_CONTEXT**, recommend `create-brand`. Either >60 days stale → warn before proceeding.
2. **Route classification.** No existing page → Route A. Existing page or prior brief → Route B. Absence of analytics is NOT a blocker; label assumptions clearly.

Hard gates pass → proceed to Pre-Dispatch.

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). Needed dimensions:

- Page identity — route + name (always supplied — not asked).
- Tier — conversion-primary (hero LP, /pricing, /services) or conversion-secondary (/about, /story). Programmatic out of scope.
- Hypothesis intent — what's this page trying to prove?
- Goal — leads / signups / purchases / demos.
- Route (A or B) — already resolved by hard gates.

Warm/Cold Start prompts + 4-question Cold Start template + Write-back map + Project-Specific Workflows + Context-to-Pass + hard-block conditions: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `--fast` collapses L1/1.5/2/3/3.5/4 to single-agent execution per layer, skips Layer 5 critic dispatch (critics noted as "skipped under --fast"). **`--fast` does NOT skip Hard Gates, 3 Approval Gates (user-facing contract), or Critical Gates 1-6.**

## Routing

Three routes — full dispatch graphs in [`references/agent-manifest.md`](references/agent-manifest.md):

- **Route A — Fresh LP** (no existing page).
- **Route B — Existing LP redesign** (evidence-anchored; "What Changed from rev N-1" section mandatory when prior brief exists).
- **Route C — Re-run with `--rev=N`** (read prior at `v[N-1]/brief.md`, diff against fresh inputs, save to `v[N]/brief.md`).

Spawn mechanics + single-agent fallback: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Approval Gates — STOP points

Three gates between layers — all three fire even under `--fast`. Full presentation format + response handling: [`references/agent-manifest.md`](references/agent-manifest.md) § "Approval Gates".

- **Gate 1** (after L1.5) — Hypothesis Selection. Present 3 A/B/C with 3Q score. *Pick one, revise, or kill all.*
- **Gate 2** (after L2) — Architecture Approval. Present Surface Rhythm + Section List + ASCII diagram + Scroll Velocity Plan. *Approve, revise, or reject.*
- **Gate 3** (after L5 critic merge) — Final Brief Acceptance. Present brief preview + both critic verdicts + concerns. *Approve, request revisions, or reject.*

## Artifact Contract

- **Path:** `.forsvn/artifacts/mkt/brief-landing-page/[slug]/brief.md` (versioned re-runs: `v[N]/brief.md` for `--rev=N`).
- **Always-emitted companion:** `handoff-implementation.md`.
- **Optional companions:** `handoff-{claude-design,figma,designer}.md` per `target_handoff`.
- **Per-slot artifacts** (downstream `brief-graphic`, not this skill): `asset-slots/{slot-id}.prompt.md`.
- **Lifecycle:** `pipeline` — versioned re-runs preserve prior versions.
- **Frontmatter:** 17 fields — see [`references/format-conventions.md`](references/format-conventions.md) and [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md) § provenance two-variants. Provenance is required so `evaluate-landing-page` can ground scoring on `input_artifacts` and `scripts/eval/promote-to-experience.ts` can walk `output_eval`.
- **Body:** 15 sections (Title block · Concerns · IMC Context · Hypothesis Approved · What Changed from rev N-1 · Page Architecture · Section-by-Section Spec · Asset Slots · What NOT to Do · Implementation Prompt · Hand-Off · Pre-flight Checklist · Skill Chain · Launch Plan + Results + Why This Works · Review Gate).
- **Envelope:** 250-500 lines, enforced strictly by brand-voice critic G6.
- **Review-gated:** carries review machinery but `decision_state` defaults to `not_required` — most runs are regenerable drafts. Operator or loop can opt a run into review by setting `decision_state: pending`. Field semantics: [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); procedure: [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md).
- **Cross-stack contract:** consumed by human designers + coding agents + `brief-graphic` (per slot) + `evaluate-landing-page` cycles (when brief referenced from loop's `strategy/`). Schema changes require atomic update across upstream callers (`plan-campaign`) + downstream consumers (`brief-graphic`, coding agents, `evaluate-landing-page`).

Full artifact template byte-identical: [`references/format-conventions.md`](references/format-conventions.md).

## Chain Position

Previous: `plan-campaign` (optional — campaign context), `create-brand` (required) | Next: `brief-graphic` per asset slot (optional), then implementation (Claude Design / image-gen / human designer).

**Re-run triggers:** post-launch performance evidence, BRAND.md/DESIGN.md update, ICP refresh, traffic source pivot. Increment `--rev=N`.

**Skill deference:** post-launch CRO from real evidence → `evaluate-landing-page` inside `run-eval-loop`. Single visual asset spec → `brief-graphic`. No brand → `create-brand` first. Headline variations only → `write-copy`. Non-LP page (blog, docs) → out of scope.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before brief ships — 12 brief-specific + 4 cross-cutting + 3 design-handoff prompting (19 total). Most common in practice: ignoring sacred elements (Critical Gate 3 + brand-voice critic G1 sacred 4/4 auto-FAIL), brief too long (Critical Gate 4 + G6 envelope), coding-agent inventing asset URLs (G8b Implementation Prompt Compliance — Asset Placeholder Rule), hero copy violating voice (G2 Forbidden Vocabulary single-hit FAIL).

## Completion Status

- **DONE** — both critics PASS (cycle 1 or 2), brief approved, artifacts written.
- **DONE_WITH_CONCERNS** — after 2 cycles, ≥1 critic still FAIL or mixed; concerns pinned at top of `brief.md` AND in frontmatter. User sees both reports at Gate 3 and ships consciously.
- **BLOCKED** — user rejected at a gate, or required input missing mid-flow.
- **NEEDS_CONTEXT** — `BRAND.md` or `DESIGN.md` missing; cannot proceed.

## Worked Examples

Three end-to-end walkthroughs (Route A fresh LP, Route B evidence-anchored redesign, Route C `--rev=N` with mixed-critic verdict): [`references/examples.md`](references/examples.md).
