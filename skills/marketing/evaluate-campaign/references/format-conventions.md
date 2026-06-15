---
title: Campaign-Eval Format Conventions
lifecycle: canonical
status: stable
produced_by: evaluate-campaign
load_class: PROCEDURE
---

# Campaign-Eval Format Conventions

> Format rules for the evaluate-campaign cycle artifact + results.tsv row + learnings.md promotion. Cited from SKILL.md "Artifact Contract" + "Evaluation Artifact Template" + "Results Row Discipline" sections. Schema changes require atomic update across `_shared/eval-loop-spec.md` + plan-campaign (which produces the source artifact read by evaluate-campaign) + eval-loop owner.

Aligned byte-for-byte with `evaluate-content/references/format-conventions.md` and `evaluate-ad/references/format-conventions.md` where cross-eval consistency matters (frontmatter schema, Results Row 8-column schema, Evidence 6-column schema, side-effect order). Campaign-specific extensions (the per-channel breakdown table, the Unit-Economics Signals subsection) are clearly marked.

## Output locations

| Path | Lifecycle | Behavior |
|---|---|---|
| `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` | evaluation | Primary artifact, one per cycle, scoped to the whole campaign across all channels |
| `.forsvn/loops/[slug]/results.tsv` | evaluation | Append exactly one row via `bun scripts/append-loop-result.ts` (validated 8-column helper) |
| `.forsvn/loops/[slug]/learnings.md` | learning | Update ONLY for high-confidence keep/discard lessons reusable beyond this exact campaign; critic gates the promotion |

## File naming

- **Eval artifact:** `YYYY-MM-DD-cycle-N.md` — ISO date + cycle number resolved from `last results.tsv cycle + 1` (or explicit cycle when out-of-order)
- **Slug** = the eval-loop slug (from `program.md` frontmatter)
- **Cycle number** = `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact (rare out-of-order case)
- **One cycle = one whole campaign.** A campaign is evaluated as a single cycle across every channel — never one cycle per channel. The per-channel breakdown lives inside the cycle artifact's Diagnosis section. The ledger row's description disambiguates by including the campaign tag.

## Frontmatter schema (10 fields + generation provenance per D8)

```yaml
---
skill: evaluate-campaign
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[campaign] cycle N campaign evaluation"
purpose: "Post-launch evidence snapshot for a multi-channel campaign eval loop, scored across all channels as one aggregate"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current campaign cycle"
do_not_use_when: "Re-planning next-cycle campaign strategy without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, strategy/, execution/, docs/forsvn/artifacts/marketing/campaign-plan.md, metric source"
downstream: "results.tsv, learnings.md, plan-campaign next-cycle plan"
provenance:
  skill: evaluate-campaign
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/campaign-plan.md
    - brand/BRAND.md
    - research/icp-research.md
  output_eval: null
---
```

Date format: ISO `YYYY-MM-DD`. `lifecycle: evaluation` is required (eval-loop spec — see `_shared/eval-loop-spec.md`). `provenance` block is the D8 generation-provenance contract — see `_shared/artifact-contract-template.md` § Generation provenance.

## Body section structure (8 sections, in order)

1. **Title** — H1 `# [Campaign] Cycle N Evaluation`
2. **Verdict** — 5 bullets: Status / Confidence / Campaign / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat columns) — campaign-level aggregate signals (primary metric, reach, leads, conversions, revenue, blended CAC, paid CAC, total spend) populated as rows
4. **What Changed This Cycle** — source plan-campaign artifact link + objective/channel-mix/budget-split/sequencing changes since prior cycle
5. **Diagnosis** — Likely Drivers + Channel-Mix Signals (per-channel breakdown table) + Unit-Economics Signals + Confounders (4 H3 subsections)
6. **Next Cycle Recommendation** — Keep / Discard / Watch / Route-next-work-to lines (channel/budget granularity, not "the whole campaign")
7. **Results Row** — fenced TSV block with the 8-column row (cycle / date / artifact / primary_metric / value / baseline / status / description) — description includes the campaign tag
8. **Learning Promotion** — Promote to learnings.md (yes/no) + Lesson + Expiry/caveat (campaign-type/channel-mix scoped)

## Full evaluation artifact template (byte-identical)

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`:

```markdown
---
skill: evaluate-campaign
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[campaign] cycle N campaign evaluation"
purpose: "Post-launch evidence snapshot for a multi-channel campaign eval loop, scored across all channels as one aggregate"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current campaign cycle"
do_not_use_when: "Re-planning next-cycle campaign strategy without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, strategy/, execution/, docs/forsvn/artifacts/marketing/campaign-plan.md, metric source"
downstream: "results.tsv, learnings.md, plan-campaign next-cycle plan"
provenance:
  skill: evaluate-campaign
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/campaign-plan.md
    - brand/BRAND.md
    - research/icp-research.md
  output_eval: null
