---
name: architect-system
description: "Designs technical blueprints — tech stack selection, database schema, API design, file structure, and deployment plan for a defined product or feature. Produces `architecture/system-architecture.md`. Not for unclear requirements (use discover) or task decomposition (use breakdown-tasks). For user journey mapping, see map-user-flow. For code quality after building, see review-work."
argument-hint: "[product or feature to architect]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "3.1.0"
  budget: deep
  estimated-cost: "$1-3"
---

# System Architecture Designer — Orchestrator

Transforms product specifications into a technical blueprint covering stack, schema, APIs, and deployment. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Methodology and history: [`references/playbook.md`](references/playbook.md).

**Core question:** Will this still work at 10x scale with 10x team?

## When To Use

- Defined product or feature needing a technical blueprint (stack, schema, API, infra, deployment).
- Major scale shift (10x growth) or migration to new core infrastructure.
- Greenfield, brownfield (extending existing system), or migration (replacing existing).
- Architecture re-run after significant spec change.

## When NOT To Use

- Requirements fuzzy → `/discover`.
- Code-level cleanup → `/clean-code`.
- Task decomposition from existing architecture → `/breakdown-tasks`.
- UI/flow mapping → `/map-user-flow`.
- Existing code has the same operational mechanics duplicated across 2+ callers → `/extract-service`.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** — `budget: deep`. Auto-downgrades to `fast` for simple products (<3 user types AND <5 data entities) → Single-Agent Fallback. `--fast` forces single-agent regardless of scope. **All 8 Critical Gates fire in every mode.**
- Read `research/product-context.md`. Missing → interview for product dimensions or recommend `/research-icp`. `date` >30 days → recommend refresh.
- Read `.forsvn/index/manifest.json` for prior runs + downstream task state.
- Read `.forsvn/experience/technical.md` for stack history + constraints.

## Pre-Dispatch

Run [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md). Needed dimensions: spec/PRD reference, scale targets (users / RPS / data), constraints (budget / team skills / latency / compliance), deployment context (greenfield / brownfield / migration).

Read order:

1. Pipeline: `.forsvn/artifacts/meta/specs/*.md`, `.forsvn/artifacts/meta/sketches/prioritize-*.md`, `.forsvn/artifacts/product/flow/*.md`, existing `architecture/system-architecture.md` (if re-run).
2. Codebase: package manifest, existing schema files, framework signals.
3. Experience: `.forsvn/experience/technical.md` for stack history + constraints.

Warm Start, Cold Start, and the 8-question Architecture Interview live in [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md).

## Critical Gates — all 8 fire in every mode

Before delivering, the critic-agent verifies ALL of these pass:

- [ ] Every tech choice has a rationale (not just "it's popular").
- [ ] API endpoints exist for every user-facing feature.
- [ ] Database schema covers all entities mentioned in product spec.
- [ ] Deployment section includes complete env var list.
- [ ] File structure matches chosen framework conventions.
- [ ] Auth model covers all user roles and permission levels.
- [ ] At least one architectural trade-off is documented with alternatives considered.
- [ ] Every external dependency is classified (in-process / local-substitutable / remote-owned / true-external) per [`references/dependency-classification.md`](references/dependency-classification.md).

Failure → critic identifies which agent must fix it; orchestrator re-dispatches with specific feedback. Revision-loop handling + 2-round limit: [`references/anti-patterns.md`](references/anti-patterns.md) § "Revision loop".

## Artifact Contract

- **Path:** `architecture/system-architecture.md` (active); prior runs renamed `system-architecture.v[N].md`.
- **Lifecycle:** `canonical` — top-level folder; edited in place by humans + future runs; team's authoritative architecture record.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `review_state`, `review_tool`, `reviewed_at`, `reviewer`, `lifecycle`, `produced_by`, `provenance`.
- **Required sections:** 12 sections (§1 Overview → §12 Security Review) + §12a STRIDE + §12b OWASP + §12d false-positive log. §12c LLM/AI Security conditional. Not Included + Open Questions when applicable.
- **Consumed by:** `breakdown-tasks` (decomposes architecture into tasks), `review-work` (post-implementation review), `clean-code` (preserves boundaries), `forsvn` (state detection), operator.
- **Review-gated:** write review frontmatter + `## Review Gate` body block per [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); run review per [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md). `review_state` defaults to `pending`. `status` (skill quality) and `review_state` (human acceptance) are independent — `status: done` + `review_state: pending` is valid.

