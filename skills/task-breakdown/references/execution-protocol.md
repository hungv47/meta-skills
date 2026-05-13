# Execution Protocol — Reader's Manual for `tasks.md`

This file is the **operating manual for any agent (or human) picking up an existing `skills-resources/meta/tasks.md`** to implement work. The `task-breakdown` skill produces the artifact; this protocol governs how downstream consumers run it.

If you're decomposing fresh work, you don't need this file — go to `task-breakdown`'s `SKILL.md`. If you're holding a tasks.md and ready to build, read top to bottom.

---

## Before Starting

1. Read architecture doc fully
2. Read task list fully — Status Index first, then Shared Context, then individual blocks
3. Understand the end state before writing code
4. If ambiguous, ask — assumptions cause rework.

---

## Resume Protocol

Any agent (including a fresh session) uses this exact sequence:

1. **Read Status Index** in execution order, top to bottom. Don't scan task blocks yet.
2. **Find first row where:** `Status: pending` AND every `Depends on` ID has `Status: done`. That's the next task.
3. **If none**, check `in_progress` rows:
   - `Updated` attribution is *you* (same agent, same session) → continue it.
   - Different agent → apply staleness check below. If stale → flip to `pending` with note in `Updated`, restart step 2.
   - Otherwise → don't touch. Stop and surface to user ("T2 claimed by agent-X, updated {date}").
4. **All `done` or `removed`** → report completion and stop.
5. **Only `blocked` remain** → surface blockers. Don't silently skip.
6. **Claim:** flip `pending → in_progress`, set `Updated:` to today + your agent identity, in both index row and task block. Commit the status change **before** starting work so concurrent agents see the claim (see Concurrency Model).
7. Execute Per-Task Protocol below.
8. **On completion:** flip `in_progress → done`, fill `Evidence:` with commit SHA or test output, update the index row. Loop back to step 1.

**Never flip status without updating both index and task block in the same edit.** Drift breaks resume.

### Staleness check (step 3 claim reclamation)

Don't reclaim just because the timestamp is old — a HITL task legitimately claimed by a human reviewer may sit for a day. Only reclaim if **both**:

- Time since `Updated` exceeds the window: **2h AFK**, **24h HITL**.
- **No commits by the claiming agent** in `git log --author` within that window.

Either check fails → assume the agent is working. Don't steal. When in doubt, surface to user.

### Concurrency model

Markdown coordination is **best-effort, not a lock**. Two agents reading simultaneously can both claim `T3` — last write wins.

**Safe patterns:**
- **Serial execution** (default): one agent at a time. Covers 90% of cases.
- **Shared git remote**: `git pull --rebase` before claiming. Write claim. `git commit && git push`. On push conflict, pull and restart Resume Protocol from step 1.
- **Shared filesystem without git**: unsafe without external lock. Run serially.

If mid-work you find your claim overwritten (your `Updated` attribution gone), **abort** and restart Resume Protocol from step 1.

---

## Per-Task Protocol

1. State which task you're starting by ID (e.g. "Starting T3"). Note current `Revision:` number if present.
2. Write minimum code to pass acceptance.
3. **Before committing**, re-read the task block. Abort and restart Resume Protocol if any of:
   (a) `Revision:` bumped since you claimed — spec changed mid-flight,
   (b) `Status` flipped to `pending` — PM unclaimed,
   (c) your identity gone from `Updated:` — another agent overwrote your claim.
   On abort, re-read new Acceptance before re-claiming.
4. State exactly what to test and expected result.
5. **AFK:** Run acceptance test. Pass → write `Evidence`, flip `done`, commit, move on without waiting. Fail → fix and re-test (max 2 attempts, then `blocked` with reason and flag user).
6. **HITL:** Stop and present result. Wait for user confirmation. Pass → write `Evidence`, flip `done`, commit, announce next. Fail → fix the specific issue only, don't expand scope.

---

## Coding Rules

**Do:** write minimum code; focus only on current task; keep code modular and testable; preserve existing functionality.

**Avoid (causes scope creep and breakage):** sweeping changes across unrelated files; touching unrelated code; refactoring unless task requires it; adding features not in current task; premature optimization.

**When human action is needed:** state exactly what to do and which file/value to update; wait for confirmation.

---

## When Stuck

0. Better to stop and say "I'm stuck — here's what I've tried" than keep attempting fixes that aren't working. Bad work is worse than no work.
1. State what's blocking
2. Propose smallest unblock
3. Wait for approval

---

## Scope Change Protocol

If a missing requirement surfaces:

1. Stop current task
2. State what's missing and why
3. Propose where it fits in task order
4. Wait for PM to update task list
5. Resume only after update

---

## Update / Remove / Reopen Protocol

The task file is **append-only for history**. Never silently overwrite acceptance or delete a block — future agents need to see what changed. Every mutation appends to `**History:**` at the bottom of the task: date + actor + one-line reason.

**Update** (acceptance, outcome, or deps changed while task is open):

1. Bump `**Revision:**` counter (add field if absent; start at `2` on first revision).
2. Rewrite the changed field in place (e.g., replace `Acceptance:`).
3. Append to `**History:**`: `- 2026-04-21 · user · revision 2: tightened acceptance to require RLS test, not just row creation.`
4. If `Status` was `in_progress`, flip back to `pending` — in-flight work is now against stale spec. Agent must re-claim.

**Remove** (task no longer needed):

1. Flip `Status: removed` in both index and task block.
2. Keep the block — don't delete. Dependents (`T7 depends on T4`) must still resolve IDs.
3. Append to `**History:**`: `- 2026-04-21 · user · removed: superseded by T9 (unified auth flow).`
4. **Check downstream**: any task with this ID in `Depends on` needs review. Flag them — don't auto-rewrite deps. For downstream tasks already `in_progress` or `done` at removal, call out explicitly — in-flight or completed work may need reopening.

**Reopen** (a `done`, `blocked`, or `removed` task needs to run again):

1. Flip `Status` to `pending` (or `in_progress` if claiming immediately).
2. Clear `Evidence:` to `—` (old evidence no longer proves current spec).
3. Append to `**History:**`: `- 2026-04-21 · user · reopened: production bug in T5's email template, re-running task.`
4. Update the index row to match.

**Example task block after one revision + one reopen:**

```markdown
### Task T5: Email notification on task create

**Status:** pending
**Updated:** 2026-04-21 · user
**Evidence:** —
**Revision:** 2

**Depends on:** T4
**Outcome:** User receives email within 30s of creating a task
**Acceptance:** Create a task via UI → Resend webhook fires → email lands in inbox → template renders task title
**Autonomy:** AFK

**History:**
- 2026-04-19 · task-breakdown · created
- 2026-04-20 · agent-implementer · done (commit abc1234, test passed)
- 2026-04-21 · user · revision 2: added template rendering check; reopened due to prod bug
```

**Never do this:**
- Delete a task block (breaks dependency resolution)
- Edit `Evidence` on a `done` task without reopening first (destroys the audit trail)
- Renumber IDs to "tidy up" (invalidates every `Depends on` reference)
