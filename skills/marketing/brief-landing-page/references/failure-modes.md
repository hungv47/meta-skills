# Failure Modes — Page-Level Brief Failures

> Catalog of failure modes the brand-voice critic and conversion critic watch for. Each mode names: symptom, why it kills, where it appears in the brief, fix direction.
>
> **Use:** when scoring or speccing, scan this catalog. Many failures are detectable from the spec alone — no need to wait for render.

---

## Hero & Above-Fold Failures

### FM-01 — Thin Hero
**Symptom:** Hero section spec has 1 headline candidate, no rubric scoring, no asset slot, no trust signal.
**Why it kills:** Hero is the conversion gate. A thin spec means the designer / Claude Design fills gaps with defaults — usually wrong.
**Where it appears:** Section-spec output, Section 1.
**Fix direction:** Section-spec re-dispatch with "expand hero per ST-Hero template — 3 candidates, asset slot, trust signal."

### FM-02 — Company-History Opening
**Symptom:** Hero copy starts with "Founded in...", "We are...", "Our mission is..."
**Why it kills:** CP-02 violation. Buyer cares about themselves, not the company's history.
**Where it appears:** Hero headline or subhead candidates.
**Fix direction:** Section-spec re-dispatch with VoC phrases from evidence_digest as anchor.

### FM-03 — Mobile Fold Violation
**Symptom:** Section-spec or architecture places primary CTA below the mobile fold (390×844).
**Why it kills:** Mobile traffic bounces before the action becomes visible.
**Where it appears:** Architecture's Mobile Architecture Notes, or Section 1 layout spec.
**Fix direction:** Architecture re-dispatch with explicit mobile-fold constraint.

### FM-04 — 3-Second Test Skipped
**Symptom:** Hero spec doesn't address CP-13's three questions (value clear? audience match? CTA visible?).
**Why it kills:** Without explicit answers, you can't verify the hero works at scan speed.
**Where it appears:** Hero section conversion checklist.
**Fix direction:** Section-spec re-dispatch to populate CP-13 answers in hero gates.

---

## CTA Failures

### FM-05 — Submit / Click Here / Learn More CTAs
**Symptom:** CTA copy uses generic action verbs.
**Why it kills:** CP-03 violation. First-person specific outcomes convert ~90% better.
**Where it appears:** CTA copy in any section.
**Fix direction:** Section-spec re-dispatch to rewrite CTAs in first-person + outcome.

### FM-06 — Three Competing Primary CTAs
**Symptom:** Architecture or section-spec assigns primary tier to multiple CTAs.
**Why it kills:** Decision paralysis. Conversion optimization research is unanimous: one primary.
**Where it appears:** Architecture's CTA Hierarchy, or Section X.CTA blocks.
**Fix direction:** Architecture re-dispatch with single-primary constraint.

### FM-07 — Trust Signal Stranded in Footer
**Symptom:** CTA blocks reference trust signals only in page footer.
**Why it kills:** CP-11 violation. The buyer is at the CTA when deciding, not at the footer.
**Where it appears:** CTA block conversion checklist.
**Fix direction:** Section-spec re-dispatch to add inline trust signal per CTA.

---

## Proof Failures

### FM-08 — Stale Proof Without Annotation
**Symptom:** Section-spec preserves a testimonial dated >12 months ago without "verify date / replace if stale" note.
**Why it kills:** CP-09 violation. Stale proof is worse than no proof — buyer notices the staleness.
**Where it appears:** Social Proof section spec.
**Fix direction:** Section-spec re-dispatch to annotate or remove stale proof.

### FM-09 — Placeholder / Fake Proof
**Symptom:** Asset slot or section-spec includes placeholder testimonial copy ("Lorem ipsum"), stock-photo headshots, or "Trusted by 1000+ teams" without verifiable basis.
**Why it kills:** CP-09 violation. Auto-FAIL.
**Where it appears:** Section-spec social proof, asset-slot inventory.
**Fix direction:** Asset-slot re-dispatch to source real assets or apply "delete cell if not real" pattern.

