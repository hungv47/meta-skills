# Preview OG — Playbook [PLAYBOOK]

## Why this skill exists

Share cards break silently. The page looks fine; the link looks broken — a blank thumbnail, the wrong image, a truncated title — and nobody notices until a post is already live and getting no clicks. The single most common cause is a relative `og:image` URL (`/og.png`) that resolves to nothing when a crawler fetches it standalone. `preview-og` runs the **metaprev** CLI to catch this class of problem deterministically, fixes it in the codebase, and re-runs the tool to prove the fix landed.

It is the marketing stack's pre-flight check for *distribution*: before `publish-social` posts a link, or before a launch page ships, the card should be verified to render.

## When NOT to use it

- **Writing the page copy** → `write-copy`. This skill validates the meta, it doesn't author the title/description.
- **Search / answer-engine strategy** → `optimize-seo`. SEO/AEO is a different surface (crawlability, schema, citations); `preview-og` is narrowly the social share card.
- **Generating the og:image artwork** → `produce-asset`. If the fix is "the image is the wrong size / doesn't exist," this skill hands the spec (1200×630, <8 MB, PNG/JPEG/WebP) to `produce-asset` and re-verifies after.
- **Posting the content** → `publish-social`. `preview-og` checks the link; `publish-social` distributes it.

## Install — get the CLI on the machine

metaprev is published as `@hungv47/metaprev` and runs on **Bun** (the package spawns Bun to execute its TypeScript). Probe, then pick the lightest path that works:

```bash
# 1. Already global? Use it.
command -v metaprev && metaprev --version

# 2. Bun present but metaprev not installed? Run with no install (always current):
command -v bun && bunx @hungv47/metaprev <url>

# 3. Frequent use → install once, globally (fast subsequent runs):
bun add -g @hungv47/metaprev      # or: npm i -g @hungv47/metaprev

# 4. No Bun on PATH? Install Bun first (one line), then 2 or 3:
curl -fsSL https://bun.sh/install | bash
```

Default to `bunx @hungv47/metaprev` (zero-install, current). For a user who will check cards repeatedly, install globally so runs are instant — the user asked for the CLI to be available, so install it rather than running npx every time once you've used it twice in a session. Never invent a different validator; this stack uses metaprev.

## The pushback rule (Critical Gate 4)

metaprev mirrors common SEO-tool heuristics. Two are noise — surface them, never auto-apply:

- **"Title is short."** The 50–60-char optimal is a generic SEO target. A personal name, brand, or product title is canonical and tight on purpose. Padding it to hit a count is keyword stuffing — it makes the card noisier, not better. Only suggest expanding if the title genuinely lacks information.
- **"Description is short."** Same shape. Concrete copy beats padded copy.

Never push back on: errors (always real), missing/relative `og:image`, broken (4xx/5xx) image, off-ratio or undersized image, non-image/SVG `og:image`, declared dimensions that don't match the file. If you recommend ignoring a warning, say so explicitly with the reason.

## Reading metaprev's levels

- **error** — visibly broken share. Fix immediately. (no `og:image`, 404 image, relative `og:image`, non-image response that can't be decoded.)
- **warn** — renders but degraded. (off 1.91:1 ratio, >8 MB, SVG og:image, <600 px wide, char counts way off.) Fix the structural ones; apply the pushback rule to the char-count ones.
- **info** — optional polish. (`og:image:width`/`height`, canonical, `twitter:card`.) Apply when cheap.

## Platform cache caveat (for DONE_WITH_CONCERNS)

A clean metaprev run means the *source* is correct. The platform may still show a stale card from its own cache. Tell the operator how to bust it:

- Facebook → Sharing Debugger (re-scrape): https://developers.facebook.com/tools/debug/
- LinkedIn → Post Inspector: https://www.linkedin.com/post-inspector/
- Slack → ~1 hour TTL; X → ~7 days, no manual refresh; Discord → re-paste in a different channel.

## 8-item quality summary (what a clean pass guarantees)

1. `og:image` present and an absolute URL. 2. Image returns 200 and decodes as a real image (PNG/JPEG/WebP, not SVG/HTML). 3. ~1200×630 / 1.91:1, ≥600 px wide, <8 MB. 4. Declared `og:image:width/height` match the file (or are absent). 5. Title + description present (length is advisory). 6. `twitter:card` set to `summary_large_image` for big-image cards. 7. `og:url` or canonical present. 8. The fixes were re-verified by a second metaprev run, not assumed.
