---
name: evaluate-ad
description: "Evaluates launched Meta ad performance from real metrics (CTR, CPA, ROAS, frequency, fatigue, spend, conversions) inside an existing eval loop. Audience-temperature-aware — one cycle per audience-temp (cold-traffic OR retargeting; never both in one cycle). Produces `.forsvn/loops/[slug]/evals/[date]-cycle-N.md` and appends `results.tsv`. Requires an existing `/run-eval-loop` workspace; does not scaffold loops, generate creative, or perform best-practice audits without measurement evidence. Meta-only at v1 (Google RSA / LinkedIn / TikTok Ads reserved for future expansion — same surface as write-ad)."
argument-hint: "[loop slug or path] [audience-temp: cold-traffic|retargeting] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
license: MIT
metadata:
  author: hungv47
  version: "0.1.0"
  budget: standard
  estimated-cost: "$0.75-1.50"
promptSignals:
  phrases:
    - "ad eval"
    - "evaluate ad performance"
    - "evaluate meta ad"
    - "evaluate facebook ad"
    - "ad results"
    - "post-launch ad"
    - "creative fatigue"
    - "ad frequency"
    - "ROAS dropped"
    - "CPA going up"
    - "CTR is low"
    - "should we kill this ad"
    - "should we keep this creative"
    - "cycle results for the ad"
    - "ad campaign performance"
  allOf:
    - [ad, results]
    - [ad, performance]
    - [creative, fatigue]
    - [ad, not, working]
  anyOf:
    - "CTR"
    - "CPA"
    - "ROAS"
    - "frequency"
    - "ad spend"
    - "conversions"
    - "ad fatigue"
    - "creative fatigue"
  noneOf:
    - "new ad copy"
    - "ad brief"
    - "write an ad"
    - "ad creative brief"
  minScore: 6
