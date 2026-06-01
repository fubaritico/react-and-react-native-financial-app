-- =============================================================================
-- Financial App — Seed Data
-- =============================================================================
-- Run AFTER setup.sql, in the Supabase SQL Editor.
-- Aligned with the live schema: per-user categories, category_id FKs,
-- reference balance in user_preferences. Transaction dates are shifted to the
-- CURRENT month at the end (mirrors apps/api seed.ts shiftToCurrentMonth).
--
-- NOTE: for a programmatic, repeatable reset prefer `pnpm seed` (apps/api dev
-- seed endpoint + data.json). This SQL file is the manual equivalent.
--
-- HOW TO USE:
--   1. Sign up in the app (or create a user in Supabase Auth > Users)
--   2. Copy the user's UUID
--   3. Find & Replace every d8e4f26e-dc4f-41a7-8e66-1b1805a00b41 with it
--   4. Run this file
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. System categories (per-user, is_system = true) — must exist before FKs
-- ---------------------------------------------------------------------------
insert into public.categories (user_id, name, icon, color, is_system)
values
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'General',        'categoryGeneral',        'blue',       true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Dining Out',     'categoryDiningOut',      'brown',      true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Groceries',      'categoryGroceries',      'army-green', true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Entertainment',  'categoryEntertainment',  'red',        true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Transportation', 'categoryTransportation', 'navy-grey',  true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Lifestyle',      'categoryLifeStyle',      'navy',       true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Personal Care',  'categoryPersonalCare',   'yellow',     true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Education',      'categoryEducation',      'cyan',       true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Bills',          'categoryBills',          'blue',       true),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Shopping',       'categoryShopping',       'magenta',    true)
on conflict (user_id, name) do nothing;

-- ---------------------------------------------------------------------------
-- 2. User preferences (reference balance = current 4836 + pots reserved 920)
-- ---------------------------------------------------------------------------
insert into public.user_preferences
  (user_id, mode, has_seen_onboarding, initial_balance_set, currency, reference_balance)
values
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'manual', true, true, 'USD', 5756.00)
on conflict (user_id) do update set reference_balance = excluded.reference_balance;

-- ---------------------------------------------------------------------------
-- 3. Transactions — category_id resolved by name; dates shifted to current month below
-- ---------------------------------------------------------------------------
insert into public.transactions (user_id, category_id, name, date, amount, recurring)
select
  'd8e4f26e-dc4f-41a7-8e66-1b1805a00b41', c.id, v.name, v.date, v.amount, v.recurring
