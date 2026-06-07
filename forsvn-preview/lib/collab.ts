// collab — shared logic for `forsvn collab` (open: U5, export: U6).
//
// Canonical .md write strategy: byte-fidelity line-level frontmatter upsert +
// atomic temp-rename, mirroring bin/forsvn-preview.ts applyDecision. The plugin
// is the trusted writer of canonical Markdown on this path (the desktop app uses
// forsvn-core's Rust equivalent; that path is deferred with desktop embedding).
// Agents NEVER write canonical .md — they only post suggestions over the bridge.

import { readFileSync, writeFileSync, renameSync, existsSync, statSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { ProofClient, type CreateResult } from "./proof-client";

/** Walk up from `start` to the nearest dir containing `.forsvn/`. */
export function findProjectRoot(start: string): string {
  let dir = resolve(start);
  for (;;) {
    if (existsSync(join(dir, ".forsvn"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) throw new Error(`no .forsvn/ found above ${start}`);
    dir = parent;
  }
}

// The open→export conflict-guard hash is TRANSIENT working state, so it lives
// under .forsvn/proof/ (gitignored), NOT in the canonical .md — keeping the
// committed artifact churn-free and honoring "Proof owns only working state".
function baseHashFile(projectRoot: string, slug: string): string {
  return join(projectRoot, ".forsvn", "proof", `basehash-${slug}.txt`);
}
function writeBaseHash(projectRoot: string, slug: string, body: string): void {
  const f = baseHashFile(projectRoot, slug);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, contentHash(body), "utf8");
}
function readBaseHash(projectRoot: string, slug: string): string | null {
  const f = baseHashFile(projectRoot, slug);
  return existsSync(f) ? readFileSync(f, "utf8").trim() : null;
}
function clearBaseHash(projectRoot: string, slug: string): void {
  try { rmSync(baseHashFile(projectRoot, slug)); } catch { /* already gone */ }
}

// Re-index after a frontmatter write so the MCP collab tools (which resolve the
// Proof binding + decision_state from manifest.json, not frontmatter) see the
// change. Mirrors forsvn-preview.ts runManifestSync: the script ships to installed
// projects at scripts/manifest-sync.ts; skipped (with no error) when absent, e.g.
// the dev repo where it lives at skills/bin/.
function runManifestSync(projectRoot: string): void {
  const script = join(projectRoot, "scripts", "manifest-sync.ts");
  if (!existsSync(script)) return;
  const r = spawnSync("bun", [script, projectRoot], { encoding: "utf8" });
  if (r.status !== 0 && process.env.FORSVN_DEBUG) {
    console.error(`(manifest-sync exited ${r.status}: ${(r.stderr || "").slice(0, 200)})`);
  }
}

function frontmatterBounds(text: string): { start: number; end: number } | null {
  if (!text.startsWith("---")) return null;
  const firstNl = text.indexOf("\n");
  if (firstNl < 0) return null;
  const close = text.indexOf("\n---", firstNl);
  if (close < 0) return null;
  const closeLineEnd = text.indexOf("\n", close + 1);
  return { start: firstNl + 1, end: close + 1 }; // [start, end) spans the inner FM lines
}

export function readField(text: string, key: string): string | null {
  const b = frontmatterBounds(text);
  if (!b) return null;
  const fm = text.slice(b.start, b.end);
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "").trim() : null;
}

/** Split into the frontmatter block (incl. delimiters) and the body after it. */
export function splitDoc(text: string): { frontmatter: string; body: string } {
  const close = text.indexOf("\n---", text.indexOf("\n") + 1);
  if (!text.startsWith("---") || close < 0) return { frontmatter: "", body: text };
  const bodyStart = text.indexOf("\n", close + 1);
  if (bodyStart < 0) return { frontmatter: text, body: "" };
  return { frontmatter: text.slice(0, bodyStart + 1), body: text.slice(bodyStart + 1) };
}

/**
 * Upsert flat scalar frontmatter keys, preserving every other byte. Existing
 * keys are replaced in place; new keys are inserted just before the closing `---`.
 */
export function upsertFrontmatter(text: string, fields: Record<string, string>): string {
  const b = frontmatterBounds(text);
  if (!b) throw new Error("artifact has no frontmatter block");
  let head = text.slice(0, b.start);
  let fm = text.slice(b.start, b.end);
  const tail = text.slice(b.end);
  for (const [key, value] of Object.entries(fields)) {
    const re = new RegExp(`^(${key}):.*$`, "m");
    const lineVal = `${key}: ${value}`;
    if (re.test(fm)) fm = fm.replace(re, lineVal);
    else fm = fm.endsWith("\n") ? `${fm}${lineVal}\n` : `${fm}\n${lineVal}\n`;
  }
  return head + fm + tail;
}

/** Cheap non-crypto content hash for our own open→export conflict guard. */
export function contentHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

export function atomicWrite(path: string, content: string): void {
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, content, "utf8");
  renameSync(tmp, path); // same-dir rename is atomic on POSIX
}

