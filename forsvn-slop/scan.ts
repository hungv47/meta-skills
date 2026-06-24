#!/usr/bin/env bun
// scan.ts — the Bun CLI shell over the deterministic slop-scan engine (FOR-51 / S2).
//
// A thin shell: argv parse, path/glob resolution, readFile, multi-file aggregation, a grouped-by-
// severity human report or --json (the forsvn-slop-scan/v1 ScanResult), and the exit code. ALL
// detection logic lives in lib/scan-core.mjs (node-importable) so FOR-52's hook reuses the exact
// engine. Generalizes validate-packs.ts's readFile→checks→report→exit shape (exit 2 for findings).
//
// Usage:
//   bun skills/forsvn-slop/scan.ts <paths...> [--json] [--register=<name>] [--strict] [--claude|--gpt|--gemini]
//
// Exit codes:
//   default : 2 iff any BLOCK finding, else 0
//   --strict: 2 iff ANY finding (block|warn|nit), else 0
//   1       : usage / IO error only
//
// DETECT != FIX: this reports and exits; it never rewrites. /forsvn polish (S5) routes the fix.

import { readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { Glob } from "bun";
import { scanText } from "./lib/scan-core.mjs";

const argv = process.argv.slice(2);
const STRICT = argv.includes("--strict");
const JSON_OUT = argv.includes("--json");
const registerArg = argv.find((a) => a.startsWith("--register="));
const REGISTER = registerArg ? registerArg.split("=")[1] : null;
const providers: string[] = [];
for (const [flag, name] of [["--claude", "claude"], ["--gpt", "gpt"], ["--gemini", "gemini"]] as const) {
  if (argv.includes(flag)) providers.push(name);
}
const paths = argv.filter((a) => !a.startsWith("-"));

function fail(msg: string): never {
  console.error(`[forsvn-slop] error: ${msg}`);
  process.exit(1);
}

if (paths.length === 0) {
  fail("no paths given. usage: bun skills/forsvn-slop/scan.ts <paths...> [--json] [--register=<name>] [--strict]");
}

// Resolve each arg to a concrete file list: a file as-is; a directory walked for *.md; a glob expanded.
function resolveFiles(arg: string): string[] {
  if (/[*?[\]]/.test(arg)) {
    const g = new Glob(arg);
    return [...g.scanSync({ cwd: process.cwd(), onlyFiles: true })].map((f) => join(process.cwd(), f));
  }
  if (!existsSync(arg)) fail(`path not found: ${arg}`);
  const st = statSync(arg);
  if (st.isDirectory()) {
    const g = new Glob("**/*.md");
    return [...g.scanSync({ cwd: arg, onlyFiles: true })].map((f) => join(arg, f));
  }
  return [arg];
}

const files = [...new Set(paths.flatMap(resolveFiles))].sort();
if (files.length === 0) fail("no files matched the given paths");

const results = [];
for (const f of files) {
  let text: string;
  try { text = readFileSync(f, "utf8"); } catch (e) { fail(`cannot read ${f}: ${(e as Error).message}`); }
  const rel = relative(process.cwd(), f) || f;
  results.push(await scanText(text, { file: rel, register: REGISTER, providers }));
}

const totals = { block: 0, warn: 0, nit: 0 };
for (const r of results) for (const k of ["block", "warn", "nit"] as const) totals[k] += r.counts[k];
const ok = STRICT ? totals.block + totals.warn + totals.nit === 0 : totals.block === 0;

if (JSON_OUT) {
  // No timestamp/version/cwd — determinism (identical input => identical output).
  console.log(JSON.stringify({ schema: "forsvn-slop-scan/v1", register: REGISTER, results, totals, ok }, null, 2));
} else {
  printReport();
}

function printReport(): void {
  const TAG = { block: "BLOCK", warn: "WARN ", nit: "NIT  " } as const;
  let any = false;
  for (const r of results) {
    if (r.findings.length === 0) continue;
    any = true;
    console.log(`\n${r.file}`);
    for (const sev of ["block", "warn", "nit"] as const) {
      for (const f of r.findings.filter((x) => x.severity === sev)) {
        const loc = f.line > 0 ? `:${f.line}` : "";
        console.log(`  [${TAG[sev]}] ${f.antipattern}${loc} — ${f.evidence || f.name}`);
        if (f.snippet) console.log(`           ↳ ${String(f.snippet).replace(/\n/g, " ")}`);
        console.log(`           fix: /forsvn polish → ${f.fixSkill}`);
      }
    }
  }
  if (!any) console.log(`[forsvn-slop] clean — ${files.length} file(s), 0 findings.`);
  else console.log(`\n[forsvn-slop] ${totals.block} block · ${totals.warn} warn · ${totals.nit} nit across ${results.filter((r) => r.findings.length).length}/${files.length} file(s).`);
}

// default: block gates a write (exit 2). --strict: any finding gates. IO/usage already exited 1.
process.exit(ok ? 0 : 2);
