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
import { join, relative, basename } from "node:path";

const ROOT_ARG = (() => {
  const idx = process.argv.indexOf("--root");
  if (idx > -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.cwd();
})();
const ROOT = ROOT_ARG;

const VALID_STACKS = ["air", "water", "fire", "earth"];
const VALID_STATES = ["pending", "approved", "denied", "suggested", "not_required"];
// Allowed stage-font name fragments per stack (chrome fonts — Inter, JetBrains Mono — are always allowed).
const STACK_FONT_FRAGMENTS: Record<string, string[]> = {
  air:   ["Inter Tight", "Inter", "JetBrains Mono", "system-ui", "monospace", "sans-serif", "-apple-system"],
  water: ["Fraunces", "Plus Jakarta Sans", "Inter", "JetBrains Mono", "Times New Roman", "serif", "sans-serif", "monospace"],
  fire:  ["Sora", "Manrope", "Inter", "JetBrains Mono", "sans-serif", "monospace"],
  earth: ["Newsreader", "EB Garamond", "Times New Roman", "Inter", "JetBrains Mono", "serif", "sans-serif", "monospace"],
};
const FORBIDDEN_SCRIPT_LIBS = ["gsap", "motion-one", "animejs", "lottie", "popmotion"];

type Issue = { check: number; file: string; message: string; severity: "hard" | "soft" };
const issues: Issue[] = [];

const targets: string[] = [];
collectHtml(join(ROOT, "references/_html/exemplars"), targets);
collectHtml(join(ROOT, ".forsvn/artifacts"), targets, /\.archive\//);

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
  const jsonMatch = html.match(/<script type="application\/json" id="artifact-data">([\s\S]*?)<\/script>/);
  let fmDecisionState: string | undefined;
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      fmDecisionState = typeof data.decision_state === "string" ? data.decision_state : undefined;
    } catch {
      issues.push({ check: 1, file, message: `#artifact-data is not valid JSON`, severity: "hard" });
    }
  }
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
  if (colorAgainstBg.length > 8) {
    issues.push({ check: 5, file, message: `${colorAgainstBg.length} inline color/background pairs — review for AA contrast manually`, severity: "soft" });
  }

  // Check 6 — No decision capture
  if (/<form\b/i.test(html)) {
    issues.push({ check: 6, file, message: `<form> element present (HTML preview must be read-only)`, severity: "hard" });
  }
  if (/\bonclick\s*=/i.test(html)) {
    issues.push({ check: 6, file, message: `inline onclick handler present (use chrome.js data-* bindings)`, severity: "hard" });
  }
  if (/\bfetch\s*\(/.test(html) || /\bXMLHttpRequest\b/.test(html) || /\bnew\s+WebSocket\b/.test(html)) {
    issues.push({ check: 6, file, message: `network calls present (HTML preview must be static)`, severity: "hard" });
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
    const allowed = STACK_FONT_FRAGMENTS[stack];
    const fontFamilyDecls = [...html.matchAll(/font-family\s*:\s*([^;\n}]+)/g)].map((m) => m[1]);
    for (const decl of fontFamilyDecls) {
      const sample = decl.replace(/['"]/g, "").trim();
      if (sample.length === 0) continue;
      if (sample.startsWith("var(")) continue;
      const usesAllowed = allowed.some((frag) => sample.includes(frag));
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
