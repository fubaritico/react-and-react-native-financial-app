import type { IconName } from '@financial-app/icons'

import type { IIconSize } from './Icon.constants'

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
