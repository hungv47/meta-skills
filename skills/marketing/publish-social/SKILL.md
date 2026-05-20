---
name: publish-social
description: "Closes the third gap in brief 04's production trio. Consumes a write-social artifact (+ optional produce-asset / produce-video manifests) and emits an integration-aware bundle at `.forsvn/artifacts/mkt/published-social/[slug]/` — per-platform native draft + 4 scheduler-import files (Typefully JSON / Buffer CSV / Hootsuite CSV / generic CSV for Hushuy / Later / Publer / Sprout) + README. Auto-detects credentials at invocation: if `TYPEFULLY_API_KEY` (env var or `.forsvn/credentials/platforms.json`) is set, X-platform goes draft route via Typefully Draft API; otherwise all 9 platforms emit as scheduler-import + per-platform Markdown drafts. Operator never selects mode by hand. v1 covers 9 platforms (X / LinkedIn / Instagram / YouTube / TikTok / Facebook / Bluesky / Threads / Reddit) — 6 backed by the canonical platform-intelligence catalog (D13), 4 template-only until catalog expands. `--mode=publish` (D18) posts live to all 9 platforms behind a two-stage current-session confirmation gate (X via Typefully schedule-immediate; the 8 non-X via browser-automation Send); `--mode=draft` stages drafts (Typefully API for X, browser-automation for the 8). Auto-detect never resolves to publish — `--mode=publish` is explicit opt-in; add `--dry-run` to print the publish plan without posting. Not for writing the copy itself (use write-social upstream). Not for video / image generation (use produce-video / produce-asset upstream). Not for landing-page placement (out of brief 04 scope)."
argument-hint: "[write-social slug or path]"
allowed-tools: Read Edit Write Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "1.2.0"
  budget: standard
  estimated-cost: "$0.40-1.20"
promptSignals:
  phrases:
    - "publish social"
    - "publish to social"
    - "schedule social"
    - "post to platform"
    - "draft tweets"
    - "draft a thread"
    - "schedule post"
    - "publish-ready"
    - "scheduler import"
    - "Typefully draft"
    - "Buffer import"
    - "Hootsuite import"
    - "post on X"
    - "post on LinkedIn"
    - "post on Instagram"
  allOf:
    - [publish, social]
    - [schedule, post]
    - [draft, tweet]
    - [scheduler, import]
  anyOf:
    - "publish-social"
    - "social publish"
    - "Typefully"
    - "Buffer"
    - "Hootsuite"
    - "schedule on"
    - "draft on"
  noneOf:
    - "design system"
    - "landing page"
    - "ad copy"
    - "image generation"
  minScore: 6
routing:
  intent-tags:
    - social-publishing
    - scheduler-handoff
    - integration-aware-draft
  position: production
  lifecycle: pipeline
  produces:
    - .forsvn/artifacts/mkt/published-social/[slug]/manifest.md
    - .forsvn/artifacts/mkt/published-social/[slug]/platforms/[platform].md
    - .forsvn/artifacts/mkt/published-social/[slug]/scheduler-imports/typefully.json
    - .forsvn/artifacts/mkt/published-social/[slug]/scheduler-imports/buffer.csv
    - .forsvn/artifacts/mkt/published-social/[slug]/scheduler-imports/hootsuite.csv
    - .forsvn/artifacts/mkt/published-social/[slug]/scheduler-imports/generic.csv
    - .forsvn/artifacts/mkt/published-social/[slug]/README.md
  consumes:
    - .forsvn/artifacts/mkt/copy/[platform]-[date]-[slug].md
    - .forsvn/artifacts/mkt/produced-assets/[slug]/manifest.md
    - .forsvn/artifacts/mkt/produced-videos/[slug]/manifest.md
    - brand/BRAND.md
  requires:
    - upstream write-social artifact
    - brand/BRAND.md
  defers-to:
    - skill: write-social
      when: "no social copy artifact exists yet for the target platforms"
    - skill: produce-asset
      when: "carousel / image media is required but no produce-asset manifest exists"
    - skill: produce-video
      when: "video media is required (Reels / TikTok / Shorts / Threads-video) but no produce-video manifest exists"
    - skill: create-brand
      when: "brand/BRAND.md missing"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Publish Social — Integration-Aware Bundle Emitter

