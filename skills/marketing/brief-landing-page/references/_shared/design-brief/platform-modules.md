<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Platform Modules

> **Status: SKELETON — needs follow-up build pass.**
>
> This file holds per-platform brief checklists. Every brief design-brief writes pulls a checklist from here for the asset's platform — aspect ratio, safe zones, mobile readability floor, contrast for thumb-stop, file format, file-size cap, and platform-specific anti-patterns.
>
> The skeleton below names each module and lists the fields each must contain. The actual practitioner-grade specs (current platform constraints, real cited research, current Meta/X/LinkedIn/YouTube guideline links, real anti-patterns from working creatives) require a dedicated build pass with primary-source verification.
>
> **Do NOT trust placeholder values for production briefs until the module is filled.** Briefs that draw from a still-skeleton module ship as `done_with_concerns` with the unverified field flagged.

---

## Module template (every platform module fills these fields)

```
## Platform: [name]

### Surface variants
[Sub-formats this platform supports — e.g., Instagram = post, carousel, story, reel, post + carousel cover slide.]

### Aspect ratio
[Per variant — e.g., IG single 1:1, carousel 4:5 or 1:1, story 9:16. uses source.]

### Pixel dimensions (recommended upload)
[Per variant. uses source.]

### Safe zones
[Where platform UI overlays the asset (e.g., Instagram story top 250px reserved for username overlay, bottom 250px for sticker tray and CTA). Per variant. uses source.]

### Mobile readability floor
[Minimum text size in px at 1× rendering (i.e., on the smallest device the platform serves). Headline floor, body-copy floor. uses source where possible — Apple HIG, Material, platform research.]

### Thumb-stop contrast
[Minimum WCAG contrast ratio for the smallest text on its actual background, given the platform's dominant feed brightness. Higher than 4.5:1 baseline because feeds are mobile + scroll.]

### File format & size
[Recommended format per variant. File-size cap if platform enforces. Codec for video.]

### Color mode
[sRGB nearly always. DCI-P3 for richer iOS rendering. CMYK for print.]

### Brand-safe-zone (sponsored / boosted)
[For paid placements: where the "Sponsored" tag, "Learn more" CTA, and platform branding land — and how to avoid the brief overlapping them. uses ad-platform docs.]

### Anti-patterns
[Things that land badly on this platform specifically — e.g., "tiny logo bottom-right" on YT thumbnails, "edge-aligned text" on IG carousel cover, "non-AVIF photos" on banner ads. uses working/failing examples where possible.]
```

---

## Modules to populate (skeleton list)

The following modules need the template above filled with practitioner-grade specs. Build pass should verify against current platform documentation (links not pre-baked here because they change — fetch live during build).

- [ ] `instagram-post` — feed single-image post
- [ ] `instagram-carousel` — feed carousel (cover slide + 1–9 supplementary slides)
- [ ] `instagram-story` — story (9:16, ephemeral)
- [ ] `instagram-reel-cover` — reel cover image (different aspect than reel video itself)
- [ ] `linkedin-doc-post` — multi-slide PDF carousel (LinkedIn document feature)
- [ ] `linkedin-single-image` — feed single-image post
- [ ] `linkedin-event-banner` — event cover image
- [ ] `facebook-feed-ad` — feed single-image / carousel ad
- [ ] `facebook-story-ad` — story-format ad (9:16)
- [ ] `youtube-thumbnail` — video thumbnail (16:9, click-stop priority)
- [ ] `youtube-banner` — channel banner (multi-device safe zones)
- [ ] `x-card` — X/Twitter feed card (summary, summary_large_image)
- [ ] `og-share-card` — OpenGraph share card (1200×630 default; per-platform crop variants)
- [ ] `display-banner` — IAB/Google Display Network sizes (300×250, 728×90, 320×50, 970×250, 160×600)
- [ ] `email-hero` — email hero image (Gmail / Outlook / Apple Mail rendering quirks, dark-mode)
- [ ] `ooh-billboard` — outdoor advertising (vehicle vs pedestrian read-distance, weather visibility)
- [ ] `transit-poster` — transit advertising (read-distance shorter, dwell time longer than billboard)
- [ ] `print-magazine-spread` — magazine ad (CMYK, bleed, gutter, paper stock variance)

---

## Cross-platform anti-patterns (apply regardless of module)

- **Tiny logo / sub-platform-floor type at mobile 1×** — readers can't read it, brand recognition fails.
- **Edge-aligned focal copy** — platform crops vary across devices; safe-zone violation eats the message.
- **Brand color drift** — platform feed compression / dark-mode rendering shifts hues; spec compensation in brief.
- **Non-AVIF / non-WebP for photographic web** — file-size penalty, slower load, lower thumb-stop rate.
- **Forgetting 9:16 variant for any social asset** — most major platforms now serve a vertical surface; assets without a 9:16 variant lose distribution.
- **Color-only differentiation in data viz / icons** — accessibility + dark-mode failure.
- **Gradient + thin text** — common AI-generic pairing; readability collapses on mobile.
- **No brand mark in social** — platform feed strips alt text and context; the asset must carry brand attribution visually.

---

## Build-pass checklist

When populating a module:

1. Fetch current platform documentation (Meta Ad Manager, X Help Center, LinkedIn Marketing Solutions, YouTube Creator Insider, IAB sizes spec).
2. Cross-check with two recent working creatives in the wild (note dates — platform specs decay).
3. Flag any spec field you couldn't verify with `[unverified — needs primary-source confirmation]`.
4. Add the module's row to the auto-detection table in `SKILL.md` if a new asset_type is introduced.
5. Update `references/asset-types.md` to point to this module.
6. Update `agents/critic-agent.md` rubric if the module introduces a platform-specific check not already in the rubric.

---

## Why this is a skeleton

The handoff that produced this skill explicitly scoped the rename + re-scope as a cleanup pass, not a build pass. Filling these modules well requires:
- Live primary-source verification (training data on platform specs is stale fast)
- Real working/failing creative samples to derive anti-patterns from
- A reviewer with hands-on social-graphic experience to sanity-check thresholds

This file ships skeleton-only with explicit `done_with_concerns` status on the parent skill. Until populated, briefs against unfilled modules ship with the platform fields flagged as unverified.
