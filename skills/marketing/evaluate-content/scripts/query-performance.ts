#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root.
// query-performance — the single read path for the `.forsvn/performance/` channel
// store. Contract: skills/references/performance-data.md (store layout, snapshot
// key, decay window, three-state read contract, lane-reachability rationale).
//
// Wired in U7 (2026-06-13): registered in SUPPORT_SCRIPTS (sync-skill-support.mjs)
// and mirrored into each consuming skill's `scripts/` as `query-performance.ts`.
// The `_dev/` original is .publicignore-fenced; only the per-skill mirrors ship.
//
// What it owns (producers never re-derive any of this):
//   - schema_version header validation (missing/unknown → actionable error)
//   - keyless-row rejection (missing platform / post_id / measurement_window —
//     rejected rows never count toward sufficiency, never appear in results)
//   - latest-imported_at-wins dedupe on the full snapshot key
//   - the 90-day decay window (measurement_window end vs --asof)
//   - the empty / sparse / sufficient state (floor: --floor > thresholds.json
//     `sufficient_floor` > default 8) — KEPT as a human-readable bucket label
//   - the L4 shrinkage weight = n/(n+k) emitted alongside the state. `weight` is
//     the value producers actually blend with (own-data vs platform prior); the
//     3-state label stays as a legibility bucket the recall blocks cite. k: --k >
//     thresholds.json `shrinkage_k` > default 8. The formula lives in ONE place
//     (_dev/shrinkage.ts) — shared with the L3 priors.json writer.
//   - top/bottom N ranking with format / placement / metric query filters
//     (filters narrow rows; the state stays channel-level — when the filtered
//     subset falls below the floor it is flagged as anecdote-weight)
//
// Usage:
//   bun _dev/query-performance.ts <platform> [--top N] [--bottom N]
//     [--format text|image|carousel|video|…] [--placement paid|organic]
//     [--metric name] [--asof YYYY-MM-DD] [--floor N] [--k N] [--root path] [--json]
//
// Exit codes: 0 = query answered (any state, including empty store);
//             1 = contract violation (malformed store/thresholds) or bad usage.

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { DEFAULT_SHRINKAGE_K, shrinkageWeightRounded } from "./shrinkage";

const SCHEMA_VERSION = 1;
const DECAY_WINDOW_DAYS = 90;
const DEFAULT_FLOOR = 8;
// thresholds.json — the single per-project tuning file. v1 carried exactly one
// key (`sufficient_floor`). L4 extends it to an OPTIONAL second key `shrinkage_k`
// (the prior strength of weight = n/(n+k)); both keys are integers ≥ 1, both
// optional, no other key permitted. Absent file or absent key → the defaults.
const ALLOWED_THRESHOLD_KEYS = new Set(["sufficient_floor", "shrinkage_k"]);
const COLUMNS = [
  "platform", "post_id", "measurement_window", "imported_at", "ledger_id",
  "artifact_id", "format", "placement", "metric", "value", "baseline", "reach",
  "likes", "saves", "shares", "comments", "attribution_confidence",
  "comparability", "source", "notes",
] as const;
const WINDOW_RE = /^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Row = Record<(typeof COLUMNS)[number], string> & { line: number };
type Rejected = { line: number; reason: string };
type State = "empty" | "sparse" | "sufficient";

// --- args -------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) usage(args.length === 0 ? 1 : 0);
const JSON_OUT = popFlag("--json");
const platform = args.shift()!;
if (platform.startsWith("--")) usage(1);
const opts: Record<string, string> = {};
while (args.length) {
  const key = args.shift()!;
  if (!key.startsWith("--")) usage(1, `Unexpected argument ${JSON.stringify(key)}`);
  const val = args.shift();
  if (val === undefined) usage(1, `Missing value for ${key}`);
  opts[key.slice(2)] = val;
}
const ROOT = resolve(opts.root ?? process.cwd());
const asof = opts.asof ?? new Date().toISOString().slice(0, 10);
if (!DATE_RE.test(asof)) usage(1, `Invalid --asof ${JSON.stringify(asof)} — expected YYYY-MM-DD.`);
const topN = intOpt("top");
const bottomN = intOpt("bottom");
const floor = resolveFloor();
const shrinkageK = resolveShrinkageK();

