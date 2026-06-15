---
title: Content-Eval Format Conventions
lifecycle: canonical
status: stable
produced_by: evaluate-content
load_class: PROCEDURE
---

# Content-Eval Format Conventions

> Format rules for the evaluate-content cycle artifact + results.tsv row + learnings.md promotion. Cited from SKILL.md "Artifact Contract" + "Evaluation Artifact Template" + "Results Row Discipline" sections. Schema changes require atomic update across `_shared/eval-loop-spec.md` + write-social (which produces the source artifact read by evaluate-content) + eval-loop owner.

Aligned byte-for-byte with `evaluate-ad/references/format-conventions.md` where cross-eval consistency matters (frontmatter schema, Results Row 8-column schema, Evidence 6-column schema, side-effect order). Content-specific extensions are clearly marked.

## Output locations

| Path | Lifecycle | Behavior |
|---|---|---|
| `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` | evaluation | Primary artifact, one per cycle, scoped to a single primary platform |
| `.forsvn/loops/[slug]/results.tsv` | evaluation | Append exactly one row via `bun scripts/append-loop-result.ts` (validated 8-column helper) |
| `.forsvn/loops/[slug]/learnings.md` | learning | Update ONLY for high-confidence keep/discard lessons reusable beyond this exact content piece; critic gates the promotion |

## File naming

- **Eval artifact:** `YYYY-MM-DD-cycle-N.md` — ISO date + cycle number resolved from `last results.tsv cycle + 1` (or explicit cycle when out-of-order)
- **Slug** = the eval-loop slug (from `program.md` frontmatter)
- **Cycle number** = `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact (rare out-of-order case)
- **One cycle = one primary platform.** If the operator runs evaluate-content twice for the LinkedIn and Instagram cuts of the same content, the cycles are numbered sequentially (cycle-3 linkedin, cycle-4 instagram) — NOT cycle-3-linkedin and cycle-3-instagram. The ledger row's description disambiguates by including the primary-platform tag.

## Frontmatter schema (10 fields + generation provenance per D8)

```yaml
---
skill: evaluate-content
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[content-or-primary-platform] cycle N content evaluation"
purpose: "Post-publish evidence snapshot for an organic-content eval loop, scoped to one primary platform"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current content cycle"
do_not_use_when: "Authoring next-cycle copy without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, strategy/, execution/, docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md, metric source"
downstream: "results.tsv, learnings.md, write-social next-cycle brief"
provenance:
  skill: evaluate-content
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md
    - brand/BRAND.md
    - research/icp-research.md
  output_eval: null
---
```

Date format: ISO `YYYY-MM-DD`. `lifecycle: evaluation` is required (eval-loop spec — see `_shared/eval-loop-spec.md`). `provenance` block is the D8 generation-provenance contract — see `_shared/artifact-contract-template.md` § Generation provenance.

## Body section structure (8 sections, in order)

1. **Title** — H1 `# [Content or Primary-Platform] Cycle N Evaluation`
2. **Verdict** — 5 bullets: Status / Confidence / Primary-Platform / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat columns) — scoped to the primary platform; content signals (engagement rate, saves, shares, comments, click-through, conversions, reach) populated as rows
4. **What Changed This Cycle** — source write-social artifact link + hook/format/visual/CTA/posting changes since prior cycle
5. **Diagnosis** — Likely Drivers + Engagement-Quality Signals + Cross-Platform Context + Confounders (4 H3 subsections)
6. **Next Cycle Recommendation** — Keep / Discard / Watch / Route-next-work-to lines (component granularity, not "the content plan")
7. **Results Row** — fenced TSV block with the 8-column row (cycle / date / artifact / primary_metric / value / baseline / status / description) — description includes the primary platform
8. **Learning Promotion** — Promote to learnings.md (yes/no) + Lesson + Expiry/caveat (platform/format scoped)

