import { Icon } from '@financial-app/icons'

import { cn } from '../../lib/cn'
import { buttonVariants } from '../../variants'

import type { IButtonProps } from './Button'

/** Color mapping for icon fill per button variant. */
const ICON_COLOR: Record<string, string> = {
  secondary: '#201F24',
  tertiary: '#696868',
}

/** Web implementation of the Button component. */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  fullWidth,
  disabled,
  icon,
}: IButtonProps) => (
  <button
    onClick={onPress}
    disabled={!!disabled}
    className={cn(
      buttonVariants({ variant, fullWidth, disabled }),
      'inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer',
      disabled && 'cursor-not-allowed'
    )}
  >
    {title}
    {icon ? (
      <Icon
        name={icon}
        size={12}
        color={ICON_COLOR[variant ?? 'primary'] ?? 'white'}
      />
    ) : null}
  </button>
)
