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
- **Always query Basic Memory** before coding — search `mcp__basic-memory__search_notes` for notes related to the current task (architecture decisions, past fixes, gotchas). The knowledge base (`memory/` directory) holds lessons that prevent repeated mistakes and wasted time.
- **Secrets** — live in `.env*` files — never in rules, memory, or code
- **Always use pnpm** — never npm or yarn, including for registry lookups (`pnpm view` not `npm view`)
- **Never `console.log`** — use `console.warn` / `console.error`
- **Never explicit `any`** — strict TypeScript
- **JSDoc everywhere** — EVERY interface property, EVERY function (`@param` + `@returns`), EVERY hook, EVERY type with properties, EVERY constant — no path exception, no "internal helper" excuse (QUAL-003/004/005)
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
| `features.md`        | Screen/View split, feature package architecture                |
| `specifications.md`  | App specifications reminder and extra specifications           |

**Before coding**: ask which reference files are needed — do NOT start coding without the relevant files loaded.

## Session State

### Completed

Read `@completed.md`

### Next

1. ~~**CRUD Transactions (mode manuel)**~~ ✅ DONE
2. **Onboarding** — `docs/plans/onboarding-plan.md` ← IN PROGRESS
   - ~~App icons + branding~~ ✅ — Pouch logo (icon.png, adaptive-icon.png, favicon.png, splash-icon.png)
   - ~~Animated splash screen~~ ✅ — DotLottie (.lottie), 120 frames @ 30fps, plays once on cold start, module-level flag prevents replay
   - ~~_layout.tsx refactor~~ ✅ — extracted AnimatedSplash, AuthBootstrap, AuthGate into dedicated components
   - ~~DB table `user_preferences` + API endpoints~~ ✅ — GET/PUT preferences, POST initial-balance, MSW test infra (14 tests)
   - ~~Auth flow screens~~ ✅ — OtpInput atom, VerifyEmailScreen, TotpEnrollScreen, TotpChallengeScreen, AccountActivatedScreen, useTotpEnroll/useTotpChallenge hooks, OAuth Google (web+native), AuthGate routing, 5 tests, review pass
   - ~~Web auth guard + SSR~~ ✅ — v8_middleware (sequential before child loaders), entry.server.tsx (Accept-Language → i18n sync), HydrateFallback (no sidebar flash), DotLottie splash (React.lazy, prefers-reduced-motion), HTTPS guard, shared splash asset symlink
   - ~~Debug cleanup + review pass~~ ✅ — removed debug logs from shared auth/hooks, 6-agent review, fixed: SEC-008/010, A11Y-001/004/007/011, ARCH-002/017, REACT-001, QUAL-007/018
   - ~~SignupForm feature component~~ ✅ — shared SignupForm (native+web), PasswordRulesList molecule, usePasswordRules hook (3-state: pristine/valid/invalid, 6 rules), Storybook stories, 27 tests, wired into mobile-expo + web
   - ~~ModeChoiceScreen~~ ✅ — ModeCard molecule (cross-platform, CVA, medallion icon), ModeChoiceScreen feature (native+web), SVG icons (bank+manual), Icon 6xl size, Storybook stories (component+screen device frames), routes (mobile-expo auth group + web clientLoader guard), i18n keys (en+fr), review fixes (aria-disabled, token refs, styles extraction)
   - ~~InitialBalanceScreen + preferences routing~~ ✅ — InitialBalanceScreen feature (native+web), Storybook stories (native+web), routes (mobile-expo auth group + web clientLoader guard), AuthGate preferences check, HeyAPI nullable enum fix (z.union + z.literal for `mode: 'manual' | 'bank' | null`), i18n keys (en+fr), 6-agent review pass
   - ~~AuthGate refactor~~ ✅ — extracted useAuthRedirect hook (MFA check, preferences query, onboarding routing), named constants (AUTH_GROUP_SEGMENT, MFA_ASSURANCE_LEVEL_1), AuthGate reduced to 13-line wrapper. Fixes QUAL-006 + QUAL-013.
   - ~~LanguageDropdown + SVG pipeline~~ ✅ — LanguageDropdown feature component (native+web) with flag SVGs, SVG import pipeline for 3 bundlers (Metro: react-native-svg-transformer, Vite: vite-plugin-svgr, Storybook: custom enforce:'pre' plugin), shared SVG assets via `@financial-app/shared/assets/*`, root `svg.d.ts` type declarations, bottom sheet text color fix (`text-inherit` CSS inheritance), removed Storybook controls from all screen stories (Settings, ModeChoice, InitialBalance)
   - ~~SettingsScreenView styling~~ ✅ — 5-layer styling pattern (.styles.ts with shared/web/native), barrel files, removed cn() single-arg wrappers, accessibilityRole="header", tab layout tw refactor (StyleSheet→tw, useMemo screenListeners)
   - Walkthrough: slideshow of 4 real screens, isolated `QueryClientProvider` with mock data pre-filled via `setQueryData`
   - Flow: Splash → Login/Signup → Verify Email → Account Activated → Mode Choice → Initial Balance → Walkthrough → Overview
   - ~~Balance model fix~~ ✅ — `get_balance` RPC corrected to `current = reference + income - expenses - pots`. Verified: reference=3641.50 → current=4836.00. data.json fixed (expenses=1699.75).
   - ~~Dev seed endpoint~~ ✅ — `POST /dev/seed` with Zod validation, CASCADE user reset, date-shift to current month. Shell script reads SEED_EMAIL/SEED_PASSWORD from .env. `pnpm seed` from root.
   - ~~Dynamic budget month~~ ✅ — replaced hardcoded `BUDGET_MONTH='2024-08'` with `getCurrentBudgetMonth()` across all 6 route files. Module-level query options moved inside component (web/budgets). Inline arrows extracted to useCallback (mobile-expo + bare mobile overview).
   - ~~Web form refactor (dataset pattern)~~ ✅ — useFormValidation owns form state, web forms expose data via `<form>` dataset (`data-error`, `data-form-data`). 6 web modals migrated (transaction add/edit, budget add/edit, pot add/edit). Zod schema factories with i18n (`createXxxFormSchema(t)`). Transaction amount changed to string type (text input + character filter). Rate limiter fix (writeLimiter skips GET). Review pass: removed dead DataTest interface, fixed JSDoc, extracted getCharsLeftLabel useCallback, cleaned commented-out debug logs.
   - ~~Native form fix + shared CRUD hooks + tests~~ ✅ — Fixed 3 native form components (platform-agnostic ref types, amount: string). Extracted useTransactionCrud, useBudgetCrud, usePotCrud into @financial-app/features. Zod schema refine() guard (empty string bypass). useFormValidation tests (16), CRUD hook tests (3×10), form component tests (3×7). Rate limiter fix (skip GET). 6-agent review pass (97/100).
   - ~~Dropdown scroll bug~~ ✅ — portal dropdown menu was closing on internal `<ul>` scroll because `window.addEventListener('scroll', handleClose, true)` captured ALL scroll events; fixed by checking `e.target` containment in `menuWrapperRef` before closing
   - ~~Tooltip atom~~ ✅ — cross-platform Tooltip (native+web), 12 placements (top/bottom/left/right + aligned variants), dual mode (target ref + manual coords), Portal rendering, auto-flip, arrow pointing to target center, Storybook stories (5), removed legacy DSTooltip
   - Walkthrough: slideshow of 4 real screens, isolated `QueryClientProvider` with mock data pre-filled via `setQueryData`
   - Flow: Splash → Login/Signup → Verify Email → Account Activated → Mode Choice → Initial Balance → Walkthrough → Overview
   - **Next coding**: Onboarding walkthrough — decide navigation pattern and screen sequencing (how steps chain, prev/next controls, overlay + tooltip orchestration)
