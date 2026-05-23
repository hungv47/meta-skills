# Lifecycle Email/SMS Sequences

Copy patterns for post-action lifecycle sequences — abandoned cart, post-purchase, win-back, and re-engagement. Each sequence is a coordinated set of messages, not a single piece of copy. The composition rule is **one psychological job per message**; stacking jobs in a single touch dilutes every one of them.

This file covers the *copy* layer. Timing windows, segmentation, and channel mix (email vs SMS vs in-app) are handled by `plan-campaign` and the operator's lifecycle tool. Where a sequence ties into a landing page, cross-reference `brief-landing-page`.

---

## Abandoned-Cart Recovery — The Three-Touch Sequence

A reader added to cart, did not complete checkout. They had intent. The job of the sequence is to remove the specific friction that stopped them, not to re-pitch the product.

### Sequence Architecture

| Touch | Timing | Psychological Job | Copy Pattern |
|---|---|---|---|
| **Touch 1** | ~1h after abandon | Restore-the-state | "You left something" + direct return link |
| **Touch 2** | ~12h after abandon | Validation via peer | One specific social-proof unit tied to the exact product in cart |
| **Touch 3** | ~24h after abandon | Friction-removal nudge | Modest, time-bound incentive — only if the operator's margins allow it |

Each touch does one job. Touch 1 is not "remind + social proof"; touch 3 is not "discount + urgency theater." Mixing jobs in a single touch is the most common failure.

### Touch 1 — Restore-the-State

**The job:** rebuild the cognitive context the reader had at the moment of abandon. Most cart abandons are interruptions, not decisions ("I'll come back to this") — so the touch acknowledges the interruption rather than treating it as objection.

**Copy pattern:**
- Subject line: short, factual, no emoji theatre. "Your {item} is still in your cart" or "Forgot something?"
- Body: name the item, show the item image, surface the direct-to-checkout link (not the homepage). Optional: one sentence on the value the reader was about to buy.
- CTA: single button — "Return to checkout" or "Finish my order"

**Anti-patterns:**
- Treating the abandon as objection — "We noticed you didn't buy. Here's why our product is great…" The reader already added to cart; they don't need re-pitching.
- Subject line urgency theatre ("⏰ HURRY!! Your cart expires in 1h"). Cart sessions usually don't expire that fast; the manufactured urgency reads as desperate.
- Discount in touch 1. Trains the audience to wait for the discount on future carts.

### Touch 2 — Validation via Peer

**The job:** if the reader hesitated because of social uncertainty ("is this actually good?"), give them the specific peer evidence that resolves it. If the reader hesitated for some other reason (price, shipping, fit), touch 2 doesn't fire correctly — segment them out if the operator can.

**Copy pattern:**
- Subject line: ties to the product, not the user. "Why {customer count} {audience descriptor} chose {product}" or "{customer name}: '{specific outcome quote}'"
- Body: ONE testimonial OR one numeric proof unit. Not three. Specificity beats volume.
- If the cart product has a star-rating + count, surface that. "{rating}/5 from {count} verified reviews" with a link to the actual reviews page.
- CTA: same as touch 1 — "Return to checkout"

**Anti-patterns:**
- Generic "loved by thousands" social proof. The reader already knows the brand has customers; they need to know if the product fits *them*.
- Stacking 3+ testimonials. Reads as desperate; one specific testimonial outperforms three generic ones.
- Re-introducing the product. They've seen the product page — don't re-pitch features here.

### Touch 3 — Friction-Removal Nudge

**The job:** lower the cost of completion just enough to overcome a small remaining objection. Only fires if (a) the operator's margin tolerates a discount, AND (b) the abandon pattern in this segment shows price-sensitivity. If neither, replace touch 3 with a graceful pause ("we'll stop emailing about this cart — your stuff will still be there if you change your mind").

**Copy pattern:**
- Subject line: specific incentive in plain language. "{Specific discount} on your {item}, valid for {time window}"
- Body: brief — restate the cart, name the incentive, name the expiration, single CTA.
- CTA: "Use my {discount} now" — first-person per CP-03.
- The discount window must actually expire. A "24h discount" that's still valid 2 weeks later trains the audience to ignore the urgency forever.

**Anti-patterns:**
- Discount that's bigger than the operator's margin. This is a business decision, not a copy decision — but copy should never claim a discount the operator hasn't approved.
- Stacking discount + free shipping + urgency + scarcity in one touch. Each lever dilutes the next.
- Sending touch 3 to customers who already buy at full price reliably. Train the rest of the segment to wait for the discount, lose the margin on the high-intent customers.

### Sequence Anti-Patterns (Across All Three Touches)

- **Four-touch or five-touch sequences.** Diminishing returns past touch 3; touches 4+ mostly train unsubscribes.
- **Same subject line across all three touches.** The mailbox preview collapses them; the reader sees one "didn't buy?" prompt three times and tunes out.
- **No segmentation by abandon reason.** A reader who hit a shipping-cost surprise gets a discount that doesn't fix the actual friction. If the operator can segment (added-to-cart-then-saw-shipping vs added-to-cart-then-left-domain vs added-to-cart-then-checkout-error), the sequence should branch.
- **No "stop receiving cart emails" link.** Annoyed readers unsubscribe from the whole list rather than just the cart sequence.

---

## Post-Purchase Onboarding — Pattern Shape

Same one-touch-one-job composition rule. The post-purchase sequence's first job is *not* to upsell — it's to reduce buyer's remorse and accelerate first-use. Upsell touches come after first-use is confirmed.

| Touch | Timing | Job |
|---|---|---|
| Touch 1 | Within 1h of purchase | Confirm + reassure ("you bought the right thing") |
| Touch 2 | Within 24h | First-use prompt — the smallest meaningful action the user can take to start getting value |
| Touch 3 | Within 7d | First-result prompt — surface the metric or moment that signals "this is working" |
| Touch 4 (optional) | Within 14-30d | Upsell / cross-sell / referral ask, conditional on first-result confirmation |

Detailed copy patterns for each touch belong in a future expansion — flagged as out-of-scope for the WS8 lifecycle-sequences addition.

---

## Win-Back — Pattern Shape

For customers who haven't purchased in a defined inactivity window (usually 3-6 months, varies by category). The sequence acknowledges the absence rather than pretending the gap doesn't exist.

| Touch | Timing | Job |
|---|---|---|
| Touch 1 | At inactivity threshold | "We noticed it's been a while" — honest, no guilt, restate the value |
| Touch 2 | +7d | One updated proof or one new product/feature relevant to their prior purchase |
| Touch 3 | +14d | Time-bound incentive OR graceful close ("we'll stop emailing — reply if you want to stay") |

Again — one job per touch. Detailed copy patterns deferred to a future expansion.

---

## Cross-References

- Per-line V/F/U scoring still applies to every lifecycle subject line + CTA. See `headline-formulas.md` for the headline patterns these subject lines should be tested against.
- CTA copy follows the formula in `_shared/marketing-foundations.md` § CTA Formula — "Return to checkout" and "Use my 10% off" both score, "Submit order" does not.
- Timing windows and segmentation logic are NOT in this file; consult `plan-campaign` for the campaign-level lifecycle planning.
- For lead-magnet sequences (post-opt-in nurture, not post-purchase), see `lead-magnet-stack.md` § DM-Capture Mechanics for the 24h follow-up rule.
