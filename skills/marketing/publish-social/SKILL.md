---
name: publish-social
description: "Turn write-social copy into a publishing bundle — per-platform drafts plus scheduler-import files (Typefully / Buffer / Hootsuite / CSV). `--mode=publish` posts live behind a two-stage gate. Covers 9 platforms (X / LinkedIn / Instagram / YouTube / TikTok / Facebook / Bluesky / Threads / Reddit). Not for writing copy (use write-social), media generation (use produce-asset / produce-video), or landing-page placement."
argument-hint: "[write-social slug or path]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.0.2"
  budget: standard
  estimated-cost: "$0.40-1.20"
---

# Publish Social — Integration-Aware Bundle Emitter

Converts a write-social artifact into a per-platform draft bundle + scheduler-import files. Auto-detects credentials, picks highest non-publish mode. Routing: [`routing.yaml`](routing.yaml) · agents + 4-route dispatch: [`references/agent-manifest.md`](references/agent-manifest.md).

**Core question:** Can the operator paste one file into their scheduler (or find X drafts in Typefully) without formatting another line?

## Critical Gates — load first

Non-negotiable. Full: `references/procedures/critical-gates.md`.

1. **Auto-detect never publishes** — `export`/`draft` only; live needs `--mode=publish`.
2. **Publish opt-in and gated** — critic PASS + two-stage confirmation; `--dry-run` posts nothing.
3. **Credential safety** — values NEVER logged/written; `.forsvn/credentials/platforms.json` gitignored; dim 6 greps `_KEY`/`_TOKEN`/`_SECRET`.
4. **Char-cap** — X 280 · Threads 500 · Bluesky 300 · LinkedIn 3000 · IG 2200 · FB 63206 · YouTube 5000 · TikTok 2200 · Reddit 300+40000. One over = FAIL.
5. **Scheduler-format validation** — Typefully JSON + Buffer/Hootsuite/generic CSVs parse cleanly (columns, UTF-8, ISO-8601).
6. **Provenance** — `input_artifacts` = write-social + media manifests + `brand/BRAND.md`; `output_eval: null` until `evaluate-content`.
7. **Browser-automation confirm gate (D17)** — preview + single-confirm; declined/timeout → export. `references/confirmation-gate.md`.
8. **Two-stage gate for `--mode=publish` (D18)** — dims 1-7 PASS, Stage 1 body review + Stage 2 typed `PUBLISH`. Abort → export. [`references/publish-confirmation-gate.md`](references/publish-confirmation-gate.md).

## Inputs

| Artifact | Req | Provides |
|---|---|---|
| write-social (path/slug) | **yes** | Platforms, body variants, hook, CTA, hashtags, media refs |
| `brand/BRAND.md` | **yes** | Voice, sacred elements, archetype |
| produce-asset / produce-video manifest | opt | Image / video media |
| `--mode` | opt | `auto` · `export` · `draft` · `publish` (+ `--dry-run`) |
| Target platforms | opt | Defaults to write-social; subset via flag |

Missing write-social → `NEEDS_CONTEXT` (`/write-social`). Missing `brand/BRAND.md` → `NEEDS_CONTEXT` (`/create-brand`).

## Output

Bundle `docs/forsvn/artifacts/marketing/published-social/[slug]/`: `manifest.md`, `platforms/[platform].md` (per target), `scheduler-imports/{typefully.json,buffer.csv,hootsuite.csv,generic.csv}`, `README.md`. Schema: `references/format-conventions.md`.

## Quality Gate

Critic enforces 8-dim rubric. Export/draft → before delivery; `--mode=publish` → **content gate before the confirmation gate**.

**Pass:** ≥56/80 aggregate AND every dim ≥6. FAIL → re-dispatch formatter (or automation for dim 7), max 2 cycles. Persistent publish FAIL → `BLOCKED`. Per-dim: [`references/quality-gate.md`](references/quality-gate.md). Full: [`references/rubric.md`](references/rubric.md).

## Routes

4 routes — full dispatch: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md):

- **A** no credentials: formatter export-all-9 → critic → bundle.
- **B** Typefully key: X via Draft API + 8 export → critic → bundle.
- **C** (D17) browser-automation: formatter → confirm gate → automation (3s pacing, export fallback) → critic → bundle.
- **D** (D18) `--mode=publish`: formatter + export fallback → critic content gate → `--dry-run` exits → two-stage gate → publish (Typefully X, automation 8) → dim 8.

## Artifact Contract

- **Root:** `docs/forsvn/artifacts/marketing/published-social/[slug]/` · **Lifecycle:** `pipeline`.
- **Frontmatter:** manifest (16 fields) + per-platform draft (12 fields) — incl. `pack_verified`/`applied_tactics` + a per-draft `## Legibility` section ([convention](references/_shared/legibility-convention.md)).
- **Provenance:** `input_artifacts` = write-social + media manifests + `brand/BRAND.md`; `output_eval: null` until `evaluate-content`.
- **Cross-stack:** schema changes need atomic update across write-social/produce-asset/produce-video. Full: [`references/format-conventions.md`](references/format-conventions.md) (v2 baseline: `_shared/artifact-contract-template.md`).

## Chain · Re-run · Anti-Patterns

**Prev:** `write-social` + `create-brand` (req), `produce-asset`/`produce-video` (opt). **Next:** see `## Execution`; feeds `evaluate-content`.

**Re-run:** write-social re-emitted, targets/scheduler changed, credentials first configured, draft rejected.

**Anti-patterns:** [`references/anti-patterns.md`](references/anti-patterns.md) — top hits: credential leakage (G3/d6), char-cap trunc (G4/d1).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — bundle written, critic passed, Gates green; publish posts live + confirmation logged.
- **DONE_WITH_CONCERNS** — critic flagged secondary issues OR one platform fell back to draft/export on publish.
- **NEEDS_CONTEXT** — write-social missing OR `brand/BRAND.md` missing OR targets not derivable.
- **BLOCKED** — `--mode=publish` with no credentials; critic FAILed twice (publish: gate never fires; export/draft: spec). Operator-aborted two-stage gate is NOT BLOCKED — ships export bundle as DONE.

## Execution

Offer the registry-gated fork (category `publish`) — **Brief-only**: follow the manifest's per-route instruction (export · Typefully draft · automation draft · publish); **Assisted/Direct** need a verified engine. See [execution-fork.md](references/_shared/execution-fork.md); record `execution_mode`.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.
