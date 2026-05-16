---
title: Orchestrate-Meta Playbook
lifecycle: canonical
status: stable
produced_by: orchestrate-meta
load_class: PLAYBOOK
---

# Orchestrate-Meta Playbook

## Why this skill exists

The agent-skills stack has 35 skills across 4 stacks (research, marketing, product, meta) plus 9 orchestrators (4 stack-level + 5 stand-alone meta). A new operator — or a returning one with a fresh ask — should not have to remember which skill solves what. They type `/orchestrate-meta` and the router reads project state, parses the ask, and points at the right next step. The cost of bad routing isn't immediate failure; it's quietly running the wrong skill on the wrong inputs and discovering the mismatch after the work is done.

This skill exists because the alternative — operator-memorizes-the-catalog — doesn't scale and isn't what skills are for. Skills are entry points; routing should be cheap and proactive.

## Methodology

**Read state first, parse intent second, route third — never invert.** The cross-stack snapshot (what's on disk under `research/`, `brand/`, `architecture/`, `.agents/skill-artifacts/`, `skills-resources/experience/`) shapes how to interpret the ask. The same words mean different things depending on what's already built. "Help me launch X" with no ICP file points at /orchestrate-research first; same ask with a complete ICP + spec points at /orchestrate-marketing.

**Defer, don't substitute.** When intent is single-domain, route to that stack's orchestrator. Do NOT pick the specific skill yourself — the stack orchestrator has tighter state-detection rules and will pick better than this router can. The router's job is "you want research" not "you want icp-research."

**Print hand-off, never auto-invoke.** Operator types the next slash command. This is intentional: surfaces the choice, gives the operator a chance to redirect, leaves an audit trail of what was recommended.

## Principles

- **State drives routing.** A snapshot is required before any classification. Skip the snapshot and routing becomes guessing.
- **The manifest is the canonical state.** `.agents/manifest.json` is read first; filesystem scans are a fallback when the manifest is missing or stale.
- **One skill per recommendation, max 3 hops in cross-stack paths.** ≥5 hops means the project is too vague — surface that and recommend /discover instead of forcing a long chain.
- **Process intent gets a meta-skill, not a stack orchestrator.** "Debate this" → /agents-panel, not /orchestrate-research → maybe-agents-panel. Process skills are siblings to stack orchestrators, not children.
- **`discover` is for genuinely unclear scope** — defensive recommendations come across as patronizing when the operator has clear intent.
- **`task-breakdown` is hard-gated** on an upstream artifact (spec.md or system-architecture.md). Recommending it without one means recommending against nothing.
- **No critic gate, no sub-agents.** This is `budget: fast` — pure router. The premium-orchestration substrate (multi-agent + critic) lives in the skills this router proposes; running it here would be theater.

## History / origin

- **v3.0.0 rename** from `start-meta` to `orchestrate-meta` — aligned naming with `/orchestrate-research`, `/orchestrate-marketing`, `/orchestrate-product` siblings (all routers, all named the same way).
- **Phase 1E+ refactor (May 16, 2026, still v1.0.0):** body trimmed 307 → 128 lines per the v6 program; state-map template, output-formats, and anti-patterns extracted to refs; mode-resolver wired per Step 5; Before-Starting check + Artifact Contract block added per Step 7.5. Path-reference table extracted; per-branch logic preserved verbatim. No behavior change — pure body-diet + chain hardening. No version bump — refactor lands on the meta-skills 2.0 base as a commit, not a release.

## When NOT to use this skill

- **You already know your domain** → `/orchestrate-research`, `/orchestrate-marketing`, or `/orchestrate-product` directly. The cross-stack snapshot orchestrate-meta runs is wasted overhead if your intent is single-domain.
- **You already know your skill** → invoke it directly (`/discover`, `/icp-research`, `/copywriting`, etc.).
- **You're mid-work in a clear pipeline** — e.g., spec is done, you're decomposing tasks. Go straight to `/task-breakdown`. Re-entering the router adds latency.
- **You want to learn the catalog** — read the per-stack CLAUDE.md files (`meta-skills/CLAUDE.md`, etc.) directly. The router is for routing, not browsing.

## Further reading

- [`workflow-graph.md`](workflow-graph.md) — full cross-stack pipeline, decision rules, per-skill catalog
- [`output-formats.md`](output-formats.md) [PROCEDURE] — the three output shapes (single-domain, cross-stack, process-skill) the router emits
- [`state-map-template.md`](state-map-template.md) [PROCEDURE] — the state-map structure built during Step 1
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`_shared/manifest-spec.md`](_shared/manifest-spec.md) — manifest contract for Step 1 state detection
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (orchestrate-meta is already `budget: fast`, so the resolver's job is mostly enforcing the safety-gates-don't-skip rule)
