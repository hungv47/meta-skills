#!/usr/bin/env bun
// query-verdicts — the single read path for the .forsvn/learning/verdicts.tsv
// store (C2/L1). Contract: skills/references/verdicts-data.md. WS-L (L3 dashboard,
// L4 shrinkage recall, L5 telemetry) is the ONLY reader; producers never re-derive
// any of this. Clones the query-performance.ts discipline:
//
//   - schema_version header validation (missing/unknown → actionable error, exit 1)
//   - column-header validation against the v1 contract
//   - keyless-row rejection (missing artifact_id / skill / decision_state — rejected
//     rows never count and never appear in results)
//   - typed empty/answered states (an absent store is a NORMAL first-run state)
//   - latest-ts-wins dedupe per artifact_id is available as a "current verdict" view
//
// Aggregations (WS-L's needs): total verdicts; per-skill decision counts
// (approved/denied/suggested); per-(skill, decision_reason) tallies; per-(skill,
// stack) deny-rate.
//
// Usage:
//   bun lib/query-verdicts.ts [--skill S] [--stack T] [--decision approved|denied|suggested]
//     [--reason <enum>] [--since YYYY-MM-DD] [--current] [--edit-aggregate]
//     [--as-of YYYY-MM-DD] [--root path] [--json]
//
//   --edit-aggregate  per-skill × edit-type counts + the 90d rate (L2 edit deltas).
//   --as-of           anchor the 90d window (default: today); deterministic for tests.
//
// Exit codes: 0 = query answered (any state, incl. an absent store);
//             1 = contract violation (malformed store) or bad usage.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { VERDICTS_COLUMNS, VERDICTS_SCHEMA_VERSION, verdictsPath, type VerdictColumn } from "./verdicts";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DECISIONS = new Set(["approved", "denied", "suggested"]);
const WINDOW_DAYS = 90; // L2 edit-aggregate trailing window

type Row = Record<VerdictColumn, string> & { line: number };
type Rejected = { line: number; reason: string };
type State = "empty" | "answered";

// --- args -------------------------------------------------------------------
const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) usage(0);
const JSON_OUT = popFlag("--json");
const CURRENT = popFlag("--current"); // collapse to the latest verdict per artifact_id
const EDIT_AGGREGATE = popFlag("--edit-aggregate"); // L2 per-skill × edit-type rollup
const opts: Record<string, string> = {};
while (argv.length) {
  const key = argv.shift()!;
  if (!key.startsWith("--")) usage(1, `Unexpected argument ${JSON.stringify(key)}`);
  const val = argv.shift();
  if (val === undefined) usage(1, `Missing value for ${key}`);
  opts[key.slice(2)] = val;
}
const ROOT = resolve(opts.root ?? process.cwd());
if (opts.since !== undefined && !DATE_RE.test(opts.since)) usage(1, `Invalid --since ${JSON.stringify(opts.since)} — expected YYYY-MM-DD.`);
if (opts["as-of"] !== undefined && !DATE_RE.test(opts["as-of"])) usage(1, `Invalid --as-of ${JSON.stringify(opts["as-of"])} — expected YYYY-MM-DD.`);
if (opts.decision !== undefined && !DECISIONS.has(opts.decision)) usage(1, `Invalid --decision ${JSON.stringify(opts.decision)} — expected approved | denied | suggested.`);

// --- read store -------------------------------------------------------------
const storePath = verdictsPath(ROOT);
if (!existsSync(storePath)) {
  emit({ state: "empty", rows: [], rejected: [], storeExists: false });
  process.exit(0);
}

