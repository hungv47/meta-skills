// edit-delta — L2: capture WHAT the operator changed before approving.
//
// At a review decision the operator may have edited the produced body in place.
// A bare `approve` carries almost no signal; "approved with 9 claim-softening
// edits" reveals a systematic skill defect. This module turns that diff into a
// `body_sha` (the produced-body identity) + zero-or-more `edit_classes` labels
// from a fixed closed enum, written onto the same verdicts.tsv row C2 writes.
//
// Contract: references/verdicts-data.md § "Edit-delta (L2)".
//
// Two deliberate properties:
//   - ADVISORY. Classification never gates a decision. captureEditDelta wraps the
//     whole pass in try/catch and degrades to `edit_classes: []` — exactly the
//     best-effort discipline of appendVerdict/postMetrics. The decision is sacred.
//   - LOCAL-FIRST, DETERMINISTIC. The review CLI runs synchronously and must never
//     block or hit the network on the decision path, so classification is an
//     in-process heuristic over the diff hunks — NOT an LLM/subprocess call. The
//     enum is small and the signals separable; the labels are a prior, not a verdict.
//
// Reuses the C3 inline-edit diff (unifiedDiff) + the reformat-noise filter
// (normalizeBody) from ./collab — one diff implementation, not a second.

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeBody, unifiedDiff } from "./collab";

// The fixed edit-type enum (CLOSED set — adding a type is a schema bump, like the
// artifact contract). Order here is the canonical output order.
export const EDIT_CLASSES = [
  "softened_claim",        // hedged/qualified an overclaim ("guarantees" → "helps")
  "cut_filler",            // removed throat-clearing / redundancy with no meaning change
  "swapped_cta",           // replaced or re-pointed the call to action
  "fixed_fact",            // corrected a wrong name/number/date/URL/claim
  "voice_change",          // re-toned for brand voice (not meaning)
  "restructured",          // moved/reordered sections or hook (structure, not wording)
  "tightened_specificity", // added a concrete mechanism/proof the draft left vague
  "other",                 // a real (>threshold) edit none of the above fit
] as const;
export type EditClass = (typeof EDIT_CLASSES)[number];

// Sub-threshold deltas (typos, whitespace) are not learning. Default net-change
// floor in characters; overridable per-project via .forsvn/config.json.
export const DEFAULT_EDIT_DELTA_MIN_CHARS = 12;

export interface EditDelta {
  body_sha: string;        // sha256:<hex> of the produced body (body only, frontmatter excluded)
  edit_classes: EditClass[]; // zero-or-more enum labels; [] = clean approve
  note?: string;           // set only when classification degraded (advisory diagnostic)
}

/** sha256 of the produced body, body only — the identity a later read confirms the
 *  diff was against (and dedupes re-reviews by). Format mirrored in collab.ts (proof
 *  path) and documented in verdicts-data.md; keep the `sha256:` prefix in sync. */
export function bodySha(body: string): string {
  return "sha256:" + createHash("sha256").update(body, "utf8").digest("hex");
}

/** The net-change floor, read from `.forsvn/config.json` (flat key
 *  `edit_delta_min_chars`). Absent / malformed / negative → the default. Never
 *  throws — a bad config degrades to the default, never blocks a decision. */
export function loadEditDeltaMinChars(root: string): number {
  try {
    const p = join(root, ".forsvn", "config.json");
    if (!existsSync(p)) return DEFAULT_EDIT_DELTA_MIN_CHARS;
    const cfg = JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;
    const v = cfg?.edit_delta_min_chars;
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) return Math.floor(v);
    return DEFAULT_EDIT_DELTA_MIN_CHARS;
  } catch {
    return DEFAULT_EDIT_DELTA_MIN_CHARS;
  }
}

// --- the capture entry point -------------------------------------------------

/**
 * The single L2 chokepoint helper. Given the produced body (what the skill
 * emitted) and the operator's edited body, return the produced-body sha plus the
 * classified edit deltas. Best-effort: any failure (or a sub-threshold / no-op
 * edit) yields `edit_classes: []`. The diff is computed ONCE here.
 */
export function captureEditDelta(
  producedBody: string,
  editedBody: string,
  minChars: number = DEFAULT_EDIT_DELTA_MIN_CHARS,
): EditDelta {
  const sha = bodySha(producedBody);
  try {
    // Reformat-only noise (Proof table padding, leading blank) is not an edit.
    if (normalizeBody(producedBody) === normalizeBody(editedBody)) return { body_sha: sha, edit_classes: [] };
    const diff = unifiedDiff(producedBody, editedBody);
    if (netCharChangeFromDiff(diff) < minChars) return { body_sha: sha, edit_classes: [] };
    return { body_sha: sha, edit_classes: classifyFromDiff(diff) };
  } catch {
    return { body_sha: sha, edit_classes: [], note: "edit-classify-degraded" };
  }
}

/** `;`-join for the verdicts.tsv cell (multi-valued like `dimensions_flagged`). */
export function joinEditClasses(classes: EditClass[]): string {
  return classes.join(";");
}

// --- net-change measure ------------------------------------------------------

/** Whitespace-insensitive magnitude of the changed text: the larger of the
 *  removed-vs-added character counts (so a same-length reword still counts, while
 *  a whitespace/typo edit falls below the floor). */
export function netCharChange(before: string, after: string): number {
  return netCharChangeFromDiff(unifiedDiff(before, after));
}