*Production skill. Converts a write-social artifact (+ optional media manifests) into a per-platform draft bundle + scheduler-import files. Auto-detects credentials and picks the highest non-publish mode available.*

**Core Question:** "Can the operator take this bundle and either (a) paste one file into their scheduler of choice, or (b) find their X drafts already sitting in Typefully — without writing or formatting another line?"

> D16 shipped **export + Typefully API draft** (X via Typefully); D17 added **browser-automation drafts** for 8 platforms (LinkedIn / IG / FB / TikTok / YT / Threads / Bluesky / Reddit) via session-cookie auth + agent-browser; D18 added **`--mode=publish`** — live posting for all 9 platforms behind a two-stage confirmation gate (X via Typefully schedule-immediate, the 8 via browser-automation Send). See [`references/format-conventions.md`](references/format-conventions.md) for the bundle schema; [`references/confirmation-gate.md`](references/confirmation-gate.md) for D17's draft gate; [`references/publish-confirmation-gate.md`](references/publish-confirmation-gate.md) for D18's two-stage publish gate.

## Critical Gates — Read First

Non-negotiable constraints — brief 04 § Production Principle + § publish-social Hard Rule:

1. **Auto-detect never publishes.** Per-platform auto-detect resolves only to `export` or `draft` (Typefully-X / browser-automation for the 8 non-X). It NEVER resolves to `publish` — credentials alone never trigger live posting. Live posting requires explicit `--mode=publish`.
2. **Publish is opt-in and gated.** `--mode=publish` posts live; it runs only after the critic content gate passes AND the operator clears the two-stage confirmation gate (Gate 8). No quiet downgrades (publish never silently becomes draft) and no quiet upgrades (draft/auto never silently becomes publish). `--mode=publish --dry-run` prints the publish plan and posts nothing.
3. **Credential safety.** Credential values are NEVER logged, echoed, or written to any artifact, manifest, README, or skill output. `.forsvn/credentials/platforms.json` is gitignored; setup helper creates `.forsvn/credentials/.gitignore` if missing. Critic Gate 6 greps every emitted file for `_KEY` / `_TOKEN` / `_SECRET` patterns.
4. **Char-cap enforcement.** Every per-platform draft must fall within that platform's hard char limit (X 280 / Threads 500 / Bluesky 300 / LinkedIn 3000 / IG 2200 / Facebook 63206 / YouTube description 5000 / TikTok 2200 / Reddit title 300 + body 40000). One over-limit variant = critic FAIL.
5. **Scheduler-format validation.** Typefully JSON parses cleanly + matches Draft API schema; Buffer / Hootsuite / generic CSVs have correct columns + UTF-8 encoding + properly escaped commas + ISO-8601 datetime where required. Critic dim 5 runs the actual parsers before delivery.
6. **Generation provenance per D8.** `input_artifacts` lists the write-social path + any provided produce-asset / produce-video manifests + `brand/BRAND.md`. `output_eval: null` until a future `evaluate-content` cycle scores the published-social output.
7. **Confirmation gate before any browser-automation submit.** (D17) When any platform resolves to browser-automation draft route, the skill MUST show operator a per-platform 80-char preview + single-confirm prompt before automation-agent dispatches. Declined / timeout → all draft-route platforms fall back to D16 export-mode. Brief 04's "never publish live without explicit current-session confirmation" rule extends to drafts here — drafts in the operator's platform UI are still operator-visible state worth a checkpoint. See [`references/confirmation-gate.md`](references/confirmation-gate.md).
8. **Two-stage gate + critic-before-publish for `--mode=publish`.** (D18) Live posting requires BOTH: (a) the critic content gate (dims 1–7) PASSes BEFORE the gate fires — a live post cannot be fixed afterward, so for publish the critic runs before the action, not after; (b) the operator clears the **two-stage** confirmation gate — Stage 1 reviews every full post body, Stage 2 requires the typed word `PUBLISH`. Abort at either stage (or timeout) → export-mode bundle, nothing posted. Critic dim 8 (Live-Publish Safety) audits this post-publish (orchestrator-applied). See [`references/publish-confirmation-gate.md`](references/publish-confirmation-gate.md).

