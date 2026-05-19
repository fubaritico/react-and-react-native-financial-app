---
title: Fix — Jest React Native Crash in Monorepo
type: note
permalink: fix-jest-rn-monorepo-crash
tags: [fix, jest, testing, debugging, how-to]
---

# Fix — Jest React Native Crash in Monorepo

## Observations

- [symptom] `__fbBatchedBridgeConfig is not set, cannot invoke native modules` when running Jest tests
- [symptom] Only happens when tests render components from workspace packages (@financial-app/ui, @financial-app/features)
- [cause] pnpm creates 2+ copies of react-native when peer dep contexts differ (e.g. different @babel/core versions)
- [cause] Jest preset (`preset: 'react-native'`) mocks RN internals only for the copy resolved from the APP's node_modules — workspace packages resolve a DIFFERENT copy with no mocks
- [diagnosis-step-1] Count react-native copies: `ls node_modules/.pnpm/ | grep "^react-native@"` — more than 1 = problem
- [diagnosis-step-2] Check app's copy: `pnpm --filter <app> exec node -e "console.log(require.resolve('react-native/package.json'))"`
- [diagnosis-step-3] Check workspace package's copy: `pnpm --filter <app> exec node -e "console.log(require.resolve('react-native', { paths: ['../../packages/ui/src/'] }))"`
- [fix] Force singleton via `moduleNameMapper` in jest.config.js:
- [fix-code] `'^react-native$': rnRoot` and `'^react-native/(.*)$': rnRoot + '/$1'` where `rnRoot = path.dirname(require.resolve('react-native/package.json'))`
- [fix] Same pattern for react-native-svg and twrnc — mock files in `<app>/jest.mocks/`
- [principle] If tests work everywhere else but not here, the problem is YOUR resolution chain — never accept "it can't work"
- [principle] NEVER mock entire packages to null (`jest.mock('@financial-app/ui', () => null)`) — find the root cause

## Relations

- caused_by [[pnpm Singleton Debugging]]
- applies [[Debugging Mindset]]
- related_to [[Testing Architecture Decisions]]
