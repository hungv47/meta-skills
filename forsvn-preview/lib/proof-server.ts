// proof-server — supervise a local Proof doc-server as a child process.
//
// Part of the collaborative-doc surface (ADR docs/adr/2026-06-08-proof-collab-docs.md, U4).
// Mirrors the "spawn a local server, bind loopback, clean lifecycle" muscle of
// bin/forsvn-preview.ts, but for a Node child process instead of Bun.serve.
//
// Invariants enforced here (ADR D3/D4):
//   - loopback bind only (127.0.0.1)            — not an outbound connection
//   - SQLite-local storage under .forsvn/proof/ — no S3/cloud (assertLocalOnly)
//   - the Node runtime is resolved at runtime, never bundled into the app
//
// Proof is NOT vendored into this repo (397 npm packages). Install it once and
// point the launcher at it via FORSVN_PROOF_DIR (or pass `proofDir`). Pin the
// install to a known commit — Proof is 0.1.0 and churns (KTD-6).

import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { createServer } from "node:net";

export interface ProofServerOptions {
  /** Project root whose .forsvn/proof/ holds this server's working state. */
  projectRoot: string;
  /** Proof SDK install dir (has server/index.ts + node_modules). Default: $FORSVN_PROOF_DIR. */
  proofDir?: string;
  /** Node binary. Default: $FORSVN_NODE_BIN or "node" on PATH. */
  nodeBin?: string;
  /** Port to bind. Default: an OS-allocated free port. */
  port?: number;
  /** Auto-stop after this much idle time. Default: 30 min. 0 disables. */
  idleTimeoutMs?: number;
  /** Create-endpoint auth mode. Default "none" (per-doc tokens still scope access). */
  authMode?: "none" | "api_key";
  /** Readiness timeout. Default 45s (first run compiles via tsx). */
  readyTimeoutMs?: number;
}

export interface ProofServerHandle {
  baseUrl: string;
  port: number;
  /** Reset the idle timer — call on each request through this server. */
  touch(): void;
  /** Stop the server and clear timers. Idempotent. */
  stop(): Promise<void>;
}

/**
 * Refuse to run against cloud storage or a non-loopback bind. The whole
 * local-first guarantee (ADR D4) rests on this — a misconfigured env that
 * points snapshots at S3 must fail closed, not silently exfiltrate.
 */
export function assertLocalOnly(env: NodeJS.ProcessEnv): void {
  const cloud = Object.keys(env).filter(
    (k) => /^(AWS_|SNAPSHOT_S3_)/.test(k) && (env[k] ?? "").trim() !== "",
  );
  if (cloud.length > 0) {
    throw new Error(
      `proof-server: refusing to start — cloud storage env set (${cloud.join(", ")}). ` +
        `The collaborative-doc surface is local-only (ADR D4). Unset these.`,
    );
  }
  const host = (env.COLLAB_HOST ?? "").trim();
  if (host && host !== "127.0.0.1" && host !== "localhost") {
    throw new Error(`proof-server: refusing non-loopback COLLAB_HOST="${host}" (ADR D4).`);
  }
}

async function freePort(): Promise<number> {
  return new Promise((res, rej) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", rej);
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      if (addr && typeof addr === "object") {
        const p = addr.port;
        srv.close(() => res(p));
      } else {
        srv.close(() => rej(new Error("could not allocate a port")));
      }
    });
  });
}

function resolveProofDir(opts: ProofServerOptions): string {
  const dir = opts.proofDir ?? process.env.FORSVN_PROOF_DIR;
  if (!dir) {
    throw new Error(
      "proof-server: no Proof install found. Set FORSVN_PROOF_DIR to a pinned " +
        "proof-sdk checkout (with node_modules), or pass { proofDir }.",
    );
  }
  const abs = resolve(dir);
  if (!existsSync(join(abs, "server", "index.ts"))) {
    throw new Error(`proof-server: ${abs} is not a Proof SDK dir (no server/index.ts).`);
  }
  if (!existsSync(join(abs, "node_modules"))) {
    throw new Error(`proof-server: ${abs} has no node_modules — run \`npm install\` there first.`);
  }
  return abs;
}

async function waitForReady(baseUrl: string, timeoutMs: number, alive: () => boolean, deadlineErr: () => string): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!alive()) throw new Error(`proof-server: process exited before becoming ready.\n${deadlineErr()}`);
    try {
      const r = await fetch(baseUrl, { method: "GET" });
      if (r.status >= 200 && r.status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((res) => setTimeout(res, 300));
  }
  throw new Error(`proof-server: not ready after ${timeoutMs}ms.\n${deadlineErr()}`);
}

