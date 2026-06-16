# iOS App Store Publishing

Publish an archived iOS app (`.xcarchive`) to App Store Connect — production review or TestFlight. `./ios-cli publish` builds the archive, distribution-signs it, uploads to App Store Connect, sets metadata, and submits in one workflow.

## CRITICAL RULES

1. **NEVER make raw HTTP/curl calls.** Always use `./ios-cli`. Every App Store Connect call routes through it.
2. **App Store Connect API key auth is required.** Password / GSA auth is rejected for publishing. The API key needs Admin or App Manager role. Run `./ios-cli auth apikey ...` (see [First-Time Setup](#first-time-setup)) before any publish call.
3. **For App Store screenshots, see [screenshots.md](screenshots.md).** It has everything needed to produce App-Store-ready PNGs.
4. **Production needs full metadata.** Description, keywords, privacy/support URLs, primary category, copyright, review contact, and screenshots are required by App Store Connect's readiness gate. See [publishing-production.md](publishing-production.md) for the schema.
5. **Build with `--user` matching the API-key owner.** Apple credentials bind at build time; a build run without `--user` (or with a different user) fails the `build_exists` readiness check and forces a rebuild.

## Environment

`./ios-cli` reads:

- `VIBECODE_API_KEY` — Authentication (required)
- `SIGNING_SERVICE_URL` — Service URL (auto-detected; defaults to production)
- `VIBECODE_PROJECT_ID` — Project ID
- `VIBECODE_USER_ID` — Default user ID (fallback for `--user`)

## Flow at a glance

1. **Auth** — `./ios-cli auth apikey ...` (see [First-Time Setup](#first-time-setup)). One-time per API key.
2. **Build** — `./ios-cli build <zip> --user <userId>` from the `build-ios-apps` skill. `<userId>` must match the API-key owner from step 1 (`./ios-cli auth status`). Returns a `buildJobId`.
3. **Screenshots** (production only) — generate via [screenshots.md](screenshots.md), upload, collect URLs into the metadata's `screenshots` array.
4. **Preflight** — `./ios-cli publish preflight --target <target> --build <buildJobId> --metadata <metadata.json>`. Surfaces gaps before the real submission. See [publishing-readiness.md](publishing-readiness.md).
5. **Publish** — `./ios-cli publish start ...` (production) or `./ios-cli publish testflight ...`. See [publishing-production.md](publishing-production.md) or [publishing-testflight.md](publishing-testflight.md).

## Writing release notes (`whatsNew`)

For a new version of an existing app, `whatsNew` is required by App Store Connect's readiness gate (≤4000 chars). To author it: read the git log between the last shipped tag and HEAD, summarize user-visible changes (bullet points, present tense, no internal-tool names like "fix(auth)"). Keep it user-focused — what changed for the user, not what changed in the code. For first releases, `whatsNew` can be empty.

## Targets

- **`production`** — App Store submission. Goes through full metadata, screenshots, and readiness gate.
- **`testflight`** — internal or external beta. See [publishing-testflight.md](publishing-testflight.md).

## CLI

Run `./ios-cli publish --help` for the publishing surface.

## First-Time Setup

App Store Connect API key auth is the only supported path for publishing. The user (or operator) generates the key once at appstoreconnect.apple.com → Users and Access → Integrations → App Store Connect API. You'll need:

- **Issuer ID** (UUID at the top of the page)
- **Key ID** (per-key UUID after generation)
- **Private key file** (`.p8`, downloaded once at generation)
- **Team ID** (Apple Developer team)

Persist the credentials once:

```bash
./ios-cli auth apikey \
  --issuer-id <issuer-id> \
  --key-id <key-id> \
  --p8-key </path/to/AuthKey_XXXX.p8> \
  --team-id <team-id>
```

After this, every `./ios-cli publish ...` command authenticates automatically. Re-run only when the key rotates.

## Routing

- **Production submission** — see [publishing-production.md](publishing-production.md). Includes the metadata JSON schema.
- **TestFlight (internal or external)** — see [publishing-testflight.md](publishing-testflight.md).
- **Preflight check names + remediation** — see [publishing-readiness.md](publishing-readiness.md).
- **App Store Connect rules + ITMS errors + manual prerequisites** — see [publishing-gotchas.md](publishing-gotchas.md).
- **App Store screenshots** — see [screenshots.md](screenshots.md).
