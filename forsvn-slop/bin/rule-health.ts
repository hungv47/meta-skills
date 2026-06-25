#!/usr/bin/env bun
// rule-health — the ruleId-axis analog of _dev/skill-health.ts (FOR-56 / S7). Reads the slop
// override ledger (.forsvn/learning/slop-dismissals.tsv) through the canonical rule-dismissals
// reader, ranks rules by rule-wrong dismissals, and FLAGS any rule past its volatility-keyed
// threshold AND distinct-artifact span for HUMAN revision — via a suspect-dimensions/v1 entry
// plus the EXISTING update-quality-dashboard watch->revise ladder. It NEVER edits, disables, or
// re-weights a rule: auto-flag ROUTES a human; the human owns the rule edit (detect != fix).
//
//   - SINGLE reader. Goes through lib/rule-dismissals.ts (the one slop-store reader); never
//     re-parses the TSV here and never touches verdicts.tsv.
//   - WARN-first. --check is informational (exit 0); it never blocks a gate.
//   - Honest dormancy. An absent/empty store is the normal state until real dismissals accrue;
//     the report writes a dormancy block and exits 0.
//
// Usage:
//   bun forsvn-slop/bin/rule-health.ts [--root path] [--as-of YYYY-MM-DD] [--window 90]
//       [--stable-threshold 3] [--trend-threshold 5] [--stable-artifacts 3] [--trend-artifacts 4] [--json]
//       → writes docs/forsvn/artifacts/meta/records/rule-health.md (ranked) + summary
//   bun forsvn-slop/bin/rule-health.ts --emit-suspects [--out file] [--root …]
//       → writes the suspect-dimensions/v1 file (signal:'ruleId')
//   bun forsvn-slop/bin/rule-health.ts --route [--root …]
//       → prints the human-gated revise command for the worst suspect (no mutation)
//   bun forsvn-slop/bin/rule-health.ts --check [--root …]
//       → lists currently-suspect rules, WARN-first (exit 0)
//
// Exit codes: 0 = answered (incl. an absent/empty store — a normal first-run);
//             1 = a slop-store contract violation or bad usage.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  aggregateByRule,
  DismissalContractError,
  emitRuleSuspects,
  loadDismissals,
  pickWorst,
  WINDOW_DAYS,
  STABLE_THRESHOLD,
  STABLE_ARTIFACTS,
  TREND_THRESHOLD,
  TREND_ARTIFACTS,
  type RuleAggregate,
  type RuleSuspectFile,
  type Volatility,
} from "../lib/rule-dismissals";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** registry volatility lookup, behind a guarded dynamic import so an unbuilt/absent registry
 *  degrades to 'stable' (fail toward catching a mis-firing STRICT rule). */
async function loadVolatilityOf(): Promise<(ruleId: string) => Volatility> {
  try {
    const mod = (await import("../registry/antipatterns.mjs")) as { ANTIPATTERNS?: Array<{ id?: string; volatility?: string }> };
    const map = new Map<string, Volatility>();
    for (const e of mod.ANTIPATTERNS ?? []) {
      if (e && typeof e.id === "string") map.set(e.id, e.volatility === "trend" ? "trend" : "stable");
    }
    return (ruleId: string) => map.get(ruleId) ?? "stable";
  } catch {
    return () => "stable";
  }
}

