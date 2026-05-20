# Facebook — automation flow

> Session-cookie-driven draft creation via Facebook Pages publishing tools.

**Last verified:** 2026-05-19
**Maturity:** MEDIUM. FB has aggressive bot-detection on personal accounts; Page automation is more permissive.
**Expected duration:** 12-30 seconds per draft

## Pre-Requirements

- `session_cookies_by_platform.facebook` non-empty.
- Operator must have a Facebook **Page** (not personal profile) — automation targets Page publishing. Personal-profile automation triggers immediate detection.
- `drafts_by_platform.facebook` carries: body, media refs (optional), link (optional), target Page ID.
- Page ID must be present in `drafts_by_platform.facebook.page_id`; if missing, abort with `failed:unknown` (reason: "page_id_missing").

## Login State Assumption

Cookies provide. First navigation expected at `https://business.facebook.com/` OR `https://www.facebook.com/`. Login redirect = abort.

## Navigation + Fill Sequence

| Step | Action | Selector / URL | Success Indicator | Failure → reason-class |
|---|---|---|---|---|
| 1 | Navigate | `https://business.facebook.com/latest/posts?asset_id=<page_id>` | Page composer loaded | `login_challenge` if redirected |
| 2 | Click "Create post" | `div[role="button"]` with text "Create post" | Composer modal opens | `selector_drift` |
| 3 | Fill body | Type into editor (`div[contenteditable="true"][role="textbox"]`) | Body text matches | `selector_drift` |
| 4 | (Optional) Attach media | Click "Photo/Video" → upload | Media preview appears | `selector_drift` |
| 5 | (Optional) Add link | Type link into body OR use link-attach button | Link preview generates | `selector_drift` |
| 6 | Save as draft | Click 3-dot menu → "Save draft" | "Draft saved" toast | `selector_drift` |
| 7 | Capture URL | Read URL OR navigate to drafts list | Drafts list URL OR direct draft URL | `unknown` |

## Selector Notes

Meta's UI selectors are auto-generated (similar to IG). Best-stable: `aria-label` and `role` attributes. Verified 2026-05-19.

## Special Constraints

- **Page automation only.** Personal-profile post creation triggers FB's friend-graph detection patterns — high suspension risk. v1 hard-blocks if `page_id` missing.
- **Drafts area is under Business Suite.** Flow uses `business.facebook.com` not `www.facebook.com`/Page-direct.
- **Meta Business Suite quirks.** If operator has multiple Pages, ensure Page selector resolves to the correct Page (check page_id matches navigated URL after step 1).

## Anti-Patterns

- **No personal-profile drafts.** Hard-block.
- **No automation across multiple Pages in <30s.** FB detects rapid Page-switching patterns.
- **No JS-injection for fast-fill.** Same as IG — fill via per-character typing.
- **No simultaneous web + mobile sessions.** If operator's session is also active on mobile, automated draft creation patterns get flagged faster.

## Draft URL Pattern

Drafts URL (Business Suite):
```
https://business.facebook.com/latest/posts/?asset_id=<page_id>&filter=PUBLISHED_FAILED_DRAFTS
```

Direct per-draft URL may not be exposed; capture drafts-list URL.

## Publish Variant (D18)

> `--mode=publish` runs steps 1–5 above unchanged, then takes the **Publish** action instead of Save-draft. The post goes live on the Page. Reached only after the orchestrator's two-stage confirmation gate returns `confirmed`.

| Step | Action | Selector | Success indicator | Failure → reason-class |
|---|---|---|---|---|
| 6′ (replaces draft step 6) | Click **"Publish"** | `div[role="button"]` / `button` with text "Publish" (composer primary action) | "Post published" toast; composer closes; post on Page timeline | `selector_drift` |
| 7′ | Capture live post URL | Read the new post URL from the Page timeline | `post_url` captured | `unknown` |

**post_url pattern:** `https://www.facebook.com/<page_id>/posts/<post_id>`

**On Send failure:** body is composed but unsent → automation-agent takes the single Save-draft fallback action (`fallback-draft`); if that also fails, `fallback-export`. No Send retry. Captcha at any point → `fallback-export`.

**Publish-specific note:** Page-only — publish targets the Page resolved by `page_id` (Critical hard-block if `page_id` missing carries over). Verify the navigated URL's `asset_id` matches `page_id` before publishing; a Page mismatch → `failed:unknown` (reason `page_id_mismatch`), never publish to the wrong Page.

## Confidence Notes

v1 confidence: MEDIUM-LOW. FB Pages automation works but has more failure modes than LinkedIn. Selector drift expected on monthly cadence.

## What Goes Wrong (operator-facing)

- **Wrong Page selected:** if operator manages multiple Pages, automation may navigate to wrong Page — abort with `unknown` (reason: page_id_mismatch).
- **Account-review prompt:** "We need to verify it's you" — abort with `login_challenge`.
- **Captcha:** moderate frequency; abort with `failed:captcha`.
- **Business Suite UI changes:** Meta updates the Business Suite UI frequently; expect selector drift.
