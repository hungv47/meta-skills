# Page Sections Reference

Landing page section types, page structure templates, and testimonial selection.

## Landing Page Section Types

### Core Sections

**Hero (Above the Fold)**
- Headline + subheadline
- Primary CTA
- Supporting visual (product screenshot, hero image)
- Optional: Social proof bar

**Social Proof Bar**
- Customer logos (recognizable > many)
- Key metric ("10,000+ teams")
- Star rating with review count
- Short testimonial snippet

**Problem/Pain Section**
- Articulate their problem better than they can
- Create recognition ("that's exactly my situation")
- Hint at cost of not solving it
- Openers: "You know the feeling...", "If you're like most [role]...", "Every day, [audience] struggles with..."

**Solution/Benefits Section**
- Bridge from problem to your solution
- 3-5 key benefits (not 10)
- Each benefit: headline + explanation + proof if available

**How It Works**
- 3-4 numbered steps
- Reduces perceived complexity
- Each step: simple verb + outcome
- Example: 1. Connect your tools (2 min) → 2. Set your preferences → 3. Get automated reports every Monday

**Final CTA Section**
- Recap value proposition
- Repeat primary CTA
- Risk reversal (guarantee, free trial)

---

### Supporting Sections

| Section | Purpose | When to use |
|---------|---------|-------------|
| Testimonials | Build trust with specific results and real names | Almost always |
| Case Studies | Problem → Solution → Results with metrics | B2B, enterprise |
| Use Cases | Different ways product is used, helps self-identification | Multi-audience products |
| Personas / "Built For" | Explicitly call out target audience | When audience wonders "is this for me?" |
| FAQ | Address objections, good for SEO | Long-form pages |
| Comparison | vs. competitors or vs. status quo | Competitive markets |
| Integrations | "Works with your stack" | Tool/SaaS products |
| Founder Story | Why you built this, what you believe | Brand-driven products |
| Demo / Product Tour | Interactive demos, video walkthroughs, GIF previews | Complex products |
| Pricing Preview | Teaser on non-pricing pages, "from $X/mo" | When price is a selling point |
| Guarantee / Risk Reversal | Money-back, free trial, "cancel anytime" | High-commitment purchases |
| Stats | Key credibility metrics | When you have impressive numbers |

---

## Section Sequencer — by audience awareness

The right section *order* depends on how much the reader already knows. Sequence by **awareness state** (Schwartz's five stages); the further left the reader sits, the more belief-building must come before the offer.

| Awareness state | Reader knows | Lead with | Recommended section stack |
|---|---|---|---|
| **Unaware** | Not even the problem | Problem (make them feel it) | Hero (problem hook) → Problem/Pain → Solution → How It Works → Social Proof → Benefits → Final CTA |
| **Problem-aware** | The pain, not a solution | Problem → your solution | Hero (problem→promise) → Social Proof bar → Problem/Pain → How It Works → Benefits → Testimonial → FAQ → Final CTA |
| **Solution-aware** | Solutions exist, comparing | Differentiation + Proof | Hero (differentiator) → Social Proof bar → Benefits → Comparison → Case Study → How It Works → FAQ → Final CTA |
| **Product-aware** | Your product, not convinced | Proof + Risk reversal | Hero (outcome) → Social Proof bar → Case Study → Benefits → Pricing Preview → Guarantee → Final CTA |
| **Most-aware** | Ready, needs the nudge | Offer + urgency | Hero (offer) → Guarantee/Risk Reversal → Final CTA (short page; cut belief-building) |

**Rules of the sequencer:**

- **Front-load belief, back-load offer for low awareness.** An unaware reader who hits a pricing teaser before feeling the problem bounces. A most-aware reader forced to scroll past a problem section to reach the CTA loses momentum.
- **Match the hero to the state, not the product.** The hero headline pulls the [driver](headline-formulas.md#headline-formulas) that fits the state: Problem for unaware, Differentiation for solution-aware, Proof/Offer for product- and most-aware.
- **Awareness comes from the brief.** Read `awareness_stage` from the Pre-Dispatch / descriptive metadata block; never guess. If absent, flag the gap rather than defaulting to a generic stack.
- **One narrative, no whiplash.** Don't mix an unaware problem-build with a most-aware hard offer on one page — split into two pages or two ad sets.

The fixed templates below are starting points; the sequencer above is the selector that picks and orders them.

## Page Structure Templates

### Varied, Engaging Page (Reference Stack)

```
1. Hero with clear value prop
2. Social proof bar (logos or stats)
3. Problem/pain section
4. How it works (3 steps)
5. Key benefits (2-3, not 10)
6. Testimonial
7. Use cases or personas
8. Comparison to alternatives
9. Case study snippet
10. FAQ
11. Final CTA with guarantee
```

Tells a story and addresses objections.

---

### Compact Landing Page

```
1. Hero (headline, subhead, CTA, image)
2. Social proof bar
3. 3 key benefits with icons
4. Testimonial
5. How it works (3 steps)
6. Final CTA with guarantee
```

Good for ad landing pages where brevity matters.

---

### Enterprise/B2B Landing Page

```
1. Hero (outcome-focused headline)
2. Logo bar (recognizable companies)
3. Problem section (business pain)
4. Solution overview
5. Use cases by role/department
6. Security/compliance section
7. Integration logos
8. Case study with metrics
9. ROI/value section
10. Contact/demo CTA
```

Addresses enterprise buyer concerns.

---

### Product Launch Page

```
1. Hero with launch announcement
2. Video demo or walkthrough
3. Feature highlights (3-5)
4. Before/after comparison
5. Early testimonials
6. Launch pricing or early access offer
7. CTA with urgency
```

Good for ProductHunt, launches, or announcements.

---

### Feature-Heavy Page (Weak — Avoid)

```
1. Hero
2. Feature 1
3. Feature 2
4. Feature 3
5. Feature 4
6. CTA
```

This is a list, not a persuasive narrative.

---

## Testimonial Selection

Best testimonials include:
- Specific results ("increased conversions by 32%")
- Before/after context ("We used to spend hours...")
- Role + company for credibility
- Something quotable and specific

Avoid testimonials that just say "Great product!", "Love it!", or "Easy to use!"