export async function startProofServer(opts: ProofServerOptions): Promise<ProofServerHandle> {
  const proofDir = resolveProofDir(opts);
  const port = opts.port ?? (await freePort());
  const baseUrl = `http://127.0.0.1:${port}`;
  const dataDir = join(resolve(opts.projectRoot), ".forsvn", "proof");
  mkdirSync(join(dataDir, "snapshots"), { recursive: true });
  const discoveryFile = join(dataDir, "server.json");

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PORT: String(port),
    COLLAB_HOST: "127.0.0.1",
    DATABASE_PATH: join(dataDir, "proof.db"),
    SNAPSHOT_DIR: join(dataDir, "snapshots"),
    // Trust boundary (ADR D4, single-operator local model): the doc-server runs
    // AUTH_MODE=none on a loopback port. The MCP proxy being suggest-only stops
    // the SANCTIONED agent path from accepting — but a shell-capable agent could
    // curl /ops directly and self-accept in Proof WORKING state. That does NOT
    // approve the artifact: canonical decision_state is written only by the
    // operator-run `forsvn collab export`, and the operator reviews the editor
    // before exporting. Residual risk = un-reviewed body reaching canonical if the
    // operator exports without looking. Hardening follow-up (deferred, out of the
    // accepted threat model): an owner-scoped accept token the proxy never holds.
    PROOF_SHARE_MARKDOWN_AUTH_MODE: opts.authMode ?? "none",
    PROOF_LEGACY_CREATE_MODE: "allow",
    // Proof ships projection repair OFF, which leaves docs containing GFM tables
    // stuck in PROJECTION_STALE forever — agent /ops never succeed on them (spike
    // finding; real FORSVN artifacts are table-heavy). Enabling the repair worker
    // makes table docs settle in ~tens of ms. Export is unaffected either way.
    COLLAB_PROJECTION_REPAIR_WORKER_ENABLED: "true",
    COLLAB_ON_DEMAND_PROJECTION_REPAIR_ENABLED: "true",
    COLLAB_STARTUP_RECONCILE_ENABLED: "true",
    COLLAB_PROJECTION_REPAIR_WORKER_INTERVAL_MS: "500",
    COLLAB_PROJECTION_REPAIR_WORKER_MIN_CHARS: "0",
  };
  // Strip any inherited cloud config before the guard, then assert.
  for (const k of Object.keys(env)) if (/^(AWS_|SNAPSHOT_S3_)/.test(k)) delete env[k];
  assertLocalOnly(env);

  const nodeBin = opts.nodeBin ?? process.env.FORSVN_NODE_BIN ?? "node";
  const recentLog: string[] = [];
  const keepLog = (chunk: Uint8Array) => {
    const s = new TextDecoder().decode(chunk);
    recentLog.push(s);
    while (recentLog.length > 40) recentLog.shift();
  };

  // `npm run serve` === `tsx server/index.ts`. Spawn npm so we don't assume the
  // tsx resolution path; the Proof dir owns its toolchain.
  const proc = Bun.spawn(["npm", "run", "serve"], {
    cwd: proofDir,
    env: { ...env, FORSVN_NODE_BIN: nodeBin },
    stdout: "pipe",
    stderr: "pipe",
  });
  void pump(proc.stdout, keepLog);
  void pump(proc.stderr, keepLog);

  let stopped = false;
  const onProcessExit = () => { try { proc.kill(); } catch { /* already gone */ } };
  process.once("exit", onProcessExit);
  process.once("SIGINT", onProcessExit);
  process.once("SIGTERM", onProcessExit);

  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const idleMs = opts.idleTimeoutMs ?? 30 * 60 * 1000;
  const handle: ProofServerHandle = {
    baseUrl,
    port,
    touch() {
      if (!idleMs || stopped) return;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => void handle.stop(), idleMs);
    },
    async stop() {
      if (stopped) return;
      stopped = true;
      if (idleTimer) clearTimeout(idleTimer);
      process.removeListener("exit", onProcessExit);
      process.removeListener("SIGINT", onProcessExit);
      process.removeListener("SIGTERM", onProcessExit);
      try { proc.kill(); } catch { /* already gone */ }
      await proc.exited.catch(() => {});
      try { rmSync(discoveryFile); } catch { /* already gone */ }
    },
  };

  try {
    await waitForReady(baseUrl, opts.readyTimeoutMs ?? 45_000, () => proc.exitCode === null, () => recentLog.join(""));
  } catch (err) {
    await handle.stop();
    throw err;
  }
  // Discovery file: forsvn-mcp reads this to find the running doc-server (the
  // two processes coordinate through the filesystem, never shared memory).
  writeFileSync(discoveryFile, JSON.stringify({ baseUrl, port, pid: proc.pid }, null, 2));
  handle.touch();
  return handle;
}

async function pump(stream: ReadableStream<Uint8Array> | undefined, onChunk: (c: Uint8Array) => void): Promise<void> {
  if (!stream) return;
  const reader = stream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) onChunk(value);
    }
  } catch {
    /* stream closed on shutdown */
  }
}
