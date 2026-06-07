<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Asset Types — Format Specs

Per-asset format reference: dimensions, safe zones, file format, copy length caps. Used by concept-agent (feasibility check), brief-synth-agent (spec), and critic-agent (format-fit scoring).

When ASSETS.md provides a row, ASSETS.md wins. This is the fallback for assets not in the brand inventory.

---

## Social — Instagram

### Feed post (square)
- **Dimensions:** 1080 × 1080 px
- **Aspect:** 1:1
- **Safe zone:** 60px from each edge
- **Format:** PNG / JPG, sRGB, ≤30 MB
- **Copy caps:** Headline ≤8 words, body ≤30 words per slide

### Feed post (portrait)
- **Dimensions:** 1080 × 1350 px
- **Aspect:** 4:5
- **Safe zone:** 60px from each edge
- **Format:** PNG / JPG, sRGB, ≤30 MB
- **Copy caps:** Headline ≤8 words, body ≤30 words per slide

### Carousel
- **Dimensions:** 1080 × 1350 px (portrait) or 1080 × 1080 (square) — match across all slides
- **Slides:** 2–10 (sweet spot 6–8)
- **Safe zone:** 60px from each edge; outer 80px on first slide for in-feed crop
- **Format:** PNG (preferred for type-led) / JPG (for photo-led), sRGB
- **Copy caps:** ≤12 words per slide, ≤4 words per "title" slide

### Story
- **Dimensions:** 1080 × 1920 px
- **Aspect:** 9:16
- **Safe zone:** 250px top + 250px bottom (UI overlap with handle, sticker shelf, action bar)
- **Format:** PNG / JPG / MP4, sRGB
- **Copy caps:** Headline ≤6 words

### Reels (vertical video)
- **Dimensions:** 1080 × 1920 px
- **Duration:** 15–90s
- **Safe zone:** Same as Story — 250px top + 250px bottom
- **Format:** MP4, H.264, sRGB
- **Copy caps:** First-frame text ≤6 words

---

## Social — LinkedIn

### Single image post
- **Dimensions:** 1200 × 627 px (recommended) or 1200 × 1200 (square)
- **Safe zone:** 80px from each edge
- **Format:** PNG / JPG
- **Copy caps:** Caption ≤150 chars before "see more" cut

### Carousel (PDF)
- **Dimensions:** 1080 × 1350 px (portrait, best engagement) or 1080 × 1080
- **Slides:** 6–12
- **Format:** PDF (LinkedIn carousels are PDF uploads, not slide groups)
- **Copy caps:** ≤30 words per slide

### Cover image
- **Dimensions:** 1128 × 191 px (company page)
- **Safe zone:** 60px from edges (logo overlay area on top-left)
- **Format:** PNG / JPG

### Event banner
- **Dimensions:** 1600 × 900 px (16:9) `[verify — no dedicated LinkedIn spec page; secondary-sourced]`
- **Safe zone:** logo/headline in center ~70% (≈1120 × 630); lower third overlaid by the event metadata card
- **Format:** PNG / JPG, ≤8 MB

---

## Social — Facebook (Ads)

