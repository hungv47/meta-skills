# Hypothesis Framework

Shared reference for all research skills that form, structure, or test hypotheses. Two framings live here — pick the one that matches your task before writing.

---

## The Structure (shared)

```
If [premise]
Then [observable consequence]
Because [mechanism or evidence]
```

### Why Each Part Matters

| Component | Purpose | What Happens Without It |
|-----------|---------|------------------------|
| **If** | Defines the specific premise or action | No clarity on what's being claimed or done |
| **Then** | States the expected, observable consequence | No way to measure or falsify |
| **Because** | Explains the underlying mechanism or evidence | No learning if it fails |

The **Because** is the most important and most often skipped clause. Without it, a confirmed hypothesis tells you nothing about *why*, and a rejected hypothesis tells you nothing about *what to try next*. A hypothesis without a Because is unfalsifiable — and therefore not a hypothesis.

---

## Two Framings — Pick One

The structure is the same. The **meaning** of each clause depends on whether you're diagnosing a cause or predicting an intervention.

### Framing A — Diagnostic (used by `diagnose`)

You're trying to identify what's *causing* an observed problem.

```
If [this cause is true]
Then [we'd expect to see this specific evidence in the data]
Because [this mechanism explains how the cause produces the evidence]
```

**Verdict states:** Confirmed | Rejected | Inconclusive (no data) — never "seems likely."

**Templates by problem type:**

```
Acquisition:  If [channel/source] quality declined
              Then [conversion from that source] dropped while others stayed flat
              Because [specific change: targeting, algorithm, competition]

Retention:    If [user segment] is churning faster
              Then [churn rate in segment] increased while others are stable
              Because [trigger: price change, feature removal, competitor launch]

Activation:   If [onboarding step] is failing
              Then [drop-off at that step] increased
              Because [specific friction: complexity, deliverability, unclear value]

Revenue:      If [pricing/packaging] is misaligned
              Then [upgrade/expansion rate] declined for [segment]
              Because [willingness-to-pay shifted: market, perception, alternatives]
```

### Framing B — Predictive (used by `prioritize`, validated post-execution against `funnel-planner` baselines)

You're predicting what will happen if you take a specific action.

```
If [we take this specific action] for [specific segment]
Then [this metric will change by this amount] within [timeframe]
Because [insight, evidence, or root cause that supports the prediction]

Kill if: [condition under which to stop]
```

**Templates by initiative type (each with a worked example):**

**Acquisition**

```
If we [tactic] targeting [segment]
Then [acquisition metric] will [change by X%]
Because [data about why this segment responds to this channel]
```

Example:
```
If we run TikTok ads featuring customer testimonials targeting 25-34 year olds interested in fitness
Then CAC will decrease from $45 to $35 and volume will increase by 200 signups/week
Because this demographic over-indexes on TikTok (2x platform average) and testimonial ads outperformed product ads 3:1 in our Meta tests
```

**Retention**

```
If we [intervention] for users who [behavior/trigger]
Then [retention metric] will improve by [X%]
Because [reason these users churn + why this addresses it]
```

Example:
```
If we send a personalized email with feature recommendations to users who haven't logged in for 7 days
Then Day-30 retention will improve from 25% to 35%
Because cohort analysis shows Day 7-14 is the critical churn window, and users who discover 3+ features have 2x better retention
```

**Activation**

```
If we [onboarding change] for new users
Then [activation metric] will improve from [X] to [Y]
Because [insight about what currently blocks activation]
```

Example:
```
If we add an interactive product tour that guides users to complete their first [key action]
Then activation rate (users who complete [action] in first session) will improve from 20% to 40%
Because session recordings show 60% of churned users never discovered this feature, and users who complete it have 4x better Week-1 retention
```

**Revenue**

```
If we [pricing/monetization change] for [segment]
Then [revenue metric] will [change by X]
Because [reason this segment will respond positively]
```

Example:
```
If we introduce an annual plan with 2 months free for monthly subscribers at renewal
Then annual plan adoption will reach 30% and LTV will increase by 20%
Because survey data shows 45% of monthly users would switch for savings, and annual users have 3x better retention
```

#### Quality progression (predictive)

The same hypothesis sharpens across three levels. Aim for Level 3.

**Level 1 — Basic (acceptable)**

```
If we run a 20% discount promotion
Then signups will increase by 15%
Because price is a barrier for our target segment
```

**Level 2 — Specific (better)**

```
If we run a 20% discount promotion targeted at users who abandoned checkout
Then conversion rate will increase from 2% to 5%
Because exit survey data shows 60% cite price as their primary objection
```

**Level 3 — Testable with Kill Criteria (best)**

