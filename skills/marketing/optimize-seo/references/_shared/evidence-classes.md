<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Evidence Classes — Tagging Contract

> Shared taxonomy. Consumers: `monitor-aeo` (measurement; only the first three classes are valid in outputs), `optimize-seo` (strategy; all five classes are valid, and every claim about retrieval/citation behavior carries one).
>
> The classes are *load-bearing*. Trend computation, critic gates, and cross-skill handoffs all decide what to count, weight, or escalate based on the tag. Don't drop the tag because "the source is obvious."

---

## The five classes

| Class | When to use | Confidence | Trend behavior |
|---|---|---|---|
| **public-doc** | Verifiable in a public, dated source: vendor docs, RFC, platform changelog, peer-reviewed paper, official help center. | Highest. Treat as a hard fact while the doc still says it. | Stable until the doc updates. Note doc version + access date. |
| **observed-test** | Operator-supplied export was ingested, OR the skill itself ran a test it can re-run (live `/llms.txt` fetch, multi-run citation matrix with n≥3, server access-log filter, DataForSEO/Sistrix dump, A/B-able crawl result). | High. The test is reproducible. | Comparable across snapshots when the same provider/model + query is stable. |
| **single-run** | n=1 observation. Binary outcome (cited / not cited / present / absent). One chat turn captured, one AI Overview check for one keyword × geo × date, one Bing Webmaster crawl record. | Low. Honest but uncalibrated. | Not directly trendable as a rate; only directional. Re-test before promoting to a claim. |
| **practitioner-inference** | An interpretation drawn from observed cells or industry pattern recognition: "OpenAI cites comparison pages more often than informational pages," "G2 reviews appear to drive Perplexity citations." Sourced from working experience, not from a public doc the agent can cite. | Medium when the inference holds across multiple observations; low when generalized from one. | Should be labeled as such and re-validated when the underlying behavior is reachable by `observed-test`. |
| **hypothesis** | A testable proposition about retrieval/citation behavior not backed by `public-doc` or `observed-test` yet. "If we ship `/llms.txt` with our top 10 docs, Claude citations should rise within 90 days." | None — this is a claim *to be measured*, not measured already. | Convert to `observed-test` after measurement, or retire if the test fails to materialize. |

---

## What's a valid `public-doc`?

- Vendor documentation pages with a stable URL (Google Search Central, OpenAI docs, Anthropic docs, Microsoft Bing Webmaster docs)
- A platform's public changelog or release notes
- A spec body's published spec (W3C, IETF, schema.org, llmstxt.org)
- Peer-reviewed research with a DOI
- A company's official help-center article (not a blog post about it)

What's NOT `public-doc`: a tweet from a vendor employee, a Reddit thread, a Search Engine Land summary of a vendor announcement (cite the underlying announcement instead), the SEO industry's collective understanding of how a black-box system works.

**Citation discipline:** record source URL + access date inline. The doc may change — your tag is true *as of access date*, not forever.

---

## What's a valid `observed-test`?

- An ingested JSON / CSV export from a provider's logs, API, or dashboard
- A multi-run citation matrix (n≥3) computed from that export
- A live-fetched response from a public URL the skill owns or can poll (e.g. `/llms.txt`, `/robots.txt`) at a known time
- A DataForSEO / Sistrix / rank-tracker dump of AI Overview presence
- A server access log filtered for known AI-referrer hosts
- A crawl tool's structured output (sitemap audit, schema validation, indexability check)

What's NOT `observed-test`: a screenshot the operator describes verbally without attaching, "I think Perplexity cited us last week," a search result the agent recalls from training, the output of a tool whose results can't be reconstructed if the run is questioned.

---

## What's a valid `single-run`?

- One chat turn against a provider, captured and exported
- One AI Overview check for a keyword × geo cell on a single date
- One Bing Webmaster crawl record (a single observation)
- One competitor SERP scrape for a single query × locale

`single-run` is honest evidence at low confidence. Tagged so that trend computation can distinguish stable-rate cells from one-shot observations, and so that downstream readers (operator + critic + the strategy skill consuming the handoff) know not to over-fit on it.

---

## When to use `practitioner-inference`

- A pattern that holds across multiple `observed-test` cells but the *causal claim* is the practitioner's, not the data's. Example: "Pages cited by Claude tend to have a 40-60 word lead paragraph" → the citation count is `observed-test`, the inference that the lead paragraph caused the citation is `practitioner-inference`.
- A judgment call about *why* a provider behaves a certain way, when the provider has not documented the why publicly.
- A heuristic carried over from years of practitioner work: "Comparison pages outperform informational pages in ChatGPT citations for SaaS categories."

This class is allowed in **strategy** outputs (optimize-seo recommendations), where the operator needs working hypotheses to act on. It is **not allowed in measurement** outputs (monitor-aeo snapshots), where every cell must be reproducible.

---

## When to use `hypothesis`

- A testable proposition the skill is *proposing*, not reporting. "If we add JSON-LD `FAQPage` schema to the top 20 docs, AI Overview citation rate should rise from 12% to 25% within 60 days."
- A claim about retrieval behavior the agent wants to verify in a follow-up loop.
- A bet the operator should consider running an experiment on.

`hypothesis` rows carry an explicit *measurement plan*: what would count as confirmation, what would count as refutation, the re-check window. A hypothesis without a measurement plan is just a guess and should not ship.

This class is allowed in **strategy** outputs. **Not allowed in measurement** outputs.

---

## When to use `unavailable`

