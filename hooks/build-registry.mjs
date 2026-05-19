#!/usr/bin/env node
/**
 * Scans all SKILL.md files in the 4 stack skill directories,
 * extracts promptSignals from YAML frontmatter, and writes
 * hooks/skill-registry.json.
 *
 * Usage:
 *   node hooks/build-registry.mjs
 *   node hooks/build-registry.mjs --check
 *
 * Run this after editing any skill's promptSignals block.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SKILL_DIRS = [
  "research-skills/skills",
  "marketing-skills/skills",
  "product-skills/skills",
  "meta-skills/skills",
];

/**
 * Minimal YAML frontmatter parser for promptSignals.
 * Handles the specific structure we need without a YAML library:
 *   promptSignals:
 *     phrases: [...]
 *     allOf: [[...], [...]]
 *     anyOf: [...]
 *     noneOf: [...]
 *     minScore: 6
 */
function parsePromptSignals(frontmatter) {
  const lines = frontmatter.split("\n");
  let inPromptSignals = false;
  let currentField = null;
  const signals = { phrases: [], allOf: [], anyOf: [], noneOf: [], minScore: 6 };

  for (const line of lines) {
    const trimmed = line.trimEnd();

    // Detect start of promptSignals block
    if (/^promptSignals:\s*$/.test(trimmed)) {
      inPromptSignals = true;
      continue;
    }

    if (!inPromptSignals) continue;

    // Exit promptSignals when we hit a non-indented line (next top-level key)
    if (trimmed.length > 0 && !trimmed.startsWith(" ") && !trimmed.startsWith("\t")) {
      break;
    }

    // Detect field names (2-space indent)
    const fieldMatch = trimmed.match(/^\s{2}(\w+):\s*(.*)$/);
    if (fieldMatch) {
      const [, field, inlineValue] = fieldMatch;

      if (field === "minScore") {
        const v = parseInt(inlineValue, 10);
        signals.minScore = Number.isFinite(v) ? v : 6;
        currentField = null;
        continue;
      }

      if (["phrases", "allOf", "anyOf", "noneOf"].includes(field)) {
        currentField = field;
        // Check for inline JSON array: phrases: ["a", "b"]
        if (inlineValue.startsWith("[")) {
          try {
            const parsed = JSON.parse(inlineValue);
            signals[field] = parsed;
            currentField = null;
          } catch { /* fall through to line-by-line */ }
        }
        continue;
      }
    }

    // Parse list items (4-space indent: - "value" or - [a, b, c])
    if (currentField) {
      const listItemMatch = trimmed.match(/^\s{4}-\s+(.+)$/);
      if (listItemMatch) {
        let value = listItemMatch[1].trim();

        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // allOf items are arrays: - [term1, term2]
        if (currentField === "allOf" && value.startsWith("[")) {
          try {
            const arr = JSON.parse(value);
            signals.allOf.push(arr);
          } catch {
            // Try parsing as comma-separated without brackets
            const terms = value.slice(1, -1).split(",").map((t) => t.trim().replace(/^["']|["']$/g, ""));
            signals.allOf.push(terms);
          }
        } else {
          signals[currentField].push(value);
        }
      }
    }
  }

  return signals;
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

function buildRegistry() {
  const skills = {};
  let count = 0;

  for (const dir of SKILL_DIRS) {
    const dirPath = join(ROOT, dir);
    let entries;
    try {
      entries = readdirSync(dirPath);
    } catch {
      console.warn(`[build-registry] Skipping ${dir}: directory not found`);
      continue;
    }

    for (const entry of entries) {
      const skillPath = join(dirPath, entry, "SKILL.md");
      try {
        statSync(skillPath);
      } catch {
        continue; // Not a skill directory
      }

      const content = readFileSync(skillPath, "utf-8");
      const frontmatter = extractFrontmatter(content);
      if (!frontmatter) {
        console.warn(`[build-registry] ${entry}: no frontmatter found`);
        continue;
      }

      if (!frontmatter.includes("promptSignals:")) {
        console.warn(`[build-registry] ${entry}: no promptSignals — skipping`);
        continue;
      }

      const signals = parsePromptSignals(frontmatter);

      // Validate: at least one phrase or allOf group
      if (signals.phrases.length === 0 && signals.allOf.length === 0) {
        console.warn(`[build-registry] WARNING: ${entry} has promptSignals: block but parsing yielded empty phrases and allOf. Check YAML indent (expect 2-space fields, 4-space list items). Skipping.`);
        continue;
      }

      skills[entry] = signals;
      count++;
    }
  }

  return { registry: { version: 1, skills }, count };
}

function main() {
  const { registry, count } = buildRegistry();
  const outPath = join(__dirname, "skill-registry.json");
  const next = JSON.stringify(registry, null, 2) + "\n";

  if (process.argv.includes("--check")) {
    const current = readFileSync(outPath, "utf-8");
    if (current !== next) {
      console.error("[build-registry] skill-registry.json is stale. Run `node hooks/build-registry.mjs`.");
      process.exit(1);
    }
    console.log(`[build-registry] Registry is current (${count} skills).`);
    return;
  }

  writeFileSync(outPath, next);
  console.log(`[build-registry] Wrote ${count} skills to ${outPath}`);
}

main();