## Inputs

| Artifact | Required? | What it provides |
|----------|-----------|------------------|
| write-social artifact (path or slug) | **required** | Platform list, body variants per platform, hook archetype, CTA, hashtag set, media references |
| `brand/BRAND.md` | **required** | Voice, sacred elements, archetype — used for per-platform style sanity-check |
| produce-asset manifest (path) | optional | Image / carousel media for IG / FB / X carousel posts |
| produce-video manifest (path) | optional | Video media for IG Reels / TikTok / Shorts / Threads video |
| `--mode` | optional | `auto` (default — per-platform resolution: X = Typefully-draft if creds; LinkedIn/IG/FB/TikTok/YT/Threads/Bluesky/Reddit = browser-automation draft if session cookies; else export) / `export` (forces all-export, skips automation) / `draft` (per-platform draft via D16 Typefully or D17 browser-automation if cookies present; otherwise export per platform) / `publish` (D18 — live posting for all 9 platforms behind the two-stage confirmation gate; add `--dry-run` to print the plan without posting) |
| Target platforms | optional | Defaults to the write-social artifact's target platforms; can be subset via flag |

If write-social artifact missing → return `NEEDS_CONTEXT` and defer to `write-social`.
If `brand/BRAND.md` missing → return `NEEDS_CONTEXT` and defer to `create-brand`.

## Output

Primary artifact: `.forsvn/artifacts/mkt/published-social/[slug]/manifest.md` — canonical bundle contract listing every platform, every emitted file, mode that ran per platform (export vs Typefully-draft), credentials detected (without values), and the operator's next-step instruction.

Per-platform native drafts: `.forsvn/artifacts/mkt/published-social/[slug]/platforms/[platform].md` — one Markdown file per target platform with the body, hashtags, CTA position, media reference, and platform-specific formatting (e.g., LinkedIn line breaks, X thread split, IG caption + first-comment hashtag stack).

Scheduler-import bundle: `.forsvn/artifacts/mkt/published-social/[slug]/scheduler-imports/{typefully.json, buffer.csv, hootsuite.csv, generic.csv}` — paste-ready import files for the 4 covered scheduler families.

Bundle README: `.forsvn/artifacts/mkt/published-social/[slug]/README.md` — operator's step-by-step instructions for each scheduler (Typefully paste OR drafted IDs if API ran / Buffer CSV import / Hootsuite bulk import / generic-CSV hand-tune notes).

Full bundle schema: [`references/format-conventions.md`](references/format-conventions.md).

## Quality Gate

Critic-agent enforces the 8-dim rubric (`agents/critic-agent.md`). For export / draft it runs before delivery; for `--mode=publish` it runs as the **content gate before the confirmation gate** — a live post cannot be fixed after the fact:

- [ ] **Platform Char-Cap Compliance** — every per-platform variant within its hard limit (dim 1)
- [ ] **Media Spec Compliance** — aspect / file size / format per platform; media URLs cross-checked against produce-asset / produce-video manifests when provided (dim 2)
- [ ] **CTA Visibility** — CTA copy lives before each platform's algorithm-truncation point (X 280 / LinkedIn ~210 / IG ~125 / TikTok ~150 / etc.) (dim 3)
- [ ] **Hashtag-Rules Per Platform** — count + position match platform convention (IG ≤30 / LinkedIn 3-5 / X 1-2 / Threads 1-3 / etc.) (dim 4)
- [ ] **Scheduler-Format Validation** — Typefully JSON / Buffer CSV / Hootsuite CSV / generic CSV all parse cleanly and match their target schemas (dim 5)
- [ ] **Anti-Pattern Compliance** — no shadowban triggers / no policy-violating copy / no broken Unicode / no credential leakage (`_KEY`/`_TOKEN`/`_SECRET` grep returns zero) (dim 6)
- [ ] **Browser-Automation Safety** (D17) — confirmation gate ran; no auto-submit without confirmation; no cookie values in any log line; no captcha-bypass attempts; no screenshots captured (dim 7)
- [ ] **Live-Publish Safety** (D18) — for `--mode=publish`: critic ran before the gate; two-stage gate logged; every published row confirmation-backed; dry-run posted nothing (dim 8 — orchestrator-applied post-publish)

