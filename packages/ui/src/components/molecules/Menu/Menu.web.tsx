import { useCallback, useId, useMemo, useRef, useState } from 'react'

import { cn } from '#Lib/cn'

import { ListboxList } from '../Listbox/ListboxList.web'

import { MenuContext } from './MenuContext'
import { MenuItem } from './MenuItem.web'

import type { IMenuProps } from './Menu'
import type { KeyboardEvent } from 'react'

/** Internal entry for registered menu items */
interface ItemEntry {
  /** Item value for selection */
  value: string
  /** Whether the item is non-interactive */
  disabled: boolean
}

/**
 * Web Menu compound component — keyboard-navigable listbox.
 *
 * Supports ArrowUp/Down (with wrap), Home, End, Enter, Space to select,
 * and Escape to close. Uses `aria-activedescendant` for keyboard focus.
 */
function Menu({
  selectedValue,
  variant = 'light',
  onSelect,
  onClose,
  className,
  children,
  accessibilityLabel,
}: Readonly<IMenuProps>) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const itemsRef = useRef<Map<number, ItemEntry>>(new Map())
  const menuId = useId()

  /** Registers an item in the keyboard navigation registry */
  const registerItem = useCallback(
    (index: number, value: string, disabled: boolean) => {
      itemsRef.current.set(index, { value, disabled })
    },
    []
  )

  /** Removes an item from the keyboard navigation registry */
  const unregisterItem = useCallback((index: number) => {
    itemsRef.current.delete(index)
  }, [])

  /** Generates a unique DOM id for aria-activedescendant */
  const getItemId = useCallback(
    (index: number) => `${menuId}-item-${String(index)}`,
    [menuId]
  )

  /** @returns Sorted indices of non-disabled items for keyboard traversal */
  const getEnabledIndices = useCallback(() => {
    const entries = Array.from(itemsRef.current.entries()).sort(
      ([a], [b]) => a - b
    )
    return entries.filter(([, entry]) => !entry.disabled).map(([idx]) => idx)
  }, [])

  /** Forwards selection to the parent callback */
  const handleSelect = useCallback(
    (value: string) => {
      onSelect?.(value)
    },
    [onSelect]
  )

  /** Handles keyboard navigation: Arrow, Home, End, Enter, Space, Escape */
  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const enabled = getEnabledIndices()
    if (enabled.length === 0) return

    const currentPos = enabled.indexOf(activeIndex)

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        const next =
          currentPos < enabled.length - 1 ? enabled[currentPos + 1] : enabled[0]
        setActiveIndex(next)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prev =
          currentPos > 0 ? enabled[currentPos - 1] : enabled[enabled.length - 1]
        setActiveIndex(prev)
        break
      }
      case 'Home': {
        e.preventDefault()
        setActiveIndex(enabled[0])
        break
      }
      case 'End': {
        e.preventDefault()
        setActiveIndex(enabled[enabled.length - 1])
        break
      }
      case 'Enter':
      case ' ': {
        e.preventDefault()
        if (activeIndex >= 0) {
          const entry = itemsRef.current.get(activeIndex)
          if (entry && !entry.disabled) handleSelect(entry.value)
        }
        break
      }
      case 'Escape': {
        e.preventDefault()
        onClose?.()
        break
      }
    }
  }

  const activeDescendant = activeIndex >= 0 ? getItemId(activeIndex) : undefined

  const contextValue = useMemo(
    () => ({
      activeIndex,
      selectedValue,
      variant,
      onSelect: handleSelect,
      registerItem,
      unregisterItem,
      getItemId,
      menuId,
    }),
    [
      activeIndex,
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
        accessibilityLabel={accessibilityLabel}
        tabIndex={0}
        aria-activedescendant={activeDescendant}
        onKeyDown={handleKeyDown}
        className={cn('m-0 focus:outline-none', className)}
      >
        {children}
      </ListboxList>
    </MenuContext.Provider>
  )
}

Menu.Item = MenuItem

export { Menu }