### FM-10 — Generative AI Used for Proof
**Symptom:** Asset slot routes a logo or testimonial portrait through generative image-gen (`brief-graphic` → image-gen path).
**Why it kills:** CP-09 violation. Proof must be real.
**Where it appears:** Asset-slot Inventory generation route column.
**Fix direction:** Asset-slot re-dispatch with manual-sourcing route.

---

## Form Failures

### FM-11 — Form-Field Bloat
**Symptom:** Form spec lists >5 fields without justification.
**Why it kills:** CP-04 violation. Each field beyond 3 cuts conversion ~10–25%.
**Where it appears:** Section-spec for any section containing a form.
**Fix direction:** Section-spec re-dispatch to cut fields or add explicit per-field justification.

### FM-12 — Required Fields That Should Be Optional
**Symptom:** Phone, company, job title required when only email is essential.
**Why it kills:** CP-04 violation; incremental conversion loss.
**Where it appears:** Form spec.
**Fix direction:** Section-spec re-dispatch to mark non-essential fields optional or remove.

---

## Content Failures

### FM-13 — Feature-Only Copy
**Symptom:** Features section lists capabilities without benefits or outcomes.
**Why it kills:** CP-08 violation. Buyers don't buy features; they buy outcomes.
**Where it appears:** Features section spec.
**Fix direction:** Section-spec re-dispatch with [F → B → O] formula applied per row.

### FM-14 — Reading-Level Inflation
**Symptom:** Body copy with avg sentence >14 words, passive voice >30%.
**Why it kills:** CP-07 violation. Smart audiences scan; complex copy kills scan.
**Where it appears:** Section-spec body copy slots.
**Fix direction:** Section-spec re-dispatch to compress sentences and active-voice rewrites.

### FM-15 — No Objection Handling
**Symptom:** ICP research lists objections (in evidence_digest); brief has no Objection section AND no objection handling embedded in other sections.
**Why it kills:** Bounce trigger left intact. Buyer hits the objection internally and leaves.
**Where it appears:** Architecture section list, or section-spec cross-cutting check.
**Fix direction:** Architecture re-dispatch to add Objection section, or section-spec re-dispatch to fold objection handling into existing sections.

### FM-16 — Generic Hypothesis Bleed-Through
**Symptom:** Sections that look the same as default templates regardless of approved hypothesis.
**Why it kills:** Hypothesis is the bet — sections must serve it. Generic = no bet = no learning.
**Where it appears:** Section-Hypothesis Trace fields blank or generic.
**Fix direction:** Section-spec re-dispatch with hypothesis claim components mapped to sections.

---

## Brand Failures

### FM-17 — Sacred Element Drift
**Symptom:** Section-spec, asset-slot, or hand-off proposes touching a sacred element (logo treatment, tagline paraphrase, signature animation replication).
**Why it kills:** Brand erosion across pages. Auto-FAIL on G1.
**Where it appears:** Anywhere — asset slots most commonly.
**Fix direction:** Responsible agent re-dispatch with sacred elements re-emphasized.

### FM-18 — Surface Language Violation
**Symptom:** Brief proposes glassmorphic hero overlay when brand_digest says "anti-glass" / "matte only".
**Why it kills:** Visual brand drift. G4 FAIL.
**Where it appears:** Asset slot visual concepts, section-spec layout notes.
**Fix direction:** Asset-slot or section-spec re-dispatch with surface constraint.

### FM-19 — Forbidden Vocab Slip
**Symptom:** Even one instance of "leverage" / "unlock" / "seamlessly" / "robust" in copy slots.
**Why it kills:** AI-flavor erodes brand voice. G2 FAIL.
**Where it appears:** Headline candidates, body, CTA, hand-off blocks.
**Fix direction:** Section-spec or handoff re-dispatch with forbidden-vocab scan.

### FM-20 — Invented Tokens
**Symptom:** Brief uses hex / type values close to but outside brand_digest palette.
**Why it kills:** Token sprawl across pages. G5 FAIL.
**Where it appears:** Section-spec layout notes, asset slot fallback colors.
**Fix direction:** Section-spec re-dispatch to use brand_digest tokens; if a value is missing, escalate to brand-anchor for digest correction.

