# Track B — UI Components for Auth & Overview Routes

## Goal

Build all reusable UI components needed by the login/signup and overview (home)
screens in `packages/ui/`, with Storybook visual testing — independently of the
routing/infrastructure work happening in Track A (Phase 7 steps).

## Status: TODO (can start immediately — no dependency on Track A)

## Scope: `packages/ui/` only — never touch `apps/`

---

## Prerequisites

### P1 — Storybook Setup

Install and configure Storybook inside `packages/ui/`.

**Framework choice: `@storybook/react-native-web-vite`**

This is the officially recommended Storybook framework for React Native projects
that want browser-based Storybook. It differs from plain `@storybook/react-vite`:
- Built-in `react-native-web` aliasing — handles any `react-native` imports automatically
- Our `.web.tsx` files (pure HTML) render as-is, no aliasing needed for them
- Our `.native.tsx` files CAN also be rendered via react-native-web (future: side-by-side stories)
- Same Vite-based DX, supports all 500+ Storybook addons
- Requirements: RN >= 0.72 (we have 0.81), Vite >= 5 (we have 8)

Reference:
- https://storybook.js.org/docs/get-started/frameworks/react-native-web-vite
- https://github.com/storybookjs/react-native

**Packages (add to pnpm catalog first):**
```
storybook                              ^10.3.5
@storybook/react-native-web-vite      ^10.3.5
react-native-web                       ^0.19.13
```

**Install in packages/ui/ as devDependencies:**
```
storybook, @storybook/react-native-web-vite, react-native-web, react-dom, vite, postcss, autoprefixer, tailwindcss
```

**Files to create:**
```
packages/ui/
  .storybook/
    main.ts              # framework: @storybook/react-native-web-vite + viteFinal for .web.tsx priority
    preview.ts           # import token CSS vars + storybook.css, layout: centered
    storybook.css        # @tailwind base/components/utilities + body font
  postcss.config.cjs     # tailwindcss + autoprefixer
  tailwind.config.cjs    # extends @financial-app/tailwind-config, content: .web.tsx + variants
```

**Key config — .storybook/main.ts:**
```ts
import type { StorybookConfig } from '@storybook/react-native-web-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-native-web-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  // Prioritize .web.tsx so stories render web implementations by default.
  // The framework already aliases react-native → react-native-web,
  // so .native.tsx files could also be rendered if explicitly imported.
  viteFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    }
    return config
  },
}

export default config
```

**Story imports:**
Stories import from `@financial-app/ui` which resolves to `index.web.ts` via the
`exports` map `"default"` condition. This means stories render `.web.tsx` files.

To test the native implementation in the same Storybook (future enhancement):
```tsx
// Button.stories.tsx — optional native variant
import { Button as ButtonNative } from './Button.native'
export const NativePreview: Story = { render: () => <ButtonNative ... /> }
```
This works because `react-native-web` handles the RN primitives. Note: `twrnc`
styles may not render perfectly in react-native-web — visual fidelity for native
is best checked on a real device/simulator.

**Scripts:**
- `packages/ui/package.json`: `"storybook": "storybook dev -p 6006"`, `"storybook:build": "storybook build -o storybook-static"`
- Root `package.json`: `"storybook": "pnpm --filter @financial-app/ui storybook"`
- `turbo.json`: add `storybook` task with `dependsOn: ["^build"]`, `cache: false`, `persistent: true`

**Add to .gitignore:** `storybook-static/`

**Verify:** `pnpm build && pnpm storybook` — Storybook opens at localhost:6006.

### P2 — Button Refactor

Existing Button needs 4 Figma variants (currently has primary/secondary/outline):

| Variant | Figma | Token mapping |
|---------|-------|---------------|
| `primary` | Dark (grey-900 bg, white text) | `bg-grey-900 text-white` |
| `secondary` | Beige (beige-100 bg, grey-900 text) | `bg-beige-100 text-grey-900` |
| `tertiary` | Text only + arrow icon, no bg | `bg-transparent text-grey-500` |
| `destroy` | Red bg, white text | `bg-red text-white` |

Also add `fullWidth: { true: 'w-full' }` variant for auth form buttons.

Update story with all 4 variants + hover states (web only).

---

## Wave 1 — Auth Primitives (unblocks login/signup routes)

### Component Inventory

| # | Component | Props | Variants | Used on |
|---|-----------|-------|----------|---------|
| 1 | **TextInput** | label, value, onChange, placeholder, helperText, error, icon?, prefix? | size: sm/md, error: true/false | Login (Email), Signup (Name, Email) |
| 2 | **PasswordInput** | label, value, onChange, helperText, error | size: sm/md, error: true/false | Login (Password), Signup (Create Password) |
| 3 | **LinkText** | text, linkLabel, onLinkPress | — (no CVA, inline styling) | "Need to create an account? Sign Up" |
| 4 | **AuthCard** | title, children (form content), footer (LinkText) | — (container, no variants) | Login form card, Signup form card |
| 5 | **AuthLayout** | children (AuthCard), illustrationSrc? | — (responsive layout wrapper) | Login screen, Signup screen |

