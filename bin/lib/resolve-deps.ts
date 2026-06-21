#!/usr/bin/env bun
// resolve-deps.ts — the prerequisite DAG resolver (A5).
//
// Given a target capability, traverse route.prerequisites.hard and auto-insert the
// missing PRODUCERS as earlier plan.md steps (e.g. write-ad needs ICP → insert
// research-icp), computing today's hand-coded "hard requires X" prose into one
// ordered plan. A pure index traversal — reads the capability index, never mutates
// routing.yaml.
//
// Two prereq forms (both live in the index today):
//   - `id:<x>`     → resolved via the producer map (outputs.artifacts[].id == x).
//   - raw path     → no producer cap → a human-supplied INPUT, surfaced not inserted.
//
// Used by bin/plan.ts + the /forsvn planner (the lib), by build-capability-index
// --check (assertPrereqDag), and as a CLI (`bun bin/lib/resolve-deps.ts <capId>`).

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readLedger, onDiskFromLedger } from "./knowledge";

export interface IndexCap {
  id: string;
  route?: { prerequisites?: { hard?: string[] } };
  outputs?: { artifacts?: Array<{ id?: string }> };
}
export type CapabilityIndex = Record<string, IndexCap>;

export interface ResolvedStep {
  capId: string;        // producer to insert (e.g. "research-icp")
  satisfies: string[];  // prereq id(s) it covers (e.g. ["id:icp-research","id:product-context"])
  depends_on: string[]; // upstream producer capIds
}
export interface Unresolvable {
  prereq: string;       // the raw-path / no-producer prereq
  reason: "no-producer";
}

// Build the producer map from the index: artifact id -> producing capability id.
export function buildProducerMap(index: CapabilityIndex): Record<string, string> {
  const map: Record<string, string> = {};
  for (const cap of Object.values(index)) {
    for (const a of cap.outputs?.artifacts ?? []) {
      if (a.id && !(a.id in map)) map[a.id] = cap.id;
    }
  }
  return map;
}

/**
 * Resolve a target capability's hard prerequisites into ordered producer steps.
 * - `id:<x>` whose producer artifact is absent on disk → an inserted producer step
 *   (transitively, with depends_on edges); deduped by producer capId.
 * - `id:<x>` already on disk (`onDisk(x) === true`) → skipped (A7 avoids re-running).
 * - raw-path / no-producer prereqs → returned as `inputs` (human-supplied), never fabricated.
 * Steps come back in topological order (producers before consumers). Throws on a cycle.
 */
export function resolveDeps(
  targetCapId: string,
  index: CapabilityIndex,
  onDisk: (artifactId: string) => boolean = () => false,
): { steps: ResolvedStep[]; inputs: Unresolvable[] } {
  const producers = buildProducerMap(index);
  const stepsByCap = new Map<string, ResolvedStep>(); // memoize + dedupe
  const inputs: Unresolvable[] = [];
  const seenInputs = new Set<string>();
  const order: string[] = [];        // topological insertion order
  const inStack = new Set<string>(); // cycle detection (producer capIds)

  function visit(capId: string, trail: string[]): void {
    const cap = index[capId];
    if (!cap) return;
    if (inStack.has(capId)) throw new Error(`prerequisite cycle: ${[...trail, capId].join(" → ")}`);
    inStack.add(capId);
    for (const prereq of cap.route?.prerequisites?.hard ?? []) {
      if (prereq.startsWith("id:")) {
        const artifactId = prereq.slice(3);
        if (onDisk(artifactId)) continue;                 // already produced — don't re-insert
        const producer = producers[artifactId];
        if (!producer) {                                  // an id: with no producer is a dangling ref
          if (!seenInputs.has(prereq)) { inputs.push({ prereq, reason: "no-producer" }); seenInputs.add(prereq); }
          continue;
        }
        if (producer === capId) continue;                 // self-loop — a cap producing its own prereq id
        // recurse into the producer's own prereqs first (producers before consumers)
        visit(producer, [...trail, capId]);
        const existing = stepsByCap.get(producer);
        if (existing) {
          if (!existing.satisfies.includes(prereq)) existing.satisfies.push(prereq);
        } else {
          stepsByCap.set(producer, { capId: producer, satisfies: [prereq], depends_on: [] });
          order.push(producer);
        }
      } else {
        if (!seenInputs.has(prereq)) { inputs.push({ prereq, reason: "no-producer" }); seenInputs.add(prereq); }
      }
    }
    inStack.delete(capId);
  }

  visit(targetCapId, []);

  // depends_on: a producer step depends on any earlier-ordered producer step that
  // itself produces one of this producer's hard id: prereqs.
  for (const step of stepsByCap.values()) {
    const cap = index[step.capId];
    for (const prereq of cap?.route?.prerequisites?.hard ?? []) {
      if (!prereq.startsWith("id:")) continue;
      const up = producers[prereq.slice(3)];
      if (up && up !== step.capId && stepsByCap.has(up)) step.depends_on.push(up);
    }
  }

  return { steps: order.map((c) => stepsByCap.get(c)!), inputs };
}

