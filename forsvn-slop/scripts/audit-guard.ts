#!/usr/bin/env bun
// audit-guard.ts — the refuse-before-mutate pre-flight for the nightly slop marketing-audit
// routine (FOR-59 / S10). An uncalibrated detector must NEVER open nightly PRs: a confidently-
// wrong rule fired unattended quietly weakens good copy, and after 2-3 of those the operator
// mutes the whole detector forever (slop-detector.md §2.1 / D-26). So this guard ships the
// routine DISABLED and only opens once a 4-part AND holds — re-checked EVERY run so a regressed
// corpus auto-re-gates. Modeled on the unattended-refusal discipline (fail-fast pre-flight,
// clean-tree refusal) of an Impeccable release script.
//
// THE GATE (4-part AND; default DISABLED, fail-safe):
//   (a) operator flag    — .forsvn/slop/config.json gate_enabled:true AND a .forsvn/slop/GATE marker
//   (b) engine present   — forsvn-slop/scan.ts + registry/antipatterns.mjs + finding.mjs (FOR-50/51)
//   (c) precision trusted — .forsvn/slop/golden-report.json precision >= floor AND falsePositives == 0
//   (d) override ledger live — .forsvn/learning/verdicts.tsv present
// Plus a clean working tree. (b)(c)(d) are re-checked every run; (a) is the human's final switch.
//
// Usage:
//   bun audit-guard.ts [--json] [--root path]          → exit 0 only if the gate is OPEN + tree clean
//   bun audit-guard.ts --assert-diff <base> [--root]    → exit 0 only if the branch diff touches ONLY
//                                                          the two allowlists (marketing artifacts +
//                                                          the audit ledger); names any escaping path.
//
// Exit: 0 = open / diff-clean. Non-zero = gated, blocked (dirty tree), or a scope escape — with a
// one-line reason. (The ROUTINE turns a non-zero gate into a no-op + exit 0: a gated no-op is success.)

