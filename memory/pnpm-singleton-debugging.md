---
title: pnpm Singleton Debugging — Lessons Learned
type: note
permalink: pnpm-singleton-debugging
tags: [debugging, pnpm, monorepo, lesson]
---

# pnpm Singleton Debugging — Lessons Learned

## Observations

- [problem] pnpm creates separate copies of packages when peer dependency contexts differ (e.g. `@babel/core@7.28.5` vs `@babel/core@7.29.0`)
- [symptom] `__fbBatchedBridgeConfig is not set` in Jest — react-native preset mocks only apply to ONE copy, workspace packages resolve the other
- [symptom] `react-i18next` singleton broken — Metro resolves from package's node_modules, not app's
- [symptom] `react-native-svg` RNSVGPath crash — two copies of SVG native module
- [symptom] `react-dom` version conflicts — `@prisma/studio-core` pulls 19.2.5 while apps use 19.1.0
- [diagnosis] `ls node_modules/.pnpm/ | grep "^react-native@"` — more than 1 entry = problem
- [fix] Jest: `moduleNameMapper` forces all imports to app's copy of react-native
- [fix] Metro: `resolver.resolveRequest` override to force singleton resolution from app's package.json
- [fix] Better: remove the dependency from shared packages entirely (react-i18next removed from UI, passed as props)
- [fix] react-dom: add `react-dom: "catalog:"` to ALL workspace packages + overrides in `pnpm-workspace.yaml`
- [lesson] pnpm v10 uses `overrides` in `pnpm-workspace.yaml`, NOT `pnpm.overrides` in root `package.json` (legacy)
- [principle] If it works in other projects, the problem is YOUR config — never conclude "it can't work"
- [principle] Never mock entire packages to null as workaround — find the root cause in the resolution chain

## Relations

- manifests_in [[Jest React Native Testing]]
- manifests_in [[Metro Config Monorepo]]
- solved_by [[Debugging Mindset]]
