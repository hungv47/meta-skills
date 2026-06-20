#!/usr/bin/env bun
// Build references/capability-index.json from adopted capability.yaml files.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeCapability, readCapabilityFiles } from "./lib/capabilities";
import { assertPrereqDag, type CapabilityIndex } from "./lib/resolve-deps";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_PATH = join(ROOT, "references", "capability-index.json");

const capabilityFiles = readCapabilityFiles(ROOT);
for (const file of capabilityFiles) {
  if (file.malformed) {
    console.warn(`[build-capability-index] Skipping ${file.relPath}: ${file.malformedReason}`);
  }
}
const capabilities = capabilityFiles
  .filter((file) => !file.malformed)
  .map(normalizeCapability)
  .sort((a, b) => a.id.localeCompare(b.id));

const index = {
  version: 1,
  schema: "references/capability-schema.md",
  capabilities: Object.fromEntries(capabilities.map((capability) => [capability.id, capability])),
};

const next = JSON.stringify(index, null, 2) + "\n";

// A5: the prerequisite `id:` graph must be a DAG with every id: prereq backed by a
// producer (a dangling id: or a cycle is a routing bug). Validated on every build.
const dagProblems = assertPrereqDag(index.capabilities as unknown as CapabilityIndex);

// A4: every capability must carry a valid gate_class (auto | review | publish).
// normalizeCapability already defaults absent/malformed to "review", so this only
// trips on a future schema/normalizer drift — it pins the round-trip invariant.
const GATE_CLASSES = new Set(["auto", "review", "publish"]);
const gateProblems = capabilities
  .filter((c) => !GATE_CLASSES.has(c.gate_class))
  .map((c) => `${c.id}: gate_class ${JSON.stringify(c.gate_class)} invalid (expected auto | review | publish)`);

if (process.argv.includes("--check")) {
  if (!existsSync(OUT_PATH)) {
    console.error("[build-capability-index] Missing references/capability-index.json.");
    process.exit(1);
  }
  const current = readFileSync(OUT_PATH, "utf-8");
  if (current !== next) {
    console.error("[build-capability-index] capability-index.json is stale. Run `bun bin/build-capability-index.ts`.");
    process.exit(1);
  }
  if (dagProblems.length) {
    console.error("[build-capability-index] prerequisite DAG invalid:");
    for (const p of dagProblems) console.error(`  - ${p}`);
    process.exit(1);
  }
  if (gateProblems.length) {
    console.error("[build-capability-index] gate_class invalid:");
    for (const p of gateProblems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(`[build-capability-index] Index is current (${capabilities.length} capabilities); prereq DAG valid; gate_class round-trips.`);
  process.exit(0);
}

if (dagProblems.length) {
  console.warn("[build-capability-index] WARNING — prerequisite DAG problems (fix routing.yaml hard prereqs):");
  for (const p of dagProblems) console.warn(`  - ${p}`);
}

writeFileSync(OUT_PATH, next);
console.log(`[build-capability-index] Wrote ${capabilities.length} capabilities to references/capability-index.json.`);

