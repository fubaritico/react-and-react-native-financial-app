import { ScrollView } from 'react-native'

import tw from '../../../lib/tw'

import type { IDrawerBodyProps } from './Drawer'

/**
 * Native Drawer.Body — scrollable content area.
 * Fills remaining vertical space and scrolls when content overflows.
 */
export function DrawerBody({ className, children }: IDrawerBodyProps) {
  return (
    <ScrollView
      contentContainerStyle={tw`px-4 p-3 ${className ?? ''}`}
      style={tw`flex-1`}
    >
      {children}
    </ScrollView>
  )
}
