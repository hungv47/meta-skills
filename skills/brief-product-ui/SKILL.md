---
name: brief-product-ui
description: "Turn an approved product flow into an implementation-ready UI brief. Use for screen inventory, reusable components, design-token application, interaction and system states, accessibility, and build handoff. Not for marketing landing pages or brand identity."
metadata:
  version: 2.0.0

---

# Brief a product interface

Produce a buildable interface specification grounded in an accepted product flow. Do not render or
invent product behavior unless the user separately asks for implementation.

## Prove the source flow

Identify the flow, platforms, surfaces, nodes, decisions, and states this brief implements. If no
usable flow exists, return to `map-user-flow`.

Every screen, component, state, and action must trace to a flow node, edge, native platform
requirement, or explicit product decision. Do not add speculative dashboards or settings.

## Define the interface system

Specify:

- screen/surface inventory and source-flow trace;
- reusable component names, jobs, content, and variants;
- layout hierarchy and responsive/native behavior;
- existing semantic color, type, spacing, radius, motion, and focus tokens;
- default, hover, focus, pressed, disabled, selected, loading, success, warning, and error states;
- empty, permission, offline, interruption, and recovery treatment;
- keyboard, assistive-technology, contrast, reduced-motion, and target-size requirements.

When project tokens are missing, define semantic roles that must be mapped before implementation.
Do not invent arbitrary raw values or silently create a new brand system.

## Make the handoff testable

For every screen, state what the user understands, can do, and sees after the action. Name content
requirements, truncation/overflow, validation, persistence, analytics events when requested, and
platform-native boundaries.

## Deliver

Return:

1. outcome and source-flow trace;
2. screen inventory;
3. component system;
4. token application map;
5. per-screen layout and content hierarchy;
6. interactions and complete state coverage;
7. accessibility requirements;
8. implementation order and test cases;
9. explicit non-goals and unresolved decisions.

Finish with acceptance criteria a designer and engineer can review without reconstructing the product
logic.

