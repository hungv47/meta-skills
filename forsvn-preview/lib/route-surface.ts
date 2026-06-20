// route-surface — C5: auto-pick the review surface (inline card vs Proof) so the
// operator never chooses a review tool. The artifact's explicit `review_tool: proof`
// wins; otherwise a length/iteration heuristic decides; the default is inline.
//
// PURE + DETERMINISTIC. This module makes the routing DECISION only — it never
// starts Proof, touches the network, or writes. The caller (forsvn-web's /collab
// route, the /forsvn:review CLI, the desktop Co-edit toggle) acts on the verdict
// and owns the Proof-absent fallback to C3 inline-edit (writeBodyAndDecision in
// lib/collab.ts). Decisions stay human-owned throughout — C5 changes only WHICH
// editing surface the human gets, never WHO decides (the suggest-only invariant,
// crates/forsvn-mcp/tests/collab_guard.rs, is untouched).
//
// Contract: specs/WS-C-cowork.md § C5.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type ReviewSurface = "inline" | "proof";

/** Body-length cut for "long-form" → Proof. A hook/tagline/ad/social body is a few
 *  hundred chars; a spec, plan, decision record, or landing brief runs to several
 *  KB. ~2400 chars sits between them. Overridable per project (config key below). */
export const DEFAULT_LONG_FORM_CHARS = 2400;

/** Prior `suggested` verdicts on this artifact_id that flip routing to Proof: an
 *  artifact bounced for changes a couple of times is iterative and wants
 *  turn-by-turn editing. NOTE: honored by pickReviewSurface (the contract is
 *  stable), but NOT wired by any caller in v0 — computing it would require reading
 *  verdicts.tsv, and lib/query-verdicts.ts (the single store reader, guardrail §8)
 *  aggregates by skill, not by artifact_id. A caller may pass it once a per-id read
 *  exists; until then bodyLength + the explicit override are the active signals. */
export const ITERATION_SUGGEST_THRESHOLD = 2;

/** One-line note surfaced when Proof can't start and review degrades to inline —
 *  the C5 "never a dead end" guarantee. */
export const PROOF_UNAVAILABLE_NOTE = "using inline edit (Proof unavailable)";

/** The structural subset of a manifest Entry / frontmatter the router reads — kept
 *  local so the pure function doesn't couple to workspace.ts's full Entry. */
export interface RouteEntry {
  /** explicit override: "proof" forces Proof (the rest fall through to heuristic). */
  review_tool?: string;
  /** html | md | none (informational; "none" = not a reviewable surface). */
  review_surface?: string;
}

export interface RouteOpts {
  /** artifact BODY length in chars (frontmatter excluded). */
  bodyLength?: number;
  /** prior `suggested` verdicts on this id (see ITERATION_SUGGEST_THRESHOLD). */
  priorSuggestN?: number;
  /** override DEFAULT_LONG_FORM_CHARS (from .forsvn/config.json). */
  longFormThreshold?: number;
}

/**
 * Pick the review surface. Order (first match wins):
 *   1. explicit `review_tool: proof` → "proof" (always honored when set).
 *   2. long-form body (> threshold)  → "proof".
 *   3. iterative (priorSuggestN ≥ ITERATION_SUGGEST_THRESHOLD) → "proof".
 *   4. otherwise → "inline" (the default; Proof is the heavier path, reserved).
 */
export function pickReviewSurface(entry: RouteEntry, opts: RouteOpts = {}): ReviewSurface {
  if ((entry.review_tool ?? "").trim().toLowerCase() === "proof") return "proof";
  const threshold = opts.longFormThreshold ?? DEFAULT_LONG_FORM_CHARS;
  if ((opts.bodyLength ?? 0) > threshold) return "proof";
  if ((opts.priorSuggestN ?? 0) >= ITERATION_SUGGEST_THRESHOLD) return "proof";
  return "inline";
}

/** The long-form char threshold from `.forsvn/config.json` (flat key
 *  `review_long_form_chars`). Absent / malformed / non-positive → the default.
 *  Never throws — a bad config degrades to the default, never blocks a review.
 *  Mirrors lib/edit-delta.ts loadEditDeltaMinChars. */
export function loadLongFormThreshold(root: string): number {
  try {
    const p = join(root, ".forsvn", "config.json");
    if (!existsSync(p)) return DEFAULT_LONG_FORM_CHARS;
    const cfg = JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;
    const v = cfg?.review_long_form_chars;
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return Math.floor(v);
    return DEFAULT_LONG_FORM_CHARS;
  } catch {
    return DEFAULT_LONG_FORM_CHARS;
  }
}

/** True when an error means Proof simply isn't available/installed (vs a real
 *  runtime fault) — the signal to degrade to inline AND to kick off first-use
 *  auto-provision. Mirrors the message shapes startProofServer / proof-setup raise
 *  (missing install, unset FORSVN_PROOF_DIR, no node_modules, Node missing/old).
 *  Used by forsvn-web's proof hint, its first-use auto-provision gate, and the
 *  /collab/open inline-fallback signal. */
export function isProofUnavailableError(message: string): boolean {
  return /no Proof install|FORSVN_PROOF_DIR|not a Proof SDK|no node_modules|Node not found|needs 18\+|too old/i.test(
    message,
  );
}
