# Format Conventions — publish-social

> Canonical schemas for the bundle the formatter-agent emits. Critic-agent validates every emitted file against the schemas here.

## Bundle Root

```
.forsvn/artifacts/mkt/published-social/[slug]/
├── manifest.md
├── platforms/
│   └── [platform].md             # one per target platform; 1-9 files
├── scheduler-imports/
│   ├── typefully.json
│   ├── buffer.csv
│   ├── hootsuite.csv
│   └── generic.csv
└── README.md
```

`[slug]` matches the upstream write-social artifact's slug (or operator-supplied override). Slug is kebab-case, lowercase, ≤50 chars.

## Manifest Schema (`manifest.md`)

### Frontmatter (12 fields, all required)

```yaml
---
skill: publish-social
version: "1.0.0"
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
slug: <kebab-case>
source_artifacts:
  write_social: <path to write-social artifact>
  produce_asset: <path | null>
  produce_video: <path | null>
target_platforms: [x, linkedin, ...]   # subset of 9
mode_per_platform:
  x: typefully-draft | export | blocked
  linkedin: export | blocked
  # ... one entry per platform in target_platforms
credentials_detected:
  typefully: true | false
  buffer: true | false
  hootsuite: true | false
  # one entry per credential probed; binary only, no values
scheduler_imports_emitted: [typefully.json, buffer.csv, hootsuite.csv, generic.csv]
bundle_file_count: <integer — total file count in bundle>
provenance:
  skill: publish-social
  run_date: YYYY-MM-DD
  input_artifacts:
    - <write-social path>
    - <produce-asset manifest path or omit if null>
    - <produce-video manifest path or omit if null>
    - brand/BRAND.md
  output_eval: null
---
```

### Body (5 sections, all required)

```markdown
## Mode Summary

- X: <Typefully draft URL or "export-mode (paste typefully.json)">
- LinkedIn: export-mode
- Instagram: export-mode
- ... (one bullet per target platform)

## Credentials Detected

- Typefully: YES | NO   (NEVER include the key value)
- Buffer: YES | NO
- Hootsuite: YES | NO
- ... (one bullet per credential probed)

## Bundle Files

- platforms/x.md
- platforms/linkedin.md
- ... (one bullet per per-platform draft)
- scheduler-imports/typefully.json
- scheduler-imports/buffer.csv
- scheduler-imports/hootsuite.csv
- scheduler-imports/generic.csv
- README.md

## Next Step

<one-paragraph instruction; Route A or Route B narrative from SKILL.md § Next Step>

## Verification Checklist

- [ ] X published / drafted
- [ ] LinkedIn published / drafted
- [ ] ... (one checkbox per target platform)
- [ ] Scheduler-import file pasted into chosen scheduler (if applicable)
- [ ] Schedule set inside scheduler
- [ ] Operator review: every post lands on schedule + on brief
```

## Per-Platform Draft Schema (`platforms/[platform].md`)

### Frontmatter (7 fields, all required)

```yaml
---
skill: publish-social
version: "1.0.0"
date: YYYY-MM-DD
platform: x | linkedin | instagram | youtube | tiktok | facebook | bluesky | threads | reddit
char_count: <integer — total chars of body; for X thread, sum across posts>
media_refs:
  - <path to produce-asset slot OR produce-video shot OR "MEDIA REQUIRED" placeholder>
mode: typefully-draft | export | blocked
---
```

### Body (varies by platform)

Every per-platform draft includes these sections:

1. **`## Body`** — the actual post copy as it should appear on the platform. For X thread, posts numbered `1/N`, `2/N`, etc. with separator.
2. **`## Hashtags`** — hashtag list (or "none" for Reddit). For IG, indicates whether stack goes in caption or first comment.
3. **`## CTA`** — quoted CTA copy + position note (e.g., "at char 95 — before LinkedIn's ~210 truncation point").
4. **`## Media`** — list of media references with path + cross-check against platform spec (aspect, size); OR "MEDIA REQUIRED — operator must attach" placeholder.
5. **`## Notes`** — platform-specific notes (e.g., "X thread; post separately or via Typefully thread-up", "LinkedIn double-newline = paragraph break").

For X specifically, if body is a thread:

```markdown
## Body (Thread)

### 1/N
<post 1 body, ≤280 chars>

### 2/N
<post 2 body, ≤280 chars>

### N/N (CTA post)
<final post with CTA, ≤280 chars>
```

## README Schema (`README.md`)

### Sections

```markdown
# Published-Social Bundle — [slug]

Mode summary: <one-line — pulled from manifest>

## How to publish each platform

### X
<Route A or Route B instructions>

### LinkedIn
<instructions>

### Instagram
<instructions>

... (one section per target platform)

## Scheduler-import file map

| Scheduler | File | Notes |
|---|---|---|
| Typefully | scheduler-imports/typefully.json | X-only; other platforms ignored |
| Buffer | scheduler-imports/buffer.csv | All platforms; set `scheduled_at` inside Buffer |
| Hootsuite | scheduler-imports/hootsuite.csv | All platforms; set Date + Time inside Hootsuite |
| Hushuy / Later / Publer / Sprout | scheduler-imports/generic.csv | Hand-tune per scheduler's import spec |

## Configuring credentials for next run

<one-paragraph instruction; references `references/platform-credentials.md`>
```

## Scheduler-Import Files

Schemas live in [`scheduler-formats.md`](scheduler-formats.md). Each scheduler-import file is emitted in addition to per-platform drafts — operator picks one based on their scheduler tool.

## Frontmatter Validation Rules

- All required fields present (12 on manifest, 7 on per-platform draft).
- `date` matches `YYYY-MM-DD` format.
- `slug` is kebab-case, lowercase, ≤50 chars.
- `target_platforms` is a non-empty subset of the 9 supported platforms.
- `mode_per_platform` keys exactly match `target_platforms`.
- `credentials_detected` values are booleans only — never strings or token-like values.
- `provenance.input_artifacts` lists at least the write-social path + brand/BRAND.md. produce-asset / produce-video paths included if provided.
- `provenance.output_eval: null` always at emit time.

## Schema Change Discipline

This contract is consumed by:
- Operator manual review (Mode Summary + Verification Checklist)
- Future `evaluate-content` skill (reads `provenance.input_artifacts` to ground scoring)
- Future `evaluate-campaign` skill (aggregates across multiple publish-social bundles)

Schema changes (add/remove/rename fields) require atomic update across upstream callers (write-social, produce-asset, produce-video) and downstream consumers (evaluate-content when it lands). Never silently drift.
