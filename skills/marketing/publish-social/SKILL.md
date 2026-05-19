---
name: publish-social
description: "Closes the third gap in brief 04's production trio. Consumes a write-social artifact (+ optional produce-asset / produce-video manifests) and emits an integration-aware bundle at `.forsvn/artifacts/mkt/published-social/[slug]/` — per-platform native draft + 4 scheduler-import files (Typefully JSON / Buffer CSV / Hootsuite CSV / generic CSV for Hushuy / Later / Publer / Sprout) + README. Auto-detects credentials at invocation: if `TYPEFULLY_API_KEY` (env var or `.forsvn/credentials/platforms.json`) is set, X-platform goes draft route via Typefully Draft API; otherwise all 9 platforms emit as scheduler-import + per-platform Markdown drafts. Operator never selects mode by hand. v1 covers 9 platforms (X / LinkedIn / Instagram / YouTube / TikTok / Facebook / Bluesky / Threads / Reddit) — 6 backed by the canonical platform-intelligence catalog (D13), 4 template-only until catalog expands. `--mode=publish` returns BLOCKED in v1 (deferred to D18, requires current-session confirmation gate). Non-X `--mode=draft` returns BLOCKED in v1 (deferred to D17, requires browser-automation). Not for writing the copy itself (use write-social upstream). Not for video / image generation (use produce-video / produce-asset upstream). Not for landing-page placement (out of brief 04 scope)."
argument-hint: "[write-social slug or path]"
allowed-tools: Read Edit Write Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
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

> v1 ships **export + Typefully API draft** only. Browser-automation drafts (LinkedIn / IG / FB) deferred to D17. `--publish` deferred to D18. See [`references/format-conventions.md`](references/format-conventions.md) for the bundle schema.

## Critical Gates — Read First

Non-negotiable constraints — brief 04 § Production Principle + § publish-social Hard Rule:

1. **Export-mode floor.** Auto-detect mode NEVER picks `publish` — only `export` or `draft` (Typefully-X only). `--mode=publish` always returns `BLOCKED` with "deferred to D18 — explicit current-session confirmation gate not implemented." No silent fall-throughs.
2. **D17 / D18 deferral.** Non-X `--mode=draft` returns `BLOCKED` with "deferred to D17 — browser-automation route not implemented." `--mode=publish` returns `BLOCKED` regardless of platform. Both deferral messages are explicit — no quiet downgrades.
3. **Credential safety.** Credential values are NEVER logged, echoed, or written to any artifact, manifest, README, or skill output. `.forsvn/credentials/platforms.json` is gitignored; setup helper creates `.forsvn/credentials/.gitignore` if missing. Critic Gate 6 greps every emitted file for `_KEY` / `_TOKEN` / `_SECRET` patterns.
4. **Char-cap enforcement.** Every per-platform draft must fall within that platform's hard char limit (X 280 / Threads 500 / Bluesky 300 / LinkedIn 3000 / IG 2200 / Facebook 63206 / YouTube description 5000 / TikTok 2200 / Reddit title 300 + body 40000). One over-limit variant = critic FAIL.
5. **Scheduler-format validation.** Typefully JSON parses cleanly + matches Draft API schema; Buffer / Hootsuite / generic CSVs have correct columns + UTF-8 encoding + properly escaped commas + ISO-8601 datetime where required. Critic dim 5 runs the actual parsers before delivery.
6. **Generation provenance per D8.** `input_artifacts` lists the write-social path + any provided produce-asset / produce-video manifests + `brand/BRAND.md`. `output_eval: null` until a future `evaluate-content` cycle scores the published-social output.

## Inputs

| Artifact | Required? | What it provides |
|----------|-----------|------------------|
| write-social artifact (path or slug) | **required** | Platform list, body variants per platform, hook archetype, CTA, hashtag set, media references |
| `brand/BRAND.md` | **required** | Voice, sacred elements, archetype — used for per-platform style sanity-check |
| produce-asset manifest (path) | optional | Image / carousel media for IG / FB / X carousel posts |
| produce-video manifest (path) | optional | Video media for IG Reels / TikTok / Shorts / Threads video |
| `--mode` | optional | `auto` (default — picks export or Typefully-draft) / `export` (forces all-export) / `draft` (X only; non-X BLOCKED) / `publish` (always BLOCKED in v1) |
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