/**
 * Assert the whole index's `id:` prerequisite graph is a valid DAG. Returns the
 * list of problems (empty = ok): a cycle, or an `id:<x>` prereq with no producer.
 * Raw-path prereqs are exempt (they're inputs, not produced caps). Used by
 * build-capability-index.ts --check.
 */
export function assertPrereqDag(index: CapabilityIndex): string[] {
  const producers = buildProducerMap(index);
  const problems: string[] = [];

  for (const cap of Object.values(index)) {
    for (const prereq of cap.route?.prerequisites?.hard ?? []) {
      if (prereq.startsWith("id:") && !producers[prereq.slice(3)]) {
        problems.push(`${cap.id}: hard prereq ${prereq} has no producer (dangling id: reference)`);
      }
    }
  }

  // cycle detection over cap → producer(of its id: prereqs) edges
  const color = new Map<string, number>(); // 0 unseen, 1 in-stack, 2 done
  const stack: string[] = [];
  function dfs(capId: string): boolean {
    if (color.get(capId) === 2) return false;
    if (color.get(capId) === 1) { problems.push(`prereq cycle: ${[...stack.slice(stack.indexOf(capId)), capId].join(" → ")}`); return true; }
    color.set(capId, 1); stack.push(capId);
    for (const prereq of index[capId]?.route?.prerequisites?.hard ?? []) {
      if (!prereq.startsWith("id:")) continue;
      const up = producers[prereq.slice(3)];
      if (up && up !== capId && dfs(up)) { stack.pop(); color.set(capId, 2); return true; }
    }
    stack.pop(); color.set(capId, 2);
    return false;
  }
  for (const id of Object.keys(index)) if (color.get(id) !== 2) { if (dfs(id)) break; }

  return problems;
}

// --- CLI --------------------------------------------------------------------
if (import.meta.main) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const optAfter = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };
  const target = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--root" && args[i - 1] !== "--ledger-root");
  const root = optAfter("--root") ?? join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const index = (JSON.parse(readFileSync(join(root, "references", "capability-index.json"), "utf8")).capabilities) as CapabilityIndex;
  if (!target) {
    const problems = assertPrereqDag(index);
    if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
    console.log("prereq graph: OK (DAG, no dangling id: producers)");
    process.exit(0);
  }
  if (!index[target]) { console.error(`no capability ${JSON.stringify(target)}`); process.exit(1); }
  // A7 bridge: read the knowledge ledger from the PROJECT root (host CWD at dispatch,
  // overridable via --ledger-root — distinct from --root, which is the skills dir).
  // A ledger fact that passes the reuse gate marks its producer's output as on-disk, so
  // resolve-deps skips re-inserting that producer. Each skip is narrated (visible, never silent).
  const ledgerRoot = optAfter("--ledger-root") ?? process.cwd();
  const ledger = readLedger(ledgerRoot);
  const reuse: string[] = [];
  const onDisk = onDiskFromLedger(ledger, { narrate: (line) => reuse.push(line) });
  try {
    const { steps, inputs } = resolveDeps(target, index, onDisk);
    if (json) { console.log(JSON.stringify({ target, steps, inputs, reuse }, null, 2)); process.exit(0); }
    console.log(`resolve-deps for ${target}:`);
    if (!steps.length) console.log("  (no producers to insert — prereqs are inputs or already satisfied)");
    for (const s of steps) console.log(`  insert ${s.capId} (satisfies ${s.satisfies.join(", ")}${s.depends_on.length ? `; after ${s.depends_on.join(", ")}` : ""})`);
    for (const i of inputs) console.log(`  input  ${i.prereq} (${i.reason}) — human-supplied`);
    for (const line of reuse) console.log(`  reuse  ${line}`); // ledger-backed skip, surfaced not silent
    process.exit(0);
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
}
