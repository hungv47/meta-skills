---
title: Orchestrate-Research — State Map Template
lifecycle: canonical
status: stable
produced_by: orchestrate-research
load_class: PROCEDURE
---

# State Map Template

**Load when:** Step 1 (Research-Stack State Detection). After the shell-bang snapshot lands the disk counts, build the structured state map below by reading `.agents/manifest.json` (canonical) + the filesystem fallback paths if the manifest is missing or stale.

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

Staleness is derived per-artifact via the manifest's `stale_after_days` (defaults vary per artifact type — ICP/market default 90 days; diagnose/prioritize/targets default 60 days; short-form-research default 30 days). Read the manifest entry's `stale` field directly; do not apply a fixed-day threshold here.

`manifest.experience` tracks `skills-resources/experience/{domain}.md` files separately. For research-stack routing, the relevant domains are `audience`, `business`, `content` — `entries` count is a Pre-Dispatch coverage heuristic (0–1 entries → likely Cold Start for downstream skills; 5+ entries → well-covered).

Full manifest contract: [`_shared/manifest-spec.md`](_shared/manifest-spec.md).

## Filesystem fallback paths

Used only when `.agents/manifest.json` doesn't exist (fresh project) or sync hasn't been run:

| Path | What it tells you |
|---|---|
| `research/product-context.md` | ICP foundation exists. Audience is at least sketched. (Cross-stack canonical; consumed by 13+ downstream skills.) |
| `research/icp-research.md` | Full ICP research is done. |
| `research/market-research.md` | Market landscape mapped. |
| `.agents/skill-artifacts/meta/records/[date]-diagnose-[slug].md` | A specific problem has been diagnosed. |
| `.agents/skill-artifacts/meta/sketches/prioritize-[slug].md` | Initiative ranking exists. |
| `.agents/skill-artifacts/meta/records/targets-[slug].md` | Funnel targets are set. |
| `.agents/skill-artifacts/research/short-form-research/[slug].md` | Per-platform short-form catalog exists (consumed by marketing-stack `short-form-brief`). |
| `skills-resources/loops/*/evals/[date]-cycle-N.md` | Short-form eval cycles have run inside marketing loops; pattern-log entries available. |
| `skills-resources/experience/audience.md` | Cold-start audience answers persisted. |
| `skills-resources/experience/business.md` | Business model context persisted. |
| `skills-resources/experience/content.md` | Short-form content cycle answers persisted. |
| `skills-resources/experience/research-workflow.md` | Prior `/orchestrate-research` breadcrumb. |

## State map structure

Build this in memory; don't write it to disk unless the output format requires it:

```
icp-foundation:    done | partial | missing
market-landscape:  done | partial | missing
problem-diagnosis: done | partial | missing | n/a
prioritization:    done | partial | missing | n/a
funnel-targets:    done | partial | missing | n/a
short-form-catalogs: [list of platform slugs] | none
```

## Stale detection (research-specific)

- `research/icp-research.md` mtime > 90 days OR `CLAUDE.md` product description doesn't match → warn, offer refresh, don't block.
- `research/market-research.md` mtime > 90 days OR ICP refreshed since → warn (market likely shifted).
- `.agents/skill-artifacts/meta/records/diagnose-*.md` mtime > 60 days → warn before re-using (metric may have moved).
- `.agents/skill-artifacts/meta/sketches/prioritize-*.md` OLDER than newest diagnose or market record → prioritization may be behind. Warn.
- `.agents/skill-artifacts/research/short-form-research/*.md` mtime > 30 days → likely stale (platform algorithms move fast). Warn before re-using.

## Project-fit check

If `CLAUDE.md` describes a B2B SaaS but `research/icp-research.md` describes a consumer app, flag the mismatch. State may be from a different project (working in the wrong directory, or stale clone). Surface the mismatch in the routing output instead of routing blindly.

## When the manifest is stale (>24h)

Per Step 1, the body may regenerate via `bun scripts/manifest-sync.ts` before reading. Document in the output that a regeneration happened — the cost is small but operator should know if their last action was 5s ago vs. 5 days ago.

## Re-entry behavior

`/orchestrate-research` is idempotent. If breadcrumb shows last session ran `/icp-research` and `research/icp-research.md` now exists, advance to the next step (typically `/market-research` or `/diagnose`). If `/icp-research` ran but no artifact exists, surface that as a discrepancy in the state map and ask before routing onward.