---

# [Campaign] Cycle N Evaluation

## Verdict

- Status: keep | discard | watch | blocked
- Confidence: high | medium | low | blocked
- Campaign: [campaign name / tag]
- Primary metric: [name] = [value] vs [baseline]
- Decision: [one sentence — includes the campaign tag]

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| primary metric |  |  |  |  |  |
| reach / impressions |  |  |  |  |  |
| leads |  |  |  |  |  |
| conversions / new customers |  |  |  |  |  |
| revenue |  |  |  |  |  |
| blended CAC |  |  |  |  |  |
| paid CAC |  |  |  |  |  |
| total spend (fully loaded) |  |  |  |  |  |

## What Changed This Cycle

- Source plan-campaign artifact: `docs/forsvn/artifacts/marketing/campaign-plan.md`
- Objective/channel-mix/budget-split/sequencing delta from prior cycle:

## Diagnosis

### Likely Drivers

- [driver tied to evidence]

### Channel-Mix Signals

| Channel | Spend / Effort | Reach | Leads | Conversions | Revenue | CAC | Role |
|---|---:|---:|---:|---:|---:|---:|---|
| [channel] |  |  |  |  |  |  | driver / rider / mixed |

- channel_mix_read: [which channels drove net-new results, which rode along on warm/organic demand, which were mixed — with evidence]
- rider_channels_excluded: [channels whose conversions were NOT counted as campaign-driven net-new, and why]
- breakdown_completeness: [every channel that received spend/effort is in the table — yes/no]

### Unit-Economics Signals

