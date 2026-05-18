# Claude Code — rn-monorepo

> Read this first every session. Then read .claude/rules/ relevant to your task.
> For implementation plans, see docs/plans/. For skills, see .claude/skills/.
> For more information about the project intent and history, see files/docs and context MD files.

## Project

Personal Finance app (Frontend Mentor challenge) built on a cross-platform design system
targeting React Native (Expo) and React web (React Router).

- **Package manager**: pnpm workspaces
- **Monorepo orchestration**: Turborepo (turbo.json — to be added in Phase 6)
- **Language**: TypeScript strict throughout
- **Org scope**: @financial-app/*

## Critical Workflow Rules
- **Shared responsibility** — you and the user share ownership of code quality and consistency. You are RESPONSIBLE. Care about every line you write — review your own output before presenting it.
- **Be concise** — no recap, no enumerations, no unsolicited explanations. Act, then report briefly if needed.
- **Discuss approach FIRST** — never code without confirming approach
- **Review → Test → Commit** per change — no accumulation
- **Never execute commands** — propose only. Exceptions: (1) user says "execute", "run", etc. (2) `pnpm type-check && pnpm lint && pnpm test` from root then `/review` — MUST run all 4 after every code change, never skip
- **Always use root scripts** — never `cd apps/... && npx expo ...`. Use `pnpm expo:rebuild:ios`, `pnpm expo:start`, etc. from monorepo root. All scripts are in root `package.json`.
- **Risky actions** (git push, reset --hard, rm -rf) require explicit permission EVERY TIME
- **Never hallucinate** — if uncertain, read code first
- **If it works elsewhere, it works here** — when something fails, NEVER conclude "it can't work" or write workaround mocks. Search how other projects do it (GitHub, issues, docs), find the root cause in YOUR setup (resolution paths, singleton issues, config), and fix it. If thousands of devs use Jest+RN successfully, the problem is your config, not the tool.
- **Always use context7** for any question about an API, library, or package
- **Secrets** — live in `.env*` files — never in rules, memory, or code
- **Always use pnpm** — never npm or yarn, including for registry lookups (`pnpm view` not `npm view`)
- **Never `console.log`** — use `console.warn` / `console.error`
- **Never explicit `any`** — strict TypeScript
- **Always run** `pnpm type-check && pnpm lint && pnpm test` then `/review` after every set of modifications — ALL 4 MANDATORY, NEVER SKIP ANY
- **Always ask** user to run pnpm dev, pnpm prod:server and pnpm storybook after having modified a component
- **Always use** the design system when coding components, NEVER code simple tags, asks user if components exist, if not create them
- **Always create a Storybook story** after every component (`/story`)
- **Model**: Haiku for questions/research, Sonnet for code/commits — suggest Haiku when appropriate
- **For React**: instead of using `React.` for react types, import the type from react
- **React/RN skills**: always apply `composition-patterns`, `react-best-practices`, and `react-native-skills` when writing or reviewing component code
- **Screenshot**: given screenshot names are always files located in desktop, otherwise the full file path is given
- **Never i18n fallbacks** — NEVER pass a second argument to `t()` (e.g. `t('key', 'fallback')`), NEVER use default values for label/placeholder props in destructuring (e.g. `label = 'Edit'`), NEVER use `?? 'fallback'` on translated strings. If a key is missing, add it to both `en/translation.json` and `fr/translation.json`. Labels are always required props (`label: string`, not `label?: string`).

## Current State vs Target

### Exists now
```
apps/
  mobile/              bare RN CLI — learning reference, may be aligned from time to time
  mobile-expo/         Expo SDK 54 — CANONICAL mobile app, primary focus
  mobile-expo-ejected/ ejected Expo — learning reference, may be aligned from time to time
packages/
  ui/       @financial-app/ui — RN-only, needs cross-platform refactor
```

> **Production-grade**: all 3 mobile apps are kept intentionally to compare bare RN CLI
> vs Expo managed vs Expo ejected. All are held to production-grade quality.
> Only mobile-expo will be published. The other two may be updated to stay aligned.
> Never delete them.

### Target after all phases
```
apps/
  mobile/              renamed from packages/mobile-expo
  web/                 new — React Router + Vite
packages/
  tokens/              new — Style Dictionary, single token source of truth
  tailwind-config/     new — shared Tailwind config consumed by both apps
  ui/       refactored — cross-platform via file extension split
  shared/              new — Supabase, Jotai atoms, TanStack Query, types, utils
```

## Core Architecture Decisions

1. **Cross-platform components**: file extension split
   - `Component.tsx` — types + props interface only, no JSX
   - `Component.native.tsx` — React Native implementation (twrnc)
   - `Component.web.tsx` — DOM implementation (Tailwind CSS + cn())

2. **Styling**: twrnc on native, Tailwind CSS on web — NOT NativeWind (too unstable)

3. **Shared variants**: CVA (`class-variance-authority`) in `src/variants/` — platform-agnostic
   class strings consumed by both .native.tsx and .web.tsx

4. **Token pipeline**: Style Dictionary JSON → JS/TS + CSS vars + Tailwind map + RN values

5. **Layer order**: tokens → tailwind-config → ui → apps

## Non-Negotiable Rules

- NEVER hardcode colors/spacing in app configs — always from @financial-app/tokens
- NEVER import react-native in .web.tsx files
- NEVER import HTML elements or cn() in .native.tsx files
- NEVER commit packages/tokens/build/ — it is always generated
- NEVER put hover:/focus:/transition-/shadow- classes in shared CVA variants
- NEVER add renderer imports to packages/variants/, hooks/, or shared/
- NEVER call TanStack Query option factories (e.g. `getPotsOptions()`) at module top level — always inside the component body. On Android, modules are evaluated before `useConfigureHttpClient` sets the correct `baseUrl` (`10.0.2.2`), so the query fires against `localhost` which the emulator can't reach.

## Tech Stack

| Domain         | Choice                        |
|----------------|-------------------------------|
| Native styling | twrnc ^4.6.1                  |
| Web styling    | Tailwind CSS 3                |
| Variants       | class-variance-authority      |
| Tokens         | Style Dictionary (DTCG)       |
| Database/Auth  | Supabase                      |
| Local state    | Jotai                         |
| Server state   | TanStack Query                |
| Navigation     | Expo Router (mobile)          |
| Forms          | useFormValidation hook + zod   |

## Canonical Packages

| Package                  | Path                      | Status        |
|--------------------------|---------------------------|---------------|
| @financial-app/tokens         | packages/tokens/          | to create     |
| @financial-app/tailwind-config| packages/tailwind-config/ | to create     |
| @financial-app/ui  | packages/ui/   | to refactor   |
| @financial-app/shared         | packages/shared/          | to create     |
| mobile (app)             | apps/mobile/              | to rename     |
| web (app)                | apps/web/                 | to create     |

## Supabase

- URL: https://lccpruqcqalxtbddggow.supabase.co
- Credentials in .env (gitignored) — copy from .env.example

## Navigation

- `.claude/rules/` — domain rules (ui, tokens, styling, monorepo)
- `.claude/skills/` — agent skills for recurring tasks
- `docs/plans/` — step-by-step phase plans with exact file changes
- `files/docs and context/PERSONAL_FINANCE_ANALYSIS_EN.md` — full product specification

## Reference Files (load on demand — NOT auto-loaded)
| File                 | When to load                                                   |
|----------------------|----------------------------------------------------------------|
| `new-component.md`   | UI component, design system and other pattern to apply strictly |
| `design-system.md`   | All the rules to follow about UI package files, folders        |
| `styling.md`         | All the rules to follow about styling                          |
| `tokens.md`          | All infrmation about token use and setup                       |
| `monorepo.md`        | Description of the expected project architecture               |
| `troubleshooting.md` | Debug, architectural decisions                                 |
| `api.md`             | API server patterns, routes, Supabase queries, auth, validation |
| `specifications.md`  | App specifications reminder and extra specifications           |

**Before coding**: ask which reference files are needed — do NOT start coding without the relevant files loaded.

## Session State

### Completed

Read `@completed.md`

### Next

1. **CRUD Transactions (mode manuel)** — `docs/plans/transactions/transaction-crud-plan.md` ✅ DONE
   - ~~1.a: API POST/PUT/DELETE + TransactionFormContent + modal Add + useFormValidation~~ ✅
   - ~~1.b: Checkbox component (UI atoms)~~ ✅
   - ~~1.c: DatePicker web + icon rect SVG support~~ ✅
   - ~~1.c.2: DatePicker native implementation~~ ✅
   - ~~1.c.3: DatePicker i18n labels~~ ✅
   - ~~1.d: DatePicker integration in TransactionFormContent~~ ✅
   - ~~2: modal Edit~~ ✅
   - ~~3: modal Delete~~ ✅
   - ~~4: ActionCell + wire onEdit/onDelete to DataTable~~ ✅ — EmptyHeaderCell + ellipsis Dropdown, mutation feedback (success/error modals), Button loading spinner, useModal.setSubmitting, Modal closeLabel/cancelLabel required + ModalRenderer i18n defaults, DatePicker iOS BottomSheet close fix
   - ~~5: bouton "+ Add Transaction"~~ ✅ — already wired
2. **Onboarding** — `docs/plans/onboarding-plan.md` ← IN PROGRESS
   - ~~App icons + branding~~ ✅ — Pouch logo (icon.png, adaptive-icon.png, favicon.png, splash-icon.png)
   - ~~Animated splash screen~~ ✅ — DotLottie (.lottie), 120 frames @ 30fps, plays once on cold start, module-level flag prevents replay
   - ~~_layout.tsx refactor~~ ✅ — extracted AnimatedSplash, AuthBootstrap, AuthGate into dedicated components
   - ~~DB table `user_preferences` + API endpoints~~ ✅ — GET/PUT preferences, POST initial-balance, MSW test infra (14 tests)
   - ~~Auth flow screens~~ ✅ — OtpInput atom, VerifyEmailScreen, TotpEnrollScreen, TotpChallengeScreen, AccountActivatedScreen, useTotpEnroll/useTotpChallenge hooks, OAuth Google (web+native), AuthGate routing, 5 tests, review pass
   - ~~Web auth guard + SSR~~ ✅ — v8_middleware (sequential before child loaders), entry.server.tsx (Accept-Language → i18n sync), HydrateFallback (no sidebar flash), DotLottie splash (React.lazy, prefers-reduced-motion), HTTPS guard, shared splash asset symlink
   - ~~Debug cleanup + review pass~~ ✅ — removed debug logs from shared auth/hooks, 6-agent review, fixed: SEC-008/010, A11Y-001/004/007/011, ARCH-002/017, REACT-001, QUAL-007/018
   - Walkthrough: slideshow of 4 real screens, isolated `QueryClientProvider` with mock data pre-filled via `setQueryData`
   - Flow: Splash → Login/Signup → Verify Email → Account Activated → Mode Choice → Initial Balance → Walkthrough → Overview
   - **Next coding**: TanStack Query preferences hooks + ModeChoiceScreen + InitialBalanceScreen + routing glue
2.5. **OWASP Security Hardening** — `/audit-owasp` findings, fixing one by one
   - ~~OWASP-A04-007: TOCTOU race on pot balance~~ ✅ — atomic `update_pot_total` RPC + pots.ts refactor
   - ~~Re-run audit 2026-05-17~~ ✅ — 10-agent parallel scan, 91 raw → 45 unique findings, score 48/100 (FAIL). Full report: `~/Desktop/OWASP-audit-2026-05-17.md`
   - ~~A09-003: No audit trail~~ ✅ — pino + pino-http structured logging, audit logs on all financial mutations
   - ~~A01-007: No rate limiting~~ ✅ — express-rate-limit two-tier (global 200/15min, write 50/15min)
   - ~~A02-001/002: Session expiry~~ ✅ — useSessionExpiry hook, refreshSession() in IAuthClient, warning modal 60s before expiry (Extend/Ignore), autoRefreshToken stays false
   - ~~A04-002: No Zod bounds~~ ✅ — .min/.max on all financial amounts (±1M), pagination limit (1000 — raised from 100, client-side filtering needs all rows), search length (100), centralized constants, i18n validation keys
   - ~~Review pass~~ ✅ — SEC-008 (error sanitization), QUAL-021 (error prefix), SEC-010/011 (CORS prod guard), QUAL-004, QUAL-013
   - ~~A04-003: No bounds on initial balance~~ ✅ — min 0 instead of -1M
   - ~~A01-005: Swagger UI exposed in production~~ ✅ — NODE_ENV guard
   - ~~A02-003: Weak password min length~~ ✅ — raised to 8 chars
   - ~~A09-005: No audit trail for preferences update~~ ✅ — pino audit log
   - ~~A06-001: Express/cors outdated deps~~ ✅ — express 5.2.1, cors 2.8.6
   - ~~A05-002: CORS localhost fallback~~ ✅ — already fixed (prod guard)
   - ~~A08-006: No UUID validation on :id params~~ ✅ — validateParams + IdParamSchema
   - ~~A07-004: Sign-out scope:local~~ ✅ — already fixed
   - ~~A02-005: Cookie flags not enforced~~ ✅ — httpOnly, secure, sameSite in SSR
   - ~~A07-006: No TOTP attempt limiting~~ ✅ — 5-attempt lockout + remaining attempts UX (countdown from 2nd failure)
   - ~~iOS splash stuck bug~~ ✅ — 5s safety timeout in useAuthListener
   - ~~A07-007: No AAL2 enforcement~~ ✅ — server-side MFA check via decodeJwtPayload + admin.mfa.listFactors
   - ~~A04-006: DELETE returns 200~~ ✅ — already fixed (204 + count check)
   - ~~A04-008: No body size limit~~ ✅ — express.json({ limit: '10kb' })
   - ~~A05-003: Missing security headers~~ ✅ — explicit helmet CSP + HSTS 2yr
   - ~~A05-005: No trust proxy~~ ✅ — trust proxy in production
   - ~~A05-006: Raw error.message leak~~ ✅ — logger.error() + generic responses, 18 occurrences across 6 routes, transactions PUT explicit destructuring
   - ~~A05-007: Android usesCleartextTraffic in prod~~ ✅ — app.config.ts conditional on APP_ENV
   - ~~A06-004: Supabase JS version skew~~ ✅ — pnpm catalog alignment
   - ~~A06-005: Tailwind bare "3" range~~ ✅ — pinned to ~3.4.19
   - ~~A06-007: expo-secure-store version mismatch~~ ✅ — aligned to ~15.0.8
   - ~~A06-008: No CI pipeline~~ ✅ — basic GitHub Actions (audit + type-check + lint + test)
   - ~~A08-008: Zero-amount transactions~~ ✅ — .refine(v => v !== 0) on Create/Update schemas
   - ~~A09-009: No request correlation ID~~ ✅ — pino-http genReqId (X-Request-Id or crypto.randomUUID)
   - ~~A09-011: Auth error logging gated behind __DEV__~~ ✅ — removed gate
   - ~~A03-001: Unbounded ILIKE search~~ ✅ — escape %, _, \ metacharacters
   - ~~A02-006: ALLOWED_ORIGINS no prod guidance~~ ✅ — documented in .env.example
   - ~~A03-007: No max length on string fields~~ ✅ — name:100, category:50, theme:30
   - ~~A03-009: Unvalidated href in Navigation~~ ✅ — sanitize to path-relative only
   - ~~A05-010: Auth error [AUTH] prefix~~ ✅ — removed internal prefix tags
   - ~~A06-011: @testing-library/react-hooks deprecated~~ ✅ — removed (unused)
   - ~~A06-012: conventional-changelog exact pin~~ ✅ — caret range
   - ~~A07-009: Web inactivity timeout tab-hide only~~ ✅ — added idle input detection
   - ~~A07-010: Login password no min length~~ ✅ — .min(8) on login schema
   - ~~A08-010: No DB CHECK on amount != 0~~ ✅ — CHECK constraint added
   - ~~A08-012: No DB CHECK on reference >= 0~~ ✅ — CHECK constraint added
   - ~~A08-014: JSON.parse roundtrip drops Date~~ ✅ — structuredClone
   - ~~A08-015: postinstall wildcard chmod~~ ✅ — explicit script paths
   - ~~A08-016: commitlint via npx~~ ✅ — pnpm exec
   - ~~A09-012: Auth state changes not logged~~ ✅ — console.warn in useAuthListener
   - **Accepted/deferred**: A02-007 (getSession client-only), A04-012/A08-013 (RPC p_user_id — service role), A06-006 (Vite skew — Storybook v6 vs web v8), A05-008 (bundle ID — pre-deploy), A06-002/SEC-002 (bare RN AsyncStorage), A06-009 (babel caret ok), A06-010 (dotlottie pre-1.0), A09-007/A09-008 (pino already in place), A01-004 (PGRST116 already handled), A09-013/A09-014 (infra — alerting, log retention)
   - **OWASP hardening complete** — all actionable findings resolved
3. Empty states (all screens + Overview sections) — part of onboarding step 6.3
4. `POST /dev/seed` endpoint (dev-only, fills DB with data.json for testing)
5. **Centralized auth** — session validation on app focus (AppState → getSession())
6. **Page error recovery** — TanStack Query focusManager for RN, refetchOnMount
7. Tests — API + hooks
8. Phase 8B: GoCardless bank connection (mode banque) — `docs/plans/phase-8B-gocardless-bank-connection.md`
9. Navigation web: graphic design refinement (user doing manual pass)

**--- Refactors (à planifier, pas dans la foulée) ---**
10. **Shared mutation hooks** — `docs/plans/shared-mutation-hooks.md` — extract 11 hooks into `@financial-app/features`, eliminate web/mobile duplication
11. **i18n label internalization** — audit feature components (TransactionFormContent, BudgetFormContent, etc.) for fixed labels passed as props → internalize `t()` calls (QUAL-024). Evaluate each label: if it never changes between usages, move inside the component.
12. **Server-side pagination** — replace client-side `limit: 1000` with proper paginated API calls + DataTable server pagination (currently `MAX_PAGE_SIZE = 1000` as workaround)
13. **Password strength rules** — live validation on password input (signup) with 5 regex rules: `/.{16,}/`, `/[A-Z]/`, `/[a-z]/`, `/[0-9]/`, `/[$@&+?!/-]/`. Each rule shows pass/fail indicator refreshing on keystroke. Update Zod `.min(8)` to `.min(16)` accordingly.

**Pending tests**:
- iPad: verify BottomSheet overlay, 2-tap switching, text truncation

### Known Issues
- data-name attributes in .native.tsx files are intentional — used for debug tree inspection + future data-testid for Appium e2e tests. NOT a review finding.
- Review SEC-006: `redirectTo` in oauth.ts not validated — open redirect risk. Defer until login UI is built.
- Review ARCH-003b: factories read env vars directly instead of accepting params — trades testability for DX. Revisit if unit testing becomes painful.
- Review SEC-002: bare RN uses plain AsyncStorage for tokens (unencrypted) — acceptable for learning reference, not published
- Google client IDs empty in .env files — need Google Cloud Console setup before testing OAuth
- A02-007: `getSession()` reads JWT locally without server revalidation — accepted. Client uses it for routing/UI only; all server-side auth uses `getUser()` (network call) in `requireAuth` middleware. Adding a round-trip to every `getSession()` would degrade UX for no security gain.
- A04-012/A08-013: RPCs accept arbitrary `p_user_id` without `auth.uid()` check — accepted. API uses service role key (no `auth.uid()` context), identity enforced by `requireAuth` middleware passing `res.locals.userId`. RPCs are never called directly by clients.

- iOS AuthCard: login card appears too small — needs Figma reference comparison (user will provide PNG)
- iOS unknown black element at top of screen — needs screenshot to diagnose

- twrnc `rounded-t-lg` doesn't apply border radius on native — must use explicit RN style `{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }`
- twrnc `flex-1` in CVA column variant may not propagate to Pressable — added explicit `{ flex: 1 }` style in NavItem.native.tsx
- react-native-svg: `fill` prop on `<Path>` may not update on re-render — added `key={color}` on `<Svg>` + `color={color}` prop to set currentColor. Also `pointerEvents="none"` needed to prevent SVG from capturing touches.
- `tabBarStyle` in React Navigation doesn't support `borderRadius` — use `tabBarBackground` with a custom View for rounded tab bar corners
- Expo Go vs dev-client mode: presence of `ios/`/`android/` dirs auto-switches to dev-client. See `docs/modus-operandi/expo-modes.md`
- Responsive phone/tablet layouts: need to research Expo Router adaptive layouts + useWindowDimensions patterns with context7 before building Overview components
- `expo-dev-client` not yet tested on mobile-expo-ejected
- mobile-expo-ejected `ios/` is gitignored — icon update is local only
- Husky pre-commit hook fails when Turbo runs in non-TTY git hook context — all checks pass individually, likely output buffering issue. Used HUSKY=0 as workaround for 481e539. Fixed in 2e3c04b: root causes were StatusCell.native.tsx importing TableCell.web (cross-platform violation pulling DOM types into bare RN) + storybook tsconfig missing vite/client types.
- RN native component tests (*.native.tsx) now use `vitest-native` plugin (Vitest multi-project: web=jsdom, native=vitest-native). 23 Checkbox tests pass (13 web + 10 native). Features package also has Vitest (jsdom only, 8 tests).
- Jest pnpm singleton fix DONE: pnpm creates 2 copies of react-native (different @babel/core peer contexts), preset mocks only apply to one → `moduleNameMapper` forces singleton. See `troubleshooting.md` "Jest + pnpm Monorepo" section.
- @financial-app/shared barrel (index.native.ts) re-exports auth chain — screen tests must mock the barrel to avoid pulling in supabase/babel-runtime. Consider splitting barrel or using subpath imports in screens.
- Android build: AsyncStorage v3 Maven repo issue FIXED (dc90bd2). `rebuild-android.sh` handles all cache/daemon cleanup.
- Review A11Y-008: PasswordInput toggle missing accessibilityState/aria-pressed for visibility state — pre-existing, low priority
- pnpm virtual store creates duplicate entries when peer dep contexts differ (e.g. react-dom versions) — fixed for i18n by removing react-i18next from UI, but bare RN still needs react-native-svg singleton hack in metro.config.js
- #Alias web barrel convention: .web.tsx files must import from `#Atoms/index.web` (not `#Atoms`) because tsc resolves the bare alias to the native barrel (index.ts). Document in design-system.md rules.
- Native BottomSheet: 2-tap switching between sheets is accepted behavior (overlay Pressable blocks touches to triggers behind it). See memory/bottomsheet-portal.md for full context on RN touch system limitations.
- RN `overflow: visible` does NOT work on iOS to show content outside a parent View — RN clips regardless. Do not attempt 0-height + overflow:visible patterns.
- RN `pointerEvents="box-none"` only passes touches to children, NOT to sibling Views in the tree.
- Android Fresco: returns onLoad with 1x1 transparent base64 PNG instead of onError when image URL 404s — Avatar detects via dimension check (MIN_VALID_SIZE = 2)
- Supabase project credentials stored in `files/critical` (gitignored) — never commit. Test user: `s_cottereau@yahoo.fr` / UUID `d8e4f26e-dc4f-41a7-8e66-1b1805a00b41`
- React Router loaders are navigation-driven, not state-driven — atom changes alone don't trigger redirects. Web sign-out needs explicit `navigate('/login', { replace: true })` after `authClient.signOut()`
- Icon pipeline only supports fill-based SVGs — stroke-based paths won't render (generate-icon-data.js extracts `d` attributes, Icon component renders with fill)
- Cross-device session sync: each device (web/mobile) has its own Supabase session (localStorage vs AsyncStorage). Signing out on web does NOT sign out mobile — they are independent. JWT expiry currently 600s (10 min) in Supabase dashboard — **TODO: change to 1200s (20 min)** manually in dashboard. `autoRefreshToken: false` on both platforms. Session expiry warning modal (60s before expiry, Extend/Ignore) + inactivity timeout (30s) + 401 session-expired modal — three separate flows. TODO: add session validation on app focus (AppState change → `getSession()`).
- iOS 18.4 simulator: Apple bug broke `NSURLSession` fetch — RESOLVED by updating to Xcode 26 + iOS 26.5 runtime
- ListboxList.native.tsx uses `accessibilityRole="menu"` instead of `"listbox"` — pre-existing, should be aligned with web for consistency
- iOS ATS blocks cleartext HTTP to localhost — `app.json` needs `NSAllowsLocalNetworking: true` in infoPlist + native rebuild (`npx expo prebuild --clean && npx expo run:ios`). See `memory/auth-401-redirect-wip.md`
- QUAL-009: Budget pages (web + mobile) exceed 200 lines (~240/230) — extract `useBudgetModals` hook in future refactor
- `IModalConfig.description` removed — all modal body content uses `body: ReactNode` exclusively
- CSS variable bridge `var(--color-base-${color}-DEFAULT)` fails for colors without DEFAULT suffix (e.g. grey-900). Fixed in ProgressBar with fallback: `var(--color-base-X-DEFAULT, var(--color-base-X))`. Other components using the same pattern may need the same fix.
- `expo-dev-client` crashes on Android API 36/37 (Baklava) — use API 35 (Android 15). Tracked: expo/expo#35385
- twrnc does NOT support class overriding like tailwind-merge — `px-0` after `px-5` won't override in a single tw call. Use RN `style` prop (last in array wins) or choose the right CVA size variant instead
- QUAL-009: Pots pages (web ~407 + mobile ~373 lines) exceed 200 lines — same pattern as budget, extract `usePotsModals` hook later
- Balance model per month: `current = reference - SUM(pots)` doesn't handle months — needs refactor with `months` table (opening_balance + SUM transactions) when onboarding is implemented
- 5th nav button becomes hamburger menu with all navigations + extras (language, months, logout, tutorial) — Recurring Bills moves inside this menu
- App philosophy: supplementary financial management tool / forecasting. NEVER writes to user's bank account. Bank data is copied as working draft. User controls month creation rhythm (not automatic).
- useFormValidation hook added to shared — budget/pots modals don't use it yet (retrofit planned after CRUD transactions)
- Icon pipeline now supports path + circle + rect SVG elements (fill-based only — stroke-based paths won't render)
- `react-aria-components` are web-only (DOM-based) — NOT compatible with React Native. Native DatePicker uses `@react-native-community/datetimepicker`
- DatePicker `w-[280px]` arbitrary Tailwind value for calendar popover width — no token exists for this, accepted
- Android `EditText` (RN TextInput) has larger default padding than iOS — fixed with `includeFontPadding: false` + `textAlignVertical: 'center'` + `paddingVertical: 0` (Platform.OS guard, iOS untouched)
- Checkbox.native.tsx: barrel import `#Atoms` causes circular dependency at runtime (Metro) — atoms must use direct sibling imports (`../Icon/Icon.native`) instead of barrel when importing siblings
- DatePicker native iOS: `display="inline"` overflows modal — must use BottomSheet container. `themeVariant="dark"` + `accentColor` (beige-500) for dark calendar styling
- Button `ghost` variant (no bg/border) + `icon` size (40x40, no padding) — used for icon-only buttons like BottomSheet close. Icon size is controlled by `Icon iconSize` prop, NOT by Button size.
- i18n SSR solved: entry.server.tsx parses Accept-Language, client uses htmlTag detector → no hydration mismatch
- NavItem.web.tsx: presentational div (no role/tabIndex) when onPress is undefined, role="button" when standalone. Navigation uses nav landmark (aria-label="Main") instead of tablist/tab.
- Render props (e.g. Dropdown `trigger`) are an accepted exception to REACT-001 — they return JSX, not side effects
- Husky pre-commit hook still times out on Turbo test phase in non-TTY — HUSKY=0 workaround still needed (276eda2)
- QUAL-009: Transactions pages (web + mobile) exceed 200 lines with mutation feedback — extract `useTransactionModals` hook later (same pattern as budget/pots)
- Shared mutation hooks refactor — `docs/plans/shared-mutation-hooks.md` — extract 11 hooks (transactions/budgets/pots) into `@financial-app/features` to eliminate web/mobile duplication
- Modal.native.tsx:133 `accessibilityLabel ?? 'Close'` — hardcoded English fallback on backdrop Pressable (pre-existing, low priority)
- ModalRenderer uses `?? t('modal.close')` / `?? t('modal.cancel')` for optional IModalConfig fields — this is the adapter pattern (providing i18n defaults for optional config), NOT an ARCH-017 violation
- `@lottiefiles/dotlottie-react-native` `onComplete` fires early (frame 90/120) — use `setTimeout` matching known animation duration instead. `onFrame` also unreliable without JS thread overhead.
- DotLottie requires `.lottie` format (ZIP archive with JSON + assets), not raw Lottie `.json` — convert via LottieFiles online converter
- Android 12+ always shows adaptive icon on native splash screen (system behavior, not configurable) — accepted
- Occasional crash on hot reload (`r`) with DotLottie — app restart resolves, not a production concern

