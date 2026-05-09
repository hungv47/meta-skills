# Meta Skills

Domain-agnostic process skills: discover, debate, decompose, verify. These skills wrap around other skills — they improve input quality, decision quality, or output quality for any domain skill in the ecosystem.

## Design Philosophy

**"Just talk with your agent."** No plan mode. No giant documents nobody reads. Conversation IS the plan.

- **Conversation-first**: Decisions live in conversation context by default. Artifacts are save-points, not pipeline stages.
- **Adaptive depth**: Skills auto-calibrate. A clear task gets 3 questions. A vague idea gets a multi-round interview. No mode switching.
- **One skill per job**: Each skill does a fundamentally different job. No two skills that "ask questions to clarify things."
- **Agents-panel for perspectives**: When multiple perspectives or debate are needed, invoke agents-panel. Structured decomposition (task-breakdown) retains specialized agents.

## Skills (5)

| Skill | What it does | When |
|-------|-------------|------|
| `discover` | Conversational discovery — adaptive from quick scoping to deep interviews | Before building anything non-trivial |
| `agents-panel` | Multi-perspective debate or consensus polling | Complex decision points, anywhere |
| `task-breakdown` | Decompose complex work into buildable steps | When work is too big to just start |
| `fresh-eyes` | Fresh-eyes quality check after implementation | After building |
| `cleanup-artifacts` | Audit + groom `.agents/` — classify, critic-gate, archive (never delete) | When `.agents/` accumulates cruft, before a release |

## Process Flow

```
discover (conversation) --> build directly
    |                          |
    +-- agents-panel             +-- fresh-eyes
        (when complex              (after build)
         decision hit)
    |
    +-- task-breakdown
        (when work is complex enough
         to decompose first)
    |
    +-- cleanup-artifacts
        (when .agents/ has gone junk-drawer
         or before a release)
```

No rigid pipeline. The conversation guides what happens next.

## Context Resolution

Skills resolve context in this order:
1. **Conversation context** — same session, decisions are in the chat
2. **Artifacts on disk** — previous session saved a spec, architecture doc, etc.
3. **`.agents/experience/{domain}.md`** — append-only Q&A substrate written by every skill on cold-start (see Pre-Dispatch Protocol below)
4. **Discovery** — ask the user or scan the codebase

This means downstream skills don't REQUIRE artifacts to exist as files. They need the decisions to be known, from whatever source.

## Pre-Dispatch Protocol

Every skill in this stack (and across research/marketing/product) follows the canonical Pre-Dispatch protocol — see [`references/pre-dispatch-protocol.md`](references/pre-dispatch-protocol.md) for the full spec.

The protocol governs the moment between user invocation and agent dispatch. Two flows:

- **Warm Start** — most needed dimensions resolvable from artifacts or `.agents/experience/`. Skill summarizes findings, invites override, dispatches.
- **Cold Start** — ≥1 dimension missing. Skill emits a single bundled prompt with 3-5 decision-ranked questions, multiple-choice where possible, one round-trip. Answers persist to `.agents/experience/{domain}.md` so the next skill never re-asks.

`discover` is exempt — it IS the multi-round interview by design.

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
- **SKILL.md/agents/references content read by sub-agents via Read tool** — Read returns literal text; no shell interpolation happens. Bang-backtick only renders when the file is invoked as a slash command surface, not when it's loaded as reference content. Keep agent-prompt-builder snippets self-contained text the agent reads as-is.
- **Slow, side-effecting, or unsafe commands** — cap at <2s read-only operations. Never write, install, or call external services. The slash-command invocation is interactive; the user is waiting.
- **Cross-platform-fragile flags** — `stat -f` (macOS) vs `stat -c` (Linux), GNU-only `find` flags, etc. Stick to the portable subset (`git`, `find` with portable options, `wc`, `awk`, `head`, `tail`, `grep -E`, `sort | uniq -c`).

**Source:** Skills at Scale workshop (Nick Nisi & Zack Proser, WorkOS DX) — `Skills at Scale — Nick Nisi and Zack Proser, WorkOS.md`.

---

## Manifest Spec

State detection across all meta-skills (especially `orchestrate-meta`) reads `.agents/manifest.json` — a derived index of artifact metadata (producer, date, status, schema version, staleness, summary). The manifest is rebuilt from artifact frontmatter by `meta-skills/scripts/manifest-sync.ts`; skills don't write to it directly. See [`references/manifest-spec.md`](references/manifest-spec.md) for the full contract. Skills that produce artifacts (`discover` → `.agents/skill-artifacts/meta/specs/<slug>.md`, `task-breakdown` → `.agents/skill-artifacts/meta/tasks.md`, `agents-panel` → `.agents/skill-artifacts/meta/decisions/[date]-<slug>.md`, `fresh-eyes` → `.agents/skill-artifacts/meta/records/[date]-fresh-eyes-<slug>.md`) must write the required frontmatter fields (`skill`, `version`, `date`, `status`) and call sync as their last step.

## Artifacts

| Skill | Artifact | Notes |
|-------|----------|-------|
| `discover` | `.agents/skill-artifacts/meta/specs/<slug>.md` | Optional — only when user asks to save. Per-spec slug, working drafts (lifecycle: spec). |
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
| Added `cleanup-artifacts` | The `.agents/` artifact tree accumulates fast (skill outputs, briefs, fresh-eyes reports, manifest snapshots). Without active grooming, it becomes a junk drawer. New single-agent meta-skill mirrors `machine-cleanup`'s safety pattern at the project artifact-tree level. MOVE-not-delete (archives to `.agents/skill-artifacts/.archive/[date]/`); explicit per-category operator confirmation; HARD-NEVER on `brand/`, `research/`, `architecture/`, `.git/`, submodule dirs, `.agents/manifest.json`, `.agents/experience/`, `tasks.md`, `roadmap.md`. |
