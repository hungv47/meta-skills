# Anti-Patterns — design-minigame

7 patterns. The critic checks each before ship; the dark-pattern one is an auto-BLOCK.

1. **Fake-win dark pattern.** A rigged "🎉 You won!" that leads to a paywall or a non-prize. *Detect:* the win is not real, or the odds are hidden/faked. *Fix:* real odds, real prizes — **auto-BLOCK if unremoved** (brand + legal risk).

2. **Friction before fun.** An email/data wall before the player gets to play. *Detect:* capture is the entry gate. *Fix:* capture at the reward claim ("where do we send your prize?"), after the first hit of fun.

3. **Broken prize economics.** A reward whose cost is unbounded or can't be honored on a spike. *Detect:* no tiers × odds × plays model; no redemption cap. *Fix:* model the expected cost; cap redemptions; make the top prize real-but-rare.

4. **No funnel.** A game that ends in a dead end — engagement captured, nothing done with it. *Detect:* no capture and no next step. *Fix:* end in a real CTA tied to the goal (claim → onboard → offer), or, for pure-awareness, say so explicitly.

5. **Gambling-regulation-blind.** Prize draws / sweepstakes with odds + value but no compliance thought. *Detect:* no jurisdiction/T&Cs/age-gate/"no purchase necessary" flag. *Fix:* surface the compliance question (not legal advice) so the operator handles it.

6. **Inaccessible.** Relies on color/motion/fine motor with no fallback. *Detect:* no keyboard path, color-only states, no reduced-motion. *Fix:* accessible states; don't gate the prize behind an inaccessible interaction.

7. **Off-brand.** A generic casino-y wheel that fights the brand. *Detect:* doesn't read as the brand; gaudy. *Fix:* brand system (Forest Shadow / Leaf, matte); the game feels like the brand at play, not a third-party widget.
