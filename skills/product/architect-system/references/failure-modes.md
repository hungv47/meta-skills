# Failure Mode Analysis

## Criticality Classification

Classify each failure scenario identified during architecture validation.

| Criticality | Definition | Required Handling |
|-------------|-----------|-------------------|
| **CRITICAL** | Data loss, security breach, payment error | Explicit error handling, monitoring alert, automated test |
| **HIGH** | Feature broken, user blocked | Error recovery path, manual fallback documented |
| **MEDIUM** | Degraded experience, slow response | Graceful degradation, retry logic |
| **LOW** | Cosmetic, non-blocking | Log for next cycle |

## Error Tracing Table

For each operation that can fail, trace the full chain. The point is to make silent failures visible — if a failure has no handling, no test, and no user-facing message, it will bite you in production.

```
OPERATION | WHAT CAN FAIL | HANDLED? | USER SEES
-----------------------|----------------------------|----------|--------------------
[e.g., Create invoice] | Database connection timeout | ? | ?
 | Duplicate key conflict | ? | ?
 | External API returns 429 | ? | ?
 | Input validation fails | ? | ?
```

For each row:
- **HANDLED = No** → this is a gap. Specify the fix: retry, degrade, or surface an error.
- **USER SEES = nothing/500** → this is a silent failure. Silent failures are the most dangerous because nobody knows they're happening until data is corrupted.

## Shadow Path Tracing

Every data flow has a happy path and three shadow paths. Trace all four because they cause different bugs:

| Path | What It Means | Typical Bug |
|------|--------------|-------------|
| **Happy** | Valid input, everything works | — |
| **Nil/missing** | Input is absent entirely | Null reference crash, unhandled exception |
| **Empty/zero-length** | Input is present but empty (`""`, `[]`, `0`) | Silent writes of invalid data, orphan records, division by zero |
| **Upstream error** | Dependency fails (timeout, 5xx, malformed response) | Cascading failure, stale cache served as fresh, partial writes |

Nil and empty are distinct problems. A nil user ID crashes at the point of use. An empty user ID passes validation, writes to the database, and creates an orphan record nobody can find until a customer complains. Trace both.
