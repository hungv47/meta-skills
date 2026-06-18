---
title: Ad Copy — Format Conventions
lifecycle: canonical
status: stable
produced_by: ad-copy
load_class: PROCEDURE
---

# Format Conventions

**Load when:** composer / format-checker / voice-auditor / critic compose artifact content OR critic verifies frontmatter / output-structure / field-value compliance. These conventions are enforced by format-checker (char caps + policy + substantiation) + critic (Specificity Floor + variant distinctness) + the orchestrator's 3-file artifact contract.

---

## Date format

Frontmatter `date:` field uses ISO 8601 (`YYYY-MM-DD`) for machine-readable consistency with the rest of the artifact ecosystem. The date also appears in the slug pattern (see Slug Pattern below) so campaign-spanning runs land in distinct files even on the same day.

## Slug pattern

Slug is derived from `[audience-temp]-[date]-[slug-tail]`:

- **Format:** `[audience-temp]-[YYYY-MM-DD]-[slug-tail]`
- **Examples:**
  - `retargeting-2026-05-11-trial-app-followers`
  - `cold-2026-05-11-app-install-dedicated`
  - `retargeting-2026-05-11-trial-app-engagers-v2` (re-run)
- **The audience-temp prefix is mandatory** — makes campaign-spanning runs (one warm + one cold for same offer same day) land in distinct files
- **The slug-tail** typically encodes offer + audience-source or creative-format hint (`trial-app-followers`, `app-install-dedicated`, `lead-form-cold-Q4`)
- **Version suffix on re-run:** `-v2`, `-v3`, etc. (re-runs for same audience-temp + date + slug-tail overwrite by default; explicit `-v2` only when operator wants version-history preserved)

The slug propagates to all 3 artifact files (`[slug].md`, `[slug].rationale.md`, `[slug].critic-score.md`).

## Frontmatter field order (Artifact Template)

Per the Artifact Template block in SKILL.md body. Required fields in this order:

```yaml
skill: write-ad
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
network: meta   # v1 hard-locked to meta; widened in future versions
surface: meta-primary-text | meta-headline | meta-description | meta-full-ad
audience_temp: retargeting | cold
creative_format: dedicated | repurposed-ugc
production_model: in-house | affiliate-creator | external-freelance
conversion_event: trial_start | purchase | lead | install | view-content
critic_total: N/70
critic_per_variant:
  hero: N/70
  variant_a: N/70
  variant_b: N/70
```

11 top-level fields plus nested `critic_per_variant` with 3 sub-fields. For Route B (called by `plan-campaign`), `version` may carry the calling skill's version semantics (e.g., `version: campaign-plan-v2`); orchestrator sets at compile time.

## Output file structure (3 files per run)

Every run produces THREE files in `docs/forsvn/artifacts/marketing/write-ad/`:

| File | Content | Consumer |
|------|---------|----------|
| `[slug].md` | Hero (primary text + headline + description) + Variant A + Variant B, ready-to-publish. Full frontmatter above. | Human (advertiser/marketer), `plan-campaign` (Route B — sequences next audience-temp) |
| `[slug].rationale.md` | Angle, audience-temperature framing, creative format, production model, anchor proof, anti-patterns avoided. Per-variant rationale (3 sections — hero / A / B). Pre-Dispatch dimensions resolved. | Human (advertiser review), maintainer (audit), `plan-campaign` (Route B — reads angle for campaign coherence) |
| `[slug].critic-score.md` | Rubric scorecard across 7 dimensions, per-variant scores (3 scorecards), terminal-humanmaxxing regression check per variant, cycle count. | Maintainer (audit), `plan-campaign` (Route B — picks PASS scores ≥56/70 for highest-priority budget allocation) |

The three-file split already realizes artifact → rationale → scorecard ordering. `[slug].rationale.md` **is** the why-this-works surface per [`_shared/why-this-works-convention.md`](_shared/why-this-works-convention.md): each variant's rationale opens with **the bet** (the wager that variant makes) and ties its angle / framing / anchor-proof to a **product-fit** source — the ICP pain or VoC phrase (`ICP.md`), the positioning (`PRODUCT-CONTEXT.md` / `BRAND.md`), or the campaign plan — never generic ad best-practice (Competitor Swap Test). This is product-fit, distinct from any channel/placement reasoning. No foundation → the convention's Absent state (general principles only; no fabricated pain/proof).

## Field values — network

| Value | Surface |
|---|---|
| `meta` | Facebook + Instagram (FB feed, IG feed, IG Stories, IG Reels). v1 hard-locked to meta. Future versions widen to `google`, `linkedin`, `tiktok`, `reddit`, `youtube`. |

