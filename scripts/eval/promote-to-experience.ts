#!/usr/bin/env bun
// promote-to-experience — promote a loop learning into .forsvn/experience/<domain>.md
// when the Quality Feedback Protocol promotion criteria are met. See
// references/quality-feedback-protocol.md § Learning Promotion To Experience.
//
// Two gating criteria (either is sufficient):
//   A) The loop's results.tsv shows 3 consecutive `keep` rows (default check).
//   B) Operator passes --operator-confirmed when there's a single strong keep
//      finding that the operator explicitly confirms is reusable.
//
// Usage:
//   bun scripts/eval/promote-to-experience.ts <loop-slug> \
//     --domain audience \
//     --dimension-key hero-hook-specificity \
//     --learning "Concrete-noun hooks beat abstract verbs on pricing pages by ~25%." \
//     --applies-when "B2B SaaS pricing hero, US audience" \
//     --do-not-apply-when "Consumer brand, casual register" \
//     --confidence high \
//     --source .forsvn/loops/lp-demo/evals/2026-05-19-cycle-3.md
//
// Optional:
//   --operator-confirmed   Bypass the 3-keep-streak check.
//   --date YYYY-MM-DD       Defaults to today.
//   --root <path>           Project root, defaults to cwd.

import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, appendFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep as pathSep } from "node:path";

type Domain = "audience" | "business" | "product" | "brand" | "goals" | "content" | "patterns";
type Confidence = "high" | "medium";

const DOMAINS = new Set<Domain>(["audience", "business", "product", "brand", "goals", "content", "patterns"]);
const CONFIDENCES = new Set<Confidence>(["high", "medium"]);
const KEEP_STREAK = 3;
const TSV_HEADER = "cycle\tdate\tartifact\tprimary_metric\tvalue\tbaseline\tstatus\tdescription";

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) usage(0);

const loopArg = args[0];
const opts = parseArgs(args.slice(1));

const root = realpathSync(resolve(opts.root ?? process.cwd()));
const today = opts.date ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) fail(`Invalid --date ${JSON.stringify(today)}. Expected YYYY-MM-DD.`);

const domain = required(opts.domain, "--domain") as Domain;
if (!DOMAINS.has(domain)) fail(`--domain must be one of: ${[...DOMAINS].join(", ")}`);

const dimensionKey = required(opts["dimension-key"], "--dimension-key");
if (!/^[a-z][a-z0-9-]{0,79}$/.test(dimensionKey)) fail("--dimension-key must be kebab-case.");
const learning = required(opts.learning, "--learning");
const appliesWhen = required(opts["applies-when"], "--applies-when");
const doNotApplyWhen = required(opts["do-not-apply-when"], "--do-not-apply-when");
const confidence = required(opts.confidence, "--confidence") as Confidence;
if (!CONFIDENCES.has(confidence)) fail(`--confidence must be one of: ${[...CONFIDENCES].join(", ")}`);
const source = required(opts.source, "--source");
if (source.startsWith("/") || source.split("/").includes("..")) fail("--source must be a safe project-relative path.");

for (const [name, v] of Object.entries({ learning, appliesWhen, doNotApplyWhen, source })) {
  if (v.includes("\n") || v.includes("\r")) fail(`${name} must not contain newlines.`);
}

const loopDir = resolveLoopDir(root, loopArg);
const operatorConfirmed = opts["operator-confirmed"] === "true" || Object.prototype.hasOwnProperty.call(opts, "operator-confirmed");

if (!operatorConfirmed) {
  const streak = readKeepStreak(join(loopDir, "results.tsv"));
  if (streak < KEEP_STREAK) {
    fail(
      `Promotion gate failed: loop has ${streak} consecutive \`keep\` row(s), need ${KEEP_STREAK}. ` +
        `Pass --operator-confirmed to override.`,
    );
  }
}

const expPath = join(root, ".forsvn", "experience", `${domain}.md`);
if (!existsSync(expPath)) {
  fail(`Experience file missing: ${relative(root, expPath)}. Initialize it (or pick a different --domain).`);
}
if (lstatSync(expPath).isSymbolicLink()) fail(`Refusing to write through symlinked experience file.`);

