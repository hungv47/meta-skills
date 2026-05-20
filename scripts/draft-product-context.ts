#!/usr/bin/env bun
// Draft research/product-context.md — the 12-section product-marketing context file.
//
// Mechanically scaffolds the schema from references/product-marketing-context-schema.md
// and fills what can be extracted from local sources WITHOUT reasoning:
//   - package.json                 → §1 (name, description, version)
//   - README.md                    → §1 (title, one-liner), §12 (Goals/Roadmap heading if present)
//   - brand/BRAND.md                → §10 (cited, not duplicated)
//   - research/market-research.md   → §5 (pointer)
//   - .forsvn/experience/{audience,business}.md → noted as available source for §3/§9, §1/§12
// Sections that need interviews or reasoning are stubbed `[TBD]` with a source hint.
// `research-icp` synthesizes the rest when it runs.
//
// Runs against the CURRENT WORKING DIRECTORY (the host project) — not the meta-skills repo.
//
// Usage:
//   bun scripts/draft-product-context.ts [--force] [--out <path>]
//     --force   overwrite an existing research/product-context.md
//     --out     write somewhere other than research/product-context.md

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const force = args.includes("--force");
const outIdx = args.indexOf("--out");
const outPath = resolve(root, outIdx !== -1 && args[outIdx + 1] ? args[outIdx + 1] : "research/product-context.md");

if (existsSync(outPath) && !force) {
  console.error(`Refusing to overwrite existing ${outPath} — pass --force to replace it.`);
  process.exit(1);
}

const today = new Date().toLocaleDateString("sv"); // ISO YYYY-MM-DD, local time

