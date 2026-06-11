#!/usr/bin/env bun
// test-render-fidelity — unit coverage for the markdown→HTML renderer's frozen
// construct set (U1). Asserts the constructs the real artifact corpus uses
// render correctly, that the XSS hardening holds for both links and images, and
// that every `.forsvn/artifacts/**` file renders with heading-count parity.
//
// Frozen construct set (anything outside is intentionally out of scope — see
// lib/render.ts): headings, paragraphs, nested lists, task lists, fenced/inline
// code, bold/italic, safe links, images (safeSrc), tables, multi-paragraph
// blockquotes, hr. Reference links, autolinks, multi-paragraph list items, and
// raw HTML passthrough are OUT — raw HTML must stay escaped, not rendered.
//
// Usage: bun test/test-render-fidelity.ts   (exits 0 on pass, 1 on fail)

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownToHtml, parseFrontmatter } from "../lib/render";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..", "..");
const ARTIFACTS = join(REPO_ROOT, ".forsvn", "artifacts");

const results: { name: string; ok: boolean; message?: string }[] = [];

function check(name: string, fn: () => void): void {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, message: e instanceof Error ? e.message : String(e) });
  }
}

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}
function contains(haystack: string, needle: string, label: string): void {
  assert(haystack.includes(needle), `${label}: expected to contain ${JSON.stringify(needle)}\n  in: ${haystack}`);
}
function absent(haystack: string, needle: string, label: string): void {
  assert(!haystack.includes(needle), `${label}: expected NOT to contain ${JSON.stringify(needle)}\n  in: ${haystack}`);
}

// --- nested lists -----------------------------------------------------------
check("nested unordered list nests <ul> inside the parent <li>", () => {
  const html = markdownToHtml("- a\n  - a1\n  - a2\n- b");
  // a contains a nested list with a1/a2; b is a sibling of a
  contains(html, "<ul><li>a<ul><li>a1</li><li>a2</li></ul></li><li>b</li></ul>", "nested ul");
});

check("ordered nested under unordered preserves both list types", () => {
  const html = markdownToHtml("- top\n  1. one\n  2. two");
  contains(html, "<ul><li>top<ol><li>one</li><li>two</li></ol></li></ul>", "mixed nest");
});

check("task list items carry class=\"task\" + disabled checkbox state", () => {
  const html = markdownToHtml("- [ ] todo\n- [x] done");
  contains(html, '<li class="task"><input type="checkbox" disabled> todo</li>', "unchecked task");
  contains(html, '<li class="task"><input type="checkbox" disabled checked> done</li>', "checked task");
});

// --- images + link/image XSS hardening --------------------------------------
check("image renders <img> with alt and a relative src", () => {
  const html = markdownToHtml("![a cat](./cat.png)");
  contains(html, '<img src="./cat.png" alt="a cat">', "img tag");
});

check("image with javascript: src is neutralized to #", () => {
  const html = markdownToHtml("![x](javascript:alert(1))");
  contains(html, '<img src="#" alt="x">', "img js scheme");
  absent(html, "javascript:", "img js scheme stripped");
});

check("image with data:/vbscript: src is neutralized to #", () => {
  contains(markdownToHtml("![x](data:text/html,<script>1</script>)"), 'src="#"', "img data scheme");
  contains(markdownToHtml("![x](vbscript:msgbox)"), 'src="#"', "img vbscript scheme");
});

check("external http(s)/protocol-relative image src is rejected (beacon channel)", () => {
  contains(markdownToHtml("![x](https://attacker.example/pixel?id=1)"), 'src="#"', "img https beacon");
  contains(markdownToHtml("![x](http://attacker.example/p)"), 'src="#"', "img http beacon");
  contains(markdownToHtml("![x](//attacker.example/p)"), 'src="#"', "img protocol-relative beacon");
});

check("backslash variants of protocol-relative srcs are rejected too", () => {
  // browsers parse \ as / in special schemes — \\host\p and /\host/p are
  // protocol-relative; \\host\share is a UNC fetch from a file:// base on Windows
  contains(markdownToHtml("![x](\\\\evil.example\\p)"), 'src="#"', "img UNC backslash beacon");
  contains(markdownToHtml("![x](/\\evil.example/p)"), 'src="#"', "img slash-backslash beacon");
  contains(markdownToHtml("![x](\\/evil.example/p)"), 'src="#"', "img backslash-slash beacon");
});

