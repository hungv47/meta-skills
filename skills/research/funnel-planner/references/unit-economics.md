# Unit Economics Guide

Formulas, calculations, and frameworks for understanding the economics of customer acquisition and retention.

---

## Metric Definitions

Precise definitions for common metrics. Ambiguous definitions cause alignment problems. Define once, measure consistently.

### User Metrics

**New User:** A person who creates an account or connects a wallet for the first time.

| Context | Definition |
|---------|------------|
| SaaS | First account creation (email verified) |
| Web3 | First wallet connection |
| Mobile | First app open (with user ID assigned) |
| E-commerce | First purchase OR first account creation |

**Active User (DAU/WAU/MAU):** A user who performs a meaningful action within the time period.

| Metric | Definition |
|--------|------------|
| DAU | Unique users with 1+ meaningful actions in 24 hours |
| WAU | Unique users with 1+ meaningful actions in 7 days |
| MAU | Unique users with 1+ meaningful actions in 30 days |

"Meaningful action" varies by product:
- SaaS: Login + feature use (not just login)
- Web3: On-chain transaction (not just wallet connect)
- E-commerce: Browse + add to cart (not just visit)

**Retained User:** A user active in period N who is also active in period N+1.

```
Retention Rate = (Users active in both Period A and Period B) / (Users active in Period A)
```

| Metric | Definition |
|--------|------------|
| D1 Retention | % of users active on day 0 who return on day 1 |
| D7 Retention | % of users active on day 0 who return on day 7 |
| D30 Retention | % of users active on day 0 who return on day 30 |

**Churned User:** A user who was active but has not returned within the expected timeframe.

```
Churn Rate = (Users who churned in period) / (Users at start of period)
```

| Product Type | Churn Threshold |
|--------------|-----------------|
| Daily use product | No activity in 7 days |
| Weekly use product | No activity in 30 days |
| Monthly use product | No activity in 90 days |
| Subscription | Cancellation or non-renewal |

---

## Core Metrics

### Cost Per Impression (CPM)

What you pay per 1,000 ad impressions.

```
CPM = (Total Ad Spend / Total Impressions) × 1,000
```

**Example:**
- Spend: $500
- Impressions: 100,000
- CPM = ($500 / 100,000) × 1,000 = **$5**

**Benchmarks (2025):**
| Platform | Avg CPM |
|----------|---------|
| Facebook | $7-15 |
| Instagram | $8-12 |
| LinkedIn | $25-40 |
| Google Display | $2-5 |
| YouTube | $10-30 |
| TikTok | $6-10 |

---

### Cost Per Click (CPC)

What you pay each time someone clicks your ad.

```
CPC = Total Ad Spend / Total Clicks
```

**Example:**
- Spend: $500
- Clicks: 250
- CPC = $500 / 250 = **$2**

**Relationship to CPM:**
```
CPC = CPM / (CTR × 10)
```

**Benchmarks (2025):**
| Platform | Avg CPC |
|----------|---------|
| Google Search | $2-5 |
| Google Display | $0.50-2 |
| Facebook | $0.50-2 |
| LinkedIn | $5-10 |
| Twitter | $0.50-3 |

---

### Cost Per Lead (CPL)

What you pay to acquire a lead (email, signup, form submission).

```
CPL = Total Marketing Spend / Total Leads Generated
```

**Example:**
- Total spend: $10,000
- Leads: 200
- CPL = $10,000 / 200 = **$50**

**Benchmarks by industry:** See [benchmarks.md](benchmarks.md)

---

### Cost Per Acquisition (CPA)

What you pay for a specific conversion action (purchase, signup, etc.).

```
CPA = Total Campaign Spend / Total Conversions
```

**Example:**
- Campaign spend: $5,000
- Purchases: 50
- CPA = $5,000 / 50 = **$100**

**CPA vs CAC:**
- CPA = cost for a specific action (can be any conversion)
- CAC = total cost to acquire a paying customer (more comprehensive)

