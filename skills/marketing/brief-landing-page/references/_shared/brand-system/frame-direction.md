<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: FRAME.md — Frame-Direction Spec
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: REFERENCE
---

# FRAME.md — Frame-Direction Spec

> The schema for `FRAME.md`: `DESIGN.md` translated **for the camera**. Read before any
> video, motion piece, or full-frame social asset. `FRAME.md` is what `produce-video` /
> `brief-shortform` consume so an agent composes for the screen instead of reaching for
> web-chrome defaults. Section grammar is registered in
> [`format-conventions.md`](format-conventions.md) "FRAME.md structure"; this file is the
> depth.

## Purpose

`DESIGN.md` answers *what the brand's atoms are* (the exact hex / font / motion values) and
`CREATIVE-DIRECTION.md` answers *how the world looks and feels*. Neither answers **how those
atoms behave inside a moving frame**: the safe areas a 9:16 reel must respect, the type size
that stays legible at arm's length on a phone, the duration a logo bumper holds. Agents that
skip this gap guess scale and reach for web breakpoints — the wrong mental model for the
camera. `FRAME.md` closes it: a frame-direction layer that takes the brand atoms as given and
specifies their behavior per delivery surface.

## Register-split rule (verbatim in spirit from `format-conventions.md`)

`FRAME.md` is **additive and token-referencing.** It names how `DESIGN.md` atoms behave in a
frame; **it never redefines a hex, font, or motion value.** When a value appears here it is
**quoted from `DESIGN.md`** (or from `CREATIVE-DIRECTION.md` for art-direction meaning), never
re-authored. **Atoms sacred; composition free; numbers from the script.**

Register split (never mix):

- **`DESIGN.md`** = exact atom values (the spec) — owns every hex, font, duration, easing.
- **`CREATIVE-DIRECTION.md`** = how the world looks and feels (art direction) — owns mood,
  light, scene meaning.
- **`FRAME.md`** = how those atoms behave in a moving frame (frame direction) — owns
  aspect-ratio grammar, safe areas, type-at-distance, on-screen pacing, bumper/lower-third
  layout. It assigns *frame behavior* to atoms it does not own.

A value FRAME.md introduces on its own (a new color, a font not in `DESIGN.md`, a motion
duration not permitted by `DESIGN.md §9`) is a register-split violation — see Anti-Patterns.

## Sections, in order

1. **At a glance** — blockquote: the delivery surfaces this brand ships (e.g. vertical reel,
   square post, landscape promo), the primary one, and the one frame rule that matters most
   ("text never enters the bottom 18%"). One line.
2. **Delivery surfaces & aspect-ratio grammar** — a table, one row per shipped aspect ratio
   (9:16 vertical · 1:1 square · 16:9 landscape, plus any the brand actually uses): ratio ·
   where it runs · **title-safe** zone · **action-safe** zone · platform chrome to avoid
   (caption/UI overlays). Title-safe = where headline/key type may live; action-safe = where
   any must-not-be-cropped element (logo, CTA, faces) must sit. Express safe areas as % insets
   from each edge, not pixels (resolution-independent). Only list ratios the brand ships;
   undeclared ratios MUST NOT appear (mirrors the platform-set equivalence rule).
3. **Type-at-distance** — how the `DESIGN.md §3` type scale maps to **on-screen legibility**,
   NOT web breakpoints. For each role (display / headline / body / caption) give the minimum
   **% of frame height** it must occupy to read at the surface's typical viewing distance
   (phone-in-hand ≈ arm's length; TV/landscape ≈ across-the-room). The font and weight are
   **quoted from `DESIGN.md §3`**; only the on-screen sizing rule is new here. State the floor
   ("body never below X% of frame height on 9:16") and the line-count ceiling per safe zone.
4. **Motion & pacing** — **references `CREATIVE-DIRECTION.md §9` (Motion & Pacing) and the
   `DESIGN.md §9` duration/easing scale; introduces no new durations or easings.** Adds only
   the frame-specific layer: shot/scene minimum hold time for readability (how long a line of
   type must stay on screen to be read), transition family allowed between shots, and the
   pacing feel per surface (a 9:16 reel cuts faster than a 16:9 promo). When a number is
   needed, it derives from the script (see §6), bounded by the `DESIGN.md` motion scale.
5. **Surface cues / bumper grammar** — intro/outro bumpers, lower-thirds, and the logo field,
   **referencing `CREATIVE-DIRECTION.md §13` (Surface Cues) for the per-surface one-liners.**
   Specify: intro/outro duration and what holds (logo lockup quoted from `DESIGN.md` mark
   rules), lower-third placement (within action-safe), and the logo field's clear-space +
   minimum on-screen size as a % of frame height. Layout and timing are new; the mark, type,
   and color are quoted, never redefined.
6. **Numbers come from the script** — the hard rule: concrete durations and element sizes are
   **derived from the shot list / VO timing**, not fixed web values. A bumper is "as long as
   the logo needs to register, within the `DESIGN.md` motion scale," sized to the safe area —
   not a hardcoded `2000ms` / `120px`. FRAME.md gives the *rules and bounds*; the *instances*
   come from the specific piece's script. A FRAME.md that hardcodes per-shot numbers with no
   script is over-specified — state the rule, let the producer fill the number.
7. **Anti-Patterns** — what betrays the frame direction (see below).
8. **Sources** — what this direction is derived from (`DESIGN.md` atoms,
   `CREATIVE-DIRECTION.md` art direction, the shipped exemplars it matches), making clear it
   is derived, not invented.
9. **Review Gate** — the standard human-review block (see `format-conventions.md` "Review Gate
   body block").

## Atoms sacred — anti-pattern callout

The one failure mode that makes FRAME.md dangerous instead of useful:

- ❌ **Redefining an atom for the frame.** Writing a new hex "because it reads better on
  video," a font swap "for legibility," or a motion duration outside the `DESIGN.md §9` scale.
  This forks the brand: the camera surface drifts from every other surface. **The atom is
  fixed; only its frame behavior is yours to specify.** If an atom genuinely doesn't work on
  the camera, that is a `DESIGN.md` change (re-run / refresh the design layer), never a quiet
  override in FRAME.md.
- ❌ **Reaching for web breakpoints.** `sm/md/lg`, `rem`, viewport-width media queries — the
  wrong model. The frame is sized by aspect ratio, safe area, and viewing distance, not by a
  responsive web grid.
- ❌ **Hardcoding per-shot numbers.** Baking a specific bumper length or caption size into the
  spec instead of stating the rule and bound. Numbers come from the script.
- ❌ **Declaring aspect ratios the brand doesn't ship.** Padding the surface table with ratios
  no piece uses — same defect as undeclared platforms in `BRAND.md`/`DESIGN.md`.

## Cross-stack note

FRAME.md is consumed by `produce-video` and `brief-shortform` by **canonical path + heading
match** (not by parsing frontmatter). Section headings here are load-bearing for that match;
changing a heading is a schema change that requires updating those callers atomically (per the
`format-conventions.md` "Cross-stack contract"). Absent FRAME.md → those skills degrade to
`DESIGN.md` + `CREATIVE-DIRECTION.md` tokens and record the degradation, exactly as in
[`../../references/_shared/realized-surface-grounding.md`](../../references/_shared/realized-surface-grounding.md);
they never fabricate frame direction.
</content>
</invoke>
