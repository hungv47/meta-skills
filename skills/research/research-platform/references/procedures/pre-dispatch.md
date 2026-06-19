---
title: Platform Evidence Research — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: research-platform
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** the orchestrator enters Pre-Dispatch (before Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions.

---

## Needed dimensions

- **Account scope** — whose account/channel set this evidence base covers (required; cold-start asks)
- **Target platforms** — which of X / LinkedIn / TikTok / YouTube / Instagram are in scope (default: whichever the operator has accounts on)
- **Supplied evidence** — the actual analytics exports, screenshots, figures the operator can provide, per platform
- **Niche / audience hint** — soft-required; picks the benchmark cohort (or `research/icp-research.md` if available)
- **Prior-eval pointer** — optional; `.forsvn/loops/*/evals/` artifacts that hold a `prior_eval` evidence source

## Read order (warm-start scan)

1. `docs/forsvn/artifacts/research/platform-evidence/[slug].md` if it exists — check the account-scope match and both freshness windows
2. `.forsvn/index/manifest.json` — find any `.forsvn/loops/*/evals/*.md` artifacts (a `prior_eval` source the operator may not mention)
3. `docs/forsvn/experience/content.md` — most recent entries for account scope, platforms already analyzed, niche
4. `research/icp-research.md`, `research/product-context.md` — audience + niche context for the benchmark cohort, if present

---

## Warm Start (existing artifact for the same account scope)

When step 1 returns a match, emit:

```
Found an existing platform-evidence artifact for "[account scope]":
- metrics_window_date: [date] — [fresh / warn / stale]
- algorithm_context_date: [date] — [fresh / warn / stale]
- platforms: [list with coverage flags — e.g., X MEASURED, LinkedIn PARTIAL, TikTok NO_EVIDENCE]

Refresh modes:
(a) Use existing (both windows fresh enough)
(b) Refresh metrics only (algorithm context still fresh) — re-intake performance numbers
(c) Full re-run (both windows) — re-intake everything

Which one?
```

Operator's pick determines dispatch scope:
- **(a)** — skip Layer 1, return the existing artifact as-is, exit `done`
- **(b)** — re-run evidence-intake × N with fresh exports; skip the benchmark algorithm-context pull; partial re-write (TL;DR, Evidence Base, Per-Platform Evidence, Cross-Platform Comparison, Recommendations)
- **(c)** — full dispatch (Layer 1 + Layer 2)

## Cold Start (no existing artifact, no usable experience)

Emit the bundled evidence-intake prompt (one round-trip):

```
Platform evidence research starts with what you can actually measure (one round-trip).

1. Account scope — whose accounts is this? (e.g., "FORSVN company accounts", "@founder personal")
   [free text]

2. Platforms in scope:
   (a) Just the ones I name below
   (b) All platforms I have accounts on
   Which platforms — X, LinkedIn, TikTok, YouTube, Instagram?
   [free text — list them]

3. Evidence you can supply, per platform. For each platform, paste or describe what you have:
   - Native analytics exports or screenshots (X Analytics, YouTube Studio, LinkedIn page
     analytics, TikTok/Instagram insights) — the strongest evidence
   - Manual exports / spreadsheets you keep
   - Or "none" — that platform will be flagged NO_EVIDENCE honestly
   [free text or paste — per platform]

4. Niche / audience hint (skip if you've run research-icp):
   [free text — 1-2 sentences. Picks the right benchmark cohort.]

5. Prior eval loops (optional): any .forsvn/loops/ with eval cycles for these accounts?
   [free text — slug or "none"]

Answer 1-5 in one response. I'll confirm what I heard, then dispatch.
Note: I never need your platform logins. Paste exports/screenshots as text — that is the evidence.
```

Wait for answers. Do not dispatch without them. If the operator supplies evidence for zero platforms and step 2 of the warm-start scan found no `prior_eval` artifacts, return `NEEDS_CONTEXT` — name what to export per platform.

## Write-back to `docs/forsvn/experience/content.md`

After Cold Start answers are received, append to `content.md`:

| Q | Key |
|---|---|
| 1. Account scope | `Content — platform account scope` |
| 2. Platforms | `Content — platforms instrumented` |
| 4. Niche hint | `Content — platform-evidence niche hint` (only if no ICP) |

Q3 (supplied evidence) and Q5 (prior-eval pointer) are per-run inputs — do NOT write them back. They vary per run and would pollute the persistent experience store.

## Hard-block conditions

- **Account scope empty AND no warm-start match** → BLOCKED, ask for the account scope.
- **No evidence for any platform AND no `prior_eval` artifacts found** → `NEEDS_CONTEXT` (not a hard block — emit the "what to export" guidance per platform and stop).
- **Platforms requested outside the 5 supported** → note the platform is out of scope and proceed with the supported subset.
- **No niche hint AND no ICP** → not a hard block, but benchmark-agent will flag weaker cohort matches; warn the operator before dispatch.

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Cold Start — when account scope or platform set is unresolved, the bundled prompt still fires. `--fast` only skips the multi-agent orchestration after context is resolved (single-pass intake + synthesis, critic skipped, but all 5 Critical Gates still enforced per `_shared/mode-resolver.md`).

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter research_platform
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
