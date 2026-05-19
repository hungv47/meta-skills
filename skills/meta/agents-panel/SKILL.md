---
name: agents-panel
description: "Multi-agent discussion rooms — debate or poll a problem from multiple perspectives. Standalone or invoked by other skills as a sub-routine. Mode=debate: N agents argue in rounds, converge. Mode=poll: N agents independently analyze, aggregate by consensus. Not for implementation (use system-architecture). Not for verification (use fresh-eyes). For clarifying requirements first, see discover. For decomposing work after a decision, see task-breakdown."
argument-hint: "[problem or decision to analyze]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
  budget: standard
  estimated-cost: "$0.15-0.50"
  refactor_history:
    - refactored_at: 2026-05-16
      refactored_for: implementation-roadmap v6 Phase 1E+ (body-diet + playbook + procedures extraction + chain hardening)
      body_before: 310
      body_after: 180
      body_delta_pct: -41.9
      note: body-only line counts (frontmatter excluded). Total file 382 → 244.
promptSignals:
  phrases:
    - "debate this"
    - "get perspectives"
    - "discuss this from multiple angles"
    - "pros and cons"
    - "multiple viewpoints"
  allOf:
    - [multiple, perspective]
  anyOf:
    - "debate"
    - "perspective"
    - "consensus"
    - "viewpoint"
    - "panel"
    - "multi-agent debate"
  noneOf:
    - "code review"
    - "quality check"
    - "task breakdown"
    - "decompose"
    - "scope this"
  minScore: 6
routing:
  intent-tags:
    - debate
    - consensus
    - perspectives
    - multi-agent
    - agents-panel
    - discuss
    - chatroom
  position: horizontal
  lifecycle: decision
  produces:
    - .agents/skill-artifacts/meta/decisions/[date]-*.md
  consumes: []
  requires: []
  defers-to:
    - skill: fresh-eyes
      when: "user wants to verify existing code/output quality, not analyze a decision"
    - skill: system-architecture
      when: "user wants to design a system, not debate options"
  parallel-with: []
  interactive: false
  estimated-complexity: heavy
---

# Agent Room — Stochastic Multi-Agent Discussion

*Meta — View a problem through multiple expert perspectives via debate or polling. Standalone or sub-routine for other skills.*

**Core Question:** "What do multiple perspectives converge on — and where do they genuinely disagree?"

This is the centralized multi-perspective analysis capability. When any skill needs debate, consensus, or multiple viewpoints on a decision, it invokes agents-panel.

[Read `references/playbook.md` [PLAYBOOK] to understand methodology, principles, when NOT to use, and the constraint-vs-perspective assignment trade-off.]

## Two Entry Points

### 1. Standalone (user invokes directly)

`/agents-panel "Should we use a monorepo or polyrepo?"` — runs full debate or poll session, writes report to `.agents/skill-artifacts/meta/decisions/`.

### 2. Sub-routine (another skill invokes mid-flow)

Callers (typical: `discover`, `prioritize`, `system-architecture`) frame a specific decision and invoke agents-panel for the synthesis. Inline result, no disk write.

**Sub-routine protocol — load-bearing for callers:**

```
1. Frame the specific decision as a clear problem statement
2. Include relevant context gathered so far
3. Invoke agents-panel with mode (debate/poll) and agent count
4. Receive the report: consensus, disagreements, recommendation
5. Integrate the recommendation into the ongoing conversation
6. Result lives in context for this run — skip the disk write unless the user asks
```

