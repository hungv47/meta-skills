// runs — read the observed run-record event log (U8: the read side of U6's Rust
// writer). Reads `<root>/.forsvn/runs/events.jsonl` DIRECTLY — NOT through the MCP
// server — per the on-disk contract pinned in `crates/forsvn-core/src/runs.rs`:
// one `{ ts, skill, artifact_id, session, gate }` per line; correlation
// `artifact_id == manifest by_id key`.
//
// Provenance only. This is read-only and never writes a decision (KD4/KD5). An
// artifact with a matching run is an OBSERVED run, not proof its critic gates fired
// (KTD3) — the UI copy must say "observed run", never a bare "Verified".

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface RunEvent {
  ts: string;
  skill: string;
  artifact_id: string | null;
  session: string | null;
  gate: string | null;
}

export function runsPath(root: string): string {
  return join(root, ".forsvn", "runs", "events.jsonl");
}

/** Read all observed run-records, oldest first. Missing file → []. A malformed
 *  line is skipped — append-only provenance, not a transaction store, so one torn
 *  write must not blind the whole read path (mirrors the Rust reader). */
export function readRuns(root: string): RunEvent[] {
  const path = runsPath(root);
  if (!existsSync(path)) return [];
  const out: RunEvent[] = [];
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      const e = JSON.parse(t) as RunEvent;
      if (e && typeof e.skill === "string") out.push(e);
    } catch {
      // skip a torn line
    }
  }
  return out;
}

/** The set of artifact ids with at least one observed run — the verified /
 *  unverified discriminator (AE1). Derived by presence; no manifest field (KTD3). */
export function observedRunIds(root: string): Set<string> {
  const ids = new Set<string>();
  for (const e of readRuns(root)) {
    if (e.artifact_id) ids.add(e.artifact_id);
  }
  return ids;
}

/** The disk-observable cold-state signal for the co-work shell (U10). True when
 *  there is NO evidence on disk that an agent has ever oriented in this workspace
 *  — neither a `/forsvn` routing record nor any observed run. This is deliberately
 *  NOT the MCP server's in-memory `workspace_entered` flag, which the Bun web
 *  server cannot read (the U1/U2 note).
 *
 *  Threshold-free and honest: it surfaces the never-entered case (AE4). It does
 *  NOT detect a STALE session (an agent that oriented days ago) — that needs a
 *  recency threshold, deferred until dogfooding measures one (plan OPEN RESIDUAL). */
export function workspaceIsCold(root: string): boolean {
  if (existsSync(join(root, ".forsvn", "routing", "last-session.md"))) return false;
  return observedRunIds(root).size === 0;
}
