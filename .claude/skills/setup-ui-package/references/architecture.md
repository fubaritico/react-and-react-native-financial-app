# UI Package — Target Architecture Reference

Based on vite-mf-monorepo/packages/ui, adapted for cross-platform (React Native + React web).

## Directory Structure

```
packages/ui/
  src/
    assets/                   # Static assets (icons, images)
    components/               # Cross-platform components (file extension split)
      Button/
        Button.tsx            # Types + props interface ONLY
        Button.native.tsx     # React Native implementation
        Button.web.tsx        # DOM implementation
        Button.test.tsx       # Tests (web/jsdom by default)
        index.ts              # Re-export
    lib/                      # Internal utilities
      tw.ts                   # twrnc singleton (native)
      cn.ts                   # clsx + tailwind-merge (web)
    variants/                 # CVA variant objects (platform-agnostic)
      button.variants.ts
    hooks/                    # Shared hooks (no renderer imports)
    index.ts                  # Public API — all exports
    styles.css                # Tailwind CSS entry point (web consumers)
  dist/                       # GENERATED — gitignored
  tsup.config.ts
  tsconfig.json
  tsconfig.build.json
  vitest.config.ts
  vitest.setup.ts
  postcss.config.js
  tailwind.config.js          # Tailwind v3 config (extends @financial-app/tailwind-config)
  eslint.config.js
  package.json
  .gitignore
  CHANGELOG.md
  README.md
```

## package.json Template

```json
{
  "name": "@financial-app/ui",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "./styles.css": "./dist/styles.css"
  },
  "react-native": "./src/index.ts",
  "sideEffects": ["*.css"],
  "files": ["dist", "src"],
  "scripts": {
    "build:css": "tailwindcss -i ./src/styles.css -o ./dist/styles.css --minify",
    "build:js": "tsup && tsc -p tsconfig.build.json",
    "build": "pnpm build:js && pnpm build:css",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ./src",
    "type-check": "tsc --noEmit",
    "changelog": "conventional-changelog -p angular -r 0 --path . > CHANGELOG.md"
  },
  "peerDependencies": {
    "react": "catalog:",
    "react-native": "catalog:"
  },
  "peerDependenciesMeta": {
    "react-native": {
      "optional": true
    }
  },
  "dependencies": {
    "class-variance-authority": "catalog:",
    "clsx": "catalog:",
    "tailwind-merge": "catalog:",
    "twrnc": "catalog:"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "catalog:",
    "@testing-library/jest-dom": "catalog:",
    "@testing-library/react": "catalog:",
    "@testing-library/user-event": "catalog:",
    "@types/react": "catalog:",
    "@vitejs/plugin-react": "catalog:",
    "@vitest/coverage-v8": "catalog:",
    "autoprefixer": "catalog:",
    "conventional-changelog": "catalog:",
    "jsdom": "catalog:",
    "postcss": "catalog:",
    "tailwindcss": "catalog:",
    "tsup": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

### Key differences from reference (vite-mf-monorepo)

| Aspect | Reference | This project |
|--------|-----------|-------------|
| Scope | `@vite-mf-monorepo/ui` | `@financial-app/ui` |
| Platform | Web-only (DOM) | Cross-platform (RN + web) |
| Peer deps | `react`, `react-dom` | `react`, `react-native` (optional) |
| Dependencies | `clsx` only | `clsx`, `twrnc`, `cva`, `tailwind-merge` |
| Framework subpaths | `./react-router`, `./next` | None (file extension split handles platforms) |
| Externals (tsup) | `react`, `react-dom`, `react-router-dom`, `next` | `react`, `react-dom`, `react-native`, `react-router-dom`, `expo-router` |
| `react-native` field | N/A | `"./src/index.ts"` (Metro reads source) |
| CSS prefix | `prefix(ui)` | No prefix (single design system) |
| Tailwind version | v4 (`@import "tailwindcss"`) | v3 (`@tailwind base/components/utilities`) |

## tsup.config.ts Template

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

### Why these settings?

- **`bundle: false`** — each file compiles individually; tree-shaking happens at the app level
- **`dts: false`** — tsup's DTS is slow and sometimes inaccurate; `tsc -p tsconfig.build.json` is used instead
- **`format: ['esm']`** — ESM only; no CJS needed (all consumers are ESM)
- **`minify: true`** — reduces output size without affecting debugging (sourcemaps enabled)

## tsconfig.build.json Template

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

## vitest.config.ts Template

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

## vitest.setup.ts Template

```ts
import '@testing-library/jest-dom/vitest'
```

## postcss.config.js Template (Tailwind v3)

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## styles.css Template (Tailwind v3)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## .gitignore Template

```
dist/
coverage/
```

## Exports Map — How It Works

```
Web consumers (Vite/webpack):
  import { Button } from '@financial-app/ui'
    → resolves via "exports"."." → dist/index.js
    → bundler picks .web.tsx files via extension resolution

  import '@financial-app/ui/styles.css'
    → resolves via "exports"."./styles.css" → dist/styles.css

