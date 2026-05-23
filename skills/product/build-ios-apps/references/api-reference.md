# Signing Service API Reference

Base URL: `${SIGNING_SERVICE_URL}` (defaults to `https://ios.chorus.com`)

All `/api/*` requests require authentication via the `Authorization` header:

```
Authorization: Bearer $VIBECODE_API_KEY
```

All requests/responses are `Content-Type: application/json`.
Errors: `{"error": "message"}` with appropriate HTTP status.

Public routes (no auth needed): `/health`, `/install/*`, `/register/*`, `/manifest/*`, `/ipa/*`.

---

## Apple Authentication

Two methods for authenticating with Apple. **Auth is one-time only** — once a `userId` is authenticated, it persists across all future signing requests. You never need to re-authenticate the same userId. Signing assets (certs, keys, profiles) are cached per user and reused automatically.

Check if a userId is already saved: `cat ./user-id.txt` (relative to the skill directory).
If it exists, skip auth entirely and go straight to `/api/sign`.

### Method 1: API Key (recommended for automation)

No 2FA, no polling. Ready immediately.

```
POST /api/auth/apikey
```

```json
{
  "userId": "my-user",
  "issuerID": "0940870d-61c8-44b1-a646-5a24bf17d012",
  "keyID": "XP2T5GJP75",
  "p8Key": "-----BEGIN PRIVATE KEY-----\nMIGT...pUJn\n-----END PRIVATE KEY-----",
  "teamId": "8V56LM5E58"
}
```

- `userId` — optional, auto-generated UUID if omitted
- `issuerID` — from App Store Connect > Users and Access > Integrations > Keys
- `keyID` — the key identifier (matches the filename `AuthKey_{keyID}.p8`)
- `p8Key` — full `.p8` file contents including BEGIN/END headers
- `teamId` — Apple Developer team ID

**Response:** `{"ok": true, "userId": "my-user"}`

**IMPORTANT:** The `keyID` must match the actual key, not something else. The `.p8` filename convention is `AuthKey_{keyID}.p8` — use the ID from the filename.

### Method 2: Apple ID + Password (interactive)

Requires polling and 2FA. Better for one-time setup.

**Step 1 — Start auth:**

```
POST /api/auth/start
{"username": "user@example.com", "password": "secret", "userId": "my-user"}
```

Response: `{"sessionId": "...", "userId": "my-user"}`

**Step 2 — Poll status:**

```
GET /api/auth/status/{sessionId}
```

Response includes `state`, `output`, and `teams` (when applicable).

States: `authenticating` → `awaiting_2fa` → `authenticating` → `awaiting_team` → `authenticated`

**Step 3 — Respond to prompts:**

```
POST /api/auth/respond
{"sessionId": "...", "value": "123456"}  // 2FA code
{"sessionId": "...", "value": "1"}       // team selection (1-based index or teamId)
```

Poll `/api/auth/status/{sessionId}` after each respond to see updated state.

SRP session is persisted — subsequent signs auto-refresh the token (~1 year validity, no re-login needed).

---

## Building

### POST /api/build

Upload a source zip to build an unsigned iOS app on a cloud macOS build server.

**Request**: Send the zip as either:
- `multipart/form-data` with a `file` field
- Raw body with `Content-Type: application/zip`

```bash
# multipart (recommended)
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/build \
  -H "Authorization: Bearer $VIBECODE_API_KEY" \
  -F "file=@source.zip"

# raw body
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/build \
  -H "Authorization: Bearer $VIBECODE_API_KEY" \
  -H "Content-Type: application/zip" --data-binary @source.zip
```

Zip must contain a `.xcodeproj` within 3 levels. Max 500 MB. A single top-level wrapper directory is fine.

**Response:**
```json
{"buildJobId": "uuid", "statusUrl": "https://ios.chorus.com/api/build-jobs/uuid"}
```

### GET /api/build-jobs/{jobId}

Poll build status. Typical build time: 2-5 minutes.