from (values
  ('Emma Richardson',          'General',        timestamptz '2024-08-19T14:23:11Z',  75.50,  false),
  ('Savory Bites Bistro',      'Dining Out',     timestamptz '2024-08-19T20:23:11Z', -55.50,  false),
  ('Daniel Carter',            'General',        timestamptz '2024-08-18T09:45:32Z', -42.30,  false),
  ('Sun Park',                 'General',        timestamptz '2024-08-17T16:12:05Z', 120.00,  false),
  ('Urban Services Hub',       'General',        timestamptz '2024-08-17T21:08:09Z', -65.00,  false),
  ('Liam Hughes',              'Groceries',      timestamptz '2024-08-15T18:20:33Z',  65.75,  false),
  ('Lily Ramirez',             'General',        timestamptz '2024-08-14T13:05:27Z',  50.00,  false),
  ('Ethan Clark',              'Dining Out',     timestamptz '2024-08-13T20:15:59Z', -32.50,  false),
  ('James Thompson',           'Entertainment',  timestamptz '2024-08-11T15:45:38Z',  -5.00,  false),
  ('Pixel Playground',         'Entertainment',  timestamptz '2024-08-11T18:45:38Z', -10.00,  true),
  ('Ella Phillips',            'Dining Out',     timestamptz '2024-08-10T19:22:51Z', -45.00,  false),
  ('Sofia Peterson',           'Transportation', timestamptz '2024-08-08T08:55:17Z', -15.00,  false),
  ('Mason Martinez',           'Lifestyle',      timestamptz '2024-08-07T17:40:29Z', -35.25,  false),
  ('Green Plate Eatery',       'Groceries',      timestamptz '2024-08-06T08:25:44Z', -78.50,  false),
  ('Sebastian Cook',           'Transportation', timestamptz '2024-08-06T10:05:44Z', -22.50,  false),
  ('William Harris',           'Personal Care',  timestamptz '2024-08-05T14:30:56Z', -10.00,  false),
  ('Elevate Education',        'Education',      timestamptz '2024-08-04T11:15:22Z', -50.00,  true),
  ('Serenity Spa & Wellness',  'Personal Care',  timestamptz '2024-08-03T14:00:37Z', -30.00,  true),
  ('Spark Electric Solutions', 'Bills',          timestamptz '2024-08-02T09:25:11Z', -100.00, true),
  ('Rina Sato',                'Bills',          timestamptz '2024-08-02T13:31:11Z', -50.00,  false),
  ('Swift Ride Share',         'Transportation', timestamptz '2024-08-01T18:40:33Z', -18.75,  false),
  ('Aqua Flow Utilities',      'Bills',          timestamptz '2024-07-30T13:20:14Z', -100.00, true),
  ('EcoFuel Energy',           'Bills',          timestamptz '2024-07-29T11:55:29Z', -35.00,  true),
  ('Yuna Kim',                 'Dining Out',     timestamptz '2024-07-29T13:51:29Z', -28.50,  false),
  ('Flavor Fiesta',            'Dining Out',     timestamptz '2024-07-27T20:15:06Z', -42.75,  false),
  ('Harper Edwards',           'Shopping',       timestamptz '2024-07-26T09:43:23Z', -89.99,  false),
  ('Buzz Marketing Group',     'General',        timestamptz '2024-07-26T14:40:23Z', 3358.00, false),
  ('TechNova Innovations',     'Shopping',       timestamptz '2024-07-25T16:25:37Z', -29.99,  false),
  ('ByteWise',                 'Lifestyle',      timestamptz '2024-07-23T09:35:14Z', -49.99,  true),
  ('Nimbus Data Storage',      'Bills',          timestamptz '2024-07-21T10:05:42Z',  -9.99,  true),
  ('Emma Richardson',          'General',        timestamptz '2024-07-20T17:30:55Z', -25.00,  false),
  ('Daniel Carter',            'General',        timestamptz '2024-07-19T12:45:09Z',  50.00,  false),
  ('Sun Park',                 'General',        timestamptz '2024-07-18T19:20:23Z', -38.50,  false),
  ('Harper Edwards',           'Shopping',       timestamptz '2024-07-17T14:55:37Z', -29.99,  false),
  ('Liam Hughes',              'Groceries',      timestamptz '2024-07-16T10:10:51Z', -52.75,  false),
  ('Lily Ramirez',             'General',        timestamptz '2024-07-15T16:35:04Z',  75.00,  false),
  ('Ethan Clark',              'Dining Out',     timestamptz '2024-07-14T20:50:18Z', -41.25,  false),
  ('Rina Sato',                'Entertainment',  timestamptz '2024-07-13T09:15:32Z', -10.00,  false),
  ('James Thompson',           'Bills',          timestamptz '2024-07-12T13:40:46Z', -95.50,  false),
  ('Ella Phillips',            'Dining Out',     timestamptz '2024-07-11T18:05:59Z', -33.75,  false),
  ('Yuna Kim',                 'Dining Out',     timestamptz '2024-07-10T12:30:13Z', -27.50,  false),
  ('Sofia Peterson',           'Transportation', timestamptz '2024-07-09T08:55:27Z', -12.50,  false),
  ('Mason Martinez',           'Lifestyle',      timestamptz '2024-07-08T15:20:41Z', -65.00,  false),
  ('Sebastian Cook',           'Transportation', timestamptz '2024-07-07T11:45:55Z', -20.00,  false),
  ('William Harris',           'General',        timestamptz '2024-07-06T17:10:09Z',  20.00,  false),
  ('Elevate Education',        'Education',      timestamptz '2024-07-05T11:15:22Z', -50.00,  true),
  ('Serenity Spa & Wellness',  'Personal Care',  timestamptz '2024-07-03T14:00:37Z', -30.00,  true),
  ('Spark Electric Solutions', 'Bills',          timestamptz '2024-07-02T09:25:51Z', -100.00, true),
  ('Swift Ride Share',         'Transportation', timestamptz '2024-07-02T19:50:05Z', -16.50,  false)
) as v(name, category, date, amount, recurring)
join public.categories c
  on c.user_id = 'd8e4f26e-dc4f-41a7-8e66-1b1805a00b41' and c.name = v.category;

-- Shift every seeded transaction into the current month (preserve day/time,
-- clamp the day to the current month's last day) — mirrors seed.ts.
update public.transactions
set date = make_timestamptz(
  extract(year  from now())::int,
  extract(month from now())::int,
  least(
    extract(day from date)::int,
    extract(day from (date_trunc('month', now()) + interval '1 month' - interval '1 day'))::int
  ),
  extract(hour   from date)::int,
  extract(minute from date)::int,
  extract(second from date),
  'UTC'
)
where user_id = 'd8e4f26e-dc4f-41a7-8e66-1b1805a00b41';

-- ---------------------------------------------------------------------------
-- 4. Budgets — category_id by name, month = current month
-- ---------------------------------------------------------------------------
insert into public.budgets (user_id, category_id, maximum, month)
select
  'd8e4f26e-dc4f-41a7-8e66-1b1805a00b41', c.id, v.maximum, to_char(now(), 'YYYY-MM')
from (values
  ('Entertainment', 50.00),
  ('Bills',         750.00),
  ('Dining Out',    75.00),
  ('Personal Care', 100.00)
) as v(category, maximum)
join public.categories c
  on c.user_id = 'd8e4f26e-dc4f-41a7-8e66-1b1805a00b41' and c.name = v.category
on conflict (user_id, category_id, month) do nothing;

-- ---------------------------------------------------------------------------
-- 5. Pots
-- ---------------------------------------------------------------------------
insert into public.pots (user_id, name, target, total, theme)
values
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Savings',        2000.00, 159.00, 'green'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Concert Ticket', 150.00,  110.00, 'navy'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Gift',           150.00,  110.00, 'cyan'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'New Laptop',     1000.00, 10.00,  'yellow'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Holiday',        1440.00, 531.00, 'purple');
