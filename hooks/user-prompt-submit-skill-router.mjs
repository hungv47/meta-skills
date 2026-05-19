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

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAX_SKILLS = 2;
const MIN_PROMPT_LENGTH = 10;

// ---------------------------------------------------------------------------
// Contraction expansion
// ---------------------------------------------------------------------------

const CONTRACTIONS = {
  "it's": "it is", "what's": "what is", "where's": "where is",
  "that's": "that is", "there's": "there is", "who's": "who is",
  "how's": "how is", "isn't": "is not", "aren't": "are not",
  "wasn't": "was not", "weren't": "were not", "doesn't": "does not",
  "don't": "do not", "didn't": "did not", "won't": "will not",
  "can't": "cannot", "couldn't": "could not", "wouldn't": "would not",
  "shouldn't": "should not", "hasn't": "has not", "haven't": "have not",
  "i'm": "i am", "we're": "we are", "they're": "they are",
  "you're": "you are", "i've": "i have", "we've": "we have",
  "i'd": "i would", "we'd": "we would", "let's": "let us",
};

function expandContractions(text) {
  let t = text.replace(/[\u2018\u2019\u2032]/g, "'");
  for (const [contraction, expansion] of Object.entries(CONTRACTIONS)) {
    if (t.includes(contraction)) {
      t = t.replaceAll(contraction, expansion);
    }
  }
  return t;
}

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

function normalizePromptText(text) {
  if (typeof text !== "string") return "";
  let t = text.toLowerCase();
  t = expandContractions(t);
  return t.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Compile prompt signals (normalize all terms)
// ---------------------------------------------------------------------------

function compilePromptSignals(signals) {
  const norm = (s) => expandContractions(s.toLowerCase());
  return {
    phrases: (signals.phrases || []).map(norm),
    allOf: (signals.allOf || []).map((group) => group.map(norm)),
    anyOf: (signals.anyOf || []).map(norm),
    noneOf: (signals.noneOf || []).map(norm),
    minScore: typeof signals.minScore === "number" ? signals.minScore : 6,
  };
}

// ---------------------------------------------------------------------------
// Score a prompt against one skill's compiled signals
// ---------------------------------------------------------------------------

function matchPromptWithReason(normalizedPrompt, compiled) {
  if (!normalizedPrompt) {
    return { matched: false, score: 0, reason: "empty prompt" };
  }

  // noneOf: hard suppress (substring match, same as phrases/allOf/anyOf)
  for (const term of compiled.noneOf) {
    if (normalizedPrompt.includes(term)) {
      return { matched: false, score: -Infinity, reason: `suppressed by noneOf "${term}"` };
    }
  }

  let score = 0;
  const reasons = [];

  // phrases: +6 each
  for (const phrase of compiled.phrases) {
    if (normalizedPrompt.includes(phrase)) {
      score += 6;
      reasons.push(`phrase "${phrase}" +6`);
    }
  }

  // allOf: +4 per fully-matching group
  for (const group of compiled.allOf) {
    if (group.every((term) => normalizedPrompt.includes(term))) {
      score += 4;
      reasons.push(`allOf [${group.join(", ")}] +4`);
    }
  }

  // anyOf: +1 each, capped at +2
  let anyOfScore = 0;
  for (const term of compiled.anyOf) {
    if (normalizedPrompt.includes(term)) {
      anyOfScore += 1;
      if (anyOfScore <= 2) reasons.push(`anyOf "${term}" +1`);
    }
  }
  score += Math.min(anyOfScore, 2);

  const matched = score >= compiled.minScore;
  if (!matched) {
    const detail = reasons.length > 0 ? ` (${reasons.join("; ")})` : "";
    return { matched: false, score, reason: `below threshold: ${score} < ${compiled.minScore}${detail}` };
  }

  return { matched: true, score, reason: reasons.join("; ") };
}

// ---------------------------------------------------------------------------
// Load registry
// ---------------------------------------------------------------------------

function checkRegistryStaleness(registryPath) {
  const root = join(__dirname, "..");
  const skillDirs = [
    "research-skills/skills",
    "marketing-skills/skills",
    "product-skills/skills",
    "meta-skills/skills",
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
