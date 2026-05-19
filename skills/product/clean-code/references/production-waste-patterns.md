# Production Waste Patterns

Reference catalog for the asset-scanner-agent. These are common patterns where projects ship unused, broken, or bloated assets to production — wasting bandwidth, degrading performance, and signaling no review process.

Grounded in real-world audits, not hypotheticals.

## Unused Assets

Assets present in the project/build output but never referenced by any source file, template, or stylesheet.

**Images:**
- Logo variants nobody uses (old redesigns, alternate colorways, unused format conversions)
- Placeholder images left from scaffolding or prototyping
- Screenshots, mockups, or design assets accidentally committed
- Social preview / OG images for pages that no longer exist
- Icons from icon packs where only a few are used but the entire set was copied in

**Fonts:**
- Font weight/style files loaded but never referenced in CSS (`@font-face` declarations for weights that no `font-weight` rule ever uses)
- Legacy fonts from a rebrand still sitting in `/fonts`
- Multiple font formats (woff, woff2, ttf, eot) when only woff2 is needed for modern browsers

**CSS/JS:**
- Empty CSS files (just a manifest comment or charset declaration, no rules)
- Stylesheets imported but overridden entirely by later imports
- JavaScript controllers/modules loaded globally but only used on specific routes (the "78 Stimulus controllers on a homepage" problem)
- Polyfills for browsers the project no longer supports
- Rich text editors, chart libraries, or heavy components loaded on pages that don't use them

**Other media:**
- Video/audio files for features that were removed
- PDF downloads, data files, or fixture data left from development
- Map tiles, 3D models, or other large assets from abandoned features

## Duplicate Assets

The same visual content served multiple times, in multiple copies, or in redundant format variants.

**Same content, multiple copies:**
- Same image at different paths (e.g., `/images/logo.png` and `/assets/logo.png`)
- Same image committed under slightly different names (`hero-bg.jpg`, `hero-background.jpg`, `hero_bg.jpg`)
- Thumbnails that are just full-size images displayed at small dimensions (no actual resized file)

**Redundant format variants without selection logic:**
- PNG + WebP + AVIF of the same image when no `<picture>` element or `Accept` header logic selects between them
- All variants downloaded instead of the best match (the "8 logos per page load" problem)
- Retina (@2x, @3x) variants generated but never used in `srcset`

**Duplicate DOM/template content:**
- Entire sections rendered twice (mobile + desktop copies) instead of responsive CSS
- Same component included via multiple import paths
- Duplicate `<meta>`, `<link>`, or `<script>` tags in `<head>`

## Broken / Empty Assets

Files that exist, are served with HTTP 200, but contain no useful content.

**Zero-byte files:**
- Failed image format conversions deployed to production (0-byte AVIF/WebP from a broken build step)
- Empty CSS/JS files from build artifacts
- Placeholder files that were never populated

**Corrupt / invalid files:**
- Images that fail to decode (truncated uploads, interrupted conversions)
- CSS files containing only comments or `practitioner source` declarations with no rules
- JS files containing only `"use strict";` or module boilerplate with no exports

**Detection heuristic:**
- File size = 0 bytes → always flag
- CSS file with 0 rule declarations → flag as empty
- JS file < 50 bytes with no function/class/export → flag as stub
- Image file < 100 bytes → likely broken (a valid 1x1 pixel PNG is 67 bytes; anything smaller is suspect)

## Test Files in Production

Test code, fixtures, and development-only files that end up in the shipped bundle or public directory.

**Test harnesses shipped to visitors:**
- `*.test.js`, `*.spec.js`, `*.test.ts`, `*.spec.ts` files accessible via HTTP (returning 200)
- Test setup files (`jest.setup.js`, `vitest.config.ts`) in the public/build output
- `__tests__/`, `__mocks__/`, `__fixtures__/` directories in production bundles
- Storybook stories (`.stories.tsx`) bundled into production

**Development-only files:**
- `.env.example`, `.env.local.example` in the public directory
- `docker-compose.yml`, `Makefile`, `Dockerfile` served as static assets
- IDE config (`.vscode/`, `.idea/`) accessible via the web server
- `README.md`, `CHANGELOG.md`, `LICENSE` served as static files unnecessarily

**Fixture/seed data:**
- Test fixture JSON/CSV files in public directories
- Seed data or mock API response files accessible to visitors
- Sample uploads or demo content left from development

## Unoptimized Media

Assets served in formats or sizes that waste bandwidth when better alternatives exist.

**Image format waste:**
- PNG screenshots/photos where WebP/AVIF would cut 60-80% size
- BMP or TIFF images (should never be served on the web)
- GIFs that should be video (MP4/WebM) — especially animations over 500KB
- Server ignoring `Accept: image/avif, image/webp` headers and serving raw PNG regardless

**Image size waste:**
- Images larger than their display dimensions (2000px image displayed at 400px with no `srcset`)
- Favicons at excessive resolution (512x512 when 32x32/48x48 suffices for browser chrome)
- Thumbnails served as full-resolution images
- No responsive image strategy (`srcset`, `sizes`, `<picture>`) for images above 100KB

**Compression waste:**
- Assets served without gzip/brotli content-encoding when server supports it
- Pre-compressed assets (`.gz`, `.br`) generated but server not configured to use them
- Large JSON/XML data files served uncompressed

## Dead Route-Level Code

Modules, controllers, or components loaded globally when they're only needed on specific pages.

**Common patterns:**
- All Stimulus/Alpine/Livewire controllers bundled into one file and loaded on every page
- All route handlers imported at the top level instead of lazy-loaded
- Global CSS importing every component's styles regardless of the current page
- Analytics/tracking scripts loaded on pages where they can't fire (e.g., 404 pages)
- Rich text editors, date pickers, or other heavy widgets loaded on read-only pages

**Detection heuristic:**
- Controller/module imported in a global entry point → check if its target elements exist on the page
- CSS class defined in global stylesheet → check if any template uses it
- JavaScript file > 100KB loaded on every route → candidate for code splitting

## Severity Classification

| Category | Severity | Rationale |
|----------|----------|-----------|
| Broken/empty assets (0-byte, corrupt) | CRITICAL | Visibly broken for users, signals no QA process |
| Test files shipped to production | CRITICAL | Security risk (exposes internals) + embarrassing |
| Unoptimized images > 1MB each | HIGH | Direct user-facing performance impact |
| Unused assets > 100KB total | HIGH | Bandwidth waste, slower builds |
| Duplicate assets | MEDIUM | Wasteful but not broken |
| Unused assets < 100KB total | MEDIUM | Marginal impact but still waste |
| Missing responsive images | MEDIUM | Performance impact on mobile |
| Dead route-level code | MEDIUM | Performance impact, harder to verify removal |
| Redundant format variants | LOW | Waste but typically small per-file |
