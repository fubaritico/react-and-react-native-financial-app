# DataTable Implementation Plan

## Goal

Build a cross-platform, composable DataTable component powered by `@tanstack/react-table`
for the Transactions and Recurring Bills screens. The design follows a **cell factory pattern**
inspired by the Odaseva reference project, adapted for our file extension split architecture.

## Prerequisites

Before starting this plan, the following components MUST exist:

- **Dropdown** — compound component used in ActionBar `leftActions` (Sort dropdown, Category dropdown).
  Without it, ActionBar can only render the search input.
- **DataTablePagination** — Step 6 of this plan creates it, but the Pagination atom
  (prev/next buttons, page numbers) is a dependency. Create the Pagination component first
  as a standalone molecule, then DataTablePagination composes it with TanStack Table state.

Order: **Dropdown → Pagination → DataTable**

## Reference

- Odaseva DataTable: HOF cell factories + `useColumnsDefinition` hooks + `<table>` rendering
  - Source: `/Users/stephanecottereau/Desktop/WebstormProjects/Odaseva/react/odaseva-platform/src/components/components/DataTable/`
  - Example: `/Users/stephanecottereau/Desktop/WebstormProjects/Odaseva/react/odaseva-platform/src/components/organisms/DataTableExample/`

## Screen Specifications

> Open these files to see exact icons, spacing, colors, typography, and layout.

### Transactions

**Desktop** — `files/proto/screen and readme/Desktop - Transactions.jpg`
- ActionBar: search input (rounded, border, magnifying glass icon right) + "Sort by" label + "Latest" dropdown (border, chevron down) + "Category" label + "All Transactions" dropdown (border, chevron down)
- Column headers: "Recipient / Sender" | "Category" | "Transaction Date" | "Amount" — muted text, smaller size, left-aligned (Amount right-aligned)
- Rows: ~54px height, border-bottom separator, no row background
  - Col 1: circular avatar (~40px) + name (body-bold, foreground)
  - Col 2: category text (body, foreground)
  - Col 3: date "19 Aug 2024" (body, foreground)
  - Col 4: amount right-aligned — positive "+$75.50" (green/transaction-positive), negative "-$55.50" (foreground, body-bold)
