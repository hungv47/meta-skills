---
type: anti-patterns
schema_version: 1
last_verified: 2026-05-11
verifier: hungv47
---

# Ad-Copy Anti-Patterns

Banned phrases, structural AI tells, and ceiling-warning triggers for Meta paid-ad copy. Used by `agents/voice-auditor.md` (surface edits + structural BLOCK calls) and `agents/critic.md` (auto-fail conditions).

> Inherits from write-outreach's `anti-patterns.md` where overlap exists (AI tells, vendor-speak), with ad-specific additions for visible-window economy, ceiling triggers, and ad-format fabrication tells.

---

## 1. Banned Phrases — Vendor-Speak

Zero tolerance. Each is a fix-in-place candidate for voice-auditor (replace with the substitution) unless paired with multiple compound issues (then BLOCK).

| Banned | Substitution |
|--------|--------------|
| "leverage" | "use" |
| "unlock" | "get" / "access" |
| "best-in-class" | name a specific outcome instead |
| "industry-leading" | name the specific number ("ranked #2 in [category]") |
| "premier" | name the specific cohort |
| "world-class" | name a specific named customer |
| "next-level" | name the specific outcome |
| "game-changing" | name what changed and for whom |
| "synergy" | omit; restructure |
| "transformative" | name the transformation |
| "innovative" | name what's new |
| "revolutionary" | name the change |
| "cutting-edge" | name the specific tech |
| "trusted by..." | name 1-2 specific customers |
| "powered by AI" | name what the AI does |
| "supercharge your..." | name the specific lift |
| "streamline" | name the specific friction removed |
| "optimize" | name the specific metric improved |

---

## 2. AI Tells — Structural

Voice-auditor auto-checks each. Critic auto-fails any hit at the Hook or Specificity dim.

### 2a. Setup-sentence opener

First sentence is a meta-statement about the ad's existence rather than substance.

**Examples (auto-fail):**
- "I wanted to share..."
- "We're excited to announce..."
- "Looking for [thing]?"
- "Are you tired of [thing]?"
- "Have you ever wondered...?"
- "I'm reaching out because..."

**Fix:** lead with the substance — the specific anchor, the specific observation, the specific number.

### 2b. Rhetorical question hook

AI theater. Real humans don't open ads with rhetorical questions.

**Examples (auto-fail):**
- "Ever wondered why...?"
- "What if I told you...?"
- "Sound familiar?"
- "Imagine if you could..."
- "Curious about [thing]?"

**Fix:** make a direct statement with a specific anchor.

### 2c. "Just" as hedge

AI's favorite softener. A single instance is fix-in-place.

**Examples:**
- "Just one click..."
- "Just $9..."
- "Just for you..."
- "Just wanted to mention..."

**Fix:** delete "just" — the sentence almost always reads stronger without it.

### 2d. "Quick" as hedge

Same pattern as "just".

**Examples:**
- "Quick question..."
- "Quick tip..."
- "Quickly..."
- "Just a quick note..."

**Fix:** delete "quick" or replace with a specific time/effort estimate.

### 2e. Em-dashes

Zero tolerance — same rule as cold-outreach voice-auditor + humanmaxxing terminal pass.

**Fix:** replace every em-dash with a comma, period, or parentheses.

### 2f. Metronomic rhythm

In primary text of 5+ sentences, 4+ consecutive sentences within 2 words of each other in length. AI generates at steady cadence; humans vary.

**Fix:** break the rhythm — alternate short (5-8 words) and long (12-18 words) sentences.

### 2g. Fact-free body

A variant whose primary text contains zero concrete nouns, numbers, or named entities.

**Auto-fail:** voice-auditor BLOCKS rather than patches — composer needs to pull a specific from `available_proof[]`. Critic Specificity Floor fires anyway.

### 2h. Compound-praise specificity

