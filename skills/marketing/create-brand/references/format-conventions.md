---
title: Brand-System Format Conventions
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: PROCEDURE
---

# Brand-System Format Conventions

> Format rules for the three artifacts brand-system produces. Cited from SKILL.md "Artifact Contract" block + Step 8.5 + Artifact Templates. Full per-section templates live in [`artifact-templates.md`](artifact-templates.md) (BRAND.md + DESIGN.md) and [`assets-inventory.md`](assets-inventory.md) (ASSETS.md).

## Output location

- `docs/forsvn/canonical/marketing/BRAND.md` — canonical, always
- `docs/forsvn/canonical/marketing/DESIGN.md` — canonical, Route B only (Quick Brand produces BRAND.md only)
- `docs/forsvn/canonical/marketing/ASSETS.md` — living inventory, Route B only

Create `brand/` if missing (the asset-binary working tree for produced files), plus `brand/logo/`, `brand/font/`, `brand/inspiration/`, `brand/social/`, `brand/favicon/`, `brand/tokens/`, `brand/imagery/`, `brand/platforms/` subdirs with `.gitkeep` files. The canonical Markdown spec lives under `docs/forsvn/canonical/marketing/`; the `brand/` subdirs hold the rendered/binary assets that ASSETS.md auto-scans and references by `target:` path.

## File naming + versioning

| File | Re-run behavior |
|---|---|
| BRAND.md | Overwrite `docs/forsvn/canonical/marketing/BRAND.md` in place and increment the integer `version:`; prior versions live in git history. NEVER create a `.v[N].md` sibling under `canonical/` — the UPPERCASE canonical name grammar forbids dots/lowercase |
| DESIGN.md | Overwrite `docs/forsvn/canonical/marketing/DESIGN.md` in place and increment the integer `version:`; prior versions live in git history. NEVER create a `.v[N].md` sibling under `canonical/` |
| ASSETS.md | **Always updated in place** — living inventory. Overwrite `docs/forsvn/canonical/marketing/ASSETS.md` and increment the integer `version:`; prior versions live in git history. Dropped-platform rows move to `## Orphaned` (preserved, not deleted). NEVER create a `.v[N].md` sibling under `canonical/` — the UPPERCASE canonical name grammar forbids dots/lowercase |

Date format throughout: ISO `YYYY-MM-DD` in frontmatter; prose may use absolute-date phrasing (e.g., "as of May 2026").

## Frontmatter schema (all three files)

Required fields on every file:

```yaml
---
skill: create-brand
version: [integer, increments on re-run; ASSETS.md increments on each in-place re-run]
date: [ISO YYYY-MM-DD]
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: html          # BRAND.md / DESIGN.md / CREATIVE-DIRECTION.md → html · ASSETS.md → none
id: brand | design | assets | creative-direction   # stable logical id per file — BRAND.md → brand · DESIGN.md → design · ASSETS.md → assets · CREATIVE-DIRECTION.md → creative-direction
type: canonical               # all four are canonical
keywords: [...]               # ASSETS.md → [assets, checklist, deliverables, brand-assets, production] · CREATIVE-DIRECTION.md → [creative-direction, art-direction, mood, photography, motion]
decision_state: pending       # BRAND.md / DESIGN.md → pending · ASSETS.md → not_required
review_tool: inline           # BRAND.md / DESIGN.md → inline/proof · ASSETS.md → none
reviewed_at:                  # YYYY-MM-DD — empty until reviewed
reviewer:                     # who recorded the review — empty until reviewed
declared_platforms: [list of platforms declared at Pre-Dispatch Q6]
brand_md_version: [integer — ASSETS.md only; pins ASSETS.md to the BRAND.md version it was projected from]
design_md_version: [integer — ASSETS.md only; pins to DESIGN.md version]
last_scan: [ISO timestamp — ASSETS.md only; when auto-scan last ran]
---
```

