import { ScrollView } from 'react-native'

import type { ITableProps } from './Table.tsx'

/**
 * Table sub-component (native).
 * Renders a ScrollView with optional maxHeight.
 */
export function Table({ children, maxHeight }: Readonly<ITableProps>) {
  return (
    <ScrollView style={maxHeight ? { maxHeight } : undefined}>
      {children}
    </ScrollView>
  )
}
