# Logic Tree Examples

Worked examples of MECE logic trees for common business problems.

---

## Example 1: SaaS Churn Increasing

**Problem Statement:** Monthly churn is 6% instead of 3%, starting 2 months ago.

### Math Tree

```
Churn rate increasing (6% → 3% target)
├── Voluntary churn (user decides to leave)
│ ├── Product-related
│ │ ├── Feature gaps (missing functionality users need)
│ │ ├── Bugs/reliability (product not working as expected)
│ │ └── UX friction (too hard to use)
│ ├── Value-related
│ │ ├── Not achieving desired outcome
│ │ ├── Found better alternative
│ │ └── Price no longer justified
│ └── Circumstance-related
│ ├── Budget cuts / downsizing
│ ├── Role change (no longer needs product)
│ └── Project completed (temporary need)
└── Involuntary churn (payment failure)
 ├── Card expiration
 ├── Insufficient funds
 └── Payment processing errors
```

### Hypotheses

| # | Hypothesis | Likelihood | Impact | Testability |
|---|-----------|------------|--------|-------------|
| 1 | If a recent pricing change drove churn, then we'd see churn spike correlating with the price increase date and concentrated in price-sensitive segments | 4 | 5 | 5 |
| 2 | If a competitor launched a compelling alternative, then we'd see increased mentions in exit surveys and competitor signups | 3 | 4 | 4 |
| 3 | If a recent release introduced bugs, then we'd see increased support tickets and churn correlated with bug-affected features | 4 | 3 | 5 |
| 4 | If involuntary churn increased from payment failures, then we'd see higher failed payment rates in billing data | 3 | 3 | 5 |

---

## Example 2: E-Commerce Conversion Rate Dropping

**Problem Statement:** Site conversion rate is 1.2% instead of 2.5%, down from 3 months ago.

### Math Tree

```
Conversion rate dropping (1.2% → 2.5% target)
├── Traffic quality declining
│ ├── Channel mix shift (more low-intent traffic)
│ │ ├── Paid traffic targeting changed
│ │ ├── Organic traffic keyword shift
│ │ └── Social traffic increase (browsing, not buying)
│ ├── Audience mismatch (reaching wrong people)
│ └── Seasonality / external factors
├── On-site experience degrading
│ ├── Page load speed
│ ├── Mobile experience broken
│ ├── Navigation / UX changes
│ └── Content / product page quality
├── Purchase friction increasing
│ ├── Checkout flow issues
│ ├── Payment method problems
│ ├── Shipping cost/time surprises
│ └── Trust signals missing or broken
└── Offer/pricing issues
 ├── Price competitiveness
 ├── Promotion changes
 └── Stock availability
```

### Data Requirements (Top 3 Hypotheses)

| Hypothesis | Confirming Evidence | Data Source | Owner |
|------------|--------------------|----|-------|
| Channel mix shifted to low-intent | Conversion by channel shows new mix has lower-converting channels growing | Google Analytics | Marketing |
| Mobile experience broken | Mobile conversion dropped more than desktop | Analytics + device segmentation | Product |
| Checkout abandonment increased | Cart-to-purchase rate dropped, specific step with highest drop-off | Checkout funnel analytics | Product |

---

## Example 3: Content ROI Declining

**Problem Statement:** Content-attributed pipeline is $200K/quarter instead of $500K/quarter.

### Issue Tree

```
Content-attributed pipeline declining ($200K → $500K target)
├── Reach problem (fewer people seeing content)
│ ├── Organic search traffic declining
│ │ ├── Algorithm changes
│ │ ├── Keyword rankings lost
│ │ └── Fewer pages indexed
│ ├── Social distribution declining
│ │ ├── Posting frequency decreased
│ │ ├── Engagement rates down
│ │ └── Algorithm reach reduction
│ └── Email distribution declining
│ ├── List size shrinking
│ └── Open/click rates declining
├── Engagement problem (people see but don't engage)
│ ├── Content quality declining
│ ├── Topics not resonating
│ └── Format mismatch with audience
├── Conversion problem (engage but don't convert)
│ ├── CTAs not effective
│ ├── Conversion path broken
│ └── Offer not compelling
└── Attribution problem (converting but not tracked)
 ├── Tracking broken
 ├── Attribution model changed
 └── Pipeline reporting methodology changed
```

### Key Insight

Always include "measurement changed" as a branch. Sometimes the problem isn't performance — it's how you're counting.

---

## Example 4: B2B Pipeline Velocity Slowing

**Problem Statement:** Average deal cycle is 90 days instead of 60 days, and win rate is 18% instead of 25%.

### Math Tree

```
Pipeline velocity declining
├── Deal cycle lengthening (90 → 60 days)
│ ├── Top-of-funnel stage extending
│ │ ├── Lead quality declining (more unqualified leads entering)
│ │ ├── SDR response time increasing
│ │ └── Qualification criteria unclear
│ ├── Middle-of-funnel stage extending
│ │ ├── Stakeholder count increasing (more approvals needed)
│ │ ├── Competitive evaluation taking longer
│ │ └── Proof-of-concept/trial taking longer
│ └── Bottom-of-funnel stage extending
│ ├── Legal/procurement delays
│ ├── Budget approval process changed
│ └── Champion turnover mid-deal
└── Win rate declining (18% → 25%)
 ├── Competitive losses increasing
 │ ├── Feature gap vs. specific competitor
 │ ├── Price competitiveness
 │ └── Brand perception / trust
 ├── No-decision losses increasing
 │ ├── Status quo preference growing
 │ ├── Budget prioritization shifting
 │ └── Business case not compelling enough
 └── Qualification issues
 ├── Wrong-fit deals entering pipeline
 └── ICP definition needs updating
```

### Segmentation Approach

For B2B pipeline problems, always segment analysis by:
- **Deal size** (enterprise vs. mid-market vs. SMB)
- **Source** (inbound vs. outbound vs. partner)
- **Segment** (industry or use case)
- **Rep** (individual performance variation)

Often the "average" hides that one segment is fine and another is broken.
