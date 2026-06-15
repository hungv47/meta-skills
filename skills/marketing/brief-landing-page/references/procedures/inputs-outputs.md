---
title: LP-Brief Inputs + Outputs Detail
lifecycle: canonical
status: stable
produced_by: brief-landing-page
load_class: PROCEDURE
---

# Inputs + Outputs Detail

Cited from SKILL.md "Inputs" + "Output" sections. Full per-artifact provenance + companion-handoff routing.

## Inputs

| Artifact | Required? | What it provides |
|---|---|---|
| Page route or campaign name (`/pricing`, `q3-launch-lp`) — current state if exists (URL/screenshot/code) | **required** | Subject of the brief |
| `brand/BRAND.md` | **required** (NEEDS_CONTEXT if absent) | Voice, archetype, sacred elements, lexicon rules |
| `brand/DESIGN.md` | **required** (NEEDS_CONTEXT if absent) | Palette, typography, surface language, motion tokens |
| `brand/CREATIVE-DIRECTION.md` | recommended | House art direction (mood, light, framing, motion) — design against it, not tokens alone |
| Existing page state / live site (URL/screenshot/code) | **recommended (realized surface)** | The executed taste to design against — the live site or shipped page. Per `references/_shared/realized-surface-grounding.md`: cite it or record the explicit token-only fallback |
| Post-launch evidence (analytics, heatmaps, experiment notes) | optional | Stronger evidence for redesign hypotheses; absent → labeled assumption |
| `research/icp-research.md` | optional | Objections + VoC for copy candidates |
| `research/product-context.md` | optional | Product accuracy in features/proof |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | optional | Traffic source, awareness stage, funnel role |
| `docs/forsvn/artifacts/meta/records/targets-*.md` | optional | Conversion target informs CTA aggressiveness |

## Outputs

**Main artifact:** `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/brief.md` (versioned re-runs: `v[N]/brief.md` for `--rev=N`).

**Always-emitted companion:**

- `handoff-implementation.md` — paste-ready prompt for any coding agent (Claude Code / Cursor / Codex / Opus / Gemini / GPT). Stack auto-detected from repo (frameworks → that stack; no framework → pure HTML/CSS/Vanilla JS, single index.html). Motion stack from `brand/DESIGN.md` (silent → GSAP+ScrollTrigger+Lenis). Carries verbatim Asset Placeholder Rule so coding agents never invent stock-photo URLs.

**Optional companions per `target_handoff`:**

- `handoff-claude-design.md` — verbatim prompt block for claude.ai/design
- `handoff-figma.md` — design spec for Figma designer
- `handoff-designer.md` — narrative brief for human designer

**Per-slot artifacts** (written by downstream `brief-graphic`, not by brief-landing-page itself):

- `asset-slots/{slot-id}.prompt.md`. Slots with `route: pending-media-skill` have no prompt yet — implementation prompt renders them as solid-color placeholders until a future media-briefing skill catches up.
