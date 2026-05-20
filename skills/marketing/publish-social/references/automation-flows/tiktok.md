# TikTok — automation flow

> Session-cookie-driven draft creation via TikTok Studio (web). Most-fragile of the 8 — TikTok has the strictest bot-detection.

**Last verified:** 2026-05-19
**Maturity:** LOW-MEDIUM. TikTok web upload is functional but UI changes frequently; bot-detection is aggressive on rapid actions.
**Expected duration:** 20-45 seconds per draft (video upload time dominates)

## Pre-Requirements

- `session_cookies_by_platform.tiktok` non-empty.
- TikTok **account in good standing** (not flagged for spam / community-guideline violations) — flagged accounts have reduced automation tolerance.
- `drafts_by_platform.tiktok` carries: caption body, hashtags, video media ref (REQUIRED — TikTok is video-first; image carousel posts use a different flow scoped to D17.next).
- Video file at media ref must satisfy: 9:16 aspect, ≤10 min, MP4 format.

## Login State Assumption

Cookies provide. First navigation expected at `https://www.tiktok.com/tiktokstudio/upload` OR `/upload`. Login redirect = abort.

## Navigation + Fill Sequence

| Step | Action | Selector / URL | Success Indicator | Failure → reason-class |
|---|---|---|---|---|
| 1 | Navigate | `https://www.tiktok.com/tiktokstudio/upload?from=upload` | Upload page loaded | `login_challenge` if redirected |
| 2 | Click upload area or trigger file picker | `input[type="file"][accept="video/*"]` OR dropzone | File chooser opens | `selector_drift` |
| 3 | Select video file | Provide path from media_ref | Video preview generates (may take 5-20s) | `selector_drift` OR `network` if upload fails |
| 4 | Wait for upload completion | Poll for upload-complete indicator (`.progress-bar` removed OR success state) | Caption editor unlocks | `network` if upload hangs |
| 5 | Fill caption | Type into caption editor (`div[contenteditable="true"]` near upload) | Caption text matches | `selector_drift` |
| 6 | Set visibility to private/draft | Click "Save to drafts" button at bottom | Draft state set | `selector_drift` |
| 7 | Capture draft confirmation | "Saved to drafts" toast OR navigate to drafts list | Drafts list URL captured | `unknown` |

## Selector Notes

TikTok Studio updates the UI roughly bi-monthly. Selectors above verified 2026-05-19; treat as ~30-day-fresh.

## Special Constraints

- **Video required.** No text-only or image-only drafts via this flow (image posts use a different studio path; out of v1 scope).
- **No native draft URL.** TikTok drafts are accessible only via Studio drafts list:
  ```
  https://www.tiktok.com/tiktokstudio/content?tab=drafts
  ```
- **Long upload times.** Video uploads can take 10-30 seconds depending on file size + connection. Flow timeout extended to 90 seconds per platform (vs 60s default).
- **Bot-detection on rapid uploads.** Multiple TikTok drafts in <60s triggers immediate rate-limit. Manifest warns if planning >2 TikTok drafts.

## Anti-Patterns

- **No "fingerprint dodging" attempts.** TikTok detects WebDriver / Puppeteer signatures; v1 assumes agent-browser handles fingerprint normalization. If detection still triggers, fallback to export — no countermeasures.
- **No CAPTCHA solve.** TikTok shows slider captchas occasionally; any captcha = immediate fallback.
- **No upload-and-publish in same flow.** v1 only saves to drafts. Operator hits Post manually after review.
- **No simultaneous multi-account.** If operator has multiple TikTok accounts, only the cookie-resolved one is targeted.

## Publish Variant (D18)

> `--mode=publish` runs steps 1–5 above unchanged, then takes the **Post** action instead of Save-to-drafts. The video goes live. Reached only after the orchestrator's two-stage confirmation gate returns `confirmed`.

| Step | Action | Selector | Success indicator | Failure → reason-class |
|---|---|---|---|---|
| 6′ (replaces draft step 6) | Click **"Post"** | `button` with text "Post" at the bottom of the upload form | "Your video is being posted" → posted state | `selector_drift` |
| 7′ | Capture live post URL | Read the published video URL from TikTok Studio content list | `post_url` captured | `unknown` |

**post_url pattern:** `https://www.tiktok.com/@<username>/video/<video_id>`

**On Send failure:** video is uploaded + caption filled but unposted → automation-agent takes the single Save-to-drafts fallback action (`fallback-draft`); if that also fails, `fallback-export`. No Send retry. Slider captcha at any point → `fallback-export`.

**Publish-specific note:** TikTok is the riskiest automation surface (LOW-MEDIUM maturity; ~30% fallback rate). For `--mode=publish` expect a higher fallback-to-draft rate than draft mode — the post-upload Post step is where bot-detection most often triggers. Video upload completing does not guarantee the Post action succeeds.

## Confidence Notes

v1 confidence: LOW-MEDIUM. TikTok is the riskiest automation surface in scope. Operator should expect ~30% fallback-to-export rate on TikTok in v1. Selector spec sync is critical.

## What Goes Wrong (operator-facing)

- **"You're posting too fast" warning:** rate-limit — wait 5-10 min before re-running with TikTok included.
- **Slider captcha:** TikTok's bot challenge — abort with `failed:captcha`; manual draft via Studio UI.
- **Video processing slow:** upload hangs; abort with `failed:network` after 90s.
- **Upload size limit:** video >285MB or longer than 10min triggers rejection at upload step; abort with `selector_drift` (reason: upload_rejected).
- **Account warning:** if TikTok flags account for spam, automation fails silently — abort with `unknown` after timeout.
