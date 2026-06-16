---
name: brief-product-ui
description: "Designs the in-product interface from a validated map-user-flow — screen inventory, a reusable component system, DESIGN-token application, per-state visual treatments, accessibility floor, and a buildable handoff. Emits a portable SPEC, never rendered UI. Use after a user flow exists and before architect-system. Not for brand identity (create-brand), conversion landing pages (brief-landing-page), or technical architecture (architect-system)."
argument-hint: "[feature or map-user-flow slug/path]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "1.1.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Product-UI Brief — Interface Spec Orchestrator

*Design Step between flow and tech. Turns a validated `map-user-flow` + DESIGN tokens into a screen/component/layout/state spec a design tool or coding agent can build — a portable artifact, not a render.*

**Core Question:** "Could a design tool or coding agent build every screen — branded, state-complete, component-consistent — from this spec without a follow-up question?"

> Why, methodology, principles: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## When To Use

Design the in-product screens/components/layout for a feature whose **flow is already mapped** — applying brand tokens, a reusable component system, and per-state visual treatments, then handing off to a build surface.

**Not for:** flow logic (`/map-user-flow`, the prerequisite) · brand identity (`/create-brand`) · conversion landing pages (`/brief-landing-page`) · API/schema/tech (`/architect-system`) · decomposition (`/breakdown-tasks`).

**Why this exists (not a renderer).** External taste skills (impeccable / hallmark / stitch / frontend-design) *render*. This skill emits a **portable, brand-tokened, flow-grounded, reviewable spec** under `docs/forsvn/artifacts/product/`, then hands off to any of them. The `--render`/`--api` → BLOCKED gate is the identity guarantee. If you want pixels, take the handoff fork.

## Critical Gates — Read First

1. **No design before a validated flow.** A parseable `map-user-flow` artifact must exist → else `NEEDS_CONTEXT`.
2. **No invented screens.** Every screen/state/surface traces to a flow screen/state/edge.
3. **Spec, never render.** `--render`/`--api` → `BLOCKED`. This skill emits a buildable spec; drive it through a tool via the handoff fork.
4. **Tokens, not raw values.** Every color/space/type/radius references a DESIGN token; brand rules hold when the house brand is the source; tokens absent → `brand_source: cold-start-hint`.
5. **Every state gets a visual treatment.** Full state set per interactive element; every screen's empty/loading/error specified, not "show error."

Full rationale + the 8-checkpoint critic rubric: [`references/procedures/gates-and-rubric.md`](references/procedures/gates-and-rubric.md) [PROCEDURE].

## Quality Gate

Critic (`agents/critic-agent.md`) runs an 8-checkpoint rubric, each binary PASS/FAIL — all must PASS:

- **CP-01** Flow grounding · **CP-02** Component reuse & hierarchy · **CP-03** Token fidelity · **CP-04** Layout system · **CP-05** State coverage · **CP-06** Accessibility floor · **CP-07** Handoff readiness · **CP-08** No-render discipline

Full checkpoint detail + rewrite routing: [`references/procedures/gates-and-rubric.md`](references/procedures/gates-and-rubric.md).

## Before Starting

Apply `references/_shared/before-starting-check.md` [PLAYBOOK]. `budget: deep`; `--fast` collapses Layer 1 to single-pass per `references/_shared/mode-resolver.md` [PROCEDURE]. **Safety gates supersede `--fast`.**
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

| Artifact | Source | Required? |
|---|---|---|
| `docs/forsvn/artifacts/product/flow/<slug>.md` | map-user-flow | **Hard** — the flow is the contract (resolved via `manifest.json`); absent → `NEEDS_CONTEXT` |
| `brand/{DESIGN,BRAND}.md` | create-brand | Soft — absent → `brand_source: cold-start-hint` |
| `research/product-context.md` | research-icp | Optional — usability priorities |

## Pre-Dispatch

**Dimensions:** feature, flow artifact (path), target surfaces (from the flow), brand source, target build engine (design tool / coding agent / Figma), constraints. Read order + Warm/Cold Start prompts + write-back: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/product/brief-product-ui-<YYYY-MM-DD>-<slug>.md` (by-stack v3; `stack: product`; one file per feature). **Lifecycle:** `pipeline`.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack: product`, `type`, `id`, `keywords`, `review_surface: html` (FIRE preview while `decision_state: pending`), `decision_state`, `source_flow`, `brand_source`, plus manifest-sync `lifecycle`, `produced_by`, `provenance`. Schema: [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Sections (9, in order) + per-section template:** TL;DR · Screen Inventory · Component System · Token Application Map · Per-Screen Layout Spec · Interaction & State Spec · Accessibility Notes · Handoff · What NOT To Render. Full template: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].
- **Consumed by:** `architect-system` (tech follows UI), `breakdown-tasks`, a coding agent / design tool.

## Tooling

Production mode can run **inside** a connected design tool (Figma / Stitch / Open Design) or emit a portable spec. Upstream choice (default = portable spec): [`references/_shared/tool-redirect.md`](references/_shared/tool-redirect.md). Terminal handoff, category `design`: [`references/_shared/execution-fork.md`](references/_shared/execution-fork.md). Live-drive upstream pre-answers the terminal fork — don't ask twice.
When not live-driving, bind the `design` target tool at brief-binding (the build surface the spec's handoff tunes to) — inherit `tool_targets` or ask once per `references/_shared/tool-target.md`; the portable spec stays the default.

## Routing + Dispatch

Single route, full stack. **Pipeline:** Step 0 (intake-validator gate) → L1 ∥ (screen-inventory ∥ component-system ∥ token-application) → Merge → L2 seq (layout-state) → L3 (handoff) → L4 (critic). Critic FAIL re-dispatches the named agent (max 2 cycles).

Agent roster + dispatch graph: [`references/agent-manifest.md`](references/agent-manifest.md). Spawn mechanics + Single-Agent Fallback: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Worked example: [`references/examples/saas-dashboard-walkthrough.md`](references/examples/saas-dashboard-walkthrough.md) [EXAMPLE].

## Anti-Patterns

10-pattern catalog (invented screens, rendering instead of speccing, raw hex/px, per-screen component one-offs, "show error" hand-waving, skipped accessibility floor + 4 cross-cutting): [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN].

## Chain Position

Prev: `map-user-flow` (**required**) ← `create-brand` (optional tokens). Next: `architect-system` → `breakdown-tasks`, or the handoff fork to a build surface. **Defer to:** `map-user-flow`, `create-brand`, `brief-landing-page`. **Re-run on:** flow changes, token/brand changes, new surfaces.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — every flow screen specified with components, tokens, layout, full states, accessibility floor, and a buildable handoff; critic PASS (all 8 CPs).
- **DONE_WITH_CONCERNS** — delivered but a surface is under-specified (e.g., responsive behavior unverified, cold-start tokens); flagged inline; or critic FAILed twice with annotations.
- **BLOCKED** — `--render`/`--api` requested, or the spec cannot be built without rendering.
- **NEEDS_CONTEXT** — no `map-user-flow` artifact; recommend `/map-user-flow`.
