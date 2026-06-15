---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# LinkedIn — publish-social platform ref

> Hard rules + algorithm signals + anti-patterns for formatting LinkedIn drafts. Cross-references `references/_shared/platform-intelligence/linkedin.md` (D13 canonical).

## Char Cap

- **Post body:** 3000 chars hard limit
- **Comment body:** 1250 chars
- **Article body:** 110000 chars (LinkedIn Article, not native post — out of v1 scope)

## Hashtags

- **Count:** 3-5 max. 1-2 underperforms; 6+ flagged as low-quality.
- **Position:** end of post.
- **Specificity:** mix of broad (#leadership, #marketing) + niche (#b2bsaas, #productledgrowth) outperforms all-broad.

## Media

- **Image:** 1.91:1 (1200×627) for link preview; 1:1 (1200×1200) for square image; ≤8MB; JPG / PNG
- **Document (carousel-equivalent):** PDF up to 10 pages, recommended 1080×1080 per slide
- **Video:** up to 10 min; 1080p; MP4 (preferred) or MOV
- **No native carousel** — use document-PDF for swipe-able content

## CTA

- **Truncation point:** ~210 chars before "see more" cutoff on mobile feed
- **Position:** CTA must lie within first 210 chars OR be the entire post body if short
- **First-line punch:** first line is the hook; bolded by algorithm in preview

## Line-Break Convention

LinkedIn renders line breaks literally; use them for visual rhythm:

- Single newline = soft break within paragraph (rare; use sparingly)
- Double newline = paragraph break
- "Wall-of-text" without breaks underperforms vs visually-paragraphed posts at same word count

## Algorithm Signals (D13 platform-intelligence)

Cross-reference `references/_shared/platform-intelligence/linkedin.md`. Summary:

- **Dwell time** is the dominant ranking signal. Long-form posts that hold attention beat short clever ones.
- **Comments > Likes.** Reply-bait questions in the last paragraph drive comment engagement.
- **External links penalized.** Same as X. Workaround: post the link in the first comment, not the body.
- **Document posts** (PDF carousel) currently boosted by algorithm — high-impression format.
- **First 60 min:** "golden window" — engagement velocity dictates downstream reach.

## Anti-Patterns

- **"Broetry"** formatting (one-line-per-paragraph stretched to 30 lines): now algorithmically penalized; was popular 2019-2021.
- **Engagement-bait:** "Agree? Comment YES" / "Tag someone who needs to see this" — explicitly penalized.
- **Pure self-promotion:** posts that are "I just launched X" without value-add underperform; pair with insight/learning.
- **External links in body:** reach cut 30-50%; use first-comment workaround.
- **Polls without context:** standalone polls underperform polls-with-takeaway-paragraph.
- **Cross-platform copy-paste from X:** 280-char post on LinkedIn screams "I copy-pasted"; underperforms.

## Formatter Implementation Notes

- Preserve double-newline paragraph breaks from write-social body.
- If body has X-thread markup, strip it (LinkedIn doesn't thread).
- If body has hashtags inline, move them to end-of-post hashtag stack.
- Cross-check CTA position vs 210-char truncation; flag if CTA past truncation.

## Scheduler Compatibility

- **Buffer:** yes (LinkedIn-native)
- **Hootsuite:** yes (LinkedIn-native)
- **Typefully:** no — Typefully is X-only
- **Generic CSV:** yes
