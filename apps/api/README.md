# API Server

Express 5 REST API backed by Supabase. Serves as the single backend for the mobile and web apps.

## Stack

| Layer      | Choice                                         |
| ---------- | ---------------------------------------------- |
| Runtime    | Node 20+ / tsx (dev)                           |
| Framework  | Express 5                                      |
| Validation | Zod                                            |
| OpenAPI    | @asteasolutions/zod-to-openapi                 |
| Database   | Supabase (Postgres + Auth)                     |
| Auth       | Supabase JWT via `getUser()` — no local secret |
| Docs       | Swagger UI at `/docs`                          |

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

| Variable                    | Description                     |
| --------------------------- | ------------------------------- |
| `PORT`                      | Server port (default: `3001`)   |
| `SUPABASE_URL`              | Supabase project URL            |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) |

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

| Method | Path      | Auth | Description  |
| ------ | --------- | ---- | ------------ |
| GET    | `/health` | No   | Health check |

### Balance

| Method | Path       | Auth | Description                                                                   |
| ------ | ---------- | ---- | ----------------------------------------------------------------------------- |
| GET    | `/balance` | Yes  | Computed balance (current/income/expenses). Optional `?month=YYYY-MM` filter. |

### Transactions

| Method | Path            | Auth | Description                 |
| ------ | --------------- | ---- | --------------------------- |
| GET    | `/transactions` | Yes  | Paginated list with filters |

Query params: `page` (default 1), `limit` (default 10), `category`, `search`, `sort` (`latest`, `oldest`, `a-z`, `z-a`, `highest`, `lowest`).

### Budgets

| Method | Path           | Auth | Description                                          |
| ------ | -------------- | ---- | ---------------------------------------------------- |
| GET    | `/budgets`     | Yes  | Budgets with spent (RPC). Requires `?month=YYYY-MM`. |
| POST   | `/budgets`     | Yes  | Create a budget                                      |
| PUT    | `/budgets/:id` | Yes  | Update a budget                                      |
| DELETE | `/budgets/:id` | Yes  | Delete a budget                                      |

### Pots

| Method | Path                 | Auth | Description               |
| ------ | -------------------- | ---- | ------------------------- |
| GET    | `/pots`              | Yes  | All pots                  |
| POST   | `/pots`              | Yes  | Create a pot              |
| PUT    | `/pots/:id`          | Yes  | Update a pot              |
| DELETE | `/pots/:id`          | Yes  | Delete a pot              |
| POST   | `/pots/:id/add`      | Yes  | Add money to a pot        |
| POST   | `/pots/:id/withdraw` | Yes  | Withdraw money from a pot |

### Recurring Bills

| Method | Path               | Auth | Description                             |
| ------ | ------------------ | ---- | --------------------------------------- |
| GET    | `/recurring-bills` | Yes  | Deduplicated by name, latest occurrence |

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

| Script                   | Description                            |
| ------------------------ | -------------------------------------- |
| `pnpm api:dev`           | Start dev server with hot reload (tsx) |
| `pnpm api:generate-spec` | Generate `openapi.yaml` from registry  |
| `pnpm build`             | Compile TypeScript to `dist/`          |
| `pnpm type-check`        | Type check without emitting            |
| `pnpm lint`              | ESLint on `src/`                       |

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

## Deployment — Fly.io

