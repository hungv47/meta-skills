---
type: platform-evidence-schema
platform: tiktok
schema_version: 1
availability_tier: CONSTRAINED
last_verified: 2026-05-22
---

# Platform Evidence Schema — TikTok

Defines what evidence TikTok produces for an account owner, at what tier, and how to get it. Consumed by `evidence-intake-agent` and `benchmark-agent`.

---

## Availability tier

**Tier:** CONSTRAINED

TikTok's owned analytics are real but app-centric and export-hostile. A Business or Creator account sees per-video and account analytics — views, watch time, average watch time, traffic source, retention — inside the mobile app or the Creator/Business web suite, but bulk export is limited and much of it is screenshot-grade. Public video pages show view, like, comment, and share counts; saves are sometimes visible. Retention curves and traffic-source splits are owner-only and often only viewable, not exportable. Treat TikTok evidence as honest and coarse — capture what the operator can screenshot, and flag the rest as gaps. Do not invent per-second retention precision the operator cannot supply.

## Core metrics

| Metric | Definition | Where it lives |
|---|---|---|
| video_views | Times the video was watched (TikTok counts a view at play start) | App analytics + public page |
| engagement_rate | (likes + comments + shares + saves) ÷ views | Computed from app analytics / public counts |
| avg_watch_time | Average seconds watched — TikTok-signature retention metric | App / Creator suite analytics, owner-only |

## Owned-analytics fields

`source_type: owned_analytics` — from the app or Creator/Business suite.

| Field | Definition | Notes / granularity |
|---|---|---|
| video_views | Play-start count | Per-video + account; in-app |
| avg_watch_time | Mean seconds watched | Per-video; owner-only; screenshot-grade |
| watched_full_video | % who reached the end | Per-video; owner-only |
| retention_curve | Watch-through over the video's duration | Per-video; viewable, rarely exportable |
| traffic_source | For You / Following / Search / Profile / Sound split | Per-video; owner-only |
| total_play_time | Aggregate watch time | Per-video / account |
| new_followers | Follows attributed to a period | Account; weak per-video attribution |

## Public-metrics fields

`source_type: public_metrics`.

| Field | Visible? | Notes |
|---|---|---|
| view count | Yes | Public on every video |
| like / comment / share counts | Yes | Public |
| save count | Sometimes | UI-dependent; capture only if actually shown |
| watch time, retention, traffic source | No | Owner-only |

## API posture (documented — never called by this skill)

TikTok exposes a Business API and a Research API, but access is gated, approval-heavy, and the data scope is narrow for most accounts. There is no general-purpose owned-analytics export API for an ordinary Creator account. The skill never calls any of it. An operator-run pull pasted in is intaken as `owned_analytics` / `manual_export`.

## Known constraints / gotchas

- A TikTok "view" counts at play start, not at a watch threshold — a high view count with low `avg_watch_time` is a known, meaningful pattern; do not treat views alone as success.
- Retention curves are typically *viewable but not exportable* — expect screenshot-grade evidence; transcribe the shape ("steep drop at 0–3s") rather than inventing per-second numbers.
- Public save counts are inconsistently shown — only capture a save figure if it was actually visible.
- Sound-driven distribution means a video's performance can spike on a trending sound — note the sound in `scope_note` if known.

## Typical export path

TikTok app → Profile → Creator tools / Business suite → Analytics → Overview / Content → screenshot per-video and account panels. The Creator suite web view (if the account has it) allows some date-range views; bulk CSV export is limited.

## Changelog

| Date | Change |
|---|---|
| 2026-05-22 | Initial schema (WS6) |