"Your great work in the SaaS space" / "Your impressive growth journey" / "Your incredible team" — generic-flavor adjective + generic-flavor noun. AI-tell from internal synthesis.

**Fix:** replace with named specifics or BLOCK (composer rework).

### 2i. Bracketed-variable leak

Template variables that should have been mapped:

**Examples (auto-fail):**
- "Hi [FirstName]" still in draft
- "Customer [X] saw [Result]" still in draft
- "{{ company_name }}" template syntax leaked

**Auto-fail:** voice-auditor BLOCKS — composer needs to map every variable, not just delete brackets.

---

## 3. Ad-Specific Fabrication Tells

### 3a. False-specificity (framework pattern)

Dressed up to sound specific but not actually verifiable.

**Examples:**
- "Hundreds of B2B SaaS founders trust [product]" (number unbounded; cohort generic)
- "Trusted by leading marketers" (no named marketers)
- "Used by top agencies" (no named agencies)
- "Proven across 1,000+ campaigns" (no source, no scope)

**Fix:** replace with a real named entity + real number, OR remove the claim and lean on a verifiable anchor.

### 3b. Stat without source

Numbers presented as fact without traceable origin.

**Examples (auto-fail):**
- "Studies show..." (no source)
- "Research finds..." (no source)
- "Industry data shows..." (no source)
- "97% of users say..." (no methodology disclosed)

**Fix:** either name the study/source explicitly OR remove the claim.

### 3c. Generalizing a testimonial

A single-customer outcome presented as the typical result.

**Examples:**
- Pattern basis: internal research synthesis.
- Bad ad: "Cut close time 55% (typical result)"
- Good ad: "Customer X cut close time 55%" OR "In our cohort, customers cut close time from ~9 days to ~4 days"

### 3d. Hypothetical as measured

Framing a hypothetical scenario as if it were a measured outcome.

**Examples (auto-fail):**
- "Imagine cutting close time 55% — that's exactly what our customers do"
- "What if you could lose 20 lbs in 30 days? Our customers do."

**Fix:** keep the hypothetical FRAMED as hypothetical OR replace with the actual measured outcome.

---

## 4. Ceiling-Warning Triggers (Strategist + Composer)

These trigger the ceiling-warning artifact section.

### 4a. Repurposed-UGC at scale

If `creative_format=repurposed-ugc` AND user mentions target daily spend > $15K:
- Strategist surfaces ceiling warning per `creative-cadence.md` §5
- Composer surfaces the warning verbatim in the artifact
- Critic verifies the warning is present (Policy dim -2 if missing)

### 4b. Lookalike audiences post-Andromeda

If user mentions lookalike audiences as a targeting strategy:
- Strategist flags in rationale per `meta-cold-traffic.md` §2
- Out of scope for ad-copy (audience setup, not copy) but operator should know
- Recommend broad targeting + algo-via-creative instead

### 4c. Purchase optimization on 3-day trial

If `conversion_event=purchase` AND `offer` contains "3-day trial" / "7-day trial" / "free trial":
- Soft warn at pre-dispatch per `meta-cold-traffic.md` §3
- Recommend `trial_start` conversion event instead
- Proceed as `done_with_concerns` only if user overrides

### 4d. In-house production at scale

If `production_model=in-house` AND user mentions target daily spend > $15K:
- Strategist flags in rationale per `creative-cadence.md` §6
- In-house production caps variant volume; cannot sustain the velocity (50+ variants/month) needed at scale
- Recommend affiliate-creator or external-freelance production

---

## 5. Ad-Format Anti-Patterns

### 5a. Multi-CTA in one ad

**Auto-fail:** composer one-CTA-per-variant rule.

**Examples:**
- "Try free → then upgrade!"
- "Sign up now AND book a demo"
- "Download AND share with your team"

**Fix:** pick one CTA per variant.

### 5b. Paragraph walls in primary text

Single 8+ sentence block in primary text. Mobile feed renders short lines better.

