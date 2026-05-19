---
title: System-Architecture — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: system-architecture
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** critic-agent fires (Step 4 in Dispatch Protocol), or any moment the orchestrator is about to commit a design choice that smells off — microservices on day one, schema without queries, auth-as-afterthought. Re-read at every doubt.

---

## Failure mode catalog

| Anti-Pattern | Problem | INSTEAD |
|--------------|---------|---------|
| Premature microservices | Adds operational complexity before product-market fit | Start monolith, extract services at pain points |
| Schema without queries | Tables look clean but critical queries require full scans | Design schema around access patterns via schema-agent |
| Auth as afterthought | Retrofitting permissions breaks existing flows | api-agent defines roles and permissions before endpoint design |
| Missing error states | Happy-path-only architecture crumbles in production | scaling-agent traces failure modes for every critical operation |
| "We'll add monitoring later" | Debugging production without observability is guesswork | infrastructure-agent includes logging and error tracking in v1 |
| Over-engineering for scale | Building for 1M users when you have 100 wastes months | scaling-agent designs for 10x current load, plans for 100x |

## Revision loop — when the critic returns FAIL

The critic-agent identifies which agent's output failed which gate, and the orchestrator re-dispatches with specific feedback.

**Examples:**
- Critic finds Gate 2 fail ("API endpoints exist for every user-facing feature") → re-dispatch `api-agent` with the missing-endpoint list.
- Critic finds Gate 5 fail ("File structure matches chosen framework conventions") → re-dispatch `integration-agent` with the convention-violation list.
- Critic finds Gate 7 fail ("At least one architectural trade-off is documented") → re-dispatch the most-relevant Layer-1 agent (usually `stack-selection`) to add the trade-off block.

**Limit:** maximum 2 revision rounds. After round 2 with remaining failures, deliver with critic's remaining issues moved to `## Open Questions` in the artifact. Don't loop indefinitely — at that point, the constraint set may be contradictory and needs operator input.

**Never silently bypass the critic.** The 8 gates are the architecture safety contract. Bypassing them produces blueprints that look complete but have load-bearing gaps.

## When to defer instead of architecting

- **Requirements are fuzzy** — defer to `/discover`. Architecture against unclear requirements produces hollow blueprints.
- **No user flows mapped AND the system is UI-heavy** — recommend `/user-flow` first. API design suffers without flows.
- **Spec contradicts known constraints** (e.g., "real-time + sub-100ms + serverless on hobby tier") — surface the contradiction; ask operator to relax one constraint; don't pretend an architecture exists that satisfies all three.
