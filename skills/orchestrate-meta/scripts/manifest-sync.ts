#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root.
// manifest-sync — derive `.agents/manifest.json` from artifact frontmatter.
// See references/_shared/manifest-spec.md for the full contract.
//
// Usage:
//   bun /path/to/manifest-sync.ts [project-root]
//
// Defaults to cwd if no project-root is provided.

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync, lstatSync, realpathSync } from "node:fs";
import { join, relative, basename } from "node:path";

const INCLUDE_ARCHIVE = process.argv.includes("--include-archive");
const ROOT_ARG = process.argv.find((arg, idx) => idx > 1 && arg !== "--include-archive") ?? process.cwd();
const ROOT = realpathSync(ROOT_ARG);
const ARTIFACT_ROOTS = [".agents/skill-artifacts", ".agents/experience", "skills-resources/loops", "research", "brand", "architecture"];
const EXPERIENCE_PREFIX = ".agents/experience";
const MANIFEST_PATH = join(ROOT, ".agents", "manifest.json");
const ARTIFACT_INDEX_PATH = join(ROOT, ".agents", "artifact-index.md");
const DEFAULT_STALE_DAYS = 90;
const VALID_STATUSES = new Set(["done", "done_with_concerns", "blocked", "needs_context"]);
const GENERIC_H1_TITLES = new Set(["Review Chain Report", "Report", "Artifact"]);
const LIFECYCLE_SORT_ORDER = ["canonical", "loop", "loop-context", "learning", "anchor", "registry", "decision", "spec", "strategy", "execution", "evaluation", "pipeline", "snapshot", "archive", ""];

