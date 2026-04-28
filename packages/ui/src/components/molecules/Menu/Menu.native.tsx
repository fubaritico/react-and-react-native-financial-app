import { useCallback, useId, useMemo, useRef } from 'react'

import { ListboxList } from '../Listbox/ListboxList.native'

import { MenuContext } from './MenuContext'
import { MenuItem } from './MenuItem.native'

import type { IMenuProps } from './Menu'

/** Internal entry for registered menu items */
interface ItemEntry {
  /** Item value for selection */
  value: string
  /** Whether the item is non-interactive */
  disabled: boolean
}

/**
 * Native Menu compound component — scrollable list of selectable items.
 * No keyboard navigation on native — selection is touch-driven.
 */
function Menu({
  selectedValue,
  variant = 'light',
  onSelect,
  children,
  className,
  accessibilityLabel,
}: Readonly<IMenuProps>) {
  const itemsRef = useRef<Map<number, ItemEntry>>(new Map())
  const menuId = useId()

  /** Registers an item in the item registry */
  const registerItem = useCallback(
    (index: number, value: string, disabled: boolean) => {
      itemsRef.current.set(index, { value, disabled })
    },
    []
  )

  /** Removes an item from the item registry */
  const unregisterItem = useCallback((index: number) => {
    itemsRef.current.delete(index)
  }, [])

  /** Generates a unique id for an item */
  const getItemId = useCallback(
    (index: number) => `${menuId}-item-${String(index)}`,
    [menuId]
  )

  /** Forwards selection to the parent callback */
  const handleSelect = useCallback(
    (value: string) => {
      onSelect?.(value)
    },
    [onSelect]
  )

  const contextValue = useMemo(
    () => ({
      activeIndex: -1,
      selectedValue,
      variant,
      onSelect: handleSelect,
      registerItem,
      unregisterItem,
      getItemId,
      menuId,
    }),
    [
      selectedValue,
      variant,
      handleSelect,
      registerItem,
      unregisterItem,
      getItemId,
      menuId,
    ]
  )

  return (
    <MenuContext.Provider value={contextValue}>
      <ListboxList
        variant={variant}
        className={className}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </ListboxList>
    </MenuContext.Provider>
  )
}

Menu.Item = MenuItem

export { Menu }
