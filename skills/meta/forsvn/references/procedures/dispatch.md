# Dispatch — Steps 4 & 5

## Step 4 — Load context

Before dispatching:

0. **Workspace entry (MCP-preferred).** If Step 1 did not already enter via MCP, call `enter_workspace` (forsvn MCP) now — it loads active artifacts, decisions, and the graph-derived `next` in one call and marks the session oriented. Unavailable → the Step 1 disk snapshot already covers it (graceful degradation, KTD6). Either way, record the method as `context-loaded-via: mcp | filesystem` in the routing record so a resume knows how state was sourced.
1. **Product context.** If `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` is missing AND the routed skill needs it (marketing, product, research) → autodraft it there from `README.md`, `brand/BRAND.md`, `research/*.md`, `package.json`. Mark `status: needs_context` (an unratified draft). Tell the user: "Autodrafted product context. Review and promote to `status: done` before treating as canonical." Drafts are usable; do not block dispatch.
2. **Experience.** Grep `docs/forsvn/experience/*.md` for keywords matching the intent. Surface anything relevant: "You previously said X — still applies?"
3. **Initiative slug.** New → propose a kebab-case slug, user confirms. Resuming → use existing slug.
4. **Session execution profile.** The dispatcher owns the ask: if no fresh `.forsvn/routing/execution-profile.json` exists, fire the one bundled single-vs-multi (+ model, when undetected) ask per [`execution-policy.md`](../_shared/execution-policy.md) and write the profile. Every leaf dispatched this session inherits it silently — leaves never re-ask.

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

## Routing record format

```markdown
---
timestamp: YYYY-MM-DD HH:MM:SS
intent: <classified intent>
initiative: <slug or empty>
routed-to: /<skill-name or empty if summary>
dispatched-by: forsvn
context-loaded-via: mcp | filesystem
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
