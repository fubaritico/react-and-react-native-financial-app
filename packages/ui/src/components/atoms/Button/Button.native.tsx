import { ActivityIndicator, Pressable } from 'react-native'

import tw from '#Lib/tw'

import { Icon } from '../Icon/Icon.native'
import { Typography } from '../Typography/Typography.native'

import { ICON_COLOR_TOKEN, SPINNER_COLOR_TOKEN } from './Button.constants'
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
  centered,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  loading,
  icon,
  iconPosition = 'right',
  accessibilityLabel,
  ariaExpanded,
  className,
  style,
}: Readonly<IButtonProps>) => {
  const isDisabled = !!disabled || !!loading
  const variantClasses = buttonVariants({
    variant,
    size,
    fullWidth,
    disabled: isDisabled || undefined,
    centered,
  })
  const textColor =
    VARIANT_TEXT_COLOR[variant ?? 'primary'] ?? 'primary-foreground'
  const spinnerColor =
    tw.color(SPINNER_COLOR_TOKEN[variant ?? 'primary']) ?? '#FFFFFF'

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        disabled: isDisabled,
        busy: !!loading,
        ...(ariaExpanded != null && { expanded: ariaExpanded }),
      }}
      style={({ pressed }) => [
        tw`${variantClasses} items-center`,
        tw.style({
          'flex-row-reverse': iconPosition === 'left',
          'flex-row': iconPosition !== 'left',
          'opacity-70': pressed,
        }),
        className ? tw`${className}` : undefined,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        (children ?? (
          <>
            <Typography variant="body-bold" color={textColor}>
              {title}{' '}
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
        ))
      )}
    </Pressable>
  )
}
