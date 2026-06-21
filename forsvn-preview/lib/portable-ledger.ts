// portable-ledger — L6: a PORTABLE learning ledger. Export/import of the local
// learning corpus (verdicts + priors) so an operator can carry their learning
// between machines — by hand, over a USB stick, through a private git repo. The
// bundle is a single self-describing JSON file the operator owns end-to-end.
//
// Contract + the store it carries: references/verdicts-data.md (C2/L1 verdicts
// store) + the forward-compatible L3 priors.json slot. This module is the only
// implementation of the verdicts-store EGRESS the contract names:
//   "The only sanctioned egress is the future `forsvn learnings export` (L6,
//    gated G3), which redacts."
//
// THREE HARD INVARIANTS (do not relax — tests pin them):
//   1. LOCAL-FIRST. Export/import are pure file I/O on the operator's own tree.
//      There is NO network call here — not behind a flag, not ever. Carrying the
//      bundle anywhere is a manual, human-driven act. (The dormant hosted-mirror
//      is a separate, OFF skeleton — lib/hosted-learnings.ts.)
//   2. NEVER BLOCKS. This is opt-in tooling the operator runs deliberately; it is
//      not on the review decision path. It reads/writes and reports — it does not
//      gate any skill run or any decision.
//   3. REDACTS BY DEFAULT. The one free-text PII surface in a verdict row is the
//      operator's `note`. Export drops it to "" unless the operator opts in with
//      `includeNotes`. The carried corpus is the structured signal (skill, stack,
//      decision, reason, edit-classes), not the operator's private prose.
//
// Round-trip identity (the L6 acceptance property): for a bundle B produced by
// `exportLedger`, `importLedger` into a fresh root followed by `exportLedger`
// again yields a bundle deep-equal to B. Export is idempotent and canonical, so
// export∘import is the identity on bundles.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { VERDICTS_COLUMNS, VERDICTS_SCHEMA_VERSION, verdictsPath } from "./verdicts";

// --- the bundle envelope ----------------------------------------------------

/** The portable-bundle envelope schema version. Bumped only when the envelope
 *  shape changes (NOT when an inner store's schema_version bumps — those are
 *  carried opaquely and validated against their own contract). */
export const PORTABLE_FORMAT = "forsvn-learnings";
export const PORTABLE_FORMAT_VERSION = 1;

/** Relative path of the forward-compatible L3 priors store (owned by FOR-23). L6
 *  carries it opaquely so a bundle round-trips whether or not L3 has landed yet. */
export const PRIORS_REL = join(".forsvn", "learning", "priors.json");

export function priorsPath(root: string): string {
  return join(root, PRIORS_REL);
}

/** One verdict row as carried in the bundle: the 12 fixed columns as a record.
 *  Carried structurally (not as a TSV line) so the bundle is schema-legible and a
 *  re-export re-serializes canonically — that is what makes the round-trip exact. */
export type PortableVerdictRow = Record<(typeof VERDICTS_COLUMNS)[number], string>;

export interface PortableLedger {
  format: typeof PORTABLE_FORMAT;
  format_version: number;
  /** Stamped at export, informational. Excluded from round-trip identity (see
   *  canonicalize) so re-export at a different time still equals the original. */
  exported_at: string;
  /** True when `note` was carried; false when redacted (the default). */
  notes_included: boolean;
  verdicts: {
    schema_version: number; // the carried store's own schema_version
    columns: readonly string[];
    rows: PortableVerdictRow[];
  };
  /** The L3 priors store, carried opaquely, or null when absent. Forward-compat:
   *  L6 does not know priors' shape — it round-trips whatever JSON it finds. */
  priors: unknown | null;
}

// --- read the local stores --------------------------------------------------

/** Parsed verdicts store: the schema_version + structured rows, keyless rows
 *  dropped (a keyless row is never valid corpus — same rule as the reader). */
interface ParsedVerdicts {
  schemaVersion: number;
  rows: PortableVerdictRow[];
}

/** Read + validate the verdicts.tsv store. Throws a clear contract error on a
 *  malformed store (bad/missing schema_version header or column header) — export
 *  refuses to carry a store it cannot vouch for. An ABSENT store is the normal
 *  first-run state and yields zero rows (not an error). */