**Pass gate:** aggregate ≥ 56/80 AND every per-dim ≥ 6. The critic-agent scores dims 1–7 (its verdict gates on those); the orchestrator applies dim 8 post-publish and computes the final `/80`. Critic FAIL → re-dispatch formatter-agent (or automation-agent for dim 7 failures) for the failing platform(s) with specific feedback (max 2 cycles); a persistent FAIL on a `--mode=publish` run → `BLOCKED`, the confirmation gate never fires.

Full rubric: [`references/rubric.md`](references/rubric.md).

## Chain Position

**Previous:** `write-social` (required — per-platform copy), `produce-asset` / `produce-video` (optional — media bundles), `create-brand` (required — brand tokens) | **Next:** operator imports the scheduler-import file into their scheduler OR finds their X drafts in Typefully; published posts feed future `evaluate-content` cycles inside a loop.

**Re-run triggers:** write-social re-emitted, target-platform list changed, scheduler-tool changed (e.g., moved from Buffer to Hootsuite), credentials configured for first time, operator rejected a per-platform draft and wants formatter to re-route.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Formatter | 1 | `agents/formatter-agent.md` | Per-platform formatting + scheduler-import file emission + Typefully API draft when credentials present |
| Automation | 2 | `agents/automation-agent.md` | Browser-automation for 8 non-X platforms via agent-browser — drafts (D17) OR live Send (D18 `--mode=publish`); per-platform sequential with 3s pacing |
| Critic | 3 | `agents/critic-agent.md` | 8-dim rubric: char-caps, media specs, CTA visibility, hashtag rules, scheduler-format validation, anti-pattern compliance, browser-automation safety, live-publish safety (dim 8 orchestrator-applied) |

**Export / draft order:** formatter → D17 confirmation gate (if browser-automation draft route) → automation → critic. **Publish order (D18):** formatter → critic (content gate, dims 1–7) → two-stage confirmation gate → automation in publish mode → orchestrator applies dim 8. Critic moves before the action for publish because a live post cannot be fixed afterward. No parallel Layer 1, no merge step.

## Routing + Dispatch

Per-platform auto-detect probes credentials at invocation:

