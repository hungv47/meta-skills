# Readiness Check Names

`./ios-cli publish preflight` and `publish start` both run the same readiness gate. On failure, response is `{ ready: false, checks: [{ name, passed, message, definitive }] }`. `definitive: true` means the check truly failed; `false` means a transient lookup failure (retry).

## Auth + access

| Name | Meaning | Remediation |
|---|---|---|
| `auth_valid` | User exists + has API-key auth | Re-run `./ios-cli auth apikey ...`. Password auth is rejected for publishing. |
| `auth_role_sufficient` | Key has read + write (Certs/IDs/Profiles + listings) | Use Admin or App Manager role. Developer / Marketing / Customer Support roles cannot edit listings, pricing, or submit. |

## Build + app shell

| Name | Meaning | Remediation |
|---|---|---|
| `build_exists` | Build job is owned by the user + state=`built` + source URL is reachable | Rebuild with `./ios-cli build <zip> --user <userId>` matching `./ios-cli auth status` (the API-key owner). |
| `app_exists` | App Store Connect app shell exists for the bundle id | Manual: bundle id is auto-registered in the developer portal, but the operator must complete "New App" + "App Privacy" in the App Store Connect web UI (one-time per app). The check's failure message includes a step-by-step walkthrough. |
| `version_valid` | Matches `X.Y` or `X.Y.Z` | Use a numeric SemVer-ish string. |
| `no_running_attempt` | No other in-flight publish attempt for this bundle | Wait, or `cancel-review` + `resolve` an orphan attempt. |
| `no_version_conflict` | Version not already `READY_FOR_SALE`/`IN_REVIEW`/`WAITING_FOR_REVIEW` | Bump the version, or cancel the in-flight one with `./ios-cli publish cancel-review`. |
| `build.triggerable` | Server has Azure release-archive pipeline configured | Operator/infra issue; not user-fixable. |

## Metadata (production target)

| Name | Meaning | Remediation |
|---|---|---|
| `metadata.required` | All production-required fields non-blank | Fill missing fields in the `--metadata` JSON. See the metadata schema in [production.md](production.md#metadata-schema). |
| `metadata.description_length` / `metadata.keywords_length` / `metadata.<field>_shape` / `metadata.<field>_url_shape` / `metadata.screenshot_urls_shape` | Per-field length / shape / url-scheme checks | Fix the offending field per the schema constraints. |
| `metadata.screenshots_reachable` | HEAD probe of every screenshot URL returns 2xx | Re-host the asset; redirects also fail (the SSRF-hardened downloader rejects them). |
| `version_is_first_or_has_whatsnew` | First-release OR `whatsNew` provided | Add `whatsNew` to metadata. Lookup-failure variants are non-definitive (transient — retry). |
| `metadata.content_rights_resolved` | `usesThirdPartyContent` set in metadata or already on the app | Pass it on this submission, or use `./ios-cli publish app-setup` once. |
| `metadata.encryption_declaration_resolved` | Source-plist `ITSAppUsesNonExemptEncryption` known + (if YES) declaration id supplied | Set the plist key in source, OR pass `metadata.encryptionDeclarationId` after creating one with `./ios-cli publish encryption-declaration`. |
| `metadata.app_privacy_advisory` | Always passes; reminder that App Privacy questionnaire publish state is API-invisible | Verify in the App Store Connect web UI before submitting. |

## App Store Connect validation

| Name | Meaning | Remediation |
|---|---|---|
| `validate.no_errors` / `validate.schema_drift` | App Store Connect's pre-submit validation clean against the staged version | Read the message; usually a missing field. The pipeline runs this internally; non-definitive variants are transient (retry). |
| `review_status.no_blockers` | No outstanding review blockers from a prior submission | Read the message; clear any blocker before resubmitting. |
