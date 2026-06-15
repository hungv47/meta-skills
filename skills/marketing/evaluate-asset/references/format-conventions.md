---
title: Asset-Eval Format Conventions
lifecycle: canonical
status: stable
produced_by: evaluate-asset
load_class: PROCEDURE
---

# Asset-Eval Format Conventions

> Format rules for the evaluate-asset cycle artifact + results.tsv row + learnings.md promotion. Cited from SKILL.md "Artifact Contract" section. Schema changes require atomic update across `_shared/eval-loop-spec.md` + the eval-loop owner + downstream callers (brief-graphic / produce-asset, which produce the source brief + re-ingested asset).

Aligned with the eval siblings (`evaluate-content`, `evaluate-ad`) where cross-eval consistency matters (frontmatter schema, Results Row 8-column schema, Evidence 6-column schema, side-effect order). Asset-specific extensions are clearly marked.

## Output locations

| Path | Lifecycle | Behavior |
|---|---|---|
| `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` | evaluation | Primary artifact, one per cycle, scoped to a single asset/picked variant |
| `.forsvn/loops/[slug]/results.tsv` | evaluation | Append exactly one row via `bun scripts/append-loop-result.ts` (validated 8-column helper) |
| `.forsvn/loops/[slug]/learnings.md` | learning | Update ONLY for high-confidence keep/discard lessons reusable beyond this exact render; critic gates the promotion |

## File naming

- **Eval artifact:** `YYYY-MM-DD-cycle-N.md` — ISO date + cycle number resolved from `last results.tsv cycle + 1`
- **Slug** = the eval-loop slug (from `program.md` frontmatter)
- **One cycle = one asset (or picked variant).** If the operator scores two distinct assets from the same loop, the cycles number sequentially; the ledger description disambiguates by including the asset id + engine.

## Frontmatter schema (10 fields + generation provenance)

```yaml
---
skill: evaluate-asset
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[asset-id] cycle N asset evaluation"
purpose: "Post-render brief-fidelity + brand-fit snapshot for an asset eval loop, scoped to one re-ingested asset/variant"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current rendered asset"
do_not_use_when: "Re-rendering or changing the brief without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, docs/forsvn/artifacts/marketing/design-briefs/[slug].md, docs/forsvn/artifacts/marketing/produced-assets/[slug]/manifest.md"
downstream: "results.tsv, learnings.md, produce-asset / brief-graphic next-render cycle"
provenance:
  skill: evaluate-asset
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/design-briefs/[slug].md
    - docs/forsvn/artifacts/marketing/produced-assets/[slug]/manifest.md
    - brand/BRAND.md
  output_eval: null
---
```

Date format: ISO `YYYY-MM-DD`. `lifecycle: evaluation` is required (eval-loop spec — see `_shared/eval-loop-spec.md`). `provenance` is the generation-provenance contract — see `_shared/artifact-contract-template.md` § Generation provenance. The re-ingested asset (`produced-assets/[slug]/manifest.md`, carrying `asset_picked` / `assets`) is a mandatory `input_artifacts` entry — it proves the return-leg closed.

## Body section structure (8 sections, in order)

1. **Title** — H1 `# [Asset-id] Cycle N Evaluation`
2. **Verdict** — 5 bullets: Status / Confidence / Asset-id + Engine / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat columns) — scoped to the one asset; signals include brief-fidelity, hard-criteria pass count, palette delta, Leaf share, resolution
4. **What Changed This Cycle** — source brief link + re-ingested asset link + render/prompt/variant changes since prior cycle
5. **Diagnosis** — Brief-Fidelity Check + Render-Quality Signals + Brand-Fit Signals + Confounders (4 H3 subsections)
6. **Next Cycle Recommendation** — Keep / Discard / Watch / Route-next-work-to lines (component granularity, not "the asset")
7. **Results Row** — fenced TSV block with the 8-column row — description includes the asset id + engine
8. **Learning Promotion** — Promote to learnings.md (yes/no) + Lesson + Expiry/caveat (engine/brief-type/brand scoped)

