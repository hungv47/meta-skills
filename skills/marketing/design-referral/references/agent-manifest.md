# Agent Manifest — Design Referral

[PROCEDURE] — agent table, dispatch graph, routes, critic loop. Loaded at Layer-1 dispatch entry.

## Agents

| Agent | Layer | Reads | Produces |
|-------|-------|-------|----------|
| **loop-architect** | 1 (solo) | `references/loop-models.md`, `references/anti-patterns.md`, product-context, ICP | Loop type + trigger + steps + K math + cycle time |
| **incentive-economist** | 2 (sequential after architect) | architect output, `references/incentive-economics.md`, perf TSV | Incentive design + CPAU/payback + fraud guard |
| **mechanic-copy** | 2 (parallel with economist) | architect + economist output, `references/loop-models.md`, BRAND.md | Share prompt + invite + referee landing + falsifiable claim |
| **critic** | 3 (gate) | assembled loop, `references/rubric.md`, `references/anti-patterns.md` | PASS / FAIL + scorecard + named re-dispatch |

## Dispatch graph

```
Pre-Dispatch (orchestrator) — resolve loop-type, share moment, unit economics; confirm retention precondition
        │
   Layer 1: loop-architect  → loop type + trigger + steps + K = i×c + cycle time
        │
   Layer 2:
        ├── incentive-economist → reward + CPAU vs CAC + payback + fraud guard   (needs K from architect)
        └── mechanic-copy       → share/invite/landing copy + falsifiable claim
        │
   Assemble (orchestrator) → full loop design
        │
   Layer 3: critic → 6-dim scorecard + 4 hard gates
        │
   PASS → write artifact   |   FAIL → re-dispatch named agent (max 2 cycles)
```

Note: incentive-economist depends on the architect's K (CPAU prices on conversion-per-invite), so within Layer 2 the economist reads the architect output; mechanic-copy can run truly parallel.

## Routes

- **Route A — design a loop.** Default. Full Pre-Dispatch → 4-agent pipeline → critic gate → artifact.
- **Route B — called by another skill.** `plan-campaign` selecting referral as a channel calls design-referral with the product + unit economics it already has; design-referral returns the loop design + K/payback for embedding.

## Critic loop

- PASS or FAIL. FAIL names the dimension/gate, the offending number, the fix, and the agent.
- **Max 2 rewrite cycles.** After cycle 2 still failing → `DONE_WITH_CONCERNS` (loop with the unresolved issue documented) or `BLOCKED` (a hard gate can't be met — e.g. no retention evidence, or no incentive makes CPAU < CAC so the only honest output is "don't run a referral loop here").

## `--fast` behavior

Single inline pass: one loop variant, K-math + economics folded in, no rewrite loop. **Does NOT skip:** Cold Start, the retention precondition, the CPAU<CAC computation, or the no-payout gate.
