// Shared IO helpers — single source for paths the harness uses.
// Resolves paths relative to the agent-skills umbrella root (where .agents/ lives).

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, appendFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

// Walk up from this file until we find the umbrella root (the dir that contains .agents/).
// Falls back to cwd if nothing matches — that case is operator error and logged loudly.
export function umbrellaRoot(): string {
  let dir = dirname(new URL(import.meta.url).pathname);
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, ".agents")) || existsSync(join(dir, ".gitmodules"))) return dir;
    dir = dirname(dir);
  }
  // Couldn't locate umbrella root from script path — fall back to cwd but tell the operator.
  // Silent fallback would cause hard-to-debug failures downstream (paths resolve wrong).
  console.error(`[harness] WARNING: could not locate umbrella root from ${dirname(new URL(import.meta.url).pathname)}; falling back to cwd ${process.cwd()}.`);
  return process.cwd();
}

export const ROOT = umbrellaRoot();
export const HARNESS_DIR = join(ROOT, ".agents", "skill-artifacts", "meta", "records", "harness");
export const EVENTS_DIR = join(HARNESS_DIR, ".events");
export const INPUTS_DIR = join(HARNESS_DIR, "inputs");
export const BASELINE_DIR = join(HARNESS_DIR, "baseline");
export const MARKER_PATH = join(HARNESS_DIR, ".active");
export const LOG_PATH = join(HARNESS_DIR, ".harness.log");

export function ensureDirs() {
  for (const d of [HARNESS_DIR, EVENTS_DIR, INPUTS_DIR, BASELINE_DIR]) {
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
  }
}

export function readJson<T = unknown>(path: string): T | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

export function writeJson(path: string, data: unknown) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function appendJsonl(path: string, data: unknown) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  appendFileSync(path, JSON.stringify(data) + "\n");
}

export function readJsonl<T = unknown>(path: string): T[] {
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf8");
  return raw
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line) as T;
      } catch {
        return null;
      }
    })
    .filter((x): x is T => x !== null);
}

export function fileStats(path: string): { exists: boolean; chars: number; lines: number; bytes: number } {
  if (!existsSync(path)) return { exists: false, chars: 0, lines: 0, bytes: 0 };
  try {
    const content = readFileSync(path, "utf8");
    return {
      exists: true,
      chars: content.length,
      lines: content.split("\n").length,
      bytes: statSync(path).size,
    };
  } catch {
    return { exists: false, chars: 0, lines: 0, bytes: 0 };
  }
}

export function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).map((f) => join(dir, f));
}

export function logDebug(msg: string) {
  // Hook-safe logging — never throws, never blocks.
  try {
    if (!existsSync(HARNESS_DIR)) mkdirSync(HARNESS_DIR, { recursive: true });
    appendFileSync(LOG_PATH, `[${new Date().toISOString()}] ${msg}\n`);
  } catch {
    // Swallow — debug logging must never break a hook.
  }
}

export function relToRoot(p: string): string {
  const abs = resolve(p);
  if (abs.startsWith(ROOT + "/")) return abs.slice(ROOT.length + 1);
  return abs;
}
