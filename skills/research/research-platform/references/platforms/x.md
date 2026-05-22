---
type: platform-evidence-schema
platform: x
schema_version: 1
availability_tier: RICH
last_verified: 2026-05-22
---

# Platform Evidence Schema — X (formerly Twitter)

Defines what evidence X produces for an account owner, at what tier, and how to get it. Consumed by `evidence-intake-agent` and `benchmark-agent`.

---

## Availability tier

**Tier:** RICH

X Analytics gives the account owner post-level and account-level metrics — impressions, engagements, profile visits, follows — with a date-range selector and CSV export. Premium accounts get extended post analytics. X is also the only major platform that has open-sourced its ranking algorithm (2023, re-released January 2026), so the *meaning* of an owned metric is unusually well-grounded — reply weight, dwell, the in-network/out-of-network split are documented, not guessed. Public post pages also surface view, repost, like, and reply counts without login, so `public_metrics` is a viable secondary source. Export friction is low.

## Core metrics

| Metric | Definition | Where it lives |
|---|---|---|
| impressions | Times the post was served in a feed/search | X Analytics, per-post + account summary |
| engagement_rate | Engagements ÷ impressions | X Analytics (engagements reported; rate often computed) |
| reply_rate | Replies ÷ impressions — X-signature; replies are the platform's top-weighted signal | X Analytics (replies count) + computed |

## Owned-analytics fields

`source_type: owned_analytics` — from X Analytics.

| Field | Definition | Notes / granularity |
|---|---|---|
| impressions | Feed/search serves | Per-post and account-summary; date-range selectable |
| engagements | Sum of all interactions on a post | Per-post; X also breaks out the components below |
| likes / reposts / replies / bookmarks | Per-interaction-type counts | Per-post; replies and bookmarks are the high-weight signals |
| profile_visits | Profile clicks attributed to a post / period | Account-summary and per-post |
| new_follows | Follows attributed to a period | Account-summary; weak per-post attribution |
| video_views / completion | For video posts — views and watch-through | Per-post; completion granularity is coarse |

## Public-metrics fields

`source_type: public_metrics` — visible on a public post page.

| Field | Visible? | Notes |
|---|---|---|
| view count | Yes | Public on every post; this is impressions-equivalent |
| like / repost / reply / bookmark counts | Yes | Public; bookmark count was made public in recent UI |
| profile visits, follow attribution | No | Owner-only |

## API posture (documented — never called by this skill)

The X API v2 exposes post metrics and (Premium tiers) post-analytics endpoints. Recent metrics are restricted to a ~30-day non-public window for some fields; older data and some breakdowns are gated by access tier. The skill never calls the API. If the operator runs an API pull themselves and pastes the result in, intake it as `owned_analytics` (their instrumented data) or `manual_export` (if post-processed).

## Known constraints / gotchas

- "Impressions" and the public "view count" are the same idea but X has relabeled them across UI versions — confirm which the operator's export uses.
- New-follow attribution per post is weak — treat per-post follow numbers as M confidence at best.
- Premium-account distribution multipliers mean a raw engagement number is not comparable across a Premium/free account change — note the account's Premium status in the `scope_note`.
- Post half-life on X is short (hours) — a `measured_at` matters more here than on slower platforms.

## Typical export path

X (web) → Analytics → select the date range → export the CSV, or screenshot the account summary and per-post panels. For a single post: open the post → "View post analytics".

## Changelog

| Date | Change |
|---|---|
| 2026-05-22 | Initial schema (WS6) |
