# Phase 4 — Web App Scaffold

## Goal

Create `apps/web/` — a React Router + Vite app that consumes `@financial-app/ui`
and gets `.web.tsx` component implementations automatically via Vite's bundler resolution.

## Status: TODO (requires Phase 3 complete)

---

## Step 4.1 — Scaffold React Router + Vite App

```bash
cd apps
pnpm create vite web --template react-ts
cd web
```

---

## Step 4.2 — Install Dependencies

```bash
# From apps/web
pnpm add react-router-dom
pnpm add @financial-app/ui@workspace:^
pnpm add @financial-app/tailwind-config@workspace:^

# Dev dependencies
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Step 4.3 — Configure Tailwind CSS

### apps/web/tailwind.config.js
```js
const baseConfig = require('@financial-app/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};
```

### apps/web/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 4.4 — Configure Vite for .web Extension Resolution

### apps/web/vite.config.ts
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@financial-app/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
});
```

The `extensions` array order ensures `.web.tsx` is resolved before `.tsx` —
this is the web equivalent of Metro's `.native.tsx` resolution.

---

## Step 4.5 — Configure React Router

### apps/web/src/main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### apps/web/src/App.tsx
```tsx
import { Routes, Route } from 'react-router-dom';
import { Header, Button, Card } from '@financial-app/ui';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Finance Web" subtitle="Design System partagé" />
      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <Card title="Bienvenue" text="Ceci est une carte du design-system partagé." />
        <Card title="Actions">
          <Button label="Primary" onPress={() => alert('Primary!')} />
          <Button label="Secondary" variant="secondary" onPress={() => alert('Secondary!')} />
          <Button label="Outline" variant="outline" onPress={() => alert('Outline!')} />
        </Card>
      </main>
    </div>
  );
}
```

---

## Step 4.6 — Verify Cross-Platform Resolution

```bash
# Start web app
pnpm --filter web-financial-app dev

# Verify in browser DevTools:
# Components should render as <button> and <div>, NOT as RN primitives
# No "react-native" should appear in network tab
```

---

## Step 4.7 — Import CSS Variables (optional but recommended)

In `apps/web/src/index.css`, import the generated CSS vars from tokens:
```css
@import '../../packages/tokens/build/css/variables.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Completion Criteria

- [ ] `apps/web/` exists and boots with `pnpm --filter web-financial-app dev`
- [ ] Vite resolves `.web.tsx` before `.tsx`
- [ ] All 3 design system components render as HTML elements
- [ ] Tailwind classes apply correctly (colors match mobile app)
- [ ] React Router configured with at least one route
- [ ] No React Native imports in web bundle (check DevTools)

## Next

→ docs/plans/phase-5-shared.md