```json
{
  "id": "uuid",
  "state": "built",
  "error": null,
  "appUrl": "https://iosbuilds.composerapi.com/raw-builds/uuid.tar.gz",
  "createdAt": 1710900000
}
```

States: `uploading` → `building` → `built` | `failed`

When `state: "built"`, pass `appUrl` to `POST /api/sign`.

### GET /api/build-jobs/{jobId}/logs

Fetch pipeline logs from Azure DevOps. Use this when a build fails to understand why.

```json
{
  "logs": [
    {"id": 1, "lineCount": 42, "text": "Starting: Initialize job\n..."},
    {"id": 2, "lineCount": 15, "text": "Starting: Checkout\n..."}
  ]
}
```

Returns one entry per pipeline task/step. Only available after the Azure pipeline run has started (state must be past `uploading`).

**Errors:** `404` if job not found, `400` if pipeline hasn't started yet, `500` if Azure API fails.

---

## Signing

### POST /api/sign

Starts async signing. Returns immediately — poll build status.

```json
{
  "userId": "my-user",
  "appUrl": "https://iosbuilds.composerapi.com/raw-builds/{buildId}.tar.gz",
  "projectId": "optional-tracking-id"
}
```

- `appUrl` — URL to a `.tar.gz` containing a `.app` bundle (max 500 MB). Must point to an allowed host (`iosbuilds.composerapi.com` or `localhost`).
- Archive format: `MyApp.app/` at root or inside `Payload/` directory

**Response:**

```json
{
  "buildId": "uuid",
  "installUrl": "https://ios.chorus.com/install/{buildId}",
  "statusUrl": "https://ios.chorus.com/api/builds/{buildId}"
}
```

### GET /api/builds/{buildId}

Poll until `state` is `signed` or `failed`. Recommended interval: 2-3 seconds.

```json
{
  "id": "uuid",
  "state": "signed",
  "bundle_id": "com.example.app",
  "bundle_name": "MyApp",
  "error": null,
  "installUrl": "https://ios.chorus.com/install/{buildId}"
}
```

States: `pending` → `signing` → `signed` | `failed`

When `state: "failed"`, check `error` for the reason.

---

## OTA Installation

### GET /install/{buildId}

HTML page with an `itms-services://` link. Open on iPhone to install.
Only works when build `state: "signed"`.

You can also build a custom installation page and link to the build. You can host the custom installation page on [https://chorus.host](https://chorus.host) pretty easily.

### GET /manifest/{buildId}.plist

OTA manifest XML. Called internally by iOS — not for direct use.

### GET /ipa/{buildId}.ipa

Download the signed IPA binary directly.

---

## Errors


| Status | Error                                            | Cause                                  |
| ------ | ------------------------------------------------ | -------------------------------------- |
| 401    | `Missing Authorization header`                   | No Bearer token provided               |
| 401    | `Invalid API key format`                         | Token doesn't start with `vibecode_`   |
| 401    | `Invalid API key`                                | API key not found in database          |
| 400    | `userId and appUrl required`                     | Missing fields on /api/sign            |
| 400    | `appUrl must use http or https`                  | Non-HTTP protocol                      |
| 400    | `appUrl must point to an allowed host`           | Hostname not in allowlist              |
| 400    | `No team selected — authenticate first`          | User not fully authenticated           |
| 400    | `username and password required`                 | Missing credentials on /api/auth/start |
| 400    | `Invalid API key material: ...`                  | Bad .p8 key on /api/auth/apikey        |
| 403    | `userId already belongs to a different Apple ID` | userId conflict                        |
| 404    | `User not found — authenticate first`            | Unknown userId                         |
| 404    | `Session not found`                              | Invalid/expired sessionId              |
| 404    | `Build not found`                                | Invalid buildId                        |


### Async build errors (in `error` field when `state: "failed"`)


| Error                                                       | Cause                                |
| ----------------------------------------------------------- | ------------------------------------ |
| `No .app found in archive`                                  | tar.gz doesn't contain a .app bundle |
| `curl failed (code N): ...`                                 | Failed to download appUrl            |
| `No registered iOS devices were found in App Store Connect` | No devices for provisioning profile  |
| `App Store Connect request failed (409): ...`               | Certificate conflict (existing cert) |
| `zsign failed (code N): ...`                                | Code signing failed                  |



---

## Publishing (App Store Connect)

Publish an iOS app to the App Store or TestFlight. All endpoints require
`Authorization: Bearer vibecode_<key>` (same as every other `/api/*` path).

**Ownership gate:** publish endpoints reject builds that were not created with
an authenticated signing user (`x-user-id` header on `/api/build`). Legacy
users whose `owner_id` is null get 403 on every publish endpoint until they
re-authenticate via `/api/auth/apikey`.

### POST /api/publish/preflight

Dry-run readiness check. Returns `ready: boolean` plus per-check messages.
Never mutates Apple-side state.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/preflight \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "buildJobId":"job-uuid",
    "bundleId":"com.example.app",
    "version":"1.0.0"
  }'
