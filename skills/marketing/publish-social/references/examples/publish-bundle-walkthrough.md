---
title: Publish Bundle Walkthrough (Route A export, 3 platforms, ledger write)
lifecycle: canonical
status: stable
produced_by: publish-social
load_class: EXAMPLE
---

# Worked Example — write-social copy → publishing bundle → export ledger rows

A faithful end-to-end run of the **default mode** (auto-detect → export — no live posting). All copy and paths are **illustrative synthetic data** promoting FORSVN — not a real account. The point is the exact shape: pre-dispatch validation, the formatter→critic flow, the produced bundle (manifest + per-platform drafts + the four scheduler-import files), the `exported` ledger rows, and the completion status. The `--mode=publish` two-stage gate is noted at the end without posting anything live.

## 1. Operator invocation + inputs

```
/publish-social local-first-capture
```

Inputs it consumes (all illustrative):

- **Source write-social artifact:** `docs/forsvn/artifacts/marketing/write-social/local-first-capture-2026-06-10-quiet-capture.md` — frontmatter `id: write-social-local-first-capture`; carries per-platform bodies, hook ("Your best work happens before you remember to log it"), CTA ("14-day local trial — no account, no cloud"), hashtag sets, and a media ref.
- **`brand/BRAND.md`** — voice (calm, technical, anti-hype), sacred elements (Forest Shadow `#0A120D` canvas, Leaf `#74B36B` accent; Signal Lime retired — never reintroduced).
- **produce-asset manifest:** `docs/forsvn/artifacts/marketing/produce-asset/local-first-capture-2026-06-10-hero.md` — one 1:1 hero slot (`slots/hero-1x1.png`, 1200×1200).
- **Credentials state:** none configured (`.forsvn/credentials/platforms.json` absent).
- **Target platforms:** inherited from write-social → `x`, `linkedin`, `instagram` (a 3-platform subset of the 9 supported).

## 2. Pre-dispatch validation

Hard-blocks run before formatting (`references/procedures/pre-dispatch.md` + Critical Gates):

- write-social artifact present + readable → **pass** (else `NEEDS_CONTEXT` → `/write-social`).
- `brand/BRAND.md` present → **pass** (else `NEEDS_CONTEXT` → `/create-brand`).
- `target_platforms` derivable from write-social → **pass** (x, linkedin, instagram).
- Credential probe is **binary** (Gate 3) — `typefully: false`, no values logged. Dim-6 grep for `_KEY`/`_TOKEN`/`_SECRET` over the bundle later confirms no secret leaked.
- Mode resolution: no credentials + no `--mode` flag → **Route A** (export-all). Auto-detect never picks publish (Gate 1).

## 3. The flow — write-social copy → bundle

**formatter-agent** reads each `references/platforms/[platform].md` and converts the write-social body to platform-native shape:

- **X** — body > 280 chars → split into a 3-post thread at sentence boundaries; hook in post 1 (lands inside 140 chars); CTA in the final post; 2 hashtags max.
- **LinkedIn** — preserve double-newline paragraph breaks; CTA pulled inside the ~210-char "see more" cutoff; hashtag stack (3-5) moved to end-of-post; X thread markup stripped.
- **Instagram** — caption-bottom hashtag stack (narrative post); hook in first 50 chars; CTA inside the ~125-char "...more" cutoff; 1:1 hero cross-checked against the produce-asset slot.

Each platform's char count is validated against the hard cap (X 280/post · LinkedIn 3000 · IG 2200). One over = FAIL (formatter cannot trim — editorial call). All three pass.

Then all **four** scheduler-import files are emitted (always, regardless of which tool the operator uses), the manifest + README are written, and **critic-agent** scores dims 1-7. Export-mode → critic runs after emission.

## 4. The produced bundle (rendered)

Written to `docs/forsvn/artifacts/marketing/published-social/local-first-capture/`:

```
local-first-capture/
├── manifest.md
├── platforms/
│   ├── x.md
│   ├── linkedin.md
│   └── instagram.md
├── scheduler-imports/
│   ├── typefully.json
│   ├── buffer.csv
│   ├── hootsuite.csv
│   └── generic.csv
└── README.md
```

### `manifest.md` (16-field frontmatter + 5 body sections)

