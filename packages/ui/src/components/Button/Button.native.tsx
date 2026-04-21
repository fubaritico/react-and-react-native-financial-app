import { Pressable, Text } from 'react-native'

import tw from '../../lib/tw'
import { buttonVariants } from '../../variants'

import type { IButtonProps } from './Button'

/** Native implementation of the Button component. */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  fullWidth,
  disabled,
  icon,
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
        tw`${variantClasses} flex-row`,
        pressed && tw`opacity-70`,
        style,
      ]}
    >
      <Text style={tw`text-sm font-bold ${textColor}`}>{title}</Text>
      {icon}
    </Pressable>
  )
}
