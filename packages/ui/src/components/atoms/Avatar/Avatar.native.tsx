import { useState } from 'react'
import { Image, View } from 'react-native'

import tw from '#Lib/tw'

import { Typography } from '../Typography/Typography.native'

import type { IAvatarProps } from './Avatar'

/** Minimum dimension to consider an image valid (Fresco returns 1x1 transparent pixel on failure) */
const MIN_VALID_SIZE = 2

/** Native implementation of the Avatar component. */
export const Avatar = ({ src, name, size = 40 }: Readonly<IAvatarProps>) => {
  const [hasError, setHasError] = useState(false)
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return hasError ? (
    <View
      accessibilityLabel={name}
      style={[
        tw`bg-foreground-subtle rounded-full items-center justify-center`,
        { width: size, height: size },
      ]}
    >
      <Typography variant="label">{initials}</Typography>
    </View>
  ) : (
    <Image
      source={{ uri: src }}
      onLoad={(e) => {
        const { width, height } = e.nativeEvent.source
        if (width < MIN_VALID_SIZE || height < MIN_VALID_SIZE) setHasError(true)
      }}
      onError={() => {
        setHasError(true)
      }}
      accessibilityLabel={name}
      style={[tw`rounded-full`, { width: size, height: size }]}
    />
  )
}
