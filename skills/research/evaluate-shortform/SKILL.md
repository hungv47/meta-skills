---
name: evaluate-shortform
description: "Closes the feedback loop for short-form video — scores a published post against its original brief and the matching short-form platform-intelligence catalog on a 4-dimension rubric, then logs a falsifiable pattern entry to the eval loop. Use to review a post after publishing, check whether a brief survived contact with the platform, or run an eval cycle inside an existing loop. Not for pre-publish brief authoring (use brief-shortform) or catalog discovery (use research-shortform). Needs an existing loop workspace — for that, see run-eval-loop."
argument-hint: "<loop-slug> <post-url> <brief-path>"
allowed-tools: Read Grep Glob Bash WebFetch Write
metadata:
  version: "0.1.0"
  budget: standard
  estimated-cost: "$0.50-1.50"
---

# Short-Form Eval — Orchestrator

*Feedback-loop skill — closes the brief → publish → score → pattern-log loop. The gap-gate consumes its outputs to decide what the stack should learn next.*

**Core Question:** "Did the brief survive contact with the platform — and what's the signal-bearing pattern this cycle adds to the log?"

[Read `references/playbook.md` [PLAYBOOK] for why this skill exists, methodology, refutability principle, rubric-revision discipline, and when NOT to use.]

---

## Critical Gates — Read First

Non-negotiable constraints before dispatching any agent:

1. **Provisional rubric, not locked.** `references/rubric.md` ships at `version: 0.1, status: provisional`. Mandatory revision after cycle 2-3 against real variance. Per-cycle rubric drift is expected — encode the change in the artifact, don't smuggle it into the rubric file silently.
2. **Cycle 1 weighting is 70% observation / 30% scoring.** Single calibration pair would overfit a locked rubric. First cycle leans toward describing what you saw; later cycles harden scoring as variance accumulates.
3. **Both brief and reference catalog must exist.** No platform-intel reference → BLOCKED. No brief → BLOCKED. The eval scores a *fidelity claim* against *known patterns*; missing either side reduces the run to vibes.
4. **No fabricated metrics.** Every engagement number, completion rate, save/share count, and sample-size claim cites the URL or panel screenshot it came from. Critic rubric #1 fails the artifact otherwise.
5. **Pattern-log entries are atomic.** One cycle = one pattern-log entry block in the report. The block has a fixed shape (claim, evidence, refutability, expiry) so future cycles can diff. Free-form prose patterns are unusable downstream.

## Quality Gate

Critic agent verifies before delivery (all four binary PASS required, max 2 rewrite cycles):

- [ ] Every metric and observation has a source URL or panel/screenshot citation
- [ ] All four rubric dimensions scored against the v0.1 rubric in `references/rubric.md`; each score has a one-sentence falsifiable justification
- [ ] At least one pattern-log entry exists in the canonical block shape (claim / evidence / refutability / expiry)
- [ ] Cycle 1 weighting note (70 obs / 30 score) is honored — the report's prose-to-score ratio is observation-heavy on cycle 1

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: standard`; `--fast` collapses to single-pass eval-runner (skip hook-strength parallel + skip pattern-extractor as separate Layer-2 agent), but Critical Gates above STILL enforced. Cold Start fires under `--fast` if catalog/brief/loop are unresolvable.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output paths match canonical inventory (`.forsvn/loops/[slug]/evals/` + `results.tsv`).
2. Read `.agents/manifest.json` — find the matching `research-shortform` catalog by topic+market; check freshness.
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Cold/Warm prompts, hard-block conditions, catalog-freshness handling all there.

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/[YYYY-MM-DD]-cycle-N.md` (one file per cycle; single platform, single brief)
- **Lifecycle:** `evaluation` (per loop spec; lives inside the marketing eval-loop workspace)
- **Frontmatter fields:** `type`, `status`, `date`, `cycle`, `loop`, `post_url`, `brief_path`, `catalog_path`, `catalog_freshness`, `topic`, `market`, `platform`, `rubric_version`, `rubric_status`, `weighting`, `scores` (full schema in Output Artifact Structure below)
- **Required sections (in order):** TL;DR · Observation · Brief vs Observed · Rubric Scores (v0.1, provisional) · Pattern-Log Entry · Open Risks & Caveats · Recommendations for next cycle / catalog
- **Side effects:** append row to `.forsvn/loops/[slug]/results.tsv` via `bun scripts/append-loop-result.ts`; call `bun scripts/manifest-sync.ts` after artifact write (both mandatory per `procedures/dispatch-mechanics.md`)
- **Consumed by:** future `research-shortform` re-runs (mine pattern-log entries to update catalogs); gap-gate analysis (eventual); operator audit
- **Cross-stack INPUT contract:** reads from `research-shortform` catalog at `catalog_path` — frontmatter (`sample_size_per_platform`, `mechanics_sources_verified`, `trend_signals_date`, `platform_mechanics_date` drive `catalog_freshness` derivation), §3 Per-Platform Findings (hook archetypes feed `hook-strength-agent`), §6 Recommendations for short-form-brief (the reference patterns the brief should have followed, feed `eval-runner-agent`). Schema drift on these breaks Layer-1 dispatch.
- **Cross-stack OUTPUT contract:** schema changes require atomic update of downstream consumers (per `anti-patterns.md` row "Cross-stack contract drift")

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Hook Strength Agent | 1 (parallel) | `agents/hook-strength-agent.md` | Observed opening 1-3s vs platform-intel hook archetypes for the topic+market — match, mismatch, or novel archetype |
| Eval Runner Agent | 1 (parallel) | `agents/eval-runner-agent.md` | Per-rubric-dimension scorer — applies v0.1 rubric; 0-3 scores with falsifiable justifications; cycle-1 70/30 weighting |
| Pattern Extractor | 2 (sequential) | `agents/pattern-extractor-agent.md` | Drafts the canonical pattern-log entry — claim, evidence, refutability, expiry — from Layer-1 outputs |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Four-rubric quality gate (citation, score falsifiability, pattern-block shape, cycle-1 weighting). Routes rewrites; max 2 cycles |

