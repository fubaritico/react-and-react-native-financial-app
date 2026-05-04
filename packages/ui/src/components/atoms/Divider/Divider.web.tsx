import { cn } from '#Lib/cn'

import { shared } from './Divider.styles'

import type { IDividerProps } from './Divider'

/** Web implementation of the Divider component. */
export const Divider = ({
  spacing = 'md',
  className,
}: Readonly<IDividerProps>) => (
  <hr
    className={cn('border-0', shared.base, shared.spacing[spacing], className)}
  />
)
