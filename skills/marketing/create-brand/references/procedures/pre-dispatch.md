---
title: Brand-System Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: PROCEDURE
---

# Brand-System Pre-Dispatch Procedure

> Full Pre-Dispatch procedure for brand-system. Cited from SKILL.md "Pre-Dispatch" section. Inherits canonical Pre-Dispatch protocol from [`_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md); brand-system-specific dimensions + Target Platforms catalog + Write-back map are below.

## Needed dimensions (7)

The orchestrator gathers these before dispatching Layer 1. Each must be resolved (from pipeline artifact, experience file, or Cold Start answer) — none can be left as "TBD."

1. **Product** — 1-line description: what does it do, who pays for it?
2. **Audience** — primary persona + 1-2 pain points
3. **Competitive landscape** — 3-5 brand names (competitors AND aspirational/anti-aspirational references)
4. **Voice intuition** — 3 adjectives (e.g., "blunt, technical, dry") OR one reference brand whose voice the user would emulate
5. **Aesthetic intuition** — 3 visual references (URLs, brand names, moodboard hints)
6. **Target platforms** — **mandatory enumeration** from the canonical catalog below; drives ASSETS.md, per-platform Digital Touchpoints (BRAND.md §11), and Platform Icon Specifications (DESIGN.md §7). Undeclared platforms will NOT appear in artifacts.
7. **Positioning intent** — premium / accessible / disruptive / trusted

## Read order

1. **Pipeline:** `research/product-context.md`, `research/icp-research.md`. Existing brand assets directory if present (`brand/` — read prior BRAND.md/DESIGN.md/ASSETS.md if any).
2. **Experience:** `docs/forsvn/experience/{product, audience, brand, business}.md` for prior persisted answers.

If pipeline artifact `date` fields are >30 days old, warn and recommend re-running `research-icp` (Critical Gate 4).

## Warm Start prompt

Triggered when product + audience are inferable from pipeline AND (prior `brand/` exists OR strong references in `experience/`).

```
Found:
- product → "[1-line]"
- audience → "[primary persona]"
- voice notes → "[adjectives from experience/brand.md if any]"

Need before dispatching: target platforms (which surfaces ship), competitive
landscape (3-5 names), and positioning intent (premium / accessible / disruptive / trusted).
```

## Cold Start prompt

Triggered when no audience research exists OR fresh brand work. Bundles all 7 questions in one round-trip.

```
brand-system produces BRAND.md, DESIGN.md, and ASSETS.md. Brand is grounded
in audience + competitive context — without them, output is generic archetypes.
(Strongly recommended: run `research-icp` first if no audience research exists.)

1. **Product** in one sentence — what does it do, who pays for it?
2. **Audience** in one line — primary buyer + 1-2 pain points.
3. **Competitive landscape** — 3-5 brand names you compete with or admire,
   noting what each is known for. (Aspirational AND anti-aspirational both valuable.)
4. **Voice intuition** — 3 adjectives (e.g., "blunt, technical, dry") OR
   one reference brand whose voice you'd want to emulate.
5. **Aesthetic intuition** — 3 visual references (URLs, brand names, moodboard hints).
6. **Target platforms** — multi-select from the canonical list below.
   Mandatory: this drives per-platform Digital Touchpoints, icon specs,
   and ASSETS.md rows. Undeclared platforms will NOT appear in artifacts.
7. **Positioning intent** — premium / accessible / disruptive / trusted.

Answer 1-7 in one response. I'll dispatch.
```

## Target Platforms (catalog for Q6)

Multi-select, explicit — never "cross-platform". Disambiguate vagueness inline before accepting the answer:

- **Web** (marketing site, in-product web UI, PWA)
- **iOS** / **iPadOS**
- **Android**
- **macOS** (native AppKit/SwiftUI, or cross-platform shell like Electron/Tauri — ask which)
- **Windows** (native WinUI/Win32, or cross-platform shell)
- **Linux desktop** (GTK/Qt, or shell)
- **watchOS** / **Wear OS**
- **tvOS**
- **CarPlay** / **Android Auto**
- **Browser extension** (Chrome / Firefox / Safari / Edge — ask which)
- **CLI / terminal**
- **Email** (first-class brand channel — transactional + newsletter)
- **Embedded app** (Slack / Notion / Discord / Teams / Linear / GitHub — ask which host)

### Disambiguation rules (mandatory)

| User said | Orchestrator asks back |
|---|---|
| "mobile app" | iOS, Android, or both? |
| "desktop app" | native (AppKit/WinUI/GTK) or cross-platform shell (Electron/Tauri/Flutter)? |
| "cross-platform" | enumerate the host OSes — each gets its own surface set in ASSETS.md |
| "everywhere" | enumerate; we ship to declared platforms only |
| Cross-platform shell named (Electron, Tauri, Flutter, RN, Capacitor) | still enumerate host OSes — each gets its own surface set in ASSETS.md |
| Browser extension | which browsers? (Chrome / Firefox / Safari / Edge) |
| Embedded app | which host? (Slack / Notion / Discord / Teams / Linear / GitHub) |

Resolution: the orchestrator does NOT accept Q6 answer until every platform is explicit. This is load-bearing — three-way platform-set equivalence (declared ≡ BRAND.md Digital Touchpoints ≡ DESIGN.md Platform Icon Specs ≡ ASSETS.md platform blocks) depends on it.

## Write-back map (7 dimensions × 4 experience files)

After Cold Start answers resolve, write back to `docs/forsvn/experience/` so subsequent skills don't re-ask:

| Q | File | Key |
|---|---|---|
| 1. Product | `product.md` | `Product — one-line` |
| 2. Audience | `audience.md` | `Audience — primary persona` |
| 3. Competitors | `business.md` | `Business — competitive landscape` |
| 4. Voice | `brand.md` | `Brand — voice intuition` |
| 5. Aesthetic | `brand.md` | `Brand — aesthetic intuition` |
| 6. Platforms | `technical.md` | `Technical — supported platforms` (durable) |
| 7. Positioning | `business.md` | `Business — positioning intent` |

Q6 (target platforms) is the most-durable answer — it persists across runs as `technical.md` Technical — supported platforms; only changes when the user explicitly re-declares.

## Context to Pass to All Agents

After Pre-Dispatch resolves, the orchestrator assembles a context bundle every sub-agent receives:

1. **Product:** description, audience, competitive landscape
2. **Existing assets:** logos, colors, fonts, guidelines to preserve or evolve (from `brand/` if exists)
3. **Positioning intent:** premium, accessible, disruptive, trusted
4. **Upstream artifacts:** excerpts from `research/product-context.md` + `research/icp-research.md` if available
5. **Target platforms:** declared platform list. **Strategy-agent renders a Digital Touchpoints subsection per declared platform; visual-agent renders per-platform icon specs. Undeclared platforms MUST NOT appear.** If user declared "iOS + web" only, do not pad with Android/Windows sections.

This bundle is non-optional — agents that operate without it default to generic archetype output (anti-pattern #14).

## Hard-block conditions

The orchestrator hard-blocks BEFORE dispatching Layer 1 if any of these are true:

| Condition | Action |
|---|---|
| `research/product-context.md` AND `research/icp-research.md` both absent | STRONGLY recommend running `research-icp` first; ask user to confirm before proceeding (will produce generic archetype output if user insists) |
| Target platforms (Q6) unresolved | Hard-block; force enumeration via Cold Start Q6 + disambiguation rules |
| Product (Q1) describes a product the user does NOT own / is asking for "competitor analysis" of someone else's brand | Hard-block; brand-system produces brand identity for OWNED products, not competitive teardowns. Suggest `research-market` instead. |
| Pipeline artifacts >30 days old | Warn (Critical Gate 4) + recommend re-running `research-icp`; do NOT block (user may proceed with caveat) |

## `--fast` behavior

This skill is `budget: deep`. `--fast` collapses Route B → Route A automatically:
- Skip personality-agent + voice-agent + token-architect-agent + component-token-agent + accessibility-agent (Layer 2 chain)
- Skip Step 8.5 (ASSETS.md projection — Route A doesn't produce ASSETS.md)
- Skip Step 9 (Visual Renderings — Route A doesn't produce renderings)
- Run strategy-agent + visual-agent (color + typography only — logo deferred) + critic-agent (coherence check on strategy-to-visual only)
- Critic still scores on the dimensions that apply (strategy-to-visual traceability, BRAND.md narrative quality)

**`--fast` does NOT skip:**
- Cold Start when product/audience/competitive landscape/platforms are unresolved (Critical Gate "stale upstream data" still fires)
- Hard-block conditions (especially Q6 target platforms enumeration)
- Critic gate (one cycle, strategy-to-visual focus only)

End artifact must include: `Ran in --fast mode (Route A); rerun without the flag for full Route B (BRAND.md + DESIGN.md + ASSETS.md).`
