// render — turn a standard Markdown artifact into a review-surface HTML twin.
//
// This is the real implementation of what SKILL.md files used to call the
// (never-implemented) `renderReviewSurface(...)`. Skills now emit plain
// Markdown; this renderer reads the artifact's frontmatter + body and fills
// `assets/_html/base.html`, themed by `stack`, with the decision-capture form.
//
// Pure + dependency-free: a compact Markdown subset renderer (headings,
// paragraphs, lists, task lists, fenced/inline code, bold/italic, links,
// tables, blockquotes, hr) is enough for a readable review preview. The MD
// remains the source of truth.

import { readFileSync, writeFileSync } from "node:fs";
import { join, basename, dirname } from "node:path";

const STACK_TO_ELEMENT: Record<string, "air" | "water" | "fire" | "earth"> = {
  meta: "air",
  marketing: "water",
  mkt: "water", // legacy alias — retired stack value; current artifacts use `marketing`
  product: "fire",
  research: "earth",
};

export type Frontmatter = Record<string, string>;

export function parseFrontmatter(src: string): { fm: Frontmatter; body: string } {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: src };
  const fm: Frontmatter = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, "");
  }
  return { fm, body: m[2] };
}

function esc(s: string): string {
  // Escapes quotes too, so an escaped value is safe in an HTML attribute as
  // well as in text — renderArtifactToHtml is exported and a future template
  // could bind a frontmatter value into an attribute.
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Embedding JSON inside <script type="application/json"> is safe except for a
// literal `</script` close-tag, which the HTML parser honors regardless of the
// script type. Escape it so frontmatter values can't break out of the block.
function escapeForScript(json: string): string {
  return json.replace(/<\/script/gi, "<\\/script");
}

// Only allow safe link schemes; neuter javascript:/data:/vbscript: and
// attribute-escape quotes so a crafted href can't break out of href="...".
function safeHref(href: string): string {
  // Strip control/whitespace chars first — browsers ignore them before scheme
  // parsing, so `java\tscript:` would otherwise slip past the scheme test.
  const h = href.trim().replace(/[\x00-\x20]/g, "");
  if (/^(?:javascript|data|vbscript):/i.test(h)) return "#";
  return h.replace(/"/g, "&quot;");
}

// Control-char-strip (as safeHref), then LOCAL-ONLY for image `src`: any
// scheme (http(s) included) or protocol-relative src is neutered to "#".
// Unlike links — which navigate only on a deliberate click — an <img> src
// loads the moment the review opens, so an external src is a beacon channel
// ("artifact X reviewed, from this IP, now") and v0 is local-first/no-telemetry.
// Artifact images are relative repo paths. base.html's CSP (img-src 'self'
// data:) is the document-level belt for the same rule.
function safeSrc(src: string): string {
  const s = src.trim().replace(/[\x00-\x20]/g, "");
  // [/\\]{2}: browsers parse backslashes as forward slashes in special URL
  // schemes, so \\host\p and /\host/p are protocol-relative too — reject any
  // two leading slash-or-backslash chars, not just "//".
  if (/^(?:[a-z][a-z0-9+.-]*:|[/\\]{2})/i.test(s)) return "#";
  return s.replace(/"/g, "&quot;");
}

function inline(s: string): string {
  // order matters: escape first, then re-introduce safe inline markup
  let t = esc(s).replace(/\u0000/g, "");
  // Protect code spans behind NUL-delimited placeholder tokens (NULs are
  // stripped from the input above, so a token can't collide with content) so
  // the bold/em/image/link rules never rewrite literal markup inside <code> —
  // `![x](y)` in a code span stays literal text instead of a live <img>.
  const spans: string[] = [];
  t = t.replace(/`([^`]+)`/g, (_m, c) => {
    spans.push(`<code>${c}</code>`);
    return `\u0000${spans.length - 1}\u0000`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // images BEFORE links: `![alt](src)` contains a `[..](..)` the link rule
  // would otherwise half-match, leaving a stray `!`. alt is already escaped by
  // the leading esc(); src goes through safeSrc.
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => `<img src="${safeSrc(src)}" alt="${alt}">`);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, txt, href) => `<a href="${safeHref(href)}">${txt}</a>`);
  return t.replace(/\u0000(\d+)\u0000/g, (_m, i) => spans[Number(i)]);
}

// Compact block-level Markdown → HTML.
export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // fenced code
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++; // closing fence
      out.push(`<pre class="code"><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
      i++;
      continue;
    }

    // hr
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }

    // blockquote (multi-paragraph: a bare `>` line separates paragraphs)
    if (/^>/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      const paras = buf
        .join("\n")
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\n/g, " ").trim())
        .filter(Boolean);
      out.push(`<blockquote>${paras.map((p) => `<p>${inline(p)}</p>`).join("")}</blockquote>`);
      continue;
    }

    // table (pipe rows with a separator line)
    if (/^\|.*\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|/.test(lines[i + 1])) {
      const headerCells = splitRow(line);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|/.test(lines[i])) rows.push(splitRow(lines[i++]));
      const thead = `<tr>${headerCells.map((c) => `<th>${inline(c)}</th>`).join("")}</tr>`;
      const tbody = rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("");
      out.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    // lists (task / unordered / ordered) — indent-aware nesting
    if (/^\s*(?:[-*]|\d+\.)\s+/.test(line)) {
      const items: ListItem[] = [];
      while (i < lines.length && /^\s*(?:[-*]|\d+\.)\s+/.test(lines[i])) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/)!;
        const indent = m[1].replace(/\t/g, "  ").length;
        const ordered = /\d+\./.test(m[2]);
        const task = m[3].match(/^\[([ xX])\]\s+(.*)$/);
        const html = task
          ? `<input type="checkbox" disabled${task[1].toLowerCase() === "x" ? " checked" : ""}> ${inline(task[2])}`
          : inline(m[3]);
        items.push({ indent, ordered, task: !!task, html });
        i++;
      }
      out.push(renderList(items));
      continue;
    }

    // blank
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // paragraph (gather until blank or block start)
    const buf: string[] = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|```|>|\||\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) {
      buf.push(lines[i++]);
    }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

function splitRow(line: string): string[] {
  return line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

type ListItem = { indent: number; ordered: boolean; task: boolean; html: string };

// Build (possibly nested) <ul>/<ol> from flat items using an indent stack.
// A deeper-indented item nests inside the current <li> (the <li> is left open
// when we descend); a shallower item closes lists back down to its level.
// Known limit (frozen-set scope): mixed ordered/unordered markers at the *same*
// indent inherit the already-open list type rather than switching mid-list.
function renderList(items: ListItem[]): string {
  let out = "";
  const stack: { ordered: boolean; indent: number }[] = [];
  for (const it of items) {
    while (stack.length && it.indent < stack[stack.length - 1].indent) {
      out += `</li></${stack.pop()!.ordered ? "ol" : "ul"}>`;
    }
    if (!stack.length || it.indent > stack[stack.length - 1].indent) {
      out += `<${it.ordered ? "ol" : "ul"}>`;
      stack.push({ ordered: it.ordered, indent: it.indent });
    } else {
      out += "</li>";
    }
    out += `<li${it.task ? ' class="task"' : ""}>${it.html}`;
  }
  while (stack.length) out += `</li></${stack.pop()!.ordered ? "ol" : "ul"}>`;
  return out;
}

export type RenderResult = { html: string; htmlPath: string; element: string };

// Read a Markdown artifact and render its HTML twin from base.html.
// `assetsDir` is the plugin's assets/_html directory (holds base.html).
export function renderArtifactToHtml(mdPath: string, assetsDir: string, repoRelMdPath?: string): RenderResult {
  const src = readFileSync(mdPath, "utf8");
  const { fm, body } = parseFrontmatter(src);

  const stack = (fm.stack || "meta").toLowerCase();
  const element = STACK_TO_ELEMENT[stack] || "air";
  const fileSlug = basename(mdPath).replace(/\.md$/, "");
  const h1 = body.match(/^#\s+(.+)$/m);
  const title = fm.title || (h1 ? h1[1].trim() : fileSlug);
  const slug = fm.slug || fileSlug.split("-").slice(3).join("-") || fileSlug;
  const decisionState = fm.decision_state || "not_required";
  const mdRel = repoRelMdPath || basename(mdPath);

  const base = readFileSync(join(assetsDir, "base.html"), "utf8");
  const stageHtml = `<article class="md-stage">\n${markdownToHtml(body)}\n</article>`;
  const leftControls = `<div class="control-group">\n  <h2>Export</h2>\n  <button type="button" data-copy-source="artifact-data">Copy as JSON</button>\n</div>`;

  const repl: Record<string, string> = {
    stack: element,
    title: esc(title),
    skill: esc(fm.skill || ""),
    date: esc(fm.date || ""),
    slug: esc(slug),
    decision_state: esc(decisionState),
    tokens_css_href: "./tokens.css",
    chrome_css_href: "./chrome.css",
    chrome_js_src: "./chrome.js",
    md_path: encodeURIComponent(mdRel),
    artifact_data_json: escapeForScript(JSON.stringify(fm)),
    preview_config_json: escapeForScript(JSON.stringify({ static: true })),
    left_controls_html: leftControls,
    stage_html: stageHtml,
  };

  const html = base.replace(/\{\{(\w+)\}\}/g, (_m, key) => (key in repl ? repl[key] : ""));
  const htmlPath = mdPath.replace(/\.md$/, ".html");
  writeFileSync(htmlPath, html);
  return { html, htmlPath, element };
}
