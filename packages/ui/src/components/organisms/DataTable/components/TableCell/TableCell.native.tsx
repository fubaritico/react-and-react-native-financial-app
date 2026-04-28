import { StyleProp, View, ViewStyle } from 'react-native'

import tw from '#Lib/tw'

import type { ITableCellProps } from './TableCell.tsx'

/**
 * TableCell sub-component (native).
 * Renders a View for body cell layout.
 */
export function TableCell({
  children,
  style,
}: Readonly<ITableCellProps & { style: StyleProp<ViewStyle> }>) {
  return <View style={[tw`flex-1 py-4 px-4`, style]}>{children}</View>
}
