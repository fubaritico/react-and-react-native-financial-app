-- =============================================================================
-- Financial App — Database Setup
-- =============================================================================
-- Run this entire file in the Supabase SQL Editor (one shot).
-- See docs/modus-operandi/supabase-setup.md for the full guide.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Helper: auto-update updated_at on every UPDATE
-- ---------------------------------------------------------------------------
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------------

-- balances: one row per user, reference balance
create table public.balances (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  reference  numeric(12,2) not null default 0 check (reference >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create trigger balances_updated_at
  before update on public.balances
  for each row execute function public.update_updated_at();

-- transactions
create table public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  avatar      text not null default '',
  name        text not null,
  category    text not null,
  date        timestamptz not null default now(),
  amount      numeric(12,2) not null check (amount != 0),
  recurring   boolean not null default false,
  source      text not null default 'manual',
  external_id text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger transactions_updated_at
  before update on public.transactions
  for each row execute function public.update_updated_at();

-- budgets: per user, per month
create table public.budgets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  category   text not null,
  maximum    numeric(12,2) not null,
  theme      text not null,
  month      char(7) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category, month)
);

create trigger budgets_updated_at
  before update on public.budgets
  for each row execute function public.update_updated_at();

-- pots: savings goals
create table public.pots (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  target     numeric(12,2) not null,
  total      numeric(12,2) not null default 0,
  theme      text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger pots_updated_at
  before update on public.pots
  for each row execute function public.update_updated_at();

-- user_preferences: onboarding state per user
create table public.user_preferences (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  mode                 text check (mode in ('manual', 'bank')) default null,
  has_seen_onboarding  boolean not null default false,
  initial_balance_set  boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Indexes
-- ---------------------------------------------------------------------------

-- RLS performance: every table filtered by user_id
create index idx_balances_user    on public.balances(user_id);
create index idx_txn_user_date    on public.transactions(user_id, date desc);
create index idx_txn_user_cat     on public.transactions(user_id, category);
create index idx_txn_recurring    on public.transactions(user_id) where recurring = true;
create unique index idx_txn_external on public.transactions(user_id, external_id) where external_id is not null;
create index idx_budget_user_month on public.budgets(user_id, month);
create index idx_pots_user        on public.pots(user_id);
create index idx_user_prefs_user  on public.user_preferences(user_id);

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.balances enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.pots enable row level security;
alter table public.user_preferences enable row level security;

create policy "own_data" on public.balances
  for all to authenticated
  using ((select auth.uid()) = user_id);

create policy "own_data" on public.transactions
  for all to authenticated
  using ((select auth.uid()) = user_id);

create policy "own_data" on public.budgets
  for all to authenticated
  using ((select auth.uid()) = user_id);

create policy "own_data" on public.pots
  for all to authenticated
  using ((select auth.uid()) = user_id);

create policy "own_data" on public.user_preferences
  for all to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- 5. RPC Functions
-- ---------------------------------------------------------------------------

-- get_balance: computed balance for a user (optionally filtered by month)
create or replace function public.get_balance(
  p_user_id uuid,
  p_month   char(7) default null
)
returns table (current numeric, income numeric, expenses numeric)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    b.reference - coalesce(p.reserved, 0) as current,
    coalesce(sum(t.amount) filter (
      where t.amount > 0
        and (p_month is null or to_char(t.date, 'YYYY-MM') = p_month)
    ), 0) as income,
    coalesce(abs(sum(t.amount) filter (
      where t.amount < 0
        and (p_month is null or to_char(t.date, 'YYYY-MM') = p_month)
    )), 0) as expenses
  from public.balances b
  left join public.transactions t on t.user_id = b.user_id
  left join (
    select user_id, sum(total) as reserved
    from public.pots
    group by user_id
  ) p on p.user_id = b.user_id
  where b.user_id = p_user_id
  group by b.reference, p.reserved;
$$;

-- get_budgets_with_spent: budgets for a user/month with computed spent amount
create or replace function public.get_budgets_with_spent(
  p_user_id uuid,
  p_month   char(7)
)
returns table (
  id       uuid,
  category text,
  maximum  numeric,
  theme    text,
  month    char(7),
  spent    numeric
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    b.id, b.category, b.maximum, b.theme, b.month,
    coalesce(abs(sum(t.amount) filter (where t.amount < 0)), 0) as spent
  from public.budgets b
  left join public.transactions t
    on t.user_id = b.user_id
    and t.category = b.category
    and to_char(t.date, 'YYYY-MM') = b.month
  where b.user_id = p_user_id and b.month = p_month
  group by b.id, b.category, b.maximum, b.theme, b.month;
$$;

-- get_recurring_bills: recurring transactions for a user, deduplicated by name (latest occurrence)
create or replace function public.get_recurring_bills(p_user_id uuid)
returns table (
  id       uuid,
  avatar   text,
  name     text,
  category text,
  date     timestamptz,
  amount   numeric,
  recurring boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select distinct on (t.name)
    t.id, t.avatar, t.name, t.category, t.date, t.amount, t.recurring
  from public.transactions t
  where t.user_id = p_user_id and t.recurring = true
  order by t.name, t.date desc;
$$;

-- update_pot_total: atomically add/withdraw money from a pot
-- Returns the updated row on success; empty result on failure.
-- Failure cases: pot not found, insufficient funds (total + delta < 0).
create or replace function public.update_pot_total(
  p_pot_id  uuid,
  p_user_id uuid,
  p_delta   numeric
)
returns table (id uuid, name text, target numeric, total numeric, theme text)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
    update public.pots
    set total = pots.total + p_delta
    where pots.id = p_pot_id
      and pots.user_id = p_user_id
      and pots.total + p_delta >= 0
    returning pots.id, pots.name, pots.target, pots.total, pots.theme;
end;
$$;
