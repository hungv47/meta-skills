# Anti-Patterns — publish-social

> 17 patterns: 7 publish-social-specific + 3 D17 browser-automation + 3 D18 live-publish + 4 cross-cutting marketing-stack rows. Critic-agent dims 6 / 7 / 8 enforce; orchestrator re-reads before each bundle ships.

## publish-social-Specific (7)

### 1. Silent mode downgrade

**Pattern:** Operator requests `--mode=draft` for LinkedIn; formatter silently falls through to export-mode without surfacing the deferral.

**Why it hurts:** Operator believes the LinkedIn draft is live in their LinkedIn account; reality is it's a Markdown file. Discovery happens hours later when they go to "review the draft" — work is lost or duplicated.

**Fix:** Critical Gate 2 enforces. Non-X `--mode=draft` returns `BLOCKED` with explicit deferral message before any file is written. Never silently downgrade.

### 2. Credential leakage

**Pattern:** A platform's API key, OAuth token, or session cookie value appears in any emitted file (manifest, README, scheduler-import, per-platform draft, debug log).

**Why it hurts:** `.forsvn/` is checked into git. A leaked key in a draft means the key is in the commit history forever. Even if rotated, the historical artifact survives.

**Fix:** Critical Gate 3 + critic dim 6 auto-fail. Credential detection is binary (`true`/`false`); never the value. Error messages reference env var NAME or file PATH only. Setup helper ensures `.forsvn/credentials/` gitignored.

### 3. Char-cap silent truncation

**Pattern:** Body copy exceeds platform hard limit; formatter trims silently to fit without flagging the trim.

**Why it hurts:** The CTA or key argument may be the part that gets cut. Operator publishes and the post lands without the punchline.

**Fix:** Critical Gate 4 + critic dim 1 auto-fail. Any over-limit body = FAIL, formatter re-dispatched with explicit "trim or thread-split" instruction. Never silent truncation.

### 4. Mass-tagging

**Pattern:** Post includes 5+ @-mentions on IG / X / FB (shadowban trigger on those platforms; algorithmic penalty on LinkedIn for "engagement bait").

**Why it hurts:** Even legitimate tags (collaborators, customers) trigger automated spam classifiers when stacked. Account-level penalty risk.

**Fix:** Critic dim 6 flags any post with >3 @-mentions; orchestrator re-dispatches with "remove non-essential @-mentions" instruction. Hard cap at 3 per post; operator override required for more.

### 5. Link-in-bio bait

**Pattern:** IG / TikTok caption ends with "link in bio" but operator hasn't actually updated the bio link.

**Why it hurts:** Audience clicks the bio, lands on a stale link. Conversion lost; trust erosion.

**Fix:** Critic dim 6 flags "link in bio" mentions; manifest's Verification Checklist includes "Bio link points to expected destination" as an operator-confirmed checkbox. Formatter does NOT touch the bio (out of scope).

### 6. Shadowban-trigger copy

**Pattern:** Copy uses banned words per platform (e.g., explicit COVID claims on Meta, regulated-category claims on TikTok, anti-platform claims on X like "Elon" criticism that has historically been throttled).

**Why it hurts:** Post is shown to a tiny fraction of audience; appears to "publish fine" but engagement craters. Operator may not realize for days.

**Fix:** Each `references/platforms/[platform].md` § Anti-Patterns lists current banned-word patterns. Critic dim 6 cross-checks. Hard fail on any hit; orchestrator re-dispatches with "rephrase: <quoted banned word>" instruction.

### 7. Scheduler-CSV column drift

**Pattern:** Operator's scheduler tool has updated its import spec (e.g., Buffer added a `tags_alt` column); publish-social emits the old schema and Buffer rejects the import.

**Why it hurts:** Operator imports the CSV, gets an error, has to hand-tune. Defeats the "paste-ready file" value proposition.

**Fix:** `references/scheduler-formats.md` carries vintage date + per-scheduler hand-tune notes. README's scheduler-import file map warns "verify against your scheduler's current import spec." When a scheduler changes its spec, update `scheduler-formats.md` and bump publish-social version.

## D17 Browser-Automation Patterns (3)

### 12. Silent auto-submit (D17)

**Pattern:** publish-social proceeds with browser-automation drafts without showing the operator a preview or asking for confirmation. The 8 drafts land in platform UIs before operator can review.