```

### POST /api/publish/attempts

Kick off the full publish workflow: archive → sign → upload → ASC metadata →
submit for review. Returns `attemptId` and a `statusUrl` for polling.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/attempts \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "buildJobId":"job-uuid",
    "bundleId":"com.example.app",
    "appName":"My App",
    "version":"1.0.0",
    "scheme":"MyApp",
    "target":"production"
  }'
```

### GET /api/publish/attempts/{attemptId}

Poll publish state. Response includes `status`, `currentStep`, `completedSteps`,
`submissionId` (once review was submitted), and on failure `appleErrorCode` +
`recovery` + `recoveryEndpoint` (the endpoint to call to retry just the failed
step instead of re-running the whole pipeline).

Possible `status` values: `queued`, `running`, `needs_manual_action`,
`completed`, `failed`. `needs_manual_action` means the submission reached
Apple but local state is uncertain — resolve via `/api/publish/resolve-attempt`
after confirming ASC state.

### POST /api/publish/metadata

Update store listing (description, keywords, screenshots, policy URLs) on an
existing App Store version. Use this to retry just the metadata step after a
publish attempt failed at `setting_metadata` — no rebuild needed.

### POST /api/publish/compliance

Set export compliance on the build attached to an App Store version. Apple's
`usesNonExemptEncryption` field lives on the `builds` resource (not
`appStoreVersions`); this route resolves the version → build chain and PATCHes
the build. Body: `{userId, bundleId, version, usesNonExemptEncryption: boolean,
encryptionDeclarationId?: string, expectedBuildId?: string}`. Pass
`expectedBuildId` to refuse the write if a different build is currently attached
(race protection). Returns 400 when `usesNonExemptEncryption=true` without a
declaration id; 409 when `expectedBuildId` doesn't match the attached build;
returns 200 with `{ok, buildId}` otherwise.

### POST /api/publish/submit-review

Submit an existing App Store version for App Review. Verifies the version has
a `VALID` build attached before submitting — returns 400 with guidance if not.

### POST /api/publish/resolve-attempt

Operator path to transition a `needs_manual_action` attempt to `completed` or
`failed`. Required after a post-submit failure where Apple may have accepted
the submission but local persistence failed. Requires `userId`, `resolution`,
and (for `failed`) `reason`. Atomic UPDATE scoped to the owning user.

### GET /api/publish/app-info?userId=&bundleId=

Current app state in ASC (iOS platform only): versions + appStoreStates.

### GET /api/publish/review-status?userId=&bundleId=

Versions currently in review for the app (iOS platform only).

### POST /api/publish/cancel-review

Cancel an in-flight review submission so a later version can take Apple's
"one in-flight per platform" slot. When `submissionId` is omitted the route
resolves the active submission for the bundle.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/cancel-review \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "bundleId":"com.example.app"
  }'
