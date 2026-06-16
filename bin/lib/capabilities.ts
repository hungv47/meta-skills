import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseSimpleYaml, type YamlValue } from "./simple-yaml";

export const DOMAINS = ["meta", "research", "marketing", "product"] as const;
export type Domain = (typeof DOMAINS)[number];

// Base dirs (relative to the skills/ root) that hold <domain>/<skill>/ trees.
// forsvn's growth skills live under skills/; the 9 engineering skills were
// carved into the forsvn-dev package at forsvn-dev/skills/ — out of forsvn's
// Codex discovery glob (skills/skills/) — but they are still part of this repo,
// still ship to the mirror, and must be discovered by every gate/quality check.
// Plugin INSTALL membership is governed by each manifest's skills[]; gate
// DISCOVERY (here) intentionally spans both roots. Keep in sync with the inlined
// SKILL_ROOTS copies in _dev/ and hooks/ scripts that can't import this module.
export const SKILL_ROOTS = ["skills", "forsvn-dev/skills"] as const;

export type Capability = {
  id: string;
  domain: Domain;
  public: boolean;
  command?: string;
  summary: string;
  aliases?: string[];
  route: {
    use_when: string[];
    not_when: string[];
    prerequisites?: {
      recommended?: string[];
      hard?: string[];
    };
  };
  orchestration: {
    default: "single" | "multi" | "auto";
    single_when: string[];
    multi_when: string[];
    critic_required_when: string[];
  };
  load?: {
    always?: string[];
    when?: Array<{
      if: string;
      read: string[];
    }>;
  };
  outputs?: {
    artifacts?: Array<{
      path: string;
      id?: string;
      lifecycle: string;
      produced_when: string;
    }>;
  };
  source: string;
  skill_path: string;
};

export type CapabilityFile = {
  domain: Domain;
  id: string;
  skillDir: string;
  relSkillDir: string;
  relPath: string;
  data: Record<string, YamlValue>;
  malformed: boolean;
  malformedReason?: string;
};

function asString(value: YamlValue | undefined, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: YamlValue | undefined): boolean {
  return value === true;
}

function asStringArray(value: YamlValue | undefined): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asObject(value: YamlValue | undefined): Record<string, YamlValue> {
  return value && !Array.isArray(value) && typeof value === "object" ? value : {};
}

function asArtifactArray(value: YamlValue | undefined): Capability["outputs"]["artifacts"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && !Array.isArray(item) && typeof item === "object")
    .map((item) => {
      const obj = item as Record<string, YamlValue>;
      const id = asString(obj.id);
      return {
        path: asString(obj.path),
        ...(id ? { id } : {}),
        lifecycle: asString(obj.lifecycle),
        produced_when: asString(obj.produced_when),
      };
    });
}

function asLoadWhen(value: YamlValue | undefined): NonNullable<Capability["load"]>["when"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && !Array.isArray(item) && typeof item === "object")
    .map((item) => {
      const obj = item as Record<string, YamlValue>;
      return {
        if: asString(obj.if),
        read: asStringArray(obj.read),
      };
    });
}

export function scanSkillDirs(root: string): Array<{ domain: Domain; id: string; skillDir: string; relSkillDir: string }> {
  const out: Array<{ domain: Domain; id: string; skillDir: string; relSkillDir: string }> = [];
  for (const base of SKILL_ROOTS) {
    for (const domain of DOMAINS) {
      const domainDir = join(root, base, domain);
      if (!existsSync(domainDir)) continue;
      for (const entry of readdirSync(domainDir)) {
        const skillDir = join(domainDir, entry);
        if (!existsSync(join(skillDir, "SKILL.md"))) continue;
        out.push({ domain, id: entry, skillDir, relSkillDir: `${base}/${domain}/${entry}` });
      }
    }
  }
  return out.sort((a, b) => a.relSkillDir.localeCompare(b.relSkillDir));
}

// Read routing.yaml files that declare a `capability:` section. Returns:
//   - well-formed entries (malformed: false) — usable by builder + validator
//   - malformed entries (malformed: true)    — surfaced by validator as hard errors;
//                                              builder skips them
// Skills whose routing.yaml does not declare `capability:` at all are NOT returned
// here — the validator reports them as missing (soft warning, hard with --require-all).
// Match any top-level `capability:` declaration, with or without an inline
// value. Detection happens on the raw text so a scalar-typed or empty value
// still gets surfaced as malformed instead of being silently treated as absent.
const CAPABILITY_KEY_RE = /^capability\s*:/m;

export function readCapabilityFiles(root: string): CapabilityFile[] {
  const files: CapabilityFile[] = [];
  for (const skill of scanSkillDirs(root)) {
    const path = join(skill.skillDir, "routing.yaml");
    if (!existsSync(path)) continue;
    const raw = readFileSync(path, "utf-8");
    if (!CAPABILITY_KEY_RE.test(raw)) continue;

    const relPath = `${skill.relSkillDir}/routing.yaml`;
    const base = { ...skill, relPath };

    let parsed: Record<string, YamlValue>;
    try {
      parsed = parseSimpleYaml(raw);
    } catch (err) {
      files.push({
        ...base,
        data: {},
        malformed: true,
        malformedReason: `routing.yaml parse error: ${(err as Error).message}`,
      });
      continue;
    }

    const value = parsed.capability;
    if (value === undefined || value === null) {
      files.push({
        ...base,
        data: {},
        malformed: true,
        malformedReason: "capability section is empty",
      });
      continue;
    }
    if (Array.isArray(value) || typeof value !== "object") {
      files.push({
        ...base,
        data: {},
        malformed: true,
        malformedReason: "capability must be a mapping, not a scalar or list",
      });
      continue;
    }
    const data = value as Record<string, YamlValue>;
    if (Object.keys(data).length === 0) {
      files.push({
        ...base,
        data,
        malformed: true,
        malformedReason: "capability section has no fields",
      });
      continue;
    }

    files.push({
      ...base,
      data,
      malformed: false,
    });
  }
  return files;
}

export function normalizeCapability(file: CapabilityFile): Capability {
  const route = asObject(file.data.route);
  const prerequisites = asObject(route.prerequisites);
  const orchestration = asObject(file.data.orchestration);
  const load = asObject(file.data.load);
  const outputs = asObject(file.data.outputs);

  return {
    id: asString(file.data.id),
    domain: asString(file.data.domain) as Domain,
    public: asBoolean(file.data.public),
    command: asString(file.data.command) || undefined,
    summary: asString(file.data.summary),
    aliases: asStringArray(file.data.aliases),
    route: {
      use_when: asStringArray(route.use_when),
      not_when: asStringArray(route.not_when),
      prerequisites: {
        recommended: asStringArray(prerequisites.recommended),
        hard: asStringArray(prerequisites.hard),
      },
    },
    orchestration: {
      default: asString(orchestration.default, "auto") as Capability["orchestration"]["default"],
      single_when: asStringArray(orchestration.single_when),
      multi_when: asStringArray(orchestration.multi_when),
      critic_required_when: asStringArray(orchestration.critic_required_when),
    },
    load: {
      always: asStringArray(load.always),
      when: asLoadWhen(load.when),
    },
    outputs: {
      artifacts: asArtifactArray(outputs.artifacts),
    },
    source: file.relPath,
    skill_path: file.relSkillDir,
  };
}
