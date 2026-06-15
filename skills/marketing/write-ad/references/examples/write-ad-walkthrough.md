---
title: Ad Copy — End-to-End Walkthrough (Route A, cold-traffic subscription app)
lifecycle: canonical
status: stable
produced_by: ad-copy
load_class: EXAMPLE
---

# Ad Copy — End-to-End Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of how a Route A (compose) artifact gets produced — Pre-Dispatch → Layer 1 strategist solo → Layer 2 sequential (composer → format-checker → voice-auditor → critic) → terminal humanmaxxing per variant + per-variant Specificity regression → deliver 3-file artifact.

This walkthrough covers Route A for cold-traffic subscription app with trial-start conversion. The Format-Checker REVISION_REQUIRED path + critic cycle-2 FAIL variant + Route B (called by campaign-plan) snippet are at the end. For the four short canonical examples (strong-retargeting / weak-retargeting / strong-cold / weak-cold with critic scorecards) see `references/examples.md` — this walkthrough is the operator's complete end-to-end trace.

---

## Scenario

- **Input:** Meta cold-traffic ad for **MealKit** — a meal-prep subscription app with 14-day free trial.
- **Audience-temp:** `cold` (broad targeting, post-Andromeda)
- **Offer:** 14-day free trial, then $14.99/month. CTA destination: `mealkit.app/trial?utm=meta_q4`
- **Creative-format:** `dedicated` (carries scaled spend; in-house production)
- **Conversion-event:** `trial_start` (correct choice for subscription apps; lands inside Apple 24h signal window)
- **Production-model:** `in-house`
- **Available proof:** 12,000 active trial-starts in 90 days; named customer "Sarah K." with verbatim "I dropped 8 lbs in 4 weeks without thinking about meals"; 4.7-star App Store rating with 2,300 reviews; nutritionist Dr. Lin co-formulated the meal database.
- **Transmutation goal:** strategist choose (no preference)
- **Competitor pattern:** HelloFresh + Factor lead with chef-prepped imagery + "delicious meals delivered"; Noom leads with behavior-change psychology
- **Belief sequence:** derive from proof and offer
- **LP-description:** "MealKit auto-generates a weekly meal plan from your goals + preferences; meals arrive prepped, ready in 6 minutes; cancel anytime in 2 taps."
- **Operator invocation:** `/write-ad` with the 10 Cold Start dimensions filled inline.

---

## Step 0 — Pre-Dispatch

Orchestrator reads in order:

1. `references/_shared/copywriting-research-workflow.md` → SOP (Research Doc → Avatar & Offer Brief → Belief Engineering → Unique Mechanism)
2. `research/product-context.md` → voice adjectives "direct, warm, evidence-led"; accuracy constraint "never round trial-start count or App Store rating"; Unique Mechanism "AI-generated weekly meal plan from goals + preferences"
3. `research/icp-research.md` → busy-professional persona (28-42, household income $75K+, cooks <2x/week, has tried HelloFresh once); VoC pain phrase "I have no idea what to eat" used 18x in interviews
4. No `docs/forsvn/artifacts/marketing/campaign-plan.md` (standalone ad-copy, not part of broader campaign)
5. `brand/BRAND.md` → voice anchors "specific, second-person, no hype"; banned-language list includes "revolutionary", "transform", "game-changing"

Emit warm-start summary:

```
Found:
- ICP context → "busy-professional 28-42, household income $75K+, cooks <2x/week"
- brand voice → "direct, warm, evidence-led, specific, second-person, no hype"
- product proof → "12K trial-starts in 90 days; Sarah K. testimonial; 4.7-star/2,300 reviews; Dr. Lin co-formulator"

Need before dispatching: creative-format (dedicated | repurposed-ugc),
conversion event, and at least 2 named proof points (case study / number /
named customer / measured outcome).
```

Operator confirms: creative-format = `dedicated`, conversion-event = `trial_start`, proof = all 4 candidates above.

**Pre-Dispatch hard-block check:**
- Audience-temp = `cold` ✓ (specified)
- Offer specified ✓
- Proof ≥ 2 named candidates ✓ (4 candidates)
- Cold-traffic + subscription-app + conversion_event=`trial_start` ✓ (correct — no soft-warn fires)
- Creative-format = `dedicated` ✓ (no ceiling warning)

**Write-back:** Sarah K. testimonial + 12K trial-starts in 90 days new — appended to experience/product.md (`Product — proof points` key). Offer ($14.99/month after 14-day trial) appended to experience/product.md (`Product — current offer` key).