### Dependencies

```
TextInput ← (none)
PasswordInput ← TextInput (wraps it with eye toggle)
LinkText ← (none)
AuthCard ← (none)
AuthLayout ← (none, but renders AuthCard as children)
```

### Creation order

```
1. TextInput       (independent)
2. PasswordInput   (uses TextInput internally)
3. LinkText        (independent)
4. AuthCard        (independent)
5. AuthLayout      (independent)
```

### Component Details

#### TextInput
- **Native**: `TextInput` from react-native, `View` wrapper, `Text` for label/helper
- **Web**: `<label>`, `<input>`, `<span>` for helper, optional `<span>` for icon/prefix
- **Variants**: base input style (border, rounded, padding), error state (red border, red helper)
- **Props**: `label: string`, `value: string`, `onChangeText: (text: string) => void`, `placeholder?: string`, `helperText?: string`, `error?: boolean`, `icon?: ReactNode` (web) / icon name (native), `prefix?: string`

#### PasswordInput
- **Native**: wraps TextInput with `secureTextEntry` toggle + eye icon Pressable
- **Web**: wraps TextInput with `type="password"` toggle + eye icon button
- **Props**: same as TextInput minus `icon`/`prefix`, adds `showToggle?: boolean`

#### LinkText
- **Native**: `Text` with nested `Text` (underlined, bold) + onPress
- **Web**: `<p>` with `<a>` or `<button>` for the link portion
- **Props**: `text: string`, `linkLabel: string`, `onLinkPress: () => void`

#### AuthCard
- **Native**: `View` with white bg, rounded corners, padding, shadow
- **Web**: `<div>` with white bg, rounded-xl, padding, shadow-lg
- **Props**: `title: string`, `children: ReactNode`, `footer?: ReactNode`

#### AuthLayout
- **Desktop web**: 2-column — left illustration panel (dark bg, image, tagline), right form
- **Tablet web**: logo banner top, centered form below
- **Mobile (native + web)**: logo banner top, centered form below
- **Props**: `children: ReactNode` (the AuthCard)
- **Note**: illustration image is web-only (desktop breakpoint); mobile just has the logo banner
- **Mockup reference**: `files/proto/screen and readme/connection/login.png` (desktop + tablet), `Mobile - Login - Bonus.png` (mobile)

---

## Wave 2 — Overview Primitives (unblocks home route)

### Component Inventory

| # | Component | Props | Variants | Used on |
|---|-----------|-------|----------|---------|
| 6 | **ColorDot** | color (token name) | size: sm/md | Pots, Budgets, Selects |
| 7 | **Avatar** | src?, name, bgColor? | size: sm/md/lg | Transactions, Recurring Bills |
| 8 | **Divider** | — | — | List separators |
| 9 | **SectionLink** | title, linkLabel, onPress | — | "Pots — See Details >" |
| 10 | **BalanceCard** | label, amount | variant: primary (dark)/secondary (light) | Overview top row |
| 11 | **StatCard** | label, amount | — | Income / Expenses |
| 12 | **TransactionRow** | avatar (src+name+bgColor), name, category?, date, amount | — | Overview, Transactions |
| 13 | **BillSummaryRow** | label, amount, borderColor (token) | — | Overview recurring bills |
| 14 | **SpendingSummaryRow** | color (token), category, spent, maximum | — | Budgets spending summary |
| 15 | **DonutChart** | segments: { color, value }[], centerLabel, centerSub | — | Budgets |

### Dependencies

```
ColorDot       ← (none)
Avatar         ← (none)
Divider        ← (none)
SectionLink    ← (none)
BalanceCard    ← (none)
StatCard       ← (none)
TransactionRow ← Avatar
BillSummaryRow ← (none)
SpendingSummaryRow ← ColorDot
DonutChart     ← (none, SVG-based)
```

### Creation order

```
Parallel batch A: ColorDot, Avatar, Divider, SectionLink
Parallel batch B: BalanceCard, StatCard, BillSummaryRow
Sequential (has deps): TransactionRow (needs Avatar), SpendingSummaryRow (needs ColorDot)
Independent: DonutChart (complex, can start anytime)
```

### Component Details

#### ColorDot
- **Both**: small circle with background color from token
- **Variants**: `size: { sm: 'w-2 h-2', md: 'w-3 h-3' }`, color passed as prop (applied via style, not variant)
- **Props**: `color: string` (token color name), `size?: 'sm' | 'md'`

