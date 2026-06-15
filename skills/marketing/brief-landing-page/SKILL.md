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

- **No brief without brand artifacts.** Missing `brand/BRAND.md` or `brand/DESIGN.md` → return `NEEDS_CONTEXT`. Brief depends on tokens, voice rules, sacred elements. **Design against the realized surface** — the live site / shipped page / approved exploration / house `CREATIVE-DIRECTION.md` — not tokens alone; cite ≥1 or record the explicit token-only fallback (`references/_shared/realized-surface-grounding.md`).
- **Conversion rubric is mandatory.** Every section spec is gated by `references/conversion-principles.md` CP-01 → CP-14. Brand-good but conversion-bad = failure.
- **Sacred elements are rails, not options.** Logo geometry, primary palette anchor, tagline wording, signature treatments are "do not touch."
- **Envelope: completeness is the gate.** G6 checks each section for headline candidates + CTA + conversion checklist; 250-500 lines typical; hard FAIL ~200/~700.
- **Don't inline the shared skill chain.** Reference by section header; add page-specific overrides only.
- **No placeholder testimonials, fake logos, or pretend numbers.** Spec the slot ("Customer logo grid, 6 cells × 60px") and note "delete cell if not real" — never fabricate.

## Inputs + Outputs

Full inputs table + output companions + per-slot artifacts: [`references/procedures/inputs-outputs.md`](references/procedures/inputs-outputs.md). Hard-required: page route/campaign name, `brand/BRAND.md`, `brand/DESIGN.md`. Main artifact: `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/brief.md`. Always-emitted companion: `handoff-implementation.md` (universal coding-agent prompt, stack auto-detected, Asset Placeholder Rule verbatim). Optional companions per `target_handoff`: `handoff-{claude-design,figma,designer}.md`.

## Quality Gate

Two critics run in parallel before delivery, both binary PASS/FAIL:

- **Conversion critic** scores against `references/conversion-principles.md` (CP-01 → CP-14). Full rubric in `agents/conversion-critic-agent.md`.
- **Brand-voice critic** scores sacred-element compliance, voice rules, surface language, token discipline, brief envelope (250-500 lines). Full rubric in `agents/brand-voice-critic-agent.md`.

Cycle 1/2 verdict matrix + per-FAIL routing rule (from critics' `fix direction` field, not hardcoded): [`references/agent-manifest.md`](references/agent-manifest.md) § "Layer 5 critic verdict logic". DONE_WITH_CONCERNS is the floor — every concern visible.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md).

### Hard gates (before any questioning)

1. **Brand artifacts.** `brand/BRAND.md` AND `brand/DESIGN.md` present. Missing → **NEEDS_CONTEXT**, recommend `create-brand`. Either >60 days stale → warn before proceeding.
2. **Route classification.** No existing page → Route A. Existing page or prior brief → Route B. Absence of analytics is NOT a blocker; label assumptions clearly.

Hard gates pass → proceed to Pre-Dispatch.

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). Needed dimensions: page identity (route + name, always supplied), tier (conversion-primary vs -secondary; programmatic out of scope), hypothesis intent, goal (leads/signups/purchases/demos), route (A or B, resolved by hard gates).

Warm/Cold Start prompts + 4-question Cold Start + Write-back map + Project-Specific Workflows + Context-to-Pass + hard-block conditions: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `--fast` collapses L1/1.5/2/3/3.5/4 to single-agent execution per layer, skips Layer 5 critic dispatch (critics noted as "skipped under --fast"). **`--fast` does NOT skip Hard Gates, 3 Approval Gates, or Critical Gates 1-6.** **Lean default (no `--fast` needed):** a ≤3-sentence single-scope ask with no prior artifacts auto-applies the per-layer single-agent collapse but KEEPS the Layer 5 critic; the 3 Approval Gates + Hard/Critical Gates always fire. Full multi-agent layers engage for broad, multi-section, or evidence-anchored (Route B) asks, or an upward override.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Routing + Approval Gates

