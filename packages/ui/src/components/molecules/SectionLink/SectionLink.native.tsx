import { Pressable } from 'react-native'

import tw from '../../../lib/tw'
import { Typography } from '../../atoms/Typography/Typography.native'

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
    <Typography variant="body" color="muted">
      {label}
    </Typography>
    <Typography variant="body" color="muted" accessibilityRole="text">
      &#9656;
    </Typography>
  </Pressable>
)
