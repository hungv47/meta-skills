---
name: build-ios-apps
description: Build, sign, install, and publish iOS apps using the Vibecode signing service. Use when the user wants to build an iOS app from source, sign an iOS app, install on their iPhone, register a device, set up Apple Developer auth, publish to the App Store or TestFlight, submit for review, or work with the iOS build/sign/distribute/publish pipeline. Also triggers for "test on device", "put this on my phone", "ship it to my iPhone", "publish to App Store", "submit my app", "push to TestFlight", "send for review", or any request to get a Swift/iOS app running on a real device or shipped to App Store Connect.
attribution: Authored by the Chorus team — Riley Brown, Ash Nanda, and the Chorus team. Vendored into forsvn-skills unmodified.
---

> **Attribution.** This skill was authored by the **Chorus team** — all credit to **Riley Brown**, **Ash Nanda**, and the rest of Chorus. It is vendored into the forsvn-skills stack unmodified for end-to-end iOS build/sign/install/publish capability. The `ios-cli` binary, the Vibecode signing service it talks to, and the bootstrap template are Chorus intellectual property; this repository redistributes them as-is.
>
> **Exception policy.** This skill is the **sole intentional exception** to the forsvn-skills quality bar (multi-agent orchestration, critic gates, anti-sycophancy mechanisms). It is included because the iOS build/sign/install/publish capability is high-value and not feasible to reproduce in the stack's native shape. Do not treat this as precedent for additional vendored skills — every other addition must clear the quality bar described in the repo's CLAUDE.md.

# iOS App Build, Sign, Install & Publish

Build Swift apps, sign them with Apple credentials, install on iPhones via OTA, and publish to App Store Connect (production review or TestFlight).

## CRITICAL RULES

1. **NEVER use Xcode, xcodebuild, or xcrun.** You do not have Xcode access. ALL building is done through the cloud build pipeline via `./ios-cli`.
2. **NEVER make raw HTTP/curl calls to the signing service.** Always use `./ios-cli`. It handles authentication, polling, error handling, and output formatting.
3. **Every iOS build request MUST go through this skill.** When a user says "build an app", "test on my phone", "put this on my iPhone", "ship it", or anything about getting an iOS app running — use this skill exclusively.
4. **Before writing any app that uses a capability or extension, READ [references/capabilities.md](references/capabilities.md).** It has per-capability rules for entitlement files, Info.plist keys, runtime code, and manual portal steps. Skipping it causes silent install/runtime failures that waste build cycles. Also read [references/gotchas.md](references/gotchas.md) for Xcode 26 compile fixes.

## Environment

These environment variables are automatically available inside Chorus runners — `ios-cli` picks them up:

- `VIBECODE_API_KEY` — Authentication. Required. When unset (e.g. running locally), persist it once with `./ios-cli login <api-key>` and the CLI reads it from `~/.vibecode/ios/config.json` on subsequent invocations.
- `SIGNING_SERVICE_URL` — Service URL (auto-detected, defaults to `https://ios.chorus.com`)
- `VIBECODE_PROJECT_ID` — Project / agent identifier. Optional for `build` — when unset, the CLI mints a UUID once and persists it in the config file so subsequent local builds share the same project namespace. Required for `sim-preview`. Chorus runners inject this with the agent id automatically.
- `VIBECODE_USER_ID` — Optional. Defaults to the user resolved from the active API key. Set this (or pass `--user <id>`) to target a non-default signing user, or to tie a build to a specific publishing user (see `publish-ios-apps`).

## Flow at a glance

**Default (sim-first):** Build → print the `previewUrl` from build output. No separate sim-preview step, no Apple auth, no device registration, nothing else. The user previews instantly in their chat.

**On-demand device install:** When the user clicks "Install on device" on the preview, chorus posts a visible user chat message in the form `Install this build on my device. (build: <simBuildId>)`. That triggers the **Install-on-Device callback** below, which walks through any missing setup (auth → register → sign) and prints the install URL.

