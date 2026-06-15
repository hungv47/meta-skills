---
title: Ad-Eval Format Conventions
lifecycle: canonical
status: stable
produced_by: evaluate-ad
load_class: PROCEDURE
---

# Ad-Eval Format Conventions

> Format rules for the evaluate-ad cycle artifact + results.tsv row + learnings.md promotion. Cited from SKILL.md "Artifact Contract" + "Evaluation Artifact Template" + "Results Row Discipline" sections. Schema changes require atomic update across `_shared/eval-loop-spec.md` + write-ad (which produces the source ad-copy artifact read by evaluate-ad) + eval-loop owner.

Aligned byte-for-byte with `evaluate-landing-page/references/format-conventions.md` where cross-eval consistency matters (frontmatter schema, Results Row 8-column schema, Evidence 6-column schema, side-effect order). Ad-specific extensions are clearly marked.

## Output locations

| Path | Lifecycle | Behavior |
|---|---|---|
| `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` | evaluation | Primary artifact, one per cycle, scoped to a single audience-temperature |
| `.forsvn/loops/[slug]/results.tsv` | evaluation | Append exactly one row via `bun scripts/append-loop-result.ts` (validated 8-column helper) |
| `.forsvn/loops/[slug]/learnings.md` | learning | Update ONLY for high-confidence keep/discard lessons reusable beyond this exact creative state; critic gates the promotion |

## File naming

- **Eval artifact:** `YYYY-MM-DD-cycle-N.md` — ISO date + cycle number resolved from `last results.tsv cycle + 1` (or explicit cycle when out-of-order)
- **Slug** = the eval-loop slug (from `program.md` frontmatter)
- **Cycle number** = `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact (rare out-of-order case)
- **One cycle = one audience-temp.** If the operator runs evaluate-ad twice in one day for cold + retargeting cycles of the same campaign, the cycles are numbered sequentially (cycle-3 cold-traffic, cycle-4 retargeting) — NOT cycle-3-cold and cycle-3-retargeting. The ledger row's description disambiguates by including the audience-temp tag.

## Frontmatter schema (10 fields + generation provenance per D8)

```yaml
---
skill: evaluate-ad
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[campaign-or-audience-temp] cycle N ad evaluation"
purpose: "Post-launch evidence snapshot for a Meta-ad eval loop, scoped to one audience-temperature"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current ad cycle"
do_not_use_when: "Authoring next-cycle creative without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, strategy/, execution/, docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md, metric source"
downstream: "results.tsv, learnings.md, write-ad next-cycle brief"
provenance:
  skill: evaluate-ad
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md
    - brand/BRAND.md
    - research/icp-research.md
  output_eval: null
---
```

Date format: ISO `YYYY-MM-DD`. `lifecycle: evaluation` is required (eval-loop spec — see `_shared/eval-loop-spec.md`). `provenance` block is the D8 generation-provenance contract — see `_shared/artifact-contract-template.md` § Generation provenance.

## Body section structure (8 sections, in order)

1. **Title** — H1 `# [Campaign or Audience-Temp] Cycle N Evaluation`
2. **Verdict** — 5 bullets: Status / Confidence / Audience-Temp / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat columns) — scoped to the audience-temp; ad-specific signals (CTR, CPA, ROAS, frequency, conversions) populated as rows
4. **What Changed This Cycle** — source ad-copy artifact link + creative/offer/audience/bid-strategy changes since prior cycle
5. **Diagnosis** — Likely Drivers + Confounders + Creative-Fatigue Signals + Audience-Match Signals (4 H3 subsections)
6. **Next Cycle Recommendation** — Keep / Discard / Watch / Route-next-work-to lines (component granularity, not campaign)
7. **Results Row** — fenced TSV block with the 8-column row (cycle / date / artifact / primary_metric / value / baseline / status / description) — description includes audience-temp
8. **Learning Promotion** — Promote to learnings.md (yes/no) + Lesson + Expiry/caveat (audience-temp scoped)