function renderRuleHealthMd(ranking: RuleAggregate[], suspects: RuleSuspectFile, meta: { generated: string; window_days: number; total: number; store_exists: boolean }): string {
  const fm = [
    "---",
    "skill: rule-health",
    "version: 1",
    `date: ${meta.generated}`,
    "status: done",
    "stack: meta",
    "review_surface: md",
    "type: registry",
    "id: rule-health-telemetry",
    "keywords: [telemetry, slop-rules, override-ledger, rule-revision, dismissals]",
    "---",
    "",
  ].join("\n");

  const lines: string[] = [];
  lines.push("# Rule health — slop-rule override telemetry (S7)");
  lines.push("");
  lines.push(`Window: trailing ${meta.window_days}d, as-of ${meta.generated}. Dismissals in window: ${meta.total}.`);
  lines.push("");
  lines.push("Only `scope: rule-wrong` dismissals count toward revision; `scope: exception` rows are the");
  lines.push("taste corpus (recorded, never counted). A rule flags only past BOTH its volatility-keyed");
  lines.push(`count (stable ≥${STABLE_THRESHOLD} / trend ≥${TREND_THRESHOLD}) AND the distinct-artifact span`);
  lines.push(`(stable ≥${STABLE_ARTIFACTS} / trend ≥${TREND_ARTIFACTS}). Auto-flag ROUTES a human — it never edits the rule.`);
  lines.push("");

  if (!meta.store_exists || meta.total === 0) {
    lines.push("> **No slop dismissals in window yet.** This is a normal first-run / pre-dogfood state —");
    lines.push("> the review loop has recorded no rule dismissals to analyze. The ranking populates once real");
    lines.push("> operator dismissals land in `.forsvn/learning/slop-dismissals.tsv` (scope `rule-wrong`).");
    lines.push("");
    return fm + lines.join("\n") + "\n";
  }

  lines.push("| Rule (ruleId) | volatility | rule-wrong | distinct-artifacts | exceptions | weight | flagged |");
  lines.push("|---|---|--:|--:|--:|--:|:--:|");
  for (const r of ranking) {
    lines.push(`| ${r.ruleId} | ${r.volatility} | ${r.rule_wrong_n} | ${r.distinct_artifacts} | ${r.exception_n} | ${r.weight} | ${r.flagged ? "⚠" : "—"} |`);
  }
  lines.push("");
  lines.push(`## Suspect rules (past threshold → candidate for revision)`);
  lines.push("");
  if (suspects.entries.length === 0) {
    lines.push(`_None. No rule has reached its volatility-keyed dismissal threshold across enough distinct artifacts in window._`);
  } else {
    lines.push("| Rule | volatility | rule-wrong | distinct-artifacts | disposition |");
    lines.push("|---|---|--:|--:|---|");
    for (const e of suspects.entries) {
      lines.push(`| ${e.dimension} | ${e.volatility} | ${e.deny_n} | ${e.distinct_artifacts} | ${e.disposition_id} |`);
    }
    lines.push("");
    lines.push("Route the worst with `bun forsvn-slop/bin/rule-health.ts --route`. Acting on a flag means a");
    lines.push("human revising the rule in `forsvn-slop/registry/antipatterns.mjs` — this tool never edits it.");
  }
  lines.push("");
  return fm + lines.join("\n") + "\n";
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) usage(0);
  const JSON_OUT = takeFlag(argv, "--json");
  const EMIT = takeFlag(argv, "--emit-suspects");
  const ROUTE = takeFlag(argv, "--route");
  const CHECK = takeFlag(argv, "--check");
  const opts = takeOpts(argv);
  const root = resolve(opts.root ?? process.cwd());
  const asOf = opts["as-of"] ?? new Date().toISOString().slice(0, 10);
  if (!DATE_RE.test(asOf)) usage(1, `Invalid --as-of ${JSON.stringify(asOf)} — expected YYYY-MM-DD.`);
  const window = intOpt(opts.window, WINDOW_DAYS, "--window");
  const stableThreshold = intOpt(opts["stable-threshold"], STABLE_THRESHOLD, "--stable-threshold");
  const stableArtifacts = intOpt(opts["stable-artifacts"], STABLE_ARTIFACTS, "--stable-artifacts");
  const trendThreshold = intOpt(opts["trend-threshold"], TREND_THRESHOLD, "--trend-threshold");
  const trendArtifacts = intOpt(opts["trend-artifacts"], TREND_ARTIFACTS, "--trend-artifacts");

  let parsed;
  try {
    parsed = loadDismissals(root);
  } catch (e) {
    if (e instanceof DismissalContractError) fail(e.message);
    throw e;
  }

  const volatilityOf = await loadVolatilityOf();
  const agg = aggregateByRule(parsed.rows, { asOf, window, volatilityOf, stableThreshold, stableArtifacts, trendThreshold, trendArtifacts });
  const ranking = Object.values(agg).sort(
    (a, b) => Number(b.flagged) - Number(a.flagged) || b.rule_wrong_n - a.rule_wrong_n || b.distinct_artifacts - a.distinct_artifacts || a.ruleId.localeCompare(b.ruleId),
  );
  const suspects = emitRuleSuspects(agg, asOf, window);
  const total = parsed.rows.filter((r) => { const d = r.ts.slice(0, 10); return d >= windowStart(asOf, window) && d <= asOf; }).length;

  if (EMIT) {
    const out = resolve(opts.out ?? join(root, "rule-suspects.json"));
    writeFileSync(out, JSON.stringify(suspects, null, 2) + "\n");
    if (JSON_OUT) console.log(JSON.stringify(suspects, null, 2));
    else console.log(`rule-health: wrote ${suspects.entries.length} suspect rule(s) → ${rel(out, root)}`);
    return;
  }

  if (ROUTE) {
    const worst = pickWorst(suspects);
    if (JSON_OUT) { console.log(JSON.stringify({ worst }, null, 2)); return; }
    if (!worst) { console.log(`rule-health: no rule past its dismissal threshold — nothing to route.`); return; }
    console.log(`rule-health: worst suspect — ${worst.dimension} (${worst.deny_n} rule-wrong across ${worst.distinct_artifacts} artifacts, ${worst.volatility}, ${worst.window_days}d)`);
    console.log("");
    console.log("  → flip the dashboard rubric watch->revise (the existing >=3 ladder; no rule edit):");
    console.log(`      bun _dev/update-quality-dashboard.ts --rubric slop:${worst.dimension} --overrides ${worst.deny_n} --action watch`);
    console.log("");
    console.log("  → then the HUMAN-OWNED next step (this tool NEVER edits the registry):");
    console.log(`      revise ${worst.dimension} in forsvn-slop/registry/antipatterns.mjs`);
    console.log(`      disposition: ${worst.disposition_id}`);
    return;
  }

  if (CHECK) {
    // WARN-first: informational, never blocks (exit 0).
    if (JSON_OUT) { console.log(JSON.stringify({ window_days: window, as_of: asOf, suspects: suspects.entries }, null, 2)); return; }
    if (suspects.entries.length === 0) {
      console.log(`rule-health --check: no suspect rule (volatility-keyed threshold, ${window}d window). Clean.`);
      return;
    }
    console.log(`rule-health --check: ${suspects.entries.length} suspect rule(s) — WARN (informational, non-blocking):`);
    for (const e of suspects.entries) console.log(`  ⚠ ${e.dimension} — ${e.deny_n} rule-wrong across ${e.distinct_artifacts} artifacts → ${e.disposition_id}`);
    return;
  }

  // default: write the ranked rule-health.md
  const recordsDir = join(root, "docs", "forsvn", "artifacts", "meta", "records");
  mkdirSync(recordsDir, { recursive: true });
  const mdPath = join(recordsDir, "rule-health.md");
  const md = renderRuleHealthMd(ranking, suspects, { generated: asOf, window_days: window, total, store_exists: parsed.storeExists });
  writeFileSync(mdPath, md);
  if (JSON_OUT) { console.log(JSON.stringify({ ranking, suspects }, null, 2)); return; }
  console.log(`rule-health: wrote ${rel(mdPath, root)} — ${ranking.length} rule(s) ranked, ${suspects.entries.length} suspect rule(s).`);
}