#### Avatar
- **Native**: `Image` (if src) or `View` + `Text` (initials) with bgColor, circular
- **Web**: `<img>` (if src) or `<div>` + initials, circular
- **Variants**: `size: { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' }`
- **Props**: `src?: string`, `name: string` (for alt + initials fallback), `bgColor?: string`

#### Divider
- **Native**: `View` with 1px height, grey-100 bg
- **Web**: `<hr>` with border-grey-100
- **No variants**

#### SectionLink
- **Native**: `View` (flex-row, space-between) + `Text` title + `Pressable` + `Text` link + chevron
- **Web**: `<div>` flex + `<h2>` + `<a>` link with arrow
- **Props**: `title: string`, `linkLabel: string`, `onPress: () => void`

#### BalanceCard
- **Native**: `View` dark bg (grey-900), white text, rounded
- **Web**: `<div>` same
- **Variants**: `variant: { primary: 'bg-grey-900 text-white', secondary: 'bg-beige-100 text-grey-900' }`
- **Props**: `label: string` ("Current Balance"), `amount: string` ("$4,836.00")

#### StatCard
- **Native/Web**: light bg card (white), label on top, large amount below
- **Props**: `label: string` ("Income"/"Expenses"), `amount: string`

#### TransactionRow
- **Native**: `View` flex-row: Avatar + (name + category? stacked) + (amount + date stacked)
- **Web**: same layout with `<div>` flex
- **Props**: `avatar: { src?: string, name: string, bgColor?: string }`, `name: string`, `category?: string`, `date: string`, `amount: number` (positive = green, negative = dark)

#### BillSummaryRow
- **Native**: `View` with 4px left border (colored), bg beige-100, label + amount
- **Web**: `<div>` same pattern
- **Props**: `label: string`, `amount: string`, `borderColor: string` (token name)

#### SpendingSummaryRow
- **Native/Web**: ColorDot + category name + "$X.XX" bold + "of $Y.YY" grey
- **Props**: `color: string`, `category: string`, `spent: number`, `maximum: number`

#### DonutChart
- **Native**: `react-native-svg` (Svg, Path, Circle, Text)
- **Web**: `<svg>` with arc paths
- **Props**: `segments: { color: string, value: number }[]`, `centerLabel: string` ("$338"), `centerSub: string` ("of $975 limit")
- **Note**: calculate arc angles from segment values, render as SVG paths

---

## Wave 3 — Overview Sections (compose Wave 2 components)

| # | Component | Composition | Props |
|---|-----------|-------------|-------|
| 16 | **PotsOverview** | SectionLink + TotalSaved (icon+amount) + 4x (ColorDot+name+amount) in 2-col grid | `totalSaved: number`, `pots: { name: string, total: number, theme: string }[]` |
| 17 | **TransactionsOverview** | SectionLink + 5x TransactionRow + Dividers | `transactions: ITransaction[]` |
| 18 | **BudgetsOverview** | SectionLink + DonutChart + 4x SpendingSummaryRow | `budgets: IBudget[]`, `totalSpent: number`, `totalLimit: number` |
| 19 | **RecurringBillsOverview** | SectionLink + 3x BillSummaryRow (Paid/Upcoming/Due Soon) | `paid: number`, `upcoming: number`, `dueSoon: number` |

### Dependencies

```
PotsOverview          ← SectionLink, ColorDot
TransactionsOverview  ← SectionLink, TransactionRow, Divider
BudgetsOverview       ← SectionLink, DonutChart, SpendingSummaryRow
RecurringBillsOverview ← SectionLink, BillSummaryRow
```

All 4 are independent of each other (only depend on Wave 2).

---

## Process per Component

```
Step 1: DESIGN
  - Read Figma mockup(s) for the component
  - Identify exact props, variants, token colors, spacing
  - Confirm with user if ambiguous

Step 2: CREATE — /new-component
  - Variant file (if applicable)
  - Types file (.tsx — props interface only)
  - Native implementation (.native.tsx)
  - Web implementation (.web.tsx)
  - Barrel files (index.ts + index.web.ts)
  - Register in src/index.ts + src/index.web.ts

Step 3: STORY — /story
  - Playground story (interactive args)
  - Showcase story (all variants/states in one render)
  - Named stories for notable states

Step 4: CHECK
  - pnpm type-check && pnpm lint && pnpm test

Step 5: VALIDATE (user)
  - User runs `pnpm storybook`
  - Compare visual output against Figma mockup
  - Approve or request adjustments

Step 6: REVIEW — /review (per wave, not per component)
  - Multi-agent review on all wave files
  - Fix critical/high findings
  - Re-check

Step 7: COMMIT — /commit
  - One commit per wave (or per component if large)
  - Conventional commit: `feat(ui): add TextInput component`
```

---

## Agent Orchestration

### Phase 1: Setup (sequential, single agent)

