---
title: Campaign Demo Loop — Learnings
lifecycle: learning
status: stable
loop: campaign-demo
---

# Campaign Demo — Learnings

> Durable lessons promoted from individual cycle artifacts. Promotion requires high-confidence (`confidence: high` in cycle verdict) AND status = `keep` or `discard` AND lesson reusable beyond this exact campaign AND campaign-type/channel-mix-scoped.

## 2026-05-20 — A warm-list email send is a campaign rider, not a driver — exclude its conversions from campaign-driven net-new

- **Cycle:** campaign-demo cycle 1
- **Campaign:** spring-launch (4-channel subscription-app launch)
- **Evidence:** the email channel posted 70 conversions at an apparent $8.57 CAC — the cheapest channel in the breakdown. But those 70 were existing trial-list users already inside the trial→paid funnel before the campaign launched; last-click attribution handed email the final-touch credit. Classified a `rider` and excluded from campaign-driven net-new. Excluding it: 164 campaign-driven net-new (not 234), honest blended CAC $51.83 (not the laundered $36.32). The three genuine `driver` channels — paid-social, organic-linkedin, content-seo — carried the real lift.
- **Expiry / caveat:** scoped to launch campaigns that include a warm-list email channel for the subscription-app ICP. The rider classification is structural and does not depend on the exact numbers; the magnitude of the distortion (+43% net-new, −30% CAC) is a single synthetic cycle and needs a cycle 3 replication. Retest if the email channel is re-pointed at a cold list (a cold-list send could be a genuine driver) or if the attribution model moves off last-click.

> **Provisional learning** — D20 infrastructure proof. The synthetic cycle 1 was calibrated to exercise the rubric's keep-promotion gate and the Channel-Mix Discrimination + Unit-Economics Discipline dims, NOT to establish a real campaign best-practice. Cycle verdict confidence was `medium` (single synthetic cycle); the lesson is promoted as provisional to demonstrate the promotion mechanism end-to-end and must be re-confirmed on a real loop. Replace this file's contents when migrating to a real campaign loop.
