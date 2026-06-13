---
last_verified: 2026-06-13
verifier: audit-wave2
churn: high
---

# Platform Credentials — publish-social

> Auth contract for the API-draft route. Env vars are primary; `.forsvn/credentials/platforms.json` is the gitignored fallback. v1 only uses Typefully credentials; other entries are stubs for D17+.

## Detection Rules (auto-detect mode)

The formatter-agent probes for credentials in this order at invocation:

1. **Environment variable** — read directly from `process.env` (Bun) / `os.environ` (Python). Listed names below.
2. **`.forsvn/credentials/platforms.json`** — file read if exists; key path is `<service>.<credential_field>` (e.g., `typefully.api_key`).

If neither source provides a value, `credentials_state.<service> = false`. If env var is set OR the file has a non-empty value at the expected path, `credentials_state.<service> = true`.

**Never read the value into any output.** Detection is binary. The value is used only by the API call itself (and dropped immediately after).

## v1 Credentials (Typefully — D16)

### Typefully API key

- **Env var:** `TYPEFULLY_API_KEY`
- **File path:** `.forsvn/credentials/platforms.json` → `typefully.api_key`
- **Format:** Typefully's API keys are alphanumeric strings (~32 chars)
- **Where to get:** typefully.com → Settings → API → "Generate API key" (free tier available)
- **Scope used:** `POST /v1/drafts/` (draft creation only — no publish endpoint called by D16)

## D17 Credentials (Session Cookies — 8 platforms)

D17 introduces `session_cookies` field for browser-automation draft route. One entry per supported platform:

| Platform | File path | Field name |
|---|---|---|
| LinkedIn | `linkedin.session_cookies` | string (semicolon-separated cookie name=value pairs) |
| Instagram | `instagram.session_cookies` | string |
| Facebook | `facebook.session_cookies` | string |
| TikTok | `tiktok.session_cookies` | string |
| YouTube | `youtube.session_cookies` | string |
| Threads | `threads.session_cookies` | string |
| Bluesky | `bluesky.session_cookies` | string |
| Reddit | `reddit.session_cookies` | string |

Plus an optional `expires_hint` field per platform (operator-supplied YYYY-MM-DD; publish-social warns within 7 days of hint).

Plus an optional `session_cookies_file` field (alternative to inline string — path to a cookies.txt file inside `.forsvn/credentials/`).

### Schema with D17 additions

```json
{
  "typefully": { "api_key": "..." },
  "linkedin": { "session_cookies": "li_at=...; JSESSIONID=...; bcookie=...;", "expires_hint": "2026-06-19" },
  "instagram": { "session_cookies": "sessionid=...; csrftoken=...;", "expires_hint": "2026-06-19" },
  "facebook": { "session_cookies": "c_user=...; xs=...;", "expires_hint": "2026-06-19" },
  "tiktok": { "session_cookies": "sessionid=...; tt_csrf_token=...;", "expires_hint": "2026-06-19" },
  "youtube": { "session_cookies": "SAPISID=...; HSID=...; SSID=...;", "expires_hint": "2026-06-19" },
  "threads": { "session_cookies": "sessionid=...;", "expires_hint": "2026-06-19" },
  "bluesky": { "session_cookies": "<bsky session token>", "expires_hint": "2026-06-19" },
  "reddit": { "session_cookies": "reddit_session=...; token_v2=...;", "expires_hint": "2026-06-19" }
}
```

### Detection rule for D17 (per platform)

- Probe env var: `<PLATFORM>_SESSION_COOKIES` (e.g., `LINKEDIN_SESSION_COOKIES`). If non-empty → `credentials_state[platform] = true`.
- Else probe `.forsvn/credentials/platforms.json` → `<platform>.session_cookies` non-empty OR `<platform>.session_cookies_file` exists → `credentials_state[platform] = true`.
- Else → `credentials_state[platform] = false`.

`credentials_state` is binary; value never logged.

### Per-platform freshness

Operator-supplied `expires_hint` is a YYYY-MM-DD string. publish-social warns "session may expire soon" when current date is within 7 days of hint. Doesn't enforce — operator decides whether to re-export.

### Cookie value handling

- Value passed to automation-agent at dispatch time only (never logged, never written to bundle).
- Value passed to `agent-browser` invocation as cookie payload (agent-browser handles cookie injection; assumed not to log).
- Critic dim 7 enforces: greps all emitted files + logs for substring matches of cookie values; any match = auto-fail.

### Session-cookie export workflow

See [`session-cookie-export.md`](session-cookie-export.md) for the per-platform operator guide (browser-extension method, DevTools manual extract, cURL-style export).

## D18 Credentials (Publish Mode — No New Credential Type)

`--mode=publish` (D18) reuses the **exact same credentials** as D17 draft mode — no new key, token, or cookie type is introduced:

- **X:** the same `TYPEFULLY_API_KEY`. D16 called Typefully's draft endpoint; D18 calls Typefully's create-draft endpoint with `schedule-date` set to immediate / next-free-slot (schedule-immediate publish). Same key, same scope tier.
- **The other 8 platforms:** the same per-platform `session_cookies`. D17's automation flow saved a draft; D18's Publish Variant of the same flow clicks Send. Same cookie string, same `expires_hint`.

