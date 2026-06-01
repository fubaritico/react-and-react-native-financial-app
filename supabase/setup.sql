-- =============================================================================
-- Financial App — Database Setup
-- =============================================================================
-- Run this in the Supabase SQL Editor on a fresh project (BEFORE seed.sql).
-- Re-runnable (create-if-not-exists / create-or-replace / drop-if-exists).
--
-- Aligned with the live schema (custom-categories migration):
--   - per-user `categories` (system categories seeded per user, is_system = true)
--   - `user_preferences` holds the reference balance + currency (no `balances` table)
--   - `transactions` / `budgets` reference categories via `category_id`
--
-- Tables : categories, user_preferences, transactions, budgets, pots
-- RPCs   : get_balance, get_budgets_with_spent, get_recurring_bills, update_pot_total
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared trigger function — bumps updated_at on every UPDATE
-- ---------------------------------------------------------------------------
create or replace function public.update_updated_at()
  returns trigger
  language plpgsql
  set search_path to ''
as $function$
begin
  new.updated_at := now();
  return new;
end;
$function$;

-- ---------------------------------------------------------------------------
-- 1. Categories (per-user; system categories duplicated per user)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       varchar(50) not null,
  icon       varchar(50) not null,
  color      varchar(20) not null,
  is_system  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_categories_user on public.categories(user_id);
create unique index if not exists idx_categories_user_name on public.categories(user_id, name);

-- ---------------------------------------------------------------------------
-- 2. User preferences (one row per user; holds the reference balance)
-- ---------------------------------------------------------------------------
create table if not exists public.user_preferences (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  mode                text check (mode in ('manual', 'bank')),
  has_seen_onboarding boolean default false,
  initial_balance_set boolean default false,
  currency            text not null default 'USD' check (currency in ('USD', 'EUR', 'GBP')),
  reference_balance   numeric(12, 2) not null default 0 check (reference_balance >= 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_user_preferences_user on public.user_preferences(user_id);
drop trigger if exists user_preferences_updated_at on public.user_preferences;
create trigger user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Transactions
-- ---------------------------------------------------------------------------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  name        text not null,
  date        timestamptz not null default now(),
  amount      numeric(12, 2) not null check (amount <> 0),
  recurring   boolean not null default false,
  source      text not null default 'manual',
  external_id text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_txn_user_date on public.transactions(user_id, date desc);
create index if not exists idx_txn_user_category on public.transactions(user_id, category_id);
create index if not exists idx_txn_recurring on public.transactions(user_id) where recurring = true;
create unique index if not exists idx_txn_external on public.transactions(user_id, external_id) where external_id is not null;
drop trigger if exists transactions_updated_at on public.transactions;
create trigger transactions_updated_at
  before update on public.transactions
  for each row execute function public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Budgets (one per user / category / month)
-- ---------------------------------------------------------------------------
create table if not exists public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  maximum     numeric(12, 2) not null,
  month       char(7) not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, category_id, month)
);
create index if not exists idx_budget_user_month on public.budgets(user_id, month);
drop trigger if exists budgets_updated_at on public.budgets;
create trigger budgets_updated_at
  before update on public.budgets
  for each row execute function public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 5. Pots