```markdown
---
skill: publish-social
version: "1.2.0"
date: 2026-06-13
status: done
slug: local-first-capture
source_artifacts:
  write_social: docs/forsvn/artifacts/marketing/write-social/local-first-capture-2026-06-10-quiet-capture.md
  produce_asset: docs/forsvn/artifacts/marketing/produce-asset/local-first-capture-2026-06-10-hero.md
  produce_video: null
target_platforms: [x, linkedin, instagram]
mode_per_platform:
  x: export
  linkedin: export
  instagram: export
credentials_detected:
  typefully: false
  linkedin: false
  instagram: false
  facebook: false
  tiktok: false
  youtube: false
  threads: false
  bluesky: false
  reddit: false
scheduler_imports_emitted: [typefully.json, buffer.csv, hootsuite.csv, generic.csv]
bundle_file_count: 9
dry_run: false
confirmation_result: not_required
provenance:
  skill: publish-social
  run_date: 2026-06-13
  input_artifacts:
    - docs/forsvn/artifacts/marketing/write-social/local-first-capture-2026-06-10-quiet-capture.md
    - docs/forsvn/artifacts/marketing/produce-asset/local-first-capture-2026-06-10-hero.md
    - brand/BRAND.md
  output_eval: null
---

## Mode Summary

- X: export-mode (paste typefully.json, or import a scheduler CSV)
- LinkedIn: export-mode
- Instagram: export-mode

## Credentials Detected

- Typefully: NO
- Buffer: NO
- Hootsuite: NO

## Bundle Files

- platforms/x.md
- platforms/linkedin.md
- platforms/instagram.md
- scheduler-imports/typefully.json
- scheduler-imports/buffer.csv
- scheduler-imports/hootsuite.csv
- scheduler-imports/generic.csv
- README.md

## Next Step

No credentials detected — every platform is export-mode. Import the scheduler-import file matching your tool (Buffer CSV / Hootsuite CSV / generic CSV; Typefully JSON for X) and set the schedule inside the scheduler. Per-platform Markdown drafts are ready for native paste if you prefer manual posting. Configure `TYPEFULLY_API_KEY` to auto-draft X next run.

## Verification Checklist

- [ ] X drafted / scheduled
- [ ] LinkedIn drafted / scheduled
- [ ] Instagram drafted / scheduled
- [ ] Scheduler-import file pasted into chosen scheduler
- [ ] Schedule set inside scheduler
- [ ] Operator review: every post lands on schedule + on brief
```

### `platforms/x.md` (thread — 10-field frontmatter)

```markdown
---
skill: publish-social
version: "1.2.0"
date: 2026-06-13
platform: x
char_count: 612
media_refs:
  - docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png
mode: export
draft_url: null
post_url: null
automation_result: n/a
---

## Body (Thread)

### 1/3
Your best work happens before you remember to log it.

By the time you open the tracker, the thought's gone. FORSVN captures the work where it actually happens — your editor, your terminal — and graphs the connections for you.

### 2/3
No cloud. No account. The artifacts and their links live in a local `.forsvn/` folder you own. Agents do the heavy lifting; you review, approve, drag-to-reference.

### 3/3
Local-first, matte, calm — Forest Shadow, not another blue AI gradient.

14-day local trial, no account: forsvn.com 🌲

## Hashtags

#localfirst #devtools

## CTA

"14-day local trial, no account: forsvn.com" — in post 3/3 (X has no truncation; CTA in final thread post per platform ref).

## Media

- `docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png` — 1:1 1200×1200, ≤5MB. Attach to post 1/3 (hook post). Matches X image spec.

## Notes

X thread — post via Typefully thread-up, or post 1/3 then reply-chain. CTA URL is an external link; X penalizes links in the main post, but final-post placement is the accepted thread convention.
```

### `platforms/linkedin.md`

```markdown
---
skill: publish-social
version: "1.2.0"
date: 2026-06-13
platform: linkedin
char_count: 884
media_refs:
  - docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png
mode: export
draft_url: null
post_url: null
automation_result: n/a
---

## Body

Your best work happens before you remember to log it.

By the time you open a tracker, the context is already gone — the half-formed idea, the why behind the diff, the thread you almost pulled.

FORSVN captures work where it actually happens (your editor, your terminal, your coding agent) and graphs the connections automatically. You don't log; you review. Approve a decision, reject one, drag a note to reference another.

It's local-first by design: no cloud, no account, no telemetry. The artifacts and their memory live in a folder you own.

Curious how a local-first capture loop changes your week?

#localfirst #devtools #agents #buildinpublic

## Hashtags

#localfirst #devtools #agents #buildinpublic (end-of-post stack; 4 tags — within the 3-5 band).

## CTA

"Curious how a local-first capture loop changes your week?" — reply-bait question at the end (LinkedIn rewards comments). Hook + value land inside the ~210-char "see more" cutoff.

## Media

- `docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png` — 1:1 1200×1200 square image. LinkedIn-valid (≤8MB JPG/PNG).

## Notes

LinkedIn renders line breaks literally — double-newline = paragraph break, preserved from the write-social body. No external link in the body (reach penalty); put the trial link in the first comment.
```