Native consumers (Metro):
  import { Button } from '@financial-app/ui'
    → resolves via "react-native" field → src/index.ts (source, not built)
    → Metro picks .native.tsx files via platform extension
    → Metro transpiles on the fly — no dist/ needed
```

## Component Pattern (from design-system.md)

```
ComponentName/
  ComponentName.tsx         # Types + props — no JSX, no renderer imports
  ComponentName.native.tsx  # RN implementation (tw``, Pressable, View, Text)
  ComponentName.web.tsx     # DOM implementation (cn(), HTML elements)
  ComponentName.test.tsx    # Tests (Testing Library + jsdom)
  index.ts                  # Re-export: component from .native + types from .tsx
```

## src/lib/cn.ts Template

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## src/lib/tw.ts Template

```ts
import { create } from 'twrnc'
import resolveConfig from 'tailwindcss/resolveConfig'
import baseConfig from '@financial-app/tailwind-config'

export const tw = create(resolveConfig(baseConfig))
```

## CVA Variant File Template

```ts
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'rounded-lg font-semibold items-center justify-center',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-black',
        outline: 'bg-transparent border-2 border-primary text-primary',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
      disabled: { true: 'opacity-50' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

### Safe classes for shared variants (both twrnc and Tailwind CSS understand these)

```
bg-*  text-*  border-*  rounded-*
p-*   m-*     w-*       h-*
opacity-*     flex      flex-row
items-*       justify-* gap-*
font-*        text-sm   text-base  text-lg  leading-*
```

### FORBIDDEN in shared variants (web-only — will break native)

```
hover:*     focus:*     active:*    focus-visible:*
group-*     peer-*
transition-* duration-* ease-*     animate-*
cursor-*    select-*    pointer-events-*
shadow-*    drop-shadow-*
ring-*      outline-*
```

## variants/index.ts Barrel Pattern

```ts
export { buttonVariants } from './button.variants'
export type { ButtonVariants } from './button.variants'
export { cardVariants } from './card.variants'
export type { CardVariants } from './card.variants'
export { headerVariants } from './header.variants'
export type { HeaderVariants } from './header.variants'
```

## Metro Config — Extension Resolution

All mobile app metro.config.js files MUST prioritize `.native.*` extensions:

```js
config.resolver.sourceExts = [
  'native.tsx', 'native.ts', 'native.jsx', 'native.js',
  ...config.resolver.sourceExts,
]
```

Without this, Metro may resolve `.web.tsx` or the plain `.tsx` types file instead of
`.native.tsx`, causing runtime crashes (HTML elements in RN, or missing JSX in types file).

## Public API (src/index.ts) Pattern

```ts
// Components
export { Button } from './components/Button'
export type { ButtonProps } from './components/Button'

// Variants (so consumers can compose)
export { buttonVariants } from './variants/button.variants'
export type { ButtonVariants } from './variants/button.variants'
```
