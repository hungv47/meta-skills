---
name: forsvn
description: "Front door for the FORSVN agent stack — classifies the request, loads shared product context and prior session state, then routes to the right skill or resumes a prior initiative. Use when you don't know which skill to call, want to continue something you started, or a vague ask needs to land somewhere concrete (\"where do I start\", \"resume\", \"ship this\")."
argument-hint: "[free-form ask, or 'resume', or empty for state summary]"
allowed-tools: Read Grep Glob Bash Write Edit
user-invocable: true
metadata:
  version: "1.1.0"
  budget: fast
  estimated-cost: "$0.02-0.08"
---

# /forsvn — Front Door

Classify the ask, load the context, route or resume. Always lands on a concrete next action. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml).

## When To Use

- Vague ask: "help me launch this", "what should I work on?", "where do I start?"
- Resume: "continue", "pick up where I left off"
- New to the stack and don't know which skill to call.
- Want to see what's in flight across initiatives.

## When NOT To Use

- You already know the skill — call it directly.
- You want a deep multi-perspective debate — use `/debate-agents`.
- You want a full scoping conversation — use `/discover`.

## Operating Contract — 5 steps

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

Default to resume if the current ask is empty or "continue" / "resume". Otherwise classify fresh per Step 3.

### Step 3 — Classify intent

Pick exactly one intent class. Domain-leaf routing lives in [`references/chains/<domain>.md`](references/chains/) — read the relevant chain file before dispatching.

| User says | Intent class | Route |
|---|---|---|
| "audience", "ICP", "competitors", "market", "diagnose", "prioritize", "funnel", "targets" | research | leaf via `references/chains/research.md` |
| "brand", "campaign", "copy", "headline", "landing page", "LP", "ad", "SEO", "video", "TikTok", "reel", "short", "cold email", "outreach", "humanize", "humanmax", "VN tone" | marketing | leaf via `references/chains/marketing.md` |
| "user flow", "tech stack", "architecture", "schema", "API", "code", "refactor", "machine cleanup", "docs", "README" | product | leaf via `references/chains/product.md` |
| "scope this", "clarify", "what should we build", "requirements unclear" | scope | `/discover` |
| "debate this", "multiple perspectives", "poll", "consensus" | debate | `/debate-agents` |
| "decompose", "task list", "break down", "implementation order" | decompose | `/breakdown-tasks` |
| "review my work", "second opinion", "did I miss anything" | review | `/review-work` |
| "improvement loop", "track metric", "experiment ledger" | loop | `/run-eval-loop` |
| Empty + no resume offer | summary | print state summary, exit |
| Ambiguous, multi-domain, "launch this", "ship this" | multi | propose 2-3 step chain |

Rules:

- Single-domain → read the matching `references/chains/<domain>.md` and dispatch to its leaf skill.
- Multi-domain → propose the chain across `references/chains/*.md`; user confirms before the first dispatch.
- Genuinely unclear → at most 2 clarifying questions. Hard cap. If still unclear, hand off to `/discover`.
- Brand-gate: marketing/launch intent with `brand/BRAND.md` missing → route through `/create-brand` first.

### Step 4 — Load context + dispatch

Before dispatching:

1. **Product context.** If `.forsvn/context/product-context.md` is missing AND the routed skill needs it (marketing, product, research) → autodraft from `README.md`, `brand/BRAND.md`, `research/*.md`, `package.json`. Mark `status: draft`. Tell the user: "Autodrafted product context. Review before treating as canonical." Drafts are usable; do not block dispatch.
2. **Experience.** Grep `.forsvn/experience/*.md` for keywords matching the intent. Surface anything relevant: "You previously said X — still applies?"
3. **Initiative slug.** New → propose a kebab-case slug, user confirms. Resuming → use existing slug.

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

## Bootstrap (first run)

If `.forsvn/` does not exist at the project root:

1. `mkdir -p .forsvn/{context,experience,artifacts,loops,evals,routing,dashboard}`.
2. Copy templates from this skill's `templates/` dir.
3. Add `.forsvn/` to `.gitignore` only if the user confirms — some track their context, others don't.
4. Tell the user: "Scaffolded `.forsvn/`. Your shared context will live there."

Then run the normal 5-step flow.

## Anti-Patterns

- More than 2 clarifying questions — hand off to `/discover` instead.
- Auto-invoking the routed skill. Always print the hand-off; the operator dispatches.
- Skipping the routing record write. Resume depends on it.
- Treating `/forsvn` as a brainstorming chat. Every invocation produces a route, a dispatch, or a written artifact.
- Dispatching domain work without reading the relevant `references/chains/<domain>.md`.
- Re-asking a question already answered in `.forsvn/experience/`. Grep first.
- Bypassing the brand check on marketing dispatch.

## Completion Status

- **DONE** — classified intent, dispatched (or printed handoff), wrote routing record.
- **DONE_WITH_CONCERNS** — dispatched but product context was missing or stale; flagged to user.
- **BLOCKED** — could not read project state AND could not bootstrap `.forsvn/`.
- **NEEDS_CONTEXT** — ask was empty, no prior session, no canonical sources. Printed state summary and exited.

## References

- `.forsvn/README.md` — state root contract.
- [`references/chains/research.md`](references/chains/research.md), [`marketing.md`](references/chains/marketing.md), [`product.md`](references/chains/product.md), [`meta.md`](references/chains/meta.md) — per-domain dispatch chains.
