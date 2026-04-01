---
name: multi-lens
description: "Analyze a problem through multiple agent perspectives. Mode=debate: N agents argue in rounds, converge on recommendations. Mode=poll: N agents independently analyze with varied framings, aggregate by consensus/divergence/outlier. Not for implementation (use system-architecture). Not for verification (use review-chain)."
argument-hint: "[problem or decision to analyze]"
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
routing:
  intent-tags:
    - debate
    - consensus
    - perspectives
    - multi-agent
  position: horizontal
  produces:
    - .agents/meta/multi-lens-report.md
  consumes: []
  requires: []
  defers-to:
    - skill: review-chain
      when: "user wants to verify existing code/output quality, not analyze a decision"
    - skill: system-architecture
      when: "user wants to design a system, not debate options"
  parallel-with: []
  interactive: false
  estimated-complexity: heavy
---

# Multi-Lens

*Meta — Dynamic Multi-Agent. View a problem through multiple perspectives via debate or polling.*

**Core Question:** "What do multiple expert perspectives converge on — and where do they genuinely disagree?"

## Critical Gates — Read First

1. **Choose the right mode** — debate for trade-off decisions, poll for filtering hallucinations and finding consensus. If unsure, default to debate (richer output for fewer agents).
2. **Problem must be specific** — N agents on a fuzzy prompt wastes tokens. If the problem is vague, ask the user to sharpen it before spawning.
3. **Agents must produce structured output** — freeform prose can't be aggregated. Every agent returns a defined format.
4. **Cost scales with agent count** — 3 debate agents × 3 rounds ≈ $0.30-0.50. 10 poll agents ≈ $0.30-0.50. Default to sonnet unless user requests opus.

## Inputs Required
- A specific problem, decision, or question from the user
- Optional: agent count, round count, preferred mode (debate/poll), custom roles

## Output
- `.agents/meta/multi-lens-report.md` — synthesis with consensus, disagreements, recommendation
- `.agents/meta/multi-lens-transcript.json` — full debate transcript (debate mode only)

## Chain Position
- **Before:** Can precede any domain skill — feed debate/poll conclusions into system-architecture, solution-design, etc.
- **After:** Can follow preflight (scope the decision first, then analyze it from multiple perspectives)

## Orchestration Pattern: Dynamic Agent Spawning

This skill uses runtime-defined agents, NOT the static agent roster pattern used by domain skills. Agent roles, count, and instructions are determined at execution time based on the user's request. There is no `agents/` directory.

---

## Mode Routing

**Choose debate** when the problem is a trade-off with no clear answer and you need agents to challenge each other's reasoning. Debate produces richer output because agents build on and refute prior arguments. Best for: architecture decisions, design trade-offs, "should we do X or Y?"

**Choose poll** when you want to filter hallucinations and find what most independent perspectives converge on. Poll exploits stochastic variation — like asking 10 experts the same question separately. Best for: ranking options, validating a hypothesis, "is X a good idea?"

| Keywords | Mode |
|----------|------|
| "debate", "argue", "discuss", "chatroom", "trade-off" | **Debate** |
| "consensus", "poll", "vote", "what do agents think", "multiple opinions" | **Poll** |
| Ambiguous | Default to **Debate** (richer output for fewer agents) |

User can override explicitly: "debate this with 5 agents" or "poll 10 agents on this".

---

## Mode A: Debate

Spawn N agents (default 3) into a shared conversation. Each agent reads the full chat history before responding, building on, challenging, or refining previous contributions.

**Why this works:** Sequential handoffs lose context — the second model doesn't know WHY the first made its decisions. A shared conversation preserves reasoning chains and enables genuine debate. When Agent A says "this needs a queue" and Agent B says "a simple loop is fine," that disagreement is more valuable than either agent's confident solo answer.

### A1. Parse the request

Extract:
- **Problem/question** to debate
- **Agent count N** — default 3. User can override ("have 5 agents debate")
- **Round count R** — default 3. User can override ("debate for 5 rounds")
- **Agent roles** (optional) — user may specify. If not, assign diverse defaults.

### A2. Assign agent roles

Each agent gets a distinct perspective to maximize productive disagreement. If the user didn't specify roles, choose from these defaults based on the problem domain:

**Software engineering:**
1. **Architect** — thinks in systems, interfaces, scalability, long-term maintainability
2. **Pragmatist** — optimizes for shipping fast, minimal complexity, "good enough" solutions
3. **Critic** — finds edge cases, failure modes, security holes, unstated assumptions

**Product/design:**
1. **User advocate** — optimizes for UX, simplicity, user delight
2. **Business strategist** — optimizes for revenue, growth, competitive advantage
3. **Engineer** — grounds discussion in technical feasibility and cost

**Strategy/decisions:**
1. **Optimist** — sees opportunity, upside potential, reasons to act
2. **Skeptic** — sees risk, downside, reasons to wait
3. **Synthesizer** — finds the middle path, integrates both perspectives

For N > 3, add more roles that create productive tension with existing ones.

### A3. Initialize the transcript

Create `.agents/meta/multi-lens-transcript.json`:

```json
{
  "mode": "debate",
  "problem": "{problem statement}",
  "context": "{relevant context, code, constraints}",
  "agents": [
    {"name": "Agent A", "role": "{role}", "framing": "{role description}"},
    {"name": "Agent B", "role": "{role}", "framing": "{role description}"},
    {"name": "Agent C", "role": "{role}", "framing": "{role description}"}
  ],
  "rounds": [],
  "final_output": null
}
```

### A4. Run debate rounds

For each round (1 through R), spawn all N agents in parallel.

**Agent config (each agent):**
- `subagent_type: "general-purpose"`
- `model: "sonnet"` (default — user can override to opus for deeper reasoning)
- `mode: "bypassPermissions"`

**Important:** If the problem is vague or ambiguous, ask the user to sharpen it before spawning. N agents on a fuzzy prompt wastes tokens.

**Learned rules:** Before constructing agent prompts, read `.agents/meta/learned-rules.md`. If any rules are relevant to the problem domain, append them to each agent's prompt as additional constraints.

**Round 1 — Opening positions:**

Agent prompt:
```
You are {role}: {role_description}

PROBLEM:
{problem}

CONTEXT:
{context}

This is Round 1 of a multi-agent debate. State your initial position on this problem.
Be specific and concrete — propose actual solutions, not vague principles. Take a clear stance.

Other agents will challenge your position in subsequent rounds, so make your reasoning explicit.

Respond in this format:
POSITION: [Your one-sentence stance]
REASONING: [Your detailed argument — 3-5 key points]
PROPOSAL: [Your concrete recommendation]
CONCERNS: [What could go wrong with your approach]

Write your response directly — do not write to any files.
```

**Rounds 2+ — Debate:**

Agent prompt:
```
You are {role}: {role_description}

PROBLEM:
{problem}

PREVIOUS DISCUSSION:
{all previous round entries, formatted as "Agent X (Role): response"}

This is Round {N} of a multi-agent debate. Read the previous discussion carefully.

Your job:
1. Respond to the strongest counterargument against your position
2. Identify where you AGREE with other agents (concede good points)
3. Identify where you still DISAGREE and why
4. Refine your proposal based on the discussion so far

Do NOT just repeat your previous position. Engage with what others said.
Change your mind if they made a better argument.

Respond in this format:
AGREEMENTS: [What other agents got right]
DISAGREEMENTS: [Where you still differ and why]
REFINED PROPOSAL: [Your updated recommendation]
CONFIDENCE: [1-10 how confident you are in your refined position]

Write your response directly — do not write to any files.
```

**After each round:**
1. Collect all agent responses
2. Append to the `rounds` array in the transcript using this structure:
```json
{
  "round": 1,
  "entries": [
    {"agent": "Agent A", "role": "Architect", "response": "{full response text}"},
    {"agent": "Agent B", "role": "Pragmatist", "response": "{full response text}"},
    {"agent": "Agent C", "role": "Critic", "response": "{full response text}"}
  ]
}
```
3. Check for convergence: if all agents agree (confidence 8+, proposals aligned on the same approach), stop early — no need for more rounds

### A5. Synthesize

After the last round, you (the orchestrator) read the full debate and produce a synthesis. Do NOT spawn another agent for this.

Analyze:
- **Where did agents converge?** — high-confidence conclusions
- **Where did they remain split?** — genuine trade-offs the user must decide
- **What concerns were raised but unresolved?** — risks to monitor
- **Did any agent change their mind?** — mind-changes are strong signals

---

## Mode B: Poll