- blended_CAC: [fully-loaded total spend ÷ net-new customers]
- paid_CAC: [paid-channel spend ÷ paid-channel net-new customers — reported distinct from blended]
- payback_period: [months to recover CAC at the product's price/margin]
- ltv_cac_ratio: [if measurable — else "not yet measurable"]
- revenue_attribution_note: [revenue net of what an organic baseline already explains]
- unit_economics_read: healthy | mixed | underwater | unknown

### Confounders

- [seasonality / concurrent campaign / channel cannibalization / price or promo change / organic baseline drift / brand-search lift / external event]

## Next Cycle Recommendation

- Keep: [channel-level or budget-level, not "the campaign"]
- Discard:
- Watch:
- Route next work to: plan-campaign | write-ad | write-social | run-pipeline | none

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
N	YYYY-MM-DD	evals/YYYY-MM-DD-cycle-N.md	metric	value	baseline	keep|discard|watch|blocked	[campaign] description
```

## Learning Promotion

- Promote to `learnings.md`: yes | no
- Lesson: [campaign-type/channel-mix-scoped, durable, evidence-backed]
- Expiry / caveat: [campaign-type scope? channel-mix scope? audience scope? what would break this lesson?]
```

## Evidence table format

Six columns mandatory:

| Signal | Current | Baseline | Window | Source | Caveat |

- **Signal** — name of the metric (primary metric mandatory; secondary metrics include reach, leads, conversions/new customers, revenue, blended CAC, paid CAC, total spend)
- **Current** — current cycle's value with units (right-aligned in markdown)
- **Baseline** — comparison value with units (right-aligned)
- **Window** — measurement window (date range + days + total spend)
- **Source** — tool/system the metric came from (CRM / ad-platform dashboard / web analytics / operator-supplied / etc.)
- **Caveat** — sample-size warning, attribution-model note, concurrent-campaign flag, source-freshness flag

Unknown values stay unknown. Manual notes are allowed only when labeled as operator-supplied + tied to a date/window/source.

**Campaign-specific signal expectations:** the primary metric is always populated (per Critical Gate 3). Blended CAC and paid CAC are reported as **distinct rows** — never collapsed into one CAC number (per the Unit-Economics Discipline dim). The Evidence table holds campaign-level aggregates; the **per-channel breakdown lives in the Diagnosis § Channel-Mix Signals table**, not in the Evidence table.

## Channel Breakdown table format (Diagnosis § Channel-Mix Signals)

The per-channel breakdown table is mandatory and is the campaign-eval's distinctive artifact element. Eight columns:

| Channel | Spend / Effort | Reach | Leads | Conversions | Revenue | CAC | Role |

- **Channel** — the channel name (e.g., paid-social, organic-linkedin, email, content-seo)
- **Spend / Effort** — paid spend in currency, or an effort note for organic channels (e.g., "8 posts" / "1 list send")
- **Reach / Leads / Conversions / Revenue** — that channel's contribution, with units; unknown stays unknown
- **CAC** — that channel's cost ÷ that channel's net-new customers (organic channels: "n/a — organic" or an allocated-effort estimate labeled as such)
- **Role** — `driver` (drove net-new campaign results) / `rider` (converted warm/organic demand that pre-dated the campaign) / `mixed`

Every channel that received spend OR effort MUST appear. A missing channel is a Metric Integrity + Channel-Mix Discrimination penalty. Rider channels' conversions are excluded from the campaign-driven net-new count — the exclusion is stated in `rider_channels_excluded`.

## Results Row format (8 columns mandatory)

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder, e.g. `evals/2026-05-20-cycle-1.md`
- `status` must be `keep`, `discard`, `watch`, or `blocked` (Critic Hard Fail #7 otherwise)
- `description` is one sentence without tabs AND must include the campaign tag (Critic Hard Fail #8 otherwise)
- Use the validated helper to append:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include campaign tag>"
```

Example description: `"spring-launch campaign 180 net-new subscribers vs 120 baseline — keep organic+content drivers, cut underwater paid-social per $61 paid CAC"`. The `spring-launch` prefix is the campaign tag.

- Do NOT append a row if the Critic verdict is FAIL. Return `BLOCKED`.

### Known limitation — custom schemas

The validated helper enforces the 8-column standard schema. Loops with custom 10+ column `results.tsv` schemas currently require hand-edit. Schema migration is parked in the eval-loop owner's queue — flag affected loops to the eval-loop owner before manual append.

## Learning Promotion rules

`learnings.md` is the loop's **durable** record of validated lessons. Promotion is conservative — most cycles do NOT promote. Campaign-type/channel-mix scope is mandatory in the lesson.

| Promotion | Criteria |
|---|---|
| **yes** | High-confidence (`confidence: high` in verdict) AND status = `keep` or `discard` AND lesson is reusable beyond this exact campaign (e.g., "for the subscription-app ICP, an existing-list email send is a rider, not a campaign driver — exclude its conversions from net-new" generalizes; "this exact spring-launch with this email subject lifted blended CAC" does not) |
| **no** | Low-confidence OR `watch`/`blocked` status OR lesson is campaign-specific (won't generalize) OR lesson rests on a rider channel's borrowed credit or a seasonal spike (Critic Hard Fail #9) |

Critic Hard Fail #9 enforces — learning promoted from low-confidence-or-blocked-or-rider-spike evidence triggers FAIL. Critic owns gate-keeping on promotion.

Lesson format:

```markdown
## YYYY-MM-DD — [one-line lesson — include campaign-type/channel-mix scope]

- **Cycle:** [loop-slug] cycle N
- **Campaign:** [campaign name / tag]
- **Evidence:** [primary metric delta with sample size + spend + confidence]
- **Expiry / caveat:** [when does this lesson stop being true? — e.g., "if the channel mix or attribution model changes, retest"]
```

## Side effects (executed in order after critic PASS)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
2. **Append ledger row** via `bun scripts/append-loop-result.ts` (validated helper, 8-column schema)
3. **Update learnings.md** ONLY if critic approved promotion (high-confidence campaign-type/channel-mix-scoped keep/discard lesson)
4. **Run manifest-sync** via `bun scripts/manifest-sync.ts` to refresh the manifest

If critic FAIL after revision: skip all 4 side effects. Return BLOCKED with missing evidence. If critic PASS but operator overrides on a `PASS_WITH_CONCERNS` verdict, the override-log invocation (`scripts/log-critic-override.ts`) precedes side effect #2.

## Cross-stack contract

This skill produces:

- `evals/[date]-cycle-N.md` — consumed by future evaluate-campaign cycles (read prior cycles for trend), by `plan-campaign --rev=N+1` (latest eval seeds the next campaign's hypothesis), and by humans reviewing loop progress
- `results.tsv` row — appended to the loop's ledger; consumed by any skill reading the loop's status (dashboard skills, ledger-summary skills)
- `learnings.md` update — high-confidence campaign-type/channel-mix-scoped lessons reusable beyond this campaign state; consumed by future plan-campaign cycles + by humans

This skill does NOT directly consume plan-campaign output via cross-skill import. plan-campaign MIGHT be the strategy artifact for the eval-loop cycle (its `docs/forsvn/artifacts/marketing/campaign-plan.md` copied or linked into the loop's `strategy/` directory); evaluate-campaign reads loop-local strategy/execution artifacts AND the source plan-campaign artifact path stored in provenance. The coordination contract between plan-campaign and evaluate-campaign is at the eval-loop boundary + the provenance.input_artifacts pointer, not at a shared-schema boundary.

Schema changes (frontmatter fields, body section structure, Evidence table columns, Channel Breakdown table columns, Results Row columns, learnings.md format) require atomic update of `format-conventions.md` + `_shared/eval-loop-spec.md` + downstream callers — never silently drift.