The value when sub-routined is the insight, not the artifact. Standalone invocations write the dated `decisions/` file (lifecycle: decision).

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — load [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. `budget: standard` is default. Auto-downgrade for ≤3-sentence single-decision invocations → `fast` (reduced N+R: debate 2×2 or poll 5×1). Upward override on production-stakes language. `--fast` reduces N+R but does NOT skip the structured-output requirement or the early-convergence detection (safety gates). Emit one line if mode is ambiguous:
   ```
   Resolved mode: <fast|standard|deep> (<reason>). Run as <mode>? [Y / fast / deep]
   ```
1. Read `implementation-roadmap/canonical-paths.md` if present.
2. **Sub-routine invocations skip steps 1+2** — the calling skill is responsible for problem framing AND for having read its own foundation files. Agents-panel inherits the caller's context.
3. No `experience/` dimension read — agents-panel does not carry persistent state across sessions. Each invocation is fresh.

## Critical Gates

1. **Choose the right mode** — debate for trade-off decisions; poll for filtering hallucinations and finding consensus. Default to debate (richer output for fewer agents).
2. **Problem must be specific** — N agents on a fuzzy prompt wastes tokens. If vague, run Cold Start (below) before spawning. Don't spawn into ambiguity.
3. **Agents must produce structured output** — freeform prose can't be aggregated. POSITION/REASONING/PROPOSAL/CONCERNS for debate; ranking/recommendation/binary/scoring schema for poll.
4. **Cost scales with agent count** — debate 3×3 ≈ $0.30-0.50; poll 10 ≈ $0.30-0.50. Default sonnet; opus ~10× and requires explicit operator request.

## Artifact Contract

- **Path (standalone only):** `.agents/skill-artifacts/meta/decisions/[YYYY-MM-DD]-agents-panel-<slug>.md` (dated, slug-suffixed, immutable per-run)
- **Path (sub-routine):** none — inline synthesis to caller
- **Lifecycle:** `decision` (operator-committed strategic choice; accumulates as audit trail; never overwritten)
- **Frontmatter fields:** `skill`, `produced_by`, `version`, `date`, `status`, `mode`, `agents`, `rounds` (debate only), `provenance` (skill + run_date + empty input_artifacts/config_sources + null output_eval). Full template: [`references/report-template.md`](references/report-template.md) [PROCEDURE].
- **Required sections (debate):** Participants, Consensus, Key Disagreements, Recommended Action, Unresolved Risks, Debate Highlights
- **Required sections (poll):** Consensus, Divergences, Outliers, Raw Data, High-Variance Flags
- **Consumed by:** operator (decision audit trail). No machine consumer in v1. Future skills MAY read prior decisions for precedent (e.g., `prioritize` checking past `agents-panel` outcomes for similar choices) — none do today.
- **Eval workspace:** none (decisions are committed, not measured-and-revised).

## Pre-Dispatch

Sub-routine invocations skip Pre-Dispatch — the calling skill owns problem framing.

**Standalone — Warm Start** (problem clear from invocation):

```
Debating "[problem]" with [N] agents over [R] rounds — proceed?
```

**Standalone — Cold Start** (problem fuzzy or invocation lacks framing):

```
agents-panel runs N specialist perspectives on a decision and synthesizes
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

**Write-back:** none. agents-panel doesn't persist to `skills-resources/experience/` — decisions are dated immutable records, not running context.

## Mode Routing

| Keywords | Mode |
|---|---|
| "debate", "argue", "discuss", "chatroom", "trade-off" | **Debate** → load [`references/procedures/debate.md`](references/procedures/debate.md) [PROCEDURE] |
| "consensus", "poll", "vote", "what do agents think", "multiple opinions" | **Poll** → load [`references/procedures/poll.md`](references/procedures/poll.md) [PROCEDURE] |
| Ambiguous | Default to **Debate** |

## Decision Tree

### Debate path (Mode A)

Per [`references/procedures/debate.md`](references/procedures/debate.md) [PROCEDURE]:

1. **A1 — Parse the request:** extract problem, N (default 3), R (default 3), agent roles (auto-assign if unspecified)
2. **A2 — Assign roles:** perspective templates (architect/pragmatist/critic, etc.) OR constraint-assignment (minimize surface area / maximize flexibility / 80% case) — prefer constraint-assignment for design/architecture debates
3. **A3 — Run rounds:** per-round prompts enforce communication discipline (no performative agreement, no hedging). After each round, check for convergence (all agents confidence 8+, proposals aligned → stop early)
4. **A4 — Synthesize:** Participants / Consensus / Key Disagreements / Recommended Action / Unresolved Risks / Debate Highlights. If R rounds without convergence → report split honestly, status DONE_WITH_CONCERNS

A concrete walkthrough lives at [`references/examples/debate-walkthrough.md`](references/examples/debate-walkthrough.md) [EXAMPLE] — 3-agent debate with mind-change + early convergence.

### Poll path (Mode B)

Per [`references/procedures/poll.md`](references/procedures/poll.md) [PROCEDURE]:

1. **B1 — Schema:** pick ranking / recommendation / binary / scoring (must be parseable; reject free-form prose)
2. **B2 — Framings:** 10 variations (neutral, risk-averse, growth-oriented, contrarian, first-principles, user-empathy, resource-constrained, long-term, data-driven, systems-thinker). N<10 uses first N; N>10 cycles
3. **B3 — Parallel spawn:** one-pass, no iteration
4. **B4 — Aggregate:** Borda count (rankings) / grouped count (recommendations) / mean+std-dev with high-variance flags (scoring) / YES-NO count (binary)
5. **B5 — Synthesize:** Consensus / Divergences / Outliers / Raw Data / High-Variance Flags. Don't average away variance — flag high-variance options explicitly

## Configuration

| Parameter | Default | Override |
|---|---|---|
| mode | debate | "poll this" / "debate this" |
| N | 3 (debate) / 10 (poll) | "5 agents" / "15 agents" |
| R | 3 | "debate for 5 rounds" (debate only) |
| model | sonnet | "use opus" |
| roles | auto-assigned per [`procedures/debate.md`](references/procedures/debate.md) §A2 | "have a DBA, frontend dev, DevOps engineer debate" |

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before spawning into vague problems, before claiming consensus that didn't emerge, before forcing a tiebreaker, before writing a sub-routine result to disk.

## Edge Cases

- **N < 2 (debate) or N < 3 (poll):** warn user — below minimum-viable for the mode.
- **Unanimous round 1:** valid early convergence. Report consensus + confidence. Don't manufacture extra rounds "to be thorough."
- **Deadlock after R rounds:** report honestly. The finding IS that no dominant answer exists. Status → DONE_WITH_CONCERNS.
- **Even poll split:** report the split. No forced tiebreaker.
- **Agent goes off-topic:** exclude from synthesis, note effective N (e.g., "5 spawned, 4 contributed signal").
- **Existing reports:** never overwrite. Each run writes a new dated, slug-suffixed file. Operator prunes via `cleanup-artifacts` when needed.

## Cost Considerations

- 3 sonnet agents × 3 rounds (debate): ~$0.30-0.50
- 10 sonnet agents (poll): ~$0.30-0.50
- Opus ~10× cost — only use when explicitly requested
- Early convergence saves cost (often 1-2 rounds suffice for clear questions)
- For binary decisions, 5 poll agents usually suffices

## Chain Position

Standalone or sub-routine. Typical callers when sub-routined: `prioritize`, `system-architecture`, `discover`.

## Completion Status

- **DONE** — debate converged on consensus, OR poll yielded a clear synthesis (consensus/outlier breakdown clear)
- **DONE_WITH_CONCERNS** — significant unresolved disagreement (debate) or split opinion (poll); report flags it explicitly under Unresolved Risks / Divergences
- **BLOCKED** — agents fundamentally couldn't engage (problem under-specified after Cold Start, scope unclear, rounds exhausted without progress)
- **NEEDS_CONTEXT** — problem requires upstream artifact (spec, ICP, architecture) before perspectives can be meaningful. If sub-routined, return to caller with this status and a message about what's missing.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill, methodology, principles, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (synced from `references/`)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior contract
- [`references/procedures/debate.md`](references/procedures/debate.md) [PROCEDURE] — Mode A: role assignment, per-round prompts, synthesis
- [`references/procedures/poll.md`](references/procedures/poll.md) [PROCEDURE] — Mode B: schemas, framings, aggregation
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — output template (standalone)
- [`references/examples/debate-walkthrough.md`](references/examples/debate-walkthrough.md) [EXAMPLE] — 3-agent debate with mind-change
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE] — canonical Pre-Dispatch contract
- `agent-skills/CLAUDE.md` §"Artifact Placement" — lifecycle taxonomy (umbrella dependency, not shipped under `npx skills add` standalone install; the `decision` lifecycle this skill emits is fully documented inline in the Artifact Contract block above)
