# Assets Inventory Reference

Single source of truth for the **production-ready asset manifest** emitted as `docs/forsvn/canonical/marketing/ASSETS.md` (stamps `id: assets`). Projects declared platforms + universal brand surfaces into a checkable inventory. **Derived, not researched** — every row here maps to an upstream spec in `platform-surfaces.md`, DESIGN.md Platform Icon Specifications, or Visual Agent's logo/imagery output.

**Read by:** orchestrator only. Used in SKILL.md Step 8.5 (Assets Inventory projection).

## Emission rules

1. **Derivation only.** Never invent assets not traceable to BRAND.md / DESIGN.md / `platform-surfaces.md`. If the brand did not declare iOS, no iOS block emits.
2. **Declared-platform gate.** One platform block per declared platform, in declared order. Zero undeclared platforms.
3. **Checkbox discipline.** Every line is a GFM checkbox. Schema: `- [status] {Asset name} — {spec ref} — {target path}`
 - `[ ]` not started
 - `[~]` in progress (preserved across re-runs — never auto-overwritten)
 - `[x]` done (auto-set when file exists at target path on re-run)
 - `[!]` blocked (human-set; preserved across re-runs)
4. **Target path is mandatory.** Every row names a concrete file or directory under `brand/`. The auto-scan step depends on this.
5. **Spec ref is mandatory.** Every row uses where the spec lives — `DESIGN.md §7 iOS Icon Spec`, `BRAND.md §10 Brand Mark`, or `platform-surfaces.md iOS Icon specifications`. No spec ref → the row doesn't belong here.
6. **No duplication of spec.** Do NOT copy safe zones, format rules, color spaces, or production pitfalls into ASSETS.md — those live in DESIGN.md / `platform-surfaces.md` and ASSETS.md uses them. **Exception:** dimensions MAY appear in the asset name field when they disambiguate deliverables (e.g., `Open Graph default (1200×630)`, `Logo — full lockup (PNG @ 2048px)`). Dimensions in the name are permitted; dimensions as standalone spec rows or commentary are not.

## Status scan protocol (always-on, every run)

On every brand-system run (fresh or re-run):

1. Read existing `docs/forsvn/canonical/marketing/ASSETS.md` if present. Extract rows with status `[~]` or `[!]` — preserve them verbatim.
2. Regenerate the full inventory from current BRAND.md + DESIGN.md + declared platforms.
2a. **Expand all placeholders before scanning.** Any row emitted from a template containing `{host}`, `{count}`, or any other `{token}` must have those tokens resolved from the declared data *before* substep 3 runs. Specifically: for every declared embedded host, emit one fully-expanded row set with `{host}` substituted (e.g., `brand/platforms/embedded/slack/icon-512.png`, `brand/platforms/embedded/notion/icon-512.png`, …). For Imagery rows, substitute `{count}` from DESIGN.md §8. **No row reaches substep 3 with an unfilled placeholder in its target path** — such rows would fail `test -e` every time and sit at `[ ]` forever.
3. For each row, check if `target path` exists on disk. For file-typed paths: `Bash: test -e <path>` → `[x]` if yes, `[ ]` if no. **For directory-typed paths (ending in `/`):** `[x]` only if the directory exists AND contains at least one non-`.gitkeep` file — an empty or `.gitkeep`-only directory remains `[ ]`. Formula: ``test -d <path> && [ -n "$(ls -A <path> 2>/dev/null | grep -v '^\.gitkeep$')" ]``. This prevents the scaffolded-directory false-completion where `.gitkeep` seeding would auto-tick every imagery/platform row on first run.
4. Merge in preserved `[~]` / `[!]` rows by row name match (overriding the auto-computed status).
5. Write `docs/forsvn/canonical/marketing/ASSETS.md` (overwrite in place + bump integer `version:`). If a row present in the old file is absent from the new inventory (e.g., platform was dropped from declaration), keep it under a trailing `## Orphaned (platform no longer declared)` block — never silently delete human tracking state. **Orphaned rows retain their prior status verbatim** (including `[~]`, `[!]`, and `[x]`) — do not re-scan or reset them to `[ ]` when moving to the Orphaned block. The block is an archive, not a fresh scan.

## Inventory sections

Emit in this order. Omit any section whose source data is absent.

