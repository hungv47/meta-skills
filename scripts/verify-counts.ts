#!/usr/bin/env bun
// verify-counts — assert the skill count agrees across every surface that states it.
//
// Usage: bun scripts/verify-counts.ts
//
// Ground truth = the actual count of skills/<domain>/<skill>/SKILL.md files.
// Checks: .claude-plugin/plugin.json skills[] length; every "<N> skills" claim
// in marketplace.json / CLAUDE.md / README.md; and the README per-domain
// section headers. Exits non-zero with a precise diff on any mismatch — wire
// it into a pre-release step so a stale count cannot ship.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOMAINS = ["meta", "research", "marketing", "product"] as const;

// --- ground truth: count SKILL.md files per domain --------------------------
const perDomain: Record<string, number> = {};
let total = 0;
for (const d of DOMAINS) {
  let n = 0;
  for (const entry of readdirSync(join(ROOT, "skills", d))) {
    if (existsSync(join(ROOT, "skills", d, entry, "SKILL.md"))) n++;
  }
  perDomain[d] = n;
  total += n;
}

const errors: string[] = [];

// --- plugin.json skills[] must match the filesystem ------------------------
const plugin = JSON.parse(
  readFileSync(join(ROOT, ".claude-plugin/plugin.json"), "utf-8"),
);
const pluginSkills = Array.isArray(plugin.skills) ? plugin.skills.length : 0;
if (pluginSkills !== total) {
  errors.push(
    `.claude-plugin/plugin.json skills[] = ${pluginSkills}, filesystem = ${total}`,
  );
}

// --- every "<N> skills" claim in prose must be a valid count ----------------
// Valid = the total, or any per-domain count (per-domain numbers legitimately
// appear, e.g. "7 skills in research/").
const valid = new Set<number>([total, ...Object.values(perDomain)]);

for (const rel of [".claude-plugin/marketplace.json", "CLAUDE.md", "README.md"]) {
  const text = readFileSync(join(ROOT, rel), "utf-8");
  const re = /(\d+)\s+skills?\b/gi;
  let m: RegExpExecArray | null;
  let sawTotal = false;
  while ((m = re.exec(text)) !== null) {
    const n = parseInt(m[1], 10);
    if (n === total) sawTotal = true;
    if (!valid.has(n)) {
      const line = text.slice(0, m.index).split("\n").length;
      errors.push(
        `${rel}:${line} claims "${m[0]}" — not a valid count ` +
          `(total ${total}; per-domain ${JSON.stringify(perDomain)})`,
      );
    }
  }
  if (!sawTotal) {
    errors.push(`${rel} never states the true total (${total} skills)`);
  }
}

// --- README per-domain section headers ("<N> skills in skills/<domain>/") ---
const readme = readFileSync(join(ROOT, "README.md"), "utf-8");
const domainRe =
  /(\d+)\s+skills?\s+in\b[^\n]*?skills\/(meta|research|marketing|product)\//gi;
let dm: RegExpExecArray | null;
while ((dm = domainRe.exec(readme)) !== null) {
  const claimed = parseInt(dm[1], 10);
  const domain = dm[2];
  if (claimed !== perDomain[domain]) {
    const line = readme.slice(0, dm.index).split("\n").length;
    errors.push(
      `README.md:${line} claims "${dm[0].trim()}" — ${domain} actually has ${perDomain[domain]}`,
    );
  }
}

// --- "<N> <domain> skills" claims (e.g. CLAUDE.md tree comments) ------------
for (const rel of [".claude-plugin/marketplace.json", "CLAUDE.md", "README.md"]) {
  const text = readFileSync(join(ROOT, rel), "utf-8");
  const re = /(\d+)\s+(meta|research|marketing|product)\s+skills?\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const claimed = parseInt(m[1], 10);
    const domain = m[2].toLowerCase();
    if (claimed !== perDomain[domain]) {
      const line = text.slice(0, m.index).split("\n").length;
      errors.push(
        `${rel}:${line} claims "${m[0]}" — ${domain} actually has ${perDomain[domain]}`,
      );
    }
  }
}

// --- report -----------------------------------------------------------------
console.log(
  `Ground truth: ${total} skills ` +
    `(meta ${perDomain.meta}, research ${perDomain.research}, ` +
    `marketing ${perDomain.marketing}, product ${perDomain.product})`,
);
if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} count mismatch(es):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("✓ all skill-count claims agree.");
