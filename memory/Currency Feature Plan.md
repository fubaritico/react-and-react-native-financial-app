---
title: Currency Feature Plan
type: note
permalink: financial-app/currency-feature-plan
tags:
- plan
- currency
- feature
- next-session
---

# Currency Feature Plan

## Context
Replace all `formatCurrency()` string calls with a `<Currency>` atom + user-selectable currency preference stored in `user_preferences`. The `<Currency>` atom already exists in `packages/ui/` but is barely used — feature components bypass it and call `formatCurrency()` from `@financial-app/shared` directly.

## Current State

### Already exists
- `Currency` atom in `packages/ui/src/components/atoms/Currency/` — renders formatted amount via `<Typography>`, accepts `locale`, `currency`, `sign`, `variant`, `color` props
- `formatCurrency()` in `packages/shared/src/utils/currency.ts` — standalone function with options object (locale, currency, digits, sign)
- `formatCurrency()` in `packages/ui/src/components/atoms/Currency/Currency.utils.ts` — positional args version (used internally by the Currency atom)
- `convertCurrency()` + `SupportedCurrency` type in shared utils

### Current usage (25 files)
- **Feature components** (BudgetCategoryCard, PotCard, PotAmountFormContent, BudgetOverview, RecurringBillsOverview): call `formatCurrency()` from `@financial-app/shared`, produce strings, pass to `<Typography>` or string templates
- **Route files** (home, recurring × 3 apps): call `formatCurrency()` from `@financial-app/shared`, pass strings to `<BalanceCard amount>` / `<BillsSummaryRow total>`

### DB model
- `user_preferences` has NO `currency` column yet
- Columns: `user_id`, `mode`, `has_seen_onboarding`, `initial_balance_set`, `created_at`, `updated_at`

## Implementation Plan

### Step 1: DB + API — Add `currency` column
- Add `currency TEXT DEFAULT 'USD'` to `user_preferences` table (Supabase SQL migration)
- Run `pnpm db:sync` in packages/prisma to regenerate types
- Update `UpdatePayload` type in `apps/api/src/supabase/user-preferences.ts` to include `currency`
- Update Zod schemas in `apps/api/src/schemas/user-preferences.ts`:
  - `UserPreferencesSchema`: add `currency: z.enum(['USD', 'EUR', 'GBP'])`
  - `UpdateUserPreferencesSchema`: add `currency: z.enum(['USD', 'EUR', 'GBP']).optional()`
- Regenerate HeyAPI client

### Step 2: Client — `useCurrency()` hook in `@financial-app/shared`
- Hook reads user's preferred currency from TanStack Query preferences cache
- Returns `{ currency, locale }` — locale derived from i18n language (`en` → `en-US`, `fr` → `fr-FR`)
- Every component that formats money calls this hook instead of hardcoding `'USD'`
- Avoids prop drilling currency/locale through every component tree

### Step 3: Replace `formatCurrency()` calls with `<Currency>` atom
- Feature components that embed formatted amounts inline in `<Typography>` switch to `<Currency amount={value} />`
- The `<Currency>` atom internally calls `useCurrency()` to get defaults — consumers just pass `<Currency amount={100} />`
- For **string contexts** (like `BillsSummaryRow total` which expects a string, or string template interpolation), keep `formatCurrency()` but feed it from the hook
- Deduplicate: remove positional-args `formatCurrency` from `Currency.utils.ts`, use shared one

### Step 4: Settings — Currency selector
- Add currency dropdown in SettingsScreenView (USD / EUR / GBP)
- Mutation calls `PUT /users/me/preferences` with `{ currency: 'EUR' }`
- Optimistic update on the preferences query cache

## Files to modify (estimated)

### API
- `apps/api/src/schemas/user-preferences.ts`
- `apps/api/src/supabase/user-preferences.ts`
- `packages/prisma/prisma/schema.prisma` (after db:sync)

### Shared
- `packages/shared/src/hooks/useCurrency.ts` (NEW)
- `packages/shared/src/utils/currency.ts` (keep, possibly unify)

