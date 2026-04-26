import { createContext } from 'react'

import type { ListboxVariant } from '../Listbox/Listbox'

/** Shared state for Menu compound sub-components */
export interface IMenuContextValue {
  /** Index of the keyboard-focused item */
  activeIndex: number
  /** Currently selected value */
  selectedValue: string | undefined
  /** Color scheme */
  variant: ListboxVariant
  /** Callback to select an item */
  onSelect: (value: string) => void
  /** Register an item for keyboard navigation */
  registerItem: (index: number, value: string, disabled: boolean) => void
  /** Unregister an item on unmount */
  unregisterItem: (index: number) => void
  /** Generate a unique DOM id for an item (used by aria-activedescendant) */
  getItemId: (index: number) => string
  /** Stable id prefix for the menu */
  menuId: string
}

export const MenuContext = createContext<IMenuContextValue | null>(null)
