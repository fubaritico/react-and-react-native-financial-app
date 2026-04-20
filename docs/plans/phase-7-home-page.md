# Phase 7 — Home Page with Mock Data

## Goal

Set up Turborepo, configure routing in each app, wire auth guards, add mock data
and test utilities to `@financial-app/shared`, and build the Overview/Home page
on both mobile-expo and web using that mock data.

This phase absorbs Phase 5.10 (public vs protected routes) and the former Phase 6
(Turborepo). The former Phase 7 (Express API + OpenAPI + HeyAPI) becomes Phase 8.

## Status: TODO (requires Phase 5 complete)

---

## Architecture Decisions

### Mock Data Strategy

The Figma starter `data.json` is the source. It is adapted to match domain types
(IBalance, ITransaction, IBudget, IPot) and moved into `@financial-app/shared/mocks`.

Changes from raw `data.json`:
- Add `id` fields (UUID v4) to transactions, budgets, pots
- Replace hex `theme` values with token alias names
- Replace relative avatar paths with absolute asset references

Hex → token mapping:
| Hex       | Token name |
|-----------|------------|
| `#277C78` | `green`    |
| `#82C9D7` | `cyan`     |
| `#F2CDAC` | `yellow`   |
| `#626070` | `navy`     |
| `#826CB0` | `purple`   |

### Routing

| App          | Router        | Pattern                                    |
|--------------|---------------|--------------------------------------------|
| mobile-expo  | Expo Router   | File-based (`app/` directory), tab layout  |
| web          | React Router v7 | Already set up, add routes                |

### Auth Guard Approach

| Platform | Guard mechanism                                              |
|----------|--------------------------------------------------------------|
| Web      | `requireAuth()` in route loaders — redirect to `/login`     |
| Mobile   | Jotai `isAuthenticatedAtom` drives stack selection (auth vs main) |

### Test Utils

Following the reference project pattern (vite-mf-monorepo):
- Test query client factory with `retry: false`
- Provider wrappers (React Query, Router)
- Render helpers that compose wrappers
- Exported via subpath `@financial-app/shared/test-utils`

No MSW handlers yet — the Express API does not exist until Phase 8.
Mock data is imported directly in tests and in app code (replacing future API calls).

---

## Step 7.1 — Turborepo

### Install

```bash
pnpm add -D turbo -w
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["build/**", "dist/**", ".expo/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "watch": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

### Root package.json scripts

```json
{
  "build":      "turbo build",
  "dev":        "turbo dev",
  "lint":       "turbo lint",
  "type-check": "turbo type-check",
  "test":       "turbo test",
  "tokens":     "pnpm --filter @financial-app/tokens build",
  "clean":      "rm -rf node_modules packages/*/node_modules apps/*/node_modules",
  "clean:build": "rm -rf packages/*/build packages/*/dist apps/*/dist"
}
```

### Per-package build scripts

| Package                      | `build`                                          | `dev`           |
|------------------------------|--------------------------------------------------|-----------------|
| @financial-app/tokens        | `style-dictionary build --config sd.config.js`   | watch variant   |
| @financial-app/tailwind-config | `echo 'no build step'`                         | —               |
| @financial-app/ui            | `tsc --noEmit`                                   | —               |
| @financial-app/shared        | `tsc --noEmit`                                   | —               |
| mobile-expo                  | —                                                | `expo start`    |
| web                          | `react-router build`                             | `react-router dev` |

### .gitignore

```
.turbo/
```

### Verification

```bash
pnpm build        # tokens → tailwind-config → ui → apps
pnpm type-check   # all packages in dependency order
```

---

## Step 7.2 — Expo Router Setup (mobile-expo)

### Install

```bash
pnpm --filter mobile-expo-financial-app add expo-router
```

### app.json changes

```json
{
  "expo": {
    "scheme": "financial-app",
    "plugins": ["expo-router"]
  }
}
```

### Entry point

Update `package.json`:
```json
{ "main": "expo-router/entry" }
```

Remove `App.tsx` — Expo Router uses the `app/` directory.

### Directory structure

```
apps/mobile-expo/
  app/
    _layout.tsx            # Root layout — auth gate (auth stack vs main tabs)
    (auth)/
      _layout.tsx          # Auth stack layout
      login.tsx            # Login screen (placeholder)
      signup.tsx           # Sign-up screen (placeholder)
    (tabs)/
      _layout.tsx          # Tab bar layout (5 tabs)
      index.tsx            # Overview (home) — default tab
      transactions.tsx     # Transactions (placeholder)
      budgets.tsx          # Budgets (placeholder)
      pots.tsx             # Pots (placeholder)
      recurring.tsx        # Recurring bills (placeholder)
