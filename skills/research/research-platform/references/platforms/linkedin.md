---
type: platform-evidence-schema
platform: linkedin
schema_version: 1
availability_tier: MODERATE
last_verified: 2026-05-22
---

# Platform Evidence Schema — LinkedIn

Defines what evidence LinkedIn produces for an account owner, at what tier, and how to get it. Consumed by `evidence-intake-agent` and `benchmark-agent`.

---

## Availability tier

**Tier:** MODERATE

LinkedIn analytics depend heavily on the account type. **Company Pages** expose solid post and page analytics — impressions, reactions, comments, reposts, follower growth, and an export. **Personal profiles** with creator mode get per-post analytics (impressions, engagement, audience breakdown) but with less depth and a more app-like surface. Public post pages show reaction and comment counts but not impressions. Export friction is moderate — Pages export cleanly; personal-profile data is mostly screenshot-grade. Dwell time is reported to Page admins but with no public benchmark, so it can be tracked over the account's own history but not against an external reference.

## Core metrics

| Metric | Definition | Where it lives |
|---|---|---|
| impressions | Times the post was served | Page analytics / creator-mode post analytics |
| engagement_rate | (reactions + comments + reposts + clicks) ÷ impressions | Page analytics (often computed) |
| follower_growth | Net new followers over a period | Page analytics; personal-profile follower trend |

## Owned-analytics fields

`source_type: owned_analytics`.

| Field | Definition | Notes / granularity |
|---|---|---|
| impressions | Feed serves | Per-post; Pages give date-range; personal posts give a rolling window |
| reactions / comments / reposts | Per-interaction counts | Per-post |
| clicks | Link / media / "see more" clicks | Per-post; Pages report; personal more limited |
| unique_impressions | Distinct members reached | Pages only |
| follower_growth | Net follows over a period | Pages: clean export. Personal: trend chart, screenshot-grade |
| audience_breakdown | Viewer job title / industry / seniority / company size | Pages and creator-mode; aggregate, privacy-floored |
| dwell signal | LinkedIn weights dwell, reported coarsely to admins | Pages; no public benchmark — track vs. own history |

## Public-metrics fields

`source_type: public_metrics`.

| Field | Visible? | Notes |
|---|---|---|
| reaction count | Yes | Public on every post |
| comment / repost counts | Yes | Public |
| impressions, clicks, dwell, audience breakdown | No | Owner-only |

## API posture (documented — never called by this skill)

LinkedIn's Marketing API and Community Management API expose Page post analytics and follower statistics, but access requires an approved developer app and partner-program review — non-trivial friction, and versioned. Personal-profile analytics are essentially unavailable via API. The skill never calls it. An operator-run API pull pasted in is intaken as `owned_analytics` or `manual_export`.

## Known constraints / gotchas

- Company Page vs. personal profile is the single biggest variable — always record which in the `scope_note`; their metric sets and export quality differ materially.
- "Engagement rate" definitions vary — LinkedIn's own figure, a computed one, and a third-party tool's will not match. Capture the formula or mark M confidence.
- Audience-breakdown buckets are privacy-floored (small segments suppressed) — treat thin segments as directional.
- LinkedIn post lifespan is long (days to weeks) — a slightly older `measured_at` is less of a problem here than on X.

## Typical export path

Company Page → Analytics → Content/Followers/Visitors → Export. Personal creator-mode → post → "View analytics" (screenshot per post; no bulk export). Account-level: profile → "Analytics & tools".

## Changelog

| Date | Change |
|---|---|
| 2026-05-22 | Initial schema (WS6) |
