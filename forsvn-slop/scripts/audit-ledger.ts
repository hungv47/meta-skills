#!/usr/bin/env bun
// audit-ledger.ts — validate-and-append + query helper for the nightly slop marketing-audit
// ledger (.forsvn/slop/audit-ledger.tsv), FOR-59 / S10. Clones the proven validate-and-append
// shape of skills/meta/run-pipeline/scripts/append-loop-result.ts: a fixed HEADER, a status-enum
// Set, a YYYY-MM-DD regex, tab/newline/CR rejection over every field, and realpath/escape +
// symlink-refusal path-safety so an artifact must resolve under docs/forsvn/artifacts/marketing/
// and the ledger write stays under .forsvn/slop/. The ledger is committed compounding state
// (exempt from validate-artifacts by living outside the canonical/artifacts/experience grammar,
// like .forsvn/performance/) — never gitignore it.
//
// Modes:
//   append:         bun audit-ledger.ts append --artifact <p> --rule <r> --before <n> --after <n>
//                     --status <landed|no-op|rejected> [--pr <N>] --note <text> [--date YYYY-MM-DD]
//                   Heartbeat (no eligible artifact): --artifact - --rule - --before - --after -
//                     --status no-op --note "no eligible artifact above threshold"
//   recently-tried: bun audit-ledger.ts recently-tried [--lookback-days 14] [--as-of YYYY-MM-DD]
//                   Prints the SKIP set — artifacts attempted within N days that are NOT eligible
//                   for retry (one path per line). Ignores '-' heartbeat rows. A freshly-edited
//                   artifact (last git-commit date newer than its latest ledger-row date) is
//                   RE-OPENED (omitted from the set) so fresh slop isn't ignored. Git commit date
//                   (NOT fs mtime) is the signal: a fresh clone/checkout — how the cron materializes
//                   the clean base the gate requires — resets every file's mtime to checkout time,
//                   which would otherwise re-open every prior-day artifact and re-PR it nightly.
//
// Exit: 0 success, non-zero on a validation failure / bad usage.

import { existsSync, readFileSync, appendFileSync, writeFileSync, mkdirSync, lstatSync, realpathSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve, sep } from "node:path";

export const HEADER = "date\tartifact\trule\tdensity_before\tdensity_after\tstatus\tpr\tnote";
export const STATUSES = new Set(["landed", "no-op", "rejected"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const NUM_OR_DASH = /^(-|\d+(\.\d+)?)$/;
const PR_OR_DASH = /^(-|\d+)$/;
const MARKETING_REL = join("docs", "forsvn", "artifacts", "marketing");
const LEDGER_REL = join(".forsvn", "slop", "audit-ledger.tsv");

export function ledgerPath(root: string): string {
  return join(root, LEDGER_REL);
}

export interface AppendRow {
  date: string;
  artifact: string; // '-' for a heartbeat, else a repo-relative path under docs/forsvn/artifacts/marketing/
  rule: string; // '-' for a heartbeat, else the ruleId
  before: string; // numeric or '-'
  after: string; // numeric or '-'
  status: string; // landed | no-op | rejected
  pr: string; // PR number or '-'
  note: string;
}

/** Pure validation — returns an error string or null. Exposed for unit tests. */
export function validateAppend(root: string, r: AppendRow): string | null {
  if (!STATUSES.has(r.status)) return `invalid status ${JSON.stringify(r.status)} (expected ${[...STATUSES].join(" | ")})`;
  if (!DATE_RE.test(r.date)) return `invalid date ${JSON.stringify(r.date)} (expected YYYY-MM-DD)`;
  if (!NUM_OR_DASH.test(r.before)) return `--before must be a number or '-' (got ${JSON.stringify(r.before)})`;
  if (!NUM_OR_DASH.test(r.after)) return `--after must be a number or '-' (got ${JSON.stringify(r.after)})`;
  if (!PR_OR_DASH.test(r.pr)) return `--pr must be a number or '-' (got ${JSON.stringify(r.pr)})`;
  for (const [name, v] of Object.entries(r)) {
    if (v.includes("\t") || v.includes("\n") || v.includes("\r")) return `${name} must not contain tabs or newlines`;
  }
  if (r.artifact !== "-") {
    const pathErr = assertArtifactUnderMarketing(root, r.artifact);
    if (pathErr) return pathErr;
  }
  return null;
}

/** Returns an error string if the artifact path is unsafe / escapes the marketing dir, else null. */
function assertArtifactUnderMarketing(root: string, artifact: string): string | null {
  if (artifact.startsWith("/") || artifact.split("/").includes("..")) {
    return `--artifact must be a safe repo-relative path under docs/forsvn/artifacts/marketing/ (got ${JSON.stringify(artifact)})`;
  }
  const marketingDir = join(root, MARKETING_REL);
  if (!existsSync(marketingDir)) return `marketing artifacts dir not found: ${MARKETING_REL}`;
  const abs = join(root, artifact);
  if (!existsSync(abs)) return `--artifact does not exist: ${artifact}`;
  if (lstatSync(abs).isSymbolicLink()) return `refusing a symlinked artifact: ${artifact}`;
  const realMarketing = realpathSync(marketingDir);
  const realArtifact = realpathSync(abs);
  if (realArtifact !== realMarketing && !realArtifact.startsWith(`${realMarketing}${sep}`)) {
    return `--artifact resolves outside docs/forsvn/artifacts/marketing/: ${artifact}`;
  }
  return null;
}

/** Append one validated row. Creates the ledger with HEADER if absent; refuses a mismatched header. */
export function appendLedgerRow(root: string, r: AppendRow): void {
  const err = validateAppend(root, r);
  if (err) throw new Error(err);
  const path = ledgerPath(root);
  if (!existsSync(path)) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, HEADER + "\n", "utf8");
  } else if (lstatSync(path).isSymbolicLink()) {
    throw new Error("refusing to write through a symlinked audit-ledger.tsv");
  }
  const first = readFileSync(path, "utf8").split("\n")[0];
  if (first !== HEADER) throw new Error(`audit-ledger.tsv header mismatch. Expected:\n${HEADER}`);
  const row = [r.date, r.artifact, r.rule, r.before, r.after, r.status, r.pr, r.note].join("\t");
  appendFileSync(path, row + "\n", "utf8");
}