```

### Root layout — auth gate

```tsx
// app/_layout.tsx
import { Slot } from 'expo-router'
import { useAtomValue } from 'jotai'
import { isAuthenticatedAtom } from '@financial-app/shared'

export default function RootLayout() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  // During Phase 7, bypass auth and go straight to tabs
  // Auth gate will be fully wired when Google OAuth is configured
  return <Slot />
}
```

### Tab layout

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Overview' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="budgets" options={{ title: 'Budgets' }} />
      <Tabs.Screen name="pots" options={{ title: 'Pots' }} />
      <Tabs.Screen name="recurring" options={{ title: 'Recurring Bills' }} />
    </Tabs>
  )
}
```

---

## Step 7.3 — Web Routes (apps/web)

### Add routes

```
apps/web/app/routes/
  home.tsx             # already exists — becomes Overview
  login.tsx            # Login (placeholder, public)
  signup.tsx           # Sign-up (placeholder, public)
  transactions.tsx     # placeholder, protected
  budgets.tsx          # placeholder, protected
  pots.tsx             # placeholder, protected
  recurring.tsx        # placeholder, protected
```

### Route definitions (apps/web/app/routes.ts)

```ts
import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('login', 'routes/login.tsx'),
  route('signup', 'routes/signup.tsx'),
  route('transactions', 'routes/transactions.tsx'),
  route('budgets', 'routes/budgets.tsx'),
  route('pots', 'routes/pots.tsx'),
  route('recurring', 'routes/recurring.tsx'),
] satisfies RouteConfig
```

### Protected route pattern

```tsx
// Example: routes/home.tsx loader
import { redirect } from 'react-router'
import { createServerClient, requireAuth } from '@financial-app/shared'

export async function loader({ request }: Route.LoaderArgs) {
  const { authClient, headers } = createServerClient(request)
  const result = await requireAuth(authClient)
  if ('message' in result) throw redirect('/login', { headers })

  // During Phase 7, skip auth and return mock data directly
  return { /* mock data */ }
}
```

> During Phase 7, auth guards are scaffolded but commented out.
> Mock data is returned directly from loaders until Phase 8 provides the real API.

---

## Step 7.4 — Mock Data in Shared

### Directory structure

```
packages/shared/src/
  mocks/
    index.ts                  # barrel
    data/
      index.ts                # barrel
      data.json               # adapted source data (with IDs, token themes)
      balance.data.ts          # typed mock: IBalance
      transactions.data.ts     # typed mock: ITransaction[]
      budgets.data.ts          # typed mock: IBudget[]
      pots.data.ts             # typed mock: IPot[]
```

### data.json adaptations

From raw Figma data:
```json
{
  "balance": { "current": 4836.00, "income": 3814.25, "expenses": 1700.50 },
  "transactions": [
    {
      "id": "txn-001",
      "avatar": "./assets/images/avatars/emma-richardson.jpg",
      "name": "Emma Richardson",
      "category": "General",
      "date": "2024-08-19T14:23:11Z",
      "amount": 75.50,
      "recurring": false
    }
  ],
  "budgets": [
    { "id": "bgt-001", "category": "Entertainment", "maximum": 50.00, "theme": "green" }
  ],
  "pots": [
    { "id": "pot-001", "name": "Savings", "target": 2000.00, "total": 159.00, "theme": "green" }
  ]
}
```

### Typed mock files

Each file imports from `data.json` and re-exports with the correct interface type:

```ts
// balance.data.ts
import type { IBalance } from '../../types'
import raw from './data.json'

export const mockBalance: IBalance = raw.balance
```

```ts
// transactions.data.ts
import type { ITransaction } from '../../types'
import raw from './data.json'

export const mockTransactions: ITransaction[] = raw.transactions
```

Same pattern for `budgets.data.ts` and `pots.data.ts`.

### Barrel export

```ts
// mocks/index.ts
export { mockBalance } from './data/balance.data'
export { mockTransactions } from './data/transactions.data'
export { mockBudgets } from './data/budgets.data'
export { mockPots } from './data/pots.data'
```

### Package.json exports (add to existing)

```json
{
  "./mocks": {
    "import": "./src/mocks/index.ts"
  }
}
```

---

## Step 7.5 — Test Utils in Shared

### Directory structure

```
packages/shared/src/
  test-utils/
    index.ts                          # barrel
    query-client.ts                   # createTestQueryClient (retry: false)
    ReactQueryWrapper.tsx             # QueryClientProvider wrapper
    renderWithRouter.tsx              # React Router memory router helper (web only)
    renderWithReactQuery.tsx          # React Query wrapper helper
```

