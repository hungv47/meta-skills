// tty-prompt — the P-04 headless decision prompt (spec §5/§6, J3-W3).
//
// A PURE state machine: `step()` takes one raw keypress and returns text to
// write plus an optional terminal outcome. The bin wires it to raw stdin;
// nothing here touches the filesystem, the process, or the decision write
// path — the outcome resolves the same single-shot promise as POST /done
// (first decision wins), so `applyDecision` runs exactly once, downstream.
//
// Transcript-append only: no redraws, no cursor repositioning, no spinners
// (§4.3 stillness). Sequential capture: decision keypress → optional comment
// line → outcome. `q` (or Ctrl-C) exits with the world unchanged.
//
// Vocabulary: T5 only — approved / denied / suggested. No synonyms, ever.

import { dim, promptKey, hintLine, frameCap, type Tier } from "./mono";

export type TtyDecision = "approved" | "denied" | "suggested";

export type TtyOutcome =
  | { kind: "decision"; decision_state: TtyDecision; comment?: string }
  | { kind: "quit" };

export type MachineState = {
  phase: "prompt" | "comment";
  picked?: TtyDecision;
  buffer: string;   // comment text being typed
  hinted: boolean;  // the unrecognized-key reprint fires at most once
};

const KEY_TO_DECISION: Record<string, TtyDecision> = {
  a: "approved",
  d: "denied",
  s: "suggested",
};

const CTRL_C = "\x03";
const BACKSPACE_KEYS = new Set(["\x7f", "\b"]);
const INDENT = "  ";

export function initialState(): MachineState {
  return { phase: "prompt", buffer: "", hinted: false };
}

// `decision  [a]pprove  [d]eny  [s]uggest changes  [q]uit without deciding`
// Bracketed keys carry the active-prompt treatment (bold green SGR 1;32 at
// tier 2; plain brackets at tier 3). 2-space indented under the banner.
export function decisionLine(tier: Tier): string {
  const k = (key: string, rest: string): string => `${promptKey(`[${key}]`, tier)}${rest}`;
  return `${INDENT}decision  ${k("a", "pprove")}  ${k("d", "eny")}  ${k("s", "uggest changes")}  ${k("q", "uit without deciding")}`;
}

export function commentPrompt(tier: Tier): string {
  return `${INDENT}comment (optional, ${dim("⏎ to skip", tier)}): `;
}

// The frame + excerpt + gate heading printed once before the loop starts.
export function promptIntro(
  meta: { name: string; skill: string; state: string; excerpt?: string },
  tier: Tier,
  width: number,
): string[] {
  const lines: string[] = [];
  lines.push(`${INDENT}${frameCap(`${meta.name} · ${meta.skill} · ${meta.state}`, Math.max(20, width - 2), tier)}`);
  if (meta.excerpt) lines.push(`${INDENT}> ${meta.excerpt}`);
  lines.push(`${INDENT}## Review Gate`);
  lines.push("");
  lines.push(decisionLine(tier));
  return lines;
}

export type StepResult = {
  state: MachineState;
  write: string;          // raw text to write to the terminal (may be empty)
  outcome?: TtyOutcome;   // present = the loop is over
};

export function step(state: MachineState, key: string, tier: Tier): StepResult {
  if (state.phase === "prompt") {
    const lower = key.toLowerCase();
    if (lower === "q" || key === CTRL_C) {
      // Quit: world unchanged, no write-back. `q` echoes itself; Ctrl-C just
      // breaks the line, matching the comment-phase interrupt below.
      const write = key === CTRL_C ? "\n" : `${INDENT}> q\n`;
      return { state, write, outcome: { kind: "quit" } };
    }
    const picked = KEY_TO_DECISION[lower];
    if (picked) {
      return {
        state: { ...state, phase: "comment", picked, buffer: "" },
        write: `${INDENT}> ${lower}\n${commentPrompt(tier)}`,
      };
    }
    // Unrecognized key: reprint the decision line once with a dim hint —
    // no bell, no error, no exit. After the one reprint, stay quiet.
    if (!state.hinted) {
      return {
        state: { ...state, hinted: true },
        write: `${hintLine("press a · d · s · q", tier)}\n${decisionLine(tier)}\n`,
      };
    }
    return { state, write: "" };
  }

  // comment phase — hand-rolled line capture (stdin stays in raw mode).
  if (key === "\r" || key === "\n") {
    const comment = state.buffer.trim();
    return {
      state,
      write: "\n",
      outcome: { kind: "decision", decision_state: state.picked as TtyDecision, ...(comment ? { comment } : {}) },
    };
  }
  if (key === CTRL_C) {
    return { state, write: "\n", outcome: { kind: "quit" } };
  }
  if (BACKSPACE_KEYS.has(key)) {
    if (state.buffer.length === 0) return { state, write: "" };
    return { state: { ...state, buffer: state.buffer.slice(0, -1) }, write: "\b \b" };
  }
  // Printable input echoes; control bytes are ignored.
  if (key >= " " || key === "\t") {
    return { state: { ...state, buffer: state.buffer + key }, write: key };
  }
  return { state, write: "" };
}