```
ROUTE A (no credentials detected): export bundle only
  1. Pre-Dispatch — read write-social artifact + brand/BRAND.md + optional produce-asset/video manifests
  2. Probe credentials — none found
  3. Dispatch formatter-agent in export-mode for all 9 target platforms
  4. SKIP confirmation gate (no automation route resolved)
  5. Dispatch critic-agent for rubric review (dims 1–7)
  6. Critic FAIL → re-dispatch formatter for failing platform(s) (max 2 cycles)
  7. Critic PASS → write bundle (manifest + per-platform drafts + 4 scheduler imports + README)
  8. Return bundle path + mode summary ("ran in export-mode; configure credentials for draft routes")

ROUTE B (Typefully credentials detected): X via API + others in export
  1. Pre-Dispatch — same as Route A
  2. Probe credentials — Typefully API key found
  3. Dispatch formatter-agent: X via Typefully Draft API (returns draft IDs + URLs); other 8 platforms in export-mode
  4. SKIP confirmation gate (no browser-automation resolved)
  5. Dispatch critic-agent for rubric review (dims 1–7)
  6. PASS → write bundle, return as above

ROUTE C (D17: browser-automation cookies present for ≥1 non-X platform)
  1. Pre-Dispatch — same as Route A
  2. Probe credentials — Typefully key (maybe) AND session_cookies for one or more non-X platforms
  3. Dispatch formatter-agent: format all per-platform drafts in memory + write export-mode bundle as fallback
  4. CONFIRMATION GATE — show operator per-platform 80-char preview + single confirm prompt
     - YES → continue to automation
     - NO / timeout → roll back to export-mode for draft-route platforms; skip to step 6
  5. Dispatch automation-agent — sequential per-platform with 3s pacing; single attempt; per-platform fallback to export on failure
  6. Dispatch critic-agent for rubric review (dims 1–7) (dim 7 = browser-automation safety)
  7. PASS → write bundle with automation_result_per_platform results; return draft URLs + fallback platforms

ROUTE D (--mode=publish, D18): live posting behind the two-stage gate
  1. Pre-Dispatch — read inputs; resolve --mode=publish + dry_run flag.
     No credentials for any platform → BLOCKED ("configure credentials or use --mode=export").
  2. Dispatch formatter-agent: format every post; resolve per-platform publish routes
     (X → typefully-publish; 8 → browser-automation-publish; uncredentialed → export);
     write the export-mode bundle to disk as the abort fallback.
  3. Dispatch critic-agent — CONTENT GATE, dims 1-7. FAIL → re-dispatch formatter
     (max 2 cycles); persistent FAIL → BLOCKED, gate never fires.
  4. If --dry-run → print the publish plan (every post body + route) and exit. No gate, no posting.
  5. TWO-STAGE CONFIRMATION GATE — Stage 1: review every full post body → [y/N].
     Stage 2: type PUBLISH to confirm. Abort either stage / timeout → export-mode bundle, nothing posted.
  6. Publish — Typefully schedule-immediate for X; automation-agent in publish mode (Send)
     for the credentialed non-X platforms, sequential, 3s pacing. Per-platform failure →
     fallback-draft (cookies present) or fallback-export. Other platforms continue.
  7. Orchestrator Self-Check applies dim 8; manifest records publish_result_per_platform +
     post_url + per-platform delete instructions. Return bundle path + live URLs.
```

Full dispatch logic: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Artifact Contract

- **Bundle root:** `.forsvn/artifacts/mkt/published-social/[slug]/`
- **Lifecycle:** `pipeline` (regenerated by re-running; not canonical)
- **Frontmatter (manifest):** 16 fields — `skill` / `version` / `date` / `status` / `slug` / `source_artifacts` / `target_platforms` / `mode_per_platform` / `credentials_detected` / `scheduler_imports_emitted` / `bundle_file_count` / `dry_run` (D18) / `confirmation_result` (D17) / `automation_result_per_platform` (D17) / `publish_result_per_platform` (D18) / `provenance` (generation variant per `references/_shared/artifact-contract-template.md`)
- **Frontmatter (per-platform draft):** 10 fields — `skill` / `version` / `date` / `platform` / `char_count` / `media_refs` / `mode` / `draft_url` (D17) / `post_url` (D18) / `automation_result` (D17)
- **Generation provenance:** required. `input_artifacts` lists the write-social path + any provided produce-asset/video manifests + `brand/BRAND.md`. `output_eval: null` until a downstream `evaluate-content` cycle scores the published output.
- **Cross-stack contract:** consumed by operator-chosen scheduler tools + future `evaluate-content` cycles inside a loop. Schema changes require atomic update across upstream callers (write-social, produce-asset, produce-video) — never silently drift.

Full schema: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md). Re-read before any bundle ships. 17 patterns: 7 publish-social-specific (silent mode downgrade, credential leakage, char-cap silent truncation, mass-tagging, link-in-bio bait, shadowban-trigger copy, scheduler-CSV column drift) + 3 D17 browser-automation (silent auto-submit, cookie leakage, captcha-bypass) + 3 D18 live-publish (publish without two-stage confirm, publish on critic FAIL, dry-run that posts) + 4 cross-cutting marketing-stack rows.

Most common in practice: credential leakage (Critical Gate 3 + critic dim 6) and char-cap silent truncation (Critical Gate 4 + critic dim 1).

## Completion Status

End with one status:

