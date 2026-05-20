---
name: evaluate-campaign
description: "Evaluates a launched multi-channel marketing campaign's performance from real metrics (reach, leads, revenue, CAC, channel breakdown) inside an existing eval loop. Scores the campaign as a whole against the source plan-campaign artifact's hypothesis — one cycle = the whole campaign, all channels, with a per-channel breakdown. Aggregate-only: does not re-score individual ads, posts, or landing pages. Produces `.forsvn/loops/[slug]/evals/[date]-cycle-N.md` and appends `results.tsv`. Requires an existing `/run-eval-loop` workspace; does not scaffold loops, plan campaigns, or run best-practice audits without measurement evidence. Single-ad performance defers to `evaluate-ad`; a single organic post to `evaluate-content`; a landing page to `evaluate-landing-page`; short-form video to `evaluate-shortform`."
argument-hint: "[loop slug or path] [campaign name] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
license: MIT
metadata:
  author: hungv47
  version: "0.1.0"
  budget: standard
  estimated-cost: "$0.75-1.50"
promptSignals:
  phrases:
    - "campaign eval"
    - "evaluate campaign performance"
    - "evaluate the campaign"
    - "campaign results"
    - "did the campaign work"
    - "score this campaign"
    - "campaign cycle results"
    - "channel breakdown"
    - "campaign CAC"
    - "campaign retrospective"
    - "post-launch campaign review"
    - "did the launch land"
  allOf:
    - [campaign, results]
    - [campaign, performance]
    - [channel, breakdown]
    - [campaign, not, working]
  anyOf:
    - "cost per acquisition"
    - "CAC"
    - "channel mix"
    - "leads generated"
    - "campaign revenue"
    - "campaign ROI"
    - "blended CAC"
    - "did the campaign land"
  noneOf:
    - "new campaign plan"
    - "plan a campaign"
    - "campaign brief"
    - "single ad performance"
    - "one post results"
  minScore: 6