## Full evaluation artifact template (byte-identical)

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`:

```markdown
---
skill: evaluate-ad
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[campaign-or-audience-temp] cycle N ad evaluation"
purpose: "Post-launch evidence snapshot for a Meta-ad eval loop, scoped to one audience-temperature"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current ad cycle"
do_not_use_when: "Authoring next-cycle creative without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, strategy/, execution/, docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md, metric source"
downstream: "results.tsv, learnings.md, write-ad next-cycle brief"
provenance:
  skill: evaluate-ad
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md
    - brand/BRAND.md
    - research/icp-research.md
  output_eval: null
---

# [Campaign or Audience-Temp] Cycle N Evaluation

## Verdict

- Status: keep | discard | watch | blocked
- Confidence: high | medium | low | blocked
- Audience-Temp: cold-traffic | retargeting
- Primary metric: [name] = [value] vs [baseline]
- Decision: [one sentence — includes audience-temp]

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| primary metric |  |  |  |  |  |
| CTR |  |  |  |  |  |
| CPA |  |  |  |  |  |
| ROAS |  |  |  |  |  |
| Frequency |  |  |  |  |  |
| Spend |  |  |  |  |  |
| Conversions |  |  |  |  |  |

## What Changed This Cycle

- Source ad-copy artifact: `docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md`
- Creative/offer/audience/bid-strategy delta from prior cycle:

## Diagnosis

### Likely Drivers

- [driver tied to evidence]

### Confounders

- [iOS attribution gap, mid-flight creative change, audience size expansion, optimizer learning phase, seasonality, LP outage, pixel-event misfire, concurrent campaign cannibalization]

### Creative-Fatigue Signals

- frequency_at_close: [N.N]
- frequency_threshold: [N.N] (from program.md or default)
- ctr_slope_over_window: [+/-N% trend]
- negative_feedback_proxy: [available? rate?]
- fatigue_observed: yes | no | borderline
- recommended_refresh: [hook | hero | offer | rotate_all | none]

### Audience-Match Signals

- declared_audience_temp: [cold-traffic | retargeting]
- meta_audience_in_metrics: [audience name]
- temp_match: yes | no | uncertain
- match_quality: strong | mixed | weak | uncertain

## Next Cycle Recommendation

- Keep: [component-level, not campaign-level]
- Discard:
- Watch:
- Route next work to: write-ad | brief-landing-page | plan-campaign | run-pipeline | none

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
N	YYYY-MM-DD	evals/YYYY-MM-DD-cycle-N.md	metric	value	baseline	keep|discard|watch|blocked	[audience-temp] description
```

## Learning Promotion

- Promote to `learnings.md`: yes | no
- Lesson: [audience-temp-scoped, durable, evidence-backed]
- Expiry / caveat: [audience-temp scope? offer scope? platform scope? what would break this lesson?]
```

## Evidence table format

Six columns mandatory:

| Signal | Current | Baseline | Window | Source | Caveat |

- **Signal** — name of the metric (primary metric mandatory; secondary metrics include CTR, CPA, ROAS, frequency, spend, conversions, negative-feedback rate when available)
- **Current** — current cycle's value with units (right-aligned in markdown)
- **Baseline** — comparison value with units (right-aligned)
- **Window** — measurement window (date range + days + spend or impression count)
- **Source** — tool/system the metric came from (Meta Ads Manager / Supermetrics / Triple Whale / Northbeam / operator-supplied / etc.)
- **Caveat** — sample-size warning, attribution-window note (1d-click / 7d-click / view-through), iOS-ATT confounder, source-freshness flag

Unknown values stay unknown. Manual notes are allowed only when labeled as operator-supplied + tied to a date/window/source.

**Ad-specific signal expectations:** primary metric is always populated (per Critical Gate 2). CTR + frequency are always populated when source is Meta Ads Manager (default exports). CPA + ROAS + Conversions are populated when defined in program.md guardrails OR when relevant to the loop's primary metric.