Single critic-agent runs before delivery — `agents/critic-agent.md` enforces the 6-dim rubric:

- [ ] **Platform Char-Cap Compliance** — every per-platform variant within its hard limit (dim 1)
- [ ] **Media Spec Compliance** — aspect / file size / format per platform; media URLs cross-checked against produce-asset / produce-video manifests when provided (dim 2)
- [ ] **CTA Visibility** — CTA copy lives before each platform's algorithm-truncation point (X 280 / LinkedIn ~210 / IG ~125 / TikTok ~150 / etc.) (dim 3)
- [ ] **Hashtag-Rules Per Platform** — count + position match platform convention (IG ≤30 / LinkedIn 3-5 / X 1-2 / Threads 1-3 / etc.) (dim 4)
- [ ] **Scheduler-Format Validation** — Typefully JSON / Buffer CSV / Hootsuite CSV / generic CSV all parse cleanly and match their target schemas (dim 5)
- [ ] **Anti-Pattern Compliance** — no shadowban triggers / no policy-violating copy / no broken Unicode / no credential leakage (`_KEY`/`_TOKEN`/`_SECRET` grep returns zero) (dim 6)

**Pass gate:** aggregate ≥ 42/60 AND every per-dim ≥ 6. Critic FAIL → re-dispatch formatter-agent for the failing platform(s) with specific feedback (max 2 cycles).

Full rubric: [`references/rubric.md`](references/rubric.md).

## Chain Position

**Previous:** `write-social` (required — per-platform copy), `produce-asset` / `produce-video` (optional — media bundles), `create-brand` (required — brand tokens) | **Next:** operator imports the scheduler-import file into their scheduler OR finds their X drafts in Typefully; published posts feed future `evaluate-content` cycles inside a loop.

**Re-run triggers:** write-social re-emitted, target-platform list changed, scheduler-tool changed (e.g., moved from Buffer to Hootsuite), credentials configured for first time, operator rejected a per-platform draft and wants formatter to re-route.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Formatter | 1 | `agents/formatter-agent.md` | Per-platform formatting + scheduler-import file emission + Typefully API draft when credentials present |
| Critic | 2 (final) | `agents/critic-agent.md` | 6-dim rubric: char-caps, media specs, CTA visibility, hashtag rules, scheduler-format validation, anti-pattern compliance |

Sequential formatter → critic. No parallel Layer 1, no merge step. Mirrors D11/D14 production-skill pattern; complexity matches integration-aware-but-not-cred-fragile v1 scope.

## Routing + Dispatch

Auto-detect probes credentials at invocation:

```
ROUTE A (no credentials detected): export bundle only
  1. Pre-Dispatch — read write-social artifact + brand/BRAND.md + optional produce-asset/video manifests
  2. Probe TYPEFULLY_API_KEY env var + .forsvn/credentials/platforms.json — none found
  3. Dispatch formatter-agent in export-mode for all target platforms
  4. Dispatch critic-agent for 6-dim review
  5. Critic FAIL → re-dispatch formatter for failing platform(s) (max 2 cycles)
  6. Critic PASS → write bundle (manifest + per-platform drafts + 4 scheduler imports + README)
  7. Return bundle path + mode summary ("ran in export-mode; configure TYPEFULLY_API_KEY for X draft route")

ROUTE B (Typefully credentials detected): hybrid draft + export
  1. Pre-Dispatch — same as Route A
  2. Probe credentials — Typefully API key found in env or .forsvn/credentials/
  3. Dispatch formatter-agent: X via Typefully Draft API (returns draft IDs + URLs); all other 8 platforms in export-mode
  4. Dispatch critic-agent for 6-dim review
  5. Critic FAIL → re-dispatch formatter for failing platform(s) (max 2 cycles)
  6. Critic PASS → write bundle (manifest reports "X = Typefully draft; URLs in typefully.json"; other 8 = export-mode)
  7. Return bundle path + Typefully draft URLs + scheduler-import paths for the other 8 platforms

ROUTE C (--mode=publish OR --mode=draft for non-X): BLOCKED
  - Return BLOCKED with explicit deferral message (D17 for non-X draft, D18 for any publish)
  - Do NOT write a partial bundle. Do NOT silently downgrade to export.
```

Full dispatch logic: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Artifact Contract

