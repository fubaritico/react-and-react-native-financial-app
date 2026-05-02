import { ScrollView } from 'react-native'

import tw from '#Lib/tw'

import type { IBottomSheetBodyProps } from './BottomSheet'

/**
 * Native BottomSheet.Body — scrollable content area.
 * Scrolls when content overflows the max height.
 */
export function BottomSheetBody({
  className,
  children,
}: Readonly<IBottomSheetBodyProps>) {
  return (
    <ScrollView
      data-name="bottom-sheet-body"
      contentContainerStyle={tw`px-4 p-3 ${className ?? ''}`}
    >
      {children}
    </ScrollView>
  )
}
