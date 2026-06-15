# Live-SERP Remediation Loop

> Load when AI-SEO or Full mode is acting on a fresh SERP/entity/content benchmark report (the operator's tool of choice; this reference is vendor-agnostic). Pair with `references/retrieval-layer-seo.md` for the strategy framework and `references/_shared/evidence-classes.md` for evidence tagging.

The remediation loop turns a SERP/entity benchmark into page-level edits that **the model can verify moved the needle**, while protecting human-written content quality. It is **not** a content-rewriter; it is an audit-trailed targeting protocol that names what to edit, what to leave alone, and when to stop.

---

## Vendor-agnosticism

A benchmark report ("you cover 12 of 47 expected entities for query X; competitor A covers 38") is **evidence input**, not a vendor dependency. The loop treats any report that produces:

- a target query (with persona, geo, language scope)
- a list of entities / topics / source signals competitors cover
- per-page coverage scoring (yours vs theirs)
- optional content-quality / readability scoring

…as a valid input. The loop never assumes a particular vendor's UI, API, or proprietary score. **Recommendations never optimize toward a vendor score as the goal** — the goal is observed retrieval/citation behavior change (per `retrieval-layer-seo.md` § Audit output schema → Expected citation behavior).

If the only available benchmark report is qualitative ("competitor seems to cover X better"), the loop runs but every cell in the manifest carries `evidence-class: single-run` or `practitioner-inference` per `references/_shared/evidence-classes.md` — and the critic flags any P1 recommendation built on those tags.

---

## The six-step loop

```
┌──────────────────────────────────────────────┐
│ 1. Baseline scan                             │
│    capture report + handoff evidence as input│
├──────────────────────────────────────────────┤
│ 2. Classify gaps                             │
│    coverage gap / entity gap / structure gap │
├──────────────────────────────────────────────┤
│ 3. Light section-level recommendations       │
│    sentence edits + 1-2 entity adds          │
├──────────────────────────────────────────────┤
│ 4. Apply (operator) — append-only            │
│    no rewrites; preserve voice + structure   │
├──────────────────────────────────────────────┤
│ 5. Verify with rescan                        │
│    delta against baseline, same report shape │
├──────────────────────────────────────────────┤
│ 6. Stop after one tuning pass                │
│    if score still lags → report the blocker  │
└──────────────────────────────────────────────┘
```

### Step 1 — Baseline scan

Capture the input report and any handoff evidence (e.g., `monitor-aeo`'s `handoff-optimize-seo.md`). Record:

- **Source name** (the tool / report type), version or date stamp, access date
- **Query × persona × geo × language** scope
- **Coverage score (yours)** with the report's units (entities present / expected, percent, rank — record the report's native units; don't translate)
- **Coverage score (top 2-3 competitors)** for delta calibration
- **Page URL(s)** the report identifies as your best-positioned candidates
- **Evidence class** per `references/_shared/evidence-classes.md` — typically `observed-test` for a report you ran, `single-run` if you only have one snapshot, `unavailable` for cells the report didn't cover

Record the baseline in the manifest (§ Manifest Spec below) before any edit. The baseline is the verification anchor — without it, Step 5 has nothing to delta against.

### Step 2 — Classify gaps

Sort report findings into three categories. The category drives the edit pattern in Step 3.

| Gap type | What it means | Edit pattern |
|---|---|---|
| **Coverage gap** | Expected topic/subtopic missing from the page entirely | Add a new H3 sub-anchor with a 40-60 word answer block (per `retrieval-layer-seo.md` § 1-2) |
| **Entity gap** | Expected named entity missing or under-covered (a tool, framework, person, place, standard) | Add a sentence-level mention with natural prose context + cited source; never a list-stuffed paragraph |
| **Structure gap** | Topic is present but buried in long prose, missing H-anchor, or not extractable | Restructure: extract the buried answer into a 40-60 word block under a new or existing H2/H3; preserve the original prose elsewhere on the page when it adds depth |

Findings that don't fit any of the three are flagged for human review — not turned into edits. Common non-fits: "improve readability" (a critic-FAIL hedge unless paired with a specific structural change), "increase authority" (not actionable as a page edit), "match competitor tone" (out of scope for retrieval-layer work).

### Step 3 — Light section-level recommendations

Recommendations are **sentence-level** and **section-bounded**. Whole-page rewrites are forbidden — they destroy the brand voice and the operator's prior content investment, and they create a regression risk the report can't catch.

**Edit budget per page per loop:**

- Up to 3 new H3 sub-anchors (each with a 40-60 word answer block)
- Up to 5 sentence-level entity additions
- Up to 2 structure extractions (move a buried answer into its own block)
- 0 paragraph rewrites — if a paragraph needs rewriting, that's a separate `write-copy` request, not a remediation edit
- 0 deletions of human-written content — the loop is append-only

Recommendations carry the same per-finding fields as retrieval-layer findings (Query / Target page / Extraction unit / Source/corroboration gap / Exact rewrite location / Measurement query / Expected citation behavior / Evidence class) — see `retrieval-layer-seo.md` § Audit output schema.

**Contextual internal links** are added only when they meet all three rules:

1. The source page is topically relevant to the target (not a forced footer link)
2. The anchor text is descriptive and varied (not keyword-exact-match on every page)
3. The link sits in the main content (not in a sidebar / footer / related-posts block); main-content links are what retrieval and ranking weight

**Entity/related-term additions** are added only when natural in prose. Stuffing a list of 30 entities at the bottom of a page fails the loop — that's vendor-score-chasing, not retrieval-grade content. If a natural prose addition isn't possible, the entity gap stays open and the loop stops at that finding (Step 6).

### Step 4 — Apply

The operator (or a downstream `write-copy` invocation) applies the edits. The remediation skill does not edit the page itself. The manifest records what was applied vs skipped vs deferred.

### Step 5 — Verify with rescan

Re-run the **same report shape** against the same query × persona × geo × language scope. Capture the delta:

| Per-finding delta field | Source |
|---|---|
| Coverage score delta | Rescan - baseline; report's native units |
| Per-entity delta | Each entity from Step 2 — added / unchanged / still-missing |
| Per-section structural delta | Each H3/structural extraction from Step 3 — present in report's structural scoring (if the report has one) |
| Retrieval/citation delta | Re-run the Measurement query for each finding (the AI-surface query, not the report) — citation present / absent / changed |
| Evidence class | Re-tag every cell per `references/_shared/evidence-classes.md` based on the rescan inputs |

The rescan delta is the loop's only honest output. If the report rescored higher but the AI-surface measurement query shows no citation change, that's a Strategy Question — record it; don't claim victory.

### Step 6 — Stop after one tuning pass

If the rescan shows the coverage score still lags competitors meaningfully, the loop runs **one** additional tuning pass with tighter edits, then stops. Three reasons stopping is the right move:

1. **More edits past one tuning pass risks unnatural content.** The page starts reading like a vendor-score-chasing artifact, which retrieval scorers de-weight and human readers bounce from.
2. **The remaining gap is usually a structural/authority issue** (the competitor has 200 backlinks to that page from industry publications and you have 12), not a content gap. More content won't close that.
3. **Honest reporting beats forced edits.** A "blocker" entry naming the root cause (authority gap, third-party corroboration gap, retrieval surface gating) is more useful than a content edit that doesn't move the underlying metric.

When the loop stops with a remaining gap, the manifest's `final_state` field records the blocker explicitly: which page, which finding, what the rescan showed, what the recommended escalation is (`research-icp` for audience repositioning, `authority-agent` rerun for backlink strategy, `monitor-aeo` rerun for fresh measurement, etc.).

---

## Manifest spec — resumable + auditable

For multi-page or sitewide work, the loop produces a manifest. The manifest is the loop's audit trail and resume token.

**Path:** `docs/forsvn/artifacts/marketing/seo-ai.serp-remediation-manifest.md` (alongside `seo-ai.md`); re-runs append a new manifest with version suffix.

**Manifest frontmatter:**

```yaml
---
skill: optimize-seo
mode: ai
subject: [domain or page-set slug]
report_source: [tool name + version + access date — vendor-agnostic; record what was used]
baseline_date: YYYY-MM-DD
verification_date: YYYY-MM-DD | null  # null until Step 5 ran
status: in-progress | done | blocked
evidence-classes: { observed-test: N, single-run: N, unavailable: N, practitioner-inference: N, hypothesis: N }
---
```

**Manifest body table (one row per page × finding):**

| Field | Notes |
|---|---|
| `order` | Stable integer for resume. Don't renumber on rerun. |
| `page_url` | The exact target URL |
| `gap_type` | `coverage` / `entity` / `structure` / `non-fit` (per Step 2) |
| `finding_summary` | One sentence; cites the report row that surfaced it |
| `edit_pattern` | The Step-3 pattern applied or planned (H3+block / entity sentence / structure extraction / link / skipped) |
| `links_added` | Anchor text + target URL when an internal link was added; else "—" |
| `applied_at` | ISO date when the edit landed; null if not yet applied |
| `status` | `pending` / `applied` / `skipped-non-natural` / `skipped-out-of-budget` / `deferred-to-write-copy` |
| `skipped_reason` | Free text when status is `skipped-*` or `deferred-*` |
| `baseline_score` | Coverage / entity score before the edit (report's native units) |
| `rescan_score` | Same field after Step 5; null until rescan ran |
| `retrieval_measurement_query` | The AI-surface query rerun in Step 5 (often the persona-prefixed `monitor-aeo` query, not the SERP report query) |
| `retrieval_delta` | `cited-now` / `still-not-cited` / `was-cited-now-not` / `inconclusive` / `not-rerun` |
| `evidence_class` | Per `references/_shared/evidence-classes.md` |

**Stable ordering rule:** rows are assigned `order` at first manifest write and **never renumbered**. Reruns append new rows with new `order` integers. This lets a partial loop resume from the last unapplied row without re-deriving state.

**Batch range:** when the loop runs over many pages, the manifest header records `batch_range: [start_order, end_order]` for the current run, so a sitewide loop can be operator-paused and resumed.

---

## When to use vs when to skip

Use the live-SERP remediation loop when:

- A SERP/entity benchmark report has been run (any tool — see vendor-agnosticism above)
- Pages identified are already retrieval-grade per `references/retrieval-layer-seo.md` (or one tuning pass away)
- The operator's content is human-written and worth preserving (no destructive rewrites)
- Auditability matters — the operator needs to see what changed, what was skipped, and why

Skip the loop and recommend an upstream skill instead when:

- No benchmark report exists → run the report (or `monitor-aeo` for AI-citation evidence) first
- The target pages are auto-generated programmatic content → recommend `programmatic-quality-agent`'s quality gates instead
- The brand voice is the actual problem ("our content reads like marketing fluff") → recommend `write-copy` or `humanmaxxing`, not the remediation loop
- The site has crawl/index blockers → recommend Route A (Technical Audit) first; remediation on uncrawlable pages is wasted work
- The operator wants to chase a vendor score as the success metric → reframe; the loop's success metric is observed retrieval/citation behavior change

---

## Anti-patterns

The two below extend the SEO-wide list in `references/anti-patterns.md`.

### A. Vendor-score chasing

Optimizing toward a proprietary score (the report's number) as if the score itself were the goal. The score is a proxy; the goal is observed retrieval/citation behavior change. A page that hit a 95/100 vendor score but lost AI Overview presence has gotten worse, not better.

**Test:** every Step-3 recommendation names the *Measurement query* (the AI-surface query) it expects to move, not just the report metric. A recommendation that names only the report metric is a critic FAIL.

### B. Sitewide loop without manifest

Running the loop across 50+ pages without a manifest. The operator loses track of what was edited, what was rescanned, what was skipped. Reruns become destructive — same edits applied twice, conflicting edits, stale baselines compared against fresh rescans.

**Test:** any loop that touches more than 3 pages must produce a manifest at the path above. Loops on ≤3 pages can inline the table in `seo-ai.md` directly, but only because the surface area is small enough to inspect in one pass.

---

## Cross-references

- `references/retrieval-layer-seo.md` — the strategy framework the loop is operationalizing; finding schema; provider-behavior caveats
- `references/_shared/evidence-classes.md` — every cell in the manifest carries a tag from this taxonomy
- `references/technical-crawler-checklist.md` — gate the loop must pass before running on any target page
- `references/playbook.md` — Routes B (AI SEO) and E (Full) trigger this loop when a benchmark report is supplied
- `agents/ai-structure-agent.md` — owns coverage and structure gaps
- `agents/ai-presence-agent.md` — owns entity / third-party corroboration gaps
- `agents/critic-agent.md` — enforces no-vendor-score-chasing, no-rewrite, manifest-required gates
