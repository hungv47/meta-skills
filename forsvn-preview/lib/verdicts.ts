// verdicts.ts — the single writer of .forsvn/learning/verdicts.tsv (C2/L1).
//
// Every human review decision appends one append-only, schema-versioned row here:
// the verdict as structured, queryable training data. This is the SEED CORN of
// the self-improving loop — WS-L (L3 dashboard, L4 shrinkage recall, L5 telemetry)
// is the ONLY reader, via lib/query-verdicts.ts. Capture before analysis: build the
// producer first; a dashboard over an empty table is the classic inversion.
//
// Contract + schema: skills/references/verdicts-data.md.
//
// Local-first: this file never leaves the machine (no telemetry, no network). The
// only sanctioned egress is `forsvn learnings export` (L6, lib/portable-ledger.ts):
// it redacts the `note` column and emits a portable bundle the operator carries by
// hand; the hosted mirror that would sync it is dormant (gated G3, OFF). The egress
// is opt-in tooling, never on the decision path. verdicts.tsv IS the corpus and is
// TRACKED by git (it is durable knowledge, like the rest of .forsvn/) — do NOT
// gitignore it. Contrast: the C4 .forsvn/inbox signal is transient and IS gitignored.
//
// Fire-and-forget relative to the decision: the canonical frontmatter write has
// already happened by the time appendVerdict runs. A failure here (read-only FS,
// missing id) logs one line to stderr and NEVER throws upward or rolls back the
// decision. The decision is sacred; the log is best-effort.

import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

export const VERDICTS_SCHEMA_VERSION = 2;

// 12 columns, fixed order. Keys (rejected by the reader if missing, never written):
// artifact_id, skill, decision_state. `dimensions_flagged` is reserved for L5.
// `body_sha` + `edit_classes` are the L2 edit-delta capture (sha256: of the
// produced body; a `;`-joined subset of the edit-type enum, empty = clean approve).
// Adding a column is a schema_version bump + a _dev/ migration
// (_dev/migrate-verdicts-v1-to-v2.ts).
export const VERDICTS_COLUMNS = [
  "ts", "artifact_id", "skill", "stack", "decision_state",
  "decision_reason", "dimensions_flagged", "note", "review_latency_ms", "surface",
  "body_sha", "edit_classes",
] as const;

export type VerdictColumn = (typeof VERDICTS_COLUMNS)[number];

export interface Verdict {
  ts: string;                 // ISO-8601 UTC, e.g. 2026-06-20T10:14:02Z
  artifact_id: string;        // frontmatter id (KEY — keyless rows are skipped)
  skill: string;              // producing skill (KEY)
  stack: string;              // meta | research | marketing | product
  decision_state: string;     // approved | denied | suggested (KEY)
  decision_reason: string;    // C1 enum value or "" (only on a non-approve)
  dimensions_flagged: string; // comma-joined critic dimensions or "" (reserved, L5)
  note: string;               // one-line free comment, TSV-escaped, or ""
  review_latency_ms: string;  // integer ms open→decide, or "" if unknown
  surface: string;            // cli | tty | web | proof
  // L2 edit-delta capture (optional — surfaces that lack the produced/edited bodies
  // write ""; the column is always present). See lib/edit-delta.ts.
  body_sha?: string;          // sha256:<hex> of the produced body, or ""
  edit_classes?: string;      // ;-joined edit-type enum subset, or "" (clean approve)
}

const VERDICTS_REL = join(".forsvn", "learning", "verdicts.tsv");

export function verdictsPath(root: string): string {
  return join(root, VERDICTS_REL);
}

// TSV-safe: no literal tab/newline/CR inside a cell (collapsed to a single space).
function esc(s: string): string {
  return s.replace(/[\t\n\r]+/g, " ").trim();
}

/** Append one verdict row. Skips (with a one-line stderr warning) a keyless row —
 *  one missing artifact_id / skill / decision_state — and never throws: a verdict
 *  failure must never fail or roll back the recorded decision. Returns whether a
 *  row was written (useful in tests; callers ignore it). */
export function appendVerdict(root: string, v: Verdict): boolean {
  const keys: Array<keyof Verdict> = ["artifact_id", "skill", "decision_state"];
  const missing = keys.filter((k) => !String(v[k] ?? "").trim());
  if (missing.length > 0) {
    console.error(`[verdicts] skipped a keyless row (missing ${missing.join(", ")}) — not written.`);
    return false;
  }
  try {
    const path = verdictsPath(root);
    if (!existsSync(path)) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(
        path,
        `# schema_version: ${VERDICTS_SCHEMA_VERSION}\n${VERDICTS_COLUMNS.join("\t")}\n`,
        "utf8",
      );
    }
    const row = VERDICTS_COLUMNS.map((c) => esc(String(v[c] ?? ""))).join("\t");
    appendFileSync(path, row + "\n", "utf8"); // ONE append — the wire
    return true;
  } catch (e) {
    console.error(`[verdicts] append failed (decision already recorded, log skipped): ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }
}

/** Current UTC timestamp as ISO-8601 with seconds precision (no millis): the `ts`
 *  column format. Kept here so every producer stamps it identically. */
export function verdictTs(now: Date = new Date()): string {
  return now.toISOString().replace(/\.\d+Z$/, "Z");
}
