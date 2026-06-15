---
title: Confidence Labels, Sample Bias, and the ≥5 Rule — research-icp rigor protocol
lifecycle: canonical
status: stable
produced_by: research-icp
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/03-capability-upgrades.md § Research Rigor + sources/IDEA-5.md § 4 (Customer Research)
  extracted_at: 2026-05-19
consumers: research-icp SKILL.md + critic-agent (gates 8/9/10) + voc-collector-agent + synthesis-agent
load_class: PROCEDURE
---

# ICP Research Rigor Protocol

**Three guards that turn research from "here's what we found" into "here's what we found and how sure we are." Confidence labels, sample-bias acknowledgment, and the ≥5-sources floor. Applied at synthesis; enforced at critic gates 8/9/10.**

> Why this exists: research-icp feeds 13+ downstream skills. Without epistemic rigor on the source artifact, every downstream skill inherits the same unmarked assumptions. A persona with one anecdotal quote and a persona with twenty independent sources read identically to consumers. Confidence labels + bias acknowledgment + sample floor make the difference visible.
>
> Companion to [`references/habitat-mapping.md`](habitat-mapping.md) (Digital Watering Hole methodology, channel-density scoring). Channel density measures audience concentration in a channel; finding confidence measures epistemic certainty of a claim. **Orthogonal — do not conflate.**

---

## 1. Confidence labels — every finding tagged

The label, scoring rubric, source-independence rules, and the L-resolution rule are canonical in [`references/_shared/confidence-labeling.md`](_shared/confidence-labeling.md) [PROCEDURE]. research-icp uses that default rubric **unchanged** — this section is the ICP-specific application.

### What gets a confidence label

Apply inline to each:
- Pain in Pain Profile
- Key bias in Decision Psychology
- Objection in Decision Psychology
- Trust signal + distrust trigger
- Each of the Top 3 Emotional Drivers

Format (inline at end of finding bullet):

```
[Confidence: <H | M | L> | sources: <N>]
```

`<N>` is the count of **independent sources** that triangulate the finding — not the count of quotes. The H/M/L scoring rubric and the source-independence rules (what counts as an independent source, what does not) are canonical in [`references/_shared/confidence-labeling.md`](_shared/confidence-labeling.md) § 2–§ 3; research-icp uses them unchanged. Load-bearing here: multiple quotes from one Reddit thread is N=1, not N=3.

### Resolving Low-confidence findings

Per [`references/_shared/confidence-labeling.md`](_shared/confidence-labeling.md) § 4, a finding labeled `Confidence: L` MUST be promoted to M (collect 1-2 more independent sources), moved to the Red Flags section as an explicit hypothesis, or dropped from the artifact — never shipped as a finding. In ICP research a flagged hypothesis reads: "Persona 1 may dismiss social proof — single-source, needs validation."

### Confidence summary at artifact top

Insert at top of `docs/forsvn/canonical/research/ICP.md`, immediately after the H1:

```markdown
**Confidence Summary:** H findings: N | M findings: N | L findings: N (each L resolved or dropped — see Red Flags)
```

Downstream skills (campaign-plan, copywriting, lp-brief, ad-copy) should weight findings by confidence — High findings drive primary strategy, Medium findings inform secondary work, Low findings stay flagged for validation cycles.

---

## 2. Sample-bias section — name your skews

### Why

Every source type has structural skews. Surfacing them upstream prevents downstream skills from compounding bias unknowingly.

| Source type | Known skew | Cost of ignoring |
|---|---|---|
| Online reviews (G2, App Store) | **Power-user skew + extreme-experience skew** — happy customers and angry customers post; quiet middle stays silent | Persona reads as polarized; mid-segment ignored |
| Support tickets / churn surveys | **Problem skew** — only people who had problems wrote in | Pain Profile over-weights pain; missed validation of what works |
| Reddit / HN / forums | **Technical skew + young-male skew + opinionated skew** — over-represents technical audiences and people who like to comment | B2B technical personas over-fit; non-technical roles + non-male roles under-fit |
| LinkedIn posts | **Self-promotion skew + corporate-voice skew** — what people say publicly ≠ what they think | Pain language sanitized; real objections invisible |
| Interviews (founder-led) | **Selection skew + recency skew + social-desirability skew** — founder picks who to talk to; recent customers easier to recall; people don't tell you they hate you | Anti-persona invisible; weak signals amplified |
| Sales-call transcripts | **Pre-purchase skew** — captures buyers, not non-buyers; objections shown ≠ objections held | Decision Psychology biased toward what got through |
| Self-collected user surveys | **Response-rate skew** — people who fill out surveys are not representative | Demographics tilt toward engaged users |

### What to write in the artifact

New H2 section in `docs/forsvn/canonical/research/ICP.md`, placed AFTER Red Flags and BEFORE Next Step:

```markdown
## Sample Bias Acknowledged

### Source-type mix
[List each source type used and a rough count of independent sources from each. Format: `- Reddit (N=8): r/SaaSMarketing, r/Entrepreneur, r/B2BMarketing — fresh-collected 2026-05-15 to 2026-05-18`]

### Known skews in this dataset
[For each source type used, name the skew from the table above and how it could distort findings.]
[Example: `- Reddit dominance (N=8 of 14): may over-represent technical buyers who are willing to discuss tactics publicly. Pain #2 (manual data entry) may be over-weighted because Reddit users disproportionately discuss workflow pain.`]