## Full evaluation artifact template

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`:

```markdown
---
skill: evaluate-asset
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[asset-id] cycle N asset evaluation"
purpose: "Post-render brief-fidelity + brand-fit snapshot for an asset eval loop, scoped to one re-ingested asset/variant"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current rendered asset"
do_not_use_when: "Re-rendering or changing the brief without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, docs/forsvn/artifacts/marketing/design-briefs/[slug].md, docs/forsvn/artifacts/marketing/produced-assets/[slug]/manifest.md"
downstream: "results.tsv, learnings.md, produce-asset / brief-graphic next-render cycle"
provenance:
  skill: evaluate-asset
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/design-briefs/[slug].md
    - docs/forsvn/artifacts/marketing/produced-assets/[slug]/manifest.md
    - brand/BRAND.md
  output_eval: null
---

# [Asset-id] Cycle N Evaluation

## Verdict

- Status: keep | discard | watch | blocked
- Confidence: high | medium | low | blocked
- Asset / Engine: [asset id or picked variant] · [render engine] (execution_mode: brief-only | assisted | direct)
- Primary metric: [name] = [value] vs [baseline]
- Decision: [one sentence — includes the asset id + engine]

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| primary metric |  |  |  |  |  |
| hard criteria met (N/M) |  |  |  |  |  |
| brief-fidelity |  |  |  |  |  |
| palette adherence |  |  |  |  |  |
| leaf share |  |  |  |  |  |
| resolution / dimensions |  |  |  |  |  |
| render integrity |  |  |  |  |  |

## What Changed This Cycle

- Source brief: `docs/forsvn/artifacts/marketing/design-briefs/[slug].md`
- Re-ingested asset: `docs/forsvn/artifacts/marketing/produced-assets/[slug]/manifest.md` (asset_picked: [variant])
- Render/prompt/variant delta from prior cycle:

## Diagnosis

### Brief-Fidelity Check

- [each hard acceptance criterion — met | missed, with visible evidence]
- soft criteria read: [aligned | drifted]
- hard_constraint_failures: [none | list]

### Render-Quality Signals

- technical_integrity: clean | minor-artifacts | broken — [text legibility, artifacts, resolution]

### Brand-Fit Signals

- palette_adherence: on-token | near | off-brand
- leaf_share: [<10% | overrun]
- type_and_logo: [matches | drift | n/a]
- brand_read: strong | mixed | off-brand

### Confounders

- [render-engine failure mode, seed variance, brief ambiguity, brand tokens not supplied]

## Next Cycle Recommendation

- Keep: [component-level, not "the asset"]
- Discard:
- Watch:
- Route next work to: produce-asset | brief-graphic | create-brand | run-pipeline | none

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
N	YYYY-MM-DD	evals/YYYY-MM-DD-cycle-N.md	metric	value	baseline	keep|discard|watch|blocked	[asset-id + engine] description
```

## Learning Promotion

- Promote to `learnings.md`: yes | no
- Lesson: [engine/brief-type/brand-scoped, durable, evidence-backed]
- Expiry / caveat: [engine scope? brief-type scope? brand scope? what would break this lesson?]
```

## Evidence table format

Six columns mandatory:

| Signal | Current | Baseline | Window | Source | Caveat |

- **Signal** — name of the metric (primary metric mandatory; secondary signals: hard-criteria pass count, brief-fidelity, palette adherence, Leaf share, resolution/dimensions, render integrity)
- **Current** — current cycle's value (right-aligned)
- **Baseline** — comparison value / the prior render (right-aligned)
- **Window** — render context (engine + execution_mode + render date), since asset eval has no measurement "window" the way analytics do
- **Source** — where the evidence came from (re-ingested render manifest / brand tokens / operator-supplied)
- **Caveat** — engine failure-mode note, variant ambiguity, missing-token flag, resolution warning

Unknown values stay unknown. Never assert a dimension or visual detail not present in the attached render.

