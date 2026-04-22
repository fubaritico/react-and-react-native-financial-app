import type { IconName } from '@financial-app/icons'
import type { SvgProps } from 'react-native-svg'

/** Named icon size presets — applied to the largest dimension */
export type IIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/** Pixel values for each named size */
export const iconSizeMap: Record<IIconSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
  xxl: 24,
}

export interface IIconProps {
  /** Icon identifier — must match one of the generated icon names */
  name: IconName
  /** Named size — applied to the largest dimension, other scales proportionally */
  iconSize?: IIconSize
  /** Fill color override — defaults to 'currentColor' (web) or '#201F24' (native) */
  color?: string
  /** Accessibility label — if omitted, icon is decorative (aria-hidden) */
  accessibilityLabel?: string
}

/** Native-specific props passed through to the Svg element */
export type IIconNativeProps = IIconProps & Omit<SvgProps, 'width' | 'height'>

/** Web-specific props passed through to the svg element */
export type IIconWebProps = IIconProps &
  Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'>