Full template + section content + version-increment rule: [`references/report-template.md`](references/report-template.md).

## Chain Position

Previous: `/discover` or `/map-user-flow` (optional, both sharpen output) | Next: `/breakdown-tasks` (decomposes into tasks). Cross-stack: reads `.forsvn/artifacts/meta/sketches/prioritize-*.md`.

Re-run triggers: product spec changes significantly, scale requirements change (10x growth), migrating core infrastructure, adding major new integrations.

## Multi-Agent Architecture

7 agents per [`references/agent-manifest.md`](references/agent-manifest.md): stack-selection · infrastructure · schema · api · integration · scaling · critic. Per-agent role + file paths in the manifest.

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

1. **Gather context** — extract user types, data entities, critical flows, scale profile, constraints from the spec. Missing → run Architecture Interview ([`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md)).
2. **Layer 1 dispatch** — brief + constraints to `stack-selection-agent` and `infrastructure-agent` in parallel.
3. **Layer 2 sequential chain** — stack → schema → api → integration → scaling.
4. **Critic review** — verifies all 8 Critical Gates.
5. **Revision loop** — critic FAIL → re-dispatch affected agents with feedback. Max 2 rounds; remaining issues → `## Open Questions`.
6. **Assembly** — merge into 12-section artifact per [`references/report-template.md`](references/report-template.md). Save to `architecture/system-architecture.md`.

### Routing Logic

| Condition | Route |
|---|---|
| User provides tech stack upfront | Skip stack-selection-agent; pass user's stack to schema-agent (Mode 1) |
| User needs stack recommendations | Run stack-selection-agent first (Mode 2) |
| Critic returns PASS | Assemble and deliver |
| Critic returns FAIL | Re-dispatch only the agents cited in critic's issues |
| Revision round > 2 | Deliver with remaining issues as Open Questions |

Annotated full-stack walkthrough (SaaS invoicing, all 7 agents + critic decisions + trade-offs): [`references/examples/saas-invoicing-walkthrough.md`](references/examples/saas-invoicing-walkthrough.md).

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast` (simple product OR `--fast` flag):

1. Skip multi-agent dispatch.
2. Sequential execution: gather context → make architecture decisions (use `references/tech-stack-patterns.md` + `references/tech-stack-matrix.md`) → generate all 12 sections → cross-reference validation.
3. Run 8 Critical Gates checklist as self-review.
4. Save to `architecture/system-architecture.md`.

All 8 Critical Gates + Pre-Dispatch context gate fire in fallback mode — safety contract is mode-independent.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) at every doubt — premature microservices, schema without queries, auth-as-afterthought, missing error states, "we'll add monitoring later," over-engineering for scale. Revision-loop handling + when-to-defer-instead-of-architecting also live there.

## Completion Status

- **DONE** — full architecture written (stack, schema, API, infra, scaling), critic PASS, open questions listed.
- **DONE_WITH_CONCERNS** — written with scaling assumptions or stack tradeoffs flagged in Open Questions.
- **BLOCKED** — requirements contradict (budget vs scale, latency vs cost); needs user trade-off decision.
- **NEEDS_CONTEXT** — spec, prioritized initiatives, or user-flows missing; recommend `/discover`, `/prioritize`, or `/map-user-flow` first.

## References

- [`references/playbook.md`](references/playbook.md), [`references/agent-manifest.md`](references/agent-manifest.md), [`references/anti-patterns.md`](references/anti-patterns.md), [`references/report-template.md`](references/report-template.md)
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md), [`before-starting-check.md`](references/_shared/before-starting-check.md), [`mode-resolver.md`](references/_shared/mode-resolver.md)
- [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md), [`dependency-classification.md`](references/dependency-classification.md)
- Pattern catalogs (agent-consumed): [`tech-stack-patterns.md`](references/tech-stack-patterns.md), [`tech-stack-matrix.md`](references/tech-stack-matrix.md), [`file-structure-patterns.md`](references/file-structure-patterns.md), [`database-patterns.md`](references/database-patterns.md), [`api-patterns.md`](references/api-patterns.md), [`auth-patterns.md`](references/auth-patterns.md), [`deployment-patterns.md`](references/deployment-patterns.md), [`failure-modes.md`](references/failure-modes.md), [`interaction-edge-cases.md`](references/interaction-edge-cases.md), [`security-patterns.md`](references/security-patterns.md)
- Walkthrough: [`references/examples/saas-invoicing-walkthrough.md`](references/examples/saas-invoicing-walkthrough.md)
