---
title: Outreach-Eval Format Conventions
lifecycle: canonical
status: stable
produced_by: evaluate-outreach
load_class: PROCEDURE
---

# Outreach-Eval Format Conventions

> Format rules for the evaluate-outreach cycle artifact + results.tsv row + learnings.md promotion. Cited from SKILL.md "Artifact Contract" section. Schema changes require atomic update across `_shared/eval-loop-spec.md` + the eval-loop owner + write-outreach (which produces the source sequence read by evaluate-outreach).

Aligned with the eval siblings (`evaluate-content`, `evaluate-ad`) where cross-eval consistency matters (frontmatter schema, Results Row 8-column schema, Evidence 6-column schema, side-effect order). Outreach-specific extensions are clearly marked.

## Output locations

| Path | Lifecycle | Behavior |
|---|---|---|
| `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` | evaluation | Primary artifact, one per cycle, scoped to a single channel + segment |
| `.forsvn/loops/[slug]/results.tsv` | evaluation | Append exactly one row via `bun scripts/append-loop-result.ts` (validated 8-column helper) |
| `.forsvn/loops/[slug]/learnings.md` | learning | Update ONLY for high-confidence keep/discard lessons reusable beyond this exact sequence; critic gates the promotion |

## File naming

- **Eval artifact:** `YYYY-MM-DD-cycle-N.md` — ISO date + cycle number resolved from `last results.tsv cycle + 1`
- **Slug** = the eval-loop slug (from `program.md` frontmatter)
- **One cycle = one channel + segment.** If the operator scores cold-email and LinkedIn-DM variants of the same offer, the cycles number sequentially; the ledger description disambiguates by including the channel + segment.

## Frontmatter schema (10 fields + generation provenance)

```yaml
---
skill: evaluate-outreach
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[channel-segment] cycle N outreach evaluation"
purpose: "Post-send reply-quality + deliverability snapshot for an outreach eval loop, scoped to one channel + segment"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current outreach cycle"
do_not_use_when: "Authoring next-cycle sequence copy without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md, reply-data source"
downstream: "results.tsv, learnings.md, write-outreach next-cycle sequence"
provenance:
  skill: evaluate-outreach
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md
    - research/icp-research.md
    - brand/BRAND.md
  output_eval: null
---
```

Date format: ISO `YYYY-MM-DD`. `lifecycle: evaluation` is required (eval-loop spec — see `_shared/eval-loop-spec.md`). `provenance` is the generation-provenance contract — see `_shared/artifact-contract-template.md` § Generation provenance.

## Body section structure (8 sections, in order)

1. **Title** — H1 `# [Channel-Segment] Cycle N Evaluation`
2. **Verdict** — 5 bullets: Status / Confidence / Channel+Segment / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat columns) — scoped to the channel; signals include primary metric, positive-reply rate, meetings booked, bounce rate, spam-complaint rate, opt-out, sends
4. **What Changed This Cycle** — source write-outreach link + subject/opener/CTA/step changes since prior cycle
5. **Diagnosis** — Reply-Quality Signals + Deliverability & Compliance + Cross-Channel Context + Confounders (4 H3 subsections)
6. **Next Cycle Recommendation** — Keep / Discard / Watch / Route-next-work-to lines (component granularity, not "the outreach")
7. **Results Row** — fenced TSV block with the 8-column row — description includes the channel + segment
8. **Learning Promotion** — Promote to learnings.md (yes/no) + Lesson + Expiry/caveat (channel/segment/offer scoped)

## Full evaluation artifact template

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`:

```markdown
---
skill: evaluate-outreach
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[channel-segment] cycle N outreach evaluation"
purpose: "Post-send reply-quality + deliverability snapshot for an outreach eval loop, scoped to one channel + segment"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current outreach cycle"
do_not_use_when: "Authoring next-cycle sequence copy without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md, reply-data source"
downstream: "results.tsv, learnings.md, write-outreach next-cycle sequence"
provenance:
  skill: evaluate-outreach
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md
    - research/icp-research.md
    - brand/BRAND.md
  output_eval: null
---

# [Channel-Segment] Cycle N Evaluation

## Verdict

- Status: keep | discard | watch | blocked
- Confidence: high | medium | low | blocked
- Channel / Segment: [email | linkedin-dm | twitter-dm] · [ICP segment]
- Primary metric: [name] = [value] vs [baseline]
- Decision: [one sentence — includes the channel + segment]

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| primary metric |  |  |  |  |  |
| positive-reply rate |  |  |  |  |  |
| meetings booked |  |  |  |  |  |
| qualified leads |  |  |  |  |  |
| bounce rate |  |  |  |  |  |
| spam-complaint rate |  |  |  |  |  |
| opt-out / unsubscribe |  |  |  |  |  |
| sends |  |  |  |  |  |

## What Changed This Cycle

- Source write-outreach artifact: `docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md`
- Subject/opener/value-prop/CTA/step delta from prior cycle:

## Diagnosis

### Reply-Quality Signals

- meaningful_replies: [positive + meeting-booked + qualified-lead — absolute + % of sent]
- vanity_signals: [open rate + raw reply count + auto-replies]
- meaningful_to_vanity_read: strong | mixed | vanity-heavy | weak
- objection_patterns: [recurring objections — quote actual replies, do not fabricate]

### Deliverability & Compliance

- bounce_read: healthy | elevated | red-flag
- spam_signal: clean | warning | red-flag
- compliance_read: compliant | at-risk | violation (opt-out honored? CAN-SPAM/GDPR/ToS)
- domain_risk: [is this sequence burning the domain/account? say so plainly]

