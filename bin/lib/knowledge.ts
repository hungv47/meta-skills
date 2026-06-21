#!/usr/bin/env bun
// knowledge.ts — the knowledge ledger (A7): project facts with provenance.
//
// A `.forsvn/memory/knowledge.json` of project facts (ICP present? brand ratified?
// last campaign? known competitors?) each carrying source + confidence + date,
// loaded at /forsvn dispatch so the plugin never re-asks what's already on disk and
// never re-runs a fresh producer for a known fact. Generalizes the one-step
// `.forsvn/routing/last-session.md` warm-handoff to whole-project knowledge.
//
// The ledger is a CACHE, never a source of truth: disk beats ledger on every
// conflict (refresh rederives from disk); a stale high-stakes fact (>30d) is
// re-derived; reuse is always narrated, never silent. Schema SoT:
// skills/meta/forsvn/references/knowledge-ledger.md.
//
// HARD RULE (provenance-or-nothing): a fact is derived ONLY from an on-disk source.
// A fact with no on-disk source is NOT written — there is no fabricated/empty fact.
//
// This module is the pure lib (derivation + schema + freshness + read/write), used
// by bin/knowledge.ts (the CLI) and the dispatch flow. It does not run producers and
// does not mutate any artifact; it only reads disk and writes the cache.

import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, statSync } from "node:fs";
import { join, dirname } from "node:path";

export const LEDGER_VERSION = 1;
export const STALE_DAYS = 30; // high-stakes staleness window (matches the experience-substrate rule)
export type Confidence = "H" | "M" | "L";
export const CONFIDENCES = new Set<Confidence>(["H", "M", "L"]);

export interface Fact {
  value: unknown;          // boolean | string | string[] — the fact's payload
  source: string;          // the producer capability / scaffolder that put it on disk
  confidence: Confidence;  // H | M | L
  date: string;            // YYYY-MM-DD — the on-disk source's own date (or its mtime)
}
export interface Ledger {
  version: number;
  generated: string;       // YYYY-MM-DD HH:MM:SS
  facts: Record<string, Fact>;
}

// High-stakes dimensions: a stale (>30d) fact here is re-derived, never trusted from cache.
export const HIGH_STAKES = new Set<string>([
  "icp_present",
  "brand_ratified",
  "product_context_ratified",
  "known_competitors",
]);

// --- fact derivation --------------------------------------------------------
//
// Each fact maps to ONE on-disk artifact (the producer's output). `derive` reads
// the file; absent file → the fact is omitted (provenance-or-nothing). The
// producer name is the fact's `source`; the file's own `date:` (or its mtime) is
// the fact's `date`.

interface FactSpec {
  key: string;
  path: string;            // on-disk artifact, relative to the project root
  source: string;          // producing capability / scaffolder (the provenance)
  highStakes: boolean;
  derive(text: string): { value: unknown; confidence: Confidence };
}

// ICP.md present → icp_present:true; confidence from the file's "Confidence Summary" line.
function deriveIcp(text: string): { value: unknown; confidence: Confidence } {
  return { value: true, confidence: summaryConfidence(text) };
}

// A canonical artifact is "ratified" iff its decision_state is a settled human state:
// `approved` (a human reviewed and accepted it) or `not_required` (no human gate applies —
// e.g. a pointer doc). `pending` / `denied` / `suggested` (and an absent/unrecognized state,
// which the contract normalizes to not_required) are handled explicitly below. The legal enum
// is the reviewable-artifact contract's: pending | approved | denied | suggested | not_required
// (validate-artifacts.ts). There is NO `accepted` value — ratification reads the real states.
function ratification(text: string): { value: boolean; confidence: Confidence } {
  const ds = frontmatterField(text, "decision_state");
  // Absent/unrecognized decision_state normalizes to not_required per the contract → ratified.
  if (ds === undefined) return { value: true, confidence: "M" };
  if (ds === "approved") return { value: true, confidence: "H" };          // human-approved
  if (ds === "not_required") return { value: true, confidence: "M" };      // no gate applies (e.g. a pointer)
  return { value: false, confidence: "L" };                                // pending | denied | suggested → unratified
}

// PRODUCT-CONTEXT.md → product_context_ratified from its real decision_state.
function deriveProductContext(text: string): { value: unknown; confidence: Confidence } {
  return ratification(text);
}

// BRAND.md → brand_ratified from its real decision_state (the live BRAND.md is a
// not_required pointer to the _ops brand vault → ratified).
function deriveBrand(text: string): { value: unknown; confidence: Confidence } {
  return ratification(text);
}

