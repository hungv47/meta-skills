# Publish Confirmation Gate — publish-social

> Two-stage current-session confirmation gate for `--mode=publish` (live posting). Critical Gate 8. Brief 04 § publish-social Hard Rule: *"never publish live without explicit current-session confirmation."* This gate is that rule. Distinct from [`confirmation-gate.md`](confirmation-gate.md) — that gates D17 browser-automation **drafts** with a single `[y/N]`; this gates D18 **live posts** with two stages and a typed confirmation.

## Why a heavier gate for publish

D17's draft gate is single-stage because a bad draft is cleanable — it sits in the operator's draft area until they hit Send. A live post is **not cleanable**:

- It is **public the instant it posts** — visible to followers, indexable, screenshot-able.
- It may **accrue impressions / engagement** before the operator notices a mistake.
- Deleting it later does not undo distribution — a delete is its own action, and a deleted post can still have been seen, quoted, or archived.

So D18's gate raises friction deliberately: a **review stage** (see every full post body) and a **typed-confirmation stage** (type the literal word `PUBLISH`). A reflexive `y` cannot publish.

## When the gate fires

`--mode=publish` only. Auto-detect never resolves to publish (Critical Gate 1). For publish runs the layer order changes — critic runs **before** the gate, because a live post cannot be fixed after the fact:

```
Layer 1 (Pre-Dispatch)
  → Layer 2 (Formatter: format every post in memory + write export-mode bundle as the abort fallback)
    → Layer 3 (Critic: content gate, dims 1–7)    ← gates publish; FAIL → no gate, BLOCKED
      → Layer 3.5 (Publish Confirmation Gate)      ← HERE — two stages
        → Layer 3.6 (Publish: Typefully-X + automation-agent Send for 8)
          → Layer 4 (Manifest write + orchestrator Self-Check applies dim 8 + delivery)
```

If critic FAILs, the gate never fires — formatter is re-dispatched (max 2 cycles); still failing → `BLOCKED`. The operator never reaches a confirmation prompt for copy that did not pass the rubric. The critic-agent scores dims 1–7 pre-gate; **dim 8 (Live-Publish Safety) is applied by the orchestrator's Self-Check at Layer 4** — its checks are post-publish and cannot run pre-gate.

## Dry-run interaction

`--mode=publish --dry-run` runs Pre-Dispatch → Formatter → Critic, then **prints the publish plan instead of firing the gate**, and exits. Every post body, target account, and per-platform route (Typefully API vs browser-automation Send) is shown. No gate, no posting, no manifest mutation beyond a `dry_run: true` flag on the (un-published) bundle. Dry-run is the safe rehearsal — operators are encouraged to dry-run once before a real publish.

## Stage 1 — Review

Shown after critic PASS. Lists **every full post body** (not an 80-char preview — the operator must see exactly what goes live), the target account/handle per platform, and the route.

```
PUBLISH REVIEW — 9 posts will go LIVE. Read every post in full before continuing.

── X  →  @forsvn  (Typefully API, schedule: immediate) ──────────────────
<full X post body / thread, every post shown>

── LinkedIn  →  FORSVN (company page)  (browser-automation Send) ─────────
<full LinkedIn body>

── Instagram  →  @forsvn  (browser-automation Send) ──────────────────────
<full IG caption + hashtag stack>

  ... one full block per target platform ...

Review complete — every post above is correct and ready to go live? [y/N]
```

`N` / `n` / `no` / Enter (default) / 5-minute timeout → **abort** (see Abort behavior below). `y` / `yes` → proceed to Stage 2.

## Stage 2 — Typed confirmation

Only reached on a Stage 1 `yes`.

```
This will publish 9 posts LIVE and PUBLIC immediately. This cannot be undone —
deleting a post afterward does not undo its distribution.

Target accounts: @forsvn (X), FORSVN company page (LinkedIn), @forsvn (Instagram), ...

Type  PUBLISH  to confirm. Anything else aborts.
> _
```

The operator must type the **literal string `PUBLISH`** (case-sensitive, no surrounding text). Any other input — `publish`, `yes`, `y`, `Publish`, empty, or a 5-minute timeout — → **abort**. The typed token is recorded verbatim in the transcript and the manifest `confirmation_result` for critic dim 8 audit.

## Abort behavior

Abort at **either** stage produces zero outward side effects:

- **Nothing is posted. No drafts are created.** Abort is not a downgrade to draft mode — the operator asked to publish and chose not to; pushing drafts was not confirmed either.
- The bundle falls back to **D16 export-mode** for all 9 platforms — the export bundle Formatter already wrote in Layer 2 is the deliverable (per-platform Markdown + 4 scheduler-import files + README).
- Manifest records `confirmation_result: aborted_stage1` or `aborted_stage2` (or `timeout`), `publish_result_per_platform` all `not_attempted`, `mode_per_platform` all `export`.
- README tells the operator: "Publish aborted at the confirmation gate. Bundle shipped in export-mode — re-run with `--mode=publish` when ready, or `--mode=draft` for platform drafts."

This is the rollback. The gate aborting cleanly **is** D18's rollback path — there is no post to undo because nothing posted.

## Operator responses (summary)

| Stage | Response | Skill behavior |
|---|---|---|
| 1 | `y` / `yes` | Proceed to Stage 2 |
| 1 | `N` / `n` / `no` / Enter / timeout | Abort → export-mode bundle |
| 2 | literal `PUBLISH` | Proceed to publish (Typefully-X + automation Send for 8) |
| 2 | anything else / timeout | Abort → export-mode bundle |

Per-platform selective publish (publish 6, skip 3) is **not** in v1 — the gate is all-or-nothing for the run. An operator who wants a subset re-runs with `--platforms=x,linkedin,...`. Stage 1 review is where a wrong-subset run gets caught and aborted.

## What the gate does NOT do

- **Does not abbreviate post bodies.** Stage 1 shows every post in full — the opposite of D17's 80-char preview. Live posting warrants reading the whole thing.
- **Does not accept `y` as the final confirmation.** Stage 2 requires the typed word `PUBLISH`. A reflexive keystroke cannot publish.
- **Does not auto-publish on timeout.** Timeout = abort, at both stages.
- **Does not retry.** If a platform fails to publish after confirmation, that is a per-platform fallback (see below), not a re-prompt.
- **Does not delete or un-publish.** Once a post is live, removal is the operator's action in-platform; the manifest provides per-platform delete instructions.

## Post-publish: per-platform failure handling

Confirmation is granted once, for the run. After it, automation-agent attempts each platform's Send sequentially (3s pacing, single attempt — D17 discipline). A platform that fails to publish (selector drift / captcha / login challenge / rate limit / network) **does not re-prompt**:

- That platform falls back to its **D17 browser-automation draft** route if session cookies are present (lands a draft the operator can Send manually), else **D16 export-mode**.
- Other platforms continue.
- Manifest `publish_result_per_platform[plat]` records `published` (with `post_url`) / `failed:<reason-class>` / `fallback-draft` / `fallback-export`.

A captcha never triggers a retry or a solve attempt — immediate fallback (anti-pattern #17 territory carries over from D17 #14).

## Dim 8 enforcement (orchestrator post-publish Self-Check)

Dim 8 (Live-Publish Safety) is applied by the **orchestrator's Self-Check Before Delivery** — not the critic-agent (whose pass is pre-gate; dim 8's checks are post-publish). See `references/procedures/dispatch-mechanics.md` § Publish Layer. The Self-Check verifies:

1. Skill output transcript contains both gate stages + the operator's responses (Stage 1 `y/N` line + Stage 2 typed token line).
2. `manifest.confirmation_result` ∈ `{confirmed, aborted_stage1, aborted_stage2, timeout, dry_run}` and matches the transcript.
3. The critic PASS verdict is ordered **before** the gate prompt, which is ordered before any publish/Send log line.
4. Every `publish_result_per_platform[plat].status == "published"` row has `confirmation_result == "confirmed"`. A `published` row with any other `confirmation_result` → **auto-fail** (publish bypassed the gate — a bug).
5. `dry_run: true` runs have zero `published` rows. A dry-run that posted → **auto-fail**.

## Cross-Reference

- Critical Gate 8 in `SKILL.md`
- Dim 8 in [`rubric.md`](rubric.md)
- `agents/automation-agent.md` § Publish-Mode Behavior — the Send path the gate authorizes
- Anti-patterns #15 / #16 / #17 in [`anti-patterns.md`](anti-patterns.md) — the failure modes this gate exists to prevent
- D17's [`confirmation-gate.md`](confirmation-gate.md) — the lighter single-stage gate for drafts; this file is its publish-tier counterpart
