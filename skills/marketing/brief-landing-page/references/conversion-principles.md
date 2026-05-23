# Conversion Principles — lp-brief Reference

> **This is the canonical landing-page construction rubric for `brief-landing-page`.** It indexes the local `references/conversion/*` files so best-practice conversion rules are applied while the page is being designed, not deferred to a separate heuristic audit pass. Sub-agents (section-spec-agent, conversion-critic-agent) read this file, then read the cited source ranges as needed. If a principle here disagrees with the cited source, the source wins — fix the reference in the same commit per the Update Protocol below.
>
> **Path convention:** all reference are relative to `references/conversion/`.

---

## How to use this file

- **Section-spec agent:** when speccing a section, look up each principle whose `applies-to` matches the section type. The conversion-checklist at the bottom of every section spec is built from these IDs.
- **Conversion-critic agent:** the rubric in `agents/conversion-critic-agent.md` references these IDs. Each FAIL must uses the principle ID and the offending brief line.
- **reference format in critic output:** `[CP-04 — 5-Field Form Maximum] Form spec lists 7 fields with no exception justification.`

---

## Principle Catalog

### CP-01 — Headline 4-U Formula

- **Pattern basis:** internal research synthesis.
- **Rule:** Every headline candidate must score Useful + Unique + Urgent + Ultra-specific. ≥3/4 to pass.
- **Applies to:** hero, value-prop, section-headers
- **lp-brief application:** every copy slot that is a headline produces ≥3 candidates, each scored 4/4 visible in the brief. Recommended candidate must be ≥3/4. Critic FAILs the section if recommended is <3/4.

### CP-02 — Above-Fold Value Proposition

- **Pattern basis:** internal research synthesis.
- **Rule:** Value clear in 3 seconds, customer-language not company-history, transformation not features.
- **Applies to:** hero
- **lp-brief application:** hero spec must answer "value clear in 3s?" yes/no. Anti-patterns from source lines 64–67 (company-centric phrasing) trigger critic FAIL. Customer language must come from `research/icp-research.md` VoC.

### CP-03 — CTA First-Person Psychology

- **Pattern basis:** internal research synthesis.
- **Rule:** First-person ("Get my X") over second-person ("Get your X"). Action verb + outcome. Specific, not "Submit"/"Click Here".
- **Applies to:** every CTA slot — hero CTA, mid-page CTA, footer CTA, modal CTA
- **lp-brief application:** every CTA copy candidate is rewritten in first-person form unless the brand voice rules in `brand/BRAND.md` explicitly forbid it (rare). Critic FAILs any CTA using "Submit", "Click Here", "Learn More", or second-person phrasing without justification.

### CP-04 — 5-Field Form Maximum

- **Pattern basis:** internal research synthesis.
- **Rule:** Forms ≤5 fields OR exception justified inline.
- **Applies to:** any section containing a form (signup, demo-request, contact, gated download)
- **lp-brief application:** form spec lists every field with reason. Critic FAILs forms with >5 fields unless brief contains explicit exception ("field N required because [reason]"). Source's field-priority list at lines 119–124 informs prioritization.

### CP-05 — Message Match Precision

- **Pattern basis:** internal research synthesis.
- **Rule:** Hero copy echoes traffic source — ad headline, link text, search query, paid-keyword.
- **Applies to:** hero (primary), every above-fold element on a campaign LP
- **lp-brief application:** hero spec includes "Traffic source assumption" field. If multiple sources, brief lists separate hero variants per source. Common failures at source lines 164–169 are anti-pattern reference. Critic FAILs if traffic source is unspecified or hero copy doesn't match.

### CP-06 — PAS Copy Framework

- **Pattern basis:** internal research synthesis.
- **Rule:** Problem → Agitate → Solve sequencing for body copy.
- **Applies to:** value-prop, objection, mid-funnel narrative sections
- **lp-brief application:** any narrative section longer than 3 lines should follow PAS. Brief annotates which sentence is P, A, S. Critic notes (not FAILs) if a long narrative section breaks PAS without a structural reason.

### CP-07 — Reading Level Grade 6

- **Pattern basis:** internal research synthesis.
- **Rule:** Avg sentence ≤11 words. Paragraphs 2–3 sentences. Active voice.
- **Applies to:** all body copy slots
- **lp-brief application:** copy candidates flagged if avg sentence >11 words or passive voice >20%. Brief shows the score per copy block. Critic notes (not FAILs) borderline cases; clearly bloated copy (>14 word avg) FAILs.

### CP-08 — Benefit-First Language

