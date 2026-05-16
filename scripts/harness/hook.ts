#!/usr/bin/env bun
// PostToolUse hook — logs every tool call to the active harness run, if any.
// Installed in agent-skills/.claude/settings.json — fires inside this repo only.
//
// Contract:
//   - NEVER throws, NEVER blocks. Exit 0 always, no matter what fails.
//   - When no marker file exists, exits silently in < 5ms.
//   - When marker exists, appends one JSONL event to .events/<run-id>.jsonl.
//
// Hook payload (read from stdin, JSON):
//   { session_id, transcript_path, tool_name, tool_input, tool_response }

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { MARKER_PATH, EVENTS_DIR, appendJsonl, logDebug } from "./lib/io";

async function main() {
  // Fast path — no marker, no work.
  if (!existsSync(MARKER_PATH)) return;

  let payload: any = {};
  try {
    const raw = await Bun.stdin.text();
    payload = raw.trim().length > 0 ? JSON.parse(raw) : {};
  } catch {
    logDebug("hook: failed to parse stdin payload");
    return;
  }

  let marker: any = {};
  try {
    marker = JSON.parse(readFileSync(MARKER_PATH, "utf8"));
  } catch {
    logDebug("hook: marker file unreadable");
    return;
  }

  const runId = marker.run_id;
  if (!runId) return;

  const event: Record<string, unknown> = {
    ts: new Date().toISOString(),
    phase: "post",
    tool_name: payload.tool_name ?? "unknown",
    tool_input: payload.tool_input ?? {},
  };

  // Extract per-tool extras — size signals for the aggregator.
  const tin = payload.tool_input ?? {};
  const tres = payload.tool_response ?? {};

  switch (payload.tool_name) {
    case "Read": {
      const filePath = tin.file_path ?? tin.filePath;
      if (filePath) event.file_path = filePath;
      // Tool response shape varies. Try in order: string, {content}, {text}, {file.content},
      // [{type, text}] array (CC multi-block content), fall back to stringified envelope.
      let content = "";
      if (typeof tres === "string") content = tres;
      else if (typeof tres.content === "string") content = tres.content;
      else if (typeof tres.text === "string") content = tres.text;
      else if (typeof tres.file?.content === "string") content = tres.file.content;
      else if (Array.isArray(tres.content)) {
        content = tres.content
          .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
          .join("");
      }
      else content = JSON.stringify(tres ?? "");
      event.file_chars = content.length;
      event.file_lines = content.split("\n").length;
      event.tool_response_size = content.length;
      break;
    }
    case "Write":
    case "Edit":
    case "NotebookEdit": {
      const filePath = tin.file_path ?? tin.notebook_path;
      if (filePath) event.file_path = filePath;
      const written = tin.content ?? tin.new_string ?? "";
      if (typeof written === "string") event.file_chars = written.length;
      break;
    }
    case "Agent":
    case "Task": {
      event.subagent_type = tin.subagent_type ?? null;
      event.subagent_description = (tin.description ?? "").slice(0, 200);
      const prompt = typeof tin.prompt === "string" ? tin.prompt : JSON.stringify(tin.prompt ?? "");
      event.subagent_prompt_chars = prompt.length;
      let outText: string;
      if (typeof tres === "string") outText = tres;
      else if (typeof tres.text === "string") outText = tres.text;
      else if (typeof tres.content === "string") outText = tres.content;
      else if (Array.isArray(tres.content)) {
        outText = tres.content
          .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
          .join("");
      }
      else outText = JSON.stringify(tres ?? "");
      event.subagent_output_chars = outText.length;
      break;
    }
    case "Bash": {
      const cmd = typeof tin.command === "string" ? tin.command : "";
      event.bash_command_preview = cmd.slice(0, 300);
      const stdout = tres.stdout ?? tres.output ?? "";
      event.tool_response_size = typeof stdout === "string" ? stdout.length : 0;
      break;
    }
    case "Skill": {
      event.subagent_type = tin.skill ?? null;
      event.subagent_description = (tin.args ?? "").slice(0, 200);
      break;
    }
    default: {
      event.tool_response_size = typeof tres === "string" ? tres.length : JSON.stringify(tres ?? "").length;
    }
  }

  try {
    appendJsonl(join(EVENTS_DIR, `${runId}.jsonl`), event);
  } catch (e) {
    logDebug(`hook: append failed for ${runId}: ${(e as Error).message}`);
  }
}

main().catch((e) => {
  logDebug(`hook: unhandled error: ${(e as Error).message}`);
  process.exit(0);
});