This install message is the only signal that should make the agent run auth/register/sign. Don't run those steps preemptively after a build — defer until the user explicitly asks to install.

## CLI

The `./ios-cli` binary is in this skill directory. Run `./ios-cli --help` for full usage, or `./ios-cli skill` to print this document.

### Output Modes

Controlled by `--output` global flag:

- `--output text` (default) — logfmt `key="value"` pairs, one line per result. Designed for grep and cut.
- `--output json` — Single JSON object per invocation. Designed for jq and programmatic parsing.
- `--quiet` — Print only the primary identifier (ID or URL). For scripting and piping.

Long-running commands print bracketed event markers to stderr:
`[building]`, `[signing]`, `[done]`, `[error]`

Errors: `ERROR: message` on stderr (text mode) or `{"error":"message","code":"ERROR_CODE"}` on stdout (JSON mode). Exit code 1.

### Commands

| Command | Description |
|---|---|
| `./ios-cli login <api-key>` | Persist a vibecode API key locally so subsequent commands work without env vars (no-op inside Chorus, where the env var is already injected) |
| `./ios-cli auth start --username <email> --password <pass>` | Start Apple ID auth (returns sessionId) |
| `./ios-cli auth apikey [--user <id>] --issuer-id <id> --key-id <id> --p8-key <path> --team-id <id>` | Auth with App Store Connect API key. `--user` is optional; defaults to the API-key owner. |
| `./ios-cli auth status <sessionId>` | Poll auth session state |
| `./ios-cli auth respond --session <id> --value <code>` | Submit 2FA code or team selection |
| `./ios-cli build <zip-path>` | Upload source zip, build on cloud macOS, wait until done |
| `./ios-cli sim-preview <buildJobId>` | Re-mint a preview for an existing buildJob. Rarely needed — `./ios-cli build` already emits a tokenized previewUrl in its output. |
| `./ios-cli sign <buildJobId>` | Sign a built app, wait until done, returns install URL |
| `./ios-cli sign --from-sim <simBuildId>` | Resolve a sim-preview's underlying buildJob server-side and sign for device install (Install-on-Device callback) |
| `./ios-cli devices [userId]` | List registered devices |
| `./ios-cli register-apple [userId]` | Sync pending devices with Apple |
| `./ios-cli status build <jobId>` | Check build job status |
| `./ios-cli status sign <buildId>` | Check signing status |
| `./ios-cli logs <buildJobId>` | Fetch build logs — mid-build for status, after failure for errors |
| `./ios-cli bootstrap <app-name> <bundle-id> <output-dir>` | Create new SwiftUI project from template |
| `./ios-cli add-spm-package <repo-url> <version> [--product <name>] [--target <name>] [--project <path>] [--version-kind <kind>]` | Add a remote Swift Package Manager dependency to an Xcode project. Writes all required pbxproj sections (remote ref, product dependency, build file, target + project arrays) and is idempotent on (URL, product). |
| `./ios-cli config get` | Print current config |
| `./ios-cli config set <key> <value>` | Set a config value (supports dot notation) |
| `./ios-cli config path` | Print config file path |
| `./ios-cli skill` | Print this skill reference |

`[userId]` is optional — when omitted the CLI uses the user resolved from the active API key.

### Error Codes

If a command fails (exit code 1), check the error code:

