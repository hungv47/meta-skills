---
title: System-Architecture Playbook
lifecycle: canonical
status: stable
produced_by: system-architecture
load_class: PLAYBOOK
---

# System-Architecture Playbook

## Why this skill exists

Software architecture decisions compound. A choice made on day one — Postgres vs. SQLite, REST vs. tRPC, monorepo vs. polyrepo, Vercel vs. self-hosted — shapes every downstream feature, every migration cost, every onboarding hour for the next two years. Most architectures fail not because the tech was wrong but because the decision was unconscious: defaults chosen by familiarity, not fit.

This skill exists to make those decisions deliberate. Multi-agent orchestration (7 agents across 2 layers) ensures stack, infra, schema, API, integrations, and scaling are all designed against the same constraints — not bolted together after the fact. The critic-agent gate then verifies internal consistency before the artifact ships.

The output is `architecture/system-architecture.md` — a canonical artifact (lifecycle: canonical) that lives in the project repo and gets read by every subsequent feature build, every code-cleanup pass, every fresh-eyes review.

## Methodology

**Constraint-first, choice-second.** Scale targets + budget + team skills + compliance + latency are the architecture constraints. Stack choices that violate any constraint are wrong, regardless of how popular the framework. Layer-1 agents (stack-selection + infrastructure) receive constraints first, choose second.

**Layer-1 parallel, Layer-2 sequential — never invert.** Stack + infra can be chosen in parallel because they don't depend on each other (infra mostly depends on the deployment target which is itself a constraint). Schema → API → integration → scaling is sequential because each depends on the prior layer's output.

**Critic-gate before assembly.** All 8 quality gates verified before the artifact is written to disk. FAIL means re-dispatch the specific agent — not "the architecture didn't work."

**Every dependency classified.** In-process / local-substitutable / remote-owned / true-external. This classification drives testing strategy in `task-breakdown` + `fresh-eyes` downstream. An unclassified dependency is an untested dependency.

**Scale for 10x, plan for 100x.** Building for 1M users when you have 100 wastes months. Building for 100 users when you'll have 10k requires a re-architecture in 6 months. Target 10x current load with a documented expansion path to 100x.

## Principles

- **Every tech choice has a rationale** — not just "it's popular." Rationale gets captured in the artifact, not just in the agent's head.
- **API endpoints exist for every user-facing feature** — gap between flow and API is a missing endpoint; surface it before assembly.
- **Database schema covers all entities mentioned in the spec** — orphan entities are a sign of incomplete schema or stale spec.
- **Deployment section includes the complete env var list** — partial lists become "it works on my machine" incidents.
- **File structure matches chosen framework conventions** — deviating from conventions silently increases onboarding cost.
- **Auth model covers all user roles and permission levels** — bolted-on auth is the most expensive refactor in software.
- **At least one architectural trade-off is documented with alternatives considered** — "we picked X" is half the value; "we considered Y and Z" is the other half.
- **Premature microservices are the most common architecture failure** — start monolith, extract at pain points.

## Required vs. optional input artifacts

| Artifact | Source | Benefit |
|----------|--------|---------|
| `research/product-context.md` | icp-research (from `hungv47/research-skills`) | Industry context, user personas, and constraints |
| `.agents/skill-artifacts/meta/specs/*.md` | discover (meta-skills) | Scoped spec — the WHAT being architected |
| `.agents/skill-artifacts/meta/tasks.md` | task-breakdown (meta-skills) | Feature list already decomposed into buildable units — informs feature-scoping in §9 |
| `.agents/skill-artifacts/product/flow/*.md` | user-flow | Per-flow user flow diagrams + platform-surface matrix; read every file. Feeds API endpoint design and feature scoping. |
| `.agents/skill-artifacts/meta/sketches/prioritize-*.md` | prioritize (from `hungv47/research-skills`) | Business initiatives — informs build-vs-skip on optional capabilities |
| Existing `architecture/system-architecture.md` | self (prior run) | Re-run mode: rename existing to `system-architecture.v[N].md` and write new version |

None are hard-required — this skill can run standalone via the Architecture Interview (see [`pre-dispatch-prompts.md`](pre-dispatch-prompts.md) [PROCEDURE]) — but every present artifact sharpens the output.

