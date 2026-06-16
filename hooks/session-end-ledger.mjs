#!/usr/bin/env node
/**
 * SessionEnd hook: append a `session_end` event to the T0 local ledger.
 *
 * Pairs with session-start-model.mjs's `session_start` to give the cadence
 * instrument session liveness (active days/week). Local-only, no network — the
 * ledger is a log file the user owns (see ../references/event-schema.md).
 *
 * Contract: NEVER breaks session end. Exit 0 always; appendEvent swallows all
 * failures (unwritable path, missing dir) by design.
 */

import { appendEvent } from "../bin/lib/ledger.mjs";

try {
  appendEvent({ event: "session_end" });
} catch {
  // Never block session end.
}
process.exit(0);
