# Phase 5 — Shared Business Logic Package

## Goal

Create `@financial-app/shared` — pure TypeScript, no renderer imports.
Contains: Supabase auth layer (email/password + Google OAuth), Jotai atoms
(client-side state), domain types, and utility functions. All 4 apps consume this.

Data fetching (transactions, budgets, pots, balance) is NOT in this package.
It comes from the HeyAPI-generated HTTP client after Phase 7.
TanStack Query hooks that wrap the HTTP client also come after Phase 7.

## Status: TODO (requires Phase 4 complete)

---

## Architecture Decisions

### Data Flow — Who Talks to Supabase?

```
Auth:  Apps → Supabase SDK directly (login, signup, Google OAuth, session, token refresh)
Data:  Apps → Express API (Phase 7) → Supabase (service role key)
```

- Supabase SDK handles auth only (JWT issuance, refresh, session persistence)
- Three sign-in methods: email/password sign-in, email/password sign-up, Google OAuth
- All data reads/writes go through the Express API
- The API is defined by OpenAPI spec, consumed via HeyAPI-generated client
- No direct Supabase data queries from apps — ever

This split gives us:
- OpenAPI as single contract for all data operations
- HeyAPI-generated type-safe client for DX
- Service role key stays server-side (never in client apps)
- RLS is a safety net, not the primary access control

### No ORM

The Express API uses `@supabase/supabase-js` with the service role key directly.
No Prisma — it would add a third schema source (openapi.yaml + schema.prisma + Supabase)
for simple CRUD that doesn't justify the overhead. If complex queries are needed later,
use `supabase.rpc()` for raw SQL.

### Auth — Sign-In Methods

| Method              | Web                                          | Native (Expo + bare RN)                       |
|---------------------|----------------------------------------------|-----------------------------------------------|
| Email/password      | `signInWithPassword()` via Supabase SDK      | `signInWithPassword()` via Supabase SDK       |
| Sign up             | `signUp()` via Supabase SDK                  | `signUp()` via Supabase SDK                   |
| Google OAuth        | `signInWithOAuth()` — redirect flow          | `@react-native-google-signin/google-signin` → `signInWithIdToken()` |

**Google OAuth flow differences:**
- **Web**: Supabase handles the full redirect (consent screen → callback URL → session)
- **Native**: `@react-native-google-signin/google-signin` presents the native Google Sign-In UI,
  returns an ID token, which is then passed to `supabase.auth.signInWithIdToken()`
- The shared package stays pure TS — native Google Sign-In lib is an app-level dependency

**Supabase dashboard prerequisite:**
- Enable Google provider in Auth → Providers
- Set Google Cloud OAuth client ID + secret (web)
- Set separate OAuth client IDs for iOS and Android (native)

### Auth — JWT & Session Management

Supabase SDK manages JWTs entirely (issuance, storage, refresh).
We never decode or inspect tokens manually.

| Platform | Storage mechanism | Package |
|----------|-------------------|---------|
| Web (SSR)              | HTTP-only cookies   | `@supabase/ssr`                              |
| Expo managed / ejected | Encrypted storage   | `expo-secure-store`                          |
| Bare RN CLI            | Async storage       | `@react-native-async-storage/async-storage`  |

The shared package does NOT depend on any storage implementation.
Each app passes its own adapter via `createNativeClient(storage)`.

### Auth — Three Scenarios

**1a. User not connected — signs in with email/password**
```
Request hits server → loader calls requireAuth()
  → createServerClient reads cookies → no session
  → 302 redirect to /login
  → User submits credentials → signInWithPassword() (client-side)
  → Supabase returns tokens → @supabase/ssr writes HTTP-only cookies
  → onAuthStateChange fires → Jotai userAtom hydrates
  → Client redirect to /overview
```

**1b. User not connected — signs in with Google (web)**
```
User clicks "Sign in with Google" → signInWithGoogle(supabase, redirectTo)
  → Supabase redirects to Google consent screen
  → User grants access → Google redirects to Supabase callback
  → Supabase creates/links user → redirects to app with session cookies
  → onAuthStateChange fires → Jotai userAtom hydrates
```

**1c. User not connected — signs in with Google (native)**
```
User taps "Sign in with Google" → GoogleSignin.signIn()
  → Native Google Sign-In UI appears
  → User grants access → returns idToken
  → signInWithGoogle(supabase, idToken) → signInWithIdToken()
  → Supabase creates/links user → returns session
  → onAuthStateChange fires → Jotai userAtom hydrates
```

