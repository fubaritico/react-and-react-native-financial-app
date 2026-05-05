import { cn } from '#Lib/cn'

import { TextInput } from '#Molecules/index.web'

import { web } from './ActionBar.styles'

import type { IActionBarProps } from './ActionBar.tsx'

/**
 * ActionBar sub-component (web).
 * Reads global filter state from the table instance.
 * Renders rightActions + search input in a horizontal row.
 */
export function ActionBar({
  className,
  rightActions,
  globalFilterValue,
  onGlobalFilterChange,
  stickyHeader,
  searchPlaceholder = 'Search',
  searchLabel,
}: Readonly<IActionBarProps>) {
  /**
   * called on global filter change will update the table manager state
   * @param value
   */
  const handleGlobalFilterChange = (value: string) => {
    onGlobalFilterChange?.(value)
  }

  return (
    <div className={cn(web.container, { sticky: stickyHeader }, className)}>
      <div className={rightActions ? 'grow' : 'w-full'}>
        <TextInput
          value={globalFilterValue ?? ''}
          onChangeText={handleGlobalFilterChange}
          placeholder={searchPlaceholder}
          accessibilityLabel={searchLabel ?? searchPlaceholder}
          icon="search"
          className="max-w-[320px]"
        />
      </div>
      {rightActions ? (
        <div className={web.rightActions}>{rightActions}</div>
      ) : null}
    </div>
  )
}
