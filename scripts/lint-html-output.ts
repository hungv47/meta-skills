#!/usr/bin/env bun
// lint-html-output — run the 10-check HTML output critic (see
// references/html-output-critic.md) against every HTML preview in the repo.
//
// Targets:
//   references/_html/exemplars/*.html
//   .forsvn/artifacts/*.html   (preview twins, not archived)
//
// Hard fails (exit 1) on checks 1, 2, 3, 4, 6, 7, 9.
// Soft fails (warn, exit 0 for those alone) on checks 5, 8, 10.
//
// Usage:
//   bun scripts/lint-html-output.ts            (lint cwd)
//   bun scripts/lint-html-output.ts --root /path

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = (() => {
  const idx = process.argv.indexOf("--root");
  if (idx > -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.cwd();
})();

// Allowlist = unified FORSVN stack + generic fallbacks. v1 per-stack families
// (Inter Tight, Fraunces, Sora, Newsreader, Plus Jakarta Sans, Manrope) are
// intentionally NOT in this set per acceptance gate § 8 #3.
const ALLOWED_FONT_FRAGMENTS = [
  "Bricolage Grotesque", "Be Vietnam Pro", "JetBrains Mono",
  "SF Mono", "ui-monospace",
  "system-ui", "-apple-system",
  "sans-serif", "serif", "monospace",
];
const FORBIDDEN_SCRIPT_LIBS = ["gsap", "motion-one", "animejs", "lottie", "popmotion"];
const MAX_INLINE_COLOR_PAIRS = 8;
const LOCALHOST_DONE_RE = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/done$/;
const LOCALHOST_FETCH_RE = /^(\/|https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/)/;

type Issue = { check: number; file: string; message: string; severity: "hard" | "soft" };
const issues: Issue[] = [];

const targets: string[] = [];
collectHtml(join(ROOT, "references/_html/exemplars"), targets);
collectHtml(join(ROOT, ".forsvn/artifacts"), targets, /\.archive\//);
// Canonical top-level roots — skills emit `review_surface: html` here too
// (brand identity of record, system architecture of record, ICP/market dossiers).
// Without these in the scan set, a `brand/BRAND.html` or
// `architecture/system-architecture.html` could ship without passing the
// 10-check rubric.
collectHtml(join(ROOT, "brand"), targets);
collectHtml(join(ROOT, "architecture"), targets);
collectHtml(join(ROOT, "research"), targets);

for (const abs of targets) {
  const rel = relative(ROOT, abs).split("\\").join("/");
  const html = readFileSync(abs, "utf8");
  lint(rel, html);
}

const hard = issues.filter((i) => i.severity === "hard");
const soft = issues.filter((i) => i.severity === "soft");

if (hard.length === 0 && soft.length === 0) {
  console.log(`[lint-html-output] OK — ${targets.length} file(s) clean.`);
  process.exit(0);
}

for (const i of issues) {
  const tag = i.severity === "hard" ? "FAIL" : "WARN";
  console[i.severity === "hard" ? "error" : "warn"](`  [${tag}] check #${i.check} · ${i.file} :: ${i.message}`);
}
console[hard.length > 0 ? "error" : "warn"](`\n[lint-html-output] ${hard.length} hard fail(s), ${soft.length} warning(s) across ${targets.length} file(s).`);
process.exit(hard.length > 0 ? 1 : 0);

// ---------------------------------------------------------------------------

function collectHtml(dir: string, out: string[], skipRe?: RegExp): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (skipRe && skipRe.test(abs)) continue;
    if (entry.isDirectory()) {
      collectHtml(abs, out, skipRe);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) out.push(abs);
  }
}

