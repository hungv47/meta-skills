#!/usr/bin/env node
/**
 * Generate per-skill support capsules.
 *
 * Canonical shared files stay in their stack-owned locations for maintainers,
 * but installable skills get generated local copies under `references/_shared/`
 * and `scripts/` so `npx skills add <repo> --skill <name>` remains portable.
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const STACKS = ["research-skills", "marketing-skills", "product-skills", "meta-skills"];
const GENERATED_HEADER =
  "<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->\n\n";
const GENERATED_LINE = "GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root.";
const GENERATED_MARKER = ".generated-support";

const SUPPORT_REFS = {
  "pre-dispatch-protocol.md": "meta-skills/references/pre-dispatch-protocol.md",
  "manifest-spec.md": "meta-skills/references/manifest-spec.md",
  "eval-loop-spec.md": "meta-skills/references/eval-loop-spec.md",
  "quality-feedback-protocol.md": "meta-skills/references/quality-feedback-protocol.md",
  "quality-dashboard-spec.md": "meta-skills/references/quality-dashboard-spec.md",
  "shared-critic-rubrics.md": "meta-skills/references/shared-critic-rubrics.md",
  "mode-resolver.md": "meta-skills/references/mode-resolver.md",
  "anti-sycophancy.md": "meta-skills/references/anti-sycophancy.md",
  "artifact-contract-template.md": "meta-skills/references/artifact-contract-template.md",
  "thin-critic-rubric.md": "meta-skills/references/thin-critic-rubric.md",
  "playbook-ref-template.md": "meta-skills/references/playbook-ref-template.md",
  "product-marketing-context-schema.md": "meta-skills/references/product-marketing-context-schema.md",
  "before-starting-check.md": "meta-skills/references/before-starting-check.md",
  "hypothesis-framework.md": "research-skills/shared/hypothesis-framework.md",
  "copywriting-research-workflow.md": "marketing-skills/skills/copywriting/references/research-workflow.md",
  "clipping-and-live.md": "marketing-skills/skills/campaign-plan/references/distribution-models/clipping-and-live.md",
};

const SUPPORT_SCRIPTS = {
  "bootstrap-experience.ts": "meta-skills/scripts/bootstrap-experience.ts",
  "manifest-sync.ts": "meta-skills/scripts/manifest-sync.ts",
  "append-loop-result.ts": "meta-skills/scripts/append-loop-result.ts",
  "scaffold-eval-loop.ts": "meta-skills/scripts/scaffold-eval-loop.ts",
  "update-quality-dashboard.ts": "meta-skills/scripts/update-quality-dashboard.ts",
};

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (entry.isFile()) out.push(path);
  }
  return out;
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

function textCorpus(dir) {
  return walk(dir)
    .filter((path) => /\.(md|sh|py|ts|js|mjs)$/.test(path))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
}

function normalizeSupportContent(content) {
  return content
    .replaceAll("${SKILLS_ROOT:-.claude/skills}/meta-skills/scripts/", "scripts/")
    .replaceAll("meta-skills/scripts/", "scripts/")
    .replaceAll("meta-skills/references/", "references/_shared/")
    .replaceAll("../meta-skills/references/", "references/_shared/")
    .replaceAll("../../references/", "references/_shared/");
}

function generatedContent(srcRel, raw) {
  const ext = extname(srcRel);
  if ([".ts", ".js", ".mjs", ".sh", ".py"].includes(ext)) {
    const comment = ext === ".py" || ext === ".sh" ? `# ${GENERATED_LINE}\n` : `// ${GENERATED_LINE}\n`;
    if (raw.startsWith("#!")) {
      const newline = raw.indexOf("\n");
      if (newline !== -1) return `${raw.slice(0, newline + 1)}${comment}${normalizeSupportContent(raw.slice(newline + 1))}`;
    }
    return `${comment}${normalizeSupportContent(raw)}`;
  }
  return GENERATED_HEADER + normalizeSupportContent(raw);
}

function writeGenerated(srcRel, dest) {
  const raw = readFileSync(join(ROOT, srcRel), "utf8");
  writeFileSync(dest, generatedContent(srcRel, raw));
}

function isGeneratedTree(destDir) {
  if (!existsSync(destDir)) return true;
  if (existsSync(join(destDir, GENERATED_MARKER))) return true;
  const files = walk(destDir);
  if (files.length === 0) return true;
  return false;
}

function copyGeneratedTree(srcRel, destDir) {
  const srcDir = join(ROOT, srcRel);
  if (resolve(srcDir) === resolve(destDir)) return;
  if (!isGeneratedTree(destDir)) {
    throw new Error(`Refusing to overwrite non-generated support directory: ${relative(ROOT, destDir)}`);
  }
  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(destDir, { recursive: true });
  cpSync(srcDir, destDir, { recursive: true });
  for (const file of walk(destDir)) {
    if (!/\.(md|sh|py|ts|js|mjs)$/.test(file)) continue;
    const raw = readFileSync(file, "utf8");
    writeFileSync(file, generatedContent(relative(ROOT, file), raw));
  }
  writeFileSync(join(destDir, GENERATED_MARKER), `${GENERATED_LINE}\nsource: ${srcRel}\n`);
}

function ensureReference(dir, name) {
  const destDir = join(dir, "references", "_shared");
  mkdirSync(destDir, { recursive: true });
  writeGenerated(SUPPORT_REFS[name], join(destDir, name));
}

function ensureScript(dir, name) {
  const destDir = join(dir, "scripts");
  mkdirSync(destDir, { recursive: true });
  writeGenerated(SUPPORT_SCRIPTS[name], join(destDir, name));
}

function syncSkill(dir) {
  const corpus = textCorpus(dir);

  if (/pre-dispatch-protocol/.test(corpus)) {
    ensureReference(dir, "pre-dispatch-protocol.md");
    ensureScript(dir, "bootstrap-experience.ts");
  }
  if (/manifest-spec|manifest-sync/.test(corpus)) {
    ensureReference(dir, "manifest-spec.md");
    ensureScript(dir, "manifest-sync.ts");
  }
  if (/eval-loop-spec/.test(corpus)) ensureReference(dir, "eval-loop-spec.md");
  if (/quality-feedback-protocol/.test(corpus)) ensureReference(dir, "quality-feedback-protocol.md");
  if (/quality-dashboard-spec/.test(corpus)) ensureReference(dir, "quality-dashboard-spec.md");
  if (/shared-critic-rubrics/.test(corpus)) ensureReference(dir, "shared-critic-rubrics.md");
  if (/mode-resolver/.test(corpus)) ensureReference(dir, "mode-resolver.md");
  if (/anti-sycophancy/.test(corpus)) ensureReference(dir, "anti-sycophancy.md");
  if (/artifact-contract-template/.test(corpus)) ensureReference(dir, "artifact-contract-template.md");
  if (/thin-critic-rubric/.test(corpus)) ensureReference(dir, "thin-critic-rubric.md");
  if (/playbook-ref-template/.test(corpus)) ensureReference(dir, "playbook-ref-template.md");
  if (/product-marketing-context-schema/.test(corpus)) ensureReference(dir, "product-marketing-context-schema.md");
  if (/before-starting-check/.test(corpus)) ensureReference(dir, "before-starting-check.md");
  if (/hypothesis-framework/.test(corpus)) ensureReference(dir, "hypothesis-framework.md");
  if (/copywriting\/references\/research-workflow|copywriting-research-workflow/.test(corpus)) {
    ensureReference(dir, "copywriting-research-workflow.md");
  }
  if (/clipping-and-live|CLIP-DENSITY/.test(corpus)) ensureReference(dir, "clipping-and-live.md");

  if (/append-loop-result/.test(corpus)) ensureScript(dir, "append-loop-result.ts");
  if (/scaffold-eval-loop/.test(corpus)) ensureScript(dir, "scaffold-eval-loop.ts");
  if (/update-quality-dashboard/.test(corpus)) ensureScript(dir, "update-quality-dashboard.ts");

  if (/design-brief\/references|_shared\/design-brief/.test(corpus)) {
    copyGeneratedTree("marketing-skills/skills/design-brief/references", join(dir, "references", "_shared", "design-brief"));
  }
  if (/brand-system\/references|_shared\/brand-system/.test(corpus)) {
    copyGeneratedTree("marketing-skills/skills/brand-system/references", join(dir, "references", "_shared", "brand-system"));
  }
  if (/platform-intelligence/.test(corpus)) {
    const sourceSkillDir = join(ROOT, "marketing-skills", "skills", "short-form-brief");
    if (resolve(dir) !== resolve(sourceSkillDir)) {
      copyGeneratedTree(
        "marketing-skills/skills/short-form-brief/references/platform-intelligence",
        join(dir, "references", "_shared", "platform-intelligence"),
      );
    }
  }
  if (/ad-intelligence/.test(corpus)) {
    copyGeneratedTree(
      "marketing-skills/skills/ad-copy/references/ad-intelligence",
      join(dir, "references", "_shared", "ad-intelligence"),
    );
  }

  return relative(ROOT, dir);
}

const synced = skillDirs().map(syncSkill);
console.log(`Synced support capsules for ${synced.length} skills.`);
for (const dir of synced) console.log(`- ${dir}`);
