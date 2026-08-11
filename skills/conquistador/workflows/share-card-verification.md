# Share-card verification workflow

Use privately before a landing-page launch or when a pasted link renders incorrectly.

1. Inspect the actual page response and metadata for canonical URL, title, description, `og:*`, and
   Twitter/X card fields. Use `improve-conversion` to separate a broken card from subjective copy
   preferences.
2. Resolve every image to an absolute production URL. Verify reachability, image content type, file
   size, and actual dimensions; declared dimensions must match the file.
3. Use `brief-creative` only when the card image or message needs a new production handoff.
4. Fix only the metadata/card surface, then re-fetch and verify. Treat platform cache lag separately
   from source correctness and stop after three unsuccessful fix cycles.

Use an inspectable host/browser tool when available; no specific CLI is required. Do not pad good copy
to satisfy arbitrary character heuristics. Finish with observed defects, applied correction, objective
verification, advisory items, and the publish boundary.
