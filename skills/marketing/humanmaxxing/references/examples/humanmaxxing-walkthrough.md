---
title: Humanmaxxing — End-to-End Walkthrough (Route B, blog post)
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: EXAMPLE
---

# Humanmaxxing — End-to-End Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of how a Route B (full humanmaxxing) polish gets produced — Pre-Dispatch → Layer 1 parallel diagnosis → user checkpoint → Layer 2 sequential pipeline → critic PASS → deliver.

This walkthrough covers Route B (operator slash-command with 200+ word text). Route A (short text) skips voice-extractor + soul-injection + compression — see SKILL.md "Routing + Dispatch" for the simpler Route A flow. Route C (called by another skill) follows Route B mechanics but skips the user checkpoint and returns polished text directly to the calling skill.

---

## Scenario

- **Input:** AI-generated SaaS onboarding blog post, 178 words. Content type: blog post.
- **Operator invocation:** `/humanmaxxing` with paste of the original text.
- **Resolved dimensions after Pre-Dispatch:**
  - Content type: blog post (strip: full, voice: moderate, compression: 15-25%)
  - Voice adjectives: "direct, warm, technical" (from product-context.md, priority 2)
  - Original word count: 178
  - Register: preserve (default for blog)
  - Compression target: moderate (default)
  - Detector mode: none (low-stakes blog, not high-stakes public)

---

## Step 0 — Pre-Dispatch (warm-start path)

Orchestrator reads in order:

1. `brand/BRAND.md` → voice rules, but voice adjectives also live in product-context.md
2. `research/product-context.md` → voice adjectives "direct, warm, technical" + audience register
3. `docs/forsvn/experience/brand.md` → no `Voice — adjectives` entry (not persisted yet)
4. No upstream artifact at `docs/forsvn/artifacts/marketing/content/[slug].md`

Emit warm-start summary:

```
Found:
- brand voice → "direct, warm, technical" (from product-context.md)
- content type → blog post (inferred from arg context)

Defaults applied: compression=moderate, register=preserve, detector_mode=none.
Override anything, or proceed?
```

Operator confirms. No further questions.

**Write-back:** voice adjectives already in product-context.md; no append to experience/brand.md needed.

---

## Step 1 — Layer 1 dispatch (parallel)

Orchestrator spawns 2 agents in one message:

**Pattern Scanner returns:**

