#!/usr/bin/env bun
// Aggregate all harness runs for a single skill and emit a markdown report.
//
// Usage:
//   bun meta-skills/scripts/harness/report.ts --skill <name> [--since YYYY-MM-DD] [--out <path>]
//
// Writes to stdout by default; use --out to save to a file.

import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HARNESS_DIR, readJson, relToRoot } from "./lib/io";
import { parseArgs, strArg } from "./lib/args";
import type { RunResult, SkillReport, ModeName } from "./schema";

function loadRuns(skill: string, since: string | null): RunResult[] {
  if (!existsSync(HARNESS_DIR)) return [];
  const files = readdirSync(HARNESS_DIR).filter((f) => f.endsWith(".json") && f.includes(`-${skill}-`));
  const runs: RunResult[] = [];
  for (const f of files) {
    const data = readJson<RunResult>(join(HARNESS_DIR, f));
    if (!data) continue;
    if (since && data.timestamp.slice(0, 10) < since) continue;
    runs.push(data);
  }
  return runs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function aggregate(skill: string, runs: RunResult[]): SkillReport {
  if (runs.length === 0) throw new Error(`No runs found for skill: ${skill}`);

  const modes: Record<ModeName, number> = { fast: 0, standard: 0, deep: 0 };
  for (const r of runs) {
    if (r.mode.resolved in modes) modes[r.mode.resolved]++;
  }

  // Ref load frequency across runs — load_rate ≥ 0.95 = "always", else "sometimes"
  const refStats = new Map<string, { hits: number; charsSum: number; linesSum: number }>();
  for (const r of runs) {
    const seen = new Set<string>();
    for (const ref of r.context_load.refs_read_in_order) {
      if (seen.has(ref.path)) continue;
      seen.add(ref.path);
      const cur = refStats.get(ref.path) ?? { hits: 0, charsSum: 0, linesSum: 0 };
      cur.hits++;
      cur.charsSum += ref.chars;
      cur.linesSum += ref.lines;
      refStats.set(ref.path, cur);
    }
  }
  const alwaysLoaded: SkillReport["always_loaded_refs"] = [];
  const sometimesLoaded: SkillReport["sometimes_loaded_refs"] = [];
  for (const [path, s] of refStats) {
    const rate = s.hits / runs.length;
    const avgChars = Math.round(s.charsSum / s.hits);
    const avgLines = Math.round(s.linesSum / s.hits);
    if (rate >= 0.95) {
      alwaysLoaded.push({ path, lines: avgLines, chars: avgChars });
    } else {
      sometimesLoaded.push({ path, load_rate: Number(rate.toFixed(2)), avg_chars: avgChars });
    }
  }

  // Sub-agent USE rate per name. NOT ROI — ROI per 04-protocol.md is "did the agent's
  // output change the main thread", which requires transcript diffing (v0.2). We surface
  // USE rate here under neutral labels so an operator doesn't mistake fire-rate for ROI.
  // Convert to KEEP/REVIEW/DROP only after a blind operator diff per 05-acceptance.md Gate 3.
  const agentStats = new Map<string, number>();
  for (const r of runs) for (const a of r.agents_spawned) agentStats.set(a.name, (agentStats.get(a.name) ?? 0) + 1);
  const agentRoi: SkillReport["agent_roi"] = [];
  for (const [name, fires] of agentStats) {
    const fireRate = fires / runs.length;
    let verdict: SkillReport["agent_roi"][number]["verdict"];
    if (fireRate >= 0.5) verdict = "HIGH_USE";
    else if (fireRate >= 0.3) verdict = "MED_USE";
    else verdict = "LOW_USE";
    agentRoi.push({ name, fire_rate: Number(fireRate.toFixed(2)), changed_output_rate: null, verdict });
  }

  // Contract stability per artifact path
  const contractsByPath = new Map<string, Set<string>>();
  for (const r of runs) {
    for (const a of r.output_artifacts) {
      if (!a.contract_hash) continue;
      const set = contractsByPath.get(a.path) ?? new Set();
      set.add(a.contract_hash);
      contractsByPath.set(a.path, set);
    }
  }
  const contractStability: SkillReport["artifact_contract_stability"] = [];
  for (const [path, hashes] of contractsByPath) {
    contractStability.push({ path, stable: hashes.size === 1, hashes_seen: hashes.size });
  }

  const defaultLoadAvg = Math.round(runs.reduce((s, r) => s + r.context_load.total_default_chars, 0) / runs.length);
  const withRefsAvg = Math.round(runs.reduce((s, r) => s + r.context_load.total_with_refs_chars, 0) / runs.length);

  // Recommendations
  const recs: string[] = [];
  if (defaultLoadAvg > 20000) recs.push(`Default load is ${defaultLoadAvg} chars (~${Math.round(defaultLoadAvg / 4)} tokens) — high. Body diet candidate.`);
  for (const a of agentRoi.filter((x) => x.verdict === "LOW_USE")) {
    recs.push(`Agent '${a.name}' fired only ${Math.round(a.fire_rate * 100)}% of runs — low USE rate. Run blind diff before deciding to remove (USE ≠ ROI).`);
  }
  for (const a of agentRoi.filter((x) => x.verdict === "MED_USE")) {
    recs.push(`Agent '${a.name}' fired ${Math.round(a.fire_rate * 100)}% of runs — medium USE. Run blind diff to determine actual ROI (does it change main-thread output?).`);
  }
  for (const ref of sometimesLoaded.filter((r) => r.load_rate < 0.5)) {
    recs.push(`Ref '${ref.path}' loads only ${Math.round(ref.load_rate * 100)}% — good lazy-load candidate. Verify body doesn't reference it always.`);
  }
  for (const c of contractStability.filter((c) => !c.stable)) {
    recs.push(`Artifact '${c.path}' contract drifted across runs (${c.hashes_seen} distinct hashes) — investigate before refactoring.`);
  }
  // Warn if SKILL.md size varied across runs in this sample — mixing pre/post refactor data
  // produces misleading aggregates.
  const distinctBodies = new Set(runs.map((r) => r.context_load.skill_md_lines));
  if (distinctBodies.size > 1) {
    recs.push(`SKILL.md size varied across runs (${[...distinctBodies].sort().join(", ")} lines) — sample is not homogeneous. Re-bucket via --since or use diff.ts with explicit pre/post partition.`);
  }
  if (recs.length === 0) recs.push("No issues flagged automatically — proceed to manual review of body for procedure-vs-routing.");

  const sample = runs.map((r) => r.timestamp);
  return {
    skill,
    stack: runs[0].stack,
    sample_size: runs.length,
    date_range: { from: sample[0], to: sample[sample.length - 1] },
    modes,
    body_lines: runs[runs.length - 1].context_load.skill_md_lines,
    always_loaded_refs: alwaysLoaded,
    sometimes_loaded_refs: sometimesLoaded,
    default_load_chars_avg: defaultLoadAvg,
    with_refs_load_chars_avg: withRefsAvg,
    agent_roi: agentRoi,
    artifact_contract_stability: contractStability,
    recommendations: recs,
  };
}

function format(report: SkillReport): string {
  const lines: string[] = [];
  lines.push(`# Harness report — ${report.skill}`);
  lines.push("");
  lines.push(`**Stack:** ${report.stack}`);
  lines.push(`**Sample size:** ${report.sample_size} runs (${report.date_range.from.slice(0, 10)} → ${report.date_range.to.slice(0, 10)})`);
  lines.push(`**Modes:** fast=${report.modes.fast}, standard=${report.modes.standard}, deep=${report.modes.deep}`);
  lines.push("");
  lines.push(`## Context load`);
  lines.push(`- SKILL.md body: **${report.body_lines} lines**`);
  lines.push(`- Default load (SKILL.md only): **${report.default_load_chars_avg.toLocaleString()} chars** (~${Math.round(report.default_load_chars_avg / 4).toLocaleString()} tokens)`);
  lines.push(`- With refs (avg): **${report.with_refs_load_chars_avg.toLocaleString()} chars** (~${Math.round(report.with_refs_load_chars_avg / 4).toLocaleString()} tokens)`);
  lines.push("");
  if (report.always_loaded_refs.length > 0) {
    lines.push(`### Always-loaded refs (load rate ≥ 95%) — body-diet leak suspects`);
    for (const r of report.always_loaded_refs) lines.push(`- \`${r.path}\` — ${r.chars} chars`);
    lines.push("");
  }
  if (report.sometimes_loaded_refs.length > 0) {
    lines.push(`### Sometimes-loaded refs (lazy — good)`);
    for (const r of report.sometimes_loaded_refs.sort((a, b) => b.load_rate - a.load_rate)) {
      lines.push(`- \`${r.path}\` — loaded in ${Math.round(r.load_rate * 100)}% of runs (avg ${r.avg_chars} chars)`);
    }
    lines.push("");
  }
  if (report.agent_roi.length > 0) {
    lines.push(`## Sub-agent USE rate`);
    lines.push("");
    lines.push("| Agent | Fire rate | USE bucket |");
    lines.push("|---|---|---|");
    for (const a of report.agent_roi) lines.push(`| ${a.name} | ${Math.round(a.fire_rate * 100)}% | ${a.verdict} |`);
    lines.push("");
    lines.push("_USE ≠ ROI. Buckets are HIGH_USE / MED_USE / LOW_USE based on fire rate only. The protocol's KEEP/REVIEW/DROP verdict requires the changed-output-rate metric (per 04-protocol.md Step 6), which is v0.2. Confirm with a blind diff per 05-acceptance.md Gate 3 before removing any agent._");
    lines.push("");
  }
  if (report.artifact_contract_stability.length > 0) {
    lines.push(`## Artifact contract stability`);
    for (const c of report.artifact_contract_stability) {
      lines.push(`- \`${c.path}\` — ${c.stable ? "STABLE" : `DRIFT (${c.hashes_seen} hashes)`}`);
    }
    lines.push("");
  }
  lines.push(`## Recommendations`);
  for (const r of report.recommendations) lines.push(`- ${r}`);
  lines.push("");
  lines.push(`_Harness v0.1.0 — see \`implementation-roadmap/refactor/03-harness.md\`._`);
  return lines.join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const skill = strArg(args, "skill");
  if (!skill) {
    console.error("Missing --skill <name>");
    process.exit(2);
  }
  const runs = loadRuns(skill, strArg(args, "since"));
  if (runs.length === 0) {
    console.error(`No runs found for ${skill}. Run harness with record.ts first.`);
    process.exit(1);
  }
  const report = aggregate(skill, runs);
  const md = format(report);
  const outPath = strArg(args, "out");
  if (outPath) {
    writeFileSync(outPath, md);
    console.error(`Report saved to: ${relToRoot(outPath)}`);
  } else {
    console.log(md);
  }
}

main();
