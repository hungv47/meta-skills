#!/usr/bin/env bun
// Start a harness recording session.
// Writes .active marker with run metadata; subsequent tool calls log to .events/<run-id>.jsonl
// until `stop.ts` finalizes the run.
//
// Usage:
//   bun meta-skills/scripts/harness/record.ts --skill <name> --fixture <minimal|standard|stretch> [--mode <fast|standard|deep>] [--notes "..."]
//
// Exits non-zero if a run is already active (prevents accidental overlap).

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HARNESS_DIR, INPUTS_DIR, MARKER_PATH, ensureDirs } from "./lib/io";
import { locateSkill, skillBodyStats, ulid } from "./lib/parse";
import { sha256 } from "./lib/hash";
import { parseArgs, strArg } from "./lib/args";
import type { FixtureKind, ModeName, RunMarker } from "./schema";

function main() {
  ensureDirs();

  if (existsSync(MARKER_PATH)) {
    console.error("A harness run is already active.");
    console.error(`  Marker: ${MARKER_PATH}`);
    console.error("  Run `bun meta-skills/scripts/harness/stop.ts` to finalize it, or delete the marker manually if stale.");
    process.exit(2);
  }

  const args = parseArgs(process.argv.slice(2));
  const skillName = strArg(args, "skill");
  if (!skillName) {
    console.error("Missing --skill <name>");
    process.exit(2);
  }

  const located = locateSkill(skillName);
  if (!located) {
    console.error(`Skill not found in any stack: ${skillName}`);
    process.exit(2);
  }

  const fixtureKind = (strArg(args, "fixture") ?? null) as FixtureKind | null;
  const modeFlag = strArg(args, "mode");
  const mode = (modeFlag ?? "standard") as ModeName;
  const notes = strArg(args, "notes") ?? "";

  let fixturePath: string | null = null;
  let userPrompt = "";
  if (fixtureKind) {
    fixturePath = join(INPUTS_DIR, `${skillName}-${fixtureKind}.md`);
    if (existsSync(fixturePath)) {
      userPrompt = readFileSync(fixturePath, "utf8");
    } else {
      console.warn(`Warning: fixture file does not exist: ${fixturePath}`);
      console.warn("  Recording will proceed but the run will be labeled fixture-less.");
      fixturePath = null;
    }
  }

  const stats = skillBodyStats(located.path);
  const runId = ulid();
  const now = new Date().toISOString();

  const marker: RunMarker = {
    run_id: runId,
    started_at: now,
    skill: skillName,
    stack: located.stack,
    skill_version: located.version,
    mode_resolved: mode,
    mode_source: modeFlag ? "operator-flag" : "default",
    mode_resolver_reasoning: modeFlag ? `operator override via --mode ${modeFlag}` : "default budget for skill",
    fixture_path: fixturePath,
    fixture_kind: fixtureKind,
    user_prompt_chars: userPrompt.length,
    user_prompt_hash: userPrompt.length > 0 ? sha256(userPrompt) : "",
    skill_md_path: located.path,
    skill_md_lines: stats.lines,
    skill_md_chars: stats.chars,
    notes,
  };

  writeFileSync(MARKER_PATH, JSON.stringify(marker, null, 2));

  console.log(`Harness recording STARTED`);
  console.log(`  run_id:   ${runId}`);
  console.log(`  skill:    ${skillName} (${located.stack}, v${located.version ?? "?"})`);
  console.log(`  fixture:  ${fixtureKind ?? "(none)"} ${fixturePath ? `→ ${fixturePath}` : ""}`);
  console.log(`  mode:     ${mode} (${marker.mode_source})`);
  console.log(`  body:     ${stats.lines} lines / ${stats.chars} chars (${HARNESS_DIR})`);
  console.log("");
  console.log("Invoke the skill now. When the skill's work completes, run:");
  console.log("  bun meta-skills/scripts/harness/stop.ts");
}

main();
