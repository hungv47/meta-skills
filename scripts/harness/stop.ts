#!/usr/bin/env bun
// Finalize the active harness recording.
// Reads the marker + event log, computes contract hashes for any artifacts produced,
// writes the run JSON, and clears the marker.
//
// Usage:
//   bun scripts/harness/stop.ts [--artifact <path>...]
//
// --artifact may be passed multiple times to declare the output artifacts that this run
// produced. If omitted, the harness infers them from Write/Edit events in the log.

import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { HARNESS_DIR, EVENTS_DIR, MARKER_PATH, ROOT, ensureDirs, readJsonl, writeJson, relToRoot, fileStats } from "./lib/io";
import { categorizeRead, skillFolder } from "./lib/parse";
import { contractHash } from "./lib/hash";
import { multiStrArg } from "./lib/args";
import { HARNESS_VERSION } from "./schema";
import type { AgentSpawn, OutputArtifact, RefLoad, RunMarker, RunResult, ToolEvent } from "./schema";

// Paths under these prefixes are runtime scratch, not contract artifacts.
// Inference must skip them to avoid polluting contract-stability checks.
const ARTIFACT_INFER_EXCLUDES = [
  "/.forsvn/artifacts/.archive/",
  "/.forsvn/artifacts/meta/records/harness/",
  "/.agents/manifest.json",
  "/.agents/artifact-index.md",
  "/.forsvn/loops/.harness/",
];

