#!/usr/bin/env node
/**
 * Audit public skill references for source-specific residue.
 *
 * References are used to improve skill behavior. They should not expose scraped
 * post URLs, creator handles, source IDs, or verbatim-source language unless a
 * file is explicitly allowlisted as an internal source ledger.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const STACKS = ["research-skills", "marketing-skills", "product-skills", "meta-skills"];
const SOURCE_LEDGER_RE = /\/references\/(?:_sources|source-ledger)\//;

const REFERENCE_BLOCKED = [
  { name: "social post URL", re: /\b(?:x|twitter)\.com\/[^)\s]+\/status\/|\blinkedin\.com\/posts\/|\binstagram\.com\/(?:p|reel)\/|\byoutube\.com\/shorts\/|\btiktok\.com\/@/i },
  { name: "verbatim-source language", re: /\b(?:Verbatim example|verbatim from|\[verbatim|both rows verbatim|lifted verbatim from source)\b/i },
  { name: "source-id citation", re: /\[(?:src-[^\]]*|source:\s*(?:https?:\/\/|[a-z0-9_-]+)|S\d+(?:,\s*S\d+)*|s\d+(?:,\s*s\d+)*)\]|\[(?:adapted|pattern-derived|[a-z0-9-]+);\s*[a-z0-9-]+\]|\bsource_id:/i },
  { name: "source-id token", re: /\b(?:yasser-chatbase|jibran-lightreel|willhenry-x|timon-comment|gstack-office-hours|slavingia-[a-z0-9-]+)\b/i },
  { name: "source-token cell", re: /\|\s*(?:`?internal`?\s*,\s*)?(?:(?:hootsuite|tt|smt|later|opus|vidiq|shortimize|virvid|joyspace|paddy|tubebuddy|accio|admetrics|sproutsocial|jera|shorts)-[a-z0-9-]+|s\d+)(?:\s*[,;]\s*(?:(?:hootsuite|tt|smt|later|opus|vidiq|shortimize|virvid|joyspace|paddy|tubebuddy|accio|admetrics|sproutsocial|jera|shorts)-[a-z0-9-]+|s\d+))*\s*(?=\|)/i },
  { name: "bracketed provenance token", re: /(^|[^A-Za-z0-9_])\[(?!pattern-derived\]|internal\]|TBD\])(?:[a-z][a-z0-9]+-[a-z0-9-]+)\]/i },
  { name: "broken pattern-basis marker", re: /\*\*Pattern basis:\s*internal research synthesis\.|internal\s*\([^)\n]+\)/i },
  { name: "raw sources frontmatter", re: /^(?:sources:|source:)\s*$/i },
  { name: "source url field", re: /^\s+url:\s*https?:\/\//i },
  { name: "named source provenance", re: /\b(?:Sahil(?:\s+Lavingia|\s+Bloom)?|Gumroad|Yasser(?:\s+Elsaid)?|Chatbase|Will Henry|Timon Zimmermann|Oren John|Nick Saraev|Roman Khaves|Jibran|Justin Welsh|Welsh|Pieter Levels|Naval|Tamilore Oladipo|Mr\.?\s*Beast|Jimmy Donaldson|Ali Abdaal|Saf McLean|Casey|Rene Ritchie|Todd Beaupré|Beaupré|Ritchie|Paddy|Think Media|Hootsuite|OpusClip|Galloway|Sprout Social|vidIQ|TubeBuddy|Shortimize|AuthoredUp|van der Blom|Typefully|Musk|Mosseri|ManyChat|Tweet Archivist)\b/i },
];

const SKILL_INSTRUCTION_BLOCKED = REFERENCE_BLOCKED.filter((blocked) =>
  ["social post URL", "source-id citation", "source-id token", "named source provenance"].includes(blocked.name)
);

const GENERIC_HANDLES = new Set([
  "brand",
  "creator",
  "handle",
  "tool",
  "kol",
  "kol_a",
  "partner",
  "partner_b",
  "chain_official",
  "dev_influencer",
  "indiehacker_voice",
  "framework_partner",
]);

const CODE_TOKENS = new Set([
  "context",
  "type",
  "font-face",
  "vercel",
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(path);
  }
  return out;
}

const findings = [];

function findCreatorHandles(line) {
  const matches = [];
  const re = /(^|[^A-Za-z0-9_])@([A-Za-z0-9_.-]{3,})/g;
  for (const match of line.matchAll(re)) {
    const handle = match[2].toLowerCase();
    if (GENERIC_HANDLES.has(handle) || CODE_TOKENS.has(handle)) continue;
    if (line.includes(`'@${match[2]}'`) || line.includes(`"@${match[2]}"`)) continue;
    matches.push(match[0].trim());
  }
  return matches;
}

for (const stack of STACKS) {
  for (const file of walk(join(ROOT, stack, "skills"))) {
    const rel = relative(ROOT, file);
    if (SOURCE_LEDGER_RE.test(rel)) continue;
    const isReference = rel.includes("/references/");
    const blockedPatterns = isReference ? REFERENCE_BLOCKED : SKILL_INSTRUCTION_BLOCKED;

    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const blocked of blockedPatterns) {
        if (blocked.re.test(line)) {
          findings.push({
            file: rel,
            line: index + 1,
            type: blocked.name,
            text: line.trim(),
          });
        }
      }

      if (isReference && findCreatorHandles(line).length > 0) {
        findings.push({
          file: rel,
          line: index + 1,
          type: "creator handle",
          text: line.trim(),
        });
      }
    });
  }
}

if (findings.length > 0) {
  console.error(`Reference hygiene audit failed: ${findings.length} source-specific references found.\n`);
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} [${finding.type}] ${finding.text}`);
  }
  process.exit(1);
}

console.log("Reference hygiene audit passed: no public reference source residue found.");
