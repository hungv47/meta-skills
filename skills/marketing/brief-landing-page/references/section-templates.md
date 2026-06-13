# Section Templates — Per-Section Spec Library

> Catalog of section types the section-spec-agent uses. Each template names: purpose, conversion-floor slots, common slots, conversion-checklist (mapped to CP-IDs in `conversion-principles.md`), section-specific anti-patterns.
>
> **Use:** when speccing a section, look up its template here. Copy the conversion-floor slot list. Apply CP gates. Reject the section if any conversion-floor slot can't be filled. Floors are CP-tied; everything else is the executing agent's call.

---

## ST-Hero — Hero Section

**Purpose:** First-impression conversion gate. Closes the 3-second test (CP-13).

**Conversion-floor slots:**
- Headline (3 candidates, 4-U scored — CP-01)
- Subhead (single, ≤2 lines)
- Primary CTA (first-person, action verb + outcome — CP-03)
- Hero visual asset slot (named)
- Trust signal in viewport (logo grid, customer quote, security badge — CP-11)

**Common slots:**
- Subhead microcopy (e.g., "No credit card required, 14-day free trial")
- Secondary CTA (softer ask — "watch demo", "see pricing")
- Above-fold proof element (single testimonial, key metric)

*Layout, visual mode, and copy structure are the executing agent's call — spec the conversion goal, not the implementation.*

**Conversion gates:**
- [ ] Recommended headline ≥3/4 on 4-U (CP-01)
- [ ] 3-second test passes (CP-13): value clear, audience match obvious, CTA visible
- [ ] Above-fold value prop (CP-02): customer-language not company-history
- [ ] Message match to traffic source explicit (CP-05) — if campaign LP
- [ ] Primary CTA above mobile fold (390×844)
- [ ] Trust signal in viewport (CP-11)

**Section-specific anti-patterns:**
- Company-history opening ("Founded in 2015...") — CP-02 violation
- "Submit" / "Click Here" / "Learn More" CTA — CP-03 violation
- Hero visual unrelated to product/audience (decorative stock photo)
- Subhead longer than 2 lines (reader bounces before parsing)
- Mobile CTA below fold

---

## ST-ValueProp — Value Proposition

**Purpose:** Argument scan — give the reader the 3 reasons to keep reading.

**Conversion-floor slots:**
- Section headline (1 candidate is fine; supporting role)
- 3 columns (or 1 statement) — each with: column headline, icon/visual, 1–2 line description
- Outcome metric per column (where possible)

**Common slots:**
- Secondary CTA at section end
- Comparison row ("vs. competitor X")

*Layout, visual mode, and copy structure are the executing agent's call — spec the conversion goal, not the implementation.*

**Conversion gates:**
- [ ] Each column states a benefit, not a feature (CP-08)
- [ ] Each column ≤3 lines of copy (scan-friendly)
- [ ] No body paragraphs (this is a scan section, not a read section)
- [ ] Icons/visuals reference named asset slots

**Anti-patterns:**
- Body paragraphs (this is the wrong section for them — use Features or Story)
- Generic icons (rocket, lightbulb, gear) — pick specific or skip
- "We" language in column body ("We help you...") — flip to "you" outcomes

---

## ST-SocialProof — Social Proof

**Purpose:** Credibility moment — buyer needs proof before continuing.

**Conversion-floor slots:**
- Proof element type: logo grid (≥6 cells) OR ≥1 testimonial OR case-study teaser
- Source attribution (customer name + role + company; date or "current customer")
- Date verification (every proof element <12 months OR flagged for replacement)

**Common slots:**
- Quoted metric ("Saved 40 hours/week")
- Headshot
- Link to full case study

*Layout, visual mode, and copy structure are the executing agent's call — spec the conversion goal, not the implementation.*

**Conversion gates:**
- [ ] Every proof element has verifiable source (CP-09)
- [ ] Stale proof (>12mo) flagged: "verify date / replace if stale" or "delete cell if not real"
- [ ] No fake/placeholder names (CP-09)
- [ ] Logos are real customers (not "as seen in" press logos masquerading as customers)

**Anti-patterns:**
- "Trusted by 1000+ companies" without specifics — generic, low trust value
- Placeholder testimonials with stock-photo headshots — auto-FAIL
- Outdated logos (acquired companies, defunct customers)
- Testimonial copy that reads as marketing (no specifics, no metric, no proof)

---

## ST-Features — Features Section

**Purpose:** Detail layer for buyers in evaluation mode. Each feature converted to benefit + outcome.

**Conversion-floor slots:**
- Section headline (supporting; can be functional like "What you get")
- Feature list (3–8 rows is the typical range; primary tier ≤6, secondary tier ≤4)
- For each feature: Feature name → Benefit → Outcome (CP-08)

**Common slots:**
- Comparison column ("vs. competitor X" / "vs. legacy approach")
- Per-feature deep-link to docs/case study
- Pricing tag per feature (if pricing structure has tiers per feature)

*Layout, visual mode, and copy structure are the executing agent's call — spec the conversion goal, not the implementation.*

**Conversion gates:**
- [ ] Every feature uses [Feature → Benefit → Outcome] formula (CP-08)
- [ ] No more than 8 features (decision-paralysis floor)
- [ ] No pricing inside features section (move to dedicated pricing section)
- [ ] Icons specific to feature (not generic)

**Anti-patterns:**
- Feature-only copy ("API access" with no "so you can...")
- 12+ feature list — buyer gives up
- Mixing features and pricing in same row
- "Coming soon" features in the list (sells aspiration, not capability)

