#!/usr/bin/env bun
// manifest-sync — derive `.agents/manifest.json` from artifact frontmatter.
// See meta-skills/references/manifest-spec.md for the full contract.
//
// Usage:
//   bun /path/to/manifest-sync.ts [project-root]
//
// Defaults to cwd if no project-root is provided.

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, relative, basename } from "node:path";

const ROOT = process.argv[2] ? process.argv[2] : process.cwd();
const ARTIFACT_ROOTS = [".agents", "research", "brand", "architecture"];
const EXPERIENCE_PREFIX = ".agents/experience";
const MANIFEST_PATH = join(ROOT, ".agents", "manifest.json");
const DEFAULT_STALE_DAYS = 90;

type Frontmatter = Record<string, string | number | boolean>;

// Minimal flat-YAML frontmatter parser. Handles `key: value`, optional quoting,
// and integer coercion. Anything more exotic (lists, nested maps) is ignored —
// the spec keeps frontmatter flat by design.
function parseFrontmatter(content: string): Frontmatter | null {
  // Closing `---` must be at start of a line (not mid-body), preventing a
  // markdown horizontal rule from being read as a false closing delimiter.
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const out: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    let v: string | number | boolean = m[2].trim();
    if (typeof v === "string") {
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (/^\d+$/.test(v)) v = parseInt(v, 10);
      else if (v === "true") v = true;
      else if (v === "false") v = false;
    }
    out[m[1]] = v;
  }
  return out;
}

function walkMd(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walkMd(p, files);
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(p);
  }
  return files;
}

// Best-effort producer inference for legacy artifacts that lack frontmatter.
// Falls back to "unknown" for paths the spec doesn't recognize.
function inferProducer(rel: string): string {
  const map: Array<[RegExp, string]> = [
    [/^research\/icp-research/, "icp-research"],
    [/^research\/market-research/, "market-research"],
    [/^research\/product-context/, "icp-research"],
    [/^brand\/(BRAND|DESIGN|ASSETS)/, "brand-system"],
    [/^architecture\/system-architecture/, "system-architecture"],
    [/^\.agents\/diagnose/, "diagnose"],
    [/^\.agents\/prioritize/, "prioritize"],
    [/^\.agents\/targets/, "funnel-planner"],
    [/^\.agents\/tasks/, "task-breakdown"],
    [/^\.agents\/spec/, "discover"],
    [/^\.agents\/cleanup-report/, "code-cleanup"],
    [/^\.agents\/machine-cleanup-report/, "machine-cleanup"],
    [/^\.agents\/meta\/agents-panel/, "agents-panel"],
    [/^\.agents\/meta\/fresh-eyes/, "fresh-eyes"],
    [/^\.agents\/meta\/short-form-content-plan/, "short-form-research"],
    [/^\.agents\/meta\/learned-rules/, "meta-system"],
    [/^\.agents\/meta\/out-of-scope/, "discover"],
    [/^\.agents\/product\/flow/, "user-flow"],
    [/^\.agents\/mkt\/short-form-research/, "short-form-research"],
    [/^\.agents\/mkt\/short-form-brief/, "short-form-brief"],
    [/^\.agents\/mkt\/campaign-plan/, "campaign-plan"],
    [/^\.agents\/mkt\/lp-brief/, "lp-brief"],
    [/^\.agents\/mkt\/seo/, "seo"],
    [/^\.agents\/mkt\/cold-outreach/, "cold-outreach"],
    [/^\.agents\/mkt\/design-briefs/, "design-brief"],
    [/^\.agents\/mkt\/content/, "copywriting"],
  ];
  for (const [re, skill] of map) if (re.test(rel)) return skill;
  return "unknown";
}

function isStale(date: string, days: number): boolean {
  const t = Date.parse(date);
  if (Number.isNaN(t)) return false;
  return (Date.now() - t) / 86_400_000 > days;
}

function normalizeDate(v: unknown, fallback: Date): string {
  if (typeof v === "string" && v.length > 0) return v;
  if (typeof v === "number") return new Date(v).toISOString().slice(0, 10);
  return fallback.toISOString().slice(0, 10);
}

const artifacts: Record<string, unknown> = {};
const experience: Record<string, unknown> = {};

for (const base of ARTIFACT_ROOTS) {
  const root = join(ROOT, base);
  for (const file of walkMd(root)) {
    const rel = relative(ROOT, file).split("\\").join("/");
    const stat = statSync(file);
    const content = readFileSync(file, "utf8");

    // Skip README files anywhere — documentation, not artifacts.
    if (basename(rel).toUpperCase() === "README.MD") continue;

    if (rel.startsWith(EXPERIENCE_PREFIX) && rel.endsWith(".md")) {
      const name = basename(rel);
      const entries = (content.match(/^## /gm) || []).length;
      const askedBy = [...content.matchAll(/\*\*Asked by:\*\*\s*([^\s·\n]+)/g)].map((m) => m[1]);
      experience[name] = {
        path: rel,
        last_written_by: askedBy.at(-1) ?? "unknown",
        last_written_at: stat.mtime.toISOString(),
        entries,
        size_bytes: stat.size,
      };
      continue;
    }

    const fm = parseFrontmatter(content);
    const skill = (fm?.skill as string | undefined) ?? inferProducer(rel);
    const producedAt = normalizeDate(fm?.date, stat.mtime);
    const status = (fm?.status as string | undefined) ?? "done";
    const schemaVersion = (fm?.version as number | undefined) ?? 1;
    const staleAfterDays = (fm?.stale_after_days as number | undefined) ?? DEFAULT_STALE_DAYS;
    const summary = (fm?.summary as string | undefined) ?? "";

    artifacts[rel] = {
      produced_by: skill,
      produced_at: producedAt,
      status,
      schema_version: schemaVersion,
      stale_after_days: staleAfterDays,
      stale: isStale(producedAt, staleAfterDays),
      summary,
      size_bytes: stat.size,
      frontmatter_present: fm !== null,
    };
  }
}

const manifest = {
  version: 1,
  updated_at: new Date().toISOString(),
  artifacts,
  experience,
};

const manifestDir = join(ROOT, ".agents");
if (!existsSync(manifestDir)) mkdirSync(manifestDir, { recursive: true });
writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

const artifactCount = Object.keys(artifacts).length;
const experienceCount = Object.keys(experience).length;
const staleCount = Object.values(artifacts).filter((a) => (a as { stale: boolean }).stale).length;
const noFrontmatterCount = Object.values(artifacts).filter((a) => !(a as { frontmatter_present: boolean }).frontmatter_present).length;

console.log(
  `manifest-sync: ${artifactCount} artifacts (${staleCount} stale, ${noFrontmatterCount} without frontmatter), ${experienceCount} experience files → ${relative(ROOT, MANIFEST_PATH)}`
);
