---
name: architect-system
description: "Designs technical blueprints — tech stack selection, database schema, API design, file structure, and deployment plan for a defined product or feature. Produces `architecture/system-architecture.md`. Not for unclear requirements (use discover) or task decomposition (use breakdown-tasks). For user journey mapping, see map-user-flow. For code quality after building, see review-work."
argument-hint: "[product or feature to architect]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "3.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# System Architecture Designer — Orchestrator

*Productivity — Multi-agent orchestration. Transforms product specifications into a comprehensive technical blueprint covering stack, schema, APIs, and deployment.*

**Core Question:** "Will this still work at 10x scale with 10x team?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill exists, methodology, principles, two modes of operation, history.]

## When To Use

- Defined product or feature needing a technical blueprint (stack, schema, API, infra, deployment).
- Major scale shift (10x growth) or migration to new core infrastructure.
- Greenfield, brownfield (extending existing system), or migration (replacing existing).
- Architecture re-run after significant spec change.

## When NOT To Use

- Requirements still fuzzy → defer to `/discover`.
- Need code-level cleanup → `/clean-code`.
- Need task decomposition from existing architecture → `/breakdown-tasks`.
- Need UI/flow mapping → `/map-user-flow`.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — this skill is `budget: deep`. Mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) auto-downgrades to `fast` for simple products (fewer than 3 user types AND fewer than 5 data entities) → Single-Agent Fallback path. `--fast` flag forces single-agent regardless of scope. **Safety gates supersede `--fast`:** the 8 Critical Gates fire on every run, regardless of mode. Pre-Dispatch fires under `--fast` if scale + constraints aren't resolvable.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (`architecture/system-architecture.md`).
2. Read `research/product-context.md`. If missing: interview for product dimensions or recommend `/research-icp` (from research-skills) to bootstrap. If `date` field >30 days old, recommend refresh.
3. Read `.forsvn/index/manifest.json` for prior architecture runs + downstream task-breakdown state.
4. Read `.forsvn/experience/technical.md` for stack history + constraints.

## Pre-Dispatch

