# Platform Specs

> Loaded by `platform-format-agent` and `interaction-storyboard-agent`. Canonical hard rules per surface. When a surface's published rules change, update here and bump the `version` field in `SKILL.md` metadata.

---

## App Store (iOS / iPadOS / Mac / tvOS / visionOS / Android)

### Length

| Platform | Min | Max | Recommended |
|---|---|---|---|
| iOS | 15s | 30s | 18-25s |
| iPadOS | 15s | 30s | 18-25s |
| Mac | 15s | 30s | 18-25s |
| tvOS | 15s | 30s | 18-25s |
| visionOS | 15s | 30s | 18-25s |
| Android (Google Play) | 30s | 120s | 30-60s |

### Aspect ratio

| Platform | Aspect | Minimum resolution |
|---|---|---|
| iOS portrait | 9:16 | 1080×1920 (device-native preferred) |
| iPadOS | 4:3 or 3:4 | 1200×1600 (device-native preferred) |
| Mac | 16:10 or 16:9 | 1920×1200 or 1920×1080 |
| tvOS | 16:9 | 1920×1080 |
| visionOS | 16:9 widescreen | 3840×2160 |
| Android | 16:9 or 9:16 | 1080×1920 (vertical) / 1920×1080 (landscape) |

### Audio

- Audio-on by default
- System tap / haptic-style sound effects permitted
- Background music permitted but should not dominate
- Voiceover permitted; descriptive, present tense; same restrictions as captions apply
- Mute-friendly design recommended — App Store autoplays muted in many contexts; captions carry the message

### Forbidden in captions / OST / VO

Per App Store Review Guidelines § Metadata + § Marketing:

