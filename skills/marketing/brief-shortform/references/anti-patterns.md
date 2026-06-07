---
title: Short-Form Brief — Anti-Patterns Catalog
lifecycle: canonical
status: stable
produced_by: short-form-brief
load_class: ANTI-PATTERN
---

# Anti-Patterns Catalog

Auto-FAIL patterns and high-risk patterns the critic-agent watches for. Cross-referenced by hook-agent, storyboard-agent, copy-pack-agent during craft, and by critic-agent during gate.

**Load when:** any craft agent (hook / storyboard / copy-pack / audio / production-mode) drafts content OR critic agent fires (4-sub-critic gate) OR re-dispatch heuristic kicks in (critic FAIL routes to named source agent). Re-read before any output ships as `done` or `done_with_concerns`.

---

## Hook-Layer Anti-Patterns (Auto-FAIL on Hook Critic)

### AI slop openers
Any of these in any hook variation = auto-FAIL:
- "Hey guys"
- "Hey everyone"
- "In today's world"
- "Are you tired of"
- "Today I want to talk about"
- "Let me tell you"
- "Have you been struggling with"
- "Have you ever wondered"
- "If you're like me"
- "Welcome back"

### Triad failures
- **Visual + verbal + text don't reinforce.** Visual is product UI, verbal is founder credential, text is generic question — they don't land the same idea.
- **Triad spread over 3s instead of simultaneous in 1s.** "First a visual, then a line, then text on screen" — viewers swipe before all three hit.
- **Single-archetype variations.** All 3 hooks using credential flash defeats the purpose of having alternatives.

### Generic hooks
- "Strong hook here" (placeholder text)
- "Compelling opener about X"
- Hooks that could fit any brand/angle (fail "Uniquely ours" 3Q test)

### Burying the lead
- "First, let me tell you a story about…"
- "Before I get into it…"
- Anything that delays the hook past 0:01

---

## Production-Layer Anti-Patterns (Auto-FAIL on Production Critic)

### Vague action verbs
- "Show product"
- "Talk to camera"
- "Transition"
- "Cutaway"
- "B-roll"

Specify what + how. "Hand pulls latch on case at 0:03; latch click audible" passes.

### Missing timing blocks
A shot with no `0:XX–0:YY` is a paragraph, not a shot. Auto-FAIL.

### Missing framing tags
"Close-up" alone is ambiguous. Specify ECU/CU/MCU/MS/MLS/LS/WS/EWS.

### Vague audio plans
- "Use trending music"
- "Background music"
- "Some kind of music"

Either name a track (with ID) OR specify VO direction (pacing/tone/mic).

### Empty production notes
- Live-action mode with no talent/gear/location notes
- Motion-graphic mode with no asset list / brand color tokens
- Mixed mode with no transition principle

---

## Algorithm-Fit Anti-Patterns (Auto-FAIL on Algorithm Critic)

### Captions missing
85%+ of viewers watch without sound. Burned-in captions are mandatory across all 5 platforms. Auto-FAIL if missing.

### Reels with TikTok watermark
platform leadership's Originality Score (Jan 2025) detects and downranks. Auto-FAIL.

### Reels using trending audio without Originality consideration
Either pair trending audio with strong original visual treatment OR use original audio. Naked trending-audio reuse = Originality penalty.

### Length outside platform sweet spot
- TikTok 15-60s; >60s drops distribution sharply unless angle warrants
- Reels 30-90s; <30s is fine but >90s loses retention
- Shorts 15-60s; longer than 60s is YouTube long-form, not Shorts
- LinkedIn <90s optimal; >90s retention drops sharply
- X video 15-90s for engagement-optimized

### No loop-friendly ending on Shorts
Loop rate is a core ranking signal. Brief must spec a final frame that matches the opening visually.

### Wrong audio strategy per platform
- TikTok with original VO when trending dominates the niche
- Reels with trending audio when Originality matters for this brand
- Shorts without silent-friendly + loop consideration

---

## Brand-Fit Anti-Patterns (Auto-FAIL on Brand Critic)

### Generic founder/company tropes
Any of these in any spoken-line or caption section = FAIL:
- "Here's a thing I learned"
- "We're excited to announce"
- "Thrilled to share"
- "I want to share something with you"
- "Big news"
- "Quick update"
- "Just wanted to drop in"

### Missing VoC
- No buyer phrase from ICP appears in caption first line
- No buyer phrase appears in hook verbal line
- VoC phrases listed in voc-extraction-agent output but not used downstream

### Voice mismatch with brand mode
- Founder mode brief written in third-person company voice
- Company mode brief written in first-person founder voice
- Voice drifts mid-piece (founder open + company close)

### Voice mismatch with BRAND.md archetype
- BRAND.md says "warm, technical, friend-who-tells-truth" — brief reads "corporate, sales-pitch, hype-driven"
- Cross-check brief tone against BRAND.md voice section

### Sales-pitch CTAs on relationship platforms
- LinkedIn with naked sales-pitch CTA — pushes back hard
- X video with "buy now" — fails the platform's culture

---

## Variant-Layer Anti-Patterns (Auto-FAIL on Algorithm Critic for Variant)

### Caption-only resize
The variant rebuilds hook archetype + audio rule + caption norm + CTA placement from research catalog. If "What Changed From Hero" table shows only caption length adjustment → auto-FAIL.

