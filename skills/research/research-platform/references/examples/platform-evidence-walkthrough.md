# Worked Example — Platform Evidence Walkthrough

A full `research-platform` run on a realistic account scope, traced from Pre-Dispatch through the critic gate. Shows mixed coverage flags (MEASURED / PARTIAL / NO_EVIDENCE) and a critic FAIL caught and fixed. Illustrative — the metrics are constructed for the example.

---

## Setup

**Operator ask:** "Pull our platform analytics evidence for our X, LinkedIn, and TikTok accounts."
**Account scope:** FORSVN company accounts. **Run date:** 2026-05-22.

## Pre-Dispatch

No prior `platform-evidence` artifact found → Cold Start. The operator answers the bundled prompt:

1. Account scope: FORSVN company accounts
2. Platforms: X, LinkedIn, TikTok
3. Evidence supplied:
   - **X** — pasted X Analytics 28-day account-summary export (ending 2026-05-18) + per-post panel for 6 posts
   - **LinkedIn** — one screenshot of the Company Page "last 30 days" overview (2026-05-20)
   - **TikTok** — "none — we haven't posted much there"
4. Niche hint: B2B, AI agent tooling, developer audience
5. Prior eval loops: none

Warm-start scan also found `.forsvn/loops/q2-launch/evals/2026-04-30-cycle-1.md` — an `evaluate-content` cycle holding a published-post outcome for X. The orchestrator flags it as a `prior_eval` source the operator did not mention.

Windows set: `metrics_window_date: 2026-05-18`, `algorithm_context_date: 2026-05-22`.

## Layer 1 — parallel

**evidence-intake-agent × 3** (one per platform) + **benchmark-agent**.

### evidence-intake-agent — X → MEASURED

The X Analytics export plus the per-post panels plus the `prior_eval` figure give corroborating evidence across two source types:

| Metric | Value | Source type | Measured | Confidence |
|---|---|---|---|---|
| impressions (28d) | 84,200 | owned_analytics | 2026-05-18 | H |
| engagement_rate (28d) | 1.9% | owned_analytics | 2026-05-18 | H |
| reply_rate (28d) | 0.4% | owned_analytics | 2026-05-18 | H |
| post outcome (q2-launch hero post) | 3.1% eng. | prior_eval | 2026-04-30 | H |

`owned_analytics` on all core metrics + 4 items across 2 source types → **MEASURED**.

### evidence-intake-agent — LinkedIn → PARTIAL

Only one screenshot, one source type:

| Metric | Value | Source type | Measured | Confidence |
|---|---|---|---|---|
| impressions (30d) | 12,400 | owned_analytics | 2026-05-20 | M |
| reactions (30d) | 210 | owned_analytics | 2026-05-20 | M |
| follower_growth (30d) | +48 | owned_analytics | 2026-05-20 | M |

Real owned data, but a single screenshot is one source — uncross-checkable → **PARTIAL**. Evidence Gaps: per-post breakdown, clicks, audience breakdown not supplied.

### evidence-intake-agent — TikTok → NO_EVIDENCE

No evidence supplied, none publicly meaningful for a barely-used account → **NO_EVIDENCE**. Evidence Gaps: the export path to TikTok Creator analytics.

### benchmark-agent

B2B-cohort ranges: X engagement 0.5–2.0% ([Industry Social Benchmark 2026], 2026-02-18); LinkedIn Company Page engagement 1.5–3.5% (same source). TikTok: cohort B2B-developer benchmark is thin — flagged a Benchmark Gap.

## Layer 2 — sequential

**synthesis-agent** assembles the artifact. X engagement 1.9% reads "within the 0.5–2.0% B2B band, upper half"; LinkedIn engagement computes to ~1.7%, "low end of the 1.5–3.5% band". TikTok section: header + flag + pointer to §6, no metrics table.

**recommendation-agent** writes Recommendations + TL;DR:
- X (MEASURED): "Reply rate 0.4% sits well below engagement — the algorithm's top-weighted signal is underused. Spec author-replies in the first hour on the next 6 posts; re-measure reply_rate." — confidence H.
- LinkedIn (PARTIAL): "Engagement at the low end of the B2B band — directional. Export per-post data before drawing a firm conclusion." — confidence M, directional.
- TikTok (NO_EVIDENCE): no recommendations; pointer to §6.

## Critic — cycle 1: FAIL

critic-agent runs the 5 rubrics:

- Rubric 1 (Evidence Citation): **PASS** — 5 spot-checked numbers all tagged + dated.
- Rubric 2 (Source-Type Honesty): **PASS**.
- Rubric 3 (Coverage-Flag Accuracy): **PASS** — X MEASURED, LinkedIn PARTIAL, TikTok NO_EVIDENCE all match the threshold rule.
- Rubric 4 (Recommendation Completeness): **FAIL** — the LinkedIn recommendation is missing its Freshness window line. Route → recommendation-agent: "Add the Freshness window line to the LinkedIn recommendation (measured 2026-05-20, fresh)."
- Rubric 5 (Freshness): **PASS**.

## Critic — cycle 2: PASS

recommendation-agent adds the missing line. critic re-runs: all 5 PASS. Artifact ships **DONE**.

Frontmatter `coverage_per_platform`: `{ x: {items: 4, flag: MEASURED}, linkedin: {items: 3, flag: PARTIAL}, tiktok: {items: 0, flag: NO_EVIDENCE} }`.

## What the example demonstrates

- **A NO_EVIDENCE platform is not a failure.** TikTok ships with an honest flag and a precise "what to export" note — useful output, not a hole.
- **One rich source is still PARTIAL.** LinkedIn had real owned analytics, but a single screenshot cannot be cross-checked — the flag is honest, and its recommendation is capped at M and marked directional.
- **The `prior_eval` source mattered.** The orchestrator surfaced an eval artifact the operator forgot — it became the second source type that earned X its MEASURED flag.
- **The critic gates completeness, not polish.** The artifact was substantively right; the critic still failed it for one missing attribution line. Four-part attribution is mechanical, not optional.
