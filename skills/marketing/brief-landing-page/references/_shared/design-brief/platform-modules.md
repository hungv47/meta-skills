<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Platform Modules

> **Status: FULLY POPULATED.** Tranche 1 (core digital: Instagram ×4, LinkedIn ×2, X, OG, YouTube thumbnail, display-banner) and Tranche 2 (paid-ad-chrome + physical: linkedin-event-banner, facebook-feed-ad, facebook-story-ad, youtube-banner, email-hero, ooh-billboard, transit-poster, print-magazine-spread) are both filled with practitioner-grade specs. Tranche 2's volatile ad-chrome geometry, file caps, and shop-dependent physical specs carry `[verify]` / "confirm vendor media kit" flags per the convention below — those were verified against current primary/secondary sources where confirmable and flagged where they drift or are per-vendor, never fabricated.
>
> This file holds per-platform brief checklists. Every brief design-brief writes pulls a checklist from here for the asset's platform — aspect ratio, safe zones, mobile readability floor, contrast for thumb-stop, file format, file-size cap, color mode, and platform-specific anti-patterns. It is the **deep instrument**; `references/asset-types.md` is the **quick fallback table**.
>
> **Consistency rule (anti-drift):** dimension / aspect / safe-zone values here MUST match `references/asset-types.md` for the same surface. `platform-modules.md` *extends* asset-types with the depth fields asset-types lacks (mobile readability floor in px, thumb-stop WCAG ratio, color mode, paid safe-zone, per-platform anti-patterns). If you change a dimension in one file, change it in both in the same commit.
>
> **Verify convention:** fields that drift fast (exact file-size caps, current "Sponsored"/CTA ad-chrome pixel geometry, codec requirements) are tagged `[verify <YYYY-MM> — platform docs drift]` rather than asserted as current. Briefs that draw a still-`[verify]` field ship `done_with_concerns` with that field flagged. Do NOT fabricate a precise current cap to clear the flag — confirm against primary source first.
>
> **Readability-floor model (applies to all social canvases):** social assets are authored at a large canvas (e.g. 1080px wide) but render on a phone at ~390–430pt logical width — a scale of ~0.36–0.40×. To clear the Apple HIG ~11pt legibility minimum at render, body copy needs ≈ **30px in a 1080px canvas** (~11px rendered); comfortable is ≥ 36px. Headlines ≥ 60px. Floors below scale proportionally for smaller canvases.

---

## Module template (every platform module fills these fields)

```
## Platform: [name]

### Surface variants
[Sub-formats this platform supports.]

### Aspect ratio
[Per variant. Matches asset-types.md.]

### Pixel dimensions (recommended upload)
[Per variant. Matches asset-types.md.]

### Safe zones
[Where platform UI overlays the asset. Per variant.]

### Mobile readability floor
[Minimum text size in px at the authoring canvas (per the readability-floor model above). Headline floor, body-copy floor.]

### Thumb-stop contrast
[Minimum WCAG contrast ratio for the smallest text on its actual background. ≥ 4.5:1 baseline; higher on busy mobile feeds.]

### File format & size
[Recommended format per variant. File-size cap if enforced. Codec for video.]

### Color mode
[sRGB nearly always. DCI-P3 for richer iOS rendering. CMYK for print.]

### Brand-safe-zone (sponsored / boosted)
[For paid placements: where the "Sponsored" tag, CTA, and platform branding land — and how to avoid overlap.]

### Anti-patterns
[Things that land badly on this platform specifically.]
```

---

## Platform: instagram-post

### Surface variants
Feed single image — square (1:1) or portrait (4:5). Portrait is the default recommendation: it claims the most vertical feed real estate Instagram allows for a single image.

### Aspect ratio
Square 1:1; portrait 4:5.

### Pixel dimensions (recommended upload)
Square 1080 × 1080 px; portrait 1080 × 1350 px.

### Safe zones
60px from each edge for focal copy and logo. In-feed the image is shown near-full-bleed, but the **profile row + caption** sit below the image (no overlap), and the **3-dot menu** sits top-right of the post chrome (outside the image). Keep the bottom ~120px clear of critical copy on portrait — that band is closest to the like/comment/share action row in the scroll rhythm.

### Mobile readability floor
Body copy ≥ 36px in the 1080px canvas (portrait gives more room — use it); headline ≥ 64px. Single-image posts are read in <2s on scroll — one idea, large.

### Thumb-stop contrast
≥ 4.5:1 minimum for any text; target ≥ 7:1 for short overlay copy against photographic backgrounds (feed brightness + scroll motion erode perceived contrast). On a photo, use a scrim/plate behind text — never rely on the raw image.

### File format & size
PNG for type-led / flat-color; JPG for photo-led. sRGB. Hard cap `[verify 2026-06 — Meta drifts]`; historically ~30MB ceiling, but compress to ≤ 1MB for fastest feed load + best thumb-stop.

### Color mode
sRGB. (Instagram re-compresses on upload; oversaturated brand hues shift — pull saturation ~5% below the DESIGN.md value to survive compression.)

### Brand-safe-zone (sponsored / boosted)
Boosted feed posts add a "Sponsored" label above the image and a CTA button bar below it — both outside the image frame, so the image safe zone is unchanged. The CTA button text comes from the ad setup, not the creative; do not bake a fake button into the image.

### Anti-patterns
- Edge-aligned focal copy on portrait — the 4:5 crop is stable in feed but the grid-thumbnail crops to 1:1, clipping the top/bottom 135px. Keep anything that must survive the grid view inside the center 1:1.
- Tiny logo bottom-right at sub-floor size — invisible at render scale.
- Raw text on a busy photo with no plate — contrast collapses mid-scroll.

---

## Platform: instagram-carousel

