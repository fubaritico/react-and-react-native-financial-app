---
title: i18n Architecture
type: note
permalink: i18n-architecture
tags: [decision, architecture, i18n]
---

# i18n Architecture

## Observations

- [decision] i18next + react-i18next across all apps — shared config, per-app language detection
- [decision] UI components are i18n-agnostic — receive translated strings as props, never call `useTranslation()` internally
- [reason] Avoids react-i18next as a UI package dependency — prevents pnpm singleton issues
- [reason] UI components stay pure and testable — no i18n context needed in stories or tests
- [lesson] react-i18next was initially a UI peerDependency — caused Metro singleton resolution bugs. Removed entirely.
- [pattern] Shared config in `@financial-app/shared` exports `i18nConfig` (resources, supportedLngs, fallbackLng)
- [pattern] Translation files in `packages/shared/src/i18n/locales/{en,fr}/translation.json`
- [pattern] Each app has its own `i18n.ts` with platform-specific detector: expo-localization (mobile), browser-languagedetector (web)
- [rule] NEVER pass fallback as second argument to `t()` — if a key is missing, add it to both en + fr translation files
- [rule] NEVER use default values for label/placeholder props in destructuring — labels are always required props
- [pattern] Storybook initializes i18n in `preview.ts` — stories use `i18n.t('key')` directly in args

## Relations

- avoids [[pnpm Singleton Debugging]]
- consumed_by [[UI Component Props Pattern]]
- configured_in [[Shared Package]]
