#!/usr/bin/env node
/**
 * SessionStart hook. Two jobs, neither allowed to break session start:
 *
 * 1. Export the running model to the session env so skills can resolve the
 *    execution profile without asking (references/execution-policy.md § "Model
 *    detection"). Appends `FORSVN_SESSION_MODEL=<model>` to `$CLAUDE_ENV_FILE`,
 *    and a `session_start` event to the T0 local ledger (no network).
 *
 * 2. Emit the FORSVN "enter the workspace" nudge as SessionStart
 *    `additionalContext` (KTD1.2). This is the ONE mechanism that guarantees the
 *    enter_workspace imperative is in front of the model every Claude Code session
 *    — the MCP-server `instructions` floor (U1) is best-effort and host-dependent.
 *    Text-only and static: a hook cannot call MCP or (per U3) read disk for this;
 *    it just restates the imperative. The string self-gates ("if a forsvn MCP
 *    server is connected …") so it is harmless in a non-forsvn session.
 *
 *    Bug #12151 (Claude Code) drops some plugin-hook output. If the nudge does not
 *    appear, install this hook at settings scope as a fallback: copy the
 *    SessionStart entry from hooks.json into `~/.claude/settings.json` (or the
 *    project `.claude/hooks.json`), pointing at this file's absolute path.
 *
 * Contract: ALWAYS exit 0 — malformed input, missing env file, unwritable ledger,
 * or a stdout failure are all swallowed.
 */

import { readFileSync, appendFileSync } from "node:fs";
import { appendEvent } from "../bin/lib/ledger.mjs";

// Static enter-workspace nudge (KTD1.2). Names `enter_workspace`; self-gating so a
// non-forsvn session can ignore it.
const ENTER_NUDGE =
  "FORSVN workspace — if a forsvn MCP server is connected, call `enter_workspace` " +
  "before your first substantive action this session: it loads the project's active " +
  "artifacts, prior decisions, and the graph-derived next step, so you continue from " +
  "approved state instead of starting cold. If no forsvn MCP tools are present, ignore " +
  "this line.";

// Job 1: model env + ledger. Isolated so a failure here never suppresses the nudge.
try {
  const input = JSON.parse(readFileSync(0, "utf-8"));
  const m = input?.model;
  const model =
    typeof m === "string" ? m
    : typeof m?.id === "string" ? m.id
    : typeof m?.display_name === "string" ? m.display_name
    : "";
  const envFile = process.env.CLAUDE_ENV_FILE;
  // Single-line, sanitized value — an env file is line-oriented.
  if (model && envFile) {
    appendFileSync(envFile, `FORSVN_SESSION_MODEL=${model.replace(/[\r\n]/g, "")}\n`);
  }
  // T0 ledger: session liveness. appendEvent never throws.
  appendEvent({ event: "session_start", ...(model ? { model } : {}) });
} catch {
  // Never block session start.
}

// Job 2: emit the nudge. Static string, so it runs even if Job 1 threw. Wrapped so
// a stdout failure still exits 0. hookEventName MUST be "SessionStart" (the
// skill-router emitter hardcodes "UserPromptSubmit" — do not copy that here).
try {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: ENTER_NUDGE,
      },
    })
  );
} catch {
  // Never block session start.
}

process.exit(0);
