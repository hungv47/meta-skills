# Dispatch — Steps 4 & 5

## Step 4 — Load context

Before dispatching:

0. **Workspace entry (MCP-preferred).** If Step 1 did not already enter via MCP, call `enter_workspace` (forsvn MCP) now — it loads active artifacts, decisions, and the graph-derived `next` in one call and marks the session oriented. Unavailable → the Step 1 disk snapshot already covers it (graceful degradation, KTD6). Either way, record the method as `context-loaded-via: mcp | filesystem` in the routing record so a resume knows how state was sourced.
1. **Product context.** If `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` is missing AND the routed skill needs it (marketing, product, research) → autodraft it there from `README.md`, `brand/BRAND.md`, `research/*.md`, `package.json`. Mark `status: needs_context` (an unratified draft). Tell the user: "Autodrafted product context. Review and promote to `status: done` before treating as canonical." Drafts are usable; do not block dispatch.
2. **Experience.** Grep `docs/forsvn/experience/*.md` for keywords matching the intent. Surface anything relevant: "You previously said X — still applies?"
3. **Initiative slug.** New → propose a kebab-case slug, user confirms. Resuming → use existing slug.
4. **Session execution profile.** The dispatcher owns the ask: if no fresh `.forsvn/routing/execution-profile.json` exists, fire the one bundled single-vs-multi (+ model, when undetected) ask per [`execution-policy.md`](../_shared/execution-policy.md) and write the profile. Every leaf dispatched this session inherits it silently — leaves never re-ask.
5. **Knowledge ledger (A7).** Refresh + read `.forsvn/memory/knowledge.json` — the cache of project facts (ICP present? brand ratified? last campaign? known competitors?) each carrying `source`/`confidence`/`date`. Run `bun bin/knowledge.ts refresh` to rescan disk (so the ledger never lags the on-disk artifacts — **disk beats the ledger on every conflict**), then `bun bin/knowledge.ts show` (or `get <key>`). Use it to (a) **not re-ask** a fact already on disk and (b) **not re-run a producer** (the A5 step) whose fact is present with adequate confidence — and **narrate the reuse**: `Reusing icp_present (from research-icp, 2026-06-10, confidence H) — not re-running.` A stale high-stakes fact (>30d) is re-derived, never trusted silently; reuse is never silent. The ledger is a cache built only from on-disk sources (provenance-or-nothing) — schema + the fact→source map: [`../knowledge-ledger.md`](../knowledge-ledger.md).

## Step 4.5 — Foundation pre-flight (infer-and-draft on a cold repo; warn on a thin one)

A sub-step of Step 4 (still the 5-step contract — this is part of "load context"). After context is loaded and before the Step 5 dispatch, run this **only when the routed intent ∈ {research, marketing, product}** — the consumers of audience/product context. Skip it for `resume`, `summary`, `debate`, `decompose`, `scope`. It is the literal guard against the "output feels generic" failure: a thin foundation produces generic output, so surface it *before* work starts, not after.

Read two real signals (the Step 1 snapshot already prints them; re-read the files if you entered via MCP):

1. **Audience evidence — `docs/forsvn/canonical/research/ICP.md`.** Absent → no voice-of-customer grounding for the 13+ skills that consume it. Present → read its `**Confidence Summary:**` line (H/M/L finding counts) and quote density.
2. **Product-context ratification — `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`.** `decision_state: accepted` = ratified; `decision_state: pending` / `status: needs_context` = an unratified autodraft. `date` older than 30 days = stale (matches research-icp Gate 4).

> Read `decision_state`, **not** just `status`: research-icp sets `status: done` on its *own* completion, but only a human approval (via the review module) sets `decision_state: accepted`. A `status: done` + `decision_state: pending` artifact is an unratified draft, not a canonical source.

Tier the foundation:

- **solid** — ICP present with no unresolved `L`-confidence findings, product-context ratified, both fresh → no warning; continue to Step 5.
- **partial** — ICP present but has `L`-confidence findings, OR product-context is an unratified autodraft, OR either is stale (>30d).
- **thin** — no `ICP.md`.

