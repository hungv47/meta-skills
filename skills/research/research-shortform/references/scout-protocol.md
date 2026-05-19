# Scout Protocol

Operational guide for `platform-scout-agent`. Per-platform query patterns, capture rules, and fallback logic when results are thin.

---

## Tools Used

- **WebSearch** — primary discovery
- **WebFetch** — per-URL capture (caption, observable metrics, opening 1-3s description from page meta)

No platform APIs. The skill is portable across users without API key setup.

---

## Per-Platform Query Patterns

### TikTok

Primary queries (run in order, stop early at strong signal):

1. `"<topic>" site:tiktok.com 2026`
2. `"<topic>" tiktok viral <market_term>` (e.g., `"async standup" tiktok viral vietnam`)
3. `<topic> tiktok hook` (English market) / `<topic> tiktok móc` (VN market)
4. `<topic> tiktok creator <year>`

Synonym swaps if first 3 return thin:
- Replace topic noun with a buyer-language phrase from `audience_hint` or ICP
- Try the contrarian framing: `<topic> tiktok stop doing` / `<topic> tiktok wrong`

Stop conditions:
- n ≥ 8 entries with observable metrics → STOP
- After 3 query attempts, n < 3 → declare INSUFFICIENT_DATA

### Instagram Reels

1. `"<topic>" instagram reels site:instagram.com 2026`
2. `<topic> reels viral <market_term>`
3. `<topic> instagram reel hook tutorial`

Reels-specific notes: Instagram public-page metrics are thinner than TikTok. View count is sometimes visible on the post page; like count is. Comment count visible. Saves not visible publicly.

### YouTube Shorts

1. `"<topic>" "shorts" site:youtube.com 2026`
2. `<topic> youtube shorts viral`
3. `<topic> shorts <market_term>`

internal notes: YouTube has the richest public metrics — views and likes always visible on the watch page. Comments visible.

### X video (opt-in)

1. `<topic> twitter video viral 2026`
2. `<topic> x video creator`
3. `<topic> twitter clip <market_term>`

X-specific notes: X video discovery is harder than TikTok/Reels because the platform doesn't have a dedicated video tab in search. Use `filter:videos` parameter where supported.

### LinkedIn video (opt-in)

1. `<topic> linkedin video professional 2026`
2. `<topic> linkedin native video <market_term>`
3. `<topic> linkedin viral b2b`

LinkedIn-specific notes: LinkedIn search is heavily personalized — public discovery often requires reading creator-published case studies or third-party trend pieces that link to LinkedIn videos.

---

## Per-URL Capture Procedure

For each candidate URL, capture the following fields (write `metric_unobserved: true` for any not visible):

| Field | How to capture | Notes |
|---|---|---|
| `url` | full URL with query params | preserve `?si=` and tracking params — they're canonical |
| `creator` | @handle from page header | strip URL prefix |
| `publish_date` | from page metadata | ISO 8601 |
| `views` | from public metrics | not always visible on Reels |
| `likes` | from public metrics | usually visible everywhere |
| `shares` | from public metrics | TikTok / X most reliable |
| `comments` | from public metrics | usually visible |
| `saves` | from public metrics | TikTok and Reels only; sometimes hidden |
| `opening_1_3s.visual` | description of first frame | what's in frame, framing, lighting, action |
| `opening_1_3s.verbal` | first spoken line if any | exact quote, ≤8 words usually |
| `opening_1_3s.text_overlay` | first text on screen | exact text, position |
| `audio` | track name + ID, or "original audio", or "silent" | TikTok displays track row below caption |
| `caption.text` | first 300 chars of caption | preserve emoji and line breaks |
| `caption.hashtags` | hashtag list | extract from caption |
| `caption.length_chars` | int | count |
| `cta_placement` | overlay frame timing / caption embed / end-card / none | observed from video |
| `video_length_sec` | int | observed |
| `why_kept` | one-sentence reason | what makes this entry signal |

**WebFetch limitations:**
- Some platforms (Reels especially) load metrics client-side; meta page may show them, page itself may not.
- If WebFetch fails, fall back to WebSearch result snippets which often contain partial data.
- If WebFetch returns a login wall, the URL is not publicly indexable — drop the entry.

---

## Sampling Discipline

**Target:** n=8-15 per platform.

**Floor:** n=3 (below which → INSUFFICIENT_DATA).

**Cap:** n=15 (above which → diminishing returns; stop and move to next platform).

**Filter rules:**
- Drop entries older than 90 days unless they're the only signal in this niche
- Drop entries with all metrics `metric_unobserved` AND no engagement signals visible
- Keep entries that match audience hint even if metrics are partial
- Apply `competitor_seeds` first as priority URLs (capture before searching)

---

## Fallback Logic

If after 3 query attempts the platform returns < 3 entries:

1. Try 1 broader-noun query (drop the topic specificity)
2. Try 1 query in the alternate language for the market
3. If still < 3, declare `SAMPLE: INSUFFICIENT_DATA` and output observed examples only

Do NOT pad with weak entries to hit n=8. Honest INSUFFICIENT_DATA beats inflated OK.

---

## Search Log Discipline

Every query attempted must be logged in the agent's output:

```
## Search Log
- Query 1: "[exact query string]" — N results, M kept
- Query 2: "[exact query string]" — N results, M kept
```

The search log is what `pattern-extractor` and `critic` use to validate breadth. It's also what enables re-runs to skip redundant queries.
