import { Pressable, Text } from 'react-native'

import tw from '../../lib/tw'

import styles from './SectionLink.styles'

import type { ISectionLinkProps } from './SectionLink'

/** Native implementation of the SectionLink component. */
export const SectionLink = ({ label, onPress }: ISectionLinkProps) => (
  <Pressable
    onPress={onPress}
    accessibilityLabel={label}
    accessibilityRole="button"
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    style={({ pressed }) => [
      tw`flex-row items-center gap-3`,
      pressed && tw`opacity-70`,
    ]}
  >
    <Text style={tw`${styles.label}`}>{label}</Text>
    <Text style={tw`${styles.label}`} accessibilityElementsHidden>
      &#9656;
    </Text>
  </Pressable>
)