### Surface variants
Feed carousel: cover slide + 1–9 supplementary slides (2–10 total). Sweet spot 6–8 slides. Square or portrait, **matched across all slides**.

### Aspect ratio
1:1 or 4:5 — must be identical on every slide (Instagram locks the carousel to the first slide's ratio).

### Pixel dimensions (recommended upload)
1080 × 1350 px (portrait, best engagement) or 1080 × 1080 px. Same on all slides.

### Safe zones
60px from each edge. On the **cover slide**, keep focal copy inside the center 1:1 region (outer ~135px top/bottom is clipped in the grid thumbnail) and leave ~80px clear on the right edge where the "swipe" affordance dots/arrow hint. Inner slides: 60px all sides.

### Mobile readability floor
Body ≥ 36px; slide headline ≥ 60px; cover hook ≥ 72px. Carousels are read slower than single posts — but the cover still must stop the scroll in <2s.

### Thumb-stop contrast
Cover slide ≥ 7:1 (it competes in-feed); inner slides ≥ 4.5:1 (already-committed reader). Consistent type/color system across slides so the set reads as one unit.

### File format & size
PNG (type-led carousels — most common) or JPG (photo-led). sRGB. Per-slide size modest (≤ 1MB/slide) for swipe responsiveness. Cap `[verify 2026-06 — Meta drifts]`.

### Color mode
sRGB. Keep the palette identical slide-to-slide — compression variance between a PNG cover and JPG inner slides can shift a brand hue; author all slides in the same format to avoid it.

### Brand-safe-zone (sponsored / boosted)
Same as instagram-post — Sponsored label + CTA bar sit outside the frame. Boosted carousels show the CTA only on the last slide's chrome; design the final slide as the CTA slide.

### Anti-patterns
- Slide ratio mismatch — one off-ratio slide letterboxes the whole carousel.
- No visual "continue" cue on the cover — readers don't know to swipe; add a partial-bleed element or arrow inside the safe zone.
- First slide does all the work, slides 2–N are filler — every slide must earn its swipe (this is the carousel analogue of brief-landing-page's "no filler section").

---

## Platform: instagram-story

### Surface variants
Story — full-screen vertical, ephemeral. Static image or short video. (Reels cover is a separate module.)

### Aspect ratio
9:16.

### Pixel dimensions (recommended upload)
1080 × 1920 px.

### Safe zones
**Top 250px** reserved (profile handle + close button), **bottom 250px** reserved (sticker tray, reply bar, link/CTA sticker). Keep ALL critical copy + CTA inside the center ~1080 × 1420 band. This is the most aggressive social safe zone — treat the reserved bands as unusable for anything load-bearing.

### Mobile readability floor
Story renders near-full-screen, so the effective scale is higher than feed — but it's on-screen for ~5s and auto-advances. Headline ≥ 60px; body ≥ 36px; keep total words low (≤ 6-word headline). One message per story frame.

### Thumb-stop contrast
≥ 7:1 — stories autoplay and the viewer's thumb is already on the "next" tap zone; the message has to land before they advance. Always plate text over video/photo.

### File format & size
PNG/JPG for static; MP4 (H.264) for video. sRGB. Static ≤ 1MB. Video cap + duration `[verify 2026-06 — Meta drifts]`.

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
Story ads add a bottom "Sponsored" + swipe-up/CTA chrome inside the lower band — which already overlaps the 250px bottom safe zone, so honoring the safe zone covers it. Do not place a CTA in the bottom 250px; the platform's CTA lives there.

### Anti-patterns
- Copy or logo in the top/bottom 250px — guaranteed UI collision.
- Designing a story as a cropped feed post — the 9:16 frame needs its own composition, not a 1:1 with bars.
- More than one idea per frame — stories auto-advance; a second idea is unread.

---

## Platform: instagram-reel-cover

### Surface variants
Reel cover image — the still that represents the reel both in the full-screen reel player (9:16) AND in the profile grid (the grid crops the cover to a tall portrait, historically ~1:1.25 / cover-grid crop). Design the cover so the focal element survives BOTH crops.

### Aspect ratio
Author at 9:16 (1080 × 1920) to match the reel; the grid applies a center portrait crop.

### Pixel dimensions (recommended upload)
1080 × 1920 px.

### Safe zones
Two overlapping zones: (1) the **player** reserves the bottom ~250–400px for caption/audio/action rail and the right edge for the action column — keep cover copy out of there; (2) the **grid crop** keeps roughly the center vertical band — keep the cover's title inside the center ~1080 × 1350 region so it survives the grid. Net: focal copy lives in the upper-center.

### Mobile readability floor
Cover title ≥ 72px (it must read as a thumbnail in the grid AND full-screen); ≤ 4 words.

### Thumb-stop contrast
≥ 7:1 — the cover competes in the reels feed and the profile grid simultaneously.

### File format & size
PNG/JPG, sRGB, ≤ 1MB. (The cover is a still; the reel video itself is out of scope for brief-graphic — route to a video brief.)

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
Promoted reels add the standard bottom CTA chrome — already inside the reserved bottom band.

### Anti-patterns
- A cover that only works full-screen and turns to mush in the grid (or vice versa) — test both crops.
- Title in the bottom third — eaten by the player's caption/action rail.
- Reusing the reel's busiest frame as the cover — pick or compose a clean, high-contrast frame.

---

## Platform: linkedin-single-image

### Surface variants
Feed single-image post — landscape (1.91:1) or square (1:1). Square claims more feed height on mobile and is increasingly preferred for B2B reach.

### Aspect ratio
1.91:1 (landscape) or 1:1 (square). [asset-types.md uses 1200 × 627 landscape / 1200 × 1200 square.]

### Pixel dimensions (recommended upload)
1200 × 627 px (landscape) or 1200 × 1200 px (square).

### Safe zones
80px from each edge (LinkedIn's feed chrome and reactions row are denser than Instagram's). The caption truncates at ~140 chars before "…see more" on mobile — front-load the hook in the caption, not just the image.

### Mobile readability floor
LinkedIn skews to a slightly larger render than Instagram (more desktop usage), but design mobile-first: body ≥ 32px in a 1200px canvas; headline ≥ 56px. B2B audiences tolerate more words than IG, but the image's job is still one idea.

### Thumb-stop contrast
≥ 4.5:1 minimum; ≥ 7:1 for overlay text on photos. LinkedIn's feed is comparatively text-heavy, so a high-contrast graphic stands out — lean on it.

### File format & size
PNG (type-led) / JPG (photo-led), sRGB. Cap `[verify 2026-06 — LinkedIn drifts]`; keep ≤ 2MB.

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
Sponsored single-image ads add a "Promoted" label above the post and a headline + CTA button bar below the image (pulled from ad setup) — both outside the image frame. Don't bake a button into the creative.

### Anti-patterns
- Treating LinkedIn like Instagram — over-stylized, low-information graphics underperform a clean, data-forward B2B graphic.
- Critical copy in the caption only, with a generic image — on LinkedIn the image is the scroll-stop; a stock-looking image gets scrolled past before the caption is read.
- Logo + 5 partner logos crammed at sub-floor size — pick the hierarchy.

---

## Platform: linkedin-doc-post

### Surface variants
Multi-slide PDF carousel (LinkedIn's "document" post). Uploaded as a **PDF**, not a slide group. 6–12 pages typical.

### Aspect ratio
Portrait recommended (best mobile engagement); square acceptable. Match every page.

### Pixel dimensions (recommended upload)
1080 × 1350 px (portrait) or 1080 × 1080 px per page, exported into one PDF.

### Safe zones
80px from each edge. LinkedIn renders the doc in an in-feed viewer with **page-nav chrome on the bottom edge** — keep the bottom ~100px clear of critical copy. The first page is the scroll-stop (it's the feed thumbnail); the last page is the CTA.

### Mobile readability floor
Body ≥ 34px; page headline ≥ 56px; cover hook ≥ 64px. Document posts are read slowly (in-feed page-flip), but the cover still must stop the scroll.

### Thumb-stop contrast
Cover ≥ 7:1; inner pages ≥ 4.5:1. One type/grid system across all pages.

### File format & size
**PDF** (single file, all pages). Embed fonts or outline type so it renders identically across devices. Keep total PDF ≤ 100MB `[verify 2026-06 — LinkedIn drifts]`; aim much smaller for fast in-feed load.

### Color mode
sRGB (it's a screen-viewed PDF, not print — do NOT export CMYK).

### Brand-safe-zone (sponsored / boosted)
Document ads exist; the Promoted label + CTA sit outside the viewer. The doc's own last-page CTA is the in-creative call to action.

### Anti-patterns
- Exporting CMYK or with un-embedded fonts — type substitutes or colors shift in LinkedIn's viewer.
- A cover page that doesn't signal "swipe/flip for more" — readers don't open it.
- Per-page word walls — the document format invites density, but mobile render punishes it; one idea per page.

---

## Platform: x-card

### Surface variants
X (Twitter) feed card. `summary_large_image` (large 1.91:1 card) is the default for shareable graphics; `summary` (small square thumbnail) for compact links. In-composer image posts use the same large-image dimensions.

### Aspect ratio
1.91:1 (`summary_large_image`); 1:1 (`summary`). [asset-types.md uses 1200 × 675 for in-feed images, which crops to ~1.91:1 in the card.]

### Pixel dimensions (recommended upload)
1200 × 628 px (`summary_large_image` card); 1200 × 675 px (in-feed image, 16:9, X crops top/bottom to the card ratio); 1200 × 1200 px (`summary`).

### Safe zones
Keep focal copy in the center — X crops large cards to ~1.91:1 and the **card title/domain bar renders below the image** (for link cards), so the image itself isn't overlaid, but multi-image posts auto-crop to a grid (keep each image's subject centered). 60px edge margin.

### Mobile readability floor
Body ≥ 34px in a 1200px canvas; headline ≥ 56px. X is fast-scroll + often dark-mode — high-contrast, low-word graphics win.

### Thumb-stop contrast
≥ 7:1 — X's feed is the fastest-scroll of the major platforms and the default is frequently dark mode. Test the graphic on BOTH a light and a dark feed background (a white-bg graphic floats fine on dark; a transparent-edge or dark-bg graphic can vanish on dark mode).

### File format & size
PNG / JPG / WebP, sRGB. File-size cap `[verify 2026-06 — X drifts]` — historically X compresses aggressively and has cut off large files for card previews; keep ≤ 1MB, and ≤ 5MB for in-feed.

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
Promoted posts add a small "Ad" / "Promoted" label and (for some objectives) a CTA button below the card — outside the image.

### Anti-patterns
- Dark-mode invisibility — a graphic with dark or transparent edges disappears on X's dark feed; bound it with a defined background.
- Authoring at 1200 × 675 and putting copy in the top/bottom 47px — the card crop to 628 clips it.
- Relying on the link-card title for the message — many users see only the image.

---

## Platform: og-share-card

### Surface variants
OpenGraph share card — the preview image when a URL is shared (LinkedIn, Slack, iMessage, Facebook, X fallback, etc.). One canonical size with per-platform crop tolerance.

### Aspect ratio
1.91:1 (the OG default that crops acceptably across the most consumers).

### Pixel dimensions (recommended upload)
1200 × 630 px.

### Safe zones
60px from edges. **Center-weight everything** — different platforms crop the 1.91:1 differently (some to ~1.91:1, iMessage/Slack to a near-square or rounded tile, X to its card ratio). Keep the logo + headline inside the center ~1000 × 524 region so they survive the tightest crop.

### Mobile readability floor
Headline ≥ 48px (OG cards render small in feed/preview — often ~300–500px wide); ≤ 8 words. Logo legible at ~120px wide render. This is the smallest-rendered surface in the set — over-size the type.

### Thumb-stop contrast
≥ 7:1 — OG cards render small and often on busy chat/feed backgrounds. Solid brand-color background + high-contrast type beats a photo here.

### File format & size
PNG / JPG, sRGB. **≤ 500KB** — several consumers (historically X) skip the preview or fail to render cards over the cap. This is a real, load-bearing constraint, not an optimization.

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
N/A — OG cards are organic share previews, not a paid placement.

### Anti-patterns
- Edge-aligned text — the cross-platform crop variance eats it; center-weight.
- A photo-only card with no headline/logo — the card has to carry the message AND brand attribution because the surrounding text is stripped or truncated in many share contexts.
- Over the 500KB cap — silent preview failure on some platforms; the link shares as a bare URL.
- Tiny type sized for the 1200px canvas, not the ~400px render — the #1 OG mistake.

---

## Platform: youtube-thumbnail

### Surface variants
Video thumbnail — 16:9, click-stop priority. Renders at many sizes simultaneously (sidebar ~168px wide, search ~360px, full ~1280px) — must read at the SMALLEST.

### Aspect ratio
16:9.

### Pixel dimensions (recommended upload)
1280 × 720 px (minimum width 640).

### Safe zones
80px from each edge. **Bottom-right ~120 × 60px is overlaid by the video duration stamp** — keep focal copy and faces out of it. The bottom edge is also overlaid by the progress bar on hover/watched videos.

### Mobile readability floor
Thumbnail text ≥ 90px in the 1280px canvas (it renders at ~168–360px wide in lists — text must survive a ~5× downscale); ≤ 4 words, heavy display weight. Faces and one bold word out-perform sentences.

### Thumb-stop contrast
≥ 7:1, ideally higher — the thumbnail competes against a wall of other thumbnails. Use a saturated background, a high-contrast subject cutout, and a stroked/plated word. Test at ~168px wide (sidebar) — if it's illegible there, it fails.

### File format & size
JPG / PNG, sRGB. **≤ 2MB** (YouTube's enforced thumbnail cap). 

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
In-stream/discovery ads render the thumbnail with an "Ad" badge + CTA chrome from ad setup, outside the image.

### Anti-patterns
- Tiny logo bottom-right — collides with the duration stamp AND is sub-floor at render scale.
- Text sized for the 1280px canvas — illegible at the 168px sidebar render; the #1 thumbnail failure.
- Low-contrast subject on a busy background — disappears in the thumbnail wall.
- Faces in the bottom-right — clipped by the duration stamp.

---

## Platform: display-banner

### Surface variants
IAB / Google Display Network standard sizes. The high-value set: medium rectangle 300 × 250, leaderboard 728 × 90, mobile leaderboard / large mobile banner 320 × 50 and 320 × 100, wide skyscraper 160 × 600, billboard 970 × 250, half-page 300 × 600. One creative concept must reflow across several of these aspect ratios.

### Aspect ratio
Per size — square-ish (300×250), wide (728×90, 970×250), tall (160×600, 300×600), mobile-strip (320×50, 320×100). The brief must specify the **reflow rule** (how the logo/headline/CTA rearrange between a wide and a tall slot), not just one layout.

### Pixel dimensions (recommended upload)
300×250, 336×280, 728×90, 970×250, 160×600, 300×600, 320×50, 320×100. (Author at 2× for retina where the network supports it.)

### Safe zones
Display ads render edge-to-edge inside their slot but sit in cluttered page contexts — keep a 10–16px internal margin so the ad reads as a bounded unit, and include a 1px border or defined background so it doesn't bleed into the host page. The CTA must be a visible button within the creative (unlike social, display has no platform CTA chrome).

### Mobile readability floor
Constrained by the smallest slots: in a 320×50 mobile banner, body type effectively floors at ~14–16px actual (there's no downscale — these render at native size). Headline ≥ 18–22px actual in small slots; the creative carries very few words (logo + 3–5 word headline + CTA).

### Thumb-stop contrast
≥ 4.5:1; ≥ 7:1 for the CTA button text. Banner blindness is real — contrast + a clear CTA button do the work.

### File format & size
Static: PNG / JPG (and AVIF/WebP where the network accepts it). Animated: HTML5. **Static ≤ 40KB, HTML5 ≤ 150KB initial load** is the long-standing IAB/GDN guidance `[verify 2026-06 — IAB/GDN limits drift; confirm the network's current LEAN/initial-load caps]`. Provide a static fallback for every animated unit.

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
The banner IS the paid placement — no platform overlay. But the network may render an "AdChoices" icon in a corner (commonly top-right ~16×16px); keep that corner clear of the logo.

### Anti-patterns
- One layout stretched to all sizes — a 728×90 leaderboard and a 160×600 skyscraper need different compositions, not a squashed copy.
- No CTA button — display has no platform CTA; the creative must carry it.
- Over the file-size cap — the unit gets rejected or down-ranked by the network.
- Non-AVIF/WebP photographic banners where supported — file-size penalty hurts load + viewability.
- AdChoices-corner collision (logo top-right) — clipped by the network overlay.

---

## Platform: linkedin-event-banner

### Surface variants
Event cover image for a LinkedIn Event page — the wide banner atop the event listing, shown in the events directory tile, on the organizer's page, and in feed invites/shares. One landscape surface; crops tighter on mobile.

### Aspect ratio
16:9.

### Pixel dimensions (recommended upload)
1600 × 900 px `[verify 2026-06 — LinkedIn publishes no dedicated event-banner spec page; 1600×900 / 16:9 is the consistent practitioner value across recent sources — confirm against the live event-creation upload UI]`. (Distinct from the company-page cover 1128 × 191 in asset-types.md — different surface; do not reuse those dims.)

### Safe zones
LinkedIn overlays the event title, date, and the RSVP/"Attend" control on or below the banner in several views, and crops the 16:9 tighter on mobile and in the directory tile. Keep the logo + any in-image headline inside the center ~70% (≈ 1120 × 630) and 80px off every edge; treat the lower third as likely-overlaid by the event metadata card.

### Mobile readability floor
Headline ≥ 56px in the 1600px canvas; ≤ 6 words. Renders small in the directory tile and feed invite — size for the tile, not the full event page.

### Thumb-stop contrast
≥ 4.5:1 baseline; ≥ 7:1 for any overlay text — the banner competes in a text-dense B2B feed and directory.

### File format & size
PNG (type-led) / JPG (photo-led), sRGB. Keep ≤ 8MB `[verify 2026-06 — LinkedIn drifts]`; aim much smaller for fast load.

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
Organic page asset, not a paid placement. If the event is later promoted, the Promoted label + CTA sit in ad chrome outside the banner — don't bake a fake RSVP button into the image; the platform renders the real one.

### Anti-patterns
- Reusing the 1128×191 company-page cover dims — wrong aspect; letterboxes or crops badly on the event surface.
- Title baked into the bottom third — collides with the overlaid event metadata card.
- Edge-aligned date/logo — clipped by the tighter mobile + directory-tile crop.

---

## Platform: facebook-feed-ad

### Surface variants
Feed single-image ad (and the per-card image of a feed carousel ad). Portrait (4:5) or square (1:1) — 4:5 claims the most mobile feed height Meta allows for a feed image.

### Aspect ratio
4:5 (recommended) or 1:1. [asset-types.md: 1080 × 1350 (4:5) / 1080 × 1080 (1:1) — same canvas as the Instagram feed surfaces.]

### Pixel dimensions (recommended upload)
1080 × 1350 px (4:5) or 1080 × 1080 px (1:1). Meta accepts higher-res uploads (e.g. 1440 × 1800) `[verify 2026-06 — Meta drifts]`; author at ≥ 1080px on the short edge.

### Safe zones
The image renders un-overlaid in feed, but the ad chrome brackets it: the **page name + "Sponsored" label sit above** the image and the **headline + description + CTA button bar sit below** it (all from ad setup, outside the image frame). Keep focal copy 60px off every edge. The CTA button is platform-rendered — do NOT bake a fake button into the creative.

### Mobile readability floor
Body ≥ 36px in the 1080px canvas; headline ≥ 60px. In-image text competes with the ad-setup headline below — keep the image to one idea.

### Thumb-stop contrast
≥ 4.5:1 minimum; ≥ 7:1 for overlay text on photos. Feed brightness + scroll motion erode perceived contrast — plate text over imagery.

### File format & size
JPG / PNG, sRGB. Historic ceiling ~30MB `[verify 2026-06 — Meta drifts]`; compress to ≤ 1MB for fast feed load. The 20%-text-overlay rejection rule is retired, but text-heavy creatives can still be **delivery-throttled** by the algorithm — treat heavy in-image copy as an anti-pattern, not a hard fail.

### Color mode
sRGB. (Meta re-compresses on upload; pull saturation ~5% below the DESIGN.md value so compression doesn't shift the brand hue.)

### Brand-safe-zone (sponsored / boosted)
This IS a paid placement. Ad-setup text fields carry their own caps that shape (and truncate) the chrome: primary text ~125 chars before "…more" on mobile, headline ≤ ~27 chars, description ~30 chars `[verify 2026-06 — Meta drifts]`. The creative carries none of these — they're set in Ads Manager. Front-load the hook in the primary text; don't rely on in-image copy alone.

### Anti-patterns
- Baking a fake "Shop Now"/"Learn More" button into the image — duplicates the real platform CTA and reads as amateur.
- Text-heavy creative — no longer auto-rejected, but algorithmically down-delivered; let the ad-copy fields carry the words.
- Critical message only in the ad-setup primary text behind a generic image — the image is the scroll-stop; a stock-looking image gets scrolled past before the copy is read.

---

## Platform: facebook-story-ad

### Surface variants
Story-format ad on Facebook/Instagram Stories — full-screen vertical, single image or short video, with platform CTA chrome. (Reels ads are a sibling surface with a deeper bottom reserve — see note.)

### Aspect ratio
9:16.

### Pixel dimensions (recommended upload)
1080 × 1920 px.

### Safe zones
As of **March 2026, Meta unified the Stories/Reels safe zone** into one rule set `[verify 2026-06 — Meta unified Mar 2026; figures are %-derived — confirm current pixels in Ads Manager]`: reserve the **top ~14% (≈ 270px)** (profile + "Sponsored" label), the **bottom ~20% (≈ 384px)** for Stories (CTA / label / swipe affordance), and **~6% (≈ 65px) per side**. Keep ALL headline + product + CTA-relevant copy inside the center band (≈ 1080 × 1266). This bottom reserve is **larger than the organic instagram-story 250px** — the ad CTA chrome takes more room. (Reels reserve the bottom ~35%; if the same creative also runs as a Reels ad, design to the tighter Reels band.)

### Mobile readability floor
Renders near-full-screen so effective scale is high, but it's on-screen ~5s and auto-advances. Headline ≥ 60px; body ≥ 36px; ≤ 6-word headline. One message per frame.

### Thumb-stop contrast
≥ 7:1 — stories autoplay and the thumb is already on the "next" tap zone. Always plate text over photo/video.

### File format & size
PNG/JPG for static; MP4 (H.264) for video. sRGB. Static ≤ 1MB. Video duration + file cap `[verify 2026-06 — Meta drifts]`.

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
This IS the paid placement — the bottom CTA + "Sponsored" chrome lives in the reserved bottom 20% band, so honoring the safe zone covers it. Don't place your own CTA there; the platform's lives there. Don't bake a fake swipe-up button.

### Anti-patterns
- Designing to the organic 250/250 story safe zone — the ad's bottom reserve is larger (~384px); a CTA placed at 250px collides with the ad chrome.
- One creative reused untrimmed across Stories AND Reels — the Reels bottom reserve (~35%) is deeper; design to the tighter band or supply a Reels variant.
- A cropped feed post letterboxed into 9:16 — stories need their own full-bleed composition.

---

## Platform: youtube-banner

### Surface variants
Channel banner ("channel art") — one image rendered at radically different crops across mobile, tablet, desktop, and TV. The same upload must work from a small mobile strip to a full-bleed TV screen.

### Aspect ratio
16:9 upload; each device center-crops to its own ratio.

### Pixel dimensions (recommended upload)
2560 × 1440 px. [Matches asset-types.md.] Device crops: **all-device / mobile-safe area 1546 × 423 px centered**; desktop shows ~2560 × 423; TV shows the full 2560 × 1440.

### Safe zones
**Everything load-bearing — logo, channel name, tagline, CTA — must sit inside the center 1546 × 423 px safe area.** That is the only region guaranteed on every device (it's what mobile shows). The outer area is decorative bleed only desktop/TV reveal; never put critical content there.

### Mobile readability floor
Within the 1546 × 423 safe area, channel name / headline ≥ 56px in the 2560px canvas; the safe area renders small on phones — keep words minimal (≤ 5).

### Thumb-stop contrast
≥ 4.5:1; ≥ 7:1 for text in the safe area against its background. The banner is brand furniture, not a scroll-stop, but must read on a phone.

### File format & size
JPG (photo-led) / PNG (type-led; crisp logo/text edges). GIF/BMP also accepted. sRGB. **≤ 6MB** (YouTube-enforced cap).

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
N/A — owned brand real estate, not a paid placement.

### Anti-patterns
- Critical content outside the 1546 × 423 safe area — invisible on mobile (the most common device); the #1 banner failure.
- A busy full-2560 composition that only resolves on TV — most viewers see only the center strip.
- Over the 6MB cap — upload rejected.

---

## Platform: email-hero

### Surface variants
Hero image at the top of a marketing email — single full-width image or image-with-overlay. Must degrade gracefully when images are blocked and survive dark-mode inversion.

### Aspect ratio
~2:1 (wide) typical; height is design-dependent — the email body width governs, not a fixed ratio.

### Pixel dimensions (recommended upload)
600px display width (600–640px is the safe cross-client body width); **author at 1200px wide and constrain to 600 in the HTML for 2× retina crispness.** [asset-types.md: 600 × 300; ≤ 200KB.] Hero height per design (commonly ~600 × 300).

### Safe zones
No platform UI overlay, but three rendering-environment constraints replace it: (1) **images are blocked by default in many clients** — no critical message, CTA, or legal text may live *only* in the image; mirror it in live HTML text + a descriptive `alt`. (2) **Outlook Classic (Word engine)** drops CSS background images without VML — don't rely on a background-image hero for Outlook-heavy lists. (3) **dark mode behaves three ways** — Apple Mail inverts aggressively, Outlook desktop barely changes, Gmail partially inverts some palettes — so design logos/buttons to survive inversion (a padded plate behind a logo; avoid pure-black/white-on-transparent marks).

### Mobile readability floor
Any in-image text ≥ 36px in the 1200px (2×) canvas so it survives the 600px constraint + small-phone render. Prefer live HTML text over baked-in text.

### Thumb-stop contrast
≥ 4.5:1 for in-image text; ≥ 7:1 if the text must survive dark-mode inversion shifts.

### File format & size
**PNG / JPG** (avoid WebP — several clients still don't render it). sRGB. **Target 100–150KB, ≤ 200KB** — large heroes slow load and trip spam heuristics. Always set a descriptive `alt`.

### Color mode
sRGB.

### Brand-safe-zone (sponsored / boosted)
N/A — owned channel, not a paid placement.

### Anti-patterns
- Image-only email (everything baked into one hero) — blocked-image clients show nothing + it trips spam filters; keep a healthy live-text-to-image ratio.
- Critical CTA only inside the image — invisible when images are blocked; render the CTA as a bulletproof HTML button.
- WebP hero — silent non-render in unsupported clients.
- Logo that vanishes on dark-mode inversion — plate it.

---

## Platform: ooh-billboard

### Surface variants
Out-of-home billboard — primarily the standard **bulletin (14 ft × 48 ft)**; also smaller in-town posters. Static (printed vinyl) or digital (DOOH). Read at distance and speed.

### Aspect ratio
~3.43:1 for the 14 × 48 bulletin. Other formats vary by vendor.

### Pixel dimensions (recommended upload)
**Vendor-spec-dependent — confirm the operator's media kit.** Common practice: design at a scaled size (e.g. 1 ft → 0.5 in artwork, a 1:24 scale) at 300 DPI of the scaled file, which yields the right effective resolution at viewing distance (print bulletins need only ~15–30 effective DPI at highway distance). `[verify — exact pixel dimensions, bleed, and grommet/pocket allowances are per-vendor; confirm the printer's spec sheet]`

### Safe zones
Vendor mounting hardware (extensions, frames, pockets) eats the edges — keep all copy and the logo well inside a vendor-specified live area. Confirm live/viewable vs full-bleed with the operator before designing to the edge.

### Mobile readability floor
N/A (physical). The governing constraint is **read-distance**: ≤ 7 words, one idea, maximum type weight. Viewed at 500+ ft and at speed — if it can't be read in ~2 seconds it fails.

### Thumb-stop contrast
≥ 7:1 — distance, motion, glare, and weather erode contrast. High-contrast type on a solid field; avoid thin strokes and tight tracking.

### File format & size
Print: **CMYK PDF**, fonts converted to outlines, all links embedded/packaged. Digital DOOH: **RGB**, vendor-specified resolution/codec. No universal file-size cap — governed by the vendor's RIP / playback spec. `[verify — confirm format, color mode, and resolution against the specific vendor]`

### Color mode
**CMYK** for printed billboards; **RGB** for digital DOOH screens. (Inverse of the screen-asset default — get it from the vendor.)

### Brand-safe-zone (sponsored / boosted)
N/A — the billboard is the placement; no platform overlay.

### Anti-patterns
- More than ~7 words — unreadable at speed; OOH is a single-glance medium.
- RGB for a printed bulletin (or CMYK for a digital screen) — color shifts; match the vendor's mode.
- Thin type / low contrast / busy background — collapses at distance + weather.
- Live copy or logo near the edge — eaten by mounting hardware; honor the vendor live area.

---

## Platform: transit-poster

### Surface variants
Transit advertising — **interior car card** (above-seat, inside buses/trains) and exterior bus formats (King ~30″ h × 144″ w; King Kong / Ultra Super King ~54″ h × 248″ w, market-dependent). Distinct from the billboard: **shorter read distance + much longer dwell.**

### Aspect ratio
Interior car card ~2.5:1 (commonly 11″ h × 28″ w). Exterior King ~4.8:1; King Kong ~4.6:1. Vendor/market-dependent.

### Pixel dimensions (recommended upload)
Interior car card commonly **11″ × 28″** (height ~11.125″) at 150–300 DPI; exterior formats per vendor die-line. `[verify — transit sizes vary by transit authority/market; confirm the operator's spec sheet]`

### Safe zones
Interior cards slot into a track/frame above the seats — keep copy clear of the top/bottom mounting lip (vendor-specified). Exterior wraps must account for windows, wheel wells, and panel seams — request the vendor's die-line.

### Mobile readability floor
N/A (physical). Read distance is shorter than a billboard (~3–10 ft interior; ~20+ ft exterior, in motion): minimum type ~38pt / ⅜″, preferred 50–60pt. The **longer dwell (5–15 min in stations, 15–45 min in-vehicle)** means an interior card can carry **more copy than a billboard's 7 words** — a captive rider will read a short paragraph — but exterior formats are still glance-media.

### Thumb-stop contrast
≥ 4.5:1 interior (closer, calmer read); ≥ 7:1 exterior (distance + motion).

### File format & size
**CMYK PDF**, fonts outlined, links embedded, at the vendor's die-line with bleed. No fixed file cap — governed by the printer. `[verify — confirm color mode, bleed, and die-line with the transit vendor]`

### Color mode
**CMYK** (printed).

### Brand-safe-zone (sponsored / boosted)
N/A — the placement itself, no platform overlay.

### Anti-patterns
- Treating an interior card like a billboard (7 words) — wastes the long captive dwell; interior cards can carry a fuller message.
- Treating an exterior King like an interior card (dense copy) — exterior is glance-media at distance; keep it short.
- Ignoring window / wheel-well seams on exterior wraps — copy lands on a gap; always design to the vendor die-line.
- RGB for a printed card — color shift on press.

---

## Platform: print-magazine-spread

### Surface variants
Magazine ad — **full-page** or **two-page spread**. The spread adds a center **gutter** where the pages bind. Publication-specific trim.

### Aspect ratio
Per the publication's trim. Common single-page trim **8.125″ × 10.875″**; spread trim **16.25″ × 10.875″**. Confirm the publication's media kit.

### Pixel dimensions (recommended upload)
**300 DPI at final trim size, CMYK.** Single page at 8.125 × 10.875″ → ~2438 × 3263 px; spread at 16.25 × 10.875″ → ~4875 × 3263 px. `[verify — trim size is per-publication; pull exact trim / bleed / gutter from the media kit]`

### Safe zones
**Bleed:** 0.125″ (3mm) minimum, 0.25″ preferred, on every outer edge. **Safety / live matter:** keep text + logo 0.25″–0.5″ inside the trim. **Spread gutter:** keep live copy 0.125″ clear of each side of the gutter and never run a face, logo, or critical word across the gutter — the bind swallows ~0.75″–1″ total. Plan the spread so the fold lands on negative space.

### Mobile readability floor
N/A (physical). Body type ≥ 8pt (≥ 9–10pt comfortable); read at arm's length, far smaller than screen floors — but never below the publication's stated minimum.

### Thumb-stop contrast
≥ 4.5:1 for body. Press concerns dominate over WCAG here — specify a rich-black build (e.g. C60 M40 Y40 K100) for large black fields, not K100 alone.

### File format & size
**Press-ready CMYK PDF/X** (PDF/X-1a or PDF/X-4 per the publication), fonts embedded or outlined, images ≥ 300 DPI, total ink limit per the stock (often ~300%). `[verify — confirm PDF/X flavor, ink limit, and ICC profile with the publication]`

### Color mode
**CMYK** (+ the publication's ICC profile). Convert RGB and Pantone-to-process per the media kit unless a spot color is purchased.

### Brand-safe-zone (sponsored / boosted)
N/A — the ad is the placement.

### Anti-patterns
- RGB / sRGB export — colors shift on press; always CMYK with the publication's profile.
- Critical content across the gutter on a spread — the bind eats it; keep faces / logos / headlines off the fold.
- No bleed on a full-bleed ad — a white sliver shows after trimming.
- K100-only large black fields — looks weak/grey on press; use a rich-black build.
- Type below the publication's minimum or inside the safety margin — risks trimming.

---

## Modules to populate (tranche status)

**Tranche 1 — DONE (core digital):**
- [x] `instagram-post` — feed single-image post
- [x] `instagram-carousel` — feed carousel (cover + 1–9 slides)
- [x] `instagram-story` — story (9:16, ephemeral)
- [x] `instagram-reel-cover` — reel cover image (dual grid + player crop)
- [x] `linkedin-single-image` — feed single-image post
- [x] `linkedin-doc-post` — multi-slide PDF carousel
- [x] `x-card` — X/Twitter feed card (summary / summary_large_image)
- [x] `og-share-card` — OpenGraph share card
- [x] `youtube-thumbnail` — video thumbnail (16:9, click-stop)
- [x] `display-banner` — IAB / GDN standard sizes

**Tranche 2 — DONE (paid-ad-chrome + physical; verified against current primary/secondary sources, volatile + shop-dependent fields `[verify]`-flagged):**
- [x] `linkedin-event-banner` — event cover image (1600×900 / 16:9 `[verify]` — no dedicated LinkedIn spec page)
- [x] `facebook-feed-ad` — feed single-image / carousel ad (image un-overlaid; Sponsored + CTA chrome above/below from ad setup; char caps `[verify]`)
- [x] `facebook-story-ad` — story-format ad (9:16; Mar-2026 unified safe zone 14% top / 20% bottom / 6% sides `[verify]`)
- [x] `youtube-banner` — channel banner (2560×1440; all-device safe area 1546×423; ≤6MB — confirmed, matches asset-types.md)
- [x] `email-hero` — email hero image (600px / 1200px@2×; image-block + 3-way dark-mode + Outlook-Word-engine folded into Safe zones)
- [x] `ooh-billboard` — outdoor bulletin (CMYK-print / RGB-digital, ≤7 words, scaled-design; exact dims vendor-dependent `[verify]`)
- [x] `transit-poster` — transit (interior 11×28″, shorter read-distance + longer dwell → more copy than OOH; dims vendor-dependent `[verify]`)
- [x] `print-magazine-spread` — magazine ad (CMYK / 300DPI, bleed 0.125″min·0.25″pref, gutter 0.75–1″; trim publication-dependent `[verify]`)

---

## Cross-platform anti-patterns (apply regardless of module)

- **Tiny logo / sub-platform-floor type at mobile 1×** — readers can't read it, brand recognition fails.
- **Edge-aligned focal copy** — platform crops vary across devices; safe-zone violation eats the message.
- **Brand color drift** — platform feed compression / dark-mode rendering shifts hues; spec compensation in brief (author saturation slightly below the DESIGN.md value for heavy-compression feeds).
- **Non-AVIF / non-WebP for photographic web** — file-size penalty, slower load, lower thumb-stop rate.
- **Forgetting the 9:16 variant for any social asset** — most major platforms now serve a vertical surface; assets without a 9:16 variant lose distribution.
- **Color-only differentiation in data viz / icons** — accessibility + dark-mode failure.
- **Gradient + thin text** — common AI-generic pairing; readability collapses on mobile.
- **No brand mark in social** — platform feed strips alt text and context; the asset must carry brand attribution visually.
- **Sizing type for the authoring canvas, not the render** — the most common cross-platform failure; size for the smallest device the surface serves (see the readability-floor model at the top).

---

## Build-pass checklist

When populating a module (or verifying a `[verify]` field):

1. Fetch current platform documentation (Meta Ads Manager, X Help Center, LinkedIn Marketing Solutions, YouTube Creator docs, IAB/GDN sizes spec). These are the source of truth for the `[verify]`-flagged fields.
2. Cross-check with two recent working creatives in the wild (note dates — platform specs decay).
3. Flag any spec field you couldn't verify with `[verify <YYYY-MM> — <source> drifts]`. Never fabricate a precise current cap to clear the flag.
4. Keep dimension / aspect / safe-zone values consistent with `references/asset-types.md` (anti-drift rule at the top). Change both files in the same commit.
5. Add the module's row to the auto-detection table in `asset-types.md` if a new asset_type is introduced (tranche 1 filled existing slots — no new types; tranche 2 added `linkedin-event-banner`, `transit-poster`, `print-magazine-spread`, and explicit `youtube-banner` / `facebook-story-ad` rows + dimension entries to asset-types.md in the same commit per the anti-drift rule; `facebook-feed-ad` reuses the existing fb-ad / feed route).
6. Update `agents/critic-agent.md` rubric only if the module introduces a platform-specific check not already covered by the Platform-fit dimension (tranche 1 introduced none; tranche 2 introduced none — the Format-fit dimension already covers dimensions, safe zones, crop behavior, ad-chrome, color mode, and print bleed/CMYK via the designer-handoff scoring-mode shift).

---

## Status note

All 18 modules (tranche 1 + tranche 2) are populated with practitioner-grade specs; stable fields are confident, volatile fields carry `[verify]` flags per the convention above. The parent skill is therefore off `done_with_concerns` — `platform-modules.md` is fully populated. Briefs ship verified **except** for any `[verify]`-flagged field (volatile platform file-size caps / ad-chrome geometry, or per-vendor physical specs the brief instructs the operator to confirm against the vendor/publication media kit). Those flags are the by-design epistemic-honesty markers, not gaps: a `[verify]` field means "confirm against the current primary source before relying," never "fabricated." Re-verify the `[verify]`-flagged platform fields on a cadence (platform ad-chrome and caps drift fastest — Meta and LinkedIn especially).
