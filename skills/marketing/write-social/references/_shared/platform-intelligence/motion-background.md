<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: motion-background
schema_version: 2
pack_type: asset-format
last_verified: 2026-06-16
verifier: hungv47
status: reviewed
source_basis: "Per-claim categorical citations inline (web-perf + motion-design + accessibility practice). Format/perf numbers are practitioner standards; tagged accordingly."
summary: "Motion-background playbook: subtle, looping, brand-anchored motion that earns attention without stealing it — seamless loop, <2–4s cycle, performance-budgeted (file size + CPU), and a hard prefers-reduced-motion fallback."
---

# Platform Intelligence — Motion Background (asset format)

Practitioner-grade reference for **looping motion backgrounds** — the animated hero/section backdrops
behind landing pages, app shells, and social cover frames. Consumed by `brief-graphic`,
`produce-asset`, `produce-video`, and the launch chains. The job of a motion background is to add
*life* without stealing attention from the content or the CTA — it is a supporting actor, never the lead.

The brand's own visual constraints are load-bearing here: **honor the brand's surface treatment
(matte vs glossy), gradient/color rules, canvas, and accent discipline as set in `brand/BRAND.md`.**
A motion background that violates the brand is off-brand motion, however technically nice.

When `last_verified` exceeds 90 days, re-verify the perf budgets + accessibility expectations.

---

## 1. Attention Angles (Hook Taxonomy, reframed for an asset)

How a motion background earns *just enough* attention. Min 3.

### Angle 1 — Ambient drift (slow, continuous, hypnotic)

- **Definition:** Very slow continuous motion (gradient mesh drift, particle float, gentle parallax)
  that reads as "alive" but never resolves to a focal event — the eye relaxes, the content leads.
- **Identifying signal:** No discrete event; motion speed low enough you can't "catch" a frame; loop seamless.
- **Best for:** landing hero behind a headline + CTA; app empty states.

### Angle 2 — Reveal loop (a single satisfying micro-event)

- **Definition:** One subtle event per cycle (a line draws, a shape completes, a wave passes) that
  rewards a glance but resolves and resets cleanly.
- **Identifying signal:** A 2–4s cycle with one beat; loop point invisible.
- **Best for:** product feature sections; "how it works" backdrops.

### Angle 3 — Data/texture motion (brand-material in motion)

- **Definition:** The brand's own texture or motif (e.g., a topographic contour, grain, or a
  brand-specific motif from `brand/BRAND.md`) animated subtly — motion that *is* the brand, not generic.
- **Identifying signal:** Recognizably on-brand material; no stock-looking generic gradient blob.
- **Best for:** brand-forward heroes where the background carries identity.

---

## 2. Format Constraints

| Constraint | Value | reference |
|---|---|---|
| Loop length | 2–8s, **seamless** (no visible cut at loop point) | motion practice |
| Motion speed | slow — content must remain the focal point | UX practice |
| File size (video) | aim <2–3 MB for web hero (compressed h.264/h.265 or webm) | web-perf |
| Format | `<video>` muted/autoplay/loop/playsinline, OR CSS/Canvas/SVG for lightweight | web-perf |
| Poster frame | always set a poster (first painted frame) for no-JS / slow load | web-perf |
| CPU/GPU | budget for low-end devices; avoid heavy per-frame JS | web-perf |
| Contrast | text over it must clear WCAG AA (overlay/scrim if needed) | a11y |
| **Reduced motion** | **honor `prefers-reduced-motion`** — show a still poster, no animation | a11y (hard) |
| Aspect | match the container; provide a mobile crop (don't letterbox a hero) | UX practice |

---

## 4. Anti-Patterns

| Pattern | Penalty | Detection | Source |
|---|---|---|---|
| Motion that competes with the CTA | lower conversion; eye leaves the button | a focal moving event near the CTA | UX practice |
| Visible loop seam | reads cheap; breaks the "alive" effect | a jump/cut at the loop point | motion practice |
| No `prefers-reduced-motion` fallback | accessibility failure; nausea/vestibular harm | animation plays regardless of the OS setting | a11y (hard) |
| Heavy file / jank | slow LCP, dropped frames on mobile | >3 MB hero video or per-frame JS thrash | web-perf |
| Off-brand AI gradient | off-brand per the brand's gradient/surface rules (e.g. no purple/blue gradients, no glass — if the brand forbids them) | generic purple/blue blur, frosted panel | brand |
| Autoplay with sound | instant bounce; browser-blocked | audio track on a background | UX practice |

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** design the loop to be *felt, not watched* — slow, seamless, brand-material
motion under a high-contrast content layer, with a still poster as the reduced-motion + fallback truth.

| # | Step | Concrete action | Success marker |
|---|---|---|---|
| 1 | Pick the angle | ambient drift / reveal loop / brand-material (§1), matched to the section's job | motion supports, doesn't lead |
| 2 | Anchor to brand | use brand canvas + ≤10% accent; no off-brand gradient/glass | passes a brand glance test |
| 3 | Design the loop | 2–8s, one beat max, seamless loop point | no visible seam on repeat |
| 4 | Layer for contrast | scrim/overlay so headline + CTA clear AA | text legible on the busiest frame |
| 5 | Budget performance | compress to <2–3 MB; set a poster; cap CPU | LCP unaffected; no jank on mobile |
| 6 | Reduced-motion fallback | still poster when `prefers-reduced-motion: reduce` | no animation for users who opted out |
| 7 | Ship the manifest | `produce-asset` emits the render-ready spec + poster + fallback | one asset, three states (loop/poster/reduced) |

---

## 7. CTA / Conversion Norms

| Placement | When it works | When it fails | Source |
|---|---|---|---|
| CTA in a still, high-contrast zone over the motion | motion frames it, doesn't touch it | CTA sits in the moving region | UX practice |
| Motion draws the eye *toward* (not away from) the CTA | directional drift toward the button | motion pulls the eye to a corner | motion practice |
| Static poster as the conversion-critical frame | the still already sells before play | relies on the loop to make the point | web-perf |

---

## 8. Open Questions / Known Unknowns

- Exact conversion impact of motion vs static heroes is context-dependent; A/B it per page (no universal lift).
- Per-device CPU budgets vary; the <2–3 MB / no-per-frame-JS rule is a heuristic, not a guarantee on low-end mobile.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-16 | Initial pack to the v2 contract (asset-format). | hungv47 |
