---
title: Agents-Panel Playbook
lifecycle: canonical
status: stable
produced_by: agents-panel
load_class: PLAYBOOK
---

# Agents-Panel Playbook

## Why this skill exists

A single agent answering a hard question gives one perspective shaped by whatever framing came in. For trade-off decisions ("monorepo vs polyrepo," "Snowflake vs self-hosted," "rebuild vs refactor"), one perspective is structurally insufficient — the value lives in *where the perspectives disagree*. Agents-panel exists to make that disagreement visible: spawn N agents with deliberately different framings, let them debate or poll, and synthesize the result into "where they converged, where they split, what remains unresolved."

The alternative — operator gathers perspectives manually from teammates / Slack / their own head — works but is slow, biased toward the perspectives the operator already knows, and produces no audit artifact. Agents-panel turns it into a 30-second sub-routine with a structured decision log.

## Methodology

**Debate for trade-offs, poll for hallucination-filtering and consensus-finding.** Debate gives richer output per dollar (3-5 agents × 3 rounds produces a synthesis; same cost in poll gives 10-15 independent opinions). Pick by question shape:

- **"Should we do X or Y?"** with genuine trade-offs → debate (3 agents, 3 rounds default)
- **"Which of these 5 options should we pick?"** with measurable criteria → poll (10 agents, scoring schema)
- **"Is this idea worth pursuing?"** binary → poll (5-10 agents, YES/NO + top 3 reasons)
- **"Help us think through this complex decision"** → debate, possibly N > 3 with constraint-assignment

**Constraint-assignment beats perspective-assignment for design decisions.** Telling three agents "you're the architect / you're the pragmatist / you're the critic" tends to converge on similar designs with different justifications. Telling them "minimize surface area / maximize flexibility / optimize for the 80% case" mechanically forces structurally different answers. Use constraint-assignment whenever the debate is about *how to build something* (API design, schema, architecture). Use perspective-assignment when the debate is about *whether to do something* (strategic decisions, prioritization, go/no-go).

**Communication discipline is load-bearing.** Without it, agents default to performative agreement ("Great point, building on that…") which produces synthesis-grade slop instead of genuine debate. The skill prompts agents explicitly against hedging, against praise-then-disagree patterns, against "while that has merit" phrasings. This is enforced in the per-round prompts in [`procedures/debate.md`](procedures/debate.md).

## Principles

- **Specific problems only.** N agents on a fuzzy prompt wastes tokens and produces fuzzy synthesis. If the problem isn't specific enough that 3+ experts could disagree productively, kick it back to the operator (Cold Start path) before spawning.
- **Structured output is mandatory.** Agents must return parseable structure (POSITION/REASONING/PROPOSAL/CONCERNS for debate; ranking or score schema for poll). Free-form prose can't be aggregated.
- **Sub-routine invocations skip disk write.** When agents-panel is called by another skill (discover, prioritize, system-architecture), the value is the inline synthesis. Writing a decisions/ file for every sub-call would pollute the audit trail with decisions the operator never committed to.
- **Don't force consensus.** If 7 agents debate for 4 rounds and 4-3 split remains, the right output is "no consensus; here are the two camps and what would resolve them" — not a manufactured tiebreaker. Forced consensus IS the failure mode, not a workaround for it.
- **Cost scales linearly with N × R.** Debate at 3×3 ≈ $0.30-0.50. Poll at 10 agents ≈ $0.30-0.50. Opus multiplies ~10×. Default to sonnet; require explicit operator request for opus.
- **Early convergence saves cost.** Detect "all agents agree, confidence 8+, proposals aligned" after each round and stop early. The synthesis is the same; the bill is cheaper.

## History / origin

- **v1.0.0:** original two-mode design (debate + poll). Sub-routine protocol added so other skills could invoke without inheriting the standalone Pre-Dispatch + disk-write.
- **v2.0.0 (May 15, 2026):** mode-routing keyword table added; constraint-assignment pattern added to A2 after observing that perspective-only assignment converged on similar designs.
- **Phase 1E+ refactor (May 16, 2026, still v2.0.0):** body trimmed 382 → 249 lines (body 323 → 180) per the v6 program. Debate prompts + role assignments extracted to `procedures/debate.md`; poll schema + framing variations + aggregation extracted to `procedures/poll.md`; report template extracted; Before-Starting + mode-resolver + Artifact Contract added per Phase 1 primitives. Sub-routine protocol PRESERVED in body (load-bearing for callers — must be visible without loading a ref). No version bump — body-diet refactor lands on the meta-skills 2.0 base as a commit, not a release.

## When NOT to use this skill

- **Implementation work** → `architect-system` (design) or direct task execution. Agents-panel debates; it doesn't build.
- **Verifying existing code/output** → `/review-work`. Different shape — fresh-eyes runs ONE reviewer against an output; agents-panel runs N agents against a question.
- **Clarifying scope or requirements** → `/discover`. discover is multi-round interview; agents-panel is multi-agent debate. Use discover before you have a specific question.
- **Decomposing work after a decision is made** → `/breakdown-tasks`. agents-panel makes the decision; task-breakdown plans the execution.
- **"What do I think about X?"** — that's introspection, not multi-perspective analysis. Agents-panel won't add value over a single thoughtful pass.

## Further reading

- [`procedures/debate.md`](procedures/debate.md) [PROCEDURE] — Mode A: role assignments, constraint-assignment, per-round prompts, synthesis
- [`procedures/poll.md`](procedures/poll.md) [PROCEDURE] — Mode B: output schemas, framing variations, parallel spawn, aggregation methods
- [`report-template.md`](report-template.md) [PROCEDURE] — output template (standalone only; sub-routine returns inline)
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes (forced consensus, performative agreement, sub-routine writing to disk, vague problem spawning)
- [`examples/debate-walkthrough.md`](examples/debate-walkthrough.md) [EXAMPLE] — worked walkthrough of a 3-agent debate with mind-changes
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) [PROCEDURE] — `--fast` semantics (agents-panel's `budget: standard` means full Mode A or B by default; `--fast` reduces N+R)