Spawn N agents (default 10) with identical context and near-identical prompts. Each independently analyzes and produces a structured response. Aggregate by consensus, divergence, and outlier.

**Why this works:** Exploits stochastic variation in LLM outputs. Like polling 10 experts instead of asking one. The mode filters out hallucinations and individual biases. Divergences reveal genuine judgment calls. Outliers surface creative ideas a single run would miss.

### B1. Parse the request

Extract:
- **Problem/question** to analyze
- **Agent count N** — default 10. User can override.
- **Output format** — rankings, recommendations, yes/no, scores
- **Options list** (if applicable) — predefined options to rank/evaluate

### B2. Design structured output schema

**This step is critical.** Each agent must return structured output that can be mechanically compared across all N agents. Freeform prose cannot be aggregated — you need numbers, rankings, or categorical answers.

Choose the output type that matches the problem:

| Output Type | When to Use | Schema |
|-------------|-------------|--------|
| **Ranking** | Predefined options to compare | "Rank these 5 options from best to worst. Output as a numbered list 1-5." |
| **Recommendation** | Open-ended, agents propose ideas | "Propose your top 3 recommendations. For each: name, one-sentence rationale, confidence score 1-10." |
| **Binary** | Yes/no decision | "Should we do X? Answer YES or NO, then give your top 3 reasons." |
| **Scoring** | Multiple criteria per option | "Score each option 1-10 on [criteria]. Output as `Option: Score`." |

The schema must produce outputs that can be mechanically compared. If you can't count or sum the responses, redesign the schema.

### B3. Generate framing variations

Create N slightly different prompts. The core problem and output schema stay identical — only the framing varies:

1. **Neutral baseline**: "Analyze the following problem objectively."
2. **Risk-averse**: "You are a conservative analyst who weighs downside risks heavily."
3. **Growth-oriented**: "You are an aggressive strategist who optimizes for upside potential."
4. **Contrarian**: "Challenge conventional wisdom. What does everyone else get wrong here?"
5. **First-principles**: "Reason from first principles. Ignore what's conventional or popular."
6. **User-empathy**: "Think from the end-user/customer perspective. What matters most to them?"
7. **Resource-constrained**: "Assume limited time and budget. What's the highest-leverage move?"
8. **Long-term**: "Optimize for the 5-year outcome, not the 90-day outcome."
9. **Data-driven**: "Focus only on what's measurable and provable. Ignore intuition."
10. **Systems thinker**: "Map the second and third-order effects. What cascades from each choice?"

For N > 10, cycle back through the list. For N < 10, use the first N framings from the list above (e.g., N=5 uses framings 1-5). Do not generate all 10 and sample — use exactly N framings for N agents.

### B4. Spawn all N agents in parallel

**Agent config (each agent):**
- `subagent_type: "general-purpose"`
- `model: "sonnet"` (cost-efficient — each agent does focused analysis, not deep research)
- `mode: "bypassPermissions"`

**Important:** If the problem is vague, ask the user to clarify before spawning. Don't burn N × tokens on vagueness.

**Note:** Poll mode is one-pass — there is no convergence detection or early stopping. All N agents run once and results are aggregated. This is by design: independent samples give better statistical signal than iterative refinement.

Agent prompt:
```
{framing_variation}

PROBLEM:
{problem}

{context}

{output_schema}

Be specific and concrete. Give real recommendations, not vague advice.
If you're uncertain about something, say so explicitly with a confidence level.

Write your response directly — do not write to any files.
```

### B5. Aggregate results

Once all N agents have returned, perform mechanical aggregation:

**For ranking tasks:**
- Assign points: 1st place = N points, 2nd = N-1, etc.
- Sum points across all agents for each option
- Report final ranking by total points

**For recommendation tasks:**
- Group similar recommendations (fuzzy match on name/concept)
- Count how many agents proposed each
- **Consensus** (70%+ of N agree): High-confidence recommendations
- **Divergence** (40-69% of N): Genuine judgment calls — flag for user decision
- **Outlier** (<40% of N): Potentially creative, potentially noise

*Thresholds use percentages so they scale to any N. For N=10: consensus=7+, divergence=4-6, outlier=1-3. For N=5: consensus=4+, divergence=2-3, outlier=1.*

**For scoring tasks:**
- Calculate mean, median, and standard deviation per option
- Flag options with high variance (std dev > 2) — agents disagree here

