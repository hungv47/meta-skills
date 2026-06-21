# Pre-Dispatch — Design Lifecycle

[PROCEDURE] — Cold Start questions, Missing-Input Hard Blocks, write-back map. Loaded at Pre-Dispatch entry.

## Needed dimensions

| Dimension | Required | If missing |
|-----------|----------|------------|
| **flow-type** | hard | BLOCK — ask: onboarding / activation / winback / churn-save? |
| **activation-metric** | hard | BLOCK — ask: what ONE measurable event means a user got value? |
| **entry-trigger** | hard | BLOCK — ask: what event starts the flow? |
| available product events | recommended | proceed; flag thin event inventory → `DONE_WITH_CONCERNS` |
| list-channel (email / push / in-app) | recommended | default email; note assumption |
| voice source (BRAND.md / tone notes) | recommended | proceed; flag thin voice → `DONE_WITH_CONCERNS` |
| activation baseline (current rate) | optional | measurement plan establishes it via holdout |

## Cold Start (when context is thin)

Ask up to 5, stopping as soon as the three hard dimensions resolve:

1. Which flow are we designing — onboarding, activation, winback, or churn-save?
2. What ONE measurable event means a user has gotten real value from the product? (the activation metric)
3. What product event or signup starts this flow? (entry trigger)
4. What events can your product actually fire? (so steps/branches trigger on real signals)
5. Where do these messages go — email, push, in-app? And is there a brand voice doc?

## Missing-Input Hard Blocks (never proceed)

1. **No flow-type** → ask. The four types are different flows.
2. **No activation metric** → ask. A flow with no metric is a broadcast, not a flow. If the product genuinely has no measurable value moment → `NEEDS_CONTEXT`, recommend product-context/research-icp first.
3. **No entry trigger** → ask. A flow with no start can't fire.
4. **Bought/non-consented list implied** → BLOCK. This skill targets owned, consented lists only. Not config-toggleable.

## Write-back map (experience layer)

On completion, persist to `docs/forsvn/experience/marketing/*.md` (append-only):
- `Lifecycle — activation metric` = the metric used (so future flows reuse it, don't re-ask).
- `Lifecycle — activation window` = the empirical window if established.
- `Lifecycle — available product events` = the event inventory (reused across flows).

## `--fast` behavior

Skips branch enumeration and the rewrite loop; folds the three production agents into one pass. **Does NOT skip** the three hard blocks (flow-type / activation-metric / entry-trigger) or the consent/PII gate.
