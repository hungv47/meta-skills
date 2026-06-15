---
name: evaluate-shortform
description: "Closes the feedback loop for short-form video — scores a published post against its original brief and the matching short-form platform-intelligence catalog on a 4-dimension rubric, then logs a falsifiable pattern entry to the eval loop. Use to review a post after publishing or run an eval cycle in an existing loop. Not for pre-publish brief authoring (use brief-shortform) or catalog discovery (use research-shortform); needs a loop workspace (see run-pipeline)."
argument-hint: "<loop-slug> <post-url> <brief-path>"
allowed-tools: Read Grep Glob Bash WebFetch Write
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.50-1.50"
---

# Short-Form Eval — Orchestrator

<!-- BUDGET_EXCEPTION: Eval skills carry artifact-schema-as-contract (7 required sections + 17-field frontmatter + cross-stack INPUT/OUTPUT contracts with research-shortform catalog + brief-shortform hypothesis) that is load-bearing and cannot move to references/. Cycle ledger discipline + pattern-log block-shape requires the schema visible in the SKILL.md body. ~600 tokens over the standard cap is the legitimate cost. -->

*Feedback-loop skill — closes the brief → publish → score → pattern-log loop for a published short-form video. Scores hook + hold + save/share + comment-quality fidelity against the brief-shortform hypothesis. Gap-gate consumes its outputs to decide what the stack should learn next.*

**Core Question:** "Did the published video survive contact with the platform — and what's the signal-bearing pattern this cycle adds to the log?"

> Why, methodology, refutability, rubric-revision discipline, when NOT to use: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates

1. **Provisional rubric, not locked.** `references/rubric.md` is `v0.1, provisional`. Mandatory revision after cycle 2-3 against real variance. Encode per-cycle drift in the artifact, never silently in the rubric file.
2. **Cycle 1 = 70% observation / 30% scoring.** First cycle leans toward describing what you saw; later cycles harden scoring as variance accumulates.
3. **Brief + reference catalog must exist.** No platform-intel reference → BLOCKED. No brief-shortform hypothesis → BLOCKED. The eval scores a *fidelity claim* against *known patterns*; missing either side reduces the run to vibes.
4. **No fabricated metrics.** Every engagement number, completion rate, hold-curve point, save/share count, and sample-size claim cites the URL or panel screenshot it came from. Critic rubric #1 fails the artifact otherwise.
5. **Pattern-log entries are atomic.** One cycle = one pattern-log entry block (claim · evidence · refutability · expiry). Free-form prose patterns are unusable downstream.

## Quality Gate

Critic verifies before delivery (all four binary PASS required, max 2 rewrite cycles):