/** Last git-commit date (YYYY-MM-DD, committer short date) that touched `artifact` under `root`,
 *  or "" if untracked / not in history / git unavailable. Used INSTEAD of fs mtime: a fresh clone
 *  or `git checkout`/`reset --hard` — how the nightly cron materializes the clean base the gate
 *  requires — rewrites every file's mtime to checkout time, which would spuriously re-open every
 *  prior-day artifact. Commit date is intrinsic to history and survives that. */
export function lastCommitDate(root: string, artifact: string): string {
  try {
    const out = execFileSync("git", ["-C", root, "log", "-1", "--format=%cs", "--", artifact], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return DATE_RE.test(out) ? out : "";
  } catch {
    return ""; // untracked / not a repo / git missing → no re-open signal (conservative: stays skipped)
  }
}

/** The SKIP set: artifacts tried within the window, minus any re-opened by a fresh (committed) edit.
 *  `lastTouchedOf` resolves an artifact's last-edit date (default: git commit date); injectable so
 *  tests are deterministic without a real git repo. */
export function recentlyTried(
  root: string,
  lookbackDays: number,
  asOf: string,
  lastTouchedOf: (artifact: string) => string = (a) => lastCommitDate(root, a),
): string[] {
  const path = ledgerPath(root);
  if (!existsSync(path)) return [];
  const since = new Date(Date.parse(asOf + "T00:00:00Z") - lookbackDays * 86_400_000).toISOString().slice(0, 10);
  const latestByArtifact = new Map<string, string>();
  for (const line of readFileSync(path, "utf8").split("\n").slice(1)) {
    if (!line.trim() || line.startsWith("#")) continue;
    const cols = line.split("\t");
    const date = cols[0];
    const artifact = cols[1];
    if (!DATE_RE.test(date) || !artifact || artifact === "-") continue; // skip heartbeats / malformed
    const prev = latestByArtifact.get(artifact);
    if (!prev || date > prev) latestByArtifact.set(artifact, date);
  }
  const skip: string[] = [];
  for (const [artifact, date] of latestByArtifact) {
    if (date < since || date > asOf) continue; // outside the lookback window
    const touched = lastTouchedOf(artifact);
    if (touched && touched > date) continue; // committed edit since the attempt → re-open (eligible)
    skip.push(artifact);
  }
  return skip.sort();
}

// --- CLI --------------------------------------------------------------------
function main(): void {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) usage(0);
  const mode = argv[0];
  const opts = parseArgs(argv.slice(1));
  const root = realpathSync(resolve(opts.root ?? process.cwd()));
  const today = new Date().toISOString().slice(0, 10);

  if (mode === "append") {
    const r: AppendRow = {
      date: opts.date ?? today,
      artifact: required(opts.artifact, "--artifact"),
      rule: required(opts.rule, "--rule"),
      before: opts.before ?? "-",
      after: opts.after ?? "-",
      status: required(opts.status, "--status"),
      pr: opts.pr ?? "-",
      note: required(opts.note, "--note"),
    };
    try { appendLedgerRow(root, r); }
    catch (e) { fail((e as Error).message); }
    console.log(`audit-ledger: appended ${r.status} row (${r.artifact}${r.rule !== "-" ? " / " + r.rule : ""})`);
    return;
  }

  if (mode === "recently-tried") {
    const lookback = opts["lookback-days"] ? Number(opts["lookback-days"]) : 14;
    if (!Number.isInteger(lookback) || lookback < 0) fail(`--lookback-days must be a non-negative integer (got ${opts["lookback-days"]})`);
    const asOf = opts["as-of"] ?? today;
    if (!DATE_RE.test(asOf)) fail(`--as-of must be YYYY-MM-DD (got ${asOf})`);
    for (const a of recentlyTried(root, lookback, asOf)) console.log(a);
    return;
  }

  fail(`unknown mode ${JSON.stringify(mode)} (expected: append | recently-tried)`);
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
  return value;
}

function fail(message: string): never {
  console.error(`audit-ledger: ${message}`);
  usage(1);
}

function usage(code: number): never {
  console.error(
    "Usage:\n" +
    "  bun audit-ledger.ts append --artifact <p|-> --rule <r|-> --before <n|-> --after <n|-> --status <landed|no-op|rejected> [--pr <N|->] --note <text> [--date YYYY-MM-DD] [--root path]\n" +
    "  bun audit-ledger.ts recently-tried [--lookback-days 14] [--as-of YYYY-MM-DD] [--root path]",
  );
  process.exit(code);
}

if (import.meta.main) main();
