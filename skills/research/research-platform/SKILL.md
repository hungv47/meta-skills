---
name: research-platform
description: "Turns the operator's own platform evidence — owned analytics, public metrics, manual exports, and prior eval outcomes — into a sourced per-platform evidence base across X, LinkedIn, TikTok, YouTube, and Instagram, every metric tagged to its source and freshness. Use to ground social / SEO / short-form decisions in measured reality before briefing. Not for discovering what's working in the wild (use research-shortform) or market sizing (use research-market); for audience research, see research-icp."
argument-hint: "[platform set or account/channel to analyze]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch Write
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$2-5 (default scope) / $4-8 (all 5 platforms, deep)"
---

# Platform Evidence Research — Orchestrator

*Pipeline skill — turns owned-account analytics (engagement, follower growth, per-post performance) into a sourced per-platform evidence base that social, SEO, short-form, and evaluation skills consume to ground recommendations in measured reality instead of intuition. Operates on the operator's own accounts (not market trends).*

**Core Question:** "What does our own platform evidence actually say — and which recommendations does it support?"

> Why this skill exists, evidence-not-intuition doctrine, credential-free posture, distinction from research-shortform, when NOT to use: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

---

## Critical Gates — Read First

Non-negotiable before dispatching any agent (5 evidence-source types + thresholds: [`references/evidence-protocol.md`](references/evidence-protocol.md) [PROCEDURE]):

1. **No invented metrics.** Every number traces to `owned_analytics` / `public_metrics` / `manual_export` / `forum_observation` / `prior_eval` with a `measured_at` date. Unsourced = fabricated.
2. **Source-type labeled per datum.** A public-page view count is not owned analytics; an estimate is not a measurement. Never present a guess or benchmark as instrumented owned data.
3. **Evidence availability is platform-specific — declare it honestly.** Each per-platform section declares RICH / MODERATE / CONSTRAINED. TikTok and Instagram default CONSTRAINED — never invent retention-curve or demographic depth a platform doesn't expose.
4. **Missing evidence is a gap, never a fabrication.** Platform with no evidence → `NO_EVIDENCE` flag + "what to export" note. All platforms empty → `NEEDS_CONTEXT`.
5. **Metrics decay — two freshness windows.** `metrics_window_date` (30d refresh / 60d warn) governs performance numbers; `algorithm_context_date` (90d refresh / 180d warn) governs platform-mechanic context. Stale evidence is flagged, never silently aged.

## Quality Gate

Critic verifies before delivery (all 5 PASS required, max 2 rewrite cycles; full rubrics in [`references/scoring-rubrics.md`](references/scoring-rubrics.md)):

- [ ] Every metric traces to a tagged evidence source with `measured_at`
- [ ] Every datum labeled `owned_analytics` / `public_metrics` / `manual_export` / `forum_observation` / `prior_eval` — no blank, no public/benchmark mislabeled as owned
- [ ] Every per-platform section declares MEASURED / PARTIAL / NO_EVIDENCE matching its actual evidence count + source mix
- [ ] Every recommendation names platform, evidence source, freshness window, confidence — generic fails
- [ ] `NO_EVIDENCE` platforms carry no recommendations — only a "what to export" gap note

---

## Before Starting

Per [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md). `--fast` collapses to single-pass intake + synthesis with critic skipped — but the 5 Critical Gates STILL enforce (safety supersedes `--fast`). Cold Start still fires when platform scope or account ownership is unresolved.
   Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path.
2. Read `.forsvn/index/manifest.json` — check for prior `platform-evidence` artifact (warm-start) and for `.forsvn/loops/*/evals/` artifacts (a `prior_eval` source the operator may not have mentioned).
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, evidence-intake prompt, warm/cold start, write-back map.