- [ ] Every metric and observation has a source URL or panel/screenshot citation
- [ ] All four rubric dimensions scored against v0.1 rubric in `references/rubric.md`; each score has a one-sentence falsifiable justification
- [ ] At least one pattern-log entry exists in canonical block shape (claim / evidence / refutability / expiry)
- [ ] Cycle 1 weighting (70 obs / 30 score) honored — prose-to-score ratio is observation-heavy on cycle 1

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: standard`; `--fast` collapses to single-pass eval-runner (skip hook-strength parallel + skip pattern-extractor as separate Layer-2 agent), but Critical Gates STILL enforced. Cold Start fires under `--fast` if catalog/brief/loop unresolvable.
   Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output paths match canonical inventory (`.forsvn/loops/[slug]/evals/` + `results.tsv`).
2. Read `.forsvn/index/manifest.json` — find matching `research-shortform` catalog by topic+market; check freshness.
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — read order, Cold/Warm prompts, hard-block conditions, catalog-freshness handling.

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/[YYYY-MM-DD]-cycle-N.md` (one file per cycle; single platform, single brief — loop-internal artifacts retain the loop tree; flat v2 grammar applies only to `docs/forsvn/artifacts/`)
- **Lifecycle:** `evaluation` (lives inside the marketing eval-loop workspace; `decision_state: not_required`)
- **Frontmatter fields (17):** `skill`, `type`, `status`, `date`, `stack` (=research), `review_surface` (=none), `cycle`, `loop`, `post_url`, `brief_path`, `catalog_path`, `catalog_freshness`, `topic`, `market`, `platform`, `rubric_version`, `rubric_status`, `weighting`, `scores`. Cross-stack v2 contract: [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Required sections (7, in order):** TL;DR · Observation · Brief vs Observed · Rubric Scores (v0.1, provisional) · Pattern-Log Entry · Open Risks & Caveats · Recommendations for next cycle / catalog
- **Side effects:** append row to `.forsvn/loops/[slug]/results.tsv` via `bun scripts/append-loop-result.ts`; call `bun scripts/manifest-sync.ts` after artifact write (both mandatory per `procedures/dispatch-mechanics.md`)
- **Cross-stack INPUT contract:** reads `research-shortform` catalog at `catalog_path` — frontmatter (`sample_size_per_platform`, `mechanics_sources_verified`, `trend_signals_date`, `platform_mechanics_date` drive `catalog_freshness`), §3 Per-Platform Findings (hook archetypes feed `hook-strength-agent`), §6 Recommendations (the reference patterns the brief-shortform hypothesis should have followed, feed `eval-runner-agent`). Schema drift breaks Layer-1 dispatch.
- **Cross-stack OUTPUT contract:** consumed by future `research-shortform` re-runs (mine pattern-log to update catalogs) + gap-gate analysis + operator audit. Schema changes require atomic update of downstream consumers (per `anti-patterns.md` "Cross-stack contract drift").

## Agent Manifest + Dispatch

4 sub-agents: Layer 1 parallel (`hook-strength-agent` + `eval-runner-agent`) → Layer 2 sequential (`pattern-extractor` → `critic`). Critic FAIL → re-dispatch named agent(s); max 2 cycles; after 2 → ship `done_with_concerns`. Skipping hook check OR rubric pass produces hollow report. Full per-agent focus + spawn tables + critic routing + post-write side effects + chain position: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Per-agent files in `agents/{hook-strength,eval-runner,pattern-extractor,critic}-agent.md`.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 15 failure modes. Re-read before any output ships. Covers premature rubric lock, treating cycle 1 as graded test, fabricated metrics, free-form pattern claims, skipping refutability, author-discretion dominating, missing post-write side effects, cross-stack contract drift.

## Worked Example

Short-form hold-rate cycle (retention curve vs platform-intelligence catalog benchmark, critic PASS): [`references/examples/shortform-eval-cycle-walkthrough.md`](references/examples/shortform-eval-cycle-walkthrough.md).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — all 4 critic rubrics PASS within ≤2 cycles. Pattern-log entry exists in canonical shape. Cycle-1 weighting honored where applicable.
- **DONE_WITH_CONCERNS** — critic loop cap reached; remaining failures surfaceable as warnings. Concerns pinned at top of artifact. Also returned when cycle 2 or 3 and rubric not yet revised — flag the mandatory revision.
- **BLOCKED** — post URL unfetchable, brief path missing, catalog cannot be resolved. State what's needed.
- **NEEDS_CONTEXT** — cold-start abandoned, or matching catalog truly missing for the post's topic+market. Defer to `research-shortform`.

## References

- `references/{playbook, anti-patterns, format-conventions, rubric}.md`
- `references/procedures/{pre-dispatch, dispatch-mechanics}.md`
- `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, artifact-contract-template, platform-intelligence/}` (canonical at top-level `references/`, synced)
- **Sibling coordination:** `brief-shortform` (upstream — produces the hypothesis this skill scores), `research-shortform` (upstream catalog + downstream pattern-log consumer), `run-pipeline` (owns loop scaffolding + ledger schema)
- `research-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions inherited