- `DONE` — bundle written, critic passed, all 8 Critical Gates green, mode summary in manifest; for `--mode=publish`, posts live with confirmation logged
- `DONE_WITH_CONCERNS` — bundle delivered but critic flagged secondary issues (e.g., one platform's hashtag count at threshold edge, generic CSV column may need hand-tune for operator's scheduler); OR a publish run where one platform fell back to draft/export
- `NEEDS_CONTEXT` — write-social artifact missing OR brand/BRAND.md missing OR target platforms not derivable
- `BLOCKED` — `--mode=publish` requested with no credentials for any platform; critic content gate FAILed twice on a `--mode=publish` run (the confirmation gate never fired, nothing posted); critic FAILed twice on spec compliance for export/draft. A publish run where the operator aborts the two-stage gate is NOT `BLOCKED` — it ships the export-mode bundle as `DONE`.

## Next Step

Auto-mode summary in manifest tells operator exactly what to do next:

- **Route A (export-only):** "Open your scheduler (Typefully / Buffer / Hootsuite / Hushuy / Later / Publer / Sprout). Import the matching file from `scheduler-imports/`. Set your schedule inside the scheduler."
- **Route B (Typefully draft):** "Your X drafts are at the URLs in `typefully.json`. The other 8 platforms are export-mode — import the matching scheduler file."
- **Route C (browser-automation draft):** "Drafts landed in your platform UIs — open each `draft_url` from the manifest, review, hit Send. Any `fallback-export` platform: paste from `platforms/[platform].md`."
- **Route D (`--mode=publish`):** "Posts are LIVE — `post_url`s are in the manifest. Any `fallback-draft` platform: open its draft and Send manually; any `fallback-export`: paste from `platforms/[platform].md`. To remove a post, follow the per-platform delete instructions in the manifest (publish-social does not un-publish for you)."

After the operator publishes, future `evaluate-content` cycles can score the published output against the write-social brief's hypothesis (engagement / impressions / dwell / share-rate / saves vs baseline).

## References

- **Shared:** `references/_shared/{eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, anti-sycophancy, artifact-contract-template, platform-intelligence}.md` (synced via `scripts/sync-skill-support.mjs` — broken for 2.0 layout per D8 finding; listed as expected dependencies for when sync is fixed in D15+ candidate)
- **Frameworks (`references/`):** `format-conventions.md` (bundle schema), `anti-patterns.md` (publish-social + cross-cutting + D17 browser-automation + D18 live-publish patterns), `scheduler-formats.md` (4 scheduler schemas), `platform-credentials.md` (auth contract incl. session_cookies field), `rubric.md` (8 dims × 0-10), `playbook.md` (methodology), `session-cookie-export.md` (operator guide D17), `confirmation-gate.md` (D17 single-confirm draft protocol), `publish-confirmation-gate.md` (D18 two-stage publish gate)
- **Per-platform refs (`references/platforms/`):** `x.md`, `linkedin.md`, `instagram.md`, `youtube.md`, `tiktok.md`, `facebook.md`, `bluesky.md`, `threads.md`, `reddit.md` (9 files)
- **Automation-flow refs (`references/automation-flows/`, D17):** `linkedin.md`, `instagram.md`, `facebook.md`, `tiktok.md`, `youtube.md`, `threads.md`, `bluesky.md`, `reddit.md` (8 files; X uses D16 Typefully API instead)
- **Procedures (`references/procedures/`):** `pre-dispatch.md`, `dispatch-mechanics.md`
- **Agents (`agents/`):** 3 agents — see Agent Manifest above
- **Upstream:** `skills/marketing/write-social/` (per-platform copy), `skills/marketing/produce-asset/` (image media), `skills/marketing/produce-video/` (video media), `skills/marketing/create-brand/` (brand tokens)

## Worked Example (deferred)

End-to-end Route A walkthrough (LinkedIn + X + IG bundle from a write-social artifact through manifest + 3 per-platform drafts + 4 scheduler imports + critic PASS) deferred to a follow-up — v1 ships the skill scaffold; worked examples land when the first real publish-social run completes in a project.
