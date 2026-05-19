# Rubric — publish-social

> 7 dimensions × 0-10 bands (D17 adds dim 7). Critic-agent applies; pass gate is aggregate ≥ 49/70 AND every per-dim ≥ 6. Single per-dim < 6 = FAIL.

**Version:** v1.1 (D17, 2026-05-19). Was v1.0 with 6 dims; D17 added dim 7 (Browser-Automation Safety). Revisable after the first 2-3 real publish-social D17 runs surface scoring drift.

## Pass Gate

- Aggregate score ≥ **49 / 70** (i.e., 70% mean)
- Every per-dimension score ≥ **6 / 10**
- Both conditions required. Aggregate alone is insufficient — single-platform contamination is caught by the per-dim floor.

## Auto-Fail Conditions

Override the aggregate. Any of these → immediate FAIL, regardless of other scores:

1. **Dim 1 — Char-cap exceeded.** Any per-platform variant over its hard limit by ≥1 char.
2. **Dim 5 — Scheduler-format unparseable.** Any of the 4 scheduler-import files fails to parse.
3. **Dim 6 — Credential leak detected.** Grep across emitted files returns any literal credential value pattern.
4. **Dim 6 — Policy-violating copy explicit.** Platform-specific banned-word hit OR claim banned under platform ad/content policy.
5. **Dim 7 — D17 automation ran without confirmation.** `automation_result_per_platform[p].status == "success"` appears with `confirmation_result != "confirmed"`.
6. **Dim 7 — Cookie leak detected.** Cookie value substring matches across any emitted file or log line.
7. **Dim 7 — Captcha-bypass attempt.** Retry log line within 1s of captcha detection log line.

---

## Dim 1: Platform Char-Cap Compliance

**Falsifiability:** char count per platform vs hard limit (table in critic-agent § Dim 1).

### Bands

| Score | Criterion |
|---|---|
| **10** | Every target platform within cap with ≥10% headroom; reads cleanly |
| **9** | Every platform within cap; one platform at 90-99% of cap (operator should review for readability) |
| **8** | Every platform within cap; 2+ platforms at 90-99% of cap |
| **7** | Every platform within cap; one platform at 99%+ but still under |
| **6** | Every platform within cap; no headroom on multiple platforms (publishing OK but tight) |
| **0 (auto-fail)** | Any platform exceeds its hard cap by ≥1 char |

### Check

For each platform: count chars in body. For X thread: validate each post separately + verify thread split logic. Compare against `references/platforms/[platform].md` § Char Cap.

---

## Dim 2: Media Spec Compliance

**Falsifiability:** aspect / size / format per platform vs spec; cross-check against produce-asset / produce-video manifests when provided.

### Bands

| Score | Criterion |
|---|---|
| **10** | Every media reference matches platform spec exactly (aspect + size + format); cross-check against manifest passes |
| **9** | Every reference matches aspect; size/format not verifiable from manifest (acceptable — manifest may not carry file size) |
| **8** | Aspect correct on every platform; one platform's size near limit (operator should re-export) |
| **7** | Aspect correct; cross-check missing because manifest absent (acceptable v1) |
| **6** | Media required but no manifest provided; "MEDIA REQUIRED" placeholder present in draft |
| **< 6** | Aspect mismatch on any platform OR media required but no placeholder/manifest |
| **0 (auto-fail)** | Aspect mismatch AND manifest provided (means formatter ignored a known-bad aspect) |

### Check

For each platform draft referencing media: cross-check aspect ratio vs platform spec; cross-check size + format if manifest carries the data. If neither manifest provided and media is required for platform, verify formatter included "MEDIA REQUIRED" placeholder.

---

## Dim 3: CTA Visibility

**Falsifiability:** CTA copy position vs platform's algorithm-truncation point.

### Bands

| Score | Criterion |
|---|---|
| **10** | CTA copy lies fully before truncation point on every platform |
| **9** | CTA before truncation on every platform; one platform's CTA starts in the last quartile before truncation |
| **8** | CTA fully visible on 8/9 platforms; one platform's CTA partially after truncation |
| **7** | CTA visible on 7/9 platforms; 2 platforms have CTA partially after truncation |
| **6** | CTA visible on most platforms; 1 platform has CTA fully after truncation |
| **< 6** | CTA missing on any platform OR CTA fully after truncation on 2+ platforms |

### Check

For each platform: extract first-N chars where N = truncation point (table in critic-agent § Dim 3). Verify CTA copy is fully contained. For X, the entire 280 chars are visible — CTA can be anywhere.

---

## Dim 4: Hashtag-Rules Per Platform

**Falsifiability:** hashtag count + position vs platform convention.

### Bands

| Score | Criterion |
|---|---|
| **10** | Count + position correct on every platform |
| **9** | Count correct everywhere; position suboptimal on 1 platform |
| **8** | Count correct everywhere; position wrong on 1 platform OR count off by 1 on 1 platform |
| **7** | Count correct on 8/9; position wrong on 1 |
| **6** | Count correct on most; off by 1 on 2 platforms |
| **< 6** | Count exceeds max on any platform OR Reddit has any "#" tags OR no hashtags where required (IG / TikTok / LinkedIn) |

### Check

Count hashtags per platform vs max (`references/platforms/[platform].md` § Hashtags). Verify position (inline / end / first-comment / etc.) matches convention.