routing:
  intent-tags:
    - campaign-evaluation
    - post-launch-campaign
    - eval-loop-cycle
    - channel-mix-scoring
    - unit-economics-scoring
  position: evaluation
  lifecycle: evaluation
  produces:
    - .forsvn/loops/[slug]/evals/[date]-cycle-N.md
    - .forsvn/loops/[slug]/results.tsv
    - .forsvn/loops/[slug]/learnings.md
  consumes:
    - .forsvn/loops/[slug]/program.md
    - .forsvn/loops/[slug]/context.md
    - .forsvn/loops/[slug]/results.tsv
    - .forsvn/loops/[slug]/strategy/*.md
    - .forsvn/loops/[slug]/execution/*.md
    - .forsvn/artifacts/mkt/campaign-plan.md
    - brand/BRAND.md
    - research/icp-research.md
    - research/product-context.md
  requires:
    - .forsvn/loops/[slug]/program.md
    - .forsvn/loops/[slug]/context.md
    - measurement evidence for the current cycle
    - channel-rollup metrics for every channel the campaign ran on
  defers-to:
    - skill: run-eval-loop
      when: "no existing measurable loop workspace exists"
    - skill: plan-campaign
      when: "the user needs a revised campaign plan or channel-mix strategy for next cycle rather than post-launch scoring"
    - skill: evaluate-ad
      when: "the operator wants a single paid ad scored — that is the asset-level lane, not the campaign aggregate"
    - skill: evaluate-content
      when: "the operator wants a single organic post scored — asset-level lane"
    - skill: evaluate-landing-page
      when: "the operator wants a single landing page scored — asset-level lane"
    - skill: evaluate-shortform
      when: "the operator wants a single short-form video scored — asset-level lane"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Campaign Eval — Orchestrator

*Evaluation skill. Converts launched multi-channel campaign evidence into a cycle snapshot, a ledger row, and a narrowly-scoped next action inside an existing eval loop. One cycle = the whole campaign across every channel; aggregate-only — individual ads, posts, and pages are scored by their own eval skills.*

**Core Question:** "Did this campaign cycle, across all its channels, create measurable signal strong enough to keep, discard, watch, or block — which channels actually drove it, are the unit economics honest, and what should the next strategy skill know?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates

1. **Existing eval loop required.** If `.forsvn/loops/[slug]/program.md` and `context.md` do not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop`. This skill does not create loops.
2. **Aggregate-only campaign scope.** evaluate-campaign scores campaign-level outcomes (reach, leads, revenue, CAC, channel breakdown) from channel-rollup metrics. It does NOT re-score individual ads, organic posts, or landing pages — those are `evaluate-ad` / `evaluate-content` / `evaluate-landing-page` / `evaluate-shortform`. If per-asset eval artifacts exist in the loop, cite them as optional context — never re-score them, never let them drive the verdict. If the operator wants a single asset scored, return `NEEDS_CONTEXT` and route to the right asset-level sibling.
3. **Measurement evidence required.** Do not run as a generic campaign-quality audit. Require at least one metric source, measurement window, and current value for the loop's primary metric (new customers / leads / revenue / blended CAC / ROI — operator-pick-per-cycle via `program.md`).
4. **One primary metric decides the ledger row.** Secondary metrics (reach, impressions, single-channel CTR) explain diagnosis; they do not override the loop's primary metric unless `program.md` defines an explicit guardrail failure.
5. **Whole-campaign, all-channels scope.** Each cycle covers the entire campaign across every channel it ran on, with a per-channel breakdown table. A campaign is NOT evaluated one channel per cycle — splitting per channel destroys the cross-channel mix analysis that is the point of a campaign eval. The breakdown lives in Diagnosis § Channel-Mix Signals.
6. **No fabricated analytics.** Unknown values stay unknown. Manual notes are allowed only when labeled as operator-supplied and tied to a date/window/source.
7. **Attribution confidence must be explicit.** Every verdict includes sample size (spend + reach + window), baseline comparability (comparable campaign type, comparable channel mix, comparable window), attribution-model honesty (last-click vs multi-touch; assisted conversions; attribution window), confounders (seasonality, concurrent campaign, channel cannibalization, price/promo change, organic baseline drift), and confidence: `high | medium | low | blocked`.
8. **Evaluation does not generate strategy.** Recommend next changes, but route actual campaign re-planning to `plan-campaign`, ad creative to `write-ad`, organic copy to `write-social`, and asset-level diagnosis to the asset-level eval skills.

## Responsibility Split

- `/run-eval-loop` owns loop setup, `program.md`, `context.md`, `results.tsv` schema, and the durable learning ledger.
- `/evaluate-campaign` owns post-launch campaign-level evidence snapshots for a loop cycle, scored across all channels as one aggregate.
- `/plan-campaign` owns next-cycle campaign planning after an eval identifies what should change.
- `/evaluate-ad`, `/evaluate-content`, `/evaluate-landing-page`, `/evaluate-shortform` own the asset-level lanes — single ad, single post, single page, single video.

## Inputs

| Input | Required? | What it provides |
|---|---:|---|
| Loop slug or path | **required** | Locates `.forsvn/loops/[slug]/` |
| Campaign name/tag | **required** | Scopes + identifies the cycle; appears in the ledger description |
| Source plan-campaign artifact | **required** | The campaign hypothesis being scored against — `.forsvn/artifacts/mkt/campaign-plan.md` |
| Measurement window | **required** | Date range for the current cycle (start + end + days) |
| Primary metric value + source | **required** | Ledger decision metric (e.g., net-new customers = 180 from CRM) |
| Channel-rollup metrics | **required** | Per-channel spend/effort, reach, leads, conversions, revenue — one row per channel the campaign ran on |
| Total spend (fully loaded) | **required** | Denominator for honest CAC — media spend + production + tooling allocated to the campaign |
| Baseline or prior cycle row | required if available | Comparison point (comparable campaign type + channel mix) |
| Revenue + new-customer count | recommended | For revenue attribution + CAC + payback/LTV diagnosis |
| Attribution model in use | recommended | Last-click / multi-touch / data-driven — gates Attribution Honesty |
| Per-asset eval artifacts | optional | Existing `evaluate-ad` / `evaluate-content` / `evaluate-landing-page` cycle artifacts in the loop — CONTEXT ONLY, never re-scored |
| Guardrail metrics from `program.md` | optional | Auto-fail thresholds |

## Outputs

Primary artifact:

```text
.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md
```

Side effects:

- Append one row to `.forsvn/loops/[slug]/results.tsv` with `bun scripts/append-loop-result.ts` (8-column validated helper).
- Update `.forsvn/loops/[slug]/learnings.md` only for high-confidence `keep` or `discard` lessons that generalize beyond this exact campaign.
- Run `bun scripts/manifest-sync.ts` after writing.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Normalizes primary metric, baseline, window, total spend, the per-channel rollup table, source caveats, attribution model |
| Diagnosis | 1 (parallel) | `agents/diagnosis-agent.md` | Connects metrics to the plan-campaign artifact's hypothesis (objective, channel mix, budget split, sequencing), channel-mix causation signals, unit-economics signals |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep/discard/watch/blocked and next-cycle action (reallocate budget / cut a rider channel / fix paid unit economics / route back to plan-campaign with a revised channel mix) |
| Critic | 3 | `agents/critic-agent.md` | Enforces 7-dim rubric, evidence discipline, loop boundary, ledger correctness, no fabricated analytics |

## Pre-Dispatch

Read `references/_shared/eval-loop-spec.md` before writing artifacts when available.

**Hard-block conditions (fire BEFORE Cold Start):** (1) `program.md` or `context.md` absent → NEEDS_CONTEXT, recommend `/run-eval-loop`. (2) The thing under evaluation is a single ad / post / page / video, not a multi-channel campaign → NEEDS_CONTEXT, route to the asset-level sibling. (3) No measurement evidence for current cycle → BLOCKED with missing-evidence list. (4) Channel-rollup metrics missing for one or more channels the campaign ran on → BLOCKED, ask the operator to supply the complete breakdown. (5) Custom 10+ column `results.tsv` schema → warn + flag to eval-loop owner; require hand-edit (not standard helper).

**Read Order:** `program.md` → `context.md` → `results.tsv` → latest `strategy/` + `execution/` + `evals/` files → source plan-campaign artifact (`.forsvn/artifacts/mkt/campaign-plan.md`) → any per-asset eval artifacts in the loop (context only) → canonical artifacts (`brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`). If `.agents/manifest.json` is stale, run `bun scripts/manifest-sync.ts`.

**Warm Start** (loop exists + metric evidence present + channel rollup complete): summarize loop + campaign name + primary metric + baseline/prior result + latest plan-campaign artifact + current evidence window; proceed to evaluate cycle N.

**Cold Start** (loop exists but cycle context missing): ask 6 bundled questions — loop slug/path + campaign name + source plan-campaign artifact path + measurement window + primary metric value/baseline + per-channel rollup (spend/reach/leads/conversions/revenue) + total fully-loaded spend. If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop` instead of asking the rest.

Full Read Order + Warm/Cold Start templates + hard-block conditions + Needed dimensions + write-back (none — eval-loop owns persistent state) + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Dispatch

1. Resolve loop path + next cycle number + campaign scope. Cycle number is `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact.
2. Layer 1 parallel: Metric Ingest + Diagnosis. Metric Ingest reads operator metrics + the channel rollup + program.md guardrails; Diagnosis reads the source plan-campaign artifact's hypothesis + Layer-1's normalized metrics (Diagnosis waits for Metric Ingest's output, then runs).
3. Layer 2: Recommendation consumes Layer 1 outputs, proposes verdict + next-cycle action + ledger row + learning promotion.
4. Layer 3: Critic validates artifact, ledger row, learning update against the 7-dim rubric.
5. If Critic FAIL, revise once. If still failing, write no ledger row and return `BLOCKED` with missing evidence.
6. Write eval artifact and append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning only when Critic allows it.
8. Run manifest sync.

Full per-layer dispatch tables + critic revision-cycle semantics + side-effects ALL-OR-NOTHING on critic FAIL + critic-override protocol: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

## Artifact Contract

- **Primary artifact:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
- **Side effects:** append one row to `results.tsv` via validated helper; update `learnings.md` ONLY for high-confidence keep/discard reusable lessons (critic gates); run `manifest-sync.ts`
- **Lifecycle:** `evaluation` (per `_shared/eval-loop-spec.md`)
- **Frontmatter:** 10 fields (skill / version / date / status / summary / purpose / lifecycle / use_when / do_not_use_when / upstream / downstream) — see [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]
- **Body:** 8 sections (Title / Verdict / Evidence 6-col table / What Changed This Cycle / Diagnosis / Next Cycle Recommendation / Results Row 8-col TSV / Learning Promotion). The Diagnosis section carries a `Channel-Mix Signals` subsection holding the per-channel breakdown table and a `Unit-Economics Signals` subsection.
- **Campaign field:** the Verdict block must name the campaign explicitly; the Evidence table scopes to campaign-level aggregate signals.
- **Generation provenance** (per D8 contract): frontmatter carries `provenance.input_artifacts` listing the source plan-campaign path, BRAND.md, icp-research.md; `provenance.output_eval` is `null`.
- **Results Row schema:** 8 columns (cycle / date / artifact / primary_metric / value / baseline / status / description) — `status` must be `keep | discard | watch | blocked` (Critic Hard Fail otherwise); description includes the campaign tag.
- **Cross-stack contract:** consumed by future campaign-eval cycles (trend analysis), by `plan-campaign --rev=N+1` (hypothesis seeding), by humans reviewing loop progress. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers — never silently drift.

Full evaluation artifact template byte-identical + Evidence table format + Channel Breakdown table format + Results Row format + Learning Promotion rules + `append-loop-result.ts` invocation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Evaluation Artifact Template (summary)

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. 10-field frontmatter + provenance block. 8 body sections in order:

1. Title `# [Campaign] Cycle N Evaluation`
2. **Verdict** — Status / Confidence / Campaign / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat) — campaign-level aggregate signals
4. **What Changed This Cycle** — plan-campaign artifact link or operator note
5. **Diagnosis** — Likely Drivers + Channel-Mix Signals (per-channel breakdown table) + Unit-Economics Signals + Confounders subsections
6. **Next Cycle Recommendation** — Keep / Discard / Watch / Route-next-work-to lines
7. **Results Row** — fenced TSV block (8 columns)
8. **Learning Promotion** — Promote to learnings.md (yes/no) + Lesson + Expiry/caveat

Full byte-identical template in [`references/format-conventions.md`](references/format-conventions.md).

## Results Row Discipline

Append exactly one row in this shape:

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder, e.g. `evals/2026-05-20-cycle-1.md`.
- `status` must be `keep`, `discard`, `watch`, or `blocked`.
- `description` is one sentence without tabs (include the campaign tag).
- Use the validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include campaign tag>"
```

- Do not append a row if the Critic verdict is FAIL. Return `BLOCKED`.

## Critic Override Protocol

When the operator explicitly chooses to ship despite a critic FAIL (or accept a `pass-with-concerns` verdict the rubric flagged), **log the override before doing anything else.** The override log is the only mechanism that turns repeated operator pushback into a rubric-revision signal (`references/_shared/quality-feedback-protocol.md § Critic Override Log`).

```bash
bun scripts/eval/log-critic-override.ts \
  --skill evaluate-campaign \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

The script appends a dated block to `.forsvn/artifacts/meta/records/critic-overrides.md`. After three valid overrides on the same `evaluate-campaign:dimension` pair, the rubric should be revised (D8 contract). Operator override does NOT promote a contested cycle to `keep` — pick `watch` or `discard` if the evidence does not support `keep`.

If the operator does NOT override and the critic FAILs, return `BLOCKED`, do not append the row.

---

## Anti-Patterns

Pipeline reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any cycle artifact ships. Campaign-eval-specific patterns (rider-channel contamination of the verdict, blended-CAC laundering of an underwater paid channel, missing-channel breakdown, fabricated revenue attribution, scope drift to re-planning the campaign, lane drift into asset-level eval territory, learning promotion from a seasonal/concurrent-campaign spike, killing a cycle without a comparable-campaign baseline) + 4 cross-cutting marketing-stack rows.

Most common in practice: rider-channel contamination (Critical Gate 5 + Critic dim "Channel-Mix Discrimination"), blended-CAC laundering (Critic dim "Unit-Economics Discipline" + Hard Fail #11), scope drift to plan-campaign territory (Critical Gate 8 + Critic dim "Decision Discipline"), missing source plan-campaign artifact (Critic Hard Fail).

## Completion

End with one status:

- `DONE` — eval artifact written, ledger row appended, critic passed
- `DONE_WITH_CONCERNS` — artifact and row written, but confidence is low/medium or confounders are material
- `NEEDS_CONTEXT` — missing loop, source plan-campaign artifact, campaign tag, channel rollup, or required metric evidence; OR the thing under evaluation is a single ad / post / page / video (route to the right asset-level sibling)
- `BLOCKED` — contradictory data, no measurement evidence, filesystem failure, or critic failed after revision

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Rubric:** `references/rubric.md` [RUBRIC] — canonical 7-dim 0-10 Pass/Fail rubric (provisional v0.1; revision-triggered per brief 05)
- **Format:** `references/format-conventions.md` [PROCEDURE] — full evaluation artifact template byte-identical
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Shared:** `references/_shared/{eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric, quality-feedback-protocol, quality-dashboard-spec}.md`
- **Agents:** 4 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` enforces the 7-dim rubric in `references/rubric.md` + 3-tier Verdict + Hard Fails.
- **Sibling coordination:** `plan-campaign` (construction-time campaign planning; this skill routes recommendations TO plan-campaign but does not produce plans); `run-eval-loop` (owns loop scaffolding + `program.md` + `context.md` + `results.tsv` schema + durable learning ledger); `evaluate-ad` / `evaluate-content` / `evaluate-landing-page` / `evaluate-shortform` (asset-level eval lanes — evaluate-campaign aggregates, it does not re-score their assets).
