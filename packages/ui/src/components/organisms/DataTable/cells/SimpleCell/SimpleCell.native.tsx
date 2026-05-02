import tw from '#Lib/tw'

import { TableCell } from '#Organisms/DataTable/components/TableCell/TableCell.native'
import { TruncatedContent } from '#Organisms/DataTable/components/TruncatedContent/TruncatedContent.native'

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
      <TableCell style={className && tw`${className}`}>
        <TruncatedContent
          value={String(value)}
          variant={variant}
          color={color}
        />
      </TableCell>
    )
  }