---

## Dim 5: Scheduler-Format Validation

**Falsifiability:** actually parse each scheduler-import file.

### Bands

| Score | Criterion |
|---|---|
| **10** | All 4 files exist, parse cleanly, schema matches spec exactly |
| **9** | All 4 files parse; one file has a minor schema drift (column header capitalization off by 1 letter) |
| **8** | All 4 files exist; 3 of 4 schema-compliant; one has a parse-able but spec-noncompliant column |
| **7** | All 4 exist; 2 of 4 fully compliant; 2 have minor drift |
| **6** | 3 of 4 files compliant; one file noncompliant but parses |
| **0 (auto-fail)** | Any file fails to parse (invalid JSON, malformed CSV, encoding issue, missing required column) |

### Check

For each file: run a parser. Typefully JSON → strict JSON parse. CSVs → RFC 4180 parse with column-header check. Encoding check: UTF-8 without BOM.

---

## Dim 6: Anti-Pattern Compliance

**Falsifiability:** grep for credential patterns + check shadowban triggers + Unicode integrity + platform policy.

### Bands

| Score | Criterion |
|---|---|
| **10** | Zero hits on any anti-pattern check across all emitted files |
| **9** | Zero credential hits; one minor banned-word edge case (operator review note in manifest) |
| **8** | Zero credential hits; one platform has a borderline policy issue (operator should review) |
| **7** | Zero credential hits; minor Unicode drift (1-2 smart-quote-to-question-mark instances) |
| **6** | Zero credential hits; multiple minor anti-pattern flags requiring operator review |
| **0 (auto-fail)** | Credential leak detected (any `_KEY` / `_TOKEN` / `_SECRET` / API-key-like value in any emitted file) OR explicit platform policy violation OR shadowban trigger present |

### Check

1. Grep every emitted file: `_KEY` / `_TOKEN` / `_SECRET` / `api_key.*[a-zA-Z0-9]{20,}` / `access_token.*[a-zA-Z0-9]{20,}`. Must return zero literal-value matches.
2. Per platform: cross-check against `references/platforms/[platform].md` § Anti-Patterns (banned words, mass-tagging count thresholds, shadowban triggers).
3. UTF-8 integrity: no replacement chars U+FFFD; smart quotes preserved (not replaced with `?`).
4. Platform policy: no explicit policy violations per platform's content / ad policy (e.g., "guaranteed results" on Meta).

---

## Dim 7: Browser-Automation Safety (D17)

**Falsifiability:** D17 gate ran + no cookie leaks + no auto-submit + no retry-on-captcha.

### Bands

| Score | Criterion |
|---|---|
| **10** | D17 didn't run (export-only OR Typefully-only) OR D17 ran with all safety checks pass |
| **9** | D17 ran; one platform's reason-class is free-text instead of locked enum |
| **8** | D17 ran; one platform's status is `timeout` (acceptable but flag slow-response pattern) |
| **7** | D17 ran; one platform's `last_verified_date` is >90 days old (manifest warned but run continued) |
| **6** | D17 ran; multiple minor operator-debuggability concerns |
| **0 (auto-fail)** | Cookie leak detected OR automation ran without confirmation OR retry-on-captcha detected OR screenshot reference present |

### Check

1. Look at `manifest.automation_result_per_platform`. If absent/empty → dim = 10. Done.
2. Cookie-leak grep: for each platform with session_cookies in credentials JSON, grep cookie string substring across all emitted files + automation logs. Zero matches required.
3. Confirmation gate verification:
   - Transcript contains the confirmation-gate prompt text + operator response line.
   - `manifest.confirmation_result` value matches transcript.
   - Every success row has `confirmation_result == "confirmed"`.
4. No retry-on-captcha: no "retry" log line within 1s of "captcha" detection log line.
5. No screenshots: no `.png` / `.jpg` / `screenshot` references in automation logs.
6. Enum compliance: every `failed:*` reason-class is in `{login_challenge, selector_drift, rate_limit, captcha, network, unknown, confirmation_declined, cookies_missing}`.

---

## Aggregate Calculation

```
aggregate = dim1 + dim2 + dim3 + dim4 + dim5 + dim6 + dim7
pass = (aggregate >= 49) AND (min(all_dims) >= 6) AND (no auto-fail triggered)
```

## Revision Triggers

Rubric v1.0 is provisional. Mandatory revision when ANY of:

- 3 consecutive critic runs score within 1 point of each other on the same dim → recalibrate bands
- 3 operator overrides on the same dim → likely false-positive pattern; loosen the band OR add an exception
- Platform spec changes (e.g., X raises char limit; IG changes hashtag policy) → update the underlying table in per-platform refs AND in critic-agent
- A new platform is added to the supported set → add band coverage for that platform across all 6 dims

Revision protocol: log the change in CHANGELOG `[Unreleased]` under `### Changed`; bump rubric version in this file's frontmatter; cross-link from critic-agent.

## Falsifiability Floor

Every dim's check must be:
- **Reproducible** — another agent running the same input gets the same score
- **Specific** — score < 10 quotes exact failing content (line, count, file path)
- **Bounded** — no open-ended "is this good?" judgments; only "does this match the spec?"

If a dim falls back to subjective scoring, flag it for the next revision cycle.
