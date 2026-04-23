import { Text } from 'react-native'

import tw from '../../lib/tw'

import { typographyVariants } from './Typography.variants'

import type { ITypographyNativeProps } from './Typography'

/**
 * Typography — React Native implementation.
 * Renders a styled Text element using Figma text presets.
 */
export function Typography({
  variant,
  color,
  align,
  numberOfLines,
  accessibilityRole,
  children,
}: ITypographyNativeProps) {
  return (
    <Text
      style={tw`${typographyVariants({ variant, color, align })}`}
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole as 'header' | 'text' | undefined}
    >
      {children}
    </Text>
  )
}
