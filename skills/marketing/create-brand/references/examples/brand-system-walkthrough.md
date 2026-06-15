---
title: Brand-System Walkthrough — Route A + Route B
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: EXAMPLE
---

# Brand-System Walkthrough

> Two condensed end-to-end examples — Route B (FinLit, full Route B pipeline producing BRAND.md + DESIGN.md + ASSETS.md) and Route A (TaskFlow, Quick Brand for MVP producing BRAND.md only). Extracted from SKILL.md "Worked Example" sections to keep the body lean while preserving the canonical examples for reference.

---

## Route B — Full Brand System (FinLit, personal finance app)

**Input**: FinLit — a personal finance app for young professionals (22-30), positioned against intimidating banking apps.

### Step 0: Pre-Dispatch

Product: personal finance app. Audience: young professionals 22-30. Competitors: traditional banking apps (Mint, bank mobile apps). **Platforms declared:** iOS, Web (marketing site + PWA), Email.

### Layer 1: Parallel Foundation

All 4 agents dispatched in parallel:

- **Strategy agent** returns:
  - Origin story: "born from a founder's shame spiral at 24"
  - Name: "FinLit — financial literacy, shortened to feel casual"
  - Purpose: "make finance empowering, not shameful"
  - Positioning: "the only finance app that feels like a supportive friend"
  - Values: transparency over comfort, simplicity over completeness, progress over perfection
  - Digital touchpoints mapped across 6 surfaces
  - Product-specific: "Streak System as brand expression" section

- **Personality agent** returns:
  - Caregiver (70%) + Explorer (30%)
  - Traits: encouraging but not patronizing, clear but not dumbed-down, warm but not saccharine
  - Emotional journey: 8-touchpoint map (first encounter → app store → onboarding → first budget → daily check → missed goal → annual review → telling a friend)

- **Voice agent** returns:
  - Voice DNA with 3 attributes (straight-talking, encouraging, honest) with real-context Do/Don't examples
  - Tone range across 3 contexts (marketing: inviting + confident, product UI: minimal + clear, errors: calm + honest)
  - Tagline: "Money, minus the shame." V:3 F:2 U:3 = 8/9

- **Visual agent** returns:
  - **For BRAND.md:** Logo system (4 variations, color combos, rules)
  - **For DESIGN.md:** Visual atmosphere ("warm kitchen table, not bank lobby"). Primary warm teal `oklch(0.7 0.11 180)` / `#3eb8a4`. Complete light + dark theme palettes (18 tokens each). Neutral base: Stone. Display: Plus Jakarta Sans. Body: Inter. Shadow system (5 levels). Surface material: soft matte (no glass). Imagery: real people, natural light, warm tones. Do's and Don'ts (12 items each).

### Merge — Brand File Assembly

**BRAND.md assembled** from strategy (origin/name/purpose/values/positioning/touchpoints) + personality (archetype/traits/journey) + voice (voice DNA/tone range/tagline) + visual (logo only).

**DESIGN.md started** from visual (atmosphere/colors/typography/shadows/imagery/do's-don'ts). AI-readable header generated.

**Coherence check:** Caregiver archetype aligns with warm teal (trust + growth), humanist-leaning typography (approachable), 0.5rem radius (soft). PASS — proceed to Layer 2.

### Layer 2: Sequential Chain

All outputs go to DESIGN.md:

- **Token architect** returns: Stone 50-950 neutral scale, teal 50-950 primary scale, `--radius: 0.5rem`, 19 semantic tokens with light + dark values. Spacing scale.

- **Component token** returns: 6 button variants mapped to semantic tokens, input specs with blur validation, card specs. Product-specific: "Budget Card" component with progress ring. Named animations: `progress-fill` (spring, stiffness 180), `goal-celebrate` (confetti, 600ms). Motion tokens (75-500ms).

- **Accessibility** returns: All token pairs pass 4.5:1. Dark mode surface hierarchy (stone.950 → stone.900 → stone.800). Primary shifts to teal.400 in dark mode. Touch targets ≥44px.

