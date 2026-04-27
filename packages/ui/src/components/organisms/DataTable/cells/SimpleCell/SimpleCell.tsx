import type { TypographyVariants } from '../../../../atoms/Typography/Typography.variants'
import type { Row } from '@tanstack/react-table'
import type { ReactElement } from 'react'

/** Factory config for SimpleCell. */
export interface SimpleCellConfig {
  /** Accessor key to read from the row */
  keyName: string
  /** Typography variant (defaults to 'body') */
  variant?: TypographyVariants['variant']
  /** Typography color (defaults to 'foreground') */
  color?: TypographyVariants['color']
}

/** Return type of the SimpleCell factory. */
export type SimpleCellFn = <TData>(props: { row: Row<TData> }) => ReactElement
