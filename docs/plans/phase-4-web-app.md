# Phase 4 — Web App (React Router v7 Framework + SSR)

## Goal

Create `apps/web/` — a React Router v7 framework-mode app with SSR, consuming
`@financial-app/ui` web components. One page mirroring the mobile app's home screen.

In production, this app will be served by `apps/server/` (Phase 7). During development,
it runs its own Vite dev server.

## Status: TODO (requires Phase 3 complete)

## Architecture

```
apps/web/                      # React Router v7 framework app
  app/
    root.tsx                   # HTML shell, <head>, Tailwind CSS
    routes/
      home.tsx                 # SSR route — mirrors mobile home screen
    app.css                    # Tailwind directives + token CSS vars
  react-router.config.ts       # RR7 framework config (SSR enabled)
  vite.config.ts               # Vite + @react-router/dev plugin + .web.tsx resolution
  tailwind.config.js           # Extends @financial-app/tailwind-config
  tsconfig.json
  package.json
```

Production serving handled by `apps/server/` (Phase 7):
```
apps/server/                   # Express — mounts API + serves RR7 build
  src/
    index.ts                   # Express: /api/* routes + RR7 SSR catch-all
    api/                       # REST routes (Phase 7)
```

Build order (Phase 6 — Turborepo):
`tokens -> tailwind-config -> ui -> web -> server`

---

## Step 4.1 — Scaffold React Router v7 app

Use the official `create-react-router` template with Node preset.

```bash
cd apps
pnpm create react-router@latest web
```

This generates:
- `app/root.tsx`, `app/routes/home.tsx`
- `react-router.config.ts`
- `vite.config.ts` with `@react-router/dev/vite` plugin
- `entry.server.tsx`, `entry.client.tsx`

Clean up the template: remove demo content, keep the shell.

---

## Step 4.2 — Install monorepo dependencies

```bash
pnpm --filter web-financial-app add @financial-app/ui@workspace:^
pnpm --filter web-financial-app add @financial-app/tailwind-config@workspace:^
pnpm --filter web-financial-app add @financial-app/tokens@workspace:^
```

Dev dependencies (if not already from template):
```bash
pnpm --filter web-financial-app add -D tailwindcss postcss autoprefixer
```

---

## Step 4.3 — Configure Vite for .web.tsx resolution

### apps/web/vite.config.ts

```ts
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  resolve: {
    extensions: [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
      '.tsx', '.ts', '.jsx', '.js',
    ],
  },
})
```

The `extensions` array ensures `.web.tsx` resolves before `.tsx` — the web
equivalent of Metro's `.native.tsx` resolution.

---

## Step 4.4 — Configure Tailwind CSS

### apps/web/tailwind.config.js

```js
import baseConfig from '@financial-app/tailwind-config'

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
}
```

### apps/web/app/app.css

```css
@import '@financial-app/tokens/build/css/variables.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 4.5 — Configure React Router v7

### apps/web/react-router.config.ts

```ts
import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
} satisfies Config
```

SSR is enabled by default in framework mode, but explicit is better.

---

## Step 4.6 — Root layout

### apps/web/app/root.tsx

HTML shell with:
- `<head>`: meta tags, charset, viewport, CSS link (app.css)
- `<body>`: `<Outlet />` for nested routes
- `<Scripts />`, `<ScrollRestoration />` from react-router

---

## Step 4.7 — Home route (mirrors mobile app)

### apps/web/app/routes/home.tsx

```tsx
import { Header, Button, Card } from '@financial-app/ui'

export function loader() {
  // Static data for now — proves the SSR data pipeline works
  return {
    title: 'Finance Web',
    subtitle: 'Cross-platform design system',
  }
}

export default function Home() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen bg-background">
      <Header title={data.title} subtitle={data.subtitle} />
      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <Card title="Welcome" text="This card comes from the shared design system." />
        <Card title="Actions">
          <Button label="Primary" onPress={() => alert('Primary!')} />
          <Button label="Secondary" variant="secondary" onPress={() => alert('Secondary!')} />
          <Button label="Outline" variant="outline" onPress={() => alert('Outline!')} />
        </Card>
      </main>
    </div>
  )
}
```

Loader returns data server-side. Components render as semantic HTML (`<button>`,
`<div>`, `<header>`) — no React Native primitives.

---

## Step 4.8 — Scripts & monorepo integration

### apps/web/package.json scripts

```json
{
  "name": "web-financial-app",
  "private": true,
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "react-router-serve ./build/server/index.js",
    "type-check": "tsc --noEmit",
    "lint": "eslint ."
  }
}
```

- `dev` — Vite dev server with HMR + SSR
- `build` — produces `build/client/` + `build/server/`
- `start` — built-in serve for quick testing (Phase 7 replaces with Express)

### ESLint config

Extends root base config, same pattern as other apps.

### Root package.json

Add web app to root `dev` / `build` scripts.

---

## Step 4.9 — Verify

- [ ] `pnpm --filter web-financial-app dev` starts without errors
- [ ] Home page renders Header, 2 Cards, 3 Buttons
- [ ] Components are semantic HTML — no `<View>`, `<Text>`, `<TouchableOpacity>`
- [ ] View page source: SSR'd HTML content visible (not empty shell)
- [ ] Loader data is serialized in the SSR response (`__reactRouterData`)
- [ ] Tailwind classes apply correctly (colors match token palette)
- [ ] No `react-native` imports in the client bundle (check DevTools Network)
- [ ] `pnpm type-check && pnpm lint` pass from root

---

## Completion Criteria

- [ ] `apps/web/` exists with React Router v7 framework mode
- [ ] SSR enabled — pages render server-side
- [ ] Vite resolves `.web.tsx` before `.tsx`
- [ ] All 3 shared components render as HTML elements
- [ ] Loader function works (static data, proves SSR data pipeline)
- [ ] Tailwind CSS configured with shared config + token CSS vars
- [ ] ESLint + TypeScript strict
- [ ] No React Native in the web bundle

## Phase 7 Impact

Phase 7 changes scope: instead of a standalone `apps/api/` Express app, it becomes
`apps/server/` — an Express server that:
1. Mounts API routes under `/api/*`
2. Serves `apps/web/build/client/` as static assets
3. Uses `createRequestHandler` from `@react-router/express` for SSR catch-all

Phase 6 (Turborepo) ensures build order: `web` builds before `server`.

## Next

-> docs/plans/phase-5-shared.md
