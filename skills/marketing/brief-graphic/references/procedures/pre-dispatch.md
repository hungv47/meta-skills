# Pre-Dispatch Procedure — Design-Brief

> Hard gate semantics, needed dimensions, Warm/Cold Start templates, Write-back map, Step 0.5 Route Detection, --fast behavior.

[PROCEDURE] — load at orchestrator entry, before Layer 1 dispatch.

Canonical Pre-Dispatch pattern (read first): [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) [PROCEDURE]. Below is the design-brief-specific instantiation, including the hard-gate semantics that fire BEFORE cold-start questioning.

---

## Hard gate — fires before any questioning

design-brief is **hard-gated on brand artifacts**. Before any Warm Start summary, any Cold Start probe, any mode-resolver decision:

1. **`brand/BRAND.md` AND `brand/DESIGN.md` must exist.**
   - Either missing → return **NEEDS_CONTEXT**, recommend `create-brand` (Route A for BRAND only when DESIGN.md exists; Route B for full design tokens when neither exists).
   - Do NOT proceed to Cold Start questioning when the gate fails. The skill cannot produce a valid brief without brand anchors; asking the user for asset details first wastes their input.
2. **If either >60 days stale and user hasn't confirmed, warn before proceeding.** Brand identity evolves — stale brand artifacts produce briefs anchored to a past version of the brand. Soft gate, not hard; user can override.
3. **If `brand/ASSETS.md` exists, scan for a row matching the requested asset.** If found → pre-fill format/dimensions/path AND prepare to tick the checkbox on completion (literal path match only — see `format-conventions.md` § "ASSETS.md auto-tick semantics").

**Hard gate fires regardless of `--fast`.** Per marketing-skills CLAUDE.md § "Complexity Routing": "Safety gates supersede `--fast`." design-brief's hard gate is a safety gate (brief without brand anchors = fabricated brief). Anti-pattern #9.

---

## Needed dimensions

Five dimensions drive brief production. Pre-Dispatch resolves each from pipeline artifacts, experience/, or Cold Start question (post-gate):

| # | Dimension | What it drives | Resolves from |
|---|---|---|---|
| 1 | **Asset type** (OG image / IG carousel / banner / hero / OOH / etc.) | concept-agent reference catalog selection + auto-detection of downstream route + platform-module lookup | Cold Start Q1 (always asked unless invoked from brief-landing-page with explicit slot) |
| 2 | **Downstream route** (image-gen / vector-tool / designer-handoff / template-pack) | Layer 2 agent selection (prompt-craft / figma-spec / none / per-format prompt-craft) | Auto-detected from asset type (Step 0.5 below); Cold Start Q2 confirms / overrides |
| 3 | **Brand reference** | brand-anchor-agent token pull + sacred element list + lexicon | Hard gate resolves to `brand/BRAND.md` + `brand/DESIGN.md` — NEVER asked |
| 4 | **Copy/headline if any** | copy-anchor-agent placement + critic Typography dimension | `docs/forsvn/artifacts/marketing/content/[slug].copy.md` if supplied; else Cold Start Q3 |
| 5 | **Constraints** (dimensions if non-standard / deadline / must-include elements) | brief-synth-agent platform spec + sacred elements + What NOT to Do section | Cold Start Q4 |

---

## Read order (post-gate)

1. **Pipeline artifacts (hard-gate resolved):**
   - `brand/BRAND.md` + `brand/DESIGN.md` (confirmed by hard gate before this step)
   - `brand/ASSETS.md` for dimension pre-fill (if exists)
   - `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/asset-slots/[slot-id].md` if invoked from brief-landing-page (carries slot spec)
   - `docs/forsvn/artifacts/marketing/content/[slug].copy.md` if copy supplied separately (from write-copy)
   - `docs/forsvn/artifacts/marketing/campaign-plan.md` for campaign context, awareness stage, channel placement
   - `research/icp-research.md` for audience visual preferences (optional but useful)

