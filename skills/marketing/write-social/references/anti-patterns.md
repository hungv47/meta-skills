---
type: anti-patterns
skill: write-social
version: "0.1"
date: 2026-05-09
status: active
---

# Social Copy Anti-Patterns

Full detection-rule library for `critic-agent.md`. 14 patterns (10 craft anti-patterns + 4 cross-cutting failures appended in v0.2). Each entry: name, detection rule (falsifiable — a critic agent can run this check on any copy without human judgment), platform calibration where relevant, agent ownership (orchestrator vs critic-agent vs format-checker-agent).

---

## 1. Generic Hook Opener

**Definition:** Hook uses a phrasing pattern with no archetype match to any Tier 1 or Tier 2 archetype in the platform-intelligence Hook Taxonomy.

**Detection rule:** If the hook's first 15 words include any of: "Have you ever…", "Did you know…", "In this post/video I'll…", "I'm going to show you…", "Today I want to talk about…", "Here are [N] tips…", or "[Adjective] things about [topic]" — flag as Generic Hook Opener.

**Platform calibration:** Universal across tiktok, reels, shorts, x, linkedin. No platform rewards these patterns; all platform-intelligence files document them as Tier 0 (unranked / anti-archetype).

**Why it fails:** These phrases have been used on every platform for years. The algorithm has no differentiated signal to act on; the viewer's brain has learned to skip them. They match no archetype because they contain no tension, no specificity, and no platform-native grammar.

---

## 2. Algorithm-Blind CTA

**Definition:** Call-to-action placed below the platform's algorithm truncation line on a platform with a documented truncation point (X, LinkedIn), making it unreachable for readers who don't expand the post.

**Detection rule:** For X and LinkedIn: identify the line/char position of the CTA in the copy. Check against the platform's truncation point from `references/_shared/platform-intelligence/[platform].md` §2 Format Constraints:
- X: truncation at 280 chars (non-Premium). CTA after char 280 without a fold-peek signal = TRIGGERED.
- LinkedIn: truncation at ~line 3 (~140–210 chars mobile). CTA after line 3 without a fold-peek signal ("👇", "Here's how:", numbered tease) = TRIGGERED.

**Platform calibration:** TikTok, Reels, Shorts: NOT APPLICABLE. CTA is verbal (delivered in the video). Caption CTA placement on these platforms is not a truncation-line concern.

**Why it fails:** If the reader never reaches the CTA, the goal fails regardless of how good the hook is. For `goal=click`, this is a conversion zero.

---

## 3. Format Mismatch

**Definition:** Copy is written in a format that doesn't match the declared surface — e.g., carousel content formatted as a thread, or a long-form article draft placed into a native short-form post slot.