---

## Step 1 — Layer 1 dispatch (strategist solo)

Orchestrator spawns strategist with `agents/strategist.md` + pre-writing + `references/ad-intelligence/meta-cold-traffic.md` + `references/ad-intelligence/creative-cadence.md` + `references/anti-patterns.md` + `references/message-transmutation.md` + `references/_shared/copywriting-research-workflow.md`.

**Strategist returns** Variant Assignments:

```markdown
# Variant Assignments

## Hero
- Angle archetype: **outcome-first specificity** (lead with Sarah K. + 8 lbs in 4 weeks)
- Anchor proof: **Sarah K. testimonial** ("I dropped 8 lbs in 4 weeks without thinking about meals")
- CTA verb: **Start free trial** (matches trial_start conversion-event)
- Filtering stage optimized for: **Heavy Ranking** (named outcome + specific number drives CTR + conversion signal both)
- Transmutation format: **native static** (single-image post with hero quote overlay; cheapest to produce; competitor pattern is chef-prepped imagery, so a customer-quote-led static is contrast-positioned)
- Variable isolated: **anchor proof type** (named customer outcome vs alternative anchors)

## Variant A
- Angle archetype: **scale + social proof** (lead with 12K trial-starts + 4.7-star rating)
- Anchor proof: **12,000 active trial-starts in 90 days + 4.7-star App Store / 2,300 reviews**
- CTA verb: **Start free trial**
- Filtering stage optimized for: **Light Ranking** (scale numbers drive engagement signal)
- Transmutation format: **native static** (number-overlay static — different visual treatment from hero)
- Variable isolated: **proof type** (aggregate scale vs named customer outcome)

## Variant B
- Angle archetype: **authority + mechanism** (lead with Dr. Lin co-formulation + AI-generated meal plan Unique Mechanism)
- Anchor proof: **Dr. Lin co-formulated** + Unique Mechanism "AI-generated weekly meal plan from your goals + preferences"
- CTA verb: **Start free trial**
- Filtering stage optimized for: **Heavy Ranking** (authority + mechanism = belief installation for cold traffic)
- Transmutation format: **AI UGC** (short-form video of "behind the science" with Dr. Lin avatar; tests video format vs static for cold)
- Variable isolated: **format + authority** (video + co-formulator vs static + customer outcome)

## Ceiling Warning
N/A — creative_format is `dedicated`, not `repurposed-ugc`.

## Policy Flags
- Offer mentions "lose weight" / "dropped 8 lbs" — Sarah K. testimonial wording. Meta health-claim review requires substantiation + disclaimer. Composer + format-checker pick this up.
```

Orchestrator verifies:
- 3 DISTINCT `Angle archetype` values ✓ (outcome-first / scale+social-proof / authority+mechanism)
- 3 DISTINCT `Anchor proof` entries ✓ (Sarah K. / 12K + 4.7-star / Dr. Lin + UM)
- Each variant has `CTA verb`, `Filtering stage`, `Transmutation format`, `Variable isolated` ✓
- Ceiling Warning correctly absent ✓
- Policy Flags surfaces health-claim risk ✓ (composer + format-checker will handle)

Strategy brief PASSED. Proceed to Layer 2.

---

## Step 2 — Layer 2 dispatch (composer → format-checker → voice-auditor → critic)

### 2a — Composer

Composer receives strategy brief + reads `format-spec.md` + `message-transmutation.md` + `ad-intelligence/meta-cold-traffic.md`. Returns hero + A + B:

**Hero** (native static):
- Primary text (under 125 visible): "Sarah K. dropped 8 lbs in 4 weeks without thinking about meals. MealKit's AI plans a weekly menu from your goals — meals arrive prepped, ready in 6 minutes. Start your 14-day free trial."
- Headline (≤40 char): "8 lbs in 4 weeks, zero meal planning" (37 chars)
- Description (≤30 char): "14-day free trial. Cancel in 2 taps." (35 chars — VIOLATES 30-char cap)

**Variant A** (native static, scale + social-proof):
- Primary text: "12,000 people started MealKit this quarter. 4.7-star rating, 2,300 reviews. Weekly meal plans tuned to your goals, prepped and ready in 6 minutes. Start your 14-day free trial."
- Headline: "12K trial-starts. 4.7-star. Try free." (36 chars)
- Description: "14-day free. Cancel anytime." (28 chars ✓)