**Fix:** break into 1-2 sentence chunks; cut filler sentences.

### 5c. Hashtags in body

Wasted chars. Meta doesn't reward hashtags in paid ads.

**Fix:** remove hashtags from primary text.

### 5d. Excessive emoji

3+ emoji in headline OR 5+ in primary text reads as low-effort.

**Fix:** use one emoji as stop-cue max; remove decorative emoji.

### 5e. ALL-CAPS headline

Meta-policy auto-reject.

**Fix:** sentence case or title case only.

### 5f. Bait-and-switch CTA

CTA verb doesn't match LP primary action.

**Fix:** match ad CTA verb to LP button verbatim.

### 5g. "Click here" as the entire CTA

Generic CTA with no value framing.

**Fix:** pair the CTA verb with what happens ("Start 14-day trial" beats "Learn more").

---

## 6. Variant Distinctness Anti-Patterns

### 6a. Three variants share the same anchor

**Auto-fail:** Pattern-Interruption dim.

**Fix:** strategist assigns 3 distinct anchors from `available_proof[]`. If only 2 distinct anchors are available, return BLOCKED at strategist layer (need 3 minimum).

### 6b. Three variants share the same archetype

**Auto-fail:** Pattern-Interruption dim.

**Fix:** strategist picks 3 distinct angle archetypes (problem-framing / outcome-asymmetry / peer-observation / specific-result / contrast / curiosity-gap).

### 6c. Surface-level paraphrase

Variant B's primary text is hero's primary text with synonyms swapped.

**Auto-fail:** Pattern-Interruption dim.

**Fix:** rewrite variant from a different archetype + different anchor — not from the same skeleton.

### 6d. Headline distinctness < 10 chars

Levenshtein-distance proxy < 10 chars between any pair of headlines.

**Auto-fail:** format-checker + critic Pattern-Interruption.

**Fix:** compose 3 structurally different headlines (different opening verb, different value framing).

---

## 7. Tone / Register Anti-Patterns

### 7a. Sender-first opening

First 30 chars of primary text mention "We", "Our", "I", or product name.

**Examples:**
- "We help [role] do [thing]..."
- "Our [product] is..."
- "I'm reaching out because..."
- "[Product Name] is the leading..."

**Fix:** re-front with "you/your" or a prospect-side noun.

### 7b. Corporate announcement voice

Reads like a press release.

**Examples:**
- "Introducing the all-new..."
- "We're proud to announce..."
- "Welcome to a new era of..."

**Fix:** drop the announcement framing; lead with what's in it for the reader.

### 7c. Excessive politeness

Adds nothing, costs chars.

**Examples:**
- "We hope you'll consider..."
- "If you have a moment..."
- "Please feel free to..."

**Fix:** delete; ad copy doesn't need politeness padding.

---

## 8. Cross-Reference

- **Vendor-speak anti-patterns:** mirror cold-outreach's `anti-patterns.md` §"Banned Phrases" — same banned list, ad-format additions for visible-window economy and ceiling triggers.
- **AI-tell structural fails:** mirror cold-outreach's auto-fail list (em-dash, "just"/"quick", rhetorical-question hook, setup-sentence opener, fact-free body, generic claim soup) — same rules, scoped to primary text + headline + description.
- **Fabrication anti-patterns:** stack-wide rule from v4.0.3 / v4.0.5 / v4.1.1 anti-fabrication patches — every direct quote/blockquote must trace verbatim to a named source; every measured claim must trace to `available_proof[]` via `claim_list`.

---

## 9. Orchestrator-Level Anti-Patterns

These thirteen patterns operate at the pipeline level — they describe how the orchestrator (the ad-copy SKILL.md, not any individual sub-agent) can fail to produce shippable ad copy even when individual agents succeed in isolation. Each row names the failure, the cost, and which agent or step enforces the guardrail.