export function readVerdictsStore(root: string): ParsedVerdicts {
  const path = verdictsPath(root);
  if (!existsSync(path)) return { schemaVersion: VERDICTS_SCHEMA_VERSION, rows: [] };

  const lines = readFileSync(path, "utf8").split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;

  const headerLine = lines[i] ?? "";
  const vMatch = headerLine.match(/^#\s*schema_version:\s*(\d+)\s*$/);
  if (!vMatch) {
    throw new PortableLedgerError(
      `verdicts store is missing its schema_version header — refusing to export an unversioned store.\n` +
        `Contract: references/verdicts-data.md.`,
    );
  }
  const schemaVersion = Number(vMatch[1]);
  if (schemaVersion !== VERDICTS_SCHEMA_VERSION) {
    throw new PortableLedgerError(
      `verdicts store is schema_version ${schemaVersion}; this exporter carries version ${VERDICTS_SCHEMA_VERSION}.\n` +
        `Migrate first (_dev/migrate-verdicts-v1-to-v2.ts) — never hand-rewrite the store.`,
    );
  }

  const columnLine = lines[i + 1] ?? "";
  if (columnLine !== VERDICTS_COLUMNS.join("\t")) {
    throw new PortableLedgerError(
      `verdicts store column header does not match the v${VERDICTS_SCHEMA_VERSION} contract.\n` +
        `Expected: ${VERDICTS_COLUMNS.join("\\t")}\nGot:      ${columnLine.split("\t").join("\\t")}`,
    );
  }

  const rows: PortableVerdictRow[] = [];
  for (let n = i + 2; n < lines.length; n++) {
    const raw = lines[n];
    if (raw.trim() === "" || raw.startsWith("#")) continue;
    const parts = raw.split("\t");
    const row = Object.fromEntries(
      VERDICTS_COLUMNS.map((c, idx) => [c, (parts[idx] ?? "").trim()]),
    ) as PortableVerdictRow;
    // Keyless rows are not corpus — drop them (same contract as query-verdicts).
    if (!row.artifact_id || !row.skill || !row.decision_state) continue;
    rows.push(row);
  }
  return { schemaVersion, rows };
}

/** Read the opaque L3 priors store, or null when absent. A malformed priors.json
 *  is a contract error (we will not carry corrupt JSON). */
export function readPriorsStore(root: string): unknown | null {
  const path = priorsPath(root);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as unknown;
  } catch (e) {
    throw new PortableLedgerError(
      `priors store at ${PRIORS_REL} is not valid JSON — refusing to export a corrupt store: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
  }
}

// --- export -----------------------------------------------------------------

export interface ExportOptions {
  /** Carry the operator's free-text `note` column. Default false (redacted). */
  includeNotes?: boolean;
  /** Fixed timestamp for the `exported_at` stamp (tests). Default: now. */
  now?: Date;
}

/**
 * Build a portable bundle from the local stores under `root`. Pure: reads the two
 * stores and produces the envelope. No network, no mutation of the source tree.
 * Redacts `note` to "" unless `includeNotes` is set.
 */
export function exportLedger(root: string, opts: ExportOptions = {}): PortableLedger {
  const includeNotes = opts.includeNotes === true;
  const { schemaVersion, rows } = readVerdictsStore(root);
  const priors = readPriorsStore(root);

  const carried: PortableVerdictRow[] = rows.map((r) => {
    const row = { ...r };
    if (!includeNotes) row.note = ""; // the one free-text PII surface
    return row;
  });

  return {
    format: PORTABLE_FORMAT,
    format_version: PORTABLE_FORMAT_VERSION,
    exported_at: (opts.now ?? new Date()).toISOString().replace(/\.\d+Z$/, "Z"),
    notes_included: includeNotes,
    verdicts: { schema_version: schemaVersion, columns: VERDICTS_COLUMNS, rows: carried },
    priors,
  };
}

// --- import -----------------------------------------------------------------

export interface ImportResult {
  verdictsWritten: number;
  priorsWritten: boolean;
}

/**
 * Materialize a bundle into the stores under `targetRoot`. Validates the envelope
 * (format, version, inner schema_version, column set) and writes:
 *   - verdicts.tsv — the schema header + column header + one TSV row per carried
 *     verdict, byte-identical to how lib/verdicts.ts serializes a fresh store.
 *   - priors.json — the opaque priors blob, only when the bundle carried one.
 * Refuses to clobber a non-empty existing verdicts store unless `overwrite`.
 */
export function importLedger(
  targetRoot: string,
  bundle: unknown,
  opts: { overwrite?: boolean } = {},
): ImportResult {
  const b = assertBundle(bundle);

  const verdictsTarget = verdictsPath(targetRoot);
  if (existsSync(verdictsTarget) && !opts.overwrite) {
    const existing = readVerdictsStore(targetRoot);
    if (existing.rows.length > 0) {
      throw new PortableLedgerError(
        `a verdicts store already exists at ${verdictsTarget} with ${existing.rows.length} row(s).\n` +
          `Importing would replace the local corpus. Re-run with overwrite to proceed, or import into a fresh root.`,
      );
    }
  }

  // Serialize verdicts exactly as lib/verdicts.ts would for a fresh store: the
  // schema header, the column header, then one TSV line per row in column order.
  const out: string[] = [
    `# schema_version: ${b.verdicts.schema_version}`,
    VERDICTS_COLUMNS.join("\t"),
  ];
  for (const row of b.verdicts.rows) {
    out.push(VERDICTS_COLUMNS.map((c) => esc(String(row[c] ?? ""))).join("\t"));
  }
  mkdirSync(dirname(verdictsTarget), { recursive: true });
  writeFileSync(verdictsTarget, out.join("\n") + "\n", "utf8");

  let priorsWritten = false;
  if (b.priors !== null && b.priors !== undefined) {
    const priorsTarget = priorsPath(targetRoot);
    mkdirSync(dirname(priorsTarget), { recursive: true });
    writeFileSync(priorsTarget, JSON.stringify(b.priors, null, 2) + "\n", "utf8");
    priorsWritten = true;
  }

  return { verdictsWritten: b.verdicts.rows.length, priorsWritten };
}

// --- round-trip canonical form ----------------------------------------------

/**
 * The canonical, comparison-stable form of a bundle: strips the informational
 * `exported_at` stamp so a re-export at a different time still compares equal.
 * The round-trip identity (export → import → export) is defined over this form.
 */
export function canonicalize(bundle: PortableLedger): Omit<PortableLedger, "exported_at"> {
  const { exported_at: _drop, ...rest } = bundle;
  return {
    ...rest,
    verdicts: {
      schema_version: rest.verdicts.schema_version,
      columns: [...rest.verdicts.columns],
      rows: rest.verdicts.rows.map((r) => ({ ...r })),
    },
  };
}

// --- validation -------------------------------------------------------------

export class PortableLedgerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortableLedgerError";
  }
}