**Why it hurts:** Even drafts are visible state. A buggy formatter creating 8 garbage drafts in LinkedIn / IG / FB / TikTok / etc. is hours of manual cleanup + reputational risk if drafts are seen before deletion.

**Fix:** Critical Gate 7 enforces. confirmation-gate.md defines the single-confirm protocol; gate fires after formatter completes and before automation-agent dispatch. Critic dim 7 verifies: gate-prompt text in transcript + operator response logged + `confirmation_result` field matches transcript + no success rows without `confirmation_result == "confirmed"`.

### 13. Cookie leakage (D17)

**Pattern:** A session cookie value (LinkedIn `li_at`, Instagram `sessionid`, etc.) appears in any emitted file (manifest / per-platform drafts / scheduler-imports / README) OR in an automation log line OR in an error message.

**Why it hurts:** Cookies are credential-equivalent. If `.forsvn/` is ever shared (manual paste, screen share, accidental git push), the cookie leak = account compromise. Worse than D16's credential leak because cookies grant full session access (not just draft API).

**Fix:** Critical Gate 3 (extends from D16) + Critic dim 7 auto-fail. Cookie values passed to automation-agent at dispatch only; never logged; never written to bundle. Critic dim 7 greps every emitted file + log for substring matches of each platform's cookie string; any match = auto-fail. Error messages reference cookie file path or env var name only.

### 14. Captcha-bypass attempts (D17)

**Pattern:** automation-agent encounters a captcha on a platform; retries the automation, attempts to solve the captcha, or pings the operator to solve interactively.

**Why it hurts:** (a) Retry-on-captcha = account-suspension risk — platforms log retry patterns as bot signatures. (b) Solving captcha via UI inspection / image recognition = TOS violation on most platforms. (c) Pinging operator interactively = synthetic-action signature; operator's normal browser session wouldn't produce that pattern.

**Fix:** Any captcha detection → IMMEDIATE fallback to export-mode for that platform; no retry; no solve attempt; no operator-prompt. automation-agent's flow specs include captcha-element selectors for detection; flow exits with `failed:captcha` reason-class. Critic dim 7 auto-fails if "retry" log line appears within 1s of "captcha" detection log line.

## D18 Live-Publish Patterns (3)

### 15. Publish without two-stage confirmation (D18)

