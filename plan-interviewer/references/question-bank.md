# Question Bank for Plan Interviews

Extended collection of non-obvious, probing questions organized by domain. Use these to surface hidden complexity and assumptions.

## Data & State Management

### Persistence
- If the app crashes mid-save, what state should we recover to?
- Should this data survive a browser refresh? A logout? A device switch?
- What's the source of truth—client optimistic state or server confirmed state?
- If local and server state conflict, who wins? Can we show both?

### Synchronization
- What's the maximum acceptable staleness for this data?
- If two tabs are open and one makes a change, should the other update?
- During offline mode, what operations should queue vs fail immediately?
- How do we handle "last write wins" conflicts for collaborative data?

### Caching
- What invalidates this cache? Time? Events? User actions?
- If cache is poisoned with bad data, how do we recover?
- Should we prefetch? What's the cost of wrong prefetch predictions?
- What's the memory budget for client-side caching?

## Error Handling & Recovery

### Failure Modes
- What's the blast radius of this component failing?
- Should errors in this feature degrade gracefully or fail loudly?
- If a dependency times out, do we retry, fallback, or error?
- What's the difference between "couldn't load" and "nothing to show"?

### User Recovery
- After an error, what's the minimum action user needs to retry?
- Should we auto-retry in background or require explicit user action?
- If partial data saved, do we show what was saved or hide until complete?
- Can user recover from their mistake without contacting support?

### System Recovery
- If this job fails at step 5 of 10, do we restart from 1 or resume from 5?
- Should failed operations be logged for manual intervention?
- What alerts fire? Who gets paged? At what threshold?
- How do we know the fix worked without causing the same failure?

## User Experience Deep Dives

### Cognitive Load
- What's the user's mental model? Are we matching or fighting it?
- How many new concepts does this introduce? Can we reduce?
- What does the user need to remember vs what should the system remember?
- If user doesn't read any instructions, will they still succeed?

### Feedback Loops
- How long until user knows their action worked?
- If operation takes 30 seconds, what do they see second-by-second?
- What's the "undo" story? Time-limited? Action-limited? None?
- How do we celebrate success without being annoying?

### Progressive Disclosure
- What's the simplest version that provides value?
- Which power features should be hidden from new users?
- How does complexity reveal itself as user gains experience?
- What shortcuts exist for power users?

### Accessibility
- What's the keyboard-only flow?
- How does this read in a screen reader?
- Does this animation respect reduced-motion preference?
- What's the touch target size? Is it 44pt minimum?
- Does color convey meaning that's lost for colorblind users?

## Security & Trust

### Input Validation
- What if this input is 10MB? 1GB?
- What characters could break this? SQL injection? XSS? Template injection?
- If validation differs client/server, which is authoritative?
- How do we handle valid-but-suspicious inputs?

### Authorization
- Can a user access their own historical data if we revoke access now?
- What happens if permissions change mid-session?
- Should we fail open or fail closed if auth service is unavailable?
- How do we prevent privilege escalation through API manipulation?

### Data Protection
- Where does this data exist? At rest? In transit? In logs? In backups?
- If we need to delete a user's data, can we find it all?
- What's the data retention policy? Is it enforced or hoped-for?
- Could aggregated data reveal individual information?

## Performance & Scale

### Load Characteristics
- What's the expected p50 vs p99 usage pattern?
- Is this read-heavy or write-heavy? What's the ratio?
- Are there predictable spikes? Black Friday? Monday morning?
- What happens at 10x expected load? 100x?

### Resource Management
- What's the memory footprint of this feature?
- Are we creating event listeners that need cleanup?
- Does this create unbounded growth anywhere?
- What happens if this runs for 24 hours straight?

### Perceived Performance
- What can we show immediately vs what must we wait for?
- Is there a skeleton/placeholder that reduces perceived latency?
- Can we do optimistic updates safely here?
- What's the acceptable jank budget for this interaction?

## Integration & Dependencies

### External Services
- What's the SLA of each dependency? Are we weaker than our weakest link?
- If this API changes, how do we detect it before users report issues?
- Is there a fallback if primary service is unavailable?
- What data from external services do we cache vs fetch fresh?

### Internal APIs
- Are we depending on undocumented/internal behavior that could change?
- What version compatibility do we need to maintain?
- Is this creating a circular dependency?
- Should this be synchronous or should we use events/queues?

### Data Contracts
- What's the schema evolution strategy?
- How do we handle unknown fields from newer API versions?
- What's the migration path for schema changes?
- Are we validating everything or trusting internal services?