function main() {
  ensureDirs();

  if (!existsSync(MARKER_PATH)) {
    console.error("No active harness run.");
    console.error("  Start one with: bun scripts/harness/record.ts --skill <name> --fixture <kind>");
    process.exit(2);
  }

  const marker = JSON.parse(readFileSync(MARKER_PATH, "utf8")) as RunMarker;
  const runId = marker.run_id;
  const eventsPath = join(EVENTS_DIR, `${runId}.jsonl`);
  const events = readJsonl<ToolEvent>(eventsPath);

  const explicitArtifacts = multiStrArg(process.argv.slice(2), "artifact");
  const folder = skillFolder(marker.skill_md_path);

  // Walk events → build per-category counts, ref loads, agent spawns, declared artifacts.
  let bashCalls = 0;
  let readCalls = 0;
  let writeCalls = 0;
  let editCalls = 0;
  const refsRead: RefLoad[] = [];
  const agents: AgentSpawn[] = [];
  const writtenPaths = new Set<string>();
  const seenRefs = new Set<string>();

  events.forEach((ev, idx) => {
    switch (ev.tool_name) {
      case "Read": {
        readCalls++;
        const fp = ev.file_path;
        if (!fp) break;
        const cat = categorizeRead(fp, folder);
        if (cat === "skill-internal-ref" || cat === "skill-external-ref") {
          if (!seenRefs.has(fp)) {
            seenRefs.add(fp);
            refsRead.push({
              path: relToRoot(fp),
              loaded_at_step: idx,
              lines: ev.file_lines ?? 0,
              chars: ev.file_chars ?? 0,
            });
          }
        }
        break;
      }
      case "Write": writeCalls++; if (ev.file_path) writtenPaths.add(resolve(ev.file_path)); break;
      case "Edit":
      case "NotebookEdit": editCalls++; if (ev.file_path) writtenPaths.add(resolve(ev.file_path)); break;
      case "Bash": bashCalls++; break;
      case "Agent":
      case "Task":
      case "Skill": {
        agents.push({
          name: ev.subagent_type ?? "unknown",
          spawned_at_step: idx,
          input_chars: ev.subagent_prompt_chars ?? 0,
          output_chars: ev.subagent_output_chars ?? 0,
          // TODO(v0.2): compute output_changed_main_thread by hashing main-thread
          // transcript before/after the agent call. See README "Known limitations".
          output_changed_main_thread: null,
        });
        break;
      }
    }
  });

  // Output artifacts: explicit --artifact wins; otherwise infer from writes that look like artifact paths.
  // Inference excludes runtime scratch paths (harness records, archive, manifest).
  let inferred = false;
  const declared = explicitArtifacts.length > 0
    ? explicitArtifacts.map((p) => resolve(p))
    : (() => {
        inferred = true;
        return Array.from(writtenPaths).filter((p) => {
          const inArtifactRegion =
            p.includes("/.agents/") ||
            p.includes("/.forsvn/") ||
            p.startsWith(join(ROOT, "research") + "/") ||
            p.startsWith(join(ROOT, "brand") + "/") ||
            p.startsWith(join(ROOT, "architecture") + "/");
          if (!inArtifactRegion) return false;
          return !ARTIFACT_INFER_EXCLUDES.some((ex) => p.includes(ex));
        });
      })();

  const outputArtifacts: OutputArtifact[] = declared.map((p) => {
    const stats = fileStats(p);
    const ch = contractHash(p);
    return {
      path: relToRoot(p),
      exists: stats.exists,
      lifecycle: ch.lifecycle,
      status: ch.status,
      frontmatter_hash: ch.frontmatter,
      section_header_hash: ch.sections,
      contract_hash: ch.contract,
      bytes: stats.bytes,
    };
  });

  const totalRefChars = refsRead.reduce((s, r) => s + r.chars, 0);

  const endedAt = new Date();
  const wallMs = endedAt.getTime() - new Date(marker.started_at).getTime();

  const run: RunResult = {
    run_id: runId,
    timestamp: marker.started_at,
    skill: marker.skill,
    stack: marker.stack,
    skill_version: marker.skill_version,
    fixture: { path: marker.fixture_path, kind: marker.fixture_kind },
    mode: {
      resolved: marker.mode_resolved,
      source: marker.mode_source,
      resolver_reasoning: marker.mode_resolver_reasoning,
    },
    input: {
      user_prompt_chars: marker.user_prompt_chars,
      user_prompt_hash: marker.user_prompt_hash,
      referenced_artifact_paths: [],
    },
    context_load: {
      skill_md_path: relToRoot(marker.skill_md_path),
      skill_md_lines: marker.skill_md_lines,
      skill_md_chars: marker.skill_md_chars,
      refs_read_in_order: refsRead,
      total_default_chars: marker.skill_md_chars,
      total_with_refs_chars: marker.skill_md_chars + totalRefChars,
    },
    agents_spawned: agents,
    tool_calls: events.length,
    bash_calls: bashCalls,
    read_calls: readCalls,
    write_calls: writeCalls,
    edit_calls: editCalls,
    output_artifacts: outputArtifacts,
    wall_time_ms: wallMs,
    notes: marker.notes,
    harness_version: HARNESS_VERSION,
  };

  const datePrefix = marker.started_at.slice(0, 10);
  const outPath = join(HARNESS_DIR, `${datePrefix}-${marker.skill}-${runId}.json`);
  writeJson(outPath, run);

  unlinkSync(MARKER_PATH);

  console.log("Harness recording STOPPED");
  console.log(`  run:        ${runId}`);
  console.log(`  duration:   ${(wallMs / 1000).toFixed(1)}s`);
  console.log(`  tool calls: ${events.length} (read=${readCalls}, write=${writeCalls}, edit=${editCalls}, bash=${bashCalls}, agents=${agents.length})`);
  console.log(`  refs read:  ${refsRead.length} (${totalRefChars} chars beyond SKILL.md)`);
  console.log(`  artifacts:  ${outputArtifacts.length}`);
  for (const a of outputArtifacts) {
    console.log(`    - ${a.path}  contract=${a.contract_hash ?? "(no-frontmatter)"}  ${a.exists ? "OK" : "MISSING"}`);
  }
  console.log(`  saved:      ${relToRoot(outPath)}`);
  if (inferred && outputArtifacts.length > 0) {
    console.log("");
    console.log("  WARNING: artifacts were inferred from Write/Edit events.");
    console.log("  For reliable contract-hash tracking, pass --artifact <path> explicitly next time.");
  }
}

main();
