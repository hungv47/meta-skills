#!/usr/bin/env bun
// knowledge.ts — the knowledge-ledger CLI (A7).
//
// Builds/reads .forsvn/memory/knowledge.json: project facts (ICP present? brand
// ratified? last campaign? known competitors?) each carrying source + confidence +
// date, so /forsvn dispatch never re-asks what's on disk and never re-runs a fresh
// producer for a known fact. The ledger is a CACHE — disk beats it on conflict,
// stale high-stakes facts (>30d) are re-derived, reuse is always narrated.
//
// Provenance-or-nothing: a fact is derived ONLY from an on-disk source; a fact with
// no on-disk source is never written. Logic + schema SoT live in bin/lib/knowledge.ts
// and skills/meta/forsvn/references/knowledge-ledger.md.
//
// Usage:
//   bun bin/knowledge.ts refresh        [--root <dir>]   rescan disk → write the ledger
//   bun bin/knowledge.ts get <key>      [--root <dir>]   print one fact (or "absent")
//   bun bin/knowledge.ts show           [--root <dir>]   human-readable fact table
//   bun bin/knowledge.ts --check        [--root <dir>]   schema + provenance validation (CI exit code)
//
// Exit codes: 0 = ok / valid; 1 = invalid ledger, missing fact, or bad usage.

import {
  refresh, readLedger, getFact, validateLedger, ledgerPath, buildLedger,
  type Fact, type Ledger,
} from "./lib/knowledge";

const argv = process.argv.slice(2);
const checkMode = popFlag("--check");
const root = resolveOpt("--root") ?? process.cwd();
const sub = checkMode ? "check" : (argv.shift() ?? "");

switch (sub) {
  case "refresh": cmdRefresh(); break;
  case "get": cmdGet(); break;
  case "show": cmdShow(); break;
  case "check": cmdCheck(); break;
  default: usage(1, `unknown subcommand ${JSON.stringify(sub)}`);
}

function cmdRefresh(): void {
  const ledger = refresh(root);
  const n = Object.keys(ledger.facts).length;
  console.log(`knowledge refresh: ${rel(ledgerPath(root))} — ${n} fact(s) from disk (provenance per fact).`);
  for (const [k, f] of Object.entries(ledger.facts)) console.log(`  ${k} = ${fmtVal(f.value)}  (${f.source}, ${f.date}, ${f.confidence})`);
}

function cmdGet(): void {
  const key = argv.shift();
  if (!key) usage(1, "get requires <key>");
  const fact = getFact(readLedger(root), key!);
  if (!fact) { console.log(`${key}: absent`); process.exit(0); }
  console.log(JSON.stringify(fact));
}

function cmdShow(): void {
  const ledger = readLedger(root);
  if (!ledger) { console.log(`knowledge show: no ledger at ${rel(ledgerPath(root))} — run \`knowledge refresh\` first.`); process.exit(0); }
  console.log(`knowledge ledger (generated ${ledger.generated}):`);
  const keys = Object.keys(ledger.facts);
  if (!keys.length) { console.log("  (no facts on disk yet)"); return; }
  for (const k of keys) {
    const f = ledger.facts[k];
    console.log(`  ${k.padEnd(26)} ${fmtVal(f.value).padEnd(24)} ${f.source} · ${f.date} · ${f.confidence}`);
  }
}

function cmdCheck(): void {
  const p = ledgerPath(root);
  const ledger = readLedger(root);
  // No ledger on disk is not a failure — it just means "not built yet" (dispatch refreshes).
  // We validate whatever a fresh refresh WOULD produce so --check is meaningful pre-build,
  // and validate the on-disk file when present.
  const target: Ledger = ledger ?? buildLedger(root);
  const problems = validateLedger(target);
  if (problems.length === 0) {
    const where = ledger ? rel(p) : "(no on-disk ledger; validated a fresh derive)";
    console.log(`knowledge --check: OK — ${Object.keys(target.facts).length} fact(s) valid, every fact carries provenance. ${where}`);
    process.exit(0);
  }
  console.error(`knowledge --check: FAIL — ${problems.length} problem(s)${ledger ? ` in ${rel(p)}` : ""}:`);
  for (const pr of problems) console.error(`  - ${pr}`);
  process.exit(1);
}

// --- helpers ----------------------------------------------------------------

function fmtVal(v: Fact["value"]): string {
  if (Array.isArray(v)) return v.length ? `[${v.join(", ")}]` : "[]";
  return String(v);
}
function popFlag(flag: string): boolean {
  const i = argv.indexOf(flag);
  if (i === -1) return false;
  argv.splice(i, 1);
  return true;
}
function resolveOpt(flag: string): string | undefined {
  const i = argv.indexOf(flag);
  if (i === -1 || i + 1 >= argv.length) return undefined;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
}
function rel(p: string): string { return p.startsWith(root) ? p.slice(root.length + 1) : p; }
function usage(code: number, msg?: string): never {
  if (msg) console.error(`knowledge: ${msg}`);
  console.error("Usage: bun bin/knowledge.ts <refresh|get <key>|show> [--root <dir>] | bun bin/knowledge.ts --check [--root <dir>]");
  process.exit(code);
}