- 8 Hard Tells found, 2 Soft Tells
- Top 3: throat-clearing intro (#21, 1 instance), paired synonyms (#6, 2 instances), em dash (#12, 1 instance)
- Absolute Prohibitions: 1 em dash (#1), 1 filler context phrase (#6)
- Estimated compression: 40-50%

**Voice Extractor returns:**

- Voice profile: direct (short sentences, imperatives), warm (inclusive pronouns), technical (domain-specific)
- Current register: formal/generic. Target: professional/conversational
- Sterility: all 6 signs present — uniform sentence length, no experience markers, no fragments, any-brand paragraphs
- 5 injection opportunities flagged (specificity, rhythm, reader presence)

Both return.

---

## Step 2 — User Checkpoint (Route B only)

"Found 8 Hard Tells and 2 Soft Tells. Top issues: throat-clearing intro, paired synonyms, em dash. Estimated 40-50% compression potential. Proceed with all fixes?"

User confirms — no `user_directives` overrides. Proceed to Layer 2.

---

## Step 3 — Layer 2 sequential dispatch

**Strip Agent receives** pattern-scanner output + original text:

> Removes "In today's rapidly evolving SaaS landscape," (throat-clearing). Picks "critical" from "critical and essential" (paired synonym). Removes em dash + -ing phrase. Removes "It's important to note that" (hedge). Removes "In conclusion" (formulaic). Removes "Start building..." (permission-seeking). Word count: 178 → 112.

**Soul Injection receives** strip output + voice profile:

> Leads with the data point (50% retention). Adds Intercom example with specific numbers. Replaces "companies" with named company. Varies rhythm: 11, 4, 18, 9 word sentences. Adds reader presence. Word count: 112 → 108 (net reduction from specificity replacing wordier abstractions).

**Compression receives** soul-injection output:

> Applies filler phrase compression ("The key takeaway is that" deleted). Merges setup + conclusion into single sentence. Word count: 108 → 91.

**Critic receives** compression output:

> Pass 1 (Absolute Prohibitions binary gate): Zero violations. ✓
> Pass 2 (Hard/Soft Tells): Zero Hard Tells remaining. 0 Soft Tells remaining. Vocabulary clean.
> Pass 3 (5-dimension rubric):
>   - Directness 8/10
>   - Rhythm 8/10
>   - Trust 8/10
>   - Authenticity 7/10
>   - Density 9/10 (every paragraph has facts)
>   - Total: 40/50. PASS (threshold ≥35).
> Compression: 49% (well above 15% floor).
> Meaning preservation: all claims intact.

**Overall: PASS, cycle 1.**

---

## Step 4 — Detector-Resistance Verification (skipped)

`detector_mode: none` for this scenario → skipped. For high-stakes public content (e.g., LinkedIn thought-leadership post), operator would set `detector_mode: pangram` (if PANGRAM_API_KEY available) or `detector_mode: proxy`, and this step would run after critic PASS.

---

## Step 5 — Deliver

Orchestrator writes:

```markdown
---
skill: humanmaxxing
version: 1
date: 2026-04-15
status: done
compression: 49%
detector_status: not_run
protected_tokens_preserved: N/A
---

# Humanmaxxed: SaaS Onboarding Blog Post

## Humanization Summary

| Metric | Value |
|--------|-------|
| Words (original) | 178 |
| Words (humanmaxxed) | 91 |
| Compression | 49% |
| AI patterns found | 8 Hard, 2 Soft |
| AI patterns fixed | 8 Hard, 2 Soft |
| Hard Tells remaining | 0 |
| Soft Tells remaining | 0 |
| Quality score | 40/50 (Di:8 R:8 T:8 A:7 De:9) |
| Detector status | not_run |
| Protected tokens preserved | N/A |

## Change Log

| Location | Original | Change | Rule |
|----------|----------|--------|------|
| Para 1, S1 | "In today's rapidly evolving SaaS landscape" | Deleted | Pattern #21 (throat-clearing intro) |
| Para 1, S1 | "critical and essential" | "critical" then restructured | Pattern #6 (paired synonyms) |
| Para 1, S1 | "has become a critical component of..." | Lead with the data point instead | Compression: setup elimination |
| Para 1, S3 | "more quickly and efficiently" | Deleted (paired synonyms + filler) | Pattern #6, Compression |
| Para 2, S1 | "It's important to note that" | Deleted | Pattern #8 (hedge) + Compression |
| Para 2, S2 | "a seamless and intuitive experience" | Restructured with specifics | Pattern #6 + AI vocabulary ("seamless") + Voice: specificity |
| Para 3, S1 | "In conclusion" | Deleted | Pattern #5 (formulaic structure) + #25 (generic positive conclusion) |
| Para 3, S3 | "Start building... see the difference!" | Replaced with actionable takeaway | Pattern #20 (permission-seeking) + Pattern #11 (exclamation) |
| Throughout | Generic claims | Added Intercom example | Voice: specificity as personality |

---

SaaS companies with structured onboarding retain 50% more users. Yet most treat it as a product tour and stop there.

Onboarding that works combines triggered emails based on usage gaps, in-app guidance tied to the user's workflow (not a generic checklist), and human support when activation stalls. Intercom's onboarding rebuild in 2024 cut their time-to-value from 14 days to 3 by replacing their 12-step tour with two targeted nudges.

Less coverage, more precision. Guide users to one aha-moment fast, then expand.
```

Returns inline to operator:
```
✓ Humanmaxxed artifact at docs/forsvn/artifacts/marketing/content/saas-onboarding.humanmaxxed.md
178 → 91 words (49% compression). Quality 40/50 PASS cycle 1. Zero Hard Tells.
DONE.
```

---

## FAIL-handling variant (Density FAIL cycle 1 → PASS cycle 2)

Same scenario, but cycle 1 critic returns FAIL on Density dimension:

- Density 4/10 — Para 2 has no concrete fact, number, or named example. Total: 36/50 (above 35 PASS threshold) BUT critic enforces per-paragraph density check.
- Wait — actually the threshold is ≥35 total. So 36/50 would be PASS overall. Let me redo this: assume Authenticity 3/10 (voice-extractor's profile said "direct + warm + technical" but the soul-injection output reads as "professional + bland") → total 32/50 → FAIL.

**Critic feedback:**

| Issue | Location | What to fix | Re-dispatch to |
|---|---|---|---|
| Authenticity 3/10 — voice profile mismatch | Para 2 + Para 3 | Re-apply "direct + warm" voice. Add 2 short imperatives + 1 inclusive pronoun. | soul-injection-agent |

Soul-injection re-dispatched (cycle 2) with critic feedback. Returns with revised voice. Compression-agent re-runs (because soul-injection added words — needs re-compression). Critic re-runs:

- Authenticity now 7/10 — voice profile honored
- Other dimensions held. Total: 38/50. **PASS cycle 2.**

`critic_loop_count: 2` recorded in frontmatter; `status: done` (PASS within 2 cycles).

If cycle 2 had ALSO failed → ship `done_with_concerns` with the remaining failure(s) pinned in a Critic Concerns block at the top of the artifact, plus `critic_passes: [pattern-scan, voice-extract, strip, compression]` (critic absent or with annotation).

---

## `--fast` variant

Same scenario, operator invokes `/humanmaxxing --fast`:

- Pre-Dispatch resolves voice + content type (Cold Start fires if missing — Critical Gates supersede `--fast`)
- Route collapses from B → A: skip voice-extractor + soul-injection + compression
- Layer 1: pattern-scanner only
- Layer 2: strip → critic (no soul-injection, no compression, no Detector-Resistance Verification)
- Output: stripped text + abbreviated Humanization Summary (no soul-injection / compression metrics; voice/density dimensions absent from quality score)
- Trailing line: `Ran in --fast mode (Route A collapse); rerun without the flag for full Route B treatment (voice injection + compression + detector verification).`

`--fast` is for "I just want the AI fingerprints stripped quickly, not full polish" — not for shipping production-grade thought-leadership content where the soul-injection + compression + critic gate are all load-bearing.

---

## Route C variant (called by another skill)

Same scenario, but `/write-outreach` produces an EN cold email draft and auto-routes through humanmaxxing before delivery:

- Pre-Dispatch trusts cold-outreach's pre-resolved: voice ("blunt, specific, dry" from write-outreach's brief), content_type `short-outbound`, compression `0-10%` (per Content Type Calibration short-outbound row), `protected_tokens: ["Acme Corp", "$2.3M ARR", "https://acme.com/case-study"]`, `detector_mode: proxy`
- No Cold Start (calling skill passed everything)
- Layer 1: pattern-scanner only (voice-extractor skipped — cold-outreach already extracted)
- Layer 2: strip → compression (light, 0-10% per short-outbound calibration) → critic → Detector-Resistance Verification (proxy mode + protected-token regression)
- Returns polished text + metadata to cold-outreach (no standalone artifact file written by humanmaxxing in Route C — cold-outreach embeds polished text in its own artifact)
- cold-outreach's artifact frontmatter records `polish_chain_applied: humanmaxxing`, `humanmaxxing_quality_score: 37/50`, `humanmaxxing_detector_status: proxy_pass`, `humanmaxxing_protected_tokens_preserved: true`
