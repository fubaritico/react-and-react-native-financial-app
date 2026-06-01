# Validation Checklist, Import Rules & Gotchas

## Validation Checklist

- [ ] Correct atomic level directory
- [ ] Variant file colocated in component folder (not in shared `variants/`)
- [ ] No renderer imports in variant file
- [ ] No JSX or runtime values in types file
- [ ] `.styles.ts` with `shared` + `web` + `native` named exports (skip only if no inner elements AND no platform-specific classes)
- [ ] Every key in `.styles.ts` has a JSDoc comment
- [ ] `.native.tsx` imports `shared` + `native` from `.styles.ts` — never `web`
- [ ] `.web.tsx` imports `shared` + `web` from `.styles.ts` — never `native`
- [ ] No web-only classes hardcoded inline in `.web.tsx` — all in `web` export of `.styles.ts`
- [ ] No native-only classes hardcoded inline in `.native.tsx` — all in `native` export of `.styles.ts`
- [ ] No HTML elements in .native.tsx
- [ ] No RN/StyleSheet imports in .web.tsx
- [ ] No web-only Tailwind classes in variant base or variants object
- [ ] `.constants.ts` contains ONLY constants (no functions, no types)
- [ ] `.utils.ts` contains ONLY functions (no types — import them from `.tsx`)
- [ ] All types/interfaces live in the `.tsx` types file (not in constants or utils)
- [ ] All text uses `<Typography>` — no bare Text/p/span/h1
- [ ] TWO barrel files: index.ts + index.web.ts with explicit extensions
- [ ] Variants and styles NOT exported from barrels or public API
- [ ] Component + type exported from BOTH src/index.ts and src/index.web.ts
- [ ] JSDocs on props interface properties
- [ ] Web tests written (`$Name.test.tsx`) with render, interaction, disabled, a11y checks
- [ ] Story created

## Import Path Rule — Sub-Components Within Organisms

When a component lives **deep inside an organism folder** (e.g. `DataTable/cells/ActionCell/`),
imports of other atomic levels (atoms, molecules) MUST use **relative paths**, NOT `#` aliases.

```ts
// GOOD — relative path, no ESLint import/order issues
import { Icon } from '../../../../atoms/Icon/Icon.native'
import { Dropdown } from '../../../../molecules/Dropdown/Dropdown.native'

// BAD — bare #Atoms/#Molecules cause ESLint pathGroup mismatches in nested files
import { Icon } from '#Atoms'
import { Dropdown } from '#Molecules'
```

`#` aliases are fine for top-level component files (e.g. `atoms/Button/Button.native.tsx` importing `#Lib/tw`),
but organism sub-components should use relative paths to avoid import ordering headaches.

## Gotchas

- Never use `React.FC` or `React.` prefix for types — import types directly from react
- Never use `console.log` — use `console.warn` or `console.error`
- Never use explicit `any` — strict TypeScript throughout
- The variant file must ONLY contain safe cross-platform classes (see styling rules)
- Each component owns its own variant — duplicate rather than share across components
- Exception: composition chains (e.g. PasswordInput) may import parent's variant
- `flex` is safe in shared classes: twrnc v4.15+ maps bare `flex` to `{ display: 'flex' }` (styles.js), identical to Tailwind web — and a no-op on native (RN is `display: flex` by default). Only `flex-1`/`flex-<n>` map to `flexGrow`/`flexBasis`. Note: `flex-1` may not propagate to a native `Pressable` in some CVA cases — add an explicit `{ flex: 1 }` style there (see `known-issues.md`).
