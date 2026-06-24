#!/usr/bin/env bun
// calibrate-critic.ts — the calibrate-before-ship gate for the forsvn-slop LLM critic (FOR-55 / S6).
// OPERATOR TOOL, NOT gate-wired: a real run makes LLM calls (the FIRST committed tool in this repo to do
// so), so its nondeterminism + latency must never touch the pre-merge gate. The DETERMINISTIC gate is
// _dev/test-critic-calibration.ts, which asserts the report this tool pins.
//
// For each tier:'llm' rule, run the critic N=8× per golden fixture, record advise|silent, and compute the
// judge-variance bound (references/critic-calibration.md): a rule is shippable iff margin > 2×variance &&
// margin ≥ 0.5. Writes tests/goldens/critic-llm/calibration-report.json.
//
// Usage:
//   bun forsvn-slop/scripts/calibrate-critic.ts [--rule <id>] [--runs 8] [--temp 1.0] [--out <path>]
//                                               [--at YYYY-MM-DD] [--strict] [--dry-run]
//   --dry-run : DETERMINISTIC codegen — no LLM. Walks the corpus, writes the structural report with every
//               rule shippable:false (variance 0 / margin 0). This is how the SHIPPED report is generated
//               and regenerated after adding fixtures; safe to run in authoring (not verification).
//   --strict  : exit 2 if a rule that was shippable in the existing report is no longer shippable.
//   --at      : ISO date stamped as calibratedAt (the runtime cannot read the clock; pass it in).
//
// The pure math (computeVariance / computeMargin / isShippable / buildReport) is exported and unit-tested
// by _dev/test-critic-calibration.ts with zero LLM calls.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { getRulesForTier } from "../registry/antipatterns.mjs";

const SLOP_ROOT = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const SKILLS_ROOT = dirname(SLOP_ROOT);
const CORPUS = join(SKILLS_ROOT, "tests", "goldens", "critic-llm");
const DEFAULT_OUT = join(CORPUS, "calibration-report.json");
const CRITIC_AGENT = join(SLOP_ROOT, "critic-agent.md");

export const REPORT_SCHEMA = "critic-calibration/v1";

// ─── pure math (exported; the gate test unit-tests these with no LLM) ───────────────────────────────

/** variance = mean over all fixtures of min(p, 1−p). Range [0, 0.5]. Unanimous → 0; coin-flip → 0.5. */
export function computeVariance(perFixtureRates: number[]): number {
  if (perFixtureRates.length === 0) return 0;
  const s = perFixtureRates.reduce((a, p) => a + Math.min(p, 1 - p), 0);
  return s / perFixtureRates.length;
}

/** margin = mean(advise-side rates) − mean(silent-side rates). Range [−1, 1]. Separating power. */
export function computeMargin(adviseRates: number[], silentRates: number[]): number {
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  return mean(adviseRates) - mean(silentRates);
}

/** The ship rule: stable AND separating. */
export function isShippable(margin: number, variance: number): boolean {
  return margin > 2 * variance && margin >= 0.5;
}

export interface RuleReport {
  variance: number;
  margin: number;
  shippable: boolean;
  fixtures: { advise: number; silent: number };
}
export interface CalibrationReport {
  schema: string;
  calibratedAt: string | null;
  runs: number;
  temperature: number;
  rules: Record<string, RuleReport>;
}

/** Assemble the pinned report from per-rule advise-side / silent-side per-fixture rates. */
export function buildReport(
  perRule: Record<string, { adviseRates: number[]; silentRates: number[] }>,
  opts: { runs: number; temperature: number; at: string | null },
): CalibrationReport {
  const rules: Record<string, RuleReport> = {};
  for (const [id, { adviseRates, silentRates }] of Object.entries(perRule)) {
    const variance = computeVariance([...adviseRates, ...silentRates]);
    const margin = computeMargin(adviseRates, silentRates);
    rules[id] = {
      variance: round(variance),
      margin: round(margin),
      shippable: isShippable(round(margin), round(variance)),
      fixtures: { advise: adviseRates.length, silent: silentRates.length },
    };
  }
  return { schema: REPORT_SCHEMA, calibratedAt: opts.at, runs: opts.runs, temperature: opts.temperature, rules };
}

const round = (n: number) => Math.round(n * 1000) / 1000;

// ─── corpus walking ─────────────────────────────────────────────────────────────────────────────────

function fixtureFiles(side: "should-advise" | "should-stay-silent", ruleId: string): string[] {
  const dir = join(CORPUS, side, ruleId);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => join(dir, f)).sort();
}

