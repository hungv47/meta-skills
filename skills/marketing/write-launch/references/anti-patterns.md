# Anti-Patterns — write-launch

> Load at critic-agent dispatch (anti-pattern check) and re-read before ship. **10 patterns: 6 launch-craft (#1–#6) + 4 cross-cutting (#7–#10).** Cite by name (names are stable across version bumps; numbers shift on insertion).

Each row: the pattern, its detection rule, channel calibration, and the agent that owns catching it.

---

## Launch-craft anti-patterns

### 1. Vote-Ask (Earn, Don't Beg)

- **Pattern:** Any component asks for votes — "please upvote", "vote for us", "give us a vote", a vote-ring offer.
- **Detection:** case-insensitive `upvote` / `vote for` / `vote us` / `kudos`-for-vote in identifier, descriptor, anchor narrative, notify copy, OR cross-post.
- **Channel calibration:** Product Hunt (a guideline violation + downrank), Reddit / Show HN (vote manipulation = sitewide ban). The single most important launch guard.
- **Owner:** guard-checker (HARD GUARD → GUARD_FAIL); critic forces Dimension 2 = 0 if it slips through.

### 2. Half a Launch (Missing Anchor Narrative)

- **Pattern:** A tagline/title ships without the anchor narrative (PH pinned founder first comment / Reddit value-first lead). The first comment is half the launch.
- **Detection:** no `### Anchor narrative` component, or it is a feature list rather than a story ending in a feedback ask.
- **Channel calibration:** PH (first comment carries the story + feedback ask), Reddit (the value must stand alone).
- **Owner:** critic Dimension 5 (and guard-checker flags a missing component as a format-cap violation).

### 3. Pitch-First on Reddit (Promo Immune System)

- **Pattern:** Leading with the product instead of standalone value; missing founder disclosure; the link is the post.
- **Detection:** the post does not deliver value if the link were removed; no first-person founder disclosure; CTA-led.
- **Channel calibration:** Reddit (removal + ban risk; trips the 9:1 norm). Less acute on PH (the product page IS the link).
- **Owner:** guard-checker (HARD GUARD: disclosure + cold-link-drop); critic Dimension 4.

### 4. Opaque / Clever Identifier

- **Pattern:** The tagline/title chooses wordplay over clarity; a stranger can't repeat what the product is.
- **Detection:** identifier lacks a category word / >60 chars (PH) / pure metaphor with no load-bearing analogy.
- **Channel calibration:** PH (skim loses comprehension → fewer click-ins), Reddit (vague titles underperform "hot").
- **Owner:** critic Dimension 1.

### 5. Bundle Incoherence

- **Pattern:** The tagline, description, and anchor narrative tell different stories; the cross-post tone clashes with the first comment.
- **Detection:** the identifier promises X, the descriptor pitches Y; metadata contradicts the §6 run-of-show.
- **Channel calibration:** all channels — a launch is one coordinated message.
- **Owner:** critic Dimension 5.

### 6. Post-and-Ghost (No Reply Hook)

- **Pattern:** The anchor narrative has no genuine question and the bundle has no reply-readiness plan; velocity is left to chance.
- **Detection:** anchor narrative ends in a statement, not a feedback ask; no notify/engagement mechanism per §5.
- **Channel calibration:** PH (comment velocity dies without maker presence), Reddit (a slow first hour is hard to recover).
- **Owner:** critic Dimension 3.

---

## Cross-cutting anti-patterns

### 7. Pack-Faked Tailoring

- **Pattern:** The bundle claims channel tailoring ("optimized for Product Hunt") when no pack was loaded, or narrates tactics not in the pack.
- **Detection:** a Legibility block with a `pack_verified` date but tactics that don't trace to a §5 step; OR a "tailored for [channel]" claim in no-pack mode.
- **Calibration:** legibility-convention Hard Rule 2 + 3 (never fabricate a pack; tactics, not vibes).
- **Owner:** launch-copywriter (no-pack mode must say so); critic cross-checks the Legibility block.

### 8. Multi-Channel in One Invocation

- **Pattern:** One bundle tries to cover Product Hunt AND Reddit (or several) at once.
- **Detection:** `channel` frontmatter is plural / the body mixes two channels' native components.
- **Calibration:** launch angles + guards are channel-specific; a blended bundle is optimal for none (Critical Gate 1).
- **Owner:** Pre-Dispatch / Critical Gate 1 (re-invoke per channel; the launch chain fans out).

### 9. Guard Breach Shipped

- **Pattern:** A §4 hard-guard breach reaches the critic or the artifact (the guard-checker was skipped or overridden).
- **Detection:** a shipped artifact with `guard_status: passed` that still contains a vote-ask / undisclosed founder.
- **Calibration:** dispatching the critic before guard-check PASSes; `--fast` mis-applied to skip the guard, not just its loop.
- **Owner:** dispatch-mechanics (guard-check is a gate, not advisory); critic Dimension 2 = 0 as the backstop.

### 10. Cross-Stack Contract Drift

- **Pattern:** The 16-field frontmatter or the body section order changes without updating downstream consumers.
- **Detection:** a renamed field / reordered section vs `format-conventions.md` § "Required body sections".
- **Calibration:** ripples to humanmaxxing / polish-vn / publish-social / measure-results / run-pipeline.
- **Owner:** format-conventions (any schema change is atomic across consumers in one PR).
