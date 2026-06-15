<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Brand-System Playbook
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: PLAYBOOK
---

# Brand-System Playbook

## Why this skill exists

Brand-system produces three complementary files — **BRAND.md** (narrative brand book), **DESIGN.md** (AI-readable spec), and **ASSETS.md** (per-platform production inventory) — from a small set of strategy + audience + competitive inputs. The output is the source of truth that every downstream marketing and product skill grounds against (`write-copy`, `write-ad`, `write-outreach`, `brief-landing-page`, `brief-graphic`, `plan-campaign`, `humanmaxxing`, `polish-vn`, `brief-shortform`, `map-user-flow`). Without a real brand system, downstream skills silently default to generic archetype output ("warm, friendly, trusted") and the work drifts off-brand cycle after cycle.

The orchestrator coordinates 8 specialized sub-agents across two layers: **Layer 1 parallel** (strategy + personality + voice + visual) lays the brand foundation; **Layer 2 sequential** (token-architect → component-token → accessibility → critic) builds the design system on top of the visual foundation. ASSETS.md is projected deterministically after the critic gate passes — no extra agent — by reading BRAND.md + DESIGN.md + declared platforms against `references/assets-inventory.md` templates.

This skill is the canonical producer of `docs/forsvn/canonical/marketing/{BRAND,DESIGN,ASSETS}.md` (ids `brand`, `design`, `assets`). These are canonical artifacts (not pipeline outputs) — edited in place over time by humans and re-amended on major product pivots.

## Why this skill exists at all

Six failure modes it prevents:

1. **Generic archetype output.** "Warm, friendly, trustworthy" describes nobody specifically. Strategy + personality + voice agents work in parallel from real audience data; critic FAILs if values lack tradeoffs, if archetypes contradict, or if voice attributes have no Do/Don't examples.
2. **Aesthetics-before-strategy drift.** Color/font/radius chosen because they "look nice" with no trace to archetype. Visual-agent runs parallel with strategy-agent so the visual decision is already grounded in the brand brief; critic enforces strategy-to-visual traceability in scoring.
3. **Design system that isn't AI-readable.** A "design system" written as 4,000 words of prose can't be consumed by an AI coding agent and turned into on-brand UI. DESIGN.md is specification (tables, OKLCH values, CSS formulas, named animations with physics) — never prose-only. The "an AI reading this alone should produce on-brand UI" rule lives in critic Pass 2.
4. **Asset inventory drift.** Designers ship logos / favicons / app icons / OG cards without anyone tracking what's done vs missing. ASSETS.md auto-scans the `brand/` folder each run and emits per-row `[x]`/`[ ]`/`[~]`/`[!]` status; the Orphaned block preserves tracking state when a platform is dropped between runs.
5. **Per-platform sections invented or dropped silently.** Brand systems that pad with Android/Windows sections when the team only ships iOS, or drop the per-platform icon spec when "we'll figure it out later." Pre-Dispatch enumerates target platforms as mandatory Q6; strategy-agent + visual-agent + Step 8.5 ALL gate on the same declared list. Undeclared platforms MUST NOT appear in any artifact.
6. **Round-tripping Claude Design exports into `brand/`.** Renderings are derivative presentations, not source of truth. Step 9 emits them outside `brand/`. Re-running brand-system updates the source; Claude Design re-renders from updated source next session.

The structural answer is the **7-dimension critic rubric** (in `agents/critic-agent.md` — BRAND.md narrative quality / DESIGN.md AI-readability / strategy-to-visual traceability / archetype consistency / token system correctness / accessibility compliance / cross-element coherence). Threshold: average ≥3.5 across all dimensions AND no dimension below 3.

## Philosophy

Brand is a system of decisions, not a collection of artifacts. Every choice — radius, primary color, body font, voice attribute — has a reason that traces back to who the brand is for and what it stands against. The critic's job is to verify those traces.

BRAND.md is prose; DESIGN.md is specification. Never mix the registers. A brand book reads like a story a founder would share with investors. A design system reads like an API reference an engineer would implement against. The two files serve different audiences and use different conventions.

