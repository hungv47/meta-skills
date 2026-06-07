#!/usr/bin/env bun
// build-tool-registry — discover connected capabilities → the FORSVN tool registry.
//
// CLOSED-LOOP.md §3 (Registry v1, discovery-only). READ-ONLY and LOCAL: it adds no
// network surface (§3.1). It reads what the operator already connected — MCP servers
// declared in the agent config files + env-var PRESENCE — classifies each against the
// seed catalog (lib/tool-catalog.ts), and emits two surfaces from one source:
//
//   .forsvn/canonical/meta/TOOL-REGISTRY.md   ① humans + greppable agent surface
//   .forsvn/index/tools.json                  ② machine index (sibling to manifest.json)
//
// Nothing is marked `verified` here. Verification is a separate, operator-initiated,
// cheapest-possible liveness probe (§3.2) — present ≠ live. So the execution fork (§4)
// sees 0 verified engines and degrades cleanly to Brief-only, naming what *could* be
// connected. Env VALUES are never read, logged, or written — only key presence.
//
// Usage:
//   bun skills/bin/build-tool-registry.ts [project-root]      # write both surfaces
//   bun skills/bin/build-tool-registry.ts --check [root]      # exit 1 if stale
//   bun skills/bin/build-tool-registry.ts --json [root]       # print tools.json, no write

