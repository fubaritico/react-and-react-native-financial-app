import { forwardRef } from 'react'

import { cn } from '../../../../../lib/cn'

import type { ThHTMLAttributes } from 'react'

/**
 * TableHead sub-component (web).
 * Renders a `<th>` with header cell styling.
 */
export const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 pl-4 text-left align-middle font-medium text-foreground-muted [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'
