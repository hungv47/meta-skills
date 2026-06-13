#!/usr/bin/env node
/**
 * SessionStart hook: export the running model to the session env so skills can
 * resolve the session execution profile without asking which model is running
 * (references/execution-policy.md § "Model detection").
 *
 * Input:  JSON on stdin — SessionStart payloads carry a `model` field
 *         (string id, or an object with id/display_name in some SDK versions).
 * Effect: appends `FORSVN_SESSION_MODEL=<model>` to the file at $CLAUDE_ENV_FILE.
 *
 * Contract: NEVER breaks session start. Exit 0 always — malformed input,
 * missing env file, or unwritable path all exit silently.
 */

import { readFileSync, appendFileSync } from "node:fs";

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
} catch {
  // Never block session start.
}
process.exit(0);
