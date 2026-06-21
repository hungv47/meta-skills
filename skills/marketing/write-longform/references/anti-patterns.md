# Anti-Patterns — Write Longform

[ANTI-PATTERN] — failure modes the orchestrator + critic guard against. Re-read before any piece ships. Each is falsifiable with a detection rule.

---

## 1. Consensus-restatement (the collapse-into-write-copy tell)

**Symptom:** The piece is polished, on-brand, and says exactly what the first page of search already says.
**Why it fails:** The entire value of a pillar is its delta over the consensus. A piece with no delta is `write-copy` stretched to 2000 words — the exact failure this skill exists to prevent.
**Detection:** Originality scored against the research agent's Consensus baseline comes back <5; the prose could appear on any competitor's blog.
**Owned by:** draft + research + critic (Originality floor — hard gate, automatic FAIL).

---

## 2. Draft-before-research

**Symptom:** Prose written before the evidence ledger and consensus map exist.
**Why it fails:** Structure and claims invented for convenience rather than built on real evidence — generic by construction, and a vector for fabricated stats.
**Detection:** The artifact has a Piece but a thin/absent Source Ledger or Consensus Baseline.
**Owned by:** the orchestrator's strict pipeline order + critic.

---

## 3. Invented statistics / fake citations

**Symptom:** A confident "68% of teams report..." with no real source.
**Why it fails:** Destroys credibility and is a hard ethical line. A pillar trades on trust.
**Detection:** A statistic or quote in the Piece with no ledger # and no source; OR a "source" that doesn't support the claim.
**Owned by:** research + draft + critic (cited-or-marked hard gate — instant FAIL).

---

## 4. No-thesis listicle

**Symptom:** "10 ways to X" where the items are interchangeable and there's no argument.
**Why it fails:** A list is not a pillar. Nothing is defended; nothing is owned; nothing gets cited.
**Detection:** No thesis stated; sections pass the reorder test (any order works).
**Owned by:** outline + critic (Thesis + Structural dims).

---

## 5. Filler sections

**Symptom:** A section that could be deleted without weakening the argument.
**Why it fails:** Length-padding. Dilutes the argument and bores the reader.
**Detection:** A section fails the necessity test (delete it → argument unchanged).
**Owned by:** outline + critic (Structural integrity dim — hard gate, no-filler).

---

## 6. Adjective-evidence

**Symptom:** "Powerful", "seamless", "game-changing" standing in for specifics.
**Why it fails:** Adjectives assert; they don't prove. A pillar persuades with numbers, examples, scenarios.
**Detection:** Load-bearing claims backed by adjectives rather than a ledger #.
**Owned by:** draft + critic (Evidence quality dim).

---

## 7. Buried / skipped counter-argument

**Symptom:** The strongest case against the thesis never gets addressed.
**Why it fails:** A pillar that ignores the best objection reads as propaganda and loses the skeptical reader (often the one who'd cite it).
**Detection:** The research stress-test named a counter-argument with no corresponding section in the outline/piece.
**Owned by:** research + outline + critic (Evidence quality + thesis-defended gate).

---

## 8. Keyword-stuffing

**Symptom:** Headings and sentences contorted to repeat a keyword.
**Why it fails:** Reads badly for humans, and modern search/AEO penalizes it. Structure should serve reader and engine simultaneously.
**Detection:** A heading or passage that exists only to place a keyword.
**Owned by:** outline + draft + critic (Search/AEO dim).

---

## 9. Length-padding to a word count

**Symptom:** Sections or paragraphs added to hit "2000 words".
**Why it fails:** Length is a consequence of a thorough argument, never a target. Padding signals the argument ran out before the word count did.
**Detection:** word_count hit via restatement/filler rather than depth.
**Owned by:** outline + draft + critic (Structural + Prose dims).
