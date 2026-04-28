import { forwardRef } from 'react'

import { cn } from '#Lib/cn'

import type { HTMLAttributes } from 'react'

type TableRowWebProps = HTMLAttributes<HTMLTableRowElement> & {
  enableHover?: boolean
}

/**
 * TableRow sub-component (web).
 * Renders a `<tr>` with border, background, and optional hover.
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowWebProps>(
  ({ className, enableHover, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'bg-white transition-colors data-[state=selected]:bg-grey-100 border-t border-border',
          { 'hover:bg-grey-100/50': enableHover },
          className
        )}
        {...props}
      />
    )
  }
)
TableRow.displayName = 'TableRow'
