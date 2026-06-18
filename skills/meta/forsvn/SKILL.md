---
name: forsvn
description: "Front door for the FORSVN agent stack — classifies the request, loads shared product context and prior session state, then routes to the right skill or resumes a prior initiative. Use when the right skill is unclear, to continue an in-flight initiative, or when a vague ask needs to land somewhere concrete (\"where to start\", \"resume\", \"ship this\")."
argument-hint: "[free-form ask, or 'resume', or empty for state summary]"
allowed-tools: Read Grep Glob Bash Write Edit mcp__forsvn__enter_workspace mcp__forsvn__get_context
user-invocable: true
metadata:
  version: "1.1.2"
  budget: fast
  estimated-cost: "$0.02-0.08"
---

# /forsvn — Front Door

<!-- BUDGET_EXCEPTION: Front-door dispatcher must surface the full intent-to-leaf-skill routing table inline so the classifier can pick the right route in one pass, plus the 2026-06 audit's quality machinery (classify-flow pre-dispatch, thin-critic gate, worked-example pointer). The fast tier is correct (loaded each session); the overage is the legitimate cost of the routing surface. -->

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

**Step 1 — State snapshot.** Prefer the `forsvn` MCP server: call `enter_workspace` to load TRUTH / OUTPUT / MEMORY + the graph-derived `next` (one act, same data the disk walk produces). When the server is unavailable (no `mcp__forsvn__*` tools), fall back to the inline disk snapshot — graceful degradation, never a hard dependency. Full procedure + shell-bang fallback in [`references/procedures/state-snapshot.md`](references/procedures/state-snapshot.md).

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
| "user flow", "tech stack", "architecture", "schema", "API", "code", "refactor", "machine cleanup", "docs", "README" | product | leaf via `references/chains/product.md` — **forsvn-dev pkg** |
| "scope this", "clarify", "what should we build", "requirements unclear" | scope | `/discover` |
| "debate this", "multiple perspectives", "poll", "consensus" | debate | `/debate-agents` |
| "decompose", "task list", "break down", "implementation order" | decompose | `/breakdown-tasks` (**forsvn-dev pkg**) |
| "review my work", "second opinion", "did I miss anything" | review | `/review-work` |
| "improvement loop", "track metric", "experiment ledger" | loop | `/run-pipeline` |
| Empty + no resume offer | summary | print state summary, exit |
| Ambiguous, multi-domain, "launch this", "ship this" | multi | propose 2-3 step chain |

Rules:

- Single-domain → read the matching chain file and dispatch to its leaf.
- Multi-domain → propose the chain; user confirms before the first dispatch.
- Unclear → at most 2 clarifying questions. Hard cap. Then hand off to `/discover`.
- Brand-gate: marketing/launch intent with `brand/BRAND.md` missing → route through `/create-brand` first.
- forsvn-dev gate: `product` intent and the `decompose` route resolve to the separate **forsvn-dev** package (engineering skills carved out 2026-06-16). If it isn't installed, tell the user to add `forsvn-dev` rather than dispatching into a missing skill.

**Steps 4 + 5 — Load context, then dispatch: record → announce → invoke.** Full procedure in [`references/procedures/dispatch.md`](references/procedures/dispatch.md). Loading context includes the **foundation pre-flight** (Step 4.5): for research/marketing/product intent, warn before a generic run when `ICP.md` is absent or `PRODUCT-CONTEXT.md` is an unratified/stale draft — offer `/research-icp` first, non-blocking. Write the routing record BEFORE invoking (`status: dispatched`, `dispatched-by: forsvn`), announce in one line (`→ Dispatching /<skill> — <why>`), then invoke the leaf via the Skill tool with args. Confident classification auto-dispatches; two close candidates → present both (counts toward the 2-question cap), never auto-fire. An explicit `/forsvn` dispatch supersedes any router-hook hint. The dispatcher owns the session execution-profile ask (`references/_shared/execution-policy.md`); dispatched leaves inherit it.

## Pre-Dispatch — the classify flow IS the cold start

Needed dimensions: **intent class** (Step 3 table), **initiative slug** (Step 2 resume check / `last-session.md`), **domain chain rule** (the matching `chains/<domain>.md` row). Unresolved after reading state → at most 2 bundled clarifying questions (the Step 3 hard cap; close-candidate presentations count toward it); still unclear → hand off to `/discover`. Dispatched leaves warm-start and skip their own pre-dispatch steps 1–2.

## Quality Gate

Instantiates `references/_shared/thin-critic-rubric.md` as a per-dispatch self-check (fast tier — no sub-agent):

- [ ] **Classification** — intent matches a Step 3 row or a chain-file rule; two close candidates were presented, never coin-flipped.
- [ ] **Sequencing** — routing record written (`status: dispatched`) BEFORE the Skill invocation.
- [ ] **Announcement** — the one-line `→ Dispatching /<skill> — <why>` preceded the invocation.

Auto-fail: silent dispatch (no announcement) or record-after-invoke — redo the step per `references/anti-patterns.md`.

## Worked Example

"Brief the landing page first, then build" → marketing chain → `brief-landing-page`: record → announce → invoke → warm handoff, with the gate self-check: [`references/examples/dispatch-walkthrough.md`](references/examples/dispatch-walkthrough.md) [EXAMPLE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 9 rules covering clarifying-question cap, silent dispatch, hand-off-and-stop, coin-flip auto-fire, routing-record sequencing, chain-file read, experience grep, brand-gate bypass. Re-read before dispatch.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — classified intent, wrote routing record, announced + invoked the leaf (or presented candidates / state summary).
- **DONE_WITH_CONCERNS** — dispatched on a thin/partial foundation (no `ICP.md` / unratified / stale product context); the Step 4.5 pre-flight warned the user and recorded `foundation:`.
- **BLOCKED** — could not read project state AND could not bootstrap `.forsvn/`.
- **NEEDS_CONTEXT** — ask was empty, no prior session, no canonical sources. Printed state summary and exited.

## Next Step

After dispatch, the routed leaf skill owns the work. Re-invoke `/forsvn` with `resume` to pick up the next action from `last-session.md`.

## References

- `.forsvn/README.md` — state root contract.
- [`references/chains/{research,marketing,product,meta}.md`](references/chains/) — per-domain dispatch chains.
- [`references/procedures/{state-snapshot,dispatch}.md`](references/procedures/) — Step 1, 4, 5, bootstrap.
- [`references/anti-patterns.md`](references/anti-patterns.md).
