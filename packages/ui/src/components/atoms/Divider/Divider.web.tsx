import { cn } from '../../../lib/cn'

import styles from './Divider.styles'

import type { IDividerProps } from './Divider'

/** Web implementation of the Divider component. */
export const Divider = ({ spacing = 'md' }: IDividerProps) => (
  <hr className={cn('border-0', styles.base, styles.spacing[spacing])} />
)
