// GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root.
// hosted-api — the soft-client half of open-core (U9). Lets a Pro user's FREE,
// MIT skills transparently upgrade to current packs + injected brand context when
// a hosted entitlement is present, and degrade to fully-local behavior otherwise.
//
// THE INVARIANT (plan U9 / build-spec §1): a license check NEVER sits on a skill
// execution path. These functions answer "do I have a key to call the API?" —
// never "am I allowed to run the skill." No key → local snapshot + local canonical
// docs, no network, no nags. API unreachable → degrade to local, warn, never fail
// the run. The check is the ABSENCE of a key, not a gate.
//
// Ships in the OSS mirror on purpose: it holds no secrets — it reads a key the
// desktop app wrote locally after activation. Forking the Markdown yields a client
// that simply always takes the local path.

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export interface HostedDeps {
  /** Override the key lookup (tests). Default: env + local credential files. */
  getKey?: () => string | null;
  /** Override the API base (tests / self-host). Default: env or api.forsvn.com. */
  apiBase?: () => string;
  /** Override fetch (tests). Default: global fetch. */
  fetchImpl?: typeof fetch;
  /** Where to emit the transparent-degrade warning. Default: console.error. */
  warn?: (msg: string) => void;
}

export function apiBase(deps: HostedDeps = {}): string {
  if (deps.apiBase) return deps.apiBase();
  return process.env.FORSVN_API_BASE?.replace(/\/+$/, "") || "https://api.forsvn.com";
}

/** The entitlement-derived key the app wrote locally, or null (→ free path). */
export function getApiKey(deps: HostedDeps = {}): string | null {
  if (deps.getKey) return deps.getKey();
  if (process.env.FORSVN_API_KEY) return process.env.FORSVN_API_KEY;
  for (const p of credentialPaths()) {
    try {
      if (!existsSync(p)) continue;
      const raw = readFileSync(p, "utf-8").trim();
      if (p.endsWith(".json")) {
        const j = JSON.parse(raw) as { api_key?: string };
        if (j.api_key) return j.api_key;
      } else if (raw.startsWith("fsk_")) {
        return raw;
      }
    } catch {
      // unreadable credential file → treat as no key (free path)
    }
  }
  return null;
}

function credentialPaths(): string[] {
  const home = homedir();
  return [
    join(home, ".config", "forsvn", "credentials.json"),
    join(home, ".config", "forsvn", "api-key"),
    // macOS Tauri app support dir (where the desktop app persists it post-activation)
    join(home, "Library", "Application Support", "com.forsvn.app", "credentials.json"),
  ];
}

export type PackResult =
  | { source: "hosted"; fresher: true; content: string; lastVerified: string }
  | { source: "local"; reason: "no_key" | "unreachable" | "snapshot_current" | "no_pack" | "refused" };

/**
 * Fetch the CURRENT pack for `platform` if entitled AND it is fresher than the
 * client's local snapshot. Returns {source:"local", reason} in every other case —
 * the caller then reads its build-time mirror. NEVER throws.
 */
export async function fetchCurrentPack(platform: string, localLastVerified: string | null, deps: HostedDeps = {}): Promise<PackResult> {
  const key = getApiKey(deps);
  if (!key) return { source: "local", reason: "no_key" };
  const warn = deps.warn ?? ((m: string) => console.error(m));
  const f = deps.fetchImpl ?? fetch;
  const q = localLastVerified ? `?since=${encodeURIComponent(localLastVerified)}` : "";
  try {
    const res = await f(`${apiBase(deps)}/v1/packs/${encodeURIComponent(platform)}${q}`, { headers: { authorization: `Bearer ${key}` } });
    if (res.status === 401 || res.status === 403) return { source: "local", reason: "refused" };
    if (res.status === 404) return { source: "local", reason: "no_pack" };
    if (!res.ok) {
      warn(`[forsvn] hosted pack fetch failed (${res.status}); using local snapshot.`);
      return { source: "local", reason: "unreachable" };
    }
    const body = (await res.json()) as { fresher?: boolean; content?: string; last_verified?: string };
    // a hosted pack with no last_verified can't be claimed "current" — fall back to local
    if (!body.fresher || !body.content || !body.last_verified) return { source: "local", reason: "snapshot_current" };
    return { source: "hosted", fresher: true, content: body.content, lastVerified: body.last_verified };
  } catch {
    warn(`[forsvn] hosted backend unreachable; using local snapshot (no run impact).`);
    return { source: "local", reason: "unreachable" };
  }
}