- Performance claims ("saves X hours," "Y% faster," "Z× better")
- Comparative superlatives ("best," "fastest," "most powerful," "easier than X")
- Competitor names as contrast
- Pricing references (prices change; App Store handles pricing)
- Forward-looking promises ("you'll save," "guaranteed," "transform your")
- Mentions of platform APIs as if they're features (e.g., "uses CoreML" without showing the feature)
- Third-party platform UI (e.g., showing iMessage, Mail, Settings other than the relevant Settings panel)
- Hardware capability claims that misrepresent (e.g., showing the app running on a device it doesn't support)
- User-generated content that isn't representative

### Safe areas

| Platform | Top | Bottom | Sides |
|---|---|---|---|
| iOS portrait | 60px (status bar) | 120px (home-bar gesture region) | 0 |
| iPadOS | 80px | 80px | 80px |
| Mac | 80px (menu bar) | 60px | 60px |
| tvOS | 120px | 120px | 160px |
| visionOS | 240px | 240px | 240px |
| Android | 80px | 100px (gesture nav) | 0 |

### Caption band defaults

- iOS portrait: bottom 1/4 (≈ 480px on a 1920-tall canvas), 120px above home-bar
- iPadOS: bottom 1/5, 80px above safe area
- Mac / tvOS / visionOS: bottom 1/5 OR baseline-with-product-shot
- Android: bottom 1/4, 100px above nav

---

## Onboarding (in-app)

### Length

| Format | Length |
|---|---|
| Single card | 3-8s |
| Carousel (≤5 cards) | 3-5s per card, ≤25s total |
| Full-screen first-run video | 15-30s |

### Aspect ratio

| Format | Aspect |
|---|---|
| Card overlay | 1:1 or 9:16 (matches host card) |
| Full-screen first-run | 9:16 (mobile) or 16:9 (tablet/desktop) |
| Bottom-sheet tutorial | 16:9 or 4:3 (matches sheet aspect) |

### Audio

- **Audio-off by default.** In-app autoplay almost always mutes.
- Plan the brief assuming the viewer can't hear it.
- Captions carry the entire message.

### Forbidden

- External brand references (other apps, third-party logos)
- "Tap to continue" overlays that compete with the host card's own CTA
- Marketing pitch language — onboarding is teaching, not selling

### Caption band

- Bottom-center, 80px above card edge
- Caption-band visible against the card's surface — sample card background luminance for legibility

---

## Website (landing-page hero, feature-section loop, docs embed)

### Length

| Format | Length |
|---|---|
| Hero loop | 12-30s (must loop cleanly) |
| Feature-section loop | 20-60s (loopable) |
| Docs embed | up to 3min (non-looping OK) |
| Above-fold autoplay | ≤15s to first compelling beat |

### Aspect ratio

| Format | Aspect |
|---|---|
| Hero desktop | 16:9 or 21:9 ultrawide |
| Hero mobile | 9:16 or 1:1 |
| Feature section | 16:9 or 4:3 |
| Docs embed | 16:9 |

### Audio

- **Audio-off by default.** Modern browsers block autoplay-with-sound; embeds open muted.
- Captions carry the message.
- Optional unmute control is the embed's responsibility, not the brief's.

### Loop discipline

- Final frame must visually match the opening so the loop joins seamlessly
- A 0.5-1s settle into the loop's opening state at the end
- No abrupt cuts at the loop boundary

### Caption band

- Bottom-left or center-baseline, 96px from container edge
- Web embeds often have a play/sound chrome overlay — avoid bottom-center

---

## Social (TikTok / Reels / Shorts / LinkedIn)

### Length

| Platform | Length |
|---|---|
| TikTok | 9-30s (preview surface); 60s+ permitted but viewers churn |
| Reels | 9-30s |
| Shorts | 9-30s |
| LinkedIn | ≤90s; 15-30s recommended for product previews |

### Aspect ratio

| Platform | Aspect |
|---|---|
| TikTok | 9:16 (1080×1920) |
| Reels | 9:16 (1080×1920) |
| Shorts | 9:16 (1080×1920) |
| LinkedIn | 1:1 (1080×1080) or 4:5 (1080×1350) |

### Audio

- **Audio-on by default.** Social viewers often have sound on (especially for product demos).
- Even so: captions are required (mute-friendly; algorithmic captioning may force them anyway).

### Forbidden

- Watermarks from other platforms (TikTok blocks TikTok-watermarked content as "not native")
- Generic stock-style transitions (zoom-in / glitch / etc.) that read as repurposed content
- Captions that look like TikTok / Reels native captioning when they're actually overlay text — risk of confusion with algorithmic captioning

### Caption band

- Vertical: center-vertical, upper-third bias
- TikTok / Reels: avoid bottom 240px (UI chrome)
- LinkedIn: bottom 1/4 OK; LinkedIn's chrome is lighter

### Platform UI reservation zones (TikTok/Reels/Shorts canonical)

For a 1080×1920 canvas:

| Region | Pixel band | Reserved for |
|---|---|---|
| Top status / nav | 0-200px | platform UI (status bar, follow button, sound link) |
| Right sidebar | 950-1080 × 600-1700 | likes / comments / shares column |
| Bottom UI | 1700-1920 | username / caption / sound info |
| Center-safe | 0-1080 × 240-1700 (avoiding right sidebar) | the brief's content |

---

## Cross-surface invariants

These apply regardless of surface:

1. **No performance claims, no comparative superlatives, no forward-looking promises in any text.** Inherited from App Store policy because briefs may be repurposed.
2. **Source UI styling preserved.** Colors, radii, typography, spacing — all from the source or DESIGN.md.
3. **Captions are beat-scoped, ≤6 words, hold ≥2s.**
4. **Pointer is suggestive (solid-circle / cursor-arrow) — never a realistic hand.**
5. **First-second hook satisfied.** The opening frame reads in ≤1s for social/app-store; ≤2s for website/onboarding.

---

## Version

Spec version: 2026-05 — based on published platform documentation as of mid-2026. When a platform updates its preview spec, update the affected section and bump this date.
