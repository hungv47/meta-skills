---
name: evaluate-ad
description: "Score a launched Meta ad from real metrics (CTR, CPA, ROAS, frequency, fatigue, spend) inside an existing eval loop — verdict + diagnosis + creative-fatigue signals. One cycle per audience-temp. Meta-only at v1. Not for loop setup (use run-eval-loop), writing new creative (use write-ad), channel-mix retrospectives (use plan-campaign), or campaign-level scoring (use evaluate-campaign)."
argument-hint: "[loop slug or path] [audience-temp: cold-traffic|retargeting] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "0.2.0"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Ad Eval — Orchestrator

Converts launched Meta-ad evidence into a cycle snapshot + ledger row + narrowly-scoped next action inside an existing eval loop. One cycle per audience-temperature. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 7-dim rubric + critic-override protocol: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Did this ad cycle, for this audience-temp, create measurable signal strong enough to keep / discard / watch / block — and what should the next strategy/execution skill know?

## Critical Gates — load first

1. **Existing eval loop required.** If `.forsvn/loops/[slug]/program.md` and `context.md` do not exist → `NEEDS_CONTEXT`, recommend `/run-eval-loop`.
2. **Measurement evidence required.** Not a generic creative-quality audit. Require at least one metric source, measurement window, current value for the loop's primary metric (CTR / CPA / ROAS / conversion rate — operator-pick-per-cycle via `program.md`).
3. **One primary metric decides the ledger row.** Secondary metrics (frequency, fatigue indicators, qualitative comments) explain diagnosis; they don't override unless `program.md` defines an explicit guardrail failure (e.g., frequency > 4 kills the cycle regardless of ROAS).
4. **One audience-temp per cycle.** Cold-traffic and retargeting are evaluated in separate cycles. Mirrors write-ad's one-artifact-per-audience-temp pattern. Mixed-audience metrics → split before ingest, or return `BLOCKED` if attribution can't be cleaned.
5. **No fabricated analytics.** Unknown values stay unknown. Manual notes only when labeled as operator-supplied and tied to date/window/source.
6. **Attribution confidence must be explicit.** Every verdict includes sample size (impressions + spend window), baseline comparability (same audience-temp, same offer, comparable spend window), confounders (creative change mid-flight, audience size shift, iOS attribution gap), and confidence: `high | medium | low | blocked`.
7. **Evaluation does not generate creative.** Recommend next changes; route actual creative authorship to `write-ad` (with revised brief), channel-mix work to `plan-campaign`, LP-bottleneck work to `brief-landing-page`.

## Responsibility Split

- `/run-eval-loop` owns loop setup, `program.md`, `context.md`, `results.tsv` schema, durable learning ledger.
- `/evaluate-ad` owns post-launch Meta-ad evidence snapshots for a loop cycle, scoped to a single audience-temp.
- `/write-ad` owns next-cycle creative after an eval identifies what should change.

## Inputs

| Input | Required? | What it provides |
|---|---:|---|
| Loop slug or path | **required** | Locates `.forsvn/loops/[slug]/` |
| Audience-temp tag (`cold-traffic` OR `retargeting`) | **required** | Scopes the cycle; gates Critical Gate 4 |
| Source ad-copy artifact | **required** | Brief's hypothesis — typically `.forsvn/artifacts/mkt/write-ad/[audience-temp]-[date]-[slug].md` |
| Measurement window | **required** | Date range (start + end + days) |
| Primary metric value + source | **required** | Ledger decision metric (e.g., ROAS=2.4× from Meta Ads Manager) |
| Spend window | **required** | Total spend during measurement window (sample-size confidence) |
| Baseline or prior cycle row | required if available | Comparison point |
| Frequency at window close | recommended | Creative-Fatigue Awareness scoring |
| Conversion count + CPA | recommended | CPA + conversion-quality diagnosis |
| Audience size + reach | recommended | Saturation diagnosis |
| Guardrail metrics from `program.md` | optional | Auto-fail thresholds (frequency > 4, CPA > $X) |
| Qualitative evidence | optional | Comments, sentiment, click-quality notes |

## Outputs

Primary artifact: `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`.

Side effects:

- Append one row to `.forsvn/loops/[slug]/results.tsv` with `bun scripts/append-loop-result.ts` (8-column validated helper).
- Update `.forsvn/loops/[slug]/learnings.md` ONLY for high-confidence `keep` or `discard` lessons that generalize beyond this creative (critic gates).
- Run `bun scripts/manifest-sync.ts` after writing.

## Pre-Dispatch

Hard-block conditions fire BEFORE Cold Start:

