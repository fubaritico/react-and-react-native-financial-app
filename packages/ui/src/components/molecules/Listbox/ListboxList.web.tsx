import { cn } from '#Lib/cn'

import { listboxListVariants } from './Listbox.variants'

import type { IListboxListProps } from './Listbox'
import type { ComponentProps } from 'react'

/** Extended web props for ListboxList — allows forwarding native ul attributes */
export interface IListboxListWebProps
  extends
    IListboxListProps,
    Omit<ComponentProps<'ul'>, keyof IListboxListProps> {}

/**
 * Web ListboxList — styled `<ul>` container for listbox-style dropdowns.
 * Provides border, shadow, scroll, and variant colors.
 */
export function ListboxList({
  variant = 'light',
  className,
  children,
  accessibilityLabel,
  shape,
  ...rest
}: Readonly<IListboxListWebProps>) {
  return (
    <ul
      role="listbox"
      aria-label={accessibilityLabel}
      className={cn(
        listboxListVariants({ variant, shape }),
        'list-none max-h-60 overflow-y-auto shadow-md',
        className
      )}
      {...rest}
    >
      {children}
    </ul>
  )
}
