---
title: Short-Form Research — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: short-form-research
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions.

---

## Needed dimensions

- **Topic** — required (no default; cold-start asks)
- **Market** — single per artifact (cultural patterns are not averageable)
- **Target platforms** — default 3 (TikTok + Reels + Shorts); max 5
- **Audience hint** — soft-required (or `research/icp-research.md` if available)
- **Competitor seeds** — optional (2-5 handles or URLs to seed scout)

## Read order (warm-start scan)

1. `docs/forsvn/artifacts/research/research-shortform/[slug].md` if exists — check (topic, market) match and freshness windows
2. `docs/forsvn/experience/content.md` — most recent entries for market, audience register, topics already researched
3. `docs/forsvn/experience/audience.md` — primary persona, language, habitats
4. `research/icp-research.md`, `research/product-context.md` — full audience + business context if present
5. `brand/BRAND.md` — voice and archetype hints

---

## Warm Start (existing artifact for same topic+market)

When step 1 returns a match, emit:

```
Found existing short-form-research for "[topic]" / "[market]":
- platform_mechanics_date: [date] — [fresh / warn / stale]
- trend_signals_date: [date] — [fresh / warn / stale]
- platforms analyzed: [list]
- sample sizes: TikTok n=12 OK, Reels n=5 LOW_SAMPLE, Shorts n=9 OK

Refresh modes:
(a) Use existing (fresh enough)
(b) Refresh trends only (mechanics still fresh)
(c) Full re-run (both windows)

Which one?
```

Operator's pick determines dispatch scope:
- **(a)** — skip Layer 1, return existing artifact as-is, exit `done`
- **(b)** — dispatch scout × N (re-pull trend signals) but skip mechanics-source verification; partial re-write of artifact (TL;DR, Per-Platform Findings, Trending Audio, Recommendations sections)
- **(c)** — full dispatch (Layer 1 + Layer 2 sequence)

## Cold Start (no existing artifact, no usable experience)

Emit the bundled 5-question prompt (one round-trip):

```
Short-form research starts with five quick decisions (one round-trip).

1. Topic / angle to research:
   [free text — what should the catalog focus on?]

2. Target market:
   (a) Vietnam   (b) US/global English   (c) SEA   (d) Other: ___

3. Platforms to scan (default trio is plenty for most topics):
   (a) Default: TikTok + Reels + Shorts (recommended)
   (b) +X video (founder-mode + thought-leadership topics)
   (c) +LinkedIn video (B2B + professional audiences)
   (d) All 5 (research-heavy, ~$5-10 cost)

4. Audience hint (skip if you've run icp-research):
   [free text — 1-2 sentences. Who is this content for?]

5. Competitor handles to seed scout (optional, recommend 2-5):
   [free text — @handles or URLs we should analyze first]

Answer 1-5 in one response. I'll confirm what I heard, then dispatch.
```

Wait for answers. Do not dispatch without them. If operator skips Q4 (no audience hint AND no ICP), proceed but the audience-fit-agent flags `NEEDS_CONTEXT` and the final artifact carries the flag.

## Write-back to `docs/forsvn/experience/content.md`

After Cold Start answers received, append to `content.md`:

| Q | Key |
|---|---|
| 2. Market | `Content — primary market` |
| 3. Platforms | `Content — short-form platforms in scope` |
| 4. Audience hint | `Content — short-form audience hint` (only if no ICP) |

Q1 (topic) and Q5 (competitor seeds) are per-run inputs — do NOT write-back. They vary per artifact and would pollute the persistent experience store.

## Hard-block conditions

- **Topic empty AND no warm-start match** → BLOCKED, ask for topic.
- **Market unspecified AND no warm-start match** → emit Cold Start (don't guess).
- **Platforms requested > 5** → reject and re-ask (hard cap).
- **No audience hint AND no ICP** → not a hard block, but the artifact carries the flag downstream; warn operator before dispatch.

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Cold Start — when topic / market are missing, the bundled question still fires. `--fast` only skips the multi-agent orchestration after context is resolved (single-pass scout + synthesis, critic skipped, but Critical Gates still enforced per `_shared/mode-resolver.md`).

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter research_shortform
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
