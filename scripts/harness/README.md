# Harness — Measurement Tool for the Skill-Stack Refactor

Built per [`implementation-roadmap/refactor/03-harness.md`](../../../implementation-roadmap/refactor/03-harness.md). The harness instruments skill invocations so refactor decisions are data-driven instead of vibes-driven.

---

## What it does

For every recorded skill invocation, the harness captures:

- **Default context load** — SKILL.md size (always loaded when the skill is invoked)
- **Lazy ref loads** — every `references/` file the agent actually read mid-run
- **Sub-agent spawns** — each `Agent` / `Task` call with input/output sizes
- **Artifact outputs** — files written, with **contract hashes** for frontmatter + section structure (regression detection)
- **Tool-call mix** — counts by tool type (Read, Write, Edit, Bash, Agent, …)
- **Wall time** — from record to stop

Aggregates across multiple runs let `report.ts` distinguish always-loaded refs (body-diet leaks) from lazy-loaded refs (working as intended). The `diff.ts` command applies Gate-1 acceptance criteria when comparing pre-refactor to post-refactor runs.

---

## Architecture choice — Hook-based observer (v0.1)

The harness ships as a **`PostToolUse` hook** plus `record` / `stop` CLI commands. Pattern:

1. Operator runs `record.ts --skill <name> --fixture <kind>` — writes a marker file with run metadata
2. Operator invokes the skill in this Claude Code session
3. Hook fires on every tool call, appends one JSONL event to `.events/<run-id>.jsonl` (no-op when marker absent)
4. Operator runs `stop.ts` — reads the event log, computes contract hashes, writes the finalized run JSON, removes the marker

**Why this over a wrapper script:** zero changes to skill source, observes real invocations, the agent stays in the operator's native Claude Code session (no SDK-shim issues). The marker file ensures clean start/stop boundaries.

**Why not always-on hook telemetry:** would log every unrelated tool call across all sessions; signal-to-noise is too low; privacy of unrelated work matters.

---

## File layout

```
meta-skills/scripts/harness/
├── README.md         # this file
├── schema.ts         # typed JSON output schema (single source of truth)
├── record.ts         # CLI: start a harness run
├── stop.ts           # CLI: finalize the run, write run JSON
├── report.ts         # CLI: aggregate runs for a skill into a markdown report
├── diff.ts           # CLI: pre/post-refactor comparison + Gate-1 check
├── hook.ts           # the PostToolUse hook (logs to .events/<run-id>.jsonl)
├── hook              # POSIX shell wrapper — fast no-op when no marker
└── lib/
    ├── io.ts         # paths, JSONL helpers, debug log
    ├── hash.ts       # frontmatter + section + composite contract hashes
    └── parse.ts      # SKILL.md / plugin.json / ULID
```

Run data goes to `.agents/skill-artifacts/meta/records/harness/`:

```
.agents/skill-artifacts/meta/records/harness/
├── .active                                # marker file — present iff a run is active
├── .events/<run-id>.jsonl                 # raw per-tool-call event log
├── .harness.log                           # debug log (hook errors etc.)
├── inputs/<skill>-<minimal|standard|stretch>.md    # fixtures
├── baseline/<skill>/                      # pre-refactor baseline runs (per skill)
└── <date>-<skill>-<run-id>.json           # finalized run records
```

---

## Quick start

```bash
# 1. Start recording
bun meta-skills/scripts/harness/record.ts --skill eval-loop --fixture standard

# 2. Invoke the skill in your Claude Code session — talk to Claude naturally,
#    or use /eval-loop. The hook records every tool call.

# 3. Stop recording — pass --artifact for each output the skill produced
bun meta-skills/scripts/harness/stop.ts --artifact skills-resources/loops/test-loop/program.md

# 4. After 3+ runs (minimal, standard, stretch), generate the report
bun meta-skills/scripts/harness/report.ts --skill eval-loop --out .agents/skill-artifacts/meta/records/harness/baseline/eval-loop-report.md

# 5. After refactoring, compare baseline vs new runs
bun meta-skills/scripts/harness/diff.ts --skill eval-loop --pre-before 2026-05-20 --post-from 2026-05-20
```

---

## CLI reference

### `record.ts` — start a run

