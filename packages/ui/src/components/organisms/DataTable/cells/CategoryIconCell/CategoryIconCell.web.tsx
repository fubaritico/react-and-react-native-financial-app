import type { IconName } from '@financial-app/icons'

import { cn } from '#Lib/cn'

import { Icon, Status, Typography } from '#Atoms/index.web'
import type { BillStatus } from '#Atoms/Status/Status.tsx'

import { TableCell } from '../../components/TableCell/TableCell.web'

import type { CategoryIconCellFn } from './CategoryIconCell.tsx'
import type { Row } from '@tanstack/react-table'

/**
 * Category icon + name cell factory (web).
 * Renders a colored circle with a category icon + name.
 * When dateKey/statusKey are provided, renders Status below name on mobile (hidden on sm+).
 * @param nameKey - accessor key for the display name
 * @param iconKey - key on row.original for the IconName
 * @param colorKey - key on row.original for the token color key (e.g. "blue", "army-green")
 * @param dateKey - optional key on row.original for the ISO date string
 * @param statusKey - optional key on row.original for the BillStatus
 */
export const CategoryIconCell =
  (
    nameKey: string,
    iconKey: string,
    colorKey: string,
    dateKey?: string,
    statusKey?: string
  ): CategoryIconCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const original = row.original as Record<string, string>
    const name = row.getValue<string>(nameKey)
    const icon = original[iconKey] as IconName
    const color = original[colorKey] ?? 'blue'

    const showStatus = dateKey && statusKey
    const date = showStatus ? original[dateKey] : undefined
    const status = showStatus ? (original[statusKey] as BillStatus) : undefined

    return (
      <TableCell>
        <div className="flex items-center gap-3 min-w-0 pr-3">
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-full w-10 h-10',
              `bg-${color}`
            )}
            aria-hidden="true"
          >
            <Icon name={icon} color="on-dark" iconSize="sm" />
          </div>
          <div className="min-w-0">
            <Typography
              variant="body-bold"
              as="span"
              className="truncate block"
            >
              {name}
            </Typography>
            {date && status ? (
              <span className="block sm:hidden">
                <Status date={date} status={status} />
              </span>
            ) : null}
          </div>
        </div>
      </TableCell>
    )
  }