## Full evaluation artifact template (byte-identical)

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`:

```markdown
---
skill: evaluate-content
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[content-or-primary-platform] cycle N content evaluation"
purpose: "Post-publish evidence snapshot for an organic-content eval loop, scoped to one primary platform"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current content cycle"
do_not_use_when: "Authoring next-cycle copy without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, strategy/, execution/, docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md, metric source"
downstream: "results.tsv, learnings.md, write-social next-cycle brief"
provenance:
  skill: evaluate-content
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md
    - brand/BRAND.md
    - research/icp-research.md
  output_eval: null
---

# [Content or Primary-Platform] Cycle N Evaluation

## Verdict

- Status: keep | discard | watch | blocked
- Confidence: high | medium | low | blocked
- Primary-Platform: linkedin | instagram | x | facebook | threads | ...
- Primary metric: [name] = [value] vs [baseline]
- Decision: [one sentence — includes the primary platform]

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| primary metric |  |  |  |  |  |
| engagement rate |  |  |  |  |  |
| saves |  |  |  |  |  |
| shares |  |  |  |  |  |
| comments |  |  |  |  |  |
| likes |  |  |  |  |  |
| click-through |  |  |  |  |  |
| reach / impressions |  |  |  |  |  |

## What Changed This Cycle

- Source write-social artifact: `docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md`
- Hook/format/visual/CTA/posting delta from prior cycle:

## Diagnosis

### Likely Drivers

- [driver tied to evidence]

### Engagement-Quality Signals

- meaningful_engagement: [saves + shares + comments + click-through — absolute + % of reach]
- vanity_engagement: [likes + impressions + views]
- meaningful_to_vanity_ratio: [computed]
- quality_read: strong | mixed | vanity-heavy | weak
- qualitative_sentiment: [positive | mixed | negative | none-observed — quote actual comments, do not fabricate]

### Cross-Platform Context

- [secondary platform]: [headline metric] — [one-line read] — CONTEXT ONLY, not a verdict input

### Confounders

- [algorithm change, posting-time shift, follower-count change, cross-post cannibalization, seasonality, external event, a single viral comment skewing the thread]

## Next Cycle Recommendation

- Keep: [component-level, not "the content"]
- Discard:
- Watch:
- Route next work to: write-social | publish-social | produce-asset | run-pipeline | none

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
N	YYYY-MM-DD	evals/YYYY-MM-DD-cycle-N.md	metric	value	baseline	keep|discard|watch|blocked	[primary-platform] description
```

## Learning Promotion

- Promote to `learnings.md`: yes | no
- Lesson: [platform/format-scoped, durable, evidence-backed]
- Expiry / caveat: [platform scope? format scope? audience scope? what would break this lesson?]
```

## Evidence table format

Six columns mandatory:

| Signal | Current | Baseline | Window | Source | Caveat |

- **Signal** — name of the metric (primary metric mandatory; secondary metrics include engagement rate, saves, shares, comments, likes, click-through, reach/impressions)
- **Current** — current cycle's value with units (right-aligned in markdown)
- **Baseline** — comparison value with units (right-aligned)
- **Window** — measurement window (date range + days + reach or impression count)
- **Source** — tool/system the metric came from (native platform analytics / third-party dashboard / operator-supplied / etc.)
- **Caveat** — sample-size warning, algorithm-change note, posting-time shift, source-freshness flag

Unknown values stay unknown. Manual notes are allowed only when labeled as operator-supplied + tied to a date/window/source.

**Content-specific signal expectations:** primary metric is always populated (per Critical Gate 3). Engagement is always reported as the 4-way breakdown (likes / saves / shares / comments) — never a single blended number (per Critic Hard Fail discipline + the Engagement-Quality dim). Click-through + conversions are populated when defined in program.md guardrails OR relevant to the loop's primary metric.

