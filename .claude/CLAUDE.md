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
- Full project structure scan and mapping to memory
- Verified all phase plans exist (phase-0 through phase-6), all unstarted
- Read all ui package components, mobile-expo config, root config
- Updated mobile-expo README with prerequisites (iOS sim, Android emulator), Expo Go steps, troubleshooting
- Clarified all 3 mobile apps are learning references (not archived)
- Set up Husky v9 with pre-commit (type-check + lint + test) and commit-msg (commitlint)
- Set up commitlint with conventional commits config (ESM format)
- Set up ESLint 9 flat config: root base + per-package extending configs with react-native plugin
- Set up Prettier (no semi, single quotes, trailing commas)
- Introduced pnpm catalog pattern in pnpm-workspace.yaml
- Added `"type": "module"` and `packageManager` field to root package.json
- Fixed Jest config in packages/mobile (transformIgnorePatterns for pnpm)
- Auto-fixed all existing code (semicolons, import order, formatting)
- Added root scripts: lint, lint:fix, type-check, test
- Created `scripts/reset-project.sh` (full clean + reinstall + pod install + DerivedData cleanup)
- Added root scripts: `reset`, `postinstall`
- Added `ios:sim` and `android:emu` scripts to packages/mobile
- Created `docs/modus-operandi/reset.md` (post-reset verification checklist + known issues)
- Populated `.claude/rules/troubleshooting.md` with quick reference table
- Configured Xcode signing for physical device (Personal Team, free Apple ID)
- Updated Podfile.lock (CocoaPods 1.15.2 -> 1.16.2)
- Clarified all apps are production-grade (not just learning references)
- Fixed bare RN CLI (packages/mobile) physical iPhone deployment:
  - Enabled wireless debugging (Connect via Network) to avoid USB disconnect
  - Set ENABLE_USER_SCRIPT_SANDBOXING=NO to fix ip.txt sandbox violation
  - Created `docs/modus-operandi/iphone-wireless-deploy.md` — full wireless deploy guide
- Added Fb app icon (1024×1024 PNG) to all three mobile apps
  - Source icon in `packages/ui/src/assets/app-icon.png`
  - Bare RN CLI switched to modern single-image AppIcon format
