---
title: Agents-Panel — Debate Procedure (Mode A)
lifecycle: canonical
status: stable
produced_by: agents-panel
load_class: PROCEDURE
---

# Mode A: Debate

**Load when:** the body's Mode Routing table resolves to debate, OR the operator explicitly requests "debate / argue / discuss / trade-off."

Spawn N agents (default 3) into a shared conversation. Each reads the full chat history before responding — building on, challenging, or refining previous contributions.

**Why it works:** Sequential handoffs lose context. A shared conversation preserves reasoning chains and enables genuine debate. When Agent A says "this needs a queue" and Agent B says "a simple loop is fine," that disagreement is more valuable than either agent's solo answer.

**Foundational stance — load [`../_shared/anti-sycophancy.md`](../_shared/anti-sycophancy.md) [PLAYBOOK] before constructing the per-round prompts.** The anti-sycophancy contract (no performative agreement, no hedging, take a position) is what makes debate produce signal instead of slop. Every per-round prompt below enforces it; the ref is the source-of-truth on why and the canonical language to preserve.

---

## A1. Parse the Request

Extract:
- **Problem/question** to debate
- **Agent count N** — default 3 (override: "have 5 agents debate"). **If mode resolved to `fast`: N=2.** If mode resolved to `deep`: N=5 (matches the "richer debate" override).
- **Round count R** — default 3 (override: "debate for 5 rounds"). **If mode resolved to `fast`: R=2.** If mode resolved to `deep`: R=4.
- **Agent roles** — user may specify. If not, assign diverse defaults (A2).

Mode resolution per body Step 0 — `--fast` cuts N+R; explicit operator override always wins.

## A2. Assign Agent Roles

Each agent gets a distinct perspective to maximize productive disagreement.

### Perspective-assignment templates

**Software engineering:**
1. **Architect** — systems, interfaces, scalability, long-term maintainability
2. **Pragmatist** — shipping fast, minimal complexity, "good enough" solutions
3. **Critic** — edge cases, failure modes, security holes, unstated assumptions

**Product/design:**
1. **User advocate** — UX, simplicity, delight
2. **Business strategist** — revenue, growth, competitive advantage
3. **Engineer** — technical feasibility and cost

**Strategy/decisions:**
1. **Optimist** — opportunity, upside, reasons to act
2. **Skeptic** — risk, downside, reasons to wait
3. **Synthesizer** — middle path, integrates both perspectives

For N > 3, add roles that create productive tension with existing ones (e.g., CFO-proxy, due-diligence-buyer, end-user-advocate, ops-on-call).

### Constraint-assignment for divergence (preferred for design/architecture debates)

When the debate is about *how to build something* (API design, schema, architecture), assign each agent a structural constraint instead of (or in addition to) a perspective. This mechanically forces different solutions rather than hoping for them:

- Agent 1: "Minimize surface area — aim for the fewest possible methods/endpoints"
- Agent 2: "Maximize flexibility — support the widest range of use cases"
- Agent 3: "Optimize for the most common case — make the 80% path trivially simple"
- Agent 4 (if N > 3): "Take inspiration from [specific paradigm/library the user knows]"

Constraint-assigned agents produce genuinely different designs. Perspective-assigned agents tend to converge on similar designs with different justifications. When in doubt for an architecture / API / schema debate, default to constraint-assignment.

## A3. Run Debate Rounds

### Round 1 — Opening positions

Agent prompt:

```
You are {role}: {role_description}

PROBLEM:
{problem}

CONTEXT:
{context}

This is Round 1 of a multi-agent debate. State your initial position.
Be specific — propose actual solutions, not vague principles. Take a clear stance.
Other agents will challenge you in subsequent rounds.

Communication discipline:
- No performative agreement: never open with "Great point" or "I appreciate X's perspective"
- State disagreements directly: "That approach fails because [X]" not "While that has merit..."
- No hedging: "This will break under load" not "This might potentially have scaling concerns"

Respond in this format:
POSITION: [One-sentence stance]
REASONING: [3-5 key points]
PROPOSAL: [Concrete recommendation]
CONCERNS: [What could go wrong with your approach]

Write your response directly — do not write to any files.
```

### Rounds 2+ — Debate

Agent prompt:

```
You are {role}: {role_description}

PROBLEM:
{problem}

PREVIOUS DISCUSSION:
{all previous round entries}

This is Round {N}. Read the previous discussion carefully.

1. Respond to the strongest counterargument against your position
2. Identify where you AGREE with other agents (concede good points)
3. Identify where you still DISAGREE and why
4. Refine your proposal based on the discussion

Do NOT repeat your previous position. Engage with what others said.
Change your mind if they made a better argument.
Do NOT soften disagreements with praise. "I appreciate Agent A's point, but..." is sycophancy disguised as discourse. State the disagreement directly.

Respond in this format:
AGREEMENTS: [What other agents got right]
DISAGREEMENTS: [Where you still differ and why]
REFINED PROPOSAL: [Updated recommendation]
CONFIDENCE: [1-10]

Write your response directly — do not write to any files.
```

### After each round

1. Collect all agent responses
2. **Check for convergence**: if all agents agree (confidence 8+, proposals aligned), stop early. Synthesis is the same; bill is cheaper.
3. Otherwise continue to next round

## A4. Synthesize

After the last round, you (the orchestrator) read the full debate and synthesize:

- **Where did agents converge?** — high-confidence conclusions
- **Where did they remain split?** — genuine trade-offs the user must decide
- **What concerns were raised but unresolved?** — risks to monitor
- **Did any agent change their mind?** — mind-changes are strong signals

Output sections for the report: Participants, Consensus, Key Disagreements, Recommended Action, Unresolved Risks, Debate Highlights. Template: [`../report-template.md`](../report-template.md) [PROCEDURE].

If debate did NOT converge after R rounds: report the split honestly. The finding IS that no dominant answer exists; don't force a tiebreaker. Status → DONE_WITH_CONCERNS.
