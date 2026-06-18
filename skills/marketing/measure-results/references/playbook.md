# Playbook — measure-results (method)

The skill exists to make channel knowledge **compound**: a launch produces numbers; those numbers should make the *next* launch on that channel smarter. Without this step, every launch starts from the same generic pack — the loop never closes (origin F3, pillar 3 of Pro).

## The loop

```
plan-campaign / launch chain  →  LAUNCH  →  results
                                              │
                                  measure-results (this skill)
                                              │
                  read (attribution) → write-back into the channel pack
                                              │
                         next launch reads the updated pack ──┐
                                              ▲                │
                                              └────────────────┘  (compounds)
```

## Principles

1. **Attribution over reporting.** A dashboard reports numbers; this skill explains *which tactic earned them*. The value is the causal link, hedged honestly.
2. **The pack is the memory.** The write-back lands in the channel pack (and the hosted feed), not in a private doc — so it's there at the next launch, for any agent, on any machine.
3. **Append, don't rewrite.** Evidence accumulates; tactic *wording* changes only by deliberate operator promotion. This keeps the pack trustworthy and auditable (and gate-validated).
4. **Honesty is the moat.** A flattering read poisons the next launch. Anti-sycophancy (rubric dim 3) is load-bearing, not decoration.
5. **Local-first, hosted-mirror.** Local write-backs (pack + `.forsvn/performance/`) are the source of truth; the hosted metrics feed is the cross-session mirror that makes Pro's loop compound across agents. The hosted post is always best-effort.

## Where the numbers come from
Manual paste first (operator pastes the launch platform's stats). A connector is deferred (origin U10 note) — and whether the connector is a metered credits surface is an open decision. Until then: paste or a CSV/TSV path.