// --- helpers ----------------------------------------------------------------
function windowStart(asOf: string, window: number): string {
  return new Date(new Date(asOf + "T00:00:00Z").getTime() - window * 86_400_000).toISOString().slice(0, 10);
}
function rel(p: string, root: string): string { return p.startsWith(root) ? p.slice(root.length + 1) : p; }

function takeFlag(argv: string[], flag: string): boolean {
  const i = argv.indexOf(flag);
  if (i === -1) return false;
  argv.splice(i, 1);
  return true;
}
function takeOpts(argv: string[]): Record<string, string> {
  const o: Record<string, string> = {};
  while (argv.length) {
    const k = argv.shift()!;
    if (!k.startsWith("--")) usage(1, `Unexpected argument ${JSON.stringify(k)}`);
    const v = argv.shift();
    if (v === undefined) usage(1, `Missing value for ${k}`);
    o[k.slice(2)] = v;
  }
  return o;
}
function intOpt(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value)) usage(1, `${name} must be a non-negative integer.`);
  return Number(value);
}
function fail(message: string): never {
  console.error(`rule-health: ${message}`);
  process.exit(1);
}
function usage(code: number, message?: string): never {
  if (message) console.error(`rule-health: ${message}`);
  console.error(
    "Usage: bun forsvn-slop/bin/rule-health.ts [--root path] [--as-of YYYY-MM-DD] [--window 90]\n" +
    "         [--stable-threshold 3] [--trend-threshold 5] [--stable-artifacts 3] [--trend-artifacts 4] [--json]\n" +
    "       bun forsvn-slop/bin/rule-health.ts --emit-suspects [--out file] [--root path] [--as-of YYYY-MM-DD]\n" +
    "       bun forsvn-slop/bin/rule-health.ts --route [--root path] [--as-of YYYY-MM-DD]\n" +
    "       bun forsvn-slop/bin/rule-health.ts --check [--root path] [--as-of YYYY-MM-DD]",
  );
  process.exit(code);
}

if (import.meta.main) await main();
