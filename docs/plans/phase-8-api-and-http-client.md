# Phase 8 — API Server & HTTP Client

## Goal

Create two new packages:

1. **`apps/api/`** — Express REST API backed by Supabase, code-first OpenAPI via Zod
2. **`@financial-app/http-client`** (`packages/http-client/`) — generated TypeScript client using HeyAPI from the generated OpenAPI spec

Zod schemas are the single source of truth: they validate requests at runtime,
generate the OpenAPI spec, and drive the type-safe HTTP client.

## Status: TODO (requires Phase 7 complete)

---

## Architecture Decisions

### Code-First OpenAPI (Zod → Spec → Client)

```
Zod schemas (single source of truth)
  │
  ├──► Runtime validation in Express routes
  │
  └──► Generated openapi.yaml (via @asteasolutions/zod-to-openapi)
         │
         ├──► Swagger UI at /docs
         │
         └──► HeyAPI generates TypeScript client
                │
                └──► Apps consume type-safe SDK
```

**Why code-first over spec-first:**
- No manual YAML maintenance — spec is always in sync with code
- Zod schemas serve double duty (validation + documentation)
- Change a schema → regenerate spec → regenerate client → TS catches breaking changes
- No drift between what the API accepts and what the spec documents

### No ORM

Express routes use `@supabase/supabase-js` with the service role key.
No Prisma — simple CRUD doesn't justify the overhead. Complex queries use `supabase.rpc()`.
(Decision documented in Phase 5.)

### Auth Flow

The API receives a Supabase JWT as a Bearer token in the Authorization header.
The auth middleware validates it via `supabase.auth.getUser(token)`.
The API uses the service role key for data queries (bypasses RLS).
Access control is enforced at the middleware level by `user_id`.

---

## Step 7.1 — Scaffold apps/api/

```bash
mkdir -p apps/api/src/{routes,schemas,middleware,lib}
```

### apps/api/package.json

```json
{
  "name": "api-financial-app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc",
    "type-check": "tsc --noEmit",
    "generate:spec": "tsx src/lib/generate-spec.ts"
  },
  "dependencies": {
    "@asteasolutions/zod-to-openapi": "^7.3.0",
    "@supabase/supabase-js": "catalog:",
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "helmet": "^8.1.0",
    "swagger-ui-express": "^5.0.0",
    "yaml": "^2.7.0",
    "zod": "catalog:"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/swagger-ui-express": "^4.1.0",
    "tsx": "^4.19.0",
    "typescript": "catalog:"
  }
}
```

### apps/api/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step 7.2 — Zod Schemas (Single Source of Truth)

All schemas live in `src/schemas/`. Each file defines the shape, validation rules,
and OpenAPI metadata for one domain entity.

### src/schemas/auth.ts

```ts
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const UserSchema = z.object({
  id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
  email: z.string().email(),
  displayName: z.string(),
}).openapi('User')

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
}).openapi('LoginRequest')

export const RegisterRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
}).openapi('RegisterRequest')

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
}).openapi('AuthResponse')
```

### src/schemas/balance.ts

```ts
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const BalanceSchema = z.object({
  current: z.number(),
  income: z.number(),
  expenses: z.number(),
}).openapi('Balance')
```

### src/schemas/transaction.ts

```ts
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  avatar: z.string(),
  name: z.string(),
  category: z.string(),
  date: z.string().datetime(),
  amount: z.number(),
  recurring: z.boolean(),
}).openapi('Transaction')

export const TransactionListSchema = z.object({
  data: z.array(TransactionSchema),
  page: z.number().int(),
  totalPages: z.number().int(),
  total: z.number().int(),
}).openapi('TransactionList')

export const TransactionQuerySchema = z.object({
  page: z.coerce.number().int().default(1),
  limit: z.coerce.number().int().default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest', 'a-z', 'z-a', 'highest', 'lowest']).optional(),
})
```

### src/schemas/budget.ts

```ts
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const BudgetSchema = z.object({
  id: z.string().uuid(),
  category: z.string(),
  maximum: z.number(),
  theme: z.string(),
  spent: z.number(),
}).openapi('Budget')

export const CreateBudgetSchema = z.object({
  category: z.string(),
  maximum: z.number(),
  theme: z.string(),
}).openapi('CreateBudgetRequest')

export const UpdateBudgetSchema = z.object({
  category: z.string().optional(),
  maximum: z.number().optional(),
  theme: z.string().optional(),
}).openapi('UpdateBudgetRequest')
```

### src/schemas/pot.ts

