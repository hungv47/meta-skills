---
type: examples
schema_version: 1
last_verified: 2026-05-11
verifier: hungv47
note: 4 worked examples calibrating the 7-dim rubric. Synthetic illustrative drafts — not real campaigns. Strong examples should pass the gate cleanly (aggregate ≥ 59, all per-dim ≥ 7); weak examples should fail cleanly (aggregate < 42, multiple per-dim ≤ 4). The discriminant gap (≥15 points) is the calibration signal.
---

# Ad-Copy Worked Examples (Calibration)

4 worked examples covering the 2 × 2 matrix:

| | Retargeting (warm) | internal |
|---|---|---|
| **Strong (PASS)** | Example 1 | Example 3 |
| **Weak (FAIL)** | Example 2 | Example 4 |

Each example shows: input context → hero + 2 variants → per-variant scorecards → aggregate verdict. Use these to calibrate intuition before drafting real campaigns.

---

## Example 1 — Strong (Retargeting / SaaS / Dedicated)

### Input

- **audience_temp:** retargeting
- **warm_audience_source:** IG followers
- **offer:** 14-day free trial of close-management SaaS
- **creative_format:** dedicated
- **conversion_event:** trial_start
- **production_model:** in-house
- **available_proof:** [
 "Ramp · close time 9 days → 4 days · in-product analytics",
 "Linear · 38% → 6% missed-deal rate · case study",
 "Vercel · 12 deals/quarter saved · testimonial verbatim"
 ]
- **lp_description:** "Close deals 2x faster. 14-day free trial. Built for B2B sales teams."
- **brand_voice:** direct, peer-to-peer, no fluff
- **recent_organic:** ["Close-time benchmark survey results", "Ramp case study", "How fast pipelines stay fast", "Why pipeline freshness predicts close rate"]

### Strategy Brief (from strategist)

- Audience-temperature framing: retargeting / IG followers (high intent) / direct offer posture; warm-objection map (fit / credibility / timing)
- Hero archetype: **specific-result** — anchor on Ramp's 9→4
- A archetype: **outcome-asymmetry** — anchor on Linear's 38%→6% miss rate
- B archetype: **peer-observation** — anchor on Vercel testimonial
- Transmutation format: **native static** for all 3 variants; variable isolated = anchor proof

### Drafts (composer → format-checker → voice-auditor passed)

**Hero**

> **Primary text** (118 chars): "You watched Ramp cut close time from 9 days to 4 in one quarter. That's our system at work. 14-day trial, no credit card."
> **Headline** (24 chars): "Close 2x faster, 14-day trial"
> **Description** (19 chars): "Built for B2B sales"
> **CTA:** Start Free Trial

**Variant A**

> **Primary text** (122 chars): "Linear missed 38% of deals last year. After 90 days on our pipeline tool, missed-deal rate dropped to 6%. Try free."
> **Headline** (26 chars): "Stop missing deals at 38%"
> **Description** (16 chars): "14-day free trial"
> **CTA:** Start Free Trial

**Variant B**

> **Primary text** (119 chars): "Vercel's head of sales: 'We saved 12 deals last quarter — pipeline stayed fresh.' Free 14-day trial of the same tool."
> **Headline** (25 chars): "12 deals saved last quarter"
> **Description** (24 chars): "Used by Vercel & Linear"
> **CTA:** Start Free Trial

### Critic Scorecard

| Variant | Hook | Char | internal | Pattern | Policy | Spec | Trans | Total |
|---------|------|------|--------|---------|--------|------|-------|-------|
| Hero | 9 | 9 | 10 | 9 | 9 | 9 | 9 | **64** |
| A | 8 | 9 | 10 | 9 | 9 | 9 | 9 | **63** |
| B | 9 | 9 | 10 | 9 | 9 | 9 | 9 | **64** |

**Aggregate: 63.7/70.** All per-dim ≥ 6. **Verdict: PASS.**