function readIf(rel: string): string | null {
  const p = join(root, rel);
  if (!existsSync(p)) return null;
  try {
    return readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

// --- gather local sources -------------------------------------------------
const pkgRaw = readIf("package.json");
const readme = readIf("README.md") ?? readIf("readme.md");
const hasBrand = existsSync(join(root, "brand/BRAND.md"));
const hasMarket = existsSync(join(root, "research/market-research.md"));
const hasAudienceXp = existsSync(join(root, ".forsvn/experience/audience.md"));
const hasBusinessXp = existsSync(join(root, ".forsvn/experience/business.md"));

let pkg: { name?: string; description?: string; version?: string } = {};
if (pkgRaw) {
  try {
    pkg = JSON.parse(pkgRaw);
  } catch {
    console.warn("Warning: package.json present but unparseable — skipping it.");
  }
}

// README: first H1 → title; first prose paragraph → one-liner candidate.
function readmeTitle(): string | null {
  if (!readme) return null;
  const m = readme.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}
function readmeOneLiner(): string | null {
  if (!readme) return null;
  const lines = readme.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l || l.startsWith("#") || l.startsWith(">") || l.startsWith("![") || l.startsWith("[!") || l.startsWith("|") || l.startsWith("```")) continue;
    return l.replace(/\s+/g, " ").slice(0, 200);
  }
  return null;
}
// README: extract a Goals/Roadmap/Objectives section body if one exists.
function readmeGoals(): string | null {
  if (!readme) return null;
  const lines = readme.split("\n");
  const start = lines.findIndex((l) => /^#+\s+(goals?|roadmap|objectives?|north.?star|milestones?)\b/i.test(l));
  if (start === -1) return null;
  const level = (lines[start].match(/^#+/) ?? ["#"])[0].length;
  const body: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const h = lines[i].match(/^(#+)\s/);
    if (h && h[1].length <= level) break;
    body.push(lines[i]);
  }
  const text = body.join("\n").trim();
  return text.length > 0 ? text : null;
}

const productName = pkg.name ?? readmeTitle() ?? "this project";

// --- build the 12 sections ------------------------------------------------
// A section counts as "completed" only if its rendered text contains no `[TBD]`.
const TBD = "`[TBD";
const sections: { n: number; text: string }[] = [];

const oneLiner = pkg.description ?? readmeOneLiner();
sections.push({
  n: 1,
  text: `## 1. Product Overview

**Name:** ${pkg.name ?? readmeTitle() ?? "`[TBD]`"}
**Category:** \`[TBD — auto-draft can't infer; research-icp fills]\`
**Platform:** \`[TBD — research-icp fills]\`
**Pricing:** \`[TBD — research-icp fills]\`
**One-liner:** ${oneLiner ? oneLiner : "`[TBD — research-icp fills]`"}
${pkg.version ? `\n_package.json version: ${pkg.version}_` : ""}`.trim(),
});

sections.push({
  n: 2,
  text: `## 2. Target Audience

**Primary buyer:** \`[TBD — auto-draft from: landing page; research-icp fills]\`
**Primary user:** \`[TBD]\`
**Decision maker:** \`[TBD]\`
**Anti-audience:** \`[TBD]\``,
});

sections.push({
  n: 3,
  text: `## 3. Personas (JTBD)

\`[TBD — requires operator/customer interviews. ${hasAudienceXp ? "Source available: .forsvn/experience/audience.md." : "No .forsvn/experience/audience.md found."} research-icp fills.]\``,
});

sections.push({
  n: 4,
  text: `## 4. Problems & Pain Points

**Functional:** \`[TBD — auto-draft from: ${hasMarket ? "research/market-research.md" : "research/market-research.md (not found)"}; research-icp fills]\`
**Emotional:** \`[TBD]\`
**Social:** \`[TBD]\``,
});

sections.push({
  n: 5,
  text: `## 5. Competitive Landscape

${hasMarket ? "_Source: `research/market-research.md` exists — research-icp should pull 3-5 competitors from it._\n\n" : ""}\`[TBD — ${hasMarket ? "extract from research/market-research.md" : "no research/market-research.md found; run research-market"}; research-icp fills]\``,
});

sections.push({
  n: 6,
  text: `## 6. Differentiation

**Unique Mechanism:** \`[TBD — auto-draft from: landing page / operator input; research-icp fills]\`
**Unfair advantages:** \`[TBD]\`
**Claims competitors CAN'T make:** \`[TBD]\``,
});

sections.push({
  n: 7,
  text: `## 7. Objections & Anti-Personas

**Top objections:** \`[TBD — requires sales/churn notes; research-icp fills]\`
**Anti-personas:** \`[TBD]\``,
});

sections.push({
  n: 8,
  text: `## 8. Switching Dynamics (JTBD)

\`[TBD — Four Forces (Push/Pull/Habit/Anxiety) require customer interviews; research-icp fills]\``,
});

sections.push({
  n: 9,
  text: `## 9. Customer Language

\`[TBD — verbatim quotes from reviews/support/interviews. ${hasAudienceXp ? "Source available: .forsvn/experience/audience.md." : "No .forsvn/experience/audience.md found."} research-icp fills.]\``,
});

sections.push({
  n: 10,
  text: hasBrand
    ? `## 10. Brand Voice

**Source:** \`brand/BRAND.md\` § "Voice" — cite that file; do not duplicate it here.
_research-icp should lift formality, personality traits, banned words, and right/wrong sample sentences from \`brand/BRAND.md\`._`
    : `## 10. Brand Voice

\`[TBD — no brand/BRAND.md found; run create-brand, or research-icp fills from operator input]\``,
});

sections.push({
  n: 11,
  text: `## 11. Proof Points

**Stats / case studies / awards / integrations:** \`[TBD — auto-draft from: landing page / operator input; research-icp fills]\``,
});

sections.push({
  n: 12,
  text: (() => {
    const goals = readmeGoals();
    if (goals) {
      return `## 12. Goals

_Extracted from README.md — verify and convert to a north-star metric:_

${goals}

**North-star metric:** \`[TBD — research-icp fills]\``;
    }
    return `## 12. Goals

**North-star metric:** \`[TBD — auto-draft from: README.md / operator input; research-icp fills]\`
**Current value / Target / Constraints:** \`[TBD]\``;
  })(),
});

const completed = sections.filter((s) => !s.text.includes(TBD)).map((s) => s.n).sort((a, b) => a - b);

// --- assemble the file ----------------------------------------------------
const frontmatter = `---
skill: research-icp
version: 1
date: ${today}
status: needs_context
summary: "[product-context] ${productName} 12-section context for marketing+product skills"
purpose: "Single source of product/audience/positioning truth read by every marketing+product skill before cold-start"
lifecycle: canonical
use_when: "Before any marketing or product skill execution; before any cold-start question"
upstream: "operator interviews, research/market-research.md, brand/BRAND.md, README.md, landing pages"
downstream: "every marketing skill, every product skill (before-starting-check)"
sections_completed: [${completed.join(", ")}]
confidence: low
last_validated: ${today}
---`;

const body = `# Product-Marketing Context — ${productName}

> Auto-drafted by \`scripts/draft-product-context.ts\` on ${today} from local sources.
> **This is a scaffold, not a finished context file.** Most sections are \`[TBD]\` stubs.
> Run \`research-icp\` to synthesize the remaining sections from interviews and research,
> then set \`status\`, \`confidence\`, and \`sections_completed\` honestly.
> Schema: \`references/product-marketing-context-schema.md\`.

${sections.map((s) => s.text).join("\n\n")}
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${frontmatter}\n\n${body}`);

// --- report ---------------------------------------------------------------
const rel = outPath.startsWith(root + "/") ? outPath.slice(root.length + 1) : outPath;
console.log(`Drafted ${rel}`);
console.log(`  sources read: ${[
  pkgRaw ? "package.json" : null,
  readme ? "README.md" : null,
  hasBrand ? "brand/BRAND.md" : null,
  hasMarket ? "research/market-research.md" : null,
  hasAudienceXp ? ".forsvn/experience/audience.md" : null,
  hasBusinessXp ? ".forsvn/experience/business.md" : null,
].filter(Boolean).join(", ") || "(none — all sections stubbed)"}`);
console.log(`  sections filled (no [TBD]): ${completed.length > 0 ? completed.join(", ") : "(none)"}`);
console.log(`  sections stubbed: ${sections.length - completed.length} of 12`);
console.log(`  status: needs_context, confidence: low — run research-icp to complete.`);