> `unavailable` is a 6th *operational* label, not a 5th *evidence* class. It records why a cell is empty — kept here so consumers can interpret missing data without inventing it.

- Provider has no credentials and no export supplied
- Export covers Q1-Q10 but operator's query set is Q1-Q15 — Q11-Q15 cells on that provider are `unavailable`, not zero
- Analytics export covers 30 days but a snapshot of 90 days was requested — the missing 60 days are `unavailable`
- Public doc URL returned 404 / 403 / 5xx at the access attempt

`unavailable` cells are **excluded from trend computation entirely** — they neither count as "present at zero rate" nor as "rate held steady." The provider-readiness ledger (in `monitor-aeo`) or the equivalent input log (in `optimize-seo`) is the source of truth for what's `unavailable`. Reporting `unavailable` without a matching ledger entry is a critic FAIL.

---

## Stochastic-outcome confidence framing

AI-citation and AI-Overview outcomes are **stochastic**: the same query against the same provider/model returns different cites across turns. Evidence drawn from these surfaces is honest only when it states how many runs back it and how much they agreed. Two confidence registers, attached inline next to the metric:

| Register | When | Inline notation | Confidence |
|---|---|---|---|
| **Single-run observation** | n=1. One chat turn, one AI Overview check for one keyword × geo × date. Tagged `single-run` per the class table above. | `(single-run observation)` | Directional only. Never reported as a rate. Re-test before promoting to a claim. |
| **Multi-run aggregate** | n≥3 runs of the same query × provider/model, with the agreement rate computed across runs. Tagged `observed-test`. | `(n=5 runs, 80% agreement)` | A reproducible rate. Trendable across snapshots when the query × provider/model is stable. |

**Agreement rate** = the share of runs that returned the same binary outcome (cited / not cited) for that cell. `(n=5 runs, 80% agreement)` means 4 of 5 runs cited the subject. Report the agreement rate, not just the count — a 5-run cell at 100% agreement and one at 60% carry very different confidence even though both are `observed-test`.

Rules:
- A `single-run` cell **must** carry the `(single-run observation)` notation; reporting an n=1 binary as a bare percentage (`cited: 100%`) is a critic FAIL — it implies stable behavior the single run can't support.
- A multi-run cell **must** carry both `n=` and the agreement rate. `n=5` without an agreement rate hides whether the runs agreed.
- Promotion is explicit: a cell that was `single-run` in a prior snapshot and now has multi-run backing upgrades to `observed-test` and gains the `(n=, %)` notation — recorded as an `evidence_class_change` in the trend delta (see Tag stability below).

---

## Tagging discipline at cell vs row vs aggregate

- **Cell:** each table cell that holds a metric or claim carries its tag.
- **Row:** the row's overall evidence class is the **lowest-confidence cell** on the row. A row with a mix of `observed-test` and `unavailable` cells is `observed-test (partial)`; a row that mixes `observed-test` and `practitioner-inference` is `practitioner-inference` for the row's strongest interpretive claim.
- **Aggregate:** per-provider or per-mode summaries roll up the underlying rows' tags. Note multi-tag rollups explicitly ("18 observed-test rows + 2 single-run rows; practitioner-inference for the cross-provider pattern").
- **Frontmatter index:** when a skill's artifact contract requires an `evidence-classes` count, sum every cell-level tag across the report body (not row-level, not aggregate).

---

## Tag stability across reruns

If a cell was `single-run` in snapshot v1 and the operator now supplies a multi-run export for the same query × provider, snapshot v2's cell is `observed-test`. Trend computation handles the upgrade by noting `evidence_class_change: single-run → observed-test` in the trend delta.

A cell that was `observed-test` in v1 and `unavailable` in v2 (because the operator stopped exporting that provider) appears in trend as `dropped from monitoring v2 (provider unavailable)` — not as a citation-rate change.

A `hypothesis` from a prior `optimize-seo` recommendation that has since been tested becomes `observed-test` (if measured) or stays `hypothesis` (if the measurement window hasn't elapsed yet) — never silently disappears.

---

## Skill-specific application

### `monitor-aeo` (measurement)

Only **`public-doc`**, **`observed-test`**, **`single-run`**, and **`unavailable`** are valid in monitor outputs. The frontmatter `evidence-classes` index must report `practitioner-inference: 0` and `hypothesis: 0` — non-zero values indicate strategy creep into a measurement artifact, and trigger critic FAIL.

If a monitor agent finds itself wanting to label a cell `practitioner-inference`, the right move is to **omit the cell from the snapshot** and surface the interpretation as a Strategy Question in `handoff-optimize-seo.md` instead.

### `optimize-seo` (strategy)

All five classes are valid. Every claim about AI-retrieval behavior, source-class weighting, or expected impact carries a tag. The critic checks:

- No `single-run` cell is used as the sole basis for a P1 (Immediate) recommendation
- Every `practitioner-inference` row is paired with the `observed-test` evidence it pattern-matches against (or noted as "pattern recognition, no in-corpus observation" when none exists)
- Every `hypothesis` row carries a measurement plan
- No row is left untagged — an untagged claim is treated as `hypothesis` by default and demoted accordingly

Recommendations sourced from `monitor-aeo`'s `handoff-optimize-seo.md` arrive pre-tagged in the `public-doc` / `observed-test` / `single-run` / `unavailable` set; `optimize-seo` may upgrade them to `practitioner-inference` or `hypothesis` when synthesizing strategy across them, but the upgrade is explicit, not silent.
