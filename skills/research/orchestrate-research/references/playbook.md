---
title: Orchestrate-Research Playbook
lifecycle: canonical
status: stable
produced_by: orchestrate-research
load_class: PLAYBOOK
---

# Orchestrate-Research Playbook

## Why this skill exists

The research-skills stack has 8 skills — `icp-research`, `market-research`, `diagnose`, `prioritize`, `funnel-planner`, `short-form-research`, `short-form-eval`, plus this router. The pipeline isn't strictly linear: audience-first (`icp-research`) feeds everything else; `market-research` and `diagnose` are independent branches; `prioritize` consumes upstream artifacts to rank initiatives; `funnel-planner` sets numeric targets after prioritization. `short-form-research` is a separate per-platform cycle that feeds the marketing stack's short-form chain. An operator picking up the stack — or a returning one with a fresh ask — should not have to remember which skill solves what. They type `/orchestrate-research` and the router reads research-stack state, parses the ask, and points at the right next step.

The cost of bad routing isn't immediate failure; it's running `market-research` against no ICP foundation and getting a hollow landscape disconnected from any buyer, or recommending `prioritize` without upstream context and getting an ICE table built from prompt-only guesses. This skill exists because the alternative — operator-memorizes-the-catalog — doesn't scale and isn't what skills are for. Skills are entry points; routing should be cheap and proactive.

## Methodology

**Read state first, parse intent second, route third — never invert.** The research-stack snapshot (`research/product-context.md`, `research/icp-research.md`, `research/market-research.md`, `.agents/skill-artifacts/meta/records/diagnose-*.md`, `.agents/skill-artifacts/meta/sketches/prioritize-*.md`, `.agents/skill-artifacts/meta/records/targets-*.md`, `skills-resources/experience/{audience,business}.md`) shapes how to interpret the ask. "I want to understand my market" with no ICP routes to `/icp-research` first; same ask with ICP done routes straight to `/market-research`.

**Audience-foundation gate is the load-bearing rule.** 13+ skills downstream consume `research/product-context.md`. The router's most common correct intervention is "you asked for market / diagnose / prioritize but have no ICP foundation — start there." Skipping ICP produces hollow downstream output. The router never silently routes past a missing ICP foundation when the intent depends on it.

**`prioritize` and `funnel-planner` are hard-gated.** Their Pre-Dispatch refuses to run without upstream artifacts. The router enforces the same gate at routing time: recommend the upstream skill (`diagnose` or `market-research` for prioritize; `prioritize` for funnel-planner) instead of letting the downstream skill block on its own gate.

**Print hand-off, never auto-invoke.** Operator types the next slash command. This surfaces the choice, gives the operator a chance to redirect, leaves an audit trail.

## Principles

- **State drives routing.** A snapshot is required before any classification. Skip the snapshot and routing becomes guessing.
- **The manifest is canonical state.** `.agents/manifest.json` is read first; filesystem scans are a fallback when the manifest is missing or stale.
- **ICP is the spine.** `research/product-context.md` (created by `/icp-research`) is read by every other research skill and by 13+ marketing/product skills downstream. The router treats "no ICP" as a hard precondition for any audience-or-strategy ask.
- **`diagnose` requires a specific problem statement.** "Things feel off" is not a diagnose input — push back and ask for a metric or symptom before routing. Generic-ask diagnose produces generic verdicts.
- **`market-research` and `diagnose` are siblings, not sequential.** Both consume ICP. `market-research` maps the landscape; `diagnose` root-causes a specific problem. They serve different intents — don't recommend both unless the operator's ask spans both.
- **Stale ICP is warn-but-don't-block.** If `research/icp-research.md` is older than 90 days or product-context drifted, surface the staleness and offer refresh — don't force a rerun.
- **Skip-rules:** if the operator explicitly says "I just want prioritize" without upstream artifacts, respect it BUT note the output quality drop ("Without market-research, prioritize will rely on whatever context you put in the prompt").
- **Don't cross-route except to `orchestrate-marketing` and `orchestrate-product`.** When the stack is exhausted ("all 5 core artifacts done"), recommend a different stack orchestrator. Otherwise routes stay inside research.
- **`short-form-research` is per-platform-per-cycle, not pipeline.** It's the research-side feed for the marketing stack's short-form chain (`short-form-brief` consumer). When operator asks "research short-form trends for TikTok," route to it as a standalone with the platform argument — never bundle it into the audience/market/strategy pipeline.
- **No critic gate, no sub-agents.** This is `budget: fast` — pure router. The premium-orchestration substrate lives in the skills this router proposes; running it here would be theater.

## History / origin

- **v3.0.0 rename** from `start-research` to `orchestrate-research` — aligned naming with `/orchestrate-meta`, `/orchestrate-marketing`, `/orchestrate-product` siblings (all routers, all named the same way).
- **v6 Phase 2 Wave 2 refactor (May 17, 2026, still v1.0.0):** body trimmed per the v6 program (target ≤150 router lines); state-map template, output-formats, anti-patterns extracted to refs; mode-resolver wired; Before-Starting check + Artifact Contract block added per Step 7.5. Per-branch routing rules + intent table + 5 pipeline-position buckets preserved verbatim. No behavior change — pure body-diet + chain hardening. No version bump — refactor lands on the research-skills 2.0 base as a commit, not a release. Mirrors orchestrate-product's post-refactor structure exactly.

## When NOT to use this skill

- **You already know your skill** → invoke it directly (`/icp-research`, `/market-research`, `/diagnose`, `/prioritize`, `/funnel-planner`, `/short-form-research`, `/short-form-eval`).
- **Your task is cross-stack** (e.g., needs research + marketing) → use `/orchestrate-meta`.
- **You're mid-pipeline in clear sequence** — e.g., ICP done, ready for market-research. Go straight to `/market-research`. Re-entering the router adds latency.
- **You want to learn the catalog** — read `research-skills/CLAUDE.md` + `references/workflow-graph.md` directly. The router is for routing, not browsing.

## Further reading

- [`workflow-graph.md`](workflow-graph.md) — full research-stack pipeline + per-skill catalog + decision rules
- [`output-formats.md`](output-formats.md) [PROCEDURE] — the four output shapes (single-route, combined-path, cross-stack process route, scoping fallback)
- [`state-map-template.md`](state-map-template.md) [PROCEDURE] — manifest signals + filesystem fallback paths + state map structure
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`_shared/manifest-spec.md`](_shared/manifest-spec.md) — manifest contract Step 1 reads
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (orchestrate-research is already `budget: fast`, so the resolver's job is mostly enforcing the safety-gates-don't-skip rule)
