import { cn } from '#Lib/cn'

import { TableHead } from '../../components/TableHead/TableHead.web'

import type { EmptyHeaderCellFn } from './EmptyHeaderCell.tsx'

/**
 * Empty header cell factory — renders an empty `<th>` for non-sortable columns (e.g. actions).
 * @param className - extra classes from configuration
 */
export const EmptyHeaderCell =
  (className?: string): EmptyHeaderCellFn =>
  () => <TableHead className={cn('w-12', className)}>&nbsp;</TableHead>
