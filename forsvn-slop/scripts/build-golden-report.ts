#!/usr/bin/env bun
// build-golden-report.ts — emit the precision report the nightly audit gate trusts (FOR-59 / S10, gate part (c)).
//
// audit-guard.ts gate (c) reads `.forsvn/slop/golden-report.json` and opens ONLY if
// `precision >= precision_floor` AND `falsePositives === 0`. That file had no generator: the
// precision was computed inside the corpus test (forsvn-slop-scan.test.ts) but never written out,
// so the gate could only be satisfied by a hand-authored — i.e. untrustworthy — report. This is the
// missing honest producer: it runs the REAL deterministic scanner over the REAL golden corpus and
// writes the aggregate it measures. Re-run it after the corpus changes; never hand-edit the report.
//
// Method (mirrors the gate test): for every regex|heuristic rule, count true positives over its
// should-flag goldens and false positives over its should-pass goldens; aggregate precision =
// ΣTP/(ΣTP+ΣFP), falsePositives = ΣFP. A block-severity FP is the trust-collapse case, so the test
// already floors block precision at 100%; this report makes the corpus-wide FP count the gate reads.
//
// Usage:
//   bun forsvn-slop/scripts/build-golden-report.ts [--root <path>] [--at YYYY-MM-DD] [--check]
//     --root  : project root whose .forsvn/slop/golden-report.json to write (default: cwd)
//     --at    : ISO date stamped as generatedAt (the runtime cannot read the clock for a committed
//               file; pass it in for a stable diff). Default: today (UTC).
//     --check : do NOT write; exit 2 if the committed report's precision/falsePositives disagree with
//               a fresh corpus run (gate-ready drift guard). exit 0 if they match (or no file yet).

import { readdirSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { scanText } from "../lib/scan-core.mjs";
import { getRulesForTier, getAntipattern } from "../registry/antipatterns.mjs";

const SLOP_ROOT = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const GOLDENS = join(SLOP_ROOT, "tests", "goldens");
const STRICT_RULES = [...getRulesForTier("regex"), ...getRulesForTier("heuristic")].map((r: any) => r.id);

interface RuleStat { severity: string; tp: number; fp: number; precision: number; falsePositiveFiles: string[]; }
export interface GoldenReport {
  schema: string;
  generatedAt: string | null;
  precision: number;       // aggregate ΣTP/(ΣTP+ΣFP) — the gate's precision_floor check
  falsePositives: number;  // corpus-wide ΣFP — the gate requires === 0
  rules: number;
  truePositives: number;
  byRule: Record<string, RuleStat>;
}

const listMd = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => join(dir, f)) : [];

async function firesRule(file: string, rule: string): Promise<boolean> {
  const res = await scanText(readFileSync(file, "utf8"), { file });
  return res.findings.some((f: any) => f.antipattern === rule);
}

export async function buildReport(at: string | null): Promise<GoldenReport> {
  const byRule: Record<string, RuleStat> = {};
  let aggTp = 0, aggFp = 0;
  for (const id of STRICT_RULES) {
    const severity = getAntipattern(id)!.severity;
    let tp = 0, fp = 0;
    const fpFiles: string[] = [];
    for (const f of listMd(join(GOLDENS, "should-flag", id))) if (await firesRule(f, id)) tp++;
    for (const f of listMd(join(GOLDENS, "should-pass", id))) if (await firesRule(f, id)) { fp++; fpFiles.push(f.split("/").pop()!); }
    const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
    byRule[id] = { severity, tp, fp, precision: round3(precision), falsePositiveFiles: fpFiles };
    aggTp += tp; aggFp += fp;
  }
  const precision = aggTp + aggFp === 0 ? 1 : aggTp / (aggTp + aggFp);
  return {
    schema: "slop-golden-report/v1",
    generatedAt: at,
    precision: round3(precision),
    falsePositives: aggFp,
    rules: STRICT_RULES.length,
    truePositives: aggTp,
    byRule,
  };
}

const round3 = (n: number) => Math.round(n * 1000) / 1000;

function parseArgs() {
  const a = process.argv.slice(2);
  const get = (flag: string) => { const i = a.indexOf(flag); return i > -1 ? a[i + 1] : undefined; };
  return { root: get("--root") ?? process.cwd(), at: get("--at") ?? null, check: a.includes("--check") };
}

async function main() {
  const args = parseArgs();
  const at = args.at ?? new Date().toISOString().slice(0, 10);
  const report = await buildReport(at);
  const out = join(args.root, ".forsvn", "slop", "golden-report.json");

  if (args.check) {
    if (!existsSync(out)) { console.log("[build-golden-report] no committed report — nothing to check."); return; }
    const prev = JSON.parse(readFileSync(out, "utf8")) as Partial<GoldenReport>;
    const drift = prev.precision !== report.precision || prev.falsePositives !== report.falsePositives;
    if (drift) {
      console.error(`[build-golden-report] DRIFT — committed precision=${prev.precision} fp=${prev.falsePositives}; fresh precision=${report.precision} fp=${report.falsePositives}. Re-run without --check.`);
      process.exit(2);
    }
    console.log(`[build-golden-report] OK — committed report matches the corpus (precision ${report.precision}, ${report.falsePositives} FP).`);
    return;
  }

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
  console.log(`[build-golden-report] wrote ${out} — ${report.rules} strict rules, precision ${(report.precision * 100).toFixed(1)}% (${report.truePositives} TP / ${report.falsePositives} FP).`);
  if (report.falsePositives !== 0) console.error(`[build-golden-report] ⚠ ${report.falsePositives} corpus FP — the audit gate (c) requires 0; the nightly routine will stay GATED until this is 0.`);
}

if (import.meta.main) main();
