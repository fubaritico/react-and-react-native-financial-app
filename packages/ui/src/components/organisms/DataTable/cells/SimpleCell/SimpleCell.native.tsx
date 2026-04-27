import { Typography } from '../../../../atoms/Typography/Typography.native'

import type { SimpleCellConfig, SimpleCellFn } from './SimpleCell'
import type { Row } from '@tanstack/react-table'

/**
 * Simple cell factory — displays a raw value with Typography.
 * @param keyName - accessor key to read from the row
 * @param variant - Typography variant (defaults to 'body')
 * @param color - Typography color (defaults to 'foreground')
 */
export const SimpleCell =
  (
    keyName: string,
    variant?: SimpleCellConfig['variant'],
    color?: SimpleCellConfig['color']
  ): SimpleCellFn =>
  <TData,>({ row }: { row: Row<TData> }) => {
    const value = row.getValue<string | number>(keyName)

    return (
      <Typography variant={variant} color={color}>
        {String(value)}
      </Typography>
    )
  }
