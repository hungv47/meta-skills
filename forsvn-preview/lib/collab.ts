// collab — shared logic for `forsvn collab` (open: U5, export: U6).
//
// Canonical .md write strategy: byte-fidelity line-level frontmatter upsert +
// atomic temp-rename, mirroring bin/forsvn-preview.ts applyDecision. The plugin
// is the trusted writer of canonical Markdown on this path (the desktop app uses
// forsvn-core's Rust equivalent; that path is deferred with desktop embedding).
// Agents NEVER write canonical .md — they only post suggestions over the bridge.

import { readFileSync, writeFileSync, renameSync, existsSync, statSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { ProofClient, type CreateResult } from "./proof-client";
import { appendVerdict, verdictTs } from "./verdicts";

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

/**
 * Strip Proof's benign first-export canonical reformat so a content comparison
 * fires only on real edits. Reformat-only deltas normalized away: Markdown table
 * cell padding (`| 1 | 2 |` → `|1|2|`), the separator/alignment row representation
 * (`|---|` and `| :- |` collapse to the same canonical form), and a single blank
 * line Proof inserts immediately after the frontmatter close (a leading blank line
 * of the body). Lines inside fenced code blocks are never normalized — a pipe-shaped
 * edit in a fenced example is a real content change and must stay visible to
 * `bodyChanged`. Real content changes survive untouched.
 *
 * Known limits (accepted): an edit that ONLY changes column alignment markers
 * (`:-` ↔ `-:`) normalizes identically and won't flip `bodyChanged`; pipe-shaped
 * lines in indented (4-space) code blocks are normalized like prose — only
 * fenced blocks are protected; rows authored WITHOUT the leading pipe aren't
 * recognized as table rows, so Proof adding leading pipes on reformat raises a
 * false-positive warning (fails safe: extra warning, never a missed detection);
 * and a genuinely empty trailing cell normalizes away (`| a | |` ≡ `| a |` — the
 * GFM optional-trailing-pipe pop swallows it), so adding/removing an empty last
 * column alone won't flip `bodyChanged`.
 */
export function normalizeBody(body: string): string {
  let fence: { char: string; len: number } | null = null;
  const lines = body.split("\n").map((line) => {
    const m = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (m) {
      if (!fence) fence = { char: m[1][0], len: m[1].length };
      else if (m[1][0] === fence.char && m[1].length >= fence.len && m[2].trim() === "")
        fence = null;
      return line;
    }
    if (fence) return line;
    if (!line.trim().startsWith("|")) return line;
    // Split into cells; drop the leading/trailing empties only when they come
    // from the boundary pipes — a GFM-legal row without a trailing pipe
    // (`| a | b`) keeps its final cell, so an edit there stays visible AND
    // Proof adding the trailing pipe on reformat normalizes identically.
    const cells = line.trim().split("|").map((c) => c.trim());
    if (cells[0] === "") cells.shift();
    if (cells.length > 0 && cells[cells.length - 1] === "") cells.pop();
    if (cells.length === 0) return line;
    const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));
    return "|" + (isSeparator ? cells.map(() => "-") : cells).join("|") + "|";
  });
  return lines.join("\n").replace(/^\n/, "");
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
 * binding back to frontmatter. Returns the editor URL. On a fresh import this
 * blocks briefly on `waitReady` until the projection settles, so the caller
 * doesn't report "ready"/open the editor mid-build (R4 / FINDINGS readiness race).
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
  // Readiness gate (R4): wait out the post-create PROJECTION_STALE window so the
  // caller doesn't open the editor before the projection is built. Bounded; on
  // timeout it proceeds (the agent ops path retries STALE on its own).
  const ready = await client.waitReady(doc.slug);
  if (!ready) console.error("[collab] readiness probe did not confirm ready (stale window still open, or probe unavailable) — proceeding; the editor may briefly show a building state");
  // re-index so forsvn-mcp can resolve the new binding for agents immediately.
  runManifestSync(projectRoot);
  return { slug: doc.slug, editorUrl: `${baseUrl}${doc.url ?? `/d/${doc.slug}`}`, created: true, doc };
}

const VALID_EXPORT_DECISIONS = new Set(["approved", "denied", "suggested"]);

