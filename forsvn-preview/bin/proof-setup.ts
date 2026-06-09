#!/usr/bin/env bun
// proof-setup — one-time onboarding for the Proof collaborative-doc tier.
//
// Turns the multi-step Proof prerequisite (clone → npm install → set env) into
// one guided command. Idempotent: if FORSVN_PROOF_DIR already points at a valid
// checkout, it reports ready and does nothing.
//
//   bun proof-setup.ts                 # set up at the default dir
//   bun proof-setup.ts --dir ~/proof   # custom install dir
//   FORSVN_PROOF_REF=<commit|tag> …    # pin the checkout (strongly recommended)
//
// What `proof-server.ts` requires (kept in sync with it): the dir must contain
// `server/index.ts` and `node_modules`; Node ≥18 on PATH (or $FORSVN_NODE_BIN).

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { homedir } from "node:os";

const REPO = "https://github.com/EveryInc/proof-sdk.git";
const DEFAULT_DIR = join(homedir(), "proof-sdk");

function out(msg: string): void { process.stdout.write(`${msg}\n`); }
function warn(msg: string): void { process.stderr.write(`[proof-setup] ${msg}\n`); }

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function run(cmd: string, args: string[], cwd?: string): boolean {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit" });
  return r.status === 0;
}

function nodeBin(): string { return process.env.FORSVN_NODE_BIN ?? "node"; }

function nodeMajor(): number | null {
  const r = spawnSync(nodeBin(), ["--version"], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const m = (r.stdout ?? "").match(/v(\d+)\./);
  return m ? Number(m[1]) : null;
}

function isValidProofDir(dir: string): boolean {
  return existsSync(join(dir, "server", "index.ts")) && existsSync(join(dir, "node_modules"));
}

function main(): number {
  // Node preflight (Proof is a Node app).
  const major = nodeMajor();
  if (major === null) {
    warn(`Node not found (tried "${nodeBin()}"). Install Node 18+ or set FORSVN_NODE_BIN. https://nodejs.org`);
    return 1;
  }
  if (major < 18) {
    warn(`Node ${major} is too old — Proof needs 18+. Upgrade or set FORSVN_NODE_BIN to a newer node.`);
    return 1;
  }

  // Already set up?
  const fromEnv = process.env.FORSVN_PROOF_DIR;
  if (fromEnv && isValidProofDir(resolve(fromEnv))) {
    out(`✓ Proof ready at FORSVN_PROOF_DIR=${fromEnv}`);
    out(`  Node ${major} · server/index.ts + node_modules present. Nothing to do.`);
    return 0;
  }

  const dir = resolve(arg("--dir") ?? fromEnv ?? DEFAULT_DIR);
  const ref = process.env.FORSVN_PROOF_REF;

  // Clone if absent.
  if (!existsSync(join(dir, "server", "index.ts"))) {
    out(`Cloning Proof SDK → ${dir}`);
    if (!run("git", ["clone", REPO, dir])) { warn(`git clone failed.`); return 1; }
  } else {
    out(`Proof checkout already at ${dir}`);
  }

  // Pin the checkout. Proof is 0.1.0 and churns (KTD-6 / R4): an unpinned main
  // can break the export contract validated in the spike. We refuse to silently
  // sit on a moving target — pin via FORSVN_PROOF_REF or accept the warning.
  if (ref) {
    out(`Pinning to ${ref}`);
    if (!run("git", ["-C", dir, "fetch", "--all", "--tags"]) || !run("git", ["-C", dir, "checkout", ref])) {
      warn(`could not check out FORSVN_PROOF_REF="${ref}" — verify it's a real commit/tag.`);
      return 1;
    }
  } else {
    warn(`UNPINNED: cloned the default branch. Proof churns — set FORSVN_PROOF_REF to a`);
    warn(`known-good commit/tag and re-run to pin (the export contract is ref-sensitive).`);
  }

  // Install deps.
  out(`Installing dependencies (npm install)…`);
  if (!run("npm", ["install"], dir)) { warn(`npm install failed in ${dir}.`); return 1; }

  if (!isValidProofDir(dir)) {
    warn(`setup finished but ${dir} is still missing server/index.ts or node_modules.`);
    return 1;
  }

  out(``);
  out(`✓ Proof installed at ${dir}`);
  out(`  Add this to your shell profile (and the current session):`);
  out(``);
  out(`    export FORSVN_PROOF_DIR="${dir}"`);
  out(``);
  out(`  Then: forsvn-collab open <artifact.md>  (or /forsvn:collab).`);
  return 0;
}

process.exit(main());
