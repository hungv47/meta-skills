# Dispatch Mechanics — Agent Manifest, Pipeline, Single-Agent Fallback

Cited by `SKILL.md` "Dispatch Protocol", "Agent Manifest", and "Single-Agent Fallback" sections.

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Structure | 1 parallel | `agents/structure-agent.md` | Entries, screens, decisions, exits, flow type, **surface entry map** |
| Edge Case | 1 parallel | `agents/edge-case-agent.md` | Error / empty / loading / permission / offline + **per-surface edge states** |
| Diagram | 2a parallel | `agents/diagram-agent.md` | Mermaid flowchart, 5 node shapes, annotations |
| Wireframe | 2a parallel | `agents/wireframe-agent.md` | ASCII wireframe per core screen + edge variants + **per-surface mini-frames** |
| Validation | 2b seq | `agents/validation-agent.md` | Miller's threshold, ≤3 actions/screen, integrity, **surface coverage** |
| Critic | 2b final | `agents/critic-agent.md` | Full rubric PASS/FAIL + **surface coverage matrix** |

## Shared references (read by agents)

- `../research-checklist.md` — pre-design research methods, IA, content strategy
- `../platform-touchpoints.md` — surface catalog (13 platforms + cross-platform channels): entry triggers, flow roles, native dimensions, per-surface edge states

## Routing Logic

Single route — all flows use the full stack. Flows >15 screens auto-split via structure-agent's sub-flow decomposition.

**Pipeline:** Step 0 (interview + gated enumeration) → **Layer 1 parallel** (structure + edge-case) → Merge → **Layer 2a parallel** (diagram + wireframe) → **Layer 2b sequential** (validation → critic). Critic FAIL re-dispatches named agents (max 2 cycles). Deliver to `docs/forsvn/artifacts/product-map-user-flow-<YYYY-MM-DD>-<slug>.md`; update index artifact when ≥2 distinct slugs exist.

## How to spawn agents

Spawn mechanics, agent conventions, and the full Layer 1 / Merge / Layer 2a / Layer 2b dispatch tables (per-agent inputs + reference files): `../dispatch-protocol.md`.

## Single-Agent Fallback

If multi-agent dispatch is unavailable or mode-resolver downgrades to `fast`, execute agent instructions sequentially in-context: Layer 1 (structure → edge cases) → Layer 2 (diagram + wireframes → validation) → critic. The 7 Critical Gates + mandatory platforms+surfaces gate fire in fallback mode regardless — safety contract is mode-independent.
