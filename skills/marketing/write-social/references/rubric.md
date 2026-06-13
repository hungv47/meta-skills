---
type: rubric
skill: write-social
version: "0.1"
date: 2026-05-09
status: active
---

# Social Copy Critic Rubric

5 dimensions × 0–10 = 50 total.
**Pass threshold:** ≥ 35 AND no individual dimension scores 0.
**Done with concerns:** 25–34 OR any individual dimension below 4.
**Fail:** < 25.

Each dimension is falsifiable. "Is the hook good?" is not a threshold. "Does the hook open with a Tier 1 archetype from the platform-intelligence Hook Taxonomy?" is.

---

## Dimension 1 — Hook Scroll-Stop Strength (0–10)

Scored against `references/_shared/platform-intelligence/[platform].md` §1 Hook Taxonomy.

| Score | Threshold |
|---|---|
| 8–10 | Hook matches a **Tier 1 archetype** from the platform-intelligence Hook Taxonomy AND the variant is specific and verifiable (concrete opening line that a human could identify as belonging to that archetype). Example: TikTok Callout Cliffhanger — opens with "POV:" frame + a withheld payoff in the first 70 chars. |
| 5–7 | Hook matches a **Tier 2 archetype** from the platform-intelligence Hook Taxonomy OR matches a Tier 1 archetype but with a weak or generic variant (archetype is technically present but execution is surface-level). Example: a contrarian claim that states the opposing position but doesn't name a specific cohort, number, or proof point. |
| 1–4 | Hook is generic or a category cliché with no match to a named Tier 1 or Tier 2 archetype. Examples: "Have you ever wondered…", "Here are 5 tips to…", "In this post I'll explain…", "Did you know that…" |
| 0 | No recognizable hook structure. Opening line could be the body of a press release, a product description, or a random sentence that creates no tension. |

**Archetype tiers are platform-specific.** Check the platform-intelligence file for the current platform, not a different one. TikTok's Callout Cliffhanger is a Tier 1 on TikTok; it may not exist as a category on LinkedIn.

**Novel-tension exception:** a hook may also score 5–10 if it demonstrates a clearly novel tension structure not in the catalog — describe the mechanism (what tension it creates and how) and score execution quality, not catalog membership.

---

## Dimension 2 — Char/Word Limit Compliance (0–10)

Hard limits per platform from `references/_shared/platform-intelligence/[platform].md` §2 Format Constraints. Soft caps = visible-before-truncation window.

| Score | Threshold |
|---|---|
| 10 | All copy elements (hook, body, CTA, hashtags) are within all **hard caps** AND within the platform's visible-before-truncation **soft cap** for the hook/CTA combo. |
| 7–9 | All copy elements within hard caps. Hook or CTA exceeds the soft visible-before-truncation window (reader must tap "...more" to reach the full hook or CTA) but total char count is platform-legal. |
| 1–6 | Exceeds soft caps meaningfully — the CTA is buried behind truncation AND the body gives no fold-peeking signal, OR body is so long that engagement-critical elements are unreachable on first impression. |
| 0 | Any element exceeds a hard cap (platform will reject the post or auto-truncate destructively). This is an auto-fail-equivalent. Format-checker-agent should have blocked this before critic sees it — if it reaches critic with a hard-cap violation, flag the format-check failure in the Change Log. |

**Per-platform hard caps (from platform-intelligence docs):**
- TikTok: 4,000 chars (caption). Soft: ~70–80 chars visible in feed before "...more".
- Reels: 2,200 chars (caption). Soft: ~125 chars visible in feed before "...more".
- Shorts: 5,000 chars (description). Soft: title (100 chars) is primary hook surface.
- X: 280 chars per tweet (non-Premium). Soft: same as hard cap for non-Premium.
- LinkedIn: ~3,000 chars (native post). Soft: ~140–210 chars visible before "...more" (2–3 lines, client-dependent).

---

## Dimension 3 — CTA Placement vs Algorithm Truncation (0–10)

Applies to platforms with documented line-truncation behavior: **X** and **LinkedIn**. For TikTok, Reels, Shorts: CTA is verbal-not-textual (delivered in the video, not dependent on caption position) → score **10 by default** and note "N/A — verbal CTA platform."

| Score | Threshold (X and LinkedIn) |
|---|---|
| 10 | CTA appears at or before the truncation point. Specifically: on X, within the first 280 chars (all non-Premium) or clearly above the fold; on LinkedIn, within the first 2–3 lines visible before "...more" (~140–210 chars depending on client). Body content before the CTA is complete — reader gets the full pitch before the ask. |
| 5–7 | CTA is below-fold but the body above the fold contains a "fold-peek" signal that teases the CTA — e.g., "Here's the one thing I'd change 👇" above fold, with the actual CTA below fold. Reader has reason to tap "...more". |
| 0–4 | CTA is buried below the truncation line with no fold-peeking signal. Reader must tap "...more" and then scroll to find the ask. For `goal=click`, this is a functional failure — reader never reaches the CTA. |

