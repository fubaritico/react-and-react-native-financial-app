# @financial-app/icons

Cross-platform SVG icon library for the Financial App monorepo. Exposes a type-safe `<Icon>` component that renders icons by name — similar to `react-icons`.

## Quick start

```tsx
import { Icon } from '@financial-app/icons'

<Icon name="search" size={20} />
<Icon name="navOverview" size={24} color="#277C78" />
```

## How it works

```
src/assets/*.svg          raw SVG source files (committed)
        ↓  pnpm icons
src/generated/iconData.ts  parsed path data + IconName type (gitignored)
        ↓
Icon.web.tsx              DOM <svg> — uses currentColor by default
Icon.native.tsx           react-native-svg — uses #201F24 by default
```

1. SVG files are dropped into `src/assets/`
2. The build script (`script/generate-icon-data.js`) parses each SVG and extracts viewBox + path data into a single `iconData.ts` file
3. The `Icon` component looks up the icon by name and renders the correct SVG elements for each platform

## Available icons

| Name | Source file | Description |
|------|-----------|-------------|
| `billDue` | icon-bill-due.svg | Bill due indicator (red) |
| `billPaid` | icon-bill-paid.svg | Bill paid indicator (green) |
| `caretDown` | icon-caret-down.svg | Dropdown arrow |
| `caretLeft` | icon-caret-left.svg | Left navigation arrow |
| `caretRight` | icon-caret-right.svg | Right navigation arrow |
| `closeModal` | icon-close-modal.svg | Modal close button |
| `ellipsis` | icon-ellipsis.svg | Three-dot menu |
| `filterMobile` | icon-filter-mobile.svg | Mobile filter toggle |
| `hidePassword` | icon-hide-password.svg | Password visibility off |
| `logoLarge` | logo-large.svg | App logo (full) |
| `logoSmall` | logo-small.svg | App logo (compact) |
| `minimizeMenu` | icon-minimize-menu.svg | Sidebar collapse |
| `navBudgets` | icon-nav-budgets.svg | Tab: Budgets |
| `navOverview` | icon-nav-overview.svg | Tab: Overview |
| `navPots` | icon-nav-pots.svg | Tab: Pots |
| `navRecurringBills` | icon-nav-recurring-bills.svg | Tab: Recurring Bills |
| `navTransactions` | icon-nav-transactions.svg | Tab: Transactions |
| `pot` | icon-pot.svg | Pot/savings icon |
| `recurringBills` | icon-recurring-bills.svg | Recurring bills icon |
| `search` | icon-search.svg | Search magnifying glass |
| `selected` | icon-selected.svg | Checkmark circle |
| `showPassword` | icon-show-password.svg | Password visibility on |
| `sortMobile` | icon-sort-mobile.svg | Mobile sort toggle |

## Adding a new icon

1. Drop the `.svg` file into `packages/icons/src/assets/`
   - Filename convention: `icon-my-name.svg` → icon name `myName`
   - Files prefixed with `logo-` keep the prefix: `logo-small.svg` → `logoSmall`
2. Run `pnpm icons` from the monorepo root (or `pnpm --filter @financial-app/icons generate`)
3. The new icon is immediately available with full TypeScript autocomplete

## API

### `<Icon>` component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `IconName` | (required) | Icon identifier |
| `size` | `12 \| 14 \| 16 \| 20 \| 24 \| 28 \| 32 \| 48` | `24` | Width & height in pixels |
| `color` | `string` | `'currentColor'` (web) / `'#201F24'` (native) | Fill color override |
| `accessibilityLabel` | `string` | — | If set, icon is announced by screen readers; otherwise `aria-hidden` |

Web and native implementations also accept pass-through props (`SVGProps` / `SvgProps`).

### Exports

```ts
import { Icon, iconNames } from '@financial-app/icons'
import type { IconName, IconSize, IIconProps } from '@financial-app/icons'
```

## Cross-platform

Platform routing follows the monorepo pattern via `package.json` exports:

- **Metro (native):** resolves `"react-native"` → `src/index.ts` → `Icon.native.tsx` (uses `react-native-svg`)
- **Vite (web):** resolves `"default"` → `src/index.web.ts` → `Icon.web.tsx` (uses DOM `<svg>`)

### Peer dependency

Native consumers must have `react-native-svg` installed:

```bash
pnpm --filter <app> add react-native-svg
```

## Scripts

```bash
pnpm icons                # Generate icon data (from monorepo root)
pnpm --filter @financial-app/icons generate   # Same, explicit
pnpm --filter @financial-app/icons type-check # TypeScript check
pnpm --filter @financial-app/icons lint       # ESLint
```