---

### Customer Acquisition Cost (CAC)

Total cost to acquire one new paying customer.

```
CAC = (Marketing Spend + Sales Spend) / New Customers Acquired
```

**Comprehensive CAC formula:**
```
CAC = (Ad Spend + Content Costs + Marketing Tools + Marketing Salaries + Sales Salaries + Sales Tools + Onboarding Costs) / New Customers
```

**Example:**
- Ad spend: $20,000
- Content/creative: $5,000
- Marketing team (allocated): $10,000
- Sales team (allocated): $15,000
- Tools: $2,000
- **Total: $52,000**
- New customers: 100
- CAC = $52,000 / 100 = **$520**

### Blended vs Channel CAC

**Blended CAC:** Total marketing spend / total new customers
**Channel CAC:** Channel-specific spend / channel-attributed customers

| Channel | Spend | Customers | Channel CAC |
|---------|-------|-----------|-------------|
| Google Ads | $20,000 | 30 | $667 |
| Facebook | $15,000 | 40 | $375 |
| Content/SEO | $10,000 | 25 | $400 |
| Referral | $5,000 | 20 | $250 |
| **Blended** | **$50,000** | **115** | **$435** |

### Channel LTV Attribution

CAC alone is incomplete. Different channels produce customers with different lifetime values.

**Channel LTV Formula:**
```
Channel LTV = Average LTV of customers acquired through channel
Channel LTV:CAC = Channel LTV / Channel CAC
```

**Example: Channel Quality Comparison**

| Channel | CAC | Avg LTV | LTV:CAC | Verdict |
|---------|-----|---------|---------|---------|
| Google Ads | $667 | $3,500 | 5.2:1 | Scale |
| Facebook | $375 | $1,200 | 3.2:1 | Maintain |
| Content/SEO | $400 | $4,200 | 10.5:1 | Invest heavily |
| Referral | $250 | $5,000 | 20:1 | Maximize |
| Paid Influencer | $800 | $1,600 | 2:1 | Optimize or cut |

**Why Channel LTV Matters:**
- Low CAC with low LTV = false efficiency
- High CAC with high LTV = potentially worth it
- Optimizing for CAC alone can shift spend to low-quality channels

**Measuring Channel LTV:**
1. Tag customers by acquisition channel at signup
2. Track revenue over 12-24 months by cohort
3. Calculate average LTV per channel
4. Update channel strategy based on LTV:CAC, not just CAC

---

## Customer Value Metrics

### Average Revenue Per User (ARPU)

Average revenue generated per user over a time period.

```
ARPU = Total Revenue / Total Users
```

**Monthly ARPU:**
```
Monthly ARPU = MRR / Total Active Users
```

**Example:**
- MRR: $100,000
- Active users: 2,000
- Monthly ARPU = $100,000 / 2,000 = **$50**

### Average Revenue Per Paying User (ARPPU)

Revenue from paying users only (excludes free tier).

```
ARPPU = Total Revenue / Paying Users
```

---

### Customer Lifetime Value (LTV / CLV)

Total revenue expected from a customer over their lifetime.

**Simple formula:**
```
LTV = ARPU × Average Customer Lifespan (months)
```

**With gross margin:**
```
LTV = ARPU × Gross Margin % × Customer Lifespan
```

**Churn-based formula:**
```
LTV = ARPU × Gross Margin % / Monthly Churn Rate
```

**Example:**
- Monthly ARPU: $100
- Gross margin: 80%
- Monthly churn: 5%
- LTV = $100 × 0.80 / 0.05 = **$1,600**

### LTV by Segment

Different customer segments have different LTVs:

| Segment | ARPU | Lifespan | LTV |
|---------|------|----------|-----|
| SMB | $50 | 18 months | $900 |
| internal | $200 | 30 months | $6,000 |
| Enterprise | $1,000 | 48 months | $48,000 |

---

## Efficiency Ratios

### LTV:CAC Ratio

