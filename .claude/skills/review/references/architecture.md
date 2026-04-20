# Architecture — Review Rules

## Critical Violations (ARCH-0xx)

### ARCH-001: Circular dependencies
- **Files**: All package imports
- **Check**: No circular imports between packages
- **Layer order** (one-directional only):
  ```
  tokens → tailwind-config → ui → apps
  shared → apps
  ```
- **Forbidden**: `apps/*` importing from another app, `ui` importing from `apps/*`

### ARCH-002: Hardcoded design values
- **Files**: All (except `packages/tokens/src/**`)
- **Check**: No raw hex colors (`#RRGGBB`), pixel values for spacing/sizing, or font sizes
- **Must use**: Token references (tw classes, CSS variables, or token JS imports)
- **Exception**: `0`, `1px` for borders, `100%`, `auto`, `inherit`

### ARCH-002b: Token contrast pairs not declared
- **Files**: `packages/tokens/src/semantic/**`
- **Check**: Every semantic color token that defines a text/foreground color must have a corresponding entry in `packages/tokens/src/contrast-pairs.json`
- **Rationale**: Contrast validation runs at token build time using `color-contrast-checker`. Undeclared pairs cannot be validated.
- **Must have**: `contrast-pairs.json` with foreground/background/usage/minRatio for every text-on-background combination

### ARCH-003: Apps importing from apps
- **Files**: `apps/**`
- **Check**: No imports from `../../apps/other-app` or `@financial-app` scoped app names

### ARCH-003b: SOLID principle violations
- **Files**: All `*.ts`, `*.tsx`
- **S — Single Responsibility**: A module, class, or component does one thing. A component that fetches data AND renders UI violates SRP — split into a hook + a presentational component.
- **O — Open/Closed**: Extend behavior through composition (variants, props, children), not by modifying existing code. A component that requires internal edits to support new variants is not open for extension.
- **L — Liskov Substitution**: A component accepting the same props interface must be interchangeable across platforms. `.native.tsx` and `.web.tsx` must honor the same Props contract.
- **I — Interface Segregation**: Props interfaces should not force consumers to provide values they don't use. Split large interfaces or use optional properties.
- **D — Dependency Inversion**: Depend on abstractions (token aliases, variant objects, interfaces), not on concrete implementations (raw hex values, platform-specific APIs in shared code).

## High Violations

### ARCH-004: Missing component files (4-file pattern)
- **Files**: `packages/ui/src/components/*/`
- **Check**: Every component directory must contain:
  - `ComponentName.tsx` — types/props only
  - `ComponentName.native.tsx` — RN implementation
  - `ComponentName.web.tsx` — DOM implementation
  - `index.ts` — re-export
- **Check**: A corresponding variant file should exist in `src/variants/`

### ARCH-005: Component not exported from public API
- **Files**: `packages/ui/src/index.ts`
- **Check**: Every component in `src/components/*/` must be exported from `src/index.ts`
- **Must export**: Component, Props type, and variant object

### ARCH-006: Missing variant file
- **Files**: `packages/ui/src/variants/`
- **Check**: Every component should have a `[name].variants.ts` file
- **Check**: Variant file must export a CVA object and its VariantProps type

### ARCH-007: Package.json missing required fields
- **Files**: `packages/*/package.json`
- **Check**: Must have `name` (with `@financial-app/` scope), `exports`, `types`
- **Check**: Apps must have `"private": true`

## Medium Violations

### ARCH-008: Wrong dependency direction
- **Files**: `packages/*/package.json`
- **Check**: Dependencies follow layer order
- **Example violation**: `@financial-app/tokens` depending on `@financial-app/ui`

### ARCH-009: Index barrel file anti-patterns
- **Files**: `**/index.ts`
- **Check**: No circular re-exports
- **Check**: No `export * from` that pulls in platform-specific code at the barrel level

### ARCH-010: Token build artifacts committed
- **Files**: `packages/tokens/build/**`
- **Check**: These files should never appear in git — they are generated
- **Must be**: Listed in `.gitignore`

## Low Violations

### ARCH-011: Inconsistent file naming
- **Files**: All
- **Check**: Component files use PascalCase
- **Check**: Utility/hook files use camelCase
- **Check**: Variant files use `[name].variants.ts` pattern
- **Check**: Config files use kebab-case or standard names (tsconfig.json, etc.)

### ARCH-012: Unused exports
- **Files**: `packages/*/src/index.ts`
- **Check**: Exported items that are not imported anywhere in the monorepo
- **Note**: Low severity — may be intentional for future use