| Anti-pattern | Why it fails | Guardrail |
|--------------|--------------|-----------|
| Cold-creative reused as retargeting | Warm audiences want fit/credibility/timing, not awareness/positioning per `ad-intelligence/meta-retargeting.md` §3 | Strategist enforces warm-objection map when audience-temp=retargeting; critic Hook dim weights "is this addressing the warm objection set?" |
| Frequency creep on retargeting | Audience too small for budget; same people seeing same ads | Out of scope for ad-copy (budget pacing); rationale flags it if creative_format=repurposed-ugc + retargeting (volume insufficient to refresh fast enough) |
| Lookalike audiences on cold trial app | Post-Andromeda, lookalikes underperform broad targeting per `ad-intelligence/meta-cold-traffic.md` §2 | Out of scope for ad-copy (audience setup); rationale flags it if user mentions lookalikes in offer description |
| Repurposed UGC pushed to scale (>$15K/day) | Capped at $10-15K/day spend ceiling per `ad-intelligence/creative-cadence.md` §5 | Strategist surfaces ceiling warning when creative_format=repurposed-ugc; rationale carries the warning to artifact |
| Optimizing for purchase on 3-day trial subscription | Apple 24h signal window — purchase data arrives too late per `ad-intelligence/meta-cold-traffic.md` §3 | Pre-Dispatch soft-warns; proceeds as `done_with_concerns` only if user overrides |
| Banned health/finance/political claim | Meta policy review auto-rejects; account-level penalty risk | Format-checker hard-gate via `references/policy-floor.md`; critic Policy dim auto-fail |
| Fabricated stat or named entity | Critic Specificity Floor auto-fail per `references/anti-patterns.md` | Critic verifies every named entity + number traces to `pre_writing.Q6.available_proof[]` |
| Hero + 2 variants are paraphrases | Variant-volume discipline collapses; A/B test signal collapses | Strategist assigns distinct `angle_archetype` per variant; composer enforces distinct `anchor_proof` per variant; critic Pattern-Interruption dim checks variants are genuinely distinct |
| Em-dashes in ad copy | AI rhythm filler; reads instantly fake | Voice-auditor zero-tolerance auto-fail (same rule as cold-outreach) |
| "Quick question?" / "Are you tired of..." hooks | Generic; doesn't earn the 3-second window | Critic Hook dim 0-2 band |
| Multi-CTA in one ad | Splits intent; conversion-event signal degrades | Composer one-CTA-per-variant rule; format-checker flag |
| Running humanmaxxing twice | Strips specificity, drifts toward generic | Terminal pass runs ONCE per variant |
| Changing every variable at once | No learning; cannot tell if hook, format, proof, CTA, funnel, or offer caused the result | Strategist names one isolated variable per variant using Variable Subtraction |

---

## 10. Cross-Cutting Marketing-Stack Anti-Patterns

These patterns apply across the marketing stack — ad-copy calls `humanmaxxing` as terminal polish-chain per variant (hero + A + B = 3 humanmaxxing invocations), and is itself called by `plan-campaign` as a Route B consumer. Enforced via Pre-Dispatch wiring + critic verification + cross-skill contract.

### Caller skipped the protected_tokens contract (per-variant) when invoking humanmaxxing

**Problem:** Orchestrator dispatches `humanmaxxing` for hero variant with `content-type: "short-outbound"` but forgets to pass `protected_tokens` listing the named entities + numbers + URLs in the critic-approved variant. humanmaxxing's compression-agent paraphrases "$2.3M ARR" to "millions in ARR" or drops the `app.com/trial?utm=meta_q4` URL. The post-humanmaxxing regression check still catches it (Specificity dim drops ≥2 or named entity absent or URL absent) and flags it for operator review with the critic-approved variant preserved — but the run wasted a humanmaxxing cycle. With 3 variants per artifact, the waste compounds 3x.

