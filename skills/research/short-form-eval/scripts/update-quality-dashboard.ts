#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root.
// update-quality-dashboard — create or update lightweight quality telemetry.
// See references/_shared/quality-dashboard-spec.md.

import { existsSync, mkdirSync, readFileSync, writeFileSync, lstatSync, realpathSync } from "node:fs";
import { join, resolve } from "node:path";

type QualityRisk = "low" | "medium" | "high";
type RubricAction = "watch" | "revise" | "extract-shared-rubric";

type SkillEntry = {
  invocations: number;
  critic_pass: number;
  critic_fail: number;
  done_with_concerns: number;
  avg_rewrite_cycles: number;
  avg_rubric_score: string;
  dominant_fail_dimension: string;
  last_updated: string;
};

type LoopEntry = {
  latest_cycle: number;
  latest_status: string;
  primary_metric: string;
  latest_value: string;
  quality_risk: QualityRisk;
  next_action: string;
  last_updated: string;
};

type RubricEntry = {
  overrides: number;
  last_review: string;
  action: RubricAction;
};

type Dashboard = {
  schema_version: 1;
  updated: string;
  skills: Record<string, SkillEntry>;
  loops: Record<string, LoopEntry>;
  rubrics: Record<string, RubricEntry>;
};

const args = parseArgs(process.argv.slice(2));
if (args.help || args.h) usage(0);

const root = realpathSync(resolve(args.root ?? process.cwd()));
const today = args.date ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) fail(`Invalid --date ${JSON.stringify(today)}. Expected YYYY-MM-DD.`);

const agentsDir = join(root, ".agents");
const skillArtifactsDir = join(agentsDir, "skill-artifacts");
const metaDir = join(skillArtifactsDir, "meta");
const recordsDir = join(metaDir, "records");
ensureSafeDirectory(agentsDir, ".agents");
ensureSafeDirectory(skillArtifactsDir, ".agents/skill-artifacts");
ensureSafeDirectory(metaDir, ".agents/skill-artifacts/meta");
ensureSafeDirectory(recordsDir, ".agents/skill-artifacts/meta/records");
const dashboardPath = join(recordsDir, "quality-dashboard.json");
const dashboard = readDashboard(dashboardPath, today);

let changed = false;
if (args.skill) {
  updateSkill(dashboard, args.skill, args, today);
  changed = true;
}
if (args.loop) {
  updateLoop(dashboard, args.loop, args, today);
  changed = true;
}
if (args.rubric) {
  updateRubric(dashboard, args.rubric, args, today);
  changed = true;
}
if (!changed) {
  fail("Nothing to update. Pass --skill, --loop, or --rubric.");
}

dashboard.updated = today;
writeFileSync(dashboardPath, `${JSON.stringify(dashboard, null, 2)}\n`);
console.log(`update-quality-dashboard: .agents/skill-artifacts/meta/records/quality-dashboard.json`);

function updateSkill(dashboard: Dashboard, skill: string, values: Record<string, string>, date: string): void {
  const deltaInvocations = intOpt(values.invocations, 0, "--invocations");
  const deltaPass = intOpt(values["critic-pass"], 0, "--critic-pass");
  const deltaFail = intOpt(values["critic-fail"], 0, "--critic-fail");
  const deltaConcerns = intOpt(values["done-with-concerns"], 0, "--done-with-concerns");
  const rewriteCycles = numberOpt(values["rewrite-cycles"], undefined, "--rewrite-cycles");
  const rubricScore = values["rubric-score"];
  const dominantFail = values["dominant-fail-dimension"];

  const existing = dashboard.skills[skill] ?? {
    invocations: 0,
    critic_pass: 0,
    critic_fail: 0,
    done_with_concerns: 0,
    avg_rewrite_cycles: 0,
    avg_rubric_score: "",
    dominant_fail_dimension: "",
    last_updated: date,
  };
  const previousInvocations = existing.invocations;
  existing.invocations += deltaInvocations;
  existing.critic_pass += deltaPass;
  existing.critic_fail += deltaFail;
  existing.done_with_concerns += deltaConcerns;
  if (rewriteCycles !== undefined && deltaInvocations > 0) {
    existing.avg_rewrite_cycles = round(((existing.avg_rewrite_cycles * previousInvocations) + rewriteCycles) / Math.max(1, previousInvocations + deltaInvocations));
  }
  if (rubricScore) existing.avg_rubric_score = mergeRubricScore(existing.avg_rubric_score, rubricScore, previousInvocations, Math.max(1, deltaInvocations));
  if (dominantFail) existing.dominant_fail_dimension = dominantFail;
  existing.last_updated = date;
  dashboard.skills[skill] = existing;
}