```ts
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const PotSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  target: z.number(),
  total: z.number(),
  theme: z.string(),
}).openapi('Pot')

export const CreatePotSchema = z.object({
  name: z.string(),
  target: z.number(),
  theme: z.string(),
}).openapi('CreatePotRequest')

export const UpdatePotSchema = z.object({
  name: z.string().optional(),
  target: z.number().optional(),
  theme: z.string().optional(),
}).openapi('UpdatePotRequest')

export const PotAmountSchema = z.object({
  amount: z.number().min(0.01),
}).openapi('PotAmountRequest')
```

---

## Step 7.3 — OpenAPI Registry & Generator

### src/lib/openapi.ts

```ts
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi'

export const registry = new OpenAPIRegistry()

// Register security scheme
registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

export function generateDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions)

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Financial App API',
      version: '1.0.0',
      description: 'REST API for the Personal Finance application',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Local development' },
    ],
  })
}
```

### src/lib/generate-spec.ts — Script to output openapi.yaml

```ts
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'

// Import all route files to trigger registry.registerPath() calls
import '../routes/auth.js'
import '../routes/balance.js'
import '../routes/transactions.js'
import '../routes/budgets.js'
import '../routes/pots.js'

import { generateDocument } from './openapi.js'

const spec = generateDocument()
const outPath = path.resolve(import.meta.dirname, '../../openapi.yaml')
fs.writeFileSync(outPath, yaml.stringify(spec))
console.error(`OpenAPI spec written to ${outPath}`)
```

Run with: `pnpm --filter api-financial-app generate:spec`

---

## Step 7.4 — Middleware

### src/middleware/auth.ts

```ts
import type { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabase.js'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ error: 'Missing authorization token' })
    return
  }

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return
  }

  res.locals.userId = data.user.id
  next()
}
```

### src/middleware/validate.ts

```ts
import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() })
      return
    }
    req.body = parsed.data
    next()
  }
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() })
      return
    }
    req.query = parsed.data
    next()
  }
}
```

### src/lib/supabase.ts

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
)
```

> The API uses the **service role key** (not the anon key) to bypass RLS
> and enforce access control at the Express middleware level.

---

## Step 7.5 — Route Implementation Pattern

Each route file both registers OpenAPI paths (for spec generation)
and defines Express handlers (for runtime). Same Zod schema does both.

### src/routes/budgets.ts

```ts
import { Router } from 'express'
import { z } from 'zod'
import { registry } from '../lib/openapi.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { supabase } from '../lib/supabase.js'
import {
  BudgetSchema,
  CreateBudgetSchema,
  UpdateBudgetSchema,
} from '../schemas/budget.js'

export const budgetsRouter = Router()
budgetsRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/budgets',
  tags: ['Budgets'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'All budgets',
      content: {
        'application/json': { schema: z.array(BudgetSchema) },
      },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/budgets',
  tags: ['Budgets'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: CreateBudgetSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Budget created',
      content: {
        'application/json': { schema: BudgetSchema },
      },
    },
  },
})

registry.registerPath({
  method: 'put',
  path: '/budgets/{id}',
  tags: ['Budgets'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: UpdateBudgetSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Budget updated',
      content: {
        'application/json': { schema: BudgetSchema },
      },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/budgets/{id}',
  tags: ['Budgets'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    204: { description: 'Budget deleted' },
  },
})

// --- Express handlers ---

budgetsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', res.locals.userId)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json(data)
})

budgetsRouter.post('/', validateBody(CreateBudgetSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('budgets')
    .insert({ ...req.body, user_id: res.locals.userId })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.status(201).json(data)
})

budgetsRouter.put('/:id', validateBody(UpdateBudgetSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('budgets')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', res.locals.userId)
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json(data)
})

budgetsRouter.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', res.locals.userId)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.status(204).send()
})
```

> All other route files (auth, balance, transactions, pots) follow this same pattern:
> registry calls at the top, Express handlers below, same Zod schema for both.

---

## Step 7.6 — Express Server Entry

### src/index.ts

```ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'

// Import routes (also triggers OpenAPI registry calls)
import { authRouter } from './routes/auth.js'
import { balanceRouter } from './routes/balance.js'
import { transactionsRouter } from './routes/transactions.js'
import { budgetsRouter } from './routes/budgets.js'
import { potsRouter } from './routes/pots.js'

import { generateDocument } from './lib/openapi.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(helmet())
app.use(cors())
app.use(express.json())

// Swagger UI — live spec from registry (always in sync)
const spec = generateDocument()
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))
app.get('/openapi.json', (_req, res) => res.json(spec))

// Routes
app.use('/auth', authRouter)
app.use('/balance', balanceRouter)
app.use('/transactions', transactionsRouter)
app.use('/budgets', budgetsRouter)
app.use('/pots', potsRouter)

