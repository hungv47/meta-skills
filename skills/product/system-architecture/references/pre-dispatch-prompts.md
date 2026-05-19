---
title: System-Architecture — Pre-Dispatch Prompts
lifecycle: canonical
status: stable
produced_by: system-architecture
load_class: PROCEDURE
---

# Pre-Dispatch Prompts

**Load when:** Pre-Dispatch step fires. Choose Warm Start (spec + flows present), Cold Start (greenfield, conversation only), or Architecture Interview (vague invocation requiring full discovery). Emit verbatim — calibrated for one round-trip resolution.

---

## Warm Start

Fires when spec + flows present, scale either declared or derivable from product context.

```
Found:
- spec → "[1-line summary]"
- flows → "[N flow files]"
- declared stack → "[from package.json / experience/technical.md]"

Need before dispatching: scale targets and any new constraints (compliance, latency, budget tier)?
```

If operator confirms or types nothing → dispatch with detected values + missing fields defaulted from `skills-resources/experience/technical.md`. Override resets to Cold Start.

## Cold Start

Fires when no spec, greenfield, conversation only.

```
system-architecture produces a full technical blueprint — stack, schema,
APIs, infra, scaling. Without specifics, defaults will be generic and
likely wrong for your scale or constraints.

1. **Spec/PRD reference** — file path, paste, or 2-3 paragraph description
   of what this system does. (Defer to `discover` first if requirements
   are still fuzzy.)
2. **Scale targets** — users, requests/second, data volume. (E.g., "10k MAU,
   peak 50 RPS, ~100GB data".)
3. **Constraints** — budget tier (bootstrapped / seed / Series A+), team
   skills (frontend-only / full-stack / specialists), latency requirements,
   compliance (HIPAA / SOC2 / GDPR / none).
4. **Deployment context** — greenfield (no existing system), brownfield
   (extend existing), or migration (replace existing)?

Answer 1-4 in one response. I'll dispatch stack-selection and infrastructure agents.
```

## Architecture Interview

Fires when the user provides only a vague description ("build me an app", "I need a platform") — Cold Start prompts skipped because the inputs aren't even articulated yet.

```
1. What is the product and its core value proposition?
2. Who are the primary users? Expected concurrent users at launch and at 12 months?
3. What are the 3-5 critical user flows?
4. What data needs to be stored and queried?
5. Existing tech stack or team skill constraints?
6. Specific integrations needed? (payments, email, auth providers, etc.)
7. Performance requirements? (real-time updates, complex queries, offline support)
8. Security/compliance needs? (SOC2, HIPAA, GDPR, PCI)
```

All 8 answers are necessary before dispatching agents. If user can't answer ≥3 → defer to `/discover` with a one-line explanation ("requirements are too fuzzy for an architecture pass; let's scope first").

## Write-back rules

After Cold Start or Interview resolves, persist only durable context:

| Q | File | Key | Rule |
|---|---|---|---|
| 2. Scale targets | `skills-resources/experience/technical.md` | `Technical — scale targets` | Durable; spans projects within a stack |
| 3. Constraints | `skills-resources/experience/technical.md` | `Technical — constraints` | Durable: compliance, latency tier, team skills |
| 4. Deployment context | `skills-resources/experience/technical.md` | `Technical — deployment context` | Durable: greenfield vs brownfield vs migration default |

Q1 (spec) is project-specific — lives in `.agents/skill-artifacts/meta/specs/<slug>.md` or `architecture/system-architecture.md`, not persisted to experience.
Interview Q1-Q8: same write-back where dimensions overlap. Q1 (product), Q3 (flows), Q6 (integrations) are project-specific — don't persist.

## Safety gate (under `--fast`)

`--fast` skips multi-agent dispatch but does NOT skip Pre-Dispatch. The 8 Critical Gates require knowing scale + constraints + deployment context before the architecture artifact is written. If `--fast` invocation arrives with no resolvable signal AND no prior `technical.md` entry, Pre-Dispatch still fires (single bundled question) before dispatch. Mode-resolver's `safety-gates-supersede-fast` clause is the contract.