2.5. ~~**OWASP Security Hardening**~~ ✅ — all actionable findings resolved, audit-owasp skill upgraded to OWASP 2025
3. Empty states (all screens + Overview sections) — part of onboarding step 6.3
5. **Centralized auth** — session validation on app focus (AppState → getSession())
6. **Page error recovery** — TanStack Query focusManager for RN, refetchOnMount
7. Tests — API + hooks
8. Phase 8B: GoCardless bank connection (mode banque) — `docs/plans/phase-8B-gocardless-bank-connection.md`
9. Navigation web: graphic design refinement (user doing manual pass)

**--- Refactors (à planifier, pas dans la foulée) ---**
10. **Shared mutation hooks** — `docs/plans/shared-mutation-hooks.md` — 3 done (useTransactionCrud, useBudgetCrud, usePotCrud), remaining: extract showSuccess/showError/formBridge duplication from web routes into shared helpers
11. **i18n label internalization** — audit feature components (TransactionFormContent, BudgetFormContent, etc.) for fixed labels passed as props → internalize `t()` calls (QUAL-024). Evaluate each label: if it never changes between usages, move inside the component.
12. **Screen/View extraction** — extract all monolithic/hybrid route files into `XxxScreenView` feature components (see `.claude/rules/features.md`). Goal: every screen renderable in Storybook. Screens to refactor:
    - `login` (web + mobile) — **Monolithic** (109-129 lines, full form inline, no feature component)
    - `home` / `index` (web + mobile) — **Hybrid** (235-288 lines, Overview sub-components exist but layout + queries inline)
    - `transactions` (web + mobile) — **Hybrid** (308-332 lines, DataTable + FormContent exist but header/layout + 3 mutations inline)
    - `budgets` (web + mobile) — **Hybrid** (391-432 lines, BudgetCategoryCard + FormContent exist but grid + 3 mutations + local wrapper inline)
    - `pots` (web + mobile) — **Hybrid** (460-497 lines, PotCard + FormContent exist but grid + 5 mutations + local wrapper inline)
    - `recurring` (web + mobile) — **Hybrid** (104-139 lines, DataTable + BillsSummary exist but page layout inline)
    - Auth screens (already properly split, need `*Screen` → `*ScreenView` rename): signup, verify-email, account-activated, totp-enroll, totp-challenge, mode-choice, initial-balance
    - `SettingsScreenView` ✅ — already uses new naming convention