**2. User connected — leaves, comes back (token valid)**
```
User returns to any route → browser sends cookies
  → Server loader → createServerClient(cookies)
  → supabase.auth.getUser() → valid session
  → Loader gets JWT from session → calls Express API with Bearer token
  → API fetches data via Supabase service role → returns to loader
  → SSR renders full page with data
  → Client hydrates → onAuthStateChange → Jotai atom set
```

**3. User returns after access token expiration (1h default)**
```
Browser sends cookies (expired access token + valid refresh token)
  → Server loader → createServerClient(cookies)
  → supabase.auth.getUser() → expired, auto-refreshes via refresh token
  → @supabase/ssr writes new cookies to response
  → Loader proceeds with fresh token → calls Express API
  → User sees the page normally

If refresh token is also expired (default 1 week):
  → getUser() returns null → 302 redirect to /login
```

### Jotai — Role & Boundaries

Jotai is a **client-side reactive cache**, never the source of truth for auth.

| Use Jotai for | Do NOT use Jotai for |
|---------------|----------------------|
| Cached `user` object (client-side) | JWT storage or persistence |
| UI state (modals, loading flags) | Server-side auth checks |
| Derived state (`isAuthenticated`) | Session refresh logic |
| Optimistic updates | Data fetching (use TanStack Query + HTTP client) |

Jotai atoms start as `null` on SSR. They hydrate on the client
via `onAuthStateChange`. Server loaders use cookies, never Jotai.

### What Goes Where

| Concern | Package | Phase |
|---------|---------|-------|
| Auth (login, signup, session) | `@financial-app/shared` | 5 (this) |
| Jotai atoms (auth, UI) | `@financial-app/shared` | 5 (this) |
| Domain types | `@financial-app/shared` | 5 (this) |
| Utility functions | `@financial-app/shared` | 5 (this) |
| Express API routes | `apps/api` | 7 |
| OpenAPI spec | `apps/api/openapi.yaml` | 7 |
| Generated HTTP client | `@financial-app/http-client` | 7 |
| TanStack Query hooks | `@financial-app/shared` (or http-client) | 7+ |

---

## Step 5.1 — Create packages/shared/

Use skill: `/add-package shared lib`

```bash
pnpm --filter @financial-app/shared add @supabase/supabase-js @supabase/ssr
pnpm --filter @financial-app/shared add jotai
pnpm --filter @financial-app/shared add zod
```

> No `@tanstack/react-query` yet — it comes with the HTTP client in Phase 7.
> Storage adapters (expo-secure-store, async-storage) and `@react-native-google-signin/google-signin`
> are app-level dependencies — NOT in the shared package.

---

## Step 5.2 — Directory Structure

```
packages/shared/src/
  auth/
    client.ts              # createBrowserClient() — web client-side
    client.server.ts       # createServerClient(request) — web SSR only
    client.native.ts       # createNativeClient(storage) — pluggable, no Expo dep
    oauth.ts               # signInWithGoogle() — web (redirect flow via Supabase)
    oauth.native.ts        # signInWithGoogle() — native (receives idToken, calls signInWithIdToken)
    guard.ts               # requireAuth(request) — reusable server loader helper
    hooks.ts               # useAuth() — subscribes onAuthStateChange, updates Jotai
    types.ts               # AuthStorage interface, SignInPayload, SignUpPayload, OAuthProvider
  atoms/
    auth.atom.ts           # userAtom, isAuthenticatedAtom
    ui.atom.ts             # UI state (modals, loading)
  types/
    index.ts               # domain types (Transaction, Budget, Pot, Balance)
  utils/
    currency.ts            # format currency
    date.ts                # format dates
  index.ts                 # public API barrel
```

---

## Step 5.3 — Auth Module

### src/auth/types.ts
```ts
export interface AuthStorage {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

export interface SignInPayload {
  email: string
  password: string
}

export interface SignUpPayload {
  name: string
  email: string
  password: string
}

export type OAuthProvider = 'google'
```

### src/auth/client.ts — Web browser client
```ts
import { createBrowserClient as createSupaBrowserClient } from '@supabase/ssr'

export function createBrowserClient() {
  return createSupaBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  )
}
```

### src/auth/client.server.ts — Web SSR client
```ts
import {
  createServerClient as createSupaServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'

export function createServerClient(request: Request) {
  const headers = new Headers()

  const supabase = createSupaServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options),
            )
          })
        },
      },
    },
  )

  return { supabase, headers }
}
```

### src/auth/client.native.ts — Mobile client (pluggable storage)
```ts
import { createClient } from '@supabase/supabase-js'
import type { AuthStorage } from './types'

export function createNativeClient(storage: AuthStorage) {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''

  return createClient(url, key, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
}
```

### src/auth/oauth.ts — Web Google sign-in (redirect flow)
```ts
import type { SupabaseClient } from '@supabase/supabase-js'

export async function signInWithGoogle(supabase: SupabaseClient, redirectTo: string) {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
}
```

