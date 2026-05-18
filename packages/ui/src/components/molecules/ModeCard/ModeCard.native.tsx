import { Pressable, View } from 'react-native'

import tw from '#Lib/tw'

import { MEDALLION_OFFSET, MEDALLION_SIZE } from './ModeCard.constants'
import { shared } from './ModeCard.styles'
import { modeCardVariants } from './ModeCard.variants'

import type { IModeCardProps } from './ModeCard'

import { Icon, Typography } from '#Atoms'

/**
 * Mode selection card with a medallion icon straddling the top edge.
 * @param props - Mode card props
 * @returns A pressable card for mode selection
 */
export function ModeCard({
  icon,
  title,
  description,
  disabled,
  badge,
  onPress,
}: Readonly<IModeCardProps>) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!!disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        tw`${modeCardVariants({ disabled: disabled ?? undefined })} mt-7`,
        pressed && !disabled && tw`opacity-80`,
      ]}
    >
      {/* Medallion */}
      <View
        style={[
          tw`absolute self-center ${shared.medallion}`,
          {
            width: MEDALLION_SIZE,
            height: MEDALLION_SIZE,
            top: -MEDALLION_OFFSET,
          },
        ]}
      >
        <Icon name={icon} iconSize="6xl" />
      </View>

      {/* Body */}
      <View style={tw`${shared.body}`}>
        <Typography variant="heading-md" align="center">
          {title}
        </Typography>
        <Typography
          variant="body"
          color="muted"
          align="center"
          style={tw`${shared.description}`}
        >
          {description}
        </Typography>
        {badge ? (
          <View style={tw`${shared.badge}`}>
            <Typography variant="caption" color="muted">
              {badge}
            </Typography>
          </View>
        ) : null}
      </View>
    </Pressable>
  )
}
