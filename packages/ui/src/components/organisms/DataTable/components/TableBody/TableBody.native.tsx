import { View } from 'react-native'

import type { ITableBodyProps } from './TableBody.tsx'

/**
 * TableBody sub-component (native).
 * Renders a View wrapper for body rows.
 */
export function TableBody({ children }: Readonly<ITableBodyProps>) {
  return <View>{children}</View>
}
