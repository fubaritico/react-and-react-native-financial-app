# Rules — API Server (apps/api)

## Stack

| Layer      | Choice                              |
|------------|-------------------------------------|
| Runtime    | Node 20+ / tsx (dev)                |
| Framework  | Express 5                           |
| Validation | Zod + @asteasolutions/zod-to-openapi|
| Database   | Supabase (service role key)         |
| Auth       | Supabase JWT via `getUser()`        |
| Docs       | Swagger UI at `/docs`               |

## Project Structure (mandatory)

```
apps/api/src/
  index.ts              # Express app entry — mounts middleware + routes + Swagger
  lib/
    supabase.ts         # Supabase admin client (service role key)
    openapi.ts          # OpenAPI registry + generateDocument()
    generate-spec.ts    # CLI script: generates openapi.yaml
  middleware/
    auth.ts             # requireAuth — validates Supabase JWT
    validate.ts         # validateBody / validateQuery — Zod middleware
  routes/
    [entity].ts         # One file per entity — OpenAPI registration + Express handlers
  schemas/
    [entity].ts         # Zod schemas with .openapi() metadata
```

Rules:
- One route file per entity (balance, transactions, budgets, pots, recurring-bills)
- One schema file per entity — schemas are the single source of truth for validation AND OpenAPI spec
- Middleware files are generic — no business logic, only request processing
- `lib/` files are infrastructure — Supabase client, OpenAPI registry

## Route File Pattern (mandatory)

Every route file follows this exact structure:

```ts
import { Router } from 'express'
import { z } from 'zod'

import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { EntitySchema, CreateEntitySchema } from '../schemas/entity.js'

export const entityRouter = Router()
entityRouter.use(requireAuth)

// --- OpenAPI registration ---
// All registry.registerPath() calls go here — one per endpoint

// --- Express handlers ---
// All route handlers go here
```

Rules:
- `requireAuth` applied at router level via `.use()` — never per-handler (except `/health`)
- OpenAPI registration block BEFORE handlers — keeps spec declarations visible at top
- Every handler must check `if (error)` after Supabase calls
- Every error response uses `{ error: string }` shape — no other format
- Route handlers should stay under 30 lines — extract helpers for complex logic

## Authentication Pattern

```ts
// ALWAYS use supabase.auth.getUser() — never local JWT verification
const { data: { user }, error } = await supabase.auth.getUser(token)
res.locals.userId = user.id
```

- No `jsonwebtoken` dependency — Supabase handles ECC P-256 signing keys
- No `/auth` routes — signup/login stays 100% client-side via Supabase SDK
- `res.locals.userId` is the canonical way to access the authenticated user ID in handlers
- Service role key bypasses RLS — access control is enforced via `.eq('user_id', res.locals.userId)`

## Supabase Query Pattern

```ts
// Read — always filter by user_id
const { data, error } = await supabase
  .from('table')
  .select('col1, col2')
  .eq('user_id', res.locals.userId)

if (error) {
  res.status(500).json({ error: error.message })
  return
}

res.json(data ?? [])
```

Rules:
- ALWAYS filter by `user_id` — service role key bypasses RLS, so this is the access control
- ALWAYS handle `error` — never skip the error check
- Use `data ?? []` for list endpoints (Supabase can return null)
- Use `.single()` for endpoints returning one record (POST, PUT, GET by ID)
- Use `.select()` after `.insert()` / `.update()` to return the modified record
- Use RPCs for complex queries (joins, aggregations): `supabase.rpc('function_name', { params })`

## Zod Schema Pattern

```ts
import { z } from 'zod'
import { registry } from '../lib/openapi.js'

export const EntitySchema = registry.register(
  'Entity',
  z.object({
    id: z.string().uuid().openapi({ example: '...' }),
    name: z.string().openapi({ example: '...' }),
  })
)

// Input schemas — subset of fields for create/update
export const CreateEntitySchema = registry.register(
  'CreateEntity',
  z.object({
    name: z.string().min(1).openapi({ example: '...' }),
  })
)
```

