#!/usr/bin/env bun
// plan.ts — atomic step-state transitions over .forsvn/runs/<slug>/plan.md (A3).
//
// The multi-step plan-artifact is the plan-preview trust contract: an ordered,
// gated plan a human approves BEFORE step 1, resumable by a fresh agent from the
// file alone. Schema SoT: skills/meta/forsvn/references/plan-spec.md.
//
// Writes are atomic (temp-file + same-dir rename) so a crashed mid-transition
// leaves a valid file. This helper moves the pointer + step statuses; it NEVER
// runs a step (that's A4's run-plan) and NEVER auto-approves a plan (only a human
// moves proposed -> approved).
//
// Usage:
//   bun bin/plan.ts init   <slug> --intent "<…>" [--steps <json|->] [--root <dir>]
//   bun bin/plan.ts show    <slug> [--root <dir>]
//   bun bin/plan.ts advance <slug> [--root <dir>]
//   bun bin/plan.ts set-status <slug> <stepId> <pending|running|done|blocked|abandoned> [--root <dir>]
//   bun bin/plan.ts --check <slug> [--root <dir>]
//
// Exit codes: 0 = ok / valid; 1 = invalid plan or bad usage.

import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";

const GATES = new Set(["auto", "review", "publish"]);
const STEP_STATUSES = new Set(["pending", "running", "done", "blocked", "abandoned"]);
const PLAN_STATUSES = new Set(["proposed", "approved", "running", "done", "abandoned"]);
const COLUMNS = ["id", "step", "skill", "args", "depends_on", "gate", "artifact_out", "status"] as const;

interface Step {
  id: string; step: string; skill: string; args: string;
  depends_on: string[]; gate: string; artifact_out: string; status: string;
}
interface Plan { fm: Record<string, string>; steps: Step[]; }

// --- args -------------------------------------------------------------------
const argv = process.argv.slice(2);
const checkMode = popFlag("--check");
const root = resolveOpt("--root") ?? process.cwd();
const sub = checkMode ? "check" : (argv.shift() ?? "");
const slug = argv.shift();

if (!slug) usage(1, "missing <slug>");

const path = join(root, ".forsvn", "runs", slug, "plan.md");

switch (sub) {
  case "init": cmdInit(); break;
  case "show": cmdShow(); break;
  case "advance": cmdAdvance(); break;
  case "set-status": cmdSetStatus(); break;
  case "check": cmdCheck(); break;
  default: usage(1, `unknown subcommand ${JSON.stringify(sub)}`);
}

// --- commands ---------------------------------------------------------------

function cmdInit(): void {
  const intent = resolveOpt("--intent") ?? "";
  if (!intent) usage(1, "init requires --intent \"<…>\"");
  const stepsArg = resolveOpt("--steps");
  let steps: Step[] = [];
  if (stepsArg) {
    const json = stepsArg === "-" ? readFileSync(0, "utf8") : stepsArg;
    let raw: unknown;
    try { raw = JSON.parse(json); } catch { fail("--steps must be valid JSON (or '-' to read JSON from stdin)"); }
    if (!Array.isArray(raw)) fail("--steps JSON must be an array of step objects");
    steps = (raw as Record<string, unknown>[]).map((r, i) => normalizeStep(r, i));
  }
  const fm: Record<string, string> = {
    slug,
    created: nowStamp(),
    intent: intent.replace(/\s+/g, " ").trim(),
    status: "proposed",
    current_step: "—",
    approved_by: "",
    approved_at: "",
  };
  recomputeBlocked(steps);
  write({ fm, steps });
  console.log(`plan init: ${rel(path)} (status: proposed, ${steps.length} step(s)). Human approves before step 1.`);
}

function cmdShow(): void {
  const plan = load();
  console.log(renderPlan(plan));
}

function cmdAdvance(): void {
  const plan = load();
  recomputeBlocked(plan.steps);
  const next = plan.steps.find((s) => s.status === "pending" && depsDone(s, plan.steps));
  if (!next) {
    console.log(`plan advance: no ready step (all remaining steps are blocked, done, or abandoned). current_step unchanged.`);
    write(plan); // persist any blocked recompute
    return;
  }
  plan.fm.current_step = next.id;
  write(plan);
  console.log(`plan advance: current_step → ${next.id} (${next.skill}, gate: ${next.gate}).`);
}