### Mitigations applied
[What you did to counteract each skew. Examples: `- Sought 2 founder-interview transcripts to test whether Pain #2 holds for non-technical buyers (it did, N=2 confirm)`, `- Pulled 3 G2 reviews tagged \"churned\" to surface objections not visible in pre-purchase data`]

### Known gaps (validation candidates)
[Skews you couldn't mitigate. These are explicit caveats downstream skills should respect. Example: `- No customers >$10M ARR in dataset; persona may not generalize to enterprise segment without further validation.`]
```

### Critic enforcement (Gate 9)

Critic FAILs if:
- Sample Bias section is missing entirely
- Sources are listed but no skews are named
- Skews are named but no mitigations or known gaps are documented
- Sample Bias section is generic ("there could be selection bias") instead of specific to this dataset

---

## 3. The ≥5 rule — minimum viable sample per segment

### Hard floor

Before a persona is finalized, the total count of **independent sources** contributing to that persona across pains + biases + objections + trust/distrust must be **≥5**.

This is segment-level, not finding-level. A persona with 5 pains × 1 source each (all from the same Reddit thread) is N=1 at the segment level, not N=5. Apply the source-independence rules from § 1 above.

### Why 5

Brief 03 § Research Rigor: "avoid conclusions from fewer than 5 independent data points per segment." This number comes from practitioner research (Corey Haines marketing-skills, IDEA-5 § 4) and reflects the floor below which segment-level generalization is unsafe.

Below 5, the persona is **hypothesis**, not finding. It can still be drafted, but it must:
- Be labeled as such at the top of the persona ("Persona 1 — Hypothesis Mode: N=3 sources, validation in progress")
- Carry `Confidence: L` on every claim
- Trigger NEEDS_CONTEXT from the critic, not DONE

### Enforcement (Gate 10)

Critic counts independent sources per persona (synthesis-agent surfaces the count in a hidden footer the critic reads but ships strips before final artifact). If <5 for any persona slot, critic returns NEEDS_CONTEXT with the source count and instructs voc-collector-agent to gather more.

Exception: if the operator explicitly invokes `--hypothesis-mode` for early-stage research where 5 sources don't yet exist, critic accepts the artifact with all personas labeled `Hypothesis Mode` and `Confidence: L`. The override is logged via `scripts/log-critic-override.ts` with dimension `≥5 rule` and reason `early-stage hypothesis research`.

---

## 4. Worked example — confidence tagging in a Pain Profile

Before (current Artifact Template):

```markdown
1. **Manual data entry across 3 tools** — Customers manually copy from Stripe to QuickBooks to internal dashboards.
   - Trigger: Monthly close
   - Impact: 4-6 hours/month per finance person
   - Quote: "I dread the last week of every month." — Reddit r/SaaSMarketing, Mar 2026
   - Quote: "We literally have a shared spreadsheet to track which numbers don't match." — Founder interview
```

After (with confidence tag):

```markdown
1. **Manual data entry across 3 tools** — Customers manually copy from Stripe to QuickBooks to internal dashboards. [Confidence: H | sources: 5]
   - Trigger: Monthly close
   - Impact: 4-6 hours/month per finance person
   - Quote: "I dread the last week of every month." — Reddit r/SaaSMarketing, Mar 2026
   - Quote: "We literally have a shared spreadsheet to track which numbers don't match." — Founder interview, Apr 2026
   - Quote: "The reconciliation pain is what made us look for tools." — G2 review of QuickBooks alternative, Feb 2026
   - Quote: "Month-end is when our team hates their lives." — Twitter thread, Jan 2026
   - Quote: "I'd pay $200/mo just to make Stripe-to-QuickBooks instant." — Email survey response, May 2026
```

5 independent sources (Reddit, interview, G2, Twitter, email) → `Confidence: H`. Different platform types → triangulation passes.

---

## 5. Anti-patterns

The universal confidence anti-patterns — counting quotes as sources, promoting L findings without resolution, bare confidence labels, same-selection sources counted as independent, conflating channel density with finding confidence — are canonical in [`references/_shared/confidence-labeling.md`](_shared/confidence-labeling.md) § 6. ICP-specific additions:

1. **Sample Bias section as a generic disclaimer.** "Selection bias may exist" without naming WHICH bias on WHICH finding is critic FAIL (Gate 9).
2. **Skipping the ≥5 floor for a "feel-good" persona.** If sources don't exist yet, the persona is hypothesis. Label it. Don't pretend otherwise.

---

## 6. Related refs

- [[confidence-labeling]] — canonical H/M/L label, scoring rubric, source-independence + L-resolution rules; this protocol is the ICP-specific application of it
- [[habitat-mapping]] — Digital Watering Hole methodology; channel-density rubric (orthogonal to finding confidence — see § 1 above for the distinction)
- [[voice-of-customer]] — VoC quote collection conventions; independent-source rules apply
- [[customer-interviews]] — interview protocol; interviews count as one independent source per interview (not per quote pulled)
