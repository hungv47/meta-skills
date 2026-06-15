# Churn Prevention

*Reference playbook for prioritize. Use when the diagnosed root cause (from diagnose) is churn.*

**Core Question:** "Why are customers leaving, and what's the minimum intervention to keep the right ones?"

## Inputs Required
- Churn data: current rate, known reasons, cancel flow data (if available)
- OR: User describes their churn situation

## Output
- `docs/forsvn/artifacts/meta/records/churn-prevention.md`

## Quality Gate
Before delivering, verify:
- [ ] Voluntary and involuntary churn addressed separately (they have different solutions)
- [ ] Every save offer maps to a specific exit reason (no generic "please stay" discounts)
- [ ] Cancel flow has ≥3 stages (not just a "Cancel" button)
- [ ] Dunning sequence has ≥3 touchpoints across ≥7 days
- [ ] Health score model uses ≥3 weighted signals (not just login frequency)
- [ ] Benchmarks cited for context (what "good" looks like for their segment)

## Chain Position
Previous: `diagnose` (when churn is identified as root cause) | Next: `plan-funnel` (set targets for retention interventions)

---

## Before Starting

### Step 0: Product Context
Check for `research/product-context.md`. If missing: **INTERVIEW.** Ask for product type, pricing model, customer segment (B2B/B2C), and current churn rate.

### Required Artifacts
| Artifact | Source | If Missing |
|----------|--------|------------|
| Churn data | User / analytics | **INTERVIEW.** Ask: current churn rate, known top reasons, B2B or B2C, monthly or annual billing, average customer lifetime. |

### Optional Artifacts
| Artifact | Source | Benefit |
|----------|--------|---------|
| `diagnose.md` | diagnose | Root cause context if churn was diagnosed as a problem |
| `product-context.md` | icp-research (from hungv47/research-skills) | Product and pricing context |

---

## Churn Taxonomy

All churn is either voluntary or involuntary. These are MECE branches — every churned customer falls into exactly one.

| Type | Definition | % of Total (typical) | Solution Category |
|------|-----------|---------------------|-------------------|
| **Voluntary** | Customer actively decides to leave | 60-70% | Cancel flow, save offers, value delivery |
| **Involuntary** | Payment fails, customer doesn't fix it | 30-40% | Dunning sequence, payment recovery |

Diagnose which type dominates before designing interventions — a product with 80% involuntary churn needs dunning optimization, not a better cancel flow.

---

## Step 1: Diagnose Churn Drivers

### For Voluntary Churn

Interview or analyze data for the top exit reasons. Categorize into this taxonomy:

| Exit Reason Category | Signal | Typical Save Approach |
|---------------------|--------|----------------------|
| **Price** | "Too expensive," downgrades before cancel | Discount, downgrade offer, annual lock-in |
| **Value not realized** | Low usage, never activated key feature | Onboarding help, feature walkthrough, success call |
| **Switched to competitor** | Mentions specific competitor | Competitive counter-offer, feature comparison |
| **Needs changed** | "No longer need this," business change | Pause option, reduced plan, check-in in 3 months |
| **Bad experience** | Support complaints, bugs, outages | Escalated support, credit, personal apology |
| **Missing feature** | "Doesn't do X," feature requests | Roadmap preview, workaround, beta access |
| **Temporary** | Seasonal business, budget freeze | Pause option (not cancel), reduced plan |

### For Involuntary Churn

Analyze payment failure data:
- What % of failed payments are recovered automatically (retry)?
- What % are recovered after customer contact?
- What % are never recovered?
- What payment methods fail most?
- Is there a pattern (e.g., end of month, expired cards)?

### Hypothesis Formation

For each major churn driver, form an If/Then/Because hypothesis:

```
If [intervention], then [churn metric] changes from [baseline] to [target],
because [root cause mechanism].
```

Example:
```
If we add a "pause subscription" option to the cancel flow, then voluntary
churn drops from 5.2% to 4.5%, because 15% of cancellers uses "temporary
need change" and would retain if they could pause instead of cancel.
```

---

## Step 2: Design Cancel Flow (Voluntary Churn)

The cancel flow is a structured sequence, not a single button. Each stage has a specific purpose.

### Cancel Flow Stages

```
Trigger → Survey → Dynamic Offer → Confirmation → Post-Cancel
```

**Stage 1: Trigger**
- Customer clicks "Cancel" or "Downgrade"
- Log the trigger context: which page, how long since last login, current plan

**Stage 2: Exit Survey**
- Ask ONE question: "What's your main reason for leaving?"
- Use the 7-category taxonomy from Step 1
- This answer drives the dynamic offer in Stage 3

**Stage 3: Dynamic Save Offer**
- Based on the exit reason, present a tailored offer:

| Exit Reason | Save Offer | Why This Works |
|-------------|-----------|----------------|
| Price | [X]% discount for [N] months, or downgrade to cheaper plan | Addresses stated objection directly |
| Value not realized | Free 1:1 onboarding session, or extended trial of premium features | Solves the activation gap |
| Switched to competitor | Feature comparison showing advantages + competitive offer | Counters with information |
| Needs changed | Pause for up to 3 months (free) | Preserves the relationship without forcing payment |
| Bad experience | Escalated support ticket + account credit | Shows you take it seriously |
| Missing feature | Roadmap preview + beta access when feature ships | Converts cancel into wait |
| Temporary | Pause subscription (resume anytime) | Removes the binary choice |

