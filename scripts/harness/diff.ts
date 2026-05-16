#!/usr/bin/env bun
// Compare pre-refactor vs post-refactor harness runs for a single skill.
// Applies Gate-1 acceptance criteria from implementation-roadmap/refactor/05-acceptance.md.
//
// Usage:
//   bun meta-skills/scripts/harness/diff.ts --skill <name> --pre-before YYYY-MM-DD --post-from YYYY-MM-DD
//   bun meta-skills/scripts/harness/diff.ts --skill <name> --by-notes
//
// --by-notes partitions on the run's `notes` field — splits on whitespace and matches
// the exact tokens `pre` / `post`. Substring matching is intentionally NOT used (it would
// match "preview" / "poster").

import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HARNESS_DIR, readJson, relToRoot } from "./lib/io";
import { parseArgs, strArg, boolArg } from "./lib/args";
import type { DiffReport, RunResult } from "./schema";

function loadAll(skill: string): RunResult[] {
  if (!existsSync(HARNESS_DIR)) return [];
  const files = readdirSync(HARNESS_DIR).filter((f) => f.endsWith(".json") && f.includes(`-${skill}-`));
  const out: RunResult[] = [];
  for (const f of files) {
    const data = readJson<RunResult>(join(HARNESS_DIR, f));
    if (data) out.push(data);
  }
  return out;
}

