#!/usr/bin/env node
/**
 * Test harness for the SessionStart hook (session-start-model.mjs).
 *
 * Verifies U3: the enter-workspace nudge is emitted as SessionStart
 * additionalContext, the model env write is unregressed, and the hook always
 * exits 0 (even on malformed stdin). Hermetic — runs the hook in a throwaway temp
 * project (with its own .forsvn/ marker) so the ledger append lands there, never
 * in the repo's or the global ledger.
 *
 * Not yet in the pre-merge gate; run directly: node hooks/test-session-start.mjs
 */

import { mkdtempSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOK = join(__dirname, "session-start-model.mjs");

let failures = 0;
function check(name, cond) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    console.error(`  FAIL ${name}`);
    failures++;
  }
}

/** Run the hook in an isolated temp project. Never throws on hook exit 0. */
function runHook(stdinStr) {
  const root = mkdtempSync(join(tmpdir(), "forsvn-sshook-"));
  mkdirSync(join(root, ".forsvn"), { recursive: true }); // ledger lands here, not the repo
  const envFile = join(root, "env");
  let stdout = "";
  let threw = false;
  try {
    stdout = execFileSync(process.execPath, [HOOK], {
      input: stdinStr,
      cwd: root,
      env: { ...process.env, CLAUDE_ENV_FILE: envFile },
      encoding: "utf-8",
    });
  } catch {
    // execFileSync throws on a non-zero exit — the hook must never exit non-zero.
    threw = true;
  }
  const envFileContent = existsSync(envFile) ? readFileSync(envFile, "utf-8") : "";
  rmSync(root, { recursive: true, force: true });
  return { stdout, envFileContent, threw };
}

function parse(s) {
  try { return JSON.parse(s); } catch { return null; }
}

// 1. Happy path — a well-formed SessionStart payload.
{
  const { stdout, envFileContent, threw } = runHook(JSON.stringify({ model: "claude-opus-4-8" }));
  check("happy: hook exits 0", !threw);
  const p = parse(stdout);
  check("happy: stdout is valid JSON", p !== null);
  check("happy: hookEventName is SessionStart", p?.hookSpecificOutput?.hookEventName === "SessionStart");
  check(
    "happy: additionalContext names enter_workspace",
    (p?.hookSpecificOutput?.additionalContext || "").includes("enter_workspace"),
  );
  check(
    "happy: env file got FORSVN_SESSION_MODEL (no regression)",
    envFileContent.includes("FORSVN_SESSION_MODEL=claude-opus-4-8"),
  );
}

// 2. Malformed stdin — the hook must still exit 0 and still emit the static nudge.
{
  const { stdout, threw } = runHook("not json at all");
  check("malformed: hook exits 0", !threw);
  const p = parse(stdout);
  check("malformed: hookEventName is SessionStart", p?.hookSpecificOutput?.hookEventName === "SessionStart");
  check(
    "malformed: nudge still emitted",
    (p?.hookSpecificOutput?.additionalContext || "").includes("enter_workspace"),
  );
}

if (failures > 0) {
  console.error(`\n${failures} session-start hook check(s) failed`);
  process.exit(1);
}
console.log("\nall session-start hook checks passed");
