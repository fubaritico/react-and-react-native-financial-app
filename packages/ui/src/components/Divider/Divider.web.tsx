import { cn } from '../../lib/cn'

import type { IDividerProps } from './Divider'

const spacingMap = {
  sm: 'my-1',
  md: 'my-2',
  lg: 'my-4',
} as const

/** Web implementation of the Divider component. */
export const Divider = ({ spacing = 'md' }: IDividerProps) => (
  <hr className={cn('border-0 h-px w-full bg-grey-100', spacingMap[spacing])} />
)
