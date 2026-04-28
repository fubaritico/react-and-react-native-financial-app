import { forwardRef } from 'react'

import { cn } from '#Lib/cn'

import type { HTMLAttributes } from 'react'

/**
 * TableBody sub-component (web).
 * Renders a `<tbody>` with no border on last row.
 */
export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'
