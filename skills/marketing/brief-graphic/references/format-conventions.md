# Format Conventions — Design-Brief

> Artifact template details, frontmatter rules, slug conventions, re-run versioning, per-route handoff-block schemas, ASSETS.md auto-tick semantics.

[PROCEDURE] — loaded by orchestrator at artifact-assembly time.

## Output path

Single artifact per run (or per-format-pack with one umbrella artifact):

```
docs/forsvn/artifacts/marketing/design-briefs/[slug].md
```

Slug pattern: `[asset-type]-[platform]-[date]-[descriptor]` or `[concept-name]-[date]`. Examples:

- `og-blog-2026-05-18-async-launch.md`
- `ig-carousel-2026-05-18-pricing-tiers.md`
- `oh-billboard-2026-05-18-q2-campaign.md`

For rejected briefs (user rejected at Approval Gate 2): `[slug]-rejected.md` with a `Rejection Notes` block appended.

For candidate-pause exits (user said "Stop" at Approval Gate 1): `[slug]-candidates.md` with all 3 candidate briefs preserved for later resumption.

## Frontmatter — required fields

Every artifact starts with:

```yaml
---
skill: brief-graphic
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: md         # html | md | none
decision_state: not_required # pending | approved | denied | suggested | not_required
review_tool: inline        # proof | inline | roughdraft | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
downstream_route: image-gen | vector-tool | designer-handoff | template-pack
target_tool: claude-design | midjourney-v6 | imagen-3 | dall-e-3 | ideogram | pencil | figma | print | ...
asset_type: og-image | ig-carousel | ig-post | ig-story | li-doc | li-single | fb-ad | yt-thumbnail | x-card | ooh | banner | hero | ...
platform: instagram | linkedin | facebook | youtube | x | print | web | email | ...
dimensions: WxH | [per-format list for template-pack]
brand_anchors:
  primary_color: [hex]
  primary_type: [font, weight]
  motion: [duration token if applicable]
sacred_respected: [list of sacred elements honored]
---
```

| Field | Rule |
|---|---|
| `skill` | Always `brief-graphic` |
| `version` | Integer; increment on re-run with same slug (preserves history via `[slug].v[N].md` rename) |
| `date` | ISO `YYYY-MM-DD`; the date the brief was approved at Gate 2, not the date rendering completes |
| `status` | One of the four values; **never** omit, never invent new values |
| `decision_state` | Human-review state per [`reviewable-artifact-contract`](_shared/reviewable-artifact-contract.md). `pipeline` artifact → defaults to `not_required`; the operator or a loop opts a run into review by setting `pending`. One of: `pending` / `approved` / `rejected` / `suggested` / `not_required` |
| `review_tool` | Review surface — `inline` (default) / `proof` / `roughdraft` / `none`. Pairs with `decision_state` |
| `reviewed_at` | ISO `YYYY-MM-DD` — empty until a review is recorded |
| `reviewer` | Who recorded the review — empty until reviewed |
| `downstream_route` | One of the four route values — drives the Layer 2 agent + the Downstream Handoff Block schema below |
| `target_tool` | When `downstream_route: image-gen`, the specific generative tool the prompt targets — pulled from `prompt-patterns.md` "tool → asset type" table |
| `asset_type` | Asset taxonomy — drives the auto-detection table |
| `platform` | Where the asset ships — drives platform-module lookup |
| `dimensions` | `WxH` for single-format briefs; list of per-format dimensions for `template-pack` |
| `brand_anchors` | Primary color (hex from DESIGN.md palette) + primary type (font + weight from DESIGN.md type scale) + motion (duration token if asset is animated) |
| `sacred_respected` | List of sacred elements the brief honored (logo not modified, primary palette anchor preserved, tagline unchanged, etc.) |

## Body section order — fixed

The Artifact Template prescribes a fixed section order. Do **not** reorder; downstream consumers (image-gen / vector-tool / designer / lp-brief) jump to sections by heading match.