**Variant B** (AI UGC, authority + mechanism):
- Primary text: "Dr. Lin co-formulated MealKit so the AI doesn't just guess. It plans your week from your goals, your preferences, your kitchen. Meals arrive prepped, ready in 6 minutes. Start your 14-day free trial."
- Headline: "Dr. Lin built the AI behind your meals" (39 chars)
- Description: "14-day free. Skip the planning." (31 chars — VIOLATES 30-char cap)

Composer returns draft + claim list:
- Sarah K. quote: pre_writing.Q6.available_proof[testimonial-sarah-k]
- 8 lbs in 4 weeks: pre_writing.Q6.available_proof[testimonial-sarah-k]
- 12,000 trial-starts in 90 days: pre_writing.Q6.available_proof[scale-stat]
- 4.7-star / 2,300 reviews: pre_writing.Q6.available_proof[app-store-rating]
- Dr. Lin co-formulator: pre_writing.Q6.available_proof[authority-dr-lin]
- 6 minutes ready: pre_writing.product_context.unique_mechanism (NOT a claim per se — product spec)

### 2b — Format Checker

Format-checker receives composer draft + claim list + reads `format-spec.md` + `policy-floor.md`. Returns:

**REVISION_REQUIRED** — violations found:
- Hero description: "14-day free trial. Cancel in 2 taps." = 35 chars (violates 30-char cap)
- Variant B description: "14-day free. Skip the planning." = 31 chars (violates 30-char cap)
- **Policy flag** (Sarah K. quote): "dropped 8 lbs in 4 weeks" is a weight-loss claim per `policy-floor.md` §Health-claims. Substantiation present (Sarah K. testimonial), but Meta requires the disclaimer "Individual results vary" within ad copy when a specific weight-loss number is cited. **Composer must add disclaimer to hero + variant B (variant B doesn't cite weight loss directly, but if AI UGC video shows Sarah K., disclaimer needed there too).**

Orchestrator re-dispatches composer with violation list. Format-checker REVISION_REQUIRED does NOT consume a critic cycle.

### 2b-revise — Composer (re-dispatch with violations)

Composer returns revised:

**Hero** description revised: "14-day trial. Cancel anytime." (28 chars ✓)
- Disclaimer added to primary text end: "Sarah K. dropped 8 lbs in 4 weeks... Individual results vary. Start your 14-day free trial."

**Variant B** description revised: "14-day free trial." (18 chars ✓)
- No disclaimer needed (variant B doesn't cite a specific weight-loss number; uses authority + mechanism framing without outcome metric)

### 2b-recheck — Format Checker

Format-checker re-runs:
- All char caps PASSED ✓
- All measured claims substantiated ✓ (every named entity + number traces to claim list)
- Health-claim disclaimer present on hero ✓
- No banned policy phrases (`revolutionary`, `transform`, `game-changing`, fab-sounding claims) ✓
- Returns **PASSED** → proceed to voice-auditor

### 2c — Voice Auditor

Voice-auditor receives format-checker-passed draft + reads `anti-patterns.md`. Returns:

- 0 banned phrases ("leverage", "synergy", "best-in-class", "I hope this finds you well" all absent — these are vendor-speak, ad-copy doesn't naturally use them but the check fires)
- 0 em-dashes ✓
- 0 "Quick question?" / "Are you tired of..." hooks ✓
- "You" count vs "we/us/our" count per variant: all variants pass You>Me ratio (hero 4 you-vs-1 we; A 3 vs 0; B 4 vs 1)
- No fact-free paragraphs (every variant has named entity + number in primary text)
- No revisions needed. Passes to critic.

### 2d — Critic

Critic receives voice-audited draft + pre_writing verbatim + strategy brief + reads `rubric.md` + `anti-patterns.md` + `policy-floor.md`.

**Critic verdict (cycle 1): PASS**

Per-variant scorecards:

**Hero (58/70):**
| Dim | Score | Notes |
|---|---|---|
| Hook scroll-stop | 9 | "Sarah K. dropped 8 lbs in 4 weeks without thinking about meals" — named entity + named outcome + named time + paradox ("without thinking") |
| Component-char compliance | 9 | Primary text uses ~125 visible window; headline 37 chars; description 28 chars; disclaimer placement is end-of-primary, doesn't eat visible window |
| CTA-LP match | 8 | "Start your 14-day free trial" matches LP description "auto-generates weekly meal plan from your goals" — ad promise = LP promise |
| Pattern-interruption density | 8 | Hero is outcome-first (Sarah K.); A is scale+social-proof (12K + 4.7-star); B is authority+mechanism (Dr. Lin + AI) — 3 distinct angles; competitor pattern is chef-prepped imagery, customer-quote-led static is contrast-positioned |
| Policy + claim compliance | 8 | Weight-loss claim substantiated (testimonial); disclaimer present; no banned phrases |
| Specificity | 9 | Specificity Floor MET: Sarah K. (named entity) + 8 lbs (named number) + 4 weeks (named time) + 14-day trial (named offer) + 6 minutes (named UM detail) = 5 verifiable specifics. All trace to pre_writing.Q6.available_proof[] or product_context. |
| Transmutation fit | 7 | Native static format is correct for the angle (single quote + image works without motion); could push to 8 with strong visual treatment spec, but copy-only scope = 7 |

**Variant A (56/70):**
| Dim | Score | Notes |
|---|---|---|
| Hook scroll-stop | 8 | "12,000 people started MealKit this quarter" — concrete + scale + named brand |
| Component-char compliance | 9 | 36 / 28 chars |
| CTA-LP match | 8 | Same as hero |
| Pattern-interruption density | 8 | Distinct from hero + B |
| Policy + claim compliance | 9 | No health claim (scale + rating); standard substantiation suffices |
| Specificity | 9 | 12,000 + 4.7-star + 2,300 + 14-day = 4 specifics |
| Transmutation fit | 5 | Native static is fine but doesn't push the format envelope; testing scale + social-proof on a different format (e.g., motion graphic showing rating growth over 90 days) would be more interesting |

**Variant B (54/70):**
| Dim | Score | Notes |
|---|---|---|
| Hook scroll-stop | 7 | "Dr. Lin co-formulated MealKit so the AI doesn't just guess" — authority + mechanism, slightly less scroll-stop than outcome or scale |
| Component-char compliance | 9 | 39 / 18 chars |
| CTA-LP match | 7 | "Dr. Lin built the AI" headline emphasizes science; LP description doesn't lead with Dr. Lin (could risk message-match) |
| Pattern-interruption density | 8 | Distinct from hero + A |
| Policy + claim compliance | 9 | Authority claim (Dr. Lin co-formulator) substantiated |
| Specificity | 8 | Dr. Lin (named entity) + 6 minutes (UM detail) + 14-day trial = 3 specifics — meets floor |
| Transmutation fit | 6 | AI UGC video is the right format for authority+mechanism (motion + voiceover for Dr. Lin) — adds production cost but tests video vs static |

**Critic Total: 168/210 (PASS aggregate; every per-variant ≥49/70; every dim ≥6).** Proceed to terminal humanmaxxing per variant.

---

## Step 3 — Terminal Humanmaxxing per Variant + Specificity Regression

Orchestrator invokes `humanmaxxing` 3 times (hero / A / B) independently:

### 3a — Humanmaxxing Hero

Pass: hero text + `content-type: "short-outbound"` + `audience-temp: cold` + `protected_tokens: ["Sarah K.", "8 lbs", "4 weeks", "14-day", "6 minutes", "MealKit", "mealkit.app/trial?utm=meta_q4"]`.

Humanmaxxing returns:
- Primary text: "Sarah K. dropped 8 lbs in 4 weeks without thinking about meals. MealKit's AI plans your week from your goals, meals arrive prepped, ready in 6 minutes. Individual results vary. Start your 14-day free trial."
- Headline: "8 lbs in 4 weeks, zero meal planning" (unchanged)
- Description: "14-day trial. Cancel anytime." (unchanged)

Net change: removed "from your goals — meals arrive" em-dash, replaced with comma. Compression near 0% (short-outbound calibration). All protected tokens preserved.

**Specificity regression:** re-run critic Specificity dim only on humanmaxxed hero. Score: 9 (unchanged — all 5 specifics still present; Sarah K., 8 lbs, 4 weeks, 14-day, 6 minutes). URL `mealkit.app/trial?utm=meta_q4` preserved. PASS.

### 3b — Humanmaxxing Variant A

Pass: variant A text + tokens. Humanmaxxing returns clean version (1 minor tone tweak; all 4 specifics preserved). Specificity regression: 9 (unchanged). PASS.

### 3c — Humanmaxxing Variant B

Pass: variant B text + tokens. Humanmaxxing returns clean version. Specificity regression: 8 (unchanged). PASS.

All 3 variants pass regression → ship humanmaxxed versions.

---

## Step 4 — Write artifacts

Orchestrator writes 3 files to `docs/forsvn/artifacts/marketing/write-ad/`:

- **`cold-2026-05-18-mealkit-trial.md`** — hero + A + B humanmaxxed + frontmatter (`skill: write-ad`, `version: 1`, `date: 2026-05-18`, `status: done`, `network: meta`, `surface: meta-full-ad`, `audience_temp: cold`, `creative_format: dedicated`, `production_model: in-house`, `conversion_event: trial_start`, `critic_total: 168/210`, `critic_per_variant: {hero: 58/70, variant_a: 56/70, variant_b: 54/70}`)
- **`cold-2026-05-18-mealkit-trial.rationale.md`** — angle + audience-temp framing + creative-format + production-model + anchor-proof per variant + anti-patterns avoided + Pre-Dispatch dimensions resolved
- **`cold-2026-05-18-mealkit-trial.critic-score.md`** — 7-dim scorecards per variant + total + per-variant regression check + cycle count (1 critic cycle + 1 format-checker revise)

---

## Step 5 — Deliver inline

Orchestrator delivers hero + A + B + rationale + format-checker REVISION_REQUIRED note (one revision absorbed). Scorecard not shown (no dim scored 6-7 except Variant A Transmutation fit = 5 — surface for operator awareness).

**Completion Status: DONE** — passed critic + format-checker + humanmaxxing regression per variant, ready-to-publish.

---

## Cycle-2 FAIL variant (if critic had returned FAIL)

If critic cycle 1 had scored Hero Hook = 5 ("Sarah K. dropped 8 lbs in 4 weeks" felt thin against competitor pattern of chef-prepped imagery; needed sharper paradox), single-dim FAIL. Orchestrator re-dispatches FULL Layer 2 chain (composer → format-checker → voice-auditor → critic) with feedback "Hero Hook 5/10 — competitor pattern is chef-prepped imagery + 'delicious meals delivered.' Sharpen the paradox: lead with what MealKit users DON'T do (e.g., 'Sarah K. dropped 8 lbs without grocery shopping, recipe hunting, or cleanup')."

Composer revises hero. Format-checker re-runs (PASSED). Voice-auditor re-runs. Critic cycle 2: Hook 8/10. PASS at 60/70. Ship.

If cycle 2 had also FAILed on a different dim (e.g., CTA-LP match dropped to 5 because revised hero promise diverged from LP), orchestrator surfaces: "Critic couldn't reach threshold across 2 cycles — Hero best draft + 60/70 + CTA-LP match flagged 5/10. Your call." Status: `DONE_WITH_CONCERNS`.

---

## Format-Checker REVISION_REQUIRED path (already demonstrated)

Already shown in Step 2b above — format-checker bounced on 2 description char-cap violations + 1 health-claim disclaimer requirement. Composer revised; format-checker re-ran PASSED; voice-auditor + critic proceeded. REVISION_REQUIRED did NOT consume a critic cycle.

If format-checker had bounced a SECOND time on the revised draft (e.g., composer's disclaimer wording also violated policy): **FORMAT_FAIL** → escalate to user with violations enumerated. Do NOT ship as DWC; user must reconcile (typically by relaxing the claim or finding substantiating proof or different framing).

---

## Route B (called by campaign-plan) — short snippet

**Scenario:** `plan-campaign` is orchestrating a Q4 MealKit campaign across paid + organic + email. The paid mix includes BOTH warm (retargeting trial-finishers) AND cold (this MealKit scenario above). campaign-plan dispatches ad-copy TWICE (Route B is NOT stacked — one invocation per audience-temp).

- **Invocation 1** (warm retargeting): campaign-plan passes audience-temp=`retargeting` + warm-audience-source=`IG followers` + recent-organic-content (last 6 posts) + offer (different angle for warm: "Trial ending? Lock in $9.99/mo for 6 months") + creative-format=`dedicated` + conversion-event=`purchase` + LP-description.
- **Invocation 2** (cold; this walkthrough's scenario): campaign-plan passes audience-temp=`cold` + offer (14-day free trial) + creative-format=`dedicated` + conversion-event=`trial_start` + LP-description.

Each invocation produces 3 artifact files (hero + A + B per audience-temp). campaign-plan reads `critic_total`, `critic_per_variant.hero`, `audience_temp`, `creative_format` from each artifact to allocate budget — highest-scoring audience-temp gets larger initial budget split.

**Completion Status per invocation: DONE.** campaign-plan reads both artifacts to assemble the paid section of the Q4 campaign plan.
