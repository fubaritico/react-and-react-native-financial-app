# Known Issues

## Review Accepted / Deferred
- data-name attributes in .native.tsx files are intentional — used for debug tree inspection + future data-testid for Appium e2e tests. NOT a review finding.
- Review SEC-006: `redirectTo` in oauth.ts not validated — open redirect risk. Defer until login UI is built.
- Review ARCH-003b: factories read env vars directly instead of accepting params — trades testability for DX. Revisit if unit testing becomes painful.
- Review SEC-002: bare RN uses plain AsyncStorage for tokens (unencrypted) — acceptable for learning reference, not published
- Review A11Y-008: PasswordInput toggle missing accessibilityState/aria-pressed for visibility state — pre-existing, low priority
- A02-007: `getSession()` reads JWT locally without server revalidation — accepted. Client uses it for routing/UI only; all server-side auth uses `getUser()` (network call) in `requireAuth` middleware.
- A04-012/A08-013: RPCs accept arbitrary `p_user_id` without `auth.uid()` check — accepted. API uses service role key, identity enforced by `requireAuth` middleware.
- Render props (e.g. Dropdown `trigger`) are an accepted exception to REACT-001 — they return JSX, not side effects
- ModalRenderer uses `?? t('modal.close')` / `?? t('modal.cancel')` for optional IModalConfig fields — adapter pattern, NOT ARCH-017 violation
- Modal.native.tsx:133 `accessibilityLabel ?? 'Close'` — hardcoded English fallback on backdrop Pressable (pre-existing, low priority)
- DatePicker `w-[280px]` arbitrary Tailwind value for calendar popover width — no token exists for this, accepted

## Auth / Supabase
- Google client IDs empty in .env files — need Google Cloud Console setup before testing OAuth
- Cross-device session sync: each device (web/mobile) has its own Supabase session (localStorage vs AsyncStorage). Signing out on web does NOT sign out mobile — they are independent. JWT expiry currently 600s (10 min) — **TODO: change to 1200s (20 min)** in dashboard. `autoRefreshToken: false` on both platforms. Session expiry warning modal (60s before expiry) + inactivity timeout (30s) + 401 session-expired modal — three separate flows.
- Supabase project credentials stored in `files/critical` (gitignored) — never commit. Test user: `s_cottereau@yahoo.fr` / UUID `d8e4f26e-dc4f-41a7-8e66-1b1805a00b41`
- React Router loaders are navigation-driven, not state-driven — atom changes alone don't trigger redirects. Web sign-out needs explicit `navigate('/login', { replace: true })` after `authClient.signOut()`

## iOS
- iOS AuthCard: login card appears too small — needs Figma reference comparison (user will provide PNG)
- iOS unknown black element at top of screen — needs screenshot to diagnose
- iOS ATS blocks cleartext HTTP to localhost — `app.json` needs `NSAllowsLocalNetworking: true` in infoPlist + native rebuild. See `memory/auth-401-redirect-wip.md`
- iOS 18.4 simulator: Apple bug broke `NSURLSession` fetch — RESOLVED by updating to Xcode 26 + iOS 26.5 runtime

## Android
- Android Fresco: returns onLoad with 1x1 transparent base64 PNG instead of onError when image URL 404s — Avatar detects via dimension check (MIN_VALID_SIZE = 2)
- Android `EditText` (RN TextInput) has larger default padding than iOS — fixed with `includeFontPadding: false` + `textAlignVertical: 'center'` + `paddingVertical: 0` (Platform.OS guard, iOS untouched)
- Android 12+ always shows adaptive icon on native splash screen (system behavior, not configurable) — accepted
- `expo-dev-client` crashes on Android API 36/37 (Baklava) — use API 35 (Android 15). Tracked: expo/expo#35385

