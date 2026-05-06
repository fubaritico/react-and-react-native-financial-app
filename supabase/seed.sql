-- =============================================================================
-- Financial App — Seed Data
-- =============================================================================
-- Run AFTER setup.sql. Inserts mock data for testing.
-- Uses a placeholder user_id that you MUST replace with your own.
--
-- HOW TO GET YOUR USER ID:
--   1. Sign up in the app (or create a user in Supabase Auth dashboard)
--   2. Go to Authentication > Users in the Supabase dashboard
--   3. Copy the UUID of your user
--   4. Replace every occurrence of d8e4f26e-dc4f-41a7-8e66-1b1805a00b41 below
--
-- Tip: use Find & Replace in your editor before pasting into the SQL Editor.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Balance
-- ---------------------------------------------------------------------------
-- reference = current (4836) + pots reserved (920) = 5756
insert into public.balances (user_id, reference)
values ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 5756.00);

-- ---------------------------------------------------------------------------
-- 2. Transactions
-- ---------------------------------------------------------------------------
insert into public.transactions (user_id, avatar, name, category, date, amount, recurring, source)
values
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/emma-richardson.jpg', 'Emma Richardson', 'General', '2024-08-19T14:23:11Z', 75.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/savory-bites-bistro.jpg', 'Savory Bites Bistro', 'Dining Out', '2024-08-19T20:23:11Z', -55.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/daniel-carter.jpg', 'Daniel Carter', 'General', '2024-08-18T09:45:32Z', -42.30, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/sun-park.jpg', 'Sun Park', 'General', '2024-08-17T16:12:05Z', 120.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/urban-services-hub.jpg', 'Urban Services Hub', 'General', '2024-08-17T21:08:09Z', -65.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/liam-hughes.jpg', 'Liam Hughes', 'Groceries', '2024-08-15T18:20:33Z', 65.75, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/lily-ramirez.jpg', 'Lily Ramirez', 'General', '2024-08-14T13:05:27Z', 50.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/ethan-clark.jpg', 'Ethan Clark', 'Dining Out', '2024-08-13T20:15:59Z', -32.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/james-thompson.jpg', 'James Thompson', 'Entertainment', '2024-08-11T15:45:38Z', -5.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/pixel-playground.jpg', 'Pixel Playground', 'Entertainment', '2024-08-11T18:45:38Z', -10.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/ella-phillips.jpg', 'Ella Phillips', 'Dining Out', '2024-08-10T19:22:51Z', -45.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/sofia-peterson.jpg', 'Sofia Peterson', 'Transportation', '2024-08-08T08:55:17Z', -15.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/mason-martinez.jpg', 'Mason Martinez', 'Lifestyle', '2024-08-07T17:40:29Z', -35.25, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/green-plate-eatery.jpg', 'Green Plate Eatery', 'Groceries', '2024-08-06T08:25:44Z', -78.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/sebastian-cook.jpg', 'Sebastian Cook', 'Transportation', '2024-08-06T10:05:44Z', -22.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/william-harris.jpg', 'William Harris', 'Personal Care', '2024-08-05T14:30:56Z', -10.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/elevate-education.jpg', 'Elevate Education', 'Education', '2024-08-04T11:15:22Z', -50.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/serenity-spa-and-wellness.jpg', 'Serenity Spa & Wellness', 'Personal Care', '2024-08-03T14:00:37Z', -30.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/spark-electric-solutions.jpg', 'Spark Electric Solutions', 'Bills', '2024-08-02T09:25:11Z', -100.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/rina-sato.jpg', 'Rina Sato', 'Bills', '2024-08-02T13:31:11Z', -50.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/swift-ride-share.jpg', 'Swift Ride Share', 'Transportation', '2024-08-01T18:40:33Z', -18.75, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/aqua-flow-utilities.jpg', 'Aqua Flow Utilities', 'Bills', '2024-07-30T13:20:14Z', -100.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/ecofuel-energy.jpg', 'EcoFuel Energy', 'Bills', '2024-07-29T11:55:29Z', -35.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/yuna-kim.jpg', 'Yuna Kim', 'Dining Out', '2024-07-29T13:51:29Z', -28.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/flavor-fiesta.jpg', 'Flavor Fiesta', 'Dining Out', '2024-07-27T20:15:06Z', -42.75, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/harper-edwards.jpg', 'Harper Edwards', 'Shopping', '2024-07-26T09:43:23Z', -89.99, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/buzz-marketing-group.jpg', 'Buzz Marketing Group', 'General', '2024-07-26T14:40:23Z', 3358.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/technova-innovations.jpg', 'TechNova Innovations', 'Shopping', '2024-07-25T16:25:37Z', -29.99, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/bytewise.jpg', 'ByteWise', 'Lifestyle', '2024-07-23T09:35:14Z', -49.99, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/nimbus-data-storage.jpg', 'Nimbus Data Storage', 'Bills', '2024-07-21T10:05:42Z', -9.99, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/emma-richardson.jpg', 'Emma Richardson', 'General', '2024-07-20T17:30:55Z', -25.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/daniel-carter.jpg', 'Daniel Carter', 'General', '2024-07-19T12:45:09Z', 50.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/sun-park.jpg', 'Sun Park', 'General', '2024-07-18T19:20:23Z', -38.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/harper-edwards.jpg', 'Harper Edwards', 'Shopping', '2024-07-17T14:55:37Z', -29.99, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/liam-hughes.jpg', 'Liam Hughes', 'Groceries', '2024-07-16T10:10:51Z', -52.75, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/lily-ramirez.jpg', 'Lily Ramirez', 'General', '2024-07-15T16:35:04Z', 75.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/ethan-clark.jpg', 'Ethan Clark', 'Dining Out', '2024-07-14T20:50:18Z', -41.25, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/rina-sato.jpg', 'Rina Sato', 'Entertainment', '2024-07-13T09:15:32Z', -10.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/james-thompson.jpg', 'James Thompson', 'Bills', '2024-07-12T13:40:46Z', -95.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/ella-phillips.jpg', 'Ella Phillips', 'Dining Out', '2024-07-11T18:05:59Z', -33.75, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/yuna-kim.jpg', 'Yuna Kim', 'Dining Out', '2024-07-10T12:30:13Z', -27.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/sofia-peterson.jpg', 'Sofia Peterson', 'Transportation', '2024-07-09T08:55:27Z', -12.50, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/mason-martinez.jpg', 'Mason Martinez', 'Lifestyle', '2024-07-08T15:20:41Z', -65.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/sebastian-cook.jpg', 'Sebastian Cook', 'Transportation', '2024-07-07T11:45:55Z', -20.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/william-harris.jpg', 'William Harris', 'General', '2024-07-06T17:10:09Z', 20.00, false, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/elevate-education.jpg', 'Elevate Education', 'Education', '2024-07-05T11:15:22Z', -50.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/serenity-spa-and-wellness.jpg', 'Serenity Spa & Wellness', 'Personal Care', '2024-07-03T14:00:37Z', -30.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/spark-electric-solutions.jpg', 'Spark Electric Solutions', 'Bills', '2024-07-02T09:25:51Z', -100.00, true, 'manual'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', './assets/images/avatars/swift-ride-share.jpg', 'Swift Ride Share', 'Transportation', '2024-07-02T19:50:05Z', -16.50, false, 'manual');

-- ---------------------------------------------------------------------------
-- 3. Budgets (month = 2024-08, matching transaction dates)
-- ---------------------------------------------------------------------------
insert into public.budgets (user_id, category, maximum, theme, month)
values
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Entertainment', 50.00, 'green', '2024-08'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Bills', 750.00, 'cyan', '2024-08'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Dining Out', 75.00, 'yellow', '2024-08'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Personal Care', 100.00, 'navy', '2024-08');

-- ---------------------------------------------------------------------------
-- 4. Pots
-- ---------------------------------------------------------------------------
insert into public.pots (user_id, name, target, total, theme)
values
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Savings', 2000.00, 159.00, 'green'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Concert Ticket', 150.00, 110.00, 'navy'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Gift', 150.00, 110.00, 'cyan'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'New Laptop', 1000.00, 10.00, 'yellow'),
  ('d8e4f26e-dc4f-41a7-8e66-1b1805a00b41', 'Holiday', 1440.00, 531.00, 'purple');
