# Scoring Rubrics

Shared scoring rules used by `pattern-extractor-agent`, `synthesis-agent`, and `critic-agent`. These rules apply to every research run and are NOT renegotiable per-topic.

---

## Sample-Size Flags

Every per-platform section must declare exactly one flag based on the scout's captured count `n`:

| Count | Flag | What it means downstream |
|---|---|---|
| n ≥ 8 | **OK** | Patterns claimed normally; brief skill uses freely |
| 3 ≤ n ≤ 7 | **LOW_SAMPLE** | Patterns claimed with directional caveat; brief skill warns producer |
| n < 3 | **INSUFFICIENT_DATA** | NO pattern claims; only "observed examples" listed; brief skill cannot use this section |

The flag carries through to:
- Frontmatter: `sample_size_per_platform[platform]: { n: <int>, flag: <FLAG> }`
- Section header: `### TikTok — SAMPLE: <FLAG> (n=<int>)`
- Open Risks section: every LOW_SAMPLE platform listed with explicit "treat as directional"

**Threshold rationale:** n=3 is the minimum for a "pattern" claim (a single archetype must appear ≥3 times in the sample to be named). n=8 is the threshold above which sample noise drops below ~20% (binomial back-of-envelope for 70/30 splits). Below n=3, "patterns" are anecdote.

---

## reference Rules

Every claim, number, and named pattern must uses a source. Critic rubric #1 enforces.

### What needs citing

- **Numerical claims:** "TikTok hook window 1-2s" → uses TikTok Creator Portal doc URL
- **Algorithm signals:** "platform leadership's Originality Score penalizes recycled clips" → uses platform leadership's Jan 2025 post URL
- **Pattern occurrences:** "credential flash 8/12 in sample" → uses at least one example URL of the archetype
- **Trending audio:** "[track name] trending on TikTok" → uses TikTok Creative Center URL or external corroboration
- **Sample observations:** "this niche caps at 30s" → uses 2-3 example entries from scout
- **Caption norms:** "captions average 80-150 chars in this sample" → uses 3 example captions

### What does NOT need citing

- Format facts that are unchanging across years (e.g., "TikTok aspect is 9:16") — these live in references and are cited indirectly via reference path
- Cross-platform comparisons that are sourced via `_comparison.md` reference

### reference format

Inline format: `(<short source name> — <last_updated date>, <URL>)`

Example: `"70% completion threshold (TikTok Creator Portal — Algorithm Updates, last_updated 2026-04-12, https://www.tiktok.com/business/creativecenter/...)"`

Pattern reference: at least one example URL from scout sample.

Example: `"Credential flash — 8/12 occurrences. Example: 'After 3 years of remote standups...' ([URL])"`

---

## Freshness Windows

| Window | Refresh | Warn | Source-doc enforcement |
|---|---|---|---|
| `platform_mechanics_date` | every 90d | warn at 180d | every cited mechanic must trace to a source-doc URL with verified `last_updated` within window |
| `trend_signals_date` | every 14d | warn at 30d | every trending-audio claim must uses source URL (TikTok Creative Center / external trend tracker) |

**Why these windows:**
- Mechanics: platforms ship algo updates roughly quarterly. 90d refresh keeps mechanics live; 180d is when cited docs become questionable.
- Trends: TikTok audio half-life is ~14 days. By 30 days post-peak, the audio is decaying for most niches.

**Frontmatter requirement:** `mechanics_sources_verified[]` lists every consulted source-doc with name, URL, and `last_updated` date. Critic rubric #4 fails if list is empty or any entry is stale beyond 180d.

---

## Pattern Threshold

A "pattern" requires ≥3 occurrences in the platform's scout sample. Below 3 → "directional, not pattern" — listed as observed examples without abstraction.

This applies to:
- Hook archetypes
- CTA placement patterns
- Caption norms
- Failure modes

**Why 3:** two examples are coincidence; three are the minimum for a claim. This is a craft heuristic — not statistical confidence — but downstream consumers (the brief skill) cannot act on n=2 noise without confusing themselves.

**Sample adequacy vs. confidence labeling.** The Sample-Size Flags and this Pattern Threshold are *sample-adequacy* gates — they decide whether a pattern may be claimed at all. Layered on top, each claimed pattern finding and each trending-audio call carries an H/M/L *confidence label* per [`_shared/confidence-labeling.md`](_shared/confidence-labeling.md) — the claim-level certainty tag (H/M/L by independent corroboration; any `L` resolved or flagged per its § 4). The two are orthogonal: a pattern can clear the n≥3 threshold yet still be `Confidence: M` if its occurrences are not independent (e.g. all from one creator's videos — see that file's § 3 on source independence).

---

## Platform Specificity Rule (Critic Rubric #3)

A recommendation in a Per-Platform Findings or Recommendations section must NOT be portable across platforms unchanged.

**Portability test:** if the bullet could be moved to a neighboring platform's section without editing it, it's generic and fails.

**Failing examples:**
- "Use captions" — applies everywhere
- "Strong hooks matter"
- "Keep it short"

**Passing examples:**
- "TikTok: open with credential-flash archetype in 0–1.5s — 8/12 in sample"
- "Reels: forbid TikTok watermarks (platform leadership's Originality Score Jan 2025); use original audio over trending"
- "Shorts: end on loop-friendly final frame to maximize loop rate signal"

Critic rubric #3 reviews each Recommendations block for portable bullets. ≥3 portable bullets in any block → FAIL.

---

## Loop Cap

Critic loops max at **2 cycles**. After cycle 2 with any remaining FAIL, the artifact ships as `done_with_concerns` with the failed rubrics' evidence pinned at the top of the artifact.

This is a cost-discipline rule. Three cycles compounds research-spend with diminishing returns.
