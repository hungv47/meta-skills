# forsvn-skills — Agent Guide

This repo is the `forsvn-skills` plugin, distributed from `github.com/hungv47/meta-skills` for URL continuity: 43 composable skills for AI agents across meta, research, marketing, and product domains. This file tells an agent **how to use the stack** and **the bar for extending it**.

## Scope — In-Repo Skills Only

When the user asks about "my skills," "our skills," or where to add a capability, the candidate set is **only the skills in this repo** under `skills/{meta,research,marketing,product}/`. 43 skills total.

Do **not** recommend or route to external skills (other marketplace/plugin skills that appear in the available-skills list). They may be installed locally, but they are not part of this stack. If a gap exists, propose either (a) enriching an existing in-repo skill or (b) a new in-repo skill that clears the Quality Standard bar.

Exception: the user explicitly names an external skill and asks about it.

## Repository Structure

Single repo, no submodules. All 43 skills organized by domain:

```
meta-skills/
├── .claude-plugin/
│   ├── marketplace.json    # single-plugin catalog (this repo IS the marketplace)
│   └── plugin.json         # lists all 43 skill paths
├── skills/
│   ├── meta/         # 7 process-layer skills (forsvn, discover, debate-agents, …)
│   ├── research/     # 8 research skills (research-icp, research-market, diagnose, …)
│   ├── marketing/    # 21 marketing skills (create-brand, write-copy, brief-landing-page, brief-app-preview, monitor-aeo, …)
│   └── product/      # 7 product skills (map-user-flow, architect-system, clean-code, build-ios-apps, …)
├── references/       # cross-stack canonical contracts (pre-dispatch, mode-resolver, manifest-spec, …)
├── hooks/            # user-prompt-submit skill-router (suggestion-only)
└── scripts/          # manifest-sync, registry build, marketplace-bump
```

This repo is self-hosting — its `.claude-plugin/marketplace.json` IS the marketplace users add via `/plugin marketplace add hungv47/meta-skills`.

## Skill Discovery

Skill routing happens inline — the agent proposes skills proactively based on the system-reminder skill list. A `hooks/user-prompt-submit-skill-router.mjs` heuristic ships as **suggestion-only**: it scans incoming prompts and emits a `<system-reminder>` hint listing matched skills. The hint is advisory — the agent applies its own relevance gate, and the router never auto-invokes a skill.

## Complexity Routing

Every skill declares a `budget` tier in frontmatter: `fast`, `standard`, or `deep`. The resolved mode at invocation = `budget` tier + auto-downgrade heuristics + operator override (`--fast` / upward phrases).

**`--fast` skips orchestration weight, not the correctness floor.** Cold Start questions still run when context is unresolved; hard safety gates (brand check, policy compliance, golden rules) still fire.

**Single source of truth: [`references/mode-resolver.md`](references/mode-resolver.md)** — tier definitions, auto-downgrade heuristics, override mechanics, what `--fast` does NOT skip. Every skill cites it.

## Completion Status Protocol

Every skill output ends with an explicit status — no implicit "here's the output."

| Status | Meaning |
|--------|---------|
| **DONE** | Output meets all requirements and passes the critic gate |
| **DONE_WITH_CONCERNS** | Delivered, but with flagged risks or limitations worth monitoring |
| **BLOCKED** | Cannot complete — missing input, external dependency, or unresolvable conflict; state what's needed to unblock |
| **NEEDS_CONTEXT** | Insufficient information for quality output; state what's missing and which upstream skill provides it |

Skills that produce artifacts include the status in artifact frontmatter (`status: done | done_with_concerns | blocked | needs_context`). Skills that return inline results state it at the end of the response.

## Design Philosophy

**Completeness bias.** When the complete implementation costs minutes more than the shortcut, do the complete thing. Boil "lakes" (one-session-achievable scope — full test coverage, complete error handling, all edge cases); flag "oceans" (multi-quarter migrations, full rewrites of mature systems) as out of scope.

