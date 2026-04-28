import { Pressable } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './SectionLink.styles'

import type { ISectionLinkProps } from './SectionLink'

import { Typography } from '#Atoms'

/** Native implementation of the SectionLink component. */
export const SectionLink = ({
  label,
  onPress,
}: Readonly<ISectionLinkProps>) => (
  <Pressable
    onPress={onPress}
    accessibilityLabel={label}
    accessibilityRole="button"
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    style={({ pressed }) => [
      tw`flex-row ${shared.root}`,
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