### query-client.ts

```ts
import { QueryClient } from '@tanstack/react-query'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}
```

### ReactQueryWrapper.tsx

```tsx
import { useState, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from './query-client'

export function ReactQueryWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createTestQueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

### renderWithRouter.tsx

```tsx
import { render, type RenderOptions } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import type { ReactElement } from 'react'

export function renderWithRouter(
  element: ReactElement,
  route = '/',
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const router = createMemoryRouter(
    [{ path: route, element }],
    { initialEntries: [route] },
  )
  return render(<RouterProvider router={router} />, options)
}
```

### Package.json exports (add to existing)

```json
{
  "./test-utils": {
    "import": "./src/test-utils/index.ts"
  }
}
```

### Dependencies

```bash
pnpm --filter @financial-app/shared add @tanstack/react-query
pnpm --filter @financial-app/shared add -D @testing-library/react @testing-library/jest-dom
```

> TanStack Query is added now because test utils need `QueryClient`.
> Query hooks wrapping the HTTP client are still deferred to Phase 8.

---

## Step 7.6 — Auth Wiring (placeholder screens)

### Mobile — login / signup (placeholder)

```tsx
// app/(auth)/login.tsx
import { View, Text } from 'react-native'

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login — placeholder</Text>
    </View>
  )
}
```

Same pattern for `signup.tsx`.

Auth gate in root `_layout.tsx` routes to `(auth)` or `(tabs)` based on
`isAuthenticatedAtom`. During Phase 7, default to tabs (mock data, no real auth).

### Web — login / signup (placeholder)

```tsx
// routes/login.tsx
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Login — placeholder</p>
    </div>
  )
}
```

Protected routes have `requireAuth` in loaders, commented out during Phase 7.

---

## Step 7.7 — Home Page (Overview)

The Overview page displays summary cards for all 4 data domains.
Mock data is imported directly from `@financial-app/shared/mocks`.

### Mobile — app/(tabs)/index.tsx

```tsx
import { ScrollView, View, Text } from 'react-native'
import { mockBalance, mockTransactions, mockBudgets, mockPots } from '@financial-app/shared/mocks'
import { formatCurrency } from '@financial-app/shared'

export default function OverviewScreen() {
  return (
    <ScrollView>
      {/* Balance summary card */}
      {/* Latest 5 transactions */}
      {/* Budget summary (4 categories) */}
      {/* Pots summary (5 pots with progress) */}
    </ScrollView>
  )
}
```

### Web — routes/home.tsx

```tsx
import { mockBalance, mockTransactions, mockBudgets, mockPots } from '@financial-app/shared/mocks'
import { formatCurrency } from '@financial-app/shared'

export function loader() {
  // TODO (Phase 8): replace with real API call via requireAuth + HTTP client
  return { balance: mockBalance, transactions: mockTransactions, budgets: mockBudgets, pots: mockPots }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Balance summary card */}
      {/* Latest 5 transactions */}
      {/* Budget summary */}
      {/* Pots summary */}
    </div>
  )
}
```

### UI components needed

The Overview page will require new components in `@financial-app/ui`:

| Component           | Purpose                                     |
|---------------------|---------------------------------------------|
| `BalanceCard`       | Current balance, income, expenses           |
| `TransactionRow`    | Single transaction with avatar, name, amount, date |
| `TransactionList`   | List of TransactionRow items                |
| `BudgetSummaryCard` | Donut/progress for one budget category      |
| `PotSummaryCard`    | Progress bar for one savings pot            |
| `SectionHeader`     | "See Details" link header for each section  |

Each component follows the file extension split pattern (see `design-system.md` rules).
Create them using the `/new-component` skill. Create stories using `/story`.

---

## Step 7.8 — Tests

### Mock data type safety

```ts
// packages/shared/src/mocks/__tests__/data.test.ts
import { mockBalance, mockTransactions, mockBudgets, mockPots } from '../index'
import type { IBalance, ITransaction, IBudget, IPot } from '../../types'

