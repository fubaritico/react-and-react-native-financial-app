import { cn } from '../../../lib/cn'
import { Typography } from '../../atoms/Typography/Typography.web'

import { listboxItemVariants } from './Listbox.variants'

import type { IListboxItemProps } from './Listbox'
import type { ComponentProps } from 'react'

/** Extended web props for ListboxItem — allows forwarding native li attributes */
export interface IListboxItemWebProps
  extends
    IListboxItemProps,
    Omit<ComponentProps<'li'>, keyof IListboxItemProps | 'children'> {}

/**
 * Web ListboxItem — styled `<li role="option">` for listbox-style items.
 * Handles active, selected, disabled, and hover states.
 */
export function ListboxItem({
  variant = 'light',
  isActive = false,
  isSelected = false,
  disabled = false,
  className,
  children,
  onPress,
  id,
  ...rest
}: IListboxItemWebProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-active={isActive || undefined}
      onClick={disabled ? undefined : onPress}
      className={cn(
        listboxItemVariants({ variant, isSelected, disabled }),
        'select-none transition-colors',
        !disabled && 'cursor-pointer',
        disabled && 'pointer-events-none',
        !disabled &&
          isActive &&
          (variant === 'dark' ? 'bg-grey-500' : 'bg-beige-100'),
        !disabled &&
          !isActive &&
          (variant === 'dark' ? 'hover:bg-grey-500' : 'hover:bg-beige-100'),
        className
      )}
      {...rest}
    >
      <Typography
        variant={isSelected ? 'body-bold' : 'body'}
        color={variant === 'dark' ? 'on-dark' : 'foreground'}
        as="span"
      >
        {children}
      </Typography>
    </li>
  )
}
