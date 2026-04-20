import { Pressable, Text } from 'react-native'

import tw from '../../lib/tw'
import { buttonVariants } from '../../variants'

import type { ButtonProps } from './Button'

/** Native implementation of the Button component. */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: ButtonProps) => {
  const variantClasses = buttonVariants({ variant, disabled })

  return (
    <Pressable
      onPress={onPress}
      disabled={!!disabled}
      style={({ pressed }) => [
        tw`${variantClasses}`,
        pressed && tw`opacity-70`,
        style,
      ]}
    >
      <Text
        style={tw`text-base font-semibold ${variant === 'primary' ? 'text-white' : variant === 'outline' ? 'text-primary' : 'text-foreground'}`}
      >
        {title}
      </Text>
    </Pressable>
  )
}
