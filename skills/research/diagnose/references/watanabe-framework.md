# Watanabe Problem Solving Framework

Core principles from Watanabe's Problem Solving 101, adapted for business and growth contexts.

---

## Core Idea

Problem solving is a learnable skill, not an innate talent. The process is:

1. Understand the current situation
2. Identify the root cause
3. Develop an action plan
4. Execute and adjust

Most people jump from step 1 to step 4. Steps 2 and 3 are where the real work happens.

---

## MECE Principle

MECE (Mutually Exclusive, Collectively Exhaustive) is the foundation of good decomposition.

### Mutually Exclusive

Each branch of your tree should cover a distinct, non-overlapping category.

**Test:** If I completely solve branch A, does branch B still exist as a separate problem? If yes, they're mutually exclusive. If solving A automatically solves B, they overlap.

**Bad example (overlapping):**
```
Revenue declining
├── Marketing not working
├── Website conversion low
└── Brand awareness declining
```
"Marketing not working" contains both "website conversion" and "brand awareness." These overlap.

**Good example (exclusive):**
```
Revenue declining
├── Traffic volume declining
├── Conversion rate declining
└── Average order value declining
```
Each branch is mathematically independent.

### Collectively Exhaustive

Your branches should cover ALL possible causes. Nothing should fall through the cracks.

**Test:** Can you think of any cause that doesn't fit into one of your branches? If yes, you're missing a category.

**Tip:** Adding an "Other/External" branch is acceptable as a catch-all, but it shouldn't become a dumping ground. If more than one real item ends up there, break it into proper branches.

---

## Tree Types

### Yes/No Tree (Decision Tree)

Best for: Sequential diagnostic questions where each answer narrows the search.

```
Is the problem new (started recently)?
├── YES: Did anything change?
│ ├── YES: Was it a product change?
│ │ ├── YES → Investigate the specific change
│ │ └── NO → Investigate external factors
│ └── NO: Did the measurement change?
│ ├── YES → Fix measurement, re-evaluate
│ └── NO → Deeper investigation needed
└── NO: Has it always been this way?
 ├── YES → This is a capability gap, not a regression
 └── NO → Identify when it started degrading
```

**When to use:** When you're trying to narrow down from many possibilities quickly. Good for initial triage.

### Issue Tree

Best for: Complex problems with multiple potential cause categories.

```
Problem
├── Category A
│ ├── Sub-cause A1
│ └── Sub-cause A2
├── Category B
│ ├── Sub-cause B1
│ └── Sub-cause B2
└── Category C
 ├── Sub-cause C1
 └── Sub-cause C2
```

**When to use:** When the problem could stem from many different areas and you need to explore systematically. Most common tree type for business problems.

### Math Tree (Quantitative Decomposition)

Best for: Metric-based problems where the metric has a clear formula.

```
Revenue = Traffic × Conversion Rate × Average Order Value

Revenue declining
├── Traffic (volume)
│ ├── Organic
│ ├── Paid
│ └── Direct/Referral
├── Conversion rate (%)
│ ├── Browse → Cart
│ ├── Cart → Checkout
│ └── Checkout → Purchase
└── Average order value ($)
 ├── Items per order
 └── Price per item
```

**When to use:** When you can express the problem as a mathematical formula. Forces precision and makes it easy to quantify each branch's contribution to the gap.

---

## Common Pitfalls

### 1. Going Too Deep Too Fast

Don't build a 5-level tree before validating the first level. Start with 2 levels, check the data, then go deeper on the branches that matter.

### 2. Hypothesis Confirmation Bias

You'll naturally gravitate toward the cause you suspect. Counteract this by:
- Explicitly listing causes you think are unlikely
- Asking "What evidence would prove me wrong?"
- Having someone else review your tree

### 3. Analysis Paralysis

The tree is a tool, not a destination. If you've been decomposing for more than 30 minutes without checking any data, stop and test your top hypothesis.

**Rule of thumb:** Build the tree in 15 minutes, then start testing. You can always add branches later.

### 4. Mistaking Symptoms for Causes

"Customers are leaving" is a symptom. "Onboarding takes 3x longer than competitors" is closer to a cause. "The onboarding flow requires 12 steps when 4 would suffice" is actionable.

Keep asking "why?" until you reach something you can change.

### 5. Skipping the "Measurement Changed" Branch

Always include a branch for "the way we measure this changed." Surprisingly often, the problem isn't performance — it's a reporting or attribution change that made existing performance look worse.

---

## Hypothesis Quality Checklist

A good hypothesis is:

- [ ] **Specific** — Points to a concrete cause, not a vague area
- [ ] **Testable** — Can be confirmed or rejected with available data
- [ ] **Falsifiable** — You can define what "rejected" looks like
- [ ] **Actionable** — If confirmed, you know what to do about it
- [ ] **Independent** — Not just a restatement of the problem

**Bad hypothesis:** "Our marketing isn't working well enough."
**Good hypothesis:** "If our email open rates dropped due to the domain migration in March, then we'd see a step-change decline in open rates starting March 15, concentrated on the new sending domain."

---

## When to Stop

You've found the root cause when:

1. **The evidence is clear** — Data confirms the hypothesis, not just doesn't reject it
2. **It's actionable** — You can do something about it
3. **It explains the gap** — The magnitude of the cause matches the magnitude of the problem
4. **It's specific enough** — You know exactly what to fix

If your "root cause" is still vague ("marketing needs to be better"), you haven't gone deep enough. If it's so specific that fixing it wouldn't meaningfully close the gap, you may have gone too narrow.
