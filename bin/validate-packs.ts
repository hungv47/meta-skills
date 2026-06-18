#!/usr/bin/env bun
// validate-packs — structural validation for playbook packs (the v2 pack contract).
//
// Enforces references/platform-intelligence/CONTRACT.md across every source pack:
//   required frontmatter:  type=platform-intelligence, platform, schema_version,
//                          pack_type (enum), last_verified (YYYY-MM-DD), verifier,
//                          status (enum), summary
//   required sections:     per pack_type (keyword-matched H2s) — see CONTRACT.md
//   playbook non-empty:    §5 must carry a table or numbered sequence
//   staleness:             WARN-only past 90 days (packs are expected to age — the
//                          aging snapshot vs current-pack divergence IS the wedge)
//
// schema_version: 1 packs (the six legacy video packs) are validated under the v1
// section set so this contract change does not retroactively break them. New packs
// MUST be schema_version: 2.
//
// Modes:
//   (default)  warn-only — prints issues, exits 0 (advisory)
//   --strict   fails the gate — exits 1 if any pack is non-conforming
//
// Usage:
//   bun skills/bin/validate-packs.ts --strict
//   bun skills/bin/validate-packs.ts --strict --root /path/to/forsvn
//
// Scopes to the SOURCE dir only (skills/references/platform-intelligence/*.md). It
// never walks the generated _shared/ mirrors (a GENERATED header sits before their
// frontmatter); _template.md and CONTRACT.md are skipped.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const STRICT = process.argv.includes("--strict");
const ROOT = (() => {
  const i = process.argv.indexOf("--root");
  if (i > -1 && process.argv[i + 1]) return process.argv[i + 1];
  return process.cwd();
})();

// Find the pack dir whether invoked from repo root, skills/, or skills/bin/.
const PACK_DIR = (() => {
  for (const cand of [
    "skills/references/platform-intelligence",
    "references/platform-intelligence",
    "../references/platform-intelligence",
  ]) {
    const abs = join(ROOT, cand);
    if (existsSync(abs)) return abs;
  }
  return join(ROOT, "skills/references/platform-intelligence");
})();

