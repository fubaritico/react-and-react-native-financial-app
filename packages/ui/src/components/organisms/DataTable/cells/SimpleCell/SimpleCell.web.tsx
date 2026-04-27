import { TableCell } from '../../components/TableCell/TableCell.web'
import { TruncatedContent } from '../../components/TruncatedContent/TruncatedContent.web'

import type { SimpleCellConfig, SimpleCellFn } from './SimpleCell.tsx'
import type { Row } from '@tanstack/react-table'

/**
 * Simple cell factory — displays a raw value with Typography.
 * @param keyName - accessor key to read from the row
 * @param variant - Typography variant (defaults to 'body')
 * @param color - Typography color (defaults to 'foreground')
 * @param className - extra classes from configuration
 */
export const SimpleCell =
  (
    keyName: string,
    variant?: SimpleCellConfig['variant'],
    color?: SimpleCellConfig['color'],
    className?: string
  ): SimpleCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const value = row.getValue<string | number>(keyName)

    return (
      <TableCell tabIndex={0} className={className}>
        <TruncatedContent
          value={String(value)}
          variant={variant}
          color={color}
        />
      </TableCell>
    )
  }
