#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root.
// manifest-sync — derive `.forsvn/index/manifest.json` from artifact frontmatter.
// See references/_shared/manifest-spec.md for the full contract.
//
// Usage:
//   bun /path/to/manifest-sync.ts [project-root]
//
// Defaults to cwd if no project-root is provided.

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync, lstatSync, realpathSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { parseArtifactPath, normalizeStack, ARTIFACT_HOME, STATE_HOME, HOME_RE } from "./lib/path-parser";

const INCLUDE_ARCHIVE = process.argv.includes("--include-archive");
const CHECK = process.argv.includes("--check");
const ROOT_ARG = process.argv.find((arg, idx) => idx > 1 && !arg.startsWith("--")) ?? process.cwd();
const ROOT = realpathSync(ROOT_ARG);
// The three knowledge layers (each split by stack), under both homes: the new
// ARTIFACT_HOME (docs/forsvn) and the legacy STATE_HOME (.forsvn), so indexing
// keeps working before and after the state-root migration (an absent home dir
// is a walk no-op). Loops stay under STATE_HOME (machine-state). canonical/
// artifacts/ experience/ ARE the data model. `.forsvn/performance/` is
// deliberately NOT walked — operator-fed channel metrics (TSV), data not
// artifacts; see references/performance-data.md.
const ARTIFACT_ROOTS = [
  `${STATE_HOME}/canonical`, `${STATE_HOME}/artifacts`, `${STATE_HOME}/experience`,
  `${ARTIFACT_HOME}/canonical`, `${ARTIFACT_HOME}/artifacts`, `${ARTIFACT_HOME}/experience`,
  `${STATE_HOME}/loops`,
];
// Old flat experience files lived at `<home>/experience/<name>.md` (no stack
// subdir) and were indexed as Q&A substrate. Layered experience
// (`<home>/experience/<stack>/...`) is indexed as a normal artifact.
const LEGACY_FLAT_EXPERIENCE_RE = new RegExp(`^${HOME_RE}/experience/[^/]+\\.md$`);
// Normalize a knowledge-layer path to the legacy home so the single-home
// inferProducer/inferLifecycle patterns match either home without duplicating
// the ~50-entry table. Loops (always under STATE_HOME) are untouched. KTD1.
const KNOWLEDGE_HOME_PREFIX_RE = new RegExp(`^${ARTIFACT_HOME}/`);
function normalizeHome(rel: string): string {
  return rel.replace(KNOWLEDGE_HOME_PREFIX_RE, `${STATE_HOME}/`);
}
const MANIFEST_PATH = join(ROOT, ".forsvn", "index", "manifest.json");
const ARTIFACT_INDEX_PATH = join(ROOT, ".forsvn", "index", "artifact-index.md");
const DEFAULT_STALE_DAYS = 90;
const VALID_STATUSES = new Set(["done", "done_with_concerns", "blocked", "needs_context"]);
const VALID_DECISION_STATES = new Set(["pending", "approved", "denied", "suggested", "not_required"]);
const VALID_REVIEW_SURFACES = new Set(["html", "md", "none"]);
const VALID_COLLAB_STATES = new Set(["drafting", "in_review", "exported"]);
const VALID_STACKS = new Set(["meta", "research", "marketing", "product"]);
const VALID_TYPES = new Set([
  "canonical", "plan", "spec", "decision", "experience", "pipeline", "snapshot",
  "review", "brief", "strategy", "execution", "evaluation", "loop", "learning", "registry",
]);
// Legacy v1 -> v2 review enum migration. Read with a per-artifact warning.
const LEGACY_REVIEW_STATE_MAP: Record<string, string> = {
  pending: "pending",
  approved: "approved",
  rejected: "denied",
  changes_requested: "suggested",
  not_required: "not_required",
};
const GENERIC_H1_TITLES = new Set(["Review Chain Report", "Report", "Artifact"]);
const LIFECYCLE_SORT_ORDER = ["canonical", "loop", "loop-context", "learning", "anchor", "registry", "decision", "spec", "strategy", "execution", "evaluation", "pipeline", "snapshot", "archive", ""];

