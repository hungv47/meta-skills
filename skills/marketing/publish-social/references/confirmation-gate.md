# Confirmation Gate — publish-social

> Single-confirm protocol that gates browser-automation drafts. Critical Gate 7. Brief 04 § publish-social Hard Rule ("never publish live without explicit current-session confirmation") lands here as the draft-equivalent: never submit drafts via automation without explicit current-session confirmation.

## Why a confirmation gate

D17 introduces browser-automation drafts. Even though drafts are not live posts, they still:

- **Land in the operator's platform UI** (LinkedIn drafts, IG drafts, Reddit drafts, etc.)
- **Are visible to anyone with platform access** to the operator's account
- **Cost time to clean up** if formatter has a bug and creates 8 garbage drafts
- **Can be embarrassing** if accidentally Sent without review

A single human checkpoint between formatter and automation prevents these failure modes.

## When the gate fires

After Layer 2 formatter completes (all per-platform drafts formatted in memory + bundle written) AND before Layer 3 critic AND before automation-agent dispatch:

```
Layer 1 (Pre-Dispatch)
  → Layer 2 (Formatter: format all drafts, write bundle)
    → Layer 2.5 (Confirmation Gate)  ← HERE
      → Layer 2.6 (Automation, if confirmed and cookies present)
        → Layer 3 (Critic: rubric review, dims 1–7)
          → Layer 4 (Delivery)
```

If draft route was NOT resolved for any platform (auto-detect picked export for all 9 because no cookies / no Typefully key), the gate is **skipped** — no automation runs, no submit happens.

## Prompt format

```
Drafts ready for review. Will submit via browser-automation:

  X         → Typefully API draft (D16 — already drafted at https://typefully.com/t/...)
  LinkedIn  → "First 80 chars of the LinkedIn body…" [needs cookies: YES, last verified: 2026-05-15]
  Instagram → "First 80 chars of the Instagram caption…" [needs cookies: YES, last verified: 2026-05-15]
  Facebook  → "First 80 chars of the FB body…" [needs cookies: YES, last verified: 2026-05-15]
  TikTok    → "First 80 chars of the TT caption…" [needs cookies: NO, will fallback to export]
  YouTube   → "First 80 chars of the YT description…" [needs cookies: YES, last verified: 2026-05-15]
  Threads   → "First 80 chars of the Threads body…" [needs cookies: YES, last verified: 2026-05-15]
  Bluesky   → "First 80 chars of the Bluesky body…" [needs cookies: YES, last verified: 2026-05-15]
  Reddit    → "Title: First 60 chars of title…" [needs cookies: YES, last verified: 2026-05-15]

Submit drafts to N platforms via browser-automation? [y/N]
```

Where N = number of platforms with cookies present + draft mode resolved.

Platforms without cookies → already marked `fallback-export` in mode-resolution; surfaced in the prompt but don't count toward N.

## Operator responses

| Response | Skill behavior |
|---|---|
| `y` / `Y` / `yes` | Proceeds to automation-agent dispatch (sequential per-platform); each platform's `automation_result_per_platform[plat]` set per outcome |
| `N` / `n` / `no` / Enter (default) | All draft-route platforms fall back to D16 export-mode; manifest reports `confirmation_declined` for each; bundle ships with per-platform Markdown + scheduler-imports for operator's manual paste |
| `edit` (future, D17.next) | Returns to operator with per-platform draft preview for inline editing; not in D17 v1 |
| Timeout (>5 minutes no response) | Treated as `no` — fallback to export |

## What the gate does NOT do

- **Does not show full draft bodies** — only first-80-chars preview per platform. Reduces information overload across 8-9 platforms.
- **Does not show media previews** — media references listed by path; operator opens manually if needed.
- **Does not let operator selectively confirm** — single yes/no for all. Per-platform selective confirmation is a D17.next candidate (added complexity for v1).
- **Does not auto-publish** — only saves drafts. Publish requires `--mode=publish` (D18) with separate confirmation gate.
- **Does not re-prompt on automation failures** — if LinkedIn fails mid-run, other platforms continue; operator sees per-platform results in manifest post-run, doesn't re-confirm.

## Critic dim 7 enforcement

Confirmation gate must have run before any automation. critic-agent dim 7 verifies:

1. Skill output transcript contains the prompt text + operator's response (logged for audit).
2. `confirmation_result` field in manifest is one of: `confirmed`, `declined`, `timeout`.
3. If any platform's `automation_result_per_platform[plat].status == "success"` AND `confirmation_result != "confirmed"` → critic dim 7 auto-fail (means automation ran without confirmation — a bug).

## Anti-Patterns the Gate Prevents

| Pattern | Without gate | With gate |
|---|---|---|
| Buggy formatter creates 8 garbage drafts | Drafts land in platforms; operator has to clean up | Operator reviews 80-char preview; declines if obviously wrong |
| Cookies stale; flow hangs and operator doesn't notice | Multiple drafts attempted, all fail, log noise | Operator sees state in preview; declines or aborts |
| Operator accidentally invokes publish-social on wrong write-social slug | Drafts go to platforms with wrong copy | Preview shows wrong copy; operator declines |
| Drafts ready but operator wants to wait a day | Has to abort mid-run | Declines gate; bundle ships export-only; runs automation when ready |

## What if Operator Wants to Skip the Gate

Not in v1. Always-confirm is intentional. Operators who want frictionless can use D16's export-mode only (no draft route, no gate) OR wait for D17.next which may add a `--no-confirm` flag for trusted automation pipelines.

## Cross-Reference

- Critical Gate 7 in SKILL.md
- Dim 7 in `references/rubric.md`
- automation-agent's Pre-Flight Checks (`agents/automation-agent.md` § Pre-Flight Checks) include confirmation-result check
- Anti-pattern #14 in `references/anti-patterns.md` ("silent auto-submit") — the gate's reason for existing