Three-layer token architecture is load-bearing for downstream usability. Primitives (raw OKLCH scales) → Semantic tokens (`--primary`, `--background`, `--card`, `--popover`) → Component tokens (`--button-primary-bg`). Skipping the semantic layer makes the design system unmaintainable. The bg/fg pair convention (`bg-primary text-primary-foreground`) is non-negotiable.

## Methodology

**Two-layer orchestration, deliberate.**

- **Layer 1 (parallel):** strategy-agent + personality-agent + voice-agent + visual-agent. Run simultaneously because they consume the same brief and produce non-overlapping sections of BRAND.md (plus visual-agent populates DESIGN.md §1-3 + §6-8 + §11 atmosphere/colors/typography/shadows/imagery/do's-don'ts and BRAND.md brand-mark).
- **Layer 2 (sequential):** token-architect-agent receives visual-agent output (colors + fonts + complete theme palettes) AND personality-agent output (archetype for radius). Component-token-agent receives token-architect output (semantic token map). Accessibility-agent receives token-architect + component-token outputs. Critic-agent receives the full assembled brand system.
- **Merge step between Layer 1 and Layer 2:** orchestrator assembles Layer 1 outputs into BRAND.md (11 sections) + DESIGN.md (sections 1-3 + 6-8 + 11). Coherence check before dispatching Layer 2.
- **Step 8.5 (after critic PASS, Route B only, deterministic — no agent):** project declared-platforms × `assets-inventory.md` templates into `docs/forsvn/canonical/marketing/ASSETS.md` (stamps `id: assets`). Auto-scan `brand/` for file existence; preserve human `[~]`/`[!]` markers verbatim; move dropped-platform rows to `## Orphaned`.
- **Step 9 (optional):** Visual Renderings via Paper MCP artboards (9a), Claude Design handoff (9b), or none (9c).

**Two routes by scope.**

- **Route A — Quick Brand (MVP).** Dispatch only strategy + visual (color + typography only — logo deferred) + critic. Produces BRAND.md only. Target platforms still captured at intake as a one-liner so Route B picks them up later. Defers archetype, voice/tone, messaging architecture, token architecture, component tokens, accessibility audit, dark mode, ASSETS.md, Visual Renderings, per-platform Digital Touchpoints surfaces and icon specs.
- **Route B — Full Brand System.** Full pipeline. Produces BRAND.md + DESIGN.md + ASSETS.md.

**Two-cycle rewrite cap.** Critic FAIL → re-dispatch named agent(s) per the Rewrite Routing table (in `agents/critic-agent.md`) with feedback. Max 2 cycles. Cycle 2 FAIL → ship DONE_WITH_CONCERNS with critic annotations.

**Palette ownership.** Visual-agent is authoritative for color choices and theme palette values. Token-architect systematizes them into the three-layer architecture and adds missing infrastructure tokens. On conflict, visual-agent wins.

**Accessibility hand-back.** Accessibility-agent OWNS the audit, NOT the fix. If the audit demands changes to upstream values (shadow color failing contrast, primary lightness failing 3:1 against `--primary-foreground`), it reports the failing pair to the critic, which fails the gate and re-dispatches the upstream owner (visual-agent / token-architect / component-token).

## Principles

- **Critical Gates are binary.** 5 gates so load-bearing that violation = re-dispatch BEFORE delivery. (1) No colors/fonts before strategy. (2) No Layer 2 before Layer 1 completes. (3) Don't skip critic's cross-element coherence check. (4) Stale upstream data >30 days → recommend re-running `research-icp`. (5) BRAND.md is prose, DESIGN.md is specification — never mix registers.
- **Declared platforms gate per-platform content.** Target platforms enumerated at Pre-Dispatch (Q6) are the SINGLE source of truth for what appears in BRAND.md Digital Touchpoints, DESIGN.md Platform Icon Specifications, and ASSETS.md platform blocks. Undeclared platforms MUST NOT appear. Three-way platform-set equivalence is a critic gate.
- **ASSETS.md is living.** Overwrite `docs/forsvn/canonical/marketing/ASSETS.md` in place + increment the integer `version:` (prior versions in git history). Dropped-platform rows move to `## Orphaned` (preserved, not deleted). Never a `.v[N].md` sibling under `canonical/` — the UPPERCASE name grammar forbids dots. BRAND.md and DESIGN.md re-run the same way — overwrite in place + bump the integer `version:` (prior versions live in git history; no `.v[N].md` sibling under `canonical/`).
- **Human markers are sacred.** Auto-scan only flips `[ ]` ↔ `[x]` based on file existence. `[~]` (in progress) and `[!]` (blocked) are human-owned and preserved verbatim across re-runs.
- **No invented rows.** Every ASSETS.md row traces to BRAND.md / DESIGN.md / `platform-surfaces.md`. No invented assets.
- **Reference examples teach quality, not direction.** `example-brand.md` + `example-design.md` show structural quality (sections, depth, format). They are NOT a style guide. If output shares visual language with examples (glass surfaces, amethyst palette, geometric type) without justification from the brief, that's anchoring bias and the critic flags it.
- **Single-agent fallback exists.** If multi-agent dispatch is unavailable, execute each agent's instructions sequentially in-context per the same layer order.
- **The artifact IS the contract.** Three files with fixed schemas. Frontmatter + section structure + naming conventions live in `format-conventions.md`. Schema changes require atomic update across upstream callers.