The fundamental unit economics ratio.

```
LTV:CAC = Lifetime Value / Customer Acquisition Cost
```

**Example:**
- LTV: $2,400
- CAC: $600
- LTV:CAC = $2,400 / $600 = **4:1**

**Interpretation:**

| Ratio | Assessment | Action |
|-------|------------|--------|
| < 1:1 | Losing money on every customer | Stop spending, fix fundamentals |
| 1:1 - 2:1 | Barely sustainable | Reduce CAC or increase LTV |
| 3:1 | Healthy baseline | Maintain, optimize |
| 3:1 - 5:1 | Strong unit economics | Scale acquisition |
| > 5:1 | Potentially underinvesting | Increase acquisition spend |

### CAC Payback Period

Months to recover the cost of acquiring a customer.

```
Payback Period = CAC / (ARPU × Gross Margin)
```

**Example:**
- CAC: $600
- Monthly ARPU: $100
- Gross margin: 80%
- Monthly contribution: $100 × 0.80 = $80
- Payback = $600 / $80 = **7.5 months**

**Target payback by segment:**
| Segment | Target Payback |
|---------|----------------|
| SMB | < 12 months |
| internal | < 18 months |
| Enterprise | < 24 months |

---

## ROI Calculations

### Return on Investment (ROI)

Overall return on marketing investment.

```
ROI = ((Revenue from Campaign - Campaign Cost) / Campaign Cost) × 100
```

**Example:**
- Campaign cost: $10,000
- Revenue generated: $35,000
- ROI = (($35,000 - $10,000) / $10,000) × 100 = **250%**

### Return on Ad Spend (ROAS)

Revenue generated per dollar of ad spend.

```
ROAS = Revenue from Ads / Ad Spend
```

**Example:**
- Ad spend: $5,000
- Revenue: $20,000
- ROAS = $20,000 / $5,000 = **4:1** (or 400%)

**ROAS vs ROI:**
- ROAS only considers ad spend
- ROI considers all costs (creative, team, tools)

**Target ROAS by business model:**
| Business | Target ROAS |
|----------|-------------|
| E-commerce (low margin) | 4:1+ |
| E-commerce (high margin) | 2:1+ |
| SaaS | 3:1+ |
| Lead gen | 1:1+ (LTV makes up difference) |

### Incremental ROI

ROI from incremental spend (useful for scaling decisions).

```
Incremental ROI = (Incremental Revenue - Incremental Cost) / Incremental Cost
```

**Example:**
- Base spend: $10,000, Revenue: $40,000
- New spend: $15,000, Revenue: $55,000
- Incremental spend: $5,000
- Incremental revenue: $15,000
- Incremental ROI = ($15,000 - $5,000) / $5,000 = **200%**

---

## Funnel Economics

### Calculating Cost at Each Stage

Build a cost model from top to bottom:

| Stage | Volume | Rate | Cumulative Cost |
|-------|--------|------|-----------------|
| Impressions | 100,000 | $5 CPM | $500 |
| Clicks | 2,000 | $0.25 CPC | $500 |
| Leads | 100 | $5 CPL | $500 |
| Customers | 10 | $50 CPA | $500 |

**Total spend: $500 | Total customers: 10 | CAC: $50**

### Stage Economics Framework

For each funnel stage, calculate:

```
Stage Cost = Previous Stage Cost / Conversion Rate
```

**Example:**
- CPM: $10 (cost per 1,000 impressions)
- CTR: 2% → CPC = $10 / (0.02 × 10) = $0.50
- Visit-to-Lead: 5% → CPL = $0.50 / 0.05 = $10
- Lead-to-Customer: 10% → CPA = $10 / 0.10 = $100

### Sensitivity Analysis

How improvements at each stage affect final cost:

