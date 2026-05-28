# Rules — API Server (apps/api)

> **JSDoc is mandatory everywhere** — every function (`@param` + `@returns`), every interface
> property, every type with properties, every hook, every constant (QUAL-003/004/005).
> For Supabase layer, schemas, sort, pagination, mutations patterns → see `api-patterns.md`.
> For Netlify deployment, Lambda function, env vars → see `netlify.md`.

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
  app.ts                # Express app factory — createApp()
  index.ts              # Standalone server entry (local dev/prod)
  lib/
    supabase.ts         # Supabase admin client (service role key)
    openapi.ts          # OpenAPI registry + generateDocument()
    generate-spec.ts    # CLI script: generates openapi.yaml
  middleware/
    auth.ts             # requireAuth — validates Supabase JWT
    validate.ts         # validateBody / validateQuery — Zod middleware
  supabase/             # Data access layer (see api-patterns.md)
  routes/
    [entity].ts         # One file per entity — OpenAPI registration + Express handlers
  schemas/
    [entity].ts         # Zod schemas with .openapi() metadata
```

Rules:
- One route file per entity, one schema file per entity, one supabase layer file per entity
- Route files NEVER import `supabase` directly — always through `../supabase/index.js`
- Middleware files are generic — no business logic, only request processing

## Route File Pattern (mandatory)

```ts
import { Router } from 'express'
import { registry } from '../lib/openapi.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { EntitySchema, CreateEntitySchema } from '../schemas/entity.js'
import { getEntity, createEntity } from '../supabase/index.js'

export const entityRouter = Router()
entityRouter.use(requireAuth)

// --- OpenAPI registration --- (one per endpoint)
// --- Express handlers --- (call supabase layer functions)
```

Rules:
- `requireAuth` at router level via `.use()` — never per-handler (except `/health`)
- OpenAPI registration block BEFORE handlers
- Every handler checks `if (result.error)` — every error uses `{ error: string }` shape
- Route handlers stay under 30 lines

## Authentication Pattern

```ts
const { data: { user }, error } = await supabase.auth.getUser(token)
res.locals.userId = user.id
```

- No `jsonwebtoken` dependency — Supabase handles signing keys
- No `/auth` routes — signup/login stays 100% client-side via Supabase SDK
- `res.locals.userId` is the canonical way to access the authenticated user ID
- Service role key bypasses RLS — access control via `.eq('user_id', res.locals.userId)`

## Error Response Contract

```json
{ "error": "Human-readable error message" }
```

- `400` — validation error, business rule violation
- `401` — missing or invalid auth token
- `404` — resource not found (or belongs to another user)
- `500` — Supabase/internal error

Never expose stack traces, internal paths, or Supabase internals.

## Environment Variables

- Loaded via `--env-file=.env` in dev/start scripts — no `dotenv` dependency
- In production (Netlify), env vars injected directly (see `netlify.md`)
- Validated at startup in `lib/supabase.ts` — app crashes immediately if missing

## ESLint Exceptions (accepted)

- `@typescript-eslint/no-unsafe-assignment` — warned, not errored (Supabase untyped data)
- `@typescript-eslint/no-unnecessary-condition` — disabled per-line where needed

## Adding a New Entity

1. If new table: `pnpm prisma:sync` to regenerate types
2. Create supabase layer in `src/supabase/[entity].ts`
3. Export from `src/supabase/index.ts` barrel
4. Create schema in `src/schemas/[entity].ts` — `registry.register()`
5. Create route file in `src/routes/[entity].ts`
6. Mount router in `src/app.ts` — `app.use('/entity', entityRouter)`
7. Write tests — 5-level policy (see `tests.md`)
8. `pnpm type-check && pnpm lint && pnpm test`
9. Test via Swagger UI at `/docs`
10. `/commit` then `/end-session`