-- ---------------------------------------------------------------------------
create table if not exists public.pots (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  target     numeric(12, 2) not null,
  total      numeric(12, 2) not null default 0,
  theme      text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_pots_user on public.pots(user_id);
drop trigger if exists pots_updated_at on public.pots;
create trigger pots_updated_at
  before update on public.pots
  for each row execute function public.update_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- All tables are user-scoped. The API uses the service-role key (which bypasses
-- RLS); these policies gate any direct authenticated client access.
alter table public.categories       enable row level security;
alter table public.user_preferences enable row level security;
alter table public.transactions     enable row level security;
alter table public.budgets          enable row level security;
alter table public.pots             enable row level security;

-- NOTE: in the live DB `categories` has RLS enabled but NO policy — it is
-- read/written exclusively through the service-role API. Mirrored here as-is.

drop policy if exists "own_data" on public.user_preferences;
create policy "own_data" on public.user_preferences
  for all to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "own_data" on public.transactions;
create policy "own_data" on public.transactions
  for all to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "own_data" on public.budgets;
create policy "own_data" on public.budgets
  for all to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "own_data" on public.pots;
create policy "own_data" on public.pots
  for all to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- RPC functions (verbatim from the live database — pg_get_functiondef)
-- ---------------------------------------------------------------------------

-- get_balance: current balance + income/expenses (optionally month-scoped).
-- current = reference_balance + income + expenses(neg) - pots reserved
create or replace function public.get_balance(p_user_id uuid, p_month text default null::text)
  returns table(current numeric, income numeric, expenses numeric)
  language sql
  stable
  set search_path to ''
as $function$
    SELECT
      up.reference_balance
        + COALESCE(SUM(t.amount) FILTER (WHERE t.amount > 0), 0)
        + COALESCE(SUM(t.amount) FILTER (WHERE t.amount < 0), 0)
        - COALESCE(p.reserved, 0)
      AS current,
      COALESCE(SUM(t.amount) FILTER (
        WHERE t.amount > 0
          AND (p_month IS NULL OR to_char(t.date, 'YYYY-MM') = p_month)
      ), 0) AS income,
      COALESCE(ABS(SUM(t.amount) FILTER (
        WHERE t.amount < 0
          AND (p_month IS NULL OR to_char(t.date, 'YYYY-MM') = p_month)
      )), 0) AS expenses
    FROM public.user_preferences up
    LEFT JOIN public.transactions t ON t.user_id = up.user_id
    LEFT JOIN (
      SELECT user_id, SUM(total) AS reserved
      FROM public.pots
      GROUP BY user_id
    ) p ON p.user_id = up.user_id
    WHERE up.user_id = p_user_id
    GROUP BY up.reference_balance, p.reserved;
  $function$;

-- get_budgets_with_spent: budgets for a user/month with computed spent amount.
create or replace function public.get_budgets_with_spent(p_user_id uuid, p_month text)
  returns table(id uuid, category_id uuid, category_name character varying, category_icon character varying, category_color character varying, maximum numeric, month character varying, spent numeric)
  language sql
  stable
  set search_path to ''
as $function$
    SELECT
      b.id,
      b.category_id,
      c.name        AS category_name,
      c.icon        AS category_icon,
      c.color       AS category_color,
      b.maximum,
      b.month,
      COALESCE(ABS(SUM(t.amount) FILTER (WHERE t.amount < 0)), 0) AS spent
    FROM public.budgets b
    JOIN public.categories c ON c.id = b.category_id
    LEFT JOIN public.transactions t
      ON t.user_id = b.user_id
     AND t.category_id = b.category_id
     AND to_char(t.date, 'YYYY-MM') = b.month
    WHERE b.user_id = p_user_id
      AND b.month = p_month
    GROUP BY b.id, b.category_id, c.name, c.icon, c.color, b.maximum, b.month;
  $function$;

-- get_recurring_bills: all recurring transactions, biggest first.
create or replace function public.get_recurring_bills(p_user_id uuid)
  returns table(id uuid, name character varying, amount numeric, date date, recurring boolean, category_id uuid, category_name character varying, category_icon character varying, category_color character varying)
  language sql
  stable
  set search_path to ''
as $function$
    SELECT
      t.id,
      t.name,
      t.amount,
      t.date,
      t.recurring,
      t.category_id,
      c.name  AS category_name,
      c.icon  AS category_icon,
      c.color AS category_color
    FROM public.transactions t
    JOIN public.categories c ON c.id = t.category_id
    WHERE t.user_id = p_user_id
      AND t.recurring = true
    ORDER BY ABS(t.amount) DESC;
  $function$;

-- update_pot_total: atomic add/withdraw (never drops below 0).
create or replace function public.update_pot_total(p_pot_id uuid, p_user_id uuid, p_delta numeric)
  returns table(id uuid, name text, target numeric, total numeric, theme text)
  language plpgsql
  set search_path to ''
as $function$
  begin
    return query
      update public.pots
      set total = pots.total + p_delta
      where pots.id = p_pot_id
        and pots.user_id = p_user_id
        and pots.total + p_delta >= 0
      returning pots.id, pots.name, pots.target, pots.total, pots.theme;
  end;
  $function$;
