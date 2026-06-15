---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# X (Twitter) — publish-social platform ref

> Hard rules + algorithm signals + anti-patterns for formatting X drafts. Cross-references `references/_shared/platform-intelligence/x.md` (D13 canonical) for richer hook taxonomy + algorithm signals.

## Char Cap

- **Single post:** 280 chars hard limit
- **Thread:** unbounded number of posts, each ≤280 chars; thread split via `🧵` symbol or `1/N`, `2/N` numbering
- **Char counting:** URLs auto-collapsed to 23 chars in body counter; @mentions count fully

## Hashtags

- **Count:** 1-2 max per post. 3+ tagged as low-quality by algorithm.
- **Position:** inline OR end of post. Inline preferred for trending tags; end-of-post acceptable for category tags.

## Media

- **Image:** 16:9 (1200×675) preferred OR 1:1 (1200×1200); ≤5MB; JPG / PNG / GIF
- **Video:** up to 2:20 (140s) on free tier; up to 1080p; MP4 or MOV
- **Carousel:** up to 4 images per post

## CTA

- **Truncation point:** 280 chars (full visible — no truncation on X)
- **Position:** anywhere in body. For threads, CTA in last post (with `/end` or numbered as `N/N`).

## Thread Conventions

If write-social body exceeds 280 chars OR uses thread-marker syntax:

1. Split body into ≤280-char chunks at natural break points (sentence boundaries; never mid-word).
2. Number each chunk: `1/N`, `2/N`, ... `N/N` where N = total chunks.
3. CTA goes in the final post (N/N).
4. First post = hook; should land within first 140 chars to maximize reply-bait on truncated previews.

## Algorithm Signals (D13 platform-intelligence)

Cross-reference `references/_shared/platform-intelligence/x.md` for richer detail. Summary:

- **Replies > Likes for reach.** Threads that invite replies (open-ended question, controversial take, list with "which would you add?") outperform statement posts.
- **First 1-2 hours:** engagement velocity in the first hour determines algorithmic boost. Plan timing.
- **Link penalty:** posts with external links to non-X domains get reduced reach. Workaround: link in reply post, not main thread post.
- **Quote-tweets > retweets** for distribution weight.

## Anti-Patterns

- **Mass-tagging:** >3 @-mentions = shadowban risk. Hard cap at 3.
- **Hashtag stuffing:** >2 hashtags = quality-signal penalty.
- **Banned-word patterns (current):** algorithmic suppression has historically applied to: explicit anti-Musk content, certain political category words. Cross-check current spec on platform docs.
- **Cross-platform copy-paste:** posts that read as "obviously LinkedIn cross-posted" (3000-char wall, formal tone) underperform.
- **Engagement-bait:** "RT if you agree" / "follow for more" — explicitly penalized.

## Formatter Implementation Notes

- For X thread, frontmatter `char_count` = sum of all posts' chars.
- Each post's `### N/M` heading in the body section is metadata; the actual post body sits below the heading.
- If body is single-tweet (<280 chars), do NOT add thread markup.

## Scheduler Compatibility

- **Typefully:** native (preferred); supports threads natively via API draft route
- **Buffer:** yes; thread support via separate row per post (with `platform=twitter, scheduled_at=TBD+30s` increments)
- **Hootsuite:** yes; thread split via separate rows
- **Generic CSV:** yes
