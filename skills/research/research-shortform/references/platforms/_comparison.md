# Cross-Platform Comparison

Diff table skeleton consumed by `synthesis-agent` to build the artifact's Cross-Platform Comparison section. Each row separates **cited mechanic** (universal facts about the platform) from **sample observation** (what the scout sample showed in this specific niche/market).

---

## Diff Table Skeleton

| Element | TikTok | Instagram Reels | YouTube Shorts | X video (opt-in) | LinkedIn video (opt-in) |
|---|---|---|---|---|---|
| **Aspect ratio** | 9:16 | 9:16 | 9:16 | 16:9 / 1:1 / 9:16 | 16:9 / 1:1 / 9:16 |
| **Length sweet spot (cited)** | 15-60s | 30-90s | 15-60s | 15-90s | <90s |
| **Length sweet spot (sample)** | from scout sample | from scout sample | from scout sample | from scout sample | from scout sample |
| **Hook window (cited)** | 1-2s | 3s drop-off zone | swipe-decision in 1-2s | 3-5s | 3s (65% retention determinacy) |
| **Audio rule dominant** | trending preferred | original preferred (Originality Score) | silent-friendly + loop | minimal music | none / minimal — speech primary |
| **Algorithm signal weighted** | completion (~70%) + saves | watch time + reshares | swipe-through + loop + shares | replies + reposts | comments + reshares |
| **Caption discovery weight** | medium (first 50-80 chars) | low (first 125 chars) | high (title carries weight) | high (tweet text alongside) | medium-high (first 200 chars) |
| **Hashtag count typical** | 3-5 | 3-5 | 1-3 | 1-3 (less weighted) | 3-5 (professional) |
| **CTA placement dominant** | overlay 0:20-0:25 | internal | end-card + pinned comment | reply-prompt in tweet | comment-prompt in caption |
| **Captions mandatory?** | yes | yes | yes | yes | yes (+29% engagement cited) |
| **Sound-off viewing %** | 85%+ | 85%+ | 85%+ | 85%+ | majority |
| **Watermark policy** | other-platform watermarks may downrank | TikTok watermark detected and downranked | tolerates | tolerates | feels off-platform — avoid |
| **Loop-friendly ending?** | not weighted | not weighted | yes — direct ranking signal | not applicable | not applicable |
| **Originality bias?** | internal | yes — platform leadership's Jan 2025 | tolerates remix | tolerates | tolerates |

---

## How synthesis-agent uses this

For each row in the artifact's Cross-Platform Comparison table:

1. Pull the **cited mechanic** from this reference (and the per-platform reference docs)
2. Pull the **sample observation** from `pattern-extractor`'s per-platform output
3. Mark each cell with its provenance: `(reference)` for cited, `(sample n=X)` for observed

Example artifact cell:
```
| Length sweet spot | 15-60s (reference) / 22-35s (sample n=12) |... |... |
```

---

## Per-Platform Quick Decision Frame

When advising the brief skill on which platform leads with which approach:

- **TikTok lead:** trending-audio brief, fast-cut storyboard, save-prompt CTA, founder or company mode
- **Reels lead:** original-audio brief, watch-time-optimized storyboard, reshare-prompt CTA, originality-first
- **Shorts lead:** loop-optimized storyboard, swipe-friendly hook, end-card CTA, cross-promo to long-form
- **X video lead:** founder/thought-leader content, native upload (not linked), reply-prompt CTA
- **LinkedIn video lead:** B2B professional register, <90s, burned-in captions, comment-prompt CTA

These quick frames inform the synthesis-agent's TL;DR and Recommendations sections.
