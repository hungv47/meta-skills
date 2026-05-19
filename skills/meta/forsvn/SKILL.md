---
name: forsvn
description: "The front door for the FORSVN agent stack. Classifies what you're trying to do, loads your shared product context and prior session state, asks ≤2 clarifying questions only when truly ambiguous, and either dispatches to the right skill or resumes a prior initiative. Branded exception to verb-first naming — this is the only skill that is a noun, because it's the operating system. Use when you don't know which skill to call, when you want to continue something you started, or when a vague ask needs to land somewhere concrete. Not a brainstorming chat — always produces a route, a dispatch, or a written artifact. Direct skill calls remain supported; this is the discovery surface, not a gatekeeper."
argument-hint: "[free-form ask, or 'resume', or empty for state summary]"
allowed-tools: Read Grep Glob Bash Write Edit
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: fast
  estimated-cost: "$0.02-0.08"
promptSignals:
  phrases:
    - "where do i start"
    - "what should i do"
    - "i don't know"
    - "help me"
    - "continue"
    - "resume"
    - "pick up where i left off"
    - "what was i working on"
    - "launch this"
    - "ship this"
    - "/forsvn"
  anyOf:
    - "where do i start"
    - "guide me"
    - "i'm new"
    - "help me launch"
    - "help me ship"
    - "what should i do next"
    - "resume"
    - "continue"
  minScore: 3
routing:
  intent-tags:
    - front-door
    - intent-classifier
    - resume
    - cross-stack-orchestration
  position: front-door
  lifecycle: pipeline
  produces:
    - .forsvn/routing/last-session.md
    - .forsvn/routing/history/*.md
    - .forsvn/routing/initiatives.md
    - .forsvn/context/product-context.md (autodraft on first run)
  consumes:
    - .forsvn/context/product-context.md
    - .forsvn/experience/*.md
    - .forsvn/routing/last-session.md
    - .forsvn/artifacts/**/*.md
    - .forsvn/loops/**/program.md
    - .forsvn/evals/**/*.md
    - brand/BRAND.md
    - research/icp-research.md
    - research/market-research.md
    - architecture/system-architecture.md
    - CLAUDE.md
    - README.md
  defers-to:
    - skill: orchestrate-meta
      when: "intent is clearly cross-stack and user wants the deep router, not the front door"
    - skill: orchestrate-research
      when: "intent is single-domain research"
    - skill: orchestrate-marketing
      when: "intent is single-domain marketing"
    - skill: orchestrate-product
      when: "intent is single-domain product"
    - skill: discover
      when: "scope is genuinely unclear and needs a full discovery conversation"
  interactive: true
  estimated-complexity: low
---

# /forsvn — Front Door

*The operating system for the FORSVN agent stack. Classify the ask, load the context, route or resume. Always lands on a concrete next action.*

## When To Use

- Vague ask: "help me launch this", "what should I work on?", "where do I start?"
- Resume: "continue", "pick up where I left off"
- New to the stack and don't know which skill to call.
- Want to see what's in flight across initiatives.

## When NOT To Use

- You already know the skill — call it directly. `/forsvn` is the discovery surface, not a gate.
- You want a deep multi-perspective debate — use `agents-panel`.
- You want a full scoping conversation — use `discover`.

## Operating Contract

Every invocation does exactly these five steps. No skipping, no looping.

### Step 1 — State snapshot

Render the disk snapshot inline. Shell-bang fires at slash-command invocation:

```
Context root:
! `[ -d .forsvn ] && echo "  .forsvn/ exists" || echo "  .forsvn/ not yet scaffolded — will bootstrap"`

Product context:
! `[ -f .forsvn/context/product-context.md ] && grep -E "^status:" .forsvn/context/product-context.md | head -1 | sed 's/^/  /' || echo "  (no product-context.md — will autodraft on dispatch)"`

Last session:
! `[ -f .forsvn/routing/last-session.md ] && grep -E "^(timestamp|intent|status|next-action):" .forsvn/routing/last-session.md | sed 's/^/  /' || echo "  (no prior session)"`

Active initiatives:
! `[ -f .forsvn/routing/initiatives.md ] && awk '/^\|.*active.*\|/' .forsvn/routing/initiatives.md | head -5 || echo "  (none)"`

Canonical sources:
! `for f in brand/BRAND.md research/icp-research.md research/market-research.md architecture/system-architecture.md; do [ -f "$f" ] && echo "  $f ✓" || echo "  $f ✗"; done`

Recent artifacts:
! `find .forsvn/artifacts -mindepth 3 -name "*.md" -type f -mtime -7 2>/dev/null | head -5 | sed 's/^/  /' || echo "  (none in last 7 days)"`
```

### Step 2 — Resume check

If `.forsvn/routing/last-session.md` exists AND `status: awaiting-user` AND timestamp < 7 days:

```
You were last working on: <intent>
  Initiative: <slug>
  Next action: <next-action>
  Open question: <first open question if any>

Resume? (yes / no / new)
```

Default to resume if the current ask is empty or "continue"/"resume". Otherwise classify fresh per Step 3.

### Step 3 — Classify intent

Parse the user's ask against the taxonomy. Pick exactly one of these intent classes:

