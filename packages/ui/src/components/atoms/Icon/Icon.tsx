import type { IconName } from '@financial-app/icons'

import type { SemanticColor } from '#Lib/semanticColors'

import type { IIconSize } from './Icon.constants'

/** Color prop for Icon — semantic token name or 'currentColor' to inherit from parent. */
export type IconColor = SemanticColor | 'currentColor'

export interface IIconProps {
  /** Icon identifier — must match one of the generated icon names */
  name: IconName
  /** Named size — applied to the largest dimension, other scales proportionally */
  iconSize?: IIconSize
  /** Fill color — semantic token name (e.g. 'muted', 'on-dark') or 'currentColor' to inherit */
  color?: IconColor
  /** Accessibility label — if omitted, icon is decorative (aria-hidden) */
  accessibilityLabel?: string
}