| Scenario | CTR | Visit→Lead | Lead→Cust | Final CAC |
|----------|-----|------------|-----------|-----------|
| Baseline | 2% | 5% | 10% | $100 |
| +50% CTR | 3% | 5% | 10% | $67 |
| +50% Visit→Lead | 2% | 7.5% | 10% | $67 |
| +50% Lead→Cust | 2% | 5% | 15% | $67 |
| All improved | 3% | 7.5% | 15% | $30 |

Small improvements compound significantly.

---

## Budget Planning

### Working Backwards from Goals

**Given:** Revenue target and unit economics
**Find:** Required budget

```
Required Customers = Revenue Target / Average Deal Value
Required Budget = Required Customers × CAC
```

**Example:**
- Revenue target: $1,000,000
- Average deal: $10,000
- Customers needed: 100
- CAC: $2,000
- Budget needed: 100 × $2,000 = **$200,000**

### Working Backwards with Funnel

```
Target customers: 100
Lead-to-customer rate: 5%
Required leads: 100 / 0.05 = 2,000 leads

CPL: $50
Required budget: 2,000 × $50 = $100,000
```

### Budget Allocation by Funnel Stage

| Stage | % Allocation | Purpose |
|-------|--------------|---------|
| Top (Awareness) | 30-40% | Volume generation, brand building |
| Middle (Consideration) | 30-40% | Nurturing, education, qualification |
| Bottom (Conversion) | 20-30% | Closing, activation |
| Retention | 10-20% | Reducing churn, expansion |

**Adjust by situation:**
- **New product:** Heavy top (50%+)
- **Mature product:** Balance or heavy bottom
- **High churn:** Increase retention (20-30%)
- **Efficient top:** Shift to middle/bottom

---

## Decision Frameworks

### When to Scale

Scale acquisition when:
- [ ] LTV:CAC > 3:1
- [ ] Payback < 12 months (SMB) or < 18 months (MM)
- [ ] Incremental ROAS > target ROAS
- [ ] Churn is stable or declining
- [ ] Operational capacity can handle growth

### When to Optimize vs Scale

| Situation | Action |
|-----------|--------|
| LTV:CAC < 3:1 | Optimize before scaling |
| CAC rising, LTV flat | Optimize channels, improve conversion |
| LTV rising, CAC flat | Scale spending |
| Both improving | Scale aggressively |
| Both declining | Pause, diagnose, fix |

### Channel Prioritization

Rank channels by efficiency and scale potential:

| Channel | CAC | Scale Potential | Priority |
|---------|-----|-----------------|----------|
| Referral | $150 | Limited | High (maximize) |
| SEO | $300 | High | High (invest) |
| Paid Social | $500 | High | Medium (optimize then scale) |
| Paid Search | $700 | Medium | Medium |
| Outbound | $1,200 | Low | Low (for strategic accounts) |

---

## Templates

### Unit Economics Summary

```markdown
## Unit Economics: [Product/Company Name]

### Customer Acquisition
| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| Blended CAC | $ | $ | |
| Organic CAC | $ | $ | |
| Paid CAC | $ | $ | |

### Customer Value
| Metric | Value |
|--------|-------|
| Monthly ARPU | $ |
| Gross Margin | % |
| Monthly Churn | % |
| Avg Lifespan | months |
| LTV | $ |

### Efficiency
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LTV:CAC | :1 | 3:1+ | |
| Payback | months | <12 mo | |

### Channel Economics
| Channel | Spend | Customers | CAC | LTV:CAC |
|---------|-------|-----------|-----|---------|
| | $ | | $ | :1 |

### ROI Summary
| Period | Spend | Revenue | ROI |
|--------|-------|---------|-----|
| | $ | $ | % |
```

### Monthly Economics Report

```markdown
## Monthly Economics Report: [Month Year]

### Key Metrics
- New Customers: X
- Blended CAC: $X
- Monthly ARPU: $X
- Churn Rate: X%
- LTV:CAC: X:1

### Month-over-Month Changes
| Metric | This Month | Last Month | Change |
|--------|------------|------------|--------|
| CAC | $ | $ | % |
| ARPU | $ | $ | % |
| Churn | % | % | % |
| LTV:CAC | :1 | :1 | |

### Channel Performance
[Table by channel]

### Actions for Next Month
1. [Based on analysis]
2. [Based on analysis]
```