13. **Server-side pagination** — replace client-side `limit: 1000` with proper paginated API calls + DataTable server pagination (currently `MAX_PAGE_SIZE = 1000` as workaround)
13. ~~**Password strength rules**~~ ✅ — usePasswordRules hook (6 rules incl. match) + PasswordRulesList molecule + SignupForm integration. signupSchema uses .min(1) (visual rules handle UX), loginSchema keeps .min(16).
14. ~~**Basic Memory knowledge base**~~ ✅ — 51 notes in `memory/`, MCP server in `.mcp.json`, `/note` skill, 10 vendor skills (defrag, reflect, tasks...), wired into start/end-session, CLAUDE.md rule added, MEMORY.md defragged (355→68 lines), known-issues.md deduped, README updated with setup guide + `.example` files.
15. ~~**CI/CD plan**~~ ✅ — `docs/plans/ci-plan.md` (GitHub Actions: validate, Playwright, Appium, SonarQube, Claude PR review, deploys). README cleaned (plans section removed — private/gitignored).
16. **Icon color variants** — align Icon `color` prop on Typography's variant system (`"muted"`, `"error"`, `"default"`, etc.) instead of raw string. Currently requires `text-*` parent wrapper (web) or `tw.color()` (native).

**Pending tests**:
- iPad: verify BottomSheet overlay, 2-tap switching, text truncation

### Known Issues

Read `@known-issues.md`
