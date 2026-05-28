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
- **Org scope**: @financial-app/\*

## Critical Workflow Rules

- **Shared responsibility** — you and the user share ownership of code quality and consistency. You are RESPONSIBLE. Care about every line you write — review your own output before presenting it.
- **Be concise** — no recap, no enumerations, no unsolicited explanations. Act, then report briefly if needed.
- **Discuss approach FIRST** — never code without confirming approach
- **Review → Test → Commit** per change — no accumulation
- **Never execute commands** — propose only. Exceptions: (1) user says "execute," "run," etc. (2) `pnpm type-check && pnpm lint && pnpm test` from root then `/review` — MUST run all 4 after every code change, never skip
- **Always use root scripts** — never `cd apps/... && npx expo ...`. Use `pnpm expo:rebuild:ios`, `pnpm expo:start`, etc. from monorepo root. All scripts are in root `package.json`.
- **Risky actions** (git push, reset --hard, rm -rf) require explicit permission EVERY TIME
- **Never hallucinate** — if uncertain, read code first
- **Research FIRST** — when something fails or behaves unexpectedly, search the web BEFORE modifying code. Check GitHub issues, changelogs, and docs for the libraries involved. Most bugs are version incompatibilities, known issues, or misconfigurations — the answer is almost never in your own code alone. Never iterate blindly on code changes without first understanding what others have encountered.
- **If it works elsewhere, it works here** — when something fails, NEVER conclude "it can't work" or write workaround mocks. Search how other projects do it (GitHub, issues, docs), find the root cause in YOUR setup (resolution paths, singleton issues, config), and fix it. If thousands of devs use Jest+RN successfully, the problem is your config, not the tool.
- **Always use context7** for any question about an API, library, or package
- **Always query Basic Memory** before coding — search `mcp__basic-memory__search_notes` for notes related to the current task (architecture decisions, past fixes, gotchas). The knowledge base (`memory/` directory) holds lessons that prevent repeated mistakes and wasted time.
- **Secrets** — live in `.env*` files — never in rules, memory, or code
- **Always use pnpm** — never npm or yarn, including for registry lookups (`pnpm view` not `npm view`)
- **Never `console.log`** — use `console.warn` / `console.error`
- **Never explicit `any`** — strict TypeScript
- **JSDoc everywhere** — EVERY interface property, EVERY function (`@param` + `@returns`), EVERY hook, EVERY type with properties, EVERY constant — no path exception, no "internal helper" excuse (QUAL-003/004/005)
- **Always run** `pnpm type-check && pnpm lint && pnpm test` then `/review` after every set of modifications — ALL 4 MANDATORY, NEVER SKIP ANY
- **Tests + Commit + End session** — every new feature, component, hook, route, or bug fix MUST ship with tests (5-level policy — see `tests.md`), a `/commit`, and `/end-session`. No code ships without tests. No session ends without committing and updating session state.
- **Always ask** the user to run `pnpm web:dev`, `pnpm api:dev`, `pnpm web:prod`, `pnpm api:prod`, and `pnpm storybook` after having modified a component
- **Always use** the design system when coding components, NEVER code simple tags, asks user if components exist, if not create them
- **Always create a Storybook story** after every component (`/story`)
- **Model**: Haiku for questions/research, Sonnet for code/commits — suggest Haiku when appropriate
- **For React**: instead of using `React.` for react types, import the type from React
- **React/RN skills**: always apply `composition-patterns`, `react-best-practices`, and `react-native-skills` when writing or reviewing component code
- **Screenshot**: given screenshot names are always files located in desktop, otherwise the full file path is given
- **Never i18n fallbacks** — NEVER pass a second argument to `t()` (e.g. `t('key', 'fallback')`), NEVER use default values for label/placeholder props in destructuring (e.g. `label = 'Edit'`), NEVER use `?? 'fallback'` on translated strings. If a key is missing, add it to both `en/translation.json` and `fr/translation.json`. Labels are always required props (`label: string`, not `label?: string`).
- **Never fallback values** — NEVER use hardcoded fallback data (static rates, default configs, mock values) as silent degradation. If a runtime dependency (API, rates, config) fails to load, throw an error. The app must not silently serve stale or incorrect data. Future exception: offline mode with persisted last-known values — but that's an explicit feature, not a silent fallback.

## Source code reference

Source code for dependencies is available in `opensrc/` for deeper understanding of implementation details.

See `opensrc/sources.json` for the list of available packages and their versions.

Use this source code when you need to understand how a package works internally, not just its types/interface.

### Fetching Additional Source Code

To fetch source code for a package or repository you need to understand, run:

