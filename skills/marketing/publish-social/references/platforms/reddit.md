---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# Reddit — publish-social platform ref

> Hard rules + subreddit-specific rules + anti-patterns for Reddit posts. **Not backed by platform-intelligence catalog (D13)** — v1 template only. Reddit is special: it's a federation of communities, not a homogeneous platform.

## Char Cap

- **Title:** 300 chars hard limit
- **Body (self-post):** 40000 chars hard limit
- **Comment:** 10000 chars

## Hashtags

- **Reddit has NO hashtag system.** Subreddits play the role of categories. If formatter is asked to emit hashtags for Reddit, treat as ANTI-PATTERN — flag in critic dim 4.

## Media

- **Image:** up to 20MB; JPG / PNG / GIF
- **Video:** up to 1GB; up to 15 min; MP4
- **Gallery (carousel):** up to 20 images / videos per post in /r/* that allow galleries
- **Link post:** title + external URL (no body)

## CTA

- **Title is everything.** Title is the only guaranteed-visible component in subreddit feeds.
- **CTA placement:** in title OR first sentence of body. Most subreddits dislike overt CTAs in titles; subtle is better.
- **Self-promotion ratio:** most subreddits enforce a 10:1 (community content : self-promotion) ratio. Pure CTA posts get removed.

## Subreddit-Specific Rules

**Critical:** every subreddit has its own rules. Hardcoded rules in this ref are insufficient. Formatter must include in per-platform draft a "Subreddit rules check" section with placeholder for operator to verify before posting.

Common subreddit rules to flag:

- **No self-promotion** subreddits (many large subs): the post is removed if it links to operator's site.
- **Title format requirements:** `[Tag] Title` patterns (e.g., `[Discussion]`, `[Resource]`).
- **Required body length:** some subs require ≥X chars body for self-posts.
- **No external links** in body (text-only) subs.
- **Flair requirements:** post must have a flair set in some subs.

publish-social CANNOT verify subreddit rules programmatically without a Reddit API call (out of v1 scope). Per-platform draft includes a "Subreddit check" section listing the rules formatter is aware of from the write-social brief.

## Algorithm Signals

- **Upvotes within first 30-60 min** dictate algorithmic boost.
- **Comments matter more on Reddit than other platforms** (engagement signal).
- **Crossposting** (to other relevant subreddits) is encouraged + boosts reach.
- **AMA / Discussion / Question** formats outperform pure self-promotion.
- **No "viral coefficient" mechanic** — Reddit doesn't share posts to followers' feeds (no "follow" graph emphasis).

## Anti-Patterns

- **Hashtags in title or body:** Reddit doesn't use hashtags; flagged as low-effort cross-poster.
- **Engagement-bait titles:** "You won't BELIEVE what happened" — heavily downvoted; algorithm penalizes.
- **Overt self-promotion:** "Hey, check out my new product!" → removed in most subs.
- **Wrong subreddit:** posting product launch to /r/programming when /r/SideProject is correct → downvoted to oblivion.
- **Identical title across subreddits:** posts flagged as spam if cross-posted with same title (use minor variations).
- **TL;DR omission:** Reddit culture expects TL;DR for long posts.

## Formatter Implementation Notes

- Body field in generic CSV uses `||` separator: `<title> || <body>`.
- Per-platform draft emits `## Title` + `## Body` + `## Subreddit Targets` + `## Subreddit Rules Check` sections.
- If write-social artifact doesn't specify target subreddits, formatter flags NEEDS_CONTEXT.
- Hashtags in write-social Reddit variant = critic dim 4 auto-fail.

## Scheduler Compatibility

- **Buffer:** no native Reddit support
- **Hootsuite:** no native Reddit support
- **Typefully:** no
- **Generic CSV:** yes (limited utility — most Reddit posts done manually due to subreddit-specific rules)
- **Reddit-specific tools (DelayForReddit, /r/SchedulingReddit bots):** out of scope; operator manually posts most Reddit content

## v1 Limitations

Reddit is the most subreddit-specific platform; v1 ships template-only with subreddit-rules-check section. Future slice may add per-subreddit rule database OR Reddit API integration for live rule checks. Operator manual review is mandatory for Reddit publishing.
