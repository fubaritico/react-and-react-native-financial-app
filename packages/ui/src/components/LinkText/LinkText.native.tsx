import { Pressable, Text, View } from 'react-native'

import tw from '../../lib/tw'

import type { ILinkTextProps } from './LinkText'

/** Native implementation of the LinkText component. */
export const LinkText = ({ text, linkLabel, onLinkPress }: ILinkTextProps) => (
  <View style={tw`flex-row items-center justify-center gap-2`}>
    <Text style={tw`text-sm text-grey-500`}>{text}</Text>
    <Pressable onPress={onLinkPress}>
      <Text style={tw`text-sm font-bold text-grey-900 underline`}>
        {linkLabel}
      </Text>
    </Pressable>
  </View>
)
