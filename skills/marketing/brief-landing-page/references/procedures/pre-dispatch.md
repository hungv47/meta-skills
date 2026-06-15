---
title: LP-Brief Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: lp-brief
load_class: PROCEDURE
---

# LP-Brief Pre-Dispatch Procedure

> Full Pre-Dispatch procedure for lp-brief. Cited from SKILL.md "Pre-Dispatch" section. Inherits canonical Pre-Dispatch protocol from [`_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md); lp-brief-specific hard gates + needed dimensions + Project-Specific Workflows + Context-to-Pass are below.

This skill has **hard gates** that fire BEFORE any cold-start questioning — brand artifacts gate routing. Cold-start questions are bundled after gates pass. Approval Gates 1/2/3 (mid-flow user reviews) are separate from Pre-Dispatch and happen after Layer 1.5 / Layer 2 / Layer 5.

## Hard gates (before any questioning)

1. **Brand artifacts.** `brand/BRAND.md` AND `brand/DESIGN.md` must be present. If either missing → return **NEEDS_CONTEXT**, recommend `create-brand`. If either >60 days stale, warn and ask before proceeding.
2. **Route classification.** No existing page → Route A. Existing page or prior brief → Route B. Absence of analytics is not a blocker; label assumptions clearly and rely on conversion-principles + ICP signals.

If hard gates pass, proceed to Pre-Dispatch flows.

## Needed dimensions (5)

- **Page identity** — route + name (always supplied as input — not asked)
- **Tier** — conversion-primary (hero LP, /pricing, /services) or conversion-secondary (/about, /story). Programmatic out of scope.
- **Hypothesis intent** — what's this page trying to prove?
- **Goal** — leads / signups / purchases / demos
- **Route (A or B)** — already resolved by hard gates above

## Read order

1. **Pipeline:** `brand/BRAND.md`, `brand/DESIGN.md` (both confirmed by hard gate). `research/icp-research.md`, `research/product-context.md`, `docs/forsvn/artifacts/marketing/campaign-plan.md`, `docs/forsvn/artifacts/meta/records/targets-*.md` (all optional, read when present).
2. **Experience:** `docs/forsvn/experience/goals.md` for prior hypothesis/goal context. `docs/forsvn/experience/audience.md` for ICP fallback if no `icp-research.md`.

## Warm Start prompt

Common when invoked from a campaign-plan that already declared the page's role + brand artifacts are present + ICP is fresh:

```
Hard gates passed: brand artifacts present, [Route A fresh | Route B existing/rev].
Found:
- page → "[route, tier]"
- goal → "[from experience/goals.md or campaign context]"
- hypothesis seed → "[from prior brief if rev > 1, campaign context, ICP, or page-state evidence]"

Anything to override, or proceed to Layer 1?
```

## Cold Start prompt (4 bundled questions)

Triggered when no campaign context + no prior rev + fresh hypothesis. Bundles all 4 questions in one round-trip:

```
lp-brief produces a campaign-grade landing-page brief — hypothesis, surface rhythm,
section spec, asset slots, hand-off prompts. Before I dispatch, I need:

1. **Page route + tier** — e.g., "/pricing, conversion-primary" or
   "/about, conversion-secondary". (Programmatic templates out of scope.)
2. **Hypothesis intent** — what is this page trying to prove or fix?
   One sentence. (Examples: "show pricing above the fold drives more
   trial starts" / "add objection-handling to address scaling concerns".)
3. **Goal** — what does the redesigned page need to do? Generate leads,
   drive trial signups, drive purchases, book demos, or other?
4. **Route confirmation** — [A: greenfield/new page] or
   [B: existing-page redesign/rev]. If B, include URL/screenshot/code and any analytics notes you have.

Answer 1-4 in one response. I'll confirm and dispatch Layer 1.
```

## Write-back

After cold-start answers, append to `docs/forsvn/experience/`:

| Question | File | Key |
|---|---|---|
| 1. Page route + tier | (not persisted — page-specific, not stable cross-skill) | — |
| 2. Hypothesis intent | `goals.md` | `Goals — page hypothesis: [route]` |
| 3. Goal | `goals.md` | `Goals — page conversion goal: [route]` |
| 4. Route | (resolved by hard gates, not persisted) | — |

Q2 and Q3 persist per-route. Q1 (page identity) and Q4 (route) are run-specific.

## Project-Specific Workflows

This skill **does not ship a default skill-chain doc.** Two paths:

1. **Project has one** (e.g., `growth/page-redesigns/_prompts.md`) — read once at orchestrator level. Brief REFERENCES by section header; never inline-duplicate. Add page-specific overrides only.
2. **Project does not** — brief generates a per-page chain inline: "Skill Chain" section listing downstream skills/prompts (`brief-graphic` per asset slot, `write-copy` for headline polish, `humanmaxxing` for AI-flavored copy). Page-scoped only — no project-level default created.

Rationale: project-level default locks teams into our chain. Per-page is correct because the chain depends on generative slots, copy polish needs, and asset rendering — all page-specific.

## Context to Pass to All Agents

After Pre-Dispatch resolves, the orchestrator assembles a context bundle every sub-agent receives:

1. **Page identity** — route, name, current state (URL/screenshot/code if exists)
2. **Tier** — conversion-primary or conversion-secondary
3. **Evidence signals** — from current page state, prior brief, ICP, campaign context, and any analytics/experiment notes
4. **Brand digest** — palette, type, motion, sacred, voice rules (from brand-anchor after L1)
5. **Audience digest** — top 3 ICP objections, top 5 VoC phrases, awareness stage (from evidence-anchor after L1)
6. **Campaign context** — traffic source, awareness stage, conversion target

## Hard-block conditions (summary)

The orchestrator hard-blocks BEFORE dispatching Layer 1 if any of these are true:

| Condition | Action |
|---|---|
| `brand/BRAND.md` AND/OR `brand/DESIGN.md` absent | Return NEEDS_CONTEXT immediately; recommend `create-brand` (do NOT proceed to Cold Start) |
| `brand/BRAND.md` OR `brand/DESIGN.md` >60 days stale | Warn (Critical Gate 4 freshness) + ask before proceeding |
| Page identity (Q1) unresolved at invocation | Hard-block; lp-brief requires a page route or campaign name as argument |
| Page is non-LP (blog, docs, navigation hub) | Hard-block; return scope violation, recommend appropriate non-LP skill (out of scope for lp-brief v1) |
| Page is programmatic-SEO template (industries/:slug, etc.) | Hard-block; out of scope for v1, future skill needed |

## `--fast` behavior

This skill is `budget: deep` AND `interactive: true`. `--fast` skips multi-agent orchestration but does NOT skip the 3 Approval Gates (those are user-facing contract):

- Collapse Layer 1 parallel + Layer 1.5 + Layer 2 + Layer 3 + Layer 3.5 + Layer 4 into single-agent execution per layer (no parallelism)
- Skip Layer 5 critic dispatch — single-agent runs through the brief assembly in one pass; critics noted as "skipped under --fast"
- Skip the Worked Example reference reads
- Still fire Hard Gates (brand artifacts present) BEFORE any Cold Start questioning
- Still fire Approval Gates 1/2/3 — user picks hypothesis, approves architecture, approves final brief
- Still respect Critical Gates 1-6 (no brief without brand artifacts; no skipping conversion rubric — section-spec-agent still consults `conversion-principles.md`; no proposing changes to sacred elements; no breaching the brief envelope (completeness-gated; 250-500 typical, hard limits ~200/~700) — single-agent self-checks; no inlining full skill chain; no placeholder testimonials)

End artifact must include: `Ran in --fast mode (single-agent per layer, critics skipped); rerun without the flag for full Route B with dual-critic gate.`
