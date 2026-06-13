---
title: HTML Output Critic — quality rubric for review-surface HTML previews
lifecycle: canonical
status: stable
produced_by: meta-skills (U9 review-webapp design pass rev 2, 2026-06-12; v3 overhaul 2026-05-26)
consumers: bin/lint-html-output.ts; the plugin renderer; exemplar maintenance
load_class: PLAYBOOK
---

# HTML Output Critic

**The quality rubric every `review_surface: html` twin must pass. Ten binary
checks; one hard FAIL = fix before merging.**

`bin/lint-html-output.ts` runs this rubric (exemplars + live artifact twins).
Since U9 the twin is produced only by the plugin renderer, so the rubric's job
is catching **renderer/template regressions and hand-edited drift**, not
per-skill authoring mistakes.

The visual contract is [[review-surface-design]]; the structural contract is
[[review-surface-template]]. This file is the *checker*.

---

## When this critic fires

- Every HTML file under `assets/_html/exemplars/`
- Every live `.forsvn/artifacts/**.html` twin (not `.archive/`)
- Canonical top-level roots (`brand/`, `architecture/`, `research/`)

---

## The 10-check rubric

| # | Check | Failure surface | Severity |
|---|---|---|---|
| 1 | **Instrument layout present** — chrome strip (`.strip`), reading stage (`.stage`), pinned ledger (`#decision-capture`), hidden `#artifact-data` block | Missing region = renderer/template drift | hard fail |
| 2 | **`data-stack` on `<html>`** matches `air \| water \| fire \| earth` | Wrong register loaded | hard fail |
| 3 | **Decision-state pill** present in the strip and matches the `#artifact-data` mirror | Operator sees stale state | hard fail |
| 4 | **Read-as affordance present** (`.readas` — the folded preview-mode chooser) AND **no artifact path in visible chrome** (paths live only in the JSON config blocks) | Orientation loss / identity-by-path drift | hard fail |
| 5 | **WCAG AA contrast** (4.5:1 body text) — token pairs pre-verified per theme in the design spec; the lint flags suspicious inline color/background pairs | Unreadable on certain monitors | soft fail |
| 6 | **Decision capture only through the documented localhost contract** — one `<form id="decision-capture">` (`action="javascript:void(0)"` or `/done` on localhost) + `#preview-config` declaring `{"static":true}` at rest. Forbidden: any other `<form>`, inline `onclick=`, `fetch()` to a non-localhost target, `XMLHttpRequest`, `WebSocket`. (chrome.js's runtime targets — `/done`, `/edit`, the artifact source path — are all same-origin localhost.) | Decision/edit capture drift or unbounded postback | hard fail |
| 7 | **tokens.css linked**; no inline `:root { --chrome-* }` overrides | Theme drift | hard fail |
| 8 | **Typography via the token families only** (`var(--font-head/-body/-mono)`; no literal foreign families) | Visual incoherence | soft fail |
| 9 | **Motion is CSS only** — no GSAP / motion-one / animejs / lottie / popmotion | Preview becomes a runtime | hard fail |
| 10 | **`<title>`** matches `<artifact-title> · <skill> · <date>` | Hard to identify in a tab list | soft fail |

**Severity:** hard fail → lint exits non-zero, gate blocks; soft fail →
warning, producer notified.

---

## Implementation notes (bin/lint-html-output.ts)

- Check #6 strips `<pre>`/`<code>`/comments/JSON-script blocks first so
  documentation examples don't false-positive.
- Check #4's path scan also strips the JSON blocks — `preview-config.mdPath`
  is the legitimate (and only) home of the artifact path.
- Check #3 cross-references the pill's `data-state` with the
  `#artifact-data` JSON (`decision_state`).
- The v2-era Roughdraft-deeplink requirement is **retired** with the footer;
  the read-as menu is its successor (terminal `--md` / Proof collab).

---

## Anti-patterns the critic catches

1. **A hand-edited twin reintroducing the old five-region chrome** → #1.
2. **A twin checked in with a live (non-static) preview-config** → #6 — a
   remote `endpoint` would aim the reviewer's decision off-box.
3. **Pill says `approved` while the mirror says `pending`** → #3.
4. **A path pasted into the masthead or crumb** → #4.
5. **A second `<form>` or a remote `fetch()`** → #6.
6. **GSAP for a fancy reveal** → #9.

---

## Related refs

- [[review-surface-design]] — visual contract the rubric checks against
- [[review-surface-template]] — structural contract
- [[reviewable-artifact-contract]] — when HTML is required at all
