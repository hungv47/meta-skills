---
title: Orchestrate-Product — State Map Template
lifecycle: canonical
status: stable
produced_by: orchestrate-product
load_class: PROCEDURE
---

# State Map Template

**Load when:** Step 1 (Product-Stack State Detection). After the shell-bang snapshot lands the disk counts, build the structured state map below by reading `.agents/manifest.json` (canonical) + the filesystem fallback paths if the manifest is missing or stale.

---

## Manifest signals → state-map values

Read `manifest.artifacts[].status` + `manifest.artifacts[].stale` to qualify each entry:

| Manifest signal | State map value |
|---|---|
| `status: done`, `stale: false` | ✅ done |
| `status: done_with_concerns` | ⚠️ done-with-concerns — surface the concern in routing output |
| `status: blocked` or `needs_context` | treat as missing |
| `stale: true` | ✅ done (stale) — propose refresh as an option, don't block |
| `frontmatter_present: false` | ✅ done (legacy, no frontmatter) — quality unknown, suggest refresh |

Staleness is derived per-artifact via the manifest's `stale_after_days` (defaults vary per artifact type — see manifest spec). Read the manifest entry's `stale` field directly; do not apply a fixed-day threshold here.

`manifest.experience` tracks `skills-resources/experience/{domain}.md` files separately. For product-stack routing, the relevant domains are `technical`, `audience`, `goals` — `entries` count is a Pre-Dispatch coverage heuristic (0–1 entries → likely Cold Start; 5+ entries → well-covered).

Full manifest contract: [`_shared/manifest-spec.md`](_shared/manifest-spec.md).

## Filesystem fallback paths

Used only when `.agents/manifest.json` doesn't exist (fresh project) or sync hasn't been run:

| Path | What it tells you |
|---|---|
| `research/product-context.md` | Cross-stack ICP / business context exists. |
| `.agents/skill-artifacts/meta/specs/*.md` | A scoped spec exists (from `/discover`). |
| `.agents/skill-artifacts/product/flow/index.md` | At least 2 user flows mapped. |
| `.agents/skill-artifacts/product/flow/*.md` | Specific flows mapped (each file = one flow). |
| `architecture/system-architecture.md` | System blueprint exists. |
| `.agents/skill-artifacts/meta/tasks.md` | Buildable task list exists (from `/task-breakdown`). |
| `.agents/skill-artifacts/meta/records/cleanup-*.md` | Code-cleanup audit done. |
| `.agents/skill-artifacts/meta/records/machine-cleanup-*.md` | Machine-cleanup audit done. |
| `skills-resources/experience/technical.md` | Cold-start tech context (platforms, OS versions, scale, deployment, codebase conventions) persisted. |
| `skills-resources/experience/product-workflow.md` | Prior `/orchestrate-product` breadcrumb. |

## State map structure

Build this in memory; don't write it to disk unless the output format requires it:

```
spec:              done | partial | missing
flows-mapped:      [list of flow names]
architecture:      done | partial | missing
tasks-broken-down: done | partial | missing
code-cleanup:      done | not run
machine-cleanup:   done | not run
docs:              [skim README, docs/, look for ship log in product-context.md]
product-context:   done | partial | missing (cross-stack signal)
```

## Stale detection (product-specific)

- `.agents/skill-artifacts/meta/specs/*.md` mtime > 60 days → flag stale.
- `architecture/system-architecture.md` OLDER than newest flow file → architecture may be behind. Warn.
- `.agents/skill-artifacts/meta/records/cleanup-*.md` mtime > 30 days → likely stale (codebase moves fast). Warn before re-using.

## Project-fit check

If `CLAUDE.md` describes a B2B SaaS but `research/product-context.md` describes a consumer app, flag the mismatch. State may be from a different project (working in the wrong directory, or stale clone). Surface the mismatch in the routing output instead of routing blindly.

## When the manifest is stale (>24h)

Per Step 1, the body may regenerate via `bun scripts/manifest-sync.ts` before reading. Document in the output that a regeneration happened — the cost is small but operator should know if their last action was 5s ago vs. 5 days ago.

## Re-entry behavior

`/orchestrate-product` is idempotent. If breadcrumb shows last session ran `/user-flow` and `.agents/skill-artifacts/product/flow/index.md` now lists 3 flows, advance to `/system-architecture`. If `/user-flow` ran but no flow file exists, surface that as a discrepancy in the state map and ask before routing onward.
