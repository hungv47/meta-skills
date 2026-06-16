// GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root.
// path-parser — single parser for artifact paths in the knowledge home.
//
// The three knowledge layers (canonical / artifacts / experience) live under
// ARTIFACT_HOME (`docs/forsvn/`); machine-state and the project-discovery marker
// stay under STATE_HOME (`.forsvn/`). The relocation
// (docs/plans/2026-06-13-001-…) moved the knowledge layers out of `.forsvn/`.
// The builders EMIT the new home; the parser still RECOGNIZES the legacy
// `.forsvn/` knowledge home so the state-root migration tool and back-compat
// indexing keep working (every grammar matches either home — see HOME_RE).
//
// v3 grammar (by-stack layered home — the data model):
//   canonical:   <home>/canonical/<stack>/<UPPER-NAME>.md
//   artifacts:   <home>/artifacts/<stack>/<skill>-<YYYY-MM-DD>-<slug>.<ext>
//   experience:  <home>/experience/<stack>/<name>.md   (dated or plain topic)
//   records:     <home>/artifacts/<stack>/records/<YYYY-MM-DD>-<slug>.md
//                (immutable per-run review/cleanup records; review-work + clean-code
//                 emit here, plus the loose `records/learned-rules.md`)
//     stacks: meta · research · marketing · product   (folder name == frontmatter `stack`)
//     <home> = docs/forsvn (emitted) | .forsvn (legacy, recognized for migration)
//
// Legacy grammars (recognized only so the un-flatten migration + back-compat
// indexing keep working — never emitted for new artifacts):
//   v2 flat:     <home>/artifacts/<stack>-<skill>-<YYYY-MM-DD>-<slug>.<ext>   (stack incl. `mkt`)
//   v1 nested:   <home>/artifacts/{meta,mkt,product,research}/<kind>/<slug>.md
//
// Consumed by manifest-sync.ts, lint-artifact-paths.ts, validate-artifacts.ts,
// find-artifacts.ts, and migrate-artifacts-flat.ts. Keep deterministic — one
// source of truth for "what does this path mean." Mirrored byte-for-byte by the
// Rust twin crates/forsvn-core/src/sync.rs (pinned by tests/manifest_parity.rs).

// The knowledge-layer home (emitted) and the machine-state / discovery-marker
// home (legacy knowledge paths still recognized). KTD1: this is the ONLY place
// the home string is written — every grammar and builder derives from it.
export const ARTIFACT_HOME = "docs/forsvn";
export const STATE_HOME = ".forsvn";

// Regex alternation matching either home as a path prefix, with dots escaped.
// Non-capturing so positional/named capture groups are unaffected; new home
// first. Mirrored as `home_re()` in sync.rs. Exported so the bin tools build
// their own dual-home matchers from the single source (KTD1).
export const HOME_RE = `(?:${ARTIFACT_HOME}|${STATE_HOME})`.replace(/\./g, "\\.");

export const STACKS = ["meta", "research", "marketing", "product"] as const;
export const LAYERS = ["canonical", "artifacts", "experience"] as const;
export type Stack = (typeof STACKS)[number];
export type Layer = (typeof LAYERS)[number];

// Legacy stack alias — the flat v2 grammar + nested v1 grammar used `mkt`.
// New artifacts use `marketing`; the migration + indexer normalize through this.
export const STACK_ALIASES: Record<string, Stack> = { mkt: "marketing" };

export function normalizeStack(raw: string): Stack | undefined {
  if ((STACKS as readonly string[]).includes(raw)) return raw as Stack;
  return STACK_ALIASES[raw];
}

export type ParsedArtifactPath = {
  shape: "canonical" | "artifact" | "experience" | "records" | "legacy-flat" | "legacy-nested" | "loop" | "unknown";
  layer?: Layer;
  // Extracted fields (undefined when not derivable from the path alone):
  stack?: Stack | "mkt";
  skill?: string;
  date?: string;
  slug?: string;
  name?: string; // canonical UPPER-NAME or experience topic
  extension?: "md" | "html";
  rel: string;
};