---

## Web3-Specific Metrics

### Total Value Locked (TVL)

Total value of assets deposited in a protocol.

```
TVL = Sum of (Token amount x Token price) for all deposited assets
```

**Variations:**

| Metric | Definition |
|--------|------------|
| TVL | Gross value deposited |
| TVL ex-native | Excluding protocol's own token |
| Adjusted TVL | Excluding incentivized/subsidized deposits |

### Protocol Revenue

Fees paid to the protocol (not LPs/stakers).

```
Protocol Revenue = Total fees x Protocol fee share
```

**Example (DEX):**
```
Trading volume: $10M
Fee rate: 0.3%
Total fees: $30,000
Protocol share: 20%
Protocol revenue: $6,000
```

### Wallet Connect Rate

```
Wallet Connect Rate = Unique wallets connected / Unique visitors x 100
```

### Transaction Rate

```
Transaction Rate = Wallets with 1+ transaction / Wallets connected x 100
```

---

## Statistical Confidence

### Sample Size Requirements

Before setting targets based on current metrics, verify sample size:

| Current Rate | Sample Needed for +/-10% confidence |
|--------------|-------------------------------------|
| 1% | ~10,000 |
| 5% | ~2,000 |
| 10% | ~1,000 |
| 25% | ~400 |
| 50% | ~200 |

### Confidence Intervals

When reporting baselines:
```
Example: Conversion rate = 8% (+/-1.5%, 95% confidence)
Sample: 1,000 users
```

If confidence interval is wide (+/-30%+), baseline is unreliable for target-setting.

---

## Retention & Reactivation Economics

Retention is typically 3-5x more cost-effective than acquisition. This section covers the economics of keeping and recovering customers.

### Cost to Retain (CTR)

What it costs to keep an existing customer active.

```
Cost to Retain = Retention Program Costs / Customers Retained
```

**Retention costs include:**
- Customer success team (allocated)
- Retention campaigns
- Loyalty programs
- Proactive support

**Example:**
- CS team (retention focus): $50,000/mo
- Retention campaigns: $10,000/mo
- Total: $60,000/mo
- Customers retained (would have churned): 150
- Cost to Retain = $60,000 / 150 = **$400**

### Cost to Reactivate (CTA)

What it costs to bring back a churned customer.

```
Cost to Reactivate = Win-back Program Costs / Customers Reactivated
```

**Example:**
- Win-back campaigns: $15,000/mo
- Reactivation offers/discounts: $5,000/mo
- Staff time: $10,000/mo
- Total: $30,000/mo
- Customers reactivated: 40
- Cost to Reactivate = $30,000 / 40 = **$750**

### Retention Economics Comparison

| Action | Typical Cost | vs. New CAC | ROI Multiplier |
|--------|--------------|-------------|----------------|
| Retain active customer | $50-200 | 10-20% of CAC | 5-10x |
| Save at-risk customer | $200-500 | 25-50% of CAC | 2-4x |
| Reactivate churned | $500-1,000 | 50-100% of CAC | 1-2x |
| Acquire new customer | $500-2,000 | 100% (baseline) | 1x |

**Key insight:** It's almost always cheaper to prevent churn than acquire new customers.

### Retention ROI Formula

```
Retention ROI = (LTV Preserved - Retention Cost) / Retention Cost

LTV Preserved = LTV × Customers Who Would Have Churned Without Intervention
```

**Example:**
- Customers saved from churn: 50
- Average LTV: $2,000
- LTV Preserved: 50 × $2,000 = $100,000
- Retention program cost: $20,000
- Retention ROI = ($100,000 - $20,000) / $20,000 = **400%**

### Churn Economics

Understanding the true cost of losing a customer.

