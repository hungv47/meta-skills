#!/usr/bin/env bun
// append-loop-result — validate and append one row to a loop results.tsv.
// See meta-skills/references/eval-loop-spec.md for the ledger contract.
//
// Usage:
//   bun append-loop-result.ts <loop-slug> \
//     --artifact evals/2026-05-13-cycle-1.md \
//     --metric conversion_rate \
//     --value 3.4% \
//     --baseline 2.9% \
//     --status keep \
//     --description "Sharper hero offer improved trial starts"
//
// Optional:
//   --cycle N        Defaults to next cycle after the max existing row.
//   --date YYYY-MM-DD Defaults to today.
//   --root <path>   Project root when not running from the project root.

import { existsSync, readFileSync, appendFileSync, lstatSync, realpathSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

type Status = "keep" | "discard" | "watch" | "blocked";

const HEADER = "cycle\tdate\tartifact\tprimary_metric\tvalue\tbaseline\tstatus\tdescription";
const STATUSES = new Set<Status>(["keep", "discard", "watch", "blocked"]);

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  usage(0);
}

const loopArg = args[0];
const opts = parseArgs(args.slice(1));
const root = realpathSync(resolve(opts.root ?? process.cwd()));
const today = new Date().toISOString().slice(0, 10);

const artifact = required(opts.artifact, "--artifact");
const metric = required(opts.metric, "--metric");
const value = required(opts.value, "--value");
const baseline = required(opts.baseline, "--baseline");
const status = required(opts.status, "--status") as Status;
const description = required(opts.description, "--description");
const date = opts.date ?? today;
const requestedDomain = opts.domain;

if (!STATUSES.has(status)) {
  fail(`Invalid --status ${JSON.stringify(status)}. Expected one of: ${[...STATUSES].join(", ")}`);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  fail(`Invalid --date ${JSON.stringify(date)}. Expected YYYY-MM-DD.`);
}
if (requestedDomain && !["marketing", "product", "research"].includes(requestedDomain)) {
  fail(`Invalid --domain ${JSON.stringify(requestedDomain)}. Expected one of: marketing, product, research`);
}
if (artifact.startsWith("/") || artifact.split("/").includes("..")) {
  fail("--artifact must be a safe path relative to the loop folder.");
}

const fields = { artifact, metric, value, baseline, status, description };
for (const [name, v] of Object.entries(fields)) {
  if (v.includes("\t") || v.includes("\n") || v.includes("\r")) {
    fail(`${name} must not contain tabs or newlines.`);
  }
}

const loopDir = resolveLoopDir(root, loopArg, requestedDomain);
const resultsPath = join(loopDir, "results.tsv");
for (const requiredFile of ["program.md", "context.md", "results.tsv"]) {
  const requiredPath = join(loopDir, requiredFile);
  if (!existsSync(requiredPath)) {
    fail(`Loop workspace is missing ${requiredFile}: ${relative(root, loopDir)}`);
  }
  if (lstatSync(requiredPath).isSymbolicLink()) {
    fail(`Refusing to use symlinked loop file: ${relative(root, requiredPath)}`);
  }
}
const artifactPath = join(loopDir, artifact);
if (!existsSync(artifactPath)) {
  fail(`Artifact does not exist inside loop: ${artifact}`);
}
if (lstatSync(artifactPath).isSymbolicLink()) {
  fail(`Refusing to reference symlinked artifact inside loop: ${artifact}`);
}
const realLoopDir = realpathSync(loopDir);
const realArtifactPath = realpathSync(artifactPath);
if (realArtifactPath !== realLoopDir && !realArtifactPath.startsWith(`${realLoopDir}${sep}`)) {
  fail(`Artifact resolves outside the loop folder: ${artifact}`);
}

const raw = readFileSync(resultsPath, "utf8").trimEnd();
const rows = raw ? raw.split("\n") : [];
if (rows.length === 0 || rows[0] !== HEADER) {
  fail(`${relative(root, resultsPath)} has invalid header. Expected:\n${HEADER}`);
}

const existingCycles = rows.slice(1).map((row) => Number(row.split("\t")[0])).filter(Number.isFinite);
const cycle = opts.cycle ? Number(opts.cycle) : (existingCycles.length ? Math.max(...existingCycles) + 1 : 1);
if (!Number.isInteger(cycle) || cycle < 1) {
  fail(`Invalid --cycle ${JSON.stringify(opts.cycle)}. Expected positive integer.`);
}
if (existingCycles.includes(cycle)) {
  fail(`Cycle ${cycle} already exists in ${relative(root, resultsPath)}.`);
}

