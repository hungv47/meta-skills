---
name: create-brand
description: "Builds a brand identity system as up to three artifacts — BRAND.md (story, voice, positioning, archetype), DESIGN.md (AI-readable design system: palettes, tokens, components, motion), and ASSETS.md (per-platform production inventory). Runs Quick Brand (MVP) or full brand-system. Use when defining or rebranding a product's identity, design tokens, or visual system. Not for marketing copy (use write-copy), user flows (use map-user-flow), campaign planning (use plan-campaign), or audience research (use research-icp)."
argument-hint: "[product or brand to design]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "6.2.0"
  budget: deep
  estimated-cost: "$2-5"
---

# Brand Identity & Design System — Orchestrator

*Design — Step 1 of 2. Coordinates specialized agents to transform product artifacts into a complete brand narrative and AI-readable design system.*

**Core Question:** "Does every visual decision trace back to who we are?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

- **No colors/fonts before strategy.** Visual-agent runs parallel with strategy-agent; orchestrator verifies coherence in merge. Unjustified visual choices get flagged by critic.
- **No Layer 2 before Layer 1 completes.** Token-architect needs visual-agent output; component-token needs token-architect output. Chain is strict.
- **Don't skip critic's cross-element coherence check.** Radius↔archetype, type↔personality, color↔emotion — the critic checks the matrix no individual agent can see.
- **Stale upstream data (>30 days) → generic archetypes.** Recommend re-running `research-icp` if artifact dates are old.
- **BRAND.md is prose, DESIGN.md is specification.** BRAND.md = brand book (narrative, story, voice). DESIGN.md = API reference (tables, formulas, exact values). Never mix registers.

## Output — Three Files (Route B) / One File (Route A)

| File | Audience | Register | Route |
|---|---|---|---|
| `brand/BRAND.md` | Founders, marketers, copywriters, designers | Prose — brand book | A + B |
| `brand/DESIGN.md` | AI coding agents, frontend engineers, design system consumers | Specification — tables, formulas, exact values | B only |
| `brand/ASSETS.md` | Designers, art directors, asset producers, PMs | Checklist — GFM checkboxes with spec ref + target path | B only |

ASSETS.md is deterministically projected from BRAND.md + DESIGN.md + declared platforms (Step 8.5) — auto-scans `brand/` each run; human-owned `[~]` (in-progress) and `[!]` (blocked) markers preserved across runs. Per-section content + which agent populates which section lives in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) § "Merge Step — Brand File Assembly". Per-section format rules + frontmatter schema + checkbox semantics live in [`references/format-conventions.md`](references/format-conventions.md). Optional visual renderings via Paper MCP artboards (`brand/artboards/`) or a Claude Design handoff — see Step 9.

## Quality Gate
Before delivery, the **critic agent** verifies both files:

**BRAND.md checks:**
- [ ] Origin story and naming have cultural/etymological depth (not just "we named it X")
- [ ] Values have real tradeoffs (not generic "innovation, quality, integrity")
- [ ] Voice attributes have Do/Don't examples from real brand contexts
- [ ] Tone range covers 3 key contexts with clear shift across the range
- [ ] Tagline scored V/F/U (min 6/9), passes competitor swap test
- [ ] **Lexicon Rules block present:** `forbidden_vocabulary` (5-15 `term`+`reason` pairs), `preferred_phrases` (5-12 brand-native strings), `casing`, `emoji_policy` — all concrete, not "TBD". Reasons live in YAML keys, not comments.
- [ ] No copywriting scope creep (no boilerplate, pillars, elevator pitch, tagline variants)
- [ ] Emotional journey is touchpoint-level with design/interaction triggers (not copy triggers)
- [ ] Brand mark described in commission/generation-ready detail
- [ ] Digital touchpoints scoped to visual expression (not verbal)
- [ ] **Route B platform coverage:** Universal Surfaces table filled + one Digital Touchpoints subsection per declared platform; every surface entry concrete (no blanks/TBDs). Zero undeclared platforms.
- [ ] **Route A platform coverage:** Digital Touchpoints contains only the `Platforms declared at intake` line + deferral note. Per-platform tables ABSENT.
- [ ] **Register separation:** Digital Touchpoints rows describe brand expression (mood, motion cue, color role, density) — never geometry. Geometry lives in DESIGN.md Platform Icon Specifications.
- [ ] Prose quality: reads like a brand book, not fill-in-the-blank templates