function lint(file: string, html: string): void {
  // Strip <pre>, <code>, <!-- ... -->, and <script type="application/json">
  // blocks before the check #6 regexes so a documentation example or JSON
  // string containing the literal text "<form" doesn't false-positive. The
  // other checks (1-5, 7-10) still operate on the full source.
  const html6 = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, "")
    .replace(/<code\b[\s\S]*?<\/code>/gi, "")
    .replace(/<script type="application\/json"[\s\S]*?<\/script>/gi, "");

  // Check 1 — Five-region layout
  for (const sel of ['class="topbar"', 'class="left-controls"', 'class="stage"', 'class="footer"', 'id="artifact-data"']) {
    if (!html.includes(sel)) issues.push({ check: 1, file, message: `missing required region (${sel})`, severity: "hard" });
  }

  // Check 2 — data-stack
  const stackMatch = html.match(/<html[^>]*\bdata-stack="(air|water|fire|earth)"/);
  if (!stackMatch) {
    issues.push({ check: 2, file, message: `<html> missing data-stack="air|water|fire|earth"`, severity: "hard" });
  }
  const stack = stackMatch?.[1];

  // Check 3 — decision pill matches frontmatter mirror
  const pillMatch = html.match(/<span class="decision-pill" data-state="(pending|approved|denied|suggested)"/);
  const artifactData = readJsonScript(html, "artifact-data");
  if (artifactData.parseError) {
    issues.push({ check: 1, file, message: `#artifact-data is not valid JSON`, severity: "hard" });
  }
  const fmDecisionState = typeof artifactData.parsed?.decision_state === "string"
    ? (artifactData.parsed.decision_state as string)
    : undefined;
  if (!pillMatch && fmDecisionState && fmDecisionState !== "not_required") {
    issues.push({ check: 3, file, message: `decision-pill missing while frontmatter decision_state=${fmDecisionState}`, severity: "hard" });
  } else if (pillMatch && fmDecisionState && pillMatch[1] !== fmDecisionState) {
    issues.push({ check: 3, file, message: `decision-pill data-state=${pillMatch[1]} != frontmatter decision_state=${fmDecisionState}`, severity: "hard" });
  }

  // Check 4 — Roughdraft deeplink in footer
  const footer = html.match(/<footer class="footer">([\s\S]*?)<\/footer>/);
  if (!footer) {
    issues.push({ check: 4, file, message: `<footer class="footer"> not found`, severity: "hard" });
  } else if (!/href="roughdraft:\/\/open\?path=/.test(footer[1])) {
    issues.push({ check: 4, file, message: `roughdraft:// deeplink missing from footer`, severity: "hard" });
  }

  // Check 5 — WCAG AA. Lint does a coarse check: per-stack chrome + bg/fg combos
  // are pre-verified by the design spec; here we just flag any inline override that
  // *might* break contrast. Hard analysis lives in the design-spec WCAG table.
  // Soft fail when the file uses inline `color:` against `background:` raw hex pairs.
  const colorAgainstBg = [...html.matchAll(/style="[^"]*color:\s*(#[0-9a-fA-F]{3,6})[^"]*background[^:]*:\s*(#[0-9a-fA-F]{3,6})/g)];
  if (colorAgainstBg.length > MAX_INLINE_COLOR_PAIRS) {
    issues.push({ check: 5, file, message: `${colorAgainstBg.length} inline color/background pairs — review for AA contrast manually`, severity: "soft" });
  }

  // Check 6 — Decision capture allowed only via the documented forsvn preview
  // localhost contract (v2): <form id="decision-capture"> with action that's
  // a javascript: noop or /done, plus a #preview-config script block. Any
  // other <form>, onclick, fetch, XHR, or WebSocket = hard fail. Operates on
  // html6 (with <pre>/<code>/comments/JSON-script blocks stripped) so doc
  // examples and JSON strings don't false-positive.
  const forms = [...html6.matchAll(/<form\b([^>]*)>/gi)];
  let decisionCaptureCount = 0;
  for (const m of forms) {
    const attrs = m[1];
    const idMatch = attrs.match(/\bid\s*=\s*"([^"]+)"/i);
    if (!idMatch || idMatch[1] !== "decision-capture") {
      issues.push({ check: 6, file, message: `<form> with id=${JSON.stringify(idMatch?.[1] ?? "<none>")} — only id="decision-capture" is allowed`, severity: "hard" });
      continue;
    }
    decisionCaptureCount++;
    const actionMatch = attrs.match(/\baction\s*=\s*"([^"]+)"/i);
    if (actionMatch) {
      const action = actionMatch[1].trim();
      const allowed = action === "javascript:void(0)" || action === "#" || /^\/done$/.test(action) || LOCALHOST_DONE_RE.test(action);
      if (!allowed) {
        issues.push({ check: 6, file, message: `<form id="decision-capture"> action ${JSON.stringify(action)} not allowed (must be javascript:void(0) or /done on localhost)`, severity: "hard" });
      }
    }
    // The form must coexist with a #preview-config block — chrome.js needs it
    // to know whether to activate the form.
    if (!/<script type="application\/json" id="preview-config">/.test(html)) {
      issues.push({ check: 6, file, message: `<form id="decision-capture"> present but no <script id="preview-config"> block`, severity: "hard" });
    }
  }
  if (decisionCaptureCount > 1) {
    issues.push({ check: 6, file, message: `multiple <form id="decision-capture"> elements (${decisionCaptureCount}) — only one allowed per page`, severity: "hard" });
  }
  // Static (emitter-time) preview-config must declare {"static":true}. The
  // forsvn-preview CLI overwrites the placeholder at serve time; a checked-in
  // HTML with any other config (e.g. {"endpoint":"https://attacker/done"})
  // would activate chrome.js's decision-capture against a remote target.
  const previewCfg = readJsonScript(html, "preview-config");
  if (previewCfg.parseError) {
    issues.push({ check: 6, file, message: `<script id="preview-config"> is not valid JSON`, severity: "hard" });
  } else if (previewCfg.parsed && (previewCfg.parsed as { static?: unknown }).static !== true) {
    issues.push({ check: 6, file, message: `static <script id="preview-config"> must declare {"static":true}; the CLI rewrites this at serve time`, severity: "hard" });
  }
  // No inline onclick attributes anywhere (chrome.js binds via data-* hooks).
  if (/\bonclick\s*=/i.test(html6)) {
    issues.push({ check: 6, file, message: `inline onclick handler present (use chrome.js data-* bindings)`, severity: "hard" });
  }
  // Any fetch / XHR / WebSocket targeting anything other than 127.0.0.1 or
  // localhost = hard fail. The decision-capture form sends to a config-driven
  // endpoint at runtime; static HTML must not name a remote target.
  const fetchTargets = [...html6.matchAll(/\bfetch\s*\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  for (const target of fetchTargets) {
    if (!LOCALHOST_FETCH_RE.test(target)) {
      issues.push({ check: 6, file, message: `fetch() target ${JSON.stringify(target)} is not localhost/relative`, severity: "hard" });
    }
  }
  if (/\bXMLHttpRequest\b/.test(html)) {
    issues.push({ check: 6, file, message: `XMLHttpRequest reference present (use fetch() to /done only)`, severity: "hard" });
  }
  if (/\bnew\s+WebSocket\b/.test(html)) {
    issues.push({ check: 6, file, message: `WebSocket reference present (HTML preview must be HTTP-only)`, severity: "hard" });
  }

  // Check 7 — Tokens.css imported; no chrome-token overrides
  if (!/<link[^>]*href="[^"]*tokens\.css"/.test(html)) {
    issues.push({ check: 7, file, message: `tokens.css not linked`, severity: "hard" });
  }
  for (const tok of ["--chrome-bg", "--chrome-panel", "--chrome-border", "--chrome-text"]) {
    const overrideRe = new RegExp(`<style[^>]*>[\\s\\S]*?:root[^{]*\\{[\\s\\S]*?${tok.replace(/--/g, "\\-\\-")}\\s*:`);
    if (overrideRe.test(html)) {
      issues.push({ check: 7, file, message: `chrome token ${tok} overridden in inline <style>`, severity: "hard" });
    }
  }

  // Check 8 — Stage typography uses element fonts
  if (stack) {
    const fontFamilyDecls = [...html.matchAll(/font-family\s*:\s*([^;\n}]+)/g)].map((m) => m[1]);
    for (const decl of fontFamilyDecls) {
      const sample = decl.replace(/['"]/g, "").trim();
      if (sample.length === 0) continue;
      if (sample.startsWith("var(")) continue;
      const usesAllowed = ALLOWED_FONT_FRAGMENTS.some((frag) => sample.includes(frag));
      if (!usesAllowed) {
        issues.push({ check: 8, file, message: `font-family ${JSON.stringify(sample)} not allowed for stack=${stack}`, severity: "soft" });
      }
    }
  }

  // Check 9 — Motion is CSS only
  for (const lib of FORBIDDEN_SCRIPT_LIBS) {
    const re = new RegExp(`<script[^>]*src="[^"]*${lib}`, "i");
    if (re.test(html)) {
      issues.push({ check: 9, file, message: `forbidden script library "${lib}" loaded`, severity: "hard" });
    }
  }

  // Check 10 — <title> pattern
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  if (!titleMatch) {
    issues.push({ check: 10, file, message: `<title> tag missing`, severity: "soft" });
  } else if (!/.+ · [a-z][a-z0-9-]* · \d{4}-\d{2}-\d{2}\s*$/.test(titleMatch[1])) {
    issues.push({ check: 10, file, message: `<title> ${JSON.stringify(titleMatch[1])} does not match "<artifact-title> · <skill> · <date>" pattern`, severity: "soft" });
  }
}

// Read a <script type="application/json" id="..."> block from HTML and parse
// its JSON body. Returns `{parsed}` on success, `{parseError: true}` if the
// tag exists but JSON.parse threw, `{}` if the tag is absent.
function readJsonScript(html: string, id: string): { parsed?: unknown; parseError?: boolean } {
  const re = new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`);
  const m = html.match(re);
  if (!m) return {};
  try { return { parsed: JSON.parse(m[1]) }; }
  catch { return { parseError: true }; }
}
