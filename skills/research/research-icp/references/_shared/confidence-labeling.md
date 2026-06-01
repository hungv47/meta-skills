<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Confidence Labeling — H/M/L epistemic tagging for research findings
lifecycle: canonical
status: stable
load_class: PROCEDURE
consumers: research-icp · research-market · research-shortform
provenance:
  extracted_from: skills/research/research-icp/references/confidence-and-bias.md § 1 (universal core)
  extracted_at: 2026-05-21
  program: v2.0-launch — WS1 shared-reference extraction, cluster 1
---

# Confidence Labeling

**One epistemic vocabulary for every research skill: tag each finding with how sure you are, scored by independent corroboration. Turns "here's what we found" into "here's what we found and how sure we are."**

> Why this is shared: research-icp, research-market, and research-shortform all produce findings that downstream skills act on. A claim backed by one anecdote and a claim backed by twenty independent sources read identically unless certainty is marked. This file is the canonical label, rubric, and discipline; each research skill applies it to its own artifact and calibrates the rubric to its evidence type — see § 7.

---

## 1. The confidence label

Every shippable finding carries an inline label at the end of its bullet:

```
[Confidence: <H | M | L> | sources: <N>]
```

`<N>` = the count of **independent sources** that triangulate the finding — not the count of quotes, ratings, data points, or mentions. Multiple quotes from one Reddit thread is N=1, not N=3.

A skill whose evidence basis is not source-count (e.g. market sizing, which triangulates estimation methods) may substitute the `sources:` token with its own basis token — but the `H | M | L` label and the discipline in § 4–§ 6 are constant across all research skills.

## 2. Scoring rubric (default)

| Label | Independent sources (N) | Source-type quality | Cross-source agreement |
|---|---|---|---|
| **High (H)** | ≥4 | Mix — ≥2 different source/platform types (e.g. Reddit + interview + G2) | All sources point the same direction; no material contradictions |
| **Medium (M)** | 2–3 | All from similar source types (e.g. all Reddit, all analyst reports) | Mostly aligned; minor differences in emphasis |
| **Low (L)** | 1 | Single thread / review / interview / report | Cannot be triangulated — single voice |

This is the **default** rubric. A skill MAY calibrate the thresholds to its evidence type — a market trend backed by two independent, methodologically-strong analyst reports can legitimately be High — but it must state the calibration in its own reference, and the three columns (count, source diversity, cross-source agreement) always apply. research-icp uses this default unchanged.

## 3. Source independence

Two sources are **independent** when they have different selection mechanisms:
- Different platforms — Reddit ≠ G2 ≠ podcast ≠ interview ≠ analyst report
- Different communities within a platform — r/SaaSMarketing ≠ r/Entrepreneur
- Different time periods, both fresh-collected

Two sources are **NOT independent** when:
- Same thread, multiple commenters
- Same review or report, multiple data points
- Same person posting across multiple platforms (echo)
- Same buying stage or same collection batch — a shared selection skew makes them effectively one source

**When in doubt, count down.** Independence is the load-bearing concept; over-counting destroys the rubric.

## 4. The L-resolution rule

A finding labeled `Confidence: L` is **not shippable as a finding.** Before the artifact ships, every L must be one of:

- **Promoted to M** — collect 1–2 more independent sources.
- **Flagged as a hypothesis** — moved to the artifact's Red Flags / Limitations section, explicitly labeled "single-source, needs validation."
- **Dropped** — removed from the artifact entirely.

Never ship an unresolved `L` presented as a finding.

## 5. Confidence summary

Each research artifact carries a one-line summary near its top:

```markdown
**Confidence Summary:** H findings: N | M findings: N | L findings: N (each L resolved or flagged)
```

Downstream skills weight findings by label — High drives primary strategy, Medium informs secondary work, Low stays flagged for validation cycles.

## 6. Anti-patterns

1. **Counting quotes as sources.** 3 quotes from one thread is N=1.
2. **Promoting L without resolution.** Every L is promoted, flagged as a hypothesis, or dropped — no silent shipping.
3. **Bare confidence labels.** "Confidence: Medium" with no reasoning is noise. State the basis: "M — top-down triangulation from 2 analyst reports, no bottom-up validation."
4. **Same-selection sources counted as independent.** 5 reviews from the same buying stage share one selection skew — effectively one source, not five.
5. **Conflating audience-concentration metrics with finding confidence.** "This channel has high audience density" measures *where the audience is*, not *how sure the finding is*. Keep them in different columns.

## 7. Per-skill application

Each research skill applies this label to its own artifact and keeps its domain-specific extensions:

- **research-icp** — labels every pain, bias, objection, trust/distrust signal, and emotional driver; uses the § 2 default rubric unchanged; adds the ≥5-independent-sources-per-persona floor and the Sample Bias section. See `confidence-and-bias.md` (the ICP application of this reference).
- **research-market** — labels findings in the Limitations & Confidence section and market trends, using the § 2 default for qualitative findings. Market *sizing* estimates use a separate top-down/bottom-up triangulation calibration — see `market-sizing-guide.md` — a distinct mechanism, not this source-count rubric.
- **research-shortform** — labels per-platform pattern findings and trending-audio freshness. The label is the *claim-level* certainty tag; the section-level Sample-Size Flags (OK / LOW_SAMPLE / INSUFFICIENT_DATA) and the rule-of-3 Pattern Threshold in `scoring-rubrics.md` are orthogonal *sample-adequacy* gates that govern whether a pattern may be claimed at all.