## Results Row format (8 columns mandatory)

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder, e.g. `evals/2026-05-19-cycle-1.md`
- `status` must be `keep`, `discard`, `watch`, or `blocked` (Critic Hard Fail #7 otherwise)
- `description` is one sentence without tabs AND must include the primary-platform tag (Critic Hard Fail #8 otherwise)
- Use the validated helper to append:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include primary-platform tag>"
```

Example description: `"linkedin save rate 3.1% over 7d — keep hook+format, revise CTA per low click-through"`. The `linkedin` prefix is the primary-platform tag.

- Do NOT append a row if the Critic verdict is FAIL. Return `BLOCKED`.

### Known limitation — custom schemas

The validated helper enforces the 8-column standard schema. Loops with custom 10+ column `results.tsv` schemas currently require hand-edit. Schema migration is parked in the eval-loop owner's queue — flag affected loops to the eval-loop owner before manual append.

## Learning Promotion rules

`learnings.md` is the loop's **durable** record of validated lessons. Promotion is conservative — most cycles do NOT promote. Platform/format scope is mandatory in the lesson.

| Promotion | Criteria |
|---|---|
| **yes** | High-confidence (`confidence: high` in verdict) AND status = `keep` or `discard` AND lesson is reusable beyond this exact content piece (e.g., "LinkedIn carousels in [vertical] earn save-rate lift when slide 1 names the reader's job title" generalizes; "this exact carousel with #hex slide-1 at 8am Tuesday lifted saves 12%" does not) |
| **no** | Low-confidence OR `watch`/`blocked` status OR lesson is content-specific (won't generalize) OR lesson rests on a vanity spike (Critic Hard Fail #9) |

Critic Hard Fail #9 enforces — learning promoted from low-confidence-or-blocked-or-vanity-spike evidence triggers FAIL. Critic owns gate-keeping on promotion.

Lesson format:

```markdown
## YYYY-MM-DD — [one-line lesson — include platform/format scope]

- **Cycle:** [loop-slug] cycle N
- **Primary-platform:** [platform]
- **Evidence:** [primary metric delta with sample size + reach + confidence]
- **Expiry / caveat:** [when does this lesson stop being true? — e.g., "if the platform changes its engagement-rate denominator, retest"]
```

## Side effects (executed in order after critic PASS)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
2. **Append ledger row** via `bun scripts/append-loop-result.ts` (validated helper, 8-column schema)
3. **Update learnings.md** ONLY if critic approved promotion (high-confidence platform/format-scoped keep/discard lesson)
4. **Run manifest-sync** via `bun scripts/manifest-sync.ts` to refresh the manifest

If critic FAIL after revision: skip all 4 side effects. Return BLOCKED with missing evidence. If critic PASS but operator overrides on a `PASS_WITH_CONCERNS` verdict, the override-log invocation (`scripts/log-critic-override.ts`) precedes side effect #2.

## Cross-stack contract

This skill produces:

- `evals/[date]-cycle-N.md` — consumed by future evaluate-content cycles (read prior cycles for trend), by `write-social --rev=N+1` (latest eval seeds the next content's hypothesis), and by humans reviewing loop progress
- `results.tsv` row — appended to the loop's ledger; consumed by any skill reading the loop's status (dashboard skills, ledger-summary skills, downstream campaign retrospectives)
- `learnings.md` update — high-confidence platform/format-scoped lessons reusable beyond this content state; consumed by future write-social cycles + by humans

This skill does NOT directly consume write-social output via cross-skill import. write-social MIGHT be the strategy/execution artifact for the eval-loop cycle (its `docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md` copied or linked into the loop's `execution/` directory); evaluate-content reads loop-local strategy/execution artifacts AND the source write-social artifact path stored in provenance. The coordination contract between write-social and evaluate-content is at the eval-loop boundary + the provenance.input_artifacts pointer, not at a shared-schema boundary.

Schema changes (frontmatter fields, body section structure, Evidence table columns, Results Row columns, learnings.md format) require atomic update of `format-conventions.md` + `_shared/eval-loop-spec.md` + downstream callers — never silently drift.