## Results Row format (8 columns mandatory)

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder, e.g. `evals/2026-05-19-cycle-1.md`
- `status` must be `keep`, `discard`, `watch`, or `blocked` (Critic Hard Fail #7 otherwise)
- `description` is one sentence without tabs AND must include the audience-temp tag (Critic Hard Fail #8 otherwise)
- Use the validated helper to append:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include audience-temp tag>"
```

Example description: `"cold-traffic ROAS 2.4× over 14d — keep hook+offer, refresh hero per fatigue"`. The `cold-traffic` prefix is the audience-temp tag.

- Do NOT append a row if the Critic verdict is FAIL. Return `BLOCKED`.

### Known limitation — custom schemas

The validated helper enforces the 8-column standard schema. Loops with custom 10+ column schemas (e.g., multi-metric loops that include guardrail values in the row) currently require hand-edit. Schema migration is parked in the eval-loop owner's queue — flag affected loops to the eval-loop owner before manual append.

## Learning Promotion rules

`learnings.md` is the loop's **durable** record of validated lessons. Promotion is conservative — most cycles do NOT promote. Audience-temp scope is mandatory in the lesson.

| Promotion | Criteria |
|---|---|
| **yes** | High-confidence (`confidence: high` in verdict) AND status = `keep` or `discard` AND lesson is reusable beyond this exact creative (e.g., "Cold-traffic audiences in [vertical] reject objection-handling-first hooks — open with problem-named curiosity" generalizes; "This specific hook with #hex headline at 8pm Wednesday lifted ROAS 12%" does not) |
| **no** | Low-confidence OR `watch`/`blocked` status OR lesson is creative-specific (won't generalize) OR lesson is mixed-audience (Critic Hard Fail #9) |

Critic Hard Fail #9 enforces — learning promoted from low-confidence-or-blocked-or-mixed-audience evidence triggers FAIL. Critic owns gate-keeping on promotion.

Lesson format:

```markdown
## YYYY-MM-DD — [one-line lesson — include audience-temp scope]

- **Cycle:** [loop-slug] cycle N
- **Audience-temp:** cold-traffic | retargeting
- **Evidence:** [primary metric delta with sample size + spend + confidence]
- **Expiry / caveat:** [when does this lesson stop being true? — e.g., "if cold audience saturation > 30%, retest"]
```

## Side effects (executed in order after critic PASS)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
2. **Append ledger row** via `bun scripts/append-loop-result.ts` (validated helper, 8-column schema)
3. **Update learnings.md** ONLY if critic approved promotion (high-confidence audience-temp-scoped keep/discard lesson)
4. **Run manifest-sync** via `bun scripts/manifest-sync.ts` to refresh the manifest

If critic FAIL after revision: skip all 4 side effects. Return BLOCKED with missing evidence. If critic PASS but operator overrides on a `PASS_WITH_CONCERNS` verdict, the override-log invocation (`scripts/log-critic-override.ts`) precedes side effect #2.

## Cross-stack contract

This skill produces:

- `evals/[date]-cycle-N.md` — consumed by future evaluate-ad cycles (read prior cycles for trend), by `write-ad --rev=N+1` (latest eval seeds the next creative's hypothesis), and by humans reviewing loop progress
- `results.tsv` row — appended to the loop's ledger; consumed by any skill reading the loop's status (dashboard skills, ledger-summary skills, downstream campaign-plan retrospectives)
- `learnings.md` update — high-confidence audience-temp-scoped lessons reusable beyond this creative state; consumed by future write-ad / plan-campaign cycles + by humans

This skill does NOT directly consume write-ad output via cross-skill import. write-ad MIGHT be the strategy/execution artifact for the eval-loop cycle (its `docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md` copied or linked into the loop's `execution/` directory); evaluate-ad reads loop-local strategy/execution artifacts AND the source ad-copy artifact path stored in provenance. The coordination contract between write-ad and evaluate-ad is at the eval-loop boundary + the provenance.input_artifacts pointer, not at a shared-schema boundary.

Schema changes (frontmatter fields, body section structure, Evidence table columns, Results Row columns, learnings.md format) require atomic update of `format-conventions.md` + `_shared/eval-loop-spec.md` + downstream callers — never silently drift.
