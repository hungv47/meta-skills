# Preview OG — Anti-Patterns [ANTI-PATTERN]

Detection rules and the right move. Most are caught by Critical Gates 2–4.

## 1. Padding copy to silence advisory warns

- **Detection:** rewriting a tight title/description purely to clear "title is short" / "description is short."
- **Bad:** `Hung Vinh` → `Hung Vinh — Senior Growth Operator, AI Tools, Open Source, Saigon` to hit 60 chars.
- **Good:** surface the warn, explain it's advisory, leave the canonical title. Pushback rule, playbook § Pushback.

## 2. Declaring `og:image:width/height` that don't match the file

- **Detection:** adding dimension tags from memory or a guess.
- **Why it's worse than omitting:** Slack and Discord trust the declared values for first-paint and mis-crop when they're wrong. Absent beats wrong.
- **Good:** read the real pixels (metaprev reports them) and declare those, or omit the tags.

## 3. Shipping a relative `og:image`

- **Detection:** `content="/og.png"` or `content="og.png"`.
- **Good:** absolute `https://…`. In Next.js set `metadataBase`; in Astro use `new URL(image, Astro.site)`. fixes.md.

## 4. "Fixed" without re-verifying

- **Detection:** editing a meta tag and reporting DONE without re-running metaprev.
- **Why:** the edit may not reach the served HTML (build cache, wrong layout, SSR vs static, a `<base href>`). The objective gate is the re-run, not the diff.
- **Good:** re-run `metaprev issues <url> --json`; confirm the error count dropped.

## 5. Editing beyond the meta surface

- **Detection:** refactoring components, restyling the page, "while I'm here" changes.
- **Good:** touch only head tags / og:image config. Out-of-scope issues get one flagged line, not a fix (stack scope rule).

## 6. Generating the og:image inside this skill

- **Detection:** hand-authoring SVG/HTML art or invoking an image model directly to make the card image.
- **Good:** hand the spec (1200×630, <8 MB, PNG/JPEG/WebP) to `produce-asset`, then re-verify. This skill validates and wires the tag; it doesn't produce artwork.

## 7. Reaching for a third-party validator

- **Detection:** suggesting OpenGraph.xyz / metatags.io / the Facebook Debugger as the check.
- **Good:** run metaprev locally — it covers the same checks against the actual served HTML, works on `localhost`, and needs no copy-paste. The Facebook Debugger / LinkedIn Post Inspector are still the right tools for busting a platform's *cache* after the source is fixed (playbook § cache caveat).

## 8. Treating a clean run as "it'll show everywhere now"

- **Detection:** promising the card will render immediately on a platform that already cached the old one.
- **Good:** a clean metaprev run verifies the *source*. Note the platform-cache step (re-scrape / TTL) for any surface that already fetched the link.
