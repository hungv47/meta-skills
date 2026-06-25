// dismissals.ts — the single writer of .forsvn/learning/slop-dismissals.tsv (FOR-53 / S4).
//
// When a human clicks "Dismiss" on a suggestion card, the localhost CSRF endpoint
// (forsvn-preview POST /dismiss) appends ONE append-only, schema-versioned row here: the
// override signal FOR-56 / S7 reads to count >=3 dismissals of a rule and flag it for
// revision. This is a DEDICATED ledger, NOT verdicts.tsv — query-verdicts.ts rejects any
// decision_state outside {approved,denied,suggested} (and the enum is locked), so a
// "dismissed" row could never be recorded there. The two halves are one contract: the
// column set below is co-owned with FOR-56's reader.
//
// Mirrors lib/verdicts.ts SHAPE exactly: keyless-safe (skip a row missing artifact_id or
// ruleId, with a one-line stderr warning), header on first write, TSV-escaped cells, ONE
// append, and NEVER throws — a dismissal is fire-and-forget relative to the page, so a
// read-only FS or missing id must never fail the request or the artifact.
//
// Local-first: this file never leaves the machine. It IS durable knowledge (the override
// corpus), so like verdicts.tsv it is TRACKED by git — do NOT gitignore it.

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { normalizeScope, type DismissalScope } from "./lib/dismissal-scope";

// v2 (FOR-56 / S7): added the `scope` column (this-once exception vs rule-is-wrong). The reader
// (lib/rule-dismissals.ts) accepts both v1 (no scope → every row reads 'exception') and v2; and
// appendDismissal migrates a pre-existing v1 store up to v2 on first write (migrateStoreIfStale)
// so a new 'rule-wrong' row is actually counted, not swallowed as 'exception' under a stale header.
export const SLOP_DISMISSALS_SCHEMA_VERSION = 2;

// 5 columns, fixed order. Keys (rejected by the reader if missing, never written):
// artifact_id, ruleId. Adding a column is a schema_version bump + a migration.
export const SLOP_DISMISSALS_COLUMNS = ["ts", "artifact_id", "ruleId", "surface", "scope"] as const;

export type DismissalColumn = (typeof SLOP_DISMISSALS_COLUMNS)[number];

export interface Dismissal {
  ts: string;          // ISO-8601 UTC (verdictTs() format) — stamped by the caller
  artifact_id: string; // frontmatter id, read SERVER-SIDE (KEY — keyless rows are skipped)
  ruleId: string;      // the dismissed antipattern id (KEY)
  surface: string;     // web | cli | tty
  scope: DismissalScope; // 'exception' (legit one-off, NOT counted) | 'rule-wrong' (counted toward revision)
}

const DISMISSALS_REL = join(".forsvn", "learning", "slop-dismissals.tsv");

export function slopDismissalsPath(root: string): string {
  return join(root, DISMISSALS_REL);
}

// TSV-safe: no literal tab/newline/CR inside a cell (collapsed to a single space).
function esc(s: string): string {
  return s.replace(/[\t\n\r]+/g, " ").trim();
}

/** In-place upgrade of a pre-existing store below the current schema version: bump the header,
 *  rewrite the column row to the canonical set, and backfill every existing data row with a
 *  trailing `exception` cell (a v1 row IS an exception — never counted toward a rule revision).
 *  Idempotent (a store already at the current version is a no-op) and additive (v1's columns are
 *  v2's first four, so the canonical column row lines up positionally with the backfilled rows).
 *  Without this, v2 rows appended under a v1 header are read with `scope` at index -1, so EVERY
 *  row — including new `rule-wrong` ones — collapses to `exception` and the FOR-56 / S7
 *  self-correction loop is silently inert on any machine carrying an S4-era ledger. */
function migrateStoreIfStale(path: string): void {
  const lines = readFileSync(path, "utf8").split("\n");
  let h = 0;
  while (h < lines.length && lines[h].trim() === "") h++;
  const versionMatch = (lines[h] ?? "").match(/^#\s*schema_version:\s*(\d+)\s*$/);
  if (!versionMatch) return; // no / unparseable header → leave as-is; the reader surfaces the contract error
  if (Number(versionMatch[1]) >= SLOP_DISMISSALS_SCHEMA_VERSION) return; // already current → no-op
  lines[h] = `# schema_version: ${SLOP_DISMISSALS_SCHEMA_VERSION}`;
  lines[h + 1] = SLOP_DISMISSALS_COLUMNS.join("\t"); // canonical column row (v1 cols are v2's first four)
  for (let n = h + 2; n < lines.length; n++) {
    const raw = lines[n];
    if (raw.trim() === "" || raw.startsWith("#")) continue; // preserve blank / comment lines verbatim
    lines[n] = `${raw}\texception`; // backfill the absent scope cell — a legacy row is never counted
  }
  writeFileSync(path, lines.join("\n"), "utf8");
}

/** Append one dismissal row. Skips (with a one-line stderr warning) a keyless row — one
 *  missing artifact_id / ruleId — and never throws: a dismissal failure must never fail
 *  the page or the artifact. Returns whether a row was written (useful in tests). */
export function appendDismissal(root: string, d: Dismissal): boolean {
  const keys: Array<keyof Dismissal> = ["artifact_id", "ruleId"];
  const missing = keys.filter((k) => !String(d[k] ?? "").trim());
  if (missing.length > 0) {
    console.error(`[slop-dismissals] skipped a keyless row (missing ${missing.join(", ")}) — not written.`);
    return false;
  }
  try {
    const path = slopDismissalsPath(root);
    if (!existsSync(path)) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(
        path,
        `# schema_version: ${SLOP_DISMISSALS_SCHEMA_VERSION}\n${SLOP_DISMISSALS_COLUMNS.join("\t")}\n`,
        "utf8",
      );
    } else {
      migrateStoreIfStale(path); // bring a pre-existing v1 store up to v2 BEFORE appending a v2 row
    }
    // scope is fail-safe-normalized so an out-of-enum value can never be written as a counted signal.
    const row = SLOP_DISMISSALS_COLUMNS.map((c) => esc(c === "scope" ? normalizeScope(d.scope) : String(d[c] ?? ""))).join("\t");
    appendFileSync(path, row + "\n", "utf8"); // ONE append — the wire
    return true;
  } catch (e) {
    console.error(`[slop-dismissals] append failed (best-effort, request unaffected): ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }
}
