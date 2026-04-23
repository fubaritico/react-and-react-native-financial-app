import { Pressable, View } from 'react-native'

import tw from '../../lib/tw'
import { Typography } from '../Typography/Typography.native'

import type { ILinkTextProps } from './LinkText'

/** Native implementation of the LinkText component. */
export const LinkText = ({ text, linkLabel, onLinkPress }: ILinkTextProps) => (
  <View style={tw`flex-row items-center justify-center gap-2`}>
    <Typography variant="body" color="muted">
      {text}
    </Typography>
    <Pressable onPress={onLinkPress}>
      <Typography
        variant="body"
        style={tw`font-bold text-foreground underline`}
      >
        {linkLabel}
      </Typography>
    </Pressable>
  </View>
)