// --- read store -------------------------------------------------------------
const storeDir = join(ROOT, ".forsvn", "performance");
const storePath = join(storeDir, `${platform}.tsv`);

if (!existsSync(storePath)) {
  // Typed empty result — first-run is a normal state, not an error.
  emit({ state: "empty", eligibleRows: [], filtered: [], rejected: [], superseded: 0, storeExists: false });
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
    `Expected first line: "# schema_version: ${SCHEMA_VERSION}"\n` +
    `The store contract is skills/references/performance-data.md — add the header (and the column header line) before querying; do not guess at unversioned data.`,
  );
}
const fileVersion = Number(versionMatch![1]);
if (fileVersion !== SCHEMA_VERSION) {
  contractFail(
    `${rel(storePath)} has schema_version ${fileVersion}; this helper reads version ${SCHEMA_VERSION}.\n` +
    `Migrations run via a _dev/ migration script only (performance-data.md) — never hand-rewrite the store.`,
  );
}
const columnLine = lines[i + 1] ?? "";
const cols = columnLine.split("\t");
if (cols.join("\t") !== COLUMNS.join("\t")) {
  contractFail(
    `${rel(storePath)} column header does not match the v${SCHEMA_VERSION} contract.\n` +
    `Expected: ${COLUMNS.join("\\t")}\n` +
    `Got:      ${cols.join("\\t")}`,
  );
}

const rows: Row[] = [];
const rejected: Rejected[] = [];
for (let n = i + 2; n < lines.length; n++) {
  const raw = lines[n];
  if (raw.trim() === "" || raw.startsWith("#")) continue;
  const parts = raw.split("\t");
  const row = Object.fromEntries(COLUMNS.map((c, idx) => [c, (parts[idx] ?? "").trim()])) as Row;
  row.line = n + 1;
  // Keyless rows never count toward sufficiency and never appear in results.
  const missing = (["platform", "post_id", "measurement_window"] as const).filter((k) => row[k] === "");
  if (missing.length) {
    rejected.push({ line: row.line, reason: `missing key component(s): ${missing.join(", ")}` });
    continue;
  }
  if (row.platform !== platform) {
    rejected.push({ line: row.line, reason: `platform "${row.platform}" does not match store file "${platform}.tsv"` });
    continue;
  }
  const w = row.measurement_window.match(WINDOW_RE);
  if (!w) {
    rejected.push({ line: row.line, reason: `malformed measurement_window "${row.measurement_window}" — expected YYYY-MM-DD..YYYY-MM-DD` });
    continue;
  }
  rows.push(row);
}

// --- latest-imported_at wins on full-key collision ---------------------------
const byKey = new Map<string, Row>();
let superseded = 0;
for (const row of rows) {
  const key = `${row.platform}\t${row.post_id}\t${row.measurement_window}`;
  const prev = byKey.get(key);
  if (!prev) { byKey.set(key, row); continue; }
  superseded++;
  // ISO-8601 strings compare lexicographically; tie → later line wins.
  if (row.imported_at >= prev.imported_at) byKey.set(key, row);
}

// --- decay window + comparability → eligible rows ----------------------------
const cutoff = shiftDate(asof, -DECAY_WINDOW_DAYS);
const eligibleRows = [...byKey.values()].filter((row) => {
  const end = row.measurement_window.slice(12); // after "YYYY-MM-DD.."
  return end >= cutoff && end <= asof && row.comparability !== "not_comparable";
});

