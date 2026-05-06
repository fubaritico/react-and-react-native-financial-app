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
- **Screenshot**: given screenshot names are always files located in desktop, otherwise the full file path is given

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
| Forms          | react-hook-form + zod         |

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
| File                 | When to load                                                    |
|----------------------|-----------------------------------------------------------------|
| `new-component.md`   | UI component, design system and other pattern to apply strictly |
| `design-system.md`   | All the rules to follow about UI package files, folders         |
| `styling.md`         | All the rules to follow about styling                           |
| `tokens.md`          | All infrmation about token use and setup                        |
| `monorepo.md`        | Description of the expected project architecture                |
| `troubleshooting.md` | Debug, architectural decisions                                  |
| `api.md`             | API server patterns, routes, Supabase queries, auth, validation |

**Before coding**: ask which reference files are needed — do NOT start coding without the relevant files loaded.

## Session State

### Completed

Read `@completed.md`

- feat(i18n): react-i18next with EN/FR translations across all apps (987131e) — shared config in @financial-app/shared, per-app init (expo-localization, react-native-localize, i18next-browser-languagedetector), UI components refactored to props-based i18n, Storybook stories updated with i18n.t() pattern
- feat(ui): Pagination molecule + Button refactor (f3b844b) — cross-platform Pagination with enterprise-grade props, sliding window + ellipsis algorithms, responsive web (matchMedia), Button refactored for composability (children, outline variant, nav/sm sizes, ariaCurrent), i18n pagination keys EN/FR, review rules updated (focus-visible, accessibilityState, QUAL-017, ARCH-002)
- feat(ui): Dropdown molecule + Portal/Drawer/Menu/Listbox foundation (b4d2468) — new foundation molecules (Listbox, Menu with keyboard nav, Drawer bottom sheet, Portal atom), cross-platform Dropdown compound component (desktop: floating Menu with auto-flip + optional Portal; mobile: dark Drawer), Button extended with ariaHaspopup/ariaExpanded/ariaControls/className/ref, Storybook stories for all new components
- feat(state): wire Jotai Provider in all apps + centralize in catalog (a664939) — Jotai added to pnpm catalog, Provider wrapping all 3 apps (mobile-expo, mobile, web)
- feat(ui): add Modal organism + shared modal service (7898692) — cross-platform compound component (Modal.Header/Body/Footer), focus trap, Escape-to-close, backdrop click, scroll lock, 44x44 touch targets, return-focus-on-close, Jotai-based useModal hook in shared, web+native Storybook stories
- feat(ui): add DataTable cell factories — steps 1-3 (98801b1) — @tanstack/react-table added to catalog + ui deps, 6 cross-platform cell factories (SimpleCell, DateCell, AmountCell, AvatarNameCell, BillTitleCell, StatusCell) with HOF pattern, inlined Intl formatters (currency, date, ordinal), all in subdirectories with barrel files
- feat(ui): add DataTable shell, SortableHeader, ActionBar, Pagination — steps 4-11 (57c849f) — SortableHeader (caretDown icon, rotation for asc, hidden when unsorted), cells barrels, DataTablePagination adapter (bridges TanStack Table to Pagination molecule), ActionBar sub-component (rightActions + TextInput search), DataTable types/constants/variants/styles, DataTable.web.tsx (semantic table + compact renderCompactRow + ResizeObserver), DataTable.native.tsx (FlatList dual mode + useWindowDimensions), 3-state rendering (loading/data/empty), registered in both public API barrels
- feat(ui): add DataTable sub-components + reorganize into components/ — step 12 (9a10c01) — NoResults, TableFooter (rows-per-page + pagination), DropdownFilter (toggle pattern), TruncatedContent (truncate + tooltip), filters/ (assertNumberFilter, doesNotContainString), sorting/ (sortNumbers). Sub-components moved into DataTable/components/. A11Y-007 fixed (focus-visible on interactive rows).
- feat(ui): add TransactionsDataTable stories + table sub-components + a11y fixes (2e3c04b) — TransactionsDataTable web+native stories (wrapper component pattern), responsive column visibility (matchMedia columnVisibility), responsive action bar (desktop labels+dropdowns, mobile icon triggers+drawers), table sub-components (Table, TableHeader, TableBody, TableRow, TableHead, TableCell), a11y fixes (focus-visible/role/tabIndex on clickable web rows, accessibilityState on native Pressable), pagination fix (removed hardcoded state.pagination), cross-platform violation fix (StatusCell.native importing TableCell.web), storybook tsconfig fix (vite/client types for import.meta.env)
- chore(ui): uniformize props (Readonly), add JSDoc, migrate to #Alias imports (9b96828) — Readonly<> on all DS component params, JSDoc on variants/styles/constants/types, #Lib/#Atoms/#Molecules/#Organisms/#Templates aliases replacing ../../../ relative paths, intermediate barrel files per atomic level, tsconfig paths in ui + all 5 apps, vite-tsconfig-paths in storybook + web, Metro resolveRequest in all 3 mobile apps, features-package plan (docs/plans/features-package.md)
- chore: remove all external project references from codebase (936783f) — scrubbed all external attribution from source, docs, plans, session state, and memory
- refactor(ui): standardize .styles.ts pattern with shared/web named exports (8e3abd4) — migrated all component .styles.ts to shared/web named exports (Card, Modal, DataTable, AuthCard, PotsOverview, TransactionsOverview, RecurringBillsOverview, ActionBar, Pagination, Divider, TextInput, TransactionRow), created new .styles.ts for Button, LinkText, SectionLink, PasswordInput, Drawer, Header. Updated new-component skill (mandatory step 2), review skill (QUAL-018), design-system.md, styling.md. Card shadow-md moved from CVA to web.root.
- docs: updated features-package.md — Overview organisms move to features, ui keeps atomic DS (c0e02a6)
- feat(ui): add NavItem atom + Navigation organism + Colors story (e5aacd2) — NavItem cross-platform atom (CVA: active/orientation/collapsed), Navigation web-only organism (sidebar expanded/collapsed + bottom bar), responsive phone/tablet (useWindowDimensions, collapsed on phone), tabBarBackground for rounded corners, Icon.native fixes (color prop on Svg, pointerEvents="none"), Typography nav-text/nav-active color variants, Colors story (full token palette), i18n minimizeMenu key, web Sidebar refactored to use Navigation
- docs: add Expo modes guide + troubleshooting updates (aa1f7a9) — new docs/modus-operandi/expo-modes.md
- feat: add @financial-app/features package, migrate Overview organisms from ui (b89673f) — new packages/features with dual-platform exports, moved PotsOverview/TransactionsOverview/RecurringBillsOverview from ui organisms to features/overview, own tw/cn instances, explicit subpath imports (@financial-app/ui/native for .native.tsx), updated all 3 apps + storybook imports, README updated with project structure + features package
- feat(storybook): add NavItem + Navigation stories (93f2509) — web + native NavItem stories (Playground, SidebarItems, BottomBarItems, Collapsed), web Navigation stories (Playground, Interactive, Expanded, Collapsed), dark background support in Storybook
- feat(features): extract TransactionsDataTable + locale support (a227c46) — TransactionsDataTable restructured into directory (constants/utils split, CompactTransactionRow in components/), sort state sync (useMemo derived from sorting), locale param added to DateCell/AmountCell factories (ui), locale prop threaded through TransactionsDataTable → columns → CompactTransactionRow, Storybook stories simplified to consume from @financial-app/features
- refactor(ui): rename Drawer → BottomSheet + Portal system + Avatar fix + review fixes (8bd731c) — Drawer→BottomSheet rename across codebase, Portal rewritten (key-based useId + Map-based PortalProvider), BottomSheet.native tw-only (no StyleSheet.create), Avatar.native Fresco 1x1 detection (onLoad dimensions), black token added, combineColumnFilters mutation fix, .styles.ts 3 exports pattern (shared/web/native), TextInput maxLength prop, rules/skills updated (no StyleSheet+tw mixing, QUAL-018 expanded)
- feat(ui): add DonutChart atom + enforce constants/utils/types separation (4016897) — cross-platform SVG donut chart (annular sector arc math, highlight ring overlay with semi-transparent white circle), strict file responsibility separation enforced (constants=values, utils=functions, types=all interfaces), new QUAL-019 review rule, new-component skill + design-system.md updated, web+native Storybook stories (8 web, 5 native)
- feat(features): add BudgetOverview + Currency + ColorBarItem + Card refactor (76d6e32) — BudgetOverview cross-platform organism (responsive tablet horizontal layout: chart left + legend right via two-level wrapper pattern mirroring web), Currency atom (formatCurrency display component), ColorBarItem molecule (colored bar + label + amount), Card refactored (responsive padding, shared.titleSpacing extracted from inline), formatCurrency + color utilities in @financial-app/shared, features/src/lib/ deleted (cn/tw now imported from @financial-app/ui), Storybook stories for BudgetOverview + ColorBarItem (web + native)
- feat(ui): add ProgressBar atom with thick/thin variants + stories (e515450) — cross-platform progress bar (thick: h-8 p-1 rounded-md track + rounded-sm fill; thin: h-2 rounded-lg), CSS variable bridge for web color, twrnc interpolation for native, optional metaLeft/metaRight ReactNode slots, stories wrapped in Card with token-referenced colors, review score 94/100
- feat(ui): add LatestSpending molecule + Divider className prop + stories (9dd358e) — cross-platform LatestSpending molecule (beige sub-card, header with SectionLink, divider-separated rows with avatar/name/amount/date), Divider extended with optional className prop for custom colors, first divider skipped (index > 0), itemRight uses flex-col for vertical alignment, stories with LongLabels variant for truncation testing, review score 97/100
- feat(features): add BudgetCategoryCard organism + Dropdown destructive/divider support (bff58d2) — BudgetCategoryCard cross-platform organism (ProgressBar + LatestSpending + Card with ColorDot, Dropdown menu for edit/delete), Dropdown enhanced with dividerBefore + destructive option support through Listbox → Menu → Dropdown chain, ListboxVariantProps extends pattern, i18n translation keys for all budget card labels (EN/FR), rules updated to enforce translation keys for default prop values, Menu stories fixed for CVA null variant type
- feat(pages): wire Budget route across all 3 apps with shared data util (ff168a2) — buildBudgetPageData() shared function in @financial-app/shared, web loader + mobile-expo/mobile useMemo, BudgetOverview + BudgetCategoryCard rendered with mock data
- fix: move container-queries plugin from shared config to web-only (499da13) — @tailwindcss/container-queries moved from @financial-app/tailwind-config to apps/web (twrnc crashes on theme() calls)
- fix(ui): review fixes — DataTable/ActionBar/TextInput a11y + platform safety + dead code (1017710) — import type in DataTable.types.ts, showActionBar guard inversion fixed in native, shrink/overflow-clip moved to web-only styles, accessibilityLabel prop added to TextInput, dead DataTable.tsx deleted, native export added to styles files, ActionBar refactored (single IActionBarProps, rightActions, positive showActionBar)
- feat(pages): wire Pots route + PotCard component + i18n + UI fixes (bc3242b) — PotCard cross-platform organism (features/pots) with Card+ColorDot+ProgressBar thin+Dropdown ellipsis+two action buttons, wired into all 3 apps with mock data + @container grid on web, i18n keys EN/FR, label props made required (PotCard + BudgetCategoryCard), Button CVA text-preset-4-bold (font-sans text-sm font-bold leading-normal), story wrappers maxWidth→width 600, Dropdown Menu shape rounded, TransactionsDataTable showActionBar native + globalFilter web, budget/index.web.ts barrel fix
- feat(pages): wire Recurring Bills route + BillsSummary + fixes (0776593) — BillsSummary component in features/recurring-bills (web+native), CompactBillRow for phone layout (renderCompactRow pattern), Status atom extracted from StatusCell + icon color fix (tw.color() for native SVG fill), CategoryIconCell factory (icon+name+status on mobile), RecurringBillsDataTable wired in all 3 apps, buildRecurringBillsPageData in @financial-app/shared, i18n recurring.summary key, new category icons (10 SVGs), review score 97/100
- feat(db): add Supabase schema, seed data, and setup guide (1aade95) — 4 tables (balances, transactions, budgets, pots) with RLS policies, indexes, updated_at triggers, 2 RPC functions (get_balance, get_budgets_with_spent), seed.sql with all mock data, supabase-setup.md step-by-step guide, all .env/.env.example updated for new Supabase project (wfovogtulmjynujtfiml)

