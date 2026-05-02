import { View } from 'react-native'

import tw from '#Lib/tw'

import type { ITruncatedContentProps } from './TruncatedContent'

import { Typography } from '#Atoms'

/**
 * TruncatedContent (native).
 * Truncates text via RN numberOfLines prop.
 */
export function TruncatedContent({
  value,
  numberOfLines = 1,
}: Readonly<ITruncatedContentProps>) {
  return (
    <View style={tw`min-w-0 max-w-full`}>
      <Typography variant="body" numberOfLines={numberOfLines}>
        {value}
      </Typography>
    </View>
  )
}
