# Testing & Optimization

## 22. One-Variable Testing

**Rule**: Change one thing, measure impact

### Why Single-Variable Testing

- Clear attribution of results
- Compound wins over time
- Build on successful changes
- Document what works and why
- Avoid confounding variables

### Testing Process

1. Identify one element to test
2. Create control (A) and variant (B)
3. Split traffic randomly (50/50)
4. Run until statistical significance
5. Analyze results
6. Implement winner
7. Test next element

### Statistical Significance Requirements

- Minimum 100 conversions per variant
- 95% confidence level
- Run for at least 7 days (capture weekly patterns)
- Account for seasonality

### Elements to Test (Priority Order)

| Priority | Element | Potential Impact |
|----------|---------|------------------|
| 1 | Headlines | 10-50% lift |
| 2 | Offers | 10-40% lift |
| 3 | CTA text | 5-30% lift |
| 4 | CTA color/placement | 5-20% lift |
| 5 | Images | 5-20% lift |
| 6 | Form length | 5-25% lift |
| 7 | Social proof placement | 5-15% lift |
| 8 | Page layout | 5-15% lift |

### Testing Documentation Template

```
Test #: [Number]
Date: [Start - End]
Element: [What's being tested]
Hypothesis: [Expected outcome and why]
Control: [Description of A]
Variant: [Description of B]
Traffic: [Sessions per variant]
Conversions: [Conversions per variant]
Conversion Rate: [A: X% | B: Y%]
Confidence: [Statistical significance]
Result: [Winner and lift percentage]
Learnings: [What we learned]
Next Test: [What to test next based on learnings]
```

---

## 23. Performance Tracking Stack

**Rule**: Use multiple tracking methods for complete picture

### Tracking Layers

| Layer | What It Shows | Tools |
|-------|---------------|-------|
| Heatmaps | Where users click, scroll, look | Hotjar, Crazy Egg, Microsoft Clarity |
| Recordings | Why users behave that way | Hotjar, FullStory, Smartlook |
| Events | What actions users take | Google Analytics, Mixpanel, Amplitude |
| Analytics | Aggregate numbers and trends | Google Analytics, Plausible |

### Heatmap Insights

- **Click maps**: Where users click (and don't)
- **Scroll maps**: How far users scroll
- **Attention maps**: Where users spend time
- **Movement maps**: Mouse movement patterns

### Session Recording Insights

- Form abandonment patterns
- Confusion indicators (rapid scrolling, rage clicks)
- Reading patterns
- Navigation paths
- Mobile vs desktop behavior differences

### Essential Tracking Setup

- [ ] Google Analytics or similar installed
- [ ] Heatmap tool configured (Hotjar, Clarity)
- [ ] Session recording enabled
- [ ] Event tracking for key actions:
 - [ ] CTA clicks
 - [ ] Form starts
 - [ ] Form completions
 - [ ] Scroll depth milestones
 - [ ] Video plays
 - [ ] Exit intent triggers
- [ ] Conversion goals configured
- [ ] Funnel analysis setup
- [ ] UTM tracking for traffic sources

---

## 24. Weekly Optimization Ritual

**Rule**: Systematic optimization process

### Weekly Schedule

| Day | Activity |
|-----|----------|
| Monday | Review metrics, identify opportunities |
| Tuesday | Design and launch new tests |
| Wednesday | Monitor tests, gather data |
| Thursday | Continue monitoring, preliminary analysis |
| Friday | Analyze results, plan next week |

### Monday: Metric Review

- [ ] Review conversion rates by traffic source
- [ ] Check bounce rate trends
- [ ] Analyze time on page patterns
- [ ] Review form abandonment rates
- [ ] Check A/B test status
- [ ] Note any anomalies or spikes

### Tuesday: Test Design

- [ ] Review heatmaps from past week
- [ ] Watch 5-10 session recordings
- [ ] Identify friction points
- [ ] Prioritize test ideas by impact
- [ ] Design new test variant
- [ ] Launch A/B test

### Friday: Analysis & Planning

- [ ] Analyze completed test results
- [ ] Document learnings
- [ ] Update optimization backlog
- [ ] Plan next week's tests
- [ ] Share wins with team

---

## Key Metrics to Track

### Primary Metrics (Daily)

| Metric | Target | Action Threshold |
|--------|--------|------------------|
| Conversion rate | Varies by industry | <2% for most offers |
| Bounce rate | <50% | >70% needs urgent fix |
| Time on page | >60 seconds | <30 seconds is concerning |
| Scroll depth | >75% to CTA | <50% is problem |
| CTA click rate | >5% | <2% needs work |

### Secondary Metrics (Weekly)

- A/B test results
- Traffic source performance
- Device/browser breakdown
- Exit rate by section
- Form field abandonment

### Advanced Metrics (Monthly)

- Cost per acquisition by source
- Customer lifetime value by source
- Multi-touch attribution
- Time to conversion
- Return visitor conversion rate

---

## Optimization Prioritization Framework

### ICE Score

Rate each optimization opportunity:
- **Impact**: How much will it move the needle? (1-10)
- **Confidence**: How sure are you it will work? (1-10)
- **Ease**: How easy is it to implement? (1-10)

ICE Score = (Impact + Confidence + Ease) / 3

### Prioritization Matrix

| Score | Priority | Timeline |
|-------|----------|----------|
| 8-10 | Critical | This week |
| 6-7 | High | Next 2 weeks |
| 4-5 | Medium | This month |
| 1-3 | Low | Backlog |

---

## Common Optimization Wins

### Quick Wins (High Impact, Easy)

- Remove unnecessary form fields
- Add trust badges near CTA
- Improve headline clarity
- Add social proof above fold
- Speed up page load

### Medium Effort (High Impact, Some Work)

- Rewrite copy with PAS framework
- Redesign form flow
- Add testimonials with results
- Create mobile-specific experience
- Implement exit-intent popup

### Major Projects (High Impact, Significant Work)

- Complete page redesign
- Multi-step form conversion
- Personalization by segment
- Video testimonials
- Advanced A/B testing program
