// path-parser — single parser for artifact filenames under `.forsvn/artifacts/`.
//
// v2 grammar (flat): `.forsvn/artifacts/<stack>-<skill>-<YYYY-MM-DD>-<slug>.<ext>`
// Legacy grammar:    `.forsvn/artifacts/{meta,mkt,product,research}/<kind>/<slug>.md`
//
// Consumed by manifest-sync.ts and migrate-artifacts-flat.ts. Keep deterministic —
// the migration script's correctness depends on a single source of truth for
// "what does this path mean."

export type ParsedArtifactPath = {
  // Match status:
  shape: "flat" | "legacy" | "loop" | "experience" | "canonical-top" | "unknown";
  // Extracted fields (undefined when not derivable from the path alone):
  stack?: "meta" | "mkt" | "product" | "research";
  skill?: string;
  date?: string;
  slug?: string;
  extension?: "md" | "html";
  // Original relative path (forward-slash, repo-root relative):
  rel: string;
};

export const FLAT_FILENAME_RE = /^\.forsvn\/artifacts\/(?<stack>meta|mkt|product|research)-(?<skill>[a-z][a-z0-9-]*?)-(?<date>\d{4}-\d{2}-\d{2})-(?<slug>[a-z0-9][a-z0-9-]*)\.(?<ext>md|html)$/;
export const LEGACY_NESTED_RE = /^\.forsvn\/artifacts\/(?<stack>meta|mkt|product|research)\/(?<kind>[^/]+)\/(?<rest>.+)\.md$/;
export const LOOP_RE = /^\.forsvn\/loops\/(?<slug>[^/]+)\/(?<rest>.+\.md)$/;
export const EXPERIENCE_RE = /^\.forsvn\/experience\/(?<name>[a-z]+)\.md$/;
export const CANONICAL_TOP_RE = /^(?<top>brand|architecture|research)\//;

/**
 * Parse a repo-relative artifact path.
 * The `rel` argument MUST use forward-slashes and start at the repo root.
 */
export function parseArtifactPath(rel: string): ParsedArtifactPath {
  const flat = rel.match(FLAT_FILENAME_RE);
  if (flat?.groups) {
    return {
      shape: "flat",
      stack: flat.groups.stack as ParsedArtifactPath["stack"],
      skill: flat.groups.skill,
      date: flat.groups.date,
      slug: flat.groups.slug,
      extension: flat.groups.ext as "md" | "html",
      rel,
    };
  }
  const legacy = rel.match(LEGACY_NESTED_RE);
  if (legacy?.groups) {
    // Strip the leading date from filenames like `2026-05-26-fresh-eyes.md`.
    const restMatch = legacy.groups.rest.match(/^(?<date>\d{4}-\d{2}-\d{2})-(?<slug>.+)$/);
    return {
      shape: "legacy",
      stack: legacy.groups.stack as ParsedArtifactPath["stack"],
      skill: undefined, // legacy paths encode skill via inferProducer rules, not the path
      date: restMatch?.groups?.date,
      slug: restMatch?.groups?.slug ?? legacy.groups.rest,
      extension: "md",
      rel,
    };
  }
  if (LOOP_RE.test(rel)) return { shape: "loop", rel };
  if (EXPERIENCE_RE.test(rel)) return { shape: "experience", rel };
  if (CANONICAL_TOP_RE.test(rel)) return { shape: "canonical-top", rel };
  return { shape: "unknown", rel };
}

/**
 * Build a v2 flat filename from frontmatter-derived fields.
 * Throws if any required field is missing or malformed — callers should
 * validate upstream and surface meaningful errors.
 */
export function buildFlatPath(args: {
  stack: string;
  skill: string;
  date: string;
  slug: string;
  extension?: "md" | "html";
}): string {
  const { stack, skill, date, slug } = args;
  const ext = args.extension ?? "md";
  if (!["meta", "mkt", "product", "research"].includes(stack)) {
    throw new Error(`buildFlatPath: invalid stack ${JSON.stringify(stack)}`);
  }
  if (!/^[a-z][a-z0-9-]*$/.test(skill)) {
    throw new Error(`buildFlatPath: invalid skill slug ${JSON.stringify(skill)}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`buildFlatPath: invalid date ${JSON.stringify(date)}`);
  }
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!cleanSlug) throw new Error(`buildFlatPath: empty slug after normalization (${JSON.stringify(slug)})`);
  if (cleanSlug.length > 60) {
    throw new Error(`buildFlatPath: slug exceeds 60 chars after normalization (${cleanSlug})`);
  }
  return `.forsvn/artifacts/${stack}-${skill}-${date}-${cleanSlug}.${ext}`;
}

/**
 * True if `rel` matches the flat v2 grammar (md or html).
 */
export function isFlatPath(rel: string): boolean {
  return FLAT_FILENAME_RE.test(rel);
}

/**
 * Given a `.md` path, return the co-located HTML twin path (with `.html`
 * extension). Caller is responsible for checking existence.
 */
export function htmlTwinPath(mdRel: string): string {
  if (!mdRel.endsWith(".md")) throw new Error(`htmlTwinPath: expected .md path, got ${mdRel}`);
  return mdRel.replace(/\.md$/, ".html");
}
