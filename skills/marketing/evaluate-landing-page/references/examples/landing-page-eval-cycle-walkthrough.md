---
title: LP-Eval Cycle Walkthrough (section-level bottleneck → route to brief-landing-page)
lifecycle: canonical
status: stable
produced_by: evaluate-landing-page
load_class: EXAMPLE
---

# Worked Example — forsvn.com homepage, cycle 3

A condensed but faithful end-to-end run. All numbers are **illustrative synthetic data**, not real forsvn.com analytics — they exist only to show the shape of a complete cycle. The signature lens is on display: the verdict is decided by **conversion evidence**, and the diagnosis **isolates the bottleneck section** rather than rating aesthetics.

## 1. Operator invocation + inputs

```
/evaluate-landing-page forsvn-home-cro forsvn.com/ "2026-05-30 → 2026-06-12 (14d)"
```

Operator pastes the evidence packet (illustrative GA4 + Hotjar export):

- Primary metric (from `program.md`): **CTA click-through to /signup** = **3.1%** this window
- Baseline (cycle 2, `results.tsv`): **4.4%**
- Traffic: **9,840 sessions**, sources stable (62% organic, 24% direct, 14% X/LinkedIn)
- Guardrails: bounce 41% (warn ≥ 45%), median scroll depth 58%
- **Section-level drop-off (Hotjar scroll map):** hero 100% → "what it is" 81% → **"how it works" 79% → 38%** → pricing 22% → footer CTA 9%
- What changed: cycle 3 swapped the homepage hero from a static screenshot to the **word-by-word "real" reveal** animation (per `strategy/brief-landing-page-2026-05-28-hero-reveal.md`)

## 2. Pre-Dispatch (warm start)

Read order resolves cleanly:

```
Found:
- loop: .forsvn/loops/forsvn-home-cro/
- primary metric: CTA CTR to /signup (GA4)
- baseline/prior result: 4.4% (cycle 2, results.tsv)
- latest strategy artifact: strategy/brief-landing-page-2026-05-28-hero-reveal.md
- current evidence window: 2026-05-30 → 2026-06-12, GA4 + Hotjar
Proceeding to evaluate cycle 3.
```

`program.md` + `context.md` present → no NEEDS_CONTEXT. Primary metric value + source + window supplied → no BLOCKED. `results.tsv` is the standard 8-col schema → standard helper applies. Cycle number = last row (2) + 1 = **3**.

## 3. Multi-agent flow

**Layer 1 — parallel.**

*Metric Ingest* normalizes the packet:

```
## Metric Packet
- primary_metric: CTA CTR to /signup
- current_value: 3.1%
- baseline_value: 4.4%
- measurement_window: 2026-05-30 → 2026-06-12 (14d)
- source: GA4
- sample_or_traffic: 9,840 sessions
- attribution_confidence: medium
- comparability: comparable (same sources, same window length)
- guardrails:
  - bounce = 41% vs 44% — pass
  - median scroll depth = 58% vs 61% — warn
## Caveats
- Hotjar scroll map sampled at 30% of sessions; section drop-off is directional.
## Blockers
- none
```

*Diagnosis* (reads the same evidence independently) localizes the bottleneck to **one section**:

```
### Cycle Change
- changed_surface: homepage hero (static screenshot → word-by-word reveal)
- intended_hypothesis: a "real" animated reveal raises engagement → CTR
- affected_page_regions: hero + immediate fold
### Likely Drivers
1. The reveal added ~1.8s before the "how it works" section paints — evidence: the 79% → 38% scroll cliff sits exactly at "how it works", a 41pt drop with no comparable cliff in cycle 2.
2. CTR fell while bounce held — evidence: people stay, but fewer reach the section that earns the click.
### Confounders
- Scroll map is 30%-sampled; sources stable so traffic-mix is not the driver.
- No concurrent copy change below the fold (execution/ confirms hero-only).
### Signal Quality
- behavioral_support: strong (section cliff is unambiguous)
- causal_confidence: medium
```

**Layer 2 — Recommendation** turns packet + diagnosis into a decision. Primary metric **dropped** against a comparable baseline and the change is plausibly connected → `discard`. Routes the fix to `brief-landing-page` (it does **not** redesign here):

```
- status: discard
- confidence: medium
- decision_sentence: The hero reveal cut CTA CTR 1.3pt by pushing the "how it works" section below an attention cliff.
- next_route: brief-landing-page
```

**Layer 3 — Critic** scores the assembled artifact.

## 4. The produced eval artifact (in full)

Written to `.forsvn/loops/forsvn-home-cro/evals/2026-06-12-cycle-3.md`:

```markdown
---
skill: evaluate-landing-page
version: 1
date: 2026-06-12
status: done
summary: "forsvn.com/ cycle 3 landing-page evaluation"
purpose: "Post-launch evidence snapshot for a landing-page eval loop"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current landing-page cycle"
do_not_use_when: "Designing the next page revision without reading the latest loop context and results"
upstream: ".forsvn/loops/forsvn-home-cro/program.md, context.md, strategy/, execution/, GA4 + Hotjar export"
downstream: "results.tsv, learnings.md, lp-brief next-cycle brief"
---

# forsvn.com/ Cycle 3 Evaluation

## Verdict

- Status: discard
- Confidence: medium
- Primary metric: CTA CTR to /signup = 3.1% vs 4.4% baseline
- Decision: The hero reveal cut CTA CTR 1.3pt by pushing "how it works" below an attention cliff; revert/restage the animation.

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| CTA CTR to /signup | 3.1% | 4.4% | 2026-05-30→06-12 | GA4 | 9,840 sessions; comparable sources |
| Bounce rate | 41% | 44% | 2026-05-30→06-12 | GA4 | guardrail pass |
| Median scroll depth | 58% | 61% | 2026-05-30→06-12 | GA4 | guardrail warn |
| "how it works" scroll-through | 38% | 79% | 2026-05-30→06-12 | Hotjar | 30%-sampled; directional |

## What Changed This Cycle

- Hero swapped from static screenshot to word-by-word "real" reveal — `strategy/brief-landing-page-2026-05-28-hero-reveal.md`. Hero-only change; below-fold copy unchanged (`execution/`).

## Diagnosis

### Likely Drivers

- The reveal delays first paint of "how it works" by ~1.8s; the 79%→38% scroll cliff lands exactly on that section — a 41pt drop absent in cycle 2.
- CTR fell while bounce held: visitors stay but fewer reach the section that earns the click. The bottleneck is **section-level**, not page-wide.

### Confounders

- Hotjar scroll map sampled at 30% — section drop-off is directional, not exact.
- Traffic sources stable cycle-over-cycle; not a traffic-mix artifact. No concurrent below-fold change.

## Next Cycle Recommendation

- Keep: the warm forest-shadow `#0A120D` canvas + single Leaf `#74B36B` anchor word (brand-correct, not implicated).
- Discard: the blocking hero reveal in its current full-screen, paint-delaying form.
- Watch: median scroll depth (warn) — re-check next window.
- Route next work to: `brief-landing-page --rev=4` with hypothesis "deferring/shortening the reveal so 'how it works' paints in the first viewport restores the 79% scroll-through."

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
3	2026-06-12	evals/2026-06-12-cycle-3.md	CTA CTR to /signup	3.1%	4.4%	discard	Hero reveal pushed how-it-works below an attention cliff, cutting CTR 1.3pt.
```

## Learning Promotion

- Promote to `learnings.md`: no
- Lesson: —
- Expiry / caveat: Confidence is medium and the finding is page-specific (this hero, this fold); not durable enough to generalize.
```

## 5. The results.tsv row (exact column order)

`cycle → date → artifact → primary_metric → value → baseline → status → description`, appended via the validated helper:

```bash
bun scripts/append-loop-result.ts "forsvn-home-cro" \
  --artifact evals/2026-06-12-cycle-3.md \
  --metric "CTA CTR to /signup" --value "3.1%" --baseline "4.4%" \
  --status "discard" \
  --description "Hero reveal pushed how-it-works below an attention cliff, cutting CTR 1.3pt."
```

`status: discard` ∈ `keep|discard|watch|blocked`. Description is one sentence, no tabs.

## 6. Critic verdict (PASS) — with the domain gate checked

```markdown
## Critic Verdict

- verdict: PASS
- score: 52/60
- required_fixes:
  - none
- concerns:
  - Confidence is medium (scroll map 30%-sampled); surfaced in Verdict + Caveat. PASS, not PASS_WITH_CONCERNS, because the primary-metric drop is sourced, comparable, and unambiguous.
```

Dimension check (each ≥ 7): Loop Fit 9 (writes inside `forsvn-home-cro`, evaluates its surface) · Metric Integrity 9 (value/baseline/window/source/units explicit) · Attribution Honesty 8 (sample, comparability, sampling caveat stated, no overclaim) · Decision Discipline 9 (`discard` follows the metric drop, not the diagnosis story) · **Boundary Control 9 — the domain gate: the recommendation isolates the bottleneck section and routes the fix to `brief-landing-page`; it never specifies the replacement copy/layout.** · Ledger Correctness 8 (one valid row, no tabs, relative path). No Hard Fail tripped: real loop, real metric source-window, baseline present, evidence not a heuristic audit, no fabricated numbers, valid status, low-confidence learning correctly **not** promoted.

PASS → side effects fire in order: write artifact → append row → (no learning promotion — correctly gated) → `bun scripts/manifest-sync.ts`.

## 7. FAIL → fix variant

Suppose the first Recommendation pass had set `status: keep` arguing "bounce improved and the reveal looks premium." Critic FAILs:

```markdown
## Critic Verdict

- verdict: FAIL
- score: 38/60
- required_fixes:
  - Decision Discipline (4/10): primary metric DROPPED 4.4%→3.1%; `keep` contradicts the evidence rules. Bounce is a guardrail, not the primary metric.
  - Boundary Control (5/10): "looks premium" is an aesthetic claim, not conversion evidence.
- concerns:
  - none
```

Per the revision cycle, re-dispatch **recommendation-agent** (named in `required_fixes`) with the critic feedback appended. It corrects `keep → discard`, drops the aesthetic justification, and re-routes to `brief-landing-page`. The re-scored artifact is the one shown in §4 → PASS. (Had it FAILed again, the rule is BLOCKED: **no** ledger row, **no** learning promotion, **no** manifest sync — all-or-nothing.)

## 8. Completion status

**DONE** — eval artifact written, one `results.tsv` row appended, critic PASS (52/60), learning correctly not promoted. (Had the scroll map been the *only* evidence with no GA4 primary value, it would have been **DONE_WITH_CONCERNS** at best, or BLOCKED if the primary metric had no source/window at all.)

## What this example pins

- The **verdict is driven by conversion evidence** (CTR drop), never by how the page looks — a `keep` argued on "premium feel" is a Critic FAIL.
- Diagnosis **isolates the bottleneck section** ("how it works", 79%→38% cliff) instead of grading the whole page.
- The evaluator **routes the fix to `brief-landing-page`** and never writes the replacement design — Boundary Control is the domain gate.
- Low-confidence + page-specific lessons stay in the cycle artifact; they are **not** promoted to `learnings.md`.
