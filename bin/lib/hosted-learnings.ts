// hosted-learnings — the DORMANT hosted-mirror skeleton for the portable learning
// ledger (L6, gated G3). This is an INTERFACE ONLY. It is wired to nothing.
//
// ┌─ WHY THIS EXISTS ──────────────────────────────────────────────────────────┐
// │ L6 ships the local, portable ledger (lib/portable-ledger.ts) — export/import │
// │ a bundle the operator carries BY HAND. A future hosted mirror would let an   │
// │ entitled account sync that bundle across machines. We commit the SHAPE of    │
// │ that boundary now so the local path and the (future) hosted path are         │
// │ designed against one interface — but the hosted path stays OFF.              │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// HARD, NON-NEGOTIABLE INVARIANTS (a test pins them — do not weaken):
//   • DORMANT. `G3_HOSTED_LEDGER_ENABLED` is a hard `false` CONSTANT. It is NOT
//     read from config, NOT read from env, NOT a feature flag. There is no code
//     path in this file that sets it true. Flipping it is a deliberate source
//     edit in a future G3 PR, reviewed as such — never a runtime toggle.
//   • NO NETWORK. This file performs ZERO network calls. It does not import fetch,
//     does not construct a URL, does not touch a socket. Every method short-
//     circuits on the dormant constant and returns a marker. The local ledger
//     path (portable-ledger.ts) is likewise pure file I/O — nothing here or there
//     phones home.
//   • NO BILLING / NO SPEND. There is no payment integration, no metering, no
//     credit decrement, no checkout. Sync is the only thing the future surface
//     would do, and even that is OFF. Nothing here can charge, meter, or spend.
//   • NEVER BLOCKS. Dormant by construction: a caller asking "can I sync?" always
//     gets a clean `{ available: false }` and proceeds with the local bundle. The
//     review/decision path never touches this file.
//
// Contrast with bin/lib/hosted-api.ts (the open-core PACK/CONTEXT soft-client):
// that one DOES make network calls when an entitlement key is present. This file
// is intentionally a level below that — a SKELETON, not a soft-client. When G3
// ships, the real implementation lives here behind the (then-flipped) constant
// and goes through the same human-reviewed gate as any spend/publish surface.

/**
 * The G3 gate. A hard `false`. The hosted learning-mirror is DORMANT.
 *
 * This is a compile-time constant on purpose. It is never assigned from config,
 * env, or any runtime input — there is no setter and no flag that flips it. The
 * dormant surface exists so the boundary is designed; turning it on is a future,
 * separately-reviewed source change (G3), not a deploy-time switch.
 */
export const G3_HOSTED_LEDGER_ENABLED = false as const;

/** Why the hosted mirror is unavailable. Always `dormant` in this build. */
export type DormantReason = "dormant";

/** A method's result while the surface is dormant: never the data, always a
 *  marker the caller uses to fall back to the local bundle. */
export interface DormantResult {
  available: false;
  reason: DormantReason;
  /** A one-line operator-facing explanation. No spend/billing language. */
  detail: string;
}

const DORMANT: DormantResult = {
  available: false,
  reason: "dormant",
  detail:
    "Hosted learning-mirror is dormant (G3, not enabled in this build). Use the local portable bundle: " +
    "`forsvn learnings export` / `forsvn learnings import`.",
};

/**
 * The interface a future hosted mirror would implement. Documented here so the
 * local ledger and the (future) hosted path share one shape. Every method is
 * dormant in this build: it returns DORMANT without any network or spend.
 */
export interface HostedLedgerMirror {
  /** "Is the hosted mirror available to this account right now?" — always false. */
  status(): DormantResult;
  /** Would push the local bundle to the account's mirror. Dormant: no-op. */
  push(): DormantResult;
  /** Would pull the account's mirror as a bundle. Dormant: no data. */
  pull(): DormantResult;
}

/**
 * The dormant skeleton. Construct it freely — it holds no key, opens no socket,
 * spends nothing. While `G3_HOSTED_LEDGER_ENABLED` is false (always, in this
 * build) every method returns the dormant marker.
 */
export class DormantHostedLedger implements HostedLedgerMirror {
  status(): DormantResult {
    return guard();
  }
  push(): DormantResult {
    return guard();
  }
  pull(): DormantResult {
    return guard();
  }
}

/**
 * The single chokepoint every method routes through. While the constant is false
 * it returns the dormant marker — no network, no spend, no block. The `if (... )`
 * is unreachable today by construction; it is the explicit, reviewed seam a
 * future G3 PR would replace with the real implementation (and only then).
 */
function guard(): DormantResult {
  if (G3_HOSTED_LEDGER_ENABLED) {
    // Intentionally unreachable in this build. A future G3 implementation lands
    // here behind the (then-flipped) constant and is reviewed as a spend/sync
    // surface. Until then: dormant.
    throw new Error("hosted learning-mirror not implemented — gated G3, dormant.");
  }
  return DORMANT;
}

/** Factory mirroring hosted-api's accessor style. Always returns the dormant
 *  skeleton — there is no entitled variant in this build. */
export function hostedLedger(): HostedLedgerMirror {
  return new DormantHostedLedger();
}
