---
name: write-copy
description: "Writes and evaluates persuasive copy — headlines, hooks, CTAs, taglines, and full-page section copy — with per-line V/F/U rubric scoring, annotations, and ranked alternatives. Use to draft or critique landing-page and direct-response copy. Not for AI-sounding cleanup (use humanmaxxing), search/AI-citation optimization (use optimize-seo), brand voice guidelines (use create-brand), landing-page architecture (use brief-landing-page), social posts (use write-social), or paid-ad copy (use write-ad)."
argument-hint: "[copy task or text to evaluate]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "2.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Copywriting — Orchestrator

*Communication — Horizontal. Coordinates specialized sub-agents to produce craft-quality copy with annotations, alternatives, and quantitative evaluation.*

**Core Question:** "Is every key line visual, falsifiable, and uniquely ours?"

> Why this skill exists, philosophy, methodology, principles, page-specific guidance, when NOT to use, what it pulls from elsewhere, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

1. **Argument Engineering before word-choice.** Audience + the one shift + Unique Mechanism + belief sequence must be resolved in Pre-Dispatch BEFORE any agent dispatches. Skipping these produces generic copy that scores well on V/F but fails on U.
2. **V/F/U is per-line, not per-piece.** Every key line gets scored 1-5 on Visual / Falsifiable / Uniquely-Ours. Average ≥3.5 PASS; below 3.0 on any single dimension FAIL regardless of average.
3. **Competitor Swap Test catches generic claims.** If a competitor could sign your headline without lying, U fails — independent of V/F scores. Critic auto-fail.
4. **Trigger density 3-4 for persuasion-heavy copy.** 0-2 = WEAK (FAIL → psychology-agent adds primary lever). 5-6 = GURU-ENERGY (FAIL → psychology-agent cuts lowest-load-bearing trigger).
5. **Route classification at Step 1.** Single key line → Route A (one agent + critic). Full page → Route B (Layer 1 parallel + Merge + variant + Layer 2 sequential + critic). Called by lp-brief / campaign-plan → Route C (caller picks agents).

## Quality Gate

Before delivering, the **critic agent** verifies:

- [ ] Every key line passes the Three-Question Test: visual? falsifiable? uniquely ours?
- [ ] Hook and body choices form an airtight argument: the reader can see the old belief, new belief, proof, Unique Mechanism, and next action without a logical gap
- [ ] Rubric score averages ≥3.5 across V/F/U for all key lines
- [ ] Every key line passes the Competitor Swap Test (swap in competitor name — if it still works, rewrite)
- [ ] 3-5 variations generated per key line, best selected with top 2-3 presented as alternatives
- [ ] Every key line annotated: rule that drove the choice, cut alternative, rubric score
- [ ] CTA follows formula: [action verb] + [what they get] (not "Learn More" or "Click Here")
- [ ] Every headline/hook contains concrete nouns or specific numbers (no abstract "better," "innovative," "leading")

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load brand voice + audience + Unique Mechanism, identify any prior copywriting artifact for the same slug, check freshness windows on ICP / product-context (>30d → recommend `research-icp` re-run with soft gate).

| Artifact | Source | Required? |
|---|---|---|
| `research/icp-research.md` | icp-research | Recommended — VoC + pain language |
| `research/product-context.md` | icp-research | Recommended — voice adjectives + Unique Mechanism (if persisted) |
| `.forsvn/artifacts/mkt/campaign-plan.md` | campaign-plan | Optional — if copy is part of broader campaign (Route C) |
| `brand/BRAND.md` | brand-system | Recommended — voice rules + lexicon |
| `.forsvn/experience/{audience,product,goals}.md` | (any skill) | Optional — `Goals — copy shift` / `Product — unique mechanism` keys if user previously persisted |

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** surface (page / email / social / headline / CTA / etc.), audience, the one shift (what should reader believe after?), unique proof (what can you say nobody else can?), Unique Mechanism (the proprietary "how" that makes the offer different and better), belief sequence (what the reader must accept before the CTA feels obvious), traffic source (if applicable).

Full read-order + Warm/Cold Start prompts (7-question Cold Start) + write-back (6 questions) + Pre-Writing Assembly + hard-block conditions + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

**Language:** default English. If another language specified, note in pre-writing — agent instructions are optimized for English copy; other languages may need adapted idioms and cultural references.

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — this skill is `budget: deep`; `--fast` flag collapses Layer 1 parallel (hook + body + cta + social-proof) to sequential dispatch, skips variant-agent, and skips Layer 2's psychology-agent + zero-risk-agent (keeps voice-agent + critic only). **`--fast` does NOT skip Cold Start or Critical Gates 1-5** (per marketing-skills CLAUDE.md "Safety gates supersede `--fast`").

