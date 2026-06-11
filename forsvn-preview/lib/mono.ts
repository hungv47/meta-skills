// mono — the shared terminal renderer for every forsvn-preview CLI surface.
//
// Implements the spec's degradation contract (brief-product-ui 2026-06-10
// §4.3): one semantic layer (decision states as glyph + word + color triples,
// T5 vocabulary only) rendered at two terminal fidelities —
//
//   tier 2  ANSI-16   when the destination stream is a TTY and !NO_COLOR
//                     and TERM !== "dumb"
//   tier 3  plain     otherwise — ASCII-safe, zero escape bytes
//
// The tier is resolved PER DESTINATION STREAM (stdout and stderr
// independently), so a stderr-bound refusal never leaks escapes into a
// redirected log while stdout is still a live TTY, and vice versa.
//
// Ground rules (binding, from the spec + brand):
//   - never paint a background — foreground-only SGR, the user's terminal
//     theme is inherited (no 40–47 / 100–107 codes, ever)
//   - standard green SGR 32, never bright SGR 92 (the Signal-Lime ghost)
//   - no 256-color (38;5) or truecolor (38;2) escapes — ANSI-16 is the floor
//   - stillness — formatters return strings; nothing animates or redraws
//
// Pure + dependency-free (lib/render.ts precedent): formatters take an
// explicit tier and return strings, never print. Bun/Node built-ins only.

export type Tier = 2 | 3;

export const DECISION_STATES = ["pending", "approved", "suggested", "denied", "not_required"] as const;
export type DecisionState = (typeof DECISION_STATES)[number];

type StreamLike = { isTTY?: boolean };

// Tier gate — resolved once per destination stream. NO_COLOR follows
// no-color.org: present AND non-empty disables color.
export function resolveTier(
  stream: StreamLike,
  env: Record<string, string | undefined> = process.env,
): Tier {
  if (!stream.isTTY) return 3;
  if (env.NO_COLOR !== undefined && env.NO_COLOR !== "") return 3;
  if (env.TERM === "dumb") return 3;
  return 2;
}

// --- SGR palette (foreground only) ----------------------------------------

const RESET = "\x1b[0m";
const SGR = {
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",      // standard green — never \x1b[92m
  yellow: "\x1b[33m",
  boldGreen: "\x1b[1;32m", // active prompt / bracketed keys
} as const;

function paint(text: string, code: string, tier: Tier): string {
  if (tier !== 2 || text.length === 0) return text;
  return `${code}${text}${RESET}`;
}

export const dim = (text: string, tier: Tier): string => paint(text, SGR.dim, tier);
export const bold = (text: string, tier: Tier): string => paint(text, SGR.bold, tier);
export const promptKey = (text: string, tier: Tier): string => paint(text, SGR.boldGreen, tier);
export const errorText = (text: string, tier: Tier): string => paint(text, SGR.red, tier);

export function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

export function visibleLength(s: string): number {
  return stripAnsi(s).length;
}

// --- Glyph triples ----------------------------------------------------------
// Every decision state is glyph + word + color; color is never alone. Tier 3
// substitutes the spec's ASCII fallbacks so piped/dumb consumers stay clean.

const GLYPHS: Record<DecisionState, { glyph: string; ascii: string; sgr: string }> = {
  pending:      { glyph: "●", ascii: "*",    sgr: SGR.dim },
  approved:     { glyph: "✓", ascii: "[ok]", sgr: SGR.green },
  suggested:    { glyph: "~", ascii: "~",    sgr: SGR.yellow },
  denied:       { glyph: "✗", ascii: "x",    sgr: SGR.red },
  not_required: { glyph: "○", ascii: "o",    sgr: SGR.dim },
};

export function stateGlyph(state: DecisionState, tier: Tier): string {
  return tier === 2 ? GLYPHS[state].glyph : GLYPHS[state].ascii;
}

// `✓ approved` (tier 2, colored) / `[ok] approved` (tier 3, plain).
export function decisionBadge(state: DecisionState, tier: Tier): string {
  return paint(`${stateGlyph(state, tier)} ${state}`, GLYPHS[state].sgr, tier);
}

// --- Primitive formatters -----------------------------------------------------

const INDENT = "  "; // §4.3 indent unit = 2 spaces

// Full-width secondary guidance, 2-space indented, dim.
export function hintLine(text: string, tier: Tier): string {
  return `${INDENT}${dim(text, tier)}`;
}

// `pending (2)` / `decided (5)  — use --state all to show`
export function queueHeading(
  kind: "pending" | "decided",
  count: number,
  tier: Tier,
  dimSuffix?: string,
): string {
  const head = `${kind} (${count})`;
  return dimSuffix ? `${head}  ${dim(`— ${dimSuffix}`, tier)}` : head;
}

// Frame-cap divider: `── label ────────` filled to `width`; ASCII `-` at tier 3.
export function frameCap(label: string, width: number, tier: Tier): string {
  const bar = tier === 2 ? "─" : "-";
  const lead = bar.repeat(2);
  const tailLen = Math.max(4, width - (2 + 1 + label.length + 1));
  return `${dim(lead, tier)} ${label} ${dim(bar.repeat(tailLen), tier)}`;
}

