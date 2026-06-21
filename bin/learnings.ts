#!/usr/bin/env bun
// learnings — the L6 portable-ledger CLI. Export/import the local learning corpus
// (verdicts + priors) as a single self-describing JSON bundle the operator owns
// and carries by hand. This is the sanctioned EGRESS the verdicts contract names
// (references/verdicts-data.md): "the future `forsvn learnings export` (L6, gated
// G3), which redacts."
//
// LOCAL-FIRST, ALWAYS. This command is pure file I/O on the operator's own tree:
// no network, no telemetry, no spend — not behind a flag, not ever. The hosted
// mirror is a separate, DORMANT skeleton (bin/lib/hosted-learnings.ts, gated G3);
// `status` reports it as off. Carrying a bundle anywhere is a manual human act.
//
// Usage:
//   bun skills/bin/learnings.ts export [--out <file>] [--include-notes] [--root <dir>] [--json]
//   bun skills/bin/learnings.ts import <bundle.json> [--overwrite] [--root <dir>] [--json]
//   bun skills/bin/learnings.ts status [--root <dir>] [--json]
//
//   export          Write a portable bundle. Default redacts the free-text `note`
//                   column; --include-notes carries it. --out writes to a file
//                   (default: stdout).
//   import          Materialize a bundle into the local stores. Refuses to clobber
//                   a non-empty verdicts store unless --overwrite.
//   status          Report local corpus size + the (dormant) hosted-mirror state.
//
// Exit codes: 0 = ok; 2 = bad usage or a contract error (malformed store/bundle).

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  exportLedger,
  importLedger,
  PortableLedgerError,
  readPriorsStore,
  readVerdictsStore,
} from "../forsvn-preview/lib/portable-ledger";
import { hostedLedger } from "./lib/hosted-learnings";

const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) usage(0);

const JSON_OUT = popFlag("--json");
const INCLUDE_NOTES = popFlag("--include-notes");
const OVERWRITE = popFlag("--overwrite");
const root = resolve(popOpt("--root") ?? process.cwd());
const outFile = popOpt("--out");

const [cmd, positional] = argv.filter((a) => !a.startsWith("--"));

try {
  switch (cmd) {
    case "export":
      doExport();
      break;
    case "import":
      doImport(positional);
      break;
    case "status":
      doStatus();
      break;
    default:
      usage(2, `unknown command ${JSON.stringify(cmd ?? "")}. Use: export | import | status`);
  }
} catch (e) {
  if (e instanceof PortableLedgerError) fail(e.message);
  throw e;
}

function doExport(): void {
  const bundle = exportLedger(root, { includeNotes: INCLUDE_NOTES });
  const text = JSON.stringify(bundle, null, 2) + "\n";
  if (outFile) {
    writeFileSync(resolve(outFile), text, "utf8");
    if (JSON_OUT) {
      console.log(JSON.stringify({ ok: true, out: resolve(outFile), verdicts: bundle.verdicts.rows.length, priors: bundle.priors !== null, notes_included: bundle.notes_included }));
    } else {
      console.error(
        `learnings: exported ${bundle.verdicts.rows.length} verdict(s)` +
          `${bundle.priors !== null ? " + priors" : ""} → ${resolve(outFile)}` +
          `${bundle.notes_included ? "" : " (notes redacted)"}`,
      );
    }
    return;
  }
  // No --out: the bundle IS the output on stdout (pipeable).
  process.stdout.write(text);
  if (!JSON_OUT) {
    process.stderr.write(
      `learnings: exported ${bundle.verdicts.rows.length} verdict(s)` +
        `${bundle.priors !== null ? " + priors" : ""}` +
        `${bundle.notes_included ? "" : " (notes redacted)"}\n`,
    );
  }
}

function doImport(bundlePath: string | undefined): void {
  if (!bundlePath) return usage(2, "import requires a <bundle.json> path");
  const abs = resolve(bundlePath);
  if (!existsSync(abs)) return fail(`no bundle at ${abs}`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(abs, "utf8"));
  } catch (e) {
    return fail(`bundle is not valid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }
  const r = importLedger(root, parsed, { overwrite: OVERWRITE });
  if (JSON_OUT) {
    console.log(JSON.stringify({ ok: true, ...r, root }));
  } else {
    console.error(
      `learnings: imported ${r.verdictsWritten} verdict(s)` +
        `${r.priorsWritten ? " + priors" : ""} into ${root}`,
    );
  }
}

function doStatus(): void {
  const verdicts = readVerdictsStore(root);
  const priors = readPriorsStore(root);
  const hosted = hostedLedger().status(); // dormant by construction
  const result = {
    root,
    verdicts: verdicts.rows.length,
    verdicts_schema_version: verdicts.schemaVersion,
    priors_present: priors !== null,
    portable_export: "local-only", // the bundle is carried by hand
    hosted_mirror: { available: hosted.available, reason: hosted.reason },
  };
  if (JSON_OUT) return void console.log(JSON.stringify(result, null, 2));
  console.log(`learnings status — root ${root}`);
  console.log(`  verdicts: ${result.verdicts} row(s) (schema v${result.verdicts_schema_version})`);
  console.log(`  priors:   ${result.priors_present ? "present" : "none yet"}`);
  console.log(`  export:   local-only portable bundle (no network, redacts notes by default)`);
  console.log(`  hosted mirror: ${hosted.available ? "available" : "dormant"} — ${hosted.detail}`);
}

// --- arg helpers ------------------------------------------------------------

function popFlag(flag: string): boolean {
  const i = argv.indexOf(flag);
  if (i === -1) return false;
  argv.splice(i, 1);
  return true;
}

function popOpt(flag: string): string | undefined {
  const i = argv.indexOf(flag);
  if (i === -1) return undefined;
  const val = argv[i + 1];
  if (val === undefined || val.startsWith("--")) usage(2, `missing value for ${flag}`);
  argv.splice(i, 2);
  return val;
}

function fail(msg: string): never {
  console.error(`learnings: ${msg}`);
  process.exit(2);
}

function usage(code: number, message?: string): never {
  if (message) console.error(`learnings: ${message}`);
  console.error(
    "Usage:\n" +
      "  bun skills/bin/learnings.ts export [--out <file>] [--include-notes] [--root <dir>] [--json]\n" +
      "  bun skills/bin/learnings.ts import <bundle.json> [--overwrite] [--root <dir>] [--json]\n" +
      "  bun skills/bin/learnings.ts status [--root <dir>] [--json]",
  );
  process.exit(code);
}
