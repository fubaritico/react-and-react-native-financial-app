---
title: Known Issues Registry
type: note
permalink: financial-app/known-issues-registry
tags:
- reference
- issues
- debugging
- gotcha
---

# Known Issues Registry

The canonical list of known issues, accepted trade-offs, and deferred fixes lives in `.claude/known-issues.md`. This note summarizes the categories and key items for quick lookup.

## Review Accepted / Deferred

Accepted code review findings that were intentionally deferred:
- `data-name` attributes in `.native.tsx` — intentional for debug inspection + future Appium e2e
- SEC-006: `redirectTo` not validated in oauth.ts — deferred until login UI is built
- ARCH-003b: factories read env vars directly — trades testability for DX
- SEC-002: bare RN uses plain AsyncStorage for tokens — learning reference only, not published
- A11Y-008: PasswordInput toggle missing aria-pressed — pre-existing, low priority
- A02-007: `getSession()` reads JWT locally without server revalidation — client-side routing only, server uses `getUser()`
- A04-012/A08-013: RPCs accept arbitrary `p_user_id` — service role key context, enforced by `requireAuth` middleware
- Render props are an accepted exception to REACT-001
- ModalRenderer `?? t()` fallbacks are adapter pattern, not ARCH-017 violation

## Platform Gotchas

### iOS
- AuthCard appears too small — needs Figma comparison
- ATS blocks cleartext HTTP to localhost — needs `NSAllowsLocalNetworking: true`
- iOS 18.4 simulator fetch bug — RESOLVED with Xcode 26

### Android
- Fresco returns 1x1 PNG on 404 instead of onError — Avatar uses MIN_VALID_SIZE check
- EditText has larger default padding than iOS — fixed with `includeFontPadding: false`
- Android 12+ always shows adaptive icon on native splash — system behavior, accepted
- `expo-dev-client` crashes on API 36/37 (Baklava) — use API 35

### React Native / Expo
- twrnc `rounded-t-lg` doesn't work — use explicit RN style
- twrnc doesn't support class overriding like tailwind-merge
- react-native-svg `fill` prop may not update on re-render — use `key={color}`
- RN `overflow: visible` does NOT work on iOS
- BottomSheet 2-tap switching is accepted behavior
- `react-aria-components` are web-only — native uses `@react-native-community/datetimepicker`
- Checkbox barrel import causes circular dependency — use direct sibling imports

## Build / Tooling
- HeyAPI codegen drops `| null` on nullable enums — generated `UserPreferences.mode` is `'manual' | 'bank'` but API returns `null` for new users. Zod schema has `.nullable()`, OpenAPI YAML has `type: [string, "null"]`, but HeyAPI outputs the enum without null. Workaround: patch the type or cast at consumption in `usePreferences`.

- `@financial-app/tokens` missing `.d.ts` in build output — workaround: use `/map` subpath
- Husky pre-commit hook times out in non-TTY — HUSKY=0 workaround
- Jest pnpm singleton — FIXED with `moduleNameMapper`
- DotLottie `onComplete` fires early — use `setTimeout` instead

## Refactors Needed
- QUAL-009: Budget/Pots/Transactions pages exceed 200 lines — extract `useXxxModals` hooks
- ~~Shared mutation hooks~~ — RESOLVED: 3 CRUD hooks + useFeedbackModals + useDeleteBodyRenderer + IModalHandle all in `@financial-app/features`
- Balance model per month needs `months` table refactor

## Canonical File

Always check `.claude/known-issues.md` for the full, up-to-date list. This note is a summary for quick search.