const block = [
  `## ${today} - ${dimensionKey}`,
  ``,
  `Source: ${source}`,
  `Confidence: ${confidence}`,
  `Applies when: ${appliesWhen}`,
  `Learning: ${learning}`,
  `Do not apply when: ${doNotApplyWhen}`,
  ``,
].join("\n");

const existing = readFileSync(expPath, "utf8");
if (existing.includes(`## ${today} - ${dimensionKey}`)) {
  console.log(`promote-to-experience: duplicate suppressed (${dimensionKey} on ${today})`);
  process.exit(0);
}
const sep = existing.endsWith("\n\n") ? "" : existing.endsWith("\n") ? "\n" : "\n\n";
appendFileSync(expPath, `${sep}${block}`);
console.log(`promote-to-experience: appended ${dimensionKey} → ${relative(root, expPath)}`);

function readKeepStreak(tsvPath: string): number {
  if (!existsSync(tsvPath)) fail(`Loop is missing results.tsv: ${relative(root, tsvPath)}`);
  if (lstatSync(tsvPath).isSymbolicLink()) fail("Refusing to read symlinked results.tsv.");
  const raw = readFileSync(tsvPath, "utf8").trimEnd();
  const rows = raw ? raw.split("\n") : [];
  if (rows.length === 0 || rows[0] !== TSV_HEADER) {
    fail(`${relative(root, tsvPath)} has invalid header.`);
  }
  let streak = 0;
  for (let i = rows.length - 1; i >= 1; i--) {
    const status = rows[i].split("\t")[6];
    if (status === "keep") streak++;
    else break;
  }
  return streak;
}

function resolveLoopDir(projectRoot: string, value: string): string {
  const slug = value.trim().toLowerCase().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug)) fail(`Loop argument must resolve to a valid slug (got ${JSON.stringify(value)}).`);
  const forsvnDir = resolve(projectRoot, ".forsvn");
  assertSafeDirectory(forsvnDir, ".forsvn");
  const loopRoot = resolve(forsvnDir, "loops");
  assertSafeDirectory(loopRoot, ".forsvn/loops");
  const candidate = resolve(loopRoot, slug);
  if (candidate !== loopRoot && !candidate.startsWith(`${loopRoot}${pathSep}`)) fail("Loop path escaped .forsvn/loops.");
  if (!existsSync(candidate)) fail(`No loop folder for slug ${JSON.stringify(slug)}. Run scaffold-eval-loop first.`);
  if (lstatSync(candidate).isSymbolicLink()) fail("Refusing to use symlinked loop folder.");
  return candidate;
}

function assertSafeDirectory(path: string, label: string): void {
  if (!existsSync(path)) fail(`Missing required directory: ${label}`);
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) fail(`Refusing to use symlinked directory: ${label}`);
  if (!stat.isDirectory()) fail(`Expected directory: ${label}`);
}

function parseArgs(values: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (let i = 0; i < values.length; i++) {
    const key = values[i];
    if (!key.startsWith("--")) fail(`Unexpected argument ${JSON.stringify(key)}`);
    const name = key.slice(2);
    if (name === "operator-confirmed") {
      parsed[name] = "true";
      continue;
    }
    if (i + 1 >= values.length) fail(`Missing value for ${key}`);
    parsed[name] = values[i + 1];
    i++;
  }
  return parsed;
}

function required(value: string | undefined, name: string): string {
  if (value === undefined || value.trim() === "") fail(`Missing ${name}`);
  return value as string;
}

function fail(message: string): never {
  console.error(message);
  usage(1);
}

function usage(code: number): never {
  console.error(
    `Usage: promote-to-experience.ts <loop-slug> --domain <audience|business|product|brand|goals|content|patterns> --dimension-key <kebab> --learning <text> --applies-when <text> --do-not-apply-when <text> --confidence <high|medium> --source <project-relative-path> [--operator-confirmed] [--date YYYY-MM-DD] [--root path]`,
  );
  process.exit(code);
}
