#!/usr/bin/env bun
// find-artifacts — convenience query over the `.forsvn/` home.
//
// Sugar over the same fields raw ripgrep already exposes. The plaintext grep is
// the contract; this is the ergonomic path:
//   rg -l "^type: canonical" .forsvn/marketing/        (baseline)
//   bun skills/bin/find-artifacts.ts --stack marketing --type canonical --keyword brand
//
// Reads .forsvn/index/manifest.json (the API) when present and fresh; falls back
// to scanning frontmatter directly so it works even with no manifest.
//
// Usage:
//   bun skills/bin/find-artifacts.ts [--root <path>] [--stack <s>] [--layer <l>]
//                                 [--type <t>] [--keyword <k>] [--id <id>]
//                                 [--decision <state>] [--json]
//
// Phase 1 (knowledge graph) modes — all read the manifest's by_id + graph:
//   --resolve <id>            resolve a stable id → its current path (move-safe)
//   --graph <id>              show an artifact's edges in BOTH directions
//   --context [--stack <s>]   ONE-QUERY retrieval: truth (canonical) + output
//                             (artifacts) + memory (experience) in a single call

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { ARTIFACT_HOME, STATE_HOME } from "./lib/path-parser";

// Knowledge layers may live under either home (ARTIFACT_HOME=docs/forsvn after
// the state-root migration, STATE_HOME=.forsvn before); the manifest stays
// under STATE_HOME/index/.
const KNOWLEDGE_HOMES = [ARTIFACT_HOME, STATE_HOME];
const MANIFEST_REL = `${STATE_HOME}/index/manifest.json`;

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const ROOT = arg("--root") ?? process.cwd();
const wantStack = arg("--stack");
const wantLayer = arg("--layer");
const wantType = arg("--type");
const wantKeyword = arg("--keyword")?.toLowerCase();
const wantId = arg("--id");
const wantDecision = arg("--decision");
const wantResolve = arg("--resolve");
const wantGraph = arg("--graph");
const wantContext = process.argv.includes("--context");
const asJson = process.argv.includes("--json");

// --- Phase 1 graph modes (manifest-backed) ----------------------------------
function loadManifest(): { artifacts: Record<string, any>; by_id: Record<string, string>; graph: Record<string, any> } | null {
  const mp = join(ROOT, MANIFEST_REL);
  if (!existsSync(mp)) return null;
  try {
    const m = JSON.parse(readFileSync(mp, "utf8"));
    return { artifacts: m.artifacts ?? {}, by_id: m.by_id ?? {}, graph: m.graph ?? {} };
  } catch {
    return null;
  }
}

if (wantResolve !== undefined) {
  const m = loadManifest();
  const path = m?.by_id?.[wantResolve];
  if (asJson) {
    console.log(JSON.stringify({ id: wantResolve, path: path ?? null }, null, 2));
  } else if (path) {
    console.log(path);
  } else {
    console.error(`find-artifacts --resolve: no artifact with id "${wantResolve}".`);
  }
  process.exit(path ? 0 : 1);
}

if (wantGraph !== undefined) {
  const m = loadManifest();
  const node = m?.graph?.[wantGraph];
  if (!node) {
    console.error(`find-artifacts --graph: no artifact with id "${wantGraph}".`);
    process.exit(1);
  }
  const toPaths = (ids: string[]) => ids.map((id) => `${id} (${m!.by_id[id] ?? "?"})`);
  const out = {
    id: wantGraph,
    path: node.path,
    upstream: node.upstream,
    downstream: node.downstream,
    supersedes: node.supersedes,
    superseded_by: node.superseded_by,
    references: node.references,
    referenced_by: node.referenced_by,
  };
  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`${wantGraph}  →  ${node.path}`);
    for (const f of ["upstream", "downstream", "supersedes", "superseded_by", "references", "referenced_by"] as const) {
      const v = node[f] as string[];
      if (v.length) console.log(`  ${f}: ${toPaths(v).join(", ")}`);
    }
  }
  process.exit(0);
}

type Row = {
  path: string;
  id: string;
  type: string;
  stack: string;
  keywords: string[];
  decision_state: string;
  summary: string;
  use_when: string;
};

const rows: Row[] = fromManifest() ?? fromScan();

