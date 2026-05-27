# Critical Gates — Full Detail

Non-negotiable. Source: brief 04 § Production Principle + § publish-social Hard Rule. Each gate is named in `SKILL.md`; this file holds the enforcement contract.

## 1. Auto-detect never publishes

Per-platform auto-detect resolves only to `export` or `draft` (Typefully-X / browser-automation for the 8 non-X). It NEVER resolves to `publish` — credentials alone never trigger live posting. Live posting requires explicit `--mode=publish`.

## 2. Publish is opt-in and gated

`--mode=publish` posts live ONLY after the critic content gate passes AND the operator clears the two-stage confirmation gate. No quiet downgrades (publish never silently becomes draft); no quiet upgrades. `--mode=publish --dry-run` prints the plan and posts nothing.

## 3. Credential safety

Credential values are NEVER logged, echoed, or written to any artifact, manifest, README, or skill output. `.forsvn/credentials/platforms.json` is gitignored; setup helper creates `.forsvn/credentials/.gitignore` if missing. Critic dim 6 greps every emitted file for `_KEY` / `_TOKEN` / `_SECRET`.

## 4. Char-cap enforcement

Every per-platform draft within its hard limit:

- X 280
- Threads 500
- Bluesky 300
- LinkedIn 3000
- IG 2200
- Facebook 63206
- YouTube description 5000
- TikTok 2200
- Reddit title 300 + body 40000

One over-limit variant = critic FAIL.

## 5. Scheduler-format validation

Typefully JSON parses cleanly + matches Draft API schema; Buffer / Hootsuite / generic CSVs have correct columns + UTF-8 + escaped commas + ISO-8601 datetimes. Critic dim 5 runs the actual parsers before delivery.

## 6. Generation provenance

`input_artifacts` lists the write-social path + any provided produce-asset/video manifests + `brand/BRAND.md`. `output_eval: null` until a future `evaluate-content` cycle scores the published output.

## 7. Confirmation gate before any browser-automation submit (D17)

When any platform resolves to browser-automation draft route, the skill MUST show operator a per-platform 80-char preview + single-confirm prompt before automation dispatches. Declined / timeout → all draft-route platforms fall back to export-mode. Drafts in the operator's UI are still operator-visible state worth a checkpoint. See [`../confirmation-gate.md`](../confirmation-gate.md).

## 8. Two-stage gate + critic-before-publish for `--mode=publish` (D18)

Live posting requires BOTH:

- (a) the critic content gate (dims 1-7) PASSes BEFORE the gate fires — a live post cannot be fixed afterward;
- (b) the operator clears the two-stage confirmation gate — Stage 1 reviews every full post body, Stage 2 requires the typed word `PUBLISH`.

Abort at either stage (or timeout) → export-mode bundle, nothing posted. Critic dim 8 (Live-Publish Safety) audits post-publish (orchestrator-applied). See [`../publish-confirmation-gate.md`](../publish-confirmation-gate.md).
