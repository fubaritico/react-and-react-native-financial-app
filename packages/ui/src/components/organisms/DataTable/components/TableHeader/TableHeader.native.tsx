import { View } from 'react-native'

import type { ITableHeaderProps } from './TableHeader.tsx'

/**
 * TableHeader sub-component (native).
 * Renders a View wrapper for header rows.
 */
export function TableHeader({ children }: Readonly<ITableHeaderProps>) {
  return <View>{children}</View>
}