```
bun meta-skills/scripts/harness/record.ts --skill <name>
  [--fixture <minimal|standard|stretch>]
  [--mode <fast|standard|deep>]
  [--notes "<any string>"]
```

Refuses to start if a run is already active. If `--fixture` is set and the fixture file exists at `inputs/<skill>-<kind>.md`, its contents are hashed into the marker (for cross-run input identity).

### `stop.ts` — finalize the active run

```
bun meta-skills/scripts/harness/stop.ts
  [--artifact <path>]...
```

Pass `--artifact` once per output file the skill produced. If omitted, the harness infers from any Write/Edit calls that landed inside `.agents/`, `skills-resources/`, `research/`, `brand/`, or `architecture/`.

Writes `<date>-<skill>-<run-id>.json` and removes the marker.

### `report.ts` — aggregate runs

```
bun meta-skills/scripts/harness/report.ts --skill <name>
  [--since YYYY-MM-DD]
  [--out <path>]
```

Reads all `*-<skill>-*.json` records (optionally since a date), aggregates, prints a markdown report (or writes to `--out`).

### `diff.ts` — pre/post comparison

```
bun meta-skills/scripts/harness/diff.ts --skill <name>
  (--pre-before YYYY-MM-DD --post-from YYYY-MM-DD | --by-notes)
  [--out <path>]
```

Partitions runs into pre/post buckets either by date or by the `--notes` field (entries containing "pre" → pre; "post" → post). Applies Gate-1 acceptance criteria from [`05-acceptance.md`](../../../implementation-roadmap/refactor/05-acceptance.md):

- ≥30% default-load reduction
- Contract hashes preserved on all output artifacts

Exits 0 on PASS, 1 on FAIL.

---

## Hook installation

The hook is installed in `agent-skills/.claude/settings.json` (project scope — fires only when working in this repo). Installation is one-time:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          { "type": "command", "command": "/Users/hungvio/Desktop/biz/agent-skills/meta-skills/scripts/harness/hook" }
        ]
      }
    ]
  }
}
```

**Note: the `command` path above is operator-specific** (absolute path to your local clone). For v0.1 this lives in `settings.local.json` (gitignored, per-operator). If you want to share the install across teammates via tracked `settings.json`, replace the absolute path with a portable form (e.g., Claude Code's `$CLAUDE_PROJECT_DIR` env var, if supported by your CC version) — verify it expands inside hook commands before committing.

The `hook` shell wrapper checks for the marker file before doing anything — when no run is active, it exits in <5ms with no work done. It also bails silently if `bun` is not on PATH (never blocks a tool call). Active runs add ~30-50ms per tool call (Bun cold start).

If you ever want to disable the hook temporarily, delete the marker file:
```bash
rm /Users/hungvio/Desktop/biz/agent-skills/.agents/skill-artifacts/meta/records/harness/.active
```

The hook is safe-by-construction: any internal error logs to `.harness.log` and exits 0 — it will never block a tool call.

---

## Known limitations (v0.1)

- **Changed-output-rate for sub-agents is not auto-computed.** The `output_changed_main_thread` field stays `null`; operator confirms via blind diff per the protocol. Planned for v0.2.
- **Token counts are approximated as `chars / 4`.** Use real tokenizer (`tiktoken` or `@anthropic-ai/tokenizer`) in v0.2 if precision matters.
- **No automatic skill-boundary detection.** Operator explicitly records/stops. Hook telemetry would leak across skills if you forget to stop.
- **PreToolUse not captured.** Only PostToolUse is logged — enough for size/path/agent signals; PreToolUse would add per-call wall-time precision if needed later.
- **Fixture-less runs are allowed.** Skip `--fixture` for ad-hoc captures, but the run will not be comparable across operators.

---

## Anti-patterns (don't do these)

- Don't run harness without a fixture for refactor-baseline work — comparability is the whole point.
- Don't enable the hook globally (`~/.claude/settings.json`) — it should fire only when working in this repo.
- Don't delete `.events/<run-id>.jsonl` without finalizing the run first — `stop.ts` needs the event log.
- Don't edit the marker file by hand — corrupted marker breaks the hook silently.
- Don't ship a refactored skill if `diff.ts` exits 1 — failures are listed in the report; fix or document an intentional contract change.
