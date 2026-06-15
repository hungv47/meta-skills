---
name: write-ad
description: "Writes and evaluates Meta paid-ad copy (retargeting + cold-traffic) — audience-temperature-aware framing, hard char-cap enforcement, policy compliance, 7-dim rubric. Meta-only at v1. Not for landing-page headlines (use write-copy), cold-outreach DMs (use write-outreach), organic social posts (use write-social), or channel-mix strategy (use plan-campaign)."
argument-hint: "[audience-temp + offer + creative-format, e.g. 'cold-traffic / 14-day trial / dedicated']"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.1.0"
  budget: deep
  estimated-cost: "$1-2"
---

# Write Ad — Orchestrator

Ready-to-publish Meta ad copy across retargeting (warm) and cold-traffic audiences. Multi-agent strategy → draft → format → voice → critic → humanmaxxing pipeline. Capability metadata lives in [`routing.yaml`](routing.yaml). Agent table + 2 routes + 7-dim rubric + post-humanmaxxing regression rule: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Would this ad still make sense if the platform stripped every claim that isn't substantiated by a named entity or measured number?

## Critical Gates — load first

1. **Audience-temp is non-negotiable.** Missing audience-temp BLOCKs (drives entire strategist tree — warm objection map vs cold objection map). Offer + creative-format + proof also hard-block via Missing-Input Hard Blocks.
2. **One audience-temp per artifact.** Run twice for campaigns spanning warm + cold; do NOT stack two audience-temps in one artifact.
3. **Hero + 2 distinct variants per artifact is the default.** Strategist enforces 3 distinct `angle_archetype` values + 3 distinct `anchor_proof` entries. Variants isolate ONE variable each (Variable Subtraction). The count serves Meta A/B structure; an operator may override it — log the override + reason in the rationale. Mode + tier in [`references/_shared/options-selection.md`](references/_shared/options-selection.md) (DELIVERY, tier B).
4. **Format-checker is a HARD gate, not a critic dim.** Bounces on Meta char-cap violation / banned policy phrase / unsubstantiated measured claim. PASSED / REVISION_REQUIRED (does NOT consume critic cycle) / FORMAT_FAIL (escalate to user).
5. **Humanmaxxing runs ONCE per variant with `protected_tokens` including URL.** Post-humanmaxxing Specificity regression check per variant — drops ≥2 OR named entity/number/URL absent → flag the delta + the removed specific for operator review (critic-approved draft preserved alongside; operator picks).

## Quality Gate — 7 dimensions

Full rubric + Pass/Fail + per-dim scoring bands: [`references/agent-manifest.md`](references/agent-manifest.md) § 7-Dim Critic Rubric. Domain rubric: [`references/rubric.md`](references/rubric.md).

- **Gate:** Total ≥49/70 AND every dim ≥6. Total 49-55 with all dims ≥6 = PASS as `DONE_WITH_CONCERNS`. Any dim <6 = FAIL.
- **Terminal humanmaxxing** runs per variant after critic PASS. Orchestrator re-runs critic's **Specificity dim only** on humanmaxxed text — Specificity drops ≥2 OR named entity/number absent → flag the delta + removed specific for operator review (both versions kept). Protects the specificity anchor.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Recommended context:

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Recommended — voice adjectives + proof points + Unique Mechanism |
| `research/icp-research.md` | research-icp | Recommended — primary persona + VoC pain language |
| `brand/BRAND.md` | create-brand | Recommended — voice anchors + banned-language list |
| `brand/CREATIVE-DIRECTION.md` | create-brand | Recommended (visual creative) — house art direction for the ad's visual concept; design against it + a realized exemplar, not tokens alone (`references/_shared/realized-surface-grounding.md`) |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Optional — Route B from broader campaign + `## Creative Direction` (per-campaign art direction) |
| `docs/forsvn/experience/{audience,product,business,brand}.md` | (any skill) | Optional — persisted `Product — current offer` / `Product — proof points` keys |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). Needed dimensions: audience-temp (retargeting / cold) · offer (destination + value prop) · creative-format (dedicated / repurposed-ugc) · conversion-event (trial-start / purchase / lead / install) · production-model (in-house / affiliate-creator / external-freelance) · available-proof (list of named candidates) · transmutation goal (AI UGC / native static / AI animation / advertorial pre-lander / Chad Funnel / strategist choose) · competitor-pattern (optional) · belief sequence (optional; required for advertorial / Chad Funnel) · LP-description (optional but recommended).

