# Meta Skills

Domain-agnostic process skills: prepare, plan, analyze, verify, navigate. These skills wrap around other skills — they improve input quality, decision quality, or output quality for any domain skill in the ecosystem.

## Skills (7)

| Skill | What it does | Composition |
|-------|-------------|-------------|
| `preflight` | Surface assumptions + define success contract | Run BEFORE any domain skill |
| `plan-interviewer` | Multi-round interview → produce spec | Run BEFORE architecture/tasks |
| `task-breakdown` | Decompose into granular, testable tasks | Run AFTER architecture |
| `multi-lens` | Multi-agent debate or consensus polling | REPLACE a decision step |
| `review-chain` | Fresh-eyes review → resolve chain | Run AFTER any domain skill |
| `artifact-status` | Scan .agents/, report state, recommend next | Run ANYTIME for navigation |
| `skill-router` | Analyze goal → suggest skill team | Run ANYTIME for navigation |

## Process Flow

```
preflight → plan-interviewer → task-breakdown → (execute) → review-chain
                                    ↕
                              multi-lens (for decisions at any point)
                                    ↕
                    artifact-status + skill-router (navigate anytime)
```

## Composition Modes
- **Pre-skill:** preflight, plan-interviewer, task-breakdown (run BEFORE domain skills)
- **Post-skill:** review-chain (run AFTER domain skills)
- **Alternative:** multi-lens (replace a single-agent decision with multi-perspective analysis)
- **Navigation:** artifact-status, skill-router (orient at any time)

## Artifacts
Meta-skill artifacts save to `.agents/meta/`:
- `.agents/meta/multi-lens-report.md` (+ `multi-lens-transcript.json` for debate mode)
- `.agents/meta/review-chain-report.md`
- `.agents/meta/learned-rules.md` (cross-cutting, persists across all runs)
- `preflight` produces inline output (no persistent artifact)
- `plan-interviewer` produces `.agents/spec.md`
- `task-breakdown` produces `.agents/tasks.md`

## Orchestration Patterns

Meta-skills use three patterns:

1. **Two-layer orchestration** (`plan-interviewer`, `task-breakdown`, `skill-router`): Static agent roster with L1 parallel → merge → L2 sequential → critic gate
2. **Methodology** (`preflight`, `artifact-status`): Single-pass, no subagents
3. **Dynamic spawning** (`multi-lens`, `review-chain`): Agent count, roles, and instructions defined at runtime. No `agents/` directory — prompts are inline templates.

## Learned Rules (Self-Correcting)

Meta-skills improve over time via a persistent learned-rules system.

**How it works:**
1. When a user corrects agent behavior, the correction is captured as a rule in `.agents/meta/learned-rules.md`
2. Before dispatching agents, meta-skills read relevant learned rules
3. Rules are included in agent prompts to prevent repeating mistakes

**Rule format:**
```markdown
## Rule: {short name}
- **Trigger**: {what situation activates this rule}
- **Rule**: {what to do or not do}
- **Source**: {which skill/conversation discovered this}
- **Date**: {YYYY-MM-DD}
```

**Rules:**
- Only learn from explicit user corrections — never auto-append
- Rules supplement SKILL.md instructions, never override them
- Cap at ~50 rules — archive old ones when exceeded

## Cross-Stack

All meta-skills are domain-agnostic. They compose with any skill in any stack:
- `preflight` before `system-architecture`, `content-create`, or any build/create skill
- `plan-interviewer` before complex builds needing a spec
- `multi-lens` for architecture decisions, strategic choices, or design trade-offs
- `review-chain` after `system-architecture`, `code-cleanup`, or any critical artifact
