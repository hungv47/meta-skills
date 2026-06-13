# Tool Redirect — the upstream "agnostic brief vs. drive it live" contract

**The standard UPSTREAM choice a *build-in-tool* skill offers near its START, before it
produces anything** — a skill whose production mode can run *inside* a connected tool
(design today via `map-user-flow`; product-UI next), as opposed to one that emits a
portable artifact or reads a data source (see "When NOT to wire" below). Where the terminal
[`execution-fork.md`](execution-fork.md) asks *"the brief is ready — how do you want to
execute it?"*, this asks the earlier question: *"should I write a tool-agnostic brief, or
drive this live in a tool you already have connected?"* Picking live-drive changes the
skill's whole production mode — it works *inside* the tool instead of emitting a portable
handoff.

Skills cite this file instead of inlining the block (same contract for all; inlining
blows the per-skill body budget). The human always owns the gate; the pre-checked default
is always the portable, tool-agnostic brief.

Built on CLOSED-LOOP.md §3 (registry) + §4 (the terminal fork) primitives; the upstream
redirect itself is a program extension, not a separate canonical section. Companions:
`execution-fork.md` (terminal, per-category) and `capability-preflight.md` (the batch
liveness check a *multi-engine / multi-stage* run runs once, up front — this redirect is
the single-skill, build-in-tool case; the pre-flight is the whole-run case).

---

## Upstream vs terminal — when each fires

| | Upstream redirect (this) | Terminal fork (`execution-fork.md`) |
|---|---|---|
| **When** | near the skill's start, before producing | after the brief / artifact is produced |
| **Question** | agnostic brief, or drive live in <tool>? | Brief-only, Assisted, or Direct? |
| **Effect of "live"** | skill produces *inside* the tool from the start | skill renders / runs the finished handoff |
| **Default** | tool-agnostic brief (portable) | Brief-only |

If the operator picks live-drive **upstream**, the terminal fork is already answered — set
`execution_mode` to `assisted` / `direct` (engine recorded in provenance) and **don't ask twice**.

---

## The block

```markdown
## Tooling
Before I draft this — I see {engine} connected for {category}.
- [x] Tool-agnostic brief — I write a portable brief; you run it anywhere.   (default, always)
- [ ] Drive it live in {engine} — I build directly in {engine}; you approve at the gate.  (engine: drivable now)
```

---

## Gating — ask the registry, don't hardcode

Query the registry for the stage-category; never hardcode an engine list (CLOSED-LOOP §3.4):

```
forsvn-mcp list_tools(category)   → { engines, verified, discovered, fork }
```

`engines` is the category's full `EngineEntry[]` (Registry § "EngineEntry" — each entry
carries `status`, `discovered`, `auth`, `env_present`); `verified` / `discovered` / `fork`
are category-level rollups. **Evaluate the gate per engine over `engines[]`**, not on the
rollups — you want to offer the *specific* drivable engine, not "something here is connected."

Offer the live-drive option only for an engine that is **drivable now**. This is a
strictly broader gate than the terminal fork's `verified`-only — deliberately so, and
safe **because the default is the agnostic brief and live-drive is explicit opt-in**. An
engine is drivable now when any of:

- `status == "verified"` — proven live (Registry §3.2; not implemented in v1), **or**
- `discovered == true` with `auth: "mcp-connected"` — the MCP server is connected this
  session, so the agent can call it right now (e.g. `open-design`), **or**
- `env_present == true` — the engine's key is set. **Presence only**, value never read; per
  Registry §3.2 this is *not* a liveness guarantee — a stale or invalid key can still fail
  mid-drive. Acceptable here precisely because live-drive is opt-in and the agnostic brief
  is the floor.

No drivable engine in the category → **don't ask**. Produce the tool-agnostic brief; the
terminal fork later names what the operator *could* connect. **No dead ends, no nagging.**

Category by skill family — same mapping as `execution-fork.md`; additionally
`map-user-flow` → `design`. The `analytics` and `publish` categories exist in the registry,
but **no current skill wires this redirect to them** — analytics-reading and copy/publish
skills fail the fit-test below. Wire a new family only after it passes that test.

---

## When NOT to wire this (the fit-test)

Before citing this redirect, apply one test: **does the skill build/execute *inside* the
tool as its production mode, or does it emit a portable artifact / read a data source?**
Live-drive must be a real *alternative production mode* — not a relabelled input, not a
duplicate of the terminal fork.

