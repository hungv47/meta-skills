# Device Registration

For ad-hoc distribution, each tester's device UDID must be registered with the Apple Developer account. The signing service handles this via Apple's `.mobileconfig` enrollment profile.

## Flow (happy path — no manual sync needed)

```
1. Run `./ios-cli devices` — output includes a `registrationUrl` field.
2. Share that URL with the tester.
3. Tester opens on iPhone → taps "Register Device".
4. iOS downloads + prompts to install the .mobileconfig profile (Settings > General > VPN & Device Management).
5. iPhone reports the UDID back to the service.
6. The service AUTO-SYNCS the new UDID to Apple inline (8s deadline) — no extra step needed.
7. Next sign or publish picks up the device in the provisioning profile.
```

If the inline Apple sync timed out or transient-failed at step 6, `./ios-cli devices` shows the device with `appleRegistered: false`. Run `./ios-cli register-apple` as a retry — but this is rare; the inline sync is the normal path.

## CLI commands

### `./ios-cli devices [userId]`

Lists registered devices for the user. JSON output:

```json
{
  "devices": [
    {
      "udid": "00008110-000A1CD6268A801E",
      "product": "iPhone14,2",
      "deviceName": "John's iPhone",
      "registeredAt": "2026-03-25T06:18:41.000Z",
      "appleRegistered": true
    }
  ],
  "registrationUrl": "https://ios.chorus.com/register/<userId>"
}
```

`appleRegistered: true` = synced to Apple (the normal state immediately after enrollment).
`appleRegistered: false` = inline sync at enrollment failed; run `./ios-cli register-apple` to retry.

### `./ios-cli register-apple [userId]` (fallback)

Manually retries the Apple-side device registration for any device with `appleRegistered: false`. Most of the time you do NOT need to run this — the service syncs inline at enrollment time. Only useful as a fallback when the inline sync timed out.

```json
{
  "ok": true,
  "total": 3,
  "registered": [{"udid": "...", "product": "iPhone14,2", "deviceName": "..."}],
  "failed": []
}
```

## Developer Mode

Devices must have Developer Mode enabled to install ad-hoc signed apps:

1. **Settings > Privacy & Security > Developer Mode**
2. Toggle ON
3. iPhone will prompt to restart — tap Restart
4. After reboot, confirm when prompted

Developer Mode persists across app installs — only needs to be enabled once.

## Important

- Devices must be registered BEFORE signing. The provisioning profile is created at sign time and includes all registered device UDIDs.
- If a new device is added after a build was signed, you need to re-sign the app (not rebuild — just re-sign with the same appUrl). The old provisioning profile won't include the new device.
- The signing service caches signing assets (cert, key, profile) per user. To force a fresh provisioning profile with new devices, the cached assets may need to be cleared.
