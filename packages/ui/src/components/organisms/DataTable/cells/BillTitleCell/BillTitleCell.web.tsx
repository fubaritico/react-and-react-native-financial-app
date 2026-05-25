import type { IconName } from '@financial-app/icons'

import { cn } from '#Lib/cn'

import { Icon, Typography } from '#Atoms/index.web'

import { TableCell } from '../../components/TableCell/TableCell.web'

import type { BillTitleCellFn } from './BillTitleCell.tsx'
import type { Row } from '@tanstack/react-table'

/**
 * Bill title cell factory (web).
 * Renders category icon circle with colored left border + bill name.
 * @param nameKey - accessor key for the bill name
 * @param iconKey - key on row.original for the IconName
 * @param colorKey - key on row.original for the token color key
 */
export const BillTitleCell =
  (nameKey: string, iconKey: string, colorKey: string): BillTitleCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const original = row.original as Record<string, string>
    const name = row.getValue<string>(nameKey)
    const icon = original[iconKey] as IconName
    const color = original[colorKey] ?? 'blue'

    return (
      <TableCell className="flex items-center gap-3">
        <div className={cn('rounded-full border-l-4', `border-l-${color}`)}>
          <div
            className={cn(
              'flex items-center justify-center rounded-full w-10 h-10',
              `bg-${color}`
            )}
            aria-hidden="true"
          >
            <Icon name={icon} color="on-dark" iconSize="sm" />
          </div>
        </div>
        <Typography variant="body-bold">{name}</Typography>
      </TableCell>
    )
  }
