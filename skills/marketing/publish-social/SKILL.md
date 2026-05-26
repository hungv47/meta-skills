---
name: publish-social
description: "Turn write-social copy into a publishing bundle — per-platform drafts plus scheduler-import files (Typefully / Buffer / Hootsuite / CSV). `--mode=publish` posts live behind a two-stage gate. Covers 9 platforms (X / LinkedIn / Instagram / YouTube / TikTok / Facebook / Bluesky / Threads / Reddit). Not for writing copy (use write-social), media generation (use produce-asset / produce-video), or landing-page placement."
argument-hint: "[write-social slug or path]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.3.0"
  budget: standard
  estimated-cost: "$0.40-1.20"
---

# Publish Social — Integration-Aware Bundle Emitter

Converts a write-social artifact (+ optional media manifests) into a per-platform draft bundle + scheduler-import files. Auto-detects credentials and picks the highest non-publish mode available. Capability metadata (routes, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 4 routes + critic ordering for publish: [`references/agent-manifest.md`](references/agent-manifest.md).

**Core question:** Can the operator take this bundle and either (a) paste one file into their scheduler, or (b) find their X drafts in Typefully — without writing or formatting another line?

## Critical Gates — load first

Non-negotiable. brief 04 § Production Principle + § publish-social Hard Rule:

1. **Auto-detect never publishes.** Per-platform auto-detect resolves only to `export` or `draft` (Typefully-X / browser-automation for the 8 non-X). It NEVER resolves to `publish` — credentials alone never trigger live posting. Live posting requires explicit `--mode=publish`.
2. **Publish is opt-in and gated.** `--mode=publish` posts live ONLY after the critic content gate passes AND the operator clears the two-stage confirmation gate. No quiet downgrades (publish never silently becomes draft); no quiet upgrades. `--mode=publish --dry-run` prints the plan and posts nothing.
3. **Credential safety.** Credential values are NEVER logged, echoed, or written to any artifact, manifest, README, or skill output. `.forsvn/credentials/platforms.json` is gitignored; setup helper creates `.forsvn/credentials/.gitignore` if missing. Critic dim 6 greps every emitted file for `_KEY` / `_TOKEN` / `_SECRET`.
4. **Char-cap enforcement.** Every per-platform draft within its hard limit — X 280 · Threads 500 · Bluesky 300 · LinkedIn 3000 · IG 2200 · Facebook 63206 · YouTube description 5000 · TikTok 2200 · Reddit title 300 + body 40000. One over-limit variant = critic FAIL.
5. **Scheduler-format validation.** Typefully JSON parses cleanly + matches Draft API schema; Buffer / Hootsuite / generic CSVs have correct columns + UTF-8 + escaped commas + ISO-8601 datetimes. Critic dim 5 runs the actual parsers before delivery.
6. **Generation provenance.** `input_artifacts` lists the write-social path + any provided produce-asset/video manifests + `brand/BRAND.md`. `output_eval: null` until a future `evaluate-content` cycle scores the published output.
7. **Confirmation gate before any browser-automation submit (D17).** When any platform resolves to browser-automation draft route, the skill MUST show operator a per-platform 80-char preview + single-confirm prompt before automation dispatches. Declined / timeout → all draft-route platforms fall back to export-mode. Drafts in the operator's UI are still operator-visible state worth a checkpoint. See [`references/confirmation-gate.md`](references/confirmation-gate.md).
8. **Two-stage gate + critic-before-publish for `--mode=publish` (D18).** Live posting requires BOTH: (a) the critic content gate (dims 1-7) PASSes BEFORE the gate fires — a live post cannot be fixed afterward; (b) the operator clears the two-stage confirmation gate — Stage 1 reviews every full post body, Stage 2 requires the typed word `PUBLISH`. Abort at either stage (or timeout) → export-mode bundle, nothing posted. Critic dim 8 (Live-Publish Safety) audits post-publish (orchestrator-applied). See [`references/publish-confirmation-gate.md`](references/publish-confirmation-gate.md).

## Inputs

| Artifact | Required? | What it provides |
|---|---|---|
| write-social artifact (path or slug) | **required** | Platform list, body variants, hook archetype, CTA, hashtags, media refs |
| `brand/BRAND.md` | **required** | Voice, sacred elements, archetype |
| produce-asset manifest | optional | Image / carousel media for IG / FB / X carousel |
| produce-video manifest | optional | Video media for Reels / TikTok / Shorts / Threads video |
| `--mode` | optional | `auto` (default) · `export` · `draft` · `publish` (add `--dry-run` to print without posting) |
| Target platforms | optional | Defaults to write-social artifact's targets; can subset via flag |

Missing write-social → `NEEDS_CONTEXT`, defer to `/write-social`. Missing `brand/BRAND.md` → `NEEDS_CONTEXT`, defer to `/create-brand`.

## Output

Bundle root: `.forsvn/artifacts/mkt/published-social/[slug]/`

- `manifest.md` — canonical bundle contract listing every platform, every emitted file, mode that ran per platform, credentials detected (without values), operator's next-step instruction.
- `platforms/[platform].md` — one Markdown file per target platform with body, hashtags, CTA position, media ref, platform-specific formatting (LinkedIn line breaks, X thread split, IG caption + first-comment hashtag stack).
- `scheduler-imports/{typefully.json, buffer.csv, hootsuite.csv, generic.csv}` — paste-ready import files for 4 scheduler families.
- `README.md` — operator's step-by-step per scheduler (Typefully paste / Buffer CSV import / Hootsuite bulk import / generic-CSV hand-tune notes).

Full bundle schema: [`references/format-conventions.md`](references/format-conventions.md).

## Quality Gate

Critic-agent enforces the 8-dim rubric (`agents/critic-agent.md`). For export/draft it runs before delivery; for `--mode=publish` it runs as the **content gate before the confirmation gate** — a live post cannot be fixed after the fact.

- [ ] **Platform Char-Cap Compliance** — every per-platform variant within its hard limit (dim 1)
- [ ] **Media Spec Compliance** — aspect / file size / format per platform; media URLs cross-checked against produce-asset/video manifests (dim 2)
- [ ] **CTA Visibility** — CTA before each platform's algorithm-truncation point (X 280 / LinkedIn ~210 / IG ~125 / TikTok ~150) (dim 3)
- [ ] **Hashtag-Rules Per Platform** — count + position match convention (IG ≤30 / LinkedIn 3-5 / X 1-2 / Threads 1-3) (dim 4)
- [ ] **Scheduler-Format Validation** — Typefully JSON / Buffer / Hootsuite / generic CSVs all parse cleanly + match target schemas (dim 5)
- [ ] **Anti-Pattern Compliance** — no shadowban triggers · no policy-violating copy · no broken Unicode · no credential leakage (`_KEY`/`_TOKEN`/`_SECRET` grep returns zero) (dim 6)
- [ ] **Browser-Automation Safety** (D17) — confirmation gate ran · no auto-submit without confirmation · no cookie values in any log · no captcha-bypass · no screenshots captured (dim 7)
- [ ] **Live-Publish Safety** (D18) — for `--mode=publish`: critic ran before the gate · two-stage gate logged · every published row confirmation-backed · dry-run posted nothing (dim 8 — orchestrator-applied post-publish)

**Pass:** aggregate ≥56/80 AND every per-dim ≥6. Critic FAIL → re-dispatch formatter (or automation for dim 7) for the failing platform(s) with feedback (max 2 cycles). Persistent FAIL on a `--mode=publish` run → `BLOCKED`, the confirmation gate never fires. Full rubric: [`references/rubric.md`](references/rubric.md).

## Routes

4 routes — full dispatch graphs in [`references/agent-manifest.md`](references/agent-manifest.md):

- **Route A — no credentials:** formatter (export-mode all 9) → critic (dims 1-7) → write bundle.
- **Route B — Typefully key:** X via Typefully Draft API + other 8 export-mode → critic → write bundle.
- **Route C — browser-automation cookies (D17):** formatter → confirmation gate (per-platform preview + confirm) → automation (sequential 3s pacing, fallback to export on failure) → critic (dim 7) → write bundle.
- **Route D — `--mode=publish` (D18):** no credentials → BLOCKED. Else formatter + export fallback → critic content gate (FAIL twice → BLOCKED) → `--dry-run` exits if set → two-stage gate (abort → export bundle, nothing posted) → publish (Typefully schedule-immediate for X, automation Send for the 8; per-platform failure → fallback-draft / export) → orchestrator applies dim 8.

Full per-route mechanics: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Artifact Contract

- **Bundle root:** `.forsvn/artifacts/mkt/published-social/[slug]/`
- **Lifecycle:** `pipeline` (regenerated on re-run).
- **Manifest frontmatter (16 fields):** `skill` · `version` · `date` · `status` · `slug` · `source_artifacts` · `target_platforms` · `mode_per_platform` · `credentials_detected` · `scheduler_imports_emitted` · `bundle_file_count` · `dry_run` (D18) · `confirmation_result` (D17) · `automation_result_per_platform` (D17) · `publish_result_per_platform` (D18) · `provenance` (variant per `references/_shared/artifact-contract-template.md`).
- **Per-platform draft frontmatter (10 fields):** `skill` · `version` · `date` · `platform` · `char_count` · `media_refs` · `mode` · `draft_url` (D17) · `post_url` (D18) · `automation_result` (D17).
- **Generation provenance required.** `input_artifacts`: write-social path + media manifests + `brand/BRAND.md`. `output_eval: null` until downstream `evaluate-content`.
- **Cross-stack contract:** consumed by operator-chosen schedulers + future `evaluate-content` cycles. Schema changes require atomic update across upstream callers (write-social, produce-asset, produce-video).

Full schema: [`references/format-conventions.md`](references/format-conventions.md).

## Chain Position

**Previous:** `write-social` (required), `produce-asset` / `produce-video` (optional), `create-brand` (required) | **Next:** operator imports the scheduler-import file OR finds drafts in Typefully OR the bundle was live-posted; published posts feed future `evaluate-content` cycles.

**Re-run triggers:** write-social re-emitted, target-platform list changed, scheduler tool changed, credentials configured for first time, operator rejected a draft and wants formatter re-route.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before bundle ships. 17 patterns: 7 publish-social-specific (silent mode downgrade, credential leakage, char-cap silent truncation, mass-tagging, link-in-bio bait, shadowban-trigger copy, scheduler-CSV column drift) + 3 D17 browser-automation (silent auto-submit, cookie leakage, captcha-bypass) + 3 D18 live-publish (publish without two-stage confirm, publish on critic FAIL, dry-run that posts) + 4 cross-cutting marketing-stack rows.

Most common in practice: credential leakage (Critical Gate 3 + critic dim 6), char-cap silent truncation (Critical Gate 4 + critic dim 1).

## Completion Status

- **DONE** — bundle written, critic passed, all Critical Gates green; for `--mode=publish`, posts live with confirmation logged.
- **DONE_WITH_CONCERNS** — critic flagged secondary issues (hashtag count edge, generic CSV column needs hand-tune) OR a publish run where one platform fell back to draft/export.
- **NEEDS_CONTEXT** — write-social artifact missing OR `brand/BRAND.md` missing OR target platforms not derivable.
- **BLOCKED** — `--mode=publish` requested with no credentials for any platform; critic content gate FAILed twice on a publish run (gate never fired); critic FAILed twice on spec compliance for export/draft. A publish run where the operator aborts the two-stage gate is NOT BLOCKED — ships the export-mode bundle as DONE.

## Next Step

Auto-mode summary in manifest tells operator exactly what to do next:

- **Route A (export):** "Open your scheduler (Typefully / Buffer / Hootsuite / Hushuy / Later / Publer / Sprout). Import the matching file from `scheduler-imports/`. Set schedule inside the scheduler."
- **Route B (Typefully draft):** "X drafts at the URLs in `typefully.json`. Other 8 platforms export-mode — import the matching scheduler file."
- **Route C (browser-automation draft):** "Drafts landed in your platform UIs — open each `draft_url` from manifest, review, hit Send. Any `fallback-export` platform: paste from `platforms/[platform].md`."
- **Route D (`--mode=publish`):** "Posts are LIVE — `post_url`s in manifest. Any `fallback-draft` platform: open its draft and Send manually. To remove a post, follow per-platform delete instructions in the manifest (publish-social does not un-publish for you)."

After the operator publishes, future `evaluate-content` cycles score the output against the write-social brief's hypothesis.