/** Validate an untrusted value is a portable bundle this version can import. */
export function assertBundle(value: unknown): PortableLedger {
  if (typeof value !== "object" || value === null) {
    throw new PortableLedgerError("bundle is not an object.");
  }
  const b = value as Record<string, unknown>;
  if (b.format !== PORTABLE_FORMAT) {
    throw new PortableLedgerError(`bundle.format is ${JSON.stringify(b.format)}; expected ${JSON.stringify(PORTABLE_FORMAT)}.`);
  }
  if (b.format_version !== PORTABLE_FORMAT_VERSION) {
    throw new PortableLedgerError(
      `bundle.format_version is ${JSON.stringify(b.format_version)}; this importer reads version ${PORTABLE_FORMAT_VERSION}.`,
    );
  }
  const v = b.verdicts as Record<string, unknown> | undefined;
  if (!v || typeof v !== "object") throw new PortableLedgerError("bundle.verdicts is missing.");
  if (v.schema_version !== VERDICTS_SCHEMA_VERSION) {
    throw new PortableLedgerError(
      `bundle carries verdicts schema_version ${JSON.stringify(v.schema_version)}; this importer writes version ${VERDICTS_SCHEMA_VERSION}.`,
    );
  }
  if (!Array.isArray(v.columns) || v.columns.join("\t") !== VERDICTS_COLUMNS.join("\t")) {
    throw new PortableLedgerError("bundle.verdicts.columns does not match the verdicts v2 contract.");
  }
  if (!Array.isArray(v.rows)) throw new PortableLedgerError("bundle.verdicts.rows is not an array.");
  for (const [idx, r] of (v.rows as unknown[]).entries()) {
    if (typeof r !== "object" || r === null) throw new PortableLedgerError(`bundle.verdicts.rows[${idx}] is not an object.`);
    const row = r as Record<string, unknown>;
    for (const key of ["artifact_id", "skill", "decision_state"] as const) {
      if (!String(row[key] ?? "").trim()) {
        throw new PortableLedgerError(`bundle.verdicts.rows[${idx}] is keyless (missing ${key}) — corpus rows must have all keys.`);
      }
    }
  }
  return value as PortableLedger;
}

// TSV-safe: no literal tab/newline/CR inside a cell (collapsed to a single
// space). Identical to lib/verdicts.ts esc — kept here so the import serializer
// produces a byte-identical store to a fresh local one.
function esc(s: string): string {
  return s.replace(/[\t\n\r]+/g, " ").trim();
}
