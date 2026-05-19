#!/usr/bin/env node
/**
 * Rewrite skill-stack docs and instructions to the current artifact layout.
 *
 * Current layout:
 * - .agents/manifest.json and .agents/artifact-index.md are infrastructure.
 * - skills-resources/experience/ is the cross-skill Q&A substrate.
 * - .agents/skill-artifacts/ holds one-shot skill outputs.
 * - skills-resources/loops/ holds measurable initiative workspaces.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const TARGETS = [
  "README.md",
  "RELEASING.md",
  "research-skills",
  "marketing-skills",
  "product-skills",
  "meta-skills",
];

function walk(path, out = []) {
  const entries = readdirSync(path, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const next = join(path, entry.name);
    if (entry.isDirectory()) walk(next, out);
    else if (entry.isFile() && /\.(md|mjs|ts|json)$/.test(entry.name)) out.push(next);
  }
  return out;
}

function files() {
  const out = [];
  for (const target of TARGETS) {
    const path = join(ROOT, target);
    if (target.includes(".")) out.push(path);
    else walk(path, out);
  }
  return out;
}

function rewrite(content) {
  let out = content;

  out = out
    .replace(/skills-resources\/(marketing|product|research)\/loops\//g, "skills-resources/loops/")
    .replace(/skills-resources\/\{marketing\|product\|research\}\/loops/g, "skills-resources/loops")
    .replace(/skills-resources\/\{marketing,product,research\}\/loops/g, "skills-resources/loops")
    .replace(/skills-resources\/\{marketing\|product\|research\}\/loops\/\[slug\]/g, "skills-resources/loops/[slug]")
    .replace(/skills-resources\/experience/g, "skills-resources/experience")
    .replace(/skills-resources\/manifest\.json/g, ".agents/manifest.json")
    .replace(/skills-resources\/artifact-index\.md/g, ".agents/artifact-index.md")
    .replace(/skills-resources\/\.archive/g, ".agents/skill-artifacts/.archive")
    .replace(/skills-resources\/meta\//g, ".agents/skill-artifacts/meta/")
    .replace(/skills-resources\/marketing\//g, ".agents/skill-artifacts/mkt/")
    .replace(/skills-resources\/product\//g, ".agents/skill-artifacts/product/")
    .replace(/skills-resources\/research\//g, ".agents/skill-artifacts/research/")
    .replace(/skills-resources\/(?!loops\b)/g, ".agents/skill-artifacts/")
    .replace(/`skills-resources\/`/g, "`.agents/skill-artifacts/`")
    .replace(/\bskills-resources\/\b/g, ".agents/skill-artifacts/")
    .replace(/\bskills-resources\b(?!\/loops)/g, ".agents/skill-artifacts");

  out = out
    .replace(/\.agents\/skill-artifacts\/loops/g, "skills-resources/loops")
    .replace(/\.agents\/skill-artifacts\/\{marketing\|product\|research\}\/loops/g, "skills-resources/loops")
    .replace(/\.agents\/skill-artifacts\/\{marketing,product,research\}\/loops/g, "skills-resources/loops");

  return out;
}

let changed = 0;
for (const file of files()) {
  const rel = relative(ROOT, file).split("\\").join("/");
  if (/^meta-skills\/scripts\//.test(rel)) continue;
  if (/\/skills\/[^/]+\/scripts\//.test(rel)) continue;
  const before = readFileSync(file, "utf8");
  const after = rewrite(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}

console.log(`rewrite-artifact-layout: updated ${changed} files.`);