export type ContextResult = { source: "hosted"; context: Record<string, string> } | { source: "local"; reason: "no_key" | "unreachable" | "refused" };

/** Pull the account's brand-context bundle for injection, or signal local fallback. */
export async function fetchContextBundle(deps: HostedDeps = {}): Promise<ContextResult> {
  const key = getApiKey(deps);
  if (!key) return { source: "local", reason: "no_key" };
  const warn = deps.warn ?? ((m: string) => console.error(m));
  const f = deps.fetchImpl ?? fetch;
  try {
    const res = await f(`${apiBase(deps)}/v1/context?bundle=1`, { headers: { authorization: `Bearer ${key}` } });
    if (res.status === 401 || res.status === 403) return { source: "local", reason: "refused" };
    if (!res.ok) {
      warn(`[forsvn] hosted context fetch failed (${res.status}); using local canonical docs.`);
      return { source: "local", reason: "unreachable" };
    }
    const body = (await res.json()) as { context?: Record<string, string> };
    return { source: "hosted", context: body.context ?? {} };
  } catch {
    return { source: "local", reason: "unreachable" };
  }
}

/** Best-effort meter of a hosted-backend action. Never throws; null on any failure. */
export async function meter(action: string, units: number | undefined, deps: HostedDeps = {}): Promise<{ remaining: number; overage: number } | null> {
  const key = getApiKey(deps);
  if (!key) return null;
  // never POST garbage to usage accounting: blank action, or non-finite / negative units
  if (!action.trim()) return null;
  if (units !== undefined && (!Number.isFinite(units) || units < 0)) return null;
  const f = deps.fetchImpl ?? fetch;
  try {
    const res = await f(`${apiBase(deps)}/v1/meter`, { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify({ action, units }) });
    if (!res.ok) return null;
    const body = (await res.json()) as { remaining: number; overage: number };
    return { remaining: body.remaining, overage: body.overage };
  } catch {
    return null;
  }
}

/** The cross-session metrics feed packet (measure-results write-back). */
export interface MetricsPayload {
  platform: string;
  what_worked?: string;
  what_failed?: string;
  numbers?: Record<string, number | string>;
}

/**
 * Best-effort POST of a measured result to the cross-session metrics feed
 * (`/v1/metrics`). The LOCAL write-back (`.forsvn/performance/<channel>.tsv`) is
 * the source of truth; this is the hosted mirror so a result compounds across
 * machines/sessions for an entitled account. Same open-core invariant as `meter`:
 * no key → null (inert, no network, no nag); API error → null; NEVER throws and
 * NEVER blocks the skill's local write-back.
 */
export async function postMetrics(payload: MetricsPayload, deps: HostedDeps = {}): Promise<{ ok: true } | null> {
  const key = getApiKey(deps);
  if (!key) return null;
  // never POST garbage to the feed: a platform key is the one required field
  if (!payload?.platform?.trim()) return null;
  const f = deps.fetchImpl ?? fetch;
  try {
    const res = await f(`${apiBase(deps)}/v1/metrics`, { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return null;
    return { ok: true };
  } catch {
    return null;
  }
}

export interface HostedStatus {
  entitled: boolean;
  plan?: string;
  balance?: { included: number; used: number; remaining: number; overage: number };
}

/** "Am I a Pro client right now?" — for the legibility narration + `doctor`. */
export async function status(deps: HostedDeps = {}): Promise<HostedStatus> {
  const key = getApiKey(deps);
  if (!key) return { entitled: false };
  const f = deps.fetchImpl ?? fetch;
  try {
    const res = await f(`${apiBase(deps)}/v1/me`, { headers: { authorization: `Bearer ${key}` } });
    if (!res.ok) return { entitled: false };
    const body = (await res.json()) as { plan?: string; balance?: HostedStatus["balance"] };
    return { entitled: true, plan: body.plan, balance: body.balance };
  } catch {
    return { entitled: false };
  }
}
