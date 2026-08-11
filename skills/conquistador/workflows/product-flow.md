# Product-flow workflow

Use privately when a product outcome spans screens, states, decisions, or native platform surfaces.

1. Use `map-user-flow` to enumerate platforms and surfaces before drawing the flow.
2. Ground every screen and transition in the requested job.
3. Cover happy path, decisions, empty/loading/error/permission/offline states, and recovery.
4. Challenge a happy path longer than seven user actions.
5. Finish with validation cases and an explicit out-of-scope boundary.

Do not move into visual design until the structure is reviewable. When the user also needs an
implementation-ready interface specification, continue with `brief-product-ui` after the flow is
accepted.

Publishing, production changes, credentials, and irreversible external actions remain human-owned.