**Asset-specific signal expectations:** the hard-criteria pass count (N/M) is always populated (per Critical Gate 5 + the Brief-Fidelity dim). Palette adherence + Leaf share are populated whenever brand tokens are supplied (per the Render-Quality & Brand-Fit dim).

## Results Row format (8 columns mandatory)

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder, e.g. `evals/2026-06-01-cycle-1.md`
- `status` must be `keep`, `discard`, `watch`, or `blocked` (Critic Hard Fail #7 otherwise)
- `description` is one sentence without tabs AND must include the asset id + engine tag (Critic Hard Fail #8 otherwise)
- Use the validated helper to append:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include asset id + engine tag>"
```

Example description: `"v3 / fal — 7/8 hard criteria met, aspect ratio off (4:5 brief vs 1:1 render) — discard, re-render"`. The `v3 / fal` prefix is the asset id + engine tag.

- Do NOT append a row if the Critic verdict is FAIL. Return `BLOCKED`.

### Known limitation — custom schemas

The validated helper enforces the 8-column standard schema. Loops with custom 10+ column `results.tsv` schemas require hand-edit — flag affected loops to the eval-loop owner before manual append.

## Learning Promotion rules

`learnings.md` is the loop's **durable** record of validated lessons. Promotion is conservative — most cycles do NOT promote. Engine/brief-type/brand scope is mandatory in the lesson.

| Promotion | Criteria |
|---|---|
| **yes** | High-confidence (`confidence: high`) AND status = `keep` or `discard` AND lesson reusable beyond this exact render (e.g., "engine X reliably mangles >6-word in-image headlines; spec in-render copy ≤4 words" generalizes; "this exact prompt at seed 4412 produced a clean hero" does not) |
| **no** | Low-confidence OR `watch`/`blocked` status OR lesson is render-specific (won't generalize) OR no baseline (single-render with nothing to compare) |

Critic Hard Fail #9 enforces — learning promoted from low-confidence-or-blocked-or-no-baseline evidence triggers FAIL.

Lesson format:

```markdown
## YYYY-MM-DD — [one-line lesson — include engine/brief-type/brand scope]

- **Cycle:** [loop-slug] cycle N
- **Asset / Engine:** [asset id] · [render engine]
- **Evidence:** [hard-criteria pass count + brand-fit read + confidence]
- **Expiry / caveat:** [when does this lesson stop being true? — e.g., "if the engine ships a text-rendering upgrade, retest"]
```

## Side effects (executed in order after critic PASS)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
2. **Append ledger row** via `bun scripts/append-loop-result.ts` (validated helper, 8-column schema)
3. **Update learnings.md** ONLY if critic approved promotion (high-confidence engine/brief-type/brand-scoped keep/discard lesson)
4. **Run manifest-sync** via `bun scripts/manifest-sync.ts` to refresh the manifest

If critic FAIL after revision: skip all 4 side effects. Return BLOCKED with the missing evidence. If operator overrides on a `PASS_WITH_CONCERNS` verdict, the override-log invocation (`scripts/log-critic-override.ts`) precedes side effect #2.

## Cross-stack contract

This skill produces:

- `evals/[date]-cycle-N.md` — consumed by future asset-eval cycles (fidelity trend), by `produce-asset` / `brief-graphic --rev=N+1` (re-render seeding), and by humans reviewing loop progress
- `results.tsv` row — appended to the loop's ledger; consumed by any skill reading the loop's status
- `learnings.md` update — high-confidence engine/brief-type/brand-scoped lessons reusable beyond this render

This skill consumes the re-ingested asset via the return-leg (`asset_picked` / `assets` on the produced-assets manifest) and the source brief's acceptance criteria. The coordination contract is at the eval-loop boundary + the provenance.input_artifacts pointer, not at a shared-schema boundary.

Schema changes (frontmatter fields, body section structure, Evidence table columns, Results Row columns, learnings.md format) require atomic update of `format-conventions.md` + `_shared/eval-loop-spec.md` + downstream callers — never silently drift.
