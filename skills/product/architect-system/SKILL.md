---
name: architect-system
description: "Designs technical blueprints — tech stack selection, database schema, API design, file structure, and deployment plan for a defined product or feature. Produces `architecture/system-architecture.md`. Not for unclear requirements (use discover) or task decomposition (use breakdown-tasks). For user journey mapping, see map-user-flow. For code quality after building, see review-work."
argument-hint: "[product or feature to architect]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "1.0.0"
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

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Recommended — product dims, voice, constraints |
| `.forsvn/artifacts/meta/specs/*.md` | spec/PRD | Recommended — feature scope |
| `.forsvn/artifacts/product/flow/*.md` | map-user-flow | Recommended — user types + flows |
| `.forsvn/experience/technical.md` | (any skill) | Optional — stack history + constraints |
| `.forsvn/index/manifest.json` | system | Optional — prior runs + downstream task state |

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). `--fast` forces single-agent regardless of scope; All 8 Critical Gates fire in every mode.

## Pre-Dispatch

Run [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md). Needed dimensions: spec/PRD reference, scale targets (users / RPS / data), constraints (budget / team skills / latency / compliance), deployment context (greenfield / brownfield / migration). Full read-order + interview prompts: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

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
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack` (=product), `review_surface` (=html — the optional forsvn-preview plugin renders the themed preview while `decision_state: pending`), `decision_state`, `review_tool`, `reviewed_at`, `reviewer`, `lifecycle`, `produced_by`, `provenance`. v2 schema in [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Required sections:** 12 sections (§1 Overview → §12 Security Review) + §12a STRIDE + §12b OWASP + §12d false-positive log. §12c LLM/AI Security conditional. Not Included + Open Questions when applicable.
- **Consumed by:** `breakdown-tasks`, `review-work`, `clean-code`, `forsvn`, operator.


Full template + section content + version-increment rule: [`references/report-template.md`](references/report-template.md).

## Chain Position

Previous: `/discover` or `/map-user-flow` (optional, both sharpen output) | Next: `/breakdown-tasks` (decomposes into tasks). Cross-stack: reads `.forsvn/artifacts/meta/sketches/prioritize-*.md`.

Re-run triggers: product spec changes significantly, scale requirements change (10x growth), migrating core infrastructure, adding major new integrations.

## Dispatch

Multi-agent default (7 agents: stack-selection · infrastructure · schema · api · integration · scaling · critic). Single-agent fallback when mode-resolver downgrades to `fast`. Full execution layers, dispatch protocol, routing logic, and fallback steps: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md). Per-agent role + file paths: [`references/agent-manifest.md`](references/agent-manifest.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) at every doubt — premature microservices, schema without queries, auth-as-afterthought, missing error states, "we'll add monitoring later," over-engineering for scale. Revision-loop handling + when-to-defer-instead-of-architecting also live there.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — full architecture written (stack, schema, API, infra, scaling), critic PASS, open questions listed.
- **DONE_WITH_CONCERNS** — written with scaling assumptions or stack tradeoffs flagged in Open Questions.
- **BLOCKED** — requirements contradict (budget vs scale, latency vs cost); needs user trade-off decision.
- **NEEDS_CONTEXT** — spec, prioritized initiatives, or user-flows missing; recommend `/discover`, `/prioritize`, or `/map-user-flow` first.

## Next Step

After delivery: the operator reviews + sets the decision via the optional forsvn-preview plugin, `decision_state`. Approved → dispatch `/breakdown-tasks` to decompose into tasks. Suggested edits → re-run with feedback. Denied → loop back to `/discover` or `/map-user-flow`.

## References

- [`references/procedures/{pre-dispatch, dispatch-mechanics}.md`](references/procedures/)
- [`references/playbook.md`](references/playbook.md), [`references/agent-manifest.md`](references/agent-manifest.md), [`references/anti-patterns.md`](references/anti-patterns.md), [`references/report-template.md`](references/report-template.md)
- [`references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver}.md`](references/_shared/)
- [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md), [`dependency-classification.md`](references/dependency-classification.md)
- Pattern catalogs (agent-consumed): [`tech-stack-patterns.md`](references/tech-stack-patterns.md), [`tech-stack-matrix.md`](references/tech-stack-matrix.md), [`file-structure-patterns.md`](references/file-structure-patterns.md), [`database-patterns.md`](references/database-patterns.md), [`api-patterns.md`](references/api-patterns.md), [`auth-patterns.md`](references/auth-patterns.md), [`deployment-patterns.md`](references/deployment-patterns.md), [`failure-modes.md`](references/failure-modes.md), [`interaction-edge-cases.md`](references/interaction-edge-cases.md), [`security-patterns.md`](references/security-patterns.md)
- Walkthrough: [`references/examples/saas-invoicing-walkthrough.md`](references/examples/saas-invoicing-walkthrough.md)