// ─── LLM seam (OPERATOR-ONLY; untested by CI by design) ────────────────────────────────────────────
// Runs the critic prompt over one fixture once and returns its verdict for `ruleId`. Shells out to the
// `claude` CLI in headless mode (the operator is in Claude Code, so it's on PATH). Swap this one function
// to retarget another agent runtime — nothing else in the tool knows how the verdict is produced.
function runCriticOnce(ruleId: string, ruleQuestion: string, fixtureBody: string): "advise" | "silent" {
  const agent = readFileSync(CRITIC_AGENT, "utf8");
  const prompt = [
    agent,
    "\n\n---\n# This run",
    `Run ONLY this rule: \`${ruleId}\`.`,
    `Question: ${ruleQuestion}`,
    "\n## artifactBody\n", fixtureBody,
    "\n## Deterministic findings (for dedup only)\n[]",
    "\nAfter your read, output your call for THIS rule as the final line, exactly: `VERDICT: advise` or `VERDICT: silent`.",
  ].join("\n");
  const res = spawnSync("claude", ["-p", prompt], { encoding: "utf8", timeout: 120_000 });
  const out = `${res.stdout ?? ""}`;
  const m = out.match(/VERDICT:\s*(advise|silent)/i);
  if (!m) {
    console.error(`  ! no parseable VERDICT for ${ruleId} (treating as silent). claude exit=${res.status}`);
    return "silent";
  }
  return m[1].toLowerCase() as "advise" | "silent";
}

function ruleQuestion(ruleId: string): string {
  // Lift the registry detection string (the question is verbatim-from-detection); good enough to steer one run.
  const r = getRulesForTier("llm").find((x: any) => x.id === ruleId) as any;
  return r?.detection ?? "";
}

// ─── main ───────────────────────────────────────────────────────────────────────────────────────────

function parseArgs() {
  const a = process.argv.slice(2);
  const get = (flag: string) => { const i = a.indexOf(flag); return i > -1 ? a[i + 1] : undefined; };
  return {
    rule: get("--rule"),
    runs: Number(get("--runs") ?? 8),
    temp: Number(get("--temp") ?? 1.0),
    out: get("--out") ?? DEFAULT_OUT,
    at: get("--at") ?? null,
    strict: a.includes("--strict"),
    dryRun: a.includes("--dry-run"),
  };
}

function main() {
  const args = parseArgs();
  const llmRules = getRulesForTier("llm").map((r: any) => r.id);
  const targets = args.rule ? llmRules.filter((id: string) => id === args.rule) : llmRules;
  if (targets.length === 0) { console.error(`No tier:'llm' rule matched ${args.rule ?? ""}`); process.exit(1); }

  const prev: CalibrationReport | null = existsSync(args.out) ? JSON.parse(readFileSync(args.out, "utf8")) : null;
  const perRule: Record<string, { adviseRates: number[]; silentRates: number[] }> = {};

  for (const id of targets) {
    const advise = fixtureFiles("should-advise", id);
    const silent = fixtureFiles("should-stay-silent", id);
    if (args.dryRun) {
      // Deterministic skeleton: count fixtures, no runs → all-zero rates → variance 0 / margin 0 /
      // shippable false, with the real fixture counts. No LLM call.
      perRule[id] = { adviseRates: new Array(advise.length).fill(0), silentRates: new Array(silent.length).fill(0) };
      continue;
    }
    const q = ruleQuestion(id);
    const rate = (files: string[]) => files.map((f) => {
      const body = readFileSync(f, "utf8");
      let advises = 0;
      for (let k = 0; k < args.runs; k++) if (runCriticOnce(id, q, body) === "advise") advises++;
      return advises / args.runs;
    });
    console.error(`calibrating ${id}: ${advise.length} advise + ${silent.length} silent × ${args.runs} runs`);
    perRule[id] = { adviseRates: rate(advise), silentRates: rate(silent) };
  }

  // For dry-run we want shippable:false with real fixture counts; buildReport with all-zero rates yields that.
  const report = buildReport(perRule, { runs: args.dryRun ? 0 : args.runs, temperature: args.temp, at: args.at });

  // --strict: fail if a previously-shippable rule regressed.
  if (args.strict && prev) {
    const regressed = Object.entries(report.rules)
      .filter(([id, r]) => prev.rules[id]?.shippable && !r.shippable)
      .map(([id]) => id);
    if (regressed.length) {
      console.error(`[calibrate-critic] FAIL (--strict) — previously-shippable rules now fail: ${regressed.join(", ")}`);
      process.exit(2);
    }
  }

  writeFileSync(args.out, JSON.stringify(report, null, 2) + "\n");
  const ship = Object.values(report.rules).filter((r) => r.shippable).length;
  console.log(`[calibrate-critic] wrote ${args.out} — ${Object.keys(report.rules).length} rules, ${ship} shippable${args.dryRun ? " (dry-run: structural skeleton, no LLM)" : ""}.`);
}

if (import.meta.main) main();
