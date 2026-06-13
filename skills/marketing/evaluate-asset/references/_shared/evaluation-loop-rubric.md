<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Evaluation-Loop Rubric — shared frame for the evaluate-* eval-loop critics
lifecycle: canonical
status: stable
load_class: PROCEDURE
consumers: evaluate-ad · evaluate-campaign · evaluate-content
provenance:
  extracted_from: the common frame of evaluate-{ad,campaign,content}/references/rubric.md
  extracted_at: 2026-05-21
  program: v2.0-launch — WS1 shared-reference extraction, cluster 2
---

# Evaluation-Loop Rubric — Shared Frame

<!-- lint:reference-ok per-skill instrument; each eval skill owns its own references/rubric.md -->
**The common contract behind every eval-loop critic rubric: the scoring scale, the pass gate, the five shared dimensions, the universal Hard Fails, the revision-trigger mechanism, and the falsifiability discipline. `evaluate-ad`, `evaluate-campaign`, and `evaluate-content` each own a `references/rubric.md` that scores 7 dimensions — 5 defined here, 2 domain-specific — and inherits this frame.**

> Why this is shared: the three eval-loop critics gate post-launch cycle artifacts before a `results.tsv` row is written. The *contract* — what a passing score is, what a Hard Fail is, what makes a score falsifiable — must be identical and must change in lockstep. The *band tables* are domain-specialized (audience-temp, channel-mix, engagement-quality) and revise independently per domain; they stay in each skill's `rubric.md`. This file is the frame; `rubric.md` is the domain instrument.

---

## 1. Scoring scale

Each dimension scores **0-10** on a 5-band table (`9-10` / `7-8` / `5-6` / `3-4` / `0-2`). A rubric has **7 dimensions** — the 5 shared dimensions in § 4 plus 2 domain-specific dimensions defined in each skill's `rubric.md` (positions 5 and 6). Aggregate is out of 70.

## 2. Pass gate

- **PASS** — aggregate ≥ 49/70 across the 7 dims AND every per-dim score ≥ 6.
- **PASS_WITH_CONCERNS** — aggregate 42-48 with all per-dim ≥ 6. Confidence + confounders must be surfaced in the artifact's Verdict block.
- **FAIL** — aggregate < 42, OR any per-dim score < 6, OR any Hard Fail triggered.

**The < 6 asymmetry:** a single per-dim score < 6 is a FAIL even if the aggregate is ≥ 49. The asymmetry catches contaminated-but-otherwise-passing cycles — a 4 on one discrimination dimension hidden under 8s everywhere else is a `keep` claim built on a contaminated signal.

## 3. Universal Hard Fails

A Hard Fail forces FAIL regardless of aggregate. These five fire identically for every eval-loop rubric; each `rubric.md` adds its own domain-specific Hard Fails:

- **HF-1 — No loop.** No `.forsvn/loops/[slug]/program.md`.
- **HF-2 — No measurement.** No current primary metric value, source, or measurement window.
- **HF-6 — Fabrication.** Any fabricated number.
- **HF-7 — Off-spec status.** Cycle/ledger status outside `{keep, discard, watch, blocked}`.
- **HF-8 — Untagged ledger.** Ledger description missing the cycle's scope tag (the skill's domain tag — audience-temp / campaign / primary-platform).

Hard Fail numbers are stable across the three rubrics — `#3` / `#4` / `#5` / `#11` / `#12` are reserved for domain-specific fails, which is why this universal list skips them.

## 4. The five shared dimensions

Every eval-loop `rubric.md` includes these five, in these positions, each with a domain-specialized 5-band table:

| # | Dimension | What it scores |
|---|-----------|----------------|
| 1 | **Loop Fit** | Does the artifact write inside an existing loop, evaluate the loop's declared surface, and stay scoped to the cycle's declared scope tag? Cycle number resolves from `last results.tsv cycle + 1`; no scope drift outside the loop boundary. |
| 2 | **Metric Integrity** | Is the primary metric — value, baseline, window, source, spend/reach, unit-comparability — explicit and falsifiable? No fabricated or unit-mismatched numbers. |
| 3 | **Attribution Honesty** | Are sample size, baseline comparability, guardrails, confounders, and attribution caveats stated without overclaiming? Does the confidence label match evidence quality? |
| 4 | **Decision Discipline** | Does the keep/discard/watch/blocked verdict follow the Recommendation Decision Rules — driven by the metric packet, not the diagnosis story? Is routing to the smallest correct next skill at the right granularity? |
| 7 | **Ledger Correctness** | Exactly one schema-compliant `results.tsv` row — 8 columns, valid status, a one-sentence tab-free description carrying the scope tag, artifact path relative to the loop folder? |

Positions 5 and 6 are the domain-specific dimensions (e.g. Audience-Temp Fidelity + Creative-Fatigue Awareness for `evaluate-ad`). Each skill's `rubric.md` carries the full 5-band table for all 7 dimensions — these five are the contract the band tables must implement.

## 5. Revision triggers

The rubrics are **provisional** and revise as cycles run. These two triggers are universal — revise a `rubric.md` when either fires:

- More than 3 consecutive cycle scores within 1 point of each other (rubric not discriminating).
- More than 3 operator overrides on the same dimension (rubric is wrong or out-of-date).

Each `rubric.md` adds domain-specific triggers (a platform deprecates a measurable signal; a new domain surface appears). **A mandatory revision pass after cycles 2-3 is required regardless of trigger state** — every v0.1 rubric is provisional. Three valid critic overrides on the same `skill:dimension` pair triggers rubric revision (the D8 contract).

## 6. Falsifiability discipline

A dim score is only valid if the evaluator can name **what evidence would have moved the score one band**. Each `rubric.md` carries a Falsifiability summary with per-dimension worked examples. The rule is universal: *if you can't name the next-band evidence, you're scoring vibes, not the rubric.*

## 7. Score-justification format

For each per-dim score in the Critic Verdict, include **one sentence of rationale tied to the artifact's actual content** (each `rubric.md` shows a worked per-skill example). A scoreless verdict — PASS without a per-dim breakdown — is itself a Hard Fail signal: the rubric exists to make the verdict falsifiable.