1. `program.md` or `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-eval-loop`.
2. No measurement evidence for current cycle → `BLOCKED` with missing-evidence list.
3. Mixed-audience metrics with no clean split → `BLOCKED` until ingest is scoped to one audience-temp.
4. Custom 10+ column `results.tsv` schema → warn + flag to eval-loop owner; require hand-edit.

Read Order: `program.md` → `context.md` → `results.tsv` → latest `strategy/` + `execution/` + `evals/` files → source ad-copy artifact → canonical artifacts (`brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`, campaign plan if present). Stale `.forsvn/index/manifest.json` → run `bun scripts/manifest-sync.ts`.

**Warm Start** (loop exists + metric evidence present + audience-temp tagged): summarize loop + audience-temp + primary metric + baseline/prior + latest creative artifact + current evidence window; proceed to cycle N.

**Cold Start** (loop exists but cycle context missing): ask 6 bundled questions — loop slug/path + audience-temp + source ad-copy artifact path + measurement window + primary metric value/baseline + spend window. If loop itself does not exist → `NEEDS_CONTEXT`, recommend `/run-eval-loop`.

Full Warm/Cold Start templates + hard-block conditions + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

## Quality Gate

7-dim rubric (5 shared + 2 ad-specific). Critic FAIL → revise once; persistent FAIL → write no ledger row, return `BLOCKED`. Full rubric + Hard Fails + override protocol: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric: [`references/rubric.md`](references/rubric.md); shared frame: `references/_shared/evaluation-loop-rubric.md`.

## Artifact Contract

- **Primary artifact:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`.
- **Side effects:** append one row to `results.tsv` · update `learnings.md` ONLY for high-confidence keep/discard reusable lessons (critic gates) · run `manifest-sync.ts`.
- **Lifecycle:** `evaluation`.
- **Frontmatter:** 10 fields (`skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream`) + provenance (`provenance.input_artifacts`: source ad-copy path + `brand/BRAND.md` + `research/icp-research.md`; `provenance.output_eval: null` until consumed — rare, eval cycles are typically terminal).
- **Body:** 8 sections — Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Likely Drivers + Confounders + Creative-Fatigue Signals) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion.
- **Audience-temp field:** Verdict block must name the audience-temp explicitly (Critical Gate 4); Evidence table scopes metrics to that audience-temp.
- **Results Row schema:** 8 columns — `cycle` / `date` / `artifact` / `primary_metric` / `value` / `baseline` / `status` / `description`. `status` must be `keep | discard | watch | blocked` (Critic Hard Fail otherwise); description includes audience-temp tag.
- **Cross-stack contract:** consumed by future ad-eval cycles (trend analysis) + `write-ad --rev=N+1` (hypothesis seeding) + humans reviewing loop progress. Ad-eval does NOT directly consume write-ad output — sibling coordination is at the eval-loop boundary. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers.

Full evaluation artifact template byte-identical + Evidence table + Results Row + Learning Promotion: [`references/format-conventions.md`](references/format-conventions.md).

## Results Row Discipline

Append exactly one row:

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules: `artifact` is loop-relative · `status` must be `keep | discard | watch | blocked` · `description` is one sentence without tabs (include audience-temp tag).

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include audience-temp>"
```

Do NOT append a row if Critic verdict is FAIL. Return `BLOCKED`.

## Critic Override Protocol

Operator ships despite critic FAIL — **log the override BEFORE writing the artifact**: `bun scripts/eval/log-critic-override.ts --skill evaluate-ad …`. Three overrides → rubric-revision escalation. Override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before any cycle artifact ships. Ad-eval-specific (mixed-audience metric ingest, fabricated attribution, confidence inflation on low-spend windows, scope drift to redesigning the creative under the brief, scope drift to redesigning the LP under the ad, learning promotion from a fatigued window, killing a cycle without baseline comparability) + 4 cross-cutting marketing-stack.

Most common in practice: mixed-audience contamination (Critical Gate 4 + critic dim Audience-Temp Fidelity), confidence inflation on low-spend (Critical Gate 6 + critic dim Attribution Honesty), scope drift to write-ad (Critical Gate 7 + critic dim Decision Discipline), missing source ad-copy artifact (Critic Hard Fail).

## Completion Status

- `DONE` — eval artifact written, ledger row appended, critic PASS.
- `DONE_WITH_CONCERNS` — artifact + row written, but confidence is low/medium or confounders are material.
- `NEEDS_CONTEXT` — missing loop, source ad-copy artifact, audience-temp tag, or required metric evidence.
- `BLOCKED` — contradictory data, mixed-audience ingest, filesystem failure, or critic failed after revision.