app.listen(PORT, () => {
  console.error(`API server running on port ${PORT}`)
})
```

> Swagger UI at `http://localhost:3001/docs` uses the live-generated spec —
> no separate file needed at runtime. The `generate:spec` script is only
> for producing the YAML that HeyAPI consumes.

---

## Step 7.7 — Generate HTTP Client with HeyAPI

### packages/http-client/package.json

```json
{
  "name": "@financial-app/http-client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": { "import": "./src/index.ts" }
  },
  "scripts": {
    "generate": "openapi-ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@hey-api/client-fetch": "^0.9.0"
  },
  "devDependencies": {
    "@hey-api/openapi-ts": "^0.66.0",
    "typescript": "catalog:"
  }
}
```

### packages/http-client/openapi-ts.config.ts

```ts
import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: '../../apps/api/openapi.yaml',
  output: {
    path: 'src/generated',
    format: 'prettier',
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
  ],
})
```

### packages/http-client/src/index.ts

```ts
export { client } from '@hey-api/client-fetch'
export * from './generated/sdk.gen.js'
export type * from './generated/types.gen.js'
```

---

## Step 7.8 — Add to Apps

```bash
pnpm --filter mobile-financial-app add @financial-app/http-client@workspace:^
pnpm --filter mobile-expo-financial-app add @financial-app/http-client@workspace:^
pnpm --filter mobile-expo-ejected-financial-app add @financial-app/http-client@workspace:^
pnpm --filter web-financial-app add @financial-app/http-client@workspace:^
```

### Usage in apps

```ts
import { client, getTransactions, getBudgets } from '@financial-app/http-client'

// Configure base URL once (app root)
client.setConfig({
  baseUrl: 'http://localhost:3001',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})

// Type-safe API calls — types come from Zod schemas via generated spec
const { data } = await getTransactions({ query: { page: 1, limit: 10 } })
const { data: budgets } = await getBudgets()
```

---

## Step 7.9 — TanStack Query Hooks (post-generation)

Once the HTTP client exists, add TanStack Query hooks to `@financial-app/shared`
(or keep them in a dedicated `hooks/` directory in `http-client`).

```bash
pnpm --filter @financial-app/shared add @tanstack/react-query
```

```ts
// packages/shared/src/hooks/useTransactions.ts
import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '@financial-app/http-client'

export function useTransactions(params?: { page?: number; category?: string }) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => getTransactions({ query: params }),
  })
}
```

---

## Step 7.10 — Root Scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "api:dev": "pnpm --filter api-financial-app dev",
    "api:generate-spec": "pnpm --filter api-financial-app generate:spec",
    "api:generate-client": "pnpm api:generate-spec && pnpm --filter @financial-app/http-client generate"
  }
}
```

> `api:generate-client` runs both steps in sequence:
> Zod → openapi.yaml → HeyAPI client. One command, full pipeline.

---

## Step 7.11 — Environment Variables

### apps/api/.env

```
PORT=3001
SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard>
```

Add to `.env.example` and `.gitignore`.

---

## Workflow

```
Zod schemas in src/schemas/
  │
  ├──► Express routes: runtime validation (validateBody/validateQuery)
  │
  ├──► OpenAPI registry: registerPath() calls in each route file
  │        │
  │        ├──► Swagger UI at /docs (live, always in sync)
  │        │
  │        └──► generate:spec → openapi.yaml
  │                  │
  │                  └──► HeyAPI → src/generated/ (types + SDK)
  │                            │
  │                            └──► Apps consume type-safe client
  │
  └──► Domain types shared between API internals
```

When the API contract changes:
1. Update the Zod schema in `src/schemas/`
2. Update the Express handler if needed
3. Run `pnpm api:generate-client` (spec + client in one command)
4. TypeScript catches any breaking changes in consuming apps

---

## Completion Criteria

- [ ] Zod schemas define all domain entities (auth, balance, transactions, budgets, pots)
- [ ] All routes register OpenAPI paths via the registry
- [ ] `pnpm api:generate-spec` produces a valid `openapi.yaml`
- [ ] `apps/api/` runs with `pnpm api:dev` on port 3001
- [ ] Swagger UI accessible at `http://localhost:3001/docs`
- [ ] All routes use `validateBody`/`validateQuery` middleware with Zod schemas
- [ ] Auth middleware validates Supabase JWT tokens
- [ ] `packages/http-client/` generates from the OpenAPI spec
- [ ] Generated SDK is type-safe and exports all operations
- [ ] At least one app consumes `@financial-app/http-client` successfully
- [ ] `pnpm type-check && pnpm lint && pnpm test` passes

## Next

-> docs/plans/phase-6-turborepo.md (Turborepo should be added last to orchestrate all packages including api and http-client)