- **Critic** returns: PASS on both files. BRAND.md narrative quality strong, emotional journey touchpoint-level. DESIGN.md AI-readable, all themes complete. Cross-element coherence verified. AI slop score: 1 item (clean).

### Step 8.5: ASSETS.md Projection

Orchestrator projects declared platforms (iOS, Web, Email) against `references/assets-inventory.md` templates.

**Row breakdown:**
- 18 Universal rows (logo variants, fonts, design tokens)
- 13 Social & Sharing rows
- 8 Favicon/Web Metadata rows (Web declared)
- 8 Imagery & Illustration rows (DESIGN.md §8 declared direction)
- 13 iOS platform rows (app icon set + splash + screenshots + metadata)
- 7 Web platform rows
- 7 Email platform rows

**Total: 74 rows.**

Auto-scans `brand/` — `logo-full.svg` exists → `[x]`; all others `[ ]` (fresh run).

Writes `docs/forsvn/canonical/marketing/ASSETS.md` (id: assets) with legend, sections, summary (Done: 1 / 74), no Orphaned block (first run).

On re-run as the designer drops files into `brand/` subdirs, the Done count rises and human `[~]` (in-progress) markers persist across runs.

### Deliver

`docs/forsvn/canonical/marketing/BRAND.md`, `docs/forsvn/canonical/marketing/DESIGN.md`, and `docs/forsvn/canonical/marketing/ASSETS.md` saved. Status: DONE.

---

## Route A — Quick Brand (TaskFlow, MVP project management tool)

**Input**: TaskFlow — a new project management tool, pre-MVP, needs basic brand to start building.

### Step 0: Pre-Dispatch

Product: project management tool. Audience: small team leads. **Platforms declared:** Web, macOS (Electron).

Quick Brand selected — platforms captured as one line in BRAND.md ("Ships on: Web, macOS"); per-platform surfaces and icon specs deferred to Route B when ready.

### Layer 1: Parallel (reduced — only 2 agents)

- **Strategy agent** returns:
  - Purpose
  - Values (clarity over complexity, speed over ceremony)
  - Positioning
  - Origin story deferred to Route B

- **Visual agent** returns (color + typography only — logo deferred):
  - Primary blue `oklch(0.623 0.214 259)` / `#3b82f6`
  - Neutral: Slate
  - Display: Inter
  - Body: Inter

### Critic (reduced)

Checks strategy-to-visual coherence only. PASS.

(Skipped: archetype consistency, token system correctness, accessibility compliance, cross-element coherence matrix — those gates require Route B's Layer 2 chain.)

### Deliver

Quick Brand artifact saved as single `docs/forsvn/canonical/marketing/BRAND.md` with note:

> Run full brand-system (Route B) when ready to produce DESIGN.md + ASSETS.md.

**Quick Brand produces BRAND.md only.** DESIGN.md requires the full Route B pipeline (token architect, component tokens, accessibility audit). ASSETS.md requires DESIGN.md.

Status: DONE.

---

## Notes on the two routes

| Aspect | Route A (Quick) | Route B (Full) |
|---|---|---|
| Agents dispatched | 3 (strategy + visual + critic) | 8 (all) |
| Layer 1 scope | Strategy + visual (color + typography only) | All 4 (strategy + personality + voice + visual full) |
| Layer 2 | Skipped | All 3 (token-architect → component-token → accessibility) + critic |
| Step 8.5 | Skipped | Run (ASSETS.md projection) |
| Step 9 | Skipped | Optional (Paper MCP / Claude Design / none) |
| Output files | `docs/forsvn/canonical/marketing/BRAND.md` | `docs/forsvn/canonical/marketing/{BRAND,DESIGN,ASSETS}.md` (+ optional artboards) |
| Critic scope | Strategy-to-visual coherence only | Full 7-dimension rubric + 6-row Cross-Element Coherence Matrix |
| Time budget | ~30 minutes | ~3 hours |
| Cost band | $0.30-0.80 | $2-5 |
| When to use | MVP, pre-launch, exploration | Full rebrand, established product, comprehensive guidelines |
| Upgrade path | Re-run with Route B when ready; platforms captured at Route A re-used | — |