### `platforms/instagram.md`

```markdown
---
skill: publish-social
version: "1.2.0"
date: 2026-06-13
platform: instagram
char_count: 498
media_refs:
  - docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png
mode: export
draft_url: null
post_url: null
automation_result: n/a
---

## Body

Your best work happens before you log it.

FORSVN captures work where it happens — editor, terminal, agent — and graphs the connections for you. No cloud. No account. A local folder you own.

14-day local trial → link in bio.
.
.
.
.
.
#localfirst #devtools #buildinpublic

## Hashtags

Caption-bottom stack (after 5 blank lines): #localfirst #devtools #buildinpublic — 3 highly-targeted tags (algorithm-current beats 30 broad).

## CTA

"14-day local trial → link in bio" — IG captions aren't clickable; operator must set the bio link. CTA lands inside the ~125-char "...more" cutoff; hook in first 50 chars.

## Media

- `docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png` — 1:1 1080–1200px square. IG-valid feed image. (4:5 portrait would win more feed real estate — flag for next produce-asset run.)

## Notes

Single-image feed post. Hashtags caption-bottom (narrative post default). No TikTok/other-platform watermark on the asset (IG suppresses watermarked cross-posts).
```

### `scheduler-imports/typefully.json` (Route A — no API call)

```json
{
  "posts": [
    {
      "platform": "twitter",
      "body": "Your best work happens before you remember to log it.\n\nBy the time you open the tracker, the thought's gone. FORSVN captures the work where it actually happens — your editor, your terminal — and graphs the connections for you.\n---\nNo cloud. No account. The artifacts and their links live in a local .forsvn/ folder you own. Agents do the heavy lifting; you review, approve, drag-to-reference.\n---\nLocal-first, matte, calm — Forest Shadow, not another blue AI gradient.\n\n14-day local trial, no account: forsvn.com 🌲",
      "threadify": true,
      "media": ["docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png"],
      "tags": ["#localfirst", "#devtools"]
    }
  ]
}
```

(`---` separators chunk the thread; no `api_response` block because no key was detected. UTF-8, no BOM, parser-strict.)

### `scheduler-imports/buffer.csv` (X + LinkedIn + IG; Buffer-native set)

```csv
platform,scheduled_at,body,media_url,tags,link
twitter,TBD,"Your best work happens before you remember to log it. FORSVN captures work where it happens and graphs the connections. No cloud, no account. 14-day local trial: forsvn.com",docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png,"#localfirst #devtools",https://forsvn.com
linkedin,TBD,"Your best work happens before you remember to log it. FORSVN captures work where it actually happens and graphs the connections automatically. Local-first: no cloud, no account, no telemetry. Curious how it changes your week?",,"#localfirst #devtools #agents #buildinpublic",
instagram,TBD,"Your best work happens before you log it. FORSVN captures work where it happens and graphs the connections. No cloud. No account. 14-day local trial → link in bio.",docs/forsvn/artifacts/marketing/produce-asset/slots/hero-1x1.png,"#localfirst #devtools #buildinpublic",
```

(6 columns, `scheduled_at: TBD` — operator sets the schedule inside Buffer.)

### `scheduler-imports/hootsuite.csv` and `generic.csv`

Emitted with the same content mapped to each tool's column convention (Hootsuite: 7 cols `Date,Time,Platform,Message,Link,Image,Approver`, `Platform` title-cased `Twitter/LinkedIn/Instagram`; generic: 6 cols `platform,datetime,body,media_urls,hashtags,link`, lowercase `x/linkedin/instagram`). README maps each scheduler to its file and notes that media local paths must be uploaded or hosted first (schedulers don't pull from local paths).

## 5. The export ledger rows (exact columns)