## When NOT to use this skill

- **Need user flow mapping.** Use `map-user-flow` — screen-by-screen, not brand identity. user-flow consumes brand-system's design tokens and component context.
- **Need marketing copy.** Use `write-copy` — voice consumer, not voice definer. copywriting reads BRAND.md voice attributes + lexicon.
- **Need a single visual asset (social post, OG card, thumbnail).** Use `brief-graphic` — per-asset brief, consumes BRAND.md + DESIGN.md.
- **Need a landing page architecture.** Use `brief-landing-page` — page-level, consumes brand-system as ground truth.
- **Audience research missing.** Run `research-icp` FIRST — brand without audience research → generic archetypes. brand-system flags this at Pre-Dispatch when `research/product-context.md` is absent.
- **Just need a logo.** brand-system produces a brand mark spec (commission/generation-ready description in BRAND.md) but does NOT render. Use a downstream renderer (Paper MCP, Claude Design, designer) to produce the asset.

## History / origin

- **v1.0.0 — initial release.** 8-agent orchestration (strategy + personality + voice + visual in Layer 1 parallel → token-architect + component-token + accessibility + critic in Layer 2 sequential). Two routes (Quick / Full). Three-layer W3C token architecture. 12 Jungian archetypes + radius-to-archetype mapping.
- **v2.0.0 — major bump.** Added ASSETS.md as third output (Route B only) via Step 8.5 deterministic projection. Added Pre-Dispatch Target Platforms catalog (13 platforms — Web, iOS, iPadOS, Android, macOS, Windows, Linux desktop, watchOS/Wear OS, tvOS, CarPlay/Android Auto, Browser extension, CLI/terminal, Email, Embedded app). Added per-platform Digital Touchpoints subsections in BRAND.md + Platform Icon Specifications in DESIGN.md. Three-way platform-set equivalence enforced by critic.
- **v3.0.0 — major bump.** Added Lexicon Rules block to BRAND.md (`forbidden_vocabulary`, `preferred_phrases`, `casing`, `emoji_policy`). Added Font Loading & Licensing table + Iconography source/forbidden glyphs YAML to DESIGN.md. Added Step 9 Visual Renderings (Paper MCP / Claude Design / none) with pre-flight checks for Claude Design handoff.
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v6.2.0):** body trimmed 581 → 300 lines (-48.4%, 281 lines saved; 300 vs ≤280 creative target by 20 — accepted overage for 3-file-output complexity, mirrors design-brief slot 11 precedent of +8 over its 260 target). 5 new refs: playbook + format-conventions + anti-patterns (NEW — extracted 13 patterns from body + 4 cross-cutting marketing-stack rows) + procedures/{pre-dispatch, dispatch-mechanics} + examples/brand-system-walkthrough (extracted from body's Route A + Route B Worked Examples). Existing `agents/{strategy, personality, voice, visual, token-architect, component-token, accessibility, critic}-agent.md` + 18 data-catalog refs (ai-slop-detection, artboard-generation, artifact-templates, assets-inventory, brand-archetypes, brand-voice, color-emotion, component-patterns, component-tokens, example-brand, example-design, implementation-rules, paper-artboard-templates, platform-surfaces, token-architecture, token-templates, typography-psychology, visual-identity) UNCHANGED — these ARE the skill's domain data and behavior. Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. Layer 1 dispatch table + Merge Step BRAND.md+DESIGN.md assembly tables + Layer 2 dispatch table EXTRACTED to dispatch-mechanics.md (body retains the load-bearing semantics: coherence-check-before-Layer-2, palette ownership rule, accessibility hand-back). Output-Three-Files prose descriptions COMPRESSED to a single audience/register/route table (saved ~10 lines without losing classification semantics; full per-file content lives in playbook + format-conventions). **Cross-stack contract preserved BYTE-IDENTICAL** (per vn-tone-slot + humanmaxxing-slot learnings: no clarifying parentheticals added; no nested-heading promotions of safety content; no rubric-explanation paragraphs): 5 Critical Gates, Quality Gate (13 BRAND.md + 13 DESIGN.md + 6 ASSETS.md + 4 cross-file checks), 8-agent Manifest with Routes-to column, Routing Logic (Route A + Route B step lists + "Why 5 → 8.5" explainer), Pre-Dispatch needed dimensions (7), Step 8.5 key invariants, Step 9 3-path summary, Artifact Templates 3-file template summary, 4-tier Completion Status. No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Warm/Cold Start prompts, Target Platforms catalog (13 platforms with disambiguation rules), Write-back map (7 dimensions × 4 experience files), Context to Pass to All Agents
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — how to spawn a sub-agent, single-agent fallback, Layer 1 parallel dispatch table, Merge Step assembly tables (BRAND.md + DESIGN.md), Layer 2 sequential dispatch + palette ownership + accessibility hand-back, Critic Gate + rewrite loop, Step 8.5 ASSETS.md projection 7-step procedure (load prior state → project fresh inventory → auto-scan → merge human markers → compute summary → write → re-run versioning) + orchestrator self-check, Step 9 Visual Renderings (9a Paper MCP + 9b Claude Design + 9c None) with pre-flight checks + handoff message
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — 13 brand-system failure modes (aesthetics without strategy, generic values, archetype confusion, voice without examples, token soup, skipping semantic layer, mismatched bg/fg, dark mode as inversion, dispatching all agents for Quick Brand, inventing ASSETS.md rows, overwriting human markers, silently dropping rows on platform drop, round-tripping Claude Design exports) + 4 cross-cutting marketing-stack patterns (upstream-context skipped, cross-stack contract drift, polish-chain misroute, undeclared platforms padded)
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — frontmatter schema (3 files), file naming + versioning rules, BRAND.md 11-section structure + Lexicon Rules block + Digital Touchpoints platform subsection format, DESIGN.md 11-section structure + Font Loading & Licensing table + Forbidden Icons YAML + Platform Icon Specifications block, ASSETS.md 5-section structure (Universal / Social & Sharing / Favicon & Web Metadata / Imagery & Illustration / per-platform blocks) + Legend + Summary + Orphaned block + checkbox marker semantics
- [`examples/brand-system-walkthrough.md`](examples/brand-system-walkthrough.md) [EXAMPLE] — Route B end-to-end walkthrough (FinLit personal finance app, 3 platforms: iOS + Web + Email, 8-agent dispatch, 74-row ASSETS.md projection) + Route A walkthrough (TaskFlow MVP, 2 platforms: Web + macOS, reduced critic, BRAND.md only)
- Domain catalogs (loaded by agents at dispatch): `references/{brand-archetypes, brand-voice, visual-identity, token-architecture, token-templates, component-tokens, component-patterns, implementation-rules, platform-surfaces, typography-psychology, color-emotion, ai-slop-detection, paper-artboard-templates, artboard-generation, artifact-templates, assets-inventory}.md`
- Quality-bar examples: `references/{example-brand, example-design}.md`
- Shared: `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric}.md`
- Agents: 8 sub-agents in `agents/` — see Agent Manifest in SKILL.md. `critic-agent.md` holds the canonical 13 + 13 + 4 gate checklist + 6-row Cross-Element Coherence Matrix + 7-dimension Scoring Rubric + 8-row Rewrite Routing table
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
