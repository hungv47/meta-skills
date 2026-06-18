# Agent Manifest — event-runofshow

Sequential 3-agent graph.

| # | Agent | File | In | Out |
|---|---|---|---|---|
| 1 | Segment Planner | [`../agents/segment-planner-agent.md`](../agents/segment-planner-agent.md) | event brief | timed segment list (sums to runtime) |
| 2 | Logistics Director | [`../agents/logistics-director-agent.md`](../agents/logistics-director-agent.md) | segments + cast + tech | full run-of-show + checklist + contingencies |
| 3 | Critic | [`../agents/critic-agent.md`](../agents/critic-agent.md) | the run-of-show | verdict; on PASS the artifact ships |

## Dispatch
- **Default (multi):** all 3 in sequence.
- **`--fast` (single):** Planner + a light Logistics pass inline (segments, owners, top cues), skip the deep contingency layer; Critic still runs.
- **Revision:** Critic FAIL → one cycle to the weak agent (timing/owners → Planner; cues/contingency → Logistics). Second FAIL → BLOCKED.

## Rubric (5 dimensions, 0–10 each; pass ≥35/50, no dim 0)

1. **Timing integrity** — durations sum to the event length; 5–10% buffer built in (usually parked in Q&A).
2. **Ownership** — exactly one named owner per segment; speaker + tech-driver both named when different.
3. **Cue clarity** — every transition has a verbal cue + a technical cue + who triggers it.
4. **Goal service** — each segment traces to the event's one outcome; no filler.
5. **Contingency coverage** — every single point of failure (demo, guest, tech, silent Q&A, overrun) has a written fallback decided in advance.

The critic runs the frozen-host stress test every cycle.