**Cold-repo branch — infer-and-draft (the first-run wow).** When the foundation is **thin** (no `ICP.md`) AND there is no prior `.forsvn/routing/last-session.md` for this project AND the operator did **not** already name a specific deliverable, do **not** stop at the warn line and **never** open an intake form — run the **First-Run Draft flow** (below) instead: infer from the repo and draft one tailored artifact. (Once K3's canonical `docs/forsvn/canonical/research/ICP.md` exists, the flow reads it instead of guessing ICP — A2 sharpens but does not depend on K3.)

For a **partial** foundation — OR a **thin** one where a prior session exists or the operator already named the work — print ONE line before the Step 5 announcement, then let the operator steer (non-blocking — drafts are usable; do not block dispatch; D-8 warn-don't-gate):

```
⚠ Foundation <thin|partial>: <no ICP.md | ICP has N low-confidence findings | product-context is an unratified autodraft | stale >30d>.
  Output will lean generic. Run /research-icp first (builds the audience + VoC evidence), or proceed with what's on disk?  (research-icp / proceed)
```

- **proceed** (or any forward intent — non-blocking) → continue to Step 5; record `foundation: <tier>` so the run is honestly labelled and the leaf can echo the caveat. Report `DONE_WITH_CONCERNS` as the run's **completion status** (the Completion Status Protocol value in `skills/CLAUDE.md` — distinct from the routing-record `status:` field below, which stays within its own `dispatched | awaiting-user | completed | abandoned` enum).
- **research-icp** → dispatch `/research-icp` instead (record the redirect via the normal Step 5 flow); the original ask resumes after.

Warn at most once per session — a `resume` of the same initiative reads the prior `foundation:` already recorded on `.forsvn/routing/last-session.md` and does not re-warn. A **solid** foundation prints nothing.

### First-Run Draft flow (cold-repo infer-and-draft)

The cold path is **correct-don't-interrogate**: read the repo, infer, and draft ONE real artifact with assumptions labeled — not a form, not a plan.

a. **Read the repo (no questions).** `README.md`, landing/marketing copy if present (`index.html`, `app/page.tsx`, `src/**/hero*`), `package.json` (name/description/deps), `git log --oneline -20`. Scaffold `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` from those sources as the inferred substrate — the same autodraft as Step 4.1 above. The mechanical scaffold ships with this skill as `scripts/draft-product-context.ts` (mirrored from `_dev/draft-product-context.ts`; targets the host CWD): `bun scripts/draft-product-context.ts --out docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`. Fall back to an inline scaffold if it is unavailable. It stays an **unratified draft** (`status: needs_context`, `decision_state: pending`) — only a human approval ratifies it. If `docs/forsvn/canonical/research/ICP.md` exists (K3 delivered), read it for ICP instead of guessing.
b. **Infer three things, each with a confidence + source label:** ICP (who it's for), wedge (the one differentiated thing), and the single highest-leverage first move (which capability).
c. **Pick the move and draft ONE real artifact** by dispatching that single capability through the normal Step 5 record→announce→invoke flow — NOT a form, NOT a plan. Typical move: a tailored landing hero (`/write-copy` or `/brief-landing-page`) or a launch tweet (`/write-social`), whichever the inference favors.
d. **Label every assumption inline** in the artifact's preamble (`inferred_from:` + `assumptions:` + a one-line "correct any of these and I'll redraft"). An unlabeled inference is a failure. Record `foundation: thin` + `first_run: drafted` + the `inferred:` block on the routing record.

**Empty-repo fallback.** If `README.md` + `package.json` + landing copy are all absent (nothing to infer from), fall back to the existing cold-start bundle ([`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) § "Cold Start") and record `first_run: form` — the form is the last resort, not the default.

Do not exceed ONE drafted artifact on the first run (more is a plan — that's A3). The drafted artifact is `decision_state: pending` like any other output — A2 produces a draft to review, it never publishes or auto-ratifies.

## Step 5 — Dispatch: record → announce → invoke

Strict order. The routing record lands **before** the Skill call so a leaf crash still leaves accurate state on disk.

1. **Write the routing record first** (format below): `.forsvn/routing/last-session.md` (overwrite) + append a copy to `.forsvn/routing/history/YYYY-MM-DD-HHMMSS-<intent-tag>.md`. Set `status: dispatched` and `dispatched-by: forsvn` — the warm-handoff marker the leaf reads (see [`pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) § "Warm Handoff").
2. **Announce in one line** — name the leaf and why, so a misroute is interruptible before any work starts:

   ```
   → Dispatching /<skill-name> — <one-line why>
   ```

3. **Invoke the leaf via the Skill tool**, passing the operator's ask (plus initiative slug and any surfaced context) as args. When classification is confident, the invocation IS the hand-off — do not print a hand-off block and stop, and do not wait for the operator to type the slash command.

### Ambiguity rule — never auto-fire a coin flip

Two candidates scoring close (no confident winner from the chain rules) → present both with a one-line rationale each and let the operator pick. This counts toward the 2-clarifying-question cap (SKILL.md Step 3). Auto-invocation is only for confident single-candidate classification.

### Misroute recovery

A wrong turn is visible and reversible by construction: the announcement names the leaf before any work starts (interrupt to cancel), the routing record holds `status: dispatched` + the route, and the leaf's own artifact trail shows exactly what it produced. To recover: interrupt (or let it finish), then re-invoke `/forsvn` with the corrected intent — `last-session.md` is overwritten, `history/` keeps the audit trail.

After the leaf completes — or when `/forsvn` exits without dispatching (summary, candidates presented, blocked) — update `status:` (`awaiting-user` / `completed` / `abandoned`) and `next-action` in `last-session.md`. Update `.forsvn/routing/initiatives.md` if a new initiative was created or status changed.

## Multi-step plans — `plan.md` (the plan-preview contract)

When Step 3 classifies **multi** (a multi-domain / "launch this" / "ship this" ask), do **not** propose the chain inline and start dispatching. Instead:

1. **Resolve prerequisites first (A5).** For each terminal target capability, run `bun bin/lib/resolve-deps.ts <capId> --json --ledger-root <projectRoot>` — it walks `route.prerequisites.hard` and returns the missing **producers** to insert as earlier steps (e.g. `write-ad` → `research-icp`), in dependency order, deduped (two prereqs from one producer = one step). **Prepend** those producer steps so the plan a human approves already contains them — visible, not hidden. A producer whose artifact already exists on disk is not re-inserted; a raw-path prereq with no producer surfaces as a human-supplied input (state it, don't fabricate it). The **knowledge ledger** is wired in as resolve-deps's `onDisk` signal in code: `--ledger-root` points it at `.forsvn/memory/knowledge.json`, and `resolve-deps` maps each ledger fact to the producer's output artifact id (`onDiskFromLedger` in `bin/lib/knowledge.ts`). A fact that passes the reuse gate (present, fresh, adequate confidence) marks its producer's output as on-disk, so that producer is **skipped** — and the skip is emitted as a `reuse` line (the `reuse[]` array in `--json`): `Reusing <fact> (from <producer>, <date>, confidence <H|M|L>) — not re-running.` Surface those reuse lines in the plan so the skip is visible, not silent. (Stale high-stakes facts fail the gate, so the producer runs and re-derives.)
2. Scaffold `.forsvn/runs/<slug>/plan.md` via `bun bin/plan.ts init <slug> --intent "<ask>" --steps <json>` — an ordered, gated steps table (`status: proposed`), the inserted producers carrying their `depends_on` edges. Each step row carries a `gate` (`auto | review | publish`); fill it conservatively pre-A4 (publish-ish → `publish`, output-producing → `review`, read-only → `auto`). Schema SoT: [`plan-spec.md`](../plan-spec.md).
3. Render the steps table to the user and **STOP for approval** — no step runs until a human approves (`status: approved`). A3 never auto-runs (that's A4, and only non-publish steps).
4. A fresh agent resumes from `plan.md` alone (the **Current step** pointer), not chat history.
5. **Once approved, execute via `run-plan` (A4)** — `/run-plan <slug>` (or `bun bin/lib/governor.ts`-bounded auto-advance) walks the approved plan, auto-advancing the `auto`/`review` steps within the governor envelope and **stopping hard at every `publish` gate** (nothing published). Each step's `gate` resolves from its capability `gate_class`; the conservative pre-fill above is the floor. `run-plan` refuses any plan whose `status != approved`.

`.forsvn/runs/` is **machine-state** (run state + the plan artifact), exempt from the artifact contract — never walked by the artifact validators or the manifest indexer, gitignored alongside the U6 run-records.

## Routing record format

```markdown
---
timestamp: YYYY-MM-DD HH:MM:SS
intent: <classified intent>
initiative: <slug or empty>
routed-to: /<skill-name or empty if summary>
dispatched-by: forsvn
context-loaded-via: mcp | filesystem
foundation: solid | partial | thin   # Step 4.5 tier; omit when intent doesn't consume product context
first_run: drafted | form | skipped   # cold first run only (Step 4.5); drafted = inferred + one artifact, form = empty-repo fallback, skipped = not a cold first run
inferred:                             # only when first_run: drafted
  icp:   { value: "<one line>", confidence: H|M|L, source: "README|package.json|commits" }
  wedge: { value: "<one line>", confidence: H|M|L, source: "<file>" }
  move:  { capability: "/<skill>", why: "<one line>" }
status: dispatched | awaiting-user | completed | abandoned
next-action: <one line>
---

## Conversation Summary
<2-3 lines>

## Open Questions
- <unresolved items>

## Artifacts Produced This Session
- <paths, or "none yet">
```

`dispatched-by: forsvn` is set only on records written by this dispatcher at invocation time; the leaf checks it (same session, `status: dispatched`) to run its warm start.

## Bootstrap (first run)

If `.forsvn/` does not exist at the project root:

1. `mkdir -p .forsvn/{context,experience,artifacts,loops,evals,routing,dashboard}`.
2. Copy templates from this skill's `templates/` dir.
3. Add `.forsvn/` to `.gitignore` only if the user confirms — some track their context, others don't.
4. Tell the user: "Scaffolded `.forsvn/`. Your shared context will live there."

Then run the normal 5-step flow.
