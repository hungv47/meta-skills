---
title: debate-agents — Decision Tree (debate path + poll path)
lifecycle: canonical
status: stable
produced_by: debate-agents
load_class: PROCEDURE
---

# Decision Tree

## Mode Routing

| Keywords | Mode |
|---|---|
| "debate", "argue", "discuss", "chatroom", "trade-off" | **Debate** → load [`procedures/debate.md`](procedures/debate.md) |
| "consensus", "poll", "vote", "what do agents think", "multiple opinions" | **Poll** → load [`procedures/poll.md`](procedures/poll.md) |
| Ambiguous | Default to **Debate** |

## Debate path (Mode A) — per `procedures/debate.md`

1. **A1 — Parse the request:** extract problem, N (default 3), R (default 3), agent roles (auto-assign if unspecified).
2. **A2 — Assign roles:** perspective templates (architect/pragmatist/critic, etc.) OR constraint-assignment (minimize surface area / maximize flexibility / 80% case) — prefer constraint-assignment for design/architecture debates.
3. **A3 — Run rounds:** per-round prompts enforce communication discipline (no performative agreement, no hedging). After each round, check for convergence (all agents confidence 8+, proposals aligned → stop early).
4. **A4 — Synthesize:** Participants / Consensus / Key Disagreements / Recommended Action / Unresolved Risks / Debate Highlights. If R rounds without convergence → report split honestly, status DONE_WITH_CONCERNS.

A concrete walkthrough lives at [`examples/debate-walkthrough.md`](examples/debate-walkthrough.md) — 3-agent debate with mind-change + early convergence.

## Poll path (Mode B) — per `procedures/poll.md`

1. **B1 — Schema:** pick ranking / recommendation / binary / scoring (must be parseable; reject free-form prose).
2. **B2 — Framings:** 10 variations (neutral, risk-averse, growth-oriented, contrarian, first-principles, user-empathy, resource-constrained, long-term, data-driven, systems-thinker). N<10 uses first N; N>10 cycles.
3. **B3 — Parallel spawn:** one-pass, no iteration.
4. **B4 — Aggregate:** Borda count (rankings) / grouped count (recommendations) / mean+std-dev with high-variance flags (scoring) / YES-NO count (binary).
5. **B5 — Synthesize:** Consensus / Divergences / Outliers / Raw Data / High-Variance Flags. Don't average away variance — flag high-variance options explicitly.

## Configuration

| Parameter | Default | Override |
|---|---|---|
| mode | debate | "poll this" / "debate this" |
| N | 3 (debate) / 10 (poll) | "5 agents" / "15 agents" |
| R | 3 | "debate for 5 rounds" (debate only) |
| model | sonnet | "use opus" |
| roles | auto-assigned per `procedures/debate.md` §A2 | "have a DBA, frontend dev, DevOps engineer debate" |

## Edge Cases

- **N < 2 (debate) or N < 3 (poll):** warn user — below minimum-viable for the mode.
- **Unanimous round 1:** valid early convergence. Report consensus + confidence. Don't manufacture extra rounds "to be thorough."
- **Deadlock after R rounds:** report honestly. The finding IS that no dominant answer exists. Status → DONE_WITH_CONCERNS.
- **Even poll split:** report the split. No forced tiebreaker.
- **Agent goes off-topic:** exclude from synthesis, note effective N (e.g., "5 spawned, 4 contributed signal").
- **Existing reports:** never overwrite. Each run writes a new dated, slug-suffixed file. Operator prunes via `clean-artifacts` when needed.

## Cost Considerations

- 3 sonnet agents × 3 rounds (debate): ~$0.30-0.50
- 10 sonnet agents (poll): ~$0.30-0.50
- Opus ~10× cost — only use when explicitly requested
- Early convergence saves cost (often 1-2 rounds suffice for clear questions)
- For binary decisions, 5 poll agents usually suffices
