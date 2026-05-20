# LinkedIn — automation flow

> Session-cookie-driven draft creation. Lands the draft in operator's LinkedIn "Drafts" area; operator hits Send manually.

**Last verified:** 2026-05-19
**Maturity:** highest of the 8 (LinkedIn has the friendliest automation surface; minimal captcha on legitimate sessions)
**Expected duration:** 8-15 seconds per draft

## Pre-Requirements

- `session_cookies_by_platform.linkedin` non-empty (cookie string from operator's logged-in browser).
- `drafts_by_platform.linkedin` carries: body, hashtags, media refs (if any), CTA.
- agent-browser available + logged in via injected cookies.

## Login State Assumption

Cookies provide. Flow does NOT navigate to login page. If the first navigation hits an auth redirect, abort with `failed:login_challenge`.

## Navigation + Fill Sequence

| Step | Action | Selector / URL | Success Indicator | Failure → reason-class |
|---|---|---|---|---|
| 1 | Navigate | `https://www.linkedin.com/feed/` | Feed page loaded (presence of `.scaffold-layout__main`) | `login_challenge` if redirected to `/login` |
| 2 | Click "Start a post" | `button[data-test-id="share-box-feed-entry__trigger"]` OR `.share-box-feed-entry__trigger` | Modal opens (presence of `.share-box-modal`) | `selector_drift` |
| 3 | Wait for editor to be ready | `.ql-editor[contenteditable="true"]` | Editor present + focusable | `selector_drift` |
| 4 | Fill body | Type draft body into `.ql-editor` | Body text matches input | `selector_drift` |
| 5 | (Optional) Attach media | Click `.share-box-image-icon` OR `.share-box-document-icon`; upload file | Media preview appears | `selector_drift` (skip step if no media) |
| 6 | Save as draft | Click `button[aria-label="Save as draft"]` OR menu → "Save as draft" | "Saved to drafts" toast appears | `selector_drift` |
| 7 | Capture draft URL | Read `window.location.href` OR drafts-list URL | Draft URL captured | `unknown` (log step name only) |

## Selector Notes

LinkedIn updates its UI on a ~quarterly cadence. Selectors above were verified 2026-05-19. The `data-test-id` attributes are most stable; CSS class selectors (`.share-box-modal`, etc.) drift more often.

If selector_drift detected, the flow surfaces the step name (e.g., `failed_at_step: "compose-modal-open"`) so the next person updating the spec knows where to look.

## Anti-Patterns (LinkedIn-specific automation)

- **No multi-tab parallel runs.** LinkedIn's session can detect multi-tab same-action patterns and rate-limit; sequential per-platform pacing (3s pause) is sufficient.
- **No retry on failure.** Single attempt; fallback to export. Retry-with-backoff increases account-suspension risk.
- **No login-form filling.** Cookies provide auth; if login-form appears, abort.
- **No selector-by-text-content fallbacks** in v1. If `data-test-id` fails, surface `selector_drift` — text-content selectors are too brittle.

## Draft URL Pattern

When step 7 succeeds, draft URL typically:
```
https://www.linkedin.com/feed/?draftShareUrn=urn:li:share:<id>
```
OR (older format):
```
https://www.linkedin.com/posts/<userid>_<slug>-activity-<id>
```

If URL can't be captured, set `draft_url: null`; manifest README tells operator: "Open LinkedIn → click your profile → click Drafts → find the most recent."

## Publish Variant (D18)

> `--mode=publish` runs steps 1–5 above unchanged, then takes the **Post** action instead of Save-draft. The post goes live. Reached only after the orchestrator's two-stage confirmation gate returns `confirmed`.

| Step | Action | Selector | Success indicator | Failure → reason-class |
|---|---|---|---|---|
| 6′ (replaces draft step 6) | Click **"Post"** | `button.share-actions__primary-action` OR `button[aria-label="Post"]` | "Post successful" toast; share modal closes | `selector_drift` |
| 7′ | Capture live post URL | Read the new activity URL from the feed-update element OR profile recent-activity | `post_url` captured | `unknown` (log step name only) |

**post_url pattern:** `https://www.linkedin.com/feed/update/urn:li:activity:<id>/`

**On Send failure:** body is composed but unsent → automation-agent takes the single draft-Save fallback action (`fallback-draft`); if that also fails, `fallback-export`. No Send retry. Captcha at any point → `fallback-export`.

**Publish-specific note:** LinkedIn's "Post" button is the share-modal primary action — visually distinct from the "Save as draft" menu item. Do not confuse the two; the publish flow targets the primary button, never the overflow menu.

## Confidence Notes

LinkedIn is the most-automation-friendly of the 8 platforms in scope. v1 confidence: HIGH for non-media drafts; MEDIUM for media drafts (image/video upload steps have more failure modes — file chooser dialogs can vary by OS).

## What Goes Wrong (operator-facing)

- **Session expired:** cookies stale; export new from browser.
- **MFA prompt appears:** LinkedIn occasionally requires re-auth even with valid cookies (security re-check); abort with `login_challenge`.
- **Slow connection:** flow times out after 60 seconds; mark `failed:network`.
- **Account warning:** if LinkedIn shows a security warning page (e.g., "unusual activity detected"), abort with `failed:login_challenge` — operator must clear in their browser before retrying.
