---
title: Plan-Budget — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: plan-budget
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** the orchestrator enters Pre-Dispatch (before Layer 1 allocator dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for plan-budget's needed dimensions. The defining move here is **classifying every CAC as sourced or unsourced** — that classification determines whether a channel gets a number-backed allocation or a hypothesis lane, and whether the whole run is even allocatable.

---

## Needed dimensions

- **Total budget** — the monthly dollar amount to allocate (a number).
- **Objective** — `acquisition | retention | mixed` (drives the marginal-return basis: new-logo CAC vs retained-revenue lift; `mixed` needs a pool ratio, default 70/30).
- **Time horizon** — the allocation period in months (longer horizons tolerate more learning-phase burn on hypothesis lanes).
- **Selected channel set** — the channels to allocate across (from `campaign-plan.md` or operator). plan-budget does NOT select channels; if the set is undecided, defer to `plan-campaign` first.
- **Per-channel CAC** — value + **source label** (`measure-results | operator-supplied | external-benchmark | unsourced`). The label is mandatory; a CAC with no label is treated as `unsourced`.
- **Per-channel LTV or payback ceiling** — value + source (pricing × margin × retention from research-icp/product-context). Never inflated to rescue a channel.
- **Per-channel current spend + saturation signal** (optional, sharpens the curve) — current monthly spend and any observed signal (rising CAC, falling delivery/impression share, frequency creep).
- **Constraints** (optional) — channels off-limits, a max-concentration cap (default 50%), min-viable floors if non-default.

## CAC sourcing classification (the load-bearing step)

For each selected channel, classify its CAC:

| Classification | Condition | Result |
|---|---|---|
| **Sourced** | measure-results row(s) in the decay window, OR an operator-supplied number with a stated basis, OR a cited external benchmark (labeled as a benchmark) | Allocation lane — gets a number-backed allocation |
| **Stale** | a measure-results CAC whose window ends >90 days before the run date | Usable only with a staleness flag; recommend a measure-results refresh |
| **Unsourced** | no row, no operator number, no cited benchmark | **Hypothesis lane** (capped test budget) — NEVER an invented number |

Set the run-level `cac_sourcing` field: `sourced` (all channels sourced), `mixed` (≥1 hypothesis lane), `hypothesis-only` (every channel unsourced → this run is a `NEEDS_CONTEXT`).

## Read order (warm-start scan)

1. **Pipeline artifacts:**
   - `docs/forsvn/artifacts/marketing/campaign-plan.md` → the selected channel set + per-channel `network` + the launch-channel pack §0 vetoes.
   - `.forsvn/performance/*.tsv` (via `references/_shared/performance-data.md` read contract) → the sourced CAC per channel + the `empty | sparse | sufficient` state per channel.
   - `research/icp-research.md` / `research/product-context.md` → LTV inputs + objective framing.
2. **Experience:** `docs/forsvn/experience/{business,product}.md` → persisted CACs / prior allocations.
3. **Conversation context:** a brief from an upstream skill (e.g. plan-campaign handing the selected channel set + budget tier).

Emit a warm-start summary naming what was found (budget, objective, channel set, which channels have sourced CACs) and what is still needed before dispatch.

## Cold Start — 7 questions (asked only for unresolved dimensions)

1. What is the total monthly budget to allocate?
2. What is the objective — acquisition, retention, or mixed? (If mixed, what split between acquisition and retention?)
3. Over what horizon — how many months is this allocation for?
4. Which channels are you allocating across? (If undecided → route to `plan-campaign` first.)
5. For each channel, what is your current CAC, and where does that number come from (your own measured data, an estimate, or an industry benchmark)?
6. What is the customer LTV (or your payback-period tolerance)?
7. Any constraints — channels you won't fund, a max % for any single channel, or minimum spends you must hit?

## Missing-Input Hard Blocks (5 conditions)

BLOCK and ask one question when:

1. **Total budget missing** — there is nothing to allocate.
2. **Objective missing** — the marginal-return basis is undefined (acquisition vs retention compute different returns).
3. **Time horizon missing** — learning-phase tolerance is undefined.
4. **Selected channel set missing** — this skill allocates across selected channels; an undecided set routes to `plan-campaign` first.
5. **Zero sourced CACs AND no measure-results history** — return `NEEDS_CONTEXT` (run ads + measure-results first, or supply labeled CACs). Do NOT fabricate a CAC to proceed — this is the Gate-1 hard ban.

A single unsourced channel among otherwise-sourced channels is NOT a hard block — it becomes a capped hypothesis lane and the run proceeds as `mixed`.

## `--fast` behavior

`--fast` collapses the allocator's curve-fit to a coarse three-band pass (below / at / past the saturation knee, no fine marginal-CAC interpolation) and skips the constraint-checker's second sweep after a clean first pass. **`--fast` does NOT skip:** Cold Start questions for unresolved dimensions, Critical Gates 1-5, the Missing-Input Hard Blocks, the CAC-fabrication ban, or the critic's 7-dim floor. Safety + integrity gates supersede `--fast`.

## Write-back

Newly supplied sourced CACs + the chosen allocation are appended to `docs/forsvn/experience/business.md` (a `Channel — CAC` key and a `Channel — last allocation` key) so the next run starts warmer. Unsourced CACs are NOT written back as facts — a hypothesis-lane CAC target is recorded as a hypothesis, not a measurement.