### 1. Universal (always emits)

Sourced from BRAND.md brand mark section + DESIGN.md typography/color.

```
- [ ] Logo — full lockup (SVG, vector master) — brand/logo/logo-full.svg — BRAND.md §10
- [ ] Logo — full lockup (PNG @ 2048px transparent) — brand/logo/logo-full-2048.png — BRAND.md §10
- [ ] Logo — horizontal variant — brand/logo/logo-horizontal.svg — BRAND.md §10
- [ ] Logo — vertical / stacked variant — brand/logo/logo-vertical.svg — BRAND.md §10
- [ ] Logo — symbol only (no wordmark) — brand/logo/symbol.svg — BRAND.md §10
- [ ] Logo — wordmark only — brand/logo/wordmark.svg — BRAND.md §10
- [ ] Logo — monochrome (black on transparent) — brand/logo/logo-mono-black.svg — BRAND.md §10
- [ ] Logo — monochrome (white on transparent) — brand/logo/logo-mono-white.svg — BRAND.md §10
- [ ] Logo — clear-space & minimum-size rule sheet — brand/logo/logo-usage.pdf — BRAND.md §10
- [ ] Logo — don'ts sheet (stretch / recolor / rotate examples) — brand/logo/logo-donts.pdf — BRAND.md §10
- [ ] Display font files (woff2 + variable if applicable) — brand/font/display/ — DESIGN.md §3
- [ ] Display font license — brand/font/display/LICENSE.txt — DESIGN.md §3
- [ ] Body font files — brand/font/body/ — DESIGN.md §3
- [ ] Body font license — brand/font/body/LICENSE.txt — DESIGN.md §3
- [ ] Mono font files (if DESIGN.md declares one) — brand/font/mono/ — DESIGN.md §3
- [ ] Color tokens exported (CSS custom properties) — brand/tokens/colors.css — DESIGN.md §2
- [ ] Color tokens exported (JSON, W3C format) — brand/tokens/colors.json — DESIGN.md §2
- [ ] Full token bundle (JSON) — brand/tokens/tokens.json — DESIGN.md §2-§9
```

### 2. Social & Sharing (always emits)

Sourced from DESIGN.md imagery direction + BRAND.md brand mark. Platforms-agnostic — every brand ships these.

```
- [ ] Open Graph default (1200×630, <300KB) — brand/social/og-default.png — DESIGN.md §8
- [ ] Open Graph — dark variant — brand/social/og-default-dark.png — DESIGN.md §8
- [ ] Twitter/X summary large image (1200×628) — brand/social/twitter-card.png — DESIGN.md §8
- [ ] LinkedIn company banner (1128×191) — brand/social/linkedin-banner.png — DESIGN.md §8
- [ ] LinkedIn company logo (300×300) — brand/social/linkedin-logo-300.png — BRAND.md §10
- [ ] X/Twitter profile image (400×400) — brand/social/twitter-avatar-400.png — BRAND.md §10
- [ ] X/Twitter header (1500×500) — brand/social/twitter-header.png — DESIGN.md §8
- [ ] Instagram profile (320×320) — brand/social/instagram-avatar.png — BRAND.md §10
- [ ] Instagram post template — brand/social/instagram-post-template.fig — DESIGN.md §8
- [ ] YouTube channel icon (800×800) — brand/social/youtube-avatar.png — BRAND.md §10
- [ ] YouTube channel banner (2560×1440, safe area 1546×423) — brand/social/youtube-banner.png — DESIGN.md §8
- [ ] Facebook profile (360×360) — brand/social/facebook-avatar.png — BRAND.md §10
- [ ] Facebook cover (851×315) — brand/social/facebook-cover.png — DESIGN.md §8
```

### 3. Favicon & Web Metadata (emits if Web declared)

```
- [ ] favicon.ico (16 + 32 + 48 multi-res) — brand/favicon/favicon.ico — DESIGN.md §7
- [ ] favicon.svg (modern browsers) — brand/favicon/favicon.svg — DESIGN.md §7
- [ ] apple-touch-icon (180×180) — brand/favicon/apple-touch-icon.png — DESIGN.md §7
- [ ] android-chrome-192 (192×192) — brand/favicon/android-chrome-192.png — DESIGN.md §7
- [ ] android-chrome-512 (512×512) — brand/favicon/android-chrome-512.png — DESIGN.md §7
- [ ] maskable icon (512×512, full-bleed safe zone) — brand/favicon/maskable-512.png — DESIGN.md §7
- [ ] site.webmanifest — brand/favicon/site.webmanifest — DESIGN.md §7
- [ ] theme-color meta values (light + dark) — brand/favicon/theme-color.txt — DESIGN.md §2
```

