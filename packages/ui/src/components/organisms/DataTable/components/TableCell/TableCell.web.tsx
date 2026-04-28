import { forwardRef } from 'react'

import { cn } from '#Lib/cn'

import type { TdHTMLAttributes } from 'react'

/**
 * TableCell sub-component (web).
 * Renders a `<td>` with cell styling.
 */
export const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-4 h-[80px] [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'
