// workspace — the read/write engine behind the persistent localhost workspace
// server (bin/forsvn-web.ts). A TypeScript port of the parts of
// `crates/forsvn-core/src/manifest.rs` the human surface consumes: load
// `.forsvn/index/manifest.json`, project it into the stream/view/connections DTOs
// the React shell already knows (desktop/src/types.ts), and write a human review
// decision back to the artifact frontmatter under the same byte-fidelity,
// hash-guarded, atomic discipline the one-shot `/forsvn:review` server uses.
//
// This is the trusted local writer of canonical `.md` on the web path. Agents
// never reach it — they only post suggestions over the suggest-only MCP bridge.

import { readFileSync, existsSync, lstatSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join, sep, isAbsolute, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { atomicWrite } from "./collab";

// --- DTOs (mirror desktop/src/types.ts; the wire boundary is structural) -----

export interface ArtifactSummary {
  id: string;
  path: string;
  title: string;
  stack: string;
  type: string;
  status: string;
  decision_state: string;
  summary: string;
  produced_at: string;
  stale: boolean;
  /** The producing skill (manifest `produced_by`, already indexed) — the
   *  provenance for the verified/unverified badge: "Produced by <produced_by>". */
  produced_by: string;
  /** From the manifest (already indexed): false = the file lacks conforming
   *  frontmatter — surfaced as "needs attention", never dropped (U8/R6). */
  frontmatter_present: boolean;
  /** Set by the web server from `.forsvn/runs/events.jsonl` (NOT the manifest):
   *  true = an OBSERVED run-record exists for this id (U8/AE1). "Observed run",
   *  not proof the critic gates fired (KTD3) — never render a bare "Verified". */
  verified?: boolean;
}

export interface ConnectionRef {
  id: string;
  path: string;
  title: string;
}

export interface Connections {
  references: ConnectionRef[];
  referenced_by: ConnectionRef[];
  upstream: ConnectionRef[];
  downstream: ConnectionRef[];
}

export interface ArtifactView extends ArtifactSummary {
  content: string;
  connections: Connections;
  /** Opaque optimistic-concurrency token over `content` (SHA-256). The shell
   *  captures it on open and echoes it back on a decision so a stale overwrite
   *  (the file changed on disk since the human read it) is refused. */
  hash: string;
  /** Proof working-doc slug bound to this artifact, "" when none (P2 co-edit). */
  proof_slug: string;
}

export interface Project {
  name: string;
  root: string;
  pending_count: number;
  total_count: number;
}

/** A manifest entry — only the fields the human surface reads. */
interface Entry {
  id: string;
  type?: string;
  stack?: string;
  status?: string;
  decision_state?: string;
  review_surface?: string;
  title?: string;
  summary?: string;
  produced_at?: string;
  stale?: boolean;
  keywords?: string[];
  proof_slug?: string;
  frontmatter_present?: boolean;
  produced_by?: string;
}

interface GraphNode {
  upstream?: string[];
  downstream?: string[];
  references?: string[];
  referenced_by?: string[];
}

export interface Manifest {
  version: number;
  updated_at: string;
  artifacts: Record<string, Entry>;
  by_id: Record<string, string>;
  graph: Record<string, GraphNode>;
}

export const VALID_DECISIONS = ["approved", "denied", "suggested"] as const;
export type Decision = (typeof VALID_DECISIONS)[number];

/** Thrown when a decision write loses the optimistic-concurrency race (the file
 *  changed on disk since the open hash was captured). The server maps it to 409. */
export class ConflictError extends Error {
  constructor(message = "conflict: artifact changed on disk since it was opened") {
    super(message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {
  constructor(idOrPath: string) {
    super(`artifact not found: ${idOrPath}`);
    this.name = "NotFoundError";
  }
}

// --- manifest loading --------------------------------------------------------

export function manifestPath(root: string): string {
  return join(root, ".forsvn", "index", "manifest.json");
}

export function manifestExists(root: string): boolean {
  return existsSync(manifestPath(root));
}

export function loadManifest(root: string): Manifest {
  const raw = JSON.parse(readFileSync(manifestPath(root), "utf8")) as Partial<Manifest>;
  return {
    version: raw.version ?? 0,
    updated_at: raw.updated_at ?? "",
    artifacts: raw.artifacts ?? {},
    by_id: raw.by_id ?? {},
    graph: raw.graph ?? {},
  };
}

function contentHash(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

// --- projection (manifest -> DTOs) -------------------------------------------

function summarize(path: string, e: Entry): ArtifactSummary {
  return {
    id: e.id,
    path,
    title: e.title && e.title.length > 0 ? e.title : e.id,
    stack: e.stack ?? "",
    type: e.type ?? "",
    status: e.status ?? "",
    decision_state: e.decision_state ?? "",
    summary: e.summary ?? "",
    produced_at: e.produced_at ?? "",
    stale: e.stale ?? false,
    produced_by: e.produced_by ?? "",
    // Default true: a legacy manifest without the flag is treated as conforming
    // (only an explicit `false` marks a non-conforming file as needs-attention).
    frontmatter_present: e.frontmatter_present ?? true,
  };
}

// newest produced_at first (ISO dates sort lexically), then path for stability.
function sortStream(rows: ArtifactSummary[]): ArtifactSummary[] {
  return rows.sort(
    (a, b) => b.produced_at.localeCompare(a.produced_at) || a.path.localeCompare(b.path),
  );
}

export function listAll(m: Manifest): ArtifactSummary[] {
  return sortStream(Object.entries(m.artifacts).map(([path, e]) => summarize(path, e)));
}

export function listPending(m: Manifest): ArtifactSummary[] {
  return sortStream(
    Object.entries(m.artifacts)
      .filter(([, e]) => e.decision_state === "pending")
      .map(([path, e]) => summarize(path, e)),
  );
}

/** Resolve a key that is either an id or a path to its indexed path, or null. */
function resolveKey(m: Manifest, idOrPath: string): string | null {
  if (m.artifacts[idOrPath]) return idOrPath;
  const p = m.by_id[idOrPath];
  return p && m.artifacts[p] ? p : null;
}

function refs(m: Manifest, ids: string[] | undefined): ConnectionRef[] {
  if (!ids) return [];
  const out: ConnectionRef[] = [];
  for (const id of ids) {
    const path = m.by_id[id];
    if (!path) continue; // external literal token (skill name, out-of-graph) — dropped
    const e = m.artifacts[path];
    const title = e && e.title ? e.title : id;
    out.push({ id, path, title });
  }
  return out;
}

export function connections(m: Manifest, id: string): Connections {
  const g = m.graph[id];
  if (!g) return { references: [], referenced_by: [], upstream: [], downstream: [] };
  return {
    references: refs(m, g.references),
    referenced_by: refs(m, g.referenced_by),
    upstream: refs(m, g.upstream),
    downstream: refs(m, g.downstream),
  };
}

/** True when `rel` is a safe in-tree target — not absolute, no `..` component,
 *  and not a symlink. The manifest is untrusted at this boundary (it is read by
 *  the MCP server and the webview); an escaping target is never read. */
function isContained(root: string, rel: string): boolean {
  if (isAbsolute(rel)) return false;
  const norm = normalize(rel);
  if (norm === ".." || norm.startsWith(".." + sep) || norm.split(sep).includes("..")) return false;
  const joined = join(root, norm);
  try {
    // lstat (not stat) so a symlinked target is rejected, never followed.
    if (lstatSync(joined).isSymbolicLink()) return false;
  } catch {
    return false; // missing target — caller surfaces NotFound
  }
  return true;
}

export function getArtifact(root: string, m: Manifest, idOrPath: string): ArtifactView {
  const path = resolveKey(m, idOrPath);
  if (!path) throw new NotFoundError(idOrPath);
  const entry = m.artifacts[path];
  if (!isContained(root, path)) throw new NotFoundError(path);
  const joined = join(root, path);
  let content: string;
  try {
    content = readFileSync(joined, "utf8");
  } catch {
    throw new NotFoundError(path);
  }
  return {
    ...summarize(path, entry),
    content,
    connections: connections(m, entry.id),
    hash: contentHash(content),
    proof_slug: entry.proof_slug ?? "",
  };
}

export function loadProject(root: string): Project {
  const m = loadManifest(root);
  const entries = Object.values(m.artifacts);
  return {
    name: root.split(sep).filter(Boolean).slice(-1)[0] ?? root,
    root,
    pending_count: entries.filter((e) => e.decision_state === "pending").length,
    total_count: entries.length,
  };
}

// --- decision write-back -----------------------------------------------------

/** Append the reviewer-notes block (mirrors forsvn-preview.ts renderCommentBlock):
 *  a `## Reviewer notes` section with attribution + the optional quoted comment,
 *  so the producing agent reads the "why" back from the same record as the
 *  decision_state. An empty comment records attribution only. */
function renderCommentBlock(comment: string, reviewer: string, reviewedAt: string): string {
  let out = `\n\n## Reviewer notes\n_${reviewer} · ${reviewedAt}_\n`;
  const lines = comment.split(/\r?\n/).map((l) => l.trimEnd());
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  if (lines.length > 0) out += `\n${lines.map((l) => `> ${l}`).join("\n")}\n`;
  return out;
}

function frontmatterUpsert(source: string, fields: Record<string, string>): string {
  const match = source.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)(\r?\n|$)/);
  if (!match) throw new Error("expected frontmatter at top of artifact");
  const [, open, body, close, after] = match;
  const seen = new Set<string>();
  const updated = body.split(/\r?\n/).map((line) => {
    const km = line.match(/^([a-zA-Z_][\w-]*)\s*:/);
    if (!km) return line;
    const key = km[1];
    if (key in fields) {
      seen.add(key);
      return `${key}: ${fields[key]}`;
    }
    return line;
  });
  for (const key of Object.keys(fields)) if (!seen.has(key)) updated.push(`${key}: ${fields[key]}`);
  return open + updated.join("\n") + close + after + source.slice(match[0].length);
}

function appendCommentBlock(source: string, block: string): string {
  const match = source.match(/^(---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$))([\s\S]*)$/);
  if (!match) return source.replace(/\s*$/, "") + block;
  const [, fm, rest] = match;
  // Append beneath an existing "## Reviewer notes" rather than nesting a new one.
  const body = /^## Reviewer notes\b/m.test(rest)
    ? rest.replace(/\s*$/, "") + "\n" + block
    : rest.replace(/\s*$/, "") + block;
  return fm + body;
}

export interface DecisionInput {
  decision: Decision;
  reviewer: string;
  reviewedAt: string; // YYYY-MM-DD
  comment: string;
  /** The hash the shell captured when it opened the artifact; null skips the guard. */
  expectedHash: string | null;
}

/**
 * Write a human review decision to the artifact frontmatter. Re-reads the file,
 * refuses (ConflictError) if its bytes changed since `expectedHash` was captured,
 * upserts `decision_state` / `reviewed_at` / `reviewer`, appends the reviewer
 * notes block, and writes atomically. Returns the refreshed view (its hash now
 * over the written bytes). Best-effort re-indexes the manifest so the stream and
 * the MCP collab tools see the new state. Throws if `decision` is invalid.
 */
export function writeDecision(root: string, idOrPath: string, input: DecisionInput): ArtifactView {
  if (!(VALID_DECISIONS as readonly string[]).includes(input.decision)) {
    throw new Error(`decision must be one of ${VALID_DECISIONS.join(" | ")}`);
  }
  const m = loadManifest(root);
  const path = resolveKey(m, idOrPath);
  if (!path) throw new NotFoundError(idOrPath);
  if (!isContained(root, path)) throw new NotFoundError(path);
  const joined = join(root, path);

  let current: string;
  try {
    current = readFileSync(joined, "utf8");
  } catch {
    throw new ConflictError("artifact unreadable or removed since it was opened");
  }
  if (input.expectedHash !== null && contentHash(current) !== input.expectedHash) {
    throw new ConflictError();
  }

  const reviewer = input.reviewer.trim() || "operator";
  let next = frontmatterUpsert(current, {
    decision_state: input.decision,
    reviewed_at: input.reviewedAt,
    reviewer,
  });
  const comment = input.comment.trim();
  if (comment.length > 0) {
    next = appendCommentBlock(next, renderCommentBlock(comment, reviewer, input.reviewedAt));
  }
  atomicWrite(joined, next);

  syncManifest(root);

  // Re-load so connections/summary reflect any re-index, but read the body we
  // just wrote (the manifest is metadata only).
  const after = manifestExists(root) ? loadManifest(root) : m;
  const entry = after.artifacts[path] ?? m.artifacts[path];
  return {
    ...summarize(path, { ...entry, decision_state: input.decision }),
    content: next,
    connections: connections(after, entry.id),
    hash: contentHash(next),
    proof_slug: entry.proof_slug ?? "",
  };
}

// --- manifest re-index -------------------------------------------------------

let manifestSyncScript: string | null | undefined;

/** Locate skills/bin/manifest-sync.ts relative to this module (dev repo +
 *  installed plugin both ship it as a sibling of forsvn-preview/). */
function findManifestSyncScript(): string | null {
  if (manifestSyncScript !== undefined) return manifestSyncScript;
  const here = fileURLToPath(new URL(".", import.meta.url)); // …/forsvn-preview/lib/
  const candidate = join(here, "..", "..", "bin", "manifest-sync.ts");
  manifestSyncScript = existsSync(candidate) ? candidate : null;
  return manifestSyncScript;
}

/** Best-effort re-index after a write. The manifest-sync script takes ROOT as a
 *  positional arg; failures are non-fatal (the on-disk index just stays stale
 *  until the next sync). */
export function syncManifest(root: string): void {
  // An installed project may ship the script at <root>/scripts/manifest-sync.ts.
  const projectScript = join(root, "scripts", "manifest-sync.ts");
  const script = existsSync(projectScript) ? projectScript : findManifestSyncScript();
  if (!script) return;
  const r = spawnSync("bun", [script, root], { encoding: "utf8", cwd: root });
  if (r.status !== 0 && process.env.FORSVN_DEBUG) {
    console.error(`[forsvn-web] manifest-sync exited ${r.status}: ${(r.stderr || "").slice(0, 200)}`);
  }
}
