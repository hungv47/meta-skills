<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Capability Pre-Flight — batch the tool check before choosing an approach

**The upstream check a tool-dependent run does ONCE, before committing to an
approach.** Where `execution-fork.md` gates a *single* handoff at its *terminal*
(per category, after the brief), and `tool-redirect.md` offers *one* build-in-tool
skill an agnostic-vs-live choice, this batches the check across a **whole run** — every
engine, key, and daemon the planned approach will touch — and surfaces **all blockers at
once**, up front. Built on the registry (`tool-registry-spec.md` §3) + the two fork
contracts; it does not replace them, it runs them as one batch.

Skills cite this file instead of inlining the check (same contract for all; inlining blows
the per-skill body budget).

---

## Why this exists

A multi-asset / multi-stage run that discovers blockers **serially** turns one decision
into five pivots: OpenDesign daemon down → fall back to SVG → no rasterizer → improvise a
screenshot bridge → no `GEMINI_API_KEY` → blocked → Paper open but no file → missing
fonts. Every one of those was knowable *before* choosing the approach. The fix is to probe
the whole tool surface once and resolve the batch, then execute.

The registry says what's *present*; v1 `status` is explicitly "present ≠ live"
(`tool-registry-spec.md` §3.2). The pre-flight adds the cheap **liveness** layer the
registry can't capture at build time.

## When to run it

Before the **first** tool-dependent step of a run that will touch one or more engines —
especially when the run spans multiple assets or stages (brief → produce → render →
re-ingest). For a one-asset, one-engine ask the terminal `execution-fork.md` alone is
enough; the pre-flight earns its keep when the run touches **more than one engine, stage,
or asset**, or when a named tool is load-bearing to the chosen approach.

Run it **before** picking the approach, not after — its whole value is changing the plan
while changing the plan is still free.

## The batch probe

1. **Enumerate the tool surface.** From the planned approach, list every `(category,
   engine)` the run will touch — render engine(s), rasterizer, image/video gen, design
   daemon, publish target.
2. **Query the registry once** per category: `forsvn-mcp list_tools(category)` →
   `{ engines, verified, discovered }`. Read each `EngineEntry`'s `auth`, `discovered`,
   `env_present`, `status`.
3. **Probe liveness per engine** — cheap, run-time, current (presence is not liveness):

   | Engine kind | Liveness probe (cheap) | "Live" when |
   |---|---|---|
   | MCP-connected (e.g. open-design, paper) | the connected server responds to a no-op/status call | server answers this session |
   | Daemon-backed (e.g. OpenDesign needs `pnpm tools-dev`) | health/status endpoint reachable | endpoint responds |
   | App-with-document (e.g. Paper) | a file/document is actually open | an open target exists |
   | `auth: env` (e.g. Gemini key) | the env key is **set** (presence only, value never read) | key present (still may fail mid-run) |
   | CLI tool (e.g. a rasterizer: rsvg/inkscape/sharp) | `command -v <bin>` | on PATH |

   Honor user-named resources (Core Principle 8): a tool the operator *named* is
   discovered/probed before being assumed unavailable, and reported as **down** (not
   "unavailable") when the probe fails.

4. **Emit ONE consolidated checklist** — every blocker at once, each with how to resolve
   and the named fallback:

   ```
   Pre-flight for this run (image + render):
   - [ ] GEMINI_API_KEY — unset → set it, or fall back to headless HTML render
   - [ ] OpenDesign daemon — down → `pnpm tools-dev`, or fall back to hand-authored SVG
   - [ ] Paper — running, no file open → open the target file, or skip the Paper route
   - [ ] rasterizer — none on PATH → headless HTML + @font-face (see render-engines.md)
   Resolve the batch, then I'll proceed. Nothing here blocks — without these I produce a
   complete tool-agnostic brief and a headless-HTML render.
   ```

   Resolve the batch, **then** execute. Never start the run and hit blockers one at a time.

## Non-negotiable rules

1. **No dead ends.** When nothing in a category is live, the run still completes — degrade
   to the tool-agnostic brief + the headless fallback (`render-engines.md`). The pre-flight
   *informs* the approach; it never hard-blocks a producible handoff.
2. **Name fallbacks, not just gaps.** Every blocker line carries its fallback, so an
   unresolved batch still yields a runnable plan.
3. **Don't re-ask downstream.** What the pre-flight establishes (which engines are live)
   pre-answers the terminal `execution-fork.md` for those engines — set `execution_mode`
   accordingly; don't re-prompt the same liveness question at the fork.
4. **Liveness is run-time, not cached.** Probe at run time; do not persist a `live` flag
   into `tools.json` (it would be stale by capture). The registry stays presence-level; the
   pre-flight stays current.

## How a skill cites this

In the SKILL.md body, near START (before dispatch), for a tool-dependent producing skill:

```
## Pre-Flight
Before choosing the approach, batch-check the tool surface — see
`references/_shared/capability-preflight.md`. Surface all blockers at once; resolve, then
produce. Degrade cleanly to the agnostic brief + headless render when nothing is live.
```

Companion contracts: `tool-redirect.md` (upstream agnostic-vs-live for a *build-in-tool*
skill), `execution-fork.md` (terminal Brief-only/Assisted/Direct), `render-engines.md`
(the engines + the headless fallback this names).
