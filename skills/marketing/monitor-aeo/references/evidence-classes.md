# Evidence Classes — Tagging Contract

> Every cell in every monitor-aeo output carries one of these tags. Trend computation, critic gates, and the `optimize-seo` handoff all depend on this taxonomy being applied consistently.

---

## The five classes

| Class | When to use | Trend behavior |
|---|---|---|
| **observed-test** | Operator-supplied export was ingested for this cell. Includes multi-run aggregates (n≥3). | Comparable across snapshots when same provider/model + same query stable |
| **single-run** | n=1 observation only. Binary outcome (cited / not cited / present / absent). | Not directly trendable as a rate; only directional |
| **unavailable** | No input was supplied for this cell. The provider-readiness ledger labeled this provider/source unavailable, OR an export covered some queries but not this one. | Excluded from trend computation entirely |
| **practitioner-inference** | An interpretation drawn from observed cells (e.g., "OpenAI cites comparison pages more often than informational pages"). Belongs in `optimize-seo`, not in a monitor snapshot. | Should not appear in monitor outputs |
| **hypothesis** | A claim about provider behavior not backed by observed or public-doc evidence. Belongs in `optimize-seo` strategy work as a testable proposition. | Should not appear in monitor outputs |

---

## What's a valid `observed-test`?

- An ingested JSON/CSV export from a provider's logs, API, or dashboard
- A multi-run citation matrix (n≥3) computed from that export
- A live-fetched response from a public URL the skill owns (e.g., `/llms.txt`, `/robots.txt`) at known time
- A DataForSEO / Sistrix / rank-tracker dump of AI Overview presence
- A server access log filtered for known AI-referrer hosts

What's NOT `observed-test`: a screenshot the operator describes verbally without attaching, a "I think Perplexity cited us last week", a search result the agent recalls from training.

---

## What's a valid `single-run`?

- One chat turn against a provider, captured and exported
- One AI Overview check for a keyword × geo cell on a single date
- One Bing Webmaster crawl record (a single observation)

`single-run` is honest evidence at low confidence. It's tagged so trend computation can distinguish stable-rate cells from one-shot observations.

---

## When to use `unavailable`

- Provider has no credentials and no export supplied
- Export covers Q1-Q10 but operator's query set is Q1-Q15 — Q11-Q15 cells on that provider are `unavailable`, not zero
- Analytics export covers 30 days but a snapshot of 90 days was requested — the missing 60 days are `unavailable`

The provider-readiness ledger is the source of truth for what's `unavailable`. Layer-1 monitors must consult it; reporting `unavailable` without a matching ledger entry is a critic FAIL (gate 1 — labeling without provenance).

---

## Why `practitioner-inference` and `hypothesis` should be 0 in monitor outputs

This is a **measurement** skill. Inference and hypothesis belong in the **strategy** skill (`optimize-seo`) that consumes the handoff. The 8-item critic gate (gate 7) requires the frontmatter evidence-class index to count `practitioner-inference: 0` and `hypothesis: 0` — non-zero values indicate strategy creep.

If an agent ever finds itself wanting to label a cell `practitioner-inference`, the right move is to NOT include that cell in the monitor snapshot, and to surface it as a Strategy Question in `handoff-optimize-seo.md` instead.

---

## Tagging discipline at cell vs row vs aggregate

- **Cell:** each table cell that holds a metric carries its tag (most rows have multiple tagged cells)
- **Row:** the row's overall evidence class is the lowest-confidence cell (a row with a mix of `observed-test` and `unavailable` cells is `observed-test (partial)`)
- **Aggregate:** per-provider summaries roll up the underlying rows' tags — note multi-tag rollups explicitly ("18 observed-test rows + 2 single-run rows")
- **Frontmatter index:** sums every cell-level tag across the report body (not row-level, not aggregate)

---

## Tag stability across reruns

If a cell was `single-run` in snapshot v1 and the operator now supplies a multi-run export for the same query × provider, snapshot v2's cell is `observed-test`. Trend computation handles the upgrade by noting `evidence_class_change: single-run → observed-test` in the trend delta.

A cell that was `observed-test` in v1 and `unavailable` in v2 (because the operator stopped exporting that provider) appears in trend as `dropped from monitoring v2 (provider unavailable)` — not as a citation-rate change.