Warm/Cold Start prompts (10-question Cold Start + retargeting follow-ups) + Missing-Input Hard Blocks (5 conditions): [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `budget: deep`. `--fast` skips post-humanmaxxing Specificity regression check per variant (saves 3 critic-Specificity-dim invocations for hero + A + B). **`--fast` does NOT skip Cold Start, Critical Gates 1-5, Missing-Input Hard Blocks, or Format-Checker Hard Gate.**
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Routes

Two routes — A (compose: single audience-temperature), B (called by another skill). **No reply mode** (paid ads don't have an inbound channel). Full dispatch graphs: [`references/agent-manifest.md`](references/agent-manifest.md).

## Artifact Contract

- **Paths:** `docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md` (final draft) · `[audience-temp]-[date]-[slug].rationale.md` (angle + framing + per-variant rationale) · `[audience-temp]-[date]-[slug].critic-score.md` (7-dim scorecard per variant + total + regression).
- **Lifecycle:** `pipeline` — overwrite on re-run for same `(audience-temp, date, slug-tail)`; explicit `-v2` suffix when version-history preservation needed; new audience-temp on same day = different prefix = different file.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `network`, `surface`, `audience_temp`, `creative_format`, `production_model`, `conversion_event`, `critic_total` + nested `critic_per_variant: {hero, variant_a, variant_b}`.
- **Slug pattern:** `retargeting-2026-05-11-trial-app-followers` or `cold-2026-05-11-app-install-dedicated`. Audience-temp prefix makes campaign-spanning runs land in distinct files even on the same day.
- **Consumed by:** human reader (Route A); `plan-campaign` (Route B — reads `critic_total`, `critic_per_variant.hero`, `audience_temp`, `creative_format`, `conversion_event` for budget allocation).
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Field values" enums — never silently drift.

Full template + per-field format rules: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships. 8 inherited sections + §9 Orchestrator-Level (13 rows: cold-creative reused as retargeting, frequency creep, lookalikes on cold trial app, repurposed UGC at scale, purchase optimization on 3-day trial, banned health/finance/political claim, fabricated stat, paraphrase variants, em-dashes, generic "Quick question?" hooks, multi-CTA, double-humanmaxxing, change-everything-at-once) + §10 Cross-Cutting marketing-stack (4 rows: protected_tokens contract per-variant incl. URL, post-humanmaxxing regression per-variant, plan-campaign Route B context drop, artifact schema drift).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — passed critic + format-checker + humanmaxxing regression, ready-to-publish.
- **DONE_WITH_CONCERNS** — delivered, flags noted (stale ICP, ceiling warning on repurposed-UGC, missing LP description, policy soft-warn override, total 49-55 with all dims ≥6).
- **BLOCKED** — missing offer, missing proof + no product-context, or audience-temp missing.
- **NEEDS_CONTEXT** — recommend `research-icp` or provide proof candidates.

## Execution

Offer the registry-gated fork (category `publish` + `image`). **Brief-only** (today's handoff):

1. Submit hero to Meta Ads Manager as primary creative.
2. Submit Variant A + Variant B as A/B test against hero.
3. Apply auto-pause rule per `ad-intelligence/creative-cadence.md` § 3 (CTR <1.5% after 48h).
4. Re-invoke at creative-fatigue trigger (winner CTR decays >30% from peak) OR offer change OR LP change.

**Assisted/Direct**: a verified engine submits/renders, you approve at the gate. See [execution-fork.md](references/_shared/execution-fork.md); record `execution_mode`.

## Worked Example

End-to-end Route A (MealKit cold-traffic 14-day-trial app, 3 distinct variants: outcome-first / scale+social-proof / authority+mechanism, format-checker REVISION_REQUIRED on char-cap + health-claim disclaimer, composer revised, critic PASS aggregate 168/210, terminal humanmaxxing per variant with `protected_tokens` incl. URL, post-humanmaxxing Specificity regression passes per variant) + cycle-2 FAIL variant + Format-Checker REVISION_REQUIRED path + Route B snippet: [`references/examples/write-ad-walkthrough.md`](references/examples/write-ad-walkthrough.md).
