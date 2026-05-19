# Hypothesis Rubric — 3Q Scoring

> The 3Q rubric scores landing-page-redesign hypotheses on three axes: **Visual**, **Falsifiable**, **Uniquely Ours**. The hypothesis-agent uses this to score each candidate; the user uses it to choose at Approval Gate 1.
>
> **Why these three:** a hypothesis that can't be made visible can't be designed; one that can't be falsified can't be learned from; one that any competitor could make is a generic redesign, not a bet.

---

## The Three Questions

### Q1 — Visual (Y/N)

**Question:** Can the hypothesis be made visible in the design? Is there a concrete imagery or specific visual treatment it implies?

**Score Y if:** the hypothesis names something a designer can build — a layout pattern, an asset type, an interaction, a structural choice.
**Score N if:** the hypothesis is a feeling or intent without a visual implication.

**Examples:**
- ✅ "Receipt-style transparency: render pricing as a printed receipt with line-item breakdown" — Y. Receipt = visual.
- ✅ "Right-size proof leads: segment social proof by team size" — Y. Segmentation = visual structure.
- ❌ "Make the page convert better" — N. Not a visual.
- ❌ "More premium feel" — N. Aesthetic vibe; needs translation to visual choice (then re-score).

### Q2 — Falsifiable (Y/N)

**Question:** Can it be proven wrong? Is there a metric and a threshold that decides it?

**Score Y if:** the hypothesis names a metric, a target audience, a target threshold, and a timeframe — even approximately.
**Score N if:** the hypothesis can't be measured or could "win" by any interpretation.

**Examples:**
- ✅ "Engineering managers at small teams reject /pricing because of overkill perception; segmenting proof by team size lifts conversion ≥15% on small-team traffic in 4 weeks" — Y. Specific metric, audience, threshold, timeframe.
- ✅ "Buyers in audit-led industries trust line-item pricing; receipt hero lifts trust-stage MQLs ≥10% in 6 weeks" — Y.
- ❌ "Better hero will lift conversion" — N. No threshold, no audience.
- ❌ "Improve the page" — N.

### Q3 — Uniquely Ours (Y/N)

**Question:** Could a competitor make the same hypothesis? If yes, score N. The bet must be specific to *your* audience, *your* product, *your* sacred elements, *your* market position.

**Score Y if:** the hypothesis ties to specific audience signals, product capabilities, brand positioning, or market context that only you have.
**Score N if:** the hypothesis is generic — any SaaS could make it.

**Examples:**
- ✅ "Right-size proof leads — anchored to our segmented customer base across team-size cohorts (which competitors lack)" — Y if true; you have to actually have the segmented base.
- ✅ "Receipt-style transparency — anchored to our line-item billing engine (competitors use bundled pricing)" — Y if true.
- ❌ "Add an interactive calculator" — N. Every SaaS does this.
- ❌ "Brighter palette converts better" — N. Generic and not anchored.

---

## Scoring & Threshold

Each hypothesis gets one Y or N per question, totaled out of 3.

| Score | Verdict | Action |
|-------|---------|--------|
| 3/3 | Strong — recommend | Surface as primary candidate |
| 2/3 | Borderline — surface with caveat | Note which Q failed; user decides |
| ≤1/3 | Weak — do not surface | Replace with a better candidate |

**Bar:** all 3 candidates surfaced to the user must score ≥2/3. Aim for at least one to score 3/3.

If you can't generate 3 candidates that all score ≥2/3, re-anchor: pull more aggressively from evidence_digest, ICP objections, or VoC phrases. The signal is the constraint that produces strong hypotheses.

---

## Adversarial Anchor Check

Each hypothesis must trace to a specific source — audit finding, ICP objection, or VoC phrase. The Anchor Trace section of the hypothesis-agent output makes this explicit:

```
A → audit finding L42–48 (mobile fold issue)
B → ICP objection #2 ("is this overkill for small teams")
C → VoC phrase "I want to see the price before I talk to anyone"
```

If a hypothesis can't trace, it's a vibe. Score it 0 on Falsifiable (Q2) — vibes can't be measured — and don't surface it.

---

## Relationship to Copywriting's Hook 3Q

Copywriting's hook 3Q (defined in `copywriting hook-agent` and scored 1–5 in `copywriting critic-agent`) uses the **same three axes**: Visual / Falsifiable / Uniquely Ours. The reuse is deliberate — it's the same craft test applied at a different scale.

| Rubric | Unit of analysis | Output |
|--------|-----------------|--------|
| Copywriting hook 3Q | One line of copy (hook, headline, CTA, tagline, subject line) | 1–5 score per axis |
| lp-brief hypothesis 3Q | A page-level bet (the redesign claim) | Y/N per axis (0–3 total) |

Same axes; different units. The lp-brief 3Q is for choosing *which redesign to bet on*. The copywriting 3Q is for choosing *which line of copy lands the bet*.

If a brief's hypothesis implies a specific hook (e.g., "receipt-style transparency" implies a hero hook), the hook itself gets the line-level 3Q (1–5 scoring) AND the 4-U formula (CP-01) at the section-spec layer. Separate gate, separate scoring; same axes show up at both scales.

If you find yourself re-scoring the same line under both rubrics, you're confused — the hypothesis 3Q never scores a copy line, and the hook 3Q never scores a page-bet.

---

## Worked Examples

### Strong: 3/3

**Title:** Right-size proof leads
**Claim:** Engineering managers at 5–50 person teams reject /pricing because the proof set features only enterprise logos. Segmenting proof by team size (small / mid / enterprise) lifts conversion ≥15% on small-team traffic in 4 weeks.
**Visual (Y):** Three-column proof segmentation by team size; each column has its own logo set, testimonial, and case study.
**Falsifiable (Y):** ≥15% lift on small-team-source conversion in 4 weeks. Below 8% = abandon.
**Uniquely ours (Y):** Anchored to our segmented customer base (we have small/mid/enterprise breakdowns; competitors mostly enterprise-only).
**Score:** 3/3 → recommend.

### Borderline: 2/3

**Title:** Calculator-led conversion
**Claim:** Adding an interactive cost calculator above the fold lifts conversion by giving analytical buyers a self-serve qualification step.
**Visual (Y):** Calculator UI above fold.
**Falsifiable (Y):** Define metric + threshold (15% lift in 6 weeks).
**Uniquely ours (N):** Every SaaS adds calculators. Unless we have unique data behind it, this is generic.
**Score:** 2/3 → surface with caveat ("calculator is generic; what makes ours different?").

### Weak: 1/3

**Title:** More premium feel
**Claim:** A more premium-feeling page will convert higher.
**Visual (N):** "Premium feel" is a vibe; no visual implication.
**Falsifiable (N):** No metric, no threshold, no audience.
**Uniquely ours (Y if anchored to brand, N if generic):** Without anchor, generic.
**Score:** 0–1/3 → do not surface.

---

## Anti-Patterns

- **Inflated 3/3 across all three** — implausible if you're scoring honestly. Most candidates land 2–3/3; one might be 3/3.
- **Scoring N on Visual when the hypothesis is structural** — segmentation, sequencing, hierarchy are visual. Score Y.
- **Scoring Y on Uniquely Ours without naming the anchor** — you must name what specifically you have that competitors don't.
- **Skipping Anchor Trace** — the trace is mandatory. A hypothesis without a trace is vibe-hypothesis.
- **Generating 3 hypotheses that vary only by hero-color** — that's one hypothesis with variations. Force lead message + conversion mechanism + architecture to vary.