function netCharChangeFromDiff(diff: string): number {
  let removed = "";
  let added = "";
  for (const line of diff.split("\n")) {
    if (line.startsWith("-")) removed += line.slice(1).replace(/\s+/g, "");
    else if (line.startsWith("+")) added += line.slice(1).replace(/\s+/g, "");
  }
  // Identical content on both sides (whitespace-only reformat) is not learning.
  if (removed === added) return 0;
  return Math.max(removed.length, added.length);
}

// --- classifier --------------------------------------------------------------

/** Public classify over two bodies (recomputes the diff) — the unit-test surface. */
export function classifyEdits(before: string, after: string): EditClass[] {
  return classifyFromDiff(unifiedDiff(before, after));
}

// Closed signal lexicons. Deliberately conservative — a missed label degrades to
// `voice_change`/`other`, never a wrong gate.
const ABSOLUTE_RE = /\b(guarantee[ds]?|always|never|the best|#1|number one|proven|instant(?:ly)?|the only|100%|zero[ -]risk|risk[ -]free|unlimited|everyone|nobody|forever|undoubtedly|definitely)\b/i;
const HEDGE_RE = /\b(help[s]?|may|might|can|could|often|typically|usually|generally|designed to|aims? to|tends? to|in many cases|up to|most|some|tend to|intended to)\b/i;
const CTA_RE = /\b(sign[ -]?up|get started|start (?:free|now|today)|buy(?: now)?|try (?:it|now|free)|subscribe|book (?:a|your)|download|contact(?: us)?|learn more|claim(?: your)?|join(?: now| today)?|request (?:a )?demo|see (?:how|pricing|plans)|shop now|order now|reserve)\b/i;
const FILLER_RE = /\b(really|very|just|simply|basically|actually|literally|in order to|it is important to note|it'?s worth noting|when it comes to|at the end of the day|needless to say|of course|obviously|essentially|quite|rather|somewhat|in fact|that)\b/i;
const FACT_RE = /https?:\/\/[^\s)]+|\b\d{4}-\d{2}-\d{2}\b|\$?\d[\d.,:%/x×-]*\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d/gi;

function factTokens(s: string): Set<string> {
  const out = new Set<string>();
  for (const m of s.toLowerCase().matchAll(FACT_RE)) out.add(m[0].trim());
  return out;
}

function firstMatch(s: string, re: RegExp): string {
  const m = s.match(re);
  return m ? m[0].toLowerCase() : "";
}

function sharedNonEmptyLines(removed: string[], added: string[]): number {
  const norm = (l: string) => l.trim();
  const a = removed.map(norm).filter(Boolean);
  const b = new Set(added.map(norm).filter(Boolean));
  let shared = 0;
  for (const l of a) if (b.has(l)) shared++;
  return shared;
}

function classifyFromDiff(diff: string): EditClass[] {
  const removedLines: string[] = [];
  const addedLines: string[] = [];
  for (const line of diff.split("\n")) {
    if (line.startsWith("-")) removedLines.push(line.slice(1));
    else if (line.startsWith("+")) addedLines.push(line.slice(1));
  }
  const removed = removedLines.join("\n");
  const added = addedLines.join("\n");
  if (!removed && !added) return [];

  const found = new Set<EditClass>();
  const rl = removed.toLowerCase();
  const al = added.toLowerCase();
  const removedSig = removed.replace(/\s+/g, "");
  const addedSig = added.replace(/\s+/g, "");

  const rFacts = factTokens(removed);
  const aFacts = factTokens(added);
  const factChanged = [...rFacts].some((f) => !aFacts.has(f));
  const factAdded = [...aFacts].some((f) => !rFacts.has(f));

  // fixed_fact — a concrete fact in the produced text was altered while the line
  // was rewritten (both sides present, a produced fact is gone from the edit).
  if (removed && added && rFacts.size > 0 && factChanged) found.add("fixed_fact");

  // tightened_specificity — the edit introduces a concrete number/metric/URL the
  // draft lacked (a new fact appears that wasn't in the produced text).
  if (added && factAdded) found.add("tightened_specificity");

  // softened_claim — an absolute/overclaim was dropped, or a hedge was introduced
  // while rewriting a claim.
  if ((ABSOLUTE_RE.test(rl) && !ABSOLUTE_RE.test(al)) || (removed && HEDGE_RE.test(al) && !HEDGE_RE.test(rl)))
    found.add("softened_claim");

  // swapped_cta — a call to action changed (a different CTA on each side, or a CTA
  // added/removed in a two-sided rewrite).
  if (CTA_RE.test(rl) && CTA_RE.test(al)) {
    if (firstMatch(rl, CTA_RE) !== firstMatch(al, CTA_RE)) found.add("swapped_cta");
  } else if (removed && added && CTA_RE.test(rl) !== CTA_RE.test(al)) {
    found.add("swapped_cta");
  }

  // restructured — content moved: ≥2 identical (trimmed, non-empty) lines appear on
  // both the removed and added side (a reorder, not a reword).
  if (sharedNonEmptyLines(removedLines, addedLines) >= 2) found.add("restructured");

  // cut_filler — a net deletion (meaningfully more removed than added), or filler
  // throat-clearing removed.
  if (removedSig.length - addedSig.length >= 6 || (FILLER_RE.test(rl) && !FILLER_RE.test(al)))
    found.add("cut_filler");

  // voice_change — a real reword (both sides present, similar length) with no
  // fact/cta/claim signal: re-toned, not re-meant.
  const reword = !!removed && !!added && Math.abs(removedSig.length - addedSig.length) < 6;
  if (reword && found.size === 0) found.add("voice_change");

  // other — a real edit (already past the net-change floor) that fit no rule.
  if (found.size === 0) found.add("other");

  return EDIT_CLASSES.filter((c) => found.has(c));
}