**Driver notes:**
- Hook 9: every variant opens with the prospect's world ("You watched...", "Linear missed...", "Vercel's head of sales:") and lands an anchor in first 50 chars
- Char compliance 9: all variants in visible window; headline ≤27 chars (always visible mobile)
- CTA-LP 10: "Start Free Trial" verb verbatim matches LP; "14-day" noun matches
- Pattern-interruption 9: 3 distinct archetypes (specific-result / outcome-asymmetry / peer-observation); 3 distinct anchors (Ramp / Linear / Vercel); 3 distinct openings
- Policy 9: every claim mapped to source; testimonial hedge applied; no banned phrases
- Specificity 9: every variant carries 3+ verifiable specifics (named customer + named number + named outcome)
- Transmutation 9: native-static format fits retargeting feed context; only anchor proof changes across variants

---

## Example 2 — Weak (Retargeting / SaaS / Dedicated)

### Input

Same as Example 1, but the drafter ignored audience-temp framing and produced cold-creative-shaped variants.

### Drafts (composer output — pre-format-checker)

**Hero**

> **Primary text** (95 chars): "Are you looking for a better way to manage your sales pipeline? Our solution can help. Learn more!"
> **Headline** (38 chars): "The leading sales pipeline solution"
> **Description** (24 chars): "Industry-leading B2B SaaS"
> **CTA:** Learn More

**Variant A**

> **Primary text** (101 chars): "Tired of missing deals? Our innovative platform delivers transformative results for B2B sales teams. Try free!"
> **Headline** (32 chars): "Best-in-class pipeline software"
> **Description** (28 chars): "Trusted by leading brands"
> **CTA:** Learn More

**Variant B**

> **Primary text** (89 chars): "Discover how our AI-powered solution can supercharge your sales pipeline. Learn more!"
> **Headline** (34 chars): "Next-level sales pipeline tool"
> **Description** (22 chars): "Game-changing SaaS"
> **CTA:** Learn More

### Critic Scorecard

| Variant | Hook | Char | internal | Pattern | Policy | Spec | Trans | Total |
|---------|------|------|--------|---------|--------|------|-------|-------|
| Hero | 3 | 6 | 4 | 4 | 4 | 1 | 3 | **25** |
| A | 2 | 6 | 4 | 4 | 4 | 1 | 3 | **24** |
| B | 2 | 7 | 4 | 4 | 4 | 1 | 3 | **25** |

**Aggregate: 24.7/70.** Specificity Floor failed on every variant (0 verifiable specifics — all generic flavor: "leading", "innovative", "best-in-class", "transformative", "next-level", "game-changing", "industry-leading", "trusted by leading"). Transmutation fit also fails because no format or isolated variable is named. **Verdict: FAIL (auto-fail on Specificity per variant).**

**Driver notes:**
- Hook 2-3: rhetorical question opener ("Are you tired of...", "Tired of...") = AI-tell auto-fail; "Discover how..." = generic
- Char 6-7: visible window OK but the content inside it carries nothing
- CTA-LP 4: "Learn More" doesn't match LP "Start Free Trial" — CTA verb mismatch
- Pattern 4: 3 archetypes are all generic-flavor variants of the same "we are leading SaaS" pitch
- Policy 4: "Trusted by leading brands" with no named brands = false-specificity; "transformative", "industry-leading" are vendor-speak banned phrases (voice-auditor should have caught these but they bled through to demonstrate calibration)
- Specificity 1: zero named entities, zero named numbers, zero named research — pure generic claim soup
- Transmutation 3: format is not applied; all three variants change wording without naming a testable message/format variable

**What composer rewrite should fix (FAIL cycle 1 feedback):**
1. Remove rhetorical-question and "Discover how..." openers; lead with named anchor (Ramp / Linear / Vercel)
2. Replace "leading", "innovative", "best-in-class", "transformative", "next-level", "game-changing" with specific numbers + specific customers
3. Match CTA verb to LP: "Start Free Trial", not "Learn More"
4. Each variant needs ≥2 verifiable specifics in visible window

---

## Example 3 — Strong (Cold-Traffic / Subscription App / Dedicated)

### Input

- **audience_temp:** cold
- **offer:** 7-day free trial of calorie-tracking app ($9.99/mo annual)
- **creative_format:** dedicated
- **conversion_event:** trial_start
- **production_model:** affiliate-creator
- **available_proof:** [
 "User testimonial: 'Lost 20 lbs in 30 days' — Jake, 32, verified user",
 "Cohort: '5,000 users averaged 12 lbs lost in 90 days'",
 "Calorie-tracking accuracy: 'photo-recognition matches manual entry within 8% (in-house test, n=200 meals)'"
 ]
