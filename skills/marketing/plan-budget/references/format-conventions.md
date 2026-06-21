# Format Conventions — Plan-Budget

> Artifact template, frontmatter contract, slug + re-run rules, table schemas. Cite this file; it IS the cross-stack contract.

[PROCEDURE] — loaded by the orchestrator at artifact-assembly time.

## Output path

```
docs/forsvn/artifacts/marketing/plan-budget/[date]-[slug].md
```

Pipeline lifecycle — overwrite on re-run for the same `(date, slug)` unless version preservation is requested via `[date]-[slug].v[N].md`. Slug pattern: `[date]-q4-paid-mix` or `[date]-acquisition-6k`. The date is the run date, not the spend period.

## Frontmatter field order — fixed

```yaml
---
skill: plan-budget
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: md            # html | md | none
id: plan-budget-[slug]        # immutable kebab slug — manifest maps id -> current path
type: plan                    # this is a working allocation plan
keywords: [budget, allocation, cac, channel-mix]   # non-empty; greppable selection surface
total_budget: 6000            # monthly budget allocated (number)
objective: acquisition        # acquisition | retention | mixed
horizon_months: 3             # allocation period
channels: [meta, google-search, linkedin, newsletter]   # the selected channel set allocated across
cac_sourcing: sourced         # sourced | mixed | hypothesis-only — grounding quality of the CAC inputs
critic_total: 60/70           # critic score of the shipped allocation, N/70 (informational)
decision_state: not_required  # pending | approved | denied | suggested | not_required
review_tool: inline           # proof | inline | roughdraft | none
reviewed_at:                  # YYYY-MM-DD — empty until reviewed
reviewer:                     # empty until reviewed
---
```

| Field | Rule |
|---|---|
| `skill` | Always `plan-budget` |
| `version` | Integer; increment only when re-running with preserved history |
| `date` | ISO `YYYY-MM-DD`; the run date |
| `status` | One of the four; **never** omit, never invent values |
| `stack` | Always `marketing` (folder name == frontmatter stack) |
| `review_surface` | `md` default — an allocation is a Markdown plan; `none` for a Route C internal call |
| `id` | Immutable kebab slug; the manifest maps `id → current path`. Graph edges reference it |
| `type` | `plan` — a working allocation awaiting execution |
| `keywords` | Non-empty list; include the channels for greppability |
| `total_budget` | The monthly budget allocated (number, no currency symbol) |
| `objective` | `acquisition` / `retention` / `mixed` — drives the marginal-return basis |
| `horizon_months` | Allocation period in months |
| `channels` | The selected channel set this run allocates across (from campaign-plan or operator) |
| `cac_sourcing` | `sourced` (all CACs sourced), `mixed` (some hypothesis lanes), `hypothesis-only` (would be NEEDS_CONTEXT — only present on a flagged thin run) |
| `critic_total` | The shipped allocation's critic score as `N/70` (one allocation scored per run, max 70 — same scale the rubric uses); informational, consumed by `measure-results` loop-close |
| `decision_state` / `review_tool` / `reviewed_at` / `reviewer` | Human-acceptance fields; `not_required` default (regenerable draft). Operator opts a run into review by setting `pending`. Semantics: `references/_shared/reviewable-artifact-contract.md` |

## Body section order — fixed

Downstream consumers (`plan-campaign`, `write-ad`, `measure-results`) jump by heading match — do **not** reorder.

1. `# Budget Allocation: [Objective] — $[total]/mo` — H1
2. `## Inputs` — budget, objective, horizon, the selected channel set, the constraints (concentration cap, floors)
3. `## Sourcing Ledger` — per channel: CAC + CAC source, LTV + LTV source, lane (allocation | hypothesis)
4. `## Marginal-Return Reasoning` — per allocation-lane channel: curve position, marginal CAC vs average, why this dollar amount
5. `## Allocation` — the table: channel · spend · % · lane · marginal CAC @ spend · expected new customers · LTV:CAC @ marginal
6. `## Reallocation Triggers` — per channel + the budget-event trigger
7. `## Constraints Applied` — floors that bound, concentration cap, any §0-veto override + reason
8. `## Risks & Concerns` — hypothesis lanes, thin saturation data, anything shipped `done_with_concerns`

## Allocation table schema

| Column | Rule |
|---|---|
| Channel | The selected-channel name |
| Spend | The monthly dollar allocation; annotate `(FLOOR)` when the min-viable floor binds, `(TEST CAP)` for a hypothesis lane |
| % | Spend ÷ total, rounded to whole % |
| Lane | `allocation` (number-backed) or `hypothesis` (capped, unsourced CAC) |
| Marginal CAC @ spend | The next-dollar CAC at the proposed spend; `unknown` for a hypothesis lane |
| Expected new customers | Spend ÷ marginal CAC, rounded; `learning only` for a hypothesis lane |
| LTV:CAC @ marginal | LTV ÷ marginal CAC; the profitability check (target ≥3:1) |

The Allocation table's Spend column **must sum to exactly `total_budget`** — the constraint-checker and critic both verify this.

## Cross-stack contract — atomic update rule

`docs/forsvn/artifacts/marketing/plan-budget/[date]-[slug].md` is read by `plan-campaign` (per-channel execution weight), `write-ad` (per-network spend context), and `measure-results` (closes the loop on the predicted marginal CACs). Schema drift breaks these silently. **Any frontmatter or body-section schema change requires an atomic update of this file (§ "Frontmatter field order" + § "Body section order") in the same commit.** Add new frontmatter fields at the END to avoid breaking positional readers. No silent renames.

## Re-run convention

Re-run on: a CAC update (a measure-results snapshot lands), a budget change (±20% per the trigger), a new channel selection from `plan-campaign`, or a fired reallocation trigger. Default behavior overwrites the same `(date, slug)`; pass version preservation to keep history as `[date]-[slug].v[N].md`.