### Next — Phase 8A: API Server + HTTP Client

**Current task**: Scaffold `apps/api/` (Express 5 + Zod + OpenAPI + Swagger UI + auth middleware)
- DB is live with seeded data on `wfovogtulmjynujtfiml.supabase.co`
- Plan: `docs/plans/phase-8-api-and-http-client.md`
- Skill: `.claude/skills/api-openapi`

**Phase 8A pipeline**:
1. DB schema + seed + setup guide — ✅ Done (1aade95)
2. Scaffold `apps/api/` — Express + middleware + Supabase lib
3. Zod schemas — all entity schemas with OpenAPI metadata
4. Routes — balance → transactions → budgets → pots → recurring-bills
5. OpenAPI spec generation + Swagger UI
6. `packages/http-client/` — HeyAPI scaffold + generation
7. TanStack Query hooks — in `packages/shared/src/hooks/`
8. App wiring — auth gate + QueryClientProvider + HTTP client config
9. Page migration — replace mocks with hooks
10. Dev seed endpoint — `POST /dev/seed`
11. Tests — API + hooks

**Then**:
- CRUD modals (Add/Edit/Delete Budget, Add/Edit/Delete Pot, Add/Withdraw Money)
- Phase 8B: Plaid integration (separate)
- Navigation web: graphic design refinement (user doing manual pass)

