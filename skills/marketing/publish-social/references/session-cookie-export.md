---
last_verified: 2026-06-13
verifier: audit-wave2
churn: high
---

# Session Cookie Export — Operator Guide

> How to export session cookies from your logged-in browser into `.forsvn/credentials/platforms.json` so publish-social can draft on your behalf. Step-by-step per platform.

## Why session cookies?

Most platforms (LinkedIn / IG / FB / TikTok / YT / Threads / Bluesky / Reddit) do not expose API draft endpoints to non-business apps without OAuth flows + business verification. Session cookies are the only operator-controllable mechanism that:

- Works without registering a developer app per platform
- Doesn't require operator's username/password stored at rest
- Replicates the operator's already-trusted browser session
- Works on free/personal accounts (most API draft endpoints require business tier)

The tradeoff: cookies expire (typically 30 days), are platform-specific, and must be re-exported when stale.

## Where cookies go

File path: `.forsvn/credentials/platforms.json` (gitignored — D16 setup helper creates `.forsvn/credentials/.gitignore` enforcing).

Schema:

```json
{
  "typefully": { "api_key": "..." },
  "linkedin": { "session_cookies": "li_at=...; JSESSIONID=...; bcookie=...;", "expires_hint": "2026-06-19" },
  "instagram": { "session_cookies": "sessionid=...; csrftoken=...;", "expires_hint": "2026-06-19" },
  "facebook": { "session_cookies": "c_user=...; xs=...; fr=...;", "expires_hint": "2026-06-19" },
  "tiktok": { "session_cookies": "sessionid=...; tt_csrf_token=...;", "expires_hint": "2026-06-19" },
  "youtube": { "session_cookies": "SAPISID=...; HSID=...; SSID=...;", "expires_hint": "2026-06-19" },
  "threads": { "session_cookies": "sessionid=...;", "expires_hint": "2026-06-19" },
  "bluesky": { "session_cookies": "<bsky session token>", "expires_hint": "2026-06-19" },
  "reddit": { "session_cookies": "reddit_session=...; token_v2=...;", "expires_hint": "2026-06-19" }
}
```

**`expires_hint`** is operator-supplied — typical: 30 days from export date. publish-social warns when within 7 days of hint; doesn't enforce.

## Export Methods (one of three)

### Method 1: Browser extension (recommended)

Use a cookie-export extension that supports per-domain export to JSON / Netscape format. Examples (verify reputation before installing):

- **Get cookies.txt LOCALLY** (Chrome/Firefox/Edge) — exports cookies in Netscape format
- **EditThisCookie** (Chrome) — per-domain export to JSON
- **Cookie Quick Manager** (Firefox) — per-domain export

Workflow:

1. Log in to the target platform in your normal browser session.
2. Click the extension icon while on the platform's domain.
3. Export cookies for that domain (e.g., `linkedin.com`).
4. Copy the relevant cookies into platforms.json as a semicolon-separated string.

### Method 2: DevTools manual extract

For a single platform without installing extensions:

1. Log in to the platform.
2. Open DevTools (F12) → **Application** tab (Chrome) or **Storage** tab (Firefox).
3. Click **Cookies** → select the platform's domain.
4. Copy each session cookie's name + value.
5. Format as `name=value; name=value; ...` in platforms.json.

### Method 3: cURL-style export

Some operators use `curl --cookie-jar` workflows. The exported cookies.txt file can be loaded by agent-browser directly; in that case, put the file path in platforms.json instead of the cookie string:

```json
"linkedin": { "session_cookies_file": ".forsvn/credentials/linkedin-cookies.txt", "expires_hint": "2026-06-19" }
```

publish-social formatter detects `session_cookies_file` (alternative to `session_cookies`); reads the file at invocation. File must be inside `.forsvn/credentials/` (gitignored).

## Which Cookies Matter (Per Platform)

You don't need every cookie — only the session-identifying ones. Less is more (smaller cookie strings = less log risk).

| Platform | Required cookies (minimum) |
|---|---|
| LinkedIn | `li_at`, `JSESSIONID`, `bcookie` |
| Instagram | `sessionid`, `csrftoken`, `ds_user_id` |
| Facebook | `c_user`, `xs`, `fr`, `datr` |
| TikTok | `sessionid`, `tt_csrf_token`, `tt_webid_v2` |
| YouTube | `SAPISID`, `HSID`, `SSID`, `SID`, `APISID`, `__Secure-3PSID` |
| Threads | `sessionid` (Threads shares IG auth; if IG works, Threads should) |
| Bluesky | Bluesky-specific session token (1 cookie typically) |
| Reddit | `reddit_session`, `token_v2`, `loid` |

Cookies above verified 2026-05-19. Platforms may add/remove cookies; if automation fails with `failed:login_challenge` after fresh export, re-check current cookie set in DevTools.

## Refreshing Cookies

When publish-social warns "session may expire soon" (within 7 days of `expires_hint`) or fails with `login_challenge`:

1. Open the platform in your normal browser; confirm you're still logged in (re-login if not).
2. Re-export cookies using your preferred method (above).
3. Update platforms.json with the new cookie string.
4. Optionally bump `expires_hint` by 30 days from today.
5. Re-run publish-social.

## Safety Rules

1. **Never paste cookies into chat, Slack, email, PR descriptions, or any artifact outside `.forsvn/credentials/`.**
2. **`.forsvn/credentials/` is gitignored** — D16 setup helper enforces. Verify the `.gitignore` line is present (`cat .gitignore | grep .forsvn/credentials`).
3. **Cookies are equivalent to your password.** Treat them with the same care. Compromised cookies = compromised account.
4. **Use per-machine cookies.** If you work on multiple machines, export cookies separately per machine; don't sync `.forsvn/credentials/` across machines (cookies can be tied to IP / device fingerprint).
5. **Revoke when done.** When you stop using publish-social for a platform, log out from the platform in your browser (invalidates the cookies) AND remove the entry from platforms.json.
6. **Critic dim 7 enforces** — publish-social greps all emitted bundle files for cookie-string substrings; any match auto-fails the run.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `failed:login_challenge` immediately on Step 1 | Cookies stale or invalid | Re-export from logged-in browser |
| `failed:login_challenge` mid-flow | Platform asked for MFA / security re-check | Complete challenge in browser; re-export |
| `failed:captcha` | Bot-detection triggered | Wait 24-48h; re-run; consider reducing automation frequency for that platform |
| `failed:rate_limit` | Too many actions in window | Wait + retry; consider `--exclude=<platform>` for high-volume sessions |
| `failed:selector_drift` | Platform UI changed | Update flow spec in `references/automation-flows/[platform].md`; submit PR or wait for D17.next sync slice |
| Cookies work in browser but not agent-browser | User-Agent mismatch (some platforms check) | Configure agent-browser to use the same User-Agent as your normal browser |

## Per-Platform Notes

- **LinkedIn:** most stable; `li_at` is the primary session cookie; 30-day expiry typical.
- **Instagram:** sometimes asks "Was this you?" on automated sessions; clear in browser.
- **Facebook:** Pages automation requires the `c_user` cookie matching the user with admin rights on the target Page.
- **TikTok:** strictest; cookies may be tied to device fingerprint; re-export after IP changes.
- **YouTube:** Google's SAPISID-based auth; multiple cookies required; expires faster (~7-14 days typical).
- **Threads:** shares IG auth — if IG cookies work, Threads likely does too.
- **Bluesky:** uses AT Protocol session tokens; simpler structure than other platforms.
- **Reddit:** `reddit_session` is the key cookie; expires ~1 year (longest-living of the 8).
