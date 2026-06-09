#!/usr/bin/env bun
// forsvn-mcp-launch — resolve the forsvn-mcp binary, then exec it as the stdio
// MCP server. This is the `command` an agent's MCP config points at, so the
// agent never needs a Rust toolchain or a hand-built absolute path:
//
//   { "mcpServers": { "forsvn": {
//       "command": "bun",
//       "args": ["<plugin>/bin/forsvn-mcp-launch.ts", "serve"] } } }
//
// Resolution order (first hit wins):
//   1. $FORSVN_MCP_BIN            — explicit override.
//   2. forsvn-mcp on PATH         — the `cargo install --path crates/forsvn-mcp`
//                                   dogfood path; works today, no download.
//   3. cached release binary      — under $CLAUDE_PLUGIN_DATA (survives plugin
//                                   updates, which rotate $CLAUDE_PLUGIN_ROOT).
//   4. download from the GitHub    — per-OS/arch asset for the latest release of
//      release                      $FORSVN_MCP_REPO, checksum-verified, cached.
//   5. graceful failure           — one actionable line, non-zero exit. We do NOT
//                                   spawn a broken server or crash the session.
//
// Stdio is inherited so the MCP JSON-RPC transport passes straight through.
// All args after resolution are forwarded verbatim (so `serve <roots…>` works).

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, chmodSync, renameSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";

// OQ-4 (resolved 2026-06-09): release binaries live on the already-public
// hungv47/meta-skills so external users download without auth, regardless of
// whether the source repo is private. Override with $FORSVN_MCP_REPO to pull
// from a different host (e.g. forsvn-com/forsvn for an authenticated dogfood).
const RELEASE_REPO = process.env.FORSVN_MCP_REPO ?? "hungv47/meta-skills";
const BIN_NAME = "forsvn-mcp";

function log(msg: string): void { process.stderr.write(`[forsvn-mcp-launch] ${msg}\n`); }

// darwin-arm64 / darwin-x64 first (v0 is macOS-only). Linux/Windows follow the
// desktop roadmap; the triple just won't resolve an asset until then.
function hostTriple(): string {
  const os = process.platform === "darwin" ? "darwin"
    : process.platform === "linux" ? "linux"
    : process.platform === "win32" ? "windows" : process.platform;
  const arch = process.arch === "arm64" ? "arm64" : process.arch === "x64" ? "x64" : process.arch;
  return `${os}-${arch}`;
}

function onPath(): string | null {
  // Bun.which resolves against the current PATH (cargo's ~/.cargo/bin included
  // only if the user's PATH has it — the README flags that gotcha).
  return (Bun as unknown as { which(n: string): string | null }).which(BIN_NAME);
}

function dataDir(): string {
  // Persist under CLAUDE_PLUGIN_DATA, never CLAUDE_PLUGIN_ROOT (it is GC'd ~7d
  // after a plugin update). Fall back to a stable per-user cache off-plugin.
  const base = process.env.CLAUDE_PLUGIN_DATA
    ?? join(process.env.HOME ?? tmpdir(), ".cache", "forsvn-mcp");
  return join(base, "bin");
}

async function fetchJson(url: string): Promise<any | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "forsvn-mcp-launch", Accept: "application/vnd.github+json" } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "forsvn-mcp-launch" } });
    if (!r.ok) return false;
    await Bun.write(dest, await r.arrayBuffer());
    return true;
  } catch { return false; }
}

function sha256(path: string): string {
  const h = createHash("sha256");
  h.update(require("node:fs").readFileSync(path));
  return h.digest("hex");
}

// Extract the expected digest for `assetName` from a checksum file. The
// single-digest `<asset>.sha256` form is a bare hex (optionally `<hex>  <name>`);
// the multi-line SHA256SUMS form lists one `<hex>  <name>` per asset, so we must
// match the line for OUR asset rather than taking the first digest in the file.
function expectedDigest(sumText: string, assetName: string, multi: boolean): string | null {
  if (multi) {
    for (const line of sumText.split("\n")) {
      const m = line.match(/^([a-f0-9]{64})\s+\*?(.+?)\s*$/i);
      if (m && m[2] === assetName) return m[1].toLowerCase();
    }
    return null; // our asset isn't listed — treat as unverifiable
  }
  return sumText.match(/[a-f0-9]{64}/i)?.[0]?.toLowerCase() ?? null;
}

