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
- **Never execute commands** — propose only. Exceptions: (1) user says "execute", "run", etc. (2) `pnpm type-check && pnpm lint && pnpm test` from root — MUST run after every code change, never skip
- **Risky actions** (git push, reset --hard, rm -rf) require explicit permission EVERY TIME
- **Never hallucinate** — if uncertain, read code first
- **Always use context7** for any question about an API, library, or package
- **Secrets** — live in `.env*` files — never in rules, memory, or code
- **Always use pnpm** — never npm or yarn, including for registry lookups (`pnpm view` not `npm view`)
- **Never `console.log`** — use `console.warn` / `console.error`
- **Never explicit `any`** — strict TypeScript
- **Always run** lint + typecheck + test + review once a set of modifications is done
- **Always ask** user to run pnpm dev, pnpm prod:server and pnpm storybook after having modified a component
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

**Before coding**: ask which reference files are needed — do NOT start coding without the relevant files loaded.

## Session State

### Completed

Read `@completed.md`

### Next
- Next: DonutChart + BudgetsOverview (last Wave 3 items)
- Then: Phase 8 (API server + HTTP client + testing)
- BudgetsOverview placeholder on Overview page — awaiting DonutChart

### Known Issues
- Review SEC-006: `redirectTo` in oauth.ts not validated — open redirect risk. Defer until login UI is built.
- Review ARCH-003b: factories read env vars directly instead of accepting params — trades testability for DX. Revisit if unit testing becomes painful.
- Review SEC-002: bare RN uses plain AsyncStorage for tokens (unencrypted) — acceptable for learning reference, not published
- Google client IDs empty in .env files — need Google Cloud Console setup before testing OAuth

- Responsive phone/tablet layouts: need to research Expo Router adaptive layouts + useWindowDimensions patterns with context7 before building Overview components
- `expo-dev-client` not yet tested on mobile-expo-ejected
- mobile-expo-ejected `ios/` is gitignored — icon update is local only
- Husky pre-commit hook fails when Turbo runs in non-TTY git hook context — all checks pass individually, likely output buffering issue. Used HUSKY=0 as workaround for 481e539.
- RN native component tests (*.native.tsx) require Jest — Vitest cannot mock TurboModuleRegistry. UI package will need dual runners: Jest for native, Vitest for web + variants.
- @financial-app/shared barrel (index.native.ts) re-exports auth chain — screen tests must mock the barrel to avoid pulling in supabase/babel-runtime. Consider splitting barrel or using subpath imports in screens.
- Android build: AsyncStorage v3 Maven repo issue FIXED (dc90bd2). `rebuild-android.sh` handles all cache/daemon cleanup.

