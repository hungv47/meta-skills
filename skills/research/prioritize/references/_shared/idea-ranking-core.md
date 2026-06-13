<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Idea-Ranking Core

> Portable ranking invariants for any skill that scores or ranks a candidate set — prioritize (owner of the deep implementation), discover's divergence handoff, debate-agents' poll schemas.

## Purpose

Several skills rank candidate sets: `prioritize` (ICE-scored initiatives), `discover` (divergence shortlists), `debate-agents` (Ranking/Scoring poll schemas). The deep implementation — agents, rubrics, route graphs — lives in `prioritize`. This file is the **citable contract**: the invariants any ranking pass must hold so scores mean something across the stack. Cite it; do not re-implement it.

## Invariants

### 1. Force-rank BEFORE scoring

Produce a strict 1-through-N ordering (no ties, no omissions) before assigning any numeric scores. The ranking sets the ceiling: rank #1 should carry the highest total score, and an inversion is a red flag to reconcile, not a result to hand-wave. Ranking-first is the mechanism that prevents score clustering.

### 2. No naked numbers

Every score carries a one-sentence evidence citation. "Impact: 7" is rejected; "Impact: 7 — paid traffic is 60% of signups and converted at 3.5% vs. 1.2% now" is accepted. Enthusiasm is not evidence.

### 3. Differentiation check

No more than 2 candidates may share the same total score. If totals cluster (all 15-18), the scoring is meaningless — force differentiation across the full range, anchored by the forced ranking.

### 4. Confidence maps to an evidence grid

Assign Confidence by mapping evidence to a threshold grid BEFORE picking the number:

| Score | Evidence required |
|---|---|
| 1-3 | Gut feeling only, no data |
| 4-5 | One data point (one past test, one quote, one competitor example) |
| 6-7 | Supporting pattern (2+ data points from different sources) |
| 8-9 | Proven in similar context (same tactic worked 2+ times in same business type) |
| 10 | Near-certain (proven playbook, 80%+ success rate in your exact context) |

### 5. Ease/Effort is AI-assisted effort

Score effort on what AI compresses it to, not human-team weeks (stack contract: `skills/CLAUDE.md` § "Effort compression"). A bounded feature/connector build is Ease 7-8 (days AI-assisted), not 2-3 ("a month of engineering"). Reserve the low band (1-3) for what AI does **not** compress: multi-team human coordination, external gates (partner/legal/procurement), long real-world validation windows.

### 6. Shortlist / cut-line semantics

A ranking is incomplete without a cut line. **≤3 candidates above the line** — more active items means none get full attention. Every above-the-line item carries explicit **kill criteria** (the observable condition under which it gets dropped); below-the-line items are Parked or Killed with the reason recorded, so a future pass doesn't re-debate them.

## Anti-Patterns

- **"Everything is a 6."** All scores cluster mid-range, the ranking is meaningless. Cause: scoring before (or without) force-ranking. Fix: rank first; the ranking forces differentiation.
- **Premature convergence.** Ranking while still generating candidates collapses the set to the safe option. Generation and evaluation are separate phases — breadth first, judgment suspended; rank only the finished set.

## Ownership

The full machinery — ranking criteria weights, ICE rubric tables, cut-line capacity rules, critic gates — is owned by `prioritize` (`skills/research/prioritize/`). This contract changes only when those invariants change, and versions with the skills that cite it (no standalone version field).