### src/auth/oauth.native.ts — Native Google sign-in (ID token flow)
```ts
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Signs in with Google on native platforms.
 * The caller is responsible for obtaining the idToken via
 * @react-native-google-signin/google-signin at the app level.
 */
export async function signInWithGoogle(supabase: SupabaseClient, idToken: string) {
  return supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  })
}
```

> The native version receives an `idToken` string instead of a `redirectTo` URL.
> Each app obtains the token using `@react-native-google-signin/google-signin`
> and passes it to this function. This keeps the shared package free of native deps.

### src/auth/guard.ts — Server loader helper
```ts
import { redirect } from 'react-router'
import { createServerClient } from './client.server'

export async function requireAuth(request: Request) {
  const { supabase, headers } = createServerClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw redirect('/login', { headers })
  }

  // Extract access token for API calls
  const { data: { session } } = await supabase.auth.getSession()
  const accessToken = session?.access_token ?? ''

  return { supabase, user, headers, accessToken }
}
```

> `accessToken` is returned so loaders can forward it to the Express API
> as a Bearer token. The API validates it via `supabase.auth.getUser(token)`.

### src/auth/hooks.ts — Client-side auth subscription
```ts
import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import type { SupabaseClient } from '@supabase/supabase-js'
import { userAtom } from '../atoms/auth.atom'

export function useAuthListener(supabase: SupabaseClient) {
  const setUser = useSetAtom(userAtom)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      },
    )
    return () => subscription.unsubscribe()
  }, [supabase, setUser])
}
```

---

## Step 5.4 — Jotai Atoms

### src/atoms/auth.atom.ts
```ts
import { atom } from 'jotai'
import type { User } from '@supabase/supabase-js'

export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)
```

### src/atoms/ui.atom.ts
```ts
import { atom } from 'jotai'

export const isLoadingAtom = atom(false)
```

---

## Step 5.5 — Domain Types

### src/types/index.ts

> These mirror the OpenAPI schemas from Phase 7. When the HTTP client is generated,
> these can be replaced by the generated types. Keep them for now as the canonical
> shapes used across the app.

```ts
export interface Balance {
  current: number
  income: number
  expenses: number
}

export interface Transaction {
  id: string
  avatar: string
  name: string
  category: string
  date: string
  amount: number
  recurring: boolean
}

export interface Budget {
  id: string
  category: string
  maximum: number
  theme: string
}

export interface Pot {
  id: string
  name: string
  target: number
  total: number
  theme: string
}
```

---

## Step 5.6 — Utility Functions

### src/utils/currency.ts
```ts
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}
```

### src/utils/date.ts
```ts
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}
```

---

## Step 5.7 — Add to All Apps

```bash
# All 4 consumer apps
pnpm --filter mobile-financial-app add @financial-app/shared@workspace:^
pnpm --filter mobile-expo-financial-app add @financial-app/shared@workspace:^
pnpm --filter mobile-expo-ejected-financial-app add @financial-app/shared@workspace:^
pnpm --filter web-financial-app add @financial-app/shared@workspace:^

# Storage adapters — app-level, NOT in shared
pnpm --filter mobile-expo-financial-app add expo-secure-store
pnpm --filter mobile-expo-ejected-financial-app add expo-secure-store
pnpm --filter mobile-financial-app add @react-native-async-storage/async-storage

# Google Sign-In — app-level, NOT in shared
pnpm --filter mobile-expo-financial-app add @react-native-google-signin/google-signin
pnpm --filter mobile-expo-ejected-financial-app add @react-native-google-signin/google-signin
pnpm --filter mobile-financial-app add @react-native-google-signin/google-signin
```

> For Expo apps, add the config plugin to `app.json`:
> ```json
> ["@react-native-google-signin/google-signin", { "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID" }]
> ```
> For bare RN CLI, native setup is required (GoogleService-Info.plist for iOS, google-services.json for Android).

---

## Step 5.8 — App-Level Wiring

### Expo apps — storage adapter
```ts
// apps/mobile-expo/src/lib/supabase.ts
import * as SecureStore from 'expo-secure-store'
import { createNativeClient } from '@financial-app/shared/auth/client.native'
import type { AuthStorage } from '@financial-app/shared/auth/types'

const secureStoreAdapter: AuthStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
}

export const supabase = createNativeClient(secureStoreAdapter)
```

### Bare RN CLI — storage adapter
```ts
// apps/mobile/src/lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createNativeClient } from '@financial-app/shared/auth/client.native'
import type { AuthStorage } from '@financial-app/shared/auth/types'

const asyncStorageAdapter: AuthStorage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
}

export const supabase = createNativeClient(asyncStorageAdapter)
```

