# Phase 7 — API Server & HTTP Client

## Goal

Create two new packages:

1. **`apps/api/`** — Express REST API backed by Supabase, designed from an OpenAPI specification
2. **`@financial-app/http-client`** (`packages/http-client/`) — generated TypeScript client using HeyAPI from the OpenAPI spec

The OpenAPI spec is the single source of truth: it defines the API contract, drives the Express route validation, and generates the type-safe HTTP client consumed by mobile and web apps.

## Status: TODO (requires Phase 5 complete — shared types needed)

---

## Step 7.1 — Write the OpenAPI Specification

Create the OpenAPI 3.1 spec as the contract for the entire API surface.

### apps/api/openapi.yaml

Define all resources: auth, balances, transactions, budgets, pots.

```yaml
openapi: 3.1.0
info:
  title: Financial App API
  version: 1.0.0
  description: REST API for the Personal Finance application

servers:
  - url: http://localhost:3001
    description: Local development

paths:
  /auth/login:
    post:
      operationId: login
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Authenticated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'

  /auth/register:
    post:
      operationId: register
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'

  /balance:
    get:
      operationId: getBalance
      tags: [Balance]
      security: [{ BearerAuth: [] }]
      responses:
        '200':
          description: User balance
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Balance'

  /transactions:
    get:
      operationId: getTransactions
      tags: [Transactions]
      security: [{ BearerAuth: [] }]
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 10 }
        - name: category
          in: query
          schema: { type: string }
        - name: search
          in: query
          schema: { type: string }
        - name: sort
          in: query
          schema: { type: string, enum: [latest, oldest, a-z, z-a, highest, lowest] }
      responses:
        '200':
          description: Paginated transactions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TransactionList'

  /budgets:
    get:
      operationId: getBudgets
      tags: [Budgets]
      security: [{ BearerAuth: [] }]
      responses:
        '200':
          description: All budgets
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Budget'
    post:
      operationId: createBudget
      tags: [Budgets]
      security: [{ BearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateBudgetRequest'
      responses:
        '201':
          description: Budget created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Budget'

  /budgets/{id}:
    put:
      operationId: updateBudget
      tags: [Budgets]
      security: [{ BearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateBudgetRequest'
      responses:
        '200':
          description: Budget updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Budget'
    delete:
      operationId: deleteBudget
      tags: [Budgets]
      security: [{ BearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        '204':
          description: Budget deleted

  /pots:
    get:
      operationId: getPots
      tags: [Pots]
      security: [{ BearerAuth: [] }]
      responses:
        '200':
          description: All pots
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pot'
    post:
      operationId: createPot
      tags: [Pots]
      security: [{ BearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePotRequest'
      responses:
        '201':
          description: Pot created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pot'

  /pots/{id}:
    put:
      operationId: updatePot
      tags: [Pots]
      security: [{ BearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdatePotRequest'
      responses:
        '200':
          description: Pot updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pot'
    delete:
      operationId: deletePot
      tags: [Pots]
      security: [{ BearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        '204':
          description: Pot deleted

  /pots/{id}/add:
    post:
      operationId: addMoneyToPot
      tags: [Pots]
      security: [{ BearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PotAmountRequest'
      responses:
        '200':
          description: Money added
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pot'

  /pots/{id}/withdraw:
    post:
      operationId: withdrawFromPot
      tags: [Pots]
      security: [{ BearerAuth: [] }]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PotAmountRequest'
      responses:
        '200':
          description: Money withdrawn
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pot'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email: { type: string, format: email }
        password: { type: string, minLength: 8 }

    RegisterRequest:
      type: object
      required: [name, email, password]
      properties:
        name: { type: string, minLength: 2 }
        email: { type: string, format: email }
        password: { type: string, minLength: 8 }

    AuthResponse:
      type: object
      properties:
        accessToken: { type: string }
        user:
          $ref: '#/components/schemas/User'

    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        email: { type: string }
        displayName: { type: string }

    Balance:
      type: object
      properties:
        current: { type: number }
        income: { type: number }
        expenses: { type: number }

    Transaction:
      type: object
      properties:
        id: { type: string, format: uuid }
        avatar: { type: string }
        name: { type: string }
        category: { type: string }
        date: { type: string, format: date-time }
        amount: { type: number }
        recurring: { type: boolean }

    TransactionList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Transaction'
        page: { type: integer }
        totalPages: { type: integer }
        total: { type: integer }

    Budget:
      type: object
      properties:
        id: { type: string, format: uuid }
        category: { type: string }
        maximum: { type: number }
        theme: { type: string }
        spent: { type: number }

    CreateBudgetRequest:
      type: object
      required: [category, maximum, theme]
      properties:
        category: { type: string }
        maximum: { type: number }
        theme: { type: string }

    UpdateBudgetRequest:
      type: object
      properties:
        category: { type: string }
        maximum: { type: number }
        theme: { type: string }

    Pot:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        target: { type: number }
        total: { type: number }
        theme: { type: string }

    CreatePotRequest:
      type: object
      required: [name, target, theme]
      properties:
        name: { type: string }
        target: { type: number }
        theme: { type: string }

    UpdatePotRequest:
      type: object
      properties:
        name: { type: string }
        target: { type: number }
        theme: { type: string }

    PotAmountRequest:
      type: object
      required: [amount]
      properties:
        amount: { type: number, minimum: 0.01 }
```