**Pattern:** `--mode=publish` posts live after a single `[y/N]` (D17's draft-tier gate) — or worse, posts with no gate at all.

**Why it hurts:** A live post is public the instant it lands. A reflexive `y` should never be able to publish to 9 accounts. The draft gate's single prompt was calibrated for cleanable drafts, not irreversible posts.

**Fix:** Critical Gate 8 + `references/publish-confirmation-gate.md`. publish requires the **two-stage** gate: Stage 1 review (every full post body shown) → Stage 2 typed `PUBLISH` (the literal word — not `y`, not `yes`). Critic dim 8 auto-fails any `published` row whose `confirmation_result != "confirmed"`.

### 16. Publish on critic FAIL (D18)

**Pattern:** For `--mode=publish`, the skill runs the confirmation gate and posts before (or instead of) the critic pass — a live post that never cleared the 8-dim rubric.

**Why it hurts:** Export / draft modes can run critic *after* emission because a draft is fixable. A live post is not — char-cap overflow, a credential leak, a shadowban-trigger word goes public uncorrected. The D16/D17 critic-after ordering is unsafe for publish.

**Fix:** Critical Gate 8 reorders publish runs: Formatter → **Critic (full 8-dim)** → two-stage gate → Publish. Critic FAIL → re-dispatch formatter (max 2 cycles); still failing → `BLOCKED`, the gate never fires. Critic dim 8 auto-fails if the transcript shows a publish action before the critic PASS verdict.

### 17. Dry-run that posts (D18)

**Pattern:** `--mode=publish --dry-run` is meant to print the publish plan and exit — but a bug fires the gate or the Send path and something goes live.

**Why it hurts:** Dry-run is the safe rehearsal operators are told to run first. If dry-run can post, the one affordance built to be consequence-free becomes the most dangerous.

**Fix:** Dry-run runs Pre-Dispatch → Formatter → Critic, then prints the plan and exits — it never reaches the gate or the publish layer. Manifest carries `dry_run: true`. Critic dim 8 auto-fails if a `dry_run: true` run has any `published` row.

## Cross-Cutting Marketing-Stack Rows (4)

### 8. Cross-stack contract drift

**Pattern:** write-social schema changes (e.g., adds a `thread_split_hint` field); publish-social doesn't update; bundles miss the new field silently.

**Why it hurts:** Downstream evaluate-content can't read the field; operator manually re-derives.

**Fix:** Per-stack schema changes require atomic update across upstream + downstream skills. Format-conventions § Schema Change Discipline enforces. publish-social pre-dispatch validates write-social artifact against expected schema and emits NEEDS_CONTEXT if version mismatch.

### 9. Brand-system absent → token fabrication

**Pattern:** No `brand/BRAND.md`; formatter improvises voice rules or sacred elements.

**Why it hurts:** Per-platform formatting drifts from brand voice; sacred elements (e.g., specific phrasing the brand always uses) get rewritten.

**Fix:** SKILL.md `requires: brand/BRAND.md`. Missing → NEEDS_CONTEXT → defer to create-brand. Never improvise.

### 10. Skill-deference miss

**Pattern:** Bundle ships with placeholder "MEDIA REQUIRED" for IG when produce-asset was a natural upstream call; operator manually attaches media after the fact.

**Why it hurts:** Production pipeline broken; operator does work that the stack should have orchestrated.

**Fix:** Pre-dispatch checks: if IG/FB/X-carousel/etc. targeted AND no produce-asset manifest provided AND brief-graphic artifact exists for the slug, surface "consider running produce-asset first" as a soft prompt (not a hard block — operator may have hand-curated media).

### 11. Artifact schema drift

**Pattern:** Manifest frontmatter adds an undocumented field; downstream evaluate-content's parser breaks.

**Why it hurts:** Loop infra collapses silently. Critic-overrides log loses entries. Promotion-to-experience script breaks.

**Fix:** Format-conventions § Frontmatter is the single source of truth. Adding a field requires bumping `version` in frontmatter + CHANGELOG entry. Format-conventions § Schema Change Discipline reiterates.

## How to Use

- **Pre-dispatch:** orchestrator re-reads this file before formatter starts (5-line scan; the patterns are stable).
- **Critic-time:** critic dim 6 explicitly checks #2 (credential leak), #4 (mass-tagging), #5 (link-in-bio bait — flag only), #6 (shadowban triggers).
- **Post-bundle:** if a pattern fires on the operator's side (e.g., they discover #3 char-cap silent truncation after publishing), log via `scripts/log-critic-override.ts` with `--skill publish-social --dimension anti-pattern --reason <pattern-number>` so the rubric can be revised in a future slice.

## Quick Reference Card

| # | Pattern | Critical-gate enforced? | Critic-dim flagged? |
|---|---|---|---|
| 1 | Silent mode downgrade | Yes (Gate 2) | — |
| 2 | Credential leakage | Yes (Gate 3) | Yes (dim 6 auto-fail) |
| 3 | Char-cap silent truncation | Yes (Gate 4) | Yes (dim 1 auto-fail) |
| 4 | Mass-tagging | — | Yes (dim 6) |
| 5 | Link-in-bio bait | — | Yes (dim 6 soft flag) |
| 6 | Shadowban-trigger copy | — | Yes (dim 6) |
| 7 | Scheduler-CSV column drift | — | Yes (dim 5) |
| 8 | Cross-stack contract drift | Yes (pre-dispatch) | — |
| 9 | Brand-system absent → fabrication | Yes (pre-dispatch) | — |
| 10 | Skill-deference miss | — | — (soft prompt only) |
| 11 | Artifact schema drift | Yes (format-conventions) | — |
| 12 | Silent auto-submit (D17) | Yes (Gate 7) | Yes (dim 7 auto-fail) |
| 13 | Cookie leakage (D17) | Yes (Gate 3 extends) | Yes (dim 7 auto-fail) |
| 14 | Captcha-bypass attempts (D17) | — | Yes (dim 7 auto-fail) |
| 15 | Publish without two-stage confirm (D18) | Yes (Gate 8) | Yes (dim 8 auto-fail) |
| 16 | Publish on critic FAIL (D18) | Yes (Gate 8) | Yes (dim 8 auto-fail) |
| 17 | Dry-run that posts (D18) | Yes (Gate 8) | Yes (dim 8 auto-fail) |