const row = [String(cycle), date, artifact, metric, value, baseline, status, description].join("\t");
appendFileSync(resultsPath, `${row}\n`);
console.log(`append-loop-result: ${relative(root, resultsPath)} cycle ${cycle} ${status}`);

function parseArgs(values: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (let i = 0; i < values.length; i++) {
    const key = values[i];
    if (!key.startsWith("--")) fail(`Unexpected argument ${JSON.stringify(key)}`);
    if (i + 1 >= values.length) fail(`Missing value for ${key}`);
    parsed[key.slice(2)] = values[i + 1];
    i++;
  }
  return parsed;
}

function slugifyLoopName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function resolveLoopDir(projectRoot: string, value: string, requestedDomain?: string): string {
  const slug = slugifyLoopName(value);
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug)) {
    fail(`Loop argument must resolve to a valid slug (got ${JSON.stringify(value)}).`);
  }
  const skillsResources = resolve(projectRoot, "skills-resources");
  assertSafeDirectory(skillsResources, "skills-resources");
  const realSkillsResources = realpathSync(skillsResources);
  const domainsToSearch = requestedDomain ? [requestedDomain] : ["marketing", "product", "research"];
  const matches: Array<{ domain: string; path: string }> = [];
  for (const domain of domainsToSearch) {
    const domainRoot = resolve(skillsResources, domain);
    if (!existsSync(domainRoot)) continue;
    assertSafeDirectory(domainRoot, `skills-resources/${domain}`);
    const candidate = resolve(skillsResources, domain, "loops", slug);
    const domainLoopsRoot = resolve(skillsResources, domain, "loops");
    if (!existsSync(domainLoopsRoot)) continue;
    assertSafeDirectory(domainLoopsRoot, `skills-resources/${domain}/loops`);
    const realDomainLoopsRoot = realpathSync(domainLoopsRoot);
    if (realDomainLoopsRoot !== realSkillsResources && !realDomainLoopsRoot.startsWith(`${realSkillsResources}${sep}`)) {
      fail(`Loop root escapes skills-resources: skills-resources/${domain}/loops`);
    }
    if (candidate !== domainLoopsRoot && !candidate.startsWith(`${domainLoopsRoot}${sep}`)) {
      fail("Loop path escaped skills-resources/<domain>/loops.");
    }
    if (existsSync(candidate)) {
      if (lstatSync(candidate).isSymbolicLink()) {
        fail(`Refusing to use symlinked loop folder: ${relative(projectRoot, candidate)}`);
      }
      const realCandidate = realpathSync(candidate);
      if (realCandidate !== realDomainLoopsRoot && !realCandidate.startsWith(`${realDomainLoopsRoot}${sep}`)) {
        fail(`Loop folder escapes skills-resources/<domain>/loops: ${relative(projectRoot, candidate)}`);
      }
      matches.push({ domain, path: candidate });
    }
  }
  if (matches.length === 0) {
    const where = requestedDomain ? `skills-resources/${requestedDomain}/loops/` : "skills-resources/{marketing,product,research}/loops/";
    fail(`No loop folder found for slug ${JSON.stringify(slug)} under ${where}. Run scaffold-eval-loop first.`);
  }
  if (matches.length > 1) {
    const domains = matches.map((m) => m.domain).join(", ");
    fail(`Loop slug ${JSON.stringify(slug)} is ambiguous — exists in: ${domains}. Pass --domain <${domains.replace(/, /g, "|")}> to disambiguate.`);
  }
  return matches[0].path;
}

function assertSafeDirectory(path: string, label: string): void {
  if (!existsSync(path)) fail(`Missing required directory: ${label}`);
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) fail(`Refusing to use symlinked directory: ${label}`);
  if (!stat.isDirectory()) fail(`Expected directory: ${label}`);
}

function required(value: string | undefined, name: string): string {
  if (value === undefined) fail(`Missing ${name}`);
  if (value.trim() === "") fail(`${name} must not be empty`);
  return value;
}

function fail(message: string): never {
  console.error(message);
  usage(1);
}

function usage(code: number): never {
  console.error(
    "Usage: append-loop-result.ts <loop-slug> --artifact <evals/file.md> --metric <name> --value <value> --baseline <value> --status <keep|discard|watch|blocked> --description <text> [--cycle N] [--date YYYY-MM-DD] [--domain marketing|product|research] [--root path]",
  );
  process.exit(code);
}
