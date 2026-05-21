#!/usr/bin/env bun
// explain-skill-route — answer "why did (or didn't) skill X match this prompt?"
//
// Usage:
//   bun scripts/explain-skill-route.ts "<prompt text>"
//
// Reads the compiled hooks/skill-registry.json and reuses the EXACT scoring
// logic of the router hook (hooks/skill-router-core.mjs) — so this explainer
// can never drift from the live router. The INJECTED rows below equal what the
// UserPromptSubmit hook would actually inject for the same prompt.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizePromptText,
  compilePromptSignals,
  matchPromptWithReason,
} from "../hooks/skill-router-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MAX_SKILLS = 2; // mirrors the hook
const MIN_PROMPT_LENGTH = 10; // mirrors the hook

const prompt = process.argv.slice(2).join(" ").trim();
if (!prompt) {
  console.error('Usage: bun scripts/explain-skill-route.ts "<prompt text>"');
  process.exit(1);
}

const registry = JSON.parse(
  readFileSync(join(ROOT, "hooks", "skill-registry.json"), "utf-8"),
);
const normalized = normalizePromptText(prompt);

type Row = { name: string; score: number; matched: boolean; reason: string };
const rows: Row[] = [];
for (const [name, signals] of Object.entries(registry.skills)) {
  const compiled = compilePromptSignals(signals as any);
  const r = matchPromptWithReason(normalized, compiled);
  rows.push({ name, score: r.score, matched: r.matched, reason: r.reason });
}

// Rank: matched skills first (by score desc), then everything else by score.
rows.sort(
  (a, b) => Number(b.matched) - Number(a.matched) || b.score - a.score,
);

const matched = rows.filter((r) => r.matched);
const winners = new Set(matched.slice(0, MAX_SKILLS).map((r) => r.name));

console.log(`\nPrompt:     "${prompt}"`);
console.log(`Normalized: "${normalized}"`);
if (prompt.length < MIN_PROMPT_LENGTH) {
  console.log(
    `\n⚠  Under ${MIN_PROMPT_LENGTH} chars — the live hook skips routing for prompts this short.`,
  );
}
if (prompt.trimStart().startsWith("/")) {
  console.log(
    `\n⚠  Starts with "/" — the live hook treats this as an explicit invocation and skips routing.`,
  );
}

console.log(
  `\n${matched.length} skill(s) over threshold; the hook injects up to ${MAX_SKILLS} (marked INJECTED).\n`,
);

for (const r of rows) {
  const tag = winners.has(r.name)
    ? "→ INJECTED "
    : r.matched
      ? "  matched  "
      : r.score === -Infinity
        ? "  suppress "
        : "           ";
  const score = r.score === -Infinity ? "  ∅" : String(r.score).padStart(3);
  console.log(`${tag} ${score}  ${r.name}`);
  // Reason line only when there is signal worth reading.
  if (r.matched || r.score === -Infinity || r.score > 0) {
    console.log(`              ${r.reason}`);
  }
}
console.log("");
