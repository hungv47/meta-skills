# Shared product context standard

Load when reading, proposing, or updating shared, versioned product context.

- Shared context is optional and versioned. Record observed, inferred, and assumed boundaries for
  every entry, with its source and date.
- No silent writes: require explicit approval before any write to shared context; never write as a
  hidden side effect of another task.
- Keep observed, inferred, and assumed distinct so a reader knows what is certain.
- Surface conflicting sibling facts instead of silently overwriting or merging them.
- Read shared context as evidence for a decision; treat it as proposable, not immutable.
