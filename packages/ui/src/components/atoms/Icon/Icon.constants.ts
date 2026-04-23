/** Named icon size presets — applied to the largest dimension */
export type IIconSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | '3xl'
  | '4xl'
  | '5xl'

/** Pixel values for each named size */
export const iconSizeMap: Record<IIconSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
  xxl: 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
}