**Credentials do not authorize publish — the gate does.** Possessing a valid cookie or API key is necessary but not sufficient. A publish run still requires the two-stage confirmation gate (`references/publish-confirmation-gate.md`): credential presence routes a platform to the publish path; only the operator's typed `PUBLISH` actually sends. Auto-detect never resolves to publish regardless of which credentials are present (Critical Gate 1).

All D17 cookie-safety rules apply unchanged: values passed to automation-agent at dispatch only, never logged, never written to the bundle, critic dim 6 + 7 grep enforced.

## v2+ Credentials (Stubs — Not Used in D16/D17/D18)

The `.forsvn/credentials/platforms.json` schema reserves slots for D17 / D18 expansions. Stubs below are for documentation only — D16 never reads these fields.

### Buffer API token

- **Env var:** `BUFFER_ACCESS_TOKEN`
- **File path:** `buffer.access_token`
- **Used by:** future D17 slice for Buffer-native draft API (currently the operator imports CSV manually)

### Hootsuite OAuth token

- **Env var:** `HOOTSUITE_ACCESS_TOKEN`
- **File path:** `hootsuite.access_token`
- **Used by:** future D17 slice

### LinkedIn / Instagram / Facebook OAuth

- Reserved for D17 browser-automation route OR future API-based route
- File path schema: `linkedin.access_token`, `instagram.access_token`, `facebook.access_token`

## File Location & Gitignore

**Path:** `.forsvn/credentials/platforms.json`

**Setup helper (auto):** when a draft-capable platform is targeted AND no credentials detected, the formatter-agent:

1. Creates `.forsvn/credentials/` directory if missing.
2. Creates `.forsvn/credentials/.gitignore` with contents:
   ```
   *
   !.gitignore
   !*.example
   ```
   (Gitignore everything except the `.gitignore` file itself and `*.example` stubs.)
3. Creates `.forsvn/credentials/platforms.json.example` with stub:
   ```json
   {
     "typefully": { "api_key": "<your-typefully-api-key>" },
     "buffer": { "access_token": "<reserved-D17-not-used-in-D16>" },
     "hootsuite": { "access_token": "<reserved-D17-not-used-in-D16>" }
   }
   ```
4. Verifies root `.gitignore` has `.forsvn/credentials/` listed; appends if missing:
   ```
   .forsvn/credentials/
   !.forsvn/credentials/*.example
   ```
5. Mentions in README: "To enable Typefully draft on next run, copy `.forsvn/credentials/platforms.json.example` to `.forsvn/credentials/platforms.json` and fill in your Typefully API key (free tier: typefully.com → Settings → API)."

## Safety Constraints (Critical Gate 3)

These are non-negotiable. Critic dim 6 enforces.

1. **Credential values never logged.** No `console.log`, no `print`, no skill-output text contains the key. Error messages reference the env var NAME or file PATH only.
2. **Credential values never written to any artifact.** Manifest, README, per-platform drafts, scheduler-imports — none of them carry the key.
3. **`.forsvn/credentials/` is gitignored.** Setup helper enforces; root `.gitignore` must list the directory.
4. **`credentials_detected` in manifest is binary only.** `true` / `false`, never the value.
5. **API call error messages redacted.** If Typefully API returns an error, log only the HTTP status code + Typefully's error code (not the request payload, which contains the key in the Authorization header).
6. **No credential values in env-var-name table either.** `TYPEFULLY_API_KEY` (the variable name) is fine to print; the VALUE of that variable is not.

## Detection Algorithm (formatter-agent pseudocode)

```pseudo
def detect_credentials():
    state = {}
    file_creds = {}
    if exists(".forsvn/credentials/platforms.json"):
        file_creds = json.load(".forsvn/credentials/platforms.json")
    for service in ["typefully", "buffer", "hootsuite", "linkedin", "instagram", "facebook"]:
        env_var = service.upper() + "_API_KEY"  # or _ACCESS_TOKEN per spec table above
        env_val = os.environ.get(env_var, "")
        file_val = file_creds.get(service, {}).get("api_key", "") or file_creds.get(service, {}).get("access_token", "")
        state[service] = bool(env_val) or bool(file_val)
    return state

def get_credential(service, field):
    """Used at API-call time only. Returns value to pass into the API; caller must not log or include it in output."""
    env_var = f"{service.upper()}_API_KEY"
    val = os.environ.get(env_var, "")
    if val:
        return val
    file_creds = json.load(".forsvn/credentials/platforms.json") if exists else {}
    return file_creds.get(service, {}).get(field, "")
```

## Operator Setup Flow (manual)

For a first-time operator who wants to enable Typefully draft:

1. Sign up at typefully.com (free tier).
2. Settings → API → Generate API key.
3. Set env var: `export TYPEFULLY_API_KEY="<your-key>"` (in shell rc file) OR
4. Edit `.forsvn/credentials/platforms.json` (gitignored): `{ "typefully": { "api_key": "<your-key>" } }`.
5. Next publish-social run will auto-detect and route X to Typefully draft.

No credentials → all 9 platforms emit as scheduler-import + per-platform Markdown drafts. Operator pastes one CSV/JSON into their scheduler tool. Equally valid; just one extra paste step.