| Error Code | Meaning | What To Do |
|---|---|---|
| `MISSING_API_KEY` | No API key in env or config | Run `./ios-cli login <api-key>` or set `VIBECODE_API_KEY`. |
| `MISSING_ENV` | Required env var not set | Ensure `VIBECODE_PROJECT_ID` is available. |
| `MISSING_ARG` | Required command argument missing | Check command usage with `--help`. |
| `MISSING_FLAG` | Required `--flag` not provided | Check command usage with `--help`. |
| `UNKNOWN_COMMAND` | Unrecognized command or subcommand | Run `./ios-cli --help` to see available commands. |
| `CONNECTION_FAILED` | Cannot reach the signing service | Check `SIGNING_SERVICE_URL`. Service may be down. Retry after a few seconds. |
| `UNAUTHORIZED` | Invalid or expired API key (401) | Check `VIBECODE_API_KEY`. The key may have been revoked or rotated. |
| `FORBIDDEN` | Access denied (403) | The API key doesn't have permission for this operation. |
| `NOT_FOUND` | Resource not found (404) | The userId, buildJobId, sessionId, or buildId doesn't exist. Verify the ID. |
| `CLIENT_ERROR` | Other client error (4xx) | Check the error message for details. |
| `SERVER_ERROR` | Server error (5xx) | The signing service had an internal error. Retry. If persistent, report the issue. |
| `BUILD_FAILED` | Cloud build failed | Fetch Xcode errors with `./ios-cli logs <jobId>`. Common causes: missing scheme, Swift compiler errors. |
| `BUILD_NOT_READY` | Build hasn't finished yet | Wait for build to complete. Check with `./ios-cli status build <jobId>`. |
| `SIGN_FAILED` | Code signing failed | Usually means no registered devices or expired Apple credentials. Re-authenticate and register devices. |
| `NO_APPLE_AUTH` | Server says user has no usable Apple credentials | Run the auth flow (Step 1 of First-Time Setup). |
| `SIGN_IN_PROGRESS` | A sign for the same build is already in flight | Wait 10–30s and retry; don't start another sign. |
| `UNEXPECTED_ERROR` | Unknown/unhandled error | Check the error message. May be a bug — retry or report. |

**Auth-specific errors:**
- `auth start` returns `CONNECTION_FAILED` → signing service may be down
- `auth status` returns `state="auth_failed"` → wrong credentials or Apple blocked the login. Try API key auth instead.
- 2FA code rejected → ask user for a fresh code, they expire quickly

### Output Examples

```bash
# Default (logfmt text)
./ios-cli devices c906084e-...
# → devices="0" registrationUrl="https://ios.chorus.com/register/c906084e-..."

# JSON mode
./ios-cli --output json devices c906084e-...
# → {"devices":[],"registrationUrl":"https://..."}

# Quiet mode (just UDIDs)
./ios-cli --quiet devices c906084e-...
# → (one UDID per line)

# Build with progress events on stderr
./ios-cli build /tmp/source.zip
# stderr: [build] uploading /tmp/source.zip...
# stderr: [build] job abc123 started
# stderr: [building] 30s elapsed, state=building
# stderr: [done] build succeeded
# stdout: buildJobId="abc123" state="built" appUrl="https://..."
```

### Chaining Commands

The full build → sign → install flow:

```bash
# 1. Build (outputs buildJobId)
./ios-cli build /tmp/source.zip
# → buildJobId="abc123" state="built" appUrl="https://..."

# 2. Sign using the buildJobId from step 1
./ios-cli sign abc123
# → buildId="def456" state="signed" installUrl="https://ios.chorus.com/install/def456"

# 3. Give the user the installUrl to open on their iPhone
```

With quiet mode for scripting:

```bash
# Build and capture just the job ID
BUILD_JOB_ID=$(./ios-cli --quiet build /tmp/source.zip)

# Sign and capture just the install URL
INSTALL_URL=$(./ios-cli --quiet sign "$BUILD_JOB_ID")

# Share with user
echo "Install your app: $INSTALL_URL"
```

## State

All state lives at `~/.vibecode/ios/config.json`. Schema: [config-schema.json](references/config-schema.json).

!`cat ~/.vibecode/ios/config.json 2>/dev/null || echo "No config found — run first-time setup."`

## Routing

**Default path** (no auth required): Always follow **Normal Flow** below for any build request. Build, print URL. Done.