---

## ST-Objection — Objection Handling

**Purpose:** Address top 1–2 ICP objections directly, before the buyer reaches the CTA holding them.

**Conversion-floor slots:**
- Objection statement (phrased as buyer would think it, not defensive)
- Counter-evidence (specific, proof-backed)
- Reassurance copy (1–2 sentences)
- Trust element (logo, quote, metric tied to the objection)

**Common slots:**
- Risk reversal ("If X doesn't happen in N days, full refund")
- Comparison to alternatives ("vs. doing nothing", "vs. legacy tool")

*Layout, visual mode, and copy structure are the executing agent's call — spec the conversion goal, not the implementation.*

**Conversion gates:**
- [ ] Objection comes from ICP research (uses the source)
- [ ] Counter-evidence is specific, not generic ("we have customers in your industry" is generic)
- [ ] Tone is confident, not defensive ("Yes, this works for small teams — here's how" not "Don't worry, it's not too complex")
- [ ] No fake objections (objections invented to be easily knocked down)

**Anti-patterns:**
- Defensive tone ("Worried this is too much?" — implies it might be)
- Knocking down strawman objections instead of real ones
- Long objection sequences (>3) — turns into FAQ; use ST-FAQ instead

---

## ST-FAQ — Frequently Asked Questions

**Purpose:** Surface-level objections the audience has but not strong enough to dedicate Objection sections to.

**Conversion-floor slots:**
- 5–8 Q&A pairs
- Question phrased in buyer language
- Answer ≤3 sentences

**Common slots:**
- Search/filter UI (only if FAQ list >12 — otherwise overkill)
- "Still have questions? Contact us" link at end

*Layout, visual mode, and copy structure are the executing agent's call — spec the conversion goal, not the implementation.*

**Conversion gates:**
- [ ] Questions sourced from real audience research (ICP, support tickets, sales calls)
- [ ] Answers ≤3 sentences (otherwise it's an essay, not an FAQ)
- [ ] No buried CTAs in FAQ answers (CTAs go in CTA blocks)
- [ ] CP-07 reading level applies (avg sentence ≤11 words)

**Anti-patterns:**
- Questions invented to seed favorable answers ("Why are you the best?")
- Multi-paragraph answers (essay format)
- Burying pricing/availability info only in FAQ (must be elsewhere)

---

## ST-CTA — CTA Block

**Purpose:** Final action moment. Pause velocity. Single primary action.

**Conversion-floor slots:**
- Headline (commits to action — "Start your team's pricing in 8 seconds")
- Primary CTA copy (first-person, action verb + outcome — CP-03)
- Trust signal in scroll-distance (CP-11)
- Optional risk-reversal copy

**Common slots:**
- Secondary CTA (softer fallback)
- Inline form (if conversion is a form submission — CP-04 ≤5 fields)

*Layout, visual mode, and copy structure are the executing agent's call — spec the conversion goal, not the implementation.*

**Conversion gates:**
- [ ] Single primary CTA (no competing primaries)
- [ ] CTA copy first-person, action verb + outcome (CP-03)
- [ ] Trust signal within scroll-distance (CP-11)
- [ ] If form: ≤5 fields OR exception justified (CP-04)
- [ ] Pause velocity (≥80vh) for decision space

**Anti-patterns:**
- 3 CTAs of equal weight (decision paralysis)
- "Submit" / "Click Here" CTAs (CP-03 violation)
- Trust signal stranded in footer instead of inline
- Form with 7+ fields without justification (CP-04 violation)

---

## ST-Pricing — Pricing Section (only on /pricing or pricing-led pages)

**Purpose:** Zero-ambiguity offer presentation. Buyer knows exact price + scope before being asked to act.

**Conversion-floor slots:**
- Tier list (typically 3 tiers; ≤4)
- Per tier: name, price (or "starts at"), 3–5 included items, primary CTA per tier
- Comparison row at bottom (which features per tier)

**Common slots:**
- Annual/monthly toggle
- Currency selector
- "Most popular" highlight on one tier
- Enterprise / custom tier with "contact sales" CTA

*Layout, visual mode, and copy structure are the executing agent's call — spec the conversion goal, not the implementation.*

**Conversion gates:**
- [ ] Real prices (or "starts at $X") — no "contact us for pricing" if avoidable
- [ ] Per-tier CTA copy first-person (CP-03)
- [ ] Comparison row visible without modal/expand
- [ ] Currency / billing terms unambiguous (annual? monthly? per seat?)

**Anti-patterns:**
- "Contact sales" as the only path to pricing on a public page
- 6+ tiers (decision paralysis)
- Misleading "most popular" highlight (must be true)
- Hidden charges revealed only after CTA click

---

## Choosing Sections

If the architecture's section list contains a section type not covered above (e.g., "Calculator", "Compare", "Story"), use the closest template's structure as scaffold and document deviations in the section's Change Log.

If a section type appears that **shouldn't** for the page tier (e.g., Story section on a /pricing page), flag it back to architecture-agent for revision rather than spec it.

## Cross-Cutting Rules

- **Every section has a Conversion Checklist.** Even if all gates are n/a, write "n/a" — never omit.
- **Every copy slot has ≥3 candidates.** Single candidates deny choice at Approval Gate 3.
- **Every CP reference must exist** in `references/conversion-principles.md`. Inventing CP-IDs FAILs critic.
- **VoC over invention.** Use phrases from `evidence_digest` ICP/VoC over invented copy whenever a relevant phrase exists.
