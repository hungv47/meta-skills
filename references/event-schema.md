# Activation event schema — the T0 local ledger

> Single source of truth for FORSVN's measurement events. Owned here, not by any
> skill. Sibling of [`artifact-contract-template.md`](artifact-contract-template.md):
> that doc defines the artifact frontmatter; this doc defines the **event log
> derived from it**. Schema is versioned (`v`) so T0 and a future T1 forwarder
> can't drift.

**Schema version: 1.**

## Why this exists

The wedge is validated once but **under-proven** — the dogfood governing gate was
*waived*, not passed (the ≥3-active-days/week cadence was never collected). T0 is
the cheapest instrument that closes that gap: a local, user-owned event log that
makes activation and cadence measurable **without breaking the local-first promise**.

## The three trust tiers (only T0 exists)

| Tier | What | Network | Default | Status |
|---|---|---|---|---|
| **T0 — local ledger** | Events appended to a JSONL file the user owns, reads, and can `rm` | **None, ever** | On (it's a log file) | **Shipped** |
| **T1 — opt-in product analytics** | Content-free aggregate counts forwarded to a backend, explicit consent | Outbound, consented | **Off** | Designed, not built |
| **T2 — plugin install/usage signal** | Lightweight events from the plugin running inside other agents | Outbound, consented | **Off** | Designed, not built |

T0 ships now and is the spine. T1/T2 are a separate, opt-in, off-by-default build
(see `docs/plans/2026-06-16-prelaunch-audit-refactor.md` Phase 8 §6 — the consent
design). **T0 never opens a socket.** That is the load-bearing invariant; do not
add egress to any T0 code path.

## Where it lives

```
<project>/.forsvn/ledger/events.jsonl     # per-project, when a .forsvn/ marker exists
~/.forsvn/ledger/events.jsonl             # global fallback, otherwise
<ledger>/.salt                            # 32-hex local salt for the project hash (never shared)
```

The ledger dir + both files are **machine-local** — gitignored in this repo, and
`.publicignore`-fenced (all of `.forsvn/` is) so they never reach the public mirror.

## Line format

One JSON object per line. Every line carries the envelope; `event` selects the
payload fields.

```jsonc
{ "v": 1, "ts": "2026-06-16T09:30:00.000Z", "event": "artifact_produced",
  "project": "a1b2c3d4e5f6", "skill": "write-copy", "stack": "marketing",
  "status": "done", "decision": "pending", "artifact": "acme-q3-launch", "chain": false }
```

**Envelope (every line):**

| Field | Type | Notes |
|---|---|---|
| `v` | int | Schema version (`1`). |
| `ts` | ISO-8601 Z | Event time. Artifact events use the artifact's canonical `date` (midnight Z); session events use wall-clock. |
| `event` | enum | See the taxonomy below. |
| `project` | string | **Salted** `sha256(salt + ":" + realpath(projectRoot))[:12]`. Stable per machine, **uncorrelatable across users** (per-machine salt). Never the path or name. |

## Event taxonomy

Two emission points, by design (audit Phase 8 §3): the **artifact frontmatter is
the reliable product signal** (rich, free, retroactive); the **hooks add session
liveness** (coarse, cheap). Generic UI events are deliberately *not* T0 — they
measure the thin human seam the product shrank, and are the most trust-sensitive.

### Artifact-derived (emitted by `ledger-sync.ts`, idempotent)

| `event` | When | Extra fields |
|---|---|---|
| `artifact_produced` | One per artifact under `docs/forsvn/artifacts/**` | `skill`, `stack`, `status`, `decision`, `artifact` (id), `chain` (has resolvable `upstream:`) |
| `decision_captured` | Artifact `decision_state` ∈ {approved, denied, suggested} | `skill`, `stack`, `decision`, `artifact` |
| `workflow_chain` | Artifact has an `upstream:` that references another known artifact id/skill | `skill`, `stack`, `artifact` |

Dedupe keys (so re-running sync is a no-op): `produced|<artifact>`,
`decision|<artifact>|<decision>`, `chain|<artifact>`. The same artifact can emit a
`produced` line now and a `decision_captured` line after a later review writeback —
that's the loop closing, captured for free.

### Session-derived (emitted by the plugin hooks, no Bun, no tree walk)

| `event` | Source hook | Extra fields |
|---|---|---|
| `session_start` | `SessionStart` | `model` (id string, optional) |
| `session_end` | `SessionEnd` | — |

## What is NEVER written

- ❌ Artifact **bodies**, copy, prompts, or any free text.
- ❌ File **paths** or **project names** (they leak client/brand identity — fatal for an agency user). Only the salted `project` hash.
- ❌ Any **network call**. T0 is a log file. The egress design is T1, opt-in, off by default, and out of scope here.
- The artifact **id** (`artifact`) IS written at T0 — it's a local slug needed for dedupe and chain analysis. A future **T1 forwarder MUST strip or hash it** before any egress; T0 keeps it because T0 never leaves the machine.

## Reading the ledger

```bash
bun skills/bin/ledger-sync.ts      # refresh artifact-derived events (idempotent)
bun skills/bin/ledger-report.ts    # local activation funnel + cadence + STOP-and-fix
bun skills/bin/ledger-report.ts --json
cat .forsvn/ledger/events.jsonl    # it's your data; inspect it directly
```

The funnel, cadence definition, and the STOP-and-fix trigger live in
[`../../docs/forsvn/experience/meta/dogfood-cadence.md`](../../docs/forsvn/experience/meta/dogfood-cadence.md)
and are computed by `ledger-report.ts`.
