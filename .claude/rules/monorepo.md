# Rules — Monorepo Structure

## Workspace Layout

```
/                           # root — pnpm workspace, turbo.json
  apps/
    mobile/                 # Expo SDK 54 app (canonical mobile)
    web/                    # React Router + Vite app
  packages/
    tokens/                 # @monorepo/tokens
    tailwind-config/        # @monorepo/tailwind-config
    design-system/          # @monorepo/design-system
    shared/                 # @monorepo/shared
```

## Package Naming

All packages use `@monorepo/` scope in package.json name field.
Apps are private, unscoped: `"name": "mobile"`, `"name": "web"`.

## Dependency Rules

```
@monorepo/tokens           → depends on nothing
@monorepo/tailwind-config  → depends on @monorepo/tokens
@monorepo/design-system    → depends on @monorepo/tokens, @monorepo/tailwind-config
@monorepo/shared           → depends on nothing (pure TS, no renderer)
apps/*                     → depends on @monorepo/design-system, @monorepo/shared
```

Never create circular dependencies. Shared packages NEVER import from apps.

## pnpm Workspace Commands

```bash
# Install all packages
pnpm install

# Run command in specific package
pnpm --filter @monorepo/design-system build
pnpm --filter mobile start

# Run command in all packages
pnpm -r build

# Add dependency to specific package
pnpm --filter @monorepo/design-system add class-variance-authority

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

Build order guaranteed: tokens → tailwind-config → design-system → apps

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

`packages/mobile` (bare RN CLI) and `packages/mobile-expo-ejected` (ejected Expo) are kept
as learning references to compare approaches with the canonical `packages/mobile-expo` (Expo managed).
Primary development happens on mobile-expo, but the other two may be aligned from time to time.
Never delete them. All three must be covered by ESLint and project tooling.

## Adding a New Package

1. Create `packages/[name]/` directory
2. Add `package.json` with `@monorepo/[name]` name
3. Add to no extra workspace config — pnpm-workspace.yaml uses `packages/*` glob
4. Add as dependency where needed: `pnpm --filter [consumer] add @monorepo/[name]@workspace:^`