The API runs as an always-on container on [Fly.io](https://fly.io) (region `cdg` — Paris).

### Prerequisites

```bash
brew install flyctl
fly auth login
```

### First deploy (step by step)

```bash
# 1. Install Fly CLI
brew install flyctl

# 2. Login
fly auth login

# 3. Create the app (one-time — from apps/api/)
cd apps/api
fly launch
# → Choose app name: epouch-api
# → Choose region: cdg (Paris)
# → Say NO to "deploy now" — we need to set secrets first
# → Ignore npm errors (monorepo uses pnpm workspace:^ protocol)

# 4. Go back to monorepo root (CRITICAL — Docker needs monorepo context)
cd ../..

# 5. Set secrets (one-time — replace values with your own)
fly secrets set \
  SUPABASE_URL="<your Supabase project URL>" \
  SUPABASE_SERVICE_ROLE_KEY="<your service role key>" \
  SENTRY_DSN="<your Sentry DSN>" \
  ALLOWED_ORIGINS="https://epouch-web.netlify.app,http://localhost:5173,http://localhost:3000"

# 6. Deploy (from monorepo root — fly.toml is here)
fly deploy

# 7. Verify
curl https://epouch-api.fly.dev/health

# 8. Update VITE_API_URL in GitHub Secrets
#    → Go to GitHub repo → Settings → Secrets → Actions
#    → Change VITE_API_URL to: https://epouch-api.fly.dev
#    → Re-trigger the web deploy workflow (or push a commit)
```

> **Why from monorepo root?** `fly.toml` lives at the repo root. The Dockerfile uses
> `COPY pnpm-lock.yaml ...`, `COPY packages/prisma/ ...` — paths relative to the monorepo root.
> Running from `apps/api/` makes Docker unable to find these files.

### Subsequent deploys

```bash
# Always from monorepo root
fly deploy
```

### Useful commands

```bash
fly status -a epouch-api          # App status + image info
fly logs -a epouch-api            # Live logs (streaming)
fly secrets list -a epouch-api    # List configured secrets
fly ssh console -a epouch-api     # SSH into the running container
```

### Troubleshooting

| Symptom                                 | Cause                                                              | Fix                                                         |
| --------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| `DNS_PROBE_FINISHED_NXDOMAIN`           | App created but never deployed                                     | Run `fly deploy` from monorepo root                         |
| Container crashes on startup            | Missing secrets                                                    | `fly secrets list -a epouch-api` — set missing ones         |
| `npm install` error during `fly launch` | Monorepo uses pnpm `workspace:^` protocol                          | Ignore — Dockerfile handles install correctly               |
| `chmod: cannot access 'scripts/...'`    | Root `postinstall` runs in Docker but mobile scripts aren't copied | Already fixed: `--ignore-scripts` in Dockerfile             |
| `COPY packages/prisma/ not found`       | Running `fly deploy` from `apps/api/` instead of monorepo root     | `cd` to monorepo root, then `fly deploy`                    |
| Health check fails                      | Wrong port or path                                                 | Verify `fly.toml`: `internal_port = 3001`, path = `/health` |

### Environment Variables (Fly.io secrets)

| Variable                    | Description                     |
| --------------------------- | ------------------------------- |
| `SUPABASE_URL`              | Supabase project URL            |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) |
| `SENTRY_DSN`                | Sentry error tracking DSN       |
| `ALLOWED_ORIGINS`           | Comma-separated CORS origins    |

`NODE_ENV=production` and `PORT=3001` are set in the Dockerfile.

### URL

| Environment      | URL                            |
| ---------------- | ------------------------------ |
| Production       | https://epouch-api.fly.dev     |
| Netlify (legacy) | https://epouch-api.netlify.app |

## Migration History: Netlify → Fly.io

### Why the API was originally on Netlify

The API started as a Netlify Function (AWS Lambda) — same platform as the web app, single dashboard, zero infrastructure to manage. The Express app was wrapped with `serverless-http` to run inside Lambda.

### Problems encountered on Netlify

#### 1. `serverless-http` v3 + Express 5 body parsing (CRITICAL)

POST/PUT/PATCH requests failed with Zod "Required" errors on all fields. `serverless-http@3.2.0` created a stub socket with `readable: false` — Express 5 (via `raw-body`) checks stream readability before consuming the body. Result: `req.body` was always `undefined`.

**Fix**: upgrade `serverless-http` from `^3.2.0` to `^4.0.0` (uses a real `PassThrough` stream).

#### 2. Sentry integration complexity

