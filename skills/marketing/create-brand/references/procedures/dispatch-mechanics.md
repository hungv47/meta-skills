---
title: Brand-System Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: PROCEDURE
---

# Brand-System Dispatch Mechanics

> Full dispatch + merge + critic + projection procedure. Cited from SKILL.md "Routing Logic", "Dispatch Protocol", "Layer 1", "Merge Step", "Layer 2", "Critic Gate", "Step 8.5", and "Step 9" sections. Body retains the route step lists + tables; this procedure file holds the full mechanics, single-agent fallback, palette ownership rule, accessibility hand-back rule, Step 8.5 7-step projection, and Step 9 sub-paths.

## How to spawn a sub-agent

1. **Read** the agent instruction file — include FULL content in the Agent prompt
2. **Append** context (product, audience, competitive landscape, existing assets, declared platforms) after instructions
3. **Resolve file paths to absolute** — rooted at this skill's directory
4. **Pass upstream artifacts by content** — orchestrator reads `docs/forsvn/artifacts/` files FIRST, includes excerpts in context. Sub-agents do NOT read artifact files directly.
5. If **feedback** exists (from critic FAIL), append with header `## Critic Feedback — Address Every Point`

### Conventions

- **Source citation:** Cite sources for brand psychology, color theory, archetype effectiveness facts. Web search → include URL. Unattributable → flag `[UNVERIFIED]`.
- **Context loaded:** Include which upstream artifacts were read (with versions/dates) in the artifact body. Creates audit trail for downstream skills.

### Single-agent fallback

If multi-agent dispatch is unavailable, execute each agent's instructions sequentially in-context per the same layer order:
- Layer 1: define strategy, select archetype, write voice chart, design visual identity
- Layer 2: build token architecture, map component tokens, audit accessibility
- Final: evaluate with critic rubric, check cross-element coherence

Fallback skips parallelism but preserves layer order — Layer 1 strictly before Layer 2 (Critical Gate 2: "No Layer 2 before Layer 1 completes").

## Layer 1: Parallel Foundation dispatch table

Spawn **IN PARALLEL** (Route B):

| Agent | Instruction File | Pass These Inputs | Reference Files |
|---|---|---|---|
| Strategy Agent | `agents/strategy-agent.md` | brief (product + audience + competitors + declared platforms) | `references/platform-surfaces.md` (Route B only) |
| Personality Agent | `agents/personality-agent.md` | brief (product + audience) | `references/brand-archetypes.md` |
| Voice Agent | `agents/voice-agent.md` | brief (product + audience) | `references/brand-voice.md` |
| Visual Agent | `agents/visual-agent.md` | brief (product + audience + existing assets + declared platforms) | `references/color-emotion.md`, `references/typography-psychology.md`, `references/visual-identity.md`, `references/platform-surfaces.md` |

Wait for all to complete. Outputs feed the Merge Step and Layer 2.

**Route A reduced dispatch:** only strategy-agent + visual-agent (color + typography only — logo deferred). Personality + voice + Layer 2 all skipped.

## Merge Step — Brand File Assembly (between Layer 1 and Layer 2)

Before assembling, read `references/artifact-templates.md` for the complete section structure, field specifications, and ordering for both files. **ASSETS.md is assembled separately in Step 8.5 after the critic gate passes — it does not merge in this step.**

After Layer 1 completes, assemble outputs into **two separate files** simultaneously:

### BRAND.md Assembly (from Layer 1)

