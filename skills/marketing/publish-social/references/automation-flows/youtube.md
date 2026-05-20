# YouTube — automation flow

> Session-cookie-driven draft creation via YouTube Studio. Google has aggressive multi-factor protections — flow assumes operator's cookies grant ongoing access.

**Last verified:** 2026-05-19
**Maturity:** LOW-MEDIUM. YouTube Studio supports drafts but Google's auth layer is the most aggressive of the 8 — re-auth challenges frequent.
**Expected duration:** 30-90 seconds per draft (video upload + processing time dominates)

## Pre-Requirements

- `session_cookies_by_platform.youtube` non-empty (Google session cookies — typically inherited from `.google.com` domain).
- YouTube **channel** active on the cookie's Google account.
- `drafts_by_platform.youtube` carries: title (≤100 chars), description (≤5000 chars), tags (optional), video media ref (REQUIRED for video draft; Shorts vs long-form determined by video aspect/length).
- Video file at media ref: 16:9 (long-form) or 9:16 (Shorts), valid MP4.

## Login State Assumption

Cookies provide. Flow navigates to `https://studio.youtube.com/`. Login redirect OR account-chooser appearance = abort.

## Navigation + Fill Sequence

| Step | Action | Selector / URL | Success Indicator | Failure → reason-class |
|---|---|---|---|---|
| 1 | Navigate | `https://studio.youtube.com/` | Studio loaded (presence of `#sidebar` + channel name) | `login_challenge` |
| 2 | Click "Create" → "Upload videos" | `ytcp-button[id="upload-button"]` | Upload dialog opens | `selector_drift` |
| 3 | Select video file | Provide path; trigger file input | Upload progress starts | `selector_drift` OR `network` |
| 4 | Wait for upload completion | Progress bar to 100% (may take minutes) | "Details" step appears | `network` if timeout (180s max) |
| 5 | Fill title | Type into title field | Title text matches | `selector_drift` |
| 6 | Fill description | Type into description field | Description matches | `selector_drift` |
| 7 | (Optional) Fill tags | Click "Show more" → tags field → type comma-separated tags | Tags accepted | `selector_drift` (skip if no tags) |
| 8 | Close dialog without publishing | Click "Save" / X button (saves as draft automatically) | "Draft saved" confirmation | `selector_drift` |
| 9 | Capture draft URL | URL after navigation or drafts-list URL | Draft URL captured | `unknown` |

## Selector Notes

YouTube Studio uses Polymer-based custom elements (`ytcp-*` prefix). Selectors above verified 2026-05-19.

## Special Constraints

- **Video required.** Text/playlist drafts use different flows; out of v1 scope.
- **Long timeout.** Flow timeout extended to 180s (vs 60s default) due to video upload + processing.
- **Aspect determines Shorts vs long-form.** If video is 9:16 and ≤60s, Studio auto-categorizes as Short; longer or 16:9 = long-form. Manifest reports which path the draft landed in.
- **Google 2FA re-prompts.** Google occasionally re-prompts for 2FA even on valid sessions — common on first run from new IP or after long session. Abort with `failed:login_challenge`; operator re-authenticates in their browser, re-exports cookies.

## Anti-Patterns

- **No bypassing Google's bot detection.** v1 assumes agent-browser handles standard fingerprint normalization. WebDriver detection = abort.
- **No automation across multiple Google accounts.** Cookie-resolved account only.
- **No Studio Analytics or monetization automation.** Stays focused on draft creation.
- **No Community Posts (legacy text-only YT posts).** Different flow; out of v1 scope.

## Draft URL Pattern

YouTube draft URLs:
```
https://studio.youtube.com/video/<videoId>/edit
```

Where `<videoId>` is the 11-char YT video ID assigned during upload. Capture this URL on success.

## Publish Variant (D18)

> `--mode=publish` runs steps 1–7 above unchanged, then sets visibility to **Public** and **Publishes** instead of closing the dialog as a draft. The video goes live. Reached only after the orchestrator's two-stage confirmation gate returns `confirmed`.

| Step | Action | Selector | Success indicator | Failure → reason-class |
|---|---|---|---|---|
| 8′ (replaces draft step 8) | Advance to the Visibility step; select **"Public"** | `tp-yt-paper-radio-button[name="PUBLIC"]` | Public radio selected | `selector_drift` |
| 9′ | Click **"Publish"** | `ytcp-button[id="done-button"]` (label "Publish") | "Video published" dialog with the share link | `selector_drift` |
| 10′ | Capture live post URL | Read the share link from the published dialog | `post_url` captured | `unknown` |

**post_url pattern:** `https://www.youtube.com/watch?v=<videoId>` (long-form) OR `https://www.youtube.com/shorts/<videoId>` (9:16 ≤60s)

**On Send failure:** video uploaded + metadata filled but unpublished → automation-agent takes the single "close dialog = save draft" fallback action (`fallback-draft`); if that also fails, `fallback-export`. No publish retry. Captcha / 2FA re-prompt at any point → `fallback-export`.

**Publish-specific note:** the visibility step must explicitly select **Public** before Publish — never leave it at the default. If the video is flagged at upload (copyright / content policy), abort with `failed:unknown` (reason `video_rejected`) and do not attempt to publish a flagged video.

## Confidence Notes

v1 confidence: LOW-MEDIUM. Google's auth layer is the most aggressive; expect 20-40% fallback-to-export rate due to 2FA re-prompts and bot-detection. Selector drift moderate.

## What Goes Wrong (operator-facing)

- **2FA re-prompt:** Google asks for second factor mid-flow — abort with `login_challenge`.
- **Account chooser:** if Google session has multiple accounts, chooser may appear — abort with `login_challenge`.
- **Upload timeout:** large videos may exceed 180s — abort with `failed:network`.
- **Video rejected:** copyright detection, content policy, etc. — abort with `failed:unknown` (reason: video_rejected).
- **Studio under maintenance:** rare but happens; abort with `failed:network`.