- Present ONE offer (not a menu). Relevance beats volume.
- Include a clear "No thanks, continue cancelling" option — forced retention creates resentment.

**Stage 4: Confirmation**
- If they accept the offer: confirm and log the save
- If they decline: confirm cancellation with a clear end date
- Ask: "Would you come back if [specific change]?" — this feeds the roadmap

**Stage 5: Post-Cancel**
- Send a goodbye email (not a guilt trip)
- Include: what they'll lose access to, how to reactivate, data export option
- Schedule a win-back email for 30/60/90 days

### Cancel Flow Benchmarks

| Metric | Good | Great |
|--------|------|-------|
| Cancel flow save rate | 15-25% | 25-35% |
| Exit survey completion | 60%+ | 80%+ |
| Post-cancel win-back (90 day) | 5-10% | 10-15% |

---

## Step 3: Design Dunning Sequence (Involuntary Churn)

Dunning = the process of recovering failed payments before they become churn.

### Dunning Sequence Timeline

| Day | Action | Channel | Tone |
|-----|--------|---------|------|
| 0 | Payment failed — auto-retry | System | N/A |
| 1 | "Payment issue" email — update payment method link | Email | Helpful, neutral |
| 3 | Retry payment + second email if still failing | Email + System | Slightly more urgent |
| 5 | In-app banner: "Update your payment to avoid interruption" | internal | Clear, direct |
| 7 | Third email: "Your account will be downgraded/paused in 3 days" | Email | Urgent, specific consequence |
| 10 | Final email: "Last chance — account will be paused tomorrow" | Email | Final, clear deadline |
| 11 | Pause/downgrade account (don't delete data) | System | N/A |
| 14 | "We've paused your account" email with one-click reactivation | Email | Warm, easy path back |

**Key principles:**
- **Never delete data immediately** — paused accounts reactivate at higher rates than re-signups
- **Retry automatically** before emailing — many failures resolve on retry
- **Show specific consequences** — "you'll lose access to X" is more motivating than "update your payment"
- **Make the fix easy** — one-click payment update link, not "log in and go to settings"

### Dunning Benchmarks

| Metric | Good | Great |
|--------|------|-------|
| Auto-retry recovery | 30-40% | 40-50% |
| Email-prompted recovery | 20-30% | 30-40% |
| Overall involuntary churn recovery | 50-60% | 60-70% |

---

## Step 4: Build Health Score Model

Predict churn before it happens. A health score aggregates usage signals into a single risk indicator.

### Early Warning Signals

These specific behaviors predict churn before it shows up in aggregate metrics:

| Signal | Lead Time | Severity |
|--------|-----------|----------|
| **Login frequency drops 50%+** | 2-4 weeks before cancel | Warning |
| **Billing page visits increase** | Days before cancel | High |
| **Data export initiated** | Days before cancel | Critical — immediate intervention |
| **Support ticket with negative sentiment** | 1-2 weeks | Warning |
| **Downgrade request** | Days | High |
| **Feature usage drops to zero** | 2-3 weeks | Warning |

**Data export is the strongest signal.** When a customer exports their data, they're preparing to leave. This should trigger immediate personal outreach — not an automated email.

### Health Score Signals

| Signal | Weight | Healthy | At Risk | Critical |
|--------|--------|---------|---------|----------|
| **Login frequency** | 20% | ≥3x/week | 1x/week | <1x/week |
| **Core feature usage** | 30% | Uses top 3 features regularly | Uses 1-2 features | Doesn't use core features |
| **Support ticket sentiment** | 15% | Positive/neutral | Negative | Repeated escalations |
| **Engagement trend** | 20% | Stable or increasing | Declining 2+ weeks | Declining 4+ weeks |
| **Contract/billing status** | 15% | Active, auto-renew | Approaching renewal | Overdue, downgraded |

**Weighted score formula:**
```
Health Score = (Login × 0.20) + (Feature Use × 0.30) + (Support × 0.15) +
 (Trend × 0.20) + (Billing × 0.15)
```

Score each signal 1-5, then compute weighted total:
- **4.0-5.0:** Healthy — nurture and upsell
- **2.5-3.9:** At Risk — proactive outreach
- **1.0-2.4:** Critical — immediate intervention

### Risk Response Playbook

| Score | Action | Owner |
|-------|--------|-------|
| At Risk (2.5-3.9) | Automated check-in email + in-app prompt for underused features | Product/Automated |
| Critical (1.0-2.4) | Personal outreach from CSM or support: "How can we help?" | CS team |
| Critical + approaching renewal | Executive-level save call + customized retention offer | CS lead |

---

## Step 5: Set Targets and Test

### Churn Benchmarks by Segment

| Segment | Monthly Churn (Good) | Monthly Churn (Great) | Annual Churn (Good) |
|---------|---------------------|-----------------------|--------------------|
| B2C SaaS | <5% | <3% | <50% |
| B2B SMB SaaS | <3% | <2% | <30% |
| B2B Mid-Market SaaS | <2% | <1% | <20% |
| B2B Enterprise SaaS | <1% | <0.5% | <10% |

### Testing Retention Interventions

Frame each hypothesis from Step 1 in the predictive form:

```
If [intervention], then [metric] from [baseline] to [target], because [reason].
```

Then ship the highest-impact, lowest-effort interventions first and measure against baselines from `plan-funnel`:
1. Cancel flow save offers (usually highest leverage)
2. Dunning sequence optimization (often low-effort, high-impact)
3. Health score-triggered outreach (requires more infrastructure)

---

## Artifact Template

```markdown
---
skill: churn-prevention
version: 1
date: [today's date]
status: draft
---

# Churn Prevention Plan

**Date:** [today]
**Skill:** churn-prevention
**Product:** [from product-context.md]
**Current Monthly Churn:** [X%]
**Segment:** [B2B/B2C, size]

## Churn Diagnosis

### Churn Split
| Type | Rate | % of Total | Primary Drivers |
|------|------|-----------|-----------------|
| Voluntary | [X%] | [X%] | [top 3 reasons] |
| Involuntary | [X%] | [X%] | [payment failure patterns] |

### Top Exit Reasons (Voluntary)
| Rank | Reason | % of Cancels | Current Save Rate |
|------|--------|-------------|-------------------|
| 1 | [reason] | [X%] | [X% or N/A] |
| 2 | [reason] | [X%] | [X% or N/A] |
| 3 | [reason] | [X%] | [X% or N/A] |

## Hypotheses
| # | If... | Then... | Because... |
|---|-------|---------|-----------|
| 1 | [intervention] | [metric change] | [mechanism] |
| 2 | [intervention] | [metric change] | [mechanism] |

## Cancel Flow Design

### Flow
Trigger → Survey → Dynamic Offer → Confirmation → Post-Cancel

### Save Offer Map
| Exit Reason | Save Offer | Expected Save Rate |
|-------------|-----------|-------------------|
| [reason] | [offer] | [X%] |

## Dunning Sequence
| Day | Action | Channel |
|-----|--------|---------|
| 0 | [action] | [channel] |
| 1 | [action] | [channel] |

## Health Score Model
| Signal | Weight | Healthy | At Risk | Critical |
|--------|--------|---------|---------|----------|
| [signal] | [X%] | [threshold] | [threshold] | [threshold] |

## Targets
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Overall monthly churn | [X%] | [X%] | [date] |
| Cancel flow save rate | [X%] | [X%] | [date] |
| Involuntary churn recovery | [X%] | [X%] | [date] |

## Priority Actions
| # | Action | Type | Impact | Effort |
|---|--------|------|--------|--------|
| 1 | [action] | Cancel Flow / Dunning / Health Score | H/M/L | H/M/L |

## Next Step

Pass top hypotheses to `plan-funnel` to set numeric targets, then ship the highest-impact, lowest-effort interventions first.

> On re-run: rename existing artifact to `churn-prevention.v[N].md` and create new with incremented version.
```

---

## Anti-Patterns

**Generic "please stay" discount** — Offering every canceller the same 20% discount regardless of their reason. A customer leaving because of a missing feature doesn't care about price. Map save offers to specific exit reasons.

**No cancel flow at all** — A single "Cancel" button with no survey, no offer, no confirmation. You lose the customer AND the intelligence about why they left. Even a 2-question exit survey is better than nothing.

**Aggressive retention tactics** — Dark patterns (hiding the cancel button, requiring a phone call, guilt-tripping) create resentment, negative reviews, and social media complaints that cost more than the saved revenue. Always include a clear "No thanks, cancel" option.

**Treating all churn as one metric** — Voluntary and involuntary churn have completely different solutions. Mixing them into one number masks whether you have a value problem or a payment problem.

**Over-engineering health scores before basics** — Building a predictive ML model when you don't have a cancel flow or dunning sequence is premature optimization. Fix the cancel flow first, then dunning, then health scores.

**Ignoring involuntary churn** — Many teams focus entirely on voluntary churn while 30-40% of their churn is failed payments. Dunning optimization is often the highest-ROI retention investment. Consider card updater services (an enterprise brand Account Updater, Mastercard ABU) — they reduce hard declines by 30-50% automatically.

**Training cancel-for-deals behavior** — Offering 50%+ discounts in the cancel flow teaches customers that cancelling is the way to get a deal. Cap save discounts at 20-30% for 2-3 months maximum. If someone cancels three times and gets saved each time, the pattern is the problem.

**No connection to diagnose** — Running churn-prevention in isolation when churn was identified as a root cause in `diagnose`. If `diagnose` identified churn as a root cause, read that artifact first — it may reveal specific churn drivers that should shape your cancel flow and save offers.

---

## References

- [churn-cancel-flow-templates.md](churn-cancel-flow-templates.md) — Email templates for cancel flow and dunning
- [churn-health-score-guide.md](churn-health-score-guide.md) — Detailed health score implementation guide