| Section | Owner Agent | Notes |
|---|---|---|
| The Origin Story | Strategy Agent | Narrative prose, not bullet points |
| The Name | Strategy Agent | Etymology, meaning, cultural context |
| Purpose, Mission & Vision | Strategy Agent | — |
| Core Values | Strategy Agent | "X over Y" format with real tradeoffs |
| Brand Positioning | Strategy Agent | Positioning statement, value prop, what we are/aren't |
| Brand Archetype | Personality Agent | 70/30 blend with "in action" section |
| Personality Traits | Personality Agent | "Trait, but not extreme" table |
| Emotional Journey Map | Personality Agent | Touchpoint-by-touchpoint, not before/during/after |
| Brand Voice DNA | Voice Agent | Voice attributes (Do/Don't) + tone range (3 contexts) + tagline |
| The Brand Mark | Visual Agent (logo section) | Visual description, variations, color combos, rules |
| [Product-Specific Sections] | Strategy Agent | Differentiators, pricing as brand, parent brand relationship |
| Digital Touchpoints | Strategy Agent | How brand expresses at each surface |

### DESIGN.md Assembly (starts from Layer 1, completed by Layer 2)

| Section | Owner Agent | Notes |
|---|---|---|
| AI-Readable Header | Orchestrator synthesis | Archetype, visual metaphor, fonts, primary color |
| 1. Visual Theme & Atmosphere | Visual Agent | Mood, density, metaphor — prose introduction |
| 2. Color Palette & Roles | Visual Agent + Token Architect | Primary colors, semantic, per-theme palettes, neutrals, distribution rules |
| 3. Typography Rules | Visual Agent | Font stack, type scale, typography rules |
| 4. Component Stylings | Component Token Agent | Product-specific core components + standard components |
| 5. Layout Principles | Token Architect Agent | Spacing scale, border radius |
| 6. Shadows & Elevation | Visual Agent + Component Token | Shadow scale, z-index scale |
| 7. Iconography | Visual Agent | System icons, product-specific icons, **Platform Icon Specifications** (per declared platform) |
| 8. Imagery & Visual Direction | Visual Agent | Photography, brand devices |
| 9. Motion & Animation | Component Token Agent | Principles, duration scale, easing, named animations, motion safety |
| 10. Accessibility | Accessibility Agent | Contrast, focus, touch targets, color independence |
| 11. Do's and Don'ts | Visual Agent | Concrete rules synthesized from all decisions |

**Coherence check before Layer 2:** Verify that the archetype selected by personality-agent aligns with the visual choices made by visual-agent. If they contradict (e.g., Caregiver archetype with sharp/aggressive typography), resolve before dispatching Layer 2.

## Layer 2: Sequential Chain dispatch table

Dispatch **ONE AT A TIME, IN ORDER** (Route B only — Route A skips Layer 2):

| Step | Agent | Instruction File | Receives |
|---|---|---|---|
| 1 | Token Architect Agent | `agents/token-architect-agent.md` | Visual-agent output (colors, fonts, **complete theme palettes**) + personality-agent output (archetype for radius) |
| 2 | Component Token Agent | `agents/component-token-agent.md` | Token-architect-agent output (semantic token map) |
| 3 | Accessibility Agent | `agents/accessibility-agent.md` | Token-architect + component-token outputs |
| 4 | Critic Agent | `agents/critic-agent.md` | Complete assembled brand system (both BRAND.md and DESIGN.md) |

### Palette ownership rule

Visual-agent is authoritative for color choices and theme palette values. Token-architect systematizes them into the three-layer architecture (primitive → semantic → component) and adds missing infrastructure tokens (`--popover`, `--popover-foreground`). On conflict, visual-agent wins.

### Accessibility hand-back

Accessibility-agent runs after shadow tokens are set. If its audit demands changes to upstream values (shadow color failing contrast against its surface, primary lightness failing 3:1 against `--primary-foreground`), it does NOT edit the upstream table directly. It reports the failing pair to the critic, which fails the gate and re-dispatches the upstream owner — visual-agent (shadows/colors), token-architect (semantic values), or component-token (component-level overrides). Accessibility-agent owns the audit, not the fix.

## Critic Gate

- **PASS:** Proceed to ASSETS.md projection (Step 8.5), then optional Visual Renderings (Step 9 — Paper MCP / Claude Design / none).
- **FAIL:** Re-dispatch named agent(s) with critic feedback per the Rewrite Routing table in `agents/critic-agent.md`. Max 2 rewrite cycles. After 2 failures, deliver with critic annotations and flag DONE_WITH_CONCERNS.

## Step 8.5: ASSETS.md Projection (Route B only, always-on, deterministic — no sub-agent)

After critic passes, before Step 9. Read `references/assets-inventory.md` for full emission rules, per-platform templates, and file template. Procedure:

### Substep 1 — Load prior state

Read existing `docs/forsvn/canonical/marketing/ASSETS.md`. Preserve `[~]` (in progress) and `[!]` (blocked) rows verbatim. Note platforms present in old file but no longer declared — those rows go to `## Orphaned` on emit.

### Substep 2 — Project fresh inventory

Using BRAND.md brand mark section, DESIGN.md §2/§3/§7/§8/§9, and declared-platforms list, emit rows in order:

1. Universal
2. Social & Sharing
3. Favicon & Web Metadata (if Web declared)
4. Imagery & Illustration (if DESIGN.md §8 declares direction)
5. One per-platform block in declared order

Every row: name, spec ref, target path, status. **Expand every `{placeholder}` first:** for each declared embedded host emit one full row set with `{host}` substituted; for imagery rows substitute `{count}` from DESIGN.md §8. No row reaches substep 3 with an unfilled placeholder.

### Substep 3 — Auto-scan for `[x]`

File-typed rows: `Bash: test -e <path>` → `[x]`/`[ ]`.

Directory-typed rows (path ends `/`) require at least one non-`.gitkeep` file:
```bash
test -d <path> && [ -n "$(ls -A <path> 2>/dev/null | grep -v '^\.gitkeep$')" ]
```
→ `[x]`/`[ ]`. Prevents scaffolded-empty-directory false-completion.

### Substep 4 — Merge human markers

Overlay preserved `[~]`/`[!]` rows (matched by name) onto fresh inventory. **Human markers override auto-computed status.** Auto-scan ONLY flips `[ ]` ↔ `[x]`.

### Substep 5 — Compute summary

Total / Done / In progress / Blocked / Not started counts.

### Substep 6 — Write `docs/forsvn/canonical/marketing/ASSETS.md`

Frontmatter MUST stamp the required instruction core — `skill: create-brand`, `version` (integer), `date`, `status`, `stack: marketing`, `review_surface: none`, `id: assets`, `type: canonical`, `keywords: [assets, checklist, deliverables, brand-assets, production]` — plus the review bookkeeping every artifact carries (`decision_state: not_required`, `review_tool: none`, `reviewed_at:` empty, `reviewer:` empty) and the ASSETS-only bookkeeping (`declared_platforms`, `last_scan` ISO timestamp, `brand_md_version`/`design_md_version`). Full template: `references/artifact-templates.md` "ASSETS.md Template". Then legend, sections, summary, and `## Orphaned` block if any.

### Substep 7 — Re-run versioning

ASSETS.md is a **living file** — overwrite `docs/forsvn/canonical/marketing/ASSETS.md` in place and increment the integer `version:`; prior versions live in git history. Dropped-platform rows move to `## Orphaned` (NOT removed), preserving tracking state. NEVER create a `.v[N].md` sibling under `canonical/` — the UPPERCASE canonical name grammar forbids dots. The Orphaned block, not a versioned sibling, is the primary handler for "platform dropped between runs."

### Quality gate (orchestrator self-check before write)

- Every row has spec ref and target path.
- ASSETS.md platform block set === declared platforms === BRAND.md Digital Touchpoints === DESIGN.md Platform Icon Specifications.
- No human-set `[~]`/`[!]` markers overwritten.
- No invented rows (every row traces to `references/assets-inventory.md` templates).

### Scope

Route B only. Route A captures platform list but emits no inventory until the full pipeline runs.

## Step 8.6: CREATIVE-DIRECTION.md (Route B; also the standalone refresh-only path)

Orchestrator-written — **no sub-agent** (keeps the dispatch at 8 agents). After the critic gate passes and ASSETS is projected, the orchestrator synthesizes the art-direction layer from: strategy-agent output (archetype, positioning, origin), visual-agent output (palette, type, atmosphere), and the operator's mood/origin inputs (+ any `inspiration/` reference frames). It writes `docs/forsvn/canonical/marketing/CREATIVE-DIRECTION.md` per the section order + frontmatter in `references/format-conventions.md` "CREATIVE-DIRECTION.md structure" and the template in `references/artifact-templates.md`.

Hard rule: **it names what DESIGN.md tokens mean; it redefines nothing.** Every hex/font/duration it mentions is quoted from DESIGN.md. The critic's "Creative-direction ↔ token coherence" check (Cross-File checklist) gates it — a contradicting or duplicating value is a FAIL, re-dispatch to the orchestrator step (max 2 cycles).

**Refresh-only path.** When BRAND.md + DESIGN.md already exist and the ask is art direction (not tokens), this step runs **standalone**: read BRAND/DESIGN (+ frames), write/overwrite CREATIVE-DIRECTION.md, bump its integer `version:`, leave all other canonical files byte-unchanged. No Layer 1/2, no ASSETS re-projection.

## Step 9: Visual Renderings (optional)

The spec — BRAND.md / DESIGN.md / ASSETS.md — is canonical. Renderings are **derivative presentations**, not source of truth. Three optional paths:

### 9a. Paper MCP — programmatic artboards

If Paper MCP is available, render 5 presentation artboards. See `references/artboard-generation.md` for specs, workflow, prerequisites.

After generating, run AI slop detection (`references/ai-slop-detection.md`) — artboards are highest-risk for AI default patterns.

**Artboards:** Color Palette | Typography System | Spacing & Tokens | UI Style Principles | Logo System. Save to `brand/artboards/`.

### 9b. Claude Design — interactive prototypes (claude.ai/design)

Claude Design is an Anthropic Labs UI product at `claude.ai/design` (Pro/Max/Team/Enterprise tiers). Produces designs, prototypes, slides, one-pagers via text prompts, document/image uploads, and codebase context for design-system grounding.

**This skill does not dispatch to Claude Design** (no API/MCP). It hands off by giving the user precise sharing/scoping instructions.

**Pre-flight checks (all must pass):**
1. `brand/DESIGN.md` exists with complete theme palette tables.
2. `brand/BRAND.md` Brand Mark section is commission-grade.
3. At least one of `brand/logo/logo-full.svg` or a placeholder logo asset exists.
4. `brand/font/` has downloaded woff2s or link comments for each declared font.

If any check fails, say so — don't send the user to Claude Design with an incomplete spec.

**Handoff message (if checks pass):**

> Your brand spec is ready for Claude Design. Open `claude.ai/design` (requires Pro/Max/Team/Enterprise) and start a session by sharing your `brand/` folder — at minimum paste `DESIGN.md` (grounds tokens, theme palettes, component specs) and `BRAND.md` (grounds voice and brand mark). `ASSETS.md` tells Claude Design what already exists vs. still needs making. Outputs (prototypes, slides, one-pagers, HTML/PPTX/Canva exports) are presentation artifacts — keep them outside `brand/`. To update the brand source, re-run brand-system; share the updated spec with Claude Design next session.

### 9c. None

If neither renderer is available/wanted, skip — the spec stands alone. Downstream skills (user-flow, design-brief) consume DESIGN.md directly without rendering.