routing:
  intent-tags:
    - ad-evaluation
    - post-launch-ad
    - eval-loop-cycle
    - creative-fatigue-analysis
    - audience-temp-scoring
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
    - .forsvn/artifacts/mkt/ad-copy/*.md
    - brand/BRAND.md
    - research/icp-research.md
    - research/product-context.md
  requires:
    - .forsvn/loops/[slug]/program.md
    - .forsvn/loops/[slug]/context.md
    - measurement evidence for the current cycle
    - audience-temp tag (cold-traffic OR retargeting) on the cycle
  defers-to:
    - skill: run-eval-loop
      when: "no existing measurable loop workspace exists"
    - skill: write-ad
      when: "the user needs new creative for next cycle (revised hook, refreshed hero, new audience-temp framing) rather than post-launch scoring"
    - skill: plan-campaign
      when: "the issue is channel mix / budget allocation across paid+owned+earned rather than ad creative performance"
    - skill: brief-landing-page
      when: "low LP conversion is dragging ROAS down — the bottleneck is the page, not the ad"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Ad Eval — Orchestrator

*Evaluation skill. Converts launched Meta ad campaign evidence into a cycle snapshot, a ledger row, and a narrowly-scoped next action inside an existing eval loop. One cycle per audience-temperature.*

**Core Question:** "Did this ad cycle, for this audience-temperature, create measurable signal strong enough to keep, discard, watch, or block, and what should the next strategy/execution skill know?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates

1. **Existing eval loop required.** If `.forsvn/loops/[slug]/program.md` and `context.md` do not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop`. This skill does not create loops.
2. **Measurement evidence required.** Do not run as a generic creative-quality audit. Require at least one metric source, measurement window, and current value for the loop's primary metric (CTR / CPA / ROAS / conversion rate / etc. — operator-pick-per-cycle via loop's `program.md`).
3. **One primary metric decides the ledger row.** Secondary metrics (frequency, fatigue indicators, qualitative comments) explain diagnosis; they do not override the loop's primary metric unless `program.md` defines an explicit guardrail failure (e.g., frequency > 4 kills the cycle regardless of ROAS).
4. **One audience-temp per cycle.** Cold-traffic and retargeting are evaluated in separate cycles. Mirrors write-ad's one-artifact-per-audience-temp pattern. Mixed-audience metrics → split before ingest, or return `BLOCKED` if attribution can't be cleaned.
5. **No fabricated analytics.** Unknown values stay unknown. Manual notes are allowed only when labeled as operator-supplied and tied to a date/window/source.
6. **Attribution confidence must be explicit.** Every verdict includes sample size (impressions + spend window), baseline comparability (same audience-temp, same offer, comparable spend window), confounders (creative change mid-flight, audience size shift, iOS attribution gap), and confidence: `high | medium | low | blocked`.
7. **Evaluation does not generate creative.** Recommend next changes, but route actual creative authorship to `write-ad` (with a revised brief), channel-mix work to `plan-campaign`, and LP-bottleneck work to `brief-landing-page`.

## Responsibility Split

- `/run-eval-loop` owns loop setup, `program.md`, `context.md`, `results.tsv` schema, and the durable learning ledger.
- `/evaluate-ad` owns post-launch Meta-ad evidence snapshots for a loop cycle, scoped to a single audience-temp.
- `/write-ad` owns next-cycle creative after an eval identifies what should change.

## Inputs

| Input | Required? | What it provides |
|---|---:|---|
| Loop slug or path | **required** | Locates `.forsvn/loops/[slug]/` |
| Audience-temp tag (`cold-traffic` OR `retargeting`) | **required** | Scopes the cycle; gates Critical Gate 4 |
| Source ad-copy artifact | **required** | The brief's hypothesis being scored against — typically `.forsvn/artifacts/mkt/ad-copy/[audience-temp]-[date]-[slug].md` |
| Measurement window | **required** | Date range for the current cycle (start + end + days) |
| Primary metric value + source | **required** | Ledger decision metric (e.g., ROAS=2.4× from Meta Ads Manager) |
| Spend window | **required** | Total spend during the measurement window (for sample-size confidence) |
| Baseline or prior cycle row | required if available | Comparison point |
| Frequency at window close | recommended | For Creative-Fatigue Awareness scoring |
| Conversion count + CPA | recommended | For CPA + conversion-quality diagnosis |
| Audience size + reach | recommended | Saturation diagnosis |
| Guardrail metrics from `program.md` | optional | Auto-fail thresholds (e.g., frequency > 4, CPA > $X) |
| Qualitative evidence | optional | Comments, sentiment, click-quality notes |

## Outputs

Primary artifact:

```text
.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md
```

Side effects:

- Append one row to `.forsvn/loops/[slug]/results.tsv` with `bun scripts/append-loop-result.ts` (8-column validated helper).
- Update `.forsvn/loops/[slug]/learnings.md` only for high-confidence `keep` or `discard` lessons that generalize beyond this exact creative.
- Run `bun scripts/manifest-sync.ts` after writing.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Normalizes primary metric, baseline, spend, window, frequency, audience-temp tag, source caveats |
| Diagnosis | 1 (parallel) | `agents/diagnosis-agent.md` | Connects metrics to the ad-copy artifact's hypothesis (hook, audience-temp framing, CTA), creative-fatigue signals, audience-match signals |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep/discard/watch/blocked and next-cycle action (rotate creative / refresh hook / shift budget / kill / route back to write-ad with revised brief) |
| Critic | 3 | `agents/critic-agent.md` | Enforces 7-dim rubric, evidence discipline, loop boundary, ledger correctness, no fake analytics |

## Pre-Dispatch

Read `references/_shared/eval-loop-spec.md` before writing artifacts when available.

**Hard-block conditions (fire BEFORE Cold Start):** (1) `program.md` or `context.md` absent → NEEDS_CONTEXT, recommend `/run-eval-loop`. (2) No measurement evidence for current cycle → BLOCKED with missing-evidence list. (3) Mixed-audience metrics with no clean split → BLOCKED until ingest is scoped to one audience-temp. (4) Custom 10+ column `results.tsv` schema → warn + flag to eval-loop owner; require hand-edit (not standard helper).

**Read Order:** `program.md` → `context.md` → `results.tsv` → latest `strategy/` + `execution/` + `evals/` files → source ad-copy artifact (`.forsvn/artifacts/mkt/ad-copy/[audience-temp]-[date]-[slug].md`) → canonical artifacts (`brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`, campaign plan if present). If `.agents/manifest.json` is stale, run `bun scripts/manifest-sync.ts`.

**Warm Start** (loop exists + metric evidence present + audience-temp tagged): summarize loop + audience-temp + primary metric + baseline/prior result + latest creative artifact + current evidence window; proceed to evaluate cycle N.

**Cold Start** (loop exists but cycle context missing): ask 6 bundled questions — loop slug/path + audience-temp + source ad-copy artifact path + measurement window + primary metric value/baseline + spend window. If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop` instead of asking the rest.

Full Read Order + Warm/Cold Start templates + hard-block conditions + Needed dimensions + write-back (none — eval-loop owns persistent state) + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Dispatch

1. Resolve loop path + next cycle number + audience-temp scope. Cycle number is `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact.
2. Layer 1 parallel: Metric Ingest + Diagnosis. Metric Ingest reads operator metrics + program.md guardrails; Diagnosis reads source ad-copy artifact's hypothesis + Layer-1's normalized metrics (Diagnosis waits for Metric Ingest's output, then runs).
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
- **Body:** 8 sections (Title / Verdict / Evidence 6-col table / What Changed This Cycle / Diagnosis / Next Cycle Recommendation / Results Row 8-col TSV / Learning Promotion)
- **Audience-temp field:** Verdict block must name the audience-temp explicitly (Critical Gate 4); Evidence table must scope metrics to that audience-temp
- **Generation provenance** (per D8 contract): frontmatter carries `provenance.input_artifacts` listing the source ad-copy path, BRAND.md, icp-research.md; `provenance.output_eval` is `null` until a downstream eval consumes this cycle (rare — eval cycles are typically terminal)
- **Results Row schema:** 8 columns (cycle / date / artifact / primary_metric / value / baseline / status / description) — `status` must be `keep | discard | watch | blocked` (Critic Hard Fail otherwise)
- **Cross-stack contract:** consumed by future ad-eval cycles (trend analysis), by `write-ad --rev=N+1` (hypothesis seeding for next creative), by humans reviewing loop progress. ad-eval does NOT directly consume write-ad output — sibling coordination is at the eval-loop boundary, not artifact-schema boundary. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers — never silently drift.

Full evaluation artifact template byte-identical + Evidence table format + Results Row format + Learning Promotion rules + `append-loop-result.ts` invocation + known-limitation on custom 10+ column schemas: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Evaluation Artifact Template (summary)

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. 10-field frontmatter (skill / version / date / status / summary / purpose / lifecycle: evaluation / use_when / do_not_use_when / upstream / downstream) + provenance block. 8 body sections in order:

1. Title `# [Campaign / Audience-Temp] Cycle N Evaluation`
2. **Verdict** — Status / Confidence / Audience-Temp / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat) — scoped to the audience-temp
4. **What Changed This Cycle** — creative artifact link or operator note
5. **Diagnosis** — Likely Drivers + Confounders + Creative-Fatigue Signals subsections
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

- `artifact` is relative to the loop folder, e.g. `evals/2026-05-19-cycle-1.md`.
- `status` must be `keep`, `discard`, `watch`, or `blocked`.
- `description` is one sentence without tabs (include the audience-temp tag in the description).
- Use the validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include audience-temp>"
```

- Do not append a row if the Critic verdict is FAIL. Return `BLOCKED`.

## Critic Override Protocol

When the operator explicitly chooses to ship despite a critic FAIL (or accept a `pass-with-concerns` verdict that the rubric flagged), **log the override before doing anything else.** The override log is the only mechanism that turns repeated operator pushback into a rubric-revision signal (`references/_shared/quality-feedback-protocol.md § Critic Override Log` + `references/_shared/quality-dashboard-spec.md § Rubric Metrics`).

```bash
bun scripts/eval/log-critic-override.ts \
  --skill evaluate-ad \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

The script appends a dated block to `.forsvn/artifacts/meta/records/critic-overrides.md`. After three valid overrides on the same `skill:dimension` pair, the rubric should be revised (escalation handled by the dashboard's `rubrics[skill:dimension].action` field — see quality-dashboard-spec.md).

Only after the override is logged may the cycle proceed. The ledger row status (`results.tsv`) reflects the actual cycle outcome — operator override does NOT promote a contested cycle to `keep`; pick `watch` or `discard` if the underlying evidence does not support `keep`.

If the operator does NOT override and the critic FAILs, the default rule above stands: return `BLOCKED`, do not append the row.

---

## Anti-Patterns

Pipeline reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any cycle artifact ships. Ad-eval-specific patterns (mixed-audience metric ingest, fabricated attribution, confidence inflation on low-spend windows, scope drift to redesigning the creative under the brief, scope drift to redesigning the LP under the ad, learning promotion from a fatigued window, killing a cycle without baseline comparability) + 4 cross-cutting marketing-stack rows.

Most common in practice: mixed-audience contamination (Critical Gate 4 + Critic dim "Audience-Temp Fidelity"), confidence inflation on low-spend (Critical Gate 6 + Critic dim "Attribution Honesty"), scope drift to write-ad territory (Critical Gate 7 + Critic dim "Decision Discipline"), missing source ad-copy artifact (Critic Hard Fail).

## Completion

End with one status:

- `DONE` — eval artifact written, ledger row appended, critic passed
- `DONE_WITH_CONCERNS` — artifact and row written, but confidence is low/medium or confounders are material
- `NEEDS_CONTEXT` — missing loop, source ad-copy artifact, audience-temp tag, or required metric evidence
- `BLOCKED` — contradictory data, mixed-audience ingest, filesystem failure, or critic failed after revision

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Rubric:** `references/rubric.md` [RUBRIC] — canonical 7-dim 0-10 Pass/Fail rubric (provisional v0.1; revision-triggered per brief 05)
- **Format:** `references/format-conventions.md` [PROCEDURE] — full evaluation artifact template byte-identical
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Shared:** `references/_shared/{eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric, quality-feedback-protocol, quality-dashboard-spec}.md`
- **Agents:** 4 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` enforces the 7-dim rubric in `references/rubric.md` + 4-tier Verdict + Hard Fails.
- **Sibling coordination:** `write-ad` (construction-time creative; this skill routes recommendations TO write-ad but does not produce briefs); `run-eval-loop` (owns loop scaffolding + `program.md` + `context.md` + `results.tsv` schema + durable learning ledger); `evaluate-landing-page` (sister skill — when low LP conversion contaminates ROAS, route diagnosis to lp-eval); `plan-campaign` (channel-mix retrospective rather than creative scoring).