**DESIGN.md checks:**
- [ ] AI-readable header summarizes key decisions (archetype, metaphor, fonts, primary color)
- [ ] **Font Loading & Licensing table:** every font has source, license, status, load method. Unclear licenses flagged `[NEEDS LICENSING]`
- [ ] **Iconography source library named** (with CDN/npm link), **fallback library named**, **Forbidden Icons YAML emitted** (3-8 entries with reasons, or empty list with explanation)
- [ ] Complete color palette tables per theme (not just primary + neutrals)
- [ ] All semantic tokens have values for every theme
- [ ] Every token pair meets WCAG AA (4.5:1 normal text, 3:1 large/UI)
- [ ] Bg/fg convention used consistently (`bg-primary text-primary-foreground`)
- [ ] One global `--radius` — archetype-justified
- [ ] Surface/material language documented with CSS formulas
- [ ] Shadow system with multiple elevation levels
- [ ] Named animations with physics values (spring stiffness, damping, mass)
- [ ] **Platform Icon Specifications:** one subsection per declared platform with sizes, safe-area rules, state variants (dark/tinted/themed/monochrome as applicable), derivative size list. Zero undeclared platforms.
- [ ] Do's and Don'ts section with concrete rules

**ASSETS.md checks (Route B only):**
- [ ] One section per declared platform; zero undeclared platforms
- [ ] Every row has spec ref (BRAND.md / DESIGN.md / platform-surfaces.md) and **fully-substituted** target path under `brand/` (no unfilled `{host}`/`{count}`/`{token}` placeholders)
- [ ] No invented assets — every row traces to upstream spec
- [ ] No duplicated spec (sizes, safe zones) — ASSETS.md cites, doesn't re-define
- [ ] Legend present; Summary counts present; `## Orphaned` handled (present if platforms dropped, absent otherwise)
- [ ] Prior `[~]` and `[!]` markers preserved from previous run (verify by diff if re-run)

**Cross-file coherence:**
- [ ] Cross-element coherence: radius↔archetype, type personality↔archetype, color emotion↔brand personality, imagery direction↔archetype's visual world
- [ ] Voice tone (BRAND.md) matches visual atmosphere (DESIGN.md)
- [ ] ASSETS.md platform blocks === BRAND.md Digital Touchpoints platforms === DESIGN.md Platform Icon Specifications platforms (same set, same order)
- [ ] AI slop check via `references/ai-slop-detection.md` — 0-1 clean, 2-3 review, 4+ regenerate

**Reference quality bar:** Compare against `references/example-brand.md` and `references/example-design.md`. Match "good" patterns, avoid "bad" patterns. Use example-design.md tests (copy-paste, blind build, competitor swap, implementation gap) as final validation.

## Chain Position
Previous: `research-icp` (product context) | Next: `plan-campaign`, `write-copy`, `brief-landing-page`, `brief-graphic`

**Re-run triggers:** Major product pivots, new markets, audience shifts, or annual brand refresh.

**Related (non-chain):** `research-icp` (audience data), `write-copy` (consumes voice guidelines), `humanize` (uses voice adjectives), `brief-graphic` (consumes DESIGN.md)

### Skill Deference
- **Need audience research first?** Run `research-icp` — brand without audience research → generic archetypes.
- **Need user flows after brand?** Run `map-user-flow` — consumes design tokens and component context.
- **Need marketing copy?** Run `write-copy` — consumes voice guidelines.

---

## Agent Manifest

