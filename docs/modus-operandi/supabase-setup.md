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

Go to **Table Editor** in the left sidebar. You should see 4 tables:
- `balances`
- `transactions`
- `budgets`
- `pots`

All empty for now.

## 3. Copy your API keys

1. Go to **Project Settings** > **API** (left sidebar, gear icon at bottom)
2. Copy these values:

| Dashboard field | `.env` variable |
|----------------|-----------------|
| **Project URL** | `SUPABASE_URL` |
| **anon public** (under Project API keys) | `SUPABASE_ANON_KEY` |
| **service_role secret** (click to reveal) | `SUPABASE_SERVICE_ROLE_KEY` |

3. Fill them in your local `.env` file at the project root:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbG...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key
```

4. Also fill the same `SUPABASE_URL` and `SUPABASE_ANON_KEY` in:
   - `apps/web/.env`
   - `apps/mobile-expo/.env`
   - `apps/mobile/.env`
   - `apps/mobile-expo-ejected/.env`

> The service role key is only needed by `apps/api/` (the server). Client apps use the anon key.

## 4. Create a test user

1. In the dashboard, go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter an email and password (e.g. `test@test.com` / `password123`)
4. Check **Auto Confirm User** (skips email verification)
5. Click **Create user**
6. Copy the **User UID** (the UUID shown in the user row) — you need it for seeding

## 5. Seed mock data (optional)

This inserts the same data used in the hardcoded screens so you can test immediately.

1. Open `supabase/seed.sql` from this repo
2. **Find & Replace** all occurrences of `YOUR_USER_ID_HERE` with the UUID you copied in step 4
3. In the SQL Editor, paste the modified content
4. Click **Run**
5. Go to **Table Editor** and verify data appears in all 4 tables

## 6. Verify the RPC functions

In the SQL Editor, run:

```sql
-- Replace with your user UUID
select * from public.get_balance('your-user-uuid-here');
```

Expected result: one row with `current`, `income`, `expenses` values.

```sql
select * from public.get_budgets_with_spent('your-user-uuid-here', '2024-08');
```

Expected result: 4 rows (Entertainment, Bills, Dining Out, Personal Care) with `spent` computed.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "permission denied for table balances" | RLS is enabled but you're not authenticated. Use the service role key in `apps/api/`, or query via the app (which sends the JWT). |
| seed.sql fails with "violates foreign key constraint" | You forgot to replace `YOUR_USER_ID_HERE`, or the user doesn't exist in Auth. |
| get_balance returns no rows | No balance row exists for that user. Run seed.sql or insert one manually. |
| Tables don't appear in Table Editor | The SQL didn't run successfully. Check for error messages in the SQL Editor output. |

## Resetting the database

To start fresh (delete all data but keep tables):

```sql
truncate public.balances, public.transactions, public.budgets, public.pots cascade;
```

To drop everything and re-run setup.sql:

```sql
drop table if exists public.pots cascade;
drop table if exists public.budgets cascade;
drop table if exists public.transactions cascade;
drop table if exists public.balances cascade;
drop function if exists public.update_updated_at();
drop function if exists public.get_balance(uuid, char);
drop function if exists public.get_budgets_with_spent(uuid, char);
```

Then re-run `setup.sql`.
