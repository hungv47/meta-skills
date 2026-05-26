#!/usr/bin/env bun
// migrate-artifacts-flat — one-shot rename pass for the v2 artifact contract.
//
// Walks `.forsvn/artifacts/` for legacy nested-path artifacts and rewrites each
// to the flat v2 grammar:
//
//     .forsvn/artifacts/<stack>-<skill>-<YYYY-MM-DD>-<slug>.md
//
// Behavior:
//   - Default is --dry-run. Pass --apply to mutate disk.
//   - Refuses to run on a dirty working tree (uncommitted/unstaged changes).
//   - Rewrites in-place frontmatter to v2 schema:
//       review_state -> decision_state (enum migrated)
//       inserts stack + review_surface fields when missing
//   - Updates cross-artifact references (upstream/downstream/supersedes/
//     superseded_by) whose values contain a renamed path.
//   - Calls scripts/manifest-sync.ts at the end.
//   - Writes migration-report-YYYY-MM-DD.json next to the report flag.
//
// Usage:
//   bun scripts/migrate-artifacts-flat.ts                # dry-run
//   bun scripts/migrate-artifacts-flat.ts --apply        # apply
//   bun scripts/migrate-artifacts-flat.ts --apply --root /path/to/project

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync, renameSync, rmdirSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildFlatPath, isFlatPath, LEGACY_NESTED_RE } from "./lib/path-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const APPLY = process.argv.includes("--apply");
const ROOT_ARG = (() => {
  const idx = process.argv.indexOf("--root");
  if (idx > -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.cwd();
})();
const ROOT = ROOT_ARG;
const ARTIFACT_DIR = join(ROOT, ".forsvn/artifacts");
const ARCHIVE_PREFIX = ".forsvn/artifacts/.archive/";

const LEGACY_REVIEW_STATE_MAP: Record<string, string> = {
  pending: "pending",
  approved: "approved",
  rejected: "denied",
  changes_requested: "suggested",
  not_required: "not_required",
};

type Plan = { from: string; to: string; skill: string; stack: string; date: string; slug: string };

if (!existsSync(ARTIFACT_DIR)) {
  console.log(`migrate-artifacts-flat: ${relative(ROOT, ARTIFACT_DIR)} does not exist; nothing to migrate.`);
  process.exit(0);
}

if (APPLY) {
  const git = spawnSync("git", ["-C", ROOT, "status", "--porcelain"], { encoding: "utf8" });
  if (git.status !== 0) {
    console.error("git status failed; refusing to apply migration without a clean tree.");
    process.exit(1);
  }
  if (git.stdout.trim().length > 0) {
    console.error("Working tree is not clean. Commit or stash changes before --apply.");
    console.error(git.stdout);
    process.exit(1);
  }
}

const candidates: string[] = [];
walk(ARTIFACT_DIR, candidates);

const plans: Plan[] = [];
const skipped: Array<{ rel: string; reason: string }> = [];

for (const absPath of candidates) {
  const rel = relative(ROOT, absPath).split("\\").join("/");
  if (!rel.endsWith(".md")) continue;
  if (rel.startsWith(ARCHIVE_PREFIX)) {
    skipped.push({ rel, reason: "archive — preserved as-is" });
    continue;
  }
  if (isFlatPath(rel)) {
    skipped.push({ rel, reason: "already flat" });
    continue;
  }
  const legacy = rel.match(LEGACY_NESTED_RE);
  // Fallback: also handle top-level stack-folder files like .forsvn/artifacts/meta/tasks.md
  const topLevel = !legacy ? rel.match(/^\.forsvn\/artifacts\/(?<stack>meta|mkt|product|research)\/(?<file>[^/]+)\.md$/) : null;
  if (!legacy && !topLevel) {
    skipped.push({ rel, reason: "unrecognized path shape" });
    continue;
  }

  const stack = (legacy ?? topLevel)!.groups!.stack as "meta" | "mkt" | "product" | "research";
  const content = readFileSync(absPath, "utf8");
  const fm = parseFrontmatter(content);
  const skill = fm?.skill?.trim();
  if (!skill) {
    skipped.push({ rel, reason: "missing `skill:` frontmatter — cannot derive flat path" });
    continue;
  }

  const date = fm?.date?.trim() ?? deriveDateFromFilename(rel) ?? deriveDateFromMtime(absPath);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    skipped.push({ rel, reason: `unparseable date ${JSON.stringify(date)}` });
    continue;
  }

  // Slug: strip leading YYYY-MM-DD- if present in the filename; lowercase.
  const baseName = basename(rel, ".md");
  const slug = baseName.replace(/^\d{4}-\d{2}-\d{2}-/, "").toLowerCase();

  let newRel: string;
  try {
    newRel = buildFlatPath({ stack, skill, date, slug });
  } catch (err) {
    skipped.push({ rel, reason: `buildFlatPath rejected: ${(err as Error).message}` });
    continue;
  }
  if (newRel === rel) {
    skipped.push({ rel, reason: "new path matches old" });
    continue;
  }
  if (existsSync(join(ROOT, newRel))) {
    skipped.push({ rel, reason: `target already exists: ${newRel}` });
    continue;
  }

  plans.push({ from: rel, to: newRel, skill, stack, date, slug });
}