---

## Step 7.2 — Scaffold apps/api/

```bash
mkdir -p apps/api/src/routes apps/api/src/middleware
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
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "catalog:",
    "express": "^5.1.0",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "zod": "catalog:"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/cors": "^2.8.17",
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

## Step 7.3 — Express Server + Routes

### src/index.ts

```ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { authRouter } from './routes/auth.js'
import { balanceRouter } from './routes/balance.js'
import { transactionsRouter } from './routes/transactions.js'
import { budgetsRouter } from './routes/budgets.js'
import { potsRouter } from './routes/pots.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)
app.use('/balance', balanceRouter)
app.use('/transactions', transactionsRouter)
app.use('/budgets', budgetsRouter)
app.use('/pots', potsRouter)

app.listen(PORT, () => {
  console.error(`API server running on port ${PORT}`)
})
```

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

### src/lib/supabase.ts

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
)
```

> The API uses the **service role key** (not the anon key) to bypass RLS and enforce access control at the Express middleware level.

---

## Step 7.4 — Route Implementation Pattern

Each route file follows this pattern:

```ts
// src/routes/budgets.ts
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

export const budgetsRouter = Router()

budgetsRouter.use(requireAuth)

const createBudgetSchema = z.object({
  category: z.string(),
  maximum: z.number(),
  theme: z.string(),
})

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

budgetsRouter.post('/', async (req, res) => {
  const parsed = createBudgetSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const { data, error } = await supabase
    .from('budgets')
    .insert({ ...parsed.data, user_id: res.locals.userId })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.status(201).json(data)
})

// PUT /:id, DELETE /:id follow the same pattern
```

---

## Step 7.5 — Serve the OpenAPI Spec

Expose the spec at runtime for documentation and client generation:

```bash
pnpm --filter api-financial-app add swagger-ui-express yaml
pnpm --filter api-financial-app add -D @types/swagger-ui-express
```

### src/index.ts (add before routes)

```ts
import swaggerUi from 'swagger-ui-express'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'

const specPath = path.resolve(import.meta.dirname, '../openapi.yaml')
const spec = yaml.parse(fs.readFileSync(specPath, 'utf8'))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))
app.get('/openapi.yaml', (_req, res) => {
  res.type('text/yaml').send(fs.readFileSync(specPath, 'utf8'))
})
```

Swagger UI available at `http://localhost:3001/docs`.

---

## Step 7.6 — Generate HTTP Client with HeyAPI

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

### Generate command

```bash
pnpm --filter @financial-app/http-client generate
```

This reads `apps/api/openapi.yaml` and generates:
- `src/generated/types.gen.ts` — all request/response TypeScript types
- `src/generated/sdk.gen.ts` — type-safe fetch functions per operation

### packages/http-client/src/index.ts

```ts
export { client } from '@hey-api/client-fetch'
export * from './generated/sdk.gen.js'
export type * from './generated/types.gen.js'
```

---

## Step 7.7 — Add to Apps

```bash
pnpm --filter mobile-financial-app add @financial-app/http-client@workspace:^
pnpm --filter web-financial-app add @financial-app/http-client@workspace:^
```

### Usage in apps

```ts
import { client, getTransactions, getBudgets } from '@financial-app/http-client'

// Configure base URL once
client.setConfig({
  baseUrl: 'http://localhost:3001',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

// Type-safe API calls
const { data } = await getTransactions({ query: { page: 1, limit: 10 } })
const { data: budgets } = await getBudgets()
```

---

## Step 7.8 — Root Scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "api:dev": "pnpm --filter api-financial-app dev",
    "api:generate-client": "pnpm --filter @financial-app/http-client generate"
  }
}
```

---

## Step 7.9 — Environment Variables

### apps/api/.env

```
PORT=3001
SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Add to `.env.example` and `.gitignore`.

---

## Workflow

```
openapi.yaml  (single source of truth)
     │
     ├──► apps/api/          Express validates requests against spec schemas (zod)
     │
     └──► packages/http-client/
              └── src/generated/   HeyAPI generates types + SDK from spec
                       │
                       └──► apps/mobile, apps/web consume type-safe client
```

When the API contract changes:
1. Update `apps/api/openapi.yaml`
2. Update the Express route + zod schema to match
3. Run `pnpm api:generate-client` to regenerate the HTTP client
4. TypeScript catches any breaking changes in consuming apps

---

## Completion Criteria

- [ ] `apps/api/openapi.yaml` defines all endpoints
- [ ] `apps/api/` runs with `pnpm api:dev` on port 3001
- [ ] Swagger UI accessible at `http://localhost:3001/docs`
- [ ] All routes use zod validation matching the OpenAPI spec
- [ ] Auth middleware validates Supabase JWT tokens
- [ ] `packages/http-client/` generates from the OpenAPI spec
- [ ] Generated SDK is type-safe and exports all operations
- [ ] At least one app consumes `@financial-app/http-client` successfully
- [ ] `pnpm type-check && pnpm lint && pnpm test` passes

## Next

-> docs/plans/phase-6-turborepo.md (Turborepo should be added last to orchestrate all packages including api and http-client)
