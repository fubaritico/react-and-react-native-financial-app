# Rules — Monorepo Structure

## Workspace Layout

```
/                           # root — pnpm workspace, turbo.json
  apps/
    mobile/                 # Expo SDK 54 app (canonical mobile)
    web/                    # React Router + Vite app
  packages/
    tokens/                 # @financial-app/tokens
    tailwind-config/        # @financial-app/tailwind-config
    ui/          # @financial-app/ui
    shared/                 # @financial-app/shared
```

## Package Naming

All packages use `@financial-app/` scope in package.json name field.
Apps are private, with `-financial-app` suffix: `"name": "mobile-financial-app"`, `"name": "web-financial-app"`.

## Dependency Rules

```
@financial-app/tokens           → depends on nothing
@financial-app/tailwind-config  → depends on @financial-app/tokens
@financial-app/ui    → depends on @financial-app/tokens, @financial-app/tailwind-config
@financial-app/shared           → depends on nothing (pure TS, no renderer)
apps/*                     → depends on @financial-app/ui, @financial-app/shared
```

Never create circular dependencies. Shared packages NEVER import from apps.

## pnpm Workspace Commands

```bash
# Install all packages
pnpm install

# Run command in specific package
pnpm --filter @financial-app/ui build
pnpm --filter mobile-financial-app start

# Run command in all packages
pnpm -r build

# Add dependency to specific package
pnpm --filter @financial-app/ui add class-variance-authority

# Add dev dependency to root
pnpm add -D turbo -w
```

## Turbo Pipeline (turbo.json — to be added Phase 6)

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["build/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Build order guaranteed: tokens → tailwind-config → ui → apps

## Metro Config Rules (apps/mobile)

Must include file extension resolution and monorepo watch folders:

```js
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [...];
config.resolver.sourceExts = [
  'native.tsx', 'native.ts', 'native.js',
  ...config.resolver.sourceExts
];
```

## Package.json Exports Pattern

```json
{
  "exports": {
    ".": { "import": "./src/index.ts" },
    "./build/*": "./build/*"
  },
  "react-native": "./src/index.ts"
}
```

The `react-native` field ensures Metro uses the correct entry point.

## Learning Reference Packages

`apps/mobile` (bare RN CLI) and `apps/mobile-expo-ejected` (ejected Expo) are kept
as learning references to compare approaches with the canonical `apps/mobile-expo` (Expo managed).
Primary development happens on mobile-expo, but the other two may be aligned from time to time.
Never delete them. All three must be covered by ESLint and project tooling.

## Adding a New Package

1. Create `packages/[name]/` directory
2. Add `package.json` with `@financial-app/[name]` name
3. Add to no extra workspace config — pnpm-workspace.yaml uses `packages/*` and `apps/*` globs
4. Add as dependency where needed: `pnpm --filter [consumer] add @financial-app/[name]@workspace:^`
