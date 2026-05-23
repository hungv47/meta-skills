# Production Publish

Submit a cloud-built archive to App Store review.

## Step 1: Preflight (dry-run readiness)

```bash
./ios-cli publish preflight \
  --build <buildJobId> --bundle <id> --version 1.0.0 --target production
# → ready=true|false, checks=[ {name, passed, message} ]
```

Identical gate `start` runs internally. Run this first to surface failures (missing metadata field, version conflict, screenshot URL unreachable, etc.) without actually firing the pipeline. See [publishing-readiness.md](publishing-readiness.md) for what each check enforces.

## Step 2: Start the publish

```bash
./ios-cli publish start \
  --build <buildJobId> --bundle <id> --app "My App" \
  --version 1.0.0 --scheme MyApp --target production \
  --metadata /tmp/meta.json
# → attemptId="..." statusUrl="..."
```

`--metadata` is a path to a JSON file matching the [schema below](#metadata-schema). Add `--no-submit` to run the full pipeline (build → upload → metadata → app-setup) but stop before submit-for-review — pair with [Step 4](#step-4-submit-prepared-only-when---no-submit-was-used) when you want to inspect the version on App Store Connect first.

### Crash reporters (Sentry, Crashlytics, Bugsnag, custom)

The pipeline runs `xcodebuild archive` in the cloud — **every Build Phase Run Script in the `.xcodeproj` fires during archive**. That's how every crash reporter ships its dSYM upload step. The pipeline doesn't know or care which reporter you use; the contract is:

1. **In the project**: add a Run Script Build Phase (after "Embed Pods Frameworks" or equivalent) that sources `.env.managed` and shells the reporter's upload tool. Example skeletons:

   ```sh
   # Sentry
   set -a; [ -f "$SRCROOT/.env.managed" ] && . "$SRCROOT/.env.managed"; set +a
   if which sentry-cli >/dev/null; then
     sentry-cli debug-files upload --include-sources "$DWARF_DSYM_FOLDER_PATH"
   fi
   ```

   ```sh
   # Firebase Crashlytics — auto-discovers GoogleService-Info.plist
   "${PODS_ROOT}/FirebaseCrashlytics/run"
   ```

   For Crashlytics, also list `${DWARF_DSYM_FOLDER_PATH}/${TARGET_NAME}.app.dSYM/Contents/Resources/DWARF/${TARGET_NAME}` + `$(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)` as Input Files.

2. **Set `ENABLE_USER_SCRIPT_SANDBOXING = NO` on the archive target's Release configuration.** Without it the Build Phase script can't read `.env.managed` and the archive fails.

3. **At publish time**: pass the auth tokens via `--env-managed-file`. The pipeline base64-encodes the file, the Azure runner decodes and writes it next to the `.xcodeproj`, and the Build Phase script sources it.

   ```bash
   cat > /tmp/.env.managed <<EOF
   SENTRY_AUTH_TOKEN=sntrys_…
   SENTRY_ORG=acme
   SENTRY_PROJECT=ios
   EOF
   ./ios-cli publish start ... --env-managed-file /tmp/.env.managed
   ```

   The token never lands in source. `.env.managed` is per-publish — different builds can ship different secrets.

For multi-project repos (e.g. an iOS app sitting next to a watchOS extension), pin the right project with `--xcode-project <name>.xcodeproj`. Single-project repos can omit it.

## Step 3: Poll status

```bash
./ios-cli publish status <attemptId>
# → status="running" currentStep="setting_metadata" completedSteps="preparing_assets,..."
```

Production steps: `preparing_assets → building_and_uploading → waiting_for_processing → setting_metadata → submitting_for_review`.

Terminal states: `completed`, `failed`, `prepared` (only when `--no-submit` was used), `needs_manual_action` (operator must resolve via [Step 6](#step-6-force-resolve-a-stuck-attempt)).

## Step 4: Submit prepared (only when `--no-submit` was used)

```bash
./ios-cli publish submit-prepared --bundle <id> --version 1.0.0
# → submissionId="..." submissionAction="..."
```

## Step 5: Cancel an in-flight submission

```bash
./ios-cli publish cancel-review --bundle <id> [--submission <id>]
```

Only works while `WAITING_FOR_REVIEW`. Frees the "one in-flight per platform" slot when you need to replace the in-flight version.

## Step 6: Force-resolve a stuck attempt

```bash
./ios-cli publish resolve --attempt <id> --resolution failed --reason "App Store Connect submission was rejected; restarting from scratch"
./ios-cli publish resolve --attempt <id> --resolution completed
```

Owner-only. `--reason` is required when `--resolution=failed`. Use only when an attempt is stuck in `needs_manual_action` and the underlying issue has been fixed out-of-band.

## Step 7: Release a Pending-Developer-Release version

```bash
./ios-cli publish release --bundle <id> --version 1.0.0
```

When the app's `releaseType` is `MANUAL`, App Store Connect parks the approved version in `PENDING_DEVELOPER_RELEASE` until this is called. `AFTER_APPROVAL` apps auto-release.

## Other production verbs

| Command | Purpose |
|---|---|
| `./ios-cli publish submit-review --bundle <id> --version <x.y.z>` | Direct submit-for-review without going through `start`. Use when the version is already prepared on App Store Connect. |
| `./ios-cli publish app-setup --bundle <id> --metadata /tmp/setup.json` | Change app-level pricing, availability, or age-rating without a full publish. JSON shape: any combination of `{ ageRating, pricing, availability }`. |
| `./ios-cli publish app-setup-status --bundle <id>` | Read current app-level pricing, availability, and age-rating. |
| `./ios-cli publish metadata --bundle <id> --version <x.y.z> --metadata-file /tmp/meta.json [--locale en-US]` | Direct metadata PATCH on a version without running the full pipeline. |
| `./ios-cli publish compliance --bundle <id> --version <x.y.z> --uses-non-exempt-encryption true\|false [--declaration-id <id>] [--expected-build-id <id>]` | Set `usesNonExemptEncryption` on the build attached to a version. `--expected-build-id` is race protection. |
| `./ios-cli publish encryption-declaration --bundle <id> --description "<text>" --contains-third-party true\|false --available-french true\|false [--build-id <id>]` | Create an encryption declaration and optionally attach to a build. For apps with non-exempt crypto. Pass the resulting `declarationId` as `metadata.encryptionDeclarationId`. |
| `./ios-cli publish routing-coverage --bundle <id> --version <x.y.z> --file routing.json` | Upload routing-coverage JSON for universal-link apps. |
| `./ios-cli publish list-categories` | List the App Store Connect category ids (use one as `metadata.primaryCategory`). |
| `./ios-cli publish lookup --bundle <id>` | One-shot id-resolver for an existing app: returns `appId`, latest version + build, and a best-effort `nextSafeBuildNumber`. Read-only — no Apple-state mutation. |

---

## Metadata Schema

JSON file passed via `--metadata` to `publish start` (or `--metadata-file` to `publish metadata`). Production-required fields (readiness rejects 400 if missing): `description`, `keywords`, `privacyPolicyUrl`, `supportUrl`, `primaryCategory`, `copyright`, `screenshots[]` (or `screenshotUrls[]`), `reviewContact`, `usesThirdPartyContent`.

```json
{
  "description": "string, ≤4000 chars, non-blank",
  "keywords": "comma,separated,keywords — UTF-8 ≤100 bytes (multibyte glyphs count more)",
  "whatsNew": "string, ≤4000 chars. Required when prior approved version exists; first release accepts empty.",
  "promotionalText": "optional, ≤170 chars. Editable post-submit (unlike description). Use for time-sensitive marketing copy.",
  "privacyPolicyUrl": "https:// — http:// is rejected",
  "supportUrl": "https://",
  "marketingUrl": "https:// (optional)",
  "primaryCategory": "App Store Connect category id (run ./ios-cli publish list-categories for the full set)",
  "copyright": "string, non-blank, e.g. 2026 Acme Inc.",
  "releaseType": "MANUAL | AFTER_APPROVAL | SCHEDULED — defaults to MANUAL (developer presses release button after approval). AFTER_APPROVAL = Apple ships the moment approval lands. SCHEDULED requires earliestReleaseDate.",
  "earliestReleaseDate": "ISO 8601 UTC, required when releaseType=SCHEDULED, e.g. 2026-12-01T08:00:00-08:00",
  "usesThirdPartyContent": false,
  "encryptionDeclarationId": "App Store Connect appEncryptionDeclaration id. Set only when ITSAppUsesNonExemptEncryption=YES in the Info.plist.",
  "screenshots": [
    { "url": "https://...png", "deviceType": "IPHONE_69" },
    { "url": "https://...png", "deviceType": "IPAD_PRO_3GEN_129" }
  ],
  "reviewContact": {
    "firstName": "string, required",
    "lastName": "string, required",
    "email": "string, required",
    "phone": "string, required (e.g. +14155551234)",
    "notes": "optional",
    "demoAccountRequired": false,
    "demoAccountName": "required when demoAccountRequired=true (login-gated apps)",
    "demoAccountPassword": "required when demoAccountRequired=true"
  },
  "ageRating": { "/* full attribute set varies — see App Store Connect docs */": "" },
  "pricing": { "free": true, "baseTerritory": "USA" },
  "availability": { "allTerritories": true, "territories": ["USA","GBR"], "available": true, "availableInNewTerritories": true }
}
```

### Constraints (readiness-enforced)

- `description.length ≤ 4000`, non-blank.
- `keywords` UTF-8 byte length ≤ 100. Empty / whitespace-only treated as missing.
- `whatsNew.length ≤ 4000`. Required when App Store Connect reports a prior approved version; empty string OK on first release.
- `supportUrl` / `privacyPolicyUrl` / `marketingUrl` must be parseable `https://`. `http://` hard-fails locally.
- `primaryCategory` must match `/^[A-Z0-9_]+$/`. Get the canonical list via `./ios-cli publish list-categories`.
- `usesThirdPartyContent` MUST be a boolean if supplied. `null` is rejected.
- `screenshots[]` MUST include both iPhone (`IPHONE_69`) AND iPad (`IPAD_PRO_3GEN_129`) sets. iOS apps default to universal (`TARGETED_DEVICE_FAMILY = "1,2"`); App Store Connect rejects universal submissions missing the iPad set. Only ship a single device-type when the source explicitly targets iPhone only.

Screenshots are produced via the [screenshots.md](screenshots.md) flow — it handles dimensions and framing. Pass each rendered PNG to `./ios-cli publish upload-screenshot --file <path> --device-type <APPLE_TYPE>` and drop the returned URLs into `screenshots[]` keyed by `deviceType`.

---

## App Clip Experience

App Clips have two distinct configuration surfaces:

1. **Parent-child identifier registration** — the App Clip's bundle id must be registered in the Apple Developer Portal as an "App Clip" subtype linked to its parent app. This is a one-time manual step per App Clip bundle id; no `./ios-cli` verb can complete it on the operator's behalf. When `./ios-cli publish start` detects an App Clip target whose bundle id lacks the link, the pipeline fails fast (before Azure runs) and surfaces the canonical click path: Identifiers → "+" → "App IDs" → Continue → "App Clip" subtype → Continue → pick parent → Register. The agent can also pre-check with `./ios-cli publish check-app-clip-link --bundle <parent> --clips <clip1,clip2>`.
2. **Experience configuration** — invocation URLs, default + advanced experiences, header images, beta invocations, review details, and domain status. The verbs below cover these. (These configure experiences AFTER the parent-child link from step 1 exists.)

| Command | Purpose |
|---|---|
| `./ios-cli publish app-clip-experience list --bundle <id>` | List App Clips for an app (optionally filter via `--clip-bundle-id`). |
| `./ios-cli publish app-clip-experience view --clip-id <id>` | View a single App Clip's attributes. |
| `./ios-cli publish app-clip-experience advanced-create --app-clip-id <id> --link <url> --default-language EN [--is-powered-by] [--action OPEN\|VIEW\|PLAY] [--category <text>]` | Create an advanced experience (URL-invocation, header images, review-detail tree). |
| `./ios-cli publish app-clip-experience advanced-list --app-clip-id <id>` | List advanced experiences for an App Clip. |
| `./ios-cli publish app-clip-experience default-create --app-clip-id <id> --action OPEN\|VIEW\|PLAY` | Create the default experience (used when there is no URL match — QR code / NFC / App Clip Code). |
| `./ios-cli publish app-clip-experience default-list --app-clip-id <id>` | List default experiences. |
| `./ios-cli publish app-clip-experience header-image-create --localization-id <id> --file <path>` | Upload a header image (3000x2000 PNG) tied to a localization. |
| `./ios-cli publish app-clip-experience domain-status --build-bundle-id <id> [--mode cache\|debug]` | Read Apple's cached or debug view of the App Clip's associated-domains validation. |
| `./ios-cli publish app-clip-experience invocation-create --build-bundle-id <id> --url <url>` | Create a beta App Clip invocation URL for testing. |
| `./ios-cli publish app-clip-experience invocation-list --build-bundle-id <id>` | List beta App Clip invocations for a build's bundle. |
| `./ios-cli publish app-clip-experience review-detail-create --experience-id <id> --url <url>` | Create the review-details record (invocation URL Apple uses during review). |

Typical first-time setup after `publish start` lands the build:

```bash
./ios-cli publish app-clip-experience list --bundle <main-bundle-id>          # returns clip ids
./ios-cli publish app-clip-experience advanced-create --app-clip-id <clipId> --link https://yourapp.com/clip --default-language EN --is-powered-by
./ios-cli publish app-clip-experience default-create --app-clip-id <clipId> --action OPEN
./ios-cli publish app-clip-experience review-detail-create --experience-id <expId> --url https://yourapp.com/clip
```
