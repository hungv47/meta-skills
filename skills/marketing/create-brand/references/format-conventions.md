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

- `brand/BRAND.md` — canonical, always
- `brand/DESIGN.md` — canonical, Route B only (Quick Brand produces BRAND.md only)
- `brand/ASSETS.md` — living inventory, Route B only

Create `brand/` if missing, plus `brand/logo/`, `brand/font/`, `brand/inspiration/`, `brand/social/`, `brand/favicon/`, `brand/tokens/`, `brand/imagery/`, `brand/platforms/` subdirs with `.gitkeep` files.

## File naming + versioning

| File | Re-run behavior |
|---|---|
| BRAND.md | Rename existing to `BRAND.v[N].md` and create new with incremented version |
| DESIGN.md | Rename existing to `DESIGN.v[N].md` and create new with incremented version |
| ASSETS.md | **Always updated in place** — living inventory. Dropped-platform rows move to `## Orphaned` (preserved, not deleted). Only version (`ASSETS.v[N].md`) when user explicitly requests fresh inventory after major product pivot |

Date format throughout: ISO `YYYY-MM-DD` in frontmatter; prose may use absolute-date phrasing (e.g., "as of May 2026").

## Frontmatter schema (all three files)

Required fields on every file:

```yaml
---
skill: create-brand
file: BRAND.md | DESIGN.md | ASSETS.md
version: [integer, increments on re-run; ASSETS.md stays at 1 unless explicitly fresh-inventory'd]
date: [ISO YYYY-MM-DD]
status: done | done_with_concerns | blocked | needs_context
stack: mkt
review_surface: html          # BRAND.md / DESIGN.md → html · ASSETS.md → none
decision_state: pending       # BRAND.md / DESIGN.md → pending · ASSETS.md → not_required
review_tool: roughdraft       # BRAND.md / DESIGN.md → roughdraft · ASSETS.md → none
reviewed_at:                  # YYYY-MM-DD — empty until reviewed
reviewer:                     # who recorded the review — empty until reviewed
declared_platforms: [list of platforms declared at Pre-Dispatch Q6]
brand_md_version: [integer — ASSETS.md only; pins ASSETS.md to the BRAND.md version it was projected from]
design_md_version: [integer — ASSETS.md only; pins to DESIGN.md version]
last_scan: [ISO timestamp — ASSETS.md only; when auto-scan last ran]
---
```

### Review fields (human-review layer)

The review fields carry the human-review contract. Field semantics: `references/_shared/reviewable-artifact-contract.md`; review procedure: `references/_shared/roughdraft-review-protocol.md`. WATER-themed HTML preview spec: `references/_shared/review-surface-design.md` + `references/_shared/review-surface-template.md`. `status` (skill quality gate) and `decision_state` (human acceptance) are independent.

Per-file defaults:

| File | `decision_state` | `review_surface` | `review_tool` | `## Review Gate` body block | Why |
|---|---|---|---|---|---|
| BRAND.md | `pending` | `html` | `roughdraft` | Yes — final section | Authored canonical brand-of-record; needs a human gate; WATER HTML preview for visual comparison |
| DESIGN.md | `pending` | `html` | `roughdraft` | Yes — final section | Authored canonical design-of-record; same |
| ASSETS.md | `not_required` | `none` | `none` | **No** | Deterministic projection — auto-scanned/regenerated each run, not human-authored |

`reviewed_at` and `reviewer` stay empty until a human review is recorded. On BRAND.md / DESIGN.md, when a review completes the agent reads the checked `## Review Gate` box and sets `decision_state` (Approve → `approved`, Deny → `denied`, Suggest changes → `suggested`), then fills `reviewed_at` + `reviewer`. The WATER HTML preview is archived to `.forsvn/artifacts/.archive/` once `decision_state` ≠ `pending`.

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

## Review Gate body block (BRAND.md + DESIGN.md only)

BRAND.md and DESIGN.md each end with a `## Review Gate` block as their final section — the human-review decision surface, per `references/_shared/reviewable-artifact-contract.md`:

```markdown
## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Roughdraft CriticMarkup, inline in this file.
```

This block ships in the BRAND.md and DESIGN.md templates (`artifact-templates.md`). It is review machinery, not brand/design content — the "11 sections" counts above are unchanged. The reviewer checks exactly one box; the agent reads it and sets `decision_state` per the per-file table in "Review fields" above, then fills `reviewed_at` + `reviewer`. Review procedure: `references/_shared/roughdraft-review-protocol.md`.

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

This skill is the canonical producer of `brand/BRAND.md` + `brand/DESIGN.md` + `brand/ASSETS.md`. These artifacts are consumed by:

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

Schema changes (frontmatter fields, section headings, table column structure) require atomic update across affected upstream callers — never silently drift.