import { readFileSync, writeFileSync, existsSync, mkdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import {
  CATEGORIES,
  KNOWN_ENGINES,
  matchEngine,
  normalizeServerName,
  type Category,
} from "./lib/tool-catalog";

const CHECK = process.argv.includes("--check");
const JSON_ONLY = process.argv.includes("--json");
const ROOT_ARG = process.argv.find((a, i) => i > 1 && !a.startsWith("--")) ?? process.cwd();
const ROOT = realpathSync(ROOT_ARG);
const HOME = homedir();
const TOOLS_JSON = join(ROOT, ".forsvn", "index", "tools.json");
const REGISTRY_MD = join(ROOT, ".forsvn", "canonical", "meta", "TOOL-REGISTRY.md");
const PLUGINS_DIR = join(HOME, ".claude", "plugins");
const INSTALLED_PLUGINS = join(PLUGINS_DIR, "installed_plugins.json");
const TOOLS_SCHEMA_VERSION = 1;

type DiscoverySource = { path: string; label: string; exists: boolean; serverNames: string[]; dropUnmatched?: boolean };

// --- read MCP server NAMES (keys only) from the known agent config locations -------
// We never read the values under each server (they can hold API keys / env). Only the
// object KEYS — the server names — are extracted.

function readJsonSafe(path: string): unknown | null {
  try {
    if (!existsSync(path)) return null;
    const txt = readFileSync(path, "utf-8").trim();
    if (!txt) return null;
    return JSON.parse(txt);
  } catch {
    return null; // malformed config → treat as absent, never crash discovery
  }
}

function serverKeys(obj: unknown): string[] {
  if (!obj || typeof obj !== "object") return [];
  const rec = obj as Record<string, unknown>;
  // Common shape: { mcpServers: { name: {...} } }. Fallback: a flat { name: {...} }
  // map whose values look like server defs (command/url/type).
  if (rec.mcpServers && typeof rec.mcpServers === "object") {
    return Object.keys(rec.mcpServers as Record<string, unknown>);
  }
  const looksLikeServers = Object.values(rec).every(
    (v) => v && typeof v === "object" && ("command" in (v as object) || "url" in (v as object) || "type" in (v as object)),
  );
  return looksLikeServers && Object.keys(rec).length > 0 ? Object.keys(rec) : [];
}

function gatherSources(): DiscoverySource[] {
  const sources: DiscoverySource[] = [];
  const add = (path: string, label: string, names: string[], exists: boolean) =>
    sources.push({ path: path.replace(HOME, "~"), label, exists, serverNames: names });

  // 1. project-local .mcp.json
  const projectMcp = join(ROOT, ".mcp.json");
  const pj = readJsonSafe(projectMcp);
  add(projectMcp, "project .mcp.json", serverKeys(pj), existsSync(projectMcp));

  // 2. the syncthis-managed unified MCP config
  const unified = join(HOME, ".config", "mcp", "servers.json");
  const uj = readJsonSafe(unified);
  add(unified, "~/.config/mcp/servers.json", serverKeys(uj), existsSync(unified));

  // 3. ~/.claude.json — global mcpServers + the per-project block for this root
  const claudeJson = join(HOME, ".claude.json");
  const cj = readJsonSafe(claudeJson) as Record<string, unknown> | null;
  if (cj) {
    add(claudeJson, "~/.claude.json (global)", serverKeys(cj), true);
    const projects = (cj.projects ?? {}) as Record<string, unknown>;
    let realRoot = ROOT;
    try { realRoot = realpathSync(ROOT); } catch { /* keep ROOT */ }
    const block = projects[ROOT] ?? projects[realRoot] ?? projects[ROOT_ARG];
    if (block) add(claudeJson, "~/.claude.json (this project)", serverKeys(block), true);
  } else {
    add(claudeJson, "~/.claude.json (global)", [], existsSync(claudeJson));
  }

  return sources;
}

// --- read MCP server NAMES (keys only) declared by INSTALLED PLUGINS -----------------
// Plugins declare their MCP servers in <installPath>/.mcp.json (or mcp.json, or
// .claude-plugin/plugin.json `mcpServers`). installed_plugins.json maps plugin id →
// installPath. We extract bare server-name KEYS only (never values). The source is tagged
// dropUnmatched: only names that map to a CATALOG engine surface (provenance plugin:<id>);
// the 200+ unrelated plugin servers are dropped, not dumped into unmapped_servers
// (CLOSED-LOOP §3, U2 fork — catalog-match present-not-live). "Installed" ≠ "live": status
// stays `unconfigured` (§3.2). claude.ai connectors have no local def → not discoverable here.
function gatherPluginSources(): DiscoverySource[] {
  const reg = readJsonSafe(INSTALLED_PLUGINS) as
    | { plugins?: Record<string, Array<{ installPath?: string }>> }
    | null;
  const plugins = reg?.plugins;
  if (!plugins || typeof plugins !== "object") return [];
  const out: DiscoverySource[] = [];
  for (const id of Object.keys(plugins).sort()) {
    // installed_plugins.json values are arrays of install records; the first entry's
    // installPath suffices (entries are single-element in practice — a plugin's MCP
    // server set is identical across install scopes).
    const entry = Array.isArray(plugins[id]) ? plugins[id][0] : undefined;
    const installPath = entry?.installPath;
    if (!installPath || !existsSync(installPath)) continue;
    const names = new Set<string>();
    for (const rel of [".mcp.json", "mcp.json", join(".claude-plugin", "plugin.json")]) {
      const f = join(installPath, rel);
      if (existsSync(f)) for (const k of serverKeys(readJsonSafe(f))) names.add(k);
    }
    if (!names.size) continue;
    out.push({ path: `plugin:${id}`, label: `plugin:${id}`, exists: true, serverNames: [...names].sort(), dropUnmatched: true });
  }
  return out;
}

// --- classify discovered servers against the catalog --------------------------------

type EngineEntry = {
  name: string;
  category: Category;
  categories: Category[];
  capabilities: string[];
  auth: string;
  status: "verified" | "unconfigured" | "error";
  discovered: boolean;
  discovery_sources: string[];
  env_keys: string[];
  env_present: boolean | null;
  env_keys_present: string[];
  docs_url: string;
  cost_hint: string;
  latency_hint: string;
  preferred: boolean;
};

type UnmappedServer = { name: string; normalized: string; sources: string[] };

function classify(sources: DiscoverySource[]) {
  // engine slug → sources where its MCP server was found
  const mcpHits = new Map<string, Set<string>>();
  const unmapped = new Map<string, UnmappedServer>();

  for (const src of sources) {
    for (const raw of src.serverNames) {
      const engine = matchEngine(raw);
      if (engine) {
        if (!mcpHits.has(engine.name)) mcpHits.set(engine.name, new Set());
        mcpHits.get(engine.name)!.add(src.label);
      } else if (!src.dropUnmatched) {
        const norm = normalizeServerName(raw);
        if (!unmapped.has(norm)) unmapped.set(norm, { name: raw, normalized: norm, sources: [] });
        unmapped.get(norm)!.sources.push(src.label);
      }
    }
  }

  const engines: EngineEntry[] = KNOWN_ENGINES.map((e) => {
    const hit = mcpHits.get(e.name);
    const discoveredViaMcp = !!hit;
    const presentKeys = e.env_keys.filter((k) => {
      const v = process.env[k];
      return typeof v === "string" && v.length > 0;
    });
    const envPresent = e.env_keys.length > 0 ? presentKeys.length > 0 : null;
    const discovered = discoveredViaMcp || envPresent === true;
    return {
      name: e.name,
      category: e.category,
      categories: e.categories,
      capabilities: e.capabilities,
      // if found connected as an MCP server, the connection IS mcp-mediated
      auth: discoveredViaMcp ? "mcp-connected" : e.auth,
      // v1 never auto-verifies — present is not live (§3.2)
      status: "unconfigured" as const,
      discovered,
      discovery_sources: hit ? [...hit].sort() : [],
      env_keys: e.env_keys,
      env_present: envPresent,
      env_keys_present: presentKeys, // names only — never values
      docs_url: e.docs_url,
      cost_hint: e.cost_hint,
      latency_hint: e.latency_hint,
      preferred: false,
    };
  });

  return { engines, unmapped: [...unmapped.values()].sort((a, b) => a.normalized.localeCompare(b.normalized)) };
}

// --- emit tools.json ----------------------------------------------------------------

function buildToolsJson(configSources: DiscoverySource[], pluginSources: DiscoverySource[], generatedAt: string) {
  const { engines, unmapped } = classify([...configSources, ...pluginSources]);
  // Config sources are listed individually; installed-plugin sources (potentially dozens)
  // collapse to one aggregate row so the scanned-sources table stays legible.
  const sourcesScanned = configSources.map((s) => ({ path: s.path, exists: s.exists, server_count: s.serverNames.length }));
  if (pluginSources.length) {
    const total = pluginSources.reduce((n, s) => n + s.serverNames.length, 0);
    sourcesScanned.push({ path: "~/.claude/plugins (installed plugins)", exists: true, server_count: total });
  }
  return {
    version: TOOLS_SCHEMA_VERSION,
    generated_at: generatedAt,
    generator: "build-tool-registry",
    root: ROOT.replace(HOME, "~"),
    categories: [...CATEGORIES],
    engines,
    unmapped_servers: unmapped,
    sources_scanned: sourcesScanned,
  };
}

// --- emit TOOL-REGISTRY.md ----------------------------------------------------------

function buildRegistryMd(tools: ReturnType<typeof buildToolsJson>, date: string): string {
  const engines = tools.engines;
  const discoveredCount = engines.filter((e) => e.discovered).length;
  const verifiedCount = engines.filter((e) => e.status === "verified").length;

  const fm = [
    "---",
    "skill: build-tool-registry",
    "version: 1",
    `date: ${date}`,
    "status: done",
    "stack: meta",
    "type: registry",
    "id: tool-registry",
    "keywords: [tool-registry, capability-catalog, mcp-discovery, execution-fork, engines, closed-loop]",
    "lifecycle: canonical",
    `summary: "Discovered capability catalog by stage-category — what the operator can execute through, and how it's connected."`,
    `purpose: "The closed-loop tool registry (CLOSED-LOOP.md §3): discovery-first catalog of research/design/image/video/publish/analytics engines, their auth + connection status, consumed by the execution fork and Settings."`,
    "use_when: \"Deciding which engines the execution fork can offer, or which capabilities are connected vs. available to connect.\"",
    "do_not_use_when: \"You need a live liveness check — status here is discovery-only; verification is operator-initiated (§3.2).\"",
    "upstream: closed-loop",
    "downstream: \"\"",
    "decision_state: not_required",
    "review_surface: none",
    "review_tool: none",
    "reviewed_at:",
    "reviewer:",
    "---",
    "",
  ].join("\n");

  const head = [
    "# Tool Registry — Discovered Capabilities",
    "",
    "> **Generated** by `bun skills/bin/build-tool-registry.ts` — discovery-only, read-only,",
    "> local (no network). Re-run it after connecting an MCP server or setting an API key.",
    `> **${discoveredCount}** engine(s) discovered as connected · **${verifiedCount}** verified.`,
    "",
    "`status` is **discovery-only**: `unconfigured` means present-but-not-liveness-checked.",
    "Nothing is `verified` until an operator-initiated probe confirms it (CLOSED-LOOP.md §3.2).",
    "So the execution fork (§4) currently offers **Brief-only**, naming connectable engines.",
    "",
    "_Machine index: [`.forsvn/index/tools.json`](../../index/tools.json). Schema:",
    "`skills/references/tool-registry-spec.md`._",
    "",
  ].join("\n");

  const tickFor = (e: EngineEntry) => (e.discovered ? "🟢" : "○");
  const conn = (e: EngineEntry) => {
    if (e.discovery_sources.length) return `mcp: ${e.discovery_sources.join(", ")}`;
    if (e.env_present === true) return `env: ${e.env_keys_present.join(", ")}`;
    if (e.env_keys.length) return `env: ${e.env_keys.join(" / ")} (unset)`;
    if (e.auth === "none") return "no auth";
    return "not connected";
  };

  const sections: string[] = [];
  for (const cat of CATEGORIES) {
    const rows = engines.filter((e) => e.categories.includes(cat));
    if (!rows.length) continue;
    sections.push(`## ${cat}`);
    sections.push("");
    sections.push("| | engine | status | connection | capabilities | cost · latency |");
    sections.push("|---|---|---|---|---|---|");
    for (const e of rows) {
      sections.push(
        `| ${tickFor(e)} | \`${e.name}\` | ${e.status} | ${conn(e)} | ${e.capabilities.join(", ")} | ${e.cost_hint} · ${e.latency_hint} |`,
      );
    }
    sections.push("");
  }

  const unmapped = tools.unmapped_servers;
  const unmappedBlock = unmapped.length
    ? [
        "## Unmapped connected servers",
        "",
        "Connected MCP servers that don't map to a registry capability category (not a",
        "marketing-execution engine, or unknown to the seed catalog). Listed so nothing is",
        "silently dropped; add to `skills/bin/lib/tool-catalog.ts` if one should be an engine.",
        "",
        ...unmapped.map((u) => `- \`${u.name}\` — ${u.sources.join(", ")}`),
        "",
      ].join("\n")
    : "";

  const sourcesBlock = [
    "## Sources scanned",
    "",
    "| source | exists | servers |",
    "|---|---|---|",
    ...tools.sources_scanned.map((s) => `| \`${s.path}\` | ${s.exists ? "yes" : "no"} | ${s.server_count} |`),
    "",
  ].join("\n");

  return [fm, head, sections.join("\n"), unmappedBlock, sourcesBlock].filter(Boolean).join("\n");
}

// --- normalize volatile fields so --check compares CONTENT, not timestamps ----------

function normalizeJson(text: string): string {
  try {
    const o = JSON.parse(text);
    delete o.generated_at;
    return JSON.stringify(o, null, 2);
  } catch {
    return text;
  }
}
function normalizeMd(text: string): string {
  return text.replace(/^date: .*$/m, "date: <date>");
}

// --- main ---------------------------------------------------------------------------

const generatedAt = new Date().toISOString();
const today = generatedAt.slice(0, 10);
const configSources = gatherSources();
const pluginSources = gatherPluginSources();
const tools = buildToolsJson(configSources, pluginSources, generatedAt);
const toolsText = JSON.stringify(tools, null, 2) + "\n";

// Preserve the original create-date so daily re-runs don't churn `date:` / mark stale.
let mdDate = today;
const existingMd = existsSync(REGISTRY_MD) ? readFileSync(REGISTRY_MD, "utf-8") : null;
if (existingMd) {
  const m = existingMd.match(/^date: (\d{4}-\d{2}-\d{2})$/m);
  if (m) mdDate = m[1];
}
const mdText = buildRegistryMd(tools, mdDate);

if (JSON_ONLY) {
  console.log(toolsText);
  process.exit(0);
}

if (CHECK) {
  const problems: string[] = [];
  if (!existsSync(TOOLS_JSON)) problems.push("tools.json missing");
  else if (normalizeJson(readFileSync(TOOLS_JSON, "utf-8")) !== normalizeJson(toolsText))
    problems.push("tools.json stale (content differs from a fresh discovery)");
  if (!existsSync(REGISTRY_MD)) problems.push("TOOL-REGISTRY.md missing");
  else if (normalizeMd(readFileSync(REGISTRY_MD, "utf-8")) !== normalizeMd(mdText))
    problems.push("TOOL-REGISTRY.md stale (content differs from a fresh discovery)");
  if (problems.length) {
    console.error("[build-tool-registry] CHECK FAIL:");
    for (const p of problems) console.error(`  - ${p}`);
    console.error("  run: bun skills/bin/build-tool-registry.ts");
    process.exit(1);
  }
  console.log("[build-tool-registry] OK — registry surfaces are fresh.");
  process.exit(0);
}

mkdirSync(join(ROOT, ".forsvn", "index"), { recursive: true });
mkdirSync(join(ROOT, ".forsvn", "canonical", "meta"), { recursive: true });
writeFileSync(TOOLS_JSON, toolsText);
writeFileSync(REGISTRY_MD, mdText);

const discovered = tools.engines.filter((e) => e.discovered).map((e) => e.name);
console.log(`[build-tool-registry] wrote ${TOOLS_JSON.replace(HOME, "~")} + ${REGISTRY_MD.replace(HOME, "~")}`);
console.log(`  ${tools.engines.length} engines cataloged · ${discovered.length} discovered: ${discovered.join(", ") || "(none)"}`);
if (tools.unmapped_servers.length)
  console.log(`  ${tools.unmapped_servers.length} unmapped connected server(s): ${tools.unmapped_servers.map((u) => u.name).join(", ")}`);