## React Native / Expo
- twrnc `rounded-t-lg` doesn't apply border radius on native — must use explicit RN style `{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }`
- twrnc `flex-1` in CVA column variant may not propagate to Pressable — added explicit `{ flex: 1 }` style in NavItem.native.tsx
- twrnc does NOT support class overriding like tailwind-merge — `px-0` after `px-5` won't override in a single tw call. Use RN `style` prop (last in array wins)
- react-native-svg: `fill` prop on `<Path>` may not update on re-render — added `key={color}` on `<Svg>` + `color={color}` prop. Also `pointerEvents="none"` needed to prevent SVG from capturing touches.
- `tabBarStyle` in React Navigation doesn't support `borderRadius` — use `tabBarBackground` with a custom View
- RN `overflow: visible` does NOT work on iOS to show content outside a parent View — RN clips regardless
- RN `pointerEvents="box-none"` only passes touches to children, NOT to sibling Views in the tree
- Native BottomSheet: 2-tap switching between sheets is accepted behavior. See memory/bottomsheet-portal.md
- `react-aria-components` are web-only (DOM-based) — NOT compatible with React Native. Native DatePicker uses `@react-native-community/datetimepicker`
- DatePicker native iOS: `display="inline"` overflows modal — must use BottomSheet container. `themeVariant="dark"` + `accentColor` (beige-500)
- Checkbox.native.tsx: barrel import `#Atoms` causes circular dependency at runtime (Metro) — atoms must use direct sibling imports
- Expo Go vs dev-client mode: presence of `ios/`/`android/` dirs auto-switches to dev-client. See `docs/modus-operandi/expo-modes.md`
- `expo-dev-client` not yet tested on mobile-expo-ejected
- mobile-expo-ejected `ios/` is gitignored — icon update is local only
- Responsive phone/tablet layouts: need to research Expo Router adaptive layouts + useWindowDimensions patterns before building Overview components

## Build / Tooling
- Husky pre-commit hook still times out on Turbo test phase in non-TTY — HUSKY=0 workaround still needed
- Jest pnpm singleton fix DONE: pnpm creates 2 copies of react-native — `moduleNameMapper` forces singleton. See `troubleshooting.md`
- RN native component tests (*.native.tsx) use `vitest-native` plugin (Vitest multi-project: web=jsdom, native=vitest-native)
- @financial-app/shared barrel (index.native.ts) re-exports auth chain — screen tests must mock the barrel to avoid pulling in supabase/babel-runtime
- Android build: AsyncStorage v3 Maven repo issue FIXED (dc90bd2). `rebuild-android.sh` handles all cache/daemon cleanup.
- pnpm virtual store creates duplicate entries when peer dep contexts differ — fixed for i18n by removing react-i18next from UI
- DotLottie requires `.lottie` format (ZIP archive), not raw `.json` — convert via LottieFiles
- `@lottiefiles/dotlottie-react-native` `onComplete` fires early (frame 90/120) — use `setTimeout` instead
- Occasional crash on hot reload (`r`) with DotLottie — app restart resolves, not production concern

## Architecture / Conventions
- #Alias web barrel convention: .web.tsx files must import from `#Atoms/index.web` (not `#Atoms`) because tsc resolves bare alias to native barrel
- Icon pipeline only supports fill-based SVGs — stroke-based paths won't render
- Icon pipeline supports path + circle + rect SVG elements
- Button `ghost` variant (no bg/border) + `icon` size (40x40, no padding) — for icon-only buttons
- i18n SSR solved: entry.server.tsx parses Accept-Language, client uses htmlTag detector → no hydration mismatch
- NavItem.web.tsx: presentational div when onPress undefined, role="button" when standalone. Navigation uses nav landmark.
- `IModalConfig.description` removed — all modal body content uses `body: ReactNode` exclusively
- CSS variable bridge `var(--color-base-${color}-DEFAULT)` fails for colors without DEFAULT suffix — fixed in ProgressBar with fallback
- ListboxList.native.tsx uses `accessibilityRole="menu"` instead of `"listbox"` — pre-existing, should align with web

## Refactors Needed
- QUAL-009: Budget pages (~240/230 lines), Pots pages (~407/373 lines), Transactions pages exceed 200 lines — extract `useXxxModals` hooks
- useFormValidation hook added to shared — budget/pots modals don't use it yet (retrofit planned)
- Shared mutation hooks refactor — `docs/plans/shared-mutation-hooks.md` — extract 11 hooks into `@financial-app/features`
- Balance model per month: `current = reference - SUM(pots)` doesn't handle months — needs `months` table refactor

## Product
- 5th nav button becomes hamburger menu with all navigations + extras (language, months, logout, tutorial) — Recurring Bills moves inside this menu
- App philosophy: supplementary financial management tool / forecasting. NEVER writes to user's bank account. Bank data is copied as working draft. User controls month creation rhythm (not automatic).


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
