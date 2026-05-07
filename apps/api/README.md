# API Server

Express 5 REST API backed by Supabase. Serves as the single backend for the mobile and web apps.

## Stack

| Layer          | Choice                              |
|----------------|-------------------------------------|
| Runtime        | Node 20+ / tsx (dev)                |
| Framework      | Express 5                           |
| Validation     | Zod                                 |
| OpenAPI        | @asteasolutions/zod-to-openapi      |
| Database       | Supabase (Postgres + Auth)          |
| Auth           | Supabase JWT via `getUser()` — no local secret |
| Docs           | Swagger UI at `/docs`               |

## Quick Start

```bash
# 1. Copy environment variables
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

# 2. Install dependencies (from monorepo root)
pnpm install

# 3. Start dev server
pnpm api:dev
# Server: http://localhost:3001
# Swagger: http://localhost:3001/docs
```

## Environment Variables

| Variable                    | Description                          |
|-----------------------------|--------------------------------------|
| `PORT`                      | Server port (default: `3001`)        |
| `SUPABASE_URL`              | Supabase project URL                 |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS)      |

`.env` is loaded automatically via Node's `--env-file` flag in dev/start scripts.

## Authentication

All routes (except `/health`) require a valid Supabase JWT in the `Authorization` header:

```
Authorization: Bearer <supabase_access_token>
```

The middleware calls `supabase.auth.getUser(token)` to validate the token — no local JWT verification, no legacy HS256 secret. This supports Supabase's ECC P-256 signing keys.

### Getting a Token

```bash
curl -X POST https://<PROJECT>.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: <SUPABASE_ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"<PASSWORD>"}'
```

The response contains `access_token` and `refresh_token`.

### Using Swagger UI

1. Open `http://localhost:3001/docs`
2. Click **Authorize**
3. Paste the `access_token`
4. All routes will include the token automatically

## Routes

### Health

| Method | Path      | Auth | Description    |
|--------|-----------|------|----------------|
| GET    | `/health` | No   | Health check   |

### Balance

| Method | Path       | Auth | Description                          |
|--------|------------|------|--------------------------------------|
| GET    | `/balance` | Yes  | Computed balance (current/income/expenses). Optional `?month=YYYY-MM` filter. |

### Transactions

| Method | Path            | Auth | Description                |
|--------|-----------------|------|----------------------------|
| GET    | `/transactions` | Yes  | Paginated list with filters |

Query params: `page` (default 1), `limit` (default 10), `category`, `search`, `sort` (`latest`, `oldest`, `a-z`, `z-a`, `highest`, `lowest`).

### Budgets

| Method | Path           | Auth | Description                     |
|--------|----------------|------|---------------------------------|
| GET    | `/budgets`     | Yes  | Budgets with spent (RPC). Requires `?month=YYYY-MM`. |
| POST   | `/budgets`     | Yes  | Create a budget                 |
| PUT    | `/budgets/:id` | Yes  | Update a budget                 |
| DELETE | `/budgets/:id` | Yes  | Delete a budget                 |

### Pots

| Method | Path                 | Auth | Description              |
|--------|----------------------|------|--------------------------|
| GET    | `/pots`              | Yes  | All pots                 |
| POST   | `/pots`              | Yes  | Create a pot             |
| PUT    | `/pots/:id`          | Yes  | Update a pot             |
| DELETE | `/pots/:id`          | Yes  | Delete a pot             |
| POST   | `/pots/:id/add`      | Yes  | Add money to a pot       |
| POST   | `/pots/:id/withdraw` | Yes  | Withdraw money from a pot|

### Recurring Bills

| Method | Path               | Auth | Description                              |
|--------|--------------------|------|------------------------------------------|
| GET    | `/recurring-bills` | Yes  | Deduplicated by name, latest occurrence  |

## Project Structure

```
src/
  index.ts              # Express app entry point
  lib/
    openapi.ts          # OpenAPI registry + document generator
    supabase.ts         # Supabase admin client (service role)
    generate-spec.ts    # CLI: generates openapi.yaml from registry
  middleware/
    auth.ts             # requireAuth — validates Supabase JWT
    validate.ts         # validateBody / validateQuery — Zod middleware
  routes/
    balance.ts          # GET /balance
    transactions.ts     # GET /transactions
    budgets.ts          # CRUD /budgets
    pots.ts             # CRUD /pots + add/withdraw
    recurring-bills.ts  # GET /recurring-bills
  schemas/
    balance.ts          # Zod + OpenAPI metadata
    transaction.ts
    budget.ts
    pot.ts
    recurring-bill.ts
```

## Scripts

| Script             | Description                            |
|--------------------|----------------------------------------|
| `pnpm api:dev`     | Start dev server with hot reload (tsx) |
| `pnpm api:generate-spec` | Generate `openapi.yaml` from registry |
| `pnpm build`       | Compile TypeScript to `dist/`          |
| `pnpm type-check`  | Type check without emitting            |
| `pnpm lint`        | ESLint on `src/`                       |

## Supabase RPCs

The API uses three Supabase RPCs defined in `supabase/setup.sql`:

- **`get_balance(p_user_id, p_month?)`** — computes `current = reference - SUM(pots.total)`, `income`, `expenses`
- **`get_budgets_with_spent(p_user_id, p_month)`** — returns budgets with computed `spent` from transactions
- **`get_recurring_bills(p_user_id)`** — deduplicates recurring transactions by name, returns latest occurrence

## Troubleshooting

### Android Emulator Cannot Reach the API

The Android emulator uses `10.0.2.2` to reach the host machine's `localhost`. If the emulator can access the internet but not the API server, the most likely cause is that Node.js is listening on the IPv6 loopback (`::1`) instead of all interfaces.

**Fix**: the server binds explicitly to `0.0.0.0` in `src/index.ts`:

```ts
app.listen(PORT, '0.0.0.0', () => { ... })
```

If you still can't reach the API from the emulator:

1. Verify the server is running: `curl http://localhost:3001/health`
2. Check the Expo app remaps `localhost` → `10.0.2.2` for Android (`_layout.tsx`)
3. Try `adb reverse tcp:3001 tcp:3001` as a fallback — this forwards the emulator's `localhost:3001` to the host
4. Cold boot the emulator (Android Studio → Device Manager → ⋮ → Cold Boot Now)

## Design Decisions

- **Service role key**: the API uses Supabase's service role key (bypasses RLS). Access control is enforced at the Express middleware level by filtering on `user_id`.
- **No auth routes**: signup/login/OAuth stays 100% client-side via the Supabase SDK. The API only validates existing tokens.
- **Zod = single source of truth**: schemas serve both runtime validation and OpenAPI spec generation.
- **No dotenv dependency**: Node 20+'s `--env-file` flag handles `.env` loading in dev/start scripts. In production (Netlify), env vars are injected directly.