## Routing + Dispatch

Single route — full Layer 1 + Layer 2 sequence runs every time (skipping hook check OR rubric pass produces hollow report):

```
1. Pre-Dispatch (warm-start scan + cold-start if needed) — per procedures/pre-dispatch.md
2. LAYER 1 IN PARALLEL: hook-strength-agent + eval-runner-agent
3. LAYER 2 SEQUENTIAL: pattern-extractor → critic
4. Critic FAIL → re-dispatch named agent(s) (max 2 cycles); after 2, ship done_with_concerns
5. Write artifact to .forsvn/loops/[slug]/evals/[date]-cycle-N.md;
   append results.tsv via append-loop-result.ts; call manifest-sync.ts
```

Mechanics (how to spawn agents, Layer 1/2 spawn tables, critic routing rules, single-agent fallback, post-write side effects, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Output Artifact Structure

`.forsvn/loops/[slug]/evals/[YYYY-MM-DD]-cycle-N.md`:

```yaml
---
type: short-form-eval
status: done | done_with_concerns | blocked | needs_context
date: [YYYY-MM-DD]
cycle: [N]
loop: [slug]
post_url: [url]
brief_path: [path]
catalog_path: [path]
catalog_freshness: fresh | warn | stale
topic: [from brief]
market: [from brief]
platform: [tiktok | reels | shorts | x | linkedin]
rubric_version: "0.1"
rubric_status: provisional
weighting: cycle-1-70-obs-30-score | cycle-2-plus-balanced
scores:
  brief-fidelity: [0-3]
  hook-strength-vs-platform-intel: [0-3]
  pattern-log-entry-shape: [0-3]
  platform-signal-freshness-flag: [0-3]
  author-discretion: [0-3]
---
```

**Body sections (in order):**

1. TL;DR — one paragraph: did the brief land, what shifted, what's the pattern-log entry
2. Observation — what the post actually did on the platform (engagement mix, opening 1-3s, caption, CTA placement, audio choice). Cycle 1: this section is the longest.
3. Brief vs Observed — side-by-side: what the brief claimed, what the platform did. Each row cites both sides.
4. Rubric Scores (v0.1, provisional) — per dimension, score + falsifiable justification. Author-discretion at lower weight.
5. Pattern-Log Entry — exactly one block in the canonical shape:
   ```
   ### Pattern: [name]
   **Claim:** [what this cycle suggests is true]
   **Evidence:** [URLs, metrics, citations]
   **Refutability:** [what would prove this wrong]
   **Expiry:** [conditions or timeframe after which this claim should be re-tested]
   ```
6. Open Risks & Caveats — including premature-rubric-lock risk if applicable
7. Recommendations for next cycle / catalog — does the catalog need a refresh, does the rubric need a revision now (mandatory at cycle 2-3), did a new archetype emerge

Format conventions (date format, URL handling, inline citation pattern, rubric score format, pattern-log entry shape, cycle index agreement) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — covers premature rubric lock, treating cycle 1 as a graded test, fabricated metrics, free-form pattern claims, skipping refutability, author-discretion dominating, missing post-write side effects, cross-stack contract drift, and 7 more failure modes.

## Completion Status

Skill returns one of:

- **DONE** — all 4 critic rubrics PASS within ≤2 cycles. Pattern-log entry exists in canonical shape. Cycle-1 weighting honored where applicable.
- **DONE_WITH_CONCERNS** — critic loop cap reached; remaining failures are surfaceable as warnings (e.g., rubric dimension borderline, partial citation gap). Concerns pinned at top of artifact. Also returned when this is cycle 2 or 3 and the rubric has not been revised yet — flag the mandatory revision in the report.
- **BLOCKED** — post URL unfetchable, brief path doesn't exist, catalog cannot be resolved. State what's needed.
- **NEEDS_CONTEXT** — cold-start abandoned, or matching catalog truly missing for the post's topic+market. Defer to `research-shortform`.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill exists, methodology, refutability principle, rubric-revision discipline, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (canonical at `references/`, synced)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior contract
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE] — canonical Pre-Dispatch spec
- [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — Cold + Warm Start prompts + write-back map + hard-block conditions + catalog-freshness handling
- [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE] — Layer 1/2 spawn mechanics, critic routing, post-write side effects, chain position, skill deference
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 15 failure modes
- [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE] — date/URL/citation patterns, rubric score format, pattern-log entry shape, cycle index agreement
- [`references/rubric.md`](references/rubric.md) — the v0.1 provisional rubric (4 dimensions + author-discretion)
- [`references/_shared/platform-intelligence/`](references/_shared/platform-intelligence/) — per-platform eval references. Canonical at top-level `references/platform-intelligence/` (D13)
- `research-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
