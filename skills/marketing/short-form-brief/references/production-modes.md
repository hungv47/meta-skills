# Production Modes

Live-action vs. motion-graphic templates. Production-mode-agent picks the resolved mode and outputs the matching template; storyboard / audio / platform-tailor agents fill it.

---

## Mode Selection Rule

| Brand mode | Production mode default |
|---|---|
| founder | internal |
| company | internal |

Override only with explicit angle reason (e.g., founder-mode demoing a screen-only product → motion-graphic).

`mixed` is intentional — usually founder intro (live-action) + product demo (motion-graphic) + founder close (live-action). Don't default to `mixed` because you can't decide.

---

## Live-Action Production Notes Template

Storyboard agent fills these per shot:

### Talent
- Founder / specific person / contractor brief
- Wardrobe (per shot if it changes)
- Eye-line direction (camera / off-camera / interview)

### Location
- Specific room / studio / outdoor
- Lighting condition (kitchen / desk / window-lit / studio strobe)
- Backdrop continuity (consistent or intentional change)

### Gear must-haves
- Camera body recommendation (phone, mirrorless, DSLR)
- Lens (focal length range)
- Mic (shotgun / lavalier / handheld)
- Lighting (natural / softbox / ring / key+fill)

### Props
- Physical items in frame
- Product specimens, tools, gestures
- Anything talent interacts with

### Talent direction
- Pacing (conversational / slow-deliberate)
- Energy (warm / urgent / authoritative)
- Eye-line (camera / over-shoulder / off-camera)
- Movement (static / pacing / sitting / standing)

### Audio capture
- Mic technique
- Room treatment
- VO recorded separately or sync sound

---

## Motion-Graphic Production Notes Template

Storyboard agent fills these per scene:

### Style
- Vector flat / 3D / mixed-media / kinetic-type / hand-drawn / collage
- Reference style (with examples if BRAND.md has any)

### Asset list
- Logo treatments (sizes, lockups needed)
- Product UI (specific screens, with annotations if zooming)
- Character / illustration assets (if any)
- Background plates / textures
- Icon set (custom or from a system)

### Motion principles
- Easing curves (ease-in-out for organic, linear for mechanical)
- Anticipation (slight reverse before main motion)
- Follow-through (overshoot, secondary animation)
- Squash + stretch (for character/cartoon)
- Timing rhythm (beat-matched cuts vs. continuous flow)

### Brand color tokens
- Hex codes from BRAND.md
- Palette use rules (which colors for what)

### Type system
- Fonts from BRAND.md
- Weights, sizes, scale
- Animation rules per text style (stamp / fade / typewriter / kinetic)

---

## Mixed Mode Template

When live-action and motion-graphic alternate within one piece:

### Segments
- Live-action timing windows (e.g., "0:00-0:08, 0:18-0:24")
- Motion-graphic timing windows (e.g., "0:08-0:18")
- Total length

### Transition principle
- Match-cut (visual element bridges live → motion)
- Dissolve (soft transition)
- Hard-cut (jump-cut)
- Frame-match (live-action frame mirrors first motion-graphic frame composition)

### Audio continuity
- Music bed continues across segments
- VO may bridge (live VO continues into motion-graphic) or split (separate VO per segment)

---

## Common Configurations

### Founder-mode TikTok talking head (live-action only)
- MCU eye-level, kitchen-lit
- Phone or mirrorless on tripod
- Lavalier or shotgun mic
- 1-2 props max (laptop, mug, notebook)
- Single take preferred; B-roll cutaways inserted in edit

### Company-mode product launch (motion-graphic only)
- Vector-flat or 3D style per BRAND.md
- Product UI screenshots (annotated)
- Logo + brand colors prominent
- Synced kinetic type for key claims
- Music-bed-driven (no VO or minimal VO)

### Mixed: Founder explainer with product demo
- 0:00-0:08 — live-action founder hook (MCU)
- 0:08-0:20 — motion-graphic product walkthrough (UI screens + annotations)
- 0:20-0:26 — live-action founder close + CTA (back to MCU)
- Transitions: match-cut on gesture (founder gestures toward product → motion-graphic of product)

---

## Anti-Patterns

- **Defaulting to mixed** without specific structural reason
- **Founder-mode motion-graphic** without override note
- **Empty asset list** in motion-graphic mode — storyboard can't fill what isn't categorized
- **Live-action with no gear notes** — producer can't shoot
- **Motion-graphic with no brand color tokens** — designer doesn't know which palette
