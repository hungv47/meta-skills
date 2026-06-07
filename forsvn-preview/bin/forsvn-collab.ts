#!/usr/bin/env bun
// forsvn collab — open/export a collaborative-doc artifact in Proof.
//
//   forsvn-collab open   <artifact.md> [--base URL] [--no-open] [--keep-open]
//   forsvn-collab export <artifact.md> [--base URL] [--decision approved|denied|suggested]
//
// `open` imports the artifact into a local Proof doc-server, writes the binding
// back to frontmatter, opens the editor, and holds the server up for the session.
// `export` (U6) pulls the accepted markdown back to the canonical .md.
//
// The doc-server is local-only (loopback, sqlite, no cloud — ADR D4). Agents
// collaborate via forsvn-mcp (suggest-only); they never run this CLI.

import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { startProofServer } from "../lib/proof-server";
import { ProofClient } from "../lib/proof-client";
import { findProjectRoot, openArtifact, exportArtifact } from "../lib/collab";

function arg(name: string, def?: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const has = (name: string) => process.argv.includes(name);

function openBrowser(url: string): void {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  try { spawn(cmd, [url], { stdio: "ignore", detached: true }).unref(); } catch { /* headless; URL is printed anyway */ }
}

async function cmdOpen(artifactPath: string): Promise<void> {
  const base = arg("--base");
  const projectRoot = findProjectRoot(artifactPath);
  const handle = base ? undefined : await startProofServer({ projectRoot });
  const baseUrl = base ? base.replace(/\/$/, "") : handle!.baseUrl;
  const client = new ProofClient(baseUrl);
  // When we own the server it is a child of THIS process and dies when this
  // process exits — so "keep it running" means keep this process running. A
  // Ctrl-C must stop the server and exit cleanly (the doc persists in sqlite).
  if (handle) {
    process.on("SIGINT", async () => {
      console.log("\n  stopping doc-server (doc persists; export later with `forsvn collab export`)…");
      await handle.stop();
      process.exit(0);
    });
  }
  try {
    const r = await openArtifact(client, baseUrl, artifactPath);
    console.log(`\n  ${r.created ? "imported" : "reopened"} → ${r.editorUrl}`);
    console.log(`  slug=${r.slug}  (binding written to frontmatter)\n`);
    if (!has("--no-open")) openBrowser(r.editorUrl);

    if (base) {
      // External server: we don't own its lifecycle, nothing to keep alive here.
      console.log("  attached to external server. Run `forsvn collab export` when done.");
      return;
    }
    if (has("--keep-open")) {
      console.log(`  server running at ${baseUrl} — agents can suggest via forsvn-mcp.`);
      console.log("  Press Ctrl-C to stop (then `forsvn collab export` when ready).\n");
      await new Promise<void>(() => {}); // hold the process (and child server) up until SIGINT
      return; // unreachable; SIGINT handler exits
    }
    console.log("  Editing in Proof. Agents can suggest via forsvn-mcp.");
    console.log("  Review the doc, then type a decision to export it back to Markdown:");
    console.log("    a = approve   d = deny   s = suggest-changes   (Enter / anything else = cancel)\n");
    const line: string = await new Promise((res) => {
      process.stdin.resume();
      process.stdin.once("data", (d) => res(String(d).trim().toLowerCase()));
    });
    const decisionMap: Record<string, string> = {
      a: "approved", approve: "approved", approved: "approved",
      d: "denied", deny: "denied", denied: "denied",
      s: "suggested", suggest: "suggested", suggested: "suggested",
    };
    // No silent default: a bare Enter cancels rather than stamping "approved".
    // An explicit --decision is honored only if the operator didn't type a key.
    const explicit = process.argv.includes("--decision") ? (arg("--decision") as string) : undefined;
    const decision = decisionMap[line] ?? explicit;
    if (!decision) {
      console.log("  cancelled — no decision recorded. Doc persists; export later with `forsvn collab export`.");
      return;
    }
    const out = await exportArtifact(client, artifactPath, { decision });
    console.log(`  exported → ${out.path}  (decision_state: ${out.decision})`);
  } finally {
    if (handle) await handle.stop();
  }
}

async function main(): Promise<void> {
  const sub = process.argv[2];
  const artifactPath = process.argv[3] && !process.argv[3].startsWith("--") ? resolve(process.argv[3]) : undefined;
  if (!sub || !artifactPath || sub === "--help" || sub === "-h") {
    console.log("usage: forsvn-collab <open|export> <artifact.md> [--base URL] [--decision approved|denied|suggested] [--no-open] [--keep-open]");
    process.exit(artifactPath ? 0 : 1);
  }
  if (sub === "open") return cmdOpen(artifactPath);
  if (sub === "export") {
    // export must stop its own server; do it inline rather than via withServer's noop finally
    const base = arg("--base");
    const projectRoot = findProjectRoot(artifactPath);
    const handle = base ? undefined : await startProofServer({ projectRoot });
    const baseUrl = base ? base.replace(/\/$/, "") : handle!.baseUrl;
    try {
      const out = await exportArtifact(new ProofClient(baseUrl), artifactPath, { decision: arg("--decision", "approved") as string });
      console.log(`  exported → ${out.path}  (decision_state: ${out.decision})`);
    } finally {
      if (handle) await handle.stop();
    }
    return;
  }
  console.error(`unknown subcommand: ${sub}`);
  process.exit(1);
}

main().then(() => process.exit(0)).catch((e) => { console.error(`forsvn-collab: ${e?.message || e}`); process.exit(1); });