type Frontmatter = Record<string, string | number | boolean | string[]>;
type ArtifactEntry = {
  id: string;
  type: string;
  keywords: string[];
  produced_by: string;
  produced_at: string;
  status: string;
  schema_version: number;
  stack: string;
  skills_involved: string[];
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
  references: string;
  assets: string[];
  asset_picked: string;
  execution_mode: string;
  decision_status: string;
  decision_state: string;
  review_surface: string;
  review_tool: string;
  reviewed_at: string;
  reviewer: string;
  // Collaborative-doc sub-type (ADR 2026-06-08). Binding to the Proof working
  // doc; empty for non-Proof artifacts. The MCP proxy resolves proof_slug here.
  proof_slug: string;
  proof_doc_id: string;
  collab_state: string;
  size_bytes: number;
  frontmatter_present: boolean;
};

// Minimal flat-YAML frontmatter parser. Handles `key: value`, optional quoting,
// integer coercion, and one inline-array form (`[a, b, c]`) used for the v2
// `skills_involved` field. Anything more exotic (nested maps, multi-line lists)
// is ignored — the spec keeps frontmatter flat by design.
function parseFrontmatter(content: string): Frontmatter | null {
  // Closing `---` must be at start of a line (not mid-body), preventing a
  // markdown horizontal rule from being read as a false closing delimiter.
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const out: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const raw = m[2].trim();
    let v: string | number | boolean | string[] = raw;
    if (raw.startsWith("[") && raw.endsWith("]")) {
      // Inline array of unquoted-or-quoted scalars. No nesting, no commas
      // inside values. Matches v2 `skills_involved: [foo, bar]` usage.
      const body = raw.slice(1, -1).trim();
      v = body.length === 0
        ? []
        : body.split(",").map((part) => {
            const t = part.trim();
            if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
              return t.slice(1, -1);
            }
            return t;
          }).filter((s) => s.length > 0);
    } else if (typeof v === "string") {
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
    if (!INCLUDE_ARCHIVE && relative(ROOT, p).split("\\").join("/").includes("/.archive/")) continue;
    if (entry.isDirectory()) walkMd(p, files);
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(p);
  }
  return files;
}