import { existsSync, readFileSync, readdirSync, statSync, appendFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { recentlyTried } from "./audit-ledger";

const ENGINE_DIR = join(dirname(fileURLToPath(import.meta.url)), ".."); // forsvn-slop/
const SCAN_TS = join(ENGINE_DIR, "scan.ts");
const MARKETING_REL = join("docs", "forsvn", "artifacts", "marketing");

// The Step-6 scope allowlist: a nightly branch diff may touch ONLY these.
const ALLOW_PREFIXES = ["docs/forsvn/artifacts/marketing/"];
const ALLOW_EXACT = [".forsvn/slop/audit-ledger.tsv"];

export function pathWithinAllowlist(p: string): boolean {
  return ALLOW_EXACT.includes(p) || ALLOW_PREFIXES.some((pre) => p.startsWith(pre));
}

interface Config { gate_enabled: boolean; lookback_days: number; precision_floor: number; }

function readConfig(root: string): Config {
  const def: Config = { gate_enabled: false, lookback_days: 14, precision_floor: 0.95 };
  try {
    const p = join(root, ".forsvn", "slop", "config.json");
    if (!existsSync(p)) return def;
    const parsed = JSON.parse(readFileSync(p, "utf8")) as Partial<Config>;
    return {
      gate_enabled: parsed.gate_enabled === true,
      lookback_days: Number.isInteger(parsed.lookback_days) ? (parsed.lookback_days as number) : def.lookback_days,
      precision_floor: typeof parsed.precision_floor === "number" ? parsed.precision_floor : def.precision_floor,
    };
  } catch { return def; }
}

function readGoldenReport(root: string): { precision: number; falsePositives: number } | null {
  try {
    const p = join(root, ".forsvn", "slop", "golden-report.json");
    if (!existsSync(p)) return null;
    const parsed = JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;
    if (typeof parsed.precision !== "number" || typeof parsed.falsePositives !== "number") return null;
    return { precision: parsed.precision, falsePositives: parsed.falsePositives };
  } catch { return null; }
}

export interface GateResult { gated: boolean; reason: string; checks: Record<string, boolean>; }

/** The 4-part gate (engine files are checked at the installed module, not the project root). */
export function evaluateGate(root: string): GateResult {
  const cfg = readConfig(root);
  const flag = cfg.gate_enabled === true;
  const marker = existsSync(join(root, ".forsvn", "slop", "GATE"));
  const enginePresent = existsSync(SCAN_TS)
    && existsSync(join(ENGINE_DIR, "registry", "antipatterns.mjs"))
    && existsSync(join(ENGINE_DIR, "finding.mjs"));
  const report = readGoldenReport(root);
  const precisionOk = report != null && report.precision >= cfg.precision_floor && report.falsePositives === 0;
  const verdictsLive = existsSync(join(root, ".forsvn", "learning", "verdicts.tsv"));

  const checks = { operator_flag: flag, gate_marker: marker, engine_present: enginePresent, precision_ok: precisionOk, override_ledger_live: verdictsLive };

  // priority-ordered reasons (fail toward gated)
  if (!flag) return { gated: true, reason: "gate_enabled is false — the operator has not switched the routine on", checks };
  if (!marker) return { gated: true, reason: "no .forsvn/slop/GATE marker file", checks };
  if (!enginePresent) return { gated: true, reason: "slop engine files missing (scan.ts / registry / finding.mjs)", checks };
  if (report == null) return { gated: true, reason: "no .forsvn/slop/golden-report.json — precision not yet proven", checks };
  if (!precisionOk) return { gated: true, reason: `precision ${report.precision} < floor ${cfg.precision_floor} or falsePositives ${report.falsePositives} != 0`, checks };
  if (!verdictsLive) return { gated: true, reason: "no .forsvn/learning/verdicts.tsv — the override ledger is not live", checks };
  return { gated: false, reason: "", checks };
}

/** git working tree clean? Best-effort: a non-git dir reports clean (the gate is the real guard). */
export function gitCleanTree(root: string): boolean {
  const res = spawnSync("git", ["-C", root, "status", "--porcelain"], { encoding: "utf8" });
  if (res.status !== 0) return true; // not a git repo / git unavailable — don't block on it here
  return (res.stdout ?? "").trim() === "";
}

// --- scan adapter + selection (run only when the gate is OPEN) ---------------
export interface ScanRead { findings: ScanFinding[]; deterministicCount: number; words: number; densityPer1k: number; byRule: Record<string, { count: number; tier: string; severity: string }>; }
interface ScanFinding { antipattern: string; tier: string; severity: string }
const DETERMINISTIC = new Set(["regex", "heuristic"]);

/** One adapter over `scan.ts --json` so a contract drift is fixed in one place. Computes the
 *  deterministic-only density (scan.ts emits neither densityPer1k nor byFamily) + groups by ruleId. */
export function readScan(absPath: string): ScanRead {
  const res = spawnSync("bun", [SCAN_TS, absPath, "--json"], { encoding: "utf8" });
  let parsed: { results?: Array<{ findings?: ScanFinding[] }> } = {};
  try { parsed = JSON.parse(res.stdout || "{}"); } catch { parsed = {}; }
  const findings = parsed.results?.[0]?.findings ?? [];
  const deterministic = findings.filter((f) => DETERMINISTIC.has(f.tier));
  const words = countWords(absPath);
  const byRule: ScanRead["byRule"] = {};
  for (const f of deterministic) {
    const e = (byRule[f.antipattern] ??= { count: 0, tier: f.tier, severity: f.severity });
    e.count++;
  }
  return { findings, deterministicCount: deterministic.length, words, densityPer1k: round3((deterministic.length / Math.max(1, words)) * 1000), byRule };
}

const SEV_RANK: Record<string, number> = { block: 3, warn: 2, nit: 1 };

export interface Target { eligibleArtifact: string; worstRule: string; densityBefore: number; }

/** Rank marketing artifacts by deterministic density, skip recently-tried, pick the worst with
 *  density > 0, then its densest deterministic ruleId. Returns null on a clean / no-eligible tree. */
export function selectTarget(root: string, lookbackDays: number, asOf: string): Target | null {
  const marketingDir = join(root, MARKETING_REL);
  if (!existsSync(marketingDir)) return null;
  const skip = new Set(recentlyTried(root, lookbackDays, asOf));
  let best: Target | null = null;
  for (const abs of walkMd(marketingDir)) {
    const rel = relative(root, abs);
    if (skip.has(rel)) continue;
    const scan = readScan(abs);
    if (scan.densityPer1k <= 0) continue;
    if (best && scan.densityPer1k <= best.densityBefore) continue;
    const worstRule = Object.entries(scan.byRule)
      .sort((a, b) => b[1].count - a[1].count || (SEV_RANK[b[1].severity] ?? 0) - (SEV_RANK[a[1].severity] ?? 0) || a[0].localeCompare(b[0]))[0]?.[0];
    if (!worstRule) continue;
    best = { eligibleArtifact: rel, worstRule, densityBefore: scan.densityPer1k };
  }
  return best;
}

/** Assert a branch diff (base...HEAD) touches ONLY the allowlist. Returns the escaping paths. */
export function assertDiff(root: string, base: string): { ok: boolean; escapes: string[] } {
  const res = spawnSync("git", ["-C", root, "diff", "--name-only", `${base}...HEAD`], { encoding: "utf8" });
  if (res.status !== 0) return { ok: false, escapes: [`git diff failed: ${(res.stderr ?? "").trim()}`] };
  const paths = (res.stdout ?? "").split("\n").map((p) => p.trim()).filter(Boolean);
  const escapes = paths.filter((p) => !pathWithinAllowlist(p));
  return { ok: escapes.length === 0, escapes };
}

// --- CLI --------------------------------------------------------------------
function main(): void {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) usage(0);
  const jsonOut = takeFlag(argv, "--json");
  const opts = takeOpts(argv);
  const root = resolve(opts.root ?? process.cwd());

  if (opts["assert-diff"] !== undefined) {
    const { ok, escapes } = assertDiff(root, opts["assert-diff"]);
    if (jsonOut) console.log(JSON.stringify({ ok, escapes }, null, 2));
    if (ok) { if (!jsonOut) console.log("audit-guard: branch diff is within the marketing+ledger allowlist."); return; }
    console.error(`audit-guard: scope escape — ${escapes.length} path(s) outside the allowlist:`);
    for (const e of escapes) console.error(`  ✗ ${e}`);
    process.exit(1);
  }

  const gate = evaluateGate(root);
  if (gate.gated) {
    emit(jsonOut, { gated: true, reason: gate.reason, checks: gate.checks, eligibleArtifact: null, worstRule: null });
    process.exit(2); // gated — the ROUTINE treats this as a no-op + exit 0 (success)
  }
  if (!gitCleanTree(root)) {
    emit(jsonOut, { gated: true, reason: "working tree is dirty — commit or stash first", checks: gate.checks, eligibleArtifact: null, worstRule: null });
    process.exit(3); // blocked
  }
  const cfg = readConfig(root);
  const asOf = new Date().toISOString().slice(0, 10);
  const target = selectTarget(root, cfg.lookback_days, asOf);
  emit(jsonOut, { gated: false, reason: "", checks: gate.checks, eligibleArtifact: target?.eligibleArtifact ?? null, worstRule: target?.worstRule ?? null });
  // GITHUB_OUTPUT bonus (only if the env var is present — a future GH-Actions wiring).
  if (process.env.GITHUB_OUTPUT) {
    try { appendFileSync(process.env.GITHUB_OUTPUT, `gated=false\neligible_artifact=${target?.eligibleArtifact ?? ""}\nworst_rule=${target?.worstRule ?? ""}\n`); } catch { /* ignore */ }
  }
  // exit 0 — gate open, tree clean. (No eligible artifact is still a success; the routine no-ops.)
}

