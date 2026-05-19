# Surface Rhythm — Page Architecture Patterns

> Catalog of scroll-experience patterns the architecture-agent picks from. Each pattern names: when to use, section order, velocity profile, the conversion gate it optimizes for, and known failure modes.
>
> **Velocity vocabulary:** *Pause* (≥80vh, eye stops), *Slow* (~60–80vh, reading pace), *Fast* (~40–60vh, scan pace), *Burst* (~20–40vh, transitional). Never use a vague "medium" — pick.

---

## SR-01 — Default Conversion Rhythm

**Use when:** primary conversion page, mid-funnel awareness, no extreme audience signal.

**Order:** Hero → Value Prop → Social Proof → Features → Objection → CTA Block

**Velocity:** Pause → Fast → Slow → Fast → Slow → Pause

**Conversion gate it optimizes:** balanced — first impression (hero), credibility (proof), capability (features), reassurance (objection), action (CTA).

**Failure modes:**
- Adding a story section between Hero and Value Prop slows the buyer who wants the offer fast.
- Skipping Objection section on a high-skepticism audience leaves the bounce trigger intact.

---

## SR-02 — Proof-Led Rhythm

**Use when:** audience has high trust requirements (regulated industries, enterprise procurement, security-sensitive buyers). Hypothesis often anchored in trust-gap evidence or audience signals.

**Order:** Hero → Social Proof (immediate) → Value Prop → Features → CTA Block

**Velocity:** Pause → Slow → Fast → Fast → Pause

**Conversion gate it optimizes:** trust before benefit. Buyer sees the proof (logos, security badges, named customers) before being asked to read benefits.

**Failure modes:**
- Stale proof (>12mo) in this slot — the whole rhythm collapses (CP-09 violation).
- Generic "trusted by 1000+" without verifiable specifics — reads as marketing, not proof.

---

## SR-03 — Receipt / Transparency Rhythm

**Use when:** buyer signal is "show me the numbers before you talk to me" — pricing-sensitive ICPs, line-item-trained industries (legal, accounting, ops).

**Order:** Hero (with line-item / pricing visible) → Why → Social Proof → FAQ → CTA Block

**Velocity:** Pause → Fast → Slow → Slow → Pause

**Conversion gate it optimizes:** zero hidden ask. Pricing or scope is in the hero; the rest is justification.

**Failure modes:**
- Hiding price elsewhere on the page — defeats the rhythm.
- Hero looks too dense — needs ample whitespace despite content density.

---

## SR-04 — Calculator-Led Rhythm

**Use when:** ICP signals analytical buyer (data-led, ROI-focused). **Must have real underlying data**, not a toy widget.

**Order:** Hero → Calculator (above fold or immediate) → Value Prop → Social Proof → Features → CTA Block

**Velocity:** Pause → Slow → Fast → Slow → Fast → Pause

**Conversion gate it optimizes:** self-serve qualification. Buyer plays with numbers, gets a personalized result, then sees proof and features.

**Failure modes:**
- Calculator without real data backend — buyer notices, trust dies.
- Unique-Y on hypothesis 3Q FAILs because calculator pages are common; the *data* must be unique, not the form factor.

---

## SR-05 — Story-Led Rhythm (secondary tier only)

**Use when:** /about, /story, founder-led narrative pages. **Not for primary conversion pages.**

**Order:** Hero → Story (chronological or thematic) → Why-It-Matters → Social Proof → CTA (soft)

**Velocity:** Pause → Slow → Slow → Slow → Pause

**Conversion gate it optimizes:** brand affinity / qualified-lead self-selection. CTA is usually softer (newsletter, demo book) not transactional.

**Failure modes:**
- Using SR-05 for a primary conversion page — buyer wants the offer, not the founder story.
- Story without Why-It-Matters — reads as vanity.

---

## SR-06 — Objection-Led Rhythm

**Use when:** audit revealed a single dominant objection that's killing conversion (e.g., "is this overkill for small teams"). Hypothesis is structured around closing that objection.

**Order:** Hero → Objection (named directly) → Counter-evidence → Value Prop → CTA Block

**Velocity:** Pause → Slow → Slow → Fast → Pause

**Conversion gate it optimizes:** address the bounce trigger before letting the buyer scroll past it.

**Failure modes:**
- Naming the objection too aggressively ("Worried this is overkill?") can feel defensive — phrase as the buyer would think it.
- Counter-evidence must be specific and proof-backed, not "actually we're great for everyone."

---

## Velocity Math

A page that exceeds **~600vh total** (~6 full viewports of scroll on desktop) is too long. Aim for **350–550vh**:

| Section type | Typical height |
|--------------|----------------|
| Hero (pause) | 100vh |
| Fast scan section | 40–60vh |
| Slow reading section | 60–80vh |
| Pause section (CTA, decision) | 80–100vh |

Add up your section velocity heights. If the total exceeds 600vh, cut sections — don't compress them.

## Mobile Considerations

- Mobile fold (390×844) is **shorter** than desktop fold. Primary CTA must still be visible without scroll.
- Mobile compresses 3-column layouts to single column → multiplies vertical height. A 60vh fast section on desktop becomes ~150vh on mobile if it has 3 columns.
- Velocity *intent* should be preserved on mobile but the implementation differs — note divergences in the architecture's "Mobile Architecture Notes" section.

## Choosing a Pattern

Decision shortcuts:

- Hypothesis names "trust" / "credibility" / "skepticism" → **SR-02 (Proof-Led)**
- Hypothesis names "transparency" / "show numbers" / "no surprises" → **SR-03 (Receipt)**
- Hypothesis names "ROI" / "calculate" / "cost" + ICP is analytical → **SR-04 (Calculator)** *only if real data backs it*
- Hypothesis names a specific objection from ICP research → **SR-06 (Objection-Led)**
- /about, /story, founder-led → **SR-05 (Story-Led)**
- Anything else → **SR-01 (Default Conversion)**

If two patterns fit, pick the one that more directly serves the hypothesis claim. Don't blend patterns — pick.

## Anti-Patterns (page-level)

- **Mid-velocity-monoculture** — every section runs at "slow"; the page reads as one undifferentiated block.
- **Inverted velocity** — fast section at the CTA (buyer rushes past); slow section at the value prop (buyer disengages waiting).
- **Above-600vh total** — buyer never reaches the bottom. Cut sections.
- **Section sprawl** — 11+ sections "to be thorough." More sections = lower per-section attention.
- **Pattern-blending** — half SR-01 then half SR-02 mid-page. Rhythm collapses.