1. `# Design Brief: [Asset Name]` — H1
2. Metadata block (`**Asset:**` / `**Purpose:**` / `**Source copy:**` / `**Downstream route:**`)
3. `## Concept (Approved)` — Name / Visual direction / References
4. `## Brand Anchors` — Palette pull / Typography / Sacred elements / Lexicon
5. `## Platform Spec` — table with columns: `Field`, `Value`, `Source (platform module)`
6. `## Hierarchy` — Focal point / Supporting / Tertiary (3 ranks)
7. `## Asset Slots` (compound assets only — e.g., carousel)
8. `## Copy Placement` (if any — Headline / Body / CTA)
9. `## Failure Modes to Avoid`
10. `## What NOT to Do`
11. `## Downstream Handoff Block` — per-route schema (see below)
12. `## Why This Works` — why-this-works block per [`_shared/why-this-works-convention.md`](_shared/why-this-works-convention.md): the bet (falsifiable) + 2-4 load-bearing design choices (concept, hierarchy, brand-anchor pulls) traced to a product-fit source — the ICP/audience, `BRAND.md`/`CREATIVE-DIRECTION.md`, the source copy's mechanism — Competitor-Swap-clean, not generic design rationale. No brand/ICP foundation → the convention's Absent state. (After the artifact, before the scorecard.)
13. `## Critic Report`
14. `## Review Gate` — human-review block; final section of the artifact (see "Review Gate block" below)

## Platform Spec table schema

Nine rows, all required:

