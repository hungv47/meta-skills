---
name: write-ad
description: "Writes and evaluates Meta paid-ad copy for retargeting (warm) and cold-traffic audiences — audience-temperature-aware framing, hard char-cap enforcement, policy/claim compliance, and 7-dimension rubric scoring. Use to draft primary text, headlines, and descriptions for Facebook/Instagram ads. Meta-only at v1. Not for landing-page headlines (use write-copy), cold-outreach DMs (use write-outreach), organic social posts (use write-social), or channel-mix strategy (use plan-campaign)."
argument-hint: "[audience-temp + offer + creative-format, e.g. 'cold-traffic / 14-day trial / dedicated']"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-2"
---

# Ad Copy — Orchestrator

*Communication — Horizontal. Ready-to-publish Meta ad copy across retargeting (warm) and cold-traffic (cold) audiences. Multi-agent strategy → draft → format → voice → critic → humanize pipeline.*

**Core Question:** "Would this ad still make sense if the platform stripped every claim that isn't substantiated by a named entity or measured number?"

> Why this skill exists, philosophy, methodology, principles, scope boundary, when NOT to use, what it pulls from elsewhere, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

1. **Audience-temp is non-negotiable.** Missing audience-temp BLOCKs without fallback (drives the entire strategist tree — warm objection map vs cold objection map). Offer + creative-format + proof also hard-block via Missing-Input Hard Blocks.
2. **One audience-temp per artifact.** Run twice for campaigns spanning warm + cold; do NOT stack two audience-temps in one artifact.
3. **Hero + 2 distinct variants per artifact.** Strategist enforces 3 distinct `angle_archetype` values + 3 distinct `anchor_proof` entries. Variants must isolate ONE variable each (Variable Subtraction).
4. **Format-checker is a HARD gate, not a critic dim.** Bounces on Meta char-cap violation / banned policy phrase / unsubstantiated measured claim. PASSED / REVISION_REQUIRED (does NOT consume critic cycle) / FORMAT_FAIL (escalate to user).
5. **Humanize runs ONCE per variant with `protected_tokens` including URL.** Post-humanize Specificity regression is **automatic, not judgment** per variant — drops ≥2 or named entity/number/URL absent → revert THAT variant to critic-approved.

## Quality Gate

Before delivering, the **critic agent** verifies (7 dimensions, 0-10 each):

- [ ] **Hook scroll-stop** ≥ 6 — first line of primary text + headline can stop a thumb; pattern-interrupt present; no generic openers ("Looking for a better way?", "Are you tired of...")
- [ ] **Component-char compliance** ≥ 6 — primary text uses the ~125-char visible-before-truncation window effectively; headline lands in ≤40 chars; description in ≤30 chars; hard caps respected (3,000 char primary text, 40 char headline, 30 char description per Meta spec)
- [ ] **CTA-LP match** ≥ 6 — ad promise = LP promise (no bait-and-switch); CTA verb matches LP primary action; if LP description not provided, dim downgrades with "scope: ad copy alone" annotation
- [ ] **Pattern-interruption density** ≥ 6 — hero + 2 variants are genuinely distinct (different angle archetype, different anchor proof OR different audience-objection addressed) and the hero passes the Contrast Ratio sub-check against the vertical's competitor pattern when context exists; surface-level paraphrase of the same angle = FAIL
- [ ] **Policy + claim compliance** ≥ 6 — no banned claim wording (health/finance/political — see `references/policy-floor.md`); every measured claim has a substantiating source or is hedged ("up to", "in our study", "see disclaimer"); no fabricated stats; no protected-class targeting language
- [ ] **Specificity** ≥ 6 — Specificity Floor of ≥2 verifiable specifics per variant (named entity OR named number-with-context OR named research); generic flavor ("leading", "trusted", "proven") does not count
- [ ] **Transmutation fit** ≥ 6 — assigned AI UGC / native static / AI animation / advertorial pre-lander / Chad Funnel format is followed, proof-safe, uses 6 Necessary Beliefs when the format must install demand, and isolates one test variable

**Gate:** Total ≥ 49/70 **AND every dim ≥ 6**. Total 49-55 with all dims ≥ 6 = PASS as `DONE_WITH_CONCERNS`. Any dim < 6 = FAIL regardless of total.

