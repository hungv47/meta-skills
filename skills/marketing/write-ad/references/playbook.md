---
title: Ad Copy Playbook
lifecycle: canonical
status: stable
produced_by: ad-copy
load_class: PLAYBOOK
---

# Ad Copy Playbook

## Why this skill exists

Most paid-ad copy fails for one reason: it doesn't earn the impression. Meta's algorithm ranks creative as the primary targeting lever after Andromeda; warm audiences scroll past ads that don't address their objection set; cold audiences scroll past ads that don't install enough belief before the offer. The skill exists to produce hero + 2 distinct variants that pass Meta's policy review, hit the 7-dimension critic rubric, preserve named-entity + named-number specificity through humanmaxxing's terminal pass, and ship ready-to-publish.

The orchestrator separates strategy from craft: strategist picks angle + audience-temperature framing + creative format (dedicated vs repurposed-UGC with spend-ceiling warning), composer drafts hero + 2 variants applying Meta-specific char caps, format-checker enforces hard caps + policy compliance, voice-auditor strips vendor-speak + AI tells, critic scores 7-dimension rubric per variant, `humanmaxxing` is the terminal pass per variant with `protected_tokens` (named entities + numbers + URLs).

## Philosophy

Ad copy is not landing-page copy. It runs in 3 seconds of scrolling attention, against an algorithm that ranks creative as the primary targeting lever. Every variant has to earn its impression — warm audiences want fit/credibility/timing, cold audiences want awareness/positioning, and Meta's policy review will auto-reject claims it can't substantiate.

Construction starts before drafting. Strategist maps each variant to Meta's 4-step filtering process (Retrieval → Light Ranking → Heavy Ranking → Auction), composer applies the Contrast Principle against the vertical's dominant hook pattern, and cold-traffic / advertorial variants borrow copywriting's 6 Necessary Beliefs so the ad or pre-lander installs the beliefs needed before the offer appears.

**Variant distinctness is load-bearing for the A/B test signal.** Hero + 2 variants must differ in angle archetype, anchor proof, AND audience-objection addressed. Paraphrases collapse the test signal — strategist enforces 3 distinct `angle_archetype` values; composer enforces 3 distinct `anchor_proof` entries; critic Pattern-Interruption dim auto-fails when variants are paraphrases.

**Specificity Floor of ≥2 verifiable specifics per variant.** Named entity (customer, app, tool) OR named number-with-context ("12,000 users in 90 days") OR named research. Pure generic flavor ("leading", "trusted", "proven") does not count. Critic Specificity dim auto-fails below floor; humanmaxxing regression re-verifies post-polish.

## Methodology

**5-agent orchestration, Layer 1 solo + Layer 2 sequential with format-checker hard gate.** Layer 1: strategist solo (Layer 1 is NOT parallel here because the audience-temperature decision is user-supplied, not derived from a signal score). Layer 2: composer → format-checker → voice-auditor → critic run sequentially with the format-checker acting as a hard gate (not a critic dim) between composer and voice-auditor.

**Format-checker is a separate hard gate from critic.** Bounces on Meta char-cap violation (40 char headline / 30 char description / 3,000 char primary text), banned policy phrase, or measured claim without substantiating source. Returns `PASSED` / `REVISION_REQUIRED` (re-dispatch composer; does NOT consume a critic cycle) / `FORMAT_FAIL` (second pass still violating → escalate to user). This gate exists because Meta's policy review auto-rejects ads with banned wording or unsubstantiated claims — failing format-check before critic saves critic cycles for content-quality work.

**Terminal humanmaxxing per variant (3 invocations per artifact).** After critic PASS, humanmaxxing runs on each variant (hero / A / B) independently with `content-type: "short-outbound"` + audience-temp + `protected_tokens` (named entities + numbers + URLs from critic-approved variant). Post-humanmaxxing, re-run critic's Specificity dim ONLY per variant — drops ≥2 OR any named entity/number/URL absent → flag THAT variant's delta + the removed specific for operator review (critic-approved version kept alongside; operator picks). **Per-variant flag, not cascade.**

**Two-cycle rewrite cap on critic.** Critic FAIL → re-dispatch FULL Layer 2 chain (composer → format-checker → voice-auditor → critic) with feedback (max 2 cycles). Never feed critic a raw composer draft without format-checker + voice-auditor between. Cycle 2 FAIL → surface scorecard + best draft + per-variant blocking issues.

## Principles

