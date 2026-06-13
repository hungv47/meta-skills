# Storyboard Grammar

Shot classification, camera grammar, and continuity rules for the storyboard agent. Mined from inference-skills/storyboard-creation reference (skills.sh) — adapted for short-form video.

---

## Shot Classification

| Tag | Name | Definition | Function in short-form |
|---|---|---|---|
| **ECU** | Extreme close-up | Detail shot — eyes, hands, product detail fills frame | Emphasis, emotional punch, detail reveal |
| **CU** | internal | Subject's face fills frame | Connection, reaction, intimate framing |
| **MCU** | Medium close-up | Head + shoulders | Talking-head default; founder-mode standard |
| **MS** | Medium shot | Waist up | Slightly more context; gestures visible |
| **MLS** | Medium long shot | Full body | Action visible — walking, demonstrating |
| **LS** | Long shot | Subject in environment | Establishing context, showing scale |
| **WS** | Wide shot | Full environment | Sets scene, reveals space |
| **EWS** | Extreme wide shot | Landscape / large architecture | Establishing shot, dramatic scale |

**Default in short-form:** MCU (medium close-up) for talking-head founder content. Vary to ECU/MS for emphasis and visual interest.

---

## Camera Grammar (Eye-Line + Framing)

| Setup | Effect | When to use |
|---|---|---|
| **Eye-level** | Neutral, conversational | Default for founder mode, informational content |
| **Low-angle** (camera below subject) | Power, dominance | Confidence claims, contrarian takes |
| **High-angle** (camera above subject) | Vulnerability, smallness | Emotional confessions (rarely in marketing) |
| **Dutch angle** (tilted) | Disorientation, off-balance | Pattern interrupts, problem framing |
| **OTS POV** (over-the-shoulder, point-of-view) | Show what the subject sees | Demos, tutorials |

---

## Continuity Rules

### 180-Degree Rule
Once you establish a directional axis (e.g., subject facing right), don't cross it in the same scene. Crossing flips the audience's spatial sense and feels disorienting.

For talking-head: keep speaker's eye-line consistent across cuts.

### Match on Action
When cutting between two shots of the same action, the action should continue smoothly across the cut. E.g., subject reaches for laptop in MCU → cut to ECU of hand on laptop, action continues.

### Eyeline Match
If subject looks off-screen at something, the next shot should show what they're looking at, from a matching angle.

### J-cut and L-cut (audio-visual)
- **J-cut:** audio begins before video cuts to the new shot (smooths transitions)
- **L-cut:** audio continues after video cuts away (carries energy across the cut)

Used heavily in B-roll segments.

---

## Pacing per Platform

| Platform | Default cut frequency | Pattern-interrupt cadence | Notes |
|---|---|---|---|
| TikTok | every 2-4s | every 3-5s | Static MCU past 8s loses retention |
| Reels | slightly slower than TikTok | hold first 3s, then escalate | First 3s carries 50% drop-off risk |
| Shorts | every 3-5s | end on loop-friendly final frame | Loop rate weighted in ranking |
| X video | every 4-6s | matches angle | Less algorithmically governed |
| LinkedIn | every 5-8s | professional pacing | <90s optimal |

---

## On-Screen Text Choreography Rules

(Shared with caption-cta-rules.md — included here for storyboard integration)

These are production defaults, not hard spec — a producible departure is fine when the footage or brand justifies it.

| Default | Value |
|---|---|
| Lines per frame | Max 2 |
| Words per line | 3-5 |
| Duration per line | 2-4 seconds |
| Style | Bold sans-serif, white + 4pt black outline (or per BRAND.md) |
| Position rotation | Bottom 1/3 (default) → Center (emphasis) → Top safe area (variety) |
| Color highlight | Reserved for key terms — 1-2 per piece |

---

## Frame Composition Cheats

| Composition | When |
|---|---|
| **Rule of thirds** | Default for talking head — eye-line on upper third line |
| **Centered subject** | Direct address moments, contrarian claims, CTA frames |
| **Negative space** | When on-screen text needs room — speaker offset to one side |
| **Symmetry** | High-impact reveals, before/after splits |
| **Foreground / background layering** | B-roll cutaways, product demos |

---

## Storyboard Anti-Patterns

- **Single-framing entire piece** (all MCU). Loses retention; needs visual variation.
- **Vague action verbs.** "Show product" / "transition" / "cutaway" — fail. Specify what + how.
- **Missing timing blocks.** A shot without `0:XX–0:YY` isn't executable.
- **180-degree crossing without intent.** Disorienting unless deliberate.
- **No loop-friendly ending on Shorts.** Algorithm-fit FAIL.
- **Pattern interrupts every cut on TikTok.** Over-cutting; loses thread. Hold for 3-5s between interrupts.
