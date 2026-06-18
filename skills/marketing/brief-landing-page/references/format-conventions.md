---
title: LP-Brief Format Conventions
lifecycle: canonical
status: stable
produced_by: lp-brief
load_class: PROCEDURE
---

# LP-Brief Format Conventions

> Format rules for the lp-brief artifact (`brief.md`) + companions (`handoff-implementation.md` always, `handoff-{claude-design,figma,designer}.md` optional, `asset-slots/{slot-id}.prompt.md` per slot). Cited from SKILL.md "Artifact Contract" block + "Artifact Template" section. The full artifact template below is the canonical `brief.md` structure — schema changes here require atomic update across upstream callers + downstream consumers.

## Output locations

| Path | When | Lifecycle |
|---|---|---|
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/brief.md` | Always (Approval Gate 3 PASS or DONE_WITH_CONCERNS) | pipeline |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/handoff-implementation.md` | Always — emitted alongside brief.md | pipeline |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/handoff-claude-design.md` | When `target_handoff` lists `claude-design` | pipeline |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/handoff-figma.md` | When `target_handoff` lists `figma` | pipeline |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/handoff-designer.md` | When `target_handoff` lists `designer` | pipeline |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/asset-slots/{slot-id}.prompt.md` | Per generative slot, written by `brief-graphic` (not by lp-brief itself) | pipeline |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/rejected.md` | When user rejects at Approval Gate 3 | pipeline (terminal) |
| `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/v[N]/brief.md` | Re-run with `--rev=N`; prior versions preserved | pipeline (versioned) |

## File naming + versioning

- **slug** is the page route normalized: `/pricing` → `pricing`, `/services` → `services`, `q3-launch-lp` → `q3-launch-lp`. Slashes stripped.
- **Re-run with `--rev=N`:** writes `v[N]/brief.md`. Prior versions preserved in their own `v[N-1]/` folder. The orchestrator reads `v[N-1]/brief.md` as the prior context for the new run.
- **Single-cycle re-run without `--rev`:** overwrites in place (use sparingly — loses prior history).
- **Rejected briefs:** saved as `rejected.md` at the slug root (not in a `v[N]/` folder) — terminal state, not versioned.

## Brief envelope (250–500 lines typical, completeness-gated)

- **Completeness is the gate:** G6 checks that every section carries its headline candidates, CTA copy where applicable, and a conversion checklist.
- **Under 250 lines:** brand-voice critic G6 WARN — likely insufficient depth, designer asks follow-up questions. Hard FAIL only under ~200. Re-dispatch section-spec to add detail to under-specified sections.
- **Over 500 lines:** brand-voice critic G6 WARN — likely bloat, designer skims. Hard FAIL only over ~700. Re-dispatch section-spec to compress (cite shared chain instead of duplicating; cap section spec at the conversion-checklist gates).
- **250–500 lines:** typical band — G6 PASS when complete.
- **Empty lines count.** The 250–500 range assumes well-spaced markdown — empty lines structure readability and are part of the envelope.

## Concerns pinning (DONE_WITH_CONCERNS only)

When status = `done_with_concerns` (cycle-2 residual critic FAIL), the `## Concerns` section is **pinned at top of brief.md** above the body so downstream operators see them before reading the brief body. Critic scores ALSO appear in frontmatter `critic_scores`. No silent FAIL outputs — every critic concern visible in the artifact.

Format (verbatim from brief template):

```markdown
## Concerns (only present if status = done_with_concerns)

> Pinned at top so downstream operators see them before reading the brief body.
>
> **Conversion critic:** [score / verdict] — [each FAIL bullet, verbatim from critic]
> **Brand-voice critic:** [score / verdict] — [each FAIL bullet, verbatim from critic]
>
> Decide before execution: ship as-is, revise manually, or kill.
```

## Frontmatter schema (17 fields)

