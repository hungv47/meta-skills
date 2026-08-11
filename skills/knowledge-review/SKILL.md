---
name: knowledge-review
description: "Audit the authority, freshness, and uncertainty of the sources and claims behind a decision, and reconcile conflicting evidence. Use for research synthesis, factual-claim checks, or reframing a recommendation built on weak sourcing. This is knowledge review, never code review."
metadata:
  version: 1.0.0

---

# Knowledge review

Check that a decision rests on credible, current, and honestly uncertain evidence.

## Clarify what is being claimed

State the factual claim or decision the review must support. Enumerate the sources and data the work
currently leans on. Distinguish observed evidence, reasonable inference, and assumption before judging
any of them.

## Assess each source

For every source and claim, record:

- authority: primary or secondary, provenance, perspective, and known bias;
- freshness: an explicit date or how current this category of claim is;
- uncertainty: confidence, sample, and what could change the finding.

## Build the contradiction matrix

For each key claim, put sources as rows and record what each asserts, its authority, date, and
uncertainty. Mark every direct contradiction explicitly so conflicts are visible rather than merged.

## Resolve

Reconcile conflicts by weighing authority, recency, and causal plausibility—not by counting or
averaging sources. Label the resolved position and why the competing evidence lost.

## Surviving unknowns and recheck trigger

List what remains unknown and set a recheck trigger: a date, event, or condition when the claim must
be verified again. Do not let an unknown silently age into a fact.

## Scope

This reviews knowledge, sources, and factual claims—not code. Do not use it to review an
implementation, a diff, or a codebase; use a code-review path for that. Keep the review proportional
to the decision and never fabricate or pad sources.
