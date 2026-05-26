# Architect-System Agent Manifest

Loaded by the orchestrator when entering Layer 1 dispatch or when the critic
re-dispatches a named agent in the revision loop.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| stack-selection-agent | 1 (parallel) | `agents/stack-selection-agent.md` | Technology choices with rationale and alternatives. |
| infrastructure-agent | 1 (parallel) | `agents/infrastructure-agent.md` | Deployment, CI/CD, monitoring, env vars. |
| schema-agent | 2 (sequential) | `agents/schema-agent.md` | Database tables, relationships, indexes, queries. Depends on stack choice. |
| api-agent | 2 (sequential) | `agents/api-agent.md` | Endpoints, auth, request/response contracts. Depends on stack + schema. |
| integration-agent | 2 (sequential) | `agents/integration-agent.md` | File structure, service connections, feature blueprints. Depends on stack + schema + API. |
| scaling-agent | 2 (sequential) | `agents/scaling-agent.md` | Bottleneck analysis, failure modes, edge cases. Validates everything above. |
| critic-agent | 2 (final) | `agents/critic-agent.md` | Quality-gate review against the 8 Critical Gates. Internal consistency. |

## Pattern Catalogs (read by named agents)

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/tech-stack-patterns.md` | stack-selection | Stack choice comparisons. |
| `references/tech-stack-matrix.md` | stack-selection | Stack comparison matrix. |
| `references/file-structure-patterns.md` | integration | Framework-specific file layouts. |
| `references/database-patterns.md` | schema | Common schema shapes. |
| `references/api-patterns.md` | api | REST/RPC/GraphQL templates. |
| `references/auth-patterns.md` | api | Auth model patterns. |
| `references/deployment-patterns.md` | infrastructure | Deployment topologies. |
| `references/failure-modes.md` | scaling | Bottleneck and failure-mode catalog. |
| `references/interaction-edge-cases.md` | scaling | Edge-case catalog. |
| `references/security-patterns.md` | critic, scaling | Security-section patterns for §12. |
| `references/dependency-classification.md` | critic | 4-category dependency taxonomy. |

## Execution Layers

```text
Layer 1 (parallel):
  stack-selection-agent ──┐
  infrastructure-agent ───┘─── run simultaneously

Layer 2 (sequential):
  schema-agent ─────────────── depends on stack choice
    → api-agent ────────────── depends on stack + schema
      → integration-agent ──── depends on stack + schema + API
        → scaling-agent ────── validates everything above
          → critic-agent ───── final quality review against 8 gates
```

Full dispatch mechanics + revision-loop handling + critic re-dispatch routing:
[`anti-patterns.md`](anti-patterns.md) § "Revision loop", and the per-agent
prompt templates under `agents/`.