After critic PASS, `humanize` is the terminal pass on each variant. Orchestrator then re-runs critic's **Specificity dimension only** on humanized text — if Specificity drops ≥2 OR any named entity/number present pre-humanize is absent post-humanize, revert to critic-approved draft. Protects the specificity anchor.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load product-context.md + icp-research.md + brand/BRAND.md + campaign-plan.md (if Route B), identify any prior ad-copy artifact for the same audience-temp + offer, check freshness windows on ICP / product-context (>30d → recommend `research-icp` re-run with soft gate).

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | icp-research | Recommended — voice adjectives + accuracy constraints + proof points + Unique Mechanism |
| `research/icp-research.md` | icp-research | Recommended — primary persona + VoC pain language |
| `brand/BRAND.md` | brand-system | Recommended — voice anchors + banned-language list |
| `.forsvn/artifacts/mkt/campaign-plan.md` | campaign-plan | Optional — if ad-copy is part of broader campaign (Route B) |
| `.forsvn/experience/{audience,product,business,brand}.md` | (any skill) | Optional — `Product — current offer` / `Product — proof points` keys if user previously persisted |

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** audience-temp (retargeting / cold), offer (destination + value prop), creative-format (dedicated / repurposed-ugc), conversion-event (trial-start / purchase / lead / install), production-model (in-house / affiliate-creator / external-freelance), available-proof (list of named candidates), transmutation goal (AI UGC / native static / AI animation / advertorial pre-lander / Chad Funnel / strategist choose), competitor-pattern (optional but useful: what top competitors lead with), belief sequence (optional; required for advertorial / Chad Funnel), LP-description (optional but recommended).

Full read-order + Warm/Cold Start prompts (10-question Cold Start + retargeting follow-ups) + Missing-Input Hard Blocks (5 conditions) + write-back map + Pre-Writing Assembly + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — this skill is `budget: deep`; `--fast` flag skips post-humanize Specificity regression check per variant (saves 3 critic-Specificity-dim invocations for hero + A + B). **`--fast` does NOT skip Cold Start, Critical Gates 1-5, Missing-Input Hard Blocks, or Format-Checker Hard Gate** (per marketing-skills CLAUDE.md "Safety gates supersede `--fast`").

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Strategist | 1 (solo) | `agents/strategist.md` | Picks angle archetype, audience-temperature framing (warm-obj-map vs cold-obj-map), CTA verb, creative-format implications, anchor-proof slot per variant. Surfaces spend-ceiling warning if `creative_format=repurposed-ugc`. |
| Composer | 2 (sequential) | `agents/composer.md` | Drafts hero (primary text + headline + description) + Variant A + Variant B, each with a distinct anchor. Applies Meta-specific char-cap discipline (visible-window economy). |
| Format Checker | 2 (sequential, hard-gate) | `agents/format-checker.md` | Hard-bounces on Meta char-cap violation, policy banned-phrase hit, missing substantiation on measured claims. PASS / REVISION_REQUIRED / FORMAT_FAIL. |
| Voice Auditor | 2 (sequential) | `agents/voice-auditor.md` | Peer-voice audit — strips vendor-speak, AI tells, em-dashes, generic "leading provider" language. Same auto-fail discipline as cold-outreach voice-auditor, scoped to ad copy. |
| Critic | 2 (sequential, gate) | `agents/critic.md` | Rubric scoring across 7 dimensions, PASS/FAIL with per-variant scorecards. Reads `references/rubric.md` for bands + `references/policy-floor.md` for banned wording + `references/anti-patterns.md` for structural auto-fails. |

### Shared References

- **Ad-intelligence** (`references/ad-intelligence/`): `meta-retargeting.md`, `meta-cold-traffic.md`, `creative-cadence.md`
- **Rubric + craft:** `references/rubric.md`, `references/policy-floor.md`, `references/anti-patterns.md`, `references/examples.md`, `references/format-spec.md`, `references/message-transmutation.md`
- **Cross-skill research method:** `references/_shared/copywriting-research-workflow.md`

---

## Routing + Dispatch

