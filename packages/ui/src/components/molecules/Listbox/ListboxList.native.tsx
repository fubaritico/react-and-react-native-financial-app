import { ScrollView } from 'react-native'

import tw from '../../../lib/tw'

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
}: IListboxListProps) {
  return (
    <ScrollView
      accessibilityRole="menu"
      accessibilityLabel={accessibilityLabel}
      style={tw`${listboxListVariants({ variant })} max-h-60 ${className ?? ''}`}
    >
      {children}
    </ScrollView>
  )
}
