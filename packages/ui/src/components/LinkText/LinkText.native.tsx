import { Pressable, Text, View } from 'react-native'

import tw from '../../lib/tw'

import styles from './LinkText.styles'

import type { ILinkTextProps } from './LinkText'

/** Native implementation of the LinkText component. */
export const LinkText = ({ text, linkLabel, onLinkPress }: ILinkTextProps) => (
  <View style={tw`flex-row items-center justify-center gap-2`}>
    <Text style={tw`${styles.text}`}>{text}</Text>
    <Pressable onPress={onLinkPress}>
      <Text style={tw`text-sm ${styles.linkLabel}`}>{linkLabel}</Text>
    </Pressable>
  </View>
)