- **lp_description:** "Track calories by photo. 7-day free trial. $9.99/mo annual."
- **brand_voice:** direct, evidence-led, no fluff
- **recent_organic:** [] (cold audience)

### Strategy Brief

- Audience-temperature framing: cold / broad targeting / positioning + proof in one impression
- Hero archetype: **outcome-asymmetry** — Jake testimonial (with hedge)
- A archetype: **specific-result** — 5,000-user cohort average
- B archetype: **contrast** — photo-recognition vs manual entry (against-the-consensus framing: "AI accuracy is for real for this category")
- Transmutation formats: Hero = **AI UGC / First-Person VSSL concept** using provided Jake testimonial; A = **native static**; B = **AI animation / mechanism visualization**; variable isolated = format while offer and CTA stay fixed

### Drafts (passed format-checker + voice-auditor)

**Hero**

> **Primary text** (122 chars): "Jake (verified user, age 32): 'Lost 20 lbs in 30 days. Just photographed every meal.' Try the same app free for 7 days."
> **Headline** (23 chars): "20 lbs in 30 days — Jake"
> **Description** (23 chars): "Free 7-day photo trial"
> **CTA:** Start Free Trial

**Variant A**

> **Primary text** (124 chars): "In our 90-day cohort, 5,000 users averaged 12 lbs lost — just photographing meals. Free 7-day trial, $9.99/mo annual."
> **Headline** (26 chars): "5,000 users · 12 lbs avg"
> **Description** (24 chars): "Photo-based · 7-day free"
> **CTA:** Start Free Trial

**Variant B**

> **Primary text** (121 chars): "Photo-recognition accuracy on calorie tracking: 92% match to manual entry (in-house test, 200 meals). Free 7-day trial."
> **Headline** (25 chars): "92% accuracy · photo-only"
> **Description** (18 chars): "Verified in-house"
> **CTA:** Start Free Trial

### Critic Scorecard

| Variant | Hook | Char | internal | Pattern | Policy | Spec | Trans | Total |
|---------|------|------|--------|---------|--------|------|-------|-------|
| Hero | 9 | 9 | 10 | 9 | 9 | 9 | 9 | **64** |
| A | 9 | 9 | 10 | 9 | 9 | 9 | 9 | **64** |
| B | 8 | 9 | 9 | 9 | 9 | 9 | 8 | **61** |

**Aggregate: 63.0/70.** All per-dim ≥ 6. **Verdict: PASS.**

**Driver notes:**
- Hook 8-9: every variant opens with a specific named anchor (Jake / 5,000-user cohort / 92% accuracy + in-house test)
- Char 9: all in visible window; headlines ≤27 chars
- CTA-LP 9-10: "Start Free Trial" matches LP; "7-day" noun matches; B slight drift on noun framing ("photo-only" not in LP description)
- Pattern 9: 3 distinct archetypes (testimonial-with-hedge / cohort-average / accuracy-contrast); 3 distinct anchors (Jake / 5,000-user cohort / 92% accuracy)
- Policy 9: testimonial hedge applied ("verified user"); cohort hedge applied ("averaged"); methodology disclosed on accuracy claim ("in-house test, n=200 meals"); no banned wording
- Specificity 9: every variant carries 2-3 verifiable specifics (named customer / named cohort / named methodology)
- Transmutation 8-9: VSSL uses a provided testimonial rather than fake narrator claims; native static and animation notes match the assigned messages; B's animation note needs slightly more visual detail

---

## Example 4 — Weak (Cold-Traffic / Subscription App / Repurposed-UGC)

### Input

Same as Example 3, but `creative_format=repurposed-ugc` and target daily spend = $25K (above the $10-15K ceiling). The drafter also ignored Apple's 24h signal window and optimized for `purchase` instead of `trial_start`.

### Drafts (composer output — pre-format-checker)

**Hero**

> **Primary text** (78 chars): "Lose 20 lbs guaranteed! Just take photos. Doctors hate this trick. Sign up!"
> **Headline** (29 chars): "GUARANTEED 20 LBS IN 30 DAYS"
> **Description** (24 chars): "Free trial · risk-free"
> **CTA:** Sign Up

**Variant A**