Canonical output paths: `docs/forsvn/canonical/marketing/{BRAND,DESIGN,ASSETS,CREATIVE-DIRECTION}.md`. The stable `id` is immutable — `manifest-sync.ts` maps `id → current path`, so a downstream caller references `assets`/`brand`/`design`, never a path. Full per-file ASSETS.md template: [`artifact-templates.md`](artifact-templates.md) "ASSETS.md Template".

### Review fields (human-review layer)

The review fields carry the human-review contract. Field semantics: `references/_shared/reviewable-artifact-contract.md`; the default decision path is the forsvn-preview review module (`/forsvn:review`). Use Proof only when a brand artifact is opened as a collaborative long-form review, and use `references/_shared/roughdraft-review-protocol.md` only as the optional Markdown UI fallback. The WATER-themed HTML preview is rendered by the review module from the Markdown — skills emit no HTML and ship no surface spec. `status` (skill quality gate) and `decision_state` (human acceptance) are independent.

Per-file defaults:

| File | `decision_state` | `review_surface` | `review_tool` | `## Review Gate` body block | Why |
|---|---|---|---|---|---|
| BRAND.md | `pending` | `html` | `inline` | Yes — final section | Authored canonical brand-of-record; needs a human gate; WATER HTML preview for visual comparison |
| DESIGN.md | `pending` | `html` | `inline` | Yes — final section | Authored canonical design-of-record; same |
| CREATIVE-DIRECTION.md | `pending` | `html` | `inline` | Yes — final section | Authored canonical art-direction-of-record; taste-bearing, needs a human gate; same WATER HTML preview |
| ASSETS.md | `not_required` | `none` | `none` | **No** | Deterministic projection — auto-scanned/regenerated each run, not human-authored |

`reviewed_at` and `reviewer` stay empty until a human review is recorded. On BRAND.md / DESIGN.md / CREATIVE-DIRECTION.md, when a review completes the agent reads the checked `## Review Gate` box and sets `decision_state` (Approve → `approved`, Deny → `denied`, Suggest changes → `suggested`), then fills `reviewed_at` + `reviewer`. The WATER HTML preview is archived to `docs/forsvn/artifacts/.archive/` once `decision_state` ≠ `pending`.

**Cross-stack note — review fields are exempt from the downstream-caller update rule.** The "Cross-stack contract" section below requires atomic downstream-caller updates on schema change. The four review fields are the deliberate exception: they are additive and orthogonal, and every downstream caller consumes brand content by heading match without parsing frontmatter review fields. Adding them updates only this file — no downstream caller is touched.

## BRAND.md structure (11 sections, in order)

