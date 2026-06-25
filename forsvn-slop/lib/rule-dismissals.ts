// rule-dismissals.ts — the canonical READER + aggregator over the dedicated slop override
// ledger .forsvn/learning/slop-dismissals.tsv (FOR-56 / S7). The detector's self-correction
// loop: count rule-wrong dismissals per ruleId and auto-FLAG a mis-firing rule for a human to
// revise — it NEVER edits, disables, or re-weights the rule (detect != fix; human-owned).
//
// SINGLE reader of THIS store, mirroring query-verdicts.ts's discipline but pointed at the slop
// ledger (NOT verdicts.tsv — a "dismissed" row could never live there; the decision_state enum
// rejects it). Clones the validation pattern (schema-version header, keyless-row rejection,
// typed-empty on an absent store) from forsvn-preview/lib/query-verdicts.ts:81-126.
//
// dismissals.ts (FOR-53) is the SOLE producer; this is the SOLE reader. The `scope` column is
// co-owned: dismissals.ts writes it (schema_version 2), this reader honours it. A v1 store
// (no scope column) is read with every row defaulting to 'exception' (harmless — nothing
// auto-flags), so an old ledger degrades safely rather than contract-failing.

import { existsSync, readFileSync } from "node:fs";
// The ONE shrinkage-weight formula n/(n+k) (L4). query-verdicts.ts is the other importer; never
// re-derive the arithmetic. A thin rule (n<k) is surfaced but its signal is explicitly weak.
import { shrinkageWeightRounded } from "../../_dev/shrinkage";
import { normalizeScope, type DismissalScope } from "./dismissal-scope";
import { SLOP_DISMISSALS_SCHEMA_VERSION, slopDismissalsPath } from "../dismissals";

export const WINDOW_DAYS = 90; // trailing window, matches query-verdicts / L2 / skill-health
// The override-ladder floor — NEVER lower below 3 (1–2 dismissals are noise; mirrors
// skill-health.ts DENY_THRESHOLD). Distinct-artifact span is ALWAYS additionally required so one
// contentious artifact re-dismissed N times can never auto-flag either tier.
export const STABLE_THRESHOLD = 3;
export const STABLE_ARTIFACTS = 3;
export const TREND_THRESHOLD = 5; // a trend rule (meme/saturation) is stricter-to-trip
export const TREND_ARTIFACTS = 4;

export type Volatility = "stable" | "trend";

export interface DismissalRow {
  ts: string;
  artifact_id: string;
  ruleId: string;
  surface: string;
  scope: DismissalScope;
  line: number;
}

export type RejectedRow = { line: number; reason: string };
export type ParseState = "empty" | "answered";

export interface ParseResult {
  state: ParseState;
  storeExists: boolean;
  rows: DismissalRow[];
  rejected: RejectedRow[];
}

/** A contract violation in the store itself (bad header / missing key column). The CLI maps
 *  this to exit 1; an absent store is NOT this — it is the normal typed-empty first-run state. */
export class DismissalContractError extends Error {}

const REQUIRED_KEY_COLUMNS = ["ts", "artifact_id", "ruleId"] as const;

/**
 * Parse the slop-dismissals.tsv text. Accepts schema_version 1 (no `scope` column → every row
 * reads 'exception') AND 2 (the co-owned `scope` column present). Rejects keyless rows (missing
 * artifact_id | ruleId) into `rejected` rather than counting them. Throws DismissalContractError
 * on a missing/unparseable header, an unknown version, or a column header missing a required key.
 */