```
Cost of Churn = Lost LTV + Replacement CAC + Opportunity Cost

Where:
- Lost LTV = Remaining lifetime value at time of churn
- Replacement CAC = Cost to acquire equivalent new customer
- Opportunity Cost = Referrals, expansion revenue lost
```

**Example:**
- Customer churns at month 6 of expected 24-month lifetime
- Monthly revenue: $100
- Lost LTV: 18 months × $100 = $1,800
- Replacement CAC: $600
- Opportunity cost (referral value): $200
- **True cost of churn: $2,600**

---

## Cross-Funnel Metrics

Metrics that span multiple funnel stages to give a complete picture.

### Full Funnel Efficiency

```
Full Funnel Efficiency = Revenue / Total Funnel Spend

Where Total Funnel Spend includes:
- Acquisition spend
- Activation/onboarding costs
- Retention program costs
- Customer success costs
```

### Customer Profitability

```
Customer Profitability = LTV - CAC - Cost to Serve

Cost to Serve = (Support costs + Success costs + Infrastructure) / Customers
```

**Segment by profitability:**

| Segment | LTV | CAC | Cost to Serve | Profit | Action |
|---------|-----|-----|---------------|--------|--------|
| Enterprise | $10,000 | $3,000 | $2,000 | $5,000 | Invest |
| internal | $3,000 | $1,000 | $500 | $1,500 | Grow |
| SMB | $500 | $200 | $200 | $100 | Automate |
| Free | $0 | $50 | $50 | -$100 | Convert or churn |

### Funnel Velocity

How quickly users move through your funnel.

```
Funnel Velocity = Customers Acquired × Win Rate × Average Deal Value / Cycle Time
```

**Stage-level velocity:**

| Stage | Avg Time | Benchmark | Action if Slow |
|-------|----------|-----------|----------------|
| Visit → Lead | 1-2 visits | <7 days | Improve CTAs |
| Lead → Activated | 1-3 days | <14 days | Improve onboarding |
| Activated → Paid | 7-14 days | <30 days | Improve trial experience |
| Paid → Retained | Ongoing | - | Improve value delivery |

### Net Revenue Retention (NRR)

```
NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR × 100
```

**NRR Benchmarks:**

| NRR | Assessment |
|-----|------------|
| <90% | Leaky bucket, fix churn first |
| 90-100% | Stable, focus on expansion |
| 100-110% | Good, growth from existing |
| >110% | Excellent, can grow without new acquisition |

### Cross-Funnel Dashboard Template

```markdown
## Cross-Funnel Economics: [Period]

### Acquisition
| Metric | Value | Benchmark |
|--------|-------|-----------|
| New Customers | | |
| Blended CAC | $ | $ |
| Best Channel LTV:CAC | :1 | 3:1+ |

### Retention
| Metric | Value | Benchmark |
|--------|-------|-----------|
| Logo Retention | % | >90% |
| NRR | % | >100% |
| Avg Cost to Retain | $ | <25% of CAC |

### Efficiency
| Metric | Value | Benchmark |
|--------|-------|-----------|
| LTV:CAC (blended) | :1 | 3:1+ |
| Payback Period | mo | <12 mo |
| Customer Profitability | $ | Positive |

### Health
| Metric | Value | Trend |
|--------|-------|-------|
| Healthy Users (80-100) | % | |
| At-Risk Users (40-59) | % | |
| Win-back Rate | % | |
```

---

## Reactivation Quality Metrics

Reactivation rate alone is misleading. A high reactivation rate with poor post-reactivation retention just delays inevitable churn. Track quality, not just quantity.

### Core Reactivation Quality Metrics

