# Meta Skills

![Meta Skills](./assets/banner.png)

> **v3.0.0 BREAKING:** `start-meta` renamed to `orchestrate-meta`. Update any `/start-meta` invocations in your workflows to `/orchestrate-meta`.

7 process-layer skills (incl. `/orchestrate-meta` cross-stack orchestrator) that wrap around domain skills to improve quality at every stage.

**New here, or unsure which stack to use?** Run `/orchestrate-meta` — it reads cross-stack state and routes you to the right stack-orchestrator (`/orchestrate-research`, `/orchestrate-marketing`, `/orchestrate-product`) or process skill (`discover`, `eval-loop`, `agents-panel`, `task-breakdown`, `fresh-eyes`).

## Install

Installs via the [`skills` CLI](https://skills.sh). Requires Node.js 18+. Auto-detects Claude Code, Cursor, Codex, Windsurf, Gemini CLI, or VS Code.

```bash
# Install the full meta stack
npx skills add hungv47/meta-skills

# Cherry-pick a single skill (any skill in the stack — these are just examples)
npx skills add hungv47/meta-skills --skill fresh-eyes
npx skills add hungv47/meta-skills --skill discover
npx skills add hungv47/meta-skills --skill task-breakdown

# List available skills without installing
npx skills add hungv47/meta-skills --list

# Target a specific editor
npx skills add hungv47/meta-skills --agent claude-code

# Install globally — recommended for meta-skills since they're domain-agnostic
npx skills add hungv47/meta-skills -g
```

See the [root README](https://github.com/hungv47/agent-skills#install) for the full install reference.

### Alternative: Claude Code plugin

For Claude Code users who prefer the native plugin system:

```
/plugin marketplace add hungv47/agent-skills
/plugin install meta-skills@agent-skills
```

Skills are then namespaced — call them as `/meta-skills:discover`, `/meta-skills:fresh-eyes`, etc. **`npx skills add` is recommended for most users** (editor-agnostic, no namespace prefix, per-skill cherry-pick). Plugin path is Claude Code only.

## Design Philosophy

**"Just talk with your agent."** No plan mode. No giant documents nobody reads. Conversation IS the plan.

- **Conversation-first**: Decisions live in conversation context. Artifacts are save-points, not pipeline stages.
- **Loop-first when measurable**: Measurable initiatives live in `skills-resources/loops/[slug]/` so strategy, execution, evals, result rows, and learnings compound together.
- **Adaptive depth**: Skills auto-calibrate. A clear task gets 3 questions. A vague idea gets a multi-round interview.
- **One skill per job**: Each skill does a fundamentally different job.
- **Agents-panel for perspectives**: When multiple perspectives or debate are needed, invoke agents-panel.

## Skills

### `orchestrate-meta` — route across stacks

Top-level router that reads project state and proposes the right stack orchestrator or process skill. It never auto-invokes; it prints the recommended next command with rationale.

**Use when:**
- You are not sure whether the work is research, marketing, product, or process
- You are returning to a project and want a state-aware next step
- The ask spans multiple stacks

**Produces:** `skills-resources/experience/meta-workflow.md`

---

### `discover` — talk until you're clear, then build

Conversational discovery that adapts from quick scoping (3-5 questions) to deep interviews (multi-round). Two modes auto-detected: **idea-stage** (vague idea → demand-validated alternatives, gated by an idea-critic agent scoring 5 red + 5 green flags) and **plan-review** (existing spec/sketch → audit through one of 4 sub-modes: SCOPE EXPANSION / SELECTIVE EXPANSION / HOLD SCOPE / SCOPE REDUCTION). Operator-grade rigor structure — saved specs include Premise Challenge / Dream State Mapping / Implementation Alternatives / Temporal Interrogation / Verdict.

**Use when:**
- You have a vague idea and need to figure out what to build (idea-stage)
- You have an existing plan/spec and want it pressure-tested (plan-review)
- You're about to start a task and want to catch blind spots
- Requirements are unclear and need structured discovery

**Not for:** multi-perspective debate (use `agents-panel`) or decomposing work (use `task-breakdown`)

**Produces:** Conversation context (default) or `.agents/skill-artifacts/meta/specs/*.md` (when explicitly saved)

---

### `agents-panel` — multi-agent discussion rooms

Stochastic multi-agent debate (agents argue in rounds, converge) or consensus polling (agents analyze independently with varied framings). Works standalone or as a sub-routine invoked by other skills.

**Use when:**
- You're facing a complex trade-off — architecture, strategic direction, design decision
- You want to stress-test an idea by having agents argue against it
- Another skill (like discover) hits a decision point that needs multiple perspectives

**Not for:** implementation (use `system-architecture`) or verification (use `fresh-eyes`)

**Produces:** `.agents/skill-artifacts/meta/decisions/[date]-*.md`

---

### `eval-loop` — measurable improvement workspace

Creates or resumes a loop-centered workspace for measurable strategy → marketing/content execution → evaluation cycles. It is the single scaffold and ledger entrypoint: fixed scope, metric contract, mutable surface, results ledger, keep/discard decisions, and learning promotion. Surface-specific eval skills still do the actual scoring.

**Use when:**
- You want a campaign, page, ad set, email sequence, social series, or content motion to improve over cycles
- You need one place for strategy artifacts, produced marketing/content assets, eval snapshots, result rows, and promoted learnings
- You're deciding where measurable outputs and evals should live

**Not for:** vague strategy with no metric (use `discover`), one-shot implementation tasks (use `task-breakdown`), or generic scoring of every surface. Use the relevant eval skill for measurement artifacts (`short-form-eval` and `lp-eval` today; future `ad-eval`, `email-eval`, `campaign-eval`).

**Produces:** `skills-resources/loops/[slug]/program.md`, `context.md`, `strategy/`, `execution/`, `evals/`, `results.tsv`, `learnings.md`

---

### `task-breakdown` — decompose into buildable tasks

Breaks work into granular, testable tasks with acceptance criteria, dependencies, and implementation order. Works from conversation context or artifacts.

**Use when:**
- Work is too big to just start — needs decomposition first
- You want tasks sized for AI agents or individual work sessions
- You need clear acceptance criteria and dependency ordering

**Not for:** clarifying requirements (use `discover`) or designing architecture (use `system-architecture`)

**Produces:** `.agents/skill-artifacts/meta/tasks.md`

---

### `fresh-eyes` — independent quality check

Fresh-eyes review chain: implement → review (by an agent with no sunk-cost bias) → resolve if issues found. Max 2 rounds. Auto-triggers for security-sensitive code.

**Use when:**
- You've built something and want independent verification
- The work is security-sensitive or involves data mutations
- You want a reviewer who hasn't seen the implementation reasoning

**Not for:** code refactoring (use `code-cleanup`) or decision analysis (use `agents-panel`)

**Produces:** `.agents/skill-artifacts/meta/records/fresh-eyes-*.md`

---

### `cleanup-artifacts` — groom the artifact tree

Audits `.agents/skill-artifacts/` for stale, orphaned, legacy, and ephemeral artifacts, then archives confirmed candidates behind explicit operator approval. Moves files; never deletes.

**Use when:**
- `.agents/skill-artifacts/` has become hard to navigate
- You're preparing a release or PR and want artifact hygiene
- You suspect renamed or removed skills left orphan outputs

**Produces:** `.agents/skill-artifacts/meta/records/[date]-cleanup-artifacts-<slug>.md`

---

## How They Compose

```
discover (conversation) --> build directly
    |                          |
    +-- agents-panel             +-- fresh-eyes
        (complex decisions)        (after build)
    |
    +-- eval-loop
        (when work is measurable
         and should improve by cycles)
    |
    +-- task-breakdown
        (complex work)
```

## Quick Build Recipe

```
1. /discover              → conversational clarity (interactive)
2. /system-architecture    → system-architecture.md
3. /eval-loop          → loop workspace for measurable marketing/content work, when relevant
4. /task-breakdown         → tasks.md
5. (build tasks, /fresh-eyes after critical ones)
6. /code-cleanup + /docs-writing (parallel)
7. (commit + PR via gh; deploy via project's CI)
```

## Releases

```bash
# Update to latest version (if already installed)
npx skills update

# Add this stack to your project
npx skills add hungv47/meta-skills
```

## Changelog

Full release history with per-version notes: [meta-skills/releases](https://github.com/hungv47/meta-skills/releases)

## License

MIT