### Cross-Channel Context

- [secondary channel]: [headline metric] — [one-line read] — CONTEXT ONLY, not a verdict input

### Confounders

- [sender warmup, list freshness/source, seasonality, domain age, a single big-logo reply skewing the read]

## Next Cycle Recommendation

- Keep: [component-level, not "the outreach"]
- Discard:
- Watch:
- Route next work to: write-outreach | research-icp | run-pipeline | none

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
N	YYYY-MM-DD	evals/YYYY-MM-DD-cycle-N.md	metric	value	baseline	keep|discard|watch|blocked	[channel-segment] description
```

## Learning Promotion

- Promote to `learnings.md`: yes | no
- Lesson: [channel/segment/offer-scoped, durable, evidence-backed]
- Expiry / caveat: [channel scope? segment scope? offer scope? what would break this lesson?]
```

## Evidence table format

Six columns mandatory:

| Signal | Current | Baseline | Window | Source | Caveat |

- **Signal** — name of the metric (primary metric mandatory; secondary signals: positive-reply rate, meetings booked, qualified leads, bounce rate, spam-complaint rate, opt-out, sends)
- **Current** — current cycle's value with units (right-aligned)
- **Baseline** — comparison value (right-aligned)
- **Window** — measurement window (date range + days + sends)
- **Source** — tool/system the metric came from (outreach tool / CRM / operator-supplied)
- **Caveat** — sample-size warning, list-freshness note, warmup flag, source-freshness flag

Unknown values stay unknown. Manual notes are allowed only when labeled operator-supplied + tied to a date/window/source.

**Outreach-specific signal expectations:** the primary metric is always populated (Critical Gate 5). Replies are always reported as the categorized breakdown — never a single blended count (Reply-Quality dim). Bounce rate + spam-complaint rate + opt-out status are always populated (Critical Gate 6 + Deliverability & Compliance dim).

## Results Row format (8 columns mandatory)

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder, e.g. `evals/2026-06-01-cycle-1.md`
- `status` must be `keep`, `discard`, `watch`, or `blocked` (Critic Hard Fail #7 otherwise)
- `description` is one sentence without tabs AND must include the channel + segment tag (Critic Hard Fail #8 otherwise)
- Use the validated helper to append:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include channel + segment tag>"
```

Example description: `"email / founders — 0.9% positive-reply, 11 meetings booked, bounce 1.8% safe — keep opener, revise CTA"`. The `email / founders` prefix is the channel + segment tag.

- Do NOT append a row if the Critic verdict is FAIL. Return `BLOCKED`.

### Known limitation — custom schemas

The validated helper enforces the 8-column standard schema. Loops with custom 10+ column `results.tsv` schemas require hand-edit — flag affected loops to the eval-loop owner before manual append.

## Learning Promotion rules

`learnings.md` is the loop's **durable** record of validated lessons. Promotion is conservative — most cycles do NOT promote. Channel/segment/offer scope is mandatory in the lesson.

| Promotion | Criteria |
|---|---|
| **yes** | High-confidence (`confidence: high`) AND status = `keep` or `discard` AND lesson reusable beyond this exact sequence (e.g., "founder-segment cold email earns meetings when the opener names a specific recent trigger event" generalizes; "this exact subject line booked 3 meetings on Tuesday" does not) |
| **no** | Low-confidence OR `watch`/`blocked` status OR lesson is sequence-specific OR lesson rests on a vanity (open-rate) spike (Critic Hard Fail #9) |

Critic Hard Fail #9 enforces — learning promoted from low-confidence-or-blocked-or-vanity evidence triggers FAIL.

Lesson format:

```markdown
## YYYY-MM-DD — [one-line lesson — include channel/segment/offer scope]

- **Cycle:** [loop-slug] cycle N
- **Channel / Segment:** [channel] · [segment]
- **Evidence:** [primary metric delta with sends + meetings + confidence]
- **Expiry / caveat:** [when does this lesson stop being true? — e.g., "if the list source changes, retest deliverability"]
```

## Side effects (executed in order after critic PASS)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
2. **Append ledger row** via `bun scripts/append-loop-result.ts` (validated helper, 8-column schema)
3. **Update learnings.md** ONLY if critic approved promotion (high-confidence channel/segment/offer-scoped keep/discard lesson)
4. **Run manifest-sync** via `bun scripts/manifest-sync.ts` to refresh the manifest

If critic FAIL after revision: skip all 4 side effects. Return BLOCKED with the missing evidence. If operator overrides on a `PASS_WITH_CONCERNS` verdict, the override-log invocation (`scripts/log-critic-override.ts`) precedes side effect #2.

## Cross-stack contract

This skill produces:

- `evals/[date]-cycle-N.md` — consumed by future outreach-eval cycles (trend), by `write-outreach --rev=N+1` (latest eval seeds the next sequence's hypothesis), and by humans reviewing loop progress
- `results.tsv` row — appended to the loop's ledger; consumed by any skill reading the loop's status
- `learnings.md` update — high-confidence channel/segment/offer-scoped lessons reusable beyond this sequence

This skill reads the source write-outreach artifact (stored in provenance.input_artifacts) + the reply/deliverability data. The coordination contract is at the eval-loop boundary + the provenance pointer, not at a shared-schema boundary.

Schema changes (frontmatter fields, body section structure, Evidence table columns, Results Row columns, learnings.md format) require atomic update of `format-conventions.md` + `_shared/eval-loop-spec.md` + downstream callers — never silently drift.