- **Audience-temp is the orchestrator's first non-negotiable input.** Drives the entire strategist tree — warm objection map vs cold objection map; different creative posture; different CTA tier. Missing audience-temp BLOCKs without fallback (drives the whole tree; can't be inferred).
- **One audience-temp per artifact.** Run twice for campaigns spanning warm + cold; do NOT stack two audience-temps in one artifact. The 7-dim rubric scores differently for warm vs cold (Hook dim weights "addresses warm objection set" for retargeting; "installs awareness/positioning" for cold).
- **Hero + 2 distinct variants per artifact.** Variant-volume discipline collapses if hero + variants are paraphrases. Strategist enforces 3 distinct `angle_archetype` values + 3 distinct `anchor_proof` entries; critic Pattern-Interruption dim verifies.
- **Variable Subtraction per variant.** Each variant isolates ONE variable (hook archetype, anchor proof, audience-objection, CTA verb, transmutation format) to make the A/B test signal interpretable. Changing every variable at once produces no learning.
- **Format-checker is a HARD gate, not a critic dim.** Char caps + policy banned phrases + claim substantiation are non-negotiable structural requirements. FORMAT_FAIL on second pass escalates to user, doesn't ship as DWC.
- **Specificity Floor of ≥2 per variant** (named entity OR named number OR named research). Generic flavor doesn't count. Critic Specificity dim auto-fail below floor.
- **Humanmaxxing runs ONCE per variant** (3 total invocations per artifact). Running humanmaxxing twice strips specificity. Post-humanmaxxing Specificity regression is automatic per variant.
- **The artifact IS the contract.** 11-field frontmatter (with nested `critic_per_variant: {hero, variant_a, variant_b}`) + 3 body files (`[slug].md`, `[slug].rationale.md`, `[slug].critic-score.md`) per `format-conventions.md`. Schema changes require atomic update.

## Scope Boundary

**In scope:**
- Meta paid-ad copy (Facebook + Instagram): primary text, headline, description
- Audience-temperatures: retargeting (warm — IG engagers / IG followers / FB page engagers) and cold-traffic (broad targeting, post-Andromeda)
- Hero + 2 variants per invocation, single audience-temperature per artifact
- Creative formats: dedicated ad creative (carries scaled spend) and repurposed-UGC (capped at lower spend ceiling — surfaced with warning)
- Subscription-app cold-traffic playbook (trial-start optimization, in-creative retargeting)
- Cross-vertical applicability for cold-traffic structural choices (DTC ecom, B2B SaaS) per the matrix in `references/ad-intelligence/meta-cold-traffic.md`

**Out of scope:**
- Google RSA (15 headlines + 4 descriptions per ad — different mechanics; refs not pre-staged)
- LinkedIn ads, TikTok ads, Reddit ads, YouTube pre-roll (refs not pre-staged)
- Audience setup / pixel setup / budget pacing (your Meta Ads Manager workflow)
- Landing page copy (use `write-copy` or `brief-landing-page`)
- Outbound DMs or cold emails (use `write-outreach`)
- Creative production (asset generation, video editing, voiceover) — this skill produces the copy spec only
- Multi-campaign sequence orchestration (compose one audience-temperature at a time)

## When NOT to use this skill

- **Need landing page headline / section copy / tagline.** Use `write-copy` — different surface mechanics. LPs have scroll; ads don't.
- **Need outbound DM or cold email.** Use `write-outreach` — different trust model, different framework set.
- **Need redesign of the LP this ad clicks to.** Use `brief-landing-page` first; ad-copy then consumes its output (LP-description input).
- **Need multi-channel campaign across paid/owned/earned.** Use `plan-campaign` first to lock channel mix + sequencing, then ad-copy per audience-temperature via Route B.
- **No ICP or ICP stale (>30 days).** Use `research-icp` first (research-skills) — ad-copy without a persona produces generic ads Meta ranks low.
- **Google RSA / LinkedIn / TikTok Ads / Reddit / YouTube pre-roll.** NOT this skill v1. Refs not pre-staged; running would force fabrication. Future versions widen to other platforms.

## What This Skill Pulls From Elsewhere

