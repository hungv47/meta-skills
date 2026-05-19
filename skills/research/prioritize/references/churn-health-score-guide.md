# Health Score Implementation Guide

How to build, calibrate, and act on a customer health score model.

---

## Model Design

### Signal Selection

Choose 4-6 signals that predict churn in your product. The default model uses 5 signals, but you should adapt weights based on your data.

**Default Signals:**

| Signal | What to Measure | Why It Predicts Churn |
|--------|----------------|----------------------|
| Login frequency | Sessions per week | Declining logins precede cancellation by 2-4 weeks |
| Core feature usage | % of top 3 features used in last 14 days | Users who don't activate core features churn at 3-5x the rate |
| Support sentiment | Tone of last 3 support interactions | Negative support experiences are the #1 trigger for voluntary churn |
| Engagement trend | Week-over-week change in usage | A declining trend is more predictive than absolute usage level |
| Billing status | Payment health + renewal proximity | Failed payments and approaching renewals are action triggers |

### Signal Scoring (1-5 Scale)

For each signal, define what 1-5 means:

**Login Frequency:**
| Score | Criteria |
|-------|----------|
| 5 | Daily active |
| 4 | 3-4x per week |
| 3 | 1-2x per week |
| 2 | 1-2x per month |
| 1 | Inactive 2+ weeks |

**Core Feature Usage:**
| Score | Criteria |
|-------|----------|
| 5 | Uses all core features regularly |
| 4 | Uses 2/3 core features |
| 3 | Uses 1 core feature |
| 2 | Uses only basic/peripheral features |
| 1 | No meaningful feature usage in 14 days |

**Support Sentiment:**
| Score | Criteria |
|-------|----------|
| 5 | Positive interactions, leaves good feedback |
| 4 | Neutral interactions, issues resolved |
| 3 | Mixed — some frustration but resolved |
| 2 | Negative — unresolved issues or repeated complaints |
| 1 | Escalations, threats to cancel, public complaints |

**Engagement Trend:**
| Score | Criteria |
|-------|----------|
| 5 | Increasing usage (up 10%+ WoW) |
| 4 | Stable usage (within ±10% WoW) |
| 3 | Slight decline (down 10-25% WoW) |
| 2 | Significant decline (down 25-50% WoW) |
| 1 | Steep decline (down 50%+ WoW) or inactive |

**Billing Status:**
| Score | Criteria |
|-------|----------|
| 5 | Active, auto-renew, no payment issues |
| 4 | Active, renewal in 30+ days |
| 3 | Renewal in <30 days, or recent payment retry |
| 2 | Payment failed once, or downgrade request |
| 1 | Payment failed 2+ times, or cancel request pending |

---

## Calibration

### Initial Calibration

1. Score your last 100 churned customers retroactively
2. Score 100 current healthy customers
3. Find the score threshold that best separates the two groups
4. Adjust weights if a signal doesn't differentiate (e.g., if all churned customers had the same login frequency as retained ones, login frequency has low predictive power for your product)

### Predictive Validation

After 2+ weeks of scoring, validate the model actually predicts churn:

1. Segment all scored customers into bands: Healthy (4.0+), At Risk (2.5-3.9), Critical (<2.5)
2. Track who actually churns in the next 30 days per band
3. Calculate **precision**: of customers marked Critical, what % actually churned?
4. Calculate **recall**: of customers who actually churned, what % were marked Critical or At Risk?

| Metric | Target | Action If Below |
|--------|--------|----------------|
| Precision (Critical band) | >40% | Weights are wrong — Critical band is too broad. Tighten thresholds. |
| Recall | >60% | You're missing real churners. Add signals or lower At Risk threshold. |
| False positive rate | <30% | Too many false alarms. Raise Critical threshold to reduce noise. |

If precision <30%, the model is worse than random for your product. Re-examine which signals actually correlate with churn in your data — don't just use the defaults.

### Ongoing Calibration

- Monthly: Check false positive rate (healthy customers flagged as at-risk)
- Monthly: Check false negative rate (customers who churned without being flagged)
- Quarterly: Re-evaluate signal weights based on actual churn correlation
- Adjust thresholds when false positive or negative rates exceed 20%

---

## Action Triggers

### Automated Actions

| Score Change | Trigger | Action |
|-------------|---------|--------|
| Drops below 3.0 | Account enters "At Risk" | Send check-in email: "Everything going well with [Product]?" |
| Drops below 2.5 | Account enters "Critical" | Alert CSM for personal outreach |
| Below 2.5 + renewal in <30 days | High churn risk | Executive outreach + retention offer |
| Score increases from <3.0 to >3.5 | Recovery | Send value reinforcement: "Great to see you using [feature]!" |

### CSM Playbook for At-Risk Accounts

1. **Review the account:** Which signals are driving the low score?
2. **Check recent activity:** Last login, last support ticket, last feature used
3. **Reach out personally:** Reference specific context, not a generic template
4. **Offer specific help:** Based on the weak signal (not used feature X? Offer a walkthrough)
5. **Follow up in 7 days:** Did the intervention move the score?

### When NOT to Intervene

- Score dropped due to a known external factor (holiday season, company all-hands)
- Customer is on a plan they've outgrown but hasn't complained (upsell opportunity, not churn risk)
- Score is low because they use the product differently than expected (power users who login rarely but use API heavily)

---

## Implementation Priorities

If building from scratch, implement in this order:

1. **Manual health check** — Pick your top 20 accounts, score them manually using the rubric above. Takes 1 hour, immediately actionable.
2. **Automated scoring** — Build the score into your analytics/CRM. Start with 3 signals (login frequency, core feature usage, billing status).
3. **Alert system** — Trigger notifications when scores drop below thresholds.
4. **Response playbook** — Document standard responses for each risk level.
5. **Predictive refinement** — After 3+ months of data, refine weights based on actual churn correlation.

Don't wait for a perfect model. A rough score checked manually beats no score at all.
