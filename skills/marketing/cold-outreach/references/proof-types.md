# Proof Types: Hierarchy

Which proof earns trust. Consumed by proof-selector and critic.

## The Hierarchy

From strongest to weakest. Pick the highest tier you can support truthfully.

### Tier 1: Named Case Study + Specific Number + Verifiable

**Structure:** [Named entity] + [specific action/outcome] + [specific metric] + [optional: link to public artifact].

**Examples:**
- "Helped Ramp's ops team cut close time from 9 days to 4 — case study on our site: [link]."
- "Linear's team onboards in 3 days instead of 11. They talked about it on [specific podcast]."
- "Built this for a Series-B fintech — they cut 'unknown source' in their attribution from 38% to 6%."

**Why it's the top:**
- Named entity = verifiable credibility
- Specific number = falsifiable claim
- Verifiable artifact = reader can check if they want
- Recency matters: within 12 months ideal

**Requirements to use:**
- You have permission to name the client OR the case study is already public
- The number is real and you can back it up if asked
- The context matches (or is close to) the prospect's situation

### Tier 2: Named Logo + Anonymous Metric

**Structure:** [Named entity/entities] + [anonymized outcome description].

**Examples:**
- "Work with Ramp, Mercury, and three others in the Series-B fintech space — average close time dropped 55%."
- "Our customers include Linear, Vercel, and Retool — most cut onboarding time by over 60%."

**Why it's tier 2:**
- Names anchor credibility
- Anonymous metric is less verifiable than Tier 1 but still falsifiable in aggregate
- Works when you can't attribute specific outcomes to specific clients but have permission to list logos

**Use when:**
- Case study is in development but not published
- Client doesn't want specific attribution but allows logo use
- You want to reference multiple clients at once

**Warning:** Don't stack more than 3 logos. 5+ looks like you're compensating.

### Tier 3: Anonymous + Specific Context + Number

**Structure:** [Anonymous descriptor matching the prospect's context] + [specific metric].

**Examples:**
- "A Series-B SaaS company in our portfolio cut close time from 9 days to 4."
- "One of our fintech customers (50-200 headcount) reduced 'unknown source' attribution from 38% to 6%."
- "A recent client — post-Series-A marketplace — ran their first paid ads campaign in 14 days from zero prior spend."

**Why it's tier 3:**
- Specificity in the number
- Context specificity makes it relevant to the reader
- Loss of verifiability compared to named

**Use when:**
- Client hasn't approved naming
- You want to reference patterns across multiple clients without naming all

**Rule:** Match the anonymous descriptor tightly to the prospect. "A Series-B SaaS" is useless if the prospect is a Series-A consumer marketplace.

### Tier 4: Specific Testimonial Quote

**Structure:** ["Specific, falsifiable quote"] — [Attribution: title + company descriptor].

**Examples:**
- '"Cut our close time in half in the first month." — VP Ops, Series-B fintech.'
- '"Stopped doing pre-call research entirely — saving ~10 hours/week per AE." — Head of Sales, B2B SaaS.'

**Why it's tier 4:**
- Testimonials are usually accurate but inflated
- Specific quotes are still falsifiable; generic quotes are not

**Requirements:**
- Quote is specific (has a number or a concrete outcome)
- Attribution is at least title + company descriptor
- Quote is in the client's actual register (not polished marketing-speak)

**Banned:**
- '"Great team, great product!" — CEO' — unfalsifiable, could be said about anything
- Unattributed quotes
- Quotes so long they feel like sales copy

### Tier 5: Your Own Background / Credential

**Structure:** [Your prior experience] + [specific relevance to what you're claiming].

**Examples:**
- "I built the attribution system at Stripe before this — saw every edge case firsthand."
- "Was head of ops at [known company] during the Series-B-to-C scale. This is the problem I wish I'd had a tool for."

**Why it's tier 5:**
- Proof of competence without client outcomes
- Works when you have no client proof yet
- Depends on the prior employer's credibility signal

**Use when:**
- Early-stage founder with strong prior-company background
- Pivoting into a new space where you have relevant but not directly-transferable experience
- Proof-of-expertise rather than proof-of-outcome

**Warning:** Only works if the prior company is recognizable. "Worked at a Series-B SaaS in 2019" doesn't land.

### Tier 6 (avoid): Generic Self-Claim

**Examples:**
- "Trusted by leading B2B SaaS companies."
- "Our customers love us."
- "Industry-leading platform."
- "Proven results."

**Why to avoid:**
- Unfalsifiable
- Pattern-matches to spam
- Critic auto-fails messages that use these
- Readers discount them in <1 second

**Replace with:** nothing at all, OR a tier 3-4 claim.

## Relevance Beats Rank

**The highest-tier proof that's IRRELEVANT beats nothing, but loses to a LOWER-tier proof that's highly relevant.**

Example:
- Selling to a Series-A SaaS founder
- You have: (a) Tier-1 proof — Ramp case study, (b) Tier-3 proof — "a Series-A founder launched paid ads in 2 weeks from zero"

The Tier-3 proof wins. The prospect identifies with "Series-A founder, zero prior spend" more than with enterprise-adjacent Ramp. Relevance is the tiebreaker.

**Composer rule:** If Tier-1 doesn't match the prospect's situation well, degrade to Tier-3 and match the context tightly.

## Proof-per-Message Rules

- **One proof point per message.** Never two.
- **Stack only in long-form touchpoints** (e.g., a case study doc, not a touch-1 email).
- **Name a number.** Proof without a number is weak. If your proof has no number, find one or switch to a different proof point.
- **Verifiability matters.** A link to the case study (where it exists) beats the same claim without a link.

## Proof Anti-Patterns

- **Listing 5 logos in touch 1.** Reads as "look how legit we are" — vendor behavior. One logo, one number.
- **Unverifiable numbers.** "Our customers have saved $50M combined." Where's the breakdown? Reader discounts it.
- **Stacking proof + more proof.** "We helped Ramp, Mercury, and Linear. Our customers include 500+ companies. We're the leading platform for..."
- **Irrelevant tier-1.** "Worked with an enterprise brand" to a Series-A founder. Size mismatch kills relevance.
- **Testimonials that say nothing.** "Great team, great service" — cut.
- **Humblebragging.** "We were lucky to work with [name]." The luck framing undercuts the proof.
- **Over-qualified numbers.** "Cut close time by approximately 52-58%." Pick one. "Cut close time from 9 days to 4" beats "by approximately 55%."