| Artifact | Source | Required? |
|---|---|---|
| `.forsvn/loops/*/evals/*.md` | run-pipeline / evaluate-* | Optional — becomes a `prior_eval` evidence source |
| `research/icp-research.md` | research-icp | Optional — audience grounding for reading segments |

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/research-research-platform-<YYYY-MM-DD>-<slug>.md` (flat v2 grammar; one artifact per account scope + platform set)
- **Lifecycle:** `pipeline` (regenerable, point-in-time; refresh governed by the two freshness windows). Evidence is re-measured on re-run, never amended in place.
- **Frontmatter fields:** `skill`, `type`, `status`, `date`, `stack` (=research), `review_surface` (=md), `account_scope`, `platforms_analyzed`, `metrics_window_date`, `algorithm_context_date`, `evidence_sources_logged`, `coverage_per_platform`. Full schema: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]. v2 baseline: [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Required body sections (cross-stack contract, in order):** TL;DR · Evidence Base · Per-Platform Evidence · Cross-Platform Comparison · Recommendations · Missing Evidence & How to Close It · Open Risks & Caveats · What This Evidence Doesn't Cover
- **Side effects (on PASS or done_with_concerns):** write artifact → run `bun scripts/manifest-sync.ts` → experience write-back (account scope + platforms → `docs/forsvn/experience/content.md`).
- **Consumed by:** `write-social`, `optimize-seo`, `research-shortform`, `evaluate-content`, `evaluate-shortform`, `publish-social` — each reads Per-Platform Evidence + Recommendations to ground decisions in measured performance.
- **Cross-stack OUTPUT contract:** frontmatter schema + 8 body sections + per-datum source-type tags + MEASURED / PARTIAL / NO_EVIDENCE flag + recommendation 4-part attribution (platform / source / window / confidence) are load-bearing — schema changes require atomic update of consumers.

---

## Agent Manifest

5 agents across 2 layers (evidence-intake × N + benchmark in parallel; synthesis → recommendation → critic sequential). Full table + dispatch sequence + `--fast` behavior: [`references/agent-manifest.md`](references/agent-manifest.md) [PROCEDURE]. Mechanics (spawn, critic routing, single-agent fallback, chain position, skill deference): [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

Single route — full Layer 1 + Layer 2 sequence runs every time. Evidence depth varies by what the operator supplies, not by route choice.

---

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — fabricated metrics, source-type laundering, fake precision on CONSTRAINED platforms, coverage-flag inflation, generic recommendations, stale-evidence masking, critic-loop overrun, cross-stack contract drift. Re-read before any output ships.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

Skill returns one of:

- **DONE** — all 5 critic rubrics PASS within ≤2 cycles; every in-scope platform carries a coverage flag (MEASURED, PARTIAL, or honest NO_EVIDENCE).
- **DONE_WITH_CONCERNS** — critic loop cap reached; remaining failures are surfaceable as warnings (e.g., one platform PARTIAL, one source past freshness). Concerns pinned at the top of the artifact.
- **BLOCKED** — WebSearch / WebFetch blocked when a benchmark pull was required; or supplied exports unreadable. State what's needed.
- **NEEDS_CONTEXT** — no evidence supplied for any platform and none retrievable; recommend what to export and which `evaluate-*` loop could feed `prior_eval` data.

## Next Step

After delivery: feed Per-Platform Evidence + Recommendations into `write-social` / `optimize-seo` / `research-shortform` / `evaluate-content` / `evaluate-shortform` / `publish-social`. Refresh when `metrics_window_date` > 30d or `algorithm_context_date` > 90d.

---

## Worked Example

Full run — 3-platform evidence base with mixed coverage flags traced through the critic gate: [`references/examples/platform-evidence-walkthrough.md`](references/examples/platform-evidence-walkthrough.md) [EXAMPLE].

## References

- `references/playbook.md`, `evidence-protocol.md`, `format-conventions.md`, `scoring-rubrics.md`, `anti-patterns.md`
- `references/agent-manifest.md`, `references/procedures/{pre-dispatch, dispatch-mechanics}.md`
- `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, confidence-labeling}.md`
- `references/platforms/` — per-platform evidence schemas (x, linkedin, tiktok, youtube, instagram): availability tier, exposed metrics, definitions
- 5 sub-agents in `agents/`; `critic-agent.md` holds the canonical 5-rubric gate
- `research-skills/CLAUDE.md` — stack conventions (Pre-Dispatch, Complexity Routing, Multi-Agent)
