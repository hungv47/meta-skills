---
name: research-platform
description: "Turns the operator's own platform evidence — owned analytics, public metrics, manual exports, qualitative observations, and prior eval outcomes — into a sourced per-platform evidence base across X, LinkedIn, TikTok, YouTube, and Instagram. Every metric is tagged with its evidence source and freshness; every recommendation names the platform, source, window, and confidence behind it. Use to ground social / SEO / short-form decisions in measured reality before briefing or publishing, or to refresh a stale evidence base. Not for discovering what's working in the wild (use research-shortform) or competitive / market sizing (use research-market). For audience research, see research-icp."
argument-hint: "[platform set or account/channel to analyze]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch Write
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$2-5 (default scope) / $4-8 (all 5 platforms, deep)"
---

# Platform Evidence Research — Orchestrator

*Pipeline skill — produces the per-platform evidence base that social, SEO, short-form, and evaluation skills consume to ground recommendations in measured reality instead of intuition.*

**Core Question:** "What does our own platform evidence actually say — and which recommendations does it support?"

[Read [`references/playbook.md`](references/playbook.md) [PLAYBOOK] for why this skill exists, the evidence-not-intuition doctrine, the credential-free posture, the distinction from research-shortform, and when NOT to use.]

---

## Critical Gates — Read First

Non-negotiable constraints before dispatching any agent:

1. **No invented metrics.** Every number traces to a named evidence source — `owned_analytics`, `public_metrics`, `manual_export`, `forum_observation`, or `prior_eval` — with a `measured_at` date. A number with no source is fabricated even if it looks plausible, and fails critic rubric #1.
2. **Owned / public / estimated is labeled per datum.** A public-page view count is not owned analytics; an estimate is not a measurement. Every metric carries its source-type tag — never present a guess, a public figure, or a benchmark as instrumented owned data.
3. **Evidence availability is platform-specific — declare it honestly.** Each per-platform section declares its tier (RICH / MODERATE / CONSTRAINED). TikTok and Instagram default CONSTRAINED — do not invent retention-curve or demographic depth a platform does not expose to the operator.
4. **Missing evidence is a gap, never a fabrication.** A platform with no supplied evidence gets a `NO_EVIDENCE` flag and a "what to export" note — not a modeled estimate. No evidence for any platform → `NEEDS_CONTEXT`.
5. **Metrics decay — two freshness windows.** `metrics_window_date` (30d refresh / 60d warn) governs performance numbers; `algorithm_context_date` (90d refresh / 180d warn) governs platform-mechanic context. Every datum carries `measured_at`; stale evidence is flagged, never silently aged into a current claim.

## Quality Gate

Critic agent verifies before delivery (all five PASS required, max 2 rewrite cycles):