### UI
- `packages/ui/src/components/atoms/Currency/Currency.utils.ts` (deduplicate with shared)
- `packages/ui/src/components/atoms/Currency/Currency.tsx` (maybe add useCurrency defaults)
- `packages/ui/src/components/atoms/Currency/Currency.native.tsx`
- `packages/ui/src/components/atoms/Currency/Currency.web.tsx`

### Features (replace formatCurrency → Currency atom)
- `packages/features/src/overview/BudgetOverview/BudgetOverview.native.tsx`
- `packages/features/src/overview/BudgetOverview/BudgetOverview.web.tsx`
- `packages/features/src/overview/RecurringBillsOverview/RecurringBillsOverview.native.tsx`
- `packages/features/src/overview/RecurringBillsOverview/RecurringBillsOverview.web.tsx`
- `packages/features/src/budget/BudgetCategoryCard/BudgetCategoryCard.native.tsx`
- `packages/features/src/budget/BudgetCategoryCard/BudgetCategoryCard.web.tsx`
- `packages/features/src/pots/PotCard/PotCard.native.tsx`
- `packages/features/src/pots/PotCard/PotCard.web.tsx`
- `packages/features/src/pots/PotAmountFormContent/PotAmountFormContent.native.tsx`
- `packages/features/src/pots/PotAmountFormContent/PotAmountFormContent.web.tsx`

### Apps (replace formatCurrency in route files)
- `apps/web/app/routes/home.tsx`
- `apps/web/app/routes/recurring.tsx`
- `apps/mobile-expo/app/(tabs)/index.tsx`
- `apps/mobile-expo/app/(tabs)/recurring.tsx`
- `apps/mobile/src/screens/OverviewScreen.tsx`
- `apps/mobile/src/screens/RecurringScreen.tsx`

### Settings
- `packages/features/src/settings/SettingsScreenView/SettingsScreenView.tsx` (add currency prop)
- `packages/features/src/settings/SettingsScreenView/SettingsScreenView.native.tsx`
- `packages/features/src/settings/SettingsScreenView/SettingsScreenView.web.tsx`
- Settings route files (wire mutation)

## Design Decisions
- `useCurrency()` hook lives in `@financial-app/shared` (no renderer dependency)
- `<Currency>` atom calls `useCurrency()` internally for zero-config usage
- `formatCurrency()` from shared stays available for string contexts
- Three currencies initially: USD, EUR, GBP
- Locale derived from i18n language, not a separate preference

## CurrencyFormatter.ts (packages/shared/src/utils/)

User created a `CurrencyFormatter.ts` file with:
- **Dependency**: `easy-currencies` (npm) — provides `Convert` chainable API for real-time exchange rates via free provider (no API key needed), with fallback system
- **`Price` class** — wraps a numeric value with locale/currency/digits/symbol, `print()` uses `Intl.NumberFormat`
- **`PC` class** — fetches EUR→USD, EUR→GBP, EUR→EUR pairs on instantiation, exposes `price({ eurValue, to })` returning a `Price` instance
- **`AmountConverter`** — singleton `PC` instance, ready to use

### Notes for integration
- The `Price.print()` method already uses `Intl.NumberFormat` with currency style — overlaps with existing `formatCurrency()` and the `Currency` atom's internal formatting
- The `PC` class assumes EUR as base currency — may need to generalize for USD-based data (current app data is in USD)
- Class pattern could be simplified to pure functions, but functional for now
- The `<Currency>` atom will likely need to call `AmountConverter.price()` when user's preferred currency differs from the data's stored currency (USD)

## Architecture Decision: No Fallback

**Rule**: NO silent fallback values anywhere. If `initRates()` fails, throw. No static rates as degradation. The app must not serve incorrect data.

**Future exception**: offline mode with persisted last-known rates would be an explicit feature, not a silent fallback.

This rule applies globally — not just to currency. Added to CLAUDE.md Critical Workflow Rules.
