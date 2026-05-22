---
type: platform-evidence-schema
platform: instagram
schema_version: 1
availability_tier: CONSTRAINED
last_verified: 2026-05-22
---

# Platform Evidence Schema — Instagram

Defines what evidence Instagram produces for an account owner, at what tier, and how to get it. Covers feed posts, Reels, and Stories. Consumed by `evidence-intake-agent` and `benchmark-agent`.

---

## Availability tier

**Tier:** CONSTRAINED

Instagram Insights is available only to Professional accounts (Business or Creator) and is app-centric. It exposes reach, impressions/views, interactions, accounts-engaged, follows, and — for Reels — plays, watch time, and a coarse retention signal. But it is largely viewable, not exportable: most evidence is screenshot-grade, retention is shallow, and Stories metrics expire quickly (Story insights age out within roughly two weeks). Public post pages show like and comment counts and, for Reels, a public play/view count. Treat Instagram evidence as honest and coarse — capture what the operator can screenshot, flag the rest as gaps, and never invent Reels retention precision the platform does not surface to the operator.

## Core metrics

| Metric | Definition | Where it lives |
|---|---|---|
| reach | Distinct accounts that saw the content | Insights, per-post + account |
| engagement_rate | (likes + comments + shares + saves) ÷ reach | Computed from Insights |
| reel_plays | Plays of a Reel — the Reels-signature metric | Insights + public page |

## Owned-analytics fields

`source_type: owned_analytics` — from Instagram Insights (Professional accounts).

| Field | Definition | Notes / granularity |
|---|---|---|
| reach | Distinct accounts reached | Per-post + account; in-app; screenshot-grade |
| impressions / views | Total times shown (label varies by surface) | Per-post |
| interactions | Likes + comments + shares + saves | Per-post; components also itemized |
| saves | Saves of the post — strong intent signal | Per-post |
| reel_plays / watch_time | Reel plays and aggregate watch time | Per-Reel; retention signal is coarse |
| accounts_engaged | Distinct accounts that interacted | Account + per-post |
| follows | Follows attributed to a post / period | Account; weak per-post attribution |
| story_metrics | Reach, taps-forward/back, exits, replies | Per-Story; **expires ~14 days** |

## Public-metrics fields

`source_type: public_metrics`.

| Field | Visible? | Notes |
|---|---|---|
| like count | Sometimes | Account owner may hide it; capture only if shown |
| comment count | Yes | Public |
| reel play/view count | Yes | Public on Reels |
| reach, saves, retention, follows | No | Owner-only |

## API posture (documented — never called by this skill)

The Instagram Graph API (via the Meta developer platform) exposes media insights for Professional accounts connected to a Facebook Page, behind an approved app and access review. Story insights via API are subject to the same ~14-day expiry. The skill never calls it. An operator-run pull pasted in is intaken as `owned_analytics` / `manual_export`.

## Known constraints / gotchas

- Personal accounts have **no Insights at all** — only a Professional (Business/Creator) account produces owned evidence. Record the account type in `scope_note`; a personal account is NO_EVIDENCE for owned metrics.
- Story metrics expire (~14 days) — once gone, they cannot be recovered; a Stories gap is often permanent, not just "not exported yet".
- Instagram has relabeled "impressions" → "views" across surfaces — confirm which the operator's screenshot uses.
- Reel retention is shallow vs. YouTube — expect a coarse "average watch time" or a simple drop-off, not a per-second curve.
- The platform aggregates feed, Reels, and Stories differently — never blend them into one engagement number; keep the surface in `scope_note`.

## Typical export path

Instagram app (Professional account) → Insights → Overview / Content you shared → tap a post or Reel → screenshot the metrics panel. Account-level: Insights → Reach / Engagement / Audience. There is no first-party bulk CSV export — evidence is screenshot-grade unless the operator runs the Graph API themselves.

## Changelog

| Date | Change |
|---|---|
| 2026-05-22 | Initial schema (WS6) |