function notesContainsToken(notes: string, token: string): boolean {
  return notes
    .toLowerCase()
    .split(/[\s,;|]+/)
    .map((t) => t.replace(/^["']+|["']+$/g, ""))
    .includes(token);
}

function partition(runs: RunResult[], args: { byNotes: boolean; preBefore: string | null; postFrom: string | null }): { pre: RunResult[]; post: RunResult[] } {
  if (args.byNotes) {
    return {
      pre: runs.filter((r) => notesContainsToken(r.notes ?? "", "pre")),
      post: runs.filter((r) => notesContainsToken(r.notes ?? "", "post")),
    };
  }
  return {
    pre: runs.filter((r) => args.preBefore ? r.timestamp.slice(0, 10) < args.preBefore : false),
    post: runs.filter((r) => args.postFrom ? r.timestamp.slice(0, 10) >= args.postFrom : false),
  };
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((s, n) => s + n, 0) / nums.length);
}

// Identify refs loaded in ≥95% of runs in a bucket. Add their avg chars to body chars
// to get "true" default token load — the number the operator pays on every standard run.
// Per spec (03-harness.md schema): total_default_chars = SKILL.md body + always-loaded refs.
// Single-run can't classify always-vs-sometimes (need ≥2 runs); compute at partition time.
function bucketDefaultLoad(runs: RunResult[]): { body_chars_avg: number; always_loaded_chars: number; total_default_chars: number; always_loaded_paths: string[] } {
  if (runs.length === 0) return { body_chars_avg: 0, always_loaded_chars: 0, total_default_chars: 0, always_loaded_paths: [] };
  const refHits = new Map<string, { hits: number; charsSum: number }>();
  for (const r of runs) {
    const seen = new Set<string>();
    for (const ref of r.context_load.refs_read_in_order) {
      if (seen.has(ref.path)) continue;
      seen.add(ref.path);
      const cur = refHits.get(ref.path) ?? { hits: 0, charsSum: 0 };
      cur.hits++;
      cur.charsSum += ref.chars;
      refHits.set(ref.path, cur);
    }
  }
  const alwaysPaths: string[] = [];
  let alwaysChars = 0;
  for (const [path, s] of refHits) {
    if (s.hits / runs.length >= 0.95) {
      alwaysPaths.push(path);
      alwaysChars += Math.round(s.charsSum / s.hits);
    }
  }
  const bodyAvg = avg(runs.map((r) => r.context_load.skill_md_chars));
  return {
    body_chars_avg: bodyAvg,
    always_loaded_chars: alwaysChars,
    total_default_chars: bodyAvg + alwaysChars,
    always_loaded_paths: alwaysPaths.sort(),
  };
}

function diff(skill: string, pre: RunResult[], post: RunResult[]): DiffReport {
  if (pre.length === 0 || post.length === 0) {
    return {
      skill,
      pre_run_ids: pre.map((r) => r.run_id),
      post_run_ids: post.map((r) => r.run_id),
      body_lines: { pre: 0, post: 0, delta_pct: 0 },
      default_load_chars: { pre_avg: 0, post_avg: 0, delta_pct: 0 },
      agents: [],
      contract_hashes: [],
      passes_gate_1: false,
      gate_1_failures: [`Insufficient runs — need ≥1 pre and ≥1 post (got pre=${pre.length}, post=${post.length}).`],
      notes: [],
    };
  }

  const preBody = pre[pre.length - 1].context_load.skill_md_lines;
  const postBody = post[post.length - 1].context_load.skill_md_lines;
  const bodyDelta = preBody === 0 ? 0 : Number((((postBody - preBody) / preBody) * 100).toFixed(1));

  // Per spec: default load includes body + always-loaded refs. Compute per bucket.
  const preLoad = bucketDefaultLoad(pre);
  const postLoad = bucketDefaultLoad(post);
  const loadDelta = preLoad.total_default_chars === 0
    ? 0
    : Number((((postLoad.total_default_chars - preLoad.total_default_chars) / preLoad.total_default_chars) * 100).toFixed(1));

  // Agent fire rates per name
  const allAgents = new Set<string>();
  for (const r of [...pre, ...post]) for (const a of r.agents_spawned) allAgents.add(a.name);
  const agents: DiffReport["agents"] = [];
  for (const name of allAgents) {
    const preFires = pre.filter((r) => r.agents_spawned.some((a) => a.name === name)).length;
    const postFires = post.filter((r) => r.agents_spawned.some((a) => a.name === name)).length;
    const preRate = pre.length === 0 ? 0 : preFires / pre.length;
    const postRate = post.length === 0 ? 0 : postFires / post.length;
    let verdict = "unchanged";
    if (preRate > 0 && postRate === 0) verdict = "removed";
    else if (preRate === 0 && postRate > 0) verdict = "added";
    else if (Math.abs(postRate - preRate) > 0.2) verdict = "rate-changed";
    agents.push({ name, pre_fire_rate: Number(preRate.toFixed(2)), post_fire_rate: Number(postRate.toFixed(2)), verdict });
  }

  // Contract hashes — group by artifact path; check preservation
  const pathHashes = new Map<string, { pre: Set<string>; post: Set<string> }>();
  for (const r of pre) {
    for (const a of r.output_artifacts) {
      if (!a.contract_hash) continue;
      const cur = pathHashes.get(a.path) ?? { pre: new Set(), post: new Set() };
      cur.pre.add(a.contract_hash);
      pathHashes.set(a.path, cur);
    }
  }
  for (const r of post) {
    for (const a of r.output_artifacts) {
      if (!a.contract_hash) continue;
      const cur = pathHashes.get(a.path) ?? { pre: new Set(), post: new Set() };
      cur.post.add(a.contract_hash);
      pathHashes.set(a.path, cur);
    }
  }
  const contractDiff: DiffReport["contract_hashes"] = [];
  for (const [path, hs] of pathHashes) {
    const pre0 = hs.pre.size === 1 ? Array.from(hs.pre)[0] : null;
    const post0 = hs.post.size === 1 ? Array.from(hs.post)[0] : null;
    const preserved = pre0 !== null && post0 !== null && pre0 === post0;
    contractDiff.push({ path, pre: pre0, post: post0, preserved });
  }

  // Gate 1 per 05-acceptance.md
  const failures: string[] = [];
  if (loadDelta > -30) failures.push(`Default token load reduction is only ${(-loadDelta).toFixed(1)}% — target ≥30%.`);
  for (const c of contractDiff) {
    if (!c.preserved) failures.push(`Contract hash for '${c.path}' did NOT preserve (pre=${c.pre ?? "—"}, post=${c.post ?? "—"}).`);
  }

  const notes: string[] = [];
  notes.push(`Body lines: ${preBody} → ${postBody} (${bodyDelta > 0 ? "+" : ""}${bodyDelta}%). Compare against classification target in stacks/*.md.`);
  notes.push(`Pre always-loaded refs (${preLoad.always_loaded_paths.length}): ${preLoad.always_loaded_paths.join(", ") || "(none)"}`);
  notes.push(`Post always-loaded refs (${postLoad.always_loaded_paths.length}): ${postLoad.always_loaded_paths.join(", ") || "(none)"}`);
  notes.push(`Pre default load: body ${preLoad.body_chars_avg.toLocaleString()} + always-loaded refs ${preLoad.always_loaded_chars.toLocaleString()} = ${preLoad.total_default_chars.toLocaleString()} chars.`);
  notes.push(`Post default load: body ${postLoad.body_chars_avg.toLocaleString()} + always-loaded refs ${postLoad.always_loaded_chars.toLocaleString()} = ${postLoad.total_default_chars.toLocaleString()} chars.`);

  return {
    skill,
    pre_run_ids: pre.map((r) => r.run_id),
    post_run_ids: post.map((r) => r.run_id),
    body_lines: { pre: preBody, post: postBody, delta_pct: bodyDelta },
    default_load_chars: { pre_avg: preLoad.total_default_chars, post_avg: postLoad.total_default_chars, delta_pct: loadDelta },
    agents,
    contract_hashes: contractDiff,
    passes_gate_1: failures.length === 0,
    gate_1_failures: failures,
    notes,
  };
}

function format(d: DiffReport): string {
  const lines: string[] = [];
  lines.push(`# Diff report — ${d.skill}`);
  lines.push("");
  lines.push(`**Gate 1 (machine-verifiable):** ${d.passes_gate_1 ? "✅ PASS" : "❌ FAIL"}`);
  lines.push("");
  lines.push(`- Pre-refactor runs: ${d.pre_run_ids.length}`);
  lines.push(`- Post-refactor runs: ${d.post_run_ids.length}`);
  lines.push("");
  lines.push(`## Body lines`);
  lines.push(`- Pre: ${d.body_lines.pre}`);
  lines.push(`- Post: ${d.body_lines.post}`);
  lines.push(`- Δ: ${d.body_lines.delta_pct > 0 ? "+" : ""}${d.body_lines.delta_pct}%`);
  lines.push("");
  lines.push(`## Default token load (body + always-loaded refs, avg chars per bucket)`);
  lines.push(`- Pre: ${d.default_load_chars.pre_avg.toLocaleString()}`);
  lines.push(`- Post: ${d.default_load_chars.post_avg.toLocaleString()}`);
  lines.push(`- Δ: ${d.default_load_chars.delta_pct > 0 ? "+" : ""}${d.default_load_chars.delta_pct}%`);
  lines.push("");
  if (d.agents.length > 0) {
    lines.push(`## Sub-agent fire rates`);
    lines.push("| Agent | Pre | Post | Verdict |");
    lines.push("|---|---|---|---|");
    for (const a of d.agents) lines.push(`| ${a.name} | ${Math.round(a.pre_fire_rate * 100)}% | ${Math.round(a.post_fire_rate * 100)}% | ${a.verdict} |`);
    lines.push("");
  }
  if (d.contract_hashes.length > 0) {
    lines.push(`## Artifact contract hashes`);
    lines.push("| Path | Preserved? | Pre | Post |");
    lines.push("|---|---|---|---|");
    for (const c of d.contract_hashes) lines.push(`| \`${c.path}\` | ${c.preserved ? "✅" : "❌"} | \`${c.pre ?? "—"}\` | \`${c.post ?? "—"}\` |`);
    lines.push("");
  }
  if (d.gate_1_failures.length > 0) {
    lines.push(`## Gate 1 failures`);
    for (const f of d.gate_1_failures) lines.push(`- ❌ ${f}`);
    lines.push("");
  }
  if (d.notes.length > 0) {
    lines.push(`## Notes`);
    for (const n of d.notes) lines.push(`- ${n}`);
    lines.push("");
  }
  lines.push(`_Next: complete Gates 2-6 from \`implementation-roadmap/refactor/05-acceptance.md\` — blind operator diff is the hard quality gate._`);
  return lines.join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const skill = strArg(args, "skill");
  if (!skill) {
    console.error("Missing --skill <name>");
    process.exit(2);
  }
  const byNotes = boolArg(args, "by-notes");
  const preBefore = strArg(args, "pre-before");
  const postFrom = strArg(args, "post-from");
  if (!byNotes && !preBefore && !postFrom) {
    console.error("Missing partition signal. Pass one of:");
    console.error("  --by-notes                                    (partitions on the run's notes field — exact tokens `pre` / `post`)");
    console.error("  --pre-before YYYY-MM-DD --post-from YYYY-MM-DD  (partitions by run timestamp)");
    process.exit(2);
  }
  const all = loadAll(skill);
  if (all.length === 0) {
    console.error(`No runs found for ${skill}.`);
    process.exit(1);
  }
  const { pre, post } = partition(all, { byNotes, preBefore, postFrom });
  const report = diff(skill, pre, post);
  const md = format(report);
  const outPath = strArg(args, "out");
  if (outPath) {
    writeFileSync(outPath, md);
    console.error(`Diff report saved to: ${relToRoot(outPath)}`);
  } else {
    console.log(md);
  }
  process.exit(report.passes_gate_1 ? 0 : 1);
}

main();