# → {ok:true, cancelledSubmissionId:"submission-uuid"}
```

### POST /api/publish/submit-prepared

Submit an existing App Store version that already has a build attached and
metadata set. Skips `runReadiness` (which validates caller-supplied metadata)
and runs only `runAscValidateCheck` against Apple's stored state — useful
when the version is already prepared on Apple's side and you just need to
push it into the review queue. Body: `{userId, bundleId, version, target}`.

### POST /api/publish/upload-screenshot

Upload a single PNG and return the public URL for use in
`metadata.screenshots[]` or `metadata.screenshotUrls[]`. Validates the PNG
IHDR header, checks dimensions against Apple's device-type matrix, rejects
payloads larger than 8 MiB.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/upload-screenshot \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "fileName":"01_hero.png",
    "fileSize":192034,
    "fileBase64":"iVBORw0KGgo..."
  }'
# → {ok:true, url:"https://.../screenshots/...png", deviceType:"IPHONE_69", width:1320, height:2868}
```

### GET /api/publish/screenshots?userId=&bundleId=&version=&locale=

Inventory the screenshot SETs currently attached to a version-localization.
Locale defaults to `en-US`. Use this to inspect Apple's state before
deciding to overwrite or purge stale sets.

```bash
curl -G ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/screenshots \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  --data-urlencode "userId=user-123" \
  --data-urlencode "bundleId=com.example.app" \
  --data-urlencode "version=1.0.0"
# → {ok:true, appId:"...", versionId:"...", locale:"en-US", sets:[{setId, displayType, screenshots:[{id, fileName, width, height, state}]}]}
```

### POST /api/publish/delete-screenshot

Delete a single screenshot by id. `screenshotId` must match
`[A-Za-z0-9_-]{8,}` — body-sourced ids are validated to block path-traversal
injection at the ASC URL boundary.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/delete-screenshot \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "screenshotId":"screenshot-uuid"
  }'
# → {ok:true, deletedId:"screenshot-uuid"}
```

### POST /api/publish/delete-screenshot-set

Delete an entire `appScreenshotSet` (and all screenshots in it). The asc
CLI doesn't expose set-level deletion, so this route hits
`DELETE /v1/appScreenshotSets/{id}` directly. Use after `delete-screenshot`
removes every screenshot in a set — Apple's submission readiness rejects
empty sets ("Upload at least one screenshot to this set"). `setId` is
pattern-validated and `encodeURIComponent`'d at the ASC URL boundary.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/delete-screenshot-set \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "setId":"set-uuid"
  }'
# → {ok:true, deletedId:"set-uuid"}
```

### POST /api/publish/routing-coverage

Upload a routing app's coverage file (`.geojson`) describing the
geographic regions the app provides routing for — used by transit,
ride-share, navigation, and similar apps that declare
`MKDirectionsApplicationSupportedModes` in their Info.plist. Apple
content-validates the GeoJSON shape: reject reasons surface as
`assetDeliveryState.errors[].code` (commonly `TRANSIT_APP_FILE_INVALID_JSON`).
The build's pbxproj must declare `INFOPLIST_KEY_MKDirectionsApplicationSupportedModes`
for Apple to accept the upload — see [Routing apps section in SKILL.md](../SKILL.md#routing-apps-transit-ride-share-navigation).
Apple-side `assetDeliveryState: COMPLETE` additionally requires the bundle id
to be registered at https://mapsconnect.apple.com — outside pipeline scope.
Cap: 10 MiB.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/routing-coverage \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "bundleId":"com.example.routing",
    "version":"1.0.0",
    "fileName":"coverage.geojson",
    "fileSize":422,
    "fileBase64":"<base64>"
  }'
# → {ok:true, routingCoverageId:"uuid", fileSize:422}
```

### POST /api/publish/delete-routing-coverage

Clear a stuck routing-coverage record (typically one in FAILED state).
Idempotent — returns `{deletedId: ""}` when nothing was attached.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/delete-routing-coverage \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "bundleId":"com.example.app",
    "version":"1.0.0"
  }'
# → {ok:true, deletedId:"uuid-or-empty-string"}
```