1. **The Origin Story** — narrative prose (3-6 paragraphs), not bullet points. Emotional stakes.
2. **The Name** — etymology, meaning, cultural context, "what X means for [Brand]" with 3+ meanings.
3. **Purpose, Mission & Vision** — three distinct items, not synonyms.
4. **Core Values** — "X over Y" format with real tradeoffs (where Y is a legitimate alternative).
5. **Brand Positioning** — positioning statement + value prop + what-we-are/aren't + perceptual map (2 axes + competitive landscape + white space).
6. **Brand Archetype** — 70% Primary + 30% Secondary with "in action" section showing how the blend manifests across touchpoints.
7. **Personality Traits** — "Trait, but not extreme" table (e.g., "Encouraging, but not patronizing").
8. **Emotional Journey Map** — 6-10 touchpoints with specific emotions + design/interaction triggers (NOT copy triggers — that's copywriting's scope).
9. **Brand Voice DNA** — Voice attributes (3-5, each with Do/Don't examples from real brand contexts) + Tone range (3 key contexts: marketing / product UI / errors, with clear tone shift) + Tagline (2-7 words, V/F/U-scored min 6/9, passes competitor swap test) + **Lexicon Rules block** (see below).
10. **The Brand Mark** — commission/generation-ready visual description, variations, color combos, rules.
11. **Digital Touchpoints** — see "Per-platform Digital Touchpoints" subsection format below.

Plus optional **Product-Specific Sections** (between Brand Mark and Digital Touchpoints — at least 1 unique to this product, with WHAT + WHY).

After §11, BRAND.md ends with the `## Review Gate` body block (review machinery, not a brand-content section — see "Review Gate body block" below).

### Lexicon Rules block (BRAND.md §9, mandatory)

```yaml
lexicon:
  forbidden_vocabulary:
    - term: "[specific word/phrase, not category]"
      reason: "[concrete reason — why this brand doesn't say it]"
    # 5-15 entries total. Categories (e.g., "jargon") FAIL — must be actual words.
  preferred_phrases:
    - "[brand-native string]"
    # 5-12 entries.
  casing:
    marketing: "[Title Case | sentence case | etc.]"
    product_ui: "[same options]"
    error_messages: "[same options]"
  emoji_policy:
    marketing: "[allowed | banned | sparingly]"
    product_ui: "[same]"
    error_messages: "[same]"
```

Reasons live in YAML keys, not comments. Missing block, "TBD" values, or category-only entries = critic FAIL.

### Per-platform Digital Touchpoints subsection format (BRAND.md §11, Route B)

For each declared platform, emit one subsection with concrete brand-expression details. Rows describe **brand expression** (mood, motion cue, color role, density) — never geometry. Geometry lives in DESIGN.md Platform Icon Specifications.

Route A: Digital Touchpoints contains ONLY the `Platforms declared at intake: [list]` line + deferral note. Per-platform tables ABSENT.

## DESIGN.md structure (11 sections, in order)

0. **AI-Readable Header** — summarizes archetype + visual metaphor + fonts + primary color at the top. Missing = FAIL.
1. **Visual Theme & Atmosphere** — 2-3 paragraphs of prose describing mood/density/metaphor. Adjectives only = FAIL.
2. **Color Palette & Roles** — primary colors (OKLCH), semantic token map (~17 tokens), per-theme palettes (light + dark min), neutral scale (50-950), 60/30/10 distribution rules.
3. **Typography Rules** — Font stack + type scale + typography rules. **Font Loading & Licensing table** (see below) mandatory.
4. **Component Stylings** — Product-specific core components + standard components (button 6 variants, input, card, etc.).
5. **Layout Principles** — Spacing scale + border radius (one global `--radius`, archetype-justified).
6. **Shadows & Elevation** — Shadow scale (4-8 levels with CSS values) + z-index scale.
7. **Iconography** — System icons + product-specific icons + **Iconography source library named (CDN/npm)** + **fallback library named** + **Forbidden Icons YAML** (3-8 entries with reasons OR empty list with explanation) + **Platform Icon Specifications** subsection per declared platform (sizes, safe-area rules, state variants — dark/tinted/themed/monochrome as applicable, derivative size list).
8. **Imagery & Visual Direction** — photography style + brand devices + `{count}` declared for ASSETS.md imagery row substitution.
9. **Motion & Animation** — principles + duration scale (75-500ms) + easing + named animations (5-10) with physics values (spring stiffness/damping/mass) + motion safety (`prefers-reduced-motion` CSS block with specific fallbacks).
10. **Accessibility** — contrast (WCAG AA 4.5:1 normal / 3:1 large/UI), focus states, touch targets (≥44px), color independence, dark mode audit.
11. **Do's and Don'ts** — 10-15 items each, concrete and testable.

After §11, DESIGN.md ends with the `## Review Gate` body block (review machinery, not a design-content section — see "Review Gate body block" below).

### Font Loading & Licensing table format (DESIGN.md §3, mandatory)

| Font | Source | License | Status | Load method |
|---|---|---|---|---|
| Inter | Google Fonts | OFL | confirmed | `<link rel="preconnect"...>` |
| Plus Jakarta Sans | Fontshare | Free for commercial | confirmed | `@font-face` block included |
| [Custom font] | [vendor] | `[NEEDS LICENSING]` | unclear | TBD |

Any unclear-license font flagged `[NEEDS LICENSING]`. Missing table or assumed-free fonts without verification = FAIL.

### Forbidden Icons YAML format (DESIGN.md §7, mandatory)

```yaml
forbidden_icons:
  - glyph: "💎"
    reason: "Cheap-startup connotation; we are not 'premium-icon trying-too-hard'."
  # 3-8 entries OR empty list with one-line explanation
```

## Review Gate body block (BRAND.md, DESIGN.md, CREATIVE-DIRECTION.md)

BRAND.md, DESIGN.md, and CREATIVE-DIRECTION.md each end with a `## Review Gate` block as their final section — the human-review decision surface, per `references/_shared/reviewable-artifact-contract.md`:

```markdown
## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

This block ships in the BRAND.md and DESIGN.md templates (`artifact-templates.md`). It is review machinery, not brand/design content — the "11 sections" counts above are unchanged. The reviewer checks exactly one box; the agent reads it and sets `decision_state` per the per-file table in "Review fields" above, then fills `reviewed_at` + `reviewer`. Review path: `/forsvn:review` for the default HTML decision capture; Proof for collaborative long-form review; `references/_shared/roughdraft-review-protocol.md` only as the optional Markdown UI fallback.

**ASSETS.md does NOT carry a `## Review Gate` block.** ASSETS.md is a deterministic projection — auto-scanned and regenerated each run, not human-authored — so it is not a review candidate. It carries the review fields with `decision_state: not_required` + `review_surface: none` + `review_tool: none` (see "Review fields" above) but no body block.

## ASSETS.md structure (5 fixed + per-platform, Route B only)

In order:

1. **Universal** — logo variants + fonts + design tokens (consumed by every platform)
2. **Social & Sharing** — OG card + Twitter card + LinkedIn share + Facebook share
3. **Favicon & Web Metadata** — favicon.ico + apple-touch-icon + manifest.json + theme-color (Web declared only)
4. **Imagery & Illustration** — only if DESIGN.md §8 declares a direction; substitute `{count}` from DESIGN.md
5. **Platforms** — one subsection per declared platform, in declared order. Each: app icon set + splash screens + screenshots + per-platform metadata
6. **Summary** — total / done / in progress / blocked / not started counts
7. **Orphaned** — only present if platforms were dropped between runs (preserves tracking state)

### Checkbox marker semantics (ASSETS.md, mandatory)

| Marker | Meaning | Set by |
|---|---|---|
| `[ ]` | Not started — file does not exist | Auto-scan |
| `[x]` | Done — file exists at target path (directories require ≥1 non-`.gitkeep` file) | Auto-scan |
| `[~]` | In progress — partial / under review | Human (preserved verbatim across re-runs) |
| `[!]` | Blocked — waiting on dependency / decision | Human (preserved verbatim across re-runs) |

Auto-scan ONLY flips `[ ]` ↔ `[x]`. Human markers are sacred — never overwritten.

### Row format (ASSETS.md, mandatory)

Every row: `- [marker] [name] — spec ref: [BRAND.md §N | DESIGN.md §N | platform-surfaces.md §N] · target: brand/[fully-substituted-path]`

No unfilled `{host}` / `{count}` / `{token}` placeholders allowed past Step 8.5 substep 2. Every row traces to an upstream spec — no invented assets.

### Legend (top of ASSETS.md, mandatory)

```markdown
Legend: [x] done · [ ] not started · [~] in progress (human) · [!] blocked (human)
```

### Orphaned block format (only if applicable)

```markdown
## Orphaned (platform no longer declared)

> These rows persist for tracking review. If genuinely dropped, delete this block on next run; if mistake, re-declare the platform at next Pre-Dispatch.

[Original platform-block content, fully preserved]
```

## CREATIVE-DIRECTION.md structure (art-direction layer, Route B; refreshable standalone)

The art-direction soul **under** the brand — *how the world looks and feels*. Read after BRAND.md, before any photo shoot, render, or landing-page build. **Additive and token-referencing:** it names what DESIGN.md tokens *mean* in the scene; it never redefines a hex, font, or motion value. When a value appears here it is quoted from DESIGN.md.

Register split (never mix): **BRAND.md** = who we are (prose) · **DESIGN.md** = exact values (spec) · **CREATIVE-DIRECTION.md** = how the world looks and feels (art direction).

Sections, in order:

1. **At a glance** — blockquote: one creative idea (one line), the world/scene, the light, the feeling, palette-as-meaning, and the **boundary** (what neighbouring brand/system this must NOT bleed into).
2. **The Thesis** — the single creative idea, stated as a resolved tension where one exists. Why the world looks this way, grounded in real origin, not a stock moodboard.
3. **Source / Mood** — the literal reference frame(s) (`inspiration/*` path when one exists) the whole direction derives from. "When in doubt, would this sit next to <frame>?"
4. **Movements / Modes** — 2-4 named moods a surface can lean on (distance × energy), as a table: name · distance · energy · when-to-use · feels-like. The page-level rhythm across them.
5. **Light & Atmosphere** — time of day, direction, quality, temperature; the glow/grading rule (push shadows toward the named DESIGN.md shadow token).
6. **Color as Landscape** — a table mapping each DESIGN.md token → its **meaning in the scene** (tokens owned by DESIGN.md; this only assigns place/meaning).
7. **Texture & Grain** · **Composition & Framing** — surface material feel; framing/crop/negative-space rules.
8. **Photographic & Render Direction** — lens/era/subject/treatment for shot and generated imagery; what a render must satisfy to stay in-world.
9. **Motion & Pacing** — the movement feel (references DESIGN.md motion permissions, never new durations).
10. **Type & Mark in the Landscape** — how the brand type/logo sit in the world (references DESIGN.md type/mark, never new specs).
11. **The Feeling We're Protecting** — the one-line gut check every surface is graded against.
12. **Anti-Patterns** — what would betray the direction (concrete, testable).
13. **Surface Cues (fast reference)** — per-surface one-liners (hero / about / footer / OG / video bumper / email).
14. **Sources** — what this direction is derived from (origin, frames, BRAND/DESIGN), making clear it is derived, not invented.
15. **Review Gate** — the standard human-review block (see "Review Gate body block" above).

**Refresh-only path (additive on a locked brand).** CREATIVE-DIRECTION.md may be (re)written standalone — without re-running Layer 1/2 or touching DESIGN.md — so a locked brand can gain or refresh its art direction without regenerating tokens. On the refresh path the agent reads BRAND.md + DESIGN.md (+ any `inspiration/` frames), writes/overwrites CREATIVE-DIRECTION.md in place, bumps its integer `version:`, and leaves all other canonical files byte-unchanged.

## FRAME.md structure (frame-direction layer, Route B; refreshable standalone)

DESIGN.md translated **for the camera** — *how the brand's atoms behave inside a moving frame*. Read after DESIGN.md, before any video, motion piece, or full-frame social asset. **Additive and token-referencing:** it specifies frame behavior (safe area, type-at-distance, on-screen pacing, bumper layout) for DESIGN.md atoms; it never redefines a hex, font, or motion value. When a value appears here it is quoted from DESIGN.md (or CREATIVE-DIRECTION.md for scene meaning). **Atoms sacred; composition free; numbers from the script.** Full spec + section depth: [`frame-direction.md`](frame-direction.md).

Register split (never mix): **DESIGN.md** = exact atom values (spec) · **CREATIVE-DIRECTION.md** = how the world looks and feels (art direction) · **FRAME.md** = how those atoms behave in a moving frame (frame direction).

Sections, in order:

1. **At a glance** — blockquote: shipped delivery surfaces, the primary one, the one frame rule that matters most. One line.
2. **Delivery surfaces & aspect-ratio grammar** — table per shipped aspect ratio (9:16 · 1:1 · 16:9, only those shipped): ratio · where it runs · title-safe zone · action-safe zone · platform chrome to avoid. Safe areas as % insets, not pixels.
3. **Type-at-distance** — how the DESIGN.md §3 type scale maps to on-screen legibility (% of frame height per role × viewing distance), NOT web breakpoints. Font/weight quoted from DESIGN.md §3; only the sizing rule is new.
4. **Motion & pacing** — references CREATIVE-DIRECTION.md §9 + the DESIGN.md §9 duration/easing scale; introduces no new durations. Adds shot/scene minimum hold time, allowed transition family, per-surface pacing feel.
5. **Surface cues / bumper grammar** — intro/outro bumpers, lower-thirds, logo field; references CREATIVE-DIRECTION.md §13. Layout + timing new; mark/type/color quoted from DESIGN.md.
6. **Numbers come from the script** — durations + element sizes derive from the shot list / VO timing, bounded by the DESIGN.md motion scale; never hardcoded web values.
7. **Anti-Patterns** — what betrays the frame direction (atom redefinition, web breakpoints, hardcoded per-shot numbers, undeclared aspect ratios).
8. **Sources** — what this direction is derived from (DESIGN.md atoms, CREATIVE-DIRECTION.md art direction, shipped exemplars).
9. **Review Gate** — the standard human-review block (see "Review Gate body block" above).

**Refresh-only path (additive on a locked brand).** FRAME.md may be (re)written standalone — without re-running Layer 1/2 or touching DESIGN.md — so a locked brand can gain or refresh its frame direction without regenerating tokens. On the refresh path the agent reads DESIGN.md + CREATIVE-DIRECTION.md, writes/overwrites FRAME.md in place, bumps its integer `version:`, and leaves all other canonical files byte-unchanged.

## Anti-drift checks

Three-way platform-set equivalence (critic enforces):
- ASSETS.md platform blocks ≡ BRAND.md Digital Touchpoints platforms ≡ DESIGN.md Platform Icon Specifications platforms — same set, same order.
- Declared platforms (Pre-Dispatch Q6) = the source of truth.
- Undeclared platforms MUST NOT appear in any file.

Register separation:
- BRAND.md Digital Touchpoints rows describe brand expression (mood, motion cue, color role, density) — never geometry.
- DESIGN.md Platform Icon Specifications hold geometry (sizes, safe zones, state variants).

Quality-bar reference:
- Compare against `references/example-brand.md` + `references/example-design.md`.
- Match "good" patterns, avoid "bad" patterns.
- Use example-design.md tests (copy-paste, blind build, competitor swap, implementation gap) as final validation.

## Cross-stack contract

This skill is the canonical producer of `docs/forsvn/canonical/marketing/{BRAND,DESIGN,ASSETS,CREATIVE-DIRECTION}.md` (ids `brand`, `design`, `assets`, `creative-direction`). These artifacts are consumed by:

- `write-copy` — voice DNA + lexicon block
- `write-ad` — voice DNA + brand mark for visual creative briefs
- `write-outreach` — voice DNA for sender voice calibration
- `brief-landing-page` — full brand context for landing-page architecture
- `brief-graphic` — DESIGN.md for per-asset specs + brand mark + visual atmosphere
- `plan-campaign` — positioning + archetype for channel-strategy alignment
- `humanmaxxing` — voice adjectives for soul-injection
- `polish-vn` — voice DNA for register selection
- `brief-shortform` — brand mark + voice + visual atmosphere
- `map-user-flow` — DESIGN.md design tokens + component context

`CREATIVE-DIRECTION.md` (id `creative-direction`) is additionally consumed as the **house** art-direction layer by `plan-campaign` (inherited into per-campaign creative direction) and by every `brief-*` / `write-ad` visual brief (art direction the brief designs against, alongside DESIGN.md tokens). Absent → those skills degrade to tokens-only and say so; they never fabricate art direction.

Schema changes (frontmatter fields, section headings, table column structure) require atomic update across affected upstream callers — never silently drift.