function cmdSetStatus(): void {
  const stepId = argv.shift();
  const status = argv.shift();
  if (!stepId || !status) usage(1, "set-status requires <stepId> <status>");
  if (!STEP_STATUSES.has(status)) fail(`invalid status ${JSON.stringify(status)} (expected ${[...STEP_STATUSES].join(" | ")})`);
  const plan = load();
  const step = plan.steps.find((s) => s.id === stepId);
  if (!step) fail(`no step with id ${JSON.stringify(stepId)}`);
  step!.status = status!;
  recomputeBlocked(plan.steps);
  write(plan);
  console.log(`plan set-status: ${stepId} → ${status}.`);
}

function cmdCheck(): void {
  if (!existsSync(path)) fail(`no plan at ${rel(path)}`);
  const plan = parse(readFileSync(path, "utf8"));
  const problems: string[] = [];

  for (const key of ["slug", "created", "intent", "status", "current_step"]) {
    if (!(key in plan.fm)) problems.push(`frontmatter missing \`${key}\``);
  }
  if (plan.fm.status && !PLAN_STATUSES.has(plan.fm.status))
    problems.push(`plan status ${JSON.stringify(plan.fm.status)} invalid (expected ${[...PLAN_STATUSES].join(" | ")})`);

  const ids = new Set<string>();
  for (const s of plan.steps) {
    if (!s.id) problems.push(`a step has an empty id`);
    if (ids.has(s.id)) problems.push(`duplicate step id ${JSON.stringify(s.id)}`);
    ids.add(s.id);
    if (!GATES.has(s.gate)) problems.push(`step ${s.id}: gate ${JSON.stringify(s.gate)} invalid (expected ${[...GATES].join(" | ")})`);
    if (!STEP_STATUSES.has(s.status)) problems.push(`step ${s.id}: status ${JSON.stringify(s.status)} invalid`);
  }
  for (const s of plan.steps) {
    for (const dep of s.depends_on) {
      if (!ids.has(dep)) problems.push(`step ${s.id}: depends_on ${JSON.stringify(dep)} references no step`);
    }
  }
  if (plan.fm.current_step && plan.fm.current_step !== "—" && !ids.has(plan.fm.current_step))
    problems.push(`current_step ${JSON.stringify(plan.fm.current_step)} references no step`);

  const cycle = findCycle(plan.steps);
  if (cycle) problems.push(`depends_on cycle: ${cycle.join(" → ")}`);

  if (problems.length === 0) {
    console.log(`plan --check: OK — ${rel(path)} valid (${plan.steps.length} step(s), DAG acyclic).`);
    process.exit(0);
  }
  console.error(`plan --check: FAIL — ${problems.length} problem(s) in ${rel(path)}:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

// --- parse / render ---------------------------------------------------------

function load(): Plan {
  if (!existsSync(path)) fail(`no plan at ${rel(path)} — run \`plan init ${slug} --intent "…"\` first`);
  return parse(readFileSync(path, "utf8"));
}

function parse(text: string): Plan {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) fail("plan.md is missing frontmatter");
  const fm: Record<string, string> = {};
  for (const line of m![1].split(/\r?\n/)) {
    const km = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
    if (km) fm[km[1]] = km[2].trim();
  }
  const steps: Step[] = [];
  const lines = text.slice(m![0].length).split(/\r?\n/);
  let inTable = false;
  for (const line of lines) {
    if (!line.trim().startsWith("|")) { if (inTable) inTable = false; continue; }
    // Split on unescaped pipes only, then decode `\|` — mirrors cell()'s render-side
    // escape so a step field containing a literal `|` round-trips without column shift.
    const cells = line.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.replace(/\\\|/g, "|").trim());
    if (cells[0] === "id") { inTable = true; continue; }        // header
    if (/^-+$/.test(cells[0] ?? "")) continue;                  // separator
    if (!inTable) continue;
    if (cells.length < COLUMNS.length) continue;
    steps.push({
      id: cells[0], step: cells[1], skill: cells[2], args: cells[3],
      depends_on: cells[4] === "—" || cells[4] === "" ? [] : cells[4].split(",").map((x) => x.trim()).filter(Boolean),
      gate: cells[5], artifact_out: cells[6], status: cells[7],
    });
  }
  return { fm, steps };
}