### POST /api/publish/review-attachment

Upload a file as the App Store reviewer attachment on the version's
`appStoreReviewDetail`. Useful for demo videos, sign-in walkthroughs,
third-party SDK auth proofs. Apple caps at one attachment per version;
uploading a second returns 500 with "There can be max of 1 attachment,
please delete the existing attachment before loading a new one."
Auto-creates the review-detail record if the version has none. Cap:
100 MiB. PDF / MP4 / PNG / MOV accepted; `.txt` returns a generic Apple
error.

```bash
curl -X POST ${SIGNING_SERVICE_URL:-https://ios.chorus.com}/api/publish/review-attachment \
  -H "Authorization: Bearer vibecode_${VIBECODE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-123",
    "bundleId":"com.example.app",
    "version":"1.0.0",
    "fileName":"demo.pdf",
    "fileSize":305,
    "fileBase64":"<base64>"
  }'
# → {ok:true, appId:"...", versionId:"...", reviewDetailId:"...", attachmentId:"...", fileName:"demo.pdf", fileSize:305}
```

### POST /api/publish/encryption-declaration

Create or update an Apple encryption declaration for the user's team.
Used when `usesNonExemptEncryption=true` and the binary genuinely uses
custom crypto.

### POST /api/publish/seed-cert

Import an existing distribution cert + private key for a user (rather than
having the pipeline mint a fresh cert). Body:
`{userId, certId, certBase64, keyBase64}`. Both `certBase64` and `keyBase64`
are capped at 64 KiB each post-decode (real Apple distribution certs are
1–2 KB).

### TestFlight surface

- **`POST /api/publish/testflight-group`** — create a beta group.
- **`GET /api/publish/testflight-groups?userId=&bundleId=`** — list beta groups for the app.
- **`POST /api/publish/testflight-tester`** — invite a beta tester to a group.
- **`GET /api/publish/testflight-testers?userId=&groupId=`** — list testers in a group.
- **`DELETE /api/publish/testflight-tester`** — remove a tester from a group.
- **`POST /api/publish/testflight-build-to-group`** — attach an uploaded build to one or more beta groups.
- **`POST /api/publish/testflight-beta-app-info`** — patch `betaAppLocalization` (description, feedback email, marketing URL, privacy URL).
- **`POST /api/publish/testflight-beta-review-submit`** — submit a build for external beta review.
- **`POST /api/publish/testflight-build-expire`** — expire a TestFlight build (force-stop distribution).
- **`POST /api/publish/testflight-public-link`** — toggle a group's public link + optional tester limit.
- **`POST /api/publish/testflight-build-whats-new`** — patch the build-localization "What's New" notes.
- **`GET /api/publish/testflight-builds?userId=&bundleId=`** — list TestFlight builds with processing state.
- **`GET /api/publish/testflight-review-status?userId=&bundleId=&buildId=`** — current external-beta-review status.

### POST /api/publish/release

Release an approved version that's pending developer release.
Body: `{userId, bundleId, version}`.

### POST /api/publish/app-setup

Idempotent post-app-shell setup: pricing, availability, age rating, content
rights, primary category, review contact. Use after creating the app shell
manually in ASC and before the first publish attempt.

### Body size cap

All `/api/*` requests have a body size cap: **16 MiB default**, with
overrides for `/api/build` (500 MB source zips) and
`/api/publish/review-attachment` (100 MiB attachments). Bodies exceeding
the cap return HTTP 413 before the route handler runs.

### Cross-tenant ownership

Build and build-job read endpoints (`GET /api/builds/:buildId`,
`GET /api/build-jobs/:jobId`, `GET /api/build-jobs/:jobId/logs`) enforce
ownership: each request's API key resolves to a user, and only that
user's own builds and build-jobs are returned. Reads of another user's
resource return `403 Forbidden`.