```
Agent-Setup:
  1. Set up Storybook (P1)
  2. Refactor Button variants (P2)
  3. Update /story skill for Storybook v10 imports
  4. Commit + verify: pnpm build && pnpm storybook
```

### Phase 2: Wave 1 — Auth Primitives (sequential, deps between some)

```
Agent-Auth:
  1. TextInput → story → check
  2. PasswordInput → story → check
  3. LinkText → story → check
  4. AuthCard → story → check
  5. AuthLayout → story → check
  6. /review on all 5 components
  7. User validates in Storybook
  8. /commit
```

### Phase 3: Wave 2 — Overview Primitives (parallel batches)

```
Batch A (4 independent agents in worktrees):
  Agent-A1: ColorDot → story
  Agent-A2: Avatar → story
  Agent-A3: Divider → story
  Agent-A4: SectionLink → story

→ Merge all 4 → check → commit

Batch B (3 independent agents in worktrees):
  Agent-B1: BalanceCard → story
  Agent-B2: StatCard → story
  Agent-B3: BillSummaryRow → story

→ Merge all 3 → check → commit

Sequential (dependencies):
  Agent-C1: TransactionRow (needs Avatar) → story → check
  Agent-C2: SpendingSummaryRow (needs ColorDot) → story → check
  Agent-C3: DonutChart (complex, independent) → story → check

→ /review on all Wave 2 → user validates → commit
```

### Phase 4: Wave 3 — Overview Sections (4 independent agents)

```
Batch D (4 independent agents in worktrees):
  Agent-D1: PotsOverview → story
  Agent-D2: TransactionsOverview → story
  Agent-D3: BudgetsOverview → story
  Agent-D4: RecurringBillsOverview → story

→ Merge all 4 → check → /review → user validates → commit
```

### Worktree merge strategy

Each worktree agent creates the component files (new files, no conflicts) but
also appends to `src/index.ts` and `src/index.web.ts` (conflict zone).

**Solution**: worktree agents create component files only. After merge, a
single sequential agent registers all new components in the barrel files.

---

## Mockup Reference Map

| Component | Primary mockup |
|-----------|----------------|
| TextInput | `elements/InputFields.png`, `Mobile - Login - Bonus.png` |
| PasswordInput | `Mobile - Login - Bonus.png`, `connection/login.png` |
| LinkText | `Mobile - Login - Bonus.png`, `Mobile - Sign Up - Bonus.png` |
| AuthCard | `connection/login.png`, `connection/signup.png` |
| AuthLayout | `connection/login.png` (desktop+tablet), `Mobile - Login - Bonus.png` |
| ColorDot | `Mobile - Pots.jpg`, `Mobile - Budget.jpg` |
| Avatar | `Mobile - Home.jpg` (transactions), `elements/Company_and_person_name.png` |
| Divider | `Mobile - Home.jpg` (between transaction rows) |
| SectionLink | `Mobile - Home.jpg` ("Pots — See Details >") |
| BalanceCard | `Mobile - Home.jpg` (dark card top), `Desktop - Home.jpg` |
| StatCard | `Mobile - Home.jpg` (Income/Expenses), `Desktop - Home.jpg` |
| TransactionRow | `Mobile - Home.jpg`, `Desktop - Transactions.jpg` |
| BillSummaryRow | `Mobile - Home.jpg` (Recurring Bills section), `Desktop - Recurring Bills.png` |
| SpendingSummaryRow | `Mobile - Budget.jpg` (Spending Summary), `Desktop - Budget.png` |
| DonutChart | `Mobile - Home.jpg` (Budgets), `Desktop - Budget.png` |
| PotsOverview | `Mobile - Home.jpg` (Pots section), `Desktop - Home.jpg` |
| TransactionsOverview | `Mobile - Home.jpg` (Transactions section) |
| BudgetsOverview | `Mobile - Home.jpg` (Budgets section) |
| RecurringBillsOverview | `Mobile - Home.jpg` (Recurring Bills section) |

---

## Completion Criteria

- [ ] Storybook runs at localhost:6006 with token colors + Tailwind
- [ ] Button refactored with 4 Figma variants + fullWidth
- [ ] All 19 components created following file extension split pattern
- [ ] All 19 components have Storybook stories (Playground + Showcase)
- [ ] All components visually match Figma mockups in Storybook
- [ ] Multi-agent review passes (verdict: ready) for each wave
- [ ] `pnpm type-check && pnpm lint && pnpm test` passes from root
- [ ] Each wave committed with conventional commit message

## Convergence with Track A

When Track A completes Phase 7 (routes with placeholder content) and Track B
completes all waves, the two tracks converge:

1. Import real components into route files (replace placeholders)
2. Wire mock data props from loaders/atoms into component props
3. Visual test on iOS simulator + web browser
4. Final review + commit