Two routes — Route A (compose: single audience-temperature), Route B (called by another skill). No reply mode (paid ads don't have an inbound channel).

```
ROUTE A (compose):
  1. Pre-Dispatch (per procedures/pre-dispatch.md)
  2. LAYER 1 — strategist SOLO (3 distinct angle archetypes + 3 distinct anchor proofs)
  3. LAYER 2 — SEQUENTIAL: composer → format-checker → voice-auditor → critic
  4. Critic FAIL → re-dispatch FULL Layer 2 chain with feedback (max 2 cycles)
  4a. Format-checker FORMAT_FAIL (second pass) → escalate to user
  4b. Format-checker REVISION_REQUIRED → re-dispatch composer (does NOT consume critic cycle)
  5. TERMINAL: humanize per variant (3 invocations) with content-type "short-outbound" + audience-temp + protected_tokens (named entities + numbers + URLs)
  6. POST-HUMANIZE REGRESSION: re-run critic's Specificity dim only per variant
  7. Write 3 artifacts ([slug].md + .rationale.md + .critic-score.md)
  8. Deliver hero + 2 variants + rationale inline

ROUTE B (called by campaign-plan):
  1. Pre-Dispatch: read campaign context from calling skill's artifact
  2. Execute Route A per audience-temperature requested (one invocation per temp — not stacked)
  3. Return annotated hero + 2 variants + rationale to calling skill
```

Mechanics (how to spawn agents, single-agent fallback, Layer 1 strategist solo with 7 verification checks, Layer 2 sequential pipeline with Format-Checker Hard Gate semantics, critic gate + rewrite loop, Terminal humanize per-variant + per-variant Specificity regression, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Artifact Contract

- **Paths:** `.forsvn/artifacts/mkt/ad-copy/[audience-temp]-[date]-[slug].md` (final draft), `[audience-temp]-[date]-[slug].rationale.md` (angle + framing + per-variant rationale), `[audience-temp]-[date]-[slug].critic-score.md` (7-dim scorecard per variant + total + regression)
- **Lifecycle:** `pipeline` — overwrite on re-run for same (audience-temp, date, slug-tail); explicit `-v2` suffix when version-history preservation needed; new audience-temp on same day = different prefix = different file
- **Frontmatter fields:** `skill`, `version`, `date`, `status`, `network`, `surface`, `audience_temp`, `creative_format`, `production_model`, `conversion_event`, `critic_total` + nested `critic_per_variant: {hero, variant_a, variant_b}`
- **Consumed by:** human reader (Route A), `plan-campaign` (Route B — reads `critic_total`, `critic_per_variant.hero`, `audience_temp`, `creative_format`, `conversion_event` for budget allocation)
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Field values — audience_temp / creative_format / production_model / conversion_event enums" — never silently drift

Full template + per-field format rules (slug pattern, field-value enums, re-run convention, format-checker / critic / regression violation handling) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Artifact Template

Every `[audience-temp]-[date]-[slug].md` carries:

```yaml
---
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
---
```

Slug pattern: `retargeting-2026-05-11-trial-app-followers` or `cold-2026-05-11-app-install-dedicated`. The audience-temp prefix makes campaign-spanning runs land in distinct files even on the same day.

---

## Anti-Patterns

Orchestrator + cross-cutting + 8 inherited sections: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships. 8 inherited sections (vendor-speak, AI-tells, fabrication, ceiling triggers, etc.) + §9 Orchestrator-Level (13 rows: cold-creative reused as retargeting, frequency creep, lookalikes on cold trial app, repurposed UGC at scale, purchase optimization on 3-day trial, banned health/finance/political claim, fabricated stat, paraphrase variants, em-dashes, generic "Quick question?" hooks, multi-CTA, double-humanize, change-everything-at-once) + §10 Cross-Cutting marketing-stack (4 rows: protected_tokens contract per-variant incl. URL, post-humanize regression per-variant, campaign-plan Route B context drop, artifact schema drift).

---

## Completion Status

Every run ends with explicit status:
- **DONE** — passed critic + format-checker + humanize regression, ready-to-publish
- **DONE_WITH_CONCERNS** — delivered, flags noted (stale ICP, ceiling warning on repurposed-UGC, missing LP description, policy soft-warn override, total 49-55 with all dims ≥6)
- **BLOCKED** — missing offer, missing proof + no product-context, or audience-temp missing; state what's needed
- **NEEDS_CONTEXT** — recommend `research-icp` or provide proof candidates

## Next Step

After receiving the artifact:
1. Submit hero to Meta Ads Manager as the primary creative
2. Submit Variant A + Variant B as A/B test against hero
3. Apply auto-pause rule per `ad-intelligence/creative-cadence.md` §3 (CTR <1.5% after 48h)
4. Re-invoke at creative-fatigue trigger (winner CTR decays >30% from peak) OR offer change OR LP change

---

## Worked Example

End-to-end Route A walkthrough (MealKit cold-traffic subscription app — 14-day trial, trial_start conversion, dedicated creative, in-house production, 3 distinct variants: outcome-first / scale+social-proof / authority+mechanism, format-checker REVISION_REQUIRED on char-cap + health-claim disclaimer, composer revised, critic PASS aggregate 168/210 with per-variant 58/56/54, terminal humanize per variant with `protected_tokens` incl. URL, post-humanize Specificity regression passes per variant) + cycle-2 FAIL variant + Format-Checker REVISION_REQUIRED path + Route B called-by-campaign-plan snippet: [`references/examples/ad-copy-walkthrough.md`](references/examples/ad-copy-walkthrough.md) [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/ad-copy-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch): `references/{rubric, policy-floor, format-spec, examples, message-transmutation}.md`, `references/ad-intelligence/{meta-retargeting, meta-cold-traffic, creative-cadence}.md`
- **Shared:** `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, copywriting-research-workflow}.md`
- **Marketing foundations:** `references/_shared/marketing-foundations.md` — canonical 9-channel framework, funnel-stage vocabulary, 3Q content test, CTA formula, VoC principles
- **Agents:** 5 sub-agents in `agents/` — see Agent Manifest above. `critic.md` holds the canonical 7-dimension rubric; `format-checker.md` holds the hard-gate spec.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
