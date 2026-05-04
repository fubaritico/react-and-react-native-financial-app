import { ScrollView } from 'react-native'

import tw from '#Lib/tw'

import { listboxListVariants } from './Listbox.variants'

import type { IListboxListProps } from './Listbox'

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
      style={tw`${listboxListVariants({ variant, shape })} max-h-60 ${className ?? ''}`}
    >
      {children}
    </ScrollView>
  )
}