check("link with javascript: href stays neutralized (regression)", () => {
  const html = markdownToHtml("[click](javascript:alert(1))");
  contains(html, '<a href="#">click</a>', "link js scheme");
  absent(html, "javascript:", "link js scheme stripped");
});

check("control chars cannot smuggle a scheme past the strip (java\\tscript:)", () => {
  const html = markdownToHtml("[x](java\tscript:alert(1))");
  contains(html, 'href="#"', "tab-split scheme");
});

check("image/link syntax inside a code span stays literal text", () => {
  const html = markdownToHtml("use `![alt](src.png)` and `[txt](url)` literally");
  absent(html, "<img", "no img inside code span");
  contains(html, "<code>![alt](src.png)</code>", "image literal in code");
  contains(html, "<code>[txt](url)</code>", "link literal in code");
});

// --- raw HTML passthrough is OUT (must stay escaped) -------------------------
check("raw <script> in body is escaped, never emitted as a live tag", () => {
  const html = markdownToHtml("a <script>alert(1)</script> b");
  absent(html, "<script>", "no live script tag");
  contains(html, "&lt;script&gt;", "script escaped");
});

check("raw <iframe> in body is escaped", () => {
  absent(markdownToHtml("<iframe src=evil>"), "<iframe", "no live iframe");
});

// --- multi-paragraph blockquote ---------------------------------------------
check("blockquote with a blank `>` line produces two <p> paragraphs", () => {
  const html = markdownToHtml("> first para\n>\n> second para");
  contains(html, "<blockquote><p>first para</p><p>second para</p></blockquote>", "multi-para bq");
});

// --- still-supported constructs (no regression) -----------------------------
check("headings, inline code, bold, table still render", () => {
  contains(markdownToHtml("# Title"), "<h1>Title</h1>", "h1");
  contains(markdownToHtml("`code`"), "<code>code</code>", "inline code");
  contains(markdownToHtml("**b**"), "<strong>b</strong>", "bold");
  const t = markdownToHtml("| a | b |\n|---|---|\n| 1 | 2 |");
  contains(t, "<table>", "table");
  contains(t, "<th>a</th>", "table header");
  contains(t, "<td>1</td>", "table cell");
});

// --- corpus pass: every artifact renders with heading-count parity ----------
function walkMd(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue; // skip .archive etc.
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkMd(p));
    else if (entry.endsWith(".md")) out.push(p);
  }
  return out;
}

// Count source heading lines, skipping fenced code blocks — a `# comment` inside
// a bash fence is code, not a heading, and the renderer correctly leaves it in <pre>.
function countSourceHeadings(body: string): number {
  let inFence = false;
  let n = 0;
  for (const line of body.split("\n")) {
    if (/^ {0,3}(`{3,}|~{3,})/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^#{1,6}\s+\S/.test(line)) n++;
  }
  return n;
}

// The corpus lives only in the monorepo — `.forsvn/` never publishes to the
// meta-skills mirror, so OSS consumers skip this check (the scenarios above
// are self-contained and always run).
if (!existsSync(ARTIFACTS)) {
  console.log(`  - corpus check skipped — no artifact corpus at ${ARTIFACTS} (public mirror)`);
} else {
  check("corpus: every .forsvn/artifacts/**.md renders with heading parity + no live tags", () => {
    const files = walkMd(ARTIFACTS);
    assert(files.length > 0, `expected artifact corpus under ${ARTIFACTS}`);
    for (const f of files) {
      const { body } = parseFrontmatter(readFileSync(f, "utf8"));
      const html = markdownToHtml(body);
      assert(html.length > 0, `${f}: empty render`);
      // heading-count parity: every `#…` heading line surfaces as an <h*> tag.
      const srcHeadings = countSourceHeadings(body);
      const outHeadings = (html.match(/<h[1-6]>/g) || []).length;
      assert(
        outHeadings >= srcHeadings,
        `${f}: heading parity — ${srcHeadings} source headings, ${outHeadings} rendered`,
      );
      // no body construct produced a live script/iframe tag
      absent(html.toLowerCase(), "<script", `${f}: live script tag leaked`);
      absent(html.toLowerCase(), "<iframe", `${f}: live iframe tag leaked`);
    }
  });
}

// =========================================================================
for (const r of results) console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}${r.message ? ` — ${r.message}` : ""}`);
const failed = results.filter((r) => !r.ok);
if (failed.length === 0) {
  console.log(`[test-render-fidelity] PASS — ${results.length} scenarios`);
  process.exit(0);
}
console.error(`[test-render-fidelity] FAIL — ${failed.length}/${results.length} scenarios failed`);
process.exit(1);