```yaml
---
skill: brief-landing-page
version: 1
date: [today]
status: [done | done_with_concerns | blocked | needs_context]
stack: marketing
review_surface: md         # html | md | none
decision_state: not_required # pending | approved | denied | suggested | not_required
review_tool: inline        # proof | inline | roughdraft | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
page_route: [/pricing | /services | etc.]
tier: [primary | secondary]
rev: [N — what revision this is]
hypothesis_title: [from approved hypothesis]
target_handoff: [claude-design | pencil | figma | designer | null | list of any]  # specialty targets in addition to always-on implementation prompt; pass single value, list, or null
brand_anchors:
  primary_color: [hex with token name]
  primary_type: [font, weight]
  surface: [paper / matte / glass-if-DESIGN.md-permits]
sacred_respected: [list]
critic_scores:
  conversion: [N/M]
  brand_voice: [N/M]
shared_skill_chain: [path to project's _prompts.md if referenced]
provenance:
  skill: brief-landing-page
  run_date: [today]
  input_artifacts:
    - [brand/BRAND.md, brand/DESIGN.md, research/icp-research.md as relevant]
    - [.forsvn/loops/<slug>/context.md if scoped to a loop, otherwise omit]
  output_eval: null  # set by downstream evaluate-landing-page when a cycle scores this brief
---
```

`provenance:` is the **generation-provenance** variant per `references/_shared/artifact-contract-template.md § provenance: — two variants`. Required because `evaluate-landing-page` reads `provenance.input_artifacts` to ground scoring and the promotion script walks `output_eval` to verify the artifact → eval → learning chain.

Date format: ISO `YYYY-MM-DD`. `target_handoff` accepts a single value, list, or `null` — null skips the optional Hand-Off (Specialty Targets) section entirely; the implementation prompt companion is the universal default and always emitted regardless.

The four `decision_state` / `review_tool` / `reviewed_at` / `reviewer` fields are the human-review layer per [`reviewable-artifact-contract`](_shared/reviewable-artifact-contract.md). This is a `pipeline` artifact, so `decision_state` defaults to `not_required` — most briefs are regenerable drafts. The fields and the `## Review Gate` body block ship in the template so the operator (or an eval loop) can opt a run into review by setting `decision_state: pending`; the procedure for running that review is [`roughdraft-review-protocol`](_shared/roughdraft-review-protocol.md). Review fields apply to the main `brief.md` artifact only — not the `handoff-*.md` companions or `asset-slots/*.prompt.md` files. They are flat by design (the `manifest-sync` parser reads flat YAML) and additive/orthogonal to the existing schema — adding them does not change how downstream consumers read the brief.

## Body section structure (15 sections, in order)

1. **Title + Page/Tier/Rev/Hand-off-target heading block** — H1 + 4 bold lines
2. **Concerns** — only present if status = done_with_concerns (pinned at top)
3. **IMC Context** — 1–3 lines: where this page sits in the campaign
4. **Hypothesis (Approved)** — Claim + 3Q score + Why this + What we're betting
5. **What Changed from rev N-1** — bullet list, only present if rev > 1
6. **Page Architecture** — Surface Rhythm + Section List + ASCII Diagram + Scroll Velocity Plan
7. **Section-by-Section Spec** — per-section: purpose + headline candidates (3, 4-U scored) + subhead + CTA + visual + layout + motion + conversion-checklist
8. **Asset Slots** — table with Slot / Section / Dimensions / Format / File path / Fallback / Generation prompt columns + per-slot prompt-file note
9. **What NOT to Do** — sacred elements + page-specific failure modes + voice violations
10. **Implementation Prompt (Coding Agents)** — companion-file pointer (full block lives at `handoff-implementation.md` to keep brief.md within envelope)
11. **Hand-Off (Specialty Targets)** — optional; only when `target_handoff` lists `claude-design` / `pencil` / `figma` / `designer`. Per-target prompt block + an **Iteration Guide** (follow-up-prompt guardrail per `design-handoff-prompting.md`). Omit entirely when `target_handoff` is null.
12. **Pre-flight Checklist** — 5 GFM checkboxes
13. **Skill Chain** — referenced (if project has shared chain doc) OR generated per-page inline (no project-level default created)
14. **Launch Plan + Results + Why This Works** — 3 short closing sections
15. **Review Gate** — human-review block (Approve / Reject / Suggest changes) per `_shared/reviewable-artifact-contract.md`; final section of the artifact

## Full artifact template (byte-identical)

> This is the canonical brief.md template. Sub-agents (section-spec, asset-slot, handoff) populate it; orchestrator assembles. Schema changes require atomic update across upstream callers (campaign-plan if it inlines brief structure) + downstream consumers (design-brief reads Asset Slots; coding agents read Implementation Prompt companion; lp-eval reads loop-local strategy artifacts that may reference brief.md).