// --- filters (narrow rows; the state stays channel-level) --------------------
let filtered = eligibleRows;
if (opts.format) filtered = filtered.filter((r) => r.format === opts.format);
if (opts.placement) filtered = filtered.filter((r) => r.placement === opts.placement);
if (opts.metric) filtered = filtered.filter((r) => r.metric === opts.metric);

emit({ state: stateOf(eligibleRows.length), eligibleRows, filtered, rejected, superseded, storeExists: true });
process.exit(0);

// --- helpers ------------------------------------------------------------------
function stateOf(count: number): State {
  if (count === 0) return "empty";
  return count >= floor ? "sufficient" : "sparse";
}

function emit(r: { state: State; eligibleRows: Row[]; filtered: Row[]; rejected: Rejected[]; superseded: number; storeExists: boolean }): void {
  const ranked = [...r.filtered].sort((a, b) => numeric(b.value) - numeric(a.value));
  const top = topN !== undefined || bottomN === undefined ? ranked.slice(0, topN ?? 5) : [];
  const bottom = bottomN !== undefined ? ranked.slice(-bottomN).reverse() : [];
  const filteredBelowFloor = r.filtered.length < floor;
  // L4 — continuous shrinkage weight over the channel's eligible rows (own-data
  // vs platform prior). The 3-state label above stays as the legibility bucket;
  // `weight` is what producers blend with. Floors are non-voteable and excluded
  // upstream (a floor: true dimension ignores weight — performance-data.md §157).
  const weight = shrinkageWeightRounded(r.eligibleRows.length, shrinkageK);
  const result = {
    platform,
    state: r.state,
    floor,
    shrinkage_k: shrinkageK,
    weight,
    decay_window_days: DECAY_WINDOW_DAYS,
    asof,
    store_exists: r.storeExists,
    eligible_rows: r.eligibleRows.length,
    filters: { format: opts.format ?? null, placement: opts.placement ?? null, metric: opts.metric ?? null },
    filtered_rows: r.filtered.length,
    filtered_below_floor: filteredBelowFloor,
    top: top.map(publicRow),
    bottom: bottom.map(publicRow),
    superseded_rows: r.superseded,
    rejected_rows: r.rejected,
    guidance: guidance(r.state, filteredBelowFloor, r.eligibleRows.length, weight),
  };
  if (JSON_OUT) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(`query-performance: ${platform} — state: ${r.state} (${r.eligibleRows.length} eligible rows, floor ${floor}, k ${shrinkageK}, weight ${weight}, ${DECAY_WINDOW_DAYS}d window ending ${asof})`);
  if (!r.storeExists) console.log(`  no store file at ${rel(storePath)} — first-run empty state is normal.`);
  console.log(`  guidance: ${result.guidance}`);
  const activeFilters = Object.entries(result.filters).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`);
  if (activeFilters.length) {
    console.log(`  filters: ${activeFilters.join(" ")} → ${r.filtered.length} rows${filteredBelowFloor ? " (below floor — anecdote weight for the filtered ranking)" : ""}`);
  }
  for (const [label, set] of [["top", top], ["bottom", bottom]] as const) {
    if (set.length === 0) continue;
    console.log(`  ${label} ${set.length} by value:`);
    for (const row of set) {
      console.log(`    ${row.post_id}  ${row.measurement_window}  ${row.metric}=${row.value}  format=${row.format} placement=${row.placement} attribution=${row.attribution_confidence}`);
    }
  }
  if (r.superseded) console.log(`  superseded rows (full-key collisions, older imported_at): ${r.superseded}`);
  for (const rej of r.rejected) console.log(`  rejected line ${rej.line}: ${rej.reason}`);
}

function guidance(state: State, filteredBelowFloor: boolean, n: number, weight: number): string {
  // Weight-aware blend rule: own-data weight w, prior weight (1-w). Below the floor
  // (weight < 0.5) the own-data finding is anecdote-weight. Floors stay non-voteable.
  const tail = ` blend account-specific direction at own-data weight ${weight} (n=${n}, k=${shrinkageK}); floors non-voteable; name one open question.`;
  if (state === "empty") return `no own data yet (weight 0) — platform-intelligence priors only; say so in the output.${tail}`;
  if (state === "sparse") return `own data is anecdote-weight (weight ${weight} < 0.5) — it may color examples, never override priors.${tail}`;
  return filteredBelowFloor
    ? `channel is sufficient (weight ${weight}), but the filtered subset is below the floor — treat the filtered ranking as anecdote.${tail}`
    : `own data wins account-specific questions at weight ${weight}; priors keep platform-mechanics questions (performance-data.md § Precedence).${tail}`;
}

function publicRow(row: Row): Record<string, string> {
  const { line: _line, ...rest } = row;
  return rest;
}

function numeric(value: string): number {
  const n = Number.parseFloat(value.replace(/[%,$\s]/g, ""));
  return Number.isFinite(n) ? n : Number.NEGATIVE_INFINITY;
}

function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function readThresholds(): Record<string, unknown> | null {
  const thresholdsPath = join(ROOT, ".forsvn", "performance", "thresholds.json");
  if (!existsSync(thresholdsPath)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(thresholdsPath, "utf8"));
  } catch {
    contractFail(`${rel(thresholdsPath)} is not valid JSON. Supported keys: {"sufficient_floor": <int ≥ 1>, "shrinkage_k": <int ≥ 1>} (both optional).`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    contractFail(`${rel(thresholdsPath)} must be a JSON object with optional keys sufficient_floor / shrinkage_k.`);
  }
  const obj = parsed as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!ALLOWED_THRESHOLD_KEYS.has(key)) {
      contractFail(`${rel(thresholdsPath)} has unknown key ${JSON.stringify(key)}. Only sufficient_floor and shrinkage_k are supported (performance-data.md § Read Contract).`);
    }
    if (!Number.isInteger(obj[key]) || (obj[key] as number) < 1) {
      contractFail(`${rel(thresholdsPath)} key ${JSON.stringify(key)} must be an integer ≥ 1.`);
    }
  }
  return obj;
}

function resolveFloor(): number {
  if (opts.floor !== undefined) {
    const n = Number(opts.floor);
    if (!Number.isInteger(n) || n < 1) usage(1, `Invalid --floor ${JSON.stringify(opts.floor)} — expected integer ≥ 1.`);
    return n;
  }
  const obj = readThresholds();
  return obj && "sufficient_floor" in obj ? (obj.sufficient_floor as number) : DEFAULT_FLOOR;
}

function resolveShrinkageK(): number {
  if (opts.k !== undefined) {
    const n = Number(opts.k);
    if (!Number.isInteger(n) || n < 1) usage(1, `Invalid --k ${JSON.stringify(opts.k)} — expected integer ≥ 1.`);
    return n;
  }
  const obj = readThresholds();
  return obj && "shrinkage_k" in obj ? (obj.shrinkage_k as number) : DEFAULT_SHRINKAGE_K;
}

function intOpt(name: string): number | undefined {
  if (opts[name] === undefined) return undefined;
  const n = Number(opts[name]);
  if (!Number.isInteger(n) || n < 1) usage(1, `Invalid --${name} ${JSON.stringify(opts[name])} — expected integer ≥ 1.`);
  return n;
}

function popFlag(flag: string): boolean {
  const idx = args.indexOf(flag);
  if (idx === -1) return false;
  args.splice(idx, 1);
  return true;
}

function rel(p: string): string {
  return p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p;
}

function contractFail(message: string): never {
  console.error(`query-performance: ${message}`);
  process.exit(1);
}

function usage(code: number, message?: string): never {
  if (message) console.error(`query-performance: ${message}`);
  console.error(
    "Usage: bun _dev/query-performance.ts <platform> [--top N] [--bottom N] [--format f] [--placement paid|organic] [--metric name] [--asof YYYY-MM-DD] [--floor N] [--k N] [--root path] [--json]",
  );
  process.exit(code);
}
