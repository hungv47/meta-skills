#!/usr/bin/env bun
// ledger-sync — derive T0 activation events from the artifact tree.
//
// The artifact frontmatter IS the event (audit Phase 8 §2): every reviewable
// artifact already records skill, stack, status, decision_state, and upstream —
// a complete, local, retroactive event log we already write. This reads that
// tree and appends the derived events to `.forsvn/ledger/events.jsonl`,
// idempotently (re-running is a no-op). NO network — T0 is a log file.
//
// Usage:
//   bun skills/bin/ledger-sync.ts [--root <path>] [--json]
//
// Emits per artifact (see references/event-schema.md):
//   artifact_produced   — always
//   decision_captured   — when decision_state ∈ {approved, denied, suggested}
//   workflow_chain      — when `upstream:` resolves to another known artifact id
//
// Schema + dedupe contract: references/event-schema.md (schema_version 1).

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseSimpleYaml } from "./lib/simple-yaml";
import { ARTIFACT_HOME, STATE_HOME } from "./lib/path-parser";
import { appendEvent, dateIso, dedupeKey, readEvents } from "./lib/ledger.mjs";

const DECISION_STATES = new Set(["approved", "denied", "suggested"]);

type Front = Record<string, unknown>;
type Artifact = { id: string; skill: string; stack: string; status: string; decision: string; date: string; upstream: string[] };
type Event = Record<string, unknown> & { event: string };

function extractFrontmatter(text: string): Front | null {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const block = text.slice(text.indexOf("\n") + 1, end);
  try {
    return parseSimpleYaml(block);
  } catch {
    return null;
  }
}

function toTokens(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.flatMap(toTokens);
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function walkArtifacts(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".archive")) continue; // skip archived programs
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walkArtifacts(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

function collectArtifacts(root: string): Artifact[] {
  const files = [
    ...walkArtifacts(join(root, ARTIFACT_HOME, "artifacts")),
    ...walkArtifacts(join(root, STATE_HOME, "artifacts")),
  ];
  const out: Artifact[] = [];
  for (const file of files) {
    const fm = extractFrontmatter(readFileSync(file, "utf8"));
    if (!fm) continue;
    const id = fm.id ? String(fm.id) : "";
    const skill = fm.skill ? String(fm.skill) : "";
    const stack = fm.stack ? String(fm.stack) : "";
    const status = fm.status ? String(fm.status) : "";
    if (!id || !skill || !stack || !status) continue; // need the envelope to be an event
    out.push({
      id,
      skill,
      stack,
      status,
      decision: fm.decision_state ? String(fm.decision_state) : "",
      date: fm.date ? String(fm.date) : "",
      upstream: toTokens(fm.upstream),
    });
  }
  return out;
}

function deriveEvents(artifacts: Artifact[]): Event[] {
  // workflow_chain fires only when upstream resolves to another PRODUCED artifact
  // (chaining two deliverables), not to a canonical doc.
  const ids = new Set(artifacts.map((a) => a.id));
  const events: Event[] = [];
  for (const a of artifacts) {
    const ts = dateIso(a.date);
    const chain = a.upstream.some((u) => u !== a.id && ids.has(u));
    events.push({
      event: "artifact_produced",
      ts,
      skill: a.skill,
      stack: a.stack,
      status: a.status,
      decision: a.decision || "pending",
      artifact: a.id,
      chain,
    });
    if (DECISION_STATES.has(a.decision)) {
      events.push({ event: "decision_captured", ts, skill: a.skill, stack: a.stack, decision: a.decision, artifact: a.id });
    }
    if (chain) {
      events.push({ event: "workflow_chain", ts, skill: a.skill, stack: a.stack, artifact: a.id });
    }
  }
  return events;
}

/** Idempotently append artifact-derived events. Returns counts. */
export function syncLedger(root = process.cwd()): { scanned: number; candidates: number; appended: number } {
  const artifacts = collectArtifacts(root);
  const candidates = deriveEvents(artifacts);
  const seen = new Set<string>();
  for (const e of readEvents(root)) {
    const k = dedupeKey(e as any);
    if (k) seen.add(k);
  }
  let appended = 0;
  for (const e of candidates) {
    const k = dedupeKey(e as any);
    if (!k || seen.has(k)) continue;
    if (appendEvent(e, root)) {
      seen.add(k);
      appended += 1;
    }
  }
  return { scanned: artifacts.length, candidates: candidates.length, appended };
}

if (import.meta.main) {
  const i = process.argv.indexOf("--root");
  const root = i > -1 ? process.argv[i + 1] : process.cwd();
  const asJson = process.argv.includes("--json");
  const r = syncLedger(root);
  if (asJson) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log(
      `[ledger-sync] ${r.scanned} artifact(s) scanned · ${r.candidates} derivable event(s) · ${r.appended} new appended` +
        (r.appended === 0 ? " (ledger already current)" : ""),
    );
  }
}