### Hero hook archetype copied to variant
TikTok hero used credential flash → Reels variant uses credential flash without research validation. Variant must use the platform's archetype menu.

### Audio strategy not switched per platform
TikTok hero used trending audio → Reels variant uses same trending audio without Originality consideration. FAIL.

### CTA placement not switched
Hero had overlay CTA at 0:20-0:25 → variant inherits same overlay placement when research showed end-card dominance for the variant platform. FAIL.

---

## Soft Anti-Patterns (Critic Concerns, Not Auto-FAIL)

These don't fail the brief outright but pin to `done_with_concerns`:

- LOW_SAMPLE flag from research on the brief's hero platform — patterns directional, not strong
- Trend signals stale (>30d) — audio recommendations may have decayed
- Mechanics docs verified date approaching warn window — research refresh recommended within next 30 days
- Cold-start audience hint instead of ICP — voice grounding is directional
- Brand mode = company but no BRAND.md found — voice inferred from market norm

---

## Cross-Cutting Marketing-Stack Anti-Patterns

These patterns aren't tied to a single sub-critic — they apply to any short-form-brief output and any other marketing-stack artifact that produces user-facing prose. Enforced via `procedures/pre-dispatch.md` (auto-routing) + critic gate (where applicable).

### VN-market brief without vn-tone polish chain

**Problem:** `market = VN` resolved at Pre-Dispatch, but the polish chain bypasses `polish-vn` and ships the brief with `polish_chain_applied: none` or `polish_chain_applied: humanmaxxing`. Spoken-line section reads as Vietnamese-by-Google-Translate — particles missing, pronoun drift, idioms calqued from English, passive voice constructions.

**INSTEAD:** Pre-Dispatch (`procedures/pre-dispatch.md` § "VN auto-routing") enforces `polish-vn` for VN founder (spoken-line + full body) and VN company (full body). Auto-routing is the default; operator does not pick. If polish chain somehow ships as `none` for `market = VN`, critic Brand-fit flags as voice-mismatch FAIL and re-dispatches `copy-pack-agent` after re-running `polish-vn`.

### Polish chain skipped on critic FAIL (cycle 2)

**Problem:** Cycle 2 critic returns one residual FAIL; orchestrator ships `done_with_concerns` but ALSO skips the polish chain. Brief reads in raw model voice with concerns pinned — concerns are valid, prose is bad.

**INSTEAD:** Polish chain runs on `done_with_concerns` outputs same as `done` outputs. The concerns are about craft (hook archetype miss, vague action, audio mismatch) — polish doesn't fix craft, but it doesn't hurt either, and the brief still goes to a producer who needs readable prose. Polish chain ONLY skips under `--fast` (operator opted out of multi-pass) or `polish_chain_applied: none` per the (market, brand_mode) table in `procedures/dispatch-mechanics.md` § "Polish Chain."

### Multi-platform invocation — silent fan-out or silent drop

**Problem:** Operator invokes with `--platforms tiktok,reels,shorts,linkedin` (4 platforms). Skill quietly drops one, or fans out to all 4 without surfacing the cost+craft trade-off.

**INSTEAD:** Default is 1 hero + 2 variants (Critical Gate 2 soft default). Past that, Pre-Dispatch surfaces a cost+craft warning (each extra recut adds cost; critic attention per variant thins past 2) and offers the cheaper, higher-craft path — re-invoke so each platform gets its own hero brief with full critic verification. Operator opts in explicitly; never silently drop a platform or silently fan out.

### Cross-stack contract drift

**Problem:** Operator or maintainer adds a new frontmatter field or H2 section to the hero artifact without updating downstream consumers (currently human producers; potentially `evaluate-shortform` if it expands to score against briefs). Schema silently drifts; downstream parsers (if any exist or get built) break.

**INSTEAD:** Output Artifact Structure (frontmatter + 14 body sections) is the contract. Schema changes require atomic update of any consumer. For schema changes, also update `format-conventions.md` § "Frontmatter field order" and § "Body section headers (verbatim)" so the convention IS the contract. Flag to operator before changing.

### Production-mode-agent fed `mixed` without transition principle

**Problem:** `production_mode: mixed` (live-action + motion-graphic) requested but the production notes don't specify the transition principle (when does live cut to graphic, what's the visual rule, what's the audio handoff). Producer reads "mixed" and has to invent the transition logic on set or in post.

**INSTEAD:** When `production_mode: mixed` is resolved, production-mode-agent MUST emit a transition principle section (e.g., "Live-action establishes founder + product context 0:00–0:08; motion-graphic takes over for data viz 0:08–0:25; cut back to live for CTA 0:25–0:30. Audio bridges via beat-bed sustained across the cut."). Empty transition principle = production-mode-agent FAIL → re-dispatch.

### Variant cap creep without surfacing cost/craft

**Problem:** Operator argues "one more platform won't hurt" mid-conversation. Brief silently gets a 3rd or 4th variant with no cost or craft flag.

**INSTEAD:** Default is 1 hero + 2 variants (cost AND craft discipline — variants get TRUE RECUTS per `format-conventions.md` § "Variant 'What Changed From Hero' guard", and critic attention per variant thins past 2). Extending past the default is allowed but MUST surface the cost+craft trade-off; prefer re-invoke (each platform gets its own hero brief with full critic verification, not a tacked-on variant). Never extend silently.