| Metric | Formula | Healthy Benchmark | Poor Benchmark |
|--------|---------|-------------------|----------------|
| **Post-Reactivation D7** | % reactivated still active 7d after return | >50% | <30% |
| **Post-Reactivation D30** | % reactivated still active 30d after return | >35% | <20% |
| **Post-Reactivation D90** | % reactivated still active 90d after return | >25% | <15% |
| **Second Churn Rate** | % who churn again within 90d of reactivation | <50% | >65% |
| **LTV Post-Reactivation** | Revenue generated after return / Original LTV | >50% | <25% |
| **Time to Second Value** | Days from reactivation to meaningful action | <7 days | >14 days |

### Why Quality Matters More Than Quantity

**The Reactivation Trap:**
```
High reactivation rate + high second-churn rate = wasted effort

Example:
- 1,000 churned users
- 30% reactivation rate = 300 reactivated
- 70% second-churn rate = 210 churn again
- Net retained: 90 users
- Effective rate: 9%

vs.

- 1,000 churned users
- 15% reactivation rate = 150 reactivated
- 40% second-churn rate = 60 churn again
- Net retained: 90 users
- Effective rate: 9%

Same result, but second scenario used half the effort.
```

**Key Insight:** If second-churn rate >50%, focus on reactivation quality (targeting, messaging, onboarding) rather than volume.

### Quality Metrics by Churn Cohort

| Churn Cohort | Reactivation Rate | Expected Post-React D30 | Second Churn Risk |
|--------------|-------------------|-------------------------|-------------------|
| Early Churn (D0-7) | 10-20% | 25-35% | High (60-70%) |
| Mid Churn (D7-30) | 15-30% | 35-45% | Medium (50-60%) |
| Late Churn (D30-90) | 25-45% | 45-55% | Medium (40-50%) |
| Mature Churn (D90+) | 35-60% | 55-65% | Low (30-40%) |
| Repeat Churn | 20-40% | 20-30% | Very High (70-80%) |

### Reactivation Quality Improvement Levers

| Lever | Impact on Quality | Implementation |
|-------|-------------------|----------------|
| **Better targeting** | +10-20% D30 retention | Segment churned users, focus on high-potential |
| **Cohort-specific messaging** | +5-15% D30 retention | Different message for early vs. mature churn |
| **Re-onboarding flow** | +10-15% D30 retention | Don't assume they remember how to use product |
| **Quick win focus** | +15-25% D30 retention | Get them to value within first session |
| **Root cause resolution** | +20-30% D30 retention | Address why they churned before reactivating |

### Reactivation Quality Dashboard

```markdown
## Reactivation Quality Report: [Period]

### Volume Metrics
| Metric | This Period | Prior Period | Change |
|--------|-------------|--------------|--------|
| Reactivation Attempts | | | |
| Reactivations | | | |
| Reactivation Rate | % | % | |

### Quality Metrics
| Metric | This Period | Prior Period | Benchmark |
|--------|-------------|--------------|-----------|
| Post-React D7 | % | % | >50% |
| Post-React D30 | % | % | >35% |
| Second Churn Rate | % | % | <50% |
| LTV Post-React | $ | $ | >50% of orig |

### Quality by Cohort
| Cohort | Reactivated | Post-React D30 | Second Churn |
|--------|-------------|----------------|--------------|
| Early | | % | % |
| Mid | | % | % |
| Late | | % | % |
| Mature | | % | % |
| Repeat | | % | % |

### Insights
1. [Best performing cohort and why]
2. [Worst performing cohort and action]
3. [Quality trend over time]

### Actions
- [ ] [Based on quality analysis]
```

### When to Deprioritize Reactivation

Stop investing heavily in reactivation when:

| Signal | Threshold | Action |
|--------|-----------|--------|
| Second churn rate | >65% | Focus on prevention over reactivation |
| Post-react D30 | <20% | Improve quality before scaling |
| LTV post-react | <25% of original | Reactivated users aren't valuable enough |
| Cost to reactivate | >CAC | Cheaper to acquire new users |
| Repeat churn rate | >75% | These users fundamentally don't fit |

**Key Insight:** Sometimes the right answer is to let churned users go and focus resources on retention (preventing churn) rather than reactivation (recovering churn).
