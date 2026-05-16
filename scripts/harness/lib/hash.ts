// Hashing utilities — used for prompt fingerprints, frontmatter shape, section structure,
// and the composite artifact contract hash that gates regression detection.

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 16);
}

// Extract frontmatter (between leading `---` lines) and return field NAMES only.
// Hash the sorted list of names + their value types — not the values themselves.
// This catches add/rename/remove of fields without flagging operator edits to values.
// Assumes flat top-level YAML (skill artifact convention). Nested mapping field names
// below the first level are not captured; replace with a real YAML parser if that changes.
export function frontmatterShapeHash(filePath: string): { hash: string | null; lifecycle: string | null; status: string | null } {
  if (!existsSync(filePath)) return { hash: null, lifecycle: null, status: null };
  const raw = readFileSync(filePath, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { hash: null, lifecycle: null, status: null };
  const yaml = match[1];
  const fieldNames: string[] = [];
  let lifecycle: string | null = null;
  let status: string | null = null;
  for (const line of yaml.split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    fieldNames.push(m[1]);
    if (m[1] === "lifecycle") lifecycle = m[2].trim().replace(/^["']|["']$/g, "");
    if (m[1] === "status") status = m[2].trim().replace(/^["']|["']$/g, "");
  }
  fieldNames.sort();
  return { hash: sha256(fieldNames.join("|")), lifecycle, status };
}

// Extract markdown section headers (## and below) in document order and hash the sequence.
// Section *order* and *names* are part of the contract — body content is not.
// Fenced code blocks are stripped first so example-output headers inside ``` don't
// pollute the hash. This catches the spec's "docs example inside body" false-positive case.
export function sectionHeaderHash(filePath: string): string | null {
  if (!existsSync(filePath)) return null;
  const raw = readFileSync(filePath, "utf8");
  const body = raw
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "");
  const headers: string[] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^(##+)\s+(.+?)\s*$/);
    if (m) headers.push(`${m[1].length}|${m[2].trim().toLowerCase()}`);
  }
  return sha256(headers.join(">>"));
}

// Composite contract hash — what a refactor must preserve unless atomic with downstream eval update.
export function contractHash(filePath: string): { contract: string | null; frontmatter: string | null; sections: string | null; lifecycle: string | null; status: string | null } {
  const fm = frontmatterShapeHash(filePath);
  const sec = sectionHeaderHash(filePath);
  if (fm.hash === null && sec === null) return { contract: null, frontmatter: null, sections: null, lifecycle: null, status: null };
  return {
    contract: sha256(`${fm.hash ?? ""}|${sec ?? ""}`),
    frontmatter: fm.hash,
    sections: sec,
    lifecycle: fm.lifecycle,
    status: fm.status,
  };
}