---

## Brief-Structural Failures

### FM-21 — Brief Bloat (>500 lines)
**Symptom:** Brief envelope exceeds 500 lines.
**Why it kills:** Designer skims, misses critical spec. G6 FAIL.
**Where it appears:** Total brief line count.
**Fix direction:** Section-spec re-dispatch to compress (uses shared chain instead of duplicating; cap conversion-checklist where boilerplate).

### FM-22 — Brief Thin (<250 lines)
**Symptom:** Brief envelope below 250 lines.
**Why it kills:** Designer asks 5 follow-up questions. G6 FAIL.
**Where it appears:** Total brief line count.
**Fix direction:** Section-spec re-dispatch to expand under-specified sections (typically copy candidates, layout details, conversion checklists).

### FM-23 — Inlined Shared Chain
**Symptom:** Brief duplicates the project's shared chain doc instead of referencing.
**Why it kills:** Chain updates won't propagate; brief becomes stale faster.
**Where it appears:** Skill Chain section of brief.
**Fix direction:** Section-spec or handoff re-dispatch with reference-by-section pattern.

### FM-24 — Missing Pre-Flight Checklist
**Symptom:** Brief has no pre-flight checklist or all unchecked.
**Why it kills:** CP-12 violation. Designer skips foundation items.
**Where it appears:** Brief artifact, Pre-flight Checklist section.
**Fix direction:** Section-spec re-dispatch to populate.

---

## Hand-Off Failures

### FM-25 — Hand-Off Paraphrasing Sacred / Voice
**Symptom:** Hand-off block summarizes sacred elements as "respect brand identity" instead of listing them verbatim.
**Why it kills:** G8 FAIL. Target tool / designer doesn't know what to actually respect.
**Where it appears:** Hand-off prompt blocks.
**Fix direction:** Handoff re-dispatch with verbatim-lift requirement.

### FM-26 — One-Block-Many-Targets
**Symptom:** Single hand-off prompt block tries to serve Claude Design + Figma + designer simultaneously.
**Why it kills:** Each target's format conventions are different; one block fits none.
**Where it appears:** Hand-off section of brief.
**Fix direction:** Handoff re-dispatch with one block per target.

### FM-27 — Missing Asset Paths in Hand-Off
**Symptom:** Hand-off references "hero image" without file path.
**Why it kills:** Target has to guess where the asset lives.
**Where it appears:** Hand-off block per-section asset references.
**Fix direction:** Handoff re-dispatch to include paths from asset-slot Inventory.

---

## Process Failures

### FM-28 — Pretending Heuristic Review Is CRO
**Symptom:** Brief claims "optimized" or "CRO-backed" with no post-launch analytics, recordings, experiments, or conversion evidence.
**Why it kills:** Best-practice review can improve a page, but real optimization requires behavioral evidence. Calling assumptions optimization hides risk.
**Where it appears:** Hypothesis, Launch Plan, Results, or Change Log.
**Fix direction:** Revise language to "conversion-principles-backed" or "assumption-backed"; add instrumentation to Launch Plan and reserve CRO claims for post-launch evidence.

### FM-29 — Vibe Hypothesis
**Symptom:** Hypothesis isn't falsifiable, doesn't trace to evidence/audience signal.
**Why it kills:** Brief has nothing to learn from post-launch.
**Where it appears:** Hypothesis-agent output, Approval Gate 1.
**Fix direction:** Hypothesis re-dispatch with anchor-trace requirement.

### FM-30 — Inflated Critic Scores
**Symptom:** Critic returns 11/11 hard gates PASS on every brief (with no honest NOTEs on the advisory CPs either).
**Why it kills:** Sycophancy. Critic isn't doing its job. Errors compound across briefs.
**Where it appears:** Conversion-critic or brand-voice-critic output.
**Fix direction:** Critic re-dispatch with honest-scoring instructions; or treat as critic-agent bug to fix.
