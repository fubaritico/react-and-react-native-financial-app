import { StyleProp, View, ViewStyle } from 'react-native'

import tw from '#Lib/tw'

import type { ITableHeadProps } from './TableHead.tsx'

/**
 * TableHead sub-component (native).
 * Renders a View for header cell layout.
 */
export function TableHead({
  children,
  style,
}: Readonly<ITableHeadProps & { style: StyleProp<ViewStyle> }>) {
  return <View style={[tw`flex-1 py-3`, style]}>{children}</View>
}
