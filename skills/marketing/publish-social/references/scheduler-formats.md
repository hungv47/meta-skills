# Scheduler Formats — publish-social

> 4 scheduler-import file schemas the formatter-agent emits. One per common scheduler family; operator picks based on their tool.

**Schema vintage:** verified against scheduler docs as of 2026-05-19. Each scheduler updates its import format periodically — verify against the current spec on first use; the generic CSV is hand-tunable.

---

## 1. Typefully JSON (`scheduler-imports/typefully.json`)

**Tool:** Typefully (typefully.com). Primarily X/Twitter; supports threads natively.

**Use:** paste-ready API draft body. When Route B runs (credentials present), the same file ALSO carries the API response (`draft_id` + `share_url`).

### Schema

#### Route A (export-mode — no API call ran)

```json
{
  "posts": [
    {
      "platform": "twitter",
      "body": "<full post body OR thread body with --- separators>",
      "threadify": true,
      "media": ["<media url or path>"],
      "tags": ["#hashtag1", "#hashtag2"]
    }
  ]
}
```

#### Route B (Typefully API ran — credentials detected)

```json
{
  "posts": [
    {
      "platform": "twitter",
      "body": "<full post body OR thread body with --- separators>",
      "threadify": true,
      "media": ["<media url or path>"],
      "tags": ["#hashtag1", "#hashtag2"]
    }
  ],
  "api_response": {
    "draft_id": "<typefully-returned-id>",
    "share_url": "https://typefully.com/t/<id>",
    "drafted_at": "<ISO-8601 timestamp>"
  }
}
```

### API Draft Endpoint

```
POST https://api.typefully.com/v1/drafts/
Authorization: X-API-KEY <your-key>
Content-Type: application/json

Body:
{
  "content": "<thread body or single tweet>",
  "threadify": true
}
```

On non-2xx response: roll back to Route A for X (drop `api_response` block from `typefully.json`); log error code (not key) in manifest.

### Validation Rules

- Valid JSON (parser-strict: no trailing commas, no unquoted keys)
- `posts[].body` ≤280 chars (single tweet) OR uses `---` separators for thread (each chunk ≤280)
- `posts[].platform == "twitter"` always (Typefully scope)
- If `api_response` present, `draft_id` and `share_url` both required
- UTF-8 encoding, no BOM

---

## 2. Buffer CSV (`scheduler-imports/buffer.csv`)

**Tool:** Buffer (buffer.com). Multi-platform scheduler. Industry-standard bulk import.

### Schema

```csv
platform,scheduled_at,body,media_url,tags,link
twitter,TBD,"Post body with, commas escaped",https://example.com/image.jpg,"#tag1 #tag2",https://example.com/link
linkedin,TBD,"LinkedIn body",,"","#tag1 #tag2",
instagram,TBD,"Instagram caption","https://example.com/img.jpg","#tag1 #tag2 #tag3",
```

### Column Definitions

| Column | Required? | Notes |
|---|---|---|
| `platform` | yes | One of: `twitter, linkedin, instagram, facebook` (Buffer's covered set; other platforms warn in README) |
| `scheduled_at` | no | ISO-8601 OR `TBD` (operator sets inside Buffer) |
| `body` | yes | Post body. If contains commas / quotes, wrap in double-quotes; escape internal quotes by doubling |
| `media_url` | no | Single URL or empty |
| `tags` | no | Space-separated hashtags within quotes |
| `link` | no | Single URL or empty |

### Validation Rules

- UTF-8 encoding, no BOM
- 6 columns in header row, exact match (case-sensitive)
- Body field properly escaped (RFC 4180)
- `platform` value in Buffer's supported set or row is omitted (with note in README that the platform isn't Buffer-native)
- One row per platform variant (X / LinkedIn / IG / FB only — Buffer does not support TikTok, YT, Threads, Bluesky, Reddit as of vintage date)

---

## 3. Hootsuite CSV (`scheduler-imports/hootsuite.csv`)

**Tool:** Hootsuite (hootsuite.com). Multi-platform; common in B2B / agency workflows. Bulk-import via "Bulk Composer" feature.

### Schema

```csv
Date,Time,Platform,Message,Link,Image,Approver
TBD,TBD,Twitter,"Post body","https://example.com/link","https://example.com/image.jpg",
TBD,TBD,LinkedIn,"LinkedIn body",,,
TBD,TBD,Instagram,"Instagram caption",,"https://example.com/img.jpg",
TBD,TBD,Facebook,"Facebook post","https://example.com/link","https://example.com/img.jpg",
TBD,TBD,YouTube,"YouTube description","https://example.com/video",,
```

### Column Definitions