type Frontmatter = Record<string, string | number | boolean>;
type ArtifactEntry = {
  produced_by: string;
  produced_at: string;
  status: string;
  schema_version: number;
  stale_after_days: number;
  stale: boolean;
  title: string;
  summary: string;
  purpose: string;
  lifecycle: string;
  use_when: string;
  do_not_use_when: string;
  supersedes: string;
  superseded_by: string;
  upstream: string;
  downstream: string;
  decision_status: string;
  size_bytes: number;
  frontmatter_present: boolean;
};

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
  if (lstatSync(dir).isSymbolicLink()) {
    throw new Error(`Refusing to walk symlinked artifact root: ${relative(ROOT, dir)}`);
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (!INCLUDE_ARCHIVE && relative(ROOT, p).split("\\").join("/").startsWith(".agents/skill-artifacts/.archive")) continue;
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
    [/^\.agents\/skill-artifacts\/meta\/roadmap/, "agents-panel"],
    [/^\.agents\/skill-artifacts\/meta\/tasks/, "task-breakdown"],
    [/^\.agents\/skill-artifacts\/meta\/specs\//, "discover"],
    [/^\.agents\/skill-artifacts\/meta\/sketches\/prioritize/, "prioritize"],
    [/^\.agents\/skill-artifacts\/meta\/sketches\//, "discover"],
    [/^\.agents\/skill-artifacts\/meta\/decisions\//, "agents-panel"],
    [/^\.agents\/skill-artifacts\/meta\/records\/skill-contracts/, "meta-system"],
    [/^\.agents\/skill-artifacts\/meta\/records\/.*fresh-eyes/, "fresh-eyes"],
    [/^\.agents\/skill-artifacts\/meta\/records\/.*cleanup-artifacts/, "cleanup-artifacts"],
    [/^\.agents\/skill-artifacts\/meta\/records\/.*diagnose/, "diagnose"],
    [/^\.agents\/skill-artifacts\/meta\/records\/.*targets/, "funnel-planner"],
    [/^\.agents\/skill-artifacts\/meta\/records\/.*cleanup-report/, "code-cleanup"],
    [/^\.agents\/skill-artifacts\/meta\/records\/.*machine-cleanup/, "machine-cleanup"],
    [/^\.agents\/skill-artifacts\/meta\/records\/learned-rules/, "meta-system"],
    [/^\.agents\/skill-artifacts\/meta\/out-of-scope/, "discover"],
    [/^\.agents\/skill-artifacts\/mkt\/ad-copy\//, "ad-copy"],
    [/^\.agents\/skill-artifacts\/mkt\/copy\//, "copywriting"],
    [/^\.agents\/skill-artifacts\/mkt\/content\//, "copywriting"],
    [/^\.agents\/skill-artifacts\/mkt\/campaign-plan/, "campaign-plan"],
    [/^\.agents\/skill-artifacts\/mkt\/lp-brief\//, "lp-brief"],
    [/^\.agents\/skill-artifacts\/mkt\/seo/, "seo"],
    [/^\.agents\/skill-artifacts\/mkt\/cold-outreach\//, "cold-outreach"],
    [/^\.agents\/skill-artifacts\/mkt\/design-briefs\//, "design-brief"],
    [/^\.agents\/skill-artifacts\/mkt\/short-form-brief\//, "short-form-brief"],
    [/^\.agents\/skill-artifacts\/mkt\/social-copy\//, "social-copy"],
    [/^\.agents\/skill-artifacts\/product\/flow\//, "user-flow"],
    [/^\.agents\/skill-artifacts\/research\/short-form-research/, "short-form-research"],
    [/^\.agents\/skill-artifacts\/research\/short-form-eval/, "short-form-eval"],
    [/^skills-resources\/loops\/[^/]+\/program\.md$/, "eval-loop"],
    [/^skills-resources\/loops\/[^/]+\/context\.md$/, "eval-loop"],
    [/^skills-resources\/loops\/[^/]+\/learnings\.md$/, "eval-loop"],
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

function numberField(fm: Frontmatter | null, key: string, fallback: number): number {
  const v = fm?.[key];
  if (typeof v === "number") return v;
  if (typeof v === "string" && /^\d+$/.test(v)) return parseInt(v, 10);
  return fallback;
}

function textField(fm: Frontmatter | null, key: string): string {
  const v = fm?.[key];
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v).trim() : "";
}

function inferTitle(rel: string, content: string, fm: Frontmatter | null): string {
  const explicit = textField(fm, "title");
  if (explicit) return explicit;
  const h1 = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (h1 && !GENERIC_H1_TITLES.has(h1)) return h1;
  return basename(rel, ".md");
}

function inferLifecycle(rel: string, fm: Frontmatter | null): string {
  const explicit = textField(fm, "lifecycle");
  if (explicit) return explicit;
  if (/^brand\//.test(rel) || /^research\/(product-context|icp-research|market-research)/.test(rel) || /^architecture\//.test(rel)) return "canonical";
  if (/^skills-resources\/loops\/[^/]+\/program\.md$/.test(rel)) return "loop";
  if (/^skills-resources\/loops\/[^/]+\/context\.md$/.test(rel)) return "loop-context";
  if (/^skills-resources\/loops\/[^/]+\/learnings\.md$/.test(rel)) return "learning";
  if (/^skills-resources\/loops\/[^/]+\/strategy\//.test(rel)) return "strategy";
  if (/^skills-resources\/loops\/[^/]+\/execution\//.test(rel)) return "execution";
  if (/^skills-resources\/loops\/[^/]+\/evals\//.test(rel)) return "evaluation";
  if (/^\.agents\/skill-artifacts\/meta\/decisions\//.test(rel)) return "decision";
  if (/^\.agents\/skill-artifacts\/meta\/specs\//.test(rel)) return "spec";
  if (/^\.agents\/skill-artifacts\/meta\/records\/skill-contracts\.md$/.test(rel)) return "registry";
  if (/^\.agents\/skill-artifacts\/meta\/records\//.test(rel)) return "snapshot";
  if (/^\.agents\/skill-artifacts\/meta\/(roadmap|tasks)\.md$/.test(rel)) return "anchor";
  if (/^\.agents\/skill-artifacts\/\.archive\//.test(rel)) return "archive";
  if (/^\.agents\/skill-artifacts\//.test(rel)) return "pipeline";
  return "";
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

function truncate(value: string, max = 220): string {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

function formatCell(value: string, fallback = "—", max = 220): string {
  return escapeTableCell(truncate(value || fallback, max));
}

function artifactSort(a: [string, ArtifactEntry], b: [string, ArtifactEntry]): number {
  const ao = LIFECYCLE_SORT_ORDER.indexOf(a[1].lifecycle);
  const bo = LIFECYCLE_SORT_ORDER.indexOf(b[1].lifecycle);
  if (ao !== bo) return (ao === -1 ? 99 : ao) - (bo === -1 ? 99 : bo);
  return b[1].produced_at.localeCompare(a[1].produced_at) || a[0].localeCompare(b[0]);
}

function renderArtifactIndex(manifest: { updated_at: string; artifacts: Record<string, ArtifactEntry> }): string {
  const entries = Object.entries(manifest.artifacts).sort(artifactSort);
  const active = entries.filter(([path]) => !path.includes("/.archive/"));
  const archived = entries.filter(([path]) => path.includes("/.archive/"));
  const withContext = entries.filter(([, entry]) => entry.summary || entry.purpose || entry.use_when).length;

  const renderRows = (rows: Array<[string, ArtifactEntry]>): string => {
    if (rows.length === 0) return "_None._\n";
    return [
      "| Artifact | Type | Why it exists | Use when | Status | Lineage |",
      "|---|---|---|---|---|---|",
      ...rows.map(([path, entry]) => {
        const why = entry.purpose || entry.summary || entry.title;
        const useWhen = entry.use_when || (entry.lifecycle === "snapshot" ? "Point-in-time audit trail; read only when investigating that run." : "");
        const useRules = [useWhen, entry.do_not_use_when ? `Skip when: ${entry.do_not_use_when}` : ""].filter(Boolean).join("; ");
        const lineageParts = [
          entry.superseded_by ? `superseded by ${entry.superseded_by}` : "",
          entry.supersedes ? `supersedes ${entry.supersedes}` : "",
          entry.upstream ? `upstream: ${entry.upstream}` : "",
          entry.downstream ? `downstream: ${entry.downstream}` : "",
        ].filter(Boolean);
        const status = `${entry.status}${entry.stale ? " / stale" : ""}`;
        return `| \`${escapeTableCell(path)}\` | ${formatCell(entry.lifecycle)} | ${formatCell(why)} | ${formatCell(useRules)} | ${formatCell(status)} | ${formatCell(lineageParts.join("; "))} |`;
      }),
    ].join("\n") + "\n";
  };

  return `# Artifact Index

Generated from artifact frontmatter by \`scripts/manifest-sync.ts\`.

- Updated: ${manifest.updated_at}
- Artifacts indexed: ${entries.length}
- Artifacts with selection context: ${withContext}/${entries.length}

## How to use this index

Read this before browsing \`.agents/skill-artifacts/\`, \`skills-resources/loops/\`, or canonical folders. The goal is not to list every file equally; it is to answer which artifacts are active, why they exist, when to use them, and what has been superseded.

For grounded work, prefer active canonical records, anchors, registries, decisions, and specs. Use snapshots and archived artifacts as audit trail unless their row explicitly says they are load-bearing.

## Active Artifacts

${renderRows(active)}
## Archived / Historical

${renderRows(archived)}
`;
}

const artifacts: Record<string, ArtifactEntry> = {};
const experience: Record<string, unknown> = {};
const warnings: string[] = [];

for (const base of ARTIFACT_ROOTS) {
  const root = join(ROOT, base);
  for (const file of walkMd(root)) {
    const rel = relative(ROOT, file).split("\\").join("/");
    if (rel === ".agents/artifact-index.md") continue;

    // Skip README files anywhere — documentation, not artifacts.
    if (basename(rel).toLowerCase() === "readme.md") continue;

    const stat = statSync(file);
    const content = readFileSync(file, "utf8");

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
    const rawStatus = (fm?.status as string | undefined) ?? "done";
    const isArchived = rel.includes("/.archive/");
    const status = VALID_STATUSES.has(rawStatus) ? rawStatus : "done_with_concerns";
    if (!VALID_STATUSES.has(rawStatus) && !isArchived) {
      warnings.push(`${rel}: unknown status ${JSON.stringify(rawStatus)} normalized to "done_with_concerns"`);
    }
    const schemaVersion = numberField(fm, "version", 1);
    const staleAfterDays = numberField(fm, "stale_after_days", DEFAULT_STALE_DAYS);
    const summary = textField(fm, "summary");

    artifacts[rel] = {
      produced_by: skill,
      produced_at: producedAt,
      status,
      schema_version: schemaVersion,
      stale_after_days: staleAfterDays,
      stale: isStale(producedAt, staleAfterDays),
      title: inferTitle(rel, content, fm),
      summary,
      purpose: textField(fm, "purpose"),
      lifecycle: inferLifecycle(rel, fm),
      use_when: textField(fm, "use_when"),
      do_not_use_when: textField(fm, "do_not_use_when"),
      supersedes: textField(fm, "supersedes"),
      superseded_by: textField(fm, "superseded_by"),
      upstream: textField(fm, "upstream"),
      downstream: textField(fm, "downstream"),
      decision_status: textField(fm, "decision_status"),
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
if (existsSync(manifestDir) && lstatSync(manifestDir).isSymbolicLink()) {
  throw new Error("Refusing to write through symlinked .agents/");
}
if (!existsSync(manifestDir)) mkdirSync(manifestDir, { recursive: true });
for (const target of [MANIFEST_PATH, ARTIFACT_INDEX_PATH]) {
  if (existsSync(target) && lstatSync(target).isSymbolicLink()) {
    throw new Error(`Refusing to overwrite symlinked generated file: ${relative(ROOT, target)}`);
  }
}

try {
  const existing = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  if (
    existing.version === manifest.version &&
    JSON.stringify(existing.artifacts) === JSON.stringify(manifest.artifacts) &&
    JSON.stringify(existing.experience) === JSON.stringify(manifest.experience)
  ) {
    manifest.updated_at = existing.updated_at;
  }
} catch {
  // Missing or malformed generated manifest: rewrite with a fresh timestamp.
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(ARTIFACT_INDEX_PATH, renderArtifactIndex(manifest) + "\n");

const artifactCount = Object.keys(artifacts).length;
const experienceCount = Object.keys(experience).length;
const staleCount = Object.values(artifacts).filter((a) => (a as { stale: boolean }).stale).length;
const noFrontmatterCount = Object.values(artifacts).filter((a) => !(a as { frontmatter_present: boolean }).frontmatter_present).length;

console.log(
  `manifest-sync: ${artifactCount} artifacts (${staleCount} stale, ${noFrontmatterCount} without frontmatter), ${experienceCount} experience files${INCLUDE_ARCHIVE ? " including archive" : ""} → ${relative(ROOT, MANIFEST_PATH)} + ${relative(ROOT, ARTIFACT_INDEX_PATH)}`
);
if (warnings.length) {
  console.warn(`manifest-sync warnings:\n${warnings.map((w) => `  - ${w}`).join("\n")}`);
}
