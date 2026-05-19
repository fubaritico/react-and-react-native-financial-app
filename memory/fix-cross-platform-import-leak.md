---
title: Fix — Cross-Platform Import Leak
type: note
permalink: fix-cross-platform-import-leak
tags: [fix, typescript, debugging, how-to]
---

# Fix — Cross-Platform Import Leak

## Observations

- [symptom] `Cannot find name 'HTMLTableCellElement'` or similar DOM type errors in bare RN tsc build
- [cause] A `.native.tsx` file imports from a `.web.tsx` file — pulls DOM types into the RN type graph which lacks `"dom"` lib
- [cause] Bare RN uses `@react-native/typescript-config` with `customConditions: ["react-native"]` — resolves UI package via `react-native` condition, follows import chains through workspace symlinks into source files
- [diagnosis] Search for web imports in native files: `grep -r "from.*\.web" packages/ui/src/**/*.native.tsx`
- [fix] Change the import to the `.native` version of the same component
- [real-case] `StatusCell.native.tsx` was importing `TableCell.web` instead of `TableCell.native` — fixed in commit 2e3c04b
- [rule] ALWAYS grep for `from.*\.web` in `.native.tsx` files before committing component changes
- [rule] `.native.tsx` files must NEVER import from `.web.tsx` files — no exceptions
- [rule] `.web.tsx` files must NEVER import from `.native.tsx` files — no exceptions either

## Relations

- caused_by [[Cross-Platform File Extension Split]]
- diagnosed_by [[Debugging Mindset]]
