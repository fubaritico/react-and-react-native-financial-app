import { useContext, useEffect } from 'react'

import { ListboxItem } from '../Listbox/ListboxItem.native'

import { MenuContext } from './MenuContext'

import type { IMenuItemProps } from './Menu'

/**
 * Native Menu.Item — wraps ListboxItem with context-driven selected state.
 * Registers itself in the parent Menu's item registry.
 */
export function MenuItem({
  value,
  disabled = false,
  destructive = false,
  children,
  index,
}: Readonly<IMenuItemProps>) {
  const context = useContext(MenuContext)
  if (!context) throw new Error('Menu.Item must be used within Menu')

  const { selectedValue, variant, onSelect, registerItem, unregisterItem } =
    context

  const isSelected = selectedValue === value

  useEffect(() => {
    registerItem(index, value, disabled)
    return () => {
      unregisterItem(index)
    }
  }, [index, value, disabled, registerItem, unregisterItem])

  return (
    <ListboxItem
      variant={variant}
      isSelected={isSelected}
      disabled={disabled}
      destructive={destructive}
      onPress={() => {
        if (!disabled) onSelect(value)
      }}
    >
      {children}
    </ListboxItem>
  )
}