Save to `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/brief.md`:

```markdown
---
skill: brief-landing-page
version: 1
date: [today]
status: [done | done_with_concerns | blocked | needs_context]
stack: marketing
review_surface: md         # html | md | none
decision_state: not_required # pending | approved | denied | suggested | not_required
review_tool: inline        # proof | inline | roughdraft | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
page_route: [/pricing | /services | etc.]
tier: [primary | secondary]
rev: [N — what revision this is]
hypothesis_title: [from approved hypothesis]
target_handoff: [claude-design | pencil | figma | designer | null | list of any]  # specialty targets in addition to always-on implementation prompt; pass single value, list, or null
brand_anchors:
  primary_color: [hex with token name]
  primary_type: [font, weight]
  surface: [paper / matte / glass-if-DESIGN.md-permits]
sacred_respected: [list]
critic_scores:
  conversion: [N/M]
  brand_voice: [N/M]
shared_skill_chain: [path to project's _prompts.md if referenced]
provenance:
  skill: brief-landing-page
  run_date: [today]
  input_artifacts:
    - [brand/BRAND.md, brand/DESIGN.md, research/icp-research.md as relevant]
    - [.forsvn/loops/<slug>/context.md if scoped to a loop, otherwise omit]
  output_eval: null
---

# Landing-Page Brief: [Title]

**Page:** [route + name]
**Tier:** [primary / secondary]
**Rev:** [N — what changed from rev N-1, if applicable]
**Hand-off target:** [Claude Design / Figma / designer]

## Concerns (only present if status = done_with_concerns)

> Pinned at top so downstream operators see them before reading the brief body.
>
> **Conversion critic:** [score / verdict] — [each FAIL bullet, verbatim from critic]
> **Brand-voice critic:** [score / verdict] — [each FAIL bullet, verbatim from critic]
>
> Decide before execution: ship as-is, revise manually, or kill.

## IMC Context

[1–3 lines: where this page sits in the campaign, traffic source, awareness stage, role in funnel.]

## Hypothesis (Approved)

**Claim:** [single sentence — falsifiable]
**3Q score:** Visual [Y/N] / Falsifiable [Y/N] / Unique [Y/N]
**Why this:** [argument tied to evidence signals or audience signals]
**What we're betting:** [the falsifiable bet — what success looks like, what failure looks like]

## What Changed from rev N-1 (if rev > 1)

[Bullet list — only present if --rev=N. Tied to page-state changes, post-launch evidence, or new ICP signals.]

## Page Architecture

### Surface Rhythm

[3–5 lines: how the page reads at scroll speed. Fast / slow / pause beats.]

### Section List

1. **Hero** — [purpose + headline pull]
2. **[Section name]** — [purpose]
...
N. **CTA Block** — [purpose]

### ASCII Diagram

```
┌─────────────────────────────────────┐
│  HERO    [headline]    [hero CTA]   │  ← 100vh, low velocity
├─────────────────────────────────────┤
│  VALUE PROP — 3 columns             │
├─────────────────────────────────────┤
│  SOCIAL PROOF — logo grid + quote   │
├─────────────────────────────────────┤
│  ...                                 │
└─────────────────────────────────────┘
```

### Scroll Velocity Plan

| Section | Velocity | Why |
|---------|----------|-----|
| Hero | Slow / pause | First-impression gate |
| Value prop | Medium | Argument scan |
| Social proof | Slow | Decision moment |
| Features | Fast | Detail layer |
| Objection | Slow | Decision blocker |
| CTA | Pause | Action moment |

## Section-by-Section Spec

### 1. Hero

**Purpose:** [first-impression conversion gate]

**Headline candidates (3, 4-U scored):**
1. "[copy]" — Useful: Y, Unique: Y, Urgent: Y, Ultra-specific: Y → 4/4
2. "[copy]" — 3/4
3. "[copy]" — 4/4
**Recommended:** #[N] — [why]

**Subhead:** "[copy]"

**Hero CTA:** "[copy]" — primary, action verb + outcome, first-person

**Visual:** [reference to asset slot — see Asset Slots section]

**Layout:**
- Heading: [type token, size]
- Subhead: [type token, size]
- CTA position: [above-fold, button style, contrast pair]
- Background: [hex / asset slot]

**Motion:** [duration token from DESIGN.md if applicable; static otherwise]

**Conversion checklist (gates):**
- [ ] 4-U ≥ 3/4
- [ ] Message match to traffic source
- [ ] Above-fold value clear in 3 seconds
- [ ] Primary CTA visible without scroll
- [ ] Trust signal within scroll-distance (logo grid below or testimonial widget)
- [ ] Voice rules: no forbidden vocab

### 2. [Next Section]

[Same structure: purpose, copy candidates with rubric, visual, layout, motion, conversion checklist.]

[Continue per section...]

## Asset Slots

| Slot | Section | Dimensions | Format | File path | Fallback | Generation prompt |
|------|---------|-----------|--------|-----------|----------|-------------------|
| Hero image | Hero | 1920×1080 | WebP | `growth/[slug]/hero.webp` | solid #004700 | [link to prompt template, see asset-slots/] |
| Logo grid | Social proof | 6 cells × 60px | SVG | `growth/[slug]/logos.svg` | "delete cell if not real" | — |
| Founder portrait | Story | 600×600 | WebP | `growth/[slug]/founder.webp` | spot illustration | [link if generative] |

**Generation prompts** for asset slots that use generative AI live at `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/asset-slots/[slot-name].prompt.md`. Each is written by `brief-graphic` against the slot's spec — the prompt is the actionable handoff to an image-generation tool.

## What NOT to Do

- [Sacred element 1 — verbatim "do not touch" line]
- [Sacred element 2]
- [Page-specific failure mode — e.g., "do not use stock-photo office imagery; ICP rejects it"]
- [Voice violations — e.g., "no leverage / unlock / seamlessly anywhere"]

## Implementation Prompt (Coding Agents)

> **Always emitted as a companion file**, not inlined here (keeps brief.md within the 250–500 line envelope). Full paste-ready block lives at `handoff-implementation.md` alongside this brief.
>
> - **Stack:** `[detected framework | vanilla HTML/CSS/JS]` — auto-detected from repo at write time
> - **Motion stack:** `[from brand/DESIGN.md | GSAP + ScrollTrigger + Lenis default]`
> - **Recipients:** any frontier coding agent (Claude Code, Cursor, Codex, etc.) — tool-agnostic

## Hand-Off (Specialty Targets)

> Optional — only present when `target_handoff` lists `claude-design` / `pencil` / `figma` / `designer`. **Omit this entire section when `target_handoff` is null.** The implementation prompt companion is the universal default; these are supplements for projects that also use a design tool or human designer.

### To: [Claude Design / Figma / designer]

**Prompt block (paste verbatim):**

```
[Hand-off prompt composed by handoff-agent — opening clears the 9 Required Fields
and repeats DESIGN.md visual values verbatim, per references/design-handoff-prompting.md]
```

### Iteration Guide (design-tool targets only)

> Operator note for the follow-up prompts after the opening block above. Omit when `target_handoff` is `null` or coding-agent only. Moves classified by the edit-prompt taxonomy in `references/design-handoff-prompting.md`.

- **Refinement** (expected): [the one property the operator will likely adjust first — e.g., "hero vertical padding"]
- **Additive** (expected): [the next section or component likely to be added]
- **Corrective** (if it drifts): [the constraint most at risk — e.g., "restore matte surfaces"]
- **Do NOT type:** broad meta prompts ("reconsider the page", "rethink the layout") — the tool reads them as discard and the session rarely recovers. To restart, paste a full new opening block.

### Pre-flight Checklist

- [ ] All copy in brief is final (or marked "candidate — pick one")
- [ ] All asset slots have file paths and fallbacks
- [ ] All sacred elements listed under What NOT to Do
- [ ] Critic scores both ≥ pass threshold
- [ ] Shared skill chain referenced (if project uses one) — not duplicated

## Skill Chain

**If project has a shared chain doc:** "See `growth/page-redesigns/_prompts.md` § Phase A — Hero Build" (etc.). List only page-specific overrides under each referenced phase.

**If project does not:** generate a per-page chain inline — list the downstream skills/prompts in execution order, each with one-line scope:

1. `brief-graphic` — spec hero asset (slot: `hero-image`), then run image-gen against the produced prompt at `asset-slots/hero-image.prompt.md`
2. `write-copy` — polish 3 headline candidates against 4-U + voice
3. [implementation step — Claude Design / Figma / designer]
4. `humanmaxxing` — final pass on any AI-generated body copy
5. [post-launch] collect analytics/recordings/experiment notes → run `evaluate-landing-page` inside the page's eval loop, then feed the resulting eval into next `lp-brief --rev=N`

Page-scoped only. No project-level default is created.

## Launch Plan

[3–5 lines: when, traffic ramp, instrumentation (UTMs, events to fire), success criteria from hypothesis.]

## Results (filled post-launch)

[Empty until launched. After: actual metrics, hypothesis verdict, what to take into rev N+1.]

## Why This Works (sanity check)

This is the why-this-works block per [`_shared/why-this-works-convention.md`](_shared/why-this-works-convention.md) — placed correctly (after the artifact spec, before the Review Gate). **Product-fit, not generic** (2–4 lines): the bet (the hypothesis, stated so it can fail), then the load-bearing arguments — why *this* hero / architecture / CTA hierarchy lands the hypothesis for *this* product — each traced to a source (`ICP.md` pain/VoC, `BRAND.md`/`CREATIVE-DIRECTION.md`, the campaign plan). Each line must fail the Competitor Swap Test (wouldn't read true for a competitor). No ICP/brand foundation → the convention's Absent state (general principles only; never a fabricated pain or positioning claim).

## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

> Re-run with `--rev=N`: write to `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/v[N]/brief.md`, preserve prior versions.

## Companion file conventions

### `handoff-implementation.md` (always-emitted)

Universal coding-agent prompt block for any frontier model (Claude Code / Cursor / Codex / Opus / Gemini / GPT). Stack auto-detected from repo at write time:

- **Repo has framework config** (Next.js / Astro / SvelteKit / etc.) → emit prompt for that stack
- **Repo has no framework** → fall back to pure HTML/CSS/Vanilla JS, single `index.html`
- **Motion stack:** read from `brand/DESIGN.md` if declared; default GSAP + ScrollTrigger + Lenis

Must include verbatim from `references/handoff-formats.md`:
- **Asset Placeholder Rule** (lifted verbatim — coding agent NEVER invents stock-photo URLs)
- **"Invent or substitute asset URLs" entry in DO NOT block**
- **Closing rule verbatim:** "Write production-ready, flawless code. Do not truncate. Do not use placeholder copy or invented imagery."
- **(BUG FIX) callouts** for any section-spec mechanic involving clip-path, mix-blend-mode + transform stacking, or sticky-inside-overflow patterns

Brand-voice critic G8b enforces all of the above on every run regardless of `target_handoff`.

### `handoff-{claude-design,figma,designer}.md` (optional per `target_handoff`)

Per-target hand-off prompt block. The opening of each block follows the design-tool opening-prompt protocol in `references/design-handoff-prompting.md`: clear all nine Required Fields and **repeat the exact visual values from `DESIGN.md` verbatim** (palette hex + token names, type, spacing, surface, motion) — the design tool will not apply an already-approved system on its own. Lift sacred elements + voice rules verbatim from brand_digest into each — never paraphrase. Brand-voice critic G8 FAILs on paraphrase, on missing visual values in a design-tool opening, or on a design-tool target with no Iteration Guide in the brief.

### `asset-slots/{slot-id}.prompt.md` (written by downstream `brief-graphic`)

Per-asset generation prompt for image-gen / vector-gen tools. Written by `brief-graphic` against the slot's spec from `Asset Slots` table. lp-brief itself does NOT write these — slots with `route: pending-media-skill` have no prompt file yet and the implementation prompt renders them as solid-color placeholders until the appropriate media-briefing skill catches up.

## Cross-stack contract

This skill produces:
- `brief.md` — consumed by human designers + coding agents + `brief-graphic` (per slot) + indirectly by `evaluate-landing-page` cycles (when the brief is referenced from a loop's `strategy/` directory)
- `handoff-implementation.md` — consumed by any frontier coding agent
- `handoff-{target}.md` — consumed by Claude Design / Figma / designer
- `asset-slots/{slot-id}.prompt.md` paths — written by `brief-graphic`; lp-brief just declares the slot IDs

Schema changes (frontmatter fields, body section structure, table column structures, companion file naming) require atomic update of `format-conventions.md` + downstream callers — never silently drift.
