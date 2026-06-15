---
title: Extract-Service — Worked Example
lifecycle: canonical
status: stable
produced_by: extract-service
load_class: EXAMPLE
---

# Worked Example — Sandbox Creation Across GitHub Actions Handlers

An annotated end-to-end run. TypeScript. The motivating case from IDEA-3 § 1: "I'm copy-pasting this sandbox-creation logic across GitHub Actions handlers."

**Invocation:** `/extract-service src/actions/`

---

## The codebase before

Three action handlers each create a Vercel sandbox to run a preview build. The 30-ish lines of *how* are copy-pasted in all three.

`src/actions/deploy-preview.ts`:

```ts
export async function deployPreview(pr: PullRequest) {
  if (!pr.labels.includes("preview")) return;            // ← decision
  const client = new Sandbox({ token: process.env.VERCEL_TOKEN });
  const sb = await client.create({ runtime: "node" });
  await sb.uploadDir(pr.workdir);
  let ready = false;
  for (let i = 0; i < 30 && !ready; i++) {
    ready = (await sb.status()).state === "ready";
    if (!ready) await sleep(2000);
  }
  if (!ready) throw new Error("sandbox timeout");
  await commentOnPR(pr, `Preview: ${sb.url}`);            // ← decision
}
```

`src/actions/run-e2e.ts` — same sandbox block, then `await runPlaywright(sb.url)` instead of commenting.

`src/actions/screenshot-diff.ts` — same sandbox block, but the poll loop runs `60` iterations (someone bumped the timeout here only — **drift**), then `await captureScreens(sb.url)`.

---

## Layer 1 — scanner-agent

```markdown
## Extraction Scan

### Repeated Mechanics
Vercel sandbox lifecycle — construct client, create node sandbox, upload working dir,
poll status until `ready` or timeout. src/actions/deploy-preview.ts:3-12 (representative copy).

### Caller Inventory
| # | Caller | Copy fidelity | Caller-local variation |
|---|--------|---------------|------------------------|
| 1 | deploy-preview.ts:deployPreview | identical | poll budget 30 |
| 2 | run-e2e.ts:runE2E | identical | poll budget 30 |
| 3 | screenshot-diff.ts:screenshotDiff | drifted | poll budget 60 |

### Layer Split
Shared `how` (extract → service): client construction, create(), uploadDir(), the poll-until-ready loop, timeout→error.
Caller-resident `why/when` (must NOT move): the `preview` label guard; the poll budget value; what to do with `sb.url` (comment / run e2e / screenshot).

### Drift Findings
Caller 3 polls 60 iterations vs 30 in callers 1-2. Either an intentional longer budget for
screenshot jobs or an unreviewed local bump. NOT auto-normalized — surfaced for the planner.

### Extraction Verdict
- Caller count: 3 · Threshold (G6, ≥2): PASS · Layer split (G7): CLEAN
- Recommendation: proceed to planner
```

The drift matters: poll budget differs. The scanner does **not** decide it should be uniform — it makes it the planner's problem.

## Layer 2a — planner-agent

The poll budget is caller-local variation → it becomes a **data param** (`maxPollAttempts`), so caller 3 keeps its 60 and callers 1-2 keep their 30. No behavior change, no flag-bag.

```markdown
## Migration Plan

### Service Interface
Location: src/services/sandbox.ts
```ts
export async function createReadySandbox(params: {
  workdir: string;
  runtime: "node" | "python";
  maxPollAttempts?: number;        // default 30 — data param; carries caller variation
}): Promise<
  | { ok: true; url: string }
  | { ok: false; error: "timeout" | "create_failed" }
