# Anti-Patterns — measure-results

8 patterns. The critic checks every one before the write-back commits.

1. **Vanity-metric-only read.** Reporting reach/impressions/upvotes with no tie to a downstream outcome (signups, trials, revenue) or a ranking signal. *Detect:* the read has no metric that maps to a business outcome or a pack §3 signal. *Fix:* attribute to a signal AND name the downstream number, or label it vanity.

2. **Sycophantic read.** Only wins; failures softened or omitted. *Detect:* zero "did not work / unknown" lines on a launch that had any miss. *Fix:* name the misses as plainly as the wins (rubric dim 3).

3. **Unattributed win.** "It went great" with no tactic/number. *Detect:* a positive claim with no §3/§5 reference and no supporting figure. *Fix:* attribute or label as a coincidence candidate.

4. **No write-back.** A read is produced but nothing is appended to the pack / performance store. *Detect:* run ends with a read artifact only. *Fix:* the loop is not closed until the pack changelog + performance row are written (the whole point of the skill).

5. **Multi-channel in one run.** Mixing two channels' results into one read. *Detect:* the metrics table spans >1 channel. *Fix:* one run per channel (the pack is per-channel).

6. **Faked attribution without a pack.** Citing pack §-numbers for a channel that has no pack. *Detect:* §-references for an uncovered channel. *Fix:* produce a general read and state attribution is NOT channel-tailored (legibility transparent degrade).

7. **Hosted post blocks the run.** Letting a failed/absent hosted metrics POST error out or stall the run. *Detect:* run depends on the API succeeding. *Fix:* the hosted feed is best-effort; local write-backs are the source of truth; no key / unreachable → skip silently (open-core invariant).

8. **Overwriting pack tactics.** Editing/deleting a tactic's wording instead of appending evidence. *Detect:* the write-back diff changes existing §5/§3 text. *Fix:* append a dated changelog entry + a note; promoting a confirmed learning into the tactic text is a deliberate operator verify step, not this skill's job.
