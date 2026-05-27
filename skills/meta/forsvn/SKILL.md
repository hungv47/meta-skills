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

<!-- BUDGET_EXCEPTION: Front-door dispatcher must surface the full intent-to-leaf-skill routing table inline so the classifier can pick the right route in one pass. The fast tier is correct (loaded each session); ~150 tokens over cap is the legitimate cost of the routing surface. -->

Classifies the ask, loads the context, routes or resumes. Always lands on a concrete next action. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml).

## When To Use

- Vague ask: "help me launch this", "what should I work on?", "where do I start?"
- Resume: "continue", "pick up where I left off"
- New to the stack and don't know which skill to call.
- Want to see what's in flight across initiatives.

## When NOT To Use

- You already know the right skill — call it directly.
- Deep multi-perspective debate — use `/debate-agents`.
- Full scoping conversation — use `/discover`.

## Operating Contract — 5 steps

Every invocation does exactly these five steps. No skipping, no looping.

**Step 1 — State snapshot.** Render the disk snapshot inline. Shell-bang block in [`references/procedures/state-snapshot.md`](references/procedures/state-snapshot.md).

**Step 2 — Resume check.** If `.forsvn/routing/last-session.md` exists AND `status: awaiting-user` AND timestamp < 7 days:

```
You were last working on: <intent>
  Initiative: <slug>
  Next action: <next-action>
  Open question: <first open question if any>

Resume? (yes / no / new)
```

Default to resume if the current ask is empty or "continue" / "resume". Otherwise classify fresh per Step 3.

**Step 3 — Classify intent.** Pick exactly one intent class. The classifier dispatches to the right leaf via the per-domain chain file ([`references/chains/<domain>.md`](references/chains/)) — read it before dispatching.

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

- Single-domain → read the matching chain file and dispatch to its leaf.
- Multi-domain → propose the chain; user confirms before the first dispatch.
- Unclear → at most 2 clarifying questions. Hard cap. Then hand off to `/discover`.
- Brand-gate: marketing/launch intent with `brand/BRAND.md` missing → route through `/create-brand` first.

**Steps 4 + 5 — Load context, dispatch, persist routing record + bootstrap.** Full procedure in [`references/procedures/dispatch.md`](references/procedures/dispatch.md). Always print the hand-off (`→ /<skill>`, Why, Reads, Writes); operator types the slash command — `/forsvn` does NOT auto-invoke. Then write `.forsvn/routing/last-session.md` + history snapshot.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 7 rules covering clarifying-question cap, auto-invoke ban, routing-record skip, chain-file read, experience grep, brand-gate bypass. Re-read before dispatch.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — classified intent, dispatched (or printed handoff), wrote routing record.
- **DONE_WITH_CONCERNS** — dispatched but product context was missing or stale; flagged to user.
- **BLOCKED** — could not read project state AND could not bootstrap `.forsvn/`.
- **NEEDS_CONTEXT** — ask was empty, no prior session, no canonical sources. Printed state summary and exited.

## Next Step

After dispatch, the routed leaf skill owns the work. Re-invoke `/forsvn` with `resume` to pick up the next action from `last-session.md`.

## References

- `.forsvn/README.md` — state root contract.
- [`references/chains/{research,marketing,product,meta}.md`](references/chains/) — per-domain dispatch chains.
- [`references/procedures/{state-snapshot,dispatch}.md`](references/procedures/) — Step 1, 4, 5, bootstrap.
- [`references/anti-patterns.md`](references/anti-patterns.md).
