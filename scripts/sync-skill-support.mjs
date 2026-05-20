#!/usr/bin/env node
/**
 * Generate per-skill support capsules (references/_shared/ + scripts/).
 *
 * Canonical shared files live in their stack-owned locations for maintainers;
 * every skill that cites a shared file gets a generated local copy under
 * `references/_shared/` (and `scripts/`) so skill folders stay self-contained.
 *
 * Usage:
 *   node scripts/sync-skill-support.mjs            regenerate all mirrors
 *   node scripts/sync-skill-support.mjs --check    verify mirrors are in sync;
 *                                                  exits 1 + a drift list on fail
 *
 * Rebuilt 2026-05-20 (roadmap D22) for the 2.0 single-repo layout. The pre-2.0
 * four-plugin STACKS constant ("research-skills" etc.) walked directories the
 * consolidation deleted, so this script crashed on startup for months.
 *
 * Mirror dir names are stable across the 2.0 skill renames: `_shared/design-brief/`
 * is sourced from `brief-graphic`, `_shared/brand-system/` from `create-brand`,
 * `_shared/ad-intelligence/` from `write-ad`. The source path tracks each rename;
 * the dest label stays put so existing `_shared/...` citations remain valid.
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
import { dirname, extname, join, relative, resolve } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const CHECK = process.argv.includes("--check");
const STACKS = ["meta", "research", "marketing", "product"];
const GENERATED_HEADER =
  "<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->\n\n";
const GENERATED_LINE =
  "GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root.";
const GENERATED_MARKER = ".generated-support";

// Single-file shared references. name -> canonical source path (repo-relative).
const SUPPORT_REFS = {
  "pre-dispatch-protocol.md": "references/pre-dispatch-protocol.md",
  "manifest-spec.md": "references/manifest-spec.md",
  "eval-loop-spec.md": "references/eval-loop-spec.md",
  "quality-feedback-protocol.md": "references/quality-feedback-protocol.md",
  "quality-dashboard-spec.md": "references/quality-dashboard-spec.md",
  "shared-critic-rubrics.md": "references/shared-critic-rubrics.md",
  "mode-resolver.md": "references/mode-resolver.md",
  "anti-sycophancy.md": "references/anti-sycophancy.md",
  "artifact-contract-template.md": "references/artifact-contract-template.md",
  "thin-critic-rubric.md": "references/thin-critic-rubric.md",
  "playbook-ref-template.md": "references/playbook-ref-template.md",
  "product-marketing-context-schema.md": "references/product-marketing-context-schema.md",
  "before-starting-check.md": "references/before-starting-check.md",
  "hypothesis-framework.md": "skills/research/_shared/hypothesis-framework.md",
  "copywriting-research-workflow.md": "skills/marketing/write-copy/references/research-workflow.md",
  "clipping-and-live.md": "skills/marketing/plan-campaign/references/distribution-models/clipping-and-live.md",
};

// Single-file shared scripts. name -> canonical source path (repo-relative).
const SUPPORT_SCRIPTS = {
  "bootstrap-experience.ts": "scripts/bootstrap-experience.ts",
  "manifest-sync.ts": "scripts/manifest-sync.ts",
  "append-loop-result.ts": "scripts/append-loop-result.ts",
  "scaffold-eval-loop.ts": "scripts/scaffold-eval-loop.ts",
  "update-quality-dashboard.ts": "scripts/update-quality-dashboard.ts",
};

// Whole-directory mirrors. dest label under references/_shared/ -> source dir.
// Dest label is intentionally stable across the 2.0 renames (see file header).
const SUPPORT_TREES = {
  "design-brief": "skills/marketing/brief-graphic/references",
  "brand-system": "skills/marketing/create-brand/references",
  "ad-intelligence": "skills/marketing/write-ad/references/ad-intelligence",
  "platform-intelligence": "references/platform-intelligence",
};

// Out-of-sync support files found in --check mode.
const drift = [];

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
    const skillsRoot = join(ROOT, "skills", stack);
    if (!existsSync(skillsRoot)) continue;
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
    // Trigger on the skill's own authored content only — skip generated support
    // capsules (references/_shared/ + scripts/). If a generated mirror's internal
    // cross-references counted, generation would cascade and never reach a
    // fixpoint: a mirror that mentions another shared file would pull it in too.
    .filter((path) => !path.includes("/references/_shared/") && !path.includes("/scripts/"))
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

// Write in sync mode; compare and record drift in --check mode.
function emit(destAbs, content) {
  const rel = relative(ROOT, destAbs);
  if (CHECK) {
    if (!existsSync(destAbs)) drift.push(`missing  ${rel}`);
    else if (readFileSync(destAbs, "utf8") !== content) drift.push(`drift    ${rel}`);
    return;
  }
  mkdirSync(dirname(destAbs), { recursive: true });
  writeFileSync(destAbs, content);
}

function writeGenerated(srcRel, destAbs) {
  emit(destAbs, generatedContent(srcRel, readFileSync(join(ROOT, srcRel), "utf8")));
}

function ensureReference(dir, name) {
  writeGenerated(SUPPORT_REFS[name], join(dir, "references", "_shared", name));
}

function ensureScript(dir, name) {
  writeGenerated(SUPPORT_SCRIPTS[name], join(dir, "scripts", name));
}

function isGeneratedTree(destDir) {
  if (!existsSync(destDir)) return true;
  if (existsSync(join(destDir, GENERATED_MARKER))) return true;
  return walk(destDir).length === 0;
}

// Files a tree mirror should contain: the source dir wholesale, minus any
// _shared/ subtree. A source skill's own _shared/ is itself generated — copying
// it would make the mirror order-dependent (a mirror-of-a-mirror that is only
// correct if the source skill synced first) and nothing cites the nested files.
function treeSourceFiles(srcDir) {
  return walk(srcDir).filter((abs) => !abs.includes("/_shared/"));
}

function checkTree(srcRel, srcDir, destDir) {
  const destRel = relative(ROOT, destDir);
  if (!existsSync(destDir)) {
    drift.push(`missing  ${destRel}/ (whole tree)`);
    return;
  }
  const expected = new Set();
  for (const abs of treeSourceFiles(srcDir)) {
    const rel = relative(srcDir, abs);
    expected.add(rel);
    const destFile = join(destDir, rel);
    if (!existsSync(destFile)) {
      drift.push(`missing  ${join(destRel, rel)}`);
      continue;
    }
    if (/\.(md|sh|py|ts|js|mjs)$/.test(abs)) {
      const want = generatedContent(relative(ROOT, destFile), readFileSync(abs, "utf8"));
      if (readFileSync(destFile, "utf8") !== want) drift.push(`drift    ${join(destRel, rel)}`);
    } else if (!readFileSync(destFile).equals(readFileSync(abs))) {
      drift.push(`drift    ${join(destRel, rel)}`);
    }
  }
  const markerWant = `${GENERATED_LINE}\nsource: ${srcRel}\n`;
  const markerFile = join(destDir, GENERATED_MARKER);
  if (!existsSync(markerFile)) drift.push(`missing  ${join(destRel, GENERATED_MARKER)}`);
  else if (readFileSync(markerFile, "utf8") !== markerWant) drift.push(`drift    ${join(destRel, GENERATED_MARKER)}`);
  for (const abs of walk(destDir)) {
    const rel = relative(destDir, abs);
    if (rel !== GENERATED_MARKER && !expected.has(rel)) drift.push(`extra    ${join(destRel, rel)}`);
  }
}

function copyGeneratedTree(srcRel, destDir) {
  const srcDir = join(ROOT, srcRel);
  if (resolve(srcDir) === resolve(destDir)) return;

  if (CHECK) {
    checkTree(srcRel, srcDir, destDir);
    return;
  }
  if (!isGeneratedTree(destDir)) {
    throw new Error(`Refusing to overwrite non-generated support directory: ${relative(ROOT, destDir)}`);
  }
  rmSync(destDir, { recursive: true, force: true });
  mkdirSync(destDir, { recursive: true });
  for (const abs of treeSourceFiles(srcDir)) {
    const dest = join(destDir, relative(srcDir, abs));
    mkdirSync(dirname(dest), { recursive: true });
    if (/\.(md|sh|py|ts|js|mjs)$/.test(abs)) {
      writeFileSync(dest, generatedContent(relative(ROOT, dest), readFileSync(abs, "utf8")));
    } else {
      cpSync(abs, dest);
    }
  }
  writeFileSync(join(destDir, GENERATED_MARKER), `${GENERATED_LINE}\nsource: ${srcRel}\n`);
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

  if (/_shared\/design-brief|design-brief\/references/.test(corpus)) {
    copyGeneratedTree(SUPPORT_TREES["design-brief"], join(dir, "references", "_shared", "design-brief"));
  }
  if (/_shared\/brand-system|brand-system\/references/.test(corpus)) {
    copyGeneratedTree(SUPPORT_TREES["brand-system"], join(dir, "references", "_shared", "brand-system"));
  }
  if (/platform-intelligence/.test(corpus)) {
    copyGeneratedTree(SUPPORT_TREES["platform-intelligence"], join(dir, "references", "_shared", "platform-intelligence"));
  }
  if (/ad-intelligence/.test(corpus)) {
    copyGeneratedTree(SUPPORT_TREES["ad-intelligence"], join(dir, "references", "_shared", "ad-intelligence"));
  }

  return relative(ROOT, dir);
}

const synced = skillDirs().map(syncSkill);

if (CHECK) {
  if (drift.length > 0) {
    console.error(`sync-skill-support --check FAILED: ${drift.length} out-of-sync support file(s).\n`);
    for (const entry of drift) console.error(`  ${entry}`);
    console.error(`\nRun \`node scripts/sync-skill-support.mjs\` to regenerate, then commit the result.`);
    process.exit(1);
  }
  console.log(`sync-skill-support --check passed: support capsules in sync across ${synced.length} skills.`);
} else {
  console.log(`Synced support capsules for ${synced.length} skills.`);
  for (const dir of synced) console.log(`- ${dir}`);
}
