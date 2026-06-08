<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Execution Fork — the brief/produce → execute contract

**The standard terminal choice every brief/produce/write skill offers once its
handoff is ready.** Replaces the bare "here's the prompt, go run it" ending with an
explicit, registry-gated fork. Canonical design: CLOSED-LOOP.md §4 (+ §2.2, §9).

Skills cite this file instead of inlining the block (it's the same contract for all,
and inlining would blow the per-skill body budget). The front door (`/forsvn`) and
the producing skill apply it; the human always owns the gate.

**Companion — upstream vs terminal.** This is the *terminal* choice (after the brief is
produced). The *upstream* counterpart, [`tool-redirect.md`](tool-redirect.md), offers the
earlier "tool-agnostic brief vs. drive it live in <tool>?" choice near a skill's start. If
the operator chose live-drive upstream, this fork is already answered — don't ask twice.

---

## The block

```markdown
## Execution
This {brief|asset|prompt} is ready. How do you want to execute?
- [ ] Brief-only — copy the prompt below / save the handoff.            (always)
- [ ] Assisted   — I render via {engine}, you approve each output.      (engine: verified)
- [ ] Direct     — I run it end-to-end, you approve at the gate.        (engine: verified)
```

| Mode | What happens | Available when |
|---|---|---|
| **Brief-only** | Emit the handoff prompt → clipboard / `handoff.md`. Today's behavior. | always |
| **Assisted** | Call the chosen engine via the operator's connected MCP / key; the human approves **each** output at the review gate. | engine `verified` |
| **Direct** | Run end-to-end (e.g. a coding agent builds the LP and returns a URL); the human approves at the gate. | engine `verified` |

---

## Gating — ask the registry, don't hardcode

At the fork, query the tool registry for the stage-category, never a hardcoded
engine list (CLOSED-LOOP §3.4). Over MCP:

```
forsvn-mcp list_tools(category)   → { engines, verified, discovered, fork }
```

- `fork == "brief-only"` (no engine `verified`) → offer **Brief-only only**, and
  *name* the engines the operator could connect (the `discovered`/unconnected set).
  **No dead ends, no broken promises.**
- `fork == "assisted-direct-available"` (≥1 `verified`) → offer **Brief-only +
  Assisted/Direct**, defaulting to the category's `preferred` engine.

Engine-specific prompt tuning stays in the skill (it knows *how* to talk to the
engine); the registry only says *what* is available. Schema:
[`tool-registry-spec.md`](tool-registry-spec.md).

Category by skill family: `brief-landing-page` → `design`; `brief-graphic` /
`produce-asset` → `image`; `brief-shortform` / `produce-video` → `video`;
`write-social` / `publish-social` → `publish`; `write-ad` → `publish` + `image`.

---

## Non-negotiable rules

1. **The human owns the approval gate.** Consistent with architecture §9.2 — humans
   sign off in v0. **Direct does NOT auto-approve**; Assisted/Direct outputs land as
   artifacts in the loop tree and surface in the review stream like any other pending
   decision (`decision_state: pending`). Guard this in the orchestrator, not the skill.
2. **MCP-mediated, OS-keychain only (CLOSED-LOOP §9).** Assisted/Direct route through
   the operator's **own** connected MCP servers and **own** keys (OS keychain). The app
   never becomes a credential broker for cloud vendors and adds no telemetry. For an
   MCP-connected engine the agent calls the connected tool directly; for an `auth: env`
   engine the key is read from the keychain, never the app's own store.
3. **Record the choice.** Set `execution_mode: brief-only | assisted | direct` on the
   produced artifact (provenance + eval attribution). See
   [`artifact-contract-template.md`](artifact-contract-template.md).
4. **Degrade cleanly.** When nothing is `verified`, the fork silently collapses to
   Brief-only. The skill must still produce a complete, runnable handoff.

---

## Closing the loop — render → check → accept (brief-first + return-leg)

The fork doesn't end at "rendered." Two bookends make the brief binding:

1. **Brief-first (entry).** No render before a brief exists. A producing skill invoked
   without its brief returns `NEEDS_CONTEXT` — never renders from a bare prompt or vibes.
   This is the entry gate the brief-skills + `produce-asset`/`produce-video` enforce.
2. **Check-then-accept (return-leg).** An Assisted/Direct render is **not "done" until it
   is scored against its brief *and* its realized surface** — via the matching eval
   (`evaluate-asset` for static, `evaluate-shortform` for video, `evaluate-landing-page`
   for pages) or, for a quick pass, an explicit squint-test against the cited realized
   surface (`realized-surface-grounding.md`). Re-ingest the real render and score *that*,
   never the prompt (CLOSED-LOOP §6 return-leg). **Off-brief output is not accepted and not
   committed** — it routes back to the brief or a re-render. For brand-critical visuals the
   default is render → show the human → iterate before accept (`render-engines.md`
   checkpoint).

Skipping the return-leg — accepting a render no one scored against the brief — is the
exact gap that ships generic, off-brand output. The loop closes on the render, not the
prompt.

---

## How a skill cites this

In the SKILL.md body, replace the bare handoff ending with one line:

```
## Execution
Offer the registry-gated fork — see `references/_shared/execution-fork.md`.
Record `execution_mode` on the artifact.
```

That keeps the contract in one place and the skill body under its budget cap.
