---
type: platform-evidence-schema
platform: youtube
schema_version: 1
availability_tier: RICH
last_verified: 2026-05-22
---

# Platform Evidence Schema — YouTube

Defines what evidence YouTube produces for a channel owner, at what tier, and how to get it. Covers both long-form and Shorts. Consumed by `evidence-intake-agent` and `benchmark-agent`.

---

## Availability tier

**Tier:** RICH

YouTube Studio (and the underlying YouTube Analytics) is the richest owned-analytics surface of the five platforms. A channel owner sees views, watch time, average view duration, an audience-retention curve, traffic sources, impressions and click-through rate, subscriber change, and demographic breakdowns — per video and per channel, with date ranges and CSV export. Shorts get a parallel but slightly thinner set (retention exists; CTR/impressions work differently). Public video pages show view, like, and comment counts. Export friction is low. YouTube is the platform where a `MEASURED` flag is most readily earned — and where claiming less than the available depth is the more common error.

## Core metrics

| Metric | Definition | Where it lives |
|---|---|---|
| views | Counted views of the video | Studio + public page |
| avg_view_duration | Mean watch time per view (absolute + % of length) | Studio — YouTube-signature metric |
| ctr | Impressions click-through rate (thumbnail/title) | Studio; long-form (Shorts differ) |

## Owned-analytics fields

`source_type: owned_analytics` — from YouTube Studio / YouTube Analytics.

| Field | Definition | Notes / granularity |
|---|---|---|
| views | Counted views | Per-video + channel; date-range; CSV export |
| watch_time | Total hours watched | Per-video + channel |
| avg_view_duration | Mean watch per view (sec + %) | Per-video; the core retention metric |
| audience_retention | Watch-through curve over the video | Per-video; includes relative/absolute curves |
| impressions / ctr | Thumbnail serves and click-through rate | Per-video; long-form (Shorts use a different surface) |
| traffic_sources | Browse / Search / Suggested / External / Shorts feed split | Per-video + channel |
| subscribers_gained / lost | Subscriber change attributed to a video / period | Per-video + channel |
| demographics | Viewer age / gender / geography | Channel + per-video; aggregate |

## Public-metrics fields

`source_type: public_metrics`.

| Field | Visible? | Notes |
|---|---|---|
| view count | Yes | Public on every video |
| like count | Yes | Public; dislikes are not |
| comment count | Yes | Public |
| watch time, AVD, retention, CTR, traffic | No | Owner-only |

## API posture (documented — never called by this skill)

The YouTube Analytics API and YouTube Data API expose channel and video metrics for an authorized channel owner — this is the most complete owned-analytics API of the five platforms. Access still requires an OAuth-authorized app. The skill never calls it. An operator-run pull pasted in is intaken as `owned_analytics` / `manual_export`. For most operators a Studio CSV export is simpler than the API and yields the same evidence.

## Known constraints / gotchas

- `avg_view_duration` matters more than raw `views` — YouTube ranks on watch time and AVD; an evidence read that cites views without AVD is reading half the signal.
- Shorts and long-form are different surfaces — CTR and impressions behave differently for Shorts; record which the evidence covers in `scope_note`.
- Retention curves are exportable from Studio (unlike TikTok) — if the operator has a channel, the curve is real owned data, not screenshot-grade.
- A video's metrics keep accumulating for weeks — a `measured_at` window matters; a 7-day vs. 28-day vs. lifetime figure are not comparable.

## Typical export path

YouTube Studio → Analytics → Overview / Content / Audience → set the date range → "Export current view" (CSV). Per-video: open the video in Studio → Analytics → Reach / Engagement / Audience tabs (retention curve under Engagement).

## Changelog

| Date | Change |
|---|---|
| 2026-05-22 | Initial schema (WS6) |
