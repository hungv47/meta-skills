#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root.
// bootstrap-experience — create the local docs/forsvn/experience substrate.
// See references/_shared/pre-dispatch-protocol.md.

import { existsSync, lstatSync, mkdirSync, writeFileSync, realpathSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const root = realpathSync(resolve(args[0] ?? process.cwd()));
// The experience layer relocated out of .forsvn/ into docs/forsvn/ (artifact-home
// relocation, Phase A) — the same knowledge home append-experience.ts writes to.
// Stage docs/ → docs/forsvn so each level gets the symlink guard below
// (ensureSafeDirectory's mkdirSync is non-recursive on purpose).
const docsDir = join(root, "docs");
const knowledgeHome = join(docsDir, "forsvn");
const experienceDir = join(knowledgeHome, "experience");
const starterDomains = ["audience", "brand", "business", "content", "goals", "patterns", "product", "technical"];

ensureSafeDirectory(docsDir);
ensureSafeDirectory(knowledgeHome);
ensureSafeDirectory(experienceDir);

writeIfMissing(
  join(experienceDir, "README.md"),
  `# Experience Layer

This folder is the local, append-only memory substrate for skills.

Skills read \`docs/forsvn/experience/{domain}.md\` before asking cold-start questions, then append the answers they receive so future runs do not re-ask the same durable context.

Suggested domains:

- \`audience.md\` — personas, objections, language, habitats
- \`brand.md\` — voice notes, trust patterns, taboos
- \`business.md\` — pricing, funnel, revenue model, constraints
- \`content.md\` — messaging, channel, topic, and creative learnings
- \`goals.md\` — active metrics, campaign goals, success definitions
- \`patterns.md\` — reusable cross-run patterns promoted from eval loops
- \`product.md\` — mechanism, proof, claims, feature boundaries
- \`technical.md\` — platforms, stack, deployment, codebase conventions

Append format:

\`\`\`markdown
## Audience — primary persona
**Asked by:** campaign-plan · 2026-05-15
**Q:** Who is the primary buyer?
**A:** Engineering managers at mid-size SaaS companies.
\`\`\`

Most recent entry per heading wins. Keep history for audit.
`,
);

for (const domain of starterDomains) {
  writeIfMissing(join(experienceDir, `${domain}.md`), `# ${title(domain)} Experience\n\n`);
}

console.log(`bootstrap-experience: ${relative(root, experienceDir)}`);

function writeIfMissing(path: string, content: string): void {
  if (existsSync(path)) {
    if (lstatSync(path).isSymbolicLink()) {
      console.error(`Refusing to write through symlink: ${relative(root, path)}`);
      process.exit(1);
    }
    return;
  }
  try {
    // O_EXCL ("wx"): create-or-fail atomically. Closes the TOCTOU between the
    // existsSync check above and the write, and never follows a symlink planted
    // in that gap (O_EXCL refuses an existing path, symlink included).
    writeFileSync(path, content, { flag: "wx" });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "EEXIST") return; // raced — leave what's there
    throw err;
  }
}

function ensureSafeDirectory(path: string): void {
  if (!existsSync(path)) mkdirSync(path);
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) {
    console.error(`Refusing to use symlinked directory: ${relative(root, path)}`);
    process.exit(1);
  }
  if (!stat.isDirectory()) {
    console.error(`Expected directory: ${relative(root, path)}`);
    process.exit(1);
  }
}

function title(value: string): string {
  return value[0].toUpperCase() + value.slice(1);
}
