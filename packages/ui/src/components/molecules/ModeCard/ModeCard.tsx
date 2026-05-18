import type { IconName } from '@financial-app/icons'

import type { modeCardVariants } from './ModeCard.variants'
import type { VariantProps } from 'class-variance-authority'

export interface IModeCardProps extends VariantProps<typeof modeCardVariants> {
  /** Icon name displayed in the medallion */
  icon: IconName
  /** Card heading (e.g. "Manual Mode") */
  title: string
  /** Card body text explaining the mode */
  description: string
  /** Optional badge text shown when disabled (e.g. "Coming soon") */
  badge?: string
  /** Callback fired when the card is pressed */
  onPress: () => void
}
