# React & React Native Financial App

A fullstack cross-platform **Personal Forecast Finance** application with an **Express 5 API** backend (Supabase + OpenAPI + pino logging), a shared design system, and two frontends — React Native (Expo SDK 54) and React web (React Router v7 SSR) — managed with **pnpm workspaces** and **Turborepo**. Internationalized (EN/FR), Supabase auth (email + TOTP 2FA + Google OAuth), and OWASP-hardened.

### Technologies

React Native · Expo SDK 54 · Expo Router · React · React Router v7 · TypeScript · pnpm · Turborepo · twrnc · Tailwind CSS · Style Dictionary · CVA · Supabase · Jotai · TanStack Table · TanStack Query · HeyAPI · Zod · OpenAPI · Express 5 · Prisma · i18next · pino · Vitest · MSW · Storybook

---

## Table of Contents

- [About this project](#about-this-project)
- [Project Structure](#project-structure)
- [Packages](#packages)
- [Prerequisites](#prerequisites)
- [Environment Setup (macOS)](#environment-setup-macos)
- [Main Commands](#main-commands)
- [How the Monorepo Works](#how-the-monorepo-works)
- [React Native Version Alignment (0.81.5)](#react-native-version-alignment-0815)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

---

## About this project

This project started from the perspective of a React developer asking: **"How do I build a consistent design across web and mobile?"**

The answer is a shared design system (`@financial-app/ui`) where styles are shared between web and native component implementations via a file extension split (`.web.tsx` / `.native.tsx`). Styling uses Tailwind CSS on web and `twrnc` on native, with shared variant logic through CVA (class-variance-authority). This keeps both platforms visually aligned while respecting each renderer's idioms. A migration to NativeWind (Tailwind v4 + unified `className`) is planned once it reaches stable release.

Three mobile apps coexist for comparison: `mobile` (bare React Native CLI), `mobile-expo` (Expo managed — the canonical app), and `mobile-expo-ejected` (ejected Expo). A `web` app uses React Router v7 in framework mode (SSR). An Express 5 API server provides the backend with Supabase as the database and auth provider, OpenAPI documentation, structured logging (pino), and two-tier rate limiting.

Business logic shared across all apps (auth, state, types, utils, i18n) lives in the `shared` package. Screen-specific compositions of design system primitives — configured DataTables, modal content, overview sections — live in the `features` package, keeping both the design system and the apps focused on their own concerns.

The app supports full internationalization (English/French) via i18next, Supabase authentication (email/password, TOTP 2FA, Google OAuth), and has been hardened against the OWASP Top 10 via automated multi-agent security audits.

### Real life example

Let's say that you have an architecture combining a web app and a mobile aap shared their design system and business logic; it would allow a front dev React/React Native to address stories both in web and mobile in the mean time.

New React developers with a moderate level in React Native could catch up and be proficient on basic tasks with no time. It's possible because except the typical React Native components necessary for mobile, the dev logic and patterns are the same as for React.

Moreover, junior profiles could be onboarded thanks to the adapted skills for claude or any AI agent because they follow the standards describe in this site [here](https://agentskills.io/home). A dev can use them for any important step in their dev on an every bay basis: `new component`, `new package`, etc...

### Knowledge base

Another option for developer onboarding would be to combine classic docs with a generated RAG as a knowledge source, allowing an AI agent to answer any question about the project (see [vite-mf-monorepo-rag](https://github.com/fubaritico/vite-mf-monorepo-rag) for an example).

As a lighter alternative to a full RAG pipeline, this project uses [Basic Memory](https://github.com/basicmachines-co/basic-memory) — a structured knowledge base living in the repository (`memory/` directory) as plain Markdown files, versioned in git and editable by anyone.

In practice, this means a new developer joining the team doesn't need to chase down a senior colleague to understand past decisions. They can ask their AI agent "why did we pick twrnc over NativeWind?" and get the reasoning, the trade-offs that were weighed, and when to revisit the decision. A junior developer stuck on a failing test can ask "how do we handle react-native singleton issues in Jest?" and get the exact fix that the team already discovered weeks ago — instead of losing half a day on the same problem. When a developer picks up a ticket involving the token pipeline or the API layer, they can ask "what are the conventions for adding a new entity?" and get a step-by-step answer that reflects how the team actually works, not a generic tutorial.

The key benefit is knowledge retention: every hard-won lesson, every architectural choice, every debugging session that would normally vanish when a conversation ends is captured and available to the whole team. It turns individual experience into collective memory.

Note that both approaches — RAG and structured memory — can also be used during everyday coding, not just onboarding.

### The everyday experience for a developer

The typical flow or a feature would be:
- `start-session` the agent recalls any old session start where it was at.
- The agent loads any necessary skills or on demand.
- Coding is shared by the developer and the IA agent. Understanding and knowledge base would be lost otherwise. 
- The agent automatically adds tests, the developer should challenge the IA agent on relevancy and edge cases.
- The agent runs quality scripts (type-check, lint, tests).
- The agent reviews the code based on rules that the team can refine in time.
- The agent can commit and push.
- `end-session` the close the session keeping a short mention of each thing that has been done.

Because security is a fundamental issue, an IA agent can perform security audits and address any issue; this audit is based on the [OWASP project](https://owasp.org/www-project-top-ten/).

Despite its limitations, this project can be a good fit for middle-size enterprise projects.

### Getting the expected experience while coding

To get the full AI-assisted development experience described above, a new developer needs to configure [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with the right permissions. The project ships a `.claude/settings.local.json` file that pre-authorizes all tools, skills, and MCP servers so the agent can operate without constant permission prompts.

**Prerequisites:**
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed
- [uvx](https://docs.astral.sh/uv/) available (for the Basic Memory MCP server)
- Node.js 20+ and pnpm installed

**Steps:**

1. **Configure permissions** — both `.claude/settings.local.json` and `.mcp.json` are gitignored (per-developer config). Copy them from the committed examples:
   ```bash
   cp .claude/settings.local.json.example .claude/settings.local.json
   cp .mcp.json.example .mcp.json
   ```
   - `settings.local.json` grants permissions for all core tools, project skills, and MCP server tools so the agent can operate without constant prompts
   - `.mcp.json` declares the two MCP servers (context7 for live library docs, basic-memory for the project knowledge base)

2. **Start a session** — open Claude Code in the project root and type `/start-session`. The agent loads context from `CLAUDE.md`, relevant rule files, and the Basic Memory knowledge base, then picks up where the last session left off.

This setup means a developer joining the project can immediately ask the agent things like "why do we use twrnc instead of NativeWind?", "how do I add a new API entity?", or "what was the fix for the Jest singleton crash?" — and get precise, project-specific answers drawn from the team's accumulated experience, not generic documentation.

[Back to top](#table-of-contents)

---

## Project Structure

```
react-and-react-native-financial-app/
├── package.json            # Monorepo root config
├── pnpm-workspace.yaml     # pnpm workspaces + catalog
├── turbo.json              # Turborepo task pipeline
├── apps/
│   ├── mobile-expo/        # Expo SDK 54 (canonical mobile app)
│   ├── web/                # React Router v7 + Vite (SSR)
│   ├── api/                # Express 5 REST API (Supabase + OpenAPI)
│   ├── storybook/          # Storybook — component browser (web + native)
│   ├── mobile/             # Bare React Native CLI (learning reference)
│   └── mobile-expo-ejected/ # Ejected Expo (learning reference)
├── packages/
│   ├── tokens/             # @financial-app/tokens — Style Dictionary (DTCG)
│   ├── tailwind-config/    # @financial-app/tailwind-config — shared Tailwind config
│   ├── icons/              # @financial-app/icons — cross-platform SVG icon library
│   ├── ui/                 # @financial-app/ui — cross-platform design system
│   ├── features/           # @financial-app/features — screen-specific composed blocks
│   ├── shared/             # @financial-app/shared — auth, types, utils, atoms, i18n
│   ├── http-client/        # @financial-app/http-client — HeyAPI SDK + TanStack Query
│   └── prisma/             # @financial-app/prisma — Prisma types (type generation only)
└── scripts/                # Utility scripts (reset, rebuild, changelogs)
```

[Back to top](#table-of-contents)

---

## Packages

### Apps

| App                    | Path                        | Status  | Description                                                   |
|------------------------|-----------------------------|---------|---------------------------------------------------------------|
| `mobile-expo`          | `apps/mobile-expo/`         | Active  | Expo managed (SDK 54) — canonical mobile app, primary focus   |
| `web`                  | `apps/web/`                 | Active  | React Router v7 + Vite with SSR                               |
| `mobile`               | `apps/mobile/`              | Active  | Bare React Native CLI — learning reference                    |
| `mobile-expo-ejected`  | `apps/mobile-expo-ejected/` | Active  | Expo bare/ejected — learning reference                        |
| `storybook`            | `apps/storybook/`           | Active  | Component browser (web + native stories via react-native-web) |
| `api`                  | `apps/api/`                 | Active  | Express 5 REST API ([README](apps/api/README.md))             |

### Shared Packages

| Package | Path | Status | Description |
|---|---|---|---|
| `@financial-app/tokens` | `packages/tokens/` | Active | Style Dictionary (DTCG) — colors, spacing, typography, radii |
| `@financial-app/tailwind-config` | `packages/tailwind-config/` | Active | Shared Tailwind config consuming token outputs |
| `@financial-app/icons` | `packages/icons/` | Active | Cross-platform SVG icon library — type-safe `<Icon name="..." />` component |
| `@financial-app/ui` | `packages/ui/` | Active | Cross-platform design system (file extension split: `.native.tsx` / `.web.tsx`) |
| `@financial-app/features` | `packages/features/` | Active | Screen-specific composed blocks (overview, transactions, budgets, pots) |
| `@financial-app/shared` | `packages/shared/` | Active | Auth (Supabase), Jotai atoms, domain types, utils, i18n |
| `@financial-app/http-client` | `packages/http-client/` | Active | HeyAPI SDK + TanStack Query options/mutations from OpenAPI spec |
| `@financial-app/prisma` | `packages/prisma/` | Active | Prisma-generated TypeScript types (type generation only, no ORM runtime) |

### Dependency Graph

```
@financial-app/tokens           -> depends on nothing
@financial-app/icons            -> depends on nothing (react-native-svg is a peer dep)
@financial-app/prisma           -> depends on nothing (Prisma types only)
@financial-app/tailwind-config  -> @financial-app/tokens
@financial-app/ui               -> @financial-app/tokens, @financial-app/tailwind-config, @financial-app/icons
@financial-app/shared           -> depends on nothing (pure TS, no renderer)
@financial-app/features         -> @financial-app/ui, @financial-app/shared, @financial-app/tailwind-config
@financial-app/http-client      -> @financial-app/prisma (types)
apps/api                        -> @financial-app/prisma (types)
apps/* (mobile, web)            -> @financial-app/features, @financial-app/ui, @financial-app/shared, @financial-app/http-client, @financial-app/icons
```

[Back to top](#table-of-contents)

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm**: `npm install -g pnpm`
- **Ruby** (v3.1.x recommended): for CocoaPods (iOS)
- **Xcode** (macOS): for iOS
- **Android Studio**: for Android

[Back to top](#table-of-contents)

---

## Environment Setup (macOS)

This section details the steps to configure the React Native development environment on macOS.

### 1. Install pnpm

```bash
npm install -g pnpm
```

### 2. Install Ruby 3.1 via rbenv

The system Ruby version (2.6) is too old for CocoaPods. Ruby 3.4+ can also cause compatibility issues. **Ruby 3.1.x is recommended.**

```bash
# Install rbenv
brew install rbenv

# Install Ruby 3.1.4
rbenv install 3.1.4

# Set as global version
rbenv global 3.1.4

# Add rbenv to shell (once only)
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc && source ~/.zshrc

# Verify version
ruby -v  # Should display ruby 3.1.4
```

### 3. Configure Xcode (iOS)

```bash
# Select Xcode as the active build tool
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Open Xcode at least once to accept the license and install additional components (iOS simulators).

### 4. Configure Android Studio (Android)

1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio -> **More Actions** -> **Virtual Device Manager**
3. Create an emulator (e.g. Pixel 7, API 34)

Configure environment variables:

```bash
# Java 17 (required by Gradle 9)
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc

# Android SDK
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

Verify:

```bash
java -version   # Should display openjdk 17.x.x
adb --version   # Should display Android Debug Bridge
```

### 5. Install project dependencies

```bash
# From the monorepo root
pnpm install
```

### 6. Install iOS Pods

```bash
# In apps/mobile
cd apps/mobile
bundle install
bundle exec pod install --project-directory=ios
```

### 7. Run the app

```bash
# Start Metro (in a dedicated terminal)
pnpm --filter mobile-financial-app start

# In another terminal:
pnpm --filter mobile-financial-app ios      # iOS (simulator)
pnpm --filter mobile-financial-app android  # Android (emulator must be running)
```

[Back to top](#table-of-contents)

---

## Main Commands

All orchestrated commands use **Turborepo** for caching and correct dependency ordering.

### Install & build

```bash
pnpm install       # Install all dependencies
pnpm build         # Build all packages (tokens → tailwind-config → icons → ui → features → apps)
pnpm tokens        # Rebuild token outputs only
pnpm icons         # Regenerate icon data from SVGs
```

### Quality checks

```bash
pnpm type-check    # TypeScript --noEmit across all packages
pnpm lint          # ESLint across all packages
pnpm test          # Tests across all packages (Vitest for API, Jest for apps)
```

### Daily development

For day-to-day JS/TS work (editing components, screens, styles, logic), Metro **hot-reloads**
changes instantly — no rebuild needed. Just keep Metro running in one terminal.

```bash
# Web
pnpm web:dev                   # React Router dev server

# Expo (canonical mobile)
pnpm expo:start                # Metro bundler (press i/a for iOS/Android)
pnpm expo:ios                  # Build + launch on default iPhone simulator
pnpm expo:ios:iphone           # iPhone 16 Pro simulator
pnpm expo:ios:ipad             # iPad Pro 11-inch (M4) simulator
pnpm expo:android              # Build + launch on default Android emulator
pnpm expo:android:phone        # Small_Phone AVD
pnpm expo:android:tablet       # Medium_Tablet AVD
pnpm expo:ios:device           # Pick from connected iOS devices
pnpm expo:android:device       # Pick from connected Android devices

# Bare RN CLI
pnpm mobile:start              # Metro bundler
pnpm mobile:ios                # Build + launch on iOS simulator
pnpm mobile:android            # Build + launch on Android emulator

# Storybook
pnpm storybook                 # Component browser (web + native stories)

# API
pnpm api:dev                   # Express dev server (http://localhost:3001)
                               # Swagger UI at http://localhost:3001/docs
```

These commands assume a native binary is already installed on the simulator/emulator.
If it's your first run or you changed native dependencies, use a **rebuild** command instead.

### Rebuild (clean native build from scratch)

Use `rebuild` when the **native layer** changed — adding/removing a native library,
changing `build.gradle`, `Podfile`, `app.json` native config, or upgrading RN/Expo SDK.
Also use it when a build fails for no obvious reason (cache corruption).

For pure JS/TS changes, you do **not** need this — Metro hot-reloads automatically.

#### Android

`rebuild:android` (`scripts/rebuild-android.sh`) is a single command that handles everything:

1. Stops Gradle daemon (cached JVM that survives `rm -rf` on disk)
2. Kills stale Metro on port 8081 (if any)
3. Cleans Gradle build dirs (`.gradle/`, `build/`, `.cxx/`)
4. Cleans Metro/Haste/RN temp caches + Watchman
5. Runs `expo prebuild --clean` (Expo only, skipped for bare RN)
6. Starts Metro in background, waits for it to be ready
7. Builds and launches on emulator

```bash
# Bare RN CLI
pnpm mobile:rebuild:android           # default emulator
pnpm mobile:rebuild:android:phone     # Small_Phone AVD
pnpm mobile:rebuild:android:tablet    # Medium_Tablet AVD

# Expo managed
pnpm expo:rebuild:android             # default emulator
pnpm expo:rebuild:android:phone       # Small_Phone AVD
pnpm expo:rebuild:android:tablet      # Medium_Tablet AVD
```

First build after a clean takes ~5 min (Gradle re-downloads dependencies).
Subsequent runs reuse the global Gradle cache and finish faster.

After the script finishes, Metro keeps running in the background.
The output shows the PID and the command to stop it.

#### iOS

```bash
pnpm mobile:rebuild:ios        # Bare RN CLI — clean + pod install + build + launch
pnpm expo:rebuild:ios          # Expo managed — clean + prebuild + build + launch
```

### Reset (nuclear — full project clean)

Use `pnpm reset` when everything is broken and you want to simulate a fresh clone.
It removes all `node_modules`, caches, build outputs, reinstalls everything, and rebuilds tokens.
See [docs/modus-operandi/reset.md](docs/modus-operandi/reset.md) for the full checklist.

```bash
pnpm reset         # Full clean + reinstall + pod install + token rebuild
pnpm clean         # Remove all node_modules only
pnpm clean:build   # Remove all build/dist outputs only
```

After a reset, you still need to rebuild native binaries — use the `rebuild` commands above.

[Back to top](#table-of-contents)

---

## How the Monorepo Works

### pnpm workspaces + Turborepo

The monorepo uses **pnpm workspaces** for dependency management and **Turborepo** for task orchestration.

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "apps/*"
```

Turborepo ensures tasks run in the correct dependency order with caching:

```
pnpm build → tokens → tailwind-config → icons → ui → features → shared → apps (parallel where possible)
```

Cached tasks replay instantly — a full `pnpm type-check` with warm cache runs in ~30ms.

### Add a dependency to a package

```bash
# Add a dependency to a specific package
pnpm --filter mobile-expo-financial-app add <package-name>

# Add a dev dependency
pnpm --filter mobile-expo-financial-app add -D <package-name>
```

### Add a dependency to the root (shared tools)

```bash
pnpm add -w -D <package-name>
```

### Cross-platform component architecture

UI components use a **file extension split** pattern — shared types + CVA variants with platform-specific implementations:

```
packages/ui/src/components/Button/
  Button.tsx           # Types + props interface only (no JSX)
  Button.native.tsx    # React Native implementation (twrnc)
  Button.web.tsx       # DOM/HTML implementation (Tailwind CSS + cn())
  index.ts             # Native barrel (Metro picks this)
  index.web.ts         # Web barrel (Vite picks this)
```

Styling: **twrnc** on native, **Tailwind CSS** on web. Shared variant logic via **CVA** (class-variance-authority).

[Back to top](#table-of-contents)

---

## React Native Version Alignment (0.81.5)

### Why React Native 0.81.5?

This monorepo contains multiple apps:
- **`mobile`**: React Native CLI (without Expo)
- **`mobile-expo`**: Expo managed (SDK 54)
- **`mobile-expo-ejected`**: Expo bare/ejected
- **`ui`**: Shared components with `twrnc` (Tailwind for RN)

**Expo SDK 54 requires React Native 0.81.x**. To avoid multiple version conflicts in the monorepo (which cause "Invalid hook call" errors and crashes), all apps must use the **same React Native version**.

### The Problem Encountered

Initially, `mobile` used RN 0.82.1 (latest version) while Expo SDK 54 used RN 0.81.5. This caused:
- **3 versions of react-native** in `node_modules/.pnpm`
- "Invalid hook call" errors due to multiple React instances
- Android crashes with `library "libreact_featureflagsjni.so" not found`

### The Solution

#### 1. Force a single version with pnpm overrides

In the root `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "react-native": "0.81.5",
      "@react-native/babel-plugin-codegen": "0.81.5",
      "@react-native/babel-preset": "0.81.5",
      "@react-native/codegen": "0.81.5",
      "@react-native/js-polyfills": "0.81.5",
      "@react-native/metro-babel-transformer": "0.81.5",
      "@react-native/metro-config": "0.81.5"
    }
  }
}
```

#### 2. Align versions in each package.json

In `apps/mobile/package.json`, `apps/mobile-expo/package.json`, etc.:

```json
{
  "dependencies": {
    "react-native": "0.81.5"
  },
  "devDependencies": {
    "@react-native-community/cli": "20.0.0",
    "@react-native/babel-preset": "0.81.5",
    "@react-native/metro-config": "0.81.5",
    "@react-native/typescript-config": "0.81.5"
  }
}
```

#### 3. Regenerate the Android folder (if created with a different version)

If the `android/` folder was created with RN 0.82, it contains incompatible files. Solution:

```bash
cd apps/mobile
mv android android_backup
npx @react-native-community/cli init mobile --version 0.81.5 --skip-install --directory temp_mobile
mv temp_mobile/android .
rm -rf temp_mobile
```

### Checking installed versions

```bash
# See how many react-native versions are installed
ls node_modules/.pnpm | grep "^react-native@0"

# Check version in a package
cat apps/mobile/node_modules/react-native/package.json | grep version
```

### Android Debugging

To view Android crash logs:

```bash
# Clear old logs
adb logcat -c

# Record logs to file
adb logcat > /tmp/crash.log

# (Launch the crashing app, then Ctrl+C)

# View errors
grep -A 10 "FATAL EXCEPTION" /tmp/crash.log
```

[Back to top](#table-of-contents)

---

## Troubleshooting

For advanced troubleshooting (Jest singleton issues, Expo mode switching, simulator management,
disk space cleanup, and more), see [.claude/rules/troubleshooting.md](.claude/rules/troubleshooting.md).

### General (iOS & Android)

#### "Unable to resolve module" error in simulator/emulator

In a pnpm monorepo, dependencies are hoisted to the root. Metro must be configured to find them.

The `apps/mobile/metro.config.js` file must include:

```js
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const monorepoRoot = path.resolve(__dirname, '../..');

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

After modification, restart Metro (`Ctrl + C` then `pnpm --filter mobile-financial-app start`).

#### "Unable to load script" or white screen / splash screen stuck

Metro is not running or the emulator can't reach it.

If you used a `rebuild` command, Metro is started automatically — check the output for
`Metro is ready (PID ...)`. If you used a regular `run` command, start Metro manually:

```bash
# Terminal 1: start Metro
pnpm mobile:start   # or pnpm expo:start

# Terminal 2: build + launch
pnpm mobile:android  # or pnpm expo:android
```

If Metro is running but the emulator still can't connect, forward the port:

```bash
adb reverse tcp:8081 tcp:8081
```

Then reload in the emulator: press `R` twice.

---

### iOS

#### `xcodebuild` requires Xcode

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

#### `pod: command not found` or CocoaPods errors

Use Bundler (installed locally in the project):

```bash
cd apps/mobile
bundle install
bundle exec pod install --project-directory=ios
```

#### Ruby / `kconv` / `securerandom` errors

Install Ruby 3.1.x via rbenv (see section 2 above).

#### "No script URL provided" error when launching the app

Metro is not started. Run in a separate terminal:

```bash
pnpm mobile:start
```

Then reload the app in the simulator (`Cmd + R`).

---

### Android

#### "Gradle requires JVM 17 or later" error

Gradle 9 requires Java 17 minimum. Install and configure Java 17:

```bash
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
source ~/.zshrc
```

Verify: `java -version` should display `openjdk 17.x.x`.

#### "adb: command not found" error

The Android SDK is not in the PATH:

```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

#### "Could not find org.asyncstorage.shared_storage:storage-android:1.0.0"

AsyncStorage v3 ships its Android artifact via a local Maven repo, not Maven Central.
The project's `android/build.gradle` must include:

```gradle
allprojects {
    repositories {
        maven {
            url = uri(project(":react-native-async-storage_async-storage").file("local_repo"))
        }
    }
}
```

This is already configured in `apps/mobile/android/build.gradle`. If you see this error after
a fresh clone or reset, verify the block is present.

#### "Included build node_modules/@react-native/gradle-plugin does not exist" error

In a pnpm monorepo, some React Native dependencies are not installed by default. Add the missing dependencies:

```bash
pnpm --filter mobile-financial-app add -D @react-native/gradle-plugin@0.82.1 @react-native/codegen@0.82.1
```

#### Any other Android build failure

When in doubt, use the rebuild command — it handles all cache layers:

```bash
pnpm mobile:rebuild:android        # bare RN CLI
pnpm expo:rebuild:android          # Expo managed
```

[Back to top](#table-of-contents)

---

## Documentation

### Guides (Modus Operandi)

Step-by-step operational guides for common workflows.

| Guide | Description |
|-------|-------------|
| [Supabase Setup](docs/modus-operandi/supabase-setup.md) | Create project, run schema + seed, configure env vars |
| [Expo Modes](docs/modus-operandi/expo-modes.md) | QR code vs dev-client, simulators, physical devices |
| [iPhone Wireless Deploy](docs/modus-operandi/iphone-wireless-deploy.md) | Physical device deployment via Wi-Fi (bare RN CLI) |
| [Full Reset](docs/modus-operandi/reset.md) | Nuclear clean + reinstall procedure |

### Implementation Plans

Phased plans for the full project build. See [docs/plans/README.md](docs/plans/README.md) for the index.

| Phase | Plan | Status | Goal |
|-------|------|--------|------|
| 0 | [Cleanup](docs/plans/phase-0-cleanup.md) | Done | Canonical app decision, restructure to apps/ |
| 1 | [Tokens](docs/plans/phase-1-tokens.md) | Done | Style Dictionary token pipeline |
| 2 | [Tailwind Config](docs/plans/phase-2-tailwind-config.md) | Done | Shared Tailwind config package |
| 3 | [Design System](docs/plans/phase-3-design-system.md) | Done | Cross-platform file extension split + CVA |
| 4 | [Web App](docs/plans/phase-4-web-app.md) | Done | React Router + Vite web app scaffold |
| 5 | [Shared](docs/plans/phase-5-shared.md) | Done | Supabase, Jotai, TanStack Query shared package |
| 6 | [Turborepo](docs/plans/phase-6-turborepo.md) | Done | Task pipeline, caching, dependency ordering |
| 7 | [Home Page](docs/plans/phase-7-home-page.md) | Done | Routing + mock data + Home page + all screens |
| 8A | [API + HTTP Client](docs/plans/phase-8A-api-and-http-client.md) | Done | Express 5 API (OpenAPI + Swagger) + HeyAPI HTTP client |
| 8B | [GoCardless](docs/plans/phase-8B-gocardless-bank-connection.md) | Planned | Bank connection via GoCardless Bank Account Data API |
| — | [Onboarding](docs/plans/onboarding-plan.md) | In progress | Auth flow, splash, walkthrough, initial balance |

### Additional Plans

| Plan | Status | Description |
|------|--------|-------------|
| [Features Package](docs/plans/features-package.md) | Done | Overview organisms moved to features, ui keeps atomic DS |
| [UI Components Track B](docs/plans/ui-components-track-b.md) | Done | Auth + overview component pipeline |
| [Shared Mutation Hooks](docs/plans/shared-mutation-hooks.md) | Planned | Extract 11 hooks into @financial-app/features, eliminate duplication |

### App READMEs

| App | README |
|-----|--------|
| API Server | [apps/api/README.md](apps/api/README.md) |

[Back to top](#table-of-contents)