## Business Logic Edge Cases

### Time & Scheduling
- What timezone is "today"? User's? Server's? UTC?
- What happens at daylight saving transitions?
- If user schedules something for Feb 30, what happens?
- How do we handle "end of month" for months of different lengths?

### Money & Quantities
- What's the precision? Floating point errors acceptable?
- What currency are we assuming? What about multi-currency?
- How do we handle refunds, partial payments, credits?
- Tax calculation timing—at cart, checkout, or fulfillment?

### Multi-Entity Scenarios
- What if user belongs to multiple orgs? Which context applies?
- Can one action affect multiple users? Who gets notified?
- What's the hierarchy? Can child override parent settings?
- If entity is deleted, what happens to related data?

## Testing & Verification

### Test Strategy
- What's the minimum test that would have caught the last bug?
- How do we test the unhappy path without breaking production?
- Can this be tested without external dependencies?
- What's the cost of a false positive test failure?

### Observability
- What metrics prove this feature is working?
- What log line indicates success vs failure?
- How do we distinguish user error from system error in metrics?
- What's the debug information we wish we had during last incident?

### Rollout
- Can we feature flag this? For whom?
- What's the rollback plan? How fast can we execute it?
- How do we detect problems? Manual monitoring or automated alerts?
- What's "done"? When can we remove the feature flag?

## Mobile & Cross-Platform

### Device Constraints
- What happens on 3-year-old phone with 2GB RAM?
- How does this behave on 3G network?
- What's the battery impact of this feature?
- Does this work in battery saver mode?

### Platform Behavior
- Does this conflict with system gestures?
- How does this behave when app is backgrounded?
- What happens when phone call interrupts flow?
- Does deep linking work correctly?

### Responsive Design
- What's the minimum viewport this should work on?
- Does touch target size change at breakpoints?
- What features disappear on mobile? Is that intentional?
- How do landscape and portrait modes differ?

## Collaboration & Multi-User

### Concurrency
- What if two users edit the same thing simultaneously?
- Do we need operational transforms or last-write-wins?
- How do we prevent double-submits?
- What's the locking strategy? Optimistic? Pessimistic?

### Notifications
- Who needs to know this happened? Immediately or batched?
- Can users configure notification preferences for this?
- What if notification delivery fails?
- How do we prevent notification fatigue?

### Permissions & Sharing
- What's the default visibility?
- Can viewers become editors? Can they change others' permissions?
- What happens to shared resources when owner leaves?
- How do we handle "view as user X" for debugging?

## Intent Alignment & Should-Want Detection

Questions designed to surface the gap between what users say they want and what they actually need. Use these when you detect should-want framing or when confidence in a dimension plateaus.

### Past Behavior & Failed Attempts
- What are you/your users doing today to solve this problem?
- What specifically frustrates you about the current approach?
- Have you tried to build this before? What happened?
- Have you used an existing tool for this? What was wrong with it?
- What manual workaround exists today? How often is it used?
- When did this problem first bother you enough to want to fix it?

### Daily Use Visualization
- Walk me through a typical day where you'd use this feature.
- What triggers you to open this? What are you doing right before?
- After using this, what do you do next?
- How often would you realistically use this? Daily? Weekly? When something breaks?
- If this feature had a usage counter, what number would disappoint you after a month?

### Forced Tradeoffs
- If you could only keep 2 of these features, which 2 and why?
- Would you rather have this fast and simple, or complete and complex?
- If building this takes twice as long as expected, what do you cut first?
- What's the one thing this absolutely must do on day one?
- If you had to launch with half the features, which half?

### Success Criteria Grounding
- If this ships and works perfectly, what's the first thing you'd notice is different?
- How would you know this is working without looking at analytics?
- What does your user do differently after this exists?
- What complaint or request stops coming in once this ships?
- Six months after launch, what makes you glad you built this?

### The "Why" Chain
- Why this approach specifically? (Then ask "why" to the answer)
- Why now? What changed that makes this urgent?
- Why build vs buy? What's unique about your situation?
- Why this scope? What would a version with half the scope miss?
- Why this audience first? Who else could benefit and why not them?

### Depth Probes
Use when answers feel rehearsed, buzzword-heavy, or disconnected from specific experiences.
- Can you give me a specific example of when this problem happened?
- Who specifically complained about this? What did they say?
- If I asked your users directly, would they describe the problem the same way?
- What's the most embarrassing version of this feature that would still solve the problem?
- Forget best practices for a moment — what do YOU actually want this to do?