- [ ] Every metric and number traces to a tagged evidence source with a `measured_at` date
- [ ] Every datum is labeled `owned_analytics` / `public_metrics` / `manual_export` / `forum_observation` / `prior_eval` — no source-type blank, no public or benchmark figure mislabeled as owned
- [ ] Every per-platform section declares an evidence-coverage flag (MEASURED / PARTIAL / NO_EVIDENCE) that matches its actual evidence count and source mix
- [ ] Every recommendation names platform, evidence source, freshness window, and confidence — generic recommendations fail
- [ ] `NO_EVIDENCE` platforms carry no recommendations — only a "what to export" gap note

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: deep`; `--fast` collapses to single-pass intake + synthesis with the critic skipped — but the 5 Critical Gates above STILL enforce (safety supersedes `--fast`). Cold Start still fires under `--fast` when platform scope or account ownership is unresolved.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify the output path matches the canonical inventory.
2. Read `.forsvn/index/manifest.json` — check for a prior `platform-evidence` artifact for this account scope (warm-start eligibility) and for `.forsvn/loops/*/evals/` artifacts (a `prior_eval` evidence source the operator may not have mentioned).
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, the evidence-intake prompt, warm/cold start, and the write-back map all live there.

## Artifact Contract

- **Path:** `.forsvn/artifacts/research/platform-evidence/[slug].md` (one artifact per account scope + platform set)
- **Lifecycle:** `pipeline` (per `research-skills/CLAUDE.md` taxonomy — regenerable, point-in-time; refresh is governed by the two freshness windows, not manifest archival). Evidence is re-measured on re-run, never amended in place.
- **Frontmatter fields:** `type`, `status`, `date`, `account_scope`, `platforms_analyzed`, `metrics_window_date`, `algorithm_context_date`, `evidence_sources_logged`, `coverage_per_platform` (full schema in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE])
- **Required body sections (in order — cross-stack contract):** TL;DR · Evidence Base · Per-Platform Evidence · Cross-Platform Comparison · Recommendations · Missing Evidence & How to Close It · Open Risks & Caveats · What This Evidence Doesn't Cover
- **Side effects (mandatory on PASS or done_with_concerns per `procedures/dispatch-mechanics.md`):**
  - Write `.forsvn/artifacts/research/platform-evidence/[slug].md`
  - Run `bun scripts/manifest-sync.ts` so the artifact indexes into `.forsvn/index/`
  - Experience write-back per `procedures/pre-dispatch.md` Write-back map (account scope + platforms in scope → `.forsvn/experience/content.md`)
- **Required Artifacts:**

  | Artifact | Source | If Missing |
  |----------|--------|------------|
  | none | — | Entry point — the operator supplies evidence at Pre-Dispatch |

- **Optional Artifacts:**

  | Artifact | Source | Benefit |
  |----------|--------|---------|
  | `.forsvn/loops/*/evals/*.md` | run-eval-loop / evaluate-* | Prior eval outcomes become a `prior_eval` evidence source |
  | `research/icp-research.md` | research-icp | Audience grounding for reading which segments the evidence reflects |

- **Consumed by:** `write-social`, `optimize-seo`, `research-shortform`, `evaluate-content`, `evaluate-shortform`, `publish-social` — each reads Per-Platform Evidence + Recommendations to ground a decision in measured performance instead of intuition
- **Cross-stack OUTPUT contract:** the frontmatter schema + 8 body sections + per-datum source-type tags + the MEASURED / PARTIAL / NO_EVIDENCE flag + the recommendation 4-part attribution (platform / source / window / confidence) are load-bearing — schema changes require atomic update of consumers (per `anti-patterns.md` row "Cross-stack contract drift")

---

## Agent Manifest

5 agents across 2 layers:

| Agent | Layer | Role | Input | Output |
|-------|-------|------|-------|--------|
| [evidence-intake-agent](agents/evidence-intake-agent.md) × N | L1 (parallel) | Normalize operator-supplied + public evidence for ONE platform into the evidence schema; tag every datum with source-type + `measured_at` + confidence; assign the coverage flag | brief + supplied evidence + platform | Per-platform evidence record |
| [benchmark-agent](agents/benchmark-agent.md) | L1 (parallel) | Establish external baselines per platform (platform-typical metric ranges + current algorithm context) so owned numbers read against a reference, not in a vacuum | brief + platforms in scope | Per-platform benchmark context |
| [synthesis-agent](agents/synthesis-agent.md) | L2 (sequential) | Assemble the artifact — Evidence Base, Per-Platform Evidence, Cross-Platform Comparison, risks — from intake + benchmark outputs | all L1 outputs | Artifact draft (all sections except Recommendations) |
| [recommendation-agent](agents/recommendation-agent.md) | L2 (sequential) | Derive ranked recommendations; each names platform, evidence source, freshness window, confidence; gated by the per-platform coverage flag | synthesis draft + benchmark context | Recommendations section |
| [critic-agent](agents/critic-agent.md) | L2 (final) | 5-rubric quantitative gate — citation, source-type honesty, coverage-flag accuracy, recommendation completeness, freshness; routes failures to the named agent | full merged artifact | PASS or FAIL with rewrite routing |

---

## Routing + Dispatch

Single route — the full Layer 1 + Layer 2 sequence runs every time. Evidence depth varies by what the operator supplies, not by a route choice:

```
1. Pre-Dispatch (warm-start scan + evidence-intake prompt) — per procedures/pre-dispatch.md
2. LAYER 1 IN PARALLEL: evidence-intake-agent × N (one per platform) + benchmark-agent
3. LAYER 2 SEQUENTIAL: synthesis → recommendation → critic
4. Critic FAIL → re-dispatch named agent(s) with feedback (max 2 cycles); after cycle 2, ship done_with_concerns
5. Side effects: write artifact, run manifest-sync, experience write-back
```

`--fast` collapses to a single-pass intake + synthesis with the critic skipped — Critical Gates still enforced. Mechanics (how to spawn agents, parallel/sequential tables, critic routing, single-agent fallback, chain position, re-run triggers, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

The 5 evidence-source types, intake and validation rules, source-type tagging, and the coverage-flag thresholds live in [`references/evidence-protocol.md`](references/evidence-protocol.md) [PROCEDURE] — every agent that touches a datum reads it.

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — covers fabricated metrics, source-type laundering, fake precision on CONSTRAINED platforms, coverage-flag inflation, generic recommendations, stale-evidence masking, critic-loop overrun, cross-stack contract drift, and more.

## Completion Status

Skill returns one of:

- **DONE** — all 5 critic rubrics PASS within ≤2 cycles; every in-scope platform carries a coverage flag (MEASURED, PARTIAL, or an honest NO_EVIDENCE).
- **DONE_WITH_CONCERNS** — critic loop cap reached; remaining failures are surfaceable as warnings (e.g., one platform PARTIAL, one evidence source past its freshness window). Concerns pinned at the top of the artifact.
- **BLOCKED** — WebSearch / WebFetch blocked when a benchmark pull was required; or supplied exports unreadable. Requires operator action — state what's needed.
- **NEEDS_CONTEXT** — no evidence supplied for any platform and none retrievable; recommend what to export and which `evaluate-*` loop could feed `prior_eval` data.

## References

| Reference | Load class | Use For |
|---|---|---|
| [playbook.md](references/playbook.md) | PLAYBOOK | Why this skill exists, evidence-not-intuition doctrine, credential-free posture, distinction from research-shortform, when NOT to use |
| [_shared/before-starting-check.md](references/_shared/before-starting-check.md) | PLAYBOOK | Pre-Pre-Dispatch read pattern (canonical at `references/`, synced) |
| [_shared/mode-resolver.md](references/_shared/mode-resolver.md) | PROCEDURE | `--fast` / `--deep` behavior contract |
| [_shared/pre-dispatch-protocol.md](references/_shared/pre-dispatch-protocol.md) | PROCEDURE | Canonical Pre-Dispatch spec |
| [_shared/confidence-labeling.md](references/_shared/confidence-labeling.md) | PROCEDURE | Canonical H/M/L confidence label + L-resolution rule |
| [procedures/pre-dispatch.md](references/procedures/pre-dispatch.md) | PROCEDURE | Needed dimensions, the evidence-intake prompt, warm/cold start, write-back map |
| [procedures/dispatch-mechanics.md](references/procedures/dispatch-mechanics.md) | PROCEDURE | Layer 1/2 spawn mechanics, critic routing, single-agent fallback, chain position, skill deference |
| [evidence-protocol.md](references/evidence-protocol.md) | PROCEDURE | The 5 evidence-source types, intake / validation rules, source-type tagging, coverage-flag thresholds |
| [format-conventions.md](references/format-conventions.md) | PROCEDURE | Frontmatter schema, date format, metric-citation format, per-platform section order, coverage-flag placement |
| [scoring-rubrics.md](references/scoring-rubrics.md) | data catalog | Coverage-flag thresholds, freshness windows, the 5 critic rubrics |
| [anti-patterns.md](references/anti-patterns.md) | ANTI-PATTERN | Failure modes — fabricated metrics, source-type laundering, coverage inflation, cross-stack drift |
| [examples/platform-evidence-walkthrough.md](references/examples/platform-evidence-walkthrough.md) | EXAMPLE | Full run walkthrough — a 3-platform evidence base with mixed coverage flags traced through the critic gate |
| [platforms/](references/platforms/) | data catalog | Per-platform evidence schemas (x, linkedin, tiktok, youtube, instagram) — availability tier, what each platform exposes, metric definitions |
| `research-skills/CLAUDE.md` | reference | Stack-level conventions (Pre-Dispatch Protocol, Complexity Routing, Multi-Agent Skills) |
