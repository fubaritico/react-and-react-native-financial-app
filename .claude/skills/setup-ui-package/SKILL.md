---
name: setup-ui-package
description: Set up or migrate the @financial-app/ui package — build pipeline (tsup + tsc + Tailwind CSS), testing (Vitest + Testing Library), CSS entry point, exports map, and cross-platform component structure. Detects existing setup and adapts accordingly.
allowed-tools: Read Write Edit Bash(pnpm:*) Bash(mkdir:*) Bash(ls:*) Glob Grep AskUserQuestion
paths:
  - packages/ui/**
metadata:
  author: financial-app
  version: "1.0"
---

# Setup / Migrate UI Package

Set up `packages/ui/` from scratch or migrate a pre-existing package to match the reference
architecture. The skill detects which mode to use based on file existence.

Based on a proven reference implementation (vite-mf-monorepo/packages/ui). Read
`references/architecture.md` for the target directory structure, build config templates,
and export patterns.

## Prerequisites

Before starting, read:
- `.claude/rules/design-system.md` — component file structure rules
- `.claude/rules/styling.md` — CVA + Tailwind + twrnc conventions
- `.claude/rules/monorepo.md` — workspace and dependency rules
- `references/architecture.md` — target architecture and config templates

## Mode Detection

Check these files to determine the mode:

| File | Exists? | Implication |
|------|---------|-------------|
| `packages/ui/package.json` | yes | Package exists — **migrate mode** |
| `packages/ui/package.json` | no | Nothing exists — **scaffold mode** |
| `packages/ui/tsup.config.ts` | yes | Build pipeline already set up — skip step 3 |
| `packages/ui/tsconfig.build.json` | yes | Declaration build already set up — skip step 4 |
| `packages/ui/vitest.config.ts` | yes | Testing already set up — skip step 6 |
| `packages/ui/src/styles.css` | yes | CSS entry point already exists — skip step 7 |
| `packages/ui/postcss.config.js` | yes | PostCSS already configured — skip step 8 |
| `packages/ui/src/lib/cn.ts` | yes | Web className utility already exists — skip step 9 |
| `packages/ui/src/variants/` | yes (dir) | Variants directory already exists — skip step 10 |

**Prompt the user** at each major step with the detection result:
```
[migrate] tsup.config.ts not found — will create build pipeline. Proceed? (Y/n)
[migrate] tsconfig.build.json found — skipping declaration build setup.
[scaffold] Starting from scratch — creating full package structure.
```

## Steps

### 1. Detect mode

Read `packages/ui/package.json`. If it exists, enter migrate mode. Otherwise scaffold mode.

In migrate mode, check every file from the detection table above and report findings to the user
before proceeding.

### 2. Create / update package.json

**Scaffold**: create from template in `references/architecture.md` (section "package.json template").

**Migrate**: read existing package.json, then apply these changes:
- Add missing `"type": "module"` if absent
- Add `"main"`, `"module"`, `"types"` fields pointing to `dist/`
- Add `"exports"` map (see reference)
- Add `"sideEffects": ["*.css"]`
- Add missing scripts: `build`, `build:js`, `build:css`, `dev`, `test`, `test:watch`, `typecheck`
- Add missing devDependencies: `tsup`, `vitest`, `@vitejs/plugin-react`, `@testing-library/react`,
  `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@vitest/coverage-v8`,
  `postcss`, `autoprefixer`, `@tailwindcss/postcss` (if web CSS needed), `tailwindcss`
- Preserve existing dependencies — never remove
- Prompt user: `[migrate] package.json will be updated with build/test scripts and dependencies. Review diff?`

### 3. Create tsup.config.ts

Build JS/TSX files with tsup (unbundled ESM, no DTS — tsc handles declarations).

```ts
import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.*'],
  format: ['esm'],
  bundle: false,
  dts: false,
  clean: !options.watch,
  minify: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    'react-native',
    'react-router-dom',
    'expo-router',
  ],
  esbuildOptions(esbuildOpts) {
    esbuildOpts.jsx = 'automatic'
  },
}))
```

Key differences from reference:
- Adds `react-native` and `expo-router` to externals (cross-platform)
- No `next` externals (this project uses React Router, not Next.js)

### 4. Create tsconfig.build.json

Separate config for declaration-only emit:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "emitDeclarationOnly": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "types": []
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "src/**/*.test.*", "vitest.setup.ts"]
}
```

### 5. Update tsconfig.json

Ensure the main tsconfig.json has these fields (merge, don't replace):
- `"module": "ESNext"`
- `"moduleResolution": "bundler"`
- `"jsx": "react-jsx"`
- `"declaration": true`, `"declarationMap": true`
- `"types": ["vitest/globals", "@testing-library/jest-dom"]` (if testing is set up)
- `"include"` covers `["src", "vitest.setup.ts"]`
- `"exclude"` covers `["node_modules", "dist"]`

Prompt: `[migrate] tsconfig.json will be updated with build-related fields. Review diff?`

### 6. Create vitest.config.ts + vitest.setup.ts

**vitest.config.ts**:
```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.tsx'],
  },
})
```

**vitest.setup.ts**:
```ts
import '@testing-library/jest-dom/vitest'
```

### 7. Create src/styles.css

CSS entry point for Tailwind CSS output (web consumers import this):

```css
@import "tailwindcss";

