#!/usr/bin/env bun
// forsvn-doctor — one command that says which of the three FORSVN layers are
// live and what's missing. Closes the "installs vs usable" gap: a half-installed
// machine gets an accurate, actionable, per-layer status in seconds.
//
//   bun forsvn-doctor.ts            # human-readable report
//   bun forsvn-doctor.ts --json     # machine-readable for an agent
//
// Layers:
//   1. Review surface  — Bun + git            → /forsvn:review
//   2. MCP contract    — forsvn-mcp resolvable → the collab_*/read tools
//   3. Proof collab    — Node 18+ + a valid    → /forsvn:collab
//                        FORSVN_PROOF_DIR

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveTier, checkRow, fixLine, tierRow, type CheckSeverity } from "../lib/mono";

type Check = { name: string; ok: boolean; detail: string; fix?: string };

function which(bin: string): string | null {
  return (Bun as unknown as { which(n: string): string | null }).which(bin);
}
function ver(cmd: string, args: string[]): string | null {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return r.status === 0 ? (r.stdout || r.stderr || "").trim().split("\n")[0] : null;
}

function checkBun(): Check {
  // We're running under Bun, so it's present by definition — report the version.
  return { name: "Bun", ok: true, detail: `bun ${Bun.version}` };
}

function checkGit(): Check {
  const v = ver("git", ["--version"]);
  return v
    ? { name: "git", ok: true, detail: v }
    : { name: "git", ok: false, detail: "not found", fix: "install git — the review surface refuses to rewrite a dirty tree without it" };
}

function checkAssets(): Check {
  // The review surface renders from assets/_html/base.html bundled beside this
  // CLI. A partial/corrupted install can have Bun + git yet be unable to render,
  // so the base tier must confirm the HTML assets actually resolve — otherwise
  // "review surface ✓" overpromises.
  const here = dirname(fileURLToPath(import.meta.url)); // .../forsvn-preview/bin
  const dir = resolve(here, "..", "assets", "_html");
  // The rendered page needs all five bundled assets, not just the template —
  // a partial install missing chrome.css/js, tokens.css or fonts.css still
  // can't render correctly (fonts.css carries the self-hosted brand type;
  // missing woff2 files degrade to system faces, so only the css is gating).
  const missing = ["base.html", "chrome.css", "chrome.js", "tokens.css", "fonts.css"]
    .map((f) => resolve(dir, f))
    .filter((p) => !existsSync(p));
  return missing.length === 0
    ? { name: "assets", ok: true, detail: dir }
    : { name: "assets", ok: false, detail: `missing ${missing.join(", ")}`, fix: "reinstall the forsvn plugin — the review-surface HTML assets are incomplete" };
}

function checkMcp(): Check {
  const onPath = which("forsvn-mcp") ?? (process.env.FORSVN_MCP_BIN && existsSync(process.env.FORSVN_MCP_BIN) ? process.env.FORSVN_MCP_BIN : null);
  if (onPath) {
    const v = ver(onPath, ["version"]) ?? "present";
    return { name: "forsvn-mcp", ok: true, detail: `${v} (${onPath})` };
  }
  return {
    name: "forsvn-mcp",
    ok: false,
    detail: "not on PATH and no FORSVN_MCP_BIN",
    fix: "`cargo install --path crates/forsvn-mcp`, or let bin/forsvn-mcp-launch.ts fetch a release; then register via .mcp.json.example",
  };
}

function nodeMajor(): { bin: string; major: number | null } {
  const bin = process.env.FORSVN_NODE_BIN ?? "node";
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  if (r.status !== 0) return { bin, major: null };
  const m = (r.stdout ?? "").match(/v(\d+)\./);
  return { bin, major: m ? Number(m[1]) : null };
}

function checkNode(): Check {
  const { bin, major } = nodeMajor();
  if (major === null) return { name: "Node", ok: false, detail: `not found (tried "${bin}")`, fix: "install Node 18+ or set FORSVN_NODE_BIN (Proof tier only)" };
  if (major < 18) return { name: "Node", ok: false, detail: `v${major} too old`, fix: "upgrade to Node 18+ (Proof tier only)" };
  return { name: "Node", ok: true, detail: `v${major} (${bin})` };
}

