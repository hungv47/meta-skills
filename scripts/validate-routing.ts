#!/usr/bin/env bun
// Validate routing.yaml v2 across the stack.
//
// Soft-fail (warn unless --require-all): skill has no `capability:` section.
// Hard-fail (always): malformed capability section, path resolution failure,
// contract violations.

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DOMAINS, normalizeCapability, readCapabilityFiles, scanSkillDirs, type Capability } from "./lib/capabilities";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REQUIRE_ALL = process.argv.includes("--require-all");
const ORCHESTRATION_DEFAULTS = new Set(["single", "multi", "auto"]);
// Lifecycle taxonomy mirrors references/manifest-spec.md. Keep in sync.
const LIFECYCLE_VALUES = new Set([
  "canonical",
  "loop",
  "loop-context",
  "learning",
  "anchor",
  "registry",
  "decision",
  "spec",
  "strategy",
  "execution",
  "evaluation",
  "pipeline",
  "snapshot",
  "archive",
  "ephemeral",
]);

const skillDirs = scanSkillDirs(ROOT);
const capabilityFiles = readCapabilityFiles(ROOT);
const declaredCapabilityPaths = new Set(capabilityFiles.map((file) => file.relSkillDir));
const errors: string[] = [];
const warnings: string[] = [];

// Skills whose routing.yaml does NOT declare `capability:` at all -> warn (soft)
// unless --require-all flips it to error.
for (const skill of skillDirs) {
  if (!declaredCapabilityPaths.has(skill.relSkillDir)) {
    const msg = `${skill.relSkillDir}/routing.yaml: missing capability section`;
    if (REQUIRE_ALL) errors.push(msg);
    else warnings.push(msg);
  }
}

const wellFormedFiles = capabilityFiles.filter((file) => {
  if (file.malformed) {
    // Malformed sections are hard failures regardless of --require-all.
    errors.push(`${file.relPath}: ${file.malformedReason}`);
    return false;
  }
  return true;
});

for (const file of wellFormedFiles) {
  const capability = normalizeCapability(file);
  const prefix = file.relPath;

  if (capability.id !== file.id) errors.push(`${prefix}: capability.id must match directory name (${file.id})`);
  if (!DOMAINS.includes(capability.domain)) errors.push(`${prefix}: capability.domain must be one of ${DOMAINS.join(", ")}`);
  if (capability.domain !== file.domain) errors.push(`${prefix}: capability.domain must match parent directory (${file.domain})`);
  if (!capability.summary) errors.push(`${prefix}: capability.summary is required`);
  if (capability.summary.length > 180) warnings.push(`${prefix}: capability.summary is long (${capability.summary.length} chars)`);
  if (!Array.isArray(capability.aliases)) errors.push(`${prefix}: capability.aliases must be a list`);

  if (capability.public && !capability.command) errors.push(`${prefix}: public capability must declare command`);

  requireList(prefix, "capability.route.use_when", capability.route.use_when);
  requireList(prefix, "capability.route.not_when", capability.route.not_when);
  if (!ORCHESTRATION_DEFAULTS.has(capability.orchestration.default)) {
    errors.push(`${prefix}: capability.orchestration.default must be single, multi, or auto`);
  }
  requireList(prefix, "capability.orchestration.single_when", capability.orchestration.single_when);
  requireList(prefix, "capability.orchestration.multi_when", capability.orchestration.multi_when);
  requireList(prefix, "capability.orchestration.critic_required_when", capability.orchestration.critic_required_when);

  validateLoadPaths(file.skillDir, prefix, capability);
  validateArtifacts(prefix, capability);
}

const malformedCount = capabilityFiles.length - wellFormedFiles.length;
console.log(
  `[validate-routing] ${wellFormedFiles.length}/${skillDirs.length} skills have a well-formed capability section${malformedCount > 0 ? ` (${malformedCount} malformed)` : ""}.`,
);

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) {
  console.error(`[validate-routing] ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`[validate-routing] OK (${warnings.length} warning(s)).`);

function requireList(prefix: string, field: string, value: string[]): void {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${prefix}: ${field} must be a non-empty list`);
  }
}

function validateLoadPaths(skillDir: string, prefix: string, capability: Capability): void {
  const refs = [
    ...(capability.load?.always ?? []),
    ...(capability.load?.when ?? []).flatMap((entry) => entry.read),
  ];

  for (const ref of refs) {
    if (!ref) {
      errors.push(`${prefix}: load path cannot be empty`);
      continue;
    }
    if (ref.includes("[") || ref.startsWith(".forsvn/") || ref.startsWith("research/") || ref.startsWith("brand/") || ref.startsWith("architecture/")) {
      continue;
    }
    const candidates = ref.startsWith("skills/")
      ? [join(ROOT, ref)]
      : [join(skillDir, ref), join(ROOT, ref)];
    if (!candidates.some((candidate) => existsSync(candidate))) {
      errors.push(`${prefix}: load path does not exist: ${ref}`);
    }
  }
}

function validateArtifacts(prefix: string, capability: Capability): void {
  for (const artifact of capability.outputs?.artifacts ?? []) {
    if (!artifact.path) errors.push(`${prefix}: capability.outputs.artifacts[].path cannot be empty`);
    if (!artifact.lifecycle) {
      errors.push(`${prefix}: capability.outputs.artifacts[].lifecycle cannot be empty`);
    } else if (!LIFECYCLE_VALUES.has(artifact.lifecycle)) {
      errors.push(
        `${prefix}: capability.outputs.artifacts[].lifecycle=${artifact.lifecycle} is not in the manifest taxonomy (${[...LIFECYCLE_VALUES].join(", ")})`,
      );
    }
    if (!artifact.produced_when) errors.push(`${prefix}: capability.outputs.artifacts[].produced_when cannot be empty`);
  }
}
