# Procedure — Pre-Dispatch (App-Preview Brief)

> Load when entering `/brief-app-preview` Cold or Warm Start. Captures the full read order, dimensions, Cold/Warm prompts, write-back map, chain position, and skill-deference logic specific to screenshot-driven product-demo briefs.

Wraps the canonical Pre-Dispatch protocol at `references/_shared/pre-dispatch-protocol.md` with app-preview-specific dimensions.

---

## Needed dimensions

brief-app-preview needs six dimensions resolved before agent dispatch:

1. **Feature name** — 1 feature only; 1-2 sentences of intent
2. **Screenshot inventory** — directory path containing ≥2 source files per state required for the chosen sequence; state labels per file (or label-on-read)
3. **Flow order** — sequence of screenshots that proves the feature (resting → interaction-start → interaction-result → end-state, or a variant)
4. **Target surface** — `app-store` | `onboarding` | `website` | `social` (exactly one)
5. **Brand mode** — `founder` | `company` (read from BRAND.md when present)
6. **Market** — region (informs caption register and locale-specific platform constraints)

If feature or screenshots are missing AND not resolvable → `NEEDS_CONTEXT`. If surface is missing AND can't be inferred from the operator's prompt language → Cold Start. If all six resolve → Warm Start summary + optional probe.

---

## Read order

Before asking, read in this sequence and announce what's resolved:

1. **Pipeline artifacts:**
   - `brand/BRAND.md` → voice, archetype, brand_mode (resolves Q5)
   - `brand/DESIGN.md` → color tokens, type scale, radius, spacing (resolves token inventory for motion-spec)
   - `research/icp-research.md` → audience + market (informs Q6 + caption register)
   - `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/` → prior brief for this feature (enables `--rev=N` re-run)

2. **Experience substrate:**
   - `docs/forsvn/experience/product.md` → feature inventory (resolves Q1 if feature name ambiguous)
   - `docs/forsvn/experience/audience.md` → market + register (informs Q6)
   - `docs/forsvn/experience/business.md` → business model + brand mode (resolves Q5)

3. **Filesystem probe (light):**
   - List operator-supplied screenshot directory; count files, infer state labels if filenames hint (`01-home.png` → resting; `02-tap.png` → interaction-start; etc.)

4. **Manifest check:**
   - `.forsvn/index/manifest.json` → check for stale `BRAND.md` or `DESIGN.md` (>180 days → flag in artifact, don't block)

---

## Warm Start prompt

When feature + screenshots + surface all supplied AND brand artifacts resolve:

```
Found:
- feature → "[feature, 1 sentence]"
- screenshots → [N files in screenshots/], labeled [resting / interaction-start / interaction-result / end-state]
- surface → "[surface]"
- brand_mode → "[founder | company]" (from BRAND.md)
- market → "[region]" (from icp-research.md or experience/audience.md)
- brand_source → brand-md

Need before dispatching: confirm the flow order — S01 → S02 → S03 → S04 reads as
[resting → tap → result → end-state]. Any adjustment?
```

If flow order resolves cleanly from filename ordering or operator's prompt → skip probe and dispatch with one-line confirm.

---

## Cold Start (5-question bundled)

When 3+ dimensions are missing OR the prompt is too thin to resolve:

```
To brief this app preview I need 5 things. Answer in any order:

1. WHAT FEATURE — name the one feature and give 1-2 sentences of intent.
   (One feature per brief. If you have three features, that's three briefs — re-invoke for each.)

2. SCREENSHOTS — where are the source files? (path to directory)
   For each state of the feature I need at least one file:
   - resting (the affordance before the user acts)
   - interaction-start (the moment of the user's action)
   - interaction-result (the screen mid-response or settled)
   - end-state (the final settled result)

3. SURFACE — one of: app-store | onboarding | website | social.
   This locks aspect, length, audio default, and OST policy.

4. BRAND — do you have brand/BRAND.md + brand/DESIGN.md ready?
   - Yes → I'll use them. brand_source: brand-md.
   - No → I'll sample colors/type from your screenshots. brand_source: cold-start-hint.
   (Either way the brief proceeds; cold-start runs flag a warning on motion specs.)

5. MARKET — region (e.g., US, EU, VN) — informs caption register.

Reply with whichever you have; I'll re-ask for missing ones or proceed with sensible defaults if you say "use defaults."
```

---

## Hard-block conditions

Pre-dispatch returns `NEEDS_CONTEXT` (not Cold Start) when:

- **Screenshots directory is missing OR empty.** Hard Critical Gate 1; no path forward without sources.
- **Operator names ≥2 features in one prompt.** Hard Critical Gate 2; force the split. Return the candidate breakdown.
- **Operator requests `--render` / `--publish` / `--auto-run`.** This skill emits briefs; produce-video emits scaffolds; neither renders. Return `BLOCKED` with the chain explanation.
- **Surface doesn't match the four canonical options.** Return `NEEDS_CONTEXT` with the four-option enumeration.

---

## Skill deference (when to defer instead)

The operator's prompt may match this skill's routing but actually fit a sibling skill better. Defer when:

| Prompt shape | Defer to | Why |
|---|---|---|
| "TikTok video about our app" with no screenshots / heavy angle / hook emphasis | `brief-shortform` | Angle-led social content; product is one element, not the proof |
| "Render the video for this brief" | `produce-video` | Render scaffolds are produce-video's job; this skill emits the brief |
| "Publish this on our app store" | `publish-social` (or operator's app-store upload tool) | Publishing is downstream of both this skill and produce-video |
| "Design a new logo / brand kit" | `create-brand` | Brand creation is upstream; this skill consumes BRAND.md + DESIGN.md |
| "Static screenshot for our website" | `brief-graphic` | Static assets, not motion |
| "Show off the whole app" | (split into per-feature briefs) | Multi-feature framing is rejected; offer the split |

When deferring, return `NEEDS_CONTEXT` with the recommended sibling skill named and a one-line rationale.

---

## Write-back map

When the brief is delivered, write back to:

| Path | Why |
|---|---|
| `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/` | The 4-file artifact (canonical) |
| `.forsvn/index/manifest.json` | Add the artifact entry with date, status, surface, feature, beat_count |
| `docs/forsvn/experience/product.md` (optional, append-only) | Flag that this feature now has an app-preview brief; downstream produce-video runs can find it |

Never write back to `brand/BRAND.md`, `brand/DESIGN.md`, `research/icp-research.md`, or the screenshot directory — those are upstream sources, not artifacts this skill maintains.

---

## Chain position

**Previous:**

| Upstream skill | What it provides |
|---|---|
| `create-brand` | BRAND.md + DESIGN.md tokens (recommended, soft-required) |
| `research-icp` | Audience + market (optional, informs caption register) |
| Operator / product / design team | Screenshots (hard-required) |

**Next:**

| Downstream skill | What it consumes |
|---|---|
| `produce-video` | `handoff-produce-video.md` — the per-shot specification table |

Operator then runs `produce-video [slug]`, picks a runtime (HyperFrames / Remotion / AI CLI), and renders.

**Re-run triggers:**

- Feature pivot → re-run from this skill (new slug, new screenshots)
- Surface change → re-run from this skill (same screenshots OK; new surface lock)
- Screenshot inventory updated → re-run from this skill (same slug + `--rev=N`)
- BRAND.md / DESIGN.md tokens updated → re-run from this skill (motion-spec refreshes token references)
- Brief unchanged, render runtime changes → no re-run; produce-video handles it
