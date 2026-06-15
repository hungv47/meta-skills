<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Worked Example — OG Image for an Async-First PM Tool Launch Post

> End-to-end design-brief walkthrough — Pre-Dispatch (hard gate + Cold Start) → Step 0.5 Route Detection → Layer 1 parallel → Layer 1.5 brief-synth → Approval Gate 1 → Layer 2 prompt-craft → Layer 3 critic → Approval Gate 2 → artifact + ASSETS.md tick.

[EXAMPLE] — load on first-time skill-author orientation or when reviewer needs to ground-check a dispatch decision.

For 4 additional asset-type walkthroughs (IG carousel, YouTube thumbnail, OOH billboard, template-pack), see [`../examples.md`](../examples.md).

---

## Setup

**User request:** "Make me an OG image for our launch blog post on async-first project management."

**Context resolvable from artifacts:**
- `brand/BRAND.md` present (Async-PM brand: archetype = the Sage, voice = direct + technical)
- `brand/DESIGN.md` present (primary palette: deep-indigo `#1A1B3A` + signal-amber `#FFB547`; type: Söhne Buch + JetBrains Mono)
- `brand/ASSETS.md` present with row `og-images/blog-async-launch.png — [ ] [ ]` (path match candidate)
- `docs/forsvn/artifacts/marketing/content/blog-async-launch.copy.md` present (headline: "Stop managing chaos, start leading progress.")
- `docs/forsvn/artifacts/marketing/campaign-plan.md` present (PLG, async-first launch, 60-day window, Pillar 1 "The meeting tax")

---

## Hard gate (pre-Cold-Start)

Orchestrator checks:
- `brand/BRAND.md` ✓
- `brand/DESIGN.md` ✓
- Stale check: both updated 2026-04-30 (18 days ago) — within 60-day freshness window. No warning.
- `brand/ASSETS.md` ✓ — found path-match candidate row `og-images/blog-async-launch.png`. Pre-fill enabled; will auto-tick on DONE.

Hard gate passes. Proceed to Warm Start.

---

## Warm Start

```
Hard gate passed: brand/BRAND.md + brand/DESIGN.md present.
Found:
- asset spec → "OG image for launch blog post" (matched campaign-plan Pillar 1)
- copy → "Stop managing chaos, start leading progress." (from write-copy artifact)
- ASSETS.md row → matched og-images/blog-async-launch.png

Auto-detecting downstream route from asset type. Override or proceed?
```

User: "Proceed."

---

## Step 0.5 — Route Detection

Orchestrator picks:

> "Downstream route: image-gen (photographic OG image). Target tool: midjourney-v6 (editorial mood; brand's Sage archetype maps to long-form editorial photography). Override with `--route=` if needed."

Pulls `references/platform-modules.md` → `og-image` module:
- Aspect: 1.91:1
- Dimensions: 1200x630
- Safe zone: 80px from edges (Facebook/LinkedIn crop)
- Type scale: ≥48px headline minimum (LinkedIn feed thumb-stop)
- Contrast: WCAG AA on headline / image overlay
- Format: PNG or JPG; sRGB
- Size cap: ≤8MB
- Anti-patterns: Centered headline over centered subject; default purple-blue gradient backdrop

User stays silent past 2s → dispatch Layer 1.

---

## Layer 1 — Parallel Foundation

Three agents dispatch in parallel:

### brand-anchor-agent returns

```
Brand digest:
- Primary palette: deep-indigo #1A1B3A (anchor), signal-amber #FFB547 (accent)
- Typography: Söhne Buch 48-72px headline; JetBrains Mono 14px caption (if applicable)
- Sacred elements: logo bottom-right with 32px clear-space; primary palette anchor never replaced; "Async-PM" wordmark never modified
- Motion: not applicable (static OG image)
- Voice: direct + technical (Sage archetype); avoid breathless language ("revolutionary", "game-changing")
```

### concept-agent returns 3 distinct concepts

