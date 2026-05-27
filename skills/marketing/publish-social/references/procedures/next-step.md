# Next Step — Per-Route Operator Instructions

Auto-mode summary in manifest tells operator exactly what to do next.

## Route A (export — no credentials)

"Open your scheduler (Typefully / Buffer / Hootsuite / Hushuy / Later / Publer / Sprout). Import the matching file from `scheduler-imports/`. Set schedule inside the scheduler."

## Route B (Typefully draft — Typefully key detected)

"X drafts at the URLs in `typefully.json`. Other 8 platforms export-mode — import the matching scheduler file."

## Route C (browser-automation draft — D17)

"Drafts landed in your platform UIs — open each `draft_url` from manifest, review, hit Send. Any `fallback-export` platform: paste from `platforms/[platform].md`."

## Route D (`--mode=publish` live — D18)

"Posts are LIVE — `post_url`s in manifest. Any `fallback-draft` platform: open its draft and Send manually. To remove a post, follow per-platform delete instructions in the manifest (publish-social does not un-publish for you)."

## After publishing

Future `evaluate-content` cycles score the output against the write-social brief's hypothesis.
