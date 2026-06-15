---
title: debate-agents — Pre-Dispatch (entry points, Warm/Cold Start, sub-routine protocol)
lifecycle: canonical
status: stable
produced_by: debate-agents
load_class: PROCEDURE
---

# Pre-Dispatch — Two Entry Points + Cold/Warm Start

## Entry Point 1 — Standalone (user invokes directly)

`/debate-agents "Should we use a monorepo or polyrepo?"` — runs full debate or poll session, writes report to `docs/forsvn/artifacts/meta-debate-agents-[YYYY-MM-DD]-<slug>.md`.

## Entry Point 2 — Sub-routine (another skill invokes mid-flow)

Callers (typical: `discover`, `prioritize`, `architect-system`) frame a specific decision and invoke debate-agents for the synthesis. Inline result, no disk write.

**Sub-routine protocol — load-bearing for callers:**

```
1. Frame the specific decision as a clear problem statement
2. Include relevant context gathered so far
3. Invoke debate-agents with mode (debate/poll) and agent count
4. Receive the report: consensus, disagreements, recommendation
5. Integrate the recommendation into the ongoing conversation
6. Result lives in context for this run — skip the disk write unless the user asks
```

The value when sub-routined is the insight, not the artifact. Standalone invocations write the dated decision file (lifecycle: decision).

## Standalone — Warm Start (problem clear from invocation)

```
Debating "[problem]" with [N] agents over [R] rounds — proceed?
```

## Standalone — Cold Start (problem fuzzy or invocation lacks framing)

```
debate-agents runs N specialist perspectives on a decision and synthesizes
the result. Before I spawn:

1. **Problem** — state the decision in one paragraph. Specific enough that
   3+ experts could disagree productively. ("Should we use monorepo or
   polyrepo for our 4-service backend?" — yes. "What about our architecture?" — no.)
2. **Mode** — debate (trade-off decisions, 3 agents × 3 rounds) or poll
   (filter hallucinations, 10 agents × 1 pass)?
3. **Agent count** — default 3 debate / 10 poll. Override if you want richer
   debate (5 agents) or wider poll (15 agents).
4. **Rounds** (debate only) — default 3. Increase only if you expect deep
   disagreement that needs more cycles to converge.

Answer 1-4 in one response. I'll spawn.
```

## Write-back

None. debate-agents doesn't persist to `docs/forsvn/experience/` — decisions are dated immutable records, not running context.

## Sub-routine Pre-Dispatch shortcut

Sub-routine invocations skip Pre-Dispatch — the calling skill owns problem framing AND has read its own foundation files. debate-agents inherits the caller's context. Steps 1+2 of `before-starting-check` are also skipped in sub-routine mode.
