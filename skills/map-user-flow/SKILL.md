---
name: map-user-flow
description: "Map an in-product flow across screens, decisions, transitions, native platform surfaces, and recovery states. Use for a feature or user journey that spans multiple screens or states, before visual UI design or technical architecture."
metadata:
  version: 2.0.0

---

# Map a product flow

Create the smallest complete flow that lets a product team make interface and implementation
decisions without inventing missing behavior.

## Establish the job and surfaces

State the user job, entry condition, successful end state, and explicit non-goals. Enumerate actual
platforms and native surfaces; reject “cross-platform” as a sufficient specification.

Read existing product requirements, shipped UI, analytics, and support evidence when available.
Separate observed behavior, approved requirement, inference, and open decision.

## Write structure before diagrams

Give every screen/state a stable short identifier. For each, specify:

- user intent and information required;
- available actions;
- decision or system condition;
- destination for success, cancellation, and failure;
- state that must persist across the transition.

Keep the happy path short. Challenge more than seven user actions and remove steps that do not create
understanding, control, or required trust.

## Cover the complete state space

For every relevant surface, cover:

- empty and first-run;
- loading and duplicate-action prevention;
- validation and system error;
- permission denied or revoked;
- offline/degraded operation;
- cancellation, retry, and safe recovery;
- interruption, resume, and destructive confirmation where applicable;
- accessibility and native platform behavior.

Do not add a screen merely to house information that belongs in an existing state.

## Deliver

Return:

1. outcome, assumptions, and non-goals;
2. platforms and surfaces;
3. numbered happy path with explicit transitions;
4. decision branches;
5. state and edge-case matrix;
6. recovery behavior;
7. validation scenarios;
8. unresolved product decisions.

Use a diagram only after the written structure is complete. Finish with the smallest review question
that would materially change the flow.