2. **Experience substrate:** `docs/forsvn/experience/{brand,goals}.md` for any durable constraint not covered by pipeline (e.g., legal disclaimer policies the user mentioned in a prior session).

3. **Detect intent mismatch BEFORE Cold Start:** if user input contains "make / create / render / generate" verb + asset noun (e.g., "make me an IG post"), surface deference recommendation: "design-brief produces the BRIEF for the asset; the BRIEF feeds Claude Design / Midjourney / Imagen / DALL·E / Pencil / Figma / a human designer who actually renders it. Proceed with brief, or are you looking for direct rendering?" Same for "redesign this page" → defer to `brief-landing-page`; "design our brand identity" → defer to `create-brand`. (Anti-pattern #11.)

---

## Optional Artifacts

Read if present; affect Warm Start summary fields:

| Artifact | Source | Benefit |
|----------|--------|---------|
| `brand/ASSETS.md` | brand-system Route B | Auto-fill dimensions, tick checkbox on completion |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/asset-slots/[slot-id].md` | lp-brief | Slot spec when brief is for an LP asset |
| `docs/forsvn/artifacts/marketing/content/[slug].copy.md` | copywriting | Copy to use in the asset |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | campaign-plan | Campaign context, awareness stage |
| `research/icp-research.md` | icp-research | Audience visual preferences |

---

## Warm Start — invoked from brief-landing-page or campaign-plan with asset spec

When 3+ of 5 dimensions resolve from upstream slot or campaign-plan + hard gate already passed:

```
Hard gate passed: brand/BRAND.md + brand/DESIGN.md present.
Found:
- asset spec → "[from upstream slot or campaign-plan]"
- copy → "[from write-copy if present]"
- ASSETS.md row → "[matched / no match]"

Auto-detecting downstream route from asset type. Override or proceed?
```

If all 5 dimensions resolve (rare on first standalone run, common when invoked from brief-landing-page), skip even this probe and dispatch directly after one-line confirm.

---

## Cold Start — standalone invocation, asset request from user

When the user invokes design-brief directly with just an asset request and 3+ dimensions are missing:

```
design-brief produces a per-asset brief that downstream renderers (Claude
Design / Pencil MCP / Figma / human designer) execute. Before I dispatch:

1. **Asset type** — what's being designed? (OG image / IG carousel / IG post /
   IG story / LinkedIn document / LinkedIn single-image / FB ad / YouTube
   thumbnail / X card / OOH / banner / hero / other.)
2. **Downstream route** — image-gen (generative for photos/illustrations) /
   vector-tool (Pencil/Figma for layouts and variants) / designer-handoff
   (human designer for print or complex composition) / template-pack
   (multi-format social packs from one brief). Auto-detected from asset
   type by default — override here.
3. **Copy/headline** — what text appears IN the asset? Headline, body,
   CTA, brand mark text. Reference `docs/forsvn/artifacts/marketing/content/[slug].copy.md`
   if supplied separately.
4. **Constraints** — dimensions (if non-standard), deadline, must-include
   elements (logo placement, brand mark, legal disclaimer, etc.).

