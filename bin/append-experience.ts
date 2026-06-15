#!/usr/bin/env bun
// append-experience — write a learning into the append-only MEMORY layer.
//
// Phase 1 (knowledge graph): the `experience/` layer goes live. A run appends
// what it learned (a decision, a dead-end, a Q&A) to
// `docs/forsvn/experience/<stack>/<name>.md`; the NEXT run reads it (via
// `find-artifacts --context`) instead of re-asking or repeating a mistake.
//
// The file is created with contract-conforming frontmatter on first write and
// appended to thereafter — strictly append-only: entries are never edited,
// deduplicated, or removed. When a heading recurs, the newest entry (last in
// the file) is the current one by reading convention; earlier entries stay as
// audit history.
//
// Usage:
//   bun skills/bin/append-experience.ts <stack> --name <topic> \
//       --heading "Audience — primary persona" \
//       --by campaign-plan \
//       --body "Engineering managers at mid-size SaaS companies."
//   echo "long body" | bun skills/bin/append-experience.ts meta --name patterns --heading "X" --by forsvn --body -
//
// Flags: --root <path>  --date YYYY-MM-DD

import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync, lstatSync, realpathSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { normalizeStack, STACKS } from "./lib/path-parser";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
}
function fail(msg: string): never {
  console.error(`append-experience: ${msg}`);
  process.exit(1);
}

const positional = process.argv.slice(2).find((a, i) => i === 0 && !a.startsWith("--"));
const ROOT = realpathSync(resolve(arg("--root") ?? process.cwd()));
const rawStack = arg("--stack") ?? positional ?? "";
const stack = normalizeStack(rawStack);
const name = arg("--name");
const heading = arg("--heading");
const by = arg("--by") ?? "forsvn";
const today = new Date().toISOString().slice(0, 10);
const date = arg("--date") ?? today;
let body = arg("--body");

if (!stack) fail(`invalid or missing stack (expected one of ${STACKS.join(" | ")}). Pass it as the first arg or via --stack.`);
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) fail(`--name must be a kebab topic slug (got ${JSON.stringify(name)})`);
if (!heading || heading.includes("\n")) fail("--heading is required and must be a single line");
if (!/^[a-z][a-z0-9-]*$/.test(by)) fail(`--by must be a kebab skill slug (got ${JSON.stringify(by)})`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`--date must be YYYY-MM-DD (got ${JSON.stringify(date)})`);
if (body === "-") body = readFileSync(0, "utf8").trimEnd(); // stdin
if (!body || !body.trim()) fail("--body is required (text, or `-` to read stdin)");

const dir = join(ROOT, "docs", "forsvn", "experience", stack);
const file = join(dir, `${name}.md`);
// path-safety: the resolved file must stay inside docs/forsvn/experience/<stack>/
const expRoot = join(ROOT, "docs", "forsvn", "experience");
if (!resolve(file).startsWith(resolve(expRoot) + "/")) fail("refusing to write outside docs/forsvn/experience/");
// Symlink guard. `existsSync` follows the link, so it returns false for a
// symlink whose target is missing — a broken (or attacker-planted, not-yet-
// created) symlink would slip past an `existsSync && isSymbolicLink` check.
// lstat the path directly and treat ENOENT (no file yet — the first-write case)
// as the only allowed "absent" outcome.
try {
  if (lstatSync(file).isSymbolicLink()) fail(`refusing to write through symlink: ${relative(ROOT, file)}`);
} catch (e) {
  if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
}

const entry = `\n## ${heading}\n**By:** ${by} · ${date}\n\n${body.trim()}\n`;

if (!existsSync(file)) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const titled = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  const header = `---
skill: ${by}
version: 1
date: ${date}
status: done
stack: ${stack}
type: experience
id: experience-${stack}-${name}
keywords: [experience, ${stack}, ${name}]
review_surface: none
summary: "Append-only ${name} learnings for the ${stack} stack — read before acting; do not re-ask what is recorded here"
use_when: "Starting ${stack} work — load this memory so you don't re-ask settled context or repeat a past mistake"
do_not_use_when: "As a source of truth (that is canonical/); this is accreted memory, newest entry per heading wins"
---

# ${titled} — ${stack} experience

Append-only memory — entries are never edited or removed. When a heading recurs, the newest entry (lowest in the file) is current; earlier ones are audit history.
`;
  writeFileSync(file, header + entry);
  console.log(`append-experience: created ${relative(ROOT, file)} + 1 entry`);
} else {
  // bump the frontmatter `date` to reflect the latest write (recency for staleness),
  // then append the entry. Only the date line in the frontmatter block is touched.
  const content = readFileSync(file, "utf8");
  const fm = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (fm && /^date:\s*/m.test(fm[2])) {
    const newBody = fm[2].replace(/^date:\s*.*$/m, `date: ${date}`);
    writeFileSync(file, fm[1] + newBody + fm[3] + content.slice(fm[0].length) + entry);
  } else {
    appendFileSync(file, entry);
  }
  console.log(`append-experience: appended 1 entry to ${relative(ROOT, file)}`);
}
console.log("Run `bun skills/bin/manifest-sync.ts` so the index picks it up.");
