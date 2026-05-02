import { cn } from '#Lib/cn'

import { TextInput } from '#Molecules/index.web'

import { web } from './ActionBar.styles'

import type { IActionBarProps } from './ActionBar.tsx'

/**
 * ActionBar sub-component (web).
 * Reads global filter state from the table instance.
 * Renders leftActions + search input in a horizontal row.
 */
export function ActionBar({
  className,
  leftActions,
  onGlobalFilterChange,
  stickyHeader,
  tableConfiguration,
}: Readonly<IActionBarProps>) {
  const globalFilter: unknown = tableConfiguration.getState().globalFilter
  const filterValue = typeof globalFilter === 'string' ? globalFilter : ''

  return (
    <div className={cn(web.container, { sticky: stickyHeader }, className)}>
      <div className={web.leftActionsWrap}>{leftActions}</div>
      {onGlobalFilterChange && (
        <div className="relative">
          <TextInput
            label="Search"
            value={filterValue}
            onChangeText={onGlobalFilterChange}
            placeholder="Search..."
            icon="search"
          />
        </div>
      )}
    </div>
  )
}