export interface ExportResult {
  path: string;
  decision: string;
  /** True when the written canonical body has a REAL content change vs. the
   *  current on-disk body (identical to what `open` imported while the
   *  open→export hash guard is intact; once the guard's working state is
   *  cleared, an out-of-band disk edit is indistinguishable from a Proof edit).
   *  Proof's benign first-export reformat (padded tables, blank line after
   *  frontmatter) is normalized out, so a reformat-only export does not flag.
   *  Callers surface this as a done_with_concerns cue to review the git diff. */
  bodyChanged: boolean;
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
  // Did the canonical body's content actually change? Normalize out Proof's benign
  // first-export reformat so this fires only on real edits — not on every export of
  // a table-containing artifact. Surfaced so the operator knows to review the diff.
  const bodyChanged = normalizeBody(proofBody) !== normalizeBody(onDiskBody);
  atomicWrite(path, merged);

  // C2/L1 — the learning wire: append one verdict row for the Proof-export path
  // (surface "proof"). No chip UI in the editor, so decision_reason is "" and the
  // note records whether the body was edited. Keys come from the doc frontmatter.
  // L2 — record body_sha (the produced-body identity, = onDiskBody, what was
  // imported into Proof). Format mirrors lib/edit-delta.ts bodySha — keep the
  // `sha256:` prefix in sync. edit_classes for the Proof surface is a follow-on
  // (the diff is available here as onDiskBody↔proofBody; CLI/TTY carries it today).
  appendVerdict(projectRoot, {
    ts: verdictTs(),
    artifact_id: readField(text, "id") ?? "",
    skill: readField(text, "skill") ?? "",
    stack: readField(text, "stack") ?? "",
    decision_state: decision,
    decision_reason: "",
    dimensions_flagged: "",
    note: bodyChanged ? "body-edited" : "",
    review_latency_ms: "",
    surface: "proof",
    body_sha: "sha256:" + createHash("sha256").update(onDiskBody, "utf8").digest("hex"),
    edit_classes: "",
  });

  // session done; a later re-open recreates the guard hash from the new body.
  clearBaseHash(projectRoot, slug);
  // re-index so MCP get_artifact/list_pending reflect the new decision_state.
  runManifestSync(projectRoot);
  return { path, decision, bodyChanged };
}

// --- C3: inline-edit body+decision write (shared with C5's Proof-absent path) ---

/**
 * Write an inline-edited body + the decision fields back to a canonical artifact,
 * byte-fidelity. Keeps the plugin-owned frontmatter (upserting only `decisionFields`
 * — `decision_state`, `decision_reason`, `reviewed_at`, `reviewer`), replaces the
 * body with `newBody`, and writes atomically. This is `exportArtifact`'s pattern
 * minus Proof. Returns whether the body's CONTENT actually changed (reformat noise
 * normalized out via `normalizeBody`, so a table-padding-only edit is not flagged).
 * Reused by C5's inline-edit fallback when Proof is unavailable.
 */
export function writeBodyAndDecision(
  path: string,
  newBody: string,
  decisionFields: Record<string, string>,
): { bodyChanged: boolean } {
  const { text } = readArtifact(path);
  const onDiskBody = splitDoc(text).body;
  const bodyChanged = normalizeBody(newBody) !== normalizeBody(onDiskBody);
  const withFm = upsertFrontmatter(text, decisionFields);
  const fm = splitDoc(withFm).frontmatter;
  atomicWrite(path, fm + newBody);
  return { bodyChanged };
}

/**
 * A compact line-level unified diff (LCS) between two bodies — ` ` context,
 * `-` removed, `+` added. Round-tripped to the producing agent as the exact
 * correction (a far stronger signal than a prose comment, and the seed for L2's
 * edit-delta capture). Bodies are small; the O(m·n) table is fine.
 */
export function unifiedDiff(before: string, after: string): string {
  const a = before.split("\n");
  const b = after.split("\n");
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { out.push(` ${a[i]}`); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(`-${a[i]}`); i++; }
    else { out.push(`+${b[j]}`); j++; }
  }
  while (i < m) out.push(`-${a[i++]}`);
  while (j < n) out.push(`+${b[j++]}`);
  return out.join("\n");
}

/** The `### Suggested edit` subsection (a fenced `diff` block) appended beneath
 *  the artifact's `## Reviewer notes` so the producing agent reads the exact
 *  correction from the same record as the decision. */
export function renderSuggestedEditBlock(diff: string): string {
  return `\n### Suggested edit\n\n\`\`\`diff\n${diff}\n\`\`\`\n`;
}
