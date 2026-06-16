# App Store Connect gotchas

Rules App Store Connect enforces that the publish flow has to work around.

## One in-flight per platform

App Store Connect allows exactly one version in `IN_REVIEW` / `WAITING_FOR_REVIEW` per platform per app. `publish start` rejects via the `no_version_conflict` readiness check when violated. To replace the in-flight version, run `./ios-cli publish cancel-review --bundle <id>` first, then re-fire.

## `appStoreState` lifecycle

```
PREPARE_FOR_SUBMISSION → READY_FOR_REVIEW → WAITING_FOR_REVIEW → IN_REVIEW → APPROVED →
  ├── READY_FOR_SALE              (auto-release apps)
  └── PENDING_DEVELOPER_RELEASE   (manual-release apps; call ./ios-cli publish release)
```

Reject paths exit at `DEVELOPER_REJECTED` or `REJECTED`. Resubmit by editing the version + re-firing `publish start` (or `submit-prepared`).

## `releaseType`

- `AFTER_APPROVAL` (default) — auto-publishes immediately on approval.
- `MANUAL` — parks at `PENDING_DEVELOPER_RELEASE`. Run `./ios-cli publish release` to publish.
- `SCHEDULED` — date-based release.

Don't switch mid-cycle without coordinating; App Store Connect may need a state reset.

## Demo creds for login-gated apps

Production: set `metadata.reviewContact.demoAccountRequired: true` AND `demoAccountName` + `demoAccountPassword`. TestFlight external: same fields on `./ios-cli publish testflight-beta-app-info`. Without them, the reviewer cannot run the app — automatic 4.0 rejection.

## TestFlight beta-review submissions can't be deleted

Use `./ios-cli publish testflight-build-expire --build-id <id>` to cancel an in-flight beta review — that's the only path. Once `IN_REVIEW`, expire is best-effort.

## Manual-only operations (no public API)

- **App shell creation** — must use the App Store Connect web UI ("New App"). The bundle id is auto-registered when our pipeline first sees it, but the app shell is operator-only. The `app_exists` readiness check surfaces a step-by-step walkthrough when this is missing.
- **App Privacy questionnaire** — App Store Connect requires the publish state to be `Published` before review. The publish state isn't exposed via the API, so readiness can only advise. The operator must manually publish in the App Store Connect web UI before submitting.

## `needs_manual_action` terminal state

Some failures land here instead of `failed` because the side-effect on App Store Connect is ambiguous (e.g., submission may have been received but local persistence failed; ITMS-* errors emitted asynchronously after upload). Read the attempt's `error` + `error_details`, fix in the App Store Connect web UI if needed, then:

```bash
./ios-cli publish resolve --attempt <id> --resolution completed
# OR
./ios-cli publish resolve --attempt <id> --resolution failed --reason "App Store Connect rejected the submission asynchronously after upload"
```

## ITMS errors

App Store Connect's transporter (the upload step) emits `ITMS-*` errors at upload validation. Common ones:

- `ITMS-90022` — missing required iPhone app icon.
- `ITMS-90023` — missing required iPad app icon.
- `ITMS-90478` — duplicate build version. Bump `CURRENT_PROJECT_VERSION` in the project file before re-zipping.
- `ITMS-90189` — placeholder bundle id remnants. Surfaces as `needs_manual_action`.

The orchestrator's error enrichment pulls App Store Connect's raw message and adds remediation hints when it can. Read the `error` field on the attempt for the full text + hint.

## Phone-number format

`reviewContact.phone` is validated more strictly than just digits — App Store Connect rejects clearly fake formats (e.g. all-555 numbers). Use a real phone number.
