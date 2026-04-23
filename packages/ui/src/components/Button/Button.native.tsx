import { Pressable, Text } from 'react-native'

import tw from '../../lib/tw'
import { Icon } from '../Icon/Icon.native'

import { ICON_COLOR } from './Button.constants'
import styles from './Button.styles'
import { buttonVariants } from './Button.variants'

import type { IButtonProps } from './Button'

/** Native implementation of the Button component. */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  fullWidth,
  disabled,
  icon,
  iconPosition = 'right',
  style,
}: IButtonProps) => {
  const variantClasses = buttonVariants({ variant, fullWidth, disabled })
  const textColor =
    variant === 'secondary'
      ? 'text-grey-900'
      : variant === 'tertiary'
        ? 'text-grey-500'
        : 'text-white'

  return (
    <Pressable
      onPress={onPress}
      disabled={!!disabled}
      style={({ pressed }) => [
        tw`${variantClasses} ${iconPosition === 'left' ? 'flex-row-reverse' : 'flex-row'} items-center`,
        pressed && tw`opacity-70`,
        style,
      ]}
    >
      <Text style={tw`${styles.text} ${textColor}`}>{title}</Text>
      {icon ? (
        <Icon
          name={icon}
          iconSize="xs"
          color={ICON_COLOR[variant ?? 'primary'] ?? '#FFFFFF'}
        />
      ) : null}
    </Pressable>
  )
}
