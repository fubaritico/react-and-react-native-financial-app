# Rules — API Patterns (Supabase Layer, Prisma, Schemas)

> Companion to `api.md`. Covers data access layer, type patterns, and query patterns.

## Supabase Data Access Layer (`src/supabase/`)

All Supabase calls are in typed wrappers. Route files NEVER import the Supabase client directly.

### Return Types (`src/supabase/types.ts`)

```ts
type SupabaseResult<T> = { data: T; error: null } | { data: null; error: PostgrestError }
type SupabaseListResult<T> = { data: T[]; count: number; error: null } | { data: null; error: PostgrestError }
type SupabaseDeleteResult = { count: number; error: null } | { data: null; error: PostgrestError }
interface SupabaseErrorOnly { error: PostgrestError | null }
```

### Row Types

- Table rows: `import type { budgetsModel } from '@financial-app/prisma'`
- `Pick<Model, 'col1' | 'col2'>` for partial selects
- RPC return types defined manually (Prisma can't introspect functions)
- Payload interfaces use `number`/`string` (not Prisma `Decimal`/`Date`)

### Wrapper Function Pattern

```ts
export async function getEntity(userId: string): Promise<SupabaseResult<EntityRow>> {
  const result = await supabase.from('entity').select().eq('user_id', userId).single()
  if (result.error) return { data: null, error: result.error }
  return { data: result.data as EntityRow, error: null }
}
```

Rules:
- `const result = await supabase...` (no destructuring) — avoids `any` spreading
- Single `as TypeRow` cast after the error guard
- ALWAYS filter by `user_id`, ALWAYS handle `error`
- `.single()` for one record, `.select()` after `.insert()`/`.update()`
- Every function MUST have explicit `Promise<...>` return type

### Route Handler Pattern

```ts
entityRouter.get('/', async (req, res) => {
  const userId = res.locals.userId as string
  const result = await getEntity(userId)
  if (result.error) { res.status(500).json({ error: result.error.message }); return }
  res.json(result.data)
})
```

No casts in route files — `result.data` is typed after the error guard.

## Prisma — Type Generation Only

Prisma is NOT used as an ORM. Le SDK Supabase JS est utilisé côté API (service role key)
et côté client (auth). PrismaClient ouvrirait une connexion directe séparée et ne peut pas
appeler les RPCs Supabase. Deux clients vers la même DB = complexité sans gain.

Prisma sert uniquement à :
- `prisma db pull` → introspect schema → `schema.prisma`
- `prisma generate` → TypeScript types importés en `type` only
- Package `@financial-app/prisma` exporte les model types

```bash
pnpm prisma:sync    # = prisma db pull && prisma generate
```

- `src/generated/` is gitignored — CI/dev must run after clone
- Schema covers `public` + `auth` schemas

## Zod Schema Pattern

```ts
export const EntitySchema = registry.register('Entity', z.object({
  id: z.string().uuid().openapi({ example: '...' }),
  name: z.string().openapi({ example: '...' }),
}))
```

- Every schema registered with `registry.register()`
- Every field has `.openapi({ example: '...' })` metadata
- Input schemas (Create/Update) separate from response schema
- Query params use `z.coerce.number()`

## Sort Pattern

`SORT_MAP` lives in the supabase layer file, not in route files.

```ts
const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  latest: { column: 'date', ascending: false },
  oldest: { column: 'date', ascending: true },
  // ...
}
const sortConfig = SORT_MAP[sort] ?? SORT_MAP.latest
query = query.order(sortConfig.column, { ascending: sortConfig.ascending })
```

## Pagination Pattern

Pagination logic lives in the supabase layer function :

```ts
const from = (page - 1) * limit
const to = from + limit - 1
query = query.range(from, to)
// ...
return { data: result.data as Row[], count: result.count ?? 0, error: null }
```

Route handler returns : `{ data, page, totalPages, total }`

## Atomic Mutation Pattern

For read-then-write operations, use a Supabase RPC :

```ts
const result = await supabase.rpc('update_pot_total', {
  p_pot_id: potId, p_user_id: userId, p_delta: delta
})
```

- RPCs for atomic operations (race-condition safe)
- Always re-filter by `user_id` in RPCs
