<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Usage Metering — demand-curve instrumentation (best-effort, inert)

> The pre-generation instrumentation step for the **expensive ops** — the deep web research, AEO/rank monitoring, competitor scraping, and panel-judge evaluations that would become the credit-metered hosted SKUs (`pricing.md`). It fires a best-effort `meter()` call so demand for each op is **measurable before any billing exists** — credit prices get set on real demand curves, not guesses (decision D-11). Cite this file from the op's pre-dispatch; the soft-client contract lives in `hosted-pack-client.md` and the function in `bin/lib/hosted-api.ts`.

## Why this exists (D-11)

Almost nothing expensive is hosted today, and `meter()` shipped with **zero live call sites**. Wiring the meter into the expensive ops *now* — inert, ahead of any paywall — lets the demand curve accumulate so the future credit prices are evidence-based. This is **instrumentation, not billing**: nothing is gated, and the same open-core invariant as the metrics feed applies.

## The open-core invariant (D-2) — non-negotiable

A meter call NEVER sits on a skill's execution path:

- **No hosted key → no-op.** `meter()` returns `null` immediately — no network, no nag, no local write. Forking the Markdown yields a client that simply always no-ops.
- **Unreachable / API error → swallowed.** Wrapped to return `null`; it never throws and **never blocks, delays, or gates the run**.
- **Pure instrumentation.** It records nothing locally, changes no artifact, and never appears in the scored output. Removing it would change behavior in exactly one way: the hosted demand curve stops accumulating.

The check is the *absence* of a key, not a gate. You cannot meter-gate a skill — that breaks the funnel (D-2).

## The step

**Once per run**, at the start of the expensive work — after Cold Start resolves the inputs, before the parallel research / eval agents dispatch — the **orchestrator** (not each sub-agent) fires:

```bash
bun scripts/forsvn-hosted.ts meter <action>          # one logical run of the op
bun scripts/forsvn-hosted.ts meter <action> --units N  # optional: N = op intensity
```

- **Exactly once per invocation.** A multi-agent skill fires it from the dispatcher, not inside each fanned-out agent — one run = one demand event.
- **`<action>` is per-skill** (table below) so the demand curve is readable per op.
- **`--units` is optional.** Omit it for a plain one-run count; pass an intensity (e.g. providers probed, competitors scanned) when the op's cost scales and you want a weighted curve. Non-finite / negative units are dropped client-side, never POSTed.
- Best-effort: do not read, branch on, or surface the result. Fire and continue.

## Per-skill action names

The action is the skill name with hyphens → underscores. One action per metered op so each maps to a future SKU's demand curve.

| Skill | Action | Op class (future SKU) |
|---|---|---|
| `research-icp` | `research_icp` | deep research |
| `research-market` | `research_market` | deep research + competitor scraping¹ |
| `research-platform` | `research_platform` | deep research |
| `research-shortform` | `research_shortform` | deep research |
| `monitor-aeo` | `monitor_aeo` | AEO / rank monitoring |
| `evaluate-ad` | `evaluate_ad` | panel-judge eval |
| `evaluate-asset` | `evaluate_asset` | panel-judge eval |
| `evaluate-campaign` | `evaluate_campaign` | panel-judge eval |
| `evaluate-content` | `evaluate_content` | panel-judge eval |
| `evaluate-landing-page` | `evaluate_landing_page` | panel-judge eval |
| `evaluate-outreach` | `evaluate_outreach` | panel-judge eval |
| `evaluate-seo` | `evaluate_seo` | panel-judge eval |
| `evaluate-shortform` | `evaluate_shortform` | panel-judge eval |

¹ Competitor scraping is a sub-step of `research-market` today, not a standalone op — so it rides `research_market` rather than a separate `competitor_scrape` action. Split it out only when a dedicated scrape op is hosted (then add the action here + a second meter call in that op).

## Rules

- **Never gate, never block, never nag.** Repeat of the invariant because it is the one way this can go wrong: the meter is fire-and-forget. If you find yourself reading its return value to change behavior, stop — that is a billing gate, which is forbidden until G3 (`roadmap.md`).
- **Don't double-fire.** One call per run. Sub-agents and revision cycles do not re-meter.
- **Don't invent actions.** Use the table. A new metered op adds a row here and a new action — it does not reuse another skill's.
- **No local trace.** Unlike the performance store (`performance-data.md`) and the metrics feed (`postMetrics`), the meter writes nothing locally — it is purely the hosted demand signal.

Function + soft-client shape: `bin/lib/hosted-api.ts` (`meter`). CLI verb: `bin/forsvn-hosted.ts meter`. Pricing model the curves feed: `pricing.md`. The gate that unlocks real billing: G3 in `roadmap.md`.