| Agent | Layer | File | Routes to | Focus |
|-------|-------|------|-----------|-------|
| Strategy Agent | 1 (parallel) | `agents/strategy-agent.md` | BRAND.md | Purpose, mission, vision, values, positioning, competitive landscape, **brand narrative (origin/naming), product-specific sections, digital touchpoints** |
| Personality Agent | 1 (parallel) | `agents/personality-agent.md` | BRAND.md | Jungian archetype (70/30 blend), personality traits, **touchpoint-level emotional journey** |
| Voice Agent | 1 (parallel) | `agents/voice-agent.md` | BRAND.md | Voice attributes (Do/Don't), tone range (3 key contexts), primary tagline with V/F/U score |
| Visual Agent | 1 (parallel) | `agents/visual-agent.md` | Both | Logo → BRAND.md. **Visual atmosphere, color system, per-theme palettes, typography, imagery, surface & material language, shadow system, z-index, do's and don'ts** → DESIGN.md |
| Token Architect Agent | 2 (sequential) | `agents/token-architect-agent.md` | DESIGN.md | 3-layer W3C token system, semantic map, radius-to-archetype, **per-theme token tables** |
| Component Token Agent | 2 (sequential) | `agents/component-token-agent.md` | DESIGN.md | Button 6 variants, input specs, card specs, **product-specific components, named animations with physics values**, motion tokens |
| Accessibility Agent | 2 (sequential) | `agents/accessibility-agent.md` | DESIGN.md | WCAG AA contrast, touch targets, dark mode audit, focus states |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Both | Cross-element coherence, **BRAND.md narrative quality, DESIGN.md AI-readability**, PASS/FAIL |

Quality-bar reference examples: `references/example-brand.md`, `references/example-design.md` (annotated good vs bad excerpts for every BRAND.md / DESIGN.md section).

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — read product/audience/competitive context from pipeline artifacts + experience, check freshness windows on `research/icp-research.md` (>30d → recommend re-run), identify any prior `brand/` directory whose BRAND.md/DESIGN.md/ASSETS.md should be versioned vs amended in place.

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | icp-research | Strongly recommended — drives strategy + audience grounding |
| `research/icp-research.md` | icp-research | Strongly recommended — audience archetype + voice register |
| `brand/BRAND.md` (existing) | prior brand-system run | Optional — triggers versioning (`BRAND.v[N].md`) on re-run |
| `brand/ASSETS.md` (existing) | prior brand-system run | Optional — Step 8.5 preserves human `[~]`/`[!]` markers across re-runs |
| `.forsvn/experience/{product, audience, brand, business, technical}.md` | any skill | Optional — prior persisted answers for the 7 Pre-Dispatch dimensions |

## Routing Logic

### Mode Selection

Ask: *"Full brand system or quick brand for MVP?"*

### Route A: Quick Brand (MVP)
**When:** MVP, early-stage, need to ship fast with basic brand foundations.

```
1. Pre-dispatch: Gather context (Step 0)
2. LAYER 1 — Dispatch IN PARALLEL:
   - strategy-agent (purpose, values, positioning)
   - visual-agent (color + typography only — logo deferred)
3. Dispatch: critic-agent (coherence check — strategy-to-visual only)
4. If FAIL → re-dispatch named agent(s) with feedback (max 2 cycles)
5. Deliver Quick Brand artifact
```

**Quick Brand scope:** Purpose/mission/vision, core values, positioning, primary color + neutrals, display + body font, basic type hierarchy. **Target platforms still captured at intake** and recorded in BRAND.md as one line ("Ships on: iOS, macOS, Web") so Route B picks them up later. Defers: archetype analysis, voice/tone system, messaging architecture, full visual identity, token architecture, component tokens, accessibility audit, dark mode, Visual Renderings (Step 9), per-platform Digital Touchpoints surfaces and icon specs.

**Output includes note:** "Run full brand-system when ready to build the design system."

### Route B: Full Brand System
**When:** Established product, full rebrand, comprehensive guidelines needed.

```
Step 0    Pre-dispatch: Gather context
Step 1    LAYER 1 — Dispatch IN PARALLEL:
          - strategy-agent
          - personality-agent
          - voice-agent
          - visual-agent
Step 2    MERGE: Assemble Layer 1 outputs into brand identity sections
Step 3    LAYER 2 — Dispatch SEQUENTIALLY:
          - token-architect-agent (receives visual-agent + personality-agent output)
          - component-token-agent (receives token-architect-agent output)
          - accessibility-agent (receives token-architect + component-token outputs)
Step 4    Dispatch: critic-agent (receives BRAND.md + DESIGN.md)
Step 5    If FAIL → re-dispatch named agent(s) with feedback (max 2 cycles)
Step 8.5  ASSETS.md projection — deterministic, no new agent, always-on auto-scan
Step 9    Visual Renderings (optional) — Paper MCP / Claude Design / none
Step 10   Deliver artifacts (BRAND.md + DESIGN.md + ASSETS.md)
```

*Why 5 → 8.5:* `8.5` is a **section header**, not a sequence index — chosen so ASSETS.md projection slots after the critic gate but before pre-existing Step 9 (Visual Renderings) without renumbering downstream refs. Steps 6/7/8 are intentionally absent (legacy flow used unnumbered "Critic Gate", "re-dispatch", "deliver" labels). Reading order: 0 → 1 → 2 → 3 → 4 → 5 → 8.5 → 9 → 10.

---

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** product (1-line), audience, competitive landscape (3-5 names), voice intuition (3 adjectives or reference brand), aesthetic intuition (3 visual references), **target platforms** (mandatory enumeration — drives ASSETS.md and per-platform sections), positioning intent.

Full read-order + Warm/Cold Start prompts + 13-platform Target Platforms catalog with disambiguation rules + 7-dimension Write-back map + Context to Pass to All Agents + hard-block conditions + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade for ≤3 sentences AND no prior artifacts (collapses to Route A); `--fast` flag forces Route A regardless of input length (skip personality + voice + token-architect + component-token + accessibility + Step 8.5 + Step 9; run strategy + visual color/typography-only + critic-coherence-only). **`--fast` does NOT skip Cold Start (especially Q6 target platforms enumeration), Critical Gates 1-5, or hard-block conditions.**

---

## Dispatch Protocol

Run the canonical dispatch mechanics (how to spawn a sub-agent — read agent file FULL content, append context, resolve paths absolute, pass upstream artifacts by content, append critic feedback on FAIL) per [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Section also covers single-agent fallback (when multi-agent dispatch is unavailable: execute each agent's instructions sequentially in-context per the same layer order — Layer 1 strictly before Layer 2).

---

## Layer 1 + Merge + Layer 2

Full per-layer dispatch tables (Layer 1 parallel: 4 agents × instruction file × inputs × reference files; Merge Step BRAND.md + DESIGN.md assembly tables: section × owner agent × notes; Layer 2 sequential: 4 steps × agent × inputs) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE] § "Layer 1: Parallel Foundation dispatch table" + § "Merge Step — Brand File Assembly" + § "Layer 2: Sequential Chain dispatch table". Body retains two load-bearing semantics that govern conflict resolution:

**Coherence check before Layer 2:** Verify that the archetype selected by personality-agent aligns with the visual choices made by visual-agent. If they contradict (e.g., Caregiver archetype with sharp/aggressive typography), resolve before dispatching Layer 2.

**Palette ownership rule:** Visual-agent is authoritative for color choices and theme palette values. Token-architect systematizes them into the three-layer architecture (primitive → semantic → component) and adds missing infrastructure tokens (`--popover`, `--popover-foreground`). On conflict, visual-agent wins.

**Accessibility hand-back:** Accessibility-agent runs after shadow tokens are set. If its audit demands changes to upstream values (shadow color failing contrast against its surface, primary lightness failing 3:1 against `--primary-foreground`), it does NOT edit the upstream table directly. It reports the failing pair to the critic, which fails the gate and re-dispatches the upstream owner — visual-agent (shadows/colors), token-architect (semantic values), or component-token (component-level overrides). Accessibility-agent owns the audit, not the fix.

---

## Critic Gate

- **PASS:** Proceed to ASSETS.md projection (Step 8.5), then optional Visual Renderings (Step 9 — Paper MCP / Claude Design / none).
- **FAIL:** Re-dispatch named agent(s) with critic feedback. Max 2 rewrite cycles. After 2 failures, deliver with critic annotations and flag to user.

---

## Step 8.5: ASSETS.md Projection (Route B only, always-on)

**No sub-agent.** Deterministic orchestrator step, after critic passes, before Step 9.

Read `references/assets-inventory.md` for full emission rules, per-platform templates, and file template. Full 7-step procedure (load prior state → project fresh inventory → auto-scan → merge human markers → compute summary → write → re-run versioning) + orchestrator self-check gate lives in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE] § "Step 8.5: ASSETS.md Projection".

**Scope:** Route B only. Route A captures platform list but emits no inventory until the full pipeline runs.

**Key invariants** (full self-check in procedure):
- Every row has spec ref and target path.
- ASSETS.md platform block set === declared platforms === BRAND.md Digital Touchpoints === DESIGN.md Platform Icon Specifications.
- No human-set `[~]`/`[!]` markers overwritten.
- No invented rows (every row traces to `references/assets-inventory.md` templates).

---

## Step 9: Visual Renderings (optional)

The spec — BRAND.md / DESIGN.md / ASSETS.md — is canonical. Renderings are **derivative presentations**, not source of truth. Three optional paths — 9a Paper MCP artboards, 9b Claude Design handoff (with pre-flight checks + handoff message), 9c None — full procedure lives in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE] § "Step 9: Visual Renderings".

