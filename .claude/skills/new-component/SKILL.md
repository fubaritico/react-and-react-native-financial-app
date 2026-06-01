---
name: new-component
description: Create a new cross-platform component in @financial-app/ui following the file extension split pattern (types, native, web, variants, index). Use when creating a UI component, adding a design system component, or scaffolding a new component.
allowed-tools: Read Write Bash(pnpm:*)
paths:
  - packages/ui/**
metadata:
  author: financial-app
  version: '2.1'
---

# New Component

Create a cross-platform component in `packages/ui/src/components/`.

**Before starting**, read `.claude/rules/design-system.md` and `.claude/rules/styling.md`.

`$ARGUMENTS` = ComponentName (PascalCase, e.g. `Button`, `Avatar`, `Card`).

## Atomic Design Placement

Pick the level before creating files:

- **atoms/** — indivisible elements, no internal UI dependency
- **molecules/** — compose atoms
- **organisms/** — autonomous sections, compose molecules
- **templates/** — page layouts

Atoms NEVER import from molecules/organisms/templates. Molecules NEVER import from organisms/templates.

## Workflow

1. **Scaffold the 9 files** → read `references/file-structure.md` for every template and rule
   (variant → styles → types → native → web → barrels → public API → optional constants/utils).
2. **Run checks** → `pnpm type-check && pnpm lint && pnpm test`
3. **Write tests** → `references/testing.md` (5-level policy). Prefer `/test $Name`.
4. **Create story** → invoke `/story $Name`.

While coding, keep `references/i18n.md` (no hardcoded text) and `references/checklist.md`
(validation checklist, organism import paths, gotchas) in mind.

## Mandatory Completion Sequence

No component is "done" without all 4:

1. `pnpm type-check && pnpm lint && pnpm test` — all pass
2. `/review` — multi-agent review
3. `/commit` — conventional commit
4. `/end-session` — update session state

## References (load on demand)

| File                           | When to load                                                    |
| ------------------------------ | --------------------------------------------------------------- |
| `references/file-structure.md` | Creating any of the 9 files — full templates + per-file rules   |
| `references/testing.md`        | Writing the test suite (5-level policy + template)              |
| `references/i18n.md`           | Any user-facing string (labels, placeholders, aria) + ARCH-017  |
| `references/checklist.md`      | Final validation, organism import paths, cross-platform gotchas |
