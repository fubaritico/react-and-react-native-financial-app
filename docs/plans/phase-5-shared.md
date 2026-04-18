# Phase 5 — Shared Business Logic Package

## Goal

Create `@financial-app/shared` — pure TypeScript, no renderer imports.
Contains: Supabase client + API layer, Jotai atoms, TanStack Query hooks,
domain types, and utility functions. Both apps consume this.

## Status: TODO (requires Phase 4 complete)

---

## Step 5.1 — Create packages/shared/

Use command: `/add-package shared lib`

```bash
pnpm --filter @financial-app/shared add @supabase/supabase-js
pnpm --filter @financial-app/shared add jotai
pnpm --filter @financial-app/shared add @tanstack/react-query
pnpm --filter @financial-app/shared add zod
```

---

## Step 5.2 — Directory Structure

```
packages/shared/src/
  api/
    client.ts         # Supabase client singleton
    auth.ts           # auth methods
    transactions.ts   # transaction queries
    budgets.ts        # budget queries
    pots.ts           # pot queries
  atoms/
    auth.atom.ts      # Jotai auth state
    ui.atom.ts        # UI state (modals, loading)
  hooks/
    useTransactions.ts  # TanStack Query hooks
    useBudgets.ts
    usePots.ts
    useAuth.ts
  types/
    index.ts          # domain types (Transaction, Budget, Pot, Balance)
  utils/
    currency.ts       # format currency
    date.ts           # format dates
  index.ts            # public API
```

---

## Step 5.3 — Supabase Client

### src/api/client.ts
```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
  ?? process.env.VITE_SUPABASE_URL
  ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  ?? process.env.VITE_SUPABASE_ANON_KEY
  ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

> Env var naming: Expo requires EXPO_PUBLIC_ prefix. Vite requires VITE_ prefix.
> The shared client handles both via fallback chain.

---

## Step 5.4 — Domain Types

### src/types/index.ts
```ts
export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export interface Transaction {
  id: string;
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

export interface Budget {
  id: string;
  category: string;
  maximum: number;
  theme: string;
}

export interface Pot {
  id: string;
  name: string;
  target: number;
  total: number;
  theme: string;
}
```

---

## Step 5.5 — Add to Both Apps

```bash
pnpm --filter mobile-financial-app add @financial-app/shared@workspace:^
pnpm --filter web-financial-app add @financial-app/shared@workspace:^
```

---

## Step 5.6 — Env Variables

### apps/mobile/.env
```
EXPO_PUBLIC_SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### apps/web/.env
```
VITE_SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Actual keys are in root `.env` (gitignored). Copy as needed.

---

## Completion Criteria

- [ ] `packages/shared/` exists
- [ ] Supabase client initializes without errors on both platforms
- [ ] Domain types exported from src/types/index.ts
- [ ] At least one TanStack Query hook working in each app
- [ ] No renderer imports anywhere in packages/shared/
- [ ] Both apps resolve @financial-app/shared correctly

## Next

→ docs/plans/phase-6-turborepo.md