## Two modes of operation

**Mode 1: Tech Stack Already Chosen** — operator provides stack upfront (e.g., "I'm using Next.js + Postgres + Vercel"). Routing Logic row 1: skip stack-selection-agent; pass user's stack directly to schema-agent. Layer-2 chain runs unchanged.

**Mode 2: Need Tech Stack Recommendations** — operator needs help choosing. Routing Logic row 2: run stack-selection-agent first in Layer 1 (parallel with infrastructure-agent), then chain remaining agents.

The routing decision is automatic from the prompt — explicit stack names trigger Mode 1; absence triggers Mode 2.

## History / origin

- **v3.0.0 baseline:** 7 agents, 2-layer execution (1 parallel + 1 sequential chain), 8 quality gates, dependency classification taxonomy locked, 12-section artifact template + 4 security subsections (STRIDE, OWASP, LLM/AI security, false-positive exclusions).
- **v6 Phase 2 Wave 1 refactor (May 17, 2026, still v3.0.0):**
  - Body trimmed 328 → 167 lines (-49.0%, under ≤200 structural target by 33).
  - Warm/Cold Pre-Dispatch prompts + 8-question Architecture Interview extracted to `pre-dispatch-prompts.md`.
  - Anti-Patterns table extracted to `anti-patterns.md` + revision-loop handling + when-to-defer guidance added.
  - Worked Example extracted to `examples/saas-invoicing-walkthrough.md` (expanded with annotations + lessons; corrects baseline's stale "7 quality gates" reference → 8).
  - 12-section Artifact Template (with §12a-d security subsections + version-increment rule) extracted to `report-template.md`.
  - Dependency Classification table extracted to `dependency-classification.md` + Common misclassifications + Cross-skill propagation sections added.
  - "Two Modes of Operation" body section deleted (duplicated Routing Logic rows 1-2; mode rationale moved to playbook).
  - Mode-resolver wired with safety-gates-supersede-`--fast` per the 8 Critical Gates; auto-downgrade thresholds preserved verbatim ("fewer than 3 user types AND fewer than 5 data entities") per fresh-eyes catch.
  - Before-Starting check + Artifact Contract block added per Step 7.5.
  - The 8 Critical Gates + Multi-Agent Architecture (Manifest + Execution Layers + Dispatch Protocol + Routing Logic) preserved verbatim in body — these ARE behavior, not docs.
  - Chain Position narrowed: Previous now lists `/discover` OR `/user-flow` (baseline listed `/task-breakdown` as a possible predecessor — semantically incorrect since task-breakdown is downstream of architecture, not upstream; clarified in this refactor).
  - No version bump — refactor lands on product-skills 2.0 base as a commit, not a release.

## Further reading

- [`pre-dispatch-prompts.md`](pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold prompts + Architecture Interview (8 questions)
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes catalog + revision-loop handling
- [`report-template.md`](report-template.md) [PROCEDURE] — 12-section artifact template + security subsections (STRIDE, OWASP, LLM/AI)
- [`dependency-classification.md`](dependency-classification.md) [PROCEDURE] — 4-category taxonomy that drives downstream testing strategy
- [`examples/saas-invoicing-walkthrough.md`](examples/saas-invoicing-walkthrough.md) [EXAMPLE] — Stripe invoicing tool end-to-end
- [`tech-stack-patterns.md`](tech-stack-patterns.md) — stack choice comparisons (stack-selection-agent consumes)
- [`tech-stack-matrix.md`](tech-stack-matrix.md) — stack comparison matrix (stack-selection-agent consumes)
- [`database-patterns.md`](database-patterns.md), [`api-patterns.md`](api-patterns.md), [`auth-patterns.md`](auth-patterns.md), [`file-structure-patterns.md`](file-structure-patterns.md), [`deployment-patterns.md`](deployment-patterns.md), [`failure-modes.md`](failure-modes.md), [`interaction-edge-cases.md`](interaction-edge-cases.md), [`security-patterns.md`](security-patterns.md) — agent-consumed pattern catalogs
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (deep-tier skill; `--fast` runs Single-Agent Fallback but still enforces 8 quality gates per the safety-gates-supersede rule)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec
