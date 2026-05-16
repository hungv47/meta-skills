# Meta Skills

Domain-agnostic process skills: discover, debate, decompose, verify, and run measurable eval loops. These skills wrap around other skills — they improve input quality, decision quality, output quality, or cross-cycle learning for any domain skill in the ecosystem.

## Design Philosophy

**"Just talk with your agent."** No plan mode. No giant documents nobody reads. Conversation IS the plan.

- **Conversation-first**: Decisions live in conversation context by default. Artifacts are save-points, not pipeline stages.
- **Loop-first when measurable**: When an initiative has a real-world metric and future cycles, use `skills-resources/loops/[slug]/` so strategy, execution, evals, results, and learnings stay together.
- **Adaptive depth**: Skills auto-calibrate. A clear task gets 3 questions. A vague idea gets a multi-round interview. No mode switching.
- **One skill per job**: Each skill does a fundamentally different job. No two skills that "ask questions to clarify things."
- **Agents-panel for perspectives**: When multiple perspectives or debate are needed, invoke agents-panel. Structured decomposition (task-breakdown) retains specialized agents.

## Skills (7)

| Skill | What it does | When |
|-------|-------------|------|
| `orchestrate-meta` | Cross-stack router — proposes the right stack orchestrator or process skill | When the user is unsure where to start |
| `discover` | Conversational discovery — adaptive from quick scoping to deep interviews | Before building anything non-trivial |
| `agents-panel` | Multi-perspective debate or consensus polling | Complex decision points, anywhere |
| `eval-loop` | Create/resume loop-centered measurable workspaces | Measurable marketing/content/product-growth initiatives that should improve over cycles |
| `task-breakdown` | Decompose complex work into buildable steps | When work is too big to just start |
| `fresh-eyes` | Fresh-eyes quality check after implementation | After building |
| `cleanup-artifacts` | Audit + groom `.agents/skill-artifacts/` — classify, critic-gate, archive (never delete) | When `.agents/skill-artifacts/` accumulates cruft, before a release |

## Process Flow

```
discover (conversation) --> build directly
    |                          |
    +-- agents-panel             +-- fresh-eyes
        (when complex              (after build)
         decision hit)
    |
    +-- eval-loop
        (when the work has a metric
         and should improve by cycles)
    |
    +-- task-breakdown
        (when work is complex enough
         to decompose first)
    |
    +-- cleanup-artifacts
        (when .agents/skill-artifacts/ has gone junk-drawer
         or before a release)
```

No rigid pipeline. The conversation guides what happens next.

## Context Resolution

Skills resolve context in this order:
1. **Conversation context** — same session, decisions are in the chat
2. **Artifacts on disk** — previous session saved a spec, architecture doc, etc.
3. **`skills-resources/experience/{domain}.md`** — append-only Q&A substrate written by every skill on cold-start (see Pre-Dispatch Protocol below)
4. **Discovery** — ask the user or scan the codebase

This means downstream skills don't REQUIRE artifacts to exist as files. They need the decisions to be known, from whatever source.

## Pre-Dispatch Protocol

Every skill in this stack (and across research/marketing/product) follows the canonical Pre-Dispatch protocol — see [`references/pre-dispatch-protocol.md`](references/pre-dispatch-protocol.md) for the full spec.

The protocol governs the moment between user invocation and agent dispatch. Two flows:

- **Warm Start** — most needed dimensions resolvable from artifacts or `skills-resources/experience/`. Skill summarizes findings, invites override, dispatches.
- **Cold Start** — ≥1 dimension missing. Skill emits a single bundled prompt with 3-5 decision-ranked questions, multiple-choice where possible, one round-trip. Answers persist to `skills-resources/experience/{domain}.md` so the next skill never re-asks.

`discover` is exempt — it IS the multi-round interview by design.

## Complexity Routing

Every skill declares a `budget` tier in frontmatter: `fast`, `standard`, or `deep`. The harness reads the tier and adjusts execution before dispatch:

| Budget | Execution |
|--------|-----------|
| **fast** | Single-agent, no sub-agent dispatch, no critic gate. Respond directly. |
| **standard** | Reduced orchestration — essential agents only, one critic pass. |
| **deep** | Full orchestration as documented — all agents, all layers, full critic gate. |

**Auto-downgrade** (before dispatch): ≤3 sentences AND no prior artifacts AND not deep → fast; single-topic clear-scope → cap at standard; multi-artifact / cross-domain / ambiguous → full tier.

**Override — bidirectional.** Auto-downgrade is heuristic; operator intent wins.

- **Upward (force deeper):** "run this thoroughly", "full analysis", "deep mode" → use the documented tier even on small inputs.
- **Downward (`--fast`):** `--fast` flag on the slash command, OR phrases "fast mode" / "quick pass" / "skip the orchestration" in the same turn → force single-agent execution regardless of tier. No sub-agents, no critic gate, no rewrite loops, no warm-start Pre-Dispatch interrogation. Skill produces its core deliverable in one pass and ends with "Ran in --fast mode; rerun without the flag for full critique."

**`--fast` does NOT skip Cold Start.** When no context is resolvable from artifacts or `skills-resources/experience/`, the skill still asks its bundled cold-start questions. `--fast` only bypasses multi-agent orchestration *after* context is resolved — it does not authorize hallucinating against missing decisions.

**Safety gates supersede `--fast`.** Hard-gated skills (mandatory Pre-Dispatch hard blocks or in-skill safety checkers — see each skill's Pre-Dispatch section for stack-specific examples) enforce gates regardless of `--fast`. The contract is "skip the heavy lift, not the guardrails."

Conflict rules: `--fast` on a `fast`-tier skill is a no-op. `--fast` + "run thoroughly" → `--fast` wins (explicit flag > upward phrase). `--fast` + `--deep` → `--fast` wins (downward bias on conflicting explicit flags). Budget is the default — never a ceiling, never a floor.

## Skill-Authoring Patterns

Conventions for writing skill bodies. The first canonized pattern:

### Inline shell interpolation — `` ! `<cmd>` ``

When a skill body needs **deterministic data** (git log, file count, manifest read, last-modified date, repo file list), embed `` ! `<cmd>` `` inline inside the skill body rather than instructing Claude to "go figure out X." When the user invokes the skill as a slash command, Claude Code executes the bracketed command and substitutes the output **before** the prompt reaches the LLM — so the model starts from a deterministic base instead of speculating.

**Three concrete wins:**

1. **Token saving.** No spin-up to derive the data each run. The first turn already has the answer.
2. **Determinism.** Same command → same output every invocation. No model-generation variance on a derived fact.
3. **Deterministic base, not speculation.** "Here are the latest 10 commits in the format I expect — go and do something with that." vs. "Go figure out the latest 10 commits, then …" The former skips a guess-step.

**Worked example** (inside a Pre-Dispatch warm-start prompt):

```markdown
Found:
- artifact disk snapshot →
  ! `find .agents/skill-artifacts -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' '` files on disk
- manifest last touched →
  ! `git log -1 --format='%cr' .agents/manifest.json 2>/dev/null || echo 'no git history'`
```

When `/cleanup-artifacts` runs, Claude Code substitutes both lines with command output. The orchestrator sees concrete numbers, not the literal backtick syntax.

**When to use:**
- **Pre-Dispatch context surfacing** — give the warm-start prompt a real snapshot instead of placeholders the LLM has to fill.
- **State-detection prose** — anywhere prose says "read X, count Y, derive Z" and X/Y/Z are local-deterministic.
- **Sub-agent prompt-building** in skill orchestrators — embed git/find/jq output inside the prompt block sent to Layer-1 agents so they don't re-derive.

**When NOT to use:**
- **Non-deterministic data** — web fetches, prospect signals, anything that varies by external state. Bang-backtick assumes one command → one consistent answer.
- **SKILL.md/agents/references content read by sub-agents via Read tool** — the Claude Code slash-command preprocessor handles `! `<cmd>`` lines at slash-command invocation time only; loading SKILL.md via the Read tool returns the file content as-is, without shell substitution. Bang-backtick only renders when the file is invoked as a slash command surface. For sub-agent prompts that need deterministic data, build the snippet in the orchestrator (run the command yourself) and inline the output into the prompt before dispatching — don't expect the sub-agent's read of the SKILL.md to interpolate.
- **Slow, side-effecting, or unsafe commands** — cap at <2s read-only operations. Never write, install, or call external services. The slash-command invocation is interactive; the user is waiting.
- **Cross-platform-fragile flags** — `stat -f` (macOS) vs `stat -c` (Linux), GNU-only `find` flags, etc. Stick to the portable subset (`git`, `find` with portable options, `wc`, `awk`, `head`, `tail`, `grep -E`, `sort | uniq -c`).

**Source:** Skills at Scale workshop (Nick Nisi & Zack Proser, WorkOS DX) — `Skills at Scale — Nick Nisi and Zack Proser, WorkOS.md`.

### Description-as-router

The `description` frontmatter field is not documentation — it IS the routing logic the harness reads when deciding whether to load the skill for a given turn. Write it dense with the acronyms, verbs, file types, and product names that should trigger the skill; generic-but-keyword-rich beats clever. When multiple sibling skills overlap (e.g., per-stack `orchestrate-*` skills), the description is also where you encode the disambiguation rule ("use this on X domains where output is always Y").

**Sanity check before shipping:** feed the description back to Claude with "given this description, when would you load this skill?" If the answer doesn't match the skill's intended triggers, the description is mis-routing — tighten before merging.

**When to use:** every new skill; every rename; every time a sibling skill is added that could route-collide.

**When NOT to use:** the sanity-check loop is for new skills, renames, or sibling-collision risk — don't re-run it on a stable, in-use skill just because it exists. Routine audits of existing descriptions belong in a periodic-review pass, not in this pattern.

**Source:** Skills at Scale workshop (WorkOS DX).

### Progressive disclosure

Keep `SKILL.md` thin (router + references map) and split heavy domain content into `references/*.md` files that load conditionally. The skill body says "if testing → load `testing.md`; if scoring → load `scoring-rubric.md`" so only the relevant references reach the context window. The pattern is already in use in this stack (`short-form-brief/references/platform-intelligence/`, `copywriting/references/`, `discover/references/operator-playbooks/`) — this entry canonizes it as the norm for any skill with >~200 lines of domain content.

**When to use:**
- A single skill spans multiple distinct sub-domains (per-platform, per-channel, per-archetype).
- Content is reference material (frameworks, catalogs, rubrics) that not every invocation needs.
- The SKILL.md is past ~250 lines and clearly readable as "router + appendix."

**When NOT to use:**
- A skill with a single workflow and <~200 lines of domain prose. Splitting adds navigation cost without payoff.
- Critic rubrics that every agent in the skill consumes — those belong in the SKILL.md or in the agent body, not in a conditional reference.

**Source:** Skills at Scale workshop (WorkOS DX); observed stack practice.

### Confidence-scoring gate

Before producing high-stakes output (architecture decisions, irreversible commits, scope-altering specs), have the skill score its own understanding on a 1–100 scale (problem clarity / goal definition / success criteria / scope / consistency, each 0–20). Refuse to proceed below a threshold (e.g., ≥95) and surface the gap as a clarifying question to the operator. The numeric score isn't the value — the iterative clarifying loop is. Pairs with, doesn't replace, the stack's multi-agent + critic gate: critic gates evaluate produced output; confidence-scoring gates prevent under-spec'd dispatch in the first place.

**When to use:** skills that produce high-stakes irreversible outputs from operator intent — `system-architecture` (blueprints that commit a tech stack), `discover` deep mode (specs that gate downstream `task-breakdown`), `cold-outreach` (sends).

**When NOT to use:** read-only audits (`fresh-eyes`, `cleanup-artifacts --dry-run`); creative-divergent skills where low-confidence exploration is the point (`agents-panel` mode=debate).

**Source:** Skills at Scale workshop — Nick Nisi's `ideation` skill.

### Audience-detection branching

When skill behavior should adapt to operator identity (veteran vs. new contributor; internal vs. external; multi-tenant org), branch on `` ! `git config user.email` `` plus `` ! `git log --author=... --oneline | wc -l` `` (peer to the bang-backtick convention above). Avoids per-environment forks and keeps the routing logic inside the skill rather than the harness.

**When to use:** stack-portable skills shipped to multiple users with materially different signals (a `fresh-eyes` that roasts harder on a 10k-commit veteran; a `cold-outreach` that adjusts house-voice for a contractor vs. employee operator).

**When NOT to use:** single-operator stacks where the branch always evaluates the same way. The current stack is solo-operator — this pattern is canonized as a forward-leaning convention; today's marginal applicability.

**Source:** Skills at Scale workshop (WorkOS DX).

### Eval methodology — N-with vs. N-without

Before shipping a skill (or a significant skill enrichment), run the same task N times with the skill loaded and N times without, score both outputs by rubric, and only ship if accuracy is higher with the skill loaded. Without this gate, additive enrichment can silently regress quality — Claude was already good at the domain, and the skill's prescriptions are pulling it off the optimal path. Nick Nisi's Next.js installer skill (shipped as part of WorkOS's `workos install` CLI) measurably dropped accuracy ~30% before this eval caught it.

**When to use:** every new skill; every enrichment that adds ≥5 prescription rules to an existing skill; suspected regressions when downstream-skill output quality changes after an upstream-skill ship.

**When NOT to use:** mechanical refactors that don't change behavior (path migrations, rename passes); reference-only additions that don't alter the skill's prompt routing.

**Source:** Skills at Scale workshop — Nick Nisi (caught a 30% regression on the WorkOS Next.js installer skill via this gate).

### Anti-pattern: over-prescribing in already-strong domains

A skill that prescribes 20+ rules in a domain Claude is already 90th-percentile at will **reduce** accuracy — the model defers to the prescriptions and ignores its own (often-better) defaults. Skills should add structure where the model lacks it, not constrain it where it doesn't.

**When to flag this risk:** any skill enrichment that pushes the prescription count past the model's existing-strength threshold for the domain. Humanize is the current observable example; copywriting and humanize are the next-most-at-risk surfaces if their patterns keep growing.

**Observable stack risk:** `humanize` is high-prescription (47 patterns post-REB-6). At the cliff. If patterns grow past ~55, run the N-with vs. N-without eval (entry above) against the calibration set before merging. If skill-loaded accuracy regresses, fold new patterns into existing entries rather than extending the catalog.

**Detection signals:**
- The same rule appears in 3+ places in the skill body or across reference files (the model has already absorbed it).
- Reviewers describe the skill output as "stiff" or "formulaic" compared to no-skill baseline.
- The skill's critic gate FAILs outputs the operator would accept by hand.

**Source:** Skills at Scale workshop — WorkOS observation; cross-applies to `humanize`'s growth trajectory.

---

## Manifest Spec

State detection across all meta-skills (especially `orchestrate-meta`) reads `.agents/manifest.json` — a derived index of artifact metadata (producer, date, status, schema version, staleness, title, summary, purpose, lifecycle, selection rules, and lineage). The manifest is rebuilt from artifact frontmatter by `meta-skills/scripts/manifest-sync.ts`; skills don't write to it directly. The same sync pass writes `.agents/artifact-index.md`, a human-readable selection index for browsing why artifacts exist and when to use them. See [`references/manifest-spec.md`](references/manifest-spec.md) for the full contract. Measurable initiative loops live under `skills-resources/loops/[slug]/` and are specified in [`references/eval-loop-spec.md`](references/eval-loop-spec.md). Skills that produce artifacts (`discover` → `.agents/skill-artifacts/meta/specs/<slug>.md`, `eval-loop` → `skills-resources/loops/[slug]/program.md`, `task-breakdown` → `.agents/skill-artifacts/meta/tasks.md`, `agents-panel` → `.agents/skill-artifacts/meta/decisions/[date]-<slug>.md`, `fresh-eyes` → `.agents/skill-artifacts/meta/records/[date]-fresh-eyes-<slug>.md`) must write the required frontmatter fields (`skill`, `version`, `date`, `status`) plus selection fields (`summary`, `purpose`, `lifecycle`, `use_when`) for non-terminal artifacts, then call sync as their last step.

## Artifacts

| Skill | Artifact | Notes |
|-------|----------|-------|
| `discover` | `.agents/skill-artifacts/meta/specs/<slug>.md` | Optional — only when user asks to save. Per-spec slug, working drafts (lifecycle: spec). |
| `eval-loop` | `skills-resources/loops/[slug]/program.md`, `context.md`, `results.tsv`, `learnings.md` | Loop-centered workspace for measurable strategy → execution → evaluation cycles. |
| `agents-panel` | `.agents/skill-artifacts/meta/decisions/[date]-<slug>.md` | Dated, immutable — operator-committed strategic decision (lifecycle: decision). |
| `task-breakdown` | `.agents/skill-artifacts/meta/tasks.md` | Task list with acceptance criteria. Session anchor (lifecycle: pipeline). |
| `fresh-eyes` | `.agents/skill-artifacts/meta/records/[date]-fresh-eyes-<slug>.md` | Often returned inline; when persisted, dated snapshot (lifecycle: snapshot). |
| `cleanup-artifacts` | `.agents/skill-artifacts/meta/records/[date]-cleanup-artifacts-<slug>.md` | Per-run audit report (lifecycle: snapshot). Side effect: moves to `.agents/skill-artifacts/.archive/[date]/` on `--apply`. |

## Multi-Agent Patterns

**For decisions, analysis, and multiple perspectives:** `agents-panel` is the centralized capability. It works two ways:
- **Standalone**: User invokes directly (`/agents-panel "debate X"`)
- **Sub-routine**: Other skills invoke it when they hit a complex decision (e.g., discover hits a fork)

**For structured decomposition:** `task-breakdown` retains its own specialized agents (decomposer, dependency-mapper, ordering, acceptance, critic) because they do structured work — each produces a different output that gets merged. This is different from the perspective-based debate/poll that agents-panel provides.

**The principle:** Don't use multi-agent for conversations. Use it for structured work (task-breakdown) or for genuine multi-perspective analysis (agents-panel).

## Learned Rules (Self-Correcting)

Meta-skills improve over time via `.agents/skill-artifacts/meta/records/learned-rules.md`:
- User corrections are captured as rules
- Before dispatching, skills read relevant learned rules
- Rules supplement SKILL.md instructions, never override them
- Cap at ~50 rules — archive old ones when exceeded

## Cross-Stack

All meta-skills are domain-agnostic. They compose with any skill in any stack:
- `discover` before any build/create skill
- `agents-panel` for any decision that needs multiple perspectives
- `task-breakdown` after architecture for complex builds
- `fresh-eyes` after any critical artifact or implementation

Skill routing is the agent's job — it proposes skills proactively based on the system reminder skill list. There is no routing skill.

## Migration History

### v1 → v2: 7 skills → 5 skills

| Old Skill | New Home | Notes |
|-----------|----------|-------|
| `plan-interviewer` | `discover` | Full interview mode = discover at deep depth |
| `preflight` | `discover` | Quick scope mode = discover at light depth |
| `multi-lens` | `agent-room` | Same debate/poll mechanics, new name + sub-routine capability (later renamed to `agents-panel` in v5) |
| `artifact-status` | `navigate` | Status mode = `/navigate status` |
| `skill-router` | `navigate` | Suggest/orchestrate modes preserved |
| `task-breakdown` | `task-breakdown` | Updated: no hard artifact dependency |
| `review-chain` | `review-chain` | Unchanged (later renamed to `fresh-eyes` in v5) |

### v2 → v3: navigate trimmed

| Change | Rationale |
|--------|-----------|
| Removed navigate Mode B (Suggest/routing) | The agent proposes skills proactively on every response — navigate's routing was redundant. Skill registry reference file retained for the agent to read on demand. |
| Navigate now: Status + Orchestrate only | Two clear jobs: "what exists/what's stale" and "track a complex multi-phase workflow across sessions" |

### v3 → v4: navigate removed

| Change | Rationale |
|--------|-----------|
| Removed navigate skill entirely | Status mode unused in practice — artifact freshness checks happen inline within consuming skills. Orchestrate mode unused — workflows compose conversationally. Routing was already handled by the agent. No remaining job justified the surface area. |

### v4 → v5: rename pass for clarity

| Old name | New name | Rationale |
|----------|----------|-----------|
| `agent-room` | `agents-panel` | "agent-room" leaked implementation; "agents-panel" describes the user-facing job (debate or poll a panel of perspectives). |
| `review-chain` | `fresh-eyes` | "chain" described mechanism; "fresh-eyes" describes value — independent post-implementation review. |

### v5 → v6: orchestrate-* rename + cleanup-artifacts

| Change | Rationale |
|--------|-----------|
| `start-meta` → `orchestrate-meta` | The skill scans existing artifacts and continues mid-pipeline; "start" implied first-run init. The orchestration role belongs in the slash-command surface. (BREAKING; no backward-compat alias.) |
| Added `cleanup-artifacts` | The `.agents/skill-artifacts/` artifact tree accumulates fast (skill outputs, briefs, fresh-eyes reports, manifest snapshots). Without active grooming, it becomes a junk drawer. New single-agent meta-skill mirrors `machine-cleanup`'s safety pattern at the project artifact-tree level. MOVE-not-delete (archives to `.agents/skill-artifacts/.archive/[date]/`); explicit per-category operator confirmation; HARD-NEVER on `brand/`, `research/`, `architecture/`, `.git/`, submodule dirs, `.agents/manifest.json`, `skills-resources/experience/`, `tasks.md`, `roadmap.md`. |