export function readArtifact(path: string): { text: string; mtimeMs: number } {
  return { text: readFileSync(path, "utf8"), mtimeMs: statSync(path).mtimeMs };
}

export interface OpenResult {
  slug: string;
  editorUrl: string;
  created: boolean;
  doc: CreateResult | { slug: string };
}

/**
 * Import the artifact into Proof (or reuse an existing binding), write the
 * binding back to frontmatter. Returns the editor URL. Does not block.
 */
export async function openArtifact(client: ProofClient, baseUrl: string, artifactPath: string, opts: { agent?: boolean } = {}): Promise<OpenResult> {
  const path = resolve(artifactPath);
  const { text } = readArtifact(path);
  if (!frontmatterBounds(text)) throw new Error(`${artifactPath}: no frontmatter — not a reviewable artifact`);

  const projectRoot = findProjectRoot(path);
  const existingSlug = readField(text, "proof_slug");
  if (existingSlug) {
    // Reuse if the doc still exists on this server (persisted sqlite).
    try {
      await client.exportMarkdown(existingSlug, undefined);
      writeBaseHash(projectRoot, existingSlug, splitDoc(text).body);
      return { slug: existingSlug, editorUrl: `${baseUrl}/d/${existingSlug}`, created: false, doc: { slug: existingSlug } };
    } catch {
      /* binding stale (fresh db) — fall through and recreate */
    }
  }

  const title = readField(text, "summary") || readField(text, "id") || "FORSVN collaborative doc";
  const doc = await client.createDocument({
    markdown: text,
    title: title.slice(0, 120),
    role: "commenter",
    ownerId: "human:operator",
  });
  const updated = upsertFrontmatter(text, {
    review_tool: "proof",
    proof_slug: doc.slug,
    proof_doc_id: doc.docId ?? "",
    collab_state: "in_review",
  });
  atomicWrite(path, updated);
  // import-time body hash → working state (the open→export conflict guard).
  writeBaseHash(projectRoot, doc.slug, splitDoc(text).body);
  // re-index so forsvn-mcp can resolve the new binding for agents immediately.
  runManifestSync(projectRoot);
  return { slug: doc.slug, editorUrl: `${baseUrl}${doc.url ?? `/d/${doc.slug}`}`, created: true, doc };
}

const VALID_EXPORT_DECISIONS = new Set(["approved", "denied", "suggested"]);

export interface ExportResult {
  path: string;
  decision: string;
}

/**
 * Pull the accepted markdown from Proof and write it back to the canonical .md.
 * Body comes from Proof (the collaborative edits); frontmatter stays plugin-owned
 * (binding preserved, decision fields updated). Refuses if the on-disk body was
 * changed outside Proof since `open` (hash guard) — no silent clobber.
 */
export async function exportArtifact(
  client: ProofClient,
  artifactPath: string,
  opts: { decision?: string; reviewer?: string } = {},
): Promise<ExportResult> {
  const path = resolve(artifactPath);
  const decision = opts.decision ?? "approved";
  if (!VALID_EXPORT_DECISIONS.has(decision)) {
    throw new Error(`invalid --decision "${decision}" (expected ${[...VALID_EXPORT_DECISIONS].join(" | ")})`);
  }
  const { text } = readArtifact(path);
  const slug = readField(text, "proof_slug");
  if (!slug) throw new Error(`${artifactPath}: no proof_slug binding — run \`forsvn collab open\` first`);
  const projectRoot = findProjectRoot(path);

  // Conflict guard: the on-disk body must match what we imported (hash kept in
  // working state, not the canonical .md). Absent guard (working state cleared)
  // degrades to no-check, same as before.
  const baseHash = readBaseHash(projectRoot, slug);
  const onDiskBody = splitDoc(text).body;
  if (baseHash && contentHash(onDiskBody) !== baseHash) {
    throw new Error(
      `${artifactPath}: on-disk body changed since \`open\` (hash mismatch). ` +
        `Resolve the out-of-band edit before exporting — refusing to overwrite.`,
    );
  }

  // Proof returns the full doc (frontmatter + edited body); we keep only its body
  // and re-attach the plugin-owned frontmatter with decision fields updated.
  const proofDoc = await client.exportMarkdown(slug, undefined);
  const proofBody = splitDoc(proofDoc).body || proofDoc;

  const today = new Date().toISOString().slice(0, 10);
  const newFrontmatter = upsertFrontmatter(text, {
    decision_state: decision,
    collab_state: "exported",
    reviewed_at: today,
    reviewer: opts.reviewer ?? "operator",
  });
  const newFm = splitDoc(newFrontmatter).frontmatter;
  const merged = newFm + proofBody;
  atomicWrite(path, merged);
  // session done; a later re-open recreates the guard hash from the new body.
  clearBaseHash(projectRoot, slug);
  // re-index so MCP get_artifact/list_pending reflect the new decision_state.
  runManifestSync(projectRoot);
  return { path, decision };
}
