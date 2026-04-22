import type { SvgProps } from 'react-native-svg'

import type { IconName } from '../generated/iconData'

export type IconSize = 12 | 14 | 16 | 20 | 24 | 28 | 32 | 48

export interface IIconProps {
  /** Icon identifier — must match one of the generated icon names */
  name: IconName
  /** Icon dimensions in pixels (width & height) */
  size?: IconSize
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

export type { IconName } from '../generated/iconData'
export { iconNames } from '../generated/iconData'
