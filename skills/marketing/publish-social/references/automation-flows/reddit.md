# Reddit — automation flow

> Session-cookie-driven draft creation via Reddit web client. Reddit DOES have a native drafts feature — operator's drafts are saved per-account and accessible from the submit-page header.

**Last verified:** 2026-05-19
**Maturity:** MEDIUM. Reddit's web client supports drafts cleanly; the complication is per-subreddit rules.
**Expected duration:** 8-15 seconds per draft

## Pre-Requirements

- `session_cookies_by_platform.reddit` non-empty (Reddit `reddit_session` cookie + others).
- `drafts_by_platform.reddit` carries: title (≤300 chars), body (≤40000 chars), target subreddit (REQUIRED), media refs (optional), flair (optional).
- Target subreddit must be specified — without it, abort with `failed:unknown` (reason: subreddit_missing).

## Login State Assumption

Cookies provide. First navigation expected at `https://www.reddit.com/`. Login redirect = abort.

## Navigation + Fill Sequence

| Step | Action | Selector / URL | Success Indicator | Failure → reason-class |
|---|---|---|---|---|
| 1 | Navigate | `https://www.reddit.com/submit?type=TEXT` | Submit form loaded | `login_challenge` |
| 2 | Select subreddit | Type subreddit name into community picker; select from dropdown | Subreddit picked (shown in header) | `selector_drift` OR `unknown` if subreddit not found |
| 3 | Fill title | Type into title field | Title text matches | `selector_drift` |
| 4 | Fill body | Type into body field (Markdown editor) | Body text matches | `selector_drift` |
| 5 | (Optional) Set flair | Click flair button → select | Flair set | `selector_drift` (skip if no flair) |
| 6 | Save as draft | Click "Save Draft" button (top-right of submit form) | "Draft saved" confirmation | `selector_drift` |
| 7 | Capture confirmation | Drafts dropdown URL OR toast | Confirmed | `unknown` |

## Selector Notes

Reddit has two web versions: "new Reddit" (default since 2018) and "old.reddit.com". v1 targets new Reddit only. Selectors above verified 2026-05-19.

## Special Constraints

- **Subreddit-specific rules apply.** Each subreddit has rules (title format, body requirements, flair, ratio limits) that automation CANNOT verify. Flow saves the draft; subreddit-rules-check happens before operator hits Post manually.
- **Title vs body fields are separate.** Body is markdown; flow types Markdown directly (no need to render).
- **No automated cross-posting.** v1 saves one draft per Reddit invocation, one subreddit. Cross-posting to multiple subreddits = multiple invocations.
- **Reddit's anti-spam:** rapid drafts across multiple subreddits trigger rate-limit. Pace inter-platform; same subreddit twice in <60s = rate-limit.

## Anti-Patterns

- **No subreddit-rules bypassing.** If subreddit requires flair, flow attempts to set it; if subreddit blocks self-promotion, flow saves draft anyway (rules-check at Post time, not Draft time).
- **No "old.reddit.com" automation.** v1 supports new Reddit only.
- **No automated Reddit-mentions or DM creation.** Stays focused on draft.

## Draft URL Pattern

Drafts area URL:
```
https://www.reddit.com/drafts
```

Per-draft URLs:
```
https://www.reddit.com/drafts/<draft-id>
```

Capture per-draft URL when available (Reddit's URL changes during/after save).

## Publish Variant (D18)

> `--mode=publish` runs steps 1–5 above unchanged, then takes the **Post** action instead of Save-Draft. The submission goes live in the target subreddit. Reached only after the orchestrator's two-stage confirmation gate returns `confirmed`.

| Step | Action | Selector | Success indicator | Failure → reason-class |
|---|---|---|---|---|
| 6′ (replaces draft step 6) | Click **"Post"** | `button` with text "Post" (top-right of the submit form) | Redirect to the submitted post page | `selector_drift` |
| 7′ | Capture live post URL | Read the post URL after the redirect | `post_url` captured | `unknown` |

**post_url pattern:** `https://www.reddit.com/r/<subreddit>/comments/<post_id>/<slug>/`

**On Send failure:** title + body are composed but unposted → automation-agent takes the single Save-Draft fallback action (`fallback-draft`); if that also fails, `fallback-export`. No Send retry. Captcha at any point → `fallback-export`.

**Publish-specific note:** subreddit rules are enforced by Reddit **at Post time** — a `--mode=publish` run can fail at the Post step because the subreddit rejects the submission (missing flair, self-promotion ratio, karma/age gate). Classify a rules-rejection as `failed:unknown` (reason `subreddit_rules`) → `fallback-draft` so the operator can resolve the rule and Post manually. Never retry past a rules-rejection.

## Confidence Notes

v1 confidence: MEDIUM. Reddit's draft feature works; subreddit-rules-check is the operator's responsibility.

## What Goes Wrong (operator-facing)

- **Subreddit not found:** typo in name OR private/quarantined subreddit — abort with `unknown`.
- **Subreddit-rules block post:** draft saves anyway; post fails when operator hits Post (rules-check happens at Post time). Not an automation failure.
- **Required flair missing:** some subreddits require flair selection; if `drafts_by_platform.reddit.flair` is null AND subreddit requires it, draft saves but Post will fail.
- **Captcha:** Reddit shows captchas occasionally — abort with `failed:captcha`.
- **Rate limit:** "You're doing that too much" message — abort with `failed:rate_limit`.