**N/A scoring rule:** For TikTok, Reels, Shorts, always score 10 and note "N/A — CTA placement is verbal, not textual, on this platform." Do NOT penalize these platforms for having a caption CTA that appears "late" in the caption — that is normal and expected.

---

## Dimension 4 — Pattern-Interruption Density (0–10)

Pattern interrupts: questions, mid-sentence pivots ("But here's what most people miss:"), format breaks (deliberate single-sentence paragraphs), internal drops ("If you're a [role]…"), contrarian beats ("Most people think X. They're wrong."), numbered list breaks.

**Count:** total interrupt events ÷ total caption char count × 100 = interrupts per 100 chars.

Calibrated per platform because TikTok audiences expect faster rhythm than LinkedIn:

| Score | TikTok | Reels/Shorts | X | LinkedIn |
|---|---|---|---|---|
| 8–10 | 3+ per 100 | 3+ per 100 | 2–3 per 100 | 1–2 per 100 |
| 5–7 | 2–2.9 per 100 | 2–2.9 per 100 | 1–1.9 per 100 | 0.5–0.9 per 100 |
| 1–4 | < 2 per 100 | < 2 per 100 | < 1 per 100 | < 0.5 per 100 |
| 0 | 0 interrupts | 0 interrupts | 0 interrupts | 0 interrupts |

**Over-density penalty (LinkedIn only):** >3 per 100 chars on LinkedIn reads as aggressive and signals low-quality content to the professional feed. Score 5–7 (not 8–10) for over-density on LinkedIn.

**Count targets are the heuristic floor, not the ceiling** — an unconventional rhythm that demonstrably serves the platform (state how) may score high even when it deviates from the table.

---

## Dimension 5 — Format Compliance (0–10)

Correct surface type AND adherence to format-specific constraints.

| Score | Threshold |
|---|---|
| 10 | Copy is in the correct format for the platform AND goal, AND all format-specific constraints are satisfied. Examples: X thread copy has a self-contained first tweet (hook standalone without needing tweet 2); LinkedIn carousel copy has slide 1 as a hook frame; TikTok/Reels/Shorts caption is written as a vertical-video caption (not a LinkedIn article excerpt). |
| 5–7 | Format is correct (right surface type) but a format-specific constraint is partially violated. Example: X thread first tweet is mostly self-contained but the punchline bleeds into tweet 2; LinkedIn carousel has a hook on slide 1 but the hook is identical to the caption first line with no visual differentiation spec. |
| 0 | Wrong format for goal. Hard fails: carousel content delivered as a thread; video caption written as a feed-post article (3+ paragraphs of prose with no caption compression); thread used when a single punchy post would convert better at `goal=click`; carousel deck when `goal=engagement` on a personal-founder account without carousel production capacity. |

**Format × platform reference:**

| Platform | Correct format for native copy |
|---|---|
| TikTok | Vertical-video caption: 1 hook line + 3–5 body lines + CTA + 3–5 hashtags |
| Reels | Same as TikTok. CTA = "Link in bio" or verbal; no external links in caption body |
| Shorts | Title (100-char hook) + description (SEO keyword-loaded body). Different from TikTok — title IS the hook |
| X (single post) | ≤280 chars. Hook + proof + CTA in one tweet OR first tweet of thread |
| X (thread) | Tweet 1 = self-contained hook. Tweet 2 = proof/expansion. Final tweet = CTA |
| LinkedIn (text post) | 2–3 hook lines (visible above fold) + 3–5 body paragraphs or list + CTA |
| LinkedIn (carousel) | Slide 1 = visual hook + hook text. Slide 2–N = body. Last slide = CTA |

---

## Pass Logic

```
total = D1 + D2 + D3 + D4 + D5

if total >= 35 AND no individual dimension == 0:
 verdict = pass

elif (total >= 25 AND total <= 34) OR any_dimension < 4:
 verdict = done_with_concerns

elif total < 25:
 verdict = fail
```

**Edge case — single zero:** If one dimension scores 0 and total is 40, verdict is `done_with_concerns` (not `pass`), because a zero on any dimension indicates a category failure regardless of overall score.

---

## Discrimination Test

On every critic run, the critic agent MUST verify that this rubric discriminates between strong and weak copy.

**Weak brief definition:** Generic copy with no archetype match, generic hook opener, no truncation awareness, no pattern interrupts, wrong format. Example: "Have you ever wondered how to grow your business? Here are 5 tips. Like this post if you found it helpful!"

**Test:**
- Weak brief estimated score MUST be < 25.
- Strong brief (the actual submission, if it passed format-check) MUST score ≥ 35 if it's genuinely strong.
- If BOTH score in the same zone (both pass or both fail), the rubric is under-calibrated. Flag: "RUBRIC INTEGRITY WARNING: discrimination test failed. Review Dimension [X] — threshold may not distinguish generic copy from platform-native copy."

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-05-09 | Initial version, 5 dimensions, locked from spec social-copy.md |
