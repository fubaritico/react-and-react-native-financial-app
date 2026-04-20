import { cn } from '../../lib/cn'
import { buttonVariants } from '../../variants'

import type { IButtonProps } from './Button'

/** Web implementation of the Button component. */
export const Button = ({ title, onPress, variant, disabled }: IButtonProps) => (
  <button
    onClick={onPress}
    disabled={!!disabled}
    className={cn(
      buttonVariants({ variant, disabled }),
      'font-semibold hover:opacity-80 transition-opacity cursor-pointer'
    )}
  >
    {title}
  </button>
)
