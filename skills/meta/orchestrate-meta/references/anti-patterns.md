---
title: Orchestrate-Meta — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: orchestrate-meta
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the router is about to make a recommendation that smells off — long cross-stack chain, defensive `discover` suggestion, an apparent need to "do the work" inside the router. Re-read at any moment of doubt.

---

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Ignoring the manifest | Filesystem scans miss `status` / `stale` / `frontmatter_present` signals that change classification | Read `.agents/manifest.json` first; filesystem fallback only when manifest missing or fresh project |
| Duplicating work of stack orchestrators | This router shouldn't pick `icp-research` directly — `/orchestrate-research` has tighter state rules | Route to the stack orchestrator; let it pick the specific skill |
| Lecturing about all 24 skills | Operator wants the next step, not a catalog | Show only what's relevant to the ask + state |
| Auto-invoking the next skill | Removes operator's redirect chance + audit trail | Always print `/skill-name` for operator to type |
| Recommending `discover` defensively | Patronizing when operator has clear intent | Reserve `discover` for genuinely unclear scope |
| Recommending `task-breakdown` without an upstream artifact | `task-breakdown` is hard-gated on spec.md OR system-architecture.md | If neither exists, recommend the upstream skill (discover or system-architecture) first |
| ≥5 hops in a cross-stack path | Project is too vague for sequential execution to make sense | Surface the vagueness and recommend `discover` first; max 3 hops in any single recommendation |
| Doing classification work inside the router | "Mind-reading" the operator's intent past what they actually wrote | If intent is genuinely ambiguous, route to the cross-stack-with-discover-upstream path or ask one clarifying question |
| Skipping the state snapshot | Same words mean different things depending on what's built | Always run Step 1 state detection before Step 2 classification |
| Recommending multiple orchestrators at the same priority | "Try X, or maybe Y, or possibly Z" puts the routing back on the operator | Pick one primary route; mention at most one alternative with its trigger condition |
| Treating "I'm not sure" as a request for the catalog | Operator wants to be unblocked, not given a tour | Print the cross-stack state snapshot + ask the scoping question (option 8 fallback) |
