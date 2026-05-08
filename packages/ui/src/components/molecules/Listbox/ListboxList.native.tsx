import { ScrollView } from 'react-native'

import tw from '#Lib/tw'

import { listboxListVariants } from './Listbox.variants'

import type { IListboxListProps } from './Listbox'

/** Item height in px: py-3 (24px) + text-sm line-height (~20px) */
const ITEM_HEIGHT = 44
/** Container padding in px: p-1 (4px each side) */
const LIST_PADDING = 8
/** Show 6 full items + 7th cut in half as a scroll hint (per Figma spec) */
const MAX_VISIBLE_ITEMS = 6.5
const MAX_HEIGHT = MAX_VISIBLE_ITEMS * ITEM_HEIGHT + LIST_PADDING

/**
 * Native ListboxList — styled ScrollView container for listbox-style dropdowns.
 * Mirrors the web `<ul role="listbox">` with equivalent styling.
 */
export function ListboxList({
  variant = 'light',
  children,
  className,
  accessibilityLabel,
  shape = 'square',
}: Readonly<IListboxListProps>) {
  return (
    <ScrollView
      accessibilityRole="menu"
      accessibilityLabel={accessibilityLabel}
      style={[
        tw`${listboxListVariants({ variant, shape })} ${className ?? ''}`,
        { maxHeight: MAX_HEIGHT },
      ]}
    >
      {children}
    </ScrollView>
  )
}