const renameMap = new Map<string, string>();
for (const p of plans) renameMap.set(p.from, p.to);

// Apply phase: rewrite frontmatter in-place, then git mv, then update refs in
// every artifact that points at a renamed path.
const reportRows: Array<{ from: string; to: string; rewrites: string[] }> = [];
const errors: string[] = [];

for (const plan of plans) {
  const absFrom = join(ROOT, plan.from);
  const absTo = join(ROOT, plan.to);
  const rawContent = readFileSync(absFrom, "utf8");
  const { rewritten, changes } = rewriteFrontmatter(rawContent, plan.stack);

  if (!APPLY) {
    reportRows.push({ from: plan.from, to: plan.to, rewrites: changes });
    continue;
  }

  mkdirSync(dirname(absTo), { recursive: true });
  writeFileSync(absFrom, rewritten);
  const git = spawnSync("git", ["-C", ROOT, "mv", plan.from, plan.to], { encoding: "utf8" });
  if (git.status !== 0) {
    // Fall back to raw filesystem move when the file isn't tracked.
    try {
      renameSync(absFrom, absTo);
    } catch (err) {
      errors.push(`mv ${plan.from} -> ${plan.to} failed: ${(err as Error).message}`);
      continue;
    }
  }
  reportRows.push({ from: plan.from, to: plan.to, rewrites: changes });
}

// Cross-artifact reference update: walk every .md under tracked roots and
// rewrite frontmatter values that contain a renamed path. Use a path-boundary
// regex so we don't partial-match a renamed path that's a prefix of an unrelated
// path (e.g. `a/b.md` should not rewrite inside `a/b.md.bak` or `a/b.md-old`).
if (APPLY && renameMap.size > 0) {
  const allMd = walkAll(ROOT);
  for (const abs of allMd) {
    const text = readFileSync(abs, "utf8");
    let next = text;
    for (const [oldPath, newPath] of renameMap) {
      if (next.includes(oldPath)) {
        next = next.replace(pathBoundaryRe(oldPath), newPath);
      }
    }
    if (next !== text) writeFileSync(abs, next);
  }
  // Cleanup: remove empty legacy subdirectories left behind by the rename.
  rmEmptyDirs(join(ROOT, ".forsvn/artifacts"));
}

// Write migration report.
const reportPath = join(ROOT, `migration-report-${new Date().toISOString().slice(0, 10)}.json`);
const report = {
  generated_at: new Date().toISOString(),
  mode: APPLY ? "apply" : "dry-run",
  root: ROOT,
  planned: reportRows.length,
  skipped,
  errors,
  rows: reportRows,
};
if (APPLY) {
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
}

console.log(`migrate-artifacts-flat (${APPLY ? "APPLY" : "DRY-RUN"})`);
console.log(`  planned renames: ${plans.length}`);
console.log(`  skipped:         ${skipped.length}`);
if (skipped.length > 0) {
  for (const s of skipped) console.log(`    - ${s.rel} :: ${s.reason}`);
}
if (errors.length > 0) {
  for (const e of errors) console.log(`  ERROR: ${e}`);
}
if (plans.length > 0) {
  console.log("\n  Renames:");
  for (const p of plans) console.log(`    ${p.from}\n      -> ${p.to}`);
}
if (APPLY) {
  console.log(`\nReport written to ${relative(ROOT, reportPath)}`);
  const sync = spawnSync("bun", [join(__dirname, "manifest-sync.ts"), ROOT], { encoding: "utf8", stdio: "inherit" });
  if (sync.status !== 0) {
    console.error("manifest-sync failed after migration; manifest may be stale.");
    process.exit(1);
  }
} else {
  console.log("\nDry-run only. Re-run with --apply to mutate.");
}

