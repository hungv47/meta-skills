// md-term — the terminal Markdown renderer behind `forsvn-preview <artifact.md> --md`.
//
// The legibility fix for the raw-spew problem: viewing an artifact in the
// terminal used to mean raw Markdown — a 20-line YAML frontmatter wall,
// unwrapped 300-char lines, raw pipe-tables. This renders the same source as
// a calm, readable transcript instead:
//
//   - frontmatter folded into a compact header block (never raw YAML)
//   - headings shaped by level (H1 underline, H2 frame cap, H3+ emphasis)
//   - paragraphs wrapped at a sane reading measure
//   - lists indented properly, wrapped continuations aligned under the text
//   - fenced code visually fenced (gutter bar), never re-wrapped
//   - tables column-aligned when they fit, gracefully linearized when not
//
// Honors the mono.ts contract: explicit tier, returns strings, never prints.
// Tier 3 (piped / NO_COLOR / dumb) is plain ASCII but still LEGIBLE — all the
// structure above comes from indentation and spacing, not color. Styling is
// applied per whole line only (never inside wrapped spans), so tier-3 output
// carries zero escape bytes by construction.
//
// Pure + dependency-free, like lib/render.ts (which owns the HTML twin; this
// module owns the terminal twin — the two renderers deliberately share the
// same compact Markdown subset).

import { dim, bold, frameCap, dividerLine, decisionBadge, hintLine, DECISION_STATES, type DecisionState, type Tier } from "./mono";
import { parseFrontmatter } from "./render";

const DECISION_ENUM = new Set<string>(DECISION_STATES);

export type MdTermOpts = {
  width?: number;     // terminal columns (default 80)
};

// The reading measure: never wider than 80ch even on a wide terminal, never
// wider than the terminal itself minus a small safety margin.
function measureOf(width: number): number {
  return Math.max(40, Math.min(width - 2, 80));
}

export function renderMarkdownTerm(source: string, tier: Tier, opts: MdTermOpts = {}): string {
  const width = opts.width ?? 80;
  const measure = measureOf(width);
  const { fm, body } = parseFrontmatter(source);
  const out: string[] = [];

  const header = headerBlock(fm, tier, measure);
  if (header.length > 0) {
    out.push(...header, "");
  }
  out.push(...renderBlocks(body, tier, measure));

  // Collapse runs of blank lines and trailing whitespace into the §4.3 rhythm
  // (group gap = exactly one blank line).
  const collapsed: string[] = [];
  for (const line of out) {
    if (line === "" && collapsed[collapsed.length - 1] === "") continue;
    collapsed.push(line);
  }
  while (collapsed[0] === "") collapsed.shift();
  while (collapsed[collapsed.length - 1] === "") collapsed.pop();
  return collapsed.join("\n");
}

// --- Frontmatter → compact header block -------------------------------------------
// `── skill · date · id ───────` + state/meta line + quoted summary + fold count.
// Raw YAML never reaches the terminal.

function headerBlock(fm: Record<string, string>, tier: Tier, measure: number): string[] {
  const keys = Object.keys(fm);
  if (keys.length === 0) return [];
  const lines: string[] = [];

  const capLabel = [fm.skill, fm.date, fm.id].filter(Boolean).join(" · ") || "artifact";
  lines.push(frameCap(capLabel, measure, tier));

  const metaBits = [fm.stack, fm.type, fm.status, fm.review_surface ? `review: ${fm.review_surface}` : ""].filter(Boolean).join(" · ");
  const state = fm.decision_state && DECISION_ENUM.has(fm.decision_state) ? (fm.decision_state as DecisionState) : null;
  if (state || metaBits) {
    const badge = state ? decisionBadge(state, tier) : "";
    const sep = state && metaBits ? "   " : "";
    lines.push(`  ${badge}${sep}${dim(metaBits, tier)}`);
  }

  const summary = (fm.summary ?? "").replace(/\s+/g, " ").trim();
  if (summary) {
    for (const l of wrap(`"${summary}"`, measure - 2)) lines.push(`  ${dim(l, tier)}`);
  }

  lines.push(hintLine(`frontmatter: ${keys.length} fields folded — open the raw file for full metadata`, tier));
  return lines;
}

// --- Block renderer ------------------------------------------------------------------

