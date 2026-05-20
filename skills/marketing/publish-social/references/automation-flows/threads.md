# Threads — automation flow

> Session-cookie-driven draft creation via Threads web client. Meta-flavored login; Threads cookies typically inherited from Instagram session.

**Last verified:** 2026-05-19
**Maturity:** MEDIUM. Threads is newer than IG/FB and has lighter automation defenses; selectors more stable than IG.
**Expected duration:** 8-15 seconds per draft

## Pre-Requirements

- `session_cookies_by_platform.threads` non-empty. Often inherited from `.instagram.com` cookies (Threads shares auth with IG).
- Threads account linked to Instagram (the v1 path; Threads-only accounts exist but are less common).
- `drafts_by_platform.threads` carries: body (≤500 chars), media refs (optional).

## Login State Assumption

Cookies provide. First navigation expected at `https://www.threads.net/`. Login redirect = abort.

## Navigation + Fill Sequence

| Step | Action | Selector / URL | Success Indicator | Failure → reason-class |
|---|---|---|---|---|
| 1 | Navigate | `https://www.threads.net/` | Feed loaded (presence of `main` element + user avatar in header) | `login_challenge` |
| 2 | Click "New thread" | `div[role="button"]` with svg `path[d^="M2.5,18"]` (compose icon) OR text "Start a thread" | Compose modal opens | `selector_drift` |
| 3 | Fill body | Type into compose textarea (`textarea[placeholder*="What"]`) | Body text matches | `selector_drift` |
| 4 | (Optional) Attach media | Click attach-photo icon → upload | Media preview appears | `selector_drift` |
| 5 | Save as draft | Click X (close compose) → "Save" in "Save draft?" prompt | Draft saved | `selector_drift` |
| 6 | Capture confirmation | Toast OR drafts area URL | Confirmed | `unknown` |

## Selector Notes

Threads UI is React-based with semi-stable selectors. Better than IG/FB (auto-generated classes less prevalent here). Verified 2026-05-19.

## Special Constraints

- **No native drafts list (as of vintage).** Threads "Save draft" is a popup option when closing the compose modal — doesn't surface in a persistent drafts area like LinkedIn does. Operator finds drafts by clicking compose again ("Resume draft" prompt appears).
- **Char cap 500.** Tight cap; flow trusts formatter-agent's D16 char validation.
- **No native thread-chain mode.** v1 emits single posts; multi-post chains require multiple invocations (out of scope).

## Anti-Patterns

- **No multi-account in single session.** Threads shares auth with IG; multi-account triggers IG-level bot-detection.
- **No simultaneous Threads + IG automation.** Sequential pacing applies cross-platform when both targeted (3s pause from main loop is sufficient).
- **No JS-injection for fast-fill.** Same as IG.

## Draft URL Pattern

No direct draft URL exposed. Operator accesses via:
```
https://www.threads.net/
```
Then clicks compose to see "Resume draft" prompt. README explicitly instructs.

## Publish Variant (D18)

> `--mode=publish` runs steps 1–4 above unchanged, then takes the **Post** action instead of the close-compose → Save-draft path. The post goes live. Reached only after the orchestrator's two-stage confirmation gate returns `confirmed`.

| Step | Action | Selector | Success indicator | Failure → reason-class |
|---|---|---|---|---|
| 5′ (replaces draft step 5) | Click **"Post"** | `div[role="button"]` with text "Post" in the compose modal footer | Compose modal closes; post appears in feed | `selector_drift` |
| 6′ | Capture live post URL | Open the new post from the user's profile; read URL | `post_url` captured | `unknown` |

**post_url pattern:** `https://www.threads.net/@<username>/post/<post_id>`

**On Send failure:** body is composed but unsent → automation-agent takes the single "close compose → Save draft" fallback action (`fallback-draft`); if that also fails, `fallback-export`. No Send retry. Captcha at any point → `fallback-export`.

**Publish-specific note:** Threads shares auth with Instagram — an expired IG session fails the Threads publish at the auth step (`failed:login_challenge`), not mid-post. Single posts only; multi-post chains require multiple invocations (unchanged from draft flow).

## Confidence Notes

v1 confidence: MEDIUM. Threads is friendlier than IG; selectors more stable; bot-detection lighter (Meta hasn't yet deployed IG-level defenses on Threads).

## What Goes Wrong (operator-facing)

- **Session inherited from IG, but IG session expired:** Threads auth fails alongside IG — abort with `login_challenge`.
- **Compose modal doesn't open:** selector drift OR rate limit — usually selector drift.
- **Suspicious activity prompt:** Meta-level challenge — abort with `login_challenge`.
- **Char cap exceeded (shouldn't happen post-D16 critic):** flow aborts during fill step.
