# Interaction Grammar

> Loaded by `interaction-storyboard-agent` and `motion-spec-agent`. The canonical action-verb set, the caption-band rules, and the per-verb motion conventions that downstream `produce-video` expects.

---

## §1 — Action verb canonical set

Every beat uses one of these verbs. Custom verbs FAIL Critical Gate 3.

| Verb | Definition | Typical duration | Visible motion |
|---|---|---|---|
| **rest** | Affordance at rest; nothing in motion | 1-2s | None |
| **tap** | Pointer or finger presses; binary press | 0.5-1s | Pointer glyph + tap ripple |
| **drag** | Pointer moves with contact held; continuous | 1-2s | Pointer glyph follows a path |
| **scroll** | Viewport translates; user moves through content | 1-2s | Source pans within crop |
| **type** | Keyboard input; characters appear | Length matches input | Text appears character-by-character |
| **toggle** | Binary state flip | 0.3-0.5s | Component snaps between two states |
| **reveal** | New element appears (sheet, drawer, overlay, toast) | 0.3-0.6s | Mask expand OR component slide-in |
| **hold** | State sustains with visible internal motion | 4-6s | Internal motion (tide, counter, progress) required |
| **settle** | Animation ends; layout finishes | 0.3-0.5s | Final state crystallizes |
| **transition** | One screen leaves, another enters | 0.4-0.8s | Crossfade OR slide between screens |

**Composite escape hatch.** An interaction not covered by one verb may be decomposed into a **named composite** of the listed verbs (e.g., `pinch-zoom = drag + reveal`), with the decomposition stated wherever the composite is used. The verb set stays closed because each verb maps to a runtime scaffold primitive — composites stay renderable by decomposing into them. An undeclared custom verb still FAILS Critical Gate 3.

---

## §2 — Beat-verb pairings (canonical sequences)

Common verb sequences and what they prove. Use these to sanity-check the beat sequence at storyboard time.

### Sequence A: "Tap to engage"

```
rest → tap → reveal → settle
```

Proves: a control exists, the user invokes it, the feature engages, the result is reached. The classic 4-beat App Store preview.

### Sequence B: "Capture moment"

```
rest → type → settle
```

Proves: an input field, the user provides input, the input is captured. The classic onboarding "quick capture" demo.

### Sequence C: "Discover by scrolling"

```
rest → scroll → reveal → settle
```

Proves: a list / feed exists, the user scrolls, a specific item or state appears, the user settles on it.

### Sequence D: "Drag to organize"

```
rest → drag → settle
```

Proves: items can be reorganized, the user does it, the new order persists.

### Sequence E: "Mode switch"

```
rest → toggle → settle
```

Proves: a mode exists, the user switches it, the system reflects the new mode.

### Sequence F: "Sustained focus" (hold-driven)

```
rest → tap → reveal → hold → settle
```

Proves: an engagement primitive (timer, session, listening mode), the user starts it, the engaged state, the duration is real, the conclusion. The classic "feature with a duration" demo.

### Sequence G: "Navigate between screens"

```
rest → tap → transition → rest
```

Proves: a screen exists, a navigation control engages, the user travels, a new screen is reached. Use sparingly; transitions between resting screens often become "tour" sequences. Prefer Sequence A when the navigation IS the feature.

---

## §3 — Caption band rules

The band geometry is locked by `platform-format-agent` per surface. The appearance is specified by `motion-spec-agent`. These rules govern what's IN the band, not where the band lives.

### Copy constraints

- **6 words maximum per caption**
- **Hold duration ≥ 2 seconds**
- **One caption per beat** — never spanning beats
- **Beat-scoped, not feature-scoped** — the caption describes what *this beat* proves, not what the feature does for the user's life
- **Describes what this beat shows** — "Tap to begin a surge" not "Will save you time" / "The fastest focus tool"
- **No performance claims** — no "saves X hours," no "Y% faster," no "Z× better"
- **No comparative superlatives** — no "best," "fastest," "most"
- **No competitor names**
- **No pricing references**
- **No forward-looking promises** — no "you'll save," "guaranteed to," "you'll never again"

### Typographic constraints

- **Brand sans from DESIGN.md** when supplied — `DESIGN.md` `type.body-strong` or nearest
- **Platform-native fallback** when cold-start — SF Pro on iOS, Roboto on Android, Inter on web
- **Size:** caption-band readable at thumb-distance — typically 28-36px @ 1290px source width
- **Color:** `DESIGN.md` text token OR source-respecting white-on-dim / ink-on-paper based on backdrop luminance

### Animation constraints

- **Fade-in 0.2s ease-out** at the caption's hold start
- **Hold steady** for the caption's duration
- **Fade-out 0.15s ease-in** at the caption's hold end
- **Crossfade between captions over 0.2s** when one immediately follows another

### Position rules

- Caption band geometry is locked by `platform-format-agent` per surface (see `platform-specs.md` § per-surface Caption band defaults)
- Position within the band: center-left horizontally (left-to-right reading), baseline-aligned to the band's vertical center
- Never overlapping with active source UI affordances — if the band collides with a CTA in the source, raise the band 40px or move to bottom-left

---

## §4 — Pointer glyph rules

The pointer is the user's representation in the preview. It's suggestive — never realistic.

### Style per surface