export function parseDismissals(text: string): ParseResult {
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;

  const headerLine = lines[i] ?? "";
  const versionMatch = headerLine.match(/^#\s*schema_version:\s*(\d+)\s*$/);
  if (!versionMatch) {
    throw new DismissalContractError(
      `slop-dismissals.tsv is missing the schema_version header ` +
      `(expected first line "# schema_version: ${SLOP_DISMISSALS_SCHEMA_VERSION}").`,
    );
  }
  const fileVersion = Number(versionMatch[1]);
  if (fileVersion !== 1 && fileVersion !== 2) {
    throw new DismissalContractError(
      `slop-dismissals.tsv has schema_version ${fileVersion}; this reader understands 1 or 2.`,
    );
  }

  const columns = (lines[i + 1] ?? "").split("\t").map((c) => c.trim());
  const missingKeyCols = REQUIRED_KEY_COLUMNS.filter((k) => !columns.includes(k));
  if (missingKeyCols.length) {
    throw new DismissalContractError(
      `slop-dismissals.tsv column header is missing required column(s): ${missingKeyCols.join(", ")}.`,
    );
  }
  const tsI = columns.indexOf("ts");
  const aI = columns.indexOf("artifact_id");
  const rI = columns.indexOf("ruleId");
  const sI = columns.indexOf("surface"); // -1 absent → ""
  const scI = columns.indexOf("scope"); // -1 on a v1 store → every row 'exception'

  const rows: DismissalRow[] = [];
  const rejected: RejectedRow[] = [];
  for (let n = i + 2; n < lines.length; n++) {
    const raw = lines[n];
    if (raw.trim() === "" || raw.startsWith("#")) continue;
    const parts = raw.split("\t");
    const artifact_id = (parts[aI] ?? "").trim();
    const ruleId = (parts[rI] ?? "").trim();
    const missing: string[] = [];
    if (artifact_id === "") missing.push("artifact_id");
    if (ruleId === "") missing.push("ruleId");
    if (missing.length) {
      rejected.push({ line: n + 1, reason: `missing key component(s): ${missing.join(", ")}` });
      continue;
    }
    rows.push({
      ts: (parts[tsI] ?? "").trim(),
      artifact_id,
      ruleId,
      surface: sI >= 0 ? (parts[sI] ?? "").trim() : "",
      scope: normalizeScope(scI >= 0 ? (parts[scI] ?? "").trim() : ""),
      line: n + 1,
    });
  }
  return { state: rows.length === 0 ? "empty" : "answered", storeExists: true, rows, rejected };
}

/** Load + parse the store for a project root. An absent store is the NORMAL first-run state
 *  (typed-empty, storeExists:false) — the universal state until real dismissals accrue. */
export function loadDismissals(root: string): ParseResult {
  const path = slopDismissalsPath(root);
  if (!existsSync(path)) return { state: "empty", storeExists: false, rows: [], rejected: [] };
  return parseDismissals(readFileSync(path, "utf8"));
}

export interface RuleAggregate {
  ruleId: string;
  dismiss_n: number; // all dismissals (any scope) in window
  rule_wrong_n: number; // scope='rule-wrong' (the counted population)
  exception_n: number; // scope='exception' (taste corpus — recorded, NOT counted)
  distinct_artifacts: number; // DISTINCT artifact_id among the rule-wrong rows
  volatility: Volatility;
  weight: number; // shrinkageWeightRounded(rule_wrong_n, k) — a thin rule is explicitly weak
  flagged: boolean; // past the volatility-keyed count AND distinct-artifact span
}

export interface AggregateOptions {
  asOf: string; // YYYY-MM-DD window anchor (deterministic for tests)
  window?: number; // default 90
  volatilityOf?: (ruleId: string) => Volatility; // registry lookup; default stable
  k?: number; // shrinkage prior strength; default DEFAULT_SHRINKAGE_K (8)
  stableThreshold?: number;
  stableArtifacts?: number;
  trendThreshold?: number;
  trendArtifacts?: number;
}

/**
 * Per-ruleId aggregation over the trailing window. ONLY scope='rule-wrong' rows count toward the
 * revision threshold; scope='exception' rows are recorded (taste corpus) but never trip it — the
 * structural answer to "the rule is wrong vs this artifact is a legit exception". A rule flags
 * only past BOTH the volatility-keyed count AND the distinct-artifact span.
 */
export function aggregateByRule(rows: DismissalRow[], opts: AggregateOptions): Record<string, RuleAggregate> {
  const window = opts.window ?? WINDOW_DAYS;
  const since = windowStart(opts.asOf, window);
  const volatilityOf = opts.volatilityOf ?? ((): Volatility => "stable");
  const stableThreshold = opts.stableThreshold ?? STABLE_THRESHOLD;
  const stableArtifacts = opts.stableArtifacts ?? STABLE_ARTIFACTS;
  const trendThreshold = opts.trendThreshold ?? TREND_THRESHOLD;
  const trendArtifacts = opts.trendArtifacts ?? TREND_ARTIFACTS;

  const byRule = new Map<string, DismissalRow[]>();
  for (const r of rows) {
    const d = r.ts.slice(0, 10);
    if (d < since || d > opts.asOf) continue; // trailing [asOf-window, asOf]
    let bucket = byRule.get(r.ruleId);
    if (!bucket) byRule.set(r.ruleId, (bucket = []));
    bucket.push(r);
  }

  const out: Record<string, RuleAggregate> = {};
  for (const [ruleId, rs] of byRule) {
    const ruleWrong = rs.filter((r) => r.scope === "rule-wrong");
    const rule_wrong_n = ruleWrong.length;
    const distinct_artifacts = new Set(ruleWrong.map((r) => r.artifact_id)).size;
    const volatility = volatilityOf(ruleId);
    const flagged = volatility === "stable"
      ? rule_wrong_n >= stableThreshold && distinct_artifacts >= stableArtifacts
      : rule_wrong_n >= trendThreshold && distinct_artifacts >= trendArtifacts;
    out[ruleId] = {
      ruleId,
      dismiss_n: rs.length,
      rule_wrong_n,
      exception_n: rs.length - rule_wrong_n,
      distinct_artifacts,
      volatility,
      weight: shrinkageWeightRounded(rule_wrong_n, opts.k),
      flagged,
    };
  }
  return out;
}

// --- suspect emission (suspect-dimensions/v1 on the ruleId axis) -------------
// A LOCAL type, NOT skill-health.ts's SuspectEntry — that one hard-types signal:'decision_reason'
// as a literal. This is the same envelope keyed on the ruleId axis instead.

export interface RuleSuspectEntry {
  skill: string; // 'global' — a slop rule is not owned by one skill (fixSkill is the FIX route, not the owner)
  dimension: string; // the ruleId
  disposition_id: string;
  deny_n: number; // rule_wrong_n
  distinct_artifacts: number;
  weight: number;
  volatility: Volatility;
  window_days: number;
  signal: "ruleId";
}

export interface RuleSuspectFile {
  schema: "suspect-dimensions/v1";
  generated: string;
  window_days: number;
  deny_threshold: number;
  signal: "ruleId";
  entries: RuleSuspectEntry[];
}

/** Every flagged ruleId → one suspect entry. Sorted by rule_wrong_n desc (pickWorst takes [0]). */
export function emitRuleSuspects(agg: Record<string, RuleAggregate>, generated: string, windowDays = WINDOW_DAYS): RuleSuspectFile {
  const entries: RuleSuspectEntry[] = [];
  for (const a of Object.values(agg)) {
    if (!a.flagged) continue;
    entries.push({
      skill: "global",
      dimension: a.ruleId,
      disposition_id:
        `S7-dismiss-${generated}: ${a.rule_wrong_n} rule-wrong dismissal(s) on ${a.ruleId} ` +
        `across ${a.distinct_artifacts} artifact(s) — route to revise the rule (human-owned)`,
      deny_n: a.rule_wrong_n,
      distinct_artifacts: a.distinct_artifacts,
      weight: a.weight,
      volatility: a.volatility,
      window_days: windowDays,
      signal: "ruleId",
    });
  }
  entries.sort((x, y) => y.deny_n - x.deny_n || x.dimension.localeCompare(y.dimension));
  return { schema: "suspect-dimensions/v1", generated, window_days: windowDays, deny_threshold: STABLE_THRESHOLD, signal: "ruleId", entries };
}

export function pickWorst(file: RuleSuspectFile): RuleSuspectEntry | null {
  return file.entries[0] ?? null; // entries are pre-sorted by deny_n desc
}

function windowStart(asOf: string, window: number): string {
  return new Date(new Date(asOf + "T00:00:00Z").getTime() - window * 86_400_000).toISOString().slice(0, 10);
}