`--seven-sweeps` / `--high-stakes` upward flag turns on the optional Seven Sweeps completion critic dim and the Expert Panel Scoring pass — see [`references/seven-sweeps.md`](references/seven-sweeps.md). Default invocations skip both; standard Layer-2 sequential (voice → psychology → zero-risk → critic) already runs the 7 passes distributed across agents.

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Hook Agent | 1 (parallel) | `agents/hook-agent.md` | Headlines, hooks, taglines, subject lines — Argument Engineering lead plus 3-5 variations with 3Q scoring |
| Body Agent | 1 (parallel) | `agents/body-agent.md` | Problem/Solution/How It Works or 6 Necessary Beliefs architecture |
| CTA Agent | 1 (parallel) | `agents/cta-agent.md` | CTA variations per placement with risk reversal |
| Social Proof Agent | 1 (parallel) | `agents/social-proof-agent.md` | Testimonials, stats, logos, credibility signals, Discovery Story |
| Variant Agent | 1.5 (post-merge) | `agents/variant-agent.md` | A/B alternatives for key sections |
| Voice Agent | 2 (sequential) | `agents/voice-agent.md` | Clarity + brand voice consistency, AI slop removal |
| Psychology Agent | 2 (sequential) | `agents/psychology-agent.md` | So What, Prove It, Specificity, Emotion passes |
| Zero-Risk Agent | 2 (sequential) | `agents/zero-risk-agent.md` | Barrier removal, guarantees, exit grace |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Rubric scoring, 3Q test, annotation, PASS/FAIL |

### Shared References (read by multiple agents)

- **Frameworks** (`references/`): `headline-formulas.md` (hook), `page-sections.md` (body + social-proof), `emotional-triggers.md` (psychology + hook + critic), `belief-disruption.md` (psychology + hook, TOF only), `lead-magnet-stack.md` (hook + social-proof + cta, lead-magnet posts), `research-workflow.md` (Pre-Dispatch step 1), `discovery-story.md` (social-proof mechanism-led trust), `seven-sweeps.md` (unified 7-pass editing framework — names which agents own each sweep, defines back-checking protocol between sweeps, canonical word-level-cut list, optional Expert Panel Scoring high-stakes mode, optional critic dim when `--seven-sweeps`/`--high-stakes` mode is requested)

---

## Routing + Dispatch

Three routes — Route A (single key line), Route B (full-page copy), Route C (called by another skill).

```
ROUTE A (single key line):
  1. Pre-Dispatch (per procedures/pre-dispatch.md)
  2. Dispatch ONE agent (hook-agent OR cta-agent)
  3. Dispatch: critic-agent
  4. Critic FAIL → re-dispatch the original agent with feedback (max 2 cycles)
  5. Deliver annotated key lines

ROUTE B (full-page copy):
  1. Pre-Dispatch
  2. LAYER 1 — IN PARALLEL: hook + body + cta + social-proof
  3. MERGE — assemble into page structure (Awareness-building OR Direct-Response narrative per body-agent)
  4. Dispatch: variant-agent (on merged output)
  5. LAYER 2 — SEQUENTIAL: voice → psychology → zero-risk → critic
  6. Critic FAIL → re-dispatch named agent(s) with feedback (max 2 cycles)
  7. Deliver final artifact

ROUTE C (called by lp-brief or campaign-plan):
  1. Pre-Dispatch: read context from calling skill's artifacts
  2. Dispatch the Layer 1 agent(s) the caller named
  3. Dispatch: critic-agent
  4. Return annotated output to calling skill (no standalone artifact)
```