```
If we run a 20% discount promotion targeted at users who abandoned checkout in the last 7 days
Then conversion rate will increase from 2% to 5% within 14 days
Because exit survey data (n=500) shows 60% cite price as their primary objection,
        and competitor analysis shows we're 25% above market average

Kill if: Conversion stays below 3% after 7 days, or CAC exceeds $50
```

The jump from Level 1 to Level 3 adds: a specific segment, a baseline, a timeframe, evidence with sample size, and a stop condition. Each addition is what makes the hypothesis testable rather than aspirational.

---

## Quality Bar

A strong hypothesis (either framing) passes all four checks:

### Specificity
- [ ] The premise is concrete and unambiguous
- [ ] The consequence has a number attached
- [ ] Timeline or evaluation window is defined
- [ ] Segment, surface, or scope is named

### Evidence
- [ ] The Because cites actual data, research, or a confirmed root cause — not a guess
- [ ] You can defend the Because to a skeptic in one sentence
- [ ] You've considered why this might NOT work

### Testability
- [ ] You can measure the Then clause
- [ ] You have a baseline to compare against
- [ ] You know what failure looks like before you start
- [ ] (Predictive only) Sample size is sufficient for statistical significance

### Learning
- [ ] If it fails, you'll learn something useful
- [ ] If it succeeds, you know what to do next
- [ ] The Because can be validated or invalidated independently of the outcome

---

## Common Failure Modes

1. **No "Because" clause.** *"If churn increases, conversion drops."* This is a tautology, not a hypothesis. Always state the mechanism.

2. **Vague consequence.** *"Then metrics improve."* Which metric? By how much? Compared to what baseline? Over what window?

3. **Multiple variables in one hypothesis.** *"If we redesign the homepage AND add social proof AND change the CTA..."* If it works (or fails), you won't know which change mattered. Test one variable, or design explicitly for multivariate analysis with adequate sample size.

4. **Unfalsifiable framing.** *"If the market shifts, things change."* What specific evidence would prove this wrong? If nothing could, it's not a hypothesis.

5. **Confirmation without evidence.** *"This seems likely, mark it confirmed."* (Diagnostic only.) Every verdict must cite a specific data point. Inconclusive is a valid verdict — guessing is not.

6. **Generic Because.** *"Because users want a better experience."* (Predictive only.) The Because should be specific enough that it would not apply to a different company in a different category. If it's interchangeable, the hypothesis is untethered from the actual root cause.

### Weak vs. Better — worked rewrites

The bullets above name the failure modes. The rewrites below show what the fix looks like in practice (predictive framing).

**Weak: No "Because"**

Bad: *"If we add social login, then signups will increase."*

Problem: Why do you think this? What insight supports it?

Better: *"If we add social login, then signup completion will increase by 20% because heatmap data shows 40% of users abandon at the password creation step, and competitor A saw 25% improvement after adding Google login."*

**Weak: Vague outcome**

Bad: *"If we improve onboarding, then retention will improve."*

Problem: What does "improve" mean? How much? By when?

Better: *"If we add a progress indicator to onboarding, then Day-7 retention will increase from 35% to 45% because user interviews revealed the top complaint is 'not knowing what's next.'"*

**Weak: Untestable**

Bad: *"If we build brand awareness, then people will trust us more."*

Problem: How do you measure "trust"? What's the action?

Better: *"If we publish 12 educational blog posts over 3 months, then organic traffic will increase by 50% and demo requests will increase by 20% because our target audience searches for these topics (keyword research attached) and our current content gap analysis shows competitors ranking for these terms."*

**Weak: Multiple variables**

Bad: *"If we redesign the homepage and add social proof and change the CTA, then conversion will improve."*

Problem: If it works (or doesn't), you won't know which change mattered.

Better: Test one variable at a time, or explicitly design for multivariate testing with sufficient sample size.

---

## Hypothesis Evolution

Strong work iterates the hypothesis as evidence comes in. A failed hypothesis is not a failed initiative if you learn something — and the next hypothesis is sharper.

```
v1: If we offer a free trial, signups increase
    → Result: Signups up, conversions down

v2: If we offer a 7-day trial (not 14), conversion improves
    → Result: No significant change

v3: If we offer a 7-day trial paired with onboarding calls for enterprise, conversion improves
    → Result: Enterprise conversion +40%

Learning: Free trials work for enterprise when paired with high-touch onboarding.
```

**Good failure** = the hypothesis was clear and testable, the data shows the Because was wrong, and you have a new insight to feed the next iteration.
**Bad failure** = the hypothesis was vague, you can't tell what went wrong, and you walk away with no learning — just spent resources.

After a failure, ask:
1. Was the action executed correctly?
2. Was the outcome measured accurately?
3. Was the Because actually wrong, or was execution flawed?
4. What new hypothesis does this evidence suggest?
