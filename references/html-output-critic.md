---
title: HTML Output Critic — quality rubric for review-surface HTML previews
lifecycle: canonical
status: stable
produced_by: meta-skills (v3 review-surface overhaul, 2026-05-26)
consumers: every skill that emits `review_surface: html`; `scripts/lint-html-output.ts`
load_class: PLAYBOOK
---

# HTML Output Critic

**The quality rubric every `review_surface: html` artifact must pass. Ten
binary checks; nine PASS = ship-ready. One FAIL = fix before merging.**

The lint script `scripts/lint-html-output.ts` runs this rubric in the
pre-merge gate. Skills emitting HTML should also run it locally before
opening the preview for review.

The visual contract is [[review-surface-design]]. This file is the *checker*
— what we verify before declaring the HTML good.

---

## When this critic fires

- Every HTML file under `references/_html/exemplars/`
- Every HTML file under `.forsvn/artifacts/*.html`
- Every HTML emitted by a skill that declares `review_surface: html`

Not run on archived HTML in `.forsvn/artifacts/.archive/` — those have
served their purpose.

---

## The 10-check rubric

| # | Check | Failure surface | Severity |
|---|---|---|---|
| 1 | **Five-region layout present** — topbar / left-controls / stage / footer / hidden artifact-data block (left-controls may collapse responsively at <800px but the region must exist in markup) | Missing `.topbar`, `.left-controls`, `.stage`, `.footer`, or `#artifact-data` selector | hard fail |
| 2 | **`data-stack` attribute on `<html>`** matches `air \| water \| fire \| earth` | Wrong stack chip color, wrong theme tokens loaded | hard fail |
| 3 | **Decision-state pill** present in topbar and matches MD frontmatter | Operator sees stale state | hard fail |
| 4 | **Roughdraft deeplink** in footer (`href` starts with `roughdraft://open?path=`) | Operator can't return to MD review | hard fail |
| 5 | **WCAG AA contrast** (4.5:1 minimum on body text against its background) | Unreadable on certain monitors | hard fail |
| 6 | **No decision capture** — no `<form>`, no `<button onclick>` that mutates persistent state, no postback. The only external action is the `roughdraft://` deeplink | Decision capture drift | hard fail |
| 7 | **Tokens.css imported** via `<link rel="stylesheet" href="…tokens.css">`; no inline `:root { --bg: … }` overrides for chrome tokens | Element drift between skills | hard fail |
| 8 | **Stage typography uses element's `--font-head` / `--font-body`** (system-font-only fallback is allowed where the documented stack provides it; mixing fonts across elements is not) | Visual incoherence between exemplars | soft fail |
| 9 | **Motion is CSS only** — no `<script src>` referencing GSAP / motion-one / animejs / lottie / popmotion; one inline `<script>` block (max) wired to `data-toggle` attributes is allowed | Bundle bloat; preview becomes a runtime, not a static artifact | hard fail |
| 10 | **`<title>` tag** matches `<artifact-title> · <skill> · <date>` pattern | Hard to identify in a browser tab list | soft fail |

**Severity:**
- **hard fail** — the lint script exits non-zero; the pre-merge gate blocks the merge.
- **soft fail** — warning emitted; merge proceeds but the producer is notified.

---

## How `scripts/lint-html-output.ts` implements each check

Implementation reference for the lint script in WS-10. The script does not
render the HTML; it parses the source via regex against the markup contract.

| # | Detection |
|---|---|
| 1 | `<header class="topbar">` and `<aside class="left-controls">` and `<main class="stage">` and `<footer class="footer">` and `id="artifact-data"` all present |
| 2 | `<html ... data-stack="(air\|water\|fire\|earth)"` |
| 3 | `<span class="decision-pill" data-state="(pending\|approved\|denied\|suggested)">` matches the same value as `decision_state` in the `#artifact-data` JSON block |
| 4 | `href="roughdraft://open?path=…"` present in `.footer` markup |
| 5 | Tokens.css computed contrasts (chrome + stack pairs) precomputed in this rubric; checked by element. New per-page inline color overrides flagged separately (manual review). |
| 6 | No `<form`, no `onclick=` (allow whitelisted `data-toggle`/`data-copy-source` chrome.js bindings), no `fetch(`/`XMLHttpRequest`/`new WebSocket` |
| 7 | `<link rel="stylesheet" href=` contains `tokens.css`; no `<style>` block that defines `--chrome-bg` / `--chrome-panel` / `--chrome-border` / `--chrome-text` |
| 8 | Per-element CSS `font-family:` in inline `<style>` only references the documented font names for that element |
| 9 | No `<script src="…(gsap\|motion-one\|animejs\|lottie\|popmotion)…">` |
| 10 | `<title>` content matches regex `<artifact-title> · <skill> · \d{4}-\d{2}-\d{2}` |

---

## Anti-patterns the critic catches

1. **Skill author copies brand-explore.html shape, forgets the topbar** → check 1 fails.
2. **Skill loads water tokens for a product artifact** → check 2 fails (wrong `data-stack`) or check 7 fails (inline override).
3. **Skill stamps `decision_state: approved` in the HTML pill but MD says `pending`** → check 3 fails (mirror inconsistency).
4. **Skill adds an "Approve" button to the HTML** → check 6 fails.
5. **Skill drops in GSAP for a fancy reveal** → check 9 fails.

Each of these is a real failure mode the rubric was designed against.

---

## Related refs

- [[review-surface-design]] — visual contract the rubric checks against
- [[review-surface-template]] — structural contract
- [[reviewable-artifact-contract]] — when HTML is required at all