// MARKET.md → known_competitors: the competitor names it lists (heuristic, see below).
function deriveCompetitors(text: string): { value: unknown; confidence: Confidence } {
  const names = extractCompetitors(text);
  return { value: names, confidence: names.length ? "M" : "L" };
}

const FACT_SPECS: FactSpec[] = [
  { key: "icp_present", path: "docs/forsvn/canonical/research/ICP.md", source: "research-icp", highStakes: true, derive: deriveIcp },
  { key: "product_context_ratified", path: "docs/forsvn/canonical/product/PRODUCT-CONTEXT.md", source: "research-icp", highStakes: true, derive: deriveProductContext },
  { key: "brand_ratified", path: "docs/forsvn/canonical/marketing/BRAND.md", source: "create-brand", highStakes: true, derive: deriveBrand },
  { key: "known_competitors", path: "docs/forsvn/canonical/research/MARKET.md", source: "research-market", highStakes: true, derive: deriveCompetitors },
];

// The "last campaign" fact is path-globbed (the launch run record is slug-stamped),
// so it is derived separately from the single-file specs above.
const LAST_CAMPAIGN_DIR = "docs/forsvn/artifacts/marketing/launch";

/**
 * Rescan disk and (re)build the ledger from on-disk sources only. Every returned
 * fact carries source + confidence + date; a fact with no on-disk source is omitted.
 * `root` is the project root (host CWD at dispatch time).
 */
export function deriveFacts(root: string): Record<string, Fact> {
  const facts: Record<string, Fact> = {};

  for (const spec of FACT_SPECS) {
    const abs = join(root, spec.path);
    if (!existsSync(abs)) continue; // provenance-or-nothing: no on-disk source → no fact
    let text: string;
    try { text = readFileSync(abs, "utf8"); } catch { continue; }
    const { value, confidence } = spec.derive(text);
    facts[spec.key] = {
      value,
      source: spec.source,
      confidence,
      date: frontmatterField(text, "date") || fileDate(abs),
    };
  }

  const campaign = deriveLastCampaign(root);
  if (campaign) facts.last_campaign = campaign;

  return facts;
}

// last_campaign: the most recent launch run record under the launch dir, by mtime.
// Its slug is the fact value; source is run-launch; date is the file's mtime.
function deriveLastCampaign(root: string): Fact | null {
  const dir = join(root, LAST_CAMPAIGN_DIR);
  if (!existsSync(dir)) return null;
  let newest: { name: string; mtimeMs: number } | null = null;
  let entries: string[];
  try {
    const { readdirSync } = require("node:fs");
    entries = readdirSync(dir) as string[];
  } catch { return null; }
  for (const name of entries) {
    if (!name.endsWith(".md")) continue;
    let st;
    try { st = statSync(join(dir, name)); } catch { continue; }
    if (!st.isFile()) continue;
    if (!newest || st.mtimeMs > newest.mtimeMs) newest = { name, mtimeMs: st.mtimeMs };
  }
  if (!newest) return null;
  // slug = filename minus extension (the run record is "[channel]-[date]-run-[slug].md")
  const slug = newest.name.replace(/\.md$/, "");
  return { value: slug, source: "run-launch", confidence: "H", date: isoDate(new Date(newest.mtimeMs)) };
}

/** Build the full ledger object from disk (refresh). */
export function buildLedger(root: string): Ledger {
  return { version: LEDGER_VERSION, generated: nowStamp(), facts: deriveFacts(root) };
}

// --- read / write -----------------------------------------------------------

export function ledgerPath(root: string): string {
  return join(root, ".forsvn", "memory", "knowledge.json");
}

/** Read the ledger from disk, or null if absent/unparseable. */
export function readLedger(root: string): Ledger | null {
  const p = ledgerPath(root);
  if (!existsSync(p)) return null;
  try {
    const obj = JSON.parse(readFileSync(p, "utf8"));
    if (!obj || typeof obj !== "object" || typeof obj.facts !== "object") return null;
    return obj as Ledger;
  } catch { return null; }
}

/** Atomically write the ledger (temp-file + same-dir rename) so a crash leaves a valid file. */
export function writeLedger(root: string, ledger: Ledger): void {
  const p = ledgerPath(root);
  mkdirSync(dirname(p), { recursive: true });
  const tmp = `${p}.tmp-${process.pid}`;
  writeFileSync(tmp, JSON.stringify(ledger, null, 2) + "\n", "utf8");
  renameSync(tmp, p);
}

/** Refresh = rescan disk → write the ledger. Returns the freshly built ledger. */
export function refresh(root: string): Ledger {
  const ledger = buildLedger(root);
  writeLedger(root, ledger);
  return ledger;
}