**Install-on-Device callback**: When chat receives a message matching `Install this build on my device. (build: <uuid>)`, follow the **Install-on-Device callback** section. That's the only path that invokes auth/register/sign — and it's only invoked by the user clicking "Install on device" on the preview UI.

Do NOT preemptively run the **First-Time Setup** flow after a build. The user might never want to install on device — only previewing in the simulator. First-Time Setup is a sub-routine called from the Install-on-Device callback when prereqs are missing.

---

## First-Time Setup

Walk the user through each step. Update `~/.vibecode/ios/config.json` after each one. **Only run these steps when the Install-on-Device callback says a prerequisite is missing.**

### Step 0: Pre-requisites

The user **must** be enrolled in the Apple Developer Program ($99/year). If they are not, they cannot use this skill. Begin by asking them if they are enrolled. If not, guide them on how to enroll.

### Step 1: Authenticate with Apple

Ask for the user's **Apple ID email** and **password**. Explain:
> "Your email and password are sent once to Apple to authenticate. They are not stored — only a session token is saved on the signing service."

Use the password auth flow:

```bash
# Start auth — returns sessionId and userId
./ios-cli --output json auth start --username "user@example.com" --password "their-password"

# Poll until state is "awaiting_2fa"
./ios-cli --output json auth status <sessionId>

# Ask user for the 6-digit code from their Apple device
./ios-cli auth respond --session <sessionId> --value "123456"

# Poll again until state is "awaiting_team"
./ios-cli --output json auth status <sessionId>

# Show team list from the JSON output, ask user to pick (1-based index)
./ios-cli auth respond --session <sessionId> --value "1"
```

If the password flow fails, fall back to **API key auth**:
> "The password login didn't work. You can use an App Store Connect API key instead. Go to App Store Connect > Users and Access > Integrations > Keys to create one."

```bash
./ios-cli auth apikey \
  --issuer-id <issuerID> \
  --key-id <keyID> \
  --p8-key /path/to/AuthKey_XXXX.p8 \
  --team-id <teamId>
```

After auth succeeds, save to config:
```bash
mkdir -p ~/.vibecode/ios
```
Write `config.json` with `activeUser`, `users.{userId}` containing `appleId`, `teamId`, `teamName`.

### Step 2: Register Device

Check if any devices exist:

```bash
./ios-cli --output json devices <userId>
```

If no devices (empty `devices` array in JSON output):
1. Give the user the `registrationUrl` from the JSON output
2. Tell them to open it **on their iPhone** and tap "Register Device"
3. They'll download a profile — guide them: **Settings > General > VPN & Device Management > install the profile**
4. After success page appears, sync with Apple:

```bash
./ios-cli register-apple <userId>
```

Also remind them to **enable Developer Mode**:
> Settings > Privacy & Security > Developer Mode > toggle ON > restart when prompted.

### Step 3: Sign