**INSTEAD:** Terminal pass step in `procedures/dispatch-mechanics.md` § "Terminal Pass: Humanmaxxing" lists `protected_tokens` as a required input (every named entity + number + URL in critic-approved variant). Do NOT skip per variant — it's the contract that prevents silent paraphrase. The URL check is ad-copy-specific (unlike cold-outreach which rarely embeds URLs); humanmaxxing's regression must verify URL preservation. Sibling pattern to cold-outreach's protected_tokens contract; see sibling humanmaxxing's `anti-patterns.md` § "Calling skill drops protected_tokens contract" for the consumer-side framing.

### Post-humanmaxxing regression check disabled or judgment-overridden (per-variant)

**Problem:** Orchestrator runs humanmaxxing on hero, sees a clean polished variant, ships it without re-running critic's Specificity dim. Two slots later eval shows the named proof ("12,000 users in 90 days") was paraphrased to "thousands of users" — exactly the kind of generic claim the critic was designed to catch. With 3 variants, skipping regression on even one variant introduces silent specificity drift that the artifact frontmatter doesn't surface.

**INSTEAD:** Regression **detection is automatic, the decision is the operator's** (per `dispatch-mechanics.md` § "Terminal Pass: Humanmaxxing" step 4). The check runs per variant (3 invocations of critic's Specificity dim per artifact). The Specificity Floor of ≥2 verifiable specifics still applies. If any variant's check fails, flag THAT variant's delta + the removed specific for operator review with the critic-approved version preserved alongside (do NOT try to re-fix humanmaxxing; do NOT cascade-flag all 3 variants). Skipping the detection itself requires explicit `--skip-regression-per-variant` flag (not currently implemented; v6.3.0 candidate).

### Campaign-plan Route B invocation drops audience-temp / creative-format / production-model context

**Problem:** `plan-campaign` calls ad-copy Route B for paid touches in a Q4 campaign but passes only the budget split + landing-page link, leaving audience-temp + creative-format + conversion-event unset. ad-copy's Pre-Dispatch hits Missing-Input Hard Blocks for "Audience-temp missing" + "Creative-format missing" and surfaces AskUserQuestion — but the user is mid-campaign-plan flow and the question is jarring.

**INSTEAD:** When invoked via Route B, the calling skill (campaign-plan) MUST resolve audience-temp + offer + creative-format + conversion-event + production-model BEFORE dispatching ad-copy per audience-temperature. ad-copy Route B is NOT the right place to interrogate the user on campaign-level decisions — those belong in campaign-plan's own Pre-Dispatch. If campaign-plan passes incomplete context, ad-copy Route B should escalate `NEEDS_CONTEXT` back to campaign-plan, not break the flow with mid-stream AskUserQuestion to the user. Note: ad-copy is a per-audience-temp skill (one invocation per temp); if campaign-plan needs both warm AND cold, it dispatches ad-copy TWICE (Route B is NOT stacked).

### Cross-stack contract drift (Artifact Template schema)

**Problem:** A maintainer adds a new frontmatter field to ad-copy's `[audience-temp]-[date]-[slug].md` artifact (e.g., `bid_strategy: lowest_cost | bid_cap | target_cost`) without checking calling-skill consumers (`plan-campaign` reads `critic_total`, `critic_per_variant.hero`, `audience_temp`, `creative_format`, `conversion_event` from write-ad output to budget across audience-temps). Schema drifts; campaign-plan's manifest reader breaks on the new field.

**INSTEAD:** Artifact Template (11-field frontmatter with nested `critic_per_variant: {hero, variant_a, variant_b}` + 3 body files: `[slug].md`, `[slug].rationale.md`, `[slug].critic-score.md` per `format-conventions.md`) is the contract. Schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Field values — audience_temp / creative_format / production_model / conversion_event enums" so the convention IS the contract. Add new fields at the END of frontmatter to avoid breaking existing positional readers. Bid-strategy / budget fields belong in `plan-campaign` artifacts (ad-copy doesn't own bidding), not ad-copy artifacts.
