---
type: platform-evidence-schema
platform: <x | linkedin | tiktok | youtube | instagram>
schema_version: 1
availability_tier: <RICH | MODERATE | CONSTRAINED>
last_verified: <YYYY-MM-DD>
---

# Platform Evidence Schema — <Platform>

Defines what evidence THIS platform produces, at what availability tier, and how the operator gets it. Consumed by `evidence-intake-agent` (to bound what it captures and to write Evidence Gaps) and `benchmark-agent` (to know which metrics need a benchmark). **Not generic platform advice** — only the evidence surface.

---

## Availability tier

**Tier:** <RICH | MODERATE | CONSTRAINED>

<One paragraph: why this tier. What the platform exposes to the account owner, the export friction, how much is publicly visible. RICH = deep owned analytics, low export friction. MODERATE = core owned analytics, some friction or depth limits. CONSTRAINED = app-centric, high export friction, sparse public metrics — honest coarse evidence or NO_EVIDENCE.>

## Core metrics

The metrics MEASURED coverage requires owned-grade evidence on. Typically a reach metric, an engagement metric, and one platform-signature metric.

| Metric | Definition | Where it lives |
|---|---|---|
| <metric> | <one line> | <owned analytics surface> |

## Owned-analytics fields

What the operator's native analytics expose. `source_type: owned_analytics`.

| Field | Definition | Notes / granularity |
|---|---|---|
| <field> | <definition> | <account-wide vs per-post; date-range options> |

## Public-metrics fields

What is visible on a public post / profile page without login. `source_type: public_metrics`.

| Field | Visible? | Notes |
|---|---|---|

## API posture (documented — never called by this skill)

<What the platform API exposes, its access limits, its versioning/friction. The skill never calls it; the operator may run it and paste results in (intaken as owned_analytics / manual_export). State the limits honestly.>

## Known constraints / gotchas

- <Constraint a downstream reader must respect — e.g., a metric the platform redefined, a window limit, a public-vs-owned discrepancy>

## Typical export path

<The concrete steps the operator follows to produce evidence — used by evidence-intake-agent to write a precise "what to export" gap note.>

## Changelog

| Date | Change |
|---|---|
| <YYYY-MM-DD> | Initial schema |
