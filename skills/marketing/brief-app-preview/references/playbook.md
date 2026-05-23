# Playbook — Why App-Preview Brief Exists

> Load this when teaching the skill to a new operator, deciding whether to run it at all, or when a video-brief request arrives and you must decide between `brief-shortform` and `brief-app-preview`.

---

## Core Question

> **"Could an editor open After Effects (or HyperFrames / Remotion) and ship this brief verbatim, with the result being recognized as a believable, native preview of *this specific product* on *this specific surface*?"**

`brief-app-preview` is the **screenshot-driven product-demo brief** skill. Its single job: turn supplied UI screenshots + a feature intent + a target surface (App Store / onboarding / website / social) into a production-ready brief that proves *one feature in action* through cropped UI beats — without the editor inventing UI to fill gaps.

---

## Why this skill exists at all

Five failure modes it prevents:

1. **Whole-screen tours.** "Show off the app" briefs produce videos that pan across the home screen, the menu, the settings. Each frame is decorative, none proves a feature. App Store viewers and onboarding card readers churn on this content within 2 seconds. Gate 2 forbids it.
2. **Invented UI.** When a brief lacks screenshots, the editor (or the LLM downstream) fills the gap by synthesizing components that don't exist in the product. The result looks like an AI demo, not the product. Gate 1 forbids it.
3. **Idle "establishing" beats.** "Beat 1: introduce the dashboard. Beat 2: zoom into a card." Beats without action waste seconds of a tight format. Gate 3 forbids them.
4. **Synthetic motion.** Generic short-form patterns (glow effects, neon gradients, "premium" overlays) destroy the believability of an app preview. The product UI IS the brand; the motion must preserve it. Gate 6 forbids synthetic additions.
5. **Surface mismatch.** A 45-second 16:9 preview submitted to an App Store iOS slot fails the upload step. A "professional" 60s onboarding card overruns the in-app autoplay budget. Captions that pitch performance ("save hours every week") fail App Store policy. Platform-format-agent's compliance check enforces.

The structural answer is the **5-item quality gate** (in `agents/critic-agent.md`) — every gate maps to a specific re-dispatch agent, and PASS is binary.

---

## Philosophy

App-preview is **proof, not pitch**. The viewer is deciding whether the product *exists, works, and does the thing*. A pitch promises; a preview demonstrates. Every beat must demonstrate; pitching belongs in the App Store description, the onboarding subtitle, the website's headline copy.

**Source-grounded, not source-inspired.** Screenshots are the contract. Crops select from sources; motion specs preserve sources; captions describe what's on source. There is no creative latitude to add UI that doesn't exist in the supplied files.

**Surface decides shape.** App Store policy, onboarding-card autoplay constraints, website-embed muting defaults, social aspect / captioning conventions — each surface is a different shape with different limits. The brief is locked to one surface per run. Re-invoke for a second surface; don't try to compose a brief that "could go anywhere."

---

## When NOT to use this skill

- **Generic short-form social video.** That's `brief-shortform`. App-preview is screenshot-driven product-UI proof. Short-form is angle-driven social-native content (live-action or motion-graphic) where the product is one element among many.
- **Rendering / publishing the video.** That's `produce-video` (export bundle) → operator's chosen runtime (HyperFrames / Remotion / AI CLI) → `publish-social`. This skill emits the brief; the brief becomes a bundle becomes a render.
- **Briefing a multi-feature onboarding walkthrough as one artifact.** The skill is 1 feature per brief. Multi-feature requests split into multiple briefs at intake.
- **Pre-launch (no UI yet).** No screenshots → `NEEDS_CONTEXT`. The skill is grounded; if there's nothing to ground in, there's nothing to brief.
- **Static visual assets (Instagram carousel, slide deck, blog hero image).** Those are `brief-graphic` territory. App-preview is motion.

---

## The distinction from brief-shortform