Run `./ios-cli sign --from-sim <simBuildId>` (the simBuildId came from the install message's `(build: <uuid>)` parenthetical) — see the **Install-on-Device callback** section.

---

## Normal Flow

The default path. No auth, no register, no sign. The user gets a working preview link they can click in any channel (chorus, Telegram, WhatsApp, iMessage, Safari).

### 1. Generate App Icon

Before building, generate an app icon and overwrite the bootstrap template's placeholder at `Assets.xcassets/AppIcon.appiconset/AppIcon.png`. Read the source code you just wrote and identify what makes this app's **value** unique — not its category. Pick the one visual element that would make someone understand what the app does at a glance.

Use Gemini CLI's nanobanana `/icon` command:

```bash
/icon "App icon design for [app description]. [Visual element] with subtle 3D depth. Premium quality, sophisticated, single focal point, subtle lighting" --sizes="1024" --type="app-icon" --style="modern" --corners="sharp"
```

Always include: `Premium quality, sophisticated, single focal point, subtle lighting`. You can add the app's color scheme from the source code if it has one.

**Examples:**
- `/icon "App icon design for streak habit tracker. Minimalist progress rings with subtle 3D depth. Premium quality, sophisticated, single focal point, subtle lighting" --sizes="1024" --type="app-icon" --style="modern" --corners="sharp"`
- `/icon "App icon design for surf forecast app. Ocean wave curling with subtle 3D depth. Premium quality, sophisticated, single focal point, subtle lighting" --sizes="1024" --type="app-icon" --style="modern" --corners="sharp"`
- `/icon "App icon design for split expense tracker. Two overlapping coins with subtle 3D depth. Premium quality, sophisticated, single focal point, subtle lighting" --sizes="1024" --type="app-icon" --style="modern" --corners="sharp"`

Copy the generated PNG into the asset catalog:

```bash
mkdir -p "{project}/Assets.xcassets/AppIcon.appiconset"
cp [generated-icon-path] "{project}/Assets.xcassets/AppIcon.appiconset/AppIcon.png"
cat > "{project}/Assets.xcassets/AppIcon.appiconset/Contents.json" << 'EOF'
{"images":[{"filename":"AppIcon.png","idiom":"universal","platform":"ios","size":"1024x1024"}],"info":{"author":"xcode","version":1}}
EOF
```

### 2. Build

```bash
cd /path/to/project
zip -r /tmp/source.zip . -x ".git/*" -x "xcuserdata/*" -x "*.xcuserstate"
./ios-cli build /tmp/source.zip
```

The CLI uploads, builds on cloud macOS, and waits until complete. Outputs `buildJobId`, `state`, and `appUrl`.

**If the build fails**, fetch the Xcode compilation errors and fix them:

1. Run `./ios-cli logs <buildJobId>` to get the error lines from the build
2. Fix the errors in your source code based on what the compiler says
3. Re-zip and rebuild: `zip -r /tmp/source.zip . -x ".git/*" -x "xcuserdata/*" -x "*.xcuserstate" && ./ios-cli build /tmp/source.zip`

Do NOT give up after a failed build. Read the errors, fix the code, rebuild. Most build failures are missing imports, type mismatches, or project configuration issues that are straightforward to fix from the compiler output.

**Build environment**: The build server uses **Xcode 26.0.1** on macOS. Builds run with `-sdk iphoneos` and `CODE_SIGNING_ALLOWED=NO`. The scheme is auto-detected from the `.xcodeproj` — for multi-target projects (app + widget extension), ensure the main app scheme is listed first.

Save `buildJobId` to config under the active project.

`./ios-cli build` emits `simBuildId` and `previewUrl` once the build completes. The previewUrl includes a JWT token so it works in any browser (chorus webapp, Telegram, WhatsApp, iMessage, Safari).

### 3. Print previewUrl

**Always include the `previewUrl` verbatim in your reply.** The chorus webapp will auto-open it in the right panel; other channels (Telegram/WhatsApp/iMessage) will render it as a clickable link the user can open in any browser.

The user clicks "Install on device" on the preview itself when they want to install on iPhone — that triggers the **Install-on-Device callback** below. Don't preemptively sign.

---

## Install-on-Device callback

**Trigger**: the user asks to install the build, e.g. `Install this build on my device. (build: <simBuildId>)`. Pull `simBuildId` from the `(build: <uuid>)` parenthetical.

### Steps

1. Run `./ios-cli sign --from-sim <simBuildId>`.
2. Handle the exit code:
   - **Success**: prints `installUrl`. Print it verbatim in your reply. Chorus renders inline "Install on device" + "Preview in simulator" buttons under it; user taps Install on their iPhone.
   - **`NO_APPLE_AUTH`**: server says the user has no usable Apple credentials. Run **First-Time Setup Step 1** (auth flow). Then retry from step 1 above.
   - **`SIGN_FAILED`** (with hint about devices in error message): the user has no registered iPhone yet, or registered devices haven't been Apple-synced. Run **First-Time Setup Step 2** (registration). Then retry from step 1.
   - **`SIGN_IN_PROGRESS`**: a sign is already running for this build. Wait 15s and retry.
   - **`BUILD_NOT_READY`**: the underlying build job isn't `built` yet. Surface a clear error to the user; usually means the build hasn't completed or has expired.

### Re-Sign After New Device

When `register-apple` adds a new UDID to an Apple team, the previous IPA's provisioning profile is stale. Subsequent `sign --from-sim` automatically clears the cached profile and re-signs. No special handling — just rerun the callback steps.

---

## Re-Sign After New Device

When a new device is registered, the current build needs re-signing (the provisioning profile must include the new device UDID).

Check config for the active project's `buildJobId`. If it exists:
> "New device registered. Re-sign your current build to include it?"

Then re-trigger: `./ios-cli sign <buildJobId>`. No rebuild needed.

---

## Creating a New Project

```bash
./ios-cli bootstrap "My App" "com.example.myapp" /path/to/project
```

Creates a SwiftUI project with SwiftData, tests, asset catalogs from the built-in template. Replaces all placeholders with your app name and bundle ID. Initializes a git repo.

Add new `.swift` files directly into the `{App Name}/` directory — Xcode picks them up automatically.

After bootstrapping, save to config:

```bash
./ios-cli config set activeUser <userId>
./ios-cli config set users.<userId>.teamId <teamId>
```

---

## Adding SPM packages

Use `./ios-cli add-spm-package <repo-url> <version>` — the subcommand writes every required pbxproj section for you (remote reference, product dependency, build-file link, target + project arrays). Do **not** hand-edit `project.pbxproj`. The command is idempotent on (URL, product) so re-runs are safe.

Examples:

```bash
# Default (upToNextMajor, infer product from URL, link to the first iOS app target)
./ios-cli add-spm-package https://github.com/supabase/supabase-swift 2.0.0 --product Supabase

# Pin an exact version, target a specific app
./ios-cli add-spm-package https://github.com/realm/realm-swift 10.50.0 \
  --product RealmSwift --target "My App" --version-kind exact

# Track a branch instead of a version
./ios-cli add-spm-package https://github.com/owner/foo main \
  --product Foo --version-kind branch
```

Available `--version-kind` values: `upToNextMajor` (default), `upToNextMinor`, `exact`, `range` (pass version as `X.Y.Z..A.B.C`), `branch`, `revision`. Match what the package's docs recommend rather than defaulting blindly.

After adding the package, `import <ModuleName>` in your Swift source. **The module name is not always the product name** — check the package's README or `Package.swift`. Examples: product `Realm` exposes module `Realm`, but product `RealmSwift` exposes module `RealmSwift`; product `FirebaseFirestore` exposes module `FirebaseFirestore`. Most match 1:1 but verify before importing.

**Multiple products from one package** (e.g., `FirebaseAuth` + `FirebaseFirestore` from `firebase-ios-sdk`): run `./ios-cli add-spm-package` once per product against the same URL. The command detects the existing `XCRemoteSwiftPackageReference` for that URL and reuses its id — so you get one repo reference plus a separate `XCSwiftPackageProductDependency` / `PBXBuildFile` / target-array entry per product. Re-running with a product already attached is a no-op.

Local path packages (`XCLocalSwiftPackageReference` / `package(path:)`) are out of scope — use a different shape.

### What the pipeline does for you

- **Embeds dynamic frameworks.** The pipeline scans `@rpath/<X>.framework` references in the main binary and `<App>.debug.dylib`, copies matching frameworks from `PackageFrameworks/` into `App.app/Frameworks/`. Works for forced-dynamic packages (Realm, RealmSwift, Sentry@dynamic).
- **Skips macro & plugin trust prompts.** `xcodebuild` runs with `-skipMacroValidation -skipPackagePluginValidation`. Packages with macros (TCA, swift-syntax) or buildToolPlugins (SwiftLint) build without intervention.
- **Resigns embedded frameworks** recursively inside extensions, app clips, and watch targets.

**Do NOT add an `Embed Frameworks` (`PBXCopyFilesBuildPhase`) phase yourself.** The pipeline handles it. For static-default packages an explicit embed phase fails the build with `lstat: No such file` because no `.framework` is produced.

**Do not strip the standard runpath.** App targets must keep `LD_RUNPATH_SEARCH_PATHS = "$(inherited) @executable_path/Frameworks"` (the Xcode default). Without it, dyld cannot find the auto-embedded frameworks at launch even though the pipeline copied them in.

### Multi-target apps (extensions, app clips, watch apps)

`packageProductDependencies` is a **per-target** field on each `PBXNativeTarget`. Any non-host target that `import`s an SPM module needs:

- an entry in **that target's** `packageProductDependencies` array
- a `PBXBuildFile` referencing the product
- an entry in **that target's** `PBXFrameworksBuildPhase.files`

The `XCRemoteSwiftPackageReference` and project-level `packageReferences` are added once at the project level and shared.

This applies to widget extensions, app clips, watch apps, watch extensions, share / notification service / notification content / intents / file provider / network / keyboard / iMessage / audio unit / spotlight / today extensions — same rule, no special case per type.

**Dynamic SPM framework consumed by an extension.** Auto-embed scans `@rpath` references in the host's main binary and `<App>.debug.dylib`. **The host target must carry the package as one of its dependencies for the framework to be embedded** — even if the host doesn't directly use the API. So when an extension imports a dynamic SPM product, also add the same `XCSwiftPackageProductDependency` to the host's `packageProductDependencies` and a matching `PBXBuildFile`/Frameworks entry. If you genuinely don't want to call the API from host code, a no-op reference (`_ = ModuleName.self` in the App's init) keeps the symbol from being dead-stripped at link time. The host-target dependency is the load-bearing fix; the symbol reference is a belt-and-suspenders safety check.

### Heavy packages — first build is slow

Cold resolves of Realm, swift-syntax-based packages (TCA, swift-macro-toolkit), Firebase, or large multi-package combos can take 15–40 minutes on Azure. The signing service has a 45-minute deadline — wait rather than cancel.

If the user asks for status mid-build, run `./ios-cli logs <buildJobId>` to surface live Azure progress (resolving packages, compiling targets, etc.). Most "stuck" builds are just slow, not broken.

---

## Publishing

For App Store / TestFlight publishing, see [references/publishing.md](references/publishing.md).

### Routing apps (transit, ride-share, navigation)

If the user is building a routing app, the project's pbxproj must declare which transit modes the app supports. Add this build setting:

```
INFOPLIST_KEY_MKDirectionsApplicationSupportedModes = "MKDirectionsModeCar MKDirectionsModeTransit MKDirectionsModeWalking";
```

Pick the subset that matches the app from: `MKDirectionsModeCar`, `MKDirectionsModeTransit`, `MKDirectionsModeWalking`, `MKDirectionsModeBus`, `MKDirectionsModeFerry`, `MKDirectionsModeStreetCar`, `MKDirectionsModePedestrian`, `MKDirectionsModeRideShare`, `MKDirectionsModeBike`, `MKDirectionsModeOther`.

---

## References

- [API Reference](references/api-reference.md) — all signing service endpoints
- [Capabilities & Entitlements](references/capabilities.md) — per-capability rules, entitlements, Info.plist keys, extension matrix
- [Device Registration](references/device-registration.md) — UDID enrollment flow details
- [Config Schema](references/config-schema.json) — config file structure
- [Gotchas](references/gotchas.md) — common issues and fixes
