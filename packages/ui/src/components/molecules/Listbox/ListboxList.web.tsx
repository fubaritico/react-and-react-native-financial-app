import { cn } from '#Lib/cn'

import { listboxListVariants } from './Listbox.variants'

import type { IListboxListProps } from './Listbox'
import type { ComponentProps } from 'react'

/** Extended web props for ListboxList — allows forwarding native ul attributes */
export interface IListboxListWebProps
  extends
    IListboxListProps,
    Omit<ComponentProps<'ul'>, keyof IListboxListProps> {}

/** Item height in px: py-3 (24px) + text-sm line-height (~20px) */
const ITEM_HEIGHT = 44
/** Container padding in px: p-1 (4px each side) */
const LIST_PADDING = 8
/** Show 6 full items + 7th cut in half as a scroll hint (per Figma spec) */
const MAX_VISIBLE_ITEMS = 6.5
const MAX_HEIGHT = MAX_VISIBLE_ITEMS * ITEM_HEIGHT + LIST_PADDING

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
        'list-none overflow-y-auto shadow-md',
        className
      )}
      {...rest}
      style={{ ...rest.style, maxHeight: MAX_HEIGHT }}
    >
      {children}
    </ul>
  )
}