- **Bundle root:** `.forsvn/artifacts/mkt/published-social/[slug]/`
- **Lifecycle:** `pipeline` (regenerated by re-running; not canonical)
- **Frontmatter (manifest):** 12 fields — `skill` / `version` / `date` / `status` / `slug` / `source_artifacts` / `target_platforms` / `mode_per_platform` / `credentials_detected` / `scheduler_imports_emitted` / `bundle_file_count` / `provenance` (generation variant per `references/_shared/artifact-contract-template.md`)
- **Frontmatter (per-platform draft):** 7 fields — `skill` / `version` / `date` / `platform` / `char_count` / `media_refs` / `mode`
- **Generation provenance:** required. `input_artifacts` lists the write-social path + any provided produce-asset/video manifests + `brand/BRAND.md`. `output_eval: null` until a downstream `evaluate-content` cycle scores the published output.
- **Cross-stack contract:** consumed by operator-chosen scheduler tools + future `evaluate-content` cycles inside a loop. Schema changes require atomic update across upstream callers (write-social, produce-asset, produce-video) — never silently drift.

Full schema: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md). Re-read before any bundle ships. 7 publish-social-specific patterns (silent mode downgrade, credential leakage, char-cap silent truncation, mass-tagging, link-in-bio bait, shadowban-trigger copy, scheduler-CSV column drift) + 4 cross-cutting marketing-stack rows.

Most common in practice: credential leakage (Critical Gate 3 + critic dim 6) and char-cap silent truncation (Critical Gate 4 + critic dim 1).

## Completion Status

End with one status:

- `DONE` — bundle written, critic passed, all 6 Critical Gates green, mode summary in manifest
- `DONE_WITH_CONCERNS` — bundle delivered but critic flagged secondary issues (e.g., one platform's hashtag count at threshold edge, generic CSV column may need hand-tune for operator's scheduler)
- `NEEDS_CONTEXT` — write-social artifact missing OR brand/BRAND.md missing OR target platforms not derivable
- `BLOCKED` — `--mode=publish` requested (deferred to D18); non-X `--mode=draft` requested (deferred to D17); critic FAILed twice on spec compliance

## Next Step

Auto-mode summary in manifest tells operator exactly what to do next:

- **Route A (export-only):** "Open your scheduler (Typefully / Buffer / Hootsuite / Hushuy / Later / Publer / Sprout). Import the matching file from `scheduler-imports/`. Set your schedule inside the scheduler."
- **Route B (Typefully draft):** "Your X drafts are at the URLs in `typefully.json`. The other 8 platforms are export-mode — import the matching scheduler file."

After the operator publishes, future `evaluate-content` cycles can score the published output against the write-social brief's hypothesis (engagement / impressions / dwell / share-rate / saves vs baseline).

## References

- **Shared:** `references/_shared/{eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, anti-sycophancy, artifact-contract-template, platform-intelligence}.md` (synced via `scripts/sync-skill-support.mjs` — broken for 2.0 layout per D8 finding; listed as expected dependencies for when sync is fixed in D15+ candidate)
- **Frameworks (`references/`):** `format-conventions.md` (bundle schema), `anti-patterns.md` (7 publish-social + 4 cross-cutting), `scheduler-formats.md` (4 scheduler schemas), `platform-credentials.md` (auth contract), `rubric.md` (6 dims × 0-10), `playbook.md` (methodology)
- **Per-platform refs (`references/platforms/`):** `x.md`, `linkedin.md`, `instagram.md`, `youtube.md`, `tiktok.md`, `facebook.md`, `bluesky.md`, `threads.md`, `reddit.md` (9 files)
- **Procedures (`references/procedures/`):** `pre-dispatch.md`, `dispatch-mechanics.md`
- **Agents (`agents/`):** 2 agents — see Agent Manifest above
- **Upstream:** `skills/marketing/write-social/` (per-platform copy), `skills/marketing/produce-asset/` (image media), `skills/marketing/produce-video/` (video media), `skills/marketing/create-brand/` (brand tokens)

## Worked Example (deferred)

End-to-end Route A walkthrough (LinkedIn + X + IG bundle from a write-social artifact through manifest + 3 per-platform drafts + 4 scheduler imports + critic PASS) deferred to a follow-up — v1 ships the skill scaffold; worked examples land when the first real publish-social run completes in a project.