- Added `expo-dev-client@~6.0.20` to pnpm catalog, mobile-expo and mobile-expo-ejected
- Added native build scripts (`ios:build`, `ios:build:device`, `android:build`, `android:build:device`)
- Added `bundleIdentifier` to mobile-expo app.json (`com.anonymous.mobileexpo`)
- Documented dev vs build scripts in mobile-expo and mobile-expo-ejected READMEs
- Added Hot Reload (Fast Refresh) section to mobile-expo README
- Updated reset script to clean mobile-expo generated `ios/`/`android/` dirs
- Added "always use pnpm" rule to CLAUDE.md
- Added disk space / build artifacts section to troubleshooting rules
- Added `conventional-changelog@7.2.0` to pnpm catalog and all 4 packages as devDependency
- Added `changelog` script to ui package, mobile-expo, mobile, mobile-expo-ejected
- Added `type-check` script (`tsc --noEmit`) to all 4 packages
- Removed `publish.sh` and `release:*` scripts from ui package (not published, monorepo-only)
- Created `scripts/update-changelogs.sh` — auto-generates changelog only for packages with staged changes
- Added changelog generation as last step in pre-commit hook (after type-check + lint + test)
- Moved all 3 mobile apps from packages/ to apps/ directory (mobile, mobile-expo, mobile-expo-ejected)
  - Updated pnpm-workspace.yaml to include apps/*
  - Updated all path references in scripts, docs, rules, commands, and config
  - Regenerated pnpm-lock.yaml — verified type-check + lint + test pass
  - Tested mobile app on iOS simulator — works correctly
- Renamed project and all packages:
  - Root: rn-monorepo → react-and-react-native-financial-app
  - Scope: @monorepo/* → @financial-app/*
  - Apps: mobile → mobile-financial-app, mobile-expo → mobile-expo-financial-app, mobile-expo-ejected → mobile-expo-ejected-financial-app
  - packages/design-system → packages/ui (@financial-app/ui)
  - Removed publish.sh and release:* scripts (monorepo-only, no npm publish needed)
  - Updated all imports, configs, metro.config, tailwind.config content paths, docs, plans, scripts, filter refs
- Created GitHub repo under fubaritico org, switched remote origin from stefcot to fubaritico (SSH)
- Translated all French docs/READMEs to English:
  - Root README.md, packages/ui/README.md, apps/mobile-expo/README.md, apps/mobile-expo-ejected/README.md
  - files/docs and context/PERSONAL_FINANCE_ANALYSIS.md (local only, gitignored)
- Revamped root README: added TOC, back-to-top links, tech stack intro, Packages section with status/dependency graph
- Added apps/api (Express REST API) and @financial-app/http-client (HeyAPI) to README and project structure
- Removed "Next Steps" section from README (internal, not for repo consumers)
- Committed CocoaPods pbxproj cleanup (empty arrays removed by newer CocoaPods)
- Created docs/plans/phase-7-api-and-http-client.md — OpenAPI-driven Express API + HeyAPI client generation
- Updated plans index: Phase 7 added, Phase 6 (Turborepo) now depends on Phase 7
- Migrated 7 commands to agent skills format (.claude/skills/) with YAML frontmatter
- Created 6 new custom skills: create-skill (meta), token-pipeline, cross-platform-component, expo-build, monorepo-check, api-openapi
- Vendored 5 Expo skills (building-native-ui, deployment, dev-client, native-data-fetching, upgrading-expo) with 26 reference files
- Vendored 2 Callstack skills (rn-best-practices, upgrading-rn) with 36 reference files
- Created persistent memory file (MEMORY.md) with skills inventory
- Created `restart-session` skill for end → clear → start flow
- Removed `.claude/commands/` (7 files) — fully replaced by `.claude/skills/`
- Updated CLAUDE.md references from commands to skills
- Created `setup-tokens-package` skill with references (sd-config-template, token-sources)
  Based on vite-mf-monorepo reference, adapted for cross-platform (5 outputs: css, tailwind JS map, js, ts, native)
- Created `migrate-to-nativewind-v5` skill (draft) — future migration from twrnc + TW v3 to NativeWind v5 + TW v4
- Styling decision: stay on twrnc + Tailwind v3 (stable); NativeWind v5 + TW v4 is pre-release, revisit later
- Confirmed Expo SDK 54 ships RN 0.81 + Reanimated v4 (NativeWind v5 prerequisites met)
- Created `setup-ui-package` skill (dual-mode: scaffold/migrate) with `references/architecture.md`
  Based on vite-mf-monorepo/packages/ui, enriched with phase-3 guardrails (cn.ts, variants, Metro config, safe/forbidden classes, mobile verification)
- Evaluated Supabase vs Firebase vs Neon vs PlanetScale — decision: keep Supabase, plan Pro tier for production
- Created docs/research/supabase-evaluation.md with full comparison and limitations
- Installed supabase and supabase-postgres-best-practices agent skills (official, from supabase/agent-skills)
- Created `review` skill — multi-agent code reviewer with 5 parallel subagents (platform-safety, security, architecture, quality, accessibility)
  - 61 rules total across 5 domains, WCAG 2.1 AA mapping table, contrast validation via `contrast-pairs.json`
  - JSON schema with scoring, verdicts, `needs_verification` field for context7 escalation
  - 8-step flow: scope detect → dispatch → aggregate → report → verify (context7) → fix loop (max 3) → store/ignore
  - Added `review-results/` to .gitignore, JSDoc checklist item to design-system.md
- Pre-phase cleanup: removed all NativeWind remnants (7 files)
  - Deleted 4 tailwind.config.js (all referenced uninstalled nativewind/preset)
  - Deleted 2 nativewind-env.d.ts, 1 global.css
  - Tested on iOS and Android — no side effects

- Phase 0: Created `packages/tokens/` — @financial-app/tokens
  - Extracted full color palette from Figma Design System page (5 desktop screenshots + 6 zoomed color screenshots)
  - Base colors: beige (2), grey (4), white, 6 secondary (green, yellow, cyan, navy, red, purple), 9 other (turquoise, brown, magenta, blue, navy-grey, army-green, gold, orange, other-purple)
  - Semantic layer: background, foreground, primary, secondary, destructive, success, warning, border, input, nav, transaction, recurring
  - Alias layer: flat Tailwind names + all 15 theme colors + grey/beige shortcuts
  - Typography: Public Sans, 7 text presets from Figma (1-5 + 4Bold + 5Bold)
  - Spacing: full Tailwind scale (half-steps use `_` to avoid SD dot-as-path-separator)
  - Radius: none/sm/md/lg/xl/2xl/full
  - Style Dictionary v5.4.0, DTCG format ($value/$type), 5 output platforms (css, tailwind JS map, js, ts, native)
  - Native output has unitless numbers for RN (rem→px conversion via custom size/native transform)
  - All 5 outputs build successfully, type-check + lint + test pass
  - README adapted from vite-mf-monorepo reference
  - Committed: 76b2857

- Phase 0 COMPLETE: committed and pushed @financial-app/tokens package (76b2857)
  - 12 files, all checks passed (type-check, lint, test, pre-commit hooks)

- Aligned token alias names with Figma variable collection (d9345ae)
  - Dropped `theme-` prefix from 15 secondary/other color aliases
  - Renamed `other-purple` → `pink`, `beige`/`beige-light` → `beige-500`/`beige-100`
  - Updated phase-2 plan: removed NativeWind refs, full token mapping

- Phase 2 COMPLETE: created `packages/tailwind-config/` — @financial-app/tailwind-config (257f51d)
  - Shared config consuming tokens via `./tailwind` subpath export
  - Maps all categories: colors, spacing, radius, font family/size/weight/lineHeight
  - Uses `theme` (full replace) — no default Tailwind values leak in
  - Standalone type declaration (`index.d.ts`) — no twrnc/tailwindcss coupling
  - tw.ts simplified: direct config pass to twrnc `create()`, no `resolveConfig`
  - Added `transparent`/`currentColor` as CSS fundamentals in config

- Fixed runtime warnings in ui components (5d3939b)
  - Button: `black` → `foreground`
  - Card: `gray-900` → `foreground`, `gray-600` → `foreground-muted`
  - Tested on Expo iOS simulator and bare RN — no warnings, correct rendering

- Added shared responsibility rule to CLAUDE.md
- Added QUAL-002b review rule: separate type and value imports
- Added ARCH-003b review rule: SOLID principles mapped to codebase patterns

- Phase 3 COMPLETE: cross-platform refactor of @financial-app/ui (75e52eb)
  - Installed CVA, clsx, tailwind-merge
  - Created src/lib/cn.ts (web className composition)
  - Created src/variants/ with button, card, header variant files + barrel index
  - Split Button, Card, Header into folder-based components (types, native, web, index)
  - Button: switched from TouchableOpacity to Pressable with press feedback (opacity-70)
  - Card: shadow-md kept out of shared variant, applied per-platform
  - Header: semantic <header> + <h1> on web
  - Updated all 3 Metro configs with .native.* extension priority
  - Updated src/index.ts — exports components, types, and variants via barrel
  - Fixed primary button invisible text (CVA defaultVariants doesn't set prop value)
  - Tested on iOS simulator + physical device — all components render correctly

- Phase 4 COMPLETE: created `apps/web/` — React Router v7 framework + SSR (4ffb08a)
  - React Router v7.14.1 with Vite 8, SSR enabled, Node adapter
  - Vite resolve.extensions prioritizes .web.tsx before .tsx
  - Home route with server-side loader mirroring mobile app layout
  - Tailwind CSS via shared @financial-app/tailwind-config + token CSS vars
  - Added `index.web.ts` barrel files to each ui component for web entry resolution
  - Added `exports` map to @financial-app/ui: `react-native` → index.ts, `default` → index.web.ts
  - Added react-dom to pnpm catalog, esbuild to pnpm.onlyBuiltDependencies
  - Excluded `.react-router/` generated types from ESLint
  - PostCSS/Tailwind configs use `.cjs` extension (ESM package with CJS configs)
  - Tested on mobile (bare RN + Expo) — no regressions from index.web.ts changes
  - Tested on web — SSR renders HTML, components are semantic, Tailwind colors match

### Next
- Start Phase 5 (shared package) — read docs/plans/phase-5-shared.md

### Known Issues
- `expo-dev-client` not yet tested on mobile-expo-ejected
- mobile-expo-ejected `ios/` is gitignored — icon update is local only

