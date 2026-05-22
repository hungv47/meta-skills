// SKILL.md and plugin metadata parsing.
// Reads the skill version from the repo's single .claude-plugin/plugin.json.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ROOT, fileStats } from "./io";

// Post-2.0 single-repo layout: skills live under skills/<stack>/<name>/.
const STACKS = ["meta", "research", "marketing", "product"] as const;
export type StackName = (typeof STACKS)[number];

export function locateSkill(name: string): { path: string; stack: StackName; version: string | null } | null {
  for (const stack of STACKS) {
    const skillPath = join(ROOT, "skills", stack, name, "SKILL.md");
    if (existsSync(skillPath)) {
      return { path: skillPath, stack, version: pluginVersion() };
    }
  }
  return null;
}

// The consolidated plugin carries a single version for all skills.
export function pluginVersion(): string | null {
  const pluginPath = join(ROOT, ".claude-plugin", "plugin.json");
  if (!existsSync(pluginPath)) return null;
  try {
    const plugin = JSON.parse(readFileSync(pluginPath, "utf8"));
    return plugin.version ?? null;
  } catch {
    return null;
  }
}

export function skillBodyStats(skillMdPath: string) {
  return fileStats(skillMdPath);
}

// Classify a Read tool call by what it touched.
// "skill-internal-ref" = file under the skill's own folder
// "skill-external-ref" = file under another skill's folder
// "artifact-read" = file under .forsvn/ or research/ or brand/ or architecture/
// "user-file" = anywhere else the user explicitly referenced
export type ReadCategory = "skill-internal-ref" | "skill-external-ref" | "artifact-read" | "user-file";

export function categorizeRead(filePath: string, skillFolder: string): ReadCategory {
  const abs = filePath.startsWith("/") ? filePath : join(ROOT, filePath);
  if (abs.startsWith(skillFolder + "/")) return "skill-internal-ref";
  // Any read of a file under another skill's folder = cross-skill leak.
  // The `_shared/` sync mechanism exists to avoid this; flag regardless of extension.
  if (abs.includes("/skills/")) return "skill-external-ref";
  if (
    abs.includes("/.forsvn/") ||
    abs.startsWith(join(ROOT, "research") + "/") ||
    abs.startsWith(join(ROOT, "brand") + "/") ||
    abs.startsWith(join(ROOT, "architecture") + "/")
  ) {
    return "artifact-read";
  }
  return "user-file";
}

export function skillFolder(skillMdPath: string): string {
  return dirname(skillMdPath);
}

// Sortable + collision-resistant run ID. Not a real ULID (no Crockford base32, no
// monotonic guarantee within ms) but functionally equivalent at our scale — collision
// probability with 8 base36 random chars ≈ 1 in 2.8e12 per same-ms run.
export function ulid(): string {
  const time = Date.now().toString(36).padStart(10, "0");
  const rand = Array.from({ length: 8 }, () => Math.floor(Math.random() * 36).toString(36)).join("");
  return `${time}${rand}`.toUpperCase();
}
