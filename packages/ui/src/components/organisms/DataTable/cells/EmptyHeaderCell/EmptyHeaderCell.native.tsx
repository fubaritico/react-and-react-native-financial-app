import { View } from 'react-native'

import tw from '#Lib/tw'

import type { EmptyHeaderCellFn } from './EmptyHeaderCell.tsx'

/**
 * Empty header cell factory (native) — renders an empty View placeholder
 * to maintain column alignment in tablet columnar mode.
 * @param className - extra twrnc classes from configuration
 */
export const EmptyHeaderCell =
  (className?: string): EmptyHeaderCellFn =>
  () => <View style={tw`w-12 ${className ?? ''}`} />