// Newest cached binary for this triple, by mtime — the offline/no-release
// fallback so a previously fetched binary still launches without GitHub.
function newestCached(dir: string, triple: string): string | null {
  const prefix = `${BIN_NAME}-${triple}-`;
  let best: { path: string; mtime: number } | null = null;
  try {
    for (const name of readdirSync(dir)) {
      if (!name.startsWith(prefix) || name.endsWith(".partial")) continue;
      const path = join(dir, name);
      const mtime = statSync(path).mtimeMs;
      if (!best || mtime > best.mtime) best = { path, mtime };
    }
  } catch { return null; }
  return best?.path ?? null;
}

// Resolve a usable binary path, downloading + caching if necessary. Returns null
// if no binary can be obtained (offline, no release yet, unsupported platform).
async function resolveBinary(): Promise<string | null> {
  if (process.env.FORSVN_MCP_BIN && existsSync(process.env.FORSVN_MCP_BIN)) return process.env.FORSVN_MCP_BIN;

  const fromPath = onPath();
  if (fromPath) return fromPath;

  const triple = hostTriple();
  const dir = dataDir();

  // Look up the latest release first so the cache is keyed on its tag: a new
  // release supersedes a previously downloaded binary instead of being masked by
  // it. If GitHub is unreachable, fall back to the newest cached binary.
  const rel = await fetchJson(`https://api.github.com/repos/${RELEASE_REPO}/releases/latest`);
  if (!rel?.tag_name) return newestCached(dir, triple); // offline / no release cut yet

  const cached = join(dir, `${BIN_NAME}-${triple}-${rel.tag_name}`);
  if (existsSync(cached)) return cached;
  if (!rel.assets?.length) return newestCached(dir, triple);

  const assetName = `${BIN_NAME}-${triple}`;
  const asset = rel.assets.find((a: any) => a.name === assetName);
  const sumAsset = rel.assets.find((a: any) => a.name === `${assetName}.sha256` || a.name === "SHA256SUMS");
  if (!asset) { log(`no ${assetName} asset in ${RELEASE_REPO}@${rel.tag_name}`); return newestCached(dir, triple); }

  mkdirSync(dir, { recursive: true });
  const tmp = `${cached}.partial`;
  if (!await download(asset.browser_download_url, tmp)) return null;

  // Checksum-verify before trusting the binary. If a checksum was advertised we
  // must verify it — a mismatch, an unreachable checksum, or an unparseable one
  // all refuse the download. Never exec an unverified binary.
  if (sumAsset) {
    const cleanup = () => { try { require("node:fs").unlinkSync(tmp); } catch {} };
    let sumText: string | null = null;
    try {
      const sumResp = await fetch(sumAsset.browser_download_url, { headers: { "User-Agent": "forsvn-mcp-launch" } });
      if (sumResp.ok) sumText = await sumResp.text();
    } catch { sumText = null; }
    if (sumText === null) {
      log(`could not fetch ${sumAsset.name} for ${assetName} — refusing to use the unverified download`);
      cleanup();
      return null;
    }
    const expected = expectedDigest(sumText, assetName, sumAsset.name === "SHA256SUMS");
    const got = sha256(tmp).toLowerCase();
    if (expected !== got) {
      log(`checksum ${expected ? "mismatch" : "unverifiable"} for ${assetName} — refusing to use the download`);
      cleanup();
      return null;
    }
  }
  chmodSync(tmp, 0o755);
  renameSync(tmp, cached);
  log(`installed ${assetName} → ${cached}`);
  return cached;
}

async function main(): Promise<number> {
  const passthrough = process.argv.slice(2); // e.g. ["serve", "<root>", …]
  const bin = await resolveBinary();
  if (!bin) {
    log(`could not find or fetch the forsvn-mcp binary.`);
    log(`install it once with:  cargo install --path crates/forsvn-mcp`);
    log(`or set FORSVN_MCP_BIN=/path/to/forsvn-mcp.  (review surface still works without this.)`);
    return 1;
  }
  return await new Promise<number>((resolve) => {
    const child = spawn(bin, passthrough, { stdio: "inherit" });
    child.on("exit", (code, signal) => resolve(signal ? 1 : (code ?? 0)));
    child.on("error", (e) => { log(`failed to start ${bin}: ${e.message}`); resolve(1); });
  });
}

main().then((c) => process.exit(c)).catch((e) => { log(`unexpected: ${e?.message ?? e}`); process.exit(1); });
