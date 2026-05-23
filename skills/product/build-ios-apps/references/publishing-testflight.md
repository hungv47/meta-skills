# TestFlight

Two flows: **Internal** (no review wait, team-only) and **External** (App Store Connect beta review required, anyone can join).

## Internal flow

Members get the build immediately. Testers must be App Store Connect users on the team — non-team emails will fail to invite.

### Step 1: Create the group

```bash
./ios-cli publish testflight-group-create --bundle <id> --name "Internal" --internal
# → groupId="..."
```

### Step 2: Attach the build

```bash
./ios-cli publish testflight-build-attach --group <groupId> --build-id <buildId>
```

### Step 3: Add testers

```bash
./ios-cli publish testflight-tester-add --group <groupId> --email <team-member@...>
```

### Step 4 (optional): Add per-build "What to Test" notes

```bash
./ios-cli publish testflight-build-whats-new --build-id <buildId> --whats-new "..."
```

---

## External flow

Anyone via email or shareable public link. App Store Connect runs beta review (~hours to a day for the first build of a version). Once `APPROVED`, testers transition `NOT_INVITED → INVITED` automatically.

### Step 1: Set per-app beta info (required before review)

Description + feedback email + reviewer contact info are required before submitting for beta review.

```bash
./ios-cli publish testflight-beta-app-info --bundle <id> \
  --description "..." --feedback-email <e> \
  --contact-first-name <f> --contact-last-name <l> \
  --contact-email <e> --contact-phone "+CCNNNNNNN"
```

For login-gated apps, also pass demo creds:

```bash
./ios-cli publish testflight-beta-app-info --bundle <id> \
  --demo-account-required true \
  --demo-account-name <login> \
  --demo-account-password <pw>
```

### Step 2: Create the group

```bash
./ios-cli publish testflight-group-create --bundle <id> --name "Beta"
# → groupId="..."
```

### Step 3: Attach the build (and submit for beta review in the same call)

`--submit` runs the attach AND submits the build for App Store Connect's beta review in one call — saves a round-trip when both are wanted (the common case for external).

```bash
./ios-cli publish testflight-build-attach --group <groupId> --build-id <buildId> --submit
```

If you want to attach now and submit for review later (e.g., previewing on the dashboard first), drop `--submit` and run `testflight-beta-review-submit` separately.

### Step 4: Add testers

Can run before approval — invites fire automatically once App Store Connect approves the build.

```bash
./ios-cli publish testflight-tester-add --group <groupId> --email <e>
```

### Step 5 (optional): Enable a public link

```bash
./ios-cli publish testflight-public-link --group <groupId> [--limit N]
# → publicLinkUrl="https://testflight.apple.com/join/{publicLinkId}"
```

### Step 6 (optional): Add per-build "What to Test" notes

```bash
./ios-cli publish testflight-build-whats-new --build-id <buildId> --whats-new "..."
```

---

## Single-call mode

Pass a `--testflight-config <file.json>` to `./ios-cli publish start --target testflight` and the orchestrator runs every step above (beta-app-info → group create → build attach → tester invite → what's-new → beta-review-submit if external) in one checkpointed attempt.

```bash
./ios-cli publish start \
  --build <buildJobId> --bundle <id> --app "My App" \
  --version 1.0.0 --scheme MyApp --target testflight \
  --testflight-config /tmp/tf.json
# → attemptId="..." statusUrl="..."
```

### Config shape

```json
{
  "groups": [
    { "name": "Internal QA", "internal": true },
    { "name": "External Beta", "internal": false, "publicLink": true, "publicLinkLimit": 100 }
  ],
  "testers": [
    { "email": "tester@example.com", "firstName": "X", "lastName": "Y", "groupName": "Internal QA" }
  ],
  "betaAppInfo": {
    "description": "Beta test info shown to reviewers and external testers",
    "feedbackEmail": "feedback@example.com",
    "contactFirstName": "X", "contactLastName": "Y",
    "contactEmail": "x@example.com", "contactPhone": "+CCNNNNNNN",
    "notes": "any reviewer notes",
    "demoAccountRequired": false,
    "demoAccountName": "demo@example.com (only when demoAccountRequired:true)",
    "demoAccountPassword": "(only when demoAccountRequired:true)"
  },
  "whatsNew": "Per-build release notes shown in tester emails"
}
```

External groups in the config trigger automatic beta-review submission at the end. Internal-only configs skip it.

---

## Cancel / cleanup

```bash
./ios-cli publish testflight-build-expire --build-id <buildId>
```

Expire the build to cancel an in-flight beta review submission — that's the only path. Once `IN_REVIEW`, expire is best-effort (App Store Connect may complete review anyway).

```bash
./ios-cli publish testflight-tester-remove --tester <testerId> --group <groupId>
```

## Other TestFlight verbs

| Command | Purpose |
|---|---|
| `./ios-cli publish testflight-list --bundle <id>` | List recent builds and their `processingState`. Verify uploads are `VALID` before attaching. |
| `./ios-cli publish testflight-group-list --bundle <id>` | List all beta groups for an app. |
| `./ios-cli publish testflight-tester-list --bundle <id>` | List all beta testers, grouped by state per group. |

## Gotchas

- "Test Information" (App Store Connect dashboard) is **per-app**; "Test Details" / "What to Test" is **per-build**. Different verbs: `testflight-beta-app-info` vs `testflight-build-whats-new`.
- External testers stay `NOT_INVITED` until BOTH (1) a build is attached to the group AND (2) App Store Connect beta review has APPROVED that build.
- `BetaAppReviewDetail` (contact info + demo creds) is required for external review. `testflight-beta-app-info` bundles it with `BetaAppLocalization` so one call covers both.
- Login-gated apps MUST set `--demo-account-required true --demo-account-name <login> --demo-account-password <pw>`. Without creds, the reviewer cannot run the app → automatic rejection.
