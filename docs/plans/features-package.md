# Plan: @financial-app/features Package

> Intermediate package between `@financial-app/ui` (DS) and apps.
> Contains composed blocks — configured DS instances ready for use in pages.
> Must be created BEFORE wiring the Transactions page.

## Rationale

DS components are generic primitives (`DataTable`, `Modal`, `Card`, `Button`).
Pages need configured instances: a `TransactionsDataTable` with specific columns,
an `AddBudgetContent` form body for the modal service, a `PotCard` with progress bar
and action buttons.

These blocks are **platform-agnostic** — they compose DS components via props.
The DS handles the `.native.tsx` / `.web.tsx` split underneath. Blocks are single
`.tsx` files with no file extension split.

## Architecture

```
tokens -> tailwind-config -> ui (DS) -> features (blocks) -> apps (pages)
                                            ^
                                         shared (data, hooks, types, modal service)
```

## Dependency Rules

```
@financial-app/features -> @financial-app/ui (DS components)
@financial-app/features -> @financial-app/shared (types, useModal config, hooks)
@financial-app/features -> NO navigation imports (useRouter, useNavigate)
@financial-app/features -> NO data fetching (TanStack Query, fetch)
```

Blocks receive `data` + `callbacks` as props (Inversion of Control).
Apps connect data sources and navigation.

## Package Structure

```
packages/features/
  package.json              # @financial-app/features
  tsconfig.json
  src/
    transactions/
      TransactionsDataTable.tsx         # DataTable + columns + cells config
      useTransactionsColumns.ts         # column defs hook (shared logic)
      index.ts                          # barrel
    recurring-bills/
      RecurringBillsSummary.tsx          # Total Bills card + Summary (Paid/Upcoming/Due Soon)
      RecurringBillsTable.tsx            # DataTable + bill columns + status cells
      useRecurringBillsColumns.ts       # column defs hook
      index.ts
    budgets/
      BudgetCategoryCard.tsx            # Card + progress bar + "Latest Spending" list
      AddBudgetContent.tsx              # Form body: category dropdown + max spend + theme picker
      createAddBudgetModalConfig.ts     # IModalConfig factory for useModal().open()
      index.ts
    pots/
      PotCard.tsx                       # Card + progress + Add Money/Withdraw buttons
      AddPotContent.tsx                 # Form body for add pot modal
      AddMoneyContent.tsx               # Form body for add money modal
      WithdrawContent.tsx               # Form body for withdraw modal
      createPotModalConfigs.ts          # IModalConfig factories (add, edit, addMoney, withdraw)
      index.ts
    overview/
      OverviewPotsSection.tsx           # PotsOverview block (already exists in ui, may stay or move)
      OverviewTransactionsSection.tsx   # TransactionsOverview block
      OverviewBillsSection.tsx          # RecurringBillsOverview block
      OverviewBudgetsSection.tsx        # DonutChart + spending summary
      index.ts
    index.ts                            # public barrel
```

## Block Patterns

### 1. DataTable blocks (TransactionsDataTable, RecurringBillsTable)

```tsx
// packages/features/src/transactions/TransactionsDataTable.tsx

import { DataTable, AvatarNameCell, AmountCell, DateCell, SimpleCell } from '@financial-app/ui'
import { useTransactionsColumns } from './useTransactionsColumns'

import type { ITransaction } from '@financial-app/shared'

interface ITransactionsDataTableProps {
  /** Transaction data array */
  transactions: readonly ITransaction[]
  /** Loading state */
  loading?: boolean
  /** Called when a row is pressed/clicked */
  onRowPress?: (transactionId: string) => void
}

export function TransactionsDataTable({
  transactions,
  loading,
  onRowPress,
}: Readonly<ITransactionsDataTableProps>) {
  const columns = useTransactionsColumns()

  return (
    <DataTable
      data={transactions}
      columns={columns}
      loading={loading}
      onRowPress={onRowPress ? (row) => onRowPress(row.original.id) : undefined}
      searchPlaceholder="Search transaction"
    />
  )
}
```

### 2. Modal content blocks (AddBudgetContent + config factory)

The app uses a **single Modal instance** driven by `modalConfigAtom` (Jotai).
Content blocks provide the `body` ReactNode + a config factory for `useModal().open()`.

