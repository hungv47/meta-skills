# Interaction Edge Cases

When validating architecture (Step 4), check each user-facing interaction against these categories. The goal is not to check every item mechanically — it's to think adversarially about what real users will do that the happy path doesn't cover.

## Categories

### Form & Input Submission
- **Double action** — User clicks submit twice (or hits Enter while click is processing). Does the system create two records?
- **Stale state** — User opened the form 30 minutes ago. The underlying data changed. What happens on submit?
- **Partial completion** — User fills 3 of 5 fields and navigates away. Is work lost? Should it be saved as draft?

### Async Operations
- **User leaves mid-operation** — A long-running process starts. User closes tab or navigates away. Does the operation complete? Can they find the result later?
- **Timeout** — The operation takes longer than expected. What does the user see? Is there a retry path?
- **Duplicate trigger** — User triggers the same async operation twice before the first completes. Does the system handle idempotency?

### Lists & Data Display
- **Zero results** — Empty state. What does the user see? Is there a clear path to populate data?
- **Large result sets** — What happens with 10,000 results? Is there pagination, virtual scrolling, or does the page crash?
- **Data changes mid-view** — Another user or process modifies data while it's being displayed. Stale reads?

### State & Session
- **Session expiry during work** — User is mid-edit and their session expires. Is unsaved work preserved?
- **Concurrent access** — Two users edit the same record simultaneously. Last-write-wins? Conflict resolution? Optimistic locking?
- **Back button / browser navigation** — User hits back after a state-changing action. Does the UI reflect reality?

### External Dependencies
- **Partial failure** — An operation touches 3 external services. Service 2 fails after service 1 succeeded. What's the state?
- **Degraded dependency** — An external service responds but slowly (5s instead of 200ms). Does the UI degrade gracefully or hang?

## How to Use

For each critical user flow in the architecture, pick the 2-3 categories most relevant to that flow and verify handling exists. Not every category applies to every flow — a pure API with no UI doesn't need form submission checks. Use judgment, not a mechanical checklist.
