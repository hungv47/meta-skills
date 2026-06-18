---
name: write-copy
description: "Writes and evaluates persuasive copy — headlines, hooks, CTAs, taglines, and landing-page sections — with per-line V/F/U rubric scoring, annotations, and ranked alternatives. Not for AI-sounding cleanup (humanmaxxing), search/AI-citation (optimize-seo), brand voice (create-brand), landing-page architecture (brief-landing-page), social posts (write-social), or paid-ad copy (write-ad)."
argument-hint: "[copy task or text to evaluate]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.2.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Write Copy — Orchestrator

Drafts and critiques persuasive copy — headlines, hooks, CTAs, taglines, and landing-page section copy — with per-line V/F/U rubric scoring, annotations, and ranked alternatives. Coordinates specialized sub-agents to produce craft-quality output.

**Core question:** Is every key line visual, falsifiable, and uniquely ours?

Capability metadata (routes, prerequisites, orchestration, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Routing logic, agent manifest, and full dispatch pseudocode live in [`references/agent-manifest.md`](references/agent-manifest.md). **Methodology + design history**: see [`references/playbook.md`](references/playbook.md) — load when questioning why a gate or agent exists before changing it.

## Critical Gates — load first

These five gates are the safety floor; `--fast` does not skip them.

1. **Argument Engineering before word-choice.** Audience + the one shift + Unique Mechanism + belief sequence must be resolved in Pre-Dispatch BEFORE any agent dispatches. Skipping these produces generic copy that scores V/F but fails U.
2. **V/F/U is per-line, not per-piece.** Every key line gets scored 1-5 on Visual / Falsifiable / Uniquely-Ours. Average ≥3.5 PASS; below 3.0 on any single dimension FAIL regardless of average.
3. **Competitor Swap Test catches generic claims.** If a competitor could sign your headline without lying, U fails — independent of V/F. Critic auto-fail. Procedure + swappable-vs-defensible examples: [`references/_shared/copy-validation-rubric.md`](references/_shared/copy-validation-rubric.md) (shared across the write-* skills).
4. **Trigger density 3-4 is the optimal range for persuasion-heavy copy.** Above 4 → run the authenticity filter per trigger (cut any that fail). Below 3 → check the piece isn't merely informational; if persuasion is the job, psychology-agent adds a lever.
5. **Route classification at Step 1.** Single key line → Route A. Full page → Route B. Called by `brief-landing-page` / `plan-campaign` → Route C (caller picks agents).

## Quality Gate — critic checklist

Before delivering, the critic agent verifies:

- [ ] Every key line passes the Three-Question Test: visual? falsifiable? uniquely ours?
- [ ] Hook + body form an airtight argument: old belief, new belief, proof, Unique Mechanism, next action — no logical gap
- [ ] Rubric average ≥3.5 across V/F/U for all key lines
- [ ] Every key line passes the Competitor Swap Test
- [ ] Alternatives explored per key line, best selected with top 2-3 as alternatives
- [ ] Every key line annotated: rule that drove the choice, cut alternative, rubric score
- [ ] CTA follows formula: [action verb] + [what they get] — not "Learn More" / "Click Here"
- [ ] Every headline/hook contains concrete nouns or specific numbers — no abstract "better," "innovative," "leading"

## Before Starting

Run `references/_shared/before-starting-check.md`. Required context:

| Artifact | Source | Required? |
|---|---|---|
| `research/icp-research.md` | research-icp | Recommended — VoC + pain language |
| `research/product-context.md` | research-icp | Recommended — voice adjectives + Unique Mechanism |
| `brand/BRAND.md` | create-brand | Recommended — voice rules + lexicon |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Optional — Route C |
| `docs/forsvn/experience/{audience,product,goals}.md` | (any skill) | Optional — persisted keys |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch (`references/procedures/pre-dispatch.md`). Needed dimensions: surface, audience, the one shift, unique proof, Unique Mechanism, belief sequence, traffic source.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

Default English; other languages need adapted idioms. `--fast` collapses Layer 1 to sequential, skips variant-agent, skips Layer 2 psychology + zero-risk (keeps voice + critic). `--seven-sweeps` / `--high-stakes` adds Seven Sweeps completion critic + Expert Panel Scoring (`references/seven-sweeps.md`).

## Routes

Three routes — A (single key line), B (full page), C (called by another skill). Full pseudocode + agent manifest in [`references/agent-manifest.md`](references/agent-manifest.md). Spawn mechanics in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

**Route-collapse default (no `--fast` needed):** a ≤3-sentence single-line ask with no prior artifacts auto-resolves to **Route A** (one writing agent + critic) — the lean single-route composition. Route B's full Layer 1 + Layer 2 orchestration engages only for full-page scope, multi-line asks, or an upward override ("full page", "thorough").

**Route B section sequencer:** order page sections by the reader's `awareness_stage` before writing — the body-agent picks the section stack from the awareness sequencer in [`references/page-sections.md`](references/page-sections.md) § "Section Sequencer", not a fixed template. Awareness comes from the brief; flag it if absent.

## Artifact Contract

- **Path (Route A/B):** `docs/forsvn/artifacts/marketing/content/[slug].copy.md`
- **Path (Route C):** no standalone artifact — annotated copy embedded in caller's artifact
- **Lifecycle:** pipeline — on re-run for same slug, rename existing to `[slug].copy.v[N].md` and create new with incremented version
- **Frontmatter fields:** `skill`, `version`, `date`, `status`
- **Body sections (in order):** descriptive metadata · Pre-Writing 5-item block · Key Lines (Route A) OR section-by-section copy (Route B) · A/B Variants (Route B only) · Why This Works ([convention](references/_shared/why-this-works-convention.md))
- **Schema drift rule:** changes require atomic update of `format-conventions.md` § "Frontmatter field order" / § "Pre-Writing block format" / § "Key Lines block format"

Full template + per-section format rules in [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships. 5 orchestrator rows + 4 pipeline rows + 4 cross-cutting marketing-stack rows.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — copy written, critic PASS, voice consistent with brand
- **DONE_WITH_CONCERNS** — delivered with critic-flagged secondary issues (specificity thin, social-proof weak, voice slightly off); concerns annotated
- **BLOCKED** — brief is fundamentally contradictory (audience and offer don't align); needs user reconciliation
- **NEEDS_CONTEXT** — brand voice or audience undefined and not derivable; recommend `create-brand` or `research-icp`

## Next Step

Run `humanmaxxing` to refine voice and compress. Seven Sweeps (Layer 2 cumulative) runs BEFORE humanmaxxing — humanmaxxing is the terminal polish pass. See `references/seven-sweeps.md` § "When NOT to run Seven Sweeps".

## Worked Example

End-to-end Route B walkthrough + cycle-2 FAIL variant + Route A snippet + Route C snippet: [`references/examples/write-copy-walkthrough.md`](references/examples/write-copy-walkthrough.md).