```
A. Editorial calm
- Photographic, 50mm, soft natural light, indigo-cast shadows
- Subject: empty conference room from low angle, late golden hour through window
- Mood: "the meeting just ended; you got 8 hours back"
- References: New Yorker editorial photography; Apollo Magazine
- Why this: Sage archetype + Pillar 1 ("meeting tax") visualized as absence-of-meeting
- Risk: empty rooms can read "stock corporate" if lighting goes wrong

B. Geometric flat
- Vector / illustration, isometric workspace tile composition
- Indigo backdrop, signal-amber highlight on one calendar-block being subtracted
- Mood: "this is what your week looks like, minus the chaos"
- References: Tom Whalen geometric infographics; Susan Kare iconography
- Why this: typographic friendly (overlay copy lands clean), single highlight matches single-takeaway design pattern
- Risk: pushes toward vector-tool route — if image-gen, AI may default to Corporate Memphis (anti-pattern #5)

C. Architectural minimalism
- Photographic, 35mm, harsh midday light, ultra-clean composition
- Subject: a single open door in a brutalist hallway, perspective-symmetric
- Mood: "the path through the chaos"
- References: Andreas Gursky; minimalist architectural photography
- Why this: Sage archetype + visual metaphor of pathway/clarity; high contrast holds at OG preview size
- Risk: may read "luxury real estate" if subject choice drifts; needs prompt-craft to anchor in workplace context
```

### copy-anchor-agent returns

```
In-asset copy:
- Headline (mandatory): "Stop managing chaos, start leading progress."
- Position: bottom-left, 80px from edges (within safe zone)
- Type token: Söhne Buch 56px (above 48px floor)
- Contrast pair: white text on indigo overlay (#1A1B3A @ 70% opacity)
- Brand mark: bottom-right, 32px clear-space (sacred element honored)
- No CTA in OG image (per platform module — OG images carry headline + brand only, not CTA)
```

---

## Layer 1.5 — brief-synth-agent

Merges anchor + 3 concepts + copy + route (image-gen) + platform module + asset request. Returns 3 candidate briefs, each with concept name + visual direction + hierarchy + platform spec + copy placement + failure modes.

---

## Approval Gate 1 — Brief Selection

Orchestrator STOPs and presents:

```
## Brief Candidates

### A. Editorial calm
Photographic, 50mm, soft natural light, indigo-cast shadows. Empty conference room from low angle, late golden hour through window. Headline overlay bottom-left, Söhne Buch 56px, white on indigo 70% opacity.
**Why this:** Sage archetype + Pillar 1 ("meeting tax") visualized as the absence of a meeting; editorial photography reads as on-brand.
**Risk:** empty rooms can read "stock corporate" if lighting goes wrong.

### B. Geometric flat
Vector / illustration, isometric workspace tile composition. Indigo backdrop with signal-amber highlight on one calendar-block being subtracted. Headline overlay bottom-left, Söhne Buch 56px.
**Why this:** typographic friendly (overlay copy lands clean), single highlight matches single-takeaway design pattern.
**Risk:** pushes toward vector-tool route — if we stay on image-gen, AI may default to Corporate Memphis aesthetic (anti-pattern #5).

### C. Architectural minimalism
Photographic, 35mm, harsh midday light, ultra-clean composition. A single open door in a brutalist hallway, perspective-symmetric. Headline overlay bottom-left, Söhne Buch 56px.
**Why this:** Sage archetype + visual metaphor of pathway/clarity; high contrast holds at OG preview size.
**Risk:** may read "luxury real estate" if subject choice drifts; needs prompt-craft to anchor in workplace context.

**Pick one (A/B/C), request revisions, or specify your own direction.**
```

User: "A."

Orchestrator: "Proceeding with Editorial calm. Dispatching prompt-craft-agent for Layer 2."

---

## Layer 2 — prompt-craft-agent (image-gen route)

Returns image-gen prompt block:

```
**Primary prompt (midjourney-v6):**
An empty corporate conference room photographed from a low angle, late golden hour sunlight streaming through floor-to-ceiling windows on the left, creating long shadows with subtle indigo cast across a polished wood conference table. Empty chairs pushed in, no people. Composition: rule-of-thirds, the empty table dominates the lower two-thirds, sunlit windows fill the upper-left third. Mood: editorial calm, "the meeting just ended." Style: editorial photography, New Yorker / Apollo Magazine aesthetic, 50mm lens, shallow depth of field, natural color grading with slight warm-shadow / cool-highlight contrast. --ar 1.91:1 --style raw

**Variant 1:** Same composition, late blue-hour twilight instead of golden hour, indigo dominates the color palette, signal-amber accent only from a single desk lamp far in the back.

**Variant 2:** Tighter crop — close-up of a single empty chair and corner of the conference table, golden hour light, same mood.

**Post-processing note:** Overlay headline "Stop managing chaos, start leading progress." in Söhne Buch 56px white over indigo (#1A1B3A) 70%-opacity rectangle in the bottom-left, 80px from both edges. Brand wordmark bottom-right, 32px clear-space. Export as PNG sRGB, ≤8MB.
```

---

## Layer 3 — critic-agent

Returns:

```
## Rubric Scores

| Dimension | Score (/4) | Notes |
|-----------|-----------|-------|
| 1. Brand fidelity | 4 | Palette traces (indigo #1A1B3A anchor + signal-amber accent in V1); typography uses Söhne Buch from DESIGN.md; Sage archetype reflected in editorial photography style. |
| 2. Sacred respected | 4 | Logo bottom-right with 32px clear-space honored; primary palette anchor preserved; "Async-PM" wordmark unmodified. |
| 3. Hierarchy | 3 | Focal point on the sunlit windows; headline lands at bottom-left as secondary; brand mark tertiary. Could push focal harder by darkening the conference table foreground. |
| 4. Composition | 4 | Rule-of-thirds explicit; balanced asymmetry; intentional white space (the empty table). |
| 5. Typography | 4 | Söhne Buch 56px above 48px floor; white on indigo 70% overlay reads clean. |
| 6. Contrast | 4 | WCAG AA passes for white-on-indigo-70% (ratio ~7.1:1). |
| 7. Format fit | 4 | 1.91:1 aspect, 1200x630 dimensions, headline within 80px safe zone, file format PNG sRGB. |
| 8. CTA clarity | N/A | OG images carry no CTA per platform module. |

**Subtotal:** 27/28 (Typography + CTA N/A handled per rubric).

## Generic-AI-Aesthetic Detector

| Pattern | Score (0-3) | Evidence |
|---------|-------------|----------|
| Default purple-blue gradient | 0 | Indigo is brand-specified, not default gradient. |
| Centered isolated subject on white | 0 | Off-center composition, room-context backdrop. |
| Stock 3D / faux-3D bevels | 0 | Photographic — no 3D bevels. |
| Faux-glass / glassmorphism (uninvited) | 0 | Solid indigo overlay, not glass. |
| AI-uncanny photo (hands, text, faces) | N/A | No people in composition. |
| Corporate Memphis / Alegria | 0 | Photographic, not illustration. |
| Vaporwave default (purple/pink/cyan) | 0 | Indigo + amber palette, no vaporwave. |
| Generic isometric tech illustration | 0 | Photographic. |
| Neon outlines on dark / Linear-clone | 0 | No neon outlines. |
| Abstract blob shapes | 0 | No blobs. |
| Sora-smooth motion (Veo only) | N/A | Static. |
| AI-vocal artifacts (Suno only) | N/A | Visual-only. |
| Generic-Suno melody-default | N/A | Visual-only. |

**AI-aesthetic total:** 0/27 (10 applicable patterns × 3).

**Threshold:** 0-7 → Clean. PASS available.

## Verdict Rationale

PASS. Brand fidelity 4, all sacred respected, format-fit 4, AI-aesthetic 0. Hierarchy at 3 is a minor concern — could push focal harder by darkening the table foreground in post — but does not block delivery.

## Concerns to Monitor

1. Hierarchy: focal point is currently soft. If render reads as "two competing focal points (windows + table)", iterate prompt with "darkened foreground table" deviation.
```

Critic verdict: **PASS**. Proceed to Approval Gate 2.

---

## Approval Gate 2 — Brief Acceptance

