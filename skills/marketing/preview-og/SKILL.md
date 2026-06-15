---
name: preview-og
description: "Previews, validates, and fixes Open Graph / Twitter share cards — how a link renders on Facebook, X, LinkedIn, and Discord/Slack. Runs the metaprev CLI to catch missing or broken og:image, relative URLs, wrong dimensions, oversized files, and weak titles, then applies fixes and re-verifies. Use before shipping a page or when a share preview looks broken. Not for page copy (use write-copy), search/AEO (use optimize-seo), og:image artwork (use produce-asset), or posting (use publish-social)."
argument-hint: "[url or localhost dev server]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.1.0"
  budget: standard
  estimated-cost: "$0.10-0.50"
---

# Preview OG — Share-Card Validation & Fix

Runs the **metaprev** CLI against a URL (local dev server or deployed), reads how the link renders on Facebook / X / LinkedIn / Discord-Slack, fixes what's broken in the codebase, then re-verifies. Routing: [`routing.yaml`](routing.yaml) · why / when-not / install / pushback: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

**Core question:** When someone pastes this link into a chat or feed, does the card render — right image, right size, right title — or is it broken or blank?

## Critical Gates — load first

1. **CLI present before running.** metaprev runs on Bun. Probe for it; install if missing — never stall on a missing tool. Exact probe + install commands: [`references/playbook.md`](references/playbook.md) § Install.
2. **Verify after fixing (objective gate).** Re-run metaprev after every fix; the tool, not the agent's judgment, is the pass/fail signal. The re-run passes only when:
   - [ ] `metaprev issues <url> --json` exits 0 — zero errors (advisory warns allowed)
   - [ ] `og:image` is an absolute URL returning HTTP 200 with an image content-type
   - [ ] declared `og:image:width`/`og:image:height` match the real file's dimensions
   Auto-fail: a 4th fix cycle — stop at 3 and report `DONE_WITH_CONCERNS`.
3. **`og:image` must be an absolute URL.** A relative `/og.png` resolves to nothing when a crawler fetches it standalone — the #1 silent break. Always emit a full `https://…`.
4. **Noise pushback.** `title is short` / `description is short` are advisory SEO heuristics, not breaks — a canonical brand or product title is intentional. Surface them; never pad copy to hit a char count. § Pushback in the playbook.
5. **Scope.** Touch only the meta / OG surface (head tags, og:image config). No unrelated refactors.

## Before Starting

Per `references/_shared/before-starting-check.md` [PROCEDURE]. Resolve the **target**: a localhost dev server (any framework / port) or a deployed URL. If none is derivable from the request or repo, ask once (Cold Start). Mode resolution per `references/_shared/mode-resolver.md` [PROCEDURE]; `--fast` runs one diagnose→fix→verify pass without the artifact write.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Pre-Dispatch (Cold Start)

Needed dimensions — resolve from the repo / running dev server first, ask once (bundled) only for what's missing:

1. **Target** — localhost dev-server URL/port or deployed URL. → routing only
2. **Canonical production origin** — the absolute base URL `og:image` must resolve against (Gate 3). → `technical`
3. **Platforms that matter** — Facebook / X / LinkedIn / Discord-Slack (default: all four). → routing only

## Pipeline

1. **Resolve target** — localhost dev server or deployed URL.
2. **Ensure CLI** — Gate 1.
3. **Diagnose** — `bunx @hungv47/metaprev issues <url> --json` for structured issues (exit 1 = at least one error). For a visual pass, `bunx @hungv47/metaprev <url> -o docs/forsvn/artifacts/marketing/preview-og-<date>.html --no-open`.
4. **Triage** — separate errors (real breaks) from advisory warns (Gate 4).
5. **Fix** — apply framework-aware fixes in the codebase: [`references/fixes.md`](references/fixes.md) [PROCEDURE] (Next / Astro / SvelteKit / Vite / plain HTML — absolute URL, dimensions, missing tags, content-type).
6. **Re-verify** — Gate 2. Loop until `issues` returns clean or only advisory warns remain (max 3 fix cycles, then `DONE_WITH_CONCERNS`).
7. **Report** — write the artifact + completion status.

## Artifact Contract

Output: `docs/forsvn/artifacts/marketing/preview-og-<YYYY-MM-DD>-<slug>.md`. Frontmatter + sections (Target / Issues found / Fixes applied / Verification / Remaining advisory): [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]. Skills emit Markdown only; the `.html` metaprev preview is a transient review surface, not the artifact.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — top hits: padding title / description to silence advisory warns; declaring `og:image:width`/`height` that don't match the real file (Slack / Discord mis-crop); shipping a relative `og:image`; calling it done without the verify re-run.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/_shared/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — metaprev re-run returns clean (or only advisory warns the operator chose to keep); fixes applied + artifact written.
- **DONE_WITH_CONCERNS** — fixes applied but one issue needs an asset the agent can't produce (a correctly-sized og:image → hand off to `produce-asset`), or a platform cache must clear before it shows.
- **NEEDS_CONTEXT** — no target URL resolvable; ask for the dev-server port or deployed URL.
- **BLOCKED** — target unreachable (auth wall / down), or Bun cannot be installed.

## Worked Example

Relative `og:image` on a Next.js site → fix `metadataBase` → re-verify clean: [`references/examples/walkthrough.md`](references/examples/walkthrough.md) [EXAMPLE].

## References

- **Playbook + install + pushback:** [`references/playbook.md`](references/playbook.md) [PLAYBOOK]
- **Fixes (framework recipes):** [`references/fixes.md`](references/fixes.md) [PROCEDURE]
- **Format:** [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]
- **Anti-patterns:** [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]
- **Example:** [`references/examples/walkthrough.md`](references/examples/walkthrough.md) [EXAMPLE]
- **Shared:** `references/_shared/{before-starting-check, mode-resolver}.md`
