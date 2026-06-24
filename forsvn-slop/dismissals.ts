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

import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

export const SLOP_DISMISSALS_SCHEMA_VERSION = 1;

// 4 columns, fixed order. Keys (rejected by the reader if missing, never written):
// artifact_id, ruleId. Adding a column is a schema_version bump + a migration.
export const SLOP_DISMISSALS_COLUMNS = ["ts", "artifact_id", "ruleId", "surface"] as const;

export type DismissalColumn = (typeof SLOP_DISMISSALS_COLUMNS)[number];

export interface Dismissal {
  ts: string;          // ISO-8601 UTC (verdictTs() format) — stamped by the caller
  artifact_id: string; // frontmatter id, read SERVER-SIDE (KEY — keyless rows are skipped)
  ruleId: string;      // the dismissed antipattern id (KEY)
  surface: string;     // web | cli | tty
}

const DISMISSALS_REL = join(".forsvn", "learning", "slop-dismissals.tsv");

export function slopDismissalsPath(root: string): string {
  return join(root, DISMISSALS_REL);
}

// TSV-safe: no literal tab/newline/CR inside a cell (collapsed to a single space).
function esc(s: string): string {
  return s.replace(/[\t\n\r]+/g, " ").trim();
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
    }
    const row = SLOP_DISMISSALS_COLUMNS.map((c) => esc(String(d[c] ?? ""))).join("\t");
    appendFileSync(path, row + "\n", "utf8"); // ONE append — the wire
    return true;
  } catch (e) {
    console.error(`[slop-dismissals] append failed (best-effort, request unaffected): ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }
}