// Best-effort producer inference for legacy artifacts that lack frontmatter.
// Falls back to "unknown" for paths the spec doesn't recognize.
function inferProducer(rel: string): string {
  rel = normalizeHome(rel); // recognize artifacts under either home (KTD1)
  const map: Array<[RegExp, string]> = [
    // v3 canonical home (frontmatter `skill:` wins; these are the fallback)
    [/^\.forsvn\/canonical\/product\/ARCHITECTURE/, "architect-system"],
    [/^\.forsvn\/canonical\/product\/USER-FLOW/, "map-user-flow"],
    [/^\.forsvn\/canonical\/meta\/MASTER-PLAN/, "forsvn"],
    [/^\.forsvn\/canonical\/meta\/PHASE-LEDGER/, "forsvn"],
    [/^\.forsvn\/canonical\/marketing\/(BRAND|DESIGN|CREATIVE-DIRECTION|FRAME)/, "create-brand"],
    [/^\.forsvn\/canonical\/research\/ICP/, "research-icp"],
    [/^\.forsvn\/canonical\/research\/MARKET/, "research-market"],
    [/^research\/icp-research/, "research-icp"],
    [/^research\/market-research/, "research-market"],
    [/^research\/product-context/, "research-icp"],
    [/^brand\/(BRAND|DESIGN|ASSETS)/, "create-brand"],
    [/^architecture\/system-architecture/, "architect-system"],
    [/^\.forsvn\/artifacts\/meta\/roadmap/, "forsvn"],
    [/^\.forsvn\/artifacts\/meta\/tasks/, "breakdown-tasks"],
    [/^\.forsvn\/artifacts\/meta\/specs\//, "discover"],
    [/^\.forsvn\/artifacts\/meta\/sketches\/prioritize/, "prioritize"],
    [/^\.forsvn\/artifacts\/meta\/sketches\//, "discover"],
    [/^\.forsvn\/artifacts\/meta\/decisions\//, "debate-agents"],
    [/^\.forsvn\/artifacts\/meta\/records\/skill-contracts/, "meta-system"],
    [/^\.forsvn\/artifacts\/meta\/records\/.*review-work/, "review-work"],
    [/^\.forsvn\/artifacts\/meta\/records\/.*clean-artifacts/, "clean-artifacts"],
    [/^\.forsvn\/artifacts\/meta\/records\/.*diagnose/, "diagnose"],
    [/^\.forsvn\/artifacts\/meta\/records\/.*targets/, "plan-funnel"],
    [/^\.forsvn\/artifacts\/meta\/records\/.*cleanup-report/, "clean-code"],
    [/^\.forsvn\/artifacts\/meta\/records\/.*clean-machine/, "clean-machine"],
    [/^\.forsvn\/artifacts\/meta\/records\/learned-rules/, "meta-system"],
    [/^\.forsvn\/artifacts\/meta\/out-of-scope/, "discover"],
    [/^\.forsvn\/artifacts\/mkt\/write-ad\//, "write-ad"],
    [/^\.forsvn\/artifacts\/mkt\/write-copy\//, "write-copy"],
    [/^\.forsvn\/artifacts\/mkt\/content\//, "write-copy"],
    [/^\.forsvn\/artifacts\/mkt\/plan-campaign/, "plan-campaign"],
    [/^\.forsvn\/artifacts\/mkt\/brief-landing-page\//, "brief-landing-page"],
    [/^\.forsvn\/artifacts\/mkt\/optimize-seo/, "optimize-seo"],
    [/^\.forsvn\/artifacts\/mkt\/write-outreach\//, "write-outreach"],
    [/^\.forsvn\/artifacts\/mkt\/brief-graphic\//, "brief-graphic"],
    [/^\.forsvn\/artifacts\/mkt\/brief-shortform\//, "brief-shortform"],
    [/^\.forsvn\/artifacts\/mkt\/write-social\//, "write-social"],
    [/^\.forsvn\/artifacts\/product\/flow\//, "map-user-flow"],
    [/^\.forsvn\/artifacts\/research\/research-shortform/, "research-shortform"],
    [/^\.forsvn\/artifacts\/research\/platform-evidence/, "research-platform"],
    [/^\.forsvn\/artifacts\/research\/evaluate-shortform/, "evaluate-shortform"],
    [/^\.forsvn\/loops\/[^/]+\/program\.md$/, "run-pipeline"],
    [/^\.forsvn\/loops\/[^/]+\/context\.md$/, "run-pipeline"],
    [/^\.forsvn\/loops\/[^/]+\/learnings\.md$/, "run-pipeline"],
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
  if (Array.isArray(v)) return "";
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v).trim() : "";
}

function listField(fm: Frontmatter | null, key: string): string[] {
  const v = fm?.[key];
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  if (typeof v === "string" && v.length > 0) {
    return v.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function inferTitle(rel: string, content: string, fm: Frontmatter | null): string {
  const explicit = textField(fm, "title");
  if (explicit) return explicit;
  const h1 = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (h1 && !GENERIC_H1_TITLES.has(h1)) return h1;
  return basename(rel, ".md");
}

// type → lifecycle bridge. The v3 contract leads with `type` (the agent
// instruction); `lifecycle` stays as the manifest's sort/index axis. When only
// one is set, derive the other so existing tooling and the new contract agree.
const TYPE_TO_LIFECYCLE: Record<string, string> = {
  plan: "spec",
  review: "snapshot",
  brief: "pipeline",
};
function typeToLifecycle(type: string): string {
  if (!type) return "";
  return TYPE_TO_LIFECYCLE[type] ?? type;
}
function lifecycleToType(lifecycle: string): string {
  if (!lifecycle) return "";
  if (VALID_TYPES.has(lifecycle)) return lifecycle;
  if (lifecycle === "loop-context") return "loop";
  if (lifecycle === "anchor") return "plan";
  if (lifecycle === "archive") return "snapshot";
  return "";
}

function inferLifecycle(rel: string, fm: Frontmatter | null): string {
  const explicit = textField(fm, "lifecycle");
  if (explicit) return explicit;
  const fromType = typeToLifecycle(textField(fm, "type"));
  if (fromType) return fromType;
  rel = normalizeHome(rel); // recognize artifacts under either home (KTD1)
  // v3 layered home
  if (/^\.forsvn\/canonical\//.test(rel)) return "canonical";
  if (/^\.forsvn\/experience\//.test(rel)) return "learning";
  if (/^brand\//.test(rel) || /^research\/(product-context|icp-research|market-research)/.test(rel) || /^architecture\//.test(rel)) return "canonical";
  if (/^\.forsvn\/loops\/[^/]+\/program\.md$/.test(rel)) return "loop";
  if (/^\.forsvn\/loops\/[^/]+\/context\.md$/.test(rel)) return "loop-context";
  if (/^\.forsvn\/loops\/[^/]+\/learnings\.md$/.test(rel)) return "learning";
  if (/^\.forsvn\/loops\/[^/]+\/strategy\//.test(rel)) return "strategy";
  if (/^\.forsvn\/loops\/[^/]+\/execution\//.test(rel)) return "execution";
  if (/^\.forsvn\/loops\/[^/]+\/evals\//.test(rel)) return "evaluation";
  if (/^\.forsvn\/artifacts\/meta\/decisions\//.test(rel)) return "decision";
  if (/^\.forsvn\/artifacts\/meta\/specs\//.test(rel)) return "spec";
  if (/^\.forsvn\/artifacts\/meta\/records\/skill-contracts\.md$/.test(rel)) return "registry";
  if (/^\.forsvn\/artifacts\/meta\/records\//.test(rel)) return "snapshot";
  if (/^\.forsvn\/artifacts\/meta\/(roadmap|tasks)\.md$/.test(rel)) return "anchor";
  if (/^\.forsvn\/artifacts\/\.archive\//.test(rel)) return "archive";
  if (/^\.forsvn\/artifacts\//.test(rel)) return "pipeline";
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
      "| Stack | Artifact | Type | Keywords | Why it exists | Use when | Status | Decision | Surface | Lineage |",
      "|---|---|---|---|---|---|---|---|---|---|",
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
        const decision = entry.decision_state === "not_required" ? "—" : entry.decision_state;
        const surface = entry.review_surface === "none" ? "—" : entry.review_surface;
        const typeCell = entry.type || entry.lifecycle;
        return `| ${formatCell(entry.stack)} | \`${escapeTableCell(path)}\` | ${formatCell(typeCell)} | ${formatCell(entry.keywords.join(", "), "—", 120)} | ${formatCell(why)} | ${formatCell(useRules)} | ${formatCell(status)} | ${formatCell(decision)} | ${formatCell(surface)} | ${formatCell(lineageParts.join("; "))} |`;
      }),
    ].join("\n") + "\n";
  };

  return `# Artifact Index

Generated from artifact frontmatter by \`skills/bin/manifest-sync.ts\`.

- Updated: ${manifest.updated_at}
- Artifacts indexed: ${entries.length}
- Artifacts with selection context: ${withContext}/${entries.length}

## How to use this index

Read this before browsing \`docs/forsvn/artifacts/\`, \`.forsvn/loops/\`, or canonical folders. The goal is not to list every file equally; it is to answer which artifacts are active, why they exist, when to use them, and what has been superseded.

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
    if (rel === ".forsvn/index/artifact-index.md") continue;

    // Skip README files anywhere — documentation, not artifacts.
    if (basename(rel).toLowerCase() === "readme.md") continue;

    const stat = statSync(file);
    const content = readFileSync(file, "utf8");

    // Legacy flat experience (`.forsvn/experience/<name>.md`, no stack subdir)
    // is the old Q&A substrate. Layered experience (`experience/<stack>/...`)
    // is a normal, frontmatter-bearing artifact and falls through to indexing.
    if (LEGACY_FLAT_EXPERIENCE_RE.test(rel)) {
      const name = basename(rel);
      // The experience map keys by basename, so the same flat file present in both
      // homes mid-migration collides. ARTIFACT_ROOTS lists the legacy home first, so
      // the new-home copy is walked second and wins — the desired winner, but warn so
      // the drop is intentional, not silent (the layered path surfaces dups explicitly).
      const prior = experience[name] as { path?: string } | undefined;
      if (prior && prior.path !== rel) {
        warnings.push(`flat experience "${name}" exists in two homes (${prior.path} + ${rel}); indexing the latter`);
      }
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
    const parsedPath = parseArtifactPath(rel);
    const skill = (fm?.skill as string | undefined) ?? parsedPath.skill ?? inferProducer(rel);
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

    // Stack — frontmatter wins; fall back to the path (layered <stack>/ folder,
    // legacy flat prefix, or nested segment). The `mkt → marketing` alias is
    // applied to both sources so the folder name always equals the stack value.
    const rawStack = textField(fm, "stack");
    const aliasedFmStack = rawStack ? normalizeStack(rawStack) : undefined;
    const aliasedPathStack = parsedPath.stack ? normalizeStack(parsedPath.stack) : undefined;
    const stack = aliasedFmStack ?? aliasedPathStack ?? "";
    if (rawStack && !aliasedFmStack && !isArchived) {
      warnings.push(`${rel}: unknown stack ${JSON.stringify(rawStack)} dropped`);
    }
    if (rawStack === "mkt" && !isArchived) {
      warnings.push(`${rel}: legacy stack "mkt" indexed as "marketing" — update the frontmatter`);
    }

    // v3 instruction core — id (stable identity), type (per-doc instruction),
    // keywords (greppable selection surface). Type derives from lifecycle when
    // absent so legacy artifacts still carry one.
    const id = textField(fm, "id");
    const lifecycleForType = inferLifecycle(rel, fm);
    const rawType = textField(fm, "type");
    const type = rawType && VALID_TYPES.has(rawType) ? rawType : lifecycleToType(lifecycleForType);
    if (rawType && !VALID_TYPES.has(rawType) && !isArchived) {
      warnings.push(`${rel}: unknown type ${JSON.stringify(rawType)} dropped`);
    }
    const keywords = listField(fm, "keywords");

    // skills_involved — list of contributing skills for multi-skill pipelines.
    const skillsInvolved = listField(fm, "skills_involved");

    // decision_state — v2 enum (renamed from review_state). Legacy v1 values
    // are mapped through LEGACY_REVIEW_STATE_MAP with a one-line warning.
    const rawDecisionState = textField(fm, "decision_state");
    const rawLegacyReviewState = textField(fm, "review_state");
    let decisionState: string;
    if (rawDecisionState) {
      decisionState = VALID_DECISION_STATES.has(rawDecisionState) ? rawDecisionState : "not_required";
      if (!VALID_DECISION_STATES.has(rawDecisionState) && !isArchived) {
        warnings.push(`${rel}: unknown decision_state ${JSON.stringify(rawDecisionState)} normalized to "not_required"`);
      }
    } else if (rawLegacyReviewState) {
      decisionState = LEGACY_REVIEW_STATE_MAP[rawLegacyReviewState] ?? "not_required";
      if (!isArchived) {
        warnings.push(`${rel}: legacy review_state ${JSON.stringify(rawLegacyReviewState)} migrated to decision_state ${JSON.stringify(decisionState)}`);
      }
    } else {
      decisionState = "not_required";
    }

    // review_surface — frontmatter wins; else infer from co-located HTML twin
    // (path-parser only sees the .md side here; check sibling existence) or
    // fall back to "md" when a decision is gated and "none" otherwise.
    const rawReviewSurface = textField(fm, "review_surface");
    const htmlTwinExists = file.endsWith(".md") && existsSync(file.replace(/\.md$/, ".html"));
    let reviewSurface: string;
    if (rawReviewSurface && VALID_REVIEW_SURFACES.has(rawReviewSurface)) {
      reviewSurface = rawReviewSurface;
    } else if (rawReviewSurface && !isArchived) {
      warnings.push(`${rel}: unknown review_surface ${JSON.stringify(rawReviewSurface)} dropped`);
      reviewSurface = htmlTwinExists ? "html" : (decisionState === "not_required" ? "none" : "md");
    } else {
      reviewSurface = htmlTwinExists ? "html" : (decisionState === "not_required" ? "none" : "md");
    }

    // collab_state — Proof-backed collaborative-doc lifecycle. Lenient: an
    // unknown value is dropped with a warning (strict enforcement is in
    // validate-artifacts), matching how decision_state/review_surface degrade.
    const rawCollabState = textField(fm, "collab_state");
    let collabState = "";
    if (rawCollabState) {
      if (VALID_COLLAB_STATES.has(rawCollabState)) collabState = rawCollabState;
      else if (!isArchived) warnings.push(`${rel}: unknown collab_state ${JSON.stringify(rawCollabState)} dropped`);
    }

    artifacts[rel] = {
      id,
      type,
      keywords,
      produced_by: skill,
      produced_at: producedAt,
      status,
      schema_version: schemaVersion,
      stack,
      skills_involved: skillsInvolved,
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
      references: textField(fm, "references"),
      // The return-leg (CLOSED-LOOP.md §6): `assets` is the flat list of
      // re-ingested rendered outputs (repo-relative paths or URLs) attached to
      // this artifact; `asset_picked` is the canonical option-picker choice.
      // Indexed so downstream skills + MCP get_artifact reference the REAL asset.
      assets: listField(fm, "assets"),
      asset_picked: textField(fm, "asset_picked"),
      // The execution fork (CLOSED-LOOP.md §4): which mode produced this artifact.
      execution_mode: textField(fm, "execution_mode"),
      decision_status: textField(fm, "decision_status"),
      decision_state: decisionState,
      review_surface: reviewSurface,
      review_tool: textField(fm, "review_tool"),
      reviewed_at: textField(fm, "reviewed_at"),
      reviewer: textField(fm, "reviewer"),
      proof_slug: textField(fm, "proof_slug"),
      proof_doc_id: textField(fm, "proof_doc_id"),
      collab_state: collabState,
      size_bytes: stat.size,
      frontmatter_present: fm !== null,
    };
  }
}

// --- Phase 1: id → path index + resolved knowledge graph --------------------
// The schema fields (id, edges) landed in Phase 0; Phase 1 makes them *live*.
//   by_id  — resolves a stable `id` to its CURRENT path. A move/rename only
//            updates this map; references authored by id never break.
//   graph  — per-id forward edges resolved to ids + a `referenced_by` reverse
//            index, so the graph is navigable in BOTH directions and is itself
//            path-independent (keyed by id, valued by ids → survives a move).
type GraphNode = {
  path: string;
  upstream: string[];
  downstream: string[];
  supersedes: string[];
  superseded_by: string[];
  references: string[];
  referenced_by: string[];
};
const EDGE_FIELDS = ["upstream", "downstream", "supersedes", "superseded_by", "references"] as const;

const byId: Record<string, string> = {};
const idByPath: Record<string, string> = {};
const duplicateIdErrors: string[] = [];
for (const [path, entry] of Object.entries(artifacts)) {
  if (!entry.id) continue;
  idByPath[path] = entry.id;
  if (byId[entry.id] === undefined) {
    byId[entry.id] = path;
  } else {
    // Split-brain: artifacts[path].id stays set, but by_id[id] points elsewhere
    // (first-wins). An agent reading artifacts[path].id sees a live id that does
    // not resolve via by_id. Keep the write resilient (first-wins) so a manifest
    // is always produced, but record the conflict so --check (the gate) fails.
    const msg = `duplicate id "${entry.id}" — already mapped to ${byId[entry.id]}; ignoring ${path}. ids must be unique.`;
    warnings.push(msg);
    duplicateIdErrors.push(msg);
  }
}

const knownIds = new Set(Object.keys(byId));
// Resolve one raw edge token (an id, a repo-relative path, or external text) to
// an internal artifact id, or null when it points outside the indexed graph
// (skill names, ../_biz-ops, skills/references, archived paths, etc.).
function resolveEdgeToId(token: string): string | null {
  const t = token.trim();
  if (!t) return null;
  if (knownIds.has(t)) return t;
  if (idByPath[t]) return idByPath[t];
  const norm = t.replace(/^\.\//, "");
  if (idByPath[norm]) return idByPath[norm];
  return null;
}

const graph: Record<string, GraphNode> = {};
for (const [path, entry] of Object.entries(artifacts)) {
  if (!entry.id || byId[entry.id] !== path) continue; // skip dupes (first wins)
  const node: GraphNode = { path, upstream: [], downstream: [], supersedes: [], superseded_by: [], references: [], referenced_by: [] };
  for (const f of EDGE_FIELDS) {
    const raw = entry[f] as string;
    const ids = (raw ? raw.split(",") : [])
      .map((tok) => resolveEdgeToId(tok))
      .filter((x): x is string => x !== null);
    node[f] = [...new Set(ids)];
  }
  graph[entry.id] = node;
}
// reverse index: any forward edge A → B records A in B.referenced_by.
for (const [id, node] of Object.entries(graph)) {
  for (const f of EDGE_FIELDS) {
    for (const target of node[f]) {
      if (target === id) continue;
      const tnode = graph[target];
      if (tnode && !tnode.referenced_by.includes(id)) tnode.referenced_by.push(id);
    }
  }
}

const manifest = {
  version: 2,
  updated_at: new Date().toISOString(),
  artifacts,
  by_id: byId,
  graph,
  experience,
};

const manifestDir = join(ROOT, ".forsvn", "index");
if (existsSync(manifestDir) && lstatSync(manifestDir).isSymbolicLink()) {
  throw new Error("Refusing to write through symlinked .forsvn/index/");
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
    JSON.stringify(existing.by_id) === JSON.stringify(manifest.by_id) &&
    JSON.stringify(existing.graph) === JSON.stringify(manifest.graph) &&
    JSON.stringify(existing.experience) === JSON.stringify(manifest.experience)
  ) {
    manifest.updated_at = existing.updated_at;
  }
} catch {
  // Missing or malformed generated manifest: rewrite with a fresh timestamp.
}

const manifestStr = JSON.stringify(manifest, null, 2) + "\n";
const indexStr = renderArtifactIndex(manifest) + "\n";

if (CHECK) {
  // Freshness gate: compare derived output to disk, ignoring updated_at. Never writes.
  // Duplicate ids first — a split-brain manifest must never pass the gate, even
  // if the on-disk index happens to match the (first-wins) regeneration.
  if (duplicateIdErrors.length) {
    console.error(`[manifest-sync --check] FAIL — duplicate id(s) detected (run validate-artifacts --strict):\n${duplicateIdErrors.map((e) => `  - ${e}`).join("\n")}`);
    process.exit(1);
  }
  if (!existsSync(MANIFEST_PATH) && Object.keys(artifacts).length === 0) {
    console.log("[manifest-sync --check] OK — no artifacts and no index in this project; nothing to check.");
    process.exit(0);
  }
  const drift: string[] = [];
  const onDiskManifest = existsSync(MANIFEST_PATH) ? readFileSync(MANIFEST_PATH, "utf8") : null;
  const onDiskIndex = existsSync(ARTIFACT_INDEX_PATH) ? readFileSync(ARTIFACT_INDEX_PATH, "utf8") : null;
  const stripTs = (s: string | null) => (s == null ? null : s.replace(/"updated_at":\s*"[^"]*"/, '"updated_at":""'));
  if (stripTs(onDiskManifest) !== stripTs(manifestStr)) drift.push(".forsvn/index/manifest.json");
  if (onDiskIndex !== indexStr) drift.push(".forsvn/index/artifact-index.md");
  if (drift.length) {
    console.error(`[manifest-sync --check] STALE — regenerate (bun manifest-sync.ts): ${drift.join(", ")}`);
    process.exit(1);
  }
  console.log("[manifest-sync --check] OK — index is fresh.");
  process.exit(0);
}

writeFileSync(MANIFEST_PATH, manifestStr);
writeFileSync(ARTIFACT_INDEX_PATH, indexStr);

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