if (errors.length > 0) process.exit(1);

// ---- helpers ----------------------------------------------------------------

function walk(dir: string, out: string[]): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.isFile()) out.push(p);
  }
}

function walkAll(root: string): string[] {
  const out: string[] = [];
  for (const base of [".forsvn/artifacts", ".forsvn/loops", "research", "brand", "architecture"]) {
    const dir = join(root, base);
    if (existsSync(dir)) walk(dir, out);
  }
  return out.filter((p) => p.endsWith(".md"));
}

function parseFrontmatter(content: string): { skill?: string; date?: string; review_state?: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return {};
  const fm: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    fm[m[1]] = v;
  }
  return fm;
}

function deriveDateFromFilename(rel: string): string | undefined {
  const m = basename(rel).match(/^(\d{4}-\d{2}-\d{2})-/);
  return m?.[1];
}

function deriveDateFromMtime(abs: string): string | undefined {
  try {
    return statSync(abs).mtime.toISOString().slice(0, 10);
  } catch {
    return undefined;
  }
}

function rewriteFrontmatter(content: string, stack: string): { rewritten: string; changes: string[] } {
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/);
  if (!fmMatch) {
    // No frontmatter — inject a minimal block.
    const block = `---\nstack: ${stack}\nreview_surface: md\n---\n\n`;
    return { rewritten: block + content, changes: ["injected minimal frontmatter (stack, review_surface)"] };
  }
  const [, openDelim, body, closeDelim] = fmMatch;
  const lines = body.split(/\r?\n/);
  const changes: string[] = [];
  const present = new Set<string>();
  const out: string[] = [];

  for (const line of lines) {
    const m = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) {
      out.push(line);
      continue;
    }
    const key = m[1];
    const value = m[2].trim();
    present.add(key);

    if (key === "review_state") {
      const stripped = stripQuotes(value);
      const mapped = LEGACY_REVIEW_STATE_MAP[stripped] ?? "not_required";
      out.push(`decision_state: ${mapped}`);
      present.add("decision_state");
      changes.push(`review_state(${stripped}) -> decision_state(${mapped})`);
      continue;
    }
    out.push(line);
  }

  // Inject stack: after status: if missing.
  if (!present.has("stack")) {
    const insertAt = lastIndexMatching(out, /^status\s*:/);
    const insertion = `stack: ${stack}`;
    if (insertAt >= 0) out.splice(insertAt + 1, 0, insertion);
    else out.push(insertion);
    changes.push(`added stack: ${stack}`);
  }
  // Inject review_surface: md if missing.
  if (!present.has("review_surface")) {
    const insertAt = lastIndexMatching(out, /^stack\s*:/);
    const insertion = `review_surface: md`;
    if (insertAt >= 0) out.splice(insertAt + 1, 0, insertion);
    else out.push(insertion);
    changes.push(`added review_surface: md`);
  }

  const rewritten = openDelim + out.join("\n") + closeDelim + content.slice(fmMatch[0].length);
  return { rewritten, changes };
}

function lastIndexMatching(lines: string[], re: RegExp): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (re.test(lines[i])) return i;
  }
  return -1;
}

function stripQuotes(v: string): string {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  return v;
}

/**
 * Build a regex that matches `path` only when it's NOT part of a longer path.
 * Path-continuation characters are letters/digits/`-`/`_`/`.`/`/`. Anything
 * outside that set (quotes, whitespace, comma, paren, end-of-string) is a safe
 * boundary. Lookahead-only — we don't anchor the left side because a renamed
 * path's first character may itself be a path-character.
 */
function pathBoundaryRe(path: string): RegExp {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${escaped}(?![A-Za-z0-9_\\-./])`, "g");
}

/**
 * Recursively rmdir every empty directory under `root`, bottom-up. Files and
 * non-empty directories untouched. The migration leaves empty legacy stack
 * folders (e.g. `.forsvn/artifacts/meta/records/`) after `git mv`; this cleans
 * them so future readers don't mistake the carcass for live state.
 */
function rmEmptyDirs(root: string): void {
  if (!existsSync(root)) return;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === ".archive") continue;
    const sub = join(root, entry.name);
    rmEmptyDirs(sub);
    try {
      if (readdirSync(sub).length === 0) rmdirSync(sub);
    } catch {
      // not empty, or got recreated mid-walk; skip
    }
  }
}
