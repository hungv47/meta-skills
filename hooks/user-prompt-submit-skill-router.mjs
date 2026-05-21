#!/usr/bin/env node
/**
 * UserPromptSubmit hook: auto-injects the best-matching skill when
 * the user's prompt matches a skill's promptSignals.
 *
 * Scoring (mirrors Vercel plugin's prompt-patterns engine):
 *   phrases:  +6 per exact substring hit (case-insensitive)
 *   allOf:    +4 per conjunction group where ALL terms match
 *   anyOf:    +1 per hit, capped at +2
 *   noneOf:   hard suppress (score → -Infinity)
 *   Threshold: score >= minScore (default 6)
 *
 * Max 2 skills injected per prompt.
 * Deduplicates via SKILL_ROUTER_SEEN env var.
 *
 * Input:  JSON on stdin { prompt, session_id, hook_event_name }
 * Output: JSON on stdout { hookSpecificOutput: { additionalContext } } or {}
 */

import { readFileSync, statSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizePromptText,
  compilePromptSignals,
  matchPromptWithReason,
} from "./skill-router-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAX_SKILLS = 2;
const MIN_PROMPT_LENGTH = 10;

// ---------------------------------------------------------------------------
// Load registry
// ---------------------------------------------------------------------------

function checkRegistryStaleness(registryPath) {
  const root = join(__dirname, "..");
  const skillDirs = [
    "skills/meta",
    "skills/research",
    "skills/marketing",
    "skills/product",
  ];
  let registryMtime;
  try {
    registryMtime = statSync(registryPath).mtimeMs;
  } catch {
    return; // Missing registry is handled by loadRegistry
  }
  for (const dir of skillDirs) {
    let entries;
    try { entries = readdirSync(join(root, dir)); } catch { continue; }
    for (const entry of entries) {
      try {
        const skillMtime = statSync(join(root, dir, entry, "SKILL.md")).mtimeMs;
        if (skillMtime > registryMtime) {
          process.stderr.write(`[skill-router] Registry may be stale: ${dir}/${entry}/SKILL.md is newer. Run: node hooks/build-registry.mjs\n`);
          return;
        }
      } catch { continue; }
    }
  }
}

function loadRegistry() {
  const registryPath = join(__dirname, "skill-registry.json");
  checkRegistryStaleness(registryPath);
  let raw;
  try {
    raw = readFileSync(registryPath, "utf-8");
  } catch (err) {
    process.stderr.write(`[skill-router] Registry not found at ${registryPath}: ${err.message}. Run: node hooks/build-registry.mjs\n`);
    return {};
  }
  const data = JSON.parse(raw);
  const compiled = {};
  for (const [name, signals] of Object.entries(data.skills)) {
    compiled[name] = compilePromptSignals(signals);
  }
  return compiled;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Read stdin
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString("utf-8"));

  const prompt = input.prompt || "";
  if (prompt.length < MIN_PROMPT_LENGTH) {
    process.stdout.write("{}");
    return;
  }

  // Skip if prompt starts with / (explicit skill invocation)
  if (prompt.trimStart().startsWith("/")) {
    process.stdout.write("{}");
    return;
  }

  const normalizedPrompt = normalizePromptText(prompt);
  const registry = loadRegistry();

  // Dedup: read already-seen skills
  const seenRaw = process.env.SKILL_ROUTER_SEEN || "";
  const seen = new Set(seenRaw.split(",").filter(Boolean));

  // Score all skills
  const results = [];
  for (const [name, compiled] of Object.entries(registry)) {
    if (seen.has(name)) continue;
    const result = matchPromptWithReason(normalizedPrompt, compiled);
    if (result.matched) {
      results.push({ name, score: result.score, reason: result.reason });
    }
  }

  if (results.length === 0) {
    process.stdout.write("{}");
    return;
  }

  // Rank by score DESC, take top N
  results.sort((a, b) => b.score - a.score);
  const winners = results.slice(0, MAX_SKILLS);

  // Build additionalContext
  const matchLines = winners.map(
    (w) => `  - "${w.name}" matched: ${w.reason}`
  );

  const suggestLines = winners.map(
    (w) => `Consider running the Skill(${w.name}) tool if it fits the user's actual request.`
  );

  const additionalContext = [
    `[skill-router] Heuristic match (suggestion only — apply your own relevance gate, ignore if not a fit):`,
    ...matchLines,
    "",
    "---",
    ...suggestLines,
    `<!-- skillRouter: ${JSON.stringify({ version: 2, mode: "suggest", matched: winners.map((w) => w.name), scores: winners.map((w) => w.score) })} -->`,
  ].join("\n");

  const output = {
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext,
    },
  };

  process.stdout.write(JSON.stringify(output));
}

main().catch((err) => {
  process.stderr.write(`[skill-router] ${err.message}\n`);
  process.stdout.write("{}");
});