- **George Clem — Paid House** (X thread, agency at $200k+/mo, overseeing ~$500k/mo client adspend): 3-audience retargeting structure, warm-vs-cold objection map, frequency-creep diagnosis. → `references/ad-intelligence/meta-retargeting.md`. Confidence: secondary source (single practitioner; calibrate before adoption).
- **Cali — subscription-app operator** (operator's idea vault, $40K/day spend at scale): 2-campaign structure, trial-start optimization, custom-product-page attribution, in-creative retargeting shortcut, affiliate-creator production model, dedicated-vs-repurposed creative ceiling. → `references/ad-intelligence/meta-cold-traffic.md`, `references/ad-intelligence/creative-cadence.md`. Confidence: secondary source.
- **Simplr Intelligence comment** + **paid-ads-thresholds** (uncited operator vault): volume cadence (50+/month), kill speed (1.5% CTR / 48h auto-pause), 80/20 budget split, 2-3% winner rate. → `references/ad-intelligence/creative-cadence.md`. Confidence: low (uncited operator-vault sources; numbers MUST be calibrated against operator's own account before adoption per §8 calibration note).

## History / origin

- **v1.0.0 — initial release.** 5-agent orchestration (strategist solo → composer → format-checker → voice-auditor → critic sequential). 7-dimension critic rubric (Hook scroll-stop, Component-char compliance, CTA-LP match, Pattern-interruption density, Policy + claim compliance, Specificity, Transmutation fit). Meta-only at v1 (FB + IG). 2 audience-temperatures (retargeting + cold). 2 creative-formats (dedicated + repurposed-UGC) with spend-ceiling warning on repurposed-UGC. 5 conversion-events (trial_start, purchase, lead, install, view-content). 3 production-models (in-house, affiliate-creator, external-freelance). Hero + 2 variants per artifact, single audience-temp per artifact. Routes A (compose) + B (called by campaign-plan). Terminal humanmaxxing per variant with `protected_tokens` including URL.
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v1.0.0):** body trimmed 516 → ≤230 lines (at creative target). 5 new refs: playbook + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics + examples/write-ad-walkthrough. anti-patterns.md (existing 341 lines) EXTENDED with §9 Orchestrator-Level (13 rows from body) + §10 Cross-Cutting Marketing-Stack (4 rows: protected_tokens contract per-variant including URL, post-humanmaxxing regression per-variant, campaign-plan Route B context drop, artifact schema drift). Existing `agents/{strategist, composer, format-checker, voice-auditor, critic}.md` + `references/{rubric, policy-floor, format-spec, examples, message-transmutation}.md` + `references/ad-intelligence/{meta-retargeting, meta-cold-traffic, creative-cadence}.md` UNCHANGED (these ARE the skill's domain data and behavior). Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. **Cross-stack contract preserved BYTE-IDENTICAL** (per vn-tone + humanmaxxing + cold-outreach + copywriting slot learnings: no clarifying parentheticals, no nested-heading promotions, no rubric-explanation paragraphs added during refactor): 7-bullet Quality Gate, 5-agent Manifest, 11-field frontmatter, Routes A 8-step + B 3-step, Format-Checker Hard Gate (PASSED/REVISION_REQUIRED/FORMAT_FAIL), Terminal Humanmaxxing per-variant with `protected_tokens` incl. URL, post-humanmaxxing Specificity regression "automatic, not judgment", 13 orchestrator anti-pattern rows, 4-tier Completion Status verdicts. No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Warm/Cold Start prompts (10-question Cold Start + retargeting follow-ups), Missing-Input Hard Blocks (5 conditions), write-back map, Pre-Writing Assembly, `--fast` behavior
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — Routes A/B, Layer 1 strategist solo (with 7 verification checks), Layer 2 sequential (4 agents), Format-Checker Hard Gate (PASSED/REVISION_REQUIRED/FORMAT_FAIL), critic gate + rewrite loop, Terminal humanmaxxing per-variant + per-variant Specificity regression, chain position, skill deference
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — 8 inherited sections (vendor-speak, AI-tells, fabrication, ceiling triggers, etc.) + §9 Orchestrator-Level (13 rows) + §10 Cross-Cutting marketing-stack (4 rows: protected_tokens per-variant incl. URL, post-humanmaxxing regression per-variant, campaign-plan Route B context drop, artifact schema drift)
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — Artifact Template (11-field frontmatter with nested `critic_per_variant: {hero, variant_a, variant_b}`), 3-file output structure, slug pattern, field-value enums (audience_temp / creative_format / production_model / conversion_event / network / surface), re-run convention
- [`examples/write-ad-walkthrough.md`](examples/write-ad-walkthrough.md) [EXAMPLE] — end-to-end Route A walkthrough (cold-traffic subscription app, trial-start, dedicated creative, hero + 2 distinct variants, format-checker PASSED, critic PASS at 56/70 with per-variant scores, terminal humanmaxxing per variant with `protected_tokens` incl. URL, post-humanmaxxing regression passes) + cycle-2 FAIL variant + format-checker REVISION_REQUIRED path + Route B called-by-campaign-plan snippet
- [`rubric.md`](rubric.md) — 7-dimension scoring bands (0-2 / 3-5 / 6-8 / 9-10) + per-dim auto-fail conditions (critic.md primary reference)
- [`policy-floor.md`](policy-floor.md) — Meta policy banned-claim wording (health, finance, political, protected class) + substantiation hedging patterns (format-checker primary reference)
- [`format-spec.md`](format-spec.md) — Meta char caps + visible-window economics (composer + format-checker primary reference)
- [`message-transmutation.md`](message-transmutation.md) — AI UGC/VSSL, native static, AI animation, advertorial pre-lander, Chad Funnel, Variable Subtraction (strategist + composer reference)
- [`examples.md`](examples.md) — 4 worked examples (strong-retargeting / weak-retargeting / strong-cold / weak-cold) with critic scorecards (operator reference; distinct from examples/write-ad-walkthrough.md which is the canonical end-to-end Route A trace)
- [`ad-intelligence/`](ad-intelligence/) — per-surface practitioner sources (meta-retargeting, meta-cold-traffic, creative-cadence)
- [`_shared/copywriting-research-workflow.md`](_shared/copywriting-research-workflow.md) — 4-phase argument research SOP (Pre-Dispatch step 1)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec the procedure inherits from
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: deep`; `--fast` skips post-humanmaxxing Specificity regression per variant, but Critical Gates + Missing-Input Hard Blocks + Format-Checker Hard Gate STILL enforced and Cold Start STILL fires when context missing)
