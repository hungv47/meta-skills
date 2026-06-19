# Procedure — Pre-Dispatch (market-research)

> Load when SKILL.md routes to Pre-Dispatch. Encodes the 5-question Cold Start prompt, the Warm Start summary, the Step 0 product-context check, the Step 1 Scope Interview, the Write-back map (preserved verbatim from original SKILL.md), and the route-selection conditions. Canonical Pre-Dispatch spec lives in [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) — this file is the market-research-specific overlay.

---

## Read order (in order)

1. **Pipeline (preferred):** `id:product-context` for product signal (category, differentiator, pricing model, target segment) — informs competitor selection, positioning axes, gap identification. `id:diagnose` for known root-cause focus — narrows market scan to relevant dimensions.
2. **Experience (read, don't ask):** `docs/forsvn/experience/product.md` (category if persisted), `docs/forsvn/experience/business.md` (geo + horizon + known competitors if persisted), `docs/forsvn/experience/audience.md` (B2B/B2C if persisted).
3. **Pipeline (optional, re-run case):** prior `id:market-research` at `docs/forsvn/canonical/research/MARKET.md` — carries prior landscape + opportunities as context for the new run; the new run still re-scans (don't recycle stale market data per Critical Gate 1).

After read + scan, present findings and ask only about the gaps.

---

## Warm Start (product + B2B/B2C inferable, decision focus clear)

Emit a confirmation prompt that summarizes what was read + asks only about uncovered gaps:

```
Found:
- product → "[1-line from product-context.md]"
- B2B/B2C → "[from audience.md]"

Need before dispatching: category/niche, geo+horizon, why-now, known competitors?
```

The Warm Start prompt is short — product + B2B/B2C are pre-filled from upstream. The four open questions almost always need explicit answers because they're stake-specific (a Series A scan and a quick crowded-space check use the same upstream but very different scopes).

---

## Cold Start (no upstream context — default for greenfield)

Emit one bundled prompt with 5 numbered questions:

```
market-research analyzes the landscape, competitors, sizing (TAM/SAM/SOM),
and whitespace. To target the scan:

1. **Category/niche** — one phrase (e.g., "async project management for engineering teams").
2. **Geo + time horizon** — US / EU / global; current state / forward-looking 12-24 months.
3. **Why now** — what decision does this need to inform? (Market entry, fundraising, pivot, positioning, etc.)
4. **Known competitors** — name 3-5, OR say "find them" if you want me to discover.
5. **B2B/B2C** — affects sizing methodology and consumer-landscape weighting.

Answer 1-5 in one response. I'll dispatch.
```

If the user answers without enough scope (e.g., "research tech" with no category narrowing), return `BLOCKED` per Completion Status — category undefined or too broad to size. Don't dispatch on Wikipedia-level scope.

---

## Cold Start STILL fires under `--fast`

Cold Start is a safety floor for market-research. Under `--fast`:

- Routing collapses to Route A (Quick Validation): skip sizing-agent + opportunity-agent; consumer-landscape-agent optional.
- Critic gate collapses to single pass (no max-2 rewrite loop).
- BUT the 5-question Cold Start STILL fires when context is missing. `--fast` does not authorize scoping a market with no specified category — Critical Gates 1-4 (recency, methodology, adjacent coverage, no-training-data-trust) all require minimum scope to operate.

This matches the canonical mode-resolver contract: `--fast` skips orchestration weight, not the correctness floor.

---

## Step 0 — Product Context Check

Check for `id:product-context` (`find-artifacts --resolve product-context`). If missing: **strongly recommend** running `research-icp` first to create it. Skill works without it, but quality improves significantly. If user declines, interview for category, target market, and differentiator at minimum.

**If product-context.md exists**, extract before dispatch:

- **Product category** → which competitors and features to research
- **Differentiator** → positioning map axes and gap identification anchors
- **Pricing model** → pricing comparison dimensions
- **Target segment** → filters direct vs. adjacent competitors

This is a `consumes` not `requires` relationship per the frontmatter routing block — market-research can produce useful output without product-context.md, but the output is sharper with it.

---

## Step 1 — Scope Interview

For vague requests ("research this market", "who are the competitors"), interview for 5 dimensions:

1. **What market/industry?** — Name product category and adjacent. (Not "tech" — which segment?)
2. **Geographic scope?** — Global, regional, or specific countries?
3. **Timeframe?** — Current snapshot, or 2-3 year trajectory?
4. **Known competitors?** — Any starting points (not the full list).
5. **What decisions will this inform?** — Building / positioning / fundraising / pivoting? Determines scope and route.

All 5 answers required — without scope, research sprawls into a Wikipedia article. The 5-question structure overlaps with the Cold Start prompt above; in practice, Step 0 + Step 1 collapse into a single Cold Start exchange when both fire.

---

## Write-back map (preserved verbatim from original SKILL.md)

After Pre-Dispatch answers come in AND artifact ships PASS (or done_with_concerns), persist user-supplied dimensions per the canonical Pre-Dispatch protocol:

| Q | File | Key |
|---|---|---|
| 1. Category | `product.md` | `Product — category` |
| 2. Geo + horizon | `business.md` | `Business — geo + planning horizon` |
| 3. Why-now | `goals.md` | `Goals — market-research trigger` |
| 4. Competitors | `business.md` | `Business — known competitors` |
| 5. B2B/B2C | `audience.md` | `Audience — B2B or B2C` |

This write-back IS in the original SKILL.md (lines 131-139) and IS preserved here verbatim.

**No experience-mirror of the canonical record.** Unlike icp-research (which mirrors Q1 to `research/product-context.md` because icp-research IS the canonical producer of product-context), market-research's writes go to per-domain `experience/*.md` only. The cross-stack artifact is `docs/forsvn/canonical/research/MARKET.md` itself, produced by the dispatch arc — not by Pre-Dispatch write-back.

---

## Route Selection

Route is set by Q3 (why-now) classification:

| Q3 answer pattern | Route | Why |
|---|---|---|
| "Quick check", "is this space crowded", "who are the players" | **A — Quick Validation** | Light scope; skip sizing + opportunity-agent; consumer-landscape optional |
| Default — "position our product", "where do we fit", "competitive analysis" | **B — Product Positioning** | All 4 L1 agents parallel; full L2 sequence |
| "Series A research", "fundraising", "market entry", "investor analysis" | **C — Fundraising / Market Entry** | All 4 L1 agents at enhanced depth; sizing REQUIRED (not optional); opportunity-agent uses quantitative 1-5 scoring |
| `--fast` flag → forces **Route A** regardless | Route A | Mode-resolver downgrade |
| `--deep` flag → forces **Route C** regardless | Route C | Mode-resolver upgrade |

Echo the chosen route at the end of the Cold Start / Warm Start confirmation. Operator can override before dispatch.

---

## Staleness check on prior market-research

Original SKILL.md "Re-run triggers" (line 92): "New market entry, major competitor launch/pivot, fundraising, or quarterly for fast-moving categories." These are **operator-judgment** triggers — not automated emissions.

Do NOT auto-emit a "WARNING: prior MARKET.md is N days old" message on re-run. Operator decides when re-research is warranted; auto-emission would be net-new behavior. The only auto-flag is Critical Gate 1 (sources >18 months → flag as historical) — that's a per-source check during dispatch, not a per-artifact warning.

---

## Mode-resolver interaction

`metadata.budget: deep` → modal path is Route B (Product Positioning).

- `--fast` flag or "fast mode" phrasing → Route A (Quick Validation): skip sizing + opportunity-agent; consumer-landscape optional; critic gate collapses to single pass. Cold Start STILL fires when context is missing (safety floor — Critical Gates 1-4 require minimum scope).
- `--deep` flag or "thorough analysis" phrasing → Route C (Fundraising / Market Entry): all 4 L1 agents at enhanced depth; sizing required; quantitative 1-5 scoring for opportunities.
- Otherwise: Route B is default.

Echo the chosen route at the end of the Cold Start / Warm Start confirmation. Operator can override before dispatch.

---

## Anti-patterns in Pre-Dispatch

- **Dispatching with category undefined.** "Tech" or "SaaS" is too broad to size. Return `BLOCKED` per Completion Status; ask user for category narrowing.
- **Recycling prior `docs/forsvn/canonical/research/MARKET.md` without re-scan.** Prior data is context, not output. The new run re-fetches via WebSearch (Critical Gate 4 — never rely on training data).
- **Writing to product.md / business.md / goals.md / audience.md BEFORE the artifact ships.** Write-back happens after Layer 1 + Layer 2 dispatch completes AND critic PASSes (or done_with_concerns ships). Partial runs that BLOCK should not persist scope state.
- **Persisting Q3 (Why-now / trigger) as if it were stable user state.** Q3 is a per-invocation rationale, not a stable goal. Original SKILL.md writes it to goals.md as `Goals — market-research trigger` (a one-off trigger, not a recurring goal) — preserved verbatim. Don't elevate it to a recurring goal entry.
- **Auto-emitting staleness warnings on re-run.** Only Critical Gate 1 (>18-month sources) auto-flags. General re-run staleness is operator judgment.
- **Skipping the Step 0 product-context recommendation.** Even if the user declines, the recommendation should be made — downstream icp-research is the canonical producer, and the operator may not know skipping it costs downstream quality.

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter research_market
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