function updateLoop(dashboard: Dashboard, loop: string, values: Record<string, string>, date: string): void {
  const risk = (values["quality-risk"] ?? "medium") as QualityRisk;
  if (!["low", "medium", "high"].includes(risk)) fail("--quality-risk must be low, medium, or high.");
  const latestStatus = required(values["latest-status"], "--latest-status");
  if (!["keep", "discard", "watch", "blocked"].includes(latestStatus)) {
    fail("--latest-status must be keep, discard, watch, or blocked.");
  }
  const cycle = intRequired(values["latest-cycle"], "--latest-cycle");
  dashboard.loops[loop] = {
    latest_cycle: cycle,
    latest_status: latestStatus,
    primary_metric: required(values["primary-metric"], "--primary-metric"),
    latest_value: required(values["latest-value"], "--latest-value"),
    quality_risk: risk,
    next_action: values["next-action"] ?? "TBD",
    last_updated: date,
  };
}

function updateRubric(dashboard: Dashboard, rubric: string, values: Record<string, string>, date: string): void {
  const action = (values.action ?? "watch") as RubricAction;
  if (!["watch", "revise", "extract-shared-rubric"].includes(action)) {
    fail("--action must be watch, revise, or extract-shared-rubric.");
  }
  const existing = dashboard.rubrics[rubric] ?? { overrides: 0, last_review: date, action };
  existing.overrides += intOpt(values.overrides, 0, "--overrides");
  existing.last_review = date;
  existing.action = existing.overrides >= 3 && action === "watch" ? "revise" : action;
  dashboard.rubrics[rubric] = existing;
}

function readDashboard(path: string, date: string): Dashboard {
  if (!existsSync(path)) {
    return { schema_version: 1, updated: date, skills: {}, loops: {}, rubrics: {} };
  }
  if (lstatSync(path).isSymbolicLink()) fail("Refusing to write through symlinked quality dashboard.");
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  return {
    schema_version: 1,
    updated: typeof parsed.updated === "string" ? parsed.updated : date,
    skills: parsed.skills && typeof parsed.skills === "object" ? parsed.skills : {},
    loops: parsed.loops && typeof parsed.loops === "object" ? parsed.loops : {},
    rubrics: parsed.rubrics && typeof parsed.rubrics === "object" ? parsed.rubrics : {},
  };
}

function mergeRubricScore(existing: string, next: string, previousN: number, deltaN: number): string {
  const a = parseScore(existing);
  const b = parseScore(next);
  if (!b) return existing || next;
  if (!a || previousN === 0) return next;
  if (a.denom !== b.denom) return next;
  const avg = ((a.value * previousN) + (b.value * deltaN)) / Math.max(1, previousN + deltaN);
  return `${round(avg)}/${a.denom}`;
}

function parseScore(value: string): { value: number; denom: number } | null {
  const match = value.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  return match ? { value: Number(match[1]), denom: Number(match[2]) } : null;
}

function parseArgs(values: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (let i = 0; i < values.length; i++) {
    const key = values[i];
    if (!key.startsWith("--")) fail(`Unexpected argument ${JSON.stringify(key)}`);
    const name = key.slice(2);
    if (name === "help" || name === "h") {
      parsed[name] = "true";
      continue;
    }
    if (i + 1 >= values.length) fail(`Missing value for ${key}`);
    parsed[name] = values[i + 1];
    i++;
  }
  return parsed;
}

function ensureSafeDirectory(path: string, label: string): void {
  if (!existsSync(path)) mkdirSync(path);
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) fail(`Refusing to use symlinked directory: ${label}`);
  if (!stat.isDirectory()) fail(`Expected directory: ${label}`);
}

function required(value: string | undefined, name: string): string {
  if (!value || value.trim() === "") fail(`Missing ${name}`);
  if (value.includes("\n") || value.includes("\r")) fail(`${name} must not contain newlines.`);
  return value;
}

function intRequired(value: string | undefined, name: string): number {
  return intOpt(required(value, name), undefined, name) as number;
}

function intOpt(value: string | undefined, fallback: number | undefined, name: string): number | undefined {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value)) fail(`${name} must be a non-negative integer.`);
  return Number(value);
}

function numberOpt(value: string | undefined, fallback: number | undefined, name: string): number | undefined {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) fail(`${name} must be a non-negative number.`);
  return parsed;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function fail(message: string): never {
  console.error(message);
  usage(1);
}

function usage(code: number): never {
  console.error(`Usage:
  update-quality-dashboard.ts --skill <name> [--invocations N] [--critic-pass N] [--critic-fail N] [--done-with-concerns N] [--rewrite-cycles N] [--rubric-score 52/70] [--dominant-fail-dimension name]
  update-quality-dashboard.ts --loop <slug> --latest-cycle N --latest-status <keep|discard|watch|blocked> --primary-metric <metric> --latest-value <value> [--quality-risk low|medium|high] [--next-action text]
  update-quality-dashboard.ts --rubric <skill:dimension> [--overrides N] [--action watch|revise|extract-shared-rubric]
Options:
  --root <path>   Project root, defaults to cwd.
  --date YYYY-MM-DD`);
  process.exit(code);
}
