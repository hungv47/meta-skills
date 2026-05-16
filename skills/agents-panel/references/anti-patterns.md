---
title: Agents-Panel — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: agents-panel
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the orchestrator is about to spawn agents on a question that feels off, OR the synthesis step is about to claim "consensus" that didn't really emerge. Re-read at any moment of doubt.

---

## Spawning anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Spawning agents on a vague problem | "What about our architecture?" — N agents will give N wildly-different answers because the question shape varies per agent's interpretation. Token burn, useless synthesis. | Ask the operator to sharpen the question (Cold Start path) before spawning. Specific enough that 3+ experts could disagree productively. |
| Perspective-assignment for design debates | Architect / Pragmatist / Critic on "what API should this be?" tend to converge on similar designs with different justifications | Use constraint-assignment ("minimize surface area" / "maximize flexibility" / "optimize for 80% case") for design and architecture debates. See [`procedures/debate.md`](procedures/debate.md) §A2. |
| Free-form prose output | Can't be mechanically aggregated; synthesis becomes vibes | Mandatory structured output (POSITION/REASONING/PROPOSAL/CONCERNS for debate; ranking or score schema for poll) |
| N < 2 (debate) or N < 3 (poll) | Below minimum-viable: debate needs at least 2 voices; poll needs at least 3 for variance to mean anything | Warn user; suggest the minimum (or switch mode). |
| Default to opus | 10× cost for marginal quality gain on most decisions | Default to sonnet; require explicit operator request for opus. |
| Spawning before the operator's question is specific | See "vague problem" — same failure with extra ceremony | Always run Cold Start when the invocation lacks problem framing. |

## Synthesis anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Forced consensus | If 4-3 split persists after R rounds, manufacturing a tiebreaker betrays the debate. The finding IS that no dominant answer exists | Report the split honestly. Status → DONE_WITH_CONCERNS. The unresolved disagreement is the insight. |
| Performative agreement in agent prompts | Without explicit anti-sycophancy instructions, agents default to "Great point, building on that…" → synthesis-grade slop | Per-round prompts in [`procedures/debate.md`](procedures/debate.md) explicitly ban performative agreement, hedging, and praise-then-disagree. Don't remove that language. |
| Averaging away poll variance | 5 agents scored option X at 9/10 and 5 scored it at 2/10 → mean 5.5 means nothing. Mean hides the truth | Report mean AND std-dev. Flag high-variance options (std-dev > 2) explicitly — those are the judgment calls. |
| Treating "unanimous round 1" as suspicious | Sometimes the answer IS obvious; early convergence at round 1 is valid and cheap | Report unanimous early convergence as DONE; note the confidence; don't manufacture follow-up rounds to "be thorough." |
| Sub-routine writes to disk by default | Pollutes the decisions/ audit trail with sub-routine results the operator never explicitly committed to | When invoked as sub-routine (by discover, prioritize, system-architecture, etc.), return synthesis inline. Skip disk write unless the operator explicitly asks. |
| Treating "agent went off-topic" as fatal | One bad agent in a 5-agent debate doesn't invalidate the other 4 | Exclude the off-topic agent from synthesis; note effective N in the report (e.g., "5 agents spawned, 4 contributed signal"). |

## Sub-routine anti-patterns (callers' responsibility, but the skill should flag if it sees them)

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Invoking agents-panel without a specific decision framed | The calling skill is supposed to do the problem-framing before invoking — if it shipped a fuzzy prompt, agents-panel can't fix it | Skill returns NEEDS_CONTEXT to the caller with the message "problem statement not specific enough to spawn" |
| Caller asks agents-panel to "decide for them" | agents-panel synthesizes; the caller's skill (discover, prioritize, etc.) decides what to do with the synthesis | Return the synthesis cleanly; let the caller integrate. Don't suggest follow-up actions; that's the caller's job. |
| Caller skipping the integration step | Calling agents-panel, getting a synthesis, and dropping it on the floor wastes the call | Caller is responsible for using the synthesis in its next prompt to the user. If it won't, don't invoke. |
