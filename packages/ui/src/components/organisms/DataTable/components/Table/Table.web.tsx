import { forwardRef } from 'react'

import { cn } from '../../../../../lib/cn'

import type { HTMLAttributes } from 'react'

type TableWebProps = HTMLAttributes<HTMLTableElement> & {
  maxHeight?: number
}

/**
 * Table sub-component (web).
 * Renders a scrollable `<div>` wrapping a `<table>`.
 */
export const Table = forwardRef<HTMLTableElement, TableWebProps>(
  ({ className, maxHeight, ...props }, ref) => {
    return (
      <div
        className="relative w-full"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table
          ref={ref}
          className={cn('w-full table-fixed caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    )
  }
)
Table.displayName = 'Table'
