import { StyleProp, View, ViewStyle } from 'react-native'

import tw from '#Lib/tw'

import type { ITableCellProps } from './TableCell.tsx'

/**
 * TableCell sub-component (native).
 * Renders a View for body cell layout.
 */
export function TableCell({
  children,
  align,
  style,
}: Readonly<ITableCellProps & { style?: StyleProp<ViewStyle> }>) {
  return (
    <View
      style={[
        tw`h-[80px] flex flex-row items-center w-full`,
        tw`${align === 'right' ? 'justify-end ml-auto' : 'justify-start mr-auto'}`,
        style,
      ]}
    >
      {children}
    </View>
  )
}