| Field | Source |
|---|---|
| Aspect ratio (`X:Y`) | platform module |
| Dimensions (`WxH px`) | platform module |
| Safe zone (px from edges, platform-specific) | platform module |
| Type scale (mobile readability floor, min px at 1x) | platform module |
| Contrast (thumb-stop, WCAG ratio min for asset's smallest text on its actual background) | platform module |
| File format (PNG / SVG / WebP / MP4 / ...) | platform module |
| File-size cap (KB/MB) | platform module |
| Color mode (sRGB / DCI-P3 / CMYK) | platform module |
| Anti-patterns flagged (list specific to this platform) | platform module |

Missing values from `platform-modules.md` → flag in brief (skill ships `done_with_concerns` until platform-modules.md is fully populated per skill metadata `notes:` field).

## Downstream Handoff Block schemas

### When `downstream_route: image-gen`

```markdown
- **Primary prompt** ([target_tool]): [full prompt with lens / lighting / mood / era / composition / color cast / aspect-ratio flag]
- **Variant 1:** [specific deviation]
- **Variant 2:** [specific deviation]
- **Post-processing note:** [overlay copy, logo placement, export profile]
```

Prompts MUST be specific — lens (e.g., 50mm), lighting (e.g., golden-hour side light), mood (e.g., editorial calm), era (e.g., late-90s film), composition (e.g., off-center subject, leading lines), color cast (e.g., warm shadow tones). Generic prompts ("modern, professional, 4k, hyperrealistic") → critic FAIL on Generic-AI-Aesthetic Detector.

### When `downstream_route: vector-tool`

```markdown
- **Layout grid:** [columns × rows, gutters, baseline]
- **Component references:** [DESIGN.md tokens used]
- **Multi-format crops** (if applicable): [per-format dimensions and reflow rules]
```

Vector route does NOT dispatch a Layer 2 agent — brief-synth-agent writes this block inline. Spec must reference DESIGN.md tokens by name (e.g., `--color-primary-500`, `--type-display-3`), not raw values.

### When `downstream_route: designer-handoff`

```markdown
- **Spec sheet** for the designer (Figma file or print shop): [section list, type scale, palette, asset bundle paths]
- **Open questions for designer:** [decisions deferred to designer judgment]
```

Open questions list is non-optional — explicit deferrals to the designer (e.g., "tertiary CTA color: brand-accent-1 or brand-accent-2 at designer discretion") protect the brief from over-specifying.

### When `downstream_route: template-pack`

```markdown
- **Per-format prompt blocks:** [one per platform variant]
```

Each variant gets its own prompt block (image-gen schema above) with platform-specific aspect ratio + safe zone + size cap baked in.

## Review Gate block

Every brief ends with a `## Review Gate` block — the final body section, after `## Critic Report`:

```markdown
## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

This is the human-review layer per [`reviewable-artifact-contract`](_shared/reviewable-artifact-contract.md); [`roughdraft-review-protocol`](_shared/roughdraft-review-protocol.md) is only the optional Markdown UI fallback. brief-graphic produces a `pipeline` artifact, so the frontmatter `decision_state` defaults to `not_required` — most briefs are regenerable drafts. The block and the four review frontmatter fields ship in the template so the operator (or a loop) can opt a run into review by setting `decision_state: pending`. The operator checks exactly one box; the agent reads it to set `decision_state`. The block and fields are additive and orthogonal — downstream consumers jump to sections by heading match, so a new trailing heading does not affect them.

## Re-run convention

When re-running the skill on the same asset:

1. **Default behavior:** overwrite `docs/forsvn/artifacts/marketing/design-briefs/[slug].md` with `version: N+1`, updated `date`.
2. **Preserve history mode:** rename existing artifact to `[slug].v[N].md` (e.g., `og-blog-2026-05-18-async-launch.v1.md`) before writing the new version. Enables A/B comparison.
3. **Re-run triggers:** BRAND.md or DESIGN.md updates, new asset row in ASSETS.md, lp-brief slot needs an explicit per-asset brief, campaign launch.

## ASSETS.md auto-tick semantics

On status DONE:

1. **Literal path match only.** If the brief's asset path (the resolved output path the brief targets, NOT the brief's own artifact path) is a literal string match for a `brand/ASSETS.md` row's `path` field → flip `[ ]` → `[x]` and append a date stamp.
2. **Never auto-tick on slug, asset-type, or platform heuristic.** Heuristic ticking causes false positives (e.g., two carousels with different paths ticking the same row).
3. **No match → skip silently.** design-brief does NOT own ASSETS.md row CREATION — that's brand-system's job. design-brief only ticks existing rows.
4. **Multi-format briefs (template-pack):** tick all rows that match literal paths. Each per-format variant may match a different ASSETS.md row.

## Anti-drift checks

Before the orchestrator writes the artifact:

- All 9 Platform Spec rows present (or explicitly flagged as missing from platform-modules.md skeleton)
- Frontmatter `downstream_route` matches the Downstream Handoff Block schema selected
- Frontmatter `target_tool` populated when `downstream_route: image-gen`
- `brand_anchors.primary_color` is a hex from DESIGN.md palette (not an invented value)
- `brand_anchors.primary_type` matches a font in DESIGN.md type scale
- `sacred_respected` is non-empty (every brief should respect at least one sacred element — typically logo + primary palette + tagline + brand-mark text)
- Hierarchy section has exactly 3 ranks (focal point + supporting + tertiary)
- Copy Placement section present iff brief carries copy (matches `Source copy:` field)
- Critic Report present with PASS / FAIL / DONE_WITH_CONCERNS verdict
- `## Review Gate` block present as the final body section; four review frontmatter fields present (`decision_state` defaults to `not_required` for this `pipeline` artifact)

## Critic verdict file (optional)

When critic-agent fails on cycle 1 + 2 (max cycles exhausted) and orchestrator delivers as `DONE_WITH_CONCERNS`, an optional sidecar may be written:

```
docs/forsvn/artifacts/marketing/design-briefs/[slug].critic-notes.md
```

Contents: full critic feedback per cycle, named re-dispatch targets, what was fixed / what wasn't, 13-pattern Generic-AI-Aesthetic Detector scores per cycle. Not mandatory; useful when handing the brief to a human designer who wants to see the rubric trace.
