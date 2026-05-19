#!/usr/bin/env node
/**
 * Mechanical path rewrite for installable skill portability.
 *
 * Run after `sync-skill-support.mjs`. It rewrites references to generated local
 * support capsules so skill folders do not depend on sibling directories.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const STACKS = ["research-skills", "marketing-skills", "product-skills", "meta-skills"];

const REPLACEMENTS = [
  [/meta-skills\/references\/pre-dispatch-protocol\.md/g, "references/_shared/pre-dispatch-protocol.md"],
  [/meta-skills\/references\/manifest-spec\.md/g, "references/_shared/manifest-spec.md"],
  [/meta-skills\/references\/eval-loop-spec\.md/g, "references/_shared/eval-loop-spec.md"],
  [/meta-skills\/references\/quality-feedback-protocol\.md/g, "references/_shared/quality-feedback-protocol.md"],
  [/meta-skills\/references\/quality-dashboard-spec\.md/g, "references/_shared/quality-dashboard-spec.md"],
  [/meta-skills\/references\/shared-critic-rubrics\.md/g, "references/_shared/shared-critic-rubrics.md"],
  [/\.\.\/\.\.\/\.\.\/meta-skills\/references\/manifest-spec\.md/g, "references/_shared/manifest-spec.md"],
  [/\.\.\/\.\.\/\.\.\/meta-skills\/references\/eval-loop-spec\.md/g, "references/_shared/eval-loop-spec.md"],
  [/\.\.\/\.\.\/\.\.\/references\/_shared\/manifest-spec\.md/g, "references/_shared/manifest-spec.md"],
  [/\.\.\/\.\.\/\.\.\/references\/_shared\/eval-loop-spec\.md/g, "references/_shared/eval-loop-spec.md"],
  [/\.\.\/\.\.\/references\/manifest-spec\.md/g, "references/_shared/manifest-spec.md"],
  [/\.\.\/\.\.\/references\/eval-loop-spec\.md/g, "references/_shared/eval-loop-spec.md"],
  [/\.\.\/\.\.\/references\/quality-feedback-protocol\.md/g, "references/_shared/quality-feedback-protocol.md"],
  [/\.\.\/\.\.\/references\/quality-dashboard-spec\.md/g, "references/_shared/quality-dashboard-spec.md"],
  [/\.\.\/shared\/hypothesis-framework\.md/g, "references/_shared/hypothesis-framework.md"],
  [/\.\.\/\.\.\/shared\/hypothesis-framework\.md/g, "references/_shared/hypothesis-framework.md"],
  [/\.\.\/copywriting\/references\/research-workflow\.md/g, "references/_shared/copywriting-research-workflow.md"],
  [/\$\{SKILLS_ROOT:-\.claude\/skills\}\/meta-skills\/scripts\//g, "scripts/"],
  [/bun meta-skills\/scripts\//g, "bun scripts/"],
  [/meta-skills\/scripts\//g, "scripts/"],
  [/marketing-skills\/skills\/design-brief\/references\/asset-types\.md/g, "references/_shared/design-brief/asset-types.md"],
  [/marketing-skills\/skills\/design-brief\/references\/prompt-patterns\.md/g, "references/_shared/design-brief/prompt-patterns.md"],
  [/marketing-skills\/skills\/design-brief\/references\/failure-modes\.md/g, "references/_shared/design-brief/failure-modes.md"],
  [/marketing-skills\/skills\/brand-system\/references\/\*/g, "references/_shared/brand-system/*"],
  [/marketing-skills\/skills\/short-form-brief\/references\/platform-intelligence\/\[platform\]\.md/g, "references/platform-intelligence/[platform].md"],
  [/marketing-skills\/skills\/short-form-brief\/references\/platform-intelligence\/\{platform\}\.md/g, "references/platform-intelligence/{platform}.md"],
  [/marketing-skills\/skills\/short-form-brief\/references\/platform-intelligence\//g, "references/platform-intelligence/"],
  [/marketing-skills\/skills\/ad-copy\/references\/ad-intelligence\//g, "references/_shared/ad-intelligence/"],
  [/marketing-skills\/skills\/lp-brief\/references\/conversion\//g, "references/conversion/"],
  [/marketing-skills\/skills\/ad-copy\//g, "<skill-root>/"],
  [/marketing-skills\/skills\/cold-outreach\//g, "<skill-root>/"],
  [/marketing-skills\/skills\/copywriting\/agents\/hook-agent\.md/g, "copywriting hook-agent"],
  [/marketing-skills\/skills\/copywriting\/agents\/critic-agent\.md/g, "copywriting critic-agent"],
  [/\$\{SKILLS_ROOT\}\/references\/_shared\//g, "references/_shared/"],
  [/marketing-skills\/skills\/copywriting\/agents\/hook-agent\.md and scored 1–5 in marketing-skills\/skills\/copywriting\/agents\/critic-agent\.md/g, "copywriting's hook-agent and critic-agent rubric"],
  [/marketing-skills\/skills\/copywriting\/agents\/hook-agent\.md and scored 1-5 in marketing-skills\/skills\/copywriting\/agents\/critic-agent\.md/g, "copywriting's hook-agent and critic-agent rubric"],
  [/marketing-skills\/skills\/campaign-plan\/references\/distribution-models\/clipping-and-live\.md/g, "references/_shared/clipping-and-live.md"],
  [/research-skills\/skills\/short-form-research\/agents\/pattern-extractor-agent\.md/g, "references/_shared/clipping-and-live.md"],
  [/see `meta-skills\/CLAUDE\.md` §"Skill-Authoring Patterns"/g, "see this skill's generated support notes"],
  [/see `references\/_shared\/CLAUDE\.md` §"Skill-Authoring Patterns"/g, "see this skill's generated support notes"],
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (entry.isFile() && /\.(md|sh|py|ts|js|mjs)$/.test(entry.name)) out.push(path);
  }
  return out;
}

let changed = 0;
for (const stack of STACKS) {
  for (const file of walk(join(ROOT, stack, "skills"))) {
    let content = readFileSync(file, "utf8");
    const before = content;
    for (const [pattern, replacement] of REPLACEMENTS) {
      content = content.replace(pattern, replacement);
    }
    if (content !== before) {
      writeFileSync(file, content);
      changed++;
    }
  }
}

console.log(`Rewrote ${changed} files for skill portability.`);
