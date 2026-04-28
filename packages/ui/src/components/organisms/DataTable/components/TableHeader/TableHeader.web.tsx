import { forwardRef } from 'react'

import { cn } from '#Lib/cn'

import type { HTMLAttributes } from 'react'

/**
 * TableHeader sub-component (web).
 * Renders a `<thead>` with bottom-border on child rows.
 */
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      '[&_tr]:border-b',
      '[&_th[data-type="date"]]:w-[200px]',
      '[&_th[data-type="amount"]]:w-[160px]',
      '[&_th[data-type="status"]]:w-[120px]',
      className
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'