@source "./**/*.{ts,tsx}";
```

Adapt based on the project's Tailwind version:
- **Tailwind v3**: use `@tailwind base; @tailwind components; @tailwind utilities;`
- **Tailwind v4**: use `@import "tailwindcss";` with `@source`

This project uses **Tailwind v3**, so:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 8. Create postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

For Tailwind v3, use `tailwindcss: {}`. For v4, use `'@tailwindcss/postcss': {}`.

### 9. Create src/lib/cn.ts (web utility)

Required for web implementations. This is the ONLY way to compose classNames on web.

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Rules:
- cn() is NEVER imported in `.native.tsx` files
- cn() always starts with CVA variant output, then adds web-only classes
- Requires `clsx` and `tailwind-merge` as dependencies

### 10. Create src/variants/ directory

Create the variants directory with a barrel `index.ts`. This directory holds CVA variant
objects that are **platform-agnostic** — consumed by both `.native.tsx` and `.web.tsx`.

```
packages/ui/src/variants/
  index.ts              # barrel re-exports all variants
```

In migrate mode with existing components, create a variant file per component. Follow this
template (see `references/architecture.md` for full template).

**Critical**: only use cross-platform-safe Tailwind classes in variant files. These are
FORBIDDEN in shared variants (will break native):
- `hover:*`, `focus:*`, `active:*`, `focus-visible:*`
- `group-*`, `peer-*`
- `transition-*`, `duration-*`, `ease-*`, `animate-*`
- `cursor-*`, `select-*`, `pointer-events-*`
- `shadow-*`, `drop-shadow-*`, `ring-*`, `outline-*`

Web-only classes go in `.web.tsx` files via `cn()`, never in shared variants.

### 11. Update Metro config for extension resolution

In migrate mode, check that all mobile app Metro configs resolve `.native.*` extensions first.
This is critical for the file extension split to work.

In each app's `metro.config.js`, ensure:
```js
config.resolver.sourceExts = [
  'native.tsx', 'native.ts', 'native.jsx', 'native.js',
  ...config.resolver.sourceExts,
]
```

Without this, Metro may pick `.web.tsx` or `.tsx` files instead of `.native.tsx`.

Prompt: `[migrate] Checking Metro configs in apps/ for .native.* extension priority...`

### 12. Update .gitignore

Add `dist/` to the package's `.gitignore` (or create one):
```
dist/
coverage/
```

### 13. Update exports map

Ensure `package.json` exports are correct for the cross-platform pattern:

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "./styles.css": "./dist/styles.css"
  },
  "react-native": "./src/index.ts"
}
```

