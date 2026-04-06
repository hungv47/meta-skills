# Example Contracts

Reference examples for writing contracts with the discover skill's contract output format. Use these as templates when the user asks to "write a contract" or "spec this out."

---

## API Endpoint

```
GOAL: GET /users endpoint returning paginated results, handling 10K concurrent connections.

CONSTRAINTS:
- Express.js, existing Prisma ORM
- No new dependencies
- Under 80 lines (route + controller)

FORMAT:
- Route in routes/users.ts
- Controller in controllers/users.ts
- 5 tests in __tests__/users.test.ts
- OpenAPI JSDoc on the route

FAILURE (any of these = not done):
- No pagination (limit/offset at minimum)
- No input validation on query params
- Returns 500 on invalid input instead of 400
- No test for empty results
- No test for invalid page number
```

## React Component

```
GOAL: Reusable DataTable component supporting sort, filter, and pagination for up to 10K rows without lag.

CONSTRAINTS:
- React 18+, TypeScript, no external table libraries
- Must accept generic row type via generics
- Virtualized rendering for 1K+ rows

FORMAT:
- components/DataTable/DataTable.tsx (component)
- components/DataTable/DataTable.types.ts (types)
- components/DataTable/DataTable.test.tsx (tests)
- Storybook story showing 3 variants

FAILURE (any of these = not done):
- Scrolling lags on 5K rows
- Sort doesn't handle mixed types (strings vs numbers)
- Filter doesn't debounce (fires on every keystroke)
- No empty state
- Generic type not inferred from data prop
```
