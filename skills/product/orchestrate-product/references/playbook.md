---
title: Orchestrate-Product Playbook
lifecycle: canonical
status: stable
produced_by: orchestrate-product
load_class: PLAYBOOK
---

# Orchestrate-Product Playbook

## Why this skill exists

The product-skills stack has 6 skills (`user-flow`, `system-architecture`, `code-cleanup`, `machine-cleanup`, `docs-writing`, plus this router) and two cross-stack meta-skills that sit inside the product pipeline (`discover` upstream of any build; `task-breakdown` downstream of architecture). An operator picking up the stack — or a returning one with a fresh ask — should not have to remember which skill solves what. They type `/orchestrate-product` and the router reads product-stack state, parses the ask, and points at the right next step. The cost of bad routing isn't immediate failure; it's running `system-architecture` against no flows and getting a hollow blueprint, or recommending `docs-writing` when the operator meant ship-log mode and getting a stock README.

This skill exists because the alternative — operator-memorizes-the-catalog — doesn't scale and isn't what skills are for. Skills are entry points; routing should be cheap and proactive.

## Methodology

**Read state first, parse intent second, route third — never invert.** The product-stack snapshot (`architecture/`, `.agents/skill-artifacts/product/flow/`, `.agents/skill-artifacts/meta/specs/`, `.agents/skill-artifacts/meta/tasks.md`, cleanup records, `research/product-context.md`) shapes how to interpret the ask. "Design how this is built" with no flows points at `/user-flow` first; same ask with all flows mapped points straight at `/system-architecture`.

**Defer upward when scope is unclear.** If the user wants flow-mapping or architecture but there's no spec and no resolvable product-context, soft-defer to `/discover` (meta) before routing into the product pipeline. Better one extra hop than a hollow artifact downstream.

**Defer downward to `task-breakdown` only with the upstream artifact.** `task-breakdown` is hard-gated on `meta/specs/*.md` OR `architecture/system-architecture.md`. Without one, recommend the upstream skill (`discover` or `system-architecture`) first.

**Print hand-off, never auto-invoke.** Operator types the next slash command. This surfaces the choice, gives the operator a chance to redirect, leaves an audit trail.

## Principles

- **State drives routing.** A snapshot is required before any classification. Skip the snapshot and routing becomes guessing.
- **The manifest is canonical state.** `.agents/manifest.json` is read first; filesystem scans are a fallback when the manifest is missing or stale.
- **Standalone branches are standalone.** `code-cleanup` and `machine-cleanup` have no upstream gates and never get bundled into pipeline recommendations. Recommending them alongside flow-mapping or architecture is a category error.
- **`user-flow` is the natural upstream of `system-architecture`.** Architecture works without flows but is sharper with them — flows define what screens/transitions exist, architecture defines how to build them. The router should flag this asymmetry, not enforce it.
- **`docs-writing` has modes** — README / API ref / runbook / ship-log / setup guide (release-notes is supported by docs-writing but not router-routed today; v6.3.0 deferred). Always ask which mode after routing, or surface a list. Recommending it as a single mode misses what the operator wanted.
- **Don't cross-route except to `discover` and `task-breakdown`.** These two meta-skills sit *inside* the product workflow (clarify-then-build, then decompose). All other meta-skills + all research/marketing skills route through `/orchestrate-meta`.
- **No critic gate, no sub-agents.** This is `budget: fast` — pure router. The premium-orchestration substrate lives in the skills this router proposes; running it here would be theater.

## History / origin

- **v3.0.0 rename** from `start-product` to `orchestrate-product` — aligned naming with `/orchestrate-research`, `/orchestrate-marketing`, `/orchestrate-meta` siblings (all routers, all named the same way).
- **v6 Phase 2 Wave 1 refactor (May 17, 2026, still v1.0.0):** body trimmed 242 → 128 lines (-47.1%, under ≤150 router target by 22 lines) per the v6 program; state-map template, output-formats, anti-patterns extracted to refs; mode-resolver wired; Before-Starting check + Artifact Contract block added per Step 7.5. Per-branch logic preserved verbatim. No behavior change — pure body-diet + chain hardening. No version bump — refactor lands on the product-skills 2.0 base as a commit, not a release. Mirrors orchestrate-meta's post-refactor structure exactly (per `implementation-roadmap/refactor/stacks/product.md` instruction).

## When NOT to use this skill

- **You already know your skill** → invoke it directly (`/user-flow`, `/system-architecture`, `/code-cleanup`, `/machine-cleanup`, `/docs-writing`).
- **Your task is cross-stack** (e.g., needs research + product) → use `/orchestrate-meta`.
- **You're mid-pipeline in clear sequence** — e.g., flows mapped, ready for architecture. Go straight to `/system-architecture`. Re-entering the router adds latency.
- **You want to learn the catalog** — read `product-skills/CLAUDE.md` + `references/workflow-graph.md` directly. The router is for routing, not browsing.

## Further reading

- [`workflow-graph.md`](workflow-graph.md) — full product-stack pipeline + per-skill catalog + decision rules
- [`output-formats.md`](output-formats.md) [PROCEDURE] — the four output shapes (single-route, combined-path, process-skill, scoping fallback)
- [`state-map-template.md`](state-map-template.md) [PROCEDURE] — manifest signals + filesystem fallback paths + state map structure
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`_shared/manifest-spec.md`](_shared/manifest-spec.md) — manifest contract Step 1 reads
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (orchestrate-product is already `budget: fast`, so the resolver's job is mostly enforcing the safety-gates-don't-skip rule)