// --- v3 layered grammar (the home) ------------------------------------------
// Each grammar matches either home via HOME_RE (new emitted home + legacy
// `.forsvn/`); the constants below are the single source of the home string.
export const CANONICAL_RE = new RegExp(
  `^${HOME_RE}/canonical/(?<stack>meta|research|marketing|product)/(?<name>[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*)\\.md$`,
);
export const LAYERED_ARTIFACT_RE = new RegExp(
  `^${HOME_RE}/(?<layer>artifacts|experience)/(?<stack>meta|research|marketing|product)/(?<skill>[a-z][a-z0-9-]*?)-(?<date>\\d{4}-\\d{2}-\\d{2})-(?<slug>[a-z0-9][a-z0-9-]*)\\.(?<ext>md|html)$`,
);
// Experience files may also be plain topic names (no skill/date), e.g. audience.md.
export const EXPERIENCE_LOOSE_RE = new RegExp(
  `^${HOME_RE}/experience/(?<stack>meta|research|marketing|product)/(?<name>[a-z][a-z0-9-]*)\\.md$`,
);
// Per-run records (review-work fresh-eyes, clean-code cleanup): an immutable,
// usually-dated record under a `records/` subfolder. First-class v3 — NOT
// legacy-nested. The date prefix is optional (e.g. `records/learned-rules.md`).
export const RECORDS_RE = new RegExp(
  `^${HOME_RE}/artifacts/(?<stack>meta|research|marketing|product)/records/(?:(?<date>\\d{4}-\\d{2}-\\d{2})-)?(?<slug>[a-z0-9][a-z0-9-]*)\\.md$`,
);

// --- legacy grammars (migration source + back-compat indexing) --------------
export const FLAT_FILENAME_RE = new RegExp(
  `^${HOME_RE}/artifacts/(?<stack>meta|mkt|product|research)-(?<skill>[a-z][a-z0-9-]*?)-(?<date>\\d{4}-\\d{2}-\\d{2})-(?<slug>[a-z0-9][a-z0-9-]*)\\.(?<ext>md|html)$`,
);
export const LEGACY_NESTED_RE = new RegExp(
  `^${HOME_RE}/artifacts/(?<stack>meta|mkt|product|research)/(?<kind>[^/]+)/(?<rest>.+)\\.md$`,
);
// Loops stay under STATE_HOME (machine-state); they do not relocate.
export const LOOP_RE = /^\.forsvn\/loops\/(?<slug>[^/]+)\/(?<rest>.+\.md)$/;

/**
 * Parse a repo-relative artifact path.
 * The `rel` argument MUST use forward-slashes and start at the repo root.
 */