Summary:
- **9a. Paper MCP** — render 5 artboards (Color Palette / Typography / Spacing & Tokens / UI Style / Logo) to `brand/artboards/`. Run AI slop detection after generation. See `references/artboard-generation.md`.
- **9b. Claude Design** — hands off to `claude.ai/design` (no API/MCP dispatch). Pre-flight checks (DESIGN.md complete + Brand Mark commission-grade + `brand/logo/logo-full.svg` exists + `brand/font/` populated). Handoff message instructs user to share `brand/` folder; exports go OUTSIDE `brand/` (presentations/) — re-run brand-system to update source.
- **9c. None** — spec stands alone. Downstream skills (user-flow, design-brief) consume DESIGN.md directly.

---

## Artifact Contract

- **Paths (Route B):** `brand/BRAND.md`, `brand/DESIGN.md`, `brand/ASSETS.md`
- **Paths (Route A):** `brand/BRAND.md` only
- **Lifecycle:** `canonical` — top-level brand-of-record artifacts; consumed by 10+ downstream marketing + product skills
- **Versioning:** BRAND.md + DESIGN.md rename existing to `BRAND.v[N].md` / `DESIGN.v[N].md` on re-run; ASSETS.md is a **living file** — always updated in place, dropped-platform rows move to `## Orphaned` (preserved), only versioned (`ASSETS.v[N].md`) on explicit fresh-inventory request
- **Frontmatter:** see [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE] § "Frontmatter schema (all three files)"
- **Cross-stack contract:** schema changes (frontmatter fields, section headings, table column structures) require atomic update of `format-conventions.md` + every downstream caller (copywriting, ad-copy, cold-outreach, lp-brief, design-brief, campaign-plan, humanize, vn-tone, short-form-brief, user-flow) — never silently drift

