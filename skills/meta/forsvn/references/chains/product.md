---
domain: product
absorbed-from: skills/product/orchestrate-product/ (deleted in 2.0.0 per D6)
consumed-by: /forsvn
---

# Product Chain

How `/forsvn` routes product intent. New verb-first names throughout.

> **Package note (2026-06-16):** every leaf in this chain ships in the separate **`forsvn-dev`** package, not the default `forsvn` growth install. `/forsvn` routes here only when `forsvn-dev` is installed; otherwise point the user to install `forsvn-dev` rather than dispatching into a missing skill.

## Pipeline

```
map-user-flow → architect-system → write-docs
                                 ↘
                                   breakdown-tasks (hard-gated on spec OR architecture)

clean-code        (standalone, never bundled)
clean-machine     (standalone, never bundled)
```

## Intent → skill

| User says | Route |
|---|---|
| "design this feature", "user journey", "screen flow", "edge states", "platform touchpoints" | `/map-user-flow` |
| "tech stack", "database schema", "API design", "file structure", "deployment plan", "system design" | `/architect-system` (soft-gate on flows) |
| "decompose tasks", "task list", "implementation order", "what to build first" | `/breakdown-tasks` (hard-gated on spec OR architecture) |
| "README", "API docs", "runbook", "setup guide", "ship log", "document this" | `/write-docs` (ask which mode) |
| "clean up code", "dead code", "refactor", "code audit" | `/clean-code` (standalone) |
| "clean my mac", "free disk space", "remove caches", "dotfolder audit" | `/clean-machine` (standalone) |
| "scope this", "clarify requirements" | `/discover` |
| "design and build" (combined) | propose `/map-user-flow` → `/architect-system` |

## Routing rules (first match wins)

1. **Foundation gates:** flow-mapping or architecture intent AND no spec AND no resolvable product-context → soft-defer to `/discover` (operator can override if clarity already exists).
2. **Pipeline routes:** apply the intent table.
3. **Soft-gate:** architecture intent with zero flows mapped → recommend `/architect-system` BUT note "sharper with flows; consider `/map-user-flow` first if your feature spans multiple flows."
4. **Hard-gate:** task-decomposition intent without spec or architecture → recommend the upstream skill instead.
5. **Standalone branches:** `/clean-code` and `/clean-machine` are never bundled with pipeline skills.
6. **Cross-chain pull-in:** architecture intent + `docs/forsvn/artifacts/research/prioritize-*.md` exists → mention it'll be consumed.
7. **Wrap-around:** recommendations touching security / auth / data-mutation / critical artifacts → append `(optional /review-work after)`.
8. **Don't cross-route** outside `/discover` and `/breakdown-tasks` — research/marketing domains route via their own chain files.

## Anti-patterns

- Bundling standalone skills (`/clean-code`, `/clean-machine`) into a pipeline.
- Recommending `/architect-system` against zero flows and zero spec.
- Picking a `/write-docs` mode the operator didn't ask for.
- Cross-routing outside `/discover` and `/breakdown-tasks`.