**For binary decisions:**
- Count YES vs NO
- Summarize the strongest arguments from each side

---

## Write the Report

Write to `.agents/meta/multi-lens-report.md`. Adapt the template based on the mode:

```markdown
---
skill: multi-lens
version: 1
date: {YYYY-MM-DD}
status: final
---

# Multi-Lens Report

**Problem**: {problem}
**Mode**: {debate | poll}
**Agents**: {N} | **Rounds**: {R, debate only}
**Date**: {date}
```

**Debate mode sections:**
```markdown
## Participants
| Agent | Role | Final Confidence |
|-------|------|-----------------|
| Agent A | {role} | {confidence}/10 |

## Consensus
{What all agents agreed on by the final round}

## Key Disagreements
{Where agents remained split — present both sides fairly}

## Recommended Action
{Your synthesis as orchestrator — the best path forward}

## Unresolved Risks
{Concerns raised during debate that weren't fully addressed}

## Debate Highlights
{The most interesting exchanges — where minds changed or strong counterarguments emerged}
```

**Poll mode sections:**
```markdown
## Consensus (agreed by {X}+/{N} agents)
{Items most agents converged on — high-confidence recommendations}

## Divergences (split {X}/{Y})
{Items where agents disagreed roughly evenly — genuine judgment calls needing human decision}

## Outliers (proposed by {Z}/{N} agents)
{Unique ideas from individual agents — flag which framing produced them}

## Raw Rankings / Scores
{Full aggregation table with points, means, or vote counts}

## Individual Agent Responses
{Summary of each agent's response with their framing variation noted}
```

For debate mode, also update `.agents/meta/multi-lens-transcript.json` with the `final_output`.

## Deliver Results

Present to the user:
- **One-paragraph synthesis** of the outcome
- **The recommended action** (your call as orchestrator, informed by the analysis)
- **The sharpest disagreement** (where the user's judgment is needed)
- File paths to report (and transcript for debate mode)

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| mode | debate | `debate` (agents interact) or `poll` (agents independent) |
| N | 3 (debate) / 10 (poll) | Number of agents |
| R | 3 | Rounds (debate mode only) |
| model | sonnet | Model for each agent |
| roles | auto | Agent roles — auto-assigned or user-specified (debate only) |

User can override: "have 5 opus agents debate for 4 rounds" or "poll 15 agents on this".

## Cost Considerations

- 3 sonnet agents × 3 rounds (debate) ≈ $0.30-0.50
- 10 sonnet agents (poll) ≈ $0.30-0.50
- Opus multiplies cost ~10x — only use when user explicitly requests it
- Early convergence in debate saves cost — stop if agents agree before all rounds
- For binary decisions, 5 poll agents is usually sufficient

## Edge Cases

- **Ambiguous or vague problem**: Ask the user to sharpen it before spawning. N agents on a fuzzy prompt wastes tokens. Don't proceed until the problem is specific enough to produce structured output.
- **N < 2 (debate) or N < 3 (poll)**: Warn the user — debate needs 2+, polling needs 3+.
- **Agents all agree immediately** (debate): Stop after round 1. Report unanimous consensus. Valid and cheap outcome.
- **Agents deadlock** (debate): After R rounds with no convergence, report honestly. The finding is that this is a genuine judgment call with no dominant answer. Surface the strongest arguments from each side.
- **Even split** (poll): Report the split as the finding. No forced tiebreaker. The finding IS that no dominant answer exists.
- **Agent goes off-topic**: Exclude that response from synthesis and note the effective agent count.
- **Agent failure**: If an agent returns garbage or fails, exclude it from aggregation and note the effective N. Adjust thresholds accordingly (e.g., consensus becomes 5+/7 instead of 7+/10).
- **User specifies custom roles** (debate): Use exactly what they specify. Don't add extra roles unless asked.
- **Existing report**: Overwrite `.agents/meta/multi-lens-report.md` and `.agents/meta/multi-lens-transcript.json` without asking — these are ephemeral analysis artifacts, not persistent data.

## Output Files

| File | Description |
|------|-------------|
| `.agents/meta/multi-lens-report.md` | Synthesis report with consensus, disagreements, recommendation |
| `.agents/meta/multi-lens-transcript.json` | Full structured debate transcript (debate mode only) |

Previous reports are overwritten — these are ephemeral analysis tools, not archives.
