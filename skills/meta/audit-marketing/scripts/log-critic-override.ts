#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root.
// log-critic-override — append a dated entry to docs/forsvn/artifacts/meta/records/critic-overrides.md
// when the operator overrides a critic FAIL. Format per references/quality-feedback-protocol.md § Critic Override Log.
//
// Usage:
//   bun scripts/eval/log-critic-override.ts \
//     --skill evaluate-landing-page \
//     --dimension "claim substantiation" \
//     --artifact .forsvn/loops/lp-demo/evals/2026-05-19-cycle-1.md \
//     --critic-verdict fail \
//     --operator-decision ship \
//     --reason "Claim is qualitative observation, not a quantified claim; critic mis-applied dimension." \
//     --follow-up "revise rubric"
//
// Optional:
//   --date YYYY-MM-DD   Defaults to today.
//   --root <path>       Project root, defaults to cwd.

import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, appendFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

type CriticVerdict = "fail" | "pass-with-concerns";
type OperatorDecision = "ship" | "revise" | "ignore";
type FollowUp = "none" | "watch metric" | "revise rubric" | "extract shared rubric";

const CRITIC_VERDICTS = new Set<CriticVerdict>(["fail", "pass-with-concerns"]);
const OPERATOR_DECISIONS = new Set<OperatorDecision>(["ship", "revise", "ignore"]);
const FOLLOW_UPS = new Set<FollowUp>(["none", "watch metric", "revise rubric", "extract shared rubric"]);

const OVERRIDES_RELPATH = "docs/forsvn/artifacts/meta/records/critic-overrides.md";
const FILE_HEADER = `# Critic Override Log

Append-only record of operator decisions to ship despite a critic FAIL or pass-with-concerns verdict. Format owned by \`references/quality-feedback-protocol.md § Critic Override Log\`. Three valid overrides on the same skill:dimension pair signal the rubric needs revision — see \`references/quality-dashboard-spec.md\` for the rubric-action ladder.

`;

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) usage(0);
const opts = parseArgs(args);

const root = realpathSync(resolve(opts.root ?? process.cwd()));
const today = opts.date ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) fail(`Invalid --date ${JSON.stringify(today)}. Expected YYYY-MM-DD.`);

const skill = required(opts.skill, "--skill");
if (!/^[a-z][a-z0-9-]{0,79}$/.test(skill)) fail(`--skill must be kebab-case (got ${JSON.stringify(skill)}).`);
const dimension = required(opts.dimension, "--dimension");
const artifact = required(opts.artifact, "--artifact");
const criticVerdict = required(opts["critic-verdict"], "--critic-verdict") as CriticVerdict;
const operatorDecision = required(opts["operator-decision"], "--operator-decision") as OperatorDecision;
const reason = required(opts.reason, "--reason");
const followUp = required(opts["follow-up"], "--follow-up") as FollowUp;

if (!CRITIC_VERDICTS.has(criticVerdict)) fail(`--critic-verdict must be one of: ${[...CRITIC_VERDICTS].join(", ")}`);
if (!OPERATOR_DECISIONS.has(operatorDecision)) fail(`--operator-decision must be one of: ${[...OPERATOR_DECISIONS].join(", ")}`);
if (!FOLLOW_UPS.has(followUp)) fail(`--follow-up must be one of: ${[...FOLLOW_UPS].join(", ")}`);
for (const [name, v] of Object.entries({ dimension, artifact, reason })) {
  if (v.includes("\n") || v.includes("\r")) fail(`${name} must not contain newlines.`);
}
if (artifact.startsWith("/") || artifact.split("/").includes("..")) {
  fail("--artifact must be a safe project-relative path.");
}

const overridesPath = join(root, OVERRIDES_RELPATH);
const overridesDir = dirname(overridesPath);
ensureSafeDirectory(overridesDir, dirname(OVERRIDES_RELPATH));

if (!existsSync(overridesPath)) {
  writeFileSync(overridesPath, FILE_HEADER);
} else if (lstatSync(overridesPath).isSymbolicLink()) {
  fail(`Refusing to write through symlinked override log: ${OVERRIDES_RELPATH}`);
}

const block = [
  `## ${today} - ${skill} - ${dimension}`,
  ``,
  `Artifact: ${artifact}`,
  `Critic verdict: ${criticVerdict}`,
  `Operator decision: ${operatorDecision}`,
  `Reason: ${reason}`,
  `Follow-up: ${followUp}`,
  ``,
].join("\n");

const existing = readFileSync(overridesPath, "utf8");
if (existing.includes(block)) {
  console.log(`log-critic-override: duplicate suppressed (${skill}:${dimension} on ${today})`);
  process.exit(0);
}

const sep = existing.endsWith("\n\n") ? "" : existing.endsWith("\n") ? "\n" : "\n\n";
appendFileSync(overridesPath, `${sep}${block}`);
console.log(`log-critic-override: appended ${skill}:${dimension} → ${relative(root, overridesPath)}`);

function ensureSafeDirectory(path: string, label: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
    return;
  }
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) fail(`Refusing to use symlinked directory: ${label}`);
  if (!stat.isDirectory()) fail(`Expected directory: ${label}`);
}

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
    `Usage: log-critic-override.ts --skill <kebab> --dimension <text> --artifact <project-relative-path> --critic-verdict <fail|pass-with-concerns> --operator-decision <ship|revise|ignore> --reason <text> --follow-up <none|watch metric|revise rubric|extract shared rubric> [--date YYYY-MM-DD] [--root path]`,
  );
  process.exit(code);
}