At export — **before the bundle ships** — `publish-social` appends one `exported` row per target platform to `.forsvn/performance/ledger.tsv` (`references/procedures/performance-ledger.md`; rules: `references/_shared/performance-data.md` § Ledger). Append-only; create the file with the schema header if absent. `placement` is always `organic` (paid is write-ad's lane); `post_url` is empty until metric-ingest joins it at first import.

```tsv
# schema_version: 1
ledger_id	artifact_id	platform	status	event_date	post_url	format	placement	notes
x-2026-06-13-local-first-capture	write-social-local-first-capture	x	exported	2026-06-13		text	organic	thread; export bundle local-first-capture
linkedin-2026-06-13-local-first-capture	write-social-local-first-capture	linkedin	exported	2026-06-13		text	organic	export bundle local-first-capture
instagram-2026-06-13-local-first-capture	write-social-local-first-capture	instagram	exported	2026-06-13		image	organic	caption-bottom hashtags; export bundle local-first-capture
```

Column order is exactly `ledger_id · artifact_id · platform · status · event_date · post_url · format · placement · notes`. `artifact_id` is the **source write-social** frontmatter `id` (not the bundle path) — that's the join key metric-ingest later uses to attribute measured engagement back to the producing artifact. Lifecycle continues `exported → live → measured`, advanced by metric-ingest on import.

## 6. Critic verdict — PASS

Aggregate ≥ 56/80 AND every dim ≥ 6 → **PASS** (export/draft critic runs after emission, dims 1-7):

```
- d1 char-cap fidelity: 9 — X thread each post ≤280; LinkedIn 884 ≤ 3000; IG 498 ≤ 2200; no truncation
- d2 platform-native shape: 9 — X threaded, LinkedIn paragraphed, IG caption-bottom stack; no cross-paste tells
- d3 brand fidelity: 9 — calm/technical voice; Forest Shadow + Leaf cue; Signal Lime absent; no blue AI gradient
- d4 CTA + hook placement: 8 — hooks land early; CTAs inside each platform's truncation point
- d5 scheduler-format validity: 9 — typefully.json parses; buffer.csv 6 cols; hootsuite.csv 7 cols; generic.csv 6 cols; UTF-8 no BOM
- d6 credential safety: 10 — grep clean (no _KEY/_TOKEN/_SECRET); credentials_detected booleans only
- d7 browser-automation safety: n/a — Route A export, no automation ran (dim scoped out, not scored down)
```

No FAIL → no re-dispatch cycle. (A persistent export FAIL after 2 formatter cycles would return `BLOCKED` and write **no bundle**; the ledger rows are written at export only on a passing bundle.)

## 7. Completion status

**DONE** — bundle written (9 files), critic passed, Critical Gates green, three `exported` ledger rows appended. Delivery returns the bundle root path + the Mode Summary line + the Route A next-step instruction.

## `--mode=publish` — the two-stage gate (noted, not shown)

The default above never posts. `--mode=publish` is explicit opt-in and **cannot** be reached by auto-detect. On a publish run the critic acts as a **content gate before** the confirmation gate (a live post can't be fixed afterward), then the two-stage gate fires (`references/publish-confirmation-gate.md`): **Stage 1** reviews every full post body; **Stage 2** requires the operator to type the literal word `PUBLISH`. `--dry-run` prints the publish plan and posts nothing. Abort at either stage ships the export bundle as **DONE** (not BLOCKED). On a real publish, each platform's `post_url` is recorded in `publish_result_per_platform`, and the same export-time ledger row is written with `status: exported` (metric-ingest later advances it to `live`/`measured`). No live post is shown here by design.

## What this example pins

- Default mode is **bundle/export** — auto-detect picks the highest non-publish mode and never posts live.
- The produced bundle is the exact 9-file shape: manifest (16-field frontmatter + 5 sections) + one per-platform draft each (10-field frontmatter + Body/Hashtags/CTA/Media/Notes) + all four scheduler-import files + README.
- Each platform draft is platform-native, not a cross-paste: X threaded, LinkedIn paragraphed with a comment-bait close, IG caption-bottom stack with a bio-link CTA.
- One `exported` ledger row per platform is written at export, keyed by the **source write-social `id`** — the anchor metric-ingest uses to attribute real engagement back to the producing artifact.
- Credentials are probed binary-only; no secret ever lands in the bundle (dim 6 grep + booleans-only `credentials_detected`).
