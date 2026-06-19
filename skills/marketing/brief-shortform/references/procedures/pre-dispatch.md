---
title: Short-Form Brief — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: short-form-brief
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions.

---

## Needed dimensions

- **Angle** — required (no default; cold-start asks; per-run input, no write-back)
- **Target platforms** — 1–3 typical, soft default 1 hero + 2 variants (Critical Gate 2; extend with a cost+craft warning)
- **Brand mode** — `founder` OR `company`, no `hybrid` (Critical Gate 3); auto-detect from BRAND.md when possible, else cold-start asks
- **Production mode** — `live-action` | `motion-graphic` | `mixed`; default per brand mode (founder → live-action, company → motion-graphic) unless operator picks
- **Market** — inherited from research artifact; cold-start asks if no research artifact
- **Campaign tie-in** — optional (slug or null); per-run input

## Read order (warm-start scan)

1. **Latest matching `docs/forsvn/artifacts/research/research-shortform/[slug].md`** from `.forsvn/index/manifest.json` (or `Glob` fallback) — **primary dependency** (Critical Gate 1).
   - Missing → emit: "No short-form-research artifact for this market. Run `research-shortform` first, or proceed with platform references only (briefs will lack current trend signals). [Run upstream / Proceed without]"
   - Trend signals stale (>30d) → emit: "Trend signals are X days old. Re-run research, or proceed with stale trends? Briefs may bet on decayed patterns. [Re-run / Proceed]"
   - Mechanics stale (>180d) → strongly recommend re-run; user can override with concerns flag.
2. `brand/BRAND.md` + `docs/forsvn/experience/business.md` → infer `brand_mode`. Solo founder / personal brand → `founder`. Faceless product / company → `company`. Ambiguous → ask in Cold Start Q3.
3. `research/icp-research.md` + `docs/forsvn/experience/audience.md` → audience VoC, register, market.
4. `docs/forsvn/experience/content.md` → recent content decisions, market lock-in, prior brand_mode / production_mode selections.
5. `docs/forsvn/artifacts/marketing/campaign-plan.md` → if `[slug]` matches a campaign asset, inherit theme/dates/CTAs.

---

## Warm Start (research artifact found, brand_mode inferred)

```
Found context for short-form-brief:
- research artifact: docs/forsvn/artifacts/research/research-shortform/[slug].md
  (trends 8d ago, mechanics 22d ago — fresh)
- brand_mode: founder (from BRAND.md archetype)
- market: VN (from research artifact)
- production_mode default: live-action (founder)
- platforms in research: TikTok, Reels, Shorts

Missing: angle, target platforms for this brief.

1. What's the angle?
2. Which platforms (1 hero + up to 2 variants from research-covered set)?
```

If brand_mode is inferred but production_mode is ambiguous (e.g., founder doing motion-graphic for a product reveal), the warm-start ALSO asks Q4 from Cold Start. Don't assume founder = always live-action without verifying.

## Cold Start (no usable warm-start match)

Emit the bundled 5-question prompt (one round-trip):

```
Short-form brief — quick decisions (one round-trip).

1. Angle / topic for this piece:
   [free text]

2. Target platform(s) (1-3 typical — soft default 1 hero + 2 variants):
   (a) TikTok only
   (b) Reels only
   (c) Shorts only
   (d) TikTok + Reels (default for founder content)
   (e) Reels + Shorts (default for company content)
   (f) All three (highest cost — review whether each is worth it)
   (g) Other: ___

3. Brand mode (skip if BRAND.md was found):
   (a) Founder — face-led, voice-driven, parasocial
   (b) Company — faceless, product-led, motion-graphic-friendly

4. Production mode (skip if you want default per brand mode):
   (a) Live-action (default for founder)
   (b) Motion-graphic / animated (default for company)
   (c) Mixed
   (d) Use brand-mode default — auto

5. Campaign tie-in (skip if no campaign-plan applies):
   [free text — campaign slug or theme to inherit, or 'none']

Answer 1-5 (skip resolved) in one response. I'll confirm what I heard, then dispatch.
```

