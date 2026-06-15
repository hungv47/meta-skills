# Preview OG — Worked Example [EXAMPLE]

**Scenario:** a Next.js (App Router) marketing site. The team just added an og:image; the link looks blank when pasted in Slack. Target: the local dev server.

## 1. Resolve target + ensure CLI

Dev server on `http://localhost:3000`. Probe the CLI:

```bash
command -v metaprev || command -v bun   # bun present, metaprev not global
```

→ run via `bunx` (no install). (Second use this session → `bun add -g @hungv47/metaprev`.)

## 2. Diagnose

```bash
bunx @hungv47/metaprev issues http://localhost:3000 --json
```

```json
[
  { "level": "error", "field": "og:image",
    "message": "og:image is not an absolute URL (\"/og.png\"). Many crawlers will fail to fetch it." },
  { "level": "warn", "field": "title",
    "message": "Title is short (9 chars). Optimal: 50–60 chars" }
]
```

Exit code 1 (an error present).

## 3. Triage

- `og:image` relative → **real break** (Critical Gate 3). Fix.
- `title is short` → **advisory** (Gate 4 / pushback). The title is the brand name, intentional. Surface, don't pad.

## 4. Fix

Root cause: no `metadataBase`, so Next emits the relative `/og.png`. Edit `app/layout.tsx`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://forsvn.com'),   // ← added
  openGraph: { images: ['/og.png'] },            // now resolves to https://forsvn.com/og.png
}
```

(fixes.md → "make og:image absolute" → Next.js App Router.)

## 5. Re-verify (objective gate)

```bash
bunx @hungv47/metaprev issues http://localhost:3000 --json
```

```json
[ { "level": "warn", "field": "title", "message": "Title is short (9 chars)..." } ]
```

Exit 0. The error cleared; only the advisory warn remains. Fix accepted.

## 6. Report

Write `docs/forsvn/artifacts/marketing/preview-og-2026-05-29-forsvn-com.md`:

- **Target:** `http://localhost:3000` · HTTP 200
- **Issues found:** 1 error (relative og:image), 1 advisory warn (short title)
- **Fixes applied:** `app/layout.tsx:6` — added `metadataBase`
- **Verification:** errors 1 → 0; re-run clean but for the advisory
- **Remaining advisory:** "title is short" — kept; brand name is canonical (pushback rule). Note for the operator: re-scrape on the Facebook Sharing Debugger if the old blank card was already cached.

**Status: DONE.**

### --fast variant

Same diagnose → fix → re-verify, reported inline (no artifact written). Ends with: `Ran in --fast mode; rerun without the flag for the artifact record.`