const SKIP = new Set(["_template.md", "CONTRACT.md"]);
const PACK_TYPE = new Set(["shortform-video", "launch-channel", "asset-format"]);
const STATUS = new Set(["draft", "reviewed", "stale"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const STALE_DAYS = 90;

// Required H2 section keywords by pack_type (v2). Each entry: a label + a test
// matched against the heading text. `optional` sections are advisory only.
type SectionReq = { label: string; test: RegExp; optionalFor?: Set<string> };
const V2_SECTIONS: SectionReq[] = [
  { label: "Hook Taxonomy / Angles", test: /hook/i },
  { label: "Format Constraints", test: /format constraints/i },
  { label: "Algorithm / Ranking Signals", test: /signals/i, optionalFor: new Set(["asset-format"]) },
  { label: "Anti-Patterns", test: /anti-?pattern/i },
  { label: "Playbook", test: /playbook/i },
  { label: "Timing & Cadence / Hook Window", test: /timing|cadence|hook window|retention curve/i, optionalFor: new Set(["asset-format"]) },
  { label: "CTA / Conversion Norms", test: /\bcta\b|conversion/i },
  { label: "Open Questions", test: /open questions/i },
  { label: "Changelog", test: /changelog/i },
];
// Legacy v1 packs (the six video packs) — their original section set.
const V1_SECTIONS: SectionReq[] = [
  { label: "Hook Taxonomy", test: /hook taxonomy/i },
  { label: "Format Constraints", test: /format constraints/i },
  { label: "Algorithm Signals", test: /algorithm signals/i },
  { label: "Anti-Patterns", test: /anti-?pattern/i },
  { label: "CTA Placement Norms", test: /cta/i },
  { label: "Open Questions", test: /open questions/i },
  { label: "Changelog", test: /changelog/i },
];

type Issue = { file: string; problems: string[]; warnings: string[] };

function field(fm: string, key: string): string | null {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, "").trim();
}

function h2Headings(body: string): string[] {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
}

function daysSince(dateStr: string): number | null {
  const t = Date.parse(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86_400_000);
}

function playbookIsPopulated(body: string): boolean {
  // Grab the Playbook section body (from its H2 to the next H2) and require a
  // table row or a numbered step — not just an empty heading.
  const m = body.match(/^##\s+[^\n]*playbook[^\n]*\n([\s\S]*?)(?=^##\s|\Z)/im);
  if (!m) return false;
  const section = m[1];
  return /^\s*\|.*\|/m.test(section) || /^\s*\d+\.\s+\S/m.test(section);
}

function validate(abs: string, name: string): Issue {
  const problems: string[] = [];
  const warnings: string[] = [];
  const txt = readFileSync(abs, "utf-8");
  const fmMatch = txt.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) {
    return { file: name, problems: ["no frontmatter block"], warnings };
  }
  const fm = fmMatch[1];
  const body = fmMatch[2];

  const type = field(fm, "type");
  if (type !== "platform-intelligence") problems.push(`\`type\` must be platform-intelligence (got "${type ?? "<missing>"}")`);

  const platform = field(fm, "platform");
  if (!platform) problems.push("missing `platform`");
  else if (platform !== name.replace(/\.md$/, "")) warnings.push(`\`platform: ${platform}\` does not match filename stem "${name.replace(/\.md$/, "")}"`);

  const schemaRaw = field(fm, "schema_version");
  const schema = schemaRaw ? Number(schemaRaw) : null;
  if (schema === null || Number.isNaN(schema)) problems.push("missing/invalid `schema_version` (integer)");

  const lastVerified = field(fm, "last_verified");
  if (!lastVerified) problems.push("missing `last_verified`");
  else if (!DATE_RE.test(lastVerified)) problems.push(`\`last_verified\` must be YYYY-MM-DD (got "${lastVerified}")`);

  if (!field(fm, "verifier")) problems.push("missing `verifier`");

  const status = field(fm, "status");
  if (!status) problems.push("missing `status`");
  else if (!STATUS.has(status)) problems.push(`\`status\` invalid: "${status}" (expected ${[...STATUS].join(" | ")})`);

  const headings = h2Headings(body);
  const has = (req: SectionReq) => headings.some((h) => req.test.test(h));

  if (schema === 2) {
    // v2 contract — pack_type + summary + the v2 section set + populated playbook.
    const packType = field(fm, "pack_type");
    if (!packType) problems.push("missing `pack_type` (v2 required)");
    else if (!PACK_TYPE.has(packType)) problems.push(`\`pack_type\` invalid: "${packType}" (expected ${[...PACK_TYPE].join(" | ")})`);
    if (!field(fm, "summary")) problems.push("missing `summary` (v2 required — quoted verbatim by the legibility convention)");

    for (const req of V2_SECTIONS) {
      const optional = packType ? req.optionalFor?.has(packType) : false;
      if (!has(req) && !optional) problems.push(`missing required section: ## …${req.label}…`);
    }
    if (has({ label: "Playbook", test: /playbook/i }) && !playbookIsPopulated(body)) {
      problems.push("`Playbook` section is empty — it must carry a table or a numbered sequence (the spine of the v2 contract)");
    }
  } else if (schema === 1) {
    // Legacy video packs — validate the v1 section set only.
    for (const req of V1_SECTIONS) {
      if (!has(req)) problems.push(`missing required section (v1): ## …${req.label}…`);
    }
  } else if (schema !== null) {
    problems.push(`unknown \`schema_version: ${schema}\` (expected 1 or 2)`);
  }

  // Staleness — WARN only (never fails the gate).
  if (lastVerified && DATE_RE.test(lastVerified) && status !== "stale") {
    const age = daysSince(lastVerified);
    if (age !== null && age > STALE_DAYS) {
      warnings.push(`stale: last_verified ${age}d ago (>${STALE_DAYS}d) — re-verify or set status: stale. Pro clients are served the freshness-pipeline copy.`);
    }
  }

  return { file: name, problems, warnings };
}

if (!existsSync(PACK_DIR)) {
  console.log(`validate-packs: no platform-intelligence dir at ${relative(ROOT, PACK_DIR)}; nothing to validate.`);
  process.exit(0);
}

const packs = readdirSync(PACK_DIR, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith(".md") && !SKIP.has(e.name))
  .map((e) => e.name)
  .sort();

const results = packs.map((name) => validate(join(PACK_DIR, name), name));
const failed = results.filter((r) => r.problems.length > 0);
const warned = results.filter((r) => r.warnings.length > 0);

for (const r of warned) {
  for (const w of r.warnings) console.error(`  warn: ${r.file} — ${w}`);
}

if (failed.length === 0) {
  console.log(`[validate-packs] OK — ${packs.length} pack(s) conform to the v2 contract.`);
  process.exit(0);
}

const tag = STRICT ? "FAIL" : "WARN";
console.error(`[validate-packs] ${tag} — ${failed.length}/${packs.length} pack(s) non-conforming:`);
for (const r of failed) {
  for (const p of r.problems) console.error(`  ${r.file} — ${p}`);
}
console.error("fix per skills/references/platform-intelligence/CONTRACT.md");
process.exit(STRICT ? 1 : 0);
