#!/usr/bin/env bun
// check-skill-links — find dead relative Markdown links inside the skill stack.
//
// Scans every .md under skills/ (SKILL.md + references + _shared) for inline
// links `[text](path)` and bare `references/...`/`scripts/...` code-span paths
// that point at a local file, and reports any whose target does not exist
// relative to the linking file's directory. Catches fallout from moved or
// deleted files (e.g. the Phase 1 docs/ relocation + Phase 3 preview extraction).
//
// External links (http/https/mailto/roughdraft://), in-page anchors (#...),
// wikilinks ([[...]]), and `{placeholder}` template paths are skipped.
//
// Usage: bun scripts/check-skill-links.ts   (exit 0 = clean, 1 = dead links)

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SCAN_DIRS = ["skills", "references"];

const mdFiles: string[] = [];
for (const d of SCAN_DIRS) walk(join(ROOT, d));

function walk(dir: string): void {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    // Skip generated mirror trees: their relative links are authored for the
    // canonical source location and intentionally don't resolve from the copy.
    // Link integrity is the canonical source's responsibility.
    if (e.isDirectory() && e.name === "_shared") continue;
    const abs = join(dir, e.name);
    if (e.isDirectory()) walk(abs);
    else if (e.isFile() && e.name.endsWith(".md")) mdFiles.push(abs);
  }
}

const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;
const dead: string[] = [];
let linksChecked = 0;

for (const file of mdFiles) {
  const txt = readFileSync(file, "utf-8");
  const dir = dirname(file);
  let m: RegExpExecArray | null;
  while ((m = LINK_RE.exec(txt))) {
    let target = m[1].trim();
    // strip optional title and anchor
    target = target.replace(/\s+["'].*$/, "").split("#")[0].trim();
    if (!target) continue;
    if (/^(https?:|mailto:|roughdraft:|tel:)/.test(target)) continue;
    if (target.startsWith("{") || target.includes("{{")) continue; // template placeholder
    if (!/\.(md|ts|mjs|json|css|js|html|yaml|yml)$/.test(target)) continue; // only file-ish links
    linksChecked++;
    const resolved = resolve(dir, target);
    if (!existsSync(resolved)) {
      dead.push(`${relative(ROOT, file)} -> ${target}`);
    }
  }
}

if (dead.length === 0) {
  console.log(`[check-skill-links] OK — ${linksChecked} local links across ${mdFiles.length} files, all resolve.`);
  process.exit(0);
}
console.error(`[check-skill-links] FAIL — ${dead.length} dead link(s):`);
for (const d of dead) console.error(`  - ${d}`);
process.exit(1);
