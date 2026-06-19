---
title: Short-Form Eval — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: short-form-eval
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions.

---

## Needed dimensions

- **Loop slug** (positional arg) — existing marketing loop under `.forsvn/loops/[slug]/`
- **Post URL** (positional arg) — public URL of the published short-form post
- **Brief path** (positional arg) — path to the brief artifact that produced the post
- **Platform-intel catalog** — auto-resolve from brief frontmatter; ask once if multiple match
- **Cycle index** — auto-increment from loop `results.tsv` (no operator input needed)

## Read order

1. `.forsvn/loops/[loop-slug]/program.md`, `context.md`, and `results.tsv` — confirm the loop exists and find the next cycle.
2. `<brief-path>` — confirm it exists, parse frontmatter for topic, market, target platform, hook archetype claim.
3. `docs/forsvn/artifacts/research/research-shortform/[slug].md` — locate the matching catalog by topic+market; if multiple match, ask user once.
4. `.forsvn/index/manifest.json` — confirm catalog freshness (warn if stale; don't block).
5. `docs/forsvn/experience/content.md` — most recent entries for market and audience register.

---

## Warm Start (brief, post URL, and matching catalog all resolvable)

```
Found:
- brief: [path] (topic="[topic]", market="[market]", platform=[platform])
- loop: .forsvn/loops/[slug]/
- catalog: docs/forsvn/artifacts/research/research-shortform/[slug].md (last refreshed [date])
- prior cycles in results.tsv: N → this is cycle N+1
- post URL: [url]

Cycle 1 reminder: 70% observation / 30% scoring. Rubric is provisional v0.1.

Proceed with eval, or override?
```

Operator picks:
- **Proceed** — dispatch Layer 1 immediately
- **Override** — operator may specify alternate brief path, alternate catalog, or force-reset cycle index; re-confirm before dispatch

## Cold Start (catalog cannot be auto-resolved)

```
Short-form eval needs three things to score a post against a known reference. Two are in the args; one is missing.

1. Existing marketing loop slug for this short-form initiative:
   [free text — create one first with eval-loop if none exists]

2. Topic of this post (one phrase — to match a short-form-research catalog):
   [free text]

3. Target market the post was aimed at:
   (a) Vietnam   (b) US/global English   (c) SEA   (d) Other: ___

4. Platform of this post:
   (a) TikTok   (b) Reels   (c) Shorts   (d) X video   (e) LinkedIn video

Answer 1-4 in one response. I'll resolve the loop, catalog, and dispatch.
```

If no catalog matches after the cold-start answer, return **BLOCKED** with the recommendation: "Run `research-shortform` for `[topic]` / `[market]` first; eval against missing reference is meaningless."

## Write-back to `docs/forsvn/experience/content.md`

After Cold Start answers received, append to `content.md`:

| Q | Key |
|---|---|
| 1. Topic | `Content — short-form eval topic` (most recent) |
| 2. Market | `Content — primary market` (only if not already present) |
| 3. Platform | `Content — short-form eval platform` |

The loop slug (positional arg 1) is per-run and does NOT write-back.

## Hard-block conditions

- **Loop slug doesn't resolve to existing workspace** → BLOCKED; recommend `run-pipeline` to create the workspace first.
- **Brief path doesn't exist** → BLOCKED; ask operator for correct path.
- **Post URL unfetchable** (404, rate-limited, paywalled) → BLOCKED; state what's needed.
- **No matching catalog after Cold Start** → BLOCKED; defer to `research-shortform`.
- **Cycle 2 or 3 boundary AND rubric not revised** → not a hard block, but ship `done_with_concerns` with mandatory revision flagged in the report.

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Cold Start when catalog/brief/loop are unresolvable. `--fast` only collapses the multi-agent orchestration to single-pass eval-runner after context is resolved — Critical Gates above STILL fire (catalog-required, brief-required, citation-required, pattern-shape-required, cycle-1-weighting honored).

## Catalog freshness handling

Catalog freshness signals (from manifest):
- `fresh` — within 14d trend window + 90d mechanics window → declare `catalog_freshness: fresh` in eval frontmatter
- `warn` — 14-30d trend OR 90-180d mechanics → declare `catalog_freshness: warn`, note in Open Risks section
- `stale` — >30d trend OR >180d mechanics → declare `catalog_freshness: stale`, recommend catalog refresh in §7 Recommendations, BUT still run the eval (signal is partial, not zero)

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter evaluate_shortform
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
