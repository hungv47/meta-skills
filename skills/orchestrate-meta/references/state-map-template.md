---
title: Orchestrate-Meta — State Map Template
lifecycle: canonical
status: stable
produced_by: orchestrate-meta
load_class: PROCEDURE
---

# State Map Template

**Load when:** Step 1 (Cross-Stack State Detection). After the shell-bang snapshot lands the disk counts, build the structured state map below by reading `.agents/manifest.json` (canonical) + the filesystem fallback paths if the manifest is missing or stale.

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

`manifest.experience` tracks `skills-resources/experience/{domain}.md` files separately. The `entries` count per domain is a heuristic for "how much context has been gathered" — a domain with 7 entries is well-covered; one with 1 entry barely is.

Full manifest contract: [`_shared/manifest-spec.md`](_shared/manifest-spec.md).

## Filesystem fallback paths

Used only when `.agents/manifest.json` doesn't exist (fresh project) or sync hasn't been run:

| Path | What it tells you |
|---|---|
| `CLAUDE.md` (project) | Project name, stack, conventions. |
| `research/product-context.md` | Cross-stack foundation exists. |
| `research/icp-research.md`, `research/market-research.md` | Research stack progress. |
| `brand/BRAND.md`, `brand/DESIGN.md` | Marketing stack foundation. |
| `architecture/system-architecture.md` | Product stack architecture done. |
| `.agents/skill-artifacts/product/flow/index.md` + flow files | Product flows mapped. |
| `.agents/skill-artifacts/meta/specs/*.md` | Spec exists from `discover`. |
| `.agents/skill-artifacts/meta/tasks.md` | Tasks decomposed from `task-breakdown`. |
| `.agents/skill-artifacts/meta/records/diagnose-*.md`, `.agents/skill-artifacts/meta/sketches/prioritize-*.md`, `.agents/skill-artifacts/meta/records/targets-*.md` | Research mid-pipeline outputs. |
| `.agents/skill-artifacts/mkt/campaign-plan.md` + `.agents/skill-artifacts/mkt/content/`, `.agents/skill-artifacts/mkt/lp-brief/`, etc. | Marketing artifacts. |
| `.agents/skill-artifacts/meta/records/cleanup-*.md`, `.agents/skill-artifacts/meta/records/machine-cleanup-*.md` | Cleanup audits. |
| `.agents/skill-artifacts/meta/decisions/[date]-*.md`, `.agents/skill-artifacts/meta/records/[date]-fresh-eyes-*.md` | Meta-skill artifacts (dated, immutable — lifecycle: decision / snapshot). |
| `skills-resources/experience/*.md` | All cold-start answers across stacks. |
| `skills-resources/experience/meta-workflow.md` | Prior `/orchestrate-meta` breadcrumb. |
| `.agents/skill-artifacts/meta/records/learned-rules.md` | Behavior corrections from prior sessions. |

## State map structure

Build this in memory; don't write it to disk unless the output format requires it:

```
research:
  product-context: done | partial | missing
  icp:             done | partial | missing
  market:          done | partial | missing
  diagnose:        done | not run
  prioritize:      done | partial | missing
  targets:         done | partial | missing

marketing:
  brand:           done | partial | missing
  campaign:        done | partial | missing
  content:         [list of slugs]
  lp:              [audit / brief / both / neither]
  seo:             [list of modes]
  short-form:      [list of slugs]
  outreach:        [list of slugs]

product:
  spec:            done | partial | missing
  flows:           [list]
  architecture:    done | partial | missing
  tasks:           done | partial | missing
  code-cleanup:    done | not run
  docs:            [skim]

meta:
  panel-reports:   [count, latest mtime]
  fresh-eyes:      [count, latest mtime]
  learned-rules:   [count]
```

## Project-fit check

If `CLAUDE.md` describes a B2B SaaS but `research/icp-research.md` describes a consumer app, flag the mismatch. State may be from a different project (working in the wrong directory, or stale clone). Surface the mismatch in the routing output instead of routing blindly.

## When the manifest is stale (>24h)

Per Step 1, the body may regenerate via `bun scripts/manifest-sync.ts` before reading. Document in the output that a regeneration happened — the cost is small but operator should know if their last action was 5s ago vs. 5 days ago.
