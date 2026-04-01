# Meta Skills

7 process-layer skills that wrap around domain skills to improve quality at every stage.

## Install

```bash
npx skills add hungv47/meta-skills
```

## Skills

| Skill | What it does |
|-------|-------------|
| `preflight` | Surface assumptions and define a 4-part success contract before building |
| `plan-interviewer` | Multi-round interviews to surface requirements before implementation |
| `task-breakdown` | Break implementation into granular, testable tasks with acceptance criteria |
| `multi-lens` | Multi-agent debate (agents argue in rounds) or consensus polling (agents analyze independently) |
| `review-chain` | Fresh-eyes review chain — implement → review → resolve, max 2 rounds |
| `artifact-status` | Scan `.agents/` — report what exists, what's stale, what to run next |
| `skill-router` | Analyze a goal → suggest the right skill team → orchestrate workflows |

## How They Compose

```
/preflight → /plan-interviewer → /task-breakdown → (execute) → /review-chain
   ↑ scope      ↑ specify           ↑ plan                       ↑ verify
```

Meta-skills are horizontal — they attach to any point in the pipeline, not a fixed position.

| Mode | Skills | Example |
|------|--------|---------|
| Before (improve input) | `preflight`, `plan-interviewer`, `task-breakdown` | `/preflight` → `/system-architecture` |
| Instead (replace decision) | `multi-lens` | `/multi-lens "tech stack debate"` |
| After (verify output) | `review-chain` | `/code-cleanup` → `/review-chain` |
| Navigate (orient anytime) | `artifact-status`, `skill-router` | `/skill-router "your goal"` |

## Rigorous Technical Build (full recipe)

```
1. /preflight            → surface assumptions, define contract
2. /plan-interviewer     → spec.md (interactive)
3. /system-architecture  → system-architecture.md
4. /review-chain         → verify architecture
5. /task-breakdown       → tasks.md
6. (build tasks, /review-chain after each critical task)
7. /code-cleanup + /technical-writer (parallel)
```

## License

MIT
