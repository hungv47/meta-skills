# Anti-Patterns — event-runofshow

7 patterns. The critic checks each before ship.

1. **Unbudgeted time.** Segment durations don't sum to the runtime, or there's no buffer. *Detect:* the timing column doesn't add up. *Fix:* budget to the minute; park 5–10% slack in Q&A.

2. **Orphan segment.** A segment with no named owner. *Detect:* an owner cell is blank or says "someone/we". *Fix:* exactly one driver per row.

3. **Uncued transition.** "Then we go to the demo" with no cue. *Detect:* a handoff with no verbal + tech cue + trigger. *Fix:* spec all three at every transition (the handoffs are where live breaks).

4. **Filler without a goal.** A segment that serves no outcome. *Detect:* the goal-service phrase is missing or vague. *Fix:* cut it or tie it to the one goal.

5. **No contingency.** A single point of failure with no fallback. *Detect:* demo/guest/tech/silent-Q&A/overrun lacks a written plan. *Fix:* one fallback each, decided in advance — never "we'll figure it out live."

6. **Host-only-knows.** The plan lives in the host's head; the sheet is too thin for anyone else to run it. *Detect:* fails the frozen-host stress test. *Fix:* each row self-sufficient enough for a producer to pick up.

7. **Over-scripted to stiffness.** A word-for-word teleprompter that reads robotic and can't flex live. *Detect:* full prose scripts instead of beats + cues. *Fix:* beats + cues, not a script — leave room for the host to be human.