### Artifact Templates

Save to `brand/BRAND.md`, `brand/DESIGN.md`, `brand/ASSETS.md`. Create `brand/` if missing, plus `brand/logo/`, `brand/font/`, `brand/inspiration/`, `brand/social/`, `brand/favicon/`, `brand/tokens/`, `brand/imagery/`, `brand/platforms/` subdirs with `.gitkeep` files.

On re-run: rename existing `BRAND.md`/`DESIGN.md` to `BRAND.v[N].md`/`DESIGN.v[N].md` and create new with incremented version. **`ASSETS.md` is always updated in place** — living inventory. Dropped-platform rows move to `## Orphaned` (preserved, not deleted). Only version ASSETS.md (`ASSETS.v[N].md`) when explicitly requested.

**Full templates:** See [references/artifact-templates.md](references/artifact-templates.md).

**Template summary:**

**BRAND.md** (11 sections): Origin Story → Name → Purpose/Mission/Vision → Core Values ("X over Y") → Brand Positioning → Brand Archetype (Primary 70% + Secondary 30%) → Personality Traits → Emotional Journey Map → Brand Voice DNA (attributes + tone range + tagline with V/F/U) → Brand Mark → Digital Touchpoints.

**DESIGN.md** (11 sections): Visual Theme & Atmosphere → Color Palette & Roles (OKLCH, themes, neutral scale, 60/30/10) → Typography Rules (font stack, type scale) → Component Stylings (core + cards + buttons + inputs) → Layout Principles (spacing, radius) → Shadows & Elevation (z-index) → Iconography → Imagery & Visual Direction → Motion & Animation (duration, easing, spring physics) → Accessibility (contrast, focus, touch targets) → Do's and Don'ts.

