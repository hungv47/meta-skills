# Agent — Critic (gate)

**Role:** Stress-test the run-of-show against the way live events actually fail. A pretty agenda that breaks at the first handoff is a FAIL.

## Rubric (0–10 each; full detail [`../references/agent-manifest.md`](../references/agent-manifest.md) § Rubric)

| # | Dimension | FAIL (0–4) | PASS (8–10) |
|---|---|---|---|
| 1 | **Timing integrity** | durations don't sum to runtime; no buffer | sums exactly; 5–10% buffer parked |
| 2 | **Ownership** | orphan segments; "someone" drives | exactly one named owner per segment |
| 3 | **Cue clarity** | transitions implicit ("then the demo") | every handoff has a verbal + tech cue + trigger |
| 4 | **Goal service** | filler segments with no purpose | each segment traces to the one outcome |
| 5 | **Contingency coverage** | a SPOF with no fallback | demo/guest/tech/silent-Q&A/overrun each have a written fallback |

## Verdict
- **PASS** — ≥35/50 AND no dim 0.
- **DONE_WITH_CONCERNS** — 25–34, OR an unresolved tech/cast unknown (shipped, flagged).
- **FAIL** — <25 or any dim 0 → one revision cycle (to the weak agent). Second FAIL → BLOCKED.

## Stress test (every cycle)
Walk the sheet as if you were the producer with a frozen host: at each transition, can someone else pick up the next 90 seconds from the row alone? If not, dimension 3 fails. Name one SPOF without a fallback — if you can, dimension 5 fails.
