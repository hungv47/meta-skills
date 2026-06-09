#!/usr/bin/env bun
// forsvn-doctor — one command that says which of the three FORSVN layers are
// live and what's missing. Closes the "installs vs usable" gap: a half-installed
// machine gets an accurate, actionable, per-layer status in seconds.
//
//   bun forsvn-doctor.ts            # human-readable report
//   bun forsvn-doctor.ts --json     # machine-readable for an agent
//
// Layers:
//   1. Review surface  — Bun + git            → /forsvn-preview:review
//   2. MCP contract    — forsvn-mcp resolvable → the collab_*/read tools
//   3. Proof collab    — Node 18+ + a valid    → /forsvn-preview:collab
//                        FORSVN_PROOF_DIR

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

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
  const bun = checkBun(), git = checkGit(), mcp = checkMcp(), node = checkNode(), proof = checkProof();
  const checks = [bun, git, mcp, node, proof];

  const tiers = {
    "review surface": bun.ok && git.ok,
    "MCP contract": mcp.ok,
    "Proof collab": mcp.ok && node.ok && proof.ok,
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ checks, tiers }, null, 2));
    // Same gate as the human-readable path: the review surface is the base tier;
    // MCP/Proof are opt-in, so their absence is informational, not a failure.
    return tiers["review surface"] ? 0 : 1;
  }

  const mark = (ok: boolean) => (ok ? "✓" : "✗");
  console.log("FORSVN doctor\n");
  for (const c of checks) {
    console.log(`  ${mark(c.ok)} ${c.name.padEnd(11)} ${c.detail}`);
    if (!c.ok && c.fix) console.log(`      → ${c.fix}`);
  }
  console.log("\n  Tiers:");
  for (const [tier, ok] of Object.entries(tiers)) {
    console.log(`  ${mark(ok)} ${tier}`);
  }
  // Exit 0 if the base experience (review surface) is usable; the Proof/MCP tiers
  // are opt-in, so their absence is informational, not a failure.
  return tiers["review surface"] ? 0 : 1;
}

process.exit(main());