| User says | Intent class | Route |
|---|---|---|
| "audience", "ICP", "competitors", "market", "diagnose", "prioritize", "funnel", "targets" | research | `/orchestrate-research` |
| "brand", "campaign", "copy", "headline", "landing page", "LP", "ad", "SEO", "video", "TikTok", "reel", "short", "cold email", "outreach", "humanize", "VN tone" | marketing | `/orchestrate-marketing` |
| "user flow", "tech stack", "architecture", "schema", "API", "code", "refactor", "machine cleanup", "docs", "README" | product | `/orchestrate-product` |
| "scope this", "clarify", "what should we build", "requirements unclear" | scope | `/discover` |
| "debate this", "multiple perspectives", "poll", "consensus" | debate | `/agents-panel` |
| "decompose", "task list", "break down", "implementation order" | decompose | `/task-breakdown` |
| "review my work", "second opinion", "did I miss anything" | review | `/fresh-eyes` |
| "improvement loop", "track metric", "experiment ledger" | loop | `/eval-loop` |
| Empty + no resume offer | summary | print state summary, exit |
| Ambiguous, multi-domain, "launch this", "ship this" | multi | propose 2-3 step chain |

**Rules:**
- Single-domain → dispatch to the stack orchestrator (not the leaf skill — let the orchestrator pick).
- Multi-domain → propose the chain, ask user to confirm before dispatching the first step.
- Genuinely unclear → ask ≤2 clarifying questions. **Two questions is a hard cap.** If still unclear, hand off to `/discover`.
- Brand proving workflow (D5): if intent is marketing/launch AND `brand/BRAND.md` is missing → route to `brand-system` first (will be renamed `create-brand` in Workstream B).

### Step 4 — Load context + dispatch

Before dispatching, ensure:

1. **Product context exists.** If `.forsvn/context/product-context.md` is missing AND the routed skill needs it (marketing, product, research) → autodraft from `README.md`, `brand/BRAND.md`, `research/*.md`, `package.json`. Mark `status: draft`. Tell user: "Autodrafted product context. Review before treating as canonical." Do NOT block dispatch — drafts are usable.
2. **Experience entries relevant to the intent are read.** Grep `.forsvn/experience/*.md` for keywords matching the intent. Surface anything relevant: "You previously said X — still applies?"
3. **Initiative slug is set.** If new initiative → propose a kebab-case slug and ask user to confirm. If resuming → use existing slug.

Then print the hand-off:

```
→ /<skill-name>

Why: <one line>
Reads: <key context files>
Writes: .forsvn/artifacts/<initiative>/<skill>/...
```

Operator types the slash command. `/forsvn` does NOT auto-invoke.

### Step 5 — Persist routing record

Write `.forsvn/routing/last-session.md` (overwrite) and append a copy to `.forsvn/routing/history/YYYY-MM-DD-HHMMSS-<intent-tag>.md`.

Schema:

```markdown
---
timestamp: YYYY-MM-DD HH:MM:SS
intent: <classified intent>
initiative: <slug or empty>
routed-to: /<skill-name or empty if summary>
status: dispatched | awaiting-user | completed | abandoned
next-action: <one line>
---

## Conversation Summary
<2-3 lines>

## Open Questions
- <unresolved items>

## Artifacts Produced This Session
- <paths, or "none yet">
```

Update `.forsvn/routing/initiatives.md` if a new initiative was created or status changed.

## Bootstrap (First Run)

If `.forsvn/` does not exist at the project root:

1. Create the skeleton: `mkdir -p .forsvn/{context,experience,artifacts,loops,evals,routing,dashboard}`.
2. Copy the README templates from this skill's `templates/` dir (or the canonical `.forsvn/` in this repo if available) into the new tree.
3. Add `.forsvn/` to project `.gitignore` only if the user confirms — some users want to track their context, others don't.
4. Tell the user: "Scaffolded `.forsvn/`. Your shared context will live there."

Then proceed with the normal 5-step flow.

## Anti-Patterns

- ❌ Asking more than 2 clarifying questions. If 2 isn't enough, hand off to `/discover`.
- ❌ Auto-invoking the routed skill. Always print the hand-off; let the operator dispatch.
- ❌ Skipping the routing record write. Resume depends on it.
- ❌ Treating `/forsvn` as a brainstorming chat. Every invocation produces a route, a dispatch, or a written artifact. No exceptions.
- ❌ Routing to a leaf skill when a stack orchestrator exists. The orchestrator knows its domain better.
- ❌ Re-asking a question already answered in `.forsvn/experience/`. Always grep first.
- ❌ Bypassing the brand check on marketing dispatch. If `brand/BRAND.md` is missing, route through `brand-system` first.

## Acceptance Checks (Workstream A)

This skill is acceptance-tested against brief 01 § Acceptance Checks:

1. ✅ Vague request → ≤2 clarifying questions → concrete route.
2. ✅ Second invocation finds prior state, offers resume.
3. ✅ Product context read before marketing/product/research dispatch.
4. ✅ New artifacts land under `.forsvn/` only.
5. ✅ Direct skill calls still work (this skill does not gate; only suggests).

## Completion Status

- **DONE** — classified intent, dispatched (or printed handoff), wrote routing record.
- **DONE_WITH_CONCERNS** — dispatched but product context was missing or stale; flagged to user.
- **BLOCKED** — could not read project state AND could not bootstrap `.forsvn/` (filesystem permission issue or similar).
- **NEEDS_CONTEXT** — ask was empty, no prior session, no canonical sources present. Printed state summary and exited.

## References

- `.forsvn/README.md` — state root contract
- `implementation-roadmap/execution-evaluation/decisions.md` — Workstream A decisions (D1-D5)
- `implementation-roadmap/execution-evaluation/brief-pack/01-foundation-forsvn-state.md` — full brief
- `skills/meta/orchestrate-meta/SKILL.md` — the deep cross-stack router this skill defers to