function renderBlocks(md: string, tier: Tier, measure: number): string[] {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // fenced code — gutter-barred, never re-wrapped
    const fence = line.match(/^```(\S*)/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++; // closing fence
      out.push("");
      const gutter = tier === 2 ? dim("│", tier) : "|";
      if (fence[1]) out.push(`  ${gutter} ${dim(fence[1], tier)}`);
      for (const code of buf) out.push(`  ${gutter} ${code}`);
      out.push("");
      continue;
    }

    // heading — H1 underlined, H2 frame-capped, H3+ emphasized
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const text = inlineClean(h[2]);
      out.push("");
      if (lvl === 1) {
        out.push(bold(text, tier));
        const bar = tier === 2 ? "─" : "=";
        out.push(dim(bar.repeat(Math.min(text.length, measure)), tier));
      } else if (lvl === 2) {
        out.push(frameCap(text, measure, tier));
      } else {
        // H3+ keeps its hash depth at tier 3 (honest, still scannable);
        // tier 2 emphasizes instead.
        out.push(tier === 2 ? bold(text, tier) : `${"#".repeat(lvl)} ${text}`);
      }
      out.push("");
      i++;
      continue;
    }

    // hr
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push("", dividerLine(measure, tier), "");
      i++;
      continue;
    }

    // blockquote
    if (/^>/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push("");
      const paras = buf.join("\n").split(/\n\s*\n/).map((p) => p.replace(/\n/g, " ").trim()).filter(Boolean);
      for (const p of paras) {
        for (const l of wrap(inlineClean(p), measure - 4)) out.push(`  ${dim(`> ${l}`, tier)}`);
      }
      out.push("");
      continue;
    }

    // table (pipe rows with a separator line)
    if (/^\|.*\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const header = splitRow(line).map(inlineClean);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|/.test(lines[i])) rows.push(splitRow(lines[i++]).map(inlineClean));
      out.push("", ...renderTable(header, rows, tier, measure), "");
      continue;
    }

    // lists (task / unordered / ordered) — wrapped continuations aligned
    if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
      out.push("");
      while (i < lines.length && /^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i])) {
        const m = lines[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/)!;
        const depth = Math.floor(m[1].replace(/\t/g, "  ").length / 2);
        const indent = "  ".repeat(1 + depth);
        const ordered = /\d+\./.test(m[2]);
        const task = m[3].match(/^\[([ xX])\]\s+(.*)$/);
        let text = m[3];
        let marker = ordered ? m[2] : tier === 2 ? "•" : "-";
        if (task) {
          marker = task[1].toLowerCase() === "x" ? "[x]" : "[ ]";
          text = task[2];
        }
        i++;
        // Lazy continuation lines (indented non-marker text) belong to the item.
        while (
          i < lines.length &&
          !/^\s*$/.test(lines[i]) &&
          !/^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i]) &&
          !/^(#{1,6}\s|```|>|\|)/.test(lines[i])
        ) {
          text += ` ${lines[i++].trim()}`;
        }
        const lead = `${indent}${marker} `;
        const cont = " ".repeat(lead.length);
        const wrapped = wrap(inlineClean(text), Math.max(20, measure - lead.length));
        wrapped.forEach((l, n) => out.push(n === 0 ? `${lead}${l}` : `${cont}${l}`));
      }
      out.push("");
      continue;
    }

    // blank
    if (/^\s*$/.test(line)) {
      out.push("");
      i++;
      continue;
    }

    // paragraph
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6}\s|```|>|\||\s*[-*+]\s|\s*\d+\.\s)/.test(lines[i])
    ) {
      buf.push(lines[i++]);
    }
    for (const l of wrap(inlineClean(buf.join(" ")), measure)) out.push(l);
    out.push("");
  }
  return out;
}

// --- Tables ----------------------------------------------------------------------------
// Aligned columns when the padded grid fits the measure; otherwise linearized
// per row (first cell = the row's identity, remaining cells as `header: value`).

function renderTable(header: string[], rows: string[][], tier: Tier, measure: number): string[] {
  const cols = header.length;
  const widths = header.map((h, c) => Math.max(h.length, ...rows.map((r) => (r[c] ?? "").length)));
  const gridWidth = 2 + widths.reduce((a, b) => a + b, 0) + 2 * (cols - 1);

  if (gridWidth <= measure) {
    const fmtRow = (cells: string[]): string =>
      "  " + cells.map((c, idx) => (c ?? "").padEnd(idx === cols - 1 ? 0 : widths[idx])).join("  ").trimEnd();
    const sep = "  " + widths.map((w) => (tier === 2 ? "─" : "-").repeat(w)).join("  ");
    return [
      bold(fmtRow(header), tier),
      dim(sep, tier),
      ...rows.map((r) => fmtRow(r)),
    ];
  }

  // Linearized: one block per row, blank line between blocks.
  const out: string[] = [];
  rows.forEach((r, n) => {
    if (n > 0) out.push("");
    const marker = tier === 2 ? "•" : "-";
    out.push(`  ${marker} ${bold(r[0] ?? "", tier)}`);
    for (let c = 1; c < cols; c++) {
      const value = r[c] ?? "";
      if (!value) continue;
      for (const l of wrap(`${header[c]}: ${value}`, Math.max(20, measure - 4))) {
        out.push(`    ${l}`);
      }
    }
  });
  return out;
}

// --- Inline + wrap helpers -----------------------------------------------------------

// Flatten inline Markdown to plain readable text. Emphasis markers are
// stripped (per-line tier styling only — never spans inside wrapped text),
// images become `[image: alt]`, links become `text (url)`, code spans keep
// their backticks (universally legible at every tier).
export function inlineClean(s: string): string {
  let t = s.replace(/\u0000/g, "");
  // Protect code spans so emphasis/link rules never rewrite literal markup.
  const spans: string[] = [];
  t = t.replace(/`([^`]+)`/g, (_m, c) => {
    spans.push(`\`${c}\``);
    return `\u0000${spans.length - 1}\u0000`;
  });
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt) => `[image: ${alt || "untitled"}]`);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, txt: string, href: string) => {
    const h = href.trim();
    return h.startsWith("#") || h === txt ? txt : `${txt} (${h})`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1$2");
  return t.replace(/\u0000(\d+)\u0000/g, (_m, i) => spans[Number(i)]);
}

// Greedy word wrap. A word longer than the measure (a long path/URL) gets its
// own line, unbroken — paths never truncate.
export function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur.length === 0) {
      cur = w;
    } else if (cur.length + 1 + w.length <= width) {
      cur += ` ${w}`;
    } else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  return out;
}

function splitRow(line: string): string[] {
  return line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}
