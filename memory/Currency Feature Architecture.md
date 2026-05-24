---
title: Currency Feature Architecture
type: note
permalink: financial-app/currency-feature-architecture
tags:
- architecture
- currency
- context
- formatting
---

# Currency Feature Architecture

## Context
Multi-currency support for the financial app. Users choose a preferred currency (USD/EUR/GBP) in preferences; all amounts stored in USD (base currency) are converted and formatted for display.

## Architecture — Two CurrencyContexts

The currency system uses a **bridge pattern** with two React contexts:

### 1. Shared CurrencyContext (`packages/shared/src/contexts/CurrencyContext.ts`)
- Shape: `{ currency: SupportedCurrency, language: string }`
- Provides raw config (user's preferred currency + app language)
- Consumed by `useCurrency()` hook which derives `format`, `convert`, `parseAmount`, `sanitizeInput`

### 2. UI CurrencyContext (`packages/ui/src/lib/CurrencyContext.ts`)
- Shape: `{ format: (amount: number, sign?: CurrencySign) => string }`
- Provides the format function to UI atoms (`<Currency>` component)
- UI package cannot depend on shared (layer order), so it has its own context

### 3. CurrencyProvider Bridge (`packages/features/src/shared/CurrencyProvider.tsx`)
- Reads preferences from TanStack Query + i18n language
- Mounts SharedCurrencyContext.Provider (currency + language)
- Inner UICurrencyBridge reads `useCurrency().format` and provides it to UICurrencyContext.Provider
- Mounted in all 3 apps inside auth-gated area

## Formatting Rules
- Symbol position follows **language** (EN: `$100`, FR: `100 $`) — NOT currency
- Short symbols only: `$`, `£`, `€` — never ISO codes like `$US`
- No `.00` on integers — decimals shown only when amount has fractional part
- Number format follows app language (EN: `1,000.50`, FR: `1 000,50`)
- Uses `Intl.NumberFormat` with `style: 'decimal'` + manual symbol composition

## Exchange Rates
- `easy-currencies` package for live USD→EUR, USD→GBP rates
- `initRates()` must be called at app boot — throws if fetch fails (no silent fallback)
- Module-level cache, refreshable via `refreshRates()`
- TODO: rate staleness detection (store timestamp, refresh on app focus)

## Key Decisions
- `CurrencySign` type duplicated between ui and shared (forced by layer order)
- `ICurrencyConfig` name collision between ui and shared (different shapes, aliased in imports)
- `preferences?.currency ?? 'USD'` fallback in CurrencyProvider — intentional for loading state
- Currency atom renders `<>{format(children, sign)}</>` — composable inside Typography

## Relations
- relates to [[UI Package Architecture]]
- relates to [[Styling — The Five Layers]]
- relates to [[API Architecture]]
- relates to [[Onboarding Flow Design]]