| Surface | Platform | Pointer style | Size | Color default |
|---|---|---|---|---|
| app-store | iOS, iPadOS, visionOS, Android touch | solid-circle | 64px | DESIGN.md accent or white-with-shadow |
| app-store | Mac | cursor-arrow | 24px | black-with-white-outline |
| app-store | tvOS | focus-ring | matches focusable | DESIGN.md accent |
| onboarding | (touch surfaces) | solid-circle | 64px | DESIGN.md accent |
| website | desktop aspect | cursor-arrow | 24px | black-with-white-outline |
| website | mobile aspect | solid-circle | 64px | DESIGN.md accent |
| social | (universally mobile-viewed) | solid-circle | 64px | DESIGN.md accent |

### Tap ripple

When verb is `tap`:

- Radius 80px → 160px expansion over 0.3s
- Opacity 60% → 0% across the expansion
- Color: pointer color
- Easing: ease-out
- Triggers exactly at the moment of contact (the same frame as the source's interaction-start state)

### Drag path

When verb is `drag`:

- Pointer fades in 0.15s before drag begins
- Pointer follows path `start (x1, y1) → end (x2, y2)` (crop-relative pixels) at the source's animation duration (or 0.4-0.8s if unknown)
- Pointer fades out 0.15s after drag ends
- Optional dashed trail behind pointer at 30% opacity for clarity (use only if the drag direction is non-obvious)

### Pointer fade discipline

- Pointer appears at the start of an interaction beat (tap / drag / type) and disappears at the start of the result beat
- Never lingers into a result or settle beat
- Never appears in rest / reveal / hold / settle / transition beats unless the verb explicitly calls for it

---

## §5 — Per-verb motion conventions

How `motion-spec-agent` should default per verb. Override only when the source's animation calls for it.

### rest

- Mask: static (crop rectangle unchanged)
- Pointer: none
- Caption: optional, often the descriptive label of what's at rest
- Transition into next: crossfade-in-place 0.15s OR hard-cut depending on whether the next beat shares the crop

### tap

- Mask: static (same crop as the rest beat that preceded it — continuity in place)
- Pointer: solid-circle 64px (touch) or cursor-arrow 24px (desktop), tap ripple 0.3s
- Caption: usually `—` (the tap IS the caption)
- Transition: hard-cut to the result beat (the state change IS the cut)

### drag

- Mask: static OR pan if the drag follows scroll-like motion
- Pointer: visible throughout, follows path
- Caption: optional, describing the manipulation
- Transition: crossfade 0.2s to result beat

### scroll

- Mask: pan (the crop translates within the source) OR source-translates-within-mask depending on scaffold
- Pointer: none (scrolling is implicit at the source level)
- Caption: optional
- Transition: crossfade 0.2s to settled beat

### type

- Mask: static
- Pointer: none (keyboard input)
- Caption: usually `—` (the typed text IS the caption) OR a brief label
- Visible: characters appear at the source's animation rate, or 80-100ms per character
- Transition: hard-cut to result OR crossfade 0.15s

### toggle

- Mask: static
- Pointer: solid-circle at toggle's position, tap ripple, then disappears
- Caption: descriptive of the new state
- Transition: hard-cut at the toggle frame; 0.3s settle on the result

### reveal

- Mask: expand from the affordance rect to the revealed-element rect over 0.3-0.6s
- Pointer: none (the reveal is the effect of the prior tap beat)
- Caption: descriptive of what's revealed
- Transition: settle into the held / settled beat

### hold

- Mask: static (the crop holds)
- Internal motion: required — name the visible element that moves (counter, tide, progress, badge)
- Pointer: none
- Caption: descriptive of the sustained state
- Transition: crossfade 0.2s to next beat

### settle

- Mask: contract back to a focal rect OR static
- Pointer: optional, suggestive at the next-step affordance (not pressed)
- Caption: descriptive of the settled outcome
- Transition: end (settle-out 0.4s) OR continue to next sequence

### transition

- Mask: crossfade between source screens OR slide-in from edge matching the source's transition
- Pointer: visible only if the transition is user-initiated (tap-then-transition)
- Caption: descriptive of the destination, not the journey
- Transition: settle to the new resting state

---

## §6 — Common malformed sequences

These get caught at storyboard time. The named anti-pattern from `anti-patterns.md` is in parentheses.

- **`rest → rest → rest`** — zero interaction (AP-4 whole-screen tour)
- **`rest → reveal → settle`** — missing cause (AP-7 tour beat in disguise; the `reveal` has no preceding action)
- **`tap → tap → tap`** — repetitive presses without proof of consequence (AP-8 compound action smeared across beats)
- **`hold → hold`** — two consecutive holds without internal motion declaration (AP-9 dead time)
- **`tap+drag`** (single beat) — compound action (AP-8)
- **`transition → transition → transition`** — screen-hopping tour (variant of AP-4)
- **`type → type → type`** — typing across beats without a visible result; the type should be one beat with character-rate animation

---

## §7 — Cross-stack contract

This grammar is referenced by:

- `agents/interaction-storyboard-agent.md` § Domain Instructions → Techniques → Action verbs (canonical set)
- `agents/motion-spec-agent.md` § Domain Instructions → Techniques → Per-verb motion conventions
- `agents/critic-agent.md` § Gate 3 (Beat clarity)
- `references/format-conventions.md` § §6 — Interaction-verb canonical set
- `references/anti-patterns.md` § Cluster 3 — Beat Clarity

Schema changes (adding / renaming a verb) require atomic update of all six citations.