if (wantContext) {
  // One-query context retrieval: everything an agent needs to start work on a
  // stack — TRUTH (canonical) + OUTPUT (artifacts) + MEMORY (experience) — in a
  // single call, no globbing. Optionally scoped to one stack.
  const scoped = rows.filter((r) => !wantStack || r.stack === wantStack);
  const layerOf = (p: string): "canonical" | "artifacts" | "experience" | "other" => {
    for (const home of KNOWLEDGE_HOMES) {
      if (p.startsWith(`${home}/canonical/`)) return "canonical";
      if (p.startsWith(`${home}/artifacts/`)) return "artifacts";
      if (p.startsWith(`${home}/experience/`)) return "experience";
    }
    return "other";
  };
  const pick = (layer: string) => scoped.filter((r) => layerOf(r.path) === layer)
    .map((r) => ({ id: r.id, path: r.path, type: r.type, stack: r.stack, summary: r.summary, use_when: r.use_when, decision_state: r.decision_state }));
  const ctx = { stack: wantStack ?? "(all)", truth: pick("canonical"), output: pick("artifacts"), memory: pick("experience") };
  if (asJson) {
    console.log(JSON.stringify(ctx, null, 2));
    process.exit(0);
  }
  const section = (label: string, items: typeof ctx.truth) => {
    console.log(`\n## ${label} (${items.length})`);
    if (items.length === 0) { console.log("  —"); return; }
    for (const it of items) console.log(`  ${it.id} · ${it.path}\n    ${it.summary || it.use_when || ""}`.trimEnd());
  };
  console.log(`# Context for stack: ${ctx.stack}`);
  section("TRUTH — canonical", ctx.truth);
  section("OUTPUT — artifacts", ctx.output);
  section("MEMORY — experience", ctx.memory);
  console.log(`\n${ctx.truth.length + ctx.output.length + ctx.memory.length} artifact(s) in context.`);
  process.exit(0);
}

const filtered = rows.filter((r) => {
  if (wantStack && r.stack !== wantStack) return false;
  if (wantLayer && !KNOWLEDGE_HOMES.some((h) => r.path.startsWith(`${h}/${wantLayer}/`))) return false;
  if (wantType && r.type !== wantType) return false;
  if (wantId && r.id !== wantId) return false;
  if (wantDecision && r.decision_state !== wantDecision) return false;
  if (wantKeyword && !r.keywords.some((k) => k.toLowerCase().includes(wantKeyword))) return false;
  return true;
});

if (asJson) {
  console.log(JSON.stringify(filtered, null, 2));
  process.exit(0);
}

if (filtered.length === 0) {
  console.log("find-artifacts: no matches.");
  process.exit(0);
}
for (const r of filtered) {
  const tags = [r.stack, r.type, r.id].filter(Boolean).join(" · ");
  console.log(`${r.path}`);
  console.log(`  [${tags}] ${r.summary || r.use_when || ""}`.trimEnd());
}
console.log(`\n${filtered.length} match(es).`);

// --- sources ----------------------------------------------------------------

function fromManifest(): Row[] | null {
  const mp = join(ROOT, MANIFEST_REL);
  if (!existsSync(mp)) return null;
  try {
    const m = JSON.parse(readFileSync(mp, "utf8"));
    const out: Row[] = [];
    for (const [path, e] of Object.entries(m.artifacts ?? {}) as [string, any][]) {
      out.push({
        path,
        id: e.id ?? "",
        type: e.type ?? e.lifecycle ?? "",
        stack: e.stack ?? "",
        keywords: Array.isArray(e.keywords) ? e.keywords : [],
        decision_state: e.decision_state ?? "",
        summary: e.summary ?? "",
        use_when: e.use_when ?? "",
      });
    }
    return out;
  } catch {
    return null;
  }
}

function fromScan(): Row[] {
  const out: Row[] = [];
  for (const home of KNOWLEDGE_HOMES) {
    for (const layer of ["canonical", "artifacts", "experience"]) {
      const dir = join(ROOT, home, layer);
      if (existsSync(dir)) walk(dir);
    }
  }
  return out;

  function walk(dir: string): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      const rel = relative(ROOT, abs).split("\\").join("/");
      if (rel.includes("/.archive/")) continue;
      if (entry.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
      if (entry.name.toLowerCase() === "readme.md") continue;
      const fm = readFileSync(abs, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
      out.push({
        path: rel,
        id: scalar(fm, "id"),
        type: scalar(fm, "type"),
        stack: scalar(fm, "stack"),
        keywords: list(fm, "keywords"),
        decision_state: scalar(fm, "decision_state"),
        summary: scalar(fm, "summary"),
        use_when: scalar(fm, "use_when"),
      });
    }
  }
}

function scalar(fm: string, key: string): string {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "").trim() : "";
}

function list(fm: string, key: string): string[] {
  const raw = scalar(fm, key);
  if (raw.startsWith("[") && raw.endsWith("]")) {
    return raw.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  }
  return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
}