### 4. Imagery & Illustration (emits when DESIGN.md §8 declares direction)

Fuzzier by nature — direction specifies count and style, not exact files. Each slot is one commission/production unit. **Substitute `{count}` from DESIGN.md §8 for each brand; do not hardcode counts.** If DESIGN.md §8 does not declare a specific set (e.g., no illustration system), omit that row.

```
- [ ] Hero photography set ({count} shots per DESIGN.md §8) — brand/imagery/hero/ — DESIGN.md §8
- [ ] Secondary photography set ({count} shots per DESIGN.md §8) — brand/imagery/secondary/ — DESIGN.md §8
- [ ] Illustration style guide reference sheet — brand/imagery/illustration-style.pdf — DESIGN.md §8
- [ ] Illustration set — feature icons ({count} per DESIGN.md §8) — brand/imagery/illustrations/features/ — DESIGN.md §8
- [ ] Illustration set — empty states ({count} per DESIGN.md §8) — brand/imagery/illustrations/empty-states/ — DESIGN.md §8
- [ ] Illustration set — onboarding ({count} per DESIGN.md §8) — brand/imagery/illustrations/onboarding/ — DESIGN.md §8
- [ ] Pattern / texture library — brand/imagery/patterns/ — DESIGN.md §8
- [ ] Brand device — recurring visual motif (grid, shape, stamp) — brand/imagery/devices/ — DESIGN.md §8
```

### 5. Per-Platform Blocks (one block per declared platform)

For each declared platform, emit the block below. Undeclared platforms: absent.

#### Web (marketing site + in-product UI + PWA)

```
- [ ] Light-mode hero asset — brand/platforms/web/hero-light.png — DESIGN.md §8
- [ ] Dark-mode hero asset — brand/platforms/web/hero-dark.png — DESIGN.md §8
- [ ] PWA install icon (512×512 maskable) — brand/platforms/web/pwa-icon-512.png — platform-surfaces.md Web
- [ ] PWA splash screens (iOS Safari sizes) — brand/platforms/web/pwa-splash/ — platform-surfaces.md Web
- [ ] 404 / error page illustration — brand/platforms/web/error-illustration.svg — DESIGN.md §8
- [ ] Loading state asset (spinner / skeleton mark) — brand/platforms/web/loading.svg — DESIGN.md §9
- [ ] OG image template (Satori-compatible, if dynamic) — brand/platforms/web/og-template/ — DESIGN.md §8
```

#### iOS / iPadOS

```
- [ ] App icon master 1024×1024 (light) — brand/platforms/ios/icon-1024-light.png — DESIGN.md §7 iOS · platform-surfaces.md iOS
- [ ] App icon master 1024×1024 (dark) — brand/platforms/ios/icon-1024-dark.png — DESIGN.md §7 iOS · platform-surfaces.md iOS
- [ ] App icon master 1024×1024 (tinted, single channel) — brand/platforms/ios/icon-1024-tinted.png — DESIGN.md §7 iOS · platform-surfaces.md iOS
- [ ] App icon derivative set (180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20) — brand/platforms/ios/icon-derivatives/ — DESIGN.md §7 iOS
- [ ] Launch screen storyboard asset — brand/platforms/ios/launch.svg — platform-surfaces.md iOS
- [ ] Widget background assets (sm, md, lg, xl) — brand/platforms/ios/widgets/ — platform-surfaces.md iOS
- [ ] Lock screen complication glyphs (rect, circ, inline) — brand/platforms/ios/complications/ — platform-surfaces.md iOS
- [ ] App Store screenshots — 6.9" (iPhone 17 Pro Max) — brand/platforms/ios/app-store/6.9/ — platform-surfaces.md iOS
- [ ] App Store screenshots — 6.5" — brand/platforms/ios/app-store/6.5/ — platform-surfaces.md iOS
- [ ] App Store screenshots — 5.5" — brand/platforms/ios/app-store/5.5/ — platform-surfaces.md iOS
- [ ] App Store screenshots — 13" iPad Pro — brand/platforms/ios/app-store/13-ipad/ — platform-surfaces.md iOS
- [ ] App Store preview video (optional, 15-30s) — brand/platforms/ios/app-store/preview.mov — platform-surfaces.md iOS
- [ ] Share sheet glyph (monochrome template) — brand/platforms/ios/share-glyph.svg — platform-surfaces.md iOS
```