- **Build-in-tool → fits.** The output IS the thing made in the tool: `map-user-flow`
  driving live screens in a design tool; a future product-UI skill. Live-drive swaps "emit a
  portable brief" for "build it in the tool."
- **Reads a data source → does NOT fit.** Analytics-*reading* skills (`diagnose`,
  `evaluate-*`) consume metrics as **input** and emit a portable analysis. "Drive it live in
  amplitude" wouldn't change their production mode — the data engine is a *source*, not a
  build target. Their live-data-vs-pasted-data choice is an *ingestion* concern, not this.
- **Emits / terminally executes → does NOT fit.** Copy/publish skills (`write-social`,
  `publish-social`) emit a portable artifact or run the terminal publish action; the terminal
  [`execution-fork.md`](execution-fork.md) (`publish`) already owns their engine choice.

No build-in-tool production mode → don't cite this; the terminal fork (or nothing) is right.

---

## Driving an engine — MCP-first, CLI-fallback

When the operator picks live-drive, prefer the connected MCP; fall back to the engine's
CLI. Reuse the engine's **own** assets (skills, design systems, templates) before
hand-rolling, and **inspect what the engine generated before coding on top of it** — never
read sizes or colors from a screenshot alone.

### Open Design (`open-design` MCP / `od` CLI) — design category

A local-first design workspace. Its idiom:

1. **Locate context.** MCP: `get_active_context` (the project / file the operator has open
   right now). CLI: `od status --json`.
2. **Reuse before building.** MCP: `list_skills` (an existing OD skill may already do this).
   CLI: `od skills list --json` / `od design-systems list --json` — prefer an existing OD
   skill or design-system over hand-rolling tokens.
3. **Pull design context.** MCP: `get_artifact` (entry file + every referenced sibling —
   tokens CSS, JSX modules — in one call); `search_files` to find a class / component.
4. **Produce in-tool.** MCP: `create_artifact` / `write_file`. CLI: the `od` generate path.
5. **Inspect before coding.** Re-read the generated files (`get_file` / `get_artifact`)
   before writing any code against them.

*The MCP tool names above are exact for the connected `open-design` server; the `od` CLI
subcommands are the documented idiom — verify exact flags against `od --help` before
relying on them. The MCP path is authoritative; the CLI is the best-effort fallback.*

Other engines follow the same shape: connected MCP first (call the tool directly), the
engine's CLI / API second, the portable brief always available as the floor.

---

## Non-negotiable rules (parity with `execution-fork.md`)

1. **The human owns the gate.** Live-drive outputs land as artifacts in the loop tree with
   `decision_state: pending` and surface in the review stream — **never auto-approved**
   (architecture §9.2). Guard in the orchestrator, not the skill.
2. **MCP-mediated, OS-keychain only (CLOSED-LOOP §9).** Live-drive routes through the
   operator's *own* connected MCP servers and *own* keys. The app is never a credential
   broker and adds no telemetry. `mcp-connected` → call the tool; `auth: env` → key from
   the keychain, never the app's store.
3. **Keys-only discovery.** The "drivable now" signal comes from the registry, which reads
   config **keys only, never values** (Registry §3.1). The skill never inspects credentials.
4. **Default is portable.** The pre-checked default is always the tool-agnostic brief.
   Live-drive is opt-in; lock-in is opt-in.
5. **Degrade cleanly.** No drivable engine → no question asked; produce a complete,
   runnable tool-agnostic brief. The redirect is dormant, not a blocker.
6. **Record the choice once.** Set `execution_mode` on the produced artifact — the same enum
   as `execution-fork.md` (`brief-only` when agnostic; `assisted` / `direct` when
   live-driven); record *which* engine was used in the artifact's provenance, never baked
   into the enum value. Provenance + eval attribution. Don't re-ask at the terminal fork if
   answered here. See [`artifact-contract-template.md`](artifact-contract-template.md).

---

## How a skill cites this

In the SKILL.md body, near the start (before producing), add one line:

```
## Tooling
Offer the upstream redirect — see `references/_shared/tool-redirect.md`.
Default to the tool-agnostic brief; record `execution_mode` if live-driven.
```

That keeps the contract in one place and the skill body under its budget cap. The terminal
`execution-fork.md` (sibling reference) citation still closes the skill.
