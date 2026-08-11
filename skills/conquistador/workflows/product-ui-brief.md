# Product UI brief workflow

Use privately after a product flow is defined and the user needs a buildable interface specification.

1. Use `brief-product-ui` with the accepted flow as the source of truth.
2. Trace every screen, state, and surface to a flow node or transition.
3. Define a reusable component system and apply existing semantic design tokens.
4. Specify interaction states plus empty, loading, error, permission, and offline behavior.
5. Define keyboard, assistive-technology, contrast, motion, and focus requirements.
6. Finish with implementation order, tests, and human design/engineering review criteria.

Do not invent screens, raw style values, product behavior, or a new brand system. If a flow is absent,
return to `map-user-flow`. This workflow produces a specification, not rendered UI, unless the user
separately requests implementation.

