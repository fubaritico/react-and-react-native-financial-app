import { Text } from 'react-native'

import tw from '../../lib/tw'

import { typographyVariants } from './Typography.variants'

import type { ITypographyNativeProps } from './Typography'
import type { StyleProp, TextStyle } from 'react-native'

/** Extended native props with RN style support. */
interface ITypographyNativeStyledProps extends ITypographyNativeProps {
  /** Additional RN styles (layout only — text styles come from variant/color props). */
  style?: StyleProp<TextStyle>
}

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
  style,
  children,
}: ITypographyNativeStyledProps) {
  return (
    <Text
      style={[tw`${typographyVariants({ variant, color, align })}`, style]}
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole as 'header' | 'text' | undefined}
    >
      {children}
    </Text>
  )
}
