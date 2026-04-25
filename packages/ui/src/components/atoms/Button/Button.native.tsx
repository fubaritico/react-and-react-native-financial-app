import { Pressable } from 'react-native'

import tw from '../../../lib/tw'
import { Icon } from '../Icon/Icon.native'
import { Typography } from '../Typography/Typography.native'

import { ICON_COLOR_TOKEN } from './Button.constants'
import { buttonVariants } from './Button.variants'

import type { IButtonProps } from './Button'
import type { TypographyVariants } from '../Typography/Typography.variants'

/** Text color per button variant. */
const VARIANT_TEXT_COLOR: Record<string, TypographyVariants['color']> = {
  primary: 'primary-foreground',
  secondary: 'foreground',
  tertiary: 'muted',
  destroy: 'primary-foreground',
  outline: 'foreground',
}

/** Native implementation of the Button component. */
export const Button = ({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  icon,
  iconPosition = 'right',
  accessibilityLabel,
  style,
}: IButtonProps) => {
  const variantClasses = buttonVariants({ variant, size, fullWidth, disabled })
  const textColor =
    VARIANT_TEXT_COLOR[variant ?? 'primary'] ?? 'primary-foreground'

  return (
    <Pressable
      onPress={onPress}
      disabled={!!disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        tw`${variantClasses} ${iconPosition === 'left' ? 'flex-row-reverse' : 'flex-row'} items-center`,
        pressed && tw`opacity-70`,
        style,
      ]}
    >
      {children ?? (
        <>
          <Typography variant="body-bold" color={textColor}>
            {title}
          </Typography>
          {icon ? (
            <Icon
              name={icon}
              iconSize="xs"
              color={
                tw.color(ICON_COLOR_TOKEN[variant ?? 'primary']) ?? '#FFFFFF'
              }
            />
          ) : null}
        </>
      )}
    </Pressable>
  )
}