**Detection rule:**
- If `platform=x` AND copy contains numbered points like "1/" or tweet-separator markers AND the format spec says "single post" = TRIGGERED (thread content in single-post slot).
- If `platform=linkedin` AND format spec says "carousel" AND copy body is a continuous prose paragraph (no slide demarcation, no "Slide 1:" markers) = TRIGGERED.
- If `platform=tiktok|reels|shorts` AND copy body is structured as a multi-section article with headings (##, **Section Title**) = TRIGGERED (blog content in vertical-video caption slot).
- If any format spec declares a surface that doesn't exist on that platform (e.g., "thread" on TikTok; "carousel" on Shorts) = TRIGGERED.

**Platform calibration:** Every platform. The mismatch type differs per surface.

**Why it fails:** Format mismatch breaks the viewer's expectations and can cause the post to underperform regardless of copy quality. A LinkedIn carousel formatted as a plain text post will never be distributed as a carousel.

---

## 4. Char-Limit-Blind Copy

**Definition:** Copy is written without awareness of the platform's visible-before-truncation window, resulting in a hook that requires the reader to expand before the tension is clear, or a body so long it buries the CTA.

**Detection rule:** Count chars in the hook line. If hook char count exceeds the platform's soft visible-window limit from `references/_shared/platform-intelligence/[platform].md` §2 and there is no fold-peek signal in the visible window = TRIGGERED.
- TikTok/Reels soft window: ~70–80 chars. Hook > 80 chars with no tension in first 70 = TRIGGERED.
- LinkedIn soft window: ~140–210 chars (2–3 lines). If the hook + first line of body do not create a reason to expand within ~200 chars = TRIGGERED.
- X: hard cap = soft cap (280 chars non-Premium). Over 280 = TRIGGERED.

**Platform calibration:** All 5 platforms. Severity varies: X is a hard block (post will be rejected or truncated); TikTok/LinkedIn are soft (post publishes but underperforms).

**Why it fails:** The reader makes the decision to expand or scroll in <1 second. If the tension hasn't landed in the visible window, the expand decision won't be made.

---

## 5. Brand-Voice Ignored

**Definition:** Copy uses a voice register inconsistent with the declared `brand_mode` — corporate cliché when `brand_mode=founder`, or informal diary voice when `brand_mode=company`.

**Detection rule:**
- `brand_mode=founder`: check for 3+ of the following signals in body copy → corporate-passive constructions ("It has been determined that…"), third-person brand references ("Our company believes…"), filler mission statements ("We are committed to…"), buzzword stacking (3+ jargon terms in a row: "innovative, scalable, best-in-class"). If 3+ signals present = TRIGGERED.
- `brand_mode=company`: check for 3+ of the following → first-person singular "I" used for the brand voice (not in testimonials), colloquial abbreviations that conflict with stated brand register, confessional or vulnerability narrative framing inconsistent with brand archetype.

**Platform calibration:** Universal. LinkedIn is highest-stakes because the audience has high sensitivity to founder-vs-brand voice inconsistency. TikTok is somewhat more forgiving for informal register if it's intentional.

**Why it fails:** Brand-voice inconsistency erodes trust faster on social than on any other surface because the audience is making a judgment about the person or brand behind the post in the first 3 seconds.

---

## 6. Pattern-Interrupt Monotony

**Definition:** The same type of pattern interrupt is repeated 3+ times consecutively, creating a rhythm that reads as formulaic rather than dynamic.

**Detection rule:** Identify interrupt type for each interrupt in the body copy:
- Q = question
- P = pivot ("But here's…", "What nobody talks about is…")
- F = format break (single-sentence line followed by blank line)
- N = internal drop ("If you're a [role]…")
- C = contrarian beat ("Most people think X. Wrong.")

If the same type appears 3 times in a row (e.g., Q Q Q or F F F F) = TRIGGERED.

**Platform calibration:** LinkedIn is most sensitive to this — three consecutive question hooks read as a fill-in-the-blank template. TikTok is slightly more tolerant of rhythmic repetition if the cadence is intentional (e.g., a fast "you think this? no. you think this? no. actually:…" pattern). But even on TikTok, 3 identical format breaks in 150 chars is formulaic.

**Why it fails:** Pattern interrupts work because they're unexpected. When the same interrupt type repeats, it becomes the expected pattern — and then it's not an interrupt anymore.

---

## 7. Pasted-From-Blog Body

**Definition:** Long-form prose dropped into a short-form surface without compression — identifiable by paragraph length and sentence structure inconsistent with the platform's native post format.

**Detection rule:** If the body (excluding hook and CTA) has:
- Average sentence length > 20 words AND
- No visual breaks (line breaks between sentences, numbered lists, em-dashes mid-sentence, questions) in a 200+ char section

= TRIGGERED.

Secondary signal: any word or phrase from a SEO-style content format that has no place in social copy ("In conclusion,", "To summarize,", "Furthermore,", "It is worth noting that,").

**Platform calibration:** Most severe on TikTok, Reels, Shorts (vertical video captions must be extremely compressed). Moderate on X (tweet-grammar enforces brevity on non-Premium). Less severe on LinkedIn long-form, but still triggered if the post reads like a blog article and not a native LinkedIn post.

**Why it fails:** Blog prose fails the scroll-stop test in every subsequent sentence. The platform algorithm reads dwell time and completion — if the body reads like homework, viewers scroll.

---

## 8. Engagement-Bait CTA (Platform: TikTok, Reels, LinkedIn)

**Definition:** CTA uses explicit bait phrasing that platform algorithms are documented to penalize: "Like this post if you agree," "Comment YES if you want part 2," "Share to win," "Follow for more."

**Detection rule:** CTA contains any of:
- "like if you" / "like this if"
- "comment [single word]" (e.g., "comment YES", "comment DONE")
- "share to win" / "share for a chance to"
- "follow for" / "subscribe for" as the primary CTA (not contextual)

= TRIGGERED for TikTok, Reels, LinkedIn. (X has no documented engagement-bait penalty as of 2026, but flag as advisory.)

**Platform calibration:** TikTok and LinkedIn have documented distribution penalties for engagement-bait. Reels is similar (Meta's policy on inauthentic engagement). X is advisory only — no confirmed penalty, but the CTA pattern still underperforms.

**Why it fails:** Platform algorithms detect and deprioritize explicit engagement-bait as "fake engagement" per TikTok's FYF Standards (documented in platform-intelligence/tiktok.md §4).

---

## 9. External Link in Post Body Without Fold Cover (Platform: X, LinkedIn)

**Definition:** An external URL is placed in the main post body (not in a reply or first comment) without any compensating technique, where the platform is documented to suppress reach for posts with early external links.

**Detection rule:**
- For X: if the post body (tweet 1 of a thread or single tweet) contains a raw URL = TRIGGERED. Platform-documented: X algorithm suppresses reach for posts with outbound links (Pattern basis: internal research synthesis.
- For LinkedIn: if a raw URL appears in the first 3 lines (above fold) of a native post = TRIGGERED. LinkedIn's algorithm penalizes outbound links in-post; first-comment link strategy is preferred.

**Platform calibration:** X and LinkedIn only. TikTok, Reels, Shorts: link in bio is the convention; caption links are not clickable and not penalized.

**Why it fails:** Platform algorithms are documented to suppress posts that try to take users off-platform via an early in-post link. Reach drops, engagement drops, distribution is throttled to followers-only.

---

## 10. Hook–Body Disconnect

**Definition:** The hook creates a specific expectation (promises a reveal, names a cohort, states a contrarian claim) but the body delivers a generic response that doesn't fulfill the hook's promise.

**Detection rule:** Parse the hook's explicit or implicit promise:
- Contrarian claim hook → body must present the contrarian argument with proof
- Cliffhanger/curiosity-gap hook → body must deliver the reveal
- internal callout ("If you're a [role]…") → body must address that cohort's specific situation

If the body is generic (applicable to any reader, not specifically the cohort called out, or doesn't deliver the promised reveal) AND the hook made a specific promise = TRIGGERED.

**Platform calibration:** Universal. Most severe on X (where the hook and body are visible together in a thread) and LinkedIn (where sophisticated audience detects bait-and-switch immediately). TikTok is somewhat more forgiving because the visual can carry the resolution even if the caption doesn't.

**Why it fails:** A hook that promises something and doesn't deliver kills trust and follow-through. Even if the reader taps "...more," they won't take the CTA action if the body felt like a lie.

---

---

## 11. Polish Chain Routed on FORMAT_FAIL or FAIL Artifact

**Definition:** Orchestrator invokes `humanmaxxing` or `polish-vn` as a terminal pass on an artifact that critic returned as `fail` OR that format-checker returned as FORMAT_FAIL. Polish skills don't fix critic-fail issues (generic hook, format mismatch) or format-fail issues (hard-cap violation that copywriter couldn't resolve in one revision cycle).

**Detection rule:** If `polish_chain_applied != none` in frontmatter AND (`critic_verdict == fail` OR `status == blocked` from FORMAT_FAIL) = TRIGGERED.

**Owned by:** Orchestrator (`dispatch-mechanics.md` § "Polish chain handoff"). Polish chain runs ONLY after PASS or DONE_WITH_CONCERNS.

**Why it fails:** Polishing a critic-failed copy doesn't fix the underlying issue. The polish skill will rewrite Body + CTA but Hook variants stay (per polish-chain contract — preserves A/B comparability), and the failing dimension (typically Hook scroll-stop or Format compliance) won't improve. Operator wastes a polish-skill invocation on copy that needs a copywriter re-run, not a register polish.

---

## 12. Multi-Platform in One Invocation

**Definition:** Operator requests social-copy for multiple platforms in a single run (e.g., `/write-social "fire the agency" tiktok+linkedin --variants 2`) or orchestrator silently generates copy for >1 platform.

**Detection rule:** If `platform` frontmatter contains a `+` or `,` or list value (anything other than a single value from `tiktok | reels | shorts | x | linkedin`) = TRIGGERED.

**Owned by:** Orchestrator (`pre-dispatch.md` § "social-copy Pre-Dispatch shape" — single-platform per invocation). Multi-platform = re-invoke per platform.

**Why it fails:** Tier 1 hook archetypes are platform-specific (TikTok's POV Callout Cliffhanger doesn't exist on LinkedIn; LinkedIn's pattern-interrupt expectation is 1–2/100 vs TikTok's 3+/100). A single artifact that tries to cover multiple platforms produces compromise copy that's optimal for none. Per-platform reference catalogs at `_shared/platform-intelligence/[platform].md` are scoped to single-platform consumption by design.

---

## 13. Vietnamese-Market Copy Without vn-tone Polish

**Definition:** Brief or topic explicitly targets the Vietnamese market (Vietnamese-language copy required) but `polish_chain_applied: none` in frontmatter — vn-tone terminal pass was skipped.

**Detection rule:** If brief / topic mentions Vietnam, Vietnamese, VN, or supplies Vietnamese-language source text AND `polish_chain_applied != vn-tone` = TRIGGERED.

**Owned by:** Pre-Dispatch (`pre-dispatch.md` should default `--polish-chain vn-tone` when market signal is Vietnamese). Orchestrator confirms at Cold Start / Warm Start.

**Why it fails:** Vietnamese register polish requires native-register awareness (báo chí for news/professional, semi-casual for B2B SaaS founder voice, bro for indie/casual, pop-marketing for consumer brands). Copywriter-agent generates English-pattern Vietnamese that reads as translated AI output — pronoun drift, missing particles, literal idioms, passive-voice calques. vn-tone is the terminal fix.

---

## 14. Cross-Stack Contract Drift

**Definition:** Refactor or schema change to the artifact frontmatter or required body sections (Hook variants A/B + Body + CTA + Format spec + Critic verdict + Anti-patterns triggered) ships without atomic update of downstream consumers (humanmaxxing / vn-tone / eval-loop / operator publish workflow).

**Detection rule:** If a code review or diff modifies `format-conventions.md` § "Frontmatter schema" OR § "Required body sections" OR § "Critic verdict table" without a paired update to:
- `humanmaxxing` skill's body-section reader (reads `## Body` + `## CTA`)
- `polish-vn` skill's body-section reader + register hook check
- `scripts/manifest-sync.ts` artifact-type classifier (if `type` field changes)
- `run-pipeline` results.tsv ingestion (if `critic_score` or `critic_verdict` field semantics change)

= TRIGGERED.

**Owned by:** Refactor program — guardrail enforced at PR review time (rule: "artifacts ↔ evals contract is sacred"; schema changes require atomic update in the same commit). The umbrella `agent-skills` repo's refactor protocol documents the full rule; this catalog row is the per-skill instance.

**Why it fails:** Polish-chain skills silently fail (rewrite wrong sections, skip required updates) when frontmatter or body schema drifts. eval-loop ledger ingests stale or malformed scores. Operator publish workflow breaks parse on missing or renamed sections. The cascade is invisible until someone notices a polish run produced an empty or duplicated artifact — by which point multiple downstream artifacts are corrupted.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-05-09 | Initial version, 10 anti-patterns from spec + expansion |
| 0.2 | 2026-05-18 | Added 4 cross-cutting failures (#11 polish-chain on FAIL; #12 multi-platform; #13 VN without vn-tone; #14 contract drift). Refactor program v6 Phase 2 Wave 1 — marketing-stack slot 1. |
