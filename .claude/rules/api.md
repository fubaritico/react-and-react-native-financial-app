# Rules — API Server (apps/api)

> **JSDoc is mandatory everywhere** — every function (`@param` + `@returns`), every interface
> property, every type with properties, every hook, every constant. This applies to route
> handlers, Supabase layer functions, middleware, schemas, utils — no exception (QUAL-003/004/005).

## Stack

| Layer      | Choice                              |
|------------|-------------------------------------|
| Runtime    | Node 20+ / tsx (dev)                |
| Framework  | Express 5                           |
| Validation | Zod + @asteasolutions/zod-to-openapi|
| Database   | Supabase (service role key)         |
| Types      | Prisma introspection (`@financial-app/prisma`) |
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
  supabase/
    index.ts            # Barrel — all data access functions + types
    types.ts            # Discriminated union types (SupabaseResult, etc.)
    balance.ts          # getBalance (RPC wrapper)
    budgets.ts          # CRUD budgets + getBudgetsWithSpent (RPC)
    pots.ts             # CRUD pots + rpcUpdatePotTotal
    transactions.ts     # CRUD transactions + listTransactions (paginated)
    recurring-bills.ts  # getRecurringBills (RPC wrapper)
    user-preferences.ts # preferences CRUD + setInitialBalance
  routes/
    [entity].ts         # One file per entity — OpenAPI registration + Express handlers
  schemas/
    [entity].ts         # Zod schemas with .openapi() metadata
```

```
packages/prisma/
  prisma/
    schema.prisma       # Introspected from Supabase Postgres (public + auth schemas)
  prisma.config.ts      # Prisma 7 config — DATABASE_URL from .env
  src/generated/prisma/ # Generated types (gitignored)
  .env                  # Direct Postgres connection string (gitignored)
```

Rules:
- One route file per entity (balance, transactions, budgets, pots, recurring-bills)
- One schema file per entity — schemas are the single source of truth for validation AND OpenAPI spec
- One supabase layer file per entity — typed wrappers around all Supabase calls
- Route files NEVER import `supabase` directly — always through `../supabase/index.js`
- Middleware files are generic — no business logic, only request processing
- `lib/` files are infrastructure — Supabase client, OpenAPI registry

## Route File Pattern (mandatory)

Every route file follows this exact structure:

```ts
import { Router } from 'express'
import { z } from 'zod'

import { registry } from '../lib/openapi.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { EntitySchema, CreateEntitySchema } from '../schemas/entity.js'
import { getEntity, createEntity } from '../supabase/index.js'

export const entityRouter = Router()
entityRouter.use(requireAuth)

// --- OpenAPI registration ---
// All registry.registerPath() calls go here — one per endpoint

// --- Express handlers ---
// All route handlers go here — call supabase layer functions, not supabase client directly
```

Rules:
- `requireAuth` applied at router level via `.use()` — never per-handler (except `/health`)
- OpenAPI registration block BEFORE handlers — keeps spec declarations visible at top
- Route handlers call supabase layer functions (from `../supabase/index.js`) — NEVER import `supabase` client directly
- Every handler checks `if (result.error)` on the supabase layer return value
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

## Supabase Data Access Layer (`src/supabase/`)

All Supabase calls are encapsulated in typed wrapper functions in `src/supabase/`.
Route files NEVER import the Supabase client directly.

### Return Types (`src/supabase/types.ts`)

```ts
// Single record — create, update, get by ID
type SupabaseResult<T> = { data: T; error: null } | { data: null; error: PostgrestError }

// List with count — paginated queries
type SupabaseListResult<T> = { data: T[]; count: number; error: null } | { data: null; error: PostgrestError }

// Delete — returns affected count
type SupabaseDeleteResult = { count: number; error: null } | { data: null; error: PostgrestError }

// Error-only — multi-step operations (ensurePreferencesRow, setInitialBalance)
interface SupabaseErrorOnly { error: PostgrestError | null }
```

### Row Types

- Table rows use Prisma-generated types: `import type { budgetsModel } from '@financial-app/prisma'`
- Use `Pick<Model, 'col1' | 'col2'>` when the query selects specific columns
- RPC return types are defined manually (Prisma can't introspect function return types)
- Payload interfaces (Create/Update) use explicit `number`/`string` types — NOT `Pick<Model>`,
  because Prisma uses `Decimal`/`Date` types while Supabase REST returns plain `number`/`string`

### Wrapper Function Pattern

```ts
import type { entityModel } from '@financial-app/prisma'
import { supabase } from '../lib/supabase.js'
import type { SupabaseResult } from './types.js'

export type EntityRow = entityModel