**Pending tests**:
- iPad: verify BottomSheet overlay, 2-tap switching, text truncation

### Known Issues
- data-name attributes in .native.tsx files are intentional — used for debug tree inspection + future data-testid for Appium e2e tests. NOT a review finding.
- Review SEC-006: `redirectTo` in oauth.ts not validated — open redirect risk. Defer until login UI is built.
- Review ARCH-003b: factories read env vars directly instead of accepting params — trades testability for DX. Revisit if unit testing becomes painful.
- Review SEC-002: bare RN uses plain AsyncStorage for tokens (unencrypted) — acceptable for learning reference, not published
- Google client IDs empty in .env files — need Google Cloud Console setup before testing OAuth

- twrnc `rounded-t-lg` doesn't apply border radius on native — must use explicit RN style `{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }`
- twrnc `flex-1` in CVA column variant may not propagate to Pressable — added explicit `{ flex: 1 }` style in NavItem.native.tsx
- react-native-svg: `fill` prop on `<Path>` may not update on re-render — added `key={color}` on `<Svg>` + `color={color}` prop to set currentColor. Also `pointerEvents="none"` needed to prevent SVG from capturing touches.
- `tabBarStyle` in React Navigation doesn't support `borderRadius` — use `tabBarBackground` with a custom View for rounded tab bar corners
- Expo Go vs dev-client mode: presence of `ios/`/`android/` dirs auto-switches to dev-client. See `docs/modus-operandi/expo-modes.md`
- Responsive phone/tablet layouts: need to research Expo Router adaptive layouts + useWindowDimensions patterns with context7 before building Overview components
- `expo-dev-client` not yet tested on mobile-expo-ejected
- mobile-expo-ejected `ios/` is gitignored — icon update is local only
- Husky pre-commit hook fails when Turbo runs in non-TTY git hook context — all checks pass individually, likely output buffering issue. Used HUSKY=0 as workaround for 481e539. Fixed in 2e3c04b: root causes were StatusCell.native.tsx importing TableCell.web (cross-platform violation pulling DOM types into bare RN) + storybook tsconfig missing vite/client types.
- RN native component tests (*.native.tsx) require Jest — Vitest cannot mock TurboModuleRegistry. UI package will use single Jest runner with multi-project config (native + web projects) — not yet implemented.
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