| Column | Required? | Notes |
|---|---|---|
| `Date` | yes (or TBD) | Format: `YYYY-MM-DD` |
| `Time` | yes (or TBD) | Format: `HH:MM` (24-hour) |
| `Platform` | yes | One of: `Twitter, LinkedIn, Instagram, Facebook, YouTube` (Hootsuite's covered set) |
| `Message` | yes | Post body. Same escaping rules as Buffer CSV |
| `Link` | no | Single URL or empty |
| `Image` | no | Single URL or empty |
| `Approver` | no | Hootsuite user email — leave empty |

### Validation Rules

- UTF-8 encoding, no BOM
- 7 columns in header row, exact match (case + space-sensitive)
- Message field properly escaped (RFC 4180)
- Platform value in Hootsuite's supported set or row omitted (warn in README for unsupported)
- Date / Time `TBD` accepted at emit time; operator sets inside Hootsuite

---

## 4. Generic CSV (`scheduler-imports/generic.csv`)

**Tools (long-tail):** Hushuy, Later, Publer, Sprout Social, custom scheduler workflows. Hand-tunable.

### Schema

```csv
platform,datetime,body,media_urls,hashtags,link
x,TBD,"Post body","https://example.com/img.jpg","#tag1 #tag2",https://example.com/link
linkedin,TBD,"LinkedIn body","","#tag1 #tag2 #tag3",
instagram,TBD,"IG caption","https://example.com/img.jpg","#tag1 #tag2 ... up to 30","
youtube,TBD,"YT description","",#tag1 #tag2 #tag3",https://example.com/link
tiktok,TBD,"TT caption","https://example.com/video.mp4","#tag1 #tag2 #tag3",
facebook,TBD,"FB body","https://example.com/img.jpg","#tag1",https://example.com/link
bluesky,TBD,"Bluesky body","https://example.com/img.jpg","#tag1",https://example.com/link
threads,TBD,"Threads body","https://example.com/img.jpg","#tag1",https://example.com/link
reddit,TBD,"Reddit title || Reddit body","","",https://example.com/link
```

### Column Definitions

| Column | Required? | Notes |
|---|---|---|
| `platform` | yes | Full platform name lowercase: `x, linkedin, instagram, youtube, tiktok, facebook, bluesky, threads, reddit` |
| `datetime` | no | ISO-8601 OR `TBD` |
| `body` | yes | Post body. For Reddit, format: `<title> \|\| <body>` (use `\|\|` separator since Reddit has both fields) |
| `media_urls` | no | Comma-separated URLs (within outer field quotes) |
| `hashtags` | no | Space-separated hashtags within quotes |
| `link` | no | Single URL or empty |

### Validation Rules

- UTF-8 encoding, no BOM
- 6 columns in header row, exact match (lowercase)
- Body field properly escaped (RFC 4180)
- Reddit body uses `||` separator between title and body
- All 9 platforms represented if all 9 targeted (one row each)

### Hand-Tune Notes (in README)

- **Hushuy:** rename `datetime` → `publish_time`; otherwise compatible.
- **Later:** rename `datetime` → `scheduled_for`; add `caption_first_comment` column if using IG first-comment hashtag stack.
- **Publer:** compatible as-is; may need to split `media_urls` into per-media-type columns (image vs video).
- **Sprout Social:** uses XML, not CSV — generic CSV is a starting point only; operator converts.

---

## Cross-File Rules

1. **All 4 files always emitted** regardless of which scheduler the operator uses. README maps each scheduler to its file.
2. **`scheduled_at` / `Date` / `Time` / `datetime` left as `TBD` by default.** publish-social does not pick schedule times — operator does that inside their scheduler.
3. **Body field encoding** — RFC 4180 CSV escaping for Buffer / Hootsuite / generic; JSON-string encoding for Typefully.
4. **Media references** — schedulers don't pull from local file paths; if the produce-asset / produce-video manifest references local paths, the README notes the operator must upload media first OR host them and replace local paths with URLs.
5. **Platform name canonicalization** — Buffer uses `twitter`, Hootsuite uses `Twitter`, generic uses `x`. Each file uses its tool's convention.

## Validation Checklist (critic dim 5)

Before passing dim 5:

- [ ] `typefully.json` parses as JSON
- [ ] `buffer.csv` has 6 header columns, all rows have 6 fields (after RFC 4180 parse)
- [ ] `hootsuite.csv` has 7 header columns, all rows have 7 fields
- [ ] `generic.csv` has 6 header columns, all rows have 6 fields
- [ ] All 4 files are UTF-8 without BOM
- [ ] No file contains credential-like patterns (`_KEY` / `_TOKEN` / `_SECRET` / literal API key values)
