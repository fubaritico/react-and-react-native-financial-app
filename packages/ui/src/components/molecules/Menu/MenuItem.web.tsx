import { useContext, useEffect, useRef } from 'react'

import { ListboxItem } from '../Listbox/ListboxItem.web'

import { MenuContext } from './MenuContext'

import type { IMenuItemProps } from './Menu'

/**
 * Web Menu.Item — wraps ListboxItem with context-driven active/selected state.
 * Registers itself in the parent Menu's item registry for keyboard traversal.
 */
export function MenuItem({
  value,
  disabled = false,
  children,
  index,
  className,
}: Readonly<IMenuItemProps>) {
  const context = useContext(MenuContext)
  if (!context) throw new Error('Menu.Item must be used within Menu')

  const {
    activeIndex,
    selectedValue,
    variant,
    onSelect,
    registerItem,
    unregisterItem,
    getItemId,
  } = context
  const ref = useRef<HTMLLIElement>(null)

  const isActive = activeIndex === index
  const isSelected = selectedValue === value
  const itemId = getItemId(index)

  useEffect(() => {
    registerItem(index, value, disabled)
    return () => {
      unregisterItem(index)
    }
  }, [index, value, disabled, registerItem, unregisterItem])

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ block: 'nearest' })
    }
  }, [isActive])

  return (
    <ListboxItem
      ref={ref}
      id={itemId}
      variant={variant}
      isActive={isActive}
      isSelected={isSelected}
      disabled={disabled}
      className={className}
      onPress={() => {
        if (!disabled) onSelect(value)
      }}
    >
      {children}
    </ListboxItem>
  )
}
