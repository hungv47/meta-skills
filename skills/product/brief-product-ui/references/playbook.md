---
title: Product UI Playbook
lifecycle: canonical
status: stable
produced_by: brief-product-ui
load_class: PLAYBOOK
---

# Product UI Playbook

## Why this skill exists

After `map-user-flow` produces a validated flow artifact, there is no skill that converts that flow into a screen-level, brand-tokened, component-specified interface spec. The gap is specific:

- **`map-user-flow`** stops at flow logic and low-fidelity wireframes — it explicitly is "not for visual brand design."
- **`architect-system`** is tech-only: schemas, APIs, file structure, deployment topology.
- **`brief-landing-page`** is conversion-locked to single-page marketing surfaces.

Nothing takes _(validated flow + DESIGN/BRAND tokens)_ → _(screen inventory, component system, token-applied layout/state spec)_ → _(buildable handoff)_. `brief-product-ui` fills exactly that slot in the product stack: the bridge from "what the user does" to "what the interface looks and behaves like, completely specified."

## The SPEC-not-renderer principle

This skill is a **specifier, not a renderer**. It emits a portable, reviewable, brand-tokened spec filed under `.forsvn/artifacts/product/` — a FORSVN artifact that dogfoods the product's own artifact graph — then hands off to an external build surface (Figma, Stitch, Open Design, or a coding agent like `/ce-frontend-design`).

The no-render gate is not a limitation. It is the identity.

- `--render` and `--api` are explicitly BLOCKED. The operator's renderer (impeccable, hallmark, stitch, `ce-frontend-design`) consumes the spec; this skill does not race it.
- Portability is the value: a spec that decouples "what to build" from "who builds it" survives toolchain changes, design-to-code transitions, and multi-agent handoffs.
- Reviewability is the FORSVN contract: the artifact is human-reviewable at the decision gate before anything is built.

The distinction matters. Many tools collapse spec and render into one step, which ties the output to a specific renderer and makes the spec unreviewed. `brief-product-ui` separates them.

## Methodology

**Flow is the contract.** The prerequisite `map-user-flow` artifact defines every screen in scope. This skill enumerates from it — no screen is invented. If the flow doesn't include a screen, the spec doesn't include a screen.

**Pipeline shape: intake → L1 parallel → merge → layout/state → handoff → critic.**

1. **Intake + validation** — verify the prerequisite flow artifact (path, status `done`), load DESIGN/BRAND tokens, resolve mode tier.
2. **Layer 1 parallel** — three agents run simultaneously: _screen-inventory_ (enumerate screens from the flow), _component-system_ (extract reusable components, define the vocabulary), _token-application_ (map brand tokens to each component and screen state).
3. **Merge** — reconcile the three parallel outputs into a coherent spec: component names consistent with screen inventory, token assignments consistent with component definitions.
4. **Layout + state specification** — for each screen: layout grid, component placement, every interaction state (idle, loading, error, empty, success). This is where the spec becomes buildable.
5. **Handoff** — produce the handoff block: component list with prop surfaces, state matrix, token manifest, implementation notes. The build surface consumes this directly.
6. **Critic gate** — 8-checkpoint rubric. See [`procedures/gates-and-rubric.md`](procedures/gates-and-rubric.md) for the full CP-01–CP-08 definitions. FAIL re-dispatches the named agent; max 2 cycles.

Full artifact structure (9 required sections) is defined in [`format-conventions.md`](format-conventions.md).

## Core principles

**Flow-grounded.** Every screen in the spec must trace to a node in the prerequisite flow artifact. No invented screens, no scope expansion inside this skill. If the flow is incomplete, this skill returns `NEEDS_CONTEXT` and names what's missing.

**Systematic.** Components are extracted once and reused across screens — not defined per-screen. A component defined for Screen 3 that also appears on Screen 7 is the same component, not two independent descriptions. Repetition is a failure mode, not thoroughness.

**Token-true.** No raw color values, spacing numbers, or font sizes appear in the spec. Every visual value references a design token (from DESIGN/BRAND files). Brand rules are honored: leaf as state cue only, no glass panels, matte surfaces, correct typeface roles. A spec that hard-codes `#74B36B` has failed token-application.

**Buildable without questions.** The Core Question: _can a frontend engineer or design tool implement this spec without asking a single clarifying question?_ If the answer is no — a state is unspecified, a token is missing, a component prop is ambiguous — the spec is not done. The handoff block is the final checkpoint for this.

## When NOT to use this skill

- **Flow does not exist yet** — run `map-user-flow` first; this skill requires a `done` flow artifact as input.
- **Visual brand identity from scratch** — use `create-brand`.
- **Marketing / conversion-surface design** — use `brief-landing-page`.
- **Technical API, schema, or file structure** — use `architect-system`.
- **Rendering or generating actual UI assets** — use `impeccable`, `hallmark`, `ce-frontend-design`, or a design tool directly after receiving this spec.
- **Task decomposition from the spec** — use `breakdown-tasks` downstream.

## History

- **Created 2026-06-07** — new deep-tier product skill. Fills the upstream tool-redirect: `map-user-flow` and `architect-system` previously had no downstream spec skill for the (flow + tokens) → interface-spec pipeline. `brief-product-ui` is the product-stack home for that redirect, registered in the product capability registry (`id: product-ui`), consuming `map-user-flow`'s `id: user-flow` artifact and sitting `map-user-flow → brief-product-ui → architect-system` in the chain.

## Further reading

- [`format-conventions.md`](format-conventions.md) — 9 required artifact sections, frontmatter contract, filename grammar
- [`procedures/gates-and-rubric.md`](procedures/gates-and-rubric.md) — CP-01–CP-08 critic rubric (SoT)
- [`anti-patterns.md`](anti-patterns.md) — failure modes catalog
- [`agent-manifest.md`](agent-manifest.md) — agent roster, roles, dispatch protocol