Rules:
- Every schema registered with `registry.register()` for OpenAPI spec generation
- Every field has `.openapi({ example: '...' })` metadata
- Input schemas (Create/Update) are separate from the response schema
- Use `.uuid()`, `.email()`, `.min()`, `.regex()` etc. for validation — Zod is the boundary guard
- Query param schemas use `z.coerce.number()` for numeric params from query strings

## Sort Pattern

```ts
const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  latest: { column: 'date', ascending: false },
  oldest: { column: 'date', ascending: true },
  'a-z': { column: 'name', ascending: true },
  'z-a': { column: 'name', ascending: false },
  highest: { column: 'amount', ascending: false },
  lowest: { column: 'amount', ascending: true },
}

const sortConfig = SORT_MAP[sort] ?? SORT_MAP.latest
query = query.order(sortConfig.column, { ascending: sortConfig.ascending })
```

- Define `SORT_MAP` as a const at module level
- Always fallback to a default sort (`SORT_MAP.latest`)
- Apply `.order()` inline after filters — not via a helper function

## Pagination Pattern

```ts
const from = (page - 1) * limit
const to = from + limit - 1

let query = supabase
  .from('table')
  .select('*', { count: 'exact' })
  .eq('user_id', res.locals.userId)

query = query.range(from, to)

const { data, count, error } = await query

res.json({
  data: data ?? [],
  page,
  totalPages: Math.ceil((count ?? 0) / limit),
  total: count ?? 0,
})
```

## Atomic Mutation Pattern

For operations that need read-then-write (e.g. add/withdraw money):

```ts
async function updatePotTotal(potId: string, userId: string, delta: number, res: Response) {
  // 1. Fetch current state
  const { data: pot, error: fetchError } = await supabase
    .from('pots').select('*').eq('id', potId).eq('user_id', userId).single()

  if (fetchError || !pot) { res.status(404).json({ error: 'Not found' }); return }

  // 2. Validate business rule
  const newTotal = (pot as { total: number }).total + delta
  if (newTotal < 0) { res.status(400).json({ error: 'Insufficient funds' }); return }

  // 3. Apply update
  const { data, error } = await supabase
    .from('pots').update({ total: newTotal }).eq('id', potId).eq('user_id', userId).select().single()

  if (error) { res.status(500).json({ error: error.message }); return }
  res.json(data)
}
```

- Extract into a named helper function — not inline in the handler
- Fetch → validate → update — three clear steps
- Always re-filter by `user_id` in the update query

## Error Response Contract

All error responses follow this shape:

```json
{ "error": "Human-readable error message" }
```

Status codes:
- `400` — validation error, business rule violation (insufficient funds, missing required param)
- `401` — missing or invalid auth token
- `404` — resource not found (or belongs to another user)
- `500` — Supabase/internal error

Never expose stack traces, internal paths, or Supabase internals beyond `error.message`.

## Environment Variables

- Loaded via `--env-file=.env` in dev/start scripts — no `dotenv` dependency
- In production (Netlify), env vars injected directly
- Validated at startup in `lib/supabase.ts` — app crashes immediately if missing

## ESLint Exceptions (accepted)

- `@typescript-eslint/no-unsafe-assignment` — warned, not errored. Supabase client returns untyped data.
- `@typescript-eslint/no-unnecessary-condition` — disabled per-line where Supabase types claim non-null but runtime can be null.

## Adding a New Route

1. Create schema in `src/schemas/[entity].ts` — register with `registry.register()`
2. Create route file in `src/routes/[entity].ts` — OpenAPI registration + handlers
3. Mount router in `src/index.ts` — `app.use('/entity', entityRouter)`
4. Run `pnpm --filter api-financial-app type-check` to verify
5. Test via Swagger UI at `/docs`