Mechanics (how to spawn agents, single-agent fallback, Layer 1 parallel dispatch, Merge Step with both narrative section-order tables + assembly rules + conflict resolution, variant-agent post-merge, Layer 2 sequential pipeline, critic gate + rewrite loop, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Artifact Contract

- **Path (Route A/B):** `.forsvn/artifacts/mkt/content/[slug].copy.md`
- **Path (Route C):** no standalone artifact — annotated copy embedded in calling skill's artifact
- **Lifecycle:** `pipeline` — on re-run for same slug, rename existing to `[slug].copy.v[N].md` and create new with incremented version
- **Frontmatter fields:** `skill`, `version`, `date`, `status`
- **Body sections (in order):** descriptive metadata block (Date / Audience / Awareness Stage / Traffic Source) · Pre-Writing 5-item block · Key Lines (Route A) OR section-by-section copy (Route B) · A/B Variants (Route B only)
- **Consumed by:** human reader (Route A/B), `brief-landing-page` (Route C — reads pre_writing.unique_mechanism + key_lines.\*.score for next-section refinements), `plan-campaign` (Route C — reads surface + audience for campaign coherence)
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Pre-Writing block format" + § "Key Lines block format" — never silently drift

Full template + per-section format rules (slug derivation, Pre-Writing block format, Key Lines block format with V/F/U scoring, A/B Variants block format, re-run convention) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Artifact Template

```markdown
---
skill: write-copy
version: 1
date: [today's date]
status: done | done_with_concerns | blocked | needs_context
---

# Copy: [Title / Brief Description]

**Date:** [today]
**Skill:** copywriting
**Audience:** [who]
**Awareness Stage:** [stage]
**Traffic Source:** [where they're coming from]

## Pre-Writing

1. **Talking to:** [audience + current belief]
2. **Shift to:** [desired belief after reading]
3. **Only we can say:** [unique proof/angle]
4. **Unique Mechanism:** [proprietary how that makes the offer different and better]
5. **Traffic context:** [what they already know]

## Key Lines

### [Line Type: Headline / Hook / CTA / Tagline / Subject Line]

**Selected:** "[winning line]"
  Rule: [which principle]. Score: V:[n] F:[n] U:[n].
  Cut alternative: "[runner-up]" — [why cut].

**Alternative A:** "[second option]"
  Rule: [principle]. Score: V:[n] F:[n] U:[n].

**Alternative B:** "[third option]"
  Rule: [principle]. Score: V:[n] F:[n] U:[n].

## [Additional sections for full-page copy — Hero, Problem, Solution, etc.]

## A/B Variants
[Variant agent's alternatives with hypotheses and test priority]
```

> On re-run: rename existing artifact to `[slug].copy.v[N].md` and create new with incremented version.

---

## Anti-Patterns

Polish-pipeline + orchestrator + cross-cutting references: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships. 5 orchestrator-level rows (skipping pre-writing, dispatching all for single key line, ignoring critic FAIL, wrong-agent re-dispatch, >2 rewrite cycles) + 4 pipeline-level rows (voice-too-early, psychology trigger-density miss, zero-risk over-application, variant gratuity) + 4 cross-cutting marketing-stack rows (Route C context drop, brand-system absent → voice fabrication, humanmaxxing chain skipped for AI-sounding, artifact schema drift).

---

## Completion Status

Every run ends with explicit status:
- **DONE** — copy written for the requested surface (Route A or B), critic PASS, voice consistent with brand
- **DONE_WITH_CONCERNS** — copy delivered but critic flagged secondary issues (specificity thin, social-proof weak, voice slightly off); concerns annotated
- **BLOCKED** — brief is fundamentally contradictory (e.g., audience and offer don't align); needs user reconciliation before any agent dispatch
- **NEEDS_CONTEXT** — brand voice or audience undefined and not derivable from the brief; recommend `create-brand` or `research-icp`

## Next Step

Run `humanmaxxing` to refine voice and compress. Seven Sweeps (Layer 2 cumulative) runs BEFORE humanmaxxing — humanmaxxing is the terminal polish pass, not a replacement for the sweeps. See [`references/seven-sweeps.md`](references/seven-sweeps.md) § "When NOT to run Seven Sweeps" for cases where the full pass is skipped.

---

## Worked Example

End-to-end Route B walkthrough (StatusZero landing page — async standup replacement for engineering managers, LinkedIn ads cold traffic, full Layer 1 parallel + Merge + variant + Layer 2 sequential + critic PASS at 4.4 V/F/U average) + cycle-2 FAIL variant (Competitor Swap Test failure on hero, hook-agent re-anchors on Unique Mechanism, cycle 2 PASS) + Route A single-key-line snippet + Route C called-by-lp-brief snippet: [`references/examples/copywriting-walkthrough.md`](references/examples/copywriting-walkthrough.md) [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/copywriting-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch): `references/{headline-formulas, page-sections, emotional-triggers, belief-disruption, lead-magnet-stack, research-workflow, discovery-story}.md`
- **Shared:** `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol}.md`
- **Marketing foundations:** `references/_shared/marketing-foundations.md` — canonical 9-channel framework, funnel-stage vocabulary, 3Q content test, CTA formula, VoC principles
- **Agents:** 9 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical V/F/U rubric + trigger-density gate + Authenticity filter + re-dispatch routing table.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