## Field values — surface

| Value | What it is |
|---|---|
| `meta-primary-text` | Primary text only (3,000 char hard cap; ~125 chars visible before truncation) |
| `meta-headline` | Headline only (40 char hard cap) |
| `meta-description` | Description only (30 char hard cap) |
| `meta-full-ad` | Primary text + headline + description as one unit (default for Route A; the typical surface for hero + 2 variants) |

## Field values — audience_temp

| Value | Audience setup |
|---|---|
| `retargeting` | Warm — one of three custom audiences: IG engagers (broadest, lowest intent), IG followers (highest intent, can take direct offers), FB page engagers (moderate intent, post-engagement triggers). Warm-audience-source MUST be specified in pre-writing. |
| `cold` | Cold-traffic — broad targeting (post-Andromeda; lookalikes underperform per `meta-cold-traffic.md` §2). Belief installation required before offer. |

## Field values — creative_format

| Value | Spend ceiling | Production model fit |
|---|---|---|
| `dedicated` | Scaled spend (~$40K+/day per cali-apps source) | in-house / external-freelance |
| `repurposed-ugc` | Capped ~$10-15K/day per `creative-cadence.md` §5 | affiliate-creator (typical) |

Strategist surfaces spend-ceiling warning if `repurposed-ugc` is chosen + target daily-spend > $15K. Rationale carries the warning to artifact.

## Field values — production_model

| Value | What it is |
|---|---|
| `in-house` | Brand's own creative team produces ad assets |
| `affiliate-creator` | Tribe + WhatsApp model from cali-apps — pool of trained external creators on revenue-share |
| `external-freelance` | One-off freelance engagement (no ongoing creator relationship) |

Informational only — drives the rationale's variant-volume sustainability note.

## Field values — conversion_event

| Value | When |
|---|---|
| `trial_start` | Subscription apps — the only signal that lands inside Apple's 24h privacy window per `meta-cold-traffic.md` §3 |
| `purchase` | DTC ecom, one-time purchase products. Soft-warn for subscription-app + short-trial offers (Apple 24h signal window) |
| `lead` | Lead-gen forms (B2B SaaS, services) |
| `install` | App installs (no in-app purchase signal in scope) |
| `view-content` | TOF awareness (no conversion event in scope) |

## Field values — critic_total / critic_per_variant

`critic_total` is the aggregate across hero + A + B summed; `critic_per_variant` shows per-variant scores. Format:

```yaml
critic_total: 168/210   # sum of hero + A + B (max 70 × 3 = 210)
critic_per_variant:
  hero: 58/70
  variant_a: 56/70
  variant_b: 54/70
```

PASS threshold per variant: ≥49/70 AND every dim ≥6. PASS aggregate: sum ≥147/210 (3 × 49) AND every per-variant ≥49/70 AND every per-variant per-dim ≥6. Total 49-55 per variant with all dims ≥6 = DWC; any dim <6 in any variant = FAIL regardless of total.

## Re-run convention

On re-run for the SAME (audience-temp, date, slug-tail) tuple: overwrite the existing 3 files by default. For explicit version-history preservation (e.g., comparing offer changes), append `-v2` / `-v3` suffix to slug-tail.

For NEW audience-temp (warm + cold for same offer same day): write fresh `[slug].md` with the OTHER audience-temp prefix — they share the date and similar slug-tail but the prefix prevents collision (`retargeting-2026-05-11-trial-app` + `cold-2026-05-11-trial-app`).

## When critic / format-checker catches a violation

**Format-checker REVISION_REQUIRED** (any of Meta char-cap violation / policy banned phrase / unsubstantiated measured claim) → re-dispatch composer with violation list. Does NOT consume a critic rewrite cycle. Format-checker is a hard gate, not a critic dim.

**Format-checker FORMAT_FAIL** (second pass still violating) → escalate to user with violations enumerated. Do NOT ship as DWC; the user must reconcile (typically by relaxing the claim or finding substantiating proof).

**Critic FAIL on dim <6 in any variant** → re-dispatch FULL Layer 2 chain (composer → format-checker → voice-auditor → critic) with feedback. Max 2 cycles. Cycle 2 FAIL → surface scorecard + best draft + per-variant blocking issues as DWC.

**Post-humanmaxxing Specificity regression FAIL per variant** → flag THAT variant's delta + the removed specific for operator review, with the critic-approved version preserved alongside (do NOT cascade-flag all 3; do NOT try to re-fix humanmaxxing). Frontmatter `critic_per_variant.X` reflects the critic-approved score until the operator picks (the humanmaxxing change on Specificity was negative; the operator decides which version ships).