**ASSETS.md** (5 fixed + per-platform): Universal → Social & Sharing → Favicon & Web Metadata (if Web declared) → Imagery & Illustration (if DESIGN.md §8 declares direction) → Platforms (one subsection per declared, in order) → Summary → Orphaned (only if platforms dropped). Full template in [references/assets-inventory.md](references/assets-inventory.md).

**Quality-bar examples:** [references/example-brand.md](references/example-brand.md), [references/example-design.md](references/example-design.md).

---

## Anti-Patterns

Pipeline reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any artifact ships. 13 brand-system-specific patterns (aesthetics without strategy, generic values, archetype confusion, voice without examples, token soup, skipping semantic layer, mismatched bg/fg, dark mode as inversion, dispatching all agents for Quick Brand, inventing ASSETS.md rows, overwriting human markers, silently dropping rows on platform drop, round-tripping Claude Design exports) + 4 cross-cutting marketing-stack rows (upstream context skipped → generic archetypes, cross-stack contract drift, polish-chain misroute, undeclared platforms padded).

Most common in practice: aesthetics-without-strategy (Critical Gate 1 + Scoring Rubric "Strategy-to-visual traceability"), generic values (BRAND.md Quality Gate "Values have real tradeoffs"), inventing ASSETS.md rows (Step 8.5 self-check "No invented rows"), overwriting human markers (Step 8.5 substep 4 enforcement).

---

## Completion Status

Every run ends with explicit status:
- **DONE** — Route A: BRAND.md written, critic PASS. Route B: BRAND.md + DESIGN.md + ASSETS.md written, cross-element critic PASS, ASSETS.md auto-scan complete
- **DONE_WITH_CONCERNS** — artifacts written but critic flagged secondary issues (token coverage thin, archetype blend ambiguous, ASSETS.md Orphaned rows surfaced for review)
- **BLOCKED** — product context contradictory across audience and positioning (e.g., enterprise positioning + consumer voice cues); needs user reconciliation before strategy can converge
- **NEEDS_CONTEXT** — no audience/product description provided and `research/product-context.md` absent; recommend `research-icp` or rich brief before dispatching

---

## Worked Example

End-to-end Route B walkthrough (FinLit personal finance app, 3 platforms: iOS + Web + Email, full 8-agent dispatch, 74-row ASSETS.md projection, critic PASS) + Route A walkthrough (TaskFlow MVP, 2 platforms: Web + macOS, reduced critic, BRAND.md only): [`references/examples/brand-system-walkthrough.md`](references/examples/brand-system-walkthrough.md) [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/brand-system-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch): `references/{brand-archetypes, brand-voice, visual-identity, token-architecture, token-templates, component-tokens, component-patterns, implementation-rules, platform-surfaces, typography-psychology, color-emotion, ai-slop-detection, paper-artboard-templates, artboard-generation, artifact-templates, assets-inventory}.md`
- **Quality-bar examples:** `references/{example-brand, example-design}.md`
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric}.md`
- **Marketing foundations:** `references/_shared/marketing-foundations.md` — canonical 9-channel framework, funnel-stage vocabulary, 3Q content test, CTA formula, VoC principles
- **Agents:** 8 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 13 BRAND.md + 13 DESIGN.md + 4 cross-file gate checklist + 6-row Cross-Element Coherence Matrix + 7-dimension Scoring Rubric + 8-row Rewrite Routing table.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