const lines = readFileSync(storePath, "utf8").split("\n");
let i = 0;
while (i < lines.length && lines[i].trim() === "") i++;
const headerLine = lines[i] ?? "";
const versionMatch = headerLine.match(/^#\s*schema_version:\s*(\d+)\s*$/);
if (!versionMatch) {
  contractFail(
    `${rel(storePath)} is missing the schema_version header.\n` +
    `Expected first line: "# schema_version: ${VERDICTS_SCHEMA_VERSION}"\n` +
    `The store contract is skills/references/verdicts-data.md — never query unversioned data.`,
  );
}
const fileVersion = Number(versionMatch![1]);
if (fileVersion !== VERDICTS_SCHEMA_VERSION) {
  contractFail(
    `${rel(storePath)} has schema_version ${fileVersion}; this helper reads version ${VERDICTS_SCHEMA_VERSION}.\n` +
    `Migrations run via a _dev/ migration script only (verdicts-data.md) — never hand-rewrite the store.`,
  );
}
const columnLine = lines[i + 1] ?? "";
if (columnLine.split("\t").join("\t") !== VERDICTS_COLUMNS.join("\t")) {
  contractFail(
    `${rel(storePath)} column header does not match the v${VERDICTS_SCHEMA_VERSION} contract.\n` +
    `Expected: ${VERDICTS_COLUMNS.join("\\t")}\nGot:      ${columnLine.split("\t").join("\\t")}`,
  );
}

const rows: Row[] = [];
const rejected: Rejected[] = [];
for (let n = i + 2; n < lines.length; n++) {
  const raw = lines[n];
  if (raw.trim() === "" || raw.startsWith("#")) continue;
  const parts = raw.split("\t");
  const row = Object.fromEntries(VERDICTS_COLUMNS.map((c, idx) => [c, (parts[idx] ?? "").trim()])) as Row;
  row.line = n + 1;
  const missing = (["artifact_id", "skill", "decision_state"] as const).filter((k) => row[k] === "");
  if (missing.length) {
    rejected.push({ line: row.line, reason: `missing key component(s): ${missing.join(", ")}` });
    continue;
  }
  if (!DECISIONS.has(row.decision_state)) {
    rejected.push({ line: row.line, reason: `decision_state "${row.decision_state}" is not one of approved|denied|suggested` });
    continue;
  }
  rows.push(row);
}

// --- filters ----------------------------------------------------------------
let filtered = rows;
if (opts.skill) filtered = filtered.filter((r) => r.skill === opts.skill);
if (opts.stack) filtered = filtered.filter((r) => r.stack === opts.stack);
if (opts.decision) filtered = filtered.filter((r) => r.decision_state === opts.decision);
if (opts.reason) filtered = filtered.filter((r) => r.decision_reason === opts.reason);
if (opts.since) filtered = filtered.filter((r) => r.ts.slice(0, 10) >= opts.since!);

// --- optional "current verdict" view: latest ts wins per artifact_id ---------
if (CURRENT) {
  const byId = new Map<string, Row>();
  for (const r of filtered) {
    const prev = byId.get(r.artifact_id);
    if (!prev || r.ts >= prev.ts) byId.set(r.artifact_id, r);
  }
  filtered = [...byId.values()];
}

emit({ state: filtered.length === 0 ? "empty" : "answered", rows: filtered, rejected, storeExists: true });
process.exit(0);

// --- helpers ----------------------------------------------------------------
function emit(r: { state: State; rows: Row[]; rejected: Rejected[]; storeExists: boolean }): void {
  // per-skill decision counts
  const perSkill: Record<string, { approved: number; denied: number; suggested: number; total: number }> = {};
  // per-(skill, reason) tallies
  const perSkillReason: Record<string, Record<string, number>> = {};
  // per-(skill, stack) deny-rate
  const perSkillStack: Record<string, { denied: number; total: number }> = {};
  for (const row of r.rows) {
    const s = (perSkill[row.skill] ??= { approved: 0, denied: 0, suggested: 0, total: 0 });
    s[row.decision_state as "approved" | "denied" | "suggested"]++;
    s.total++;
    if (row.decision_reason) {
      const rr = (perSkillReason[row.skill] ??= {});
      rr[row.decision_reason] = (rr[row.decision_reason] ?? 0) + 1;
    }
    const ssKey = `${row.skill}\t${row.stack}`;
    const ss = (perSkillStack[ssKey] ??= { denied: 0, total: 0 });
    ss.total++;
    if (row.decision_state === "denied") ss.denied++;
  }
  const denyRates = Object.entries(perSkillStack).map(([k, v]) => {
    const [skill, stack] = k.split("\t");
    return { skill, stack, denied: v.denied, total: v.total, deny_rate: v.total ? Number((v.denied / v.total).toFixed(3)) : 0 };
  });

  // L2 — per-skill × edit-type rollup over the trailing 90d window. Counts the
  // `;`-joined edit_classes the writer guarantees are enum values; rate = type
  // count / the skill's verdicts in-window. Anchored at --as-of (default today)
  // so the window is deterministic. Only computed on --edit-aggregate.
  const editAggregate = EDIT_AGGREGATE ? buildEditAggregate(r.rows) : null;

  const result = {
    state: r.state,
    store_exists: r.storeExists,
    current_view: CURRENT,
    filters: {
      skill: opts.skill ?? null, stack: opts.stack ?? null,
      decision: opts.decision ?? null, reason: opts.reason ?? null, since: opts.since ?? null,
    },
    total_verdicts: r.rows.length,
    per_skill: perSkill,
    per_skill_reason: perSkillReason,
    deny_rates: denyRates,
    edit_aggregate: editAggregate,
    rejected_rows: r.rejected,
  };
  if (JSON_OUT) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(`query-verdicts: state ${r.state} — ${r.rows.length} verdict(s)${r.storeExists ? "" : " (no store yet — first-run empty is normal)"}`);
  const af = Object.entries(result.filters).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`);
  if (af.length) console.log(`  filters: ${af.join(" ")}`);
  for (const [skill, c] of Object.entries(perSkill)) {
    const reasons = perSkillReason[skill] ? "  reasons: " + Object.entries(perSkillReason[skill]).map(([k, v]) => `${k}=${v}`).join(" ") : "";
    console.log(`  ${skill}: approved=${c.approved} denied=${c.denied} suggested=${c.suggested} (n=${c.total})${reasons}`);
  }
  for (const d of denyRates) console.log(`  deny-rate ${d.skill}/${d.stack}: ${d.denied}/${d.total} = ${d.deny_rate}`);
  if (editAggregate) {
    console.log(`  edit-aggregate (${editAggregate.window_days}d window, as-of ${editAggregate.as_of}, since ${editAggregate.since}):`);
    for (const [skill, v] of Object.entries(editAggregate.per_skill)) {
      const types = Object.entries(v.edits).map(([t, c]) => `${t}=${c.count}(${c.rate})`).join(" ");
      console.log(`    ${skill}: n=${v.total}${types ? "  " + types : "  (no edit deltas)"}`);
    }
  }
  if (r.rejected.length) for (const rej of r.rejected) console.log(`  rejected line ${rej.line}: ${rej.reason}`);
}

type EditAggregate = {
  window_days: number;
  as_of: string;
  since: string;
  per_skill: Record<string, { total: number; edits: Record<string, { count: number; rate: number }> }>;
};

/** Per-skill × edit-type counts + rate over the trailing 90d window [as_of-90d, as_of]. */
function buildEditAggregate(rows: Row[]): EditAggregate {
  const asOf = opts["as-of"] ?? new Date().toISOString().slice(0, 10);
  const since = new Date(new Date(asOf + "T00:00:00Z").getTime() - WINDOW_DAYS * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const acc: Record<string, { total: number; edits: Record<string, number> }> = {};
  for (const row of rows) {
    const d = row.ts.slice(0, 10);
    if (d < since || d > asOf) continue;
    const s = (acc[row.skill] ??= { total: 0, edits: {} });
    s.total++;
    for (const t of row.edit_classes.split(";").map((x) => x.trim()).filter(Boolean)) {
      s.edits[t] = (s.edits[t] ?? 0) + 1;
    }
  }
  const per_skill: EditAggregate["per_skill"] = {};
  for (const [skill, v] of Object.entries(acc)) {
    per_skill[skill] = { total: v.total, edits: {} };
    for (const [t, c] of Object.entries(v.edits)) {
      per_skill[skill].edits[t] = { count: c, rate: v.total ? Number((c / v.total).toFixed(3)) : 0 };
    }
  }
  return { window_days: WINDOW_DAYS, as_of: asOf, since, per_skill };
}

function popFlag(flag: string): boolean {
  const idx = argv.indexOf(flag);
  if (idx === -1) return false;
  argv.splice(idx, 1);
  return true;
}

function rel(p: string): string {
  return p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p;
}

function contractFail(message: string): never {
  console.error(`query-verdicts: ${message}`);
  process.exit(1);
}

function usage(code: number, message?: string): never {
  if (message) console.error(`query-verdicts: ${message}`);
  console.error(
    "Usage: bun lib/query-verdicts.ts [--skill S] [--stack T] [--decision approved|denied|suggested] [--reason <enum>] [--since YYYY-MM-DD] [--current] [--edit-aggregate] [--as-of YYYY-MM-DD] [--root path] [--json]",
  );
  process.exit(code);
}
