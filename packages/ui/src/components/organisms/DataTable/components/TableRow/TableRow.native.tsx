import { StyleProp, View, ViewStyle } from 'react-native'

import tw from '#Lib/tw'

import type { ITableRowProps } from './TableRow.tsx'

/**
 * TableRow sub-component (native).
 * Renders a horizontal View with bottom border.
 */
export function TableRow({
  children,
  style,
}: Readonly<ITableRowProps & { style: StyleProp<ViewStyle> }>) {
  return (
    <View
      style={[
        tw`flex-row items-center border-b border-border bg-white`,
        tw`transition-colors data-[state=selected]:bg-grey-100`,
        style,
      ]}
    >
      {children}
    </View>
  )
}
