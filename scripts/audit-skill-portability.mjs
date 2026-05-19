#!/usr/bin/env node
/**
 * Audit every installable skill for references that will break when installed
 * with `npx skills add <repo> --skill <name>`.
 *
 * The Skills CLI installs only the selected skill directory. A skill therefore
 * cannot depend on sibling stack folders, root-level shared folders, or
 * `meta-skills/scripts` unless those files are vendored into the skill.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, resolve, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const STACKS = ["research-skills", "marketing-skills", "product-skills", "meta-skills"];
const TEXT_EXTENSIONS = new Set([".md", ".sh", ".py", ".ts", ".js", ".mjs"]);

const BLOCKED_PATTERNS = [
  {
    name: "cross-stack path",
    re: /(?:^|[`"'\s(])(?:research-skills|marketing-skills|product-skills|meta-skills)\//,
  },
  {
    name: "installed meta-skills runtime path",
    re: /\$\{SKILLS_ROOT:-\.claude\/skills\}\/meta-skills\//,
  },
  {
    name: "root-relative meta-skills command",
    re: /bun\s+meta-skills\/scripts\//,
  },
];

const ALLOW_PATTERNS = [
  /skills-resources\//,
  /research\/product-context\.md/,
  /research\/icp-research\.md/,
  /research\/market-research\.md/,
  /brand\/(?:BRAND|DESIGN|ASSETS)\.md/,
  /architecture\/system-architecture\.md/,
];

const RELATIVE_PATH_RE = /(?:^|[`"'\s(])((?:\.\.\/)+[A-Za-z0-9._/-]+)/g;
const LOCAL_SUPPORT_PATH_RE = /(?:^|[`"'\s(])((?:references|scripts)\/[A-Za-z0-9._/\[\]-]+)/g;

function isContainedIn(targetPath, basePath) {
  const base = normalize(resolve(basePath));
  const target = normalize(resolve(targetPath));
  return target === base || target.startsWith(base + sep);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (entry.isFile()) out.push(path);
  }
  return out;
}

function ext(path) {
  const m = path.match(/(\.[^.]+)$/);
  return m ? m[1] : "";
}

function skillDirs() {
  const dirs = [];
  for (const stack of STACKS) {
    const skillsRoot = join(ROOT, stack, "skills");
    for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = join(skillsRoot, entry.name);
      try {
        if (statSync(join(dir, "SKILL.md")).isFile()) dirs.push(dir);
      } catch {
        // not a skill
      }
    }
  }
  return dirs;
}

function isAllowed(line) {
  return ALLOW_PATTERNS.some((re) => re.test(line));
}

function stripPlaceholder(path) {
  const placeholderIndex = path.search(/\[[^\]]+\]|\*/);
  if (placeholderIndex === -1) return { path: path.replace(/[\]).,;:]+$/, ""), placeholder: false };
  return { path: path.slice(0, placeholderIndex).replace(/\/?$/, ""), placeholder: true };
}

function localSupportExists(skillDir, path) {
  const { path: stripped, placeholder } = stripPlaceholder(path);
  if (!stripped || stripped === "references" || stripped === "scripts") return true;
  const target = resolve(skillDir, stripped);
  if (existsSync(target)) return true;
  return placeholder && existsSync(stripped.endsWith("/") ? target : dirname(target));
}

const findings = [];

for (const dir of skillDirs()) {
  for (const file of walk(dir)) {
    if (!TEXT_EXTENSIONS.has(ext(file))) continue;
    const rel = relative(ROOT, file);
    const fileText = readFileSync(file, "utf8");
    const isGeneratedSupport = fileText.includes("GENERATED SUPPORT FILE");
    const lines = fileText.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (isAllowed(line)) return;
      for (const match of line.matchAll(RELATIVE_PATH_RE)) {
        const relPath = match[1];
        const resolved = resolve(dirname(file), relPath);
        if (!isContainedIn(resolved, dir)) {
          findings.push({
            file: rel,
            line: index + 1,
            type: "parent traversal outside skill",
            text: line.trim(),
          });
        }
      }
      for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.re.test(line)) {
          findings.push({
            file: rel,
            line: index + 1,
            type: pattern.name,
            text: line.trim(),
          });
        }
      }
      if (isGeneratedSupport) return;
      for (const match of line.matchAll(LOCAL_SUPPORT_PATH_RE)) {
        const localPath = match[1].replace(/[\]).,;:]+$/, "");
        if (!localSupportExists(dir, localPath)) {
          findings.push({
            file: rel,
            line: index + 1,
            type: "missing local support path",
            text: line.trim(),
          });
        }
      }
    });
  }
}

if (findings.length > 0) {
  console.error(`Portability audit failed: ${findings.length} non-portable references found.\n`);
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} [${finding.type}] ${finding.text}`);
  }
  process.exit(1);
}

console.log("Portability audit passed: all installable skills are self-contained.");