```tsx
// packages/features/src/budgets/AddBudgetContent.tsx
// ONLY the body content — form fields, no Modal wrapper

import { TextInput, Dropdown } from '@financial-app/ui'

interface IAddBudgetContentProps {
  /** Current form values */
  values: IBudgetFormData
  /** Field change handler */
  onChange: (field: keyof IBudgetFormData, value: string) => void
}

export function AddBudgetContent({
  values,
  onChange,
}: Readonly<IAddBudgetContentProps>) {
  return (
    <>
      <Dropdown
        label="Budget Category"
        value={values.category}
        onChange={(v) => onChange('category', v)}
        options={CATEGORY_OPTIONS}
      />
      <TextInput
        label="Maximum Spend"
        prefix="$"
        value={values.maxSpend}
        onChangeText={(v) => onChange('maxSpend', v)}
      />
      <Dropdown
        label="Theme"
        value={values.theme}
        onChange={(v) => onChange('theme', v)}
        options={THEME_OPTIONS}
      />
    </>
  )
}
```

```tsx
// packages/features/src/budgets/createAddBudgetModalConfig.ts

import type { IModalConfig } from '@financial-app/shared'

export function createAddBudgetModalConfig(
  body: ReactNode,
  onSubmit: () => void,
): IModalConfig {
  return {
    title: 'Add New Budget',
    description: 'Choose a category to set a spending budget. These categories can help you monitor spending.',
    body,
    actions: [{ label: 'Add Budget', variant: 'primary', onPress: onSubmit }],
  }
}
```

```tsx
// App usage (page level)
const { open, close } = useModal()
const [values, setValues] = useState(INITIAL_BUDGET_FORM)

const handleOpen = () => {
  open(createAddBudgetModalConfig(
    <AddBudgetContent values={values} onChange={handleChange} />,
    handleSubmit,
  ))
}
```

### 3. Card blocks (PotCard, BudgetCategoryCard)

```tsx
// packages/features/src/pots/PotCard.tsx

import { Card, Typography, Button, ColorDot } from '@financial-app/ui'

import type { IPot } from '@financial-app/shared'

interface IPotCardProps {
  /** Pot data */
  pot: IPot
  /** Called when "+ Add Money" is pressed */
  onAddMoney: () => void
  /** Called when "Withdraw" is pressed */
  onWithdraw: () => void
  /** Called when the ellipsis menu is pressed */
  onMenuPress: () => void
}

export function PotCard({
  pot,
  onAddMoney,
  onWithdraw,
  onMenuPress,
}: Readonly<IPotCardProps>) {
  const percentage = ((pot.total / pot.target) * 100).toFixed(1)
  // ... renders Card + ColorDot + Typography + progress bar + Buttons
}
```

## What Stays in ui vs What Moves to features

| Component | Package | Reason |
|-----------|---------|--------|
| DataTable, Modal, Card, Button, ... | ui | Generic DS primitives |
| TransactionsOverview, PotsOverview, ... | ui | DS organisms (summary blocks for Overview page) |
| TransactionsDataTable | features | Configured DataTable instance with specific columns |
| RecurringBillsTable | features | Configured DataTable instance |
| AddBudgetContent | features | Modal body content |
| PotCard (full page version) | features | Composed block with actions |
| BudgetCategoryCard | features | Composed block with progress + latest spending |

Note: the existing Overview organisms (PotsOverview, TransactionsOverview, RecurringBillsOverview)
stay in ui for now — they are self-contained summary blocks. The overview/ feature slice is
optional and can be revisited if those organisms grow to need data/callbacks.

## package.json

```json
{
  "name": "@financial-app/features",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./transactions": { "react-native": "./src/transactions/index.ts", "default": "./src/transactions/index.ts" },
    "./recurring-bills": { "react-native": "./src/recurring-bills/index.ts", "default": "./src/recurring-bills/index.ts" },
    "./budgets": { "react-native": "./src/budgets/index.ts", "default": "./src/budgets/index.ts" },
    "./pots": { "react-native": "./src/pots/index.ts", "default": "./src/pots/index.ts" }
  },
  "react-native": "./src/index.ts",
  "dependencies": {
    "@financial-app/ui": "workspace:^",
    "@financial-app/shared": "workspace:^"
  },
  "peerDependencies": {
    "react": "catalog:"
  }
}
```

## Scaffold Steps

1. Create `packages/features/` directory + `package.json` + `tsconfig.json`
2. Add `@financial-app/features` as dependency to mobile-expo and web apps
3. Create `src/transactions/` — TransactionsDataTable + useTransactionsColumns + barrel
4. Wire into Transactions page (both apps)
5. Create remaining feature slices as pages are built

## Completion Criteria

- [ ] Package created, installs, type-checks
- [ ] TransactionsDataTable renders in Storybook (features story)
- [ ] TransactionsDataTable wired into web Transactions route
- [ ] TransactionsDataTable wired into mobile-expo Transactions screen
- [ ] No navigation or data-fetching imports inside features/
