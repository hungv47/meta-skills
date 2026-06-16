// ledger — shared runtime for the T0 local activation ledger.
//
// ONE source of truth for: where the ledger lives, the salted project hash, and
// append/read. Plain ESM with node builtins only, so BOTH the node `.mjs` plugin
// hooks AND the Bun `.ts` bin scripts import it and agree on the project hash
// (events from a hook and from `ledger-sync` must group under the same project).
//
// Invariant: T0 never opens a socket. Nothing here makes a network call. Keep it
// that way — egress is the T1 forwarder's job, opt-in and off by default.
// Schema + taxonomy: ../../references/event-schema.md (schema_version 1).

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { dirname, join, parse } from "node:path";
import { homedir } from "node:os";

export const LEDGER_VERSION = 1;
const MARKER = ".forsvn";

/** Nearest ancestor of `from` that contains a `.forsvn/` dir, or null. */
export function findProjectRoot(from) {
  let dir = from;
  // Walk up to the filesystem root.
  for (;;) {
    if (existsSync(join(dir, MARKER))) return dir;
    const parent = dirname(dir);
    if (parent === dir || parent === parse(dir).root) {
      return existsSync(join(parent, MARKER)) ? parent : null;
    }
    dir = parent;
  }
}

/**
 * Resolve the ledger context for a working directory.
 * Returns { dir, projectRoot } — `dir` is the per-project `.forsvn/ledger` when a
 * marker exists, else the global `~/.forsvn/ledger`. `projectRoot` is what the
 * project hash is computed from (the marker dir, or `cwd` as a stable fallback).
 */
export function resolveLedger(cwd = process.cwd()) {
  const projectRoot = findProjectRoot(cwd);
  if (projectRoot) {
    return { dir: join(projectRoot, MARKER, "ledger"), projectRoot };
  }
  return { dir: join(homedir(), MARKER, "ledger"), projectRoot: cwd };
}

function realOrSelf(p) {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}

/**
 * Read (creating on first use) the per-machine salt. The salt makes the project
 * hash uncorrelatable across users — it lives only in the ledger dir and is never
 * shared. Returns a 32-hex string. Never throws (falls back to an ephemeral salt
 * if the dir is unwritable, so hashing still works in a read-only context).
 */
export function getSalt(dir) {
  const saltFile = join(dir, ".salt");
  try {
    if (existsSync(saltFile)) {
      const s = readFileSync(saltFile, "utf8").trim();
      if (/^[0-9a-f]{16,}$/.test(s)) return s;
    }
    mkdirSync(dir, { recursive: true });
    const salt = randomBytes(16).toString("hex");
    writeFileSync(saltFile, salt + "\n");
    return salt;
  } catch {
    return "forsvn-unsalted";
  }
}

/** Salted, content-free project id: sha256(salt + ":" + realpath)[:12]. */
export function projectHash(projectRoot, salt) {
  return createHash("sha256")
    .update(salt + ":" + realOrSelf(projectRoot))
    .digest("hex")
    .slice(0, 12);
}

/** Current wall-clock as ISO-8601 Z (session events). */
export function nowIso() {
  return new Date().toISOString();
}

/** A calendar date (YYYY-MM-DD) → midnight-Z ISO (artifact events). */
export function dateIso(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00.000Z` : nowIso();
}

/**
 * Append one event line. `event` must carry at least `{ event }`; the envelope
 * (`v`, `ts`, `project`) is filled here unless already present. NEVER throws —
 * returns true on success, false on any failure (a ledger write must never break
 * a hook or a skill run).
 */
export function appendEvent(event, cwd = process.cwd()) {
  try {
    const { dir, projectRoot } = resolveLedger(cwd);
    mkdirSync(dir, { recursive: true });
    const salt = getSalt(dir);
    const line = {
      v: LEDGER_VERSION,
      ts: event.ts ?? nowIso(),
      event: event.event,
      project: event.project ?? projectHash(projectRoot, salt),
      ...stripEnvelope(event),
    };
    appendFileSync(join(dir, "events.jsonl"), JSON.stringify(line) + "\n");
    return true;
  } catch {
    return false;
  }
}

function stripEnvelope(e) {
  const { v, ts, event, project, ...rest } = e;
  return rest;
}

/** Read + parse the ledger for `cwd`'s context. Skips malformed lines. */
export function readEvents(cwd = process.cwd()) {
  const { dir } = resolveLedger(cwd);
  const file = join(dir, "events.jsonl");
  if (!existsSync(file)) return [];
  const out = [];
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      // skip malformed
    }
  }
  return out;
}

/** Stable dedupe key for an artifact-derived event (so sync is idempotent). */
export function dedupeKey(e) {
  switch (e.event) {
    case "artifact_produced":
      return `produced|${e.artifact}`;
    case "decision_captured":
      return `decision|${e.artifact}|${e.decision}`;
    case "workflow_chain":
      return `chain|${e.artifact}`;
    default:
      return null;
  }
}
