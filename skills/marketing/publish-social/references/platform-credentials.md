# Platform Credentials — publish-social

> Auth contract for the API-draft route. Env vars are primary; `.forsvn/credentials/platforms.json` is the gitignored fallback. v1 only uses Typefully credentials; other entries are stubs for D17+.

## Detection Rules (auto-detect mode)

The formatter-agent probes for credentials in this order at invocation:

1. **Environment variable** — read directly from `process.env` (Bun) / `os.environ` (Python). Listed names below.
2. **`.forsvn/credentials/platforms.json`** — file read if exists; key path is `<service>.<credential_field>` (e.g., `typefully.api_key`).

If neither source provides a value, `credentials_state.<service> = false`. If env var is set OR the file has a non-empty value at the expected path, `credentials_state.<service> = true`.

**Never read the value into any output.** Detection is binary. The value is used only by the API call itself (and dropped immediately after).

## v1 Credentials (Typefully only)

### Typefully API key

- **Env var:** `TYPEFULLY_API_KEY`
- **File path:** `.forsvn/credentials/platforms.json` → `typefully.api_key`
- **Format:** Typefully's API keys are alphanumeric strings (~32 chars)
- **Where to get:** typefully.com → Settings → API → "Generate API key" (free tier available)
- **Scope used:** `POST /v1/drafts/` (draft creation only — no publish endpoint called by D16)

## v2+ Credentials (Stubs — Not Used in D16)

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