Wait for answers. Do not dispatch without them.

## Write-back to `docs/forsvn/experience/content.md`

After Cold Start answers received, append to `content.md`:

| Q | Key | Why persist |
|---|---|---|
| 3. Brand mode | `Content — brand mode` | Stable per brand; subsequent briefs should not re-ask. |
| 4. Production mode | `Content — production mode default` | Stable per brand; subsequent briefs default to this unless operator overrides. |

Q1 (angle), Q2 (platforms), Q5 (campaign tie-in) are per-run inputs — do NOT write-back. They vary per artifact and would pollute the persistent experience store.

**Note on cross-skill coordination:** `write-social` (this stack's slot 1) also writes brand_mode-adjacent answers (founder/company voice). Both skills read+write `Content — brand mode` — ordering does not matter because the values agree by construction (both ask the same Q in the same words). If experience already has a value, both skills inherit it via warm-start.

## Hard-block conditions

- **Angle empty AND no warm-start match** → BLOCKED, ask for angle (Cold Start Q1).
- **Platforms requested > 3** → pause and surface the cost+craft trade-off (Critical Gate 2 soft default: 1 hero + 2 variants; critic attention per variant thins past 2). Proceed only on explicit operator opt-in; offer re-invoke as the higher-craft path. Not an automatic reject.
- **brand_mode = "hybrid" requested** → reject and re-ask (Critical Gate 3: founder OR company only).
- **No research artifact AND user declines to proceed** → NEEDS_CONTEXT, defer to `research-shortform`.
- **No BRAND.md AND brand_mode unresolvable from cold-start** → NEEDS_CONTEXT, defer to `create-brand`.
- **No ICP AND no audience hint** → NEEDS_CONTEXT, defer to `research-icp`.

## VN auto-routing (polish chain enforcement)

If `market = VN` is resolved (from research artifact, BRAND.md, or experience), the polish chain MUST include `polish-vn` per the Polish Chain table in SKILL.md (`polish-vn` on full body for company; `polish-vn` on spoken-line + full body for founder). The polish chain runs in Layer 2 post-critic; orchestrator does not need to ask the operator — auto-routing is the default. Anti-pattern row "VN market output without vn-tone" enforces this at critic gate if somehow bypassed.

`humanmaxxing` auto-routing for EN founder follows the same pattern (spoken-line only).

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Cold Start — when angle / platforms / brand_mode / market are missing AND not resolvable from warm-start, the bundled question still fires. `--fast` only skips the multi-agent orchestration after context is resolved (single-pass craft, critic gate skipped, polish chain skipped, but Critical Gates 1-6 still enforced per `_shared/mode-resolver.md`).

Hard-block conditions above STILL fire under `--fast` — safety gates supersede `--fast`.

## Performance Grounding (pre-generation)

Before Layer 1 dispatch, ground on the operator's own channel history for the target platform:

```bash
bun scripts/query-performance.ts <platform> --json
```

Obey the emitted `empty | sparse | sufficient` state + `guidance`. Platform mechanics stay with `research-shortform` + platform-intelligence; own data informs the hook/format/length direction for *this* account, never a prescriptive shot/element list (U12), and a brand floor always outranks it. Full read contract: [`../_shared/performance-grounding.md`](../_shared/performance-grounding.md).

**Then emit the Recall line** (required output): state the own-data result with its real `n` + the `empty/sparse/sufficient` state, and read the loaded platform pack's `## Open Questions` to name **one** unknown as the experiment this brief probes — see [`../_shared/performance-grounding.md`](../_shared/performance-grounding.md) § *The recall line*. The recall is shown in the brief, not just obeyed; never fabricate `n` on an empty/sparse store, and drop the open-question part if the pack has none.
