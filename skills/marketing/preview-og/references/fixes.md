# Preview OG — Fix Recipes [PROCEDURE]

Framework-aware remediation for the issues metaprev reports. Each fix is applied in the codebase, then verified by re-running `metaprev issues <url> --json` (Critical Gate 2).

## The #1 fix: make `og:image` absolute

A relative `/og.png` is the most common silent break. Crawlers fetch the `og:image` URL standalone with no page context, so it must be a full `https://…`.

| Framework | Fix |
|---|---|
| **Next.js (App Router)** | Set `metadataBase: new URL('https://yourdomain.com')` in the root `metadata` export (or `generateMetadata`). Next then resolves relative `openGraph.images` against it. Without `metadataBase`, Next emits a localhost or relative URL in production. |
| **Next.js (Pages)** | Emit the full URL: `<meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/og.png`} />`. |
| **Astro** | `new URL(image, Astro.site).toString()` — requires `site` set in `astro.config.mjs`. |
| **SvelteKit** | `` `${$page.url.origin}${image}` `` in the `<svelte:head>`, or hardcode the production origin. |
| **Vite / plain HTML** | Hardcode the absolute URL in the `<meta>` tag. |
| **Rails / Django / other** | Build the URL from the configured host/origin, not a root-relative path. |

## Wrong dimensions / ratio

Target **1200×630** (1.91:1). metaprev warns off-ratio or <600 px wide.

- If the og:image is generated (e.g. `@vercel/og`, `next/og`, Satori, a Cloudinary transform), set the output to 1200×630.
- If it's a static asset of the wrong size, this needs a *new asset* — hand the spec to `produce-asset` (1200×630, <8 MB, PNG/JPEG/WebP), then re-verify. Mark `DONE_WITH_CONCERNS` until the asset lands.

## Declared dimensions don't match the file

If `og:image:width`/`og:image:height` are present but disagree with the real pixels, Slack and Discord trust the *declared* values for first-paint and mis-crop. Fix: correct the declared tags to the real dimensions, or drop them (better absent than wrong).

## Non-image / SVG `og:image`

- **Non-image response** (the URL returns HTML or an error page that still 200s): the path is wrong or the asset 404s behind a rewrite. Point it at the real image file.
- **SVG**: Facebook, X, and LinkedIn don't render SVG share images. Re-export the og:image as PNG (or JPEG/WebP) and point the tag at it.

## Oversized image (>8 MB)

Compress or re-export. PNG → run through an optimizer or switch to WebP/JPEG for photographic content. Some platforms reject >8 MB outright.

## Missing helper tags (info-level — apply when cheap)

- `og:image:width` / `og:image:height` — speeds Slack/Discord first-paint. Add the *real* dimensions.
- `twitter:card` — set `summary_large_image` for big-image cards.
- `og:url` or `<link rel="canonical">` — helps platforms dedupe shares from `?utm_*` URLs.

## After every fix

Re-run `metaprev issues <url> --json`. A fix counts only when the tool reports the issue cleared. Loop (max 3 cycles); if an issue persists because it needs an external asset, stop and mark `DONE_WITH_CONCERNS` with the hand-off.