The `"react-native"` top-level field ensures Metro uses source directly (no build step needed
for native — Metro transpiles on the fly).

### 14. Ensure src/index.ts public API

Check that `src/index.ts` exists and re-exports all components with:
- Named component exports
- Named type exports
- Named variant exports (if CVA variants exist)

In migrate mode, do not modify existing exports — only flag missing patterns.
Ensure variant exports are included alongside component exports (see phase-3 plan for pattern).

### 15. Install dependencies

```bash
pnpm install
```

Add any new devDependencies to the pnpm catalog first if they're not already there.

### 16. Verify build

```bash
pnpm --filter @financial-app/ui build
```

Confirm these outputs exist:
- `packages/ui/dist/index.js`
- `packages/ui/dist/index.d.ts`
- `packages/ui/dist/styles.css` (if CSS build is configured)

### 17. Verify mobile app still works (migrate mode)

After migration, the mobile app MUST still boot and render identically to before.

Prompt: `[migrate] Infrastructure migration complete. Please run the mobile app to verify rendering is unchanged.`

```bash
pnpm --filter mobile-expo-financial-app start
```

### 18. Run checks

```bash
pnpm type-check && pnpm lint && pnpm test
```

## Validation Checklist

- [ ] `package.json` has `"type": "module"`
- [ ] `package.json` has correct `"exports"` map
- [ ] `package.json` has `"react-native"` field pointing to source
- [ ] `tsup.config.ts` externalizes `react`, `react-dom`, `react-native`
- [ ] `tsconfig.build.json` emits declarations only to `dist/`
- [ ] `vitest.config.ts` uses jsdom environment
- [ ] `src/lib/cn.ts` exists with clsx + tailwind-merge
- [ ] `src/lib/tw.ts` exists as twrnc singleton
- [ ] `src/variants/` directory exists with barrel `index.ts`
- [ ] No web-only classes (`hover:`, `shadow-`, `transition-`, `cursor-`) in variant files
- [ ] `src/styles.css` exists with Tailwind v3 directives
- [ ] `postcss.config.js` exists
- [ ] `dist/` is gitignored
- [ ] Metro configs in all apps have `.native.*` extension priority
- [ ] Build produces `dist/index.js` + `dist/index.d.ts`
- [ ] Mobile app still boots and renders correctly (migrate mode)
- [ ] `pnpm type-check && pnpm lint && pnpm test` passes from root

## Gotchas

- Metro (React Native) reads source directly via `"react-native"` field — it never uses `dist/`.
  Only web consumers use the built output.
- tsup must NOT bundle (set `bundle: false`) — tree-shaking happens at the app level.
- tsup must NOT generate `.d.ts` files — use `tsc -p tsconfig.build.json` separately for
  accurate declaration output with path aliases.
- `sideEffects: ["*.css"]` is required so bundlers don't tree-shake the CSS import.
- Never remove existing dependencies during migration — only add missing ones.
- In this project, Tailwind CSS v3 is used (not v4). Use the v3 PostCSS plugin and directives.
- The build script order matters: `build:js` must run before `build:css` if CSS references
  generated class names (unlikely but safe to sequence).
- `shadow-*` classes in CVA variants will crash on native — move them to `.web.tsx` via `cn()`.
  Example: Card's `shadow-md` must stay in `Card.web.tsx`, never in `card.variants.ts`.
- Metro MUST resolve `.native.*` extensions before plain `.tsx`. Without the `sourceExts`
  config in metro.config.js, Metro may pick the wrong file.
- The types file (`Component.tsx`) must have NO JSX and NO renderer imports. It exports only
  the props interface and re-exports the variant object. `import type` from `react-native`
  is acceptable (e.g., `ViewStyle`), but avoid it when possible — prefer generic types.
- cn() must NEVER appear in `.native.tsx` files. tw`` must NEVER appear in `.web.tsx` files.
- After migration, always verify the mobile app renders identically — the refactor must be
  invisible to end users.
