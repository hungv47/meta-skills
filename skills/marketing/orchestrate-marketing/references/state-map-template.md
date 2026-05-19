---
title: Orchestrate-Marketing — State Map Template
lifecycle: canonical
status: stable
produced_by: orchestrate-marketing
load_class: PROCEDURE
---

# State Map Template

**Load when:** Step 1 (Marketing-Stack State Detection). After the shell-bang snapshot lands the disk counts, build the structured state map below by reading `.agents/manifest.json` (canonical) + the filesystem fallback paths if the manifest is missing or stale.

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

Staleness is derived per-artifact via the manifest's `stale_after_days` (defaults vary per artifact type — brand-system default 180 days; campaign-plan default 90 days; copy / lp-brief / design-brief / short-form-brief / ad-copy / cold-outreach default 30 days; lp-eval cycles default 14 days). Read the manifest entry's `stale` field directly; do not apply a fixed-day threshold here.

`manifest.experience` tracks `skills-resources/experience/{domain}.md` files separately. For marketing-stack routing, the relevant domains are `brand`, `audience`, `content`, `goals` — `entries` count is a Pre-Dispatch coverage heuristic (0–1 entries → likely Cold Start for downstream skills; 5+ entries → well-covered).

Full manifest contract: [`_shared/manifest-spec.md`](_shared/manifest-spec.md).

## Filesystem fallback paths

Used only when `.agents/manifest.json` doesn't exist (fresh project) or sync hasn't been run:

| Path | What it tells you |
|---|---|
| `research/product-context.md` | ICP foundation exists. (Cross-stack canonical from research-skills — consumed by 13+ downstream marketing skills.) |
| `research/icp-research.md` | Full ICP exists. |
| `brand/BRAND.md` | Brand narrative + voice + positioning defined. |
| `brand/DESIGN.md` | Visual system + design tokens defined. |
| `brand/ASSETS.md` | Per-platform asset inventory tracked. |
| `.agents/skill-artifacts/mkt/campaign-plan.md` | Integrated campaign plan exists. |
| `.agents/skill-artifacts/mkt/content/*.copy.md` | Specific copy artifacts produced. |
| `.agents/skill-artifacts/mkt/content/*.humanized.md` | Humanized polish artifacts. |
| `.agents/skill-artifacts/mkt/content/*.vn-tone.md` | Vietnamese register-polish artifacts. |
| `.agents/skill-artifacts/mkt/lp-brief/**/brief.md` | LP brief exists. |
| `.agents/skill-artifacts/mkt/seo-*.md` | SEO mode artifact (audit / ai / programmatic / competitor / aso). |
| `.agents/skill-artifacts/mkt/cold-outreach/*.md` | Outbound touch composed. |
| `.agents/skill-artifacts/mkt/ad-copy/*.md` | Meta ad copy artifact (retargeting or cold-traffic). |
| `.agents/skill-artifacts/mkt/short-form-brief/**/brief.md` | Video brief exists. |
| `.agents/skill-artifacts/mkt/copy/[platform]-*-*.md` | Platform-native social-copy artifacts (TikTok / Reels / Shorts / X / LinkedIn). |
| `.agents/skill-artifacts/mkt/design-briefs/*.md` | Per-asset graphic-design briefs. |
| `.agents/skill-artifacts/research/short-form-research/*.md` | Per-platform short-form catalogs (from research-skills — consumed by short-form-brief). |
| `skills-resources/loops/*/program.md` | Measurable eval loop exists. |
| `skills-resources/loops/*/evals/*.md` | Loop-local evaluation artifacts (lp-eval cycles). |
| `skills-resources/loops/*/results.tsv` | Keep/discard/watch/blocked result ledger. |
| `skills-resources/experience/brand.md` | Cold-start brand answers persisted. |
| `skills-resources/experience/audience.md` | Cold-start audience answers persisted. |
| `skills-resources/experience/content.md` | Cold-start content-cycle answers persisted. |
| `skills-resources/experience/goals.md` | Cold-start campaign-goal answers persisted. |
| `skills-resources/experience/marketing-workflow.md` | Prior `/orchestrate-marketing` breadcrumb. |

## State map structure

Build this in memory; don't write it to disk unless the output format requires it:

```
icp-foundation:    done | partial | missing  (cross-stack from research-skills)
brand-narrative:   done | partial | missing
brand-design:      done | partial | missing
brand-assets:      done | partial | missing
campaign-plan:     done | partial | missing
copywriting:       [list of slugs that exist]
lp-brief:          [list of LP brief slugs]
lp-eval:           [list of loop slugs + latest cycle date if any]
seo:               [list of modes run]
short-form-brief:  [list of brief slugs]
ad-copy:           [list of (audience-temp, slug) tuples]
cold-outreach:     [list of touches]
social-copy:       [list of (platform, slug) tuples]
design-brief:      [list of slugs]
eval-loops:        [list of loop slugs + program.md presence]
polish-applied:    [count of humanized + vn-tone artifacts]
```

## Stale detection (marketing-specific)

- `brand/BRAND.md` mtime > 180 days OR CLAUDE.md product description doesn't match brand voice → warn, offer refresh, don't block.
- `brand/DESIGN.md` mtime > 180 days OR no recent design artifacts reference DESIGN tokens → warn (visual system may have drifted).
- `.agents/skill-artifacts/mkt/campaign-plan.md` mtime > 90 days OR brand refreshed since → warn (campaign positioning may be misaligned).
- `.agents/skill-artifacts/mkt/lp-brief/**/brief.md` mtime > 30 days → warn before re-using (conversion best practices + ICP may have shifted).
- `.agents/skill-artifacts/mkt/copy/*.md` mtime > 30 days → warn (platform-intelligence may have updated; algorithm signals shift).
- `.agents/skill-artifacts/mkt/ad-copy/*.md` mtime > 30 days → warn (Meta policy + claim substantiation rules update).
- `.agents/skill-artifacts/research/short-form-research/*.md` mtime > 30 days → warn (platform algorithms move fast — same threshold as research-skills).
- `skills-resources/loops/*/evals/*.md` newest cycle mtime > 14 days → loop may need a fresh cycle.

## Project-fit check

If `CLAUDE.md` describes a B2B SaaS but `brand/BRAND.md` describes a consumer-app archetype (e.g., "Outlaw" archetype targeting Gen-Z), flag the mismatch. State may be from a different project (working in the wrong directory, or stale clone). Surface the mismatch in the routing output instead of routing blindly.

## When the manifest is stale (>24h)

Per Step 1, the body may regenerate via `bun scripts/manifest-sync.ts` before reading. Document in the output that a regeneration happened — the cost is small but operator should know if their last action was 5s ago vs. 5 days ago.

## Re-entry behavior

`/orchestrate-marketing` is idempotent. If breadcrumb shows last session ran `/brand-system` and `brand/BRAND.md` now exists, advance to the next step (typically `/campaign-plan`). If `/brand-system` ran but no BRAND.md exists, surface that as a discrepancy in the state map and ask before routing onward.