### Expo apps — Google Sign-In wiring
```ts
// apps/mobile-expo/src/lib/google-auth.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { signInWithGoogle } from '@financial-app/shared/auth/oauth.native'
import { supabase } from './supabase'

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
})

export async function handleGoogleSignIn() {
  await GoogleSignin.hasPlayServices()
  const response = await GoogleSignin.signIn()
  if (response.data?.idToken) {
    return signInWithGoogle(supabase, response.data.idToken)
  }
  throw new Error('Google Sign-In failed: no ID token returned')
}
```

### Bare RN CLI — Google Sign-In wiring
```ts
// apps/mobile/src/lib/google-auth.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { signInWithGoogle } from '@financial-app/shared/auth/oauth.native'
import { supabase } from './supabase'

GoogleSignin.configure({
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
})

export async function handleGoogleSignIn() {
  await GoogleSignin.hasPlayServices()
  const response = await GoogleSignin.signIn()
  if (response.data?.idToken) {
    return signInWithGoogle(supabase, response.data.idToken)
  }
  throw new Error('Google Sign-In failed: no ID token returned')
}
```

### Web — loader usage (auth check + API call pattern)
```ts
// apps/web/app/routes/overview.tsx
import { requireAuth } from '@financial-app/shared/auth/guard'
// After Phase 7: import { getBalance } from '@financial-app/http-client'

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, headers, accessToken } = await requireAuth(request)

  // After Phase 7, data comes from Express API:
  // const { data: balance } = await getBalance({
  //   headers: { Authorization: `Bearer ${accessToken}` },
  // })

  return Response.json({ user }, { headers })
}
```

---

## Step 5.9 — Env Variables

### apps/mobile-expo/.env (and mobile-expo-ejected)
```
EXPO_PUBLIC_SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<from root .env>
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=<from Google Cloud Console>
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=<from Google Cloud Console>
```

### apps/mobile/.env
```
SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
SUPABASE_ANON_KEY=<from root .env>
GOOGLE_WEB_CLIENT_ID=<from Google Cloud Console>
GOOGLE_IOS_CLIENT_ID=<from Google Cloud Console>
```

### apps/web/.env
```
VITE_SUPABASE_URL=https://lccpruqcqalxtbddggow.supabase.co
VITE_SUPABASE_ANON_KEY=<from root .env>
```

> Web does not need Google client IDs — Supabase handles the OAuth redirect
> using credentials configured in the Supabase dashboard.

Actual keys live in root `.env` (gitignored). Each app copies with its prefix.

---

## Step 5.10 — Public Routes vs Protected Routes

### Web (React Router v7)

```
/login      — public (no requireAuth)
/signup     — public (no requireAuth)
/overview   — protected (requireAuth in loader)
/transactions — protected
/budgets    — protected
/pots       — protected
/recurring  — protected
```

### Mobile (Expo Router / React Navigation)

Auth state drives stack selection:
```
isAuthenticated === false → AuthStack (Login, SignUp screens)
isAuthenticated === true  → MainStack (tabs: Overview, Transactions, etc.)
```

The `useAuthListener` hook keeps Jotai in sync.
Navigation reacts to atom changes — no manual redirects.

---

## Completion Criteria

- [ ] `packages/shared/` exists with auth, atoms, types, utils
- [ ] No renderer imports anywhere in packages/shared/ (pure TS)
- [ ] No data fetching in packages/shared/ (deferred to Phase 7)
- [ ] `createBrowserClient()` works on web (client-side)
- [ ] `createServerClient()` works in SSR loaders (cookies)
- [ ] `createNativeClient(storage)` works with both SecureStore and AsyncStorage
- [ ] `signInWithGoogle()` works on web (redirect flow via Supabase)
- [ ] `signInWithGoogle()` works on native (ID token flow via `@react-native-google-signin/google-signin`)
- [ ] Google OAuth configured in Supabase dashboard (provider enabled, client IDs set)
- [ ] `requireAuth()` redirects unauthenticated users to /login
- [ ] `requireAuth()` returns `accessToken` for forwarding to Express API
- [ ] Token auto-refresh works transparently (scenario 3)
- [ ] Jotai atoms hydrate on client via onAuthStateChange (regardless of sign-in method)
- [ ] Domain types exported from src/types/index.ts
- [ ] All 4 apps resolve @financial-app/shared correctly
- [ ] `pnpm type-check && pnpm lint && pnpm test` passes

## Next

-> docs/plans/phase-7-api-and-http-client.md (Express API + OpenAPI + HeyAPI client)
-> Then Phase 6 (Turborepo) wraps everything