- Pagination: bottom, full width — [< Prev] centered [1] [2] [3] [4] [5] [Next >]
  - Active page: dark bg (#201F24), white text, rounded
  - Inactive: border, rounded, foreground text
  - Prev/Next: border, rounded, arrow icon + text

**Tablet** — `files/proto/screen and readme/Tablet - Transactions.jpg`
- ActionBar: same as desktop — search + "Sort by" + "Latest" dropdown + "Category" + "All Transactions" dropdown, all inline, slightly more compact
- Column headers: same 4 columns, "Transaction Date" wraps to 2 lines
- Rows: same structure as desktop, avatars same size
- Pagination: same as desktop — Prev [1][2][3][4][5] Next

**Mobile** — `files/proto/screen and readme/Mobile - Transactions.jpg`
- ActionBar: search input (shorter) + sort icon button (square, bordered) + filter icon button (square, bordered) — NO text labels, NO inline dropdowns
- NO column headers
- Rows: stacked layout
  - Left: avatar (~40px) + vertical stack (name body-bold + category caption muted)
  - Right: vertical stack (amount body-bold right-aligned + date caption muted right-aligned)
  - Positive amount in green, negative in foreground
- Pagination: compact — [<] [1] [2] [...] [5] [>] — no Prev/Next text, just arrows

### Recurring Bills

**Desktop** — `files/proto/screen and readme/Desktop - Recurring Bills.png`
- ActionBar: search input "Search bills" + "Sort by" label + "Latest" dropdown — NO category dropdown
- Column headers: "Bill Title" | "Due Date" | "Amount" — muted text
- Rows: ~54px height, border-bottom
  - Col 1: colored avatar circle (~40px, theme color border-left-4px visible on the row) + name (body-bold)
  - Col 2: "Monthly -2nd" (teal/green text) + small status icon (green checkmark = paid, red exclamation = due soon)
  - Col 3: amount right-aligned (foreground), due-soon amounts in red
- NO pagination
- Colored left border on each row: green for paid, varies by bill status

**Tablet** — `files/proto/screen and readme/Tablet - Recurring Bills.jpg`
- ActionBar: same as desktop — search + Sort by + Latest dropdown
- Column headers: "Bill Title" | "Due Date" | "Amount"
- Rows: same as desktop — avatar + name | "Monthly -Xth" + status icon | amount
- Status icon: green checkmark (paid), red exclamation (due soon)
- Due-soon rows: "Monthly -5th" in red text + red exclamation, amount in red
- Paid rows: "Monthly -1st" in teal/green + green checkmark
- NO pagination

**Mobile** — `files/proto/screen and readme/Mobile - Recurring Bills.jpg`
- ActionBar: search input + sort icon button — NO filter icon (only 1 action)
- NO column headers
- Rows: stacked layout
  - Left: colored avatar circle (~40px)
  - Center: vertical stack (name body-bold + "Monthly -Xth" in teal or red + status icon inline)
  - Right: amount (body-bold, right-aligned)
- Status colors: paid = teal text + green checkmark, due soon = red text + red exclamation
- NO pagination

## Layout Matrix

Both web and native are responsive — the same 3 breakpoints apply on ALL platforms.

| | Phone (<768) | Tablet (768-1024) | Desktop (>1024) |
|---|---|---|---|
| **Transactions** | Stacked rows, no headers, pagination | Columnar, headers, pagination | Columnar + filters inline, headers, pagination |
| **Recurring Bills** | Stacked rows, no headers, no pagination | Columnar, headers, no pagination | Columnar + filters inline, headers, no pagination |

**Phone** (native + web mobile): compact/stacked layout — no column headers, data stacks
vertically in each row. Search + filter icons only (no inline dropdowns).

**Tablet** (native + web tablet): columnar layout — column headers, horizontal cells.
Search + Sort dropdown inline.

**Desktop** (web only): columnar layout — same as tablet but wider, all filters inline
(Search + Sort dropdown + Category dropdown for Transactions).

---

## Architecture

### Core Principle: Headless State + Composable Cells

```
@tanstack/react-table (headless)
  = state engine for sorting, filtering, pagination on ALL platforms

Cell factories (HOF pattern)
  = cross-platform content renderers using Typography, Avatar, Icon atoms
  = return content only — no <td> or <View> wrapper

DataTable (organism)
  = platform-specific structural shell
  = wraps cell output in <td> (web) or <View> (native)
  = handles columnar vs compact rendering on both platforms
  = contains built-in ActionBar (search + filters toolbar)
```

### ActionBar — Built-In Toolbar

ActionBar is a **sub-component inside DataTable**, not a separate screen-level concern.
It renders above the table with three modes (same pattern as the Odaseva reference):

1. **Default**: `leftActions` array + built-in search input → renders the standard ActionBar
2. **Custom**: `actionBar` prop → fully replaces the default ActionBar
3. **Hidden**: `noActionBar={true}` → no toolbar at all

```
┌─────────────────────────────────────────────────────┐
│ ActionBar                                           │
│  ┌──────────────┐  ┌──────────┐   ┌──────────────┐  │
│  │ leftActions[0]│  │ ...[1]   │   │  Search 🔍   │  │
│  └──────────────┘  └──────────┘   └──────────────┘  │
├─────────────────────────────────────────────────────┤
│ Table header / rows / pagination                    │
└─────────────────────────────────────────────────────┘
```

**Layout per breakpoint (from Figma):**

| | Phone (<768) | Tablet (768-1024) | Desktop (>1024) |
|---|---|---|---|
| **Transactions** | Search + sort icon + filter icon | Search + Sort dropdown + Category dropdown | Search + Sort dropdown + Category dropdown |
| **Recurring Bills** | Search + sort icon | Search + Sort dropdown | Search + Sort dropdown |

On phone, `leftActions` collapses to icon buttons (sort/filter toggles that open
a bottom sheet or dropdown). On tablet/desktop, `leftActions` renders full dropdowns inline.
This responsive behavior is handled by the consumer — they pass different elements
per breakpoint, or pass responsive components that adapt themselves.

**ActionBar is cross-platform** — uses our existing `TextInput` atom (resolves per platform
via barrel files) and follows the same file extension split as all other components.

### Cell Factory Pattern

All data cell factories follow the same HOF signature:

```typescript
const CellFactory =
  (...configParams) =>
  <TData,>({ row }: { row: Row<TData> }) => ReactElement
```

Header cell factories receive column context:

```typescript
const HeaderFactory =
  (...configParams) =>
  <TData,>({ column }: { column: Column<TData, unknown> }) => ReactElement
```

Factories return **content only** — cross-platform atoms (Typography, Avatar, Icon).
DataTable wraps the output in the appropriate container per platform.

**Important: raw value vs display.** TanStack Table separates state from rendering:
- `accessorKey` / `accessorFn` → extracts the **raw value** (number, ISO date, string)
  used by sorting, filtering, and pagination logic
- `cell` factory → renders the **display string** (formatted currency, formatted date, etc.)
  This is purely visual — it does NOT affect sort order or filter matching.

Example: `amount: -55.50` (raw) → sorts numerically → renders as `"-$55.50"` (display).
`date: "2024-08-19T00:00:00Z"` (raw) → sorts chronologically → renders as `"19 Aug 2024"` (display).

### Column Definition Hooks

Column definitions compose cell factories into a table configuration:

```typescript
function useTransactionColumns(): ColumnDef<ITransaction>[] {
  return [
    {
      accessorKey: 'name',
      header: SortableHeader('Recipient / Sender'),
      cell: AvatarNameCell('avatar', 'name'),
    },
    {
      accessorKey: 'category',
      header: SortableHeader('Category'),
      cell: SimpleCell('category'),
    },
    {
      accessorKey: 'date',
      header: SortableHeader('Transaction Date'),
      cell: DateCell('date'),
    },
    {
      accessorKey: 'amount',
      header: SortableHeader('Amount'),
      cell: AmountCell('amount'),
    },
  ]
}
```

Same hook works on both platforms — `SortableHeader` resolves to native or web via
barrel files, cell factories return cross-platform Typography/Avatar.

### Dual Rendering Mode (BOTH Platforms)

Both DataTable.web.tsx and DataTable.native.tsx implement the same responsive logic:

- **width >= breakpoint** (tablet/desktop): columnar rendering with headers + cells
- **width < breakpoint** (phone) + `renderCompactRow` provided: compact stacked layout
- **width < breakpoint** (phone) + no `renderCompactRow`: fallback to columnar (just narrower)

**Web detection**: `useState` + `ResizeObserver` on mount (or a `useMediaQuery` hook)
**Native detection**: `useWindowDimensions().width`

The same `renderCompactRow` prop drives both platforms — consumers provide it once,
and it works whether the user is on mobile Safari or an iPhone app.

---

## File Structure

```
packages/ui/src/components/
  organisms/
    DataTable/
      DataTable.tsx                       # IDataTableProps<TData> — shared types
      DataTable.native.tsx                # FlatList, dual mode (columnar/compact)
      DataTable.web.tsx                   # <table> + flexRender
      DataTable.variants.ts               # row/cell CVA (hover, borders, padding)
      DataTable.styles.ts                 # layout classes for inner elements
      DataTable.constants.ts              # DEFAULT_PAGE_SIZE, COMPACT_BREAKPOINT
      ActionBar/                          # built-in toolbar (search + filters)
        ActionBar.tsx                     # IActionBarProps — shared types
        ActionBar.native.tsx              # View flex-row layout
        ActionBar.web.tsx                 # div flex-row layout
        ActionBar.styles.ts               # layout classes
        index.ts / index.web.ts
      cells/
        SimpleCell.tsx                    # text/number display (Typography — JSX)
        AmountCell.tsx                    # colored currency (Typography + formatCurrency — JSX)
        DateCell.tsx                      # formatted date (Typography + formatDate — JSX)
        AvatarNameCell/                   # platform-split (layout container)
          AvatarNameCell.tsx
          AvatarNameCell.native.tsx
          AvatarNameCell.web.tsx
          index.ts / index.web.ts
        BillTitleCell/                    # platform-split (layout container)
          BillTitleCell.tsx
          BillTitleCell.native.tsx
          BillTitleCell.web.tsx
          index.ts / index.web.ts
        StatusCell/                       # platform-split (layout container)
          StatusCell.tsx
          StatusCell.native.tsx
          StatusCell.web.tsx
          index.ts / index.web.ts
        SortableHeader/                   # platform-split (interactive)
          SortableHeader.tsx
          SortableHeader.native.tsx
          SortableHeader.web.tsx
          index.ts / index.web.ts
        index.ts                          # barrel for all cell factories (native)
        index.web.ts                      # barrel for all cell factories (web)
      index.ts / index.web.ts             # DataTable barrel
  molecules/
    DataTablePagination/
      DataTablePagination.tsx             # IDataTablePaginationProps
      DataTablePagination.native.tsx      # compact: < [1] [2] ... [5] >
      DataTablePagination.web.tsx         # full: Prev [1][2][3][4][5] Next
      DataTablePagination.variants.ts     # page button styling
      index.ts / index.web.ts
```

---

## Props

### IDataTableProps<TData> (shared — DataTable.tsx)

`renderCompactRow` is a **shared prop** — both web and native are responsive and need
compact mode on small screens. The breakpoint logic is platform-specific:
- Web: CSS media query or `window.innerWidth` / ResizeObserver
- Native: `useWindowDimensions().width`

```typescript
import type { Table, Row } from '@tanstack/react-table'
import type { ComponentType, ReactElement } from 'react'

export interface IDataTableProps<TData> {
  /** TanStack Table instance — consumer owns all state (sorting, filtering, pagination) */
  table: Table<TData>

  // --- Loading & empty states ---

  /** When true, renders skeleton rows instead of data rows */
  loading?: boolean
  /** Skeleton row component rendered `pageSize` times when loading.
   *  Same pattern as Odaseva: DataTable doesn't own the skeleton shape —
   *  the consumer provides it so it matches the table's column layout. */
  rowsSkeleton?: ComponentType
  /** Message shown when !loading && rows.length === 0 (filtered to nothing, or empty data).
   *  Defaults to "No results." */
  emptyMessage?: string

  // --- Pagination ---

  /** Show DataTablePagination below the table.
   *  Only rendered when !loading && rowCount > pageSize. */
  pagination?: boolean

  // --- Row interaction ---

  /** Row press/click handler — receives the Row object */
  onRowPress?: (row: Row<TData>) => void

  // --- Responsive rendering ---

  /** Custom row renderer for phone/compact layout.
   *  When provided and screen width < compactBreakpoint, this replaces columnar rendering.
   *  Used on BOTH web (responsive) and native (phone vs tablet). */
  renderCompactRow?: (info: { row: Row<TData>; index: number }) => ReactElement
  /** Width threshold below which compact mode activates (default: 768).
   *  Applies to both platforms. */
  compactBreakpoint?: number

  // --- ActionBar props ---

  /** Custom component that fully replaces the default ActionBar.
   *  When provided, leftActions and onSearchChange are ignored. */
  actionBar?: ReactElement
  /** Hide the ActionBar entirely (no search, no filters) */
  noActionBar?: boolean
  /** Array of React elements rendered on the left side of the ActionBar
   *  (dropdowns, filter buttons, icon toggles, etc.).
   *  Consumer controls what goes here — DataTable just renders them in a flex row. */
  leftActions?: ReactElement[]
  /** Callback when the built-in search input value changes.
   *  Typically wired to table.setGlobalFilter(). */
  onSearchChange?: (value: string) => void
  /** Placeholder text for the built-in search input */
  searchPlaceholder?: string
}
```

### Rendering Logic (both DataTable.web.tsx and DataTable.native.tsx)

Same 3-state pattern as Odaseva reference:

```
if (loading && rowsSkeleton):
  → render pageSize skeleton rows (hide real data)

if (!loading && rows.length > 0):
  → render data rows (columnar or compact depending on width)

if (!loading && rows.length === 0):
  → render NoResults / emptyMessage (centered, spans full width)

Pagination:
  → render only when !loading && rowCount > pageSize && pagination
```

### IActionBarProps (ActionBar.tsx)

Internal sub-component — NOT exported from the package.

```typescript
export interface IActionBarProps {
  /** TanStack Table instance (for reading globalFilter state) */
  table: Table<unknown>
  /** Filter/action elements rendered on the left */
  leftActions?: ReactElement[]
  /** Search input change callback */
  onSearchChange?: (value: string) => void
  /** Search input placeholder */
  searchPlaceholder?: string
}
```

### IDataTablePaginationProps (DataTablePagination.tsx)

```typescript
export interface IDataTablePaginationProps {
  /** TanStack Table instance for page state */
  table: Table<unknown>
}
```

---

## Cell Factory Specifications

### SimpleCell

```
Signature: (keyName: string, variant?: TypographyVariant, color?: TypographyColor) => CellFn
Returns:   <Typography variant color>{row.getValue(keyName)}</Typography>
Data:      row.getValue(keyName)
Platform:  cross-platform (Typography atom)
```

### AmountCell

```
Signature: (keyName: string) => CellFn
Returns:   <Typography variant="body-bold" color={positive|negative}>{displayString}</Typography>
Raw value: row.getValue(keyName) → number (e.g. -55.50) — used by TanStack for numeric sorting
Display:   formatCurrency(amount) with explicit sign → "+$75.50" / "-$55.50"
           (standard Intl.NumberFormat doesn't add '+' — factory prepends it)
Color:     amount >= 0 → 'transaction-positive', < 0 → 'transaction-negative'
Platform:  cross-platform (Typography + formatCurrency from @financial-app/shared)
```

### DateCell

```
Signature: (keyName: string, format?: string) => CellFn
Returns:   <Typography variant="body" color="muted">{displayString}</Typography>
Raw value: row.getValue(keyName) → ISO string (e.g. "2024-08-19T00:00:00Z") — used by TanStack for chronological sorting
Display:   formatDate(date) → "19 Aug 2024" (human-readable)
Platform:  cross-platform (Typography + formatDate from @financial-app/shared)
```

### AvatarNameCell

```
Signature: (avatarKey: string, nameKey: string, subtitleKey?: string) => CellFn
Returns:   horizontal layout: Avatar + vertical(name Typography + optional subtitle Typography)
Data:      row.original[avatarKey], row.getValue(nameKey), row.getValue(subtitleKey)
Layout:    flex-row, gap-3, items-center (via .styles.ts shared classes)
Note:      Layout wrapper needed — this factory returns a fragment of atoms.
           DataTable.web.tsx wraps in <td>, DataTable.native.tsx wraps in <View>.
           Inner layout uses a container that must be cross-platform.
           Solution: return a <View> on native (via .native.tsx) and <div> on web (via .web.tsx)
           → AvatarNameCell needs platform split like SortableHeader.
Platform:  platform-split (layout container differs)
```

### BillTitleCell

```
Signature: (avatarKey: string, nameKey: string, themeKey: string) => CellFn
Returns:   horizontal layout: Avatar (with theme color border) + name Typography
Data:      row.original[avatarKey], row.getValue(nameKey), row.getValue(themeKey)
Layout:    same structure as AvatarNameCell but with colored avatar border
Platform:  platform-split (layout container)
```

### StatusCell

```
Signature: (dateKey: string, statusKey: string) => CellFn
Returns:   horizontal layout: "Monthly - {day}th" Typography + status Icon (checkmark/exclamation)
Data:      row.getValue(dateKey), row.getValue(statusKey) as 'paid' | 'upcoming' | 'due-soon'
Logic:     paid → green text + green checkmark icon
           upcoming → muted text, no icon
           due-soon → red text + red exclamation icon
Platform:  platform-split (layout container)
```

### SortableHeader

```
Signature: (label: string, align?: 'left' | 'right') => HeaderFn
Receives:  { column: Column<TData> } from TanStack
Returns:   clickable header with label + sort direction arrow icon
Logic:     column.toggleSorting() on press, column.getIsSorted() for arrow direction
Platform:  platform-split (Pressable on native, <button> on web)
```

---

## Steps

### Step 1 — Install @tanstack/react-table

Add to pnpm catalog and install in ui package and all consuming apps.

**Files to modify:**
- `pnpm-workspace.yaml` — add `@tanstack/react-table: ^8.21.3` to catalog
- `packages/ui/package.json` — add as dependency
- `apps/mobile-expo/package.json` — add as dependency
- `apps/web/package.json` — add as dependency

**Commands:**
```bash
# After editing catalog
pnpm install
pnpm type-check
```

**Completion:** `@tanstack/react-table` resolves in all three packages.

---

### Step 2 — Create cross-platform cell factories (simple)

Build cell factories that return content only using cross-platform atoms.
These have NO platform split — they return Typography, which resolves per platform.

**Files to create:**
- `packages/ui/src/components/organisms/DataTable/cells/SimpleCell.tsx`
- `packages/ui/src/components/organisms/DataTable/cells/AmountCell.tsx`
- `packages/ui/src/components/organisms/DataTable/cells/DateCell.tsx`

**Dependencies:** Typography atom, formatCurrency/formatDate from @financial-app/shared.
If these utilities don't exist yet, create them in `packages/shared/src/utils/` as part of this step.
Same for the `ITransaction` / `IRecurringBill` types used in column definition hooks.

**Pattern for each:**
```typescript
import type { Row } from '@tanstack/react-table'

// SimpleCell example
export const SimpleCell =
  (keyName: string, variant?: ..., color?: ...) =>
  <TData,>({ row }: { row: Row<TData> }) => {
    // return Typography with row.getValue(keyName)
  }
```

**Completion:** Each factory is a single `.ts` file (no JSX needed if using createElement,
or `.tsx` if using JSX). Type-checks with `pnpm type-check`.

---

### Step 3 — Create platform-split cell factories (composite)

Build cell factories that need layout containers (View/div) because they
compose multiple atoms horizontally.

**Files to create (each follows component folder pattern):**
```
cells/AvatarNameCell/
  AvatarNameCell.tsx           # factory type
  AvatarNameCell.native.tsx    # View wrapper + Avatar + Typography
  AvatarNameCell.web.tsx       # div wrapper + Avatar + Typography
  index.ts / index.web.ts

cells/BillTitleCell/
  BillTitleCell.tsx
  BillTitleCell.native.tsx
  BillTitleCell.web.tsx
  index.ts / index.web.ts

cells/StatusCell/
  StatusCell.tsx
  StatusCell.native.tsx
  StatusCell.web.tsx
  index.ts / index.web.ts
```

**Completion:** Each factory renders correctly with platform-appropriate layout wrappers.

---

### Step 4 — Create SortableHeader (platform-split)

Interactive header factory — press to toggle sort direction.

**Files to create:**
```
cells/SortableHeader/
  SortableHeader.tsx              # ISortableHeaderFactoryResult type
  SortableHeader.native.tsx       # Pressable + Typography + Icon (sort arrow)
  SortableHeader.web.tsx          # <button> + Typography + Icon (sort arrow)
  index.ts / index.web.ts
```

**Logic:**
- Calls `column.toggleSorting(column.getIsSorted() === 'asc')` on press
- Reads `column.getIsSorted()` → renders up/down/neutral arrow via Icon
- Label rendered with Typography variant="caption"

**Completion:** SortableHeader toggles sorting state when pressed on both platforms.

---

### Step 5 — Create cells barrels (native + web)

Two barrels needed — platform-split cells resolve differently per platform.
Simple cells (SimpleCell, AmountCell, DateCell) are the same in both barrels
since they have no platform split.

**Files to create:**
- `packages/ui/src/components/organisms/DataTable/cells/index.ts` (native)
- `packages/ui/src/components/organisms/DataTable/cells/index.web.ts` (web)

**Native barrel (`index.ts`):**
```typescript
// Simple cells — no platform split, same file for both
export { SimpleCell } from './SimpleCell'
export { AmountCell } from './AmountCell'
export { DateCell } from './DateCell'
// Platform-split cells — explicit native barrel import
export { AvatarNameCell } from './AvatarNameCell/index'
export { BillTitleCell } from './BillTitleCell/index'
export { StatusCell } from './StatusCell/index'
export { SortableHeader } from './SortableHeader/index'
```

**Web barrel (`index.web.ts`):**
```typescript
// Simple cells — no platform split, same file for both
export { SimpleCell } from './SimpleCell'
export { AmountCell } from './AmountCell'
export { DateCell } from './DateCell'
// Platform-split cells — explicit web barrel import
export { AvatarNameCell } from './AvatarNameCell/index.web'
export { BillTitleCell } from './BillTitleCell/index.web'
export { StatusCell } from './StatusCell/index.web'
export { SortableHeader } from './SortableHeader/index.web'
```

**Completion:** Single import point per platform for all cell factories.

---

### Step 6 — Create DataTablePagination (molecule)

Pagination controls — numbered pages with prev/next.

**Files to create:**
```
molecules/DataTablePagination/
  DataTablePagination.tsx              # IDataTablePaginationProps
  DataTablePagination.native.tsx       # compact: < [1] [2] ... [5] >
  DataTablePagination.web.tsx          # Prev [1][2][3][4][5] Next
  DataTablePagination.variants.ts      # page button variants (active/inactive)
  index.ts / index.web.ts
```

**Props:**
```typescript
export interface IDataTablePaginationProps {
  /** TanStack Table instance */
  table: Table<unknown>
}
```

**Logic (both platforms):**
- Read: `table.getPageCount()`, `table.getState().pagination.pageIndex`
- Navigate: `table.setPageIndex(n)`, `table.previousPage()`, `table.nextPage()`
- Disable: `table.getCanPreviousPage()`, `table.getCanNextPage()`

**Web rendering — responsive (same dual-mode logic as DataTable):**
- **Tablet/Desktop** (>= 768px): full layout
  ```
  [< Prev]  [1] [2] [3] [4] [5]  [Next >]
  ```
  Active page: dark background, white text. Inactive: border, dark text.
  Prev/Next: border + arrow icon + text.
- **Phone** (< 768px): compact layout (matches Mobile Transactions Figma)
  ```
  [<]  [1] [2] [...] [5]  [>]
  ```
  Arrow-only buttons (no text), ellipsis for middle pages.
- Detection: same ResizeObserver / viewport width check as DataTable.web.tsx.

**Native rendering (always compact — phones and small tablets):**
```
[<]  [1] [2] [...] [5]  [>]
```
- Arrow-only buttons (no text)
- Ellipsis for middle pages
- On tablets (>= 768px), can optionally show full Prev/Next text

**CVA variants:**
```typescript
pageButtonVariants = cva('items-center justify-center rounded-lg', {
  variants: {
    active: {
      true: 'bg-foreground text-white',
      false: 'border border-border text-foreground',
    },
    size: {
      sm: 'h-8 w-8 text-sm',      // native
      md: 'h-10 w-10 text-base',   // web
    },
  },
  defaultVariants: { active: false, size: 'md' },
})
```

**Completion:** Pagination renders, page buttons call `table.setPageIndex()`.
Register in both barrels (`src/index.ts`, `src/index.web.ts`).

---

### Step 7 — Create ActionBar (DataTable sub-component)

Built-in toolbar rendered above the table. Uses our existing `TextInput` atom
for search — no custom input needed.

**Files to create:**
```
organisms/DataTable/ActionBar/
  ActionBar.tsx                # IActionBarProps — types only
  ActionBar.native.tsx         # View flex-row: leftActions + TextInput search
  ActionBar.web.tsx            # div flex-row: leftActions + TextInput search
  ActionBar.styles.ts          # layout classes (flex, gap, padding)
  index.ts / index.web.ts
```

**Props (internal — NOT exported from package):**
```typescript
export interface IActionBarProps {
  /** TanStack Table instance (for reading globalFilter state) */
  table: Table<unknown>
  /** Filter/action elements rendered on the left */
  leftActions?: ReactElement[]
  /** Search input change callback */
  onSearchChange?: (value: string) => void
  /** Search input placeholder */
  searchPlaceholder?: string
}
```

**Rendering (both platforms — same structure, different containers):**
```
┌──────────────────────────────────────────────────┐
│  [leftActions[0]] [leftActions[1]]    [Search 🔍] │
│  ← flex-grow →                        ← fixed →  │
└──────────────────────────────────────────────────┘
```

- Left: `leftActions` array rendered in a flex-grow container with gap
- Right: `TextInput` with search icon, value from `table.getState().globalFilter`
- Consumer passes responsive elements in `leftActions` — on phone they might
  be icon-only buttons, on tablet/desktop full dropdowns

**How DataTable renders ActionBar (same pattern as Odaseva):**
```typescript
{!noActionBar && !actionBar && (
  <ActionBar
    table={table}
    leftActions={leftActions}
    onSearchChange={onSearchChange}
    searchPlaceholder={searchPlaceholder}
  />
)}
{actionBar}
```

- No `noActionBar` + no `actionBar` → default ActionBar
- `actionBar` provided → custom replacement (full override)
- `noActionBar={true}` → nothing

**Completion:** ActionBar renders with search + leftActions on both platforms.

---

### Step 8 — Create DataTable types + constants + variants

**Files to create:**
- `packages/ui/src/components/organisms/DataTable/DataTable.tsx` — types only
- `packages/ui/src/components/organisms/DataTable/DataTable.constants.ts`
- `packages/ui/src/components/organisms/DataTable/DataTable.variants.ts`
- `packages/ui/src/components/organisms/DataTable/DataTable.styles.ts`

**Constants:**
```typescript
export const DEFAULT_PAGE_SIZE = 10
export const COMPACT_BREAKPOINT = 768
```

**Variants (row styling):**
```typescript
export const dataTableRowVariants = cva('', {
  variants: {
    // no 'pressed' — web-only hover handled in .web.tsx
    divider: {
      true: 'border-b border-border',
    },
  },
  defaultVariants: { divider: true },
})
```

**Styles (inner element classes):**
```typescript
export const dataTableStyles = {
  headerRow: 'flex-row border-b border-border',
  headerCell: 'flex-1 py-3',
  bodyRow: 'flex-row items-center',
  bodyCell: 'flex-1 py-4',
  emptyRow: 'py-8 items-center justify-center',
} as const
```

**Completion:** Types, constants, variants, styles all type-check.

---

### Step 9 — Create DataTable.web.tsx

Responsive web rendering — columnar `<table>` on tablet/desktop, compact list on phone.

**Width detection:**
```typescript
// useContainerWidth hook or ResizeObserver
const [width, setWidth] = useState(window.innerWidth)
const isCompact = !!renderCompactRow && width < (compactBreakpoint ?? COMPACT_BREAKPOINT)
```

**Rendering — Columnar mode (tablet/desktop, width >= 768):**
```html
<div class="...">                                  <!-- container -->
  <!-- ActionBar (search + leftActions) -->
  <ActionBar table={table} leftActions={...} onSearchChange={...} />
  <table class="w-full">
    <thead>
      <tr class="border-b border-border">
        <th>flexRender(header)</th>                <!-- per column -->
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-border hover:bg-beige-100 transition-colors">
        <td>flexRender(cell)</td>                  <!-- per column -->
      </tr>
      <!-- or empty state row -->
    </tbody>
  </table>
  <DataTablePagination table={table} />            <!-- if pagination={true} -->
</div>
```

**Rendering — Compact mode (phone, width < 768):**
```html
<div class="...">                                  <!-- container -->
  <!-- ActionBar still renders (compact leftActions + search) -->
  <ActionBar table={table} leftActions={...} onSearchChange={...} />
  <div class="divide-y divide-border">             <!-- list -->
    {rows.map((row, index) => renderCompactRow({ row, index }))}
  </div>
  <DataTablePagination table={table} />            <!-- if pagination={true} -->
</div>
```

**Key implementation details:**
- Iterate `table.getHeaderGroups()` → render `<th>` with `flexRender(header.column.columnDef.header, header.getContext())`
- Iterate `table.getRowModel().rows` → render `<tr>` with `<td>` per cell via `flexRender(cell.column.columnDef.cell, cell.getContext())`
- **3-state rendering** (same as Odaseva DataTable.tsx):
  - `loading && RowSkeleton` → render `pageSize` skeleton rows (hide real data + headers in compact)
  - `!loading && rows.length > 0` → render data rows
  - `!loading && rows.length === 0` → render no-results message (columnar: `<tr><td colSpan>`, compact: centered div)
- **Pagination**: render only when `!loading && rowCount > pageSize && pagination`
- Row click: columnar → `<tr onClick>` with `cursor-pointer`; compact → wrapper div with onClick
- Web-only classes on `<tr>`: `hover:bg-beige-100 transition-colors`
- ResizeObserver cleanup on unmount

**Completion:** Renders columnar on tablet/desktop, compact on phone. Storybook-verifiable
at different viewport widths.

---

### Step 10 — Create DataTable.native.tsx

FlatList-based rendering with dual mode (columnar for tablet, compact for phone).
Same responsive logic as web — different detection mechanism.

**Width detection:**
```typescript
const { width } = useWindowDimensions()
const isCompact = !!renderCompactRow && width < (compactBreakpoint ?? COMPACT_BREAKPOINT)
```

**Rendering — Columnar mode (tablet, width >= 768):**
```
<View>                                             <!-- container -->
  <ActionBar table={table} leftActions={...} onSearchChange={...} />
  <View style={tw`flex-row border-b border-border`}>   <!-- header row -->
    <View style={tw`flex-1`}>                      <!-- per column -->
      {flexRender(header.column.columnDef.header, header.getContext())}
    </View>
  </View>
  <FlatList
    data={table.getRowModel().rows}
    renderItem={({ item: row }) => (
      <Pressable onPress={() => onRowPress?.(row)} style={tw`flex-row ...`}>
        <View style={tw`flex-1`}>                  <!-- per cell -->
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </View>
      </Pressable>
    )}
    ListEmptyComponent={...}
  />
  {pagination && <DataTablePagination table={table} />}
</View>
```

**Rendering — Compact mode (phone, width < 768):**
```
<View>
  <ActionBar table={table} leftActions={...} onSearchChange={...} />
  <FlatList
    data={table.getRowModel().rows}
    renderItem={({ item: row, index }) => renderCompactRow({ row, index })}
    ListEmptyComponent={...}
  />
  {pagination && <DataTablePagination table={table} />}
</View>
```

**3-state rendering** (same logic as web):
- `loading && RowSkeleton` → render `pageSize` skeleton rows in FlatList
- `!loading && rows.length > 0` → render data rows (columnar or compact)
- `!loading && rows.length === 0` → render `ListEmptyComponent` with no-results message
- **Pagination**: render only when `!loading && rowCount > pageSize && pagination`

**Completion:** Renders columnar on tablet, compact on phone. FlatList handles scroll + perf.
Both modes driven by the same `renderCompactRow` + `compactBreakpoint` props as web.

---

### Step 11 — Create DataTable barrels + register in public API

**Files to create:**
- `packages/ui/src/components/organisms/DataTable/index.ts`
- `packages/ui/src/components/organisms/DataTable/index.web.ts`

**Files to modify:**
- `packages/ui/src/index.ts` — add DataTable + cell factory exports
- `packages/ui/src/index.web.ts` — add DataTable + cell factory exports

**Exports from the package (two barrels — native + web):**

`src/index.ts` (native):
```typescript
export { DataTable } from './components/organisms/DataTable'
export type { IDataTableProps } from './components/organisms/DataTable'
export { DataTablePagination } from './components/molecules/DataTablePagination'
export type { IDataTablePaginationProps } from './components/molecules/DataTablePagination'
export {
  SimpleCell, AmountCell, DateCell,
  AvatarNameCell, BillTitleCell, StatusCell, SortableHeader,
} from './components/organisms/DataTable/cells/index'
```

`src/index.web.ts` (web):
```typescript
export { DataTable } from './components/organisms/DataTable/index.web'
export type { IDataTableProps } from './components/organisms/DataTable/DataTable.tsx'
export { DataTablePagination } from './components/molecules/DataTablePagination/index.web'
export type { IDataTablePaginationProps } from './components/molecules/DataTablePagination/DataTablePagination.tsx'
export {
  SimpleCell, AmountCell, DateCell,
  AvatarNameCell, BillTitleCell, StatusCell, SortableHeader,
} from './components/organisms/DataTable/cells/index.web'
```

**Completion:** `import { DataTable, SimpleCell, SortableHeader } from '@financial-app/ui'` works.

---

### Step 12 — Storybook stories

Create stories demonstrating DataTable with different configurations.

**Files to create:**
- `apps/storybook/stories/web/DataTable.stories.tsx`
- `apps/storybook/stories/web/DataTablePagination.stories.tsx`
- `apps/storybook/stories/native/DataTable.stories.tsx`
- `apps/storybook/stories/native/DataTablePagination.stories.tsx`

**Story variants for DataTable:**
- **Transactions** — 4 columns (AvatarNameCell, SimpleCell, DateCell, AmountCell), pagination, sorting
- **RecurringBills** — 3 columns (BillTitleCell, StatusCell, AmountCell), no pagination, sorting
- **Empty** — no rows, shows emptyMessage
- **Loading** — skeleton rows

**Story variants for DataTablePagination:**
- **Default** — 5 pages, page 2 active
- **FirstPage** — prev disabled
- **LastPage** — next disabled
- **SinglePage** — no pagination shown

Each story creates a `useReactTable` instance with mock data and column definitions
composed from cell factories.

**Completion:** All stories render in Storybook. Visual verification of both platforms.

---

### Step 13 — Wire DataTable into Transactions page (integration test)

Implement the Transactions screen on web using DataTable + cell factories + mock data.
This is the real-world validation that the whole architecture works end-to-end.

**Ref screens:**
- Desktop: `files/proto/screen and readme/Desktop - Transactions.jpg`
- Tablet: `files/proto/screen and readme/Tablet - Transactions.jpg`
- Mobile: `files/proto/screen and readme/Mobile - Transactions.jpg`

**Files to create/modify:**
- `apps/web/app/routes/transactions/useTransactionColumns.ts` — column defs with cell factories
- `apps/web/app/components/DataTableTransactions.tsx` — wrapper: accepts `data` + `loading`, creates table instance, renders `<DataTable>`
- `apps/web/app/components/TransactionRowSkeleton.tsx` — skeleton component for loading state
- `apps/web/app/routes/transactions/route.tsx` — renders `<DataTableTransactions data={mockTransactions} loading={false} />`

**What to verify:**
- Desktop/Tablet: ActionBar (search + sort + category) + columnar table + pagination
- Phone: ActionBar (search + icons) + compact stacked rows (renderCompactRow) + pagination
- Sorting works via SortableHeader click
- Search filters rows via globalFilter
- Pagination navigates pages — only shown when `!loading && rowCount > pageSize`
- Loading state: pass `loading={true}` → skeleton rows displayed, real data hidden
- Empty state: pass `data={[]}` + `loading={false}` → no-results message displayed
- Amounts colored correctly (green positive, default negative)
- Avatars render in first column

**Completion:** Transactions page renders correctly at all 3 breakpoints + loading + empty states.
User runs `pnpm web:dev` to verify visually.

---

### Step 14 — Run checks + review

```bash
pnpm type-check && pnpm lint && pnpm test
```

Then `/review`.

**Completion criteria:**
- [ ] All cell factories type-check with generic `<TData>` parameter
- [ ] DataTable.web.tsx renders semantic `<table>` with flexRender
- [ ] DataTable.web.tsx switches to compact mode on narrow viewport
- [ ] DataTable.native.tsx renders FlatList in both columnar and compact mode
- [ ] ActionBar renders search (TextInput) + leftActions on both platforms
- [ ] ActionBar hidden when `noActionBar={true}`, replaced when `actionBar` provided
- [ ] Loading: skeleton rows rendered when `loading && rowsSkeleton`, data rows hidden
- [ ] Empty: no-results message when `!loading && rows.length === 0`
- [ ] Pagination only shown when `!loading && rowCount > pageSize && pagination`
- [ ] DataTablePagination renders on both platforms with correct page state
- [ ] SortableHeader toggles sort direction on both platforms
- [ ] Cell factories use only cross-platform atoms (Typography, Avatar, Icon)
- [ ] No `<td>` or `<table>` in .native.tsx files
- [ ] No `<View>` or `react-native` in .web.tsx files
- [ ] No web-only classes (hover:, transition-, shadow-) in shared variants
- [ ] All components registered in both barrels (index.ts + index.web.ts)
- [ ] All stories render in Storybook
- [ ] Transactions page renders correctly at 3 breakpoints (Step 13)
- [ ] type-check + lint + test pass
- [ ] /review passes

---

## Consumer Usage Examples

### Column Definition Hook (shared across platforms)

```typescript
// Can live in packages/shared or be duplicated per app
// SortableHeader resolves to native or web via barrel files
import { SortableHeader, AvatarNameCell, SimpleCell, DateCell, AmountCell } from '@financial-app/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { ITransaction } from '@financial-app/shared'

export function useTransactionColumns(): ColumnDef<ITransaction>[] {
  return [
    {
      accessorKey: 'name',
      header: SortableHeader('Recipient / Sender'),
      cell: AvatarNameCell('avatar', 'name'),
    },
    {
      accessorKey: 'category',
      header: SortableHeader('Category'),
      cell: SimpleCell('category'),
    },
    {
      accessorKey: 'date',
      header: SortableHeader('Transaction Date'),
      cell: DateCell('date'),
    },
    {
      accessorKey: 'amount',
      header: SortableHeader('Amount'),
      cell: AmountCell('amount'),
    },
  ]
}
```

### Wrapper Component Pattern (same signature as Odaseva DataTableExample)

The wrapper component (`DataTableTransactions`, `DataTableRecurringBills`, etc.) is a
**standalone component** consumed by the screen/route. It:
- Accepts `data`, `loading` from the consumer (screen fetches data, wrapper renders it)
- Creates the `useReactTable` instance internally (owns sorting, filtering, pagination state)
- Passes the table instance + loading state to `<DataTable>`

Same pattern for web and native — the wrapper is NOT platform-split. It uses
cross-platform imports (DataTable, TransactionRow, cell factories) that resolve per platform
via barrel files.

```tsx
// Wrapper signature — same pattern for web and native
// Web: apps/web/app/components/DataTableTransactions.tsx
// Native: apps/mobile-expo/src/components/DataTableTransactions.tsx
// Route/Screen renders: <DataTableTransactions data={transactions} loading={isLoading} />

import { useState, useMemo } from 'react'
import { DataTable, TransactionRow } from '@financial-app/ui'
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, getFilteredRowModel,
  type SortingState,
} from '@tanstack/react-table'
import type { ITransaction } from '@financial-app/shared'
import { useTransactionColumns } from './useTransactionColumns'
import { TransactionRowSkeleton } from './TransactionRowSkeleton'

interface IDataTableTransactionsProps {
  data: ITransaction[]
  loading?: boolean
}

export function DataTableTransactions({ data, loading }: IDataTableTransactionsProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useTransactionColumns()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  })

  return (
    <DataTable
      table={table}
      loading={loading}
      rowsSkeleton={TransactionRowSkeleton}
      pagination
      searchPlaceholder="Search transaction"
      onSearchChange={(v) => table.setGlobalFilter(v)}
      leftActions={[
        <SortDropdown key="sort" value={sorting} onChange={setSorting} />,
        <CategoryDropdown key="category" value={categoryFilter} onChange={setCategoryFilter} />,
      ]}
      renderCompactRow={({ row }) => (
        <TransactionRow
          name={row.original.name}
          avatar={row.original.avatar}
          amount={row.original.amount}
          date={row.original.date}
          category={row.original.category}
        />
      )}
    />
  )
}
```

**Key points (from Odaseva reference):**
- `data` comes from the consumer (screen/route) — the wrapper does NOT fetch data
- `loading` comes from the consumer — the wrapper passes it through to DataTable
- `rowsSkeleton` is a component provided by the wrapper — DataTable renders N instances when `loading`
- Table state (sorting, globalFilter) is owned by the wrapper, not the screen
- The screen just does: `<DataTableTransactions data={transactions} loading={isLoading} />`

**Behavior (both platforms):**
- **Desktop/Tablet** (>= 768px): ActionBar + columnar table with headers
- **Phone** (< 768px): ActionBar (compact) + `renderCompactRow` stacked list
- Loading: skeleton rows replace data rows
- No results: centered message when `!loading && rows.length === 0`
- Pagination: shown only when `!loading && rowCount > pageSize`

---

## What This Plan Does NOT Cover

- **Dropdown component** — Sort/Category dropdowns passed via `leftActions` are separate
  components (see Dropdown compound component in CLAUDE.md Next). ActionBar renders
  whatever elements the consumer passes — it doesn't own filter logic.
- **Error state** — `error` prop not included yet (deferred). Screens handle error display above/around the DataTable wrapper for now. Can be added later if needed.
- **Virtualization** — not needed (datasets < 100 rows), can add later if needed
- **Row selection** (checkboxes) — not in Figma, skip for now
- **Column resizing** — not in Figma, skip for now
