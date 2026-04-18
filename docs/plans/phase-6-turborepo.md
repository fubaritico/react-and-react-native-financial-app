# Phase 6 — Turborepo Pipeline

## Goal

Add Turborepo to orchestrate builds across all packages with correct dependency
order and caching. After this phase, a single `pnpm dev` or `pnpm build` at the
root runs everything in the right sequence.

## Status: TODO (requires Phase 5 complete)

---

## Step 6.1 — Install Turborepo

```bash
# From repo root
pnpm add -D turbo -w
```

---

## Step 6.2 — Create turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["build/**", "dist/**", ".expo/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "watch": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

`"dependsOn": ["^build"]` means: before building this package,
build all packages it depends on first.

Guaranteed order:
```
@financial-app/tokens → @financial-app/tailwind-config → @financial-app/ui → apps
                                              → @financial-app/shared       → apps
```

---

## Step 6.3 — Update Root package.json Scripts

```json
{
  "scripts": {
    "build":      "turbo build",
    "dev":        "turbo dev",
    "lint":       "turbo lint",
    "type-check": "turbo type-check",
    "tokens":     "pnpm --filter @financial-app/tokens build",
    "clean":      "rm -rf node_modules packages/*/node_modules apps/*/node_modules",
    "clean:build": "rm -rf packages/*/build packages/*/dist apps/*/dist"
  }
}
```

---

## Step 6.4 — Add Build Script to Each Package

Each package needs a `build` script for Turbo to call.

### @financial-app/tokens
```json
{ "build": "style-dictionary build --config sd.config.js",
  "watch": "style-dictionary build --config sd.config.js --watch" }
```

### @financial-app/tailwind-config
```json
{ "build": "echo 'tailwind-config has no build step'" }
```

### @financial-app/ui
```json
{ "build": "tsc --noEmit",
  "type-check": "tsc --noEmit" }
```

### @financial-app/shared
```json
{ "build": "tsc",
  "dev": "tsc --watch" }
```

### apps/mobile
```json
{ "dev": "expo start" }
```

### apps/web
```json
{ "build": "vite build",
  "dev": "vite" }
```

---

## Step 6.5 — Add .turbo to .gitignore

```
.turbo/
```

---

## Step 6.6 — Verify Full Pipeline

```bash
# Build everything from scratch in correct order
pnpm build

# Dev mode — starts tokens watcher, web dev server, and mobile expo
pnpm dev

# Type check entire monorepo
pnpm type-check
```

---

## Step 6.7 — CI Pipeline (optional but recommended)

For GitHub Actions or similar:
```yaml
- name: Install
  run: pnpm install

- name: Build tokens first (not cached in CI)
  run: pnpm --filter @financial-app/tokens build

- name: Build all
  run: pnpm build

- name: Type check
  run: pnpm type-check
```

---

## Completion Criteria

- [ ] `turbo.json` exists at repo root
- [ ] `turbo` installed as root devDependency
- [ ] All packages have a `build` script
- [ ] `pnpm build` succeeds from root in correct order
- [ ] `pnpm dev` starts both apps concurrently
- [ ] `.turbo/` in .gitignore
- [ ] Build cache works (second run is faster)

## Done

All 6 phases complete. The monorepo is fully set up.
Refer to PERSONAL_FINANCE_ANALYSIS_EN.md for feature development roadmap.
