# Instagram — automation flow

> Session-cookie-driven draft creation via Instagram web client. Meta's anti-bot detection is aggressive — flow ships with explicit caveats.

**Last verified:** 2026-05-19
**Maturity:** MEDIUM. IG web client supports draft creation but has aggressive bot-detection on automated patterns.
**Expected duration:** 10-25 seconds per draft

## Pre-Requirements

- `session_cookies_by_platform.instagram` non-empty.
- Instagram **Business or Creator account** strongly recommended — personal accounts have fewer automation hooks and tighter rate limits.
- `drafts_by_platform.instagram` carries: caption body, hashtag stack placement choice (caption-bottom vs first-comment), media refs.

## Login State Assumption

Cookies provide. If first navigation triggers `https://www.instagram.com/accounts/login/` redirect, abort with `failed:login_challenge`.

## Navigation + Fill Sequence

| Step | Action | Selector / URL | Success Indicator | Failure → reason-class |
|---|---|---|---|---|
| 1 | Navigate | `https://www.instagram.com/` | Feed loaded (presence of `main[role="main"]`) | `login_challenge` if redirected |
| 2 | Open compose modal | Click `svg[aria-label="New post"]` OR navigate to `https://www.instagram.com/create/select/` | Compose modal opens | `selector_drift` |
| 3 | Upload media | File picker → upload (required for IG posts; no text-only) | Media preview appears | `selector_drift` (CRITICAL: skipping media = abort) |
| 4 | Click "Next" twice | `button` with text "Next" | Caption-step page loads | `selector_drift` |
| 5 | Fill caption body | Type into caption textarea (`textarea[aria-label="Write a caption"]`) | Caption text matches input | `selector_drift` |
| 6 | Save as draft | Click "Save draft" option in menu (≡ overflow) | "Draft saved" confirmation | `selector_drift` |
| 7 | Capture URL (limited) | IG web doesn't expose direct draft URL; capture profile drafts URL | Draft URL = profile drafts page | `unknown` |

## Selector Notes

IG selectors are notoriously unstable. CSS classes are auto-generated (e.g., `_aaaa _aabc`). Best-stable selectors are `aria-label` and `role` attributes. Verified selectors above as of 2026-05-19; expect ~monthly drift.

## Special Constraints

- **Media is required.** IG does not allow text-only posts. If `drafts_by_platform.instagram.media_refs` is empty/missing → abort with `failed:selector_drift` and reason "media_required" (will be reclassified to `cookies_missing` semantically — automation can't proceed without media). Fallback to D16 export-mode for IG; operator manually uploads media when posting.
- **Stories vs Posts vs Reels.** v1 covers feed posts only. Stories don't have a draft state (ephemeral). Reels drafting is supported via `/create/reels/` path — but routing decision adds complexity; v1 ships feed-posts-only.
- **Hashtag-stack placement.** If `drafts_by_platform.instagram.hashtag_position == "first_comment"`, the flow CANNOT post the first comment (would require submit, not just save-draft). Operator handles after Send. README explicitly notes.

## Anti-Patterns (IG-specific automation)

- **No background-tab navigation.** IG detects tab-visibility patterns; flow runs in foreground tab.
- **No JS injection for "instant fill".** Fill via typing actions (per character) — instant fills look bot-like.
- **No multiple drafts in <60s.** Even sequential, multiple IG drafts in rapid succession triggers rate-limit. Manifest warns operator if planning >3 IG drafts.
- **No automation of Insights or DM views.** Stays focused on draft creation only.

## Draft URL Pattern

IG web client does NOT expose direct per-draft URLs. The drafts area is accessible via:
```
https://www.instagram.com/your_profile/saved/all-posts/
```
(or via the in-app "Drafts" tab — different per Business/Creator/Personal account).

When draft saves, capture this profile-drafts URL; README tells operator to navigate manually.

## Publish Variant (D18)

> `--mode=publish` runs steps 1–5 above unchanged, then takes the **Share** action instead of Save-draft. The post goes live. Reached only after the orchestrator's two-stage confirmation gate returns `confirmed`.

| Step | Action | Selector | Success indicator | Failure → reason-class |
|---|---|---|---|---|
| 6′ (replaces draft step 6) | Click **"Share"** | `button` / `div[role="button"]` with text "Share" on the caption step | "Your post has been shared" state; modal closes; post on profile grid | `selector_drift` |
| 7′ | Capture live post URL | Open the new post from the profile grid; read URL | `post_url` captured | `unknown` |

**post_url pattern:** `https://www.instagram.com/p/<shortcode>/`

**On Send failure:** caption + media are composed but unsent → automation-agent takes the single Save-draft fallback action (`fallback-draft`); if that also fails, `fallback-export`. No Send retry. Captcha at any point → `fallback-export`.

**Publish-specific note:** if `hashtag_position == "first_comment"`, the publish flow still cannot post the first comment (that needs a second submit) — it publishes the post; the README instructs the operator to add the first comment manually. First-comment hashtags are NOT lost, just deferred to the operator.

## Confidence Notes

v1 confidence: MEDIUM. IG selector drift is the most common failure mode. Captcha rare on Business accounts; common on Personal accounts.

## What Goes Wrong (operator-facing)

- **Session expired:** cookies stale.
- **Suspicious-activity prompt:** IG shows "Was this you?" challenge — abort with `login_challenge`.
- **Captcha:** rare but possible; abort with `failed:captcha`.
- **Selector drift:** most common — IG UI updates frequently.
- **Rate limit:** "Try again later" message — abort with `failed:rate_limit`.
- **Media upload fails:** file format / size issue; flow aborts with `selector_drift` at step 3.
