# Research-ICP Agent Manifest

Loaded by the orchestrator when entering Layer 1 dispatch or when the critic
re-dispatches a named agent via the Rewrite Routing Table.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| persona-agent | 1 (parallel) | `agents/persona-agent.md` | Demographics, role, goals, frustrations — persona card builder. |
| voc-collector-agent | 1 (parallel) | `agents/voc-collector-agent.md` | Voice-of-customer quote collection from multiple platforms. |
| habitat-agent | 1 (parallel) | `agents/habitat-agent.md` | Platform/community mapping with density and engagement type. |
| pain-analysis-agent | 2 (sequential) | `agents/pain-analysis-agent.md` | Surface → Hidden → Emotional pain classification from VoC evidence. |
| decision-psychology-agent | 2 (sequential) | `agents/decision-psychology-agent.md` | Trigger events, research behavior, cognitive biases, objections, trust/distrust signals. |
| synthesis-agent | 2 (sequential) | `agents/synthesis-agent.md` | Merges all fragments into coherent ICP profile. |
| critic-agent | 2 (final) | `agents/critic-agent.md` | Quality gate — PASS/FAIL with Rewrite Routing Table. |

Template: `agents/_template.md` for creating new agent files.

## Routes — three

| Route | When | Graph |
|---|---|---|
| **B — Full ICP** (default) | Comprehensive audience research; messaging + channel + positioning decisions | L1 parallel (persona + VoC + habitat) → L2 sequential (pain → psychology → synthesis → critic) |
| **A — Quick ICP** | Single persona, known audience, time-constrained; OR `--fast` with sufficient Warm Start context | L1 parallel (persona + VoC, skip habitat) → L2 sequential (pain → synthesis → critic, skip decision-psychology) |
| **C — Called by another skill** | Invoked by plan-campaign, create-brand, write-copy, etc. | Read context from caller's artifacts; check `docs/forsvn/canonical/research/ICP.md` freshness — Fresh (<30 days) return existing; Stale (>30 days) warn caller + recommend re-run; Missing → run Route B |

## Pattern Catalogs (consumed by named agents)

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/voice-of-customer.md` | voc-collector | VoC collection patterns, quote categories, platform tips. |
| `references/customer-interviews.md` | voc-collector | Win/loss interview methodology, support ticket analysis. |
| `references/habitat-mapping.md` | habitat | Density definitions, engagement types, cross-persona analysis. |
| `references/icp-to-imc-handoff.md` | synthesis | How to package outputs for IMC planning. |
| `references/confidence-and-bias.md` | critic, all | H/M/L labels, 5-source floor, Sample Bias section. |

Full dispatch mechanics + critic FAIL routing + post-write side effects:
[`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