// --- query / freshness ------------------------------------------------------

/**
 * Read one fact for dispatch. Returns the cached fact ONLY when it is trustworthy:
 * - disk-vs-ledger consistency is the caller's concern at refresh time; here we
 *   only gate on freshness, because the ledger is a cache.
 * - a stale high-stakes fact (>30d) returns `undefined` (force a re-derive), never a
 *   stale value. A fact absent from the ledger returns `undefined`.
 * `today` is injectable for deterministic tests.
 */
export function getFact(ledger: Ledger | null, key: string, today: Date = new Date()): Fact | undefined {
  const fact = ledger?.facts?.[key];
  if (!fact) return undefined;
  if (HIGH_STAKES.has(key) && isStale(fact.date, today)) return undefined; // stale high-stakes → re-derive
  return fact;
}

/** A fact whose value is "present on disk" (truthy boolean or a non-empty payload). */
export function factIsPresent(fact: Fact | undefined): boolean {
  if (!fact) return false;
  if (typeof fact.value === "boolean") return fact.value;
  if (Array.isArray(fact.value)) return fact.value.length > 0;
  return fact.value != null && fact.value !== "";
}

/**
 * The "don't re-run a known fact" decision, narration included. Given a producer's
 * fact key and the ledger, decide whether the producer can be SKIPPED at dispatch.
 * Skip only when the fact is present with adequate confidence AND fresh; otherwise
 * the producer runs. Returns the one-line reuse narration when skipping (never silent).
 */
export function reuseDecision(
  ledger: Ledger | null,
  key: string,
  opts: { minConfidence?: Confidence; today?: Date } = {},
): { skip: boolean; narration?: string } {
  const today = opts.today ?? new Date();
  const min = opts.minConfidence ?? "M";
  const fact = getFact(ledger, key, today); // already drops stale high-stakes facts
  if (!fact || !factIsPresent(fact)) return { skip: false };
  if (confidenceRank(fact.confidence) < confidenceRank(min)) return { skip: false };
  return {
    skip: true,
    narration: `Reusing ${key} (from ${fact.source}, ${fact.date}, confidence ${fact.confidence}) — not re-running.`,
  };
}

// --- resolve-deps bridge ----------------------------------------------------
//
// resolve-deps (A5) skips re-inserting a producer when its output is already
// "on disk" — it reads that signal through an injected `onDisk(artifactId)` hook
// keyed on the producer's OUTPUT artifact id (resolve-deps's id-space), not the
// ledger's fact keys. This map bridges the two id-spaces so the ledger IS that
// signal in code (not just prose): a fact whose value means "the producer's output
// is present" maps to that output's artifact id.
//
// Only facts that represent a producer-output PRESENCE belong here. last_campaign
// (a run-record slug, not a hard prereq) and any fact whose value is not "output
// present" are intentionally absent — they never gate a producer insertion.
export const FACT_TO_ARTIFACT_ID: Record<string, string> = {
  icp_present: "icp-research",
  product_context_ratified: "product-context",
  brand_ratified: "brand",
  known_competitors: "market-research",
};

/**
 * Build the `onDisk(artifactId) => boolean` hook resolve-deps expects, backed by
 * the knowledge ledger. An artifact id counts as on-disk only when its ledger fact
 * passes the SAME reuse gate dispatch narrates (present + fresh + adequate confidence),
 * so the plan skip and the dispatch narration agree. Unknown artifact ids (not in the
 * map) fall through to `false` — resolve-deps then inserts the producer as before.
 *
 * `narrate` (optional) receives the one-line reuse narration for each skipped producer
 * so the caller can surface the skip in the plan (never silent).
 */
export function onDiskFromLedger(
  ledger: Ledger | null,
  opts: { minConfidence?: Confidence; today?: Date; narrate?: (line: string) => void } = {},
): (artifactId: string) => boolean {
  const byArtifact: Record<string, string> = {};
  for (const [factKey, artId] of Object.entries(FACT_TO_ARTIFACT_ID)) byArtifact[artId] = factKey;
  return (artifactId: string): boolean => {
    const factKey = byArtifact[artifactId];
    if (!factKey) return false; // not a ledger-backed artifact → resolve-deps inserts the producer
    const d = reuseDecision(ledger, factKey, { minConfidence: opts.minConfidence, today: opts.today });
    if (d.skip && d.narration && opts.narrate) opts.narrate(d.narration);
    return d.skip;
  };
}

export function isStale(date: string, today: Date = new Date()): boolean {
  const d = parseISO(date);
  if (!d) return false; // an unparseable date is handled by schema validation, not freshness
  const ageDays = (today.getTime() - d.getTime()) / 86_400_000;
  return ageDays > STALE_DAYS;
}