| Dimension | `brief-shortform` | `brief-app-preview` |
|---|---|---|
| **Input contract** | Angle + audience + platform mechanics from research-shortform | Screenshots + feature intent + target surface |
| **Output shape** | Hero brief + per-platform variants (TRUE recuts) | One brief + asset manifest + crop map + produce-video handoff |
| **Surface** | TikTok / Reels / Shorts / X / LinkedIn (social-native algorithms) | App Store / onboarding / website / social (product-demo contexts) |
| **Production mode** | Live-action OR motion-graphic OR mixed | UI-component-driven motion graphic, exclusively |
| **Action proof** | Hook + retention + audio + caption strategy per algorithm | Component-level interaction beats from real UI states |
| **Failure shape avoided** | AI-slop openers, generic founder/company tropes | Whole-screen tours, invented UI, synthetic glow |
| **Brand source** | BRAND.md voice + archetype | BRAND.md voice + DESIGN.md tokens (motion + caption preserve source UI styling) |
| **Number of features** | One angle, may show product briefly | One feature, fully proven |

Both skills can target a "social" surface — `brief-shortform` produces angle-driven content where product proof is one of many beats; `brief-app-preview` produces a vertical product-demo cutdown where the entire video is component-level UI proof of one feature. The OPERATOR picks based on whether the deliverable is angle-led (use `brief-shortform`) or UI-proof-led (use `brief-app-preview`). The routing `noneOf` clauses keep the heuristic router from confusing them.

---

## The 5-item quality gate

Lives in `agents/critic-agent.md` (canonical). Summary:

| # | Gate | Owned by re-dispatch |
|---|---|---|
| 1 | Screenshot grounding — no invented UI | intake-validator-agent / flow-slicer-agent |
| 2 | Component-level focal beats — no whole-screen tours | flow-slicer-agent |
| 3 | Beat clarity — one user-visible action per beat | interaction-storyboard-agent |
| 4 | Brand fidelity — source UI styling preserved | motion-spec-agent |
| 5 | Platform fit — surface compliance, OST policy clean | platform-format-agent |

PASS is binary. Max 2 rewrite cycles. After 2 FAIL cycles → deliver with concerns pinned (orchestrator decision, not critic).

---

## Four surfaces

| Surface | Use | Length | Aspect default | Audio default |
|---|---|---|---|---|
| **app-store** | iOS / iPadOS / Mac / tvOS / visionOS / Android App Store preview | 15-30s (iOS); 30-120s (Android) | 9:16 (iOS portrait); device-native otherwise | on |
| **onboarding** | In-app first-run card / overlay / carousel | 3-8s per card, ≤5 cards | matches host card (1:1 / 9:16 typical) | off |
| **website** | Landing-page hero loop, feature-section loop, docs embed | 12-60s loopable (≤3min for docs) | 16:9 desktop, 9:16 mobile-conditional | off |
| **social** | Vertical product-demo cutdown for one social platform | 9-30s (TikTok/Reels/Shorts); ≤90s (LinkedIn) | 9:16 (TT/Reels/Shorts); 1:1 or 4:5 (LinkedIn) | on |

One brief = one surface. Re-invoke for a second surface — the skill explicitly forbids "one brief that covers all four."

---

## Six hard gates (Critical Gates in SKILL.md)

These are the operator's contract before dispatch. They are not the critic's gates (which are the quality bar AFTER assembly).

1. Screenshots required, no invented UI.
2. One feature per brief.
3. Each beat proves one user-visible action or state change.
4. Whole-screen footage forbidden unless full-screen is the smallest meaningful unit (with justification).
5. Captions support the beat, not the feature.
6. Motion specs preserve source UI styling.

Hard gates fire at pre-dispatch (e.g., gate 1: missing screenshots → `NEEDS_CONTEXT`) and recursively during agent work (e.g., gate 6: motion-spec-agent's source-fidelity statement).

---

## History

This skill was introduced in the 2026-05-22 incremental-source-integration program (WS3). The motivation: existing video-brief skills (`brief-shortform`) covered angle-driven social-native content but had no surface for screenshot-driven, component-level product-demo briefs targeting App Store / onboarding / website / social-cutdown surfaces. The WS3 build follows this stack's multi-agent + critic + routing-sidecar standard. The 6-agent roster, 5-gate critic, 4-file artifact contract, and the strict screenshots-as-contract floor are unique to this skill.