export function parseArtifactPath(rel: string): ParsedArtifactPath {
  const canonical = rel.match(CANONICAL_RE);
  if (canonical?.groups) {
    return {
      shape: "canonical",
      layer: "canonical",
      stack: canonical.groups.stack as Stack,
      name: canonical.groups.name,
      extension: "md",
      rel,
    };
  }
  const layered = rel.match(LAYERED_ARTIFACT_RE);
  if (layered?.groups) {
    return {
      shape: layered.groups.layer === "experience" ? "experience" : "artifact",
      layer: layered.groups.layer as Layer,
      stack: layered.groups.stack as Stack,
      skill: layered.groups.skill,
      date: layered.groups.date,
      slug: layered.groups.slug,
      extension: layered.groups.ext as "md" | "html",
      rel,
    };
  }
  const expLoose = rel.match(EXPERIENCE_LOOSE_RE);
  if (expLoose?.groups) {
    return {
      shape: "experience",
      layer: "experience",
      stack: expLoose.groups.stack as Stack,
      name: expLoose.groups.name,
      extension: "md",
      rel,
    };
  }
  // records/ MUST be checked before the legacy-nested grammar (which would also
  // match `<stack>/records/<rest>` as kind=records and mis-label it legacy).
  const records = rel.match(RECORDS_RE);
  if (records?.groups) {
    return {
      shape: "records",
      layer: "artifacts",
      stack: records.groups.stack as Stack,
      date: records.groups.date, // undefined for loose names (e.g. learned-rules.md)
      slug: records.groups.slug,
      extension: "md",
      rel,
    };
  }
  const flat = rel.match(FLAT_FILENAME_RE);
  if (flat?.groups) {
    return {
      shape: "legacy-flat",
      layer: "artifacts",
      stack: flat.groups.stack as Stack | "mkt",
      skill: flat.groups.skill,
      date: flat.groups.date,
      slug: flat.groups.slug,
      extension: flat.groups.ext as "md" | "html",
      rel,
    };
  }
  const legacy = rel.match(LEGACY_NESTED_RE);
  if (legacy?.groups) {
    const restMatch = legacy.groups.rest.match(/^(?<date>\d{4}-\d{2}-\d{2})-(?<slug>.+)$/);
    return {
      shape: "legacy-nested",
      layer: "artifacts",
      stack: legacy.groups.stack as Stack | "mkt",
      skill: undefined, // legacy paths encode skill via inferProducer rules, not the path
      date: restMatch?.groups?.date,
      slug: restMatch?.groups?.slug ?? legacy.groups.rest,
      extension: "md",
      rel,
    };
  }
  if (LOOP_RE.test(rel)) return { shape: "loop", rel };
  return { shape: "unknown", rel };
}

/**
 * Build a v3 layered path from frontmatter-derived fields.
 * Throws if any required field is missing or malformed.
 */
export function buildLayeredPath(args: {
  layer: Layer;
  stack: string;
  skill: string;
  date: string;
  slug: string;
  extension?: "md" | "html";
}): string {
  const { layer, skill, date, slug } = args;
  const ext = args.extension ?? "md";
  if (!(LAYERS as readonly string[]).includes(layer)) {
    throw new Error(`buildLayeredPath: invalid layer ${JSON.stringify(layer)}`);
  }
  const stack = normalizeStack(args.stack);
  if (!stack) throw new Error(`buildLayeredPath: invalid stack ${JSON.stringify(args.stack)}`);
  if (!/^[a-z][a-z0-9-]*$/.test(skill)) {
    throw new Error(`buildLayeredPath: invalid skill slug ${JSON.stringify(skill)}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`buildLayeredPath: invalid date ${JSON.stringify(date)}`);
  }
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!cleanSlug) throw new Error(`buildLayeredPath: empty slug after normalization (${JSON.stringify(slug)})`);
  if (cleanSlug.length > 60) {
    throw new Error(`buildLayeredPath: slug exceeds 60 chars after normalization (${cleanSlug})`);
  }
  return `${ARTIFACT_HOME}/${layer}/${stack}/${skill}-${date}-${cleanSlug}.${ext}`;
}

/**
 * Build a legacy v2 flat filename (used by the un-flatten migration to detect
 * the source shape; not emitted for new artifacts).
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
  if (cleanSlug.length > 50) {
    throw new Error(`buildFlatPath: slug exceeds 50 chars after normalization (${cleanSlug})`);
  }
  // Legacy v2 flat home stayed under STATE_HOME; the un-flatten migration
  // operates there. Builders emit the legacy home; new artifacts use buildLayeredPath.
  return `${STATE_HOME}/artifacts/${stack}-${skill}-${date}-${cleanSlug}.${ext}`;
}

/** True if `rel` matches the v3 layered artifact/experience/records grammar (md or html). */
export function isLayeredPath(rel: string): boolean {
  return (
    LAYERED_ARTIFACT_RE.test(rel) ||
    CANONICAL_RE.test(rel) ||
    EXPERIENCE_LOOSE_RE.test(rel) ||
    RECORDS_RE.test(rel)
  );
}

/** True if `rel` matches the legacy v2 flat grammar (md or html). */
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
