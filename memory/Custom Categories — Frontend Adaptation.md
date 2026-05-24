---
title: Custom Categories — Frontend Adaptation
type: note
permalink: financial-app/custom-categories-frontend-adaptation
tags:
- architecture
- custom-categories
- frontend
- refactor
---

# Custom Categories — Frontend Adaptation

## Observations

- [migration] Replaced `avatar`/`category` string + `theme` on transactions/budgets with `category_id` FK + `category_name`/`category_icon`/`category_color` joined from `categories` table
- [type] `ITransaction` and `IBudget` in `@financial-app/shared` updated — `category_icon: IconName` (literal union from `@financial-app/icons`), `category_color: string` (token key), `category_name: string`
- [type] HeyAPI auto-generated types have `category_icon: string` — cast to `IconName` at consumption boundary (route files), NOT inside shared components
- [a11y] Icon accessibility labels must use human-readable `name` or `category_name`, never the icon key (`category_icon`) — A11Y-002
- [a11y] Decorative icons (adjacent to visible name text) use `accessible={false}` (native) / `aria-hidden="true"` (web)
- [fix] `deriveBillStatus` in `packages/shared/src/utils/recurring.ts` was hardcoded to `d.getMonth() === 7` — changed to dynamic current month/year comparison (SEC-006)
- [i18n] DataTable column headers now accept `headerLabels` parameter instead of hardcoded English strings — `ITransactionHeaderLabels` and `IRecurringHeaderLabels` interfaces (ARCH-017)
- [pattern] `useCurrencyFormat()` from CurrencyContext replaces all hardcoded `currency: 'USD'` in components (QUAL-013)

## Shared Hooks Extraction (QUAL-007)

- [extraction] `useFeedbackModals(modal)` — cross-platform hook returning `showSuccess`/`showError` callbacks for modal feedback after mutations
- [extraction] `useDeleteBodyRenderer()` — cross-platform hook returning `renderDeleteBody` callback for delete confirmation modals
- [location] `packages/features/src/shared/hooks/useFeedbackModals.{tsx,native.tsx,web.tsx}` — types file + platform implementations
- [dedup] `IModalHandle` interface — single canonical export from `useFeedbackModals.tsx`, imported by 3 CRUD hooks (was duplicated 4 times)
- [gotcha] `import.meta.env.DEV` in `.web.tsx` files inside `packages/features/` requires `DEV: boolean` in the package's `env.d.ts` `ImportMetaEnv` interface

## Files Changed

- `packages/shared/src/types/` — ITransaction, IBudget updated
- `packages/ui/src/components/molecules/` — TransactionRow, LatestSpending
- `packages/ui/src/components/organisms/DataTable/cells/` — CategoryIconCell, BillTitleCell
- `packages/features/src/transactions/` — columns, CompactTransactionRow, TransactionsDataTable
- `packages/features/src/recurring-bills/` — columns, CompactBillRow, RecurringBillsDataTable
- `packages/features/src/budget/` — BudgetFormContent, BudgetCategoryCard
- `packages/features/src/shared/hooks/` — useFeedbackModals (NEW)
- All 6 route files (3 web + 3 mobile) — deduplicated with shared hooks

## Relations

- follows [[Custom Categories — Session 1 DB Decisions]]
- updates [[Custom Categories Feature Plan]]
- resolves [[Known Issues Registry]] QUAL-007 and QUAL-006
- relates to [[Currency Feature Architecture]]
