---
name: add-package
description: Scaffold a new workspace package or app from scratch in the monorepo. Use when creating a new package, adding a library, or bootstrapping a new app.
allowed-tools: Read Write Bash(mkdir:*) Bash(pnpm:*)
argument-hint: "[package-name] [type: lib|app]"
metadata:
  author: financial-app
  version: "1.0"
---

# Add Package

Scaffold a new workspace package from scratch.

## Arguments

`$ARGUMENTS` = `[package-name] [type: lib|app]`

## Steps

### 1. Create directory

```bash
mkdir packages/$name        # for lib
mkdir apps/$name            # for app
```

### 2. Create package.json

For a library package:

```json
{
  "name": "@financial-app/$name",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": { "import": "./src/index.ts" }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "catalog:"
  }
}
```

### 3. Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "dist"]
}
```

### 4. Create src/index.ts

```ts
// @financial-app/$name public API
```

### 5. Install dependencies

```bash
pnpm install
```

### 6. Add as dependency to consumer

```bash
pnpm --filter [consumer-package] add @financial-app/$name@workspace:^
```

## Dependency Constraint Reminder

Check `.claude/rules/monorepo.md` for allowed dependency directions.
Packages must NEVER import from apps. Shared packages NEVER import from ui.

## Gotchas

- Always use `catalog:` for shared devDependencies (see pnpm-workspace.yaml)
- No extra workspace config needed — pnpm-workspace.yaml picks up `packages/*` and `apps/*` automatically
- Always use pnpm, never npm or yarn