// --- schema validation (--check) --------------------------------------------

/** Validate the on-disk ledger's schema + provenance. Returns problems ([] = ok). */
export function validateLedger(ledger: unknown): string[] {
  const problems: string[] = [];
  if (!ledger || typeof ledger !== "object") return ["ledger is not an object"];
  const l = ledger as Record<string, unknown>;
  if (l.version !== LEDGER_VERSION) problems.push(`version must be ${LEDGER_VERSION} (got ${JSON.stringify(l.version)})`);
  if (typeof l.generated !== "string" || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(l.generated))
    problems.push(`generated must be "YYYY-MM-DD HH:MM:SS" (got ${JSON.stringify(l.generated)})`);
  if (!l.facts || typeof l.facts !== "object") return [...problems, "facts must be an object"];

  for (const [key, raw] of Object.entries(l.facts as Record<string, unknown>)) {
    if (!raw || typeof raw !== "object") { problems.push(`fact ${JSON.stringify(key)} is not an object`); continue; }
    const f = raw as Record<string, unknown>;
    if (!("value" in f)) problems.push(`fact ${key}: missing value`);
    // Provenance-or-nothing: source + confidence + date are all mandatory.
    if (typeof f.source !== "string" || !f.source) problems.push(`fact ${key}: missing source (every fact MUST carry provenance)`);
    if (!CONFIDENCES.has(f.confidence as Confidence)) problems.push(`fact ${key}: confidence ${JSON.stringify(f.confidence)} invalid (expected H | M | L)`);
    if (typeof f.date !== "string" || !parseISO(f.date as string)) problems.push(`fact ${key}: date ${JSON.stringify(f.date)} invalid (expected YYYY-MM-DD)`);
  }
  return problems;
}

// --- small readers ----------------------------------------------------------

/** Read a single frontmatter scalar (`key: value`) from a markdown file's `---` block. */
export function frontmatterField(text: string, key: string): string | undefined {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = m ? m[1] : text;
  const km = body.match(new RegExp(`^${key}\\s*:\\s*(.*)$`, "m"));
  return km ? km[1].trim() : undefined;
}

/** Read the ICP "Confidence Summary" line → H if it leads with high findings, else M/L. */
export function summaryConfidence(text: string): Confidence {
  const m = text.match(/Confidence Summary:[* ]*(.*)/i);
  if (!m) return "M";
  const line = m[1];
  // "3 H / 1 M / 0 L" style — pick the band with the most findings; default M.
  const grab = (band: string) => { const g = line.match(new RegExp(`(\\d+)\\s*${band}\\b`)); return g ? Number(g[1]) : 0; };
  const h = grab("H"), mm = grab("M"), ll = grab("L");
  if (h === 0 && mm === 0 && ll === 0) return "M";
  if (h >= mm && h >= ll) return "H";
  if (ll > h && ll > mm) return "L";
  return "M";
}

/**
 * Heuristic competitor extraction from MARKET.md: names under a "Competitor" /
 * "Competitors" / "Competitive landscape" section — bullet leads (`- **Name**`,
 * `- Name —`) or a table's first column. Best-effort; the confidence reflects it.
 */
export function extractCompetitors(text: string): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  const add = (n: string) => { const t = n.trim().replace(/[*`]/g, ""); if (t && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); names.push(t); } };
  const lines = text.split(/\r?\n/);
  let inSection = false;
  for (const line of lines) {
    if (/^#{1,6}\s/.test(line)) inSection = /competitor|competitive/i.test(line);
    if (!inSection) continue;
    // bullet: "- **Acme**" or "- Acme — ..."
    let m = line.match(/^\s*[-*]\s+\*{0,2}([A-Z][\w .&'/-]{1,40}?)\*{0,2}\s*(?:[—:-]|$)/);
    if (m) { add(m[1]); continue; }
    // table row: "| Acme | ..." (skip header/separator rows)
    m = line.match(/^\s*\|\s*([A-Z][\w .&'/-]{1,40}?)\s*\|/);
    if (m && !/^\s*\|\s*-+\s*\|/.test(line) && !/competitor/i.test(m[1])) add(m[1]);
  }
  return names;
}

// --- date / time helpers ----------------------------------------------------

function fileDate(abs: string): string {
  try { return isoDate(statSync(abs).mtime); } catch { return isoDate(new Date()); }
}
function isoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function parseISO(s: string): Date | null {
  if (typeof s !== "string") return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}
function nowStamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function confidenceRank(c: Confidence): number { return c === "H" ? 3 : c === "M" ? 2 : 1; }
