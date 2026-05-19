---
title: Orchestrate-Product — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: orchestrate-product
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the router is about to make a recommendation that smells off — bundling standalone skills into a pipeline, recommending architecture against no flows or spec, recommending `task-breakdown` without an upstream artifact, picking a `docs-writing` mode the operator didn't ask for. Re-read at any moment of doubt.

---

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Ignoring the manifest | Filesystem scans miss `status` / `stale` / `frontmatter_present` signals that change classification | Read `.agents/manifest.json` first; filesystem fallback only when manifest missing or fresh project |
| Conflating `code-cleanup` and `machine-cleanup` | Code = source files in the repo; machine = dotfolders, caches, language toolchains on the dev machine. Different inputs, different risk profiles, different consent gates | Match the intent precisely; if ambiguous, ask one clarifying question before routing |
| Recommending `system-architecture` against no flows AND no spec | Produces a hollow blueprint disconnected from actual feature needs | Soft-defer to `/user-flow` or `/discover` first; surface the gap in the "Where you are" snapshot |
| Recommending `task-breakdown` without an upstream artifact | `task-breakdown` is hard-gated on `meta/specs/*.md` OR `architecture/system-architecture.md` | If neither exists, recommend the upstream skill (`/discover` or `/system-architecture`) first |
| Auto-invoking the next skill | Removes operator's redirect chance + audit trail | Always print `→  /skill-name` for operator to type |
| Recommending `discover` defensively | Patronizing when operator has clear intent | Reserve `discover` for genuinely unclear scope |
| Bundling standalone skills into the pipeline | `code-cleanup` and `machine-cleanup` have no upstream gates and shouldn't appear next to flow/architecture recommendations | Route to standalone branches as their own single-route response; never package alongside pipeline skills |
| Picking a `docs-writing` mode for the operator | The skill has multiple modes (README / API ref / runbook / ship-log / setup guide; release-notes is supported by docs-writing but not router-routed today — v6.3.0 deferred) with very different outputs and contracts | Recommend `/docs-writing` then ask which mode in the same response |
| Cross-routing to research or marketing skills | This router is product-only; cross-stack work belongs to `/orchestrate-meta` | Route cross-stack asks to `/orchestrate-meta` instead of inventing a chain |
| Recommending more than 3 skills | Operator wants the next step, not a catalog | Pick one primary route; mention at most one alternative with its trigger condition |
| Skipping the state snapshot | Same words mean different things depending on what's built — "design this" with flows mapped routes differently than "design this" with no flows | Always run Step 1 state detection before Step 2 classification |
| Lecturing about all 6 product skills | Operator wants the next step, not a tour | Show only what's relevant to the ask + state |
| Treating "I'm not sure" as a request for the catalog | Operator wants to be unblocked, not given a guided tour | Print the product-stack state snapshot + emit Format 4 scoping fallback |
| Re-recommending the skill that just ran | Breadcrumb shows the last hand-off; if the operator returned without running it, ask why before re-recommending — they may have hit a blocker | Read `skills-resources/experience/product-workflow.md` last entry; if the recommended skill is the same, surface "you didn't run X last time — was there a blocker?" |
