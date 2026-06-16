---
type: procedure
skill: architect-system
purpose: "Multi-agent dispatch protocol, execution layer ordering, routing logic, and single-agent fallback."
---

# Architect-System — Dispatch Mechanics

Load this at dispatch entry. Multi-agent default; single-agent fallback when mode-resolver downgrades to `fast` (simple product OR `--fast` flag).

## Multi-Agent Architecture

7 agents per [`../agent-manifest.md`](../agent-manifest.md): stack-selection · infrastructure · schema · api · integration · scaling · critic. Per-agent role + file paths in the manifest.

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

1. **Gather context** — extract user types, data entities, critical flows, scale profile, constraints from the spec. Missing → run Architecture Interview ([`../pre-dispatch-prompts.md`](../pre-dispatch-prompts.md)).
2. **Layer 1 dispatch** — brief + constraints to `stack-selection-agent` and `infrastructure-agent` in parallel.
3. **Layer 2 sequential chain** — stack → schema → api → integration → scaling.
4. **Critic review** — verifies all 8 Critical Gates.
5. **Revision loop** — critic FAIL → re-dispatch affected agents with feedback. Max 2 rounds; remaining issues → `## Open Questions`.
6. **Assembly** — merge into 12-section artifact per [`../report-template.md`](../report-template.md). Save to `architecture/system-architecture.md`.

### Routing Logic

| Condition | Route |
|---|---|
| User provides tech stack upfront | Skip stack-selection-agent; pass user's stack to schema-agent (Mode 1) |
| User needs stack recommendations | Run stack-selection-agent first (Mode 2) |
| Critic returns PASS | Assemble and deliver |
| Critic returns FAIL | Re-dispatch only the agents cited in critic's issues |
| Revision round > 2 | Deliver with remaining issues as Open Questions |

Annotated full-stack walkthrough (SaaS invoicing, all 7 agents + critic decisions + trade-offs): [`../examples/saas-invoicing-walkthrough.md`](../examples/saas-invoicing-walkthrough.md).

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast`:

1. Skip multi-agent dispatch.
2. Sequential execution: gather context → make architecture decisions (use [`../tech-stack-patterns.md`](../tech-stack-patterns.md) + [`../tech-stack-matrix.md`](../tech-stack-matrix.md)) → generate all 12 sections → cross-reference validation.
3. Run 8 Critical Gates checklist as self-review.
4. Save to `architecture/system-architecture.md`.

All 8 Critical Gates + Pre-Dispatch context gate fire in fallback mode — safety contract is mode-independent.
