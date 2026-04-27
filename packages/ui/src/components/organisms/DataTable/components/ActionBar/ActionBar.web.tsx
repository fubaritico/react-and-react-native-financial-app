import clsx from 'clsx'

import { TextInput } from '../../../../molecules/TextInput/TextInput.web'

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
    <div
      className={clsx(
        'flex items-center p-4 gap-4',
        { sticky: stickyHeader },
        className
      )}
    >
      <div className="flex grow gap-4">{leftActions}</div>
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