#### Android

```
- [ ] Adaptive icon — foreground layer — brand/platforms/android/adaptive-foreground.svg — DESIGN.md §7 Android · platform-surfaces.md Android
- [ ] Adaptive icon — background layer — brand/platforms/android/adaptive-background.svg — DESIGN.md §7 Android · platform-surfaces.md Android
- [ ] Adaptive icon — monochrome layer (Material You tint) — brand/platforms/android/adaptive-monochrome.svg — DESIGN.md §7 Android
- [ ] Legacy icon fallback (PNG) — brand/platforms/android/icon-legacy.png — DESIGN.md §7 Android
- [ ] Play Store feature graphic (1024×500) — brand/platforms/android/play-store/feature-graphic.png — platform-surfaces.md Android
- [ ] Play Store screenshots — phone — brand/platforms/android/play-store/phone/ — platform-surfaces.md Android
- [ ] Play Store screenshots — 7" tablet — brand/platforms/android/play-store/tablet-7/ — platform-surfaces.md Android
- [ ] Play Store screenshots — 10" tablet — brand/platforms/android/play-store/tablet-10/ — platform-surfaces.md Android
- [ ] Notification icon (monochrome, 24dp) — brand/platforms/android/notification-icon.svg — platform-surfaces.md Android
- [ ] Splash screen drawable (Android 12+ branded launch) — brand/platforms/android/splash.xml — platform-surfaces.md Android
```

#### macOS

```
- [ ] App icon master 1024×1024 (squircle baked in, ~10% padding) — brand/platforms/macos/icon-1024.png — DESIGN.md §7 macOS · platform-surfaces.md macOS
- [ ] App icon derivative set (512, 256, 128, 64, 32, 16 — 32/16 designed distinctly) — brand/platforms/macos/icon-derivatives/ — DESIGN.md §7 macOS
- [ ] Menu bar / status item template (22×22 @1x, 44×44 @2x, pure black+alpha) — brand/platforms/macos/menubar-template.svg — platform-surfaces.md macOS
- [ ] Document icons (per owned file type) — brand/platforms/macos/document-icons/ — platform-surfaces.md macOS
- [ ] About panel hero — brand/platforms/macos/about-hero.png — platform-surfaces.md macOS
- [ ] Share extension glyph (mono) — brand/platforms/macos/share-glyph.svg — platform-surfaces.md macOS
- [ ] Mac App Store screenshots (2560×1600) — brand/platforms/macos/app-store/ — platform-surfaces.md macOS
```

#### Windows

```
- [ ] App icon.ico (multi-res: 256, 128, 96, 64, 48, 32, 24, 16) — brand/platforms/windows/app.ico — DESIGN.md §7 Windows · platform-surfaces.md Windows
- [ ] MSIX tile assets (Square44, Square71, Square150, Square310, Wide310) — brand/platforms/windows/tiles/ — platform-surfaces.md Windows
- [ ] Start menu tile logo — brand/platforms/windows/start-tile.png — platform-surfaces.md Windows
- [ ] Splash screen — brand/platforms/windows/splash.png — platform-surfaces.md Windows
- [ ] Microsoft Store assets — brand/platforms/windows/store/ — platform-surfaces.md Windows
```

#### Linux desktop

```
- [ ] App icon (512×512 PNG) — brand/platforms/linux/icon-512.png — DESIGN.md §7 Linux · platform-surfaces.md Linux desktop
- [ ] App icon (scalable SVG) — brand/platforms/linux/icon.svg — DESIGN.md §7 Linux
- [ ].desktop file template — brand/platforms/linux/app.desktop — platform-surfaces.md Linux desktop
- [ ] Icon set for hicolor theme (16, 22, 24, 32, 48, 64, 96, 128, 256, 512) — brand/platforms/linux/hicolor/ — platform-surfaces.md Linux desktop
- [ ] Flathub / Snap store screenshots — brand/platforms/linux/store/ — platform-surfaces.md Linux desktop
```

