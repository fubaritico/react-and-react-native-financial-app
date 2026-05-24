---
title: Fix — 401 Interceptor Session Expired Modal
type: note
permalink: financial-app/fix-401-interceptor-session-expired-modal
tags:
- fix
- auth
- interceptor
---

# Fix — 401 Interceptor Session Expired Modal

## Problem
When an unauthenticated user opens the web app, the "Session expired" modal appears immediately. No session existed — nothing expired.

## Root Cause
`useConfigureHttpClient` registers a 401 response interceptor unconditionally at mount. `AuthBootstrap` wraps the entire app (including `/login`). Any HTTP request without a token gets a 401 → interceptor fires → modal shown.

## Fix
- [fix] Added `userRef` guard: interceptor only fires `onSessionExpired` when `userRef.current` is truthy (user is authenticated)
- [fix] Reset `signingOutRef` to `false` when `user` changes (re-login), so the interceptor re-arms for the next session expiry
- [pattern] "Latest ref" pattern: `const userRef = useRef(user); userRef.current = user` — lets a callback registered once (empty deps useEffect) read the latest value without re-registering

## Key Insight
- [insight] `AuthBootstrap` never unmounts (wraps entire app including /login), so `signingOutRef` persists across login/logout cycles — must be explicitly reset on re-login
- [insight] A 401 without an active session is expected behavior, not an error condition

## Relations
- relates to [[Auth Architecture]]
- relates to [[Known Issues Registry]]