Answer 1-4 in one response. (Brand reference is auto-resolved from
brand/BRAND.md + brand/DESIGN.md.) I'll dispatch.
```

---

## Write-back map

After Cold Start answers land, append durable answers to experience/ before dispatching:

| Q | File | Key |
|---|---|---|
| 4. Constraints (durable: legal disclaimer policies, logo placement rules) | `brand.md` | `Brand — design constraints` (only if user expresses durable rule, not one-off asset constraint) |
| 1, 2, 3. Asset-specific (asset type, downstream route, asset-specific copy) | (per-asset, lives in design-brief artifact frontmatter) | — |

Most asset-specific dimensions are NOT durable — they live in the design-brief artifact, not in experience/. Only durable design constraints (legal, brand mark placement policy, sacred-element rules) write back.

---

## Step 0.5 — Route Detection (orchestrator)

Before Layer 1 dispatch, the orchestrator picks a **downstream route** AND (for `image-gen`) a **target generative tool**. Both are required by downstream sub-agents and become part of every agent's context.

1. **`--route=` override** → honor it. Warn if the asset-type default differs ("Asset-type IG-carousel defaults to vector-tool; honoring override to image-gen — slides will be generated individually then assembled").
2. **Else walk the asset-type → default route table** (in SKILL.md § "Routing Logic — Auto-detection").
3. **State route + rationale in 1 line** before dispatching:

   > "Downstream route: image-gen (photographic OG image). Target tool: midjourney-v6 (editorial mood). Override with `--route=` if needed."

4. **For `image-gen`, pick `target_tool`** from `references/prompt-patterns.md` "tool → asset type" table. Options: `claude-design`, `midjourney-v6`, `imagen-3`, `dall-e-3`, `ideogram`, `veo` (video), `suno` (audio).
5. **Pull the platform module** from `references/platform-modules.md` and pass its spec checklist (aspect, safe zones, type scale, contrast, format, size cap, anti-patterns) to brief-synth-agent and critic-agent.

`route`, `target_tool`, and `platform_module` become part of every agent's context block from Layer 1 onward.

---

## --fast behavior

`--fast` flag (or "fast mode" / "quick pass" phrase in the same turn) collapses the multi-agent chain:

| Stage | Standard (budget: `standard` — this skill's default) | --fast |
|---|---|---|
| Hard gate | Fires (brand artifacts required) | Same — safety gate supersedes `--fast` |
| Cold Start | Runs (4 questions when context missing) | Same — `--fast` does NOT skip Cold Start per CLAUDE.md |
| Step 0.5 Route Detection | Runs (auto-detect + announce + target_tool pick + platform module pull) | Same |
| Layer 1 (parallel) | brand-anchor + concept + copy-anchor in parallel | Single inline pass merging the three (one brand-anchor pull, one concept pick, one copy lookup) |
| Layer 1.5 (brief-synth) | 3 candidate briefs | 1 brief (no Approval Gate 1 — single concept means no choice to present) |
| Approval Gate 1 | STOP, present 3 candidates, await pick | SKIPPED (no choice) |
| Layer 2 (route-dependent) | prompt-craft / figma-spec / none / per-format prompt-craft | Same — Layer 2 still runs (the route-specific handoff block is contract) |
| Layer 3 (critic) | critic-agent dispatched, max 2 rewrite cycles | Single-pass scoring; no rewrite loop. If FAIL, deliver as DONE_WITH_CONCERNS with critic notes |
| Approval Gate 2 | STOP, present brief + critic, await Approve/Revise/Reject | Same — Gate 2 fires regardless. `--fast` does NOT bypass user acceptance |
| Output | Full artifact with all sections + ASSETS.md auto-tick | Same — artifact contract preserved |

**`--fast` does NOT skip:**
- Hard gate (brand artifacts required)
- Cold Start (asset details required for any brief to land)
- Step 0.5 (route + target_tool + platform module are non-optional context)
- Approval Gate 2 (user acceptance is non-optional)
- critic-agent (single-pass scoring still runs; rubric + Generic-AI-Aesthetic Detector both apply)
- Artifact frontmatter contract (per `format-conventions.md` § "Frontmatter — required fields")

Skill ends with: "Ran in --fast mode; rerun without the flag for 3-concept variety at Gate 1 + critic rewrite loop."

---

## Confirm-and-dispatch beat

After Warm Start probe answers (or Cold Start full response), emit a one-paragraph summary and confirm:

```
Confirmed for dispatch:
- Asset type: [resolved]
- Downstream route: [auto-detected or override]
- Target tool: [if image-gen]
- Platform module: [pulled from references/platform-modules.md]
- Copy: [resolved or "none"]
- Constraints: [resolved]
- ASSETS.md row: [matched (will auto-tick) / no match (skipped)]

Dispatching Layer 1: brand-anchor + concept + copy-anchor in parallel.
```

If user stays silent past one beat, dispatch. If user corrects, update experience/ (only if durable constraint) before dispatching.
