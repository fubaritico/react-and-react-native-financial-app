# Supabase Database Setup

Step-by-step guide to set up the database for local development.

## Prerequisites

- A free Supabase account: https://supabase.com

## 1. Create a Supabase project

1. Go to https://app.supabase.com
2. Click **New project**
3. Pick an organization (or create one)
4. Fill in:
   - **Name**: anything (e.g. `financial-app-dev`)
   - **Database Password**: save it somewhere safe
   - **Region**: pick the closest to you
5. Click **Create new project** and wait for it to spin up (~1 minute)

## 2. Run the schema SQL

1. In the Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `supabase/setup.sql` from this repo, copy the entire contents
4. Paste into the SQL Editor
5. Click **Run** (or Cmd+Enter)
6. You should see "Success. No rows returned" — this is normal, it created tables

### Verify

Go to **Table Editor** in the left sidebar. You should see these tables:
- `balances`
- `transactions`
- `budgets`
- `pots`
- `user_preferences`

All empty for now.

## 3. Copy your API keys

1. Go to **Project Settings** > **API** (left sidebar, gear icon at bottom)
2. Copy these values:

| Dashboard field | `.env` variable |
|----------------|-----------------|
| **Project URL** | `SUPABASE_URL` |
| **anon public** (under Project API keys) | `SUPABASE_ANON_KEY` |
| **service_role secret** (click to reveal) | `SUPABASE_SERVICE_ROLE_KEY` |

3. Fill them in your `.env` files (see README step 6 for all files to configure):

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbG...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key
```

> The service role key is only needed by `apps/api/` (the server). Client apps use the anon key.

## 4. Seed mock data

From the monorepo root:

```bash
pnpm seed
```

This creates a test user (`test@dev.com`), populates all tables with mock data (49 transactions, 4 budgets, 5 pots, balance with `reference: 3641.50`), and marks onboarding as complete. Re-running resets and re-seeds the same user.

The seed script starts the API server automatically if it's not already running.

## 5. Verify the RPC functions

In the SQL Editor, run:

```sql
-- Replace with the user UUID shown by pnpm seed
select * from public.get_balance('your-user-uuid-here', null);
```

Expected result: one row with `current` (= reference + income − expenses − pots), `income`, `expenses`.

```sql
select * from public.get_budgets_with_spent('your-user-uuid-here', '2024-08');
```

Expected result: 4 rows (Entertainment, Bills, Dining Out, Personal Care) with `spent` computed.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "permission denied for table balances" | RLS is enabled but you're not authenticated. Use the service role key in `apps/api/`, or query via the app (which sends the JWT). |
| `pnpm seed` fails with connection error | API server can't reach Supabase. Check `apps/api/.env` has correct `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. |
| `pnpm seed` fails with "already been registered" then no user found | Supabase auth list users API issue. Try deleting the user in the dashboard first, then re-run. |
| get_balance returns no rows | No balance row exists for that user. Run `pnpm seed` or insert one manually. |
| Tables don't appear in Table Editor | The SQL didn't run successfully. Check for error messages in the SQL Editor output. |

## Resetting data for a user

Re-running `pnpm seed` deletes all existing data for the test user and re-inserts everything from `data.json`. This is the recommended way to reset.

To reset all data manually (all users, keep tables):

```sql
truncate public.balances, public.transactions, public.budgets, public.pots, public.user_preferences cascade;
```

To drop everything and re-run setup.sql:

```sql
drop table if exists public.user_preferences cascade;
drop table if exists public.pots cascade;
drop table if exists public.budgets cascade;
drop table if exists public.transactions cascade;
drop table if exists public.balances cascade;
drop function if exists public.update_updated_at();
drop function if exists public.get_balance(uuid, text);
drop function if exists public.get_budgets_with_spent(uuid, text);
```

Then re-run `setup.sql`.