```bash
npx opensrc <package>           # npm package (e.g., npx opensrc zod)
npx opensrc pypi:<package>      # Python package (e.g., npx opensrc pypi:requests)
npx opensrc crates:<package>    # Rust crate (e.g., npx opensrc crates:serde)
npx opensrc <owner>/<repo>      # GitHub repo (e.g., npx opensrc vercel/ai)
```

## Core Architecture Decisions

1. **Cross-platform components**: @new-component.md

2. **Styling**: twrnc on native, Tailwind CSS on web — NOT NativeWind (too unstable) @/.claude/rules/styling.md

3. **Shared variants**: CVA (`class-variance-authority`) in `src/variants/` — platform-agnostic
   class strings consumed by both .native.tsx and .web.tsx

4. **Token pipeline**: Style Dictionary JSON → JS/TS + CSS vars + Tailwind map + RN values

5. **Layer order**: tokens → tailwind-config → ui → features → apps @/.claude/rules/monorepo.md

## Non-Negotiable Rules

- NEVER hardcode colors/spacing in app configs — always from @financial-app/tokens
- NEVER import react-native in .web.tsx files
- NEVER import HTML elements or cn() in .native.tsx files
- NEVER commit packages/tokens/build/ — it is always generated
- NEVER put hover:/focus:/transition-/shadow- classes in shared CVA variants
- NEVER add renderer imports to packages/variants/, hooks/, or shared/
- NEVER call TanStack Query option factories (e.g. `getPotsOptions()`) at module top level — always inside the component body. On Android, modules are evaluated before `useConfigureHttpClient` sets the correct `baseUrl` (`10.0.2.2`), so the query fires against `localhost` which the emulator can't reach.
- NEVER remove debug logs until the fix is confirmed working in the target environment. Logs are removed only AFTER success is verified, not when committing the fix.

## Tech Stack

| Domain         | Choice                       |
| -------------- | ---------------------------- |
| Native styling | twrnc ^4.6.1                 |
| Web styling    | Tailwind CSS 3               |
| Variants       | class-variance-authority     |
| Tokens         | Style Dictionary (DTCG)      |
| Database/Auth  | Supabase                     |
| Local state    | Jotai                        |
| Server state   | TanStack Query               |
| Navigation     | Expo Router (mobile)         |
| Forms          | useFormValidation hook + zod |

## Canonical Packages

| Package                        | Path                      | Status      |
| ------------------------------ | ------------------------- | ----------- |
| @financial-app/tokens          | packages/tokens/          | to create   |
| @financial-app/tailwind-config | packages/tailwind-config/ | to create   |
| @financial-app/ui              | packages/ui/              | to refactor |
| @financial-app/shared          | packages/shared/          | to create   |
| mobile (app)                   | apps/mobile/              | to rename   |
| web (app)                      | apps/web/                 | to create   |

## Supabase

- URL: https://lccpruqcqalxtbddggow.supabase.co
- Credentials in .env (gitignored) — copy from .env.example

## Navigation

- `.claude/rules/` — domain rules (ui, tokens, styling, monorepo)
- `.claude/skills/` — agent skills for recurring tasks
- `docs/plans/` — step-by-step phase plans with exact file changes
- `files/docs and context/PERSONAL_FINANCE_ANALYSIS_EN.md` — full product specification

## Reference Files (load on demand — NOT auto-loaded)

| File                 | When to load                                                           |
| -------------------- | ---------------------------------------------------------------------- |
| `new-component.md`   | UI component, design system and other pattern to apply strictly        |
| `design-system.md`   | All the rules to follow about UI package files, folders                |
| `styling.md`         | All the rules to follow about styling                                  |
| `tokens.md`          | All infrmation about token use and setup                               |
| `monorepo.md`        | Description of the expected project architecture                       |
| `troubleshooting.md` | Debug, architectural decisions                                         |
| `api.md`             | API server stack, structure, routes, auth, error contract              |
| `api-patterns.md`    | Supabase layer, Prisma types, schemas, sort, pagination, mutations     |
| `netlify.md`         | Netlify deployment, Lambda function, env vars, Sentry serverless       |
| `features.md`        | Screen/View split, feature package architecture                        |
| `tests.md`           | 5-level test policy (happy, variants, managed/unmanaged errors, edges) |
| `specifications.md`  | App specifications reminder and extra specifications                   |

**Before coding**: ask which reference files are needed — do NOT start coding without the relevant files loaded.

## Session State

### Completed

Read `@completed.md`

### Next

1. **Centralized auth** — session validation on app focus (AppState → getSession())
2. **Page error recovery** — TanStack Query focusManager for RN, refetchOnMount
3. Tests — API + hooks
4. Phase 8B: GoCardless bank connection (mode banque)
5. **Server-side pagination** — replace client-side `limit: 1000`
6. **Walkthrough** — onboarding animation (Lottie text layer injection, content drafted in Basic Memory)

**Pending tests**: none

### Known Issues

Read `@known-issues.md`