export function dividerLine(width: number, tier: Tier): string {
  const bar = tier === 2 ? "─" : "-";
  return dim(bar.repeat(Math.max(4, width)), tier);
}

// --- ArtifactRow -----------------------------------------------------------------
// Row grammar (§5 P-01): 2-space indent · glyph · 1 space · path (padded to the
// longest pending path — ledger alignment) · 3 spaces · meta dim · ` · ` excerpt.
// One row is ALWAYS one line. Truncation order at narrow widths: (1) excerpt
// clipped with `…`, (2) excerpt dropped; path and meta never truncate.

export type RowEntry = {
  state: DecisionState;
  path: string;
  meta: string[];        // e.g. [stack, skill, date] — joined with ` · `
  excerpt?: string;
};

export function artifactRow(
  entry: RowEntry,
  tier: Tier,
  opts: { padTo?: number; width?: number } = {},
): string {
  const width = opts.width ?? 80;
  const glyph = stateGlyph(entry.state, tier);
  const glyphSgr = GLYPHS[entry.state].sgr;
  const padTo = Math.max(opts.padTo ?? 0, entry.path.length);
  const pathCol = entry.path.padEnd(padTo);
  const metaText = entry.meta.filter(Boolean).join(" · ");
  const stateWord = entry.state === "pending" ? "" : ` ${entry.state}`;

  // Plain skeleton (no escapes) for width math.
  const basePlain = `${INDENT}${glyph}${stateWord} ${pathCol}   ${metaText}`;
  let excerptPart = "";
  const excerpt = (entry.excerpt ?? "").replace(/\s+/g, " ").trim();
  if (excerpt.length > 0) {
    const sep = ` · "`;
    const close = `"`;
    const room = width - basePlain.length - sep.length - close.length;
    if (excerpt.length <= room) {
      excerptPart = `${sep}${excerpt}${close}`;
    } else if (room >= 2) {
      // clip with `…` (counts toward the room)
      excerptPart = `${sep}${excerpt.slice(0, room - 1)}…${close}`;
    }
    // else: drop the excerpt entirely — path + meta never truncate
  }

  // Re-assemble with per-segment styling; one line, never wrapped.
  const styledGlyph = paint(`${glyph}${stateWord}`, glyphSgr, tier);
  const styledMeta = dim(metaText, tier);
  return `${INDENT}${styledGlyph} ${pathCol}   ${styledMeta}${dim(excerptPart, tier)}`;
}

// --- ResultLine ---------------------------------------------------------------------
// `human`: `✓ approved · written to frontmatter · HTML archived`
// `done`:  `done · decision: approved` (the agent-relayed close)

export function resultLine(variant: "human" | "done", state: DecisionState, tier: Tier): string {
  if (variant === "done") return `done · decision: ${state}`;
  return `${decisionBadge(state, tier)} · written to frontmatter · HTML archived`;
}

// --- RefusalLine ------------------------------------------------------------------
// Never-silent refusal grammar: reason + exit code + recovery hint, always.
// Tier 2 leads with the warn glyph; tier 3 uses the `error:` prefix (§4.3).

export type RefusalVariant = "precondition" | "bind" | "timeout" | "non-interactive" | "conflict";

export const REFUSAL_EXIT: Record<RefusalVariant, number> = {
  precondition: 1,
  bind: 2,
  timeout: 124,
  "non-interactive": 1,
  conflict: 1,
};

export function refusalLine(
  variant: RefusalVariant,
  reason: string,
  recovery: string,
  tier: Tier,
): string {
  const exit = REFUSAL_EXIT[variant];
  const head =
    tier === 2
      ? `${errorText(`⚠ ${reason}`, tier)}  ${dim(`(exit ${exit})`, tier)}`
      : `error: ${reason}  (exit ${exit})`;
  return `${head}\n${hintLine(recovery, tier)}`;
}

// --- BannerBlock ---------------------------------------------------------------------
// Serve-launch announcement. `gui`: URL + CSRF preview + local-trust note.
// `headless`: no-GUI line + tunnel hint + "or decide here:" handoff to the
// TTY prompt. The serving line stays ONE unbroken line — the e2e suite
// scrapes the URL from it and humans copy-paste it.

export type BannerOpts = {
  variant: "gui" | "headless";
  servingLine: string;     // `serving <rel> at <url>` — kept whole, never styled apart
  csrfPreview?: string;    // first 8 hex chars of the token
  trustHint?: string;      // local-trust note (gui)
  tunnelHint?: string;     // `ssh -L port:127.0.0.1:port <host>` (headless)
};

export function bannerBlock(opts: BannerOpts, tier: Tier): string[] {
  const lines: string[] = [];
  lines.push(opts.servingLine);
  if (opts.csrfPreview) {
    lines.push(hintLine(`csrf token = ${opts.csrfPreview}…  (full token wired into page config)`, tier));
  }
  if (opts.variant === "gui") {
    if (opts.trustHint) lines.push(hintLine(opts.trustHint, tier));
  } else {
    lines.push("no local browser detected");
    if (opts.tunnelHint) lines.push(hintLine(opts.tunnelHint, tier));
    lines.push("or decide here:");
  }
  return lines;
}
