<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

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

---

## Social — X / Twitter

### Single image
- **Dimensions:** 1200 × 675 px (16:9)
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
- **Dimensions:** 2560 × 1440 px (full)
- **Safe zone (TV/desktop minimum):** 1546 × 423 px centered
- **Format:** PNG / JPG

---

## Email — Hero / Banner

### Hero image
- **Dimensions:** 600 × 300 px (delivers crisp on retina; max width across most clients)
- **Format:** PNG / JPG (some clients block WebP)
- **File cap:** ≤200 KB
- **Note:** Email clients often block images by default — design as IMAGE_BLOCKED-aware (no critical text in images)

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
- **Format:** PDF (CMYK, low-DPI for size)
- **Copy cap:** ≤7 words (read at distance + speed)

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