> **Primary text** (84 chars): "Tired of dieting? Our AI app is industry-leading for weight loss. Just photograph meals!"
> **Headline** (31 chars): "Best-in-class weight loss AI"
> **Description** (27 chars): "Trusted by thousands"
> **CTA:** Sign Up

**Variant B**

> **Primary text** (82 chars): "Lose weight fast! Our innovative app helps everyone. Free trial, no risk! Sign up today!"
> **Headline** (24 chars): "Lose weight fast!"
> **Description** (22 chars): "100% risk-free"
> **CTA:** Sign Up

### Critic Scorecard (format-checker BOUNCED first; below is post-format-checker fix attempt that still failed critic)

| Variant | Hook | Char | internal | Pattern | Policy | Spec | Trans | Total |
|---------|------|------|--------|---------|--------|------|-------|-------|
| Hero | 2 | 5 | 2 | 3 | 0* | 1 | 1 | **14** |
| A | 2 | 6 | 2 | 3 | 1 | 1 | 2 | **16** |
| B | 2 | 7 | 2 | 3 | 0* | 1 | 1 | **16** |

\* Policy auto-fail (banned wording: "guaranteed", "risk-free", "doctors hate this", ALL-CAPS headline)

**Aggregate: 15.3/70.** Multiple per-dim auto-fails. **Verdict: FAIL (multiple critical issues).**

**Driver notes:**
- Hook 2: rhetorical question openers ("Tired of dieting?"), generic claim openers ("Lose weight fast!"), "Doctors hate this trick" click-bait
- Char 5-7: ALL-CAPS headline on Hero (Meta auto-reject); "Best-in-class weight loss AI" generic
- CTA-LP 2: "Sign Up" doesn't match LP "Start Free Trial" (CTA verb mismatch + offer noun mismatch)
- Pattern 3: 3 archetypes are all variations of "lose weight fast generic claim"; no distinct anchors
- Policy 0-1: **Auto-fail.** "Guaranteed" (banned health claim), "risk-free" (banned finance claim), "Doctors hate this" (click bait), ALL-CAPS headline (Meta auto-reject), "industry-leading" / "innovative" / "trusted by thousands" (false-specificity vendor-speak). Plus the conversion_event was set to `purchase` on a 7-day trial — soft-warn auto-applied; and the repurposed-UGC ceiling warning is missing from the artifact (-2 on Policy).
- Transmutation 1-2: no legitimate narrator or marked VSSL concept; multiple variables changed at once; claims imply unsupported outcomes.
- Specificity 1: zero verifiable specifics — Jake and the 5,000-user cohort and the accuracy test were all available but composer ignored them

**What composer rewrite should fix (FAIL cycle 1 feedback):**
1. Remove ALL banned wording: "guaranteed", "risk-free", "doctors hate this", "industry-leading", "innovative", "trusted by thousands"
2. Remove ALL-CAPS headline (Meta-policy auto-reject)
3. Use real anchors from `available_proof[]` (Jake testimonial + 5,000-user cohort + 92% accuracy)
4. Apply testimonial hedge ("Jake, verified user, age 32") + cohort hedge ("averaged") + methodology disclosure ("in-house test, n=200 meals")
5. Match CTA verb to LP: "Start Free Trial", not "Sign Up"
6. Switch conversion_event to `trial_start` per `meta-cold-traffic.md` §3 (or soft-warn override)
7. Add repurposed-UGC ceiling warning to artifact (current target $25K/day exceeds $10-15K ceiling — flag in rationale)

---

## Calibration Discriminant

| Example | Aggregate | Variant per-dim min | Verdict |
|---------|-----------|--------------------|---------|
| 1 (strong retargeting) | 54.7 | 8 | PASS |
| 2 (weak retargeting) | 21.7 | 1 | FAIL |
| 3 (strong cold-traffic) | 54.3 | 8 | PASS |
| 4 (weak cold-traffic) | 14.3 | 0 | FAIL |

**Discriminant gap:** strong vs weak across both audience-temps shows a 33-40 point gap on aggregate, with weak examples failing per-dim floors on Specificity, Policy, and CTA-LP regardless of audience-temp. The rubric discriminates cleanly.

---

**Examples version:** v0.1 (synthetic illustrative). Replace with real anonymized invocations once 5+ real ad-copy runs exist.
