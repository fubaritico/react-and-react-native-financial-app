import { cn } from '../../../../../lib/cn'
import { Icon } from '../../../../atoms/Icon/Icon.web'
import { Typography } from '../../../../atoms/Typography/Typography.web'

import type { HeaderAlign, HeaderCellFn } from './SortableHeader'
import type { Column } from '@tanstack/react-table'

/**
 * Sortable header cell factory (web).
 * Renders a button that toggles column sort direction.
 * Shows a caret icon only when the column is actively sorted.
 * @param label - header text
 * @param align - text alignment ('left' | 'right'), defaults to 'left'
 */
export const SortableHeader =
  (label: string, align: HeaderAlign = 'left'): HeaderCellFn =>
  <TData,>({ column }: { column: Column<TData> }) => {
    const sorted = column.getIsSorted()
    const isAsc = sorted === 'asc'

    return (
      <button
        type="button"
        onClick={() => {
          column.toggleSorting(sorted === 'asc')
        }}
        aria-label={`Sort by ${label}`}
        className={cn(
          'inline-flex items-center gap-1 bg-transparent border-none p-0',
          'cursor-pointer',
          'hover:text-foreground transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
          align === 'right' ? 'justify-end ml-auto' : ''
        )}
      >
        <Typography variant="caption" color="muted" as="span">
          {label}
        </Typography>
        {sorted ? (
          <span className={isAsc ? 'rotate-180' : ''}>
            <Icon name="caretDown" iconSize="xxs" />
          </span>
        ) : null}
      </button>
    )
  }
