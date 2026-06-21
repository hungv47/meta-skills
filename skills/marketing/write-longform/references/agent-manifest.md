# Agent Manifest — Write Longform

[PROCEDURE] — agent table, dispatch graph, routes, critic loop. Loaded at Layer-1 dispatch entry.

## Agents

| Agent | Layer | Reads | Produces |
|-------|-------|-------|----------|
| **research** | 1 (solo, FIRST) | `references/research-method.md`, ICP, product-context; WebSearch/WebFetch | Thesis stress-test + Evidence Ledger + Consensus baseline + Proprietary Angle |
| **outline** | 2 (sequential) | research output, `references/structure-patterns.md` | Argument spine + section outline + counter/originality placement + AEO structure |
| **draft** | 3 (sequential) | outline + ledger, `references/structure-patterns.md`, BRAND.md | The full prose + source map + voice check |
| **critic** | 4 (gate) | assembled piece + ledger + outline, `references/rubric.md`, `references/anti-patterns.md` | PASS / FAIL + 7-dim scorecard (Originality first) + named re-dispatch |

## Dispatch graph (STRICT sequential — the order is the discipline)

```
Pre-Dispatch (orchestrator) — resolve topic, target reader, ownable thesis, piece-type
        │
   Layer 1: research  → stress-test thesis · Evidence Ledger · Consensus · Proprietary Angle
        │   (NOTHING is drafted before this exists)
   Layer 2: outline   → argument spine + sections + counter/originality placement
        │   (NO prose before the spine is committed)
   Layer 3: draft     → full prose against the outline, every claim → ledger # or [tag]
        │
   Layer 4: critic    → score Originality FIRST vs Consensus, then the other 6 dims + hard gates
        │
   PASS → write artifact (+ optional terminal humanmaxxing)
   FAIL → re-dispatch the named agent (max 2 cycles)
```

The research → outline → draft order is non-negotiable and is what prevents the write-copy collapse. `--fast` lightens each stage but does NOT reorder them or skip research.

## Routes

- **Route A — compose.** Default. Full pipeline → critic → artifact.
- **Route B — called by another skill.** `optimize-seo` commissioning a pillar for a topic-map node passes the keyword cluster + search intent + the topic's place in the map; write-longform runs the full pipeline and returns the piece for the topic map. The thesis still must be ownable — optimize-seo supplies intent, not the argument.

## Critic loop

- PASS or FAIL. FAIL names the dimension/gate, quotes the offending passage, gives the fix, names the agent.
- **Max 2 rewrite cycles.** After cycle 2 still failing → `DONE_WITH_CONCERNS` (with the unresolved dimension flagged) or `BLOCKED` (no ownable thesis / no proprietary angle exists — the honest output is "this topic won't support a pillar; use write-copy for a how-to").
- The Originality floor (≥5) is a hard gate: a sub-floor Originality FAILs regardless of the total.

## `--fast` behavior

research-lite (fewer sources, still maps consensus + finds the angle) → outline → single draft, no rewrite loop. **Does NOT skip:** Cold Start, the thesis/reader hard block, the research-before-outline order, the cited-or-marked gate, or the Originality floor.
