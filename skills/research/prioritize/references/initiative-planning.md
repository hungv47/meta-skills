# Initiative Planning Guide

When a "Proceed" initiative needs a detailed execution plan beyond
owner/metric/kill criteria, use this 5-phase structure.

## When to Use Full Planning

Use when the initiative is:
- Multi-week execution
- Cross-team or multi-person
- High budget (>$5K)
- High stakes (core product or major metric)

Skip when:
- A small validation test covers it (≤2 weeks, low cost)
- Single-person, single-day work

---

## Phase 1: Foundation

- Problem restatement (from diagnose root cause)
- Success definition: primary metric, baseline, target, timeline
- Scope: what's IN, what's explicitly OUT
- Key assumptions (list — they become risk items)

## Phase 2: Strategy

- Tactics in execution order with dependencies between them
- Competitor research: how others solved this (WebSearch)
- Differentiation: why this addresses OUR root cause specifically
- Phasing: if multi-stage, define each stage's deliverable

## Phase 3: Resources

- Team: named people, not roles ("Sarah" not "a marketer")
- Budget: breakdown by category
- Tools/infrastructure needed
- Timeline: milestones with absolute dates

## Phase 4: Success Criteria

- Primary metric: baseline → target with measurement date
- Leading indicators: weekly check signals
- Lagging indicators: long-term confirmation
- Measurement plan: how, where, when each metric is captured
- Review cadence: weekly check-in format

## Phase 5: Risk Assessment

- Risk register: risk | likelihood (H/M/L) | impact (H/M/L) | mitigation
- Kill criteria expanded: specific triggers for stopping
- Escalation path: who decides at kill triggers
- Pivot options: fallback from "Parked" list

---

## Validate Mode

Review an existing initiative proposal against these checkpoints.

### Validation Checklist

- [ ] Problem is quantified (metric with current + target)
- [ ] Hypothesis follows If/Then/Because
- [ ] Success metric has numeric baseline and target
- [ ] Timeline has absolute dates
- [ ] Team has named individuals
- [ ] Budget is broken down (not lump sum)
- [ ] Kill criteria exist with specific thresholds
- [ ] Risks identified with mitigations
- [ ] Scope explicitly excludes something (unbounded scope = risk)

### Scoring

Rate each section 1-3 (Weak/Adequate/Strong).
Any section scoring 1 = proposal needs rework before execution.

---

## Initiative Plan Template

```markdown
# Initiative Plan: [Name]

**Date:** [today]
**Pattern basis:** internal research synthesis.
**Owner:** [name]

## Phase 1: Foundation

**Root Cause:** [from diagnose]
**Primary Metric:** [metric] — Baseline: [current] → Target: [goal] by [date]
**Scope IN:** [what's included]
**Scope OUT:** [what's explicitly excluded]
**Key Assumptions:**
1. [assumption — becomes risk item if wrong]

## Phase 2: Strategy

**Tactics (in order):**
1. [tactic] — depends on: none
2. [tactic] — depends on: #1
3. [tactic] — depends on: #1

**Competitor Reference:** [how others solved this]
**Our Differentiation:** [why this fits our specific root cause]

## Phase 3: Resources

| Resource | Detail |
|----------|--------|
| Team | [named people + roles] |
| Budget | [breakdown by category] |
| Tools | [what's needed] |

**Milestones:**
- [date]: [deliverable]
- [date]: [deliverable]
- [date]: [review point]

## Phase 4: Success Criteria

| Metric Type | Metric | Baseline | Target | When |
|-------------|--------|----------|--------|------|
| Primary | [metric] | [current] | [goal] | [date] |
| Leading | [weekly signal] | [current] | [direction] | Weekly |
| Lagging | [pattern-derived] | [current] | [goal] | [date] |

**Review Cadence:** [frequency + format]

## Phase 5: Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [risk] | H/M/L | H/M/L | [action] |

**Kill Criteria:** Stop if [metric] < [threshold] after [duration]
**Escalation:** [who decides]
**Pivot Option:** [fallback from Parked list]
```