Orchestrator STOPs and presents:

```
## OG Image — Async Launch — Design Brief — image-gen

**Concept:** Editorial calm
**Critic:** PASS
**Score:** 27/28 + AI-aesthetic 0/27

[Brief preview — Concept, Brand Anchors, Platform Spec, Hierarchy, Copy Placement, Failure Modes to Avoid, Image-Gen Prompt Block]

**Concern to monitor:** Hierarchy at 3/4. Render may read as two competing focal points (windows + table). If so, iterate prompt with "darkened foreground table" deviation.

**Approve to write artifact, revise, or reject.**
```

User: "Approve."

Orchestrator:
1. Writes `docs/forsvn/artifacts/marketing/design-briefs/og-blog-2026-05-18-async-launch.md` with the assembled brief.
2. ASSETS.md auto-tick: literal path match found (`og-images/blog-async-launch.png` row); flips `[ ]` → `[x] 2026-05-18`.
3. Status: **DONE**.

---

## Cycle-2 FAIL hypothetical

If critic had returned FAIL (AI-aesthetic 17/27 — render leaned heavily into default golden-hour-glow + glass-window-reflection trope), orchestrator would:

1. Re-dispatch prompt-craft-agent with critic feedback: "Reduce default golden-hour glow signature. Anchor the lighting in a specific real-world reference (e.g., 'late-afternoon Vermeer window light, indigo shadows like Wright Morris photography'). Avoid generic glass-window reflections."
2. prompt-craft returns revised prompt.
3. Re-dispatch critic.
4. Cycle 2 PASS (AI-aesthetic 5/27) → proceed to Approval Gate 2.
5. If cycle 2 FAIL → deliver as DONE_WITH_CONCERNS with critic notes in artifact frontmatter; user can manually iterate or invoke `create-brand` to enrich DESIGN.md with explicit photography-style guidance.

---

## --fast variant snippet

Same setup. User invokes `/brief-graphic --fast`:

1. Hard gate ✓ (fires regardless of `--fast`).
2. Cold Start ✓ (fires regardless of `--fast` — but warm start applies here, so just one-line confirm).
3. Step 0.5 ✓ (route detection runs).
4. Layer 1 collapsed to single inline pass — orchestrator inlines brand-anchor pull + picks 1 concept (Editorial calm by default — first concept in concept-agent's list) + resolves copy.
5. Layer 1.5 produces 1 brief instead of 3.
6. Approval Gate 1 SKIPPED (no choice).
7. Layer 2 prompt-craft still runs (handoff block is contract).
8. Layer 3 critic single-pass (no rewrite loop on FAIL).
9. Approval Gate 2 fires (user acceptance non-optional).
10. On Approve → artifact + ASSETS.md tick.

Skill ends with: "Ran in --fast mode; rerun without the flag for 3-concept variety at Gate 1 + critic rewrite loop."

---

## Route C snippet — design-brief called by lp-brief

When `brief-landing-page` is producing a landing-page brief and needs a per-asset brief for the hero slot:

1. lp-brief invokes design-brief with: "Need brief for hero asset slot, image-gen route preferred, slot spec at `docs/forsvn/artifacts/marketing/brief-landing-page/async-launch-lp/asset-slots/hero.md`."
2. Orchestrator reads slot spec → extracts asset type + dimensions + copy placement + brand-anchor pre-fills.
3. Hard gate passes (brand artifacts already loaded by lp-brief, but design-brief verifies independently).
4. Warm Start: 4 of 5 dimensions resolved from slot spec; only constraint Q remains (asks lp-brief's orchestrator inline).
5. Layer 1 + 1.5 + Gate 1 + Layer 2 + Layer 3 + Gate 2 all run as standard.
6. Artifact written at `docs/forsvn/artifacts/marketing/design-briefs/lp-async-launch-hero-2026-05-18.md` with `consumed: [docs/forsvn/artifacts/marketing/brief-landing-page/async-launch-lp/asset-slots/hero.md]` in frontmatter.
7. lp-brief consumes the design-brief artifact path back at its own Approval Gate.