Three routes (Route A fresh LP · Route B existing-LP redesign with mandatory "What Changed from rev N-1" · Route C re-run with `--rev=N`) and three STOP gates (Gate 1 Hypothesis Selection after L1.5 · Gate 2 Architecture Approval after L2 · Gate 3 Final Brief Acceptance after L5 critic merge) — all three gates fire even under `--fast`. Full dispatch graphs, presentation format, response handling, spawn mechanics, single-agent fallback: [`references/agent-manifest.md`](references/agent-manifest.md) + [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/brief.md` (versioned re-runs: `v[N]/brief.md` for `--rev=N`).
- **Companions:** always `handoff-implementation.md`; optional `handoff-{claude-design,figma,designer}.md` per `target_handoff`. Per-slot `asset-slots/{slot-id}.prompt.md` written downstream by `brief-graphic`.
- **Lifecycle:** `pipeline` — versioned re-runs preserve prior versions.
- **Frontmatter:** 17 fields — see [`references/format-conventions.md`](references/format-conventions.md) and [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md) § provenance two-variants. Provenance is required so `evaluate-landing-page` can ground scoring on `input_artifacts` and `_dev/eval/promote-to-experience.ts` can walk `output_eval`.
- **Body:** 15 sections (Title block · Concerns · IMC Context · Hypothesis Approved · What Changed from rev N-1 · Page Architecture · Section-by-Section Spec · Asset Slots · What NOT to Do · Implementation Prompt · Hand-Off · Pre-flight Checklist · Skill Chain · Launch Plan + Results + Why This Works · Review Gate).
- **Envelope:** completeness-gated (G6); 250-500 lines typical.

- **Cross-stack contract:** consumed by human designers + coding agents + `brief-graphic` (per slot) + `evaluate-landing-page` cycles (when brief referenced from loop's `strategy/`). Schema changes require atomic update across upstream callers (`plan-campaign`) + downstream consumers (`brief-graphic`, coding agents, `evaluate-landing-page`).

Full artifact template byte-identical: [`references/format-conventions.md`](references/format-conventions.md).

## Chain Position

Previous: `plan-campaign` (optional — campaign context), `create-brand` (required) | Next: `brief-graphic` per asset slot (optional), then implementation (Claude Design / image-gen / human designer).

**Re-run triggers:** post-launch performance evidence, BRAND.md/DESIGN.md update, ICP refresh, traffic source pivot. Increment `--rev=N`.

**Skill deference:** post-launch CRO from real evidence → `evaluate-landing-page` inside `run-pipeline`. Single visual asset spec → `brief-graphic`. No brand → `create-brand` first. Headline variations only → `write-copy`. Non-LP page (blog, docs) → out of scope.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before brief ships — 12 brief-specific + 4 cross-cutting + 3 design-handoff prompting (19 total). Most common: ignoring sacred elements (G1 sacred 4/4 auto-FAIL), brief too long (G6 envelope), coding-agent inventing asset URLs (G8b Asset Placeholder Rule), hero copy violating voice (G2 Forbidden Vocabulary single-hit FAIL).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — both critics PASS (cycle 1 or 2), brief approved, artifacts written.
- **DONE_WITH_CONCERNS** — after 2 cycles, ≥1 critic still FAIL or mixed; concerns pinned at top of `brief.md` AND in frontmatter. User sees both reports at Gate 3 and ships consciously.
- **BLOCKED** — user rejected at a gate, or required input missing mid-flow.
- **NEEDS_CONTEXT** — `BRAND.md` or `DESIGN.md` missing; cannot proceed.

## Execution

At brief-binding, bind the `design` target tool — inherit `tool_targets` or ask once per `references/_shared/tool-target.md`; tool-agnostic is the default.
After Gate 3 PASS, offer the registry-gated fork (category `design`) — **Brief-only**: hand `handoff-implementation.md` to a coding agent / Claude Design / Figma / designer; **Assisted/Direct**: a verified engine builds it end-to-end (returns a URL → `evaluate-landing-page`), you approve at the gate. See [execution-fork.md](references/_shared/execution-fork.md); record `execution_mode`. Re-invoke `--rev=N` after post-launch evidence triggers a redesign.

## Worked Examples

Three end-to-end walkthroughs (Route A fresh LP, Route B evidence-anchored redesign, Route C `--rev=N` with mixed-critic verdict): [`references/examples.md`](references/examples.md).