>;
```
- `maxPollAttempts` carries the poll-budget difference as data — NOT a `mode` flag.
- Structured return: callers 1-2 currently `throw` on timeout; the service returns `{ok:false}`
  and each caller throws at the call site, so caller-local error behavior is preserved.

### Drift Resolutions
| Drift | Resolution | Behavior change? |
|-------|------------|------------------|
| Caller 3 polls 60, callers 1-2 poll 30 | `maxPollAttempts` param; caller 3 passes 60, others omit (default 30) | No — every caller keeps its current budget |

### Caller Migration Steps
| Step | Caller | Verification | Rollback |
|------|--------|--------------|----------|
| 0 | extract src/services/sandbox.ts | tsc + build | backup commit |
| 1 | deploy-preview.ts (identical, has tests) | vitest src/actions/deploy-preview.test.ts + tsc + build | revert step 1 |
| 2 | run-e2e.ts (identical, has tests) | vitest src/actions/run-e2e.test.ts + tsc + build | revert step 2 |
| 3 | screenshot-diff.ts (drifted, last) | vitest src/actions/screenshot-diff.test.ts + tsc + build | revert step 3 |

### Estimated Blast Radius
3 callers · 1 new file · 3 touched files · fits one session.
```

Order: the two identical, test-covered callers first; the drifted caller last, once the interface is proven.

## Operator-approval gate

```
Apply this migration? [y/N]
  · new service: src/services/sandbox.ts
  · 3 callers migrated one at a time, verified after each
  · backup commit created first; each step revertible
> y
```

`N` here would ship the Migration Plan as a `DONE` plan-only artifact. The operator said `y`.

## Layer 2b — migration-agent

```markdown
## Applied Migration

### Backup
- Backup commit: `a1b9f02`

### Per-Caller Results
| Step | Caller | Status | Verification | Notes |
|------|--------|--------|--------------|-------|
| 0 | src/services/sandbox.ts | CREATED | tsc PASS, build PASS | createReadySandbox exported |
| 1 | deploy-preview.ts | MIGRATED | vitest 4/4 PASS, tsc PASS, build PASS | label guard + commentOnPR untouched |
| 2 | run-e2e.ts | MIGRATED | vitest 3/3 PASS, tsc PASS, build PASS | runPlaywright untouched |
| 3 | screenshot-diff.ts | MIGRATED | vitest 2/2 PASS, tsc PASS, build PASS | passes maxPollAttempts: 60 |

### Stop Point
All 3 callers migrated.

### Behavior-Preservation Notes
All three callers covered by tests exercising the sandbox path; each verified green after its own step.
```

`deploy-preview.ts` after migration — the *how* is gone, the *why/when* is byte-for-byte:

```ts
export async function deployPreview(pr: PullRequest) {
  if (!pr.labels.includes("preview")) return;            // ← unchanged decision
  const sb = await createReadySandbox({ workdir: pr.workdir, runtime: "node" });
  if (!sb.ok) throw new Error(`sandbox ${sb.error}`);     // ← caller still owns the throw
  await commentOnPR(pr, `Preview: ${sb.url}`);            // ← unchanged decision
}
```

## Layer 3 — critic-agent

```markdown
## Extraction Review

### Critical Gates Compliance
G1 Preserve behavior PASS · G2 Small steps PASS · G3 Conventions PASS · G4 Verify each PASS
G5 Rollback PASS · G6 Threshold PASS (3 callers) · G7 Two-layer purity PASS · G8 Baseline-green PASS

### Service-Design Quality
Explicit params PASS · Structured returns PASS · Composability PASS · No silent drift normalization PASS
(caller 3's 60-poll budget preserved via the maxPollAttempts data param — not normalized)

### Verdict: PASS
```

## What landed

- One service: `src/services/sandbox.ts`. The sandbox *how* has one home.
- Three callers, ~30 lines shorter each, every *why/when* decision intact.
- The drift was preserved as data (a param), not silently normalized — caller 3 still polls longer, on purpose, visibly.
- A future bug fix in the poll loop is now a one-file change.

Artifact: `docs/forsvn/artifacts/product/extract-service/2026-05-20-extract-service-sandbox.md`, status `DONE`.