`@sentry/aws-serverless` `wrapHandler` was initially suspected of consuming the body before Express. This was a false lead (the real cause was #1), but debugging it wasted significant time. Final setup: `@sentry/node` with manual `Sentry.flush(2000)` before Lambda returns.

#### 3. Cold start latency (CRITICAL — reason for migration)

Lambda functions cold-start on every invocation after idle. SSR middleware timing revealed:

| Stage                                       | Netlify Lambda   | Fly.io (always-on) |
| ------------------------------------------- | ---------------- | ------------------ |
| Auth middleware (`getUser` + `getSession`)  | ~500-800ms       | ~200-300ms         |
| Data loader (e.g. home: 5 parallel queries) | ~2000-2700ms     | ~200-500ms         |
| **Total SSR per navigation**                | **~3000-4000ms** | **~500-800ms**     |

The Lambda cold start added 1-2s per API call from the SSR server. With 5 parallel queries in the home loader, this compounded to ~2.7s for data alone. On client-side navigations, React Router loaders block rendering until complete — the user stared at the previous page for 4+ seconds.

#### 4. Region lock (Pro plan required)

Netlify Functions default to `us-east-1`. Co-locating with Supabase (`eu-central-2`, Zurich) required the Pro plan ($20/month) to select `eu-central-1` (Frankfurt).

#### 5. Monorepo deploy complexity

`netlify deploy --no-build` with `--cwd` caused path doubling for `--functions` (`apps/web/apps/web/build/server`). Required careful path resolution and `netlify.toml` configuration to avoid.

### SSR optimizations applied (before migration)

These optimizations reduced latency but couldn't eliminate Lambda cold starts:

1. **Parallel auth** — `Promise.all([getUser(), getSession()])` instead of sequential
2. **Onboarding cookie cache** — `onboarding=<userId>` HttpOnly cookie skips the `getUsersMePreferences` API call (~1-2s saved on repeat visits)
3. **`shouldRevalidate() { return false }`** — prevents React Router from re-running the layout loader on client navigations (saves one full Lambda roundtrip)

### Why Fly.io

| Criteria        | Netlify Lambda                         | Fly.io                                                  |
| --------------- | -------------------------------------- | ------------------------------------------------------- |
| Cold starts     | Yes (1-2s per idle function)           | No (always-on container)                                |
| Region          | `eu-central-1` (Pro plan)              | `cdg` Paris (free)                                      |
| Express 5       | Needs `serverless-http` adapter        | Native Node.js, no adapter                              |
| Pricing         | Free tier generous, but Pro for region | Free tier: 3 shared VMs, 256MB each                     |
| Sentry          | Manual `flush()` before Lambda freeze  | Standard `@sentry/node` (process stays alive)           |
| Docker          | Not applicable                         | Standard Dockerfile                                     |
| Monorepo deploy | Complex path resolution                | `fly deploy` from root with `--config` + `--dockerfile` |

**Decision**: the always-on container eliminates the primary bottleneck (cold starts) while simplifying the runtime (no `serverless-http`, no Lambda adapter, no manual Sentry flush). The API is a single Express server — it doesn't benefit from Lambda's scale-to-zero model since SSR calls it on every navigation.

### Netlify (legacy) — kept for reference

The web app (`epouch-web.netlify.app`) remains on Netlify with `@netlify/vite-plugin-react-router` for SSR. Only the API moved to Fly.io. The old API site (`epouch-api.netlify.app`) is decommissioned.

Legacy files still in repo:

- `apps/api/netlify/functions/api.ts` — Lambda handler (uses `serverless-http`)
- `apps/api/netlify.toml` — Netlify function config

## Design Decisions

- **Service role key**: the API uses Supabase's service role key (bypasses RLS). Access control is enforced at the Express middleware level by filtering on `user_id`.
- **No auth routes**: signup/login/OAuth stays 100% client-side via the Supabase SDK. The API only validates existing tokens.
- **Zod = single source of truth**: schemas serve both runtime validation and OpenAPI spec generation.
- **No dotenv dependency**: Node 20+'s `--env-file` flag handles `.env` loading in dev/start scripts. In production (Netlify), env vars are injected directly.