function renderPlan(plan: Plan): string {
  const fmKeys = ["slug", "created", "intent", "status", "current_step", "approved_by", "approved_at"];
  const fm = fmKeys.map((k) => `${k}: ${plan.fm[k] ?? ""}`).join("\n");
  const header = `| ${COLUMNS.join(" | ")} |`;
  const sep = `|${COLUMNS.map(() => "---").join("|")}|`;
  const rows = plan.steps.map((s) =>
    `| ${[s.id, s.step, s.skill, s.args, s.depends_on.length ? s.depends_on.join(",") : "—", s.gate, s.artifact_out || "—", s.status].map(cell).join(" | ")} |`,
  );
  const cur = plan.fm.current_step && plan.fm.current_step !== "—"
    ? (() => { const s = plan.steps.find((x) => x.id === plan.fm.current_step); return s ? `${s.id} — ${s.skill}. Next: run this step${s.gate === "publish" ? ", STOP at the publish gate (human required)" : `, stop at the ${s.gate} gate`}.` : `${plan.fm.current_step}`; })()
    : "— (no current step; awaiting approval or plan complete)";
  const approved = plan.fm.status !== "proposed" && plan.fm.approved_at;
  return [
    `---\n${fm}\n---`,
    ``,
    `## Run of show`,
    header, sep, ...rows,
    ``,
    `## Current step`,
    cur,
    ``,
    `## Approval`,
    `- [${approved ? "x" : " "}] Human approved this plan before step 1.   # A4 refuses to run an unapproved plan`,
    ``,
  ].join("\n");
}

function cell(v: string): string { return (v ?? "").replace(/\|/g, "\\|").replace(/\n/g, " "); }

// --- helpers ----------------------------------------------------------------

function normalizeStep(r: Record<string, unknown>, i: number): Step {
  const str = (k: string): string => (typeof r[k] === "string" ? (r[k] as string) : r[k] == null ? "" : String(r[k]));
  const deps = Array.isArray(r.depends_on) ? (r.depends_on as unknown[]).map(String)
    : typeof r.depends_on === "string" && r.depends_on ? (r.depends_on as string).split(",").map((x) => x.trim()).filter(Boolean)
    : [];
  const gate = str("gate") || "review";
  return {
    id: str("id") || `s${i + 1}`,
    step: str("step"),
    skill: str("skill"),
    args: str("args"),
    depends_on: deps,
    gate: GATES.has(gate) ? gate : "review",
    artifact_out: str("artifact_out"),
    status: STEP_STATUSES.has(str("status")) ? str("status") : "pending",
  };
}

function depsDone(s: Step, all: Step[]): boolean {
  return s.depends_on.every((d) => all.find((x) => x.id === d)?.status === "done");
}

// A pending step with unmet deps is blocked; a blocked step whose deps are now done returns to pending.
function recomputeBlocked(steps: Step[]): void {
  for (const s of steps) {
    if (s.status === "pending" && !depsDone(s, steps)) s.status = "blocked";
    else if (s.status === "blocked" && depsDone(s, steps)) s.status = "pending";
  }
}

function findCycle(steps: Step[]): string[] | null {
  const byId = new Map(steps.map((s) => [s.id, s]));
  const state = new Map<string, number>(); // 0=unseen,1=in-stack,2=done
  const stack: string[] = [];
  function dfs(id: string): string[] | null {
    if (state.get(id) === 2) return null;
    if (state.get(id) === 1) return [...stack.slice(stack.indexOf(id)), id];
    state.set(id, 1); stack.push(id);
    for (const dep of byId.get(id)?.depends_on ?? []) {
      if (!byId.has(dep)) continue;
      const c = dfs(dep);
      if (c) return c;
    }
    stack.pop(); state.set(id, 2);
    return null;
  }
  for (const s of steps) { const c = dfs(s.id); if (c) return c; }
  return null;
}

function write(plan: Plan): void {
  const content = renderPlan(plan);
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, content, "utf8");
  renameSync(tmp, path); // atomic within the same dir
}

function nowStamp(): string {
  // YYYY-MM-DD HH:MM:SS (local). plan.md is machine-state; a wall-clock stamp is fine here.
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function popFlag(flag: string): boolean {
  const i = argv.indexOf(flag);
  if (i === -1) return false;
  argv.splice(i, 1);
  return true;
}
function resolveOpt(flag: string): string | undefined {
  const i = argv.indexOf(flag);
  if (i === -1 || i + 1 >= argv.length) return undefined;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
}
function rel(p: string): string { return p.startsWith(root) ? p.slice(root.length + 1) : p; }
function fail(msg: string): never { console.error(`plan: ${msg}`); process.exit(1); }
function usage(code: number, msg?: string): never {
  if (msg) console.error(`plan: ${msg}`);
  console.error("Usage: bun bin/plan.ts <init|show|advance|set-status> <slug> [...] | bun bin/plan.ts --check <slug> [--root <dir>]");
  process.exit(code);
}
