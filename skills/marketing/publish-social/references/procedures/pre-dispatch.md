# Pre-Dispatch — publish-social

> Cold-start checks the orchestrator runs before formatter-agent starts. Hard-block conditions surface NEEDS_CONTEXT before any file is written.

## Read Order (canonical)

1. SKILL.md — this skill's contract
2. `references/format-conventions.md` — bundle schema
3. `references/scheduler-formats.md` — 4 scheduler-import schemas
4. `references/platform-credentials.md` — auth contract + detection rules
5. `references/anti-patterns.md` — patterns to flag
6. `references/rubric.md` — what critic will score
7. `references/playbook.md` — methodology + when not to use
7b. `references/confirmation-gate.md` + `references/publish-confirmation-gate.md` — the D17 draft gate + the D18 two-stage publish gate (read the latter when `--mode=publish`)
8. `references/platforms/[platform].md` — per-platform rules (only those in `target_platforms`)
9. `references/_shared/before-starting-check.md` — common pre-dispatch (when sync repaired)
10. `references/_shared/pre-dispatch-protocol.md` — experience write/read loop (when sync repaired)

## Required Inputs (hard-block if missing)

| Input | Probe | Hard-block? |
|---|---|---|
| write-social artifact | path provided OR derivable from slug | YES — return NEEDS_CONTEXT, defer to `write-social` |
| `brand/BRAND.md` | file exists at canonical path | YES — return NEEDS_CONTEXT, defer to `create-brand` |
| Target platforms | derived from write-social artifact OR `--platforms` flag | YES — return NEEDS_CONTEXT if neither source |
| produce-asset manifest | optional; flagged if missing AND target platforms require image media | SOFT — emit "MEDIA REQUIRED" placeholder in draft |
| produce-video manifest | optional; flagged if missing AND target platforms require video media | SOFT — emit "MEDIA REQUIRED" placeholder in draft |

## Cold-Start Question Bundle

If write-social artifact missing OR target platforms not derivable, ask up to 5 questions before dispatching `write-social`:

1. **Slug:** what's the slug for this content (kebab-case, lowercase, ≤50 chars)?
2. **Source artifact:** is there an existing write-social artifact? (path or "no — please dispatch write-social")
3. **Target platforms:** which of the 9 supported? (default: all platforms in the write-social artifact's `target_platforms` field)
4. **Media:** is there a produce-asset / produce-video manifest? (path or "no — emit placeholder")
5. **Mode:** auto-detect (default) / export (force export-mode) / draft (per-platform draft — Typefully for X, browser-automation for the 8) / publish (live posting behind the two-stage confirmation gate; add `--dry-run` to rehearse)

Skip the bundle if all required inputs are present.

## Credentials Detection (binary, no values)

Run before formatter-agent starts. See `references/platform-credentials.md` § Detection Algorithm:

1. Probe env vars (`TYPEFULLY_API_KEY`, `BUFFER_ACCESS_TOKEN`, `HOOTSUITE_ACCESS_TOKEN`, etc.).
2. Probe `.forsvn/credentials/platforms.json` if it exists.
3. Return `credentials_state` object with binary `true`/`false` per service.
4. Never log or include the value itself.

## Mode Resolution Pre-Check

Before dispatching formatter, run the mode resolution from `agents/formatter-agent.md` § Mode Resolution:

- `--mode=publish` → publish route (D18). Resolve per-platform publish routes; the publish layer runs the critic content gate → two-stage confirmation gate → live posting (`references/procedures/dispatch-mechanics.md` § Publish Layer). `--dry-run` may be combined — prints the publish plan, posts nothing.
- `--mode=draft` → per-platform draft route (D17). X → Typefully draft if creds; the 8 non-X → browser-automation draft if session cookies present; else export per platform.
- `--mode=export` → all platforms in export-mode.
- `--mode=auto` (default) → per-platform: X → Typefully-draft if creds; the 8 → browser-automation-draft if cookies; else export. **Auto-detect never resolves to publish.**

A run returns BLOCKED at this stage only when `--mode=publish` is requested with no credentials for any platform. Otherwise publish proceeds into the publish layer — where the critic content gate (FAIL after 2 cycles → BLOCKED) or the operator's two-stage gate decision (abort → export-mode bundle) may still stop it.

## Setup Helper Activation

If `credentials_state.typefully == false` AND `--mode != export` AND `.forsvn/credentials/` doesn't exist:

1. Create `.forsvn/credentials/` directory.
2. Create `.forsvn/credentials/.gitignore` (gitignore everything except `.gitignore` itself and `*.example`).
3. Create `.forsvn/credentials/platforms.json.example` stub.
4. Verify root `.gitignore` has `.forsvn/credentials/` listed; append if missing.

Setup helper runs at most once per repo. Subsequent runs detect the directory exists and skip.

## Brief Validation

Cross-check the write-social artifact's schema:

- Has `target_platforms` field (or formatter derives from emitted-platform-variants in the artifact body).
- Has per-platform body variants (one per target platform).
- Has hook archetype + CTA + hashtag set declared per platform.
- Has frontmatter version field; if mismatched against expected (1.x), flag for cross-stack contract drift (anti-pattern #8).

Failed validation → return NEEDS_CONTEXT with "write-social artifact schema mismatch — expected version 1.x" message.

## Output Contract Verification

Confirm orchestrator can write to `docs/forsvn/artifacts/marketing/published-social/[slug]/`:

- Directory writable.
- No existing bundle at the same slug, OR operator confirmed re-emit.

## Routing Confirmation

Confirm `defers-to` paths haven't been triggered:

- write-social missing → defer to write-social, return NEEDS_CONTEXT.
- create-brand missing → defer to create-brand, return NEEDS_CONTEXT.
- produce-asset missing AND image media required → SOFT prompt (not hard block).
- produce-video missing AND video media required → SOFT prompt (not hard block).

## Status Outcome

Pre-dispatch completes with one of:

- **PROCEED** → all checks passed; formatter-agent dispatches with `credentials_state` + resolved mode + validated inputs.
- **NEEDS_CONTEXT** → required input missing; defer to upstream skill with explicit reason.
- **BLOCKED** → `--mode=publish` requested with no credentials for any platform, OR the publish critic content gate FAILed after 2 cycles.
