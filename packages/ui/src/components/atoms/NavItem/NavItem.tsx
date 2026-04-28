import type { IconName } from '@financial-app/icons'

import type { navItemVariants } from './NavItem.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the NavItem component. */
export interface INavItemProps extends VariantProps<typeof navItemVariants> {
  /** Icon name from @financial-app/icons (e.g. 'navOverview'). */
  icon: IconName
  /** Visible text label. */
  label: string
  /** Whether to hide the label (collapsed sidebar mode). */
  collapsed?: boolean
  /** Callback fired when the item is pressed. */
  onPress?: () => void
}
