---
title: Monorepo Structure
type: note
permalink: monorepo-structure
tags: [architecture, monorepo, pnpm]
---

# Monorepo Structure

## Observations

- [tool] pnpm workspaces + Turborepo (turbo.json planned Phase 6)
- [scope] All packages use `@financial-app/` scope
- [apps] `apps/mobile-expo/` — canonical Expo SDK 54 app, primary focus
- [apps] `apps/mobile/` — bare RN CLI, learning reference
- [apps] `apps/mobile-expo-ejected/` — ejected Expo, learning reference
- [apps] `apps/web/` — React Router + Vite (to create)
- [apps] `apps/storybook/` — Storybook dev tool
- [apps] `apps/api/` — Express 5 API server
- [packages] `packages/ui/` — cross-platform design system
- [packages] `packages/shared/` — Supabase, Jotai, TanStack Query, i18n, hooks, types
- [packages] `packages/icons/` — data-driven icon system
- [packages] `packages/prisma/` — type generation only
- [packages] `packages/tokens/` — Style Dictionary (to create)
- [packages] `packages/tailwind-config/` — shared Tailwind config (to create)
- [decision] Three mobile apps kept intentionally to compare bare RN vs Expo managed vs ejected — never delete them
- [decision] Only mobile-expo will be published — other two for learning/alignment
- [rule] Never create circular dependencies — shared packages NEVER import from apps
- [rule] All scripts run from root `package.json` — never `cd apps/... && npx expo ...`
- [rule] Always use pnpm — never npm or yarn, including registry lookups

## Relations

- enforces [[Why Strict Layer Order]]
- configured_by [[pnpm Singleton Debugging]]
- contains [[API Architecture]]
- contains [[Storybook Architecture]]
- contains [[UI Package Architecture]]