**Effort compression.** AI compresses implementation time — `prioritize` and `architect-system` score build-vs-skip on AI-assisted effort, not raw human effort:

| Task type | Human team | AI-assisted |
|-----------|-----------|-------------|
| Boilerplate / scaffolding | 2 days | 15 min |
| Test writing | 1 day | 15 min |
| Feature implementation | 1 week | 30 min |
| Bug fix + regression test | 4 hours | 15 min |
| Architecture / design | 2 days | 4 hours |
| Research / exploration | 1 day | 3 hours |

An initiative that looks "High Effort" for a human team may be "Low Effort" with AI assistance. Effort scores should reflect AI-assisted effort.

## Quality Standard — the bar for adding a skill

This stack is premium. Every skill uses multi-agent orchestration, critic agents with quantitative rubrics, anti-sycophancy mechanisms, and signal-vs-noise verification. The bar for additions is high.

**When evaluating a new skill, technique, or pattern:**
- Default to SKIP. Only adopt what demonstrably improves output quality or fills a genuine domain gap.
- Check if the stack already has it under a different name.
- "Sounds interesting" is not a reason. "This changes the outcome of skill X in scenario Y" is.
- Techniques must survive adversarial review: Is this a real problem? Will the LLM actually follow the instruction? Is the implementation cost justified by the quality delta?
- A new skill must clear the same bar as existing ones — multi-agent architecture, critic gates, worked examples, anti-patterns. A lightweight conversational prompt is not a skill at this standard.

Signal, not noise. Protect the stack.

## Artifact Placement

Skills write their work product under `.forsvn/` — the per-project state root (context, experience, artifacts, loops, evals). Each skill's `SKILL.md` declares its own output path; follow it.

A skill writes to a **top-level folder** only when its output is a canonical source of truth — authoritative, amended in place over time, referenced across sessions. Three such folders exist:

- `brand/` — brand identity of record (from `create-brand`)
- `architecture/` — system blueprint of record (from `architect-system`)
- `research/` — audience + market of record (from `research-icp`, `research-market`)

Don't add new top-level folders without clearing that canonical bar. Folder sprawl is worse than consistent placement.

Everything else lives flat under `.forsvn/artifacts/` using the v2 filename grammar `.forsvn/artifacts/<stack>-<skill>-<YYYY-MM-DD>-<slug>.<ext>` (md for the durable artifact, html for the review preview while `decision_state: pending`). See `references/artifact-contract-template.md` for the frontmatter contract and `references/review-surface-design.md` for the per-stack elemental theming (meta=AIR, mkt=WATER, product=FIRE, research=EARTH).

## Pre-merge gate (10 commands)

Run before merging any PR that touches skills, routing, capabilities, or artifacts. The canonical list lives in `references/capability-schema.md` § "Validation". Summary:

```bash
bun scripts/validate-routing.ts --require-all
bun scripts/build-capability-index.ts --check
node hooks/build-registry.mjs --check
bun scripts/verify-counts.ts
node scripts/sync-skill-support.mjs --check
bun scripts/eval-triggers.ts --require-all
node hooks/test-router.mjs
bun scripts/lint-artifact-paths.ts        # added by review-surface overhaul (2026-05-26)
bun scripts/lint-html-output.ts           # added by review-surface overhaul (2026-05-26)
bun scripts/test-forsvn-preview.ts        # added by review-surface v2 (2026-05-26)
```

If `lint-artifact-paths` reports legacy paths under `.forsvn/artifacts/`, run `bun scripts/migrate-artifacts-flat.ts --apply` on a clean tree to bring them to the flat v2 grammar.

When `review_surface: html`, the operator can preview + capture the decision with `bun scripts/forsvn-preview.ts <path>.html` — Bun-served localhost CSRF-protected. Roughdraft stays as the escape-hatch path for MD-first reviewers.
