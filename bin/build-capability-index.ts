#!/usr/bin/env bun
// Build references/capability-index.json from adopted capability.yaml files.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeCapability, readCapabilityFiles } from "./lib/capabilities";

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
  console.log(`[build-capability-index] Index is current (${capabilities.length} capabilities).`);
  process.exit(0);
}

writeFileSync(OUT_PATH, next);
console.log(`[build-capability-index] Wrote ${capabilities.length} capabilities to references/capability-index.json.`);

