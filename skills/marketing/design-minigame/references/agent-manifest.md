# Agent Manifest — design-minigame

Sequential 3-agent graph.

| # | Agent | File | In | Out |
|---|---|---|---|---|
| 1 | Mechanic Designer | [`../agents/mechanic-designer-agent.md`](../agents/mechanic-designer-agent.md) | goal + game type + reward | the loop · win condition · honest odds · fairness note |
| 2 | Reward & Funnel | [`../agents/reward-funnel-agent.md`](../agents/reward-funnel-agent.md) | mechanic + reward + capture mode | reward economics · value-exchange · compliance flags · funnel · measurement hooks |
| 3 | Critic | [`../agents/critic-agent.md`](../agents/critic-agent.md) | the full spec | verdict; on PASS the artifact ships |

## Dispatch
- **Default (multi):** all 3 in sequence.
- **`--fast` (single):** Mechanic + a funnel sketch inline, skip the deep economics model; Critic still runs the integrity test.
- **Revision:** Critic FAIL → one cycle (mechanic/honesty → Mechanic Designer; economics/funnel → Reward-and-Funnel). Second FAIL → BLOCKED.

## Rubric (5 dimensions, 0–10 each; pass ≥35/50, no dim 0)

1. **Goal fit** — the mechanic serves the named marketing goal + metric (not a toy).
2. **One-action fun** — one obvious action; fun happens before any ask (no pre-fun email wall).
3. **Honest mechanics** — real odds stated, real prizes, no dark patterns. **A dark pattern (dim 3 = 0) auto-BLOCKs** regardless of total.
4. **Reward economics** — prize tiers × odds × expected plays modelled; a redemption cap bounds viral cost; every prize can be honored.
5. **Funnel** — an honest value-exchange capture (at the claim, not the gate) + a real next step tied to the goal.

The critic runs the integrity test (would-the-player-feel-tricked / 100k-plays-budget / fun-before-the-ask) every cycle.
