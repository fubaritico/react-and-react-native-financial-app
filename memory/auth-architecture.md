---
title: Auth Architecture
type: note
permalink: auth-architecture
tags: [architecture, auth, supabase]
---

# Auth Architecture

## Observations

- [decision] Auth is 100% client-side via Supabase SDK — no auth routes on the API server
- [flow] Signup/login/verify all happen through `@supabase/supabase-js` directly from the app
- [flow] API receives JWT in Authorization header, validates via `supabase.auth.getUser(token)`
- [decision] No `jsonwebtoken` dependency — Supabase handles ECC P-256 signing keys
- [pattern] `res.locals.userId = user.id` — canonical way to access authenticated user in handlers
- [screens] OtpInput atom, VerifyEmailScreen, TotpEnrollScreen, TotpChallengeScreen, AccountActivatedScreen
- [hooks] useTotpEnroll, useTotpChallenge — custom hooks for TOTP 2FA flow
- [oauth] Google OAuth configured for both web (redirect) and native (expo-auth-session)
- [web] v8_middleware (sequential before child loaders), entry.server.tsx syncs Accept-Language for i18n
- [web] HydrateFallback prevents sidebar flash, DotLottie splash with React.lazy + prefers-reduced-motion
- [web] HTTPS guard in production
- [native] AuthGate component handles routing based on auth state + user preferences
- [native] Module-level splash flag prevents replay on sign-out

## Relations

- uses [[Why Supabase SDK Over Prisma ORM]]
- protected_by [[API Architecture]]
- routes_through [[Onboarding Flow Design]]
- splash_from [[Splash Animation Decisions]]