test('mockBalance matches IBalance', () => { /* type assertion + shape check */ })
test('mockTransactions all have required fields', () => { /* id, name, category, date, amount */ })
test('mockBudgets themes are valid token names', () => { /* no hex values */ })
test('mockPots themes are valid token names', () => { /* no hex values */ })
```

### Component tests (per UI component)

Each Overview component gets a test file using `renderWithRouter` or
`renderWithReactQuery` from `@financial-app/shared/test-utils`.

### Run

```bash
pnpm type-check && pnpm lint && pnpm test
```

---

## File Changes Summary

### New files
| File | Package |
|------|---------|
| `turbo.json` | root |
| `apps/mobile-expo/app/_layout.tsx` | mobile-expo |
| `apps/mobile-expo/app/(auth)/_layout.tsx` | mobile-expo |
| `apps/mobile-expo/app/(auth)/login.tsx` | mobile-expo |
| `apps/mobile-expo/app/(auth)/signup.tsx` | mobile-expo |
| `apps/mobile-expo/app/(tabs)/_layout.tsx` | mobile-expo |
| `apps/mobile-expo/app/(tabs)/index.tsx` | mobile-expo |
| `apps/mobile-expo/app/(tabs)/transactions.tsx` | mobile-expo |
| `apps/mobile-expo/app/(tabs)/budgets.tsx` | mobile-expo |
| `apps/mobile-expo/app/(tabs)/pots.tsx` | mobile-expo |
| `apps/mobile-expo/app/(tabs)/recurring.tsx` | mobile-expo |
| `apps/web/app/routes/login.tsx` | web |
| `apps/web/app/routes/signup.tsx` | web |
| `apps/web/app/routes/transactions.tsx` | web |
| `apps/web/app/routes/budgets.tsx` | web |
| `apps/web/app/routes/pots.tsx` | web |
| `apps/web/app/routes/recurring.tsx` | web |
| `packages/shared/src/mocks/index.ts` | shared |
| `packages/shared/src/mocks/data/index.ts` | shared |
| `packages/shared/src/mocks/data/data.json` | shared |
| `packages/shared/src/mocks/data/balance.data.ts` | shared |
| `packages/shared/src/mocks/data/transactions.data.ts` | shared |
| `packages/shared/src/mocks/data/budgets.data.ts` | shared |
| `packages/shared/src/mocks/data/pots.data.ts` | shared |
| `packages/shared/src/test-utils/index.ts` | shared |
| `packages/shared/src/test-utils/query-client.ts` | shared |
| `packages/shared/src/test-utils/ReactQueryWrapper.tsx` | shared |
| `packages/shared/src/test-utils/renderWithRouter.tsx` | shared |
| `packages/shared/src/test-utils/renderWithReactQuery.tsx` | shared |
| `packages/shared/src/mocks/__tests__/data.test.ts` | shared |
| New UI components (6+) | ui |
| Storybook stories per component | ui |

### Modified files
| File | Change |
|------|--------|
| `package.json` (root) | turbo devDep + scripts |
| `.gitignore` | add `.turbo/` |
| `apps/mobile-expo/app.json` | scheme + expo-router plugin |
| `apps/mobile-expo/package.json` | main → expo-router/entry, add expo-router dep |
| `apps/web/app/routes.ts` | add new routes |
| `apps/web/app/routes/home.tsx` | rewrite with mock data |
| `packages/shared/package.json` | add exports (mocks, test-utils), add deps |

### Deleted files
| File | Reason |
|------|--------|
| `apps/mobile-expo/App.tsx` | replaced by Expo Router `app/` directory |

---

## Completion Criteria

- [ ] Turborepo installed, `turbo.json` at root, `pnpm build` runs in correct order
- [ ] `.turbo/` in `.gitignore`
- [ ] Expo Router set up in mobile-expo (`app/` directory with file-based routing)
- [ ] Tab navigation works: Overview, Transactions, Budgets, Pots, Recurring Bills
- [ ] Auth placeholder screens exist (login, signup) on both platforms
- [ ] Auth gate scaffolded (commented out during Phase 7, bypassed to tabs/home)
- [ ] `data.json` adapted: IDs added, hex themes → token names
- [ ] Typed mock exports: `mockBalance`, `mockTransactions`, `mockBudgets`, `mockPots`
- [ ] Mock data importable via `@financial-app/shared/mocks`
- [ ] Test utils importable via `@financial-app/shared/test-utils`
- [ ] `createTestQueryClient()` disables retries
- [ ] Render helpers work for both router and query provider contexts
- [ ] Overview/Home page renders on mobile-expo (tabs, scrollable)
- [ ] Overview/Home page renders on web (React Router, SSR-compatible)
- [ ] Both platforms display: balance card, 5 latest transactions, budget summary, pots summary
- [ ] All new UI components follow file extension split pattern
- [ ] Storybook stories created for each new component
- [ ] Mock data tests pass (type safety, no hex themes, all fields present)
- [ ] `pnpm type-check && pnpm lint && pnpm test` passes from root
- [ ] Tested on iOS simulator (mobile-expo) and browser (web)

## Next

→ Phase 8: `docs/plans/phase-8-api-and-http-client.md` (Express API + OpenAPI + HeyAPI client)
