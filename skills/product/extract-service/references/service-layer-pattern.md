---
title: Extract-Service — Service Layer Pattern
lifecycle: canonical
status: stable
produced_by: extract-service
load_class: PLAYBOOK
---

# Service Layer Pattern

**Load when:** scanner-agent draws the layer line; planner-agent designs the interface; critic-agent checks two-layer purity (G7).

The pattern this skill extracts toward — the split between orchestration that carries domain meaning and reusable mechanics that do not.

---

## The two layers

A codebase that does real work has two kinds of code tangled together:

| Layer | Owns | Answers | Example |
|-------|------|---------|---------|
| **Actions / callers** | orchestration + domain rules | *why* and *when* | "Deploy the PR branch when the label is `preview`; on failure, comment on the PR." |
| **Service** | operational mechanics | *how* | "Create a sandbox, upload the working directory, poll until ready, return a URL or an error." |

Callers decide. The service executes. The same service is called by many callers, each making its own decision about *why* and *when* to call it.

**The duplication this skill removes is always in the *how* layer.** When five handlers each contain the same 30 lines of "create a sandbox and poll it," that *how* should be one service function. The five different reasons those handlers create a sandbox stay in the five handlers.

## Itemized ownership

When a line is genuinely ambiguous, this is the ledger — the same *decide vs execute* rule, applied to the concerns that leak across the line most often:

| Concern | Owner | Why |
|---------|-------|-----|
| Business rules, eligibility, "should this run at all" | Caller | Domain decision; differs per caller |
| Authorization — who is allowed to do this | Caller | Policy. The service must never know *who* called it |
| State transitions — mark paid, advance status, flip a flag | Caller | The transition carries domain meaning |
| Re-attempting the whole operation, and how that is surfaced to the user | Caller | User-facing policy, not a mechanic |
| What a failure *means* here — classify it, escalate, log, swallow | Caller | One error, different responses per caller |
| SDK / client construction, auth wiring, request shaping | Service | Identical mechanics for every caller |
| Transient-failure retry, backoff, polling, readiness checks | Service | Mechanical reliability; carries no domain meaning |
| Provider / API / filesystem / network calls | Service | The operational work itself |
| Mapping a raw failure into a structured result | Service | Reports *what happened*; the caller decides what to do next |

Two pairs leak most often. **Retry:** transient-failure retry *inside* one operation is a service mechanic; re-attempting the *whole* operation, and telling the user, is caller policy. **Error:** mapping a raw error to a structured result is the service's job; deciding what that failure *means* for this caller is the caller's.

## Drawing the layer line

For each line in the repeated block, ask: **does this line decide, or does this line execute?**

- *Decides* — picks a resource, selects a branch, applies a policy, chooses what to do with a result, decides whether to run at all → **caller-resident `why/when`. Do not extract.**
- *Executes* — constructs a client, shapes a request, runs a retry loop, reads/writes a file, maps an error to a result → **shared `how`. Extract.**

**The flag test.** If extracting a line would force the service to take a parameter whose *only* job is to branch behavior — `mode`, `callerType`, `isLegacy`, `policy` — that line is a decision. It belongs to the caller. A parameter that carries *data* (a URL, a path, a timeout value, an id) is fine. A parameter that carries a *branch* is a layer leak.

> A service with `if (mode === 'fast') … else …` has not removed the duplication. It has moved both copies inside one function. That is a **G7 failure**.

## What a good service interface looks like

**Explicit params.** Every value that differs across callers is a named parameter. The service reads no globals, no ambient config, no module-level mutable state. Given the same params, it does the same thing — every time, for every caller.

```ts
// good — data params, structured return, no branching flags
export async function createSandbox(params: {
  workdir: string;
  runtime: "node" | "python";   // data: which runtime, not "which caller"
  timeoutMs?: number;            // data: with a default
}): Promise<
  | { ok: true; url: string }
  | { ok: false; error: SandboxError }
>;
```

**Structured returns over thrown control flow.** If callers currently branch on success vs failure, the service returns a structured result — `{ ok: true, … }` or `{ ok: false, error }` — rather than throwing. The caller keeps owning *what to do next*; the service just reports *what happened*. (If the codebase's convention is to throw, match it — G3 — but do not make callers catch a new exception type they didn't catch before.)

**One job.** The service function does one operational thing. A function that creates a sandbox *and* decides whether to create it *and* notifies someone afterward is three jobs and two layer leaks.

**Composability over monoliths.** Prefer several small service functions a caller composes over one large function with many params. `uploadDir()` + `pollUntilReady()` a caller can call in sequence beats `createSandboxAndUploadAndPoll(everything)`.

**Capability block, not god service.** A service module is a set of small named capabilities — each with explicit data params and a structured return. It is not one `doEverything()` entry point that hides the steps behind a flag.

```ts
// god service — one entry point, a branching flag, an opaque return
sandbox.run({ workdir, mode: "deploy", notify: true }): Promise<any>;

// capability blocks — one job each, explicit params, a structured result each
createSandbox(p:  { workdir: string; runtime: Runtime }): Promise<Result<{ id: string }>>;
uploadDir(p:      { id: string; workdir: string }):       Promise<Result<void>>;
pollUntilReady(p: { id: string; timeoutMs?: number }):    Promise<Result<{ url: string }>>;
```

The caller composes the blocks it needs, in the order it needs, and keeps owning the `notify` decision and what to do on each block's failure. A caller that wants a different order, or skips `notify`, writes its own orchestration — it does not earn a new flag inside the service.

## What stays in the caller

Everything that makes the caller *that* caller:

- The decision to call the service at all (the guard, the label check, the feature flag).
- Which arguments to pass — the caller computes them from its domain context.
- What to do with the result — retry, comment, log, throw, ignore. A caller that swallows an error keeps swallowing it *at the call site*; the service still reports the error honestly.
- Any orchestration around the call — ordering relative to other steps, transactions, cleanup.

After a correct extraction you can read any caller top to bottom and still see its full *why/when* story. Only the *how* got shorter.

## Quick reference: extract or keep

| Code in the repeated block | Verdict |
|----------------------------|---------|
| SDK / client construction + auth wiring | Extract |
| Request building, response parsing | Extract |
| Retry loop, backoff, polling | Extract |
| File read/write, network I/O plumbing | Extract |
| Error → structured-result mapping | Extract |
| `if (plan === 'pro')` choosing a code path | Keep — domain decision |
| Which URL / id / branch to act on | Keep — caller computes it, passes it as a param |
| What to do when it fails (comment, retry, ignore) | Keep — caller's policy |
| Whether to run at all | Keep — caller's guard |

## Routing — is `extract-service` the right skill?

| You have… | Route to |
|-----------|----------|
| The same operational mechanics in **2+ callers**, and you want one shared service | `extract-service` — this skill |
| **One** caller with messy mechanics, or general dead code / AI slop / unused deps | `clean-code` — structural and code-level cleanup; it does not design service boundaries |
| **No system yet** — deciding where service boundaries *should* sit for a new build | `architect-system` — designs the blueprint, service layer included, before code exists |

`extract-service` acts on **existing** duplication across **≥2** callers. One caller → premature; return `NEEDS_CONTEXT` (G6). No code yet → that is an architecture decision, not an extraction.