#### watchOS

```
- [ ] Watch app icon (1024×1024 master) — brand/platforms/watchos/icon-1024.png — DESIGN.md §7 watchOS · platform-surfaces.md watchOS
- [ ] Watch app icon derivatives (216, 172, 100, 88, 58, 55, 48, 44, 40) — brand/platforms/watchos/icon-derivatives/ — DESIGN.md §7 watchOS
- [ ] Complication assets (Modular, Circular, Utilitarian, Graphic) — brand/platforms/watchos/complications/ — platform-surfaces.md watchOS
- [ ] Watch face showcase screenshots — brand/platforms/watchos/screenshots/ — platform-surfaces.md watchOS
```

#### Wear OS

```
- [ ] Watch app icon — brand/platforms/wearos/icon.svg — DESIGN.md §7 Wear OS · platform-surfaces.md Wear OS
- [ ] Tile icons (48dp) — brand/platforms/wearos/tiles/ — platform-surfaces.md Wear OS
- [ ] Complication glyphs — brand/platforms/wearos/complications/ — platform-surfaces.md Wear OS
```

#### tvOS

```
- [ ] Layered app icon (front / middle / back layers, 1920×1080 banner + 400×240) — brand/platforms/tvos/icon-layered/ — DESIGN.md §7 tvOS · platform-surfaces.md tvOS
- [ ] Top shelf image (static 1920×720, wide 2320×720) — brand/platforms/tvos/top-shelf/ — platform-surfaces.md tvOS
- [ ] Launch image — brand/platforms/tvos/launch.png — platform-surfaces.md tvOS
- [ ] tvOS App Store screenshots (1920×1080) — brand/platforms/tvos/app-store/ — platform-surfaces.md tvOS
```

#### CarPlay / Android Auto

```
- [ ] App icon (CarPlay: 120×120 + 180×180 + 480×480) — brand/platforms/carplay/icon/ — DESIGN.md §7 CarPlay · platform-surfaces.md CarPlay / Android Auto
- [ ] Android Auto icon (monochrome, 44dp) — brand/platforms/android-auto/icon.svg — DESIGN.md §7 Android Auto · platform-surfaces.md CarPlay / Android Auto
- [ ] Driver-safe illustration set (if any in-car UI) — brand/platforms/carplay/illustrations/ — platform-surfaces.md CarPlay / Android Auto
```

#### Browser extension

```
- [ ] Extension icon (16, 32, 48, 128) — brand/platforms/extension/icons/ — DESIGN.md §7 Extension · platform-surfaces.md Browser extension
- [ ] Browser action glyph (active + inactive) — brand/platforms/extension/browser-action/ — platform-surfaces.md Browser extension
- [ ] Chrome Web Store screenshots (1280×800 or 640×400) — brand/platforms/extension/chrome-store/ — platform-surfaces.md Browser extension
- [ ] Chrome Web Store promo tile (440×280) — brand/platforms/extension/chrome-store/promo-tile.png — platform-surfaces.md Browser extension
- [ ] Firefox Add-ons screenshots — brand/platforms/extension/firefox-store/ — platform-surfaces.md Browser extension
```

#### CLI / terminal

```
- [ ] ASCII / ANSI banner (startup splash) — brand/platforms/cli/banner.txt — platform-surfaces.md CLI
- [ ] Terminal color scheme (iTerm2 / Windows Terminal JSON) — brand/platforms/cli/terminal-theme.json — DESIGN.md §2
- [ ] Logo as ANSI art (optional) — brand/platforms/cli/logo-ansi.txt — platform-surfaces.md CLI
```

#### Email