- **Pattern basis:** internal research synthesis.
- **Rule:** [Feature] → so you can → [Benefit] → which means → [Emotional Outcome]. Source line 240.
- **Applies to:** features, value-prop, mid-page narrative
- **lp-brief application:** feature spec table includes Feature / Benefit / Outcome columns. Critic FAILs feature blocks that list features without benefits. Reference patterns at source lines 254–258.

### CP-09 — Strategic Social Proof Hierarchy

- **Pattern basis:** internal research synthesis.
- **Rule:** Hierarchy of proof power; placement near decision moments; authenticity required (no fake names, no stock smiles, sources within 12 months).
- **Applies to:** social proof, testimonial, logo grid, case study sections
- **lp-brief application:** every proof element must have a verifiable source listed in brief. Stale (>12 month) proof flagged for replacement or "delete cell if not real" notation. Critic FAILs proof sections with placeholder/fake/unsourced elements per source's authenticity requirements at lines 40–47.

### CP-10 — Cognitive Bias Stack

- **Pattern basis:** internal research synthesis.
- **Rule:** Apply social proof, scarcity, authority, reciprocity, commitment biases — but with authenticity (no manufactured scarcity).
- **Applies to:** value-prop, social proof, CTA, urgency sections
- **lp-brief application:** brief annotates which biases each section is leveraging. Critic notes if a section invokes scarcity/urgency without a real basis (source's authenticity bar applies).

### CP-11 — Trust Signal Clustering

- **Pattern basis:** internal research synthesis.
- **Rule:** Trust signals (security badges, logos, awards, testimonials) clustered near every CTA — not relegated to footer.
- **Applies to:** every CTA slot
- **lp-brief application:** every CTA spec must list at least one trust signal within scroll-distance (defined as: same viewport at desktop 1440×900, or within 1 swipe at mobile 390×844). Critic FAILs CTAs with no trust signal in scroll-distance.

### CP-12 — Pre-Launch Foundation Checklist

- **Pattern basis:** internal research synthesis.
- **Rule:** Foundation, social proof, copy, urgency, UX, content, psychology, technical — checklist of must-haves before launch.
- **Applies to:** brief's pre-flight checklist section
- **lp-brief application:** the brief's "Pre-flight Checklist" section maps to source's foundation checklist. Critic FAILs briefs missing pre-flight items.

### CP-13 — 3-Second Test

- **Pattern basis:** internal research synthesis.
- **Rule:** Above-fold understandable in 3 seconds — value clear, audience match, CTA visible.
- **Applies to:** hero
- **lp-brief application:** hero spec must answer the source's three 3-second questions explicitly. Critic FAILs hero specs that don't answer them.

### CP-14 — 5-Question Visitor Diagnostic

- **Pattern basis:** internal research synthesis. Distinct from CP-13: CP-13 checks hero comprehension; CP-14 checks whether the page sequences answers to the five real visitor questions across hero + first scroll.
- **Rule:** Above-fold + first scroll must produce a quotable line answering each of: (Q1) What is this? (Q2) How does it solve my problem? (Q3) Why trust you? (Q4) Who else uses this? (Q5) What do I do now? See `references/conversion/core-principles.md` §9 for full diagnostic + failure modes.
- **Applies to:** hero, value-prop, social-proof, primary-CTA sections (as a cross-section sequence check)
- **lp-brief application:** the brief's pre-launch foundation section runs the 5-question diagnostic and quotes the answering line for each question. **Advisory only** — conversion-critic-agent surfaces a NOTE (not a FAIL) when a question lacks a quotable answering line. Promote to FAIL only if pre-launch foundation explicitly requires the diagnostic.

---

## Principles Intentionally NOT in Critic Rubric

These principles are valuable for post-launch diagnosis but produce noisy gates at brief-time. They appear in section spec **as guidance**, not in the critic checklist:

- **Advanced psychology stack** (`advanced-psychology.md`) — useful for narrative tone-setting but too subjective to FAIL on.
- **UX micro-interactions** (`ux-design.md`) — most belong in a UX-detail review pass, not lp-brief's critic.
- **A/B testing protocols** (`testing-optimization.md`) — post-launch concern, surfaced in brief's "Launch Plan" section.

If a critic wants to flag one of these, use a **note** (advisory) not a **FAIL** (blocking).

---

## Update Protocol

- If `references/conversion/core-principles.md` line numbers shift (new principle added, formula tweaked), update the line ranges here in the same commit. Stale reference are worse than no reference.
- If a new principle appears in the local conversion references that materially changes brief-time decisions, add a `CP-XX` entry here. New IDs are append-only — never renumber.
- If a principle is retired from the local conversion references, mark it `DEPRECATED` here with the deprecation date — do not delete (existing briefs may reference it).