function checkProof(): Check {
  const dir = process.env.FORSVN_PROOF_DIR;
  if (!dir) return { name: "Proof SDK", ok: false, detail: "FORSVN_PROOF_DIR unset", fix: "run `bun proof-setup.ts` (Proof tier only)" };
  const abs = resolve(dir);
  if (!existsSync(join(abs, "server", "index.ts"))) return { name: "Proof SDK", ok: false, detail: `${abs} has no server/index.ts`, fix: "run `bun proof-setup.ts --dir " + dir + "`" };
  if (!existsSync(join(abs, "node_modules"))) return { name: "Proof SDK", ok: false, detail: `${abs} has no node_modules`, fix: "run `npm install` in " + abs };
  return { name: "Proof SDK", ok: true, detail: abs };
}

function main(): number {
  const bun = checkBun(), git = checkGit(), assets = checkAssets(), mcp = checkMcp(), node = checkNode(), proof = checkProof();
  const checks = [bun, git, assets, mcp, node, proof];

  const tiers = {
    "review surface": bun.ok && git.ok && assets.ok,
    "MCP contract": mcp.ok,
    "Proof collab": mcp.ok && node.ok && proof.ok,
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ checks, tiers }, null, 2));
    // Same gate as the human-readable path: the review surface is the base tier;
    // MCP/Proof are opt-in, so their absence is informational, not a failure.
    return tiers["review surface"] ? 0 : 1;
  }

  // G3 — the human screen renders through the shared mono tier engine (the
  // hardcoded ✓/✗ bypass is gone): glyph + name + detail per check, the
  // `→ fix` line directly beneath each failure, and a tier summary whose
  // one-clause translations say what each tier means in capabilities. The
  // visual hierarchy is the triage — red = act, dim = optional, green = done.
  const outTier = resolveTier(process.stdout);
  // A failing base check (Bun/git/assets) blocks the review surface → `fail`
  // (red). A failing opt-in check (forsvn-mcp/Node/Proof) only gates the
  // optional tiers → `info` (dim, never alarming).
  const BASE_CHECKS = new Set(["Bun", "git", "assets"]);
  const severityOf = (c: Check): CheckSeverity => (c.ok ? "ok" : BASE_CHECKS.has(c.name) ? "fail" : "info");
  const checkPad = Math.max(...checks.map((c) => c.name.length));

  console.log("FORSVN doctor\n");
  for (const c of checks) {
    console.log(checkRow(c.name, c.detail, severityOf(c), outTier, { pad: checkPad }));
    if (!c.ok && c.fix) console.log(fixLine(c.fix, outTier));
  }

  // Tier summary — capability translations, ok/fail variants per tier.
  const TIER_CLAUSE: Record<string, { ok: string; fail: string; failSeverity: CheckSeverity }> = {
    "review surface": {
      ok: "/forsvn:review works on this machine",
      fail: "/forsvn:review can't run until the failing checks above resolve",
      failSeverity: "fail",
    },
    "MCP contract": {
      ok: "agents can read the graph (forsvn-mcp resolved)",
      fail: "agents can't read the graph until forsvn-mcp resolves",
      failSeverity: "info",
    },
    "Proof collab": {
      ok: "/forsvn:collab is ready (forsvn-collab open <artifact.md>)",
      fail: "optional; needs MCP + Node 18+ + FORSVN_PROOF_DIR",
      failSeverity: "info",
    },
  };
  const tierPad = Math.max(...Object.keys(tiers).map((t) => t.length));
  console.log("\n  tiers");
  for (const [tier, ok] of Object.entries(tiers)) {
    const clause = TIER_CLAUSE[tier];
    console.log(tierRow(tier, ok ? clause.ok : clause.fail, ok ? "ok" : clause.failSeverity, outTier, { pad: tierPad }));
  }
  // Exit 0 if the base experience (review surface) is usable; the Proof/MCP tiers
  // are opt-in, so their absence is informational, not a failure.
  return tiers["review surface"] ? 0 : 1;
}

process.exit(main());