```
- [ ] Header logo (light bg, 600×? capped) — brand/platforms/email/header-logo-light.png — platform-surfaces.md Email
- [ ] Header logo (dark bg) — brand/platforms/email/header-logo-dark.png — platform-surfaces.md Email
- [ ] Footer signature logo — brand/platforms/email/footer-logo.png — platform-surfaces.md Email
- [ ] Transactional template (HTML) — brand/platforms/email/transactional.html — platform-surfaces.md Email
- [ ] Newsletter template (HTML) — brand/platforms/email/newsletter.html — platform-surfaces.md Email
- [ ] BIMI SVG logo (square, SVG Tiny 1.2 PS) — brand/platforms/email/bimi.svg — platform-surfaces.md Email (BIMI)
- [ ] BIMI VMC certificate reference — brand/platforms/email/bimi-vmc.txt — platform-surfaces.md Email (BIMI)
```

#### Embedded app (Slack / Notion / Discord / Teams / Linear / GitHub)

Emit one subsection per declared host. Substitute `{host}` with the lowercase host name (e.g., `slack`, `notion`, `discord`, `teams`, `linear`, `github`).

```
- [ ] App icon (512×512) — brand/platforms/embedded/{host}/icon-512.png — platform-surfaces.md Embedded
- [ ] App directory hero — brand/platforms/embedded/{host}/directory-hero.png — platform-surfaces.md Embedded
- [ ] In-app glyph (mono, sized for host chrome) — brand/platforms/embedded/{host}/glyph.svg — platform-surfaces.md Embedded
- [ ] Directory screenshots — brand/platforms/embedded/{host}/screenshots/ — platform-surfaces.md Embedded
```

---

## ASSETS.md file template

The artifact MUST open with the required frontmatter core (full schema in [`format-conventions.md`](format-conventions.md) § "Frontmatter schema") — never emit this body without it:

```markdown
---
skill: create-brand
version: [integer — increments on each in-place re-run]
date: [ISO YYYY-MM-DD]
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: none
id: assets
type: canonical
keywords: [assets, checklist, deliverables, brand-assets, production]
decision_state: not_required
declared_platforms: [list of platforms declared at Pre-Dispatch Q6]
brand_md_version: [integer — pins to the BRAND.md version this was projected from]
design_md_version: [integer — pins to the DESIGN.md version this was projected from]
last_scan: [ISO timestamp — when auto-scan last ran]
---

# ASSETS.md — {Brand Name}

*Production inventory for {Brand Name}. Auto-generated from BRAND.md + DESIGN.md + declared platforms. Statuses auto-scan on every brand-system run; `[~]` in-progress and `[!]` blocked markers are preserved across runs.*

- **Declared platforms:** {list}
- **Last scan:** {ISO-8601 timestamp}
- **BRAND.md version:** v{N}
- **DESIGN.md version:** v{N}

## Legend
- `[ ]` not started
- `[~]` in progress (human-set, preserved across runs)
- `[x]` done (file exists at target path)
- `[!]` blocked (human-set, preserved across runs)

## Universal
{rows from §1 Universal}

## Social & Sharing
{rows from §2 Social & Sharing}

## Favicon & Web Metadata
{rows from §3, only if Web declared}

## Imagery & Illustration
{rows from §4, only if DESIGN.md §8 declares direction}

## Platforms
{one ### subsection per declared platform, in declared order}

## Summary
- Total: {N}
- Done: {N} ({pct}%)
- In progress: {N}
- Blocked: {N}
- Not started: {N}

> `Total` must equal `Done + In progress + Blocked + Not started`. Verify before writing — a mismatch indicates a counting bug or an unknown-status row.

## Orphaned
{rows preserved from prior runs whose platforms are no longer declared — human review required}
```

## Anti-patterns

**Inventing assets** — Adding rows not traceable to BRAND.md / DESIGN.md / `platform-surfaces.md`. INSTEAD: every row has a spec ref. No spec → the asset doesn't belong here.

**Duplicating spec** — Pasting pixel sizes and safe zones into ASSETS.md. INSTEAD: uses the spec location; keep ASSETS.md checkable, not definitional.

**Silent deletion on platform drop** — If the user re-runs brand-system and drops Android, silently removing the Android block erases their tracking state. INSTEAD: move to `## Orphaned` and flag for human review.

**Auto-overwriting human markers** — The scan re-computes `[x]` vs `[ ]` only. `[~]` and `[!]` are human-owned — never touch them.

**Undeclared-platform padding** — Emitting every platform block "just in case." INSTEAD: declared-only, declared-order. Same rule as BRAND.md Digital Touchpoints and DESIGN.md Platform Icon Specifications.