function emit(jsonOut: boolean, payload: Record<string, unknown>): void {
  if (jsonOut) { console.log(JSON.stringify(payload, null, 2)); return; }
  if (payload.gated) console.error(`audit-guard: GATED — ${payload.reason}`);
  else console.log(`audit-guard: gate OPEN${payload.eligibleArtifact ? ` — eligible: ${payload.eligibleArtifact} (worst rule ${payload.worstRule})` : " — no eligible artifact (no-op night)"}`);
}

function walkMd(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isSymbolicLink()) continue; // never follow symlinks out of the tree
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.isFile() && e.name.endsWith(".md")) out.push(p);
  }
  return out.sort();
}
function countWords(absPath: string): number {
  try {
    const text = readFileSync(absPath, "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ""); // drop frontmatter
    return (text.match(/\S+/g) ?? []).length;
  } catch { return 0; }
}
function round3(n: number): number { return Number(n.toFixed(3)); }
function takeFlag(argv: string[], flag: string): boolean {
  const i = argv.indexOf(flag);
  if (i === -1) return false;
  argv.splice(i, 1);
  return true;
}
function takeOpts(argv: string[]): Record<string, string> {
  const o: Record<string, string> = {};
  while (argv.length) {
    const k = argv.shift()!;
    if (!k.startsWith("--")) usage(1, `Unexpected argument ${JSON.stringify(k)}`);
    const v = argv.shift();
    if (v === undefined) usage(1, `Missing value for ${k}`);
    o[k.slice(2)] = v;
  }
  return o;
}
function usage(code: number, message?: string): never {
  if (message) console.error(`audit-guard: ${message}`);
  console.error(
    "Usage: bun audit-guard.ts [--json] [--root path]\n" +
    "       bun audit-guard.ts --assert-diff <base> [--json] [--root path]",
  );
  process.exit(code);
}

if (import.meta.main) main();
