# Rules — Test Policy

> Every new feature, component, hook, route, utility, or bug fix MUST ship with tests.
> No code is considered done without tests, a `/commit`, and `/end-session`.

## Mandatory Completion Sequence

After every code change:

1. **Write tests** — following the 5-level policy below
2. **`pnpm type-check && pnpm lint && pnpm test`** — all pass
3. **`/review`** — multi-agent review
4. **`/commit`** — conventional commit
5. **`/end-session`** — update session state before closing

## 5-Level Test Policy (mandatory)

Every test suite MUST cover these 5 levels. No level can be skipped.

### Level 1 — Happy Path

The nominal use case. The function/component works as intended with valid inputs.

```
- Component renders with required props
- Hook returns expected data
- API route returns 200 with valid payload
- Form submits successfully
- Mutation triggers correct invalidation
```

### Level 2 — Variant Cases

All meaningful variations of valid inputs. Each prop combination, each branch.

```
- Component with each variant/size/state prop combination
- Hook with different valid parameter sets
- API route with different valid query params (sort, filter, pagination)
- Form with optional fields filled/empty
- Conditional rendering branches (empty list vs populated, loading vs loaded)
```

### Level 3 — Managed Error Cases

Errors the code explicitly handles — expected failures with user-facing feedback.

```
- Form validation errors (invalid email, too short, required field empty)
- API 400/404/409 responses with proper error messages
- Mutation onError callbacks fire correctly
- Disabled states prevent interaction
- Rate limiter blocks excessive requests
```

### Level 4 — Unmanaged Error Cases

Unexpected failures — network errors, server crashes, malformed data.

```
- API returns 500 — component shows error state
- Network timeout — query retry behavior
- Supabase client returns unexpected null
- Malformed response data (missing fields, wrong types)
- Auth token expired mid-request
```

### Level 5 — Edge Cases

Boundary conditions, race conditions, unusual but possible scenarios.

```
- Empty arrays, null values, undefined optional props
- Maximum length strings, zero amounts, negative numbers
- Concurrent mutations (double submit)
- Rapid mount/unmount (cleanup, memory leaks)
- Unicode/special characters in user input
- Single item vs many items (pagination boundaries)
```

## Test Scope by Layer

### UI Components (packages/ui)

- Renders without crash (L1)
- Each variant/size renders correctly (L2)
- Disabled/loading states (L3)
- Missing optional props (L5)
- Accessibility: role, label, state attributes (L1-L2)

### Feature Components (packages/features)

- Screen view renders with mock props (L1)
- All prop combinations (L2)
- Empty states, loading states, error states (L3-L4)
- Callback props fire with correct arguments (L1)
- Form validation feedback (L3)

### Hooks (packages/features, packages/shared)

- Returns expected shape (L1)
- Different input combinations (L2)
- Error handling (L3-L4)
- Cleanup on unmount (L5)

### API Routes (apps/api)

- Successful CRUD operations (L1)
- Query params: sort, filter, pagination (L2)
- Validation errors — 400 with message (L3)
- Not found — 404 (L3)
- Conflict — 409 (L3)
- Supabase error — 500 (L4)
- Missing/invalid auth — 401 (L3)
- Boundary values (L5)

### CRUD Hooks (packages/features)

- Create/update/delete success + query invalidation (L1)
- Edit mode pre-fills form (L2)
- Server error handling (L4)
- Concurrent operations (L5)

## Naming Convention

```
describe('ComponentName', () => {
  describe('happy path', () => { ... })
  describe('variants', () => { ... })
  describe('managed errors', () => { ... })
  describe('unmanaged errors', () => { ... })
  describe('edge cases', () => { ... })
})
```

## Pragmatic Application

- Not every level produces the same number of tests — edge cases may have 1-2 tests, variants may have 10
- If a level genuinely does not apply (e.g. a pure presentational atom has no error handling), document it with a comment: `// L4: N/A — no async operations`
- Prioritize test quality over quantity — each test should assert one meaningful behavior