### Feed ad (single image / carousel card)
- **Dimensions:** 1080 × 1350 px (4:5, recommended) or 1080 × 1080 (1:1)
- **Safe zone:** 60px from edges; image renders un-overlaid — Sponsored label above + headline/CTA bar below come from ad setup (don't bake a button in)
- **Format:** JPG / PNG, sRGB, ≤30 MB (compress ≤1MB for feed load)
- **Copy caps (ad setup, not creative):** primary text ~125 chars before "…more", headline ≤27 chars, description ~30 chars `[verify — Meta drifts]`

### Story ad
- **Dimensions:** 1080 × 1920 px (9:16)
- **Safe zone:** Mar-2026 unified — top ~14% (≈270px) + bottom ~20% (≈384px, larger than organic 250) + 6% sides `[verify — Meta drifts]`
- **Format:** PNG / JPG / MP4 (H.264), sRGB

---

## Social — X / Twitter

### Single image
- **Dimensions:** 1200 × 675 px (16:9 in-feed); 1200 × 628 px for the `summary_large_image` link/OG card (X crops to ~1.91:1) — see platform-modules.md
- **Aspect:** Up to 16:9; 4:5 also crops well in-feed
- **Format:** PNG / JPG / WebP
- **Copy caps:** Tweet ≤280 chars

### Multi-image (2–4)
- Each image 1200 × 675 px; X auto-crops to a grid

---

## Social — TikTok

### Vertical video / image
- **Dimensions:** 1080 × 1920 px
- **Aspect:** 9:16
- **Safe zone:** 100px top + 280px bottom (UI overlap with caption, profile, action bar)
- **Format:** MP4 / PNG (for static image-as-video)
- **Copy caps:** First-frame text ≤6 words

---

## OG / Social Share Image (Open Graph)

- **Dimensions:** 1200 × 630 px
- **Aspect:** 1.91:1
- **Safe zone:** 60px from edges
- **Format:** PNG / JPG, sRGB, ≤500 KB (Twitter cuts off larger files)
- **Copy caps:** Headline ≤8 words (often shown smaller in feed previews)

---

## Web — Hero / Header

### Desktop hero
- **Dimensions:** 1920 × 1080 px (or designed-for-fold; site-specific)
- **Aspect:** 16:9 typical
- **Format:** WebP (preferred) / PNG / JPG, sRGB

### Mobile hero
- **Dimensions:** 750 × 1334 px (or breakpoint-matched)
- **Aspect:** 9:16 typical
- **Format:** WebP / PNG / JPG, sRGB

---

## Display Ads — Common Sizes

| Format | Dimensions | Use |
|--------|-----------|-----|
| Medium rectangle | 300 × 250 | Standard banner |
| Large rectangle | 336 × 280 | Above-the-fold display |
| Leaderboard | 728 × 90 | Header banner |
| Skyscraper | 160 × 600 | Sidebar |
| Wide skyscraper | 300 × 600 | Sidebar tall |
| Mobile banner | 320 × 50 | Mobile in-app |
| Large mobile banner | 320 × 100 | Mobile prominent |
| Billboard | 970 × 250 | Premium top placement |
| internal | 300 × 600 | Sidebar premium |

**File caps:** ≤150 KB for HTML5, ≤40 KB for static. Display Ad spec varies by network.

---

## YouTube

### Thumbnail
- **Dimensions:** 1280 × 720 px (16:9)
- **Safe zone:** 80px from each edge (timestamp overlay bottom-right)
- **Format:** JPG / PNG, ≤2 MB
- **Copy caps:** ≤5 words, large bold display type

### Channel banner
- **Dimensions:** 2560 × 1440 px (full); desktop shows ~2560 × 423, TV the full 2560 × 1440
- **Safe zone (all devices):** 1546 × 423 px centered — all load-bearing content (logo, name, CTA) must fit here (it's what mobile shows)
- **Format:** PNG / JPG (GIF/BMP also accepted), ≤6 MB

---

## Email — Hero / Banner

### Hero image
- **Dimensions:** 600 × 300 px (delivers crisp on retina; max width across most clients)
- **Format:** PNG / JPG (some clients block WebP)
- **File cap:** ≤200 KB
- **Note:** Email clients often block images by default — design as IMAGE_BLOCKED-aware (no critical text in images). Author at 1200px wide, constrain to 600 for 2× retina. Avoid WebP (unsupported in several clients). Dark mode varies (Apple Mail inverts hard, Outlook barely, Gmail partial) — plate logos to survive inversion.

### Subject line + preview text
- **Subject:** ≤50 chars (mobile cutoff)
- **Preview:** ≤90 chars

---

## Print — Common

### Business card (US)
- **Dimensions:** 1050 × 600 px @ 300dpi (3.5 × 2 in)
- **Bleed:** 1062 × 612 (1/16" each side)
- **Format:** PDF (CMYK, 300dpi)

### A4 flyer
- **Dimensions:** 2480 × 3508 px @ 300dpi (210 × 297 mm)
- **Bleed:** 5mm each side
- **Format:** PDF (CMYK, 300dpi)

### Billboard (varies by spec)
- **Dimensions:** spec-dependent (commonly 14 × 48 ft = 4032 × 1152 px @ 7dpi viewing distance)
- **Format:** PDF (CMYK print / RGB digital DOOH, low-DPI for size)
- **Copy cap:** ≤7 words (read at distance + speed)

### Magazine ad (full page / spread)
- **Dimensions:** 300 DPI at trim, CMYK; common single trim 8.125 × 10.875 in (~2438 × 3263 px), spread 16.25 × 10.875 in (~4875 × 3263 px) `[verify — trim is per-publication]`
- **Bleed / safety / gutter:** bleed 0.125 in min (0.25 pref); live matter 0.25–0.5 in inside trim; spread gutter 0.75–1 in (keep faces/logos off the fold)
- **Format:** press-ready CMYK PDF/X, fonts embedded/outlined, ≥300 DPI

### Transit poster
- **Dimensions:** interior car card ~11 × 28 in (height ~11.125 in); exterior King ~30 × 144 in, King Kong ~54 × 248 in (market-dependent) `[verify — varies by transit authority]`
- **Read distance / copy:** interior ~3–10 ft (long dwell → more copy OK); exterior ~20+ ft in motion (glance-media); min type ~38pt / ⅜ in, pref 50–60pt
- **Format:** CMYK PDF, fonts outlined, vendor die-line with bleed

---

## App Store / Play Store — Screenshots

### iOS App Store (iPhone 6.5")
- **Dimensions:** 1290 × 2796 px (or specified resolution per device)
- **Format:** PNG, sRGB

### Google Play
- **Dimensions:** 1080 × 1920 px (phone) or 1920 × 1080 (landscape)
- **Format:** PNG / JPG, sRGB
- **Copy on screenshot:** ≤8 words

---

## Cross-Platform Notes

- **sRGB always** for screen unless designing print (CMYK).
- **DCI-P3** only for Apple-ecosystem assets where the brand uses a wider gamut deliberately (rare; document in DESIGN.md).
- **Always design for mobile first** for social — most consumption is mobile.
- **Safe zones are non-negotiable** — text or CTAs in unsafe zones get cropped.

---

## File Naming Convention

```
{brand-or-project}-{asset-type}-{platform}-{purpose}-{date}.{ext}

Examples:
forsvn-og-blog-standups-killed-2026-04-26.png
forsvn-carousel-ig-pricing-tiers-2026-04-26.pdf
forsvn-hero-web-home-2026-04-26.webp
```

If ASSETS.md provides a path, use that path verbatim — it's the source of truth.

---

## Auto-Detection — Asset Type → Default Downstream Route

The orchestrator auto-picks a brief's `downstream_route` from its asset type using
this table. Override with `--route=image-gen|vector-tool|designer-handoff|template-pack`.

| Asset Type | Default Route | Why |
|-----------|--------------|-----|
| OG image / blog hero / ad photo | image-gen | Generative gives photo/illustration diversity |
| Instagram carousel (typographic) | vector-tool | Vector + multi-slide layout |
| Instagram carousel (image-led) | image-gen (per slide) | Generate slides, assemble |
| Instagram post / story | image-gen or vector-tool | Depends on photo vs typographic |
| LinkedIn document post | vector-tool | Multi-slide typographic |
| LinkedIn single-image | image-gen or vector-tool | Depends on photo vs typographic |
| FB / display banner (text-heavy) | vector-tool | Vector text + crop variants |
| FB / display banner (visual-led) | image-gen | Generate visual, overlay text |
| YouTube thumbnail | image-gen | Photo-based + bold text overlay |
| YouTube channel banner | vector-tool or designer-handoff | Brand furniture, multi-device safe area |
| X/Twitter card | image-gen or vector-tool | Depends on photo vs typographic |
| LinkedIn event banner | image-gen or vector-tool | Depends on photo vs typographic |
| OOH / billboard / transit / print / magazine spread | designer-handoff | Print-grade, needs human designer + vendor/publication die-line |
| Email hero | image-gen or vector-tool | Depends on photo vs typographic |
| Hero illustration (custom) | image-gen or designer-handoff | Generative or human-designer |
| Spot icon / decoration | vector-tool | Vector |