Run the Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md`).

**Needed dimensions:** spec/PRD reference, scale targets (users / RPS / data), constraints (budget / team skills / latency / compliance), deployment context (greenfield / brownfield / migration).

**Read order:**
1. Pipeline: `.forsvn/artifacts/meta/specs/*.md`, `.forsvn/artifacts/meta/sketches/prioritize-*.md`, `.forsvn/artifacts/product/flow/*.md`, existing `architecture/system-architecture.md` (if re-run).
2. Codebase: package manifest, existing schema files, framework signals.
3. Experience: `.forsvn/experience/technical.md` for stack history + constraints.

**Prompts:** see [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] for Warm Start, Cold Start, and the 8-question Architecture Interview (vague-invocation path) + write-back rules.

## Artifact Contract

- **Path:** `architecture/system-architecture.md` (active); prior runs renamed to `system-architecture.v[N].md`.
- **Lifecycle:** `canonical` (top-level folder; edited in place by humans + future runs; the team's authoritative architecture record).
- **Frontmatter fields:** `skill`, `version`, `date`, `status` (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), `review_state`, `review_tool`, `reviewed_at`, `reviewer`, `lifecycle`, `produced_by`, `provenance` (with `skill`, `run_date`, `input_artifacts`, `output_eval`).
- **Required sections:** 12 sections (§1 Overview → §12 Security Review) + §12a STRIDE + §12b OWASP + §12d false-positive log. §12c LLM/AI Security conditional. Not Included + Open Questions when applicable.
- **Consumed by:** `breakdown-tasks` (decomposes architecture into tasks), `review-work` (post-implementation review), `clean-code` (preserves boundaries during refactoring), `forsvn` (state detection), operator (canonical reference).
- **Review:** Review-gated artifact. Write the review frontmatter (`review_state` / `review_tool` / `reviewed_at` / `reviewer`) and the `## Review Gate` body block per [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); run the review per [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md). `review_state` defaults to `pending`. `status` (skill quality gate) and `review_state` (human acceptance) are independent — `status: done` + `review_state: pending` is valid.
- Full template + section content + version-increment rule: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Chain Position

Previous: `/discover` or `/map-user-flow` (optional, both sharpen output) | Next: `/breakdown-tasks` (decomposes into tasks).
Cross-stack: reads `.forsvn/artifacts/meta/sketches/prioritize-*.md` (from research-skills).

**Re-run triggers:** when product spec changes significantly, when scale requirements change (10x growth), when migrating core infrastructure, when adding major new integrations.

## Critical Gates

Before delivering, the critic-agent verifies ALL of these pass:

- [ ] Every tech choice has a rationale (not just "it's popular")
- [ ] API endpoints exist for every user-facing feature
- [ ] Database schema covers all entities mentioned in product spec
- [ ] Deployment section includes complete env var list
- [ ] File structure matches chosen framework conventions
- [ ] Auth model covers all user roles and permission levels
- [ ] At least one architectural trade-off is documented with alternatives considered
- [ ] Every external dependency is classified (in-process / local-substitutable / remote-owned / true-external) per [`references/dependency-classification.md`](references/dependency-classification.md) [PROCEDURE]

**If any gate fails:** the critic identifies which agent must fix it and the orchestrator re-dispatches with specific feedback. Full revision-loop handling + 2-round limit: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "Revision loop — when the critic returns FAIL."

**Safety supersedes `--fast`:** all 8 gates fire under `--fast`, Single-Agent Fallback, and dry-run modes. Mode-resolver's safety-gates-supersede contract applies.

## Multi-Agent Architecture

### Agent Manifest

| Agent | File | Focus |
|-------|------|-------|
| stack-selection-agent | `agents/stack-selection-agent.md` | Technology choices with rationale and alternatives |
| infrastructure-agent | `agents/infrastructure-agent.md` | Deployment, CI/CD, monitoring, env vars |
| schema-agent | `agents/schema-agent.md` | Database tables, relationships, indexes, queries |
| api-agent | `agents/api-agent.md` | Endpoints, auth, request/response contracts |
| integration-agent | `agents/integration-agent.md` | File structure, service connections, feature blueprints |
| scaling-agent | `agents/scaling-agent.md` | Bottleneck analysis, failure modes, edge cases |
| critic-agent | `agents/critic-agent.md` | Quality gate review, internal consistency |

### Execution Layers

```
Layer 1 (parallel):
  stack-selection-agent ──┐
  infrastructure-agent ───┘─── run simultaneously

Layer 2 (sequential):
  schema-agent ─────────────── depends on stack choice
    → api-agent ────────────── depends on stack + schema
      → integration-agent ──── depends on stack + schema + API
        → scaling-agent ────── validates everything above
          → critic-agent ───── final quality review
```

### Dispatch Protocol

1. **Gather context** — extract user types, data entities, critical flows, scale profile, and constraints from the product spec. If missing, run the Architecture Interview (see [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE]).
2. **Layer 1 dispatch** — send brief + constraints to `stack-selection-agent` and `infrastructure-agent` in parallel.
3. **Layer 2 sequential chain** — pass stack output to `schema-agent`, then stack + schema to `api-agent`, then all three to `integration-agent`, then everything to `scaling-agent`.
4. **Critic review** — send assembled document to `critic-agent` to verify all 8 Critical Gates.
5. **Revision loop** — if critic returns FAIL, re-dispatch affected agents with feedback. Maximum 2 revision rounds; remaining issues move to `## Open Questions`.
6. **Assembly** — merge all agent outputs into the 12-section artifact template per [`references/report-template.md`](references/report-template.md) [PROCEDURE]. Save to `architecture/system-architecture.md`.

### Routing Logic

| Condition | Route |
|-----------|-------|
| User provides tech stack upfront | Skip stack-selection-agent; pass user's stack directly to schema-agent (Mode 1) |
| User needs stack recommendations | Run stack-selection-agent first (Mode 2) |
| Critic returns PASS | Assemble and deliver |
| Critic returns FAIL | Re-dispatch only the agents cited in critic's issues |
| Revision round > 2 | Deliver with critic's remaining issues noted as Open Questions |

For an annotated full-stack walkthrough (SaaS invoicing, all 7 agents + critic decisions + trade-offs): [`references/examples/saas-invoicing-walkthrough.md`](references/examples/saas-invoicing-walkthrough.md) [EXAMPLE].

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast` (simple product: fewer than 3 user types AND fewer than 5 data entities, context-constrained, or `--fast` flag):

1. Skip multi-agent dispatch.
2. Execute sequentially: gather context + constraints → make architecture decisions (use `references/tech-stack-patterns.md` + `references/tech-stack-matrix.md`) → generate all 12 sections → cross-reference validation.
3. Run the 8 Critical Gates checklist as self-review.
4. Save to `architecture/system-architecture.md`.

The 8 Critical Gates + Pre-Dispatch context gate fire in fallback mode regardless — safety contract is mode-independent.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read at every doubt — premature microservices, schema without queries, auth-as-afterthought, missing error states, "we'll add monitoring later," over-engineering for scale. Revision-loop handling + when-to-defer-instead-of-architecting also live there.

## Completion Status

Every run ends with explicit status:

- **DONE** — full architecture written (stack, schema, API, infra, scaling), critic PASS, open questions explicitly listed.
- **DONE_WITH_CONCERNS** — architecture written but with scaling assumptions or stack tradeoffs the user should validate; flagged in Open Questions.
- **BLOCKED** — requirements contradict (e.g., budget vs scale, latency vs cost); needs user trade-off decision before any single architecture can be specified.
- **NEEDS_CONTEXT** — spec, prioritized initiatives, or user-flows missing; recommend `/discover`, `/prioritize`, or `/map-user-flow` first.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why, methodology, principles, two modes of operation, history, required vs optional input artifacts
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior + safety-gates-supersede contract
- [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold + Architecture Interview verbatim
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes + revision-loop handling + when to defer
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — 12-section artifact template + security subsections + version-increment rule
- [`references/dependency-classification.md`](references/dependency-classification.md) [PROCEDURE] — 4-category taxonomy driving downstream testing strategy
- [`references/examples/saas-invoicing-walkthrough.md`](references/examples/saas-invoicing-walkthrough.md) [EXAMPLE] — Stripe invoicing tool end-to-end
- [`references/tech-stack-patterns.md`](references/tech-stack-patterns.md) — stack choice comparisons (stack-selection-agent consumes)
- [`references/tech-stack-matrix.md`](references/tech-stack-matrix.md) — stack comparison matrix
- [`references/file-structure-patterns.md`](references/file-structure-patterns.md), [`references/database-patterns.md`](references/database-patterns.md), [`references/api-patterns.md`](references/api-patterns.md), [`references/auth-patterns.md`](references/auth-patterns.md), [`references/deployment-patterns.md`](references/deployment-patterns.md), [`references/failure-modes.md`](references/failure-modes.md), [`references/interaction-edge-cases.md`](references/interaction-edge-cases.md), [`references/security-patterns.md`](references/security-patterns.md) — agent-consumed pattern catalogs