export async function getEntity(
  userId: string
): Promise<SupabaseResult<EntityRow>> {
  const result = await supabase
    .from('entity')
    .select()
    .eq('user_id', userId)
    .single()

  if (result.error) return { data: null, error: result.error }
  return { data: result.data as EntityRow, error: null }
}
```

Rules:
- Use `const result = await supabase...` (no destructuring) — avoids `any` spreading from untyped client
- Single `as TypeRow` cast after the error guard — this is the ONLY place casts exist
- ALWAYS filter by `user_id` — service role key bypasses RLS, so this is the access control
- ALWAYS handle `error` — never skip the error check
- Use `data ?? []` for list endpoints (Supabase can return null)
- Use `.single()` for endpoints returning one record
- Use `.select()` after `.insert()` / `.update()` to return the modified record
- Use RPCs for complex queries: `supabase.rpc('function_name', { params })`
- Every function MUST have an explicit `Promise<...>` return type annotation

### Route Handler Pattern (consuming the layer)

```ts
entityRouter.get('/', async (req, res) => {
  const userId = res.locals.userId as string
  const result = await getEntity(userId)

  if (result.error) {
    res.status(500).json({ error: result.error.message })
    return
  }

  res.json(result.data)
})
```

No casts in route files. `result.data` is fully typed after the error guard thanks to
the discriminated union.

## Prisma — Type Generation Only

### Why Prisma is NOT used as an ORM

Le frontend utilise le SDK Supabase JS (`@supabase/supabase-js`) pour l'auth. Si demain on
ajoute du realtime (subscriptions sur les transactions par exemple), c'est le même SDK côté client.

Côté API, on utilise aussi le SDK Supabase JS (avec la service role key). Les deux parlent le
même langage : l'API REST PostgREST de Supabase.

Si on remplaçait le SDK Supabase par PrismaClient côté API :
- PrismaClient ouvre une **connexion directe** à Postgres (TCP, connection pool)
- Le SDK Supabase passe par **PostgREST** (HTTP)
- Ce sont deux chemins d'accès différents à la même DB

Le problème concret : les RPCs Supabase (`supabase.rpc('get_balance', ...)`) sont des fonctions
SQL exposées via PostgREST. PrismaClient ne peut pas les appeler — il faudrait soit les réécrire
en `prisma.$queryRaw`, soit dupliquer la logique en TypeScript.

On se retrouverait avec deux clients vers la même DB, deux sémantiques de connexion, et des
fonctionnalités Supabase (realtime, RLS, RPCs) inaccessibles via Prisma. Pas de gain, plus
de complexité.

### What Prisma does for us

- `prisma db pull` introspects the Supabase Postgres DB → generates `schema.prisma`
- `prisma generate` produces TypeScript types from the schema (model interfaces)
- These types are imported as `type` only in the supabase layer — zero runtime dependency
- The `@financial-app/prisma` package exports model types via `packages/prisma/src/generated/prisma/models.ts`

### Schema sync workflow

```bash
# After DB schema changes (new columns, tables)
cd packages/prisma
pnpm db:sync          # = prisma db pull && prisma generate
```

- `src/generated/` is gitignored — CI/dev must run `pnpm db:sync` after clone
- `.env` contains the direct Postgres connection string (gitignored)
- Schema covers `public` + `auth` schemas (multi-schema introspection)

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

`SORT_MAP` lives in the supabase layer file (e.g. `src/supabase/transactions.ts`), not in route files.

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

- Define `SORT_MAP` as a const at module level in the supabase layer file
- Always fallback to a default sort (`SORT_MAP.latest`)
- Apply `.order()` inline after filters — not via a helper function

## Pagination Pattern

Pagination logic lives in the supabase layer function. The route handler receives typed results.

```ts
// In src/supabase/transactions.ts
export async function listTransactions(
  userId: string,
  params: ListParams
): Promise<SupabaseListResult<TransactionListRow>> {
  const { page, limit, category, search, sort = 'latest' } = params
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('transactions')
    .select('id, avatar, name, category, date, amount, recurring', { count: 'exact' })
    .eq('user_id', userId)

  // filters, sort, range...
  query = query.range(from, to)

  const result = await query
  if (result.error) return { data: null, error: result.error }
  return { data: (result.data ?? []) as TransactionListRow[], count: result.count ?? 0, error: null }
}

// In src/routes/transactions.ts
const result = await listTransactions(userId, { page, limit, category, search, sort })
if (result.error) { res.status(500).json({ error: result.error.message }); return }
res.json({ data: result.data, page, totalPages: Math.ceil(result.count / limit), total: result.count })
```

## Atomic Mutation Pattern

For operations that need read-then-write (e.g. add/withdraw money), use a Supabase RPC
in the supabase layer:

```ts
// In src/supabase/pots.ts
export async function rpcUpdatePotTotal(
  potId: string,
  userId: string,
  delta: number
): Promise<SupabaseResult<PotRow[]>> {
  const result = await supabase.rpc('update_pot_total', {
    p_pot_id: potId,
    p_user_id: userId,
    p_delta: delta,
  })

  if (result.error) return { data: null, error: result.error }
  return { data: (result.data ?? []) as PotRow[], error: null }
}
```

- Prefer RPCs for atomic operations (race-condition safe)
- The RPC handles validation + update in a single SQL transaction
- Always re-filter by `user_id` in RPCs

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

## Adding a New Entity

1. If new table: run `cd packages/prisma && pnpm db:sync` to regenerate types
2. Create supabase layer in `src/supabase/[entity].ts` — typed wrapper functions
3. Export from `src/supabase/index.ts` barrel (functions + row types)
4. Create schema in `src/schemas/[entity].ts` — register with `registry.register()`
5. Create route file in `src/routes/[entity].ts` — imports from `../supabase/index.js`
6. Mount router in `src/index.ts` — `app.use('/entity', entityRouter)`
7. Run `pnpm --filter api-financial-app type-check` to verify
8. Test via Swagger UI at `/docs`
